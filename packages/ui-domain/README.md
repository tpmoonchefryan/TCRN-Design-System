# @tcrn/ui-domain

Components that name a product entity — Work items, Knowledge pages, Gates,
Evidence. They were built inside the Design System and lived in `@tcrn/ui-react`
for as long as that library had one consumer, which made the library's own rule
untrue: a component belongs in the Design System if and only if its props can be
described without naming any single product's business concept
(`TCRN-TMS-MIN-008`).

They are not deleted, because DS's live consumer imports twenty-five of them and
a library that deletes what its consumer imports has not become generic, it has
become broken (`TCRN-DS-INIT-012`). They live here instead: a package that is
allowed to know what a Work Item is.

This package depends on `@tcrn/ui-react` and never the other way round. The
generality gate in DS core (`pnpm generic:scan`) is what keeps that true — it
refuses a new domain component reaching `packages/ui-react/src/components`.

## Styles

Domain component styles ship as `tcrnDomainComponentCss`, the domain half of the
partition described in `@tcrn/ui-react`'s `component-css-partition`. A consumer
using this package injects both halves; a consumer using only DS core injects
`tcrnCoreComponentCss` alone.
