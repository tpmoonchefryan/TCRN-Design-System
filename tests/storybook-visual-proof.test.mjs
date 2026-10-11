// SPDX-License-Identifier: Apache-2.0
// storybook-visual-proof: the G+ canvas board -> story map and its per-row measurements
// (TCRN-DS-STORY-130, TCRN-DS-SUB-033). Every criterion of the gate has a case here that turns it red.
import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { CHECK_IDS } from "../scripts/lib/gplus-measure.mjs";
import { GPLUS_MATRIX_STORY_IDS, GPLUS_SAMPLE_STORY_IDS, GPLUS_STORY_IDS, loadStoryRegistry } from "../scripts/lib/storybook-routes.mjs";
import { THRESHOLDS as GEOMETRY_THRESHOLDS } from "../scripts/geometry-measure-proof.mjs";
import {
  DEFAULT_PATHS,
  EIGHT_MEASUREMENTS,
  ROW_MUTATIONS,
  THRESHOLDS,
  boardCoverage,
  evaluateCells,
  evaluateRow,
  loadBoards,
  loadMap,
  parseBoardCells,
  parseBoardSections,
  reconcileStories,
  renderReportMarkdown,
  rowsInScope,
  runStorybookVisualProof,
  storyList,
  validateMap
} from "../scripts/storybook-visual-proof.mjs";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const map = loadMap({ root: repoRoot });
const { canvas, boards } = loadBoards({ root: repoRoot });
const contract = JSON.parse(readFileSync(new URL("../docs/design/gplus-2026-10/contract/matrices.json", import.meta.url), "utf8"));
const clone = (value) => JSON.parse(JSON.stringify(value));

// A registry that carries all ten G+ stories (what the merged batch builds).
const fullRegistry = [
  { id: "button-spec-usage", group: "Components", categoryId: "controls-data" },
  ...GPLUS_MATRIX_STORY_IDS.map((id) => ({ id, group: "Components", categoryId: "gplus-matrices" })),
  ...GPLUS_SAMPLE_STORY_IDS.map((id) => ({ id, group: "Components", categoryId: "gplus-samples" }))
];

function passingVerdict() {
  const checks = {};
  for (const id of CHECK_IDS) checks[id] = { status: "pass", checked: 3, value: 0, violationCount: 0, violations: [] };
  return { ok: true, failed: [], notApplicable: [], checks };
}

function cellFacts(board, mutate = (cells) => cells) {
  const cells = contract.boards[board].cells.map((cell) => ({ id: cell.cellId, expect: parseBoardCells(boards[`V2-B1-${board[0].toUpperCase()}${board.slice(1)}.dc.html`]).get(cell.cellId) }));
  return { declaredCount: cells.length, cells: mutate(cells) };
}

let browser;
let matrixRun;

before(async () => {
  browser = await chromium.launch();
  matrixRun = await runStorybookVisualProof({ root: repoRoot, kinds: ["matrix"], themes: ["light"], browser });
});

after(async () => {
  await browser?.close();
});

test("the map parses and every row, unmapped entry and difference is complete", () => {
  assert.deepEqual(validateMap(map), []);
  assert.equal(DEFAULT_PATHS.map, "docs/design/gplus-2026-10/storybook-map.json");
  for (const difference of map.differences) assert.ok(difference.refs.length > 0, difference.id);
  for (const entry of map.unmapped) assert.ok(entry.reason.length > 0 && entry.refs.length > 0, `${entry.board}#${entry.section}`);
  const pending = map.differences.filter((item) => item.status === "待 Owner 裁定");
  assert.ok(pending.some((item) => item.refs.includes("P1")), "the composition one shell geometry stays pending on P1");
  const markdown = readFileSync(new URL("../docs/design/gplus-2026-10/storybook-map.md", import.meta.url), "utf8");
  for (const row of map.rows) assert.ok(markdown.includes(`| ${row.row} |`), `storybook-map.md lacks row ${row.row}`);
  for (const difference of map.differences) assert.ok(markdown.includes(`| ${difference.id} |`), `storybook-map.md lacks ${difference.id}`);
});

test("map validation turns red on a missing ruling, an unknown check, a missing reason and an unknown difference", () => {
  const noRuling = clone(map);
  noRuling.differences[0].refs = [];
  assert.ok(validateMap(noRuling).some((problem) => problem.startsWith("difference_ruling_missing:")));
  const unknownCheck = clone(map);
  unknownCheck.rows[0].requiredChecks = ["sparkle"];
  assert.ok(validateMap(unknownCheck).includes(`row_check_unknown:${map.rows[0].row}:sparkle`));
  const noReason = clone(map);
  noReason.unmapped[0].reason = "";
  assert.ok(validateMap(noReason).some((problem) => problem.startsWith("unmapped_reason_missing:")));
  const unknownDifference = clone(map);
  unknownDifference.rows[0].differences = ["DIFF-404"];
  assert.ok(validateMap(unknownDifference).includes(`row_difference_unknown:${map.rows[0].row}:DIFF-404`));
});

test("every canvas board and every lettered section has a map entry", () => {
  const coverage = boardCoverage(map, canvas, boards);
  assert.equal(coverage.ok, true, JSON.stringify(coverage));
  assert.equal(coverage.boards, 10);
  assert.deepEqual(coverage.sections["V2-B1-Typography.dc.html"], ["A", "B", "C", "D", "E", "F", "G"]);
  assert.deepEqual(coverage.sections["V2-B2-Logos-Draft.dc.html"], ["A–E", "F", "G", "H", "I"]);
  for (const board of ["V2-Families.dc.html", "V2-Rejections.dc.html"]) assert.ok(map.unmapped.some((entry) => entry.board === board), board);
});

test("a board or a section without a map entry, or an unknown section, turns coverage red", () => {
  const noBoard = clone(map);
  noBoard.unmapped = noBoard.unmapped.filter((entry) => entry.board !== "V2-Rejections.dc.html");
  assert.deepEqual(boardCoverage(noBoard, canvas, boards).missingBoards, ["V2-Rejections.dc.html"]);
  const noSection = clone(map);
  noSection.unmapped = noSection.unmapped.filter((entry) => !(entry.board === "V2-B1-Typography.dc.html" && entry.section === "G"));
  const missing = boardCoverage(noSection, canvas, boards);
  assert.equal(missing.ok, false);
  assert.deepEqual(missing.missingSections, ["V2-B1-Typography.dc.html#G"]);
  const unknown = clone(map);
  unknown.unmapped.push({ board: "V2-B1-Icon.dc.html", section: "Z", reason: "x", refs: ["D6"] });
  assert.deepEqual(boardCoverage(unknown, canvas, boards).unknownSections, ["V2-B1-Icon.dc.html#Z"]);
});

test("the story list is the ten fixed ids plus every gplus- category story, and the map covers it", () => {
  assert.deepEqual(storyList(fullRegistry).map((item) => item.id), [...GPLUS_STORY_IDS]);
  const result = reconcileStories(map, fullRegistry);
  assert.equal(result.ok, true, JSON.stringify(result));
  assert.deepEqual([...result.mapStories].sort(), [...GPLUS_STORY_IDS].sort());
});

test("130-GWT2: deleting a story from the map leaves the story list with an unmapped story", () => {
  for (const storyId of ["typography-matrix", "inputs-sample-members"]) {
    const reduced = clone(map);
    reduced.rows = reduced.rows.filter((row) => row.storyId !== storyId);
    const result = reconcileStories(reduced, fullRegistry);
    assert.equal(result.ok, false);
    assert.deepEqual(result.notInMap, [storyId]);
  }
});

test("a mapped story the list or the registry lacks, or a gplus- story without a row, is red", () => {
  const extraRow = clone(map);
  extraRow.rows.push({ ...extraRow.rows[0], row: "typography.extra", storyId: "typography-sample-extra" });
  const extra = reconcileStories(extraRow, fullRegistry);
  assert.deepEqual(extra.notInList, ["typography-sample-extra"]);
  assert.deepEqual(extra.notInRegistry, ["typography-sample-extra"]);
  const unlisted = reconcileStories(map, [...fullRegistry, { id: "icon-sample-settings", group: "Components", categoryId: "gplus-samples" }]);
  assert.equal(unlisted.ok, false);
  assert.deepEqual(unlisted.notInMap, ["icon-sample-settings"]);
  const matrixOnly = reconcileStories(map, fullRegistry.filter((entry) => entry.categoryId !== "gplus-samples"));
  assert.deepEqual(matrixOnly.notInRegistry, [...GPLUS_SAMPLE_STORY_IDS]);
});

test("--kind matrix judges the matrix rows only and still reconciles them", () => {
  const matrixRegistry = fullRegistry.filter((entry) => entry.categoryId !== "gplus-samples");
  const result = reconcileStories(map, matrixRegistry, { kinds: ["matrix"] });
  assert.equal(result.ok, true, JSON.stringify(result));
  assert.ok(rowsInScope(map, ["matrix"]).every((row) => row.kind === "matrix"));
  const reduced = clone(map);
  reduced.rows = reduced.rows.filter((row) => row.storyId !== "brand-matrix");
  assert.deepEqual(reconcileStories(reduced, matrixRegistry, { kinds: ["matrix"] }).notInMap, ["brand-matrix"]);
});

test("a row is red when any of the eight measurements or the overlap check fails", () => {
  const row = map.rows.find((item) => item.row === "actions.A");
  const green = evaluateRow(row, { runs: new Map([["actions-matrix@light", passingVerdict()]]), facts: new Map(), contract, boards: new Map(), themes: ["light"] });
  assert.equal(green.ok, true);
  assert.deepEqual(EIGHT_MEASUREMENTS, CHECK_IDS.filter((id) => id !== "overlap"));
  for (const id of CHECK_IDS) {
    const verdict = passingVerdict();
    verdict.checks[id] = { status: "fail", checked: 1, value: 9, violationCount: 1, violations: [{ element: "x" }] };
    const red = evaluateRow(row, { runs: new Map([["actions-matrix@light", verdict]]), facts: new Map(), contract, boards: new Map(), themes: ["light"] });
    assert.equal(red.ok, false, id);
    assert.ok(red.reasons.includes(`light:${id}`), id);
  }
});

test("a required check that is n/a, or a story that was not measured, turns the row red", () => {
  const row = map.rows.find((item) => item.row === "typography.D");
  assert.ok(row.requiredChecks.includes("rail"));
  const verdict = passingVerdict();
  verdict.checks.rail = { status: "n/a", checked: 0, value: 0, violationCount: 0, violations: [] };
  const notApplicable = evaluateRow(row, { runs: new Map([["typography-sample-billing@light", verdict]]), facts: new Map(), contract, boards: new Map(), themes: ["light"] });
  assert.deepEqual(notApplicable.themes.light.requiredNotApplicable, ["rail"]);
  assert.equal(notApplicable.ok, false);
  const missing = evaluateRow(row, { runs: new Map(), facts: new Map(), contract, boards: new Map(), themes: ["light", "dark"] });
  assert.equal(missing.ok, false);
  assert.deepEqual(missing.reasons, ["light:story_not_measured", "dark:story_not_measured"]);
});

test("cells must match the contract count and ids and the board data-expect", () => {
  const boardCells = parseBoardCells(boards["V2-B1-Brand.dc.html"]);
  const spec = { expected: 10, contract: "brand" };
  assert.equal(evaluateCells(spec, cellFacts("brand"), contract.boards.brand.cells, boardCells).ok, true);
  const dropped = evaluateCells(spec, cellFacts("brand", (cells) => cells.slice(1)), contract.boards.brand.cells, boardCells);
  assert.equal(dropped.ok, false);
  assert.deepEqual(dropped.missing, [contract.boards.brand.cells[0].cellId]);
  const drifted = evaluateCells(spec, cellFacts("brand", (cells) => cells.map((cell, index) => (index === 0 ? { ...cell, expect: "1.00" } : cell))), contract.boards.brand.cells, boardCells);
  assert.equal(drifted.ok, false);
  assert.equal(drifted.expectMismatches.length, 1);
  assert.equal(evaluateCells({ expected: 11, contract: "brand" }, cellFacts("brand"), contract.boards.brand.cells, boardCells).ok, false);
});

test("the boards carry every contract cell with a data-expect", () => {
  const counts = { Typography: 44, Icon: 28, Brand: 10, Actions: 116, Inputs: 42 };
  for (const [name, count] of Object.entries(counts)) {
    const cells = parseBoardCells(boards[`V2-B1-${name}.dc.html`]);
    assert.equal(cells.size, count, name);
    assert.ok([...cells.values()].every((value) => value !== null), name);
    assert.equal(contract.boards[name.toLowerCase()].cells.length, count, name);
    assert.equal(map.rows.find((row) => row.row === `${name.toLowerCase()}.B`).cells.expected, count, name);
  }
  assert.deepEqual(parseBoardSections(boards["V2-GPlus.dc.html"]), []);
});

test("thresholds come from the EPIC-042 gate; the map carries none; one mutation per check", () => {
  assert.equal(THRESHOLDS, GEOMETRY_THRESHOLDS);
  assert.doesNotMatch(readFileSync(new URL("../docs/design/gplus-2026-10/storybook-map.json", import.meta.url), "utf8"), /"(?:thresholds?|maxDiff|maxBlurPx|tolerancePx)"/);
  assert.deepEqual([...new Set(ROW_MUTATIONS.map((mutation) => mutation.check))].sort(), [...CHECK_IDS].sort());
  assert.equal(new Set(ROW_MUTATIONS.map((mutation) => mutation.id)).size, ROW_MUTATIONS.length);
});

test("130-GWT1: every matrix row gets a report row with all nine checks, and the in-scope mutations turn red", () => {
  const report = matrixRun;
  assert.ok(report.generatedAtUtc && report.schemaVersion);
  if (report.reason !== null) {
    assert.match(report.reason, /static_docs_missing|storybook_registry_missing/);
    assert.equal(report.ok, false);
    return;
  }
  const rows = rowsInScope(map, ["matrix"]);
  assert.deepEqual(report.rows.map((row) => row.row), rows.map((row) => row.row));
  for (const row of report.rows) {
    if (!GPLUS_MATRIX_STORY_IDS.includes(row.storyId)) continue;
    const entry = row.themes.light;
    if (entry.error === "story_not_measured") continue;
    assert.deepEqual(Object.keys(entry.checks), [...CHECK_IDS], row.row);
    assert.equal(row.ok, entry.ok, row.row);
  }
  const ran = report.mutations.filter((mutation) => mutation.reason === undefined);
  assert.deepEqual(ran.filter((mutation) => !mutation.killed).map((mutation) => mutation.id), []);
  if (report.stories.notInRegistry.length === 0) assert.equal(ran.length, ROW_MUTATIONS.filter((mutation) => GPLUS_MATRIX_STORY_IDS.includes(mutation.storyId)).length);
  const markdown = renderReportMarkdown(report);
  for (const row of rows) assert.ok(markdown.includes(`| ${row.row} |`), row.row);
});

test("130-GWT2 on the built docs: the gate is red when a story is deleted from the map", async () => {
  let registry;
  try {
    registry = await loadStoryRegistry({ root: repoRoot });
  } catch (error) {
    assert.equal(error.code, "storybook_registry_missing");
    return;
  }
  const reduced = clone(map);
  reduced.rows = reduced.rows.filter((row) => row.storyId !== "icon-matrix");
  const report = await runStorybookVisualProof({ root: repoRoot, map: reduced, registry, kinds: ["matrix"], themes: ["light"], mutations: [], browser });
  assert.equal(report.ok, false);
  assert.deepEqual(report.stories.notInMap, ["icon-matrix"]);
});

test("the sample rows are reported as missing until their stories are built, never passed", async () => {
  let registry;
  try {
    registry = await loadStoryRegistry({ root: repoRoot });
  } catch (error) {
    assert.equal(error.code, "storybook_registry_missing");
    return;
  }
  const result = reconcileStories(map, registry);
  const absent = GPLUS_SAMPLE_STORY_IDS.filter((id) => !registry.some((entry) => entry.id === id));
  assert.deepEqual(result.notInRegistry, absent);
  assert.equal(result.ok, absent.length === 0 && result.notInMap.length === 0 && result.notInList.length === 0);
  for (const row of map.rows.filter((item) => absent.includes(item.storyId))) {
    const report = evaluateRow(row, { runs: new Map(), facts: new Map(), contract, boards: new Map(), themes: ["light"] });
    assert.equal(report.ok, false, row.row);
  }
});
