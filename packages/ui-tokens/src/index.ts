// Current tokens are an engineering projection of the eight pinned published Site boards.
// The source generator validates the fixed published identities and byte pins before extracting values.
import { tcrnGplusBrandTokens, tcrnGplusFixedTokens, tcrnGplusThemedTokens, tcrnGplusThemeSelectors, tcrnGplusTypeTokens } from "./gplus-tokens.generated.js";
export { tcrnGplusBrandTokens, tcrnGplusFixedTokens, tcrnGplusThemedTokens, tcrnGplusThemeSelectors } from "./gplus-tokens.generated.js";
import type { TcrnGplusBrandToken } from "./gplus-tokens.generated.js";
export type { TcrnGplusFixedToken, TcrnGplusThemedToken } from "./gplus-tokens.generated.js";
export type TokenGroup = "color"|"selection"|"typography"|"space"|"radius"|"elevation"|"motion"|"zIndex"|"container"|"texture"|"control"|"icon"|"brand";
export type TokenScope = "theme"|"fixed";
export type TokenVariable = `--tcrn-${string}`;
export interface DeprecatedTokenInfo { replacement:TokenVariable|null; note:string }
export interface DesignToken { name:string;variable:TokenVariable;value:string;group:TokenGroup;description:string;scope?:TokenScope;deprecated?:DeprecatedTokenInfo }
export type ThemeMode="light"|"dark";
export type SeasonalThemeMode="halloween";
export type AnyThemeMode=ThemeMode|SeasonalThemeMode;
export interface ThemeTokenOverride { variable:TokenVariable;value:string;description:string }
export const tcrnThemeModes=["light","dark"] as const;
export const tcrnSeasonalThemeModes=["halloween"] as const;
export const tcrnAllThemeModes=["light","dark","halloween"] as const;
export const tcrnHalloweenThemeSelector='[data-tcrn-theme="halloween"]';
export const tcrnSeasonalTokenBlockKind="seasonal-theme" as const;
interface TokenEntry { token:DesignToken; dark?:string }
function tokenGroup(variable: string): TokenGroup {
  if (variable.includes("-color-")) return "color";
  if (variable.includes("-type-")) return "typography";
  if (variable.includes("-space-")) return "space";
  if (variable.includes("-radius-")) return "radius";
  if (variable.includes("-motion-")) return "motion";
  if (variable.includes("-elevation-") || variable.includes("-focus-")) return "elevation";
  if (variable.includes("-icon-")) return "icon";
  if (variable.includes("-brand-")) return "brand";
  if (variable.includes("-control-")) return "control";
  if (variable.includes("-texture-")) return "texture";
  if (variable.includes("-z-")) return "zIndex";
  return "container";
}
function asVariable(value:string):TokenVariable { if(!value.startsWith("--tcrn-")) throw new Error(`Invalid package variable ${value}`);return value as TokenVariable; }
export const tcrnAdoptedThemedTokens = [
  {
    key: "warn-bg",
    cssVar: "--tcrn-color-warn-bg",
    group: "color",
    light: "rgba(138,90,8,.08)",
    dark: "rgba(217,171,82,.10)",
    halloween: "rgba(235,181,82,.11)",
    source: "Adopted Batch 3 token table"
  },
  {
    key: "ok-bg",
    cssVar: "--tcrn-color-ok-bg",
    group: "color",
    light: "rgba(47,107,58,.08)",
    dark: "rgba(111,207,151,.10)",
    halloween: "rgba(109,214,156,.11)",
    source: "Adopted Batch 3 token table"
  }
] as const;

export const tcrnAdoptedBrandTokens = [
  {
    key: "brand-suffix-voxward",
    cssVar: "--tcrn-brand-suffix-voxward",
    group: "brand",
    value: "#0b6b65",
    dark: "#3fc7b7",
    halloween: "#f58a33",
    source: "Adopted Batch 3 token table"
  }
] as const;

const gplusThemedEntries:TokenEntry[]=tcrnGplusThemedTokens.map(t=>({token:{name:t.key,variable:asVariable(t.cssVar),value:t.light,group:tokenGroup(t.cssVar),description:t.source??"Published 01 token table"},dark:t.dark}));
const adoptedThemedEntries:TokenEntry[]=tcrnAdoptedThemedTokens.map(t=>({token:{name:t.key,variable:asVariable(t.cssVar),value:t.light,group:tokenGroup(t.cssVar),description:t.source},dark:t.dark}));
const gplusFixedEntries:TokenEntry[]=[...tcrnGplusFixedTokens,...tcrnGplusBrandTokens,...tcrnGplusTypeTokens].map((t:TcrnGplusBrandToken)=>({token:{name:t.key,variable:asVariable(t.cssVar),value:t.value,group:tokenGroup(t.cssVar),description:t.source??"Published board value"},dark:t.dark}));
const adoptedBrandEntries:TokenEntry[]=tcrnAdoptedBrandTokens.map(t=>({token:{name:t.key,variable:asVariable(t.cssVar),value:t.value,group:t.group,description:t.source},dark:t.dark}));
const allEntries:TokenEntry[]=[...gplusThemedEntries,...adoptedThemedEntries,...gplusFixedEntries,...adoptedBrandEntries];
function referencedVariables(value: string): string[] {
  return [...value.matchAll(/var\(\s*(--[a-z0-9-]+)/g)].map((match) => match[1]);
}

// Theme scope is transitive: anything that references a themed token is themed too. A contract
// engineering binding referencing one starts out themed.
const themeScoped = new Set<string>([
  ...gplusThemedEntries,
  ...adoptedThemedEntries,
  ...gplusFixedEntries.filter((entry) => entry.dark !== undefined),
  ...adoptedBrandEntries.filter((entry) => entry.dark !== undefined)
].map((entry) => entry.token.variable));
for (let changed = true; changed; ) {
  changed = false;
  for (const { token } of allEntries) {
    if (!themeScoped.has(token.variable) && referencedVariables(token.value).some((variable) => themeScoped.has(variable))) {
      themeScoped.add(token.variable);
      changed = true;
    }
  }
}

export const tcrnTokens: readonly DesignToken[] = allEntries.map(({ token }): DesignToken => ({
  ...token,
  scope: themeScoped.has(token.variable) ? "theme" : "fixed"
}));

export const tcrnDarkThemeTokens: readonly ThemeTokenOverride[] = allEntries
  .filter(({ token }) => themeScoped.has(token.variable))
  .map(({ token, dark }) => ({
    variable: token.variable,
    value: dark ?? token.value,
    description: dark === undefined ? `Re-declared in the dark block so it resolves against night values: ${token.description}` : `Night value. ${token.description}`
  }));

// Opt-in seasonal Halloween palette overriding only theme-scoped variables while preserving
// every layout, spacing, radius, type, icon and motion token of the published Site standard.
const halloweenColorOverrides: Readonly<Partial<Record<TokenVariable, string>>> = {
  "--tcrn-color-bg": "#131017",
  "--tcrn-color-bg-2": "#0d0b10",
  "--tcrn-color-panel": "#1b1622",
  "--tcrn-color-panel-2": "#231d2c",
  "--tcrn-color-line": "rgba(245,236,224,.08)",
  "--tcrn-color-line-2": "rgba(245,236,224,.15)",
  "--tcrn-color-line-3": "rgba(245,236,224,.28)",
  "--tcrn-color-line-ctl": "rgba(245,236,224,.40)",
  "--tcrn-color-rule": "#f3ece0",
  "--tcrn-color-ink": "#f3ece0",
  "--tcrn-color-ink-2": "#beb3a4",
  "--tcrn-color-ink-3": "#968b7e",
  "--tcrn-color-acc": "#f58a33",
  "--tcrn-color-acc-2": "#ffa04d",
  "--tcrn-color-acc-3": "#e0761f",
  "--tcrn-color-acc-bg": "rgba(245,138,51,.12)",
  "--tcrn-color-acc-ul": "rgba(245,138,51,.72)",
  "--tcrn-color-on-acc": "#1b0d02",
  "--tcrn-color-red": "#f08c80",
  "--tcrn-color-red-bg": "rgba(240,140,128,.09)",
  "--tcrn-color-red-bg-2": "rgba(240,140,128,.15)",
  "--tcrn-color-ok": "#6dd69c",
  "--tcrn-color-warn": "#ebb552",
  "--tcrn-color-bad": "#f28779",
  "--tcrn-color-bad-bg": "rgba(242,135,121,.11)",
  "--tcrn-color-wash": "rgba(243,236,224,.07)",
  "--tcrn-color-hover": "rgba(243,236,224,.04)",
  "--tcrn-color-dis": "rgba(243,236,224,.05)",
  "--tcrn-elevation-s1": "0 1px 1px rgba(0,0,0,.34),0 0 0 1px rgba(245,236,224,.07)",
  "--tcrn-elevation-s2": "0 1px 2px rgba(0,0,0,.40),0 2px 3px rgba(0,0,0,.34),0 0 0 1px rgba(245,236,224,.08)",
  "--tcrn-elevation-s3": "0 2px 3px rgba(0,0,0,.45),0 3px 3px rgba(0,0,0,.42),0 0 0 1px rgba(245,236,224,.10)",
  "--tcrn-color-glass": "rgba(27,22,34,.76)",
  "--tcrn-elevation-glass-edge": "inset 0 1px 0 rgba(245,236,224,.07)",
  "--tcrn-texture-grain-opacity": ".055",
  "--tcrn-texture-grain-blend": "screen",
  "--tcrn-color-av-bg": "#2b2336",
  "--tcrn-color-av-ink": "#f3ece0",
  "--tcrn-color-knob": "#fff8ee",
  "--tcrn-color-chrome": "rgba(19,16,23,.84)",
  "--tcrn-brand-suffix-tms": "#9ab6ff",
  "--tcrn-brand-suffix-design-system": "#b09cff",
  ...Object.fromEntries([...tcrnAdoptedThemedTokens, ...tcrnAdoptedBrandTokens].map((token) => [token.cssVar, token.halloween]))
};

export const tcrnHalloweenThemeTokens: readonly ThemeTokenOverride[] = allEntries
  .filter(({ token }) => themeScoped.has(token.variable))
  .map(({ token }) => {
    const seasonal = halloweenColorOverrides[token.variable];
    return {
      variable: token.variable,
      value: seasonal ?? token.value,
      description:
        seasonal === undefined
          ? `Re-declared in the seasonal Halloween block so it resolves against seasonal values: ${token.description}`
          : `Seasonal Halloween value. ${token.description}`
    };
  });

export interface DeprecatedToken {
  variable: TokenVariable;
  replacement: TokenVariable | null;
  note: string;
}

/** Optional migration metadata; the current published-source registry contains no retired names. */
export const tcrnDeprecatedTokens: readonly DeprecatedToken[] = tcrnTokens
  .filter((token) => token.deprecated)
  .map((token) => ({ variable: token.variable, replacement: token.deprecated?.replacement ?? null, note: token.deprecated?.note ?? "" }));

/** Old name → new name for every deprecated alias. */
export const tcrnDeprecatedTokenAliases: Readonly<Record<string, string>> = Object.freeze(
  Object.fromEntries(
    tcrnDeprecatedTokens.flatMap((token) => (token.replacement ? [[token.variable, token.replacement] as const] : []))
  )
);

export function createTokenMap(tokens: readonly DesignToken[] = tcrnTokens): Record<string, string> {
  return Object.fromEntries(tokens.map((token) => [token.variable, token.value]));
}

/**
 * Token map with every `var(--…)` reference substituted, as a browser would compute it at
 * the theme root. Contrast and geometry checks read concrete values from here.
 */
export function createResolvedTokenMap(theme: AnyThemeMode = "light", tokens: readonly DesignToken[] = tcrnTokens): Record<string, string> {
  const raw = createTokenMap(tokens);
  const overrides = theme === "dark" ? tcrnDarkThemeTokens : theme === "halloween" ? tcrnHalloweenThemeTokens : null;
  if (overrides) for (const override of overrides) if (override.variable in raw) raw[override.variable] = override.value;
  const resolved: Record<string, string> = {};
  const resolve = (variable: string, trail: readonly string[]): string => {
    if (variable in resolved) return resolved[variable];
    if (trail.includes(variable)) throw new Error(`@tcrn/ui-tokens: token cycle ${[...trail, variable].join(" -> ")}`);
    const value = raw[variable].replace(/var\(\s*(--[a-z0-9-]+)\s*(?:,\s*([^()]*))?\)/g, (whole: string, name: string, fallback?: string) =>
      name in raw ? resolve(name, [...trail, variable]) : (fallback?.trim() ?? whole)
    );
    resolved[variable] = value;
    return value;
  };
  for (const variable of Object.keys(raw)) resolve(variable, []);
  return resolved;
}

const blockMarker = (kind: string): string => `/* tcrn-token-block: ${kind} */`;

/** Marker comment values that open each generated block. */
export const tcrnTokenBlockKinds = { theme: "theme", fixed: "theme-independent", coarse: "pointer-coarse" } as const;

/** The media condition of the coarse-pointer block. */
export const tcrnCoarsePointerMedia = "(pointer: coarse)";

/**
 * The coarse-pointer switch: under a coarse pointer the menu rows and the full
 * menu search take the touch height (07b board, section F: shell.row-h and shell.srch-h are 44
 * under a coarse pointer). It is a token-layer block right after the theme-independent block, so
 * it travels with the token sheet: wherever a page puts the token sheet against the component
 * sheet, the switch comes after the base values it re-points. It only points theme-independent
 * names at other tokens and writes no length of its own.
 */
export const tcrnCoarsePointerTokens: readonly { variable: TokenVariable; value: string }[] = [
  { variable: "--tcrn-shell-row-h", value: "var(--tcrn-shell-touch)" },
  { variable: "--tcrn-shell-srch-h", value: "var(--tcrn-shell-touch)" }
];

function declarationBlock(selector: string, kind: string, declarations: readonly { variable: string; value: string }[]): string {
  return `${selector} {\n  ${blockMarker(kind)}\n${declarations.map((entry) => `  ${entry.variable}: ${entry.value};`).join("\n")}\n}\n`;
}

function mediaBlock(media: string, inner: string): string {
  return `@media ${media} {\n${inner.replace(/^(?=.)/gm, "  ")}}\n`;
}

/**
 * Light stylesheet: the light theme block (`tcrnGplusThemeSelectors.light`, a selector list), the
 * theme-independent `:root` block and, after it, the coarse-pointer block, which keeps only the
 * entries whose name and target the theme-independent block declares.
 */
export function createCssVariables(tokens: readonly DesignToken[] = tcrnTokens): string {
  const themed = tokens.filter((token) => token.scope === "theme");
  const fixed = tokens.filter((token) => token.scope !== "theme");
  const fixedNames = new Set<string>(fixed.map((token) => token.variable));
  const coarse = tcrnCoarsePointerTokens.filter(
    (entry) => fixedNames.has(entry.variable) && [...entry.value.matchAll(/var\((--[a-z0-9-]+)\)/g)].every((match) => fixedNames.has(match[1]))
  );
  return [
    themed.length ? declarationBlock(tcrnGplusThemeSelectors.light, tcrnTokenBlockKinds.theme, themed) : "",
    fixed.length ? declarationBlock(":root", tcrnTokenBlockKinds.fixed, fixed) : "",
    coarse.length ? mediaBlock(tcrnCoarsePointerMedia, declarationBlock(":root", tcrnTokenBlockKinds.coarse, coarse)) : ""
  ].join("");
}

export function createThemeCssVariables(theme: ThemeMode): string {
  if (theme === "light") {
    return createCssVariables();
  }
  return declarationBlock(tcrnGplusThemeSelectors.dark, tcrnTokenBlockKinds.theme, tcrnDarkThemeTokens);
}

export const tcrnDarkThemeCss = createThemeCssVariables("dark");
export const tcrnTokenCss = `${createCssVariables()}${tcrnDarkThemeCss}`;

export function createSeasonalThemeCssVariables(_theme: SeasonalThemeMode): string {
  return declarationBlock(tcrnHalloweenThemeSelector, tcrnSeasonalTokenBlockKind, tcrnHalloweenThemeTokens);
}

export const tcrnHalloweenThemeCss = createSeasonalThemeCssVariables("halloween");
export const tcrnHalloweenThemeStylesheet =
  `/* Opt-in seasonal Halloween theme for @tcrn/ui-tokens. Import after @tcrn/ui-tokens/tokens.css and activate with data-tcrn-theme="halloween". */\n${tcrnHalloweenThemeCss}`;

/** tokens.css loads the bundled faces (packages/ui-tokens/fonts/fonts.css) before the tokens. */
export const tcrnFontsImport = `@import "../fonts/fonts.css";\n`;
/** The published `@tcrn/ui-tokens/tokens.css` text. */
export const tcrnTokenStylesheet = `${tcrnFontsImport}${tcrnTokenCss}`;

export interface TokenCssBlock {
  selector: string;
  /** Value of the `tcrn-token-block:` marker comment, or null when the block has none. */
  kind: string | null;
  /** Condition of the `@media` rule the block sits in (the coarse-pointer block), or null for a top-level block. */
  media: string | null;
  declarations: ReadonlyArray<readonly [string, string]>;
}

/** The selectors of a selector list, split at top-level commas, each with its whitespace collapsed. */
function selectorList(selector: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let quote = "";
  let current = "";
  for (const char of selector) {
    if (quote) {
      if (char === quote) quote = "";
    } else if (char === '"' || char === "'") quote = char;
    else if (char === "(" || char === "[") depth += 1;
    else if (char === ")" || char === "]") depth -= 1;
    else if (char === "," && depth === 0) {
      parts.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  parts.push(current);
  return parts.map((part) => part.replace(/\s+/g, " ").trim()).filter(Boolean);
}

/** Whether two selector lists name the same selectors, in any order. */
function sameSelectorList(a: string, b: string): boolean {
  const left = new Set(selectorList(a));
  const right = new Set(selectorList(b));
  return left.size === right.size && [...left].every((selector) => right.has(selector));
}

function tokenCssBlock(selector: string, body: string, media: string | null): TokenCssBlock {
  const kind = /\/\*\s*tcrn-token-block:\s*([a-z-]+)\s*\*\//.exec(body)?.[1] ?? null;
  const declarations = body
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split(";")
    .map((part) => part.trim())
    .filter((part) => part.startsWith("--"))
    .map((part) => {
      const colon = part.indexOf(":");
      return [part.slice(0, colon).trim(), part.slice(colon + 1).trim()] as const;
    });
  return { selector: selectorList(selector.replace(/\/\*[\s\S]*?\*\//g, "")).join(", "), kind, media, declarations };
}

/**
 * Splits a token stylesheet into its blocks and custom-property declarations, in source order.
 * A block's selector may be a list; it is reported in the canonical `a, b` form. Rules nest one
 * level at most: a block inside an `@media` rule (the coarse-pointer block) carries the rule's
 * condition as `media`, a top-level block null.
 */
export function parseTokenCssBlocks(css: string): TokenCssBlock[] {
  const blocks: TokenCssBlock[] = [];
  const source = css.replace(/@import[^;]*;/g, "");
  for (const match of source.matchAll(/@media([^{}]*)\{((?:[^{}]*\{[^{}]*\})*[^{}]*)\}|([^{}]*)\{([^{}]*)\}/g)) {
    if (match[2] === undefined) {
      blocks.push(tokenCssBlock(match[3], match[4], null));
      continue;
    }
    const media = match[1].replace(/\s+/g, " ").trim();
    for (const inner of match[2].matchAll(/([^{}]*)\{([^{}]*)\}/g)) blocks.push(tokenCssBlock(inner[1], inner[2], media));
  }
  return blocks;
}

export interface ThemeBlockComparison {
  ok: boolean;
  light: readonly string[];
  dark: readonly string[];
  lightOnly: readonly string[];
  darkOnly: readonly string[];
  problems: readonly string[];
}

/**
 * C5: the light theme block (`:root, [data-tcrn-theme="light"]`) and the
 * `[data-tcrn-theme="dark"]` block declare the same property names; the theme-independent
 * `:root` block shares no name with them. Selector lists match in any order and spacing.
 * These three are top-level blocks. A block inside an `@media` rule (the coarse-pointer block,
 * TCRN-DS-SUB-142) re-points names the theme-independent block declares and no theme name, so
 * both themes still read one property set under any pointer.
 */
export function compareTokenThemeBlocks(css: string): ThemeBlockComparison {
  const parsed = parseTokenCssBlocks(css);
  const blocks = parsed.filter((block) => block.media === null);
  const problems: string[] = [];
  const lightBlocks = blocks.filter((block) => sameSelectorList(block.selector, tcrnGplusThemeSelectors.light) && block.kind === tcrnTokenBlockKinds.theme);
  const darkBlocks = blocks.filter((block) => sameSelectorList(block.selector, tcrnGplusThemeSelectors.dark));
  const fixedBlocks = blocks.filter((block) => sameSelectorList(block.selector, ":root") && block.kind !== tcrnTokenBlockKinds.theme);
  if (lightBlocks.length !== 1) problems.push(`expected one ${tcrnGplusThemeSelectors.light} theme block, found ${lightBlocks.length}`);
  if (darkBlocks.length !== 1) problems.push(`expected one ${tcrnGplusThemeSelectors.dark} block, found ${darkBlocks.length}`);
  const names = (list: TokenCssBlock[]) => list.flatMap((block) => block.declarations.map(([property]) => property));
  const light = names(lightBlocks);
  const dark = names(darkBlocks);
  const fixed = names(fixedBlocks);
  const fixedSet = new Set(fixed);
  for (const block of parsed.filter((candidate) => candidate.media !== null)) {
    const where = `the @media ${block.media} block`;
    const seen = new Set<string>();
    for (const [property] of block.declarations) {
      if (seen.has(property)) problems.push(`${property} is declared twice in ${where}`);
      seen.add(property);
      if (light.includes(property) || dark.includes(property)) problems.push(`${where} re-declares the theme name ${property}`);
      else if (!fixedSet.has(property)) problems.push(`${where} declares ${property}, which the theme-independent block does not`);
    }
  }
  for (const [label, list] of [["theme", light], ["dark", dark], ["theme-independent", fixed]] as const) {
    const seen = new Set<string>();
    for (const property of list) {
      if (seen.has(property)) problems.push(`${property} is declared twice in the ${label} block`);
      seen.add(property);
    }
  }
  const lightSet = new Set(light);
  const darkSet = new Set(dark);
  const lightOnly = light.filter((property) => !darkSet.has(property));
  const darkOnly = dark.filter((property) => !lightSet.has(property));
  if (lightOnly.length) problems.push(`only in the light theme block: ${lightOnly.join(", ")}`);
  if (darkOnly.length) problems.push(`only in the dark block: ${darkOnly.join(", ")}`);
  const overlap = fixed.filter((property) => lightSet.has(property) || darkSet.has(property));
  if (overlap.length) problems.push(`declared in both a theme block and the theme-independent block: ${overlap.join(", ")}`);
  return { ok: problems.length === 0, light, dark, lightOnly, darkOnly, problems };
}

export interface SeasonalThemeBlockComparison {
  ok: boolean;
  base: readonly string[];
  seasonal: readonly string[];
  baseOnly: readonly string[];
  seasonalOnly: readonly string[];
  problems: readonly string[];
}

/** Verifies an opt-in seasonal theme block declares the exact same theme-scoped property set as base `tcrnTokenCss`. */
export function compareSeasonalThemeBlock(
  baseCss: string,
  seasonalCss: string,
  selector: string = tcrnHalloweenThemeSelector
): SeasonalThemeBlockComparison {
  const baseComparison = compareTokenThemeBlocks(baseCss);
  const parsedBase = parseTokenCssBlocks(baseCss).filter((block) => block.media === null);
  const fixedNames = new Set(
    parsedBase
      .filter((block) => sameSelectorList(block.selector, ":root") && block.kind !== tcrnTokenBlockKinds.theme)
      .flatMap((block) => block.declarations.map(([property]) => property))
  );
  const parsedSeasonal = parseTokenCssBlocks(seasonalCss).filter((block) => block.media === null);
  const matching = parsedSeasonal.filter(
    (block) => sameSelectorList(block.selector, selector) && block.kind === tcrnSeasonalTokenBlockKind
  );
  const problems: string[] = [...baseComparison.problems];
  if (matching.length !== 1) problems.push(`expected one ${selector} ${tcrnSeasonalTokenBlockKind} block, found ${matching.length}`);
  if (parseTokenCssBlocks(seasonalCss).some((block) => block.media !== null)) problems.push("seasonal theme block must not emit @media rules");
  const seasonal = matching.flatMap((block) => block.declarations.map(([property]) => property));
  const seen = new Set<string>();
  for (const property of seasonal) {
    if (seen.has(property)) problems.push(`${property} is declared twice in the ${selector} block`);
    seen.add(property);
  }
  const base = baseComparison.light;
  const baseSet = new Set(base);
  const seasonalSet = new Set(seasonal);
  const baseOnly = base.filter((property) => !seasonalSet.has(property));
  const seasonalOnly = seasonal.filter((property) => !baseSet.has(property));
  if (baseOnly.length) problems.push(`missing in ${selector}: ${baseOnly.join(", ")}`);
  if (seasonalOnly.length) problems.push(`only in ${selector}: ${seasonalOnly.join(", ")}`);
  const overlap = seasonal.filter((property) => fixedNames.has(property));
  if (overlap.length) problems.push(`declared in both ${selector} and the theme-independent block: ${overlap.join(", ")}`);
  return { ok: problems.length === 0, base, seasonal, baseOnly, seasonalOnly, problems };
}

export interface DeprecatedTokenUsage {
  variable: TokenVariable;
  replacement: TokenVariable | null;
  count: number;
}

/** Counts references to deprecated token names in consumer source (CSS, TSX, …). */
export function findDeprecatedTokenUsages(source: string): DeprecatedTokenUsage[] {
  const usages: DeprecatedTokenUsage[] = [];
  for (const token of tcrnDeprecatedTokens) {
    const pattern = new RegExp(`${token.variable}(?![a-z0-9-])`, "g");
    const count = source.match(pattern)?.length ?? 0;
    if (count) usages.push({ variable: token.variable, replacement: token.replacement, count });
  }
  return usages;
}

/** One printable deprecation notice per deprecated name in use. */
export function formatDeprecatedTokenNotices(usages: readonly DeprecatedTokenUsage[]): string[] {
  return usages.map(
    (usage) =>
      `deprecated token ${usage.variable} (${usage.count} use${usage.count === 1 ? "" : "s"}): ${usage.replacement ? `use ${usage.replacement}` : "no G+ successor; plan its removal"}`
  );
}
