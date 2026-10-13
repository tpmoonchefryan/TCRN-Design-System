// @tcrn/ui-tokens — the single source of the visual language.
//
// G+ (TCRN-DS-INIT-015, STORY-120/121): every G+ value comes from
// gplus-tokens.generated.ts, which scripts/contract-generate.mjs writes from
// docs/design/gplus-2026-10/contract/tokens.json (and the type scale tokens of
// contract/typography.json). This file only arranges those values
// into the published registry; it holds no second copy of a contract value.
//
// The generated stylesheet has three blocks, in this order:
//   1. `:root, [data-tcrn-theme="light"]` theme block — every theme-dependent token, light
//      values; the selector list also matches a light subtree inside a dark page.
//   2. `:root` theme-independent   — tokens whose value is the same in both themes.
//   3. `[data-tcrn-theme="dark"]`  — the theme block again with night values. It comes after
//      block 1, so on an element both match (a dark page root) the night values win.
// Blocks 1 and 3 declare the same property names (C5). A token whose value references a
// themed token (the focus ring, the focus-gap surface, the deprecated aliases) counts as
// theme-dependent and is declared in both theme blocks with the same text, so it
// re-resolves inside a nested dark scope, and inside a light subtree of a dark page, instead
// of inheriting the other theme's result from an ancestor.
import {
  tcrnGplusBrandTokens,
  tcrnGplusFixedTokens,
  tcrnGplusThemeSelectors,
  tcrnGplusThemedTokens,
  tcrnGplusTypeTokens,
  type TcrnGplusBrandToken
} from "./gplus-tokens.generated.js";

export {
  tcrnGplusBrandTokens,
  tcrnGplusFixedTokens,
  tcrnGplusThemeSelectors,
  tcrnGplusThemedTokens
} from "./gplus-tokens.generated.js";
export type { TcrnGplusFixedToken, TcrnGplusThemedToken } from "./gplus-tokens.generated.js";

export type TokenGroup =
  | "color"
  // Selection is its own group rather than a colour: it names a *state* the
  // whole system speaks, and two of its four members are not colours at all.
  | "selection"
  | "typography"
  | "space"
  | "radius"
  | "elevation"
  | "motion"
  | "zIndex"
  | "container"
  | "texture"
  | "control"
  | "icon"
  | "brand";

/**
 * Which generated block declares a token. "theme": the `:root` theme block and the dark
 * block (identical property-name sets, C5). "fixed": the theme-independent `:root` block.
 */
export type TokenScope = "theme" | "fixed";

export type TokenVariable = `--tcrn-${string}`;

export interface DeprecatedTokenInfo {
  /** The variable the deprecated name resolves to, or null when it has no G+ successor. */
  replacement: TokenVariable | null;
  note: string;
}

export interface DesignToken {
  name: string;
  variable: TokenVariable;
  value: string;
  group: TokenGroup;
  description: string;
  scope?: TokenScope;
  deprecated?: DeprecatedTokenInfo;
}

export type ThemeMode = "light" | "dark";

export interface ThemeTokenOverride {
  variable: DesignToken["variable"];
  value: string;
  description: string;
}

export const tcrnThemeModes = ["light", "dark"] as const satisfies readonly ThemeMode[];

function asVariable(value: string): TokenVariable {
  if (!value.startsWith("--tcrn-")) throw new Error(`@tcrn/ui-tokens: ${value} is not a --tcrn-* variable`);
  return value as TokenVariable;
}

const contractGroups: Readonly<Record<string, TokenGroup>> = {
  color: "color",
  shadow: "elevation",
  focus: "elevation",
  texture: "texture",
  "type-family": "typography",
  "type-size": "typography",
  radius: "radius",
  "control-height": "control",
  "control-padding": "control",
  "icon-size": "icon",
  motion: "motion",
  brand: "brand",
  // Shell geometry: the top-band shell's sizes (07b board, section F, TCRN-DS-SUB-113) and the
  // retired composition-one sidebar and top bar sizes; layout sizes, like the other container
  // tokens (TCRN-DS-SUB-090, O-1).
  shell: "container"
};

function contractGroup(group: string): TokenGroup {
  const mapped = contractGroups[group];
  if (!mapped) throw new Error(`@tcrn/ui-tokens: contract group "${group}" has no token group`);
  return mapped;
}

const nameRules: ReadonlyArray<readonly [RegExp, (match: RegExpExecArray) => string]> = [
  [/^--tcrn-type-family-(.+)$/, (m) => `typography.family.${m[1]}`],
  [/^--tcrn-type-size-(.+)$/, (m) => `typography.size.${m[1].replace(/-/g, ".")}`],
  [/^--tcrn-control-(height|padding)-(.+)$/, (m) => `control.${m[1]}.${m[2]}`],
  [/^--tcrn-icon-size-(.+)$/, (m) => `icon.size.${m[1]}`],
  [/^--tcrn-motion-duration-(.+)$/, (m) => `motion.duration.${m[1]}`],
  [/^--tcrn-motion-ease$/, () => "motion.ease"],
  [/^--tcrn-shadow-(.+)$/, (m) => `shadow.${m[1]}`],
  [/^--tcrn-grain-(.+)$/, (m) => `texture.grain.${m[1]}`],
  [/^--tcrn-focus-ring$/, () => "focus.ring"],
  [/^--tcrn-brand-suffix-(.+)$/, (m) => `brand.suffix.${m[1]}`],
  [/^--tcrn-radius-(.+)$/, (m) => `radius.${m[1]}`],
  [/^--tcrn-color-(.+)$/, (m) => `color.${m[1]}`]
];

function tokenName(variable: string): string {
  for (const [pattern, name] of nameRules) {
    const match = pattern.exec(variable);
    if (match) return name(match);
  }
  return variable.replace(/^--tcrn-/, "").replace(/-/g, ".");
}

// The top-band shell's tokens keep the dotted names of the 07b board's section F
// (shell.strip-h, shell.panel-w-expanded, …): the contract key is "shell-" followed by the part
// after "shell.", so the name is read from the key, one to one with the board (TCRN-DS-SUB-113).
// Every other contract token is named from its variable.
function contractTokenName(key: string, cssVar: string): string {
  return key.startsWith("shell-") ? `shell.${key.slice("shell-".length)}` : tokenName(cssVar);
}

// Descriptions are prose only; the values stay in the generated contract file.
const gplusDescriptions: Readonly<Record<string, string>> = {
  bg: "G+ paper canvas behind panels.",
  "bg-2": "G+ recessed paper: wells, tracks and the page behind the canvas.",
  panel: "G+ panel and control interior.",
  "panel-2": "G+ secondary panel: table heads, quiet bands and muted surfaces.",
  line: "G+ hairline between regions; decorative, not a control boundary.",
  "line-2": "G+ divider that has to read.",
  "line-3": "G+ emphasised hairline.",
  "line-ctl": "Control outline (2026-10-11 ruling: 47% ink by day, 36% at night).",
  rule: "Full-ink rule under headings and selected tabs.",
  ink: "Primary text.",
  "ink-2": "Secondary text; the default body tone.",
  "ink-3": "Tertiary text: meta, captions and placeholders.",
  acc: "Accent teal: primary actions, links and the focus ring.",
  "acc-2": "Accent hover step.",
  "acc-3": "Accent pressed step.",
  "acc-bg": "Quiet accent wash behind selected or highlighted content.",
  "acc-ul": "Link underline.",
  "on-acc": "Text and icons on an accent fill.",
  red: "Brick red: destructive actions and stamp ink.",
  "red-bg": "Quiet brick-red wash.",
  "red-bg-2": "Stronger brick-red wash for hover.",
  ok: "Success and ready foreground.",
  warn: "Warning foreground.",
  bad: "Error and blocked foreground.",
  "bad-bg": "Error wash behind invalid fields and blocked states.",
  wash: "Neutral wash: selected rows, tracks and pressed quiet controls.",
  hover: "Neutral hover half-step.",
  dis: "Disabled control fill.",
  s1: "Resting elevation: hairline ring plus a 1px shadow.",
  s2: "Raised elevation.",
  s3: "Overlay elevation for popovers and menus.",
  glass: "Translucent chrome fill under a backdrop blur.",
  edge: "Inner highlight edge for glass and raised chrome.",
  grain: "Paper grain overlay opacity.",
  blend: "Paper grain blend mode.",
  "av-bg": "Avatar fill.",
  "av-ink": "Avatar initials.",
  knob: "Switch knob fill.",
  chrome: "Sticky header and toolbar chrome fill.",
  surface: "Focus-ring gap colour; follows the surface a control sits on (bg by default, panel on panels).",
  focus: "Keyboard focus ring: a 2px gap in the surface colour plus a 2px accent ring.",
  serif: "Serif stack (Source Serif 4, Noto Serif SC) for headings and numerals.",
  sans: "UI stack (Hanken Grotesk, Noto Sans SC).",
  mono: "Monospace stack (IBM Plex Mono) for keys, codes and identifiers.",
  "r-ctl": "Control corner radius.",
  "r-sm": "Small radius for chips and compact controls.",
  "r-panel": "Panel and popover corner radius; radius.surface carries the same value.",
  "r-check": "Checkbox corner radius.",
  "r-stamp": "Stamp and badge corner radius.",
  "r-paper": "Paper corner radius: the ProductShell content sheet under the top band.",
  "h-sm": "Small control height.",
  "h-md": "Default control height.",
  "h-lg": "Large control height.",
  "pad-sm": "Small control inline padding.",
  "pad-md": "Default control inline padding.",
  "pad-lg": "Large control inline padding.",
  "fs-sm": "Small control text size.",
  "fs-md": "Default control text size.",
  "fs-lg": "Large control text size.",
  "ico-sm": "Small icon size.",
  "ico-md": "Default icon size.",
  "ico-lg": "Large icon size.",
  ease: "The single G+ easing curve.",
  "t-fill": "Fill and colour change duration (hover, state).",
  "t-press": "Press feedback duration.",
  "t-move": "Movement duration (menus, panels, indicators).",
  "t-loop": "Looping indicator period.",
  "intro-fade": "Sign-in intro, first phase: the sign-in card fades; the same duration as the fill change.",
  "intro-move": "Sign-in intro, second phase: the mark travels to its place in the top band; the same duration as movement.",
  "intro-rise": "Sign-in intro, third phase: the paper rises while the wordmark, the pinned items and the cluster fade in.",
  "intro-max": "Ceiling for the whole sign-in intro; the three phases together stay below it.",
  "rail-w": "Composition one's ProductShell sidebar width, expanded; the top-band shell has no resident sidebar.",
  "rail-w-collapsed": "Composition one's ProductShell sidebar width, collapsed; the top-band shell has no resident sidebar or collapse control.",
  "topbar-h": "Composition one's ProductShell top bar height; the top band took its place.",
  "shell-strip-h": "Top band height: the shell's only bar. The brand button, the pinned items and the cluster share its midline.",
  "shell-brand-h": "Brand button height; inside the top band it sits half the difference to the band height from the top.",
  "shell-brand-w": "Brand button width in its second version (the sidebar-scale first lockup line plus the toggle); the first version, the mark alone, sizes to its content.",
  "shell-toggle": "Toggle cell of the brand button, holding the chevron.",
  "shell-pin-h": "Height of a pinned item in the top band.",
  "shell-pin-gap": "Gap from the brand button to the first pinned item and between pinned items: one value, no divider.",
  "shell-pins-max": "Most pinned items the top band shows (a count, no unit); the rest are marked pinned in the full menu.",
  "shell-menu-gap": "Gap from the bottom edge of a key to the full menu or drop-down it opens.",
  "shell-panel-w-expanded": "Full menu width.",
  "shell-pbar-h": "Full menu bottom bar height, holding the sidebar-scale lockup; the panel's bottom padding completes the band.",
  "shell-drop-w": "Drop-down and cascade column width.",
  "shell-drop-srch-h": "Search height inside a drop-down (the small SearchInput).",
  "shell-cascade-gap": "Gap between cascade columns.",
  "shell-row-h": "Menu row height; a coarse pointer gets the touch height instead (no separate token).",
  "shell-srch-h": "Full menu search height; a coarse pointer gets the touch height instead (no separate token).",
  "shell-pinb": "Pin slot and pin button size."
};

// Contract tokens the 07b board retires (section F, TCRN-DS-SUB-113). The top-band shell has no
// resident sidebar and no top bar of its own: the two sidebar widths keep their values with no
// successor, and the top bar height becomes an alias of the band height (its contract value is
// var(--shell-strip-h), published as var(--tcrn-shell-strip-h)). They are registered like the
// pre-G+ names further down: an alias with its replacement, the rest with a null replacement.
const retiredContractTokens: Readonly<Record<string, DeprecatedTokenInfo>> = {
  "rail-w": { replacement: null, note: "The top-band shell has no resident sidebar (07b board, section F); the definition stays so consumers still resolve." },
  "rail-w-collapsed": { replacement: null, note: "The top-band shell has no resident sidebar or collapse control (07b board, section F); the definition stays so consumers still resolve." },
  "topbar-h": { replacement: "--tcrn-shell-strip-h", note: "Use --tcrn-shell-strip-h." }
};

function describe(key: string, group: string, night = false): string {
  if (group === "brand") {
    return night
      ? "Product wordmark suffix colour: the mark's deep palette step by day and its bright step by night (O-3)."
      : "Product wordmark suffix colour (the mark's deep palette step); the same in both themes.";
  }
  return gplusDescriptions[key] ?? `G+ token "${key}" from the design contract.`;
}

function fixedValue(key: string): string {
  const token = tcrnGplusFixedTokens.find((candidate) => candidate.key === key);
  if (!token) throw new Error(`@tcrn/ui-tokens: the contract has no fixed token "${key}"`);
  return token.value;
}

/** Value of a type scale token (contract/typography.json "tokens", through the generated file). */
function typeValue(key: string): string {
  const token = tcrnGplusTypeTokens.find((candidate) => candidate.key === key);
  if (!token) throw new Error(`@tcrn/ui-tokens: the contract has no type scale token "${key}"`);
  return token.value;
}

/** `<duration> <G+ ease>` for transition shorthands, both parts from the contract. */
function transition(durationKey: string): string {
  return `${fixedValue(durationKey)} ${fixedValue("ease")}`;
}

interface TokenEntry {
  token: DesignToken;
  /** Night value for contract-themed tokens and brand tokens with a night value; other theme-scoped tokens repeat their light text. */
  dark?: string;
}

const gplusThemedEntries: TokenEntry[] = tcrnGplusThemedTokens.map((token) => ({
  token: {
    name: tokenName(token.cssVar),
    variable: asVariable(token.cssVar),
    value: token.light,
    group: contractGroup(token.group),
    description: describe(token.key, token.group)
  },
  dark: token.dark
}));

// Contract fixed and brand tokens. A brand token with a night value (contract "night", published
// as dark) is theme-scoped: its light value goes on the light theme block and its night value on
// the dark block, so both blocks keep the same property names (C5). The rest stay theme
// independent (TCRN-DS-SUB-088, O-3).
const gplusContractFixedTokens: readonly TcrnGplusBrandToken[] = [...tcrnGplusFixedTokens, ...tcrnGplusBrandTokens];
for (const key of Object.keys(retiredContractTokens)) {
  if (!tcrnGplusFixedTokens.some((token) => token.key === key)) throw new Error(`@tcrn/ui-tokens: the retired contract token "${key}" is not in the contract`);
}

const gplusFixedEntries: TokenEntry[] = gplusContractFixedTokens.map((token): TokenEntry => {
  const dark = token.dark;
  const description = describe(token.key, token.group, dark !== undefined);
  const retired = retiredContractTokens[token.key];
  if (retired?.replacement && token.value !== `var(${retired.replacement})`) {
    throw new Error(`@tcrn/ui-tokens: the retired contract token "${token.key}" is an alias of ${retired.replacement}, but its contract value is ${token.value}`);
  }
  return {
    token: {
      name: contractTokenName(token.key, token.cssVar),
      variable: asVariable(token.cssVar),
      value: token.value,
      group: contractGroup(token.group),
      description: retired ? (retired.replacement ? `Deprecated alias of ${retired.replacement}. ${description}` : `Deprecated. ${description}`) : description,
      ...(retired ? { deprecated: retired } : {})
    },
    ...(dark === undefined ? {} : { dark })
  };
});

// G+ type scale tokens outside tokens.json. They are named, with their variables and values,
// in docs/design/gplus-2026-10/contract/typography.json ("tokens"); the values come from the
// generated file through typeValue(), like the other type scale steps further down, so no
// type scale value is written here (TCRN-DS-SUB-052).
const gplusAdditions: DesignToken[] = [
  { name: "typography.family.heading", variable: "--tcrn-type-family-heading", group: "typography", value: typeValue("family-heading"), description: "Heading face: the serif stack. Headings use this token, never the stamp family." },
  { name: "typography.weight.light", variable: "--tcrn-type-weight-light", group: "typography", value: typeValue("weight-light"), description: "Light weight for serif numerals." },
  { name: "typography.weight.semibold", variable: "--tcrn-type-weight-semibold", group: "typography", value: typeValue("weight-semibold"), description: "Semibold (600): strong text and compact headings; split from the 500 medium step." },
  { name: "typography.tracking.caps", variable: "--tcrn-type-tracking-caps", group: "typography", value: typeValue("tracking-caps"), description: "Letter spacing for uppercase caps labels." },
  { name: "typography.numeric.tabular", variable: "--tcrn-type-numeric-tabular", group: "typography", value: typeValue("numeric-tabular"), description: "font-variant-numeric for figures that align in columns." },
  { name: "typography.line.meta", variable: "--tcrn-type-line-meta", group: "typography", value: typeValue("line-meta"), description: "Meta text line height." },
  { name: "typography.line.heading.2", variable: "--tcrn-type-line-heading-2", group: "typography", value: typeValue("line-heading-2"), description: "Second-level heading line height." },
  { name: "typography.line.heading.3", variable: "--tcrn-type-line-heading-3", group: "typography", value: typeValue("line-heading-3"), description: "Third-level heading line height." }
];

interface LegacyTokenSpec {
  name: string;
  variable: TokenVariable;
  group: TokenGroup;
  description: string;
  value?: string;
  /** Deprecated alias: the old name resolves to this G+ variable. */
  alias?: TokenVariable;
  /** Deprecated without a successor; the definition stays so consumers still resolve. */
  deprecated?: string;
}

// Names that predate G+. Retained names keep their meaning with G+ values; renamed ones
// stay as deprecated aliases (`var(--new)`) so consumers that only know the old name
// still resolve to the new value. Colour aliases carry no colour of their own. The type scale
// steps (size, line, weight, tracking) take their values from the contract through typeValue().
const legacyTokenSpecs: LegacyTokenSpec[] = [
  { name: "color.text.primary", variable: "--tcrn-color-text-primary", group: "color", alias: "--tcrn-color-ink", description: "Primary body and dense operational text." },
  { name: "color.text.secondary", variable: "--tcrn-color-text-secondary", group: "color", alias: "--tcrn-color-ink-2", description: "Secondary labels and supporting operational text." },
  { name: "color.text.muted", variable: "--tcrn-color-text-muted", group: "color", alias: "--tcrn-color-ink-3", description: "Muted text for disabled or unavailable controls." },
  { name: "color.text.tertiary", variable: "--tcrn-color-text-tertiary", group: "color", alias: "--tcrn-color-ink-3", description: "Tertiary metadata text: keys, timestamps, and row-level attribution." },
  { name: "color.text.inverse", variable: "--tcrn-color-text-inverse", group: "color", alias: "--tcrn-color-on-acc", description: "Text on filled accent surfaces." },
  { name: "color.surface.canvas", variable: "--tcrn-color-surface-canvas", group: "color", alias: "--tcrn-color-bg", description: "App canvas background: warm-neutral graphite paper for operational work surfaces." },
  { name: "color.surface.panel", variable: "--tcrn-color-surface-panel", group: "color", alias: "--tcrn-color-panel", description: "Panel and component interior surface." },
  { name: "color.surface.muted", variable: "--tcrn-color-surface-muted", group: "color", alias: "--tcrn-color-panel-2", description: "Subtle background for badges, disabled controls, and proof chips." },
  { name: "color.neutralCalibration.canvas", variable: "--tcrn-color-neutral-calibration-canvas", group: "color", alias: "--tcrn-color-bg", description: "Owner-approved neutral gray calibration canvas for future measured surface work; not auto-applied." },
  { name: "color.neutralCalibration.panel", variable: "--tcrn-color-neutral-calibration-panel", group: "color", alias: "--tcrn-color-panel", description: "Owner-approved neutral gray calibration panel for future measured surface work; not auto-applied." },
  { name: "color.neutralCalibration.muted", variable: "--tcrn-color-neutral-calibration-muted", group: "color", alias: "--tcrn-color-panel-2", description: "Owner-approved neutral gray calibration muted surface and progress track; not auto-applied." },
  { name: "color.neutralCalibration.border", variable: "--tcrn-color-neutral-calibration-border", group: "color", alias: "--tcrn-color-line-ctl", description: "Measured neutral calibration boundary for contrast-proofed small surfaces; not a default border replacement." },
  { name: "color.border.subtle", variable: "--tcrn-color-border-subtle", group: "color", alias: "--tcrn-color-line", description: "Low-emphasis component boundary; carries elevation in place of shadow." },
  { name: "color.border.strong", variable: "--tcrn-color-border-strong", group: "color", alias: "--tcrn-color-line-2", description: "Control boundary and table rule." },
  { name: "color.border.control", variable: "--tcrn-color-border-control", group: "color", alias: "--tcrn-color-line-ctl", description: "Interactive control boundary (input, select, secondary button). Meets WCAG 1.4.11 3:1 against panel and canvas; distinct from the lighter structural rules above, which carry no contrast duty." },
  { name: "color.brand.teal", variable: "--tcrn-color-brand-teal", group: "color", alias: "--tcrn-color-acc", description: "Legacy aqua support accent, aligned to the purified brand teal." },
  { name: "color.brand.primary", variable: "--tcrn-color-brand-primary", group: "color", alias: "--tcrn-color-acc", description: "Primary brand teal: the single accent of the quiet-instrument base." },
  { name: "color.brand.primary.bg", variable: "--tcrn-color-brand-primary-bg", group: "color", alias: "--tcrn-color-acc-bg", description: "Quiet teal background for selected surfaces and brand callouts." },
  { name: "color.brand.secondary", variable: "--tcrn-color-brand-secondary", group: "color", alias: "--tcrn-color-acc-2", description: "Deep teal support color for system connection and charts." },
  { name: "color.brand.secondary.bg", variable: "--tcrn-color-brand-secondary-bg", group: "color", alias: "--tcrn-color-acc-bg", description: "Quiet secondary background for informational surfaces." },
  { name: "color.brand.accent", variable: "--tcrn-color-brand-accent", group: "color", alias: "--tcrn-color-red", description: "Stamp oxblood: identity-moment accent (gate close, ruling, release acceptance)." },
  { name: "color.brand.accent.bg", variable: "--tcrn-color-brand-accent-bg", group: "color", alias: "--tcrn-color-red-bg", description: "Quiet oxblood background for sparing identity-moment surfaces." },
  { name: "color.brand.neutral", variable: "--tcrn-color-brand-neutral", group: "color", alias: "--tcrn-color-ink-2", description: "Neutral brand support for dense operational structure." },
  { name: "color.brand.neutral.bg", variable: "--tcrn-color-brand-neutral-bg", group: "color", alias: "--tcrn-color-panel-2", description: "Neutral support background for muted structure and chips." },
  { name: "color.focus.ring", variable: "--tcrn-color-focus-ring", group: "color", alias: "--tcrn-color-acc", description: "Visible focus outline for keyboard navigation." },
  { name: "color.focus.ring.calibrated", variable: "--tcrn-color-focus-ring-calibrated", group: "color", alias: "--tcrn-color-acc", description: "Measured solid focus ring candidate for neutral calibration surfaces; preserves visible focus and is not auto-applied." },
  { name: "color.progress.track.calibrated", variable: "--tcrn-color-progress-track-calibrated", group: "color", alias: "--tcrn-color-wash", description: "Measured neutral progress track for local visual calibration evidence." },
  { name: "color.progress.fill.start.calibrated", variable: "--tcrn-color-progress-fill-start-calibrated", group: "color", alias: "--tcrn-color-acc", description: "Measured progress fill start for local visual calibration evidence." },
  { name: "color.progress.fill.end.calibrated", variable: "--tcrn-color-progress-fill-end-calibrated", group: "color", alias: "--tcrn-color-acc", description: "Measured progress fill end for local visual calibration evidence." },
  { name: "color.state.ready", variable: "--tcrn-color-state-ready", group: "color", alias: "--tcrn-color-ok", description: "Local-ready or fixture-ready state foreground." },
  { name: "color.state.ready.bg", variable: "--tcrn-color-state-ready-bg", group: "color", alias: "--tcrn-color-wash", description: "Local-ready state background: low-noise wash, not a pastel fill." },
  { name: "color.state.blocked", variable: "--tcrn-color-state-blocked", group: "color", alias: "--tcrn-color-bad", description: "Blocked state foreground." },
  { name: "color.state.blocked.bg", variable: "--tcrn-color-state-blocked-bg", group: "color", alias: "--tcrn-color-bad-bg", description: "Blocked state background: low-noise wash." },
  { name: "color.state.warning", variable: "--tcrn-color-state-warning", group: "color", alias: "--tcrn-color-warn", description: "Warning state foreground." },
  { name: "color.state.warning.bg", variable: "--tcrn-color-state-warning-bg", group: "color", alias: "--tcrn-color-wash", description: "Warning state background: low-noise wash." },
  { name: "color.state.warning.calibrated", variable: "--tcrn-color-state-warning-calibrated", group: "color", alias: "--tcrn-color-warn", description: "Measured warning foreground candidate for calibrated state surfaces; not auto-applied." },
  { name: "color.state.warning.calibrated.bg", variable: "--tcrn-color-state-warning-calibrated-bg", group: "color", alias: "--tcrn-color-wash", description: "Measured warning background candidate for calibrated state surfaces; not auto-applied." },
  { name: "color.state.danger.calibrated", variable: "--tcrn-color-state-danger-calibrated", group: "color", alias: "--tcrn-color-bad", description: "Measured danger foreground candidate for calibrated state surfaces; not auto-applied." },
  { name: "color.state.danger.calibrated.bg", variable: "--tcrn-color-state-danger-calibrated-bg", group: "color", alias: "--tcrn-color-bad-bg", description: "Measured danger background candidate for calibrated state surfaces; not auto-applied." },
  { name: "typography.family.latin", variable: "--tcrn-type-family-latin", group: "typography", alias: "--tcrn-type-family-ui", description: "Latin runtime stack. Inter is distributable; Apple and Microsoft names are platform fallback only." },
  { name: "typography.family.distributable.latin", variable: "--tcrn-type-family-distributable-latin", group: "typography", alias: "--tcrn-type-family-ui", description: "Redistributable Latin font stack for package assets, self-hosting, and product bundling." },
  { name: "typography.family.distributable.zhCN", variable: "--tcrn-type-family-distributable-zh-cn", group: "typography", alias: "--tcrn-type-family-ui", description: "Redistributable Simplified Chinese CJK stack for package assets, self-hosting, and product bundling." },
  { name: "typography.family.distributable.ja", variable: "--tcrn-type-family-distributable-ja", group: "typography", value: "Noto Sans CJK JP, Source Han Sans JP, sans-serif", description: "Redistributable Japanese CJK stack for package assets, self-hosting, and product bundling." },
  { name: "typography.family.distributable.ko", variable: "--tcrn-type-family-distributable-ko", group: "typography", value: "Noto Sans CJK KR, Source Han Sans KR, sans-serif", description: "Redistributable Korean CJK stack for package assets, self-hosting, and product bundling." },
  { name: "typography.family.distributable.mono", variable: "--tcrn-type-family-distributable-mono", group: "typography", alias: "--tcrn-type-family-mono", description: "Redistributable monospace font stack for package assets, self-hosting, and product bundling." },
  { name: "typography.family.zhCN", variable: "--tcrn-type-family-zh-cn", group: "typography", alias: "--tcrn-type-family-ui", description: "Simplified Chinese runtime stack. Platform fonts are fallback references only; do not redistribute them." },
  { name: "typography.family.ja", variable: "--tcrn-type-family-ja", group: "typography", value: "Hiragino Sans, Yu Gothic, Noto Sans CJK JP, Source Han Sans JP, Meiryo, sans-serif", description: "Japanese runtime stack. Platform fonts are fallback references only; do not redistribute them." },
  { name: "typography.family.ko", variable: "--tcrn-type-family-ko", group: "typography", value: "Apple SD Gothic Neo, Malgun Gothic, Noto Sans CJK KR, Source Han Sans KR, sans-serif", description: "Korean runtime stack. Platform fonts are fallback references only; do not redistribute them." },
  { name: "typography.family.stamp", variable: "--tcrn-type-family-stamp", group: "typography", value: "Source Serif 4, Songti SC, Noto Serif CJK SC, Georgia, serif", description: "Identity-moment serif for stamp titles and rulings. Restricted to the identity whitelist (gate close, ruling, release acceptance); never used for data or dense body text." },
  { name: "typography.family.distributable.stamp.latin", variable: "--tcrn-type-family-distributable-stamp-latin", group: "typography", value: "Source Serif 4, serif", description: "Bundleable Latin stamp serif (SIL OFL-1.1). Reserved Font Name applies: a modified build must be renamed." },
  { name: "typography.family.distributable.stamp.zhCN", variable: "--tcrn-type-family-distributable-stamp-zh-cn", group: "typography", value: "Noto Serif CJK SC, serif", description: "Bundleable Simplified-Chinese stamp serif (SIL OFL-1.1). Reserved Font Name applies." },
  { name: "typography.size.stamp.min", variable: "--tcrn-type-size-stamp-min", group: "typography", value: typeValue("size-stamp-min"), description: "Floor for stamp type. Below this the CJK serif loses its strokes on standard-density displays, which is why the whitelist keeps data rows on the sans face." },
  { name: "typography.tracking.stamp", variable: "--tcrn-type-tracking-stamp", group: "typography", value: typeValue("tracking-stamp"), description: "Stamp letter-spacing: opens small-caps enough to read as an impression rather than a label." },
  { name: "typography.size.ui", variable: "--tcrn-type-size-ui", group: "typography", value: typeValue("size-ui"), description: "Default dense UI text size." },
  { name: "typography.size.reading", variable: "--tcrn-type-size-reading", group: "typography", value: typeValue("size-reading"), description: "Readable prose text role size for proof-gated explanatory copy; not auto-applied to dense UI." },
  { name: "typography.size.caption", variable: "--tcrn-type-size-caption", group: "typography", value: typeValue("size-caption"), description: "Caption and metadata text size." },
  { name: "typography.size.meta", variable: "--tcrn-type-size-meta", group: "typography", value: typeValue("size-meta"), description: "Dense metadata text: counts, badges, table tool labels, and secondary row detail. One step above caption, one below dense UI text." },
  { name: "typography.size.body", variable: "--tcrn-type-size-body", group: "typography", value: typeValue("size-body"), description: "Default body copy and table text size." },
  { name: "typography.size.section", variable: "--tcrn-type-size-section", group: "typography", value: typeValue("size-section"), description: "Section and story heading text size." },
  { name: "typography.size.page", variable: "--tcrn-type-size-page", group: "typography", value: typeValue("size-page"), description: "Page title text size for documentation and product shells." },
  { name: "typography.size.heading.2", variable: "--tcrn-type-size-heading-2", group: "typography", value: typeValue("size-heading-2"), description: "Second-level heading size, between the page title and section role — the component library's h2 step." },
  { name: "typography.size.heading.3", variable: "--tcrn-type-size-heading-3", group: "typography", value: typeValue("size-heading-3"), description: "Third-level heading size — the component library's h3 step, below the section role." },
  { name: "typography.line.ui", variable: "--tcrn-type-line-ui", group: "typography", value: typeValue("line-ui"), description: "Default UI line height." },
  { name: "typography.line.reading", variable: "--tcrn-type-line-reading", group: "typography", value: typeValue("line-reading"), description: "Readable prose text role line height for proof-gated explanatory copy." },
  { name: "typography.line.caption", variable: "--tcrn-type-line-caption", group: "typography", value: typeValue("line-caption"), description: "Caption and metadata line height." },
  { name: "typography.line.body", variable: "--tcrn-type-line-body", group: "typography", value: typeValue("line-body"), description: "Readable body copy line height." },
  { name: "typography.line.control", variable: "--tcrn-type-line-control", group: "typography", value: typeValue("line-control"), description: "Compact control text line height." },
  { name: "typography.line.section", variable: "--tcrn-type-line-section", group: "typography", value: typeValue("line-section"), description: "Section heading line height." },
  { name: "typography.line.page", variable: "--tcrn-type-line-page", group: "typography", value: typeValue("line-page"), description: "Page heading line height." },
  { name: "typography.weight.regular", variable: "--tcrn-type-weight-regular", group: "typography", value: typeValue("weight-regular"), description: "Default body text weight." },
  { name: "typography.weight.medium", variable: "--tcrn-type-weight-medium", group: "typography", value: typeValue("weight-medium"), description: "Medium (500): caps labels, units and control labels; the 600 step is typography.weight.semibold." },
  { name: "typography.weight.strong", variable: "--tcrn-type-weight-strong", group: "typography", value: typeValue("weight-strong"), description: "Strong text and compact headings (600); G+ has no 700 step." },
  { name: "typography.role.bodyDense", variable: "--tcrn-text-body-dense", group: "typography", value: "var(--tcrn-type-weight-regular) var(--tcrn-type-size-ui)/var(--tcrn-type-line-ui) var(--tcrn-type-family-ui)", description: "Composite dense UI body role; preserves 13px operational surfaces." },
  { name: "typography.role.bodyReading", variable: "--tcrn-text-body-reading", group: "typography", value: "var(--tcrn-type-weight-regular) var(--tcrn-type-size-reading)/var(--tcrn-type-line-reading) var(--tcrn-type-family-ui)", description: "Composite readable prose role for proof-gated explanatory copy; not auto-applied." },
  { name: "elevation.floating", variable: "--tcrn-elevation-floating", group: "elevation", alias: "--tcrn-shadow-s3", description: "Floating layer (popover, menu, toast). Elevation is drawn as a hairline with a whisper of shadow, never a soft cloud: the quiet-instrument base separates layers by edge, not by blur." },
  { name: "state.dot.size", variable: "--tcrn-state-dot-size", group: "space", value: "6px", description: "Ink-dot diameter in a status chip. State reads as dot plus word, so the chip needs no saturated fill." },
  { name: "state.chip.padding", variable: "--tcrn-state-chip-padding", group: "space", value: "3px 8px 3px 6px", description: "Status chip padding, asymmetric to close the optical gap the leading ink dot opens." },
  { name: "space.0h", variable: "--tcrn-space-0h", group: "space", value: "2px", description: "Hairline gap: icon-to-label micro-spacing and tight inline stacks." },
  { name: "space.1", variable: "--tcrn-space-1", group: "space", value: "4px", description: "Tight gap for closely related items." },
  { name: "space.1h", variable: "--tcrn-space-1h", group: "space", value: "6px", description: "Snug gap between related controls or chip clusters." },
  { name: "space.2", variable: "--tcrn-space-2", group: "space", value: "8px", description: "Compact gap for adjacent controls." },
  { name: "space.2h", variable: "--tcrn-space-2h", group: "space", value: "10px", description: "Comfortable gap between grouped controls and list rows." },
  { name: "space.3", variable: "--tcrn-space-3", group: "space", value: "12px", description: "Default gap between distinct controls and card internals." },
  { name: "space.3h", variable: "--tcrn-space-3h", group: "space", value: "14px", description: "Roomy gap for separated groups within a panel." },
  { name: "density.compact.rowHeight", variable: "--tcrn-density-compact-row-height", group: "space", value: "36px", description: "Compact table/list row height for repeated operational scanning." },
  { name: "space.4", variable: "--tcrn-space-4", group: "space", value: "16px", description: "Panel interior spacing." },
  { name: "space.4h", variable: "--tcrn-space-4h", group: "space", value: "18px", description: "Generous gap between panel sections." },
  { name: "space.5", variable: "--tcrn-space-5", group: "space", value: "20px", description: "Section-level spacing between panels." },
  { name: "space.6", variable: "--tcrn-space-6", group: "space", value: "32px", description: "Large layout gap between major regions." },
  { name: "selection.fill", variable: "--tcrn-selection-fill", group: "selection", alias: "--tcrn-color-wash", description: "Selected state for surface-bearing controls: ink at low alpha, so selection reads as the control being inked rather than as an added mark." },
  { name: "selection.fill.hover", variable: "--tcrn-selection-fill-hover", group: "selection", alias: "--tcrn-color-hover", description: "Hover half-step toward selection for the same controls." },
  { name: "selection.edge", variable: "--tcrn-selection-edge", group: "selection", alias: "--tcrn-color-ink", description: "Selected state for framed controls: the existing border promoted to ink. Framed things are never given a second mark." },
  { name: "selection.glide", variable: "--tcrn-selection-glide", group: "selection", value: transition("t-move"), description: "Segmented-track travel for the selection fill; reduced-motion drops to an instant swap." },
  { name: "radius.surface", variable: "--tcrn-radius-surface", group: "radius", value: fixedValue("r-panel"), description: "Panel and card radius for framed surfaces." },
  { name: "radius.pill", variable: "--tcrn-radius-pill", group: "radius", value: "999px", description: "Fully rounded pill radius for badges, toggles, and abbreviation dots." },
  { name: "elevation.focus", variable: "--tcrn-elevation-focus", group: "elevation", alias: "--tcrn-focus-ring", description: "Accessible focus halo: canvas gap plus solid ring (elevation is drawn, never blurred)." },
  { name: "motion.ease.out", variable: "--tcrn-motion-ease-out", group: "motion", alias: "--tcrn-motion-ease", description: "Strong ease-out for anything entering or leaving. The default curve of the system." },
  { name: "motion.ease.inOut", variable: "--tcrn-motion-ease-in-out", group: "motion", value: "cubic-bezier(0.77, 0, 0.175, 1)", description: "Strong ease-in-out for elements moving or morphing on screen while remaining visible." },
  { name: "motion.ease.drawer", variable: "--tcrn-motion-ease-drawer", group: "motion", value: "cubic-bezier(0.32, 0.72, 0, 1)", description: "Drawer and sheet curve for large surfaces travelling a long distance." },
  { name: "motion.comprehension", variable: "--tcrn-motion-comprehension", group: "motion", value: "160ms linear", description: "Opacity and colour transitions that SURVIVE prefers-reduced-motion. Reduced motion removes travel, not the cue that something changed." },
  { name: "motion.press.scale", variable: "--tcrn-motion-press-scale", group: "motion", value: "0.97", deprecated: "G+ presses change fill over --tcrn-motion-duration-press and do not scale; kept so existing consumers still resolve.", description: "Scale applied on :active. A pressable surface must visibly answer the press; subtle is the point (0.95-0.98)." },
  { name: "motion.spring.duration", variable: "--tcrn-motion-spring-duration", group: "motion", value: "0.5s", description: "Spring duration for gesture-driven and floating surfaces (direction C contribution to the baseline)." },
  { name: "motion.spring.bounce", variable: "--tcrn-motion-spring-bounce", group: "motion", value: "0.15", description: "Spring bounce for gesture-driven surfaces. Kept low: bounce belongs to drag-to-dismiss, not to an instrument panel." },
  { name: "motion.fast", variable: "--tcrn-motion-fast", group: "motion", value: transition("t-fill"), description: "Fast interface response (hover, chip, small state change) on the G+ fill duration." },
  { name: "motion.instant", variable: "--tcrn-motion-instant", group: "motion", value: transition("t-press"), description: "Near-instant feedback for press and toggle states." },
  { name: "motion.standard", variable: "--tcrn-motion-standard", group: "motion", value: transition("t-move"), description: "Standard entry/exit for menus, popovers, and inline reveals." },
  { name: "motion.emphasis", variable: "--tcrn-motion-emphasis", group: "motion", value: transition("t-move"), description: "Emphasis movement for drawers and panels; G+ moves everything on one duration and one ease." },
  { name: "motion.loading.loop", variable: "--tcrn-motion-loading-loop", group: "motion", value: `${fixedValue("t-loop")} linear`, description: "Looping loading indicator duration; requires visible status copy." },
  { name: "motion.skeleton.loop", variable: "--tcrn-motion-skeleton-loop", group: "motion", value: "1400ms ease-in-out", description: "Skeleton placeholder shimmer duration with reduced-motion fallback." },
  { name: "motion.progress.loop", variable: "--tcrn-motion-progress-loop", group: "motion", value: "1200ms ease-in-out", description: "Indeterminate progress duration; cannot replace proof copy." },
  { name: "motion.reduced.duration", variable: "--tcrn-motion-reduced-duration", group: "motion", value: "0.01ms", description: "Collapsed duration for POSITIONAL motion only under prefers-reduced-motion. Never apply it to opacity or colour: reduced motion means fewer and gentler animations, not none, and comprehension cues must survive. Pair with --tcrn-motion-comprehension." },
  { name: "zIndex.overlay", variable: "--tcrn-z-overlay", group: "zIndex", value: "30", description: "Overlay and drawer layer." },
  { name: "zIndex.popover", variable: "--tcrn-z-popover", group: "zIndex", value: "20", description: "Popover and menu layer below drawers/dialogs." },
  { name: "container.readable", variable: "--tcrn-container-readable", group: "container", value: "1120px", description: "Readable content max width." },
  { name: "container.settings.split", variable: "--tcrn-container-settings-split", group: "container", value: "960px", description: "Minimum inline size for a settings frame to show compact local navigation beside one content column." },
  { name: "container.settings.contentStack", variable: "--tcrn-container-settings-content-stack", group: "container", value: "720px", description: "Content-column inline-size threshold below which setting rows stack their label, control, and tools." },
  { name: "container.settings.localNav", variable: "--tcrn-container-settings-local-nav", group: "container", value: "208px", description: "Compact local settings navigation column width at the split layout threshold." },
  { name: "container.settings.controlMin", variable: "--tcrn-container-settings-control-min", group: "container", value: "240px", description: "Minimum inline size reserved for a setting control in a non-stacked row." },
  { name: "container.settings.choiceOption", variable: "--tcrn-container-settings-choice-option", group: "container", value: "112px", description: "Default minimum inline size for one binary setting option before a radio choice is admitted." },
  { name: "container.settings.choicePadding", variable: "--tcrn-container-settings-choice-padding", group: "container", value: "8px", description: "Inline padding on each edge of an admitted binary setting choice group." },
  { name: "container.settings.numberMin", variable: "--tcrn-container-settings-number-min", group: "container", value: "12ch", description: "Minimum inline size for numeric entry so the legal value and native editing affordance remain visible." },
  { name: "container.pageHierarchy.thirdLevelSplit", variable: "--tcrn-container-page-third-level-split", group: "container", value: "960px", description: "Minimum inline size for a third-level page's internal local-navigation/content split; never a page-depth decision." },
  { name: "container.pageHierarchy.localNav", variable: "--tcrn-container-page-third-level-nav", group: "container", value: "208px", description: "Compact local-navigation column width inside an explicitly third-level page." },
  { name: "compatibility.brand-mark-filter", variable: "--tcrn-brand-mark-filter", group: "elevation", value: "none", description: "Default brand-mark filter; no effect unless an explicitly themed component overrides it." },
  { name: "compatibility.search-input-min-inline-size", variable: "--tcrn-search-input-min-inline-size", group: "container", value: "0", description: "Default responsive SearchInput minimum inline size; allows shrinking within its declared container." },
];

function legacyEntry(spec: LegacyTokenSpec): TokenEntry {
  const base = { name: spec.name, variable: spec.variable, group: spec.group };
  if (spec.alias) {
    return {
      token: {
        ...base,
        value: `var(${spec.alias})`,
        description: `Deprecated alias of ${spec.alias}. ${spec.description}`,
        deprecated: { replacement: spec.alias, note: `Use ${spec.alias}.` }
      }
    };
  }
  if (spec.value === undefined) throw new Error(`@tcrn/ui-tokens: ${spec.variable} has neither a value nor an alias`);
  if (spec.deprecated) {
    return {
      token: {
        ...base,
        value: spec.value,
        description: `Deprecated. ${spec.description}`,
        deprecated: { replacement: null, note: spec.deprecated }
      }
    };
  }
  return { token: { ...base, value: spec.value, description: spec.description } };
}

const allEntries: TokenEntry[] = [
  ...gplusThemedEntries,
  ...gplusFixedEntries,
  ...gplusAdditions.map((token) => ({ token })),
  ...legacyTokenSpecs.map(legacyEntry)
];

function referencedVariables(value: string): string[] {
  return [...value.matchAll(/var\(\s*(--[a-z0-9-]+)/g)].map((match) => match[1]);
}

// Theme scope is transitive: anything that references a themed token is themed too. A contract
// brand token with a night value starts out themed.
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

/** Every deprecated name, including the ones without a G+ successor. */
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
export const tcrnTokenBlockKinds = { theme: "theme", fixed: "theme-independent" } as const;

function declarationBlock(selector: string, kind: string, declarations: readonly { variable: string; value: string }[]): string {
  return `${selector} {\n  ${blockMarker(kind)}\n${declarations.map((entry) => `  ${entry.variable}: ${entry.value};`).join("\n")}\n}\n`;
}

/** Light stylesheet: the light theme block (`tcrnGplusThemeSelectors.light`, a selector list) followed by the theme-independent `:root` block. */
export function createCssVariables(tokens: readonly DesignToken[] = tcrnTokens): string {
  const themed = tokens.filter((token) => token.scope === "theme");
  const fixed = tokens.filter((token) => token.scope !== "theme");
  return [
    themed.length ? declarationBlock(tcrnGplusThemeSelectors.light, tcrnTokenBlockKinds.theme, themed) : "",
    fixed.length ? declarationBlock(":root", tcrnTokenBlockKinds.fixed, fixed) : ""
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

/**
 * Splits a token stylesheet (no nested rules) into its blocks and custom-property declarations.
 * A block's selector may be a list; it is reported in the canonical `a, b` form.
 */
export function parseTokenCssBlocks(css: string): TokenCssBlock[] {
  const blocks: TokenCssBlock[] = [];
  const source = css.replace(/@import[^;]*;/g, "");
  for (const match of source.matchAll(/([^{}]*)\{([^{}]*)\}/g)) {
    const kind = /\/\*\s*tcrn-token-block:\s*([a-z-]+)\s*\*\//.exec(match[2])?.[1] ?? null;
    const declarations = match[2]
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .split(";")
      .map((part) => part.trim())
      .filter((part) => part.startsWith("--"))
      .map((part) => {
        const colon = part.indexOf(":");
        return [part.slice(0, colon).trim(), part.slice(colon + 1).trim()] as const;
      });
    blocks.push({ selector: selectorList(match[1].replace(/\/\*[\s\S]*?\*\//g, "")).join(", "), kind, declarations });
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
 */
export function compareTokenThemeBlocks(css: string): ThemeBlockComparison {
  const blocks = parseTokenCssBlocks(css);
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
