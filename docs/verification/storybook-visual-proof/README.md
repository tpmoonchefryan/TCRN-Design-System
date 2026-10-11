# Storybook Visual Proof

## Current: G+ canvas map gate (`gplus-map-report.*`)

`scripts/storybook-visual-proof.mjs` (`pnpm storybook:visual-proof`) reads the canvas board to story map
`docs/design/gplus-2026-10/storybook-map.json` (human view: `storybook-map.md`), reconciles it with the G+
story list (missing or extra stories are red), checks that every canvas board and lettered section has a
map entry, and measures every map row on the static docs (Track B) with the eight G+ measurements plus the
overlap check from `scripts/lib/gplus-measure.mjs`, using the thresholds of
`scripts/geometry-measure-proof.mjs`. Run it from the repository root after `pnpm build`; with
`--write-report` it writes, in this directory:

- `gplus-map-report.json` — the full report (UTC time, HEAD, scope, reconciliation, one row per map row
  and theme, mutations);
- `gplus-map-report.md` — the same per row, for reading.

Screenshots are for eyes only and are never compared pixel by pixel, so the gate takes none. It is not
part of `pnpm verify` until it is wired in.

## History: exact-PNG baseline (retired)

> **RETIRED (pre-INIT-001 history).** This directory is the legacy `canonicalized_raw_png_exact_v1`
> exact-PNG visual baseline (source head `ec57b606`, 134 screenshots). It was **superseded on
> 2026-07-23 by TCRN-DS-STORY-041 (INIT-007)** with the internal-alpha perceptual
> **visual-signature** baseline (`docs/verification/internal-alpha/visual-signature-baseline.json`,
> tolerance `meanAbsolute<=2` / `maxCell<=8`, enforced by `scripts/internal-alpha-browser-proof.mjs`
> via `pnpm internal-alpha:proof`). Per the INIT-002 ruling, an unreproducible exact-PNG signature
> is not signed in as an oracle.
>
> These bytes are retained as **history only** and are **not part of `pnpm verify`**. The script
> `scripts/storybook-visual-proof.mjs` no longer regenerates this receipt: since 2026-10-11 it is the
> G+ canvas map gate described above, which writes only the two `gplus-map-report.*` files.
> The files are still read by the privacy / no-overclaim scans, which is why the
> directory is kept rather than deleted. The metrics below reflect the retired baseline and are not
> a current freshness claim.

---

Mode: `check`
OK: `true`
Comparison contract: `canonicalized_raw_png_exact_v1`
Visual artifact contract: `canonicalized_raw_png_sha256_exact_required`
Source head: `ec57b606f0cd43e577861515fb5f1736c7548c29`
Oracle recovery: `true`
Static pages: 11
Screenshots: 134
Compare failures: 0

## No-Overclaim

- localVisualProofDisposition: local_static_contract_docs_only
- themeModeVisualCoverageDisposition: bounded_light_and_dark_static_docs_shell_only
- hostedVisualSaasDisposition: deferred_not_admitted
- ciGateDisposition: not_admitted
- storybookDocsPublicationDisposition: not_published
- packagePublicationDisposition: not_published
- consumerAdoptionDisposition: not_claimed
- releaseReadinessDisposition: not_claimed
- acceptanceStateDisposition: not_mutated
- componentLocalStoryGateDisposition: not_admitted

## Deferred

- hosted_visual_saas
- ci_gate_admission
- public_hosted_snapshots
- package_publication
- storybook_docs_publication
- aos_or_tms_adoption
- release_readiness
- acceptance_state_movement
- component_local_story_gate
- internal_overlay_lab_visual_coverage
- dialog_popover_drawer_search_interaction_visual_states
- all_36_story_visual_matrix
- cross_browser_visual_proof
