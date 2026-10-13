// SPDX-License-Identifier: Apache-2.0
// Tab-shell reading library and the eighteen shell gates (TCRN-DS-STORY-149, TCRN-DS-SUB-135).
import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import * as lib from "../scripts/lib/shell-measure.mjs";
import {
  BEHAVIOUR_GATE_IDS,
  DEFAULT_PATHS,
  D_SECTION_ROWS,
  GATES,
  GATE_IDS,
  READING_GATE_IDS,
  THRESHOLDS,
  applyMutationInPage,
  judgeBehaviour,
  judgeFocusTrace,
  judgeGate,
  judgeIntroTrace,
  judgeShellReadings,
  openBoardPage,
  parseArgs,
  runFixtures
} from "../scripts/shell-measure-proof.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const manifest = JSON.parse(read(DEFAULT_PATHS.fixtureManifest));
const mutations = JSON.parse(read(DEFAULT_PATHS.fixtureMutations)).mutations;
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

test("every gate has exactly one mutation, taken from the G section", () => {
  for (const id of GATE_IDS) assert.equal(mutations.filter((m) => m.gate === id).length, 1, id);
  assert.equal(new Set(mutations.map((m) => m.id)).size, mutations.length);
  const boards = new Set(manifest.boards.map((board) => board.id));
  for (const m of mutations) {
    const name = GATES.find((gate) => gate.id === m.gate).name;
    assert.ok(boardSource.includes(`["${name}", "`) && boardSource.includes(`", "${m.source}"]`), `${m.id} source`);
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

test("contrast keeps the night suffix cells pending under D7 and fails any other low cell", () => {
  const cell = (name, ratio, expect = ratio, kind = "text") => ({ cell: name, kind, probe: "color", exempt: false, expect, ratio });
  const pending = judgeGate("contrast", { contrastCells: [cell("brand-suffix-n", 3.33), cell("lk-em-n", 3.13), cell("tgl-l", 6.9, 6.9, "icon")] });
  assert.equal(pending.status, "pass");
  assert.equal(pending.pending.length, 2);
  assert.equal(judgeGate("contrast", { contrastCells: [cell("brand-suffix-l", 3.33)] }).status, "fail");
  assert.equal(judgeGate("contrast", { contrastCells: [cell("srch-ph-l", 5.1, 7.59)] }).status, "fail");
  assert.equal(judgeGate("contrast", { contrastCells: [{ ...cell("srch-ph-l", 7.59), expect: null }] }).status, "fail");
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

test("149-GWT1 board side: all eighteen gates green on both boards, every mutation red on its gate", async () => {
  const report = await runFixtures({ root, browser });
  for (const id of GATE_IDS) assert.equal(report.gates[id], "pass", `gate ${id}`);
  for (const board of report.boards) {
    assert.deepEqual(board.failed, [], `${board.id} failed gates`);
    assert.deepEqual(board.fixtureFailures, [], `${board.id} fixture`);
  }
  assert.equal(report.mutations.length, mutations.length);
  for (const result of report.mutations) assert.ok(result.ok, `${result.id}: failed ${JSON.stringify(result.failed)}, expected ${JSON.stringify(result.expected)}`);
  assert.ok(report.dSection.every((row) => row.status === "pass"));
  assert.equal(report.ok, true);
});

test("parseArgs", () => {
  assert.deepEqual(parseArgs(["--fixtures"]), { fixtures: true, stories: [], writeReport: null });
  assert.deepEqual(parseArgs(["--story", "shell-top-band", "--write-report"]), { fixtures: false, stories: ["shell-top-band"], writeReport: DEFAULT_PATHS.reportPath });
  assert.throws(() => parseArgs(["--nope"]), /unknown_argument/);
});
