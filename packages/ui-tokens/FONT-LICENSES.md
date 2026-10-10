# Font licensing

`@tcrn/ui-tokens` ships five open-licensed font families as WOFF2 files in `fonts/`,
an `@font-face` stylesheet at `@tcrn/ui-tokens/fonts.css`, and each family's licence
text in `licenses/`. Product pages load these files from the package instead of from
a font CDN: `fonts.googleapis.com` and `fonts.gstatic.com` are unreliable from mainland
China, so neither host may appear in the built packages or in the docs site.

Every font file is a byte-identical copy of a file published in a pinned upstream npm
package. This repository does not subset, rename or otherwise modify font software.
`fonts/manifest.json` records, for every file, the family, the axes or weight, the
unicode-range, the sha256 digest, the byte count, and the upstream package, version
and integrity. `scripts/fonts-vendor.mjs` writes `fonts/` and `licenses/` from the
installed packages; `pnpm fonts:proof` fails the build when a shipped file no longer
matches its recorded digest, when the stylesheet and the manifest disagree, when a
family lacks its licence text, when product text falls outside the shipped Chinese
slices, or when a font binary appears anywhere else in the tree.

## Shipped families

| Family | Role | Upstream package | Shipped files | Licence text |
| --- | --- | --- | --- | --- |
| Hanken Grotesk | UI text | `@fontsource-variable/hanken-grotesk@5.3.0` | variable (`wght`), latin and latin-ext | `licenses/hanken-grotesk-OFL.txt` |
| Source Serif 4 | headings and figures | `@fontsource-variable/source-serif-4@5.3.0` | variable (`opsz`, `wght`), latin and latin-ext | `licenses/source-serif-4-OFL.txt` |
| IBM Plex Mono | code and identifiers | `@fontsource/ibm-plex-mono@5.3.0` | static 400 and 500, latin and latin-ext | `licenses/ibm-plex-mono-OFL.txt` |
| Noto Sans SC | Chinese fallback for UI text | `@fontsource-variable/noto-sans-sc@5.3.0` | variable (`wght`), the slices that cover product text | `licenses/noto-sans-sc-OFL.txt` |
| Noto Serif SC | Chinese fallback for headings | `@fontsource-variable/noto-serif-sc@5.3.0` | variable (`wght`), the slices that cover product text | `licenses/noto-serif-sc-OFL.txt` |

All five packages declare the SIL Open Font License 1.1 (SPDX `OFL-1.1`). Each file in
`licenses/` is the upstream package's `LICENSE` file, copied unchanged; the font files'
embedded metadata is shipped untouched as well.

The Chinese families arrive pre-sliced upstream into unicode-range slices. The package
keeps every slice that contains at least one character of the product's Chinese text
(the zh-CN strings and the untagged strings of the packages and the docs, plus
the sample 季度复盘) and drops
the rest, so a browser downloads only the slices a page actually renders. Japanese
and Korean copy is not what these faces are sized for. When new Chinese copy needs a
character outside the shipped slices, `pnpm fonts:proof` names it; rerun
`node scripts/fonts-vendor.mjs` to add the slice.

## Using the fonts

```css
@import "@tcrn/ui-tokens/fonts.css";
```

Every face uses `font-display: swap` and a relative URL next to the stylesheet; no
face is inlined as a `data:` URI. A bundler that resolves package exports copies the
referenced files into its own output; those copies stay byte-identical to the
shipped files.

## If you redistribute these files

SIL OFL-1.1 asks three things that matter in practice:

1. Ship the licence text alongside the font files.
2. Do not sell the font software on its own.
3. Honour any Reserved Font Name. A modified build, including a further subset you
   cut yourself, must not carry a reserved name; check the licence file of the family
   before you modify it.

## Faces named by reference only

The token stacks may also name faces this package does not ship. Open-licensed ones
are bundleable by a consumer under the same terms as above. Proprietary system faces,
such as PingFang SC, Hiragino Sans, Apple SD Gothic Neo and Songti SC (Apple) or
Microsoft YaHei, Yu Gothic, Malgun Gothic and Meiryo (Microsoft), may appear only as
later system fallbacks: they are never shipped, and they never appear in a stack whose
name promises bundleability. `pnpm fonts:proof` enforces the latter.

## Why SF is absent

The SF family is licensed for use on Apple platforms. A cross-platform design system
that named it would be handing consumers a licence problem the moment they shipped to
the web or to Windows. This is one of the concrete reasons direction C (Apple-style
fluid materials, whose typography rests on SF) was not adopted wholesale: only its
motion physics entered the baseline, and motion curves are numeric facts that carry
no licence.
