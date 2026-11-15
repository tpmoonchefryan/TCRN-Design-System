# Seasonal Halloween Theme Pattern (`halloween`)

Status: local candidate · awaiting Owner visual review and formal release.

This pattern defines an opt-in seasonal Halloween surface palette (`data-tcrn-theme="halloween"`) layered over the pinned Site v2 token system without modifying the default `light` or `dark` themes, formal component geometry, typography, spacing, border radii, icon strokes, or motion timings.

## Boundaries

- **Core shell contract unchanged**: `ShellThemeMode` (`"light" | "dark"`), pinned `light` and `dark` token values, the 28 formal component APIs, and the five built-in documentation locales remain unchanged.
- **Opt-in stylesheet import**: consumers load the seasonal layer explicitly after the core token stylesheet and component stylesheet:
  - `@tcrn/ui-tokens/tokens.css`
  - `@tcrn/ui-tokens/halloween.css`
  - `@tcrn/ui-react/styles.css`
- **Scoped activation**: apply `data-tcrn-theme="halloween"` on an application root, container, or `ProductShell` wrapper alongside `color-scheme: dark` where native form popups inherit color scheme. Portal popups such as `MultiSelect` dropdowns synchronize `data-tcrn-theme="halloween"` automatically from the closest themed ancestor.

## Color Roles and Accessibility Thresholds

The seasonal palette uses deep plum-obsidian canvases paired with warm parchment ink, harvest-amber accent fills/focus rings, sage status green, soft coral danger ink, and twilight-violet / cool-indigo brand suffix tints:

- **Surfaces**: `--tcrn-color-bg` (`#131017`), `--tcrn-color-bg-2` (`#0d0b10`), `--tcrn-color-panel` (`#1b1622`), `--tcrn-color-panel-2` (`#231d2c`).
- **Ink**: `--tcrn-color-ink` (`#f3ece0`), `--tcrn-color-ink-2` (`#beb3a4`), `--tcrn-color-ink-3` (`#968b7e`), preserving nominal text contrast `>= 4.5:1` across `bg`, `panel`, and `panel-2` (including shortcuts on `--tcrn-color-wash`).
- **Accent & Primary Controls**: `--tcrn-color-acc` (`#f58a33`), `--tcrn-color-acc-2` (`#ffa04d`), `--tcrn-color-acc-3` (`#e0761f`), paired with `--tcrn-color-on-acc` (`#1b0d02`) so filled accent buttons retain `>= 4.5:1` contrast (`6.14:1` to `9.40:1`).
- **Control Boundaries & Focus**: `--tcrn-color-line-ctl` (`rgba(245,236,224,.40)`, `>= 3.0:1` on all surface tiers) and `--tcrn-focus-ring` recomposed over `#131017` and `#f58a33`.
- **Elevation**: tight dark-mode shadow blurs (`<= 3px`) with crisp parchment hairline rings (`rgba(245,236,224,.07)` to `.10`).

## Verification Scope

Token completeness (`compareSeasonalThemeBlock`), nominal WCAG AA contrast (`checkSeasonalHalloweenContrast`), body-mounted popup inheritance (`MultiSelect`), and static closure proofs run automatically. Visual acceptance and formal publication require a separate Owner review decision.
