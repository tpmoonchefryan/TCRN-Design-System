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
// Reconciled after TCRN-DS-STORY-059 split the three targeted component mega-stories
// (work-management / knowledge-management / navigation-shell). navigation-shell-spec and
// knowledge-management-components-spec now render under budget and are retired from this list.
// The residual 10 fall in two classes: (a) the two WM children S059 could not push under a
// coherent unit (the 24-row single-registry readback table; the hierarchy+gates+evidence panel),
// and (b) inherently-tall AOS visual-instance oracles + Style-Guide/Foundations/Proof specimen
// catalogues that were NOT in S059's 3-mega-story scope. The budget gate makes their height
// VISIBLE and GATED (the governance win); a per-catalogue / per-oracle split is tracked debt
// beyond INIT-008's 17 stories. Every recorded value is the current measured desktop height.
export const STORY_HEIGHT_GRACE_ALLOWLIST = {
  "aos-owner-quality-product-shell": {
    recordedHeightPx: 15285,
    owedTo: "beyond-INIT-008",
    note: "AOS owner-quality visual-instance oracle (full ProductShell renders); inherently tall — gated debt, per-viewport oracle split is future work"
  },
  "aos-frontend-shell-slice": {
    recordedHeightPx: 12448,
    owedTo: "beyond-INIT-008",
    note: "AOS frontend-shell-slice visual-instance oracle; inherently tall — gated debt"
  },
  "component-family-index": {
    recordedHeightPx: 2991,
    owedTo: "beyond-INIT-008",
    note: "S058 replaced the 100-row public-export table with a compact links grid into the generated reference pages and dropped the redundant coverage/template panels (7802->2957px); the residual is the gate-asserted package-backed API / utility-export / storybook-only proof panels, which cannot be dropped without breaking the parity + prototype-marker assertions"
  },
  "ai-consumption-contract": {
    recordedHeightPx: 5438,
    owedTo: "beyond-INIT-008",
    note: "full AI-consumption contract readback (single machine-readable surface); gated debt"
  },
  "color-palette": {
    recordedHeightPx: 4659,
    owedTo: "beyond-INIT-008",
    note: "39-token color specimen gallery; a catalogue split is future work — gated debt"
  },
  "foundation-visual-standards": {
    recordedHeightPx: 3350,
    owedTo: "beyond-INIT-008",
    note: "foundation visual-standards catalogue; gated debt"
  },
  "text-styles": {
    recordedHeightPx: 2409,
    owedTo: "beyond-INIT-008",
    note: "type-scale specimen catalogue; gated debt"
  },
  "work-management-components-spec": {
    recordedHeightPx: 2136,
    owedTo: "irreducible",
    note: "S059 reduced this from 9191px to the bare 24-row Admitted-candidates registry table (one TableShell over workManagementPatternRegistry). It is the WM authority readback (cited by the AI contract + smoke.test); splitting the rows would break the single-registry-readback semantic. Held at 2136px."
  },
  "work-management-hierarchy-gates-spec": {
    recordedHeightPx: 2045,
    owedTo: "irreducible",
    note: "S059 child = the coherent Hierarchy/gates/evidence panel; 45px over a single unit — gated debt"
  },
  "icons-motion": {
    recordedHeightPx: 2076,
    owedTo: "beyond-INIT-008",
    note: "icon + motion specimen catalogue (incl. the S067 motion-slowdown note); gated debt"
  }
};

export const PAGE_KB_BUDGET_BYTES = 1_000_000;

// TCRN-DS-STORY-056: the byte budget is now measured PER EMITTED PAGE FILE (7 section index
// pages + one page per category), not per group. The former group-keyed debt ("Proof",
// "Components") is retired by the split — the section pages are bounded (nav only) and each
// category page carries only its own bodies, so entries are keyed by page FILENAME.
//
// VERIFIER ACTION (cannot be measured without a build): after `pnpm --filter @tcrn/storybook
// build`, if any emitted page still exceeds PAGE_KB_BUDGET_BYTES (the likely remaining outlier
// is `proof-proof-visual-instances.html`, which carries both large AOS oracles), add one
// file-keyed entry here with the measured `recordedBytes` and owedTo TCRN-DS-STORY-054/059.
// An empty allowlist means the split brought every page under budget.
export const PAGE_KB_GRACE_ALLOWLIST = {};

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
