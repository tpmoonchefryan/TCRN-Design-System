# Batch 3 Components, VoxWard Mark, and Extended Shell Pattern (`4.2.0`)

Status: local `4.2.0` candidate · awaiting Owner visual review and formal publication.

This pattern records the cross-product component families, adopted `voxward` product mark, semantic surface tokens, and `ProductShell` extensions promoted into `@tcrn/ui-tokens` and `@tcrn/ui-react/approved` in `4.2.0`. The pinned Site v2 boards (`01` through `07b`), their 28 normative API entries, and the five built-in documentation locales remain unchanged.

## Adopted Token and Brand Additions

- **Semantic alert and badge surfaces (`@tcrn/ui-tokens`)**:
  - `--tcrn-color-warn-bg`: `rgba(138,90,8,.08)` (`light`), `rgba(217,171,82,.10)` (`dark`), `rgba(235,181,82,.11)` (`halloween`), maintaining `>= 4.5:1` nominal text contrast for `--tcrn-color-warn` across `bg`, `panel`, and `panel-2`.
  - `--tcrn-color-ok-bg`: `rgba(47,107,58,.08)` (`light`), `rgba(111,207,151,.10)` (`dark`), `rgba(109,214,156,.11)` (`halloween`), maintaining `>= 4.5:1` nominal text contrast for `--tcrn-color-ok` across `bg`, `panel`, and `panel-2`.
  - `--tcrn-brand-suffix-voxward`: `#0b6b65` (`light`), `#3fc7b7` (`dark`), `#f58a33` (`halloween`), maintaining `>= 4.5:1` nominal contrast across `bg`, `panel`, and `hover`.
  - `--tcrn-brand-suffix-platform`: `#0b6b65` (`light`), `#3fc7b7` (`dark`), `#f58a33` (`halloween`), maintaining `>= 4.5:1` nominal contrast across `bg`, `panel`, and `hover`.
- **VoxWard brand mark (`productId="voxward"`)**:
  - Registered in `tcrnAdoptedProductMarks` and `tcrnProductMarkIds` alongside the four Site v2 marks (`tms`, `einzbern`, `mana-orchestrate`, `design-system`) across all four renditions (`color`, `mono`, `tile-tint`, `tile-deep`) and five localized taglines (`zh-CN`, `en`, `ja`, `ko`, `fr`).
- **TCRN Platform mother mark (`productId="platform"`)**:
  - Registered in `tcrnAdoptedProductMarks` and `tcrnProductMarkIds` across all four renditions (`color`, `mono`, `tile-tint`, `tile-deep`) and five localized taglines (`zh-CN`, `en`, `ja`, `ko`, `fr`), awaiting Owner visual acceptance.

## Extended `ProductShell` Capabilities

- **Right-hand backoffice navigation group (`align: "end"`)**:
  - `ProductShellNavGroup`, `ProductShellNavItem`, and `ShellPinItem` support `align: "end"` (as well as `rightNavGroups` / `rightNavItems` / `rightPinnedIds`) for secondary/backoffice items anchored before the right utility cluster, separated by a `1x16` vertical divider (`--tcrn-color-line-2`) with equal internal item spacing matching the primary pin group.
  - Navigation items support `external: true` (rendering a trailing external-link glyph with safe `rel="noopener noreferrer"` semantics) and `disabled: true` (`aria-disabled="true"`, non-activating).
- **Optional `topBanner` slot**:
  - Renders immediately beneath the 52 px top strip aligned to the 12 px (`--tcrn-space-3`) horizontal paper edges. When omitted, zero extra vertical space is reserved.
- **Opt-in seasonal theme cycling (`seasonalThemes={["halloween"]}`)**:
  - Keeps default `"light" | "dark"` toggling unchanged unless `seasonalThemes` or `availableThemes` is explicitly provided on `ProductShell`, `ShellThemeToggle`, or `useProductShellController`.

## Adopted Component Families on `@tcrn/ui-react/approved`

Import all adopted components exclusively from `@tcrn/ui-react/approved` alongside `tcrnComponentCss`:

- **Feedback**: `Badge`, `StatusBadge`, `StatusDot`, `InlineAlert`, `EnvironmentBanner`, `StateSurface`, `EmptyState`, `ErrorState`.
- **DataDisplay**: `Card`, `Avatar`, `StatCard`, `TableShell`, `RecordTable`, `TableToolbar`, `KeyValueList`, `StagePipeline`, `RawPayloadBox`.
- **Layout**: `Surface`, `Divider`, `SettingsLayout`, `SplitView`, `CollapsibleRegion`, `SegmentedNav`.
- **Public Site & Editorial**: `PublicSiteHeader`, `PublicSiteFooter`, `EditorialArticle`, `EditorialNote`, `BrandIcon` (`github`, separate from the closed 38-icon `Icon` stroke roster).
- **Overlay**: `Menu`, `Popover`, `Tooltip`, `Dialog`, `ConfirmActionDialog`, `InlineConfirmBar`.

## Geometry and Styling Rules

- **Zero consumer `tcrn-*` overrides**: never author custom `.tcrn-*` selectors or inline `style` overrides on Design System components; compose layout via `Surface`, `Card`, `SettingsLayout`, `SplitView`, and host container rules.
- **Floating overlays (`Menu`, `Popover`)**: portal to `document.body` (`position: fixed`), causing `0px` vertical shift on following document-flow content when opened or closed, and aligning `placement="bottom-end"` right edges within `< 1px` of the trigger right edge.
