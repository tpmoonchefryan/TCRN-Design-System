# Decision 0001: Standalone Repo Scaffold

## Decision

Create a standalone repository for the initial TCRN Design System scaffold.
The repository began as a private scaffold and is currently public for the
v1.0.0 Apache-2.0 Design System baseline.

## Rationale

The design system needs independent package boundaries, versioning, docs,
synthetic examples, and proof surfaces before any product repo adopts it.

## Non-Claims

- Historical route-local non-claim: the local v1.0.0 Apache-2.0 release-prep
  commit did not itself create a GitHub push, GitHub Release, package
  publication, public repo exposure, product adoption, product acceptance,
  release readiness, or final MVP acceptance.
- Current public-state correction: the GitHub repository is now public and
  GitHub Release `v1.0.0` exists for commit
  `1f98fb4e787d8ea63d753843182daac897d61a9b`.
- npm package publication, hosted documentation deployment, Vercel deployment
  readiness, AOS/TMS versioning, product adoption, product acceptance, release
  readiness, and final MVP acceptance remain unclaimed here.
- AOS and TMS remain separate product repositories and are not mutated by this
  route.
