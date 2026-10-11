// SPDX-License-Identifier: Apache-2.0
// G+ DOM measurement library, story routes and gate skeleton (TCRN-DS-STORY-131, TCRN-DS-SUB-034).
import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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
