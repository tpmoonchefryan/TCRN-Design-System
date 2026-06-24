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
  `57b1c417efe4c011daa538158b347075d122b72b`.
- Release state: non-draft and non-prerelease.
- GitHub status/readiness for selected basis: not claimed. Selene's selected
  public-basis readback reported combined status pending with no statuses,
  Actions runs, or deployments for this exact commit.
- Hosted docs public URL:
  `https://tcrn-design-system-storybook.vercel.app/`.
- Hosted docs URL reachability: observed externally, but not treated as
  GitHub/Vercel deployment proof or hosted-doc readiness proof for the selected
  basis.

The original local release-prep route did not itself perform the public repo
exposure or create the GitHub Release. This post-release correction records the
current state so public-facing docs and receipts no longer imply that the repo
and release are still deferred.

The public URL readback shows hosted Storybook documentation is reachable for
the public Design System site. It does not publish npm packages, prove a
GitHub/Vercel deployment record for the selected basis, change the release tag
target, or prove AOS/TMS product adoption.

## Remaining Deferred Publication Plan

- Prepared hosted-docs config: `vercel.json`.
- Prepared hosted-docs build command: `pnpm storybook:vercel-build`.
- Prepared hosted-docs output directory:
  `apps/storybook/storybook-preview-static`.
- Hosted Storybook URL reachability is observed for
  `https://tcrn-design-system-storybook.vercel.app/`; broader hosted-doc
  readiness and GitHub/Vercel deployment proof remain unclaimed here.
- npm/package registry publication remains unconfirmed in this route.

## Boundaries

The public repository, GitHub Release `v1.0.0`, and hosted Storybook URL
currently exist. This correction does not publish npm packages, prove hosted-doc
deployment readiness, modify the GitHub Release, change repository visibility,
create AOS/TMS product adoption, approve product acceptance, claim broad release
readiness, or claim final MVP acceptance. Public package registry publication
remains a separate route.
