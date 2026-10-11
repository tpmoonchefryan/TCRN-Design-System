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
//   packages/ui-tokens/src/gplus-tokens.generated.ts                G+ token data
//   apps/storybook/src/contract-stories/gplus/generated/matrices.generated.ts  per-cell matrix data
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

// ---------- pair segments ----------
function pairSegment(tableName) {
  const t = data.pairTable(tableName);
  const slotVar = (slot) => data.pairs.slotVars[slot];
  const baseList = [...new Set(t.targets.map((g) => g.base))];
  const rules = [];
  const live = t.slots.map((slot) => `${slotVar(slot)}:var(${slotVar(slot)}-d)`);
  if (t.weight) live.push(`${data.pairs.slotVars.weight}:${t.weight.default}`);
  rules.push(`${baseList.join(",")}{${live.join(";")}}`);
  const stateKeys = t.states.map((s) => s.key);
  for (const g of t.targets) {
    for (const variant of g.variants) {
      const own = t.variants[variant];
      if (!own) throw new Error(`${tableName}: no variant ${variant}`);
      const selector = g.modifier ? `${g.base}.${g.modifier.replace("{variant}", variant)}` : g.base;
      const decls = [];
      for (const st of stateKeys) {
        const values = g.modifier ? own[st] || {} : data.pairState(tableName, variant, st);
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
    if (!st || !st.when) throw new Error(`${tableName}: state ${key} has no condition`);
    const slots = st.switch || t.slots.filter((slot) => base[key] && base[key][slot] !== undefined);
    const decls = slots.map((slot) => `${slotVar(slot)}:var(${slotVar(slot)}-${key})`);
    if (t.weight && t.weight[key] !== undefined) decls.push(`${data.pairs.slotVars.weight}:${t.weight[key]}`);
    rules.push(`${baseList.map((b) => `${b}:where(${st.when.join(",")})`).join(",")}{${decls.join(";")}}`);
  }
  return rules;
}

// ---------- type scale ----------
function typeScale() {
  const ty = data.typography;
  const fam = (k) => `font-family:var(${data.CSS_VAR[`--${k}`]})`;
  const tone = (k) => `color:${pkgRef(k)}`;
  const trunc = "white-space:nowrap;overflow:hidden;text-overflow:ellipsis";
  const rules = [];
  for (const h of ty.headings) {
    rules.push(`.${h.className}{margin:0;${fam(h.family)};font-size:${h.size}px;line-height:${h.line}px;font-weight:${h.weight}${h.tracking !== undefined ? `;letter-spacing:${h.tracking}` : ""};${tone(h.tone)}${h.truncate ? `;${trunc}` : ""}}`);
  }
  const tx = ty.text;
  rules.push(`.${tx.className}{margin:0;font-size:${tx.base.size}px;line-height:${tx.base.line}px;${tone(tx.base.tone)}}`);
  for (const s of tx.sizes) rules.push(`.${tx.className}.${s.className}{font-size:${s.size}px;line-height:${s.line}px${s.tone ? `;${tone(s.tone)}` : ""}}`);
  for (const t of tx.tones) if (t.className) rules.push(`.${tx.className}.${t.className}{${tone(t.tone)}${t.weight ? `;font-weight:${t.weight}` : ""}}`);
  const nu = ty.numeral, numCls = tx.variants.find((v) => v.name === "numeral").className;
  rules.push(`.${tx.className}.${numCls}{${fam(nu.family)};font-weight:${nu.weight};font-size:${nu.size}px;line-height:${nu.line}px;letter-spacing:${nu.tracking};${tone(nu.tone)};font-variant-numeric:${nu.numeric};display:inline-flex;align-items:baseline;gap:${nu.gap}px;white-space:nowrap}`);
  rules.push(`.${tx.className}.${numCls} small{${fam(nu.unit.family)};font-size:${nu.unit.size}px;line-height:${nu.unit.line}px;letter-spacing:${nu.unit.tracking};${tone(nu.unit.tone)};font-weight:${nu.unit.weight}}`);
  rules.push(`.${tx.className}.${numCls}.${nu.inline.className}{font-size:${nu.inline.size}px;line-height:${nu.inline.line}px;font-weight:${nu.inline.weight};letter-spacing:${nu.inline.tracking}}`);
  rules.push(`.${tx.className}.${numCls}.${nu.large.className}{font-size:${nu.large.size}px;line-height:${nu.large.line}px}`);
  const ca = ty.caps, capsCls = tx.variants.find((v) => v.name === "caps").className;
  rules.push(`.${tx.className}.${capsCls}{${fam(ca.family)};font-size:${ca.size}px;line-height:${ca.line}px;letter-spacing:${ca.tracking};text-transform:${ca.transform};${tone(ca.tone)};font-weight:${ca.weight};white-space:nowrap}`);
  rules.push(`.${tx.className}.${capsCls} b{${fam(ca.prefix.family)};${tone(ca.prefix.tone)};font-weight:${ca.prefix.weight};margin-right:${ca.prefix.gap}px;letter-spacing:${ca.prefix.tracking}}`);
  const mo = ty.mono;
  rules.push(`.${tx.className}.${mo.className}{${fam(mo.family)};font-size:${mo.size}px;line-height:${mo.line}px;${tone(mo.tone)}}`);
  const lk = ty.link;
  rules.push(`.${lk.className}{${tone(lk.tone)};text-decoration:underline;text-decoration-thickness:${lk.thickness};text-underline-offset:${lk.offset};text-decoration-color:${pkgRef(lk.underline)};border-radius:${lk.radius}}`);
  rules.push(`.${lk.className}:where(:hover,[data-tcrn-preview-state="hover"]){${tone(lk.hover.tone)};text-decoration-color:${pkgRef(lk.hover.underline)}}`);
  rules.push(`.${lk.className}:where(:focus-visible,[data-tcrn-preview-state="focus"]){outline:none;box-shadow:var(${data.CSS_VAR[`--${lk.focus.ring}`]})}`);
  const mk = ty.mark;
  rules.push(`.${mk.className}{background:${pkgRef(mk.fill)};color:inherit;font:inherit;letter-spacing:inherit;padding:0;margin:0;border-radius:${mk.radius};box-shadow:0 0 0 ${mk.spread} ${pkgRef(mk.fill)};box-decoration-break:clone;-webkit-box-decoration-break:clone}`);
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
    ["inputsTextPairsCss", "Inputs 文本类状态对段（d/h/f/x/r/e/ef；search 部分覆盖）", text],
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
  lines.push(`/** names added in the G+ batch */\nexport const tcrnIconNewNames: readonly TcrnIconPathName[] = [${ic.icons.filter((i) => i.new).map((i) => q(i.name)).join(", ")}];`);
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

function tokensFile() {
  const tk = data.tokens;
  const selectors = themeSelectors(tk.themes);
  const lines = [header(["tokens.json", "marks.json"])];
  lines.push(`export interface TcrnGplusThemedToken {\n  readonly key: string;\n  readonly cssVar: string;\n  readonly group: string;\n  readonly light: string;\n  readonly dark: string;\n}`);
  lines.push(`export interface TcrnGplusFixedToken {\n  readonly key: string;\n  readonly cssVar: string;\n  readonly group: string;\n  readonly value: string;\n}`);
  lines.push(`/** light values go on :root and on any [data-tcrn-theme="light"] subtree (one selector list), dark values on the dark-theme selector, whose block follows; fixed and brand tokens are theme independent */\nexport const tcrnGplusThemeSelectors = { light: ${q(selectors.light)}, dark: ${q(selectors.dark)} } as const;`);
  const themed = tk.themed.map((t) => ({ key: t.key, cssVar: t.cssVar, group: t.group, light: t.light, dark: t.night }));
  const fixed = tk.fixed.map((t) => ({ key: t.key, cssVar: t.cssVar, group: t.group, value: pkgCss(t.value) }));
  const brand = tk.brand.map((t) => ({ key: t.key, cssVar: t.cssVar, group: t.group, value: t.value }));
  lines.push(`export const tcrnGplusThemedTokens: readonly TcrnGplusThemedToken[] = ${JSON.stringify(themed, null, 2)};`);
  lines.push(`export const tcrnGplusFixedTokens: readonly TcrnGplusFixedToken[] = ${JSON.stringify(fixed, null, 2)};`);
  lines.push(`export const tcrnGplusBrandTokens: readonly TcrnGplusFixedToken[] = ${JSON.stringify(brand, null, 2)};`);
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
