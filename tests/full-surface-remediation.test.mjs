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

test("EPIC037 contract readback names the full-surface browser proof and package exports", () => {
  const contract = JSON.parse(readFileSync(join(staticRoot, "ai-consumption-contract.json"), "utf8"));
  assert.equal(contract.fieldValueSelectionContract.id, "field-value-selection-contract-v1");
  assert.deepEqual(contract.fieldValueSelectionContract.packageExports, ["SettingChoice", "Select", "RadioGroup", "MultiSelect", "SuggestInput"]);
  assert.equal(contract.dictionaryContentContract.id, "dictionary-content-contract-v1");
  assert.deepEqual(contract.dictionaryContentContract.packageExports, ["DictionaryTable"]);
  assert.equal(contract.overlayBoundaryContract.id, "overlay-boundary-contract-v1");
  assert.ok(contract.overlayBoundaryContract.packageExports.includes("Tooltip"));
  assert.ok(contract.overlayBoundaryContract.packageExports.includes("Popover"));
  assert.equal(contract.consumerVerificationContract.browserScript, "scripts/full-surface-remediation-proof.mjs");
});
