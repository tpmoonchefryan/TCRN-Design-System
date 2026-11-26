# 4.2.0 local release candidate

The three library packages and companion `@tcrn/ds-consumer-tools` are unpublished
`4.2.0` local candidates. The pinned author source remains public Site v2, exact
commit `e76b7272d98c0359a57c42d49bf70d64e5b4c2ad`, published under
`minutes:024a8b72088fac0970916091#D2` with readback under
`minutes:59b6c4ee489ab487482ca51b#D1`.

`4.2.0` extends `4.1.0` without mutating the eight pinned Site v2 boards:

- `@tcrn/ui-react/approved` and `tcrnComponentCss`: adds `ShellThemeMenu`
  dropdown theme selection, `ProductShellProps.themeControl` (`"auto"` /
  `"toggle"` / `"menu"`), an explicit `用户偏好` preferences group inside the
  avatar menu (`ProductShell`), and browser-portaled `.tcrn-dialog-backdrop`
  viewport centering for `Dialog` / `ConfirmActionDialog`.
- `@tcrn/ui-tokens`, `@tcrn/ui-react/approved`, and Storybook: adds
  `--tcrn-brand-suffix-platform`, registers the `platform` (`TCRN Platform`)
  mother mark across all four renditions and five locales, adds `BrandIcon`
  (`github`), and adds `PublicSiteHeader`, `PublicSiteFooter`,
  `EditorialArticle`, and `EditorialNote` with `brand-platform` and
  `public-site` documentation pages and `ai/4.2.0/` contract shards.
- All `4.1.0` Batch 3 component families, VoxWard brand mark, right-hand
  backoffice navigation group, `topBanner`, and seasonal Halloween tokens remain
  present.

Prior Owner visual decisions (`minutes:b34cc50d61d03ab4bb4e2b40#D1` at
`ca0c8c199cb394377f1b6328244d0c8d7efe8d8e` and `minutes:024a8b72088fac0970916091#D1`
at `69e37265d0f5bfa766cbf97f85aa3d289fb9abc`) remain scoped to their recorded
commits. New `4.2.0` visual specimens remain local candidates until Owner review.

## Build, verify, and pack

Run from the repository root with pnpm `10.12.1` on Node 22+:

```sh
node scripts/with-build-trash.mjs pnpm verify
pnpm public-docs:vercel-build
pnpm pack:release-candidate --destination <new-absolute-directory>
```

Consumer installation and rollback follow the same verified archive and
`ai/4.2.0/index.json` lock workflow documented in
[4.0.0 release procedure](../4.0.0/README.md), substituting `4.2.0` for the
archive filenames and versioned `ai/4.2.0/` directory.
