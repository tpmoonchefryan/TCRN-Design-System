import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const staticRoot = join(process.cwd(), "apps/storybook/storybook-static");
const readPage = (file) => readFileSync(join(staticRoot, file), "utf8");

test("STORY-113 static overlay inventory retains every tooltip placement and text-only boundary", () => {
  const html = readPage("components-component-inventory.html");
  assert.equal((html.match(/data-tooltip-scope="supplemental"/g) ?? []).length, 4);
  for (const placement of ["top", "right", "bottom", "left"]) {
    assert.match(html, new RegExp(`data-placement="${placement}"`));
  }
  assert.equal((html.match(/data-tooltip-interactive-content="forbidden"/g) ?? []).length, 4);
  assert.equal((html.match(/role="tooltip"/g) ?? []).length, 4);
});

test("STORY-114 static field surface carries native collection and open-value controls", () => {
  const html = readPage("patterns-feedback-selection.html");
  assert.equal((html.match(/data-choice-cardinality="collection"/g) ?? []).length, 1);
  assert.match(html, /data-choice-value-mode="closed"/);
  assert.equal((html.match(/data-choice-value-mode="open"/g) ?? []).length, 1);
  assert.match(html, /<select[^>]*multiple=""/);
  assert.match(html, /<option[^>]*value="ja"[^>]*disabled/);
  assert.equal((html.match(/<datalist /g) ?? []).length, 1);
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
  assert.deepEqual(contract.fieldValueSelectionContract.packageExports, ["SettingChoice", "Select", "RadioGroup", "MultiSelect", "SuggestInput"]);
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
  assert.equal(contract.contentScopeContract.id, "content-scope-contract-v1");
  assert.ok(contract.contentScopeContract.packageExports.includes("validateContentScope"));
  assert.equal(contract.consumerEvidenceContract.id, "consumer-evidence-verification-contract-v1");
  assert.equal(contract.consumerEvidenceContract.utility, "evaluateConsumerEvidence");
  assert.deepEqual(contract.consumerEvidenceContract.zoomAxes, ["dpr", "pinch-visual-viewport", "page-zoom"]);
  assert.equal(contract.consumerVerificationContract.evidenceValidator, "evaluateConsumerEvidence");
  assert.ok(contract.requiredReadbackFields.includes("consumerEvidenceContract"));
  assert.ok(contract.requiredProof.includes("consumer_evidence_verification_receipt"));
});
