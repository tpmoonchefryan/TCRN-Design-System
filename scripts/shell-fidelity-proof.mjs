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

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const SURFACES = [
  "apps/storybook/src/storybook.css",
  "apps/storybook/src/alpha-styles.ts",
  "apps/storybook/src/story-demo-styles.ts"
];

// Gradients that encode state rather than decorate a surface.
const FUNCTIONAL_GRADIENT_SELECTORS = [
  ".tcrn-loading-progress__bar",
  ".tcrn-loading-skeleton__line",
  ".tcrn-skeleton::after",
  ".tcrn-bookmark-nav--tracked"
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

// Package-truth component CSS sources. Every `tcrnComponentCss` rule currently lives in
// Navigation.tsx (the only `export const *Css` in the package), so this is a one-element
// list today — but the dup gate reads a LIST so that when a STORY-037-style relocation
// moves component families into other component sources, they stay covered without a
// further edit to this gate.
const COMPONENT_CSS_SOURCES = [
  "packages/ui-react/src/components/Navigation/Navigation.tsx"
];

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
//   1. Infra primitives the docs shell reproduces verbatim (.tcrn-sr-only, .tcrn-skip-link).
//   2. LEGITIMATE demo overrides whose STYLED SUBJECT is a package class but which are
//      demo-SCOPED (rendered only under a documented demo container) — the key-subject
//      extractor deliberately flags e.g. `.tcrn-storybook-component-example .tcrn-nav-item`
//      (key-subject `.tcrn-nav-item`), which is demo scoping, not a parallel component.
// The authoritative list of what may live doc-side is docs/style-scale.md
// § "Demo-chrome exemption list". Every entry below is a key-subject the expanded gate
// flags only because it is scoped under one of those documented demo containers
// (.tcrn-storybook-component-example, .tcrn-doc-*, .tcrn-compact-shell*,
// .tcrn-knowledge-shell*, .tcrn-nav-component-preview, .tcrn-package-nav-proof*,
// .tcrn-form-stack, the tooltip static-preview hook), or — for .tcrn-filter-bar — is
// documented there as non-duplicating (the package owns it only via the scoped
// `.tcrn-table-toolbar .tcrn-filter-bar` rule, so a top-level docs `.tcrn-filter-bar`
// shares the key-subject but not the selector).
const DUPLICATE_SELECTOR_WHITELIST = new Set([
  ".tcrn-sr-only",
  ".tcrn-skip-link",
  // Demo-scoped overrides of package classes (docs/style-scale.md exemption list):
  ".tcrn-nav-item",
  ".tcrn-nav-item__content",
  ".tcrn-nav-item__label",
  ".tcrn-nav-item__disabled-reason",
  ".tcrn-top-bar",
  ".tcrn-top-bar__actions",
  ".tcrn-top-bar__brand",
  ".tcrn-top-bar__module",
  ".tcrn-search-input",
  ".tcrn-product-switcher",
  ".tcrn-module-tabs",
  ".tcrn-segmented-nav",
  ".tcrn-field",
  ".tcrn-brand-wordmark",
  ".tcrn-brand-wordmark__base",
  ".tcrn-brand-wordmark__suffix",
  ".tcrn-product-logo__copy",
  ".tcrn-tooltip__content",
  // Doc-shell layout/collapse overrides of the brand lockup and the attached side nav
  // (scoped under .tcrn-doc-brand / .tcrn-doc-shell[collapsed] / .tcrn-knowledge-shell__brand
  // / .tcrn-package-nav-proof). The package owns their appearance; docs only position them
  // and hide the copy on collapse. Their bare re-implementations were removed in INIT-007.
  ".tcrn-side-nav",
  ".tcrn-shell-brand-lockup",
  ".tcrn-shell-brand-lockup__copy",
  ".tcrn-shell-brand-lockup__caption",
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
// (`.tcrn-storybook-component-example .tcrn-nav-item`), attribute
// (`.tcrn-nav-item[data-selected="true"]`) and compound (`.tcrn-a.tcrn-b`). Instead we
// parse every CSS rule prelude (the text before `{`) and record the class of the KEY
// SUBJECT — the rightmost compound after the final combinator (` `, `>`, `+`, `~`). That
// is the element a rule actually styles, so a package class is flagged when the rule
// styles IT, but NOT when the package class is merely ancestor CONTEXT for a demo child
// (`.tcrn-nav-item .demo-child` → subject `.demo-child`).
//
// JSX-parsing mitigation: this runs over Navigation.tsx, a .tsx file. It is safe because
// (a) the class match is dot-anchored — `\.(tcrn-…)` — and a TSX `className="tcrn-…"`
// carries no leading dot, and (b) the prelude character class `[^{}();]` resets at every
// `(` / `)` / `;`, so a leading-dot string inside a call such as `querySelector(".tcrn-x")`
// is never captured as a rule subject. Verified: parsing the whole Navigation.tsx yields
// exactly the same subject set as slicing only the `tcrnComponentCss` template body.
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
    hexLiterals: [], fontSizeLiterals: [], spacingLiterals: [], pillLiterals: [], duplicateSelectors: []
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

      // A bare `0` is legal CSS for a zero offset, so the offsets must not require a
      // unit — requiring `0px` was how this check first reported a cheerful zero while
      // `box-shadow: 0 10px 24px …` sat right there in the file.
      for (const shadow of line.matchAll(/(-?\d+)(?:px)?\s+(-?\d+)(?:px)?\s+(\d+)px/g)) {
        const blur = Number(shadow[3]);
        const isShadowContext = /box-shadow|shadow:/.test(line) || /box-shadow/.test(lines[index - 1] ?? "") || /box-shadow/.test(lines[index - 2] ?? "");
        if (isShadowContext && blur > MAX_SHADOW_BLUR_PX) {
          findings.softCloudShadows.push({ where, selector, blur });
        }
      }
    });
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
  for (const src of COMPONENT_CSS_SOURCES) {
    for (const c of ruleSubjectClasses(readFileSync(resolve(root, src), "utf8"))) packageSubjects.add(c);
  }
  for (const docsSurface of DUPLICATE_DOCS_SURFACES) {
    const docsSubjects = ruleSubjectClasses(readFileSync(resolve(root, docsSurface), "utf8"));
    for (const selector of docsSubjects) {
      if (packageSubjects.has(selector) && !DUPLICATE_SELECTOR_WHITELIST.has(selector)) {
        findings.duplicateSelectors.push({ where: `${docsSurface} ∩ componentCss`, selector });
      }
    }
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
    docsPackageSelectorDuplication: findings.duplicateSelectors.length > 0,
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
    ['.tcrn-storybook-component-example .tcrn-nav-item{}', ".tcrn-nav-item", true],
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
