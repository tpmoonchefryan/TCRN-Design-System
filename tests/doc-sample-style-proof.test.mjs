import assert from "node:assert/strict";
import test from "node:test";
import { checkSelectionCss,checkPairStateRules } from "../scripts/lib/selection-carriers.mjs";
const roles='.tcrn-tabs__tab[aria-selected="true"]:after{height:1px;background:var(--tcrn-color-rule)}.tcrn-doc-table tr[aria-selected="true"] td{background:var(--tcrn-color-wash)}';
test("V2 paper Tabs and selected table rows retain distinct formal carriers",()=>{
 assert.deepEqual(checkSelectionCss(roles),[]);
 assert.ok(checkSelectionCss(roles.replace('height:1px','height:2px')).length);
 assert.ok(checkSelectionCss(roles+'.tcrn-tabs__tab[aria-selected="true"]{background:var(--tcrn-color-wash)}').length);
 assert.ok(checkSelectionCss(roles.replace('td{background:var(--tcrn-color-wash)}','td{background:transparent}')).length);
});
test("V2 action/input states switch pairs rather than repainting a new local palette",()=>{
 assert.deepEqual(checkPairStateRules('.tcrn-button:where(:hover){--tcrn-pair-fill:var(--tcrn-pair-fill-h)}'),[]);
 for(const declaration of ['background:#6577f3','color:var(--tcrn-color-acc)','box-shadow:0 0 0 1px rgba(0,0,0,.2)'])assert.ok(checkPairStateRules(`.tcrn-input:hover{${declaration}}`).length);
});
