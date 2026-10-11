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
//
// Every run starts with the fixture self-check (tests/fixtures/geometry-measure/manifest.json): each
// check must turn red on its injected violation and stay green on the clean pages, in the Chromium that
// is about to measure the stories. Then each G+ matrix and sample story is opened on its category page
// in every theme and measured inside its rendered region (the documentation chrome around it is not
// measured). STORY_MUTATIONS adds injected mutations on real
// stories (each must turn its check red) and REQUIRED_CHECKS names the checks a story must exercise
// (an n/a there fails); both are filled when the gate is wired to the stories.
//
// Usage: node scripts/geometry-measure-proof.mjs [--self-check-only] [--story <id>]... [--write-report]
//   Run from the repository root after `pnpm build` (the static docs and the built registry must
//   exist; --self-check-only needs neither). Prints the JSON report; exit code 1 when not ok.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { CHECK_IDS, MEASURE_SCHEMA_VERSION, assertThresholds, runMeasureTargets, startStaticServer } from "./lib/gplus-measure.mjs";
import { GPLUS_STORY_IDS, STATIC_DOCS_ROOT, STORY_REGISTRY_MODULE, expandStory, loadStoryRegistry, resolveStoryRoutes, storyUrl } from "./lib/storybook-routes.mjs";

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
  overlap: { maxOverlaps: 0, minIntersectPx: 1 }
});

export const DEFAULT_PATHS = Object.freeze({
  staticRoot: STATIC_DOCS_ROOT,
  registryModule: STORY_REGISTRY_MODULE,
  fixtureManifest: "tests/fixtures/geometry-measure/manifest.json",
  reportPath: "docs/verification/geometry-measure/report.json"
});

export const DEFAULT_RUN = deepFreeze({ viewport: { width: 1440, height: 900 }, themes: ["light", "dark"], locale: "en" });

// storyId -> check ids the story must exercise (status n/a fails). Filled when wired to the stories.
export const REQUIRED_CHECKS = deepFreeze({});

// { id, storyId, check, css, theme? } — injected on the real story; check must turn red.
export const STORY_MUTATIONS = deepFreeze([]);

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

export async function runGeometryMeasureProof({
  root = process.cwd(),
  storyIds = GPLUS_STORY_IDS,
  themes = DEFAULT_RUN.themes,
  locale = DEFAULT_RUN.locale,
  viewport = DEFAULT_RUN.viewport,
  mutations = STORY_MUTATIONS,
  requiredChecks = REQUIRED_CHECKS,
  thresholds = THRESHOLDS,
  selfCheck = true,
  browser
} = {}) {
  assertThresholds(thresholds);
  const report = {
    schemaVersion: SCHEMA_VERSION,
    measureSchemaVersion: MEASURE_SCHEMA_VERSION,
    ok: false,
    reason: null,
    thresholds,
    run: { viewport, themes: [...themes], locale },
    storyIds: [...storyIds],
    selfCheck: null,
    missingStories: [],
    runs: [],
    mutations: [],
    summary: {}
  };
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
      const { routes, missing } = resolveStoryRoutes(storyIds, registry);
      report.missingStories = missing;
      const server = await startStaticServer(staticRoot);
      try {
        const targets = [];
        for (const theme of themes) {
          for (const route of routes) {
            targets.push({ id: `${route.id}@${theme}`, storyId: route.id, theme, route: route.path, url: storyUrl(server.origin, route, { theme, locale }), root: route.bodySelector, prepare: (page) => expandStory(page, route.id) });
          }
        }
        for (const mutation of mutations) {
          const route = routes.find((item) => item.id === mutation.storyId);
          if (!route) {
            report.mutations.push({ id: mutation.id, storyId: mutation.storyId, check: mutation.check, killed: false, reason: "story_missing" });
            continue;
          }
          const theme = mutation.theme ?? themes[0];
          targets.push({ id: `mutation:${mutation.id}`, mutation, theme, url: storyUrl(server.origin, route, { theme, locale }), root: route.bodySelector, prepare: (page) => expandStory(page, route.id), mutationCss: mutation.css });
        }
        const results = await runMeasureTargets({ targets, thresholds, browser: active, viewport });
        results.forEach((result, index) => {
          const target = targets[index];
          if (target.mutation) {
            const status = result.verdict.checks?.[target.mutation.check]?.status ?? "missing";
            report.mutations.push({ id: target.mutation.id, storyId: target.mutation.storyId, check: target.mutation.check, theme: target.theme, status, killed: status === "fail" });
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
      } finally {
        await server.close();
      }
    }
  } finally {
    if (owned) await owned.close();
  }
  report.summary = summarize(report.runs);
  report.ok = !report.reason
    && (!selfCheck || report.selfCheck?.ok === true)
    && report.missingStories.length === 0
    && report.runs.length > 0
    && report.runs.every((run) => run.ok)
    && report.mutations.every((mutation) => mutation.killed);
  return report;
}

if (process.argv[1]?.endsWith("geometry-measure-proof.mjs")) {
  const args = process.argv.slice(2);
  const flags = new Set(args.filter((arg) => arg.startsWith("--")));
  const stories = args.flatMap((arg, index) => (arg === "--story" && args[index + 1] ? [args[index + 1]] : []));
  const root = process.cwd();
  let report;
  if (flags.has("--self-check-only")) {
    const result = await runFixtureSelfCheck({ root });
    report = { schemaVersion: SCHEMA_VERSION, measureSchemaVersion: MEASURE_SCHEMA_VERSION, ok: result.ok, thresholds: THRESHOLDS, selfCheck: { ok: result.ok, coverage: result.coverage, cases: result.cases } };
  } else {
    report = await runGeometryMeasureProof({ root, storyIds: stories.length ? stories : GPLUS_STORY_IDS });
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
