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
import { readApprovedSource,sourceElements,decodeHtml } from '../scripts/lib/approved-site-source.mjs';
import { provenanceActivationIssues,activateProvenanceResult,exerciseDocsNavigation } from '../scripts/lib/published-docs-browser.mjs';
import { publishedBoardUrl } from '../scripts/lib/published-browser-proof.mjs';
import fs from 'node:fs';
import path from 'node:path';
test('the real navigation caller accepts only the two registered dialog-role destinations and reaches every later assertion',async()=>{
 const source=readApprovedSource(),base='http://127.0.0.1:1234',formal=Object.fromEntries(apis.map(api=>[api.name,{board:api.board}]));
 for(const entry of ['static','manager'])for(const locale of ['zh-CN','en','ja','ko','fr']){
  function caller(alter=rows=>rows){
   let url='',query='',board='01-tokens';const emptyWaits=[],activations=[];
   const apiHref=name=>entry==='static'?`/${locale}/api.html#api-${name}`:`${publishedBoardUrl(base,entry,locale,formal[name].board).slice(base.length)}#api-${name}`;
   const roleRows=()=>alter(['ShellBrandButton','ShellMenu'].map(name=>({id:`api-${name}`,name,href:apiHref(name)})));
   const roleQuery=()=>query.trim().normalize('NFKC').toLowerCase()==='dialog';
   const destination=href=>new URL(href,url||base).href;
   const result=name=>({waitFor:async()=>{},getAttribute:async key=>{assert.equal(key,'href');return apiHref(name);},click:async()=>{url=destination(apiHref(name));board=formal[name].board;activations.push(name);}});
   const sourceResult={waitFor:async()=>{},getAttribute:async key=>{assert.equal(key,'href');return entry==='static'?`/${locale}/source.html`:'#source';},click:async()=>{url=destination(entry==='static'?`/${locale}/source.html`:'#source');}};
   const links={
    first:()=>({waitFor:async options=>{assert.deepEqual(options,{state:'visible'});assert.ok(roleQuery());}}),
    evaluateAll:async()=>{assert.ok(roleQuery());return roleRows();},
    count:async()=>roleQuery()?roleRows().length:0,
    filter:({has})=>{const name=Object.keys(formal).find(name=>has.options.hasText.test(name));assert.equal(query,name);return result(name);},
    waitFor:async()=>{assert.equal(query,source.manifest.site.sourceCommit);},
    getAttribute:sourceResult.getAttribute,click:sourceResult.click
   };
   const menu={locator:selector=>{
    if(selector==='[data-shell-search] input[type="search"]')return {fill:async value=>{query=value;}};
    if(selector==='[data-search-result]')return links;
    if(selector==='[data-product-shell-search-empty]:not([hidden])')return {waitFor:async()=>{emptyWaits.push(query);assert.ok(['StateView','brand-identity','tcrn-brand-mark.svg'].includes(query),'Dialog must never await an impossible empty state');}};
    const href=/^a\[data-shell-row\]\[href="([^"]+)"\]$/.exec(selector)?.[1];assert.ok(href,selector);
    return {count:async()=>1,click:async()=>{board=Object.keys(APPROVED_BOARD_IDS).find(id=>publishedBoardUrl(base,entry,locale,id).slice(base.length)===href);assert.ok(board);url=destination(href);}};
   }};
   const shell={first(){return this;},locator:selector=>{
    if(selector==='[data-shell-brand]')return {first:()=>({getAttribute:async()=> 'true'})};
    assert.equal(selector,':scope > .tcrn-shell-menu');return menu;
   }};
   const page={url:()=>url,goto:async value=>{url=value;return {status:()=>200};},evaluate:async()=>{},waitForURL:async value=>{assert.equal(url,value);},locator:(selector,options)=>{
    if(selector==='.tcrn-product-shell')return shell;
    if(selector==='strong')return {options};
    if(selector==='[data-approved-board]')return {first:()=>({getAttribute:async()=>board})};
    if(selector==='main .tcrn-doc-content'||selector==='section#source')return {waitFor:async()=>{},isVisible:async()=>true,textContent:async()=>[source.manifest.site.sourceCommit,source.manifest.site.url,...source.manifest.boards.map(b=>b.sourceId)].join(' ')};
    return {waitFor:async()=>{const name=/^\[data-approved-api="([^"]+)"\]$/.exec(selector)?.[1];if(name)assert.equal(new URL(url).hash,`#api-${name}`);else assert.ok(selector==='[data-docs-ready="true"]'||selector===`[data-approved-board="${board}"]`,selector);}};
   }};
   return {run:()=>exerciseDocsNavigation(page,{base,entry,locale,source,formal}),state:()=>({emptyWaits,activations})};
  }
  const good=caller(),reading=await good.run();assert.deepEqual(reading.issues,[]);
  assert.deepEqual(reading.observations.filter(o=>o.kind==='document-navigation').map(o=>o.board),Object.keys(APPROVED_BOARD_IDS));
  assert.deepEqual(reading.observations.filter(o=>o.kind==='dialog-role-search').map(o=>o.query),['Dialog','  ＤｉＡｌＯｇ  ']);
  assert.deepEqual(good.state(),{emptyWaits:['StateView','brand-identity','tcrn-brand-mark.svg'],activations:apis.map(api=>api.name)});
  assert.ok(reading.observations.some(o=>o.kind==='source-search-activation'));
  for(const alter of [rows=>rows.slice(0,1),rows=>[...rows,{id:'api-Dialog',name:'Dialog',href:entry==='static'?`/${locale}/api.html#api-Dialog`:`${publishedBoardUrl(base,entry,locale,'07b-shell-lower').slice(base.length)}#api-Dialog`}],rows=>rows.map((row,i)=>i?row:{...row,id:'api-Dialog'}),rows=>rows.map((row,i)=>i?row:{...row,href:`/en/api.html#api-ShellBrandButton-wrong`})]){
   assert.ok((await caller(alter).run()).issues.some(issue=>issue.includes('dialog role search')),'missing, extra, unsupported or misrouted role hits must fail the actual caller');
  }
 }
});
test('the real provenance caller clicks from each emitted static API page without a board-only precondition',async()=>{
 const source=readApprovedSource(),base='http://127.0.0.1:1234';
 for(const locale of ['zh-CN','en','ja','ko','fr']){
  const apiHtml=fs.readFileSync(path.join(ROOT,'apps/storybook/storybook-static',locale,'api.html'),'utf8'),nodes=sourceElements(apiHtml);
  assert.equal(nodes.filter(n=>Object.hasOwn(n.attrs,'data-approved-board')).length,0,'the actual all-API page has no board marker');
  assert.deepEqual(nodes.filter(n=>Object.hasOwn(n.attrs,'data-approved-api')).map(n=>n.attrs['data-approved-api']).sort(),apis.map(a=>a.name).sort());
  const sourceHtml=fs.readFileSync(path.join(ROOT,'apps/storybook/storybook-static',locale,'source.html'),'utf8');
  const sourceText=decodeHtml(sourceHtml.replace(/<[^>]*>/g,' ')),before=`${base}/${locale}/api.html#api-ShellIntro`,destination=`${base}/${locale}/source.html`;
  // This caller stub starts on actual emitted API markup, before collection/click.
  // Browser hydration/visibility remain duties of the existing real browser proof.
  function caller({prevented=false,text=sourceText,visible=true,clickError=false}={}){
   let url=before,clicks=0;const waits=[];
   const page={url:()=>url,waitForURL:async expected=>{assert.equal(url,expected,'only the actual result click may change route');},locator:selector=>{
    assert.notEqual(selector,'[data-approved-board]','static collection must not await a marker absent from api.html');
    if(selector==='[data-docs-ready="true"]')return {waitFor:async()=>{assert.ok(sourceHtml.includes('data-docs-ready='));waits.push(selector);}};
    assert.equal(selector,'main .tcrn-doc-content');return {waitFor:async options=>{assert.deepEqual(options,{state:'visible'});waits.push(selector);},isVisible:async()=>visible,textContent:async()=>text};
   }};
   const result={getAttribute:async name=>{assert.equal(name,'href');return `/${locale}/source.html`;},click:async()=>{clicks++;if(clickError)throw new Error('activation blocked');if(!prevented)url=destination;}};
   return {run:()=>activateProvenanceResult(page,result,{base,entry:'static',locale,source}),state:()=>({url,clicks,waits})};
  }
  const good=caller(),reading=await good.run();assert.deepEqual(reading.issues,[]);assert.equal(reading.board,null);assert.deepEqual(good.state(),{url:destination,clicks:1,waits:['[data-docs-ready="true"]','main .tcrn-doc-content']});
  await assert.rejects(caller({prevented:true}).run(),/only the actual result click/);
  await assert.rejects(caller({clickError:true}).run(),/activation blocked/);
  assert.ok((await caller({text:'Source'}).run()).issues.some(i=>i.includes('render')));
  assert.ok((await caller({visible:false}).run()).issues.some(i=>i.includes('render')));
 }
});
test('provenance activation rejects a prevented click even with a correct href and already rendered source text',()=>{
 const source=readApprovedSource(),base='http://127.0.0.1:1234',board='07a-shell-upper';
 for(const entry of ['static','manager'])for(const locale of ['zh-CN','en','ja','ko','fr']){
  const before=entry==='static'?`${base}/${locale}/api.html#api-ShellIntro`:`${base}/iframe.html?id=published-standards--shell-upper&viewMode=story&globals=locale:${locale}#api-ShellIntro`;
  const href=entry==='static'?`/${locale}/source.html`:'#source',activated=new URL(href,entry==='static'?base:before).href;
  const reading={before,href,activated,visible:true,text:[source.manifest.site.sourceCommit,source.manifest.site.url,...source.manifest.boards.map(b=>b.sourceId)].join(' ')};
  assert.deepEqual(provenanceActivationIssues(reading,{base,entry,locale,source,board}),[]);
  assert.ok(provenanceActivationIssues({...reading,activated:before},{base,entry,locale,source,board}).some(i=>i.includes('did not arrive')),'preventDefault leaves the original URL: pre-click href/content cannot pass');
  assert.ok(provenanceActivationIssues({...reading,text:'Source'},{base,entry,locale,source,board}).some(i=>i.includes('render')));
  assert.ok(provenanceActivationIssues({...reading,visible:false},{base,entry,locale,source,board}).length);
 }
});
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
