import assert from "node:assert/strict";
import test from "node:test";
import { expect } from "@playwright/test";
import { APPROVED_BOARD_IDS } from "../scripts/lib/approved-site-pins.mjs";
import { APPROVED_API_BOARDS,checkProjection,expectedOutputPaths,validateOutputMembers,compiled,managerIndexIssues,MANAGER_STORY_IDS } from "../scripts/lib/published-standard-proof.mjs";
const registry=Object.entries(APPROVED_BOARD_IDS).map(([id,sourceId])=>({id,sourceId}));
const {ROOT}=await import("../scripts/lib/approved-site-source.mjs");
const {approvedApi:apis}=await compiled(ROOT,"apps/storybook/dist/approved-api.js");
test("V3 registry and checker agreeing cannot grant authority to an unsupported old story or API",()=>{assert.deepEqual(checkProjection(registry,apis),[]);const altered=[...registry,{id:"brand-identity",sourceId:registry[3].sourceId}];const bogusLocalChecker=rows=>rows===altered;assert.equal(bogusLocalChecker(altered),true);assert.ok(checkProjection(altered,apis).length);assert.ok(checkProjection(registry,[...apis,{name:"StateView",board:"01-tokens",props:["state"]}]).length);assert.ok(checkProjection(registry,apis.map(a=>a.name==="Button"?{...a,board:"04-brand"}:a)).length);});
test("V7 rejects unlinked pages, renamed assets and old compiled JS by exact output membership",()=>{
 const expected=expectedOutputPaths();
 assert.deepEqual(validateOutputMembers(expected,expected),[]);
 for(const stale of ["reference-components.html","assets/renamed-mark.svg","en/brand-identity.html","old-client.js","fonts/old.woff2",
  ...["zh-CN","en","ja","ko","fr"].map(locale=>`${locale}/source.html`)]){
  assert.ok(validateOutputMembers([...expected,stale],expected).some(issue=>issue.includes(stale)));
 }
});

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
 const sourceId = 'published-standards--source';
 const source = { ...entries[MANAGER_STORY_IDS[0]], id: sourceId };
 assert.ok(managerIndexIssues({ entries: { ...entries, [sourceId]: source } }).length);
 const miskeyed = { ...entries, [sourceId]: entries[MANAGER_STORY_IDS[0]] };
 delete miskeyed[MANAGER_STORY_IDS[0]];
 assert.ok(managerIndexIssues({ entries: miskeyed }).length);
 for (const name of ['home', 'api']) {
   const missing = { ...entries };
   delete missing[`published-standards--${name}`];
   assert.ok(managerIndexIssues({ entries: missing }).length);
 }
});

import { formalLockupExpectations,lockupRoleIssues,shellBrandNameIssues,SHELL_BRAND_NAMES } from '../scripts/lib/published-api-browser.mjs';
import { readApprovedSource,sourceElements,extractMatrixOccurrences,extractIcons,extractMarks } from '../scripts/lib/approved-site-source.mjs';
import { exerciseDocsNavigation } from '../scripts/lib/published-docs-browser.mjs';
import { managerStoryId,publishedBoardUrl,proofContexts,publishedTextRoleIssues,withPublishedBrowser,openPublishedBoard,publishedShortcutOccurrences,publishedShortcutLocator,collectPublishedShortcuts,configureProofPage,readFamilyCell,ownedVisibleListbox } from '../scripts/lib/published-browser-proof.mjs';

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
    await openPublishedBoard(page,{base,entry,locale,board,originalSpecimens:board.startsWith("07")});
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
      const parent=await actual.locator('..').elementHandle();
      const original=await actual.evaluate(element=>{const html=element.outerHTML;element.remove();return html;});
      try{assert.ok((await collect()).observations.find(row=>row.key===role.key).fidelityIssues.some(issue=>issue.includes('Missing or duplicate')),'actual missing dropdown kbd is observable');}
      finally{
       await parent.evaluate((element,html)=>element.insertAdjacentHTML('beforeend',html),original);
       await parent.dispose();
      }
     }
    }
    assert.deepEqual((await collect()).fidelityIssues,[],'all actual nodes/styles restored');
   }finally{await page.close();await reference.close();}
  }
 },{entry});
});
test('the real navigation caller accepts only the two registered dialog-role destinations and reaches every later assertion',async()=>{
 const source=readApprovedSource(),base='http://127.0.0.1:1234',formal=Object.fromEntries(apis.map(api=>[api.name,{board:api.board}]));
 const sourceLabels={'zh-CN':'正式来源',en:'Published source',ja:'公開済みソース',ko:'게시된 원본',fr:'Source publiée'};
 for(const entry of ['static','manager'])for(const locale of ['zh-CN','en','ja','ko','fr']){
  const emptyQueries=['StateView','brand-identity','tcrn-brand-mark.svg',sourceLabels[locale],source.manifest.site.sourceCommit];
  function caller(alter=rows=>rows){
   let url='',query='',board='01-tokens';const emptyWaits=[],activations=[];
   const apiHref=name=>entry==='static'?`/${locale}/api.html#api-${name}`:`${publishedBoardUrl(base,entry,locale,formal[name].board).slice(base.length)}#api-${name}`;
   const roleRows=()=>alter(['ShellBrandButton','ShellMenu'].map(name=>({id:`api-${name}`,name,href:apiHref(name)})));
   const roleQuery=()=>query.trim().normalize('NFKC').toLowerCase()==='dialog';
   const destination=href=>new URL(href,url||base).href;
   const result=name=>({waitFor:async()=>{},getAttribute:async key=>{assert.equal(key,'href');return apiHref(name);},click:async()=>{url=destination(apiHref(name));board=formal[name].board;activations.push(name);}});
   const links={
    first:()=>({waitFor:async options=>{assert.deepEqual(options,{state:'visible'});assert.ok(roleQuery());}}),
    evaluateAll:async()=>{assert.ok(roleQuery());return roleRows();},
    count:async()=>roleQuery()?roleRows().length:0,
    filter:({has})=>{const name=Object.keys(formal).find(name=>has.options.hasText.test(name));assert.equal(query,name);return result(name);},
   };
   const menu={locator:selector=>{
    if(selector==='[data-shell-search] input[type="search"]')return {fill:async value=>{query=value;}};
    if(selector==='[data-search-result]')return links;
    if(selector==='[data-product-shell-search-empty]:not([hidden])')return {waitFor:async()=>{emptyWaits.push(query);assert.ok(emptyQueries.includes(query),'Dialog must never await an impossible empty state');}};
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
    return {waitFor:async()=>{const name=/^\[data-approved-api="([^"]+)"\]$/.exec(selector)?.[1];if(name)assert.equal(new URL(url).hash,`#api-${name}`);else assert.ok(selector==='[data-docs-ready="true"]'||selector===`[data-approved-board="${board}"]`,selector);}};
   }};
   return {run:()=>exerciseDocsNavigation(page,{base,entry,locale,source,formal}),state:()=>({emptyWaits,activations})};
  }
  const good=caller(),reading=await good.run();assert.deepEqual(reading.issues,[]);
  assert.deepEqual(reading.observations.filter(o=>o.kind==='document-navigation').map(o=>o.board),Object.keys(APPROVED_BOARD_IDS));
  assert.deepEqual(reading.observations.filter(o=>o.kind==='dialog-role-search').map(o=>o.query),['Dialog','  ＤｉＡｌＯｇ  ']);
  assert.deepEqual(good.state(),{emptyWaits:emptyQueries,activations:apis.map(api=>api.name)});
  for(const alter of [rows=>rows.slice(0,1),rows=>[...rows,{id:'api-Dialog',name:'Dialog',href:entry==='static'?`/${locale}/api.html#api-Dialog`:`${publishedBoardUrl(base,entry,locale,'07b-shell-lower').slice(base.length)}#api-Dialog`}],rows=>rows.map((row,i)=>i?row:{...row,id:'api-Dialog'}),rows=>rows.map((row,i)=>i?row:{...row,href:`/en/api.html#api-ShellBrandButton-wrong`})]){
   assert.ok((await caller(alter).run()).issues.some(issue=>issue.includes('dialog role search')),'missing, extra, unsupported or misrouted role hits must fail the actual caller');
  }
 }
});
test('each generated API page keeps machine identity and component destinations',()=>{
 const source=readApprovedSource();
 for(const locale of ['zh-CN','en','ja','ko','fr']){
  const directory=path.join(ROOT,'apps/storybook/storybook-static',locale);
  const html=fs.readFileSync(path.join(directory,'api.html'),'utf8'),nodes=sourceElements(html);
  assert.equal(nodes.filter(node=>Object.hasOwn(node.attrs,'data-approved-board')).length,0);
  assert.deepEqual(nodes.filter(node=>Object.hasOwn(node.attrs,'data-approved-api')).map(node=>node.attrs['data-approved-api']).sort(),
   apis.map(api=>api.name).sort());
  assert.equal(nodes.find(node=>node.attrs.name==='standard-source-commit').attrs.content,source.manifest.site.sourceCommit);
  assert.equal(fs.existsSync(path.join(directory,'source.html')),false);
  assert.doesNotMatch(html,/source\.html|#source"|\/ L\d+|Sites v1/);
  for(const api of apis){
   assert.ok(nodes.some(node=>node.attrs.href===`/${locale}/${api.board}.html`));
  }
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
     await openPublishedBoard(page,{base,entry,locale,board,originalSpecimens:board.startsWith("07")});
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

async function openContentPage(page, {base, entry, board, locale = 'zh-CN', width}) {
 const native = entry === 'native-manager';
 await page.setViewportSize({width: native ? width + 350 : width, height: 900});
 if (!native && board !== 'api') {
  await openPublishedBoard(page, {base, entry, locale, board});
  return page.locator('[data-approved-board]');
 }
 const id = board === 'api' ? 'published-standards--api' : managerStoryId(board);
 const route = native ? `/index.html?path=/story/${id}&globals=locale:${locale}`
  : entry === 'static' ? `/${locale}/api.html` : `/iframe.html?id=${id}&viewMode=story&globals=locale:${locale}`;
 const response = await page.goto(base + route);
 assert.equal(response.status(), 200);
 let surface = page;
 if (native) {
  const iframe = page.locator('#storybook-preview-iframe');
  await iframe.waitFor();
  // Measure the Manager's actual Canvas at the same widths as the direct routes.
  await iframe.evaluate((el, width) => { el.style.width = `${width}px`; el.style.maxWidth = 'none'; }, width);
  await expect.poll(() => iframe.evaluate(el => el.contentWindow.innerWidth)).toBe(width);
  surface = page.frameLocator('#storybook-preview-iframe');
 }
 const shell = surface.locator(`.docs-shell[data-docs-page="${board}"][lang="${locale}"][data-docs-ready="true"]`);
 const content = shell.locator(board === 'api' ? '[data-published-api-reference]' : '[data-approved-board]');
 await content.evaluate(el => el.ownerDocument.fonts.ready);
 return content;
}

async function resizeContentPage(page, entry, width) {
 const native = entry === 'native-manager';
 await page.setViewportSize({width: native ? width + 350 : width, height: 900});
 if (native) {
  const iframe = page.locator('#storybook-preview-iframe');
  await iframe.evaluate((el, width) => { el.style.width = `${width}px`; }, width);
  await expect.poll(() => iframe.evaluate(el => el.contentWindow.innerWidth)).toBe(width);
 }
}

async function assertTokenSpacing(article){
 const result=await article.evaluate(root=>{
  const themed=root.querySelector('[data-doc-token-section="themed"]'),fixed=root.querySelector('[data-doc-token-section="fixed"]');
  const table=themed.querySelector('table'),heading=fixed.querySelector('h2');
  return {
   gaps:[fixed.getBoundingClientRect().top-table.getBoundingClientRect().bottom,
    fixed.querySelector('.tcrn-doc-grid').getBoundingClientRect().top-heading.getBoundingClientRect().bottom],
   headings:[themed.querySelector('h2').textContent,heading.textContent],
   rows:table.tBodies[0].rows.length,
   wraps:[...table.querySelectorAll('th,td')].every(cell=>getComputedStyle(cell).whiteSpace==='normal'&&cell.scrollWidth<=cell.clientWidth+1),
   spacing:[...root.querySelectorAll('[data-doc-spacing-role]')].map(el=>el.querySelector('dd').textContent.trim()),
  };
 });
 assert.deepEqual(result.gaps,[28,14],'theme table and fixed values retain section and heading gaps');
 assert.ok(result.headings.every(Boolean)&&result.headings[0]!==result.headings[1]);
 assert.equal(result.rows,39);
 assert.ok(result.wraps);
 assert.deepEqual(result.spacing,['--tcrn-space-2h · 10 px','--tcrn-space-3h · 14 px','2 × --tcrn-space-3h · 28 px']);
}

async function assertDocumentLayoutGuide(article) {
 const reading = await article.locator('[data-doc-layout-guide]').evaluate(guide => {
  const style = getComputedStyle(guide.closest('.docs-frame'));
  return {
   heading: guide.querySelector('h2').textContent,
   intro: guide.querySelector('p').textContent,
   roles: [...guide.querySelectorAll('[data-doc-layout-role] dd')].map(el => el.textContent.trim()),
   css: ['--docs-column-cap', '--tcrn-space-3h', '--tcrn-space-4']
    .map(name => parseFloat(style.getPropertyValue(name))),
  };
 });
 const [cap, space3h, space4] = reading.css;
 assert.match(reading.heading, /Storybook/);
 assert.match(reading.intro, /390 px/);
 assert.equal(cap, 1240);
 assert.deepEqual(reading.roles, [
  `--docs-column-cap · ${cap} px`,
  `2 × --tcrn-space-3h · ${2 * space3h} px`,
  `--tcrn-space-4 · ${space4} px`,
 ]);
}

async function assertIconCatalog(article,source){
 const expected=extractIcons(source).map(icon=>icon.name).sort();
 const themes=await article.locator('[data-formal-theme]').evaluateAll(panes=>panes.map(pane=>({
  theme:pane.dataset.formalTheme,
  groups:[...pane.querySelectorAll('[data-doc-icon-group]')].map(group=>({
   id:group.dataset.docIconGroup, title:group.querySelector('h3')?.textContent.trim(),
   icons:[...group.querySelectorAll('[data-formal-icon]')].map(item=>({
    name:item.dataset.formalIcon, label:item.querySelector('code')?.textContent,
    icons:[...item.querySelectorAll('svg')].map(svg=>({
     name:svg.dataset.iconName,title:svg.querySelector('title')?.textContent??svg.getAttribute('aria-label'),
     size:svg.getBoundingClientRect().width,
    })),
   })),
  })),
  sizes:[...pane.querySelectorAll('[data-doc-icon-size]')].map(item=>({
   key:item.dataset.docIconSize,text:item.querySelector('strong')?.textContent,use:item.querySelector('p')?.textContent,
   hit:item.querySelector('button').getBoundingClientRect().width,
   hitHeight:item.querySelector('button').getBoundingClientRect().height,
  })),
 })));
 assert.deepEqual(themes.map(pane=>pane.theme),['light','dark']);
 for(const {groups,sizes} of themes){
  assert.deepEqual(groups.map(group=>group.id),['navigation','find','actions','appearance','status','shell'],'each use group occurs once');
  assert.ok(groups.every(group=>group.title&&group.icons.length)&&new Set(groups.map(group=>group.title)).size===6,'visible use group headings');
  assert.deepEqual(groups.at(-1).icons.map(icon=>icon.name),['pin']);
  const icons=groups.flatMap(group=>group.icons);
  assert.deepEqual(icons.map(icon=>icon.name).sort(),expected,'complete names without duplicates');
  for(const item of icons){
   assert.equal(item.label,item.name,'visible catalog name');
   assert.deepEqual(item.icons.map(icon=>icon.size),[14,16,20],`all glyph sizes for ${item.name}`);
   assert.ok(item.icons.every(icon=>icon.name===item.name&&icon.title?.includes(item.name)),'named real icon instances');
  }
  assert.deepEqual(sizes.map(({key,hit,hitHeight})=>[key,hit,hitHeight]),[['sm',28,28],['md',32,32],['lg',40,40]]);
  assert.ok(sizes.every(({text,use},index)=>text?.includes(`${[14,16,20][index]} px`)&&use?.trim()),'visible glyph size and use');
 }
}

async function assertBrandCatalog(article,source){
 const proseGap=await article.locator('[data-doc-brand-guide] .tcrn-doc-prose').evaluate(el=>
  el.children[1].getBoundingClientRect().top-el.firstElementChild.getBoundingClientRect().bottom);
 assert.equal(proseGap,10,'paragraphs retain the existing 10 px spacing');
 const locale = await article.getAttribute('lang');
 // The use cases are the 07a size comparisons, expanded menu and sign-in scene.
 const uses = {
  'zh-CN': [/桌面顶带.*22 px 紧凑首行/, /完整菜单.*右下角.*带描述.*22 px.*装饰/, /登入页.*带描述.*44 px 完整锁定块/, /44 px 首行.*尺度对照/],
  en: [/desktop top band.*22 px compact first line/, /expanded menu.*decorative 22 px compact lockup with its description.*bottom-right/, /sign-in screen.*44 px full lockup with its description/, /44 px first line.*comparison/],
  ja: [/デスクトップ頂帯.*22 px.*コンパクト版の先頭行/, /全体メニューの右下.*説明文付きの 22 px.*装飾/, /サインイン画面.*説明文付きの 44 px フル版/, /44 px の先頭行.*比較/],
  ko: [/데스크톱 상단 바.*22 px 소형 첫 줄/, /전체 메뉴의 오른쪽 아래.*설명을 포함한 22 px.*장식/, /로그인 화면.*설명을 포함한 44 px 전체 조합/, /44 px 첫 줄.*비교/],
  fr: [/bandeau sur ordinateur.*première ligne compacte de 22 px/, /menu déployé.*en bas à droite.*bloc compact décoratif de 22 px avec son descriptif/, /écran de connexion.*bloc complet de 44 px avec son descriptif/, /première ligne de 44 px sert de repère/],
 };
 const guide = article.locator('[data-doc-brand-shell-use]');
 const usage = await guide.textContent();
 for (const use of uses[locale]) assert.match(usage, use, locale);
 assert.match(await guide.evaluate(el => el.nextElementSibling.textContent), /128.*22 px/, locale);
 const expected=extractMarks(source).map(({productId,name})=>[productId,name]);
 const themes=await article.locator('[data-formal-theme]').evaluateAll(panes=>panes.map(pane=>
  [...pane.querySelectorAll('[data-formal-section]')].map(product=>{
   const read=figure=>{
    const caption=figure.querySelector('figcaption'),svg=figure.querySelector('svg');
    const range=document.createRange();
    if(caption)range.selectNodeContents(caption);
    const rect=svg.getBoundingClientRect();
    return {caption:caption?.textContent.trim(),lines:caption?new Set([...range.getClientRects()].map(box=>box.top)).size:0,
     square:rect.width===rect.height,size:rect.width,mark:svg.dataset.productMark,variant:svg.dataset.productMarkVariant};
   };
   return {
    id:product.dataset.formalSection,name:product.querySelector('h3').textContent.trim(),
    ladder:[...product.querySelectorAll('[data-doc-brand-ladder] figure')].map(read),
    renditions:[...product.querySelectorAll(':scope > .tcrn-doc-row figure')].map(read),
    lockups:[...product.querySelectorAll('[data-doc-brand-lockups] figure')].map(read),
   };
  })));
 assert.equal(themes.length,2);
 for(const products of themes){
  assert.deepEqual(products.map(({id,name})=>[id,name]),expected);
  for(const {id,ladder,renditions,lockups} of products){
   assert.deepEqual(ladder.map(sample=>sample.size),[128,64,48,32,24,16]);
   assert.deepEqual(renditions.map(({variant,size})=>[variant,size]),[['color',44],['mono',56],['tile-tint',64],['tile-tint',32],['tile-deep',64],['tile-deep',32]]);
   assert.deepEqual(lockups.map(sample=>sample.size),[44,22,44,22]);
   assert.ok([...ladder,...renditions,...lockups].every(sample=>sample.square&&sample.mark===id&&sample.caption?.endsWith(`${sample.size} px`)&&sample.lines===1),'unclipped labeled rendition and size');
   assert.equal(new Set(lockups.map(sample=>sample.caption)).size,4);
  }
 }
}

const contentEntries=['static','manager','native-manager'];
const formalBoards=Object.keys(APPROVED_BOARD_IDS);

test('content layout, icon groups and mark renditions render in all three entries',async()=>{
 for(const entry of contentEntries)await withPublishedBrowser(async({browser,base,source})=>{
  const page=await browser.newPage();
  try{
   for(const board of formalBoards){
    const article=await openContentPage(page,{base,entry,board,width:390});
    const layout=await article.evaluate(root=>{
     const main=root.closest('.docs-paper > main'),doc=root.ownerDocument;
     return [getComputedStyle(root).rowGap,doc.documentElement.scrollWidth,doc.documentElement.clientWidth,main.scrollWidth,main.clientWidth];
    });
    assert.equal(layout[0],'28px',`${entry}/${board} document hierarchy`);
    assert.ok(layout[1]<=layout[2]+1&&layout[3]<=layout[4]+1,`${entry}/${board} outer overflow ${layout}`);
    if(board==='01-tokens'){
     await assertTokenSpacing(article);
     await assertDocumentLayoutGuide(article);
    }
    if(board==='03-icons')await assertIconCatalog(article,source);
    if(board==='04-brand')await assertBrandCatalog(article,source);
   }
   for(const locale of ['en','ja','ko','fr']){
    await assertDocumentLayoutGuide(await openContentPage(page,{base,entry,board:'01-tokens',locale,width:390}));
    const article=await openContentPage(page,{base,entry,board:'04-brand',locale,width:390});
    await assertBrandCatalog(article,source);
   }
  }finally{await page.close();}
 },{entry:entry==='static'?'static':'manager'});
});

test('content regressions reject collapsed spacing and missing or repeated catalog information',async()=>{
 await withPublishedBrowser(async({browser,base,source})=>{
  const page=await browser.newPage({viewport:{width:390,height:900}});
  const open=async board=>openContentPage(page,{base,entry:'static',board,width:390});
  try{
   const tokens=await open('01-tokens');
   await assertTokenSpacing(tokens);
   await tokens.evaluate(el=>el.style.setProperty('row-gap','0','important'));
   await assert.rejects(assertTokenSpacing(tokens),/section and heading gaps/);
   for(const [selector,mutation] of [
    ['[data-doc-icon-group] h3','remove'],
    ['[data-doc-icon-group="status"]','duplicate'],
    ['[data-formal-icon="search"] code','remove'],
    ['[data-formal-icon="search"] svg','remove'],
    ['[data-formal-icon="search"] svg','duplicate'],
    ['[data-doc-icon-size="sm"] strong','remove'],
   ]){
    const article=await open('03-icons');
    await article.locator(selector).first().evaluate((el,mutation)=>{
     if(mutation==='duplicate')el.after(el.cloneNode(true));
     else el.remove();
    },mutation);
    await assert.rejects(assertIconCatalog(article,source));
   }
   const brand=await open('04-brand');
   await assertBrandCatalog(brand,source);
   await brand.locator('[data-doc-brand-ladder] figcaption').first().evaluate(el=>el.remove());
   await assert.rejects(assertBrandCatalog(brand,source),/unclipped labeled rendition and size/);
  }finally{await page.close();}
 });
});

async function readDocumentColumn(content) {
 return content.evaluate(async root => {
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const doc = root.ownerDocument;
  const frame = root.closest('.docs-frame');
  const main = frame.closest('.docs-paper > main');
  const header = frame.querySelector('.tcrn-page-header');
  const body = frame.querySelector('.tcrn-doc-content');
  const styles = getComputedStyle(main);
  const edges = element => {
   if (!element) return null;
   const {left, right} = element.getBoundingClientRect();
   return [left, right];
  };
  const heading = header.querySelector('h1');
  const titleRange = doc.createRange();
  titleRange.selectNodeContents(heading);
  const titleLines = Array.from(titleRange.getClientRects(), rect => [rect.left, rect.right, rect.top]);
  const groups = {
   header: [header],
   divider: [header.querySelector('.tcrn-page-header__body')],
   breadcrumbs: [header.querySelector('.tcrn-breadcrumb')],
   content: [body, ...body.children, ...root.children],
   geometry: [...root.querySelectorAll('[data-doc-shell-geometry] :is(h2, .tcrn-doc-prose, p)')],
   headings: [...root.querySelectorAll('[data-doc-shell-theme] > h2, [data-doc-shell-theme] > [data-formal-section] > h3')],
   prose: [...root.querySelectorAll('[data-formal-intro] > :is(h2, p), :scope > p')],
   controls: [...root.querySelectorAll('.tcrn-doc-shell-example:not([data-phone]) > .tcrn-doc-shell-tools')],
   desktop: [...root.querySelectorAll('.tcrn-doc-shell-frame:not([data-phone])')],
  };
  const tables = [...root.querySelectorAll('table:not(.tcrn-doc-roster-table)')];
  const examples = [...body.querySelectorAll('[data-api-example]')];
  const details = [...body.querySelectorAll('details[open] [data-api-formal]')];
  return {
   viewport: doc.defaultView.innerWidth,
   mainWidth: main.clientWidth,
   insets: [parseFloat(styles.paddingInlineStart), parseFloat(styles.paddingInlineEnd)],
   column: edges(frame),
   groups: Object.fromEntries(Object.entries(groups).map(([key, elements]) => [key, elements.map(edges)])),
   lead: edges(header.querySelector('.tcrn-page-header__lead')),
   title: edges(heading),
   description: edges(header.querySelector('.tcrn-page-header__description')),
   titleLines,
   phones: [...root.querySelectorAll('.tcrn-doc-shell-frame[data-phone]')].map(edges),
   tables: tables.map(edges),
   examples: examples.map(edges),
   details: details.map(edges),
   overflow: Math.max(main.scrollWidth - main.clientWidth, doc.documentElement.scrollWidth - doc.documentElement.clientWidth),
  };
 });
}

function assertDocumentColumn(reading, width) {
 const close = (a, b) => Math.abs(a - b) <= 0.6;
 assert.equal(reading.viewport, width);
 const inset = width > 750 ? 28 : 16;
 assert.deepEqual(reading.insets, [inset, inset]);
 const columnWidth = Math.min(1240, reading.mainWidth - 2 * inset);
 const [left, right] = reading.column;
 assert.ok(close(right - left, columnWidth), `available column width at ${width}: ${reading.column}`);
 for (const [name, boxes] of Object.entries(reading.groups)) {
  for (const [start, end] of boxes) {
   assert.ok(close(start, left) && close(end, right), `common column edges for ${name}: ${start},${end} vs ${left},${right}`);
  }
 }
 for (const box of [reading.lead, reading.title, reading.description].filter(Boolean)) {
  assert.ok(close(box[0], left) && box[1] <= right + 0.6, 'the header text starts at the column edge');
 }
 for (const [start, end] of reading.phones) {
  assert.ok(start >= left - 0.6 && end <= right + 0.6 && close(end - start, Math.min(columnWidth, 390)), 'phone preview retains its own width within the column');
 }
 for (const [start, end] of [...reading.tables, ...reading.examples, ...reading.details]) {
  assert.ok(start >= left - 0.6 && end <= right + 0.6, 'tables and API content stay inside the column');
 }
 assert.ok(reading.titleLines.every(([start, end]) => start >= left - 1 && end <= reading.title[1] + 1), 'title lines fit without clipping');
 assert.ok(reading.overflow <= 1, 'no document-wide horizontal overflow');
}

test('responsive document columns align every board and API page through resize', async t => {
 const boards = [...Object.keys(APPROVED_BOARD_IDS), 'api'];
 for (const entry of contentEntries) await withPublishedBrowser(async ({browser, base}) => {
  const page = await browser.newPage();
  try {
   for (const board of boards) {
    const content = await openContentPage(page, {base, entry, board, width: 1462});
    const widths = board.startsWith('07') ? [1462, 1280, 1200, 1120, 1024, 751, 750, 390] : [1462, 1024, 390];
    for (const width of widths) {
     await resizeContentPage(page, entry, width);
     if (board === 'api' && width === 390) await content.locator('#api-ProductShell summary').click();
     const reading = await readDocumentColumn(content);
     assertDocumentColumn(reading, width);
     if (board === '01-tokens') assert.equal(reading.tables.length, 1);
     if (board === 'api') {
      assert.equal(reading.examples.length, apis.length);
      assert.equal(reading.details.length, width === 390 ? 1 : 0);
     }
     t.diagnostic(JSON.stringify({entry, board, width, viewport: reading.viewport, column: reading.column, insets: reading.insets,
      tables: reading.tables, apiExamples: reading.examples, openDetails: reading.details,
      measured: Object.fromEntries(Object.entries(reading.groups).map(([name, boxes]) => [name, boxes[0]]))}));
    }
    if (['01-tokens', '07a-shell-upper', 'api'].includes(board)) {
     await resizeContentPage(page, entry, 1462);
     await content.evaluate(el => el.closest('.docs-frame').style.setProperty('--docs-column-cap', '1040px'));
     const capped = await readDocumentColumn(content);
     assert.throws(() => assertDocumentColumn(capped, 1462), /available column width/);
     t.diagnostic(JSON.stringify({entry, board, oldInnerCap: capped.column, header: capped.groups.header[0]}));
     await content.evaluate(el => el.closest('.docs-frame').style.removeProperty('--docs-column-cap'));
     assertDocumentColumn(await readDocumentColumn(content), 1462);
    }
   }
   for (const board of ['07a-shell-upper', '07b-shell-lower']) {
    for (const locale of ['zh-CN', 'en', 'ja', 'ko', 'fr']) {
     const content = await openContentPage(page, {base, entry, board, locale, width: 390});
     const reading = await readDocumentColumn(content);
     assertDocumentColumn(reading, 390);
     const lineCount = reading => new Set(reading.titleLines.map(([, , top]) => top)).size;
     if (locale === 'zh-CN') assert.equal(lineCount(reading), 1, 'short title stays on one line');
     if (locale === 'fr') {
      assert.ok(lineCount(reading) > 1, 'long title wraps at the narrow width');
      await resizeContentPage(page, entry, 1462);
      const wider = await readDocumentColumn(content);
      assertDocumentColumn(wider, 1462);
      assert.equal(lineCount(wider), 1, 'wrapped title reflows after resizing');
     }
     t.diagnostic(JSON.stringify({entry, board, locale, width: 390, titleLines: reading.titleLines}));
    }
   }
  } finally { await page.close(); }
 }, {entry: entry === 'static' ? 'static' : 'manager'});
});

async function readActionPacking(content) {
 return content.evaluate(async root => {
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const doc = root.ownerDocument, main = root.closest('main');
  const rect = el => {
   const {left, right, top, bottom, width, height} = el.getBoundingClientRect();
   return {left, right, top, bottom, width, height};
  };
  const clips = [], clipElements = [];
  const controls = [...root.querySelectorAll('button, a.tcrn-button')].map((el, index) => {
   const style = getComputedStyle(el), clipIds = [];
   for (let ancestor = el.parentElement; ancestor; ancestor = ancestor.parentElement) {
    const css = getComputedStyle(ancestor);
    if (!/hidden|clip|auto|scroll/.test(css.overflowX) && !/paint|strict|content/.test(css.contain)) continue;
    let id = clipElements.indexOf(ancestor);
    if (id < 0) {
     id = clips.length;
     const box = rect(ancestor);
     clips.push({className: ancestor.className, overflowX: css.overflowX, contain: css.contain,
      left: box.left + ancestor.clientLeft, right: box.left + ancestor.clientLeft + ancestor.clientWidth});
     clipElements.push(ancestor);
    }
    clipIds.push(id);
   }
   return {index, name: el.getAttribute('aria-label') || el.textContent.trim(), tag: el.tagName,
    theme: el.closest('[data-tcrn-theme]').dataset.tcrnTheme, box: rect(el), clipIds,
    size: el.matches('.tcrn-button--sm') ? 'sm' : el.matches('.tcrn-button--lg') ? 'lg' : 'md',
    variant: el.matches('.tcrn-button--quiet') ? 'quiet' : el.matches('.tcrn-button--secondary') ? 'secondary'
     : el.matches('.tcrn-button--danger') ? 'danger' : 'primary',
    fontSize: style.fontSize, padding: [style.paddingInlineStart, style.paddingInlineEnd], transform: style.transform};
  });
  const allControls = [...root.querySelectorAll('button, a.tcrn-button')];
  const groups = [...root.querySelectorAll('.tcrn-button-group')].map(el => ({
   name: el.getAttribute('aria-label'), theme: el.closest('[data-formal-theme]').dataset.formalTheme,
   size: el.dataset.buttonGroupSize, variant: el.matches('.tcrn-button-group--quiet') ? 'quiet' : 'secondary',
   count: Number(el.dataset.groupBoundary), box: rect(el),
   buttons: [...el.querySelectorAll(':scope > button')].map(button => allControls.indexOf(button)),
   separators: [...el.querySelectorAll(':scope > .tcrn-button-group__separator')].map(rect),
  }));
  const panes = [...root.querySelectorAll(':scope > .tcrn-doc-themes > .tcrn-doc-pane')];
  return {url: doc.URL, viewport: doc.defaultView.innerWidth, column: rect(root.closest('.docs-frame')),
   scrollLeft: [main.scrollLeft, doc.scrollingElement.scrollLeft],
   overflow: [main.scrollWidth - main.clientWidth, doc.documentElement.scrollWidth - doc.documentElement.clientWidth],
   clips, controls, groups, panes: panes.map(rect),
   surfaces: panes.flatMap(pane => [pane, pane.querySelector(':scope > .tcrn-doc-paper')].map(el => {
    const css = getComputedStyle(el);
    return {kind: el === pane ? 'pane' : 'paper', theme: pane.dataset.formalTheme, box: rect(el),
     background: css.backgroundColor, padding: [css.paddingInlineStart, css.paddingInlineEnd],
     token: parseFloat(css.getPropertyValue('--tcrn-space-4')),
     headings: [...el.querySelectorAll('h2, h3')].map(heading => ({text: heading.textContent, box: rect(heading)})),
     controls: allControls.flatMap((control, index) => el.contains(control) ? [index] : [])};
   })),
   spacing: panes.map(pane => {
    const paper = pane.querySelector(':scope > .tcrn-doc-paper'), section = paper.querySelector('[data-formal-section]');
    return {paneGap: getComputedStyle(pane).rowGap, paperGap: getComputedStyle(paper).rowGap,
     headingGap: section.children[1].getBoundingClientRect().top - section.firstElementChild.getBoundingClientRect().bottom};
   })};
 });
}

function assertActionPacking(reading, width) {
 const close = (a, b) => Math.abs(a - b) <= 0.6;
 assert.equal(reading.viewport, width, 'measure the actual content viewport, including the native Manager iframe');
 assert.deepEqual(reading.scrollLeft, [0, 0], 'inspection needs no horizontal document scroll');
 if (width === 390) assert.deepEqual([reading.column.left, reading.column.right], [29, 361]);
 assert.ok(reading.controls.length > 132, 'inspect the other 05 controls and matrix examples too');
 for (const control of reading.controls) {
  const {box, name, index} = control;
  assert.ok(box.width > 0 && box.height > 0, `actual action ${index}/${name} is rendered`);
  assert.equal(box.height, {sm: 28, md: 32, lg: 40}[control.size], `actual action ${index}/${name} retains its hit height`);
  assert.ok(box.left >= reading.column.left - 0.6 && box.right <= reading.column.right + 0.6,
   `actual action ${index}/${name} escapes column: ${box.left}..${box.right} vs ${reading.column.left}..${reading.column.right}`);
  for (const id of control.clipIds) {
   const clip = reading.clips[id];
   assert.ok(box.left >= clip.left - 0.6 && box.right <= clip.right + 0.6,
    `actual action ${index}/${name} crosses clipping ancestor ${clip.className}: ${box.left}..${box.right} vs ${clip.left}..${clip.right}`);
  }
 }
 const expected = ['light', 'dark'].flatMap(theme => ['secondary', 'quiet'].flatMap(variant =>
  ['sm', 'md', 'lg'].flatMap(size => [2, 4, 5].map(count => `${theme}/${variant}/${size}/${count}`))));
 assert.deepEqual(reading.groups.map(g => `${g.theme}/${g.variant}/${g.size}/${g.count}`), expected,
  'every current group size, count, variant and theme remains inspectable');
 for (const group of reading.groups) {
  const buttons = group.buttons.map(index => reading.controls[index]);
  assert.ok(group.box.left >= reading.column.left - 0.6 && group.box.right <= reading.column.right + 0.6,
   `actual action bar ${group.name} escapes column`);
  assert.equal(buttons.length, group.count);
  assert.equal(group.separators.length, group.count - 1);
  assert.ok(close(group.box.left, buttons[0].box.left) && close(group.box.right, buttons.at(-1).box.right),
   `actual action bar ${group.name} contains all its children`);
  for (const [index, button] of buttons.entries()) {
   assert.equal(button.variant, group.variant, 'the group preserves every member variant');
   assert.equal(button.box.height, {sm: 28, md: 32, lg: 40}[group.size], 'formal hit height');
   assert.ok(close(button.box.top, group.box.top), 'the formal group stays a single bar');
   assert.equal(button.transform, 'none', 'natural control size');
   if (index) {
    assert.ok(close(button.box.left - buttons[index - 1].box.right, 2), 'formal separator and member margin');
    assert.equal(group.separators[index - 1].width, 1);
    assert.equal(group.separators[index - 1].height, button.box.height);
   }
  }
 }
 assert.equal(reading.groups.reduce((count, group) => count + group.buttons.length, 0), 132);
 assert.ok(reading.spacing.every(s => s.paneGap === '14px' && s.paperGap === '14px' && s.headingGap === 14),
  'text and controls retain their token spacing');
 assert.ok(reading.overflow.every(excess => excess <= 1), 'no document horizontal overflow');
}

function assertActionInsets(reading, width) {
 assert.deepEqual(reading.surfaces.map(surface => `${surface.theme}/${surface.kind}`),
  ['light/pane', 'light/paper', 'dark/pane', 'dark/paper'], 'inspect both painted surfaces in each theme');
 for (const surface of reading.surfaces) {
  const label = `${surface.theme}/${surface.kind} surface`;
  assert.equal(surface.token, 16, 'existing space-4 token');
  assert.notEqual(surface.background, 'rgba(0, 0, 0, 0)', `${label} is visibly painted`);
  assert.ok(surface.headings.length && surface.controls.length, `${label} carries headings and controls`);
  assert.ok(surface.padding.every(value => parseFloat(value) >= surface.token), `${label} has token inline insets`);
  if (width <= 750) {
   assert.deepEqual(surface.padding, ['16px', '16px'], `${label} uses space-4 without nesting another content reduction`);
   assert.ok(Math.abs(surface.box.left - (reading.column.left - surface.token)) <= 0.6 &&
    Math.abs(surface.box.right - (reading.column.right + surface.token)) <= 0.6, `${label} uses the existing main gutter`);
  }
  for (const {box} of [...surface.headings, ...surface.controls.map(index => reading.controls[index])]) {
   assert.ok(box.left - surface.box.left >= surface.token - 0.6 &&
    surface.box.right - box.right >= surface.token - 0.6, `${label} preserves visible token insets around headings and controls`);
  }
 }
}

function actionGroupGeometry(reading) {
 return reading.groups.map(group => ({name: group.name, theme: group.theme, size: group.size, variant: group.variant,
  buttons: group.buttons.map(index => {
   const {name, tag, box, size, fontSize, padding, transform} = reading.controls[index];
   return {name, tag, width: box.width, height: box.height, size, fontSize, padding, transform};
  })}));
}

async function exerciseNarrowActionGroups(content) {
 const groups = content.locator('.tcrn-button-group[data-button-group-size="lg"][data-group-boundary="5"]');
 const observations = [];
 for (const group of await groups.all()) {
  const buttons = group.locator(':scope > button'), last = buttons.last();
  await last.click();
  const read = () => group.evaluate(el => ({name: el.ariaLabel,
   pressed: [...el.querySelectorAll(':scope > button')].map(b => b.getAttribute('aria-pressed')),
   focused: [...el.querySelectorAll(':scope > button')].indexOf(el.ownerDocument.activeElement)}));
  assert.deepEqual((await read()).pressed, ['false', 'false', 'false', 'false', 'true']);
  const hits = await last.evaluate(el => {
   const r = el.getBoundingClientRect(), doc = el.ownerDocument;
   return [r.left + 0.5, r.right - 0.5].map(x => el.contains(doc.elementFromPoint(x, r.top + r.height / 2)));
  });
  assert.deepEqual(hits, [true, true], 'both edges of the formerly clipped button accept pointer input');
  await last.press('Shift+Tab');
  assert.equal((await read()).focused, 3, 'native backwards tab order');
  await buttons.nth(3).press('Space');
  assert.deepEqual((await read()).pressed, ['false', 'false', 'false', 'true', 'false']);
  for (let index = 3; index > 0; index--) {
   await buttons.nth(index).press('Shift+Tab');
   assert.equal((await read()).focused, index - 1, 'every member remains in native tab order');
  }
  await buttons.first().press('Enter');
  assert.deepEqual((await read()).pressed, ['true', 'false', 'false', 'false', 'false']);
  assert.notEqual(await buttons.first().evaluate(el => getComputedStyle(el).boxShadow), 'none', 'keyboard focus ring');
  const independent = await content.locator('.tcrn-button-group').evaluateAll(elements => elements.every(el =>
   !el.hasAttribute('aria-pressed') && el.querySelectorAll(':scope > button[aria-pressed="true"]').length === 1 &&
   el.querySelector(':scope > button').getAttribute('aria-pressed') === 'true'));
  assert.equal(independent, true, 'activation is local to each example and does not change sibling selection');
  observations.push({...await read(), hits});
 }
 assert.equal(observations.length, 4);
 return observations;
}

test('05 natural-size action descendants fit all five locales in static, Canvas and native Manager', async t => {
 for (const entry of contentEntries) await withPublishedBrowser(async ({browser, base}) => {
  const page = await browser.newPage();
  try {
   for (const locale of ['zh-CN', 'en', 'ja', 'ko', 'fr']) {
    const content = await openContentPage(page, {base, entry, board: '05-actions', locale, width: 1462});
    const desktop = await readActionPacking(content);
    assertActionPacking(desktop, 1462);
    assertActionInsets(desktop, 1462);
    assert.equal(desktop.panes[0].top, desktop.panes[1].top, 'normal desktop retains paired themes');
    t.diagnostic(JSON.stringify({entry, locale, kind: 'desktop', reading: desktop,
     activation: await exerciseNarrowActionGroups(content)}));
    // Intermediate widths exercise the intrinsic theme wrap and existing narrow breakpoint.
    for (const width of locale === 'ja' ? [1024, 942, 808, 751, 750, 390] : [390]) {
     await resizeContentPage(page, entry, width);
     const reading = await readActionPacking(content);
     assertActionPacking(reading, width);
     assertActionInsets(reading, width);
     assert.deepEqual(actionGroupGeometry(reading), actionGroupGeometry(desktop), 'labels and every natural button dimension survive reflow');
     t.diagnostic(JSON.stringify({entry, locale, kind: 'corrected', reading,
      activation: width === 390 ? await exerciseNarrowActionGroups(content) : []}));
    }
    // Source-4's zero insets still fit every control, but leave text on painted edges.
    const zeroInsetStyles = await content.evaluate(root => {
     const themes = root.querySelector(':scope > .tcrn-doc-themes');
     const surfaces = [...themes.querySelectorAll(':scope > .tcrn-doc-pane, :scope > .tcrn-doc-pane > .tcrn-doc-paper')];
     const styles = [themes, ...surfaces].map(el => el.getAttribute('style'));
     themes.style.marginInline = '0';
     for (const surface of surfaces) {
      surface.style.paddingInline = '0';
      surface.style.marginInline = '0';
     }
     return styles;
    });
    try {
     const zero = await readActionPacking(content);
     assertActionPacking(zero, 390);
     assert.throws(() => assertActionInsets(zero, 390), /surface.*insets/);
     assert.ok(zero.surfaces.every(surface => surface.padding.every(value => value === '0px') &&
      surface.headings[0].box.left === surface.box.left), 'negative reproduces headings on both visible surface edges');
     t.diagnostic(JSON.stringify({entry, locale, kind: 'source-4-zero-insets-negative', reading: zero}));
    } finally {
     await content.evaluate((root, styles) => {
      const elements = [...root.querySelectorAll(':scope > .tcrn-doc-themes, :scope > .tcrn-doc-themes > .tcrn-doc-pane, :scope > .tcrn-doc-themes > .tcrn-doc-pane > .tcrn-doc-paper')];
      elements.forEach((el, index) => styles[index] === null ? el.removeAttribute('style') : el.setAttribute('style', styles[index]));
     }, zeroInsetStyles);
    }
    // Restore the frozen 24/28 pane + 16/18 paper packing, without changing any control.
    const originalStyles = await content.evaluate(root => {
     const elements = [...root.querySelectorAll(':scope > .tcrn-doc-themes, :scope > .tcrn-doc-themes > .tcrn-doc-pane, :scope > .tcrn-doc-themes > .tcrn-doc-pane > .tcrn-doc-paper')];
     const styles = elements.map(el => el.getAttribute('style'));
     for (const el of elements) {
      el.style.marginInline = '0';
      if (!el.matches('.tcrn-doc-themes')) el.style.padding = el.matches('.tcrn-doc-pane') ? '24px 28px 28px' : '16px 18px';
     }
     return styles;
    });
    try {
     const old = await readActionPacking(content);
     assert.throws(() => assertActionPacking(old, 390), /actual action.*(column|clipping|bar)/);
     if (locale === 'ja') {
      for (const group of old.groups.filter(g => g.size === 'lg' && g.count === 5)) {
       const last = old.controls[group.buttons.at(-1)];
       assert.deepEqual([group.box.left, group.box.width, last.box.left, last.box.right], [75, 240, 363.46875, 403.46875]);
       const nearest = old.clips[last.clipIds[0]];
       assert.equal(nearest.right, 377);
       assert.equal(nearest.right - last.box.left, 13.53125, 'negative case reproduces the reported partial hit area');
      }
     }
     t.diagnostic(JSON.stringify({entry, locale, kind: 'old-nested-packing-negative', reading: old}));
    } finally {
     await content.evaluate((root, styles) => {
      const elements = [...root.querySelectorAll(':scope > .tcrn-doc-themes, :scope > .tcrn-doc-themes > .tcrn-doc-pane, :scope > .tcrn-doc-themes > .tcrn-doc-pane > .tcrn-doc-paper')];
      elements.forEach((el, index) => styles[index] === null ? el.removeAttribute('style') : el.setAttribute('style', styles[index]));
     }, originalStyles);
    }
    const restored = await readActionPacking(content);
    assertActionPacking(restored, 390);
    assertActionInsets(restored, 390);
   }
  } finally { await page.close(); }
 }, {entry: entry === 'static' ? 'static' : 'manager'});
});

async function readPhonePair(theme) {
 return theme.evaluate(async root => {
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const row = root.querySelector('.tcrn-doc-shell-narrow');
  const rect = el => el.getBoundingClientRect().toJSON();
  const scene = section => {
   const frame = section.querySelector('[data-specimen-view]');
   const tools = section.querySelector('.tcrn-doc-shell-tools');
   return {
    section: rect(section), frame: rect(frame), artwork: rect(frame.firstElementChild),
    heading: section.querySelector('h3').textContent, dimensions: tools.querySelector('span').textContent,
    owner: tools.querySelector('button').getAttribute('aria-controls'),
    id: frame.id, mode: frame.dataset.formalShellScene, view: frame.dataset.specimenView,
   };
  };
  return {
   row: rect(row), gap: parseFloat(getComputedStyle(row).gap),
   sectionGap: 2 * parseFloat(getComputedStyle(root).getPropertyValue('--tcrn-space-3h')),
   phones: [...row.children].map(scene),
   desktop: [...root.querySelectorAll(':scope > [data-formal-section] [data-specimen-view]')].map(rect),
  };
 });
}

function assertPhonePair(reading, sideBySide) {
 const close = (a, b) => Math.abs(a - b) < 0.6;
 const {row, gap, sectionGap, phones, desktop} = reading;
 const [band, sheet] = phones;
 assert.deepEqual(phones.map(phone => phone.mode), ['phone-closed', 'phone']);
 assert.ok(band.heading && sheet.heading && band.heading !== sheet.heading);
 assert.notEqual(band.id, sheet.id);
 assert.equal(gap, sectionGap);
 assert.equal(sideBySide, row.width >= 2 * 390 + gap);
 for (const phone of phones) {
  assert.equal(phone.owner, phone.id, 'each size toggle controls its own frame');
  assert.equal(phone.dimensions, '390 × 640 px');
  assert.equal(phone.view, 'fit');
  assert.ok(close(phone.frame.width, Math.min(390, row.width)));
  assert.ok(['left', 'right', 'top', 'bottom'].every(edge => close(phone.frame[edge], phone.artwork[edge])), 'fit includes all four phone edges');
 }
 assert.ok(close(band.frame.left, row.left));
 if (sideBySide) {
  assert.ok(close(band.frame.top, sheet.frame.top), 'phones share a row when two full specimens fit');
  assert.ok(close(sheet.frame.left - band.frame.right, gap));
  assert.ok(phones.every(phone => close(phone.frame.width, 390) && close(phone.frame.height, 640)));
 } else {
  assert.ok(close(sheet.frame.left, band.frame.left), 'stacked phones start at the same edge');
  assert.ok(close(sheet.section.top - band.section.bottom, gap), 'stacked phones keep the token gap');
 }
 assert.equal(desktop.length, 3);
 assert.ok(desktop.every(box => close(box.left, row.left) && close(box.right, row.right)), 'desktop specimens span the full row');
}

test('consecutive phone previews fit or stack at their available-width threshold', async t => {
 for (const entry of contentEntries) await withPublishedBrowser(async ({browser, base}) => {
  const page = await browser.newPage({hasTouch: true, reducedMotion: 'reduce'});
  const session = await page.context().newCDPSession(page);
  try {
   for (const board of ['07a-shell-upper', '07b-shell-lower']) {
    const article = await openContentPage(page, {base, entry, board, locale: 'fr', width: 1024});
    for (const name of ['light', 'dark']) {
     await resizeContentPage(page, entry, 1024);
     const theme = article.locator(`[data-doc-shell-theme="${name}"]`);
     const calibration = await readPhonePair(theme);
     const required = 2 * 390 + calibration.sectionGap;
     const threshold = 1024 - calibration.row.width + required;
     for (const width of [threshold - 1, threshold, threshold + 1, 390]) {
      await resizeContentPage(page, entry, width);
      const reading = await readPhonePair(theme);
      assertPhonePair(reading, width >= threshold);
      t.diagnostic(JSON.stringify({entry, board, theme: name, width, threshold, required, reading}));
     }
     await resizeContentPage(page, entry, threshold + 1);
     const row = theme.locator('.tcrn-doc-shell-narrow');
     await row.evaluate(el => { el.style.display = 'block'; });
     const ungrouped = await readPhonePair(theme);
     assert.throws(() => assertPhonePair(ungrouped, true), /phones share a row/);
     t.diagnostic(JSON.stringify({entry, board, theme: name, mutation: 'disable-grouping', reading: ungrouped}));
     await row.evaluate(el => el.style.removeProperty('display'));
     assertPhonePair(await readPhonePair(theme), true);

     const band = theme.locator('[data-formal-shell-scene="phone-closed"]');
     const sheet = theme.locator('[data-formal-shell-scene="phone"]');
     const bandToggle = band.locator('..').locator('[data-doc-shell-view-toggle]');
     const sheetToggle = sheet.locator('..').locator('[data-doc-shell-view-toggle]');
     const sheetMenu = sheet.locator('[data-panel="sheet"]');
     const bandMenu = band.locator('[data-panel="sheet"]');
     await bandToggle.press('Enter');
     await expect(band).toHaveAttribute('data-specimen-view', 'original');
     await expect(sheet).toHaveAttribute('data-specimen-view', 'fit');
     await expect(sheetMenu).toBeVisible();
     await expect(bandMenu).toHaveCount(0);
     await sheetToggle.press('Enter');
     await expect(band).toHaveAttribute('data-specimen-view', 'original');
     await expect(sheet).toHaveAttribute('data-specimen-view', 'original');

     for (const [frame, isSheet] of [[band, false], [sheet, true]]) {
      const inner = frame.locator(isSheet ? '.tcrn-shell-sheet__list' : '.tcrn-product-shell__main');
      await frame.scrollIntoViewIfNeeded();
      await frame.evaluate(el => {
       const main = el.closest('.docs-paper > main');
       main.scrollTop += el.getBoundingClientRect().top - main.getBoundingClientRect().top - 12;
      });
      const start = await readInnerPan(frame, isSheet);
      assert.equal(start.extent, 0, 'full-width phone frames need no original-size pan');
      for (const method of ['wheel', 'touch']) {
       const gesture = await sendInnerPan(page, session, frame, inner, isSheet, method);
       const after = await readInnerPan(frame, isSheet);
       assert.equal(after.scroll, 0);
       assert.deepEqual(after.pageInlineScroll, [0, 0]);
       t.diagnostic(JSON.stringify({entry, board, theme: name, mode: isSheet ? 'phone' : 'phone-closed', method, gesture, after}));
      }
     }

     const search = sheetMenu.locator('input[type="search"]');
     await search.fill('Roster');
     await expect(search).toHaveValue('Roster');
     await expect(bandMenu).toHaveCount(0);
     await search.press('Escape');
     await expect(sheetMenu).toHaveCount(0);
     const brand = band.locator('[data-shell-brand]');
     await brand.press('Enter');
     await expect(bandMenu).toBeFocused();
     await expect(bandMenu.locator('input[type="search"]')).toHaveValue('');
     await expect(sheetMenu).toHaveCount(0);
     await bandMenu.press('Escape');
     await expect(brand).toBeFocused();
     await brand.press('Enter');
     await band.locator('[data-shell-scrim]').tap({position: {x: 180, y: 60}});
     await expect(bandMenu).toHaveCount(0);
     await bandToggle.press('Enter');
     await sheetToggle.press('Enter');
     // Reload the authored open Sheet before reading the next theme's untouched previews.
     await openContentPage(page, {base, entry, board, locale: 'fr', width: 1024});
    }
   }
  } finally { await page.close(); }
 }, {entry: entry === 'static' ? 'static' : 'manager'});
});

async function readCompleteShells(article){
 return article.evaluate(root=>{
  const doc=root.ownerDocument,main=root.closest('.docs-paper > main');
  const box=el=>el.getBoundingClientRect().toJSON();
  const scenes=[...root.querySelectorAll('[data-formal-shell-scene]')].map(frame=>{
   const shell=frame.querySelector(':scope > .tcrn-product-shell');
   const observed=['[data-paper]','[data-cluster]','.tcrn-page-header__meta',
    '.tcrn-doc-roster-table th:last-child','.tcrn-doc-roster-table tr:last-child td:last-child',
    '[data-panel="expanded"]','[data-panel="drop"]','[data-drop-col]','[data-panel="sheet"]'];
   const targets=observed.flatMap(selector=>[...shell.querySelectorAll(selector)].map(el=>({selector,rect:box(el)})));
   const drop=shell.querySelector('[data-shell-dropdown]');
   const anchor=shell.querySelector('.tcrn-shell-pins__item[aria-expanded="true"]');
   return {
    view:frame.dataset.specimenView,mode:frame.dataset.formalShellScene,theme:frame.dataset.shellTheme,
    frame:box(frame),shell:box(shell),targets,scrollLeft:frame.scrollLeft,
    logical:[shell.offsetWidth,shell.offsetHeight],active:frame.contains(doc.activeElement),
    anchorOffset:drop&&anchor?box(drop).left-box(anchor).left:null,
   };
  });
  return {width:doc.defaultView.innerWidth,overflow:Math.max(doc.documentElement.scrollWidth-doc.documentElement.clientWidth,main.scrollWidth-main.clientWidth),scenes};
 });
}

function assertCompleteShells(reading,board,{initial=true}={}){
 const modes=['band','menu','drop','phone-closed','phone',...(board.startsWith('07a')?['band']:[])];
 const close=(a,b)=>Math.abs(a-b)<.6;
 const contains=(outer,inner)=>inner.width>0&&inner.height>0&&inner.left>=outer.left-.6&&
  inner.right<=outer.right+.6&&inner.top>=outer.top-.6&&inner.bottom<=outer.bottom+.6;
 assert.ok(reading.overflow<=1,'no document-wide horizontal overflow');
 for(const theme of ['light','dark'])assert.deepEqual(reading.scenes.filter(scene=>scene.theme===theme).map(scene=>scene.mode),modes);
 for(const scene of reading.scenes){
  const {mode,theme,frame,shell,targets}=scene,label=`${board}/${reading.width}/${mode}/${theme}`;
  assert.equal(scene.view,'fit',label);
  assert.equal(scene.scrollLeft,0,label);
  const authored=mode.startsWith('phone')?390:1240;
  assert.deepEqual(scene.logical,[authored,640],label);
  assert.ok(contains(frame,shell)&&['left','right','top','bottom'].every(edge=>close(frame[edge],shell[edge])),`complete scene edges ${label}`);
  assert.ok(frame.left>=-.6&&frame.right<=reading.width+.6,`complete viewport edges ${label}`);
  const required=['[data-paper]','[data-cluster]','.tcrn-page-header__meta','.tcrn-doc-roster-table th:last-child','.tcrn-doc-roster-table tr:last-child td:last-child'];
  if(initial){
   if(mode==='menu')required.push('[data-panel="expanded"]');
   if(mode==='drop')required.push('[data-panel="drop"]','[data-drop-col]');
   if(mode==='phone')required.push('[data-panel="sheet"]');
   assert.equal(scene.active,false,`initial focus remains outside ${label}`);
  }
  for(const selector of required)assert.ok(targets.some(target=>target.selector===selector),`missing ${selector} ${label}`);
  for(const {selector,rect} of targets)assert.ok(contains(frame,rect),`cropped ${selector} ${label}`);
  if(scene.anchorOffset!==null)assert.ok(close(scene.anchorOffset,0),`drop aligns with its pin ${label}, offset ${scene.anchorOffset}`);
 }
}

test('complete shell previews contain all four edges and content at 1462, 1024 and 390',async()=>{
 for(const entry of contentEntries)await withPublishedBrowser(async({browser,base})=>{
  const page=await browser.newPage();
  try{
   for(const width of [1462,1024,390])for(const board of ['07a-shell-upper','07b-shell-lower']){
    const article=await openContentPage(page,{base,entry,board,width});
    assertCompleteShells(await readCompleteShells(article),board);
   }
   if(entry==='static'){
    const board='07a-shell-upper',article=await openContentPage(page,{base,entry,board,width:1462});
    const shell=article.locator('[data-formal-shell-scene="band"] > .tcrn-product-shell').first();
    for(const [axis,value] of [['left',20],['left',-20],['top',20],['top',-20]]){
     await shell.evaluate((el,{axis,value})=>el.style[axis]=`${value}px`,{axis,value});
     const reading=await readCompleteShells(article);
     assert.equal(reading.scenes[0].shell.width,1240,'fixture does not resize the scene');
     assert.throws(()=>assertCompleteShells(reading,board),/complete scene edges/);
     await shell.evaluate((el,axis)=>el.style.removeProperty(axis),axis);
    }
    assertCompleteShells(await readCompleteShells(article),board);
   }
  }finally{await page.close();}
 },{entry:entry==='static'?'static':'manager'});
});

test('shell preview inspection preserves one live scene, open layers and focus on resize',async()=>{
 for(const entry of contentEntries)await withPublishedBrowser(async({browser,base})=>{
  const page=await browser.newPage({hasTouch:true});
  try{
   for(const board of ['07a-shell-upper','07b-shell-lower']){
    const article=await openContentPage(page,{base,entry,board,width:390});
    const drop=article.locator('[data-formal-shell-scene="drop"][data-shell-theme="light"]');
    const toggle=frame=>frame.locator('..').locator('[data-doc-shell-view-toggle]');
    const original=frame=>frame.evaluate(el=>{
     const r=el.firstElementChild.getBoundingClientRect();
     return [el.dataset.specimenView,r.width,r.height,el.querySelectorAll(':scope > .tcrn-product-shell').length];
    });
    await toggle(drop).press('Enter');
    assert.deepEqual(await original(drop),['original',1240,640,1]);
    assert.equal(await toggle(drop).evaluate(el=>el===el.ownerDocument.activeElement),true);
    assert.equal(await drop.locator('[data-drop-col]').count(),1,'authored open cascade survives inspection');
    await drop.press('ArrowRight');
    await expect.poll(()=>drop.evaluate(el=>el.scrollLeft),{message:'keyboard can pan at original size'}).toBeGreaterThan(0);
    await toggle(drop).click();
    assert.equal(await drop.getAttribute('data-specimen-view'),'fit');
    assert.equal(await drop.evaluate(el=>el.scrollLeft),0);
    const band=article.locator('[data-formal-shell-scene="band"][data-shell-theme="light"]').first();
    const brand=band.locator('[data-shell-brand]');
    await brand.click();
    const menu=band.locator('[data-panel="expanded"]');
    await menu.waitFor();
    assert.equal(await menu.locator('input[type="search"]').evaluate(el=>el===el.ownerDocument.activeElement),true);
    await page.keyboard.press('Escape');
    await menu.waitFor({state:'detached'});
    assert.equal(await brand.evaluate(el=>el===el.ownerDocument.activeElement),true);
    const pin=band.locator('[data-pin="contracts"] .tcrn-shell-pins__item');
    await pin.click();
    const dropPanel=band.locator('[data-panel="drop"]');
    await dropPanel.waitFor();
    assertCompleteShells(await readCompleteShells(article),board,{initial:false});
    await page.keyboard.press('Escape');
    await dropPanel.waitFor({state:'detached'});
    const phone=article.locator('[data-formal-shell-scene="phone-closed"][data-shell-theme="dark"]');
    await toggle(phone).tap();
    assert.deepEqual(await original(phone),['original',390,640,1]);
    const trigger=phone.locator('[data-shell-brand]');
    await trigger.tap();
    const sheet=phone.locator('[data-panel="sheet"]');
    await sheet.waitFor();
    assert.equal(await sheet.evaluate(el=>el===el.ownerDocument.activeElement),true);
    const search=sheet.locator('input[type="search"]');
    const searchReceivesPointer=()=>search.evaluate(el=>{
     el.scrollIntoView({block:'center',inline:'nearest'});
     const rect=el.getBoundingClientRect();
     return el.ownerDocument.elementFromPoint((rect.left+rect.right)/2,(rect.top+rect.bottom)/2)===el;
    });
    assert.ok(await searchReceivesPointer(),'Sheet search is clear of pin hit areas');
    if(entry==='static'&&board==='07a-shell-upper'){
     const pins=sheet.locator('[data-pin-button]');
     await pins.evaluateAll(elements=>elements.forEach(el=>el.style.position='static'));
     assert.equal(await searchReceivesPointer(),false,'unanchored pin hit areas obscure the search');
     await pins.evaluateAll(elements=>elements.forEach(el=>el.style.removeProperty('position')));
    }
    await search.tap();
    assert.equal(await search.evaluate(el=>el===el.ownerDocument.activeElement&&el.getBoundingClientRect().height===44),true);
    await page.keyboard.press('Escape');
    await sheet.waitFor({state:'detached'});
    assert.equal(await trigger.evaluate(el=>el===el.ownerDocument.activeElement),true);
    await toggle(phone).tap();
    await trigger.tap();
    await sheet.waitFor();
    if(entry==='native-manager')await page.locator('#storybook-preview-iframe').evaluate(el=>el.style.width='1024px');
    else await page.setViewportSize({width:1024,height:900});
    assertCompleteShells(await readCompleteShells(article),board,{initial:false});
    assert.equal(await sheet.count(),1,'open Sheet remains in its specimen on resize');
    assert.equal(await article.evaluate(el=>el.closest('.docs-shell').dataset.docsPage),board,'specimen interaction stays in the document');
   }
  }finally{await page.close();}
 },{entry:entry==='static'?'static':'manager'});
});

async function innerPanOrigin(frame, inner, isSheet, eventType) {
 const origin = await inner.evaluate((el, {isSheet, eventType}) => {
  const frame = el.closest('[data-specimen-view]');
  const bounds = frame.getBoundingClientRect();
  const doc = el.ownerDocument;
  const surface = isSheet ? el : el.querySelector('.tcrn-doc-roster-table tbody');
  const area = surface.getBoundingClientRect();
  const x = Math.floor(Math.min(bounds.right, area.right, doc.documentElement.clientWidth)) - 16;
  const top = Math.ceil(Math.max(0, bounds.top, area.top));
  const bottom = Math.min(bounds.bottom, area.bottom, doc.documentElement.clientHeight);
  for (let y = top + 12; y < bottom; y += 8) {
   const hit = doc.elementFromPoint(x, y);
   const cell = isSheet ? hit : hit?.closest('td');
   if (cell && surface.contains(cell)) {
    delete el.dataset.docPanInput;
    el.addEventListener(eventType, event => {
     el.dataset.docPanInput = JSON.stringify({
      trusted: event.isTrusted,
      inScroller: el.contains(event.target),
      inSurface: surface.contains(event.target),
      target: event.target.tagName,
      client: [event.clientX ?? event.touches[0].clientX, event.clientY ?? event.touches[0].clientY],
     });
    }, {capture: true, once: true, passive: true});
    return {x: x - bounds.left, y: y - bounds.top, tag: cell.tagName};
   }
  }
  return null;
 }, {isSheet, eventType});
 assert.ok(origin, 'gesture starts on the visible roster cells or inside the visible Sheet list');
 const box = await frame.boundingBox();
 return {x: box.x + origin.x, y: box.y + origin.y, tag: origin.tag};
}

async function readTrustedPanEvent(inner, point, method) {
 await expect(inner).toHaveAttribute('data-doc-pan-input', /./);
 const event = JSON.parse(await inner.getAttribute('data-doc-pan-input'));
 assert.ok(event.trusted && event.inScroller && (method !== 'touch' || event.inSurface), JSON.stringify({method, point, event}));
 return event;
}

async function sendInnerPan(page, session, frame, inner, isSheet, method) {
 const point = await innerPanOrigin(frame, inner, isSheet, method === 'touch' ? 'touchstart' : 'wheel');
 const {x, y} = point;
 if (method === 'wheel') {
  await page.mouse.move(x, y);
  await page.mouse.wheel(250, 0);
 } else {
  await session.send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: [{x, y}]});
  for (let distance = 20; distance <= 200; distance += 20) {
   await session.send('Input.dispatchTouchEvent', {type: 'touchMove', touchPoints: [{x: x - distance, y}]});
  }
  await session.send('Input.dispatchTouchEvent', {type: 'touchEnd', touchPoints: []});
 }
 return {point, event: await readTrustedPanEvent(inner, point, method)};
}

async function readInnerPan(frame, isSheet) {
 return frame.evaluate(async (el, isSheet) => {
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const doc = el.ownerDocument;
  const main = el.closest('.docs-paper > main');
  const bounds = el.getBoundingClientRect();
  const selectors = isSheet ? ['[data-panel="sheet"]', '.tcrn-shell-sheet__list']
   : ['[data-cluster]', '.tcrn-doc-roster-table th:last-child'];
  return {
   viewport: doc.defaultView.innerWidth,
   scroll: el.scrollLeft,
   extent: el.scrollWidth - el.clientWidth,
   shellRight: el.firstElementChild.getBoundingClientRect().right,
   frameRight: bounds.right,
   pageInlineScroll: [doc.scrollingElement.scrollLeft, main.scrollLeft],
   pageBlockScroll: main.scrollTop,
   visible: selectors.map(selector => {
    const target = el.querySelector(selector);
    if (!target) return false;
    const {right, top, bottom} = target.getBoundingClientRect();
    const hit = doc.elementFromPoint(right - 6, (top + bottom) / 2);
    return right - 6 >= bounds.left && right <= bounds.right + 1 && target.contains(hit);
   }),
  };
 }, isSheet);
}

function assertInnerPanMoved(before, after) {
 assert.ok(after > before, 'the gesture moved the original-size frame');
}

test('original-size shell frames pan from real roster and open Sheet input', async t => {
 for (const entry of contentEntries) await withPublishedBrowser(async ({browser, base}) => {
  const page = await browser.newPage({hasTouch: true, reducedMotion: 'reduce'});
  const session = await page.context().newCDPSession(page);
  try {
   for (const board of ['07a-shell-upper', '07b-shell-lower']) {
    for (const [target, theme] of [
     ['desktop roster', 'light'], ['phone roster', 'light'], ['phone roster', 'dark'],
     ['open Sheet', 'light'], ['open Sheet', 'dark'],
    ]) {
     const isSheet = target === 'open Sheet';
     const desktop = target === 'desktop roster';
     const mode = desktop ? 'band' : 'phone-closed';
     for (const method of ['wheel', 'touch']) {
      for (const oldContainment of entry === 'static' && (desktop || theme === 'dark') ? [false, true] : [false]) {
       const article = await openContentPage(page, {base, entry, board, width: 390});
       const frame = article.locator(`[data-formal-shell-scene="${mode}"][data-shell-theme="${theme}"]`).first();
       const inner = frame.locator(isSheet ? '.tcrn-shell-sheet__list' : '.tcrn-product-shell__main');
       const toggle = frame.locator('..').locator('[data-doc-shell-view-toggle]');
       const sheet = frame.locator('[data-panel="sheet"]');
       await toggle.click();
       assert.equal(await frame.getAttribute('data-specimen-view'), 'original');
       if (isSheet) {
        await frame.locator('[data-shell-brand]').click();
        await expect(sheet).toBeFocused();
       }
       await frame.scrollIntoViewIfNeeded();
       await frame.evaluate(el => {
        // Put the specimen's top below the document chrome in the Manager as well.
        const main = el.closest('.docs-paper > main');
        main.scrollTop += el.getBoundingClientRect().top - main.getBoundingClientRect().top - 12;
       });
       if (oldContainment) await inner.evaluate(el => el.style.setProperty('overscroll-behavior-inline', 'contain'));
       assert.deepEqual(await inner.evaluate(el => {
        const style = getComputedStyle(el);
        return [style.overscrollBehaviorX, style.overscrollBehaviorY];
       }), [oldContainment ? 'contain' : 'auto', 'contain']);

       const start = await readInnerPan(frame, isSheet);
       assert.equal(start.viewport, 390);
       assert.equal(start.scroll, 0);
       assert.ok(start.extent > 0 && start.shellRight > start.frameRight);
       const origins = [];
       const scrolls = [];
       let end = start;
       for (let attempt = 0; attempt < 10; attempt++) {
        origins.push(await sendInnerPan(page, session, frame, inner, isSheet, method));
        if (!oldContainment) {
         await expect.poll(() => frame.evaluate(el => el.scrollLeft)).toBeGreaterThan(end.scroll);
        }
        const next = await readInnerPan(frame, isSheet);
        scrolls.push(next.scroll);
        if (oldContainment) {
         assert.throws(() => assertInnerPanMoved(start.scroll, next.scroll), /gesture moved the original-size frame/);
         assert.equal(next.scroll, 0);
        } else {
         assertInnerPanMoved(end.scroll, next.scroll);
        }
        end = next;
        if (oldContainment || end.extent - end.scroll <= 1) break;
       }
       assert.deepEqual(end.pageInlineScroll, [0, 0]);
       let afterVerticalInput;
       if (!oldContainment) {
        assert.ok(end.extent - end.scroll <= 1 && Math.abs(end.shellRight - end.frameRight) <= 1, 'the gesture reaches the visible right edge');
        assert.ok(end.visible.every(Boolean), `the right side of ${target} is visible and hit-testable: ${JSON.stringify(end)}`);
        const point = await innerPanOrigin(frame, inner, isSheet, 'wheel');
        await page.mouse.move(point.x, point.y);
        await page.mouse.wheel(0, -250);
        await readTrustedPanEvent(inner, point, 'wheel');
        afterVerticalInput = (await readInnerPan(frame, isSheet)).pageBlockScroll;
        assert.equal(afterVerticalInput, end.pageBlockScroll, 'vertical input stays in the inner scroller');
       }
       if (isSheet) await expect(sheet).toBeFocused();
       t.diagnostic(JSON.stringify({entry, board, target, theme, method, oldContainment, origins, scrolls, start, end, afterVerticalInput}));
       if (oldContainment) await inner.evaluate(el => el.style.removeProperty('overscroll-behavior-inline'));
       if (isSheet) {
        await sheet.press('Escape');
        await sheet.waitFor({state: 'detached'});
       }
       await toggle.click();
       assert.equal(await frame.getAttribute('data-specimen-view'), 'fit');
       assert.equal(await frame.evaluate(el => el.scrollLeft), 0);
      }
     }
    }
   }
  } finally { await page.close(); }
 }, {entry: entry === 'static' ? 'static' : 'manager'});
});
