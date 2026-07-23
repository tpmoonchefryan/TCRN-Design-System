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
  "apps/storybook/src/alpha-styles.ts"
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
const COMPONENT_CSS = "packages/ui-react/src/components/Navigation/Navigation.tsx";
// Infra selectors legitimately shared between the package and the docs stylesheet.
const DUPLICATE_SELECTOR_WHITELIST = new Set([".tcrn-sr-only", ".tcrn-skip-link"]);

// A line that defines a token (`--tcrn-…: #hex/999px`) or is a comment is not drift:
// token definitions are the one place literals belong, and comments are prose.
function isTokenDefinitionOrComment(line) {
  const trimmed = line.trim();
  if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) return true;
  if (/^--tcrn-[\w-]+\s*:/.test(trimmed)) return true;
  return false;
}

// Top-level class-selector heads in a stylesheet source (for the duplicate gate).
function topLevelClassSelectors(text) {
  return new Set([...text.matchAll(/^(\.[a-z0-9_-]+(?:__[a-z0-9-]+)?(?:--[a-z0-9-]+)?)\s*[,{]/gim)].map((m) => m[1]));
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

  // The docs stylesheet must not re-implement component styles the package owns
  // (INIT-006 E1): a top-level class selector present in both storybook.css and the
  // package component CSS is a parallel implementation waiting to drift.
  const docsSelectors = topLevelClassSelectors(readFileSync(resolve(root, "apps/storybook/src/storybook.css"), "utf8"));
  const packageSelectors = topLevelClassSelectors(readFileSync(resolve(root, COMPONENT_CSS), "utf8"));
  for (const selector of docsSelectors) {
    if (packageSelectors.has(selector) && !DUPLICATE_SELECTOR_WHITELIST.has(selector)) {
      findings.duplicateSelectors.push({ where: "storybook.css ∩ componentCss", selector });
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

// pathToFileURL, not string concatenation: this repository lives under a path with a
// space in it, so `file://${argv[1]}` never matches the percent-encoded import.meta.url
// and the entry point silently does nothing.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
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
