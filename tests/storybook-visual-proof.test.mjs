import assert from "node:assert/strict";
import test from "node:test";
import { APPROVED_BOARD_IDS } from "../scripts/lib/approved-site-pins.mjs";
import { APPROVED_API_BOARDS,checkProjection,validateOutputMembers,compiled,managerIndexIssues,MANAGER_STORY_IDS } from "../scripts/lib/published-standard-proof.mjs";
const registry=Object.entries(APPROVED_BOARD_IDS).map(([id,sourceId])=>({id,sourceId}));
const {ROOT}=await import("../scripts/lib/approved-site-source.mjs");
const {approvedApi:apis}=await compiled(ROOT,"apps/storybook/dist/approved-api.js");
test("V3 registry and checker agreeing cannot grant authority to an unsupported old story or API",()=>{assert.deepEqual(checkProjection(registry,apis),[]);const altered=[...registry,{id:"brand-identity",sourceId:registry[3].sourceId}];const bogusLocalChecker=rows=>rows===altered;assert.equal(bogusLocalChecker(altered),true);assert.ok(checkProjection(altered,apis).length);assert.ok(checkProjection(registry,[...apis,{name:"StateView",board:"01-tokens",props:["state"]}]).length);assert.ok(checkProjection(registry,apis.map(a=>a.name==="Button"?{...a,board:"04-brand"}:a)).length);});
test("V7 stale unlinked pages, renamed assets and old compiled JS are rejected by exact output membership",()=>{const expected=["index.html","en/01-tokens.html","storybook.js","assets/ds-tile-deep.svg"];assert.deepEqual(validateOutputMembers(expected,expected),[]);for(const stale of ["reference-components.html","assets/renamed-mark.svg","en/brand-identity.html","old-client.js","fonts/old.woff2"])assert.ok(validateOutputMembers([...expected,stale],expected).some(i=>i.includes(stale)));});

import { API_BEHAVIOR_REQUIREMENTS,apiBehaviorIssues } from '../scripts/lib/published-api-browser.mjs';
test('all28 API semantics require complete formal text and actual behavior, not arbitrary nonempty props',()=>{
 assert.equal(Object.keys(API_BEHAVIOR_REQUIREMENTS).length,28);
 assert.ok(checkProjection(registry,apis.map(a=>({...a,props:['formal obligation'],formal:'formal obligation'}))).length);
 for(const api of apis){assert.ok(checkProjection(registry,apis.map(a=>a.name===api.name?{...a,formal:a.formal.slice(0,20)}:a)).length,api.name);const good=Object.fromEntries(API_BEHAVIOR_REQUIREMENTS[api.name].map(k=>[k,true]));assert.deepEqual(apiBehaviorIssues(api.name,good),[]);for(const key of API_BEHAVIOR_REQUIREMENTS[api.name])assert.ok(apiBehaviorIssues(api.name,{...good,[key]:false}).some(issue=>issue.includes(key)));}
 const icon=apis.find(a=>a.name==='IconButton');assert.ok(checkProjection(registry,apis.map(a=>a===icon?{...a,props:a.props.filter(p=>!p.includes('children'))}:a)).length);
});
test('manager emitted CSF closure rejects hidden, extra or wrong-module stories',()=>{
 const entries=Object.fromEntries(MANAGER_STORY_IDS.map(id=>[id,{id,type:'story',title:'Published standards',importPath:'./src/standards.stories.tsx'}]));assert.deepEqual(managerIndexIssues({entries}),[]);
 assert.ok(managerIndexIssues({entries:{...entries,legacy:{id:'legacy',type:'story',title:'Style Guide',importPath:'./src/legacy.stories.tsx'}}}).length);
 const changed=structuredClone(entries);changed[MANAGER_STORY_IDS[0]].importPath='./src/renamed-legacy.stories.tsx';assert.ok(managerIndexIssues({entries:changed}).length);
});
