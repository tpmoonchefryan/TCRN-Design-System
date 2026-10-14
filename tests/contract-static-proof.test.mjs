// SPDX-License-Identifier: Apache-2.0
// Contract static gate (TCRN-DS-STORY-132, TCRN-DS-SUB-036): parser, clause checks, scope, and one
// mutation per rule that must turn the gate red from a green fixture (C14: red and green both reachable).
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { colourLiterals, compounds, elementClasses, emojiIn, emojiInText, parseCss, parseHtml, selectorClasses, shadowLayers, specificity, textContent, walkElements, withoutPseudoElements } from "../scripts/lib/css-rules.mjs";
import { CHECKED_CLAUSES, checkedBatchesOf, evaluateContract, familyArguments, outOfPackageClasses, selectedPairKeys, semanticOf, validateExemptions } from "../scripts/contract-static-proof.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const readRepoJson = (path) => JSON.parse(readFileSync(join(repoRoot, path), "utf8"));

// ---------------------------------------------------------------------------------------------
// Fixtures: a small package sheet in the contract's pair grammar, a themed token sheet, and a
// family registry. Shell is batch 1 here only so that the C8 toolbar is in the checked scope; the
// registry lists batch 1 as its only checked batch (scope.checkedBatches, TCRN-DS-SUB-189).

const FAMILIES = {
  scope: { checkedBatches: [1] },
  utilities: ["tcrn-sr-only"],
  families: [
    { id: "actions", name: "Actions", batch: 1, blocks: ["tcrn-button", "tcrn-link-button"] },
    { id: "typography", name: "Typography", batch: 1, blocks: ["tcrn-text", "tcrn-link"] },
    { id: "shell", name: "Shell", batch: 1, blocks: ["tcrn-top-bar", "tcrn-product-shell-search"] },
    { id: "feedback", name: "Feedback", batch: 3, blocks: ["tcrn-badge"] },
    { id: "display", name: "Display", batch: 4, blocks: ["tcrn-card", "tcrn-stat-card"] }
  ]
};

const RULING = "TCRN-DS-INIT-015 scope 不授权段（fixture）";
const exemption = (id, target, clauses = [...CHECKED_CLAUSES]) => ({ id, clauses, ruling: RULING, reason: "fixture", ...target });
const NO_EXEMPTIONS = { entries: [] };

const ROLES = {
  singleLine: [{ role: "按钮", class: "tcrn-button__label" }],
  toolbars: [{ toolbar: "顶栏", container: "tcrn-top-bar", yield: "tcrn-product-shell-search", fixed: ["tcrn-top-bar__brand", "tcrn-top-bar__actions"] }],
  shell: {
    bars: ["tcrn-top-bar"],
    controls: [{ slot: "theme-toggle", class: "tcrn-shell-theme-toggle" }, { slot: "product-shell-search", class: "tcrn-product-shell-search" }],
    searchComponents: ["tcrn-product-shell-search", "tcrn-search-input"]
  }
};

const PACKAGE_CSS = `
/* Base rule reads the effective pair. */
.tcrn-button,.tcrn-link-button{--tcrn-pair-fill:var(--tcrn-pair-fill-d);--tcrn-pair-ink:var(--tcrn-pair-ink-d);--tcrn-pair-edge:var(--tcrn-pair-edge-d);--tcrn-pair-weight:500;background:var(--tcrn-pair-fill);color:var(--tcrn-pair-ink);box-shadow:var(--tcrn-pair-edge);font-weight:var(--tcrn-pair-weight)}
.tcrn-button.tcrn-button--primary{--tcrn-pair-fill-d:var(--tcrn-color-acc);--tcrn-pair-ink-d:var(--tcrn-color-on-acc);--tcrn-pair-edge-d:0 0 #0000;--tcrn-pair-fill-h:var(--tcrn-color-acc-2);--tcrn-pair-ink-h:var(--tcrn-color-on-acc);--tcrn-pair-edge-h:0 0 #0000;--tcrn-pair-fill-s:var(--tcrn-color-wash);--tcrn-pair-ink-s:var(--tcrn-color-ink);--tcrn-pair-edge-s:0 0 #0000}
.tcrn-button.tcrn-button--secondary{--tcrn-pair-fill-d:var(--tcrn-color-panel);--tcrn-pair-ink-d:var(--tcrn-color-ink);--tcrn-pair-edge-d:inset 0 0 0 1px var(--tcrn-color-line-ctl), 0 1px 1px rgba(22,21,15,.06);--tcrn-pair-fill-s:var(--tcrn-color-wash);--tcrn-pair-edge-s:0 0 #0000}
.tcrn-button:where(:hover,[data-tcrn-preview-state="hover"]){--tcrn-pair-fill:var(--tcrn-pair-fill-h);--tcrn-pair-ink:var(--tcrn-pair-ink-h);--tcrn-pair-edge:var(--tcrn-pair-edge-h)}
.tcrn-button:where([aria-pressed="true"]){--tcrn-pair-fill:var(--tcrn-pair-fill-s);--tcrn-pair-ink:var(--tcrn-pair-ink-s);--tcrn-pair-edge:var(--tcrn-pair-edge-s);--tcrn-pair-weight:600}
.tcrn-button:where(:disabled,[aria-disabled="true"]){cursor:not-allowed}
.tcrn-button:focus-visible{outline:2px solid transparent;outline-offset:2px}
.tcrn-button:not(:disabled){cursor:pointer}
.tcrn-button__label{min-inline-size:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-tcrn-theme="dark"] .tcrn-button.tcrn-button--secondary{--tcrn-pair-edge-d:inset 0 0 0 1px var(--tcrn-color-line-ctl)}
.tcrn-text{border:1px solid var(--tcrn-color-line)}
[data-tcrn-theme="dark"] .tcrn-text{border-color:var(--tcrn-color-line-2)}
.tcrn-top-bar{display:flex;gap:8px}
.tcrn-top-bar__brand{flex:0 0 auto}
.tcrn-top-bar__actions{display:flex;flex-shrink:0}
.tcrn-product-shell-search{flex:1 1 260px;min-inline-size:140px}
.tcrn-badge{box-shadow:inset 0 0 0 1px var(--tcrn-color-line)}
@media (prefers-reduced-motion: reduce){.tcrn-button{transition:none}}
@keyframes tcrn-button-spin{to{transform:rotate(360deg)}}
`;

const TOKENS_CSS = `
:root {
  /* tcrn-token-block: theme */
  --tcrn-color-acc: #0b7f74;
  --tcrn-color-wash: rgba(16, 20, 28, .06);
}
:root {
  /* tcrn-token-block: theme-independent */
  --tcrn-radius-2: 6px;
}
[data-tcrn-theme="dark"] {
  /* tcrn-token-block: theme */
  --tcrn-color-acc: #69d6d0;
  --tcrn-color-wash: rgba(255, 255, 255, .06);
}
`;

const USED_CLASSES = ["tcrn-button", "tcrn-button--primary", "tcrn-button__label", "tcrn-doc-frame", "tcrn-doc-frame__title"];

// A static story page: the documentation chrome outside the story section is not story render.
const STORY_SECTION = `<section data-story-id="fixture-story" class="tcrn-doc-frame">
  <button class="tcrn-button tcrn-button--primary" title="Save changes"><span class="tcrn-button__label">Save changes</span></button>
  <button class="tcrn-button tcrn-button--primary" aria-label="Close"><span class="tcrn-button__label"></span></button>
  <header class="tcrn-top-bar">
    <div class="tcrn-top-bar__brand">Brand</div>
    <div class="tcrn-product-shell-search" data-shell-control="product-shell-search"><input type="search" class="tcrn-input" aria-label="Search"></div>
    <div class="tcrn-top-bar__actions"><button class="tcrn-button tcrn-button--secondary tcrn-shell-theme-toggle" data-shell-control="theme-toggle" title="Theme"><span class="tcrn-button__label">Theme</span></button></div>
  </header>
  <div class="tcrn-card"><p>Card body &amp; notes</p></div>
</section>`;
const STORY_PAGE = `<!doctype html><html><head><style>.tcrn-doc-frame{background:linear-gradient(#fff,#eee)}</style></head><body>
<nav class="tcrn-doc-nav"><span>🔒 documentation chrome</span></nav>
${STORY_SECTION}
</body></html>`;
const pagesWith = (html) => [{ path: "fixture.html", html }];
const storyPage = (from, to) => {
  assert.ok(STORY_PAGE.includes(from), `fixture lacks: ${from}`);
  return pagesWith(STORY_PAGE.replace(from, to));
};

function run({ css = PACKAGE_CSS, tokens = TOKENS_CSS, exemptions = NO_EXEMPTIONS, roles = ROLES, used = USED_CLASSES, families = FAMILIES, pages = pagesWith(STORY_PAGE), familyFilter = null } = {}) {
  const outOfPackage = outOfPackageClasses(used, parseCss(css).rules);
  return evaluateContract({ packageCss: css, tokensCss: tokens, families, exemptions, roles, pairs: null, outOfPackage, outOfPackageSource: "fixture", storyPages: pages, storySource: "fixture", familyFilter });
}
const status = (report, clause) => report.clauses[clause].status;
const ruleIds = (report, clause) => [...new Set(report.clauses[clause].findings.map((finding) => finding.rule))].sort();

// ---------------------------------------------------------------------------------------------
// Parser

test("specificity follows Selectors Level 4 for :where, :is, :not and pseudo-elements", () => {
  assert.deepEqual(specificity('.tcrn-button:where(:hover,[data-tcrn-preview-state="hover"])'), [0, 1, 0]);
  assert.deepEqual(specificity(".tcrn-button.tcrn-button--primary"), [0, 2, 0]);
  assert.deepEqual(specificity(".x .tcrn-button:hover"), [0, 3, 0]);
  assert.deepEqual(specificity(".a:where(.b,.c) .d:is(#e, .f)"), [1, 2, 0]);
  assert.deepEqual(specificity("a:not(.x, #y)::before"), [1, 0, 2]);
  assert.deepEqual(specificity("li:nth-child(2n of .on)"), [0, 2, 1]);
  assert.deepEqual(specificity(withoutPseudoElements(".tcrn-input:placeholder-shown::placeholder")), [0, 2, 0]);
  assert.deepEqual(specificity(withoutPseudoElements(".tcrn-button:hover:before")), [0, 2, 0]);
});

test("compounds split on combinators outside brackets and functions", () => {
  assert.deepEqual(
    compounds('html[data-tcrn-theme="dark"] .a > .b:where(.c .d)+ .e').map((part) => `${part.combinator || "^"}${part.text}`),
    ['^html[data-tcrn-theme="dark"]', " .a", ">.b:where(.c .d)", "+.e"]
  );
  assert.deepEqual(selectorClasses(".a :focus-visible:not(.b)", { targetOnly: true }), ["a"]);
  assert.deepEqual(selectorClasses(".a :focus-visible:not(.b)").sort(), ["a", "b"]);
});

test("the rule reader keeps at-rule context and ignores braces in comments, strings and url()", () => {
  const { rules, errors } = parseCss(
    '/* { */ .a{content:"}";color:red} @media (min-width: 1px){.b{color:blue}} @keyframes k{from{opacity:0}to{opacity:1}} .c{background:url(data:image/svg+xml;utf8,<svg/>);color:red} @import "x.css";'
  );
  assert.deepEqual(errors, []);
  const style = rules.filter((rule) => rule.kind === "style");
  assert.deepEqual(style.map((rule) => rule.selectorText), [".a", ".b", ".c"]);
  assert.deepEqual(style[0].declarations.map((d) => `${d.prop}=${d.value}`), ['content="}"', "color=red"]);
  assert.deepEqual(style[1].atRules, ["@media (min-width: 1px)"]);
  assert.equal(style[2].declarations.length, 2);
  assert.deepEqual(rules.filter((rule) => rule.kind === "keyframe").map((rule) => rule.selectorText), ["from", "to"]);
});

test("nested rules resolve against the parent selector", () => {
  const { rules } = parseCss(".a{color:red; .b{color:blue} &:hover{color:green}}");
  assert.deepEqual(rules.map((rule) => rule.selectorText), [".a", ".a .b", ":is(.a):hover"]);
});

test("value helpers read colours, shadows and emoji", () => {
  assert.deepEqual(colourLiterals("var(--tcrn-color-red)"), []);
  assert.deepEqual(colourLiterals("1px solid red"), ["red"]);
  assert.deepEqual(colourLiterals("0 0 #0000"), ["#0000"]);
  const layers = shadowLayers("inset 2px 0 0 var(--tcrn-color-acc), 0 1px 2px rgba(0, 0, 0, .1)");
  assert.equal(layers.length, 2);
  assert.deepEqual([layers[0].inset, layers[0].x, layers[0].y, layers[1].blur], [true, 2, 0, 2]);
  assert.equal(shadowLayers("var(--tcrn-pair-edge)"), null);
  assert.deepEqual(emojiIn('"\\1F512"'), ["\u{1F512}"]);
  assert.deepEqual(emojiIn('"→ ↗"'), []);
});

// ---------------------------------------------------------------------------------------------
// The green side

test("the fixture sheet holds every clause", () => {
  const report = run();
  for (const clause of CHECKED_CLAUSES) assert.equal(status(report, clause), "green", `${clause}: ${JSON.stringify(report.clauses[clause].findings)}`);
  assert.equal(report.ok, true);
  assert.equal(report.reasonCode, "CONTRACT_STATIC_CLAUSES_HOLD");
});

// ---------------------------------------------------------------------------------------------
// Story acceptance (132-GWT1..3)

test("132-GWT1: .x .tcrn-button:hover{background:#fff} turns C2 red", () => {
  const report = run({ css: `${PACKAGE_CSS}\n.x .tcrn-button:hover{background:#fff}` });
  assert.equal(status(report, "C2"), "red");
  assert.deepEqual(ruleIds(report, "C2"), ["C2.colour", "C2.specificity"]);
  assert.equal(report.ok, false);
  assert.ok(report.reasonCodes.includes("CONTRACT_STATIC_C2_RED"));
});

test("132-GWT2: an inset shadow added only to the dark selected state turns C5 and C6 red", () => {
  const report = run({ css: `${PACKAGE_CSS}\n[data-tcrn-theme="dark"] .tcrn-button:where([aria-pressed="true"]){box-shadow:inset 2px 0 0 var(--tcrn-color-acc)}` });
  assert.equal(status(report, "C5"), "red");
  assert.deepEqual(ruleIds(report, "C5"), ["C5.dark-only"]);
  assert.equal(status(report, "C6"), "red");
  assert.ok(ruleIds(report, "C6").includes("C6.inset-x"));
});

test("132-GWT3: a linear-gradient background turns C11 red", () => {
  const report = run({ css: `${PACKAGE_CSS}\n.tcrn-button.tcrn-button--primary{background-image:linear-gradient(90deg,#0b7f74,#43d4cf)}` });
  assert.equal(status(report, "C11"), "red");
  assert.deepEqual(ruleIds(report, "C11"), ["C11.gradient"]);
});

// ---------------------------------------------------------------------------------------------
// One mutation per rule

const mutations = [
  ["C2", "C2.specificity", ".tcrn-button.tcrn-button--primary:hover{--tcrn-pair-fill:var(--tcrn-pair-fill-h)}"],
  ["C2", "C2.colour", ".tcrn-button:where(:active){color:var(--tcrn-color-ink)}"],
  ["C2", "C2.colour", ".tcrn-button:where(:focus-visible){--tcrn-pair-edge:inset 0 0 0 2px #0b7f74}"],
  ["C5", "C5.dark-only", '[data-tcrn-theme="dark"] .tcrn-text{text-decoration:underline}'],
  ["C6", "C6.left-border", '.tcrn-button:where([aria-pressed="true"]){border-left:2px solid var(--tcrn-color-acc)}'],
  ["C6", "C6.inset-x", ".tcrn-button.tcrn-button--quiet{--tcrn-pair-fill-s:transparent;--tcrn-pair-edge-s:inset 2px 0 0 var(--tcrn-color-acc)}"],
  ["C6", "C6.fill-with-one-side-edge", ".tcrn-button.tcrn-button--quiet{--tcrn-pair-fill-s:var(--tcrn-color-wash);--tcrn-pair-edge-s:inset 0 -2px 0 var(--tcrn-color-ink)}"],
  ["C6", "C6.fill-with-one-side-edge", '.tcrn-button[aria-current="page"]{background:var(--tcrn-color-wash);border-bottom:2px solid var(--tcrn-color-ink)}'],
  ["C7", "C7.wrap-allowed", ".tcrn-button--wrap .tcrn-button__label{white-space:normal}"],
  ["C8", "C8.yield-does-not-shrink", ".tcrn-product-shell-search{flex-shrink:0}"],
  ["C11", "C11.blur", ".tcrn-button{backdrop-filter:blur(16px)}"],
  ["C11", "C11.cloud-shadow", ".tcrn-button.tcrn-button--primary{--tcrn-pair-edge-h:0 8px 24px rgba(22,21,15,.18)}"],
  ["C11", "C11.cloud-shadow", ".tcrn-text{filter:drop-shadow(0 4px 12px rgba(0,0,0,.2))}"],
  ["C11", "C11.card-in-card", ".tcrn-card .tcrn-stat-card{padding:0}"],
  ["C11", "C11.emoji-icon", '.tcrn-button__label::before{content:"\u{1F512}"}'],
  ["C11", "C11.emoji-icon", '.tcrn-button__label::after{content:"\\1F512"}'],
  ["C11", "C11.left-bar", ".tcrn-text{border-inline-start:3px solid var(--tcrn-color-acc)}"],
  ["C11", "C11.left-bar", ".tcrn-text{box-shadow:inset 3px 0 0 var(--tcrn-color-red)}"],
  ["C11", "C11.gradient", ".tcrn-text{mask-image:radial-gradient(circle,#000,transparent)}"]
];

for (const [clause, rule, injected] of mutations) {
  test(`mutation turns ${clause} red (${rule}): ${injected.slice(0, 70)}`, () => {
    const report = run({ css: `${PACKAGE_CSS}\n${injected}` });
    assert.equal(status(report, clause), "red");
    assert.ok(ruleIds(report, clause).includes(rule), `${rule} not in ${ruleIds(report, clause)}`);
  });
}

test("C7: dropping the ellipsis from a single-line role turns C7 red, and an unknown role class is reported", () => {
  const css = PACKAGE_CSS.replace(".tcrn-button__label{min-inline-size:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}", ".tcrn-button__label{min-inline-size:0;overflow:hidden;white-space:nowrap}");
  assert.notEqual(css, PACKAGE_CSS);
  const report = run({ css });
  assert.deepEqual(ruleIds(report, "C7"), ["C7.not-single-line"]);
  assert.match(report.clauses.C7.findings[0].detail, /text-overflow: ellipsis/u);
  const missing = run({ roles: { ...ROLES, singleLine: [{ role: "按钮", class: "tcrn-button__caption" }] } });
  assert.deepEqual(ruleIds(missing, "C7"), ["C7.role-missing"]);
});

test("C8: removing flex-shrink 0 from a fixed item turns C8 red; so does a yielding item without min-width", () => {
  const css = PACKAGE_CSS.replace(".tcrn-top-bar__actions{display:flex;flex-shrink:0}", ".tcrn-top-bar__actions{display:flex}");
  assert.notEqual(css, PACKAGE_CSS);
  assert.deepEqual(ruleIds(run({ css }), "C8"), ["C8.fixed-item-shrinks"]);
  const noMin = PACKAGE_CSS.replace("min-inline-size:140px", "min-inline-size:0");
  assert.deepEqual(ruleIds(run({ css: noMin }), "C8"), ["C8.yield-without-min-width"]);
  const undeclared = run({ roles: { ...ROLES, toolbars: [{ toolbar: "顶栏", container: "tcrn-top-bar", fixed: [] }] } });
  assert.deepEqual(ruleIds(undeclared, "C8"), ["C8.yield-undeclared"]);
});

test("C5: themed token blocks must declare the same token set; theme-independent blocks are left out", () => {
  const missingDark = TOKENS_CSS.replace("  --tcrn-color-wash: rgba(255, 255, 255, .06);\n", "");
  assert.notEqual(missingDark, TOKENS_CSS);
  assert.deepEqual(ruleIds(run({ tokens: missingDark }), "C5"), ["C5.token-set"]);
  const extraDark = TOKENS_CSS.replace("  --tcrn-color-acc: #69d6d0;", "  --tcrn-color-acc: #69d6d0;\n  --tcrn-color-glow: #fff;");
  assert.deepEqual(ruleIds(run({ tokens: extraDark }), "C5"), ["C5.dark-only"]);
});

test("C5: the light theme block may be the selector list :root, [data-tcrn-theme=\"light\"]; it is the light side", () => {
  const opening = ":root {\n  /* tcrn-token-block: theme */";
  const listed = TOKENS_CSS.replace(opening, ':root, [data-tcrn-theme="light"] {\n  /* tcrn-token-block: theme */');
  assert.notEqual(listed, TOKENS_CSS);
  assert.equal(status(run({ tokens: listed }), "C5"), "green");
  const reordered = TOKENS_CSS.replace(opening, '[data-tcrn-theme="light"],\n:root {\n  /* tcrn-token-block: theme */');
  assert.equal(status(run({ tokens: reordered }), "C5"), "green");
  // The list is compared with the dark block like a lone :root: a name the dark block lacks, or a
  // name only the dark block has, is red.
  const missingDark = listed.replace("  --tcrn-color-wash: rgba(255, 255, 255, .06);\n", "");
  assert.notEqual(missingDark, listed);
  assert.deepEqual(ruleIds(run({ tokens: missingDark }), "C5"), ["C5.token-set"]);
  const extraDark = listed.replace("  --tcrn-color-acc: #69d6d0;", "  --tcrn-color-acc: #69d6d0;\n  --tcrn-color-glow: #fff;");
  assert.deepEqual(ruleIds(run({ tokens: extraDark }), "C5"), ["C5.dark-only"]);
  const extraLight = listed.replace("  --tcrn-color-acc: #0b7f74;", "  --tcrn-color-acc: #0b7f74;\n  --tcrn-color-glow: #000;");
  assert.deepEqual(ruleIds(run({ tokens: extraLight }), "C5"), ["C5.token-set"]);
});

test("C13: a new out-of-package tcrn- class turns C13 red; tcrn-doc- classes do not", () => {
  const family = run({ used: [...USED_CLASSES, "tcrn-button--glow"] });
  assert.equal(status(family, "C13"), "red");
  assert.deepEqual(family.clauses.C13.findings.map((finding) => [finding.selector, finding.families.join()]), [[".tcrn-button--glow", "actions"]]);
  const unattributed = run({ used: [...USED_CLASSES, "tcrn-made-up"] });
  assert.deepEqual(unattributed.clauses.C13.findings.map((finding) => finding.families.join()), ["unattributed"]);
  assert.equal(status(run({ used: [...USED_CLASSES, "tcrn-doc-new"] }), "C13"), "green");
});

test("C13 is red when the out-of-package difference could not be computed", () => {
  const report = evaluateContract({ packageCss: PACKAGE_CSS, tokensCss: TOKENS_CSS, families: FAMILIES, exemptions: NO_EXEMPTIONS, roles: ROLES, pairs: null, outOfPackage: null });
  assert.deepEqual(ruleIds(report, "C13"), ["C13.input-missing"]);
});

// ---------------------------------------------------------------------------------------------
// Allowances that must stay green

test("allowances: pair switches, the forced-colours transparent outline, :not() and shorthand coverage stay green", () => {
  const css = `${PACKAGE_CSS}
.tcrn-button:where(:active,[data-tcrn-preview-state="active"]){--tcrn-pair-fill:var(--tcrn-pair-fill-a);transform:none}
.tcrn-button:where(:focus-visible){outline-color:transparent}
.tcrn-button:not([aria-busy="true"]) > .tcrn-button__spinner{display:none}`;
  const report = run({ css });
  for (const clause of ["C2", "C5", "C6", "C11"]) assert.equal(status(report, clause), "green", `${clause}: ${JSON.stringify(report.clauses[clause].findings)}`);
});

// ---------------------------------------------------------------------------------------------
// Scope and exemptions

test("a later family is checked unless an exemption names it; the exemption is counted, not skipped", () => {
  const injected = `${PACKAGE_CSS}\n.tcrn-badge:hover{background:var(--tcrn-color-hover)}\n.tcrn-card{background:linear-gradient(#fff,#eee)}`;
  const unexempted = run({ css: injected });
  assert.equal(status(unexempted, "C2"), "red");
  assert.equal(status(unexempted, "C11"), "red");
  const exempted = run({ css: injected, exemptions: { entries: [exemption("EX-feedback", { family: "feedback" }), exemption("EX-display", { family: "display" }, ["C11"])] } });
  assert.equal(status(exempted, "C2"), "green");
  assert.equal(status(exempted, "C11"), "green");
  assert.deepEqual(exempted.clauses.C2.exemptedByEntry, { "EX-feedback": 1 });
  assert.deepEqual(exempted.clauses.C11.exemptedByEntry, { "EX-display": 1 });
});

test("a selector that also targets a checked family is not exempted by a later family's entry", () => {
  const css = `${PACKAGE_CSS}\n.tcrn-badge .tcrn-button:hover{background:#fff}`;
  const report = run({ css, exemptions: { entries: [exemption("EX-feedback", { family: "feedback" })] } });
  assert.equal(status(report, "C2"), "red");
  assert.deepEqual(report.clauses.C2.findings[0].families, ["actions", "feedback"]);
});

test("selectors without a tcrn class are checked; a selectors entry can exempt one exactly", () => {
  const css = `${PACKAGE_CSS}\n[data-theme-icon="dark"]{display:none}\nhtml[data-tcrn-theme="dark"] [data-theme-icon="light"]{display:none}`;
  assert.deepEqual(ruleIds(run({ css }), "C5"), ["C5.dark-only"]);
  const report = run({ css, exemptions: { entries: [exemption("EX-theme-icon", { selectors: ['[data-theme-icon="light"]'] }, ["C5"])] } });
  assert.equal(status(report, "C5"), "green");
});

test("invalid exemption entries make the gate red instead of skipping", () => {
  const cases = [
    [{ id: "EX-a", family: "feedback", clauses: ["*"], ruling: RULING, reason: "x" }, /clause \* is not checked/u],
    [{ id: "EX-b", family: "feedback", clauses: ["C2"], ruling: "", reason: "x" }, /ruling reference missing/u],
    [{ id: "EX-c", family: "actions", clauses: ["C2"], ruling: RULING, reason: "x" }, /in the checked batch/u],
    [{ id: "EX-d", classes: ["tcrn-button--primary"], clauses: ["C2"], ruling: RULING, reason: "x" }, /belongs to a checked family/u],
    [{ id: "EX-e", family: "feedback", classes: ["tcrn-badge"], clauses: ["C2"], ruling: RULING, reason: "x" }, /exactly one of/u],
    [{ id: "EX-f", family: "nowhere", clauses: ["C2"], ruling: RULING, reason: "x" }, /not in the family registry/u],
    [{ id: "EX-g", selectors: [".tcrn-button:hover"], clauses: ["C2"], ruling: RULING, reason: "x" }, /targets a checked family/u]
  ];
  for (const [entry, pattern] of cases) {
    const { errors } = validateExemptions({ entries: [entry] }, FAMILIES);
    assert.equal(errors.length, 1, entry.id);
    assert.match(errors[0].problems.join("; "), pattern);
    const report = run({ exemptions: { entries: [entry] } });
    assert.equal(report.ok, false);
    assert.ok(report.reasonCodes.includes("CONTRACT_STATIC_EXEMPTION_INVALID"));
  }
});

test("selected pair keys come from the pair table states", () => {
  assert.deepEqual(selectedPairKeys({ tables: { a: { states: [{ key: "d", name: "default" }, { key: "s", name: "selected" }] }, b: { states: [{ key: "c", name: "checked" }, { key: "cf", name: "checked-focus" }] } } }), ["c", "cf", "s"]);
  assert.deepEqual(selectedPairKeys(null), ["s", "c", "cf", "cx"]);
});

// ---------------------------------------------------------------------------------------------
// Story render layer (TCRN-DS-SUB-037)

test("the markup reader keeps entities, void elements, raw text and stray end tags apart", () => {
  const { root, errors } = parseHtml(`<div class="a  b" title="x &amp; y"><p>Hi <b>there</b></p></span><br><svg><path d="m0 0"/></svg><style>.a>b{}</style><input value=7></div>`);
  const div = root.children[0];
  assert.deepEqual(elementClasses(div), ["a", "b"]);
  assert.equal(div.attrs.title, "x & y");
  assert.equal(textContent(div), "Hi there");
  assert.deepEqual(errors.map((error) => error.problem), ["stray end tag </span>"]);
  const tags = [];
  walkElements(root, (node) => {
    tags.push(node.tag);
  });
  assert.deepEqual(tags, ["div", "p", "b", "br", "svg", "path", "style", "input"]);
  assert.deepEqual(emojiInText("Locked 🔒, sun ☀️, check ✓"), ["🔒", "☀️"]);
});

test("semantics: implicit roles, toggles and popups; current is a state, not a semantic", () => {
  const nodes = [];
  walkElements(parseHtml(`<a href="#">a</a><a href="#" aria-current="page">b</a><button aria-pressed="false">c</button><button aria-haspopup="menu">d</button><input type="checkbox"><input><div role="tab">e</div><div>f</div>`).root, (node) => {
    nodes.push(semanticOf(node));
  });
  assert.deepEqual(nodes, ["link", "link", "button+toggle", "button+popup", "checkbox", "textbox", "tab", null]);
});

test("the fixture story holds C7, C8 and C11 on the render layer; documentation chrome is not story render", () => {
  const report = run();
  for (const clause of ["C7", "C8", "C11"]) assert.equal(status(report, clause), "green", `${clause}: ${JSON.stringify(report.clauses[clause].findings)}`);
  assert.deepEqual(report.inputs.storyLayer, { source: "fixture", pageCount: 1, storyCount: 1, markupErrors: 0 });
});

const storyMutations = [
  ["C7", "C7.story-title-missing", ` title="Save changes"`, ""],
  ["C7", "C7.story-title-missing", ` title="Save changes"`, ` title="Requires owning route approval"`],
  ["C7", "C7.story-forced-wrap", `<span class="tcrn-button__label">Save changes</span>`, `<span class="tcrn-button__label">Save<br>changes</span>`],
  ["C7", "C7.story-forced-wrap", `<span class="tcrn-button__label">Theme</span>`, `<span class="tcrn-button__label" style="white-space:normal">Theme</span>`],
  ["C8", "C8.story-yield-missing", `<div class="tcrn-product-shell-search" data-shell-control="product-shell-search"><input type="search" class="tcrn-input" aria-label="Search"></div>`, ""],
  ["C8", "C8.story-yield-not-unique", `<div class="tcrn-top-bar__brand">Brand</div>`, `<div class="tcrn-top-bar__brand">Brand</div><div class="tcrn-product-shell-search"></div>`],
  ["C8", "C8.story-yield-in-fixed", `<div class="tcrn-top-bar__actions">`, `<div class="tcrn-top-bar__actions"><div class="tcrn-product-shell-search"></div>`],
  ["C8", "C8.story-item-not-fixed", `<div class="tcrn-top-bar__brand">Brand</div>`, `<div class="tcrn-top-bar__brand">Brand</div><div class="tcrn-top-bar__module">Module</div>`],
  ["C8", "C8.story-inline-override", `<div class="tcrn-product-shell-search" data-shell-control`, `<div class="tcrn-product-shell-search" style="min-width:0" data-shell-control`],
  ["C8", "C8.story-inline-override", `<div class="tcrn-top-bar__brand">`, `<div class="tcrn-top-bar__brand" style="flex-shrink:1">`],
  ["C11", "C11.story-emoji", `<p>Card body`, `<p><span class="tcrn-badge">🔒</span>Card body`],
  ["C11", "C11.story-emoji", `aria-label="Close"`, `aria-label="Close ❌"`],
  ["C11", "C11.story-card-in-card", `<p>Card body`, `<div class="tcrn-stat-card">Nested</div><p>Card body`],
  ["C11", "C11.story-inline-style", `<p>Card body`, `<p style="background:linear-gradient(#fff,#000)">Card body`],
  ["C11", "C11.story-inline-style", `<p>Card body`, `<p style="box-shadow:0 12px 32px rgba(0,0,0,.2)">Card body`],
  [
    "C11",
    "C11.story-same-shape",
    `<div class="tcrn-card">`,
    `<div><button class="tcrn-button tcrn-button--secondary">a</button><button class="tcrn-button tcrn-button--secondary" aria-pressed="false">b</button><button class="tcrn-button tcrn-button--secondary" aria-haspopup="menu">c</button><div role="tab" class="tcrn-button tcrn-button--secondary">d</div></div><div class="tcrn-card">`
  ],
  ["C11", "C11.story-generic-shell", `tcrn-button--secondary tcrn-shell-theme-toggle"`, `tcrn-button--secondary"`],
  ["C11", "C11.story-generic-shell", `<div class="tcrn-top-bar__brand">Brand</div>`, `<div class="tcrn-top-bar__brand">Brand<select><option>en</option></select></div>`],
  ["C11", "C11.story-generic-shell", `<div class="tcrn-top-bar__brand">Brand</div>`, `<div class="tcrn-top-bar__brand">Brand<input type="text" class="tcrn-input"></div>`]
];
for (const [clause, rule, from, to] of storyMutations) {
  test(`story mutation turns ${clause} red (${rule}): ${(to || `drop ${from}`).slice(0, 70)}`, () => {
    const report = run({ pages: storyPage(from, to) });
    assert.equal(status(report, clause), "red", JSON.stringify(report.clauses[clause].findings));
    assert.ok(ruleIds(report, clause).includes(rule), `${rule} not in ${ruleIds(report, clause)}`);
    const finding = report.clauses[clause].findings.find((entry) => entry.rule === rule);
    assert.equal(finding.story, "fixture-story");
    assert.equal(finding.source, "fixture.html");
  });
}

test("C7 on a first-batch element: the title it shows must hold its visible text, whitespace-normalised (TCRN-DS-SUB-079)", () => {
  const holds = [
    [` title="Save changes"`, ` title="Save changes — Requires owning route approval"`],
    [` title="Save changes"`, ` title="  Save\n   changes "`],
    [`<span class="tcrn-button__label">Save changes</span>`, `<span class="tcrn-button__label">Save\n    changes</span>`],
    [` title="Save changes"><span class="tcrn-button__label">Save changes</span>`, `><span class="tcrn-button__label"><abbr title="Save changes">Save changes</abbr></span>`]
  ];
  for (const [from, to] of holds) {
    const report = run({ pages: storyPage(from, to) });
    assert.equal(status(report, "C7"), "green", `${to}: ${JSON.stringify(report.clauses.C7.findings)}`);
  }
  // A title unrelated to the label (a disabled reason alone), part of the label, the element's own title
  // over the button's (the one a browser shows), and an empty own title (it shows nothing) are red.
  const misses = [
    [` title="Save changes"`, ` title="Requires owning route approval"`, /does not hold its visible text \("Requires owning route approval"\)/u],
    [` title="Save changes"`, ` title="Save"`, /does not hold its visible text \("Save"\)/u],
    [`<span class="tcrn-button__label">Save changes</span>`, `<span class="tcrn-button__label" title="Requires approval">Save changes</span>`, /does not hold its visible text \("Requires approval"\)/u],
    [`<span class="tcrn-button__label">Save changes</span>`, `<span class="tcrn-button__label" title="">Save changes</span>`, /has no title for its truncated text/u]
  ];
  for (const [from, to, detail] of misses) {
    const report = run({ pages: storyPage(from, to) });
    assert.deepEqual(ruleIds(report, "C7"), ["C7.story-title-missing"], to);
    assert.equal(report.clauses.C7.findings.length, 1, to);
    assert.match(report.clauses.C7.findings[0].detail, detail);
    assert.deepEqual(report.clauses.C7.findings[0].families, ["actions"]);
  }
});

test("C7 on a later family's element keeps the non-empty title reading; a first-batch class on it brings the stricter one", () => {
  const roles = { ...ROLES, singleLine: [...ROLES.singleLine, { role: "徽标", class: "tcrn-badge__label" }] };
  const css = `${PACKAGE_CSS}\n.tcrn-badge__label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}`;
  const badge = (title, labelClass = "tcrn-badge__label") =>
    storyPage(`<p>Card body`, `<p><span class="tcrn-badge"${title}><span class="${labelClass}">Billing</span></span>Card body`);
  assert.equal(status(run({ css, roles, pages: badge(` title="Related record, owned by finance"`) }), "C7"), "green");
  const untitled = run({ css, roles, pages: badge("") });
  assert.deepEqual(ruleIds(untitled, "C7"), ["C7.story-title-missing"]);
  assert.deepEqual(untitled.clauses.C7.findings[0].families, ["feedback"]);
  const mixed = run({ css, roles, pages: badge(` title="Related record, owned by finance"`, "tcrn-badge__label tcrn-text") });
  assert.deepEqual(ruleIds(mixed, "C7"), ["C7.story-title-missing"]);
  assert.deepEqual(mixed.clauses.C7.findings[0].families, ["feedback", "typography"]);
  assert.equal(status(run({ css, roles, pages: badge(` title="Billing — related record, owned by finance"`, "tcrn-badge__label tcrn-text") }), "C7"), "green");
});

test("C7, C8 and C11 are red when no rendered story can be read, not skipped", () => {
  for (const pages of [null, [], pagesWith("<html><body><p>no story section</p></body></html>")]) {
    const report = run({ pages });
    for (const clause of ["C7", "C8", "C11"]) assert.ok(ruleIds(report, clause).includes(`${clause}.story-input-missing`), `${clause} with ${JSON.stringify(pages)?.slice(0, 40)}`);
    assert.equal(report.ok, false);
  }
});

test("a later family's story finding is exempted by an entry, counted, and a first-batch one is not", () => {
  const pages = storyPage(`<p>Card body`, `<p><span class="tcrn-badge">🔒</span>Card body`);
  const byClass = run({ pages, exemptions: { entries: [exemption("EX-badge-emoji", { classes: ["tcrn-badge"] }, ["C11"])] } });
  assert.equal(status(byClass, "C11"), "green");
  assert.deepEqual(byClass.clauses.C11.exemptedByEntry, { "EX-badge-emoji": 1 });
  const firstBatch = run({ pages: storyPage(`<p>Card body`, `<p><span class="tcrn-button__label">🔒</span>Card body`), exemptions: { entries: [exemption("EX-feedback", { family: "feedback" })] } });
  assert.equal(status(firstBatch, "C11"), "red");
});

test("--family keeps the findings of the named families; an unknown family id is red", () => {
  const pages = pagesWith(STORY_PAGE.replace(` title="Save changes"`, "").replace(`<p>Card body`, `<p><span class="tcrn-badge">🔒</span>Card body`));
  const all = run({ pages });
  assert.equal(status(all, "C7"), "red");
  assert.equal(status(all, "C11"), "red");
  const actions = run({ pages, familyFilter: ["actions"] });
  assert.equal(status(actions, "C7"), "red");
  assert.equal(status(actions, "C11"), "green");
  assert.deepEqual(actions.scope.familyFilter, ["actions"]);
  const feedback = run({ pages, familyFilter: ["feedback"] });
  assert.equal(status(feedback, "C7"), "green");
  assert.equal(status(feedback, "C11"), "red");
  const unknown = run({ familyFilter: ["nope"] });
  assert.ok(unknown.reasonCodes.includes("CONTRACT_STATIC_FAMILY_UNKNOWN"));
  assert.deepEqual(unknown.scope.unknownFamilies, ["nope"]);
  assert.deepEqual(familyArguments(["--details", "--family", "actions,inputs", "--family=icon"]), ["actions", "inputs", "icon"]);
});

// ---------------------------------------------------------------------------------------------
// C11 card in card by the composite's family (TCRN-DS-SUB-190, R3-7 plan (a)): in this registry layout's
// Surface is a checked batch-2 family and feedback carries a panel drawn on a Surface, the way
// ReadbackPanel renders section.tcrn-surface.tcrn-readback-panel.

const COMPOSITE_FAMILIES = {
  ...FAMILIES,
  scope: { checkedBatches: [1, 2] },
  families: [
    ...FAMILIES.families.map((family) => (family.id === "feedback" ? { ...family, blocks: [...family.blocks, "tcrn-readback-panel"] } : family)),
    { id: "layout", name: "Layout", batch: 2, blocks: ["tcrn-surface"] }
  ]
};
const FEEDBACK_EXEMPT = { entries: [exemption("EX-feedback", { family: "feedback" })] };
const cardsPage = (inner) => pagesWith(`<!doctype html><html><body><section data-story-id="cards" class="tcrn-doc-frame">${inner}</section></body></html>`);
const cardFindings = (report, rule) => [...report.clauses.C11.findings.filter((finding) => finding.rule === rule)];

test("C11 story card in card: Surface in Surface stays with layout and is red (TCRN-DS-SUB-190)", () => {
  const report = run({ families: COMPOSITE_FAMILIES, exemptions: FEEDBACK_EXEMPT, pages: cardsPage(`<section class="tcrn-surface"><section class="tcrn-surface"><p>Inner</p></section></section>`) });
  assert.deepEqual(cardFindings(report, "C11.story-card-in-card").map((finding) => finding.families), [["layout"]]);
  assert.equal(status(report, "C11"), "red");
});

test("C11 story card in card: a card carrying Surface and a composite's class goes to the composite's family (TCRN-DS-SUB-190)", () => {
  const composite = `<section class="tcrn-surface tcrn-readback-panel"><section class="tcrn-surface tcrn-readback-panel"><p>Inner</p></section></section>`;
  const exempted = run({ families: COMPOSITE_FAMILIES, exemptions: FEEDBACK_EXEMPT, pages: cardsPage(composite) });
  assert.equal(status(exempted, "C11"), "green");
  assert.deepEqual(exempted.clauses.C11.exemptedByEntry, { "EX-feedback": 1 });
  // Without the composite's exemption it is still listed, under feedback alone, not layout.
  const listed = run({ families: COMPOSITE_FAMILIES, exemptions: NO_EXEMPTIONS, pages: cardsPage(composite) });
  assert.deepEqual(cardFindings(listed, "C11.story-card-in-card").map((finding) => finding.families), [["feedback"]]);
  // A plain Surface in the composite keeps layout on the finding, so it stays red.
  const mixed = run({ families: COMPOSITE_FAMILIES, exemptions: FEEDBACK_EXEMPT, pages: cardsPage(`<section class="tcrn-surface tcrn-readback-panel"><section class="tcrn-surface"><p>Inner</p></section></section>`) });
  assert.deepEqual(cardFindings(mixed, "C11.story-card-in-card").map((finding) => finding.families), [["feedback", "layout"]]);
  assert.equal(status(mixed, "C11"), "red");
});

test("C11 static card in card follows the same attribution (TCRN-DS-SUB-190)", () => {
  const families = (css) => cardFindings(run({ css: `${PACKAGE_CSS}\n${css}`, families: COMPOSITE_FAMILIES, exemptions: FEEDBACK_EXEMPT }), "C11.card-in-card").map((finding) => finding.families);
  assert.deepEqual(families(".tcrn-surface .tcrn-surface{padding:0}"), [["layout"]]);
  assert.deepEqual(families(".tcrn-surface.tcrn-readback-panel .tcrn-surface.tcrn-readback-panel{padding:0}"), []);
  assert.deepEqual(families(".tcrn-surface.tcrn-readback-panel .tcrn-surface{padding:0}"), [["feedback", "layout"]]);
  const composite = run({ css: `${PACKAGE_CSS}\n.tcrn-surface.tcrn-readback-panel .tcrn-surface.tcrn-readback-panel{padding:0}`, families: COMPOSITE_FAMILIES, exemptions: FEEDBACK_EXEMPT });
  assert.equal(composite.clauses.C11.exemptedByEntry["EX-feedback"], 1);
});

// ---------------------------------------------------------------------------------------------
// The repository's contract files

test("the repository's family registry, exemptions and roles are consistent", () => {
  const families = readRepoJson("docs/contract/families.json");
  const exemptions = readRepoJson("docs/contract/exemptions.json");
  const roles = readRepoJson("docs/contract/roles.json");
  // The checked batches are read from scope.checkedBatches, the field validateExemptions reads
  // (TCRN-DS-SUB-189): the first batch's five families and the second batch's three.
  const checkedBatches = checkedBatchesOf(families);
  assert.deepEqual(checkedBatches, [1, 2]);
  const checked = families.families.filter((family) => checkedBatches.includes(family.batch)).map((family) => family.id);
  assert.deepEqual(checked, ["typography", "icon", "brand", "actions", "inputs", "navigation", "shell", "layout"]);
  assert.equal(families.families.length, 16);
  const blocks = families.families.flatMap((family) => family.blocks);
  assert.equal(new Set(blocks).size, blocks.length, "a block belongs to one family");
  const { entries, errors, uncovered } = validateExemptions(exemptions, families);
  assert.deepEqual(errors, []);
  assert.deepEqual(uncovered, []);
  const exemptFamilies = new Set(entries.map((entry) => entry.family));
  for (const family of families.families) assert.equal(exemptFamilies.has(family.id), !checkedBatches.includes(family.batch), family.id);
  const familyOfBlock = new Map(families.families.flatMap((family) => family.blocks.map((block) => [block, family.id])));
  for (const role of roles.singleLine) assert.ok(familyOfBlock.has(role.class.replace(/__.*$/u, "")), role.class);
  for (const toolbar of roles.toolbars) assert.equal(typeof toolbar.yield, "string", toolbar.toolbar);
  // The shell's top band is the registered C8 toolbar (TCRN-DS-SUB-191): the strip yields at the pins and
  // holds the brand button and the right cluster fixed; strip and pins are shell-family blocks.
  assert.deepEqual(roles.toolbars, [{ toolbar: "顶带", container: "tcrn-shell-strip", yield: "tcrn-shell-pins", fixed: ["tcrn-shell-brand", "tcrn-shell-cluster"] }]);
  for (const toolbar of roles.toolbars) for (const name of [toolbar.container, toolbar.yield]) assert.equal(familyOfBlock.get(name), "shell", name);
  for (const control of roles.shell.controls) assert.ok(["shell", "navigation"].includes(familyOfBlock.get(control.class.replace(/__.*$/u, "").replace(/--.*$/u, ""))), control.class);
  for (const bar of roles.shell.bars) assert.equal(familyOfBlock.get(bar), "shell", bar);
  const lockHint = entries.find((entry) => entry.id === "EX-INIT015-lock-hint-emoji");
  assert.deepEqual(lockHint?.classes, ["tcrn-lock-hint__icon"]);
  assert.deepEqual(lockHint?.clauses, ["C11"]);
  assert.match(lockHint?.ruling ?? "", /TCRN-DS-INIT-015 scope 不授权段/u);
});

test("scope.checkedBatches drives both exemption rules on the repository's files (TCRN-DS-SUB-189)", () => {
  const families = readRepoJson("docs/contract/families.json");
  const exemptions = readRepoJson("docs/contract/exemptions.json");
  // An exemption for a family of a listed batch is an error: navigation is batch 2.
  const navigation = exemption("EX-probe-navigation", { family: "navigation" });
  const listed = validateExemptions({ ...exemptions, entries: [...exemptions.entries, navigation] }, families);
  assert.equal(listed.errors.length, 1);
  assert.equal(listed.errors[0].entry, "EX-probe-navigation");
  assert.match(listed.errors[0].problems.join("; "), /family navigation is in the checked batch 2/u);
  // A later batch's family left without its exemption is reported: feedback is batch 3.
  const bare = validateExemptions({ ...exemptions, entries: exemptions.entries.filter((entry) => entry.id !== "EX-INIT015-feedback") }, families);
  assert.deepEqual(bare.errors, []);
  assert.deepEqual(bare.uncovered, [{ family: "feedback", batch: 3 }]);
  // Listing batch 3 instead makes the same deletion consistent, and the remaining batch-3 entries errors.
  const widened = validateExemptions(
    { ...exemptions, entries: exemptions.entries.filter((entry) => entry.id !== "EX-INIT015-feedback") },
    { ...families, scope: { ...families.scope, checkedBatches: [1, 2, 3] } }
  );
  assert.deepEqual(widened.uncovered, []);
  assert.deepEqual(widened.errors.map((error) => error.entry).sort(), ["EX-INIT015-identity", "EX-INIT015-overlay"]);
  // A registry that lists no checked batch is itself an error.
  const unlisted = validateExemptions(exemptions, { ...families, scope: { note: "no batches" } });
  assert.ok(unlisted.errors.some((error) => error.entry === "(families.json scope)"));
});

test("the repository run reds a later family left bare; fixture evaluation does not ask for it (TCRN-DS-SUB-189)", () => {
  const evaluate = (exemptions, requireExemptionCoverage) => evaluateContract({
    packageCss: PACKAGE_CSS, tokensCss: TOKENS_CSS, families: FAMILIES, exemptions, roles: ROLES, pairs: null,
    outOfPackage: outOfPackageClasses(USED_CLASSES, parseCss(PACKAGE_CSS).rules), outOfPackageSource: "fixture",
    storyPages: pagesWith(STORY_PAGE), storySource: "fixture", requireExemptionCoverage
  });
  const bare = evaluate(NO_EXEMPTIONS, true);
  assert.deepEqual(bare.scope.uncoveredFamilies, [{ family: "feedback", batch: 3 }, { family: "display", batch: 4 }]);
  assert.ok(bare.reasonCodes.includes("CONTRACT_STATIC_EXEMPTION_MISSING"));
  assert.equal(bare.ok, false);
  assert.ok(!evaluate(NO_EXEMPTIONS, false).reasonCodes.includes("CONTRACT_STATIC_EXEMPTION_MISSING"));
  const covered = evaluate({ entries: [exemption("EX-feedback", { family: "feedback" }), exemption("EX-display", { family: "display" })] }, true);
  assert.deepEqual(covered.scope.uncoveredFamilies, []);
  assert.ok(!covered.reasonCodes.includes("CONTRACT_STATIC_EXEMPTION_MISSING"));
});

test("clauses.md carries C1 to C17 and names the clauses this gate checks", () => {
  const text = readFileSync(join(repoRoot, "docs/contract/clauses.md"), "utf8");
  for (let n = 1; n <= 17; n += 1) assert.match(text, new RegExp(`^### C${n} `, "mu"), `C${n}`);
  for (const clause of CHECKED_CLAUSES) assert.match(text, new RegExp(`${clause}\\.`, "u"), clause);
});
