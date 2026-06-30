import test from "node:test";
import assert from "node:assert/strict";
import {
  findForbiddenPositiveClaimHits,
  findRawEnumLabelHits,
  presentCopyState,
  resolveTcrnLocale,
  tcrnDefaultLocale,
  tcrnFallbackLocale,
  tcrnI18nContract,
  tcrnSupportedLocales
} from "./index.js";

test("known states present without acceptance claims", () => {
  const result = presentCopyState({ state: "proof_required" });
  assert.equal(result.state, "proof_required");
  assert.equal(result.locale, "en");
  assert.equal(result.tone, "warning");
  assert.equal(result.productAcceptanceClaim, false);
  assert.equal(result.finalMvpAcceptanceClaim, false);
  assert.equal(result.releaseReadinessClaim, false);
  assert.equal(result.publicationClaim, false);
  assert.equal(result.ownerIntentActionClaim, false);
});

test("i18n contract fixes supported locale order and fallback", () => {
  assert.deepEqual([...tcrnSupportedLocales], ["zh-CN", "en", "ja", "ko", "fr"]);
  assert.equal(tcrnDefaultLocale, "en");
  assert.equal(tcrnFallbackLocale, "en");
  assert.equal(tcrnI18nContract.rawEnumLabelsAllowed, false);
  assert.equal(tcrnI18nContract.untranslatedCopyStateAllowed, false);
  assert.equal(resolveTcrnLocale("zh-CN"), "zh-CN");
  assert.equal(resolveTcrnLocale("de"), "en");
});

test("copy-state presentation is localized for required locales", () => {
  assert.equal(presentCopyState({ state: "not_claimed" }, "zh-CN").label, "未声明");
  assert.equal(presentCopyState({ state: "review_required" }, "zh-CN").label, "需要评审");
  assert.equal(presentCopyState({ state: "review_required" }, "en").label, "Review required");
  assert.equal(presentCopyState({ state: "not_claimed" }, "en").label, "Not claimed");
  assert.equal(presentCopyState({ state: "not_claimed" }, "ja").label, "未主張");
  assert.equal(presentCopyState({ state: "not_claimed" }, "ko").label, "주장하지 않음");
  assert.equal(presentCopyState({ state: "not_claimed" }, "fr").label, "Non revendiqué");
  for (const locale of tcrnSupportedLocales) {
    const result = presentCopyState({ state: "external_proof_needed" }, locale);
    assert.equal(result.locale, locale);
    assert.deepEqual(findRawEnumLabelHits(result.label), []);
    assert.deepEqual(findForbiddenPositiveClaimHits(result.label), []);
  }
});

test("unknown and future states fail closed", () => {
  const result = presentCopyState({ state: "externally_live" });
  assert.equal(result.state, "unknown");
  assert.match(result.description, /fail-closed/);
});

test("fixture, external proof, unavailable, and not claimed states remain non-acceptance states", () => {
  for (const state of ["fixture_only", "external_proof_needed", "unavailable", "not_claimed"]) {
    const result = presentCopyState({ state });
    assert.equal(result.state, state);
    assert.equal(result.productAcceptanceClaim, false);
    assert.equal(result.finalMvpAcceptanceClaim, false);
    assert.equal(result.releaseReadinessClaim, false);
    assert.equal(result.publicationClaim, false);
    assert.equal(result.ownerIntentActionClaim, false);
  }
});

test("raw blank or padded future enum values fail closed", () => {
  assert.equal(presentCopyState({ state: "   " }).state, "unknown");
  assert.equal(presentCopyState({ state: " release_ready " }).state, "unknown");
  assert.equal(presentCopyState({ state: " local_only " }).state, "local_only");
});

test("custom labels with forbidden positive claims fail closed", () => {
  const future = presentCopyState({ state: "future_live", label: "Release ready" });
  assert.equal(future.state, "unknown");
  assert.equal(future.label, "Unknown");
  assert.deepEqual(findForbiddenPositiveClaimHits(future.label), []);

  const known = presentCopyState({ state: "local_only", label: "Product accepted" });
  assert.equal(known.state, "local_only");
  assert.equal(known.label, "Local proof only");
  assert.deepEqual(findForbiddenPositiveClaimHits(known.label), []);
});

test("custom raw enum labels fail closed before reaching UI", () => {
  const result = presentCopyState({ state: "external_proof_needed", label: "external_proof_required" });
  assert.equal(result.state, "external_proof_needed");
  assert.equal(result.label, "External proof needed");
  assert.deepEqual(findRawEnumLabelHits("external_proof_required"), ["external_proof_required"]);
  assert.deepEqual(findRawEnumLabelHits(result.label), []);
});

test("safe custom labels remain available without overclaiming", () => {
  const result = presentCopyState({ state: "external_proof_needed", label: "Needs coordinator review" });
  assert.equal(result.label, "Needs coordinator review");
  assert.deepEqual(findForbiddenPositiveClaimHits(result.label), []);
});

test("forbidden positive claim scan catches overclaim phrases", () => {
  assert.deepEqual(findForbiddenPositiveClaimHits("local proof only"), []);
  assert.deepEqual(findForbiddenPositiveClaimHits("Product accepted and release ready"), [
    "product accepted",
    "release ready"
  ]);
});
