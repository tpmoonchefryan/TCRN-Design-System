#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
// TCRN-DS-STORY-131 (TCRN-DS-SUB-034) — the eight G+ canvas measurements, plus the overlap check, as a
// browser gate on the static docs.
//
// The measurements come from scripts/lib/gplus-measure.mjs (a port of
// docs/design/gplus-2026-10/measure.js); story pages are found with scripts/lib/storybook-routes.mjs.
// This file owns the thresholds:
//   clip           0 elements outside their clipping ancestor (0.5px tolerance)
//   singleLine     1 line box for every element declared single-line
//   shadowBlur     box-shadow blur <= 3px
//   rail           rail guides at 16px and rail text at 48px from the shell edge (0.5px tolerance); since
//                  the top-band shell no G+ story has a side rail, so rail runs on its fixtures only
//   rowAlign       first-cell text start of every table / list row identical (spread <= 0.5px)
//   mark           0 marks that change typesetting
//   contrast       every data-cell within 0.05 of its data-expect; text >= 4.5, other kinds >= 3 unless exempt
//   controlHeight  declared control heights match (0.5px) and are 28, 32 or 40
//   overlap        0 intersecting grid / flex siblings (more than 1px on both axes)
//   shellFrame     the top-band shell's frame (TCRN-DS-SUB-134; was composition one's, TCRN-DS-SUB-094): in
//                  every shell root [data-shell][data-state] the top band [data-shell-strip] is 52px tall
//                  with no rule and no fill, the paper [data-paper] starts 52px below the shell's top and
//                  sits 12px from its start, end and bottom edges, every paper corner is rounded 14px
//                  (0.5px tolerance); 131's "eight" reads as every required check, ten with this
//
// Every run starts with the fixture self-check (tests/fixtures/geometry-measure/manifest.json): each
// check must turn red on its injected violation and stay green on the clean pages, in the Chromium that
// is about to measure the stories. Then each G+ matrix and sample story is opened on its category page
// in every theme and measured inside its rendered region (the documentation chrome around it is not
// measured). STORY_MUTATIONS injects a mutation on a real story for STORY-131 GWT1-3 and for contrast
// (each must turn its check red); REQUIRED_CHECKS names the checks each story must exercise (an n/a
// there fails) and, in a full run, every check must apply somewhere in the set; STORY_PROBES judges the
// ButtonGroup focus ring, the DatePicker indicator hit and the Highlight width (decomposition P31), the
// 1.25px stroke of the 16px icons (124-GWT1) and the focus ring of the paper's scrolling region on the
// real top-band shell (140, TCRN-DS-SUB-213). A probe's story need not be in the measured set: in a full
// run its route is resolved on its own, and the story is read once its shell blocks have hydrated.
// The report (--write-report) goes to docs/verification/geometry-measure/report.json.
//
// Usage: node scripts/geometry-measure-proof.mjs [--self-check-only] [--story <id>]... [--family <name>] [--write-report]
//   Run from the repository root after `pnpm build` (the static docs and the built registry must
//   exist; --self-check-only needs neither). Prints the JSON report; exit code 1 when not ok.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { CHECK_IDS, MEASURE_SCHEMA_VERSION, assertThresholds, compositeOver, contrastRatio, parseColor, runMeasureTargets, startStaticServer } from "./lib/gplus-measure.mjs";
import { GPLUS_STORY_IDS, STATIC_DOCS_ROOT, STORY_REGISTRY_MODULE, expandStory, loadStoryRegistry, resolveStoryRoutes, storyUrl } from "./lib/storybook-routes.mjs";

// TCRN-DS-SUB-035 wiring. The measured set is the G+ matrix and sample stories (cross-package convention
// 7) plus any other registry story in a gplus-* category; a fixed id the registry does not have is
// reported missing and fails the run (the samples land with W5-A). --family <name> measures one family.

export const SCHEMA_VERSION = "tcrn.ds.geometry-measure-proof.v1";

function deepFreeze(value) {
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) deepFreeze(item);
    Object.freeze(value);
  }
  return value;
}

export const THRESHOLDS = deepFreeze({
  clip: { maxLeaks: 0, tolerancePx: 0.5 },
  singleLine: { maxLines: 1 },
  shadowBlur: { maxBlurPx: 3 },
  rail: { guideLeftPx: 16, textLeftPx: 48, tolerancePx: 0.5 },
  rowAlign: { maxSpreadPx: 0.5 },
  mark: { maxViolations: 0 },
  contrast: { maxDiff: 0.05, minText: 4.5, minNonText: 3 },
  controlHeight: { allowedPx: [28, 32, 40], tolerancePx: 0.5 },
  overlap: { maxOverlaps: 0, minIntersectPx: 1 },
  shellFrame: { paperInsetPx: 12, topBarHeightPx: 52, paperRadiusPx: 14, tolerancePx: 0.5 }
});

export const DEFAULT_PATHS = Object.freeze({
  staticRoot: STATIC_DOCS_ROOT,
  registryModule: STORY_REGISTRY_MODULE,
  fixtureManifest: "tests/fixtures/geometry-measure/manifest.json",
  reportPath: "docs/verification/geometry-measure/report.json"
});

export const DEFAULT_RUN = deepFreeze({ viewport: { width: 1440, height: 900 }, themes: ["light", "dark"], locale: "en" });

export const GPLUS_FAMILIES = deepFreeze(Object.fromEntries(["typography", "icon", "brand", "actions", "inputs"].map((family) => [family, GPLUS_STORY_IDS.filter((id) => id.startsWith(`${family}-`))])));

// storyId -> check ids the story must exercise (status n/a fails), per board (C-12). Every story must
// exercise the four checks any rendered page has. The matrices add their data-cell state grids
// (contrast); typography adds its marks, actions its state-grid table rows (rowAlign), and actions and
// inputs their declared control heights (data-h 28 / 32 / 40, SUB-074). The samples carry no data-cell,
// so contrast is not theirs. Since TCRN-DS-SUB-134 every sample is the package ProductShell in its one
// state, the top band and the paper (MIN-20261013-SHELL D1): each must exercise the shell's frame (band
// 52 with no rule and no fill, paper 52 from the top and 12 from the other edges, radius 14), and the
// four with TableShell rows (every sample but inputs-sample-members) their row alignment. The side rail
// and its guide column (rail 16 / 48) are gone with composition one, so no sample requires rail and each
// sample shell opts out of it with data-measure-skip="rail" (INIT-016 R1 decomposition problem 24, second
// choice; the full menu's guide column 16 / 48 is read by scripts/shell-measure-proof.mjs as prail). The
// composition three sample (a gplus-samples registry story outside the ten fixed ids) is the same shell
// with its page centred at the content width: no TableShell rows and no data-cell, so it must exercise
// the any-page four and the frame. The board rows of docs/design/gplus-2026-10/storybook-map.json list
// the same checks (the any-page four aside). In a full run every check but rail must also apply
// somewhere in the set (SET_REQUIRED_CHECKS); rail keeps its red and green fixtures in the self-check.
const ANY_PAGE_CHECKS = ["clip", "singleLine", "shadowBlur", "overlap"];
const MATRIX_CHECKS = [...ANY_PAGE_CHECKS, "contrast"];
const SAMPLE_CHECKS = [...ANY_PAGE_CHECKS, "shellFrame"];
export const REQUIRED_CHECKS = deepFreeze({
  "typography-matrix": [...MATRIX_CHECKS, "mark"],
  "icon-matrix": [...MATRIX_CHECKS],
  "brand-matrix": [...MATRIX_CHECKS],
  "actions-matrix": [...MATRIX_CHECKS, "rowAlign", "controlHeight"],
  "inputs-matrix": [...MATRIX_CHECKS, "controlHeight"],
  "typography-sample-billing": [...SAMPLE_CHECKS, "rowAlign"],
  "icon-sample-project": [...SAMPLE_CHECKS, "rowAlign"],
  "brand-sample-product": [...SAMPLE_CHECKS, "rowAlign"],
  "actions-sample-project": [...SAMPLE_CHECKS, "rowAlign"],
  "inputs-sample-members": [...SAMPLE_CHECKS],
  "composition-three-sample": [...ANY_PAGE_CHECKS, "shellFrame"]
});
export const SET_REQUIRED_CHECKS = deepFreeze(CHECK_IDS.filter((id) => id !== "rail"));

// { id, storyId, check, css, theme?, source } — injected on the real story; check must turn red.
// STORY-131 GWT1: the package has no .tcrn-table yet (decomposition P17), so the row mutation uses the
// TableShell rows of table-record-index-spec (no row there is selected; the first body row stands in).
export const STORY_MUTATIONS = deepFreeze([
  { id: "row-first-cell-padding", storyId: "table-record-index-spec", check: "rowAlign", source: "131-GWT1", css: ".tcrn-table-shell [role=\"row\"]:nth-child(2) > :first-child { padding-left: 8px !important; }" },
  { id: "mark-padding", storyId: "typography-matrix", check: "mark", source: "131-GWT2", css: "mark { padding: 2px !important; }" },
  { id: "shadow-blur-4px", storyId: "actions-matrix", check: "shadowBlur", source: "131-GWT3", css: ".story-body .tcrn-button { box-shadow: 0 1px 4px rgba(22, 21, 15, 0.2) !important; }" },
  { id: "cell-ink-drift", storyId: "actions-matrix", check: "contrast", source: "131 contrast", css: ".story-body .tcrn-button.tcrn-button--primary { color: rgb(120, 200, 190) !important; }" },
  // TCRN-DS-SUB-134 (148-GWT3; was SUB-094's paper inset and top bar 68): the paper flush with the
  // shell's edges, a 1px rule under the top band and the band back at the old top bar's 68 each turn
  // shellFrame red on a real sample.
  { id: "shell-paper-inset-zero", storyId: "icon-sample-project", check: "shellFrame", source: "148 paper inset", css: "[data-shell] [data-paper] { margin: 0 !important; }" },
  { id: "shell-top-band-rule", storyId: "icon-sample-project", check: "shellFrame", source: "148-GWT3 top band rule", css: "[data-shell] [data-shell-strip] { border-bottom: 1px solid #d9d6cc !important; }" },
  { id: "shell-top-band-68", storyId: "icon-sample-project", check: "shellFrame", source: "148 top band height", css: "[data-shell] [data-shell-strip] { block-size: 68px !important; min-block-size: 68px !important; }" }
]);

// Relations the eight checks do not cover, judged in the browser (decomposition P31): the ButtonGroup
// focus ring is not clipped (125-GWT4), a click on the right 30px of a DatePicker lands on the native
// calendar indicator (126-GWT4; headless Chromium opens no system calendar, so the hit test stands in),
// a Highlight keeps the width of its plain text (123-GWT2), and the 16px icons are stroked 1.25px
// (124-GWT1, ICON_STROKE). paperFocusRing runs the focus ring probe on a story with real product
// shells (TCRN-DS-SUB-213; 140, SUB-182 criterion 3): actions-matrix has no ProductShell, so there the
// probe reads no paper region. shell-top-band is the 07a board's band (ts-closed-l and its screens),
// a hydrated story outside GPLUS_STORY_IDS, so a full run resolves its route for the probe alone.
export const STORY_PROBES = deepFreeze([
  { id: "buttonGroupFocusRing", storyId: "actions-matrix", source: "125-GWT4" },
  { id: "datePickerIndicatorHit", storyId: "inputs-matrix", source: "126-GWT4" },
  { id: "highlightWidth", storyId: "typography-matrix", source: "123-GWT2" },
  { id: "iconStroke", storyId: "icon-matrix", source: "124-GWT1" },
  { id: "paperFocusRing", storyId: "shell-top-band", source: "140 SUB-182" }
]);

// 124-GWT1 on the icon-matrix 16px row: the roster renders every icon at 14, 16 and 20 px and marks
// each rendition with data-gplus-icon-size. Each 16px icon must render 16px square, and every child
// (svg.tcrn-icon > *) must compute stroke-width 1.25px with vector-effect non-scaling-stroke, which
// keeps the 1.25 in screen pixels whatever the viewBox scale (SVG does not inherit vector-effect, so
// each child carries it).
export const ICON_STROKE = deepFreeze({ iconSelector: 'svg.tcrn-icon[data-gplus-icon-size="16"]', sizePx: 16, strokeWidthPx: 1.25, vectorEffect: "non-scaling-stroke", tolerancePx: 0.01 });

// Browser side: every button of every ButtonGroup under root is put in its focus preview state; the
// ring (box-shadow extent) must stay inside every clipping ancestor up to root. TCRN-DS-SUB-182
// (140, R2-8, WCAG 2.4.7) adds the paper's scrolling region of every product shell under root
// (.tcrn-product-shell__paper > .tcrn-product-shell__main, which takes keyboard focus to be
// scrolled while the paper clips its overflow): it is focused for real, and its ring is the larger
// of its box-shadow extent and its outline (width plus offset; the forced-colours outline counts,
// because forced colours paint it whatever its colour), so an inset ring or a negative outline offset
// reads 0 and an outward ring is cut by the paper. A region that does not match :focus-visible once
// focused is a violation too: its ring was not read.
export function focusRingClipInPage({ root, tolerancePx = 0.5 }) {
  const scope = document.querySelector(root);
  if (!scope) return { error: "root_not_found" };
  const extentOf = (value) => {
    let extent = 0;
    for (const layer of (value || "").split(/,(?![^(]*\))/)) {
      if (!layer.trim() || layer.includes("inset") || layer.trim() === "none") continue;
      const numbers = (layer.replace(/rgba?\([^)]*\)|#[0-9a-f]+|[a-z-]+\([^)]*\)/gi, " ").match(/-?\d*\.?\d+px|\b0\b/g) || []).map((n) => parseFloat(n));
      const [x = 0, y = 0, blur = 0, spread = 0] = numbers;
      extent = Math.max(extent, Math.max(Math.abs(x), Math.abs(y)) + blur + spread);
    }
    return extent;
  };
  // The deepest cut of a ring by the clipping ancestors of element up to root, or null.
  const cutOf = (element, extent, boundary = scope) => {
    const rect = element.getBoundingClientRect();
    const ring = { left: rect.left - extent, right: rect.right + extent, top: rect.top - extent, bottom: rect.bottom + extent };
    for (let node = element.parentElement; node; node = node.parentElement) {
      const cs = getComputedStyle(node);
      const clipX = cs.overflowX !== "visible";
      const clipY = cs.overflowY !== "visible";
      if (clipX || clipY) {
        const box = node.getBoundingClientRect();
        const inner = { left: box.left + parseFloat(cs.borderLeftWidth), right: box.right - parseFloat(cs.borderRightWidth), top: box.top + parseFloat(cs.borderTopWidth), bottom: box.bottom - parseFloat(cs.borderBottomWidth) };
        const cut = Math.max(clipX ? inner.left - ring.left : 0, clipX ? ring.right - inner.right : 0, clipY ? inner.top - ring.top : 0, clipY ? ring.bottom - inner.bottom : 0);
        if (cut > tolerancePx) return { clippedBy: `${node.tagName.toLowerCase()}.${[...node.classList].slice(0, 2).join(".")}`, cutPx: Math.round(cut * 10) / 10 };
      }
      if (node === boundary) break;
    }
    return null;
  };
  const violations = [];
  let checked = 0;
  for (const group of scope.querySelectorAll(".tcrn-button-group")) {
    for (const button of group.querySelectorAll("button")) {
      const previous = button.getAttribute("data-tcrn-preview-state");
      button.setAttribute("data-tcrn-preview-state", "focus");
      const extent = extentOf(getComputedStyle(button).boxShadow);
      checked += 1;
      const cut = cutOf(button, extent);
      if (cut) violations.push({ button: (button.getAttribute("aria-label") || button.textContent || "").trim().slice(0, 30), extent, ...cut });
      if (previous === null) button.removeAttribute("data-tcrn-preview-state");
      else button.setAttribute("data-tcrn-preview-state", previous);
    }
  }
  let regions = 0;
  const regionReadings = [];
  const before = document.activeElement;
  for (const region of scope.querySelectorAll(".tcrn-product-shell__paper > .tcrn-product-shell__main")) {
    const name = (region.getAttribute("aria-label") || region.id || "paper region").trim().slice(0, 30);
    checked += 1;
    regions += 1;
    region.focus({ preventScroll: true, focusVisible: true });
    if (document.activeElement !== region || !region.matches(":focus-visible")) {
      violations.push({ region: name, reason: "not_focus_visible" });
      continue;
    }
    const cs = getComputedStyle(region);
    const outline = cs.outlineStyle === "none" ? 0 : parseFloat(cs.outlineWidth) + parseFloat(cs.outlineOffset);
    const extent = Math.max(extentOf(cs.boxShadow), outline, 0);
    // The fixed-size screens in the docs gallery intentionally scroll inside alpha-story-stack.
    // That gallery is not the ProductShell's paper. Read every screen's entire focus edge against
    // all of its own clipping ancestors, through the owning shell; outer docs containment has its
    // own shell proof. Otherwise a 1240px screen in a narrower gallery reports its clipped content
    // width (222px in the original failure) as a cut ring even when the ring is fully inset.
    const boundary = region.closest(".tcrn-product-shell") ?? scope;
    const cut = cutOf(region, extent, boundary);
    regionReadings.push({ region: name, focusVisible: true, extent, boundary: boundary === scope ? root : ".tcrn-product-shell", boxShadow: cs.boxShadow, outlineWidth: cs.outlineWidth, outlineOffset: cs.outlineOffset, cut });
    if (cut) violations.push({ region: name, extent, ...cut });
    region.blur();
  }
  if (regions > 0 && before && typeof before.focus === "function") before.focus({ preventScroll: true });
  return { checked, regions, regionReadings, value: violations.length, violationCount: violations.length, violations };
}

// Browser side: each .tcrn-highlight-text under root must be as wide as the same text without marks.
export function highlightWidthInPage({ root, tolerancePx = 0.5 }) {
  const scope = document.querySelector(root);
  if (!scope) return { error: "root_not_found" };
  const violations = [];
  let checked = 0;
  let worst = 0;
  const readings = [];
  for (const el of scope.querySelectorAll(".tcrn-highlight-text")) {
    if (!el.querySelector("mark, .tcrn-highlight__mark")) continue;
    const plain = el.cloneNode(false);
    plain.textContent = el.textContent;
    plain.style.position = "absolute";
    plain.style.visibility = "hidden";
    plain.style.whiteSpace = "nowrap";
    const measured = el.cloneNode(true);
    measured.style.position = "absolute";
    measured.style.visibility = "hidden";
    measured.style.whiteSpace = "nowrap";
    el.parentElement.append(plain, measured);
    const measuredWidth = measured.getBoundingClientRect().width, plainWidth = plain.getBoundingClientRect().width;
    const diff = Math.abs(measuredWidth - plainWidth);
    readings.push({ text: el.textContent, measuredWidth, plainWidth, exactDiff: diff, exactlyEqual: diff === 0 });
    plain.remove();
    measured.remove();
    checked += 1;
    worst = Math.max(worst, diff);
    if (diff > tolerancePx) violations.push({ text: el.textContent.trim().slice(0, 40), diffPx: Math.round(diff * 100) / 100 });
  }
  return { checked, value: Math.round(worst * 100) / 100, exactValue: worst, readings, violationCount: violations.length, violations };
}

// Browser side: every icon matching iconSelector under root must be sizePx square, and every child of
// it must compute stroke-width strokeWidthPx (within tolerancePx) and vector-effect vectorEffect.
// checked counts the icons; value is the largest stroke-width deviation in px.
export function iconStrokeInPage({ root, iconSelector, sizePx, strokeWidthPx, vectorEffect, tolerancePx = 0.01 }) {
  const scope = document.querySelector(root);
  if (!scope) return { error: "root_not_found" };
  const round = (value) => Math.round(value * 100) / 100;
  const violations = [];
  const strokeWidths = new Set();
  const vectorEffects = new Set();
  const icons = [];
  let checked = 0;
  let children = 0;
  let worst = 0;
  for (const svg of scope.querySelectorAll(iconSelector)) {
    checked += 1;
    const icon = svg.getAttribute("data-icon-name") || svg.getAttribute("aria-label") || "";
    const box = svg.getBoundingClientRect();
    icons.push({ name: icon, variant: svg.getAttribute('data-icon-variant'), width: box.width, height: box.height, children: [...svg.children].map((child) => ({ tag: child.tagName, strokeWidth: getComputedStyle(child).strokeWidth, vectorEffect: getComputedStyle(child).vectorEffect, fill: getComputedStyle(child).fill })) });
    if (Math.abs(box.width - sizePx) > 0.5 || Math.abs(box.height - sizePx) > 0.5) violations.push({ icon, reasons: ["size"], widthPx: round(box.width), heightPx: round(box.height) });
    if (svg.children.length === 0) violations.push({ icon, reasons: ["no_children"] });
    for (const child of svg.children) {
      children += 1;
      const cs = getComputedStyle(child);
      strokeWidths.add(cs.strokeWidth);
      vectorEffects.add(cs.vectorEffect);
      const width = parseFloat(cs.strokeWidth);
      const diff = Number.isFinite(width) ? Math.abs(width - strokeWidthPx) : Infinity;
      worst = Math.max(worst, diff);
      const reasons = [];
      if (!(diff <= tolerancePx)) reasons.push("strokeWidth");
      if (cs.vectorEffect !== vectorEffect) reasons.push("vectorEffect");
      if (reasons.length) violations.push({ icon, child: child.tagName.toLowerCase(), strokeWidth: cs.strokeWidth, vectorEffect: cs.vectorEffect, reasons });
    }
  }
  return { checked, children, icons, rosterNames: [...new Set(icons.map((icon) => icon.name))], value: Number.isFinite(worst) ? round(worst) : null, strokeWidths: [...strokeWidths], vectorEffects: [...vectorEffects], violationCount: violations.length, violations: violations.slice(0, 10) };
}

// Node side: the right 30px of every DatePicker input must be its native ::-webkit-calendar-picker-indicator
// (read from the user-agent shadow tree with its box) and a click there must reach the input (no icon or
// wrapper on top: elementFromPoint at the sampled points returns the input).
export async function datePickerIndicatorHit(page, root) {
  const cdp = await page.context().newCDPSession(page);
  const violations = [];
  let checked = 0;
  try {
    await page.addStyleTag({ content: "html,body{scroll-behavior:auto!important}" });
    await cdp.send("DOM.enable");
    const doc = await cdp.send("DOM.getDocument", { depth: 0 });
    const { nodeIds } = await cdp.send("DOM.querySelectorAll", { nodeId: doc.root.nodeId, selector: `${root} input.tcrn-date-picker` });
    for (const [position, nodeId] of nodeIds.entries()) {
      await cdp.send("DOM.scrollIntoViewIfNeeded", { nodeId });
      // Let the scroll land (instant scrolling, two frames) before reading boxes and hit-testing.
      await page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))));
      const { node } = await cdp.send("DOM.describeNode", { nodeId, depth: -1, pierce: true });
      const find = (item) => {
        const attributes = item.attributes ?? [];
        const at = attributes.indexOf("pseudo");
        if (at !== -1 && attributes[at + 1] === "-webkit-calendar-picker-indicator") return item;
        for (const child of [...(item.shadowRoots ?? []), ...(item.children ?? [])]) {
          const found = find(child);
          if (found) return found;
        }
        return null;
      };
      const indicator = find(node);
      checked += 1;
      const boxOf = async (backendNodeId) => {
        const { model } = await cdp.send("DOM.getBoxModel", { backendNodeId });
        const [x1, y1, x2, , , y3] = model.border;
        return { left: x1, right: x2, top: y1, bottom: y3 };
      };
      const input = await boxOf(node.backendNodeId);
      if (!indicator) {
        violations.push({ input: position, reason: "indicator_missing" });
        continue;
      }
      const pick = await boxOf(indicator.backendNodeId);
      const y = (input.top + input.bottom) / 2;
      const points = [input.right - 29, input.right - 15, input.right - 1];
      const covered = points.every((x) => x >= pick.left - 0.5 && x <= pick.right + 0.5) && y >= pick.top && y <= pick.bottom;
      // The click points are taken from the input's live box in the same task as the hit test, so a late
      // anchor scroll cannot separate the two.
      const reached = await page.evaluate(({ selector, index }) => {
        const target = document.querySelectorAll(selector)[index];
        target.scrollIntoView({ block: "center", inline: "nearest", behavior: "instant" });
        const box = target.getBoundingClientRect();
        const cy = (box.top + box.bottom) / 2;
        return [box.right - 29, box.right - 15, box.right - 1].map((x) => document.elementFromPoint(x, cy) === target);
      }, { selector: `${root} input.tcrn-date-picker`, index: position });
      if (!covered || reached.includes(false)) {
        violations.push({ input: position, indicator: { left: pick.left, right: pick.right }, inputRight: input.right, covered, reached });
      }
    }
  } finally {
    await cdp.detach().catch(() => {});
  }
  return { checked, value: violations.length, violationCount: violations.length, violations };
}

// The page-side probes and the options each one is handed next to its root.
const PAGE_PROBES = { buttonGroupFocusRing: focusRingClipInPage, paperFocusRing: focusRingClipInPage, highlightWidth: highlightWidthInPage, iconStroke: iconStrokeInPage };
const PROBE_OPTIONS = { iconStroke: ICON_STROKE };

async function runStoryProbe(probe, page) {
  if (probe.id === "datePickerIndicatorHit") return datePickerIndicatorHit(page, probe.root);
  const fn = PAGE_PROBES[probe.id];
  if (!fn) return { error: `unknown_probe:${probe.id}` };
  return page.evaluate(fn, { ...(PROBE_OPTIONS[probe.id] ?? {}), root: probe.root });
}

// Original criterion captures are raw observations, separate from the existing general-purpose
// verdicts. A 0.5px probe pass, a hit test, or a source token must not silently certify a stricter row.
// Real focus/invalid paint is transitional. Wait for the finite transitions of this control,
// then require consecutive paint readings; no forced pseudo-state or motion override is used.
export async function settleControlPaint(control) {
  return control.evaluate(async (el) => {
    const started = performance.now(), frame = () => new Promise((done) => requestAnimationFrame(done));
    const snapshot = () => { const cs = getComputedStyle(el); return [cs.border, cs.boxShadow, cs.outline, cs.color, cs.backgroundColor].join("|"); };
    snapshot(); await frame();
    const animations = el.getAnimations().filter((a) => { const end = a.effect?.getComputedTiming().endTime; return Number.isFinite(end) && end > 0; });
    let timer, timedOut = false;
    await Promise.race([Promise.all(animations.map((a) => a.finished.catch(() => undefined))), new Promise((done) => { timer = setTimeout(() => { timedOut = true; done(); }, 2000); })]);
    clearTimeout(timer);
    let prior = snapshot(), stableFrames = 0;
    for (let i = 0; i < 120 && stableFrames < 3; i++) { await frame(); const next = snapshot(); stableFrames = next === prior ? stableFrames + 1 : 0; prior = next; }
    return { finiteAnimations: animations.length, timedOut, stableFrames, elapsedMs: performance.now() - started };
  });
}

// Default textual controls, with the carrier that actually paints their edge. An RGBA tuple's
// alpha is used only when compositing; relative luminance always has exactly three channels.
export function defaultTextControlsInPage(root) {
  const scope = document.querySelector(root), readings = [], excluded = [];
  const rgba = (s) => { const a = s.match(/[\d.]+/g)?.map(Number) ?? []; return a.length === 3 ? [...a, 1] : a; };
  const over = (a, b) => a.slice(0, 3).map((v, i) => v * a[3] + b[i] * (1 - a[3]));
  const lum = (a) => a.slice(0, 3).map((v) => v / 255).map((v) => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
  const visible = (el) => { const cs = getComputedStyle(el), r = el.getBoundingClientRect(); return el.getClientRects().length > 0 && r.width > 0 && r.height > 0 && cs.display !== "none" && cs.visibility !== "hidden" && !el.closest('[aria-hidden="true"],.tcrn-sr-only'); };
  for (const el of scope.querySelectorAll('input,textarea,select,button.tcrn-select')) {
    if (['checkbox','radio'].includes(el.type)) continue;
    const identity = { element: el.tagName, type: el.type, classes: el.className, cell: el.getAttribute('data-cell'), theme: el.closest('[data-tcrn-theme]')?.getAttribute('data-tcrn-theme') };
    const reason = el.closest('[data-gplus-style-reference]') ? 'additional style-reference specimen; not an original default-edge fixture' : el.type === 'hidden' || !visible(el) ? 'hidden value/control' : el.disabled ? 'disabled' : el.readOnly ? 'read-only' : el.closest('[aria-invalid="true"]') ? 'invalid' : el.closest('[data-tcrn-preview-state]') ? 'preview state' : null;
    if (reason) { excluded.push({ ...identity, reason }); continue; }
    const edgeOf = (node) => {
      const cs = getComputedStyle(node);
      const shadowColor = cs.boxShadow.split(/,(?![^(]*\))/).map((layer) => ({ layer, color: layer.match(/rgba?\([^)]*\)/)?.[0] })).find((entry) => entry.color && /(?:^|\s)1px(?:\s|$)/.test(entry.layer));
      return parseFloat(cs.borderBottomWidth) > 0 && cs.borderBottomStyle !== 'none' ? cs.borderBottomColor : shadowColor?.color;
    };
    const searchWrapper = el.closest('.tcrn-search-input');
    const candidates = [el, ...(searchWrapper && searchWrapper !== el ? [searchWrapper] : [])];
    const paint = candidates.find((node) => edgeOf(node)) ?? el, cs = getComputedStyle(paint);
    const line = cs.getPropertyValue('--tcrn-color-line-ctl').trim(), panel = cs.getPropertyValue('--tcrn-color-panel').trim();
    const toRgb = (color) => { const probe = document.createElement('span'); probe.style.color = color; paint.parentElement.append(probe); const value = rgba(getComputedStyle(probe).color); probe.remove(); return value; };
    const paintedEdge = edgeOf(paint);
    const carrier = toRgb(panel).slice(0, 3), edge = paintedEdge ? over(toRgb(paintedEdge), carrier) : null, a = edge ? lum(edge) : null, b = lum(carrier);
    const ratio = a === null ? null : (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
    // SOURCE-RECONCILE D1 applies only to the two original, observable SearchInput
    // tool specimens. Identity, public structure and actual default wash/borderless
    // state are conjuncts; a type=search or missing paint alone grants nothing.
    const expectedCell = identity.theme === 'light' ? 'search-ph-l' : identity.theme === 'dark' ? 'search-ph-n' : null;
    const expectedWash = identity.theme === 'light' ? [22, 21, 15, .06] : [235, 232, 223, .07];
    const actualWash = rgba(getComputedStyle(el).backgroundColor);
    const borderlessRole = identity.cell === expectedCell && expectedCell !== null
      && scope.querySelectorAll(`[data-cell="${expectedCell}"]`).length === 1
      && el.matches('input.tcrn-input.tcrn-search-input__control[type="search"]')
      && el.closest('[data-gplus-matrix-component="SearchInput"]') !== null
      && searchWrapper?.getAttribute('data-search-input') === 'true'
      && searchWrapper.querySelector('.tcrn-search-input__icon svg[data-icon-name="search"]') !== null
      && !el.matches(':focus') && !searchWrapper.matches(':hover,:focus-within')
      && candidates.every((node) => ['Top','Right','Bottom','Left'].every((side) => parseFloat(getComputedStyle(node)[`border${side}Width`]) === 0) && !edgeOf(node))
      && actualWash.length === 4 && actualWash.every((value, index) => value === expectedWash[index]);
    const applicability = borderlessRole
      ? { status: 'n/a', role: 'approved-borderless-SearchInput-tool', decision: 'TCRN-DS-MIN-20261031-SOURCE-RECONCILE#D1', validated: true }
      : { status: 'applicable' };
    readings.push({ ...identity, paintCarrier: { element: paint.tagName, classes: paint.className }, carrierCandidates: candidates.map((node) => ({ element: node.tagName, classes: node.className, border: getComputedStyle(node).border, shadow: getComputedStyle(node).boxShadow, paintedEdge: edgeOf(node) ?? null })), border: cs.border, shadow: cs.boxShadow, lineCtl: line, paintedEdge: paintedEdge ?? null, panel, edge, carrier, ratio, finite: Number.isFinite(ratio), applicability, missingPaint: paintedEdge ? null : 'No visible default border or one-pixel shadow on the control or its SearchInput wrapper', requiredMinimum: 3.1 });
  }
  const applicable = readings.filter((r) => r.applicability.status === 'applicable');
  const notApplicable = readings.filter((r) => r.applicability.status === 'n/a');
  return { readings, applicable, notApplicable, excluded, minimum: applicable.length && applicable.every((r) => r.finite) ? Math.min(...applicable.map((r) => r.ratio)) : null };
}

export function evaluateDefaultTextControlEdges({ readings }) {
  const applicable = readings.filter((r) => r.applicability?.status !== 'n/a');
  const notApplicable = readings.filter((r) => r.applicability?.status === 'n/a');
  const problems = [];
  if (applicable.length !== 16) problems.push('expected16originalOrdinaryControls');
  for (const [theme, suffix] of [['light', 'l'], ['dark', 'n']]) {
    for (const [element, type, cell, requiredClass] of [
      ['INPUT', 'text', `in-ph-${suffix}`, 'tcrn-input'], ['INPUT', 'text', `in-text-${suffix}`, 'tcrn-input'],
      ['TEXTAREA', 'textarea', null, 'tcrn-textarea'], ['INPUT', 'text', null, 'tcrn-input'],
      ['SELECT', 'select-one', null, 'tcrn-select'], ['BUTTON', 'button', null, 'tcrn-multi-select-dropdown__trigger'],
      ['INPUT', 'number', `num-${suffix}`, 'tcrn-number-input'], ['INPUT', 'date', `date-${suffix}`, 'tcrn-date-picker']
    ]) {
      if (applicable.filter((r) => r.theme === theme && r.element === element && r.type === type && r.cell === cell && r.classes.split(/\s+/).includes(requiredClass)).length !== 1) problems.push(`unobservedOrDuplicate:${theme}:${cell ?? type}`);
    }
  }
  if (notApplicable.length !== 2 || ['search-ph-l', 'search-ph-n'].some((id) => notApplicable.filter((r) => r.cell === id).length !== 1)) problems.push('expectedTwoNamedSearchInputRoles');
  for (const r of applicable) if (!r.finite || !Number.isFinite(r.ratio) || r.ratio < 3.1) problems.push(`ordinaryEdge:${r.cell ?? r.type}`);
  for (const r of notApplicable) if (r.applicability.validated !== true || r.applicability.role !== 'approved-borderless-SearchInput-tool' || r.ratio !== null || r.paintedEdge !== null) problems.push(`invalidNotApplicable:${r.cell}`);
  return { ok: problems.length === 0, problems, ordinaryCount: applicable.length, notApplicableCount: notApplicable.length, minimum: applicable.length && applicable.every((r) => r.finite) ? Math.min(...applicable.map((r) => r.ratio)) : null };
}

export async function captureGeometryCriteria(page, { root, storyId, artifactRoot = null } = {}) {
  const output = { storyId, root, viewport: page.viewportSize(), unknowns: [] };
  if (storyId === "typography-matrix") output.typography = await page.evaluate((root) => {
    const scope = document.querySelector(root);
    const tuple = (el) => { const cs = getComputedStyle(el); return { text: el.textContent, classes: el.className, theme: el.closest('[data-tcrn-theme]')?.getAttribute('data-tcrn-theme'), plainNumeral: el.classList.contains('tcrn-text--numeral') && !el.classList.contains('tcrn-text--numeral-inline'), family: cs.fontFamily, weight: cs.fontWeight, numeric: cs.fontVariantNumeric, fontCheck: document.fonts.check(`${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`, el.textContent) }; };
    const headings = Array.from(scope.querySelectorAll('.tcrn-heading')).map((el) => {
      const prior = el.getAttribute('style');
      el.style.inlineSize = '80px'; el.style.maxInlineSize = '80px'; el.style.minInlineSize = '0';
      const cs = getComputedStyle(el), range = document.createRange(); range.selectNodeContents(el);
      const reading = { ...tuple(el), title: el.getAttribute('title'), width: el.clientWidth, scrollWidth: el.scrollWidth, actualOverflow: el.scrollWidth > el.clientWidth, whiteSpace: cs.whiteSpace, overflow: cs.overflow, textOverflow: cs.textOverflow, lineBoxes: [...new Set(Array.from(range.getClientRects()).map((r) => r.y))].length };
      if (prior === null) el.removeAttribute('style'); else el.setAttribute('style', prior);
      return reading;
    });
    return { headings, numerals: Array.from(scope.querySelectorAll('.tcrn-text')).filter((el) => el.textContent.trim() === '4,280.00').map(tuple) };
  }, root);

  if (storyId === "actions-matrix") {
    output.pressed = [];
    const buttons = page.locator(`${root} button.tcrn-button:not(:disabled)`);
    for (let index = 0; index < await buttons.count(); index += 1) {
      const button = buttons.nth(index);
      if (!await button.isVisible()) continue;
      await button.scrollIntoViewIfNeeded(); const box = await button.boundingBox();
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.down();
      try { output.pressed.push(await button.evaluate((el) => ({ text: el.textContent, classes: el.className, active: el.matches(':active'), transform: getComputedStyle(el).transform, theme: el.closest('[data-tcrn-theme]')?.getAttribute('data-tcrn-theme') }))); }
      finally { await page.mouse.up(); }
    }
    output.buttonGroups = [];
    const groups = page.locator(`${root} .tcrn-button-group`);
    for (let index = 0; index < await groups.count(); index += 1) {
      const group = groups.nth(index), first = group.locator('button:not(:disabled)').nth(0);
      if (!await first.isVisible() || await group.locator('button:not(:disabled)').count() < 2) continue;
      await first.scrollIntoViewIfNeeded(); await page.mouse.move(0, 0); await first.focus(); await page.keyboard.press('Tab');
      const paintSettled = await settleControlPaint(group.locator('button:not(:disabled)').nth(1));
      const reading = await group.evaluate((el) => {
        const buttons = [...el.querySelectorAll('button:not(:disabled)')], focused = document.activeElement, cs = getComputedStyle(focused);
        return { activeIndex: buttons.indexOf(focused), focusVisible: focused.matches(':focus-visible'), hover: focused.matches(':hover'), theme: focused.closest('[data-tcrn-theme]')?.getAttribute('data-tcrn-theme'), shadow: cs.boxShadow, outline: cs.outline, outlineOffset: cs.outlineOffset, zIndex: cs.zIndex, groupOverflow: getComputedStyle(el).overflow, rect: focused.getBoundingClientRect().toJSON(), siblings: buttons.map((button) => ({ rect: button.getBoundingClientRect().toJSON(), zIndex: getComputedStyle(button).zIndex })) };
      });
      reading.paintSettled = paintSettled;
      if (artifactRoot) { mkdirSync(artifactRoot, { recursive: true }); reading.screenshot = join(artifactRoot, `button-group-${index}.png`); await page.screenshot({ path: reading.screenshot }); }
      reading.probe = await page.evaluate(focusRingClipInPage, { root });
      reading.occlusionEvidence = 'native second-button focus, computed paint order and screenshot; ancestor probe alone does not certify sibling paint';
      output.buttonGroups.push(reading);
    }
  }

  if (storyId === "inputs-matrix") {
    const defaultControls = await page.evaluate(defaultTextControlsInPage, root);
    output.defaultTextControls = defaultControls.applicable;
    output.defaultTextControlsObserved = defaultControls.readings;
    output.defaultTextControlsNotApplicable = defaultControls.notApplicable;
    output.defaultTextControlsVerdict = evaluateDefaultTextControlEdges(defaultControls);
    output.defaultTextControlsExcluded = defaultControls.excluded;
    output.defaultTextControlsMinimum = defaultControls.minimum;
    output.invalidFocus = [];
    output.invalidFocusExcluded = [];
    const controls = page.locator(`${root} input:not(:disabled):not([type=checkbox]):not([type=radio]),${root} textarea:not(:disabled),${root} select:not(:disabled),${root} button.tcrn-multi-select-dropdown__trigger:not(:disabled)`);
    const seen = new Set();
    for (let index = 0; index < await controls.count(); index += 1) {
      const control = controls.nth(index), identity = await control.evaluate((el) => `${el.tagName}/${el.type}/${el.className}/${el.closest('[data-tcrn-theme]')?.getAttribute('data-tcrn-theme')}`);
      const hiddenValue = await control.evaluate((el) => Boolean(el.closest('[aria-hidden="true"],.tcrn-sr-only')));
      if (hiddenValue) { output.invalidFocusExcluded.push({ identity, reason: 'hidden value/control; not the visible painted carrier' }); continue; }
      if (seen.has(identity) || !await control.isVisible()) continue; seen.add(identity);
      const prior = await control.getAttribute('aria-invalid');
      await control.evaluate((el) => el.setAttribute('aria-invalid', 'true'));
      try {
        await page.mouse.move(0, 0); await page.keyboard.press('Tab'); await control.focus();
        const paintSettled = await settleControlPaint(control);
        const invalidReading = await control.evaluate((el) => { const cs = getComputedStyle(el); return { element: el.tagName, type: el.type, classes: el.className, theme: el.closest('[data-tcrn-theme]')?.getAttribute('data-tcrn-theme'), invalid: el.getAttribute('aria-invalid'), active: document.activeElement === el, focusVisible: el.matches(':focus-visible'), border: cs.border, shadow: cs.boxShadow, outline: cs.outline, red: cs.getPropertyValue('--tcrn-color-bad'), teal: cs.getPropertyValue('--tcrn-color-acc') }; });
        output.invalidFocus.push({ ...invalidReading, paintSettled, priorInvalid: prior,
          carrier: invalidReading.classes.includes('tcrn-multi-select-dropdown__trigger') ? 'visible MultiSelect dropdown trigger; aria-invalid is forwarded by the component prop' : 'visible value control' });
      } finally {
        await control.evaluate((el, prior) => { el.blur(); if (prior === null) el.removeAttribute('aria-invalid'); else el.setAttribute('aria-invalid', prior); }, prior);
      }
    }
    output.nativeDatePicker = [];
    const dates = page.locator(`${root} input.tcrn-date-picker:not(:disabled)`);
    for (let index = 0; index < await dates.count(); index += 1) {
      const date = dates.nth(index); if (!await date.isVisible()) continue;
      await date.scrollIntoViewIfNeeded(); const box = await date.boundingBox();
      for (const inset of [29, 15, 1]) {
        await page.keyboard.press('Escape');
        const before = await date.evaluate((el) => ({ open: CSS.supports('selector(:open)') ? el.matches(':open') : false, supportsOpen: CSS.supports('selector(:open)'), hasShowPicker: typeof el.showPicker === 'function' }));
        await page.mouse.click(box.x + box.width - inset, box.y + box.height / 2);
        const after = await date.evaluate((el) => ({ open: CSS.supports('selector(:open)') ? el.matches(':open') : false, active: document.activeElement === el, userActivated: navigator.userActivation.hasBeenActive }));
        output.nativeDatePicker.push({ index, rightInset: inset, box, before, after, openingObserved: before.supportsOpen && !before.open && after.open, limitation: after.open ? null : 'No native picker opening observed by :open; hit testing or showPicker availability alone is insufficient. Visible-browser observation remains available in the existing validation phase.' });
        await page.keyboard.press('Escape');
      }
    }
  }
  return output;
}

export async function captureBrandSuffixStates(page, { root } = {}) {
  const ui = await import(pathToFileURL(join(root, 'packages/ui-react/dist/index.js')).href);
  const tokens = await import(pathToFileURL(join(root, 'packages/ui-tokens/dist/index.js')).href);
  const require = createRequire(join(root, 'packages/ui-react/package.json'));
  const { createElement } = require('react'), { renderToStaticMarkup } = require('react-dom/server');
  const rows = [];
  for (const theme of ['light', 'dark']) {
    const markup = ['tms','design-system','einzbern','mana-orchestrate'].map((product) => `<section data-product="${product}">${renderToStaticMarkup(createElement(ui.ShellBrandButton, {productId:product,version:'v2',locale:'en'}))}${renderToStaticMarkup(createElement(ui.ShellBrandButton, {productId:product,version:'v2',locale:'en',expanded:true}))}${renderToStaticMarkup(createElement(ui.ProductLockup, {productId:product,firstLine:'rail',locale:'en'}))}</section>`).join('');
    // Use the same standards mode as the built documentation. In quirks mode Chromium's
    // unqualified matches(':hover') can be false even while button:hover paints normally.
    await page.setContent(`<!doctype html><style>${tokens.tcrnTokenCss}${ui.tcrnComponentCss}</style><main data-tcrn-theme="${theme}" style="background:var(--tcrn-color-bg);padding:24px">${markup}</main>`);
    await page.evaluate(async () => {
      await document.fonts.ready;
      window.__brandCapturePointer = null;
      window.addEventListener('pointermove', (event) => { window.__brandCapturePointer = { x: event.clientX, y: event.clientY }; });
    });
    // Observe actual pointer state and finite CSS transitions; never neutralize product motion.
    // Reacquire computed styles each frame and again for the final raw reading below.
    const settle = (button, expectedHover) => button.evaluate(async (el, expectedHover) => {
      const startedAt = performance.now(), budgetMs = 2000, observed = new Map();
      let prior = null, stableReadings = 0, frames = 0;
      while (performance.now() - startedAt < budgetMs) {
        await new Promise((resolve) => requestAnimationFrame(resolve));
        const cs = getComputedStyle(el), suffix = el.querySelector('em'), word = el.querySelector('b');
        const paint = JSON.stringify([cs.backgroundColor, cs.boxShadow, cs.color, suffix ? getComputedStyle(suffix).color : null, word ? getComputedStyle(word).color : null]);
        const finite = el.getAnimations({ subtree: true }).filter((animation) => Number.isFinite(animation.effect?.getComputedTiming().endTime));
        for (const animation of finite) {
          const timing = animation.effect.getComputedTiming(), property = animation.transitionProperty ?? animation.animationName ?? animation.constructor.name;
          observed.set(property, { property, duration: timing.duration, delay: timing.delay, endTime: timing.endTime });
        }
        const pending = finite.filter((animation) => animation.playState === 'running' || animation.pending);
        const actualHover = el.matches('button:hover');
        stableReadings = actualHover === expectedHover && pending.length === 0 && paint === prior ? stableReadings + 1 : 0;
        prior = paint; frames += 1;
        if (stableReadings >= 2) {
          const pointer = window.__brandCapturePointer, hit = pointer ? document.elementFromPoint(pointer.x, pointer.y) : null;
          const pointerWithin = Boolean(hit && el.contains(hit));
          if (expectedHover && !pointerWithin) throw new Error('brand_capture_hover_hit_target_lost');
          return { documentMode: document.compatMode, expectedHover, actualHover, pointer, pointerWithin, hit: hit ? { tag: hit.tagName, classes: hit.getAttribute('class') } : null, finiteTransitions: [...observed.values()], pendingFiniteTransitions: pending.length, frames, stableReadings, elapsedMs: performance.now() - startedAt, budgetMs };
        }
      }
      throw new Error(`brand_capture_paint_unsettled:expectedHover=${expectedHover}`);
    }, expectedHover);
    for (const product of ['tms','design-system','einzbern','mana-orchestrate']) {
      const idle = page.locator(`[data-product="${product}"] button`).nth(0), open = page.locator(`[data-product="${product}"] button`).nth(1);
      const read = (button) => button.evaluate((el) => {
        const cs = getComputedStyle(el), suffix = el.querySelector('em'), word = el.querySelector('b'), mark = el.querySelector('svg[data-logo]');
        return { suffix: suffix ? getComputedStyle(suffix).color : null, word: word ? getComputedStyle(word).color : null, background: cs.backgroundColor, canvas: getComputedStyle(el.closest('main')).backgroundColor, panel: cs.getPropertyValue('--tcrn-color-panel').trim(), opacity: cs.opacity, markOpacity: mark ? getComputedStyle(mark).opacity : null, mark: mark?.innerHTML ?? null, expanded: el.getAttribute('aria-expanded'), hover: el.matches(':hover'), geometry: { button: el.getBoundingClientRect().toJSON(), word: word?.getBoundingClientRect().toJSON() ?? null, wordClientWidth: word?.clientWidth ?? null, wordScrollWidth: word?.scrollWidth ?? null, mark: mark?.getBoundingClientRect().toJSON() ?? null, toggle: el.querySelector('[data-shell-toggle]')?.getBoundingClientRect().toJSON() ?? null, minWidth: cs.minInlineSize, carrier: el.closest('main').getBoundingClientRect().toJSON() } };
      });
      await idle.scrollIntoViewIfNeeded();
      await page.mouse.move(0, 0);
      const restSettlement = await settle(idle, false), rest = { ...await read(idle), settlement: restSettlement };
      await idle.hover();
      const hoverSettlement = await settle(idle, true), hover = { ...await read(idle), settlement: hoverSettlement };
      await page.mouse.move(0, 0);
      await settle(idle, false);
      const openSettlement = await settle(open, false), expanded = { ...await read(open), settlement: openSettlement };
      for (const reading of [rest, hover, expanded]) {
        if (!reading.suffix) continue;
        const ink = parseColor(reading.suffix), canvas = parseColor(reading.canvas), fill = compositeOver(parseColor(reading.background), canvas);
        reading.effectiveBackground = fill;
        reading.contrastOnCanvas = contrastRatio(compositeOver(ink, fill), fill);
        const panel = parseColor(reading.panel);
        reading.contrastOnPanel = contrastRatio(ink, panel);
      }
      const lockup = await page.locator(`[data-product="${product}"] [data-lockup="lkr-line"]`).last().evaluate((el) => ({ suffix: el.querySelector('em') ? getComputedStyle(el.querySelector('em')).color : null, word: getComputedStyle(el.querySelector('b')).color }));
      rows.push({ theme, product, role: 'actual package ShellBrandButton v2; open supplied through expanded prop', rest, hover, open: expanded, lockup });
    }
  }
  return rows;
}

// A story whose shell blocks hydrate on the page (data-shell-hydrate, the shell stories) is read once
// every block under root says data-shell-hydrated: before that the markup is the server's and the
// shell's handlers are not attached. A story without such blocks is ready at once. False on a timeout.
async function waitForHydratedBlocks(page, root, timeout = 15000) {
  try {
    await page.waitForFunction(
      (selector) => {
        const scope = document.querySelector(selector);
        return !scope || Array.from(scope.querySelectorAll("[data-shell-hydrate]")).every((block) => block.hasAttribute("data-shell-hydrated"));
      },
      root,
      { timeout }
    );
    return true;
  } catch {
    return false;
  }
}

const STATUS_RANK = { "n/a": 0, pass: 1, fail: 2 };

function valueMatches(want, got) {
  if (typeof want === "number") return got === want;
  if (want && typeof want === "object") {
    if (typeof got !== "number") return false;
    if (want.min !== undefined && got < want.min) return false;
    if (want.max !== undefined && got > want.max) return false;
    return true;
  }
  return want === got;
}

// Compares one fixture verdict with its manifest case.
export function evaluateFixtureCase(spec, verdict) {
  const problems = [];
  const statuses = {};
  const values = {};
  for (const id of CHECK_IDS) {
    statuses[id] = verdict.checks?.[id]?.status ?? "missing";
    values[id] = verdict.checks?.[id]?.value ?? null;
  }
  if (verdict.error) problems.push(`measurement_error:${verdict.error}`);
  const mustFail = spec.fail ?? [];
  const mustPass = spec.pass ?? [];
  for (const id of CHECK_IDS) {
    if (mustFail.includes(id)) {
      if (statuses[id] !== "fail") problems.push(`${id}:expected_fail:${statuses[id]}`);
    } else if (statuses[id] === "fail" || statuses[id] === "missing") {
      problems.push(`${id}:unexpected_${statuses[id]}`);
    }
    if (mustPass.includes(id) && statuses[id] !== "pass") problems.push(`${id}:expected_pass:${statuses[id]}`);
  }
  for (const [id, want] of Object.entries(spec.values ?? {})) {
    if (!valueMatches(want, values[id])) problems.push(`${id}:value:${JSON.stringify(values[id])}:wanted:${JSON.stringify(want)}`);
  }
  for (const [id, wanted] of Object.entries(spec.reasons ?? {})) {
    const seen = new Set((verdict.checks?.[id]?.violations ?? []).flatMap((v) => v.reasons ?? []));
    for (const reason of wanted) if (!seen.has(reason)) problems.push(`${id}:reason_missing:${reason}`);
  }
  return { id: spec.id, file: spec.file, mutation: Boolean(spec.mutationCss), statuses, values, ok: problems.length === 0, problems };
}

// Every check needs at least one red case and one green case where it is applicable.
export function fixtureCoverage(manifest) {
  const red = new Set();
  const green = new Set();
  for (const spec of manifest.cases ?? []) {
    for (const id of spec.fail ?? []) red.add(id);
    if (!(spec.fail ?? []).length) for (const id of spec.pass ?? []) green.add(id);
  }
  const missingRed = CHECK_IDS.filter((id) => !red.has(id));
  const missingGreen = CHECK_IDS.filter((id) => !green.has(id));
  return { ok: missingRed.length === 0 && missingGreen.length === 0, missingRed, missingGreen };
}

export async function runFixtureSelfCheck({ root = process.cwd(), manifestPath = DEFAULT_PATHS.fixtureManifest, thresholds = THRESHOLDS, browser } = {}) {
  const manifestFile = resolve(root, manifestPath);
  const manifest = JSON.parse(readFileSync(manifestFile, "utf8"));
  const dir = dirname(manifestFile);
  const targets = manifest.cases.map((spec) => ({
    id: spec.id,
    html: readFileSync(join(dir, spec.file), "utf8"),
    root: manifest.root,
    mutationCss: spec.mutationCss
  }));
  const results = await runMeasureTargets({ targets, thresholds, browser, viewport: manifest.viewport });
  const cases = manifest.cases.map((spec, index) => evaluateFixtureCase(spec, results[index].verdict));
  const coverage = fixtureCoverage(manifest);
  return { ok: coverage.ok && cases.every((item) => item.ok), coverage, cases, verdicts: Object.fromEntries(results.map((r) => [r.id, r.verdict])) };
}

function summarize(runs) {
  const summary = {};
  for (const id of CHECK_IDS) {
    let status = null;
    let worst = null;
    for (const run of runs) {
      const check = run.verdict.checks?.[id];
      if (!check) continue;
      if (status === null || STATUS_RANK[check.status] > STATUS_RANK[status]) status = check.status;
      if (typeof check.value === "number") worst = worst === null ? check.value : Math.max(worst, check.value);
    }
    summary[id] = { status: status ?? "n/a", worstValue: worst };
  }
  return summary;
}

// The report keeps every check value, the sampled violations and, for contrast, every cell as
// [cell, ratio, expect, diff] (decomposition P6: the DOM layer reports the actual differences).
export function compactVerdict(verdict) {
  if (!verdict || verdict.error) return verdict;
  const checks = {};
  for (const [id, check] of Object.entries(verdict.checks ?? {})) {
    const { status, value, limit, violationCount, violations } = check;
    checks[id] = { status, value, limit, violationCount, violations: (violations ?? []).slice(0, 10) };
    if (id === "contrast" && Array.isArray(check.cells)) checks[id].cells = check.cells.map((cell) => [cell.cell, cell.ratio, cell.expect, cell.diff]);
  }
  return { ok: verdict.ok, failed: verdict.failed, notApplicable: verdict.notApplicable, checks };
}

// The measured set: explicit ids, one family, or the G+ ids plus any registry story in a gplus-* category.
export function measuredStoryIds({ storyIds = null, family = null, registry = [] } = {}) {
  if (storyIds?.length) return [...storyIds];
  const extra = registry.filter((entry) => /^gplus-/.test(entry.categoryId ?? "") && !GPLUS_STORY_IDS.includes(entry.id)).map((entry) => entry.id);
  if (family) {
    if (!GPLUS_FAMILIES[family]) {
      const error = new Error(`geometry_measure_unknown_family:${family}`);
      error.code = "unknown_family";
      throw error;
    }
    return [...GPLUS_FAMILIES[family], ...extra.filter((id) => id.startsWith(`${family}-`))];
  }
  return [...GPLUS_STORY_IDS, ...extra];
}

export async function runGeometryMeasureProof({
  root = process.cwd(),
  storyIds = null,
  family = null,
  themes = DEFAULT_RUN.themes,
  locale = DEFAULT_RUN.locale,
  viewport = DEFAULT_RUN.viewport,
  mutations = STORY_MUTATIONS,
  requiredChecks = REQUIRED_CHECKS,
  setRequiredChecks = SET_REQUIRED_CHECKS,
  probes = STORY_PROBES,
  thresholds = THRESHOLDS,
  selfCheck = true,
  browser
} = {}) {
  assertThresholds(thresholds);
  const fullSet = !storyIds?.length && !family;
  const report = {
    schemaVersion: SCHEMA_VERSION,
    measureSchemaVersion: MEASURE_SCHEMA_VERSION,
    ok: false,
    reason: null,
    thresholds,
    run: { viewport, themes: [...themes], locale, family, fullSet },
    storyIds: storyIds?.length ? [...storyIds] : family ? [...(GPLUS_FAMILIES[family] ?? [])] : [...GPLUS_STORY_IDS],
    selfCheck: null,
    missingStories: [],
    runs: [],
    mutations: [],
    probes: [],
    criterionCaptures: [],
    criterionCaptureScope: fullSet ? "original full CLI story set" : "not run for this scoped helper invocation",
    checksNeverApplied: [],
    summary: {}
  };
  if (family && !GPLUS_FAMILIES[family]) {
    report.reason = "unknown_family";
    return report;
  }
  const staticRoot = resolve(root, DEFAULT_PATHS.staticRoot);
  let registry = null;
  if (!existsSync(staticRoot)) report.reason = "static_docs_missing";
  else {
    try {
      registry = await loadStoryRegistry({ root, modulePath: DEFAULT_PATHS.registryModule });
    } catch (error) {
      report.reason = error.code ?? "storybook_registry_missing";
    }
  }
  if (!selfCheck && !registry) return report;

  let owned = null;
  if (!browser) {
    const { chromium } = await import("@playwright/test");
    owned = await chromium.launch();
  }
  const active = browser ?? owned;
  try {
    if (selfCheck) {
      const result = await runFixtureSelfCheck({ root, thresholds, browser: active });
      report.selfCheck = { ok: result.ok, coverage: result.coverage, cases: result.cases };
    }
    if (registry) {
      const ids = measuredStoryIds({ storyIds, family, registry });
      report.storyIds = ids;
      const { routes, missing } = resolveStoryRoutes(ids, registry);
      report.missingStories = missing;
      const activeMutations = mutations.filter((mutation) => fullSet || ids.includes(mutation.storyId));
      const mutationRoutes = resolveStoryRoutes([...new Set(activeMutations.map((mutation) => mutation.storyId))], registry).routes;
      // A probe runs in a full run or when its story is measured; its route is resolved on its own, as a
      // mutation's is, so a probe on a story outside the measured set (shell-top-band) finds it.
      const activeProbes = probes.filter((probe) => fullSet || ids.includes(probe.storyId));
      const probeRoutes = resolveStoryRoutes([...new Set(activeProbes.map((probe) => probe.storyId))], registry).routes;
      const server = await startStaticServer(staticRoot);
      try {
        const targets = [];
        for (const theme of themes) {
          for (const route of routes) {
            targets.push({ id: `${route.id}@${theme}`, storyId: route.id, theme, route: route.path, url: storyUrl(server.origin, route, { theme, locale }), root: route.bodySelector, prepare: (page) => expandStory(page, route.id) });
          }
        }
        for (const mutation of activeMutations) {
          const route = mutationRoutes.find((item) => item.id === mutation.storyId);
          if (!route) {
            report.mutations.push({ id: mutation.id, storyId: mutation.storyId, check: mutation.check, source: mutation.source, killed: false, reason: "story_missing" });
            continue;
          }
          const theme = mutation.theme ?? themes[0];
          targets.push({ id: `mutation:${mutation.id}`, mutation, theme, url: storyUrl(server.origin, route, { theme, locale }), root: route.bodySelector, prepare: (page) => expandStory(page, route.id), mutationCss: mutation.css });
        }
        const results = await runMeasureTargets({ targets, thresholds, browser: active, viewport });
        results.forEach((result, index) => {
          const target = targets[index];
          if (target.mutation) {
            const check = result.verdict.checks?.[target.mutation.check];
            const status = check?.status ?? "missing";
            report.mutations.push({ id: target.mutation.id, storyId: target.mutation.storyId, check: target.mutation.check, source: target.mutation.source, theme: target.theme, status, value: check?.value ?? null, killed: status === "fail" });
            return;
          }
          const required = requiredChecks[target.storyId] ?? [];
          const notApplicableRequired = required.filter((id) => result.verdict.checks?.[id]?.status !== "pass" && result.verdict.checks?.[id]?.status !== "fail");
          report.runs.push({
            storyId: target.storyId,
            theme: target.theme,
            route: target.route,
            ok: result.verdict.ok && notApplicableRequired.length === 0,
            failed: result.verdict.failed,
            notApplicable: result.verdict.notApplicable,
            notApplicableRequired,
            error: result.verdict.error,
            verdict: result.verdict
          });
        });

        const context = await active.newContext({ viewport, deviceScaleFactor: 1 });
        try {
          for (const probe of activeProbes) {
            const route = probeRoutes.find((item) => item.id === probe.storyId);
            if (!route) {
              report.probes.push({ id: probe.id, storyId: probe.storyId, source: probe.source, status: "missing" });
              continue;
            }
            const page = await context.newPage();
            try {
              await page.goto(storyUrl(server.origin, route, { theme: themes[0], locale }), { waitUntil: "load" });
              await expandStory(page, route.id);
              if (!(await waitForHydratedBlocks(page, route.bodySelector))) {
                report.probes.push({ id: probe.id, storyId: probe.storyId, source: probe.source, theme: themes[0], status: "error", error: "shell_blocks_not_hydrated" });
                continue;
              }
              await page.addStyleTag({ content: "*,*::before,*::after{transition:none!important;animation:none!important}" });
              const result = await runStoryProbe({ ...probe, root: route.bodySelector }, page);
              const status = result.error ? "error" : result.checked === 0 ? "n/a" : result.violationCount > 0 ? "fail" : "pass";
              report.probes.push({ id: probe.id, storyId: probe.storyId, source: probe.source, theme: themes[0], status, ...result });
            } finally {
              await page.close();
            }
          }
          for (const route of routes.filter((route) => fullSet && ['typography-matrix','actions-matrix','inputs-matrix'].includes(route.id))) {
            const page = await context.newPage();
            try {
              await page.goto(storyUrl(server.origin, route, { theme: themes[0], locale }), { waitUntil: 'load' });
              await expandStory(page, route.id);
              await waitForHydratedBlocks(page, route.bodySelector);
              await page.evaluate(() => document.fonts.ready);
              report.criterionCaptures.push(await captureGeometryCriteria(page, { root: route.bodySelector, storyId: route.id, artifactRoot: join(root, '.tarball-smoke/criterion-captures', `${Date.now()}-${process.pid}`, route.id) }));
            } catch (error) {
              report.criterionCaptures.push({ storyId: route.id, error: error.message, status: 'unverified' });
            } finally { await page.close(); }
          }
          if (fullSet && ids.includes('brand-matrix')) {
            const page = await context.newPage();
            try { report.brandStateCaptures = await captureBrandSuffixStates(page, { root }); }
            catch (error) { report.brandStateCaptures = { status: 'unverified', error: error.message }; }
            finally { await page.close(); }
          }
        } finally {
          await context.close();
        }
      } finally {
        await server.close();
      }
    }
  } finally {
    if (owned) await owned.close();
  }
  report.summary = summarize(report.runs);
  if (fullSet) report.checksNeverApplied = setRequiredChecks.filter((id) => report.summary[id]?.status === "n/a");
  report.runs = report.runs.map((run) => ({ ...run, verdict: compactVerdict(run.verdict) }));
  report.ok = !report.reason
    && (!selfCheck || report.selfCheck?.ok === true)
    && report.missingStories.length === 0
    && report.runs.length > 0
    && report.runs.every((run) => run.ok)
    && report.mutations.every((mutation) => mutation.killed)
    && report.probes.every((probe) => probe.status === "pass")
    && report.checksNeverApplied.length === 0;
  return report;
}

if (process.argv[1]?.endsWith("geometry-measure-proof.mjs")) {
  const args = process.argv.slice(2);
  const flags = new Set(args.filter((arg) => arg.startsWith("--")));
  const stories = args.flatMap((arg, index) => (arg === "--story" && args[index + 1] ? [args[index + 1]] : []));
  const family = args.flatMap((arg, index) => (arg === "--family" && args[index + 1] ? [args[index + 1]] : []))[0] ?? null;
  const root = process.cwd();
  let report;
  if (flags.has("--self-check-only")) {
    const result = await runFixtureSelfCheck({ root });
    report = { schemaVersion: SCHEMA_VERSION, measureSchemaVersion: MEASURE_SCHEMA_VERSION, ok: result.ok, thresholds: THRESHOLDS, selfCheck: { ok: result.ok, coverage: result.coverage, cases: result.cases } };
  } else {
    report = await runGeometryMeasureProof({ root, storyIds: stories.length ? stories : null, family });
  }
  const text = `${JSON.stringify(report, null, 2)}\n`;
  if (flags.has("--write-report")) {
    const target = join(root, DEFAULT_PATHS.reportPath);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, text);
  }
  process.stdout.write(text);
  if (!report.ok) process.exitCode = 1;
}
