import { readApprovedSource,extractMarks,sourceElements,decodeHtml,cssRule } from "./approved-site-source.mjs";
import { readPinnableFocus,rowFocusValid } from "./published-shell-gates.mjs";
// Runtime assertions are separate from the normative API text and from engineering exports.
export const API_BEHAVIOR_REQUIREMENTS=Object.freeze({
 Heading:['semanticLevels','visualFamilies','singleLineTitle'],Text:['bodyScale','numeralCaps','strongSample'],Highlight:['markOnlyPaint','emptyQuery'],Icon:['rosterGeometry','namesAndDecoration'],ProductLogo:['registeredGraphicOnly','renditions'],ProductLockup:['registeredWording','railAndFirstLine','exactLineRoles'],Button:['disabledDescription','loadingFeedback','dangerInk'],IconButton:['named','squareAndLabelled','allPublishedSizes'],LinkButton:['nativeAnchor','noBusyOrDisabled'],ClipboardCopyButton:['secretOutsideDom','fiveStatesAndReset'],ButtonGroup:['namedGroup','twoToFive','allPublishedSizes','childSelection'],Input:['nativeNamed','errorsAndReasons'],Textarea:['nativeNamed','widthAndMultiline'],SearchInput:['namedTool','shortcutAndFill'],SuggestInput:['openDomain','deduplicatedDatalist'],Select:['nativeClosedSingle','placeholderDisabled'],MultiSelect:['closedSetPresentations','bodyListbox','selectionAndLabels'],NumberInput:['nativeNumber','rangeAndKeyboard','twelveChMinimum'],DatePicker:['nativeIso','calendarIndicator'],Checkbox:['nativeNamed','mixedAndError'],RadioGroup:['nativeLegendAndName','oneChoicePerGroup'],Switch:['namedImmediateBinary','descriptionAssociated'],ProductShell:['oneTopBand','headerAndPreferences','contextualHeader'],ShellBrandButton:['onePressFullDialog','namedRegisteredVersions','localizedNames'],ShellMenu:['nonModalAndDismiss','globalSearchAndKeys','rowCarrierStates'],ShellPins:['orderedReorder','sixAndResponsive'],ShellDropdown:['subtreeSearch','clickAndKeys'],ShellIntro:['mountedAfterSignIn','sessionMotionContract']
});
export function apiBehaviorIssues(name,facts){return (API_BEHAVIOR_REQUIREMENTS[name]??['unknownAPI']).filter(key=>facts?.[key]!==true).map(key=>`${name}: published API behavior ${key} not established`);}
// The actual described messages, including the primary specimen, must carry 06's
// scoped error role. A correct source-matrix probe cannot replace these observations.
function scopedRoleInk(source,theme,role){
 const tokens=cssRule(source.board('01-tokens').css,theme==='dark'?'.gp.night':'.gp'),raw=tokens[/var\((--[a-z0-9-]+)\)/.exec(role.color)?.[1]],hex=/^#([a-f0-9]{6})$/i.exec(raw??'');
 return hex?`rgb(${[0,2,4].map(at=>parseInt(hex[1].slice(at,at+2),16)).join(', ')})`:null;
}
function singleLineRoleValid(text,role){
 return !!text?.text?.trim()&&text.whiteSpace===role['white-space']&&text.overflowX===role.overflow&&text.overflowY===role.overflow&&text.textOverflow===role['text-overflow']&&text.display==='block'&&text.minWidth==='0px'&&[text.width,text.height,text.availableWidth,text.clientWidth,text.scrollWidth].every(Number.isFinite)&&text.width>0&&text.clientWidth>0&&text.scrollWidth>=text.clientWidth&&text.width<=text.availableWidth+1&&text.height<=parseFloat(role['line-height'])+.5;
}
export function describedErrorRoleIssues(rows,{source=readApprovedSource()}={}){
 const issues=[],role=cssRule(source.board('06-inputs').css,'.fld>.err');
 if(!rows?.length)return ['Missing actual described error messages'];
 for(const theme of ['light','dark'])for(const state of ['error','error-focus'])if(!rows.some(r=>r.primary&&r.theme===theme&&r.state===state))issues.push(`Missing primary described error ${theme}/${state}`);
 for(const row of rows){
  const ink=scopedRoleInk(source,row.theme,role);
  const valid=row.invalid===true&&row.messages?.some(message=>message.text?.trim()&&message.id&&message.unique&&row.describedIds?.includes(message.id)&&(!row.primary||message.primary)&&ink!==null&&message.color===ink&&message.fontSize===role['font-size']&&message.lineHeight===role['line-height']&&message.gap===role.gap&&message.display===role.display&&message.alignItems===role['align-items']&&message.minWidth==='0px'&&message.textCarrier?.direct&&message.textCarrier.text===message.text&&Number(message.textCarrier.flexShrink)>0&&singleLineRoleValid(message.textCarrier,role)&&(!row.primary||message.icons?.some(icon=>icon.name==='alert-triangle'&&icon.hidden&&icon.width===14&&icon.flexShrink==='0')));
  if(!valid)issues.push(`Input actual described error role ${row.theme}/${row.state??'matrix'}: bad ink/11.5px/16px/gap5/icon, native association or actual single-line text carrier missing`);
 }
 return issues;
}
export function hintRoleIssues(rows,{source=readApprovedSource()}={}){
 const role=cssRule(source.board('06-inputs').css,'.fld>.hint'),issues=[];
 for(const theme of ['light','dark'])if(!rows?.some(row=>row.theme===theme))issues.push(`Missing actual hint ${theme}`);
 for(const row of rows??[])if(row.color!==scopedRoleInk(source,row.theme,role)||row.fontSize!==role['font-size']||row.lineHeight!==role['line-height']||!singleLineRoleValid(row,role))issues.push(`Input actual hint role ${row.theme}: ink-3/11.5px/16px or single-line text carrier missing`);
 return issues;
}
// Counts come from native direct action controls. Decorative separators never
// contribute to the formal two-to-five action boundary.
export function buttonGroupIssues(rows){
 const issues=[];
 if(!rows.length)issues.push('Missing actual ButtonGroup');
 for(const row of rows){
  if(row.actions.length<2||row.actions.length>5)issues.push('ButtonGroup requires two to five actions');
  if(row.otherChildren||row.actions.some(a=>a.tag!=='BUTTON'||!a.family))issues.push('ButtonGroup allows only direct Button/IconButton actions');
  if(row.separators!==row.actions.length-1||row.childCount!==row.actions.length+row.separators)issues.push('ButtonGroup decorative separator structure');
  if(!['sm','md','lg'].includes(row.size)||row.actions.some(a=>a.size!==row.size||a.variant!==row.variant))issues.push('ButtonGroup uniform family size/variant');
 }
 return issues;
}
export function rowCarrierIssues(rows){
 const issues=[];
 if(!rows.length)issues.push('Missing actual pinnable row');
 for(const r of rows){
  if(r.ink!==r.expectedInk||r.fill!==r.expectedFill||r.childFill!=='rgba(0, 0, 0, 0)'||r.weight!==(r.state==='selected'?'600':'500'))issues.push('Row single wash/ink/weight carrier');
  if(![r.row?.right,r.link?.right,r.pin?.right,r.pin?.width,r.pinInset].every(Number.isFinite)||r.pin.width!==24||Math.abs(r.pinInset-4)>.5||r.link.right>r.pin.x+.5||!r.columns.endsWith('24px'))issues.push('Row sibling pin slot/trailing4px inset');
  if(r.focused&&(!r.expectedFocus||r.shadow!==r.expectedFocus||r.childShadow!=='none'||r.pinShadow!=='none'||r.row.right<r.pin.right))issues.push('Full-row focus carrier must include link and pin');
 }
 return issues;
}
// Expected line roles come from the actual 04 full/rail nodes; translated taglines from 04 I.
export function formalLockupExpectations(source,locale){
 const html=source.board('04-brand').html,marks=extractMarks(source),nodes=sourceElements(html);
 const descendants=node=>node.children.flatMap(child=>[child,...descendants(child)]);
 const text=node=>node?decodeHtml(html.slice(html.indexOf('>',node.offset)+1,html.indexOf(`</${node.tag}>`,node.offset)).replace(/<[^>]*>/g,'')).replace(/\s+/g,' ').trim():null;
 const has=(node,name)=>(node.attrs.class??'').split(/\s+/).includes(name);
 return nodes.filter(node=>has(node,'lk')||has(node,'rail')).map(node=>{
  const children=descendants(node),mark=marks.find(mark=>mark.id===children.find(child=>child.tag==='svg')?.attrs['data-logo']);
  if(!mark)throw new Error('Unbound formal lockup product');
  return {productId:mark.productId,scale:has(node,'rail')?'rail':'lockup',name:text(children.find(child=>child.tag==='b')),tagline:mark.taglines[locale],byline:text(children.find(child=>has(child,'by')))};
 });
}
export function lockupRoleIssues(readings,expected){
 const issues=[];
 for(const row of readings){
  const e=expected.find(e=>e.productId===row.productId&&e.scale===(row.firstLine||row.scale));
  if(!e||row.name!==e.name||row.byline!==(row.firstLine?null:e.byline)||row.tagline!==(row.firstLine?null:e.tagline)||row.accessibleName!==(row.firstLine?e.name:`${e.name} ${e.tagline}`))issues.push(`ProductLockup exact line roles ${row.productId}/${row.firstLine||row.scale}`);
 }
 for(const e of expected)if(!readings.some(r=>r.productId===e.productId&&r.scale===e.scale&&!r.firstLine))issues.push(`Missing actual ${e.productId}/${e.scale} lockup`);
 return issues;
}
// The accessible-copy contract names the action and registered product, in the requested
// reader locale. It must also hold when the manager's document-root language is different.
export const SHELL_BRAND_NAMES=Object.freeze({'zh-CN':['展开导航','收起导航'],en:['Open navigation','Close navigation'],ja:['ナビゲーションを開く','ナビゲーションを閉じる'],ko:['내비게이션 열기','내비게이션 닫기'],fr:['Ouvrir la navigation','Fermer la navigation']});
export function shellBrandNameIssues(readings,locale){return readings.filter(r=>r.label!==`${SHELL_BRAND_NAMES[locale]?.[r.expanded?1:0]} · ${r.product}`).map(r=>`ShellBrandButton locale ${locale}/${r.version}/${r.expanded}: ${r.label}`);}
export async function readApiFacts(page,{source=readApprovedSource(),locale='en'}={}){const facts=await page.locator('[data-approved-board]').first().evaluate(root=>{
 const one=s=>root.querySelector(s),all=s=>[...root.querySelectorAll(s)],style=el=>el?getComputedStyle(el):null;
 const named=el=>!!(el.getAttribute('aria-label')?.trim()||el.labels?.length);
 const color=(el,value)=>{const probe=document.createElement('span');probe.style.color=value;el.append(probe);const result=getComputedStyle(probe).color;probe.remove();return result;};
 const descriptions=el=>(el.getAttribute('aria-describedby')??'').split(/\s+/).filter(Boolean).map(id=>document.getElementById(id));
 const reasons=s=>all(s).filter(el=>el.disabled).every(el=>el.getAttribute('data-disabled-reason')&&descriptions(el).some(d=>d?.textContent.trim()));
 const textReading=(el,parent)=>{
  const s=style(el),p=style(parent),rect=el.getBoundingClientRect(),siblings=[...parent.children].filter(child=>child!==el),row=p.display==='flex'&&p.flexDirection.startsWith('row');
  const availableWidth=parent.clientWidth-parseFloat(p.paddingLeft)-parseFloat(p.paddingRight)-(row?siblings.reduce((sum,child)=>sum+child.getBoundingClientRect().width,0)+(parseFloat(p.columnGap)||0)*siblings.length:0);
  return {text:el.textContent,color:s.color,fontSize:s.fontSize,lineHeight:s.lineHeight,whiteSpace:s.whiteSpace,overflowX:s.overflowX,overflowY:s.overflowY,textOverflow:s.textOverflow,display:s.display,minWidth:s.minWidth,flexShrink:s.flexShrink,width:rect.width,height:rect.height,availableWidth,clientWidth:el.clientWidth,scrollWidth:el.scrollWidth};
 };
 const facts={};
 if(root.dataset.approvedBoard==='02-typography'){
  const headings=all('[data-formal-role] .tcrn-heading,.tcrn-heading').filter(el=>el.closest('[data-tcrn-theme]'));
  facts.Heading={semanticLevels:[1,2,3,4].every(n=>headings.some(el=>el.tagName===`H${n}`)),visualFamilies:headings.every(el=>{const s=style(el),four=el.classList.contains('tcrn-heading--4');return s.fontFamily.includes(four?'Hanken Grotesk':'Source Serif 4')&&s.fontWeight===(four?'600':'400');}),singleLineTitle:headings.every(el=>style(el).whiteSpace==='nowrap'&&style(el).textOverflow==='ellipsis'&&!!el.title)};
  const body=one('[data-formal-role="body"]'),strong=one('.tcrn-text--strong');
  facts.Text={bodyScale:!!body&&style(body).fontSize==='13px'&&style(body).lineHeight==='20px',numeralCaps:!!one('.tcrn-text--numeral small')&&!!one('.tcrn-text--caps'),strongSample:!!strong&&style(strong).fontWeight==='600'&&style(strong).color===color(strong.closest('[data-tcrn-theme]'),'var(--tcrn-color-ink)')};
  // Compare with an otherwise identical unmarked text node; DOM measurements catch padding,
  // font or letter-spacing changes that a nonempty props list cannot establish.
  const mark=one('.tcrn-highlight__mark'),parent=mark?.parentElement;
  let markOnlyPaint=false;if(mark&&parent){const m=style(mark),p=style(parent);markOnlyPaint=['fontFamily','fontSize','fontWeight','letterSpacing','lineHeight'].every(k=>m[k]===p[k])&&['paddingTop','paddingBottom','paddingLeft','paddingRight'].every(k=>parseFloat(m[k])===0);}
  facts.Highlight={markOnlyPaint,emptyQuery:!!one('[data-highlight-empty]')&&!one('[data-highlight-empty] mark')};
 }
 if(root.dataset.approvedBoard==='03-icons'){
  const icons=all('[data-formal-icon] svg'),namedIcons=icons.filter(el=>el.getAttribute('role')==='img'),decorative=one('.tcrn-icon-button svg');
  facts.Icon={rosterGeometry:all('[data-formal-theme]').every(theme=>theme.querySelectorAll('[data-formal-icon] svg').length===38*3)&&icons.length>0&&icons.every(el=>el.getAttribute('viewBox')==='0 0 20 20'&&el.getAttribute('stroke-width')==='1.25'&&[14,16,20].includes(Number(el.getAttribute('width')))&&[...el.querySelectorAll('path,circle,rect,ellipse')].every(p=>p.getAttribute('vector-effect')==='non-scaling-stroke')),namesAndDecoration:namedIcons.length>0&&namedIcons.every(el=>el.querySelector('title')||el.getAttribute('aria-label'))&&decorative?.getAttribute('aria-hidden')==='true'};
 }
 if(root.dataset.approvedBoard==='04-brand'){
  const products=['tms','einzbern','mana-orchestrate','design-system'],graphics=all('.tcrn-product-symbol');
  facts.ProductLogo={registeredGraphicOnly:products.every(id=>graphics.some(el=>el.getAttribute('data-product-id')===id&&!el.textContent.trim()&&el.querySelector('svg[data-logo]'))),renditions:products.every(id=>['color','mono','tile-tint','tile-deep'].every(v=>one(`[data-product-mark="${id}"][data-product-mark-variant="${v}"]`)))};
  const readings=all('.tcrn-product-logo,[data-brand-lockup="line"]').map(el=>({productId:el.dataset.productId,scale:el.classList.contains('tcrn-product-logo--rail')?'rail':'lockup',firstLine:el.dataset.brandLockup==='line'?(el.dataset.lockup==='lkr-line'?'rail':'lockup'):null,name:(el.querySelector('.tcrn-product-logo__line-one,.tcrn-brand-lockup__word')?.textContent??'').replace(/\s+/g,' ').trim(),tagline:el.querySelector('.tcrn-product-logo__line-two')?.textContent.trim()??null,byline:el.querySelector('.tcrn-product-logo__byline')?.textContent.trim()??null,accessibleName:el.getAttribute('aria-label')}));
  facts.ProductLockup={registeredWording:products.every(id=>readings.some(r=>r.productId===id&&r.tagline)),railAndFirstLine:products.every(id=>readings.some(r=>r.productId===id&&r.scale==='rail')&&['rail','lockup'].every(scale=>readings.some(r=>r.productId===id&&r.firstLine===scale))),readings};
 }
 if(root.dataset.approvedBoard==='05-actions'){
  const busy=one('[data-formal-action$="-loading"]'),danger=one('[data-formal-action="danger-default"]'),square=one('.tcrn-icon-button:not(.tcrn-icon-button--labelled)'),labelled=one('.tcrn-icon-button--labelled');
  facts.Button={disabledDescription:reasons('button.tcrn-button'),loadingFeedback:busy?.getAttribute('aria-busy')==='true'&&!!busy.querySelector('[data-icon-name="loader-circle"]')&&!!busy.textContent.trim(),dangerInk:!!danger&&style(danger).color!==style(danger).backgroundColor&&style(danger).backgroundColor===color(danger.closest('[data-tcrn-theme]'),'var(--tcrn-color-panel)')};
  const sizeReadings=all('.tcrn-icon-button').map(el=>{const s=style(el),r=el.getBoundingClientRect();return {kind:'control',className:el.className,size:/--sm\b/.test(el.className)?'sm':/--lg\b/.test(el.className)?'lg':'md',width:r.width,height:r.height,transform:s.transform,iconButton:true,labelled:el.classList.contains('tcrn-icon-button--labelled'),paddingLeft:parseFloat(s.paddingLeft),paddingRight:parseFloat(s.paddingRight),gap:parseFloat(s.columnGap),labelWidth:el.querySelector('.tcrn-icon-button__label')?.getBoundingClientRect().width,iconWidth:el.querySelector('svg')?.getBoundingClientRect().width};});
  facts.IconButton={sizeReadings,allPublishedSizes:all('[data-formal-theme]').every(theme=>['sm','md','lg'].every(size=>{const group=theme.querySelector(`[data-icon-button-size="${size}"]`);return group?.querySelector('.tcrn-icon-button--labelled')&&group.querySelector('.tcrn-icon-button:not(.tcrn-icon-button--labelled)');})),named:all('.tcrn-icon-button').every(el=>el.getAttribute('aria-label')?.trim()),squareAndLabelled:!!square&&!!labelled&&square.getBoundingClientRect().width===square.getBoundingClientRect().height&&labelled.getBoundingClientRect().width>labelled.getBoundingClientRect().height};
  facts.LinkButton={nativeAnchor:all('.tcrn-link-button').length>0&&all('.tcrn-link-button').every(el=>el.tagName==='A'&&!!el.getAttribute('href')),noBusyOrDisabled:all('.tcrn-link-button').every(el=>!el.hasAttribute('aria-busy')&&!el.hasAttribute('disabled'))};
  const groups=all('.tcrn-button-group'),groupReadings=groups.map(el=>{
   const children=[...el.children],actions=children.filter(child=>child.matches('button.tcrn-button')),separators=children.filter(child=>child.matches('.tcrn-button-group__separator[aria-hidden="true"]'));
   return {theme:el.closest('[data-formal-theme]')?.getAttribute('data-formal-theme'),size:el.dataset.buttonGroupSize,variant:el.classList.contains('tcrn-button-group--quiet')?'quiet':'secondary',childCount:children.length,separators:separators.length,otherChildren:children.length-actions.length-separators.length,actions:actions.map(action=>({tag:action.tagName,family:action.matches('.tcrn-button'),size:/--sm\b/.test(action.className)?'sm':/--lg\b/.test(action.className)?'lg':'md',variant:action.classList.contains('tcrn-button--quiet')?'quiet':action.classList.contains('tcrn-button--secondary')?'secondary':'unsupported',height:action.getBoundingClientRect().height,pressed:action.getAttribute('aria-pressed')}))};
  });
  facts.ButtonGroup={groupReadings,namedGroup:groups.length>0&&groups.every(el=>el.getAttribute('role')==='group'&&el.getAttribute('aria-label')),twoToFive:false,allPublishedSizes:false,childSelection:groups.every(el=>!el.hasAttribute('aria-pressed')&&el.querySelectorAll(':scope > button[aria-pressed="true"]').length===1)};
 }
 if(root.dataset.approvedBoard==='06-inputs'){
  const inputs=all('input.tcrn-input:not([type="search"])'),invalid=inputs.filter(el=>el.getAttribute('aria-invalid')==='true'),ta=one('textarea'),suggest=one('input[list]'),list=suggest&&document.getElementById(suggest.getAttribute('list')),select=one('select:not([multiple])'),number=one('input[type="number"]'),date=one('input[type="date"]');
  const errorReadings=invalid.map(el=>({primary:el.hasAttribute('data-primary-input-state'),state:el.getAttribute('data-primary-input-state'),theme:el.closest('[data-tcrn-theme]')?.getAttribute('data-tcrn-theme'),invalid:el.getAttribute('aria-invalid')==='true',describedIds:(el.getAttribute('aria-describedby')??'').split(/\s+/).filter(Boolean),messages:descriptions(el).filter(Boolean).map(message=>{const s=style(message),carrier=message.querySelector(':scope > .tcrn-doc-error__text');return {id:message.id,unique:all('[id]').filter(other=>other.id===message.id).length===1,text:message.textContent,primary:message.hasAttribute('data-primary-input-error'),color:s.color,fontSize:s.fontSize,lineHeight:s.lineHeight,gap:s.gap,display:s.display,alignItems:s.alignItems,minWidth:s.minWidth,textCarrier:carrier?{...textReading(carrier,message),direct:carrier.parentElement===message}:null,icons:[...message.querySelectorAll(':scope > .tcrn-icon')].map(icon=>({name:icon.getAttribute('data-icon-name'),hidden:icon.getAttribute('aria-hidden')==='true',width:icon.getBoundingClientRect().width,flexShrink:style(icon).flexShrink}))};})}));
  const hintReadings=all('.tcrn-doc-hint').map(el=>({theme:el.closest('[data-tcrn-theme]')?.getAttribute('data-tcrn-theme'),...textReading(el,el.parentElement)}));
  facts.Input={nativeNamed:inputs.length>0&&inputs.every(named),errorReadings,hintReadings,errorsAndReasons:invalid.length>0&&invalid.every(el=>descriptions(el).some(d=>d?.textContent.trim()))&&reasons('input.tcrn-input')};
  facts.Textarea={nativeNamed:!!ta&&named(ta),widthAndMultiline:!!ta&&ta.tagName==='TEXTAREA'&&parseFloat(style(ta).minHeight)>=76};
  const search=one('input[type="search"][aria-keyshortcuts]');facts.SearchInput={namedTool:!!search&&named(search),shortcutAndFill:!!search?.closest('.tcrn-search-input--fill')&&!!search?.closest('.tcrn-search-input')?.querySelector('kbd')&&search.getAttribute('aria-keyshortcuts').includes('Control+K')};
  facts.SuggestInput={openDomain:suggest?.getAttribute('data-choice-value-mode')==='open'&&!!list,deduplicatedDatalist:!!list&&new Set([...list.children].map(o=>o.value)).size===list.children.length};
  facts.Select={nativeClosedSingle:!!select&&!select.multiple&&select.options.length>1,placeholderDisabled:!!select?.options[0].disabled};
  facts.MultiSelect={closedSetPresentations:!!one('select[multiple]')&&!!one('.tcrn-multi-select-dropdown__trigger')&&!!one('[data-choice-presentation="checkboxes"]'),selectionAndLabels:!!one('[data-multi-select-summary]')?.textContent.trim()&&!!one('.tcrn-multi-select-dropdown__trigger')?.getAttribute('aria-label')};
  let minimumObservation=null;
  if(number){const probe=document.createElement('span');probe.style.cssText=`position:absolute;display:block;width:12ch;padding:0;border:0;box-sizing:content-box;font:${style(number).font};`;number.parentElement.append(probe);const original=number.getAttribute('style');try{const twelveCh=probe.getBoundingClientRect().width,minimum=parseFloat(style(number).minInlineSize);number.style.inlineSize='1px';minimumObservation={twelveCh,minimum,squeezed:number.getBoundingClientRect().width};}finally{probe.remove();if(original===null)number.removeAttribute('style');else number.setAttribute('style',original);}}
  facts.NumberInput={nativeNumber:!!number&&number.type==='number'&&number.min==='1'&&number.max==='120',minimumObservation,twelveChMinimum:!!minimumObservation&&Math.abs(minimumObservation.minimum-minimumObservation.twelveCh)<.5&&Math.abs(minimumObservation.squeezed-minimumObservation.twelveCh)<.5};
  facts.DatePicker={nativeIso:!!date&&/^\d{4}-\d{2}-\d{2}$/.test(date.value)&&named(date),calendarIndicator:!!one('.tcrn-date-picker-wrap [data-icon-name="calendar"]')&&getComputedStyle(date,'::-webkit-calendar-picker-indicator').opacity==='0'};
  const checks=all('input.tcrn-checkbox');facts.Checkbox={nativeNamed:checks.length>0&&checks.every(named),mixedAndError:checks.some(el=>el.getAttribute('aria-invalid')==='true')&&checks.some(el=>el.disabled)};
  const radios=all('fieldset.tcrn-radio-group');facts.RadioGroup={nativeLegendAndName:radios.length>0&&radios.every(el=>el.querySelector('legend')?.textContent.trim()&&[...el.querySelectorAll('input[type="radio"]')].every(input=>input.name)),oneChoicePerGroup:radios.some(el=>el.querySelectorAll('input[type="radio"]:checked').length===1)&&radios.every(el=>el.querySelectorAll('input[type="radio"]:checked').length<=1)};
  const toggle=one('input[role="switch"]');facts.Switch={descriptionAssociated:!!toggle&&descriptions(toggle).some(d=>d?.classList.contains('tcrn-switch__description'))};
 }
 if(root.dataset.approvedBoard?.startsWith('07')){
  const frame=one('[data-formal-shell-scene="band"]'),shell=frame?.querySelector('.tcrn-product-shell'),trigger=frame?.querySelector('[data-shell-brand]'),menu=one('[data-formal-shell-scene="menu"] [role="dialog"]'),pins=frame?.querySelector('.tcrn-shell-pins'),drop=one('[data-formal-shell-scene="drop"] [data-panel="drop"]');
  facts.ProductShell={oneTopBand:!!shell&&shell.querySelectorAll(':scope > [data-shell-strip]').length===1&&!shell.querySelector('.tcrn-side-nav'),headerAndPreferences:!!shell?.querySelector('.tcrn-page-header')&&!!shell?.querySelector('[data-shell-account]'),contextualHeader:all('.tcrn-page-header__title').length>0&&all('.tcrn-page-header__title').every(el=>Math.abs(parseFloat(style(el).lineHeight)-26*1.1)<.1)};
  facts.ShellBrandButton={readings:all('[data-shell-brand]').map(el=>({label:el.getAttribute('aria-label'),expanded:el.getAttribute('aria-expanded')==='true',version:el.dataset.shellBrand,product:'TCRN TMS',standalone:el.hasAttribute('data-standalone-brand')})),namedRegisteredVersions:!!trigger?.getAttribute('aria-label')&&trigger.getAttribute('aria-haspopup')==='dialog'&&!!trigger.querySelector('svg[data-logo="tms"]')&&!!one('[data-shell-brand="v1"]')&&!!one('[data-shell-brand="v2"]')};
  const rowReadings=all('.tcrn-shell-menu .tcrn-nav-item-row').map(row=>{
   const child=row.querySelector(':scope > .tcrn-nav-item'),pin=row.querySelector(':scope > [data-pin-button]'),selected=child?.matches('[aria-current="page"],[aria-expanded="true"]'),hover=row.matches(':hover')||child?.getAttribute('data-tcrn-preview-state')?.split(/\s+/).includes('hover'),state=selected?'selected':hover?'hover':'default',rect=el=>{const r=el?.getBoundingClientRect();return r?{x:r.x,right:r.right,width:r.width,height:r.height}:null;};
   return {state,ink:child&&style(child).color,fill:style(row).backgroundColor,childFill:child&&style(child).backgroundColor,weight:child&&style(child).fontWeight,expectedInk:color(row,`var(--tcrn-color-${selected||hover?'ink':'ink-2'})`),expectedFill:state==='default'?'rgba(0, 0, 0, 0)':color(row,`var(--tcrn-color-${selected?'wash':'hover'})`),row:rect(row),link:rect(child),pin:rect(pin),pinInset:row.getBoundingClientRect().right-pin?.getBoundingClientRect().right,columns:style(row).gridTemplateColumns};
  });
  facts.ShellMenu={nonModalAndDismiss:!!menu&&menu.getAttribute('aria-modal')==='false'&&!menu.querySelector('[data-shell-close]'),rowReadings,rowCarrierStates:false};
  facts.ShellPins={sixAndResponsive:!!pins&&pins.querySelectorAll('.tcrn-shell-pins__item').length<=6};
  facts.ShellDropdown={subtreeSearch:!!drop?.querySelector('input[type="search"]')&&!!drop?.getAttribute('aria-label')};
  facts.ShellIntro={mountedAfterSignIn:!!one('[data-formal-intro]')&&!one('[data-shell-intro]')};
 }
 return facts;
});
 if(facts.ButtonGroup){const rows=facts.ButtonGroup.groupReadings;facts.ButtonGroup.twoToFive=buttonGroupIssues(rows).length===0;facts.ButtonGroup.allPublishedSizes=['light','dark'].every(theme=>['sm','md','lg'].every(size=>['secondary','quiet'].every(variant=>[2,4,5].every(count=>rows.some(row=>row.theme===theme&&row.size===size&&row.variant===variant&&row.actions.length===count)))));}
 if(facts.ShellMenu)facts.ShellMenu.rowCarrierStates=rowCarrierIssues(facts.ShellMenu.rowReadings).length===0;
 if(facts.ProductLockup){facts.ProductLockup.exactLineRoles=lockupRoleIssues(facts.ProductLockup.readings,formalLockupExpectations(source,locale)).length===0;}
 if(facts.ShellBrandButton){facts.ShellBrandButton.localizedNames=shellBrandNameIssues(facts.ShellBrandButton.readings,locale).length===0;}
 if(facts.Input){facts.Input.errorRoleIssues=[...describedErrorRoleIssues(facts.Input.errorReadings,{source}),...hintRoleIssues(facts.Input.hintReadings,{source})];facts.Input.errorsAndReasons&&=facts.Input.errorRoleIssues.length===0;}
 return facts;
}

export async function exerciseApiBoard(page,board,facts){
 const root=page.locator('[data-approved-board]').first();
 if(board==='02-typography'){
  const pair=await root.locator('[data-highlight-specimen]').first().evaluate(el=>{const reference=el.previousElementSibling,a=el.getBoundingClientRect(),b=reference.getBoundingClientRect();return {width:a.width,referenceWidth:b.width,height:a.height,referenceHeight:b.height};});facts.Highlight.markOnlyPaint&&=pair.width===pair.referenceWidth&&pair.height===pair.referenceHeight;
 }
 if(board==='05-actions'){
  for(const group of await root.locator('.tcrn-button-group').all()){
   const actions=group.locator(':scope > button.tcrn-button');await actions.nth(1).click();
   facts.ButtonGroup.childSelection&&=await group.evaluate(el=>!el.hasAttribute('aria-pressed')&&el.querySelectorAll(':scope > button[aria-pressed="true"]').length===1&&el.querySelectorAll(':scope > button')[1].getAttribute('aria-pressed')==='true');
  }
  const copySelector='[data-formal-section="ClipboardCopyButton"] > .tcrn-button[data-clipboard-copy-state]',button=root.locator(copySelector).first();
  if(await button.count()){
   const waitState=async state=>page.waitForFunction(({element,state})=>element.getAttribute('data-clipboard-copy-state')===state,{element:await button.elementHandle(),state});
   await page.evaluate(()=>{window.__copyValues=[];Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:text=>{window.__copyValues.push(text);return new Promise(resolve=>{window.__resolveCopy=resolve;});}}});});
   facts.ClipboardCopyButton={secretOutsideDom:!(await button.evaluate(el=>el.outerHTML)).includes('PRJ-2026-0412')};
   await button.click();await waitState('copying');
   await page.evaluate(()=>window.__resolveCopy());await waitState('copied');
   await waitState('idle');
   await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:()=>Promise.reject(new Error('local API fixture'))}}));await button.click();await waitState('failed');
   await waitState('idle');
   await page.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{configurable:true,value:undefined});Object.defineProperty(document,'execCommand',{configurable:true,value:()=>false});});await button.click();await waitState('unsupported');
   facts.ClipboardCopyButton.fiveStatesAndReset=true;
  }
 }
 if(board==='06-inputs'){
  const number=root.locator('input[type="number"]').first();await number.fill('121');const overflow=await number.evaluate(el=>el.validity.rangeOverflow);await number.fill('24');await number.press('ArrowUp');facts.NumberInput.rangeAndKeyboard=overflow&&await number.inputValue()==='25';
  const toggle=root.locator('input[role="switch"]').first(),before=await toggle.isChecked();await toggle.check({force:true});if(before)await toggle.uncheck({force:true});facts.Switch.namedImmediateBinary=await toggle.isChecked()!==before;
  const trigger=root.locator('.tcrn-multi-select-dropdown__trigger').first();await trigger.click();facts.MultiSelect.bodyListbox=await page.locator('body > [role="listbox"][data-overlay-boundary="document-body"][data-overlay-open="true"]').count()>0;await page.keyboard.press('Escape');
  const checkbox=root.locator('input.tcrn-checkbox').first();await checkbox.evaluate(el=>{el.indeterminate=true;});facts.Checkbox.mixedAndError&&=await checkbox.evaluate(el=>el.matches(':indeterminate'));await checkbox.evaluate(el=>{el.indeterminate=false;});
 }
 if(board.startsWith('07')){
  const focusRows=await readPinnableFocus(page,root);
  facts.ShellMenu.focusRows=focusRows;
  facts.ShellMenu.rowCarrierStates&&=rowFocusValid(focusRows);
  const frame=root.locator('[data-formal-shell-scene="band"]').first(),trigger=frame.locator('[data-shell-brand]');await trigger.click();facts.ShellBrandButton.onePressFullDialog=await frame.locator('[data-panel="expanded"]').count()===1;
  const search=frame.locator('[data-shell-search] input[type="search"]');await search.fill((await frame.locator('[data-shell-row]').first().textContent()).trim());facts.ShellMenu.globalSearchAndKeys=await frame.locator('[data-product-shell-search-results]').count()>0;await page.keyboard.press('Escape');facts.ShellMenu.nonModalAndDismiss&&=await frame.locator('[role="dialog"]').count()===0&&await trigger.evaluate(el=>el===document.activeElement);
  const owner=page.locator('.tcrn-product-shell').first();await page.keyboard.press('Control+k');const ownedSearch=owner.locator(':scope > .tcrn-shell-menu input[type="search"]').first();facts.ShellMenu.globalSearchAndKeys&&=await ownedSearch.evaluate(el=>el===document.activeElement);await page.keyboard.press('Escape');
  const avatar=frame.locator('.tcrn-shell-avatar');await avatar.click();facts.ProductShell.headerAndPreferences&&=await frame.locator('[data-shell-preferences]').count()===1&&await frame.locator('[data-shell-products] [data-shell-product]').count()>0;await avatar.click();
  const pin=frame.locator('.tcrn-shell-pins__item').first();const order=await frame.locator('[data-pin]').evaluateAll(els=>els.map(el=>el.getAttribute('data-pin')));await pin.focus();await page.keyboard.press('Alt+ArrowRight');const reordered=await frame.locator('[data-pin]').evaluateAll(els=>els.map(el=>el.getAttribute('data-pin')));facts.ShellPins.orderedReorder=JSON.stringify(order)!==JSON.stringify(reordered);
  const drop=root.locator('[data-formal-shell-scene="drop"]').first();if(await drop.locator('[data-panel="drop"]').count()===0)await drop.locator('[data-pin="contracts"] .tcrn-shell-pins__item').click();const opener=drop.locator('.tcrn-shell-dropdown__panel [data-shell-row][aria-expanded]').first();await opener.focus();await page.keyboard.press('ArrowRight');await drop.locator('.tcrn-shell-dropdown__col').first().waitFor();const entered=await drop.locator('.tcrn-shell-dropdown__col').first().evaluate(el=>el.contains(document.activeElement));await page.keyboard.press('ArrowLeft');facts.ShellDropdown.clickAndKeys=entered&&await opener.evaluate(el=>el===document.activeElement);
  // The actual session/motion assertions live in the shared G16 runner; this API assertion
  // records its concrete component setup rather than treating an arbitrary props string as proof.
  facts.ShellIntro.sessionMotionContract=false;
 }
 return facts;
}
