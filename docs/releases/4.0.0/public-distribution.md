# Public delivery of the 4.0.0 candidate

This is a preparation procedure, not a publication receipt. The selected targets
are the public `tpmoonchefryan/TCRN-Design-System` GitHub repository and existing
Vercel project `tcrn-platform/tcrn-design-system-storybook`, whose current home is
<https://tcrn-design-system-storybook.vercel.app/>. The real Vercel project ID,
complete dashboard settings and final candidate deployment are unverified.
Historical Vercel success does not verify this build. No account or project is
created by the scripts or workflow in this change.

## Build one documentation output

Run the repository's pnpm 10.12.1 on Node 24. Resolve the temporary trash directory
from the checkout before running scripts. Existing generated outputs are reconciled
through that directory under the normal repository contract.

```sh
export TCRN_BUILD_TRASH="$(mktemp -d "${TMPDIR:-/tmp}/trash-ds-build.XXXXXX")"
corepack pnpm@10.12.1 install --frozen-lockfile
corepack pnpm@10.12.1 public-docs:vercel-build
corepack pnpm@10.12.1 pack:release-candidate --destination <new-absolute-directory>
```

`vercel.json` selects that command and `apps/storybook/distribution-static`.
The portal owns `/`; the official Manager owns `/storybook/`, including
`/storybook/iframe.html` and its own relative assets and fonts. The portal's
Storybook link opens that route. There is no SPA fallback that would disguise
missing JSON or assets as a successful HTML response. The combined output keeps:

| Entry | Purpose |
| --- | --- |
| `/`, `/en/index.html`, other existing locale pages | Custom portal and standards |
| `/storybook/`, `/storybook/iframe.html`, `/storybook/index.json` | Official Manager, preview, CSF index |
| `/ai/index.json`, `/ai/4.0.0/index.json` | Current and versioned AI index from one rule bundle |
| `/ai/4.0.0/global.json` and index-listed rule paths | Global and task-required rules |
| `/llms.txt`, `/ai-consumption-contract.json` | Human/agent navigation and full compatibility contract |
| `/design-authority.json` | Published standard and candidate identity, separately labelled |
| `/distribution-manifest.json` | Same candidate/identity and hashes of both outputs |

The merger copies actual builds into disjoint directories, checks identity and
required files, and records every output hash. `output-manifest.json` still owns
the portal's exact inventory; `distribution-manifest.json` owns the combined one.
Its `publication` remains `local-candidate-only`: deploying a candidate does not
make the old standard pin conform to the adopted unpublished revision. Production
identity must be read from the actual final deployed build after source integration.
No unobserved deployment URL is written into identity.

Vercel documents that repository `buildCommand` and `outputDirectory` override
their dashboard values in [static configuration](https://vercel.com/docs/project-configuration/vercel-json).
The root directory and Git linkage still need real readback before publication.
Storybook's [asset guidance](https://storybook.js.org/docs/configure/integration/images-and-assets)
explains relative asset paths when deploying beneath a subpath; this build uses
relative preview fonts and Vite base, then exercises the real `/storybook/` output.
The installed Storybook version stays 10.4.6; this change upgrades no dependency.

## Four archives and verified download installation

`pack:release-candidate` requires the current combined build. It packs the three
library packages through their existing pnpm prepack chain, packs the existing
consumer CLI, and retains four root `.tgz` files plus `SHA256SUMS` and
`release-manifest.json`. The manifest records the exact source commit/dirty status,
candidate identity, docs manifest hash, archive bytes/hashes and planned URLs.
It checks that every internal `@tcrn` dependency resolves to a member at the exact
same version. It never creates a tag, pushes, uploads or creates a Release.

Planned URLs below are unavailable until a real Release publishes those assets:

```text
https://github.com/tpmoonchefryan/TCRN-Design-System/releases/download/v4.0.0/tcrn-ui-tokens-4.0.0.tgz
https://github.com/tpmoonchefryan/TCRN-Design-System/releases/download/v4.0.0/tcrn-ui-copy-state-4.0.0.tgz
https://github.com/tpmoonchefryan/TCRN-Design-System/releases/download/v4.0.0/tcrn-ui-react-4.0.0.tgz
https://github.com/tpmoonchefryan/TCRN-Design-System/releases/download/v4.0.0/tcrn-ds-consumer-tools-4.0.0.tgz
```

The existing TMS uses Node `>=24 <25`, pnpm 11.3.0, workspace declarations in
`pnpm-workspace.yaml`, web dependencies in `apps/web/package.json`, and root
tool dependencies in `package.json`. It does not yet depend on these DS packages.
The following edits describe its future authorized integration; preparation does
not edit or install into the real TMS.

The actual pnpm 11.3.0 probe rejected direct HTTP archive overrides with
`ERR_PNPM_EXOTIC_SUBDEP`: `blockExoticSubdeps` is enabled by default. Keep that
protection. Use the Release URLs to download the four archives, verify their
hashes, and retain them inside the consumer checkout before normal pnpm install.
pnpm's [source policy](https://pnpm.io/settings/dependency-resolution#blockexoticsubdeps)
accepts local file archives without weakening that setting. This is a verified
download-and-install flow; direct transitive URL installation is not claimed.

Run the downloads from the consumer workspace root after actual publication:

```sh
release_base=https://github.com/tpmoonchefryan/TCRN-Design-System/releases/download/v4.0.0
mkdir -p vendor/tcrn-ds
mkdir vendor/tcrn-ds/4.0.0
curl --fail --location "$release_base/SHA256SUMS" -o vendor/tcrn-ds/4.0.0/SHA256SUMS
curl --fail --location "$release_base/release-manifest.json" -o vendor/tcrn-ds/4.0.0/release-manifest.json
for archive in tcrn-ui-tokens-4.0.0.tgz tcrn-ui-copy-state-4.0.0.tgz tcrn-ui-react-4.0.0.tgz tcrn-ds-consumer-tools-4.0.0.tgz; do
  curl --fail --location "$release_base/$archive" -o "vendor/tcrn-ds/4.0.0/$archive"
done
(cd vendor/tcrn-ds/4.0.0 && shasum -a 256 -c SHA256SUMS)
```

The version directory must be new; never overwrite a retained archive set.
Review the manifest/source identity before installing. Add exact `"4.0.0"`
declarations for the three UI libraries to `apps/web/package.json` and the tool
to the root `devDependencies`. The normal consumer checker requires those exact
version declarations. Merge these exact selectors into the existing root
`pnpm-workspace.yaml` `overrides` map, preserving its existing entries:

```yaml
overrides:
  '@tcrn/ui-tokens@4.0.0': file:./vendor/tcrn-ds/4.0.0/tcrn-ui-tokens-4.0.0.tgz
  '@tcrn/ui-copy-state@4.0.0': file:./vendor/tcrn-ds/4.0.0/tcrn-ui-copy-state-4.0.0.tgz
  '@tcrn/ui-react@4.0.0': file:./vendor/tcrn-ds/4.0.0/tcrn-ui-react-4.0.0.tgz
  '@tcrn/ds-consumer-tools@4.0.0': file:./vendor/tcrn-ds/4.0.0/tcrn-ds-consumer-tools-4.0.0.tgz
```

These overrides matter: the packed React library declares exact `4.0.0` internal
dependencies, which otherwise ask the npm registry for unpublished scope members.
Direct URL declarations do not bypass pnpm's transitive source policy or satisfy
the checker's exact version declaration contract.
Run normal `corepack pnpm@11.3.0 install`, retain the updated lock, inspect every
`@tcrn` resolution for the four retained archives and recorded integrity, then run
`corepack pnpm@11.3.0 install --frozen-lockfile` from a fresh checkout. Existing
`@tcrn/shared`/database workspace members remain workspace dependencies and are
not matched by these exact selectors. Keep the archives with the application
release, making their relative paths available to fresh CI checkouts. A local HTTP
fixture proves downloading/verifying/installing these bytes only; it does not
prove GitHub reachability or real TMS use.

Before installing, download the published `SHA256SUMS`, `release-manifest.json` and
four archives into a new retained directory using fail-on-HTTP-error downloads.
Check `shasum -a 256 -c SHA256SUMS`, compare the manifest's source/identity with the
actual deployed `/design-authority.json` and `/distribution-manifest.json`, and
confirm the Release tag points to that exact final source commit. Download and
check the versioned AI tree using the index's source and shard hashes, preserving
its `ai/4.0.0/` hierarchy, and pin the complete identity in `.tcrn-ds.json`.
Then run the installed CLI as described in the [release overview](README.md).
Do not run `npm install @tcrn/ui-react@4.0.0`: no npm publication is selected.

## Publication sequence and actual readback

1. Publish the adopted author source through its approved source process; read
   back the real source version, commit and bytes. The existing integration owner
   then updates the source pin, generates producer outputs and runs the final
   required checks. The present preparation deliberately does not perform these.
2. Review that final source diff and release candidate, then obtain the applicable
   push/deployment/publication authorization. Read existing remote tags and
   Releases again. If `v4.0.0` exists, stop that release path for a version decision;
   never force-update a tag, replace assets or invent a new version.
3. Push the authorized exact source through the existing repository process.
   The connected Vercel project may auto-build on that push. Allow for that
   external deployment before authorizing the push; do not create a second
   project. CI `verify` must pass on the exact source. The manual
   `prepare release candidate` workflow also runs `pnpm verify`, builds the
   combined docs and retains candidate artifacts with read-only repository
   permissions. It has no Release or deployment step. No workflow has run here.
4. Read the actual Vercel build's source SHA, status, output and immutable URL
   from the existing project. Fetch root portal, locale page, Manager/preview,
   global/versioned AI index, required rules, llms and both identities; verify
   status/content types, actual browser rendering and matching source/identity.
   Record the public home separately from the immutable deployment URL. A home
   HTTP 200 alone is insufficient. If CI or Vercel fails, do not publish packages.
5. Retain the exact CI candidate artifacts, SHA256SUMS and manifest. Through the
   separately authorized release action, create tag `v4.0.0` at that exact source
   commit and publish a GitHub Release containing those four existing archives
   and both metadata files. Use a new tag/Release only after the conflict read.
   Do not silently rebuild or replace package bytes during upload.
6. Read back the tag's peeled commit, Release state and asset names/sizes. Fetch
   all four **actual GitHub download URLs**, compare SHA-256 with retained
   artifacts, perform the normal pnpm 11.3.0 installation from a fresh consumer
   using those verified downloads and file overrides, retaining the lock/integrity. This
   actual-network check remains necessary even after the local URL test passes.
   Recheck deployed identity against the release manifest. Only then is producer
   delivery evidence available for the real TMS integration. Its behavior and
   original final independent acceptance remain separate responsibilities.

## Upgrade and rollback

For an upgrade, save the current consumer commit, manifests, workspace override
map, lock, exact archives, AI tree/identity and deployed application revision.
Change all four retained archives/overrides and AI identity together, install, verify hashes,
run types, the installed checker and affected application/browser checks, then
use the authorized application deployment path. Actual download URLs, lock
integrity and retained SHA-256 identify the bytes; the version label alone does not.

For rollback, restore that saved consumer commit's manifests/overrides/lock and
matching AI tree, run pnpm 11.3.0 with `--frozen-lockfile`, and run the affected
checks before restoring the approved application revision. Keep the four
archives accessible; do not delete or mutate the Release as a rollback action.
The present test can prove reinstalling this candidate, not an unrecorded prior
production baseline. If there is no verified prior package baseline, retain the
pre-adoption application revision and restore that application instead.

For docs, use the existing project's separately authorized rollback to a retained
previous immutable Vercel deployment and read back every entry/identity again.
Mark consumers requiring the new producer version as blocked while it is absent.
Do not label the historical portal as matching this candidate. A code revert and
normal auto-build is another authorized route, requiring its own CI and deployed
readback. Source-standard rollback and TMS preference/data rollback keep their
own decisions; no database deletion is part of this procedure.
