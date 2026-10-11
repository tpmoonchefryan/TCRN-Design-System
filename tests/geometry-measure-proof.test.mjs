// SPDX-License-Identifier: Apache-2.0
// G+ DOM measurement library, story routes and gate skeleton (TCRN-DS-STORY-131, TCRN-DS-SUB-034).
import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import {
  CHECK_IDS,
  THRESHOLD_KEYS,
  assertThresholds,
  compositeOver,
  contrastRatio,
  expectedContrast,
  judgeMeasurements,
  measurePage,
  parseColor,
  runMeasureTargets
} from "../scripts/lib/gplus-measure.mjs";
import {
  GPLUS_MATRIX_STORY_IDS,
  GPLUS_SAMPLE_STORY_IDS,
  GPLUS_STORY_IDS,
  categoryFileName,
  groupFileName,
  loadStoryRegistry,
  resolveStoryRoutes,
  storyRoute,
  storyRouteTable,
  storyBodySelector,
  storySelector,
  storyUrl
} from "../scripts/lib/storybook-routes.mjs";
import {
  DEFAULT_PATHS,
  THRESHOLDS,
  evaluateFixtureCase,
  fixtureCoverage,
  runFixtureSelfCheck,
  runGeometryMeasureProof
} from "../scripts/geometry-measure-proof.mjs";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const fixtureDir = fileURLToPath(new URL("./fixtures/geometry-measure/", import.meta.url));
const manifest = JSON.parse(readFileSync(new URL("./fixtures/geometry-measure/manifest.json", import.meta.url), "utf8"));

let browser;
let selfCheck;

before(async () => {
  browser = await chromium.launch();
  selfCheck = await runFixtureSelfCheck({ root: repoRoot, browser });
});

after(async () => {
  await browser?.close();
});

test("the gate owns the STORY-131 thresholds", () => {
  assert.equal(assertThresholds(THRESHOLDS), THRESHOLDS);
  assert.deepEqual(Object.keys(THRESHOLDS).sort(), [...CHECK_IDS].sort());
  assert.equal(THRESHOLDS.clip.maxLeaks, 0);
  assert.equal(THRESHOLDS.singleLine.maxLines, 1);
  assert.equal(THRESHOLDS.shadowBlur.maxBlurPx, 3);
  assert.equal(THRESHOLDS.rail.guideLeftPx, 16);
  assert.equal(THRESHOLDS.rail.textLeftPx, 48);
  assert.equal(THRESHOLDS.contrast.maxDiff, 0.05);
  assert.deepEqual([...THRESHOLDS.controlHeight.allowedPx], [28, 32, 40]);
  assert.equal(THRESHOLDS.overlap.maxOverlaps, 0);
  // TCRN-DS-SUB-094: composition one's frame, paper 12 from the shell edge and the shell top bar 52.
  assert.deepEqual([THRESHOLDS.shellFrame.paperInsetPx, THRESHOLDS.shellFrame.topBarHeightPx, THRESHOLDS.shellFrame.tolerancePx], [12, 52, 0.5]);
  assert.ok(Object.isFrozen(THRESHOLDS.controlHeight.allowedPx));
});

test("thresholds are required and validated key by key", () => {
  assert.throws(() => assertThresholds(undefined), /gplus_measure_thresholds_required/);
  for (const [check, keys] of Object.entries(THRESHOLD_KEYS)) {
    for (const key of keys) {
      const broken = structuredClone(THRESHOLDS);
      delete broken[check][key];
      assert.throws(() => assertThresholds(broken), new RegExp(`gplus_measure_threshold_invalid:${check}\\.${key}`));
    }
  }
  const empty = structuredClone(THRESHOLDS);
  empty.controlHeight.allowedPx = [];
  assert.throws(() => assertThresholds(empty), /controlHeight\.allowedPx/);
  assert.throws(() => judgeMeasurements({ checks: {} }, {}), /gplus_measure_threshold_invalid/);
});

test("Node colour math matches the canvas formulas", () => {
  assert.equal(Math.round(contrastRatio(parseColor("#000"), parseColor("#ffffff")) * 100) / 100, 21);
  assert.equal(expectedContrast("#767676"), 4.54);
  assert.deepEqual(compositeOver(parseColor("rgba(0, 0, 0, 0.5)"), [255, 255, 255, 1]), [127.5, 127.5, 127.5, 1]);
  assert.equal(expectedContrast("#ffffff", ["#2b59c3"]), 6.33);
  assert.equal(expectedContrast("#1e3a8a", ["rgba(43, 89, 195, 0.12)"]), 8.68);
  assert.deepEqual(parseColor("#11223380"), [17, 34, 51, 128 / 255]);
  assert.throws(() => parseColor("oklch(0.5 0.1 120)"), /gplus_measure_color_unsupported/);
});

test("judgeMeasurements maps raw values to pass, fail and n/a against the thresholds", () => {
  const raw = {
    checks: {
      clip: { checked: 3, value: 0, violationCount: 0, violations: [] },
      singleLine: { checked: 2, value: 2, violationCount: 1, violations: [{ lines: 2 }] },
      shadowBlur: { checked: 1, value: 3, violationCount: 0, violations: [] },
      rail: { checked: 0, value: 0, violationCount: 0, violations: [], shells: [] },
      rowAlign: { checked: 1, value: 0.4, violationCount: 0, violations: [] },
      mark: { checked: 1, value: 1, violationCount: 1, violations: [{}] },
      contrast: { checked: 2, value: 0.05, violationCount: 0, violations: [], cells: [] },
      controlHeight: { checked: 1, value: 0, violationCount: 0, violations: [] },
      overlap: { checked: 4, value: 1, violationCount: 1, violations: [{}] }
    }
  };
  const verdict = judgeMeasurements(raw, THRESHOLDS);
  assert.equal(verdict.ok, false);
  assert.deepEqual(verdict.failed, ["singleLine", "mark", "overlap"]);
  assert.deepEqual(verdict.notApplicable, ["rail"]);
  assert.equal(verdict.checks.shadowBlur.status, "pass");
  assert.equal(verdict.checks.rowAlign.status, "pass");
  assert.deepEqual(verdict.checks.shadowBlur.limit, THRESHOLDS.shadowBlur);
  assert.deepEqual(judgeMeasurements({ error: "root_not_found", checks: {} }, THRESHOLDS).ok, false);
});

test("story routes follow the geometry-proof page#id rule", () => {
  const cases = [
    [{ id: "navigation-dense-operations-shell-spec", group: "Components", categoryId: "navigation-shells" }, "/components-navigation-shells.html#navigation-dense-operations-shell-spec"],
    [{ id: "owner-quality-product-shell", group: "Proof", categoryId: "proof-visual-instances" }, "/proof-proof-visual-instances.html#owner-quality-product-shell"],
    [{ id: "records-and-boards-patterns", group: "Patterns", categoryId: "data-pages" }, "/patterns-data-pages.html#records-and-boards-patterns"],
    [{ id: "welcome-governance", group: "Welcome", categoryId: "governance-entry" }, "/welcome-governance-entry.html#welcome-governance"],
    [{ id: "brand-identity", group: "Style Guide", categoryId: "identity-brand" }, "/style-guide-identity-brand.html#brand-identity"]
  ];
  for (const [entry, path] of cases) assert.equal(storyRoute(entry).path, path);
  assert.equal(groupFileName("Welcome"), "index.html");
  assert.equal(groupFileName("Change Log"), "change-log.html");
  assert.equal(categoryFileName("Components", "Forms & Workbench"), "components-forms-workbench.html");
  assert.equal(storySelector("actions-matrix"), '[data-contract-story-id="actions-matrix"]');
  assert.equal(storyBodySelector("actions-matrix"), '[data-contract-story-id="actions-matrix"] > [id="actions-matrix-region"]');
  const route = storyRoute({ id: "actions-matrix", group: "Components", categoryId: "actions" });
  assert.equal(storyUrl("http://127.0.0.1:4000/", route, { theme: "dark", locale: "zh-CN" }), "http://127.0.0.1:4000/components-actions.html?theme=dark&locale=zh-CN#actions-matrix");
  assert.equal(storyUrl("http://127.0.0.1:4000", route), "http://127.0.0.1:4000/components-actions.html#actions-matrix");
  assert.throws(() => storySelector('x"]'), /storybook_routes_invalid_story_id/);
});

test("G+ story ids are fixed in advance and resolved from the registry", () => {
  assert.deepEqual([...GPLUS_MATRIX_STORY_IDS], ["typography-matrix", "icon-matrix", "brand-matrix", "actions-matrix", "inputs-matrix"]);
  assert.deepEqual([...GPLUS_SAMPLE_STORY_IDS], ["typography-sample-billing", "icon-sample-project", "brand-sample-product", "actions-sample-project", "inputs-sample-members"]);
  assert.equal(new Set(GPLUS_STORY_IDS).size, 10);
  for (const id of GPLUS_STORY_IDS) assert.doesNotMatch(id, /aos|tms|workflow/);
  const registry = [
    { id: "actions-matrix", group: "Components", categoryId: "actions" },
    { id: "inputs-sample-members", group: "Patterns", categoryId: "forms-workbench" },
    { id: "brand-identity", group: "Style Guide", categoryId: "identity-brand" }
  ];
  const { routes, missing } = resolveStoryRoutes(GPLUS_STORY_IDS, registry);
  assert.deepEqual(routes.map((r) => r.path), ["/components-actions.html#actions-matrix", "/patterns-forms-workbench.html#inputs-sample-members"]);
  assert.equal(missing.length, 8);
  assert.equal(storyRouteTable(registry).size, 3);
  assert.throws(() => storyRouteTable([...registry, registry[0]]), /storybook_registry_duplicate_id:actions-matrix/);
  assert.throws(() => storyRoute({ id: "x", group: "Components" }), /storybook_routes_invalid_entry/);
});

test("the built registry is required and reported by code when absent", async () => {
  await assert.rejects(loadStoryRegistry({ root: fixtureDir }), (error) => error.code === "storybook_registry_missing");
});

test("every check has a red and a green fixture", () => {
  assert.deepEqual(fixtureCoverage(manifest), { ok: true, missingRed: [], missingGreen: [] });
  for (const spec of manifest.cases) assert.ok(readFileSync(new URL(`./fixtures/geometry-measure/${spec.file}`, import.meta.url), "utf8").includes("data-measure-root"), spec.file);
  const reds = manifest.cases.filter((spec) => (spec.fail ?? []).length);
  for (const id of CHECK_IDS) {
    assert.ok(reds.some((spec) => spec.fail.includes(id) && !spec.mutationCss), `${id}: red fixture file`);
    assert.ok(reds.some((spec) => spec.fail.includes(id) && spec.mutationCss && spec.file === "all.green.html"), `${id}: injected mutation on the clean page`);
  }
});

test("the fixture self-check is green as a whole", () => {
  const bad = selfCheck.cases.filter((item) => !item.ok).map((item) => `${item.id}: ${item.problems.join(", ")}`);
  assert.deepEqual(bad, []);
  assert.equal(selfCheck.ok, true);
  assert.equal(selfCheck.cases.length, manifest.cases.length);
});

for (const spec of manifest.cases) {
  const label = (spec.fail ?? []).length ? `red on ${spec.fail.join(", ")} only` : "green on every check";
  test(`fixture ${spec.id} (${spec.file}${spec.mutationCss ? " + mutation" : ""}) is ${label}`, () => {
    const result = selfCheck.cases.find((item) => item.id === spec.id);
    assert.ok(result, `missing result for ${spec.id}`);
    assert.deepEqual(result.problems, []);
    const verdict = selfCheck.verdicts[spec.id];
    if ((spec.fail ?? []).length) {
      assert.equal(verdict.ok, false);
      assert.deepEqual(verdict.failed, spec.fail);
      for (const id of spec.fail) assert.ok(verdict.checks[id].violations.length > 0, `${id} reports its violations`);
    } else {
      assert.equal(verdict.ok, true);
      for (const id of spec.pass ?? []) assert.ok(verdict.checks[id].checked > 0, `${id} measured something`);
    }
  });
}

test("the clean page reports every check value", () => {
  const verdict = selfCheck.verdicts["all-green"];
  assert.deepEqual(Object.keys(verdict.checks), [...CHECK_IDS]);
  for (const id of CHECK_IDS) {
    assert.equal(verdict.checks[id].status, "pass", id);
    assert.ok(verdict.checks[id].value === null || typeof verdict.checks[id].value === "number", id);
  }
  assert.equal(verdict.checks.contrast.cells.length, 9);
  assert.deepEqual(verdict.checks.rail.shells[0].guideLefts, [16]);
  assert.deepEqual(verdict.checks.rail.shells[0].textLefts, [48]);
  assert.deepEqual(verdict.checks.shellFrame.shells[0].paperInsets, { top: 12, end: 12, bottom: 12 });
  assert.equal(verdict.checks.shellFrame.shells[0].topBarHeightPx, 52);
  assert.deepEqual(verdict.checks.controlHeight.controls.map((c) => c.heightPx), [32, 28, 40]);
});

test("a missing measurement root is an error, not a pass", async () => {
  const [result] = await runMeasureTargets({ targets: [{ id: "no-root", html: "<main>empty</main>", root: "#absent" }], thresholds: THRESHOLDS, browser });
  assert.equal(result.raw.error, "root_not_found");
  assert.equal(result.verdict.ok, false);
});

test("measurePage refuses to run without thresholds", async () => {
  await assert.rejects(measurePage(null, { root: "body" }), /gplus_measure_thresholds_required/);
});

test("evaluateFixtureCase flags a red case that also fails another check", () => {
  const verdict = judgeMeasurements({
    checks: {
      mark: { checked: 1, value: 1, violationCount: 1, violations: [{}] },
      overlap: { checked: 1, value: 1, violationCount: 1, violations: [{}] }
    }
  }, THRESHOLDS);
  const result = evaluateFixtureCase({ id: "x", file: "x.html", fail: ["mark"] }, verdict);
  assert.equal(result.ok, false);
  assert.ok(result.problems.includes("overlap:unexpected_fail"));
  assert.ok(result.problems.includes("clip:unexpected_missing"));
});

test("the gate reports missing static docs instead of passing", async () => {
  const report = await runGeometryMeasureProof({ root: fixtureDir, selfCheck: false });
  assert.equal(report.ok, false);
  assert.equal(report.reason, "static_docs_missing");
  assert.deepEqual(report.storyIds, [...GPLUS_STORY_IDS]);
  assert.equal(DEFAULT_PATHS.reportPath, "docs/verification/geometry-measure/report.json");
});

test("the gate runs its self-check first and never passes on a missing story", async () => {
  const report = await runGeometryMeasureProof({ root: repoRoot, browser, storyIds: ["actions-matrix"], themes: ["light"] });
  assert.equal(report.selfCheck.ok, true);
  if (report.reason !== null) {
    assert.match(report.reason, /static_docs_missing|storybook_registry_missing/);
    assert.equal(report.ok, false);
  } else if (report.missingStories.length) {
    assert.deepEqual(report.missingStories, ["actions-matrix"]);
    assert.equal(report.ok, false);
  } else {
    assert.equal(report.runs.length, 1);
    assert.deepEqual(Object.keys(report.summary), [...CHECK_IDS]);
  }
});

// TCRN-DS-SUB-035 prerequisite: the static pages copy the package CSS under `.story-body`
// (apps/storybook/src/build/page-template.tsx). The copy used to cut `:where(:hover,[data-tcrn-preview-state="hover"])`
// at its inner comma, so the browser dropped every state rule and the scoped base rule won; these tests
// lock the top-level split, one-line rules and nested group rules. They need the built storybook app.
const pageTemplateModule = new URL("../apps/storybook/dist/build/page-template.js", import.meta.url);
const componentCssModule = new URL("../packages/ui-react/dist/index.js", import.meta.url);

const storybookBuilt = existsSync(fileURLToPath(pageTemplateModule)) && existsSync(fileURLToPath(componentCssModule));
const needsBuild = { skip: !storybookBuilt && "storybook app not built (pnpm build)" };

async function loadBuilt(moduleUrl) {
  if (!existsSync(fileURLToPath(moduleUrl))) assert.fail(`build first (pnpm build): ${fileURLToPath(moduleUrl)} is missing`);
  return import(moduleUrl.href);
}

// Parses CSS in Chromium (invalid selectors drop their whole rule there) and lists every style rule.
async function parsedStyleRules(css) {
  const page = await browser.newPage();
  try {
    return await page.evaluate((text) => {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(text);
      const rules = [];
      const walk = (list, context) => {
        for (const rule of list) {
          if (rule instanceof CSSStyleRule) rules.push({ selector: rule.selectorText, context });
          else if (rule instanceof CSSKeyframesRule) continue;
          else if (rule.cssRules) walk(rule.cssRules, `${context}${rule.cssText.slice(0, rule.cssText.indexOf("{")).trim()} `);
        }
      };
      walk(sheet.cssRules, "");
      return rules;
    }, css);
  } finally {
    await page.close();
  }
}

test("page-template scoping splits a selector list only at its top-level commas", needsBuild, async () => {
  const { splitTopLevelSelectors } = await loadBuilt(pageTemplateModule);
  const parts = splitTopLevelSelectors('.tcrn-button:where(:hover,[data-tcrn-preview-state="hover"]), .tcrn-tag[data-label="a,b"],\n.tcrn-row:not(.is-a, .is-b) /* c, d */');
  assert.deepEqual(parts.map((part) => part.trim()), [
    '.tcrn-button:where(:hover,[data-tcrn-preview-state="hover"])',
    '.tcrn-tag[data-label="a,b"]',
    ".tcrn-row:not(.is-a, .is-b) /* c, d */"
  ]);
});

test("page-template scoping keeps state rules, one-line rules and nested group rules", needsBuild, async () => {
  const { scopeComponentCss } = await loadBuilt(pageTemplateModule);
  const css = [
    "/* states { a, b } */",
    '.tcrn-button,.tcrn-link-button{--tcrn-pair-fill:var(--tcrn-pair-fill-d)}.tcrn-button:where(:hover,[data-tcrn-preview-state="hover"]){--tcrn-pair-fill:var(--tcrn-pair-fill-h)}',
    '.tcrn-input:where(:focus-visible,[data-tcrn-preview-state="focus"]),',
    '.tcrn-select:is(:focus-within, [data-tcrn-preview-state="focus"]) {',
    "  outline: 2px solid var(--tcrn-focus-ring);",
    "}",
    ":root{--tcrn-scope-probe:1}",
    '[data-tcrn-theme="dark"] .tcrn-switch:where(:checked,[aria-checked="true"]){color:red}',
    '@media (min-width: 720px){.tcrn-row{display:grid}.tcrn-row:where(:hover,[data-tcrn-preview-state="hover"]){gap:4px}}',
    "@keyframes tcrn-scope-spin{from{transform:rotate(0)}to{transform:rotate(1turn)}}",
    '.tcrn-after{content:"}"}'
  ].join("\n");
  const scoped = scopeComponentCss(css, ".story-body");
  assert.match(scoped, /\.story-body \.tcrn-button:where\(:hover,\[data-tcrn-preview-state="hover"\]\) \{/);
  assert.match(scoped, /\.story-body \.tcrn-row:where\(:hover,\[data-tcrn-preview-state="hover"\]\) \{gap:4px\}/);
  assert.match(scoped, /@keyframes tcrn-scope-spin\{from\{transform:rotate\(0\)\}to\{transform:rotate\(1turn\)\}\}/);
  assert.match(scoped, /\.story-body \{--tcrn-scope-probe:1\}/);
  assert.match(scoped, /\.story-body \.tcrn-after \{content:"\}"\}/);
  const before = await parsedStyleRules(css);
  const after = await parsedStyleRules(scoped);
  assert.equal(before.length, 8);
  assert.equal(after.length, before.length, "no scoped rule may be dropped by the browser");
  for (const rule of after) {
    for (const selector of splitTopLevelSelectorsForTest(rule.selector)) {
      assert.match(selector.trim(), /^(?:\[data-tcrn-theme="dark"\] )?\.story-body\b/, `unscoped selector: ${selector}`);
    }
  }
  assert.ok(after.some((rule) => rule.context.startsWith("@media") && rule.selector.includes('[data-tcrn-preview-state="hover"]')));
});

function splitTopLevelSelectorsForTest(list) {
  const parts = [];
  let depth = 0;
  let start = 0;
  for (let index = 0; index < list.length; index += 1) {
    const char = list[index];
    if (char === "(" || char === "[") depth += 1;
    else if (char === ")" || char === "]") depth -= 1;
    else if (char === "," && depth === 0) {
      parts.push(list.slice(start, index));
      start = index + 1;
    }
  }
  parts.push(list.slice(start));
  return parts;
}

test("page-template scoping keeps every rule of the package CSS, state rules included", needsBuild, async () => {
  const { scopeComponentCss } = await loadBuilt(pageTemplateModule);
  const { tcrnComponentCss } = await loadBuilt(componentCssModule);
  const before = await parsedStyleRules(tcrnComponentCss);
  const after = await parsedStyleRules(scopeComponentCss(tcrnComponentCss, ".story-body"));
  assert.equal(after.length, before.length);
  const stateRules = (rules) => rules.filter((rule) => rule.selector.includes("data-tcrn-preview-state")).length;
  assert.ok(stateRules(before) > 0);
  assert.equal(stateRules(after), stateRules(before));
  const unscoped = after.flatMap((rule) => splitTopLevelSelectorsForTest(rule.selector).map((selector) => selector.trim())).filter((selector) => !/^(?:(?:html)?\[data-tcrn-theme[^\]]*\] )?\.story-body\b/.test(selector));
  assert.deepEqual(unscoped, []);
});

test("the before-bg probe reads the ::before background (the Switch knob)", async () => {
  const knob = "#ffffff";
  const track = "#1f4e79";
  const expect = Math.round(contrastRatio(parseColor(knob), parseColor(track)) * 100) / 100;
  const html = `<!doctype html><html><head><style>
    .track { position: relative; display: inline-block; width: 40px; height: 20px; background: ${track}; }
    .track::before { content: ""; position: absolute; left: 2px; top: 2px; width: 16px; height: 16px; background: ${knob}; }
  </style></head><body><main data-measure-root><span class="track" data-cell="knob" data-probe="before-bg" data-kind="ui" data-expect="${expect}"></span></main></body></html>`;
  const [green, red] = await runMeasureTargets({
    browser,
    thresholds: THRESHOLDS,
    targets: [
      { id: "knob", html, root: "[data-measure-root]", measure: { checks: ["contrast"] } },
      { id: "knob-mutated", html, root: "[data-measure-root]", measure: { checks: ["contrast"] }, mutationCss: ".track::before { background: #8a8a8a; }" }
    ]
  });
  assert.equal(green.verdict.checks.contrast.status, "pass");
  assert.equal(green.raw.checks.contrast.cells[0].ratio, expect);
  assert.equal(red.verdict.checks.contrast.status, "fail");
  assert.ok(red.raw.checks.contrast.violations[0].reasons.includes("diff"));
});

// TCRN-DS-SUB-035: the gate wired to the G+ matrix and sample stories.
import {
  GPLUS_FAMILIES,
  ICON_STROKE,
  REQUIRED_CHECKS,
  SET_REQUIRED_CHECKS,
  STORY_MUTATIONS,
  STORY_PROBES,
  compactVerdict,
  datePickerIndicatorHit,
  focusRingClipInPage,
  highlightWidthInPage,
  iconStrokeInPage,
  measuredStoryIds
} from "../scripts/geometry-measure-proof.mjs";

const staticDocsBuilt = existsSync(fileURLToPath(new URL("../apps/storybook/storybook-static", import.meta.url)));

test("every G+ story has its required checks and the families split the ten ids", () => {
  assert.deepEqual(Object.keys(REQUIRED_CHECKS).sort(), [...GPLUS_STORY_IDS].sort());
  for (const checks of Object.values(REQUIRED_CHECKS)) for (const id of checks) assert.ok(CHECK_IDS.includes(id), id);
  assert.deepEqual([...SET_REQUIRED_CHECKS], [...CHECK_IDS]);
  assert.deepEqual(Object.keys(GPLUS_FAMILIES), ["typography", "icon", "brand", "actions", "inputs"]);
  assert.deepEqual(Object.values(GPLUS_FAMILIES).flat().sort(), [...GPLUS_STORY_IDS].sort());
});

// TCRN-DS-SUB-077 (C-12): the required checks follow what each board carries. A sample has no
// data-cell, so contrast was n/a on all five; rail and the TableShell rows are what a sample carries,
// and the actions and inputs matrices declare their control heights (data-h, SUB-074).
const storybookMap = JSON.parse(readFileSync(new URL("../docs/design/gplus-2026-10/storybook-map.json", import.meta.url), "utf8"));
const ANY_PAGE = ["clip", "singleLine", "shadowBlur", "overlap"];
const TABLE_SHELL_SAMPLES = ["typography-sample-billing", "icon-sample-project", "brand-sample-product", "actions-sample-project"];

test("samples must measure rail and their table rows but not contrast; actions and inputs matrices control height", () => {
  for (const checks of Object.values(REQUIRED_CHECKS)) for (const id of ANY_PAGE) assert.ok(checks.includes(id), id);
  for (const id of GPLUS_SAMPLE_STORY_IDS) {
    assert.ok(!REQUIRED_CHECKS[id].includes("contrast"), `${id}: a sample has no data-cell`);
    assert.ok(REQUIRED_CHECKS[id].includes("rail"), `${id}: rail`);
    assert.ok(REQUIRED_CHECKS[id].includes("shellFrame"), `${id}: shellFrame (TCRN-DS-SUB-094)`);
    assert.equal(REQUIRED_CHECKS[id].includes("rowAlign"), TABLE_SHELL_SAMPLES.includes(id), `${id}: rowAlign with TableShell rows only`);
  }
  for (const id of GPLUS_MATRIX_STORY_IDS) {
    assert.ok(REQUIRED_CHECKS[id].includes("contrast"), `${id}: contrast`);
    assert.ok(!REQUIRED_CHECKS[id].includes("rail"), `${id}: a matrix has no shell`);
    assert.ok(!REQUIRED_CHECKS[id].includes("shellFrame"), `${id}: a matrix has no shell frame`);
    assert.equal(REQUIRED_CHECKS[id].includes("controlHeight"), ["actions-matrix", "inputs-matrix"].includes(id), `${id}: controlHeight`);
  }
});

test("the storybook map rows list the gate's required checks (the any-page four aside) and DIFF-6 records before-bg", () => {
  for (const id of GPLUS_STORY_IDS) {
    const rows = storybookMap.rows.filter((row) => row.storyId === id);
    assert.ok(rows.length > 0, `${id}: no map row`);
    const fromMap = new Set([...ANY_PAGE, ...rows.flatMap((row) => row.requiredChecks)]);
    assert.deepEqual([...fromMap].sort(), [...new Set(REQUIRED_CHECKS[id])].sort(), id);
  }
  for (const row of storybookMap.rows.filter((item) => item.kind === "sample")) assert.ok(!row.requiredChecks.includes("contrast"), row.row);
  const diff6 = storybookMap.differences.find((item) => item.id === "DIFF-6");
  assert.equal(diff6.status, "测量库已支持 before-bg（W5-C）");
  assert.doesNotMatch(diff6.story, /unknown_probe/);
});

test("on the built docs no required check is n/a: samples measure rail and rows, actions and inputs control height", { skip: !staticDocsBuilt && "static docs not built (pnpm build)" }, async () => {
  const report = await runGeometryMeasureProof({ root: repoRoot, browser, selfCheck: false, storyIds: [...GPLUS_STORY_IDS], themes: ["light"], mutations: [], probes: [] });
  assert.equal(report.reason, null);
  assert.deepEqual(report.missingStories, []);
  assert.equal(report.runs.length, GPLUS_STORY_IDS.length);
  for (const run of report.runs) assert.deepEqual(run.notApplicableRequired, [], run.storyId);
  for (const id of ["actions-matrix", "inputs-matrix"]) assert.equal(report.runs.find((run) => run.storyId === id).verdict.checks.controlHeight.status, "pass", id);
});

test("STORY-131 GWT1-3 each have a real-story mutation on the check they name", () => {
  const bySource = Object.fromEntries(STORY_MUTATIONS.map((mutation) => [mutation.source, mutation]));
  assert.equal(bySource["131-GWT1"].check, "rowAlign");
  assert.equal(bySource["131-GWT1"].storyId, "table-record-index-spec");
  assert.match(bySource["131-GWT1"].css, /padding-left: 8px/);
  assert.equal(bySource["131-GWT2"].check, "mark");
  assert.match(bySource["131-GWT2"].css, /mark \{ padding: 2px/);
  assert.equal(bySource["131-GWT3"].check, "shadowBlur");
  assert.match(bySource["131-GWT3"].css, /box-shadow: 0 1px 4px/);
  // TCRN-DS-SUB-094: the paper flush with the shell edge and the top bar back at 68 each name shellFrame.
  const shellFrameMutations = STORY_MUTATIONS.filter((mutation) => mutation.check === "shellFrame");
  assert.deepEqual(shellFrameMutations.map((mutation) => mutation.id), ["shell-paper-inset-zero", "shell-top-bar-68"]);
  assert.match(shellFrameMutations[0].css, /\.tcrn-product-shell__workspace \{ margin: 0 !important; \}/);
  assert.match(shellFrameMutations[1].css, /\.tcrn-top-bar \{ min-height: 68px !important; \}/);
  for (const mutation of shellFrameMutations) assert.ok(GPLUS_SAMPLE_STORY_IDS.includes(mutation.storyId), mutation.id);
  assert.deepEqual(STORY_PROBES.map((probe) => probe.id), ["buttonGroupFocusRing", "datePickerIndicatorHit", "highlightWidth", "iconStroke"]);
  const iconStroke = STORY_PROBES.find((probe) => probe.id === "iconStroke");
  assert.deepEqual([iconStroke.storyId, iconStroke.source], ["icon-matrix", "124-GWT1"]);
  assert.deepEqual([ICON_STROKE.sizePx, ICON_STROKE.strokeWidthPx, ICON_STROKE.vectorEffect], [16, 1.25, "non-scaling-stroke"]);
  assert.match(ICON_STROKE.iconSelector, /^svg\.tcrn-icon\[data-gplus-icon-size="16"\]$/);
});

test("the measured set is the G+ ids plus gplus-* registry stories, or one family", () => {
  const registry = [{ id: "actions-matrix", group: "Components", categoryId: "gplus-matrices" }, { id: "actions-sample-extra", group: "Components", categoryId: "gplus-samples" }, { id: "button-spec-usage", group: "Components", categoryId: "controls-data" }];
  assert.deepEqual(measuredStoryIds({ registry }), [...GPLUS_STORY_IDS, "actions-sample-extra"]);
  assert.deepEqual(measuredStoryIds({ registry, family: "actions" }), [...GPLUS_FAMILIES.actions, "actions-sample-extra"]);
  assert.deepEqual(measuredStoryIds({ registry, storyIds: ["button-spec-usage"] }), ["button-spec-usage"]);
  assert.throws(() => measuredStoryIds({ registry, family: "tables" }), (error) => error.code === "unknown_family");
});

test("the compact verdict keeps every value and the contrast cells with their differences", () => {
  const compact = compactVerdict({ ok: false, failed: ["contrast"], notApplicable: [], checks: { contrast: { status: "fail", value: 0.6, limit: 0.05, violationCount: 1, violations: [{ cell: "a" }], cells: [{ cell: "a", ratio: 6.2, expect: 6.8, diff: -0.6 }] } } });
  assert.deepEqual(compact.checks.contrast.cells, [["a", 6.2, 6.8, -0.6]]);
  assert.equal(compact.checks.contrast.value, 0.6);
});

async function onPage(html, run) {
  const tab = await browser.newPage({ viewport: { width: 800, height: 400 } });
  try {
    await tab.setContent(html);
    return await run(tab);
  } finally {
    await tab.close();
  }
}

const groupHtml = (groupCss) => `<!doctype html><html><head><style>
.tcrn-button-group { display: inline-flex; padding: 0; ${groupCss} }
button { height: 28px; border: 0; }
button[data-tcrn-preview-state="focus"] { box-shadow: 0 0 0 2px #fff, 0 0 0 4px #0b6b65; }
</style></head><body><main id="root" style="padding: 24px"><div class="tcrn-button-group"><button>Day</button><button>Week</button></div></main></body></html>`;

test("the ButtonGroup focus ring probe turns red when a clipping group cuts the ring", async () => {
  const green = await onPage(groupHtml(""), (tab) => tab.evaluate(focusRingClipInPage, { root: "#root" }));
  assert.equal(green.checked, 2);
  assert.equal(green.violationCount, 0);
  const red = await onPage(groupHtml("overflow: hidden;"), (tab) => tab.evaluate(focusRingClipInPage, { root: "#root" }));
  assert.equal(red.violationCount, 2);
  assert.equal(red.violations[0].cutPx, 4);
});

test("the Highlight width probe turns red when a mark changes the text width", async () => {
  const html = (markCss) => `<!doctype html><html><head><style>mark { background: #fde68a; ${markCss} }</style></head><body><main id="root"><span class="tcrn-highlight-text">PRJ-<mark class="tcrn-highlight__mark">2026</mark>-0412</span></main></body></html>`;
  const green = await onPage(html(""), (tab) => tab.evaluate(highlightWidthInPage, { root: "#root" }));
  assert.equal(green.checked, 1);
  assert.equal(green.violationCount, 0);
  const red = await onPage(html("padding: 0 2px;"), (tab) => tab.evaluate(highlightWidthInPage, { root: "#root" }));
  assert.equal(red.violationCount, 1);
  assert.equal(red.violations[0].diffPx, 4);
});

// TCRN-DS-SUB-056: 124-GWT1. The page mirrors the package Icon (stroke on the svg, vector-effect on
// each child) with two 16px icons and one 20px icon whose 2px stroke the probe must leave alone.
const iconStrokeHtml = (iconCss) => `<!doctype html><html><head><style>
svg.tcrn-icon { stroke-width: 1.25; }
svg.tcrn-icon > * { vector-effect: non-scaling-stroke; }
svg.tcrn-icon[data-gplus-icon-size="20"] { stroke-width: 2; }
${iconCss}
</style></head><body><main id="root">
<svg class="tcrn-icon" data-gplus-icon-size="16" data-icon-name="layers" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="m3 16 9 5 9-5"/></svg>
<svg class="tcrn-icon" data-gplus-icon-size="16" data-icon-name="settings" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3"/></svg>
<svg class="tcrn-icon" data-gplus-icon-size="20" data-icon-name="layers" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3 3 8l9 5 9-5-9-5Z"/></svg>
</main></body></html>`;

test("the icon stroke probe turns red when a 16px icon is stroked 2px or loses non-scaling-stroke", async () => {
  const probe = (css) => onPage(iconStrokeHtml(css), (tab) => tab.evaluate(iconStrokeInPage, { ...ICON_STROKE, root: "#root" }));
  const green = await probe("");
  assert.equal(green.checked, 2);
  assert.equal(green.children, 3);
  assert.equal(green.violationCount, 0, JSON.stringify(green.violations));
  assert.equal(green.value, 0);
  assert.deepEqual(green.strokeWidths, ["1.25px"]);
  assert.deepEqual(green.vectorEffects, ["non-scaling-stroke"]);
  const thick = await probe('svg.tcrn-icon[data-gplus-icon-size="16"] { stroke-width: 2; }');
  assert.equal(thick.violationCount, 3);
  assert.equal(thick.value, 0.75);
  assert.ok(thick.violations.every((violation) => violation.strokeWidth === "2px" && violation.reasons.includes("strokeWidth")));
  const scaling = await probe("svg.tcrn-icon > * { vector-effect: none; }");
  assert.equal(scaling.violationCount, 3);
  assert.ok(scaling.violations.every((violation) => violation.reasons.join() === "vectorEffect"));
  const resized = await probe('svg.tcrn-icon[data-gplus-icon-size="16"] { width: 14px; height: 14px; }');
  assert.ok(resized.violations.some((violation) => violation.reasons.includes("size")));
  const none = await onPage("<main id=\"root\"></main>", (tab) => tab.evaluate(iconStrokeInPage, { ...ICON_STROKE, root: "#root" }));
  assert.equal(none.checked, 0);
});

test("the DatePicker probe needs the right 30px to be the native indicator, reachable by a click", async () => {
  const html = (iconCss) => `<!doctype html><html><head><style>
.wrap { position: relative; display: inline-block; }
.tcrn-date-picker { position: relative; width: 160px; height: 32px; border: 0; padding: 0 30px 0 8px; }
.tcrn-date-picker::-webkit-calendar-picker-indicator { position: absolute; inset-block: 0; inset-inline-end: 0; inline-size: 30px; block-size: 100%; margin: 0; padding: 0; opacity: 0; }
.icon { position: absolute; right: 0; top: 0; width: 30px; height: 32px; ${iconCss} }
</style></head><body><main id="root"><span class="wrap"><input class="tcrn-date-picker" type="date" value="2026-10-31"><span class="icon"></span></span></main></body></html>`;
  const green = await onPage(html("pointer-events: none;"), (tab) => datePickerIndicatorHit(tab, "#root"));
  assert.equal(green.checked, 1);
  assert.equal(green.violationCount, 0, JSON.stringify(green.violations));
  const red = await onPage(html(""), (tab) => datePickerIndicatorHit(tab, "#root"));
  assert.equal(red.violationCount, 1);
  assert.deepEqual(red.violations[0].reached, [false, false, false]);
});

test("on the built docs the real-story mutations are caught and the probes pass", { skip: !staticDocsBuilt && "static docs not built (pnpm build)" }, async () => {
  const report = await runGeometryMeasureProof({ root: repoRoot, browser, selfCheck: false, storyIds: ["typography-matrix", "icon-matrix", "actions-matrix", "inputs-matrix", "table-record-index-spec", "icon-sample-project"], themes: ["light"] });
  assert.equal(report.reason, null);
  assert.deepEqual(report.missingStories, []);
  assert.deepEqual(report.mutations.map((mutation) => [mutation.id, mutation.killed]), STORY_MUTATIONS.map((mutation) => [mutation.id, true]));
  assert.deepEqual(report.probes.map((probe) => [probe.id, probe.status]), STORY_PROBES.map((probe) => [probe.id, "pass"]));
  const iconStroke = report.probes.find((probe) => probe.id === "iconStroke");
  assert.ok(iconStroke.checked > 0, "the 16px row was found");
  assert.deepEqual([iconStroke.strokeWidths, iconStroke.vectorEffects], [["1.25px"], ["non-scaling-stroke"]]);
  for (const id of ["typography-matrix", "actions-matrix"]) {
    const run = report.runs.find((item) => item.storyId === id);
    assert.equal(run.ok, true, `${id}: ${JSON.stringify(run.failed)} ${JSON.stringify(run.notApplicableRequired)}`);
  }
});

test("--family runs one family and keeps a missing sample red", { skip: !staticDocsBuilt && "static docs not built (pnpm build)" }, async () => {
  const report = await runGeometryMeasureProof({ root: repoRoot, browser, selfCheck: false, family: "brand", themes: ["light"] });
  assert.deepEqual(report.storyIds.slice(0, 2), [...GPLUS_FAMILIES.brand]);
  assert.ok(report.runs.every((run) => run.storyId.startsWith("brand-")));
  assert.deepEqual(report.mutations, []);
  assert.deepEqual(report.checksNeverApplied, [], "set-level coverage applies to full runs only");
  if (report.missingStories.length) {
    assert.ok(report.missingStories.every((id) => GPLUS_SAMPLE_STORY_IDS.includes(id)));
    assert.equal(report.ok, false);
  }
});
