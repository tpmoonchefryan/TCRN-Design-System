// Runtime assertions are separate from the normative API text and from engineering exports.
export const API_BEHAVIOR_REQUIREMENTS=Object.freeze({
 Heading:['semanticLevels','visualFamilies','singleLineTitle'],Text:['bodyScale','numeralCaps','strongSample'],Highlight:['markOnlyPaint','emptyQuery'],Icon:['rosterGeometry','namesAndDecoration'],ProductLogo:['registeredGraphicOnly','renditions'],ProductLockup:['registeredWording','railAndFirstLine'],Button:['disabledDescription','loadingFeedback','dangerInk'],IconButton:['named','squareAndLabelled'],LinkButton:['nativeAnchor','noBusyOrDisabled'],ClipboardCopyButton:['secretOutsideDom','fiveStatesAndReset'],ButtonGroup:['namedGroup','twoToFive','childSelection'],Input:['nativeNamed','errorsAndReasons'],Textarea:['nativeNamed','widthAndMultiline'],SearchInput:['namedTool','shortcutAndFill'],SuggestInput:['openDomain','deduplicatedDatalist'],Select:['nativeClosedSingle','placeholderDisabled'],MultiSelect:['closedSetPresentations','bodyListbox','selectionAndLabels'],NumberInput:['nativeNumber','rangeAndKeyboard'],DatePicker:['nativeIso','calendarIndicator'],Checkbox:['nativeNamed','mixedAndError'],RadioGroup:['nativeLegendAndName','oneChoicePerGroup'],Switch:['namedImmediateBinary','descriptionAssociated'],ProductShell:['oneTopBand','headerAndPreferences'],ShellBrandButton:['onePressFullDialog','namedRegisteredVersions'],ShellMenu:['nonModalAndDismiss','globalSearchAndKeys'],ShellPins:['orderedReorder','sixAndResponsive'],ShellDropdown:['subtreeSearch','clickAndKeys'],ShellIntro:['mountedAfterSignIn','sessionMotionContract']
});
export function apiBehaviorIssues(name,facts){return (API_BEHAVIOR_REQUIREMENTS[name]??['unknownAPI']).filter(key=>facts?.[key]!==true).map(key=>`${name}: published API behavior ${key} not established`);}
export async function readApiFacts(page){return page.locator('[data-approved-board]').first().evaluate(root=>{
 const one=s=>root.querySelector(s),all=s=>[...root.querySelectorAll(s)],style=el=>el?getComputedStyle(el):null;
 const named=el=>!!(el.getAttribute('aria-label')?.trim()||el.labels?.length);
 const color=(el,value)=>{const probe=document.createElement('span');probe.style.color=value;el.append(probe);const result=getComputedStyle(probe).color;probe.remove();return result;};
 const descriptions=el=>(el.getAttribute('aria-describedby')??'').split(/\s+/).filter(Boolean).map(id=>document.getElementById(id));
 const reasons=s=>all(s).filter(el=>el.disabled).every(el=>el.getAttribute('data-disabled-reason')&&descriptions(el).some(d=>d?.textContent.trim()));
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
  facts.ProductLockup={registeredWording:products.every(id=>one(`.tcrn-product-logo[data-product-id="${id}"] [data-logo]`)&&one(`.tcrn-product-logo[data-product-id="${id}"] .tcrn-product-logo__line-two`)?.textContent.trim()),railAndFirstLine:!!one('.tcrn-product-logo--rail')&&!!one('[data-lockup="lkr-line"]')&&!!one('[data-lockup="lk-line"]')};
 }
 if(root.dataset.approvedBoard==='05-actions'){
  const busy=one('[data-formal-action$="-loading"]'),danger=one('[data-formal-action="danger-default"]'),square=one('.tcrn-icon-button:not(.tcrn-icon-button--labelled)'),labelled=one('.tcrn-icon-button--labelled');
  facts.Button={disabledDescription:reasons('button.tcrn-button'),loadingFeedback:busy?.getAttribute('aria-busy')==='true'&&!!busy.querySelector('[data-icon-name="loader-circle"]')&&!!busy.textContent.trim(),dangerInk:!!danger&&style(danger).color!==style(danger).backgroundColor&&style(danger).backgroundColor===color(danger.closest('[data-tcrn-theme]'),'var(--tcrn-color-panel)')};
  facts.IconButton={named:all('.tcrn-icon-button').every(el=>el.getAttribute('aria-label')?.trim()),squareAndLabelled:!!square&&!!labelled&&square.getBoundingClientRect().width===square.getBoundingClientRect().height&&labelled.getBoundingClientRect().width>labelled.getBoundingClientRect().height};
  facts.LinkButton={nativeAnchor:all('.tcrn-link-button').length>0&&all('.tcrn-link-button').every(el=>el.tagName==='A'&&!!el.getAttribute('href')),noBusyOrDisabled:all('.tcrn-link-button').every(el=>!el.hasAttribute('aria-busy')&&!el.hasAttribute('disabled'))};
  const groups=all('.tcrn-button-group');facts.ButtonGroup={namedGroup:groups.length>0&&groups.every(el=>el.getAttribute('role')==='group'&&el.getAttribute('aria-label')),twoToFive:groups.every(el=>el.children.length>=2&&el.children.length<=5),childSelection:groups.every(el=>!el.hasAttribute('aria-pressed')&&!!el.querySelector('[aria-pressed="true"]'))};
 }
 if(root.dataset.approvedBoard==='06-inputs'){
  const inputs=all('input.tcrn-input:not([type="search"])'),invalid=inputs.filter(el=>el.getAttribute('aria-invalid')==='true'),ta=one('textarea'),suggest=one('input[list]'),list=suggest&&document.getElementById(suggest.getAttribute('list')),select=one('select:not([multiple])'),number=one('input[type="number"]'),date=one('input[type="date"]');
  facts.Input={nativeNamed:inputs.length>0&&inputs.every(named),errorsAndReasons:invalid.length>0&&invalid.every(el=>descriptions(el).some(d=>d?.textContent.trim()))&&reasons('input.tcrn-input')};
  facts.Textarea={nativeNamed:!!ta&&named(ta),widthAndMultiline:!!ta&&ta.tagName==='TEXTAREA'&&parseFloat(style(ta).minHeight)>=76};
  const search=one('input[type="search"][aria-keyshortcuts]');facts.SearchInput={namedTool:!!search&&named(search),shortcutAndFill:!!search?.closest('.tcrn-search-input--fill')&&!!search?.closest('.tcrn-search-input')?.querySelector('kbd')&&search.getAttribute('aria-keyshortcuts').includes('Control+K')};
  facts.SuggestInput={openDomain:suggest?.getAttribute('data-choice-value-mode')==='open'&&!!list,deduplicatedDatalist:!!list&&new Set([...list.children].map(o=>o.value)).size===list.children.length};
  facts.Select={nativeClosedSingle:!!select&&!select.multiple&&select.options.length>1,placeholderDisabled:!!select?.options[0].disabled};
  facts.MultiSelect={closedSetPresentations:!!one('select[multiple]')&&!!one('.tcrn-multi-select-dropdown__trigger')&&!!one('[data-choice-presentation="checkboxes"]'),selectionAndLabels:!!one('[data-multi-select-summary]')?.textContent.trim()&&!!one('.tcrn-multi-select-dropdown__trigger')?.getAttribute('aria-label')};
  facts.NumberInput={nativeNumber:!!number&&number.type==='number'&&number.min==='1'&&number.max==='120'};
  facts.DatePicker={nativeIso:!!date&&/^\d{4}-\d{2}-\d{2}$/.test(date.value)&&named(date),calendarIndicator:!!one('.tcrn-date-picker-wrap [data-icon-name="calendar"]')&&getComputedStyle(date,'::-webkit-calendar-picker-indicator').opacity==='0'};
  const checks=all('input.tcrn-checkbox');facts.Checkbox={nativeNamed:checks.length>0&&checks.every(named),mixedAndError:checks.some(el=>el.getAttribute('aria-invalid')==='true')&&checks.some(el=>el.disabled)};
  const radios=all('fieldset.tcrn-radio-group');facts.RadioGroup={nativeLegendAndName:radios.length>0&&radios.every(el=>el.querySelector('legend')?.textContent.trim()&&[...el.querySelectorAll('input[type="radio"]')].every(input=>input.name)),oneChoicePerGroup:radios.some(el=>el.querySelectorAll('input[type="radio"]:checked').length===1)&&radios.every(el=>el.querySelectorAll('input[type="radio"]:checked').length<=1)};
  const toggle=one('input[role="switch"]');facts.Switch={descriptionAssociated:!!toggle&&descriptions(toggle).some(d=>d?.classList.contains('tcrn-switch__description'))};
 }
 if(root.dataset.approvedBoard?.startsWith('07')){
  const frame=one('[data-formal-shell-scene="band"]'),shell=frame?.querySelector('.tcrn-product-shell'),trigger=frame?.querySelector('[data-shell-brand]'),menu=one('[data-formal-shell-scene="menu"] [role="dialog"]'),pins=frame?.querySelector('.tcrn-shell-pins'),drop=one('[data-formal-shell-scene="drop"] [data-panel="drop"]');
  facts.ProductShell={oneTopBand:!!shell&&shell.querySelectorAll(':scope > [data-shell-strip]').length===1&&!shell.querySelector('.tcrn-side-nav'),headerAndPreferences:!!shell?.querySelector('.tcrn-page-header')&&!!shell?.querySelector('[data-shell-account]')};
  facts.ShellBrandButton={namedRegisteredVersions:!!trigger?.getAttribute('aria-label')&&trigger.getAttribute('aria-haspopup')==='dialog'&&!!trigger.querySelector('svg[data-logo="tms"]')&&!!one('[data-shell-brand="v1"]')&&!!one('[data-shell-brand="v2"]')};
  facts.ShellMenu={nonModalAndDismiss:!!menu&&menu.getAttribute('aria-modal')==='false'&&!menu.querySelector('[data-shell-close]')};
  facts.ShellPins={sixAndResponsive:!!pins&&pins.querySelectorAll('.tcrn-shell-pins__item').length<=6};
  facts.ShellDropdown={subtreeSearch:!!drop?.querySelector('input[type="search"]')&&!!drop?.getAttribute('aria-label')};
  facts.ShellIntro={mountedAfterSignIn:!!one('[data-formal-intro]')&&!one('[data-shell-intro]')};
 }
 return facts;
});}

export async function exerciseApiBoard(page,board,facts){
 const root=page.locator('[data-approved-board]').first();
 if(board==='02-typography'){
  const pair=await root.locator('[data-highlight-specimen]').first().evaluate(el=>{const reference=el.previousElementSibling,a=el.getBoundingClientRect(),b=reference.getBoundingClientRect();return {width:a.width,referenceWidth:b.width,height:a.height,referenceHeight:b.height};});facts.Highlight.markOnlyPaint&&=pair.width===pair.referenceWidth&&pair.height===pair.referenceHeight;
 }
 if(board==='05-actions'){
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
