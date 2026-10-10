// G+ contract loader: the single entry the board generators (build-*.mjs, lib.mjs) and
// scripts/contract-generate.mjs use to read docs/design/gplus-2026-10/contract/*.json.
// No side effects: it only reads the six JSON files and checks them; it writes nothing,
// reads no argv and touches no network.
import fs from "node:fs";

export const CONTRACT_DIR = new URL("../contract/", import.meta.url);
export const CONTRACT_FILES = ["tokens.json", "pairs.json", "matrices.json", "icons.json", "marks.json", "typography.json"];
const read = (name) => JSON.parse(fs.readFileSync(new URL(name, CONTRACT_DIR), "utf8"));

export const tokens = read("tokens.json");
export const pairs = read("pairs.json");
export const matrices = read("matrices.json");
export const icons = read("icons.json");
export const marks = read("marks.json");
export const typography = read("typography.json");

const fail = (msg) => { throw new Error(`gplus contract: ${msg}`); };

// ---------- tokens ----------
/** contract key (kebab, the board variable without "--") -> pre-contract camelCase key */
export const camel = (key) => key.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const THEMED = new Map(tokens.themed.map((t) => [t.key, t]));
const FIXED = new Map(tokens.fixed.map((t) => [t.key, t]));
if (THEMED.size !== tokens.themed.length || FIXED.size !== tokens.fixed.length) fail("duplicate token key");
for (const t of tokens.themed) if (typeof t.light !== "string" || typeof t.night !== "string") fail(`token ${t.key} lacks a light or night value (C5)`);

/** theme objects keyed like the pre-contract lib.mjs T (camelCase, contract order) */
export const T = { light: {}, night: {} };
for (const t of tokens.themed) { T.light[camel(t.key)] = t.light; T.night[camel(t.key)] = t.night; }

export const isToken = (ref) => THEMED.has(ref);
/** value of a token key in a theme ("light" | "night"); anything else is a literal and returned as is */
export const tokenValue = (theme, ref) => (THEMED.has(ref) ? THEMED.get(ref)[theme] : ref);
/** board css for a slot value: token keys become var(--key), literals stay */
export const boardRef = (ref) => (THEMED.has(ref) ? `var(--${ref})` : ref);
/** board variable name -> package css variable name, for themed and fixed tokens */
export const CSS_VAR = Object.fromEntries([...tokens.themed, ...tokens.fixed].map((t) => [`--${t.key}`, t.cssVar]));

/** the three declaration lists of the board .gp / .gp.night blocks */
export function boardTokenBlocks() {
  const block = (theme) => tokens.themed.map((t) => `--${t.key}:${t[theme]}`).join(";");
  return { light: block("light"), night: block("night"), fixed: tokens.fixed.map((f) => `--${f.key}:${f.value}`).join(";") };
}

// ---------- icons ----------
export const ICONS = Object.fromEntries(icons.icons.map((i) => [i.name, i.body]));
export const ICON_NAMES = icons.icons.map((i) => i.name);
export const ICON_NEW = icons.icons.filter((i) => i.new).map((i) => i.name);
if (ICON_NAMES.length !== new Set(ICON_NAMES).size) fail("duplicate icon name");

// ---------- marks ----------
/** fill a mark body template; pal supplies deep / bright / c3 / c4 */
export const markBody = (mark, pal) => mark.body.replace(/\{(deep|bright|c3|c4)\}/g, (_, k) => {
  if (pal[k] === undefined) fail(`mark ${mark.id} needs ${k}`);
  return pal[k];
});
/** palettes keyed by mark id, shaped like the pre-contract build-logos2 PAL */
export const PAL = Object.fromEntries(marks.marks.map((m) => [m.id, { ...m.palette, name: m.toneName }]));
/** marks keyed by mark id, shaped like the pre-contract build-logos2 MARKS (body is a function of a palette) */
export const MARKS = Object.fromEntries(marks.marks.map((m) => [m.id, {
  name: m.name, zh: m.zh, word: m.word, ...(m.suffix ? { suffix: m.suffix } : {}), font: m.font, body: (pal) => markBody(m, pal), says: m.says
}]));
for (const b of tokens.brand) {
  const m = /^marks\.json#([a-z]+)\.palette\.([a-z0-9]+)$/.exec(b.ref || "");
  if (!m || PAL[m[1]]?.[m[2]] !== b.value) fail(`brand token ${b.key} does not match ${b.ref}`);
}

// ---------- pairs ----------
export function pairTable(name) {
  const t = pairs.tables[name];
  if (!t) fail(`pair table ${name}`);
  return t;
}
/** slot values of one state; partial variants (search, radio) fall back to the table's first variant */
export function pairState(tableName, variant, state) {
  const t = pairTable(tableName);
  const v = t.variants[variant];
  if (!v) fail(`pair variant ${tableName}.${variant}`);
  const base = Object.values(t.variants)[0];
  return { ...(base[state] || {}), ...(v[state] || {}) };
}
/**
 * board declarations of one variant: --<board slot>-<state>:<value>, in the table's state order and
 * slot order, only the slots the variant itself declares. states narrows the list; refEdge writes an
 * edge equal to the default edge as var(--edge-d) (the Actions board writes it that way).
 */
export function pairDecls(tableName, variant, { states, refEdge = false } = {}) {
  const t = pairTable(tableName);
  const v = t.variants[variant];
  if (!v) fail(`pair variant ${tableName}.${variant}`);
  const order = t.states.map((s) => s.key).filter((k) => v[k] && (!states || states.includes(k)));
  const out = [];
  for (const st of order) for (const slot of t.slots) {
    const value = v[st][slot];
    if (value === undefined) continue;
    const bs = t.boardSlots[slot];
    if (slot.includes("edge")) out.push(`--${bs}-${st}:${refEdge && st !== "d" && value === v.d[slot] ? `var(--${bs}-d)` : value}`);
    else out.push(`--${bs}-${st}:${boardRef(value)}`);
  }
  return out.join(";");
}

// ---------- matrices ----------
const CELLS = new Map();
for (const [board, b] of Object.entries(matrices.boards)) {
  for (const c of b.cells) {
    const key = `${board}/${c.cellId}`;
    if (CELLS.has(key)) fail(`duplicate cell ${key}`);
    if (!(c.kind in matrices.thresholds)) fail(`cell ${key} kind ${c.kind}`);
    for (const slot of ["fill", "ink", "surface"]) if (!THEMED.has(c[slot]) && !/^(#|rgba?\(|transparent$)/.test(c[slot])) fail(`cell ${key} ${slot} ${c[slot]} is neither a token nor a colour`);
    if (c.pair) {
      const [table, variant, state] = c.pair.split(".");
      const p = pairState(table, variant, state);
      if (p.fill !== c.fill || p.ink !== c.ink) fail(`cell ${key} disagrees with pairs.json ${c.pair}`);
    }
    CELLS.set(key, c);
  }
}
/** one data-cell with its token values resolved for the cell's theme */
export function matrixCell(board, cellId) {
  const c = CELLS.get(`${board}/${cellId}`);
  if (!c) fail(`no cell ${board}/${cellId} in matrices.json`);
  return { ...c, fillValue: tokenValue(c.theme, c.fill), inkValue: tokenValue(c.theme, c.ink), surfaceValue: tokenValue(c.theme, c.surface) };
}
