# Changelog

## 4.0.0

### Three shell tokens retired by the top band (TCRN-DS-INIT-016)

Status: candidate on the INIT-016 integration branch, not tagged, published or deployed.

The top-band shell has no resident sidebar and no top bar of its own (07b board, section
F), so composition one's three ProductShell sizes are retired through the existing
deprecation registry; each still resolves, and `findDeprecatedTokenUsages` reports it:

- `--tcrn-shell-topbar-height` is a deprecated alias of `--tcrn-shell-strip-h`, the top
  band height (both 52px), and is listed in `tcrnDeprecatedTokenAliases`.
- `--tcrn-shell-sidebar-width` (220px) and `--tcrn-shell-sidebar-width-collapsed` (52px)
  are deprecated with no successor: the definitions keep their values so consumers still
  resolve, and `tcrnDeprecatedTokens` lists them with a null replacement.

### The navigation family takes its place; six old shell parts are deprecated (TCRN-DS-INIT-016)

Status: candidate on the INIT-016 integration branch, not tagged, published or deployed.

- One Tabs family: `Tabs`, `ModuleTabs`, `SectionTabs`, `SegmentedNav` and `ViewTabs`
  render `tcrn-tabs` in three variants (panel, nav, segmented) with one selected
  structure, the 6% ink wash and the strong weight. The selection gate refuses a second
  structure for the family (TCRN-DS-SUB-124).
- `PageHeader` renders `Breadcrumb` as its first row: one line, truncating crumbs with
  titles, the board's 11 chevron. `TreeNav` takes the menu row's grammar
  (TCRN-DS-SUB-124).
- Deprecated through 4.0.x and removed in 4.1: `SideNav`, `SideNavCollapseButton`,
  `MobileNavToggle`, `TopBar`, `ProductLauncher` and `ProductSwitcher`. Their rules moved
  from `tcrnComponentCss` to the new `tcrnRetiredComponentCss`; the new roster
  `componentLibraryDeprecatedComponentNames` names them, and `docs/migration-4.0.md` M23
  gives each a step (TCRN-DS-SUB-125).

### The G+ renewal: chassis, bundled fonts, five families, four product marks (TCRN-DS-INIT-015)

Status: candidate on the INIT-015 integration branch. It is not tagged, not
published and not deployed; each of those, like the Owner's visual acceptance, is a
separate Owner decision. The upgrade steps for each consumer are in
`docs/migration-4.0.md`.

Breaking: token names and values, the rendered output of the first five families
and of `ProductShell`, and four public APIs change (the icon roster and
`IconProps`, the product logo registry, `ClipboardCopyButton`, the deferred
prototype roster `componentLibraryDeferredPrototypeNames`), and `lucide-react`
leaves `@tcrn/ui-react`. The three packages move to 4.0.0 together.

**The G+ chassis.** `@tcrn/ui-tokens` takes its G+ values from the design contract
in `docs/design/gplus-2026-10/contract/`, generated into
`src/gplus-tokens.generated.ts`: from `tokens.json` the themed colours and shadows,
the focus ring, radius, control height and padding, icon size, motion, the three
font stacks and the brand suffixes; from `typography.json` the 29 type scale steps
(sizes, line heights, weights, tracking and tabular numerals). The generated file
names `tokens.json`, `marks.json` and `typography.json` in its header, so a change
to any of them rewrites its `contract-sha256` line. Names that predate G+ and have
no contract entry keep a hand-written value (the Japanese, Korean and stamp font
stacks, for example) or stay as aliases. Colour names follow the contract
(`--tcrn-color-bg`, `-panel`, `-ink`, `-ink-2`, `-ink-3`, `-line-ctl`, `-acc`, `-ok`,
`-warn`, `-bad` and the rest), joined by `--tcrn-shadow-s1|s2|s3|edge`,
`--tcrn-focus-ring` and `--tcrn-brand-suffix-<product>`. `tokens.css` holds three
marked blocks: the light theme block on `:root, [data-tcrn-theme="light"]`, a
`:root` theme-independent block, and a `[data-tcrn-theme="dark"]` block declaring
the same names as the light block. Because the light block also answers to
`data-tcrn-theme="light"`, a light container inside a night page takes the light
values again instead of inheriting the night ones; `tcrnGplusThemeSelectors.light`
carries the same list, `parseTokenCssBlocks` reports a selector list in canonical
form, and `compareTokenThemeBlocks` matches lists in any order and spacing. Type,
radius, control height and padding, icon size, shadow and motion move to the G+
scale; line heights carry px units; `--tcrn-type-family-heading` (Source Serif 4) is
new. The type scale rules of `@tcrn/ui-react`
(`src/styles/generated/typography.scale.ts`) are generated from `typography.json`
and refer to the type tokens through `var(--tcrn-type-*)`; the generator stops
when a token's value and its scale entry disagree. Four declarations still carry a
literal because no token exists for them: the inline numeral size 16px, the large
numeral 44px on a 48px line, and the mono text size 11.5px. Whether to add tokens
for them is an open Owner decision. Control outlines use `line-ctl`, at least
3:1 against the page. Fifty earlier names stay defined as deprecated aliases
(`--old: var(--new)`), and
`--tcrn-motion-press-scale` stays defined with no successor, because a G+ press
changes the fill and does not scale. The focus ring is a box-shadow, a 2px gap in
the surface colour and then 2px of accent, with a transparent outline kept for
forced colours. New exports: `compareTokenThemeBlocks`, `parseTokenCssBlocks`,
`createResolvedTokenMap`, `tcrnDeprecatedTokenAliases`, `tcrnDeprecatedTokens`,
`findDeprecatedTokenUsages`, `formatDeprecatedTokenNotices`, `tcrnTokenStylesheet`,
and the contract tables `tcrnGplusThemedTokens`, `tcrnGplusFixedTokens`,
`tcrnGplusBrandTokens` and `tcrnGplusThemeSelectors`; `DesignToken` gains the
optional `scope` and `deprecated` fields. `scripts/token-deprecation-notice.mjs`
lists the old names a source tree still uses and never fails a build; the Storybook
build runs it over its own sources.

**Bundled fonts.** Hanken Grotesk, Source Serif 4, IBM Plex Mono, Noto Sans SC and
Noto Serif SC ship in `@tcrn/ui-tokens` as WOFF2 files copied byte for byte from
pinned `@fontsource` packages (the Chinese faces as the upstream unicode-range
slices that cover product text), with `@tcrn/ui-tokens/fonts.css`,
`fonts/manifest.json`, the five SIL OFL 1.1 licence texts in `licenses/`, and
`FONT-LICENSES.md`. Each of the four family tokens follows its Latin face with a
bundled Chinese face: Noto Sans SC in the UI and mono stacks (mono is
`"IBM Plex Mono","Noto Sans SC",ui-monospace,Menlo,monospace`, so Chinese set in
mono no longer falls to a system face), Noto Serif SC in the serif and heading
stacks; `fonts:proof` is red when a family token loses that fallback.
`tokens.css` imports `fonts.css`; the JS export `tcrnTokenCss`
does not. No font CDN is referenced. This replaces the 2.0.0 position that the
system ships no font software; the 2.0.0 entry below stays as written. The licence
allow-list admits OFL-1.1 for these five packages only, and the packed
`@tcrn/ui-tokens` grows by the font files.

**The first batch: five families on the contract.**

- Typography: `Text` gains `size` (`body`, `reading`, `meta`, `caption`), `tone`
  (`default`, `strong`) and `variant` (`numeral`, `caps`); with no props its markup
  is unchanged. `Heading` levels 1 to 4 and the single-line `Text` variants repeat
  their text in `title`. Heading sizes come from the contract scale, and the clamp
  sizes are gone. `Highlight` marks with `tcrn-highlight__mark` (was
  `tcrn-highlight-mark`) and only adds a background. `tcrn-link` takes the
  contract link rules, and its states go through a pair table like Actions and
  Inputs (live pair `--tcrn-pair-ink`, `--tcrn-pair-underline`,
  `--tcrn-pair-edge`): the link rests in acc with an acc-ul underline, hover
  switches ink and underline to acc-2, and focus draws the focus ring over a
  transparent outline kept for forced colours. `tcrn-link--quiet` is now a
  modifier of `tcrn-link` and has no styles alone: write
  `class="tcrn-link tcrn-link--quiet"` (no bare use exists in this repository).
  The quiet link rests in the current text colour with a transparent underline;
  its hover underline moves from a 0.2em offset in the accent to the 2px link
  offset in acc-2.
- Icon: `Icon` draws 37 names from the contract on a 20-unit grid, the 28 existing
  ones plus `plus`, `minus`, `users`, `bell`, `copy`, `trash`, `calendar`,
  `more-horizontal` and `chevron-up`, with a 1.25 non-scaling stroke at every size.
  `strokeWidth` is removed from `IconProps`, `lucide-react` is removed from
  `@tcrn/ui-react`, and the `.tcrn-icon` base rule now ships in the package.
- Brand: the product marks below.
- Actions: `Button`, `IconButton` and `LinkButton` read a state pair table (fill,
  ink and edge per state). `size="lg"` (40px) joins `sm` and `md`; `loading` sets
  `aria-busy` and shows the loader; the press scale and transforms are gone. The new
  `ButtonGroup` takes a required `ariaLabel` and `variant` `secondary` or `quiet`.
  With a disabled reason, the `Button` title reads "label — reason", the visible
  label first, so a cut label can still be read in full; a button without visible
  text keeps the reason alone, and the reason stays the `aria-describedby`
  description. `ClipboardCopyButton` shows one icon per settled state and no
  longer accepts `loading`. The product shell's theme, side-navigation and
  mobile-navigation toggles follow the Actions pairs; their sizes (36 and 38px)
  are unchanged. The theme toggle shows its sun or moon by its own
  `data-current-theme`: the default and `html[data-tcrn-theme="dark"]` icon
  display rules are gone, so a toggle inside a block-level theme shows the current
  icon instead of neither.
- Inputs: the text controls and the `Select` and `MultiSelect` triggers read one
  pair table with `border: 0` and an inset box-shadow edge; `Checkbox`, `Radio` and
  `Switch` read their own pair tuples, and `Switch` drops the disabled opacity.
  `SearchInput` takes the ink-wash tool form in the top bar and in forms. `Select`
  and `DatePicker` draw their end icon (`chevron-down`, `calendar`) inside a
  wrapper. `.tcrn-field:focus-within` no longer washes the field. Inside the
  product shell, the focus rule leaves buttons, links and these inputs to their own
  ring and gives other elements the G+ ring in place of the 3px outline. A focused
  read-only text field shows the focus ring and keeps its read-only fill and ink
  (the new `rf` state, ordered after `r`; the Inputs board lets read-only cover
  focus, so this differs from the board on purpose). `.tcrn-field--error` no
  longer washes the whole field or recolours its outline, and its error text reads
  `--tcrn-color-bad`; the forced-colours outline stays. The search shortcut text
  is ink-2 (was ink-3) and reaches 4.5:1 on the night wash. The `MultiSelect`
  trigger keeps the `Select` end, 30px of end padding with the caret where the
  `Select` chevron sits, and `.tcrn-multi-select-dropdown` is now a flex
  column (`flex-direction: column`, `align-items: stretch`), so the static
  expanded list sits directly below the trigger at the trigger's width instead
  of beside it; its options declare their own pair, and hover and selection only
  switch it.

**Four product marks.** `TcrnBrandMark` takes `productId` (`tms`, `einzbern`,
`mana-orchestrate`, `design-system`) and `variant` (`color`, `mono`, `tile-tint`,
`tile-deep`) and draws the registered mark inline; without `productId` it renders
the mother mark as before. `tcrnProductMarkSvg`, `tcrnProductMarkIds` and
`tcrnProductMarkVariants` are new, and `ProductLogo`, `ProductLockup` and
`ShellBrandLockup` take `markVariant`. In `tcrnProductLogoRegistry` the `workflow`
entry becomes `einzbern` and `mana-orchestrate` is added. The four marked products
take their name, wordmark face and five-locale tagline from the contract (TMS:
艺人管理系统, Talent Management System; Einzbern: 项目记忆引擎, Project memory
engine; Mana Orchestrate: 项目记忆助手, Project memory assistant; Design System:
设计系统, Design System) and carry the new fields `markId`, `wordmark` and `byline`.
Einzbern and Mana Orchestrate are whole names in the serif with the byline "by
TCRN". The gradient suffix is gone: TCRN is set in ink, and the TMS and Design
System suffixes read `--tcrn-brand-suffix-tms` and
`--tcrn-brand-suffix-design-system`. By night the TMS suffix is #7aa0f5, the bright
colour of the TMS mark (#2c63c8 by day; a design-session ruling of 2026-10-11, open
to Owner correction), so `--tcrn-brand-suffix-tms` moves from the
theme-independent block into the two theme blocks; the Design System suffix keeps
#6577f3 in both themes. The definitions of `--tcrn-brand-accent-tms`,
`--tcrn-brand-accent-workflow`, `--tcrn-brand-accent-design-system-1` to `-4` and
`--tcrn-color-brand-secondary-readable` are removed. AOS keeps its entry, its
accent and the mother mark.

**Composition one in the product shell.** `ProductShell` takes the desktop
geometry of the canvas's composition one (a design-session ruling of 2026-10-11,
open to Owner correction). The sidebar is 220px wide (was 280) and 52px collapsed
(was 92); the shell's top bar is at least 52px high (was 68); the workspace is a
sheet 12px from the shell's top, right and bottom edges, with a 14px radius, the
s1 shadow and the panel fill; the sidebar sits on the shell's canvas colour with
no right border; navigation items and group titles keep a 16px lead column, with
the text starting at 48px. The values come from four new theme-independent
tokens: `--tcrn-shell-sidebar-width` (220px), `--tcrn-shell-sidebar-width-collapsed`
(52px), `--tcrn-shell-topbar-height` (52px) and `--tcrn-radius-paper` (14px).
`--tcrn-product-shell-sidebar-width` stays the shell's local variable and defaults
to the new token, so a consumer can still set its own width on the shell. The lead
column, the collapsed padding and the sheet apply outside the mobile layout only
(`@media not all and (max-width: 760px)`); the mobile block itself is unchanged,
while the canvas-coloured sidebar and the 52px top bar minimum apply at every
width. The standalone `TopBar` keeps its 68px minimum height. The 52px collapsed
rail still holds the 38px collapse toggle.

**Storybook renders only the package.** The docs layer no longer carries component
CSS of its own, and its scaffolding uses the `tcrn-doc-` prefix. Both tracks load
the bundled fonts. Each family has a matrix story and a sample story built from the
contract data (`typography-matrix` through `inputs-sample-members`), and
composition three has a sample story built from public package components only
(`composition-three-sample`, Storybook id `compositions--composition-three`): no
sidebar, a top bar with the navigation, and content centred at most 1040px wide.
Its top bar differs from the board: the standalone `TopBar` is 68px high against
the board's 56, the navigation follows the search because `TopBar` has no
navigation slot, and at 1024px the navigation wraps to four rows.
`docs/design/gplus-2026-10/storybook-map.md` maps every canvas board to its story
and records the differences. The composition-one samples no longer set an inline
sidebar width, and their module no longer exports `gplusSampleSidebarWidth`. The
dense operations and compact tool shell prototypes, which drew their shells with
docs-only classes, are retired from the navigation shell stories together with the
smoke assertions that only guarded them; the component inventory page no longer
lists them, and `componentLibraryDeferredPrototypeNames` drops
`DenseOperationsShellDemo` and `CompactToolShellDemo`, leaving
`KnowledgeBaseShellDemo`. In the navigation shell story the static search results
stay in the page flow and push the heading and first paragraph down instead of
covering them. The documentation shell takes composition one's rail and top bar
(sidebar 220px, 52px collapsed, top bar 52px, the 16px lead column, the canvas
colour), and the knowledge-base sample's standalone `TopBar`, `SideNav`, group
titles and navigation items take the same geometry through four registered docs
exceptions until the Navigation family's batch. Still open in the documentation
shell: the brand lockup keeps its 38px mark with the copy starting at 66px, not
composition one's 48; the pages do not sit on a sheet 12px from the edge; and the
knowledge-base sample's top bar cuts its description to one line with an ellipsis
(the full text stays in the DOM).

**New gates.** `contract:proof` (generated sources, icons, marks and matrices
against the contract), `contract:static` (clauses C2, C5, C6, C7, C8, C11 and C13),
`geometry:measure` (eight DOM measurements on the matrix and sample stories),
`storybook:visual-proof` (rebuilt on the canvas map), `doc:sample-style` and
`fonts:render` join `pnpm verify` after `pnpm build`. `tokens:proof` runs the
rewritten contrast proof (C1 thresholds) and the deprecation-notice test;
`fonts:proof` checks the font digests, stylesheet, licences and coverage;
`doc-shell:proof` counts out-of-package classes in the docs layer;
`brand-asset:proof` holds the eight product-mark files to their registered digests.
`.github/workflows/verify.yml` runs `pnpm verify` on branch pushes and pull
requests; it has not run yet.

**Gate expectations after composition one.** `geometry:measure` adds a
`shellFrame` check on the composition-one samples (the sheet 12px from the shell
edge, the shell top bar 52px), and the geometry proof's brand check reads the
collapsed rail (sidebar 52px, mark 22 by 22, copy not displayed).
`storybook:visual-proof` maps composition three (23 rows) and takes the kind of a
story outside the ten family stories from its registry category. The Storybook
smoke and the AI consumption contract take composition one's values for the
product shell (top bar 52, collapsed rail 52; were 68 and 92), the documentation
shell oracle moves from a 288px sidebar (280 to 360) and a 96px top bar to 220
and 52, and the smoke reads those values from the shell tokens; its focus
comparison skips the outline width and offset when the outline style is `none`.
The contrast proof and the axe check withdraw the two night TMS wordmark
exemptions, which leaves the Design System suffix on panel and bg in the light
theme. The shell-fidelity guard no longer counts the wrapping properties as
placement on the C7 single-line carriers, and its registered docs exceptions
change as listed in `docs/style-scale.md`. The internal-alpha search-overlay check
and reproducibility probe expect six open menus (were eight) now that the shell
prototypes are gone, and its mobile hash-anchor check lets the G+ translucent
header layers through. `shell:parity` expects the sample's collapse toggle 16px
from the rail edge (was the old documentation shell's `clamp(16px, 1.6vw, 24px)`,
23.04px at 1440).

`tcrnComponentCss` is now joined from family segment modules in
`packages/ui-react/src/styles/`; the export and its import path are unchanged.

### The repository root no longer carries an agent entry (TCRN-CROSS-SUB-443)

Documentation and proof wiring only — no package, token, component or rendered
output changes, so nothing a consumer installs moves.

`AGENTS.md` and the one-line `CLAUDE.md` bridge are removed from the repository
root (TCRN-CROSS-MIN-250): agent rules now live only at the platform container
root, and nothing from either file is carried over. The three places that still
depended on them are rebound. The internal-alpha proof's localization policy
binding reads the `## Localization` section of `apps/storybook/README.md`, which
already carries the same seven tokens; the check and its place in
`nonVisualProofOk` are unchanged. Two foundation visual standards drop
`AGENTS.md` from their `sourcePaths`, so the AI consumption contract stops
citing a file that no longer exists; the hosted contract changes only at the
next deployment. The storybook README loses its two pointers to the root
`CLAUDE.md`. The removed file's `TOPOLOGY-CLAIMS` block named a
`doc-topology:proof` command that the current TCRN-AOS tree no longer has; that
stale claim goes with it. The earlier entries below that mention these files
are history and stay as written.

The no-private-input scan skips the root `.ether/` (the Einzbern project store).

### De-productized functional display surface (2026-08-22)

The former `@tcrn/ui-domain` surface has been merged into `@tcrn/ui-react` under
functional names. `AttachmentList`, `MetadataRail`, and `RecordTable` are the
single implementations for their merged behaviors; `RecordInspector` composes
the existing `DetailInspector`, and `StagePipeline` accepts caller-owned
supporting references. The closed relationship vocabulary and the three
product-named CSS partition utilities were removed from the public surface.

This does not overturn `TCRN-TMS-MIN-008`: the earlier extraction protected an
active consumer, while the current repository measurement found no product
consumer and the former example was the only in-repository consumer. That
premise is no longer true, so the package was retired and its exports moved to
core. The batch remains pending Owner acceptance; no publication or adoption is
claimed.

### The agent entry states where this partition's governance truth lives (TCRN-AOS-STORY-136)

Documentation only — no package, token, component or rendered output changes, so
nothing a consumer installs moves.

`CLAUDE.md` and `AGENTS.md` gain a row naming this repository's governance
partition, the host that holds it, and the command that answers the question.
The row exists because the AOS partition's truth moved off the development
machine to a VM, and a reader of this repository had no way to tell whether that
had happened here too. It has not: this partition's chain is still local, and the
row says so with a command rather than a sentence.

The row is not prose. A gate in the consuming repository
(`pnpm doc-topology:proof` in TCRN-AOS) reads every registered platform document
and compares its location claim against the partition roster and the engine's own
answer, so a claim here that stops being true turns that gate red rather than
sitting on the page. That is the whole point: the previous version of this
statement lived only as prose, went stale when the topology changed, and was
then quoted as current fact twice.

## 3.0.0

### The mobile shell has a disposition (TCRN-AOS-STORY-108, TCRN-AOS-INC-025)

Breaking: below the mobile breakpoint the side navigation is closed by default and
opens from a toggle. A consumer upgrading without changing a line will see a
different phone layout, and visual baselines taken at mobile widths will move.

On a 375px phone the consuming work queue put 1,469px of chrome above its first work
item, 684px of it navigation, and no control anywhere could shrink it. That was a
rule outliving its premise rather than an oversight. The mobile block hides the
width-collapse control and is right to — narrowing a rail to 92px inside a full-width
stacked layout is a control that does nothing. What that never said, and was read as
saying for four weeks, is that the navigation cannot be put away at all. Two different
controls; only the first had ever been ruled on. The rule was written when this
system's shell fixture had two destinations, and the consumer reached eleven.

So the fixture went first, to four groups and eleven destinations. **A shell oracle at
a scale no consumer uses cannot fail the way a consumer fails**, and that is the whole
reason 684px of navigation shipped above every page with a green baseline.

`MobileNavToggle` uses `display: none` rather than a transform, so the links leave the
tab order and not merely the screen — measured 0 of 11 reachable when closed, 11 of 11
when open and on desktop. Closed is the CSS default, so a server render emits the
closed nav with no script and no correction afterwards. The state is transient and
deliberately **not** `collapsed`: that one is persisted and serialized into every
product link, so a phone tap must not be able to rewrite a desktop preference. A
consumer that wants the rail open on a phone passes `mobileNavExpanded` — the prop is
controlled, so the toggle then reflects whatever the consumer holds.

Two further mobile layouts changed with it: the utility row puts three controls on one
line instead of a row each (130px to 51px), and the tab and quick-filter families each
become one horizontally scrolling row instead of wrapping to four and three. First work
item: 1,469px to 520px at 375x760, inside the fold for the first time. Desktop and
tablet are unmoved.

### Work rows stack by their own container (TCRN-AOS-INC-028)

Breaking at one band: a shell with a 280px rail viewed between roughly 760px and 780px
now stacks its work rows into a single column where it previously laid out three and
overflowed the page.

The row's three column floors plus gaps need 464px. A 761px viewport minus a 280px rail
leaves the row 441px, and the page overflowed by exactly that difference — 16px at 761,
7px at 770, gone by 780. The mobile block already stacked the row, but keyed to a
viewport number that cannot see the rail, so it could not answer the question for any
consumer whose rail is a different width. A container query answers it for all of them.

### Four capabilities cross into this package (TCRN-AOS-STORY-107)

A governed deliberation settled where the line between this system and a consumer runs.
Four capabilities sat on the consumer's side of it only because the props did not exist
here.

`WorkBoardCard` takes an `href`, rendered as a stretched link over the card rather than
an anchor around it, because a card can also carry relationship chips and an anchor
inside an anchor is not a document. Everything the card's API lets a consumer fill sits
above the stretched surface. Its `owner` became optional: a governed chain record has an
acting writer per event, not a standing owner per item, so requiring one forced the first
consumer to invent a value.

`SearchInput` takes `fill`. `WorkSplitView` decides its own breakpoint with a container
query and takes `detailPopulated` for the one bit only a consumer knows — it had been
reached into through three of its class names, keyed to a viewport width that was only
correct for one shell. Its mounting requirement is stated on the component: give it a
parent with a definite inline size, because a size container contributes no intrinsic
width and a shrink-to-fit parent has nothing to measure.

Quick-filter chips take their natural width on mobile; a fixed 160px basis had let a
no-wrap label needing 213px shrink below its own text.

### A preference reaches the server (TCRN-AOS-STORY-105, TCRN-AOS-INC-017)

The flash on every navigation had a single cause: the preference lived in `localStorage`,
which the server cannot read, so server-rendered HTML always carried the defaults and the
client corrected them after hydration. This repository is where that pattern came from —
`useProductShellController` read `window.localStorage` in its state initializers, and the
AI contract declined to rule on preference transport. **A reference implementation plus a
declined rule is how a consumer inherits a defect without anyone deciding it should.**

The controller now accepts the request's parsed preferences through `requestPreferences`,
and a preference change writes both stores. Neither store contains the other —
`localStorage` alone leaves the server blind, a cookie alone is lost to a privacy setting
that clears cookies but keeps site storage — so the read states which wins. The shell
takes parsed values, not the request's whole `Cookie` header.

Locale was the one preference read through raw. `readStoredTheme` narrows to dark/light
and `readStoredBoolean` to a boolean, but locale went through `readStoredString` and the
stored value reached state unchanged — and that value becomes `<html lang>` and the
dictionary index, from a cookie anyone can write. It now resolves where the store is read
and at the setter too, so no consumer has to remember to.

### The rail is reachable and the seam is measured (TCRN-AOS-INC-026, TCRN-AOS-INC-029)

The sidebar is one viewport tall and sticky, and had nothing to scroll. With navigation
taller than the window its items painted outside their own box and could not be reached
at any page scroll position — the page scrolled, the sticky rail did not. It shows on a
rotated phone, because 812x375 is above the mobile breakpoint and takes the desktop path:
the last three destinations were simply unavailable. The rail gets its own scroll, and
`100dvh` stops `vh` from ignoring the browser chrome that comes and goes on a phone.

Both of those were invisible for the same reason, and that is the third change. The
screenshot matrix asserts no page overflow at 1440, 1024 and 390 — three widths
comfortably inside a posture, none at the seam between two. The accessibility pass ran at
1440 only, which is the one viewport where the mobile code does not run. Two checks now
cover what neither did: one reads four widths across the breakpoint and takes no
screenshots, and one scrolls the rail and asks whether the last item is inside it, at a
landscape viewport, bound to the production-scale oracle and refusing to pass below eleven
destinations. The accessibility pass runs at both desktop and mobile, in both themes, and
every summary records which viewport it came from.

**It found a defect on its first run, from the commit immediately before it.** The
scrolling tab and filter rows introduced above are scroll containers whose items are
static text, so a keyboard user could not scroll them. Both take `tabIndex={0}`, the
treatment `TableShell` already carried. One commit between opening a gate and it catching
something is the plainest measure of what its absence had been costing.

### Selection's own gate could not see two of its copies (TCRN-DS-INC-005)

The selection-grammar proof was added so a fifth copy of the old grammar could not pass
review. Two copies survived it and the gate reported `ok` on both: its selector test was
attribute-selectors-only, and neither survivor was an attribute — a pressed filter chip
(`aria-pressed="true"`) and a modifier class (`--active`). Both still painted brand.
Measured before and after, the gate returned `findings: []` either way, so the thing built
to stop copy five was blind to copy five. Widened to `aria-pressed`, `aria-selected`, and
`--active`/`--selected`; 21 selection rules scanned becomes 24. `[data-active]` stays
deliberately excluded — on the doc theme-transition wash it means "this crossfade is
running", not "this option is chosen".

`demo-styles-sync --check` was a second false green: it compares against the built
`dist/story-demo-styles.js` rather than the edited source, so it reported in sync while
the docs layer still painted brand. It is a real gate carrying an undeclared
prerequisite.

### Two documents that could lie without anything noticing (TCRN-DS-INC-006)

`tcrnComponentCss` is a template literal, so a backtick inside a CSS comment ends it, and
the compiler then reports a syntax error on the comment line rather than on the stylesheet
that just lost most of itself. It happened four times in this window.
`scripts/css-template-integrity-proof.mjs` walks the literal, checks brace depth and
unescaped backticks, and names the truncation directly. Mutation-tested: one injected
backtick takes the stylesheet from 85,975 bytes to 66,766, and the gate says so.

This changelog was the other one. Two releases were cut without moving the `## Unreleased`
heading, so the section a reader is told is unreleased held everything that went out under
2.0.0 and 2.1.0, and neither version had a section of its own. This file was not
unread — the privacy scan walks the whole tree and reads every byte of it — but nothing
compared what it says about releases against the releases themselves, and **a document
can be scanned thoroughly and still lie**. The sections below 3.0.0 are that history,
put back where git says it belongs.
`scripts/changelog-release-sections-proof.mjs` now asks git rather than the document: no
entry may sit under Unreleased if a tag already contains the commit that added it, every
tag from 2.0.0 onward must have a section, and work ahead of the newest tag must be written
down somewhere. Its floor is 2.0.0 and is stated in the script: v1.0.1 through v1.0.5 were
cut before this repository wrote per-version sections at all, and inventing five changelogs
from memory would be a worse defect than the one being fixed.

## 2.1.0

### Selection is one grammar (TCRN-DS-INIT-013)

Selection is ink. A control that has a surface takes ink on that surface; a control
that has a frame promotes that frame to ink. Nothing is added on top of either.

**Two grammars had grown up separately.** Vertical navigation marked selection with
a brand-coloured 3px left axis; the horizontal tab family used a brand-coloured 2px
bottom axis inside a per-item bordered pill. Each was internally consistent, and
together on one page they read as two products. Colour now leaves selection
altogether and stays with actionability and focus, so colour means "you can act on
this" and structure means "this is the state".

**Horizontal tab families are segmented tracks.** The row is one control carrying
one frame; the items inside are frameless. Framing every option and then adding a
second mark to say which was chosen is what made the old pill grammar need a mark
at all. Quick filters, which wrap by design, get no track — the item grammar holds
either way, which is the point of inking the item rather than decorating the box.

**The docs shell was copying the package, not consuming it** — twice, under two
different attribute names, which is why the first sweep found only one of them.
Both now express the package's tokens, so the shell cannot look right by
coincidence while the package moves underneath it.

**A style rule cannot be held by review**, because the next copy looks like correct
code in a diff. `scripts/selection-grammar-proof.mjs` reads every selection rule in
the package stylesheet and both docs layers and fails on an axis, a brand colour,
or a lift. It was mutation-tested against a deliberately reintroduced rail before
being wired into `tokens:proof`.

### SearchableList (TCRN-DS-STORY-088)

The Selection and list patterns page has specified this escalation since it was
written — "large or remote option sets need search, loading, empty, and keyboard
states" — while the package shipped only `Select`, so every product that outgrew
`Select` invented its own menu. The component now exists and owes those four states
by contract. It carries copy for all five locales, takes real callbacks rather than
being another closed surface, and is a group of links and buttons rather than a
listbox: a listbox obliges every child to be an `option`, and an `option` cannot be
a link.

### Storybook fidelity — A-tier repair (TCRN-DS-INIT-003)

The docs surface now shows the language it documents, and its self-checks report
what they actually measured.

**The fidelity checks were mostly claims.** `rejectChecks` carried seven entries of
which six were the literal `false` — assertions wearing the shape of checks, and
they travelled into the AI consumption contract that way. Three are now real scans
of the shell sources (decorative gradients, radius drift, soft-cloud elevation), one
binds to the perceptual signature gate (palette drift), and the three that are
compositional judgements no code here can make are reported as explicitly
**unchecked** rather than asserted false. The contract claims less and means it.

**Turning them on found what they had been covering:** 86 decorative gradient
washes, 21 soft-cloud shadows up to 54px of blur, and 6 radius literals off the
token scale. All are zero now. Functional gradients — progress fill, skeleton
shimmer, tracked-nav indicator — stay, and are named in an allowlist rather than
recognised by accident.

**`.tcrn-theme-preview` was demonstrating a dead theme.** It hardcoded the v1 navy
wash, so the one component whose job is showing the dark theme was showing the
theme v2 replaced. It is token-driven now.

**The stamp finally has a chapter.** Adoption is defined as matching a component's
Storybook chapter, and v2's only new component family had none. Components now
documents the three admitted moments, the stamped header, and the boundary that
keeps the language rare.

**The v1 colour vocabulary is retired** from the locale table — six orphaned keys
removed, two live ones moved to the colour-neutral variants already translated.
The brand mark's description keeps its v1 colour names on purpose: the mark is a
frozen brand asset, changed through brand admission rather than a design-system
revision.

## 2.0.0

### Visual language v2 — direction A+B (TCRN-DS-INIT-001)

Breaking: the visual language is a contract surface, so consumers comparing computed
visual metrics against Storybook will see every colour, several radii, and the whole
motion curve family change. This lands as a major version.

**Palette (WS1).** The iris-blue `#5865d8` and rose `#c96a7e` are gone; the brand teal
is purified to `#17707f` as the single accent of the quiet-instrument base, with an
oxblood `#93332a` reserved for identity moments. Surfaces move from cool blue-greys to
warm-neutral graphite. Status backgrounds drop their pastel fills for low-noise washes.
Every foreground/background pair the system renders is now proven against WCAG AA by
`pnpm tokens:proof`, in both themes.

**Two defects found and fixed while measuring.**
- `packages/ui-tokens/src/tokens.css`, a published export, had drifted from its
  generator: 13 typography tokens were missing from the shipped CSS, including
  `--tcrn-type-weight-strong`, which `@tcrn/ui-react` referenced 16 times. Consumers
  importing the CSS resolved those to nothing.
- `apps/storybook/src/storybook.css` carried a complete hardcoded copy of the v1
  palette, so the docs shell would have kept rendering the old language after the
  package moved — contradicting the claim that compliance means using the same
  Storybook visual instance.
Both artifacts are now generated from `@tcrn/ui-tokens`, and `pnpm tokens:proof` fails
the build if either drifts again.

**Boundaries (WS1).** New `--tcrn-color-border-control` carries the WCAG 1.4.11 3:1
duty for boundaries that identify a control; the lighter structural rules keep drawing
table lines without being held to a threshold meant for controls. Eight control
boundaries moved onto it.

**Stamp language (WS2).** New `Stamp` and `StampRule` components carry the archival
serif, the oxblood ink, and the double rule. They are admitted at three identity
moments only — gate close, ruling, release acceptance — and `pnpm stamp:proof` fails
the build if the language leaks anywhere else. Status chips are now an ink dot plus a
word, squared to the control radius, replacing the pastel pill.

**Motion (WS3).** Built-in easings are replaced by a curve family: strong ease-out
`cubic-bezier(0.23, 1, 0.32, 1)` for entry and exit, strong ease-in-out for on-screen
movement, and the drawer curve for large surfaces. Buttons answer a press with
`scale(0.97)`. Search expand/collapse drops from 320ms to 240ms, under the 300ms
ceiling for UI motion.

**Reduced motion is no longer a kill switch.** The previous behaviour set
`transition: none`, which removed the cue that anything had changed along with the
movement. Positional motion is now removed while opacity and colour transitions
survive, and the proof harness was rewritten to assert both halves — no travel *and* a
surviving comprehension cue — which is a stricter check than the one it replaces.

**Fonts.** `packages/ui-tokens/FONT-LICENSES.md` records the licensing position: the
system names font families and ships no font software. `pnpm fonts:proof` enforces
that no font binary reaches a published artifact and that no proprietary face appears
in a stack advertised as distributable. The SF family is deliberately absent — it is
licensed for Apple platforms only, which is one concrete reason direction C was not
adopted wholesale.

- 2026-07-02: Add foundational visual standards and consumer visual style
  contract coverage from
  `route_tcrn_ds_foundational_visual_standards_contract_ilya_implementation_after_multirole_plan_acceptance_9b983d0_01b4e32_680da66`.
  Affected stories: `foundation-visual-standards` plus
  `ai-consumption-contract` readback surfaces.
  AI contract/readback: `foundationVisualStandards`,
  `foundationVisualStandardCategories`, `productShellVisualOracle`, and
  `consumerVisualStyleContract` are exposed in
  `storybook-static/ai-consumption-contract.json` and aligned into `llms.txt`.
  Proof artifacts: Storybook smoke and internal-alpha browser proof fail closed
  on missing standards, missing consumer contract fields, ProductShell visual
  skin drift, search control geometry drift, private doc-shell clone regression,
  zh-CN shell leaks, no-overclaim drift, and page overflow.
  Boundaries: local Storybook/AI-consumption contract only; no package
  publication, Storybook/docs publication, AOS/TMS product adoption,
  owner/product/release acceptance, live dispatch, external action, or
  initiative completion claim.

- 2026-07-01: Add Storybook governance/readability/traceability updates from
  route
  `route_tcrn_ds_storybook_governance_ilya_implementation_after_plan_reviews_success_a1f19b1a_dded541`.
  Implementation commit: `c24f6e5d779c60486214ea1e07fc737e60796e00`.
  Affected stories: all 40 local contract stories across `Welcome`,
  `Style Guide`, `Foundations`, `Components`, `Patterns`, `Proof`, and
  `Change Log`.
  AI contract digest/readback: `storybook-static/ai-consumption-contract.json`
  includes `contractPayloadDigest`; Storybook smoke verifies it equals the
  stable JSON digest.
  Proof artifacts: `apps/storybook/storybook-static/ai-consumption-contract.json`,
  `apps/storybook/storybook-static/llms.txt`,
  `docs/verification/internal-alpha/browser-proof-summary.json`,
  `docs/verification/internal-alpha/a11y-axe-summary.json`, and
  `docs/verification/internal-alpha/no-overclaim-scan.json`.
  Boundaries: local Storybook governance contract only; no package publication,
  Storybook/docs publication, AOS/TMS product adoption, owner/product/release
  acceptance, live dispatch, external action, or initiative completion claim.

## 1.0.0

- Prepare the accepted public Design System baseline under Apache License 2.0.
- Set the root workspace and public package manifests to version `1.0.0`.
- Declare `Apache-2.0` for `@tcrn/ui-tokens`, `@tcrn/ui-copy-state`, and
  `@tcrn/ui-react`.
- Add prep-only Vercel configuration for the Storybook static documentation
  build target.
- Keep the root workspace and examples private as package workspaces.
- Record historical local release-prep notes where public hosting, GitHub
  Release creation, package registry publication, and public repository
  exposure were deferred to separate routes.
- Record the post-release current state: the GitHub repository is public and
  GitHub Release `v1.0.0` exists for commit
  `57b1c417efe4c011daa538158b347075d122b72b`; npm package publication remains
  unconfirmed/not performed.
- Record the current hosted-docs readback: hosted Storybook documentation is
  reachable at `https://tcrn-design-system-storybook.vercel.app/`, while GitHub
  status checks, Actions runs, deployment records, and hosted-doc readiness
  proof are not claimed for the selected public basis.
- No AOS/TMS product adoption, product acceptance, release readiness, npm
  package publication, or final MVP acceptance is claimed.

## 0.0.0-private

- Initial local private scaffold for tokens, copy-state, React primitives,
  static contract stories, synthetic examples, and route-local proof scripts.
- No package publication, GitHub publication, product adoption, product
  acceptance, or final MVP acceptance.
