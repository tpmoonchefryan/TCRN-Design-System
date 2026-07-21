// Token contrast proof — TCRN-DS-STORY-001 acceptance condition #2.
// Checks every semantic foreground/background pair the design system actually
// renders, in both themes, against WCAG 2.1 AA: 4.5:1 for text, 3:1 for UI
// boundaries and large text. Exits non-zero on any failure so it can gate a build.
import { tcrnTokens, tcrnDarkThemeTokens, createTokenMap } from "../packages/ui-tokens/dist/index.js";

const light = createTokenMap(tcrnTokens);
const dark = { ...light, ...Object.fromEntries(tcrnDarkThemeTokens.map((t) => [t.variable, t.value])) };

function srgbToLinear(c) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) throw new Error(`not a plain hex color: ${hex}`);
  const n = parseInt(m[1], 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

function ratio(fg, bg) {
  const [a, b] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}

// [foreground, background, minimum, label]
const PAIRS = [
  ["--tcrn-color-text-primary", "--tcrn-color-surface-canvas", 4.5, "primary text on canvas"],
  ["--tcrn-color-text-primary", "--tcrn-color-surface-panel", 4.5, "primary text on panel"],
  ["--tcrn-color-text-secondary", "--tcrn-color-surface-canvas", 4.5, "secondary text on canvas"],
  ["--tcrn-color-text-secondary", "--tcrn-color-surface-panel", 4.5, "secondary text on panel"],
  ["--tcrn-color-text-tertiary", "--tcrn-color-surface-panel", 4.5, "tertiary text on panel"],
  ["--tcrn-color-text-inverse", "--tcrn-color-brand-primary", 4.5, "inverse text on filled accent"],
  ["--tcrn-color-brand-primary", "--tcrn-color-surface-canvas", 4.5, "accent text on canvas"],
  ["--tcrn-color-brand-primary", "--tcrn-color-surface-panel", 4.5, "accent text on panel"],
  ["--tcrn-color-brand-accent", "--tcrn-color-surface-panel", 4.5, "stamp ink on panel"],
  ["--tcrn-color-brand-accent", "--tcrn-color-brand-accent-bg", 4.5, "stamp ink on stamp wash"],
  ["--tcrn-color-state-ready", "--tcrn-color-state-ready-bg", 4.5, "ready chip"],
  ["--tcrn-color-state-ready", "--tcrn-color-surface-panel", 4.5, "ready text on panel"],
  ["--tcrn-color-state-blocked", "--tcrn-color-state-blocked-bg", 4.5, "blocked chip"],
  ["--tcrn-color-state-blocked", "--tcrn-color-surface-panel", 4.5, "blocked text on panel"],
  ["--tcrn-color-state-warning", "--tcrn-color-state-warning-bg", 4.5, "warning chip"],
  ["--tcrn-color-state-warning", "--tcrn-color-surface-panel", 4.5, "warning text on panel"],
  // Non-text: WCAG 1.4.11 asks 3:1 of boundaries that *identify a control*.
  // `border-control` carries that duty and is checked here. `border-subtle` and
  // `border-strong` draw structural rules (table lines, panel edges) that are not
  // the sole means of identifying anything, so they are deliberately not checked
  // at 3:1 — holding decorative rules to a control threshold would force a heavy
  // border on every dense row and defeat the quiet-instrument base.
  ["--tcrn-color-border-control", "--tcrn-color-surface-panel", 3, "control boundary on panel"],
  ["--tcrn-color-border-control", "--tcrn-color-surface-canvas", 3, "control boundary on canvas"],
  ["--tcrn-color-focus-ring", "--tcrn-color-surface-canvas", 3, "focus ring on canvas"],
  ["--tcrn-color-focus-ring", "--tcrn-color-surface-panel", 3, "focus ring on panel"]
];

let failures = 0;
for (const [theme, map] of [["light", light], ["dark", dark]]) {
  console.log(`\n── ${theme} ──`);
  for (const [fgVar, bgVar, min, label] of PAIRS) {
    const fg = map[fgVar];
    const bg = map[bgVar];
    if (!fg || !bg) {
      console.log(`  MISSING  ${label}: ${!fg ? fgVar : bgVar} is undefined`);
      failures++;
      continue;
    }
    const r = ratio(fg, bg);
    const ok = r >= min;
    if (!ok) failures++;
    console.log(
      `  ${ok ? "pass" : "FAIL"}  ${r.toFixed(2)}:1 (min ${min})  ${label}  ${fg} on ${bg}`
    );
  }
}

console.log(`\n${failures === 0 ? "ALL PAIRS PASS" : `${failures} FAILING PAIR(S)`}`);
process.exit(failures === 0 ? 0 : 1);
