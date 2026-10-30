#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
// TCRN-DS-STORY-128 GWT3 (TCRN-DS-SUB-028) — a first-batch component rendered in any story looks the
// same as the same component, variant and state in its family matrix story.
//
// The static docs (Track B) are opened in Chromium. In every theme the five G+ matrix stories are read
// first: each element of the 23 first-batch components (FIRST_BATCH_ROOTS: the component roots and their
// parts) becomes a reference sample keyed by its signature — tag, first-batch classes, state
// (disabled, pressed, checked, preview state, data-* state attributes, ...) and the signature of its
// nearest first-batch ancestor, so a label inside a primary button is compared with a label inside a
// primary button. Both matrix blocks are read; a sample is compared with the block of its own theme (the
// nearest data-tcrn-theme: "dark" uses the night block, anything else the light block). Then every other story in the registry is opened on its category page
// (routes from scripts/lib/storybook-routes.mjs) and each first-batch element in its rendered region is
// compared with the reference samples of the same signature: font, colour, background, border, radius,
// and the height of controls and icons (COMPARED_PROPERTIES). A sample matches when one reference with
// its signature has the same computed values. Elements whose signature has no reference are reported as
// uncovered (later families have no matrix; a variant the matrix does not show is not compared).
//
// Each mismatch is classified by reading the element again: with the documentation stylesheets switched
// off ("doc-stylesheet" when it then matches), then also without the inline style attributes of the
// story markup ("story-inline-style"); otherwise the package itself styles the component in that context
// ("package-context", for example a heading inside a toned state surface). Documentation-layer causes
// fail the gate (FAILING_CAUSES); package-context mismatches are listed as findings, and --strict fails
// on them too.
// MUTATIONS ({ id, storyId, css, theme? }) inject a documentation-layer rule on a story page; each must
// produce at least one mismatch in that story.
//
// Usage: node scripts/doc-sample-style-proof.mjs [--story <id>]... [--theme light|dark]... [--strict]
//   Run from the repository root after `pnpm build`. Prints the JSON report; exit code 1 when not ok.

import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { startStaticServer } from "./lib/gplus-measure.mjs";
import {
  GPLUS_MATRIX_STORY_IDS,
  STATIC_DOCS_ROOT,
  STORY_REGISTRY_MODULE,
  expandStory,
  loadStoryRegistry,
  storyRouteTable,
  storyUrl
} from "./lib/storybook-routes.mjs";

export const SCHEMA_VERSION = "tcrn.ds.doc-sample-style-proof.v1";

function deepFreeze(value) {
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) deepFreeze(item);
    Object.freeze(value);
  }
  return value;
}

// The 23 first-batch components (gplusMatrixComponents) and the classes their elements carry. An element
// is a sample when one of its classes equals a root or is a BEM part or modifier of it (root__x, root--x).
export const FIRST_BATCH_ROOTS = deepFreeze({
  Heading: ["tcrn-heading"],
  Text: ["tcrn-text", "tcrn-link"],
  Highlight: ["tcrn-highlight-text", "tcrn-highlight"],
  Icon: ["tcrn-icon"],
  TcrnBrandMark: ["tcrn-brand-mark"],
  ProductLogo: ["tcrn-product-logo"],
  ProductLockup: ["tcrn-brand-lockup", "tcrn-brand-wordmark"],
  Button: ["tcrn-button"],
  IconButton: ["tcrn-icon-button"],
  LinkButton: ["tcrn-link-button"],
  ClipboardCopyButton: ["tcrn-button"],
  ButtonGroup: ["tcrn-button-group"],
  Input: ["tcrn-input"],
  Textarea: ["tcrn-textarea"],
  SearchInput: ["tcrn-search-input"],
  SuggestInput: ["tcrn-input"],
  Select: ["tcrn-select-wrap", "tcrn-select"],
  MultiSelect: ["tcrn-multi-select-dropdown"],
  NumberInput: ["tcrn-number-input"],
  DatePicker: ["tcrn-date-picker-wrap", "tcrn-date-picker"],
  Checkbox: ["tcrn-checkbox"],
  RadioGroup: ["tcrn-radio-group"],
  Switch: ["tcrn-switch"]
});

// Elements whose height is part of the component contract (controls, and icons by their size
// attribute); text heights follow their content and are compared through font size and line height
// instead. The brand mark is sized by its container by design, so its height is not compared.
export const HEIGHT_ROOTS = deepFreeze([
  "tcrn-button", "tcrn-icon-button", "tcrn-link-button", "tcrn-input", "tcrn-select", "tcrn-date-picker",
  "tcrn-checkbox", "tcrn-icon", "tcrn-multi-select-dropdown__trigger",
  "tcrn-search-input__control", "tcrn-radio-group__control", "tcrn-switch__control"
]);

export const COMPARED_PROPERTIES = deepFreeze({
  font: ["fontFamily", "fontSize", "fontWeight", "fontStyle", "lineHeight", "letterSpacing"],
  color: ["color"],
  background: ["backgroundColor", "backgroundImage"],
  border: [
    "borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth",
    "borderTopStyle", "borderRightStyle", "borderBottomStyle", "borderLeftStyle",
    "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor", "boxShadow"
  ],
  radius: ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"],
  height: ["height"]
});

export const DEFAULT_PATHS = Object.freeze({ staticRoot: STATIC_DOCS_ROOT, registryModule: STORY_REGISTRY_MODULE });
export const DEFAULT_RUN = deepFreeze({ viewport: { width: 1440, height: 900 }, themes: ["light", "dark"], locale: "en" });
// { id, storyId, css, theme? } — a documentation-layer rule injected on the story page; must be caught
// (at least one mismatch with a failing cause in that story). Every run carries this one.
export const MUTATIONS = deepFreeze([
  { id: "doc-override-button-fill", storyId: "button-spec-usage", css: ".story-body .tcrn-button { background-color: rgb(200, 0, 0); }" }
]);

const DOC_STYLE_SELECTOR = "style[data-tcrn-static-doc-style-source], link[rel=\"stylesheet\"]:not([data-tcrn-font-source])";

// Browser side, self-contained (handed to page.evaluate). Collects the first-batch samples under
// `regionSelector` (optionally only inside `scopeSelector`), keeps the elements in window.__tcrnDocSamples
// for a later re-read, and returns { found, samples }.
export function collectSamplesInPage({ regionSelector, scopeSelector, roots, heightRoots, properties, keep }) {
  const region = document.querySelector(regionSelector);
  if (!region) return { found: false, samples: [] };
  const scopes = scopeSelector ? [...region.querySelectorAll(scopeSelector)] : [region];
  const rootList = [...new Set(roots)];
  const isFirstBatchClass = (name) => rootList.some((rootName) => name === rootName || name.startsWith(`${rootName}__`) || name.startsWith(`${rootName}--`));
  const firstBatchClasses = (el) => (typeof el.className === "string" || el.className?.baseVal !== undefined ? [...el.classList] : []).filter(isFirstBatchClass).sort();
  // Only attributes and pseudo-classes the package CSS can style on are part of the state: an aria-* or
  // data-* attribute counts with its value when a selector names that value, as present when a selector
  // tests presence only; plus the form pseudo-classes the package CSS uses.
  const packageCss = [...document.querySelectorAll("style[data-tcrn-component-style-source]")].map((node) => node.textContent).join("\n");
  const styledValues = new Map();
  for (const match of packageCss.matchAll(/\[\s*((?:data|aria)-[a-z0-9-]+)\s*(?:([~|^$*]?=)\s*(?:"([^"]*)"|'([^']*)'|([^\]\s]+)))?\s*[is]?\s*\]/g)) {
    const [, name, operator, double, single, bare] = match;
    if (name === "data-tcrn-theme") continue;
    if (!styledValues.has(name)) styledValues.set(name, { presence: false, values: new Set(), loose: false });
    const entry = styledValues.get(name);
    if (!operator) entry.presence = true;
    else if (operator === "=") entry.values.add(double ?? single ?? bare);
    else entry.loose = true;
  }
  const styledPseudo = [":disabled", ":checked", ":read-only", ":placeholder-shown", ":indeterminate"].filter((pseudo) => packageCss.includes(pseudo));
  const stateOf = (el) => {
    const parts = [];
    if (el.matches(":disabled") || el.getAttribute("aria-disabled") === "true") parts.push("disabled");
    for (const pseudo of styledPseudo) if (pseudo !== ":disabled" && el.matches(`input${pseudo}, textarea${pseudo}`)) parts.push(pseudo.slice(1));
    if (el.hasAttribute("readonly") && packageCss.includes("[readonly]")) parts.push("readonly");
    for (const name of el.getAttributeNames()) {
      const entry = styledValues.get(name);
      if (!entry || name === "aria-disabled") continue;
      const value = el.getAttribute(name);
      if (entry.values.has(value) || entry.loose) parts.push(`${name}=${value}`);
      else if (entry.presence) parts.push(name);
    }
    if (el.tagName === "INPUT") parts.push(`type=${el.getAttribute("type") ?? "text"}`);
    if (el instanceof SVGSVGElement) parts.push(`size=${el.getAttribute("width") ?? ""}x${el.getAttribute("height") ?? ""}`);
    return parts.sort().join(" ");
  };
  // A property is compared where the element paints with it: font where it sets text (a direct text
  // node, or a form control), colour there and on SVG (currentColor), a border colour on a drawn side,
  // height on controls and icons; background, border width and style, shadow and radius always.
  const rootSelector = rootList.map((name) => `[class~="${name}"], [class*="${name}__"], [class*="${name}--"]`).join(", ");
  const readStyles = (el, classes) => {
    const cs = getComputedStyle(el);
    const paintsText = ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "MARK"].includes(el.tagName) || [...el.childNodes].some((node) => node.nodeType === 3 && node.textContent.trim());
    // An icon paints with currentColor: its colour belongs to the component around it, so it is compared
    // only inside a first-batch component (whose signature is part of the icon's signature).
    const isSvg = el instanceof SVGElement && Boolean(el.parentElement?.closest(rootSelector));
    // An element without a layout box (inside a closed dialog, display: none) has no height to compare.
    const withHeight = classes.some((name) => heightRoots.includes(name)) && el.getClientRects().length > 0;
    const styles = {};
    for (const [group, names] of Object.entries(properties)) {
      if (group === "height" && !withHeight) continue;
      if (group === "font" && !paintsText) continue;
      if (group === "color" && !paintsText && !isSvg) continue;
      for (const name of names) {
        const side = /^border(Top|Right|Bottom|Left)Color$/.exec(name)?.[1];
        if (side && (["none", "hidden"].includes(cs[`border${side}Style`]) || cs[`border${side}Width`] === "0px")) continue;
        styles[name] = name === "height" ? `${Math.round(el.getBoundingClientRect().height * 10) / 10}px` : cs[name];
      }
    }
    return styles;
  };
  const ownSignature = (el) => `${el.tagName.toLowerCase()}.${firstBatchClasses(el).join(".")}[${stateOf(el)}]`;
  const kept = [];
  const samples = [];
  for (const scopeRoot of scopes) {
    for (const el of scopeRoot.querySelectorAll("[class]")) {
      const classes = firstBatchClasses(el);
      if (!classes.length) continue;
      let ancestor = el.parentElement;
      while (ancestor && ancestor !== scopeRoot && !firstBatchClasses(ancestor).length) ancestor = ancestor.parentElement;
      const parentSignature = ancestor && ancestor !== scopeRoot ? ownSignature(ancestor) : "";
      const signature = parentSignature ? `${parentSignature} > ${ownSignature(el)}` : ownSignature(el);
      const styles = readStyles(el, classes);
      const text = (el.textContent || el.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim().slice(0, 40);
      const path = [];
      for (let node = el; node && node !== region && path.length < 4; node = node.parentElement) {
        const cls = typeof node.className === "string" ? node.className.trim().split(/\s+/).slice(0, 2).join(".") : "";
        path.unshift(`${node.tagName.toLowerCase()}${cls ? `.${cls}` : ""}`);
      }
      if (keep) kept.push(el);
      const block = el.closest("[data-tcrn-theme]")?.getAttribute("data-tcrn-theme") === "dark" ? "night" : "light";
      samples.push({ index: samples.length, signature, block, classes, styles, text, element: path.join(" > ") });
    }
  }
  if (keep) {
    window.__tcrnDocSamples = kept;
    window.__tcrnDocSampleRead = (el) => readStyles(el, firstBatchClasses(el));
  }
  return { found: true, samples };
}

// Browser side: re-reads the kept samples at `indexes` twice — with the documentation-layer rules
// neutralised (every style rule of the documentation stylesheets and of any <style> inside the story,
// except the global token blocks — :root, html and theme selectors that only declare custom properties,
// which is how the token package travels inside the documentation stylesheet), then also without the
// inline style attributes of the element and its ancestors inside the region — and restores the page.
export function rereadWithoutDocLayerInPage({ indexes, docStyleSelector, regionSelector }) {
  const kept = window.__tcrnDocSamples ?? [];
  const read = (el) => (el && window.__tcrnDocSampleRead ? window.__tcrnDocSampleRead(el) : null);
  const region = document.querySelector(regionSelector);
  const nodes = [...document.querySelectorAll(docStyleSelector), ...(region ? region.querySelectorAll("style") : [])];
  const tokenScope = /^(?::root|html)?(?:\[data-tcrn-theme[^\]]*\])?$|^:root|^html$/;
  const isTokenBlock = (rule) => rule.selectorText.split(",").every((part) => tokenScope.test(part.trim()))
    && [...rule.style].every((name) => name.startsWith("--"));
  const neutralised = [];
  const walk = (rules) => {
    for (const rule of rules) {
      if (rule instanceof CSSStyleRule) {
        if (!isTokenBlock(rule)) neutralised.push([rule, rule.style.cssText]);
      } else if (rule.cssRules && !(rule instanceof CSSKeyframesRule)) walk(rule.cssRules);
    }
  };
  for (const node of nodes) if (node.sheet) walk(node.sheet.cssRules);
  for (const [rule] of neutralised) rule.style.cssText = "";
  try {
    return indexes.map((index) => {
      const el = kept[index];
      const withoutDoc = read(el);
      const saved = [];
      for (let node = el; node && node !== region?.parentElement; node = node.parentElement) {
        if (node.hasAttribute?.("style")) {
          saved.push([node, node.getAttribute("style")]);
          node.removeAttribute("style");
        }
      }
      const withoutInline = saved.length ? read(el) : null;
      for (const [node, value] of saved) node.setAttribute("style", value);
      return { withoutDoc, withoutInline };
    });
  } finally {
    for (const [rule, text] of neutralised) rule.style.cssText = text;
  }
}

// Mismatch causes. Documentation-layer causes fail the gate; a package context rule (the package
// itself styling the component inside another package component) is reported as a finding.
export const FAILING_CAUSES = deepFreeze(["doc-stylesheet", "story-inline-style"]);

// Node side: the properties of `sample` that differ from `reference` (only the properties both carry).
export function styleDiffs(sample, reference) {
  const diffs = [];
  for (const [name, value] of Object.entries(sample)) {
    if (!(name in reference)) continue;
    if (reference[name] !== value) diffs.push({ property: name, story: value, matrix: reference[name] });
  }
  return diffs;
}

// Node side: compares a sample with every reference of its signature; the closest one is reported.
export function compareSample(sample, references) {
  if (!references?.length) return { status: "uncovered", diffs: [] };
  let best = null;
  for (const reference of references) {
    const diffs = styleDiffs(sample.styles, reference.styles);
    if (!diffs.length) return { status: "match", diffs: [] };
    if (!best || diffs.length < best.diffs.length) best = { reference, diffs };
  }
  return { status: "mismatch", diffs: best.diffs, reference: { element: best.reference.element, storyId: best.reference.storyId } };
}

// Removing an ancestor's inline sizing can hide a sample through a package container query.
// A missing layout measurement is not evidence that the measured mismatch disappeared.
export function classifySampleMismatch(diffs, references, reread = {}) {
  const requiredProperties = [...new Set(diffs.map(({ property }) => property))];
  const inspect = (styles) => {
    const missingProperties = requiredProperties.filter((name) => !styles || !(name in styles));
    return { missingProperties, matches: Boolean(styles) && missingProperties.length === 0
      && references.some((reference) => styleDiffs(styles, reference.styles).length === 0) };
  };
  const withoutDoc = inspect(reread.withoutDoc);
  const withoutInline = inspect(reread.withoutInline);
  return { cause: withoutDoc.matches ? "doc-stylesheet" : withoutInline.matches ? "story-inline-style" : "package-context",
    evidence: { requiredProperties, withoutDoc, withoutInline } };
}

function rootsList() {
  return [...new Set(Object.values(FIRST_BATCH_ROOTS).flat())];
}

// Transitions and animations are switched off before reading, so a colour caught halfway through a
// theme or expand transition is never compared (the freeze rule touches no compared property).
const FREEZE_CSS = "*,*::before,*::after{transition:none!important;animation:none!important}";

async function openStoryPage(page, origin, route, theme, locale, ids) {
  await page.goto(storyUrl(origin, route, { theme, locale }), { waitUntil: "load" });
  for (const id of ids) await expandStory(page, id);
  await page.addStyleTag({ content: FREEZE_CSS });
  await page.evaluate(() => document.fonts?.ready?.then(() => true));
}

export async function runDocSampleStyleProof({
  root = process.cwd(),
  storyIds = null,
  themes = DEFAULT_RUN.themes,
  locale = DEFAULT_RUN.locale,
  viewport = DEFAULT_RUN.viewport,
  mutations = MUTATIONS,
  strict = false,
  browser
} = {}) {
  const report = {
    schemaVersion: SCHEMA_VERSION,
    ok: false,
    reason: null,
    run: { viewport, themes: [...themes], locale },
    roots: FIRST_BATCH_ROOTS,
    properties: COMPARED_PROPERTIES,
    matrixStories: [...GPLUS_MATRIX_STORY_IDS],
    missingMatrices: [],
    missingStories: [],
    references: {},
    stories: [],
    totals: { compared: 0, matched: 0, mismatched: 0, uncovered: 0, docStylesheet: 0, storyInlineStyle: 0, packageContext: 0, failing: 0 },
    failingCauses: [...FAILING_CAUSES],
    mismatches: [],
    uncovered: [],
    mutations: []
  };
  const staticRoot = resolve(root, DEFAULT_PATHS.staticRoot);
  if (!existsSync(staticRoot)) {
    report.reason = "static_docs_missing";
    return report;
  }
  let registry;
  try {
    registry = await loadStoryRegistry({ root, modulePath: DEFAULT_PATHS.registryModule });
  } catch (error) {
    report.reason = error.code ?? "storybook_registry_missing";
    return report;
  }
  const table = storyRouteTable(registry);
  report.missingMatrices = GPLUS_MATRIX_STORY_IDS.filter((id) => !table.has(id));
  const targetIds = (storyIds ?? [...table.keys()]).filter((id) => !GPLUS_MATRIX_STORY_IDS.includes(id));
  report.missingStories = targetIds.filter((id) => !table.has(id));
  if (report.missingMatrices.length) {
    report.reason = "matrix_stories_missing";
    return report;
  }

  const roots = rootsList();
  let owned = null;
  if (!browser) {
    const { chromium } = await import("@playwright/test");
    owned = await chromium.launch();
  }
  const active = browser ?? owned;
  const server = await startStaticServer(staticRoot);
  const context = await active.newContext({ viewport, deviceScaleFactor: 1 });
  try {
    const page = await context.newPage();
    for (const theme of themes) {
      // 1. Reference samples from the matrix block of this page theme.
      const references = new Map();
      const matrixRoutes = GPLUS_MATRIX_STORY_IDS.map((id) => table.get(id));
      const byFile = new Map();
      for (const route of matrixRoutes) byFile.set(route.file, [...(byFile.get(route.file) ?? []), route]);
      let referenceCount = 0;
      for (const fileRoutes of byFile.values()) {
        await openStoryPage(page, server.origin, fileRoutes[0], theme, locale, fileRoutes.map((route) => route.id));
        for (const route of fileRoutes) {
          for (const block of ["light", "night"]) {
            const { samples } = await page.evaluate(collectSamplesInPage, { regionSelector: route.bodySelector, scopeSelector: `[data-gplus-matrix-theme="${block}"]`, roots, heightRoots: [...HEIGHT_ROOTS], properties: COMPARED_PROPERTIES, keep: false });
            for (const sample of samples) {
              const key = `${block}|${sample.signature}`;
              references.set(key, [...(references.get(key) ?? []), { storyId: route.id, element: sample.element, styles: sample.styles }]);
              referenceCount += 1;
            }
          }
        }
      }
      report.references[theme] = { samples: referenceCount, signatures: references.size };

      // 2. Every other story, compared sample by sample.
      const pageMutations = mutations.filter((mutation) => (mutation.theme ?? themes[0]) === theme);
      const groups = new Map();
      for (const id of targetIds) {
        const route = table.get(id);
        if (!route) continue;
        groups.set(route.file, [...(groups.get(route.file) ?? []), route]);
      }
      for (const mutation of pageMutations) {
        if (!table.has(mutation.storyId)) report.mutations.push({ id: mutation.id, storyId: mutation.storyId, theme, killed: false, reason: "story_missing" });
      }
      const passes = [...[...groups.values()].map((fileRoutes) => ({ fileRoutes, mutation: null })), ...pageMutations.filter((mutation) => table.has(mutation.storyId)).map((mutation) => ({ fileRoutes: [table.get(mutation.storyId)], mutation }))];
      for (const { fileRoutes, mutation } of passes) {
        await openStoryPage(page, server.origin, fileRoutes[0], theme, locale, fileRoutes.map((route) => route.id));
        if (mutation) {
          await page.evaluate((css) => {
            const style = document.createElement("style");
            style.setAttribute("data-tcrn-static-doc-style-source", "mutation");
            style.textContent = css;
            document.head.append(style);
          }, mutation.css);
        }
        for (const route of fileRoutes) {
          const { found, samples } = await page.evaluate(collectSamplesInPage, { regionSelector: route.bodySelector, roots, heightRoots: [...HEIGHT_ROOTS], properties: COMPARED_PROPERTIES, keep: true });
          const story = { storyId: route.id, theme, found, samples: samples.length, matched: 0, mismatched: 0, uncovered: 0 };
          const storyMismatches = [];
          for (const sample of samples) {
            const result = compareSample(sample, references.get(`${sample.block}|${sample.signature}`));
            if (result.status === "match") story.matched += 1;
            else if (result.status === "uncovered") {
              story.uncovered += 1;
              if (!mutation) report.uncovered.push({ storyId: route.id, theme, block: sample.block, signature: sample.signature, element: sample.element });
            } else {
              story.mismatched += 1;
              storyMismatches.push({ storyId: route.id, theme, block: sample.block, index: sample.index, signature: sample.signature, element: sample.element, text: sample.text, diffs: result.diffs, reference: result.reference });
            }
          }
          if (storyMismatches.length) {
            const reread = await page.evaluate(rereadWithoutDocLayerInPage, { indexes: storyMismatches.map((item) => item.index), docStyleSelector: DOC_STYLE_SELECTOR, regionSelector: route.bodySelector });
            storyMismatches.forEach((item, position) => {
              const refs = references.get(`${item.block}|${item.signature}`) ?? [];
              const classification = classifySampleMismatch(item.diffs, refs, reread[position]);
              item.cause = classification.cause;
              item.causeEvidence = classification.evidence;
              delete item.index;
            });
          }
          if (mutation) {
            const failing = storyMismatches.filter((item) => FAILING_CAUSES.includes(item.cause)).length;
            report.mutations.push({ id: mutation.id, storyId: mutation.storyId, theme, mismatches: storyMismatches.length, failing, causes: [...new Set(storyMismatches.map((item) => item.cause))], killed: failing > 0, sample: storyMismatches.slice(0, 3) });
            continue;
          }
          report.stories.push(story);
          report.mismatches.push(...storyMismatches);
        }
      }
    }
  } finally {
    await context.close();
    await server.close();
    if (owned) await owned.close();
  }
  for (const story of report.stories) {
    report.totals.compared += story.matched + story.mismatched;
    report.totals.matched += story.matched;
    report.totals.mismatched += story.mismatched;
    report.totals.uncovered += story.uncovered;
  }
  report.totals.docStylesheet = report.mismatches.filter((item) => item.cause === "doc-stylesheet").length;
  report.totals.storyInlineStyle = report.mismatches.filter((item) => item.cause === "story-inline-style").length;
  report.totals.packageContext = report.mismatches.filter((item) => item.cause === "package-context").length;
  report.totals.failing = strict ? report.mismatches.length : report.totals.docStylesheet + report.totals.storyInlineStyle;
  report.strict = strict;
  report.uncoveredSignatures = Object.entries(report.uncovered.reduce((acc, item) => ({ ...acc, [item.signature]: (acc[item.signature] ?? 0) + 1 }), {})).sort((a, b) => b[1] - a[1]).map(([signature, count]) => ({ signature, count }));
  report.uncovered = report.uncovered.slice(0, 50);
  report.ok = !report.reason
    && report.missingStories.length === 0
    && report.stories.length > 0
    && report.totals.compared > 0
    && report.totals.failing === 0
    && report.mutations.every((mutation) => mutation.killed);
  if (!report.ok && !report.reason) {
    report.reason = report.missingStories.length ? "stories_missing" : report.totals.failing ? "doc_sample_style_mismatch" : report.mutations.some((mutation) => !mutation.killed) ? "mutation_survived" : "nothing_compared";
  }
  return report;
}

if (process.argv[1]?.endsWith("doc-sample-style-proof.mjs")) {
  const args = process.argv.slice(2);
  const valuesOf = (flag) => args.flatMap((arg, index) => (arg === flag && args[index + 1] ? [args[index + 1]] : []));
  const stories = valuesOf("--story");
  const themes = valuesOf("--theme");
  const report = await runDocSampleStyleProof({ root: process.cwd(), storyIds: stories.length ? stories : null, themes: themes.length ? themes : DEFAULT_RUN.themes, strict: args.includes("--strict") });
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (!report.ok) process.exitCode = 1;
}
