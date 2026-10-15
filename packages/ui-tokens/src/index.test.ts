import test from "node:test";
import assert from "node:assert/strict";
import {
  compareTokenThemeBlocks,
  createCssVariables,
  createResolvedTokenMap,
  createThemeCssVariables,
  createTokenMap,
  findDeprecatedTokenUsages,
  formatDeprecatedTokenNotices,
  parseTokenCssBlocks,
  tcrnCoarsePointerMedia,
  tcrnCoarsePointerTokens,
  tcrnDarkThemeTokens,
  tcrnDeprecatedTokenAliases,
  tcrnDeprecatedTokens,
  tcrnGplusBrandTokens,
  tcrnGplusFixedTokens,
  tcrnGplusThemeSelectors,
  tcrnGplusThemedTokens,
  tcrnThemeModes,
  tcrnTokenBlockKinds,
  tcrnTokenCss,
  tcrnTokenStylesheet,
  tcrnTokens
} from "./index.js";
// The type scale tokens are not part of the package exports; index.ts reads them from here.
import { tcrnGplusTypeTokens } from "./gplus-tokens.generated.js";

const light = createTokenMap();
const dark = Object.fromEntries(tcrnDarkThemeTokens.map((token) => [token.variable, token.value]));

// The published sheet's top-level blocks by kind: the light theme block, the theme-independent
// block and the dark block; the coarse-pointer block sits in an @media rule (TCRN-DS-SUB-142).
function publishedBlocks() {
  const blocks = parseTokenCssBlocks(tcrnTokenStylesheet);
  const top = blocks.filter((block) => block.media === null);
  const fixedBlock = top.find((block) => block.kind === "theme-independent");
  const themeBlocks = top.filter((block) => block.kind === "theme");
  assert.ok(fixedBlock, "the sheet has a theme-independent block");
  assert.equal(themeBlocks.length, 2, "the sheet has the light and the dark theme block");
  return {
    fixed: new Map(fixedBlock.declarations),
    themeNames: new Set(themeBlocks.flatMap((block) => block.declarations.map(([property]) => property))),
    coarse: blocks.filter((block) => block.media !== null)
  };
}
const resolvedLight = createResolvedTokenMap("light");
const resolvedDark = createResolvedTokenMap("dark");

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
  // TCRN-DS-MIN-20261016-R6 D4 (TCRN-DS-SUB-232): the TMS suffix keeps the approved deep colour by
  // day (MIN-20261013-SHELL D2) and takes its mark's bright step #7aa0f5 by night, the value
  // MIN-20261013-SHELL D7 suggested, ruled for O-8 and INIT-015 closure S-6; so it is theme-scoped.
  // The other three suffixes keep one value and stay theme independent.
  const tmsSuffix = tcrnTokens.find((candidate) => candidate.variable === "--tcrn-brand-suffix-tms");
  assert.equal(tmsSuffix?.scope, "theme", "--tcrn-brand-suffix-tms is theme-scoped");
  assert.equal(light["--tcrn-brand-suffix-tms"], "#2c63c8", "TMS suffix, light");
  assert.equal(dark["--tcrn-brand-suffix-tms"], "#7aa0f5", "TMS suffix, night");
  assert.equal(resolvedDark["--tcrn-brand-suffix-tms"], "#7aa0f5", "TMS suffix, night: the mark's bright step");
  assert.equal(tcrnGplusBrandTokens.find((candidate) => candidate.cssVar === "--tcrn-brand-suffix-tms")?.dark, "#7aa0f5", "the contract gives the TMS suffix its night value");
  for (const product of ["design-system", "einzbern", "mana-orchestrate"]) {
    const variable = `--tcrn-brand-suffix-${product}`;
    const token = tcrnTokens.find((candidate) => candidate.variable === variable);
    assert.equal(token?.scope, "fixed", `${variable} is theme independent`);
    assert.equal(variable in dark, false, `${variable} has no night value`);
    assert.equal(tcrnGplusBrandTokens.find((candidate) => candidate.cssVar === variable)?.dark, undefined, `the contract gives ${variable} no night value`);
    assert.equal(resolvedDark[variable], resolvedLight[variable], `${variable} is the same colour in both themes`);
  }
  assert.equal(light["--tcrn-brand-suffix-design-system"], "#6577f3", "the Design System suffix is not changed");
  for (const token of tcrnGplusBrandTokens) {
    if (token.dark !== undefined) assert.equal(dark[token.cssVar], token.dark, `${token.cssVar} night value`);
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
  assert.deepEqual(blocks.map((block) => [block.selector, block.kind, block.media]), [
    [':root, [data-tcrn-theme="light"]', "theme", null],
    [":root", "theme-independent", null],
    [":root", "pointer-coarse", "(pointer: coarse)"],
    ['[data-tcrn-theme="dark"]', "theme", null]
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

  // The type scale (size, line, weight, tracking, numeric) is checked in its own test below:
  // its values come from the generated contract file, so there is no second copy here to compare.

  // Shape: 8 / 12 / 3, and the panel and surface silhouettes stay one value.
  assert.equal(light["--tcrn-radius-control"], "8px");
  assert.equal(light["--tcrn-radius-panel"], "12px");
  assert.equal(light["--tcrn-radius-stamp"], "3px");
  assert.equal(light["--tcrn-radius-surface"], light["--tcrn-radius-panel"]);

  // Shell geometry in the theme-independent block: the paper radius (O-1, TCRN-DS-SUB-090) and
  // composition one's three ProductShell sizes, retired by the top band (TCRN-DS-SUB-113): the
  // sidebar widths keep their values, the top bar height is an alias of the band height.
  const shellGeometry: Record<string, readonly [string, string, string]> = {
    "--tcrn-radius-paper": ["14px", "radius.paper", "radius"],
    "--tcrn-shell-sidebar-width": ["220px", "shell.sidebar.width", "container"],
    "--tcrn-shell-sidebar-width-collapsed": ["52px", "shell.sidebar.width.collapsed", "container"],
    "--tcrn-shell-topbar-height": ["var(--tcrn-shell-strip-h)", "shell.topbar.height", "container"]
  };
  for (const [variable, [value, name, group]] of Object.entries(shellGeometry)) {
    const token = tcrnTokens.find((candidate) => candidate.variable === variable);
    assert.equal(token?.value, value, `${variable} value`);
    assert.equal(token?.name, name, `${variable} name`);
    assert.equal(token?.group, group, `${variable} group`);
    assert.equal(token?.scope, "fixed", `${variable} is theme independent`);
    assert.ok(tcrnGplusFixedTokens.some((fixed) => fixed.cssVar === variable && fixed.value === value), `${variable} comes from the contract fixed tokens`);
  }

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

// The top-band shell's tokens, row by row from the 07b board's section F (TCRN-DS-SUB-113): the
// section F name, the contract key, the package variable and the value. This table is the
// assertion table; the values are the board's, not a second copy of the contract.
const shellTokenTable: ReadonlyArray<readonly [name: string, key: string, variable: string, value: string]> = [
  ["shell.strip-h", "shell-strip-h", "--tcrn-shell-strip-h", "52px"],
  ["shell.brand-h", "shell-brand-h", "--tcrn-shell-brand-h", "40px"],
  ["shell.brand-w", "shell-brand-w", "--tcrn-shell-brand-w", "134px"],
  ["shell.toggle", "shell-toggle", "--tcrn-shell-toggle", "20px"],
  ["shell.pin-h", "shell-pin-h", "--tcrn-shell-pin-h", "32px"],
  ["shell.pin-gap", "shell-pin-gap", "--tcrn-shell-pin-gap", "8px"],
  ["shell.pins-max", "shell-pins-max", "--tcrn-shell-pins-max", "6"],
  ["shell.menu-gap", "shell-menu-gap", "--tcrn-shell-menu-gap", "6px"],
  ["shell.panel-w-expanded", "shell-panel-w-expanded", "--tcrn-shell-panel-w-expanded", "952px"],
  ["shell.pbar-h", "shell-pbar-h", "--tcrn-shell-pbar-h", "44px"],
  ["shell.drop-w", "shell-drop-w", "--tcrn-shell-drop-w", "240px"],
  ["shell.drop-srch-h", "shell-drop-srch-h", "--tcrn-shell-drop-srch-h", "28px"],
  ["shell.cascade-gap", "shell-cascade-gap", "--tcrn-shell-cascade-gap", "4px"],
  ["shell.row-h", "shell-row-h", "--tcrn-shell-row-h", "32px"],
  ["shell.srch-h", "shell-srch-h", "--tcrn-shell-srch-h", "40px"],
  ["shell.pinb", "shell-pinb", "--tcrn-shell-pinb", "24px"],
  // Added in INIT-016 R2 (TCRN-DS-SUB-142) for the literals the shell still wrote: the mark in the
  // brand button, the touch height and the breadcrumb separator icon. They are not on the board
  // yet; the design session adds them to section F under these names.
  ["shell.mark", "shell-mark", "--tcrn-shell-mark", "22px"],
  ["shell.touch", "shell-touch", "--tcrn-shell-touch", "44px"],
  ["shell.crumb-icon", "shell-crumb-icon", "--tcrn-shell-crumb-icon", "11px"],
  // Added in INIT-016 R3 (TCRN-DS-SUB-178) for the shell's remaining literals: the small chevrons,
  // the language chevron and the mark of the first line's large lockup. Not on the board yet
  // either; the design session adds them to section F under these names.
  ["shell.chevron", "shell-chevron", "--tcrn-shell-chevron", "12px"],
  ["shell.locale-chevron", "shell-locale-chevron", "--tcrn-shell-locale-chevron", "11px"],
  ["shell.mark-lg", "shell-mark-lg", "--tcrn-shell-mark-lg", "44px"],
  ["motion.intro.fade", "intro-fade", "--tcrn-motion-intro-fade", "120ms"],
  ["motion.intro.move", "intro-move", "--tcrn-motion-intro-move", "240ms"],
  ["motion.intro.rise", "intro-rise", "--tcrn-motion-intro-rise", "100ms"],
  ["motion.intro.max", "intro-max", "--tcrn-motion-intro-max", "700ms"]
];

test("the top-band shell tokens are the 07b board's section F, one to one, plus the three R2 and three R3 additions, in the theme-independent block", () => {
  assert.equal(tcrnGplusFixedTokens.filter((token) => token.key.startsWith("shell-")).length, 22, "sixteen section F shell.* tokens, three R2 additions and three R3 additions");
  assert.equal(tcrnGplusFixedTokens.filter((token) => token.key.startsWith("intro-")).length, 4, "four motion.intro tokens");
  const { fixed: fixedBlock, themeNames } = publishedBlocks();
  for (const [name, key, variable, value] of shellTokenTable) {
    const contract = tcrnGplusFixedTokens.find((token) => token.key === key);
    assert.equal(contract?.cssVar, variable, `${key} is published as ${variable}`);
    assert.equal(contract?.value, value, `${key} contract value`);
    assert.equal(contract?.group, key.startsWith("shell-") ? "shell" : "motion", `${key} contract group`);
    const token = tcrnTokens.find((candidate) => candidate.variable === variable);
    assert.equal(token?.name, name, `${variable} keeps the section F name`);
    assert.equal(token?.value, value, `${variable} value`);
    assert.equal(token?.group, key.startsWith("shell-") ? "container" : "motion", `${variable} group`);
    assert.equal(token?.scope, "fixed", `${variable} is theme independent`);
    assert.equal(token?.deprecated, undefined, `${variable} is not deprecated`);
    // Geometry does not follow the theme: one declaration in the :root theme-independent block,
    // none in the light or the dark theme block, so both themes read the same property set.
    assert.equal(fixedBlock.get(variable), value, `${variable} sits in the theme-independent block`);
    assert.equal(themeNames.has(variable), false, `${variable} is not in a theme block`);
    assert.equal(resolvedLight[variable], value, `${variable} by day`);
    assert.equal(resolvedDark[variable], value, `${variable} at night`);
  }
  // Relations the board draws: the brand button sits (strip − brand) / 2 from the band's top, and
  // the band's midline is half its height; the intro's three phases fit under its ceiling, the
  // first on the fill duration and the second on the movement duration.
  const px = (variable: string) => Number.parseFloat(light[variable]);
  assert.equal((px("--tcrn-shell-strip-h") - px("--tcrn-shell-brand-h")) / 2, 6);
  assert.equal(px("--tcrn-shell-strip-h") / 2, 26);
  const ms = (variable: string) => Number.parseFloat(light[variable]);
  assert.equal(light["--tcrn-motion-intro-fade"], light["--tcrn-motion-duration-fill"]);
  assert.equal(light["--tcrn-motion-intro-move"], light["--tcrn-motion-duration-move"]);
  const intro = ms("--tcrn-motion-intro-fade") + ms("--tcrn-motion-intro-move") + ms("--tcrn-motion-intro-rise");
  assert.equal(intro, 460);
  assert.ok(intro <= ms("--tcrn-motion-intro-max"));
});

test("a coarse pointer points the menu row and the full menu search at the touch token, in a token-layer block after the theme-independent block", () => {
  // 07b board, section F: shell.row-h and shell.srch-h are 44 under a coarse pointer. The switch
  // is the token sheet's own block right after the theme-independent block, so it follows the
  // base values it re-points wherever a page puts the token sheet (TCRN-DS-SUB-142).
  assert.equal(tcrnCoarsePointerMedia, "(pointer: coarse)");
  assert.equal(tcrnTokenBlockKinds.coarse, "pointer-coarse");
  assert.deepEqual(
    tcrnCoarsePointerTokens.map((entry) => [entry.variable, entry.value]),
    [
      ["--tcrn-shell-row-h", "var(--tcrn-shell-touch)"],
      ["--tcrn-shell-srch-h", "var(--tcrn-shell-touch)"]
    ]
  );
  const { fixed: fixedBlock, themeNames, coarse } = publishedBlocks();
  assert.equal(coarse.length, 1, "one coarse-pointer block");
  assert.equal(coarse[0].selector, ":root");
  assert.equal(coarse[0].media, tcrnCoarsePointerMedia);
  assert.deepEqual([...coarse[0].declarations], tcrnCoarsePointerTokens.map((entry) => [entry.variable, entry.value]));
  for (const [property] of coarse[0].declarations) {
    assert.ok(fixedBlock.has(property), `${property} is re-pointed, not introduced`);
    assert.equal(themeNames.has(property), false, `${property} is not a theme name`);
  }
  assert.equal(Number.parseFloat(resolvedLight["--tcrn-shell-touch"]), 44);
  assert.equal(Number.parseFloat(resolvedDark["--tcrn-shell-touch"]), 44);
  // The text: inside @media, after the theme-independent block and before the dark block.
  const coarseText = '@media (pointer: coarse) {\n  :root {\n    /* tcrn-token-block: pointer-coarse */\n    --tcrn-shell-row-h: var(--tcrn-shell-touch);\n    --tcrn-shell-srch-h: var(--tcrn-shell-touch);\n  }\n}\n';
  const at = tcrnTokenCss.indexOf(coarseText);
  assert.ok(at > tcrnTokenCss.indexOf("/* tcrn-token-block: theme-independent */"), "after the theme-independent block");
  assert.ok(at < tcrnTokenCss.indexOf('[data-tcrn-theme="dark"] {'), "before the dark block");
  assert.equal(tcrnTokenCss.split("@media").length, 2, "the coarse-pointer block is the sheet's one @media rule");
  // A token list without the touch token gets no block that would point at nothing.
  assert.equal(createCssVariables(tcrnTokens.filter((token) => token.variable !== "--tcrn-shell-touch")).includes("@media"), false);
  // The comparison bites: the block may neither re-point a theme name nor introduce a name.
  const themed = compareTokenThemeBlocks(tcrnTokenCss.replace("    --tcrn-shell-srch-h: var(--tcrn-shell-touch);\n", "    --tcrn-shell-srch-h: var(--tcrn-shell-touch);\n    --tcrn-color-ink: #000000;\n"));
  assert.equal(themed.ok, false);
  assert.match(themed.problems.join("; "), /re-declares the theme name --tcrn-color-ink/);
  const introduced = compareTokenThemeBlocks(tcrnTokenCss.replace("    --tcrn-shell-srch-h: var(--tcrn-shell-touch);\n", "    --tcrn-shell-srch-h: var(--tcrn-shell-touch);\n    --tcrn-shell-extra: 44px;\n"));
  assert.equal(introduced.ok, false);
  assert.match(introduced.problems.join("; "), /declares --tcrn-shell-extra, which the theme-independent block does not/);
});

test("the shell tokens share their source with the 07b board CSS (shell-screen.mjs .scr.ts defaults)", async () => {
  // The board screen module (moved out of build-shell2.mjs, which imports it) exports the screen CSS
  // shared by the Shell boards; it declares the band's defaults on one `.scr.ts{…}` line. Each board
  // variable equals the contract value of its token, and so does the package value. The module only
  // reads the logo and the contract files when imported; it writes nothing.
  const screenModule = new URL("../../../docs/design/gplus-2026-10/tools/shell-screen.mjs", import.meta.url);
  const { SCREEN_CSS } = (await import(screenModule.href)) as { SCREEN_CSS?: unknown };
  assert.equal(typeof SCREEN_CSS, "string", "shell-screen.mjs exports SCREEN_CSS");
  const line = String(SCREEN_CSS)
    .split("\n")
    .find((candidate) => candidate.startsWith(".scr.ts{"));
  assert.ok(line, "shell-screen.mjs declares the .scr.ts defaults");
  const board = new Map(
    [...line.matchAll(/(--[a-z0-9-]+):([^;}]+)/g)].map((match) => [match[1], match[2].trim()] as const)
  );
  const boardToContract: Record<string, string> = {
    "--strip-h": "shell-strip-h",
    "--tab": "shell-brand-h",
    "--panel-wx": "shell-panel-w-expanded",
    "--menu-gap": "shell-menu-gap",
    "--pin-gap": "shell-pin-gap",
    "--drop-w": "shell-drop-w",
    "--cascade-gap": "shell-cascade-gap",
    "--row-h": "shell-row-h",
    "--pinb": "shell-pinb",
    "--srch-h": "shell-srch-h",
    "--paper-r": "r-paper"
  };
  for (const [boardVariable, key] of Object.entries(boardToContract)) {
    const contract = tcrnGplusFixedTokens.find((token) => token.key === key);
    assert.ok(board.has(boardVariable), `the board declares ${boardVariable}`);
    assert.equal(contract?.value, board.get(boardVariable), `${key} equals the board's ${boardVariable}`);
    assert.equal(light[contract?.cssVar ?? ""], board.get(boardVariable), `${contract?.cssVar} equals the board's ${boardVariable}`);
  }
});

test("rail-w, rail-w-collapsed and topbar-h are retired: two without a successor, one an alias of the band height", () => {
  const retired = new Map(tcrnDeprecatedTokens.map((token) => [token.variable, token] as const));
  assert.equal(retired.get("--tcrn-shell-sidebar-width")?.replacement, null);
  assert.equal(retired.get("--tcrn-shell-sidebar-width-collapsed")?.replacement, null);
  assert.equal(retired.get("--tcrn-shell-topbar-height")?.replacement, "--tcrn-shell-strip-h");
  // Only the alias has an old → new pair; the two widths keep their values and resolve as before.
  assert.equal(tcrnDeprecatedTokenAliases["--tcrn-shell-topbar-height"], "--tcrn-shell-strip-h");
  assert.equal("--tcrn-shell-sidebar-width" in tcrnDeprecatedTokenAliases, false);
  assert.equal("--tcrn-shell-sidebar-width-collapsed" in tcrnDeprecatedTokenAliases, false);
  assert.equal(light["--tcrn-shell-sidebar-width"], "220px");
  assert.equal(light["--tcrn-shell-sidebar-width-collapsed"], "52px");
  assert.equal(light["--tcrn-shell-topbar-height"], "var(--tcrn-shell-strip-h)");
  assert.equal(resolvedLight["--tcrn-shell-topbar-height"], resolvedLight["--tcrn-shell-strip-h"]);
  assert.equal(resolvedDark["--tcrn-shell-topbar-height"], resolvedDark["--tcrn-shell-strip-h"]);
  for (const variable of ["--tcrn-shell-sidebar-width", "--tcrn-shell-sidebar-width-collapsed"]) {
    assert.match(tcrnTokens.find((token) => token.variable === variable)?.description ?? "", /^Deprecated\. /);
  }
  // A consumer still reading the old names gets a notice per name.
  const notices = formatDeprecatedTokenNotices(
    findDeprecatedTokenUsages(".s{inline-size:var(--tcrn-shell-sidebar-width);block-size:var(--tcrn-shell-topbar-height)}")
  );
  assert.deepEqual(notices, [
    "deprecated token --tcrn-shell-sidebar-width (1 use): no G+ successor; plan its removal",
    "deprecated token --tcrn-shell-topbar-height (1 use): use --tcrn-shell-strip-h"
  ]);
});

test("the paper's content width for document and settings pages is one theme-independent layout token, 1040", () => {
  // MIN-20261013-SHELL D1: document and settings pages centre their content at 1040 in the paper;
  // section F has no such value, so it is the one layout token besides the shell's (TCRN-DS-SUB-130).
  const contract = tcrnGplusFixedTokens.filter((token) => token.group === "layout");
  assert.deepEqual(
    contract.map((token) => [token.key, token.cssVar, token.value]),
    [["layout-content-max-w", "--tcrn-layout-content-max-w", "1040px"]]
  );
  const token = tcrnTokens.find((candidate) => candidate.variable === "--tcrn-layout-content-max-w");
  assert.equal(token?.name, "layout.content-max-w");
  assert.equal(token?.group, "container");
  assert.equal(token?.scope, "fixed");
  assert.equal(token?.deprecated, undefined);
  assert.match(token?.description ?? "", /document and settings pages/);
  const { fixed: fixedBlock, themeNames } = publishedBlocks();
  assert.equal(fixedBlock.get("--tcrn-layout-content-max-w"), "1040px", "in the theme-independent block");
  assert.equal(themeNames.has("--tcrn-layout-content-max-w"), false, "in no theme block");
  assert.equal(resolvedLight["--tcrn-layout-content-max-w"], "1040px");
  assert.equal(resolvedDark["--tcrn-layout-content-max-w"], "1040px");
});

test("the type scale comes from the generated contract file; no scale value is written by hand", () => {
  // contract/typography.json "tokens" names every step with its variable; the generator writes
  // them into gplus-tokens.generated.ts and checks them against the scale entries that use them.
  assert.ok(tcrnGplusTypeTokens.length > 0);
  for (const name of ["family-heading", "weight-light", "weight-semibold", "tracking-caps", "numeric-tabular", "line-meta", "line-heading-2", "line-heading-3"]) {
    assert.ok(tcrnGplusTypeTokens.some((token) => token.key === name), `${name} is named in the contract`);
  }
  for (const token of tcrnGplusTypeTokens) {
    const registered = tcrnTokens.find((candidate) => candidate.variable === token.cssVar);
    assert.ok(registered, `${token.cssVar} is in the registry`);
    assert.equal(registered.value, token.value, `${token.cssVar} carries the contract value`);
    assert.equal(registered.scope, "fixed", `${token.cssVar} is theme independent`);
  }
  // Every size, line, weight, tracking and numeric step of the registry is a contract token
  // (typography.json tokens or the control sizes of tokens.json fixed).
  const contracted = new Map([...tcrnGplusFixedTokens, ...tcrnGplusTypeTokens].map((token) => [token.cssVar, token.value]));
  const steps = tcrnTokens.filter((token) => /^--tcrn-type-(?:size|line|weight|tracking|numeric)-/.test(token.variable));
  assert.ok(steps.length >= tcrnGplusTypeTokens.length - 1);
  for (const token of steps) assert.equal(contracted.get(token.variable), token.value, `${token.variable} is a contract value`);
  assert.equal(light["--tcrn-type-family-heading"], tcrnGplusFixedTokens.find((token) => token.key === "serif")?.value, "the heading family is the serif stack");
  // 500 and 600 are separate steps; G+ has no 700.
  assert.notEqual(light["--tcrn-type-weight-medium"], light["--tcrn-type-weight-semibold"]);
  for (const token of tcrnTokens.filter((candidate) => candidate.variable.startsWith("--tcrn-type-weight-"))) assert.notEqual(token.value, "700", token.variable);
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
