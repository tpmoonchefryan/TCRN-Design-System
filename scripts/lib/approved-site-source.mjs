import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { APPROVED_SITE, APPROVED_BOARD_IDS, APPROVED_SOURCE_PINS } from "./approved-site-pins.mjs";

export const SOURCE_REL = "docs/design/approved-site-v1";
export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
export const decodeHtml = (s) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
export function attributes(s) {
  return Object.fromEntries([...s.matchAll(/([^\s=<>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)].map((m) => [m[1], decodeHtml(m[2] ?? m[3] ?? m[4] ?? "")]));
}
export function declarations(s) {
  return Object.fromEntries(s.split(";").filter((x) => x.includes(":")).map((x) => { const i = x.indexOf(":"); return [x.slice(0, i).trim(), x.slice(i + 1).trim()]; }));
}
export function cssRules(css) {
  return [...css.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({ selector: m[1].trim(), declarations: declarations(m[2]), body: m[2] }));
}
export function cssRule(css, selector) {
  const result = cssRules(css).find((x) => x.selector === selector);
  if (!result) throw new Error(`Missing published selector ${selector}`);
  return result.declarations;
}
export function readApprovedSource(root = ROOT, options = {}) {
  const readSource = options.readFile ?? fs.readFileSync;
  const base = path.join(root, SOURCE_REL);
  const manifest = JSON.parse(readSource(path.join(base, "source-manifest.json"), "utf8"));
  for (const [key, expected] of Object.entries(APPROVED_SITE)) if (manifest.site?.[key] !== expected) throw new Error(`Unapproved Site identity: ${key}`);
  if (JSON.stringify(Object.fromEntries(manifest.boards.map((b) => [b.slug, b.sourceId]))) !== JSON.stringify(APPROVED_BOARD_IDS)) throw new Error("Published eight-board identities/order changed");
  const actualFiles = new Map(manifest.files.map((entry) => [entry.path, entry]));
  if (actualFiles.size !== manifest.files.length) throw new Error("Duplicate published source file claim");
  for (const [rel, expected] of Object.entries(APPROVED_SOURCE_PINS)) {
    if (rel === "font-files") continue;
    const bytes = readSource(path.join(base, rel));
    if (sha256(bytes) !== expected || actualFiles.get(rel)?.sha256 !== expected || actualFiles.get(rel)?.bytes !== bytes.length) throw new Error(`Published bytes changed: ${rel}`);
  }
  if (actualFiles.size !== Object.keys(APPROVED_SOURCE_PINS).length - 1) throw new Error("Unexpected source snapshot file membership");
  if (sha256(JSON.stringify(manifest.fontFiles)) !== APPROVED_SOURCE_PINS["font-files"]) throw new Error("Published font inventory changed");
  for (const font of manifest.fontFiles) {
    const bytes = readSource(path.join(base, font.sourcePath));
    if (sha256(bytes) !== font.sha256 || bytes.length !== font.bytes) throw new Error(`Published font bytes changed: ${font.sourcePath}`);
  }
  const boards = manifest.boards.map((board) => ({ ...board, html: readSource(path.join(base, `src/boards/${board.slug}/index.dc.html`), "utf8"), css: readSource(path.join(base, `src/boards/${board.slug}/board.css`), "utf8") }));
  const fontCss = readSource(path.join(base, "src/boards/01-tokens/fonts.css"), "utf8");
  return { base, manifest, boards, fontCss, board: (slug) => { const b = boards.find((b) => b.slug === slug); if (!b) throw new Error(`Unpublished board ${slug}`); return b; } };
}

// Engineering spellings for the exact values of the published token table (01 C).
// There is no compatibility vocabulary and no theme-dependent suffix exception.
export const CSS_VAR = Object.freeze({
  ...Object.fromEntries(["bg", "bg-2", "panel", "panel-2", "line", "line-2", "line-3", "line-ctl", "rule", "ink", "ink-2", "ink-3", "acc", "acc-2", "acc-3", "acc-bg", "acc-ul", "on-acc", "red", "red-bg", "red-bg-2", "ok", "warn", "bad", "bad-bg", "wash", "hover", "dis", "glass", "chrome", "av-bg", "av-ink", "knob"].map((k) => [`--${k}`, `--tcrn-color-${k}`])),
  "--s1": "--tcrn-elevation-s1", "--s2": "--tcrn-elevation-s2", "--s3": "--tcrn-elevation-s3", "--edge": "--tcrn-elevation-glass-edge", "--grain": "--tcrn-texture-grain-opacity", "--blend": "--tcrn-texture-grain-blend",
  "--surface": "--tcrn-color-surface", "--focus": "--tcrn-focus-ring", "--serif": "--tcrn-type-family-heading", "--sans": "--tcrn-type-family-ui", "--mono": "--tcrn-type-family-mono",
  "--r-ctl": "--tcrn-radius-control", "--r-sm": "--tcrn-radius-sm", "--r-panel": "--tcrn-radius-panel", "--r-check": "--tcrn-radius-check", "--r-stamp": "--tcrn-radius-stamp",
  ...Object.fromEntries(["sm", "md", "lg"].flatMap((size) => [[`--h-${size}`, `--tcrn-control-height-${size}`], [`--pad-${size}`, `--tcrn-control-padding-${size}`], [`--fs-${size}`, `--tcrn-type-size-control${size === "md" ? "" : `-${size}`}`], [`--ico-${size}`, `--tcrn-icon-size-${size}`]])),
  "--ease": "--tcrn-motion-ease", "--t-fill": "--tcrn-motion-duration-fill", "--t-press": "--tcrn-motion-duration-press", "--t-move": "--tcrn-motion-duration-move", "--t-loop": "--tcrn-motion-duration-loop",
  "--strip-h": "--tcrn-shell-strip-h", "--tab": "--tcrn-shell-brand-h", "--gap": "--tcrn-space-3", "--paper-r": "--tcrn-radius-paper", "--pin-gap": "--tcrn-shell-pin-gap", "--menu-gap": "--tcrn-shell-menu-gap", "--panel-wx": "--tcrn-shell-panel-w-expanded", "--drop-w": "--tcrn-shell-drop-w", "--cascade-gap": "--tcrn-shell-cascade-gap", "--row-h": "--tcrn-shell-row-h", "--srch-h": "--tcrn-shell-srch-h", "--pinb": "--tcrn-shell-pinb"
});
export function packageValue(value) {
  return value.replace(/var\((--[a-z0-9-]+)\)/g, (whole, name) => { if (!CSS_VAR[name]) throw new Error(`Unmapped published token ${name}`); return `var(${CSS_VAR[name]})`; });
}
// Resolve an explicitly anchored source scope before renaming its variables. A local
// --paper-r is data on .scr.ts, not an alias to its own package destination.
export function resolveSourceLocals(value, locals, trail = []) {
  return value.replace(/var\((--[a-z0-9-]+)\)/g, (whole, name) => {
    if (!(name in locals)) return whole; // Global themed tokens remain live references.
    if (trail.includes(name)) throw new Error(`Published local variable cycle: ${[...trail, name].join(" -> ")}`);
    return resolveSourceLocals(locals[name], locals, [...trail, name]);
  });
}
export function assertTokenGraph(entries, theme) {
  const values = new Map(entries.map(row => [row.cssVar, row[theme] ?? row.value]));
  if (values.size !== entries.length) throw new Error("Duplicate published package token");
  const done = new Set();
  function visit(name, trail = []) {
    if (trail.includes(name)) throw new Error(`Published package token cycle: ${[...trail, name].join(" -> ")}`);
    if (done.has(name)) return;
    if (!values.has(name)) throw new Error(`Missing published package token ${name}`);
    for (const match of values.get(name).matchAll(/var\((--[a-z0-9-]+)\)/g)) visit(match[1], [...trail, name]);
    done.add(name);
  }
  for (const name of values.keys()) visit(name);
}
export function extractTokens(source) {
  const css = source.board("01-tokens").css;
  const light = cssRule(css, ".gp"), night = cssRule(css, ".gp.night");
  if (Object.keys(night).length !== 39 || Object.keys(light).length - Object.keys(night).length !== 27) throw new Error("Published 39 themed / 27 fixed token table changed");
  const entry = (key, value) => ({ key: key.slice(2), cssVar: CSS_VAR[key], group: /font|type/.test(CSS_VAR[key]) ? "typography" : "color", value: packageValue(value), source: `01-tokens/board.css#.gp:${key}` });
  return {
    themed: Object.keys(night).map((key) => ({ ...entry(key, light[key]), light: packageValue(light[key]), dark: packageValue(night[key]) })),
    fixed: Object.entries(light).filter(([key]) => !(key in night)).map(([key, value]) => entry(key, value))
  };
}
export function extractPackageBindings(source, bindings = JSON.parse(fs.readFileSync(path.join(source.base, "package-bindings.json"), "utf8"))) {
  return bindings.map((binding) => {
    const board = source.board(binding.board);
    let value;
    if (binding.text) {
      const text = decodeHtml(board.html.replace(/<[^>]+>/g, "")).replace(/\s+/g, "");
      if (!text.includes(binding.text)) throw new Error(`Missing published text anchor: ${binding.text}`);
      const number = /[0-9]+(?:\.[0-9]+)?/.exec(binding.text)?.[0];
      if (!number || !["", "px", "ms"].includes(binding.unit ?? "")) throw new Error(`Invalid published numeric binding ${binding.cssVar}`);
      value = `${number}${binding.unit ?? ""}`;
      if (binding.value !== undefined && binding.value !== value) throw new Error(`Unbacked numeric value ${binding.cssVar}`);
    } else {
      value = cssRule(board.css, binding.selector)[binding.property];
      if (!value) throw new Error(`Missing published property: ${binding.selector} ${binding.property}`);
      if (binding.transform === "firstLength") value = value.split(" ")[0];
      if (binding.transform === "cascadeGap") value = cssRule(board.css, ".scr.ts")["--cascade-gap"];
      if (binding.transform === "pinGap") value = cssRule(board.css, ".scr.ts")["--pin-gap"];
      if (binding.transform === "stripInset") value = cssRule(board.css, ".scr.ts")["--gap"];
      if (binding.transform === "footerInner") value = `${parseFloat(value) - 8}px`; // 07b D2/F: 52 total, including panel bottom padding 8.
      if (binding.transform === "loadingLoop") value = value.replace(/^spin\s+/, "").replace(/\s+infinite$/, "");
    }
    if (binding.variables) {
      const locals = Object.assign({}, ...binding.variables.map(selector => cssRule(board.css, selector)));
      value = resolveSourceLocals(value, locals);
    }
    const origin = `${binding.board}/${binding.text ? `index.dc.html:${binding.text}` : `board.css#${binding.selector}:${binding.property}`}`;
    return { key: binding.cssVar.slice(7), cssVar: binding.cssVar, group: "contract", value: packageValue(value), source: origin + (binding.variables ? ` via ${binding.variables.join(" + ")}` : "") };
  });
}
export function svgBodies(html, attribute) {
  const result = [];
  for (const match of html.matchAll(/<svg\b([^>]*)>([\s\S]*?)<\/svg>/g)) {
    const a = attributes(match[1]);
    if (a[attribute]) result.push({ name: a[attribute], attributes: a, body: match[2], sourceLine: html.slice(0, match.index).split("\n").length });
  }
  return result;
}
export function normalizeSvgBody(body, { geometryOnly = false } = {}) {
  return body.replace(/\s+vector-effect="[^"]*"/g, "").replace(/<(path|circle|ellipse|rect)([^>]*?)(?:\s*\/\s*>|>\s*<\/\1>)/g, (_whole, tag, attrs) => {
    const a = attributes(attrs); if (geometryOnly) { delete a.fill; delete a.stroke; }
    return `<${tag}${Object.keys(a).sort().map((k) => ` ${k}="${a[k]}"`).join("")}/>`;
  }).replace(/>\s+</g, "><").trim();
}
export function extractIcons(source) {
  const byName = new Map();
  for (const slug of ["03-icons", "07a-shell-upper"]) for (const svg of svgBodies(source.board(slug).html, "data-icon")) {
    if (svg.name === "pin-filled") continue; // pin is a roster member; filled is its specified state.
    if (!byName.has(svg.name)) byName.set(svg.name, { name: svg.name, body: normalizeSvgBody(svg.body, { geometryOnly: true }), source: `${slug}/index.dc.html:${svg.sourceLine}` });
  }
  if (byName.size !== 38) throw new Error("Published 37 icons plus shell pin roster changed");
  return [...byName.values()];
}
export function extractMarks(source) {
  const board = source.board("04-brand");
  const svgs = svgBodies(board.html, "data-logo");
  const productIds = { tms: "tms", einzbern: "einzbern", mana: "mana-orchestrate", ds: "design-system" };
  const names = { tms: "TCRN TMS", einzbern: "Einzbern", mana: "Mana Orchestrate", ds: "TCRN Design System" };
  const taglineTable = board.html.slice(board.html.indexOf("<b>I</b>标语")).replace(/sc-raw-/g, "");
  const rows = [...taglineTable.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map((m) => [...m[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((m) => decodeHtml(m[1].replace(/<[^>]*>/g, "").trim()))).filter((r) => r.length === 6);
  return Object.entries(productIds).map(([id, productId]) => {
    const color = svgs.find((s) => s.name === id && s.attributes["data-mode"] === "color");
    const mono = svgs.find((s) => s.name === id && s.attributes["data-mode"] === "ink");
    const tint = svgs.find((s) => s.name === id && s.attributes["data-mode"] === "tile-tint");
    const deep = svgs.find((s) => s.name === id && s.attributes["data-mode"] === "tile-deep");
    const row = rows.find((r) => r[0] === names[id]);
    if (!color || !mono || !tint || !deep || !row) throw new Error(`Missing published mark or five-language tagline ${id}`);
    const colors = [...new Set([...color.body.matchAll(/(?:fill|stroke)="(#[a-fA-F0-9]+)"/g)].map((m) => m[1]))];
    const deepColor = /<rect[^>]*fill="([^"]+)"/.exec(deep.body)?.[1];
    const tintColor = /<rect[^>]*fill="([^"]+)"/.exec(tint.body)?.[1];
    const rest = colors.filter((c) => c !== deepColor);
    return { id, productId, name: names[id], word: id === "tms" || id === "ds" ? "TCRN" : names[id], ...(id === "tms" ? { suffix: "TMS" } : id === "ds" ? { suffix: "Design System" } : {}), font: id === "tms" || id === "ds" ? "sans" : "serif", palette: { deep: deepColor, bright: rest[0], tint: tintColor, ...(rest[1] ? { c3: rest[1], c4: rest[2] } : {}) }, colorBody: normalizeSvgBody(color.body), inkBody: normalizeSvgBody(mono.body), tileTintBody: normalizeSvgBody(tint.body), tileDeepBody: normalizeSvgBody(deep.body), taglines: Object.fromEntries(["zh-CN", "en", "ja", "ko", "fr"].map((l, i) => [l, row[i + 1]])), source: `04-brand/index.dc.html:${color.sourceLine}` };
  });
}
// A small structural reader retains the actual source ancestry, rather than deduplicating
// repeated cell IDs or assuming that the last .gp opening still owns a later element.
export function sourceElements(html) {
  const nodes=[], stack=[], voids=new Set(["input","img","br","hr","meta","link","wbr","area","source"]);
  for (const match of html.matchAll(/<\/?[a-zA-Z][^>]*>/g)) {
    const tag=/^<\/?([\w-]+)/.exec(match[0])[1];
    if(match[0].startsWith("</")){const i=stack.findLastIndex(n=>n.tag===tag);if(i>=0)stack.length=i;continue;}
    const attrs=attributes(match[0].slice(tag.length+1,-1)), parent=stack.at(-1);
    const node={tag,attrs,parent,children:[],offset:match.index,sourceLine:html.slice(0,match.index).split("\n").length};
    if(parent)parent.children.push(node);nodes.push(node);
    if(!voids.has(tag.replace(/^sc-raw-/,""))&&!match[0].endsWith("/>"))stack.push(node);
  }
  return nodes;
}
export function extractMatrixOccurrences(source) {
  return source.boards.flatMap(board=>{
    let ordinal=0;
    return sourceElements(board.html).filter(node=>node.attrs["data-cell"]).map(node=>{
      const ancestry=[];for(let n=node;n;n=n.parent)ancestry.unshift(n);
      const has=(n,c)=>(n.attrs.class??"").split(/\s+/).includes(c);
      const themeNode=ancestry.findLast(n=>has(n,"gp")),screen=ancestry.findLast(n=>n.attrs["data-shell"]);
      const a=node.attrs,backgroundNode=[...ancestry].reverse().find(n=>declarations(n.attrs.style??"").background);
      const carrier=ancestry.filter(n=>n.attrs.class||n.attrs.style).map(n=>({tag:n.tag,classes:n.attrs.class??"",style:n.attrs.style??""}));
      return {key:`${board.slug}:${++ordinal}`,board:board.slug,cellId:a["data-cell"],theme:themeNode&&has(themeNode,"night")?"night":"light",kind:a["data-kind"],expect:a["data-expect"],exempt:"data-exempt" in a,probe:a["data-probe"]??"ink",tag:node.tag,classes:a.class??"",sourceLine:node.sourceLine,
        sourceScene:screen?.attrs["data-shell"]??board.slug,sourceState:screen?.attrs["data-state"]??(["checked","disabled","readonly"].filter(key=>key in a).concat(a.class??[],a["aria-invalid"]==="true"?"invalid":[],a["aria-pressed"]==="true"?"pressed":[]).join(" ")||"default"),sourceAttributes:a,mobile:screen?has(screen,"m"):false,carrier,carrierBackground:backgroundNode?packageValue(declarations(backgroundNode.attrs.style).background):"",sourceStyle:a.style??""};
    });
  });
}
export function extractFontFaces(source) {
  return [...source.fontCss.matchAll(/@font-face\s*\{([^}]+)\}/g)].map((m) => {
    const d = declarations(m[1]); const url = /url\(([^)]+)\)/.exec(d.src)?.[1].replace(/['"]/g, "").replace(/^\//, "");
    const font = source.manifest.fontFiles.find((f) => f.sourcePath === url);
    if (!font) throw new Error(`Unmapped published font ${url}`);
    return { family: d["font-family"].replace(/['"]/g, ""), weight: d["font-weight"], style: d["font-style"], display: d["font-display"], unicodeRange: d["unicode-range"], sourcePath: url, file: font.file, sha256: font.sha256, bytes: font.bytes };
  });
}
