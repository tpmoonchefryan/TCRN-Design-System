import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { ROOT } from "../scripts/lib/approved-site-source.mjs";
import { createHash } from "node:crypto";
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
  const clock = Date.now;
  try {
    Date.now = () => 946684800000;
    const repeated = path.join(fixture, 'same-generation.js');
    fs.writeFileSync(repeated, 'retained generation bytes');
    const [first] = reconcileOutput(fixture, ['index.html'], { fixture: true, trashRoot: trash });
    fs.writeFileSync(repeated, 'retained generation bytes');
    assert.throws(() => reconcileOutput(fixture, ['index.html'], { fixture: true, trashRoot: trash }), /destination already exists/);
    assert.equal(fs.readFileSync(first.to, 'utf8'), 'retained generation bytes');
    assert.equal(fs.readFileSync(repeated, 'utf8'), 'retained generation bytes');
  } finally {
    Date.now = clock;
  }
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
  env.TCRN_TEST_CHILD = "inherited-build-environment";
  const child = "console.log(JSON.stringify({cwd:process.cwd(),trash:process.env.TCRN_BUILD_TRASH,inherited:process.env.TCRN_TEST_CHILD}))";
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
  assert.equal(path.dirname(observed.trash), path.join(ROOT, ".codex-scratch"));
  assert.equal(fs.statSync(observed.trash).dev, fs.statSync(ROOT).dev);
  assert.equal(observed.inherited, env.TCRN_TEST_CHILD);
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
  const failedTrash = JSON.parse(failedChild.stdout.toString().trim()).trashRoot;
  t.diagnostic(JSON.stringify({ owner: "automatic build ownership fixture", retained: [fixture, observed.trash, failedTrash], cleanup: "Retain entry observations and owned trash with this test's evidence." }));
});

test("automatic checkout-local retirement preserves stale output and compiler metadata across cold and repeated runs", t => {
  const base = path.resolve(process.env.TCRN_TEST_SCRATCH ?? path.join(ROOT, ".codex-scratch", "build-environment-fixtures"));
  fs.mkdirSync(base, { recursive: true });
  const fixture = fs.mkdtempSync(path.join(base, "retirement-"));
  // Use the actual entry and retirement modules, isolated by their own ROOT.
  for (const file of ["scripts/with-build-trash.mjs", "scripts/prepare-output.mjs", "scripts/lib/generated-output.mjs", "scripts/lib/approved-site-source.mjs", "scripts/lib/approved-site-pins.mjs"]) {
    const target = path.join(fixture, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(path.join(ROOT, file), target);
  }
  const output = path.join(fixture, "apps/storybook/dist");
  fs.mkdirSync(output, { recursive: true });
  const hostTemp = path.join(fixture, "host-temp");
  fs.mkdirSync(hostTemp);
  const env = { ...process.env, RUNNER_TEMP: hostTemp, TMPDIR: hostTemp };
  delete env.TCRN_BUILD_TRASH;
  const run = (root = "apps/storybook/dist") => spawnSync(process.execPath, [path.join(fixture, "scripts/with-build-trash.mjs"), process.execPath, "scripts/prepare-output.mjs", "--root", root], {
    cwd: output, env, encoding: "utf8",
  });
  const cold = run();
  assert.equal(cold.status, 0, cold.stderr);
  const coldTrash = JSON.parse(cold.stdout.trim()).trashRoot;
  assert.equal(fs.existsSync(path.join(coldTrash, "reconciliation.jsonl")), false);
  const retained = [];
  const hash = bytes => createHash("sha256").update(bytes).digest("hex");
  for (const generation of ["first", "second"]) {
    const files = new Map([
      [path.join(output, "old.js"), Buffer.from(`stale generated ${generation}\n`)],
      [path.join(fixture, "apps/storybook/tsconfig.tsbuildinfo"), Buffer.from(`incremental metadata ${generation}\n`)],
    ]);
    for (const [file, bytes] of files) fs.writeFileSync(file, bytes);
    const result = run();
    assert.equal(result.status, 0, result.stderr);
    const trash = JSON.parse(result.stdout.trim()).trashRoot;
    assert.equal(fs.statSync(trash).dev, fs.statSync(output).dev);
    assert.equal(path.dirname(trash), path.join(fixture, ".codex-scratch"));
    const receipts = fs.readFileSync(path.join(trash, "reconciliation.jsonl"), "utf8").trim().split("\n").map(line => JSON.parse(line));
    assert.equal(receipts.length, 2);
    assert.equal(receipts.filter(row => row.kind === "incremental-compiler-metadata").length, 1);
    for (const receipt of receipts) {
      const bytes = files.get(receipt.from);
      assert.ok(bytes, "receipt identifies an actual input");
      assert.equal(fs.existsSync(receipt.from), false);
      assert.deepEqual(fs.readFileSync(receipt.to), bytes);
      assert.equal(receipt.sha256, hash(bytes));
      assert.equal(receipt.bytes, bytes.length);
      retained.push({ to: receipt.to, bytes });
    }
  }
  for (const { to, bytes } of retained) assert.deepEqual(fs.readFileSync(to), bytes, "later runs preserve prior bytes");
  const rejectedRoot = run("docs/verification");
  assert.notEqual(rejectedRoot.status, 0);
  assert.match(rejectedRoot.stderr, /Not a declared rebuildable output/);
  const target = path.join(fixture, "retained-evidence.txt");
  fs.writeFileSync(target, "unique evidence\n");
  fs.symlinkSync(target, path.join(output, "linked.js"));
  const rejectedLink = run();
  assert.notEqual(rejectedLink.status, 0);
  assert.match(rejectedLink.stderr, /contains symlink/);
  assert.equal(fs.readFileSync(target, "utf8"), "unique evidence\n");
  t.diagnostic(JSON.stringify({ owner: "actual-module retirement fixture", retained: fixture, sameFilesystem: fs.statSync(output).dev, cleanup: "Retain isolated inputs, symlink rejection and all receipt-addressed bytes with test evidence." }));
});
