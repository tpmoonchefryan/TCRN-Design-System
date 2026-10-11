#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
// TCRN-DS-STORY-130 (TCRN-DS-SUB-033) — storybook-visual-proof: the G+ canvas board -> story map
// (docs/design/gplus-2026-10/storybook-map.json, human view storybook-map.md) reconciled with the story
// list, and every map row measured on the static docs (Track B). Red when:
//   map        a row, unmapped entry or difference is incomplete or points at an unknown check / ref
//   coverage   a canvas.json board or a lettered board section (class="sec"><h3><b>X</b>) has no entry,
//              or the map names a board / lettered section that does not exist
//   stories    map and story list differ either way (story list = GPLUS_STORY_IDS plus every registry
//              story in a gplus-* category)
//   rows       a row has no report row, a check fails (eight measurements + overlap), a requiredChecks
//              item is n/a, or the cells differ from the contract (count, ids) or the board (data-expect)
//   mutations  an injected mutation on a real story does not turn its check red
// Measurements: scripts/lib/gplus-measure.mjs; routes: scripts/lib/storybook-routes.mjs (both read-only).
// Thresholds: scripts/geometry-measure-proof.mjs THRESHOLDS; the map and the library carry none.
// Screenshots are for eyes only (no pixel comparison), so none are taken. Replaces the retired exact-PNG
// stub (TCRN-DS-STORY-041); its history files in docs/verification/storybook-visual-proof/ stay as they
// are, next to the two gplus-map-report.* files this gate writes.
//
// Usage: node scripts/storybook-visual-proof.mjs [--kind matrix|sample]... [--theme light|dark]...
//          [--no-mutations] [--write-report]
//   After `pnpm build`, from the repository root. Prints the JSON report; exit code 1 when not ok.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { CHECK_IDS, MEASURE_SCHEMA_VERSION, assertThresholds, runMeasureTargets, startStaticServer } from "./lib/gplus-measure.mjs";
import { GPLUS_MATRIX_STORY_IDS, GPLUS_SAMPLE_STORY_IDS, GPLUS_STORY_IDS, STATIC_DOCS_ROOT, STORY_REGISTRY_MODULE, expandStory, loadStoryRegistry, resolveStoryRoutes, storyUrl } from "./lib/storybook-routes.mjs";
import { THRESHOLDS as GEOMETRY_THRESHOLDS } from "./geometry-measure-proof.mjs";

export const SCHEMA_VERSION = "tcrn.ds.storybook-visual-proof.gplus-map.v1";
export const MAP_SCHEMA_VERSION = "tcrn.ds.storybook-map.v1";

// The eight measurements are EPIC-042's; their limits live in that gate and nowhere else.
export const THRESHOLDS = GEOMETRY_THRESHOLDS;
export const EIGHT_MEASUREMENTS = Object.freeze(CHECK_IDS.filter((id) => id !== "overlap"));

export const DEFAULT_PATHS = Object.freeze({
  map: "docs/design/gplus-2026-10/storybook-map.json",
  canvas: "docs/design/gplus-2026-10/boards/canvas.json",
  boardsDir: "docs/design/gplus-2026-10/boards",
  matrices: "docs/design/gplus-2026-10/contract/matrices.json",
  staticRoot: STATIC_DOCS_ROOT,
  registryModule: STORY_REGISTRY_MODULE,
  reportJson: "docs/verification/storybook-visual-proof/gplus-map-report.json",
  reportMd: "docs/verification/storybook-visual-proof/gplus-map-report.md"
});

export const DEFAULT_RUN = Object.freeze({
  viewport: Object.freeze({ width: 1440, height: 900 }),
  themes: Object.freeze(["light", "dark"]),
  locale: "en",
  kinds: Object.freeze(["matrix", "sample"])
});

export const ROW_KINDS = Object.freeze(["matrix", "sample"]);
export const STORY_CATEGORY_PREFIX = "gplus-";

// Selectors handed to the measurement (not thresholds): Highlight renders .tcrn-highlight__mark.
export const MEASURE_OPTIONS = Object.freeze({ markSelector: "mark, .tcrn-highlight__mark" });

// One injected mutation per check on a real story; each must turn its check red (runs when a row in
// scope references its story). The controlHeight mutation names its control through controlSelector
// (the actions and inputs matrices also declare data-h since SUB-074); matrices have no shell, so rail
// and shellFrame run on sample stories.
export const ROW_MUTATIONS = Object.freeze([
  { id: "clip-actions-button-out-of-section", storyId: "actions-matrix", check: "clip", css: '[data-gplus-matrix-component="Button"] { overflow: hidden !important; } [data-gplus-matrix-component="Button"] .tcrn-button { transform: translateX(-2000px) !important; }' },
  { id: "single-line-actions-label-first-letter", storyId: "actions-matrix", check: "singleLine", css: ".tcrn-button__label::first-letter { font-size: 48px !important; }" },
  { id: "shadow-blur-brand-logo-cloud", storyId: "brand-matrix", check: "shadowBlur", css: '[data-gplus-matrix-component="ProductLogo"] { box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3) !important; }' },
  { id: "rail-sample-guide-off-column", storyId: "typography-sample-billing", check: "rail", css: '[data-shell] [data-guide="rail"] { transform: translateX(6px) !important; }' },
  { id: "row-align-actions-second-row-indented", storyId: "actions-matrix", check: "rowAlign", css: '[data-gplus-matrix="actions"] table tr:nth-child(2) > :first-child { padding-left: 24px !important; }' },
  { id: "mark-typography-padded", storyId: "typography-matrix", check: "mark", css: "mark, .tcrn-highlight__mark { padding: 0 3px !important; }" },
  { id: "contrast-brand-wordmark-greyed", storyId: "brand-matrix", check: "contrast", theme: "light", css: '[data-cell="wm-l"] { color: #a0a0a0 !important; }' },
  { id: "control-height-actions-primary-34", storyId: "actions-matrix", check: "controlHeight", measure: { controlSelector: ".tcrn-button.tcrn-button--primary" }, css: ".tcrn-button.tcrn-button--primary { height: 34px !important; min-height: 34px !important; }" },
  { id: "overlap-brand-logo-row", storyId: "brand-matrix", check: "overlap", css: '[data-gplus-matrix-row="sans"] > :first-child { margin-right: -80px !important; }' },
  { id: "shell-frame-sample-paper-flush", storyId: "actions-sample-project", check: "shellFrame", css: "[data-shell] .tcrn-product-shell__workspace { margin: 0 !important; }" }
].map((mutation) => Object.freeze(mutation)));

const STORY_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const STATUS_RANK = { "n/a": 0, pass: 1, fail: 2 };

function readJson(root, path) {
  return JSON.parse(readFileSync(resolve(root, path), "utf8"));
}

export function loadMap({ root = process.cwd(), mapPath = DEFAULT_PATHS.map } = {}) {
  return readJson(root, mapPath);
}

// Structural check of the map. Returns a list of problem codes (empty when the map is usable).
export function validateMap(map) {
  if (!map || typeof map !== "object") return ["map_not_object"];
  const problems = [];
  const refs = map.refs && typeof map.refs === "object" ? map.refs : {};
  const filled = (value) => typeof value === "string" && value.trim() !== "";
  const need = (item, keys, prefix, label) => { for (const key of keys) if (!filled(item?.[key])) problems.push(`${prefix}_${key}_missing:${label}`); };
  if (map.schemaVersion !== MAP_SCHEMA_VERSION) problems.push(`map_schema:${map.schemaVersion}`);
  for (const key of ["rows", "unmapped", "differences"]) if (!Array.isArray(map[key]) || (key === "rows" && map[key].length === 0)) problems.push(`map_${key}_missing`);
  const differences = Array.isArray(map.differences) ? map.differences : [];
  const differenceIds = new Set();
  for (const item of differences) {
    if (!item?.id || differenceIds.has(item.id)) problems.push(`difference_id:${item?.id}`);
    differenceIds.add(item?.id);
    need(item, ["canvas", "story", "status"], "difference", item?.id);
    if (!Array.isArray(item?.boards) || item.boards.length === 0) problems.push(`difference_boards_missing:${item?.id}`);
    if (!Array.isArray(item?.refs) || item.refs.length === 0) problems.push(`difference_ruling_missing:${item?.id}`);
    for (const ref of item?.refs ?? []) if (!refs[ref]) problems.push(`difference_ref_unknown:${item?.id}:${ref}`);
  }
  const rowIds = new Set();
  for (const row of Array.isArray(map.rows) ? map.rows : []) {
    if (!row?.row || rowIds.has(row.row)) problems.push(`row_id:${row?.row}`);
    rowIds.add(row?.row);
    need(row, ["board", "section", "storyId", "storybookId", "kind"], "row", row?.row);
    if (row?.storyId && !STORY_ID_PATTERN.test(row.storyId)) problems.push(`row_story_id_invalid:${row.row}`);
    if (row?.kind && !ROW_KINDS.includes(row.kind)) problems.push(`row_kind_unknown:${row.row}:${row.kind}`);
    if (!Array.isArray(row?.requiredChecks)) problems.push(`row_required_checks_missing:${row?.row}`);
    for (const check of row?.requiredChecks ?? []) if (!CHECK_IDS.includes(check)) problems.push(`row_check_unknown:${row.row}:${check}`);
    if (row?.cells !== undefined && (!Number.isInteger(row.cells?.expected) || row.cells.expected < 1 || !filled(row.cells?.contract))) problems.push(`row_cells_invalid:${row.row}`);
    for (const id of row?.differences ?? []) if (!differenceIds.has(id)) problems.push(`row_difference_unknown:${row.row}:${id}`);
  }
  for (const entry of Array.isArray(map.unmapped) ? map.unmapped : []) {
    const label = `${entry?.board}#${entry?.section}`;
    need(entry, ["board", "section", "reason"], "unmapped", label);
    if (!Array.isArray(entry?.refs) || entry.refs.length === 0) problems.push(`unmapped_ruling_missing:${label}`);
    for (const ref of entry?.refs ?? []) if (!refs[ref]) problems.push(`unmapped_ref_unknown:${label}:${ref}`);
    for (const id of entry?.differences ?? []) if (!differenceIds.has(id)) problems.push(`unmapped_difference_unknown:${label}:${id}`);
  }
  return problems;
}

// Lettered sections (class="sec"><h3><b>A</b>); boards without them return [].
export function parseBoardSections(html) {
  const sections = [];
  for (const match of String(html).matchAll(/class="sec"><h3><b>([^<]+)<\/b>/g)) if (!sections.includes(match[1].trim())) sections.push(match[1].trim());
  return sections;
}

// data-cell -> data-expect as written on a board.
export function parseBoardCells(html) {
  const cells = new Map();
  for (const match of String(html).matchAll(/<[a-zA-Z][^>]*\sdata-cell="([^"]+)"[^>]*>/g)) {
    const expect = /\sdata-expect="([^"]*)"/.exec(match[0]);
    if (!cells.has(match[1])) cells.set(match[1], expect ? expect[1] : null);
  }
  return cells;
}

export function loadBoards({ root = process.cwd(), canvasPath = DEFAULT_PATHS.canvas, boardsDir = DEFAULT_PATHS.boardsDir } = {}) {
  const canvas = readJson(root, canvasPath);
  const boards = {};
  for (const name of Object.keys(canvas.boards ?? {})) {
    const file = resolve(root, boardsDir, name);
    boards[name] = existsSync(file) ? readFileSync(file, "utf8") : null;
  }
  return { canvas, boards };
}

// Every canvas board and every lettered section needs a row or an unmapped entry.
export function boardCoverage(map, canvas, boards) {
  const entries = [...(map.rows ?? []), ...(map.unmapped ?? [])];
  const canvasBoards = Object.keys(canvas?.boards ?? {});
  const missingBoards = canvasBoards.filter((board) => !entries.some((entry) => entry.board === board));
  const unknownBoards = [...new Set(entries.map((entry) => entry.board))].filter((board) => !canvasBoards.includes(board));
  const unreadableBoards = canvasBoards.filter((board) => typeof boards?.[board] !== "string");
  const missingSections = [];
  const unknownSections = [];
  const sections = {};
  for (const board of canvasBoards) {
    const lettered = typeof boards?.[board] === "string" ? parseBoardSections(boards[board]) : [];
    sections[board] = lettered;
    if (!lettered.length) continue;
    const named = new Set(entries.filter((entry) => entry.board === board).map((entry) => entry.section));
    for (const section of lettered) if (!named.has(section)) missingSections.push(`${board}#${section}`);
    for (const section of named) if (!lettered.includes(section)) unknownSections.push(`${board}#${section}`);
  }
  return {
    ok: missingBoards.length === 0 && unknownBoards.length === 0 && unreadableBoards.length === 0 && missingSections.length === 0 && unknownSections.length === 0,
    boards: canvasBoards.length,
    sections,
    missingBoards,
    unknownBoards,
    unreadableBoards,
    missingSections,
    unknownSections
  };
}

// Kind of a listed story: the ten fixed ids by their list (convention 7); any other story by its
// registry category, gplus-samples -> sample and gplus-matrices -> matrix (R3 integration item
// I-P2b-2: the composition three sample enters the list through gplus-samples, and a kind-scoped run
// must not report it unmapped). Any other category, or none, stays "unknown": an unknown story is
// listed in every kind-scoped run, so a missing or mismatched category still turns the run red.
export const STORY_CATEGORY_KINDS = Object.freeze({ "gplus-samples": "sample", "gplus-matrices": "matrix" });

export function storyKind(id, categoryId = null) {
  if (GPLUS_MATRIX_STORY_IDS.includes(id)) return "matrix";
  if (GPLUS_SAMPLE_STORY_IDS.includes(id)) return "sample";
  return Object.hasOwn(STORY_CATEGORY_KINDS, categoryId ?? "") ? STORY_CATEGORY_KINDS[categoryId] : "unknown";
}

// The story list: the fixed G+ ids plus every registry story in a gplus-* category.
export function storyList(registry, { fixedIds = GPLUS_STORY_IDS, categoryPrefix = STORY_CATEGORY_PREFIX } = {}) {
  const byId = new Map((registry ?? []).map((entry) => [entry.id, entry]));
  const ids = [...fixedIds];
  for (const entry of registry ?? []) if (String(entry.categoryId ?? "").startsWith(categoryPrefix) && !ids.includes(entry.id)) ids.push(entry.id);
  return ids.map((id) => ({ id, kind: storyKind(id, byId.get(id)?.categoryId ?? null), categoryId: byId.get(id)?.categoryId ?? null, inRegistry: byId.has(id) }));
}

export function rowsInScope(map, kinds = DEFAULT_RUN.kinds) {
  return (map.rows ?? []).filter((row) => kinds.includes(row.kind));
}

// Map <-> story list: a referenced story the list or the registry lacks, or a listed story no row
// references, is red.
export function reconcileStories(map, registry, { kinds = DEFAULT_RUN.kinds, fixedIds = GPLUS_STORY_IDS, categoryPrefix = STORY_CATEGORY_PREFIX } = {}) {
  const list = storyList(registry, { fixedIds, categoryPrefix }).filter((item) => item.kind === "unknown" || kinds.includes(item.kind));
  const listIds = list.map((item) => item.id);
  const mapIds = [...new Set(rowsInScope(map, kinds).map((row) => row.storyId))];
  const registryIds = new Set((registry ?? []).map((entry) => entry.id));
  const notInList = mapIds.filter((id) => !listIds.includes(id));
  const notInRegistry = mapIds.filter((id) => !registryIds.has(id));
  const notInMap = listIds.filter((id) => !mapIds.includes(id));
  return {
    ok: notInList.length === 0 && notInRegistry.length === 0 && notInMap.length === 0,
    kinds: [...kinds],
    mapStories: mapIds,
    storyList: list,
    notInList,
    notInRegistry,
    notInMap
  };
}

function formatExpect(value) {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(2) : String(value);
}

// Cells of a matrix row against the contract (count and ids) and the board (data-expect per cell).
export function evaluateCells(spec, facts, contractCells, boardCells) {
  const result = { expected: spec.expected, contract: spec.contract, rendered: null, unique: null, declared: null, missing: [], extra: [], duplicated: [], expectMismatches: [], notOnBoard: [], ok: false };
  if (!facts) {
    result.problem = "cells_not_collected";
    return result;
  }
  const ids = facts.cells.map((cell) => cell.id);
  const contractIds = (contractCells ?? []).map((cell) => cell.cellId);
  result.rendered = ids.length;
  result.unique = new Set(ids).size;
  result.declared = facts.declaredCount;
  result.duplicated = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  result.missing = contractIds.filter((id) => !ids.includes(id));
  result.extra = [...new Set(ids)].filter((id) => !contractIds.includes(id));
  for (const cell of facts.cells) {
    if (!boardCells?.has(cell.id)) {
      if (contractIds.includes(cell.id)) result.notOnBoard.push(cell.id);
      continue;
    }
    const board = formatExpect(boardCells.get(cell.id));
    const story = formatExpect(cell.expect);
    if (board !== story) result.expectMismatches.push({ cell: cell.id, board, story });
  }
  result.ok = contractIds.length === spec.expected
    && result.rendered === spec.expected
    && result.unique === spec.expected
    && result.missing.length === 0
    && result.extra.length === 0
    && result.duplicated.length === 0
    && result.notOnBoard.length === 0
    && result.expectMismatches.length === 0;
  if (contractIds.length !== spec.expected) result.problem = `contract_count:${contractIds.length}`;
  return result;
}

function compactCheck(check) {
  const out = { status: check.status, checked: check.checked, value: check.value ?? null, violationCount: check.violationCount ?? 0 };
  if (check.status === "fail") {
    out.violations = (check.violations ?? []).slice(0, 8);
  }
  return out;
}

// One report row per map row; a theme is ok when measured, nothing failed, no required check is n/a
// and the cells (if any) match.
export function evaluateRow(row, { runs, facts, contract, boards, themes }) {
  const report = { row: row.row, board: row.board, section: row.section, storyId: row.storyId, storybookId: row.storybookId, kind: row.kind, requiredChecks: [...(row.requiredChecks ?? [])], differences: [...(row.differences ?? [])], ok: false, reasons: [], themes: {} };
  for (const theme of themes) {
    const verdict = runs?.get(`${row.storyId}@${theme}`);
    const entry = { ok: false, checks: {}, failed: [], requiredNotApplicable: [] };
    if (!verdict) {
      entry.error = "story_not_measured";
      report.reasons.push(`${theme}:story_not_measured`);
      report.themes[theme] = entry;
      continue;
    }
    if (verdict.error) entry.error = verdict.error;
    for (const id of CHECK_IDS) entry.checks[id] = verdict.checks?.[id] ? compactCheck(verdict.checks[id]) : { status: "missing" };
    entry.failed = CHECK_IDS.filter((id) => entry.checks[id].status === "fail" || entry.checks[id].status === "missing");
    entry.requiredNotApplicable = (row.requiredChecks ?? []).filter((id) => entry.checks[id]?.status !== "pass" && entry.checks[id]?.status !== "fail");
    if (row.cells) {
      const contractCells = contract?.boards?.[row.cells.contract]?.cells ?? null;
      entry.cells = evaluateCells(row.cells, facts?.get(`${row.storyId}@${theme}`), contractCells, boards?.get(row.board));
    }
    entry.ok = !entry.error && entry.failed.length === 0 && entry.requiredNotApplicable.length === 0 && (!entry.cells || entry.cells.ok);
    if (entry.error) report.reasons.push(`${theme}:error:${entry.error}`);
    for (const id of entry.failed) report.reasons.push(`${theme}:${id}`);
    for (const id of entry.requiredNotApplicable) report.reasons.push(`${theme}:required_not_applicable:${id}`);
    if (entry.cells && !entry.cells.ok) report.reasons.push(`${theme}:cells`);
    report.themes[theme] = entry;
  }
  report.ok = themes.length > 0 && themes.every((theme) => report.themes[theme]?.ok === true);
  return report;
}

function summarizeRows(rows) {
  const checks = {};
  for (const id of CHECK_IDS) {
    let status = null;
    for (const row of rows) for (const entry of Object.values(row.themes)) {
      const check = entry.checks?.[id];
      if (!check || check.status === "missing") continue;
      if (status === null || STATUS_RANK[check.status] > STATUS_RANK[status]) status = check.status;
    }
    checks[id] = status ?? "n/a";
  }
  return { rows: rows.length, rowsOk: rows.filter((row) => row.ok).length, redRows: rows.filter((row) => !row.ok).map((row) => ({ row: row.row, storyId: row.storyId, reasons: [...new Set(row.reasons)] })), checks };
}

function gitHead(root) {
  try {
    return execFileSync("git", ["-C", root, "rev-parse", "HEAD"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return null;
  }
}

async function collectStoryFacts(page, bodySelector) {
  return page.evaluate((selector) => {
    const root = document.querySelector(selector);
    if (!root) return null;
    const board = root.querySelector("[data-gplus-matrix-cell-count]");
    return {
      declaredCount: board ? Number(board.getAttribute("data-gplus-matrix-cell-count")) : null,
      cells: [...root.querySelectorAll("[data-cell]")].map((el) => ({ id: el.getAttribute("data-cell"), expect: el.getAttribute("data-expect") }))
    };
  }, bodySelector);
}

export async function runStorybookVisualProof({
  root = process.cwd(),
  map,
  kinds = DEFAULT_RUN.kinds,
  themes = DEFAULT_RUN.themes,
  locale = DEFAULT_RUN.locale,
  viewport = DEFAULT_RUN.viewport,
  mutations = ROW_MUTATIONS,
  thresholds = THRESHOLDS,
  registry,
  browser
} = {}) {
  assertThresholds(thresholds);
  const report = {
    schemaVersion: SCHEMA_VERSION,
    measureSchemaVersion: MEASURE_SCHEMA_VERSION,
    generatedAtUtc: new Date().toISOString(),
    head: gitHead(root),
    ok: false,
    reason: null,
    scope: { kinds: [...kinds], themes: [...themes], locale, viewport: { ...viewport } },
    thresholdsSource: "scripts/geometry-measure-proof.mjs THRESHOLDS",
    thresholds,
    eightMeasurements: [...EIGHT_MEASUREMENTS],
    additionalChecks: ["overlap"],
    map: null,
    coverage: null,
    stories: null,
    rows: [],
    mutations: [],
    summary: null
  };
  let activeMap = map;
  try {
    activeMap = activeMap ?? loadMap({ root });
  } catch (error) {
    report.reason = `map_unreadable:${error.code ?? error.message}`;
    return report;
  }
  const mapProblems = validateMap(activeMap);
  const scopedRows = rowsInScope(activeMap, kinds);
  report.map = {
    path: DEFAULT_PATHS.map,
    rows: (activeMap.rows ?? []).length,
    rowsInScope: scopedRows.length,
    unmapped: (activeMap.unmapped ?? []).length,
    differences: (activeMap.differences ?? []).length,
    differencesPendingOwner: (activeMap.differences ?? []).filter((item) => /待 Owner 裁定/.test(item.status ?? "")).map((item) => item.id),
    problems: mapProblems
  };
  const { canvas, boards } = loadBoards({ root });
  report.coverage = boardCoverage(activeMap, canvas, boards);
  const boardCells = new Map(Object.entries(boards).filter(([, html]) => typeof html === "string").map(([name, html]) => [name, parseBoardCells(html)]));
  const contract = readJson(root, DEFAULT_PATHS.matrices);

  const staticRoot = resolve(root, DEFAULT_PATHS.staticRoot);
  let activeRegistry = registry ?? null;
  if (!existsSync(staticRoot)) report.reason = "static_docs_missing";
  else if (!activeRegistry) {
    try {
      activeRegistry = await loadStoryRegistry({ root, modulePath: DEFAULT_PATHS.registryModule });
    } catch (error) {
      report.reason = error.code ?? "storybook_registry_missing";
    }
  }
  const runs = new Map();
  const facts = new Map();
  if (activeRegistry) {
    report.stories = reconcileStories(activeMap, activeRegistry, { kinds });
    const storyIds = [...new Set(scopedRows.map((row) => row.storyId))];
    const { routes } = resolveStoryRoutes(storyIds, activeRegistry);
    if (!report.reason && routes.length) {
      let owned = null;
      if (!browser) {
        const { chromium } = await import("@playwright/test");
        owned = await chromium.launch();
      }
      const server = await startStaticServer(staticRoot);
      try {
        const targets = [];
        for (const theme of themes) for (const route of routes) {
          const key = `${route.id}@${theme}`;
          targets.push({ key, theme, storyId: route.id, path: route.path, url: storyUrl(server.origin, route, { theme, locale }), root: route.bodySelector, measure: MEASURE_OPTIONS, prepare: async (page) => { await expandStory(page, route.id); facts.set(key, await collectStoryFacts(page, route.bodySelector)); } });
        }
        const scopedStories = new Set(storyIds);
        for (const mutation of mutations) {
          if (!scopedStories.has(mutation.storyId)) continue;
          const route = routes.find((item) => item.id === mutation.storyId);
          if (!route) {
            report.mutations.push({ id: mutation.id, storyId: mutation.storyId, check: mutation.check, killed: false, reason: "story_missing" });
            continue;
          }
          const theme = mutation.theme ?? themes[0];
          targets.push({ mutation, theme, url: storyUrl(server.origin, route, { theme, locale }), root: route.bodySelector, measure: { ...MEASURE_OPTIONS, ...(mutation.measure ?? {}) }, prepare: (page) => expandStory(page, route.id), mutationCss: mutation.css });
        }
        const results = await runMeasureTargets({ targets: targets.map((target, index) => ({ ...target, id: target.key ?? `mutation:${index}` })), thresholds, browser: browser ?? owned, viewport });
        results.forEach((result, index) => {
          const target = targets[index];
          if (target.mutation) {
            const status = result.verdict.checks?.[target.mutation.check]?.status ?? "missing";
            report.mutations.push({ id: target.mutation.id, storyId: target.mutation.storyId, check: target.mutation.check, theme: target.theme, status, killed: status === "fail" });
            return;
          }
          runs.set(target.key, { ...result.verdict, route: target.path });
        });
      } finally {
        await server.close();
        if (owned) await owned.close();
      }
    }
    for (const mutation of mutations) {
      if (scopedRows.some((row) => row.storyId === mutation.storyId) && !report.mutations.some((item) => item.id === mutation.id)) report.mutations.push({ id: mutation.id, storyId: mutation.storyId, check: mutation.check, killed: false, reason: report.reason ? "not_run" : "story_missing" });
    }
  }
  report.rows = scopedRows.map((row) => evaluateRow(row, { runs, facts, contract, boards: boardCells, themes }));
  for (const row of report.rows) row.route = runs.get(`${row.storyId}@${themes[0]}`)?.route ?? null;
  report.summary = summarizeRows(report.rows);
  report.ok = !report.reason
    && mapProblems.length === 0
    && report.coverage.ok
    && report.stories?.ok === true
    && report.rows.length === scopedRows.length
    && report.rows.length > 0
    && report.rows.every((row) => row.ok)
    && report.mutations.every((mutation) => mutation.killed);
  return report;
}

const CHECK_LABEL = { clip: "clip", singleLine: "1line", shadowBlur: "blur", rail: "rail", rowAlign: "row", mark: "mark", contrast: "contrast", controlHeight: "ctlH", overlap: "overlap", shellFrame: "frame" };
const STATUS_MARK = { pass: "pass", fail: "FAIL", "n/a": "n/a", missing: "missing" };

export function renderReportMarkdown(report) {
  const lines = [];
  lines.push("# storybook-visual-proof · G+ 画布映射逐行报告");
  lines.push("");
  lines.push("由 `node scripts/storybook-visual-proof.mjs --write-report` 生成，勿手改。映射见 `docs/design/gplus-2026-10/storybook-map.md`；同目录其余文件是已退役的旧像素基线，只作历史保留。");
  lines.push("");
  lines.push(`- 生成时间（UTC）：${report.generatedAtUtc}`);
  lines.push(`- HEAD：${report.head ?? "未知"}`);
  lines.push(`- 结论：${report.ok ? "通过" : "未通过"}${report.reason ? `（${report.reason}）` : ""}`);
  lines.push(`- 范围：kind ${report.scope.kinds.join(" / ")}；主题 ${report.scope.themes.join(" / ")}；语言 ${report.scope.locale}；视口 ${report.scope.viewport.width}×${report.scope.viewport.height}`);
  lines.push(`- 阈值：${report.thresholdsSource}（八项测量 ${report.eightMeasurements.join("、")}，另有 overlap）`);
  if (report.map) lines.push(`- 映射：${report.map.rows} 行（本次范围 ${report.map.rowsInScope} 行），无 story ${report.map.unmapped} 条，差异 ${report.map.differences} 条（待 Owner 裁定：${report.map.differencesPendingOwner.join("、") || "无"}）；结构问题 ${report.map.problems.length} 条`);
  if (report.coverage) lines.push(`- 板与分段覆盖：${report.coverage.ok ? "齐" : "缺"}（板 ${report.coverage.boards} 块；缺板 ${report.coverage.missingBoards.length}，缺分段 ${report.coverage.missingSections.length}，多余分段 ${report.coverage.unknownSections.length}）`);
  if (report.stories) {
    lines.push(`- story 清单对账：${report.stories.ok ? "一致" : "不一致"}（映射引用 ${report.stories.mapStories.length} 个，清单 ${report.stories.storyList.length} 个）`);
    if (report.stories.notInRegistry.length) lines.push(`  - 映射引用而注册表没有：${report.stories.notInRegistry.join("、")}`);
    if (report.stories.notInList.length) lines.push(`  - 映射引用而不在 story 清单：${report.stories.notInList.join("、")}`);
    if (report.stories.notInMap.length) lines.push(`  - 清单有而映射没引用：${report.stories.notInMap.join("、")}`);
  }
  lines.push("");
  lines.push("## 逐行结果");
  lines.push("");
  lines.push("每格是 `浅色 / 夜间` 的状态；pass 通过，FAIL 不通过，n/a 无可测对象（requiredChecks 里的项 n/a 也算不通过）。");
  lines.push("");
  lines.push(`| 行 | 板 · 分段 | story | ${CHECK_IDS.map((id) => CHECK_LABEL[id]).join(" | ")} | 格 | 结论 |`);
  lines.push(`| --- | --- | --- | ${CHECK_IDS.map(() => "---").join(" | ")} | --- | --- |`);
  for (const row of report.rows) {
    const themes = report.scope.themes;
    const cell = (id) => themes.map((theme) => STATUS_MARK[row.themes[theme]?.checks?.[id]?.status ?? "missing"] ?? "missing").join(" / ");
    const cells = row.themes[themes[0]]?.cells ? themes.map((theme) => {
      const value = row.themes[theme]?.cells;
      return value ? `${value.rendered}/${value.expected}${value.ok ? "" : " 不符"}` : "—";
    }).join(" / ") : "—";
    lines.push(`| ${row.row} | ${row.board.replace(/\.dc\.html$/, "")} · ${row.section} | ${row.storyId} | ${CHECK_IDS.map(cell).join(" | ")} | ${cells} | ${row.ok ? "通过" : "不通过"} |`);
  }
  lines.push("");
  const red = report.rows.filter((row) => !row.ok);
  if (red.length) {
    lines.push("## 不通过的行与原因");
    lines.push("");
    for (const row of red) {
      lines.push(`### ${row.row}（${row.storyId}）`);
      lines.push("");
      lines.push(`- 原因：${[...new Set(row.reasons)].join("；")}`);
      for (const theme of report.scope.themes) {
        const entry = row.themes[theme];
        if (!entry) continue;
        const contrast = entry.checks?.contrast;
        if (contrast?.status === "fail") lines.push(`- ${theme} 对比度：${contrast.violationCount} 格偏离，例 ${(contrast.violations ?? []).slice(0, 4).map((v) => `${v.cell} ${v.ratio}/${v.expect}${v.reasons?.length ? `（${v.reasons.join(",")}）` : ""}`).join("、")}`);
        if (entry.cells && !entry.cells.ok) lines.push(`- ${theme} 格：渲染 ${entry.cells.rendered}，期望 ${entry.cells.expected}；缺 ${entry.cells.missing.join("、") || "无"}；多 ${entry.cells.extra.join("、") || "无"}；data-expect 与画板不同 ${entry.cells.expectMismatches.length} 格${entry.cells.expectMismatches.length ? `（例 ${entry.cells.expectMismatches.slice(0, 4).map((m) => `${m.cell} 板 ${m.board} / story ${m.story}`).join("、")}）` : ""}`);
      }
      lines.push("");
    }
  }
  lines.push("## 变异");
  lines.push("");
  lines.push("| 变异 | story | 检查 | 主题 | 结果 |");
  lines.push("| --- | --- | --- | --- | --- |");
  for (const mutation of report.mutations) lines.push(`| ${mutation.id} | ${mutation.storyId} | ${mutation.check} | ${mutation.theme ?? "—"} | ${mutation.killed ? "判红" : `未判红${mutation.reason ? `（${mutation.reason}）` : ""}`} |`);
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function parseArgs(argv) {
  const values = (flag) => argv.flatMap((arg, index) => (arg === flag && argv[index + 1] ? [argv[index + 1]] : []));
  const flags = new Set(argv.filter((arg) => arg.startsWith("--")));
  const kinds = values("--kind");
  const themes = values("--theme");
  return { kinds: kinds.length ? kinds : [...DEFAULT_RUN.kinds], themes: themes.length ? themes : [...DEFAULT_RUN.themes], mutations: flags.has("--no-mutations") ? [] : ROW_MUTATIONS, writeReport: flags.has("--write-report") };
}

if (process.argv[1]?.endsWith("storybook-visual-proof.mjs")) {
  const options = parseArgs(process.argv.slice(2));
  const root = process.cwd();
  for (const kind of options.kinds) if (!ROW_KINDS.includes(kind)) throw new Error(`storybook_visual_proof_unknown_kind:${kind}`);
  const report = await runStorybookVisualProof({ root, kinds: options.kinds, themes: options.themes, mutations: options.mutations });
  const text = `${JSON.stringify(report, null, 2)}\n`;
  if (options.writeReport) {
    for (const [path, body] of [[DEFAULT_PATHS.reportJson, text], [DEFAULT_PATHS.reportMd, renderReportMarkdown(report)]]) {
      const target = join(root, path);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, body);
    }
  }
  process.stdout.write(text);
  if (!report.ok) process.exitCode = 1;
}
