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

import { formalLockupExpectations,lockupRoleIssues,shellBrandNameIssues,SHELL_BRAND_NAMES } from '../scripts/lib/published-api-browser.mjs';
import { readApprovedSource } from '../scripts/lib/approved-site-source.mjs';
test('actual04 full and rail roles reject an extra byline or wrong words instead of testing class presence',()=>{
 const expected=formalLockupExpectations(readApprovedSource(),'en');
 assert.equal(expected.length,16);assert.ok(expected.filter(e=>e.scale==='rail').every(e=>e.byline===null));
 const readings=expected.map(e=>({...e,firstLine:null,accessibleName:`${e.name} ${e.tagline}`}));
 assert.deepEqual(lockupRoleIssues(readings,expected),[]);
 for(const productId of ['einzbern','mana-orchestrate']){
  const altered=readings.map(r=>r.productId===productId&&r.scale==='rail'?{...r,byline:'by TCRN'}:r);
  assert.ok(lockupRoleIssues(altered,expected).length);
 }
 assert.ok(lockupRoleIssues(readings.map(r=>({...r,name:'Wrong name'})),expected).length);
});
test('all five actual accessible copy contracts reject English fallback in fragment locale pages',()=>{
 for(const [locale,words]of Object.entries(SHELL_BRAND_NAMES))for(const version of ['v1','v2'])for(const expanded of [false,true]){
  const row={version,expanded,product:'TCRN TMS',label:`${words[expanded?1:0]} · TCRN TMS`};assert.deepEqual(shellBrandNameIssues([row],locale),[]);
  assert.ok(shellBrandNameIssues([{...row,label:'Open navigation · Wrong product'}],locale).length);
  if(locale!=='en')assert.ok(shellBrandNameIssues([{...row,label:`${SHELL_BRAND_NAMES.en[expanded?1:0]} · TCRN TMS`}],locale).length);
 }
});


import { buttonGroupIssues,rowCarrierIssues } from '../scripts/lib/published-api-browser.mjs';
test('actual direct action/cardinality readings reject invalid kinds/counts and ignore decorative separators',()=>{
 for(const size of ['sm','md','lg'])for(const count of [2,4,5]){
  const row={size,variant:'quiet',childCount:2*count-1,separators:count-1,otherChildren:0,actions:Array.from({length:count},()=>({tag:'BUTTON',family:true,size,variant:'quiet'}))};
  assert.deepEqual(buttonGroupIssues([row]),[]);
  for(const actions of [row.actions.slice(0,1),[...row.actions,...row.actions],row.actions.map((a,i)=>i? a:{...a,tag:'SPAN',family:false}),row.actions.map(a=>({...a,size:size==='sm'?'lg':'sm'}))])assert.ok(buttonGroupIssues([{...row,actions}]).length);
  assert.ok(buttonGroupIssues([{...row,otherChildren:1}]).length);
 }
});
test('row focus and end-inset checks reject the former link-only focus and zero-inset sibling slot',()=>{
 const row={state:'selected',ink:'ink',expectedInk:'ink',fill:'wash',expectedFill:'wash',childFill:'rgba(0, 0, 0, 0)',weight:'600',row:{right:300},link:{right:272},pin:{x:272,right:296,width:24},pinInset:4,columns:'260px 24px',focused:true,shadow:'formal ring',expectedFocus:'formal ring',childShadow:'none',pinShadow:'none'};
 assert.deepEqual(rowCarrierIssues([row]),[]);
 for(const change of [{pinInset:0},{shadow:'none',childShadow:'formal ring'},{pin:{...row.pin,width:20}},{childFill:'wash'},{ink:'ink-2'}])assert.ok(rowCarrierIssues([{...row,...change}]).length);
});
