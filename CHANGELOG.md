# Changelog

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
