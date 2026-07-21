# Adopting the TCRN Design System in TMS

TMS has no Design System dependency today: every `@tcrn/*` import in its tree resolves
to one of its own internal packages (`shared`, `database`, `web`, `api`). That is why
this guide starts at v2 and never mentions v1 — there is no migration to perform, only
an adoption, and starting on the current visual language costs nothing extra.

## What you are adopting

Three packages, all at 2.0.0:

| Package | What it gives you |
| --- | --- |
| `@tcrn/ui-tokens` | The visual language as CSS custom properties, plus typed token metadata |
| `@tcrn/ui-copy-state` | Locale list, copy-state vocabulary, and the no-overclaim display helpers |
| `@tcrn/ui-react` | The React primitives, already wired to the tokens |

## Wiring the tokens

Inject the generated stylesheet once, at the application shell, and set the theme
attribute on a root element:

```tsx
import { tcrnTokenCss } from "@tcrn/ui-tokens";

// in your document head
<style data-tcrn-token-source="@tcrn/ui-tokens">{tcrnTokenCss}</style>

// on <html> or your shell root
<div data-tcrn-theme={theme}>   {/* "light" | "dark" */}
```

Import the JS export rather than `@tcrn/ui-tokens/tokens.css` if you can — both are
generated from the same source and kept in lockstep by `pnpm tokens:proof`, but the JS
export also gives you `tcrnTokens` if you need to read a value programmatically.

## The three rules worth knowing before you start

**Density is the point.** The UI type size is 13px and the compact row height is 36px.
These are not defaults to override; the components are laid out for an operator reading
a dense table, and loosening them is what makes a governance tool feel like a marketing
page.

**Semantic state colour is not decoration.** `--tcrn-color-state-ready` and its
siblings carry meaning. Do not use the brand accent to indicate readiness or error, and
do not use a state colour for emphasis. Storybook's Style Guide chapter states the
boundary for each family.

**The stamp language is closed.** `Stamp` and `StampRule` are admitted at three identity
moments only — a gate closing, a ruling landing, a release being accepted. `pnpm
stamp:proof` fails the build if the serif face or the stamp geometry appears anywhere
else. If TMS has a fourth moment that genuinely deserves it, that is an Owner decision
to widen the whitelist, not a local override.

## Proving adoption

Design System compliance means rendering the same visual instance Storybook does, not
merely importing the package. Compare, per component you adopt: package version,
exported component, variants and props, computed visual metrics, motion behaviour,
reduced-motion fallback, theme and locale state, mobile reflow, and information
hierarchy — against the matching Storybook chapter. The AI consumption contract at
`ai-consumption-contract.json` enumerates the required readback fields.

## What is not covered

Brand assets. TMS must use admitted brand assets or route a brand component admission;
the lockups shown in Storybook are visual-review guidance and are not package-backed
brand exports.
