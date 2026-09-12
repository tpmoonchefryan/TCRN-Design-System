# @tcrn/ui-react

React primitives and compositional patterns for synthetic TCRN design-system
fixtures. Components accept normalized display props only and do not fetch data,
mutate state outside the component tree, decide product truth, or import product
APIs.

Version `3.0.0` is prepared under Apache License 2.0 as part of the accepted
TCRN Design System public package baseline.

## Component Library Public API

`componentLibraryPublicComponentNames` is the package-backed component readback
for the local component-library checkpoint. It names public components proven by
package contract receipts and Storybook consumption. `componentLibraryPublicUtilityNames`
names supporting public utilities, while `componentLibraryDeferredPrototypeNames`
names Storybook-only proof surfaces that must not be read as component-library
exports, package publication, or product adoption claims.

`ClipboardCopyButton` is a restricted package-backed button action. It requires
explicit native button activation, writes only through `navigator.clipboard.writeText`,
fails closed when the Clipboard API is unavailable, and reports only local copy
state enums through callbacks. Copied text must remain product-approved input and
is never returned by the component through callbacks or DOM attributes.

`SettingChoice` is the package-backed value-selection contract. Three or more
values always render as `Select`; a binary choice renders as a native radio group
only when the consumer provides enough measured inline space for every label and
control. Each binary option must provide a finite positive `minInlineSize` measured
from the current font, locale, content, and container; the 112px package floor is a
CSS minimum, not a label measurement. Missing or invalid measurements select
`Select`. `SegmentedNav` remains navigation and must not be used as a setting value
control. `NumberInput` is the numeric-entry primitive; `Stepper` remains a process
position indicator and is not a numeric input substitute.
Per-option `disabled` values are preserved when the same `SettingChoice` changes
between its native radio and native Select branches.
The component owns the current value for the uncontrolled `defaultValue` form and
uses the supplied `value` for the controlled form; either mode retains a valid
selection when the branches swap. `onChange` reports actual user value changes
once and is silent during layout-only swaps or unchanged-value events.

`SettingsLayout` uses the actual content container to choose its density. At a
960px frame it places compact local navigation beside one content column; below
that it stays one column. Its content stacks `SettingRow` label, control, and tools
below 720px. The layout keeps long native input values selectable and copyable and
does not hide configuration through overflow clipping. `SettingsHostSwitcher`
expresses the single-host-before-complete-form composition.

`PageHierarchy` takes an explicit `depth`: `two` renders `PageHeader`, parent-level
`SubNav`/`SectionTabs`, then lower content; `three` renders the same Header and
parent tabs, then the selected subpage's local navigation and content. The global
`ProductShell` topbar is external, and container width only adapts the third-level
region after depth has been chosen.

## Icon Library Boundary

`Icon` is the package-backed icon primitive. It wraps the curated Lucide icon set
through `@tcrn/ui-react`; Storybook and downstream consumers should import TCRN
icon primitives from this package rather than importing `lucide-react` directly.
`tcrnIconNames` is a stable public utility readback of the currently approved
names.

Lucide is recorded as the local icon source with an ISC license readback. This
does not turn general-purpose icons into TCRN brand marks: product logos,
mother-brand marks, and product lockups remain brand assets, not icon-library
substitutions.

## Storybook Shell Control Boundary

The static Storybook documentation shell and downstream product shells share a
registered package-backed product shell/effect boundary. Consumers should import
`ProductShell`, `ProductShellSearch`, `ShellThemeToggle`, `ShellLocaleMenu`,
`SideNavCollapseButton`, `ShellBrandLockup`, `ProductLockup`, and
`TcrnBrandMark` from `@tcrn/ui-react` instead of recreating reusable shell
controls, brand marks, layout effects, or navigation behavior locally.

- Theme switching stays a single icon-only circular button. It reflects the
  current light/dark mode and toggles only on explicit activation.
- Theme changes use a whole-page shell transition. Sidebar, header, and content
  must not darken as separate independent regions.
- Language selection uses a globe trigger plus the current locale name in that
  locale. Compact controls must not use long bilingual labels.
- Shell search may be compact at rest and expand on focus, then collapse on
  blur. Shortcut labels belong only to shell search with real focus/result
  behavior.
- The AI consumption contract remains in the Proof story and static JSON
  artifact. It is not a primary top-bar control for human readers.

`useProductShellController` is the public utility for bounded state/effect glue:
collapsed navigation state, theme, locale menu open state, and compact/focused
search state may be route-owned through DS-defined props and callbacks, while
layout, focus treatment, reduced-motion behavior, and light/dark token posture
remain owned by the package boundary. Product consumers may provide IA/data,
route labels, locale labels, search records, content slots, and callbacks only
through that boundary and must still prove product-specific routes separately.

Consumers should pass the returned `productShellControlProps`,
`productShellSearchProps`, `shellLocaleMenuProps`, `shellThemeToggleProps`, and
`sideNavCollapseButtonProps` bundles, or use the equivalent ProductShell
semantic callbacks directly: `onCollapsedChange`, `onThemeChange`,
`onLocaleMenuOpenChange`, `onLocaleChange`, `onSearchQueryChange`,
`onSearchExpandedChange`, `onSearchDismiss`, and `onSearchResultActivate`.
Wrapper-level event delegation around rendered shell controls is not a
package-backed substitute for those APIs.

A server-rendered product parses the request's `Cookie` header with the exported
`readPreferenceCookieValues` and passes the three narrowed values as
`requestPreferences`. The raw header stays outside the package: it carries every
cookie the product's requests hold, and the shell governs only theme, locale, and
collapse. The controller writes each stored preference to both a
cookie and the client store, and reads whichever store can answer where it runs,
so the render that produces the first paint already carries the reader's theme,
locale, and collapse state instead of correcting to them after hydration. A
client-only product omits the prop and behaves as before. An explicit URL query
still outranks a stored preference: only the product knows its own URL
vocabulary, so it resolves that itself and passes the winner as `initialTheme` or
`initialLocale`.
