import { withPublishedBrowser,managerStoryId,publishedBoardUrl,openPublishedBoard } from "./published-browser-proof.mjs";
import { LOCALES,formalApiContracts,checkManagerOutput } from "./published-standard-proof.mjs";
import { ROOT,readApprovedSource,cssRule } from "./approved-site-source.mjs";
import { readApiFacts,exerciseApiBoard,apiBehaviorIssues } from "./published-api-browser.mjs";
import { installIntroRecorder,readIntro } from "./published-shell-gates.mjs";
import { APPROVED_BOARD_IDS } from "./approved-site-pins.mjs";

export function geometryIssues(readings,{source=readApprovedSource()}={}){
 const issues=[],css=source.board('06-inputs').css,n=value=>parseFloat(value);
 for(const r of readings){
  if(r.kind==='switch'){
   const track=cssRule(css,r.small?'.tg.sm>input':'.tg>input'),knob=cssRule(css,r.small?'.tg.sm>input::after':'.tg>input::after'),travel=r.checked?(r.small?12:14):0;
   if(r.width!==n(track.width)||r.height!==n(track.height)||r.knobWidth!==n(knob.width)||r.knobHeight!==n(knob.height)||r.travel!==travel)issues.push(`Switch actual track/knob/travel mismatch ${r.small?'sm':'md'}/${r.checked}`);
  }else if(r.kind==='control'){
   const key=r.size==='sm'?'--h-sm':r.size==='lg'?'--h-lg':'--h-md',height=n(cssRule(source.board('01-tokens').css,'.gp')[key]);
   if(!Number.isFinite(r.height)||Math.abs(r.height-height)>.5)issues.push(`Control variant ${r.size} height ${r.height} != ${height}: ${r.className}`);
   if(r.className.includes('tcrn-button')&&r.transform!=='none')issues.push('Action transform contradicts published 05');
   if(r.iconButton){
    const token=cssRule(source.board('01-tokens').css,'.gp'),pad=n(token[`--pad-${r.size}`]);
    if(r.labelled){if(![r.width,r.labelWidth,r.iconWidth,r.gap,r.paddingLeft,r.paddingRight].every(Number.isFinite)||Math.abs(r.paddingLeft-pad)>.5||Math.abs(r.paddingRight-pad)>.5||Math.abs(r.width-(r.labelWidth+r.iconWidth+r.gap+2*pad))>.5)issues.push(`Labelled IconButton ${r.size} content width/padding differs from formal Button size`);}
    else if(!Number.isFinite(r.width)||Math.abs(r.width-height)>.5||r.paddingLeft!==0||r.paddingRight!==0)issues.push(`Square IconButton ${r.size} differs from formal square`);
   }
   if(r.number&&(![r.minimum,r.twelveCh,r.squeezedWidth].every(Number.isFinite)||Math.abs(r.minimum-r.twelveCh)>.5||Math.abs(r.squeezedWidth-r.twelveCh)>.5))issues.push('NumberInput actual12ch minimum lost under assembled cascade/squeeze');
  }else if(r.kind==='button-group'){
   const token=cssRule(source.board('01-tokens').css,'.gp'),height=n(token[`--h-${r.size}`]);
   if(![2,4,5].includes(r.actionCount)||r.separators!==r.actionCount-1||r.heights.length!==r.actionCount||r.heights.some(h=>!Number.isFinite(h)||Math.abs(h-height)>.5))issues.push(`ButtonGroup ${r.size} actual action count/height/separator geometry`);
  }else if(r.kind==='page-header'){
   const role=cssRule(source.board('07a-shell-upper').css,'.ph h2');
   if(![r.fontSize,r.lineHeight].every(Number.isFinite)||Math.abs(r.fontSize-n(role['font-size']))>.1||Math.abs(r.lineHeight-n(role['font-size'])*n(role['line-height']))>.1)issues.push('PageHeader contextual26px/1.1 overridden by generic Heading');
  }else if(r.kind==='checkbox'&&(r.width!==16||r.height!==16))issues.push('Checkbox geometry differs from published16');
 }
 return issues;
}
async function proveGeometryEntry({root,entry}){return withPublishedBrowser(async({browser,base,source})=>{
 const issues=[],observations=[],page=await browser.newPage({viewport:{width:1440,height:1000}});
 try{for(const locale of LOCALES)for(const board of ['05-actions','06-inputs','07a-shell-upper','07b-shell-lower']){
  try{await openPublishedBoard(page,{base,entry,locale,board});
  // Read both actual knob positions and restore their initial state by closing the page.
  for(const position of (board==='06-inputs'?['initial','toggled']:['initial'])){
   if(position==='toggled')await page.locator('[data-approved-board] .tcrn-switch__control').evaluateAll(async els=>{for(const el of els){el.checked=!el.checked;getComputedStyle(el,'::before').transform;}await Promise.all(els.flatMap(el=>el.getAnimations({subtree:true}).map(animation=>animation.finished.catch(()=>{}))));});
   const readings=await page.locator('[data-approved-board] .tcrn-button,[data-approved-board] input.tcrn-input,[data-approved-board] select.tcrn-select:not([multiple]),[data-approved-board] .tcrn-checkbox,[data-approved-board] .tcrn-switch__control,[data-approved-board] .tcrn-page-header__title').evaluateAll(els=>els.filter(el=>el.getBoundingClientRect().width>0).map(el=>{
    const s=getComputedStyle(el),r=el.getBoundingClientRect(),small=!!el.closest('.tcrn-switch--sm'),kind=el.matches('.tcrn-page-header__title')?'page-header':el.matches('.tcrn-switch__control')?'switch':el.matches('.tcrn-checkbox')?'checkbox':'control';
    const knob=getComputedStyle(el,'::before'),matrix=knob.transform==='none'?null:new DOMMatrixReadOnly(knob.transform),number=el.matches('.tcrn-number-input');
    let twelveCh=null,squeezedWidth=null;
    if(number){
     const probe=document.createElement('span');probe.style.cssText=`position:absolute;display:block;width:12ch;height:0;padding:0;border:0;box-sizing:content-box;font:${s.font};`;el.parentElement.append(probe);
     const original=el.getAttribute('style');try{twelveCh=probe.getBoundingClientRect().width;el.style.inlineSize='1px';squeezedWidth=el.getBoundingClientRect().width;}finally{probe.remove();if(original===null)el.removeAttribute('style');else el.setAttribute('style',original);}
    }
    return {className:el.className,kind,small,size:/--sm\b/.test(el.className)?'sm':/--lg\b/.test(el.className)?'lg':'md',checked:el.checked,width:r.width,height:r.height,transform:s.transform,knobWidth:parseFloat(knob.width),knobHeight:parseFloat(knob.height),travel:matrix?.m41??0,iconButton:el.matches('.tcrn-icon-button'),labelled:el.matches('.tcrn-icon-button--labelled'),paddingLeft:parseFloat(s.paddingLeft),paddingRight:parseFloat(s.paddingRight),gap:parseFloat(s.columnGap),labelWidth:el.querySelector('.tcrn-icon-button__label')?.getBoundingClientRect().width,iconWidth:el.querySelector('svg')?.getBoundingClientRect().width,number,minimum:parseFloat(s.minInlineSize),twelveCh,squeezedWidth,fontSize:parseFloat(s.fontSize),lineHeight:parseFloat(s.lineHeight)};
   }));
   if(board==='05-actions')readings.push(...await page.locator('[data-approved-board] .tcrn-button-group').evaluateAll(groups=>groups.map(group=>{const actions=[...group.querySelectorAll(':scope > button.tcrn-button')];return {kind:'button-group',size:group.dataset.buttonGroupSize,actionCount:actions.length,separators:group.querySelectorAll(':scope > .tcrn-button-group__separator').length,heights:actions.map(el=>el.getBoundingClientRect().height)};})));
   issues.push(...geometryIssues(readings,{source}).map(issue=>`${entry}/${locale}/${board}: ${issue}`));observations.push({entry,locale,board,position,readings});
  }
  }catch(error){issues.push(`${entry}/${locale}/${board}: incomplete geometry: ${error.message}`);}
 }}finally{await page.close();}return {issues,observations};
},{root,entry});}
export async function proveGeometry({root=ROOT}={}){
 const entries=[];for(const entry of ['static','manager'])try{entries.push(await proveGeometryEntry({root,entry}));}catch(error){entries.push({issues:[`${entry}: ${error.message}`],observations:[]});}
 return {issues:entries.flatMap(e=>e.issues),observations:entries.flatMap(e=>e.observations)};
}
async function renderedFonts(page,selector){
 const session=await page.context().newCDPSession(page);
 try{await session.send("DOM.enable");await session.send("CSS.enable");const {root}=await session.send("DOM.getDocument");const {nodeId}=await session.send("DOM.querySelector",{nodeId:root.nodeId,selector});if(!nodeId)throw new Error(`Missing rendered-font probe ${selector}`);const {fonts}=await session.send("CSS.getPlatformFontsForNode",{nodeId});const byFamily=new Map();for(const font of fonts)if(font.glyphCount)byFamily.set(font.familyName,(byFamily.get(font.familyName)??0)+font.glyphCount);return [...byFamily].sort(([a],[b])=>a.localeCompare(b));}
 finally{await session.detach();}
}
export async function proveFontsInBrowser({root=ROOT,entry="static"}={}){return withPublishedBrowser(async({browser,base})=>{
 const issues=[],observations=[],page=await browser.newPage(),reference=await browser.newPage(),requests=[];page.on("request",r=>requests.push(r.url()));
 try{
  await reference.goto(`${base}/__formal/02-typography`);
  for(const locale of LOCALES){
   await page.goto(entry==="static"?`${base}/${locale}/02-typography.html`:`${base}/iframe.html?id=published-standards--typography&viewMode=story&globals=locale:${locale}`);await page.locator('[data-approved-board="02-typography"]').waitFor();
   const result=await page.evaluate(async()=>{await document.fonts.ready;const families=["Hanken Grotesk","Source Serif 4","IBM Plex Mono","Noto Sans SC","Noto Serif SC"];return {faces:await Promise.all(families.map(async family=>({family,loaded:(await document.fonts.load(`16px "${family}"`,family.startsWith("Noto")?"季度复盘":"Q3 Review 128")).length}))),text:Object.fromEntries(["body","h1","id"].map(role=>[role,document.querySelector(`[data-formal-role="${role}"]`)?.textContent??""]))};});
   for(const face of result.faces)if(!face.loaded)issues.push(`${locale}: formal family did not load ${face.family}`);
   await reference.evaluate(({text,locale})=>{document.documentElement.lang=locale;document.getElementById("font-role-reference")?.remove();const container=document.createElement("div");container.id="font-role-reference";container.className="pane gp";for(const [role,value]of Object.entries(text)){const el=document.createElement(role==="h1"?"h1":"p");el.className=role==="body"?"tx":role;el.id=`font-ref-${role}`;el.textContent=value;container.append(el);}document.body.append(container);return document.fonts.ready;},{text:result.text,locale});
   const roles=[];for(const role of ["body","h1","id"]){const actual=await renderedFonts(page,`[data-formal-role="${role}"]`),expected=await renderedFonts(reference,`#font-ref-${role}`);if(!actual.length||JSON.stringify(actual)!==JSON.stringify(expected))issues.push(`${locale}/${role}: actual rendered font families/glyph counts differ from the independent published-font reference`);roles.push({role,text:result.text[role],actual,expected});}
   observations.push({locale,faces:result.faces,roles});
  }
  if(requests.some(url=>!url.startsWith(base)))issues.push("Font/browser resource request escaped the local published-asset closure");
 }finally{await page.close();await reference.close();}
 return {issues,observations,networkRequests:requests.length};
},{root,entry});}
export { managerStoryId };
async function apiRuntime(page,board,{browser,url,source,locale}){
 let facts=await readApiFacts(page,{source,locale});facts=await exerciseApiBoard(page,board,facts);
 if(facts.IconButton){facts.IconButton.geometryIssues=geometryIssues(facts.IconButton.sizeReadings,{source});facts.IconButton.allPublishedSizes&&=facts.IconButton.geometryIssues.length===0;}
 if(facts.ButtonGroup){facts.ButtonGroup.geometryIssues=geometryIssues(facts.ButtonGroup.groupReadings.map(r=>({kind:'button-group',size:r.size,actionCount:r.actions.length,separators:r.separators,heights:r.actions.map(a=>a.height)})),{source});facts.ButtonGroup.allPublishedSizes&&=facts.ButtonGroup.geometryIssues.length===0;}
 if(board==='07a-shell-upper'){
  const introPage=await browser.newPage();try{await installIntroRecorder(introPage);const intro=await readIntro(introPage,url);facts.ShellIntro.sessionMotionContract=intro.first>0&&intro.refresh===0&&intro.reduced===0&&intro.total===460&&intro.total<=700&&intro.plan.card===120&&intro.plan.mark===240&&intro.plan.paper===100&&intro.landingMatches&&intro.markOpaque&&intro.frames.length>1&&intro.properties.every(p=>['transform','opacity'].includes(p));facts.ShellIntro.observation=intro;}finally{await introPage.close();}
 }
 return facts;
}
// Exercise the document shell itself. Direct URLs remain useful for independent
// fidelity collection, but do not establish that readers can reach these documents.
export function provenanceActivationIssues(reading,{base,entry,locale,source,board}={}){
 const issues=[],href=entry==='static'?`/${locale}/source.html`:'#source',expected=new URL(href,entry==='static'?base:reading.before).href;
 if(reading.href!==href)issues.push('provenance search destination');
 if(reading.activated!==expected)issues.push('provenance activation did not arrive at the actual source route/anchor');
 const sourceIds=entry==='static'?source.manifest.boards.map(b=>b.sourceId):[source.manifest.boards.find(b=>b.slug===board)?.sourceId];
 if(!reading.visible||!reading.text?.includes(source.manifest.site.sourceCommit)||sourceIds.some(id=>!id||!reading.text.includes(id))||(entry==='static'&&!reading.text?.includes(source.manifest.site.url)))issues.push('provenance activation did not render the expected published source content');
 return issues;
}
// Static API results leave readers on api.html, which has no board marker.
// Only manager source sections need the current board's source ID.
export async function activateProvenanceResult(page,result,{base,entry,locale,source}){
 const before=page.url(),board=entry==='manager'?await page.locator('[data-approved-board]').first().getAttribute('data-approved-board'):null,href=await result.getAttribute('href');
 const expected=new URL(entry==='static'?`/${locale}/source.html`:'#source',entry==='static'?base:before).href;
 await result.click();await page.waitForURL(expected);await page.locator('[data-docs-ready="true"]').waitFor();
 const content=page.locator(entry==='static'?'main .tcrn-doc-content':'section#source');await content.waitFor({state:'visible'});
 const reading={before,href,activated:page.url(),visible:await content.isVisible(),text:await content.textContent()};
 return {board,...reading,issues:provenanceActivationIssues(reading,{base,entry,locale,source,board})};
}
export async function exerciseDocsNavigation(page,{base,entry,locale,source,formal}){
 const issues=[],observations=[];
 const owner=()=>page.locator('.tcrn-product-shell').first();
 const open=async()=>{const brand=owner().locator('[data-shell-brand]').first();if(await brand.getAttribute('aria-expanded')!=='true')await brand.click();return owner().locator(':scope > .tcrn-shell-menu');};
 try{await openPublishedBoard(page,{base,entry,locale,board:'01-tokens'});}catch(error){return {issues:[`${entry}/${locale}: navigation start ${error.message}`],observations};}
 for(const board of Object.keys(APPROVED_BOARD_IDS)){
  try{
   const menu=await open(),expected=publishedBoardUrl(base,entry,locale,board),href=expected.slice(base.length),link=menu.locator(`a[data-shell-row][href="${href}"]`);
   if(await link.count()!==1)throw new Error(`Missing unique actual document navigation link ${board}`);
   await link.click();await page.locator(`[data-approved-board="${board}"]`).waitFor();await page.locator('[data-docs-ready="true"]').waitFor();
   if(page.url()!==expected)issues.push(`${entry}/${locale}: document navigation activation ${board}`);
   observations.push({kind:'document-navigation',entry,locale,board,href,activated:page.url()});
  }catch(error){issues.push(`${entry}/${locale}/${board}: navigation ${error.message}`);}
 }
 // Dialog is a role keyword of two registered shell APIs, not a standalone API.
 for(const query of ['Dialog','  ＤｉＡｌＯｇ  ']){
  try{
   const menu=await open(),search=menu.locator('[data-shell-search] input[type="search"]');await search.fill(query);
   const links=menu.locator('[data-search-result]');await links.first().waitFor({state:'visible'});
   const results=await links.evaluateAll(els=>els.map(el=>({id:new URL(el.href).hash.slice(1),name:el.querySelector('strong')?.textContent,href:el.getAttribute('href')})));
   const expected=[['ShellBrandButton','07a-shell-upper'],['ShellMenu','07b-shell-lower']].map(([name,board])=>({id:`api-${name}`,name,href:entry==='static'?`/${locale}/api.html#api-${name}`:`${publishedBoardUrl(base,entry,locale,board).slice(base.length)}#api-${name}`}));
   if(JSON.stringify(results)!==JSON.stringify(expected))issues.push(`${entry}/${locale}: dialog role search must return exactly the registered shell API identities and destinations`);
   if(results.some(r=>r.id==='api-Dialog'||r.href?.endsWith('#api-Dialog')))issues.push(`${entry}/${locale}: unsupported api-Dialog identity returned`);
   observations.push({kind:'dialog-role-search',entry,locale,query,results});
  }catch(error){issues.push(`${entry}/${locale}: dialog role search ${query}: ${error.message}`);}
 }
 for(const query of ['StateView','brand-identity','tcrn-brand-mark.svg']){
  try{const menu=await open(),search=menu.locator('[data-shell-search] input[type="search"]');await search.fill(query);await menu.locator('[data-product-shell-search-empty]:not([hidden])').waitFor();const results=await menu.locator('[data-search-result]').count();if(results)issues.push(`${entry}/${locale}: unsupported search result ${query}`);observations.push({kind:'unsupported-search',entry,locale,query,results});}catch(error){issues.push(`${entry}/${locale}: unsupported search ${query}: ${error.message}`);}
 }
 for(const [name,contract]of Object.entries(formal)){
  try{
   const menu=await open(),search=menu.locator('[data-shell-search] input[type="search"]');await search.fill(name);
   const result=menu.locator('[data-search-result]').filter({has:page.locator('strong',{hasText:new RegExp(`^${name}$`)})});await result.waitFor({state:'visible'});
   const href=await result.getAttribute('href'),expected=entry==='static'?`/${locale}/api.html#api-${name}`:`${publishedBoardUrl(base,entry,locale,contract.board).slice(base.length)}#api-${name}`;
   if(href!==expected)issues.push(`${entry}/${locale}/${name}: search result destination differs from approved contract board`);
   await result.click();await page.locator(`[data-approved-api="${name}"]`).waitFor();await page.locator('[data-docs-ready="true"]').waitFor();
   if(new URL(page.url()).hash!==`#api-${name}`)issues.push(`${entry}/${locale}/${name}: search result did not activate its actual API anchor`);
   observations.push({kind:'api-search-activation',entry,locale,name,href,activated:page.url()});
  }catch(error){issues.push(`${entry}/${locale}/${name}: search activation ${error.message}`);}
 }
 try{
  const menu=await open();await menu.locator('[data-shell-search] input[type="search"]').fill(source.manifest.site.sourceCommit);
  const result=menu.locator('[data-search-result]');await result.waitFor({state:'visible'});
  const {issues:activationIssues,...reading}=await activateProvenanceResult(page,result,{base,entry,locale,source});
  issues.push(...activationIssues.map(issue=>`${entry}/${locale}: ${issue}`));
  observations.push({kind:'source-search-activation',entry,locale,...reading});
 }catch(error){issues.push(`${entry}/${locale}: provenance search ${error.message}`);}
 return {issues,observations};
}
export async function proveDocsRoutes({root=ROOT,entry='static'}={}){return withPublishedBrowser(async({browser,base,source})=>{
 const issues=[],observations=[],page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[],requests=[],failures=[],formal=formalApiContracts(source);
 page.on('pageerror',error=>errors.push(error.message));page.on('request',r=>requests.push(r.url()));page.on('requestfailed',r=>failures.push({url:r.url(),error:r.failure()?.errorText}));page.on('response',r=>{if(r.status()>=400)failures.push({url:r.url(),status:r.status()});});
 try{
  if(entry==='manager'){
   issues.push(...checkManagerOutput(root).issues);
   for(const locale of LOCALES)try{
    const response=await page.goto(`${base}/index.html?path=/story/${managerStoryId('01-tokens')}&globals=locale:${locale}`);if(response.status()!==200)issues.push('Actual manager HTML unreadable');await page.locator('iframe#storybook-preview-iframe').waitFor();
    for(const board of Object.keys(APPROVED_BOARD_IDS)){
     const id=managerStoryId(board),link=page.locator(`a[data-item-id="${id}"],a[id="${id}"]`).first();
     try{await link.click();const frame=page.frameLocator('#storybook-preview-iframe');await frame.locator(`[data-approved-board="${board}"][lang="${locale}"]`).waitFor();await frame.locator('[data-docs-ready="true"]').waitFor();observations.push({entry:'manager-ui',locale,board,id,iframe:await page.locator('iframe#storybook-preview-iframe').getAttribute('src')});}catch(error){issues.push(`manager-ui/${locale}/${board}: ${error.message}`);}
    }
   }catch(error){issues.push(`manager-ui/${locale}: ${error.message}`);}
  }
  const pages=entry==='static'?['index',...Object.keys(APPROVED_BOARD_IDS),'api','source']:Object.keys(APPROVED_BOARD_IDS);
  for(const locale of LOCALES){
   for(const id of pages){
    try{
     const url=entry==='static'?`${base}/${locale}/${id}.html`:publishedBoardUrl(base,entry,locale,id);
     const response=await page.goto(url);if(response.status()!==200)issues.push(`${entry}/${locale}/${id} is not readable`);if(APPROVED_BOARD_IDS[id])await page.locator(`[data-approved-board="${id}"]`).waitFor();await page.locator('[data-docs-ready="true"]').waitFor();await page.evaluate(()=>document.fonts.ready);
     const facts=await page.evaluate(()=>({lang:document.querySelector('[data-approved-board]')?.getAttribute('lang')??document.documentElement.lang,source:document.querySelector('[data-published-source]')?.getAttribute('data-published-source'),boards:[...document.querySelectorAll('[data-approved-board]')].map(el=>el.getAttribute('data-approved-board')),apis:[...document.querySelectorAll('[data-approved-api]')].map(el=>({name:el.getAttribute('data-approved-api'),formal:el.querySelector('[data-api-formal]')?.textContent,summary:el.querySelector('[data-api-summary]')?.textContent,summaryLang:el.querySelector('[data-api-summary]')?.lang,example:el.querySelector('[data-api-example]')?.textContent})),main:document.querySelectorAll('main').length,brokenNames:[...document.querySelectorAll('button')].filter(el=>!el.textContent.trim()&&!el.getAttribute('aria-label')).length}));
     if(facts.lang!==locale||facts.source!==source.manifest.site.sourceCommit||facts.main!==1||facts.brokenNames)issues.push(`${entry}/${locale}/${id}: locale/source/main/named-controls drift`);
     const expectedApis=entry==='manager'?Object.keys(formal).filter(name=>formal[name].board===id):id==='api'?Object.keys(formal):[];
     if(JSON.stringify(facts.apis.map(a=>a.name).sort())!==JSON.stringify(expectedApis.sort()))issues.push(`${entry}/${locale}/${id}: emitted API membership differs`);
     for(const api of facts.apis)if(api.formal!==formal[api.name]?.formal||api.summaryLang!==locale||!api.example?.includes(`<${api.name}`))issues.push(`${entry}/${locale}/${api.name}: required/use/forbidden/behavior text or concrete example missing`);
     if(APPROVED_BOARD_IDS[id])try{const apiFacts=await apiRuntime(page,id,{browser,url,source,locale});for(const name of Object.keys(formal).filter(name=>formal[name].board===id))issues.push(...apiBehaviorIssues(name,apiFacts[name]).map(issue=>`${entry}/${locale}: ${issue}`));facts.apiRuntime=apiFacts;}catch(error){issues.push(`${entry}/${locale}/${id}: actual API interaction incomplete: ${error.message}`);}
     observations.push({entry,locale,id,...facts});
    }catch(error){issues.push(`${entry}/${locale}/${id}: route incomplete: ${error.message}`);}
   }
   const navigation=await exerciseDocsNavigation(page,{base,entry,locale,source,formal});issues.push(...navigation.issues);observations.push(...navigation.observations);
  }
  if(requests.some(url=>!url.startsWith(base)))issues.push(`${entry}: resource request escaped actual local output closure`);
  issues.push(...failures.map(f=>`${entry}: resource failure ${JSON.stringify(f)}`),...errors.map(e=>`${entry}: browser error ${e}`));
 }finally{await page.close();}
 return {issues,entry,observations,requests,failures,sourceCommit:source.manifest.site.sourceCommit};
},{root,entry});}
export async function proveBothDocsEntrypoints({root=ROOT}={}){
 const results=[];for(const entry of ['static','manager'])try{results.push(await proveDocsRoutes({root,entry}));}catch(error){results.push({entry,issues:[`${entry}: ${error.message}`],observations:[]});}
 return {issues:results.flatMap(r=>r.issues),entries:results};
}
