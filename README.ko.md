# TCRN Design System

현재 Storybook은 게시된 Sites 시각 표준 2판의 보드 8개만 사용합니다. 초안과 이전 Storybook 예제는 구현 입력이 아닙니다.

[Published visual standard](https://tcrn-ds-visual-standards.zbnubhmldz3270.chatgpt.site) · [Pinned source and mapping](docs/design/approved-site-v2/source-manifest.json) · [Source contract](docs/design/README.md)

Source commit: `e76b7272d98c0359a57c42d49bf70d64e5b4c2ad`. The public author Site is version 2; the four DS packages are unpublished 4.0.0 candidates. Owner adopted K1/K5/C01 under `minutes:6f3e0a9a1e07e3980867d82e#D1`; the exact source was published under `minutes:024a8b72088fac0970916091#D2` and read back under `minutes:59b6c4ee489ab487482ca51b#D1`. The source now carries the DS light suffix `#4b59be`, TMS dark suffix `#7aa0f5`, form shortcut ink-2, K5 ink/600 explanation, corrected solid-panel icon labels and Chinese-only menu-ratio wording. Thresholds remain text ≥4.5 and icon/edge ≥3. Historical v1 failures remain in their original evidence. The 28 formal entries, five built-in locales, native behavior and complete product-owned six-locale copy retain their existing scope. The S11 Owner visual decision covers commit `69e37265`; current integration checks, independent acceptance and DS production delivery are separate. Anonymous HTTP reads of the author Site returned Cloudflare 403; native source publication and the normal in-app browser readback are retained separately.

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
candidate. DS artifacts remain local and unpublished; the pinned author source v2 is public.
