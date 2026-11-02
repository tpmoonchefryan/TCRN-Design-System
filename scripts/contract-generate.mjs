#!/usr/bin/env node
// Published Sites v1 bytes -> seven package/story source sets. Integration runs this ONCE.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { readApprovedSource, extractTokens, extractPackageBindings, extractIcons, extractMarks, extractMatrixOccurrences, cssRule, cssRules, packageValue, SOURCE_REL, ROOT, sha256 } from "./lib/approved-site-source.mjs";
const q = JSON.stringify;
const cssModule = (name, css, head) => `${head}\nexport const ${name} = ${q(css)};\n`;
const pairNames = { fill: "fill", "ink": "ink", "ink-c": "ink", edge: "edge", fw: "weight", mk: "mark", trk: "fill", kn: "knob", kedge: "knob-edge" };
function pairName(key) {
  const raw = key.slice(2), state = pairNames[raw] ? null : /-(d|h|a|f|x|l|s|r|e|ef|c|cf|cx)$/.exec(raw);
  const slot = state ? raw.slice(0, -state[0].length) : raw;
  if (!pairNames[slot]) throw new Error(`Unmapped published pair slot ${key}`);
  return `--tcrn-pair-${pairNames[slot]}${state?.[0] ?? ""}`;
}
function pairValue(value) {
  return packageValue(value.replace(/var\((--(?:(?:fill|ink|edge|mk|trk|kn|kedge)-(?:d|h|a|f|x|l|s|r|e|ef|c|cf|cx)|fill|ink-c|edge|fw|mk|trk|kn|kedge))\)/g, (_whole, k) => `var(${pairName(k)})`).replace(/var\((--tcrn-[a-z0-9-]+)\)/g, (_m, v) => `__PKG_${v}__`)).replace(/__PKG_(--tcrn-[a-z0-9-]+)__/g, (_m, v) => `var(${v})`);
}
const decl = (pairs) => Object.entries(pairs).map(([k, v]) => `${pairName(k)}:${pairValue(v)}`).join(";");
const custom = (rule) => Object.fromEntries(Object.entries(rule).filter(([k]) => k.startsWith("--")));
function switchRule(targets, when, slots, state, extra = "") {
  return `${targets.map((target) => `${target}:where(${when})`).join(",")}{${slots.map((slot) => `--tcrn-pair-${slot}:var(--tcrn-pair-${slot}-${state})`).join(";")}${extra ? `;${extra}` : ""}}`;
}
function actions(source) {
  const css = source.board("05-actions").css, bases = [".tcrn-button", ".tcrn-link-button"];
  const rules = [`${bases.join(",")}{--tcrn-pair-fill:var(--tcrn-pair-fill-d);--tcrn-pair-ink:var(--tcrn-pair-ink-d);--tcrn-pair-edge:var(--tcrn-pair-edge-d);--tcrn-pair-weight:500}`];
  for (const base of bases) for (const [name, original] of [["primary", "pri"], ["secondary", "secondary"], ["quiet", "quiet"], ["danger", "danger"]]) {
    if (base === ".tcrn-link-button" && name === "danger") continue;
    const pairs = custom(cssRule(css, `.btn.${original}`));
    for (const slot of ["fill", "ink", "edge"]) {
      pairs[`--${slot}-f`] = slot === "edge" ? `var(--focus),${pairs["--edge-d"]}` : pairs[`--${slot}-d`];
      pairs[`--${slot}-l`] = pairs[`--${slot}-d`];
    }
    rules.push(`${base}${base}--${name}{${decl(pairs)}}`);
  }
  const slots = ["fill", "ink", "edge"];
  rules.push(switchRule(bases, ':hover,[data-tcrn-preview-state="hover"]', slots, "h"), switchRule(bases, ':active,[data-tcrn-preview-state="active"]', slots, "a"), switchRule(bases, ':focus-visible,[data-tcrn-preview-state="focus"]', ["edge"], "f"), switchRule(bases, '[aria-pressed="true"]', slots, "s", "--tcrn-pair-weight:600"), switchRule(bases, ':disabled,[aria-disabled="true"]', slots, "x"), switchRule(bases, '[aria-busy="true"]', slots, "l"));
  return rules.join("\n");
}
function inputs(source) {
  const css = source.board("06-inputs").css;
  const textBases = [".tcrn-input", ".tcrn-select"];
  const text = [`${textBases.join(",")}{${decl(custom(cssRule(css, ".in")))}}`, `.tcrn-input.tcrn-search-input__control{${decl(custom(cssRule(css, ".in.search")))}}`];
  for (const [when, state, slots] of [[":hover,[data-tcrn-preview-state=\"hover\"]", "h"], [":focus-visible,[data-tcrn-preview-state=\"focus\"]", "f"], ["[readonly],[aria-readonly=\"true\"]", "r"], ["[aria-invalid=\"true\"],[data-tcrn-preview-state=\"error\"]", "e"], ["[aria-invalid=\"true\"]:focus-visible,[data-tcrn-preview-state=\"error-focus\"]", "ef", ["edge"]], [":disabled", "x"]]) text.push(switchRule(textBases, when, slots ?? ["fill", "ink", "edge"], state));
  const checkBases = [".tcrn-checkbox", ".tcrn-radio-group__control"];
  const check = [`${checkBases.join(",")}{${decl(custom(cssRule(css, ".ck>input")))}}`, `.tcrn-radio-group__control{${decl(custom(cssRule(css, ".ck.rd>input")))}}`];
  const switchBases = [".tcrn-switch__control"];
  const sw = [`${switchBases.join(",")}{${decl(custom(cssRule(css, ".tg>input")))}}`];
  for (const [when, st] of [[":hover,[data-tcrn-preview-state=\"hover\"]", "h"], [":checked,:indeterminate,[data-tcrn-preview-state=\"indeterminate\"]", "c"], [":focus-visible,[data-tcrn-preview-state=\"focus\"]", "f"], [":checked:focus-visible,:checked[data-tcrn-preview-state=\"focus\"],[data-tcrn-preview-state=\"indeterminate\"][data-focus=\"true\"]", "cf"], ["[aria-invalid=\"true\"]", "e"], [":disabled", "x"], [":disabled:checked,:disabled:indeterminate", "cx"]]) {
    check.push(switchRule(checkBases, when, ["fill", "edge", "mark"], st));
    if (st !== "e") sw.push(switchRule(switchBases, when.replace(/,:indeterminate/g, ""), ["fill", "edge", "knob", "knob-edge"], st));
  }
  return { text: text.join("\n"), check: check.join("\n"), sw: sw.join("\n") };
}
function typography(source) {
  const classes = { h1: "tcrn-heading--1", h2: "tcrn-heading--2", h3: "tcrn-heading--3", h4: "tcrn-heading--4", tx: "tcrn-text", strong: "tcrn-text--strong", read: "tcrn-text--reading", meta: "tcrn-text--meta", cap: "tcrn-text--caption", num: "tcrn-text.tcrn-text--numeral", inl: "tcrn-text--numeral-inline", big: "tcrn-text--numeral-large", caps: "tcrn-text.tcrn-text--caps", id: "tcrn-text--mono", lnk: "tcrn-link", hl: "tcrn-highlight__mark" };
  return cssRules(source.board("02-typography").css).filter((r) => /^(?:\.h[1-4](?:,|\{|$)|\.tx(?:\.|$)|\.num(?:\.| |$)|\.caps(?: |$)|\.id$|\.lnk(?:[:,.]|$)|mark\.hl$)/.test(r.selector)).map((r) => `${r.selector.replace(/\.([\w-]+)/g, (m, c) => classes[c] ? `.${classes[c]}` : m)}{${packageValue(r.body)}}`).join("\n");
}
export function generate(root = ROOT) {
  const source = readApprovedSource(root);
  const inputHash = sha256(JSON.stringify(source.manifest.files));
  const header = `// Generated from published Sites v1, commit ${source.manifest.site.sourceCommit}. Do not edit.\n// ${SOURCE_REL}/source-manifest.json; input-sha256 ${inputHash}\n`;
  const icons = extractIcons(source), marks = extractMarks(source), tk = extractTokens(source), bindings = extractPackageBindings(source), mx = extractMatrixOccurrences(source);
  const ip = inputs(source);
  const tokens = header + `export interface TcrnGplusFixedToken { readonly key:string; readonly cssVar:string; readonly group:string; readonly value:string; readonly source?:string }\nexport interface TcrnGplusThemedToken extends TcrnGplusFixedToken { readonly light:string; readonly dark:string }\nexport interface TcrnGplusBrandToken extends TcrnGplusFixedToken { readonly dark?:string }\nexport const tcrnGplusThemeSelectors = {light: ':root, [data-tcrn-theme="light"]', dark: '[data-tcrn-theme="dark"]'} as const;\nexport const tcrnGplusThemedTokens:readonly TcrnGplusThemedToken[] = ${q(tk.themed)};\nexport const tcrnGplusFixedTokens:readonly TcrnGplusFixedToken[] = ${q([...tk.fixed, ...bindings])};\nexport const tcrnGplusTypeTokens:readonly TcrnGplusFixedToken[] = [];\nexport const tcrnGplusBrandTokens:readonly TcrnGplusBrandToken[] = ${q(marks.filter((m) => m.suffix).map((m) => ({key:`brand-suffix-${m.productId}`,cssVar:`--tcrn-brand-suffix-${m.productId}`,group:"brand",value:m.palette.deep,source:m.source})))};\n`;
  const iconFile = header + `export const tcrnIconViewBox="0 0 20 20";\nexport const tcrnIconStrokeWidth=1.25;\nexport const tcrnIconPathNames=${q(icons.map((x) => x.name))} as const;\nexport type TcrnIconPathName=(typeof tcrnIconPathNames)[number];\nexport const tcrnIconPaths:Readonly<Record<TcrnIconPathName,string>>=${q(Object.fromEntries(icons.map((x) => [x.name,x.body])))};\n`;
  const marksFile = header + `export const tcrnProductMarkViewBox="0 0 48 48";\nexport const tcrnProductMarkLocales=["zh-CN","en","ja","ko","fr"] as const;\nexport type TcrnProductMarkLocale=(typeof tcrnProductMarkLocales)[number];\nexport interface TcrnProductMark { readonly id:string;readonly productId:string;readonly name:string;readonly word:string;readonly suffix?:string;readonly font:"sans"|"serif";readonly palette:Readonly<Record<string,string>>;readonly colorBody:string;readonly inkBody:string;readonly tileTintBody:string;readonly tileDeepBody:string;readonly taglines:Readonly<Record<TcrnProductMarkLocale,string>>;readonly source?:string }\nexport const tcrnProductMarkWordmark={sans:{family:"sans",weight:600},serif:{family:"serif",weight:400,byline:"by TCRN"}} as const;\nexport const tcrnProductMarks:readonly TcrnProductMark[]=${q(marks)};\n`;
  const matrixFile = header + `export interface ApprovedMatrixOccurrence { readonly key:string;readonly board:string;readonly cellId:string;readonly theme:string;readonly kind:string;readonly expect:string;readonly exempt:boolean;readonly probe:string;readonly tag:string;readonly classes:string;readonly sourceLine:number;readonly sourceScene:string;readonly sourceState:string;readonly sourceAttributes:Readonly<Record<string,string>>;readonly mobile:boolean;readonly carrier:readonly {readonly tag:string;readonly classes:string;readonly style:string}[];readonly carrierBackground:string;readonly sourceStyle:string }\nexport const approvedMatrixOccurrences:readonly ApprovedMatrixOccurrence[]=${q(mx)};\n`;
  return new Map([
    ["packages/ui-react/src/styles/generated/actions.pairs.ts",cssModule("actionsPairsCss",actions(source),header)],
    ["packages/ui-react/src/styles/generated/inputs.pairs.ts",cssModule("inputsTextPairsCss",ip.text,header)+cssModule("inputsCheckPairsCss",ip.check,"")+cssModule("inputsSwitchPairsCss",ip.sw,"")+`export const inputsPairsCss=inputsTextPairsCss+inputsCheckPairsCss+inputsSwitchPairsCss;\n`],
    ["packages/ui-react/src/styles/generated/typography.scale.ts",cssModule("typographyScaleCss",typography(source),header)],
    ["packages/ui-react/src/components/Icon/icon-paths.generated.ts",iconFile],
    ["packages/ui-react/src/components/Navigation/product-marks.generated.ts",marksFile],
    ["packages/ui-tokens/src/gplus-tokens.generated.ts",tokens],
    ["apps/storybook/src/contract-stories/gplus/generated/matrices.generated.ts",matrixFile]
  ]);
}
function main() {
  const check = process.argv.includes("--check"), stale=[];
  for (const [rel,content] of generate()) {
    const file=path.join(ROOT,rel); if (fs.existsSync(file) && fs.readFileSync(file,"utf8")===content) continue;
    if (check) stale.push(rel); else {fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,content);console.log(`wrote ${rel}`);}
  }
  if (stale.length) {console.error(`Published-source generation is stale: ${stale.join(", ")}`);process.exitCode=1;}
}
if (process.argv[1] && import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) main();
