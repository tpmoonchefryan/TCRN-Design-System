# 4.1.0 local release candidate

The three library packages and companion `@tcrn/ds-consumer-tools` are unpublished
`4.1.0` local candidates. The pinned author source remains public Site v2, exact
commit `e76b7272d98c0359a57c42d49bf70d64e5b4c2ad`, published under
`minutes:024a8b72088fac0970916091#D2` with readback under
`minutes:59b6c4ee489ab487482ca51b#D1`.

`4.1.0` extends the `4.0.0` baseline without mutating the eight pinned Site v2
boards:

- `@tcrn/ui-tokens`: adds `--tcrn-color-warn-bg`, `--tcrn-color-ok-bg`,
  `--tcrn-brand-suffix-voxward`, and the opt-in `[data-tcrn-theme="halloween"]`
  seasonal layer (`@tcrn/ui-tokens/halloween.css`).
- `@tcrn/ui-react/approved` and `tcrnComponentCss`: adds the adopted `voxward`
  Option C brand mark, `ProductShell` right-hand backoffice navigation group
  (`align: "end"` with `1x16` divider, `external`, and `disabled` items),
  optional `topBanner` slot, opt-in seasonal theme cycling (`seasonalThemes`),
  and the promoted Feedback, DataDisplay, Layout, and Overlay component families.
- Storybook & AI rules: adds pure-package 3-theme specimens (`light`, `dark`,
  `halloween`), `ai/4.1.0/pattern/batch3-components-and-shell.json`, and
  `adopted-component` shards for all 29 promoted Batch 3 components.

Prior Owner visual decisions (`minutes:b34cc50d61d03ab4bb4e2b40#D1` at
`ca0c8c199cb394377f1b6328244d0c8d7efe8d8e` and `minutes:024a8b72088fac0970916091#D1`
at `69e37265d0f5bfa766cb6f97f85aa3d289fb9abc`) remain scoped to their recorded
commits. New `4.1.0` visual specimens require their own Owner visual review
before publication.

## Build, verify, and pack

Run from the repository root with pnpm `10.12.1` on Node 22+:

```sh
node scripts/with-build-trash.mjs pnpm verify
pnpm public-docs:vercel-build
pnpm pack:release-candidate --destination <new-absolute-directory>
```

Consumer installation and rollback follow the same verified archive and
`ai/4.1.0/index.json` lock workflow documented in
[4.0.0 release procedure](../4.0.0/README.md), substituting `4.1.0` for the
archive filenames and versioned `ai/4.1.0/` directory.
