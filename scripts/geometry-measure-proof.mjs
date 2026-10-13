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
//   rail           rail guides at 16px and rail text at 48px from the shell edge (0.5px tolerance)
//   rowAlign       first-cell text start of every table / list row identical (spread <= 0.5px)
//   mark           0 marks that change typesetting
//   contrast       every data-cell within 0.05 of its data-expect; text >= 4.5, other kinds >= 3 unless exempt
//   controlHeight  declared control heights match (0.5px) and are 28, 32 or 40
//   overlap        0 intersecting grid / flex siblings (more than 1px on both axes)
//   shellFrame     composition one's frame (O-1, TCRN-DS-SUB-094): in every ProductShell [data-shell] the
//                  paper sits 12px from the shell's top, end and bottom edges and the shell's top bar is
//                  52px tall (0.5px tolerance); 131's "eight" reads as every required check, ten with this
//
// Every run starts with the fixture self-check (tests/fixtures/geometry-measure/manifest.json): each
// check must turn red on its injected violation and stay green on the clean pages, in the Chromium that
// is about to measure the stories. Then each G+ matrix and sample story is opened on its category page
// in every theme and measured inside its rendered region (the documentation chrome around it is not
// measured). STORY_MUTATIONS injects a mutation on a real story for STORY-131 GWT1-3 and for contrast
// (each must turn its check red); REQUIRED_CHECKS names the checks each story must exercise (an n/a
// there fails) and, in a full run, every check must apply somewhere in the set; STORY_PROBES judges the
// ButtonGroup focus ring, the DatePicker indicator hit and the Highlight width (decomposition P31), and
// the 1.25px stroke of the 16px icons (124-GWT1).
// The report (--write-report) goes to docs/verification/geometry-measure/report.json.
//
// Usage: node scripts/geometry-measure-proof.mjs [--self-check-only] [--story <id>]... [--family <name>] [--write-report]
//   Run from the repository root after `pnpm build` (the static docs and the built registry must
//   exist; --self-check-only needs neither). Prints the JSON report; exit code 1 when not ok.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { CHECK_IDS, MEASURE_SCHEMA_VERSION, assertThresholds, runMeasureTargets, startStaticServer } from "./lib/gplus-measure.mjs";
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
  shellFrame: { paperInsetPx: 12, topBarHeightPx: 52, tolerancePx: 0.5 }
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
// so contrast is not theirs: each must exercise the rail of its shell (16 / 48) and the shell's frame
// (paper 12 from the edge, top bar 52; TCRN-DS-SUB-094), and the four with TableShell rows (every
// sample but inputs-sample-members) their row alignment. The board rows of
// docs/design/gplus-2026-10/storybook-map.json list the same checks (the any-page four aside). The
// composition three sample (O-4, TCRN-DS-SUB-093) is a gplus-samples registry story outside the ten
// fixed ids: no [data-shell], no TableShell rows, no data-cell, so it must exercise the any-page four.
// In a full run every check must also apply somewhere in the set (SET_REQUIRED_CHECKS).
const ANY_PAGE_CHECKS = ["clip", "singleLine", "shadowBlur", "overlap"];
const MATRIX_CHECKS = [...ANY_PAGE_CHECKS, "contrast"];
const SAMPLE_CHECKS = [...ANY_PAGE_CHECKS, "rail", "shellFrame"];
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
  "composition-three-sample": [...ANY_PAGE_CHECKS]
});
export const SET_REQUIRED_CHECKS = deepFreeze([...CHECK_IDS]);

// { id, storyId, check, css, theme?, source } — injected on the real story; check must turn red.
// STORY-131 GWT1: the package has no .tcrn-table yet (decomposition P17), so the row mutation uses the
// TableShell rows of table-record-index-spec (no row there is selected; the first body row stands in).
export const STORY_MUTATIONS = deepFreeze([
  { id: "row-first-cell-padding", storyId: "table-record-index-spec", check: "rowAlign", source: "131-GWT1", css: ".tcrn-table-shell [role=\"row\"]:nth-child(2) > :first-child { padding-left: 8px !important; }" },
  { id: "mark-padding", storyId: "typography-matrix", check: "mark", source: "131-GWT2", css: "mark { padding: 2px !important; }" },
  { id: "shadow-blur-4px", storyId: "actions-matrix", check: "shadowBlur", source: "131-GWT3", css: ".story-body .tcrn-button { box-shadow: 0 1px 4px rgba(22, 21, 15, 0.2) !important; }" },
  { id: "cell-ink-drift", storyId: "actions-matrix", check: "contrast", source: "131 contrast", css: ".story-body .tcrn-button.tcrn-button--primary { color: rgb(120, 200, 190) !important; }" },
  // TCRN-DS-SUB-094 (O-1, 129-GWT3, 131-GWT4): the paper flush with the shell edge, and the shell top bar
  // back at the old 68, each turn shellFrame red on a real sample.
  { id: "shell-paper-inset-zero", storyId: "icon-sample-project", check: "shellFrame", source: "129-GWT3 paper inset", css: "[data-shell] .tcrn-product-shell__workspace { margin: 0 !important; }" },
  { id: "shell-top-bar-68", storyId: "icon-sample-project", check: "shellFrame", source: "131-GWT4 top bar", css: "[data-shell] .tcrn-product-shell__workspace > .tcrn-top-bar { min-height: 68px !important; }" }
]);

// Relations the eight checks do not cover, judged in the browser (decomposition P31): the ButtonGroup
// focus ring is not clipped (125-GWT4), a click on the right 30px of a DatePicker lands on the native
// calendar indicator (126-GWT4; headless Chromium opens no system calendar, so the hit test stands in),
// a Highlight keeps the width of its plain text (123-GWT2), and the 16px icons are stroked 1.25px
// (124-GWT1, ICON_STROKE).
export const STORY_PROBES = deepFreeze([
  { id: "buttonGroupFocusRing", storyId: "actions-matrix", source: "125-GWT4" },
  { id: "datePickerIndicatorHit", storyId: "inputs-matrix", source: "126-GWT4" },
  { id: "highlightWidth", storyId: "typography-matrix", source: "123-GWT2" },
  { id: "iconStroke", storyId: "icon-matrix", source: "124-GWT1" }
]);

// 124-GWT1 on the icon-matrix 16px row: the roster renders every icon at 14, 16 and 20 px and marks
// each rendition with data-gplus-icon-size. Each 16px icon must render 16px square, and every child
// (svg.tcrn-icon > *) must compute stroke-width 1.25px with vector-effect non-scaling-stroke, which
// keeps the 1.25 in screen pixels whatever the viewBox scale (SVG does not inherit vector-effect, so
// each child carries it).
export const ICON_STROKE = deepFreeze({ iconSelector: 'svg.tcrn-icon[data-gplus-icon-size="16"]', sizePx: 16, strokeWidthPx: 1.25, vectorEffect: "non-scaling-stroke", tolerancePx: 0.01 });

// Browser side: every button of every ButtonGroup under root is put in its focus preview state; the
// ring (box-shadow extent) must stay inside every clipping ancestor up to root.
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
  const violations = [];
  let checked = 0;
  for (const group of scope.querySelectorAll(".tcrn-button-group")) {
    for (const button of group.querySelectorAll("button")) {
      const previous = button.getAttribute("data-tcrn-preview-state");
      button.setAttribute("data-tcrn-preview-state", "focus");
      const extent = extentOf(getComputedStyle(button).boxShadow);
      const rect = button.getBoundingClientRect();
      const ring = { left: rect.left - extent, right: rect.right + extent, top: rect.top - extent, bottom: rect.bottom + extent };
      checked += 1;
      for (let node = button.parentElement; node; node = node.parentElement) {
        const cs = getComputedStyle(node);
        const clipX = cs.overflowX !== "visible";
        const clipY = cs.overflowY !== "visible";
        if (clipX || clipY) {
          const box = node.getBoundingClientRect();
          const inner = { left: box.left + parseFloat(cs.borderLeftWidth), right: box.right - parseFloat(cs.borderRightWidth), top: box.top + parseFloat(cs.borderTopWidth), bottom: box.bottom - parseFloat(cs.borderBottomWidth) };
          const cut = Math.max(clipX ? inner.left - ring.left : 0, clipX ? ring.right - inner.right : 0, clipY ? inner.top - ring.top : 0, clipY ? ring.bottom - inner.bottom : 0);
          if (cut > tolerancePx) {
            violations.push({ button: (button.getAttribute("aria-label") || button.textContent || "").trim().slice(0, 30), extent, clippedBy: `${node.tagName.toLowerCase()}.${[...node.classList].slice(0, 2).join(".")}`, cutPx: Math.round(cut * 10) / 10 });
            break;
          }
        }
        if (node === scope) break;
      }
      if (previous === null) button.removeAttribute("data-tcrn-preview-state");
      else button.setAttribute("data-tcrn-preview-state", previous);
    }
  }
  return { checked, value: violations.length, violationCount: violations.length, violations };
}

// Browser side: each .tcrn-highlight-text under root must be as wide as the same text without marks.
export function highlightWidthInPage({ root, tolerancePx = 0.5 }) {
  const scope = document.querySelector(root);
  if (!scope) return { error: "root_not_found" };
  const violations = [];
  let checked = 0;
  let worst = 0;
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
    const diff = Math.abs(measured.getBoundingClientRect().width - plain.getBoundingClientRect().width);
    plain.remove();
    measured.remove();
    checked += 1;
    worst = Math.max(worst, diff);
    if (diff > tolerancePx) violations.push({ text: el.textContent.trim().slice(0, 40), diffPx: Math.round(diff * 100) / 100 });
  }
  return { checked, value: Math.round(worst * 100) / 100, violationCount: violations.length, violations };
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
  let checked = 0;
  let children = 0;
  let worst = 0;
  for (const svg of scope.querySelectorAll(iconSelector)) {
    checked += 1;
    const icon = svg.getAttribute("data-icon-name") || svg.getAttribute("aria-label") || "";
    const box = svg.getBoundingClientRect();
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
  return { checked, children, value: Number.isFinite(worst) ? round(worst) : null, strokeWidths: [...strokeWidths], vectorEffects: [...vectorEffects], violationCount: violations.length, violations: violations.slice(0, 10) };
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
const PAGE_PROBES = { buttonGroupFocusRing: focusRingClipInPage, highlightWidth: highlightWidthInPage, iconStroke: iconStrokeInPage };
const PROBE_OPTIONS = { iconStroke: ICON_STROKE };

async function runStoryProbe(probe, page) {
  if (probe.id === "datePickerIndicatorHit") return datePickerIndicatorHit(page, probe.root);
  const fn = PAGE_PROBES[probe.id];
  if (!fn) return { error: `unknown_probe:${probe.id}` };
  return page.evaluate(fn, { ...(PROBE_OPTIONS[probe.id] ?? {}), root: probe.root });
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
          for (const probe of probes) {
            const route = routes.find((item) => item.id === probe.storyId);
            if (!route) {
              if (fullSet || ids.includes(probe.storyId)) report.probes.push({ id: probe.id, storyId: probe.storyId, source: probe.source, status: "missing" });
              continue;
            }
            const page = await context.newPage();
            try {
              await page.goto(storyUrl(server.origin, route, { theme: themes[0], locale }), { waitUntil: "load" });
              await expandStory(page, route.id);
              await page.addStyleTag({ content: "*,*::before,*::after{transition:none!important;animation:none!important}" });
              const result = await runStoryProbe({ ...probe, root: route.bodySelector }, page);
              const status = result.error ? "error" : result.checked === 0 ? "n/a" : result.violationCount > 0 ? "fail" : "pass";
              report.probes.push({ id: probe.id, storyId: probe.storyId, source: probe.source, theme: themes[0], status, ...result });
            } finally {
              await page.close();
            }
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
