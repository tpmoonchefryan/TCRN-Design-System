import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "../scripts/lib/approved-site-source.mjs";
import { reconcileOutput,listFiles } from "../scripts/lib/generated-output.mjs";
import { CURRENT_STORY_SOURCE_FILES,checkStorySourceMembers } from "../scripts/lib/published-standard-proof.mjs";
test("V7 precise reconciliation retires incremental stale output and preserves evidence outside the output",t=>{
 const base=path.resolve(process.env.TCRN_TEST_SCRATCH??path.join(ROOT,'.codex-scratch','published-output-fixtures'));
 fs.mkdirSync(base,{recursive:true});const fixture=fs.mkdtempSync(path.join(base,'output-')),trash=path.join(base,'trash');
 const evidence=path.join(base,`${path.basename(fixture)}-retained-evidence.json`);fs.writeFileSync(evidence,'{"retain":true}\n');
 try{
  for(const file of ['index.html','old-api.html','hidden/old-client.js','fonts/old.woff2']){const full=path.join(fixture,file);fs.mkdirSync(path.dirname(full),{recursive:true});fs.writeFileSync(full,file);}
  const receipt=reconcileOutput(fixture,['index.html'],{fixture:true,trashRoot:trash});assert.equal(receipt.length,3);assert.deepEqual(listFiles(fixture),['index.html']);
  assert.ok(receipt.every(r=>fs.existsSync(r.to)&&!fs.existsSync(r.from)&&r.sha256.length===64));assert.equal(fs.readFileSync(evidence,'utf8'),'{"retain":true}\n');
  assert.deepEqual(reconcileOutput(fixture,['index.html'],{fixture:true,trashRoot:trash}),[]);
  assert.throws(()=>reconcileOutput(path.join(ROOT,'docs/verification'),[]),/Not a declared rebuildable output/);
 }finally{
  fs.mkdirSync(trash,{recursive:true});const retainedFixture=path.join(trash,`${path.basename(fixture)}-finished`);fs.renameSync(fixture,retainedFixture);
  t.diagnostic(JSON.stringify({owner:'full-surface-remediation fixture',retainedFixture,evidence,consumer:'test evidence / integration cleanup',cleanup:'No purge; fixture and moved stale bytes are rebuildable in the named scratch trash.'}));
 }
});
test("V3 unused or unlinked story source cannot survive behind the correct navigation registry",()=>{
 assert.deepEqual(checkStorySourceMembers(CURRENT_STORY_SOURCE_FILES),[]);
 for(const file of ['hidden.tsx','internal-dev/unused.ts','contract-stories/unlinked-old-api.tsx'])assert.ok(checkStorySourceMembers([...CURRENT_STORY_SOURCE_FILES,file]).some(x=>x.includes(file)));
});
