# TCRN Design System

Le Storybook actuel utilise uniquement les huit planches de la norme visuelle Sites publiée, version 1. Les brouillons et les anciens exemples Storybook ne sont pas des sources d’implémentation.

[Published visual standard](https://tcrn-ds-visual-standards.honestfawn3.chatgpt.site) · [Pinned source and mapping](docs/design/approved-site-v1/source-manifest.json) · [Source contract](docs/design/README.md)

Source commit: `a643d4cfcd239f6f81b1715ded6a63caead9d619`. The source Site is version 1; `@tcrn/ui-react` and `@tcrn/ui-tokens` are package candidates at 4.0.0. These are distinct version identities. Current06 form shortcut text follows published ink-3;07 menu/shell shortcut text follows its own ink-2. The form placeholder remains ink-2 and its icon ink-3. Published brand colors and actual strong ink/600 remain the implementation baseline. K1 brand text and06 dark shortcut nominal contrast still conflict with the existing ≥4.5 requirement; source fidelity and threshold compliance are separate. Owner adopted the K1/K5/C01 visual revision and the customer-list support composition under `minutes:6f3e0a9a1e07e3980867d82e#D1-D2`. The author-source revision `e76b7272d98c0359a57c42d49bf70d64e5b4c2ad` remains local: Owner deferred its publication under `minutes:00710c786ec8423e5dce0186#D1-D2`. The pinned v1 still contains its seven contrast failures, icon panel contrast labels and menu width wording; local adoption does not refresh that pin or publish the 4.0.0 producer. The formal catalogue remains 28 entries and five built-in locales; complete explicit product copy preserves all six TMS locale ids. Final package verification, independent acceptance and production delivery remain pending.

## Packages

- `@tcrn/ui-react/approved`: the explicit current Storybook consumption boundary for the published families and top-band shell.
- `@tcrn/ui-react`: engineering exports; the existence of an API does not publish a visual standard or an API reference in Storybook.
- `@tcrn/ui-tokens`: source-mapped values, current CSS and the actual five-family font assets of the published source.
- `@tcrn/ui-copy-state`: engineering localization and state helpers.

The product assets are TCRN TMS, Einzbern, Mana Orchestrate and TCRN Design System. A registered product key is required. There is no mother-mark default, free-text lockup suffix or implied AOS mark.

## Development

Use the pinned `pnpm@10.12.1` toolchain. The configured commands remain `pnpm verify`, `pnpm storybook:build`, and `pnpm test:dom`, in their configured order. Source generation is a batch-end responsibility; follow [the source-generation order](docs/design/README.md) before compiling a changed source snapshot. No old screenshot baseline is automatically accepted.

The static docs and manager consume the same eight-board registry. The docs produce five locales; API reference entries are the explicit published E-section obligations, rather than all engineering exports. Fonts are self-hosted and preserve their original bytes, face weights, Unicode ranges and OFL notices; see [font licensing](packages/ui-tokens/FONT-LICENSES.md).

## Licensing

Repository code: Apache-2.0, see [LICENSE](LICENSE). Font software retains SIL OFL 1.1 and its copyright notices. Product marks are TCRN assets; source lineage is recorded independently from code licensing.

Packaged 4.0.0 candidate tools, independent installation, and upgrade/rollback:
[release candidate guide](docs/releases/4.0.0/README.md). The installed tool entry
in that guide supersedes the source-only checker invocation for this packaged
candidate. All artifacts remain local and unpublished.
