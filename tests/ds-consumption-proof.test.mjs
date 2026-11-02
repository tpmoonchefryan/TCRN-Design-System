import assert from "node:assert/strict";
import test from "node:test";
import { APPROVED_BOARD_IDS } from "../scripts/lib/approved-site-pins.mjs";
import { APPROVED_API_BOARDS,checkProjection } from "../scripts/lib/published-standard-proof.mjs";
const registry=Object.entries(APPROVED_BOARD_IDS).map(([id,sourceId])=>({id,sourceId}));
const apis=Object.entries(APPROVED_API_BOARDS).map(([name,board])=>({name,board,props:['source obligation']}));
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
