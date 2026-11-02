# Current design input

The only current design source is the published [Sites standard](https://tcrn-ds-visual-standards.honestfawn3.chatgpt.site), version 1, source commit `a643d4cfcd239f6f81b1715ded6a63caead9d619`. `approved-site-v1/source-manifest.json` records the real Site project/version/deployment identities, eight sourceIds, original byte hashes and original provenance digest. The snapshot contains normative HTML/CSS, inert component declarations, the one deduplicated font-face stylesheet and its actual font files. Site React/DC runtime is excluded.

`package-bindings.json` describes engineering spellings for exact published properties and normative prose. `scripts/lib/approved-site-pins.mjs` independently pins the real source bytes and identities; neither a package registry nor a newly self-reported manifest grants source authority. `retired-content.json` is a removal/negative-regression inventory of 72 previous stories and 131 previous engineering API projections. It is never a render registry or a design input.

The old local boards, data modules, board builders, proof oracles and unpublished combination examples have left the current source tree. Git history and prior governance evidence retain their original facts. Current proof/generator outputs use `docs/verification/current-standard-only/`; previous verification evidence is not read as the new candidate's oracle.

## Batch-end source generation

The implementation package does not run these commands. The existing integration/verification responsibility executes them once after source integration, with an owned scratch `trash` directory supplied as `TCRN_BUILD_TRASH`:

1. `node scripts/contract-generate.mjs` — seven source sets, strictly from the pinned published source.
2. `node scripts/fonts-vendor.mjs` — original source font files, face/weight/Unicode mappings, CSS and the retained notices. No npm font bytes are substituted.
3. Compile the current `@tcrn/ui-tokens` and `@tcrn/ui-copy-state` dependencies, then `@tcrn/ui-react` in the existing dependency order. Retire stale generated `dist` files and incremental metadata through `scripts/prepare-output.mjs` before a dependency compilation; the helper accepts only declared generated roots and moves files into the owned trash directory.
4. `node scripts/tokens-sync.mjs` then `node scripts/demo-styles-sync.mjs` — `tokens.css` and `storybook.css`, using this batch's compiled modules.
5. Generate current engineering manifests through `pnpm internal-alpha:contracts`, then use the unchanged configured commands for the same candidate. No old 37-image or 119-obligation admission is reused or automatically accepted.

The static writer reconciles exact current output membership. Removed HTML/API pages, old bundles, fonts and copied assets are moved to the owned trash before fresh output is written. `pnpm clean` is now restricted to declared rebuildable output roots and never clears `docs/verification`.

K1/K5: direction decided; pending formal-standard amendment/publication and consumer-version alignment, decided by TCRN-DS-MIN-20261102-STANDARD-AMENDMENTS D1–D4. Published suffix colors and actual strong ink/600 stay current until the formal revision is published and the consumer version is aligned; no contrast exemption is granted. The separate S03-C01 clarification (06 shortcut ink-3 versus07 ink-2) is undecided. Current ink-2 follows07 and does not certify unamended06. K4 retains the formal pure-icon pin plus its item-specific accessible name under the Owner's decision; the formal prose has not been edited. The 20px toggle slot and 16px glyph are distinct; pin center coordinates are global Y26 and local Y20.
