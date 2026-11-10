import { cssRule, extractMarks, normalizeSvgBody } from "./approved-site-source.mjs";

// These are the eighteen rows of published 07b G, not a replacement gate roster.
export const SHELL_G18 = Object.freeze([
  ["G01","brandGeometry","标按钮几何"],["G02","brandDigest","品牌资产 digest"],
  ["G03","strip","顶带"],["G04","threeEdges","三缘对齐"],
  ["G05","pinSpacing","固定项间距"],["G06","continuation","接续"],
  ["G07","footerCenter","底栏居中"],["G08","wordInkCenter","标旁文字居中"],
  ["G09","cascade","级联"],["G10","noPermanentNav","无收起钮、无常驻侧栏"],
  ["G11","pinJitter","图钉位无抖动"],["G12","decorativeLockup","锁定块只装饰"],
  ["G13","contrast","每格对比度"],["G14","singleLineOverflow","单行与溢出"],
  ["G15","shadowBlur","阴影模糊"],["G16","intro","登入动画"],
  ["G17","focusLoop","焦点回路"],["G18","touch","触摸端"]
].map(([id,key,title])=>Object.freeze({id,key,title,board:"07b-shell-lower",line:84,fixture:id})));
const close=(a,b,tolerance=.5)=>Number.isFinite(a)&&Math.abs(a-b)<=tolerance;
const center=r=>r.y+r.height/2;

// Formal geometry is measured in the same original-size view available to readers.
export async function showOriginalShellSpecimens(surface) {
 const fitted=surface.locator('[data-specimen-view="fit"]');
 await fitted.evaluateAll(frames=>{
  for(const frame of frames)frame.parentElement.querySelector('[data-doc-shell-view-toggle]').click();
 });
 await fitted.first().waitFor({state:'detached'});
}

export async function readShellSpecimenContent(page){
 return page.locator('.docs-shell').evaluate(docs=>{
  const padding=s=>[s.paddingTop,s.paddingRight,s.paddingBottom,s.paddingLeft].map(parseFloat);
  const outer=docs.querySelector(':scope > .docs-paper > main');
  const scenes=[...docs.querySelectorAll('[data-doc-shell-theme] [data-formal-shell-scene], [data-formal-intro] [data-formal-shell-scene]')].filter(frame=>!frame.closest('[data-shared-component-example]')).map(frame=>{
   const shell=frame.querySelector(':scope > .tcrn-product-shell');
   const strip=shell?.querySelector(':scope > [data-shell-strip]');
   const paper=shell?.querySelector(':scope > .tcrn-product-shell__paper');
   const main=paper?.querySelector(':scope > .tcrn-product-shell__main');
   const header=main?.querySelector(':scope > .tcrn-page-header');
   const roster=main?.querySelector(':scope > .tcrn-tabs');
   const tail=roster?.querySelector('tbody tr:last-child');
   const mode=frame.dataset.formalShellScene,theme=frame.dataset.shellTheme;
   if(!strip||!main||!header||!roster||!tail)return {mode,theme,missing:true};

   const shellBox=shell.getBoundingClientRect(),paperBox=paper.getBoundingClientRect();
   const mainBox=main.getBoundingClientRect(),headerBox=header.getBoundingClientRect(),style=getComputedStyle(main);
   const textInset=selector=>{
    const el=main.querySelector(selector);
    if(!el)return null;
    const range=document.createRange();
    range.selectNodeContents(el);
    const box=range.getBoundingClientRect();
    return box.width>0?box.left-paperBox.left:null;
   };
   const textInsets={
    breadcrumb:textInset('.tcrn-breadcrumb__crumb'),
    title:textInset('.tcrn-page-header__title'),
    tab:textInset('.tcrn-tabs__label'),
    column:textInset('.tcrn-doc-roster-table th'),
    name:textInset('.tcrn-doc-roster-name'),
   };
   const headerInset=headerBox.top-mainBox.top,actualGap=roster.getBoundingClientRect().top-headerBox.bottom;
   const scrollTop=main.scrollTop,scrollLeft=frame.scrollLeft;
   let tailInset,tailHeight,maxFrameScroll;
   try{
    main.scrollTop=main.scrollHeight;
    const tailBox=tail.getBoundingClientRect();
    tailInset=mainBox.bottom-tailBox.bottom;
    tailHeight=tailBox.height;
    frame.scrollLeft=frame.scrollWidth;
    maxFrameScroll=frame.scrollLeft;
   }finally{
    main.scrollTop=scrollTop;
    frame.scrollLeft=scrollLeft;
   }
   return {mode,theme,view:frame.dataset.specimenView,phone:frame.hasAttribute('data-phone'),width:shellBox.width,height:shellBox.height,
    stripHeight:strip.getBoundingClientRect().height,paperInset:paperBox.left-shellBox.left,
    paperWidth:paperBox.width,paperHeight:paperBox.height,mainWidth:mainBox.width,mainHeight:mainBox.height,
    paperBackground:getComputedStyle(paper).backgroundColor,mainBackground:style.backgroundColor,
    padding:padding(style),display:style.display,direction:style.flexDirection,gap:parseFloat(style.rowGap),
    headerInset,actualGap,textInsets,tailInset,tailHeight,overflowY:style.overflowY,
    frameWidth:frame.clientWidth,frameScrollWidth:frame.scrollWidth,maxFrameScroll,
    frameOverflow:getComputedStyle(frame).overflowX};
  });
  return {viewport:window.innerWidth,outerPadding:outer?padding(getComputedStyle(outer)):null,scenes};
 });
}

export function shellSpecimenContentIssues(reading,{source,board}){
 const css=source.board(board).css,content=cssRule(css,'.ts-content');
 const desktop=cssRule(css,'.scr'),mobile=cssRule(css,'.scr.ts.m'),shell=cssRule(css,'.scr.ts');
 const height=parseFloat(desktop.height),strip=parseFloat(shell['--strip-h']),edge=parseFloat(shell['--gap']);
 const readPadding=value=>{
  const [top,right=top,bottom=top,left=right]=value.split(/\s+/).map(parseFloat);
  return [top,right,bottom,left];
 };
 const samePadding=(actual,expected)=>actual?.length===4&&expected.every((value,index)=>close(actual[index],value));
 const outer=[],specimens=[];
 const outerExpected=reading.viewport<=750?[12,16,12,16]:[14,28,12,28];
 if(!samePadding(reading.outerPadding,outerExpected))outer.push('Outer docs content padding');

 const modes=board==='07a-shell-upper'?['band','band','menu','drop','phone-closed','phone']:['band','menu','drop','phone-closed','phone'];
 for(const theme of ['light','dark']){
  const actual=reading.scenes.filter(scene=>scene.theme===theme).map(scene=>scene.mode).sort();
  if(JSON.stringify(actual)!==JSON.stringify([...modes].sort()))specimens.push(`Incomplete product specimens ${theme}`);
 }
 for(const scene of reading.scenes){
  const label=`${scene.mode}/${scene.theme}`,phone=scene.mode==='phone'||scene.mode==='phone-closed';
  if(scene.missing){specimens.push(`${label}: missing product content`);continue;}
  const width=parseFloat(phone?mobile.width:desktop.width);
  const padding=readPadding(phone?cssRule(css,'.scr.ts.m .ts-content').padding:content.padding);
  const gap=parseFloat(content.gap);
  const panel=cssRule(css,scene.theme==='dark'?'.gp.night':'.gp')['--panel'];
  const panelRgb=`rgb(${[1,3,5].map(index=>parseInt(panel.slice(index,index+2),16)).join(', ')})`;
  if(scene.view!=='original'||scene.phone!==phone||!close(scene.width,width)||!close(scene.height,height)||
    !close(scene.stripHeight,strip)||!close(scene.paperInset,edge)||!close(scene.paperWidth,width-2*edge)||
    !close(scene.paperHeight,height-strip-edge)||!close(scene.mainWidth,scene.paperWidth)||!close(scene.mainHeight,scene.paperHeight)){
   specimens.push(`${label}: product specimen, strip or paper geometry`);
  }
  if(!samePadding(scene.padding,padding)||!close(scene.headerInset,padding[0]))specimens.push(`${label}: product content padding`);
  if(scene.display!==content.display||scene.direction!==content['flex-direction']||!close(scene.gap,gap)||!close(scene.actualGap,gap))specimens.push(`${label}: product content vertical gap`);
  if(Object.values(scene.textInsets).some(inset=>!close(inset,padding[3])))specimens.push(`${label}: product content text alignment`);
  if(scene.paperBackground!==panelRgb||![panelRgb,'rgba(0, 0, 0, 0)'].includes(scene.mainBackground))specimens.push(`${label}: product content local panel theme`);
  if(!['auto','scroll'].includes(scene.overflowY)||!(scene.tailHeight>0&&scene.tailInset>=padding[2]-.5))specimens.push(`${label}: product content tail is unreachable`);
  if(!close(scene.frameScrollWidth,width)||(scene.frameWidth<width-.5&&
    (!['auto','scroll'].includes(scene.frameOverflow)||!close(scene.maxFrameScroll,scene.frameScrollWidth-scene.frameWidth)))){
   specimens.push(`${label}: product specimen horizontal scrolling`);
  }
 }
 return {outer,specimens};
}

export function shellExpected(source){
  const css=source.board("07b-shell-lower").css,root=cssRule(css,".scr.ts"),brand=cssRule(css,".ts-brand");
  const n=value=>parseFloat(value);
  return {strip:n(root["--strip-h"]),brandW:n(brand.width),brandH:n(root["--tab"]),edge:n(root["--gap"]),gap:n(root["--menu-gap"]),pinGap:n(root["--pin-gap"]),panelW:n(root["--panel-wx"]),dropW:n(root["--drop-w"]),cascadeGap:n(root["--cascade-gap"]),mark:22,toggle:20,glyph:16,pinH:32,pinMax:6,pinButton:24,search:28,touch:44,maxBlur:3,inkTolerance:1,footerTolerance:.5};
}
export async function readShellGeometry(frame){return frame.evaluate(frame=>{
  const shell=frame.querySelector('.tcrn-product-shell');if(!shell)throw new Error('Missing actual ProductShell');
  const box=el=>{if(!el)return null;const r=el.getBoundingClientRect(),s=getComputedStyle(el);return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height,background:s.backgroundColor,borders:[s.borderTopWidth,s.borderRightWidth,s.borderBottomWidth,s.borderLeftWidth].map(parseFloat),shadow:s.boxShadow,radius:parseFloat(s.borderRadius),padding:[s.paddingTop,s.paddingRight,s.paddingBottom,s.paddingLeft].map(parseFloat),paddingBottom:parseFloat(s.paddingBottom),cursor:s.cursor};};
  const visible=el=>!!el?.getClientRects().length&&el.getBoundingClientRect().width>0&&getComputedStyle(el).visibility!=='hidden';
  const q=selector=>shell.querySelector(selector),all=selector=>[...shell.querySelectorAll(selector)];
  const brand=q('[data-shell-brand]'),word=q('.tcrn-shell-brand__word'),mark=brand?.querySelector('[data-logo]');
  // Canvas ink metrics locate the actual glyph top/baseline, not the word's CSS line-box centre.
  let ink=null;if(word&&visible(word)){const r=word.getBoundingClientRect(),s=getComputedStyle(word),ctx=document.createElement('canvas').getContext('2d');ctx.font=`${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;const m=ctx.measureText(word.textContent),lh=parseFloat(s.lineHeight)||r.height,baseline=r.y+parseFloat(s.paddingTop)+(lh-m.fontBoundingBoxAscent-m.fontBoundingBoxDescent)/2+m.fontBoundingBoxAscent;ink={center:baseline+(m.actualBoundingBoxDescent-m.actualBoundingBoxAscent)/2,baseline,ascent:m.actualBoundingBoxAscent,descent:m.actualBoundingBoxDescent,box:box(word)};}
  const rows=all('.tcrn-shell-menu__text,.tcrn-shell-pins__label,.tcrn-page-header__title,.tcrn-breadcrumb__label,.tcrn-shell-menu__crumb,.tcrn-nav-item__label').filter(visible).map(el=>{
    const s=getComputedStyle(el),r=el.getBoundingClientRect(),walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),fragments=[];
    // A range over the whole label also returns nested inline element boxes,
    // whose tops differ from the glyph run on that same line. Read text runs.
    while(walker.nextNode())if(walker.currentNode.textContent.trim()){
      const range=document.createRange();range.selectNodeContents(walker.currentNode);fragments.push(...[...range.getClientRects()].filter(rect=>rect.width>0&&rect.height>0).map(rect=>({top:rect.top,bottom:rect.bottom})));
    }
    const lines=[];for(const fragment of fragments.sort((a,b)=>a.top-b.top)){
      const line=lines.find(line=>Math.min(line.bottom,fragment.bottom)>Math.max(line.top,fragment.top));
      if(line){line.top=Math.min(line.top,fragment.top);line.bottom=Math.max(line.bottom,fragment.bottom);}else lines.push({...fragment});
    }
    const lineCount=lines.length;
    const clips=[];for(let p=el.parentElement;p&&p!==shell.parentElement;p=p.parentElement){const ps=getComputedStyle(p);if(/hidden|clip|auto|scroll/.test(`${ps.overflowX} ${ps.overflowY}`)){const pr=p.getBoundingClientRect();if(r.left<pr.left-.5||r.right>pr.right+.5||(/hidden|clip/.test(ps.overflowY)&&(r.top<pr.top-.5||r.bottom>pr.bottom+.5)))clips.push({className:p.className,rect:box(p)});}}
    return {text:el.textContent,title:el.title,whiteSpace:s.whiteSpace,overflow:s.overflow,textOverflow:s.textOverflow,lineCount,clips,rect:box(el)};
  });
  const lockup=q('.tcrn-shell-menu__lockup'),panel=q('.tcrn-shell-menu__panel'),cluster=q('[data-cluster]');
  // G04 is the visible rightmost control edge, not the flex wrapper's border box.
  // End-aligned wrappers keep that border edge when padding pushes their contents in.
  const clusterControls=cluster?[...cluster.querySelectorAll('button,a,input,select')].filter(visible).map(box):[];
  const clusterContentRight=clusterControls.length?Math.max(...clusterControls.map(r=>r.right)):null;
  return {root:box(shell),brand:box(brand),mark:box(mark),toggle:box(q('[data-shell-toggle]')),glyph:box(q('[data-shell-toggle] svg')),strip:box(q('[data-shell-strip]')),paper:box(q('[data-paper]')),cluster:box(q('[data-cluster]')),ink,
    clusterControls,clusterContentRight,clusterContentInset:clusterContentRight===null?null:box(cluster).right-clusterContentRight,
    pins:all('.tcrn-shell-pins__item').filter(visible).map(box),panel:box(panel),pbar:box(q('[data-shell-pbar]')),crumbs:box(q('.tcrn-shell-menu__crumbs')),lockup:box(lockup),lockupMark:box(lockup?.querySelector('[data-logo]')),
    lockupInteractive:!!lockup&&(lockup.matches('button,a,[tabindex]')||!!lockup.closest('button,a')||!!lockup.querySelector('a,button,input,[tabindex]:not([tabindex="-1"])')),
    drop:box(q('.tcrn-shell-dropdown__panel')),dropRows:all('.tcrn-shell-dropdown__panel [data-shell-row]').filter(visible).map(box),dropText:box(q('.tcrn-shell-dropdown__panel .tcrn-nav-item__label')),dropTrigger:box(q('.tcrn-shell-pins__item[aria-expanded="true"]')),dropSearch:box(q('.tcrn-shell-dropdown__panel input[type="search"]')),dropColumns:all('.tcrn-shell-dropdown__panel,.tcrn-shell-dropdown__col').filter(visible).map(box),cascadeSide:q('[data-shell-dropdown]')?.getAttribute('data-cascade-side')??'end',
    closeControls:all('.tcrn-shell-menu button,.tcrn-shell-dropdown button').filter(el=>el.matches('[data-shell-close],.tcrn-shell-close')||el.querySelector('[data-icon-name="x"]')).length,sidebars:all('.tcrn-side-nav,[data-permanent-sidebar]').length,
    pinButtons:all('[data-pin-button]').filter(visible).map(box),rows,
    navRows:all('.tcrn-nav-item-row').filter(visible).map(row=>{const link=row.querySelector(':scope > .tcrn-nav-item'),pin=row.querySelector(':scope > [data-pin-button]');return {row:box(row),link:box(link),pin:box(pin),pinInset:pin?row.getBoundingClientRect().right-pin.getBoundingClientRect().right:null};}),
    shadows:all('.tcrn-shell-menu__panel,.tcrn-shell-dropdown__panel,.tcrn-shell-dropdown__col,.tcrn-shell-sheet__panel,[data-paper]').filter(visible).map(el=>({className:el.className,value:getComputedStyle(el).boxShadow})),
    assets:all('svg[data-logo]').filter(visible).map(el=>({id:el.getAttribute('data-logo'),body:el.innerHTML})),
    sheet:box(q('[data-panel="sheet"]')),sheetRows:all('.tcrn-shell-sheet [data-shell-row]').filter(visible).map(box),sheetSearch:box(q('.tcrn-shell-sheet input[type="search"]')),sheetPins:all('.tcrn-shell-sheet [data-pin-button]').filter(visible).map(el=>{const s=getComputedStyle(el,'::after');return {...box(el),hitWidth:Math.max(el.getBoundingClientRect().width,parseFloat(s.width)||0),hitHeight:Math.max(el.getBoundingClientRect().height,parseFloat(s.height)||0)};})
  };
});}
// Focus the two real accessible siblings, then read the painted carrier and its
// boundaries. CSS declaration/pair presence alone cannot establish row focus.
export async function readPinnableFocus(page,scope){
 const readings=[];await page.keyboard.press('Tab');
 for(const row of await scope.locator('.tcrn-nav-item-row').all()){
  if(!await row.evaluate(el=>el.getClientRects().length>0&&getComputedStyle(el).visibility!=='hidden'))continue;
  for(const target of ['.tcrn-nav-item','[data-pin-button]']){
  await row.locator(`:scope > ${target}`).focus();
  readings.push(await row.evaluate(row=>{
   const link=row.querySelector(':scope > .tcrn-nav-item'),pin=row.querySelector(':scope > [data-pin-button]'),s=getComputedStyle(row),rect=el=>{const r=el.getBoundingClientRect();return {x:r.x,right:r.right,width:r.width,height:r.height};},probe=document.createElement('span');probe.style.boxShadow='var(--tcrn-focus-ring)';row.append(probe);const expectedFocus=getComputedStyle(probe).boxShadow;probe.remove();
   return {row:rect(row),link:rect(link),pin:rect(pin),pinInset:rect(row).right-rect(pin).right,columns:s.gridTemplateColumns,focused:row.contains(document.activeElement),target:document.activeElement===pin?'pin':'link',shadow:s.boxShadow,expectedFocus,childShadow:getComputedStyle(link).boxShadow,pinShadow:getComputedStyle(pin).boxShadow};
  }));
  }
 }
 return readings;
}
export function rowFocusValid(rows){return rows?.length>0&&rows.every(r=>r.focused&&r.expectedFocus!=='none'&&r.shadow===r.expectedFocus&&r.childShadow==='none'&&r.pinShadow==='none'&&close(r.pinInset,4)&&r.pin.width===24&&r.link.right<=r.pin.x+.5&&r.row.right>=r.pin.right);}
export function shadowBlurs(value){
  if(value==='none')return [];
  // Drop the colour before parsing lengths: colour-channel numbers are not shadow geometry.
  return value.replace(/rgba?\([^)]*\)|#[0-9a-f]+/gi,'').split(',').map(layer=>[...layer.matchAll(/(?:^|\s)(-?\d+(?:\.\d+)?px|-?0)(?=\s|$)/g)].map(m=>parseFloat(m[1]))).filter(lengths=>lengths.length>=2).map(lengths=>lengths[2]??0);
}
export function judgeShellG18(facts,source){
  const e=shellExpected(source),{band:b,menu:m,drop:d,phone:p}=facts;
  const result=Object.fromEntries(SHELL_G18.map(g=>[g.id,[]]));const fail=(id,condition,message)=>{if(!condition)result[id].push(message);};
  if(!b?.brand||!b?.strip||!m?.panel||!m?.pbar||!d?.drop||!p?.sheet){for(const g of SHELL_G18)result[g.id].push('Missing required candidate scene');return result;}
  fail('G01',close(b.brand.x-b.root.x,e.edge)&&close(b.brand.y-b.root.y,6)&&close(b.brand.width,e.brandW)&&close(b.brand.height,e.brandH),'brand (12,6),134×40');
  for(const r of [b.brand,b.cluster,...b.pins])fail('G01',!!r&&close(center(r)-b.root.y,26),'brand/pins/cluster share global Y26');
  fail('G01',close(b.mark?.width,e.mark)&&close(b.mark?.height,e.mark)&&close(b.toggle?.width,e.toggle)&&close(b.glyph?.width,e.glyph),'distinct mark22/toggle20/glyph16');
  fail('G01',b.pins.every(r=>close(r.y-b.root.y,10)&&close(b.strip.bottom-r.bottom,10)),'pin top/bottom whitespace 10/10');
  const mark=extractMarks(source).find(m=>m.productId==='tms');
  for(const asset of [...b.assets,...m.assets,...(facts.intro?.assets??[])])if(asset.id==='tms')fail('G02',normalizeSvgBody(asset.body)===normalizeSvgBody(mark.colorBody),'actual TMS SVG differs from published Brand A');
  fail('G02',(facts.intro?.assets??[]).some(a=>a.id==='tms'),'intro/card actual brand was not observed');
  fail('G02',facts.brandWords?.word==='TCRN'&&facts.brandWords?.suffix==='TMS'&&facts.brandWords?.tagline===mark.taglines[facts.locale??'en'],'lockup wording/tagline differs from Brand E/I');
  fail('G03',close(b.strip.height,e.strip)&&close(b.paper.y-b.root.y,e.strip)&&b.strip.borders.every(v=>v===0)&&/rgba\([^)]*,\s*0\)|transparent/.test(b.strip.background),'strip 0–52 is transparent and borderless; paper top52');
  fail('G03',close(b.root.bottom-b.paper.bottom,e.edge)&&close(b.paper.radius,14),'paper bottom12 and radius14');
  fail('G04',close(b.brand.x,b.paper.x)&&close(m.panel.x-m.root.x,e.edge)&&close(b.clusterContentRight,b.paper.right)&&close(b.clusterContentInset,0)&&close(b.root.right-b.paper.right,e.edge),'brand/paper/menu left12, visible cluster control right=paper right without hidden inset');
  const gaps=b.pins.slice(0,3).map((pin,i)=>pin.x-(i?b.pins[i-1].right:b.brand.right));
  fail('G05',gaps.length===3&&gaps.every(g=>close(g,e.pinGap))&&b.pins.length<=e.pinMax,'three equal8 gaps and <=6 pins');
  fail('G05',b.pins.every(pin=>close(pin.height,e.pinH)&&pin.borders.every(v=>v===0)&&close(center(pin)-(b.root.y+6),20)),'32-high borderless pins, localY20');
  fail('G06',close(m.panel.y-m.brand.bottom,e.gap)&&close(m.panel.width,e.panelW),'menu continuation6 and width952');
  fail('G06',!!d.drop&&!!d.dropTrigger&&close(d.drop.y-d.dropTrigger.bottom,e.gap)&&close(d.drop.x,d.dropTrigger.x)&&close(d.drop.width,e.dropW)&&close(d.dropSearch?.height,e.search),'drop aligned with trigger +6, width240/search28');
  fail('G06',d.drop.padding?.every(v=>close(v,6))&&d.dropRows?.length>0&&d.dropRows.every(r=>close(r.height,32))&&close(d.dropText?.x-d.drop.x,16),'drop padding6, row32, text start16');
  // Published v2 describes this ratio only for its Chinese specimen; other locales retain natural trigger widths.
  if(facts.locale==='zh-CN'&&d.drop&&d.dropTrigger)fail('G06',d.drop.width/d.dropTrigger.width>=3&&d.drop.width/d.dropTrigger.width<=4,'Chinese specimen drop width is 3–4 times trigger width');
  fail('G07',close(m.panel.bottom-m.pbar.y,52),'footer extent52 including bottom padding');
  // The painted divider is centred in its top border. Its outer border-box edge
  // is half a pixel away for the actual 1px rule; the ±0.5 contract stays intact.
  const dividerY=m.pbar.y+m.pbar.borders[0]/2;
  for(const r of [m.lockup,m.crumbs])fail('G07',!!r&&close(r.y-dividerY,m.panel.bottom-r.bottom,e.footerTolerance),'footer contents centred across divider→panel bottom');
  fail('G07',!!m.lockup&&close(m.panel.right-m.lockup.right,16),'lockup right inset16');
  fail('G08',!!b.ink&&close(b.ink.center,center(b.mark),e.inkTolerance),'actual word glyph ink centre matches mark ±1');
  fail('G08',close(b.brand.y+ b.brand.height/2,center(b.mark)),'mark/text assembly centred within brand band');
  fail('G09',d.dropColumns.length>=2,'real click-driven cascade column missing');
  for(let i=1;i<d.dropColumns.length;i++){const prev=d.dropColumns[i-1],col=d.dropColumns[i];fail('G09',close(col.height,prev.height)&&close(col.width,prev.width)&&close(d.cascadeSide==='start'?prev.x-col.right:col.x-prev.right,e.cascadeGap),'cascade same width/height, adjacent gap4');}
  fail('G09',facts.cascadeClick===true&&facts.cascadeHover===false,'cascade opens by click, not hover');
  fail('G10',[b,m,d,p].every(r=>!r.sidebars&&!r.closeControls)&&facts.outsideClosed===true,'no close button/permanent sidebar; outside click closes');
  fail('G11',m.navRows?.length>0&&m.navRows.every(r=>close(r.pin?.width,24)&&close(r.pinInset,4)&&r.link?.right<=r.pin?.x+.5),'actual row/link/pin boundaries preserve24px slot and trailing4px inset');
  fail('G11',facts.jitter?.length>0&&facts.jitter.every(j=>close(j.rest,j.hover,0)&&close(j.button,e.pinButton)),'same-row rest/hover text widths equal; button24');
  fail('G12',!m.lockupInteractive&&close(m.lockupMark?.width,e.mark)&&m.lockup?.cursor!=='pointer'&&facts.lockupHoverSame===true&&facts.lockupTabSkipped===true,'lockup decorative, not focusable/hoverable, mark22');
  fail('G13',facts.matrix?.sourceOccurrences===225&&facts.matrix?.observations.length===225,'all225 shell occurrences retain independent readings');
  for(const reading of facts.matrix?.observations??[])fail('G13',reading.ok,`source occurrence ${reading.key}: ${reading.reason??'contrast/source mismatch'}`);
  for(const row of [...b.rows,...m.rows,...d.rows,...p.rows])fail('G14',row.lineCount<=1&&row.whiteSpace==='nowrap'&&!row.clips.length,`single line/clip: ${row.text}`);
  for(const row of [...b.shadows,...m.shadows,...d.shadows,...p.shadows])fail('G15',shadowBlurs(row.value).every(v=>v<=e.maxBlur),`shadow blur >3: ${row.className}`);
  fail('G15',p.shadows.some(row=>row.className.split(/\s+/).includes('tcrn-shell-sheet__panel')&&row.value===p.sheet.shadow)&&shadowBlurs(p.sheet.shadow).length>0&&shadowBlurs(p.sheet.shadow).every(v=>v<=e.maxBlur),'actual phone Sheet shadow carrier missing or blur >3');
  const intro=facts.intro;fail('G16',!!intro&&intro.first>0&&intro.refresh===0&&intro.reduced===0&&intro.total===460&&intro.total<=700&&intro.plan?.card===120&&intro.plan?.mark===240&&intro.plan?.paper===100&&intro.landingMatches===true&&intro.markOpaque===true&&intro.properties.every(p=>['opacity','transform'].includes(p))&&intro.frames.length>1,'intro once/session, refresh0, reduced0, <=700, actual frames/transform+opacity');
  fail('G17',rowFocusValid(facts.focus?.rows),'actual keyboard focus paints the whole row including its sibling pin slot');
  fail('G17',facts.focus?.escapeRestored===true&&facts.focus?.shortcutSearch===true&&facts.focus?.rightEntered===true&&facts.focus?.leftReturned===true,'Esc/shortcut and real cascade arrow focus loop');
  fail('G18',close(p.root.width,390)&&p.brand.height>=40&&p.brand.width>=40&&p.pins.length===0&&!!p.sheet&&p.sheetRows.length>0&&p.sheetRows.every(r=>close(r.height,e.touch))&&close(p.sheetSearch?.height,e.touch)&&p.sheetPins.length>0&&p.sheetPins.every(r=>r.hitHeight>=e.touch&&r.hitWidth>=e.touch)&&facts.touchClickable===true,'390: tappable brand, no top pins, Sheet search/rows/pin targets44');
  return result;
}

// Each fixture mutates an actual local candidate DOM/behavior. No expected reading is rewritten.
export const SHELL_G18_FIXTURES=Object.freeze({
 G01:{css:'[data-shell-brand]{top:0!important;transform:translateY(-6px)!important}'},
 G02:{mutate:'asset'}, G03:{css:'[data-shell-strip]{border-bottom:1px solid red!important}'},
 G04:{css:'[data-cluster]{padding-right:8px!important}'},
 G05:{css:'.tcrn-shell-pins__item{border-left:1px solid red!important}'},
 G06:{css:'.tcrn-shell-menu{top:60px!important}'},
 G07:{css:'.tcrn-shell-menu__panel{padding-bottom:16px!important}'},
 G08:{css:'.tcrn-shell-brand__word{padding-top:4px!important}'},
 G09:{css:'.tcrn-shell-dropdown__col{height:auto!important;align-self:start!important;min-height:10px!important;max-height:20px!important}'},
 G10:{mutate:'close'},
 G11:{css:'.tcrn-nav-item-row{grid-template-columns:minmax(0,1fr)!important}.tcrn-nav-item-row:hover{grid-template-columns:minmax(0,1fr)24px!important}[data-pin-button]{display:none!important}.tcrn-nav-item-row:hover [data-pin-button]{display:inline-flex!important}'},
 G12:{mutate:'lockup'},
 G13:{css:'.tcrn-shell-brand__word{color:transparent!important}'},
 G14:{mutate:'long-label',css:'.tcrn-shell-menu__text{white-space:normal!important;overflow:visible!important;max-width:6ch!important}'},
 G15:{css:'.tcrn-shell-sheet__panel{box-shadow:0 0 12px black!important}'},
 G16:{mutate:'session'}, G17:{mutate:'focus',css:'.tcrn-nav-item-row{box-shadow:none!important}.tcrn-nav-item:focus{box-shadow:var(--tcrn-focus-ring)!important}'},
 G18:{css:'.tcrn-shell-sheet [data-shell-row]{height:32px!important;min-height:32px!important;block-size:32px!important}'}
});
export async function installShellFixture(page,id){
 const fixture=SHELL_G18_FIXTURES[id];if(!fixture)throw new Error(`Unknown G18 fixture ${id}`);
 await page.evaluate(({id,fixture})=>{
  if(fixture.css){const style=document.createElement('style');style.id=`fixture-${id}`;style.textContent=fixture.css;document.head.append(style);}
  const frames=[...document.querySelectorAll('[data-formal-shell-scene]')];
  for(const frame of frames){
   if(fixture.mutate==='asset'){const p=frame.querySelector('[data-shell-brand] svg path');if(p)p.setAttribute('d',`${p.getAttribute('d')} M0 0L1 1`);}
   if(fixture.mutate==='close'){const b=document.createElement('button');b.dataset.shellClose='';b.textContent='×';frame.querySelector('.tcrn-shell-menu__panel')?.append(b);}
   if(fixture.mutate==='lockup'){const l=frame.querySelector('.tcrn-shell-menu__lockup');if(l){l.tabIndex=0;l.setAttribute('role','button');l.style.cursor='pointer';}}
   if(fixture.mutate==='long-label')frame.querySelector('.tcrn-shell-menu__text')?.append(' Long label with forty additional characters to expose wrapping');
  }
  if(fixture.mutate==='focus'){const focus=HTMLElement.prototype.focus;HTMLElement.prototype.focus=function(...args){if(this.matches('[data-shell-brand]'))return;return focus.apply(this,args);};}
 },{id,fixture});
}

export async function installIntroRecorder(page,{forgetSession=false}={}){
 await page.addInitScript(({forgetSession})=>{
  window.__publishedIntro={animations:[],frames:[],assets:[]};
  if(forgetSession){const get=Storage.prototype.getItem,set=Storage.prototype.setItem;Storage.prototype.getItem=function(key){return key==='tcrn-approved-source-intro'?null:get.call(this,key);};Storage.prototype.setItem=function(key,value){if(key!=='tcrn-approved-source-intro')set.call(this,key,value);};}
  const animate=Element.prototype.animate;
  Element.prototype.animate=function(keyframes,timing){
   if(this.closest('[data-formal-intro]')){
    window.__publishedIntro.animations.push({target:this.className?.baseVal??this.className,keyframes,timing});
    const svg=this.matches('svg[data-logo]')?this:this.querySelector('svg[data-logo]');if(svg)window.__publishedIntro.assets.push({id:svg.getAttribute('data-logo'),body:svg.innerHTML});
    const target=this;let left=35;const frame=()=>{if(!target.isConnected||left--<=0)return;const s=getComputedStyle(target);const r=target.getBoundingClientRect();window.__publishedIntro.frames.push({time:performance.now(),target:target.className?.baseVal??target.className,transform:s.transform,opacity:s.opacity,rect:{x:r.x,y:r.y,width:r.width,height:r.height}});requestAnimationFrame(frame);};requestAnimationFrame(frame);
   }
   return animate.call(this,keyframes,timing);
  };
 },{forgetSession});
}
export async function readIntro(page,url,{theme="light",original=true}={}){
 const scope=()=>page.locator(`[data-formal-intro][data-intro-theme="${theme}"]`);
 const ready=async()=>{
  await page.locator('[data-docs-ready="true"]').waitFor();
  if(original)await showOriginalShellSpecimens(scope());
  await page.evaluate(async()=>{document.documentElement.getBoundingClientRect();await document.fonts.ready;});
 };
 const start=async()=>{await ready();const button=scope().locator(':scope > .tcrn-button');await button.click();await page.waitForFunction(()=>!document.querySelector('[data-shell-intro]'));return page.evaluate(async()=>{document.documentElement.getBoundingClientRect();await document.fonts.ready;return window.__publishedIntro;});};
 await page.goto(url);await ready();await page.evaluate(()=>{sessionStorage.removeItem('tcrn-approved-source-intro');return document.fonts.ready;});
 await scope().locator(':scope > .tcrn-button').scrollIntoViewIfNeeded();
 const landing=await scope().locator('[data-shell-brand] svg[data-logo]').evaluate(el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};});
 const first=await start();await page.reload();const refresh=await start();await page.emulateMedia({reducedMotion:'reduce'});await page.reload();const reduced=await start();await page.emulateMedia({reducedMotion:'no-preference'});
 const markFrames=first.frames.filter(f=>String(f.target).includes('tcrn-shell-intro__mark')),last=markFrames.at(-1)?.rect;const duration=target=>first.animations.find(a=>String(a.target).includes(target))?.timing.duration;
 return {first:first.animations.length,refresh:refresh.animations.length,reduced:reduced.animations.length,plan:{card:duration('tcrn-shell-intro__card'),mark:duration('tcrn-shell-intro__mark'),paper:duration('tcrn-product-shell__paper')},landing,last,landingMatches:!!last&&['x','y','width','height'].every(k=>close(last[k],landing[k])),markOpaque:markFrames.length>1&&markFrames.every(f=>Number(f.opacity)===1),frames:first.frames,assets:first.assets,total:Math.max(0,...first.animations.map(a=>(a.timing.delay??0)+a.timing.duration)),properties:[...new Set(first.animations.flatMap(a=>a.keyframes.flatMap(f=>Object.keys(f))))],animations:first.animations};
}
export async function collectShellG18(page,source,{matrix,intro,fixture,locale="en",theme="light"}={}){
 const scope=scene=>page.locator(`[data-formal-shell-scene="${scene}"][data-shell-theme="${theme}"]`).first();
 const band=scope('band'),menu=scope('menu'),drop=scope('drop'),phone=scope('phone');
 if(fixture)await installShellFixture(page,fixture);
 const facts={locale,theme,matrix,intro};
 facts.band=await readShellGeometry(band);facts.menu=await readShellGeometry(menu);facts.drop=await readShellGeometry(drop);facts.phone=await readShellGeometry(phone);
 // Pin jitter compares the same actual text box, before and during pointer hover.
 facts.jitter=[];
 for(const row of await menu.locator('.tcrn-nav-item-row').all()){
  const label=row.locator('.tcrn-nav-item__label').first(),pin=row.locator('[data-pin-button]').first();
  if(!await label.isVisible()||!await pin.count())continue;
  await page.mouse.move(0,0);const rest=(await label.boundingBox()).width;await row.hover();const hover=(await label.boundingBox()).width;
  facts.jitter.push({rest,hover,button:await pin.evaluate(el=>el.getBoundingClientRect().width)});
 }
 // Later clicks/Escape deliberately dismiss independent transient specimens.
 // Measure this menu's real row focus while that actual menu is still open.
 const focusRows=await readPinnableFocus(page,menu);
 const lockup=menu.locator('.tcrn-shell-menu__lockup');
 const paint=()=>lockup.evaluate(el=>{const s=getComputedStyle(el);return {background:s.backgroundColor,color:s.color,shadow:s.boxShadow,cursor:s.cursor};});
 await lockup.scrollIntoViewIfNeeded();await page.mouse.move(0,0);const resting=await paint(),lockupBox=await lockup.boundingBox();
 if(!lockupBox)throw new Error('Missing rendered decorative lockup region');
 // The decorative lockup deliberately has pointer-events:none. Place the real
 // pointer over its region without requiring it to become an interactive hit target.
 await page.mouse.move(lockupBox.x+lockupBox.width/2,lockupBox.y+lockupBox.height/2);
 facts.lockupHoverSame=JSON.stringify(await paint())===JSON.stringify(resting);
 const search=menu.locator('input[type="search"]').first();await search.focus();let exited=false,visited=false;
 for(let i=0;i<100;i++){await page.keyboard.press('Tab');const state=await menu.evaluate(el=>({inside:el.contains(document.activeElement),lockup:!!document.activeElement?.closest('.tcrn-shell-menu__lockup')}));visited||=state.lockup;if(!state.inside){exited=true;break;}}
 facts.lockupTabSkipped=!visited&&exited;
 facts.brandWords=await lockup.evaluate(el=>({word:el.querySelector('.tcrn-product-logo__line-one-base')?.textContent,suffix:el.querySelector('.tcrn-product-logo__line-one-suffix')?.textContent,tagline:el.querySelector('.tcrn-product-logo__line-two')?.textContent}));
 if(await drop.locator('.tcrn-shell-dropdown__panel').count()===0)await drop.locator('[data-pin="contracts"] .tcrn-shell-pins__item').click();
 const opener=drop.locator('.tcrn-shell-dropdown__panel [data-shell-row][aria-expanded]').first();
 if(await opener.getAttribute('aria-expanded')==='true')await opener.click();
 const columns=()=>drop.locator('.tcrn-shell-dropdown__col').count();const closed=await columns();await opener.hover();facts.cascadeHover=(await columns())>closed;
 await opener.click();facts.cascadeClick=(await columns())>closed;await opener.focus();await page.keyboard.press('ArrowRight');const rightEntered=await drop.locator('.tcrn-shell-dropdown__col').first().evaluate(el=>el.contains(document.activeElement));
 facts.drop=await readShellGeometry(drop);
 await page.keyboard.press('ArrowLeft');const leftReturned=await opener.evaluate(el=>el===document.activeElement);
 const trigger=band.locator('[data-shell-brand]');await trigger.click();await page.keyboard.press('Escape');const escapeRestored=await trigger.evaluate(el=>el===document.activeElement);
 await trigger.click();await band.locator('[data-paper]').click({position:{x:40,y:500}});facts.outsideClosed=await band.locator('[data-panel="expanded"]').count()===0;
 // The document's owning shell handles the shortcut. Its target is measured separately from
 // the specimen instance, which intentionally disables a duplicate global listener.
 const owner=page.locator('.tcrn-product-shell').first();await page.keyboard.press('Control+k');const shortcutSearch=await owner.locator(':scope > .tcrn-shell-menu input[type="search"]').first().evaluate(el=>el===document.activeElement).catch(()=>false);await page.keyboard.press('Escape');
 facts.focus={escapeRestored,shortcutSearch,rightEntered,leftReturned,rows:focusRows};
 const phoneTrigger=phone.locator('[data-shell-brand]');if(await phoneTrigger.getAttribute('aria-expanded')==='true')await phoneTrigger.click();await phoneTrigger.click();facts.touchClickable=await phone.locator('[data-panel="sheet"]').count()===1;facts.phone=await readShellGeometry(phone);
 return facts;
}
