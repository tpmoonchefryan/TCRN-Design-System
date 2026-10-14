#!/usr/bin/env node
// G+ contract generator: docs/design/gplus-2026-10/contract/*.json -> package and story sources.
//
//   node scripts/contract-generate.mjs           write every generated file
//   node scripts/contract-generate.mjs --check   write nothing; exit 1 when a file is missing or stale
//
// Outputs (each starts with the 勿手改 header and the sha256 of the contract files it was built from):
//   packages/ui-react/src/styles/generated/actions.pairs.ts         Actions state-pair segment
//   packages/ui-react/src/styles/generated/inputs.pairs.ts          Inputs text / check / switch segments
//   packages/ui-react/src/styles/generated/typography.scale.ts      type scale segment
//   packages/ui-react/src/components/Icon/icon-paths.generated.ts   icon roster and 20-grid paths
//   packages/ui-react/src/components/Navigation/product-marks.generated.ts  product mark SVG bodies
//   packages/ui-tokens/src/gplus-tokens.generated.ts                G+ token data (with the type scale tokens)
//   apps/storybook/src/contract-stories/gplus/generated/matrices.generated.ts  per-cell matrix data
//
// Type scale: typography.json "tokens" names each scale step with its package variable and value;
// the scale segment refers to them as var(--tcrn-type-*) wherever an entry names one, after checking
// that the token's value equals the entry's own number (TCRN-DS-SUB-052).
//
// Pair segments: variants declare --tcrn-pair-<slot>-<state> with selectors of specificity (0,2,0)
// (base.modifier) or on the base; state rules are base:where(...) (0,1,0), come after the live-pair
// defaults and only switch the live pair --tcrn-pair-<slot> (plus --tcrn-pair-weight); they never
// carry a colour. The output is deterministic, so a second run leaves no diff.
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as data from "../docs/design/gplus-2026-10/tools/data.mjs";
import { cr, fmt } from "../docs/design/gplus-2026-10/tools/lib.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTRACT_REL = "docs/design/gplus-2026-10/contract";

function contractSha256(files) {
  const h = createHash("sha256");
  for (const f of files) {
    h.update(`${f}\n`);
    h.update(fs.readFileSync(path.join(ROOT, CONTRACT_REL, f)));
    h.update("\n");
  }
  return h.digest("hex");
}

function header(files) {
  return [
    `// 由 ${CONTRACT_REL} 生成，勿手改（node scripts/contract-generate.mjs）。`,
    `// contract files: ${files.join(", ")}`,
    `// contract-sha256: ${contractSha256(files)}`,
    ""
  ].join("\n");
}

const q = (s) => JSON.stringify(s);
function cssTemplate(rules) {
  const css = rules.join("\n");
  if (/[`\\]|\$\{/.test(css)) throw new Error("generated css must not contain backticks, backslashes or ${");
  return `\`\n${css}\n\``;
}

// ---------- value translation (board vocabulary -> package variables) ----------
function pkgCss(value) {
  return value.replace(/var\((--[a-z0-9-]+)\)/g, (m, v) => {
    if (!data.CSS_VAR[v]) throw new Error(`no package variable for ${v} in ${value}`);
    return `var(${data.CSS_VAR[v]})`;
  });
}
const pkgRef = (ref) => (data.isToken(ref) ? `var(${data.CSS_VAR[`--${ref}`]})` : pkgCss(ref));

// ---------- type scale tokens (contract/typography.json "tokens") ----------
// Each type scale step is a token: typography.json lists its key, package variable and value
// (or ref, the key of a tokens.json fixed token whose value it takes). They are written into
// gplus-tokens.generated.ts, where @tcrn/ui-tokens takes their values from, and the scale
// segment refers to them by variable (TCRN-DS-SUB-052).
function typeTokens() {
  const fixed = new Map(data.tokens.fixed.map((t) => [t.key, t]));
  const contractVars = new Set([...data.tokens.themed, ...data.tokens.fixed, ...data.tokens.brand].map((t) => t.cssVar));
  const keys = new Set();
  const vars = new Set();
  return (data.typography.tokens || []).map((t) => {
    if (keys.has(t.key)) throw new Error(`typography.json: duplicate type token ${t.key}`);
    if (!/^--tcrn-type-[a-z0-9-]+$/.test(t.cssVar || "")) throw new Error(`typography.json: type token ${t.key} has no --tcrn-type-* cssVar`);
    if (vars.has(t.cssVar) || contractVars.has(t.cssVar)) throw new Error(`typography.json: ${t.cssVar} is declared twice in the contract`);
    if ((t.value === undefined) === (t.ref === undefined)) throw new Error(`typography.json: type token ${t.key} needs exactly one of value and ref`);
    keys.add(t.key);
    vars.add(t.cssVar);
    let value = t.value;
    if (t.ref !== undefined) {
      if (!fixed.has(t.ref)) throw new Error(`typography.json: type token ${t.key} refers to ${t.ref}, which is not a tokens.json fixed key`);
      value = pkgCss(fixed.get(t.ref).value);
    }
    if (typeof value !== "string" || value === "") throw new Error(`typography.json: type token ${t.key} has no string value`);
    return { key: t.key, cssVar: t.cssVar, group: t.group, value };
  });
}
const TYPE_TOKENS = new Map(typeTokens().map((t) => [t.key, t]));

// One scale declaration. When the entry names a type token for the field, the declaration is
// var(<its cssVar>) and the token's value must equal the entry's own value (the number the board
// generator reads, with its unit); otherwise the entry's value is written as it is.
function scaleDecl(entry, field, prop, unit = "") {
  const literal = `${entry[field]}${unit}`;
  const key = entry.token ? entry.token[field] : undefined;
  if (key === undefined) return `${prop}:${literal}`;
  const t = TYPE_TOKENS.get(key);
  if (!t) throw new Error(`typography.json: no type token ${key}`);
  if (t.value !== literal) throw new Error(`typography.json: type token ${key} is ${t.value}, the entry that names it says ${literal}`);
  return `${prop}:var(${t.cssVar})`;
}

// Every token an entry names is used by one of its declarations, so a misspelt field is an error.
function checkNamedTokens(typography, used) {
  const walk = (node, where) => {
    if (Array.isArray(node)) return node.forEach((n, i) => walk(n, `${where}[${i}]`));
    if (!node || typeof node !== "object") return;
    for (const field of Object.keys(node.token || {})) {
      if (!used.get(node)?.has(field)) throw new Error(`typography.json: ${where}.token.${field} is not used by any declaration`);
    }
    for (const [k, v] of Object.entries(node)) if (k !== "token" && k !== "tokens") walk(v, `${where}.${k}`);
  };
  walk(typography, "typography");
}

// ---------- pair segments ----------
// t is a pair table in the pairs.json form (pairs.json tables, or the link table of
// typography.json); slotVars maps a slot to its live-pair variable; stateValues(variant, state)
// gives the slot values a target without modifier declares (partial variants fall back to the
// table's first variant).
function pairRules(t, slotVars, stateValues, label) {
  const slotVar = (slot) => {
    if (!slotVars[slot]) throw new Error(`${label}: no live-pair variable for slot ${slot}`);
    return slotVars[slot];
  };
  const baseList = [...new Set(t.targets.map((g) => g.base))];
  const rules = [];
  const live = t.slots.map((slot) => `${slotVar(slot)}:var(${slotVar(slot)}-d)`);
  if (t.weight) live.push(`${slotVar("weight")}:${t.weight.default}`);
  rules.push(`${baseList.join(",")}{${live.join(";")}}`);
  const stateKeys = t.states.map((s) => s.key);
  for (const g of t.targets) {
    for (const variant of g.variants) {
      const own = t.variants[variant];
      if (!own) throw new Error(`${label}: no variant ${variant}`);
      const selector = g.modifier ? `${g.base}.${g.modifier.replace("{variant}", variant)}` : g.base;
      const decls = [];
      for (const st of stateKeys) {
        const values = g.modifier ? own[st] || {} : stateValues(variant, st);
        for (const slot of t.slots) {
          if (values[slot] === undefined) continue;
          decls.push(`${slotVar(slot)}-${st}:${slot.includes("edge") ? pkgCss(values[slot]) : pkgRef(values[slot])}`);
        }
      }
      rules.push(`${selector}{${decls.join(";")}}`);
    }
  }
  const base = Object.values(t.variants)[0];
  for (const key of t.ruleOrder) {
    const st = t.states.find((s) => s.key === key);
    if (!st || !st.when) throw new Error(`${label}: state ${key} has no condition`);
    const slots = st.switch || t.slots.filter((slot) => base[key] && base[key][slot] !== undefined);
    const decls = slots.map((slot) => `${slotVar(slot)}:var(${slotVar(slot)}-${key})`);
    if (t.weight && t.weight[key] !== undefined) decls.push(`${slotVar("weight")}:${t.weight[key]}`);
    rules.push(`${baseList.map((b) => `${b}:where(${st.when.join(",")})`).join(",")}{${decls.join(";")}}`);
  }
  return rules;
}

function pairSegment(tableName) {
  return pairRules(data.pairTable(tableName), data.pairs.slotVars, (variant, st) => data.pairState(tableName, variant, st), tableName);
}

// The link pair table of typography.json (TCRN-DS-SUB-055). Its default variant must say what the
// board fields of the link say (tone, underline, hover, focus ring), since the board generator
// reads those fields.
function linkPairRules(lk) {
  const t = lk.pairs;
  const first = Object.values(t.variants)[0];
  const agree = [
    ["d", "ink", lk.tone],
    ["d", "underline", lk.underline],
    ["h", "ink", lk.hover.tone],
    ["h", "underline", lk.hover.underline],
    ["f", "edge", `var(--${lk.focus.ring})`]
  ];
  for (const [st, slot, want] of agree) {
    const got = first[st] && first[st][slot];
    if (got !== want) throw new Error(`typography.json link: pairs default ${st}.${slot} is ${got}, the board field says ${want}`);
  }
  const stateValues = (variant, st) => ({ ...(first[st] || {}), ...(t.variants[variant][st] || {}) });
  return pairRules(t, t.slotVars, stateValues, "typography.json link");
}

// ---------- type scale ----------
function typeScale() {
  const ty = data.typography;
  const fam = (k) => `font-family:var(${data.CSS_VAR[`--${k}`]})`;
  const tone = (k) => `color:${pkgRef(k)}`;
  const trunc = "white-space:nowrap;overflow:hidden;text-overflow:ellipsis";
  const used = new Map();
  const d = (entry, field, prop, unit = "") => {
    if (!used.has(entry)) used.set(entry, new Set());
    used.get(entry).add(field);
    return scaleDecl(entry, field, prop, unit);
  };
  const sizeLine = (entry) => `${d(entry, "size", "font-size", "px")};${d(entry, "line", "line-height", "px")}`;
  const rules = [];
  for (const h of ty.headings) {
    rules.push(`.${h.className}{margin:0;${fam(h.family)};${sizeLine(h)};${d(h, "weight", "font-weight")}${h.tracking !== undefined ? `;${d(h, "tracking", "letter-spacing")}` : ""};${tone(h.tone)}${h.truncate ? `;${trunc}` : ""}}`);
  }
  const tx = ty.text;
  rules.push(`.${tx.className}{margin:0;${sizeLine(tx.base)};${tone(tx.base.tone)}}`);
  for (const s of tx.sizes) rules.push(`.${tx.className}.${s.className}{${sizeLine(s)}${s.tone ? `;${tone(s.tone)}` : ""}}`);
  for (const t of tx.tones) if (t.className) rules.push(`.${tx.className}.${t.className}{${tone(t.tone)}${t.weight ? `;${d(t, "weight", "font-weight")}` : ""}}`);
  const nu = ty.numeral, numCls = tx.variants.find((v) => v.name === "numeral").className;
  rules.push(`.${tx.className}.${numCls}{${fam(nu.family)};${d(nu, "weight", "font-weight")};${sizeLine(nu)};${d(nu, "tracking", "letter-spacing")};${tone(nu.tone)};${d(nu, "numeric", "font-variant-numeric")};display:inline-flex;align-items:baseline;gap:${nu.gap}px;white-space:nowrap}`);
  rules.push(`.${tx.className}.${numCls} small{${fam(nu.unit.family)};${sizeLine(nu.unit)};${d(nu.unit, "tracking", "letter-spacing")};${tone(nu.unit.tone)};${d(nu.unit, "weight", "font-weight")}}`);
  rules.push(`.${tx.className}.${numCls}.${nu.inline.className}{${sizeLine(nu.inline)};${d(nu.inline, "weight", "font-weight")};${d(nu.inline, "tracking", "letter-spacing")}}`);
  rules.push(`.${tx.className}.${numCls}.${nu.large.className}{${sizeLine(nu.large)}}`);
  const ca = ty.caps, capsCls = tx.variants.find((v) => v.name === "caps").className;
  rules.push(`.${tx.className}.${capsCls}{${fam(ca.family)};${sizeLine(ca)};${d(ca, "tracking", "letter-spacing")};text-transform:${ca.transform};${tone(ca.tone)};${d(ca, "weight", "font-weight")};white-space:nowrap}`);
  rules.push(`.${tx.className}.${capsCls} b{${fam(ca.prefix.family)};${tone(ca.prefix.tone)};${d(ca.prefix, "weight", "font-weight")};margin-right:${ca.prefix.gap}px;${d(ca.prefix, "tracking", "letter-spacing")}}`);
  const mo = ty.mono;
  rules.push(`.${tx.className}.${mo.className}{${fam(mo.family)};${sizeLine(mo)};${tone(mo.tone)}}`);
  // Link: the base rule reads the live pair (ink, underline, edge); the pair table declares the
  // variants and the :where() state rules that only switch the live pair. The forced-colours
  // focus outline is not generated: a state rule here carries no colour literal, so the
  // transparent outline sits in styles/typography.css.ts, as the Actions one sits in actions.css.ts.
  const lk = ty.link;
  const lv = lk.pairs.slotVars;
  rules.push(`.${lk.className}{color:var(${lv.ink});text-decoration:underline;text-decoration-thickness:${lk.thickness};text-underline-offset:${lk.offset};text-decoration-color:var(${lv.underline});border-radius:${lk.radius};box-shadow:var(${lv.edge})}`);
  rules.push(...linkPairRules(lk));
  const mk = ty.mark;
  rules.push(`.${mk.className}{background:${pkgRef(mk.fill)};color:inherit;font:inherit;letter-spacing:inherit;padding:0;margin:0;border-radius:${mk.radius};box-shadow:0 0 0 ${mk.spread} ${pkgRef(mk.fill)};box-decoration-break:clone;-webkit-box-decoration-break:clone}`);
  checkNamedTokens(ty, used);
  return rules;
}

// ---------- files ----------
function cssModule(files, exports) {
  return `${header(files)}\n${exports.map(([name, doc, rules]) => `/** ${doc} */\nexport const ${name} = ${cssTemplate(rules)};\n`).join("\n")}`;
}

function actionsFile() {
  const rules = pairSegment("actions");
  return cssModule(["pairs.json", "tokens.json"], [["actionsPairsCss", "Actions 状态对段：Button · IconButton · LinkButton 的生效对默认值、变体声明与状态规则", rules]]);
}

function inputsFile() {
  const text = pairSegment("inputs-text"), check = pairSegment("inputs-check"), sw = pairSegment("inputs-switch");
  return cssModule(["pairs.json", "tokens.json"], [
    ["inputsTextPairsCss", "Inputs 文本类状态对段（d/h/f/x/r/rf/e/ef；search 部分覆盖）", text],
    ["inputsCheckPairsCss", "Inputs 勾选类状态对段（fill · edge · mark；radio 部分覆盖）", check],
    ["inputsSwitchPairsCss", "Inputs 开关类状态对段（fill · edge · knob · knob-edge）", sw],
    ["inputsPairsCss", "三段按顺序拼接", [...text, ...check, ...sw]]
  ]);
}

function typographyFile() {
  return cssModule(["typography.json", "tokens.json"], [["typographyScaleCss", "字体刻度段：Heading 1–4、Text size / tone / variant、numeral、caps、mono、链接、mark", typeScale()]]);
}

function iconFile() {
  const ic = data.icons;
  const lines = [header(["icons.json"])];
  lines.push(`export const tcrnIconViewBox = ${q(ic.viewBox)};`);
  lines.push(`export const tcrnIconStrokeWidth = ${ic.strokeWidth};`);
  lines.push(`export const tcrnIconPathNames = [\n${ic.icons.map((i) => `  ${q(i.name)}`).join(",\n")}\n] as const;`);
  lines.push(`export type TcrnIconPathName = (typeof tcrnIconPathNames)[number];`);
  lines.push(`/** names added in 4.0.0, by the G+ batch and the top-band shell batch (icons.json "new") */\nexport const tcrnIconNewNames: readonly TcrnIconPathName[] = [${ic.icons.filter((i) => i.new).map((i) => q(i.name)).join(", ")}];`);
  lines.push(`/** SVG children on the 20 grid; stroke and caps come from the svg element */\nexport const tcrnIconPaths: Readonly<Record<TcrnIconPathName, string>> = {\n${ic.icons.map((i) => `  ${q(i.name)}: ${q(i.body)}`).join(",\n")}\n};`);
  return lines.join("\n\n") + "\n";
}

function marksFile() {
  const mj = data.marks;
  const ink = (c) => ({ deep: c, bright: c, c3: c, c4: c });
  const lines = [header(["marks.json"])];
  lines.push(`export const tcrnProductMarkViewBox = ${q(mj.viewBox)};`);
  lines.push(`export const tcrnProductMarkLocales = [${mj.locales.map(q).join(", ")}] as const;`);
  lines.push(`export type TcrnProductMarkLocale = (typeof tcrnProductMarkLocales)[number];`);
  lines.push(`export interface TcrnProductMark {
  readonly id: string;
  readonly productId: string;
  readonly name: string;
  readonly word: string;
  readonly suffix?: string;
  readonly font: "sans" | "serif";
  readonly palette: Readonly<Record<string, string>>;
  /** SVG children in the two (ds: four) flat tones */
  readonly colorBody: string;
  /** SVG children in currentColor, for mono use */
  readonly inkBody: string;
  readonly taglines: Readonly<Record<TcrnProductMarkLocale, string>>;
}`);
  lines.push(`export const tcrnProductMarkWordmark = ${JSON.stringify(Object.fromEntries(Object.entries(mj.wordmark).map(([k, w]) => [k, { family: w.family, weight: w.weight, ...(w.byline ? { byline: w.byline } : {}) }])), null, 2)} as const;`);
  const marks = mj.marks.map((m) => ({
    id: m.id, productId: m.productId, name: m.name, word: m.word, ...(m.suffix ? { suffix: m.suffix } : {}), font: m.font, palette: m.palette,
    colorBody: data.markBody(m, m.palette), inkBody: data.markBody(m, ink("currentColor")), taglines: m.taglines
  }));
  lines.push(`export const tcrnProductMarks: readonly TcrnProductMark[] = ${JSON.stringify(marks, null, 2)};`);
  return lines.join("\n\n") + "\n";
}

// The light theme block is a selector list: the contract light selector (:root) plus the "light"
// value of the attribute the night selector sets, so a [data-tcrn-theme="light"] subtree inside a
// dark page re-declares the light values instead of inheriting the night ones. The dark block
// follows it, so on an element both match (the dark root) the night values win (TCRN-DS-SUB-047).
function themeSelectors(themes) {
  const attribute = /^\[\s*([-\w]+)\s*=\s*"dark"\s*\]$/u.exec(themes.night.selector)?.[1];
  if (!attribute) throw new Error(`contract/tokens.json themes.night.selector is not an [attribute="dark"] selector: ${themes.night.selector}`);
  return { light: `${themes.light.selector}, [${attribute}="light"]`, dark: themes.night.selector };
}

// Brand suffix tokens are theme independent unless the contract rules a night value: an entry
// with "night" (and "nightRef", the marks.json palette step it takes, checked here like "ref" is
// checked against "value" in tools/data.mjs) is published with a dark value, and @tcrn/ui-tokens
// writes it into the light theme block and the dark block, whose property sets stay equal (C5).
// Entries without one stay in the theme-independent block (TCRN-DS-SUB-088, O-3).
function brandTokens(brand) {
  return brand.map((t) => {
    const token = { key: t.key, cssVar: t.cssVar, group: t.group, value: t.value };
    if (t.night === undefined && t.nightRef === undefined) return token;
    const ref = /^marks\.json#([a-z]+)\.palette\.([a-z0-9]+)$/.exec(t.nightRef ?? "");
    if (typeof t.night !== "string" || !ref || data.PAL[ref[1]]?.[ref[2]] !== t.night) {
      throw new Error(`contract/tokens.json: brand token ${t.key} night value ${t.night} does not match ${t.nightRef ?? "a nightRef"}`);
    }
    return { ...token, dark: t.night };
  });
}

function tokensFile() {
  const tk = data.tokens;
  const selectors = themeSelectors(tk.themes);
  const lines = [header(["tokens.json", "marks.json", "typography.json"])];
  lines.push(`export interface TcrnGplusThemedToken {\n  readonly key: string;\n  readonly cssVar: string;\n  readonly group: string;\n  readonly light: string;\n  readonly dark: string;\n}`);
  lines.push(`export interface TcrnGplusFixedToken {\n  readonly key: string;\n  readonly cssVar: string;\n  readonly group: string;\n  readonly value: string;\n}`);
  lines.push(`/** a brand suffix token; dark is its night value when the contract rules one (then it is theme-scoped, otherwise theme independent) */\nexport interface TcrnGplusBrandToken extends TcrnGplusFixedToken {\n  readonly dark?: string;\n}`);
  lines.push(`/** light values go on :root and on any [data-tcrn-theme="light"] subtree (one selector list), dark values on the dark-theme selector, whose block follows; fixed and type scale tokens are theme independent, and so is a brand token without a dark value */\nexport const tcrnGplusThemeSelectors = { light: ${q(selectors.light)}, dark: ${q(selectors.dark)} } as const;`);
  const themed = tk.themed.map((t) => ({ key: t.key, cssVar: t.cssVar, group: t.group, light: t.light, dark: t.night }));
  const fixed = tk.fixed.map((t) => ({ key: t.key, cssVar: t.cssVar, group: t.group, value: pkgCss(t.value) }));
  const brand = brandTokens(tk.brand);
  lines.push(`export const tcrnGplusThemedTokens: readonly TcrnGplusThemedToken[] = ${JSON.stringify(themed, null, 2)};`);
  lines.push(`export const tcrnGplusFixedTokens: readonly TcrnGplusFixedToken[] = ${JSON.stringify(fixed, null, 2)};`);
  lines.push(`export const tcrnGplusBrandTokens: readonly TcrnGplusBrandToken[] = ${JSON.stringify(brand, null, 2)};`);
  lines.push(`/** the type scale steps (contract/typography.json tokens; a ref takes the value of the fixed token it names) */\nexport const tcrnGplusTypeTokens: readonly TcrnGplusFixedToken[] = ${JSON.stringify([...TYPE_TOKENS.values()], null, 2)};`);
  return lines.join("\n\n") + "\n";
}

function matricesFile() {
  const mx = data.matrices;
  const lines = [header(["matrices.json", "tokens.json", "pairs.json"])];
  lines.push(`export type GplusMatrixKind = "text" | "icon" | "edge";`);
  lines.push(`export interface GplusMatrixCell {
  readonly cellId: string;
  readonly id: string;
  readonly theme: "light" | "night";
  readonly fill: string;
  readonly ink: string;
  readonly surface: string;
  readonly fillValue: string;
  readonly inkValue: string;
  readonly surfaceValue: string;
  readonly kind: GplusMatrixKind;
  readonly exempt: boolean;
  readonly pair?: string;
  /** contrast of ink over fill over surface, two decimals (the board cr / fmt) */
  readonly expect: string;
  /** threshold for the kind */
  readonly min: number;
}`);
  const boards = Object.keys(mx.boards);
  lines.push(`export const gplusMatrixBoards = [${boards.map(q).join(", ")}] as const;`);
  lines.push(`export type GplusMatrixBoard = (typeof gplusMatrixBoards)[number];`);
  const body = boards.map((b) => {
    const cells = mx.boards[b].cells.map((c) => {
      const r = data.matrixCell(b, c.cellId);
      const cell = { cellId: r.cellId, id: r.id, theme: r.theme, fill: r.fill, ink: r.ink, surface: r.surface, fillValue: r.fillValue, inkValue: r.inkValue, surfaceValue: r.surfaceValue, kind: r.kind, exempt: r.exempt, ...(r.pair ? { pair: r.pair } : {}), expect: fmt(cr(r.inkValue, r.fillValue, r.surfaceValue)), min: mx.thresholds[r.kind] };
      return `    ${JSON.stringify(cell)}`;
    });
    return `  ${q(b)}: [\n${cells.join(",\n")}\n  ]`;
  });
  lines.push(`export const gplusMatrices: Readonly<Record<GplusMatrixBoard, readonly GplusMatrixCell[]>> = {\n${body.join(",\n")}\n};`);
  lines.push(`export const gplusMatrixCellCounts: Readonly<Record<GplusMatrixBoard, number>> = { ${boards.map((b) => `${q(b)}: ${mx.boards[b].cells.length}`).join(", ")} };`);
  return lines.join("\n\n") + "\n";
}

export function generate() {
  return new Map([
    ["packages/ui-react/src/styles/generated/actions.pairs.ts", actionsFile()],
    ["packages/ui-react/src/styles/generated/inputs.pairs.ts", inputsFile()],
    ["packages/ui-react/src/styles/generated/typography.scale.ts", typographyFile()],
    ["packages/ui-react/src/components/Icon/icon-paths.generated.ts", iconFile()],
    ["packages/ui-react/src/components/Navigation/product-marks.generated.ts", marksFile()],
    ["packages/ui-tokens/src/gplus-tokens.generated.ts", tokensFile()],
    ["apps/storybook/src/contract-stories/gplus/generated/matrices.generated.ts", matricesFile()]
  ]);
}

function main(argv) {
  const check = argv.includes("--check");
  const stale = [];
  for (const [rel, content] of generate()) {
    const abs = path.join(ROOT, rel);
    const current = fs.existsSync(abs) ? fs.readFileSync(abs, "utf8") : null;
    if (current === content) continue;
    if (check) { stale.push(rel); continue; }
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content);
    console.log(`wrote ${rel}`);
  }
  if (check && stale.length) {
    console.error(`contract-generate: stale or missing: ${stale.join(", ")}`);
    process.exitCode = 1;
  } else if (check) {
    console.log("contract-generate: all generated files match the contract");
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main(process.argv.slice(2));
