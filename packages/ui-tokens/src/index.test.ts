import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  compareTokenThemeBlocks,
  createCssVariables,
  createResolvedTokenMap,
  createThemeCssVariables,
  createTokenMap,
  findDeprecatedTokenUsages,
  formatDeprecatedTokenNotices,
  parseTokenCssBlocks,
  tcrnDarkThemeTokens,
  tcrnDeprecatedTokenAliases,
  tcrnDeprecatedTokens,
  tcrnGplusBrandTokens,
  tcrnGplusFixedTokens,
  tcrnGplusThemedTokens,
  tcrnThemeModes,
  tcrnTokenCss,
  tcrnTokenStylesheet,
  tcrnTokens
} from "./index.js";

// The test runs from packages/ui-tokens/dist; the design contract sits at the repository root.
const contractFile = (name: string): string => readFileSync(new URL(`../../../docs/design/gplus-2026-10/contract/${name}`, import.meta.url), "utf8");
const typography = JSON.parse(contractFile("typography.json"));

const light = createTokenMap();
const dark = Object.fromEntries(tcrnDarkThemeTokens.map((token) => [token.variable, token.value]));
const resolvedLight = createResolvedTokenMap("light");
const resolvedDark = createResolvedTokenMap("dark");
const px = (value: number): string => `${value}px`;

test("tokens expose canonical CSS variables", () => {
  assert.ok(tcrnTokens.length >= 25);
  assert.equal(new Set(tcrnTokens.map((token) => token.variable)).size, tcrnTokens.length);
  assert.equal(new Set(tcrnTokens.map((token) => token.name)).size, tcrnTokens.length, "token names are unique");
  for (const token of tcrnTokens) assert.ok(token.scope === "theme" || token.scope === "fixed", `${token.variable} has a block scope`);
  assert.equal(light["--tcrn-density-compact-row-height"], "36px");
  assert.equal(light["--tcrn-container-settings-split"], "960px");
  assert.equal(light["--tcrn-container-settings-content-stack"], "720px");
  assert.equal(light["--tcrn-container-settings-local-nav"], "208px");
  assert.equal(light["--tcrn-container-settings-control-min"], "240px");
  assert.equal(light["--tcrn-container-settings-choice-option"], "112px");
  assert.equal(light["--tcrn-container-settings-number-min"], "12ch");
  assert.equal(light["--tcrn-container-page-third-level-split"], "960px");
  assert.equal(light["--tcrn-container-page-third-level-nav"], "208px");
  assert.equal(light["--tcrn-motion-skeleton-loop"], "1400ms ease-in-out");
  assert.equal(light["--tcrn-motion-progress-loop"], "1200ms ease-in-out");
  assert.equal(light["--tcrn-motion-reduced-duration"], "0.01ms");
  // Reduced motion removes travel but keeps comprehension cues alive.
  assert.equal(light["--tcrn-motion-comprehension"], "160ms linear");
  assert.match(light["--tcrn-text-body-dense"], /--tcrn-type-size-ui/);
  assert.match(light["--tcrn-text-body-reading"], /--tcrn-type-size-reading/);
  assert.match(tcrnTokenCss, /--tcrn-type-size-ui: 13px/);
  assert.match(tcrnTokenCss, /\[data-tcrn-theme="dark"\]/);
});

test("G+ colour and outline tokens come from the generated contract file (STORY-120)", () => {
  for (const token of tcrnGplusThemedTokens) {
    assert.equal(light[token.cssVar], token.light, `${token.cssVar} light value`);
    assert.equal(dark[token.cssVar], token.dark, `${token.cssVar} night value`);
    assert.equal(tcrnTokens.find((candidate) => candidate.variable === token.cssVar)?.scope, "theme", `${token.cssVar} is theme-scoped`);
  }
  for (const token of [...tcrnGplusFixedTokens.filter((candidate) => candidate.group === "color" || candidate.group === "focus"), ...tcrnGplusBrandTokens]) assert.equal(light[token.cssVar], token.value, `${token.cssVar} value`);
  // The six tokens STORY-120 adds, plus the product suffix colours.
  for (const variable of ["--tcrn-color-line-ctl", "--tcrn-color-surface", "--tcrn-color-acc-ul", "--tcrn-color-dis", "--tcrn-color-wash", "--tcrn-color-hover"]) {
    assert.ok(variable in light, `${variable} is defined`);
  }
  for (const product of ["tms", "design-system", "einzbern", "mana-orchestrate"]) {
    const token = tcrnTokens.find((candidate) => candidate.variable === `--tcrn-brand-suffix-${product}`);
    assert.equal(token?.scope, "fixed", `--tcrn-brand-suffix-${product} is theme independent`);
  }
  // The values STORY-120 names, read through the published registry.
  const expectedLight: Record<string, string> = {
    "--tcrn-color-bg": "#efeeea",
    "--tcrn-color-ink": "#16150f",
    "--tcrn-color-ink-2": "#4f4c43",
    "--tcrn-color-ink-3": "#6b675d",
    "--tcrn-color-acc": "#0b6b65",
    "--tcrn-color-red": "#8e2d24",
    "--tcrn-color-line-ctl": "rgba(22,21,15,.47)"
  };
  const expectedDark: Record<string, string> = {
    "--tcrn-color-bg": "#121210",
    "--tcrn-color-panel": "#191916",
    "--tcrn-color-ink": "#ebe8df",
    "--tcrn-color-ink-2": "#a9a69c",
    "--tcrn-color-ink-3": "#85827a",
    "--tcrn-color-acc": "#3fc7b7",
    "--tcrn-color-line-ctl": "rgba(255,255,255,.36)"
  };
  for (const [variable, value] of Object.entries(expectedLight)) assert.equal(light[variable], value, variable);
  for (const [variable, value] of Object.entries(expectedDark)) assert.equal(dark[variable], value, variable);
  // No colour of its own: every colour token is a contract value or a reference to another token.
  const contractValues = new Set<string>([
    ...tcrnGplusThemedTokens.flatMap((token) => [token.light, token.dark]),
    ...[...tcrnGplusFixedTokens, ...tcrnGplusBrandTokens].map((token) => token.value)
  ]);
  for (const token of tcrnTokens.filter((candidate) => candidate.group === "color" || candidate.group === "brand")) {
    assert.ok(contractValues.has(token.value) || /^var\(--tcrn-[a-z0-9-]+\)$/.test(token.value), `${token.variable} carries an uncontracted colour ${token.value}`);
  }
  for (const value of Object.values(light)) {
    assert.doesNotMatch(value, /#5865d8|#c96a7e|#eef0ff|#fcebf0/i, "v1 iris/rose palette must not survive");
    assert.doesNotMatch(value, /#17707f|#1c1d21|#8a8c93|#cfcfc9|#fafaf9/i, "pre-G+ palette must not survive");
  }
  assert.equal(light["--tcrn-focus-ring"], "0 0 0 2px var(--tcrn-color-surface),0 0 0 4px var(--tcrn-color-acc)");
  assert.equal(resolvedDark["--tcrn-focus-ring"], "0 0 0 2px #121210,0 0 0 4px #3fc7b7");
});

test("theme blocks declare the same property names; theme-independent tokens sit in their own block (C5)", () => {
  const comparison = compareTokenThemeBlocks(tcrnTokenCss);
  assert.equal(comparison.ok, true, comparison.problems.join("; "));
  assert.deepEqual(comparison.lightOnly, []);
  assert.deepEqual(comparison.darkOnly, []);
  const themed = tcrnTokens.filter((token) => token.scope === "theme").map((token) => token.variable);
  assert.deepEqual([...comparison.light], themed);
  assert.deepEqual([...comparison.dark], themed);
  assert.deepEqual(tcrnDarkThemeTokens.map((token) => token.variable), themed);

  const blocks = parseTokenCssBlocks(tcrnTokenStylesheet);
  assert.deepEqual(blocks.map((block) => [block.selector, block.kind]), [
    [":root", "theme"],
    [":root", "theme-independent"],
    ['[data-tcrn-theme="dark"]', "theme"]
  ]);
  const fixedNames = new Set(blocks[1].declarations.map(([property]) => property));
  for (const token of tcrnTokens.filter((candidate) => candidate.scope === "fixed")) assert.ok(fixedNames.has(token.variable), `${token.variable} sits in the theme-independent block`);
  for (const variable of themed) assert.equal(fixedNames.has(variable), false, `${variable} is not repeated in the theme-independent block`);
  // A token that references a themed token is re-declared in the dark block so it resolves there.
  assert.equal(dark["--tcrn-color-surface"], "var(--tcrn-color-bg)");
  assert.equal(dark["--tcrn-color-text-primary"], "var(--tcrn-color-ink)");

  assert.ok(tcrnTokenStylesheet.startsWith('@import "../fonts/fonts.css";\n'), "tokens.css loads the bundled faces first");
  assert.ok(tcrnTokenStylesheet.endsWith(tcrnTokenCss));

  // The comparison bites: a name in one theme block only is reported by name.
  const darkOnly = tcrnTokenCss.replace('[data-tcrn-theme="dark"] {\n', '[data-tcrn-theme="dark"] {\n  --tcrn-color-extra: #000000;\n');
  assert.deepEqual([...compareTokenThemeBlocks(darkOnly).darkOnly], ["--tcrn-color-extra"]);
  const lightOnly = tcrnTokenCss.replace(/(\[data-tcrn-theme="dark"\] \{[\s\S]*?)\n {2}--tcrn-color-ink-3: [^\n]*/, "$1");
  assert.deepEqual([...compareTokenThemeBlocks(lightOnly).lightOnly], ["--tcrn-color-ink-3"]);
});

test("pre-G+ names stay as deprecated aliases that resolve to the G+ values (STORY-120 GWT4)", () => {
  const legacyColour = tcrnTokens.filter((token) => /^--tcrn-color-(text|border|surface|brand)-/.test(token.variable));
  assert.ok(legacyColour.length >= 20);
  for (const token of legacyColour) assert.ok(token.variable in tcrnDeprecatedTokenAliases, `${token.variable} is a deprecated alias`);
  for (const [oldName, newName] of Object.entries(tcrnDeprecatedTokenAliases)) {
    assert.equal(light[oldName], `var(${newName})`, `${oldName} points at ${newName}`);
    assert.ok(newName in light, `${newName} exists`);
    assert.equal(tcrnDeprecatedTokenAliases[newName], undefined, `${newName} is not itself deprecated`);
    assert.equal(resolvedLight[oldName], resolvedLight[newName], `${oldName} resolves like ${newName} by day`);
    assert.equal(resolvedDark[oldName], resolvedDark[newName], `${oldName} resolves like ${newName} at night`);
    const token = tcrnTokens.find((candidate) => candidate.variable === oldName);
    assert.equal(token?.deprecated?.replacement, newName);
    assert.match(token?.description ?? "", /^Deprecated alias of /);
  }
  assert.equal(tcrnDeprecatedTokenAliases["--tcrn-color-text-primary"], "--tcrn-color-ink");
  assert.equal(tcrnDeprecatedTokenAliases["--tcrn-color-border-control"], "--tcrn-color-line-ctl");
  assert.equal(tcrnDeprecatedTokenAliases["--tcrn-color-surface-canvas"], "--tcrn-color-bg");
  assert.equal(tcrnDeprecatedTokenAliases["--tcrn-color-brand-primary"], "--tcrn-color-acc");
  assert.equal(resolvedLight["--tcrn-color-text-muted"], "#6b675d");
  assert.equal(resolvedDark["--tcrn-color-brand-primary"], "#3fc7b7");
  const consumer = ".a{color:var(--tcrn-color-text-primary);border-color:var(--tcrn-color-border-control)}.b{color:var(--tcrn-color-text-primary);outline-color:var(--tcrn-color-focus-ring-calibrated)}.c{color:var(--tcrn-color-ink)}";
  const usages = findDeprecatedTokenUsages(consumer);
  assert.deepEqual(
    usages.map((usage) => [usage.variable, usage.replacement, usage.count]),
    [
      ["--tcrn-color-text-primary", "--tcrn-color-ink", 2],
      ["--tcrn-color-border-control", "--tcrn-color-line-ctl", 1],
      ["--tcrn-color-focus-ring-calibrated", "--tcrn-color-acc", 1]
    ]
  );
  const notices = formatDeprecatedTokenNotices(usages);
  assert.equal(notices[0], "deprecated token --tcrn-color-text-primary (2 uses): use --tcrn-color-ink");
  assert.deepEqual(findDeprecatedTokenUsages(".c{color:var(--tcrn-color-ink);box-shadow:var(--tcrn-focus-ring)}"), []);
});

test("css variable output is deterministic", () => {
  assert.equal(createCssVariables(), createCssVariables([...tcrnTokens]));
  assert.equal(createThemeCssVariables("dark"), createThemeCssVariables("dark"));
  assert.equal(`${createCssVariables()}${createThemeCssVariables("dark")}`, tcrnTokenCss);
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
    "container.settings.split",
    "container.settings.contentStack",
    "container.settings.localNav",
    "container.settings.controlMin",
    "container.settings.choiceOption",
    "container.settings.choicePadding",
    "container.settings.numberMin",
    "container.pageHierarchy.thirdLevelSplit",
    "container.pageHierarchy.localNav",
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
  assert.match(darkCss, /--tcrn-color-bg: #121210/);
  assert.match(darkCss, /--tcrn-color-panel: #191916/);
  assert.match(darkCss, /--tcrn-color-ink: #ebe8df/);
  assert.match(darkCss, /--tcrn-color-acc: #3fc7b7/);
  assert.match(darkCss, /--tcrn-color-surface-canvas: var\(--tcrn-color-bg\)/);
});
