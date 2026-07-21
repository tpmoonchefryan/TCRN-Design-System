# Font licensing position

`@tcrn/ui-tokens` ships **font stacks, not fonts**. No font binary is included in
this package or in any published artifact of this repository; every face below is
referenced by family name and resolved by the consumer's system or by a webfont the
consumer chooses to serve. `pnpm fonts:proof` enforces this — it fails the build if
a font binary appears anywhere in the tree.

That distinction is what keeps the licensing simple: naming a family in a CSS
`font-family` list is not distribution, so no font licence obligation is triggered
by this package as published. The table records what *would* apply if a consumer
chooses to self-host, because that decision is theirs to make and they should not
have to re-derive it.

## Faces named in the token stacks

| Face | Token stack | Licence | Bundleable by a consumer? |
| --- | --- | --- | --- |
| Inter | `--tcrn-type-family-ui`, `--tcrn-type-family-distributable-latin` | SIL OFL-1.1 | Yes |
| Source Serif 4 | `--tcrn-type-family-stamp`, `--tcrn-type-family-distributable-stamp-latin` | SIL OFL-1.1 | Yes |
| Noto Sans CJK SC/JP/KR | `--tcrn-type-family-distributable-zh-cn` / `-ja` / `-ko` | SIL OFL-1.1 | Yes |
| Noto Serif CJK SC | `--tcrn-type-family-distributable-stamp-zh-cn` | SIL OFL-1.1 | Yes |
| Liberation Mono | `--tcrn-type-family-distributable-mono` | SIL OFL-1.1 | Yes |
| PingFang SC, Hiragino Sans, Apple SD Gothic Neo, Songti SC | `--tcrn-type-family-zh-cn` / `-ja` / `-ko`, `--tcrn-type-family-stamp` (fallback) | Apple proprietary | **No** — system reference only |
| Microsoft YaHei, Yu Gothic, Malgun Gothic, Meiryo | platform fallbacks in the same stacks | Microsoft proprietary | **No** — system reference only |
| SF Pro / SF family | *not referenced* | Apple proprietary, licensed for Apple platforms only | **No** — deliberately absent |

The proprietary faces appear only as later entries in a stack whose earlier entries
are open-licensed, so a consumer who bundles the distributable set never depends on
them; they exist to give macOS and Windows readers their native rendering.

## If you self-host an OFL face

SIL OFL-1.1 asks three things that matter in practice:

1. Ship the licence text alongside the font files.
2. Do not sell the font software on its own.
3. Honour the Reserved Font Name. Source Serif and Noto both reserve their names, so
   a subset or otherwise modified build must be renamed before you redistribute it.
   Subsetting for the web counts as modification.

## Why SF is absent

The SF family is licensed for use on Apple platforms. A cross-platform design system
that named it would be handing consumers a licence problem the moment they shipped to
the web or to Windows. This is one of the concrete reasons direction C (Apple-style
fluid materials, whose typography rests on SF) was not adopted wholesale — only its
motion physics entered the baseline, and motion curves are numeric facts that carry
no licence.
