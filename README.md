# TCRN Design System

Workspace for the TCRN Design System / UI Kit.

The accepted Design System public baseline is version `1.0.0` under Apache
License 2.0. The repository is currently public on GitHub and GitHub Release
`v1.0.0` exists for commit
`57b1c417efe4c011daa538158b347075d122b72b`. Those public-state changes were
not performed by the original local release-prep route; this README records the
current state after Selene selected the exact public source-control basis.

The prepared documentation surface is the Storybook static build from this
repository. Hosted Storybook documentation is live on Vercel at
`https://tcrn-design-system-storybook.vercel.app/`. That URL reachability is a
public hosted-docs readback only; GitHub status checks, Actions runs, deployment
records, and hosted-doc readiness proof are not claimed for the selected
`57b1c417efe4c011daa538158b347075d122b72b` basis.

The root workspace remains private. The public package baseline is limited to
`@tcrn/ui-tokens`, `@tcrn/ui-copy-state`, and `@tcrn/ui-react`.

## MVP Packages

- `@tcrn/ui-tokens`: semantic token metadata and CSS variable exports.
- `@tcrn/ui-copy-state`: fail-closed display-state and no-overclaim helpers.
- `@tcrn/ui-react`: React primitives and synthetic workbench patterns.

## Proof Surface

- `apps/storybook` builds the static contract and documentation surface from
  synthetic stories. It does not prove AOS/TMS product adoption.
- `examples/tms-react-pilot` and `examples/aos-token-copy-state-pilot` are
  synthetic fixtures only.

## Commands

```bash
pnpm install
pnpm install --frozen-lockfile
pnpm verify
```

## Release Preparation

- Version: `1.0.0`
- License: Apache-2.0
- Release-prep notes: `docs/release-prep-v1.0.0.md`
- Static docs build target: `apps/storybook`.
- Prepared hosted-docs config: `vercel.json`.
- Public repository state: GitHub repo is public at
  `https://github.com/tpmoonchefryan/TCRN-Design-System`.
- GitHub Release state: `v1.0.0` exists, non-draft/non-prerelease, targeting
  `57b1c417efe4c011daa538158b347075d122b72b`.
- Hosted documentation state: public Storybook URL reachable; GitHub/Vercel
  deployment proof for the selected basis is not claimed.
- Hosted documentation URL:
  `https://tcrn-design-system-storybook.vercel.app/`.
- Package registry publication remains a separate route and is not claimed
  here.

## Boundaries

- No product source, product data, product APIs, RBAC/auth packages, secrets,
  raw evidence, local path dumps, target-host payloads, private screenshots, or
  unredacted logs are allowed in this scaffold.
- Product repositories own backend truth, route authorization, tenant scoping,
  evidence truth, persistence, product release readiness, product acceptance,
  and final MVP acceptance.
