# Current source-backed visual roles

The only visual standard is [published Sites version 1](https://tcrn-ds-visual-standards.honestfawn3.chatgpt.site), source commit `a643d4cfcd239f6f81b1715ded6a63caead9d619`. `docs/design/approved-site-v1` preserves original board bytes and font assets; `source-manifest.json` and independent source pins identify the actual publication. This page describes the package mapping. It is not an additional standard or a substitute oracle.

`node scripts/contract-generate.mjs` extracts the 39 theme values and 27 fixed values from 01's actual `.gp`/`.gp.night` rules, state pairs from 05/06, typography CSS from 02, SVG geometry from 03/04/07 and source-cell occurrences from all boards. `package-bindings.json` records exact selectors/properties or text anchors for engineering spellings. The generator rejects missing anchors. No old board, compatibility table or generated package registry supplies expected values.

| Role | Actual source | Package mapping |
| --- | --- | --- |
| Control, small, panel, checkbox radii | 01 `.gp` r-ctl/r-sm/r-panel/r-check | `--tcrn-radius-control/sm/panel/check` = 8/6/12/4px |
| Type families | 01 sans/serif/mono; 02 actual roles | Hanken Grotesk + Noto Sans SC; Source Serif 4 + Noto Serif SC; IBM Plex Mono |
| Headings | 02 h1/h2/h3/h4 | 36/40, 26/30, 20/26, 13/20; the first three serif 400 and the fourth sans 600 |
| Body/reading/meta/caption | 02 tx/read/meta/cap | 13/20, 14/22, 12/16, 11/16 |
| Action height/padding/icon | 01 h/pad/ico sm,md,lg; 05 | 28/32/40px; 10/12/16px; 14/16/20px |
| Fill/press/move/loop | 01 t-fill/t-press/t-move/t-loop | 120/80/240/900ms |
| Shell band/brand/toggle | 07a actual CSS; 07b F | 52px; brand 134×40 at (12,6); 20px toggle slot with a 16px glyph |
| Pin geometry | 07 actual CSS | 32px height, 8px gap, max six; global center Y26 / local Y20 in the 40px pins area |
| Full menu and cascade | 07 actual CSS | 952px three-column panel, 240px dropdown, 4px cascade gap, 6px menu gap |
| Intro | 07a C / 07b G | 120 + 240 + 100 = 460ms, upper bound 700ms; reduced motion shows the final shell directly |

Paper Tabs use the actual 1px ink underline in 07. Selected list/table rows use ink wash; menu rows, pins and their hover/open/selected states retain their own source roles. These carriers are checked separately.

The formal phone scene is 390px wide with 44px touch rows. The source does not establish the former 760px generic breakpoint; hosts needing an intermediate Sheet breakpoint must state it explicitly. The documented automatic compact band boundary remains below 1024px.

K1 (brand text contrast) and K5 (strong prose versus CSS/sample): direction decided; pending formal-standard amendment/publication and consumer-version alignment (TCRN-DS-MIN-20261102-STANDARD-AMENDMENTS D1–D4). Published v1 suffix values and actual strong ink/600 remain current; the decided future text roles are not consumed early. C01 is also decided (TCRN-DS-MIN-20261103-SHORTCUT-INK D1–D4): only06 shortcut text shares ink-2 day #4f4c43/night #a9a69c. All K1/K5/C01 directions await formal amendment/publication and consumer alignment; current ink-2 predates the answer and does not certify unamended06. Geometry, other ink/icon colors and the ≥4.5 text threshold remain. K4 follows the Owner's pure-icon decision with the actual accessible name. None of this changes the published Site.

Both documentation entry points consume `@tcrn/ui-react/approved` and the same package stylesheet. Other root engineering exports have no automatic Storybook route or current visual styles. Older scale tables, product samples, layout budgets, aliases and snapshot baselines remain historical records in Git or original verification evidence; they are not inputs to this implementation.
