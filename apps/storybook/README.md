# @tcrn/design-system-storybook

The Storybook contract-docs app for the TCRN Design System. It renders the shared
contract surface — tokens, copy-state vocabulary, components, patterns, no-overclaim
language, and local proof fixtures — as synthetic stories, and it emits the
machine-readable AI consumption contract. It is documentation and proof; it does not
claim package publication or product adoption.

## Two presentation tracks

The same contract content is presented two ways:

- **Real Storybook preview (Track A).** `.storybook/preview.ts` loads `src/storybook.css`
  and the runtime-injected `tcrnComponentCss` from `@tcrn/ui-react` (package rules win
  ties). Stories are CSF files at `src/*.stories.tsx`.
- **Deployed static docs (Track B).** `src/build/write-static.ts` renders the static
  pages served at https://tcrn-design-system-storybook.vercel.app/ . Each page inlines
  `tcrnComponentCss`, then `alphaStoryCss` from `src/alpha-styles.ts`, then a re-scoped
  copy of `tcrnComponentCss` (see `src/build/page-template.tsx`).

`storybook.css` and `alpha-styles.ts` are doc-only presentation layers. The package-truth
component stylesheet is `tcrnComponentCss`, written in `packages/ui-react/src/styles/`:
one module per family (`base`, `typography`, `icon`, `actions`, `inputs`, `brand`) plus the
contract-generated segments in `styles/generated/`, joined in cascade order by
`styles/index.ts`, which is where the stylesheet is defined. Import it from the package
entry `@tcrn/ui-react`; the `Navigation` component module only re-exports it so older
imports keep working.

## The docs render only the package

Stories render `@tcrn/ui-react` components with the package stylesheet. The doc layer may
add presentation scaffolding only, under its own `tcrn-doc-` class prefix; it must not
restyle or re-implement a package component. `pnpm doc-shell:proof` fails on any `tcrn-*` class
that the docs render or style but the package CSS does not define, and
`pnpm doc:sample-style` fails when a doc stylesheet or a story's inline style makes a
first-batch component look different from the same component in its family matrix.

## G+ matrix and sample stories

The five first-batch families (Typography, Icon, Brand, Actions, Inputs) each have a
matrix story and a sample story, registered in `src/contract-stories/gplus/`:

| Family | Matrix | Sample |
| --- | --- | --- |
| Typography | `typography-matrix` | `typography-sample-billing` |
| Icon | `icon-matrix` | `icon-sample-project` |
| Brand | `brand-matrix` | `brand-sample-product` |
| Actions | `actions-matrix` | `actions-sample-project` |
| Inputs | `inputs-matrix` | `inputs-sample-members` |

- On the static docs (Track B) the matrices are on the `gplus-matrices` category page
  (`components-gplus-matrices.html#typography-matrix`) and the samples on the
  `gplus-samples` page. In the real Storybook (Track A) the CSF titles are `Typography`,
  `Icon`, `Brand`, `Actions` and `Inputs`, with the exports `Matrix` and `SampleBilling`,
  `SampleProject`, `SampleProduct` or `SampleMembers` (ids such as `typography--matrix`).
- A matrix shows every variant and state of its family, in a light block and a night
  block. Static state cells use `data-tcrn-preview-state="hover|active|focus"` and read the
  same state pairs as the live pseudo-classes. The cell data comes from the contract
  (`docs/design/gplus-2026-10/contract/matrices.json`) through the generated
  `src/contract-stories/gplus/generated/`.
- A sample composes the family into a product page from the G+ canvas.
- `docs/design/gplus-2026-10/storybook-map.json` maps every canvas board and lettered
  section to its story, or records why it has none. `pnpm storybook:visual-proof`
  reconciles that map with the story list and measures every row, and
  `pnpm geometry:measure` runs the eight G+ measurements and the overlap check on every
  matrix and sample story.

## Where the contract lives

- Story registry and content: `src/contract-stories/`.
- CSF adapters (Track A stories): `src/*.stories.tsx`.
- AI contract source: `src/build/ai-consumption-contract.ts` and
  `src/build/foundation-visual-standards.ts`. The shipped `ai-consumption-contract.json`
  and `llms.txt` are build outputs (gitignored) — read the `.ts` source in a fresh clone.

## Localization

Every visible UI string needs all five locales — `zh-CN`, `en`, `ja`, `ko`, `fr` — in the
two dictionaries under `src/build/locales/` (`storybook-locale-text.ts` for shell, nav, and
story titles/descriptions; `storybook-content-text.ts` for in-story copy), or registration
as locale-invariant (a machine token) in `scripts/lib/locale-invariant-ledger.mjs`. The
runtime locale swap is an exact-string match, so a string with no entry silently renders
English on a localized route; the per-story English-leak scan in `pnpm internal-alpha:proof`
reds the gate on any unregistered English run.

## Build and check

From this package:

- `pnpm build` — typecheck and build the static docs (`pnpm static-docs:build` is an
  alias).
- `pnpm test` — the smoke suite (`node --test dist/smoke.test.js`).

From the repo root:

- `pnpm storybook:smoke` — checks the built static-docs HTML surface.
- `pnpm geometry:measure`, `pnpm storybook:visual-proof`, `pnpm doc:sample-style`,
  `pnpm fonts:render`, `pnpm doc-shell:proof` and `pnpm contract:static` — the G+ gates that
  read the built static docs; run `pnpm build` first. Each runs on its own while you work;
  `docs/contract/README.md` lists what each checks and how to narrow it to one family.
- `pnpm verify` — the full gate chain; run it before claiming a change done.

See the repo-root `docs/style-scale.md` for the token scales (values come from tokens, never
a raw literal).
