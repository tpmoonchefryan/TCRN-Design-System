import assert from "node:assert/strict";
import test from "node:test";
import { checkSelectionCss,checkPairStateRules } from "../scripts/lib/selection-carriers.mjs";
const correct='.tcrn-tabs__tab[aria-selected="true"]:after{height:1px;background:var(--tcrn-color-rule)}.tcrn-doc-table tr[aria-selected="true"] td{background:var(--tcrn-color-wash)}';
test("V4 paper Tabs and selected rows have separate published carriers",()=>{
 assert.deepEqual(checkSelectionCss(correct),[]);assert.ok(checkSelectionCss(correct.replace('height:1px','height:0')).length);assert.ok(checkSelectionCss(correct+'.tcrn-tabs__tab[aria-selected="true"]{background:var(--tcrn-color-wash)}').length);assert.ok(checkSelectionCss(correct.replace('var(--tcrn-color-rule)','var(--tcrn-brand-suffix-tms)')).length);
});
test("V4 action/input states switch pairs and cannot paint a color literal or color token",()=>{
 assert.deepEqual(checkPairStateRules('.tcrn-button:hover{--tcrn-pair-fill:var(--tcrn-pair-fill-h)}'),[]);
 for(const value of ['#0b6b65','rgba(0,0,0,.1)','var(--tcrn-color-acc)'])assert.ok(checkPairStateRules(`.tcrn-button:hover{background:${value}}`).length);
 assert.deepEqual(checkPairStateRules('.tcrn-nav-item-row:hover{background:var(--tcrn-color-hover)}'),[],"shell rows retain their own published role");
});
