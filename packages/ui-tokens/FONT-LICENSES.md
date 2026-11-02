# Font licensing and actual source bytes

The current font software is copied unchanged from the five font families actually used by the published Sites standard, source commit `a643d4cfcd239f6f81b1715ded6a63caead9d619`. It is not sourced from installed Fontsource packages. `fonts/manifest.json`, produced once by `scripts/fonts-vendor.mjs`, binds each original byte digest to every declared family, weight and Unicode range; `fonts/fonts.css` changes only local URL spellings.

The published source declares 545 face records and references 222 distinct WOFF2 files for Hanken Grotesk, Source Serif 4, IBM Plex Mono, Noto Sans SC and Noto Serif SC. All five are SIL Open Font License 1.1 families. No further subsetting, renaming of font software or new network fallback is performed. The declared `system-ui`, serif and monospace system fallbacks remain the published stack; actual cross-platform glyph coverage is a separate browser verification.

`licenses/approved-site-original-notice.txt` is copied byte-for-byte from the source's original bundled notice. The five individual family OFL/copyright notices already retained in `licenses/` are preserved as distribution licence texts; they are not evidence that an old npm font binary is the current source byte. Source-font metadata is unchanged. The original source notice contains the Hanken notice; the separately retained family notices preserve the other copyright obligations.

Redistribution must include the OFL text and copyright notices. Font software must not be sold by itself. A modified font must observe any Reserved Font Name. Repository code licensing does not replace the fonts' OFL terms.
