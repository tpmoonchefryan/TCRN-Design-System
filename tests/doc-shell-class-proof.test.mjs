// SPDX-License-Identifier: Apache-2.0
// Out-of-package class gate for the documentation layer (TCRN-DS-STORY-128, TCRN-DS-SUB-024).
import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import {
  DEFAULT_PATHS,
  DOC_CLASS_DISPOSITIONS,
  classListTokens,
  codeClassOccurrences,
  computeOutOfPackage,
  cssSelectorTokens,
  htmlClassOccurrences,
  markupClassTokens,
  packageEmittedVocabulary,
  runDocShellClassProof
} from "../scripts/doc-shell-class-proof.mjs";

const tokens = (found) => found.filter((entry) => !entry.prefix).map((entry) => entry.token).sort();
const prefixes = (found) => found.filter((entry) => entry.prefix).map((entry) => entry.token).sort();

test("class lists keep class names and mark interpolated tails as prefixes", () => {
  const found = classListTokens("tcrn-tree-nav tcrn-tree-nav--\u0000 data-tcrn-x --tcrn-color-ink tcrn-");
  assert.deepEqual(tokens(found), ["tcrn-tree-nav"]);
  assert.deepEqual(prefixes(found), ["tcrn-tree-nav--"]);
});

test("CSS selectors come from rule preludes only", () => {
  const css = `/* .tcrn-in-comment {} */
:root { --tcrn-color-ink: #000; }
.tcrn-doc-frame > .tcrn-foo, button.tcrn-bar:hover { color: var(--tcrn-color-ink); content: ".tcrn-in-value"; }
@keyframes tcrn-motion-spin { from { opacity: 0; } }
@container tcrn-settings-content (min-width: 1px) { .tcrn-baz { gap: 0; } }
[class~="tcrn-attr"] { gap: 0; }`;
  assert.deepEqual(tokens(cssSelectorTokens(css)), ["tcrn-attr", "tcrn-bar", "tcrn-baz", "tcrn-doc-frame", "tcrn-foo"]);
});

test("markup class attributes are read with plain and escaped quotes", () => {
  const found = markupClassTokens(`<div class="tcrn-a tcrn-b" data-class="tcrn-no" id="tcrn-id"></div><span class=\\"tcrn-c\\"></span>`);
  assert.deepEqual(tokens(found), ["tcrn-a", "tcrn-b", "tcrn-c"]);
});

test("code is read through its syntax tree: class contexts count, ids, keys, comments and JSX text do not", () => {
  const source = `
// .tcrn-comment-only and className="tcrn-in-line-comment"
/* tcrn-in-block-comment */
const storageKey = "tcrn-design-system-theme";
const toneClass = "tcrn-tone";
export function Demo({ dense }) {
  return (
    <section className={cx("tcrn-section", dense && "tcrn-section--dense")} id="tcrn-section-id" aria-controls="tcrn-panel">
      <TopBar className={\`tcrn-bar tcrn-bar--\${dense ? "dense" : "roomy"}\`} brandProps={{ className: "tcrn-brand-slot" }} />
      <p>Use tcrn-prose-mention and .tcrn-prose-selector in text.</p>
    </section>
  );
}
function wire(node) {
  node.classList.add("tcrn-added");
  node.className = "tcrn-assigned";
  document.querySelector(".tcrn-queried, [data-x]");
  window.dispatchEvent(new CustomEvent("tcrn-event-name"));
}
export const script = \`<script>document.body.classList.toggle("tcrn-embedded", true); const id = "tcrn-embedded-id";</script>\`;
`;
  const found = codeClassOccurrences(source, "demo.tsx");
  assert.deepEqual(sortedUnique(tokens(found)), [
    "tcrn-added",
    "tcrn-assigned",
    "tcrn-bar",
    "tcrn-brand-slot",
    "tcrn-embedded",
    "tcrn-queried",
    "tcrn-section",
    "tcrn-section--dense",
    "tcrn-tone"
  ]);
  assert.deepEqual(sortedUnique(prefixes(found)), ["tcrn-bar--"]);
});

test("built pages read markup, style and script, but not escaped code samples", () => {
  const html = `<html><head><style data-tcrn-static-doc-style-source="storybook">.tcrn-doc-frame { display: grid; } .tcrn-demo { gap: 0; }</style></head>
<body><div class="tcrn-doc-frame tcrn-button"><code>&lt;div class=&quot;tcrn-sample&quot;&gt;</code></div>
<script>document.querySelector(".tcrn-hook"); localStorage.setItem("tcrn-key", "1");</script>
<script type="application/json">{"className":"tcrn-json-data"}</script></body></html>`;
  const found = htmlClassOccurrences(html);
  assert.deepEqual(sortedUnique(found.map((entry) => entry.token)), ["tcrn-button", "tcrn-demo", "tcrn-doc-frame", "tcrn-hook"]);
  assert.ok(found.some((entry) => entry.token === "tcrn-demo" && entry.kind === "doc-style"));
});

test("package-written classes come from class contexts of the compiled components", () => {
  const vocabulary = packageEmittedVocabulary([
    { path: "dist/Badge.js", text: 'export const Badge = (p) => jsx("span", { className: cx("tcrn-badge", `tcrn-badge--${p.tone}`), id: "tcrn-badge-id" });' }
  ]);
  assert.deepEqual([...vocabulary.literals].sort(), ["tcrn-badge"]);
  assert.deepEqual(vocabulary.prefixes, ["tcrn-badge--"]);
});

test("a package literal handed to a class-named parameter of another package module is package-written (TCRN-DS-SUB-132)", () => {
  const files = [
    { path: "dist/Menu.js", text: 'export function cascades(items, context, className) { return items.map((item) => jsx("div", { className, children: item })); }\nexport const caption = (items, label) => label;' },
    { path: "dist/Dropdown.js", text: 'import { cascades, caption } from "./Menu.js";\nexport const Dropdown = (p) => [cascades(p.items, p.context, "tcrn-menu__cascade tcrn-dropdown__col"), caption(p.items, "tcrn-not-a-class")];' }
  ];
  const vocabulary = packageEmittedVocabulary(files);
  assert.ok(vocabulary.literals.has("tcrn-dropdown__col"));
  assert.ok(vocabulary.literals.has("tcrn-menu__cascade"));
  assert.equal(vocabulary.literals.has("tcrn-not-a-class"), false);
  const result = computeOutOfPackage({
    packageClasses: new Set(["tcrn-menu__cascade"]),
    packageEmitted: vocabulary,
    output: new Map([["tcrn-dropdown__col", { kinds: new Set(["markup"]), pages: new Set(["a.html"]) }]]),
    sources: new Map()
  });
  assert.deepEqual(result.outOfPackage, []);
  assert.deepEqual(result.packageEmittedWithoutRule, [{ className: "tcrn-dropdown__col", via: "literal" }]);
  // The documentation sources keep the plain reading: the same call in a doc file is not a class context.
  assert.deepEqual(tokens(codeClassOccurrences('cascades(items, context, "tcrn-dropdown__col");', "doc.tsx").filter((entry) => entry.kind === "class-context")), []);
});

test("the difference subtracts package CSS, exempts tcrn-doc-*, and still counts a doc literal that only matches a package template", () => {
  const entry = () => ({ kinds: new Set(["markup"]), pages: new Set(["index.html"]), locations: new Set(["x.tsx:1"]) });
  const output = new Map([["tcrn-button", entry()], ["tcrn-doc-frame", entry()], ["tcrn-badge--neutral", entry()], ["tcrn-shell-demo", entry()]]);
  const sources = new Map([["tcrn-shell-demo", entry()], ["tcrn-badge--wrap", entry()]]);
  const result = computeOutOfPackage({
    packageClasses: new Set(["tcrn-button", "tcrn-badge"]),
    packageEmitted: { literals: new Set(["tcrn-badge"]), prefixes: ["tcrn-badge--"] },
    output,
    sources
  });
  assert.deepEqual(result.outOfPackage, ["tcrn-badge--wrap", "tcrn-shell-demo"]);
  assert.deepEqual(result.packageEmittedWithoutRule, [{ className: "tcrn-badge--neutral", via: "template:tcrn-badge--" }]);
  assert.deepEqual(result.exemptDocClasses, ["tcrn-doc-frame"]);
});

function writeTree(root, files) {
  for (const [path, text] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), text);
  }
}

function packageBackedFixture() {
  return {
    "packages/ui-react/dist/index.js": 'export const tcrnComponentCss = ".tcrn-button { color: red; } .tcrn-badge { color: blue; }";\nexport * from "./components/Badge.js";\n',
    "packages/ui-react/dist/components/Badge.js": "export const Badge = (props) => ({ className: `tcrn-badge tcrn-badge--${props.tone}` });\n",
    "apps/storybook/storybook-static/index.html":
      '<html><head><style data-tcrn-static-doc-style-source="storybook">.tcrn-doc-frame { display: grid; }</style></head><body><main class="tcrn-doc-frame"><span class="tcrn-badge tcrn-badge--neutral">ok</span><button class="tcrn-button">go</button></main><script>localStorage.getItem("tcrn-theme-key");</script></body></html>\n',
    "apps/storybook/src/build/page-template.tsx": 'export const page = <main className="tcrn-doc-frame" id="tcrn-main" />;\n',
    "apps/storybook/src/alpha-styles.ts": "export const alphaStoryCss = `.tcrn-doc-frame { display: grid; }`;\n",
    "apps/storybook/src/story-demo-styles.ts": "export const demoStoryCss = ``;\n",
    "apps/storybook/src/storybook.css": "/* .tcrn-commented-out { } */\n:root { --tcrn-color-ink: #000; }\n",
    "apps/storybook/src/demo.stories.tsx": 'export const Demo = () => <Badge tone="neutral" />;\n'
  };
}

async function withFixture(files, run) {
  const root = mkdtempSync(join(tmpdir(), "doc-shell-class-"));
  try {
    writeTree(root, files);
    return await run(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test("a documentation layer that only renders package classes is green", async () => {
  const result = await withFixture(packageBackedFixture(), (root) => runDocShellClassProof({ root }));
  assert.equal(result.ok, true, JSON.stringify(result.reasonCodes));
  assert.equal(result.reasonCode, "DOC_SHELL_CLASSES_PACKAGE_BACKED");
  assert.equal(result.outOfPackageCount, 0);
  assert.equal(result.exemptDocClassCount, 1);
  assert.deepEqual(result.packageEmittedWithoutRule, [{ className: "tcrn-badge--neutral", via: "template:tcrn-badge--" }]);
  assert.equal(result.templateClassCheck.ok, true);
});

test("128-GWT2: adding one tcrn-foo documentation class turns the gate red", async () => {
  const inSource = await withFixture(
    { ...packageBackedFixture(), "apps/storybook/src/foo.stories.tsx": 'export const Foo = () => <div className="tcrn-foo" />;\n' },
    (root) => runDocShellClassProof({ root })
  );
  assert.equal(inSource.ok, false);
  assert.equal(inSource.reasonCode, "DOC_SHELL_OUT_OF_PACKAGE_CLASSES");
  assert.deepEqual(inSource.outOfPackage, ["tcrn-foo"]);
  assert.deepEqual(inSource.details[0].usedIn, ["apps/storybook/src/foo.stories.tsx:1"]);

  const files = packageBackedFixture();
  files["apps/storybook/storybook-static/index.html"] = files["apps/storybook/storybook-static/index.html"].replace('class="tcrn-doc-frame"', 'class="tcrn-doc-frame tcrn-foo"');
  files["apps/storybook/src/alpha-styles.ts"] = "export const alphaStoryCss = `.tcrn-doc-frame { display: grid; } .tcrn-foo { gap: 0; }`;\n";
  const inOutput = await withFixture(files, (root) => runDocShellClassProof({ root }));
  assert.equal(inOutput.ok, false);
  assert.deepEqual(inOutput.outOfPackage, ["tcrn-foo"]);
  assert.deepEqual(inOutput.details[0].definedIn, ["apps/storybook/src/alpha-styles.ts:1"]);
  assert.equal(inOutput.details[0].renderedPageCount, 1);
});

test("the tcrn-doc- prefix is the documentation layer's own and stays green", async () => {
  const result = await withFixture(
    { ...packageBackedFixture(), "apps/storybook/src/foo.stories.tsx": 'export const Foo = () => <div className="tcrn-doc-foo" />;\n' },
    (root) => runDocShellClassProof({ root })
  );
  assert.equal(result.ok, true);
  assert.equal(result.exemptDocClassCount, 2);
});

test("TCRN-DS-INC-010 sub-check: a page-template class without a definition is red", async () => {
  const files = packageBackedFixture();
  files["apps/storybook/src/build/page-template.tsx"] = 'export const page = <main className="tcrn-doc-frame tcrn-doc-undefined" />;\n';
  const result = await withFixture(files, (root) => runDocShellClassProof({ root }));
  assert.equal(result.ok, false);
  assert.ok(result.reasonCodes.includes("DOC_SHELL_CLASS_UNDEFINED"));
  assert.deepEqual(result.templateClassCheck.missing, ["tcrn-doc-undefined"]);
});

test("missing build outputs fail closed", async () => {
  const noDist = packageBackedFixture();
  delete noDist["packages/ui-react/dist/index.js"];
  const distResult = await withFixture(noDist, (root) => runDocShellClassProof({ root }));
  assert.equal(distResult.ok, false);
  assert.equal(distResult.reasonCode, "DOC_SHELL_PACKAGE_DIST_MISSING");

  const noStatic = packageBackedFixture();
  delete noStatic["apps/storybook/storybook-static/index.html"];
  const staticResult = await withFixture(noStatic, (root) => runDocShellClassProof({ root }));
  assert.equal(staticResult.ok, false);
  assert.equal(staticResult.reasonCode, "DOC_SHELL_STATIC_OUTPUT_MISSING");
});

test("the committed class map gives every baseline class exactly one allowed disposition", () => {
  const baseline = JSON.parse(readFileSync(DEFAULT_PATHS.baselinePath, "utf8"));
  const map = JSON.parse(readFileSync(DEFAULT_PATHS.mapPath, "utf8"));
  const baselineClasses = [...baseline.outOfPackage].sort();
  assert.equal(baseline.outOfPackageCount, baselineClasses.length);
  assert.deepEqual(Object.keys(map.classes).sort(), baselineClasses);
  assert.equal(map.classCount, baselineClasses.length);
  const counts = Object.fromEntries(DOC_CLASS_DISPOSITIONS.map((disposition) => [disposition, 0]));
  for (const [className, entry] of Object.entries(map.classes)) {
    assert.ok(DOC_CLASS_DISPOSITIONS.includes(entry.disposition), `${className}: ${entry.disposition}`);
    counts[entry.disposition] += 1;
    assert.equal(typeof entry.reason, "string");
    assert.ok(Array.isArray(entry.definedIn) && Array.isArray(entry.usedIn) && Array.isArray(entry.references), className);
    assert.ok(entry.definedIn.length + entry.usedIn.length + entry.renderedPageCount > 0, `${className} has no location`);
    if (entry.disposition === "rename-tcrn-doc") assert.equal(entry.target, `tcrn-doc-${className.slice("tcrn-".length)}`);
    else assert.equal(entry.target, undefined, className);
  }
  assert.deepEqual(map.counts, counts);
});

function sortedUnique(values) {
  return [...new Set(values)].sort();
}
