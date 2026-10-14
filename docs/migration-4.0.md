# Migrating to TCRN Design System 4.0.0

This guide is for the three consumers of `@tcrn/ui-tokens`, `@tcrn/ui-copy-state`
and `@tcrn/ui-react`: TCRN AOS, TCRN TMS and the Einzbern portal. It covers the move
from 3.0.0, and from the unreleased `main` that followed it, to 4.0.0. 4.0.0 is one
release made of two batches: the G+ renewal (TCRN-DS-INIT-015, the first batch, M1
to M19) and the top-band shell (TCRN-DS-INIT-016, the second batch, M20 to M29). The
major version did not move again for the second batch. Where the second batch
replaced something the first batch had introduced, the first batch's item keeps its
wording, and "Items the second batch overtook" below names what 4.0.0 ships instead.

Status: 4.0.0 is a candidate on the INIT-016 integration branch. It is not tagged,
not published and not deployed; each of those is a separate Owner decision, and so
is the Owner's visual acceptance, whose list for both batches is
`docs/dispatch/2026-10-13-tab-shell/owner-acceptance.md`. The release notes are the
4.0.0 section of `CHANGELOG.md`.

How this guide was written: from this repository's commits and the package
handoffs of both batches only. It does not read any consumer repository, so it says
what changed and what to do, not where a consumer uses each item. Each consumer
runs the checks in its own tree. Every first-batch item names its source: a commit
on the INIT-015 integration branch, the Subtask key, and the package handoff in
`docs/dispatch/2026-10-11-gplus-renewal/runs/r1/handoff/` (first round, handoffs
named W1-A and so on), `runs/r2/handoff/` (second round, handoffs named P1 and
so on, marked "r2" below) or `runs/r3/handoff/` (third round, handoffs named P0
and so on, marked "r3" below). The second batch's items (M20 to M29) name a commit
on the INIT-016 integration branch, the Subtask key and the package handoff in
`docs/dispatch/2026-10-13-tab-shell/runs/r1/handoff/` (handoffs named P1a and so
on, marked "INIT-016 r1" below).

## By consumer

### TCRN AOS

1. Load the fonts (M1).
2. Move to the new token names; run the deprecation notice over the AOS sources
   (M2), then re-baseline visual comparisons for the new scale (M3).
3. Keep the focus ring intact: no `box-shadow: none` or `outline` overrides on
   focused package controls, and re-declare `--tcrn-focus-ring` where a container
   changes `--tcrn-color-surface` (M4).
4. Replace reads of the removed brand accent tokens (M5). AOS keeps its own
   registry entry, `--tcrn-brand-accent-aos` and the mother mark.
5. Replace any `lucide-react` import with `Icon` (M6) and keep icon names inside the
   37-name roster; the Story's example is an `iconName="users"` value, which is a
   roster name from 4.0.0 (M7). Remove `strokeWidth` from `Icon` calls (M7).
6. Change `ProductLogo productId="workflow"` (and any other `workflow` registry
   read) to `"einzbern"` (M8).
7. Update tests that assert brand taglines or suffix colours (M8, M9).
8. Adopt the Text, link, Highlight, Button, ButtonGroup and Inputs changes where
   AOS styles or wraps those components (M10 to M14); `tcrn-link--quiet` now
   needs `tcrn-link` on the same element (M10).
9. If AOS styles the product shell toggles, drop colour, shadow, transition and
   press overrides on them (M15).
10. If AOS consumed the unreleased `main` with `@tcrn/ui-domain`, import from
    `@tcrn/ui-react` instead (M16).
11. If AOS renders `ProductShell`, move it to the top band: remove the side rail,
    collapse, mobile drawer, brand copy and top bar search props, pass
    `brandProductId`, a `pageHeader` and the navigation as the menu model, serve
    search through `searchProvider`, and re-baseline the shell's screens (M20,
    M27). Composition one's geometry (M18) never reaches a consumer: the top band
    replaced it within 4.0.0. AOS has no product mark in the approved set yet, so
    an AOS shell has no brand button until it has one (an open Owner item, M20).
12. If AOS reads `componentLibraryDeferredPrototypeNames`, expect
    `KnowledgeBaseShellDemo` alone (M19).
13. Stop reading and writing the collapsed preference; pass the pins from the AOS
    backend and store the list `onPinsChange` reports (M21).
14. Replace `SideNav`, `SideNavCollapseButton`, `MobileNavToggle`, `TopBar`,
    `ProductLauncher` and `ProductSwitcher` as M23's table says, adding
    `tcrnRetiredComponentCss` after `tcrnComponentCss` until the last one is gone;
    restyle overrides of the old tab roots and of the page header's trail (M22).
15. Replace reads of `--tcrn-shell-topbar-height`, `--tcrn-shell-sidebar-width`
    and `--tcrn-shell-sidebar-width-collapsed` (M24); allow `pin` wherever icon
    names are checked (M25); re-baseline pages built on `SettingsLayout` or
    `DocumentCanvas`, which are now held to 1040px and centred (M27).

### TCRN TMS

`docs/tms-adoption-guide.md` records that TMS has no Design System dependency, so
TMS adopts 4.0.0 directly. If TMS took a 3.x dependency since, apply the AOS list
above; in either case:

1. Load the fonts (M1).
2. Write the new token names from the start; the 3.x names are deprecated aliases
   (M2), and the scale is G+ (M3).
3. Use the package-backed TMS mark: `ProductLogo productId="tms"`,
   `TcrnBrandMark productId="tms"`, or `tcrnProductMarkSvg("tms")` for a standalone
   SVG file (M8).
4. The TMS taglines come from the package: zh-CN 艺人管理系统 (was 人才管理系统),
   en Talent Management System, ko 탤런트 관리 시스템 (M8). The wordmark suffix reads
   `--tcrn-brand-suffix-tms`: #2c63c8 in both themes (M28; the night value #7aa0f5
   that M9 describes was withdrawn within 4.0.0).
5. Take icons from the roster, not from a third-party set (M6, M7).
6. Use `Text` props, the link classes (`tcrn-link`, with `tcrn-link--quiet` as its
   modifier), `Button size="lg"`, `ButtonGroup` and the pair-driven inputs instead
   of local variants (M10 to M14).
7. A `ProductShell` is the top band: pass `brandProductId="tms"`, a `pageHeader`,
   the navigation as `navGroups` (the menu model, up to four levels; the groups a
   3.x sidebar held become its groups), the pins from the TMS backend and
   `products` (M20, M21, M27). Navigation that a 3.x tree drew with `SideNav` moves
   into that menu, and a `TopBar` goes, since the band replaces it (M23); use the
   navigation family as it is in 4.0.0 (M22). Composition one's geometry (M18) was
   replaced within 4.0.0 and never ships.
8. Take the 38-name roster, `pin` included (M25); where a page shows the brand on
   one line, use `ProductLockup productId="tms" firstLine="rail"` (M26).

### Einzbern portal

1. Change every `workflow` registry use to `einzbern` (M8):
   `ProductLogo productId="einzbern"`, `ProductLockup productId="einzbern"`,
   `ShellBrandLockup productId="einzbern"`. The asset id is now
   `tcrn-einzbern-two-line` (was `tcrn-workflow-two-line`).
2. The Einzbern wordmark is the whole name "Einzbern" in the serif with the byline
   "by TCRN"; `lineOneSuffix` and `suffixClassName` are `null`, and the
   `tcrn-brand-wordmark__suffix--workflow` class is gone. Tagline: zh-CN
   项目记忆引擎, en Project memory engine (M8).
3. Replace reads of `--tcrn-brand-accent-workflow`; the deep colour is
   `--tcrn-brand-suffix-einzbern` (#3b5272, the same in both themes) (M5, M9).
4. Where the portal shows the Mana Orchestrate assistant, use
   `productId="mana-orchestrate"` (name Mana Orchestrate, tagline zh-CN
   项目记忆助手, en Project memory assistant) (M8).
5. Load the fonts (M1), move to the new token names (M2), keep the focus ring
   (M4), and take icons from the roster (M6, M7).
6. The portal follows this system through the Storybook URL. The authority file
   `tcrn-design-authority.json` takes its version from `@tcrn/ui-tokens`, so it
   reports `4.0.0`, with a new `tokensDigest`, only after the next docs deployment,
   which is an Owner decision. Until then the hosted file keeps the version it
   reports today (M17).
7. If the portal renders `ProductShell`, move it to the top band with
   `brandProductId="einzbern"` (or `"mana-orchestrate"`), a `pageHeader` and the
   pins (M20, M21, M27), and replace the deprecated shell parts (M23). Composition
   one's geometry (M18) was replaced within 4.0.0 and never ships.
8. Restyle overrides of the old tab roots and of the page header's trail (M22),
   replace reads of the three deprecated shell tokens (M24), and allow `pin`
   wherever icon names are checked (M25).

## Items the second batch overtook

The first batch was a candidate, never published, when the second batch replaced
part of it, so no consumer receives the first-batch statements below. The items keep
the wording they were written with; follow the right-hand column.

| First-batch statement | What 4.0.0 ships instead |
| --- | --- |
| M7: the icon roster has 37 names | 38 names: `pin` was added (M25). |
| M9: the TMS suffix is #7aa0f5 by night, declared in both theme blocks | #2c63c8 in both themes, declared once in the theme-independent block (M28). |
| M15: the product shell's side-navigation and mobile-navigation toggles | The shell renders neither; the theme toggle sits in the avatar menu, and the two toggle parts are deprecated (M20, M23). |
| M18: composition one's desktop geometry, its four tokens and the `--tcrn-product-shell-sidebar-width` override | The top band and the paper (M20); three of the four tokens are deprecated and `--tcrn-radius-paper` stays (M24); no package rule reads the override any more. |
| "Open Owner decisions" below: the composition-one geometry, the night suffix values and the toggle sizes | The second-batch paragraph at the end of that section. |

## Breaking changes in detail

### M1 · Fonts ship in the package

Change: five SIL OFL 1.1 families ship in `@tcrn/ui-tokens` as WOFF2 files: Hanken
Grotesk (UI), Source Serif 4 (headings and figures), IBM Plex Mono, Noto Sans SC and
Noto Serif SC (Chinese fallbacks, as the upstream slices that cover product text).
`@tcrn/ui-tokens/fonts.css` declares them, and `tokens.css` starts with
`@import "../fonts/fonts.css";`. The JS export `tcrnTokenCss` has no `@import`.
Each family token follows its Latin face with a bundled Chinese face:
`--tcrn-type-family-ui` and `--tcrn-type-family-mono` with Noto Sans SC,
`--tcrn-type-family-serif` and `--tcrn-type-family-heading` with Noto Serif SC.
The mono stack is `"IBM Plex Mono","Noto Sans SC",ui-monospace,Menlo,monospace`,
so Chinese in mono text draws in Noto Sans SC instead of a system face.

Do:

- If you inject `tcrnTokenCss`, add `import "@tcrn/ui-tokens/fonts.css";` once at
  the shell. If you import `@tcrn/ui-tokens/tokens.css` through a bundler that
  follows CSS imports, the fonts come with it.
- Remove links to a font CDN (`fonts.googleapis.com`, `fonts.gstatic.com`); the
  files are served from your own build.
- Let the bundler copy the `.woff2` files unchanged. When you redistribute them,
  keep `FONT-LICENSES.md` and `licenses/` with them; do not sell the fonts on their
  own, and rename a font if you modify it (minutes D4).
- If you override a family token, keep the Noto face after the Latin face, so
  Chinese text stays on the bundled files. In this repository `fonts:proof` is red
  when a family token loses that fallback.

Source: 296a0c1 (TCRN-DS-SUB-004), e532b52 (TCRN-DS-SUB-006), 343c2e3 (OFL-1.1 in
the licence allow-list), e79092f (TCRN-DS-SUB-048), ed98557 (TCRN-DS-SUB-049);
handoffs W1-C, W2-A and P1 (r2).

### M2 · Token names follow the G+ contract; old names are deprecated aliases

Change: colour, elevation, selection, motion easing and type family tokens take
the contract names (table below). Each old name stays defined as
`--old: var(--new)` and resolves to the new value. `--tcrn-motion-press-scale`
stays at 0.97 with no successor.

The names sit in three blocks of `tokens.css` and `tcrnTokenCss`: the light theme
block on `:root, [data-tcrn-theme="light"]`, the theme-independent block on
`:root`, and the dark theme block on `[data-tcrn-theme="dark"]`. Because the light
block also answers to `data-tcrn-theme="light"`, a container marked light inside
a dark page takes the light values again; with the former `:root`-only light
block it inherited the night values. `tcrnGplusThemeSelectors.light` carries the
same selector list.

Do:

1. List the old names your sources still use. From a TCRN Design System checkout
   with `@tcrn/ui-tokens` built:
   `node scripts/token-deprecation-notice.mjs --label <consumer> <absolute path>...`
   prints one line per old name, `deprecated token <old> (n uses): use <new>`, and
   exits 0. It skips token blocks marked `tcrn-token-block` and copied alias
   declarations, and adds a note where an old name is set to a value. In code,
   `formatDeprecatedTokenNotices(findDeprecatedTokenUsages(source))` gives the same
   lines but counts every occurrence, declarations included.
2. Replace each old name with its new name. Where your code sets an old name to a
   value, set the new name instead; the aliases only read.
3. Drop uses of `--tcrn-motion-press-scale`: a G+ press changes the fill and does
   not scale.
4. To show a light region inside a dark page, set `data-tcrn-theme="light"` on
   it. If you parse the token stylesheet yourself or look for a literal
   `:root {`, accept the selector list: `parseTokenCssBlocks` reports it in
   canonical form and `compareTokenThemeBlocks` matches lists in any order and
   spacing.

Source: a88b7ad (TCRN-DS-SUB-001), e532b52 (TCRN-DS-SUB-006), 812cf3f
(TCRN-DS-SUB-003), 4a59144 (TCRN-DS-SUB-047); handoffs W2-A, W3-A and P1 (r2).

### M3 · Token values move to the G+ scale

Change: control heights are 28, 32 and 40px (`--tcrn-control-height-sm|md|lg`),
control padding 10, 12 and 16px, control text 12, 13 and 14px, icon sizes 14, 16
and 20px, radii 8, 6, 12, 4 and 3px (`--tcrn-radius-control|small|panel|check|stamp`),
motion 120, 80, 240 and 900ms with one ease. Body text is 13/20, reading 14/22,
meta 12/16, caption 11/16, page 36/40, heading-2 26/30, section and heading-3 20/26.
Line height tokens now carry px units. `--tcrn-type-family-heading` (Source Serif
4) is new. Colours, shadows and the control outline (`--tcrn-color-line-ctl`)
change in both themes.

The type scale comes from the contract: the 29 type steps (sizes, line heights,
weights, tracking, tabular numerals and the heading family) are generated from
`contract/typography.json` into `gplus-tokens.generated.ts` (the list is not
re-exported from the package index), and the type rules of `@tcrn/ui-react` refer
to them through `var(--tcrn-type-*)`. This changed no value: `tokens.css` is byte
for byte the same as before the change. Four declarations in those rules keep a
literal because no token exists for them yet: the inline numeral 16px, the large
numeral 44px on a 48px line, and the mono text 11.5px. Adding tokens for them, or
moving them to existing steps (which changes their look), is an open Owner
decision.

Do: re-baseline screenshots and computed-style assertions, and check any
`calc()` that multiplies a line height token as a unitless number. Assertions on
the computed size of `Text` numerals and mono text read the four literal values
until that decision.

Source: a88b7ad (TCRN-DS-SUB-001), e532b52 (TCRN-DS-SUB-006), c48b736
(TCRN-DS-SUB-052); handoffs W2-A and P2 (r2).

### M4 · The focus ring is a box-shadow

Change: `--tcrn-focus-ring` is `0 0 0 2px var(--tcrn-color-surface), 0 0 0 4px
var(--tcrn-color-acc)`, computed where it is declared. Package controls draw their
edge and the ring in `box-shadow` and keep a transparent outline for forced
colours. Inside `ProductShell`, elements that are not package controls get the G+
ring in place of the former 3px outline.

Do:

- Do not set `box-shadow` or `outline` on focused package controls; doing so
  removes the ring or the edge.
- A container that sets `--tcrn-color-surface` (for example to the panel colour)
  declares `--tcrn-focus-ring` again so the gap matches.
- Your own focusable elements can use `box-shadow: var(--tcrn-focus-ring)`; the
  3.x names `--tcrn-color-focus-ring` and `--tcrn-elevation-focus` are aliases (M2).

A focused read-only text field also shows the ring and keeps its read-only fill
and ink (M14). A focused `tcrn-link` draws the ring and keeps a transparent outline
for forced colours (M10).

Source: a88b7ad (TCRN-DS-SUB-001), 385ee0a (TCRN-DS-SUB-018), 7213a27
(TCRN-DS-SUB-058), 4a6ab92 (TCRN-DS-SUB-055); handoffs W2-A, W2-D and P2 (r2).

### M5 · Retired brand accent tokens are removed (no alias)

Change: `--tcrn-brand-accent-tms`, `--tcrn-brand-accent-workflow`,
`--tcrn-brand-accent-design-system-1` to `-4` and
`--tcrn-color-brand-secondary-readable` are no longer defined.
`--tcrn-brand-accent-aos` stays.

Do: `--tcrn-brand-accent-tms` becomes `--tcrn-brand-suffix-tms`,
`--tcrn-brand-accent-workflow` becomes `--tcrn-brand-suffix-einzbern`, and the
Design System suffix is `--tcrn-brand-suffix-design-system`; the four-colour Design
System mark is drawn by the mark itself. `--tcrn-color-brand-secondary-readable`
has no successor: pick the G+ colour token for the role.

Source: 94d7cdf (TCRN-DS-SUB-021); handoff W2-F.

### M6 · `lucide-react` is removed

Change: `@tcrn/ui-react` no longer depends on `lucide-react`; all icons are drawn
from the package's own contract paths.

Do: replace `lucide-react` imports with `<Icon name="…" />` from `@tcrn/ui-react`.
If an icon you need is not in the roster, ask for it in the design contract;
adding a name is a contract change, not a local drawing.

Source: 52065c0 (TCRN-DS-SUB-015); handoff W2-C.

### M7 · The icon roster has 37 names, and `strokeWidth` is gone

Change: `tcrnIconNames` and `IconName` cover 37 names, the 28 from 3.x plus `plus`,
`minus`, `users`, `bell`, `copy`, `trash`, `calendar`, `more-horizontal` and
`chevron-up`. Icons draw on a 20-unit grid with a 1.25 stroke that does not scale.
`strokeWidth` is removed from `IconProps`. `size` is `sm`, `md` or `lg` (14, 16,
20px) or a number. The `.tcrn-icon` base rule now ships in the package.

Do: remove `strokeWidth`; keep `name` inside the roster (a name outside it fails
type checking); drop local `.tcrn-icon` base rules that restate the package rule.

Source: 863ab1e (TCRN-DS-SUB-014), f94b1be (TCRN-DS-SUB-018); handoff W2-C.

### M8 · The product logo registry: `workflow` becomes `einzbern`, `mana-orchestrate` is added

Change: `TcrnProductLogoId` is `design-system`, `aos`, `tms`, `einzbern` or
`mana-orchestrate`. The four products with a mark take their name, wordmark face
and taglines from the contract, and entries gain `markId`, `wordmark` (`sans` or
`serif`) and `byline`. Einzbern and Mana Orchestrate are serif whole names with the
byline "by TCRN", and their `lineOneSuffix` and `suffixClassName` are `null`.
Taglines change: Design System zh-CN 设计系统 and en Design System (were 组件库 and
Component Library); TMS zh-CN 艺人管理系统 (was 人才管理系统) and ko 탤런트 관리 시스템.
`TcrnBrandMark` takes `productId` and `variant` (`color`, `mono`, `tile-tint`,
`tile-deep`) and draws the mark inline; `ProductLogo`, `ProductLockup` and
`ShellBrandLockup` take `markVariant`. `tcrnProductMarkSvg`, `tcrnProductMarkIds`
and `tcrnProductMarkVariants` are new. The AOS entry is unchanged.

Do: rename `workflow` to `einzbern` in props and registry reads; treat
`lineOneSuffix` and `suffixClassName` as nullable; update tagline assertions.

Source: ccb7bea (TCRN-DS-SUB-022), 1def73f (TCRN-DS-SUB-023); handoff W2-F; minutes
D5.

### M9 · Wordmark suffix colours

Change: the gradient suffix is removed. TCRN and a lockup without `productId` are
set in ink; the TMS suffix reads `--tcrn-brand-suffix-tms` (#2c63c8) and the Design
System suffix `--tcrn-brand-suffix-design-system` (#6577f3). Each is one colour in
both themes, declared in the theme-independent block of `tokens.css` (M28): the night
value #7aa0f5 that the first batch gave the TMS suffix was withdrawn before 4.0.0 was
cut, and whether night takes it is an open Owner decision (D7).

Do: remove local gradient or suffix colour overrides; assert #2c63c8 and #6577f3 in
both themes, and find both variables in the theme-independent block when parsing
`tokens.css`.

Source: ccb7bea (TCRN-DS-SUB-022), 52faa47 (TCRN-DS-SUB-088); handoffs W2-A,
W2-F and P1 (r3); minutes D2.

### M10 · `Text` props, `Heading` titles, link states

Change: `Text` gains `size` (`body`, `reading`, `meta`, `caption`), `tone`
(`default`, `strong`) and `variant` (`numeral`, `caps`). Without props it still
renders `class="tcrn-text"`: a 13/20 paragraph in the secondary ink. `numeral` and
`caps` are single-line; a unit goes in a `small` element, a numbering prefix in a
`b` element. `Heading` levels 1 to 4 are single-line and carry their text as
`title`. The clamp heading sizes are gone.

Links: `tcrn-link` states go through a pair table (live pair `--tcrn-pair-ink`,
`--tcrn-pair-underline` and `--tcrn-pair-edge`). The link rests in acc with an
acc-ul underline; hover switches ink and underline to acc-2; focus draws the focus
ring over a transparent outline. `tcrn-link--quiet` is now a modifier of
`.tcrn-link`: on its own it has no styles. A quiet link rests in the current text
colour with a transparent underline; its hover underline is acc-2 at the 2px link
offset (it was the accent at a 0.2em offset).

Do: replace local font-size or numeral and caps classes on `Text` with the props;
update snapshots for the new `title` attributes. Write
`class="tcrn-link tcrn-link--quiet"` wherever you used `tcrn-link--quiet` alone
(this repository has no such use), and drop local hover colour or underline offset
overrides on links.

Source: e7ef431 (TCRN-DS-SUB-012), 4a6ab92 (TCRN-DS-SUB-055); handoffs W2-B and
P2 (r2).

### M11 · `Highlight` mark class

Change: the mark uses `tcrn-highlight__mark` (was `tcrn-highlight-mark`) and only
adds the accent wash; weight, letter spacing, size and padding are inherited.

Do: rename selectors and test patterns.

Source: 4e5b798 (TCRN-DS-SUB-013); handoff W2-B.

### M12 · `Button`, `IconButton`, `LinkButton` and `ClipboardCopyButton`

Change: the buttons read a state pair table; `border` is 0 and the edge is a
box-shadow; the press scale, transforms and the 0.64 disabled opacity are gone.
`size` adds `lg` (40px). `loading` sets `aria-busy` and shows the loader; the busy
wording is the caller's children. `ClipboardCopyButton` no longer accepts
`loading` and shows one icon per settled state. A disabled `Button` with a reason
puts "label — reason" in its `title`, the visible label first (it was the reason
alone); a button without visible text keeps the reason alone, and the reason is
still the `aria-describedby` description.

Do: replace height overrides with `size="lg"`; remove `border-color`, `transform`
and `box-shadow` overrides on buttons; remove `loading` from `ClipboardCopyButton`;
update assertions on the `title` of disabled buttons with a reason.

Source: b7eb514 (TCRN-DS-SUB-016), 7f631b2 (TCRN-DS-SUB-017), 385ee0a
(TCRN-DS-SUB-018), e0baaba (TCRN-DS-SUB-079); handoffs W2-D and P10 (r2).

### M13 · `ButtonGroup`

Change: new component. `ariaLabel` is required and `variant` is `secondary` or
`quiet`; members share one outline and a separator, and a single choice is marked
with `aria-pressed` on the member.

Do: replace hand-built rows of joined buttons with `ButtonGroup`.

Source: 7f631b2 (TCRN-DS-SUB-017); handoff W2-D.

### M14 · Inputs

Change: `Input`, `Textarea`, `NumberInput`, `DatePicker`, `SuggestInput` and the
`Select` and `MultiSelect` triggers read one pair table, with `border: 0` and an
inset box-shadow edge. `Checkbox`, `Radio` and `Switch` read their own pair tuples;
`Switch` has no disabled opacity. `SearchInput` takes the ink-wash tool form in the
top bar and in forms. `Select` now renders inside `span.tcrn-select-wrap` and
`DatePicker` inside `span.tcrn-date-picker-wrap`, each with its end icon.
`.tcrn-field:focus-within` no longer washes the field.

A focused read-only text field (`[readonly]` or `[aria-readonly="true"]`) shows
the focus ring and keeps its read-only fill and ink
(the `rf` state, ordered after `r`; the Inputs board lets read-only cover focus,
so this differs from the board on purpose). `.tcrn-field--error` no longer washes
the whole field or recolours its outline, and `.tcrn-field__error` reads
`--tcrn-color-bad`; the forced-colours outline of a field in error stays. The
search shortcut text is ink-2 (was ink-3). The `MultiSelect` trigger has the
`Select` end, `padding-inline-end: 30px` with the caret placed like the `Select`
chevron, and `.tcrn-multi-select-dropdown` is now a flex column
(`flex-direction: column`, `align-items: stretch`): a static expanded list sits
directly below the trigger at the trigger's width. Dropdown options declare their
own pair; hover and selection only switch it.

Do: remove `border-color` overrides and mark errors with `aria-invalid="true"`,
which selects the invalid pair; point direct-child selectors (`> .tcrn-select`) at the wrappers;
update search box assertions. Do not add a background back to
`.tcrn-field--error`; update assertions on the error field's background and
outline, the shortcut colour and the `MultiSelect` trigger's end padding.

Source: 697d4eb (TCRN-DS-SUB-019), 0daff9d (TCRN-DS-SUB-020), 715533d
(TCRN-DS-SUB-021), 7213a27 (TCRN-DS-SUB-058), 696f516 (TCRN-DS-SUB-059), fe6a4bb
(TCRN-DS-SUB-060), 5e799a6 (TCRN-DS-SUB-061), 48399ae (TCRN-DS-SUB-062), 1a10b84
(TCRN-DS-SUB-091); handoffs W2-E, P2 (r2), P4 (r2) and P5 (r3); minutes D2.

### M15 · Product shell toggles

Change: the theme, side-navigation and mobile-navigation toggles follow the
Actions pairs; the package no longer writes colour, shadow, transition, hover or
press rules for them. Their sizes (36 and 38px) are unchanged pending design. The
theme toggle shows its sun or moon by its own `data-current-theme`; the default
and `html[data-tcrn-theme="dark"]` icon display rules are gone, so a toggle inside
a block-level theme shows the current icon instead of neither.

Do: remove local overrides that restyle these toggles, including rules that show
or hide the toggle's icons by a page-level theme.

Source: 385ee0a (TCRN-DS-SUB-018), 6976d2f (TCRN-DS-SUB-057); handoff P3 (r2).

### M16 · Unreleased `main` only: `@tcrn/ui-domain`

Change: the `@tcrn/ui-domain` package that existed on `main` after 3.0.0 was merged
into `@tcrn/ui-react` under functional names (`AttachmentList`, `MetadataRail`,
`RecordTable`, `RecordInspector`, `StagePipeline`). Consumers of 3.0.0 are not
affected.

Do: import those components from `@tcrn/ui-react`.

Source: b29f15f; the "De-productized functional display surface" entry in the
4.0.0 section of `CHANGELOG.md`.

### M17 · The design authority file

Change: `tcrn-design-authority.json`, served beside the AI consumption contract,
reads its version from `packages/ui-tokens/package.json` and carries a sha256 of
the token stylesheet. Both change with 4.0.0 at the next deployment.

Do: nothing until the deployment. After it, the version and digest the portal
reads will be 4.0.0 and the new digest.

Source: e8d0317; `apps/storybook/src/build/design-authority.ts`.

### M18 · `ProductShell` takes composition one's desktop geometry

Change: four theme-independent tokens are new: `--tcrn-shell-sidebar-width`
(220px), `--tcrn-shell-sidebar-width-collapsed` (52px), `--tcrn-shell-topbar-height`
(52px) and `--tcrn-radius-paper` (14px). `ProductShell` reads them (a
design-session ruling of 2026-10-11, open to Owner correction): the sidebar is
220px (was 280) and 52px collapsed (was 92); the shell's top bar has a 52px
minimum height (was 68); the workspace is a sheet 12px from the shell's top, right
and bottom edges, with the 14px radius, the s1 shadow and the panel fill; the
sidebar sits on the shell's canvas colour with no right border; navigation items
and group titles keep a 16px lead column with the text at 48px.
`--tcrn-product-shell-sidebar-width` stays the shell's local variable, now
defaulting to `--tcrn-shell-sidebar-width` (collapsed:
`--tcrn-shell-sidebar-width-collapsed`). The lead column, the collapsed padding
and the sheet apply under `@media not all and (max-width: 760px)`; the mobile
block (max-width: 760px) is unchanged, while the canvas-coloured sidebar and the
52px top bar minimum apply at every width. The standalone `TopBar` keeps its 68px
minimum height. The NavItem markup, API and state rules are unchanged.

Do: re-baseline screenshots and geometry assertions of product shell screens
(sidebar and collapsed widths, top bar height, the workspace's inset, radius and
shadow, the sidebar's background and right border). A screen that needs another
sidebar width sets `--tcrn-product-shell-sidebar-width` on the shell. The Storybook
composition-one samples no longer export `gplusSampleSidebarWidth`; it was never
part of the packages.

Source: 907de34 (TCRN-DS-SUB-090), 772a464; handoff P1 (r3); the storybook map's
DIFF-1 and DIFF-3.

### M19 · The deferred prototype roster

Change: `componentLibraryDeferredPrototypeNames` lists `KnowledgeBaseShellDemo`
only; `DenseOperationsShellDemo` and `CompactToolShellDemo` left it, and the
`ComponentLibraryDeferredPrototypeName` type with it, after their prototypes were
retired from the navigation shell stories.

Do: remove reads of the two retired names.

Source: 4d0dfde (TCRN-DS-SUB-105), 95f0e09 (TCRN-DS-SUB-066); handoff P3 (r3).

### M20 · `ProductShell` is the top band; the side rail and its props are removed

Change: `ProductShell` has one layout (the second batch, TCRN-DS-INIT-016): a 52px top
band with no fill and no rule over the paper. The band holds the brand button, which
opens the full menu (`ShellMenu`); the pinned items (`ShellPins`, with a `ShellDropdown`
for a pinned group or submenu); and the top-right cluster: the product's
`headerActions`, the bell and the avatar. The paper is 12px from the shell's sides and
bottom, under the band, with the paper radius and the s1 shadow, and the page scrolls
inside it. The side rail, its collapse control, the mobile drawer toggle, the top bar
with its current-location caption and search field, and composition one's desktop
geometry (M18: the 220 and 52 rail, the 16 and 48 lead column, the sheet beside the
rail) are gone, and so are the rail tokens' last readers in the shell rules. The theme
toggle and the language menu moved into the avatar menu, beside the product switcher
(`products`); the full menu and its lockup list no products. The shell's search is the
full menu's.

Removed props, now type errors: `collapsed`, `collapsedStorageKey`,
`onCollapsedChange`, `sideNavCollapseDisabledReason`, `mobileNavExpanded`,
`onMobileNavExpandedChange`, `navId`, `navLabel`, `brandHref`, `brandSuffix`,
`brandCaption`, `brandMarkSrc`, `brandMarkAlt`, `currentLocationLabel`,
`currentLocationLabelKey`, `search`, `onSearchExpandedChange`, `onSearchDismiss` and
`onSearchResultActivate`.

Changed: `brandProductId` is required and is a product mark id (`tms`, `einzbern`,
`mana-orchestrate`, `design-system`, the logos2 marks); a product passes its key and no
brand copy. `aos` has no logos2 mark, so an AOS shell has no brand button yet (an open
item). `ProductShellNavGroup` and `ProductShellNavItem` extend `ShellMenuGroup` and
`ShellMenuItem`: an item takes `children` (the third level, and theirs the fourth), its
`href` is optional when it has children, and `disabled`, `disabledReason` and `depth`
are gone (the nesting is the depth). The selected entry is the one with
`selected: true`; the shell derives the selected row, the selected pin and the current
position from it.

New props: `pinnedIds` and `onPinnedChange`, `account`, `products`, `notifications`,
`menuOpen` and `onMenuOpenChange`, `openPinId` and `onOpenPinChange`,
`accountMenuOpen` and `onAccountMenuOpenChange`, `searchPlaceholder` and
`searchProvider`. The root carries `data-shell`, `data-state` (`closed`, `expanded`,
`drop`), `data-package-backed-product-shell-boundary="top-band-shell-v2"` and
`data-product-shell-pattern="top-band"`; `data-product-shell-collapsed`,
`data-side-nav-collapsed`, `data-mobile-nav-expanded` and
`data-product-shell-responsive` are gone.

Do: remove the retired props; pass a mark id; serve search results through
`searchProvider`; keep passing the theme and locale props, which now render in the
avatar menu; re-baseline screenshots and geometry assertions of product shell screens.
`SideNavCollapseButton` and `MobileNavToggle` stay exported until their own retirement
entry.

Source: caf6cfa (TCRN-DS-SUB-119); handoff P1c (INIT-016 r1).

### M21 · Shell preferences: `collapsed` leaves, the pins arrive

Change: `ProductShellRequestPreferences` is `{ theme, locale, pins }`. `collapsed` is
gone; `pins` is new: the ordered ids of the pinned groups, items and submenus.
`readPreferenceCookieValues(header, { themeKey, localeKey })` reads the theme and the
locale only; `collapsedKey` is gone and no cookie key was added. The pins are a server
preference per user and per product: the product's backend passes them as
`requestPreferences.pins` and stores what `onPinsChange` reports. The controller keeps
a local fallback in `localStorage` under `pinsStorageKey` (by default
`tcrn-shell-pins:<productId>`) and never in a cookie. The band shows the first six
(`--tcrn-shell-pins-max`); a seventh pin is kept and the full menu marks it.
`useProductShellController` no longer takes `initialCollapsed`, `collapsedStorageKey`,
`onCollapsedChange` or `navId`, and takes `productId`, `initialPins`, `pinsStorageKey`
and `onPinsChange`. It returns `pins`, `setPins`, `setPinned` and `movePin` (where a
drag ends) instead of `collapsed`, `setCollapsed`, `toggleCollapsed`,
`sideNavCollapseButtonProps`, `mobileNavExpanded` and `setMobileNavExpanded`;
`productShellControlProps` carries `pinnedIds` and `onPinnedChange`.

Do: stop reading and writing the collapsed cookie; pass `productId`; pass the pins from
your backend and store the list `onPinsChange` reports.

Source: TCRN-DS-SUB-120; handoff P1c (INIT-016 r1).

### M22 · The navigation family takes its place in the top-band shell

Change: the five tab-shaped forms are one family. `Tabs`, `ModuleTabs`, `SectionTabs`,
`SegmentedNav` and `ViewTabs` render one block, `tcrn-tabs`, in three variants:
`tcrn-tabs--panel` (`Tabs`, the ARIA pattern that swaps a panel), `tcrn-tabs--nav`
(`ModuleTabs`, `SectionTabs`, `ViewTabs`) and `tcrn-tabs--segmented` (`SegmentedNav`).
Every tab is `tcrn-tabs__tab` with its label in `tcrn-tabs__label` and as a `title`; the
chosen tab carries `data-selected="true"` and takes the 6% ink wash and the strong
weight, nothing else (the panel tabs' bottom edge is gone). The old roots
(`tcrn-module-tabs`, `tcrn-section-tabs`, `tcrn-segmented-nav`, `tcrn-view-tabs`) stay on
the element through 4.0.x as hooks without rules; `SegmentedNav` leaves the family list
as a variant of `Tabs`. `PageHeader` renders `Breadcrumb` as its first row:
`nav.tcrn-breadcrumb > span.tcrn-breadcrumb__item > a|span|b.tcrn-breadcrumb__crumb[title]`
with the board's 11 chevron as `svg.tcrn-breadcrumb__separator`; the current page is
`b[aria-current="page"]`, and the trail keeps to one line. The
`tcrn-page-header__breadcrumbs`, `__breadcrumb`, `__crumb` and `__crumb-separator` classes
are gone. `TreeNav` drops its panel frame and its rows take the menu row's grammar, for
use in the full menu and the drop-downs.

Do: restyle any override of the old tab roots or of `tcrn-tabs__tab--selected` against
`.tcrn-tabs__tab[data-selected="true"]`; select the page header's trail as
`.tcrn-page-header .tcrn-breadcrumb`; in a `Breadcrumb` mark the current page with
`selected`.

Source: TCRN-DS-SUB-124; handoff P8 (INIT-016 r1).

### M23 · Six parts of the old shell are deprecated; their rules leave the component sheet

Change: the top band is the only shell, so the parts built for the side rail and the old
top bar are deprecated. Each keeps its export, its place in
`componentLibraryPublicComponentNames` and a JSDoc `@deprecated` through 4.0.x, is listed
in the new `componentLibraryDeprecatedComponentNames`, and is removed in 4.1. Their rules
are no longer in `tcrnComponentCss`: they are in the new `tcrnRetiredComponentCss`, which a
consumer that still renders one of them adds after `tcrnComponentCss`. `SubNav` stays as
the page's own second-level navigation; `TocRail` and bookmarks are page content in the
paper, never in the shell.

| Part | Family | Do instead |
| --- | --- | --- |
| `SideNav` | navigation | Give `ProductShell` the navigation as `navGroups`; `NavGroup` and `NavItem` rows render in the full menu and the drop-downs. |
| `SideNavCollapseButton` | navigation | Remove it: there is no rail to collapse, and the full menu opens from the brand button. |
| `MobileNavToggle` | navigation | Remove it: on a phone the brand button opens the full menu as a Sheet. |
| `TopBar` | shell | Use `ProductShell`: its band holds the brand button, the pins and the cluster. |
| `ProductLauncher` | shell | Pass `ProductShell` its `products`; the avatar menu switches products. |
| `ProductSwitcher` | shell | Pass `ProductShell` its `products`; the avatar menu switches products. |

Do: replace each part as the table says, then drop `tcrnRetiredComponentCss`. Until then,
add `tcrnRetiredComponentCss` after `tcrnComponentCss` wherever a deprecated part still
renders. Put a `TocRail` in the page's own content (for a document, at its side) inside
`ProductShell`'s children.

Source: TCRN-DS-SUB-125; handoff P8 (INIT-016 r1).

### M24 · Three shell tokens are deprecated; the top band's tokens are new

Change: three of the four tokens M18 added are deprecated through the existing
registry. They still resolve, and `ProductShell` reads none of them.
`--tcrn-shell-topbar-height` is a deprecated alias of `--tcrn-shell-strip-h`, the
band's height (both 52px), and is listed in `tcrnDeprecatedTokenAliases`.
`--tcrn-shell-sidebar-width` (220px) and `--tcrn-shell-sidebar-width-collapsed`
(52px) are deprecated with no successor: they keep their values, and
`tcrnDeprecatedTokens` lists them with a `null` replacement. `findDeprecatedTokenUsages`
reports all three. `--tcrn-radius-paper` (14px) is not deprecated: it is the paper's
radius. Twenty tokens are new, all in the theme-independent `:root` block: the band
(`--tcrn-shell-strip-h` 52px, `--tcrn-shell-brand-h` 40px, `--tcrn-shell-brand-w`
134px, `--tcrn-shell-toggle` 20px, `--tcrn-shell-pin-h` 32px, `--tcrn-shell-pin-gap`
8px, `--tcrn-shell-pins-max` 6, `--tcrn-shell-menu-gap` 6px), the full menu and the
drop-downs (`--tcrn-shell-panel-w-expanded` 952px, `--tcrn-shell-pbar-h` 44px,
`--tcrn-shell-drop-w` 240px, `--tcrn-shell-drop-srch-h` 28px,
`--tcrn-shell-cascade-gap` 4px, `--tcrn-shell-row-h` 32px, `--tcrn-shell-srch-h`
40px, `--tcrn-shell-pinb` 24px) and the sign-in intro (`--tcrn-motion-intro-fade`
120ms, `--tcrn-motion-intro-move` 240ms, `--tcrn-motion-intro-rise` 100ms,
`--tcrn-motion-intro-max` 700ms).

Do: replace `--tcrn-shell-topbar-height` with `--tcrn-shell-strip-h`; remove reads
of the two sidebar widths, since there is no rail to size; run the deprecation
notice over your sources. The new shell tokens need no action: `ProductShell`
applies them itself.

Source: a7a1b0b (TCRN-DS-SUB-113); handoff P1a (INIT-016 r1).

### M25 · The icon roster has 38 names: `pin`; navigation rows can carry a pin

Change: `pin` joins `tcrnIconNames` and `IconName`, so the roster has 38 names
(M7's 37 and `pin`). It is one name in two forms: `<Icon name="pin" />` draws the
outline, and where a pin is pressed the package's CSS fills its first shape with
`currentColor` for the solid form. The `Icon` API is unchanged. `NavItem` and
`NavGroup` take three optional props, `pinned`, `onPinnedChange(pinned)` and
`pinLabel`, and `NavGroup` takes `locale`. Given `onPinnedChange`, they render a
24px pin button, `button.tcrn-nav-pin[data-pin-button]`, with `aria-pressed` equal
to `pinned` and a five-locale name built from `pinLabel` (in English "Pin to top
bar: {name}" and "Unpin from top bar: {name}"); a click on it does not follow the
link. A link cannot hold a button, so a pinnable `NavItem` becomes a row of two
siblings, `div.tcrn-nav-item-row` around the link and the pin; the props given to
`NavItem` stay on the link, and the row carries the fill and the ink. A pinnable
`NavGroup` wraps its title in `span.tcrn-nav-group__label-text`. Without
`onPinnedChange` both render as before.

Do: allow `pin` wherever icon names are checked against the roster. Pass
`onPinnedChange` only where a pin is wanted; `ProductShell` wires the pins of its own
menu (M21). A test or a style that goes from a pinnable item's link to its parent
now reaches `.tcrn-nav-item-row`.

Source: 3f87bb3, 04484e0 (TCRN-DS-SUB-123); handoff P2 (INIT-016 r1); minutes
TCRN-DS-MIN-20261013-SHELL D6.

### M26 · `ProductLockup` takes a first-line rendition

Change: `ProductLockup` takes `firstLine?: "rail" | "lockup"` (type
`ProductLockupFirstLineScale`). Given it, the lockup renders the brand board's first
line instead of the whole lockup: the colour mark beside the wordmark, its suffix in
the suffix colour, on one line, as
`div.tcrn-brand-lockup.tcrn-brand-lockup--line[role="img"]` with the product name as
its `aria-label` and `data-lockup="lkr-line"` (`"rail"`) or `"lk-line"`
(`"lockup"`). `"rail"` is the menu's scale (a 22px mark, the word at 12.5px and
600) and `"lockup"` the lockup's (a 44px mark, 16px and 600); Einzbern and Mana
Orchestrate set the whole name in the serif. The first line always takes the colour
mark, so `markVariant` does not apply to it. Without `firstLine` the lockup renders
as before. `ShellBrandLockupProps` is `Omit<ProductLockupProps, "firstLine">`.

Do: use `firstLine="rail"` where a page shows the brand on one line at the menu's
scale (the shell's brand button draws its own); do not pass `markVariant` with it;
code that spreads `ProductLockupProps` into `ShellBrandLockup` drops `firstLine`.

Source: 8c96e48 (TCRN-DS-SUB-127); handoff P2 (INIT-016 r1); minutes
TCRN-DS-MIN-20261013-SHELL D2.

### M27 · `ProductShell` requires `pageHeader`; the paper's content column

Change: `ProductShell` takes a required `pageHeader: PageHeaderProps` and renders it
as the paper's first row, `header.tcrn-page-header[data-pattern="page-header"]`,
before `children`. Without `pageHeader.breadcrumbs` the trail is the menu's current
position (the selected entry's path from its group to the page, or
`currentRouteLabel` alone when nothing is selected); without `pageHeader.locale` the
header speaks the shell's `currentLocale`. A trail or a locale the consumer gives
wins. `PageHeader` takes `locale`, and its `breadcrumbs` type is
`readonly PageHeaderBreadcrumb[]`. In the paper, the shell's main element is a
one-column grid with 14px 28px 12px padding (12px 16px at 760px and narrower). The
new theme-independent token `--tcrn-layout-content-max-w` (1040px) is the width
`SettingsLayout` and `DocumentCanvas` are held to, centred in the space they get;
`SplitView`, `DetailLayout` and `RecordTable` are not affected.

Do: pass `pageHeader` to every `ProductShell`; a page that rendered its own
`PageHeader` as the first child moves it into the prop and out of the children.
Re-baseline settings and document pages wider than 1040px.

Source: f635938 (TCRN-DS-SUB-129), 6d11e0a (TCRN-DS-SUB-130); handoff P6 (INIT-016
r1).

### M28 · The TMS suffix is one colour in both themes again

Change: `--tcrn-brand-suffix-tms` is #2c63c8 in both themes, declared once in the
theme-independent `:root` block, as the approved product-mark artwork has it
(TCRN-DS-MIN-20261013-SHELL D2). The dark theme block no longer declares it, and the
TMS entry of `tcrnGplusBrandTokens` has no dark value. M9's night value #7aa0f5 was
withdrawn before 4.0.0 was cut. By night the suffix is below 4.5:1 (the shell board
reads 3.13:1 on the paper and 3.33:1 on the canvas): the contrast proof and the axe
check carry two night TMS wordmark exemptions marked pending, and whether night
takes #7aa0f5 is an open Owner decision (D7, with the first batch's S-6).

Do: assert #2c63c8 for the TMS suffix in both themes; read a night value through
`createResolvedTokenMap("dark")`, since `tcrnDarkThemeTokens` no longer has it; a
parse of `tokens.css` finds the variable in the theme-independent block.

Source: 1f67057 (TCRN-DS-SUB-128); handoff P4 (INIT-016 r1).

### M29 · The shell's new parts

Change: the top band is built from five new exported parts, which `ProductShell`
composes, so most consumers only meet them through it. `ShellBrandButton` is the
134 by 40 brand button with the product's first line and a 20px disclosure slot
(`productId`, `expanded`, `version`, `locale`). `ShellPins` lays out up to six
pinned items and hides them below 1024px, where the full menu carries them;
`shellPinsOverflowIds` names the seventh pin onward. `ShellMenu` is the full menu,
952px wide, with search and up to four levels, shown as a panel wider than 760px and
as a Sheet at 760px and narrower (`presentation`, `shellMenuPresentationContext`,
`useShellMenuPresentation`, `shellMenuSheetMediaQuery`). `ShellDropdown` is a pinned
group's or submenu's drop-down, 240px wide, with cascades that open on click.
`ShellIntro` is the sign-in intro: once a session, on transform and opacity only,
and not at all under `prefers-reduced-motion`; `ProductShell` does not mount it.
The menu model types `ShellMenuGroup` and `ShellMenuItem` and the hook
`useShellTransientLayer` (Esc, a pointer outside and a selection close the layer and
return focus to its trigger) are exported, and the five parts are in
`componentLibraryPublicComponentNames`.

Do: nothing while you use `ProductShell`. To play the sign-in intro, mount
`ShellIntro` right after a successful sign-in, in the same render as the shell, so
the brand button is already in the document; it marks the session in
`sessionStorage` and does not play again in that session. Tests that read the shell
use the `data-shell`, `data-state`, `data-shell-strip`, `data-pins`, `data-cluster`,
`data-paper` and `data-panel` hooks.

Source: b44c4d7 (TCRN-DS-SUB-114), 5fe6158 (TCRN-DS-SUB-115), f2d2921
(TCRN-DS-SUB-116), 8391672 (TCRN-DS-SUB-117), 35c43d6 (TCRN-DS-SUB-118), 7eefd5b
(TCRN-DS-SUB-122), 5cb5b72 (TCRN-DS-SUB-126); handoffs P1a, P1b, P5 and P7
(INIT-016 r1).

## Deprecated token names

The value of each old name is `var(<new name>)`. "Theme" means the alias is
declared in both theme blocks with the same text; "theme-independent" means the
theme-independent `:root` block.

| Old name | New name | Block |
| --- | --- | --- |
| `--tcrn-color-text-primary` | `--tcrn-color-ink` | theme |
| `--tcrn-color-text-secondary` | `--tcrn-color-ink-2` | theme |
| `--tcrn-color-text-muted` | `--tcrn-color-ink-3` | theme |
| `--tcrn-color-text-tertiary` | `--tcrn-color-ink-3` | theme |
| `--tcrn-color-text-inverse` | `--tcrn-color-on-acc` | theme |
| `--tcrn-color-surface-canvas` | `--tcrn-color-bg` | theme |
| `--tcrn-color-surface-panel` | `--tcrn-color-panel` | theme |
| `--tcrn-color-surface-muted` | `--tcrn-color-panel-2` | theme |
| `--tcrn-color-neutral-calibration-canvas` | `--tcrn-color-bg` | theme |
| `--tcrn-color-neutral-calibration-panel` | `--tcrn-color-panel` | theme |
| `--tcrn-color-neutral-calibration-muted` | `--tcrn-color-panel-2` | theme |
| `--tcrn-color-neutral-calibration-border` | `--tcrn-color-line-ctl` | theme |
| `--tcrn-color-border-subtle` | `--tcrn-color-line` | theme |
| `--tcrn-color-border-strong` | `--tcrn-color-line-2` | theme |
| `--tcrn-color-border-control` | `--tcrn-color-line-ctl` | theme |
| `--tcrn-color-brand-teal` | `--tcrn-color-acc` | theme |
| `--tcrn-color-brand-primary` | `--tcrn-color-acc` | theme |
| `--tcrn-color-brand-primary-bg` | `--tcrn-color-acc-bg` | theme |
| `--tcrn-color-brand-secondary` | `--tcrn-color-acc-2` | theme |
| `--tcrn-color-brand-secondary-bg` | `--tcrn-color-acc-bg` | theme |
| `--tcrn-color-brand-accent` | `--tcrn-color-red` | theme |
| `--tcrn-color-brand-accent-bg` | `--tcrn-color-red-bg` | theme |
| `--tcrn-color-brand-neutral` | `--tcrn-color-ink-2` | theme |
| `--tcrn-color-brand-neutral-bg` | `--tcrn-color-panel-2` | theme |
| `--tcrn-color-focus-ring` | `--tcrn-color-acc` | theme |
| `--tcrn-color-focus-ring-calibrated` | `--tcrn-color-acc` | theme |
| `--tcrn-color-progress-track-calibrated` | `--tcrn-color-wash` | theme |
| `--tcrn-color-progress-fill-start-calibrated` | `--tcrn-color-acc` | theme |
| `--tcrn-color-progress-fill-end-calibrated` | `--tcrn-color-acc` | theme |
| `--tcrn-color-state-ready` | `--tcrn-color-ok` | theme |
| `--tcrn-color-state-ready-bg` | `--tcrn-color-wash` | theme |
| `--tcrn-color-state-blocked` | `--tcrn-color-bad` | theme |
| `--tcrn-color-state-blocked-bg` | `--tcrn-color-bad-bg` | theme |
| `--tcrn-color-state-warning` | `--tcrn-color-warn` | theme |
| `--tcrn-color-state-warning-bg` | `--tcrn-color-wash` | theme |
| `--tcrn-color-state-warning-calibrated` | `--tcrn-color-warn` | theme |
| `--tcrn-color-state-warning-calibrated-bg` | `--tcrn-color-wash` | theme |
| `--tcrn-color-state-danger-calibrated` | `--tcrn-color-bad` | theme |
| `--tcrn-color-state-danger-calibrated-bg` | `--tcrn-color-bad-bg` | theme |
| `--tcrn-type-family-latin` | `--tcrn-type-family-ui` | theme-independent |
| `--tcrn-type-family-distributable-latin` | `--tcrn-type-family-ui` | theme-independent |
| `--tcrn-type-family-distributable-zh-cn` | `--tcrn-type-family-ui` | theme-independent |
| `--tcrn-type-family-distributable-mono` | `--tcrn-type-family-mono` | theme-independent |
| `--tcrn-type-family-zh-cn` | `--tcrn-type-family-ui` | theme-independent |
| `--tcrn-elevation-floating` | `--tcrn-shadow-s3` | theme |
| `--tcrn-selection-fill` | `--tcrn-color-wash` | theme |
| `--tcrn-selection-fill-hover` | `--tcrn-color-hover` | theme |
| `--tcrn-selection-edge` | `--tcrn-color-ink` | theme |
| `--tcrn-elevation-focus` | `--tcrn-focus-ring` | theme |
| `--tcrn-motion-ease-out` | `--tcrn-motion-ease` | theme-independent |
| `--tcrn-motion-press-scale` | none (stays defined) | theme-independent |
| `--tcrn-shell-topbar-height` | `--tcrn-shell-strip-h` | theme-independent |
| `--tcrn-shell-sidebar-width` | none (stays defined, 220px) | theme-independent |
| `--tcrn-shell-sidebar-width-collapsed` | none (stays defined, 52px) | theme-independent |

The table is the content of `tcrnDeprecatedTokenAliases` (51 entries) plus the three
entries of `tcrnDeprecatedTokens` without a successor; the last three rows came with
the second batch (M24). Read those exports for the current list. Names kept with new G+ values rather than aliased:
`--tcrn-type-family-ui`, `--tcrn-type-family-mono`, `--tcrn-radius-control`,
`--tcrn-radius-panel`, `--tcrn-radius-surface` (equal to panel),
`--tcrn-type-size-control`, the type size, line height and weight steps, and the
motion shorthands `--tcrn-motion-fast`, `-instant`, `-standard`, `-emphasis` and
`--tcrn-selection-glide`.

## Open Owner decisions that can still move values

These are recorded in `docs/dispatch/2026-10-11-gplus-renewal/owner-acceptance.md`.
Until they are ruled on, 4.0.0 behaves as described above.

- Composition-one shell geometry (sidebar 220, collapsed 52, top bar 52, paper
  inset 12, paper radius 14): implemented in `ProductShell` with four new shell
  tokens under a design-session ruling of 2026-10-11 that the Owner can correct
  (M18; problem P1, storybook map DIFF-1 to DIFF-3). A correction would withdraw
  the four tokens and the new geometry.
- Night values of the suffix colours: the same ruling gave the TMS suffix #7aa0f5
  by night; 4.0.0 ships one value for both suffixes in both themes instead (TMS
  #2c63c8, Design System #6577f3; M9, M28), and the night TMS value is the open
  decision D7 listed below.
- Sizes of the shell theme and side-navigation toggles (36 and 38px): kept by
  default (M15); the 52px collapsed rail holds the 38px toggle.
- The `.tcrn-icon` base rule in the package, a design-session ruling open to Owner
  correction: M7.
- The four type declarations that keep a literal (inline numeral 16px, large
  numeral 44px on 48px, mono text 11.5px): new tokens or existing steps, M3; by
  default no token is added.
- Second-round items done as recommended and open to Owner correction: the
  read-only focus ring against the board's state order, the removed error-field
  wash and the shortcut in ink-2 against the board's ink-3 (M14); the
  "label — reason" title of disabled buttons (M12); the theme toggle icon by
  `data-current-theme` (M15).

Since the second batch (TCRN-DS-INIT-016), whose open items are listed in
`docs/dispatch/2026-10-13-tab-shell/owner-acceptance.md`:

- The composition-one geometry and the toggle sizes above no longer apply: the top
  band replaced composition one (TCRN-DS-MIN-20261013-SHELL D1; M20, M24).
- The night TMS suffix: 4.0.0 ships the approved single colour, #2c63c8 in both
  themes, which is below 4.5:1 by night; the design session suggests #7aa0f5 by
  night, for the Owner to rule on with the first batch's S-6 (D7; M28). A ruling for
  #7aa0f5 would move the variable back into the two theme blocks.
- An AOS shell has no brand button until AOS has a mark in the approved set (M20).
