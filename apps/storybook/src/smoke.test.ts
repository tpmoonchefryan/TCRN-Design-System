import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { App,sourceSearch,boardHref,navGroups } from "./app.js";
import { approvedApi } from "./approved-api.js";
import { approvedSource,supportedLocales } from "./approved-source.js";
import { contractStories } from "./contract-stories/kernel.js";
const expected=["01-tokens","02-typography","03-icons","04-brand","05-actions","06-inputs","07a-shell-upper","07b-shell-lower"];
test("V3 static registry is the fixed published eight-board set, not an independent old story/API catalogue",()=>{assert.deepEqual(contractStories.map(s=>s.id),expected);assert.equal(approvedApi.length,28);for(const name of ["TcrnBrandMark","StateView","Badge","Field","LineNumberedEditor","Tooltip","Dialog"])assert.ok(!approvedApi.some(a=>a.name===name));assert.equal(approvedSource.site.sourceCommit,"a643d4cfcd239f6f81b1715ded6a63caead9d619");});
test("V2/V3 every current locale renders only the current provenance and supported board entrypoints",()=>{for(const locale of supportedLocales){const html=renderToStaticMarkup(createElement(App,{page:"index",locale}));assert.ok(html.includes(approvedSource.site.sourceCommit));assert.ok(html.includes(`/${locale}/01-tokens.html`));assert.doesNotMatch(html,/tcrn-brand-mark\.svg|tcrn-aos-two-line|Style Guide|data-brand-asset="tcrn-brand-mark"/);}});

test("the five-language search uses only source boards and the same explicit API projection",()=>{for(const locale of supportedLocales){const hits=sourceSearch(locale,"MultiSelect");assert.ok(hits.some(r=>r.id==="api-MultiSelect"&&r.href===`/${locale}/api.html#api-MultiSelect`));assert.deepEqual(sourceSearch(locale,"Dialog"),[]);assert.deepEqual(sourceSearch(locale," "),[]);}});


test("manager documents reuse the real shell and activate only registered board/API/source destinations in all locales",()=>{
 for(const locale of supportedLocales){
  const groups=navGroups(locale,"06-inputs","manager");
  assert.deepEqual(groups[0].items.map(item=>item.href),approvedSource.boards.map(board=>boardHref(locale,board.slug,"manager")));
  for(const api of approvedApi){const hit=sourceSearch(locale,api.name,"manager").find(r=>r.id===`api-${api.name}`);assert.equal(hit?.href,`${boardHref(locale,api.board,"manager")}#api-${api.name}`);}
  for(const query of ["Dialog","StateView","brand-identity","tcrn-brand-mark.svg"])assert.deepEqual(sourceSearch(locale,query,"manager"),[]);
  const html=renderToStaticMarkup(createElement(App,{page:"06-inputs",locale,entry:"manager"}));
  assert.equal((html.match(/<main\b/g)??[]).length,1);
  assert.ok(html.includes(`lang="${locale}" data-approved-board="06-inputs"`));
  assert.ok(html.includes('data-published-api-reference')&&html.includes('id="api-MultiSelect"')&&html.includes('id="source"'));
  assert.doesNotMatch(html,/data-approved-api="Button"/);
 }
});
