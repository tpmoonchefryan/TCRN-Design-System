# 4.0.0 local release candidate

The three library packages and companion `@tcrn/ds-consumer-tools` are unpublished
4.0.0 local candidates. The pinned author source is public Site v2, exact commit
`e76b7272d98c0359a57c42d49bf70d64e5b4c2ad`, published under
`minutes:024a8b72088fac0970916091#D2` with readback under
`minutes:59b6c4ee489ab487482ca51b#D1`. Current source inputs, generated packages,
portal, official Storybook and AI artifacts share that identity. K1/K5/C01,
solid-panel icon labels and Chinese-only menu-ratio wording come from that source.
The formal catalogue remains 28 families and five built-in locales. Product-owned
copy preserves all six existing TMS locale ids.

Owner decision `minutes:b34cc50d61d03ab4bb4e2b40#D1` accepts exact source
`ca0c8c199cb394377f1b6328244d0c8d7efe8d8e` for mixed light/dark documentation
headings/descriptions, launch/view controls, standalone-mark paper carriers and
the complete intro animation. Its scoped checklist is the INIT-086
`intro-doc-theme-repair-stage/main-review/owner-review.md` record. Prior decision
`minutes:024a8b72088fac0970916091#D1` remains true for exact source
`69e37265d0f5bfa766cb6f97f85aa3d289fb9abc`: button/field widths, category/status
display, Storybook entry, date focus and new states of the existing 28 components,
under its original `datepicker-focus-repair-stage/main-review/owner-review.md`
checklist. These decisions do not label a later metadata-only HEAD as visually
inspected or cover future visual changes. Retaining their visual/runtime evidence
requires a comparison of the actual relevant source, runtime and dependency
inputs. Machine checks, formal publication, real TMS acceptance and the original
final independent SUB-708 remain separate.

The library declares React/ReactDOM `^18.3.0 || ^19.0.0`. The installation probe
pins 18.3.1, 19.1.0 and the current TMS runtime baseline 19.2.6; it does not prove
all versions in that range or adoption by the actual TMS application.

The sign-in intro waits for its native animations to complete before removing
the decorative layer. A delayed first rendering opportunity therefore preserves
the complete mark travel and paper rise. The 120/240/100ms motion plan, endpoint
geometry, once-per-session and reduced-motion contracts are unchanged. The ca0c Owner decision above includes the complete
intro; its machine execution
evidence retains its own candidate, inputs and timestamp.

Shell scene and intro documentation labels follow the outer documentation paper’s
theme. The embedded shells, standalone mark paper and moving intro layer retain
their explicit specimen theme. This repairs low-contrast labels in mixed-theme
documentation without changing component colors or motion. The normal browser
measurement covers the actual painted label carrier in both documentation themes,
both entries and five locales, with a real wrong-scope negative case. The ca0c visual
decision is now recorded
in the proof, full AI contract and llms output; it is not a new visual review.

## Build and retain an installable candidate

Run from the repository root with the declared pnpm 10.12.1 and a supported Node
runtime. Resolve `TCRN_BUILD_TRASH` to an absolute runtime path before entering
package scripts; the environment value is relative to each command's actual cwd.
The normal full `pnpm build` creates both static docs and Manager; `pnpm verify`
therefore works without a separately prebuilt Manager. Executed scan/hardening
reports are retained under ignored `docs/verification/generated/`, with their real
source and generation time; tracked report snapshots remain historical. The
[normal verify/build/four-archive sequence](public-distribution.md#verify-build-and-retain-one-candidate)
is shared with the checked-in manual workflow. Retain the reports and raw output
without restoring tracked files between verification and packing.

The integration owner performs the complete producer generation and formal checks
in [the source generation contract](../../design/README.md). This implementation
package's build/pack probes are local evidence only.

After generating and compiling the same source candidate, retain the three
archives with `pnpm pack:smoke --destination <new-empty-directory>`. Each public
package's `prepack` copies the root Apache license into its own archive. Package
files exclude tests and keep declarations, runtime, CSS and the original fonts
with their OFL notices. `packages.json` records complete file lists, exact internal
dependencies and SHA-256. No prior archive or evidence is deleted by that command.

Create the companion tool with
`pnpm pack:consumer-tools --destination <new-directory>`. Its archive bundles the
unchanged normal consumer checker and pure preference-observation validator,
retains their input bytes/hashes, and declares exact TypeScript 5.8.3. Its relative
`bin/consumer-contract-check.mjs` launches the exported checker from
`lib/checker.mjs`; invoking the normal npm bin symlink really executes the check.
The tool does not depend on a source checkout or pre-existing verification dist.
It needs Node 22 or later. Node 24.16.0 is the locally exercised runtime.

For the actual independent installation probe:

```sh
pnpm pack:install-proof \
  --archives <three-package-directory> \
  --tools <tool-directory>/tcrn-ds-consumer-tools-4.0.0.tgz \
  --producer apps/storybook/storybook-static \
  --destination <new-directory-outside-the-monorepo>
```

The probe copies the exact archives and offline `ai/` tree, installs each matrix
with npm, retains archive URLs/integrities in its lock and exact version declarations
in its manifest, then runs offline `npm ci`. There is no ancestor node_modules,
workspace linkage, source symlink or compiler path mapping. It runs strict
TypeScript including dependency declarations, SSR/hydration, actual Chromium form
interaction at desktop/390 in both themes, exported CSS and font HTTP bytes,
font loading with a blocked-font control, license checks, and the installed CLI's
positive and unknown-token negative. Commands, stdout, stderr, exits, locks and
screenshots remain with that external probe. This fixture is a package test, not
a new model session or a real TMS/API/database test.

## Use the installed tool

Install the three exact matching archives and tool into a clean consumer, retaining
the resulting `package-lock.json`. For an archive-only delivery, the installation
probe demonstrates how exact `4.0.0` declarations coexist with local archive URLs
and integrity records in the lock, followed by a successful offline `npm ci`.
A chosen registry can provide the same exact versions after actual publication.
Never replace the lock with an unverified registry artifact of the same version.

Copy the producer `ai/` directory without flattening it. Pin its full trusted
`identity` in the consumer's `.tcrn-ds.json`, declare the task's components,
patterns and source roots, and start reading at `producer/ai/index.json`.
Read global and task-required transitive rules; optional links remain optional.
Run the installed executable from the consumer root:

```sh
./node_modules/.bin/tcrn-ds-check \
  --project . --index ./producer/ai/index.json --declaration .tcrn-ds.json
```

A failure exits nonzero. Retain the output's findings and limits. The checker
validates the installed packages, identity and selected rule bytes, source token/
component use, explicit callbacks and supplied adapter observations. Types,
browser behavior, authentication, business permissions, visuals and publication
require their corresponding checks. The source-level documentation under
`docs/consumption/` describes those contracts; this packaged entry supersedes its
source-checkout invocation. No local absolute producer path is a consumer contract.
The [fixed new-session task](../../consumption/new-session-task.md) defines a
separate candidate exercise. Its prior recorded result and the later checker
correction are retained in the INIT evidence; this build/pack flow does not rerun
that session or establish real TMS adoption.

## Upgrade and rollback

Before changing a consumer, retain its current manifest, lock, producer `ai/` tree,
exact archives and service/configuration revision. Record SHA-256 and the actual
currently deployed application revision. Install all three matching new package
versions plus the matching tool together, replace the offline AI tree as one set,
review and pin the new complete identity, run `npm ci`, types, normal checker,
browser and application tests, then use the separately authorized deployment path.
Do not reuse an old identity with new rules or change only a version string.

For an application rollback, restore that saved manifest/lock/archive set and
matching AI identity/tree, run `npm ci` and the same affected checks, then restore
the approved prior application/service revision. The probe exercises clean
reinstallation of the retained current candidate; it does not establish a prior
production package baseline. Select and verify that prior baseline before a
production rollout. Do not describe a Git tag or the old Site v1 as a verified
published npm package. TMS preference schema/data rollback is separate: retire the
consumer/API feature while retaining the new table and user data; deleting
production data requires its own authorization and recovery plan.

## Selected public distribution and remaining release work

Owner decision `minutes:6f3e0a9a1e07e3980867d82e` D3 selects four versioned tarballs
in the existing public GitHub repository's Releases and the existing connected
Vercel project. No npm registry or GitHub Pages project is required. See
[the public delivery procedure](public-distribution.md) for the combined build,
pnpm 11.3.0 verified-download installation, exact internal dependency overrides, release order,
readback and rollback. Local artifacts remain unpublished candidates. Author source publication is complete. DS publication authorization, remote
release/deployment readback, actual TMS integration and the original final
independent acceptance remain separate pending work.
