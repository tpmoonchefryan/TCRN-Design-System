// Storybook shell fidelity proof — TCRN-DS-INIT-003, WS1.
//
// The visual baseline used to carry a `rejectChecks` block in which six of seven
// entries were the literal `false`. They were not checks; they were claims, and they
// travelled into the AI consumption contract as if they had been verified. This file
// replaces the three that can actually be decided by machine:
//
//   decorativeGradientsOrOrbs   the quiet-instrument base draws with flat fills and
//                               hairlines. Gradients survive only where they carry
//                               information (a progress fill, a skeleton shimmer),
//                               and those live on the allowlist below.
//   radiusDriftAboveContract    radii come from tokens. A literal in the shell means
//                               the shell has drifted away from the contract it documents.
//   softCloudElevation          elevation is a drawn edge, not a blurred cloud, so a
//                               large-blur box-shadow is drift in the same sense.
//
// The remaining three (nestedCards, genericLeftRailAdminShellCreep, incoherentOverlap)
// are compositional judgements this file cannot make. Rather than keep asserting a
// cheerful `false`, the proof now reports them as explicitly unchecked — see
// UNCHECKED_CLAIMS. That narrows what the contract claims; it does not relax a check
// that ever ran.
import { readFileSync } from "node:fs";
import { resolve, dirname, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { componentCssModules } from "./lib/component-css-sources.mjs";
import { compounds, parseCompound, parseCss, shadowLayers, splitTopLevel } from "./lib/css-rules.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const SURFACES = [
  "apps/storybook/src/storybook.css",
  "apps/storybook/src/alpha-styles.ts",
  "apps/storybook/src/story-demo-styles.ts"
];

// The published token table. The soft-cloud shadow check reads it with the package
// segments, because a blurred elevation token reaches every component that uses it.
const TOKEN_TABLE = "packages/ui-tokens/src/tokens.css";

// Gradients that encode state rather than decorate a surface.
// The doc-layer loading and bookmark demos that carried the other entries were removed
// with the doc-layer parallel implementations (TCRN-DS-SUB-025).
const FUNCTIONAL_GRADIENT_SELECTORS = [
  ".tcrn-skeleton::after"
];

// Radii the shell may state literally, because they are shape declarations rather
// than surface radii: a full circle cannot be expressed as a token step.
// `0`, `inherit` and the pill/circle shapes are declarations of form, not surface radii:
// a full circle has no token step, and zero is the absence of a radius rather than a
// drifted value. 999px is no longer allowed here — it belongs to --tcrn-radius-pill
// (INIT-006 E4), and the pill detector below bans the bare literal.
const ALLOWED_RADIUS_LITERALS = ["50%", "0", "inherit"];

// INIT-006 E7 style gates. The scale is docs/style-scale.md; the gate hard-codes it so
// a drifted value cannot pass by being merely present.
const SPACING_SCALE_PX = new Set([2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 32]);

// Package-truth component CSS sources. Since TCRN-DS-SUB-010 the `tcrnComponentCss` rules
// live in the family segment modules under packages/ui-react/src/styles/, and the list
// comes from scripts/lib/component-css-sources.mjs, so a family module or generated
// segment added there is covered without a further edit to this gate.

// The doc-only presentation layers the dup gate must scan for re-implementations of
// package classes. alpha-styles.ts is already in SURFACES for the per-line drift checks,
// but the duplicate-selector gate is a SEPARATE code path and must read it explicitly:
// alpha-styles.ts embeds its CSS as the `alphaStoryCss` template literal (Track B, via
// page-template.tsx block 2), so a docs-side re-implementation can hide in either file.
const DUPLICATE_DOCS_SURFACES = [
  "apps/storybook/src/storybook.css",
  "apps/storybook/src/alpha-styles.ts"
];

// Selectors legitimately shared between the package and the docs presentation layer.
// Two kinds live here, and nothing else may be added speculatively — a whitelist entry
// blinds the gate to that class ("门只保护它读过的字节"), so it must name a class that is
// genuinely a demo override, never a re-implementation the gate exists to catch:
//   1. Infra primitives placed by a doc demo (.tcrn-skip-link inside the package-nav proof).
//      The docs shell's verbatim copies of .tcrn-sr-only and .tcrn-skip-link were removed
//      (TCRN-DS-SUB-063); the package defines both.
//   2. LEGITIMATE demo overrides whose STYLED SUBJECT is a package class but which are
//      demo-SCOPED (rendered only under a documented demo container) — the key-subject
//      extractor deliberately flags e.g. `.tcrn-doc-knowledge-shell-layout > .tcrn-top-bar`
//      (key-subject `.tcrn-top-bar`), which is demo scoping, not a parallel component.
// The authoritative list of what may live doc-side is docs/style-scale.md
// § "Demo-chrome exemption list". Every entry below is a key-subject the expanded gate
// flags only because it is scoped under one of those documented demo containers
// (.tcrn-doc-*, which since TCRN-DS-SUB-025 covers the knowledge-shell, nav-preview,
// package-nav-proof and form-stack scaffolding, and the tooltip static-preview hook), or —
// for .tcrn-filter-bar — is documented there as non-duplicating (the package owns it only via the scoped
// `.tcrn-table-toolbar .tcrn-filter-bar` rule, so a top-level docs `.tcrn-filter-bar`
// shares the key-subject but not the selector).
// A whitelisted subject is still held to placement by the rule-level guard below
// (TCRN-DS-SUB-065): only placement properties, or an exception registered for that exact
// selector, pass. Entries go when their last doc rule goes (.tcrn-sr-only and
// .tcrn-brand-wordmark__base with TCRN-DS-SUB-063, .tcrn-brand-wordmark with SUB-065).
const DUPLICATE_SELECTOR_WHITELIST = new Set([
  ".tcrn-skip-link",
  // Demo-scoped overrides of package classes (docs/style-scale.md exemption list). The
  // nav-item, top-bar track and module-tabs entries went with the doc rules that needed
  // them (TCRN-DS-SUB-025); the top-bar, search-input, brand-wordmark suffix and
  // product-logo copy entries had no doc rule left and went in TCRN-DS-SUB-219:
  ".tcrn-product-switcher",
  ".tcrn-segmented-nav",
  ".tcrn-field",
  ".tcrn-tooltip__content",
  // The package-nav proof places the package side nav in its demo grid
  // (`.tcrn-doc-package-nav-proof > .tcrn-side-nav`); the package owns its appearance and the
  // docs only position it. The brand lockup entries (.tcrn-shell-brand-lockup and its copy and
  // caption) went with the last doc rules that placed them (TCRN-DS-SUB-219).
  ".tcrn-side-nav",
  // The entry for the ProductShell story's static search result list (TCRN-DS-SUB-100) went with
  // its doc rule and its registered exception once no story wrote that doc container any more
  // (TCRN-DS-SUB-204).
  // The knowledge-base sample's .tcrn-nav-group__label and .tcrn-nav-item entries (TCRN-DS-SUB-101,
  // R3M5) went with their four document-scoped exceptions once the sample and the documentation shell
  // became the package's top-band ProductShell (TCRN-DS-SUB-132, INIT-015 N-2).
  // Documented demo-chrome hook — not a duplicate (see comment above):
  ".tcrn-filter-bar"
]);

// A line that defines a token (`--tcrn-…: #hex/999px`) or is a comment is not drift:
// token definitions are the one place literals belong, and comments are prose.
function isTokenDefinitionOrComment(line) {
  const trimmed = line.trim();
  if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) return true;
  if (/^--tcrn-[\w-]+\s*:/.test(trimmed)) return true;
  return false;
}

// Key-subject class extractor for the duplicate gate. The old line-initial `^\.class`
// scan only ever saw a bare single class at the start of a line, so it was blind to the
// shapes a docs re-implementation actually takes: dark-scope
// (`[data-tcrn-theme="dark"] .tcrn-button--primary`), descendant
// (`.tcrn-doc-nav-component-preview .tcrn-nav-item`), attribute
// (`.tcrn-nav-item[data-selected="true"]`) and compound (`.tcrn-a.tcrn-b`). Instead we
// parse every CSS rule prelude (the text before `{`) and record the class of the KEY
// SUBJECT — the rightmost compound after the final combinator (` `, `>`, `+`, `~`). That
// is the element a rule actually styles, so a package class is flagged when the rule
// styles IT, but NOT when the package class is merely ancestor CONTEXT for a demo child
// (`.tcrn-nav-item .demo-child` → subject `.demo-child`).
//
// The package side is fed only the CSS text of the stylesheet segments (the template
// literal bodies), never the TypeScript around them, so module comments and imports
// cannot be mistaken for rule preludes. The docs side still reads whole files; there the
// class match is dot-anchored — `\.(tcrn-…)` — and the prelude character class `[^{}();]`
// resets at every `(` / `)` / `;`, so a leading-dot string inside a call such as
// `querySelector(".tcrn-x")` is never captured as a rule subject.
function ruleSubjectClasses(text) {
  const classes = new Set();
  for (const m of text.matchAll(/([^{}();]*)\{/g)) {
    const prelude = m[1];
    if (/@(media|keyframes|property|supports|font-face|layer|container)/.test(prelude)) continue;
    for (const sel of prelude.split(",")) {
      const s = sel.trim();
      if (!s) continue;
      // key subject = last compound after the final combinator (space > + ~)
      const parts = s.split(/\s*[>+~]\s*|\s+/).filter(Boolean);
      const subject = parts[parts.length - 1] || "";
      for (const c of subject.matchAll(/\.(tcrn-[a-z0-9_-]+)/gi)) classes.add("." + c[1]);
    }
  }
  return classes;
}

// A shadow is elevation drift once it blurs; a 1px hairline offset is a drawn edge.
const MAX_SHADOW_BLUR_PX = 3;

// The CSS a docs surface carries. storybook.css is CSS; the two .ts surfaces carry theirs
// in template literals, so everything outside a literal and every ${…} interpolation is
// blanked to spaces (newlines kept), which keeps rule line numbers equal to file lines.
export function docSurfaceCss(surface, text) {
  if (!surface.endsWith(".ts")) return text;
  const blank = (chunk) => chunk.replace(/[^\n]/g, " ");
  let out = "";
  let index = 0;
  let inTemplate = false;
  while (index < text.length) {
    const char = text[index];
    if (!inTemplate) {
      let end = index + 1;
      if (char === "/" && text[index + 1] === "/") {
        end = text.indexOf("\n", index);
        if (end < 0) end = text.length;
      } else if (char === "/" && text[index + 1] === "*") {
        end = text.indexOf("*/", index + 2);
        end = end < 0 ? text.length : end + 2;
      } else if (char === '"' || char === "'") {
        end = index + 1;
        while (end < text.length && text[end] !== char && text[end] !== "\n") end += text[end] === "\\" ? 2 : 1;
        end += 1;
      } else if (char === "`") {
        inTemplate = true;
      }
      out += blank(text.slice(index, end));
      index = end;
      continue;
    }
    if (char === "\\") { out += text.slice(index, index + 2); index += 2; continue; }
    if (char === "`") { inTemplate = false; out += " "; index += 1; continue; }
    if (char === "$" && text[index + 1] === "{") {
      let depth = 0;
      let end = index + 1;
      for (; end < text.length; end += 1) {
        if (text[end] === "{") depth += 1;
        else if (text[end] === "}" && --depth === 0) break;
      }
      out += blank(text.slice(index, end + 1));
      index = end + 1;
      continue;
    }
    out += char;
    index += 1;
  }
  return out;
}

// Declarations that carry a shadow list: box-shadow and text-shadow, and the custom
// properties that feed them (shadow and elevation tokens, the pair edges, the focus ring).
function isShadowDeclaration(prop) {
  return prop === "box-shadow" || prop === "text-shadow"
    || (prop.startsWith("--") && /shadow|elevation|edge|focus-ring/.test(prop));
}

// TCRN-DS-SUB-050: blur is read per shadow layer with shadowLayers (scripts/lib/css-rules.mjs),
// so the third length is the blur only where it is one: `inset 0 0 0 5px` is a 5px spread
// with no blur. A layer that is only a var() reference resolves to a token the token table
// scan reads, so a list such as `var(--tcrn-focus-ring), 0 1px 1px …` still has its literal
// layers read. Values that are not shadow lists (a colour, `none`) give no layers.
export function shadowBlurFindings(css, source) {
  const findings = [];
  for (const rule of parseCss(css, { source }).rules) {
    for (const declaration of rule.declarations) {
      if (!isShadowDeclaration(declaration.prop)) continue;
      for (const rawLayer of splitTopLevel(declaration.value, ",")) {
        const layers = shadowLayers(rawLayer.trim());
        for (const layer of layers ?? []) {
          if (layer.blur > MAX_SHADOW_BLUR_PX) {
            findings.push({ where: `${source}:${rule.line}`, selector: rule.selectorText, blur: layer.blur });
          }
        }
      }
    }
  }
  return findings;
}

// C10, shell geometry from tokens (TCRN-DS-SUB-142; clauses.md C10: the shell's geometry comes
// value by value from tokens, and a literal is red). The shell modules (styles/shell*.css.ts,
// read through componentCssModules) write no px length in a geometry declaration: box sizes
// and their min and max, insets and offsets, gaps, padding, margins, flex bases, grid tracks,
// radii and translations, and every custom property the modules set, because a token
// re-declared with a literal is the same drift (the old component-layer coarse-pointer root that
// set the row and search heights to 44 is one). Kept as the spacing scan above keeps them: a
// value written through calc(), clamp(), min() or max(), whose bounds are fluid, and a 1px line.
// Type sizes are not geometry here (12.5, 10 and 11.5 stay; INIT-016 R1 judgment, section 3.3),
// and neither are outlines and border widths, which draw lines. Findings carry the module path
// and the line inside its joined segments, like the soft-cloud scan.
export const SHELL_GEOMETRY_MODULE = /(?:^|\/)shell[^/]*\.css\.ts$/u;
const SHELL_GEOMETRY_PROPERTY = /^(?:(?:min-|max-)?(?:width|height|inline-size|block-size)|inset(?:-(?:block|inline))?(?:-(?:start|end))?|top|right|bottom|left|(?:row-|column-)?gap|(?:padding|margin)(?:-(?:top|right|bottom|left|block|inline)(?:-(?:start|end))?)?|flex|flex-basis|grid-(?:template|auto)-(?:columns|rows)|border(?:-[a-z]+){0,2}-radius|translate|transform)$/u;
const FLUID_VALUE = /(?:clamp|calc|min|max)\(/u;

export function shellGeometryLiteralFindings(css, source) {
  const findings = [];
  for (const rule of parseCss(css, { source }).rules) {
    for (const { prop, value } of rule.declarations) {
      if (!prop.startsWith("--") && !SHELL_GEOMETRY_PROPERTY.test(prop)) continue;
      if (FLUID_VALUE.test(value)) continue;
      for (const match of value.matchAll(/(?<![\w.#-])(\d*\.?\d+)px\b/gu)) {
        const length = Number(match[1]);
        if (length === 0 || length === 1) continue;
        findings.push({ where: `${source}:${rule.line}`, selector: rule.selectorText, value: `${prop}: ${match[0]}` });
      }
    }
  }
  return findings;
}

// The shell modules among the package stylesheet modules. A scan that found no shell.css.ts
// would pass by reading nothing, so that is an error, not a green.
function shellGeometryModules() {
  const modules = componentCssModules(root).filter(({ path }) => SHELL_GEOMETRY_MODULE.test(path));
  if (!modules.some(({ path }) => path.endsWith("/shell.css.ts"))) {
    throw new Error("shell-fidelity: no styles/shell.css.ts among the component stylesheet modules; the C10 geometry scan would read nothing");
  }
  return modules;
}

// TCRN-DS-SUB-065 (STORY-128 GWT3): rule-level guard. In the three docs style sources a rule
// whose subject compound (the rightmost compound of a selector) carries a package class may
// only place that component. doc:sample-style compares only the samples a matrix shares a
// signature with, and the duplicate-selector check only asks whether the package styles the
// same subject, so a docs rule that repainted a package component (the global ShellBrandLockup
// wordmark size, TCRN-DS-SUB-063) passed every gate. A package class is any tcrn-* class
// outside the docs' own tcrn-doc- prefix, so classes a component writes without a rule count.
// Placement is what docs/style-scale.md ("Package components placed by doc scaffolding": grid
// area, track width, wrapping) and the R2-16 ruling (grid-area, order, margins, self
// alignment) allow: grid placement, order, margins, self alignment, flex item sizing, inline
// size and text wrapping. Every other property, custom properties included, is a finding
// unless an exception below registers that selector and property.
const PLACEMENT_PROPERTIES = new Set([
  "grid-area", "grid-row", "grid-row-start", "grid-row-end", "grid-column", "grid-column-start", "grid-column-end",
  "order",
  "margin", "margin-top", "margin-right", "margin-bottom", "margin-left",
  "margin-block", "margin-block-start", "margin-block-end", "margin-inline", "margin-inline-start", "margin-inline-end",
  "align-self", "justify-self", "place-self",
  "flex", "flex-grow", "flex-shrink", "flex-basis",
  "width", "min-width", "max-width", "inline-size", "min-inline-size", "max-inline-size",
  "white-space", "overflow-wrap", "word-break"
]);

// C7 single-line carriers (TCRN-DS-SUB-102): the classes docs/contract/roles.json registers under
// singleLine keep their text on one line in the package, so for a subject that carries one of them
// the wrapping properties are not placement: a doc rule that sets white-space, overflow-wrap or
// word-break on a carrier is a finding like any repaint. The list is read from roles.json, not
// copied here.
const WRAPPING_PROPERTIES = new Set(["white-space", "overflow-wrap", "word-break"]);
const SINGLE_LINE_CARRIER_CLASSES = new Set(
  JSON.parse(readFileSync(resolve(root, "docs/contract/roles.json"), "utf8")).singleLine.map((entry) => entry.class)
);

// Registered exceptions, written the EX-INIT015-* way (docs/contract/exemptions.json): each
// entry names exact selectors (whitespace collapsed, as the CSS reader gives them) and the
// properties it admits for them, with a ruling reference, a reason and a removal condition.
// An entry admits nothing else, and an entry no rule used is listed as docExceptionsUnused.
// The four R3M5 entries (TCRN-DS-SUB-101 plan A: the knowledge-base sample's TopBar, SideNav, group
// titles and items in composition one's rail geometry) were removed with the documentation shell's move
// to the top-band ProductShell (TCRN-DS-SUB-132, INIT-015 closeout N-2). The entry for the
// ProductShell story's static search result list (TCRN-DS-SUB-100) went with its doc rule once no
// story wrote that doc container any more (TCRN-DS-SUB-204).
export const DOC_PACKAGE_CLASS_EXCEPTIONS = Object.freeze([
  {
    id: "EX-INIT015-doc-tooltip-static-preview",
    selectors: [
      '.tcrn-tooltip[data-storybook-static-tooltip="true"] .tcrn-tooltip__content',
      '.tcrn-tooltip[data-placement="top"][data-storybook-static-tooltip="true"] .tcrn-tooltip__content',
      '.tcrn-tooltip[data-placement="bottom"][data-storybook-static-tooltip="true"] .tcrn-tooltip__content',
      '.tcrn-tooltip[data-placement="right"][data-storybook-static-tooltip="true"] .tcrn-tooltip__content',
      '.tcrn-tooltip[data-placement="left"][data-storybook-static-tooltip="true"] .tcrn-tooltip__content'
    ],
    properties: ["opacity", "transform"],
    ruling: "docs/style-scale.md「Demo-chrome exemption list」Component-scoped demo hooks 条：tooltip 静态预览钩子为静态文档强制显示展开态；Tooltip 属 Overlay 家族，TCRN-DS-INIT-015 scope 不授权改动后续批次家族（同 EX-INIT015-overlay）",
    reason: "静态文档页没有悬停，钩子只把包的 tooltip 内容移到展开位置并显示（opacity、transform），不改颜色、字号与边框",
    until: "Overlay 家族所在批次获得授权、包提供静态展开态时删除本条"
  },
  {
    id: "EX-INIT015-doc-filter-bar",
    selectors: [".tcrn-filter-bar"],
    properties: ["display", "flex-wrap", "gap"],
    ruling: "docs/style-scale.md「Demo-chrome exemption list」Component-scoped demo hooks 条：顶层 .tcrn-filter-bar 是文档的标签排布钩子，包只在 .tcrn-table-toolbar .tcrn-filter-bar 里定义它；所属 Navigation 家族属后续批次（同 EX-INIT015-navigation）",
    reason: "包没有独立 FilterBar 的排布规则，文档只给演示行排布（display、flex-wrap、gap），不改颜色、字号与边框",
    until: "Navigation 家族所在批次获得授权、包给 FilterBar 独立排布时删除本条"
  },
  {
    id: "EX-INIT015-doc-nav-proof-skip-link",
    selectors: [
      ".tcrn-doc-package-nav-proof__skip .tcrn-skip-link:not(:focus)",
      ".tcrn-doc-package-nav-proof__skip .tcrn-skip-link:focus"
    ],
    properties: ["position", "height", "overflow", "clip", "clip-path", "border", "padding", "transform", "display", "align-items"],
    ruling: "docs/style-scale.md「Demo-chrome exemption list」Package components placed by doc scaffolding 条：文档保留基础原件 .tcrn-skip-link 的演示放置；包导航证明框属 Navigation 家族演示，TCRN-DS-INIT-015 scope 不授权改动后续批次家族（同 EX-INIT015-navigation）",
    reason: "证明框里的跳转链接未获焦时收成 1px 的读屏隐藏框（position、height、overflow、clip、clip-path、border、padding、transform），获焦时按行内弹性盒显示（display、align-items）；文档壳自己的 .tcrn-skip-link 副本已删（TCRN-DS-SUB-063）",
    until: "Navigation 家族所在批次获得授权、包导航证明框改由包组件呈现跳转链接时删除本条"
  }
]);

function isPackageClass(name) {
  return name.startsWith("tcrn-") && !name.startsWith("tcrn-doc-");
}

// The guard's view of a docs surface: docSurfaceCss, and for storybook.css the generated demo
// layer blanked as well. That region is a copy of story-demo-styles.ts, which the guard reads
// directly, and demo-styles-sync --check holds the copy to it.
const DEMO_LAYER_START = "/* Demo layer generated from story-demo-styles.ts";
const DEMO_LAYER_END = "/* End demo layer generated from story-demo-styles.ts */";
export function guardSurfaceCss(surface, text) {
  const css = docSurfaceCss(surface, text);
  const start = css.indexOf(DEMO_LAYER_START);
  const end = start < 0 ? -1 : css.indexOf(DEMO_LAYER_END, start);
  if (start < 0 || end < 0) return css;
  return css.slice(0, start) + css.slice(start, end).replace(/[^\n]/g, " ") + css.slice(end);
}

// Findings of the rule-level guard in one stylesheet text: one per selector whose subject
// compound carries a package class, listing the properties that are neither placement nor
// admitted by an exception for that exact selector. `used` collects the exception ids that
// admitted something.
export function packageClassAppearanceFindings(css, source, exceptions = DOC_PACKAGE_CLASS_EXCEPTIONS, used = new Set()) {
  const findings = [];
  for (const rule of parseCss(css, { source }).rules) {
    if (rule.kind !== "style") continue;
    for (const selector of rule.selectors) {
      const parts = compounds(selector);
      const subject = parts[parts.length - 1]?.text ?? "";
      const subjectClasses = parseCompound(subject).classes;
      if (!subjectClasses.some(isPackageClass)) continue;
      const singleLineCarrier = subjectClasses.some((name) => SINGLE_LINE_CARRIER_CLASSES.has(name));
      const entries = exceptions.filter((entry) => entry.selectors.includes(selector));
      const offending = [];
      for (const { prop } of rule.declarations) {
        if (PLACEMENT_PROPERTIES.has(prop) && !(singleLineCarrier && WRAPPING_PROPERTIES.has(prop))) continue;
        const admitted = entries.find((entry) => entry.properties.includes(prop));
        if (admitted) used.add(admitted.id);
        else if (!offending.includes(prop)) offending.push(prop);
      }
      if (offending.length > 0) findings.push({ where: `${source}:${rule.line}`, selector, value: offending.join(", ") });
    }
  }
  return findings;
}

export const UNCHECKED_CLAIMS = Object.freeze({
  nestedCards: "compositional judgement; no machine check exists in this repository",
  genericLeftRailAdminShellCreep: "compositional judgement; no machine check exists in this repository",
  incoherentOverlap: "compositional judgement; no machine check exists in this repository"
});

function owningSelector(lines, index) {
  for (let cursor = index; cursor >= 0 && cursor > index - 60; cursor -= 1) {
    const line = lines[cursor];
    if (/^\s*["`]?\s*[.\[&#][^{]*\{\s*$/.test(line) || /^\s*[.\[&#][^{;]*\{/.test(line)) {
      return line.replace(/[`"{]/g, "").trim();
    }
  }
  return "(unknown selector)";
}

export function scanShellFidelity() {
  const findings = {
    decorativeGradients: [], radiusLiterals: [], softCloudShadows: [], reducedMotionKillSwitches: [],
    hexLiterals: [], fontSizeLiterals: [], spacingLiterals: [], pillLiterals: [], shellGeometryLiterals: [], duplicateSelectors: [],
    packageClassAppearance: [], docExceptionsUnused: []
  };

  for (const surface of SURFACES) {
    const text = readFileSync(resolve(root, surface), "utf8");
    const lines = text.split("\n");

    lines.forEach((line, index) => {
      const where = `${surface}:${index + 1}`;
      const selector = owningSelector(lines, index);
      const exemptOrDef = isTokenDefinitionOrComment(line);

      // Colour must run --tcrn-color-* tokens; a raw hex in a rule is drift (E2/E7).
      if (!exemptOrDef) {
        const hex = /#[0-9a-fA-F]{3,8}\b/.exec(line);
        if (hex) findings.hexLiterals.push({ where, selector, value: hex[0] });
      }

      // Type runs the --tcrn-type-size-* scale; a literal needs a type-scale-exempt tag (E3/E7).
      const fontSize = /font-size:\s*(\d+)px\b/.exec(line);
      if (fontSize && !/type-scale-exempt/.test(line)) {
        findings.fontSizeLiterals.push({ where, selector, value: `${fontSize[1]}px` });
      }

      // Pill radius is --tcrn-radius-pill; a bare 999px is drift (E4/E7).
      if (!exemptOrDef && /\b999px\b/.test(line)) {
        findings.pillLiterals.push({ where, selector, value: "999px" });
      }

      // Gap/padding values live on the spacing scale. A px literal outside clamp()/calc()
      // that is not a scale value is drift (E4/E7). clamp/calc bounds are fluid, exempt.
      const spacing = /(?:^|[^-\w])(gap|row-gap|column-gap|padding|padding-top|padding-bottom|padding-left|padding-right|padding-block|padding-inline)\s*:\s*([^;{}]+)/.exec(line);
      // A fluid value (clamp/calc/min/max) carries intentional non-scale bounds, so its
      // px literals are exempt; a plain gap/padding must land on the spacing scale.
      if (spacing && !/(?:clamp|calc|min|max)\(/.test(spacing[2])) {
        for (const m of spacing[2].matchAll(/(\d+)px\b/g)) {
          if (!SPACING_SCALE_PX.has(Number(m[1]))) {
            findings.spacingLiterals.push({ where, selector, value: `${m[1]}px` });
          }
        }
      }

      if (/(linear|radial|conic)-gradient\(/.test(line)) {
        const functional = FUNCTIONAL_GRADIENT_SELECTORS.some((allowed) => selector.includes(allowed));
        if (!functional) findings.decorativeGradients.push({ where, selector });
      }

      const radius = /border-radius:\s*([^;]+);/.exec(line);
      if (radius) {
        const value = radius[1].trim();
        const tokenised = value.includes("var(--tcrn-");
        const allowed = ALLOWED_RADIUS_LITERALS.includes(value);
        if (!tokenised && !allowed) findings.radiusLiterals.push({ where, selector, value });
      }
    });
  }

  // Soft-cloud elevation (TCRN-DS-SUB-050, STORY-121 GWT4): the blur ceiling covers the three
  // docs surfaces, every package stylesheet segment (componentCssModules) and the token
  // table, read per shadow layer. The old per-line pattern read only the docs surfaces and
  // took the fourth length of `inset 0 0 0 5px` for a blur. Package segments are reported as
  // module path plus the line inside the joined segment text.
  for (const surface of SURFACES) {
    const css = docSurfaceCss(surface, readFileSync(resolve(root, surface), "utf8"));
    findings.softCloudShadows.push(...shadowBlurFindings(css, surface));
  }
  for (const { path, css } of componentCssModules(root)) {
    findings.softCloudShadows.push(...shadowBlurFindings(css, `${path} (segments)`));
  }
  findings.softCloudShadows.push(...shadowBlurFindings(readFileSync(resolve(root, TOKEN_TABLE), "utf8"), TOKEN_TABLE));

  // C10 shell geometry literals (TCRN-DS-SUB-142): every shell module, its segments joined.
  for (const { path, css } of shellGeometryModules()) {
    findings.shellGeometryLiterals.push(...shellGeometryLiteralFindings(css, `${path} (segments)`));
  }

  // A blanket `* { transition-duration: <n> !important }` inside a reduced-motion block
  // is the v1 kill switch: it collapses the v2 comprehension cue (opacity/colour at a
  // real duration) that reduced motion is meant to keep. Loop/animation clamps are fine.
  for (const surface of SURFACES) {
    const text = readFileSync(resolve(root, surface), "utf8");
    const blockRe = /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{/g;
    let match;
    while ((match = blockRe.exec(text)) !== null) {
      let depth = 1;
      let i = match.index + match[0].length;
      const start = i;
      while (i < text.length && depth > 0) {
        if (text[i] === "{") depth += 1;
        else if (text[i] === "}") depth -= 1;
        i += 1;
      }
      const body = text.slice(start, i - 1);
      if (/\*\s*,\s*\*::before[\s\S]*?transition-duration:[^;]*!important/.test(body)
        || /\*\s*\{[^}]*transition-duration:[^;]*!important/.test(body)) {
        const line = text.slice(0, match.index).split("\n").length;
        findings.reducedMotionKillSwitches.push({ where: `${surface}:${line}`, selector: "* (reduced-motion block)" });
      }
    }
  }

  // The docs stylesheets must not re-implement component styles the package owns
  // (INIT-006 E1 / INIT-007 E12): a rule whose KEY SUBJECT is a package class, present in
  // either doc stylesheet AND in the package component CSS, is a parallel implementation
  // waiting to drift — no matter its selector shape (dark-scope, descendant, attribute,
  // compound). Both doc surfaces are read here; the whitelist admits only the demo-scoped
  // overrides documented in docs/style-scale.md.
  const packageSubjects = new Set();
  for (const { css } of componentCssModules(root)) {
    for (const c of ruleSubjectClasses(css)) packageSubjects.add(c);
  }
  for (const docsSurface of DUPLICATE_DOCS_SURFACES) {
    const docsSubjects = ruleSubjectClasses(readFileSync(resolve(root, docsSurface), "utf8"));
    for (const selector of docsSubjects) {
      if (packageSubjects.has(selector) && !DUPLICATE_SELECTOR_WHITELIST.has(selector)) {
        findings.duplicateSelectors.push({ where: `${docsSurface} ∩ componentCss`, selector });
      }
    }
  }

  // Rule-level guard (TCRN-DS-SUB-065): package-class subjects in the three docs sources
  // declare placement only, apart from the registered exceptions.
  const usedExceptions = new Set();
  for (const surface of SURFACES) {
    const css = guardSurfaceCss(surface, readFileSync(resolve(root, surface), "utf8"));
    findings.packageClassAppearance.push(...packageClassAppearanceFindings(css, surface, DOC_PACKAGE_CLASS_EXCEPTIONS, usedExceptions));
  }
  for (const entry of DOC_PACKAGE_CLASS_EXCEPTIONS) {
    if (!usedExceptions.has(entry.id)) findings.docExceptionsUnused.push({ where: "scripts/shell-fidelity-proof.mjs", selector: entry.id });
  }

  return findings;
}

export function fidelityRejectChecks() {
  const findings = scanShellFidelity();
  return {
    decorativeGradientsOrOrbs: findings.decorativeGradients.length > 0,
    radiusDriftAboveContract: findings.radiusLiterals.length > 0,
    softCloudElevation: findings.softCloudShadows.length > 0,
    reducedMotionKillSwitch: findings.reducedMotionKillSwitches.length > 0,
    hexColourLiteral: findings.hexLiterals.length > 0,
    fontSizeLiteralOffScale: findings.fontSizeLiterals.length > 0,
    spacingLiteralOffScale: findings.spacingLiterals.length > 0,
    pillRadiusLiteral: findings.pillLiterals.length > 0,
    shellGeometryLiteral: findings.shellGeometryLiterals.length > 0,
    // The rule-level guard (TCRN-DS-SUB-065) reports under the same check.
    docsPackageSelectorDuplication: findings.duplicateSelectors.length > 0 || findings.packageClassAppearance.length > 0,
    findings
  };
}

// Durable red-proof for the detector itself. INIT-003 recorded a detector that went
// silently green ("我自己的检测器也曾假绿"); an expanded gate is only trustworthy if it
// proves, on every run, that it still catches the shapes it was widened to see. These
// synthetic fixtures run the real `ruleSubjectClasses` and assert the dark-scope,
// descendant, attribute and compound shapes are caught as package-class duplicates — and
// that a package class used only as ancestor CONTEXT (subject `.demo-child`) is NOT. If
// any regresses, the process exits non-zero before the real scan can report a false green.
export function assertDetectorShapes() {
  const pkg = ruleSubjectClasses(".tcrn-button--primary{}\n.tcrn-nav-item{}\n.tcrn-widget{}");
  const cases = [
    ['[data-tcrn-theme="dark"] .tcrn-button--primary{}', ".tcrn-button--primary", true],
    ['.tcrn-doc-nav-component-preview .tcrn-nav-item{}', ".tcrn-nav-item", true],
    ['.tcrn-nav-item[data-selected="true"]{}', ".tcrn-nav-item", true],
    ['.tcrn-widget.tcrn-nav-item{}', ".tcrn-nav-item", true],
    ['.tcrn-nav-item .demo-child{}', ".tcrn-nav-item", false] // ancestor-only, must NOT flag
  ];
  for (const [css, cls, expect] of cases) {
    const hit = ruleSubjectClasses(css).has(cls) && pkg.has(cls);
    if (hit !== expect) {
      console.error(`shell-fidelity detector self-test FAILED: ${css} (expected subject ${cls} ${expect ? "caught" : "ignored"})`);
      process.exit(1);
    }
  }

  // Soft-cloud mutations (TCRN-DS-SUB-050) on a copy of a real package segment: a blurred
  // cloud is one new finding, also when it follows a var() layer in a pair edge list, and a
  // spread-only inset ring adds none.
  const segment = componentCssModules(root).find(({ css }) => css.trim()).css;
  const baseline = shadowBlurFindings(segment, "self-test").length;
  const shadowCases = [
    [".tcrn-detector-probe{box-shadow:0 8px 24px rgba(22, 21, 15, 0.2)}", 1],
    [".tcrn-detector-probe{--tcrn-pair-edge-f:var(--tcrn-focus-ring),0 8px 24px rgba(22, 21, 15, 0.2)}", 1],
    [".tcrn-detector-probe{box-shadow:inset 0 0 0 5px var(--tcrn-color-acc)}", 0]
  ];
  for (const [probe, added] of shadowCases) {
    const found = shadowBlurFindings(`${segment}\n${probe}`, "self-test").length - baseline;
    if (found !== added) {
      console.error(`shell-fidelity soft-cloud self-test FAILED: ${probe} (expected ${added} new finding(s), got ${found})`);
      process.exit(1);
    }
  }

  // Rule-level guard mutations (TCRN-DS-SUB-065) on a copy of the real story-demo-styles.ts
  // CSS: a package-class subject that repaints is one new finding (also under a dark scope and
  // a state); placement only, or a package class used as ancestor context, adds none.
  const docCss = guardSurfaceCss("apps/storybook/src/story-demo-styles.ts", readFileSync(resolve(root, "apps/storybook/src/story-demo-styles.ts"), "utf8"));
  const docBaseline = packageClassAppearanceFindings(docCss, "self-test").length;
  const guardCases = [
    [".tcrn-doc-x .tcrn-button{background:red}", 1],
    ['[data-tcrn-theme="dark"] .tcrn-doc-x .tcrn-button--primary:hover{color:red}', 1],
    [".tcrn-doc-x .tcrn-button{--tcrn-pair-fill:red}", 1],
    [".tcrn-doc-x .tcrn-button{grid-area:a;order:2;margin:0 auto;justify-self:end;flex:1 1 auto;width:100%;white-space:nowrap}", 0],
    [".tcrn-button .tcrn-doc-x{background:red}", 0],
    // A C7 single-line carrier (roles.json singleLine) taken back to wrapping is a finding
    // (TCRN-DS-SUB-102); placement on it, and wrapping on a non-carrier, stay allowed.
    [".tcrn-doc-x .tcrn-button__label{white-space:normal;overflow-wrap:anywhere}", 1],
    [".tcrn-doc-x .tcrn-button__label{word-break:break-all}", 1],
    [".tcrn-doc-x .tcrn-button__label{margin-inline-start:4px;max-width:100%}", 0]
  ];
  if (!SINGLE_LINE_CARRIER_CLASSES.has("tcrn-button__label")) {
    console.error("shell-fidelity rule-level guard self-test FAILED: docs/contract/roles.json singleLine no longer lists tcrn-button__label");
    process.exit(1);
  }
  for (const [probe, added] of guardCases) {
    const found = packageClassAppearanceFindings(`${docCss}\n${probe}`, "self-test").length - docBaseline;
    if (found !== added) {
      console.error(`shell-fidelity rule-level guard self-test FAILED: ${probe} (expected ${added} new finding(s), got ${found})`);
      process.exit(1);
    }
  }
  // C10 shell geometry mutations (TCRN-DS-SUB-142) on a copy of the real shell.css.ts segments: a
  // 196px length in a geometry declaration is one new finding, also as a custom property and as
  // the old component-layer coarse-pointer root; calc(), a 1px line and a type size add none.
  const shellCss = shellGeometryModules().find(({ path }) => path.endsWith("/shell.css.ts")).css;
  const shellBaseline = shellGeometryLiteralFindings(shellCss, "self-test").length;
  const geometryCases = [
    [".tcrn-shell-detector-probe{inline-size:196px}", 1],
    [".tcrn-shell-detector-probe{gap:196px;padding:0 196px}", 2],
    [".tcrn-shell-detector-probe{--tcrn-shell-drop-w:196px}", 1],
    ["@media (pointer: coarse){:root{--tcrn-shell-row-h:44px}}", 1],
    [".tcrn-shell-detector-probe{inset-inline-start:calc(100% - 196px)}", 0],
    [".tcrn-shell-detector-probe{border-block-start:1px solid var(--tcrn-color-line);inline-size:var(--tcrn-shell-drop-w)}", 0],
    [".tcrn-shell-detector-probe{font-size:12.5px}", 0]
  ];
  for (const [probe, added] of geometryCases) {
    const found = shellGeometryLiteralFindings(`${shellCss}\n${probe}`, "self-test").length - shellBaseline;
    if (found !== added) {
      console.error(`shell-fidelity C10 geometry self-test FAILED: ${probe} (expected ${added} new finding(s), got ${found})`);
      process.exit(1);
    }
  }

  // An exception admits only its own selector and properties.
  const probeExceptions = [{ id: "self-test", selectors: [".tcrn-doc-x .tcrn-tooltip__content"], properties: ["opacity"] }];
  const admitted = packageClassAppearanceFindings(".tcrn-doc-x .tcrn-tooltip__content{opacity:1}", "self-test", probeExceptions);
  const partly = packageClassAppearanceFindings(".tcrn-doc-x .tcrn-tooltip__content{opacity:1;color:red}", "self-test", probeExceptions);
  const otherSelector = packageClassAppearanceFindings(".tcrn-doc-y .tcrn-tooltip__content{opacity:1}", "self-test", probeExceptions);
  if (admitted.length !== 0 || partly.length !== 1 || partly[0].value !== "color" || otherSelector.length !== 1) {
    console.error("shell-fidelity rule-level guard self-test FAILED: exception scoping");
    process.exit(1);
  }
}

// pathToFileURL, not string concatenation: this repository lives under a path with a
// space in it, so `file://${argv[1]}` never matches the percent-encoded import.meta.url
// and the entry point silently does nothing.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  // Prove the detector still sees the expanded shapes before trusting the real scan.
  assertDetectorShapes();
  const { findings, ...checks } = fidelityRejectChecks();
  const failing = Object.entries(checks).filter(([, tripped]) => tripped);
  for (const [name, list] of Object.entries(findings)) {
    console.log(`\n${name}: ${list.length}`);
    for (const item of list.slice(0, 12)) {
      console.log(`  ${relative(root, resolve(root, item.where))}  ${item.selector}${item.value ? `  ${item.value}` : ""}${item.blur ? `  blur=${item.blur}px` : ""}`);
    }
    if (list.length > 12) console.log(`  … and ${list.length - 12} more`);
  }
  console.log(`\nunchecked (explicitly not claimed): ${Object.keys(UNCHECKED_CLAIMS).join(", ")}`);
  if (failing.length > 0) {
    console.error(`\nSHELL FIDELITY DRIFT: ${failing.map(([name]) => name).join(", ")}`);
    process.exit(1);
  }
  console.log("\nshell fidelity: no drift");
}
