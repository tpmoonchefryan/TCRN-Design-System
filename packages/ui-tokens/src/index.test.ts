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
  tcrnGplusThemeSelectors,
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

test("G+ colour and outline tokens come from the generated contract file", () => {
  for (const token of tcrnGplusThemedTokens) {
    assert.equal(light[token.cssVar], token.light, `${token.cssVar} light value`);
    assert.equal(dark[token.cssVar], token.dark, `${token.cssVar} night value`);
    assert.equal(tcrnTokens.find((candidate) => candidate.variable === token.cssVar)?.scope, "theme", `${token.cssVar} is theme-scoped`);
  }
  for (const token of [...tcrnGplusFixedTokens, ...tcrnGplusBrandTokens]) assert.equal(light[token.cssVar], token.value, `${token.cssVar} value`);
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

  // The light theme block is one selector list, so a [data-tcrn-theme="light"] subtree inside a
  // dark page re-declares the light values; the dark block comes after it (TCRN-DS-SUB-047).
  assert.equal(tcrnGplusThemeSelectors.light, ':root, [data-tcrn-theme="light"]');
  assert.equal(tcrnGplusThemeSelectors.dark, '[data-tcrn-theme="dark"]');
  const blocks = parseTokenCssBlocks(tcrnTokenStylesheet);
  assert.deepEqual(blocks.map((block) => [block.selector, block.kind]), [
    [':root, [data-tcrn-theme="light"]', "theme"],
    [":root", "theme-independent"],
    ['[data-tcrn-theme="dark"]', "theme"]
  ]);
  assert.ok(tcrnTokenCss.startsWith(':root, [data-tcrn-theme="light"] {\n  /* tcrn-token-block: theme */\n'));
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

test("the light theme block is read as a selector list in any order and spacing; a lone :root is not it", () => {
  const opening = ':root, [data-tcrn-theme="light"] {\n';
  assert.ok(tcrnTokenCss.includes(opening));
  // The same list, reordered and spread over two lines, is still the light theme block.
  const reordered = tcrnTokenCss.replace(opening, '[data-tcrn-theme="light"],\n  :root {\n');
  assert.notEqual(reordered, tcrnTokenCss);
  assert.equal(parseTokenCssBlocks(reordered)[0].selector, '[data-tcrn-theme="light"], :root');
  const comparison = compareTokenThemeBlocks(reordered);
  assert.equal(comparison.ok, true, comparison.problems.join("; "));
  assert.deepEqual([...comparison.light], [...compareTokenThemeBlocks(tcrnTokenCss).light]);
  // Without the light member the block no longer covers a light subtree of a dark page: red.
  const rootOnly = compareTokenThemeBlocks(tcrnTokenCss.replace(opening, ":root {\n"));
  assert.equal(rootOnly.ok, false);
  assert.match(rootOnly.problems.join("; "), /expected one :root, \[data-tcrn-theme="light"\] theme block, found 0/);
  // A list that adds a third selector is a different block, not the light theme block.
  const widened = compareTokenThemeBlocks(tcrnTokenCss.replace(opening, ':root, [data-tcrn-theme="light"], .extra {\n'));
  assert.equal(widened.ok, false);
});

test("pre-G+ names stay as deprecated aliases that resolve to the G+ values and print deprecation notices", () => {
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
  // press-scale keeps its definition, marked deprecated with no successor.
  assert.equal(light["--tcrn-motion-press-scale"], "0.97");
  assert.deepEqual(
    tcrnDeprecatedTokens.find((token) => token.variable === "--tcrn-motion-press-scale")?.replacement,
    null
  );
  assert.equal("--tcrn-motion-press-scale" in tcrnDeprecatedTokenAliases, false);

  const consumer = ".a{color:var(--tcrn-color-text-primary);border-color:var(--tcrn-color-border-control)}.b{color:var(--tcrn-color-text-primary);outline-color:var(--tcrn-color-focus-ring-calibrated)}.c{color:var(--tcrn-color-ink);transform:scale(var(--tcrn-motion-press-scale))}";
  const usages = findDeprecatedTokenUsages(consumer);
  assert.deepEqual(
    usages.map((usage) => [usage.variable, usage.replacement, usage.count]),
    [
      ["--tcrn-color-text-primary", "--tcrn-color-ink", 2],
      ["--tcrn-color-border-control", "--tcrn-color-line-ctl", 1],
      ["--tcrn-color-focus-ring-calibrated", "--tcrn-color-acc", 1],
      ["--tcrn-motion-press-scale", null, 1]
    ]
  );
  const notices = formatDeprecatedTokenNotices(usages);
  assert.equal(notices[0], "deprecated token --tcrn-color-text-primary (2 uses): use --tcrn-color-ink");
  assert.match(notices[3], /no G\+ successor/);
  assert.deepEqual(findDeprecatedTokenUsages(".c{color:var(--tcrn-color-ink);box-shadow:var(--tcrn-focus-ring)}"), []);
});

test("typography, shape, shadow and motion tokens follow the G+ scale", () => {
  // Families: the bundled faces first, with the Noto CJK fallbacks.
  assert.equal(light["--tcrn-type-family-ui"], tcrnGplusFixedTokens.find((token) => token.key === "sans")?.value);
  assert.match(light["--tcrn-type-family-ui"], /^"Hanken Grotesk","Noto Sans SC",/);
  assert.match(light["--tcrn-type-family-heading"], /^"Source Serif 4","Noto Serif SC",/);
  assert.equal(light["--tcrn-type-family-heading"], light["--tcrn-type-family-serif"]);
  assert.equal(light["--tcrn-type-family-mono"], tcrnGplusFixedTokens.find((token) => token.key === "mono")?.value);
  assert.match(light["--tcrn-type-family-mono"], /^"IBM Plex Mono","Noto Sans SC",/, "monospace Chinese text falls back to the bundled Noto Sans SC");
  assert.notEqual(light["--tcrn-type-family-heading"], light["--tcrn-type-family-stamp"], "headings do not borrow the stamp face");
  assert.doesNotMatch(light["--tcrn-type-family-heading"], /--tcrn-type-family-stamp/);
  assert.equal(resolvedLight["--tcrn-type-family-zh-cn"], light["--tcrn-type-family-ui"], "Chinese UI text falls back to the bundled Noto Sans SC");

  // Size / line pairs from contract/typography.json (13/20, 14/22, 12/16, 11/16; 36/40, 26/30, 20/26).
  const size = (name: string) => typography.text.sizes.find((entry: { name: string }) => entry.name === name);
  const pairs: Array<[string, string, { size: number; line: number }]> = [
    ["--tcrn-type-size-ui", "--tcrn-type-line-ui", typography.text.base],
    ["--tcrn-type-size-body", "--tcrn-type-line-body", size("body")],
    ["--tcrn-type-size-reading", "--tcrn-type-line-reading", size("reading")],
    ["--tcrn-type-size-meta", "--tcrn-type-line-meta", size("meta")],
    ["--tcrn-type-size-caption", "--tcrn-type-line-caption", size("caption")],
    ["--tcrn-type-size-page", "--tcrn-type-line-page", typography.headings[0]],
    ["--tcrn-type-size-heading-2", "--tcrn-type-line-heading-2", typography.headings[1]],
    ["--tcrn-type-size-section", "--tcrn-type-line-section", typography.headings[2]],
    ["--tcrn-type-size-heading-3", "--tcrn-type-line-heading-3", typography.headings[2]]
  ];
  for (const [sizeVar, lineVar, expected] of pairs) {
    assert.equal(light[sizeVar], px(expected.size), sizeVar);
    assert.equal(light[lineVar], px(expected.line), lineVar);
  }
  assert.deepEqual(
    [light["--tcrn-type-size-ui"], light["--tcrn-type-size-reading"], light["--tcrn-type-size-meta"], light["--tcrn-type-size-caption"], light["--tcrn-type-size-page"], light["--tcrn-type-size-heading-2"], light["--tcrn-type-size-heading-3"]],
    ["13px", "14px", "12px", "11px", "36px", "26px", "20px"]
  );
  // Weights: 500 and 600 are separate steps; G+ has no 700.
  assert.equal(light["--tcrn-type-weight-regular"], "400");
  assert.equal(light["--tcrn-type-weight-medium"], String(typography.caps.weight));
  assert.equal(light["--tcrn-type-weight-medium"], "500");
  assert.equal(light["--tcrn-type-weight-semibold"], String(typography.headings[3].weight));
  assert.equal(light["--tcrn-type-weight-semibold"], "600");
  assert.equal(light["--tcrn-type-weight-strong"], String(typography.text.tones.find((tone: { name: string }) => tone.name === "strong").weight));
  assert.equal(light["--tcrn-type-weight-light"], String(typography.numeral.weight));
  assert.equal(light["--tcrn-type-tracking-caps"], typography.caps.tracking);
  assert.equal(light["--tcrn-type-numeric-tabular"], typography.numeral.numeric);
  assert.match(light["--tcrn-type-numeric-tabular"], /tabular-nums/);

  // Shape: 8 / 12 / 3, and the panel and surface silhouettes stay one value.
  assert.equal(light["--tcrn-radius-control"], "8px");
  assert.equal(light["--tcrn-radius-panel"], "12px");
  assert.equal(light["--tcrn-radius-stamp"], "3px");
  assert.equal(light["--tcrn-radius-surface"], light["--tcrn-radius-panel"]);

  // Shadows: no layer of s1/s2/s3 blurs more than 3px, in either theme.
  const blurs = (shadow: string): number[] =>
    shadow.split(/,(?![^(]*\))/).map((layer) => {
      const lengths = layer.replace(/rgba?\([^)]*\)|inset/g, "").trim().split(/\s+/);
      return Number.parseFloat(lengths[2] ?? "0");
    });
  for (const variable of ["--tcrn-shadow-s1", "--tcrn-shadow-s2", "--tcrn-shadow-s3"]) {
    for (const [theme, value] of [["light", light[variable]], ["dark", dark[variable]]]) {
      assert.ok(value, `${variable} ${theme}`);
      assert.ok(Math.max(...blurs(value)) <= 3, `${variable} ${theme} blurs at most 3px: ${value}`);
    }
  }
  assert.equal(resolvedLight["--tcrn-elevation-floating"], light["--tcrn-shadow-s3"]);

  // Motion: one ease, 240ms movement, 120ms fill, 80ms press.
  assert.equal(light["--tcrn-motion-ease"], "cubic-bezier(.22,1,.36,1)");
  assert.equal(light["--tcrn-motion-duration-move"], "240ms");
  assert.equal(light["--tcrn-motion-duration-fill"], "120ms");
  assert.equal(light["--tcrn-motion-duration-press"], "80ms");
  assert.equal(light["--tcrn-motion-standard"], "240ms cubic-bezier(.22,1,.36,1)");
  assert.equal(light["--tcrn-motion-emphasis"], "240ms cubic-bezier(.22,1,.36,1)");
  assert.equal(light["--tcrn-motion-fast"], "120ms cubic-bezier(.22,1,.36,1)");
  assert.equal(light["--tcrn-motion-instant"], "80ms cubic-bezier(.22,1,.36,1)");
  assert.equal(light["--tcrn-selection-glide"], "240ms cubic-bezier(.22,1,.36,1)");
  assert.equal(light["--tcrn-motion-loading-loop"], "900ms linear");
  assert.equal(resolvedLight["--tcrn-motion-ease-out"], "cubic-bezier(.22,1,.36,1)");
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
