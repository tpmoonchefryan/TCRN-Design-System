import assert from "node:assert/strict";
import test from "node:test";
import {
  evaluateBudget,
  STORY_HEIGHT_BUDGET_PX,
  STORY_HEIGHT_GRACE_ALLOWLIST,
  CATEGORY_STORY_COUNT_CAP,
  CATEGORY_STORY_COUNT_GRACE_ALLOWLIST
} from "../scripts/lib/story-budget.mjs";

const height = (id, measure, entry = STORY_HEIGHT_GRACE_ALLOWLIST[id]) => evaluateBudget({
  label: "story-height",
  items: [{ id, measure }],
  budget: STORY_HEIGHT_BUDGET_PX,
  allowlist: { [id]: entry },
  recordedKey: "recordedHeightPx"
});

for (const [id, center, tolerance] of [
  ["owner-quality-product-shell", 7969, 79],
  ["frontend-shell-slice", 7672, 76],
  ["shell-top-band", 9224, 83]
]) {
  test(`${id}: refreshed center and original fixed pixel boundaries`, () => {
    const entry = STORY_HEIGHT_GRACE_ALLOWLIST[id];
    assert.equal(entry.recordedHeightPx, center);
    assert.equal(entry.recordedTolerancePx, tolerance);
    for (const measure of [center, center - tolerance, center + tolerance]) assert.equal(height(id, measure).ok, true);
    for (const measure of [center - tolerance - 1, center + tolerance + 1]) {
      const result = height(id, measure);
      assert.equal(result.ok, false);
      assert.equal(result.staleAllowlist[0].reason, "recorded-drift");
      assert.equal(result.staleAllowlist[0].tolerance, tolerance);
    }
  });
}

test("explicit height tolerance rejects invalid metadata without a fallback", () => {
  for (const recordedTolerancePx of [-1, NaN, Infinity, -Infinity, "79", null, true, undefined]) {
    const result = height("bad", 7969, { recordedHeightPx: 7969, recordedTolerancePx });
    assert.equal(result.ok, false, String(recordedTolerancePx));
    assert.equal(result.staleAllowlist[0].reason, "invalid-recorded-tolerance");
  }
  assert.equal(height("zero", 2100, { recordedHeightPx: 2100, recordedTolerancePx: 0 }).ok, true);
  assert.equal(height("zero", 2101, { recordedHeightPx: 2100, recordedTolerancePx: 0 }).ok, false);
});

test("absent and under-budget debt and new over-budget stories still fail", () => {
  const evaluate = (items, allowlist) => evaluateBudget({ label: "height", items, budget: 2000, allowlist, recordedKey: "recordedHeightPx" });
  assert.equal(evaluate([], { old: { recordedHeightPx: 2100 } }).staleAllowlist[0].reason, "absent");
  assert.equal(evaluate([{ id: "old", measure: 2000 }], { old: { recordedHeightPx: 2100 } }).staleAllowlist[0].reason, "under-budget");
  const fresh = evaluate([{ id: "new", measure: 2001 }], {});
  assert.equal(fresh.ok, false);
  assert.deepEqual(fresh.unbudgetedViolations, [{ id: "new", measure: 2001, budget: 2000 }]);
});

test("entries without an explicit height tolerance retain the fraction/floor formula", () => {
  for (const [id, entry] of Object.entries(STORY_HEIGHT_GRACE_ALLOWLIST)) {
    if (Object.hasOwn(entry, "recordedTolerancePx")) continue;
    const tolerance = Math.max(2, Math.round(entry.recordedHeightPx * 0.01));
    assert.equal(height(id, entry.recordedHeightPx + tolerance).ok, true);
    assert.equal(height(id, entry.recordedHeightPx - tolerance).ok, true);
    assert.equal(height(id, entry.recordedHeightPx + tolerance + 1).ok, false);
  }
  const base = { label: "default", items: [{ id: "small", measure: 13 }], budget: 8, allowlist: { small: { value: 11 } }, recordedKey: "value" };
  assert.equal(evaluateBudget(base).ok, true); // default floor = 2
  assert.equal(evaluateBudget({ ...base, items: [{ id: "small", measure: 14 }] }).ok, false);
  assert.equal(evaluateBudget({ ...base, items: [{ id: "small", measure: 14 }], recordedToleranceFraction: 0.3, recordedToleranceFloor: 0 }).ok, true);
});

test("category behavior, ceiling and the eleven debt identities/owners are unchanged", () => {
  assert.equal(STORY_HEIGHT_BUDGET_PX, 2000);
  assert.deepEqual(Object.fromEntries(Object.entries(STORY_HEIGHT_GRACE_ALLOWLIST).map(([id, entry]) => [id, entry.owedTo])), {
    "owner-quality-product-shell": "beyond-INIT-008", "frontend-shell-slice": "beyond-INIT-008",
    "component-family-index": "beyond-INIT-008", "display-primitives-spec": "INIT-029/S254",
    "ai-consumption-contract": "beyond-INIT-008", "color-palette": "beyond-INIT-008",
    "foundation-visual-standards": "beyond-INIT-008", "text-styles": "beyond-INIT-008",
    "icons-motion": "beyond-INIT-008", "shell-top-band": "beyond-INIT-016", "shell-mobile": "beyond-INIT-016"
  });
  assert.equal(CATEGORY_STORY_COUNT_CAP, 8);
  const category = (measure, entry = CATEGORY_STORY_COUNT_GRACE_ALLOWLIST["Components/navigation-shells"]) => evaluateBudget({
    label: "category-story-count", items: [{ id: "Components/navigation-shells", measure }], budget: CATEGORY_STORY_COUNT_CAP,
    allowlist: { "Components/navigation-shells": entry }, recordedKey: "recordedStoryCount"
  });
  assert.equal(category(11).ok, true);
  assert.equal(category(13).ok, true);
  assert.equal(category(14).ok, false);
  assert.equal(category(8).staleAllowlist[0].reason, "under-budget");
  assert.equal(category(13, { recordedStoryCount: 11, recordedTolerancePx: -1 }).ok, true);
});
