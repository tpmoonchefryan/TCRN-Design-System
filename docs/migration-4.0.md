# Migrating to TCRN Design System 4.0.0

This guide is for the three consumers of `@tcrn/ui-tokens`, `@tcrn/ui-copy-state`
and `@tcrn/ui-react`: TCRN AOS, TCRN TMS and the Einzbern portal. It covers the move
from 3.0.0, and from the unreleased `main` that followed it, to 4.0.0 (the G+
renewal, TCRN-DS-INIT-015).

Status: 4.0.0 is a candidate. It is not tagged, not published and not deployed;
each of those is a separate Owner decision, and so is the Owner's visual
acceptance. The release notes are the 4.0.0 section of `CHANGELOG.md`.

How this guide was written: from this repository's commits and the INIT-015
package handoffs only. It does not read any consumer repository, so it says what
changed and what to do, not where a consumer uses each item. Each consumer runs
the checks in its own tree. Every item names its source: a commit on the INIT-015
integration branch, the Subtask key, and the package handoff in
`docs/dispatch/2026-10-11-gplus-renewal/runs/r1/handoff/`.

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
8. Adopt the Text, Highlight, Button, ButtonGroup and Inputs changes where AOS
   styles or wraps those components (M10 to M14).
9. If AOS styles the product shell toggles, drop colour, shadow, transition and
   press overrides on them (M15).
10. If AOS consumed the unreleased `main` with `@tcrn/ui-domain`, import from
    `@tcrn/ui-react` instead (M16).

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
   `--tcrn-brand-suffix-tms` (M9).
5. Take icons from the roster, not from a third-party set (M6, M7).
6. Use `Text` props, `Button size="lg"`, `ButtonGroup` and the pair-driven inputs
   instead of local variants (M10 to M14).

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

## Breaking changes in detail

### M1 · Fonts ship in the package

Change: five SIL OFL 1.1 families ship in `@tcrn/ui-tokens` as WOFF2 files: Hanken
Grotesk (UI), Source Serif 4 (headings and figures), IBM Plex Mono, Noto Sans SC and
Noto Serif SC (Chinese fallbacks, as the upstream slices that cover product text).
`@tcrn/ui-tokens/fonts.css` declares them, and `tokens.css` starts with
`@import "../fonts/fonts.css";`. The JS export `tcrnTokenCss` has no `@import`.

Do:

- If you inject `tcrnTokenCss`, add `import "@tcrn/ui-tokens/fonts.css";` once at
  the shell. If you import `@tcrn/ui-tokens/tokens.css` through a bundler that
  follows CSS imports, the fonts come with it.
- Remove links to a font CDN (`fonts.googleapis.com`, `fonts.gstatic.com`); the
  files are served from your own build.
- Let the bundler copy the `.woff2` files unchanged. When you redistribute them,
  keep `FONT-LICENSES.md` and `licenses/` with them; do not sell the fonts on their
  own, and rename a font if you modify it (minutes D4).

Source: 296a0c1 (TCRN-DS-SUB-004), e532b52 (TCRN-DS-SUB-006), 343c2e3 (OFL-1.1 in
the licence allow-list); handoffs W1-C and W2-A.

### M2 · Token names follow the G+ contract; old names are deprecated aliases

Change: colour, elevation, selection, motion easing and type family tokens take
the contract names (table below). Each old name stays defined as
`--old: var(--new)` and resolves to the new value. `--tcrn-motion-press-scale`
stays at 0.97 with no successor.

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

Source: a88b7ad (TCRN-DS-SUB-001), e532b52 (TCRN-DS-SUB-006), 812cf3f
(TCRN-DS-SUB-003); handoffs W2-A and W3-A.

### M3 · Token values move to the G+ scale

Change: control heights are 28, 32 and 40px (`--tcrn-control-height-sm|md|lg`),
control padding 10, 12 and 16px, control text 12, 13 and 14px, icon sizes 14, 16
and 20px, radii 8, 6, 12, 4 and 3px (`--tcrn-radius-control|small|panel|check|stamp`),
motion 120, 80, 240 and 900ms with one ease. Body text is 13/20, reading 14/22,
meta 12/16, caption 11/16, page 36/40, heading-2 26/30, section and heading-3 20/26.
Line height tokens now carry px units. `--tcrn-type-family-heading` (Source Serif
4) is new. Colours, shadows and the control outline (`--tcrn-color-line-ctl`)
change in both themes.

Do: re-baseline screenshots and computed-style assertions, and check any
`calc()` that multiplies a line height token as a unitless number.

Source: a88b7ad (TCRN-DS-SUB-001), e532b52 (TCRN-DS-SUB-006); handoff W2-A.

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

Source: a88b7ad (TCRN-DS-SUB-001), 385ee0a (TCRN-DS-SUB-018); handoffs W2-A and W2-D.

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
System suffix `--tcrn-brand-suffix-design-system` (#6577f3). Both values are the
same in both themes until the Owner rules on night values (problem P15).

Do: remove local gradient or suffix colour overrides; update colour assertions.

Source: ccb7bea (TCRN-DS-SUB-022); handoffs W2-A and W2-F; minutes D2.

### M10 · `Text` props, `Heading` titles

Change: `Text` gains `size` (`body`, `reading`, `meta`, `caption`), `tone`
(`default`, `strong`) and `variant` (`numeral`, `caps`). Without props it still
renders `class="tcrn-text"`: a 13/20 paragraph in the secondary ink. `numeral` and
`caps` are single-line; a unit goes in a `small` element, a numbering prefix in a
`b` element. `Heading` levels 1 to 4 are single-line and carry their text as
`title`. The clamp heading sizes are gone.

Do: replace local font-size or numeral and caps classes on `Text` with the props;
update snapshots for the new `title` attributes.

Source: e7ef431 (TCRN-DS-SUB-012); handoff W2-B.

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
`loading` and shows one icon per settled state.

Do: replace height overrides with `size="lg"`; remove `border-color`, `transform`
and `box-shadow` overrides on buttons; remove `loading` from `ClipboardCopyButton`.

Source: b7eb514 (TCRN-DS-SUB-016), 7f631b2 (TCRN-DS-SUB-017), 385ee0a
(TCRN-DS-SUB-018); handoff W2-D.

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

Do: remove `border-color` overrides and mark errors with `aria-invalid="true"`,
which selects the invalid pair; point direct-child selectors (`> .tcrn-select`) at the wrappers;
update search box assertions.

Source: 697d4eb (TCRN-DS-SUB-019), 0daff9d (TCRN-DS-SUB-020), 715533d
(TCRN-DS-SUB-021); handoff W2-E; minutes D2.

### M15 · Product shell toggles

Change: the theme, side-navigation and mobile-navigation toggles follow the
Actions pairs; the package no longer writes colour, shadow, transition, hover or
press rules for them. Their sizes (36 and 38px) are unchanged pending design.

Do: remove local overrides that restyle these toggles.

Source: 385ee0a (TCRN-DS-SUB-018).

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

The table is the content of `tcrnDeprecatedTokenAliases` (50 entries) plus the one
entry of `tcrnDeprecatedTokens` without a successor; read those exports for the
current list. Names kept with new G+ values rather than aliased:
`--tcrn-type-family-ui`, `--tcrn-type-family-mono`, `--tcrn-radius-control`,
`--tcrn-radius-panel`, `--tcrn-radius-surface` (equal to panel),
`--tcrn-type-size-control`, the type size, line height and weight steps, and the
motion shorthands `--tcrn-motion-fast`, `-instant`, `-standard`, `-emphasis` and
`--tcrn-selection-glide`.

## Open Owner decisions that can still move values

These are recorded in `docs/dispatch/2026-10-11-gplus-renewal/owner-acceptance.md`.
Until they are ruled on, 4.0.0 behaves as described above.

- Composition-one shell geometry (sidebar 220, collapsed 52, top bar 52, paper
  inset 12) against `ProductShell` today (sidebar 280, collapsed 92): problem P1,
  storybook map DIFF-1 to DIFF-3.
- Night values of the TMS and Design System suffix colours: problem P15.
- Sizes of the shell theme and side-navigation toggles (36 and 38px): M15.
- The `.tcrn-icon` base rule in the package, a design-session ruling open to Owner
  correction: M7.
