import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { chromium } from "@playwright/test";
import { ROOT,readApprovedSource,extractMatrixOccurrences } from "./approved-site-source.mjs";
import { contrast } from "./published-standard-proof.mjs";

function referenceHtml(source,board){
  const html=board.html.replace(/<script\b[\s\S]*?<\/script>/gi,"").replace(/<link\b[^>]*>/gi,"").replace(/sc-raw-/g,"").replace(/sc-camel-view-box/g,"viewBox");
  const fonts=source.fontCss.replace(/url\(([^)]+)\)/g,(_whole,url)=>`url("/__source-font/${url.replace(/['"]/g,"").replace(/^\//,"")}")`);
  return `<!doctype html><html><head><meta charset="utf-8"><style>${fonts}\n${board.css}</style></head><body>${html}</body></html>`;
}
export async function withPublishedBrowser(run,{root=ROOT}={}){
  const source=readApprovedSource(root),output=path.join(root,"apps/storybook/storybook-static");
  const server=http.createServer((req,res)=>{try{const url=new URL(req.url,"http://localhost");if(url.pathname.startsWith("/__formal/")){const board=source.board(url.pathname.split("/").pop());res.setHeader("content-type","text/html; charset=utf-8");res.end(referenceHtml(source,board));return;}let base=output,rel=decodeURIComponent(url.pathname);if(rel.startsWith("/__source-font/")){base=source.base;rel=rel.slice("/__source-font".length);}const file=path.resolve(base,"."+rel+(rel.endsWith("/")?"index.html":""));if(!file.startsWith(base+path.sep)){res.writeHead(403);res.end();return;}const types={".html":"text/html; charset=utf-8",".js":"text/javascript",".css":"text/css",".svg":"image/svg+xml",".woff2":"font/woff2",".json":"application/json"};res.setHeader("content-type",types[path.extname(file)]??"text/plain");res.end(fs.readFileSync(file));}catch{res.writeHead(404);res.end();}});
  await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
  let browser;
  try{browser=await chromium.launch({headless:true});const base=`http://127.0.0.1:${server.address().port}`;return await run({browser,base,source});}
  finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
export async function measureElement(locator,{probe="ink",kind="text"}={}){
  return locator.evaluate((input,{probe,kind})=>{
    const target=input.getAttribute("data-source-probe-target");let element=target?(target.startsWith("body ")?document.querySelector(target.slice(5)):input.querySelector(target)):input;
    if(!element)throw new Error(`Missing actual component probe target ${target}`);
    if(element.tagName==="SPAN"&&element.classList.contains("tcrn-select-wrap__icon"))element=element.querySelector("svg")??element;
    const pseudo=probe==="ph"?"::placeholder":probe.startsWith("after")?"::after":null;
    const s=getComputedStyle(element,pseudo),rect=element.getBoundingClientRect();
    const chain=[];for(let p=element;p;p=p.parentElement)chain.push(getComputedStyle(p).backgroundColor);
    const shadows=[...s.boxShadow.matchAll(/rgba?\([^)]+\)/g)].map(m=>m[0]);
    let ink=s.color;if((kind==="edge"||probe==="after-shadow")&&shadows.length)ink=shadows[0];if(probe==="after-border")ink=s.borderRightColor;if(probe==="after-bg")ink=s.backgroundColor;
    return {ink,background:s.backgroundColor,chain,color:s.color,font:s.fontFamily,fontSize:s.fontSize,lineHeight:s.lineHeight,weight:s.fontWeight,stroke:s.strokeWidth,shadow:s.boxShadow,width:rect.width,height:rect.height,tag:element.tagName,pseudo};
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
  return {issues,sourceCommit:source.manifest.site.sourceCommit,sourceOccurrences:cells.length,observed:observations.length,observations,unresolved:["K5"]};
},{root});}
export async function proveShell({root=ROOT}={}){return withPublishedBrowser(async({browser,base,source})=>{
  const issues=[],observations=[],page=await browser.newPage({viewport:{width:1440,height:1000}});
  try{await page.goto(`${base}/en/07a-shell-upper.html`);await page.evaluate(()=>document.fonts.ready);
    for(const scene of ["band","menu","drop","phone"]){const frame=page.locator(`[data-formal-shell-scene="${scene}"]`).first();const shell=frame.locator(".tcrn-product-shell").first();
      const row=await shell.evaluate(el=>{const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom};};const box=rect(el),brand=rect(el.querySelector("[data-shell-brand]")),paper=rect(el.querySelector(".tcrn-product-shell__paper")),mark=rect(el.querySelector("[data-shell-brand] [data-logo]")),toggle=rect(el.querySelector("[data-shell-toggle]")),glyph=rect(el.querySelector("[data-shell-toggle] svg"));const pins=[...el.querySelectorAll(".tcrn-shell-pins__item")].map(rect);const panel=el.querySelector(".tcrn-shell-menu__panel"),drop=el.querySelector(".tcrn-shell-dropdown__panel");return {box,brand,paper,mark,toggle,glyph,pins,panel:panel?rect(panel):null,drop:drop?rect(drop):null,sidebars:el.querySelectorAll(".tcrn-side-nav").length};});
      if(Math.abs(row.brand.y-row.box.y-6)>.5||Math.abs(row.brand.height-40)>.5)issues.push(`${scene}: brand top/height differs from published (12,6),134×40`);
      if(scene!=="phone"&&Math.abs(row.brand.width-134)>.5)issues.push(`${scene}: brand width is not 134`);
      if(Math.abs(row.paper.y-row.box.y-52)>.5||Math.abs(row.paper.x-row.box.x-12)>.5||Math.abs(row.box.right-row.paper.right-12)>.5)issues.push(`${scene}: published paper top/edge geometry drift`);
      if(row.mark.width!==22||row.toggle.width!==20||row.glyph.width!==16)issues.push(`${scene}: mark22, toggle slot20 and glyph16 are distinct obligations`);
      if(row.sidebars)issues.push(`${scene}: a permanent sidebar returned`);
      if(scene!=="phone"&&row.panel&&Math.abs(row.panel.width-952)>.5)issues.push(`${scene}: full menu width differs from 952`);
      if(row.drop&&Math.abs(row.drop.width-240)>.5)issues.push(`${scene}: dropdown width differs from 240`);
      for(const pin of row.pins)if(scene!=="phone"&&pin.width&&Math.abs(pin.y+pin.height/2-row.box.y-26)>.5)issues.push(`${scene}: pin globalY26/localY20 alignment drift`);
      observations.push({scene,...row});
    }
    const frame=page.locator('[data-formal-shell-scene="band"]').first(),brand=frame.locator("[data-shell-brand]");
    await brand.click();await page.keyboard.press("Escape");if(!await brand.evaluate(el=>el===document.activeElement))issues.push("Esc did not return focus to the source brand button");
    await brand.click();const pin=frame.locator("[data-pin-button]").first();if(await pin.count()){if((await pin.textContent()).trim())issues.push("K4 pure-icon pin gained visible text");if(!await pin.getAttribute("aria-label"))issues.push("K4 pin lost its item-specific accessible name");if(await pin.getAttribute("title"))issues.push("K4 pin gained an invented tooltip");}
    await page.keyboard.press("Escape");
    const roles={
      "brand-word":["band",".tcrn-shell-brand__word"],"brand-suffix":["band",".tcrn-shell-brand__suffix"],tgl:["band","[data-shell-toggle]"],
      "pin-on":["band",'.tcrn-shell-pins__item[aria-current="page"]'],"pin-chev":["band",".tcrn-shell-pins__chevron"],"pin-hover":["band",'[data-pin="settlements"] .tcrn-shell-pins__item',true],"pin-open":["drop",'.tcrn-shell-pins__item[aria-expanded="true"]'],"pin-rest":["band",".tcrn-shell-pins__item:not([aria-current])"],
      bell:["band",".tcrn-shell-bell"],avatar:["band",".tcrn-shell-avatar"],"crumb-parent":["band",".tcrn-breadcrumb a"],"crumb-current":["band",'.tcrn-breadcrumb [aria-current="page"]'],h2:["band",".tcrn-page-header__title"],sub:["band",".tcrn-doc-shell-sub"],"btn-primary":["band",".tcrn-page-header .tcrn-button--primary"],"tab-on":["band",'.tcrn-tabs__tab[aria-selected="true"]'],"tab-off":["band",'.tcrn-tabs__tab[aria-selected="false"]'],th:["band",".tcrn-doc-table th"],"td-name":["band",".tcrn-doc-table td:first-child"],"st-ok":["band",".tcrn-doc-status--ok"],
      "srch-ph":["menu",".tcrn-search-input__control"],"srch-kbd":["menu",".tcrn-search-input__shortcut"],"it-on":["menu",'.tcrn-shell-menu .tcrn-nav-item[aria-current="page"]'],"it-hover":["menu",'.tcrn-shell-menu [data-tcrn-preview-state="hover"] .tcrn-nav-item'],"it-rest":["menu",'.tcrn-shell-menu .tcrn-nav-item:not([aria-current])'],"pinb-on-wash":["menu",'.tcrn-shell-menu .tcrn-nav-item-row:has([aria-current="page"]) [data-pin-button]'],"pinb-outline":["menu",'.tcrn-shell-menu [data-tcrn-preview-state="hover"] [data-pin-button]'],"pinb-on":["menu",'.tcrn-shell-menu [data-pin-button][aria-pressed="true"]'],"grp-hover":["menu",".tcrn-nav-group__label-text"],"pbar-label":["menu",".tcrn-shell-menu__crumbs-label"],"lk-b":["menu",".tcrn-product-logo__line-one-base"],"lk-em":["menu",".tcrn-product-logo__line-one-suffix"],"lk-small":["menu",".tcrn-product-logo__line-two"],"drop-srch":["drop",".tcrn-shell-dropdown .tcrn-search-input__control"],"drop-rest":["drop",".tcrn-shell-dropdown .tcrn-nav-item:not([aria-expanded])"],"drop-on":["drop",'.tcrn-shell-dropdown .tcrn-nav-item[aria-expanded="true"]'],"drop2-rest":["drop",".tcrn-shell-dropdown__col:nth-child(2) .tcrn-nav-item"]
    };
    const roleObservations=[];
    for(const board of source.boards.filter(b=>b.slug.startsWith("07"))){const ref=await browser.newPage({viewport:{width:2640,height:1000}});try{await ref.goto(`${base}/__formal/${board.slug}`);await ref.evaluate(()=>document.fonts.ready);let nth=0;for(const cell of extractMatrixOccurrences(source).filter(c=>c.board===board.slug)){
      const sourceElement=ref.locator("[data-cell]").nth(nth++),role=cell.cellId.replace(/-[ln]$/,""),binding=roles[role];if(!binding){issues.push(`Unmapped published shell occurrence ${cell.key}/${role}`);continue;}
      const [scene,selector,hover]=binding,theme=cell.theme==="night"?"dark":"light",scope=page.locator(`[data-formal-shell-scene="${scene}"][data-shell-theme="${theme}"]`).first(),element=scope.locator(selector).first();
      if(!await element.count()){issues.push(`Missing actual shell role ${cell.key}/${role}`);continue;}try{if(hover)await element.hover();const actual=await measureElement(element,cell),expected=await measureElement(sourceElement,cell),ratio=contrast(actual.ink,solidBackground(actual.chain));if(!cell.exempt&&ratio<(cell.kind==="text"?4.5:3))issues.push(`Shell role contrast ${cell.key} ${ratio.toFixed(2)}`);if(Number(ratio.toFixed(2))!==Number(cell.expect))issues.push(`Shell role/source value ${cell.key}: ${ratio.toFixed(2)} != ${cell.expect}`);if(cell.kind==="text"&&actual.color!==expected.color)issues.push(`Shell role/source color ${cell.key}`);roleObservations.push({key:cell.key,role,theme,sourceLine:cell.sourceLine,ratio,expected:cell.expect});}catch(error){issues.push(`${cell.key}: ${error.message}`);}
    }}finally{await ref.close();}}
    observations.push({sourceRoleOccurrences:roleObservations.length,roles:roleObservations});
    await page.emulateMedia({reducedMotion:"reduce"});await page.reload();const moving=await page.locator(".tcrn-shell-brand,.tcrn-shell-menu,.tcrn-shell-dropdown,.tcrn-shell-pins").evaluateAll(els=>els.map(el=>getComputedStyle(el).transitionDuration));if(moving.some(v=>v.split(",").some(x=>parseFloat(x)!==0)))issues.push("Reduced-motion shell transitions are not zero");
  }finally{await page.close();}
  return {issues,sourceCommit:source.manifest.site.sourceCommit,sourceOccurrences:extractMatrixOccurrences(source).filter(c=>c.board.startsWith("07")).length,observations,unresolved:["K1"]};
},{root});}
