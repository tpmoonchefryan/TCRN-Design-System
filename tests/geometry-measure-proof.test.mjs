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
 const number={kind:'control',className:'tcrn-input tcrn-number-input',size:'md',height:32,number:true,minimum:90,twelveCh:90,squeezedWidth:90};
 assert.deepEqual(geometryIssues([number]),[]);
 for(const change of [{minimum:0},{minimum:undefined},{squeezedWidth:1}])assert.ok(geometryIssues([{...number,...change}]).some(i=>i.includes('12ch')));
 const header={kind:'page-header',fontSize:26,lineHeight:28.6};assert.deepEqual(geometryIssues([header]),[]);assert.ok(geometryIssues([{...header,lineHeight:30}]).some(i=>i.includes('PageHeader')));
});
