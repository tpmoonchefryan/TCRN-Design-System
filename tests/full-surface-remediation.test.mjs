import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
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

test("automatic build ownership reaches workspace children and rejects invalid caller input", t => {
  const base = path.resolve(process.env.TCRN_TEST_SCRATCH ?? path.join(ROOT, ".codex-scratch", "build-environment-fixtures"));
  fs.mkdirSync(base, { recursive: true });
  const fixture = fs.mkdtempSync(path.join(base, "entry-"));
  const env = { ...process.env, RUNNER_TEMP: fixture };
  delete env.TCRN_BUILD_TRASH;
  const child = "console.log(JSON.stringify({cwd:process.cwd(),trash:process.env.TCRN_BUILD_TRASH}))";
  const run = supplied => spawnSync(process.execPath, [path.join(ROOT, "scripts/with-build-trash.mjs"), process.execPath, "-e", child], {
    cwd: path.join(ROOT, "packages/ui-react"), encoding: "utf8",
    env: supplied === undefined ? env : { ...env, TCRN_BUILD_TRASH: supplied },
  });
  const created = run();
  assert.equal(created.status, 0, created.stderr);
  const [entry, observed] = created.stdout.trim().split("\n").map(line => JSON.parse(line));
  assert.equal(entry.ownership, "created");
  assert.equal(observed.cwd, ROOT);
  assert.equal(observed.trash, entry.trashRoot);
  assert.equal(path.dirname(observed.trash), fixture);
  assert.ok(fs.statSync(observed.trash).isDirectory());
  const existingTrash = path.join(fixture, "trash-supplied");
  fs.mkdirSync(existingTrash);
  fs.writeFileSync(path.join(existingTrash, "retained.txt"), "prior build bytes\n");
  const relative = path.relative(ROOT, existingTrash);
  const supplied = run(relative);
  assert.equal(supplied.status, 0, supplied.stderr);
  const suppliedRows = supplied.stdout.trim().split("\n").map(line => JSON.parse(line));
  assert.equal(suppliedRows[0].ownership, "caller-supplied");
  assert.equal(suppliedRows[1].trash, path.resolve(ROOT, relative));
  assert.equal(fs.readFileSync(path.join(existingTrash, "retained.txt"), "utf8"), "prior build bytes\n");
  for (const invalid of ["", path.join(fixture, "unowned")]) {
    const rejected = run(invalid);
    assert.notEqual(rejected.status, 0);
    assert.match(rejected.stderr, /TCRN_BUILD_TRASH must name an explicit owned trash directory/);
    assert.equal(rejected.stdout, "");
  }
  const link = path.join(fixture, "trash-link");
  fs.symlinkSync(observed.trash, link);
  const rejectedLink = run(link);
  assert.notEqual(rejectedLink.status, 0);
  assert.match(rejectedLink.stderr, /not a symlink or file/);
  const failedChild = spawnSync(process.execPath, [path.join(ROOT, "scripts/with-build-trash.mjs"), process.execPath, "-e", "process.exit(7)"], { env });
  assert.equal(failedChild.status, 7);
  t.diagnostic(JSON.stringify({ owner: "automatic build ownership fixture", retained: fixture, cleanup: "Retain entry observations and owned trash with this test's evidence." }));
});
