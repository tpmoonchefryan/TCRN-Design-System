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
component stylesheet is `tcrnComponentCss` in
`packages/ui-react/src/components/Navigation/Navigation.tsx`.

## Where the contract lives

- Story registry and content: `src/contract-stories/`.
- CSF adapters (Track A stories): `src/*.stories.tsx`.
- AI contract source: `src/build/ai-consumption-contract.ts` and
  `src/build/foundation-visual-standards.ts`. The shipped `ai-consumption-contract.json`
  and `llms.txt` are build outputs (gitignored) — read the `.ts` source in a fresh clone.

## Build and check

From this package:

- `pnpm build` — typecheck and build the static docs (`pnpm static-docs:build` is an
  alias).
- `pnpm test` — the smoke suite (`node --test dist/smoke.test.js`).

From the repo root:

- `pnpm storybook:smoke` — checks the built static-docs HTML surface.
- `pnpm verify` — the full gate chain; run it before claiming a change done.

See the repo-root `CLAUDE.md` for agent house rules and `docs/style-scale.md` for the
token scales (values come from tokens, never a raw literal).
