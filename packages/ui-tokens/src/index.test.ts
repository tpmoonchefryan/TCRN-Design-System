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
  assert.equal(createTokenMap()["--tcrn-color-brand-primary"], "#5865d8");
  assert.equal(createTokenMap()["--tcrn-color-brand-secondary"], "#2f8fa3");
  assert.equal(createTokenMap()["--tcrn-color-brand-accent"], "#c96a7e");
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
  assert.equal(createTokenMap()["--tcrn-density-compact-row-height"], "36px");
  assert.match(tcrnTokenCss, /--tcrn-type-size-ui: 13px/);
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
    "color.state.blocked.bg",
    "color.focus.ring",
    "typography.family.distributable.latin",
    "typography.family.distributable.zhCN",
    "typography.family.distributable.ja",
    "typography.family.distributable.ko",
    "typography.family.distributable.mono",
    "typography.family.zhCN",
    "typography.family.ja",
    "typography.family.ko",
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
  assert.match(darkCss, /--tcrn-color-surface-canvas: #121a2a/);
  assert.match(darkCss, /--tcrn-color-text-primary: #f2f7ff/);
  assert.match(darkCss, /--tcrn-color-brand-primary: #a7b0ff/);
});
