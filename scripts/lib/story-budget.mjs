// Content-explosion budget gates — TCRN-DS-STORY-052 (EPIC-018).
//
// A single canonical audited-debt ledger + a pure, budget-agnostic evaluator for two
// budgets: the browser proof (story-height) and the storybook smoke (category-story-count)
// import this file so there is exactly one place the budgets and the grace allowlists live.
//
// WHY THESE GATES EXIST
// The contract-docs site had grown a handful of mega-stories with no machine that could
// SEE the growth: nothing compared a rendered story height or a category's story count to
// a ceiling. These gates make the explosion visible. The story-height gate ARRIVES RED
// against the current site — the only thing keeping `pnpm verify` green is the seeded
// grace allowlist, and that allowlist IS the split worklist that TCRN-DS-STORY-059 / -057
// burn down.
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
// WHY category-story-count CAP = 8 (preventive, GREEN today)
// The current max stories in any one section/category is 4. This cap does NOT arrive red;
// it is a forward guard so a post-split reshuffle (S056/S059) cannot silently stuff a
// category. Documented departure from "all budget gates arrive red": only story height
// arrives red.
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
// from docs/verification/internal-alpha/browser-proof-summary.json; category counts from the
// built apps/storybook/storybook-static/ai-consumption-contract.json), NOT from any earlier
// audit snapshot. A stale recorded value fails its own gate.

import { pathToFileURL } from "node:url";

export const STORY_HEIGHT_BUDGET_PX = 2000;
export const STORY_HEIGHT_BUDGET_VIEWPORT = "desktop-1440x900";

// One entry per story that CURRENTLY renders > STORY_HEIGHT_BUDGET_PX on desktop. Seeded
// from the current browser-proof-summary.json desktop heights (11 violators). Note:
// records-and-boards-patterns is deliberately ABSENT — Batch 2 (S047) trimmed it from 4119px to
// ~1792px, so it is now under budget and must not be allowlisted. Each entry's owedTo names
// the split/reclassify story that will retire the entry.
// Reconciled after TCRN-DS-STORY-059 split the three targeted component mega-stories
// (records-and-boards / documents-and-collaboration / navigation-shell). navigation-shell-spec
// and documents-and-collaboration-components-spec now render under budget and are retired.
// The residual 10 fall in two classes: (a) the two functional-display children S059 could not push under a
// coherent unit (the 24-row single-registry readback table; the hierarchy+stages+references panel),
// and (b) inherently-tall visual-instance oracles + Style-Guide/Foundations/Proof specimen
// catalogues that were NOT in S059's 3-mega-story scope. The budget gate makes their height
// VISIBLE and GATED (the governance win); a per-catalogue / per-oracle split is tracked debt
// beyond INIT-008's 17 stories. Every recorded value is the current measured desktop height.
export const STORY_HEIGHT_GRACE_ALLOWLIST = {
  "owner-quality-product-shell": {
    // 14943 -> 16387 (INC-399 R44): record rows stack at their own compact boundary and row badges wrap in every shell instance.
    recordedHeightPx: 16387,
    owedTo: "beyond-INIT-008",
    note: "AOS owner-quality visual-instance oracle (full ProductShell renders); inherently tall — gated debt, per-viewport oracle split is future work"
  },
  "frontend-shell-slice": {
    // 8806 -> 9659 (INC-399 R44): KeyValueList fields render the package label-above-value geometry once the docs-only label grid was removed.
    recordedHeightPx: 9659,
    owedTo: "beyond-INIT-008",
    note: "AOS frontend-shell-slice visual-instance oracle; inherently tall — gated debt"
  },
  "component-family-index": {
    // 3048 -> 3105 (TCRN-DS-INC-008): registering MobileNavToggle — a component the
    // package had exported all along under no roster — added the 121st cell to the
    // links grid and with it one row.
    // 3105 -> 3281 (TCRN-DS-INIT-012): the public utility roster went from eight
    // entries to twelve when the CSS partition shipped its two sheets and two
    // helpers, and this story renders that roster as a table.
    // 3281 -> 2978: the same story renders the public component roster after the
    // functional data-display patterns were merged into core. This is the first
    // time the number has gone DOWN, and that is the point of INIT-012.
    // 3057 -> 3145 (EPIC038 correction): the public operation-phase presenter and
    // consumer value serializer are now explicit utility readbacks in this story.
    // INC-399: the registered static MultiSelect bridge adds its public utility row.
    // 3189 -> 3233 (INC-399 R46 I20): the static clipboard bridge adds its public utility row.
    recordedHeightPx: 3233,
    owedTo: "beyond-INIT-008",
    note: "S058 replaced the 100-row public-export table with a compact links grid into the generated reference pages and dropped the redundant coverage/template panels; the residual is the gate-asserted package-backed API / utility-export / Storybook-only proof panels, which cannot be dropped without breaking the parity + prototype-marker assertions"
  },
  "display-primitives-spec": {
    // 3004 -> 3062 (INC-399 R46): SettingRow and FieldProvenance leave the 180px gallery cells for a full-width SettingRowList.
    recordedHeightPx: 3062,
    owedTo: "INIT-029/S254",
    note: "Nine returned component constructs and the four-phase OperationFeedback readback are kept together for one package contract and state readback; the owner may require a later story split, so this is tracked acceptance debt rather than a visual approval."
  },
  "ai-consumption-contract": {
    // 11406 -> 11536 (EPIC038 correction): operation phase semantics, rendered
    // content evidence, and value-level consumer evidence are read back together.
    // 11536 -> 11764 (INC-399): the shared settings-row and collection-selection
    // contracts now read back the approved grouping, checklist, and clear action.
    // 11764 -> 12275 (INC-399 R44): the record-family containment check joins the Components chapter checks and KeyValueList fields use the package geometry.
    // 12275 -> 12417 (INC-399 R46): long consumer-verification references wrap inside their panel, so its tables keep the panel width and scroll instead of being cut off.
    // 12417 -> 12973 (INC-399 R46 I20): the clipboard copy contract's value boundary and static migration are read back beside the overlay migration.
    recordedHeightPx: 12973,
    owedTo: "beyond-INIT-008",
    note: "Full AI-consumption contract readback, including operation feedback, content-scope, and consumer-evidence contracts, remains one machine-readable surface; gated debt"
  },
  "color-palette": {
    recordedHeightPx: 4659,
    owedTo: "beyond-INIT-008",
    note: "39-token color specimen gallery; a catalogue split is future work — gated debt"
  },
  "foundation-visual-standards": {
    // 3954 -> 4020 (INC-399 R44): the registry and doc-shell oracle KeyValueLists use the package label-above-value geometry.
    recordedHeightPx: 4020,
    owedTo: "beyond-INIT-008",
    note: "foundation visual-standards catalogue; gated debt"
  },
  "text-styles": {
    recordedHeightPx: 2409,
    owedTo: "beyond-INIT-008",
    note: "type-scale specimen catalogue; gated debt"
  },
  "icons-motion": {
    recordedHeightPx: 2076,
    owedTo: "beyond-INIT-008",
    note: "icon + motion specimen catalogue (incl. the S067 motion-slowdown note); gated debt"
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
 *                                       (e.g. "recordedHeightPx"); when
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
    categoryStoryCount: {
      cap: CATEGORY_STORY_COUNT_CAP,
      allowlistedDebtCount: Object.keys(CATEGORY_STORY_COUNT_GRACE_ALLOWLIST).length
    }
  }, null, 2));
}
