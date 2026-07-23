# CLAUDE.md — Design System agent entry

TCRN Design System monorepo. Packages: `@tcrn/ui-tokens`, `@tcrn/ui-copy-state`,
`@tcrn/ui-react`, and the `apps/storybook` contract-docs app. Read this before changing
any UI, token, or doc source. This is a signpost, not a manual — the real reference is
the repo's `README.md` and `docs/style-scale.md`.

## Verify before you claim done

Run `pnpm verify` (defined in `package.json`) and let it pass before reporting a change
as done. It chains: `typecheck`, `build`, `test`, `tokens:proof`, `exports:check`,
`pack:smoke`, `storybook:smoke`, `readme:proof`, `public-output:scan`,
`internal-vocab:scan`, `scan`, `scaffold:proof`, `internal-alpha:proof`. Per-epic convention: run the sub-gate closest
to your change (for example `pnpm tokens:proof` or `pnpm shell:fidelity`) as you go, then
the full `pnpm verify` before closeout.

## Scales come from tokens — never a raw literal

`docs/style-scale.md` is the radius / spacing / type reference. New styles take their
values from tokens; a bare `px`, hex, or radius literal is a defect the gates reject. The
single source of truth for every scale is `packages/ui-tokens/src/index.ts`, and
`pnpm tokens:proof` plus `pnpm shell:fidelity` enforce it.

## Do not hand-edit generated token blocks

Edit tokens only in `packages/ui-tokens/src/index.ts`, then run `pnpm tokens:sync`. That
regenerates `packages/ui-tokens/src/tokens.css` and the marked block in
`apps/storybook/src/storybook.css` (below the `Token blocks below are generated from
@tcrn/ui-tokens` marker). `pnpm tokens:proof` fails if either drifts from the source.
Never hand-edit those generated CSS blocks.

## Component CSS truth

The package-truth component stylesheet is the `tcrnComponentCss` template literal in
`packages/ui-react/src/components/Navigation/Navigation.tsx`, consumed by both Storybook
and downstream product shells. `apps/storybook/src/storybook.css` and
`apps/storybook/src/alpha-styles.ts` are doc-only presentation layers, not package output.

## AI contract — read first

Agents consuming the Design System must read the AI contract. Its tracked source is
`apps/storybook/src/build/ai-consumption-contract.ts` plus
`apps/storybook/src/build/foundation-visual-standards.ts`; the hosted readback is
https://tcrn-design-system-storybook.vercel.app/ . The shipped
`ai-consumption-contract.json` and `llms.txt` are build outputs (gitignored, absent from a
fresh clone) — read the `.ts` source, not those paths.

## House rules

- No-overclaim: do not assert npm/package publication, hosted-doc readiness, product
  adoption, release readiness, or product acceptance in code, docs, or commits. The
  forbidden-phrase list lives in `@tcrn/ui-copy-state` and is enforced by `pnpm scan` and
  `pnpm readme:proof`.
- Commits carry the story key, for example `feat(...): ... (TCRN-DS-STORY-0XX)`.
- No internal vocabulary in rendered copy: internal story/epic/initiative keys
  (`S0xx`, `INIT-`, `EPIC-`, `STORY-`, `TCRN-DS-`), team persona names, vendor/model
  names (Gemini), retired systems (Codex), dev ports (4317), and vault paths must not
  appear in the rendered visible text of the built pages. Enforced by
  `pnpm internal-vocab:scan` (wired into `pnpm verify` after `public-output:scan`);
  legitimate fixture domain-data tokens are registered in the exemption ledger at the
  top of `scripts/internal-vocabulary-scan.mjs`.
- Do not commit an owner email, author-email trailers, or local machine paths — the
  privacy scan (`pnpm scan`) fails closed on them.

See also `AGENTS.md` (vendor-neutral pointer to this file) and `apps/storybook/README.md`
(the docs app).
