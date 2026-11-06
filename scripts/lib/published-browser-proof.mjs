import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { chromium } from "@playwright/test";
import { ROOT,readApprovedSource,extractMatrixOccurrences,sourceElements,cssRule } from "./approved-site-source.mjs";
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
    const target=input.getAttribute("data-source-probe-target");
    let element=input.hasAttribute("data-source-probe-control")?input.closest("label")?.control:target?input.querySelector(target):input;
    if(!element)throw new Error(`Missing actual component probe target ${target}`);
    if(element.tagName==="SPAN"&&element.classList.contains("tcrn-select-wrap__icon"))element=element.querySelector("svg")??element;
    const pseudo=probe==="ph"?"::placeholder":probe.startsWith("after")?(element.classList.contains("tcrn-switch__control")?"::before":"::after"):null;
    const s=getComputedStyle(element,pseudo),rect=element.getBoundingClientRect();
    const chain=[];for(let p=element;p;p=p.parentElement)chain.push(getComputedStyle(p).backgroundColor);
    const shadows=[...s.boxShadow.matchAll(/rgba?\([^)]+\)/g)].map(m=>m[0]);
    let ink=s.color;if((kind==="edge"||probe==="after-shadow")&&shadows.length)ink=shadows[0];if(probe==="after-border")ink=s.borderRightColor;if(probe==="after-bg")ink=s.backgroundColor;
    const group=element.matches('input[type="radio"]')
      ? [...(element.closest('fieldset')?.querySelectorAll('input[type="radio"]')??[])].filter(input=>input.name===element.name&&input.form===element.form)
      : [];
    const radio=group.length?{checked:element.checked,indeterminate:element.matches(':indeterminate'),groupSize:group.length,checkedCount:group.filter(input=>input.checked).length,named:!!element.labels?.[0]?.textContent.trim()}:null;
    return {ink,background:s.backgroundColor,chain,color:s.color,font:s.fontFamily,fontSize:s.fontSize,lineHeight:s.lineHeight,weight:s.fontWeight,stroke:s.strokeWidth,shadow:s.boxShadow,width:rect.width,height:rect.height,visible:!!element.getClientRects().length&&rect.width>0,tag:element.tagName,pseudo,radio};
  },{probe,kind});
}

export async function ownedVisibleListbox(page,trigger){
 const id=await trigger.getAttribute('aria-controls');
 if(!id)throw new Error('MultiSelect trigger missing aria-controls');
 const listbox=page.locator(`[id=${JSON.stringify(id)}][role="listbox"]:visible`);
 if(await listbox.count()!==1)throw new Error('MultiSelect aria-controls must identify one visible listbox');
 return listbox;
}

export async function measureNumberMinimums(locator){
 return locator.evaluateAll(inputs=>inputs.filter(input=>input.getBoundingClientRect().width>0).map(input=>{
  const style=getComputedStyle(input);
  const probe=document.createElement('span');
  Object.assign(probe.style,{position:'absolute',display:'block',width:'12ch',height:'0',padding:'0',border:'0',boxSizing:'content-box'});
  // Computed font shorthand can be empty with font-variant-numeric: tabular-nums.
  for(const property of ['fontFamily','fontSize','fontStyle','fontWeight','fontStretch','fontVariantNumeric',
   'fontFeatureSettings','fontKerning','fontVariationSettings','fontOpticalSizing','fontSizeAdjust']){
   probe.style[property]=style[property];
  }
  const original=input.getAttribute('style');
  input.parentElement.append(probe);
  try{
   const twelveCh=probe.getBoundingClientRect().width,minimum=parseFloat(style.minInlineSize);
   input.style.setProperty('inline-size','1px','important');
   return {twelveCh,minimum,squeezedWidth:input.getBoundingClientRect().width,fontSize:parseFloat(style.fontSize),fontVariantNumeric:style.fontVariantNumeric};
  }finally{
   probe.remove();
   if(original===null)input.removeAttribute('style');
   else input.setAttribute('style',original);
  }
 }));
}

export function numberMinimumValid(reading,source){
 const css=source.board('06-inputs').css;
 const size=parseFloat(cssRule(css,'.gp')['--fs-md']);
 const numeric=cssRule(css,'.in')['font-variant-numeric'];
 return !!reading&&reading.fontSize===size&&reading.fontVariantNumeric===numeric&&
  [reading.minimum,reading.twelveCh,reading.squeezedWidth].every(Number.isFinite)&&
  Math.abs(reading.minimum-reading.twelveCh)<=.5&&Math.abs(reading.squeezedWidth-reading.twelveCh)<=.5;
}
export function publishedTextRoleIssues(actual,reference,{kind="text",probe="ink"}={}){
  if(probe==="ph")return actual.ink===reference.ink?[]:["source placeholder ink"];
  if(kind!=="text")return [];
  return actual.color===reference.color?[]:["published text role color"];
}
// Supplemental roles retain their raw ordinal/ancestry. They are not new data-cells:
// the original 455 source-cell identities and 4550 entry/locale contexts stay separate.
export function publishedShortcutOccurrences(source=readApprovedSource()){
 return source.boards.filter(b=>['06-inputs','07a-shell-upper','07b-shell-lower'].includes(b.slug)).flatMap(board=>{
  const has=(node,name)=>(node.attrs.class??'').split(/\s+/).includes(name);
  return sourceElements(board.html).filter(node=>node.tag==='kbd').map((node,index)=>{
   const ancestors=[];for(let n=node.parent;n;n=n.parent)ancestors.push(n);
   const carrier=ancestors.find(n=>has(n,'sw')||has(n,'ts-srch')),screen=ancestors.find(n=>n.attrs['data-shell']),themeNode=ancestors.find(n=>has(n,'gp'));
   if(!carrier)throw new Error(`Unmapped published shortcut ${board.slug}/${index+1}`);
   const input=carrier.children.find(n=>n.tag==='input'),scene=board.slug==='06-inputs'?'form':screen?.attrs['data-state']==='drop'?'drop':'menu';
   const state=scene==='form'?(has(input,'is-focus')?'focus':has(input,'is-hover')?'hover':has(input,'sm')?'sm':'default'):screen.attrs['data-state'];
   return {key:`${board.slug}:shortcut:${index+1}`,board:board.slug,ordinal:index+1,theme:themeNode&&has(themeNode,'night')?'dark':'light',scene,state,sourceScene:screen?.attrs['data-shell']??board.slug,sourceLine:node.sourceLine,sourceOffset:node.offset,carrier:{tag:carrier.tag,classes:carrier.attrs.class??'',style:carrier.attrs.style??''},annotatedCell:node.attrs['data-cell']??null};
  });
 });
}
export function publishedShortcutLocator(page,role){
 if(role.scene==='form')return page.locator(`[data-published-shortcut-key="${role.key}"]`).locator('..').locator(':scope > kbd');
 const scene=page.locator(`[data-formal-shell-scene="${role.scene}"][data-shell-theme="${role.theme}"]`).first();
 return scene.locator(`${role.scene==='drop'?'.tcrn-shell-dropdown__search':'.tcrn-shell-menu__search'} .tcrn-search-input__shortcut`);
}
export async function measurePublishedShortcut(locator){
 const reading=await measureElement(locator);
 return {...reading,...await locator.evaluate(element=>{
  const s=getComputedStyle(element),r=element.getBoundingClientRect(),carrier=element.closest('.sw,.ts-srch,.tcrn-search-input'),c=carrier.getBoundingClientRect();
  return {position:s.position,letterSpacing:s.letterSpacing,whiteSpace:s.whiteSpace,borderWidths:[s.borderTopWidth,s.borderRightWidth,s.borderBottomWidth,s.borderLeftWidth],borderStyles:[s.borderTopStyle,s.borderRightStyle,s.borderBottomStyle,s.borderLeftStyle],borderColors:[s.borderTopColor,s.borderRightColor,s.borderBottomColor,s.borderLeftColor],borderRadius:s.borderRadius,padding:[s.paddingTop,s.paddingRight,s.paddingBottom,s.paddingLeft],rightInset:c.right-r.right,centerOffset:(r.top+r.bottom-c.top-c.bottom)/2,ariaHidden:element.getAttribute('aria-hidden'),tabIndex:element.tabIndex,role:element.getAttribute('role')};
 }),chain:await locator.evaluate(element=>{
  // SearchInput's painted input is a sibling beneath the hint, not an ancestor.
  // The raw06 sw has the same arrangement; raw07 paints its ts-srch ancestor.
  const chain=[getComputedStyle(element).backgroundColor],carrier=element.closest('.sw,.ts-srch,.tcrn-search-input'),control=carrier.querySelector('input');
  if(control)chain.push(getComputedStyle(control).backgroundColor);
  for(let p=element.parentElement;p;p=p.parentElement)chain.push(getComputedStyle(p).backgroundColor);
  return chain;
 })};
}
export function publishedShortcutIssues(actual,reference){
 const failures=publishedTextRoleIssues(actual,reference);
 if(actual.tag!=='KBD'||!actual.visible||!reference.visible)failures.push('published shortcut node/visibility');
 for(const key of ['font','fontSize','lineHeight','weight','position','whiteSpace','borderWidths','borderStyles','borderColors','borderRadius','padding','background','shadow'])if(JSON.stringify(actual[key])!==JSON.stringify(reference[key]))failures.push(`published shortcut ${key}`);
 const spacing=value=>value==='normal'?0:parseFloat(value);
 if(spacing(actual.letterSpacing)!==spacing(reference.letterSpacing))failures.push('published shortcut letterSpacing');
 if(!Number.isFinite(actual.rightInset)||Math.abs(actual.rightInset-reference.rightInset)>.5)failures.push('published shortcut trailing inset');
 if(!Number.isFinite(actual.centerOffset)||Math.abs(actual.centerOffset-reference.centerOffset)>.5)failures.push('published shortcut vertical alignment');
 // The package hint is decorative; it must not create a focus stop or a new action.
 if(actual.ariaHidden!=='true'||actual.tabIndex>=0||actual.role!==null)failures.push('decorative shortcut semantics');
 return failures;
}
export async function collectPublishedShortcuts({source,board,reference,page,entry,locale}){
 const roles=publishedShortcutOccurrences(source).filter(role=>role.board===board),observations=[],fidelityIssues=[],contrastIssues=[];
 for(const role of roles){
  const observation={...role,entry,locale,ok:false};
  try{
   const actualNode=publishedShortcutLocator(page,role),referenceNode=reference.locator('kbd').nth(role.ordinal-1);
   if(await actualNode.count()!==1||await referenceNode.count()!==1)throw new Error('Missing or duplicate actual/published shortcut node');
   const actual=await measurePublishedShortcut(actualNode),expected=await measurePublishedShortcut(referenceNode),failures=publishedShortcutIssues(actual,expected),ratio=contrast(actual.ink,solidBackground(actual.chain));
   const threshold=ratio<4.5?['shortcut text threshold 4.5']:[];
   Object.assign(observation,{actual,reference:expected,ratio,fidelityIssues:failures,contrastIssues:threshold,ok:!failures.length&&!threshold.length});
  }catch(error){observation.fidelityIssues=[error.message];observation.contrastIssues=[];}
  fidelityIssues.push(...observation.fidelityIssues.map(reason=>`${entry}/${locale}/${role.key}: ${reason}`));contrastIssues.push(...observation.contrastIssues.map(reason=>`${entry}/${locale}/${role.key}: ${reason}`));observations.push(observation);
 }
 return {sourceOccurrences:roles.length,observed:observations.length,observations,fidelityIssues,contrastIssues,issues:[...fidelityIssues,...contrastIssues]};
}
// Adjacent search assemblies are supplemental observations, not data-cells or
// additional shortcut identities. Ordinals bind to untouched published markup,
// including the Sheet search which has no kbd in its actual source.
export function publishedSearchOccurrences(source=readApprovedSource()){
 return source.boards.filter(board=>board.slug.startsWith('07')).flatMap(board=>{
  const has=(node,name)=>(node?.attrs.class??'').split(/\s+/).includes(name);
  return sourceElements(board.html).filter(node=>has(node,'ts-srch')).map((node,index)=>{
   const ancestors=[];for(let parent=node.parent;parent;parent=parent.parent)ancestors.push(parent);
   const screen=ancestors.find(parent=>parent.attrs['data-shell']),theme=ancestors.find(parent=>has(parent,'gp'));
   const context=ancestors.some(parent=>has(parent,'ts-sheet'))?'sheet':ancestors.some(parent=>has(parent,'ts-drop'))?'drop':ancestors.some(parent=>has(parent,'ts-panel'))?'menu':'unknown';
   if(!screen||context==='unknown')throw new Error(`Unmapped published search assembly ${board.slug}/${index+1}`);
   return {key:`${board.slug}:search:${index+1}`,board:board.slug,ordinal:index+1,context,scene:context==='sheet'?'phone':context,theme:has(theme,'night')?'dark':'light',sourceState:screen.attrs['data-state'],sourceScene:screen.attrs['data-shell'],sourceLine:node.sourceLine,sourceOffset:node.offset,sourceCarrier:node.attrs,hasShortcut:node.children.some(child=>child.tag==='kbd')};
  });
 });
}
export function publishedSearchGeometry(source,board,context){
 if(!['07a-shell-upper','07b-shell-lower'].includes(board)||!['menu','drop','sheet'].includes(context))throw new Error('Unknown published search geometry context');
 const css=source.board(board).css,search={...cssRule(css,'.ts-srch'),...(context==='drop'?cssRule(css,'.ts-drop .ts-srch'):{})};
 const locals={...cssRule(css,'.scr.ts'),...(context==='sheet'?cssRule(css,'.ts-sheet'):{})};
 const height=parseFloat(search.height.replace(/var\((--[a-z-]+)\)/g,(_match,key)=>locals[key]??'unresolved'));
 if(!Number.isFinite(height))throw new Error('Unresolved published search height');
 return {board,context,height,sourceCommit:source.manifest.site.sourceCommit,carrier:context==='sheet'?'.ts-sheet .ts-srch':context==='drop'?'.ts-drop .ts-srch':'.ts-panel .ts-srch'};
}
export function publishedSearchLocator(page,role){
 const scene=page.locator(`[data-formal-shell-scene="${role.scene}"][data-shell-theme="${role.theme}"]`).first();
 return scene.locator(`${role.context==='drop'?'.tcrn-shell-dropdown__search':'.tcrn-shell-menu__search'} > .tcrn-search-input`);
}
export async function measurePublishedSearch(locator){
 return locator.evaluate(carrier=>{
  const native=carrier.querySelector('input.tcrn-search-input__control'),text=native??carrier.querySelector('.ph2'),icon=carrier.querySelector('.tcrn-search-input__icon svg')??carrier.querySelector(':scope > svg'),hint=carrier.querySelector(':scope > kbd');
  if(!text||!icon)throw new Error('Missing actual search text/icon/carrier');
  const c=carrier.getBoundingClientRect(),t=text.getBoundingClientRect(),i=icon.getBoundingClientRect(),h=hint?.getBoundingClientRect(),s=getComputedStyle(carrier),type=getComputedStyle(text),placeholder=native?getComputedStyle(native,'::placeholder'):type,n=parseFloat;
  const start=t.left+n(type.paddingLeft)+n(type.borderLeftWidth),end=t.right-n(type.paddingRight)-n(type.borderRightWidth),rightInset=n(s.paddingRight),columns=s.gridTemplateColumns.split(/\s+/).map(n);
  return {native:!!native,tag:text.tagName,inputType:native?.type,role:native?.getAttribute('role'),disabled:native?.disabled??false,visible:!!carrier.getClientRects().length&&c.width>0,height:c.height,nativeHeight:native?t.height:null,width:c.width,leadingTrack:columns[0],gap:n(s.columnGap),paddingLeft:n(s.paddingLeft),paddingRight:rightInset,iconWidth:i.width,iconHeight:i.height,iconOffset:i.left-c.left,iconColor:getComputedStyle(icon).color,textOrigin:start-c.left,textWidth:end-start,spaceToHint:h?h.left-end:c.right-rightInset-end,hintWidth:h?.width??0,hintRightInset:h?c.right-h.right:null,hasShortcut:!!hint,font:type.fontFamily,fontSize:type.fontSize,lineHeight:type.lineHeight,weight:type.fontWeight,letterSpacing:type.letterSpacing,textColor:placeholder.color,textOverflow:type.textOverflow,whiteSpace:type.whiteSpace,background:s.backgroundColor,shadow:s.boxShadow,radius:s.borderRadius,textBackground:type.backgroundColor,controlPaddingEnd:n(type.paddingRight),controlPaddingStart:n(type.paddingLeft)};
 });
}
export function publishedSearchIssues(actual,reference){
 const issues=[];
 if(!actual.native||actual.tag!=='INPUT'||actual.inputType!=='search'||actual.role!=='combobox'||!actual.visible||!reference.visible)issues.push('published search native node/carrier');
 for(const key of ['height','leadingTrack','gap','paddingLeft','paddingRight','iconWidth','iconHeight','iconOffset','textOrigin'])if(!Number.isFinite(actual[key])||Math.abs(actual[key]-reference[key])>.5)issues.push(`published search ${key}`);
 for(const key of ['font','fontSize','lineHeight','weight','textColor','iconColor','background','shadow','radius','hasShortcut','textBackground','textOverflow','whiteSpace'])if(actual[key]!==reference[key])issues.push(`published search ${key}`);
 const spacing=value=>value==='normal'?0:parseFloat(value);
 if(spacing(actual.letterSpacing)!==spacing(reference.letterSpacing))issues.push('published search letterSpacing');
 // Widths and automatic platform hint strings may differ. Compare the capacity
 // equation from the independent raw track assembly at the candidate's width.
 const capacity=actual.width-reference.textOrigin-reference.paddingRight-reference.spaceToHint-(reference.hasShortcut?actual.hintWidth:0);
 if(!Number.isFinite(actual.textWidth)||Math.abs(actual.textWidth-capacity)>.5||Math.abs(actual.spaceToHint-reference.spaceToHint)>.5||actual.textWidth<=0)issues.push('published search flexible text capacity/reserve');
 if(actual.hasShortcut&&Math.abs(actual.hintRightInset-reference.hintRightInset)>.5)issues.push('published search hint trailing inset');
 if(!Number.isFinite(actual.nativeHeight)||Math.abs(actual.nativeHeight-actual.height)>.5)issues.push('published search native/carrier height');
 return issues;
}
export async function collectPublishedSearchAssemblies({source,board,reference,page,entry,locale}){
 const roles=publishedSearchOccurrences(source).filter(role=>role.board===board),observations=[],issues=[];
 for(const role of roles)for(const state of ['default','hover','focus']){
  const observation={...role,entry,locale,state,ok:false},actualNode=publishedSearchLocator(page,role),referenceNode=reference.locator('.ts-srch').nth(role.ordinal-1);
  let sourceClass;
  try{
   if(await actualNode.count()!==1||await referenceNode.count()!==1)throw new Error('Missing or duplicate actual/published search assembly');
   sourceClass=await referenceNode.getAttribute('class');
   await page.evaluate(()=>document.activeElement?.blur());await page.mouse.move(0,0);await reference.mouse.move(0,0);
   if(state==='hover'){await actualNode.hover();await referenceNode.hover();}
   if(state==='focus'){await actualNode.locator('input').focus();await referenceNode.evaluate(element=>element.classList.add('is-focus'));}
   const actual=await measurePublishedSearch(actualNode),expected=await measurePublishedSearch(referenceNode),failures=publishedSearchIssues(actual,expected);
   Object.assign(observation,{actual,reference:expected,failures,ok:!failures.length});
  }catch(error){observation.failures=[error.message];}
  finally{if(sourceClass!==undefined)await referenceNode.evaluate((element,value)=>element.setAttribute('class',value),sourceClass);await page.evaluate(()=>document.activeElement?.blur());}
  issues.push(...observation.failures.map(reason=>`${entry}/${locale}/${role.key}/${state}: ${reason}`));observations.push(observation);
 }
 return {sourceOccurrences:roles.length,statesPerOccurrence:3,expectedComparisons:roles.length*3,observations,issues};
}
function solidBackground(chain){
  // Each layer is composited from the document canvas toward the actual painted element.
  const parse=c=>{const n=c.match(/[\d.]+/g)?.map(Number)??[255,255,255];return [n[0],n[1],n[2],n[3]??1];};let result=[255,255,255,1];
  for(const value of [...chain].reverse()){const c=parse(value);result=[0,1,2].map(i=>c[i]*c[3]+result[i]*(1-c[3])).concat(1);}
  return `rgb(${result.slice(0,3).join(",")})`;
}

export async function readFamilyCell({page,actual,reference,cell}){
 if(await actual.count()!==1)throw new Error('Missing or duplicate package source probe');
 const openSelector=await actual.getAttribute('data-source-open-control');
 try{
  let target=actual;
  if(openSelector){
   const trigger=actual.locator(openSelector);
   await trigger.click();
   const listbox=await ownedVisibleListbox(page,trigger);
   target=listbox.locator('[role="option"][aria-selected="true"]:visible');
   if(await target.count()!==1)throw new Error('MultiSelect owned listbox must contain one visible selected sample option');
  }
  const referenceReading=await measureElement(reference,cell),reading=await measureElement(target,cell);
  const measured=contrast(reading.ink,solidBackground(reading.chain)),failures=[];
  if(!reading.visible||!referenceReading.visible)failures.push('source/candidate painted carrier is not visible');
  if(!cell.exempt&&measured<(cell.kind==='text'?4.5:3))failures.push(`threshold ${cell.kind==='text'?4.5:3}`);
  if(Number.isFinite(Number(cell.expect))&&Number(measured.toFixed(2))!==Number(cell.expect))failures.push(`ratio ${measured.toFixed(2)} != ${cell.expect}`);
  failures.push(...publishedTextRoleIssues(reading,referenceReading,cell));
  if(openSelector&&reading.background!==referenceReading.background)failures.push('MultiSelect owned option wash differs from source');
  if(referenceReading.radio&&JSON.stringify(reading.radio)!==JSON.stringify(referenceReading.radio))failures.push('RadioGroup native option state or group differs from source');
  return {measured,reading,referenceReading,ok:!failures.length,reason:failures.join('; ')};
 }finally{if(openSelector)await page.keyboard.press('Escape');}
}

export async function proveFamilyMatrices({root=ROOT}={}){
 const results=[];
 for(const entry of PROOF_ENTRIES){
  try{results.push(await withPublishedBrowser(async({browser,base,source})=>{
   const issues=[],observations=[],shortcutObservations=[],cells=extractMatrixOccurrences(source).filter(c=>!c.board.startsWith("07"));
   for(const locale of LOCALES)for(const board of [...new Set(cells.map(c=>c.board))]){
    const reference=await browser.newPage({viewport:{width:2640,height:1000}}),candidate=await browser.newPage({viewport:{width:1440,height:1000}});
    try{
     await reference.goto(`${base}/__formal/${board}`);await reference.evaluate(()=>document.fonts.ready);
     await openPublishedBoard(candidate,{base,entry,locale,board});
     const allReference=reference.locator('[data-cell]');let occurrence=0;
     for(const cell of cells.filter(c=>c.board===board)){
      const ref=allReference.nth(occurrence++),actual=candidate.locator(`[data-source-cell-key="${cell.key}"]`),observation={entry,locale,key:cell.key,cellId:cell.cellId,theme:cell.theme,sourceLine:cell.sourceLine,sourceScene:cell.sourceScene,sourceState:cell.sourceState,carrier:cell.carrier,kind:cell.kind,exempt:cell.exempt,expected:cell.expect,ok:false};
      try{
       Object.assign(observation,await readFamilyCell({page:candidate,actual,reference:ref,cell}));
      }catch(error){observation.reason=error.message;}
      if(!observation.ok)issues.push(`${entry}/${locale}/${cell.key}: ${observation.reason}`);observations.push(observation);
     }
     if(board==='06-inputs'){const shortcuts=await collectPublishedShortcuts({source,board,reference,page:candidate,entry,locale});issues.push(...shortcuts.issues);shortcutObservations.push(...shortcuts.observations);}
    }catch(error){issues.push(`${entry}/${locale}/${board}: incomplete family collection: ${error.message}`);}finally{await reference.close();await candidate.close();}
   }
   if(observations.length!==cells.length*LOCALES.length)issues.push(`${entry}: incomplete family occurrence coverage ${observations.length}/${cells.length*LOCALES.length}`);
   return {entry,issues,sourceCommit:source.manifest.site.sourceCommit,sourceOccurrences:cells.length,observations,supplementalShortcuts:{sourceOccurrences:8,expectedComparisons:8*LOCALES.length,observations:shortcutObservations}};
  },{root,entry}));}catch(error){results.push({entry,issues:[`${entry}: ${error.message}`],observations:[]});}
 }
 return {issues:results.flatMap(r=>r.issues),sourceOccurrences:230,expectedComparisons:230*proofContexts().length,observed:results.reduce((n,r)=>n+r.observations.length,0),observations:results.flatMap(r=>r.observations),supplementalShortcuts:{sourceOccurrences:8,expectedComparisons:8*proofContexts().length,observations:results.flatMap(r=>r.supplementalShortcuts?.observations??[])},entries:results.map(({observations,...r})=>r),...FORMAL_REVIEW_STATUS};
}

const shellRoles={
 "brand-word":".tcrn-shell-brand__word","brand-suffix":".tcrn-shell-brand__suffix",tgl:"[data-shell-toggle]",
 "pin-on":'.tcrn-shell-pins__item[aria-current="page"]',"pin-chev":".tcrn-shell-pins__chevron","pin-hover":'[data-pin="settlements"] .tcrn-shell-pins__item',"pin-open":'.tcrn-shell-pins__item[aria-expanded="true"]',"pin-rest":'.tcrn-shell-pins__item:not([aria-current]):not([aria-expanded="true"])',
 bell:".tcrn-shell-bell",avatar:".tcrn-shell-avatar","crumb-parent":".tcrn-breadcrumb a","crumb-current":'.tcrn-breadcrumb [aria-current="page"]',h2:".tcrn-page-header__title",sub:".tcrn-doc-shell-sub","btn-primary":".tcrn-page-header .tcrn-button--primary","tab-on":'.tcrn-tabs__tab[aria-selected="true"]',"tab-off":'.tcrn-tabs__tab[aria-selected="false"]',th:".tcrn-doc-table th","td-name":".tcrn-doc-table td:first-child","st-ok":".tcrn-doc-status--ok",
 "srch-ph":".tcrn-search-input__control","srch-kbd":".tcrn-search-input__shortcut","it-on":'.tcrn-shell-menu .tcrn-nav-item[aria-current="page"]',"it-hover":'.tcrn-shell-menu .tcrn-nav-item[data-tcrn-preview-state="hover"]',"it-rest":'.tcrn-shell-menu .tcrn-nav-item:not([aria-current]):not([data-tcrn-preview-state]):not([aria-expanded])',"pinb-on-wash":'.tcrn-shell-menu .tcrn-nav-item-row:has([aria-current="page"]) [data-pin-button]',"pinb-outline":'.tcrn-shell-menu .tcrn-nav-item-row:has(.tcrn-nav-item[data-tcrn-preview-state="hover"]) [data-pin-button]',"pinb-on":'.tcrn-shell-menu .tcrn-nav-item-row:has(.tcrn-nav-item:not([aria-current]):not([data-tcrn-preview-state])) [data-pin-button][aria-pressed="true"]',"grp-hover":".tcrn-nav-group__label-text","pbar-label":".tcrn-shell-menu__crumbs-label","lk-b":".tcrn-product-logo__line-one-base","lk-em":".tcrn-product-logo__line-one-suffix","lk-small":".tcrn-product-logo__line-two","drop-srch":".tcrn-shell-dropdown .tcrn-search-input__control","drop-rest":'.tcrn-shell-dropdown .tcrn-nav-item:not([aria-expanded])',"drop-on":'.tcrn-shell-dropdown .tcrn-nav-item[aria-expanded="true"]',"drop2-rest":".tcrn-shell-dropdown__col .tcrn-nav-item"
};
export function shellSceneFor(cell){return cell.mobile?(cell.sourceState==="sheet"?"phone":"phone-closed"):cell.sourceState==="expanded"?"menu":cell.sourceState==="drop"?"drop":"band";}
export async function readShellMatrices({browser,base,source,page,fixture,entry="static",locale="en"}){
 const observations=[],issues=[],shortcutObservations=[],searchObservations=[],cells=extractMatrixOccurrences(source).filter(c=>c.board.startsWith("07"));
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
   const shortcuts=await collectPublishedShortcuts({source,board:board.slug,reference:ref,page,entry,locale});issues.push(...shortcuts.issues);shortcutObservations.push(...shortcuts.observations);
   const searches=await collectPublishedSearchAssemblies({source,board:board.slug,reference:ref,page,entry,locale});issues.push(...searches.issues);searchObservations.push(...searches.observations);
  }catch(error){issues.push(`${entry}/${locale}/${board.slug}: incomplete shell collection: ${error.message}`);}finally{await ref.close();}
 }
 if(observations.length!==cells.length)issues.push(`${entry}/${locale}: incomplete shell occurrence coverage ${observations.length}/${cells.length}`);
 return {entry,locale,sourceOccurrences:cells.length,observations,issues,supplementalShortcuts:{sourceOccurrences:6,observations:shortcutObservations},supplementalSearches:{sourceOccurrences:publishedSearchOccurrences(source).length,statesPerOccurrence:3,observations:searchObservations}};
}
export async function proveShell({root=ROOT,fixtures=false}={}){
 const entries=[];
 for(const entry of PROOF_ENTRIES){
  try{entries.push(await withPublishedBrowser(async({browser,base,source})=>{
   const issues=[],observations=[],shortcutObservations=[],searchObservations=[],contexts=[],fixtureResults=[];
   for(const locale of LOCALES){
    const matrixPage=await browser.newPage({viewport:{width:1440,height:1000}});let matrix;
    try{matrix=await readShellMatrices({browser,base,source,page:matrixPage,entry,locale});issues.push(...matrix.issues.map(i=>`${entry}/${locale}: ${i}`));observations.push(...matrix.observations);shortcutObservations.push(...matrix.supplementalShortcuts.observations);searchObservations.push(...matrix.supplementalSearches.observations);}catch(error){issues.push(`${entry}/${locale}: incomplete matrix ${error.message}`);matrix={sourceOccurrences:225,observations:[],issues:[error.message]};}finally{await matrixPage.close();}
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
   return {entry,issues,observations,shortcutObservations,searchObservations,contexts,fixtureResults,sourceCommit:source.manifest.site.sourceCommit};
  },{root,entry}));}catch(error){entries.push({entry,issues:[`${entry}: ${error.message}`],observations:[],contexts:[],fixtureResults:[]});}
 }
 return {issues:entries.flatMap(e=>e.issues),sourceOccurrences:225,expectedComparisons:225*proofContexts().length,observations:entries.flatMap(e=>e.observations),supplementalShortcuts:{sourceOccurrences:6,expectedComparisons:6*proofContexts().length,observations:entries.flatMap(e=>e.shortcutObservations??[])},supplementalSearches:{sourceOccurrences:publishedSearchOccurrences(readApprovedSource(root)).length,statesPerOccurrence:3,expectedComparisons:publishedSearchOccurrences(readApprovedSource(root)).length*3*proofContexts().length,observations:entries.flatMap(e=>e.searchObservations??[])},contexts:entries.flatMap(e=>e.contexts),expectedG18Contexts:proofContexts({themes:true}).length,fixtureResults:entries.flatMap(e=>e.fixtureResults),expectedFixtures:fixtures?18*proofContexts({themes:true}).length:0,mode:fixtures?'local-negative-fixtures':'candidate-measurement',...FORMAL_REVIEW_STATUS};
}
