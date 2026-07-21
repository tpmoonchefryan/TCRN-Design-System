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
    value: "#1c1d21",
    group: "color",
    description: "Primary body and dense operational text."
  },
  {
    name: "color.text.secondary",
    variable: "--tcrn-color-text-secondary",
    value: "#55575e",
    group: "color",
    description: "Secondary labels and supporting operational text."
  },
  {
    name: "color.text.muted",
    variable: "--tcrn-color-text-muted",
    value: "#8a8c93",
    group: "color",
    description: "Muted text for disabled or unavailable controls."
  },
  {
    name: "color.text.tertiary",
    variable: "--tcrn-color-text-tertiary",
    value: "#73757c",
    group: "color",
    description: "Tertiary metadata text: keys, timestamps, and row-level attribution."
  },
  {
    name: "color.text.inverse",
    variable: "--tcrn-color-text-inverse",
    value: "#fafaf9",
    group: "color",
    description: "Text on filled accent surfaces."
  },
  {
    name: "color.surface.canvas",
    variable: "--tcrn-color-surface-canvas",
    value: "#fafaf9",
    group: "color",
    description: "App canvas background: warm-neutral graphite paper for operational work surfaces."
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
    value: "#f2f2f0",
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
    value: "#e7e7e3",
    group: "color",
    description: "Low-emphasis component boundary; carries elevation in place of shadow."
  },
  {
    name: "color.border.strong",
    variable: "--tcrn-color-border-strong",
    value: "#cfcfc9",
    group: "color",
    description: "Control boundary and table rule."
  },
  {
    name: "color.border.control",
    variable: "--tcrn-color-border-control",
    value: "#8e8e88",
    group: "color",
    description: "Interactive control boundary (input, select, secondary button). Meets WCAG 1.4.11 3:1 against panel and canvas; distinct from the lighter structural rules above, which carry no contrast duty."
  },
  {
    name: "color.brand.teal",
    variable: "--tcrn-color-brand-teal",
    value: "#17707f",
    group: "color",
    description: "Legacy aqua support accent, aligned to the purified brand teal."
  },
  {
    name: "color.brand.primary",
    variable: "--tcrn-color-brand-primary",
    value: "#17707f",
    group: "color",
    description: "Primary brand teal: the single accent of the quiet-instrument base."
  },
  {
    name: "color.brand.primary.bg",
    variable: "--tcrn-color-brand-primary-bg",
    value: "#e6f1f3",
    group: "color",
    description: "Quiet teal background for selected surfaces and brand callouts."
  },
  {
    name: "color.brand.secondary",
    variable: "--tcrn-color-brand-secondary",
    value: "#2a6b76",
    group: "color",
    description: "Deep teal support color for system connection and charts."
  },
  {
    name: "color.brand.secondary.bg",
    variable: "--tcrn-color-brand-secondary-bg",
    value: "#e3eff1",
    group: "color",
    description: "Quiet secondary background for informational surfaces."
  },
  {
    name: "color.brand.accent",
    variable: "--tcrn-color-brand-accent",
    value: "#93332a",
    group: "color",
    description: "Stamp oxblood: identity-moment accent (gate close, ruling, release acceptance)."
  },
  {
    name: "color.brand.accent.bg",
    variable: "--tcrn-color-brand-accent-bg",
    value: "#f5e9e5",
    group: "color",
    description: "Quiet oxblood background for sparing identity-moment surfaces."
  },
  {
    name: "color.brand.neutral",
    variable: "--tcrn-color-brand-neutral",
    value: "#55575e",
    group: "color",
    description: "Neutral brand support for dense operational structure."
  },
  {
    name: "color.brand.neutral.bg",
    variable: "--tcrn-color-brand-neutral-bg",
    value: "#f2f2f0",
    group: "color",
    description: "Neutral support background for muted structure and chips."
  },
  {
    name: "color.focus.ring",
    variable: "--tcrn-color-focus-ring",
    value: "#17707f",
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
    value: "#15693a",
    group: "color",
    description: "Local-ready or fixture-ready state foreground."
  },
  {
    name: "color.state.ready.bg",
    variable: "--tcrn-color-state-ready-bg",
    value: "#eaf2ec",
    group: "color",
    description: "Local-ready state background: low-noise wash, not a pastel fill."
  },
  {
    name: "color.state.blocked",
    variable: "--tcrn-color-state-blocked",
    value: "#b3271e",
    group: "color",
    description: "Blocked state foreground."
  },
  {
    name: "color.state.blocked.bg",
    variable: "--tcrn-color-state-blocked-bg",
    value: "#f7eae8",
    group: "color",
    description: "Blocked state background: low-noise wash."
  },
  {
    name: "color.state.warning",
    variable: "--tcrn-color-state-warning",
    value: "#8a5a08",
    group: "color",
    description: "Warning state foreground."
  },
  {
    name: "color.state.warning.bg",
    variable: "--tcrn-color-state-warning-bg",
    value: "#f5eee1",
    group: "color",
    description: "Warning state background: low-noise wash."
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
    name: "typography.family.stamp",
    variable: "--tcrn-type-family-stamp",
    value: "Source Serif 4, Songti SC, Noto Serif CJK SC, Georgia, serif",
    group: "typography",
    description: "Identity-moment serif for stamp titles and rulings. Restricted to the identity whitelist (gate close, ruling, release acceptance); never used for data or dense body text."
  },
  {
    name: "typography.family.distributable.stamp.latin",
    variable: "--tcrn-type-family-distributable-stamp-latin",
    value: "Source Serif 4, serif",
    group: "typography",
    description: "Bundleable Latin stamp serif (SIL OFL-1.1). Reserved Font Name applies: a modified build must be renamed."
  },
  {
    name: "typography.family.distributable.stamp.zhCN",
    variable: "--tcrn-type-family-distributable-stamp-zh-cn",
    value: "Noto Serif CJK SC, serif",
    group: "typography",
    description: "Bundleable Simplified-Chinese stamp serif (SIL OFL-1.1). Reserved Font Name applies."
  },
  {
    name: "typography.size.stamp.min",
    variable: "--tcrn-type-size-stamp-min",
    value: "12px",
    group: "typography",
    description: "Floor for stamp type. Below this the CJK serif loses its strokes on standard-density displays, which is why the whitelist keeps data rows on the sans face."
  },
  {
    name: "typography.tracking.stamp",
    variable: "--tcrn-type-tracking-stamp",
    value: "0.06em",
    group: "typography",
    description: "Stamp letter-spacing: opens small-caps enough to read as an impression rather than a label."
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
    name: "radius.panel",
    variable: "--tcrn-radius-panel",
    value: "6px",
    group: "radius",
    description: "Panel and popover corner radius; matches radius.surface so panels and surfaces share one silhouette."
  },
  {
    name: "elevation.floating",
    variable: "--tcrn-elevation-floating",
    value: "0 1px 2px rgba(28, 29, 33, 0.06), 0 0 0 1px var(--tcrn-color-border-subtle)",
    group: "elevation",
    description: "Floating layer (popover, menu, toast). Elevation is drawn as a hairline with a whisper of shadow, never a soft cloud: the quiet-instrument base separates layers by edge, not by blur."
  },
  {
    name: "state.dot.size",
    variable: "--tcrn-state-dot-size",
    value: "6px",
    group: "space",
    description: "Ink-dot diameter in a status chip. State reads as dot plus word, so the chip needs no saturated fill."
  },
  {
    name: "state.chip.padding",
    variable: "--tcrn-state-chip-padding",
    value: "3px 8px 3px 6px",
    group: "space",
    description: "Status chip padding, asymmetric to close the optical gap the leading ink dot opens."
  },
  {
    name: "state.chip.radius",
    variable: "--tcrn-state-chip-radius",
    value: "4px",
    group: "radius",
    description: "Status chip radius. Squared to the control family — a pill would read as a marketing badge, not an instrument reading."
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
    value: "4px",
    group: "radius",
    description: "Default control radius."
  },
  {
    name: "radius.surface",
    variable: "--tcrn-radius-surface",
    value: "6px",
    group: "radius",
    description: "Panel and card radius for framed surfaces."
  },
  {
    name: "elevation.focus",
    variable: "--tcrn-elevation-focus",
    value: "0 0 0 2px #fafaf9, 0 0 0 4px #17707f",
    group: "elevation",
    description: "Accessible focus halo: canvas gap plus solid ring (elevation is drawn, never blurred)."
  },
  {
    name: "motion.ease.out",
    variable: "--tcrn-motion-ease-out",
    value: "cubic-bezier(0.23, 1, 0.32, 1)",
    group: "motion",
    description: "Strong ease-out for anything entering or leaving. The default curve of the system."
  },
  {
    name: "motion.ease.inOut",
    variable: "--tcrn-motion-ease-in-out",
    value: "cubic-bezier(0.77, 0, 0.175, 1)",
    group: "motion",
    description: "Strong ease-in-out for elements moving or morphing on screen while remaining visible."
  },
  {
    name: "motion.ease.drawer",
    variable: "--tcrn-motion-ease-drawer",
    value: "cubic-bezier(0.32, 0.72, 0, 1)",
    group: "motion",
    description: "Drawer and sheet curve for large surfaces travelling a long distance."
  },
  {
    name: "motion.comprehension",
    variable: "--tcrn-motion-comprehension",
    value: "160ms linear",
    group: "motion",
    description: "Opacity and colour transitions that SURVIVE prefers-reduced-motion. Reduced motion removes travel, not the cue that something changed."
  },
  {
    name: "motion.press.scale",
    variable: "--tcrn-motion-press-scale",
    value: "0.97",
    group: "motion",
    description: "Scale applied on :active. A pressable surface must visibly answer the press; subtle is the point (0.95-0.98)."
  },
  {
    name: "motion.spring.duration",
    variable: "--tcrn-motion-spring-duration",
    value: "0.5s",
    group: "motion",
    description: "Spring duration for gesture-driven and floating surfaces (direction C contribution to the baseline)."
  },
  {
    name: "motion.spring.bounce",
    variable: "--tcrn-motion-spring-bounce",
    value: "0.15",
    group: "motion",
    description: "Spring bounce for gesture-driven surfaces. Kept low: bounce belongs to drag-to-dismiss, not to an instrument panel."
  },
  {
    name: "motion.fast",
    variable: "--tcrn-motion-fast",
    value: "120ms cubic-bezier(0.23, 1, 0.32, 1)",
    group: "motion",
    description: "Fast interface response (hover, chip, small state change). Strong ease-out so the first frame moves."
  },
  {
    name: "motion.instant",
    variable: "--tcrn-motion-instant",
    value: "80ms cubic-bezier(0.23, 1, 0.32, 1)",
    group: "motion",
    description: "Near-instant feedback for press and toggle states."
  },
  {
    name: "motion.standard",
    variable: "--tcrn-motion-standard",
    value: "160ms cubic-bezier(0.23, 1, 0.32, 1)",
    group: "motion",
    description: "Standard entry/exit for menus, popovers, and inline reveals."
  },
  {
    name: "motion.emphasis",
    variable: "--tcrn-motion-emphasis",
    value: "220ms cubic-bezier(0.32, 0.72, 0, 1)",
    group: "motion",
    description: "Emphasis movement for drawers and panels: the iOS-style drawer curve, decelerating into rest."
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
    description: "Collapsed duration for POSITIONAL motion only under prefers-reduced-motion. Never apply it to opacity or colour: reduced motion means fewer and gentler animations, not none, and comprehension cues must survive. Pair with --tcrn-motion-comprehension."
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
  { variable: "--tcrn-color-border-control", value: "#66686e", description: "Dark-mode interactive control boundary; meets 3:1 against dark panel and canvas." },
  { variable: "--tcrn-color-text-tertiary", value: "#83858b", description: "Dark-mode tertiary metadata text." },
  { variable: "--tcrn-color-text-inverse", value: "#0e1c20", description: "Dark-mode text on filled accent surfaces." },
  { variable: "--tcrn-color-text-primary", value: "#ececea", description: "Dark-mode primary text." },
  { variable: "--tcrn-color-text-secondary", value: "#a9abb1", description: "Dark-mode secondary text." },
  { variable: "--tcrn-color-text-muted", value: "#7a7c82", description: "Dark-mode disabled and muted text." },
  { variable: "--tcrn-color-surface-canvas", value: "#111214", description: "Dark-mode graphite canvas." },
  { variable: "--tcrn-color-surface-panel", value: "#18191c", description: "Dark-mode panel surface." },
  { variable: "--tcrn-color-surface-muted", value: "#212226", description: "Dark-mode muted surface." },
  { variable: "--tcrn-color-neutral-calibration-canvas", value: "#161616", description: "Dark-mode neutral calibration canvas." },
  { variable: "--tcrn-color-neutral-calibration-panel", value: "#222222", description: "Dark-mode neutral calibration panel." },
  { variable: "--tcrn-color-neutral-calibration-muted", value: "#2f2f2f", description: "Dark-mode neutral calibration muted surface." },
  { variable: "--tcrn-color-neutral-calibration-border", value: "#808080", description: "Dark-mode neutral calibration boundary." },
  { variable: "--tcrn-color-border-subtle", value: "#292b2f", description: "Dark-mode low-emphasis boundary." },
  { variable: "--tcrn-color-border-strong", value: "#3f4147", description: "Dark-mode control boundary." },
  { variable: "--tcrn-color-brand-teal", value: "#62c3d2", description: "Dark-mode aqua support accent." },
  { variable: "--tcrn-color-brand-primary", value: "#62c3d2", description: "Dark-mode primary brand teal." },
  { variable: "--tcrn-color-brand-primary-bg", value: "#12333a", description: "Dark-mode quiet teal background." },
  { variable: "--tcrn-color-brand-secondary", value: "#62c3d2", description: "Dark-mode support teal." },
  { variable: "--tcrn-color-brand-secondary-bg", value: "#12333a", description: "Dark-mode quiet secondary background." },
  { variable: "--tcrn-color-brand-accent", value: "#d98d82", description: "Dark-mode stamp oxblood for identity moments." },
  { variable: "--tcrn-color-brand-accent-bg", value: "#3a211d", description: "Dark-mode quiet oxblood background." },
  { variable: "--tcrn-color-brand-neutral", value: "#a9abb1", description: "Dark-mode neutral support color." },
  { variable: "--tcrn-color-brand-neutral-bg", value: "#212226", description: "Dark-mode neutral support background." },
  { variable: "--tcrn-color-focus-ring", value: "#62c3d2", description: "Dark-mode keyboard focus outline." },
  { variable: "--tcrn-color-focus-ring-calibrated", value: "#5cb3ff", description: "Dark-mode measured solid focus ring candidate." },
  { variable: "--tcrn-color-progress-track-calibrated", value: "#222222", description: "Dark-mode measured progress track." },
  { variable: "--tcrn-color-progress-fill-start-calibrated", value: "#2784d5", description: "Dark-mode measured progress fill start." },
  { variable: "--tcrn-color-progress-fill-end-calibrated", value: "#8d92f9", description: "Dark-mode measured progress fill end." },
  { variable: "--tcrn-color-state-ready", value: "#5fbe8b", description: "Dark-mode ready foreground." },
  { variable: "--tcrn-color-state-ready-bg", value: "#16261e", description: "Dark-mode ready background." },
  { variable: "--tcrn-color-state-blocked", value: "#e0837b", description: "Dark-mode blocked foreground." },
  { variable: "--tcrn-color-state-blocked-bg", value: "#2b1a18", description: "Dark-mode blocked background." },
  { variable: "--tcrn-color-state-warning", value: "#d9ab52", description: "Dark-mode warning foreground." },
  { variable: "--tcrn-color-state-warning-bg", value: "#2a2317", description: "Dark-mode warning background." },
  { variable: "--tcrn-color-state-warning-calibrated", value: "#604200", description: "Dark-mode measured warning foreground candidate." },
  { variable: "--tcrn-color-state-warning-calibrated-bg", value: "#fde1a7", description: "Dark-mode measured warning background candidate." },
  { variable: "--tcrn-color-state-danger-calibrated", value: "#742e2b", description: "Dark-mode measured danger foreground candidate." },
  { variable: "--tcrn-color-state-danger-calibrated-bg", value: "#ffd1ca", description: "Dark-mode measured danger background candidate." },
  { variable: "--tcrn-elevation-focus", value: "0 0 0 2px #111214, 0 0 0 4px #62c3d2", description: "Dark-mode accessible focus halo." }
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
