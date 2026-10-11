# @tcrn/ui-tokens

Semantic design tokens for TCRN UI surfaces. CSS variables are the canonical
runtime contract; generated framework adapters are deferred.

Version `4.0.0` is prepared under Apache License 2.0 as part of the accepted
TCRN Design System public package baseline.

## Theme contract

Light mode is the default `:root` token set. Dark mode is an override applied
with `data-tcrn-theme="dark"` on a root or scoped container.

Dark mode may override existing semantic tokens only. It must not create
component-specific colors or separate component forks.

## Stylesheet and fonts

- `@tcrn/ui-tokens/tokens.css` begins with `@import "../fonts/fonts.css";`, so a
  bundler that follows CSS imports loads the fonts together with the tokens.
- The JS export `tcrnTokenCss` is the token text without that `@import`. A page
  that injects `tcrnTokenCss` loads the fonts itself: import
  `@tcrn/ui-tokens/fonts.css` once at the application shell.
- `@tcrn/ui-tokens/fonts.css` declares five families with `@font-face` over the
  WOFF2 files in `fonts/` (also exported as `@tcrn/ui-tokens/fonts/*`): Hanken
  Grotesk, Source Serif 4, IBM Plex Mono, Noto Sans SC and Noto Serif SC. The files
  are served from the package; no font CDN is involved.
- All five families are under the SIL Open Font License 1.1. `FONT-LICENSES.md` in
  this package lists each family with its upstream package and files, and
  `licenses/` holds each licence text. Keep those files with the fonts when you
  redistribute them.

## Token blocks

`tokens.css` and `tcrnTokenCss` hold three blocks, each opening with a marker
comment:

- a `:root` theme block (`/* tcrn-token-block: theme */`): colour, shadow, focus
  ring, and the deprecated colour, selection and elevation aliases;
- a `:root` theme-independent block (`/* tcrn-token-block: theme-independent */`):
  type, radius, control height and padding, icon size, motion, the brand suffix
  colours, and the deprecated type family and motion aliases;
- a `[data-tcrn-theme="dark"]` block (`/* tcrn-token-block: theme */`): the same
  property names as the light theme block, with the night values.

`compareTokenThemeBlocks(css)` checks that the two theme blocks declare the same
names and that neither shares a name with the theme-independent block;
`parseTokenCssBlocks(css)` returns the declarations of each block.

The focus ring is computed where it is declared. A container that changes
`--tcrn-color-surface` (for example to the panel colour) declares
`--tcrn-focus-ring` again, so the ring's gap follows the new surface.

## Deprecated names

Version 4.0.0 renames the colour, elevation, selection, motion easing and type
family tokens. Every old name stays defined as `--old: var(--new)`, so an existing
stylesheet keeps resolving to the new value; move to the new names before the
aliases are removed. `tcrnDeprecatedTokenAliases` maps each old name to its new
name, and `tcrnDeprecatedTokens` also lists `--tcrn-motion-press-scale`, which has
no successor. The full table is in `docs/migration-4.0.md` in the TCRN Design System
repository.

There are two ways to list the old names a codebase still uses:

- In code: `formatDeprecatedTokenNotices(findDeprecatedTokenUsages(source))`
  returns one line per old name found in `source`. It counts every occurrence in
  the text, a declaration of the old name included.
- From a TCRN Design System checkout, after `@tcrn/ui-tokens` is built:
  `node scripts/token-deprecation-notice.mjs [--label <name>] <file-or-directory>...`
  walks the given paths (give absolute paths for files outside the checkout),
  skips token blocks marked `tcrn-token-block` and copied alias declarations, adds
  a note where an old name is set to a value, and exits 0 whatever it finds (2 for
  a missing argument or path). The Storybook build runs it once over its own
  sources.
