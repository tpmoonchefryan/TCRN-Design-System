import assert from "node:assert/strict";
import test from "node:test";
import { readApprovedSource,cssRule } from "../scripts/lib/approved-site-source.mjs";
test("V6 actual published geometry distinguishes control and glyph size",()=>{const s=readApprovedSource(),b=s.board("01-tokens");assert.equal(cssRule(b.css,".gp")["--h-sm"],"28px");assert.equal(cssRule(b.css,".gp")["--h-md"],"32px");assert.equal(cssRule(b.css,".gp")["--h-lg"],"40px");assert.equal(cssRule(s.board("07b-shell-lower").css,".ts-tgl").width,"20px");assert.match(s.board("07a-shell-upper").html,/<svg[^>]*width="16"[^>]*data-icon="chevron-down"/);assert.equal(cssRule(s.board("06-inputs").css,".tg>input").width,"34px");});

import { geometryIssues } from '../scripts/lib/published-docs-browser.mjs';
test('small SearchInput and actual Switch knob/travel each have an effective negative reading',()=>{
 const controls=[{kind:'control',size:'sm',className:'tcrn-input tcrn-search-input__control tcrn-input--sm',height:28,transform:'none'}];assert.deepEqual(geometryIssues(controls),[]);assert.ok(geometryIssues([{...controls[0],height:32}]).length);
 for(const small of [false,true])for(const checked of [false,true]){const row={kind:'switch',small,checked,width:small?28:34,height:small?16:20,knobWidth:small?12:16,knobHeight:small?12:16,travel:checked?(small?12:14):0};assert.deepEqual(geometryIssues([row]),[]);for(const change of [{knobWidth:16,knobHeight:16},{travel:14}])if(Object.entries(change).some(([k,v])=>row[k]!==v))assert.ok(geometryIssues([{...row,...change}]).length);}
});
