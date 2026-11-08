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
5. Run `pnpm storybook:build` to compile the portal modules and write the static portal. The package-contract manifest imports `apps/storybook/dist/approved-api.js`, so package compilation alone is insufficient on a clean checkout.
6. Generate current engineering manifests through `pnpm internal-alpha:contracts`, then use the unchanged configured commands for the same candidate and build the official Manager through `pnpm storybook:manager-build`. No old 37-image or 119-obligation admission is reused or automatically accepted.

The static writer reconciles exact current output membership. Removed HTML/API pages, old bundles, fonts and copied assets are moved to the owned trash before fresh output is written. `pnpm clean` is now restricted to declared rebuildable output roots and never clears `docs/verification`.

K1/K5/C01 remain selected directions, visually unconfirmed and unapplied; the publication request is withdrawn (TCRN-DS-MIN-20261104-VISUAL-BEFORE-STANDARD D1–D4). Published v1 remains the sole baseline:06 form shortcut ink-3,07 menu/shell shortcut ink-2, published brand colors and actual strong ink/600. The form placeholder ink-2 and icon ink-3 keep their separate roles. Compare each implementation context with its own published selector; a06/07 difference alone is not a fidelity defect. K1 brand text and06 dark shortcut nominal contrast (3.876922 on wash/panel) remain unresolved conflicts with text ≥4.5. Correcting local fidelity does not waive that threshold or require importing an unconfirmed proposal into the formal standard. Machine verification, visual confirmation and publication permission remain separate. K4 retains pure-icon pins and item-specific accessible names without visible labels or tooltips. The 20px toggle slot and16px glyph are distinct; pin center coordinates remain global Y26/local Y20.

## Consumer support boundary

The current 28-entry catalogue remains the published component scope. The
[actual TMS customer-list mapping](../consumption/patterns/customer-list-support.md)
distinguishes those capabilities from the table/cards, business-state and
confirmation additions still requiring an upstream contract. The current candidate
supports an explicit product locale with complete product-owned shell copy,
including Traditional Chinese; the five built-in locales remain unchanged. That
engineering support does not record visual adoption, a sixth built-in locale or
production TMS consumption. The [shell interface description](../consumption/patterns/shell-preferences-and-navigation.md)
documents the existing pins callbacks and native Next navigation boundary;
engineering root exports do not become formal designs through that description.
