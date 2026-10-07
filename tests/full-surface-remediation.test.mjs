import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

const { JSDOM } = createRequire(new URL("../packages/ui-react/package.json", import.meta.url))("jsdom");
const staticRoot = join(process.cwd(), "apps/storybook/storybook-static");
const readPage = (file) => readFileSync(join(staticRoot, file), "utf8");

function assertCollectionInventory(document) {
  const collections = Array.from(document.querySelectorAll('[data-choice-cardinality="collection"]'));
  const dropdowns = collections.filter((node) => node.matches('div.tcrn-multi-select-dropdown[data-choice-presentation="dropdown"]'));
  const native = dropdowns.map((node) => node.querySelector('select.tcrn-multi-select-dropdown__value[multiple]')).filter(Boolean);
  const checklists = collections.filter((node) => node.matches('div[role="group"][data-choice-presentation="checkboxes"]'));
  assert.equal(collections.length, 2, "total collection inventory");
  assert.equal(dropdowns.length, 1, "dropdown collection inventory");
  assert.equal(native.length, 1, "native serialization inventory");
  const trigger = dropdowns[0].querySelector("button.tcrn-select[aria-haspopup=listbox]");
  assert.ok(trigger);
  assert.equal(trigger.getAttribute("aria-expanded"), "false");
  assert.match(trigger.textContent, /English.*Simplified Chinese/);
  const list = dropdowns[0].querySelector(".tcrn-menu[role=listbox]");
  assert.ok(list?.hidden);
  assert.equal(list.getAttribute("aria-multiselectable"), "true");
  assert.deepEqual(Array.from(list.querySelectorAll("[role=option][aria-selected=true]"), (option) => option.dataset.multiSelectValue), ["en", "zh-CN"]);
  assert.equal(list.querySelector("[data-multi-select-value=ja]")?.disabled, true);
  assert.equal(checklists.length, 1, "checkbox collection inventory");
  assert.ok(collections.every((node) => node.getAttribute("data-choice-value-mode") === "closed"));

  const select = native[0];
  assert.equal(select.name, "prompt-languages");
  assert.deepEqual(Array.from(select.options, (option) => option.value), ["en", "zh-CN", "ja"]);
  assert.deepEqual(Array.from(select.selectedOptions, (option) => option.value), ["en", "zh-CN"]);
  assert.deepEqual(Array.from(select.options).filter((option) => option.disabled).map((option) => option.value), ["ja"]);

  const checklist = checklists[0];
  assert.equal(checklist.id, "prompt-languages-checklist");
  const legend = document.getElementById(checklist.getAttribute("aria-labelledby"));
  assert.equal(legend?.tagName, "LEGEND");
  assert.ok(legend.closest("fieldset").contains(checklist));
  const checkboxes = Array.from(checklist.querySelectorAll('input[type="checkbox"]'));
  assert.deepEqual(checkboxes.map((input) => input.value), ["en", "zh-CN", "ja"]);
  assert.ok(checkboxes.every((input) => input.name === "prompt-languages-checklist" && input.closest("label")));
  assert.deepEqual(checkboxes.filter((input) => input.checked).map((input) => input.value), ["en", "zh-CN"]);
  assert.deepEqual(checkboxes.filter((input) => input.disabled).map((input) => input.value), ["ja"]);
  const clear = checklist.closest(".tcrn-multi-select-group").querySelector("button.tcrn-multi-select-group__clear");
  assert.equal(clear?.type, "button");
  assert.equal(clear?.textContent, "Clear selection");
  assert.equal(clear?.disabled, false);
}

test("STORY-113 static overlay inventory retains every tooltip placement and text-only boundary", () => {
  const html = readPage("components-component-inventory.html");
  assert.equal((html.match(/data-tooltip-scope="supplemental"/g) ?? []).length, 4);
  for (const placement of ["top", "right", "bottom", "left"]) {
    assert.match(html, new RegExp(`data-placement="${placement}"`));
  }
  assert.equal((html.match(/data-tooltip-interactive-content="forbidden"/g) ?? []).length, 4);
  assert.equal((html.match(/role="tooltip"/g) ?? []).length, 4);
});

test("STORY-114 static field surface carries one dropdown and one checkbox collection plus an open-value control", () => {
  const html = readPage("patterns-feedback-selection.html");
  const dom = new JSDOM(html);
  try {
    assertCollectionInventory(dom.window.document);
  } finally {
    dom.window.close();
  }
  assert.match(html, /data-choice-value-mode="closed"/);
  assert.equal((html.match(/data-choice-value-mode="open"/g) ?? []).length, 1);
  assert.match(html, /<select[^>]*multiple=""/);
  assert.match(html, /<option[^>]*value="ja"[^>]*disabled/);
  assert.equal((html.match(/<datalist /g) ?? []).length, 1);
});

test("STORY-114 inventory rejects missing, duplicate, mislabeled, or structurally invalid collection branches", () => {
  const html = readPage("patterns-feedback-selection.html");
  const cases = [
    ["missing dropdown", (_, __, dropdown) => dropdown.remove()],
    ["missing native serialization", (native) => native.remove()],
    ["missing checkbox", (_, checklist) => checklist.remove()],
    ["two dropdown collections at total two", (_, checklist, dropdown) => checklist.replaceWith(dropdown.cloneNode(true))],
    ["two checkbox collections at total two", (_, checklist, dropdown) => dropdown.replaceWith(checklist.cloneNode(true))],
    ["extra collection", (_, checklist) => checklist.after(checklist.cloneNode(true))],
    ["native without multiple", (native) => { native.multiple = false; }],
    ["checkbox marker without group structure", (_, checklist) => checklist.removeAttribute("role")],
    ["open collection", (_, checklist) => checklist.setAttribute("data-choice-value-mode", "open")],
    ["native disabled option lost", (native) => { native.querySelector('option[value="ja"]').disabled = false; }],
    ["checkbox disabled option lost", (_, checklist) => { checklist.querySelector('input[value="ja"]').disabled = false; }]
  ];
  for (const [reason, mutate] of cases) {
    const dom = new JSDOM(html);
    try {
      const document = dom.window.document;
      mutate(document.querySelector('select.tcrn-multi-select-dropdown__value'), document.querySelector('[data-choice-presentation="checkboxes"]'), document.querySelector('[data-choice-presentation="dropdown"]'));
      assert.throws(() => assertCollectionInventory(document), assert.AssertionError, reason);
    } finally {
      dom.window.close();
    }
  }
});

test("STORY-115 dictionary surface keeps category copy singular and value explanations complete", () => {
  const html = readPage("foundations-tokens-i18n.html");
  assert.equal((html.match(/data-dictionary-category="true"/g) ?? []).length, 2);
  assert.equal((html.match(/data-dictionary-valid="true"/g) ?? []).length, 2);
  assert.equal((html.match(/data-dictionary-category-description="true"/g) ?? []).length, 2);
  assert.equal((html.match(/data-dictionary-entry="true"/g) ?? []).length, 5);
  assert.equal((html.match(/data-dictionary-entry-description-present="true"/g) ?? []).length, 5);
  assert.equal((html.match(/data-dictionary-value="file"/g) ?? []).length, 1);
  assert.equal((html.match(/data-dictionary-value="file-segmented"/g) ?? []).length, 1);
  assert.equal((html.match(/data-dictionary-value="gate-close"/g) ?? []).length, 1);
  assert.equal((html.match(/data-dictionary-value="session-end"/g) ?? []).length, 1);
  assert.equal((html.match(/data-dictionary-value="manual"/g) ?? []).length, 1);
});

test("STORY-116 display surface keeps four operation phases, short status, identity, and details", () => {
  const html = readPage("components-component-inventory.html");
  assert.equal((html.match(/data-operation-feedback="true"/g) ?? []).length, 4);
  for (const phase of ["idle", "loading", "success", "error"]) {
    assert.match(html, new RegExp(`data-operation-feedback-phase="${phase}"`));
  }
  assert.equal((html.match(/data-operation-short-status="true"/g) ?? []).length, 4);
  assert.equal((html.match(/data-operation-identity="true"/g) ?? []).length, 4);
  assert.equal((html.match(/data-operation-details-trigger="true"/g) ?? []).length, 4);
  assert.equal((html.match(/data-operation-details="true"/g) ?? []).length, 4);
  assert.match(html, /data-operation-geometry="responsive-safe"/);
  assert.match(html, />Completed</);
  assert.match(html, />Failed</);
  assert.match(html, /reason-code-with-a-long-machine-suffix-2026-09-13/);
});

test("STORY-117 token surface keeps independent content scopes and distinct lifecycle states", () => {
  const html = readPage("foundations-tokens-i18n.html");
  assert.equal((html.match(/data-content-scope=/g) ?? []).length, 6);
  for (const scope of ["scope-a", "scope-b", "scope-filtered", "scope-loading", "scope-error", "scope-invalid"]) {
    assert.match(html, new RegExp(`data-content-scope="${scope}"`));
  }
  assert.match(html, /data-content-phase="content"[^>]*data-content-valid="true"/);
  assert.match(html, /data-content-phase="empty"[^>]*data-content-valid="true"/);
  assert.match(html, /data-content-phase="loading"[^>]*data-content-valid="true"/);
  assert.match(html, /data-content-phase="error"[^>]*data-content-valid="true"/);
  assert.match(html, /data-content-scope="scope-invalid"[^>]*data-content-valid="false"/);
  assert.match(html, /data-content-count-kind="filtered"/);
});

test("EPIC037 contract readback names the full-surface browser proof and package exports", () => {
  const contract = JSON.parse(readFileSync(join(staticRoot, "ai-consumption-contract.json"), "utf8"));
  assert.equal(contract.fieldValueSelectionContract.id, "field-value-selection-contract-v1");
  assert.deepEqual(contract.fieldValueSelectionContract.packageExports, ["SettingChoice", "Select", "RadioGroup", "MultiSelect", "mountStaticMultiSelect", "SuggestInput"]);
  assert.equal(contract.dictionaryContentContract.id, "dictionary-content-contract-v1");
  assert.deepEqual(contract.dictionaryContentContract.packageExports, ["DictionaryTable"]);
  assert.equal(contract.overlayBoundaryContract.id, "overlay-boundary-contract-v1");
  assert.ok(contract.overlayBoundaryContract.packageExports.includes("Tooltip"));
  assert.ok(contract.overlayBoundaryContract.packageExports.includes("Popover"));
  assert.ok(contract.overlayBoundaryContract.packageExports.includes("mountStaticOverlayBoundary"));
  assert.match(contract.overlayBoundaryContract.staticConsumerMigration.bootstrap, /tcrnComponentCss/);
  assert.match(contract.overlayBoundaryContract.staticConsumerMigration.behavior, /document\.body/);
  assert.equal(contract.consumerVerificationContract.browserScript, "scripts/full-surface-remediation-proof.mjs");
});

test("EPIC038 contract readback names operation feedback, content scopes, and one evidence validator", () => {
  const contract = JSON.parse(readFileSync(join(staticRoot, "ai-consumption-contract.json"), "utf8"));
  assert.equal(contract.operationFeedbackContract.id, "operation-feedback-contract-v1");
  assert.deepEqual(contract.operationFeedbackContract.phases, ["idle", "loading", "success", "error"]);
  assert.ok(contract.operationFeedbackContract.packageExports.includes("OperationFeedback"));
  assert.equal(contract.operationFeedbackContract.phaseSemantics.find((entry) => entry.phase === "loading").labels.en, "In progress");
  assert.match(contract.operationFeedbackContract.stateContract, /must equal phase/);
  assert.equal(contract.contentScopeContract.id, "content-scope-contract-v1");
  assert.match(contract.contentScopeContract.renderedContentEvidence, /empty fragments/);
  assert.ok(contract.contentScopeContract.packageExports.includes("validateContentScope"));
  assert.equal(contract.consumerEvidenceContract.id, "consumer-evidence-verification-contract-v1");
  assert.equal(contract.consumerEvidenceContract.utility, "evaluateConsumerEvidence");
  assert.deepEqual(contract.consumerEvidenceContract.valueEvidence.observedFields, ["key", "serialization", "submittedValue", "serializedValue", "readbackValue"]);
  assert.deepEqual(contract.consumerEvidenceContract.zoomAxes, ["dpr", "pinch-visual-viewport", "page-zoom"]);
  assert.equal(contract.consumerVerificationContract.evidenceValidator, "evaluateConsumerEvidence");
  assert.ok(contract.requiredReadbackFields.includes("consumerEvidenceContract"));
  assert.ok(contract.requiredProof.includes("consumer_evidence_verification_receipt"));
});

function assertPublicTokenReferences(tokens, css) {
  const defined = new Set([...tokens.matchAll(/(--tcrn-[\w-]+)\s*:/g), ...css.matchAll(/(--tcrn-[\w-]+)\s*:/g)].map((match) => match[1]));
  const missing = [...new Set([...tokens.matchAll(/var\((--tcrn-[\w-]+)/g), ...css.matchAll(/var\((--tcrn-[\w-]+)/g)].map((match) => match[1]))].filter((variable) => !defined.has(variable) && !["--tcrn-table-column-count", "--tcrn-table-shell-column-min-width"].includes(variable));
  assert.deepEqual(missing, [], "every public component reference has a shipped token or scoped definition");
}

test("public component tokens are complete and a missing menu surface is refused", async () => {
  const { tcrnTokenCss } = await import("../packages/ui-tokens/dist/index.js");
  const { tcrnComponentCss } = await import("../packages/ui-react/dist/index.js");
  assertPublicTokenReferences(tcrnTokenCss, tcrnComponentCss);
  assert.throws(() => assertPublicTokenReferences(tcrnTokenCss.replace(/^  --tcrn-color-surface-panel:.*\n/gm, ""), tcrnComponentCss), assert.AssertionError);
  assert.match(tcrnComponentCss, /\.tcrn-menu\s*\{[^}]*background:\s*var\(--tcrn-color-surface-panel\)/);
});
