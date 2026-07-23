// Content-explosion budget gates — TCRN-DS-STORY-052 (EPIC-018).
//
// A single canonical audited-debt ledger + a pure, budget-agnostic evaluator. Both the
// browser proof (story-height) and the storybook smoke (page-bytes, category-story-count)
// import this file so there is exactly one place the budgets and the grace allowlists live.
//
// WHY THESE GATES EXIST
// The contract-docs site had grown a handful of mega-stories and one bloated page with no
// machine that could SEE the growth: nothing compared a rendered story height, a page's
// byte size, or a category's story count to a ceiling. These gates make the explosion
// visible. Two of the three (story-height, page-bytes) ARRIVE RED against the current site
// — the only thing keeping `pnpm verify` green is the seeded grace allowlist, and that
// allowlist IS the split worklist that TCRN-DS-STORY-059 / -054 / -056 / -057 burn down.
//
// WHY 2000px FOR STORY HEIGHT (detection-derived, not a round number)
// The perceptual visual-signature gate (scripts/lib/visual-signature.mjs) downscales each
// per-story capture to a SIGNATURE_GRID = 16 vertical band and gates on
// SIGNATURE_TOLERANCE.maxCell = 8. A single ~30px design-token band in a tall story is
// diluted across those 16 cells until it falls under the maxCell floor — i.e. above roughly
// 2000px on desktop a real single-token regression can no longer trip the signature gate.
// 2000px is therefore the desktop DETECTION floor, not an aesthetic preference. Scope is
// desktop-1440x900 only: tablet/mobile single-column heights are inherently larger and are
// a conscious NON-scope (they are not gated here).
//
// WHY 1,000,000 BYTES FOR PAGE SIZE
// Every built page carries a ~676KB fixed floor (global dictionary + CSS), so the six
// non-Components pages sit in the 770-855KB band. A 1,000,000B budget flags exactly the
// current outlier (Components) and names the true split target, rather than the shared
// payload floor that TCRN-DS-STORY-054 owns. Keep it loose on purpose.
//
// WHY category-story-count CAP = 8 (preventive, GREEN today)
// The current max stories in any one section/category is 4. This cap does NOT arrive red;
// it is a forward guard so a post-split reshuffle (S056/S059) cannot silently stuff a
// category. Documented departure from "all budget gates arrive red": only height + page-KB
// arrive red.
//
// BIDIRECTIONAL ALLOWLIST IDIOM (mirrors scripts/token-extension-proof.mjs:82-96)
//   1. A NEW over-budget item that is NOT allowlisted FAILS (catches fresh explosion).
//   2. An allowlist entry that no longer qualifies FAILS (catches stale debt): the item has
//      dropped under budget, or disappeared entirely, or its recorded size has drifted away
//      from reality. All three mean "remove or update this entry" — this is the mechanism by
//      which the debt shrinks as E020 lands. Downstream stories MUST update this ledger in
//      the SAME commit that shrinks/splits a story, or the stale-entry check fails.
//
// The recorded* sizes below are seeded from CURRENT measured reality (desktop story heights
// from docs/verification/internal-alpha/browser-proof-summary.json; page bytes and category
// counts from the built apps/storybook/storybook-static/*.html + ai-consumption-contract.json),
// NOT from any earlier audit snapshot. A stale recorded value fails its own gate.

import { pathToFileURL } from "node:url";

export const STORY_HEIGHT_BUDGET_PX = 2000;
export const STORY_HEIGHT_BUDGET_VIEWPORT = "desktop-1440x900";

// One entry per story that CURRENTLY renders > STORY_HEIGHT_BUDGET_PX on desktop. Seeded
// from the current browser-proof-summary.json desktop heights (11 violators). Note:
// work-management-patterns is deliberately ABSENT — Batch 2 (S047) trimmed it from 4119px to
// ~1792px, so it is now under budget and must not be allowlisted. Each entry's owedTo names
// the split/reclassify story that will retire the entry.
export const STORY_HEIGHT_GRACE_ALLOWLIST = {
  "aos-owner-quality-product-shell": {
    recordedHeightPx: 15285,
    owedTo: "TCRN-DS-STORY-057/059",
    note: "AOS owner-quality product-shell oracle; move to Proof (S057) then split (S059)"
  },
  "aos-frontend-shell-slice": {
    recordedHeightPx: 12448,
    owedTo: "TCRN-DS-STORY-057/059",
    note: "AOS frontend shell-slice oracle; move to Proof (S057) then split (S059)"
  },
  "work-management-components-spec": {
    recordedHeightPx: 9191,
    owedTo: "TCRN-DS-STORY-059",
    note: "monolithic components spec; split into per-family stories"
  },
  "component-family-index": {
    recordedHeightPx: 7802,
    owedTo: "TCRN-DS-STORY-058/059",
    note: "full component-family index page; category landing (S058) + split (S059)"
  },
  "navigation-shell-spec": {
    recordedHeightPx: 6009,
    owedTo: "TCRN-DS-STORY-059",
    note: "navigation shell spec; split into per-family stories"
  },
  "ai-consumption-contract": {
    recordedHeightPx: 5069,
    owedTo: "TCRN-DS-STORY-059",
    note: "full AI-consumption contract readback; split"
  },
  "color-palette": {
    recordedHeightPx: 4659,
    owedTo: "TCRN-DS-STORY-059",
    note: "full color palette gallery; split"
  },
  "knowledge-management-components-spec": {
    recordedHeightPx: 3497,
    owedTo: "TCRN-DS-STORY-059",
    note: "knowledge-management components spec; split into per-family stories"
  },
  "foundation-visual-standards": {
    recordedHeightPx: 3350,
    owedTo: "TCRN-DS-STORY-059",
    note: "foundation visual standards catalogue; split"
  },
  "text-styles": {
    recordedHeightPx: 2409,
    owedTo: "TCRN-DS-STORY-059",
    note: "type-scale specimen catalogue; split"
  },
  "icons-motion": {
    recordedHeightPx: 2041,
    owedTo: "TCRN-DS-STORY-059",
    note: "icon + motion catalogue; split"
  }
};

export const PAGE_KB_BUDGET_BYTES = 1_000_000;

// One entry per built page that CURRENTLY exceeds PAGE_KB_BUDGET_BYTES. Seeded from the
// current built apps/storybook/storybook-static/*.html byte sizes. Components is the sole
// outlier; the other six pages sit on the shared ~676KB dict+CSS floor.
export const PAGE_KB_GRACE_ALLOWLIST = {
  Components: {
    recordedBytes: 1418319,
    owedTo: "TCRN-DS-STORY-054/056/057",
    note: "AOS oracle bulk + global dict; prune payload (S054) + reclassify (S056/S057)"
  }
};

export const CATEGORY_STORY_COUNT_CAP = 8;

// Preventive ceiling — GREEN today (current max stories/category is 4). No debt owed.
export const CATEGORY_STORY_COUNT_GRACE_ALLOWLIST = {};

/**
 * Pure, budget-agnostic evaluator. Mirrors the two-directional intent of
 * scripts/token-extension-proof.mjs:82-96.
 *
 * @param {object}   input
 * @param {string}   input.label      human name of the budget (for the receipt)
 * @param {Array<{id:string, measure:number}>} input.items  measured surface, one per id
 * @param {number}   input.budget     the ceiling; measure > budget is "over"
 * @param {Record<string, object>} input.allowlist  audited-debt entries keyed by id
 * @param {string=}  input.recordedKey  name of the recorded-size field on allowlist entries
 *                                       (e.g. "recordedHeightPx" / "recordedBytes"); when
 *                                       present, an allowlisted item whose recorded size no
 *                                       longer matches its current measure (beyond tolerance)
 *                                       is flagged stale so the number stays honest.
 * @param {number=}  input.recordedToleranceFraction  drift allowance as a fraction of the
 *                                       recorded value (default 1%).
 * @param {number=}  input.recordedToleranceFloor     minimum absolute drift allowance
 *                                       (default 2 units) so tiny budgets do not go brittle.
 * @returns {{label:string, ok:boolean, budget:number,
 *            unbudgetedViolations:Array, staleAllowlist:Array, toleratedDebt:Array}}
 */
export function evaluateBudget({
  label,
  items,
  budget,
  allowlist,
  recordedKey,
  recordedToleranceFraction = 0.01,
  recordedToleranceFloor = 2
}) {
  const has = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

  // Direction 1: over-budget items. Allowlisted => tolerated debt; not => hard violation.
  const unbudgetedViolations = [];
  const toleratedDebt = [];
  for (const item of items) {
    if (!(item.measure > budget)) continue;
    if (has(allowlist, item.id)) {
      // Merge the allowlist meta (recorded size / owedTo / note) onto the live measure.
      toleratedDebt.push({ id: item.id, measure: item.measure, ...allowlist[item.id] });
    } else {
      unbudgetedViolations.push({ id: item.id, measure: item.measure, budget });
    }
  }

  // Direction 2: stale allowlist entries. An entry is stale when the item has vanished from
  // the measured set, has dropped to/under budget, or its recorded size has drifted away
  // from the current measure. Every case means "remove or update this entry".
  const staleAllowlist = [];
  for (const id of Object.keys(allowlist)) {
    const it = items.find((entry) => entry.id === id);
    if (!it) {
      staleAllowlist.push({ id, reason: "absent", note: "story no longer measured — remove entry" });
      continue;
    }
    if (it.measure <= budget) {
      staleAllowlist.push({
        id,
        reason: "under-budget",
        current: it.measure,
        budget,
        note: "no longer over budget — remove entry"
      });
      continue;
    }
    if (recordedKey && has(allowlist[id], recordedKey)) {
      const recorded = allowlist[id][recordedKey];
      const tolerance = Math.max(recordedToleranceFloor, Math.round(recorded * recordedToleranceFraction));
      if (Math.abs(it.measure - recorded) > tolerance) {
        staleAllowlist.push({
          id,
          reason: "recorded-drift",
          recorded,
          current: it.measure,
          tolerance,
          note: `${recordedKey} drifted from current measure — update the entry to the current value`
        });
      }
    }
  }

  const ok = unbudgetedViolations.length === 0 && staleAllowlist.length === 0;
  return { label, ok, budget, unbudgetedViolations, staleAllowlist, toleratedDebt };
}

// pathToFileURL, not string concatenation: this repository lives under a path with a space,
// so `file://${argv[1]}` never matches the percent-encoded import.meta.url. Running this
// module directly prints the ledger (budgets + allowlist sizes) for inspection; it does not
// evaluate live surfaces — those are supplied by the browser proof and the smoke script.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(JSON.stringify({
    storyHeight: {
      budgetPx: STORY_HEIGHT_BUDGET_PX,
      viewport: STORY_HEIGHT_BUDGET_VIEWPORT,
      allowlistedDebtCount: Object.keys(STORY_HEIGHT_GRACE_ALLOWLIST).length
    },
    pageBytes: {
      budgetBytes: PAGE_KB_BUDGET_BYTES,
      allowlistedDebtCount: Object.keys(PAGE_KB_GRACE_ALLOWLIST).length
    },
    categoryStoryCount: {
      cap: CATEGORY_STORY_COUNT_CAP,
      allowlistedDebtCount: Object.keys(CATEGORY_STORY_COUNT_GRACE_ALLOWLIST).length
    }
  }, null, 2));
}
