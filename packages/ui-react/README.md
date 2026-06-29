# @tcrn/ui-react

React primitives and compositional patterns for synthetic TCRN design-system
fixtures. Components accept normalized display props only and do not fetch data,
mutate state outside the component tree, decide product truth, or import product
APIs.

Version `1.0.0` is prepared under Apache License 2.0 as part of the accepted
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
