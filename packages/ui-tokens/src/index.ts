// Current tokens are an engineering projection of the eight published Sites v1 boards.
// The source generator validates the fixed published identities and byte pins before extracting values.
import { tcrnGplusBrandTokens, tcrnGplusFixedTokens, tcrnGplusThemedTokens, tcrnGplusThemeSelectors, tcrnGplusTypeTokens } from "./gplus-tokens.generated.js";
export { tcrnGplusBrandTokens, tcrnGplusFixedTokens, tcrnGplusThemedTokens, tcrnGplusThemeSelectors } from "./gplus-tokens.generated.js";
export type { TcrnGplusFixedToken, TcrnGplusThemedToken } from "./gplus-tokens.generated.js";
export type TokenGroup = "color"|"selection"|"typography"|"space"|"radius"|"elevation"|"motion"|"zIndex"|"container"|"texture"|"control"|"icon"|"brand";
export type TokenScope = "theme"|"fixed";
export type TokenVariable = `--tcrn-${string}`;
export interface DeprecatedTokenInfo { replacement:TokenVariable|null; note:string }
export interface DesignToken { name:string;variable:TokenVariable;value:string;group:TokenGroup;description:string;scope?:TokenScope;deprecated?:DeprecatedTokenInfo }
export type ThemeMode="light"|"dark";
export interface ThemeTokenOverride { variable:TokenVariable;value:string;description:string }
export const tcrnThemeModes=["light","dark"] as const;
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
const gplusThemedEntries:TokenEntry[]=tcrnGplusThemedTokens.map(t=>({token:{name:t.key,variable:asVariable(t.cssVar),value:t.light,group:tokenGroup(t.cssVar),description:t.source??"Published 01 token table"},dark:t.dark}));
const gplusFixedEntries:TokenEntry[]=[...tcrnGplusFixedTokens,...tcrnGplusBrandTokens,...tcrnGplusTypeTokens].map(t=>({token:{name:t.key,variable:asVariable(t.cssVar),value:t.value,group:tokenGroup(t.cssVar),description:t.source??"Published board value"}}));
const allEntries:TokenEntry[]=[...gplusThemedEntries,...gplusFixedEntries];
function referencedVariables(value: string): string[] {
  return [...value.matchAll(/var\(\s*(--[a-z0-9-]+)/g)].map((match) => match[1]);
}

// Theme scope is transitive: anything that references a themed token is themed too. A contract
// engineering binding referencing one starts out themed.
const themeScoped = new Set<string>([...gplusThemedEntries, ...gplusFixedEntries.filter((entry) => entry.dark !== undefined)].map((entry) => entry.token.variable));
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
export function createResolvedTokenMap(theme: ThemeMode = "light", tokens: readonly DesignToken[] = tcrnTokens): Record<string, string> {
  const raw = createTokenMap(tokens);
  if (theme === "dark") for (const override of tcrnDarkThemeTokens) if (override.variable in raw) raw[override.variable] = override.value;
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
