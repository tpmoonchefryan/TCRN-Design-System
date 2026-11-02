import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { ROOT,readApprovedSource,extractTokens,extractIcons,extractMarks,extractMatrixOccurrences } from "../scripts/lib/approved-site-source.mjs";
import { APPROVED_SITE,APPROVED_BOARD_IDS } from "../scripts/lib/approved-site-pins.mjs";
const read=fs.readFileSync;
test("V1 published identity is the actual eight sourceIds and immutable source commit",()=>{
 const s=readApprovedSource();assert.equal(APPROVED_SITE.sourceCommit,"a643d4cfcd239f6f81b1715ded6a63caead9d619");assert.equal(Object.keys(APPROVED_BOARD_IDS).length,8);assert.equal(APPROVED_BOARD_IDS["04-brand"],"ee0f582f-d81c-47f4-8a5b-d16631584d81");assert.equal(s.manifest.site.versionNumber,1);assert.equal(s.manifest.site.deploymentStatus,"succeeded");
 assert.equal(extractTokens(s).themed.length,39);assert.equal(extractTokens(s).fixed.length,27);assert.equal(extractIcons(s).length,38);assert.equal(extractMarks(s).length,4);
});
test("V1 same name and candidate manifest hashes do not authorize changed source bytes",()=>{
 const target=path.join(ROOT,"docs/design/approved-site-v1/src/boards/01-tokens/board.css");
 assert.throws(()=>readApprovedSource(ROOT,{readFile:(p,encoding)=>p===target?(encoding?read(p,"utf8").replace("#efeeea","#eeeeee"):Buffer.from(read(p,"utf8").replace("#efeeea","#eeeeee"))):read(p,encoding)}),/Published bytes changed/);
});
test("V1 changing registry and source-manifest together cannot replace a board or source commit",()=>{
 const manifest=path.join(ROOT,"docs/design/approved-site-v1/source-manifest.json");
 for(const mutate of [m=>m.site.sourceCommit="unpublished",m=>m.boards.pop(),m=>m.boards[0].sourceId="same-name-wrong-source",m=>m.boards.push(m.boards[0])]){
  assert.throws(()=>readApprovedSource(ROOT,{readFile:(p,encoding)=>{if(p!==manifest)return read(p,encoding);const m=JSON.parse(read(p,"utf8"));mutate(m);const s=JSON.stringify(m);return encoding?s:Buffer.from(s);}}));
 }
});
test("V1 every original occurrence has a distinct source key, including repeated shell cell ids",()=>{
 const cells=extractMatrixOccurrences(readApprovedSource());assert.equal(new Set(cells.map(c=>c.key)).size,cells.length);assert.equal(cells.filter(c=>!c.board.startsWith("07")).length,230);assert.ok(cells.filter(c=>c.board.startsWith("07")).length>155);assert.ok(cells.every(c=>c.sourceLine>0&&c.expect&&["text","icon","edge"].includes(c.kind)));
});
test("V1 prose bindings derive their number from the actual source anchor, not a self-reported candidate value",async()=>{
 const { extractPackageBindings }=await import('../scripts/lib/approved-site-source.mjs');
 const source=readApprovedSource(),binding={board:'07b-shell-lower',text:'上限6',unit:'',cssVar:'--tcrn-shell-pins-max'};
 assert.equal(extractPackageBindings(source,[binding])[0].value,'6');
 assert.throws(()=>extractPackageBindings(source,[{...binding,value:'8'}]),/Unbacked numeric value/);
 assert.throws(()=>extractPackageBindings(source,[{...binding,text:'上限8'}]),/Missing published text anchor/);
});

test("V1 package/source commit agreement cannot hide a wrong project, version, deployment or publication state",async()=>{
 const {sourceIdentityIssues}=await import('../scripts/lib/published-standard-proof.mjs');assert.deepEqual(sourceIdentityIssues(APPROVED_SITE),[]);
 for(const [key,value]of Object.entries({projectId:'wrong',versionId:'wrong',versionNumber:2,deploymentId:'wrong',deploymentStatus:'pending',sourceCommit:'wrong'}))assert.ok(sourceIdentityIssues({...APPROVED_SITE,[key]:value}).some(issue=>issue.includes(key)));
});
