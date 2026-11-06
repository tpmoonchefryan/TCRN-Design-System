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
 for (const name of ['home', 'api', 'source']) {
   const missing = { ...entries };
   delete missing[`published-standards--${name}`];
   assert.ok(managerIndexIssues({ entries: missing }).length);
 }
});

import { formalLockupExpectations,lockupRoleIssues,shellBrandNameIssues,SHELL_BRAND_NAMES } from '../scripts/lib/published-api-browser.mjs';
import { readApprovedSource,sourceElements,decodeHtml,extractMatrixOccurrences } from '../scripts/lib/approved-site-source.mjs';
import { provenanceActivationIssues,activateProvenanceResult,exerciseDocsNavigation } from '../scripts/lib/published-docs-browser.mjs';
import { publishedBoardUrl,proofContexts,publishedTextRoleIssues,withPublishedBrowser,openPublishedBoard,publishedShortcutOccurrences,publishedShortcutLocator,collectPublishedShortcuts,configureProofPage,readFamilyCell,ownedVisibleListbox } from '../scripts/lib/published-browser-proof.mjs';

test('06 measures the labelled native radios in one selectable group and detects wrong state',async()=>{
 for(const entry of ['static','manager'])await withPublishedBrowser(async({browser,base,source})=>{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  const reference=await browser.newPage({viewport:{width:2640,height:1000}});
  const cells=extractMatrixOccurrences(source).filter(cell=>cell.board==='06-inputs');
  try{
   await openPublishedBoard(page,{base,entry,locale:'en',board:'06-inputs'});
   await reference.goto(`${base}/__formal/06-inputs`);
   const marker=id=>page.locator(`[data-source-cell-id="${id}"]`);
   const read=id=>{
    const index=cells.findIndex(cell=>cell.cellId===id);
    return readFamilyCell({page,actual:marker(id),reference:reference.locator('[data-cell]').nth(index),cell:cells[index]});
   };
   for(const suffix of ['l','n']){
    const edgeId=`rd-edge-${suffix}`,selectedId=`rd-on-${suffix}`;
    const group=marker(edgeId).locator('xpath=ancestor::fieldset[1]');
    const edge=group.getByRole('radio',{name:'Public',exact:true}),selected=group.getByRole('radio',{name:'Team only',exact:true});
    assert.equal(await group.getByRole('radio').count(),3);
    for(const id of [edgeId,selectedId]){
     const result=await read(id);
     assert.ok(result.ok,`${entry}/${id}: ${result.reason}`);
     assert.equal(result.reading.radio.indeterminate,false);
    }
    await selected.press('ArrowUp');
    assert.equal(await edge.isChecked(),true);
    assert.equal(await selected.isChecked(),false);
    assert.match((await read(edgeId)).reason,/RadioGroup native option state or group/);
    await edge.press('ArrowDown');
    assert.equal(await selected.isChecked(),true);
    // Reproduce the original native selector state by separating the checked option.
    const originalName=await selected.getAttribute('name');
    try{
     await selected.evaluate(el=>el.name+='-independent');
     const changed=await read(edgeId);
     assert.equal(changed.reading.radio.indeterminate,true);
     assert.match(changed.reason,/RadioGroup native option state or group/);
    }finally{await selected.evaluate((el,name)=>el.name=name,originalName);}
    assert.ok((await read(edgeId)).ok);
   }
  }finally{await page.close();await reference.close();}
 },{entry});
});

test('06 measures only the owned visible listbox and retains its local theme across reopen',async()=>{
 for(const entry of ['static','manager'])await withPublishedBrowser(async({browser,base,source})=>{
  const reference=await browser.newPage({viewport:{width:2640,height:1000}});
  const cells=extractMatrixOccurrences(source).filter(cell=>cell.board==='06-inputs');
  try{
   await reference.goto(`${base}/__formal/06-inputs`);
   for(const outerTheme of ['light','dark']){
    const page=await browser.newPage({viewport:{width:1440,height:1000}});
    try{
     await configureProofPage(page,outerTheme);
     await openPublishedBoard(page,{base,entry,locale:'zh-CN',board:'06-inputs'});
     assert.equal(await page.locator('.docs-shell').getAttribute('data-tcrn-theme'),outerTheme);
     const localTheme=outerTheme==='light'?'dark':'light';
     const index=cells.findIndex(cell=>cell.cellId===`opt-sel-${localTheme==='light'?'l':'n'}`);
     const cell=cells[index],actual=page.locator(`[data-source-cell-key="${cell.key}"]`);
     const pane=actual.locator('xpath=ancestor::*[@data-tcrn-theme][1]');
     const trigger=actual.getByRole('button');
     const read=()=>readFamilyCell({page,actual,reference:reference.locator('[data-cell]').nth(index),cell});
     const baseline=await read();
     assert.ok(baseline.ok,`${entry}/${outerTheme}: ${baseline.reason}`);
     assert.equal(baseline.reading.background,baseline.referenceReading.background);
     assert.equal(baseline.reading.color,baseline.referenceReading.color);

     const id=await trigger.getAttribute('aria-controls');
     const hiddenId=await page.locator('body > .tcrn-multi-select-dropdown__list[hidden]').evaluateAll((lists,id)=>{
      const own=document.getElementById(id),text=own.querySelector('[data-multi-select-label]').textContent;
      return lists.find(list=>list!==own&&list.getBoundingClientRect().width===0&&list.querySelector('[data-multi-select-label]').textContent===text)?.id;
     },id);
     assert.ok(hiddenId,'a hidden instance has the same option text');
     try{
      await trigger.evaluate((el,wrong)=>el.setAttribute('aria-controls',wrong),hiddenId);
      await assert.rejects(read(),/aria-controls must identify one visible listbox/);
     }finally{await trigger.evaluate((el,id)=>el.setAttribute('aria-controls',id),id);}

     try{
      await pane.evaluate(el=>el.removeAttribute('data-tcrn-theme'));
      const lost=await read();
      assert.equal(lost.ok,false);
      assert.match(lost.reason,/MultiSelect owned option wash/);
     }finally{await pane.evaluate((el,theme)=>el.setAttribute('data-tcrn-theme',theme),localTheme);}
     assert.ok((await read()).ok);

     await trigger.click();
     const list=await ownedVisibleListbox(page,trigger),option=list.getByRole('option');
     assert.equal(await list.evaluate(el=>el.parentElement===document.body&&getComputedStyle(el).position==='fixed'),true);
     assert.equal(await list.getAttribute('data-tcrn-theme'),localTheme);
     assert.equal(await list.evaluate(el=>getComputedStyle(el).colorScheme),localTheme);
     assert.equal(await option.evaluate(el=>el===document.activeElement),true);
     await pane.evaluate((el,theme)=>el.setAttribute('data-tcrn-theme',theme),outerTheme);
     assert.equal(await list.getAttribute('data-tcrn-theme'),outerTheme,'theme changes while the list is open');
     await pane.evaluate((el,theme)=>el.setAttribute('data-tcrn-theme',theme),localTheme);
     assert.equal(await list.getAttribute('data-tcrn-theme'),localTheme);

     await page.keyboard.press('Space');
     assert.equal(await option.getAttribute('aria-selected'),'false');
     await page.keyboard.press('Escape');
     assert.equal(await list.count(),0);
     assert.equal(await trigger.evaluate(el=>el===document.activeElement),true);
     await trigger.press('ArrowDown');
     assert.equal(await option.evaluate(el=>el===document.activeElement),true);
     assert.equal(await option.getAttribute('aria-selected'),'false');
     await option.click();
     assert.equal(await option.getAttribute('aria-selected'),'true');
     await page.keyboard.press('Escape');
     assert.equal(await trigger.getAttribute('aria-expanded'),'false');
     assert.ok((await read()).ok);
    }finally{await page.close();}
   }
  }finally{await reference.close();}
 },{entry});
});
import { publishedShortcutContexts } from '../scripts/lib/published-standard-proof.mjs';
import { extractTokens } from '../scripts/lib/approved-site-source.mjs';
import fs from 'node:fs';
import path from 'node:path';
test('published form and shell role comparison rejects wrong-form ink-2 and wrong-shell ink-3 in every entry/locale/theme',async()=>{
 const source=readApprovedSource(),tokens=extractTokens(source),roles=publishedShortcutOccurrences(source);
 assert.equal(roles.length,14);assert.equal(roles.filter(role=>role.annotatedCell).length,3);
 assert.equal(roles.filter(role=>role.board==='06-inputs').length,8);
 for(const theme of ['light','dark'])assert.deepEqual(roles.filter(role=>role.scene==='form'&&role.theme===theme).map(role=>role.state),['default','hover','focus','sm']);
 for(const entry of ['static','manager'])await withPublishedBrowser(async({browser,base,source})=>{
  for(const locale of ['zh-CN','en','ja','ko','fr'])for(const board of ['06-inputs','07a-shell-upper','07b-shell-lower']){
   const page=await browser.newPage({viewport:{width:1440,height:1000}}),reference=await browser.newPage({viewport:{width:2640,height:1000}});
   try{
    await reference.goto(`${base}/__formal/${board}`);await reference.evaluate(()=>document.fonts.ready);
    await openPublishedBoard(page,{base,entry,locale,board});
    const collect=()=>collectPublishedShortcuts({source,board,reference,page,entry,locale}),baseline=await collect(),localRoles=roles.filter(role=>role.board===board);
    assert.equal(baseline.observed,localRoles.length);assert.deepEqual(baseline.fidelityIssues,[],`${entry}/${locale}/${board}`);
    // Baseline contrast issues are retained by the production proof. They cannot
    // turn a source-faithful reading into a color exception or a visual pass.
    for(const role of localRoles){
     const actual=publishedShortcutLocator(page,role),values=Object.fromEntries(tokens.themed.map(row=>[row.key,row[role.theme]]));
     const changes=[{label:'wrong role ink',style:{color:values[role.scene==='form'?'ink-2':'ink-3']}}];
     if(role.scene!=='form')changes.push({label:'wrong context typography',style:{fontSize:role.scene==='menu'?'10px':'10.5px'}},{label:'form capsule in shell',style:{border:'1px solid currentColor',padding:'0 4px',borderRadius:'4px'}});
     for(const change of changes){
      const previous=await actual.getAttribute('style');
      try{
       await actual.evaluate((element,style)=>Object.assign(element.style,style),change.style);
       const changed=await collect(),reading=changed.observations.find(row=>row.key===role.key);
       assert.ok(reading.fidelityIssues.length,`${entry}/${locale}/${role.key}: ${change.label} must reach the production collector`);
       if(change.label==='wrong role ink')assert.ok(reading.fidelityIssues.includes('published text role color'));
       if(change.label==='wrong context typography')assert.ok(reading.fidelityIssues.includes('published shortcut fontSize'));
       if(change.label==='form capsule in shell')assert.ok(reading.fidelityIssues.includes('published shortcut borderWidths'));
       assert.deepEqual(reading.reference,baseline.observations.find(row=>row.key===role.key).reference,'independent published reference is unchanged by candidate mutations');
      }finally{await actual.evaluate((element,style)=>{if(style===null)element.removeAttribute('style');else element.setAttribute('style',style);},previous);}
     }
     if(role.scene==='drop'){
      const parent=actual.locator('..'),original=await actual.evaluate(element=>{const html=element.outerHTML;element.remove();return html;});
      try{assert.ok((await collect()).observations.find(row=>row.key===role.key).fidelityIssues.some(issue=>issue.includes('Missing or duplicate')),'actual missing dropdown kbd is observable');}
      finally{await parent.evaluate((element,html)=>element.insertAdjacentHTML('beforeend',html),original);}
     }
    }
    assert.deepEqual((await collect()).fidelityIssues,[],'all actual nodes/styles restored');
   }finally{await page.close();await reference.close();}
  }
 },{entry});
});
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

import { publishedSearchOccurrences,publishedSearchLocator,collectPublishedSearchAssemblies } from '../scripts/lib/published-browser-proof.mjs';
test('real adjacent shell searches reject wrong icon/track/origin/type/reserve against unchanged published carriers',async()=>{
 for(const entry of ['static','manager'])await withPublishedBrowser(async({browser,base,source})=>{
  const roles=publishedSearchOccurrences(source);
  assert.equal(roles.length,7);assert.equal(roles.filter(role=>role.context==='sheet').length,1);
  for(const locale of ['zh-CN','en','ja','ko','fr'])for(const board of ['07a-shell-upper','07b-shell-lower']){
   const page=await browser.newPage({viewport:{width:1440,height:1000}}),reference=await browser.newPage({viewport:{width:2640,height:1000}});
   try{
    await reference.goto(`${base}/__formal/${board}`);await reference.evaluate(()=>document.fonts.ready);
    const localRoles=roles.filter(role=>role.board===board);
    const liveSearch=role=>{
     const carrier=publishedSearchLocator(page,role);
     return {carrier,control:carrier.locator('input'),icon:carrier.locator('svg')};
    };
    const restoreBoard=async()=>{
     // A real navigation remounts ShellExample's independent menu/openPin/Sheet
     // owners. Restoring styles or disabled alone cannot reopen dismissed peers.
     await openPublishedBoard(page,{base,entry,locale,board});
     for(const role of localRoles){
      const scene=page.locator(`[data-formal-shell-scene="${role.scene}"][data-shell-theme="${role.theme}"]`);
      assert.equal(await scene.count(),1,`${role.key}: matching real source scene`);
      const {carrier,control}=liveSearch(role);
      await carrier.waitFor({state:'visible'});await control.waitFor({state:'visible'});
      assert.equal(await carrier.count(),1,`${role.key}: one mounted carrier`);
      assert.equal(await control.count(),1,`${role.key}: one native input`);
      const layer=carrier.locator('xpath=ancestor::*[@role="dialog"][1]');
      await layer.waitFor({state:'visible'});
      const layerId=await layer.getAttribute('id');assert.ok(layerId,`${role.key}: actual open layer identity`);
      assert.equal(await scene.locator('[aria-controls]').evaluateAll((nodes,id)=>nodes.filter(node=>node.getAttribute('aria-controls')===id&&node.getAttribute('aria-expanded')==='true').length,layerId),1,`${role.key}: real owner is open`);
      assert.equal(await control.isEnabled(),true);assert.equal(await control.inputValue(),'');
     }
    };
    const collect=()=>collectPublishedSearchAssemblies({source,board,reference,page,entry,locale});
    await restoreBoard();const baseline=await collect();
    assert.equal(baseline.observations.length,localRoles.length*3);assert.deepEqual(baseline.issues,[],`${entry}/${locale}/${board}`);
    for(const role of localRoles){
     await restoreBoard();
     const {carrier,control,icon}=liveSearch(role);
     const changes=[
      {node:carrier,style:{gridTemplateColumns:role.hasShortcut?'24px minmax(0,1fr) auto':'24px minmax(0,1fr)'},failure:'published search leadingTrack'},
      {node:control,style:{paddingLeft:'4px'},failure:'published search textOrigin'},
      {node:icon,style:{width:'12px',height:'12px'},failure:'published search iconWidth'},
      {node:control,style:{paddingRight:'7ch'},failure:'published search flexible text capacity/reserve'},
      {node:carrier,style:{height:'36px'},failure:'published search height'},
      ...(role.context==='drop'?[{node:control,style:{fontSize:'13px'},failure:'published search fontSize'}]:[])
     ];
     for(const change of changes){
      const original=await change.node.getAttribute('style');
      try{
       await change.node.evaluate((element,style)=>Object.assign(element.style,style),change.style);
       const changed=await collect(),rows=changed.observations.filter(row=>row.key===role.key);
       assert.equal(rows.length,3);
       for(const reading of rows){
        assert.ok(reading.failures.includes(change.failure),`${entry}/${locale}/${role.key}/${reading.state}: ${change.failure} reaches the real collector`);
        assert.deepEqual(reading.reference,baseline.observations.find(row=>row.key===role.key&&row.state===reading.state).reference,'candidate mutations cannot rewrite the independent published reference');
       }
      }finally{await change.node.evaluate((element,value)=>value===null?element.removeAttribute('style'):element.setAttribute('style',value),original);}
     }
     // All carrier regions still focus the same native input; editing/selection
     // stay on that input. The hint creates no extra tab stop or action.
     for(const regionName of ['carrier','icon',...(role.hasShortcut?['hint']:[])]){
      // Each pointer phase may correctly close every sibling transient layer.
      // Reconstruct first, then acquire nodes from that newly mounted scene.
      await restoreBoard();
      const live=liveSearch(role),region=regionName==='carrier'?live.carrier:regionName==='icon'?live.icon:live.carrier.locator('kbd');
      await live.control.blur();
      if(regionName==='carrier')await region.click({position:{x:2,y:2}});else await region.click({force:true});
      assert.equal(await live.control.evaluate(element=>element===document.activeElement),true,'whole search hit region retains focus');
      for(const sibling of localRoles.filter(candidate=>candidate.key!==role.key)){
       await publishedSearchLocator(page,sibling).waitFor({state:'detached'});
      }
     }
     await restoreBoard();const native=liveSearch(role);
     await native.control.fill('abcdef');await native.control.evaluate(element=>element.select());
     assert.equal(await native.control.inputValue(),'abcdef');
     await page.keyboard.press('Backspace');assert.equal(await native.control.inputValue(),'');
     // Disabled native semantics also apply when the pointer hits the carrier.
     await native.control.evaluate(element=>{element.blur();element.disabled=true;});
     try{await native.carrier.click({position:{x:2,y:2},force:true});assert.equal(await native.control.evaluate(element=>element===document.activeElement),false);}
     finally{await native.control.evaluate(element=>element.disabled=false);}
     await page.mouse.click(0,0);await native.carrier.waitFor({state:'detached'});
    }
    await restoreBoard();const restored=await collect();
    assert.equal(restored.observations.length,localRoles.length*3,'final pristine whole-board matrix is complete');
    assert.deepEqual(restored.observations.map(row=>[row.key,row.state]),baseline.observations.map(row=>[row.key,row.state]),'all original source-role/state identities remain reachable');
    assert.deepEqual(restored.issues,[],'actual nodes/styles, React open state and native values restored');
   }finally{await page.close();await reference.close();}
  }
 },{entry});
});
