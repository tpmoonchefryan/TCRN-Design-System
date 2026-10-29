# Migrating to TCRN Design System 4.0.0

This guide is for the three consumers of `@tcrn/ui-tokens`, `@tcrn/ui-copy-state`
and `@tcrn/ui-react`: TCRN AOS, TCRN TMS and the Einzbern portal. It covers the move
from 3.0.0, and from the unreleased `main` that followed it, to 4.0.0. 4.0.0 is one
release made of two batches: the G+ renewal (TCRN-DS-INIT-015, the first batch, M1
to M19) and the top-band shell (TCRN-DS-INIT-016, the second batch, M20 to M61). The
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
and so on, marked "r3" below). The second batch's items (M20 to M61) name a commit
on the INIT-016 integration branch, the Subtask key and the package handoff in
`docs/dispatch/2026-10-13-tab-shell/runs/r1/handoff/` (first round, handoffs named
P1a and so on, marked "INIT-016 r1" below), `runs/r2/handoff/` (second round,
handoffs named K1 and so on, marked "INIT-016 r2"), `runs/r3/handoff/` (third
round, handoffs named M1 and so on, marked "INIT-016 r3") or `runs/r4/handoff/`
(fourth round, handoffs named N1 and so on, marked "INIT-016 r4"), `runs/r5/handoff/`
(fifth round, handoffs named Q1 and so on, marked "INIT-016 r5"), or `runs/r6/handoff/`
(sixth round, handoffs named S1 and so on, marked "INIT-016 r6").

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
   38-name roster (M25); the Story's example is an `iconName="users"` value, which
   is a roster name from 4.0.0 (M7). Remove `strokeWidth` from `Icon` calls (M7).
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
16. If AOS renders `ProductShell`, mount `ShellIntro` only in the render that
    follows a successful in-app sign-in, let the paper scroll rather than the
    document, and give a shell embedded in a longer page a frame of fixed height
    (M29, M37); leave `previewStates` unset outside documentation and tests (M44).
17. Let people reorder their pins with `onPinsReorder`, or by spreading
    `productShellControlProps` (M32); pass `menuQuery` and `onMenuQueryChange` if
    AOS keeps the full menu's search text, and give a category a `description`
    where its name needs one (M33).
18. On a page with more than one shell, give each shell its own `landmarkLabel`
    and pass `menuShortcut={false}` to every shell but the page's own (M35, M39,
    M41); those shells still show the shortcut hint in their menu's search (M52).
    A shell placed in another page's paper passes `headingLevel: 2` in its
    `pageHeader` (M34), and a `TocRail` whose title sits directly under the page's
    h1 takes `headingLevel={2}` (M40).
19. Update tests and screenshots: select the page header's title and description
    by class (M34), update whole-markup snapshots (M36), re-baseline disabled
    navigation items and a focused paper, and read a menu row's icon box as 22
    (M45). Where a test finds a product mark by `data-logo`, it uses the mark's id
    (`ds`, `mana`, `tms`, `einzbern`) on the first line, a measured lockup, the
    brand button and the sign-in intro alike, and selects by product through
    `data-product-mark` or `data-product-id` (M42, M49).
20. Replace a read of `--tcrn-motion-product-shell-search` and delete overrides
    written against the two removed page-title rules (M38); a parse of
    `tokens.css` reads four blocks, and a local coarse-pointer override of the
    shell's row or search height goes (M31); style the focus of the brand button,
    the pins, the menu rows, the search results, the bell and the avatar through
    their own rules (M45).
21. Select the AOS visual instances as M48 says: the frontend shell slice's Work
    variant is `desktop-light-work`, the owner-quality collapsed variants are gone,
    and the fixtures carry `shellState` and the two renamed attributes. "expanded"
    in the frontend shell slice's remaining ids is a historical name, not the
    band's state, and the four copy fields the instances dropped were never read
    (M50).
22. When the deprecation notice runs over the AOS sources (step 2), it now also
    lists old names in a `build` directory under `src` (M51).
23. A script that reads the AI consumption contract moves to `fullMenu`,
    `topBandNavigation`, the new control order, the governed `pins` preference
    and the two new proof ids, and to the oracle's new names before 4.1 (M47).
    The part families (M30, M53), the shell's size tokens (M43) and the
    documentation site's changes (M46, M50) need nothing in AOS code.

24. Apply the sixth-round contract and shell updates where the consumer mirrors the
    package contract or shell behavior: the C8 toolbar exception is explicit in
    `roles.json` (M54), `markText` uses the settled capital-top measurement (M55),
    automatic shell presentation follows its own container at 1024 / 1023 and the
    automatic Sheet boundary at 760 / 761 (M57), long brand buttons grow without a
    title fallback (M58), cascade menus open toward the left when needed (M59), and
    coarse-pointer unpinned pins remain visible at rest (M60). The AOS sample uses
    Design System identity and does not invent an AOS mark; pin has its one solid
    fill exception (M61). The TMS suffix's light and night values are in M56.

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
9. Mount `ShellIntro` only in the render that follows a successful in-app sign-in,
   let the paper scroll rather than the document, and give a shell embedded in a
   longer page a frame of fixed height (M29, M37); leave `previewStates` unset
   outside documentation and tests (M44).
10. Pass `onPinsReorder`, or spread `productShellControlProps`, so the pins can be
    reordered (M32); pass `menuQuery` and `onMenuQueryChange` if TMS keeps the
    full menu's search text, and give a category a `description` where its name
    needs one (M33).
11. On a page with more than one shell, give each shell its own `landmarkLabel`
    and pass `menuShortcut={false}` to every shell but the page's own (M35, M39,
    M41); those shells still show the shortcut hint in their menu's search (M52).
    A shell placed in another page's paper passes `headingLevel: 2` in its
    `pageHeader` (M34), and a `TocRail` whose title sits directly under the page's
    h1 takes `headingLevel={2}` (M40).
12. Tests find the TMS mark by `data-logo="tms"` wherever it is drawn: the first
    line, a measured lockup, the brand button and the sign-in intro (M42, M49);
    they select by product through `data-product-mark` or `data-product-id`, read
    the page header's title and description by class (M34), and re-baseline after
    M36 and M45.
13. A parse of `tokens.css` reads four blocks, and a local coarse-pointer override
    of the shell's row or search height goes (M31); replace a read of
    `--tcrn-motion-product-shell-search` (M38).
14. A script that reads the AI consumption contract takes its new names (M47); the
    deprecation notice, run over TMS sources, now also lists old names in a
    `build` directory under `src` (M51). The part families (M30, M53), the shell's
    size tokens (M43) and the documentation site's changes (M46, M50) need nothing
    in TMS code.

15. Carry the sixth-round package changes into any consumer-side contract or shell
    proofs: C8 toolbar registration (M54), the settled `markText` measurement (M55),
    the TMS suffix at #2c63c8 in light and #7aa0f5 at night with no night exemptions
    (M56), automatic presentation thresholds from the shell container (M57), full
    brand wordmarks without `title` fallback (M58), left-opening cascades at the
    right edge (M59), and coarse-pointer pin visibility (M60). Preserve the one
    solid pin exception; do not invent an AOS mark (M61).

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
9. If the portal renders `ProductShell`, mount `ShellIntro` only in the render that
   follows a successful in-app sign-in, let the paper scroll rather than the
   document, give a shell embedded in a longer page a frame of fixed height (M29,
   M37) and leave `previewStates` unset outside documentation and tests (M44);
   pass `onPinsReorder` (or spread `productShellControlProps`), `menuQuery` and
   category `description`s as M32 and M33 say.
10. On a page with more than one shell, give each shell its own `landmarkLabel`
    and pass `menuShortcut={false}` to every shell but the page's own (M35, M39,
    M41); those shells still show the shortcut hint in their menu's search (M52).
    A shell placed in another page's paper passes `headingLevel: 2` in its
    `pageHeader` (M34), and a `TocRail` whose title sits directly under the page's
    h1 takes `headingLevel={2}` (M40).
11. Tests find the Einzbern mark by `data-logo="einzbern"` and the Mana Orchestrate
    mark by `data-logo="mana"` wherever they are drawn: the first line, a measured
    lockup, the brand button and the sign-in intro (M42, M49); they select by
    product through `data-product-mark` or `data-product-id`, read the page
    header's title and description by class (M34), and re-baseline after M36 and
    M45.
12. If the portal or a script of its own reads the AI consumption contract, take
    `fullMenu`, `topBandNavigation`, the new control order, the governed `pins`
    preference and the two new proof ids, and move to the oracle's new names
    before 4.1 (M47).
13. The documentation site the portal follows changed outside the packages: its
    shell is the hydrated `ProductShell` and `families.json` lists
    `scope.checkedBatches` (M46), and an expanded story's title has no left bar
    (M50); a script that drove the old documentation shell or read `scope.batch`
    moves to the hydrated shell or to `scope.checkedBatches`. Read part families
    from `families.json` and the toolbar registration from `roles.json` (M30, M53).
14. A parse of `tokens.css` reads four blocks, and a local coarse-pointer override
    of the shell's row or search height goes (M31); replace a read of
    `--tcrn-motion-product-shell-search` (M38); the shell's sizes are tokens and
    need no change (M43); the deprecation notice now also lists old names in a
    `build` directory under `src` (M51).

15. Update any consumer-side shell and contract proof for M54–M61: the C8 toolbar
    registration and settled `markText` method (M54–M55); TMS night suffix
    #7aa0f5 while light remains #2c63c8 and pending exemptions are removed (M56);
    automatic shell presentation from the shell's own width, explicit prop priority,
    growing brand buttons without truncation or `title`, left-opening cascade menus,
    and the coarse-pointer unpinned pin at rest (M57–M60). Keep the Icon pin's solid
    state as its single fill exception; the AOS example uses Design System identity
    and makes no new mark or API claim (M61).

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

### M30 · The navigation and shell families, part by part

Change: before the second batch, `docs/contract/families.json` listed 13 navigation
parts and 9 shell parts; 4.0.0 lists 10 and 11. Each part keeps its place, joins
`Tabs`, is deprecated (M23: its export stays through 4.0.x and leaves in 4.1) or is
new. The last column is the part's family in `families.json` today; a dash means the
part is no longer listed. `MobileNavToggle` is deprecated but still listed, so
navigation counts 10.

| Part | Family before | 4.0.0 | `families.json` now |
| --- | --- | --- | --- |
| `Breadcrumb` | navigation | Kept; `PageHeader` renders it as its first row (M22) | navigation |
| `Tabs` | navigation | Kept; the root of the one tab family (M22) | navigation |
| `SubNav` | navigation | Kept; the page's own second-level navigation (M23) | navigation |
| `SegmentedNav` | navigation | Joins `Tabs` as the `tcrn-tabs--segmented` variant; the export stays (M22) | — |
| `Pagination` | navigation | Kept | navigation |
| `NavGroup` | navigation | Kept; its rows render in the full menu and the drop-downs (M23) | navigation |
| `NavItem` | navigation | Kept; its rows render in the full menu and the drop-downs (M23) | navigation |
| `SideNav` | navigation | Deprecated (M23) | — |
| `SideNavCollapseButton` | navigation | Deprecated (M23) | — |
| `MobileNavToggle` | navigation | Deprecated (M23) | navigation |
| `SkipLink` | navigation | Kept | navigation |
| `TocRail` | navigation | Kept; page content in the paper (M23) | navigation |
| `TreeNav` | navigation | Kept; its rows take the menu row's grammar (M22) | navigation |
| `ProductShell` | shell | Kept; it is the top band (M20) | shell |
| `TopBar` | shell | Deprecated (M23) | — |
| `ProductShellSearch` | shell | Kept; the full menu's search (M20) | shell |
| `ShellThemeToggle` | shell | Kept; in the avatar menu (M20) | shell |
| `ShellLocaleMenu` | shell | Kept; in the avatar menu (M20) | shell |
| `ShellBrandLockup` | shell | Kept | shell |
| `ProductLauncher` | shell | Deprecated (M23) | — |
| `ProductSwitcher` | shell | Deprecated (M23) | — |
| `AppStatusBar` | shell | Kept | shell |
| `ShellBrandButton` | — | New (M29) | shell |
| `ShellPins` | — | New (M29) | shell |
| `ShellMenu` | — | New (M29) | shell |
| `ShellDropdown` | — | New (M29) | shell |
| `ShellIntro` | — | New (M29) | shell |

The blocks follow: navigation lists 9 (`tcrn-shell-side-nav-toggle` and
`tcrn-shell-mobile-nav-toggle` left), and shell lists 14 (`tcrn-top-bar` left and
`tcrn-shell-strip` arrived). The three first-batch exemptions of the navigation, shell
and layout families are deleted, so all three families are checked in full by
`pnpm contract:static`, and `roles.json` lists no toolbar, `tcrn-shell-strip` as the
shell's bar and three shell controls (theme toggle, language menu, search).

Do: read the family lists from `families.json`, not from 3.0.0's documentation;
replace the deprecated parts as M23 says.

Source: 601b6c9 (TCRN-DS-SUB-125), 3eaad07 (TCRN-DS-SUB-155); handoffs P8
(INIT-016 r1) and K4 (INIT-016 r2: the second round's handoffs, named K1 and so on,
are in `docs/dispatch/2026-10-13-tab-shell/runs/r2/handoff/`).

### M31 · Shell sizes in tokens; a coarse-pointer token block

Change: three theme-independent tokens are new: `--tcrn-shell-mark` (22px, the mark
in the brand button), `--tcrn-shell-touch` (44px: the menu rows and the full menu's
search under a coarse pointer, and the Sheet's rows, search and pin hit areas) and
`--tcrn-shell-crumb-icon` (11px, the breadcrumb separator icon, which `Breadcrumb`
now reads from the token). `tokens.css` and `tcrnTokenCss` hold four blocks instead
of three: the third is `:root` inside `@media (pointer: coarse)`, which points
`--tcrn-shell-row-h` and `--tcrn-shell-srch-h` at `var(--tcrn-shell-touch)`; the
component sheet no longer declares a coarse-pointer `:root`. New exports:
`tcrnCoarsePointerMedia` (`"(pointer: coarse)"`), `tcrnCoarsePointerTokens` and
`tcrnTokenBlockKinds.coarse` (`"pointer-coarse"`); `TokenCssBlock` has a new field,
`media` (null for the top-level blocks).

Do: a parse of `tokens.css` that expects three blocks expects four, and reads the
coarse-pointer block through `parseTokenCssBlocks` and its `media`; drop a local
coarse-pointer override of the shell's row or search height.

Source: eb5e0da (TCRN-DS-SUB-142), 56f1f6c (TCRN-DS-SUB-156); handoffs K4 and K6b
(INIT-016 r2).

### M32 · The pinned items can be reordered

Change: `ShellPins` takes `onPinsReorder(orderedIds)` (none by default; without it the
pins do not move), and `ProductShell` takes the same prop and hands back the whole
pin order. `useProductShellController` returns `reorderPins`, and
`productShellControlProps` carries `onPinsReorder`, wired to `movePin`, which writes
the order back to the pin preference (the local fallback and `onPinsChange`, not the
cookie). When the pins can move, each carries
`aria-keyshortcuts="Alt+ArrowLeft Alt+ArrowRight"` and `data-pin-movable`, and the
one being dragged carries `data-pin-dragging`; a pointer drag swaps pins in place, and
Alt+← and Alt+→ move the focused pin.

Do: pass `onPinsReorder`, or spread `productShellControlProps`, to let people reorder
their pins.

Source: b9afc43 (TCRN-DS-SUB-149); handoff K6 (INIT-016 r2).

### M33 · The full menu's query and its category descriptions

Change: `ShellMenu` takes `query` (the search text, controlled; by default the menu
holds it), `defaultQuery` (the starting text when the menu holds it; empty by
default) and `onQueryChange(query)` (called on input, and with an empty string when
the menu closes). `ProductShell` takes `menuQuery`, `defaultMenuQuery` and
`onMenuQueryChange`; `onSearchQueryChange` is unchanged. The menu model's
`ShellMenuGroup` and `ShellMenuItem` take an optional `description` (none by
default): with one, the category title row or the item row carries
`aria-describedby` pointing at a `.tcrn-sr-only` element that holds the
description, and nothing is drawn. `NavGroup` takes the same prop.
`ProductShellNavGroup.description`, which was the product's own metadata and was not
rendered, is now rendered by the shell as that screen-reader description.

Do: pass `menuQuery` and `onMenuQueryChange` when the product keeps the menu's search
text (to restore it, or to drive its own results); give a category a `description`
when its name needs one; check that existing `ProductShellNavGroup.description`
texts read well aloud.

Source: 2d99f72 (TCRN-DS-SUB-147); handoff K6 (INIT-016 r2).

### M34 · The paper's page title is the page's h1; the page header's markup

Change: `PageHeader` takes `headingLevel?: 1 | 2` (2 by default), and both levels use
the level-2 type with the same class. In the `ProductShell` paper the page header is
level 1, the page's h1, unless `pageHeader.headingLevel` is 2. The page header's
markup changes: the class `tcrn-page-header__title` moves from the div that wrapped
the title and the description to the title element itself (`h2`, or `h1` in the
paper), which carries a `title`; the description is a `p.tcrn-text` with
`tcrn-page-header__description`; the two sit in a new `div.tcrn-page-header__lead`,
and `.tcrn-page-header__title` is a one-line truncation rule. The title row's gap is
14 (was 12) and its rule is line-2 (was border-subtle). No other prop is new and the
defaults are unchanged.

Do: a shell placed in another page's paper (an embedded example) passes
`headingLevel: 2`; select the title as `.tcrn-page-header__title` and the description
as `.tcrn-page-header__description` instead of `.tcrn-page-header__title h1`, `h2` or
`.tcrn-text`, and do not style `.tcrn-page-header__title` as a container.

Source: 397b0b0 (TCRN-DS-SUB-163), 0a05831 (TCRN-DS-SUB-162), 56f1f6c
(TCRN-DS-SUB-156); handoffs K6, K1 and K6b (INIT-016 r2).

### M35 · Landmark names per shell instance

Change: `ProductShell` takes `landmarkLabel?: string` (none by default), the prefix of
the accessible names of the pinned items' nav and the page header's breadcrumb nav:
"{landmarkLabel} · {name}", in the five locales through `landmarkOf` of the shell
copy. Without it the two names are unchanged. `ShellPins` and `PageHeader` take the
same prop; an explicit `aria-label` on `ShellPins` wins, and `PageHeader`'s own
`landmarkLabel` wins over the one the shell passes down.

Do: when a page holds more than one shell (examples, comparisons), give each a
different `landmarkLabel`.

Source: 450dabf (TCRN-DS-SUB-148); handoff K6 (INIT-016 r2).

### M36 · Second-round details of the shell, its rows and the lockups

Change:

- `NavItem`: its text carrier `.tcrn-nav-item__label` carries `data-text="prail"`,
  and a `NavItem` with `iconName` gives its icon `data-guide="prail"` (measurement
  hooks); `data-shell-group` and `data-shell-col` given to `NavGroup` sit on the
  group's root, the column of its title row. A pinnable row's label carries a
  `title`, and a `NavGroup` title that cannot be pinned is wrapped in
  `span.tcrn-nav-group__label-text[title]`.
- `ProductShellSearch`: result links carry a `title` ("title — description", or the
  title alone); with the search expanded and no results, the list is no longer
  hidden and the empty text shows; the old top bar's sizes (260 at rest, 420
  expanded, `margin-left: auto`) are deleted, since the search is the full menu's.
- `ProductShell`: the root's `data-state` has a new value, `sheet`, while the menu is
  shown as a Sheet; the paper's content region carries `tabindex="0"`; the new
  `previewStates?: Readonly<Record<string, string>>` (not passed by default) writes
  static documentation states as `data-tcrn-preview-state` by menu row or group id
  and passes them to the full menu and each drop-down.
- `ShellDropdown`: `previewStates` accepts `"open"`: a row with a next level marked
  `"open"` starts with that level open, level by level from the drop-down's own rows
  (space-separated values match as CSS `~=` does); other values only write the
  attribute. The drop-down is placed from the padding box of an ancestor that holds
  fixed layers (transform, perspective, filter, backdrop-filter, layout or paint
  containment, a container), or from the viewport when there is none, and re-reads
  the pinned item's position after each render and, with ResizeObserver, when the
  band changes size. `useShellMenuCascade(rootRef, firstLevel, initialOpenPath = [])`
  takes an optional third argument, the starting open path. In a cascade, ArrowLeft
  from a column back to the row that opened it prefers the rendered row.
- `ProductLogo`, the whole `ProductLockup` block and a `ShellBrandLockup` with a
  `productId`: line one is a `b` (was a span), the suffix an `em` (was a span, now
  after a space) and the tagline a `small` (was a span). The class names are
  unchanged and the default styles are reset, so nothing looks different. Rendered
  with `data-lockup` (a measured lockup), the colour mark carries
  `data-logo={productId}`. `.tcrn-shell-brand-lockup[data-lockup="lkr"]` takes the
  side-rail tier (mark 22, 12.5 at 600, 10.5, 10 between the columns, no byline)
  wherever it is, not only inside `ProductShell`. A `ProductLockup` first line's
  wordmark `b` carries a `title` (the product's full name), takes its content width,
  may overhang by 1 at most and is truncated beyond that.
- Removed rules: `.tcrn-product-shell__sidebar .tcrn-brand-wordmark__suffix--aos`
  and the two text-hiding rules under `[data-product-shell-collapsed="true"]`.
- The bell's hover is the 6% ink wash (was 3.5%).
- The shell's fallback focus rule is `.tcrn-product-shell :where(:focus-visible):not(…)`
  (was `.tcrn-product-shell :focus-visible:not(…)`), reads the new pair
  `--tcrn-pair-shell-edge-f` (`var(--tcrn-focus-ring)`, declared with the theme) and
  moves from the front of the component segment to the end of the shell segment. It
  looks the same.

Do: update snapshot tests that compare whole markup (the row hooks and titles, the
`b`, `em` and `small` of the lockups); keep selecting a lockup's parts by class; an
override of the fallback focus rule written at (0,3,0) can be (0,2,0) or more if it
comes later in the sheet.

Source: 212b88f (TCRN-DS-SUB-152), 52780e6 (TCRN-DS-SUB-154), 61cf706
(TCRN-DS-SUB-145), 2d1535e (TCRN-DS-SUB-159), f709e9a (TCRN-DS-SUB-146), fd14855
(TCRN-DS-SUB-151), 9d081aa (TCRN-DS-SUB-143), c1e4a0a and 5987d66
(TCRN-DS-SUB-144), 56f1f6c (TCRN-DS-SUB-156); handoffs K1, K5, K6 and K6b
(INIT-016 r2).

### M37 · When the intro plays, how high the shell is, and embedded shells

Change: nothing new in the package; this states how M20, M27 and M29 are meant to
be used. `ShellIntro` is mounted only when a sign-in inside the application has just
succeeded: not on a reload, a route change or a deep link into a signed-in session.
The shell's root is one screen high (`block-size: 100dvh`): the band stays where it
is and the page scrolls inside the paper, whose content region is the scrolling,
focusable region (M36). So a long page that embeds a shell below other content, such
as a documentation example or a comparison, puts the shell in a frame of fixed
height; otherwise the shell takes a whole screen in the middle of the page.

Do: mount `ShellIntro` in the render that follows a successful in-app sign-in (M29),
and nowhere else; let the paper scroll, not the document; to embed a shell, give it
a frame with a fixed block size and set the shell's own `style` to
`{ blockSize: "100%" }` so it fills the frame (the documentation's embedded shells
use a 640px frame).

Source: 2c09e64 (TCRN-DS-SUB-160), f709e9a (TCRN-DS-SUB-146); handoffs K5 and K1
(INIT-016 r2).

### M38 · Two dead names are removed: a search motion variable and two page-title rules

Change: `tcrnComponentCss` no longer declares `--tcrn-motion-product-shell-search` on
`:root`. It was the old top bar search's transition (`240ms
var(--tcrn-motion-ease-drawer)`), and no package rule reads it now that the search is
the full menu's (M20, M36). The rules `.tcrn-page-header__title .tcrn-heading`
and `.tcrn-page-header__title .tcrn-text` (margin 0, the style segment
`typographyCss03`) are deleted: since M34 the class sits on the title element itself,
so they matched nothing. Neither name has an alias.

Do: replace a read of `--tcrn-motion-product-shell-search` with
`--tcrn-motion-product-shell` (`var(--tcrn-motion-emphasis)`, 240ms on the standard
ease) or with a value of your own if you want the drawer ease; delete overrides
written against the two descendant selectors.

Source: 9b99bcd and 5187169 (TCRN-DS-SUB-183); handoff M3 (INIT-016 r3).

### M39 · `landmarkLabel` names every landmark of a shell; `TocRail` is named by its title

Change: `ProductShell`'s `landmarkLabel` (M35; none by default) now prefixes the name
of every named landmark the shell renders, as "{landmarkLabel} · {name}": the band's
header, the pinned items' nav, the full menu (panel or Sheet) and its bottom bar's
current position, each drop-down, the avatar menu and its product switcher, the
content region (only without `contentLabel`, which is used as given) and the page
header's breadcrumb nav. Without `landmarkLabel` every name is unchanged. `ShellMenu`
and `ShellDropdown` take the same optional prop for use on their own. `TocRail`'s nav
takes the rail's title as its accessible name.

Do: give each shell on a page its own `landmarkLabel`, as M35 says; a test that finds
a shell's header, menu, bottom bar, drop-down or avatar menu by name expects the
prefix on a shell that has one; give a standalone `ShellMenu` or `ShellDropdown` a
`landmarkLabel` when two share a page.

Source: 97c9206 (TCRN-DS-SUB-184); handoff M4 (INIT-016 r3).

### M40 · `TocRail`'s title can be an h2

Change: `TocRail` takes `headingLevel?: 2 | 3` (3 by default). Only the title's
element changes; its type and the nav's name stay the same.

Do: pass `headingLevel={2}` where the rail's title sits directly under the page's h1,
as the documentation pages do (M46); without it nothing changes.

Source: 706e689 (TCRN-DS-SUB-193); handoff M4 (INIT-016 r3).

### M41 · One shell per page takes ⌘K: `menuShortcut`

Change: `ProductShell` takes `menuShortcut?: boolean` (true by default) and passes it
as is to `ShellMenu`'s `shortcut`; a shell with it false registers no ⌘K or Ctrl+K
listener. Before, every shell's full menu registered the shortcut, so on a page with
several shells one press opened every shell that did not control its menu, and focus
landed in the last one registered.

Do: on a page that holds more than one shell (examples, comparisons), keep
`menuShortcut` on for the page's own shell only and pass `menuShortcut={false}` to the
others; a page with one shell changes nothing.

Source: e430a8a (TCRN-DS-SUB-185), d7b5643 (TCRN-DS-SUB-179); handoffs M4 and M7
(INIT-016 r3).

### M42 · A measured lockup's `data-logo` is the mark's id

Change: the colour mark of `ProductLockup`'s first line (M26) and of a `ProductLogo`
the shell measures (one given a `data-lockup` hook, such as the full menu's bottom
bar lockup) carries the mark's own id in `data-logo`, the name of its file in the
approved mark set: `ds`, `mana`, `tms` or `einzbern`. It was the product key
(`design-system`, `mana-orchestrate` and so on; M36), which stays in
`data-product-id`. The brand button's mark and the sign-in intro's mark still carry
the product key in `data-logo`.

Do: a test or measurement that finds a measured lockup's mark by `data-logo` uses the
mark id; to select by product, read `data-product-id`.

Source: d46d6d5 (TCRN-DS-SUB-194); handoff M4 (INIT-016 r3).

### M43 · Three more shell tokens; the shell's icons take `Icon`'s sizes

Change: three theme-independent tokens join the shell group (M24, M31):
`--tcrn-shell-chevron` (12px: the menu row's next-level arrow, the bottom bar's
position separator and the pinned item's drop-down arrow),
`--tcrn-shell-locale-chevron` (11px: the arrow of the avatar menu's language entry;
the same value as `--tcrn-shell-crumb-icon`, with another meaning) and
`--tcrn-shell-mark-lg` (44px: the mark of the first line's lockup tier,
`firstLine="lockup"`; the rail tier's mark is `--tcrn-shell-mark`, 22px). The shell
parts read them instead of literals. The bell, the no-account avatar icon and the
brand button's disclosure take `Icon`'s `lg`, `sm` and `md` sizes (20, 14 and 16px,
as before). Nothing renders at a different size.

Do: nothing is required; an override of one of these sizes can set the token instead
of a length.

Source: 28d13ad (TCRN-DS-SUB-178); handoff M4 (INIT-016 r3).

### M44 · `previewStates` is for documentation and tests only

Change: nothing in the package; this states what M36's `previewStates` is for.
`ProductShell` writes it as `data-tcrn-preview-state` on menu rows and groups and
passes it to the full menu and each drop-down, and `ShellDropdown` reads `"open"` as
a next level open from the start. It exists so that documentation pages and tests can
show a state (hover, focus, an open level) without a pointer.

Do: leave `previewStates` unset in a product; pass it only in documentation and in
tests.

Source: fd14855 (TCRN-DS-SUB-151); handoff K5 (INIT-016 r2), as the second round's
acceptance and judgment asked (item R3-29).

### M45 · Third-round details: row labels, the paper's focus ring, the menu's icon boxes

Change:

- `NavItem`: the label (`.tcrn-nav-item__label`) is one line wherever the row is
  (block, `white-space: nowrap`, ellipsis, `overflow: hidden`, `min-width: 0`) and
  carries a `title` whenever it has text: the label's own words or the text in its
  markup, or, with no text, the row's `title`. A disabled item's reason therefore
  shows on its own line under the label.
- `ProductShell`: the focus ring of the paper's scrolling region is drawn inward, as
  inset shadows from the paper's edge: a `--tcrn-space-0h` gap in the surface colour,
  then the accent ring out to `--tcrn-space-1`; in forced colours a transparent
  outline at an offset of −2px. The shell's fallback focus rule (M36) no longer
  overrides the focus pairs of the brand button, the pinned items, the menu rows, the
  search results, the bell and the avatar; the avatar keeps a 1px inner line under
  its ring.
- The icon box of the full menu's and the Sheet's rows is 22 × 22 with a 3px padding
  and `box-sizing: border-box`; the glyph is still 16px, in the same place.

Do: re-baseline screenshots of disabled navigation items and of a focused paper; a
test that measures a menu row's icon by its box reads 22, not 16; style the focus of
those six shell parts through their own rules, since the fallback rule no longer
reaches them.

Source: 842c764 (TCRN-DS-SUB-192), 5c6695f (TCRN-DS-SUB-182), 47f3e77
(TCRN-DS-SUB-188); handoff M3 (INIT-016 r3).

### M46 · Third-round changes outside the packages

Change: nothing that a consumer imports.

- The documentation site's shell is the package's `ProductShell`, hydrated on every
  page: at 760px and narrower its menu opens as a Sheet, and its search, theme and
  language are the package's own. Only the documentation shell registers ⌘K (M41);
  a gate hands ⌘K to one example shell with the page parameter
  `shell-shortcut=<screen id>`. The documentation pages title their contents rail as
  an h2 under the page's h1 (M40). The pages no longer carry the old documentation
  shell's static markup and scripts (its hidden language select, its static search
  and their hooks).
- `docs/contract/families.json`: `scope.batch` is replaced by `scope.checkedBatches`,
  the batches the contract static gate checks in full, now `[1, 2]`.

Do: nothing in a consumer. A script of your own that drove the documentation site's
old shell through its static hooks, or read `scope.batch`, moves to the hydrated
shell or to `scope.checkedBatches`.

Source: 50d0a7c (TCRN-DS-SUB-201), d7b5643 (TCRN-DS-SUB-179), 39cb579
(TCRN-DS-SUB-202), eb41539 (TCRN-DS-SUB-189); handoffs M7 and M2 (INIT-016 r3).

### M47 · The AI consumption contract describes the top-band shell

Change: the AI consumption contract (`ai-consumption-contract.json`, written by the
documentation build) describes the top-band shell instead of the side rail.

- The documentation shell's oracle (`shellMetrics`) has new names:
  `residentNavWidthPx` (0), `residentNavMinWidthPx` (0),
  `residentNavPreferredViewportRatio` (0), `residentNavMaxWidthPx` (0),
  `residentNavTolerancePx` (2), `bandHeightPx` (52) and `bandHeightTolerancePx` (2).
  The old `desktopSidebar*` and `desktopTopbar*` names stay for one version with the
  same values and are removed in 4.1. The metric evidence reads `residentNavWidthPx`
  and `bandHeightPx`, and the control table labels those rows "Resident navigation
  width" and "Band height".
- `visualFitControlContract.fullMenu` replaces `sidebar`;
  `productShellHardeningRules.topBandNavigation` replaces `sideNavigation`.
- `shellControlVisualParityProof.controlOrder` is `["brandButton", "pins",
  "cluster"]`. Its measured controls drop the side navigation toggle and the top bar
  and add the brand button, the pins, the avatar, the band and the paper; its motion
  fields drop the sampled width timeline, and its state coverage lists the top band's
  states. `searchMotionTimeline` (the width transition) and the two collapse policies,
  `ownerQualitySideNavCollapsePolicy` and `ownerQualitySideNavPolicy`, are removed,
  and the contract no longer reads `--tcrn-shell-sidebar-width-collapsed`.
- `preferenceTransport.governedPreferences` is `["locale", "theme", "pins"]`.
- The two required proof ids are `prove_top_band_full_menu_and_pins` (was
  `prove_side_navigation_collapse_state`) and `top_band_navigation_receipt` (was
  `side_navigation_collapse_receipt`).
- The deprecated parts are described as "deprecated, see M23"; `visualSkin` and
  `themeTransition` describe the band and the paper.

Do: a consumer or a script that reads the contract takes `fullMenu`,
`topBandNavigation`, the new control order, `governedPreferences` with `pins` and the
two new proof ids, and moves to the oracle's new names before 4.1.

Source: 9e0f3ad, dcd524d (TCRN-DS-SUB-208); handoff M9 (INIT-016 r3).

### M48 · The AOS visual instances: three variants retired, one renamed

Change:

- The owner-quality product shell instance retires its three collapsed variants,
  which repeated other variants exactly: nine variants become six.
- The frontend shell slice's `desktop-light-collapsed-work` is renamed
  `desktop-light-work` (the band closed on the Work route; the desktop Work coverage
  stays).
- The fixtures carry `shellState` (`closed`, or `expanded` for the search-results
  fixtures) instead of `collapsed`. The attribute `data-visual-instance-collapsed`
  becomes `data-visual-instance-shell-state`, and
  `data-visual-instance-mobile-collapse-policy` becomes
  `data-visual-instance-mobile-menu="sheet"`. The persistent routes drop
  `collapsed=false`. Variant ids that contain "expanded" keep their ids, since
  consumers select variants by id; only their labels change.

Do: select the frontend shell slice's Work variant as `desktop-light-work`, drop the
owner-quality collapsed variants, and read `shellState` and the two renamed
attributes.

Source: 9e0f3ad (TCRN-DS-SUB-208); handoff M9 (INIT-016 r3).

### M49 · The brand button's and the sign-in intro's `data-logo` is the mark's id

Change: the mark in `ShellBrandButton` and the flying mark of `ShellIntro` carry the
mark's own id in `data-logo`, as the first line and a measured lockup have since M42:
`ds`, `mana`, `tms` or `einzbern`, the name of its file in the approved mark set.
They carried the product key (`design-system`, `mana-orchestrate` and so on). The
product key stays in `data-product-mark`, which `TcrnBrandMark` writes on the mark,
and the SVG is still drawn from it. So `data-logo` holds one value per product
wherever a colour mark is drawn. M42's last sentence, that the brand button's and
the intro's marks still carry the product key, no longer holds; M42 keeps its
wording. No prop is new and no default changes.

Do: a test or measurement that finds the brand button's or the intro's mark by
`data-logo` uses the mark's id; to select by product, read `data-product-mark` on
the mark, or `data-product-id` where the element carries one, as a measured lockup
does (M42).

Source: 855b3a4 (TCRN-DS-SUB-212), 311704d (TCRN-DS-SUB-214); handoff N1
(INIT-016 r4).

### M50 · Fourth-round changes outside the packages

Change: nothing that a consumer imports; the packages' public API is unchanged.

- On the documentation pages, an expanded story's title no longer draws the 3px
  accent bar at its left edge (an inset shadow) or the left padding that came with
  it. The chevron's turn alone shows that the story is expanded, and the title's
  left edge stays where it is when the story opens.
- The documentation layer deletes six classes that nothing wrote:
  `.tcrn-doc-eyebrow`, `.tcrn-doc-claim`, `.tcrn-doc-brand` with its two placement
  rules, `.tcrn-doc-search-results`, `.tcrn-doc-search-result` and
  `.tcrn-doc-search-empty`. The shell fidelity gate's whitelist of repeated
  selectors goes from 14 entries to 7.
- The two AOS visual instances, the frontend shell slice and the owner-quality
  product shell, drop four copy fields that nothing read: `currentLocation`,
  `searchLabel`, `searchResultsLabel` and `emptyLabel`. Their story ids and what
  they render are unchanged.
- "expanded" in the frontend shell slice's ids
  `desktop-light-expanded-cockpit-search-results`,
  `desktop-light-expanded-cockpit-search-rest` and `desktop-dark-expanded-cockpit`
  is a historical name: it named the old shell's expanded side rail. The ids stay,
  since consumers select variants by id (M48). The band's state is the fixture's
  `shellState`: `expanded` only for the search-results fixture, which holds the full
  menu open, and `closed` for the other two.

Do: nothing in a consumer. A style or script of your own that targeted the six
documentation classes, the expanded title's left bar or the four copy fields has
nothing left to match; select AOS variants by id, and read the band's state from
`shellState`, not from the id.

Source: 791f40f (TCRN-DS-SUB-218), ac07f65 (TCRN-DS-SUB-219), 59d8479
(TCRN-DS-SUB-220); handoff N3 (INIT-016 r4); the note on "expanded" as the third
round's judgment asked (section 3.4, item 7).

### M51 · The deprecation notice reads a `build` directory under `src`

Change: `scripts/token-deprecation-notice.mjs` (M2) skips only build output.
`node_modules`, `.git`, `dist`, `coverage`, `storybook-static`,
`storybook-preview-static`, `.next` and `.turbo` are skipped wherever they are, as
before. A directory named `build` is judged by its path as the notice prints it
(relative to the parent of the path given, `/`-separated): with no `src` segment
above it, it is build output and is skipped; under `src`, it is source and is read.
Before, every `build` directory was skipped, so old names in a source directory such
as `src/build` went unlisted. The script's export `SKIPPED_DIRECTORIES` no longer
holds `build`; `BUILD_OUTPUT_DIRECTORY` (`"build"`) and
`isSkippedDirectory(relativePath)` are new exports.

Do: run the notice over your sources again (M2, step 1); new lines from a `build`
directory under `src` are old names to replace. A script of your own that imported
`SKIPPED_DIRECTORIES` to make the same decision calls `isSkippedDirectory` instead.

Source: 3921903 (TCRN-DS-SUB-222); handoff N3 (INIT-016 r4).

### M52 · A shell without ⌘K still shows the shortcut hint

Change: nothing in the package; this states what M41 leaves as it is.
`menuShortcut={false}` only keeps a shell from registering ⌘K or Ctrl+K. The
shell's full menu still shows the shortcut hint in its search field, as the board
draws it, whether or not that shell takes the key. `packages/ui-react/README.md`
says the same under Storybook Shell Control Boundary.

Do: nothing. On a page with several shells, only the shell that keeps
`menuShortcut` on answers ⌘K (M41), although each full menu shows the hint; a test
that expects the hint to go with `menuShortcut={false}` expects it to stay.

Source: e430a8a (TCRN-DS-SUB-185); handoff M4 (INIT-016 r3), as the third round's
judgment asked (section 3.4, item 4).

### M53 · Nine more root classes in the families, and the top band as a toolbar

Change: nothing that a consumer imports; the contract's two registries moved on
after M30 was written. Read in the fifth round, `docs/contract/families.json` lists
11 blocks for navigation, 19 for shell and 16 for inputs. Nine of them are root
classes this batch added, which f29fb30 (TCRN-DS-SUB-215) registered in their
families: navigation 2 (`tcrn-nav-item-row`, `tcrn-nav-pin`), shell 5
(`tcrn-shell-cluster`, `tcrn-shell-account`, `tcrn-shell-avatar`, `tcrn-shell-bell`,
`tcrn-shell-sheet`) and inputs 2 (`tcrn-select-wrap`, `tcrn-date-picker-wrap`). The
families' `components` lists did not change. Since f26c633 (TCRN-DS-SUB-191), the
`toolbars` list of `docs/contract/roles.json` registers the top band as a C8
toolbar: container `tcrn-shell-strip`, yielding item `tcrn-shell-pins`, fixed items
`tcrn-shell-brand` and `tcrn-shell-cluster`. The C8 judgment of the top band is
open for the Owner to rule on (O-19 in
`docs/dispatch/2026-10-13-tab-shell/owner-acceptance.md`); until it is ruled on,
the registration stays and `pnpm contract:static` reports 15 C8 findings on the
top band (the reading at the close of the fourth round). So three statements in
M30's last paragraph no longer hold: "navigation lists 9", "shell lists 14" and
"`roles.json` lists no toolbar". M30 keeps its wording, and its part-by-part table
still holds.

Do: as M30 says, read the family lists from `families.json`, and the toolbar
registration from `roles.json`, not from M30 or from the numbers above. Nothing
changes in a consumer's code.

Source: f29fb30 (TCRN-DS-SUB-215), f26c633 (TCRN-DS-SUB-191); handoffs N2
(INIT-016 r4) and M2 (INIT-016 r3), as the fourth round's judgment asked
(section 2, item R5-2).

### M54 · C8 toolbar exception is explicit in the contract

Change: the top-band toolbar entry carries the board rule and the zero minimum-width / optional-yield fields. C8 static and story checks skip only those two checks for that registered toolbar; all other C8 checks remain active.

Do: consumers that read `roles.json` or mirror the contract proof should read the explicit toolbar fields rather than infer an exception from the component name.

Source: TCRN-DS-SUB-229, commit `31b7649`, S1 handoff.

### M55 · Measure markText from the capital top to its baseline

Change: the settled one-line measurement runs from the first line's capital top to its baseline; a two-line lockup runs from the first line's capital top to the second line's baseline. The tolerance stays ±1. SUB-231 recorded that the four product first lines measured within 1 and required no code change.

Do: keep consumer measurement and visual proof aligned with this method; do not use the prior glyph-ink midpoint or first-line-only method for two-line lockups.

Source: TCRN-DS-SUB-230, commit `b7eea0b`, and TCRN-DS-SUB-231, commit `e0c7fec`; S2 handoff and `TCRN-DS-MIN-20261016-R6-MARKTEXT`.

### M56 · TMS suffix uses the approved night value

Change: the light TMS suffix remains #2c63c8; night uses #7aa0f5 from the TMS mark's bright palette value. The two night pending exemptions are withdrawn.

Do: update consumer theme snapshots and contrast expectations to the light/night split.

Source: TCRN-DS-SUB-232, commit `fb24cf6`; S2 handoff, R6 D4, and S7 board regeneration.

### M57 · Automatic shell behavior follows its own container

Change: `ProductShell` automatic version and presentation respond to the shell's own container width; 1024 selects the wide presentation with fixed items on the band, while 1023 selects the narrow presentation with fixed items in the menu. Automatic Sheet presentation begins at 760; at 761 it is not Sheet. Explicit `version` and `presentation` props retain priority.

Do: keep a shell embedded in a page responsive to its own width rather than the viewport. Consumers need no new prop.

Source: TCRN-DS-SUB-234, candidate commit `13bbe29`; S4 handoff (partial package status and its outstanding problems are recorded in `runs/r6/problems/S4.md`).

### M58 · Long brand buttons grow to fit the full wordmark

Change: the brand button width is a minimum of 134px and grows to fit the full wordmark. It does not truncate the wordmark or add a title fallback.

Do: allow the button to grow for long product names and remove truncation or title-based expectations.

Source: TCRN-DS-SUB-238, commit `d4da5b7da5998f42879807d572d5715fa30bae96`; S7 handoff.

### M59 · Cascades open left when the right edge requires it

Change: a cascading menu opens to the left of its first column when opening right would exceed the viewport; when neither side fits, it chooses the side with less overflow. The root exposes `data-cascade-side`.

Do: keep both-direction behavior in consumer integration checks and do not assume cascades always open right.

Source: TCRN-DS-SUB-233, commit `ced3777`; S3 handoff.

### M60 · Show an unpinned pin at rest under a coarse pointer

Change: under a coarse pointer, an unpinned pin remains visible at rest in `ink-3`; fine-pointer behavior is unchanged.

Do: include the coarse-pointer state in consumer visual checks; do not expect focus to be required to discover the pin.

Source: TCRN-DS-SUB-235, commit `19d10f5`; S5 handoff.

### M61 · Keep the pin exception and do not invent an AOS mark

Change: the pinned Icon state is the sole fill exception and is shown as a solid pin. The AOS examples keep their page content and use Design System identity in the shell contract example; no AOS mark, fallback API, token, export, or locale key is added.

Do: preserve the one solid pin state. Keep AOS examples free of an invented AOS mark and treat the existing required brand identity as-is.

Source: TCRN-DS-SUB-237, commit `725fe0d`, S6 handoff; TCRN-DS-SUB-240, commit `c9c7f0c7af00ac9f6908c8c84971e1eaeb2f2788`, S7 handoff.

## Sources added after M53

M54–M61 draw only on the named INIT-016 R6 S1–S7 package handoffs and the R6 decision excerpts. The automatic-container package (SUB-234) is partial; its known gates, landmark and height debt remain in `runs/r6/problems/S4.md`. This section does not claim visual acceptance, publication, or consumer adoption.

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

These first-batch items remain open or correctable; the R6 resolutions below have
been removed from this pending list.

- The package `.tcrn-icon` base rule (M7) remains open to Owner correction.
- Literal type declarations (M3): inline numeral 16px, large numeral 44px on 48px,
  and mono text 11.5px; default remains no added token.
- The six-size product-mark ladder and background patches are not in the first-batch
  story (DIFF-8); the Owner may still decide whether to add them.
- Text paragraph margin (M10): generated segment has zero margin and the family rule
  restores its existing top margin; no new ruling is recorded here.
- Second-round first-batch defaults remain open to correction: read-only focus ring,
  the removed error-field wash, shortcut ink-2, disabled-button reason title, and
  theme-toggle icon selected by `data-current-theme`.

### R6 decisions already applied

- O-19: C8's board-ruled toolbar exception is explicit in `roles.json` and scoped to
  the two named checks; TCRN-DS-SUB-229 / M54, R6 D1.
- O-4: `markText` is measured from capital top to baseline for one line and to the
  second-line baseline for two lines, at ±1; TCRN-DS-MIN-20261016-R6-MARKTEXT and
  TCRN-DS-SUB-230/231 / M55.
- O-8: light TMS suffix #2c63c8 and night #7aa0f5, with night pending exemptions
  withdrawn; R6 D4 and TCRN-DS-SUB-232 / M56.
- O-11: automatic presentation follows the shell container, with explicit props
  taking priority; R6 D4 and TCRN-DS-SUB-234 / M57.
- O-1: brand button has a 134px minimum and grows to show the full wordmark without
  truncation or `title`; R6 D5 and TCRN-DS-SUB-238 / M58.
- O-3: cascade opens left when the right edge requires it; R6 D5 and
  TCRN-DS-SUB-233 / M59.
- O-6: coarse-pointer unpinned pins remain visible at rest in `ink-3`; R6 D5 and
  TCRN-DS-SUB-235 / M60.
- O-5: the solid pin is the single fill exception; O-9: the AOS example uses Design
  System identity and invents no AOS mark or API; R6 D6 and TCRN-DS-SUB-237/240 / M61.
- O-18: the `test-dom` gate is included by `MIN-20261016-GATES D1`.
- O-2, O-14 and O-20: R6 D4 records the approved story-text and implementation
  disposition; coordinator-owned chain updates are outside this package.

The D8 visual holds and the Owner's visual decision remain in
`docs/dispatch/2026-10-13-tab-shell/owner-acceptance.md`; this migration guide does
not turn them into implementation or publication decisions.
