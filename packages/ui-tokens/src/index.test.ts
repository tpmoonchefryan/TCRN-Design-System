import test from "node:test";
import assert from "node:assert/strict";
import {
  createCssVariables,
  createThemeCssVariables,
  createTokenMap,
  tcrnDarkThemeTokens,
  tcrnThemeModes,
  tcrnTokenCss,
  tcrnTokens
} from "./index.js";

test("tokens expose canonical CSS variables", () => {
  assert.ok(tcrnTokens.length >= 25);
  assert.equal(new Set(tcrnTokens.map((token) => token.variable)).size, tcrnTokens.length);
  // Visual language v2 (TCRN-DS-INIT-001, direction A+B): the brand accent is the
  // purified teal, and the former iris-blue is gone from the palette entirely.
  assert.equal(createTokenMap()["--tcrn-color-brand-primary"], "#17707f");
  assert.equal(createTokenMap()["--tcrn-color-brand-secondary"], "#2a6b76");
  assert.equal(createTokenMap()["--tcrn-color-brand-accent"], "#93332a");
  assert.equal(createTokenMap()["--tcrn-color-text-tertiary"], "#73757c");
  assert.equal(createTokenMap()["--tcrn-color-border-control"], "#8e8e88");
  for (const value of Object.values(createTokenMap())) {
    assert.doesNotMatch(value, /#5865d8|#c96a7e|#eef0ff|#fcebf0/i, "v1 iris/rose palette must not survive");
  }
  assert.equal(createTokenMap()["--tcrn-color-neutral-calibration-canvas"], "#f5f5f5");
  assert.equal(createTokenMap()["--tcrn-color-neutral-calibration-panel"], "#fcfcfc");
  assert.equal(createTokenMap()["--tcrn-color-focus-ring-calibrated"], "#0056a4");
  assert.equal(createTokenMap()["--tcrn-color-progress-fill-end-calibrated"], "#6363c6");
  assert.equal(createTokenMap()["--tcrn-color-state-warning-calibrated-bg"], "#fde1a7");
  assert.equal(createTokenMap()["--tcrn-color-state-danger-calibrated-bg"], "#ffd1ca");
  assert.match(createTokenMap()["--tcrn-type-family-distributable-latin"], /Inter/);
  assert.match(createTokenMap()["--tcrn-type-family-distributable-zh-cn"], /Noto Sans CJK SC/);
  assert.match(createTokenMap()["--tcrn-type-family-distributable-ja"], /Noto Sans CJK JP/);
  assert.match(createTokenMap()["--tcrn-type-family-distributable-ko"], /Noto Sans CJK KR/);
  assert.match(createTokenMap()["--tcrn-type-family-distributable-mono"], /Liberation Mono/);
  assert.match(createTokenMap()["--tcrn-type-family-zh-cn"], /PingFang SC/);
  assert.match(createTokenMap()["--tcrn-type-family-ja"], /Hiragino Sans/);
  assert.match(createTokenMap()["--tcrn-type-family-ko"], /Apple SD Gothic Neo/);
  assert.equal(createTokenMap()["--tcrn-motion-loading-loop"], "900ms linear");
  assert.equal(createTokenMap()["--tcrn-motion-skeleton-loop"], "1400ms ease-in-out");
  assert.equal(createTokenMap()["--tcrn-motion-progress-loop"], "1200ms ease-in-out");
  assert.equal(createTokenMap()["--tcrn-motion-reduced-duration"], "0.01ms");
  // Motion v2: reduced motion removes travel but keeps comprehension cues alive.
  assert.equal(createTokenMap()["--tcrn-motion-comprehension"], "160ms linear");
  assert.equal(createTokenMap()["--tcrn-motion-press-scale"], "0.97");
  assert.match(createTokenMap()["--tcrn-motion-ease-out"], /cubic-bezier/);
  assert.doesNotMatch(createTokenMap()["--tcrn-motion-standard"], /ease$/, "built-in easings are too weak for UI motion");
  assert.equal(createTokenMap()["--tcrn-density-compact-row-height"], "36px");
  assert.equal(createTokenMap()["--tcrn-type-size-ui"], "13px");
  assert.equal(createTokenMap()["--tcrn-type-size-reading"], "14px");
  assert.equal(createTokenMap()["--tcrn-type-line-reading"], "1.45");
  assert.match(createTokenMap()["--tcrn-text-body-dense"], /--tcrn-type-size-ui/);
  assert.match(createTokenMap()["--tcrn-text-body-reading"], /--tcrn-type-size-reading/);
  assert.match(tcrnTokenCss, /--tcrn-type-size-ui: 13px/);
  assert.match(tcrnTokenCss, /--tcrn-type-size-reading: 14px/);
  assert.match(tcrnTokenCss, /\[data-tcrn-theme="dark"\]/);
});

test("css variable output is deterministic", () => {
  assert.equal(createCssVariables(), createCssVariables([...tcrnTokens]));
  assert.equal(createThemeCssVariables("dark"), createThemeCssVariables("dark"));
});

test("internal-alpha proof tokens cover state, focus, overlay, and density contracts", () => {
  const names = new Set<string>(tcrnTokens.map((token) => token.name));
  for (const name of [
    "color.state.ready",
    "color.state.warning.bg",
    "color.state.warning.calibrated.bg",
    "color.state.danger.calibrated.bg",
    "color.state.blocked.bg",
    "color.focus.ring",
    "color.focus.ring.calibrated",
    "color.progress.track.calibrated",
    "color.progress.fill.start.calibrated",
    "color.progress.fill.end.calibrated",
    "color.neutralCalibration.canvas",
    "color.neutralCalibration.panel",
    "typography.family.distributable.latin",
    "typography.family.distributable.zhCN",
    "typography.family.distributable.ja",
    "typography.family.distributable.ko",
    "typography.family.distributable.mono",
    "typography.family.zhCN",
    "typography.family.ja",
    "typography.family.ko",
    "typography.size.reading",
    "typography.line.reading",
    "typography.role.bodyDense",
    "typography.role.bodyReading",
    "density.compact.rowHeight",
    "motion.loading.loop",
    "motion.skeleton.loop",
    "motion.progress.loop",
    "motion.reduced.duration",
    "zIndex.overlay",
    "zIndex.popover"
  ]) {
    assert.equal(names.has(name), true, `missing ${name}`);
  }
});

test("dark theme overrides only canonical token variables", () => {
  assert.deepEqual([...tcrnThemeModes], ["light", "dark"]);
  const canonicalVariables = new Set(tcrnTokens.map((token) => token.variable));
  assert.equal(new Set(tcrnDarkThemeTokens.map((token) => token.variable)).size, tcrnDarkThemeTokens.length);
  for (const token of tcrnDarkThemeTokens) {
    assert.equal(canonicalVariables.has(token.variable), true, `unknown dark token ${token.variable}`);
  }
  const darkCss = createThemeCssVariables("dark");
  assert.match(darkCss, /--tcrn-color-surface-canvas: #111214/);
  assert.match(darkCss, /--tcrn-color-neutral-calibration-canvas: #161616/);
  assert.match(darkCss, /--tcrn-color-text-primary: #ececea/);
  assert.match(darkCss, /--tcrn-color-brand-primary: #62c3d2/);
  assert.match(darkCss, /--tcrn-color-focus-ring-calibrated: #5cb3ff/);
});
