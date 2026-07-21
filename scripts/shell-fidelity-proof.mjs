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
// drifted value.
const ALLOWED_RADIUS_LITERALS = ["50%", "999px", "9999px", "0", "inherit"];

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
  const findings = { decorativeGradients: [], radiusLiterals: [], softCloudShadows: [] };

  for (const surface of SURFACES) {
    const text = readFileSync(resolve(root, surface), "utf8");
    const lines = text.split("\n");

    lines.forEach((line, index) => {
      const where = `${surface}:${index + 1}`;
      const selector = owningSelector(lines, index);

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

  return findings;
}

export function fidelityRejectChecks() {
  const findings = scanShellFidelity();
  return {
    decorativeGradientsOrOrbs: findings.decorativeGradients.length > 0,
    radiusDriftAboveContract: findings.radiusLiterals.length > 0,
    softCloudElevation: findings.softCloudShadows.length > 0,
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
