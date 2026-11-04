import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { chromium } from "@playwright/test";
import { ROOT,readApprovedSource,extractMatrixOccurrences } from "./approved-site-source.mjs";
import { contrast,FORMAL_REVIEW_STATUS,LOCALES } from "./published-standard-proof.mjs";
import { SHELL_G18, SHELL_G18_FIXTURES, collectShellG18, installIntroRecorder, readIntro, judgeShellG18, installShellFixture } from "./published-shell-gates.mjs";

export const PROOF_ENTRIES=Object.freeze(['static','manager']);
const managerExports={"01-tokens":"tokens","02-typography":"typography","03-icons":"icons","04-brand":"brand","05-actions":"actions","06-inputs":"inputs","07a-shell-upper":"shell-upper","07b-shell-lower":"shell-lower"};
export function managerStoryId(board){if(!Object.hasOwn(managerExports,board))throw new Error(`Unsupported manager board ${board}`);return `published-standards--${managerExports[board]}`;}
export function publishedBoardUrl(base,entry,locale,board){
 if(!PROOF_ENTRIES.includes(entry)||!LOCALES.includes(locale)||!Object.hasOwn(managerExports,board))throw new Error('Unsupported published route context');
 return entry==='static'?`${base}/${locale}/${board}.html`:`${base}/iframe.html?id=${managerStoryId(board)}&viewMode=story&globals=locale:${locale}`;
}
export function proofContexts({themes=false}={}){return PROOF_ENTRIES.flatMap(entry=>LOCALES.flatMap(locale=>themes?['light','dark'].map(theme=>({entry,locale,theme})):[{entry,locale}]));}
export async function openPublishedBoard(page,{base,entry,locale,board}){
 const response=await page.goto(publishedBoardUrl(base,entry,locale,board));
 if(!response||response.status()!==200)throw new Error(`Unreadable ${entry}/${locale}/${board}`);
 await page.locator(`[data-approved-board="${board}"]`).waitFor();
 await page.locator('[data-docs-ready="true"]').waitFor();
 await page.evaluate(()=>document.fonts.ready);
}
export async function configureProofPage(page,theme='light'){
 await page.addInitScript(theme=>localStorage.setItem('tcrn-published-docs:anonymous:design-system',JSON.stringify({theme,pins:['01-tokens','02-typography','04-brand']})),theme);
}
function referenceHtml(source,board){
  const html=board.html.replace(/<script\b[\s\S]*?<\/script>/gi,"").replace(/<link\b[^>]*>/gi,"").replace(/sc-raw-/g,"").replace(/sc-camel-view-box/g,"viewBox");
  const fonts=source.fontCss.replace(/url\(([^)]+)\)/g,(_whole,url)=>`url("/__source-font/${url.replace(/['"]/g,"").replace(/^\//,"")}")`);
  return `<!doctype html><html><head><meta charset="utf-8"><style>${fonts}\n${board.css}</style></head><body>${html}</body></html>`;
}
export async function withPublishedBrowser(run,{root=ROOT,entry="static"}={}){
  const source=readApprovedSource(root),output=path.join(root,"apps/storybook",entry==="manager"?"storybook-preview-static":"storybook-static");
  if(!["static","manager"].includes(entry)||!fs.existsSync(path.join(output,"index.html")))throw new Error(`Missing actual ${entry} build output; run its declared build prerequisite before this proof`);
  const server=http.createServer((req,res)=>{try{const url=new URL(req.url,"http://localhost");if(url.pathname.startsWith("/__formal/")){const board=source.board(url.pathname.split("/").pop());res.setHeader("content-type","text/html; charset=utf-8");res.end(referenceHtml(source,board));return;}let base=output,rel=decodeURIComponent(url.pathname);if(rel.startsWith("/__source-font/")){base=source.base;rel=rel.slice("/__source-font".length);}const file=path.resolve(base,"."+rel+(rel.endsWith("/")?"index.html":""));if(!file.startsWith(base+path.sep)){res.writeHead(403);res.end();return;}const types={".html":"text/html; charset=utf-8",".js":"text/javascript",".css":"text/css",".svg":"image/svg+xml",".woff2":"font/woff2",".json":"application/json"};res.setHeader("content-type",types[path.extname(file)]??"text/plain");res.end(fs.readFileSync(file));}catch{res.writeHead(404);res.end();}});
  await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
  let browser;
  try{browser=await chromium.launch({headless:true});const base=`http://127.0.0.1:${server.address().port}`;return await run({browser,base,source,entry,output});}
  finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
export async function measureElement(locator,{probe="ink",kind="text"}={}){
  return locator.evaluate((input,{probe,kind})=>{
    const target=input.getAttribute("data-source-probe-target");let element=target?(target.startsWith("body ")?document.querySelector(target.slice(5)):input.querySelector(target)):input;
    if(!element)throw new Error(`Missing actual component probe target ${target}`);
    if(element.tagName==="SPAN"&&element.classList.contains("tcrn-select-wrap__icon"))element=element.querySelector("svg")??element;
    const pseudo=probe==="ph"?"::placeholder":probe.startsWith("after")?(element.classList.contains("tcrn-switch__control")?"::before":"::after"):null;
    const s=getComputedStyle(element,pseudo),rect=element.getBoundingClientRect();
    const chain=[];for(let p=element;p;p=p.parentElement)chain.push(getComputedStyle(p).backgroundColor);
    const shadows=[...s.boxShadow.matchAll(/rgba?\([^)]+\)/g)].map(m=>m[0]);
    let ink=s.color;if((kind==="edge"||probe==="after-shadow")&&shadows.length)ink=shadows[0];if(probe==="after-border")ink=s.borderRightColor;if(probe==="after-bg")ink=s.backgroundColor;
    return {ink,background:s.backgroundColor,chain,color:s.color,font:s.fontFamily,fontSize:s.fontSize,lineHeight:s.lineHeight,weight:s.fontWeight,stroke:s.strokeWidth,shadow:s.boxShadow,width:rect.width,height:rect.height,visible:!!element.getClientRects().length&&rect.width>0,tag:element.tagName,pseudo};
  },{probe,kind});
}
export function publishedTextRoleIssues(actual,reference,{kind="text",probe="ink"}={}){
  if(probe==="ph")return actual.ink===reference.ink?[]:["source placeholder ink"];
  if(kind!=="text")return [];
  return actual.color===reference.color?[]:["published text role color"];
}
function solidBackground(chain){
  // Each layer is composited from the document canvas toward the actual painted element.
  const parse=c=>{const n=c.match(/[\d.]+/g)?.map(Number)??[255,255,255];return [n[0],n[1],n[2],n[3]??1];};let result=[255,255,255,1];
  for(const value of [...chain].reverse()){const c=parse(value);result=[0,1,2].map(i=>c[i]*c[3]+result[i]*(1-c[3])).concat(1);}
  return `rgb(${result.slice(0,3).join(",")})`;
}
export async function proveFamilyMatrices({root=ROOT}={}){
 const results=[];
 for(const entry of PROOF_ENTRIES){
  try{results.push(await withPublishedBrowser(async({browser,base,source})=>{
   const issues=[],observations=[],cells=extractMatrixOccurrences(source).filter(c=>!c.board.startsWith("07"));
   for(const locale of LOCALES)for(const board of [...new Set(cells.map(c=>c.board))]){
    const reference=await browser.newPage({viewport:{width:2640,height:1000}}),candidate=await browser.newPage({viewport:{width:1440,height:1000}});
    try{
     await reference.goto(`${base}/__formal/${board}`);await reference.evaluate(()=>document.fonts.ready);
     await openPublishedBoard(candidate,{base,entry,locale,board});
     const allReference=reference.locator('[data-cell]');let occurrence=0;
     for(const cell of cells.filter(c=>c.board===board)){
      const ref=allReference.nth(occurrence++),actual=candidate.locator(`[data-source-cell-key="${cell.key}"]`),observation={entry,locale,key:cell.key,cellId:cell.cellId,theme:cell.theme,sourceLine:cell.sourceLine,sourceScene:cell.sourceScene,sourceState:cell.sourceState,carrier:cell.carrier,kind:cell.kind,exempt:cell.exempt,expected:cell.expect,ok:false};
      let openSelector;
      try{
       if(await actual.count()!==1)throw new Error('Missing or duplicate package source probe');
       openSelector=await actual.getAttribute('data-source-open-control');if(openSelector)await actual.locator(openSelector).click();
       const referenceReading=await measureElement(ref,cell),reading=await measureElement(actual,cell),measured=contrast(reading.ink,solidBackground(reading.chain)),failures=[];
       if(!reading.visible||!referenceReading.visible)failures.push('source/candidate painted carrier is not visible');
       if(!cell.exempt&&measured<(cell.kind==='text'?4.5:3))failures.push(`threshold ${cell.kind==='text'?4.5:3}`);
       if(Number.isFinite(Number(cell.expect))&&Number(measured.toFixed(2))!==Number(cell.expect))failures.push(`ratio ${measured.toFixed(2)} != ${cell.expect}`);
       failures.push(...publishedTextRoleIssues(reading,referenceReading,cell));
       Object.assign(observation,{measured,reading,referenceReading,ok:!failures.length,reason:failures.join('; ')});
      }catch(error){observation.reason=error.message;}finally{if(openSelector)await candidate.keyboard.press('Escape');}
      if(!observation.ok)issues.push(`${entry}/${locale}/${cell.key}: ${observation.reason}`);observations.push(observation);
     }
    }catch(error){issues.push(`${entry}/${locale}/${board}: incomplete family collection: ${error.message}`);}finally{await reference.close();await candidate.close();}
   }
   if(observations.length!==cells.length*LOCALES.length)issues.push(`${entry}: incomplete family occurrence coverage ${observations.length}/${cells.length*LOCALES.length}`);
   return {entry,issues,sourceCommit:source.manifest.site.sourceCommit,sourceOccurrences:cells.length,observations};
  },{root,entry}));}catch(error){results.push({entry,issues:[`${entry}: ${error.message}`],observations:[]});}
 }
 return {issues:results.flatMap(r=>r.issues),sourceOccurrences:230,expectedComparisons:230*proofContexts().length,observed:results.reduce((n,r)=>n+r.observations.length,0),observations:results.flatMap(r=>r.observations),entries:results.map(({observations,...r})=>r),...FORMAL_REVIEW_STATUS};
}

const shellRoles={
 "brand-word":".tcrn-shell-brand__word","brand-suffix":".tcrn-shell-brand__suffix",tgl:"[data-shell-toggle]",
 "pin-on":'.tcrn-shell-pins__item[aria-current="page"]',"pin-chev":".tcrn-shell-pins__chevron","pin-hover":'[data-pin="settlements"] .tcrn-shell-pins__item',"pin-open":'.tcrn-shell-pins__item[aria-expanded="true"]',"pin-rest":'.tcrn-shell-pins__item:not([aria-current]):not([aria-expanded="true"])',
 bell:".tcrn-shell-bell",avatar:".tcrn-shell-avatar","crumb-parent":".tcrn-breadcrumb a","crumb-current":'.tcrn-breadcrumb [aria-current="page"]',h2:".tcrn-page-header__title",sub:".tcrn-doc-shell-sub","btn-primary":".tcrn-page-header .tcrn-button--primary","tab-on":'.tcrn-tabs__tab[aria-selected="true"]',"tab-off":'.tcrn-tabs__tab[aria-selected="false"]',th:".tcrn-doc-table th","td-name":".tcrn-doc-table td:first-child","st-ok":".tcrn-doc-status--ok",
 "srch-ph":".tcrn-search-input__control","srch-kbd":".tcrn-search-input__shortcut","it-on":'.tcrn-shell-menu .tcrn-nav-item[aria-current="page"]',"it-hover":'.tcrn-shell-menu .tcrn-nav-item[data-tcrn-preview-state="hover"]',"it-rest":'.tcrn-shell-menu .tcrn-nav-item:not([aria-current]):not([data-tcrn-preview-state]):not([aria-expanded])',"pinb-on-wash":'.tcrn-shell-menu .tcrn-nav-item-row:has([aria-current="page"]) [data-pin-button]',"pinb-outline":'.tcrn-shell-menu .tcrn-nav-item-row:has(.tcrn-nav-item[data-tcrn-preview-state="hover"]) [data-pin-button]',"pinb-on":'.tcrn-shell-menu .tcrn-nav-item-row:has(.tcrn-nav-item:not([aria-current]):not([data-tcrn-preview-state])) [data-pin-button][aria-pressed="true"]',"grp-hover":".tcrn-nav-group__label-text","pbar-label":".tcrn-shell-menu__crumbs-label","lk-b":".tcrn-product-logo__line-one-base","lk-em":".tcrn-product-logo__line-one-suffix","lk-small":".tcrn-product-logo__line-two","drop-srch":".tcrn-shell-dropdown .tcrn-search-input__control","drop-rest":'.tcrn-shell-dropdown .tcrn-nav-item:not([aria-expanded])',"drop-on":'.tcrn-shell-dropdown .tcrn-nav-item[aria-expanded="true"]',"drop2-rest":".tcrn-shell-dropdown__col .tcrn-nav-item"
};
export function shellSceneFor(cell){return cell.mobile?(cell.sourceState==="sheet"?"phone":"phone-closed"):cell.sourceState==="expanded"?"menu":cell.sourceState==="drop"?"drop":"band";}
export async function readShellMatrices({browser,base,source,page,fixture,entry="static",locale="en"}){
 const observations=[],issues=[],cells=extractMatrixOccurrences(source).filter(c=>c.board.startsWith("07"));
 for(const board of source.boards.filter(b=>b.slug.startsWith("07"))){
  const ref=await browser.newPage({viewport:{width:2640,height:1000}});
  try{await ref.goto(`${base}/__formal/${board.slug}`);await openPublishedBoard(page,{base,entry,locale,board:board.slug});await Promise.all([ref.evaluate(()=>document.fonts.ready),page.evaluate(()=>document.fonts.ready)]);if(fixture)await installShellFixture(page,fixture);
   let nth=0;for(const cell of cells.filter(c=>c.board===board.slug)){
    const sourceElement=ref.locator('[data-cell]').nth(nth++),role=cell.cellId.replace(/-[ln]$/,''),selector=shellRoles[role],scene=shellSceneFor(cell),theme=cell.theme==='night'?'dark':'light';
    const observation={entry,locale,key:cell.key,cellId:cell.cellId,sourceLine:cell.sourceLine,sourceScene:cell.sourceScene,sourceState:cell.sourceState,carrier:cell.carrier,scene,theme,selector,ok:false};
    try{if(!selector)throw new Error(`Unmapped source shell role ${role}`);const element=page.locator(`[data-formal-shell-scene="${scene}"][data-shell-theme="${theme}"]`).first().locator(selector).first();if(await element.count()!==1)throw new Error('Missing actual package probe');
     await page.mouse.move(0,0);if(['pin-hover','grp-hover','it-hover','pinb-outline'].includes(role)&&await element.isVisible()){if(role==='pinb-outline')await element.locator('..').hover();else await element.hover();}
     const candidateProbe=role==='srch-ph'||role==='drop-srch'?'ph':cell.probe,actual=await measureElement(element,{...cell,probe:candidateProbe}),reference=await measureElement(sourceElement,cell),ratio=contrast(actual.ink,solidBackground(actual.chain));
     const failures=[];if(!actual.visible||!reference.visible)failures.push('source/candidate carrier not visible');if(!cell.exempt&&ratio<(cell.kind==='text'?4.5:3))failures.push(`threshold ${cell.kind==='text'?4.5:3}`);if(Number(ratio.toFixed(2))!==Number(cell.expect))failures.push(`ratio ${ratio.toFixed(2)} != ${cell.expect}`);failures.push(...publishedTextRoleIssues(actual,reference,{kind:cell.kind,probe:candidateProbe}));
     Object.assign(observation,{actual,reference,ratio,expected:cell.expect,exempt:cell.exempt,probe:cell.probe,candidateProbe,ok:!failures.length,reason:failures.join('; ')});
    }catch(error){observation.reason=error.message;}
    if(!observation.ok)issues.push(`${cell.key}: ${observation.reason}`);observations.push(observation);
   }
  }catch(error){issues.push(`${entry}/${locale}/${board.slug}: incomplete shell collection: ${error.message}`);}finally{await ref.close();}
 }
 if(observations.length!==cells.length)issues.push(`${entry}/${locale}: incomplete shell occurrence coverage ${observations.length}/${cells.length}`);
 return {entry,locale,sourceOccurrences:cells.length,observations,issues};
}
export async function proveShell({root=ROOT,fixtures=false}={}){
 const entries=[];
 for(const entry of PROOF_ENTRIES){
  try{entries.push(await withPublishedBrowser(async({browser,base,source})=>{
   const issues=[],observations=[],contexts=[],fixtureResults=[];
   for(const locale of LOCALES){
    const matrixPage=await browser.newPage({viewport:{width:1440,height:1000}});let matrix;
    try{matrix=await readShellMatrices({browser,base,source,page:matrixPage,entry,locale});issues.push(...matrix.issues.map(i=>`${entry}/${locale}: ${i}`));observations.push(...matrix.observations);}catch(error){issues.push(`${entry}/${locale}: incomplete matrix ${error.message}`);matrix={sourceOccurrences:225,observations:[],issues:[error.message]};}finally{await matrixPage.close();}
    for(const theme of ['light','dark']){
     const context={entry,locale,theme},page=await browser.newPage({viewport:{width:1440,height:1000}}),url=publishedBoardUrl(base,entry,locale,'07a-shell-upper');let intro,gates;
     try{
      await configureProofPage(page,theme);await installIntroRecorder(page);intro=await readIntro(page,url,{theme});
      await openPublishedBoard(page,{base,entry,locale,board:'07a-shell-upper'});
      const facts=await collectShellG18(page,source,{matrix,intro,locale,theme});gates=judgeShellG18(facts,source);contexts.push({...context,facts,g18:gates});
      // Baseline issues remain visible even when this same command exercises fixtures.
      for(const [id,failures]of Object.entries(gates))issues.push(...failures.map(message=>`${entry}/${locale}/${theme}/${id}: ${message}`));
     }catch(error){issues.push(`${entry}/${locale}/${theme}: incomplete G18 baseline: ${error.message}`);contexts.push({...context,error:error.message});}finally{await page.close();}
     if(fixtures)for(const definition of SHELL_G18){
      const mutated=await browser.newPage({viewport:{width:1440,height:1000}});
      try{
       await configureProofPage(mutated,theme);await installIntroRecorder(mutated,{forgetSession:definition.id==='G16'});
       const localIntro=definition.id==='G16'?await readIntro(mutated,url,{theme}):intro;
       const localMatrix=definition.id==='G13'?await readShellMatrices({browser,base,source,page:mutated,fixture:definition.id,entry,locale}):matrix;
       await openPublishedBoard(mutated,{base,entry,locale,board:'07a-shell-upper'});
       const localFacts=await collectShellG18(mutated,source,{matrix:localMatrix,intro:localIntro,fixture:definition.id,locale,theme}),failures=judgeShellG18(localFacts,source)[definition.id],baseline=gates?.[definition.id],newFailures=failures.filter(f=>!baseline?.includes(f)),caught=!!baseline&&failures.length>0&&newFailures.length>0;
       if(!caught)issues.push(`${entry}/${locale}/${theme}/${definition.id}: local DOM/behavior fixture did not expose a new failure against a complete baseline`);
       fixtureResults.push({...context,id:definition.id,mutation:SHELL_G18_FIXTURES[definition.id],baseline,failures,newFailures,caught});
      }catch(error){issues.push(`${entry}/${locale}/${theme}/${definition.id}: fixture incomplete: ${error.message}`);fixtureResults.push({...context,id:definition.id,caught:false,error:error.message});}finally{await mutated.close();}
     }
    }
   }
   return {entry,issues,observations,contexts,fixtureResults,sourceCommit:source.manifest.site.sourceCommit};
  },{root,entry}));}catch(error){entries.push({entry,issues:[`${entry}: ${error.message}`],observations:[],contexts:[],fixtureResults:[]});}
 }
 return {issues:entries.flatMap(e=>e.issues),sourceOccurrences:225,expectedComparisons:225*proofContexts().length,observations:entries.flatMap(e=>e.observations),contexts:entries.flatMap(e=>e.contexts),expectedG18Contexts:proofContexts({themes:true}).length,fixtureResults:entries.flatMap(e=>e.fixtureResults),expectedFixtures:fixtures?18*proofContexts({themes:true}).length:0,mode:fixtures?'local-negative-fixtures':'candidate-measurement',...FORMAL_REVIEW_STATUS};
}
