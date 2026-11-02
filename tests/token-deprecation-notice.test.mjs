import test from "node:test";
import assert from "node:assert/strict";
import { tcrnDeprecatedTokenAliases,tcrnDeprecatedTokens,tcrnTokenCss } from "../packages/ui-tokens/dist/index.js";
import { deprecatedTokenTable,isSkippedDirectory,scanDeprecatedTokenUses } from "../scripts/token-deprecation-notice.mjs";

test("current formal-source token publication carries no compatibility aliases",()=>{
 assert.deepEqual(tcrnDeprecatedTokenAliases,{});assert.deepEqual(tcrnDeprecatedTokens,[]);assert.deepEqual(deprecatedTokenTable(),[]);
 for(const old of ["--tcrn-color-text-primary","--tcrn-color-surface-canvas","--tcrn-motion-press-scale"])assert.ok(!tcrnTokenCss.includes(`${old}:`));
});
test("optional migration scanner accepts an explicit caller table without publishing its vocabulary",()=>{
 const table=deprecatedTokenTable({aliases:{"--fixture-old":"--fixture-new"},deprecated:[{variable:"--fixture-removed",replacement:null}]});
 const uses=scanDeprecatedTokenUses('.a{color:var(--fixture-old);border-color:var(--fixture-old);--fixture-removed:1}',{stylesheet:true,table});
 assert.equal(uses.find(t=>t.variable==="--fixture-old")?.count,2);
 assert.equal(uses.find(t=>t.variable==="--fixture-removed")?.replacement,null);
 assert.deepEqual(scanDeprecatedTokenUses('.a{color:var(--fixture-old)}'),[]);
 assert.deepEqual(scanDeprecatedTokenUses('.a{color:var(--fixture-older)}',{table}),[]);
});
test("generated artifacts are excluded but source build implementations remain inspectable",()=>{
 for(const p of ["project/node_modules","project/.git","project/dist","project/storybook-static","project/build"])assert.equal(isSkippedDirectory(p),true,p);
 for(const p of ["project/src/build","project/src/components","project/source"])assert.equal(isSkippedDirectory(p),false,p);
});
