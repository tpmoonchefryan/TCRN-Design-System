// Selection grammar proof — TCRN-DS-STORY-087 / TCRN-DS-INC-003.
//
// The system says selection exactly one way: the control's own surface takes ink
// (--tcrn-color-wash), or its existing border is promoted to ink (--tcrn-color-ink).
// Nothing is added on top.
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
// selection style introduced anywhere else is still invisible to it. The package
// stylesheet is read as the CSS text of each family segment module under
// packages/ui-react/src/styles/ (TCRN-DS-SUB-010), so a family module or generated
// segment added there is scanned without editing this list.
import { readFileSync } from "node:fs";
import { componentCssModules } from "./lib/component-css-sources.mjs";

const DOC_SOURCES = [
  "apps/storybook/src/storybook.css",
  "apps/storybook/src/story-demo-styles.ts",
  "apps/storybook/src/alpha-styles.ts"
];
const SOURCES = [
  ...componentCssModules().map(({ path, css }) => ({ source: path, text: css })),
  ...DOC_SOURCES.map((source) => ({ source, text: readFileSync(source, "utf8") }))
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
//
// TCRN-DS-SUB-168: the old documentation sidebar's own marker, [data-doc-nav-item-active], is
// gone with that sidebar (the documentation page is a top-band ProductShell, TCRN-DS-SUB-131), and
// no source carries it any more, so that alternative only ever matched nothing and is removed. The
// documentation shell's selection now comes from the package's own rules, which this gate reads
// through the package modules.
const SELECTION_SELECTOR =
  /\[data-selected|\[aria-current|\[aria-pressed|\[aria-selected|--(?:active|selected)\b/;

// Bodies that paint selection the old way. `inset` covers both the 3px left axis
// and the 2px bottom axis; brand colour is banned in selection because colour now
// means actionability and focus, not state.
//
// TCRN-DS-SUB-220: G+ renamed the tokens these forms name, and the old names live on only as
// aliases, so a selected rule written with the G+ names was invisible here. Each form now
// matches both: brand colour is the retired --tcrn-color-brand-* family or its G+ successors
// --tcrn-color-acc and --tcrn-color-acc-2 (whole names, so --tcrn-color-acc-bg is not one of
// them), and the lift is --tcrn-elevation-floating or its successor --tcrn-shadow-s3.
const FORBIDDEN_BODY = [
  { name: "inset-axis", pattern: /box-shadow:[^;]*inset/ },
  { name: "brand-colour", pattern: /--tcrn-color-brand-|--tcrn-color-acc(?:-2)?(?![\w-])/ },
  { name: "elevation-lift", pattern: /box-shadow:\s*var\(--tcrn-(?:elevation-floating|shadow-s3)\)/ }
];

export function grammarFindings(sources) {
  const found = [];
  let rules = 0;
  for (const { source, text } of sources) {
    for (const match of text.matchAll(/([^{}]*)\{([^{}]*)\}/g)) {
      const [, selector, body] = match;
      if (!SELECTION_SELECTOR.test(selector)) continue;
      rules += 1;
      for (const rule of FORBIDDEN_BODY) {
        if (!rule.pattern.test(body)) continue;
        found.push({
          source,
          rule: rule.name,
          selector: selector.split("\n").map((line) => line.trim()).filter(Boolean).join(" ").slice(0, 120),
          body: body.replace(/\s+/gu, " ").trim().slice(0, 160)
        });
      }
    }
  }
  return { ruleCount: rules, findings: found };
}

const grammar = grammarFindings(SOURCES);
const findings = [...grammar.findings];
const ruleCount = grammar.ruleCount;

// The grammar check has to be able to refuse a selected state written with the G+ names: each
// G+ form below is red (TCRN-DS-SUB-220).
const grammarMutants = [
  { rule: "brand-colour", css: '.tcrn-mutant[data-selected="true"] { color: var(--tcrn-color-acc); }' },
  { rule: "brand-colour", css: '.tcrn-mutant[aria-current="page"] { background: var(--tcrn-color-acc-2); }' },
  { rule: "elevation-lift", css: '.tcrn-mutant--selected { box-shadow: var(--tcrn-shadow-s3); }' }
];
for (const { rule, css } of grammarMutants) {
  const refused = grammarFindings([{ source: "mutant", text: css }]).findings.some((finding) => finding.rule === rule);
  if (!refused) {
    findings.push({ source: "selection-grammar-proof", rule: "grammar-check-cannot-fail", selector: css.slice(0, css.indexOf("{")).trim(), body: `a G+ ${rule} on a selected state was not refused` });
  }
}

// TCRN-DS-SUB-124 (STORY-143 GWT2) — one family, one selected structure. The five tab-shaped
// forms (Tabs, ModuleTabs, SectionTabs, SegmentedNav, ViewTabs) render one block, tcrn-tabs, and
// the family says "selected" exactly one way: the tab's pair switches to its selected values,
// the 6% ink wash and ink, and the label takes the strong weight. Nothing is added on top, so a
// selected tab rule that draws an edge, an outline, a shadow, an underline or a lift is a second
// structure, and so is any selection rule left on one of the old roots in the package
// stylesheet. Only the package modules are read for this check: the tab family's selected
// structure is the package's, and the doc layers carry no tab selection rule of their own (the
// general check above still reads them for the retired grammar).
const TAB = { block: "tcrn-tabs", subject: /\.tcrn-tabs__tab\b/u, pair: "--tcrn-pair-tab-fill" };
const OLD_TAB_ROOTS = /\.tcrn-(?:module-tabs|section-tabs|segmented-nav|view-tabs)\b/u;
const ADDED_ON_TOP = /(?:^|;)\s*(?:border[a-z-]*|outline[a-z-]*|box-shadow|text-decoration[a-z-]*|transform|translate|scale)\s*:/u;

export function oneStructureFindings(sources) {
  const found = [];
  const bodies = new Set();
  let selectedRules = 0;
  let washValue = null;
  for (const { source, text } of sources) {
    for (const match of text.matchAll(/([^{}]*)\{([^{}]*)\}/g)) {
      const selector = match[1].replace(/\/\*[\s\S]*?\*\//gu, "").trim();
      const body = match[2].replace(/\s+/gu, " ").trim();
      if (TAB.subject.test(selector) && !SELECTION_SELECTOR.test(selector)) {
        const wash = /--tcrn-pair-tab-fill-s:\s*([^;]+)/u.exec(body);
        if (wash) washValue = wash[1].trim();
      }
      if (!SELECTION_SELECTOR.test(selector)) continue;
      const short = selector.split("\n").map((line) => line.trim()).filter(Boolean).join(" ").slice(0, 120);
      if (OLD_TAB_ROOTS.test(selector)) {
        found.push({ source, rule: "tabs-old-root-selection", selector: short, body: body.slice(0, 160) });
        continue;
      }
      if (!TAB.subject.test(selector)) continue;
      selectedRules += 1;
      bodies.add(body);
      if (!/--tcrn-pair-tab-fill:\s*var\(--tcrn-pair-tab-fill-s\)/u.test(body)) found.push({ source, rule: "tabs-selected-not-wash", selector: short, body: body.slice(0, 160) });
      if (!/font-weight:\s*var\(--tcrn-type-weight-strong\)/u.test(body)) found.push({ source, rule: "tabs-selected-not-weight", selector: short, body: body.slice(0, 160) });
      if (ADDED_ON_TOP.test(body)) found.push({ source, rule: "tabs-selected-adds-on-top", selector: short, body: body.slice(0, 160) });
    }
  }
  if (selectedRules === 0) found.push({ source: "package stylesheet", rule: "tabs-selected-missing", selector: ".tcrn-tabs__tab", body: "no selected rule for the tab" });
  if (bodies.size > 1) found.push({ source: "package stylesheet", rule: "tabs-selected-two-structures", selector: ".tcrn-tabs__tab", body: [...bodies].join(" | ").slice(0, 160) });
  if (washValue !== "var(--tcrn-color-wash)") found.push({ source: "package stylesheet", rule: "tabs-selected-pair-not-6pc-wash", selector: ".tcrn-tabs__tab", body: `--tcrn-pair-tab-fill-s: ${washValue}` });
  return { selectedRules, findings: found };
}

const packageSources = SOURCES.filter(({ source }) => !DOC_SOURCES.includes(source));
const tabsFamily = oneStructureFindings(packageSources);
findings.push(...tabsFamily.findings);

// The check has to be able to refuse: the old bottom edge put back on a selected tab is red.
const mutant = oneStructureFindings([{ source: "mutant", text: [
  ".tcrn-tabs__tab { --tcrn-pair-tab-fill-s: var(--tcrn-color-wash); }",
  '.tcrn-tabs__tab:where([data-selected="true"]) { --tcrn-pair-tab-fill: var(--tcrn-pair-tab-fill-s); font-weight: var(--tcrn-type-weight-strong); border-block-end-color: var(--tcrn-selection-edge); }'
].join("\n") }]);
if (!mutant.findings.some((finding) => finding.rule === "tabs-selected-adds-on-top")) {
  findings.push({ source: "selection-grammar-proof", rule: "tabs-check-cannot-fail", selector: ".tcrn-tabs__tab", body: "an edge on the selected tab was not refused" });
}

const result = {
  ok: findings.length === 0,
  grammar: "selection is ink: surface-bearing controls take --tcrn-color-wash, framed controls promote their border to --tcrn-color-ink",
  sourcesScanned: SOURCES.length,
  selectionRulesScanned: ruleCount,
  tabsFamily: { block: TAB.block, selectedRules: tabsFamily.selectedRules, structure: "the 6% ink wash and the strong weight" },
  findings
};

console.log(JSON.stringify(result, null, 2));
if (!result.ok) {
  console.error(
    `\n${findings.length} selection rule(s) paint the retired grammar. ` +
    "Selection must not add an axis, a brand colour, or a lift.");
  process.exit(1);
}
