import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { chromium } from "@playwright/test";
import { ROOT,readApprovedSource,extractMatrixOccurrences } from "./approved-site-source.mjs";
import { contrast,FORMAL_AMENDMENT_STATE } from "./published-standard-proof.mjs";
import { SHELL_G18, SHELL_G18_FIXTURES, collectShellG18, installIntroRecorder, readIntro, judgeShellG18, installShellFixture } from "./published-shell-gates.mjs";

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
function solidBackground(chain){
  // Each layer is composited from the document canvas toward the actual painted element.
  const parse=c=>{const n=c.match(/[\d.]+/g)?.map(Number)??[255,255,255];return [n[0],n[1],n[2],n[3]??1];};let result=[255,255,255,1];
  for(const value of [...chain].reverse()){const c=parse(value);result=[0,1,2].map(i=>c[i]*c[3]+result[i]*(1-c[3])).concat(1);}
  return `rgb(${result.slice(0,3).join(",")})`;
}
export async function proveFamilyMatrices({root=ROOT}={}){return withPublishedBrowser(async({browser,base,source})=>{
  const issues=[],observations=[],cells=extractMatrixOccurrences(source).filter(c=>!c.board.startsWith("07"));
  for(const board of [...new Set(cells.map(c=>c.board))]){
    const reference=await browser.newPage({viewport:{width:2640,height:1000}}),candidate=await browser.newPage({viewport:{width:1440,height:1000}});
    try{await reference.goto(`${base}/__formal/${board}`);await candidate.goto(`${base}/en/${board}.html`);await reference.evaluate(()=>document.fonts.ready);await candidate.evaluate(()=>document.fonts.ready);
      const allReference=reference.locator("[data-cell]");let occurrence=0;
      for(const cell of cells.filter(c=>c.board===board)){
        const ref=allReference.nth(occurrence++),actual=candidate.locator(`[data-source-cell-key="${cell.key}"]`);
        if(await actual.count()!==1){issues.push(`Missing or duplicate package source probe ${cell.key}`);continue;}
        const opener=actual.locator("[data-source-open-control]");const openSelector=await actual.getAttribute("data-source-open-control");
        if(openSelector){await actual.locator(openSelector).click();}
        try{const referenceReading=await measureElement(ref,cell),reading=await measureElement(actual,cell);
          const expectedRatio=Number(cell.expect),measured=contrast(reading.ink,solidBackground(reading.chain));
          if(!cell.exempt&&measured<(cell.kind==="text"?4.5:3))issues.push(`Published matrix threshold ${cell.key} ${measured.toFixed(2)} < ${cell.kind==="text"?4.5:3}`);
          // Match the published rounded number, without widening its text/icon threshold.
          if(Number.isFinite(expectedRatio)&&Number(measured.toFixed(2))!==expectedRatio)issues.push(`Published matrix value ${cell.key}: ${measured.toFixed(2)} != ${cell.expect}`);
          if(reading.color!==referenceReading.color&&cell.kind==="text")issues.push(`Published text role color drift ${cell.key}`);
          observations.push({key:cell.key,cellId:cell.cellId,sourceLine:cell.sourceLine,kind:cell.kind,exempt:cell.exempt,expected:cell.expect,measured,reading,referenceReading});
        }catch(error){issues.push(`${cell.key}: ${error.message}`);}finally{if(openSelector)await candidate.keyboard.press("Escape");}
      }
    }finally{await reference.close();await candidate.close();}
  }
  return {issues,sourceCommit:source.manifest.site.sourceCommit,sourceOccurrences:cells.length,observed:observations.length,observations,pendingFormalAmendments:["K5"],formalAmendmentState:FORMAL_AMENDMENT_STATE,undecidedStandardClarifications:["S03-C01"]};
},{root});}
const shellRoles={
 "brand-word":".tcrn-shell-brand__word","brand-suffix":".tcrn-shell-brand__suffix",tgl:"[data-shell-toggle]",
 "pin-on":'.tcrn-shell-pins__item[aria-current="page"]',"pin-chev":".tcrn-shell-pins__chevron","pin-hover":'[data-pin="settlements"] .tcrn-shell-pins__item',"pin-open":'.tcrn-shell-pins__item[aria-expanded="true"]',"pin-rest":'.tcrn-shell-pins__item:not([aria-current]):not([aria-expanded="true"])',
 bell:".tcrn-shell-bell",avatar:".tcrn-shell-avatar","crumb-parent":".tcrn-breadcrumb a","crumb-current":'.tcrn-breadcrumb [aria-current="page"]',h2:".tcrn-page-header__title",sub:".tcrn-doc-shell-sub","btn-primary":".tcrn-page-header .tcrn-button--primary","tab-on":'.tcrn-tabs__tab[aria-selected="true"]',"tab-off":'.tcrn-tabs__tab[aria-selected="false"]',th:".tcrn-doc-table th","td-name":".tcrn-doc-table td:first-child","st-ok":".tcrn-doc-status--ok",
 "srch-ph":".tcrn-search-input__control","srch-kbd":".tcrn-search-input__shortcut","it-on":'.tcrn-shell-menu .tcrn-nav-item[aria-current="page"]',"it-hover":'.tcrn-shell-menu .tcrn-nav-item[data-tcrn-preview-state="hover"]',"it-rest":'.tcrn-shell-menu .tcrn-nav-item:not([aria-current]):not([data-tcrn-preview-state]):not([aria-expanded])',"pinb-on-wash":'.tcrn-shell-menu .tcrn-nav-item-row:has([aria-current="page"]) [data-pin-button]',"pinb-outline":'.tcrn-shell-menu .tcrn-nav-item-row:has(.tcrn-nav-item[data-tcrn-preview-state="hover"]) [data-pin-button]',"pinb-on":'.tcrn-shell-menu .tcrn-nav-item-row:has(.tcrn-nav-item:not([aria-current]):not([data-tcrn-preview-state])) [data-pin-button][aria-pressed="true"]',"grp-hover":".tcrn-nav-group__label-text","pbar-label":".tcrn-shell-menu__crumbs-label","lk-b":".tcrn-product-logo__line-one-base","lk-em":".tcrn-product-logo__line-one-suffix","lk-small":".tcrn-product-logo__line-two","drop-srch":".tcrn-shell-dropdown .tcrn-search-input__control","drop-rest":'.tcrn-shell-dropdown .tcrn-nav-item:not([aria-expanded])',"drop-on":'.tcrn-shell-dropdown .tcrn-nav-item[aria-expanded="true"]',"drop2-rest":".tcrn-shell-dropdown__col .tcrn-nav-item"
};
export function shellSceneFor(cell){return cell.mobile?(cell.sourceState==="sheet"?"phone":"phone-closed"):cell.sourceState==="expanded"?"menu":cell.sourceState==="drop"?"drop":"band";}
export async function readShellMatrices({browser,base,source,page,fixture}){
 const observations=[],issues=[],cells=extractMatrixOccurrences(source).filter(c=>c.board.startsWith("07"));
 for(const board of source.boards.filter(b=>b.slug.startsWith("07"))){
  const ref=await browser.newPage({viewport:{width:2640,height:1000}});
  try{await ref.goto(`${base}/__formal/${board.slug}`);await page.goto(`${base}/en/${board.slug}.html`);await Promise.all([ref.evaluate(()=>document.fonts.ready),page.evaluate(()=>document.fonts.ready)]);if(fixture)await installShellFixture(page,fixture);
   let nth=0;for(const cell of cells.filter(c=>c.board===board.slug)){
    const sourceElement=ref.locator('[data-cell]').nth(nth++),role=cell.cellId.replace(/-[ln]$/,''),selector=shellRoles[role],scene=shellSceneFor(cell),theme=cell.theme==='night'?'dark':'light';
    const observation={key:cell.key,cellId:cell.cellId,sourceLine:cell.sourceLine,sourceScene:cell.sourceScene,sourceState:cell.sourceState,carrier:cell.carrier,scene,theme,selector,ok:false};
    try{if(!selector)throw new Error(`Unmapped source shell role ${role}`);const element=page.locator(`[data-formal-shell-scene="${scene}"][data-shell-theme="${theme}"]`).first().locator(selector).first();if(await element.count()!==1)throw new Error('Missing actual package probe');
     await page.mouse.move(0,0);if(['pin-hover','grp-hover','it-hover','pinb-outline'].includes(role)&&await element.isVisible()){if(role==='pinb-outline')await element.locator('..').hover();else await element.hover();}
     const candidateProbe=role==='srch-ph'||role==='drop-srch'?'ph':cell.probe,actual=await measureElement(element,{...cell,probe:candidateProbe}),reference=await measureElement(sourceElement,cell),ratio=contrast(actual.ink,solidBackground(actual.chain));
     const failures=[];if(!cell.exempt&&ratio<(cell.kind==='text'?4.5:3))failures.push(`threshold ${cell.kind==='text'?4.5:3}`);if(Number(ratio.toFixed(2))!==Number(cell.expect))failures.push(`ratio ${ratio.toFixed(2)} != ${cell.expect}`);if(cell.kind==='text'&&actual.color!==reference.color&&candidateProbe!=='ph')failures.push('source ink color');if(candidateProbe==='ph'&&actual.ink!==reference.ink)failures.push('source placeholder ink');
     Object.assign(observation,{actual,reference,ratio,expected:cell.expect,exempt:cell.exempt,probe:cell.probe,candidateProbe,ok:!failures.length,reason:failures.join('; ')});
    }catch(error){observation.reason=error.message;}
    if(!observation.ok)issues.push(`${cell.key}: ${observation.reason}`);observations.push(observation);
   }
  }finally{await ref.close();}
 }
 return {sourceOccurrences:cells.length,observations,issues};
}
export async function proveShell({root=ROOT,fixtures=false}={}){return withPublishedBrowser(async({browser,base,source})=>{
 const issues=[],page=await browser.newPage({viewport:{width:1440,height:1000}});let matrix,facts,gates;const fixtureResults=[];
 try{
  await installIntroRecorder(page);const intro=await readIntro(page,`${base}/en/07a-shell-upper.html`);
  matrix=await readShellMatrices({browser,base,source,page});await page.goto(`${base}/en/07a-shell-upper.html`);await page.evaluate(()=>document.fonts.ready);
  facts=await collectShellG18(page,source,{matrix,intro});gates=judgeShellG18(facts,source);
  if(fixtures){
   for(const definition of SHELL_G18){const mutated=await browser.newPage({viewport:{width:1440,height:1000}});try{
    await installIntroRecorder(mutated,{forgetSession:definition.id==='G16'});
    const localIntro=definition.id==='G16'?await readIntro(mutated,`${base}/en/07a-shell-upper.html`):intro;
    const localMatrix=definition.id==='G13'?await readShellMatrices({browser,base,source,page:mutated,fixture:definition.id}):matrix;
    await mutated.goto(`${base}/en/07a-shell-upper.html`);await mutated.evaluate(()=>document.fonts.ready);
    const localFacts=await collectShellG18(mutated,source,{matrix:localMatrix,intro:localIntro,fixture:definition.id}),failures=judgeShellG18(localFacts,source)[definition.id];
    const newFailures=failures.filter(f=>!gates[definition.id].includes(f));const caught=failures.length>0&&newFailures.length>0;
    if(!caught)issues.push(`${definition.id}: local DOM/behavior fixture did not expose a new failure`);
    fixtureResults.push({id:definition.id,mutation:SHELL_G18_FIXTURES[definition.id],baseline:gates[definition.id],failures,newFailures,caught});
   }catch(error){issues.push(`${definition.id}: fixture execution incomplete: ${error.message}`);fixtureResults.push({id:definition.id,caught:false,error:error.message});}finally{await mutated.close();}}
  }else{for(const [id,failures]of Object.entries(gates))issues.push(...failures.map(message=>`${id}: ${message}`));}
 }finally{await page.close();}
 return {issues,sourceCommit:source.manifest.site.sourceCommit,sourceOccurrences:matrix?.sourceOccurrences??225,observations:matrix?.observations??[],g18:gates,facts,mode:fixtures?'local-negative-fixtures':'candidate-measurement',fixtureResults,pendingFormalAmendments:['K1','K5'],formalAmendmentState:FORMAL_AMENDMENT_STATE,undecidedStandardClarifications:['S03-C01']};
},{root});}
