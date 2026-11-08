import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { App } from "./app.js";
import { docsNavigation, docsPinnedNavigation, managerFragment, pageHref, searchDocs } from "./portal-navigation.js";
import { approvedApi } from "./approved-api.js";
import { approvedSource,supportedLocales } from "./approved-source.js";
import { contractStories } from "./contract-stories/kernel.js";
const manager = { managerPath: "/docs/index.html" };
const expected=["01-tokens","02-typography","03-icons","04-brand","05-actions","06-inputs","07a-shell-upper","07b-shell-lower"];
test("V3 static registry is the fixed published eight-board set, not an independent old story/API catalogue",()=>{assert.deepEqual(contractStories.map(s=>s.id),expected);assert.equal(approvedApi.length,28);for(const name of ["TcrnBrandMark","StateView","Badge","Field","LineNumberedEditor","Tooltip","Dialog"])assert.ok(!approvedApi.some(a=>a.name===name));assert.equal(approvedSource.site.sourceCommit,"a643d4cfcd239f6f81b1715ded6a63caead9d619");});
test("all five home pages retain machine source identity and current destinations",()=>{for(const locale of supportedLocales){const html=renderToStaticMarkup(createElement(App,{page:"index",locale}));assert.ok(html.includes(`data-published-source="${approvedSource.site.sourceCommit}"`));assert.ok(html.includes(`/${locale}/01-tokens.html`));assert.doesNotMatch(html,/tcrn-brand-mark\.svg|tcrn-aos-two-line|Style Guide|data-brand-asset="tcrn-brand-mark"|portal-footer|Sites v1|source\.html/);}});

test("the five-language search uses current boards and component contracts",()=>{for(const locale of supportedLocales){const hits=searchDocs(locale,"MultiSelect");assert.ok(hits.some(r=>r.id==="api-MultiSelect"&&r.href===`/${locale}/api.html#api-MultiSelect`));
 for(const query of ["Dialog","  ＤｉＡｌＯｇ  "]){const roles=searchDocs(locale,query);assert.deepEqual(roles.map(({id,href})=>({id,href})),["ShellBrandButton","ShellMenu"].map(name=>({id:`api-${name}`,href:`/${locale}/api.html#api-${name}`})));assert.ok(!roles.some(r=>r.id==="api-Dialog"||r.href.endsWith("#api-Dialog")));}
 for(const query of ["StateView","brand-identity","tcrn-brand-mark.svg",approvedSource.site.sourceCommit,""," "])assert.deepEqual(searchDocs(locale,query),[]);
}});


test("direct canvas documents retain current board and API destinations in all locales",()=>{
 for(const locale of supportedLocales){
  const { directory } = docsNavigation(locale, "canvas");
  const destinations = directory.flatMap(group => group.items.map(item => item.href));
  for (const board of approvedSource.boards) {
   assert.equal(destinations.filter(href => href === pageHref(locale, board.slug, "canvas")).length, 1);
  }
  for(const api of approvedApi){const hit=searchDocs(locale,api.name,"canvas").find(r=>r.id===`api-${api.name}`);assert.equal(hit?.href,`${pageHref(locale,api.board,"canvas")}#api-${api.name}`);}
  for(const query of ["Dialog","  ＤｉＡｌＯｇ  "]){const roles=searchDocs(locale,query,"canvas");assert.deepEqual(roles.map(({id,href})=>({id,href})),[{id:"api-ShellBrandButton",href:`${pageHref(locale,"07a-shell-upper","canvas")}#api-ShellBrandButton`},{id:"api-ShellMenu",href:`${pageHref(locale,"07b-shell-lower","canvas")}#api-ShellMenu`}]);assert.ok(!roles.some(r=>r.id==="api-Dialog"||r.href.endsWith("#api-Dialog")));}
  for(const query of ["StateView","brand-identity","tcrn-brand-mark.svg",approvedSource.site.sourceCommit,""," "])assert.deepEqual(searchDocs(locale,query,"canvas"),[]);
  const html=renderToStaticMarkup(createElement(App,{page:"06-inputs",locale,entry:"canvas"}));
  assert.equal((html.match(/<main\b/g)??[]).length,1);
  assert.ok(html.includes(`lang="${locale}" data-approved-board="06-inputs"`));
  assert.ok(html.includes('data-published-api-reference')&&html.includes('id="api-MultiSelect"'));
  assert.doesNotMatch(html, /id="source"|published-standards--source/);
  assert.doesNotMatch(html,/data-approved-api="Button"/);
 }
});

test("portal routes, topic membership and document paths agree in all three entrypoints and five languages", () => {
  const primary = ["index", "01-tokens", "04-brand", "05-actions", "07a-shell-upper"] as const;
  const categoryIds = ["foundations", "brand", "components", "shell"] as const;
  const chapters = [
    ["01-tokens", "02-typography", "03-icons"],
    ["04-brand"],
    ["05-actions", "06-inputs", "api"],
    ["07a-shell-upper", "07b-shell-lower"],
  ];
  const htmlHref = (href: string) => href.replaceAll("&", "&amp;");
  for (const locale of supportedLocales) {
    for (const entry of ["static", "canvas", manager] as const) {
      const nav = docsNavigation(locale, entry);
      const destinations = primary.map(page => pageHref(locale, page, entry));
      assert.deepEqual(nav.categories.map(category => category.id), categoryIds);
      assert.deepEqual(nav.categories.map(category => category.pageId), primary.slice(1));
      assert.deepEqual(nav.cards.map(card => card.chapters.map(chapter => chapter.id)), chapters);
      assert.deepEqual(nav.cards.map(card => card.href), destinations.slice(1));
      assert.deepEqual(nav.directory.map(group => group.id), ["portal", ...categoryIds]);
      assert.deepEqual(nav.directory.map(group => group.items.map(item => item.id)), [
        ["index"],
        ["01-tokens", "02-typography", "03-icons"],
        ["04-brand"],
        ["05-actions", "06-inputs", "api-branch"],
        ["07a-shell-upper", "07b-shell-lower"],
      ]);
      const apiBranch = nav.categories.find(category => category.id === "components")!.items.find(item => item.id === "api-branch")!;
      type MenuNode = { id: string; label: string; href?: string; children?: readonly MenuNode[] };
      const apiChildren = (apiBranch as MenuNode).children;
      const flatten = (items: readonly MenuNode[]): readonly MenuNode[] => items.flatMap(item => [item, ...flatten(item.children ?? [])]);
      const allApiChildren = flatten(apiChildren ?? []);
      assert.deepEqual(apiChildren?.map(item => item.id), ["api", ...approvedSource.boards.filter(board => approvedApi.some(component => component.board === board.slug)).map(board => `api-family-${board.slug}`), "api-adopted-support"]);
      assert.equal(apiChildren?.[0]?.label, locale === "zh-CN" ? "概览" : locale === "ja" ? "概要" : locale === "ko" ? "개요" : locale === "fr" ? "Aperçu" : "Overview");
      assert.equal(apiChildren?.[0]?.href, pageHref(locale, "api", entry));
      for (const component of approvedApi) {
        assert.equal(allApiChildren.find(item => item.id === `api-${component.name}`)?.href,
          pageHref(locale, "api", entry, `api-${component.name}`));
      }
      const portal = renderToString(createElement(App, { page: "index", locale, entry }));
      assert.match(portal, /href="#standards-content"/);
      assert.match(portal, /href="#standards"/);
      const top = /<div class="docs-topic-nav"[^>]*>(.*?)<\/header>/.exec(portal)?.[1]?.split('<div class="tcrn-shell-cluster docs-preferences"')[0] ?? "";
      assert.deepEqual([...top.matchAll(/class="tcrn-shell-pins__item" href="([^"]+)"/g)].map(match => match[1]), [destinations[0]].map(htmlHref));
      assert.deepEqual([...top.matchAll(/data-pin="([^"]+)"/g)].map(match => match[1]), categoryIds);
      assert.equal((top.match(/aria-expanded="false"/g) ?? []).length, 5);
      assert.equal((top.match(/aria-controls=/g) ?? []).length, 5);
      assert.equal((top.match(/aria-current="page"/g) ?? []).length, 1);
      assert.deepEqual(
        [...portal.matchAll(/class="portal-card__primary" href="([^"]+)"/g)].map(match => match[1]),
        destinations.slice(1).map(htmlHref),
      );
      assert.equal((portal.match(/class="portal-glimpse" inert="" aria-hidden="true"/g) ?? []).length, 4);
      assert.doesNotMatch(portal.split("</header>", 1)[0], /data-shell-account|data-shell-product=/);
      const subpage = renderToString(createElement(App, { page: "02-typography", locale, entry }));
      const subpageTop = /<div class="docs-topic-nav"[^>]*>(.*?)<\/header>/.exec(subpage)?.[1]?.split('<div class="tcrn-shell-cluster docs-preferences"')[0] ?? "";
      assert.equal((subpageTop.match(/aria-current="page"/g) ?? []).length, 1);
      assert.ok(subpageTop.includes(`href="${htmlHref(pageHref(locale, "02-typography", entry))}" aria-current="page"`));
      assert.match(subpageTop, /data-pin="foundations"[^>]*><button[^>]*aria-current="true"/);
      const trail = /<nav class="tcrn-breadcrumb"[^>]*>(.*?)<\/nav>/.exec(subpage)?.[1]?.split('<div class="tcrn-shell-cluster docs-preferences"')[0] ?? "";
      assert.ok(trail.includes(`href="${htmlHref(destinations[0])}"`));
      assert.ok(trail.includes(`href="${htmlHref(destinations[1])}"`));
      assert.match(trail, /<b [^>]*aria-current="page"/);
    }
  }
});

test("Manager links address the registered story and keep routed fragments scoped to that story", () => {
  const locale = "fr";
  assert.equal(pageHref(locale, "06-inputs", "static"), "/fr/06-inputs.html");
  assert.equal(pageHref(locale, "06-inputs", "canvas", "api-MultiSelect"),
    "/iframe.html?id=published-standards--inputs&viewMode=story&globals=locale:fr#api-MultiSelect");

  const crossStory = searchDocs(locale, "MultiSelect", manager, "index").find(hit => hit.id === "api-MultiSelect");
  assert.equal(crossStory?.href,
    "/docs/index.html?path=/story/published-standards--inputs&globals=locale:fr&docsAnchor=published-standards--inputs:api-MultiSelect");
  const { search } = new URL(crossStory!.href, "https://example.test");
  assert.equal(managerFragment("06-inputs", search), "api-MultiSelect");
  assert.equal(managerFragment("07a-shell-upper", search), "");
  const localApi = searchDocs(locale, "MultiSelect", manager, "06-inputs").find(hit => hit.id === "api-MultiSelect");
  assert.equal(localApi?.href, "#api-MultiSelect");
  const localSource = searchDocs(locale, approvedSource.site.sourceCommit, manager, "06-inputs");
  assert.deepEqual(localSource, []);
  const source = searchDocs(locale, approvedSource.site.sourceCommit, manager, "index");
  assert.deepEqual(source, []);

  const board = renderToStaticMarkup(createElement(App, { page: "06-inputs", locale, entry: manager }));
  assert.match(board, /id="api-MultiSelect"/);
  assert.doesNotMatch(board, /id="source"|06-inputs \/ L\d+/);
  assert.ok(!board.includes(`href="${approvedSource.site.url}`));
  const api = renderToStaticMarkup(createElement(App, { page: "api", locale, entry: manager }));
  assert.ok(api.includes('href="/docs/index.html?path=/story/published-standards--inputs&amp;globals=locale:fr">Exemples interactifs · Champs de saisie</a>'));
});


test("pin preferences resolve groups, branches and leaves by stable ID across locale and entry routes", () => {
  const ids = ["components", "api-branch", "api-Button", "02-typography", "components", "missing"];
  for (const locale of supportedLocales) for (const entry of ["static", "canvas", manager] as const) {
    const nav = docsNavigation(locale, entry);
    const pins = docsPinnedNavigation(nav.directory, ids);
    assert.deepEqual(pins.map(pin => pin.id), ids.slice(0, 4));
    assert.equal(pins[0].items.length, 3);
    assert.equal(pins[1].items.length, new Set(approvedApi.map(component => component.board)).size + 2);
    assert.deepEqual(pins[2].items, []);
    assert.equal(pins[2].href, pageHref(locale, "api", entry, "api-Button"));
    assert.equal(pins[3].href, pageHref(locale, "02-typography", entry));
  }
});


test("formal component states use the same executable examples in portal and CSF", async () => {
  const { componentStates } = await import("./component-catalog.js");
  const { ComponentExample } = await import("./component-examples.js");
  assert.deepEqual(Object.keys(componentStates), approvedApi.map(api => api.name));
  for (const [name, states] of Object.entries(componentStates)) {
    for (const state of states) {
      const html = renderToStaticMarkup(createElement(ComponentExample, { name: name as keyof typeof componentStates, state, locale: "en" }));
      assert.ok(html.includes(`data-component-example="${name}"`), `${name}/${state}`);
      assert.ok(html.includes(`data-example-state="${state}"`), `${name}/${state}`);
    }
  }
  const api = renderToStaticMarkup(createElement(App, { page: "api", locale: "en" }));
  for (const name of Object.keys(componentStates)) assert.ok(api.includes(`data-component-example="${name}"`));
});
