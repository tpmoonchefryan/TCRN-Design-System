export type TokenGroup =
  | "color"
  | "typography"
  | "space"
  | "radius"
  | "elevation"
  | "motion"
  | "zIndex"
  | "container";

export interface DesignToken {
  name: string;
  variable: `--tcrn-${string}`;
  value: string;
  group: TokenGroup;
  description: string;
}

export type ThemeMode = "light" | "dark";

export interface ThemeTokenOverride {
  variable: DesignToken["variable"];
  value: string;
  description: string;
}

export const tcrnThemeModes = ["light", "dark"] as const satisfies readonly ThemeMode[];

export const tcrnTokens = [
  {
    name: "color.text.primary",
    variable: "--tcrn-color-text-primary",
    value: "#172033",
    group: "color",
    description: "Primary body and dense operational text."
  },
  {
    name: "color.text.secondary",
    variable: "--tcrn-color-text-secondary",
    value: "#536579",
    group: "color",
    description: "Secondary labels and supporting operational text."
  },
  {
    name: "color.text.muted",
    variable: "--tcrn-color-text-muted",
    value: "#7b8a9a",
    group: "color",
    description: "Muted text for disabled or unavailable controls."
  },
  {
    name: "color.surface.canvas",
    variable: "--tcrn-color-surface-canvas",
    value: "#f6f7fb",
    group: "color",
    description: "App canvas background for operational work surfaces."
  },
  {
    name: "color.surface.panel",
    variable: "--tcrn-color-surface-panel",
    value: "#ffffff",
    group: "color",
    description: "Panel and component interior surface."
  },
  {
    name: "color.surface.muted",
    variable: "--tcrn-color-surface-muted",
    value: "#edf4f7",
    group: "color",
    description: "Subtle background for badges, disabled controls, and proof chips."
  },
  {
    name: "color.neutralCalibration.canvas",
    variable: "--tcrn-color-neutral-calibration-canvas",
    value: "#f5f5f5",
    group: "color",
    description: "Owner-approved neutral gray calibration canvas for future measured surface work; not auto-applied."
  },
  {
    name: "color.neutralCalibration.panel",
    variable: "--tcrn-color-neutral-calibration-panel",
    value: "#fcfcfc",
    group: "color",
    description: "Owner-approved neutral gray calibration panel for future measured surface work; not auto-applied."
  },
  {
    name: "color.neutralCalibration.muted",
    variable: "--tcrn-color-neutral-calibration-muted",
    value: "#eeeeee",
    group: "color",
    description: "Owner-approved neutral gray calibration muted surface and progress track; not auto-applied."
  },
  {
    name: "color.neutralCalibration.border",
    variable: "--tcrn-color-neutral-calibration-border",
    value: "#808080",
    group: "color",
    description: "Measured neutral calibration boundary for contrast-proofed small surfaces; not a default border replacement."
  },
  {
    name: "color.border.subtle",
    variable: "--tcrn-color-border-subtle",
    value: "#d7e0e8",
    group: "color",
    description: "Low-emphasis component boundary."
  },
  {
    name: "color.border.strong",
    variable: "--tcrn-color-border-strong",
    value: "#b8c8d6",
    group: "color",
    description: "Control boundary and table rule."
  },
  {
    name: "color.brand.teal",
    variable: "--tcrn-color-brand-teal",
    value: "#2f8fa3",
    group: "color",
    description: "Legacy aqua support accent retained for compatibility."
  },
  {
    name: "color.brand.primary",
    variable: "--tcrn-color-brand-primary",
    value: "#5865d8",
    group: "color",
    description: "Primary iris-blue brand color for TCRN identity, selected navigation, and professional creator-channel emphasis."
  },
  {
    name: "color.brand.primary.bg",
    variable: "--tcrn-color-brand-primary-bg",
    value: "#eef0ff",
    group: "color",
    description: "Quiet iris-blue background for selected surfaces and brand callouts."
  },
  {
    name: "color.brand.secondary",
    variable: "--tcrn-color-brand-secondary",
    value: "#2f8fa3",
    group: "color",
    description: "Aqua support color for system connection, informational emphasis, and charts."
  },
  {
    name: "color.brand.secondary.bg",
    variable: "--tcrn-color-brand-secondary-bg",
    value: "#e4f7f9",
    group: "color",
    description: "Quiet secondary background for informational surfaces."
  },
  {
    name: "color.brand.accent",
    variable: "--tcrn-color-brand-accent",
    value: "#c96a7e",
    group: "color",
    description: "Restrained rose-coral accent for creator-channel warmth, highlights, and onboarding emphasis."
  },
  {
    name: "color.brand.accent.bg",
    variable: "--tcrn-color-brand-accent-bg",
    value: "#fcebf0",
    group: "color",
    description: "Quiet rose-coral background for sparing highlight surfaces."
  },
  {
    name: "color.brand.neutral",
    variable: "--tcrn-color-brand-neutral",
    value: "#536579",
    group: "color",
    description: "Neutral brand support for dense operational structure."
  },
  {
    name: "color.brand.neutral.bg",
    variable: "--tcrn-color-brand-neutral-bg",
    value: "#edf4f7",
    group: "color",
    description: "Neutral support background for muted structure and chips."
  },
  {
    name: "color.focus.ring",
    variable: "--tcrn-color-focus-ring",
    value: "#5865d8",
    group: "color",
    description: "Visible focus outline for keyboard navigation."
  },
  {
    name: "color.focus.ring.calibrated",
    variable: "--tcrn-color-focus-ring-calibrated",
    value: "#0056a4",
    group: "color",
    description: "Measured solid focus ring candidate for neutral calibration surfaces; preserves visible focus and is not auto-applied."
  },
  {
    name: "color.progress.track.calibrated",
    variable: "--tcrn-color-progress-track-calibrated",
    value: "#eeeeee",
    group: "color",
    description: "Measured neutral progress track for local visual calibration evidence."
  },
  {
    name: "color.progress.fill.start.calibrated",
    variable: "--tcrn-color-progress-fill-start-calibrated",
    value: "#2784d5",
    group: "color",
    description: "Measured progress fill start for local visual calibration evidence."
  },
  {
    name: "color.progress.fill.end.calibrated",
    variable: "--tcrn-color-progress-fill-end-calibrated",
    value: "#6363c6",
    group: "color",
    description: "Measured progress fill end for local visual calibration evidence."
  },
  {
    name: "color.state.ready",
    variable: "--tcrn-color-state-ready",
    value: "#147a46",
    group: "color",
    description: "Local-ready or fixture-ready state foreground."
  },
  {
    name: "color.state.ready.bg",
    variable: "--tcrn-color-state-ready-bg",
    value: "#dff7ea",
    group: "color",
    description: "Local-ready or fixture-ready state background."
  },
  {
    name: "color.state.blocked",
    variable: "--tcrn-color-state-blocked",
    value: "#ad211c",
    group: "color",
    description: "Blocked or denied state foreground."
  },
  {
    name: "color.state.blocked.bg",
    variable: "--tcrn-color-state-blocked-bg",
    value: "#ffe7e3",
    group: "color",
    description: "Blocked or denied state background."
  },
  {
    name: "color.state.warning",
    variable: "--tcrn-color-state-warning",
    value: "#7a4e00",
    group: "color",
    description: "Evidence required or pending proof foreground."
  },
  {
    name: "color.state.warning.bg",
    variable: "--tcrn-color-state-warning-bg",
    value: "#fff1d6",
    group: "color",
    description: "Evidence required or pending proof background."
  },
  {
    name: "color.state.warning.calibrated",
    variable: "--tcrn-color-state-warning-calibrated",
    value: "#604200",
    group: "color",
    description: "Measured warning foreground candidate for calibrated state surfaces; not auto-applied."
  },
  {
    name: "color.state.warning.calibrated.bg",
    variable: "--tcrn-color-state-warning-calibrated-bg",
    value: "#fde1a7",
    group: "color",
    description: "Measured warning background candidate for calibrated state surfaces; not auto-applied."
  },
  {
    name: "color.state.danger.calibrated",
    variable: "--tcrn-color-state-danger-calibrated",
    value: "#742e2b",
    group: "color",
    description: "Measured danger foreground candidate for calibrated state surfaces; not auto-applied."
  },
  {
    name: "color.state.danger.calibrated.bg",
    variable: "--tcrn-color-state-danger-calibrated-bg",
    value: "#ffd1ca",
    group: "color",
    description: "Measured danger background candidate for calibrated state surfaces; not auto-applied."
  },
  {
    name: "typography.family.ui",
    variable: "--tcrn-type-family-ui",
    value: "Inter, Avenir Next, Helvetica Neue, Arial, sans-serif",
    group: "typography",
    description: "Runtime UI stack. Inter is the distributable font; platform fonts are fallback references only."
  },
  {
    name: "typography.family.latin",
    variable: "--tcrn-type-family-latin",
    value: "Inter, Avenir Next, Helvetica Neue, Arial, sans-serif",
    group: "typography",
    description: "Latin runtime stack. Inter is distributable; Apple and Microsoft names are platform fallback only."
  },
  {
    name: "typography.family.distributable.latin",
    variable: "--tcrn-type-family-distributable-latin",
    value: "Inter, sans-serif",
    group: "typography",
    description: "Redistributable Latin font stack for package assets, self-hosting, and product bundling."
  },
  {
    name: "typography.family.distributable.zhCN",
    variable: "--tcrn-type-family-distributable-zh-cn",
    value: "Noto Sans CJK SC, Source Han Sans SC, sans-serif",
    group: "typography",
    description: "Redistributable Simplified Chinese CJK stack for package assets, self-hosting, and product bundling."
  },
  {
    name: "typography.family.distributable.ja",
    variable: "--tcrn-type-family-distributable-ja",
    value: "Noto Sans CJK JP, Source Han Sans JP, sans-serif",
    group: "typography",
    description: "Redistributable Japanese CJK stack for package assets, self-hosting, and product bundling."
  },
  {
    name: "typography.family.distributable.ko",
    variable: "--tcrn-type-family-distributable-ko",
    value: "Noto Sans CJK KR, Source Han Sans KR, sans-serif",
    group: "typography",
    description: "Redistributable Korean CJK stack for package assets, self-hosting, and product bundling."
  },
  {
    name: "typography.family.distributable.mono",
    variable: "--tcrn-type-family-distributable-mono",
    value: "Liberation Mono, monospace",
    group: "typography",
    description: "Redistributable monospace font stack for package assets, self-hosting, and product bundling."
  },
  {
    name: "typography.family.zhCN",
    variable: "--tcrn-type-family-zh-cn",
    value: "PingFang SC, Microsoft YaHei, Noto Sans CJK SC, Source Han Sans SC, Heiti SC, sans-serif",
    group: "typography",
    description: "Simplified Chinese runtime stack. Platform fonts are fallback references only; do not redistribute them."
  },
  {
    name: "typography.family.ja",
    variable: "--tcrn-type-family-ja",
    value: "Hiragino Sans, Yu Gothic, Noto Sans CJK JP, Source Han Sans JP, Meiryo, sans-serif",
    group: "typography",
    description: "Japanese runtime stack. Platform fonts are fallback references only; do not redistribute them."
  },
  {
    name: "typography.family.ko",
    variable: "--tcrn-type-family-ko",
    value: "Apple SD Gothic Neo, Malgun Gothic, Noto Sans CJK KR, Source Han Sans KR, sans-serif",
    group: "typography",
    description: "Korean runtime stack. Platform fonts are fallback references only; do not redistribute them."
  },
  {
    name: "typography.family.mono",
    variable: "--tcrn-type-family-mono",
    value: "SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace",
    group: "typography",
    description: "Runtime monospace stack. Liberation Mono is distributable; system monospace names are fallback only."
  },
  {
    name: "typography.size.ui",
    variable: "--tcrn-type-size-ui",
    value: "13px",
    group: "typography",
    description: "Default dense UI text size."
  },
  {
    name: "typography.size.reading",
    variable: "--tcrn-type-size-reading",
    value: "14px",
    group: "typography",
    description: "Readable prose text role size for proof-gated explanatory copy; not auto-applied to dense UI."
  },
  {
    name: "typography.size.caption",
    variable: "--tcrn-type-size-caption",
    value: "11px",
    group: "typography",
    description: "Caption and metadata text size."
  },
  {
    name: "typography.size.body",
    variable: "--tcrn-type-size-body",
    value: "13px",
    group: "typography",
    description: "Default body copy and table text size."
  },
  {
    name: "typography.size.control",
    variable: "--tcrn-type-size-control",
    value: "13px",
    group: "typography",
    description: "Button, input, tab, and compact control text size."
  },
  {
    name: "typography.size.section",
    variable: "--tcrn-type-size-section",
    value: "18px",
    group: "typography",
    description: "Section and story heading text size."
  },
  {
    name: "typography.size.page",
    variable: "--tcrn-type-size-page",
    value: "28px",
    group: "typography",
    description: "Page title text size for documentation and product shells."
  },
  {
    name: "typography.line.ui",
    variable: "--tcrn-type-line-ui",
    value: "1.35",
    group: "typography",
    description: "Default UI line height."
  },
  {
    name: "typography.line.reading",
    variable: "--tcrn-type-line-reading",
    value: "1.45",
    group: "typography",
    description: "Readable prose text role line height for proof-gated explanatory copy."
  },
  {
    name: "typography.line.caption",
    variable: "--tcrn-type-line-caption",
    value: "1.35",
    group: "typography",
    description: "Caption and metadata line height."
  },
  {
    name: "typography.line.body",
    variable: "--tcrn-type-line-body",
    value: "1.45",
    group: "typography",
    description: "Readable body copy line height."
  },
  {
    name: "typography.line.control",
    variable: "--tcrn-type-line-control",
    value: "1.2",
    group: "typography",
    description: "Compact control text line height."
  },
  {
    name: "typography.line.section",
    variable: "--tcrn-type-line-section",
    value: "1.25",
    group: "typography",
    description: "Section heading line height."
  },
  {
    name: "typography.line.page",
    variable: "--tcrn-type-line-page",
    value: "1.3",
    group: "typography",
    description: "Page heading line height."
  },
  {
    name: "typography.weight.regular",
    variable: "--tcrn-type-weight-regular",
    value: "400",
    group: "typography",
    description: "Default body text weight."
  },
  {
    name: "typography.weight.medium",
    variable: "--tcrn-type-weight-medium",
    value: "600",
    group: "typography",
    description: "Control label and compact heading weight."
  },
  {
    name: "typography.weight.strong",
    variable: "--tcrn-type-weight-strong",
    value: "700",
    group: "typography",
    description: "Section and page heading weight."
  },
  {
    name: "typography.role.bodyDense",
    variable: "--tcrn-text-body-dense",
    value: "var(--tcrn-type-weight-regular) var(--tcrn-type-size-ui)/var(--tcrn-type-line-ui) var(--tcrn-type-family-ui)",
    group: "typography",
    description: "Composite dense UI body role; preserves 13px operational surfaces."
  },
  {
    name: "typography.role.bodyReading",
    variable: "--tcrn-text-body-reading",
    value: "var(--tcrn-type-weight-regular) var(--tcrn-type-size-reading)/var(--tcrn-type-line-reading) var(--tcrn-type-family-ui)",
    group: "typography",
    description: "Composite readable prose role for proof-gated explanatory copy; not auto-applied."
  },
  {
    name: "space.2",
    variable: "--tcrn-space-2",
    value: "8px",
    group: "space",
    description: "Compact gap for adjacent controls."
  },
  {
    name: "density.compact.rowHeight",
    variable: "--tcrn-density-compact-row-height",
    value: "36px",
    group: "space",
    description: "Compact table/list row height for repeated operational scanning."
  },
  {
    name: "space.4",
    variable: "--tcrn-space-4",
    value: "16px",
    group: "space",
    description: "Panel interior spacing."
  },
  {
    name: "radius.control",
    variable: "--tcrn-radius-control",
    value: "5px",
    group: "radius",
    description: "Default control radius."
  },
  {
    name: "radius.surface",
    variable: "--tcrn-radius-surface",
    value: "8px",
    group: "radius",
    description: "Panel and card radius for framed surfaces."
  },
  {
    name: "elevation.focus",
    variable: "--tcrn-elevation-focus",
    value: "0 0 0 3px rgba(88, 101, 216, 0.2)",
    group: "elevation",
    description: "Accessible focus halo."
  },
  {
    name: "motion.fast",
    variable: "--tcrn-motion-fast",
    value: "120ms ease",
    group: "motion",
    description: "Fast state transition."
  },
  {
    name: "motion.instant",
    variable: "--tcrn-motion-instant",
    value: "80ms ease-out",
    group: "motion",
    description: "Immediate press, focus, or affordance feedback."
  },
  {
    name: "motion.standard",
    variable: "--tcrn-motion-standard",
    value: "160ms ease",
    group: "motion",
    description: "Default hover, selection, and lightweight surface transition."
  },
  {
    name: "motion.emphasis",
    variable: "--tcrn-motion-emphasis",
    value: "220ms cubic-bezier(0.2, 0, 0.2, 1)",
    group: "motion",
    description: "Drawer, dialog, and high-attention transition."
  },
  {
    name: "motion.loading.loop",
    variable: "--tcrn-motion-loading-loop",
    value: "900ms linear",
    group: "motion",
    description: "Looping loading indicator duration; requires visible status copy."
  },
  {
    name: "motion.skeleton.loop",
    variable: "--tcrn-motion-skeleton-loop",
    value: "1400ms ease-in-out",
    group: "motion",
    description: "Skeleton placeholder shimmer duration with reduced-motion fallback."
  },
  {
    name: "motion.progress.loop",
    variable: "--tcrn-motion-progress-loop",
    value: "1200ms ease-in-out",
    group: "motion",
    description: "Indeterminate progress duration; cannot replace proof copy."
  },
  {
    name: "motion.reduced.duration",
    variable: "--tcrn-motion-reduced-duration",
    value: "0.01ms",
    group: "motion",
    description: "Reduced-motion duration token for internal-alpha motion proof."
  },
  {
    name: "zIndex.overlay",
    variable: "--tcrn-z-overlay",
    value: "30",
    group: "zIndex",
    description: "Overlay and drawer layer."
  },
  {
    name: "zIndex.popover",
    variable: "--tcrn-z-popover",
    value: "20",
    group: "zIndex",
    description: "Popover and menu layer below drawers/dialogs."
  },
  {
    name: "container.readable",
    variable: "--tcrn-container-readable",
    value: "1120px",
    group: "container",
    description: "Readable content max width."
  }
] as const satisfies readonly DesignToken[];

export const tcrnDarkThemeTokens = [
  { variable: "--tcrn-color-text-primary", value: "#f2f7ff", description: "Dark-mode primary text." },
  { variable: "--tcrn-color-text-secondary", value: "#bdcae0", description: "Dark-mode secondary text." },
  { variable: "--tcrn-color-text-muted", value: "#8fa2ba", description: "Dark-mode disabled and muted text." },
  { variable: "--tcrn-color-surface-canvas", value: "#121a2a", description: "Dark-mode deep navy canvas." },
  { variable: "--tcrn-color-surface-panel", value: "#182437", description: "Dark-mode blue-gray panel surface." },
  { variable: "--tcrn-color-surface-muted", value: "#223149", description: "Dark-mode cool muted surface." },
  { variable: "--tcrn-color-neutral-calibration-canvas", value: "#161616", description: "Dark-mode neutral calibration canvas." },
  { variable: "--tcrn-color-neutral-calibration-panel", value: "#222222", description: "Dark-mode neutral calibration panel." },
  { variable: "--tcrn-color-neutral-calibration-muted", value: "#2f2f2f", description: "Dark-mode neutral calibration muted surface." },
  { variable: "--tcrn-color-neutral-calibration-border", value: "#808080", description: "Dark-mode neutral calibration boundary." },
  { variable: "--tcrn-color-border-subtle", value: "#344963", description: "Dark-mode low-emphasis blue-gray boundary." },
  { variable: "--tcrn-color-border-strong", value: "#5f7894", description: "Dark-mode control boundary." },
  { variable: "--tcrn-color-brand-teal", value: "#79d1da", description: "Dark-mode legacy aqua support accent." },
  { variable: "--tcrn-color-brand-primary", value: "#a7b0ff", description: "Dark-mode primary iris-blue brand color." },
  { variable: "--tcrn-color-brand-primary-bg", value: "#25345f", description: "Dark-mode quiet iris-blue background." },
  { variable: "--tcrn-color-brand-secondary", value: "#79d1da", description: "Dark-mode aqua support color." },
  { variable: "--tcrn-color-brand-secondary-bg", value: "#133946", description: "Dark-mode quiet aqua background." },
  { variable: "--tcrn-color-brand-accent", value: "#f2a3b5", description: "Dark-mode rose-coral accent brand color." },
  { variable: "--tcrn-color-brand-accent-bg", value: "#44252f", description: "Dark-mode quiet rose-coral accent background." },
  { variable: "--tcrn-color-brand-neutral", value: "#b7c3ce", description: "Dark-mode neutral support color." },
  { variable: "--tcrn-color-brand-neutral-bg", value: "#223149", description: "Dark-mode neutral support background." },
  { variable: "--tcrn-color-focus-ring", value: "#b5baff", description: "Dark-mode keyboard focus outline." },
  { variable: "--tcrn-color-focus-ring-calibrated", value: "#5cb3ff", description: "Dark-mode measured solid focus ring candidate." },
  { variable: "--tcrn-color-progress-track-calibrated", value: "#222222", description: "Dark-mode measured progress track." },
  { variable: "--tcrn-color-progress-fill-start-calibrated", value: "#2784d5", description: "Dark-mode measured progress fill start." },
  { variable: "--tcrn-color-progress-fill-end-calibrated", value: "#8d92f9", description: "Dark-mode measured progress fill end." },
  { variable: "--tcrn-color-state-ready", value: "#6dd69a", description: "Dark-mode ready foreground." },
  { variable: "--tcrn-color-state-ready-bg", value: "#123a2a", description: "Dark-mode ready background." },
  { variable: "--tcrn-color-state-blocked", value: "#ff8a7f", description: "Dark-mode blocked foreground." },
  { variable: "--tcrn-color-state-blocked-bg", value: "#4a1d1b", description: "Dark-mode blocked background." },
  { variable: "--tcrn-color-state-warning", value: "#ffd27a", description: "Dark-mode warning foreground." },
  { variable: "--tcrn-color-state-warning-bg", value: "#3f2f12", description: "Dark-mode warning background." },
  { variable: "--tcrn-color-state-warning-calibrated", value: "#604200", description: "Dark-mode measured warning foreground candidate." },
  { variable: "--tcrn-color-state-warning-calibrated-bg", value: "#fde1a7", description: "Dark-mode measured warning background candidate." },
  { variable: "--tcrn-color-state-danger-calibrated", value: "#742e2b", description: "Dark-mode measured danger foreground candidate." },
  { variable: "--tcrn-color-state-danger-calibrated-bg", value: "#ffd1ca", description: "Dark-mode measured danger background candidate." },
  { variable: "--tcrn-elevation-focus", value: "0 0 0 3px rgba(181, 186, 255, 0.24)", description: "Dark-mode accessible focus halo." }
] as const satisfies readonly ThemeTokenOverride[];

export function createTokenMap(tokens: readonly DesignToken[] = tcrnTokens): Record<string, string> {
  return Object.fromEntries(tokens.map((token) => [token.variable, token.value]));
}

export function createCssVariables(tokens: readonly DesignToken[] = tcrnTokens): string {
  return `:root {\n${tokens.map((token) => `  ${token.variable}: ${token.value};`).join("\n")}\n}\n`;
}

export function createThemeCssVariables(theme: ThemeMode): string {
  if (theme === "light") {
    return createCssVariables();
  }
  return `[data-tcrn-theme="dark"] {\n${tcrnDarkThemeTokens.map((token) => `  ${token.variable}: ${token.value};`).join("\n")}\n}\n`;
}

export const tcrnDarkThemeCss = createThemeCssVariables("dark");
export const tcrnTokenCss = `${createCssVariables()}${tcrnDarkThemeCss}`;
