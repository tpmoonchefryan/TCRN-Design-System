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
