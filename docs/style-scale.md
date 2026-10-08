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
  not duplicate a package selector), the tooltip static-preview hook
  `.tcrn-tooltip[data-storybook-static-tooltip="true"]` (and its `[data-placement]`
  variants), which forces the revealed state for static docs screenshots, and
  `.tcrn-product-shell-search__results` when scoped under the
  `navigation-product-shell-spec` static-display modifier (the docs proof keeps the
  open result panel in flow; the package default remains the interactive overlay).
- **Deferred primitive:** `.tcrn-icon` base rule (Icon-emitted) remains doc-side for now —
  it is outside STORY-037's named 24 families and awaits an explicit Owner call to promote
  or keep it.

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
