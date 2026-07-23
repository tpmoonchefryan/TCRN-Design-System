# TCRN style scale (radius, spacing, type)

The single source of truth for every visual scale is `packages/ui-tokens/src/index.ts`.
`tokens-sync` regenerates `packages/ui-tokens/src/tokens.css` and the `storybook.css`
`:root` block from it; `createCssVariables()` emits the same tokens into the deployed
docs page. New styles take values from this table — never a raw literal.

## Radius hierarchy

| Role | Token | Value |
|---|---|---|
| Navigation / left indicators | *(none — flat)* | `0` |
| Controls (button, input, chip, toggle) | `--tcrn-radius-control` | `4px` |
| Cards / story containers / framed surfaces | `--tcrn-radius-surface` | `6px` |
| Panels | `--tcrn-radius-panel` | `6px` (alias of surface — kept as a distinct name) |
| Badges / pills / abbreviation dots | `--tcrn-radius-pill` | `999px` |

- The navigation's flat corners (INIT-005) are deliberate and must not regress.
- `state-chip-radius` was retired into `--tcrn-radius-control` (both `4px`).
- `--tcrn-radius-pill` was a dangling token (referenced, never defined, rendering
  square corners) until INIT-006 E4 defined it.

## Spacing scale

A 2px grid from 2px to 20px, plus one large-region step. Half-steps carry an `h`
suffix. Gap and padding values come from this scale.

| Token | Value | | Token | Value |
|---|---|---|---|---|
| `--tcrn-space-0h` | `2px` | | `--tcrn-space-3` | `12px` |
| `--tcrn-space-1` | `4px` | | `--tcrn-space-3h` | `14px` |
| `--tcrn-space-1h` | `6px` | | `--tcrn-space-4` | `16px` |
| `--tcrn-space-2` | `8px` | | `--tcrn-space-4h` | `18px` |
| `--tcrn-space-2h` | `10px` | | `--tcrn-space-5` | `20px` |
| | | | `--tcrn-space-6` | `32px` |

- Odd strays round to the nearest step, ties downward: `3→2`, `5→4`, `7→6`, `9→8`,
  `11→10`.
- Responsive `clamp()` upper bounds (e.g. `clamp(var(--tcrn-space-4h), 1.8vw, 28px)`)
  are fluid layout maxes, not discrete spacing steps; they stay literal and the style
  gate does not treat values inside `clamp()`/`calc()` as spacing literals.

## Type scale

| Token | Value | Role |
|---|---|---|
| `--tcrn-type-size-caption` | `11px` | caption / metadata |
| `--tcrn-type-size-meta` | `12px` | dense metadata: counts, badges, tool labels |
| `--tcrn-type-size-ui` / `-body` / `-control` | `13px` | dense UI / body / control text |
| `--tcrn-type-size-reading` | `14px` | readable prose |
| `--tcrn-type-size-heading-3` | `16px` | h3 |
| `--tcrn-type-size-section` | `18px` | section / story heading |
| `--tcrn-type-size-heading-2` | `22px` | h2 |
| `--tcrn-type-size-page` | `28px` | page title |
| `--tcrn-type-size-stamp-min` | `12px` | stamp floor (CJK serif) |

- `--tcrn-type-size-meta` was a dangling token until INIT-006 E3.
- The `.tcrn-heading--1` fluid clamp `clamp(28px, 3vw, 44px)` stays literal.

## Component CSS lives in the package; the docs keep only demo chrome

The package-truth component stylesheet is the `tcrnComponentCss` template literal in
`packages/ui-react/src/components/Navigation/Navigation.tsx`. Every style for a class that
a real `@tcrn/ui-react` component emits belongs there so downstream consumers get it. The
docs stylesheets (`apps/storybook/src/storybook.css`, `apps/storybook/src/alpha-styles.ts`,
and their shared single source `apps/storybook/src/story-demo-styles.ts`) are presentation
layers only. INIT-007 (TCRN-DS-STORY-037) relocated the 24 genuine component families out
of the docs layer into the package; the shell-fidelity duplicate-selector gate
(`scripts/shell-fidelity-proof.mjs`, `docsPackageSelectorDuplication`) fails closed if a
top-level class selector appears in both `storybook.css` and the package component CSS.

### Demo-chrome exemption list

These classes legitimately stay in the docs demo layer — they are presentation scaffolding
that no shipped component emits, not component styles. A future gate that widens the
duplicate/parallel-implementation check (S035) must treat this set as allowed to live
doc-side, and must not expect them in the package.

- **Story scaffolding:** `.alpha-frame`, `.alpha-story-card`, `.alpha-story-stack`,
  `.tcrn-story-kicker`, `.tcrn-static-section`.
- **Token / scale demos:** `.tcrn-token-swatch*`, `.tcrn-typography-sample`,
  `.tcrn-type-scale-demo*`, `.tcrn-icon-sample*`, `.tcrn-locale-grid`, `.tcrn-locale-card`,
  `.tcrn-theme-preview`.
- **Motion / loading demos:** `.tcrn-motion-demo*` (incl. `@keyframes tcrn-motion-*`),
  `.tcrn-loading-*` (spinner / progress / skeleton demo variants), and the docs-only
  blanket `@media (prefers-reduced-motion: reduce)` `animation-duration` clamp.
- **Layout / grid demos:** `.tcrn-guidance-grid`, `.tcrn-spec-grid`, `.tcrn-guidance-list`,
  `.tcrn-status-cloud`, `.tcrn-form-stack`, `.tcrn-action-row`,
  `.tcrn-display-primitive-grid`, `.tcrn-interaction-primitive-row`,
  `.tcrn-interaction-primitive-grid`, `.tcrn-inline-proof-token`.
- **Changelog demos:** `.tcrn-changelog-records`, `.tcrn-changelog-record*`,
  `.tcrn-changelog-token*`.
- **Shell / doc-chrome demos:** `.tcrn-shell-demo*`, `.tcrn-compact-shell*`,
  `.tcrn-shell-*` (mega-menu, hub, domain, task-lane, quick-rail, layer, density),
  `.tcrn-entry-shell-strip*`, `.tcrn-nav-component-preview`, `.tcrn-package-nav-proof*`,
  `.tcrn-storybook-component-example *` (scoped top-bar / nav-item demos),
  `.tcrn-doc-*` (doc-brand, doc-search-*), `.tcrn-bookmark-*`, `.tcrn-knowledge-shell*`,
  `.tcrn-knowledge-preview*`.
- **Overlay demos / fixtures:** `.tcrn-overlay-mode-matrix`, `.tcrn-overlay-static-modes`,
  `.tcrn-overlay-mode-grid`, `.tcrn-overlay-drawer-grid`, `.tcrn-overlay-mode-card`,
  `.tcrn-overlay-static-card`, `.tcrn-dialog-spec-fixture*`, `.alpha-overlay-demo`,
  `.alpha-overlay-demo__dialog`.
- **Component-scoped demo hooks** (same base class as a package component, but a
  presentation-only variant/hook that the component never emits):
  `.tcrn-input--short` and `.tcrn-search-input--compact` (docs demo widths),
  `.tcrn-filter-bar` (demo tab layout; the package owns it only via the scoped
  `.tcrn-table-toolbar .tcrn-filter-bar` rule, so a top-level `.tcrn-filter-bar` here does
  not duplicate a package selector), and the tooltip static-preview hook
  `.tcrn-tooltip[data-storybook-static-tooltip="true"]` (and its `[data-placement]`
  variants), which forces the revealed state for static docs screenshots.
- **Deferred primitive:** `.tcrn-icon` base rule (Icon-emitted) remains doc-side for now —
  it is outside STORY-037's named 24 families and awaits an explicit Owner call to promote
  or keep it.
