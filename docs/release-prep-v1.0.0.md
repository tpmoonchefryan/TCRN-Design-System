# TCRN Design System v1.0.0 Release Preparation

## Scope

This document records the accepted TCRN Design System public baseline as
version `1.0.0` under Apache License 2.0. It also distinguishes the historical
local release-prep route from the current public GitHub state.

The public baseline packages are:

- `@tcrn/ui-tokens`
- `@tcrn/ui-copy-state`
- `@tcrn/ui-react`

The root workspace remains `private: true`. `apps/storybook` is the prepared
static Storybook documentation surface. The `examples/*` packages remain
private proof/demo packages and are not package publication targets in this
route.

## License

The repository root contains the Apache License 2.0 text in `LICENSE`.
The root workspace and the three public package manifests declare
`"license": "Apache-2.0"`.

## Current Public State

- GitHub repository:
  `https://github.com/tpmoonchefryan/TCRN-Design-System`.
- Repository visibility: public.
- GitHub Release: `v1.0.0`.
- Release URL:
  `https://github.com/tpmoonchefryan/TCRN-Design-System/releases/tag/v1.0.0`.
- Release target commit:
  `1f98fb4e787d8ea63d753843182daac897d61a9b`.
- Release state: non-draft and non-prerelease.
- Initial Vercel status for release target: failure. The clean Vercel checkout
  needed the workspace packages built before Storybook.
- Hosted docs production commit:
  `5384f08cf08f60e5fde086e03a62300bd3ca2b82`.
- Hosted docs production status: success.
- Hosted docs Vercel deployment id: `5177066746`.
- Hosted docs Vercel environment: Production.
- Hosted docs public URL:
  `https://tcrn-design-system-storybook.vercel.app/`.
- Hosted docs deployment URL:
  `https://tcrn-design-system-storybook-lxf6e85g7-tcrn-platform.vercel.app`.
- Hosted docs status/deployment timestamp: `2026-06-24T06:46:35Z`.

The original local release-prep route did not itself perform the public repo
exposure or create the GitHub Release. This post-release correction records the
current state so public-facing docs and receipts no longer imply that the repo
and release are still deferred.

The Vercel record proves hosted Storybook documentation is available for the
public Design System site. It does not publish npm packages, change the release
tag target, or prove AOS/TMS product adoption.

## Remaining Deferred Publication Plan

- Prepared hosted-docs config: `vercel.json`.
- Prepared hosted-docs build command: `pnpm storybook:vercel-build`.
- Prepared hosted-docs output directory:
  `apps/storybook/storybook-preview-static`.
- Hosted documentation publication/readiness is confirmed for the Storybook
  documentation site at `https://tcrn-design-system-storybook.vercel.app/`.
- npm/package registry publication remains unconfirmed in this route.

## Boundaries

The public repository, GitHub Release `v1.0.0`, and hosted Storybook
documentation site currently exist. This correction does not publish npm
packages, modify the GitHub Release, change repository visibility, create
AOS/TMS product adoption, approve product acceptance, claim broad release
readiness, or claim final MVP acceptance. Public package registry publication
remains a separate route.
