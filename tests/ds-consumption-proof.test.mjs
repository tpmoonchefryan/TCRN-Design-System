import assert from "node:assert/strict";
import test from "node:test";
import { APPROVED_BOARD_IDS } from "../scripts/lib/approved-site-pins.mjs";
import { APPROVED_API_BOARDS,checkProjection } from "../scripts/lib/published-standard-proof.mjs";
const registry=Object.entries(APPROVED_BOARD_IDS).map(([id,sourceId])=>({id,sourceId}));
import { approvedApi } from "../apps/storybook/dist/approved-api.js";
const apis = approvedApi;
test("V3 API pages cannot grow from engineering exports, duplicate a contract, or borrow another board",()=>{
 assert.deepEqual(checkProjection(registry,apis),[]);
 assert.ok(checkProjection(registry,apis.slice(1)).length);
 assert.ok(checkProjection(registry,[...apis.slice(1),apis[1]]).length);
 assert.ok(checkProjection(registry,[...apis,{name:'Dialog',board:'06-inputs',props:['open']}]).length);
 assert.ok(checkProjection(registry,apis.map(a=>a.name==='MultiSelect'?{...a,board:'04-brand'}:a)).length);
});
test("V3 same route names are insufficient without the eight actual published source identities",()=>{
 assert.ok(checkProjection(registry.map((r,i)=>i===3?{...r,sourceId:registry[0].sourceId}:r),apis).length);
 assert.ok(checkProjection([...registry].reverse(),apis).length);
});

import { markupStyleCoverage, checkPublishedStyles } from "../scripts/lib/published-style-closure.mjs";
test("style closure resolves exact real carriers and documentation ownership without allowing unknown classes", () => {
  const css = '.tcrn-input{height:32px}.tcrn-radio-group__option{color:inherit}.tcrn-sr-only{display:none}';
  const markup = '<label class="tcrn-radio-group__option"><span class="tcrn-radio-group__label">Team</span></label><input class="tcrn-input tcrn-input--md"><select class="tcrn-sr-only tcrn-multi-select-dropdown__value"></select><div class="tcrn-doc-prose"></div>';
  assert.deepEqual(markupStyleCoverage(markup, css, '.tcrn-doc-prose{display:grid}').missing, []);
  assert.ok(markupStyleCoverage('<span class="tcrn-radio-group__label">Wrong parent</span>', css).missing.length);
  assert.ok(markupStyleCoverage(markup + '<div class="tcrn-not-a-component"></div>', css).missing.includes('tcrn-not-a-component'));
  assert.ok(checkPublishedStyles('.tcrn-dialog{color:red}').length);
  assert.ok(checkPublishedStyles('.tcrn-input{color:var(--tcrn-color-text-old)}').length);
});
