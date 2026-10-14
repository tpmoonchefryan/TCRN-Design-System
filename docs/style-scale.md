# TCRN style scale (radius, spacing, type)

The single source of truth for every visual scale is `packages/ui-tokens/src/index.ts`.
Since the G+ renewal (TCRN-DS-INIT-015) its G+ values are not typed there by hand: they come
from the design contract `docs/design/gplus-2026-10/contract/tokens.json` (and
`typography.json` for the type roles), which `node scripts/contract-generate.mjs` writes into
`packages/ui-tokens/src/gplus-tokens.generated.ts`; change the contract and regenerate, never
the generated file. `tokens-sync` regenerates `packages/ui-tokens/src/tokens.css` and the
`storybook.css` `:root` block from the package; `createCssVariables()` emits the same tokens
into the deployed docs page. New styles take values from these tables — never a raw literal.

## Radius hierarchy

| Role | Token | Value |
|---|---|---|
| Navigation / left indicators | *(none — flat)* | `0` |
| Controls (button, input, select, toggle) | `--tcrn-radius-control` | `8px` |
| Chips and compact controls | `--tcrn-radius-small` | `6px` |
| Panels, popovers, cards, framed surfaces | `--tcrn-radius-panel` | `12px` |
| Cards / story containers (older name) | `--tcrn-radius-surface` | `12px` (carries the panel value) |
| Checkbox box | `--tcrn-radius-check` | `4px` |
| Stamps and badges | `--tcrn-radius-stamp` | `3px` |
| Pills / abbreviation dots | `--tcrn-radius-pill` | `999px` |

- G+ moved the control radius from `4px` to `8px` and the surface radius from `6px` to `12px`
  (contract keys `r-ctl`, `r-sm`, `r-panel`, `r-check`, `r-stamp`).
- The navigation's flat corners (INIT-005) are deliberate and must not regress.
- `state-chip-radius` was retired into `--tcrn-radius-control` (both `4px` at the time).
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

| Token | Size / line | Role |
|---|---|---|
| `--tcrn-type-size-caption` | `11px` / `16px` | caption / metadata |
| `--tcrn-type-size-meta` | `12px` / `16px` | dense metadata: counts, badges, tool labels |
| `--tcrn-type-size-control-sm` | `12px` | small control text |
| `--tcrn-type-size-ui` / `-body` / `-control` | `13px` / `20px` | dense UI / body / control text |
| `--tcrn-type-size-reading` | `14px` / `22px` | readable prose |
| `--tcrn-type-size-control-lg` | `14px` | large control text |
| `--tcrn-type-size-heading-3` | `20px` / `26px` | h3 |
| `--tcrn-type-size-section` | `20px` / `26px` | section / story heading |
| `--tcrn-type-size-heading-2` | `26px` / `30px` | h2 |
| `--tcrn-type-size-page` | `36px` / `40px` | page title (h1) |
| `--tcrn-type-size-stamp-min` | `12px` | stamp floor (CJK serif) |

- `--tcrn-type-size-meta` was a dangling token until INIT-006 E3.
- G+ replaced the `.tcrn-heading--1` fluid clamp with the fixed 36/40 serif step; every
  heading level stays on one line and ends in an ellipsis (see the G+ type roles below).
- Line heights are the matching `--tcrn-type-line-*` tokens; control text uses the unitless
  `--tcrn-type-line-control` (`1.2`) inside the fixed control heights.

## G+ scale (TCRN-DS-INIT-015)

The first-batch families (Typography, Icon, Brand, Actions, Inputs) are drawn on the steps
below. Values are the contract's (`docs/design/gplus-2026-10/contract/tokens.json` and
`typography.json`); the gates named with each table hold them. Gate commands, criteria,
thresholds and exemption registers are listed in `docs/contract/README.md`.

### Type families

| Token | Stack | Use |
|---|---|---|
| `--tcrn-type-family-serif` (also `--tcrn-type-family-heading`) | Source Serif 4, Noto Serif SC, Georgia, serif | headings and numerals |
| `--tcrn-type-family-ui` | Hanken Grotesk, Noto Sans SC, system-ui, sans-serif | UI and body text |
| `--tcrn-type-family-mono` | IBM Plex Mono, ui-monospace, Menlo, monospace | keys, codes, identifiers |

- The faces are vendored in `@tcrn/ui-tokens` (`fonts.css` and `fonts/`); nothing loads from a
  font CDN. `pnpm fonts:proof` checks the files and their licences; `pnpm fonts:render` checks
  in Chromium that each family draws with its vendored face, that a Chinese heading in the
  heading stack falls back to the Noto Serif SC face, and that no page requests a remote font.

### Type roles

| Role | Class | Family | Size / line | Weight | Notes |
|---|---|---|---|---|---|
| Heading 1 | `.tcrn-heading--1` | serif | 36 / 40 | 400 | tracking -0.01em |
| Heading 2 | `.tcrn-heading--2` | serif | 26 / 30 | 400 | tracking -0.005em |
| Heading 3 | `.tcrn-heading--3` | serif | 20 / 26 | 400 | |
| Heading 4 | `.tcrn-heading--4` | ui | 13 / 20 | 600 | |
| Text (default body) | `.tcrn-text`, `.tcrn-text--body` | inherited | 13 / 20 | inherited | secondary ink; `tone="strong"` adds 600 on the primary ink |
| Text reading | `.tcrn-text--reading` | inherited | 14 / 22 | inherited | |
| Text meta | `.tcrn-text--meta` | inherited | 12 / 16 | inherited | tertiary ink |
| Text caption | `.tcrn-text--caption` | inherited | 11 / 16 | inherited | tertiary ink |
| Numeral | `.tcrn-text--numeral` | serif | 26 / 30 | 300 | tabular lining figures; inline 16 / 20, large 44 / 48 |
| Caps label | `.tcrn-text--caps` | ui | 11 / 16 | 500 | uppercase, tracking 0.14em, mono numbering prefix |
| Mono | `.tcrn-text--mono` | mono | 11.5 / 16 | inherited | |

- Headings, numerals and caps labels are single-line roles: they never wrap, end in an
  ellipsis and carry their text as a title (contract clause C7). The rules are generated from
  `typography.json` into `packages/ui-react/src/styles/generated/typography.scale.ts`.

### Controls

| Scale | sm | md (default) | lg |
|---|---|---|---|
| Control height `--tcrn-control-height-*` | `28px` | `32px` | `40px` |
| Inline padding `--tcrn-control-padding-*` | `10px` | `12px` | `16px` |
| Control text `--tcrn-type-size-control*` | `12px` | `13px` | `14px` |
| Icon size `--tcrn-icon-size-*` | `14px` | `16px` | `20px` |

- `Button`, `IconButton` and `LinkButton` take `size="sm" | "md" | "lg"` (default `md`) and take
  the height, inline padding and control text of that step; an `IconButton` is as wide as it is
  high.
- `pnpm geometry:measure` (`controlHeight`) fails a declared control whose height is not 28, 32
  or 40px (0.5px tolerance).

### Elevation: three levels at most

| Token | Level |
|---|---|
| `--tcrn-shadow-s1` | lowest raised surface |
| `--tcrn-shadow-s2` | middle level |
| `--tcrn-shadow-s3` | floating level (menus, popovers); the old `--tcrn-elevation-floating` points here |
| `--tcrn-shadow-edge` | inset 1px edge highlight, not a level |
| `--tcrn-focus-ring` | focus ring: a 2px gap in `--tcrn-color-surface`, then a 2px accent ring |

- There are no other elevation steps, and no shadow layer blurs more than 3px.
  `pnpm geometry:measure` (`shadowBlur`) measures the rendered stories and `pnpm contract:static`
  (C11) reads the package CSS for the same limit. Gradients are on the C11 forbidden list too.
- Light and night values differ per token; both theme blocks declare the same token set (C5).

### Guide column (rail)

- In the shell and in lists, the guide column sits 16px and the text it leads sits 48px from
  the shell edge. `pnpm geometry:measure` (`rail`, 0.5px tolerance) measures both sides on the
  rendered sample stories, as a relation between the real elements rather than a property list
  (clause C17).

### Motion

| Token | Value | Use |
|---|---|---|
| `--tcrn-motion-ease` | `cubic-bezier(.22,1,.36,1)` | the single G+ easing curve |
| `--tcrn-motion-duration-press` | `80ms` | press feedback |
| `--tcrn-motion-duration-fill` | `120ms` | fill and colour changes (hover, state) |
| `--tcrn-motion-duration-move` | `240ms` | movement (menus, panels, indicators) |
| `--tcrn-motion-duration-loop` | `900ms` | looping indicator period |

### Contrast

- Text pairs need 4.5:1, control edges and the focus ring 3:1 in both themes (C1).
  `pnpm tokens:proof` (token-contrast-proof) checks the token pairs and `pnpm geometry:measure`
  (`contrast`) the rendered matrix cells against their board values.

## Component CSS lives in the package; the docs keep only demo chrome

The package-truth component stylesheet is `tcrnComponentCss`. Its rules live in the family
segment modules under `packages/ui-react/src/styles/` (`base`, `typography`, `icon`, `actions`,
`inputs`, `brand`, plus the contract-generated segments in `styles/generated/`), and
`packages/ui-react/src/styles/index.ts` concatenates them in cascade order (TCRN-DS-SUB-010).
Every style for a class that a real `@tcrn/ui-react` component emits belongs there so
downstream consumers get it. The docs stylesheets (`apps/storybook/src/storybook.css`,
`apps/storybook/src/alpha-styles.ts`, and their shared single source
`apps/storybook/src/story-demo-styles.ts`) are presentation layers only: Storybook renders
the package, and the docs layer never repaints a package component.

Three gates hold that line:

- `scripts/doc-shell-class-proof.mjs` collects every `tcrn-*` class the built docs and the
  docs sources write or style, subtracts the classes `tcrnComponentCss` defines, and fails on
  anything left. Documentation-private classes therefore use the `tcrn-doc-` prefix, which the
  gate exempts (TCRN-DS-STORY-128).
- `scripts/shell-fidelity-proof.mjs` (`docsPackageSelectorDuplication`) runs two checks under
  one name:
  - the duplicate-selector check fails when a rule in `storybook.css` or `alpha-styles.ts`
    takes as its key subject a package class that `tcrnComponentCss` also styles, unless that
    class is on the gate's whitelist (`DUPLICATE_SELECTOR_WHITELIST`, listed below);
  - the rule-level guard (TCRN-DS-SUB-065) reads the three docs style sources
    (`storybook.css` with its generated demo layer blanked, `alpha-styles.ts` and
    `story-demo-styles.ts`). A rule whose subject compound carries a package class may declare
    only placement properties (`PLACEMENT_PROPERTIES`: grid placement, `order`, margins, self
    alignment, flex item sizing, inline size and text wrapping); any other property, custom
    properties included, is a finding unless a registered exception
    (`DOC_PACKAGE_CLASS_EXCEPTIONS`, listed below) admits that property for that exact
    selector. For the C7 single-line carriers that `docs/contract/roles.json` registers under
    `singleLine`, the wrapping properties (`white-space`, `overflow-wrap`, `word-break`) do not
    count as placement (TCRN-DS-SUB-102). A registered exception that no rule used is listed
    as `docExceptionsUnused`.
- `scripts/selection-grammar-proof.mjs` reads the same three docs style sources, with the
  package component CSS, for the retired selection shapes.

`scripts/contract-static-proof.mjs` (`pnpm contract:static`) also reads the doc-shell-class
difference as contract clause C13, so the same leak fails both gates (TCRN-DS-STORY-132).

### Demo-chrome exemption list

These classes legitimately stay in the docs demo layer — they are presentation scaffolding
that no shipped component emits, not component styles. Since TCRN-DS-SUB-025 every
documentation-private `tcrn-*` class carries the `tcrn-doc-` prefix; the doc-layer copies of
package components (loading, skeleton, changelog token, typography and locale cards, brand
lockup cards, the shell demo top bars, the dense and compact shell prototypes, the bookmark
nav and the entry strip) were deleted rather than renamed, and the stories render the package
components instead.

- **Story scaffolding:** `.alpha-frame`, `.alpha-story-card`, `.alpha-story-stack`,
  `.tcrn-doc-story-kicker`, `.tcrn-doc-static-section` (and `--category-index`),
  `.tcrn-doc-story-disclosure*`.
- **Token / scale demos:** `.tcrn-doc-token-swatch*`, `.tcrn-doc-token-swatch-grid`,
  `.tcrn-doc-type-scale-demo`, `.tcrn-doc-icon-sample*`, `.tcrn-doc-locale-grid`,
  `.tcrn-doc-theme-preview`.
- **Motion / loading demos:** `.tcrn-doc-motion-demo*` (incl. `@keyframes tcrn-motion-travel`),
  `.tcrn-doc-motion-demo-grid`, `.tcrn-doc-loading-motion-grid`, `.tcrn-doc-loading-card__row`,
  `.tcrn-doc-loading-copy`, and the docs-only blanket
  `@media (prefers-reduced-motion: reduce)` `animation-duration` clamp.
- **Layout / grid demos:** `.tcrn-doc-guidance-grid`, `.tcrn-doc-spec-grid` (and
  `--record-index`), `.tcrn-doc-status-cloud`, `.tcrn-doc-form-stack`, `.tcrn-doc-action-row`,
  `.tcrn-doc-display-primitive-grid`, `.tcrn-doc-interaction-primitive-row`,
  `.tcrn-doc-interaction-primitive-grid`, `.tcrn-doc-reference-strip`.
- **Changelog demos:** `.tcrn-doc-changelog-records`, `.tcrn-doc-changelog-record*`.
- **Reference and brand pages:** `.tcrn-doc-component-reference*`, `.tcrn-doc-reference-index*`,
  `.tcrn-doc-reference-table*`, `.tcrn-doc-brand-system*`, `.tcrn-doc-brand-lockups`.
- **Shell demos and the documentation page:** `.tcrn-doc-nav-component-preview`,
  `.tcrn-doc-package-nav-proof*`, `.tcrn-doc-knowledge-preview*`, and the documentation
  page's own layout in `alpha-styles.ts` (`.tcrn-doc-page*`, `.tcrn-doc-page-head*`,
  `.tcrn-doc-chapter-pager*`, `.tcrn-doc-category-index*` and the rest of `.tcrn-doc-*`). The
  documentation shell itself is the package ProductShell in its top-band state
  (TCRN-DS-SUB-131), so the docs carry no shell chrome of their own.
- **Overlay demos / fixtures:** `.tcrn-doc-overlay-mode-matrix*`,
  `.tcrn-doc-overlay-static-modes`, `.tcrn-doc-overlay-mode-grid`, `.tcrn-doc-overlay-mode-card`,
  `.tcrn-doc-overlay-static-card`, `.tcrn-doc-dialog-spec-fixture*`, `.alpha-overlay-demo`,
  `.alpha-overlay-demo__dialog`.
- **Package components placed by doc scaffolding:** a rule scoped under a `.tcrn-doc-*`
  container may place a package component (the placement properties above: grid placement,
  order, margins, self alignment, flex item sizing, inline size, wrapping) but does not
  repaint it, for example
  `.tcrn-doc-package-nav-proof > .tcrn-segmented-nav { grid-area: tabs; align-self: start; }`.
  The key subjects such placements may take are the shell-fidelity whitelist:
  `.tcrn-side-nav`, `.tcrn-product-switcher`, `.tcrn-segmented-nav`, `.tcrn-field` and
  `.tcrn-tooltip__content`, plus the infra primitive `.tcrn-skip-link` that the
  package-nav proof places; the whitelist's last entry, `.tcrn-filter-bar`, is the demo hook
  described below. The docs shell's verbatim copies of `.tcrn-sr-only` and `.tcrn-skip-link`
  were removed (TCRN-DS-SUB-063), and `.tcrn-brand-wordmark__base` and `.tcrn-brand-wordmark`
  left the whitelist with their last doc rules (TCRN-DS-SUB-063, TCRN-DS-SUB-065), as did
  `.tcrn-nav-group__label` and `.tcrn-nav-item` (TCRN-DS-SUB-132) and
  `.tcrn-product-shell-search__results` (TCRN-DS-SUB-204), each with the registered exceptions
  that needed it, and `.tcrn-top-bar`, `.tcrn-search-input`, `.tcrn-brand-wordmark__suffix`,
  `.tcrn-product-logo__copy`, `.tcrn-shell-brand-lockup`, `.tcrn-shell-brand-lockup__copy` and
  `.tcrn-shell-brand-lockup__caption` (TCRN-DS-SUB-219).
- **Registered exceptions** (`DOC_PACKAGE_CLASS_EXCEPTIONS` in
  `scripts/shell-fidelity-proof.mjs`; each entry names exact selectors and the non-placement
  properties it admits, with a ruling, a reason and a removal condition):
  - `EX-INIT015-doc-tooltip-static-preview`: `opacity` and `transform` on the content of the
    tooltip static-preview hook (one selector per placement variant); goes when the Overlay
    family's batch has the package provide a static revealed state.
  - `EX-INIT015-doc-filter-bar`: `display`, `flex-wrap` and `gap` on the top-level
    `.tcrn-filter-bar` demo hook; goes when the Navigation family's batch gives FilterBar a
    layout of its own.
  - `EX-INIT015-doc-nav-proof-skip-link`: the package-nav proof's skip link, a 1px
    screen-reader box until focused and an inline flex box on focus; goes when the Navigation
    family's batch has the proof render its skip link through the package component.
  - Removed: `EX-INIT015-doc-shell-brand-collapse` and `EX-INIT015-doc-shell-brand-narrow`
    (TCRN-DS-SUB-101); the knowledge-base sample's four entries
    (`EX-INIT015-doc-knowledge-shell-topbar`, `-side-nav`, `-group-title` and `-nav-item`,
    TCRN-DS-SUB-101), when the sample and the documentation shell became the package's
    top-band ProductShell (TCRN-DS-SUB-132); and `EX-INIT015-doc-product-shell-search-static`
    (TCRN-DS-SUB-100), with its doc rule, once no story wrote that doc container any more
    (TCRN-DS-SUB-204).
- **Component-scoped demo hooks** (same base class as a package component, but a
  presentation-only hook that the component never emits): `.tcrn-filter-bar` (demo tab
  layout; the package owns it only via the scoped `.tcrn-table-toolbar .tcrn-filter-bar` rule,
  so a top-level `.tcrn-filter-bar` here does not duplicate a package selector) and the
  tooltip static-preview hook `.tcrn-tooltip[data-storybook-static-tooltip="true"]` (and its
  `[data-placement]` variants), which forces the revealed state for static docs screenshots.
- **Icon base class (promoted):** the `.tcrn-icon` base rule (Icon-emitted) is the
  package's, in `packages/ui-react/src/styles/icon.css.ts` (Icon board section E; design
  session ruling of 2026-10-11 under STORY-128, open to Owner correction). The docs layer
  keeps only sample layout (`.tcrn-doc-icon-sample`, `.tcrn-doc-icon-sample-grid`) and placements
  inside `.tcrn-doc-*` containers, and addresses a package icon there as
  `svg[data-icon-name]`, so no docs rule takes `.tcrn-icon` as its subject and the class is
  not on the shell-fidelity whitelist.

## Settings controls and container thresholds

Settings value controls and configuration layout are package-backed contracts.
The thresholds below are semantic container measurements, not viewport-only
breakpoints:

| Token | Value | Contract |
|---|---:|---|
| `--tcrn-container-settings-split` | `960px` | `SettingsLayout` may place compact local navigation beside one content column. |
| `--tcrn-container-settings-content-stack` | `720px` | The content column stacks each setting row's label, control, and tools. |
| `--tcrn-container-settings-local-nav` | `208px` | Local navigation column width at the split layout. |
| `--tcrn-container-settings-control-min` | `240px` | Minimum control column width in a non-stacked setting row. |
| `--tcrn-container-settings-choice-option` | `112px` | Default minimum width for one binary value option. |
| `--tcrn-container-settings-choice-padding` | `8px` | Inline padding on each edge of a binary value group. |
| `--tcrn-container-settings-number-min` | `12ch` | Minimum numeric-entry width for full legal values and native editing. |

`SettingChoice` maps values to native `Select` when there are more than two
options, when a binary pair lacks finite positive `minInlineSize` measurements, or
when a binary pair does not fit its measured labels and controls. The `112px`
option value is a CSS floor only; it cannot stand in for a current label/control
measurement. A fitting binary pair uses a native `RadioGroup`; `SegmentedNav` is
reserved for navigation. `NumberInput` owns numeric entry; `Stepper` owns process
position.
`SettingsLayout` owns the one-host, one-complete-form composition and never uses
`overflow: hidden` to conceal fields, labels, actions, or long values.
Direct `SettingRow` children remain supported: at the content threshold they
share the complete form's label, control, and tools tracks. `SettingRowList`
owns the shared tracks for an explicit group. Both shapes stack below the same
content threshold, keep empty tools slots aligned, and wrap long labels and
descriptions inside their assigned columns.
`SettingChoice` retains a valid value across radio/Select branch changes in both
controlled (`value`) and uncontrolled (`defaultValue`) modes. Its `onChange`
callback reports actual user value changes once; changing only the available
inline size does not call it.

## Page hierarchy

`PageHierarchy` takes an explicit `depth` and keeps page semantics independent
from container width:

| Depth | Structure | Internal navigation |
|---|---|---|
| `two` | `PageHeader` → parent `SubNav`/`SectionTabs` → lower content | Omitted |
| `three` | `PageHeader` → parent `SubNav`/`SectionTabs` → selected-subpage local navigation + content | Required |

The global `ProductShell` topbar is outside this page composition. The
`--tcrn-container-page-third-level-split` and
`--tcrn-container-page-third-level-nav` tokens only control the responsive
`--tcrn-container-page-third-level-split` is `960px` and `--tcrn-container-page-third-level-nav` is `208px`; these tokens only control the responsive presentation of an already explicit third-level region.

`MultiSelect` is the closed-set collection control. Its ordinary collection dropdown uses the existing Select trigger and Menu option families, keeps selected labels visible when closed, and opens a body-boundary listbox for multiple choice. Native multiple lists and explicit checklists are distinct opt-in presentations, never evidence of a dropdown. Static consumers share `mountStaticMultiSelect` with React; no application-private selector implementation is needed. `SuggestInput` keeps an open
string editable while offering advisory datalist suggestions. `DictionaryTable`
renders category copy once and a required value-specific description for every
entry; empty/unknown rendered content, category-description reuse, duplicate
machine values, and exact duplicate labels/descriptions are invalid.
`resolveFieldValueControl` is the metadata-to-control decision point: it admits
closed single values, closed collections, and open single strings, and rejects an
open collection or a closed field with no options as unsupported.

## Operation feedback and content scopes

`OperationFeedback` uses the existing `StatusBadge` for a short localized phase
label and a controlled `DisclosurePanel` for complete operation identity and
receipt details. The package admits `idle`, `loading`, `success`, and `error`;
their five-locale short labels are Idle / In progress / Completed / Failed;
readiness and proof labels are not operation phases. Long ids, timestamps, and
reason codes wrap in the identity/details region and must not be placed in the compact badge. The native details trigger carries
`aria-expanded` and `aria-controls`, while the root's polite live region
announces updates without moving focus.

`Surface` supplies optional heading and actions slots through its shared wrapping
header. Each slot shrinks within the card, with actions wrapping when their
combined width does not fit. Static consumers use the same header child classes.
`OperationFeedback` identity labels and values both wrap. Structured `pre` details
preserve all whitespace and bytes while wrapping long paths and hashes inside
the disclosure; neither surface clips data to satisfy its container.

`ContentScope` validates one consumer-owned `scope` and `dataSource` at a time.
`content` requires visible items, `empty` requires zero shown items, and
`loading`/`error` remain distinct from empty unless stale content is explicitly
declared. Unfiltered counts must match; filtered scopes distinguish
`shownCount` from `totalCount`. `validateContentScope` is the same pure
validator used before static emission. Deterministically empty fragments/null/
nested empty nodes fail content validation; accessible intrinsic non-text
content is valid, and custom output is marked unknown until observed. Sibling
scopes do not share state.

`evaluateConsumerEvidence` is the single pure validator for consumer evidence.
It checks expected-to-observed instance identity, requested/selected/panel
surface, exercised input and target offset, DOM-backed result and feedback,
expected/submitted/serialized/readback values, post-operation geometry, and
independent `dpr`, `pinch-visual-viewport`, and `page-zoom` measurements. A
missing required control, error DOM check, visible target, value comparison, or
zoom axis is a failure; `wouldFail` is not an accepted input.

Client-rendered `Tooltip` and anchored `Popover` instances use the document-body
boundary when a trigger reference is available, so scroll ancestors cannot clip
the layer. Placement is recomputed from trigger and layer rectangles on viewport
resize and scroll; Tooltip remains text-only, while long or interactive content
uses Popover.

Static HTML/CSS consumers use the same package boundary through
`mountStaticOverlayBoundary` plus `tcrnComponentCss`. Emit a stable trigger/layer
pair, keep the layer body-independent in the source markup, and let the DOM bridge
move it to `document.body`, apply `static-fixed`, flip/clamp against the viewport,
reposition on scroll/resize, and handle Tooltip focus/Escape or Popover
click/outside/Escape. The static layer uses `role="tooltip"` for text-only
supplemental content or `role="dialog"` for local interactive context. A
CSS-only server-positioned body sibling is a static fallback only; it cannot claim
dynamic portal, edge, or focus behavior.

`ClipboardCopyButton` server markup becomes interactive on a static page through
`mountStaticClipboardCopyButton({ root, locale })`, the third DOM bridge beside
`mountStaticOverlayBoundary` and `mountStaticMultiSelect`. The root is the component's own
construct (native button, visible label text node, polite `role="status"` region,
`data-clipboard-copy-state`) plus `data-clipboard-text`, so the copied value is present in
the page; restricted values stay with the React component, which never writes them to the
DOM. The bridge follows the component's states (idle, copying, copied, failed, unsupported),
returns to idle after 2 seconds, keeps focus, speaks the package's five-locale labels and
accepts per-button `data-clipboard-<state>-label` overrides.

`DefinitionList` uses its own inline container for the existing 760px detail
stacking boundary. A narrow card inside a wide viewport stacks terms before their
definitions; long terms wrap inside their track. Consumers retain the shared
column sizing rather than imposing a fixed term minimum on a nested card.

### Narrow ProductShell navigation stacking

At the existing mobile breakpoint, the sidebar header owns the persistent
MobileNavToggle. The workspace TopBar remains in normal document flow and must
not stick at the same inset over that trigger. Desktop TopBar placement is
unchanged. The navigation-product-shell-spec example uses the package stylesheet
and demonstrates the same header composition. Geometry proof scrolls the real
ProductShell at 760px and 390px, checks the pointer hit target, clicks the
trigger, and verifies its expanded state; restoring the old sticky TopBar is a
negative case. This is a shell contract, not a consumer z-index override.
