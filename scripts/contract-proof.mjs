#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
// TCRN-DS-STORY-122 (TCRN-DS-SUB-011) — the contract proof.
//
// Holds what is generated from the G+ contract (docs/design/gplus-2026-10/contract/*.json) to the
// contract. Six checks, each green or red; any red exits 1:
//
//   generated-sources      every file scripts/contract-generate.mjs writes exists, starts with the 勿手改
//                          header, carries a contract-sha256 equal to the sha256 of the contract files the
//                          header names (recomputed here the generator's way) and equals a fresh
//                          generate() byte for byte; the generated directories hold nothing else.
//   generated-state-rules  in the generated pair segments every state rule (a pairs.json state condition
//                          on one of the rule's compounds) only switches --tcrn-pair-* and carries no colour
//                          literal, one state rule per ruleOrder entry; the state rules of the other
//                          generated segments carry no colour literal either.
//   package-css            tcrnComponentCss of the built packages/ui-react/dist/index.js contains every
//                          generated segment verbatim (a segment that only joins the others of its module
//                          counts through its parts), and no state rule of the whole sheet carries a colour
//                          literal. A state rule is a style rule one of whose compounds has a state
//                          condition as docs/contract/clauses.md C2 defines it (a state pseudo-class, a
//                          state ARIA attribute, data-tcrn-preview-state, readonly or disabled, inside
//                          :where() and :is() too; read through contract-static's selectorFacts), or a
//                          pairs.json state condition (TCRN-DS-SUB-053: the check used to read only the
//                          state rules of the pairs.json target bases). Colour literal means css-rules
//                          colourLiterals; the one allowance is the one contract-static C2 makes: an
//                          outline whose only colour is transparent (the forced-colours focus ring).
//   icon-roster            icons.json lists 38 distinct names and they are the set of tcrnIconNames (37 of the G+ batch
//                          plus pin, TCRN-DS-SUB-123; a variant such as the solid pin is not a name).
//   product-marks          the eight SVG files generated from marks.json (the build-logos2 file form: the
//                          palette for <id>.svg, monoInk for <id>-mono.svg) equal docs/design/gplus-2026-10/
//                          logos2 byte for byte and the directory holds no other svg; tcrnProductMarkSvg of
//                          the dist gives the same bytes; productMarkSources in
//                          apps/storybook/src/build/ai-consumption-contract.ts registers the same bytes and
//                          sha256.
//   matrix-expect          per board, the contract cells, the generated matrix data and the board data-cell
//                          elements are the same cells (44/28/10/116/42); every cell's expect (the contract
//                          values through the board cr/fmt, two decimals) equals the generated expect and
//                          the board data-expect with difference 0, and kind and exemption agree. The shell
//                          board (07a, Shell.dc.html; TCRN-DS-SUB-136) is read through its section B matrix:
//                          its 33 rows give 66 cells (the contract lists the light cells in row order, then
//                          the night cells), each data-cr equals the cell's expect with difference 0 and the
//                          ex mark equals the exemption; a cell whose 07a name (id plus the theme suffix) is
//                          a data-cell of section A must equal one of those elements in data-expect and
//                          data-kind (the brand button's idle and open states share a name there), and
//                          the rows only section B has carry names section A does not use.
//
// The package CSS and exports come from the built dist (build first); no source layout of
// packages/ui-react is read. The proof writes nothing.
//
//   node scripts/contract-proof.mjs [--json]
//   import { runContractProof } from "./contract-proof.mjs"   // options { root, distEntry, ui } for tests
import { createHash } from "node:crypto";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync, symlinkSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { selectorFacts } from "./contract-static-proof.mjs";
import { colourLiterals, compounds, parseCompound, parseCss, selectorList } from "./lib/css-rules.mjs";

export const SCHEMA_VERSION = "tcrn.ds.contract-proof.v1";
export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Process-level negative controls need real CLI input, not an injected exports object. Copies have
// their own sources, built entries and workspace links; only the already installed tools are shared.
// The finally owns their lifetime, including a failed compiler or assertion.
export async function withIsolatedProofTree(fn, { sourceRoot = ROOT } = {}) {
  const scratch = join(sourceRoot, "node_modules/.cache/tcrn-proof-fixtures");
  mkdirSync(scratch, { recursive: true });
  const root = mkdtempSync(join(scratch, "process-"));
  const excluded = new Set(["node_modules", ".git", ".cache", ".tarball-smoke"]);
  try {
    for (const rel of ["package.json", "tsconfig.base.json", "scripts", "packages", "docs/contract", "docs/style-scale.md", "docs/verification/doc-shell-class", "docs/design/gplus-2026-10", "docs/design/visual-standard", "apps/storybook/src", "apps/storybook/.storybook", "apps/storybook/dist", "apps/storybook/assets", "apps/storybook/storybook-static", "examples"]) {
      if (!existsSync(join(sourceRoot, rel))) continue;
      mkdirSync(dirname(join(root, rel)), { recursive: true });
      cpSync(join(sourceRoot, rel), join(root, rel), { recursive: true, filter: (file) => !excluded.has(file.split(sep).at(-1)) });
    }
    symlinkSync(join(sourceRoot, "node_modules"), join(root, "node_modules"), "dir");
    for (const rel of ["packages/ui-react", "apps/storybook", "examples/tms-react-pilot", "examples/aos-token-copy-state-pilot"]) {
      const modules = join(sourceRoot, rel, "node_modules");
      if (!existsSync(modules)) continue;
      for (const entry of readdirSync(modules, { withFileTypes: true })) {
        if (entry.name.startsWith(".")) continue;
        const children = entry.name.startsWith("@") ? readdirSync(join(modules, entry.name)).map((name) => `${entry.name}/${name}`) : [entry.name];
        for (const name of children) {
          const destination = join(root, rel, "node_modules", name);
          const target = name.startsWith("@tcrn/") ? join(root, "packages", name.slice("@tcrn/".length)) : realpathSync(join(modules, name));
          mkdirSync(dirname(destination), { recursive: true });
          symlinkSync(target, destination, "dir");
        }
      }
    }
    return await fn(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

export function runProofProcess(root, argv) {
  const run = spawnSync(process.execPath, argv, { cwd: root, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  return { cwd: root, argv: [process.execPath, ...argv], status: run.status, signal: run.signal, error: run.error?.message ?? null, stdout: run.stdout ?? "", stderr: run.stderr ?? "" };
}
export const GENERATOR = "scripts/contract-generate.mjs";
export const DESIGN_DIR = "docs/design/gplus-2026-10";
export const CONTRACT_DIR = `${DESIGN_DIR}/contract`;
export const TOOLS = Object.freeze([`${DESIGN_DIR}/tools/data.mjs`, `${DESIGN_DIR}/tools/lib.mjs`]);
export const LOGO_DIR = `${DESIGN_DIR}/logos2`;
export const BOARD_DIR = `${DESIGN_DIR}/boards`;
export const BOARD_FILES = Object.freeze({
  typography: "V2-B1-Typography.dc.html",
  icon: "V2-B1-Icon.dc.html",
  brand: "V2-B1-Brand.dc.html",
  actions: "V2-B1-Actions.dc.html",
  inputs: "V2-B1-Inputs.dc.html"
});
// The shell board is the 07a board of the visual standard (TCRN-DS-SUB-136); its matrix is section B.
export const SHELL_BOARD = "docs/design/visual-standard/boards/Shell.dc.html";
export const EXPECTED_CELLS = Object.freeze({ typography: 44, icon: 28, brand: 10, actions: 116, inputs: 42, shell: 66 });
// Shell cells whose 07a name is a data-cell of section A (26 of the 33 rows, light and night); the
// other seven rows (the colour mark, the focus ring, the bell on hover, the panel against the canvas,
// the sub-item arrow, the Sheet row and the paper under the scrim) are section B only.
export const EXPECTED_SHELL_NAMED = 52;
export const EXPECTED_ICON_COUNT = 38;
export const EXPECTED_MARK_FILES = 8;
export const MATRIX_DATA = "apps/storybook/src/contract-stories/gplus/generated/matrices.generated.ts";
export const CONSUMPTION_CONTRACT = "apps/storybook/src/build/ai-consumption-contract.ts";
export const GENERATED_DIRS = Object.freeze(["packages/ui-react/src/styles/generated", "apps/storybook/src/contract-stories/gplus/generated"]);
export const DIST_ENTRY = "packages/ui-react/dist/index.js";
export const HEADER_MARK = "勿手改";
export const CHECK_IDS = Object.freeze(["generated-sources", "generated-state-rules", "package-css", "icon-roster", "product-marks", "matrix-expect"]);

const MAX_LISTED = 25;
const posix = (path) => path.split(sep).join("/");
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const short = (hex) => String(hex).slice(0, 12);
const message = (error) => (error instanceof Error ? error.message : String(error));

// ---------------------------------------------------------------------------------------------
// Generated files

/** sha256 over the named contract files, the generator's way: name, newline, bytes, newline per file. */
export function contractSha256(root, files) {
  const hash = createHash("sha256");
  for (const file of files) {
    hash.update(`${file}\n`);
    hash.update(readFileSync(join(root, CONTRACT_DIR, file)));
    hash.update("\n");
  }
  return hash.digest("hex");
}

/** { files, sha256 } of a generated file's header, or null when the 勿手改 header is missing. */
export function generatedHeader(text) {
  const lines = String(text).split("\n", 3);
  if (!lines[0]?.startsWith("// ") || !lines[0].includes(HEADER_MARK)) return null;
  const files = /^\/\/ contract files: (.+)$/u.exec(lines[1] ?? "");
  const hash = /^\/\/ contract-sha256: ([0-9a-f]{64})$/u.exec(lines[2] ?? "");
  if (!files || !hash) return null;
  return { files: files[1].split(",").map((name) => name.trim()).filter(Boolean), sha256: hash[1] };
}

/** CSS template segments of a generated module, in file order: [{ name, css }]. */
export function cssSegments(text) {
  return [...String(text).matchAll(/export const (\w+) = `\n([\s\S]*?)\n`;/gu)].map((match) => ({ name: match[1], css: match[2] }));
}

/** The parts of a segment that only joins the other segments of its module (newline separated, in order), or null. */
export function compositeParts(segment, segments) {
  const others = segments.filter((other) => other !== segment);
  return others.length > 1 && others.map((other) => other.css).join("\n") === segment.css ? others : null;
}

function firstDifferentLine(a, b) {
  const x = String(a).split("\n");
  const y = String(b).split("\n");
  for (let i = 0; i < Math.max(x.length, y.length); i += 1) if (x[i] !== y[i]) return i + 1;
  return 0;
}

function firstDifferentByte(a, b) {
  const length = Math.min(a.length, b.length);
  for (let i = 0; i < length; i += 1) if (a[i] !== b[i]) return i;
  return length;
}

function listFiles(root, relDir) {
  const found = [];
  const walk = (rel) => {
    const abs = join(root, rel);
    if (!existsSync(abs)) return;
    for (const entry of readdirSync(abs, { withFileTypes: true })) {
      if (entry.name.startsWith(".")) continue;
      const child = `${rel}/${entry.name}`;
      if (entry.isDirectory()) walk(child);
      else found.push(child);
    }
  };
  walk(relDir);
  return found.sort();
}

// ---------------------------------------------------------------------------------------------
// State rules

/** :pseudo-class and [attribute=value] atoms of a compound, including those inside :where() :is() :not(). */
export function compoundAtoms(text) {
  const atoms = new Set();
  const visit = (compoundText) => {
    const parsed = parseCompound(compoundText);
    for (const attribute of parsed.attributes) atoms.add(attribute.value === null ? `[${attribute.name}]` : `[${attribute.name}=${attribute.value}]`);
    for (const pseudo of parsed.pseudoClasses) {
      if (pseudo.arg !== null && /^(?:where|is|not|matches|any)$/u.test(pseudo.name)) {
        for (const inner of selectorList(pseudo.arg)) for (const part of compounds(inner)) visit(part.text);
      } else {
        atoms.add(`:${pseudo.name}`);
      }
    }
  };
  visit(text);
  return atoms;
}

/** Every atom of every pairs.json state condition (the `when` lists). */
export function pairStateAtoms(pairs) {
  const atoms = new Set();
  for (const table of Object.values(pairs.tables)) {
    for (const state of table.states) for (const when of state.when ?? []) for (const atom of compoundAtoms(when)) atoms.add(atom);
  }
  return atoms;
}

/** Class names of the pairs.json target bases (.tcrn-button, .tcrn-input, ...). */
export function pairBaseClasses(pairs) {
  const classes = new Set();
  for (const table of Object.values(pairs.tables)) {
    for (const target of table.targets) for (const part of compounds(target.base)) for (const name of parseCompound(part.text).classes) classes.add(name);
  }
  return classes;
}

/** True when a compound of the selector (one carrying a base class, when bases are given) has a state atom. */
export function isStateSelector(selector, stateAtoms, baseClasses = null) {
  for (const part of compounds(selector)) {
    if (baseClasses && !parseCompound(part.text).classes.some((name) => baseClasses.has(name))) continue;
    for (const atom of compoundAtoms(part.text)) if (stateAtoms.has(atom)) return true;
  }
  return false;
}

/**
 * True when the selector makes a state rule of the whole sheet: one of its compounds has a state condition as
 * docs/contract/clauses.md C2 defines it (contract-static's selectorFacts().hasState: :hover :active :focus
 * :focus-visible :focus-within :disabled :checked :indeterminate :invalid :user-invalid :read-only, the state ARIA
 * attributes, data-tcrn-preview-state, readonly, disabled; inside :where() and :is() too, not inside :not() or :has()),
 * or a pairs.json state condition read as isStateSelector reads it (inside :not() too), so every rule the check read
 * before TCRN-DS-SUB-053 is still read.
 */
export function isSheetStateSelector(selector, stateAtoms) {
  return selectorFacts(selector).hasState || isStateSelector(selector, stateAtoms);
}

/** Colour literals of a state-rule declaration, less contract-static C2's allowance (an outline whose only colour is transparent). */
export function stateRuleLiterals({ prop, value }) {
  const literals = colourLiterals(value);
  if ((prop === "outline" || prop === "outline-color") && literals.length > 0 && literals.every((word) => word.toLowerCase() === "transparent")) return [];
  return literals;
}

// ---------------------------------------------------------------------------------------------
// Product marks

/** The build-logos2 file form of a mark SVG. */
export function markFileText(viewBox, name, body) {
  const [, , width, height] = String(viewBox).trim().split(/\s+/u);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${width}" height="${height}" role="img" aria-label="${name}">${body}</svg>\n`;
}

/** The eight files generated from marks.json: [{ productId, variant, path, text }]. */
export function expectedMarkFiles(data) {
  const ink = (colour) => ({ deep: colour, bright: colour, c3: colour, c4: colour });
  return data.marks.marks.flatMap((mark) => [
    { productId: mark.productId, variant: "color", path: `${LOGO_DIR}/${mark.id}.svg`, text: markFileText(data.marks.viewBox, mark.name, data.markBody(mark, mark.palette)) },
    { productId: mark.productId, variant: "mono", path: `${LOGO_DIR}/${mark.id}-mono.svg`, text: markFileText(data.marks.viewBox, mark.name, data.markBody(mark, ink(data.marks.monoInk))) }
  ]);
}

/** productMarkSources.files of the consumption contract source: [{ productId, variant, path, bytes, sha256 }], or null. */
export function registeredMarkSources(text) {
  const source = String(text);
  const start = source.indexOf("productMarkSources:");
  if (start === -1) return null;
  const filesAt = source.indexOf("files:", start);
  const open = filesAt === -1 ? -1 : source.indexOf("[", filesAt);
  const close = open === -1 ? -1 : source.indexOf("]", open);
  if (close === -1) return null;
  return [...source.slice(open + 1, close).matchAll(/\{([^{}]*)\}/gu)].map((entry) => {
    const field = (key) => {
      const match = new RegExp(`\\b${key}:\\s*(?:"([^"]*)"|(\\d+))`, "u").exec(entry[1]);
      if (!match) return undefined;
      return match[1] ?? Number(match[2]);
    };
    return { productId: field("productId"), variant: field("variant"), path: field("path"), bytes: field("bytes"), sha256: field("sha256") };
  });
}

// ---------------------------------------------------------------------------------------------
// Matrices

/** data-cell elements of a board: [{ cellId, kind, expect, exempt }]. */
export function boardCells(html) {
  const cells = [];
  for (const match of String(html).matchAll(/<[a-zA-Z][^<>]*?\sdata-cell="([^"]*)"[^<>]*>/gu)) {
    const tag = match[0];
    const attribute = (name) => new RegExp(`\\s${name}="([^"]*)"`, "u").exec(tag)?.[1] ?? null;
    cells.push({ cellId: match[1], kind: attribute("data-kind"), expect: attribute("data-expect"), exempt: /\sdata-exempt(?=[\s/>=])/u.test(tag) });
  }
  return cells;
}

/**
 * The shell board's matrix and names: rows of section B ([{ label, cells: [{ expect, exempt }] }],
 * light then night in each row, from data-cr and the ex mark) and the data-cell elements of the
 * part before section B (section A's screens), or null when the board has no section B.
 */
export function shellBoardMatrix(html) {
  const text = String(html);
  const start = text.indexOf('<div class="sec"><h3><b>B</b>');
  if (start < 0) return null;
  const next = text.indexOf('<div class="sec">', start + 1);
  const section = text.slice(start, next < 0 ? text.length : next);
  const rows = [];
  for (const row of section.matchAll(/<tr>([\s\S]*?)<\/tr>/gu)) {
    const label = /<td class="c">([^<]*)<\/td>/u.exec(row[1])?.[1];
    if (label === undefined) continue;
    const cells = Array.from(row[1].matchAll(/<td class="n((?: [a-z]+)*) ?" data-cr="([^"]*)"/gu), (cell) => ({ expect: cell[2], exempt: /\bex\b/u.test(cell[1]) }));
    rows.push({ label, cells });
  }
  return { rows, named: boardCells(text.slice(0, start)) };
}

/** gplusMatrices and gplusMatrixCellCounts of the generated matrix module, or null. */
export function generatedMatrixData(text) {
  const matrices = /export const gplusMatrices\b[^=]*=\s*(\{[\s\S]*?\n\});/u.exec(String(text));
  const counts = /export const gplusMatrixCellCounts\b[^=]*=\s*(\{[^}]*\});/u.exec(String(text));
  if (!matrices || !counts) return null;
  return { matrices: JSON.parse(matrices[1]), counts: JSON.parse(counts[1]) };
}

const duplicatesOf = (values) => [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];

// ---------------------------------------------------------------------------------------------
// Checks

function checkGeneratedSources({ root, generated, loadError }) {
  if (!generated) return { summary: "not run: the generator or the contract does not load", failures: [loadError] };
  const failures = [];
  for (const [rel, content] of generated) {
    const abs = join(root, rel);
    if (!existsSync(abs)) {
      failures.push(`${rel}: missing; run node ${GENERATOR}`);
      continue;
    }
    const current = readFileSync(abs, "utf8");
    const header = generatedHeader(current);
    const wanted = generatedHeader(content);
    if (!header) {
      failures.push(`${rel}: no ${HEADER_MARK} header with contract files and contract-sha256`);
    } else if (wanted && header.files.join(",") !== wanted.files.join(",")) {
      failures.push(`${rel}: the header names ${header.files.join(", ")}; the generator builds it from ${wanted.files.join(", ")}`);
    } else {
      let now;
      try {
        now = contractSha256(root, header.files);
      } catch (error) {
        failures.push(`${rel}: the contract files of the header cannot be read: ${message(error)}`);
      }
      if (now && now !== header.sha256) {
        failures.push(`${rel}: contract-sha256 ${short(header.sha256)} in the header, but ${header.files.join(", ")} now hash to ${short(now)}: the contract changed after generation; run node ${GENERATOR}`);
      }
    }
    if (current !== content) failures.push(`${rel}: differs from a fresh generate() from line ${firstDifferentLine(current, content)}; generated files are written by node ${GENERATOR} only`);
  }
  for (const dir of GENERATED_DIRS) {
    for (const rel of listFiles(root, dir)) if (!generated.has(rel)) failures.push(`${rel}: sits in a generated directory but the generator does not write it`);
  }
  return {
    summary: failures.length === 0 ? `${generated.size} generated files carry the contract-sha256 of their contract files and equal a fresh generate()` : `${failures.length} problem(s) in the generated files`,
    failures
  };
}

function checkGeneratedStateRules({ root, generated, data, loadError }) {
  if (!generated || !data) return { summary: "not run: the generator or the contract does not load", failures: [loadError] };
  const failures = [];
  const stateAtoms = pairStateAtoms(data.pairs);
  const wantedPairRules = Object.values(data.pairs.tables).reduce((sum, table) => sum + table.ruleOrder.length, 0);
  let pairRules = 0;
  let otherRules = 0;
  const scan = (rel, content, source, count) => {
    const segments = cssSegments(content);
    const pairModule = /\.pairs\.ts$/u.test(rel);
    for (const segment of segments) {
      if (compositeParts(segment, segments)) continue;
      const where = `${rel}#${segment.name}${source}`;
      const parsed = parseCss(segment.css, { source: where });
      if (parsed.errors.length > 0) failures.push(`${where}: the CSS does not parse (${parsed.errors.length} unbalanced block(s))`);
      for (const rule of parsed.rules) {
        if (rule.kind !== "style" || !rule.selectors.some((selector) => isStateSelector(selector, stateAtoms))) continue;
        if (count) {
          if (pairModule) pairRules += 1;
          else otherRules += 1;
        }
        for (const declaration of rule.declarations) {
          const literals = colourLiterals(declaration.value);
          if (literals.length > 0) failures.push(`${where}: state rule ${rule.selectorText} carries the colour literal ${literals.join(", ")} (${declaration.prop}: ${declaration.value})`);
          if (pairModule && !declaration.prop.startsWith("--tcrn-pair-")) failures.push(`${where}: state rule ${rule.selectorText} writes ${declaration.prop}; a pair state rule only switches --tcrn-pair-*`);
        }
      }
    }
  };
  for (const [rel, content] of generated) {
    scan(rel, content, "", true);
    const abs = join(root, rel);
    if (existsSync(abs)) {
      const onDisk = readFileSync(abs, "utf8");
      if (onDisk !== content) scan(rel, onDisk, " (file on disk)", false);
    }
  }
  if (pairRules !== wantedPairRules) failures.push(`the generated pair segments hold ${pairRules} state rules; the ruleOrder lists of pairs.json hold ${wantedPairRules}`);
  return {
    summary: failures.length === 0 ? `${pairRules} generated pair state rules only switch --tcrn-pair-* and, with ${otherRules} other generated state rule(s), carry no colour literal` : `${failures.length} problem(s) in the generated state rules`,
    failures
  };
}

function checkPackageCss({ generated, data, ui, uiError, loadError }) {
  if (!generated || !data) return { summary: "not run: the generator or the contract does not load", failures: [loadError] };
  if (!ui) return { summary: "not run: the dist does not load", failures: [uiError] };
  const css = ui.tcrnComponentCss;
  if (typeof css !== "string" || css.length === 0) return { summary: "the dist exports no tcrnComponentCss string", failures: ["tcrnComponentCss is missing from packages/ui-react/dist/index.js"] };
  const failures = [];
  const notes = [];
  const needed = new Map();
  for (const [rel, content] of generated) {
    const segments = cssSegments(content);
    for (const segment of segments) for (const part of compositeParts(segment, segments) ?? [segment]) needed.set(`${rel}#${part.name}`, part.css);
  }
  for (const [name, segmentCss] of needed) {
    if (!css.includes(segmentCss)) failures.push(`tcrnComponentCss lacks ${name} verbatim: the dist predates the generated files or the family does not import the segment; build after node ${GENERATOR}`);
  }
  const parsed = parseCss(css, { source: "tcrnComponentCss" });
  const stateAtoms = pairStateAtoms(data.pairs);
  const bases = pairBaseClasses(data.pairs);
  let stateRules = 0;
  let baseRules = 0;
  let allowed = 0;
  for (const rule of parsed.rules) {
    if (rule.kind !== "style" || !rule.selectors.some((selector) => isSheetStateSelector(selector, stateAtoms))) continue;
    stateRules += 1;
    if (rule.selectors.some((selector) => isStateSelector(selector, stateAtoms, bases))) baseRules += 1;
    for (const declaration of rule.declarations) {
      const literals = stateRuleLiterals(declaration);
      if (literals.length > 0) failures.push(`tcrnComponentCss: state rule ${rule.selectorText} carries the colour literal ${literals.join(", ")} (${declaration.prop}: ${declaration.value})`);
      else if (colourLiterals(declaration.value).length > 0) allowed += 1;
    }
  }
  if (allowed > 0) notes.push(`${allowed} outline declaration(s) whose only colour is transparent (the forced-colours focus ring) are allowed, as contract-static C2 allows them`);
  return {
    summary:
      failures.length === 0
        ? `tcrnComponentCss holds the ${needed.size} generated segments verbatim; its ${stateRules} state rules (${baseRules} of them on the pairs.json target bases) carry no colour literal`
        : `${failures.length} problem(s) in tcrnComponentCss (${stateRules} state rules read, ${baseRules} of them on the pairs.json target bases)`,
    failures,
    notes
  };
}

function checkIconRoster({ root, ui, uiError }) {
  const failures = [];
  const icons = JSON.parse(readFileSync(join(root, CONTRACT_DIR, "icons.json"), "utf8"));
  const names = (icons.icons ?? []).map((icon) => icon.name);
  if (names.length !== EXPECTED_ICON_COUNT) failures.push(`icons.json lists ${names.length} icons; the roster has ${EXPECTED_ICON_COUNT}`);
  for (const name of duplicatesOf(names)) failures.push(`icons.json lists ${name} more than once`);
  if (!ui) {
    failures.push(uiError);
  } else if (!Array.isArray(ui.tcrnIconNames)) {
    failures.push("the dist exports no tcrnIconNames array");
  } else {
    const shipped = [...ui.tcrnIconNames];
    for (const name of duplicatesOf(shipped)) failures.push(`tcrnIconNames lists ${name} more than once`);
    const contract = new Set(names);
    const dist = new Set(shipped);
    const onlyContract = [...contract].filter((name) => !dist.has(name));
    const onlyDist = [...dist].filter((name) => !contract.has(name));
    if (onlyContract.length > 0) failures.push(`only in icons.json: ${onlyContract.join(", ")}`);
    if (onlyDist.length > 0) failures.push(`only in tcrnIconNames: ${onlyDist.join(", ")}`);
  }
  return { summary: failures.length === 0 ? `icons.json and tcrnIconNames are the same ${names.length} names` : `${failures.length} problem(s) in the icon roster`, failures };
}

function checkProductMarks({ root, data, ui, uiError, loadError }) {
  if (!data) return { summary: "not run: the contract does not load", failures: [loadError] };
  const failures = [];
  const expected = expectedMarkFiles(data);
  if (expected.length !== EXPECTED_MARK_FILES) failures.push(`marks.json generates ${expected.length} SVG files; logos2 holds ${EXPECTED_MARK_FILES}`);
  const wantedPaths = new Set(expected.map((file) => file.path));
  for (const rel of listFiles(root, LOGO_DIR)) if (rel.endsWith(".svg") && !wantedPaths.has(rel)) failures.push(`${rel}: an SVG in logos2 that marks.json does not generate`);
  for (const file of expected) {
    const abs = join(root, file.path);
    if (!existsSync(abs)) {
      failures.push(`${file.path}: missing`);
      continue;
    }
    const bytes = readFileSync(abs);
    const want = Buffer.from(file.text, "utf8");
    if (!bytes.equals(want)) failures.push(`${file.path}: differs from the SVG generated from marks.json at byte ${firstDifferentByte(bytes, want)} (${bytes.length} bytes on disk, ${want.length} generated)`);
  }
  if (!ui) {
    failures.push(uiError);
  } else if (typeof ui.tcrnProductMarkSvg !== "function") {
    failures.push("the dist exports no tcrnProductMarkSvg");
  } else {
    for (const file of expected) {
      let svg;
      try {
        svg = ui.tcrnProductMarkSvg(file.productId, file.variant, file.variant === "mono" ? { ink: data.marks.monoInk } : {});
      } catch (error) {
        failures.push(`tcrnProductMarkSvg(${file.productId}, ${file.variant}) throws: ${message(error)}`);
        continue;
      }
      if (svg !== file.text) failures.push(`tcrnProductMarkSvg(${file.productId}, ${file.variant}) differs from ${file.path} at byte ${firstDifferentByte(Buffer.from(String(svg)), Buffer.from(file.text))}`);
    }
  }
  const contractPath = join(root, CONSUMPTION_CONTRACT);
  const registered = existsSync(contractPath) ? registeredMarkSources(readFileSync(contractPath, "utf8")) : null;
  if (!registered) {
    failures.push(`${CONSUMPTION_CONTRACT}: no productMarkSources.files registration`);
  } else {
    if (registered.length !== expected.length) failures.push(`productMarkSources registers ${registered.length} files; marks.json generates ${expected.length}`);
    for (const file of expected) {
      const entry = registered.find((candidate) => candidate.path === file.path);
      const want = Buffer.from(file.text, "utf8");
      if (!entry) failures.push(`productMarkSources does not register ${file.path}`);
      else if (entry.productId !== file.productId || entry.variant !== file.variant || entry.bytes !== want.length || entry.sha256 !== sha256(want)) {
        failures.push(`productMarkSources registers ${file.path} as ${entry.productId}/${entry.variant}, ${entry.bytes} bytes, sha256 ${short(entry.sha256)}; marks.json generates ${file.productId}/${file.variant}, ${want.length} bytes, sha256 ${short(sha256(want))}`);
      }
    }
    for (const entry of registered) if (!wantedPaths.has(entry.path)) failures.push(`productMarkSources registers ${entry.path}, which marks.json does not generate`);
  }
  return {
    summary: failures.length === 0 ? `the ${expected.length} SVG files generated from marks.json equal logos2, tcrnProductMarkSvg and the productMarkSources digests byte for byte` : `${failures.length} problem(s) in the product marks`,
    failures
  };
}

// The shell board (07a): section B's rows against the contract by position, light cells then night
// cells in row order; the 07a names against section A's data-cell elements. Pushes into failures and
// returns the cell count read from section B, the largest difference and how many cells section A names.
function checkShellMatrix({ root, data, lib, generatedData, wanted, contractCells, dataCells, failures }) {
  const result = { cells: 0, largest: 0, named: 0 };
  if (contractCells.length !== wanted) failures.push(`shell: matrices.json has ${contractCells.length} cells; the board has ${wanted}`);
  if (generatedData && dataCells.length !== wanted) failures.push(`shell: the generated matrix data has ${dataCells.length} cells; the board has ${wanted}`);
  if (generatedData && generatedData.counts.shell !== wanted) failures.push(`shell: gplusMatrixCellCounts says ${generatedData.counts.shell}; the board has ${wanted}`);
  for (const id of duplicatesOf(dataCells.map((cell) => cell.cellId))) failures.push(`shell/${id}: more than one cell in the generated matrix data`);
  const contractIds = new Set(contractCells.map((cell) => cell.cellId));
  if (generatedData) for (const cell of dataCells) if (!contractIds.has(cell.cellId)) failures.push(`shell/${cell.cellId}: a generated matrix cell with no matrices.json cell`);
  const boardPath = join(root, SHELL_BOARD);
  if (!existsSync(boardPath)) {
    failures.push(`${SHELL_BOARD}: missing`);
    return result;
  }
  const board = shellBoardMatrix(readFileSync(boardPath, "utf8"));
  if (!board) {
    failures.push(`${SHELL_BOARD}: no section B`);
    return result;
  }
  result.cells = board.rows.reduce((sum, row) => sum + row.cells.length, 0);
  if (result.cells !== wanted) failures.push(`shell: section B of ${SHELL_BOARD} has ${result.cells} cells; the board has ${wanted}`);
  for (const row of board.rows) if (row.cells.length !== 2) failures.push(`shell: section B row ${JSON.stringify(row.label)} has ${row.cells.length} contrast cells, not a light and a night one`);
  const themed = { light: contractCells.filter((cell) => cell.theme === "light"), night: contractCells.filter((cell) => cell.theme === "night") };
  if (themed.light.length !== board.rows.length || themed.night.length !== board.rows.length) failures.push(`shell: matrices.json has ${themed.light.length} light and ${themed.night.length} night cells; section B has ${board.rows.length} rows`);
  const dataMap = new Map(dataCells.map((cell) => [cell.cellId, cell]));
  board.rows.forEach((row, index) => {
    if (themed.light[index] && themed.night[index] && themed.light[index].id !== themed.night[index].id) failures.push(`shell: row ${index + 1} is ${themed.light[index].id} in the light cells and ${themed.night[index].id} in the night cells`);
    ["light", "night"].forEach((theme, column) => {
      const cell = themed[theme][index];
      const boardCell = row.cells[column];
      if (!cell || !boardCell) return;
      const resolved = data.matrixCell("shell", cell.cellId);
      const expect = lib.fmt(lib.cr(resolved.inkValue, resolved.fillValue, resolved.surfaceValue));
      const generatedCell = dataMap.get(cell.cellId);
      if (generatedData && !generatedCell) failures.push(`shell/${cell.cellId}: missing from the generated matrix data`);
      if (generatedCell) {
        if (generatedCell.expect !== expect) failures.push(`shell/${cell.cellId}: the generated expect is ${generatedCell.expect}; the contract gives ${expect}`);
        if (generatedCell.kind !== resolved.kind || generatedCell.exempt !== resolved.exempt) failures.push(`shell/${cell.cellId}: the generated cell is ${generatedCell.kind}${generatedCell.exempt ? " exempt" : ""}; matrices.json says ${resolved.kind}${resolved.exempt ? " exempt" : ""}`);
      }
      const where = `section B row ${index + 1} (${row.label}) ${theme}`;
      if (!/^\d+\.\d{2}$/u.test(boardCell.expect)) {
        failures.push(`shell/${cell.cellId}: ${where} data-cr ${JSON.stringify(boardCell.expect)} is not a two-decimal number`);
      } else {
        const difference = Math.abs(Math.round(Number(boardCell.expect) * 100) - Math.round(Number(expect) * 100)) / 100;
        result.largest = Math.max(result.largest, difference);
        if (boardCell.expect !== expect) failures.push(`shell/${cell.cellId}: ${where} data-cr ${boardCell.expect}, ${expect} from the contract (difference ${difference.toFixed(2)})`);
      }
      if (boardCell.exempt !== resolved.exempt) failures.push(`shell/${cell.cellId}: ${where} is ${boardCell.exempt ? "marked ex" : "not marked ex"}; matrices.json says ${resolved.exempt ? "exempt" : "not exempt"}`);
      const name = `${cell.id}-${theme === "light" ? "l" : "n"}`;
      const onBoard = board.named.filter((element) => element.cellId === name);
      if (onBoard.length === 0) return;
      result.named += 1;
      if (!onBoard.some((element) => element.expect === expect && element.kind === resolved.kind && element.exempt === resolved.exempt)) {
        failures.push(`shell/${cell.cellId}: section A names ${name} with ${[...new Set(onBoard.map((element) => `${element.expect} ${element.kind}${element.exempt ? " exempt" : ""}`))].join(", ")}; the contract gives ${expect} ${resolved.kind}${resolved.exempt ? " exempt" : ""}`);
      }
    });
  });
  if (result.named !== EXPECTED_SHELL_NAMED) failures.push(`shell: ${result.named} cells carry a name section A uses; ${EXPECTED_SHELL_NAMED} do on the board`);
  return result;
}

function checkMatrices({ root, data, lib, loadError }) {
  if (!data || !lib) return { summary: "not run: the contract does not load", failures: [loadError] };
  const failures = [];
  const boards = Object.keys(EXPECTED_CELLS);
  const contractBoards = Object.keys(data.matrices.boards);
  if (contractBoards.join(",") !== boards.join(",")) failures.push(`matrices.json boards are ${contractBoards.join(", ")}; the six boards are ${boards.join(", ")}`);
  const dataPath = join(root, MATRIX_DATA);
  const generatedData = existsSync(dataPath) ? generatedMatrixData(readFileSync(dataPath, "utf8")) : null;
  if (!generatedData) failures.push(`${MATRIX_DATA}: missing, or no gplusMatrices and gplusMatrixCellCounts`);
  let total = 0;
  let largest = 0;
  let shellNamed = 0;
  for (const board of boards) {
    const wanted = EXPECTED_CELLS[board];
    const contractCells = data.matrices.boards[board]?.cells ?? [];
    const dataCells = generatedData?.matrices[board] ?? [];
    if (board === "shell") {
      const shell = checkShellMatrix({ root, data, lib, generatedData, wanted, contractCells, dataCells, failures });
      total += shell.cells;
      largest = Math.max(largest, shell.largest);
      shellNamed = shell.named;
      continue;
    }
    const boardPath = join(root, BOARD_DIR, BOARD_FILES[board]);
    if (!existsSync(boardPath)) {
      failures.push(`${BOARD_DIR}/${BOARD_FILES[board]}: missing`);
      continue;
    }
    const onBoard = boardCells(readFileSync(boardPath, "utf8"));
    total += onBoard.length;
    if (contractCells.length !== wanted) failures.push(`${board}: matrices.json has ${contractCells.length} cells; the board has ${wanted}`);
    if (generatedData && dataCells.length !== wanted) failures.push(`${board}: the generated matrix data has ${dataCells.length} cells; the board has ${wanted}`);
    if (generatedData && generatedData.counts[board] !== wanted) failures.push(`${board}: gplusMatrixCellCounts says ${generatedData.counts[board]}; the board has ${wanted}`);
    if (onBoard.length !== wanted) failures.push(`${board}: ${BOARD_FILES[board]} has ${onBoard.length} data-cell elements; the board has ${wanted}`);
    for (const id of duplicatesOf(onBoard.map((cell) => cell.cellId))) failures.push(`${board}/${id}: more than one data-cell element`);
    for (const id of duplicatesOf(dataCells.map((cell) => cell.cellId))) failures.push(`${board}/${id}: more than one cell in the generated matrix data`);
    const boardMap = new Map(onBoard.map((cell) => [cell.cellId, cell]));
    const dataMap = new Map(dataCells.map((cell) => [cell.cellId, cell]));
    const contractIds = new Set(contractCells.map((cell) => cell.cellId));
    for (const id of boardMap.keys()) if (!contractIds.has(id)) failures.push(`${board}/${id}: a data-cell element with no matrices.json cell`);
    if (generatedData) for (const id of dataMap.keys()) if (!contractIds.has(id)) failures.push(`${board}/${id}: a generated matrix cell with no matrices.json cell`);
    for (const cell of contractCells) {
      const resolved = data.matrixCell(board, cell.cellId);
      const expect = lib.fmt(lib.cr(resolved.inkValue, resolved.fillValue, resolved.surfaceValue));
      const generatedCell = dataMap.get(cell.cellId);
      const boardCell = boardMap.get(cell.cellId);
      if (generatedData && !generatedCell) failures.push(`${board}/${cell.cellId}: missing from the generated matrix data`);
      if (generatedCell) {
        if (generatedCell.expect !== expect) failures.push(`${board}/${cell.cellId}: the generated expect is ${generatedCell.expect}; the contract gives ${expect}`);
        if (generatedCell.kind !== resolved.kind || generatedCell.exempt !== resolved.exempt) failures.push(`${board}/${cell.cellId}: the generated cell is ${generatedCell.kind}${generatedCell.exempt ? " exempt" : ""}; matrices.json says ${resolved.kind}${resolved.exempt ? " exempt" : ""}`);
      }
      if (!boardCell) {
        failures.push(`${board}/${cell.cellId}: no data-cell element on ${BOARD_FILES[board]}`);
        continue;
      }
      if (!/^\d+\.\d{2}$/u.test(boardCell.expect ?? "")) {
        failures.push(`${board}/${cell.cellId}: data-expect ${JSON.stringify(boardCell.expect)} is not a two-decimal number`);
      } else {
        const difference = Math.abs(Math.round(Number(boardCell.expect) * 100) - Math.round(Number(expect) * 100)) / 100;
        largest = Math.max(largest, difference);
        if (boardCell.expect !== expect) failures.push(`${board}/${cell.cellId}: data-expect ${boardCell.expect} on the board, ${expect} from the contract (difference ${difference.toFixed(2)})`);
      }
      if (boardCell.kind !== resolved.kind) failures.push(`${board}/${cell.cellId}: data-kind ${boardCell.kind} on the board; matrices.json says ${resolved.kind}`);
      if (boardCell.exempt !== resolved.exempt) failures.push(`${board}/${cell.cellId}: data-exempt is ${boardCell.exempt ? "set" : "absent"} on the board; matrices.json says ${resolved.exempt ? "exempt" : "not exempt"}`);
    }
  }
  const counts = boards.map((board) => EXPECTED_CELLS[board]).join("/");
  return {
    summary:
      failures.length === 0
        ? `${boards.length} boards, ${total} cells (${counts}): every expect equals the generated data and the board data-expect at two decimals, the shell board through section B and ${shellNamed} 07a names (largest difference ${largest.toFixed(2)})`
        : `${failures.length} problem(s) in the matrix expectations (largest difference ${largest.toFixed(2)})`,
    failures
  };
}

// ---------------------------------------------------------------------------------------------
// Run

async function loadContract(root) {
  const load = (rel) => import(pathToFileURL(join(root, rel)).href);
  try {
    const generator = await load(GENERATOR);
    const data = await load(TOOLS[0]);
    const lib = await load(TOOLS[1]);
    let generated = null;
    let loadError = null;
    try {
      generated = generator.generate();
    } catch (error) {
      loadError = `generate() throws: ${message(error)}`;
    }
    return { data, lib, generated, loadError };
  } catch (error) {
    return { data: null, lib: null, generated: null, loadError: `the contract does not load: ${message(error)}` };
  }
}

async function loadUi(root, distEntry, ui) {
  if (ui) return { ui, uiError: null };
  const entry = resolve(distEntry ?? join(root, DIST_ENTRY));
  const shown = posix(relative(root, entry)) || entry;
  if (!existsSync(entry)) return { ui: null, uiError: `${shown} is missing; build @tcrn/ui-react first` };
  try {
    return { ui: await import(pathToFileURL(entry).href), uiError: null };
  } catch (error) {
    return { ui: null, uiError: `${shown} does not load: ${message(error)}` };
  }
}

/** Run every check. Options: root (the repository), distEntry (the built package entry), ui (exports to use instead of the dist). */
export async function runContractProof({ root = ROOT, distEntry, ui } = {}) {
  const base = resolve(root);
  const context = { root: base, ...(await loadContract(base)), ...(await loadUi(base, distEntry, ui)) };
  const runners = {
    "generated-sources": checkGeneratedSources,
    "generated-state-rules": checkGeneratedStateRules,
    "package-css": checkPackageCss,
    "icon-roster": checkIconRoster,
    "product-marks": checkProductMarks,
    "matrix-expect": checkMatrices
  };
  const checks = CHECK_IDS.map((id) => {
    try {
      const { summary, failures, notes = [] } = runners[id](context);
      return { id, ok: failures.length === 0, summary, failures, notes };
    } catch (error) {
      return { id, ok: false, summary: "the check could not run", failures: [message(error)], notes: [] };
    }
  });
  return { schema: SCHEMA_VERSION, ok: checks.every((check) => check.ok), checks };
}

export function formatResult(result) {
  const green = result.checks.filter((check) => check.ok).length;
  const lines = [`contract-proof: ${result.ok ? "PASS" : "FAIL"} (${green}/${result.checks.length} checks green)`];
  for (const check of result.checks) {
    lines.push(`  [${check.ok ? "PASS" : "FAIL"}] ${check.id}: ${check.summary}`);
    for (const failure of check.failures.slice(0, MAX_LISTED)) lines.push(`      - ${failure}`);
    if (check.failures.length > MAX_LISTED) lines.push(`      - ... ${check.failures.length - MAX_LISTED} more`);
    for (const note of check.notes) lines.push(`      note: ${note}`);
  }
  return lines.join("\n");
}

function invokedDirectly() {
  try {
    return Boolean(process.argv[1]) && realpathSync(resolve(process.argv[1])) === realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
}

if (invokedDirectly()) {
  const rootAt = process.argv.indexOf("--root");
  const result = await runContractProof({ root: rootAt > 0 ? resolve(process.argv[rootAt + 1]) : ROOT });
  console.log(process.argv.includes("--json") ? JSON.stringify(result, null, 2) : formatResult(result));
  if (!result.ok) process.exitCode = 1;
}
