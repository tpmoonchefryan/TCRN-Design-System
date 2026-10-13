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
  EXPECTED_SHELL_NAMED,
  GENERATOR,
  LOGO_DIR,
  SHELL_BOARD,
  TOOLS,
  boardCells,
  compositeParts,
  cssSegments,
  formatResult,
  isSheetStateSelector,
  isStateSelector,
  pairBaseClasses,
  pairStateAtoms,
  runContractProof,
  shellBoardMatrix,
  stateRuleLiterals
} from "../scripts/contract-proof.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const distEntry = join(repoRoot, DIST_ENTRY);
const GENERATED = [...generate().keys()];
const ACTIONS_PAIRS = "packages/ui-react/src/styles/generated/actions.pairs.ts";
const INPUTS_PAIRS = "packages/ui-react/src/styles/generated/inputs.pairs.ts";
const COPIED = [GENERATOR, ...TOOLS, ...GENERATED, CONSUMPTION_CONTRACT, CONTRACT_DIR, LOGO_DIR, ...Object.values(BOARD_FILES).map((file) => `${BOARD_DIR}/${file}`), SHELL_BOARD];

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

test("the tree: every check is green, with the 38 icons, the 8 mark files and the 306 matrix cells", async () => {
  await realUi();
  const result = await runContractProof();
  assert.equal(result.ok, true, formatResult(result));
  assert.deepEqual(result.checks.map((check) => check.id), [...CHECK_IDS]);
  assert.match(checkOf(result, "generated-sources").summary, new RegExp(`^${GENERATED.length} generated files`, "u"));
  const stateRules = /its (\d+) state rules \((\d+) of them on the pairs\.json target bases\)/u.exec(checkOf(result, "package-css").summary);
  assert.ok(stateRules && Number(stateRules[1]) > Number(stateRules[2]), "package-css reads the state rules of the whole sheet, not only those of the pairs.json target bases");
  assert.match(checkOf(result, "icon-roster").summary, /same 38 names/u);
  assert.match(checkOf(result, "product-marks").summary, /the 8 SVG files/u);
  const cells = Object.values(EXPECTED_CELLS).reduce((sum, count) => sum + count, 0);
  assert.match(checkOf(result, "matrix-expect").summary, new RegExp(`6 boards, ${cells} cells \\(44/28/10/116/42/66\\).*section B and ${EXPECTED_SHELL_NAMED} 07a names \\(largest difference 0\\.00`, "u"));
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

test("state rules of the sheet: a clauses.md C2 state condition on any compound, or a pairs.json condition; not the theme, structure or a non-state attribute", () => {
  const atoms = pairStateAtoms(JSON.parse(read(repoRoot, `${CONTRACT_DIR}/pairs.json`)));
  // Outside the pairs.json target bases: the rules package-css did not read before TCRN-DS-SUB-053.
  for (const selector of [
    '.tcrn-shell-locale-menu__trigger[aria-expanded="true"]',
    ".tcrn-shell-locale-menu__trigger:hover",
    '.tcrn-nav-item[aria-current="page"]',
    ".tcrn-field:hover .tcrn-input",
    '.tcrn-tab:where([data-tcrn-preview-state="focus"])',
    ".tcrn-tooltip:is(:focus-within) .tcrn-tooltip__content",
    ".tcrn-table-shell__row[disabled]"
  ]) {
    assert.equal(isSheetStateSelector(selector, atoms), true, selector);
  }
  // Still read: the state rules of the pairs.json target bases.
  assert.equal(isSheetStateSelector('.tcrn-button:where(:hover,[data-tcrn-preview-state="hover"])', atoms), true);
  assert.equal(isSheetStateSelector('.tcrn-button:where(:not([aria-busy="true"])) > .tcrn-button__spinner', atoms), true);
  // Not state rules: the theme scope, structure, a variant, a pseudo-element, a non-state attribute, a condition only inside :has().
  for (const selector of [
    '[data-tcrn-theme="dark"]',
    ":root",
    ".tcrn-list > .tcrn-list__item:first-child",
    ".tcrn-button.tcrn-button--primary",
    ".tcrn-checkbox::before",
    '.tcrn-collapsible-region[aria-hidden="true"]',
    ".tcrn-card:has(.tcrn-card__link:focus-visible)"
  ]) {
    assert.equal(isSheetStateSelector(selector, atoms), false, selector);
  }
});

test("GWT2 (R2-7): a colour literal in a state rule outside the pairs.json targets turns package-css red; the theme scope and non-state rules are not read", async () => {
  const ui = await realUi();
  const pairs = JSON.parse(read(repoRoot, `${CONTRACT_DIR}/pairs.json`));
  const atoms = pairStateAtoms(pairs);
  const bases = pairBaseClasses(pairs);
  // The locale trigger's hover and open rule: the R1 defect (a literal shadow) put back into the built sheet.
  const anchor = '.tcrn-shell-locale-menu__trigger[aria-expanded="true"] {';
  assert.ok(ui.tcrnComponentCss.includes(anchor), "the dist holds the locale trigger's hover and open rule");
  const injected = [
    { selector: ".tcrn-nav-item:hover", css: ".tcrn-nav-item:hover{background:rgba(1, 2, 3, 0.5)}", literal: "rgba(" },
    { selector: '.tcrn-shell-locale-menu__option[aria-current="true"]', css: '.tcrn-shell-locale-menu__option[aria-current="true"]{color:#c00}', literal: "#c00" },
    { selector: '.tcrn-tab:where([data-tcrn-preview-state="hover"])', css: '.tcrn-tab:where([data-tcrn-preview-state="hover"]){border-color:rgb(1, 2, 3)}', literal: "rgb(" }
  ];
  for (const entry of [{ selector: anchor.slice(0, -2) }, ...injected]) {
    assert.equal(isStateSelector(entry.selector, atoms, bases), false, `${entry.selector} is not a state rule of a pairs.json target base`);
  }
  const notRead = [
    '[data-tcrn-theme="dark"] .tcrn-divider{border-top-color:#0c0}',
    ".tcrn-divider{border-top-color:#00c}",
    '.tcrn-collapsible-region[aria-hidden="true"]{color:#0cc}',
    ".tcrn-nav-item:focus-visible{outline:2px solid transparent}"
  ];
  const css = [ui.tcrnComponentCss.replace(anchor, `${anchor}\n  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.12);`), ...injected.map((entry) => entry.css), ...notRead].join("\n");
  const result = await runContractProof({ ui: { ...ui, tcrnComponentCss: css } });
  const packageCss = checkOf(result, "package-css");
  assert.equal(packageCss.ok, false);
  assert.ok(
    packageCss.failures.some((failure) => failure.includes(anchor.slice(0, -2)) && failure.includes("colour literal rgba( (box-shadow: 0 1px 3px rgba(15, 23, 42, 0.12))")),
    formatResult(result)
  );
  for (const entry of injected) {
    assert.ok(packageCss.failures.some((failure) => failure.includes(`state rule ${entry.selector} carries the colour literal ${entry.literal}`)), `${entry.selector}\n${formatResult(result)}`);
  }
  for (const word of ["#0c0", "#00c", "#0cc", ".tcrn-nav-item:focus-visible"]) {
    assert.ok(!packageCss.failures.some((failure) => failure.includes(word)), `${word} is not read as a state-rule literal\n${formatResult(result)}`);
  }
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

test("shell matrix (TCRN-DS-SUB-136): section B gives 66 cells in contract order; a changed data-cr, a changed section A value or a renamed section A cell turns matrix-expect red", async () => {
  const board = shellBoardMatrix(read(repoRoot, SHELL_BOARD));
  assert.equal(board.rows.length, 33);
  assert.equal(board.rows.flatMap((row) => row.cells).length, EXPECTED_CELLS.shell);
  assert.deepEqual(board.rows.map((row) => row.cells.map((cell) => cell.exempt)).filter(([light, night]) => light || night).length, 3, "three exempt rows: the colour mark, the panel against the canvas and the paper under the scrim");
  await withCopy(async (root) => {
    const html = read(root, SHELL_BOARD);
    // Row 2 (idle wordmark) light is 15.75; section A's open-state pin-rest-l and the tgl-n name.
    const changed = html
      .replace('<td class="n " data-cr="15.75">15.75</td>', '<td class="n " data-cr="15.70">15.70</td>')
      .replace('data-cell="pin-rest-l" data-kind="text" data-expect="7.39"', 'data-cell="pin-rest-l" data-kind="text" data-expect="7.40"')
      .replaceAll('data-cell="tgl-n"', 'data-cell="toggle-n"');
    assert.notEqual(changed, html);
    write(root, SHELL_BOARD, changed);
    const result = await runContractProof({ root, distEntry });
    const matrix = checkOf(result, "matrix-expect");
    assert.equal(matrix.ok, false);
    assert.ok(matrix.failures.includes("shell/brand-word-l: section B row 2 (idle · 字标 TCRN) light data-cr 15.70, 15.75 from the contract (difference 0.05)"), formatResult(result));
    assert.ok(matrix.failures.includes("shell/pin-rest-l: section A names pin-rest-l with 7.40 text; the contract gives 7.39 text"), formatResult(result));
    assert.ok(matrix.failures.includes(`shell: ${EXPECTED_SHELL_NAMED - 1} cells carry a name section A uses; ${EXPECTED_SHELL_NAMED} do on the board`), formatResult(result));
  });
});
