# Changelog

## Unreleased

- 2026-07-01: Add Storybook governance/readability/traceability updates from
  route
  `route_tcrn_ds_storybook_governance_ilya_implementation_after_plan_reviews_success_a1f19b1a_dded541`.
  Planned commit: current implementation route commit.
  Affected stories: all 40 local contract stories across `Welcome`,
  `Style Guide`, `Foundations`, `Components`, `Patterns`, `Proof`, and
  `Change Log`.
  AI contract digest/readback: `storybook-static/ai-consumption-contract.json`
  includes `contractPayloadDigest`; Storybook smoke verifies it equals the
  stable JSON digest.
  Proof artifacts: `apps/storybook/storybook-static/ai-consumption-contract.json`,
  `apps/storybook/storybook-static/llms.txt`,
  `docs/verification/internal-alpha/browser-proof-summary.json`,
  `docs/verification/internal-alpha/a11y-axe-summary.json`, and
  `docs/verification/internal-alpha/no-overclaim-scan.json`.
  Boundaries: local Storybook governance contract only; no package publication,
  Storybook/docs publication, AOS/TMS product adoption, owner/product/release
  acceptance, live dispatch, external action, or initiative completion claim.

## 1.0.0

- Prepare the accepted public Design System baseline under Apache License 2.0.
- Set the root workspace and public package manifests to version `1.0.0`.
- Declare `Apache-2.0` for `@tcrn/ui-tokens`, `@tcrn/ui-copy-state`, and
  `@tcrn/ui-react`.
- Add prep-only Vercel configuration for the Storybook static documentation
  build target.
- Keep the root workspace and examples private as package workspaces.
- Record historical local release-prep notes where public hosting, GitHub
  Release creation, package registry publication, and public repository
  exposure were deferred to separate routes.
- Record the post-release current state: the GitHub repository is public and
  GitHub Release `v1.0.0` exists for commit
  `57b1c417efe4c011daa538158b347075d122b72b`; npm package publication remains
  unconfirmed/not performed.
- Record the current hosted-docs readback: hosted Storybook documentation is
  reachable at `https://tcrn-design-system-storybook.vercel.app/`, while GitHub
  status checks, Actions runs, deployment records, and hosted-doc readiness
  proof are not claimed for the selected public basis.
- No AOS/TMS product adoption, product acceptance, release readiness, npm
  package publication, or final MVP acceptance is claimed.

## 0.0.0-private

- Initial local private scaffold for tokens, copy-state, React primitives,
  static contract stories, synthetic examples, and route-local proof scripts.
- No package publication, GitHub publication, product adoption, product
  acceptance, or final MVP acceptance.
