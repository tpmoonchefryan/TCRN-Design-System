import { withPublishedBrowser,managerStoryId,publishedBoardUrl,openPublishedBoard,publishedSearchGeometry,measureNumberMinimums,numberMinimumValid } from "./published-browser-proof.mjs";
import { LOCALES,formalApiContracts,checkManagerOutput,compiled } from "./published-standard-proof.mjs";
import { ROOT,readApprovedSource,cssRule } from "./approved-site-source.mjs";
import { readApiFacts,exerciseApiBoard,apiBehaviorIssues } from "./published-api-browser.mjs";
import { installIntroRecorder,readIntro,readShellSpecimenContent,shellSpecimenContentIssues,showOriginalShellSpecimens } from "./published-shell-gates.mjs";
import { APPROVED_BOARD_IDS,APPROVED_SITE } from "./approved-site-pins.mjs";

export function geometryIssues(readings,{source=readApprovedSource()}={}){
 const issues=[],css=source.board('06-inputs').css,n=value=>parseFloat(value);
 for(const r of readings){
  if(r.kind==='switch'){
   const track=cssRule(css,r.small?'.tg.sm>input':'.tg>input'),knob=cssRule(css,r.small?'.tg.sm>input::after':'.tg>input::after'),travel=r.checked?(r.small?12:14):0;
   if(r.width!==n(track.width)||r.height!==n(track.height)||r.knobWidth!==n(knob.width)||r.knobHeight!==n(knob.height)||r.travel!==travel)issues.push(`Switch actual track/knob/travel mismatch ${r.small?'sm':'md'}/${r.checked}`);
  }else if(r.kind==='control'){
   const key=r.size==='sm'?'--h-sm':r.size==='lg'?'--h-lg':'--h-md';
   let height=n(cssRule(source.board('01-tokens').css,'.gp')[key]);
   if(r.shellSearch){
    try{height=publishedSearchGeometry(source,r.searchContext?.board,r.searchContext?.kind).height;}
    catch{issues.push(`Shell search context missing/unknown: ${r.searchContext?.kind??'lost'}`);}
   }
   if(!Number.isFinite(r.height)||Math.abs(r.height-height)>.5)issues.push(`Control variant ${r.shellSearch?r.searchContext?.kind:r.size} height ${r.height} != ${height}: ${r.className}`);
   // Context selects the correct oracle; it never exempts the actual control or
   // skips subsequent geometry/semantics checks on that same native node.
   if(r.shellSearch&&(!r.searchCarrier||!Number.isFinite(r.carrierHeight)||Math.abs(r.carrierHeight-r.height)>.5||!Number.isFinite(r.width)||r.width<=0))issues.push('Shell search native/carrier geometry');
   if(r.shellSearch&&(r.tag!=='INPUT'||r.inputType!=='search'||r.role!=='combobox'))issues.push('Shell search native semantics after context');
   if(r.className.includes('tcrn-button')&&r.transform!=='none')issues.push('Action transform contradicts published 05');
   if(r.iconButton){
    const token=cssRule(source.board('01-tokens').css,'.gp'),pad=n(token[`--pad-${r.size}`]);
    if(r.labelled){if(![r.width,r.labelWidth,r.iconWidth,r.gap,r.paddingLeft,r.paddingRight].every(Number.isFinite)||Math.abs(r.paddingLeft-pad)>.5||Math.abs(r.paddingRight-pad)>.5||Math.abs(r.width-(r.labelWidth+r.iconWidth+r.gap+2*pad))>.5)issues.push(`Labelled IconButton ${r.size} content width/padding differs from formal Button size`);}
    else if(!Number.isFinite(r.width)||Math.abs(r.width-height)>.5||r.paddingLeft!==0||r.paddingRight!==0)issues.push(`Square IconButton ${r.size} differs from formal square`);
   }
   if(r.number&&!numberMinimumValid(r,source))issues.push('NumberInput actual12ch minimum or font role lost under assembled cascade/squeeze');
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
// Production collection and sensitivity tests share this exact real-node path.
export async function collectGeometryReadings(page){
 const readings=await page.locator('[data-approved-board] .tcrn-button,[data-approved-board] input.tcrn-input,[data-approved-board] select.tcrn-select:not([multiple]),[data-approved-board] .tcrn-checkbox,[data-approved-board] .tcrn-switch__control,[data-approved-board] .tcrn-page-header__title').evaluateAll(els=>els.filter(el=>el.getBoundingClientRect().width>0).map(el=>{
    const s=getComputedStyle(el),r=el.getBoundingClientRect(),small=!!el.closest('.tcrn-switch--sm'),kind=el.matches('.tcrn-page-header__title')?'page-header':el.matches('.tcrn-switch__control')?'switch':el.matches('.tcrn-checkbox')?'checkbox':'control';
    const knob=getComputedStyle(el,'::before'),matrix=knob.transform==='none'?null:new DOMMatrixReadOnly(knob.transform),number=el.matches('.tcrn-number-input');
    const shellSearch=el.matches('input.tcrn-search-input__control')&&!!el.closest('.tcrn-product-shell-search');
    const owner=shellSearch?el.closest('.tcrn-product-shell-search'):null,carrier=owner?.querySelector(':scope > .tcrn-search-input'),board=el.closest('[data-approved-board]')?.getAttribute('data-approved-board');
    const context=owner?.matches('.tcrn-shell-dropdown__search')&&owner.closest('.tcrn-shell-dropdown__panel')?'drop':owner?.matches('.tcrn-shell-menu__search')&&owner.closest('.tcrn-shell-sheet__panel')?'sheet':owner?.matches('.tcrn-shell-menu__search')&&owner.closest('.tcrn-shell-menu__panel')?'menu':'unknown';
    return {shellSearch,searchContext:shellSearch?{kind:context,board,scene:el.closest('[data-formal-shell-scene]')?.getAttribute('data-formal-shell-scene'),theme:el.closest('[data-shell-theme]')?.getAttribute('data-shell-theme'),ownerClassName:owner.className,carrierClassName:carrier?.className}:null,searchCarrier:!!carrier,carrierHeight:carrier?.getBoundingClientRect().height,tag:el.tagName,inputType:el.type,role:el.getAttribute('role'),className:el.className,kind,small,size:/--sm\b/.test(el.className)?'sm':/--lg\b/.test(el.className)?'lg':'md',checked:el.checked,width:r.width,height:r.height,transform:s.transform,knobWidth:parseFloat(knob.width),knobHeight:parseFloat(knob.height),travel:matrix?.m41??0,iconButton:el.matches('.tcrn-icon-button'),labelled:el.matches('.tcrn-icon-button--labelled'),paddingLeft:parseFloat(s.paddingLeft),paddingRight:parseFloat(s.paddingRight),gap:parseFloat(s.columnGap),labelWidth:el.querySelector('.tcrn-icon-button__label')?.getBoundingClientRect().width,iconWidth:el.querySelector('svg')?.getBoundingClientRect().width,number,fontSize:parseFloat(s.fontSize),lineHeight:parseFloat(s.lineHeight)};
   }));
 const numberRows=readings.filter(row=>row.number);
 if(numberRows.length){
  const minimums=await measureNumberMinimums(page.locator('[data-approved-board] input.tcrn-input.tcrn-number-input'));
  numberRows.forEach((row,index)=>Object.assign(row,minimums[index]));
 }
 readings.push(...await page.locator('[data-approved-board="05-actions"] .tcrn-button-group').evaluateAll(groups=>groups.map(group=>{const actions=[...group.querySelectorAll(':scope > button.tcrn-button')];return {kind:'button-group',size:group.dataset.buttonGroupSize,actionCount:actions.length,separators:group.querySelectorAll(':scope > .tcrn-button-group__separator').length,heights:actions.map(el=>el.getBoundingClientRect().height)};})));
 return readings;
}
async function proveGeometryEntry({root,entry}){return withPublishedBrowser(async({browser,base,source})=>{
 const issues=[],observations=[],page=await browser.newPage({viewport:{width:1440,height:1000}});
 try{for(const locale of LOCALES)for(const board of ['05-actions','06-inputs','07a-shell-upper','07b-shell-lower']){
  try{await openPublishedBoard(page,{base,entry,locale,board,originalSpecimens:board.startsWith("07")});
  // Read both actual knob positions and restore their initial state by closing the page.
  for(const position of (board==='06-inputs'?['initial','toggled']:['initial'])){
   if(position==='toggled')await page.locator('[data-approved-board] .tcrn-switch__control').evaluateAll(async els=>{for(const el of els){el.checked=!el.checked;getComputedStyle(el,'::before').transform;}await Promise.all(els.flatMap(el=>el.getAnimations({subtree:true}).map(animation=>animation.finished.catch(()=>{}))));});
   const readings=await collectGeometryReadings(page);
   issues.push(...geometryIssues(readings,{source}).map(issue=>`${entry}/${locale}/${board}: ${issue}`));observations.push({entry,locale,board,position,readings});
  }
  if(board.startsWith('07')){
   try{
    for(const width of [1440,390]){
     if(width===390){
      await page.setViewportSize({width,height:1000});
      await openPublishedBoard(page,{base,entry,locale,board,originalSpecimens:board.startsWith("07")});
     }
     const reading=await readShellSpecimenContent(page),result=shellSpecimenContentIssues(reading,{source,board});
     issues.push(...[...result.outer,...result.specimens].map(issue=>`${entry}/${locale}/${board}/${width}: ${issue}`));
     observations.push({entry,locale,board,width,kind:'shell-specimen-content',reading});
    }
   }finally{await page.setViewportSize({width:1440,height:1000});}
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
   const result=await page.evaluate(async()=>{await document.fonts.ready;const families=["Hanken Grotesk","Source Serif 4","IBM Plex Mono","Noto Sans SC","Noto Serif SC"];return {faces:await Promise.all(families.map(async family=>({family,loaded:(await document.fonts.load(`16px "${family}"`,family.startsWith("Noto")?"季度复盘":"Q3 Review 128")).length}))),text:Object.fromEntries(["body","h1","id"].map(role=>[role,document.querySelector(`[data-formal-role="${role}"]`)?.textContent??""])),widths:Object.fromEntries(["body","h1","id"].map(role=>[role,document.querySelector(`[data-formal-role="${role}"]`)?.getBoundingClientRect().width]))};});
   for(const face of result.faces)if(!face.loaded)issues.push(`${locale}: formal family did not load ${face.family}`);
   // Equal line widths preserve wrapping spaces in glyph counts. Font roles and
   // faces still come independently from the published reference stylesheet.
   await reference.evaluate(({text,widths,locale})=>{document.documentElement.lang=locale;document.getElementById("font-role-reference")?.remove();const container=document.createElement("div");container.id="font-role-reference";container.className="pane gp";for(const [role,value]of Object.entries(text)){const el=document.createElement(role==="h1"?"h1":"p");el.className=role==="body"?"tx":role;el.id=`font-ref-${role}`;el.textContent=value;el.style.width=`${widths[role]}px`;container.append(el);}document.body.append(container);return document.fonts.ready;},{text:result.text,widths:result.widths,locale});
   const roles=[];for(const role of ["body","h1","id"]){const actual=await renderedFonts(page,`[data-formal-role="${role}"]`),expected=await renderedFonts(reference,`#font-ref-${role}`);if(!actual.length||JSON.stringify(actual)!==JSON.stringify(expected))issues.push(`${locale}/${role}: actual rendered font families/glyph counts differ from the independent published-font reference`);roles.push({role,text:result.text[role],width:result.widths[role],actual,expected});}
   observations.push({locale,faces:result.faces,roles});
  }
  if(requests.some(url=>!url.startsWith(base)))issues.push("Font/browser resource request escaped the local published-asset closure");
 }finally{await page.close();await reference.close();}
 return {issues,observations,networkRequests:requests.length};
},{root,entry});}
export { managerStoryId };
async function apiRuntime(page,board,{browser,url,source,locale}){
 if(board.startsWith("07"))await showOriginalShellSpecimens(page);
 let facts=await readApiFacts(page,{source,locale});facts=await exerciseApiBoard(page,board,facts);
 if(facts.IconButton){facts.IconButton.geometryIssues=geometryIssues(facts.IconButton.sizeReadings,{source});facts.IconButton.allPublishedSizes&&=facts.IconButton.geometryIssues.length===0;}
 if(facts.ButtonGroup){facts.ButtonGroup.geometryIssues=geometryIssues(facts.ButtonGroup.groupReadings.map(r=>({kind:'button-group',size:r.size,actionCount:r.actions.length,separators:r.separators,heights:r.actions.map(a=>a.height)})),{source});facts.ButtonGroup.allPublishedSizes&&=facts.ButtonGroup.geometryIssues.length===0;}
 if(board==='07a-shell-upper'){
  const introPage=await browser.newPage();try{await installIntroRecorder(introPage);const intro=await readIntro(introPage,url);facts.ShellIntro.sessionMotionContract=intro.first>0&&intro.refresh===0&&intro.reduced===0&&intro.total===460&&intro.total<=700&&intro.plan.card===120&&intro.plan.mark===240&&intro.plan.paper===100&&intro.landingMatches&&intro.markOpaque&&intro.frames.length>1&&intro.properties.every(p=>['transform','opacity'].includes(p));facts.ShellIntro.observation=intro;}finally{await introPage.close();}
 }
 return facts;
}
const retiredSourceLabels = {
 'zh-CN': ['正式来源', '来源对比度矩阵', '正式原文'],
 en: ['Published source', 'Source contrast matrix', 'Normative original'],
 ja: ['公開済みソース', '公開ソースとバージョン', '公開元のコントラスト表', '規範原文'],
 ko: ['게시된 원본', '공개 소스 및 버전', '게시 원본 대비 표', '규범 원문'],
 fr: ['Source publiée', 'Matrice de contraste publiée', 'Original normatif'],
};
const retiredSourceLinks = 'a[href*="/source.html"], a[href="#source"], a[href*="published-standards--source"]';

export async function readDocsSourceUi(surface, locale) {
 return surface.locator('.docs-shell').evaluate((shell, {terms, links, sourceUrl}) => {
  const sourceCells = [...shell.querySelectorAll('[data-source-cell-id]')];
  const cellIds = new Set(sourceCells.map(el => el.dataset.sourceCellId));
  const text = shell.textContent;
  return {
   terms: terms.filter(term => text.includes(term)),
   links: shell.querySelectorAll(links + `, a[href^="${sourceUrl}"]`).length,
   sections: shell.querySelectorAll('#source, .portal-footer, .docs-source-list').length,
   lineMarkers: (text.match(/\/ L\d+\b/g) ?? []).length,
   captions: [...shell.querySelectorAll('[data-published-matrix] code')]
    .filter(el => el.textContent.split(' · ').some(id => cellIds.has(id))).length,
   accessibleNames: sourceCells.filter(el => el.getAttribute('aria-label')?.includes(el.dataset.sourceCellKey)).length,
  };
 }, {
  terms: ['Sites v1', 'Owner 2026-10-11', APPROVED_SITE.url, APPROVED_SITE.sourceCommit,
   ...Object.values(APPROVED_BOARD_IDS), ...retiredSourceLabels[locale]],
  links: retiredSourceLinks,
  sourceUrl: APPROVED_SITE.url,
 });
}

async function readRetiredSourceMenu(menu, locale) {
 const links = await menu.locator(retiredSourceLinks).count();
 const groups = await menu.locator('[data-shell-row][aria-controls$="-col-references"]').count();
 const search = menu.locator('input[type="search"]');
 const results = [];
 for (const query of [retiredSourceLabels[locale][0], APPROVED_SITE.sourceCommit]) {
  await search.fill(query);
  await menu.locator('[data-product-shell-search-empty]:not([hidden])').waitFor();
  results.push(await menu.locator('[data-search-result]').count());
 }
 return {links,groups,results};
}

// Direct URLs collect fidelity evidence. Activate the actual menu links to check reader navigation.
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
   const activatedUrl=new URL(page.url()),expectedUrl=new URL(expected);activatedUrl.searchParams.sort();expectedUrl.searchParams.sort();
   if(activatedUrl.href!==expectedUrl.href)issues.push(`${entry}/${locale}: document navigation activation ${board}`);
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
 for(const query of ['StateView','brand-identity','tcrn-brand-mark.svg',retiredSourceLabels[locale][0],source.manifest.site.sourceCommit]){
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
 return {issues,observations};
}
const docsPages = ['index', ...Object.keys(APPROVED_BOARD_IDS), 'api'];
const primaryPages = ['index', '01-tokens', '04-brand', '05-actions', '07a-shell-upper'];
const topicPages = {
  foundations: ['01-tokens', '02-typography', '03-icons'],
  brand: ['04-brand'],
  components: ['05-actions', '06-inputs', 'api'],
  shell: ['07a-shell-upper', '07b-shell-lower'],
};
const wrapperStories = { index: 'home', api: 'api' };
const docsStoryId = page => Object.hasOwn(wrapperStories, page)
  ? `published-standards--${wrapperStories[page]}`
  : managerStoryId(page);
const docsHref = (entry, locale, page) => entry === 'static'
  ? `/${locale}/${page}.html`
  : `/iframe.html?id=${docsStoryId(page)}&viewMode=story&globals=locale:${locale}`;

function managerMenuHref(managerPath,locale,page,fragment=''){
 const id=docsStoryId(page),anchor=fragment?`&docsAnchor=${id}:${encodeURIComponent(fragment)}`:'';
 return `${managerPath}?path=/story/${id}&globals=locale:${locale}${anchor}`;
}
function headerHref({base,entry,locale,managerUi,managerPath},page,fragment=''){
 if(managerUi)return managerMenuHref(managerPath,locale,page,fragment);
 const suffix=fragment?`#${fragment}`:'';
 return entry==='static'?`/${locale}/${page}.html${suffix}`:`/iframe.html?id=${docsStoryId(page)}&viewMode=story&globals=locale:${locale}${suffix}`;
}
const docsTopicPages={
 foundations:['01-tokens','02-typography','03-icons'],
 brand:['04-brand'],
 components:['05-actions','06-inputs','api'],
 shell:['07a-shell-upper','07b-shell-lower'],
};

// Exercise the actual docs-only hover cascade and keyboard path. This is deliberately separate
// from ShellMenu/ProductShell proofs: the published product menu remains click-driven.
export async function exerciseDocsTopbar(page,{base,entry,locale,managerUi=false,formal,negative=locale==='en'}={}){
 const issues=[],observations=[];
 try{
  await page.emulateMedia({reducedMotion:'reduce'});
  const indexPath=managerUi
   ?`${base}/index.html?path=/story/${docsStoryId('index')}&globals=locale:${locale}`
   :`${base}${docsHref(entry,locale,'index')}`;
  const response=await page.goto(indexPath);if(!response||response.status()!==200)throw new Error('topbar home route unreadable');
  const managerPath=managerUi?new URL(page.url()).pathname:'';
  const surface=managerUi?page.frameLocator('#storybook-preview-iframe'):page;
  await surface.locator(`.docs-shell[data-docs-page="index"][lang="${locale}"][data-docs-ready="true"]`).waitFor();
  const shell=surface.locator('.docs-shell');
  const nav=shell.locator('.docs-topic-nav');if(!(await nav.isVisible()))throw new Error('desktop docs topic strip is not visible');
  if(!(await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches)))issues.push(`${entry}/${locale}: reduced-motion preference was not applied`);
  const initialTheme=await shell.getAttribute('data-tcrn-theme'),toggle=shell.locator('.docs-preferences .tcrn-shell-theme-toggle');
  const themeBackgrounds=[];
  for(const theme of [initialTheme,initialTheme==='dark'?'light':'dark']){
   if(await shell.getAttribute('data-tcrn-theme')!==theme)await toggle.click();
   await shell.waitFor({state:'visible'});
   const trigger=nav.locator('[data-pin="foundations"] > button');await trigger.hover();
   const panel=nav.locator('[data-docs-topic-layer="foundations"] > .docs-topic-menu').first();await panel.waitFor({state:'visible'});
   themeBackgrounds.push(await panel.evaluate(el=>getComputedStyle(el).backgroundColor));
   const duration=await panel.locator('.docs-topic-menu__row').first().evaluate(el=>getComputedStyle(el).transitionDuration);
   if(!duration.split(',').every(value=>parseFloat(value.trim())===0))issues.push(`${entry}/${locale}: reduced-motion still animates topic rows`);
   await shell.locator('.docs-paper').hover({position:{x:20,y:20}});
  }
  if(themeBackgrounds[0]===themeBackgrounds[1])issues.push(`${entry}/${locale}: topic panel does not respond to both light and dark themes`);
  if(await shell.getAttribute('data-tcrn-theme')!==initialTheme)await toggle.click();
  const home=nav.locator(':scope > .tcrn-shell-pins__pin > a');
  const homeHref=headerHref({base,entry,locale,managerUi,managerPath},'index');
  if(await home.getAttribute('href')!==homeHref)issues.push(`${entry}/${locale}: topbar home destination differs`);
  const topicButtons=nav.locator('.docs-topics [data-pin] > button');
  const topicIds=await topicButtons.evaluateAll(els=>els.map(el=>el.parentElement.getAttribute('data-pin')));
  if(JSON.stringify(topicIds)!==JSON.stringify(Object.keys(docsTopicPages)))issues.push(`${entry}/${locale}: topic groups differ from the four portal categories`);
  const opened=[];
  for(const topic of Object.keys(docsTopicPages)){
   try{
    const trigger=nav.locator(`[data-pin="${topic}"] > button`),wrapped=nav.locator(`[data-docs-topic-layer="${topic}"]`);
    const focusBefore=await surface.locator('body').evaluate(el=>{const active=el.ownerDocument.activeElement;return `${active?.tagName}|${active?.id}|${typeof active?.className==='string'?active.className:''}`;});
    await trigger.hover();
    if(await trigger.getAttribute('aria-expanded')!=='true')issues.push(`${entry}/${locale}/${topic}: hover did not open category`);
    const layer=wrapped,menu=layer.locator(':scope > .docs-topic-menu').first();await menu.waitFor({state:'visible'});
    const expectedPages=docsTopicPages[topic].filter(pageId=>pageId!=='api');
    const expectedHrefs=expectedPages.map(pageId=>headerHref({base,entry,locale,managerUi,managerPath},pageId));
    const chapterLinks=menu.locator('a.docs-topic-menu__row'),actualHrefs=await chapterLinks.evaluateAll(els=>els.map(el=>el.getAttribute('href')));
    if(JSON.stringify(actualHrefs)!==JSON.stringify(expectedHrefs))issues.push(`${entry}/${locale}/${topic}: group links, order or language differ`);
    if(expectedHrefs[0]!==await shell.locator(`.portal-card[data-portal-card="${topic}"] .portal-card__primary`).getAttribute('href'))issues.push(`${entry}/${locale}/${topic}: first group link differs from its home card`);
    const branches=menu.locator('button.docs-topic-menu__row'),expectedBranches=topic==='components'?1:0;
    if(await branches.count()!==expectedBranches||await menu.locator('[data-icon-name="chevron-right"]').count()!==expectedBranches)issues.push(`${entry}/${locale}/${topic}: branch row or chevron differs`);
    if(await chapterLinks.count()){
     await chapterLinks.first().hover();
     if(await trigger.getAttribute('aria-expanded')!=='true')issues.push(`${entry}/${locale}/${topic}: pointer handoff into level one closed the menu`);
    }
    if(negative&&topic==='foundations'){
     const first=chapterLinks.first(),good=await first.getAttribute('href'),wrong=headerHref({base,entry,locale,managerUi,managerPath},'07b-shell-lower');
     await first.evaluate((el,value)=>el.setAttribute('href',value),wrong);
     const corrupted=await chapterLinks.evaluateAll(els=>els.map(el=>el.getAttribute('href'))),detected=JSON.stringify(corrupted)!==JSON.stringify(expectedHrefs);
     await first.evaluate((el,value)=>el.setAttribute('href',value),good);
     if(!detected)issues.push(`${entry}/${locale}: negative category-membership mutation escaped its route/order check`);
     observations.push({kind:'negative-group-mutation',entry,locale,detected});
    }
    const focusAfter=await surface.locator('body').evaluate(el=>{const active=el.ownerDocument.activeElement;return `${active?.tagName}|${active?.id}|${typeof active?.className==='string'?active.className:''}`;});
    if(focusAfter!==focusBefore)issues.push(`${entry}/${locale}/${topic}: hover took keyboard focus`);
    if(topic==='components'){
     const branch=branches.first();await branch.hover();
     if(await branch.getAttribute('aria-expanded')!=='true')issues.push(`${entry}/${locale}: API branch did not open on hover`);
     const submenu=wrapped.locator('.docs-topics__submenu-wrap');await submenu.waitFor({state:'visible'});
     const contracts=formal??formalApiContracts(readApprovedSource());
     const boards=Object.keys(APPROVED_BOARD_IDS).filter(board=>Object.values(contracts).some(api=>api.board===board));
     const apiNames=boards.flatMap(board=>Object.keys(contracts).filter(name=>contracts[name].board===board));
     const apiLinks=submenu.locator('a.docs-topic-menu__row');
     const expectedApiHrefs=[headerHref({base,entry,locale,managerUi,managerPath},'api'),...apiNames.map(name=>headerHref({base,entry,locale,managerUi,managerPath},'api',`api-${name}`)),headerHref({base,entry,locale,managerUi,managerPath},'api','adopted-support')];
     const actualApiHrefs=await apiLinks.evaluateAll(els=>els.map(el=>el.getAttribute('href')));
     if(JSON.stringify(actualApiHrefs)!==JSON.stringify(expectedApiHrefs))issues.push(`${entry}/${locale}: API overview/anchor routes differ`);
     if(await apiLinks.count()!==30)issues.push(`${entry}/${locale}: API branch must hold one overview, 28 real anchors and adopted support`);
     const families=await submenu.locator('.docs-topic-menu__group').evaluateAll(groups=>groups.map(group=>({label:group.getAttribute('aria-label'),links:[...group.querySelectorAll('a')].map(a=>a.getAttribute('href'))})));
     if(families.length!==boards.length||families.some((family,index)=>!family.label||JSON.stringify(family.links)!==JSON.stringify(
      Object.keys(contracts).filter(name=>contracts[name].board===boards[index]).map(name=>headerHref({base,entry,locale,managerUi,managerPath},'api',`api-${name}`)))))issues.push(`${entry}/${locale}: API family membership differs from the formal boards`);
     await apiLinks.first().hover();
     if(!(await submenu.isVisible())||await trigger.getAttribute('aria-expanded')!=='true')issues.push(`${entry}/${locale}: pointer handoff into level two closed the menu`);
     if(negative){
      const overview=apiLinks.first(),good=await overview.getAttribute('href'),wrong=good.replace(locale,locale==='en'?'fr':'en').replace('api','wrong-api');
      await overview.evaluate((el,value)=>el.setAttribute('href',value),wrong);
      const corrupted=await overview.getAttribute('href');
      if(corrupted===good)issues.push(`${entry}/${locale}: negative wrong-language/anchor mutation was not applied`);
      if(corrupted===expectedApiHrefs[0])issues.push(`${entry}/${locale}: route check missed a wrong-language/anchor mutation`);
      await overview.evaluate((el,value)=>el.setAttribute('href',value),good);
      observations.push({kind:'negative-route-mutation',entry,locale,detected:corrupted!==expectedApiHrefs[0]});
     }
    }
    opened.push(topic);
   }catch(error){issues.push(`${entry}/${locale}/${topic}: topbar interaction ${error.message}`);}
  }
  await shell.locator('.docs-paper').hover({position:{x:20,y:20}});
  if(await nav.locator('.docs-topics [data-pin] > button[aria-expanded="true"]').count())issues.push(`${entry}/${locale}: leaving the category navigation did not close it`);
  const components=nav.locator('[data-pin="components"] > button'),componentLayer=nav.locator('[data-docs-topic-layer="components"]');
  await components.focus();
  if(await components.getAttribute('aria-expanded')!=='true')issues.push(`${entry}/${locale}: keyboard focus did not open category`);
  if(negative){
   await components.evaluate(el=>{el.__portalTabBlocker=event=>{if(event.key==='Tab')event.preventDefault();};el.addEventListener('keydown',el.__portalTabBlocker);});
   await page.keyboard.press('Tab');
   const swallowed=await components.evaluate(el=>el===el.ownerDocument.activeElement);
   await components.evaluate(el=>{el.removeEventListener('keydown',el.__portalTabBlocker);delete el.__portalTabBlocker;});
   if(!swallowed)issues.push(`${entry}/${locale}: parent-focus mutation did not suppress Tab as expected`);
   observations.push({kind:'negative-parent-focus-mutation',entry,locale,detected:swallowed});
   await components.focus();
  }
  const firstChapter=componentLayer.locator('.docs-topic-menu__row[href]').first(),branch=componentLayer.locator('button.docs-topic-menu__row');
  if(negative){
   const original=await firstChapter.getAttribute('tabindex');await firstChapter.evaluate(el=>el.setAttribute('tabindex','-1'));
   await page.keyboard.press('Tab');
   const skipped=!(await firstChapter.evaluate(el=>el===el.ownerDocument.activeElement));
   await firstChapter.evaluate((el,value)=>{if(value===null)el.removeAttribute('tabindex');else el.setAttribute('tabindex',value);},original);
   if(!skipped)issues.push(`${entry}/${locale}: negative keyboard-focus mutation did not remove the chapter from Tab order`);
   observations.push({kind:'negative-keyboard-mutation',entry,locale,detected:skipped});
   await components.focus();
  }
  await page.keyboard.press('Tab');
  if(!(await firstChapter.evaluate(el=>el===el.ownerDocument.activeElement)))issues.push(`${entry}/${locale}: Tab from category did not reach a real chapter link`);
  await page.keyboard.press('Tab');await page.keyboard.press('Tab');
  if(!(await branch.evaluate(el=>el===el.ownerDocument.activeElement))||await branch.getAttribute('aria-expanded')!=='true')issues.push(`${entry}/${locale}: Tab did not reach/open the API branch`);
  await page.keyboard.press('Tab');
  const overview=componentLayer.locator('.docs-topics__submenu-wrap a.docs-topic-menu__row').first();
  if(!(await overview.evaluate(el=>el===el.ownerDocument.activeElement)))issues.push(`${entry}/${locale}: Tab did not enter the API submenu`);
  await page.keyboard.press('Escape');
  if(!(await branch.evaluate(el=>el===el.ownerDocument.activeElement))||await branch.getAttribute('aria-expanded')!=='false')issues.push(`${entry}/${locale}: Escape did not collapse level two and return to its branch`);
  await page.keyboard.press('Space');
  if(await branch.getAttribute('aria-expanded')!=='true')issues.push(`${entry}/${locale}: Space did not open level two`);
  await page.keyboard.press('Escape');await page.keyboard.press('Escape');
  if(!(await components.evaluate(el=>el===el.ownerDocument.activeElement))||await components.getAttribute('aria-expanded')!=='false')issues.push(`${entry}/${locale}: Escape did not close the category and return focus`);
  const localeTrigger=shell.locator('.docs-preferences .tcrn-shell-locale-menu__trigger');
  await localeTrigger.click();
  if(await localeTrigger.getAttribute('aria-expanded')!=='true'||await nav.locator('.docs-topics [data-pin] > button[aria-expanded="true"]').count())issues.push(`${entry}/${locale}: locale layer did not exclude the topic cascade`);
  await components.hover();
  if(await localeTrigger.getAttribute('aria-expanded')!=='false'||await components.getAttribute('aria-expanded')!=='true')issues.push(`${entry}/${locale}: topic cascade did not exclude the locale layer`);
  const brand=shell.locator(':scope > header [data-shell-brand]').first();await brand.click();
  if(await brand.getAttribute('aria-expanded')!=='true'||await components.getAttribute('aria-expanded')!=='false')issues.push(`${entry}/${locale}: ShellMenu did not exclude the topic cascade`);
  await brand.click();
  if(negative){
   await components.hover();
   const triggerBox=await components.boundingBox();await components.hover();
   const first=nav.locator('[data-docs-topic-layer="components"]').locator('.docs-topic-menu__row[href]').first(),layer=nav.locator('[data-docs-topic-layer="components"]');
   const original=await layer.getAttribute('style');await layer.evaluate(el=>{el.style.transform='translateY(14px)';});
   const box=await layer.locator('.docs-topic-menu').first().boundingBox();let gapDetected=false;
   if(triggerBox&&box){const x=triggerBox.x+Math.min(triggerBox.width/2,120),y=triggerBox.y+triggerBox.height+(box.y-triggerBox.y-triggerBox.height)/2;await page.mouse.move(x,y);await page.waitForTimeout(30);gapDetected=await components.getAttribute('aria-expanded')==='false';}
   await layer.evaluate((el,value)=>{if(value===null)el.removeAttribute('style');else el.setAttribute('style',value);},original);
   if(!gapDetected)issues.push(`${entry}/${locale}: hover-gap mutation failed to close the category`);
   observations.push({kind:'negative-hover-gap-mutation',entry,locale,detected:gapDetected});
  }
  await components.hover();
  const liveBranch=nav.locator('[data-docs-topic-layer="components"]').locator('button.docs-topic-menu__row');await liveBranch.hover();
  const overviewLink=nav.locator('[data-docs-topic-layer="components"]').locator('.docs-topics__submenu-wrap a.docs-topic-menu__row').first();
  const overviewHref=headerHref({base,entry,locale,managerUi,managerPath},'api');
  if(await overviewLink.getAttribute('href')!==overviewHref)issues.push(`${entry}/${locale}: API overview click route differs from its expected destination`);
  await overviewLink.click();
  if(managerUi){
   await page.waitForURL(url=>url.searchParams.get('path')===`/story/${docsStoryId('api')}`&&url.searchParams.get('globals')===`locale:${locale}`,{timeout:10000});
  }else await page.waitForURL(new URL(overviewHref,base).href,{timeout:10000});
  await surface.locator(`.docs-shell[data-docs-page="api"][lang="${locale}"][data-docs-ready="true"]`).waitFor();
  const apiNav=surface.locator('.docs-topic-nav'),apiCategory=apiNav.locator('[data-pin="components"] > button');await apiCategory.hover();
  const apiBranch=apiNav.locator('[data-docs-topic-layer="components"]').locator('button.docs-topic-menu__row');await apiBranch.hover();
  const anchorLink=apiNav.locator('[data-docs-topic-layer="components"]').locator('.docs-topics__submenu-wrap a.docs-topic-menu__row').nth(1);
  const anchorHref=headerHref({base,entry,locale,managerUi,managerPath},'api','api-Heading');
  if(await anchorLink.getAttribute('href')!==anchorHref)issues.push(`${entry}/${locale}: real API anchor href differs from its Story/language route`);
  await anchorLink.click();
  if(managerUi){
   await page.waitForURL(url=>url.searchParams.get('path')===`/story/${docsStoryId('api')}`&&url.searchParams.get('docsAnchor')===`${docsStoryId('api')}:api-Heading`,{timeout:10000});
  }else await page.waitForURL(new URL(anchorHref,base).href,{timeout:10000});
  await surface.locator('#api-Heading').waitFor({state:'visible'});
  observations.push({kind:'topbar-route-activation',entry,locale,overviewHref,anchorHref,anchorVisible:true});
  observations.push({kind:'docs-topbar',entry,locale,opened,keyboard:true,focusRestored:true});
 }catch(error){issues.push(`${entry}/${locale}: topbar proof incomplete: ${error.message}`);}
 return {issues,observations};
}

async function recordTopicMotion(layer){
 return layer.evaluateHandle(element=>{
  const view=element.ownerDocument.defaultView;
  const phases={category:[],submenu:[]};
  const wrappers={category:element,submenu:element.querySelector('.docs-topics__submenu-wrap')};
  for(const [level,wrapper] of Object.entries(wrappers)){
   const panel=wrapper.querySelector(':scope > .docs-topic-menu');
   panel.addEventListener('transitionrun',event=>{
    if(event.target!==panel||event.propertyName!=='opacity')return;
    const effect=panel.getAnimations().find(animation=>animation.transitionProperty==='opacity')?.effect;
    const box=panel.getBoundingClientRect(),bridge=wrapper.getBoundingClientRect();
    const hits=(x,y)=>wrapper.contains(element.ownerDocument.elementFromPoint(x,y));
    const bridgeX=level==='category'?box.left+box.width/2
     :wrapper.dataset.side==='start'?(box.right+bridge.right)/2:(box.left+bridge.left)/2;
    const bridgeY=level==='category'?(box.top+bridge.top)/2:box.top+box.height/2;
    const reading={
     closed:wrapper.hidden,inert:wrapper.inert,display:view.getComputedStyle(wrapper).display,
     frames:effect?.getKeyframes().map(frame=>Number(frame.opacity)),
     duration:effect?.getTiming().duration,
     panelHit:hits(box.left+box.width/2,box.top+box.height/2),bridgeHit:hits(bridgeX,bridgeY),
    };
    phases[level].push(reading);
    view.requestAnimationFrame(()=>{reading.opacity=Number(view.getComputedStyle(panel).opacity);});
   });
  }
  return phases;
 });
}

// The previous height cap hid the final link below the short Canvas, even at the
// bottom of its own scroller. Wheel and click coordinates must stay in the viewport.
async function reachTopicListEnd(page,list,last){
 await list.evaluate(element=>{element.scrollTop=0;});
 const box=await list.boundingBox();
 if(!box)throw new Error('API list lost its visible box');
 await page.mouse.move(box.x+box.width/2,box.y+Math.min(20,box.height/2));
 await page.mouse.wheel(0,2000);
 return last.evaluate(async link=>{
  const list=link.closest('ul'),doc=link.ownerDocument,view=doc.defaultView;
  const deadline=view.performance.now()+1000;
  while(list.scrollTop+list.clientHeight<list.scrollHeight-1&&view.performance.now()<deadline){
   await new Promise(resolve=>view.requestAnimationFrame(resolve));
  }
  const row=link.getBoundingClientRect(),box=list.getBoundingClientRect();
  return {
   label:link.textContent.trim(),href:link.getAttribute('href'),viewport:[view.innerWidth,view.innerHeight],
   top:box.top,bottom:box.bottom,rowTop:row.top,rowBottom:row.bottom,
   scrollTop:list.scrollTop,scrollMax:list.scrollHeight-list.clientHeight,
   documentTop:doc.scrollingElement.scrollTop,paperTop:link.closest('.docs-shell').querySelector('main').scrollTop,
   hit:link.contains(doc.elementFromPoint(row.left+row.width/2,row.top+row.height/2)),
  };
 });
}

export async function exerciseDocsTopbarEdges(page,{base,entry,locale='zh-CN',managerUi=false,negative=true}={}){
 const issues=[],observations=[],originalViewport=page.viewportSize();
 const shortViewport=managerUi?{width:1500,height:950}:{width:1462,height:650};
 const check=(condition,message)=>{if(!condition)issues.push(`${entry}/${locale}: ${message}`);};
 try{
  await page.setViewportSize(shortViewport);
  await page.emulateMedia({reducedMotion:'reduce'});
  const home=managerUi?managerMenuHref('/index.html',locale,'index'):docsHref(entry,locale,'index');
  const response=await page.goto(base+home);if(response?.status()!==200)throw new Error('edge proof home route unreadable');
  const managerPath=managerUi?new URL(page.url()).pathname:'';
  const surface=managerUi?page.frameLocator('#storybook-preview-iframe'):page;
  const shell=surface.locator(`.docs-shell[data-docs-page="index"][lang="${locale}"][data-docs-ready="true"]`);
  await shell.waitFor();
  const trigger=shell.locator('[data-pin="components"] > button'),nextTopic=shell.locator('[data-pin="shell"] > button');
  const layer=shell.locator('[data-docs-topic-layer="components"]');
  const panel=layer.locator(':scope > .docs-topic-menu'),branch=panel.locator('button.docs-topic-menu__row');
  const submenu=layer.locator('.docs-topics__submenu-wrap'),submenuPanel=submenu.locator('.docs-topic-menu');
  const list=submenuPanel.locator(':scope > .docs-topic-menu__list'),overview=list.locator('a').first(),firstAnchor=list.locator('a').nth(1),last=list.locator('a').last();
  const external=shell.locator('.docs-preferences .tcrn-shell-theme-toggle'),paper=shell.locator('.docs-paper');
  const outside=()=>paper.hover({position:{x:20,y:20}});
  const focused=locator=>locator.evaluate(el=>el===el.ownerDocument.activeElement);
  const hoverOpen=async both=>{await trigger.hover();if(both)await branch.hover();};
  const open=async button=>await button.getAttribute('aria-expanded')==='true';
  const immediate=async()=>layer.evaluate(el=>{
   const sub=el.querySelector('.docs-topics__submenu-wrap'),view=el.ownerDocument.defaultView;
   return [el,sub].map(wrapper=>{
    const panel=wrapper.querySelector(':scope > .docs-topic-menu');
    return {hidden:wrapper.hidden,inert:wrapper.inert,display:view.getComputedStyle(wrapper).display,
     opacity:Number(view.getComputedStyle(panel).opacity),animations:wrapper.getAnimations().length+panel.getAnimations().length};
   });
  });
  const hoverEscape=async(both,mutate=false)=>{
   await outside();
   const keyOwner=both?external:page.locator('body');
   const active=await keyOwner.evaluateHandle(el=>el.ownerDocument.activeElement);
   const focusTag=await active.evaluate(el=>el.tagName);
   await hoverOpen(both);
   const wasOpen=await open(trigger)&&(!both||await open(branch));
   if(mutate)await keyOwner.evaluate(el=>el.ownerDocument.defaultView.addEventListener('keydown',event=>{
    if(event.key==='Escape')event.stopImmediatePropagation();
   },{capture:true,once:true}));
   await page.keyboard.press('Escape');
   const sameFocus=await keyOwner.evaluate((el,before)=>el.ownerDocument.activeElement===before,active);
   await active.dispose();
   return {wasOpen,focusTag,sameFocus,closed:!(await open(trigger))&&!(await open(branch)),panels:await immediate()};
  };
  const bodyDismissal=await hoverEscape(false);
  check(bodyDismissal.focusTag==='BODY'&&bodyDismissal.wasOpen&&bodyDismissal.sameFocus&&bodyDismissal.closed,
   'hover-only Escape failed with initial BODY focus');
  if(negative){
   const mutation=await hoverEscape(false,true);
   check(mutation.wasOpen&&mutation.sameFocus&&!mutation.closed,'hover-only Escape proof missed a suppressed Escape');
   observations.push({kind:'negative-hover-escape-mutation',entry,locale,detected:mutation.wasOpen&&!mutation.closed});
  }
  await outside();
  await external.focus();
  const twoLevelDismissal=await hoverEscape(true);
  check(twoLevelDismissal.wasOpen&&twoLevelDismissal.sameFocus&&twoLevelDismissal.closed&&await focused(external),
   'hover-only Escape did not close both levels or moved external focus');
  check(twoLevelDismissal.panels.every(p=>p.hidden&&p.inert&&p.display==='none'&&p.opacity===1&&p.animations===0),
   'reduced-motion close did not immediately remove both panels');
  await outside();
  await hoverOpen(true);
  const reducedOpen=await immediate();
  check(reducedOpen.every(p=>!p.hidden&&!p.inert&&p.display!=='none'&&p.opacity===1&&p.animations===0),
   'reduced-motion open did not immediately show both panels');
  await outside();
  observations.push({kind:'topbar-hover-dismissal',entry,locale,bodyDismissal,twoLevelDismissal,reducedOpen});

  const focusOverview=async()=>{
   await trigger.focus();
   for(let step=0;step<4;step++)await page.keyboard.press('Tab');
   if(!(await focused(overview)))throw new Error('keyboard did not enter the real API overview');
  };
  await focusOverview();
  await overview.hover();
  await outside();
  const retained=await open(trigger)&&await open(branch)&&await focused(overview)&&await submenu.isVisible();
  await page.keyboard.press('Tab');
  const tabContinued=await focused(firstAnchor);
  await page.keyboard.press('Escape');
  const branchRestored=await focused(branch)&&await open(trigger)&&!(await open(branch));
  await page.keyboard.press('Escape');
  const triggerRestored=await focused(trigger)&&!(await open(trigger));
  check(retained&&tabContinued&&branchRestored&&triggerRestored,'pointer exit lost menu focus, next Tab, or layered Escape restoration');
  await external.focus();
  await focusOverview();
  await page.keyboard.press('Shift+Tab');
  // Walk back through the real links, category triggers and home into the brand button.
  const brand=shell.locator(':scope > header [data-shell-brand]');
  for(let step=0;step<15&&!(await focused(brand));step++)await page.keyboard.press('Shift+Tab');
  const keyboardExited=await focused(brand)&&!(await shell.locator('.docs-topics button[aria-expanded="true"]').count());
  await focusOverview();
  if(managerUi)await page.getByRole('tab',{name:'Controls',exact:true}).click();
  else await paper.click({position:{x:20,y:20}});
  const outsideClosed=!(await open(trigger))&&!(await open(branch));
  check(keyboardExited&&outsideClosed,'native focus exit or outside pointer click did not close the cascade');
  observations.push({kind:'topbar-focus-retention',entry,locale,retained,tabContinued,branchRestored,triggerRestored,keyboardExited,outsideClosed});

  await outside();
  await external.focus();
  await page.emulateMedia({reducedMotion:'no-preference'});
  const motion=await recordTopicMotion(layer);
  await hoverOpen(true);
  for(const visiblePanel of [panel,submenuPanel]){
   await visiblePanel.evaluate(el=>Promise.all(el.getAnimations().map(animation=>animation.finished)));
  }
  await page.keyboard.press('Escape');
  await layer.waitFor({state:'hidden'});
  const phases=await motion.jsonValue();await motion.dispose();
  const terminal=await immediate();
  for(const [level,[opening,closing]] of Object.entries(phases)){
   const fades=(phase,from,to)=>phase?.frames?.[0]===from&&phase.frames.at(-1)===to&&phase.duration===120&&phase.opacity>0&&phase.opacity<1;
   check(fades(opening,0,1)&&fades(closing,1,0)&&!opening.closed&&closing.closed&&closing.display!=='none',
    `${level} panel did not visibly fade in and out on the approved duration`);
   check(closing?.inert&&!closing.panelHit&&!closing.bridgeHit,`${level} closing panel or bridge intercepted pointer input`);
  }
  check(terminal.every(p=>p.hidden&&p.inert&&p.display==='none'&&p.animations===0),'closed panels did not reach their hidden terminal state');
  await focusOverview();
  await page.keyboard.press('Escape');
  await page.keyboard.press('Tab');
  const skippedClosing=await focused(nextTopic)&&!(await open(branch));
  check(skippedClosing,'Tab entered the closing submenu');
  observations.push({kind:'topbar-panel-motion',entry,locale,phases,terminal,skippedClosing});

  await page.emulateMedia({reducedMotion:'reduce'});
  await external.focus();await outside();await trigger.hover();
  const triggerBox=await trigger.boundingBox(),panelBox=await panel.boundingBox(),branchBox=await branch.boundingBox();
  const menuGap=panelBox.y-triggerBox.y-triggerBox.height;
  await page.mouse.move(triggerBox.x+triggerBox.width/2,triggerBox.y+triggerBox.height+menuGap/2);
  await page.mouse.move(branchBox.x+branchBox.width/2,branchBox.y+branchBox.height/2,{steps:4});
  await submenuPanel.waitFor();
  const subBox=await submenuPanel.boundingBox(),cascadeGap=subBox.x-branchBox.x-branchBox.width;
  await page.mouse.move(branchBox.x+branchBox.width+cascadeGap/2,branchBox.y+branchBox.height/2,{steps:4});
  await page.mouse.move(subBox.x+subBox.width/2,branchBox.y+branchBox.height/2,{steps:4});
  check(menuGap===6&&cascadeGap===4&&await open(trigger)&&await open(branch),'real pointer could not cross the 6px and 4px bridges to the right cascade');
  if(entry==='static'&&locale==='zh-CN'){
   await page.setViewportSize({...shortViewport,height:900});
   const overlap=await submenuPanel.evaluate((menu,mutate)=>{
    const doc=menu.ownerDocument;
    const scroller=menu.querySelector(':scope > .docs-topic-menu__list');
    const visible=scroller.getBoundingClientRect();
    for(const chapter of doc.querySelectorAll('.portal-card__chapters a')){
     const card=chapter.closest('.portal-card'),chip=chapter.getBoundingClientRect();
     for(const link of menu.querySelectorAll('a')){
     let row=link.getBoundingClientRect();
     if(Math.min(chip.right,visible.right,row.right)-Math.max(chip.left,visible.left,row.left)>=4){
      // Family headings can occupy the overlap initially. Scroll the real list
      // until an actual destination, rather than a heading, crosses the card.
      scroller.scrollTop+=row.top-chip.top;
      row=link.getBoundingClientRect();
     }
     const left=Math.max(chip.left,visible.left,row.left),right=Math.min(chip.right,visible.right,row.right);
     const top=Math.max(chip.top,visible.top,row.top),bottom=Math.min(chip.bottom,visible.bottom,row.bottom);
     if(right-left<4||bottom-top<4)continue;
     const x=(left+right)/2,y=(top+bottom)/2;
     const hit=link.contains(doc.elementFromPoint(x,y));
     let mutationDetected=null;
     if(mutate){
      const original=card.getAttribute('style');
      try{
       card.style.isolation='auto';
       mutationDetected=chapter.contains(doc.elementFromPoint(x,y));
      }finally{
       if(original===null)card.removeAttribute('style');else card.setAttribute('style',original);
      }
     }
     return {x,y,chapter:chapter.getAttribute('href'),menuLink:link.getAttribute('href'),hit,mutationDetected};
     }
    }
    return null;
   },negative);
   check(overlap?.hit,'a homepage chapter link intercepted the visible topic cascade');
   if(negative)check(overlap?.mutationDetected,'the overlay proof missed a homepage card escaping its stacking context');
   observations.push({kind:'topbar-overlapping-chapter',entry,locale,...overlap});
   await page.setViewportSize(shortViewport);
  }
  const reach=()=>reachTopicListEnd(page,list,last);
  const reachable=reading=>reading.hit&&reading.scrollMax>0&&Math.abs(reading.scrollTop-reading.scrollMax)<=1
   &&Math.abs(reading.bottom-reading.viewport[1]+12)<1&&reading.rowTop>=reading.top
   &&Math.abs(reading.rowBottom-reading.rowTop-32)<1&&reading.documentTop===0&&reading.paperTop===0;
  if(negative){
   await list.evaluate(el=>{el.style.maxBlockSize='calc(100dvh - var(--tcrn-shell-strip-h) - 2 * var(--tcrn-space-3))';});
   const mutation=await reach();
   await list.evaluate(el=>el.style.removeProperty('max-block-size'));
   const detected=!reachable(mutation)&&!mutation.hit&&mutation.rowBottom>mutation.viewport[1];
   check(detected,'last-row proof missed the old viewport-insensitive list cap');
   observations.push({kind:'negative-last-row-mutation',entry,locale,detected,...mutation});
  }
  const short=await reach();
  check(short.viewport[1]<700&&reachable(short),'last API row is not genuinely reachable in the short Canvas');
  await page.setViewportSize({...shortViewport,height:shortViewport.height+350});
  const regular=await reach();
  check(regular.viewport[1]>short.viewport[1]&&regular.bottom>short.bottom&&reachable(regular),
   'open cascade did not adapt and scroll at regular desktop height');
  await page.setViewportSize(shortViewport);
  const resized=await reach();
  const supportHref=headerHref({base,entry,locale,managerUi,managerPath},'api','adopted-support');
  check(resized.viewport[1]===short.viewport[1]&&resized.href===supportHref&&reachable(resized),
   'short Canvas did not restore the reachable same-language final support row after resize');
  observations.push({kind:'topbar-last-row',entry,locale,menuGap,cascadeGap,short,regular,resized});
  if(!reachable(resized))throw new Error('refusing to click an unreachable row');
  const href=headerHref({base,entry,locale,managerUi,managerPath},'api','api-ShellIntro');
  const lastFormal=list.locator(`a[href="${href}"]`);
  await lastFormal.scrollIntoViewIfNeeded();
  const target=await lastFormal.boundingBox();
  await page.mouse.click(target.x+target.width/2,target.y+target.height/2);
  if(managerUi){
   await page.waitForURL(url=>url.searchParams.get('path')===`/story/${docsStoryId('api')}`
    &&url.searchParams.get('globals')===`locale:${locale}`&&url.searchParams.get('docsAnchor')===`${docsStoryId('api')}:api-ShellIntro`);
  }else await page.waitForURL(new URL(href,base).href);
  const anchor=surface.locator(`.docs-shell[data-docs-page="api"][lang="${locale}"][data-docs-ready="true"] #api-ShellIntro[data-approved-api="ShellIntro"]`);
  await anchor.waitFor({state:'visible'});
  const content=await anchor.evaluate(async el=>{
   const view=el.ownerDocument.defaultView;
   await new Promise(resolve=>view.requestAnimationFrame(()=>view.requestAnimationFrame(resolve)));
   const heading=el.querySelector('h2'),box=heading.getBoundingClientRect();
   return {heading:heading.textContent,hash:view.location.hash,headingInView:box.top>=0&&box.bottom<=view.innerHeight,
    summaryLanguage:el.querySelector('[data-api-summary]').lang};
  });
  check(content.heading==='ShellIntro'&&content.hash==='#api-ShellIntro'&&content.headingInView&&content.summaryLanguage===locale,
   'real click did not land on the rendered same-language ShellIntro content');
  observations.push({kind:'topbar-last-row-activation',entry,locale,url:page.url(),...content});
 }catch(error){issues.push(`${entry}/${locale}: topbar edge proof incomplete: ${error.message}`);}
 finally{
  await page.emulateMedia({reducedMotion:'reduce'});
  if(originalViewport)await page.setViewportSize(originalViewport);
 }
 return {issues,observations};
}

// Exercise the existing ShellMenu primitive as a real 390px touch Sheet. The docs topbar is
// intentionally hidden at this width; the complete category tree remains reachable here.
async function readSheetApiRoutes(panel, formal) {
 const boards=Object.keys(APPROVED_BOARD_IDS).filter(board=>Object.values(formal).some(api=>api.board===board));
 const direct=await panel.locator('[data-shell-row][data-shell-level="3"]:visible').evaluateAll(rows=>rows.map(row=>row.getAttribute('href')));
 const families=[];
 for(const board of boards){
  const trigger=panel.locator(`[data-shell-row][data-shell-level="3"][aria-controls$="-col-api-family-${board}"]`).first();
  await trigger.tap();
  const links=await panel.locator('[data-shell-row][data-shell-level="4"]:visible').evaluateAll(rows=>rows.map(row=>row.getAttribute('href')));
  families.push({board,expanded:await trigger.getAttribute('aria-expanded')==='true',links});
 }
 return {direct,families,leaves:families.flatMap(family=>family.links)};
}

export async function exerciseDocsSheet(page,{base,locale,formal,negative=locale==='zh-CN'}={}){
 const issues=[],observations=[];
 const expected={
  foundations:['01-tokens','02-typography','03-icons'].map(page=>`/${locale}/${page}.html`),
  brand:[`/${locale}/04-brand.html`],
  components:[`/${locale}/05-actions.html`,`/${locale}/06-inputs.html`,'#'],
  shell:[`/${locale}/07a-shell-upper.html`,`/${locale}/07b-shell-lower.html`],
 };
 const pages=Object.keys(docsTopicPages);
 const groupRow=(panel,id)=>panel.locator(`[data-shell-row][aria-controls$="-col-${id}"]`).first();
 const openMenu=async()=>{
  const root=page.locator('.docs-shell').first(),button=root.locator(':scope > header [data-shell-brand]').first();
  if(await button.getAttribute('aria-expanded')!=='true')await button.tap();
  const panel=root.locator('.tcrn-shell-sheet__panel');await panel.waitFor({state:'visible'});return {root,panel};
 };
 try{
  const response=await page.goto(`${base}/${locale}/index.html`);if(!response||response.status()!==200)throw new Error('mobile home route unreadable');
  const root=page.locator('.docs-shell').first();await root.waitFor({state:'visible'});await page.locator(`.docs-shell[data-docs-page="index"][lang="${locale}"][data-docs-ready="true"]`).waitFor();
  if(await root.locator('.docs-topics').isVisible())issues.push(`${locale}: desktop topic strip remains visible at 390px`);
  const {panel}=await openMenu();
  if(!(await panel.locator('input[type="search"]').isVisible()))issues.push(`${locale}: ShellMenu search is missing from the Sheet`);
  const current=panel.locator('.tcrn-shell-menu__crumb--current');
  if(await current.getAttribute('href')!==`/${locale}/index.html`||await current.getAttribute('aria-current')!=='page')issues.push(`${locale}: current location is missing or wrong in the Sheet`);
  const visibleRows=panel.locator('[data-shell-row]:visible');
  const actualGroups=await visibleRows.evaluateAll(els=>els.filter(el=>el.dataset.shellLevel==='1'&&!el.closest('[data-shell-pinned-group]')).map(el=>el.getAttribute('aria-controls')?.split('-col-').at(-1)));
  if(JSON.stringify(actualGroups)!==JSON.stringify(['portal',...pages]))issues.push(`${locale}: Sheet does not expose home and all four topic groups`);
  for(const topic of pages){
   try{
    const trigger=groupRow(panel,topic);await trigger.tap();
    if(await trigger.getAttribute('aria-expanded')!=='true')issues.push(`${locale}/${topic}: touch did not expand its group`);
    const links=panel.locator('[data-shell-row][data-shell-level="2"]:visible');
    const hrefs=await links.evaluateAll(els=>els.map(el=>el.getAttribute('href')));
    if(JSON.stringify(hrefs)!==JSON.stringify(expected[topic]))issues.push(`${locale}/${topic}: Sheet child membership or destination differs`);
    if(negative&&topic==='foundations'){
     const first=links.first(),good=await first.getAttribute('href');await first.evaluate((el,value)=>el.setAttribute('href',value),`/${locale}/07b-shell-lower.html`);
     const corrupted=await links.evaluateAll(els=>els.map(el=>el.getAttribute('href'))),detected=JSON.stringify(corrupted)!==JSON.stringify(expected[topic]);
     await first.evaluate((el,value)=>el.setAttribute('href',value),good);
     if(!detected)issues.push(`${locale}: negative Sheet group mutation escaped its destination check`);
     observations.push({kind:'negative-sheet-group-mutation',locale,detected});
    }
   }catch(error){issues.push(`${locale}/${topic}: touch group ${error.message}`);}
  }
  const home=groupRow(panel,'portal');await home.tap();
  const homeLink=panel.locator(`[data-shell-row][data-shell-level="2"][href="/${locale}/index.html"]`).first();
  if(!(await homeLink.isVisible()))issues.push(`${locale}: the topic collection home is not a real Sheet link`);
  await homeLink.tap();await page.waitForURL(`**/${locale}/index.html`);
  let state=await openMenu();
  const search=state.panel.locator('input[type="search"]');await search.fill('MultiSelect');
  const searchResult=state.panel.locator('[data-search-result]').first();await searchResult.waitFor({state:'visible'});
  if(await searchResult.getAttribute('href')!==`/${locale}/api.html#api-MultiSelect`)issues.push(`${locale}: Sheet search API route/anchor differs`);
  await search.fill('');
  const components=groupRow(state.panel,'components');await components.tap();
  const apiBranch=state.panel.locator('[data-shell-row][data-shell-level="2"][aria-controls$="-col-api-branch"]').first();
  if(negative){
   await apiBranch.evaluate(el=>{el.__touchBlocker=event=>event.preventDefault();el.addEventListener('click',el.__touchBlocker);el.style.pointerEvents='none';});
   try{await apiBranch.tap({timeout:1200});}catch{}
   const blocked=await apiBranch.getAttribute('aria-expanded')!=='true';
   await apiBranch.evaluate(el=>{el.removeEventListener('click',el.__touchBlocker);delete el.__touchBlocker;el.style.removeProperty('pointer-events');});
   if(!blocked)issues.push(`${locale}: negative disabled-touch mutation did not block the API branch`);
   observations.push({kind:'negative-sheet-touch-mutation',locale,detected:blocked});
  }
  await apiBranch.tap();
  if(await apiBranch.getAttribute('aria-expanded')!=='true')issues.push(`${locale}: touch did not open the API submenu`);
  const contracts=formal??formalApiContracts(readApprovedSource());
  const routes=await readSheetApiRoutes(state.panel,contracts);
  const expectedApi=routes.families.flatMap(family=>Object.keys(contracts).filter(name=>contracts[name].board===family.board).map(name=>`/${locale}/api.html#api-${name}`));
  const expectedDirect=[`/${locale}/api.html`,...routes.families.map(()=>'#'),`/${locale}/api.html#adopted-support`];
  if(JSON.stringify(routes.leaves)!==JSON.stringify(expectedApi)||JSON.stringify(routes.direct)!==JSON.stringify(expectedDirect)||routes.families.some(family=>!family.expanded))issues.push(`${locale}: Sheet API family routes differ from 28 real contracts`);
  if(routes.leaves.length!==28)issues.push(`${locale}: Sheet API families should expose all 28 anchors`);
  await state.panel.locator(`[data-shell-row][data-shell-level="3"][href="/${locale}/api.html"]`).first().tap();await page.waitForURL(`**/${locale}/api.html`);
  await page.locator('[data-approved-api]').first().waitFor({state:'visible'});
  if(await page.locator('[data-approved-api]').count()!==28)issues.push(`${locale}: API overview did not render the 28 approved contracts`);
  state=await openMenu();await groupRow(state.panel,'components').tap();
  const branch=state.panel.locator('[data-shell-row][data-shell-level="2"][aria-controls$="-col-api-branch"]').first();await branch.tap();
  await state.panel.locator(`[data-shell-row][data-shell-level="3"][aria-controls$="-col-api-family-${contracts.Heading.board}"]`).first().tap();
  const heading=state.panel.locator(`[data-shell-row][data-shell-level="4"][href="/${locale}/api.html#api-Heading"]`).first();
  if(!(await heading.isVisible()))issues.push(`${locale}: Sheet Heading anchor is not reachable`);
  await heading.tap();await page.waitForURL(`**/${locale}/api.html#api-Heading`);
  if(!await page.locator('#api-Heading').isVisible())issues.push(`${locale}: Sheet Heading click did not reach the real API anchor`);
  state=await openMenu();
  const retiredSource=await readRetiredSourceMenu(state.panel,locale);
  if(retiredSource.links||retiredSource.groups||retiredSource.results.some(Boolean))issues.push(`${locale}: retired source appeared in the Sheet`);
  observations.push({kind:'docs-sheet',locale,width:390,touch:true,topics:pages,groupHome:true,search:true,apiRoutes:routes,anchor:'#api-Heading',retiredSource});
 }catch(error){issues.push(`${locale}: Sheet proof incomplete: ${error.message}`);}
 return {issues,observations};
}

// Storybook Manager reserves its own outer chrome, so exercise the actual preview iframe
// after narrowing its viewport to the same 390px Sheet breakpoint as the static document.
export async function exerciseManagerNarrowSheet(page,{base,locale,formal,negative=locale==='zh-CN'}={}){
 const issues=[],observations=[],managerPath='/index.html';
 const waitManagerRoute=async(target,fragment='')=>page.waitForURL(url=>{
  const apiId=docsStoryId(target),expectedAnchor=fragment?`${apiId}:${fragment}`:null;
  return url.searchParams.get('path')===`/story/${apiId}`&&url.searchParams.get('globals')===`locale:${locale}`&&url.searchParams.get('docsAnchor')===expectedAnchor;
 },{timeout:10000});
 const panel=()=>page.frameLocator('#storybook-preview-iframe').locator('.tcrn-shell-sheet__panel');
 const group=(id)=>panel().locator(`[data-shell-row][aria-controls$="-col-${id}"]`).first();
 try{
  const response=await page.goto(`${base}${managerPath}?path=/story/${docsStoryId('index')}&globals=locale:${locale}`);
  if(!response||response.status()!==200)throw new Error('actual Manager home unreadable');
  const iframe=page.locator('#storybook-preview-iframe');await iframe.waitFor();
  await iframe.evaluate(el=>{el.style.width='390px';el.style.maxWidth='390px';});
  const surface=page.frameLocator('#storybook-preview-iframe');
  await surface.locator(`.docs-shell[data-docs-page="index"][lang="${locale}"][data-docs-ready="true"]`).waitFor();
  const frameWidth=await iframe.evaluate(el=>el.contentWindow.innerWidth);
  if(frameWidth!==390)issues.push(`${locale}: Manager preview iframe width is ${frameWidth}, expected 390px`);
  if(await surface.locator('.docs-topics').isVisible())issues.push(`${locale}: Manager desktop topic strip remains visible in narrow preview`);
  const root=surface.locator('.docs-shell').first(),brand=root.locator(':scope > header [data-shell-brand]').first();await brand.tap();
  if(!(await panel().isVisible()))issues.push(`${locale}: real Manager brand tap did not open the mobile Sheet`);
  if(!(await panel().locator('input[type="search"]').isVisible()))issues.push(`${locale}: Manager Sheet lost search at narrow width`);
  if(await panel().locator('.tcrn-shell-menu__crumb--current').getAttribute('href')!==managerMenuHref(managerPath,locale,'index')||await panel().locator('.tcrn-shell-menu__crumb--current').getAttribute('aria-current')!=='page')issues.push(`${locale}: Manager Sheet current page crumb differs`);
  await group('components').tap();
  const rows=panel().locator('[data-shell-row][data-shell-level="2"]:visible');
  const expected=[managerMenuHref(managerPath,locale,'05-actions'),managerMenuHref(managerPath,locale,'06-inputs'),'#'];
  const actual=await rows.evaluateAll(els=>els.map(el=>el.getAttribute('href')));
  if(JSON.stringify(actual)!==JSON.stringify(expected))issues.push(`${locale}: narrow Manager component group routes differ`);
  const branch=panel().locator('[data-shell-row][data-shell-level="2"][aria-controls$="-col-api-branch"]').first();
  if(negative){
   await branch.evaluate(el=>{el.style.pointerEvents='none';});
   try{await branch.tap({timeout:1200});}catch{}
   const blocked=await branch.getAttribute('aria-expanded')!=='true';
   await branch.evaluate(el=>el.style.removeProperty('pointer-events'));
   if(!blocked)issues.push(`${locale}: narrow Manager negative touch mutation did not block API branch`);
   observations.push({kind:'negative-manager-touch-mutation',locale,detected:blocked});
  }
  await branch.tap();
  const contracts=formal??formalApiContracts(readApprovedSource()),routes=await readSheetApiRoutes(panel(),contracts);
  const expectedLeaves=routes.families.flatMap(family=>Object.keys(contracts).filter(name=>contracts[name].board===family.board).map(name=>managerMenuHref(managerPath,locale,'api',`api-${name}`)));
  const expectedDirect=[managerMenuHref(managerPath,locale,'api'),...routes.families.map(()=>'#'),managerMenuHref(managerPath,locale,'api','adopted-support')];
  if(JSON.stringify(routes.leaves)!==JSON.stringify(expectedLeaves)||JSON.stringify(routes.direct)!==JSON.stringify(expectedDirect)||routes.families.some(family=>!family.expanded))issues.push(`${locale}: narrow Manager API family routes differ`);
  await panel().locator(`[data-shell-row][data-shell-level="3"][aria-controls$="-col-api-family-${contracts.Heading.board}"]`).first().tap();
  const heading=panel().locator(`[data-shell-row][data-shell-level="4"][href="${managerMenuHref(managerPath,locale,'api','api-Heading')}"]`).first();
  if(!(await heading.isVisible()))issues.push(`${locale}: narrow Manager API anchor is not reachable`);
  await heading.tap();await waitManagerRoute('api','api-Heading');
  await surface.locator(`.docs-shell[data-docs-page="api"][lang="${locale}"][data-docs-ready="true"]`).waitFor();
  // Manager replaces/reconfigures its preview iframe on story changes; restore the
  // constrained width before reopening the Sheet on the API page.
  await iframe.evaluate(el=>{el.style.width='390px';el.style.maxWidth='390px';});
  await page.waitForFunction(()=>document.querySelector('#storybook-preview-iframe')?.contentWindow?.innerWidth===390);
  if(!(await surface.locator('#api-Heading').isVisible()))issues.push(`${locale}: narrow Manager anchor did not reach the real API section`);
  await surface.locator('.docs-shell > header [data-shell-brand]').first().tap();
  const retiredSource=await readRetiredSourceMenu(panel(),locale);
  if(retiredSource.links||retiredSource.groups||retiredSource.results.some(Boolean))issues.push(`${locale}: retired source appeared in the Manager Sheet`);
  observations.push({kind:'manager-narrow-sheet',locale,iframeWidth:frameWidth,touch:true,apiAnchor:'#api-Heading',apiRoutes:routes,retiredSource});
 }catch(error){issues.push(`${locale}: Manager narrow Sheet proof incomplete: ${error.message}`);}
 return {issues,observations};
}

export async function proveDocsRoutes({root=ROOT,entry='static'}={}){return withPublishedBrowser(async({browser,base,source})=>{
 const issues=[],observations=[],page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[],requests=[],failures=[],formal=formalApiContracts(source);
 const {apiReaderDetails}=await compiled(root,'apps/storybook/dist/approved-api.js');
 page.on('pageerror',error=>errors.push(error.message));page.on('request',r=>requests.push(r.url()));page.on('requestfailed',r=>failures.push({url:r.url(),error:r.failure()?.errorText}));page.on('response',r=>{if(r.status()>=400)failures.push({url:r.url(),status:r.status()});});
 try{
  if(entry==='manager'){
   issues.push(...checkManagerOutput(root).issues);
   for(const locale of LOCALES)try{
    const response=await page.goto(`${base}/index.html?path=/story/${docsStoryId('index')}&globals=locale:${locale}`);if(response.status()!==200)issues.push('Actual manager HTML unreadable');await page.locator('iframe#storybook-preview-iframe').waitFor();
    for (const docsPage of docsPages) {
      const id = docsStoryId(docsPage);
      const link = page.locator(`a[data-item-id="${id}"],a[id="${id}"]`).first();
      try {
        await link.click();
        const frame = page.frameLocator('#storybook-preview-iframe');
        await frame.locator(`[data-docs-page="${docsPage}"][lang="${locale}"][data-docs-ready="true"]`).waitFor();
        if (Object.hasOwn(APPROVED_BOARD_IDS, docsPage)) {
          await frame.locator(`[data-approved-board="${docsPage}"][lang="${locale}"][data-source-id="${APPROVED_BOARD_IDS[docsPage]}"]`).waitFor();
        }
        const sourceUi = await readDocsSourceUi(frame, locale);
        const {terms, ...counts} = sourceUi;
        if (terms.length || Object.values(counts).some(Boolean)) {
          issues.push(`manager-ui/${locale}/${docsPage}: retired source UI ${JSON.stringify(sourceUi)}`);
        }
        observations.push({ entry: 'manager-ui', locale, page: docsPage, id, iframe: await page.locator('iframe#storybook-preview-iframe').getAttribute('src') });
      } catch (error) {
        issues.push(`manager-ui/${locale}/${docsPage}: ${error.message}`);
      }
    }
   }catch(error){issues.push(`manager-ui/${locale}: ${error.message}`);}
  }
  for(const locale of LOCALES){
   for(const id of docsPages){
    try{
     const url=base+docsHref(entry,locale,id);
     const response=await page.goto(url);if(response.status()!==200)issues.push(`${entry}/${locale}/${id} is not readable`);if(APPROVED_BOARD_IDS[id])await page.locator(`[data-approved-board="${id}"]`).waitFor();await page.locator('[data-docs-ready="true"]').waitFor();await page.evaluate(()=>document.fonts.ready);
     const facts=await page.evaluate(()=>({lang:document.querySelector('[data-approved-board]')?.getAttribute('lang')??document.documentElement.lang,source:document.querySelector('[data-published-source]')?.getAttribute('data-published-source'),boards:[...document.querySelectorAll('[data-approved-board]')].map(el=>el.getAttribute('data-approved-board')),boardSource:document.querySelector('[data-approved-board]')?.getAttribute('data-source-id'),apis:[...document.querySelectorAll('[data-approved-api]')].map(el=>({name:el.getAttribute('data-approved-api'),formal:el.querySelector('[data-api-formal]')?.textContent,summary:el.querySelector('[data-api-summary]')?.textContent,summaryLang:el.querySelector('[data-api-summary]')?.lang,example:el.querySelector('[data-api-example]')?.textContent})),main:document.querySelectorAll('main').length,brokenNames:[...document.querySelectorAll('button')].filter(el=>!el.textContent.trim()&&!el.getAttribute('aria-label')).length}));
     if(facts.lang!==locale||facts.source!==source.manifest.site.sourceCommit||facts.boardSource!==APPROVED_BOARD_IDS[id]||facts.main!==1||facts.brokenNames)issues.push(`${entry}/${locale}/${id}: locale/source/main/named-controls drift`);
     const chrome = await page.locator('.docs-shell').evaluate(shell => {
       const strip = shell.querySelector(':scope > [data-shell-strip]');
       const nav = strip.querySelector('.docs-topic-nav');
       const home = nav?.querySelector(':scope > .tcrn-shell-pins__pin > a');
       const topics = [...(nav?.querySelectorAll('.docs-topics [data-pin] > button') ?? [])];
       const menus = [...(nav?.querySelectorAll('.docs-topics__layer') ?? [])];
       const mark = strip.querySelector('[data-shell-brand] svg[data-logo]');
       const rect = mark.getBoundingClientRect();
       const cards = [...shell.querySelectorAll('.portal-card__primary')];
       const homeTrail = shell.querySelector(':scope > [data-paper] .docs-frame > .tcrn-page-header .tcrn-breadcrumb a');
       return {
         home: home?.getAttribute('href'),
         current: home?.getAttribute('aria-current') === 'page' ? [home.getAttribute('href')] : [],
         topicIds: topics.map(button => button.parentElement.getAttribute('data-pin')),
         topicCurrent: topics.filter(button => button.getAttribute('aria-current') === 'true').map(button => button.parentElement.getAttribute('data-pin')),
         triggerSemantics: topics.every(button => button.tagName === 'BUTTON' && !!button.getAttribute('aria-controls') && button.getAttribute('aria-expanded') === 'false' && button.getAttribute('aria-haspopup') === 'dialog' && !!button.querySelector('[data-icon-name="chevron-down"]') && !button.hasAttribute('href')),
         controlsVisible: topics.every(button => {
           const target = document.getElementById(button.getAttribute('aria-controls'));
           return !!target && nav.contains(target) && target.classList.contains('docs-topics__layer');
         }),
         menuHidden: menus.length === 4 && menus.every(menu => menu.hasAttribute('hidden')),
         homeTrail: homeTrail?.getAttribute('href'),
         cards: cards.map(link => link.getAttribute('href')),
         readOnly: shell.querySelectorAll('.portal-glimpse[inert][aria-hidden="true"]').length,
         mark: [rect.width, rect.height],
         hasAccount: !!strip.querySelector('[data-shell-account]'),
       };
     });
     const primaryHrefs = primaryPages.map(page => docsHref(entry, locale, page));
     const currentHrefs = id === 'index' ? [docsHref(entry, locale, 'index')] : [];
     const expectedTopic = Object.keys(topicPages).find(topic => topicPages[topic].includes(id));
     if (chrome.home !== docsHref(entry, locale, 'index') ||
         JSON.stringify(chrome.current) !== JSON.stringify(currentHrefs) ||
         JSON.stringify(chrome.topicIds) !== JSON.stringify(Object.keys(topicPages)) ||
         JSON.stringify(chrome.topicCurrent) !== JSON.stringify(expectedTopic ? [expectedTopic] : []) ||
         !chrome.triggerSemantics || !chrome.controlsVisible || !chrome.menuHidden ||
         chrome.hasAccount || chrome.mark.some(size => size !== 22)) {
       issues.push(`${entry}/${locale}/${id}: actual top band home route, category disclosure, current page, mark or preferences differ`);
     }
     if (id === 'index'
       ? JSON.stringify(chrome.cards) !== JSON.stringify(primaryHrefs.slice(1)) || chrome.readOnly !== 4
       : chrome.homeTrail !== primaryHrefs[0]) {
       issues.push(`${entry}/${locale}/${id}: actual portal cards or home breadcrumb differ`);
     }
     facts.chrome = chrome;
     facts.sourceUi = await readDocsSourceUi(page, locale);
     const {terms, ...counts} = facts.sourceUi;
     if (terms.length || Object.values(counts).some(Boolean)) {
       issues.push(`${entry}/${locale}/${id}: retired source UI ${JSON.stringify(facts.sourceUi)}`);
     }
     const expectedApis=id==='api'?Object.keys(formal):entry==='manager'?Object.keys(formal).filter(name=>formal[name].board===id):[];
     if(JSON.stringify(facts.apis.map(a=>a.name).sort())!==JSON.stringify(expectedApis.sort()))issues.push(`${entry}/${locale}/${id}: emitted API membership differs`);
     for (const api of facts.apis) {
       const contract = formal[api.name];
       if (!contract || api.formal !== apiReaderDetails(api.name, contract.formal) ||
           api.summaryLang !== locale || !api.example?.includes(`<${api.name}`)) {
         issues.push(`${entry}/${locale}/${api.name}: required/use/forbidden/behavior text or concrete example missing`);
       }
     }
     if(APPROVED_BOARD_IDS[id])try{const apiFacts=await apiRuntime(page,id,{browser,url,source,locale});for(const name of Object.keys(formal).filter(name=>formal[name].board===id))issues.push(...apiBehaviorIssues(name,apiFacts[name]).map(issue=>`${entry}/${locale}: ${issue}`));facts.apiRuntime=apiFacts;}catch(error){issues.push(`${entry}/${locale}/${id}: actual API interaction incomplete: ${error.message}`);}
     observations.push({entry,locale,id,...facts});
    }catch(error){issues.push(`${entry}/${locale}/${id}: route incomplete: ${error.message}`);}
   }
   const navigation=await exerciseDocsNavigation(page,{base,entry,locale,source,formal});issues.push(...navigation.issues);observations.push(...navigation.observations);
   if(entry==='static'||entry==='manager'){
    const desktop=await exerciseDocsTopbar(page,{base,entry:entry==='manager'?'manager':entry,locale,managerUi:entry==='manager',formal});
    issues.push(...desktop.issues);observations.push(...desktop.observations);
   }
   if(entry==='manager'){
    const canvas=await exerciseDocsTopbar(page,{base,entry:'canvas',locale,formal});
    issues.push(...canvas.issues);observations.push(...canvas.observations);
    if(locale==='zh-CN'){
     const context=await browser.newContext({viewport:{width:1440,height:1000},hasTouch:true,reducedMotion:'reduce'});
     const narrowPage=await context.newPage();
     try{
      const narrow=await exerciseManagerNarrowSheet(narrowPage,{base,locale,formal});
      issues.push(...narrow.issues);observations.push(...narrow.observations);
     }finally{await context.close();}
    }
   }
   if(locale==='zh-CN'){
    const surfaces=entry==='manager'?[['manager',true],['canvas',false]]:[['static',false]];
    for(const [surface,managerUi] of surfaces){
     const edges=await exerciseDocsTopbarEdges(page,{base,entry:surface,locale,managerUi});
     issues.push(...edges.issues);observations.push(...edges.observations);
    }
   }
   if(entry==='static'){
    const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
    const touchPage=await context.newPage();
    try{
     const touch=await exerciseDocsSheet(touchPage,{base,locale,formal});
     issues.push(...touch.issues);observations.push(...touch.observations);
    }finally{await context.close();}
   }
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
