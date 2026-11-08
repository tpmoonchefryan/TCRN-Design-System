# 4.0.0 local release candidate

The three library packages and the companion `@tcrn/ds-consumer-tools` are 4.0.0
local candidates. The visual standard remains the pinned published Site v1,
commit `a643d4cfcd239f6f81b1715ded6a63caead9d619`. The formal catalogue remains 28
families; root engineering and verification exports are supporting APIs. The Owner
adopted the K1/K5/S03-C01 revision and customer-list support candidate under
`minutes:6f3e0a9a1e07e3980867d82e` D1–D2. Their new author source still requires
actual publication and producer integration; this distribution preparation keeps
the existing source pin and does not claim that integration has happened.
The library declares React/ReactDOM `^18.3.0 || ^19.0.0`. The installation probe
pins 18.3.1, 19.1.0 and the current TMS runtime baseline 19.2.6; it does not prove
all versions in that range or adoption by the actual TMS application.

## Build and retain an installable candidate

Run from the repository root with the declared pnpm 10.12.1 and a supported Node
runtime. Resolve `TCRN_BUILD_TRASH` to an absolute runtime path before entering
package scripts; the environment value is relative to each command's actual cwd.
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
The separate [fixed new-session task](../../consumption/new-session-task.md)
remains required and unperformed by the packaging author.

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
readback and rollback. Local artifacts remain unpublished candidates. Actual
source publication, producer integration, required final checks, publication
authorization, remote release/deployment readback, real TMS integration and the
original final independent acceptance remain pending.
