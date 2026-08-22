import assert from "node:assert/strict";
import test from "node:test";
import { judgePublicNames, readPublicNamingInputs, REGISTERED_PUBLIC_NAME_DEBT } from "./public-naming-proof.mjs";

test("the current release surface has functional names and an active empty debt register", () => {
  const result = judgePublicNames(readPublicNamingInputs());
  assert.equal(result.ok, true, JSON.stringify(result, null, 2));
  assert.equal(result.registeredDebt, REGISTERED_PUBLIC_NAME_DEBT.length);
  assert.equal(result.staleDebt.length, 0);
  assert.ok(result.checked.categories > 0);
  assert.ok(result.checked.stories > 0);
  assert.ok(result.checked.localeLabels >= result.checked.stories * 5);
});

test("a product-named story, category, or translated title is named in the red receipt", () => {
  const result = judgePublicNames({
    categories: [{ id: "work-management", label: "Records" }],
    stories: [{ id: "aos-shell-spec" }],
    localeLabels: [{ id: "neutral-story", locale: "en", value: "TMS shell" }],
    debt: []
  });
  assert.equal(result.ok, false);
  assert.deepEqual(result.violations.map((entry) => `${entry.surface}:${entry.term}`), [
    "category:work-management",
    "story:aos",
    "story-title:tms"
  ]);
});

test("a debt entry that has left the release surface is reported stale", () => {
  const result = judgePublicNames({
    categories: [{ id: "records", label: "Records" }],
    stories: [{ id: "records-spec" }],
    localeLabels: [{ id: "records-spec", locale: "en", value: "Records" }],
    debt: [{ surface: "story", id: "old-work-story", value: "old-work-story" }]
  });
  assert.equal(result.ok, false);
  assert.equal(result.violations.length, 0);
  assert.equal(result.staleDebt.length, 1);
});
