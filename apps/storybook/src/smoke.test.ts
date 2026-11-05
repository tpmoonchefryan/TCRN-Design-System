import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { App } from "./app.js";
import { docsNavigation, pageHref, sourceSearch } from "./portal-navigation.js";
import { approvedApi } from "./approved-api.js";
import { approvedSource,supportedLocales } from "./approved-source.js";
import { contractStories } from "./contract-stories/kernel.js";
const expected=["01-tokens","02-typography","03-icons","04-brand","05-actions","06-inputs","07a-shell-upper","07b-shell-lower"];
test("V3 static registry is the fixed published eight-board set, not an independent old story/API catalogue",()=>{assert.deepEqual(contractStories.map(s=>s.id),expected);assert.equal(approvedApi.length,28);for(const name of ["TcrnBrandMark","StateView","Badge","Field","LineNumberedEditor","Tooltip","Dialog"])assert.ok(!approvedApi.some(a=>a.name===name));assert.equal(approvedSource.site.sourceCommit,"a643d4cfcd239f6f81b1715ded6a63caead9d619");});
test("V2/V3 every current locale renders only the current provenance and supported board entrypoints",()=>{for(const locale of supportedLocales){const html=renderToStaticMarkup(createElement(App,{page:"index",locale}));assert.ok(html.includes(approvedSource.site.sourceCommit));assert.ok(html.includes(`/${locale}/01-tokens.html`));assert.doesNotMatch(html,/tcrn-brand-mark\.svg|tcrn-aos-two-line|Style Guide|data-brand-asset="tcrn-brand-mark"/);}});

test("the five-language search uses only source boards and the same explicit API projection",()=>{for(const locale of supportedLocales){const hits=sourceSearch(locale,"MultiSelect");assert.ok(hits.some(r=>r.id==="api-MultiSelect"&&r.href===`/${locale}/api.html#api-MultiSelect`));
 for(const query of ["Dialog","  ＤｉＡｌＯｇ  "]){const roles=sourceSearch(locale,query);assert.deepEqual(roles.map(({id,href})=>({id,href})),["ShellBrandButton","ShellMenu"].map(name=>({id:`api-${name}`,href:`/${locale}/api.html#api-${name}`})));assert.ok(!roles.some(r=>r.id==="api-Dialog"||r.href.endsWith("#api-Dialog")));}
 for(const query of ["StateView","brand-identity","tcrn-brand-mark.svg",""," "])assert.deepEqual(sourceSearch(locale,query),[]);
}});


test("manager documents reuse the real shell and activate only registered board/API/source destinations in all locales",()=>{
 for(const locale of supportedLocales){
  const { directory } = docsNavigation(locale, "manager");
  const destinations = directory.flatMap(group => group.items.map(item => item.href));
  for (const board of approvedSource.boards) {
   assert.equal(destinations.filter(href => href === pageHref(locale, board.slug, "manager")).length, 1);
  }
  for(const api of approvedApi){const hit=sourceSearch(locale,api.name,"manager").find(r=>r.id===`api-${api.name}`);assert.equal(hit?.href,`${pageHref(locale,api.board,"manager")}#api-${api.name}`);}
  for(const query of ["Dialog","  ＤｉＡｌＯｇ  "]){const roles=sourceSearch(locale,query,"manager");assert.deepEqual(roles.map(({id,href})=>({id,href})),[{id:"api-ShellBrandButton",href:`${pageHref(locale,"07a-shell-upper","manager")}#api-ShellBrandButton`},{id:"api-ShellMenu",href:`${pageHref(locale,"07b-shell-lower","manager")}#api-ShellMenu`}]);assert.ok(!roles.some(r=>r.id==="api-Dialog"||r.href.endsWith("#api-Dialog")));}
  for(const query of ["StateView","brand-identity","tcrn-brand-mark.svg",""," "])assert.deepEqual(sourceSearch(locale,query,"manager"),[]);
  const html=renderToStaticMarkup(createElement(App,{page:"06-inputs",locale,entry:"manager"}));
  assert.equal((html.match(/<main\b/g)??[]).length,1);
  assert.ok(html.includes(`lang="${locale}" data-approved-board="06-inputs"`));
  assert.ok(html.includes('data-published-api-reference')&&html.includes('id="api-MultiSelect"')&&html.includes('id="source"'));
  assert.doesNotMatch(html,/data-approved-api="Button"/);
 }
});

test("portal routes, topic membership and document paths agree in both entrypoints and all languages", () => {
  const primary = ["index", "01-tokens", "04-brand", "05-actions", "07a-shell-upper"] as const;
  const chapters = [
    ["01-tokens", "02-typography", "03-icons"],
    ["04-brand"],
    ["05-actions", "06-inputs", "api"],
    ["07a-shell-upper", "07b-shell-lower"],
  ];
  const htmlHref = (href: string) => href.replaceAll("&", "&amp;");
  for (const locale of supportedLocales) {
    for (const entry of ["static", "manager"] as const) {
      const nav = docsNavigation(locale, entry);
      const destinations = primary.map(page => pageHref(locale, page, entry));
      assert.deepEqual(nav.primary.map(item => item.id), primary);
      assert.deepEqual(nav.cards.map(card => card.chapters.map(chapter => chapter.id)), chapters);
      assert.deepEqual(nav.cards.map(card => card.href), destinations.slice(1));
      const portal = renderToString(createElement(App, { page: "index", locale, entry }));
      const top = /<nav class="tcrn-shell-pins docs-topics"[^>]*>(.*?)<\/nav>/.exec(portal)?.[1] ?? "";
      assert.deepEqual([...top.matchAll(/href="([^"]+)"/g)].map(match => match[1]), destinations.map(htmlHref));
      assert.equal((top.match(/aria-current="page"/g) ?? []).length, 1);
      assert.deepEqual(
        [...portal.matchAll(/class="portal-card__primary" href="([^"]+)"/g)].map(match => match[1]),
        destinations.slice(1).map(htmlHref),
      );
      assert.equal((portal.match(/class="portal-glimpse" inert="" aria-hidden="true"/g) ?? []).length, 4);
      assert.doesNotMatch(portal.split("</header>", 1)[0], /data-shell-account|data-shell-product=/);
      const subpage = renderToString(createElement(App, { page: "02-typography", locale, entry }));
      const subpageTop = /<nav class="tcrn-shell-pins docs-topics"[^>]*>(.*?)<\/nav>/.exec(subpage)?.[1] ?? "";
      assert.doesNotMatch(subpageTop, /aria-current="page"/);
      assert.ok(subpageTop.includes(`href="${htmlHref(destinations[1])}" class="tcrn-shell-pins__item" data-current-topic=""`));
      const trail = /<nav class="tcrn-breadcrumb"[^>]*>(.*?)<\/nav>/.exec(subpage)?.[1] ?? "";
      assert.ok(trail.includes(`href="${htmlHref(destinations[0])}"`));
      assert.ok(trail.includes(`href="${htmlHref(destinations[1])}"`));
      assert.match(trail, /<b [^>]*aria-current="page"/);
    }
  }
});
