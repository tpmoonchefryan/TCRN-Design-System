# Current design input

The only current design source is the published [Sites standard](https://tcrn-ds-visual-standards.zbnubhmldz3270.chatgpt.site), version 2, source commit `e76b7272d98c0359a57c42d49bf70d64e5b4c2ad`. `approved-site-v2/source-manifest.json` records the real Site project/version/deployment identities, eight sourceIds, original byte hashes and original provenance digest. The snapshot contains normative HTML/CSS, inert component declarations, the one deduplicated font-face stylesheet and its actual font files. Site React/DC runtime is excluded.

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

Owner adopted K1/K5/C01 under `minutes:6f3e0a9a1e07e3980867d82e#D1`. The exact e76 author source is now published as Site version 2 under `minutes:024a8b72088fac0970916091#D2`, with successful native deployment and normal browser readback recorded in `minutes:59b6c4ee489ab487482ca51b#D1`. The current snapshot imports those exact committed bytes. The original document provenance digest is unchanged; it identifies the ancestral document, not a hash of the amended v2 snapshot.

V2 carries DS light suffix `#4b59be`, TMS dark suffix `#7aa0f5`, form shortcut ink-2 and K5 wording matching the existing ink/600 CSS. Suffix text bindings come from the themed lockup examples, independently of the unchanged SVG palette. The 39 themed and 27 fixed base values, structural bindings, formal component membership and font bytes are unchanged. The 03 icon labels now describe their actual solid panel carriers. The 07b dropdown remains 240px and fixed items retain each language's natural width; only the Chinese example uses the 3–4 ratio assertion. Text ≥4.5 and icon/edge ≥3 remain unchanged. V1 failures and the source hold remain historical evidence in the retained prior candidate, not current results. Anonymous direct HTTP reads returned Cloudflare 403; native publication evidence and successful normal browser readback do not claim that read method passed.

DS packages, portal, Storybook, AI outputs and Vercel delivery remain local candidates. Source publication, machine verification, Owner visual acceptance and DS release authorization are separate. K4 retains pure-icon pins and item-specific accessible names without visible labels or tooltips. The 20px toggle slot and 16px glyph are distinct; pin center coordinates remain global Y26/local Y20.

## Consumer support boundary

The current 28-entry catalogue remains the published component scope. The
[actual TMS customer-list mapping](../consumption/patterns/customer-list-support.md)
records the Owner-adopted table/cards, pagination, five business states and
confirmation support under `minutes:6f3e0a9a1e07e3980867d82e#D2`, awaiting formal
producer publication. The same decision adopts complete explicit product-owned
Traditional Chinese shell copy. This extends support for the existing shell;
the 28 formal entries and five built-in locales remain unchanged. Owner adoption
and the local implementation do not establish production TMS consumption. The [shell interface description](../consumption/patterns/shell-preferences-and-navigation.md)
documents the existing pins callbacks and native Next navigation boundary;
engineering root exports do not become formal designs through that description.
