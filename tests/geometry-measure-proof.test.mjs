import assert from "node:assert/strict";
import test from "node:test";
import { readApprovedSource,cssRule } from "../scripts/lib/approved-site-source.mjs";
test("V6 actual published geometry distinguishes control and glyph size",()=>{const s=readApprovedSource(),b=s.board("01-tokens");assert.equal(cssRule(b.css,".gp")["--h-sm"],"28px");assert.equal(cssRule(b.css,".gp")["--h-md"],"32px");assert.equal(cssRule(b.css,".gp")["--h-lg"],"40px");assert.equal(cssRule(s.board("07b-shell-lower").css,".ts-tgl").width,"20px");assert.match(s.board("07a-shell-upper").html,/<svg[^>]*width="16"[^>]*data-icon="chevron-down"/);assert.equal(cssRule(s.board("06-inputs").css,".tg>input").width,"34px");});

import { geometryIssues } from '../scripts/lib/published-docs-browser.mjs';
test('small SearchInput and actual Switch knob/travel each have an effective negative reading',()=>{
 const controls=[{kind:'control',size:'sm',className:'tcrn-input tcrn-search-input__control tcrn-input--sm',height:28,transform:'none'}];assert.deepEqual(geometryIssues(controls),[]);assert.ok(geometryIssues([{...controls[0],height:32}]).length);
 for(const small of [false,true])for(const checked of [false,true]){const row={kind:'switch',small,checked,width:small?28:34,height:small?16:20,knobWidth:small?12:16,knobHeight:small?12:16,travel:checked?(small?12:14):0};assert.deepEqual(geometryIssues([row]),[]);for(const change of [{knobWidth:16,knobHeight:16},{travel:14}])if(Object.entries(change).some(([k,v])=>row[k]!==v))assert.ok(geometryIssues([{...row,...change}]).length);}
});

test('all labelled IconButton sizes, NumberInput12ch and actual header context reject effective cascade regressions',()=>{
 for(const [size,height,pad]of [['sm',28,10],['md',32,12],['lg',40,16]]){
  const row={kind:'control',className:`tcrn-button tcrn-icon-button--labelled tcrn-button--${size}`,size,height,width:60+14+6+2*pad,transform:'none',iconButton:true,labelled:true,paddingLeft:pad,paddingRight:pad,labelWidth:60,iconWidth:14,gap:6};
  assert.deepEqual(geometryIssues([row]),[]);
  assert.ok(geometryIssues([{...row,width:height}]).some(i=>i.includes('Labelled IconButton')));
  assert.ok(geometryIssues([{...row,paddingLeft:0}]).length);
 }
 const number={kind:'control',className:'tcrn-input tcrn-number-input',size:'md',height:32,number:true,minimum:90,twelveCh:90,squeezedWidth:90,fontSize:13,fontVariantNumeric:'tabular-nums'};
 assert.deepEqual(geometryIssues([number]),[]);
 for(const change of [{minimum:0},{minimum:undefined},{squeezedWidth:1}])assert.ok(geometryIssues([{...number,...change}]).some(i=>i.includes('12ch')));
 const header={kind:'page-header',fontSize:26,lineHeight:28.6};assert.deepEqual(geometryIssues([header]),[]);assert.ok(geometryIssues([{...header,lineHeight:30}]).some(i=>i.includes('PageHeader')));
});

test('ButtonGroup geometry measures actions independently of its decorative separators at every boundary/size',()=>{
 for(const [size,height]of [['sm',28],['md',32],['lg',40]])for(const count of [2,4,5]){
  const row={kind:'button-group',size,actionCount:count,separators:count-1,heights:Array(count).fill(height)};
  assert.deepEqual(geometryIssues([row]),[]);
  for(const change of [{actionCount:2*count-1},{separators:count},{heights:[...row.heights.slice(1),32===height?28:32]}])assert.ok(geometryIssues([{...row,...change}]).length);
 }
});

import { collectGeometryReadings } from '../scripts/lib/published-docs-browser.mjs';
import { withPublishedBrowser,openPublishedBoard,publishedSearchOccurrences,publishedSearchLocator,publishedSearchGeometry } from '../scripts/lib/published-browser-proof.mjs';
import { readApiFacts } from '../scripts/lib/published-api-browser.mjs';

test('NumberInput samples the real tabular font and rejects a changed CSS minimum under squeeze',async()=>{
 for(const entry of ['static','manager'])await withPublishedBrowser(async({browser,base,source})=>{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  try{
   await openPublishedBoard(page,{base,entry,locale:'zh-CN',board:'06-inputs'});
   const controls=page.locator('[data-approved-board] input.tcrn-number-input');
   const collect=async()=>(await collectGeometryReadings(page)).filter(row=>row.number);
   const original=await collect();
   assert.equal(original.length,4);
   assert.deepEqual(geometryIssues(original,{source}),[]);
   assert.ok(original.every(row=>row.fontSize===13&&row.fontVariantNumeric==='tabular-nums'&&row.squeezedWidth===row.twelveCh));
   assert.equal((await readApiFacts(page,{source,locale:'zh-CN'})).NumberInput.twelveChMinimum,true);

   const control=controls.first(),style=await control.getAttribute('style');
   try{
    await control.evaluate(el=>el.style.minInlineSize='11ch');
    const changed=await collect();
    assert.equal(changed[0].twelveCh,original[0].twelveCh);
    assert.ok(changed[0].squeezedWidth<changed[0].twelveCh-.5);
    assert.equal(geometryIssues(changed,{source}).filter(issue=>issue.includes('12ch')).length,1);
    assert.equal((await readApiFacts(page,{source,locale:'zh-CN'})).NumberInput.twelveChMinimum,false);
    await control.evaluate(el=>{el.style.minInlineSize='12ch';el.style.fontVariantNumeric='normal';});
    assert.equal(geometryIssues(await collect(),{source}).filter(issue=>issue.includes('12ch')).length,1);
   }finally{
    await control.evaluate((el,value)=>value===null?el.removeAttribute('style'):el.setAttribute('style',value),style);
   }
   assert.deepEqual(geometryIssues(await collect(),{source}),[]);
  }finally{await page.close();}
 },{entry});
});

test('the real geometry collector keeps menu/drop/Sheet context and valid context reaches later native checks',async()=>{
 for(const entry of ['static','manager'])await withPublishedBrowser(async({browser,base,source})=>{
  for(const locale of ['zh-CN','en','ja','ko','fr'])for(const board of ['07a-shell-upper','07b-shell-lower']){
   const page=await browser.newPage({viewport:{width:1440,height:1000}});
   try{
    await openPublishedBoard(page,{base,entry,locale,board});
    for(const role of publishedSearchOccurrences(source).filter(row=>row.board===board)){
     const carrier=publishedSearchLocator(page,role),control=carrier.locator('input'),owner=carrier.locator('..');
     const collect=async()=>{
      const readings=await collectGeometryReadings(page),rows=readings.filter(row=>row.shellSearch&&row.searchContext?.scene===role.scene&&row.searchContext?.theme===role.theme);
      assert.equal(rows.length,1,`${entry}/${locale}/${role.key}: actual native control`);return rows;
     };
     const baseline=await collect(),expected=publishedSearchGeometry(source,board,role.context);
     assert.equal(baseline[0].searchContext.kind,role.context);
     assert.equal(baseline[0].height,expected.height);
     assert.deepEqual(geometryIssues(baseline,{source}),[]);
     const originalStyle=await control.getAttribute('style');
     try{
      await control.evaluate((element,height)=>element.style.height=`${height+4}px`,expected.height);
      assert.ok(geometryIssues(await collect(),{source}).some(issue=>issue.includes(`Control variant ${role.context} height`)),'wrong actual contextual height reaches the production oracle');
     }finally{await control.evaluate((element,value)=>value===null?element.removeAttribute('style'):element.setAttribute('style',value),originalStyle);}
     const ownerClass=await owner.getAttribute('class');
     try{
      await owner.evaluate(element=>element.classList.remove('tcrn-shell-menu__search','tcrn-shell-dropdown__search'));
      const lost=await collect();assert.equal(lost[0].searchContext.kind,'unknown');
      assert.ok(geometryIssues(lost,{source}).some(issue=>issue.includes('Shell search context missing/unknown')),'real ancestry/context loss is not exempted');
     }finally{await owner.evaluate((element,value)=>element.setAttribute('class',value),ownerClass);}
     try{
      await control.evaluate(element=>element.setAttribute('role','textbox'));
      const changed=await collect(),failures=geometryIssues(changed,{source});
      assert.equal(changed[0].searchContext.kind,role.context);
      assert.ok(!failures.some(issue=>issue.includes('Control variant')),'correct contextual height remains accepted');
      assert.ok(failures.includes('Shell search native semantics after context'),'valid context must reach the later native predicate');
     }finally{await control.evaluate(element=>element.setAttribute('role','combobox'));}
     assert.deepEqual(geometryIssues(await collect(),{source}),[],'real native control and ancestry restored');
    }
    // A genuine ordinary form field on the same shell page keeps its own size.
    const form=page.locator('[data-approved-board]').first();
    try{
     await form.evaluate(element=>element.insertAdjacentHTML('beforeend','<input data-geometry-ordinary="" class="tcrn-input tcrn-input--sm" style="height:28px">'));
     const ordinary=(await collectGeometryReadings(page)).find(row=>row.className==='tcrn-input tcrn-input--sm');
     assert.equal(ordinary.shellSearch,false);assert.equal(ordinary.size,'sm');assert.deepEqual(geometryIssues([ordinary],{source}),[]);
     await page.locator('[data-geometry-ordinary]').evaluate(element=>element.style.height='32px');
     const wrong=(await collectGeometryReadings(page)).find(row=>row.className==='tcrn-input tcrn-input--sm');
     assert.ok(geometryIssues([wrong],{source}).some(issue=>issue.includes('Control variant sm height')));
    }finally{await page.locator('[data-geometry-ordinary]').evaluateAll(elements=>elements.forEach(element=>element.remove()));}
   }finally{await page.close();}
  }
 },{entry});
});
