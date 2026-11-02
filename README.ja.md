# TCRN Design System

現在の Storybook は公開済み Sites 視覚標準第1版の8枚のボードだけを採用します。草稿と退役済みの Storybook の例は実装の入力ではありません。

[Published visual standard](https://tcrn-ds-visual-standards.honestfawn3.chatgpt.site) · [Pinned source and mapping](docs/design/approved-site-v1/source-manifest.json) · [Source contract](docs/design/README.md)

Source commit: `a643d4cfcd239f6f81b1715ded6a63caead9d619`. The source Site is version 1; `@tcrn/ui-react` and `@tcrn/ui-tokens` are package candidates at 4.0.0. These are distinct version identities. K1 (suffix text contrast) and K5 (strong wording): direction decided; pending formal-standard amendment/publication and consumer-version alignment (TCRN-DS-MIN-20261102-STANDARD-AMENDMENTS D1–D4). Published v1 values remain current. C01 is also decided by TCRN-DS-MIN-20261103-SHORTCUT-INK D1–D4: only06 shortcut text will share ink-2 (day #4f4c43 / night #a9a69c). All K1/K5/C01 directions await formal amendment/publication and consumer alignment. Current ink-2 predates this decision and cannot establish unchanged06 conformity; geometry, other text/icon colors and text ≥4.5 remain unchanged. Machine results and Owner visual acceptance are recorded separately.

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
