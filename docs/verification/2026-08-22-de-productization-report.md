# DS de-productization batch — verification report

Date: 2026-08-22  
Disposition: `pending-owner-acceptance`  
Publication, push, tag, deployment, package adoption, and release claims: none.

## Package disposition

The pre-change roster was read from the tracked `packages/ui-domain/src/index.ts`:
35 component names, 4 utility names, and 63 type names. The package had no active
product import in the current workspace after the example migration. The result
is retirement of `@tcrn/ui-domain` and migration of the functional surface into
`@tcrn/ui-react`; there is no remaining package directory, dependency, tsconfig
reference, build filter, or example import pointing to it.

The relationship vocabulary was removed rather than retained as a product
fixture. `RelationshipChip` accepts caller-owned relation text. `StagePipeline`
uses `references`, so its stages are not tied to governance or evidence terms.

## Naming and duplicate checks

`STORY-104` checked the existing core surfaces before moving names. `RecordInspector`
composes `DetailInspector`; `TreeNav` remains link-driven and distinct from the
callback-driven `Tree`; `ViewTabs` remains distinct from `SectionTabs` and
`SegmentedNav`; `RecordTable` is the record-row composite rather than a second
`TableShell`; `StagePipeline` is distinct from the linear `Stepper`; and
`RowGroup` remains the row-specific composition over the generic
`CollapsibleRegion`.

The release naming gate is `pnpm public:naming:proof`. It checks category IDs,
story IDs, and five-locale story titles, including red-leg tests for product
names, product-domain compounds, and stale debt entries.

The parallel Incident work is recorded by its focused gates: `doc-shell:proof`
for the Storybook documentation shell, `component-modifiers:proof` for the
neutral/positive/warning/danger modifiers, `brand-asset:proof` for the published
SVG source boundary and digest, and `badge-wrap:proof` for the single-line
badge safety band. The generated AI contract records the published asset URL;
the local build asset is treated as development input, not as the consumer
authority.

## Visual and browser evidence

The browser proof captured 55 stories × 3 viewports plus the section/reference
surfaces, with 0 axe violations and 0 remaining visual-signature regressions
after the baseline update. The following 14 gated captures changed beyond the
prior signature tolerance as an intentional consequence of component migration,
CSS cleanup, and functional naming/content changes. The pre-update signature
distances are shown as `meanAbsolute / maxCell`:

- `component-family-index`: desktop `2.859 / 15`, tablet `2.215 / 17`, mobile `2.363 / 12`
- `records-and-boards-components-spec`: desktop `3.758 / 17`, tablet `0.156 / 9`
- `hierarchy-and-relations-stages-spec`: desktop `1.871 / 12`, tablet `1.852 / 11`
- `detail-and-inspection-density-spec`: tablet `1.445 / 12`, mobile `1.270 / 9`
- `detail-and-inspection-route-spec`: desktop `1.297 / 15`, tablet `1.730 / 21`
- `documents-and-collaboration-components-spec`: tablet `0.121 / 17`
- `records-and-boards-patterns`: mobile `2.449 / 18`
- `big-list-search-patterns`: mobile `2.180 / 22`

The updated signatures and screenshot receipts are in
`docs/verification/internal-alpha/`; the browser proof was rerun without an
update flag and returned green. The legacy exact-PNG oracle is retained as
pre-INIT-001 history and its command reports itself retired; it was not used to
mask these differences. No baseline was bypassed.

## Rechecks

Passing targeted rechecks include `pnpm typecheck`, `pnpm build`, `pnpm test`,
`pnpm internal-alpha:contracts`, `pnpm storybook:smoke`,
`pnpm public:naming:proof`, `pnpm generic:scan`, `pnpm tokens:proof`, and
`pnpm internal-alpha:browser-proof`, and `pnpm verify` (exit 0). Owner review
remains the required acceptance lane.
