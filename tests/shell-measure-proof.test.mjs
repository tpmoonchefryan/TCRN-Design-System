// SPDX-License-Identifier: Apache-2.0
// Tab-shell reading library and the eighteen shell gates (TCRN-DS-STORY-149, TCRN-DS-SUB-135).
import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import * as lib from "../scripts/lib/shell-measure.mjs";
import {
  BEHAVIOUR_GATE_IDS,
  CHECKS,
  CHECK_IDS,
  DEFAULT_PATHS,
  D_SECTION_ROWS,
  GATES,
  GATE_IDS,
  PAGE_FIXTURE_CHECK_IDS,
  READING_GATE_IDS,
  SHELL_STORY_IDS,
  STORY_RUN,
  THRESHOLDS,
  applyMutationInPage,
  checkStoryScreens,
  judgeBehaviour,
  judgeBehaviourTraces,
  judgeFocusTrace,
  judgeGate,
  judgeIntroTrace,
  judgeShellReadings,
  judgeStoryMutation,
  openBoardPage,
  parseArgs,
  probeShellBehaviour,
  probeShellIntro,
  runFixtures
} from "../scripts/shell-measure-proof.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const manifest = JSON.parse(read(DEFAULT_PATHS.fixtureManifest));
const mutations = JSON.parse(read(DEFAULT_PATHS.fixtureMutations)).mutations;
const storyMutationsAll = JSON.parse(read(DEFAULT_PATHS.fixtureMutations)).storyMutations;
const boardSource = read("docs/design/gplus-2026-10/tools/build-shell2.mjs");
const gateSource = read("scripts/shell-measure-proof.mjs");
const referenceScript = read(manifest.referenceScript);
const traces = Object.fromEntries(Object.entries(manifest.behaviourTraces).map(([id, entry]) => [id, entry.trace]));

// The G section of the 07b board, in order (build-shell2.mjs, gates table).
const G_SECTION = ["标按钮几何", "品牌资产 digest", "顶带", "三缘对齐", "固定项间距", "接续", "底栏居中", "标旁文字居中", "级联", "无收起钮、无常驻侧栏", "图钉位无抖动", "锁定块只装饰", "每格对比度", "单行与溢出", "阴影模糊", "登入动画", "焦点回路", "触摸端"];

let browser;
before(async () => {
  browser = await chromium.launch();
});
after(async () => {
  await browser?.close();
});

async function openBoard(file, viewport = manifest.viewport) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await openBoardPage(context, root, file);
  return { page, close: () => context.close() };
}

// every leaf of the reference must exist in the library reading; numbers within 0.5, the rest equal
function compareLeaves(reference, reading, path, diffs, counter) {
  if (typeof reference === "number") {
    counter.leaves++;
    if (typeof reading !== "number" || Math.abs(reference - reading) > 0.5) diffs.push(`${path}: ${reference} vs ${JSON.stringify(reading)}`);
    return;
  }
  if (reference === null || typeof reference !== "object") {
    counter.leaves++;
    if (reference !== reading) diffs.push(`${path}: ${JSON.stringify(reference)} vs ${JSON.stringify(reading)}`);
    return;
  }
  if (Array.isArray(reference)) {
    if (!Array.isArray(reading) || reading.length !== reference.length) {
      diffs.push(`${path}: length ${reference.length} vs ${Array.isArray(reading) ? reading.length : "none"}`);
      return;
    }
    reference.forEach((item, index) => compareLeaves(item, reading[index], `${path}[${index}]`, diffs, counter));
    return;
  }
  for (const key of Object.keys(reference)) compareLeaves(reference[key], reading?.[key], `${path}.${key}`, diffs, counter);
}

test("the eighteen gates are the G section of the 07b board, in order", () => {
  assert.equal(GATES.length, 18);
  assert.deepEqual(GATES.map((gate) => gate.name), G_SECTION);
  assert.equal(new Set(GATE_IDS).size, 18);
  for (const name of G_SECTION) assert.ok(boardSource.includes(`["${name}", "`), `G section row ${name}`);
  assert.deepEqual([...READING_GATE_IDS, ...BEHAVIOUR_GATE_IDS].sort(), [...GATE_IDS].sort());
});

test("thresholds live in the gate script only; the library reads", () => {
  assert.ok(Object.isFrozen(THRESHOLDS) && Object.isFrozen(THRESHOLDS.brandGeometry) && Object.isFrozen(THRESHOLDS.contrast.pendingBelowMinimum));
  for (const id of GATE_IDS) assert.ok(THRESHOLDS[id], `THRESHOLDS.${id}`);
  assert.deepEqual(Object.keys(lib).filter((name) => /threshold|judge|verdict/i.test(name)), []);
  assert.doesNotMatch(lib.readShellInPage.toString(), /threshold/i);
  assert.equal(lib.readShellInPage.length, 1);
});

test("the board and package selector sets cover the same keys (C-5)", () => {
  assert.deepEqual(Object.keys(lib.BOARD_SELECTORS).sort(), [...lib.SELECTOR_KEYS].sort());
  assert.deepEqual(Object.keys(lib.PACKAGE_SELECTORS).sort(), [...lib.SELECTOR_KEYS].sort());
  for (const hook of ["[data-shell]", "[data-shell-strip]", "[data-tab]", '[data-shell-brand="v1"]', "[data-shell-toggle]", "[data-pins] [data-pin]", "[data-open-pin]", "[data-cluster]", "[data-paper]", '[data-panel="expanded"]', '[data-panel="drop"]', '[data-panel="sheet"]', '[data-drop-col="2"]', "[data-shell-search]", "[data-shell-row]", "[data-shell-group]", "[data-pin-button]", "[data-shell-pbar]", "[data-lockup]", "[data-shell-intro]"]) {
    assert.ok(Object.values(lib.PACKAGE_SELECTORS).some((value) => value.includes(hook)), `package hook ${hook}`);
  }
});

test("the D section's twelve relation rows each land on gates named in the gate header", () => {
  assert.equal(D_SECTION_ROWS.length, 12);
  for (const row of D_SECTION_ROWS) {
    assert.ok(boardSource.includes(`["${row.row}", "`), `D section row ${row.row}`);
    assert.ok(row.gates.length > 0 && row.gates.every((id) => GATE_IDS.includes(id)), row.row);
    assert.match(gateSource, new RegExp(`//\\s+${row.row.replace(/[()（）]/g, ".")}\\s+${row.gates.join(", ")}`), `header maps ${row.row}`);
  }
});

test("every gate has exactly one mutation, taken from the G section; every check beyond it one of its own", () => {
  // a check the boards cannot show (boards: false) has no board mutation: its story mutation is shown red
  // on the page fixture instead (TCRN-DS-SUB-164)
  for (const id of [...GATE_IDS, ...CHECK_IDS]) assert.equal(mutations.filter((m) => m.gate === id).length, PAGE_FIXTURE_CHECK_IDS.includes(id) ? 0 : 1, id);
  for (const id of PAGE_FIXTURE_CHECK_IDS) assert.ok(manifest.pageFixture.green.includes(id) && manifest.pageFixture.storyMutations.some((mid) => storyMutationsAll.find((m) => m.id === mid && m.gate === id)), `${id} on the page fixture`);
  assert.equal(new Set(mutations.map((m) => m.id)).size, mutations.length);
  assert.deepEqual(CHECK_IDS.filter((id) => GATE_IDS.includes(id)), []);
  const boards = new Set(manifest.boards.map((board) => board.id));
  for (const m of mutations) {
    const gate = GATES.find((item) => item.id === m.gate);
    if (gate) assert.ok(boardSource.includes(`["${gate.name}", "`) && boardSource.includes(`", "${m.source}"]`), `${m.id} source`);
    else assert.ok(CHECKS.some((check) => check.id === m.gate) && typeof m.source === "string" && m.source.length > 0, `${m.id} check`);
    if (m.trace) assert.ok(traces[m.traceOf], `${m.id} trace`);
    else assert.ok(boards.has(m.board) && Array.isArray(m.ops) && m.ops.length > 0, `${m.id} board`);
  }
  for (const board of manifest.boards) assert.ok(existsSync(`${root}${board.file}`), board.file);
});

test("behaviour gates judge traces: the manifest traces pass, their mutations fail", () => {
  const green = judgeBehaviour(traces);
  assert.equal(green.intro.status, "pass");
  assert.equal(green.focusLoop.status, "pass");
  assert.equal(judgeIntroTrace({ ...traces.intro, reloadPlays: 1 }).status, "fail");
  assert.equal(judgeIntroTrace({ ...traces.intro, reducedMotionPlays: 1 }).status, "fail");
  assert.equal(judgeIntroTrace({ ...traces.intro, properties: ["transform", "width"] }).status, "fail");
  assert.equal(judgeIntroTrace({ ...traces.intro, durationMs: 701 }).status, "fail");
  assert.equal(judgeIntroTrace(null).status, "n/a");
  assert.equal(judgeFocusTrace({ ...traces.focusLoop, afterEscape: "body" }).status, "fail");
  assert.equal(judgeFocusTrace({ ...traces.focusLoop, afterCommandK: "tab" }).status, "fail");
  assert.equal(judgeFocusTrace({ ...traces.focusLoop, cascadeArrowRight: { from: 1, to: 1 } }).status, "fail");
  assert.equal(judgeFocusTrace({ ...traces.focusLoop, commandKRegistrations: 2 }).status, "fail");
  const outside = (trace) => judgeGate("noCollapse", { shells: [] }, { traces: { outsideClick: trace } });
  assert.equal(outside({ closesOnOutsideClick: true }).status, "pass");
  assert.equal(outside({ closesOnOutsideClick: false }).status, "fail");
  assert.equal(judgeGate("noCollapse", { shells: [] }).status, "n/a");
});

test("contrast holds the night suffix cells to 4.5 since R6 D4, with no pending cell, and fails any low cell (TCRN-DS-SUB-232)", () => {
  const cell = (name, ratio, expect = ratio, kind = "text") => ({ cell: name, kind, probe: "color", exempt: false, expect, ratio });
  assert.deepEqual([...THRESHOLDS.contrast.pendingBelowMinimum], []);
  // by night the suffix reads the TMS mark's bright step: 7.30 on the canvas, 6.74 on the hover wash, 6.86 on the paper
  const night = judgeGate("contrast", { contrastCells: [cell("brand-suffix-n", 7.3), cell("brand-suffix-open-n", 6.74), cell("lk-em-n", 6.86), cell("tgl-n", 7.7, 7.7, "icon")] });
  assert.equal(night.status, "pass");
  assert.equal(night.pending, undefined);
  // the day colour by night (3.33 on the canvas, 3.13 on the paper) is no longer pending: it fails
  assert.deepEqual(judgeGate("contrast", { contrastCells: [cell("brand-suffix-n", 3.33), cell("lk-em-n", 3.13)] }).failures.map((f) => [f.at, f.what]), [["brand-suffix-n", "minimum"], ["lk-em-n", "minimum"]]);
  assert.equal(judgeGate("contrast", { contrastCells: [cell("brand-suffix-l", 3.33)] }).status, "fail");
  assert.equal(judgeGate("contrast", { contrastCells: [cell("srch-ph-l", 5.1, 7.59)] }).status, "fail");
  assert.equal(judgeGate("contrast", { contrastCells: [{ ...cell("srch-ph-l", 7.59), expect: null }] }).status, "fail");
});

test("contrast: the 07a B cells marked 不进门 / 豁免 / 按设计不读 are listed with their reading, not compared (TCRN-DS-SUB-174)", () => {
  const cell = (name, ratio, expect, extra = {}) => ({ cell: name, kind: "text", probe: "color", exempt: false, expect, ratio, ...extra });
  assert.deepEqual([...THRESHOLDS.contrast.listOnly], ["brand-mark", "panel-edge", "scrim-paper"]);
  const listed = judgeGate("contrast", { contrastCells: [
    cell("brand-mark-l", 5.64, 4.85, { kind: "icon", probe: "mark", exempt: true }),
    cell("panel-edge-n", 1.0, 1.06, { kind: "edge", probe: "own-bg", exempt: true }),
    cell("scrim-paper-l", 8.58, 5.57, { exempt: true, underScrim: { scrims: 1, ratio: 5.57 } }),
    cell("tgl-l", 7.39, 7.39)
  ] });
  assert.equal(listed.status, "pass");
  assert.equal(listed.checked, 1);
  // the B reading is listed: 遮罩下的纸 under its scrim, with the cell's own reading beside it
  assert.deepEqual(listed.listed.map((c) => [c.cell, c.ratio, c.expect]), [["brand-mark-l", 5.64, 4.85], ["panel-edge-n", 1, 1.06], ["scrim-paper-l", 5.57, 5.57]]);
  assert.deepEqual([listed.listed[2].scrims, listed.listed[2].unscrimmed], [1, 8.58]);
  // only listed when the cell is exempt and named by the B section: any other cell is still compared
  assert.equal(judgeGate("contrast", { contrastCells: [cell("brand-mark-l", 5.64, 4.85)] }).status, "fail");
  assert.equal(judgeGate("contrast", { contrastCells: [cell("dis-l", 4.0, 5.1, { exempt: true })] }).status, "fail");
  // a cell whose probe has nothing to read is a failure, never a silent pass
  assert.deepEqual(judgeGate("contrast", { contrastCells: [cell("x-l", null, 4.5, { unreadable: true, probe: "mark" })] }).failures.map((f) => f.what), ["reading"]);
  assert.equal(judgeGate("contrast", { contrastCells: [cell("brand-mark-l", 3.33, 3.33, { exempt: true })] }).status, "n/a");
});

test("prail: the guide column of the full menu and the Sheet, icons at 16 and texts at 48 (TCRN-DS-SUB-174)", () => {
  assert.deepEqual(THRESHOLDS.prail, { iconLeftPx: 16, textLeftPx: 48, tolerancePx: 0.5 });
  const shell = (prail) => ({ shells: [{ id: "s", x: { missing: [], prail } }] });
  assert.equal(judgeGate("prail", shell({ columns: 3, icons: [16], texts: [48] })).status, "pass");
  assert.equal(judgeGate("prail", shell({ columns: 1, icons: [16.4], texts: [47.6] })).status, "pass");
  assert.deepEqual(judgeGate("prail", shell({ columns: 3, icons: [16, 20], texts: [48] })).failures.map((f) => [f.what, f.value]), [["prail.icon", 20]]);
  assert.deepEqual(judgeGate("prail", shell({ columns: 3, icons: [16], texts: [52] })).failures.map((f) => [f.what, f.value]), [["prail.text", 52]]);
  // no open full menu or Sheet: nothing to check (a missing hook is a hook gap, see the package readings)
  assert.equal(judgeGate("prail", shell(undefined)).status, "n/a");
  assert.equal(judgeGate("prail", shell({ columns: 0, icons: [], texts: [] })).status, "n/a");
  assert.equal(judgeGate("prail", shell(null)).status, "n/a");
});

test("single line: text cut by its box passes only as ellipsis with a title", () => {
  const shell = (line) => ({ shells: [{ id: "s", x: { missing: [], textLines: [line], clip: { leaks: [] } } }] });
  const base = { el: "span.t", lines: 1, excess: 120, clip: true, ellipsis: true, title: true };
  assert.equal(judgeGate("singleLine", shell(base)).status, "pass");
  assert.equal(judgeGate("singleLine", shell({ ...base, title: false })).status, "fail");
  assert.equal(judgeGate("singleLine", shell({ ...base, ellipsis: false })).status, "fail");
  assert.equal(judgeGate("singleLine", shell({ ...base, clip: false })).status, "fail");
  assert.equal(judgeGate("singleLine", shell({ ...base, excess: 0, lines: 2 })).status, "fail");
  const leak = { shells: [{ id: "s", x: { missing: [], textLines: [], clip: { leaks: [{ el: "a", clip: "div", px: 0.4 }, { el: "b", clip: "div", px: 3 }] } } }] };
  assert.deepEqual(judgeGate("singleLine", leak).failures.map((f) => f.what), ["clip:b in div"]);
});

test("the page in the paper: three checks beyond the G section, two of them proven on the page fixture (TCRN-DS-SUB-164)", () => {
  assert.deepEqual([...CHECK_IDS], ["prail", "pageCrumbs", "settingsLayout", "splitView"]);
  assert.deepEqual([...PAGE_FIXTURE_CHECK_IDS], ["settingsLayout", "splitView"]);
  assert.deepEqual(THRESHOLDS.pageCrumbs, { maxLines: 1, tolerancePx: 0.5 });
  assert.deepEqual(THRESHOLDS.settingsLayout, { maxWidthPx: 1040, tolerancePx: 0.5 });
  assert.deepEqual(THRESHOLDS.splitView, { insetPx: 28, phoneInsetPx: 16, phoneMaxWidthPx: 390, tolerancePx: 0.5 });
  for (const id of ["pageCrumbs", "settingsLayout", "splitView"]) assert.match(gateSource, new RegExp(`^//\\s+${id}\\s`, "m"), `${id} in the gate header`);
  // the C-12 screens and the brand story are fixed in the fixture manifest
  const ids = (story) => manifest.stories.screens[story].map((s) => s.id);
  assert.deepEqual(ids("shell-top-band").slice(6), ["ts-search-l", "ts-settings-l", "ts-roster-l"]);
  assert.deepEqual(ids("shell-mobile").slice(2), ["ts-settings-m", "ts-roster-m"]);
  const lines = manifest.stories.screens["shell-brand-first-line"];
  assert.equal(lines.length, 8);
  assert.deepEqual([...new Set(lines.map((s) => s.product))], ["tms", "einzbern", "mana-orchestrate", "design-system"]);
  for (const product of new Set(lines.map((s) => s.product))) assert.deepEqual(lines.filter((s) => s.product === product).map((s) => s.lockup), ["lkr-line", "lk-line"], product);
  assert.ok(SHELL_STORY_IDS.includes("shell-brand-first-line"));
});

test("pageCrumbs: one line, nothing past the trail's box, a crumb wider than its box cut only as an ellipsis under a title", () => {
  const shell = (crumbs, w = 390) => ({ shells: [{ id: "s", w, x: { missing: [], pageCrumbs: crumbs } }] });
  const crumb = { text: "Account and notification settings", over: 75, clip: true, ellipsis: true, title: true };
  const trail = { el: "nav.tcrn-breadcrumb", lines: 1, excess: 0, clip: true, crumbs: [crumb, { ...crumb, over: 0, title: false, ellipsis: false }] };
  assert.equal(judgeGate("pageCrumbs", shell([trail])).status, "pass");
  const what = (crumbs) => judgeGate("pageCrumbs", shell(crumbs)).failures.map((f) => f.what.split(":")[0]);
  assert.deepEqual(what([{ ...trail, crumbs: [{ ...crumb, title: false }] }]), ["crumb.truncatedWithoutTitle"]);
  assert.deepEqual(what([{ ...trail, crumbs: [{ ...crumb, ellipsis: false }] }]), ["crumb.cut"]);
  assert.deepEqual(what([{ ...trail, crumbs: [{ ...crumb, clip: false }] }]), ["crumb.spill"]);
  assert.deepEqual(what([{ ...trail, lines: 2 }]), ["crumbs.lines"]);
  assert.deepEqual(what([{ ...trail, excess: 477 }]), ["crumbs.cut"]);
  assert.deepEqual(what([{ ...trail, excess: 30, clip: false }]), ["crumbs.spill"]);
  assert.deepEqual(what([{ ...trail, crumbs: [] }]), ["crumbs.none"]);
  // a shell without a page breadcrumb is not checked; a trail within the tolerance passes
  assert.equal(judgeGate("pageCrumbs", shell([])).status, "n/a");
  assert.equal(judgeGate("pageCrumbs", shell([{ ...trail, excess: 0.4 }])).status, "pass");
});

test("settingsLayout and splitView: at most 1040 and centred; the split view's left edge at the paper's content inset", () => {
  const shell = (x, w = 1440) => ({ shells: [{ id: "s", w, x: { missing: [], ...x } }] });
  const settings = (v) => judgeGate("settingsLayout", shell({ settingsLayouts: [v] }));
  assert.equal(settings({ el: "div", w: 1040, left: 188, right: 188 }).status, "pass");
  assert.equal(settings({ el: "div", w: 1040.4, left: 188.4, right: 188 }).status, "pass");
  assert.deepEqual(settings({ el: "div", w: 1360, left: 28, right: 28 }).failures.map((f) => [f.what, f.value]), [["settings.w", 1360]]);
  assert.deepEqual(settings({ el: "div", w: 1040, left: 28, right: 348 }).failures.map((f) => [f.what, f.value]), [["settings.left-right", -320]]);
  assert.equal(judgeGate("settingsLayout", shell({})).status, "n/a");
  const split = (left, w) => judgeGate("splitView", shell({ splitViews: [{ el: "section", left }] }, w));
  assert.equal(split(28, 1440).status, "pass");
  assert.equal(split(16, 390).status, "pass");
  assert.deepEqual(split(268, 1440).failures.map((f) => [f.what, f.value, f.expect]), [["split.left", 268, 28]]);
  assert.deepEqual(split(28, 390).failures.map((f) => [f.what, f.value, f.expect]), [["split.left", 28, 16]]);
  assert.equal(judgeGate("splitView", shell({})).status, "n/a");
});

test("markText names a first line by its shell, kind, mark size and product", () => {
  const reading = { shells: [], optical: [{ kind: "lkr-line", product: "tms", shell: null, mark: 22, inkMinusMark: 2.1, expect: 0 }, { kind: "brand", product: "tms", shell: "ts-closed-l", mark: 22, inkMinusMark: -1.4, expect: 0 }], lockups: [{ kind: "lk-line", product: "design-system", shell: null, off: 1.5 }] };
  assert.deepEqual(judgeGate("markText", reading).failures.map((f) => [f.at, f.what]), [["lkr-line@22:tms", "ink-mark"], ["ts-closed-l:brand@22:tms", "ink-mark"], ["lk-line:design-system", "text-mark"]]);
  assert.equal(judgeGate("markText", { shells: [], optical: [{ kind: "lk-line", mark: 44, inkMinusMark: 1, expect: 0 }], lockups: [] }).status, "pass");
});

test("149-GWT4: measure-shell.js and the library read the same numbers on the same board screens", async () => {
  for (const board of manifest.boards) {
    const { page, close } = await openBoard(board.file);
    try {
      const reference = await page.evaluate(referenceScript);
      const reading = await lib.measureShellPage(page, { selectors: lib.BOARD_SELECTORS, selectorSet: "board" });
      const diffs = [];
      const counter = { leaves: 0 };
      compareLeaves(reference, reading, board.id, diffs, counter);
      assert.deepEqual(diffs, [], board.id);
      assert.ok(counter.leaves > 250, `${board.id}: ${counter.leaves} reference leaves compared`);
      assert.equal(reference.shells.length, board.shells.length);
    } finally {
      await close();
    }
  }
});

test("the lower board reads the numbers its rulers were drawn from (spec-geom.json)", async () => {
  const geom = JSON.parse(read(manifest.specGeometry));
  const board = manifest.boards.find((item) => item.id === "shell-lower");
  const { page, close } = await openBoard(board.file);
  try {
    const reading = await lib.measureShellPage(page, { selectors: lib.BOARD_SELECTORS });
    const byId = Object.fromEntries(reading.shells.map((s) => [s.id, s]));
    const expanded = byId["spec-expanded"], drop = byId["spec-drop"], closed = byId["spec-closed"];
    assert.equal(expanded.pbar.regionTop, geom.menuBarTop);
    assert.equal(expanded.pbar.regionBottom, geom.menuBottom);
    assert.equal(expanded.x.menu.l + expanded.x.menu.w - expanded.x.bar.lockupRightInset, geom.lockRight);
    assert.equal(drop.drop.t + drop.drop.h, geom.dropBottom);
    assert.equal(closed.pins.firstLeft, geom.pills[0][0]);
    for (let i = 1; i < geom.pills.length; i++) assert.equal(closed.pins.gaps[i], geom.pills[i][0] - geom.pills[i - 1][1]);
    // on the vendored faces the pill edges themselves are the ruler's (text-width dependent)
    assert.deepEqual(closed.x.pins.items.map((item) => [item.l, Math.round((item.l + item.w) * 10) / 10]), geom.pills);
    assert.equal(expanded.x.firstRowTop, geom.menuItemTop);
    assert.equal(drop.x.firstRowTop, geom.dropRowTop);
  } finally {
    await close();
  }
});

test("the package hooks read a C-5 shell", async () => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  try {
    await page.setContent(`<!doctype html><style>body{margin:0}*{box-sizing:border-box}
      [data-shell]{position:relative;width:1440px;height:900px;display:grid;grid-template-rows:52px 1fr;overflow:hidden}
      [data-shell-strip]{display:flex;align-items:center;padding:0 12px}
      [data-tab]{display:inline-grid;grid-template-columns:22px auto 20px;column-gap:10px;align-items:center;width:134px;height:40px;padding:0 6px;border:0;background:transparent}
      [data-tab] b{display:block;font:600 12.5px/1.2 sans-serif;white-space:nowrap}
      [data-pins]{display:flex;gap:8px;margin-left:8px}[data-pin]{height:32px;padding:0 10px;border:0;background:transparent;white-space:nowrap}
      [data-cluster]{display:flex;gap:6px;align-items:center;height:40px;margin-left:auto}[data-cluster] button{width:32px;height:32px;border:0}
      [data-paper]{margin:0 12px 12px;border-radius:14px;background:#fff}</style>
      <div data-shell="pkg" data-state="closed"><div data-shell-strip>
        <button type="button" data-tab data-shell-brand="v2"><svg data-logo="tms" viewBox="0 0 48 48" width="22" height="22"><circle cx="24" cy="12.5" r="8" fill="#2c63c8"/></svg><b>TCRN <em>TMS</em></b><span data-shell-toggle style="width:20px;height:20px"></span></button>
        <nav data-pins><a data-pin="a" href="#a">名册</a><a data-pin="b" href="#b">合约</a></nav>
        <div data-cluster><button type="button" aria-label="通知">!</button></div>
      </div><main data-paper></main></div>`);
    const reading = await lib.measureShellPage(page, { selectors: lib.PACKAGE_SELECTORS, selectorSet: "package" });
    assert.equal(reading.shells.length, 1);
    const [shell] = reading.shells;
    assert.deepEqual(shell.x.missing, []);
    assert.equal(shell.tab.w, 134);
    assert.equal(shell.x.brand.version, "v2");
    assert.equal(shell.x.pins.visibleCount, 2);
    assert.equal(shell.pins.gaps[0], 8);
    assert.equal(shell.paper.t, 52);
    const verdict = judgeShellReadings(reading);
    assert.equal(verdict.gates.strip.status, "pass");
    assert.equal(verdict.gates.edges.status, "pass");
  } finally {
    await context.close();
  }
});

test("mutation ops: a missing target is an error, not a silent green", async () => {
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await page.setContent("<div class='a' title='x'>a</div>");
    await assert.rejects(page.evaluate(applyMutationInPage, [{ op: "retag", selector: ".missing", tag: "button" }]), /shell_mutation_target_missing/);
    await assert.rejects(page.evaluate(applyMutationInPage, [{ op: "replaceInAttr", selector: ".a", name: "title", from: "y", to: "z" }]), /shell_mutation_attr_missing/);
    assert.equal(await page.evaluate(applyMutationInPage, [{ op: "retag", selector: ".a", tag: "button" }]), true);
    assert.equal(await page.evaluate(() => document.querySelector(".a").tagName), "BUTTON");
  } finally {
    await context.close();
  }
});

test("149-GWT1 board side: all eighteen gates and the checks green on both boards, every mutation red on its gate, the package-hook fixture proves its story mutations", async () => {
  const report = await runFixtures({ root, browser });
  for (const id of GATE_IDS) assert.equal(report.gates[id], "pass", `gate ${id}`);
  for (const id of CHECK_IDS) assert.equal(report.checks[id], "pass", `check ${id}`);
  for (const board of report.boards) {
    assert.deepEqual(board.failed, [], `${board.id} failed gates`);
    assert.deepEqual(board.failedChecks, [], `${board.id} failed checks`);
    assert.deepEqual(board.fixtureFailures, [], `${board.id} fixture`);
  }
  const pf = report.packageFixture;
  assert.deepEqual(pf.fixtureFailures, [], "package fixture");
  assert.deepEqual(pf.green, Object.fromEntries(manifest.packageFixture.green.map((id) => [id, "pass"])));
  assert.deepEqual(pf.mutations.map((m) => [m.id, m.ok]), manifest.packageFixture.storyMutations.map((id) => [id, true]));
  assert.deepEqual(pf.listed.map((c) => c.cell).sort(), ["brand-mark-l", "panel-edge-l", "scrim-paper-l"]);
  // the page fixture (TCRN-DS-SUB-164): the page in the paper and the brand story's first lines
  const pg = report.pageFixture;
  assert.deepEqual(pg.fixtureFailures, [], "page fixture");
  assert.deepEqual(pg.green, Object.fromEntries(manifest.pageFixture.green.map((id) => [id, "pass"])));
  assert.deepEqual(pg.mutations.map((m) => [m.id, m.gate, m.ok, m.verdict]), manifest.pageFixture.storyMutations.map((id) => [id, storyMutationsAll.find((m) => m.id === id).gate, true, "turns red"]));
  for (const board of report.boards) for (const id of PAGE_FIXTURE_CHECK_IDS) assert.equal(board.checks[id].status, "n/a", `${board.id} draws no ${id}`);
  assert.equal(report.mutations.length, mutations.length);
  for (const result of report.mutations) assert.ok(result.ok, `${result.id}: failed ${JSON.stringify(result.failed)}, expected ${JSON.stringify(result.expected)}`);
  assert.ok(report.dSection.every((row) => row.status === "pass"));
  assert.equal(report.ok, true);
});

// ------------------------------------------------------------------ package stories (TCRN-DS-SUB-137)

const storyMutations = JSON.parse(read(DEFAULT_PATHS.fixtureMutations)).storyMutations;

test("149-GWT2 and 149-GWT3: geometry:measure runs the shell gate, verify runs geometry:measure, the CI step names it", () => {
  const pkg = JSON.parse(read("package.json"));
  assert.match(pkg.scripts["geometry:measure"], /&& node --test tests\/shell-measure-proof\.test\.mjs && node scripts\/shell-measure-proof\.mjs --fixtures && node scripts\/shell-measure-proof\.mjs$/);
  assert.match(pkg.scripts.verify, /&& pnpm geometry:measure &&/);
  const workflow = read(".github/workflows/verify.yml");
  const step = workflow.slice(workflow.indexOf("- name: Run the gate chain"));
  assert.match(step, /^\s+run: pnpm verify$/m);
  assert.match(step.slice(0, step.indexOf("run: pnpm verify")), /geometry:measure[\s\S]*scripts\/shell-measure-proof\.mjs/);
});

test("the story run grid is 1440 x 900 and 390 x 844, en and zh-CN (C-11)", () => {
  assert.deepEqual(Object.values(STORY_RUN.viewports).map((v) => `${v.width}x${v.height}`).sort(), ["1440x900", "390x844"]);
  assert.deepEqual([...STORY_RUN.locales], ["en", "zh-CN"]);
  assert.deepEqual(Object.keys(manifest.stories.screens).sort(), [...SHELL_STORY_IDS].sort());
  // a shell screen has its C-5 data-state; a first line of the brand story (no shell) its lockup and product
  for (const [story, screens] of Object.entries(manifest.stories.screens)) for (const screen of screens) assert.ok(screen.lockup ? ["lkr-line", "lk-line"].includes(screen.lockup) && typeof screen.product === "string" && screen.state === undefined : ["closed", "expanded", "drop", "sheet"].includes(screen.state), `${story} ${screen.id}`);
  for (const probe of ["focusLoop", "intro"]) assert.ok(SHELL_STORY_IDS.includes(manifest.stories.behaviour[probe].story), probe);
});

test("149-GWT1 real-part side: one story mutation per gate and check, the board variant, the three behaviour ones included", () => {
  for (const id of [...GATE_IDS, ...CHECK_IDS]) assert.equal(storyMutations.filter((m) => m.gate === id).length, 1, id);
  assert.equal(new Set(storyMutations.map((m) => m.id)).size, storyMutations.length);
  for (const m of storyMutations) {
    const board = mutations.find((f) => f.gate === m.gate);
    if (board) assert.equal(m.source, board.source, `${m.id} source`);
    else assert.ok(PAGE_FIXTURE_CHECK_IDS.includes(m.gate) && manifest.pageFixture.storyMutations.includes(m.id) && m.source.length > 0, `${m.id}: proven on the page fixture`);
    assert.ok(SHELL_STORY_IDS.includes(m.story), `${m.id} story`);
    if (m.probe) assert.ok(BEHAVIOUR_GATE_IDS.includes(m.probe) && ((m.ops && m.ops.length) || (m.beforeReload && m.beforeReload.length)), m.id);
    else assert.ok(Array.isArray(m.ops) && m.ops.length > 0 && !BEHAVIOUR_GATE_IDS.includes(m.gate), m.id);
  }
  const byGate = Object.fromEntries(storyMutations.map((m) => [m.gate, m]));
  assert.deepEqual(byGate.focusLoop.ops, [{ op: "noFocus", selector: "[data-tab]" }]);
  assert.deepEqual(byGate.intro.beforeReload, [{ op: "clearSessionStorage" }]);
  assert.match(byGate.touch.ops[0].css, /\[data-panel="sheet"\] \[data-shell-row\] \{ height: 32px/);
});

test("story mutations: green to red passes; on a red baseline only a new failure counts", () => {
  const gate = (status, failures = []) => ({ status, checked: 1, failures });
  const m = { id: "m", gate: "strip" };
  const red = gate("fail", [{ at: "s", what: "strip.h", value: 175, expect: 52 }]);
  assert.equal(judgeStoryMutation(m, { strip: gate("pass") }, { strip: red }).ok, true);
  const same = judgeStoryMutation(m, { strip: red }, { strip: red });
  assert.equal(same.ok, false);
  assert.match(same.verdict, /not distinguishable/);
  const more = judgeStoryMutation(m, { strip: red }, { strip: gate("fail", [...red.failures, { at: "s", what: "strip.borderBottom", value: 1, expect: 0 }]) });
  assert.equal(more.ok, true);
  assert.deepEqual(more.changedGates, ["strip"]);
  assert.equal(judgeStoryMutation(m, { strip: gate("pass") }, { strip: gate("pass") }).ok, false);
  assert.throws(() => judgeStoryMutation({ id: "x", gate: "nope" }, {}, {}), /gate_unknown/);
});

test("story screens: order and the C-5 data-state are checked", () => {
  const reading = { shells: [{ id: "ts-m-l", state: "closed" }, { id: "ts-m-s", state: "expanded" }, { id: "ts-settings-m", state: "closed" }, { id: "ts-roster-m", state: "closed" }] };
  assert.deepEqual(checkStoryScreens(reading, manifest.stories.screens["shell-mobile"]), [{ what: "data-state", shell: "ts-m-s", value: "expanded", expect: "sheet" }]);
  assert.equal(checkStoryScreens({ shells: [] }, manifest.stories.screens["shell-mobile"])[0].what, "screens");
  assert.deepEqual(checkStoryScreens({ shells: [] }, manifest.stories.screens["shell-matrix"]), []);
  // the brand story (TCRN-DS-SUB-164): the first lines outside every shell, as (lockup, product), in order
  const want = manifest.stories.screens["shell-brand-first-line"];
  const optical = want.map((s) => ({ kind: s.lockup, product: s.product, shell: null, mark: s.lockup === "lk-line" ? 44 : 22, inkMinusMark: 0, expect: 0 }));
  assert.deepEqual(checkStoryScreens({ shells: [], optical }, want), []);
  assert.deepEqual(checkStoryScreens({ shells: [], optical: [...optical, { kind: "brand", product: "tms", shell: "doc", mark: 22 }] }, want), [], "a first line inside a shell is not a brand screen");
  const swapped = checkStoryScreens({ shells: [], optical: [optical[1], optical[0], ...optical.slice(2)] }, want);
  assert.deepEqual(swapped.map((f) => f.what), ["first-lines"]);
  assert.deepEqual(checkStoryScreens({ shells: [], optical: optical.slice(0, 7) }, want).map((f) => f.what), ["first-lines"]);
  assert.deepEqual(checkStoryScreens({ shells: [{ id: "x", state: "closed" }], optical }, want).map((f) => f.what), ["screens"]);
});

test("touch: what opens at 390 must be the Sheet, so its rows-44 check cannot pass on a missing Sheet", () => {
  const phone = (panelKind, rowHeights = [44, 44]) => ({ shells: [{ id: "m", w: 390, tab: { h: 40 }, panel: {}, x: { missing: [], pins: { visibleCount: 0 }, panelKind, rowHeights, touch: { tabHit: true } } }] });
  assert.equal(judgeGate("touch", phone("sheet")).status, "pass");
  assert.deepEqual(judgeGate("touch", phone("expanded")).failures.map((f) => f.what), ["layer.notSheet"]);
  assert.deepEqual(judgeGate("touch", phone("sheet", [44, 32])).failures.map((f) => f.what), ["sheet.row"]);
});

test("package readings: rows without the row-text hook are a hook gap; aria-owned cascade columns are columns", async () => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  try {
    await page.setContent(`<!doctype html><style>body{margin:0}*{box-sizing:border-box}
      [data-shell]{position:relative;width:1440px;height:900px;display:grid;grid-template-rows:52px 1fr}
      [data-shell-strip]{display:flex;align-items:center;padding:0 12px}[data-tab]{width:134px;height:40px}
      [data-pins]{display:flex;gap:8px;margin-left:8px}[data-pin]{height:32px}[data-cluster]{margin-left:auto;height:40px}
      [data-shell-dropdown]{position:absolute;top:52px;left:154px;display:flex;gap:4px}[data-panel]{width:240px;height:200px}
      [data-drop-col]{width:240px;height:200px}[data-shell-row]{display:block;height:32px}</style>
      <div data-shell="pkg" data-state="drop"><div data-shell-strip>
        <button type="button" data-tab data-shell-brand="v1"><svg data-logo="tms" viewBox="0 0 48 48" width="22" height="22"><circle cx="24" cy="12.5" r="8" fill="#2c63c8"/></svg></button>
        <nav data-pins><span data-pin="a"><button type="button" data-open-pin aria-expanded="true">A</button></span></nav>
        <div data-cluster><button type="button" aria-label="Notifications">!</button></div>
      </div><main data-paper></main>
      <div data-shell-dropdown><section data-panel="drop" role="dialog" aria-owns="col-2"><a href="#" data-shell-row>One</a><a href="#" data-shell-row>Two</a></section>
      <div id="col-2" data-drop-col="2" role="group"><a href="#" data-shell-row>Three</a></div></div></div>`);
    const reading = await lib.measureShellPage(page, { selectors: lib.PACKAGE_SELECTORS, selectorSet: "package" });
    const [shell] = reading.shells;
    assert.deepEqual(shell.x.hookGaps, ["rowText"]);
    assert.equal(shell.x.rowGroups, null);
    assert.equal(shell.x.dropCols.length, 2);
    const verdict = judgeShellReadings(reading);
    assert.deepEqual(verdict.missingHooks, [{ shell: "pkg", missing: ["rowText"] }]);
    assert.equal(verdict.gates.pinJitter.status, "n/a");
    assert.equal(verdict.gates.cascade.checked, 1);
  } finally {
    await context.close();
  }
});

test("package readings: the rendered brand version, and the first-batch shadow probe of a focus ring", async () => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  try {
    await page.setContent(`<!doctype html><style>body{margin:0;background:#fff}*{box-sizing:border-box}
      [data-shell]{width:390px;height:600px;display:grid;grid-template-rows:52px 1fr}[data-shell-strip]{display:flex;align-items:center;padding:0 12px}
      [data-tab]{height:40px;padding:0 9px;border:0;background:transparent}[data-tab] b{display:none}[data-cluster]{margin-left:auto}
      .ring{box-shadow:0 0 0 2px #fff, 0 0 0 4px rgb(44, 99, 200);color:#16150f;background:#fff;border:0}</style>
      <div data-shell="phone" data-state="closed"><div data-shell-strip>
        <button type="button" data-tab data-shell-brand="v2"><svg data-logo="tms" viewBox="0 0 48 48" width="22" height="22"><circle cx="24" cy="12.5" r="8" fill="#2c63c8"/></svg><b>TCRN <em>TMS</em></b></button>
        <div data-cluster><button type="button" class="ring" data-cell="ring-l" data-kind="edge" data-expect="5.5" data-probe="shadow">!</button></div>
      </div><main data-paper></main></div>`);
    const reading = await lib.measureShellPage(page, { selectors: lib.PACKAGE_SELECTORS, selectorSet: "package" });
    assert.deepEqual([reading.shells[0].x.brand.version, reading.shells[0].x.brand.declared], ["v1", "v2"]);
    const [cell] = reading.contrastCells;
    assert.equal(cell.unknownProbe, undefined);
    assert.ok(cell.ratio > 5 && cell.ratio < 6, `ring ratio ${cell.ratio}`);
  } finally {
    await context.close();
  }
});

test("package readings: a shell inside another shell's paper is read against its own paper", async () => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  try {
    await page.setContent(`<!doctype html><style>body{margin:0}*{box-sizing:border-box}[data-shell="inner"]{width:900px;height:400px;display:grid;grid-template-rows:52px 1fr}
      [data-shell-strip]{display:flex;align-items:center;padding:0 12px}[data-tab] b{white-space:nowrap}[data-cluster]{margin-left:auto}</style>
      <div data-shell="doc"><div data-paper><main id="content">
        <div data-shell="inner" data-state="closed"><div data-shell-strip>
          <button type="button" data-tab data-shell-brand="v2"><svg data-logo="tms" viewBox="0 0 48 48" width="22" height="22"><circle cx="24" cy="12.5" r="8" fill="#2c63c8"/></svg><b title="TCRN TMS">TCRN <em>TMS</em></b></button>
          <div data-cluster><button type="button" aria-label="Notifications">!</button></div>
        </div><aside>resident</aside><main data-paper></main></div>
      </main></div></div>`);
    const reading = await lib.measureShellPage(page, { selectors: lib.PACKAGE_SELECTORS, selectorSet: "package", root: "#content" });
    const [shell] = reading.shells;
    assert.equal(shell.id, "inner");
    assert.ok(shell.x.textLines.some((line) => line.el === "b"), JSON.stringify(shell.x.textLines));
    assert.equal(shell.x.sidebars, 1);
    assert.equal(reading.marks[0].shell, "inner");
  } finally {
    await context.close();
  }
});

// The package-hook fixture of --fixtures (manifest packageFixture, TCRN-DS-SUB-174).
async function openPackageFixture() {
  const context = await browser.newContext({ viewport: manifest.viewport, deviceScaleFactor: 1 });
  const page = await openBoardPage(context, root, manifest.packageFixture.file);
  return { page, close: () => context.close() };
}
const readPackage = (page) => lib.measureShellPage(page, { selectors: lib.PACKAGE_SELECTORS, selectorSet: "package" });

test("package readings: a pinnable row's pin is found in its .tcrn-nav-item-row, its column is the wrapper's parent, and the guide column reads every column as the first", async () => {
  const { page, close } = await openPackageFixture();
  try {
    const reading = await readPackage(page);
    const [shell] = reading.shells;
    assert.deepEqual([shell.x.missing, shell.x.hookGaps], [[], []]);
    assert.equal(shell.x.rowGroups.length, 3);
    assert.deepEqual(shell.x.rowGroups[0], { rest: [223.3], hover: [223.3], on: [223.3] });
    assert.deepEqual(shell.pinVisibleOn, { on: 1, hover: 1 });
    assert.deepEqual(shell.pinButtons, ["24x24"]);
    // o.prail (measure-shell.js) stays panel-relative and takes every hook, so the pinned column hidden
    // at >= 1024 (TCRN-DS-SUB-206) adds its undrawn icons at -12 (left 0 against the panel's 12); no gate
    // reads o.prail. x.prail, which the prail check judges, reads each drawn column as the first
    assert.deepEqual(shell.prail.icons, [16, 333.3, 650.7, -12]);
    assert.deepEqual(shell.x.prail, { columns: 3, icons: [16], texts: [48] });
    const verdict = judgeShellReadings(reading);
    assert.equal(verdict.gates.pinJitter.status, "pass");
    assert.equal(verdict.checks.prail.status, "pass");
    // menu columns with rows but without the guide hooks are a hook gap, not an empty pass
    await page.evaluate(() => { for (const el of document.querySelectorAll('[data-guide="prail"]')) el.removeAttribute("data-guide"); });
    const bare = await readPackage(page);
    assert.deepEqual([bare.shells[0].x.hookGaps, bare.shells[0].x.prail], [["prail"], null]);
    const gapVerdict = judgeShellReadings(bare);
    assert.equal(gapVerdict.checks.prail.status, "n/a");
    assert.deepEqual(gapVerdict.missingHooks, [{ shell: "ts-x-l", missing: ["prail"] }]);
  } finally {
    await close();
  }
});

test("pinJitter story mutation: the pin display alone on the reserved 24 track is an equivalent mutation; taking the track away turns the gate red", async () => {
  const story = storyMutations.find((m) => m.gate === "pinJitter");
  assert.match(story.ops[0].css, /\.tcrn-nav-item-row \{ grid-template-columns: minmax\(0, 1fr\) auto !important; \}/);
  const displayOnly = [{ op: "css", css: story.ops[0].css.replace(/^[^}]*\.tcrn-nav-item-row \{[^}]*\}\s*/, "") }];
  assert.doesNotMatch(displayOnly[0].css, /grid-template-columns/);
  for (const [ops, want] of [[displayOnly, "pass"], [story.ops, "fail"]]) {
    const { page, close } = await openPackageFixture();
    try {
      await page.evaluate(applyMutationInPage, ops);
      const verdict = judgeShellReadings(await readPackage(page));
      // display alone leaves every text box as wide (a display:none pin draws nothing and is not read,
      // TCRN-DS-SUB-206); without the track the rest rows widen by the pin slot
      const jitter = verdict.gates.pinJitter.failures.filter((f) => /textWidths$/.test(f.what));
      assert.deepEqual(jitter.map((f) => f.what), want === "fail" ? ["column1.textWidths"] : [], JSON.stringify(verdict.gates.pinJitter.failures));
      if (want === "fail") assert.equal(verdict.gates.pinJitter.status, "fail");
    } finally {
      await close();
    }
  }
});

// TCRN-DS-SUB-206 (R3-1): the package hides the full menu's pinned column at >= 1024; its pins are in the
// DOM with no client rect. The gate reads only drawn pins and rows: green on the real part's DOM, where
// the R2 reading (every element, drawn or not) read the hidden pins as 0 x 0 and turned pinJitter red.
test("pinJitter reads only drawn pins and rows: the pinned column hidden at >= 1024 is not four 0 x 0 pins (TCRN-DS-SUB-206)", async () => {
  const { page, close } = await openPackageFixture();
  try {
    const hidden = await page.evaluate(() => [...document.querySelectorAll('[data-panel="expanded"] [data-shell-pinned-group] [data-pin-button]')].map((el) => el.getClientRects().length));
    assert.deepEqual(hidden, [0, 0, 0, 0]);
    const reading = await readPackage(page);
    const [shell] = reading.shells;
    assert.deepEqual(shell.pinButtons, ["24x24"]);
    assert.equal(shell.x.rowGroups.length, 3);
    assert.equal(judgeShellReadings(reading).gates.pinJitter.status, "pass");
    // the R2 reading: count every element as drawn, and the hidden column's pins read 0 x 0 again
    await page.evaluate(() => {
      const own = Element.prototype.getClientRects;
      Element.prototype.getClientRects = function everyElementDrawn() { const list = own.call(this); return list.length ? list : [this.getBoundingClientRect()]; };
    });
    const r2 = await readPackage(page);
    assert.deepEqual(r2.shells[0].pinButtons, ["24x24", "0x0"]);
    const r2Gate = judgeShellReadings(r2).gates.pinJitter;
    assert.equal(r2Gate.status, "fail");
    assert.deepEqual(r2Gate.failures.map((f) => [f.at, f.what, f.value]), [["ts-x-l", "pinButton", "0x0"]]);
  } finally {
    await close();
  }
});

// TCRN-DS-SUB-206 (R3-1): the singleLine story mutation lengthens a label the gate reads at 1440. A drawn
// group heading truncates under its title, so a 40-character tail alone is an equivalent mutation; with
// its truncation taken away (white-space normal) the 40 characters break its single line.
test("singleLine story mutation: a drawn group heading lengthened by 40 characters; under its title alone it is equivalent, without its truncation it breaks the line (TCRN-DS-SUB-206)", async () => {
  const story = storyMutations.find((m) => m.gate === "singleLine");
  assert.equal(story.id, "story-label-plus-40");
  const append = story.ops.filter((op) => op.op === "appendText");
  assert.deepEqual(append.map((op) => [op.text, op.repeat]), [["长", 40]]);
  assert.doesNotMatch(append[0].selector, /\[data-shell-pinned-group\] >/);
  for (const [ops, want] of [[append, "pass"], [story.ops, "fail"]]) {
    const { page, close } = await openPackageFixture();
    try {
      assert.equal(await page.evaluate((s) => document.querySelector(s).getClientRects().length > 0, append[0].selector), true);
      await page.evaluate(applyMutationInPage, ops);
      const gate = judgeShellReadings(await readPackage(page)).gates.singleLine;
      assert.equal(gate.status, want, JSON.stringify(gate.failures));
      if (want === "fail") assert.ok(gate.failures.some((f) => f.what === "lines:span.tcrn-nav-group__label-text" && f.value >= 2), JSON.stringify(gate.failures));
    } finally {
      await close();
    }
  }
});

test("package readings: the three 07a B reading cases (彩色标, 面板对画布, 遮罩下的纸) read the B-section numbers", async () => {
  const { page, close } = await openPackageFixture();
  try {
    const reading = await readPackage(page);
    const byCell = Object.fromEntries(reading.contrastCells.map((c) => [c.cell, c]));
    const near = (c, want) => assert.ok(Math.abs(c.ratio - want) <= THRESHOLDS.contrast.maxDiff, `${c.cell} ${c.ratio} vs ${want}`);
    assert.deepEqual([byCell["brand-mark-l"].probe, byCell["brand-mark-l"].autoProbe], ["mark", true]);
    near(byCell["brand-mark-l"], 4.85);
    assert.deepEqual([byCell["panel-edge-l"].probe, byCell["panel-edge-l"].autoProbe], ["own-bg", true]);
    near(byCell["panel-edge-l"], 1.16);
    // 遮罩下的纸: the cell keeps its own reading (8.58) and reads 5.57 under the scrim
    near(byCell["scrim-paper-l"], 8.58);
    assert.equal(byCell["scrim-paper-l"].underScrim.scrims, 1);
    near({ cell: "scrim-paper-l under the scrim", ratio: byCell["scrim-paper-l"].underScrim.ratio }, 5.57);
    // a row on a layer above the scrim does not read it; a plain cell keeps the colour probe
    assert.equal(byCell["sheet-row-l"].underScrim, undefined);
    near(byCell["sheet-row-l"], 8.58);
    assert.deepEqual([byCell["body-canvas-l"].probe, byCell["body-canvas-l"].autoProbe], ["color", undefined]);
    const verdict = judgeShellReadings(reading);
    assert.equal(verdict.gates.contrast.status, "pass");
    assert.deepEqual(verdict.gates.contrast.listed.map((c) => [c.cell, c.ratio]), [["brand-mark-l", 4.85], ["panel-edge-l", 1.16], ["scrim-paper-l", 5.57]]);
  } finally {
    await close();
  }
});

// TCRN-DS-SUB-207 (R3-2): a cell's fill is the paint stack under its centre. The search shortcut is a
// sibling laid over the input's 6% wash (no pointer events, no fill of its own): it reads the board's
// 7.59 and 6.11, where the R2 ancestor walk met only the panel and read 8.58 and 7.23.
test("contrast reads a cell's fill from the paint stack at its centre: the shortcut over the washed input reads 7.59 and 6.11, the R2 ancestor walk 8.58 and 7.23 (TCRN-DS-SUB-207)", async () => {
  const { page, close } = await openPackageFixture();
  try {
    const shape = await page.evaluate(() => [...document.querySelectorAll('[data-cell^="srch-kbd-"]')].map((k) => [k.previousElementSibling.matches("input.tcrn-search-input__control"), getComputedStyle(k).position, getComputedStyle(k).pointerEvents, getComputedStyle(k).backgroundColor]));
    assert.deepEqual(shape, [[true, "absolute", "none", "rgba(0, 0, 0, 0)"], [true, "absolute", "none", "rgba(0, 0, 0, 0)"]]);
    const near = (c, want) => assert.ok(Math.abs(c.ratio - want) <= THRESHOLDS.contrast.maxDiff, `${c.cell} ${c.ratio} vs ${want}`);
    const byCell = (reading) => Object.fromEntries(reading.contrastCells.map((c) => [c.cell, c]));
    const reading = await readPackage(page);
    const now = byCell(reading);
    near(now["srch-kbd-l"], 7.59);
    near(now["srch-kbd-n"], 6.11);
    assert.deepEqual(reading.contrastCells.filter((c) => c.backdrop).map((c) => c.cell), []);
    // the read leaves no inline style behind on the cells
    assert.deepEqual(await page.evaluate(() => [...document.querySelectorAll("[data-cell]")].filter((el) => el.hasAttribute("style")).length), 0);
    assert.equal(judgeShellReadings(reading).gates.contrast.status, "pass");
    // the R2 reading: no paint stack, the fill walked up the ancestors to the panel
    await page.evaluate(() => { document.elementsFromPoint = () => []; });
    const r2Reading = await readPackage(page);
    const r2 = byCell(r2Reading);
    near(r2["srch-kbd-l"], 8.58);
    near(r2["srch-kbd-n"], 7.23);
    assert.equal(r2["srch-kbd-l"].backdrop, "ancestors");
    assert.deepEqual(judgeShellReadings(r2Reading).gates.contrast.failures.map((f) => [f.at, f.what]), [["srch-kbd-l", "ratio-expect"], ["srch-kbd-n", "ratio-expect"]]);
  } finally {
    await close();
  }
});

test("page readings (TCRN-DS-SUB-164): the breadcrumb per crumb, SettingsLayout against the paper's edges, SplitView's left edge, the first lines by product", async () => {
  const { page, close } = await openBoard(manifest.pageFixture.file);
  try {
    const reading = await readPackage(page);
    const byId = Object.fromEntries(reading.shells.map((s) => [s.id, s]));
    assert.deepEqual(Object.keys(byId), ["ts-settings-l", "ts-roster-l", "ts-settings-m", "ts-roster-m"]);
    for (const s of reading.shells) {
      assert.deepEqual([s.x.missing, s.x.hookGaps], [[], []], s.id);
      assert.equal(s.x.pageCrumbs.length, 1, s.id);
      const [trail] = s.x.pageCrumbs;
      assert.deepEqual([trail.lines, trail.excess], [1, 0], s.id);
      for (const crumb of trail.crumbs) assert.ok(crumb.clip && crumb.ellipsis && crumb.title, `${s.id} ${crumb.text}`);
      // at 1240 the long trail fits; on the 390 phone every crumb gives way
      assert.ok(trail.crumbs.every((crumb) => (s.w > 390 ? crumb.over === 0 : crumb.over > 0)), s.id);
    }
    assert.deepEqual(byId["ts-settings-l"].x.settingsLayouts.map((v) => [v.w, v.left, v.right]), [[1040, 88, 88]]);
    assert.deepEqual(byId["ts-settings-m"].x.settingsLayouts.map((v) => [v.w, v.left, v.right]), [[334, 16, 16]]);
    assert.deepEqual([byId["ts-roster-l"].x.splitViews.map((v) => v.left), byId["ts-roster-m"].x.splitViews.map((v) => v.left)], [[28], [16]]);
    assert.deepEqual([byId["ts-settings-l"].x.splitViews, byId["ts-roster-l"].x.settingsLayouts], [[], []]);
    // the brand story's first lines sit outside every shell; the brand buttons' lines are their shells'
    const lines = reading.optical.filter((o) => !o.shell);
    // TCRN-DS-SUB-230: the Design System first line and the bottom bar's two-line lockup after the TMS lines
    assert.deepEqual(lines.map((o) => [o.kind, o.product, o.mark]), [["lkr-line", "tms", 22], ["lk-line", "tms", 44], ["lkr-line", "design-system", 22], ["lkr", "tms", 22]]);
    assert.ok(reading.optical.filter((o) => o.shell).every((o) => o.product === "tms" && byId[o.shell]));
    const verdict = judgeShellReadings(reading);
    for (const id of manifest.pageFixture.green) assert.equal({ ...verdict.gates, ...verdict.checks }[id].status, "pass", id);
  } finally {
    await close();
  }
});

// TCRN-DS-SUB-230 (MIN-20261016-R6 D3): markText reads the middle of the band from the first line's cap top
// (the baseline less the cap height of the line's face) to the baseline, so no ink below the baseline is
// read: the Design System first line, whose "g" and "y" descend, reads what the TMS first line reads (the
// R5 reading, cap top to ink bottom, put it 1.3 lower: 1.4 on the brand story). A lockup with a second line
// ends the band on that line's baseline (the bottom bar's two-line block, centred on the mark as the Brand
// board's section E draws it, reads 0.6): its second line's descenders are not read either, a first line
// moved down 2 turns the gate red, and so does a second line moved down 4 (the band's lower end moves 4).
test("markText reads the band from the first line's cap top to the baseline: descenders are not read; a two-line lockup's band ends on its second line's baseline (TCRN-DS-SUB-230)", async () => {
  const twoLine = '[data-lockup="lkr"][data-product-id="tms"]';
  const lineOf = (reading, kind, product) => reading.optical.find((o) => !o.shell && o.kind === kind && o.product === product);
  const readWith = async (change) => {
    const { page, close } = await openBoard(manifest.pageFixture.file);
    try {
      if (change) await page.evaluate(change.fn, change.arg);
      const reading = await readPackage(page);
      return { two: lineOf(reading, "lkr", "tms"), reading, markText: judgeShellReadings(reading).gates.markText };
    } finally {
      await close();
    }
  };
  const css = (text) => ({ fn: applyMutationInPage, arg: [{ op: "css", css: text }] });
  const base = await readWith(null);
  const tms = lineOf(base.reading, "lkr-line", "tms"), ds = lineOf(base.reading, "lkr-line", "design-system");
  assert.ok(Math.abs(ds.inkMinusMark - tms.inkMinusMark) <= 0.1, `descenders read: design-system ${ds.inkMinusMark}, tms ${tms.inkMinusMark}`);
  for (const row of [tms, ds, base.two]) assert.ok(Math.abs(row.inkMinusMark - row.expect) <= THRESHOLDS.markText.maxInkOffsetPx, JSON.stringify(row));
  assert.equal(base.markText.status, "pass", JSON.stringify(base.markText.failures));
  // the second line without descenders reads the same
  const caps = await readWith({ fn: (sel) => { document.querySelector(sel).textContent = "TALENT MANAGEMENT SYSTEM"; }, arg: `${twoLine} small` });
  assert.ok(Math.abs(caps.two.inkMinusMark - base.two.inkMinusMark) <= 0.05, `second line ink read: ${caps.two.inkMinusMark} vs ${base.two.inkMinusMark}`);
  assert.equal(caps.markText.status, "pass");
  // the first line down 2 moves the band's upper end 2 (the midline 1): red
  const firstDown = await readWith(css(`${twoLine} b { position: relative; top: 2px; }`));
  assert.ok(Math.abs(firstDown.two.inkMinusMark - base.two.inkMinusMark - 1) <= 0.1, `first line down 2: ${firstDown.two.inkMinusMark}`);
  assert.deepEqual(firstDown.markText.failures.map((f) => [f.at, f.what]), [["lkr@22:tms", "ink-mark"]]);
  // the second line down 4 moves the band's lower end 4 (the midline 2): red
  const secondDown = await readWith(css(`${twoLine} small { position: relative; top: 4px; }`));
  assert.ok(Math.abs(secondDown.two.inkMinusMark - base.two.inkMinusMark - 2) <= 0.1, `second line down 4: ${secondDown.two.inkMinusMark}`);
  assert.deepEqual(secondDown.markText.failures.map((f) => [f.at, f.what]), [["lkr@22:tms", "ink-mark"]]);
});

// TCRN-DS-SUB-196 (R3-3): singleLine reads the page breadcrumb crumb by crumb. The fixture's trails give way
// one crumb at a time, each cut as an ellipsis under its title: green, where the R2 reading of the whole
// trail as one text line (no crumb key) failed the two phone screens. A crumb that gives way without an
// ellipsis (the fixture's template) fails, alone.
test("singleLine reads the page breadcrumb crumb by crumb: crumbs cut under their titles pass, a crumb cut without an ellipsis fails (TCRN-DS-SUB-196)", async () => {
  const { page, close } = await openBoard(manifest.pageFixture.file);
  try {
    const crumbLines = (reading, id) => reading.shells.find((s) => s.id === id).x.textLines.filter((l) => /breadcrumb/.test(l.el));
    const reading = await readPackage(page);
    for (const s of reading.shells) {
      const lines = crumbLines(reading, s.id);
      assert.deepEqual(lines.map((l) => l.text), s.x.pageCrumbs[0].crumbs.map((c) => c.text), s.id);
      assert.ok(lines.every((l) => l.lines === 1 && /^(a|b)\.tcrn-breadcrumb__crumb/.test(l.el)), s.id);
      // at 1240 the long trail fits; on the 390 phone every crumb gives way, cut as an ellipsis under its title
      assert.ok(lines.every((l) => (s.w > 390 ? l.excess === 0 : l.excess > 0 && l.clip && l.ellipsis && l.title)), s.id);
    }
    assert.equal(judgeShellReadings(reading).gates.singleLine.status, "pass");
    // the R2 reading (no crumb key: the trail as one line) cut the two phone trails
    const r2 = await lib.measureShellPage(page, { selectors: { ...lib.PACKAGE_SELECTORS, pageCrumb: null }, selectorSet: "package" });
    assert.deepEqual(judgeShellReadings(r2).gates.singleLine.failures.map((f) => [f.at, f.what]), [["ts-settings-m", "cut:nav.tcrn-breadcrumb"], ["ts-roster-m", "cut:nav.tcrn-breadcrumb"]]);
    // a crumb that gives way without an ellipsis fails, and only it
    await page.evaluate(() => {
      const item = document.getElementById("crumb-cut-without-ellipsis").content.firstElementChild.cloneNode(true);
      document.querySelector('[data-shell="ts-settings-m"] [data-paper] .tcrn-breadcrumb').appendChild(item);
    });
    const cut = await readPackage(page);
    const gate = judgeShellReadings(cut).gates.singleLine;
    assert.equal(gate.status, "fail");
    assert.deepEqual(gate.failures.map((f) => [f.at, f.what]), [["ts-settings-m", "cut:a.tcrn-breadcrumb__crumb.tcrn-breadcrumb__crumb--clip"]]);
    assert.ok(gate.failures[0].value > 0);
  } finally {
    await close();
  }
});

// A shell that behaves as the G section says (vanilla script), and an intro that plays once a session.
const PROBE_SHELL = `<!doctype html><meta charset="utf-8"><style>body{margin:0;height:900px}[hidden]{display:none!important}
  [data-shell]{position:relative;width:900px;height:600px}[data-tab]{width:134px;height:40px}
  #menu{position:absolute;top:52px;left:12px;width:400px;height:300px;background:#fff}#col2{position:absolute;top:52px;left:416px;width:200px;height:300px}
  [data-shell-row]{display:block;height:32px}</style>
  <div data-shell="probe" data-state="closed"><div data-shell-strip><button type="button" data-tab aria-controls="menu">Brand</button></div>
  <div data-cluster></div><main data-paper></main>
  <section id="menu" hidden data-panel="expanded" role="dialog"><div data-shell-search><input type="search" aria-label="Search"></div>
    <a href="#c" data-shell-row aria-controls="col2" aria-expanded="false">Contracts</a><a href="#r" data-shell-row>Roster</a></section>
  <div id="col2" hidden data-drop-col="2" role="group"><a href="#t" data-shell-row>Templates</a></div></div>
  <script>
    const shell = document.querySelector("[data-shell]"), tab = shell.querySelector("[data-tab]"), menu = document.getElementById("menu"), col2 = document.getElementById("col2");
    const setOpen = (open) => { menu.hidden = !open; col2.hidden = true; shell.dataset.state = open ? "expanded" : "closed"; };
    tab.addEventListener("click", () => setOpen(menu.hidden));
    document.addEventListener("keydown", (event) => {
      const active = document.activeElement;
      if (event.key === "Escape" && !menu.hidden) { setOpen(false); tab.focus(); }
      else if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) { event.preventDefault(); setOpen(true); menu.querySelector("input").focus(); }
      else if (event.key === "ArrowRight" && active && active.hasAttribute("aria-controls") && menu.contains(active)) { col2.hidden = false; col2.querySelector("a").focus(); }
      else if (event.key === "ArrowLeft" && active && col2.contains(active)) menu.querySelector("[aria-controls]").focus();
    });
    document.addEventListener("pointerdown", (event) => { if (!menu.hidden && !menu.contains(event.target) && !col2.contains(event.target) && !tab.contains(event.target)) setOpen(false); });
  </script>`;
const PROBE_INTRO = `<!doctype html><meta charset="utf-8"><div data-shell="probe-intro"><main data-paper></main></div>
  <script>
    if (sessionStorage.getItem("probe-intro") === null) {
      sessionStorage.setItem("probe-intro", "played");
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const layer = document.createElement("div");
        layer.setAttribute("data-shell-intro", "");
        document.body.appendChild(layer);
        layer.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 240 }).finished.then(() => layer.remove());
      }
    }
  </script>`;

// TCRN-DS-SUB-179 (R3-16): a second shell on the probe page. When it registers ⌘K too, its handler (the later one) puts
// the focus in its own search; when it does not, the probed shell keeps the key.
const OTHER_SHELL = (registersCommandK) => `<div data-shell="other" data-state="closed"><div data-shell-strip><button type="button" data-tab aria-controls="other-menu">Other</button></div>
  <section id="other-menu" hidden data-panel="expanded" role="dialog"><div data-shell-search><input type="search" aria-label="Search the other shell"></div></section></div>
  <script>
    ${registersCommandK ? `document.addEventListener("keydown", (event) => {
      if (event.key.toLowerCase() !== "k" || !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      const menu = document.getElementById("other-menu");
      menu.hidden = false;
      menu.closest("[data-shell]").dataset.state = "expanded";
      menu.querySelector("input").focus();
    });` : ""}
  </script>`;

async function withProbePages(run) {
  const server = createServer((request, response) => {
    response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    if (request.url.startsWith("/intro")) response.end(PROBE_INTRO);
    else if (request.url.startsWith("/two-shells-one-key")) response.end(PROBE_SHELL + OTHER_SHELL(false));
    else if (request.url.startsWith("/two-shells")) response.end(PROBE_SHELL + OTHER_SHELL(true));
    else response.end(PROBE_SHELL);
  });
  await new Promise((done) => server.listen(0, "127.0.0.1", done));
  try {
    return await run(`http://127.0.0.1:${server.address().port}`);
  } finally {
    await new Promise((done) => server.close(done));
  }
}

async function probeCommandK(path) {
  return await withProbePages(async (origin) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1400 } });
    try {
      const page = await context.newPage();
      await page.goto(`${origin}${path}`, { waitUntil: "load" });
      return await probeShellBehaviour(page, { screen: "probe", waitMs: 50 });
    } finally {
      await context.close();
    }
  });
}

test("focusLoop (TCRN-DS-SUB-179): two shells on the page both registering ⌘K fail — the focus lands in the other shell's search", async () => {
  const both = await probeCommandK("/two-shells");
  assert.equal(both.trace.focusLoop.afterCommandK, "search:other-shell");
  const verdict = judgeBehaviourTraces(both.trace).focusLoop;
  assert.equal(verdict.status, "fail");
  assert.ok(verdict.failures.some((failure) => failure.what === "afterCommandK" && failure.value === "search:other-shell"));
});

test("focusLoop (TCRN-DS-SUB-179): only the probed screen registering ⌘K passes — the focus is in its own search", async () => {
  const one = await probeCommandK("/two-shells-one-key");
  assert.equal(one.trace.focusLoop.afterCommandK, "search");
  assert.equal(judgeBehaviourTraces(one.trace).focusLoop.status, "pass");
});

test("behaviour probes: a shell that keeps the focus loop passes; focus not handed back fails (focusLoop mutation)", async () => {
  await withProbePages(async (origin) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    try {
      const probe = async (ops) => {
        const page = await context.newPage();
        await page.goto(`${origin}/shell`, { waitUntil: "load" });
        if (ops) await page.evaluate(applyMutationInPage, ops);
        try {
          return await probeShellBehaviour(page, { screen: "probe", waitMs: 50 });
        } finally {
          await page.close();
        }
      };
      const green = await probe(null);
      assert.deepEqual(green.trace.focusLoop, { afterEscape: "tab", afterCommandK: "search", cascadeArrowRight: { from: 1, to: 2, row: "Contracts" }, cascadeArrowLeft: { from: 2, to: 1, row: "Contracts" } });
      assert.equal(green.trace.outsideClick.closesOnOutsideClick, true);
      const gates = judgeBehaviourTraces(green.trace);
      assert.equal(gates.focusLoop.status, "pass");
      assert.equal(gates.noCollapse.status, "pass");
      const mutated = await probe(storyMutations.find((m) => m.gate === "focusLoop").ops);
      assert.equal(mutated.trace.focusLoop.afterEscape, "body");
      const verdict = judgeStoryMutation({ id: "f", gate: "focusLoop" }, gates, judgeBehaviourTraces(mutated.trace));
      assert.equal(verdict.ok, true);
      // a static shell (nothing opens) is recorded as unopened, never as a pass
      const page = await context.newPage();
      await page.setContent(`<div data-shell="still"><button type="button" data-tab>Brand</button><main data-paper></main></div>`);
      const still = await probeShellBehaviour(page, { screen: "still", waitMs: 20 });
      await page.close();
      assert.equal(still.trace.focusLoop.afterEscape, "unopened");
      assert.equal(still.trace.outsideClick.closesOnOutsideClick, "unopened");
      assert.equal(judgeBehaviourTraces(still.trace).focusLoop.status, "fail");
    } finally {
      await context.close();
    }
  });
});

test("behaviour probes: an intro played once a session passes; forgetting the session marker fails (intro mutation)", async () => {
  await withProbePages(async (origin) => {
    const trace = await probeShellIntro(browser, `${origin}/intro`, { waitMs: 600 });
    assert.equal(trace.firstLoadPlays, 1);
    assert.equal(trace.reloadPlays, 0);
    assert.equal(trace.reducedMotionPlays, 0);
    assert.deepEqual([...trace.properties].sort(), ["opacity", "transform"]);
    assert.ok(trace.durationMs >= 200 && trace.durationMs <= THRESHOLDS.intro.maxDurationMs, `durationMs ${trace.durationMs}`);
    assert.equal(judgeIntroTrace(trace).status, "pass");
    const mutated = await probeShellIntro(browser, `${origin}/intro`, { waitMs: 600, beforeReload: storyMutations.find((m) => m.gate === "intro").beforeReload });
    assert.equal(mutated.reloadPlays, 1);
    assert.equal(judgeIntroTrace(mutated).status, "fail");
  });
});

test("parseArgs", () => {
  assert.deepEqual(parseArgs(["--fixtures"]), { fixtures: true, stories: [], writeReport: null });
  assert.deepEqual(parseArgs(["--story", "shell-top-band", "--write-report"]), { fixtures: false, stories: ["shell-top-band"], writeReport: DEFAULT_PATHS.reportPath });
  assert.throws(() => parseArgs(["--nope"]), /unknown_argument/);
});
