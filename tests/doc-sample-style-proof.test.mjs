// SPDX-License-Identifier: Apache-2.0
// Sample style comparison: first-batch components in any story against their matrix story
// (TCRN-DS-STORY-128 GWT3, TCRN-DS-SUB-028).
import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import {
  COMPARED_PROPERTIES,
  FAILING_CAUSES,
  FIRST_BATCH_ROOTS,
  HEIGHT_ROOTS,
  MUTATIONS,
  classifySampleMismatch,
  collectSamplesInPage,
  compareSample,
  rereadWithoutDocLayerInPage,
  runDocSampleStyleProof,
  styleDiffs
} from "../scripts/doc-sample-style-proof.mjs";
import { GPLUS_MATRIX_STORY_IDS, STATIC_DOCS_ROOT } from "../scripts/lib/storybook-routes.mjs";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const fixtureRoot = fileURLToPath(new URL("./fixtures/geometry-measure/", import.meta.url));
const roots = [...new Set(Object.values(FIRST_BATCH_ROOTS).flat())];
let browser;

before(async () => {
  browser = await chromium.launch();
});

after(async () => {
  await browser?.close();
});

const page = (body, packageCss = "") => `<!doctype html><html><head>
<style data-tcrn-component-style-source="@tcrn/ui-react">
.tcrn-button { height: 32px; border-radius: 6px; color: rgb(22, 21, 15); background-color: rgb(255, 255, 255); font: 500 13px/20px sans-serif; border: 0 solid; }
.tcrn-button.tcrn-button--primary { color: rgb(255, 255, 255); background-color: rgb(11, 107, 101); }
.tcrn-button[aria-pressed="true"] { background-color: rgb(230, 240, 238); }
.tcrn-icon { width: 16px; height: 16px; }
${packageCss}
</style>
<style data-tcrn-static-doc-style-source="storybook">.doc-override .tcrn-button { border-radius: 0; }</style>
</head><body><main id="region">${body}</main></body></html>`;

async function collect(html, options = {}) {
  const tab = await browser.newPage();
  try {
    await tab.setContent(html);
    const result = await tab.evaluate(collectSamplesInPage, { regionSelector: "#region", roots, heightRoots: [...HEIGHT_ROOTS], properties: COMPARED_PROPERTIES, keep: true, ...options });
    const reread = options.reread ? await tab.evaluate(rereadWithoutDocLayerInPage, { indexes: options.reread, docStyleSelector: "style[data-tcrn-static-doc-style-source]", regionSelector: "#region" }) : null;
    return { ...result, reread };
  } finally {
    await tab.close();
  }
}

test("the first batch is the 23 matrix components and the compared groups follow STORY-128 GWT3", () => {
  assert.equal(Object.keys(FIRST_BATCH_ROOTS).length, 23);
  assert.deepEqual(Object.keys(COMPARED_PROPERTIES), ["font", "color", "background", "border", "radius", "height"]);
  assert.deepEqual([...FAILING_CAUSES], ["doc-stylesheet", "story-inline-style"]);
  assert.ok(MUTATIONS.length >= 1 && MUTATIONS.every((mutation) => mutation.storyId && mutation.css));
});

test("styleDiffs and compareSample report match, mismatch and uncovered", () => {
  assert.deepEqual(styleDiffs({ color: "a", height: "1px" }, { color: "a" }), []);
  assert.deepEqual(styleDiffs({ color: "a" }, { color: "b" }), [{ property: "color", story: "a", matrix: "b" }]);
  const sample = { styles: { color: "a", borderTopLeftRadius: "6px" } };
  assert.equal(compareSample(sample, []).status, "uncovered");
  assert.equal(compareSample(sample, [{ styles: { color: "x" } }, { styles: { color: "a", borderTopLeftRadius: "6px" } }]).status, "match");
  const mismatch = compareSample(sample, [{ element: "m", storyId: "actions-matrix", styles: { color: "a", borderTopLeftRadius: "0px" } }]);
  assert.equal(mismatch.status, "mismatch");
  assert.deepEqual(mismatch.diffs.map((diff) => diff.property), ["borderTopLeftRadius"]);
});

test("a sample signature carries its classes, styled state and first-batch parent", async () => {
  const { found, samples } = await collect(page(`
    <button class="tcrn-button tcrn-button--primary" data-unstyled="x"><svg class="tcrn-icon" width="16" height="16" aria-hidden="true"></svg></button>
    <button class="tcrn-button" aria-pressed="true">Pinned</button>
    <span class="wrapper-only"><svg class="tcrn-icon" width="16" height="16"></svg></span>`));
  assert.equal(found, true);
  const signatures = samples.map((sample) => sample.signature);
  assert.ok(signatures.includes("button.tcrn-button.tcrn-button--primary[]"), signatures.join("\n"));
  assert.ok(signatures.includes("button.tcrn-button.tcrn-button--primary[] > svg.tcrn-icon[size=16x16]"), signatures.join("\n"));
  assert.ok(signatures.includes("button.tcrn-button[aria-pressed=true]"), signatures.join("\n"));
  const topIcon = samples.find((sample) => sample.signature === "svg.tcrn-icon[size=16x16]");
  assert.ok(topIcon && !("color" in topIcon.styles), "a top-level icon takes its colour from the context");
  const nestedIcon = samples.find((sample) => sample.signature.endsWith("> svg.tcrn-icon[size=16x16]"));
  assert.equal(nestedIcon.styles.color, "rgb(255, 255, 255)");
  assert.equal(nestedIcon.styles.height, "16px");
});

test("a documentation-layer override is told apart from the package rendering", async () => {
  const html = page(`<div class="doc-override"><button class="tcrn-button">Export</button></div><button class="tcrn-button">Export</button>`);
  const { samples, reread } = await collect(html, { reread: [0, 1] });
  assert.equal(samples[0].styles.borderTopLeftRadius, "0px");
  assert.equal(samples[1].styles.borderTopLeftRadius, "6px");
  assert.equal(compareSample(samples[0], [{ styles: samples[1].styles }]).status, "mismatch");
  assert.equal(compareSample({ styles: reread[0].withoutDoc }, [{ styles: samples[1].styles }]).status, "match");
});

test("SearchInput references retain the owning drop-down, full-menu or Sheet role and raw height", async () => {
  const search = '<span class="tcrn-search-input"><input type="search" aria-expanded="false" class="tcrn-input tcrn-search-input__control"></span>';
  const { samples, reread } = await collect(page(`
    ${search}
    <section class="tcrn-shell-dropdown__panel">${search}</section>
    <section class="tcrn-shell-menu__panel">${search}</section>
    <section class="tcrn-shell-sheet__panel">${search}</section>
    <section class="tcrn-shell-sheet__panel"><span class="tcrn-search-input"><input type="search" aria-expanded="false" class="tcrn-input tcrn-search-input__control" style="height:40px"></span></section>
  `, `
    .tcrn-search-input__control { height:32px; padding:0; border:0; }
    .tcrn-shell-dropdown__panel .tcrn-search-input__control { height:28px; }
    .tcrn-shell-menu__panel .tcrn-search-input__control { height:40px; }
    .tcrn-shell-sheet__panel .tcrn-search-input__control { height:44px; }
  `), { reread: [9] });
  const controls = samples.filter((sample) => sample.classes.includes("tcrn-search-input__control"));
  assert.deepEqual(controls.map((sample) => sample.styles.height), ["32px", "28px", "40px", "44px", "40px"]);
  assert.equal(new Set(controls.slice(0, 4).map((sample) => sample.signature)).size, 4, "generic and all three owning roles stay distinct");
  assert.ok(controls[1].signature.startsWith("section.tcrn-shell-dropdown__panel >> "));
  assert.ok(controls[2].signature.startsWith("section.tcrn-shell-menu__panel >> "));
  assert.ok(controls[3].signature.startsWith("section.tcrn-shell-sheet__panel >> "));
  assert.equal(controls[4].signature, controls[3].signature, "an inline override cannot change the owning role");
  const mismatch = compareSample(controls[4], [controls[3]]);
  assert.deepEqual(mismatch.diffs, [{ property: "height", story: "40px", matrix: "44px" }]);
  assert.equal(classifySampleMismatch(mismatch.diffs, [controls[3]], reread[0]).cause, "story-inline-style");
  assert.equal(reread[0].withoutInline.height, "44px", "removing the override restores the genuine Sheet value");
});

test("a container-hidden icon cannot turn an observed height mismatch into an inline-style match", async () => {
  const tab = await browser.newPage();
  try {
    await tab.setContent(page(`<div class="owning" style="width:300px"><div class="pinned"><svg class="tcrn-icon" width="16" height="16"></svg></div></div>`));
    await tab.addStyleTag({ content: '.owning{container-type:inline-size}.pinned .tcrn-icon{height:22px}@container (min-width:500px){.pinned{display:none}}' });
    const { samples } = await tab.evaluate(collectSamplesInPage, { regionSelector: '#region', roots, heightRoots: [...HEIGHT_ROOTS], properties: COMPARED_PROPERTIES, keep: true });
    const [sample] = samples;
    const references = [{ styles: { ...sample.styles, height: '16px' } }];
    const mismatch = compareSample(sample, references);
    assert.deepEqual(mismatch.diffs, [{ property: 'height', story: '22px', matrix: '16px' }]);
    const [reread] = await tab.evaluate(rereadWithoutDocLayerInPage, { indexes: [0], docStyleSelector: 'style[data-tcrn-static-doc-style-source]', regionSelector: '#region' });
    assert.equal(reread.withoutDoc.height, '22px');
    assert.equal('height' in reread.withoutInline, false, 'removing the owning width hides the icon');
    const classification = classifySampleMismatch(mismatch.diffs, references, reread);
    assert.equal(classification.cause, 'package-context');
    assert.deepEqual(classification.evidence.withoutInline.missingProperties, ['height']);
    assert.equal(classification.evidence.withoutInline.matches, false);
    assert.equal(await tab.locator('.pinned .tcrn-icon').isVisible(), true, 'the original container is restored');
  } finally { await tab.close(); }
});

test("an observable inline icon-height override remains a failing inline-style cause", async () => {
  const { samples, reread } = await collect(page('<svg class="tcrn-icon" width="16" height="16" style="height:22px"></svg>'), { reread: [0] });
  const references = [{ styles: { ...samples[0].styles, height: '16px' } }];
  const mismatch = compareSample(samples[0], references);
  const classification = classifySampleMismatch(mismatch.diffs, references, reread[0]);
  assert.equal(classification.cause, 'story-inline-style');
  assert.deepEqual(classification.evidence.withoutInline.missingProperties, []);
  assert.equal(classification.evidence.withoutInline.matches, true);
});

test("the gate reports missing static docs instead of passing", async () => {
  const report = await runDocSampleStyleProof({ root: fixtureRoot, browser });
  assert.equal(report.ok, false);
  assert.equal(report.reason, "static_docs_missing");
});

test("on the built docs a documentation-layer override turns the gate red and the clean story stays green", { skip: !existsSync(fileURLToPath(new URL(`../${STATIC_DOCS_ROOT}`, import.meta.url))) && "static docs not built (pnpm build)" }, async () => {
  const report = await runDocSampleStyleProof({ root: repoRoot, browser, storyIds: ["button-spec-usage"], themes: ["light"] });
  assert.equal(report.reason === "matrix_stories_missing", false, `matrix stories missing: ${report.missingMatrices}`);
  assert.deepEqual(report.missingMatrices, []);
  assert.ok(report.references.light.samples > 0);
  const story = report.stories.find((item) => item.storyId === "button-spec-usage");
  assert.ok(story && story.matched > 0, "button-spec-usage compares first-batch samples");
  assert.equal(report.mismatches.filter((item) => FAILING_CAUSES.includes(item.cause)).length, 0);
  const [mutation] = report.mutations;
  assert.equal(mutation.id, MUTATIONS[0].id);
  assert.equal(mutation.killed, true);
  assert.ok(mutation.causes.includes("doc-stylesheet"));
  assert.ok(GPLUS_MATRIX_STORY_IDS.every((id) => !report.stories.some((item) => item.storyId === id)), "matrix stories are the reference, not compared with themselves");
});
