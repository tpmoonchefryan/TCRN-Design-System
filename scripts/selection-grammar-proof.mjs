// Selection grammar proof — TCRN-DS-STORY-087 / TCRN-DS-INC-003.
//
// The system says selection exactly one way: the control's own surface takes ink
// (--tcrn-selection-fill), or its existing border is promoted to ink
// (--tcrn-selection-edge). Nothing is added on top.
//
// This gate exists because that rule was broken four separate times before anyone
// noticed, and each break was invisible to every other gate:
//   1. the package's vertical nav used a brand-coloured left axis;
//   2. the package's horizontal tab family used a brand-coloured bottom axis —
//      the two together read as two different products on one page;
//   3. the docs shell hand-copied the vertical rule into storybook.css, so the
//      two only matched by coincidence;
//   4. the docs shell had a *fourth* copy keyed on aria-current="location",
//      which a sweep for data-selected did not see.
//
// A style rule cannot be enforced by review, because a fifth copy looks exactly
// like correct code in a diff. So the shape is checked mechanically: any rule
// whose selector marks a selected/current state and whose body paints a brand
// colour or an inset axis is a defect.
//
// Scope note, in the spirit of "a gate only protects the bytes it reads": this
// scans the package component stylesheet and both docs presentation layers. A
// selection style introduced anywhere else is still invisible to it.
import { readFileSync } from "node:fs";

const SOURCES = [
  "packages/ui-react/src/components/Navigation/Navigation.tsx",
  "apps/storybook/src/storybook.css",
  "apps/storybook/src/story-demo-styles.ts",
  "apps/storybook/src/alpha-styles.ts"
];

// Selectors that mark "this one is chosen". aria-current="location" is included
// because omitting it is precisely how copy #4 survived the first sweep.
//
// TCRN-DS-INC-005: this list was attribute-selectors-only, and copies #5 and #6
// were not attributes — a pressed filter chip (`[aria-pressed="true"]`) and a
// modifier class (`--active`). Both painted brand while this gate reported zero
// findings, so the gate that exists to stop a fifth copy could not see the fifth
// copy. A marker only counts here if it means "this option is the chosen one":
// `[data-active]` on the doc theme-transition wash means "this crossfade is
// running", and widening far enough to catch that would stop the gate meaning
// what its name says.
const SELECTION_SELECTOR =
  /\[data-selected|\[aria-current|\[aria-pressed|\[aria-selected|\[data-doc-nav-item-active|--(?:active|selected)\b/;

// Bodies that paint selection the old way. `inset` covers both the 3px left axis
// and the 2px bottom axis; brand colour is banned in selection because colour now
// means actionability and focus, not state.
const FORBIDDEN_BODY = [
  { name: "inset-axis", pattern: /box-shadow:[^;]*inset/ },
  { name: "brand-colour", pattern: /--tcrn-color-brand-/ },
  { name: "elevation-lift", pattern: /box-shadow:\s*var\(--tcrn-elevation-floating\)/ }
];

const findings = [];
let ruleCount = 0;

for (const source of SOURCES) {
  const text = readFileSync(source, "utf8");
  for (const match of text.matchAll(/([^{}]*)\{([^{}]*)\}/g)) {
    const [, selector, body] = match;
    if (!SELECTION_SELECTOR.test(selector)) continue;
    ruleCount += 1;
    for (const rule of FORBIDDEN_BODY) {
      if (!rule.pattern.test(body)) continue;
      findings.push({
        source,
        rule: rule.name,
        selector: selector.split("\n").map((line) => line.trim()).filter(Boolean).join(" ").slice(0, 120),
        body: body.replace(/\s+/gu, " ").trim().slice(0, 160)
      });
    }
  }
}

const result = {
  ok: findings.length === 0,
  grammar: "selection is ink: surface-bearing controls take --tcrn-selection-fill, framed controls promote their border to --tcrn-selection-edge",
  sourcesScanned: SOURCES.length,
  selectionRulesScanned: ruleCount,
  findings
};

console.log(JSON.stringify(result, null, 2));
if (!result.ok) {
  console.error(
    `\n${findings.length} selection rule(s) paint the retired grammar. ` +
    "Selection must not add an axis, a brand colour, or a lift.");
  process.exit(1);
}
