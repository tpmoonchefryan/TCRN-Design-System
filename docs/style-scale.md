# TCRN style scale (radius, spacing, type)

The single source of truth for every visual scale is `packages/ui-tokens/src/index.ts`.
`tokens-sync` regenerates `packages/ui-tokens/src/tokens.css` and the `storybook.css`
`:root` block from it; `createCssVariables()` emits the same tokens into the deployed
docs page. New styles take values from this table — never a raw literal.

## Radius hierarchy

| Role | Token | Value |
|---|---|---|
| Navigation / left indicators | *(none — flat)* | `0` |
| Controls (button, input, chip, toggle) | `--tcrn-radius-control` | `4px` |
| Cards / story containers / framed surfaces | `--tcrn-radius-surface` | `6px` |
| Panels | `--tcrn-radius-panel` | `6px` (alias of surface — kept as a distinct name) |
| Badges / pills / abbreviation dots | `--tcrn-radius-pill` | `999px` |

- The navigation's flat corners (INIT-005) are deliberate and must not regress.
- `state-chip-radius` was retired into `--tcrn-radius-control` (both `4px`).
- `--tcrn-radius-pill` was a dangling token (referenced, never defined, rendering
  square corners) until INIT-006 E4 defined it.

## Spacing scale

A 2px grid from 2px to 20px, plus one large-region step. Half-steps carry an `h`
suffix. Gap and padding values come from this scale.

| Token | Value | | Token | Value |
|---|---|---|---|---|
| `--tcrn-space-0h` | `2px` | | `--tcrn-space-3` | `12px` |
| `--tcrn-space-1` | `4px` | | `--tcrn-space-3h` | `14px` |
| `--tcrn-space-1h` | `6px` | | `--tcrn-space-4` | `16px` |
| `--tcrn-space-2` | `8px` | | `--tcrn-space-4h` | `18px` |
| `--tcrn-space-2h` | `10px` | | `--tcrn-space-5` | `20px` |
| | | | `--tcrn-space-6` | `32px` |

- Odd strays round to the nearest step, ties downward: `3→2`, `5→4`, `7→6`, `9→8`,
  `11→10`.
- Responsive `clamp()` upper bounds (e.g. `clamp(var(--tcrn-space-4h), 1.8vw, 28px)`)
  are fluid layout maxes, not discrete spacing steps; they stay literal and the style
  gate does not treat values inside `clamp()`/`calc()` as spacing literals.

## Type scale

| Token | Value | Role |
|---|---|---|
| `--tcrn-type-size-caption` | `11px` | caption / metadata |
| `--tcrn-type-size-meta` | `12px` | dense metadata: counts, badges, tool labels |
| `--tcrn-type-size-ui` / `-body` / `-control` | `13px` | dense UI / body / control text |
| `--tcrn-type-size-reading` | `14px` | readable prose |
| `--tcrn-type-size-heading-3` | `16px` | h3 |
| `--tcrn-type-size-section` | `18px` | section / story heading |
| `--tcrn-type-size-heading-2` | `22px` | h2 |
| `--tcrn-type-size-page` | `28px` | page title |
| `--tcrn-type-size-stamp-min` | `12px` | stamp floor (CJK serif) |

- `--tcrn-type-size-meta` was a dangling token until INIT-006 E3.
- The `.tcrn-heading--1` fluid clamp `clamp(28px, 3vw, 44px)` stays literal.
