import test from "node:test";
import assert from "node:assert/strict";
import { act, useState, type ReactNode } from "react";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import {
  Tabs,
  ModuleTabs,
  SectionTabs,
  SegmentedNav,
  Pagination,
  Breadcrumb,
  ProductLauncher,
  ProductSwitcher,
  ProductShell,
  ProductShellSearch,
  ShellBrandLockup,
  ShellLocaleMenu,
  ShellThemeToggle,
  SideNavCollapseButton,
  SkipLink,
  SideNav,
  NavGroup,
  NavItem,
  ProductLogo,
  ProductLockup,
  TcrnBrandMark,
  tcrnComponentCss,
  tcrnRetiredComponentCss,
  tcrnProductLogoRegistry,
  tcrnProductMarkIds,
  tcrnProductMarkSvg,
  tcrnProductTagline,
  readPreferenceCookieValues,
  useProductShellController,
  type ProductShellControllerConfig,
  type ProductShellNavGroup,
  type ProductShellProps,
  type ProductShellRequestPreferences,
  type ShellThemeMode
} from "./Navigation.js";
import { tcrnProductMarks } from "./product-marks.generated.js";
import { PageHeader, TocRail, ViewTabs } from "../DataDisplay/DomainDisplay.js";
import { createResolvedTokenMap, createTokenMap } from "@tcrn/ui-tokens";
import { createDomInteractionHarness } from "../../test/dom-harness.js";
import * as brandSegments from "../../styles/brand.css.js";

test("tabs use honest segmented navigation semantics", () => {
  const html = renderToStaticMarkup(<ModuleTabs items={[{ id: "overview", label: "Overview", selected: true }, { id: "proof", label: "Proof" }]} />);
  assert.match(html, /data-tab-semantics="segmented-navigation"/);
  assert.match(html, /aria-current="page"/);
  assert.match(html, /data-selected="true"/);
  assert.doesNotMatch(html, /role="tab"/);
  assert.doesNotMatch(html, /role="tablist"/);

  const segmented = renderToStaticMarkup(<SegmentedNav items={[{ id: "queue", label: "Queue", selected: true }, { id: "history", label: "History" }]} />);
  assert.match(segmented, /tcrn-segmented-nav/);
  assert.match(segmented, /data-tab-semantics="segmented-navigation"/);
  assert.doesNotMatch(segmented, /role="tab"/);

  const local = renderToStaticMarkup(<SectionTabs label="Settings sections" items={[{ id: "general", label: "General", selected: true }]} />);
  assert.match(local, /aria-label="Settings sections"/);
});

test("breadcrumb separates route segments without concatenating labels", () => {
  const html = renderToStaticMarkup(
    <Breadcrumb items={[{ id: "root", label: "TCRN" }, { id: "components", label: "Components", selected: true }]} />
  );
  assert.match(html, /class="tcrn-breadcrumb"/);
  assert.match(html, /data-icon-name="chevron-right"/);
  assert.match(html, /class="[^"]*tcrn-breadcrumb__separator/);
  assert.match(html, /aria-current="page">Components</);
  assert.doesNotMatch(html, /TCRNComponents/);
});

test("pagination only renders a truthful cursor range", () => {
  assert.equal(renderToStaticMarkup(<Pagination label="分页" />), "");
  assert.equal(renderToStaticMarkup(<Pagination label="分页" shown={10} total={10} nextHref="/next" />), "");

  const html = renderToStaticMarkup(
    <Pagination label="分页" shown={50} total={137} prevHref="/prev" nextHref="/next" locale="zh-CN" />,
  );
  assert.match(html, /class="tcrn-pagination"/);
  assert.match(html, /显示 <b>50<\/b> 条，共 <b>137<\/b> 条/);
  assert.match(html, /class="tcrn-link tcrn-pagination__prev" href="\/prev">上一页<\/a>/);
  assert.match(html, /class="tcrn-link tcrn-pagination__next" href="\/next">下一页<\/a>/);
  assert.doesNotMatch(html, /pageCount|第\s*\d+\s*页/u);

  const noNext = renderToStaticMarkup(<Pagination label="Pagination" shown={1} total={2} />);
  assert.doesNotMatch(noNext, /tcrn-pagination__next/);
});

// The href is the whole capability, and until this test existed it was unasserted:
// every breadcrumb check in this repository read the nav element, the separator, or
// the aria-current span, so `Breadcrumb` could have gone back to rendering inert
// spans and the full gate suite would have stayed green. That is the shape of the
// defect a consumer reported — a trail that says where you are and offers no way to
// leave — surviving as a component that passes its own tests.
test("breadcrumb ancestors are links and the current page is not", () => {
  const html = renderToStaticMarkup(
    <Breadcrumb
      items={[
        { id: "projects", label: "Design System", href: "/work-items?project=ds" },
        { id: "epic", label: "EPIC-030", href: "/work-items/TCRN-AOS-EPIC-030" },
        { id: "story", label: "STORY-104", selected: true }
      ]}
    />
  );
  assert.match(html, /<a class="tcrn-breadcrumb__crumb" href="\/work-items\?project=ds" title="Design System">Design System<\/a>/);
  assert.match(html, /<a class="tcrn-breadcrumb__crumb" href="\/work-items\/TCRN-AOS-EPIC-030" title="EPIC-030">EPIC-030<\/a>/);
  // The crumb the reader is standing on stays inert with aria-current, which is what
  // tells a screen-reader user which end of the trail they are at. A link here would
  // be a link to the page they are already on.
  assert.match(html, /<b class="tcrn-breadcrumb__crumb" title="STORY-104" aria-current="page">STORY-104<\/b>/);
  assert.equal((html.match(/<a /g) ?? []).length, 2);

  // `selected` outranks `href`, so a consumer that supplies both — the natural
  // mistake when the trail is built by mapping over ancestors — still gets an inert
  // current crumb rather than a self-link.
  const bothHtml = renderToStaticMarkup(
    <Breadcrumb items={[{ id: "here", label: "Here", href: "/here", selected: true }]} />
  );
  assert.doesNotMatch(bothHtml, /<a /);
  assert.match(bothHtml, /aria-current="page">Here</);

  // A trail with no hrefs at all is still legal markup — the component cannot know
  // whether a route has ancestors — so the rule that a drilled-down route must carry
  // them is enforced where the route is known: the consumer's own way-back gate.
  const inertHtml = renderToStaticMarkup(
    <Breadcrumb items={[{ id: "a", label: "A" }, { id: "b", label: "B", selected: true }]} />
  );
  assert.doesNotMatch(inertHtml, /<a /);
});

test("side navigation primitives render package-backed hierarchy and disabled reasons", () => {
  const html = renderToStaticMarkup(
    <>
      <SkipLink href="#content">Skip to content</SkipLink>
      <SideNav label="Component navigation">
        <NavGroup label="Components" selected>
          <NavItem href="#navigation" iconName="panel-left-open" selected>Navigation</NavItem>
          <NavItem href="#governance">Welcome and governance</NavItem>
          <NavItem href="#proof" iconName="alert-triangle" disabled disabledReason="Requires proof route">Proof</NavItem>
        </NavGroup>
      </SideNav>
    </>
  );
  assert.match(html, /class="tcrn-skip-link"/);
  assert.match(html, /class="tcrn-side-nav"/);
  assert.match(html, /data-navigation-primitive="side-nav"/);
  assert.match(html, /class="tcrn-nav-group"/);
  assert.match(html, /data-navigation-primitive="nav-group"/);
  assert.match(html, /class="tcrn-nav-item"/);
  assert.match(html, /aria-current="page"/);
  assert.match(html, /data-nav-item-has-icon="true"/);
  assert.match(html, /data-nav-item-has-icon="false"/);
  assert.match(html, /data-icon-name="panel-left-open"/);
  assert.match(html, /aria-disabled="true"/);
  assert.match(html, /data-disabled-reason="Requires proof route"/);
  assert.match(html, /title="Requires proof route"/);
  assert.match(html, /tabindex="-1"/);
  assert.doesNotMatch(html, /href="#proof"/);
  assert.match(html, /class="tcrn-nav-item__disabled-reason"/);
  assert.match(html, />Requires proof route</);
  const describedBy = html.match(/aria-describedby="([^"]+)"/)?.[1];
  assert.ok(describedBy);
  const reasonElement = html.match(/<span id="([^"]+)" class="tcrn-nav-item__disabled-reason">Requires proof route<\/span>/);
  assert.ok(reasonElement);
  assert.equal(describedBy, reasonElement[1]);
  assert.doesNotMatch(html, /tcrn-sr-only[^>]*>Requires proof route/);
  assert.doesNotMatch(html, /role="tab"/);
});

test("nav item density and nesting are data-driven", () => {
  const html = renderToStaticMarkup(<NavItem depth={2} href="#nested">Nested navigation</NavItem>);
  assert.match(html, /data-nav-depth="2"/);
  assert.match(html, /--tcrn-nav-item-depth:2/);
  assert.match(tcrnComponentCss, /--tcrn-nav-item-depth:\s*0/);
  assert.match(
    tcrnComponentCss,
    /min-height:\s*calc\(\s*var\(--tcrn-space-6\)\s*-\s*var\(--tcrn-space-0h\)\s*\)/,
  );
  assert.match(
    tcrnComponentCss,
    /\.tcrn-product-shell__sidebar \.tcrn-brand-wordmark__suffix--aos \{[\s\S]*color: var\(--tcrn-color-brand-primary\);/,
  );
});

// Composition one (O-1, TCRN-DS-SUB-090): the shell geometry comes from the shell tokens, the
// rail sits on the canvas colour with no right edge, and above the mobile breakpoint the rail
// guide column is 16 / 48 and the workspace is a sheet 12 from the shell edges.
test("STORY-140 GWT1 product shell is the top band and the paper, through the shell tokens", () => {
  const rule = (selector: string) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const found = new RegExp(`(?:^|\\n)${escaped} \\{([^}]*)\\}`).exec(tcrnComponentCss);
    assert.ok(found, `${selector} has a rule`);
    return found[1];
  };
  const root = rule(".tcrn-product-shell");
  assert.match(root, /position: relative;/, "the shell is the full menu's containing block");
  assert.match(root, /grid-template-rows: var\(--tcrn-shell-strip-h\) minmax\(0, 1fr\);/);
  assert.match(root, /overflow: clip;/);
  const strip = rule(".tcrn-shell-strip");
  assert.match(strip, /block-size: var\(--tcrn-shell-strip-h\);/);
  assert.match(strip, /padding: 0 var\(--tcrn-space-3\);/, "the brand button starts on the paper's edge");
  assert.match(strip, /border: 0;/);
  assert.match(strip, /background: none;/);
  const paper = rule(".tcrn-product-shell__paper");
  assert.match(paper, /margin: 0 var\(--tcrn-space-3\) var\(--tcrn-space-3\);/);
  assert.match(paper, /overflow: hidden;/);
  assert.match(paper, /border-radius: var\(--tcrn-radius-paper\);/);
  assert.match(paper, /background: var\(--tcrn-color-panel\);/);
  assert.match(paper, /box-shadow: var\(--tcrn-shadow-s1\);/);
  assert.match(rule(".tcrn-shell-cluster"), /gap: var\(--tcrn-space-1h\);[\s\S]*margin-inline-start: auto;/);
  assert.match(rule(".tcrn-shell-bell"), /inline-size: var\(--tcrn-control-height-md\);\n  block-size: var\(--tcrn-control-height-md\);/);
  assert.match(rule(".tcrn-shell-avatar"), /inline-size: var\(--tcrn-control-height-sm\);\n  block-size: var\(--tcrn-control-height-sm\);/);
  // Composition one (O-1) is withdrawn: no rail and its collapsed width, no lead column, no sheet
  // beside a rail, no top bar, no mobile drawer. The brand module is left out of this reading: it
  // still scopes three wordmark rules to the rail, which match nothing now and are its owner's.
  const shellRules = Object.values(brandSegments).reduce((css, segment) => (typeof segment === "string" && segment ? css.replace(segment, "") : css), tcrnComponentCss);
  for (const retired of [
    /\.tcrn-product-shell__sidebar/,
    /\.tcrn-product-shell__workspace/,
    /\.tcrn-product-shell__utility-row/,
    /\.tcrn-product-shell__current-location/,
    /data-product-shell-collapsed/,
    /data-mobile-nav-expanded/,
    /--tcrn-product-shell-sidebar-width/,
    /var\(--tcrn-shell-sidebar-width(?:-collapsed)?\)/,
    /var\(--tcrn-shell-topbar-height\)/,
    /@media not all and \(max-width: 760px\)/
  ]) {
    assert.doesNotMatch(shellRules, retired);
  }
  // The deprecated TopBar (TCRN-DS-SUB-125) keeps its own height, in the retired sheet only.
  assert.doesNotMatch(tcrnComponentCss, /\.tcrn-top-bar\b/);
  assert.match(tcrnRetiredComponentCss, /\.tcrn-top-bar \{\n  display: grid;\n  grid-template-columns: max-content max-content minmax\(0, 1fr\);\n  align-items: center;\n  gap: var\(--tcrn-space-4\);\n  min-height: 68px;/);
});

// The five-locale taglines of STORY-127, as the story states them. The registry
// takes them from the design contract; asserting the story's own words here is what
// catches the contract and the story drifting apart.
const storyTaglines = {
  tms: { "zh-CN": "艺人管理系统", en: "Talent Management System", ja: "タレントマネジメントシステム", ko: "탤런트 관리 시스템", fr: "Système de gestion des talents" },
  einzbern: { "zh-CN": "项目记忆引擎", en: "Project memory engine", ja: "プロジェクト記憶エンジン", ko: "프로젝트 메모리 엔진", fr: "Moteur de mémoire de projet" },
  "mana-orchestrate": { "zh-CN": "项目记忆助手", en: "Project memory assistant", ja: "プロジェクト記憶アシスタント", ko: "프로젝트 메모리 어시스턴트", fr: "Assistant mémoire de projet" },
  "design-system": { "zh-CN": "设计系统", en: "Design System", ja: "デザインシステム", ko: "디자인 시스템", fr: "Système de design" }
} as const;

test("registered product logos expose exact DS AOS and TMS lockups", () => {
  assert.equal(tcrnProductLogoRegistry["design-system"].assetId, "tcrn-design-system-two-line");
  assert.equal(tcrnProductLogoRegistry["design-system"].stackSuffix, true);
  assert.equal(tcrnProductLogoRegistry.aos.lineOne, "TCRN AOS");
  assert.equal(tcrnProductLogoRegistry.aos.stackSuffix, false);
  assert.equal(tcrnProductLogoRegistry.tms.lineOne, "TCRN TMS");
  assert.equal(tcrnProductLogoRegistry.tms.stackSuffix, false);
  // workflow was renamed einzbern, and mana-orchestrate joined it (STORY-127).
  assert.deepEqual(Object.keys(tcrnProductLogoRegistry).sort(), ["aos", "design-system", "einzbern", "mana-orchestrate", "tms"]);

  // The wordmark is a name and the tagline is copy, so they are asserted
  // differently on purpose: `lineOne` is one Latin string in every locale, while
  // `lineTwo` must carry all five. Checking only the English member would leave
  // the same hole the old single-string shape had — it read as complete.
  for (const productId of Object.keys(tcrnProductLogoRegistry) as Array<keyof typeof tcrnProductLogoRegistry>) {
    assert.deepEqual(
      Object.keys(tcrnProductLogoRegistry[productId].lineTwo).sort(),
      ["en", "fr", "ja", "ko", "zh-CN"],
      `${productId} tagline must carry all five locales`
    );
  }
  for (const productId of Object.keys(storyTaglines) as Array<keyof typeof storyTaglines>) {
    assert.deepEqual({ ...tcrnProductLogoRegistry[productId].lineTwo }, storyTaglines[productId], `${productId} taglines follow STORY-127`);
  }
  assert.equal(tcrnProductLogoRegistry.aos.lineTwo.en, "AI Operation System");
  assert.equal(tcrnProductLogoRegistry.aos.lineTwo["zh-CN"], "AI 运营系统");
  assert.equal(tcrnProductTagline("aos", "ja"), "AI オペレーションシステム");
  // An unknown or absent locale resolves to the fallback rather than throwing:
  // a consumer that never passes one keeps today's English instead of losing the
  // line altogether.
  assert.equal(tcrnProductTagline("aos"), "AI Operation System");
  assert.equal(tcrnProductTagline("aos", "de"), "AI Operation System");

  const html = renderToStaticMarkup(
    <>
      <ProductLogo productId="design-system" />
      <ProductLogo productId="aos" />
      <ProductLogo productId="tms" />
    </>
  );

  assert.match(html, /data-registered-product-logo="@tcrn\/ui-react\/ProductLogo"/);
  assert.match(html, /class="tcrn-product-logo tcrn-product-logo--stacked-suffix"[^>]*data-product-id="design-system"/);
  assert.match(html, /data-product-logo-asset-id="tcrn-design-system-two-line"/);
  assert.match(html, /data-product-id="aos"/);
  assert.match(html, /data-product-logo-asset-id="tcrn-aos-two-line"/);
  assert.match(html, /class="tcrn-product-logo__line-one-base">TCRN</);
  assert.match(html, /class="tcrn-product-logo__line-one-suffix tcrn-brand-wordmark__suffix--aos">AOS</);
  assert.match(html, />AI Operation System</);
  assert.match(html, /data-product-id="tms"/);
  assert.match(html, /data-product-logo-asset-id="tcrn-tms-two-line"/);
  assert.match(html, /class="tcrn-product-logo__line-one-suffix tcrn-brand-wordmark__suffix--tms">TMS</);
  assert.match(html, /class="tcrn-product-logo__line-one-suffix tcrn-brand-wordmark__suffix--design-system">Design System</);
  assert.match(html, />Talent Management System</);
  assert.doesNotMatch(html, /Rebuild workspace/);
  // TMS and the design system draw their own marks inline; AOS keeps the mother mark. The colour
  // mark carries data-logo like the first line's (C-6, TCRN-DS-SUB-144).
  assert.match(html, /<svg data-logo="design-system" class="tcrn-brand-mark"[^>]*data-product-mark="design-system"[^>]*data-product-mark-variant="color"/);
  assert.match(html, /<svg data-logo="tms" class="tcrn-brand-mark"[^>]*data-product-mark="tms"[^>]*data-product-mark-variant="color"/);
  assert.doesNotMatch(renderToStaticMarkup(<ProductLogo productId="tms" markVariant="mono" />), /data-logo=/, "a mono mark is not the logos2 file and carries no data-logo");
  // The Brand board's section E writing: <b>{word} <em>{suffix}</em></b> and the tagline a <small>.
  assert.match(
    html,
    /<b class="tcrn-product-logo__line-one" aria-label="TCRN TMS"><span class="tcrn-product-logo__line-one-base">TCRN<\/span> <em class="tcrn-product-logo__line-one-suffix tcrn-brand-wordmark__suffix--tms">TMS<\/em><\/b><small class="tcrn-product-logo__line-two">Talent Management System<\/small>/
  );
  assert.match(tcrnComponentCss, /\.tcrn-product-logo__line-one-suffix \{[^}]*font-style: normal;/);
  assert.match(html, /<img[^>]*class="tcrn-brand-mark"[^>]*src="tcrn-brand-mark\.svg"[^>]*>/);
  assert.equal((html.match(/<img\b/g) ?? []).length, 1);

  // The same three lockups on a ja route. The wordmarks are unchanged and the
  // taglines are not — including the accessible name, so a screen-reader user
  // hears the brand the way a sighted reader sees it.
  const jaHtml = renderToStaticMarkup(
    <>
      <ProductLogo productId="design-system" locale="ja" />
      <ProductLogo productId="aos" locale="ja" />
      <ProductLogo productId="tms" locale="ja" />
    </>
  );
  assert.match(jaHtml, /class="tcrn-product-logo__line-two">デザインシステム</);
  assert.match(jaHtml, /class="tcrn-product-logo__line-two">AI オペレーションシステム</);
  assert.match(jaHtml, /class="tcrn-product-logo__line-two">タレントマネジメントシステム</);
  assert.match(jaHtml, /aria-label="TCRN AOS AI オペレーションシステム"/);
  assert.match(jaHtml, /class="tcrn-product-logo__line-one-suffix tcrn-brand-wordmark__suffix--aos">AOS</);
  assert.doesNotMatch(jaHtml, />AI Operation System</);
  assert.doesNotMatch(jaHtml, />Talent Management System</);
  assert.match(renderToStaticMarkup(<ProductLogo productId="tms" locale="zh-CN" />), /class="tcrn-product-logo__line-two">艺人管理系统</);

  const longSuffixLockupHtml = renderToStaticMarkup(<ProductLockup suffix="Design System" suffixClassName="tcrn-brand-wordmark__suffix--design-system" />);
  assert.match(longSuffixLockupHtml, /tcrn-brand-lockup--long-name/);
});

test("Einzbern and Mana Orchestrate are whole serif names with the byline and no host name", () => {
  // STORY-127 GWT1.
  const jaHtml = renderToStaticMarkup(<ProductLogo productId="mana-orchestrate" locale="ja" />);
  assert.match(jaHtml, /class="tcrn-product-logo__line-two">プロジェクト記憶アシスタント</);
  assert.match(jaHtml, /aria-label="Mana Orchestrate プロジェクト記憶アシスタント"/);
  assert.doesNotMatch(jaHtml, /Claude|Codex/i);

  for (const productId of ["einzbern", "mana-orchestrate"] as const) {
    const entry = tcrnProductLogoRegistry[productId];
    assert.equal(entry.wordmark, "serif");
    assert.equal(entry.byline, "by TCRN");
    assert.equal(entry.lineOneSuffix, null);
    const html = renderToStaticMarkup(<ProductLogo productId={productId} locale="en" />);
    assert.match(html, new RegExp(`class="tcrn-product-logo tcrn-product-logo--serif"[^>]*data-product-id="${productId}"[^>]*data-product-wordmark="serif"`));
    assert.match(html, new RegExp(`class="tcrn-product-logo__line-one-base">${entry.lineOne}<`));
    assert.match(html, /class="tcrn-product-logo__byline">by TCRN</);
    assert.doesNotMatch(html, /tcrn-product-logo__line-one-suffix/);
    assert.match(html, new RegExp(`<svg data-logo="${productId}" class="tcrn-brand-mark"[^>]*data-product-mark="${productId}"`));
    assert.match(html, new RegExp(`<b class="tcrn-product-logo__line-one" aria-label="${entry.lineOne}"><span class="tcrn-product-logo__line-one-base">${entry.lineOne}</span></b><small class="tcrn-product-logo__line-two">`));
  }
  assert.equal(tcrnProductLogoRegistry.einzbern.lineOne, "Einzbern");
  assert.equal(tcrnProductLogoRegistry["mana-orchestrate"].lineOne, "Mana Orchestrate");
  // No product name or tagline mentions a host (Owner 2026-10-11).
  assert.doesNotMatch(JSON.stringify(tcrnProductLogoRegistry), /Claude|Codex/i);
});

test("TcrnBrandMark draws a registered product mark inline in four renditions and keeps the mother mark otherwise", () => {
  assert.deepEqual([...tcrnProductMarkIds].sort(), tcrnProductMarks.map((mark) => mark.productId).sort());
  const innerOf = (markup: string) => markup.replace(/^<svg\b[^>]*>/u, "").replace(/<\/svg>\s*$/u, "");

  for (const mark of tcrnProductMarks) {
    const productId = mark.productId as (typeof tcrnProductMarkIds)[number];
    const color = renderToStaticMarkup(<TcrnBrandMark productId={productId} />);
    assert.match(color, /^<svg class="tcrn-brand-mark" viewBox="0 0 48 48" role="img"/);
    assert.match(color, new RegExp(`aria-label="${mark.name}"`));
    assert.match(color, /data-product-mark-variant="color"/);
    assert.equal(innerOf(color), mark.colorBody);

    const mono = renderToStaticMarkup(<TcrnBrandMark productId={productId} variant="mono" />);
    assert.equal(innerOf(mono), mark.inkBody);
    assert.doesNotMatch(innerOf(mono), /#[0-9a-f]{6}/i, `${productId} mono follows the text colour`);

    const tint = renderToStaticMarkup(<TcrnBrandMark productId={productId} variant="tile-tint" />);
    assert.equal(innerOf(tint), `<rect width="48" height="48" rx="11" fill="${mark.palette.tint}"/><g transform="translate(7.2 7.2) scale(0.7)">${mark.colorBody}</g>`);
    const deep = renderToStaticMarkup(<TcrnBrandMark productId={productId} variant="tile-deep" />);
    assert.equal(innerOf(deep), `<rect width="48" height="48" rx="11" fill="${mark.palette.deep}"/><g transform="translate(7.2 7.2) scale(0.7)">${mark.inkBody.replaceAll("currentColor", "#ffffff")}</g>`);

    // The file rendition is the standalone SVG the logos board writes.
    assert.equal(
      tcrnProductMarkSvg(productId),
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" role="img" aria-label="${mark.name}">${mark.colorBody}</svg>\n`
    );
    assert.equal(innerOf(tcrnProductMarkSvg(productId, "mono", { ink: "#16150f" })), mark.inkBody.replaceAll("currentColor", "#16150f"));
  }

  // Without a productId the component is still the mother mark image.
  const mother = renderToStaticMarkup(<TcrnBrandMark />);
  assert.match(mother, /<img[^>]*class="tcrn-brand-mark"[^>]*src="tcrn-brand-mark\.svg"[^>]*data-brand-asset="tcrn-brand-mark"/);
  assert.doesNotMatch(mother, /<svg/);
  // A lockup without a productId keeps the mother mark too.
  assert.match(renderToStaticMarkup(<ProductLockup suffix="TMS" suffixClassName="tcrn-brand-wordmark__suffix--tms" />), /<img[^>]*class="tcrn-brand-mark"/);
  // A lockup with a productId passes the rendition through.
  assert.match(renderToStaticMarkup(<ProductLockup productId="einzbern" markVariant="tile-deep" />), /data-product-mark-variant="tile-deep"/);
});

const shellLocales = [
  { locale: "en", nativeName: "English" },
  { locale: "zh-CN", nativeName: "简体中文" }
];

const shellNavGroups: ProductShellNavGroup[] = [
  {
    id: "talent",
    label: "Talent",
    items: [
      { id: "roster", label: "Roster", href: "/roster", iconName: "users", selected: true },
      {
        id: "contracts",
        label: "Contracts",
        iconName: "layers",
        children: [
          { id: "contracts-active", label: "Active", href: "/contracts/active" },
          { id: "contracts-drafts", label: "Drafts", href: "/contracts/drafts" }
        ]
      }
    ]
  },
  { id: "finance", label: "Finance", items: [{ id: "statements", label: "Statements", href: "/statements", iconName: "database" }] }
];

test("STORY-140 GWT2 product shell renders one shell: the band, the cluster and the paper, with no side rail", () => {
  const html = renderToStaticMarkup(
    <ProductShell
      productName="TCRN TMS"
      moduleName="Talent"
      brandProductId="tms"
      currentRouteLabel="Roster"
      pageHeader={{ title: "Roster" }}
      currentRouteLabelKey="story.roster.title"
      navGroups={shellNavGroups}
      pinnedIds={["roster", "contracts"]}
      onPinnedChange={() => undefined}
      notifications={{ unread: 3 }}
      account={{ name: "Lin Xiao" }}
      locales={shellLocales}
      currentLocale="en"
      currentTheme="dark"
    >
      <section>Fixture-safe roster content</section>
    </ProductShell>
  );

  assert.match(html, /^<div data-shell="" class="tcrn-product-shell" data-state="closed"/);
  assert.match(html, /data-package-backed-product-shell-boundary="top-band-shell-v2"/);
  assert.match(html, /data-product-shell-pattern="top-band"/);
  assert.match(html, /data-product-shell-theme="dark"/);
  assert.match(html, /data-product-shell-current-route-label-key="story.roster.title"/);
  assert.match(html, /<header class="tcrn-shell-strip" aria-label="Talent shell controls" data-shell-strip=""/);
  // In the band: the brand button, the pinned items, the cluster; then the paper.
  const brand = html.indexOf("data-shell-brand=");
  const pins = html.indexOf("data-pins=");
  const cluster = html.indexOf("data-cluster=");
  const paper = html.indexOf("data-paper=");
  assert.ok(brand > -1 && brand < pins && pins < cluster && cluster < paper, "brand, pins, cluster, paper");
  assert.match(html, /data-logo="tms"/);
  assert.match(html, /aria-controls="[^"]*-menu"/, "the brand button controls the full menu");
  // The current page's pin is the current link; a pinned submenu opens its drop-down.
  assert.match(html, /<span class="tcrn-shell-pins__pin" data-pin="roster"><a class="tcrn-shell-pins__item" href="\/roster" aria-current="page">/);
  assert.match(html, /data-pin="contracts"><button type="button" class="tcrn-shell-pins__item" aria-haspopup="dialog" aria-expanded="false" aria-controls="[^"]*-drop-contracts"/);
  assert.match(html, /aria-label="Notifications · 3 unread" data-shell-bell=""/);
  assert.match(html, /class="tcrn-shell-bell__dot" aria-hidden="true"/);
  assert.match(html, /aria-label="Lin Xiao · Account, switch product, theme and language" aria-haspopup="dialog" aria-expanded="false"/);
  assert.match(html, /<span aria-hidden="true">L<\/span>/);
  assert.match(html, /<div class="tcrn-product-shell__paper" data-paper="" data-product-shell-region="paper"><section id="product-shell-content" class="tcrn-product-shell__main" data-product-shell-region="content" aria-label="Product shell workspace">/);
  assert.match(html, /Fixture-safe roster content/);
  // One shell: no side rail, no collapse control, no drawer toggle, no top bar; closed layers render nothing.
  for (const retired of [
    "tcrn-product-shell__sidebar",
    "tcrn-side-nav",
    "data-side-nav-toggle",
    "tcrn-shell-mobile-nav-toggle",
    "tcrn-product-shell__workspace",
    "tcrn-top-bar",
    "data-product-shell-collapsed",
    "data-panel="
  ]) {
    assert.equal(html.includes(retired), false, `${retired} is not in the shell`);
  }
});

test("STORY-146 GWT1 the page header is required and is the paper's first row", () => {
  const html = renderToStaticMarkup(
    <ProductShell
      productName="TCRN TMS"
      moduleName="Talent"
      brandProductId="tms"
      currentRouteLabel="Roster"
      pageHeader={{ title: "Roster", description: "24 people · 3 to invite" }}
      navGroups={shellNavGroups}
      locales={shellLocales}
      currentLocale="en"
    >
      <section>Fixture-safe roster content</section>
    </ProductShell>
  );
  // The paper holds the content region, and the page header opens it, before the page.
  assert.match(
    html,
    /<div class="tcrn-product-shell__paper" data-paper="" data-product-shell-region="paper"><section id="product-shell-content" class="tcrn-product-shell__main" data-product-shell-region="content" aria-label="Product shell workspace"><header class="tcrn-page-header tcrn-page-header--compact" data-pattern="page-header"/
  );
  assert.equal(html.match(/data-pattern="page-header"/g)?.length, 1, "one page header");
  assert.ok(html.indexOf('data-pattern="page-header"') < html.indexOf("Fixture-safe roster content"), "the header comes before the page");
  assert.match(html, /<h2 title="Roster" class="tcrn-heading tcrn-heading--2">Roster<\/h2><p class="tcrn-text[^"]*">24 people · 3 to invite<\/p>/);
  // An omitted trail is the current position in the menu model: the group, then the page, which is no link.
  assert.match(
    html,
    /<nav class="tcrn-breadcrumb" aria-label="Breadcrumbs"><span class="tcrn-breadcrumb__item"><span class="tcrn-breadcrumb__crumb" title="Talent">Talent<\/span><\/span><span class="tcrn-breadcrumb__item"><svg [^>]*data-icon-name="chevron-right" class="tcrn-icon tcrn-breadcrumb__separator"[^>]*>[\s\S]*?<\/svg><b class="tcrn-breadcrumb__crumb" title="Roster" aria-current="page">Roster<\/b><\/span><\/nav>/
  );
  // The consumer's own trail and language win over the shell's.
  const own = renderToStaticMarkup(
    <ProductShell
      productName="TCRN TMS"
      moduleName="Talent"
      brandProductId="tms"
      currentRouteLabel="Active"
      pageHeader={{ title: "Active", locale: "fr", breadcrumbs: [{ id: "contracts", label: "Contracts", href: "/contracts" }, { id: "active", label: "Active" }] }}
      navGroups={shellNavGroups}
      locales={shellLocales}
      currentLocale="en"
    >
      <section>Fixture-safe contract content</section>
    </ProductShell>
  );
  assert.match(own, /aria-label="Fil d’Ariane"><span class="tcrn-breadcrumb__item"><a class="tcrn-breadcrumb__crumb" href="\/contracts" title="Contracts">Contracts<\/a>/);
  assert.match(own, /<b class="tcrn-breadcrumb__crumb" title="Active" aria-current="page">Active<\/b>/);
  assert.equal(own.includes('title="Talent"'), false, "the derived trail is not added to the consumer's");

  // Type level: a shell page without a page header, or with one without a title, does not compile.
  const missing = (
    // @ts-expect-error the page header is required
    <ProductShell productName="TCRN TMS" moduleName="Talent" brandProductId="tms" currentRouteLabel="Roster" navGroups={[]} locales={shellLocales} currentLocale="en">
      <div>content</div>
    </ProductShell>
  );
  assert.ok(missing);
  const untitled: Pick<ProductShellProps, "pageHeader"> = {
    // @ts-expect-error a page header has a title
    pageHeader: { description: "No title" }
  };
  assert.ok(untitled);
});

test("STORY-146 GWT2 the trail stays on one line: crumbs give way with an ellipsis and carry a title", () => {
  const rule = (selector: string) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const found = new RegExp(`(?:^|\\n)${escaped} \\{([^}]*)\\}`).exec(tcrnComponentCss);
    assert.ok(found, `${selector} has a rule`);
    return found[1];
  };
  // The trail is the Breadcrumb component since TCRN-DS-SUB-124, so its rules are the Breadcrumb's.
  const trail = rule(".tcrn-breadcrumb");
  assert.match(trail, /flex-wrap: nowrap;/);
  assert.match(trail, /white-space: nowrap;/);
  assert.match(trail, /min-width: 0;/);
  assert.match(trail, /gap: var\(--tcrn-space-1h\);/, "the board's crumb gap 6");
  assert.match(trail, /overflow: hidden;/);
  assert.match(trail, /font-size: var\(--tcrn-type-size-meta\);/, "the board's crumb size 12");
  const item = rule(".tcrn-breadcrumb__item");
  for (const declaration of [/flex-wrap: nowrap;/, /white-space: nowrap;/, /min-width: 0;/, /overflow: hidden;/, /text-overflow: ellipsis;/, /gap: var\(--tcrn-space-1h\);/]) {
    assert.match(item, declaration);
  }
  assert.match(rule(".tcrn-breadcrumb__separator"), /flex: none;/);
  const crumb = rule(".tcrn-breadcrumb__crumb");
  assert.match(crumb, /overflow: hidden;/);
  assert.match(crumb, /text-overflow: ellipsis;/);
  assert.match(crumb, /min-width: 0;/);
  // The paper's inset and row gap are the board's .ts-content (14 28 12, gap 10), from space tokens.
  const main = rule(".tcrn-product-shell__main");
  assert.match(main, /padding: var\(--tcrn-space-3h\) calc\(2 \* var\(--tcrn-space-3h\)\) var\(--tcrn-space-3\);/);
  assert.match(main, /gap: var\(--tcrn-space-2h\);/);
  assert.match(main, /grid-template-columns: minmax\(0, 1fr\);/);
  // A long trail: every crumb carries its whole label as its title.
  const labels = ["Operations and partner management", "Contracts awaiting countersignature", "Agency renewals for the autumn season"];
  const html = renderToStaticMarkup(
    <ProductShell
      productName="TCRN TMS"
      moduleName="Talent"
      brandProductId="tms"
      currentRouteLabel={labels[2]}
      pageHeader={{ title: labels[2], breadcrumbs: labels.map((label, index) => ({ id: `crumb-${index}`, label, href: index < 2 ? "/" : undefined })) }}
      navGroups={[]}
      locales={shellLocales}
      currentLocale="en"
    >
      <section>Fixture-safe content</section>
    </ProductShell>
  );
  for (const label of labels) assert.match(html, new RegExp(`class="tcrn-breadcrumb__crumb"[^>]* title="${label}"|title="${label}"[^>]*aria-current="page"`));
});

test("product shell component css keeps motion shorthands valid", () => {
  assert.match(tcrnComponentCss, /--tcrn-motion-product-shell: var\(--tcrn-motion-emphasis\)/);
  assert.match(tcrnComponentCss, /--tcrn-motion-product-shell-search: 240ms var\(--tcrn-motion-ease-drawer\)/);
  // Elevation and inverse text are governed by @tcrn/ui-tokens now; a local
  // redefinition here would silently shadow the package and un-govern the look.
  assert.doesNotMatch(tcrnComponentCss, /--tcrn-elevation-floating:/);
  assert.doesNotMatch(tcrnComponentCss, /--tcrn-color-text-inverse:/);
  assert.match(tcrnComponentCss, /animation: tcrn-product-shell-theme-wash var\(--tcrn-motion-product-shell\) both;/);
  assert.match(tcrnComponentCss, /flex-basis var\(--tcrn-motion-product-shell-search\),[\s\S]*width var\(--tcrn-motion-product-shell-search\),[\s\S]*max-width var\(--tcrn-motion-product-shell-search\);/);
  assert.doesNotMatch(tcrnComponentCss, /var\(--tcrn-motion-emphasis\) ease/);
});

test("product shell component css carries the relocated component families (TCRN-DS-STORY-037)", () => {
  // The 24 genuine component families were moved out of the docs demo layer into the
  // package. A future accidental removal (or a revert to doc-only styling) must fail here.
  assert.match(tcrnComponentCss, /\.tcrn-field\b/);
  assert.match(tcrnComponentCss, /\.tcrn-tooltip__content\b/);
  assert.match(tcrnComponentCss, /\.tcrn-popover\b/);
  assert.match(tcrnComponentCss, /\.tcrn-breadcrumb\b/);
  assert.match(tcrnComponentCss, /\.tcrn-skeleton\b/);
  // Representative members across the other relocated families.
  assert.match(tcrnComponentCss, /\.tcrn-surface\b/);
  assert.match(tcrnComponentCss, /\.tcrn-state-surface\b/);
  assert.match(tcrnComponentCss, /\.tcrn-collapsible-region\b/);
  // The segmented nav renders the Tabs family since TCRN-DS-SUB-124, so the family's tab stands for it.
  assert.match(tcrnComponentCss, /\.tcrn-tabs__tab\b/);
  assert.match(tcrnComponentCss, /\.tcrn-highlight__mark\b/);
  assert.match(tcrnComponentCss, /@keyframes tcrn-skeleton-shimmer\b/);
  // The storybook-only static tooltip hook must NOT be shipped in the package; it stays
  // in the docs demo layer (it is not emitted by the Tooltip component).
  assert.doesNotMatch(tcrnComponentCss, /data-storybook-static-tooltip/);
  // .tcrn-filter-bar must not become a top-level package selector, or the shell-fidelity
  // duplicate-selector gate fires (it stays doc-side; package owns it only scoped).
  assert.doesNotMatch(tcrnComponentCss, /\n\.tcrn-filter-bar\s*[,{]/);
  // Guard: relocated rules reference tokens via var(); they must not DEFINE tokens.
  assert.doesNotMatch(tcrnComponentCss, /--tcrn-color-state-blocked:/);
  assert.doesNotMatch(tcrnComponentCss, /--tcrn-z-popover:/);
});

test("component-loop CSS ships independent roots for every returned construct", () => {
  for (const root of [
    "tcrn-switch",
    "tcrn-stat-card",
    "tcrn-setting-row",
    "tcrn-field-provenance",
    "tcrn-line-numbered-editor",
    "tcrn-app-status-bar",
    "tcrn-definition-list",
    "tcrn-lock-hint"
  ]) {
    assert.match(tcrnComponentCss, new RegExp(`\\.${root}\\b`), `${root} has a package CSS root`);
  }
  assert.match(tcrnComponentCss, /\.tcrn-line-numbered-editor__gutter[\s\S]*overflow: hidden;/);
  assert.match(tcrnComponentCss, /\.tcrn-line-numbered-editor__gutter li\[data-editor-line-finding="true"\]/);
  assert.match(tcrnComponentCss, /\.tcrn-setting-row__modified[\s\S]*border-radius: 50%;/);
  assert.match(tcrnComponentCss, /\.tcrn-definition-list__item[\s\S]*grid-template-columns:/);
  assert.match(tcrnComponentCss, /\.tcrn-tooltip__content\[data-tooltip-portal="true"\]/);
  assert.match(tcrnComponentCss, /\.tcrn-popover\[data-overlay-positioning="portal-fixed"\]/);
  assert.match(tcrnComponentCss, /\.tcrn-dictionary-table[\s\S]*data-dictionary-valid/);
});

test("product shell component css isolates topbar from docs chrome", () => {
  assert.match(tcrnComponentCss, /\.tcrn-product-shell \{[\s\S]*font-family: var\(--tcrn-type-family-ui\);[\s\S]*font-size: var\(--tcrn-type-size-ui\);[\s\S]*line-height: var\(--tcrn-type-line-ui\);/);
  // G+ focus in the shell: an element with no focus treatment of its own takes the focus
  // ring token over a transparent forced-colours outline, and the pair-driven controls
  // (buttons, links, text controls including the search control, selects, checkboxes,
  // radios, switches) are left to draw their own ring and edge from their pair tables.
  assert.match(tcrnComponentCss, /\.tcrn-product-shell :focus-visible:not\(\.tcrn-button, \.tcrn-link-button, \.tcrn-link, \.tcrn-input, \.tcrn-select, \.tcrn-checkbox, \.tcrn-radio-group__control, \.tcrn-switch__control\) \{\s*outline: 2px solid transparent;\s*outline-offset: 2px;\s*box-shadow: var\(--tcrn-focus-ring\);\s*\}/);
  // The search wrapper draws nothing, so the shell has no rule to clear on it; nor does
  // any shell rule clear the control's own edge or ring.
  assert.doesNotMatch(tcrnComponentCss, /\.tcrn-search-input:focus-within/);
  assert.doesNotMatch(tcrnComponentCss, /\.tcrn-search-input:where\(:focus-within\)/);
  assert.doesNotMatch(tcrnComponentCss, /\.tcrn-product-shell \.tcrn-search-input__control[^{]*\{[^}]*box-shadow: none/);
  assert.doesNotMatch(tcrnComponentCss, /\.tcrn-product-shell [^{]*\.tcrn-shell-(?:theme|side-nav)-toggle:focus-visible/);
  assert.match(tcrnComponentCss, /\.tcrn-nav-item\[data-nav-item-has-icon="false"\] \{[\s\S]*grid-template-columns: minmax\(0, 1fr\);/);
  assert.match(tcrnComponentCss, /\.tcrn-nav-item__content \{[\s\S]*min-width: 0;/);
  assert.match(tcrnComponentCss, /\.tcrn-nav-item__label \{[\s\S]*overflow-wrap: normal;[\s\S]*word-break: normal;/);
  // The selected nav item carries no shadow bar. (The earlier form of this check reached
  // past the rule with [\s\S]* to a later shell focus rule's box-shadow: none, so it held
  // only while that rule existed; it now reads the selected rule's own body.)
  const selectedNavItem = /\.tcrn-nav-item\[data-selected="true"\],\s*\.tcrn-nav-item\[aria-current="page"\] \{([^}]*)\}/.exec(tcrnComponentCss);
  assert.ok(selectedNavItem, "the selected nav item rule exists");
  assert.doesNotMatch(selectedNavItem[1], /box-shadow:\s*(?!none\b)/);
});

test("product shell puts the product's own controls in the cluster, before the bell and the avatar", () => {
  const html = renderToStaticMarkup(
    <ProductShell
      productName="TCRN TMS"
      moduleName="Talent"
      brandProductId="tms"
      currentRouteLabel="Roster"
      pageHeader={{ title: "Roster" }}
      navGroups={shellNavGroups}
      locales={shellLocales}
      currentLocale="en"
      notifications={{}}
      headerActions={<button type="button" data-product-header-action="workspace">Workspace</button>}
    >
      <div>content</div>
    </ProductShell>
  );
  assert.match(html, /data-product-shell-header-actions="present"/);
  const cluster = html.indexOf("data-cluster=");
  const actions = html.indexOf('data-product-header-action="workspace"');
  const bell = html.indexOf("data-shell-bell=");
  const avatar = html.indexOf("data-shell-avatar=");
  assert.ok(cluster > -1 && cluster < actions && actions < bell && bell < avatar, "the shell's own controls stay rightmost");
  assert.match(html, /aria-label="Notifications" data-shell-bell=""/);
  assert.equal(html.includes("tcrn-shell-bell__dot"), false, "nothing unread, no dot");
  assert.match(html, /aria-label="Account" aria-haspopup="dialog"/, "without an account the avatar names its menu");

  const bare = renderToStaticMarkup(
    <ProductShell productName="TCRN TMS" moduleName="Talent" brandProductId="tms" currentRouteLabel="Roster" pageHeader={{ title: "Roster" }} navGroups={[]} locales={shellLocales} currentLocale="en">
      <div>content</div>
    </ProductShell>
  );
  assert.match(bare, /data-product-shell-header-actions="absent"/);
  assert.equal(bare.includes("data-shell-bell"), false, "without notifications the cluster is the avatar alone");
  assert.equal(bare.includes("data-pins"), false, "nothing pinned, no pinned items");
  assert.match(bare, /data-shell-avatar=""/);
});

test("STORY-140 GWT4 the avatar menu switches products and holds the theme and the language; the full menu lists no products", () => {
  const html = renderToStaticMarkup(
    <ProductShell
      productName="TCRN TMS"
      moduleName="Talent"
      brandProductId="tms"
      currentRouteLabel="Roster"
      pageHeader={{ title: "Roster" }}
      navGroups={shellNavGroups}
      locales={shellLocales}
      currentLocale="en"
      account={{ name: "Lin Xiao", initials: "LX" }}
      products={[
        { id: "tms", label: "TCRN TMS", href: "/tms", current: true },
        { id: "einzbern", label: "Einzbern", href: "/einzbern" }
      ]}
      accountMenuOpen
      menuOpen
    >
      <div>content</div>
    </ProductShell>
  );
  assert.match(html, /data-state="expanded"/);
  assert.match(html, />LX<\/span>/);
  const accountStart = html.indexOf('data-panel="account"');
  const accountEnd = html.indexOf("</section>", accountStart);
  assert.ok(accountStart > -1 && accountEnd > accountStart, "the avatar menu is open");
  const account = html.slice(accountStart, accountEnd);
  assert.match(account, /aria-label="Switch product" data-shell-products=""/);
  const current = /<a[^>]*data-shell-product="tms"[^>]*>/.exec(account);
  assert.ok(current, "the current product is listed");
  assert.match(current[0], /aria-current="page"/);
  assert.match(account, /data-shell-product="einzbern"/);
  assert.match(account, /data-theme-toggle="true"/);
  assert.match(account, /data-locale-menu-toggle/);
  const menu = html.slice(html.indexOf('data-panel="expanded"'));
  assert.ok(menu.length > 0 && html.includes('data-panel="expanded"'), "the full menu is open");
  assert.equal(menu.includes("data-shell-product"), false, "the full menu and its lockup carry no product list");
  assert.equal(menu.includes('href="/einzbern"'), false);
  assert.equal(html.includes("data-side-nav-toggle"), false, "no collapse control, open or closed");
});

test("brand lockup css follows the G+ brand rules", () => {
  const rule = (selector: string) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
    return tcrnComponentCss.match(new RegExp(`(?:^|\\n)${escaped} \\{[^}]*\\}`))?.[0] ?? "";
  };

  // STORY-127 GWT3: TCRN is ink; the TMS and design-system suffixes are the products'
  // deep colours from the brand-suffix tokens, the same in both themes (STORY-145 GWT3,
  // MIN-20261013-SHELL D2: the O-3 night value of the TMS suffix is withdrawn; its night
  // contrast is a known red that D7 leaves to the Owner). Gradient text is retired, and so
  // is the workflow suffix.
  assert.match(rule(".tcrn-brand-wordmark"), /color: var\(--tcrn-color-ink\);/);
  assert.match(rule(".tcrn-brand-wordmark__suffix"), /color: var\(--tcrn-color-ink\);/);
  assert.match(rule(".tcrn-product-logo__line-one"), /color: var\(--tcrn-color-ink\);/);
  assert.match(rule(".tcrn-brand-wordmark__suffix--tms"), /color: var\(--tcrn-brand-suffix-tms\);/);
  assert.match(rule(".tcrn-brand-wordmark__suffix--design-system"), /color: var\(--tcrn-brand-suffix-design-system\);/);
  assert.doesNotMatch(rule(".tcrn-brand-wordmark__suffix--design-system"), /gradient|background-clip|text-fill-color|transparent/);
  assert.match(rule(".tcrn-brand-wordmark__suffix--aos"), /color: var\(--tcrn-brand-accent-aos\);/);
  assert.doesNotMatch(tcrnComponentCss, /tcrn-brand-wordmark__suffix--workflow/);
  assert.doesNotMatch(tcrnComponentCss, /var\(--tcrn-brand-accent-(?:tms|workflow|design-system-\d)\)/);
  assert.doesNotMatch(tcrnComponentCss, /var\(--tcrn-color-brand-secondary-readable\)/);
  const tokens = createTokenMap();
  assert.equal(tokens["--tcrn-brand-suffix-tms"], "#2c63c8");
  assert.equal(tokens["--tcrn-brand-suffix-design-system"], "#6577f3");
  const night = createResolvedTokenMap("dark");
  assert.equal(night["--tcrn-brand-suffix-tms"], "#2c63c8", "by night the TMS suffix reads the same approved colour");
  assert.equal(night["--tcrn-brand-suffix-design-system"], "#6577f3");
  assert.equal(tcrnProductMarks.find((mark) => mark.productId === "tms")?.palette.deep, "#2c63c8");
  assert.equal(tcrnProductMarks.find((mark) => mark.productId === "design-system")?.palette.deep, "#6577f3");

  // Mark sizes by container: product logo 38, lockup 28, the shell's side rail 22.
  assert.match(tcrnComponentCss, /\.tcrn-brand-lockup,\n\.tcrn-shell-brand-lockup,\n\.tcrn-product-logo \{[^}]*--tcrn-brand-mark-size: 38px;/);
  assert.match(rule(".tcrn-brand-lockup"), /--tcrn-brand-mark-size: 28px;/);
  // The side-rail tier is one rule: a lockup in the product shell, or one marked data-lockup="lkr"
  // such as the full menu's bottom bar (TCRN-DS-SUB-144).
  assert.match(
    tcrnComponentCss,
    /\n\.tcrn-product-shell \.tcrn-shell-brand-lockup,\n\.tcrn-shell-brand-lockup\[data-lockup="lkr"\] \{[^}]*--tcrn-brand-mark-size: 22px;/
  );
  const markRule = rule(".tcrn-brand-mark");
  assert.match(markRule, /inline-size: var\(--tcrn-brand-mark-size\);[\s\S]*filter: var\(--tcrn-brand-mark-filter, none\);/);
  // STORY-127 GWT4 (the CSS part): the mark neither scales nor fades when the rail
  // collapses, and the lockup copy leaves with display:none rather than a clip.
  assert.doesNotMatch(markRule, /transition/);
  const collapsedCopy = tcrnComponentCss.match(/\.tcrn-product-shell\[data-product-shell-collapsed="true"\] \.tcrn-shell-brand-lockup__copy,\n\.tcrn-product-shell\[data-product-shell-collapsed="true"\] \.tcrn-product-logo__copy \{[^}]*\}/)?.[0] ?? "";
  assert.match(collapsedCopy, /display: none;/);
  assert.doesNotMatch(collapsedCopy, /clip-path|inline-size/);

  const longNameWordmarkRule = rule(".tcrn-brand-lockup--long-name .tcrn-brand-wordmark");
  assert.match(longNameWordmarkRule, /flex-direction:\s*column;/);
  assert.match(longNameWordmarkRule, /align-items:\s*flex-start;/);
  assert.match(rule(".tcrn-brand-wordmark__base"), /font-weight: var\(--tcrn-type-weight-medium\);[\s\S]*white-space: nowrap;/);
  assert.match(rule(".tcrn-product-logo__line-one"), /display: inline-flex;[\s\S]*align-items: baseline;[\s\S]*font-size: var\(--tcrn-brand-line-one-size\);[\s\S]*line-height: var\(--tcrn-brand-line-one-height\);/);
  assert.match(rule(".tcrn-product-logo__line-one-suffix"), /font-weight: var\(--tcrn-type-weight-strong\);[\s\S]*white-space: nowrap;/);
  assert.match(rule(".tcrn-product-logo--stacked-suffix .tcrn-product-logo__line-one"), /flex-direction: column;[\s\S]*align-items: flex-start;[\s\S]*white-space: normal;/);
  assert.match(tcrnComponentCss, /\.tcrn-shell-brand-lockup__caption,\n\.tcrn-product-logo__line-two \{[^}]*color: var\(--tcrn-color-ink-3\);[^}]*font-size: var\(--tcrn-brand-line-two-size\);/);
  assert.match(rule(".tcrn-product-logo--serif .tcrn-product-logo__line-one"), /font-family: var\(--tcrn-type-family-serif\);/);
  assert.match(rule(".tcrn-product-logo--serif .tcrn-product-logo__line-one-base"), /font-weight: var\(--tcrn-type-weight-regular\);/);
  assert.match(rule(".tcrn-product-logo__byline"), /letter-spacing: var\(--tcrn-type-tracking-caps\);[\s\S]*text-transform: uppercase;/);
});

test("product shell component css keeps package controls contrast-safe", () => {
  assert.match(tcrnComponentCss, /\.tcrn-shell-theme-toggle \{[\s\S]*inline-size: 36px;[\s\S]*min-height: 36px;[\s\S]*border-radius: var\(--tcrn-radius-pill\);/);
  // SideNavCollapseButton is deprecated (TCRN-DS-SUB-125): its rules left tcrnComponentCss for the retired sheet.
  assert.doesNotMatch(tcrnComponentCss, /\.tcrn-shell-side-nav-toggle\b/);
  assert.match(tcrnRetiredComponentCss, /\.tcrn-shell-side-nav-toggle \{[\s\S]*inline-size: 38px;[\s\S]*min-height: 38px;[\s\S]*place-items: center;/);
  assert.match(tcrnRetiredComponentCss, /\.tcrn-shell-side-nav-toggle__icon \{[\s\S]*inline-size: 20px;[\s\S]*place-items: center;/);
  // The three shell toggles are IconButtons: the shell rules size and shape them and leave
  // fill, ink, edge, focus ring and transition to the Actions pair table. No shell rule
  // colours them, shadows them, restyles their hover or focus, or scales them on press.
  // The side-nav and mobile-nav toggles are deprecated (TCRN-DS-SUB-125) and ship in the retired
  // sheet, which a consumer adds after the component sheet; the rule holds for both sheets.
  const sheetWithoutComments = (tcrnComponentCss + tcrnRetiredComponentCss).replace(/\/\*[\s\S]*?\*\//g, "");
  const shellToggleRules = [...sheetWithoutComments.matchAll(/(?:^|\n)([^{}\n@][^{}]*)\{([^}]*)\}/g)].filter(([, selector]) =>
    selector.split(",").some((part) => /^\s*(?:\.tcrn-button)?\.tcrn-shell-(?:theme|side-nav|mobile-nav)-toggle\s*$/.test(part))
  );
  assert.ok(shellToggleRules.length >= 3, "the theme, side-nav and mobile-nav toggle rules are found");
  for (const [, selector, body] of shellToggleRules) {
    assert.doesNotMatch(body, /(?:^|[;\s])(?:color|background|box-shadow|transition|border-color)\s*:/, `${selector.trim()} writes no colour, shadow or transition`);
  }
  assert.doesNotMatch(sheetWithoutComments, /\.tcrn-shell-(?:theme|side-nav|mobile-nav)-toggle:(?:hover|active|focus-visible)/);
  assert.doesNotMatch(sheetWithoutComments, /\.tcrn-button\.tcrn-shell-theme-toggle[^{]*\{[^}]*transition/);
  assert.match(tcrnComponentCss, /\.tcrn-shell-locale-menu__trigger \{[\s\S]*min-height: 36px;[\s\S]*border-radius: var\(--tcrn-radius-pill\);[\s\S]*font-size: var\(--tcrn-type-size-ui\);[\s\S]*line-height: var\(--tcrn-type-line-ui\);/);
  // SearchInput keeps the tool form (STORY-126, Owner ruling): the control is the box and
  // takes the search pair (wash fill, no edge, line-2 on hover, the paper fill with the
  // focus ring once focused); the wrapper only positions the icon and the shortcut over it,
  // and the control's inline padding keeps the text clear of both.
  assert.match(tcrnComponentCss, /\.tcrn-search-input \{[^}]*--tcrn-search-input-control-min-inline-size: 9ch;[^}]*position: relative;[^}]*display: grid;[^}]*grid-template-columns: minmax\(0, 1fr\);/);
  assert.doesNotMatch(tcrnComponentCss, /(?:^|\n)\.tcrn-search-input:focus-within \{/);
  assert.match(tcrnComponentCss, /\.tcrn-input\.tcrn-search-input__control\{--tcrn-pair-fill-d:var\(--tcrn-color-wash\);--tcrn-pair-edge-d:0 0 #0000;[^}]*--tcrn-pair-edge-h:inset 0 0 0 1px var\(--tcrn-color-line-2\);--tcrn-pair-fill-f:var\(--tcrn-color-panel\)\}/);
  assert.match(tcrnComponentCss, /\.tcrn-search-input__icon \{[^}]*position: absolute;[^}]*inset-inline-start: var\(--tcrn-search-input-padding-inline\);[^}]*inline-size: var\(--tcrn-search-input-icon-size\);[^}]*color: var\(--tcrn-color-ink-3\);[^}]*pointer-events: none;/);
  const searchControlRule = /\.tcrn-search-input \.tcrn-search-input__control \{([^}]*)\}/.exec(tcrnComponentCss)?.[1] ?? "";
  assert.match(searchControlRule, /appearance: none;[^}]*inline-size: 100%;[^}]*block-size: var\(--tcrn-search-input-block-size\);[^}]*padding-inline: calc\(var\(--tcrn-search-input-padding-inline\) \+ var\(--tcrn-search-input-icon-size\) \+ var\(--tcrn-search-input-column-gap\)\) var\(--tcrn-search-input-padding-inline\);/);
  assert.doesNotMatch(searchControlRule, /(?:^|[;\s])(?:background|box-shadow|border|color)\s*:/, "the search pair, not the wrapper rule, paints the control");
  assert.match(tcrnComponentCss, /\.tcrn-input\.tcrn-search-input__control::placeholder \{\s*color: var\(--tcrn-color-ink-2\);/);
  assert.match(tcrnComponentCss, /\.tcrn-search-input__shortcut \{[^}]*position: absolute;[^}]*inset-inline-end: var\(--tcrn-space-2\);[^}]*border: 1px solid var\(--tcrn-color-line-2\);[^}]*color: var\(--tcrn-color-ink-2\);[^}]*font-family: var\(--tcrn-type-family-mono\);[^}]*pointer-events: none;/);
  assert.match(tcrnComponentCss, /\.tcrn-search-input\[data-shortcut-visible="true"\] \.tcrn-search-input__control \{\s*padding-inline-end: calc\(/);
  // The primary button reads on-acc ink from its own pair in both themes; the night theme
  // changes the tokens, not the button, so there is no dark-scoped primary rule any more.
  assert.match(tcrnComponentCss, /\.tcrn-button\.tcrn-button--primary\{[^}]*--tcrn-pair-ink-d:var\(--tcrn-color-on-acc\)/);
  assert.doesNotMatch(tcrnComponentCss, /\[data-tcrn-theme="dark"\] \.tcrn-button--primary/);
  assert.match(tcrnComponentCss, /\.tcrn-readback-panel \{[\s\S]*display: grid;[\s\S]*gap: var\(--tcrn-space-2\);/);
  assert.match(tcrnComponentCss, /\.tcrn-readback-panel > \.tcrn-heading \+ \* \{[\s\S]*margin-top: 0;/);
  assert.match(tcrnComponentCss, /\.tcrn-product-shell-content-stack \{[\s\S]*display: grid;[\s\S]*grid-template-columns: minmax\(0, 1fr\);[\s\S]*gap: var\(--tcrn-space-5\);[\s\S]*min-width: 0;/);
  assert.match(tcrnComponentCss, /\.tcrn-product-shell-content-stack > \*,[\s\S]*\.tcrn-product-shell-section-grid > \* \{[\s\S]*min-width: 0;[\s\S]*max-width: 100%;/);
  // DS#1 (TCRN-CROSS-INC-399 R46): the section grid stacks by its own container, the record
  // family's rule, so a 1024px viewport with a 280px rail no longer squeezes the primary column
  // to about 20px. The content stack is the container; two 280px floors plus the gap need 576px.
  assert.match(tcrnComponentCss, /\.tcrn-product-shell-section-grid \{\n  display: grid;\n  grid-template-columns: minmax\(0, 1\.45fr\) minmax\(280px, 0\.75fr\);/);
  assert.match(tcrnComponentCss, /\.tcrn-product-shell-content-stack \{\n  container: tcrn-product-shell-content \/ inline-size;[^}]*width: 100%;/);
  assert.match(tcrnComponentCss, /@container tcrn-product-shell-content \(max-width: 576px\) \{\n  \.tcrn-product-shell-section-grid \{\n    grid-template-columns: minmax\(0, 1fr\);\n  \}\n\}/);
  assert.match(tcrnComponentCss, /\.tcrn-table-shell__head,[\s\S]*\.tcrn-table-shell__row \{[\s\S]*grid-template-columns: var\([\s\S]*--tcrn-table-shell-columns/);
  assert.match(tcrnComponentCss, /\.tcrn-table-shell__head span,[\s\S]*\.tcrn-table-shell__cell \{[\s\S]*overflow-wrap: anywhere;/);
  // P-DS-R45-06 (TCRN-CROSS-INC-399 R46): above the 464px record boundary the identifier track
  // keeps the family's published readable floor while summary and meta keep zero minima; below
  // the boundary every density still stacks into one column.
  assert.match(tcrnComponentCss, /\.tcrn-record-row \{\n  display: grid;\n  grid-template-columns: minmax\(112px, 0\.18fr\) minmax\(0, 1fr\) minmax\(0, 0\.8fr\);/);
  assert.match(tcrnComponentCss, /\.tcrn-record-row--compact \{\n  grid-template-columns: minmax\(96px, 0\.16fr\) minmax\(0, 1fr\) minmax\(0, 0\.72fr\);/);
  assert.match(tcrnComponentCss, /\.tcrn-record-row--dense \{\n  grid-template-columns: minmax\(92px, 0\.14fr\) minmax\(0, 1fr\) minmax\(0, 0\.62fr\);/);
  assert.match(tcrnComponentCss, /@container tcrn-record-row \(max-width: 464px\) \{\n  \.tcrn-record-row,\n  \.tcrn-record-row--compact,\n  \.tcrn-record-row--dense \{\n    grid-template-columns: minmax\(0, 1fr\);/);
  assert.match(tcrnComponentCss, /\.tcrn-settings-layout__form \.tcrn-setting-row-list\{grid-template-columns:minmax\(0,1fr\) minmax\(var\(--tcrn-container-settings-control-min\),\.8fr\) max-content\}/);
  assert.match(tcrnComponentCss, /\.tcrn-settings-layout__form \.tcrn-setting-row-list \.tcrn-setting-row\{grid-template-columns:subgrid\}/);
  assert.match(tcrnComponentCss, /\.tcrn-settings-layout__form \.tcrn-setting-row__control \.tcrn-field :is\(\.tcrn-input,\.tcrn-select,\.tcrn-number-input\)\{inline-size:100%;min-inline-size:0\}/);
  assert.match(tcrnComponentCss, /\.tcrn-record-row\[data-transient-target="true"\][^{]*\{[^}]*--tcrn-selection-fill/);
  assert.match(tcrnComponentCss, /\.tcrn-table-shell__row\[data-transient-target="true"\][^{]*\{[^}]*--tcrn-selection-fill/);
  assert.match(tcrnComponentCss, /\.tcrn-setting-row\[data-transient-target="true"\][^{]*\{[^}]*--tcrn-selection-fill/);
  assert.match(tcrnComponentCss, /\.tcrn-page-header--dense,[\s\S]*\.tcrn-activity-feed--dense \{[\s\S]*--tcrn-density-row-min: 34px;/);
  assert.match(tcrnComponentCss, /\.tcrn-tree-nav,[\s\S]*\.tcrn-search-result-list \{[\s\S]*min-width: 0;/);
  assert.match(tcrnComponentCss, /\.tcrn-template-gallery \{[\s\S]*grid-template-columns: repeat\(auto-fit, minmax\(180px, 1fr\)\);/);
});

test("product shell search stays hidden when compact at rest", () => {
  const html = renderToStaticMarkup(
    <ProductShellSearch
      label="Search"
      placeholder="Search modules"
      query=""
      expanded={false}
      results={[{ id: "work", title: "Work", href: "/work" }]}
    />
  );

  assert.match(html, /data-search-expanded="false"/);
  assert.match(html, /data-search-results-visible="false"/);
  assert.match(html, /data-product-shell-search-results="true" hidden=""/);
});

interface ProductShellSemanticFixtureProps {
  events: string[];
}

function ProductShellSemanticFixture({ events }: ProductShellSemanticFixtureProps) {
  const [theme, setTheme] = useState<ShellThemeMode>("light");
  const [locale, setLocale] = useState("en");
  const [localeMenuOpen, setLocaleMenuOpen] = useState(false);
  const [pinnedIds, setPinnedIds] = useState<readonly string[]>(["roster", "contracts"]);

  return (
    <ProductShell
      productName="TCRN TMS"
      moduleName="Talent"
      brandProductId="tms"
      currentRouteLabel="Roster"
      pageHeader={{ title: "Roster" }}
      navGroups={shellNavGroups}
      locales={shellLocales}
      currentLocale={locale}
      currentTheme={theme}
      localeMenuOpen={localeMenuOpen}
      account={{ name: "Lin Xiao" }}
      products={[{ id: "tms", label: "TCRN TMS", href: "/tms", current: true }]}
      pinnedIds={pinnedIds}
      onPinnedChange={(id, pinned) => {
        events.push(`pin:${id}:${pinned}`);
        setPinnedIds((current) => (pinned ? [...current, id] : current.filter((entry) => entry !== id)));
      }}
      onMenuOpenChange={(open, reason) => events.push(`menu:${open}:${reason}`)}
      onOpenPinChange={(id) => events.push(`drop:${id ?? "none"}`)}
      onAccountMenuOpenChange={(open) => events.push(`account:${open}`)}
      onThemeChange={(nextTheme) => {
        events.push(`theme:${nextTheme}`);
        setTheme(nextTheme);
      }}
      onLocaleMenuOpenChange={(nextOpen, reason) => {
        events.push(`locale-open:${nextOpen}:${reason}`);
        setLocaleMenuOpen(nextOpen);
      }}
      onLocaleChange={(nextLocale) => {
        events.push(`locale:${nextLocale}`);
        setLocale(nextLocale);
      }}
      onSearchQueryChange={(nextQuery) => events.push(`search-query:${nextQuery}`)}
    >
      <section>Fixture-safe roster content</section>
    </ProductShell>
  );
}

function ProductShellControllerFixture({ events }: ProductShellSemanticFixtureProps) {
  const controller = useProductShellController({
    searchRecords: [{ id: "work", title: "Work", meta: "Registered shell entry", href: "/work" }],
    onThemeChange: (theme) => events.push(`controller-theme:${theme}`),
    onLocaleMenuOpenChange: (open, reason) => events.push(`controller-locale-open:${open}:${reason}`),
    onLocaleChange: (locale) => events.push(`controller-locale:${locale}`),
    onSearchQueryChange: (query) => events.push(`controller-search-query:${query}`),
    onSearchExpandedChange: (expanded, reason) => events.push(`controller-search-expanded:${expanded}:${reason}`),
    onSearchDismiss: (reason) => events.push(`controller-search-dismiss:${reason}`),
    onSearchResultActivate: (result, event) => {
      event.preventDefault();
      events.push(`controller-search-result:${result.id}`);
    }
  });

  return (
    <section>
      <ShellThemeToggle {...controller.shellThemeToggleProps} />
      <ShellLocaleMenu
        locales={[
          { locale: "en", nativeName: "English" },
          { locale: "zh-CN", nativeName: "简体中文" }
        ]}
        {...controller.shellLocaleMenuProps}
      />
      <ProductShellSearch label="Search bundle" placeholder="Search bundle" {...controller.productShellSearchProps} />
    </section>
  );
}

async function flushReactUpdates() {
  await act(async () => {
    await Promise.resolve();
  });
}

async function focusElement(harness: ReturnType<typeof createDomInteractionHarness>, element: HTMLElement) {
  await act(async () => {
    element.focus();
    element.dispatchEvent(new harness.window.FocusEvent("focusin", { bubbles: true }));
  });
}

async function updateInputValue(harness: ReturnType<typeof createDomInteractionHarness>, input: HTMLInputElement, value: string) {
  await act(async () => {
    const valueSetter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(input), "value")?.set;
    valueSetter?.call(input, value);
    input.dispatchEvent(new harness.window.Event("input", { bubbles: true, cancelable: true }));
    input.dispatchEvent(new harness.window.Event("change", { bubbles: true, cancelable: true }));
  });
}

async function dispatchMouseDown(harness: ReturnType<typeof createDomInteractionHarness>, target: Element | Document) {
  await act(async () => {
    target.dispatchEvent(new harness.window.MouseEvent("mousedown", { bubbles: true, cancelable: true }));
  });
}

test("product shell keeps one layer open: the full menu, a drop-down or the avatar menu", async () => {
  const harness = createDomInteractionHarness();
  const events: string[] = [];
  try {
    await harness.render(<ProductShellSemanticFixture events={events} />);

    const shell = harness.document.querySelector(".tcrn-product-shell");
    assert.ok(shell instanceof harness.window.HTMLElement);
    assert.equal(shell.getAttribute("data-product-shell-semantic-api"), "menu-pins-theme-locale");
    assert.equal(shell.getAttribute("data-state"), "closed");

    const brand = harness.document.querySelector("[data-shell-brand]");
    assert.ok(brand instanceof harness.window.HTMLButtonElement);
    await harness.dispatchClick(brand);
    assert.ok(events.includes("menu:true:trigger"));
    assert.equal(shell.getAttribute("data-state"), "expanded");
    assert.ok(harness.document.querySelector('[data-panel="expanded"]'));
    assert.equal(harness.document.querySelector("[data-side-nav-toggle]"), null, "the full menu has no collapse control");

    const search = harness.document.querySelector('[data-shell-search] input[type="search"]');
    assert.ok(search instanceof harness.window.HTMLInputElement);
    await updateInputValue(harness, search, "roster");
    assert.ok(events.includes("search-query:roster"));

    const contracts = harness.document.querySelector('[data-pin="contracts"] button');
    assert.ok(contracts instanceof harness.window.HTMLButtonElement);
    await harness.dispatchClick(contracts);
    assert.ok(events.includes("drop:contracts"));
    assert.ok(events.includes("menu:false:trigger"), "opening a drop-down closes the full menu");
    assert.equal(shell.getAttribute("data-state"), "drop");
    assert.ok(harness.document.querySelector('[data-panel="drop"]'));
    assert.equal(harness.document.querySelector('[data-panel="expanded"]'), null);

    const avatar = harness.document.querySelector("[data-shell-avatar]");
    assert.ok(avatar instanceof harness.window.HTMLButtonElement);
    await harness.dispatchClick(avatar);
    assert.ok(events.includes("account:true"));
    assert.ok(events.includes("drop:none"), "opening the avatar menu closes the drop-down");
    assert.equal(shell.getAttribute("data-state"), "closed");
    assert.ok(harness.document.querySelector('[data-panel="account"] [data-shell-product="tms"]'));

    const themeButton = harness.document.querySelector("[data-panel='account'] [data-theme-toggle='true']");
    assert.ok(themeButton instanceof harness.window.HTMLButtonElement);
    await harness.dispatchClick(themeButton);
    assert.ok(events.includes("theme:dark"));
    assert.equal(shell.getAttribute("data-product-shell-theme"), "dark");

    const localeTrigger = harness.document.querySelector("[data-panel='account'] [data-locale-menu-toggle]");
    assert.ok(localeTrigger instanceof harness.window.HTMLButtonElement);
    await harness.dispatchClick(localeTrigger);
    assert.ok(events.includes("locale-open:true:trigger"));
    const localeOption = harness.document.querySelector("[data-locale-option='zh-CN']");
    assert.ok(localeOption instanceof harness.window.HTMLButtonElement);
    await harness.dispatchClick(localeOption);
    await flushReactUpdates();
    assert.ok(events.includes("locale:zh-CN"));
    assert.ok(harness.document.querySelector('[data-panel="account"]'), "choosing a language keeps the avatar menu open");

    await harness.dispatchKeydown(harness.document, "Escape");
    assert.ok(events.includes("account:false"));
    assert.equal(harness.document.querySelector('[data-panel="account"]'), null);
    assert.equal(harness.document.activeElement, avatar, "Esc returns focus to the avatar");
  } finally {
    await harness.cleanup();
  }
});

test("product shell controller returns ready prop bundles for registered shell controls", async () => {
  const harness = createDomInteractionHarness();
  const events: string[] = [];
  try {
    await harness.render(<ProductShellControllerFixture events={events} />);

    assert.equal(harness.document.querySelector("[data-side-nav-toggle]"), null, "the controller offers no collapse control");

    const themeButton = harness.document.querySelector("[data-theme-toggle='true']");
    assert.ok(themeButton instanceof harness.window.HTMLButtonElement);
    await harness.dispatchClick(themeButton);
    assert.ok(events.includes("controller-theme:dark"));
    assert.equal(themeButton.getAttribute("data-current-theme"), "dark");

    const localeTrigger = harness.document.querySelector("[data-locale-menu-toggle]");
    assert.ok(localeTrigger instanceof harness.window.HTMLButtonElement);
    await harness.dispatchClick(localeTrigger);
    assert.ok(events.includes("controller-locale-open:true:trigger"));

    const localeOption = harness.document.querySelector("[data-locale-option='zh-CN']");
    assert.ok(localeOption instanceof harness.window.HTMLButtonElement);
    await harness.dispatchClick(localeOption);
    await flushReactUpdates();
    assert.ok(events.includes("controller-locale:zh-CN"));
    assert.ok(events.includes("controller-locale-open:false:selection"));
    assert.equal(harness.document.activeElement, localeTrigger);

    const searchInput = harness.document.querySelector(".tcrn-product-shell-search input");
    assert.ok(searchInput instanceof harness.window.HTMLInputElement);
    await focusElement(harness, searchInput);
    await updateInputValue(harness, searchInput, "work");
    assert.ok(events.includes("controller-search-expanded:true:focus"));
    assert.ok(events.includes("controller-search-query:work"));

    const searchResult = harness.document.querySelector("[data-search-result]");
    assert.ok(searchResult instanceof harness.window.HTMLAnchorElement);
    await harness.dispatchClick(searchResult);
    assert.ok(events.includes("controller-search-result:work"));

    await dispatchMouseDown(harness, harness.document.body);
    assert.ok(events.includes("controller-search-dismiss:outside-pointer"));
  } finally {
    await harness.cleanup();
  }
});

/** A block that carries its own theme, as a sample's night block does, with the toggle that switches it. */
function ThemeBlockFixture({ fixture, initialTheme }: { fixture: string; initialTheme: ShellThemeMode }) {
  const [theme, setTheme] = useState<ShellThemeMode>(initialTheme);
  return (
    <div data-tcrn-theme={theme} data-fixture={fixture}>
      <ShellThemeToggle locale="en" currentTheme={theme} onThemeChange={setTheme} />
    </div>
  );
}

test("theme toggle shows its current icon by its own data-current-theme, in a block-level night theme as on a night page", async () => {
  // No rule ties the toggle icons' display to a theme on the page (that was the C5 dark-only
  // finding, and it hid both icons in a sample's night block); the toggle's own
  // data-current-theme picks the icon through the opacity rules beside .tcrn-shell-theme-toggle__icon.
  const sheet = tcrnComponentCss.replace(/\/\*[\s\S]*?\*\//g, "");
  assert.doesNotMatch(sheet, /data-tcrn-theme[^{}]*data-theme-icon/);
  const iconDisplayRules = [...sheet.matchAll(/(?:^|\n)([^{}\n@][^{}]*)\{([^}]*)\}/g)]
    .filter(([, selector, body]) => /\[data-theme-icon/.test(selector) && /(?:^|[;\s])display\s*:/.test(body))
    .map(([, selector]) => selector.trim());
  assert.deepEqual(iconDisplayRules, [], "no rule shows or hides a theme icon by display");

  const harness = createDomInteractionHarness();
  try {
    const style = harness.document.createElement("style");
    style.textContent = tcrnComponentCss;
    harness.document.head.append(style);
    await harness.render(
      <>
        <ThemeBlockFixture fixture="night-block" initialTheme="dark" />
        <ThemeBlockFixture fixture="day-block" initialTheme="light" />
      </>
    );
    // jsdom cascades the matching rules in document order, without specificity; the rules that
    // pick the icon come after the base icon rule, which is also the order their specificity gives.
    const visibleIcons = (fixture: string) =>
      [...harness.document.querySelectorAll(`[data-fixture="${fixture}"] [data-theme-icon]`)]
        .filter((icon) => {
          const computed = harness.window.getComputedStyle(icon);
          return computed.display !== "none" && computed.visibility !== "hidden" && computed.opacity === "1";
        })
        .map((icon) => icon.getAttribute("data-theme-icon"));
    assert.deepEqual(visibleIcons("night-block"), ["dark"], "the night block shows the moon, its current theme");
    assert.deepEqual(visibleIcons("day-block"), ["light"], "the day block shows the sun");

    const nightToggle = harness.document.querySelector("[data-fixture='night-block'] [data-theme-toggle='true']");
    assert.ok(nightToggle instanceof harness.window.HTMLButtonElement);
    await harness.dispatchClick(nightToggle);
    assert.equal(nightToggle.getAttribute("data-current-theme"), "light");
    assert.deepEqual(visibleIcons("night-block"), ["light"], "the icon follows the toggle's current theme");
    await harness.dispatchClick(nightToggle);
    assert.deepEqual(visibleIcons("night-block"), ["dark"]);

    // A night page (the theme on html) changes nothing: each toggle still shows its own current icon.
    harness.document.documentElement.setAttribute("data-tcrn-theme", "dark");
    assert.deepEqual(visibleIcons("night-block"), ["dark"]);
    assert.deepEqual(visibleIcons("day-block"), ["light"], "the toggle's current theme, not the page theme, picks the icon");
  } finally {
    await harness.cleanup();
  }
});

test("shell chrome says its own words in the reader's language", () => {
  // The shell's most load-bearing strings, and the ones with the least visible
  // evidence that they were wrong: three of these controls are icon-only, so the
  // label is the entire accessible name, and the skip link is the first thing a
  // keyboard user reaches on any page in the product.
  const zh = renderToStaticMarkup(
    <>
      <ShellThemeToggle locale="zh-CN" currentTheme="light" />
      <ShellLocaleMenu currentLocale="zh-CN" locales={[{ locale: "zh-CN", nativeName: "简体中文" }]} />
      <SideNavCollapseButton locale="zh-CN" collapsed={false} controls="nav" />
      <Breadcrumb locale="zh-CN" items={[{ id: "root", label: "TCRN" }]} />
      <ProductShellSearch locale="zh-CN" />
      <ProductLauncher locale="zh-CN" items={[{ id: "aos", label: "AOS" }]} />
      <ProductSwitcher locale="zh-CN" items={[{ id: "tms", label: "TMS" }]} />
      <ModuleTabs locale="zh-CN" items={[{ id: "overview", label: "概览" }]} />
      <SectionTabs locale="zh-CN" items={[{ id: "detail", label: "详情" }]} />
      <TcrnBrandMark locale="zh-CN" />
      <NavItem locale="zh-CN" disabled>受限模块</NavItem>
      <ShellBrandLockup locale="zh-CN" />
    </>
  );
  for (const name of [
    "切换到夜间模式", "语言", "收起侧边导航", "面包屑导航", "检索产品外壳", "检索结果",
    "产品启动器", "产品切换器", "模块分区", "分区导航", "TCRN 品牌标识"
  ]) {
    assert.match(zh, new RegExp(`(aria-label|title|alt)="${name}"`), `${name} is the zh-CN name`);
  }
  assert.match(zh, /placeholder="检索"/);
  assert.match(zh, />没有结果</);
  assert.match(zh, />该导航项在此路由下不可用</);
  assert.match(zh, />产品</);
  assert.match(zh, />产品外壳</);
  for (const englishDefault of [
    "Switch to dark mode", "Collapse side navigation", "Breadcrumb", "Search product shell",
    "Search results", "No results", "Product launcher", "Product switcher", "Module sections",
    "Section navigation", "TCRN brand mark", "Navigation item unavailable in this route",
    'placeholder="Search"', ">Language<", ">Product<", ">Product shell<"
  ]) {
    assert.equal(zh.includes(englishDefault), false, `${englishDefault} is not shipped into a zh-CN page`);
  }

  // The locale menu takes no `locale` prop: `currentLocale` already *is* the
  // language its trigger should speak, so a consumer who wired the menu at all has
  // already supplied the answer. This was the sharpest case of the defect — the one
  // control whose job is to change language could not say so in the reader's
  // language.
  const jaMenu = renderToStaticMarkup(<ShellLocaleMenu currentLocale="ja" locales={[{ locale: "ja", nativeName: "日本語" }]} />);
  assert.match(jaMenu, /aria-label="言語"/);
  assert.equal(jaMenu.includes('aria-label="Language"'), false, "the locale menu speaks the locale it is set to");

  // The shell resolves from the `currentLocale` it already requires, and hands it
  // to every child that resolves a default of its own — the nested-locale bug is
  // the shell rendering in one language while its own controls answer in another.
  const zhShell = renderToStaticMarkup(
    <ProductShell
      productName="TCRN TMS"
      moduleName="运营驾驶舱"
      brandProductId="tms"
      currentRouteLabel="驾驶舱"
      pageHeader={{ title: "驾驶舱" }}
      currentLocale="zh-CN"
      locales={[{ locale: "zh-CN", nativeName: "简体中文" }]}
      navGroups={[{ id: "registered", label: "已登记入口", items: [{ id: "cockpit", label: "驾驶舱", href: "/cockpit", selected: true }] }]}
      notifications={{ unread: 2 }}
      menuOpen
      accountMenuOpen
    >
      <div>内容</div>
    </ProductShell>
  );
  assert.match(zhShell, />跳到外壳内容</);
  assert.match(zhShell, /aria-label="产品外壳工作区"/);
  assert.match(zhShell, />当前位置</);
  // Composed per locale: welding " shell controls" onto a name the consumer
  // supplied yields a string in neither language.
  assert.match(zhShell, /aria-label="运营驾驶舱外壳控件"/);
  // Forwarded to the children that carry defaults of their own. The theme toggle
  // names the mode it would switch *to*, and the shell defaults to light.
  assert.match(zhShell, /aria-label="收起导航 · [^"]+"/);
  assert.match(zhShell, /aria-label="切换到夜间模式"/);
  assert.match(zhShell, /aria-label="通知 · 2 条未读"/);
  assert.match(zhShell, /aria-label="账户"/);
  assert.match(zhShell, /aria-label="语言"/);
  assert.match(zhShell, /placeholder="搜索页面与内容"/);
  // The page header's trail is named in the shell's language and walks the current position.
  assert.match(zhShell, /<nav class="tcrn-breadcrumb" aria-label="面包屑导航">/);
  assert.match(zhShell, /title="已登记入口">已登记入口<\/span>/);
  for (const englishDefault of [
    "Skip to shell content", "Product shell workspace", ">Current location<", " shell controls\"",
    "Switch to dark mode", "Close navigation", "Notifications", "\"Account\"", "Search pages and content", "\"Breadcrumbs\""
  ]) {
    assert.equal(zhShell.includes(englishDefault), false, `${englishDefault} is not shipped into a zh-CN shell`);
  }

  // Two more locales, and no locale at all keeps today's English.
  assert.match(renderToStaticMarkup(<ShellThemeToggle locale="fr" currentTheme="dark" />), /aria-label="Passer en mode clair"/);
  assert.match(renderToStaticMarkup(<Breadcrumb locale="ko" items={[{ id: "root", label: "TCRN" }]} />), /aria-label="이동 경로"/);
  assert.match(renderToStaticMarkup(<Breadcrumb items={[{ id: "root", label: "TCRN" }]} />), /aria-label="Breadcrumb"/);
  // And a caller's own label still wins over the built-in.
  assert.match(
    renderToStaticMarkup(<Breadcrumb locale="zh-CN" label="调用方自己的名字" items={[{ id: "root", label: "TCRN" }]} />),
    /aria-label="调用方自己的名字"/
  );
});

/**
 * The controller's stored preferences have to be readable during the render that
 * produces the first paint.
 *
 * This runs under `renderToStaticMarkup` with no `window` and no `document`, which
 * is the server. Before this, the only store the controller read was
 * `window.localStorage`, so on this path every stored preference was invisible and
 * the shell rendered its default — the English light-mode flash a consumer
 * reported, produced here rather than in their code. They worked around it by
 * reading cookies themselves; the workaround is the evidence, so the assertion is
 * that the shell now needs no such workaround.
 */
test("product shell controller reads preferences from the request cookie during server render", () => {
  const readings: Array<Record<string, unknown>> = [];
  const cookieKeys = {
    themeKey: "tcrn-theme",
    localeKey: "tcrn-locale"
  };

  function ServerControllerFixture({ cookie }: { cookie?: string }) {
    const controller = useProductShellController({
      productId: "tms",
      themeStorageKey: "tcrn-theme",
      localeStorageKey: "tcrn-locale",
      // The parse happens on the consumer's server; only two narrowed values
      // cross the package boundary. The raw header stays outside on purpose —
      // an earlier shape of this prop took the whole header, which would have
      // handed the shell every cookie the consumer's requests carry.
      // The pins are the product backend's, passed beside the cookie values.
      requestPreferences: { ...readPreferenceCookieValues(cookie, cookieKeys), pins: cookie ? ["roster"] : undefined }
    });
    readings.push({
      pins: controller.pins,
      theme: controller.theme,
      locale: controller.locale
    });
    return <span>{`${controller.theme}/${controller.locale}/${controller.pins.join(",") || "none"}`}</span>;
  }

  const withCookie = renderToStaticMarkup(
    <ServerControllerFixture cookie="tcrn-theme=dark; tcrn-locale=zh-CN; tcrn-side-nav-collapsed=true" />
  );
  assert.match(withCookie, /dark\/zh-CN\/roster/);
  assert.deepEqual(readings[0], { pins: ["roster"], theme: "dark", locale: "zh-CN" });

  // No cookie is not a preference: the product's defaults still stand, so a
  // client-only consumer that never passes preferences is unaffected.
  const withoutCookie = renderToStaticMarkup(<ServerControllerFixture />);
  assert.match(withoutCookie, /light\/en\/none/);

  // A cookie naming a preference the shell does not govern changes nothing, and one
  // whose value cannot be percent-decoded is discarded rather than thrown out of the
  // render — a cookie header is attacker-reachable input.
  const unrelated = renderToStaticMarkup(
    <ServerControllerFixture cookie="unrelated=dark; tcrn-locale=%E0%A4%A; tcrn-theme=dark" />
  );
  assert.match(unrelated, /dark\/en\/roster/);

  // The parser narrows to undefined, never to a default: garbage must not outrank
  // the product's own fallback, and an off-contract locale is garbage even when it
  // is a real language tag.
  assert.deepEqual(
    readPreferenceCookieValues("tcrn-theme=blue; tcrn-locale=de-DE; tcrn-side-nav-collapsed=yes", cookieKeys),
    { theme: undefined, locale: undefined }
  );
  assert.deepEqual(
    readPreferenceCookieValues(undefined, cookieKeys),
    { theme: undefined, locale: undefined }
  );
});

function PinsControllerFixture({ events, productId, initialPins }: { events: string[]; productId: string; initialPins?: readonly string[] }) {
  const controller = useProductShellController({
    productId,
    initialPins,
    onPinsChange: (pins) => events.push(`pins:${pins.join(",")}`)
  });
  return (
    <ProductShell
      productName="TCRN TMS"
      moduleName="Talent"
      brandProductId="tms"
      currentRouteLabel="Roster"
      pageHeader={{ title: "Roster" }}
      navGroups={pinGroups}
      locales={shellLocales}
      {...controller.productShellControlProps}
    >
      <button type="button" data-move-first="" onClick={() => controller.movePin("g7", 0)}>
        Move
      </button>
    </ProductShell>
  );
}

// Seven pinnable groups, each a link-free group with one page under it.
const pinGroups: ProductShellNavGroup[] = ["g1", "g2", "g3", "g4", "g5", "g6", "g7"].map((id) => ({
  id,
  label: id.toUpperCase(),
  items: [{ id: `${id}-page`, label: `${id.toUpperCase()} page`, href: `/${id}` }]
}));

test("STORY-140 GWT3 pinning a seventh entry keeps it in the preference while the band shows six, and a drag's order persists", async () => {
  const harness = createDomInteractionHarness();
  const events: string[] = [];
  try {
    harness.window.localStorage.clear();
    await harness.render(<PinsControllerFixture events={events} productId="tms" initialPins={["g1", "g2", "g3", "g4", "g5", "g6"]} />);
    assert.equal(harness.document.querySelectorAll("[data-pins] [data-pin]").length, 6);

    // Pin the seventh from the full menu: the preference keeps it, the band still shows six.
    const brand = harness.document.querySelector("[data-shell-brand]");
    assert.ok(brand instanceof harness.window.HTMLButtonElement);
    await harness.dispatchClick(brand);
    const pin = harness.document.querySelector('[data-panel="expanded"] [data-shell-group] [aria-label$="G7"][data-pin-button]');
    assert.ok(pin instanceof harness.window.HTMLButtonElement, "the seventh group has a pin in the full menu");
    await harness.dispatchClick(pin);
    assert.equal(events[events.length - 1], "pins:g1,g2,g3,g4,g5,g6,g7");
    assert.equal(harness.window.localStorage.getItem("tcrn-shell-pins:tms"), JSON.stringify(["g1", "g2", "g3", "g4", "g5", "g6", "g7"]));
    assert.deepEqual(
      [...harness.document.querySelectorAll("[data-pins] [data-pin]")].map((element) => element.getAttribute("data-pin")),
      ["g1", "g2", "g3", "g4", "g5", "g6"]
    );
    assert.ok(harness.document.querySelector('[data-shell-pinned-group] [data-shell-row]'), "the menu lists the pinned entries");

    // The end of a drag: the order is saved to the local fallback and told to the product.
    const move = harness.document.querySelector("[data-move-first]");
    assert.ok(move instanceof harness.window.HTMLButtonElement);
    await harness.dispatchClick(move);
    assert.equal(events[events.length - 1], "pins:g7,g1,g2,g3,g4,g5,g6");
    assert.equal(harness.window.localStorage.getItem("tcrn-shell-pins:tms"), JSON.stringify(["g7", "g1", "g2", "g3", "g4", "g5", "g6"]));
    assert.deepEqual(
      [...harness.document.querySelectorAll("[data-pins] [data-pin]")].map((element) => element.getAttribute("data-pin")),
      ["g7", "g1", "g2", "g3", "g4", "g5"]
    );
  } finally {
    await harness.cleanup();
  }
});

test("pins are read back per product: the server preference first, then that product's local fallback", async () => {
  const harness = createDomInteractionHarness();
  try {
    harness.window.localStorage.clear();
    harness.window.localStorage.setItem("tcrn-shell-pins:tms", JSON.stringify(["g2", "g1"]));
    harness.window.localStorage.setItem("tcrn-shell-pins:einzbern", "not a list");
    const readings: Record<string, readonly string[]> = {};
    function Reader({ productId, pins }: { productId: string; pins?: readonly string[] }) {
      readings[`${productId}:${pins ? "server" : "local"}`] = useProductShellController({ productId, requestPreferences: { pins } }).pins;
      return null;
    }
    await harness.render(
      <>
        <Reader productId="tms" />
        <Reader productId="tms" pins={["g3"]} />
        <Reader productId="einzbern" />
      </>
    );
    assert.deepEqual(readings["tms:local"], ["g2", "g1"]);
    assert.deepEqual(readings["tms:server"], ["g3"], "the product's backend outranks the local copy");
    assert.deepEqual(readings["einzbern:local"], [], "another product's key, and a garbage value is no preference");
    assert.equal(harness.document.cookie.includes("pins"), false, "pins never go into a cookie");
  } finally {
    await harness.cleanup();
  }
});

// Type-level only: each retired prop is an error, so a line here that compiles again fails the build.
test("STORY-140 GWT5 the side rail, collapse and pinned-open props are rejected by the types", () => {
  const base: ProductShellProps = {
    productName: "TCRN TMS",
    moduleName: "Talent",
    brandProductId: "tms",
    currentRouteLabel: "Roster",
    pageHeader: { title: "Roster" },
    navGroups: [],
    locales: shellLocales,
    currentLocale: "en",
    children: null
  };
  const retired: ProductShellProps[] = [
    // @ts-expect-error the shell has no side rail
    { ...base, sidebar: true },
    // @ts-expect-error the rail's collapsed state is retired
    { ...base, collapsed: true },
    // @ts-expect-error the collapsed state is no longer stored
    { ...base, collapsedStorageKey: "tcrn-side-nav-collapsed" },
    // @ts-expect-error there is nothing to collapse
    { ...base, onCollapsedChange: () => undefined },
    // @ts-expect-error there is no collapse control to disable
    { ...base, sideNavCollapseDisabledReason: "Pinned open" },
    // @ts-expect-error the mobile drawer went with the rail
    { ...base, mobileNavExpanded: true },
    // @ts-expect-error the mobile drawer went with the rail
    { ...base, onMobileNavExpandedChange: () => undefined },
    // @ts-expect-error the rail's navigation id and name went with it
    { ...base, navId: "tcrn-product-shell-side-nav" },
    // @ts-expect-error the rail's navigation id and name went with it
    { ...base, navLabel: "Modules" },
    // @ts-expect-error the rail's brand link went with it
    { ...base, brandHref: "/" },
    // @ts-expect-error products pass their key, not brand copy
    { ...base, brandSuffix: "Design team" },
    // @ts-expect-error the top bar's search field is the full menu's search
    { ...base, search: {} }
  ];
  assert.equal(retired.length, 12);
  const config: ProductShellControllerConfig[] = [
    // @ts-expect-error the controller keeps no collapsed state
    { initialCollapsed: true },
    // @ts-expect-error the controller keeps no collapsed state
    { collapsedStorageKey: "tcrn-side-nav-collapsed" },
    // @ts-expect-error the controller keeps no collapsed state
    { onCollapsedChange: () => undefined }
  ];
  assert.equal(config.length, 3);
  // @ts-expect-error a request carries no collapsed preference
  const request: ProductShellRequestPreferences = { collapsed: true };
  assert.ok(request);
  // @ts-expect-error the cookie reader has no collapsed key
  assert.deepEqual(readPreferenceCookieValues("tcrn-side-nav-collapsed=true", { collapsedKey: "tcrn-side-nav-collapsed" }), { theme: undefined, locale: undefined });
});


// TCRN-DS-STORY-092 batch 2. This repository already had three tab-shaped
// components and none of them implements the ARIA tab pattern; these assertions
// are what separates this one from those.

test("STORY-092 tabs carry the tab pattern's roles and wiring, not aria-current", () => {
  const html = renderToStaticMarkup(
    <Tabs label="Sections" selectedId="two" onSelect={() => {}}
      items={[{ id: "one", label: "One" }, { id: "two", label: "Two" }]}>
      panel body
    </Tabs>
  );
  assert.match(html, /role="tablist"/);
  assert.equal((html.match(/role="tab"/g) ?? []).length, 2);
  assert.match(html, /role="tabpanel"/);
  // A tab swaps a panel; it does not change the page. aria-current would announce
  // "current page", which is the wrong fact.
  assert.doesNotMatch(html, /aria-current/);
  assert.match(html, /aria-selected="true"[^>]*aria-controls="tcrn-tabpanel-two"|aria-controls="tcrn-tabpanel-two"/);
  assert.match(html, /id="tcrn-tabpanel-two"[^>]*aria-labelledby="tcrn-tab-two"/);
});

test("STORY-092 only the selected tab is in the tab order", () => {
  const html = renderToStaticMarkup(
    <Tabs label="Sections" selectedId="one" onSelect={() => {}}
      items={[{ id: "one", label: "One" }, { id: "two", label: "Two" }, { id: "three", label: "Three" }]} />
  );
  // Without the roving tabindex, tabbing past a three-tab strip costs three stops
  // before reaching the content the tabs exist to reveal.
  assert.equal((html.match(/tabindex="-1"/g) ?? []).length, 2);
  assert.equal((html.match(/tabindex="0"/g) ?? []).length, 2, "the selected tab and the panel");
});


// TCRN-DS-STORY-093. The three tab-shaped navs rendered buttons with no handler at
// all: a consumer could wire nothing to them and the markup looked complete. That
// is the "renders an empty nav" shape INIT-011 named, surviving because every test
// read the aria-current attribute and none asked whether a click did anything.
test("STORY-093 a segmented nav renders an activation handler when the consumer supplies one", () => {
  const wired = renderToStaticMarkup(
    <SegmentedNav onSelect={() => {}} items={[{ id: "a", label: "A", selected: true }, { id: "b", label: "B" }]} />
  );
  // renderToStaticMarkup drops handlers, so the observable is that the element is a
  // real button in both cases and the type surface accepts the handler — the DOM
  // harness exercises the click itself.
  assert.equal((wired.match(/<button/g) ?? []).length, 2);
  assert.match(wired, /aria-current="page"/);
  const bare = renderToStaticMarkup(
    <SegmentedNav items={[{ id: "a", label: "A" }]} />
  );
  // Omitting the handler stays legal: ProductLauncher and ProductSwitcher share the
  // item type and do not select, so onSelect is optional rather than required.
  assert.match(bare, /<button/);
});

// TCRN-DS-SUB-124 (STORY-143 GWT2). Five tab-shaped forms grew up apart and said "selected" three
// ways. They now render one block in three variants, and the family has one selected structure:
// the 6% ink wash and the strong weight, with nothing added on top.
test("STORY-143 GWT2 the five tab forms render one family with one selected structure", () => {
  const two = [{ id: "a", label: "Alpha" }, { id: "b", label: "Beta", selected: true }];
  const forms = {
    Tabs: renderToStaticMarkup(<Tabs label="Sections" selectedId="b" onSelect={() => {}} items={[{ id: "a", label: "Alpha" }, { id: "b", label: "Beta" }]} />),
    ModuleTabs: renderToStaticMarkup(<ModuleTabs items={two} />),
    SectionTabs: renderToStaticMarkup(<SectionTabs items={two} />),
    SegmentedNav: renderToStaticMarkup(<SegmentedNav items={two} />),
    ViewTabs: renderToStaticMarkup(<ViewTabs tabs={[{ id: "a", label: "Alpha", href: "#a" }, { id: "b", label: "Beta", href: "#b", current: true }]} />)
  };
  const variants: Record<keyof typeof forms, string> = { Tabs: "panel", ModuleTabs: "nav", SectionTabs: "nav", SegmentedNav: "segmented", ViewTabs: "nav" };
  for (const [name, html] of Object.entries(forms) as [keyof typeof forms, string][]) {
    assert.match(html, new RegExp(`^<(?:div|nav) class="tcrn-tabs tcrn-tabs--${variants[name]}\\b`), `${name} is the Tabs family`);
    const tabs = html.match(/<(?:button|a|span) [^>]*class="tcrn-tabs__tab"[^>]*>/g) ?? [];
    assert.equal(tabs.length, 2, `${name} renders its two tabs as the family's tab`);
    const selected = tabs.filter((tab) => tab.includes('data-selected="true"'));
    assert.equal(selected.length, 1, `${name} marks the chosen tab one way`);
    assert.match(selected[0] ?? "", /title="Beta"/, `${name}: the chosen tab carries its label as a title`);
    assert.match(html, /<span class="tcrn-tabs__label">Beta<\/span>/);
  }
  // One selected rule for the whole family: the wash and the weight, and nothing on top of them.
  const sheet = tcrnComponentCss.replace(/\/\*[\s\S]*?\*\//g, "");
  const selectedRules = [...sheet.matchAll(/([^{}]*)\{([^{}]*)\}/g)]
    .filter(([, selector]) => /\.tcrn-tabs__tab/.test(selector ?? "") && /data-selected|aria-selected|aria-current|--selected/.test(selector ?? ""));
  assert.equal(selectedRules.length, 1);
  const body = selectedRules[0]?.[2] ?? "";
  assert.match(body, /--tcrn-pair-tab-fill: var\(--tcrn-pair-tab-fill-s\);/);
  assert.match(body, /font-weight: var\(--tcrn-type-weight-strong\);/);
  assert.doesNotMatch(body, /border|outline|box-shadow|text-decoration|transform|brand/);
  assert.match(sheet, /--tcrn-pair-tab-fill-s: var\(--tcrn-color-wash\);/, "the selected fill is the 6% wash");
  // The old roots are hooks without rules: no package rule styles them any more.
  assert.doesNotMatch(sheet, /\.tcrn-(?:module-tabs|section-tabs|segmented-nav|view-tabs)\b/);
});

// TCRN-DS-SUB-125 (STORY-143 GWT3). The table of contents is the page's own: it sits in the paper,
// after the page header, and the shell around it has no resident side rail of any kind.
test("STORY-143 GWT3 the TocRail sits in the paper and the shell has no resident side rail", () => {
  const html = renderToStaticMarkup(
    <ProductShell
      productName="TCRN Design System"
      moduleName="Components"
      brandProductId="design-system"
      currentRouteLabel="Navigation shell"
      pageHeader={{ title: "Navigation shell" }}
      navGroups={[]}
      locales={shellLocales}
      currentLocale="en"
    >
      <TocRail label="On this page" items={[{ id: "a", label: "Bands", href: "#a", current: true }, { id: "b", label: "Pins", href: "#b" }]} />
    </ProductShell>
  );
  const paper = html.indexOf("data-paper=");
  const toc = html.indexOf('class="tcrn-toc-rail');
  assert.ok(paper > 0 && toc > paper, "the TocRail is inside the paper");
  assert.ok(toc > html.indexOf('data-pattern="page-header"'), "after the page header, as page content");
  assert.ok(html.indexOf("data-shell-strip") < paper, "the band comes before the paper and holds no TocRail");
  assert.equal(html.match(/<aside /g)?.length, 1, "the only aside is the page's TocRail");
  for (const rail of ["tcrn-side-nav", "tcrn-product-shell__sidebar", "data-side-nav-toggle", "tcrn-shell-mobile-nav-toggle", "tcrn-top-bar"]) {
    assert.equal(html.includes(rail), false, `${rail} is not in the shell`);
  }
});

// TCRN-DS-SUB-124 (STORY-143 GWT4). The breadcrumb is the page header's first row, and it keeps to
// one line at every width, 390 included: crumbs give way with an ellipsis and carry a title.
test("STORY-143 GWT4 the breadcrumb is the page header's first row, on one line, truncating, with titles", () => {
  const header = renderToStaticMarkup(
    <PageHeader title="Roster" breadcrumbs={[{ id: "talent", label: "Talent", href: "/talent" }, { id: "roster", label: "Roster" }]} />
  );
  assert.match(header, /^<header class="tcrn-page-header[^"]*"[^>]*><nav class="tcrn-breadcrumb" aria-label="Breadcrumbs">/);
  const standalone = renderToStaticMarkup(
    <Breadcrumb label="Breadcrumbs" items={[{ id: "talent", label: "Talent", href: "/talent" }, { id: "roster", label: "Roster", selected: true }]} />
  );
  assert.equal(header.match(/<nav class="tcrn-breadcrumb"[\s\S]*?<\/nav>/)?.[0], standalone, "the header's trail is the Breadcrumb component's DOM");
  assert.match(standalone, /<svg [^>]*width="11" height="11"[^>]*aria-hidden="true" data-icon-name="chevron-right" class="tcrn-icon tcrn-breadcrumb__separator"/, "the board's 11 chevron, not read out");
  for (const label of ["Talent", "Roster"]) assert.match(standalone, new RegExp(`class="tcrn-breadcrumb__crumb"[^>]* title="${label}"`));
  // No rule, at any width, lets the trail wrap or stop clipping.
  const sheet = tcrnComponentCss.replace(/\/\*[\s\S]*?\*\//g, "");
  const trailRules = [...sheet.matchAll(/([^{}]*)\{([^{}]*)\}/g)].filter(([, selector]) => /\.tcrn-breadcrumb/.test(selector ?? ""));
  assert.ok(trailRules.length >= 5);
  for (const [, selector, body] of trailRules) {
    assert.doesNotMatch(body ?? "", /flex-wrap:\s*wrap|white-space:\s*(?:normal|pre-wrap|pre-line|break-spaces)|text-overflow:\s*clip|overflow:\s*visible/, `${(selector ?? "").trim()} lets the trail wrap`);
  }
  assert.doesNotMatch(sheet, /\.tcrn-page-header__(?:breadcrumbs?|crumb)/, "one trail: the page header keeps no copy of its own");
});

// TCRN-DS-SUB-123 (STORY-142): the pin of a menu row. Grouping, item and sub-menu rows can all
// be pinned; the pin is a real button beside the link (a link cannot hold one), says its state
// through aria-pressed and names the row in its label, in the reader's language.
const pinNames = {
  "zh-CN": ["固定到顶带：合约", "从顶带取下：合约"],
  en: ["Pin to top bar: 合约", "Unpin from top bar: 合约"],
  ja: ["トップバーに固定：合約", "トップバーから外す：合約"],
  ko: ["상단 바에 고정: 계약", "상단 바에서 해제: 계약"],
  fr: ["Épingler à la barre supérieure : Contrats", "Retirer de la barre supérieure : Contrats"]
} as const;

test("STORY-142 GWT2 a pinnable row's pin is a pressed-state button named after the row", () => {
  const noop = () => {};
  const html = renderToStaticMarkup(
    <SideNav label="菜单">
      <NavGroup label="业务" locale="zh-CN" onPinnedChange={noop}>
        <NavItem href="#contracts" iconName="layers" locale="zh-CN" selected pinned onPinnedChange={noop}>合约</NavItem>
        <NavItem href="#week" depth={1} locale="zh-CN" onPinnedChange={noop}>本周</NavItem>
        <NavItem href="#plain" locale="zh-CN">只读</NavItem>
      </NavGroup>
    </SideNav>
  );
  const pins = [...html.matchAll(/<button type="button" class="tcrn-nav-pin"([^>]*)>/g)].map((match) => match[1]);
  assert.equal(pins.length, 3, "the group row, the item row and the sub-menu row each carry one pin");
  assert.match(pins[0], /aria-pressed="false" aria-label="固定到顶带：业务"/);
  assert.match(pins[1], /aria-pressed="true" aria-label="从顶带取下：合约"/);
  assert.match(pins[2], /aria-pressed="false" aria-label="固定到顶带：本周"/);
  for (const pin of pins) assert.match(pin, /data-pin-button=""/);
  // The pin is the link's sibling inside the row, never inside the link.
  assert.match(html, /<div class="tcrn-nav-item-row" data-navigation-primitive="nav-item-row" data-nav-pinnable="true" data-selected="true"><a [^>]*class="tcrn-nav-item"[^>]*>[\s\S]*?<\/a><button type="button" class="tcrn-nav-pin"/);
  for (const link of html.match(/<a [\s\S]*?<\/a>/g) ?? []) assert.doesNotMatch(link, /<button/);
  // The glyph is the roster pin at 16; the slot is the pin button itself.
  assert.equal((html.match(/data-icon-name="pin"/g) ?? []).length, 3);
  assert.match(html, /<svg[^>]*width="16" height="16"[^>]*data-icon-name="pin"/);
  // A row without onPinnedChange keeps today's markup: no row, no pin.
  const plain = renderToStaticMarkup(<NavItem href="#plain">Plain</NavItem>);
  assert.match(plain, /^<a /);
  assert.doesNotMatch(plain, /tcrn-nav-pin|tcrn-nav-item-row/);
  const plainGroup = renderToStaticMarkup(<NavGroup label="Plain"><span /></NavGroup>);
  assert.match(plainGroup, /<div class="tcrn-nav-group__label"><span class="tcrn-nav-group__label-text" title="Plain">Plain<\/span><\/div>/);

  // Five locales from the shell copy table; the default without a locale is English.
  for (const [locale, [pin, unpin]] of Object.entries(pinNames)) {
    const name = pin.slice(Math.max(pin.lastIndexOf("："), pin.lastIndexOf(": ")) + 1).trim();
    const off = renderToStaticMarkup(<NavItem locale={locale} onPinnedChange={noop}>{name}</NavItem>);
    const on = renderToStaticMarkup(<NavItem locale={locale} pinned onPinnedChange={noop}>{name}</NavItem>);
    assert.match(off, new RegExp(`aria-pressed="false" aria-label="${pin}"`), `${locale} pin`);
    assert.match(on, new RegExp(`aria-pressed="true" aria-label="${unpin}"`), `${locale} unpin`);
  }
  assert.match(renderToStaticMarkup(<NavItem onPinnedChange={noop}>合约</NavItem>), /aria-label="Pin to top bar: 合约"/);
  // Children that are not plain text name the row through pinLabel.
  const labelled = renderToStaticMarkup(
    <NavItem locale="zh-CN" pinLabel="排期" onPinnedChange={noop}><span>排期</span><span>3</span></NavItem>
  );
  assert.match(labelled, /aria-label="固定到顶带：排期"/);
  const groupLabelled = renderToStaticMarkup(<NavGroup label="Ops" pinLabel="运营" locale="zh-CN" onPinnedChange={noop}><span /></NavGroup>);
  assert.match(groupLabelled, /aria-label="固定到顶带：运营"/);
  assert.match(groupLabelled, /<span class="tcrn-nav-group__label-text" title="Ops">Ops<\/span>/);
});

function cssRules(sheet: string) {
  return [...sheet.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/(?:^|\n|\})\s*([^{}@]+)\{([^{}]*)\}/g)].map(([, selector, body]) => ({
    selector: selector.trim(),
    body
  }));
}

test("STORY-142 GWT1 GWT4 the pin slot stays 24 and the pin shows by opacity on hover, focus and when pinned", () => {
  const rules = cssRules(tcrnComponentCss);
  const rule = (selector: string) => rules.find((candidate) => candidate.selector === selector)?.body ?? "";
  // The slot: a fixed column at the row's end, the same at rest and on hover.
  assert.match(rule(".tcrn-nav-item-row"), /grid-template-columns: minmax\(0, 1fr\) var\(--tcrn-shell-pinb\);/);
  assert.match(rule('.tcrn-nav-group__label[data-nav-pinnable="true"]'), /grid-template-columns: minmax\(0, 1fr\) var\(--tcrn-shell-pinb\);/);
  const pin = rule(".tcrn-nav-pin");
  assert.match(pin, /inline-size: var\(--tcrn-shell-pinb\);/);
  assert.match(pin, /block-size: var\(--tcrn-shell-pinb\);/);
  assert.match(pin, /opacity: 0;/);
  // No rule that reaches the pin or the row shows or hides it with display or visibility, and
  // the hover rules change no box: only the pair, so the text box keeps its width.
  for (const { selector, body } of rules) {
    if (!/tcrn-nav-pin|tcrn-nav-item-row/.test(selector)) continue;
    assert.doesNotMatch(body, /(?:^|;|\s)(?:display:\s*none|visibility:\s*hidden)/, selector);
    if (/:hover/.test(selector)) assert.doesNotMatch(body, /(?:width|inline-size|padding|margin|grid-template|display)\s*:/, selector);
  }
  // Shown on row hover, focus inside the row (keyboard on the link or on the pin), the pin's own
  // focus and when pinned.
  const shown = rules.find(({ selector, body }) => selector.includes("> .tcrn-nav-pin") && /opacity: 1;/.test(body));
  assert.ok(shown, "one rule shows the pin");
  for (const part of [".tcrn-nav-item-row:hover", ".tcrn-nav-item-row:focus-within", ".tcrn-nav-group__label:hover", ".tcrn-nav-group__label:focus-within", '[aria-pressed="true"]', ":focus-visible"]) {
    assert.ok(shown.selector.includes(part), `the pin shows on ${part}`);
  }
  // State rules of the pin and the row only switch their pair, with no colour of their own.
  for (const { selector, body } of rules) {
    if (!/^\.tcrn-nav-(?:pin|item-row):where\(/.test(selector)) continue;
    for (const declaration of body.split(";").map((part) => part.trim()).filter(Boolean)) {
      const [property, value] = declaration.split(/:\s*/, 2);
      if (property === "outline" || property === "outline-offset") continue;
      assert.match(property, /^--tcrn-pair-(?:pin|row)-/, `${selector}: ${declaration}`);
      assert.match(value, /^var\(--tcrn-pair-(?:pin|row)-[a-z-]+\)$/, `${selector}: ${declaration}`);
    }
  }
  // The pinned glyph fills the pin body, the first child of the roster icon.
  assert.match(rule(".tcrn-nav-pin .tcrn-icon > :first-child"), /fill: var\(--tcrn-pair-pin-glyph\);/);
  assert.match(pin, /--tcrn-pair-pin-glyph-s: currentColor;/);
  assert.match(pin, /--tcrn-pair-pin-ink-s: var\(--tcrn-color-acc\);/);
  // Touch: the 24 pin answers a 44 square.
  assert.match(tcrnComponentCss, /@media \(pointer: coarse\) \{\s*\.tcrn-nav-pin::after \{\s*content: "";\s*position: absolute;\s*inset: calc\(-1 \* var\(--tcrn-space-2h\)\);\s*\}\s*\}/);
});

function PinFixture({ initial, onNavigate }: { initial: boolean; onNavigate: () => void }) {
  const [pinned, setPinned] = useState(initial);
  return (
    <NavItem href="#contracts" locale="en" pinned={pinned} onPinnedChange={setPinned} onClick={(event) => { event.preventDefault(); onNavigate(); }}>
      Contracts
    </NavItem>
  );
}

test("STORY-142 pressing the pin asks for the other state and does not follow the link", async () => {
  const harness = createDomInteractionHarness();
  try {
    let navigations = 0;
    await harness.render(<PinFixture initial={false} onNavigate={() => { navigations += 1; }} />);
    const pin = harness.document.querySelector("[data-pin-button]");
    assert.ok(pin instanceof harness.window.HTMLButtonElement);
    assert.equal(pin.getAttribute("aria-pressed"), "false");
    await harness.dispatchClick(pin);
    assert.equal(pin.getAttribute("aria-pressed"), "true");
    assert.equal(pin.getAttribute("aria-label"), "Unpin from top bar: Contracts");
    await harness.dispatchClick(pin);
    assert.equal(pin.getAttribute("aria-pressed"), "false");
    assert.equal(navigations, 0, "the pin is not part of the link");
    const link = harness.document.querySelector("a.tcrn-nav-item");
    assert.ok(link);
    await harness.dispatchClick(link);
    assert.equal(navigations, 1);
    assert.equal(link.contains(pin), false);
  } finally {
    await harness.cleanup();
  }
});

// TCRN-DS-SUB-127 (STORY-145): the second of the three renditions, the lockup's first line
// alone, centred on the mark. The mark is logos2's colour file byte for byte, the line keeps the
// lockup's words, weight and suffix colour, and only the flex row centres the two.
function logos2Inner(fileId: string): string {
  // The compiled test sits at packages/ui-react/dist/components/Navigation/, five levels below
  // the repository root.
  const file = readFileSync(new URL(`../../../../../docs/design/gplus-2026-10/logos2/${fileId}.svg`, import.meta.url), "utf8");
  return file.replace(/^<svg\b[^>]*>/u, "").replace(/<\/svg>\s*$/u, "");
}

test("STORY-145 GWT1 ProductLockup's first line draws the four product marks from logos2 at both scales", () => {
  const words = {
    tms: '<b class="tcrn-brand-lockup__word" title="TCRN TMS">TCRN <em class="tcrn-brand-lockup__suffix tcrn-brand-wordmark__suffix--tms">TMS</em></b>',
    "design-system": '<b class="tcrn-brand-lockup__word" title="TCRN Design System">TCRN <em class="tcrn-brand-lockup__suffix tcrn-brand-wordmark__suffix--design-system">Design System</em></b>',
    einzbern: '<b class="tcrn-brand-lockup__word" title="Einzbern">Einzbern</b>',
    "mana-orchestrate": '<b class="tcrn-brand-lockup__word" title="Mana Orchestrate">Mana Orchestrate</b>'
  } as const;
  for (const mark of tcrnProductMarks) {
    const productId = mark.productId as keyof typeof words;
    for (const [scale, kind] of [["rail", "lkr-line"], ["lockup", "lk-line"]] as const) {
      // A mono request does not reach the first line: the top band never shows a mono mark.
      const html = renderToStaticMarkup(<ProductLockup productId={productId} firstLine={scale} markVariant="mono" locale="zh-CN" />);
      assert.match(html, new RegExp(`^<div class="tcrn-brand-lockup tcrn-brand-lockup--line${scale === "rail" ? " tcrn-brand-lockup--line-rail" : ""}${mark.font === "serif" ? " tcrn-brand-lockup--line-serif" : ""}" role="img" aria-label="${mark.name}"`), `${productId} ${scale}`);
      assert.match(html, new RegExp(`data-lockup="${kind}"`));
      const svg = /<svg([^>]*)>([\s\S]*?)<\/svg>/.exec(html);
      assert.ok(svg, `${productId} ${scale} draws an inline mark`);
      assert.match(svg[1], new RegExp(`data-logo="${productId}"`));
      assert.match(svg[1], /aria-hidden="true"/);
      assert.match(svg[1], /data-product-mark-variant="color"/);
      assert.equal(svg[2], logos2Inner(mark.id), `${productId} ${scale}: the mark is logos2/${mark.id}.svg`);
      assert.ok(html.includes(`<span class="tcrn-brand-lockup__line" aria-hidden="true">${words[productId]}</span>`), `${productId} ${scale} line`);
      // One line: no tagline, no byline.
      assert.doesNotMatch(html, /<small|tcrn-product-logo__line-two|tcrn-product-logo__byline|艺人管理系统/);
    }
  }
  // The other two renditions are untouched: the whole lockup still carries its two lines.
  const whole = renderToStaticMarkup(<ProductLockup productId="tms" locale="zh-CN" />);
  assert.match(whole, /class="tcrn-product-logo tcrn-brand-lockup"/);
  assert.match(whole, /<small class="tcrn-product-logo__line-two">艺人管理系统<\/small>/);
  assert.doesNotMatch(whole, /data-lockup=/);
  // Without a product the first line still says the product's whole name.
  const unregistered = renderToStaticMarkup(<ProductLockup firstLine="rail" suffix="Pilot" />);
  assert.match(unregistered, /role="img" aria-label="TCRN Pilot"/);
  assert.match(unregistered, /<b class="tcrn-brand-lockup__word" title="TCRN Pilot">TCRN <em class="tcrn-brand-lockup__suffix">Pilot<\/em><\/b>/);
});

test("STORY-145 GWT2 the first line is centred by the flex row, at the section E sizes, with no nudge", () => {
  const rules = cssRules(tcrnComponentCss);
  const rule = (selector: string) => rules.find((candidate) => candidate.selector === selector)?.body ?? "";
  const lockup = rules.filter(({ selector }) => selector.split(",").map((part) => part.trim()).includes(".tcrn-brand-lockup")).map(({ body }) => body).join("\n");
  assert.match(lockup, /display: inline-flex;/);
  assert.match(lockup, /align-items: center;/);
  assert.match(rule(".tcrn-brand-lockup--line"), /--tcrn-brand-mark-size: 44px;[\s\S]*--tcrn-brand-line-one-size: 16px;[\s\S]*gap: var\(--tcrn-space-3h\);/);
  assert.match(rule(".tcrn-brand-lockup--line-rail"), /--tcrn-brand-mark-size: 22px;[\s\S]*--tcrn-brand-line-one-size: 12\.5px;[\s\S]*--tcrn-brand-line-one-height: var\(--tcrn-type-line-control\);[\s\S]*gap: var\(--tcrn-space-2h\);/);
  const word = rule(".tcrn-brand-lockup__word");
  assert.match(word, /font-weight: var\(--tcrn-type-weight-strong\);/);
  assert.match(word, /white-space: nowrap;/);
  assert.match(word, /text-overflow: ellipsis;/);
  assert.match(rule(".tcrn-brand-lockup__suffix"), /font-style: normal;/);
  assert.match(rule(".tcrn-brand-lockup--line-serif .tcrn-brand-lockup__word"), /font-family: var\(--tcrn-type-family-serif\);[\s\S]*font-size: 18px;/);
  assert.match(rule(".tcrn-brand-lockup--line-rail.tcrn-brand-lockup--line-serif .tcrn-brand-lockup__word"), /font-size: 13\.5px;/);
  // The r6 nudge (the line moved down 2 or 3) must not come back in any first-line rule: no
  // margin, offset or one-sided padding. The word's room above and below its line
  // (TCRN-DS-SUB-143) is a single padding-block value, the same on both sides, so it moves no glyph.
  for (const { selector, body } of rules) {
    if (!/tcrn-brand-lockup(?:--line|__line|__word|__suffix)/.test(selector)) continue;
    assert.doesNotMatch(
      body,
      /(?:^|[;\s])(?:padding|padding-top|padding-bottom|padding-block-start|padding-block-end|margin|margin-top|margin-block|top|transform|translate|position|vertical-align)\s*:/,
      selector
    );
    for (const match of body.matchAll(/(?:^|[;\s])padding-block\s*:\s*([^;]+);/g)) {
      assert.match(match[1].trim(), /^var\(--tcrn-space-[0-9]+h?\)$/, `${selector}: padding-block is one token, the same on both sides`);
    }
  }
});

// Layout model for the first line (TCRN-DS-SUB-143). The unit tests have no layout engine, so the
// two readings the shell gate takes in the browser are worked out here from the rules and the
// tokens. Hanken Grotesk (the vendored latin file) ascends 1000 and descends 303 per 1000 em with
// no line gap; Chromium rounds the ascent and the descent to whole pixels, which is why the
// suffix's line box read 17 at 12.5 in the R1 geometry run. TCRN TMS at 12.5/600 read 60.234 wide
// in the same run.
const firstLineFont = { ascent: 1, descent: 0.303 } as const;
const firstLineTmsWidthPx = 60.234;

/** Evaluates a calc() body of px numbers, given the values of its var() references and of 100%. */
function evaluateLength(expression: string, values: Record<string, number>, percent: number): number {
  const substituted = expression
    .replace(/^calc\(([\s\S]*)\)$/, "$1")
    .replace(/var\((--[a-z0-9-]+)\)/g, (_, name: string) => {
      assert.ok(name in values, `${name} has a value in the model`);
      return String(values[name]);
    })
    .replace(/100%/g, String(percent))
    .replace(/(\d+(?:\.\d+)?)px/g, "$1");
  const parts = substituted.match(/\d+(?:\.\d+)?|[-+*/()]/g) ?? [];
  assert.equal(parts.join(""), substituted.replace(/\s+/g, ""), `${expression} reduces to arithmetic`);
  let at = 0;
  const sum = (): number => {
    let value = product();
    while (parts[at] === "+" || parts[at] === "-") value = parts[at++] === "+" ? value + product() : value - product();
    return value;
  };
  const product = (): number => {
    let value = operand();
    while (parts[at] === "*" || parts[at] === "/") value = parts[at++] === "*" ? value * operand() : value / operand();
    return value;
  };
  const operand = (): number => {
    if (parts[at] === "(") {
      at++;
      const value = sum();
      at++;
      return value;
    }
    return Number(parts[at++]);
  };
  return sum();
}

test("STORY-145 the first line draws a word whole when it fits its line within 1, and its suffix stays inside the word (TCRN-DS-SUB-143)", () => {
  const rules = cssRules(tcrnComponentCss);
  const rule = (selector: string) => rules.find((candidate) => candidate.selector === selector)?.body ?? "";
  const declaration = (body: string, property: string) => new RegExp(`(?:^|[;\\s])${property}:\\s*([^;]+);`).exec(body)?.[1].trim() ?? "";
  const tokens = createTokenMap();
  const px = (variable: string) => Number.parseFloat(tokens[variable]);
  const values = Object.fromEntries(Object.keys(tokens).map((name) => [name, px(name)] as const));
  const word = rule(".tcrn-brand-lockup__word");

  // scrollWidth ≤ clientWidth: the word is as wide as its text and may run 1 past its line, so in a
  // line 60 wide (the brand button's cell) TCRN TMS is drawn whole; past that it ends in an ellipsis.
  assert.equal(declaration(word, "inline-size"), "max-content");
  const maxWidth = (line: number) => evaluateLength(declaration(word, "max-inline-size"), values, line);
  assert.equal(maxWidth(60), 61);
  const clientWidth = Math.min(firstLineTmsWidthPx, maxWidth(60));
  const scrollWidth = firstLineTmsWidthPx;
  assert.ok(scrollWidth <= clientWidth, `TCRN TMS ${scrollWidth} in a word box ${clientWidth} wide shows no ellipsis`);
  assert.ok(Math.min(firstLineTmsWidthPx + 2, maxWidth(60)) < firstLineTmsWidthPx + 2, "a word more than 1 too wide is cut, under its title");
  assert.match(renderToStaticMarkup(<ProductLockup productId="design-system" firstLine="rail" />), /<b class="tcrn-brand-lockup__word" title="TCRN Design System">/);

  // em inside b: at both scales the suffix's line box fits inside the word's box, the same room
  // above and below.
  const room = px(/^var\((--[a-z0-9-]+)\)$/.exec(declaration(word, "padding-block"))?.[1] ?? "");
  assert.equal(room, 2, "space-0h above and below the line");
  const scales = [
    { scale: "rail", size: 12.5, line: 12.5 * Number(tokens["--tcrn-type-line-control"]) },
    { scale: "lockup", size: 16, line: px("--tcrn-type-line-ui") }
  ];
  assert.match(rule(".tcrn-brand-lockup--line"), /--tcrn-brand-line-one-height: var\(--tcrn-type-line-ui\);/);
  for (const { scale, size, line } of scales) {
    const suffixBox = Math.round(size * firstLineFont.ascent) + Math.round(size * firstLineFont.descent);
    const wordBox = line + 2 * room;
    const overhang = (suffixBox - line) / 2;
    assert.ok(overhang <= room, `${scale}: the suffix's line box (${suffixBox}) stays inside the word (${wordBox})`);
    assert.ok(suffixBox <= wordBox, `${scale}: em top and bottom inside b`);
  }
});

test("STORY-143 C7 group titles, search results and pinnable labels carry their titles, and an empty search says so (TCRN-DS-SUB-154)", () => {
  const rules = cssRules(tcrnComponentCss);
  const rule = (selector: string) => rules.find((candidate) => candidate.selector === selector)?.body ?? "";
  const singleLine = (body: string) => {
    assert.match(body, /overflow: hidden;/);
    assert.match(body, /text-overflow: ellipsis;/);
    assert.match(body, /white-space: nowrap;/);
  };
  const noop = () => undefined;

  // 1. A group title that cannot be pinned is the same one-line text as a pinnable one, with its title.
  const plainGroup = renderToStaticMarkup(<NavGroup label="Talent operations and settlements"><span /></NavGroup>);
  assert.match(
    plainGroup,
    /<div class="tcrn-nav-group__label"><span class="tcrn-nav-group__label-text" title="Talent operations and settlements">Talent operations and settlements<\/span><\/div>/
  );
  const groupText = rule(".tcrn-nav-group__label-text");
  assert.match(groupText, /display: block;/, "the text truncates itself in a plain title row too");
  singleLine(groupText);

  // 2. Each search result link carries its whole text as its title.
  const results = renderToStaticMarkup(
    <ProductShellSearch
      query="ro"
      expanded
      results={[
        { id: "roster", title: "Roster", meta: "People", href: "#roster" },
        { id: "rota", title: "Rota", href: "#rota" }
      ]}
    />
  );
  assert.match(results, /<a class="tcrn-product-shell-search__result" href="#roster" title="Roster — People"/);
  assert.match(results, /<a class="tcrn-product-shell-search__result" href="#rota" title="Rota"/);

  // 3. Open with no match, the empty line shows instead of being hidden with the results; closed,
  // the list stays hidden.
  const empty = renderToStaticMarkup(<ProductShellSearch query="zz" expanded results={[]} emptyLabel="No match" />);
  assert.match(empty, /data-product-shell-search-results="true"><span class="tcrn-product-shell-search__empty">No match<\/span><\/div>/);
  assert.doesNotMatch(empty, /data-product-shell-search-results="true" hidden=""/);
  const closed = renderToStaticMarkup(<ProductShellSearch query="" expanded={false} results={[]} />);
  assert.match(closed, /data-product-shell-search-results="true" hidden=""/);

  // 4. A pinnable row's label is one line with its title: its text, or the row's title when the
  // label is markup (the full menu's rows); a row that cannot be pinned keeps its markup.
  const pinnable = renderToStaticMarkup(<NavItem href="#contracts" onPinnedChange={noop}>Contracts and templates</NavItem>);
  assert.match(pinnable, /<span class="tcrn-nav-item__label" title="Contracts and templates">Contracts and templates<\/span>/);
  const marked = renderToStaticMarkup(
    <NavItem href="#roster" title="Roster" onPinnedChange={noop}>
      <span className="tcrn-shell-menu__text">Roster</span>
    </NavItem>
  );
  assert.match(marked, /<span class="tcrn-nav-item__label" title="Roster"><span class="tcrn-shell-menu__text">Roster<\/span><\/span>/);
  assert.match(renderToStaticMarkup(<NavItem href="#plain">Plain</NavItem>), /<span class="tcrn-nav-item__label">Plain<\/span>/);
  singleLine(rule(".tcrn-shell-menu .tcrn-nav-item__label"));
});
