// SPDX-License-Identifier: Apache-2.0
// Contract proof (TCRN-DS-STORY-122, TCRN-DS-SUB-011): green on the tree, and for each acceptance
// clause a mutation that turns the matching check red. Mutations are made in a temporary copy of the
// files the proof reads, or on an in-memory copy of the package exports; the tree is never edited.
// Needs the built packages/ui-react/dist (run the build first).
import test from "node:test";
import assert from "node:assert/strict";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { generate } from "../scripts/contract-generate.mjs";
import {
  BOARD_DIR,
  BOARD_FILES,
  CHECK_IDS,
  CONSUMPTION_CONTRACT,
  CONTRACT_DIR,
  DIST_ENTRY,
  EXPECTED_CELLS,
  GENERATOR,
  LOGO_DIR,
  TOOLS,
  boardCells,
  compositeParts,
  cssSegments,
  formatResult,
  isStateSelector,
  pairStateAtoms,
  runContractProof,
  stateRuleLiterals
} from "../scripts/contract-proof.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const distEntry = join(repoRoot, DIST_ENTRY);
const GENERATED = [...generate().keys()];
const ACTIONS_PAIRS = "packages/ui-react/src/styles/generated/actions.pairs.ts";
const INPUTS_PAIRS = "packages/ui-react/src/styles/generated/inputs.pairs.ts";
const COPIED = [GENERATOR, ...TOOLS, ...GENERATED, CONSUMPTION_CONTRACT, CONTRACT_DIR, LOGO_DIR, ...Object.values(BOARD_FILES).map((file) => `${BOARD_DIR}/${file}`)];

const read = (root, rel) => readFileSync(join(root, rel), "utf8");
const write = (root, rel, text) => writeFileSync(join(root, rel), text);
const checkOf = (result, id) => result.checks.find((check) => check.id === id);
const moduleOf = (table) => (table === "actions" ? ACTIONS_PAIRS : INPUTS_PAIRS);

let uiModule;
async function realUi() {
  assert.ok(existsSync(distEntry), `${DIST_ENTRY} is missing: build @tcrn/ui-react before this test`);
  uiModule ??= await import(pathToFileURL(distEntry).href);
  return uiModule;
}

/** Run fn on a temporary copy of the files the proof reads; the copy is removed afterwards. */
async function withCopy(fn) {
  const root = mkdtempSync(join(tmpdir(), "tcrn-contract-proof-"));
  try {
    for (const rel of COPIED) {
      mkdirSync(dirname(join(root, rel)), { recursive: true });
      cpSync(join(repoRoot, rel), join(root, rel), { recursive: true });
    }
    return await fn(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

/** Change one ink token in pairs.json, in a pair state no matrix cell reads (so the contract still loads). */
function changeOneInk(root) {
  const rel = `${CONTRACT_DIR}/pairs.json`;
  const raw = read(root, rel);
  const pairs = JSON.parse(raw);
  const matrices = JSON.parse(read(root, `${CONTRACT_DIR}/matrices.json`));
  const tokens = JSON.parse(read(root, `${CONTRACT_DIR}/tokens.json`));
  const readByCells = new Set(Object.values(matrices.boards).flatMap((board) => board.cells.map((cell) => cell.pair).filter(Boolean)));
  for (const [table, entry] of Object.entries(pairs.tables)) {
    for (const [variant, states] of Object.entries(entry.variants)) {
      for (const [state, slots] of Object.entries(states)) {
        if (typeof slots.ink !== "string" || readByCells.has(`${table}.${variant}.${state}`)) continue;
        const to = slots.ink === "ink-2" ? "ink" : "ink-2";
        const pattern = new RegExp(`("${variant}"\\s*:\\s*\\{[\\s\\S]*?"${state}"\\s*:\\s*\\{[^{}]*?"ink"\\s*:\\s*")${slots.ink}(")`, "u");
        const changed = raw.replace(pattern, `$1${to}$2`);
        const wanted = structuredClone(pairs);
        wanted.tables[table].variants[variant][state].ink = to;
        assert.deepEqual(JSON.parse(changed), wanted, "the edit changes exactly one ink token");
        write(root, rel, changed);
        return { table, variant, state, from: slots.ink, to, cssVar: tokens.themed.find((token) => token.key === to).cssVar };
      }
    }
  }
  return assert.fail("pairs.json has no ink token outside the matrix cells");
}

test("the tree: every check is green, with the 37 icons, the 8 mark files and the 240 matrix cells", async () => {
  await realUi();
  const result = await runContractProof();
  assert.equal(result.ok, true, formatResult(result));
  assert.deepEqual(result.checks.map((check) => check.id), [...CHECK_IDS]);
  assert.match(checkOf(result, "generated-sources").summary, new RegExp(`^${GENERATED.length} generated files`, "u"));
  assert.match(checkOf(result, "icon-roster").summary, /same 37 names/u);
  assert.match(checkOf(result, "product-marks").summary, /the 8 SVG files/u);
  const cells = Object.values(EXPECTED_CELLS).reduce((sum, count) => sum + count, 0);
  assert.match(checkOf(result, "matrix-expect").summary, new RegExp(`5 boards, ${cells} cells \\(44/28/10/116/42\\).*largest difference 0\\.00`, "u"));
});

test("state rules: the pairs.json conditions decide what a state rule is; only a transparent outline is allowed", () => {
  const atoms = pairStateAtoms(JSON.parse(read(repoRoot, `${CONTRACT_DIR}/pairs.json`)));
  assert.equal(isStateSelector('.tcrn-button:where(:hover,[data-tcrn-preview-state="hover"])', atoms), true);
  assert.equal(isStateSelector(".tcrn-checkbox:checked::after", atoms), true);
  assert.equal(isStateSelector(".tcrn-button.tcrn-button--primary", atoms), false);
  assert.equal(isStateSelector(".tcrn-field:hover .tcrn-input", atoms, new Set(["tcrn-input"])), false);
  assert.deepEqual(stateRuleLiterals({ prop: "outline", value: "2px solid transparent" }), []);
  assert.deepEqual(stateRuleLiterals({ prop: "box-shadow", value: "0 0 0 1px transparent" }), ["transparent"]);
  assert.deepEqual(stateRuleLiterals({ prop: "--tcrn-pair-fill", value: "var(--tcrn-pair-fill-h)" }), []);
  assert.deepEqual(stateRuleLiterals({ prop: "color", value: "#c00" }), ["#c00"]);
});

test("GWT1: one ink token changed in pairs.json without regenerating turns generated-sources red", async () => {
  await withCopy(async (root) => {
    const change = changeOneInk(root);
    const result = await runContractProof({ root, distEntry });
    const generated = checkOf(result, "generated-sources");
    assert.equal(result.ok, false);
    assert.equal(generated.ok, false);
    const module = moduleOf(change.table);
    assert.ok(generated.failures.some((failure) => failure.startsWith(`${module}: contract-sha256`) && failure.includes("pairs.json")), formatResult(result));
    assert.ok(generated.failures.some((failure) => failure.startsWith(`${module}: differs from a fresh generate()`)), formatResult(result));
  });
});

test("GWT2: after regenerating (and rebuilding) the proof is green again", async () => {
  const ui = await realUi();
  await withCopy(async (root) => {
    const change = changeOneInk(root);
    assert.equal(checkOf(await runContractProof({ root, distEntry }), "generated-sources").ok, false);
    const { generate: regenerate } = await import(pathToFileURL(join(root, GENERATOR)).href);
    for (const [rel, content] of regenerate()) write(root, rel, content);
    // The rebuilt package: the dist CSS with each regenerated segment in place of the one it replaces.
    let css = ui.tcrnComponentCss;
    for (const rel of GENERATED) {
      const before = cssSegments(read(repoRoot, rel));
      const after = cssSegments(read(root, rel));
      before.forEach((segment, index) => {
        if (segment.css === after[index].css || compositeParts(segment, before)) return;
        assert.ok(css.includes(segment.css), `the dist holds ${rel}#${segment.name}`);
        css = css.split(segment.css).join(after[index].css);
      });
    }
    const result = await runContractProof({ root, ui: { ...ui, tcrnComponentCss: css } });
    assert.equal(result.ok, true, formatResult(result));
    assert.ok(read(root, moduleOf(change.table)).includes(`--tcrn-pair-ink-${change.state}:var(${change.cssVar})`));
  });
});

test("GWT2: a colour literal in a state rule turns the proof red (package CSS, contract value, hand edit)", async () => {
  const ui = await realUi();
  const segment = cssSegments(read(repoRoot, ACTIONS_PAIRS))[0].css;
  const at = ui.tcrnComponentCss.indexOf(segment);
  assert.ok(at >= 0, "the dist holds the generated actions segment");
  const brace = segment.indexOf("{", segment.indexOf(":where("));
  const css = ui.tcrnComponentCss.slice(0, at) + segment.slice(0, brace + 1) + "color:#c00;" + segment.slice(brace + 1) + ui.tcrnComponentCss.slice(at + segment.length);
  const packageResult = await runContractProof({ ui: { ...ui, tcrnComponentCss: css } });
  const packageCss = checkOf(packageResult, "package-css");
  assert.equal(packageCss.ok, false);
  assert.ok(packageCss.failures.some((failure) => failure.includes("state rule") && failure.includes("colour literal #c00")), formatResult(packageResult));

  await withCopy(async (root) => {
    const rel = `${CONTRACT_DIR}/pairs.json`;
    const pairs = JSON.parse(read(root, rel));
    const table = Object.values(pairs.tables).find((entry) => entry.weight && Object.keys(entry.weight).some((key) => key !== "default"));
    const state = Object.keys(table.weight).find((key) => key !== "default");
    table.weight[state] = "#c00";
    write(root, rel, `${JSON.stringify(pairs, null, 2)}\n`);
    const result = await runContractProof({ root, distEntry });
    const rules = checkOf(result, "generated-state-rules");
    assert.equal(rules.ok, false);
    assert.ok(rules.failures.some((failure) => failure.includes("(--tcrn-pair-weight: #c00)")), formatResult(result));
  });

  await withCopy(async (root) => {
    const text = read(root, ACTIONS_PAIRS);
    const open = text.indexOf("{", text.indexOf(":where("));
    write(root, ACTIONS_PAIRS, text.slice(0, open + 1) + "background:white;" + text.slice(open + 1));
    const result = await runContractProof({ root, distEntry });
    assert.equal(checkOf(result, "generated-sources").ok, false);
    const rules = checkOf(result, "generated-state-rules");
    assert.equal(rules.ok, false);
    assert.ok(rules.failures.some((failure) => failure.includes("(file on disk)") && failure.includes("colour literal white")), formatResult(result));
    assert.ok(rules.failures.some((failure) => failure.includes("writes background; a pair state rule only switches --tcrn-pair-*")), formatResult(result));
  });
});

test("GWT3: icons.json and tcrnIconNames must be the same set; a renamed or dropped name turns icon-roster red", async () => {
  const ui = await realUi();
  await withCopy(async (root) => {
    const rel = `${CONTRACT_DIR}/icons.json`;
    const raw = read(root, rel);
    const name = JSON.parse(raw).icons.at(-1).name;
    const changed = raw.replace(new RegExp(`("name"\\s*:\\s*")${name}(")`, "u"), `$1${name}-renamed$2`);
    assert.notEqual(changed, raw);
    write(root, rel, changed);
    const result = await runContractProof({ root, distEntry });
    const icons = checkOf(result, "icon-roster");
    assert.equal(icons.ok, false);
    assert.ok(icons.failures.includes(`only in icons.json: ${name}-renamed`), formatResult(result));
    assert.ok(icons.failures.includes(`only in tcrnIconNames: ${name}`), formatResult(result));
  });
  const dropped = ui.tcrnIconNames[0];
  const result = await runContractProof({ ui: { ...ui, tcrnIconNames: ui.tcrnIconNames.slice(1) } });
  const icons = checkOf(result, "icon-roster");
  assert.equal(icons.ok, false);
  assert.ok(icons.failures.includes(`only in icons.json: ${dropped}`), formatResult(result));
});

test("GWT4: the SVG generated from marks.json must equal logos2 byte for byte; a changed mark or a changed byte turns product-marks red", async () => {
  await withCopy(async (root) => {
    const rel = `${CONTRACT_DIR}/marks.json`;
    const marks = JSON.parse(read(root, rel));
    const mark = marks.marks.find((candidate) => candidate.body.includes("{bright}"));
    mark.body = mark.body.replace("{bright}", "{deep}");
    write(root, rel, `${JSON.stringify(marks, null, 2)}\n`);
    const result = await runContractProof({ root, distEntry });
    const product = checkOf(result, "product-marks");
    assert.equal(product.ok, false);
    assert.ok(product.failures.some((failure) => failure.startsWith(`${LOGO_DIR}/${mark.id}.svg: differs from the SVG generated from marks.json`)), formatResult(result));
    assert.ok(!product.failures.some((failure) => failure.startsWith(`${LOGO_DIR}/${mark.id}-mono.svg:`)), "the mono file draws one ink, so it is unchanged");
  });
  await withCopy(async (root) => {
    const marks = JSON.parse(read(root, `${CONTRACT_DIR}/marks.json`));
    const rel = `${LOGO_DIR}/${marks.marks[0].id}-mono.svg`;
    writeFileSync(join(root, rel), Buffer.concat([readFileSync(join(root, rel)), Buffer.from(" ")]));
    const result = await runContractProof({ root, distEntry });
    const product = checkOf(result, "product-marks");
    assert.equal(product.ok, false);
    assert.ok(product.failures.some((failure) => failure.startsWith(`${rel}: differs from the SVG generated from marks.json`)), formatResult(result));
  });
});

test("matrix: every cell's expect must equal the board data-expect at two decimals; a changed or missing cell turns matrix-expect red", async () => {
  await withCopy(async (root) => {
    const rel = `${BOARD_DIR}/${BOARD_FILES.actions}`;
    const html = read(root, rel);
    const cells = boardCells(html);
    const first = cells[0];
    const last = cells.at(-1);
    const bumped = (Number(first.expect) + 0.01).toFixed(2);
    const changed = html
      .replace(`data-cell="${first.cellId}" data-kind="${first.kind}" data-expect="${first.expect}"`, `data-cell="${first.cellId}" data-kind="${first.kind}" data-expect="${bumped}"`)
      .replace(`data-cell="${last.cellId}"`, `data-gone="${last.cellId}"`);
    assert.equal(boardCells(changed).length, cells.length - 1);
    write(root, rel, changed);
    const result = await runContractProof({ root, distEntry });
    const matrix = checkOf(result, "matrix-expect");
    assert.equal(matrix.ok, false);
    assert.ok(matrix.failures.includes(`actions/${first.cellId}: data-expect ${bumped} on the board, ${first.expect} from the contract (difference 0.01)`), formatResult(result));
    assert.ok(matrix.failures.includes(`actions: ${BOARD_FILES.actions} has ${EXPECTED_CELLS.actions - 1} data-cell elements; the board has ${EXPECTED_CELLS.actions}`), formatResult(result));
    assert.ok(matrix.failures.includes(`actions/${last.cellId}: no data-cell element on ${BOARD_FILES.actions}`), formatResult(result));
  });
});
