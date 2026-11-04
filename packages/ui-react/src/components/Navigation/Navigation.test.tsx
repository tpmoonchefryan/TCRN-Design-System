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
import { shellMenuPresentationContext } from "./ShellMenu.js";
import { tcrnShellCopyFor } from "./shell-copy.js";
import * as shellSegments from "../../styles/shell.css.js";
import * as shellIntroSegments from "../../styles/shell-intro.css.js";
import * as shellSheetSegments from "../../styles/shell-sheet.css.js";
import { PageHeader, TocRail, ViewTabs } from "../DataDisplay/DomainDisplay.js";
import { Icon } from "../Icon/index.js";
import { createResolvedTokenMap, createTokenMap } from "@tcrn/ui-tokens";
import { createDomInteractionHarness } from "../../test/dom-harness.js";
import { JSDOM } from "jsdom";

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



// Composition one (O-1, TCRN-DS-SUB-090): the shell geometry comes from the shell tokens, the
// rail sits on the canvas colour with no right edge, and above the mobile breakpoint the rail
// guide column is 16 / 48 and the workspace is a sheet 12 from the shell edges.


// The five-locale taglines of STORY-127, as the story states them. The registry
// takes them from the design contract; asserting the story's own words here is what
// catches the contract and the story drifting apart.
const storyTaglines = {
  tms: { "zh-CN": "艺人管理系统", en: "Talent Management System", ja: "タレントマネジメントシステム", ko: "탤런트 관리 시스템", fr: "Système de gestion des talents" },
  einzbern: { "zh-CN": "项目记忆引擎", en: "Project memory engine", ja: "プロジェクト記憶エンジン", ko: "프로젝트 메모리 엔진", fr: "Moteur de mémoire de projet" },
  "mana-orchestrate": { "zh-CN": "项目记忆助手", en: "Project memory assistant", ja: "プロジェクト記憶アシスタント", ko: "프로젝트 메모리 어시스턴트", fr: "Assistant mémoire de projet" },
  "design-system": { "zh-CN": "设计系统", en: "Design System", ja: "デザインシステム", ko: "디자인 시스템", fr: "Système de design" }
} as const;



test("Einzbern and Mana Orchestrate are whole serif names with the byline and no host name", () => {
  assert.equal(tcrnProductLogoRegistry.einzbern.lineOne, "Einzbern");
  assert.equal(tcrnProductLogoRegistry["mana-orchestrate"].lineOne, "Mana Orchestrate");
  for (const productId of ["tms", "einzbern", "mana-orchestrate", "design-system"] as const) {
    const entry = tcrnProductLogoRegistry[productId], serif = productId === "einzbern" || productId === "mana-orchestrate";
    assert.equal(entry.wordmark, serif ? "serif" : "sans");
    if (serif) { assert.equal(entry.byline, "by TCRN");assert.equal(entry.lineOneSuffix, null); }
    for (const locale of ["zh-CN", "en", "ja", "ko", "fr"] as const) for (const scale of ["lockup", "rail"] as const) {
      const html = renderToStaticMarkup(<ProductLockup productId={productId} locale={locale} scale={scale} />), dom = new JSDOM(html);
      try {
        const root = dom.window.document.querySelector('.tcrn-product-logo'), tagline = tcrnProductTagline(productId, locale);
        assert.ok(root?.classList.contains("tcrn-brand-lockup"));
        assert.equal(root?.classList.contains("tcrn-product-logo--serif"), serif);
        assert.equal(root?.classList.contains("tcrn-product-logo--rail"), scale === "rail");
        assert.equal(root?.getAttribute("data-product-id"), productId);
        assert.equal(root?.getAttribute("data-product-wordmark"), entry.wordmark);
        assert.equal(root?.getAttribute("role"), "img");
        assert.equal(root?.getAttribute("aria-label"), `${entry.lineOne} ${tagline}`);
        const line = root?.querySelector('.tcrn-product-logo__line-one');
        assert.equal(line?.textContent, entry.lineOne);assert.equal(line?.getAttribute("title"), entry.lineOne);
        assert.equal(root?.querySelector('.tcrn-product-logo__line-one-base')?.textContent, entry.lineOneBase);
        assert.equal(root?.querySelector('.tcrn-product-logo__line-one-suffix')?.textContent ?? null, entry.lineOneSuffix);
        assert.equal(root?.querySelector('.tcrn-product-logo__line-two')?.textContent, tagline);
        assert.equal(root?.querySelector('.tcrn-product-logo__line-two')?.getAttribute("title"), tagline);
        assert.equal(root?.querySelector('.tcrn-product-logo__byline')?.textContent ?? null, scale === "lockup" ? entry.byline : null);
        assert.ok(root?.querySelector(`svg.tcrn-brand-mark[data-product-mark="${productId}"]`));
        assert.doesNotMatch(html, /Claude|Codex/i);
        if (productId === "mana-orchestrate" && locale === "ja") assert.equal(tagline, "プロジェクト記憶アシスタント");
      } finally { dom.window.close(); }
    }
  }
  assert.doesNotMatch(JSON.stringify(tcrnProductLogoRegistry), /Claude|Codex/i);
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
  assert.match(html, /<div class="tcrn-product-shell__paper" data-paper="" data-product-shell-region="paper"><section id="product-shell-content" class="tcrn-product-shell__main" data-product-shell-region="content" aria-label="Product shell workspace" tabindex="0">/);
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
  // Inspect element membership/attributes instead of class or SVG serialization order.
  const dom = new JSDOM(html);
  try {
    const content = dom.window.document.querySelector('[data-paper] > [data-product-shell-region="content"]');
    const header = content?.firstElementChild;
    assert.ok(header?.matches('header.tcrn-page-header[data-pattern="page-header"][data-density="compact"]'));
    assert.equal(content?.querySelectorAll('[data-pattern="page-header"]').length, 1);
    assert.equal(header?.nextElementSibling?.textContent, "Fixture-safe roster content");
    const title = header?.querySelector('h1.tcrn-page-header__title');
    assert.equal(title?.textContent, "Roster");assert.equal(title?.getAttribute("title"), "Roster");
    assert.ok(title?.classList.contains("tcrn-heading--2"));
    assert.equal(header?.querySelector('.tcrn-page-header__description')?.textContent, "24 people · 3 to invite");
    const trail = header?.querySelector('nav.tcrn-breadcrumb[aria-label="Breadcrumbs"]');
    assert.ok(trail);assert.deepEqual([...trail.querySelectorAll('.tcrn-breadcrumb__crumb')].map(el => [el.textContent, el.getAttribute('title')]), [["Talent", "Talent"], ["Roster", "Roster"]]);
    assert.equal(trail.querySelector('[aria-current="page"]')?.tagName, "B");
    assert.equal(trail.querySelector('[aria-current="page"] a'), null);
    assert.ok(trail.querySelector('svg[data-icon-name="chevron-right"]'));
  } finally { dom.window.close(); }
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

test("search keeps the field and query while empty status changes to real options and back", async () => {
  const harness = createDomInteractionHarness();
  const events: string[] = [];
  function Search() {
    const [query, setQuery] = useState("");
    const [expanded, setExpanded] = useState(false);
    return <ProductShellSearch locale="en" query={query} expanded={expanded}
      results={query === "work" ? [{ id: "work", title: "Work", href: "#work" }] : []}
      onQueryChange={(next) => { events.push(`query:${next}`); setQuery(next); }}
      onExpandedChange={(next, reason) => { events.push(`expanded:${next}:${reason}`); setExpanded(next); }}
      onDismiss={(reason) => events.push(`dismiss:${reason}`)} />;
  }
  try {
    await harness.render(<Search />);
    const input = harness.document.querySelector<HTMLInputElement>("input");
    assert.ok(input);
    const listbox = harness.document.querySelector<HTMLElement>('[role="listbox"]');
    const status = harness.document.querySelector<HTMLElement>('[role="status"]');
    assert.ok(listbox && status);
    await focusElement(harness, input);
    assert.equal(input.getAttribute("aria-expanded"), "false");
    assert.equal(status.hidden, false);
    await updateInputValue(harness, input, "work");
    assert.equal(input.getAttribute("aria-expanded"), "true");
    assert.equal(listbox.hidden, false);
    assert.equal(listbox.querySelectorAll('[role="option"]').length, 1);
    assert.equal(status.hidden, true);
    await updateInputValue(harness, input, "zz");
    assert.equal(input.value, "zz");
    assert.equal(input.getAttribute("aria-expanded"), "false");
    assert.equal(listbox.hidden, true);
    assert.equal(status.hidden, false);
    assert.equal(status.textContent, "No results");
    assert.equal(harness.document.activeElement, input, "empty results keep editing focus");
    await harness.dispatchKeydown(input, "Escape");
    assert.equal(status.hidden, true);
    assert.equal(input.value, "zz", "dismissal preserves the typed query");
    assert.ok(events.includes("query:work") && events.includes("query:zz"));
    assert.ok(events.includes("expanded:false:escape") && events.includes("dismiss:escape"));
  } finally {
    await harness.cleanup();
  }
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
  const harness = createDomInteractionHarness({ shellContainerWidth: 1240 });
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
      <TcrnBrandMark productId="tms" locale="zh-CN" />
      <NavItem locale="zh-CN" disabled>受限模块</NavItem>
      <ShellBrandLockup productId="tms" locale="zh-CN" />
    </>
  );
  for (const name of [
    "切换到夜间模式", "语言", "收起侧边导航", "面包屑导航", "检索产品外壳", "检索结果",
    "产品启动器", "产品切换器", "模块分区", "分区导航", "TCRN TMS"
  ]) {
    assert.match(zh, new RegExp(`(aria-label|title|alt)="${name}"`), `${name} is the zh-CN name`);
  }
  assert.match(zh, /aria-label="TCRN TMS 艺人管理系统"/);
  assert.match(zh, /placeholder="检索"/);
  assert.match(zh, />没有结果</);
  assert.match(zh, />该导航项在此路由下不可用</);
  assert.match(zh, /<b class="tcrn-product-logo__line-one" title="TCRN TMS"><span class="tcrn-product-logo__line-one-base">TCRN<\/span> <em[^>]*>TMS<\/em><\/b>/);
  assert.match(zh, /<small class="tcrn-product-logo__line-two" title="艺人管理系统">艺人管理系统<\/small>/);
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
  const harness = createDomInteractionHarness({ shellContainerWidth: 1240 });
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
    assert.equal(pin.getAttribute("aria-pressed"), "true", "G7 has the pinned marker in the full menu while it is absent from the band");
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
// the shared ink wash (day 6% / night 7%) and the strong weight, with nothing added on top.


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

// R2-11 (TCRN-DS-SUB-156): the separator is the shell.crumb-icon token. Icon takes a number, so the
// component reads the number from the token table and writes no 11 of its own.
test("STORY-143 the breadcrumb separator is the shell.crumb-icon token, read from the token table (TCRN-DS-SUB-156)", () => {
  const size = Number.parseFloat(createTokenMap()["--tcrn-shell-crumb-icon"] ?? "");
  assert.equal(size, 11, "the board's 11 chevron");
  const html = renderToStaticMarkup(<Breadcrumb items={[{ id: "talent", label: "Talent", href: "/talent" }, { id: "roster", label: "Roster", selected: true }]} />);
  assert.match(html, new RegExp(`<svg [^>]*width="${size}" height="${size}"[^>]*class="tcrn-icon tcrn-breadcrumb__separator"`));
  const source = readFileSync(new URL("../../../src/components/Navigation/Navigation.tsx", import.meta.url), "utf8");
  const code = source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
  const separator = /<Icon name="chevron-right" size=\{([^}]*)\} className="tcrn-breadcrumb__separator" \/>/.exec(code);
  assert.ok(separator, "the separator icon");
  assert.doesNotMatch(separator[1] ?? "", /\d/, "the size is not a number written in the component");
  assert.match(code, /variable === "--tcrn-shell-crumb-icon"/);
});

// TCRN-DS-SUB-124 (STORY-143 GWT4). The breadcrumb is the page header's first row, and it keeps to
// one line at every width, 390 included: crumbs give way with an ellipsis and carry a title.


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

test("published07 shell search keeps its own ink-2 shortcut through the actual ProductShellSearch carrier", () => {
  const html = renderToStaticMarkup(<ProductShellSearch label="Find docs" shortcut="⌘ K" />);
  const dom = new JSDOM(html);
  try {
    const selector = ".tcrn-product-shell-search .tcrn-search-input__shortcut";
    const shortcut = dom.window.document.querySelector(selector);
    assert.equal(shortcut?.textContent, "⌘ K");
    assert.equal(shortcut?.closest(".tcrn-product-shell-search")?.getAttribute("data-shell-control"), "product-shell-search");
    const rules = cssRules(Object.values(shellSegments).join("\n")).filter(rule => rule.selector === selector);
    assert.equal(rules.length, 1);
    assert.match(rules[0].body, /color: var\(--tcrn-color-ink-2\);/);
    for (const declaration of ["position: static;", "padding: 0;", "border: 0;", "border-radius: 0;", "font-size: 10.5px;", "line-height: 1.5;", "white-space: nowrap;", "transform: none;"]) {
      assert.ok(rules[0].body.includes(declaration), declaration);
    }
    const dropdown = cssRules(Object.values(shellSegments).join("\n")).find(rule => rule.selector === ".tcrn-shell-dropdown__search .tcrn-search-input__shortcut");
    assert.match(dropdown?.body ?? "", /font-size: 10px;/);
    assert.match(dropdown?.body ?? "", /font-weight: 500;/, "published ts-drop supplies the inherited weight");
  } finally {
    dom.window.close();
  }
});



// The sheet split at its @media (pointer: coarse) blocks: their insides, and the rest of the sheet.
function coarsePointerBlocks(sheet: string) {
  const inside: string[] = [];
  let outside = "";
  let from = 0;
  const opener = /@media \(pointer: coarse\) \{/g;
  for (let match = opener.exec(sheet); match; match = opener.exec(sheet)) {
    let depth = 1;
    let index = match.index + match[0].length;
    for (; index < sheet.length && depth > 0; index += 1) {
      if (sheet[index] === "{") depth += 1;
      else if (sheet[index] === "}") depth -= 1;
    }
    inside.push(sheet.slice(match.index + match[0].length, index - 1));
    outside += sheet.slice(from, match.index);
    from = index;
    opener.lastIndex = index;
  }
  return { inside, outside: outside + sheet.slice(from) };
}

// The parts of a selector list, split at the commas outside parentheses.
function selectorParts(selector: string) {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  for (let index = 0; index < selector.length; index += 1) {
    if (selector[index] === "(") depth += 1;
    else if (selector[index] === ")") depth -= 1;
    else if (selector[index] === "," && depth === 0) {
      parts.push(selector.slice(start, index).trim());
      start = index + 1;
    }
  }
  parts.push(selector.slice(start).trim());
  return parts;
}

// A selector with every :<name>(...) dropped, or replaced by its argument.
function functionalPseudo(selector: string, name: string, keepArgument: boolean) {
  const opener = `:${name}(`;
  let text = selector;
  for (let at = text.indexOf(opener); at !== -1; at = text.indexOf(opener)) {
    let depth = 1;
    let index = at + opener.length;
    for (; index < text.length && depth > 0; index += 1) {
      if (text[index] === "(") depth += 1;
      else if (text[index] === ")") depth -= 1;
    }
    text = text.slice(0, at) + (keepArgument ? text.slice(at + opener.length, index - 1) : "") + text.slice(index);
  }
  return text;
}

// The specificity (ids, classes, types) of one selector: :where() weighs nothing, :not() and :is()
// weigh their argument (one argument in the rules read here).
function selectorSpecificity(selector: string): [number, number, number] {
  const text = functionalPseudo(functionalPseudo(functionalPseudo(selector, "where", false), "not", true), "is", true);
  const attributes = (text.match(/\[[^\]]*\]/g) ?? []).length;
  const bare = text.replace(/\[[^\]]*\]/g, "");
  const pseudoElements = (bare.match(/::[\w-]+/g) ?? []).length;
  const pseudoClasses = (bare.replace(/::[\w-]+/g, "").match(/:[\w-]+/g) ?? []).length;
  const ids = (bare.match(/#[\w-]+/g) ?? []).length;
  const classes = (bare.match(/\.[\w-]+/g) ?? []).length;
  const types = (bare.replace(/::?[\w-]+|[.#][\w-]+/g, "").match(/[a-z][\w-]*/gi) ?? []).length;
  return [ids, classes + attributes + pseudoClasses, types + pseudoElements];
}

function notHeavier(a: readonly number[], b: readonly number[]) {
  for (let index = 0; index < a.length; index += 1) {
    if (a[index] !== b[index]) return a[index] < b[index];
  }
  return true;
}

// TCRN-DS-SUB-235 (STORY-142, R6 minutes D5, O-6): touch has no hover, so under a coarse pointer a
// pin that is not pinned stays shown at rest, in its pair's rest ink (ink-3); under a fine pointer
// it stays hidden at rest and shows on hover, focus and when pinned, as before.


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

test("STORY-144 the shell root reports an open Sheet as data-state=\"sheet\", also on the server (TCRN-DS-SUB-159)", () => {
  const shell = (open: boolean) => (
    <ProductShell
      productName="TCRN TMS"
      moduleName="Talent"
      brandProductId="tms"
      currentRouteLabel="Roster"
      pageHeader={{ title: "Roster" }}
      navGroups={shellNavGroups}
      locales={shellLocales}
      currentLocale="en"
      menuOpen={open}
    >
      <div>content</div>
    </ProductShell>
  );
  // A phone screen rendered on the server sets the Sheet through the presentation context.
  const phone = renderToStaticMarkup(<shellMenuPresentationContext.Provider value="sheet">{shell(true)}</shellMenuPresentationContext.Provider>);
  assert.match(phone, /^<div data-shell="" class="tcrn-product-shell" data-state="sheet"/);
  assert.match(phone, /data-panel="sheet"/);
  const phoneClosed = renderToStaticMarkup(<shellMenuPresentationContext.Provider value="sheet">{shell(false)}</shellMenuPresentationContext.Provider>);
  assert.match(phoneClosed, /^<div data-shell="" class="tcrn-product-shell" data-state="closed"/);
  // The panel keeps "expanded"; the state is a value of the root, not a new prop.
  assert.match(renderToStaticMarkup(shell(true)), /^<div data-shell="" class="tcrn-product-shell" data-state="expanded"/);
  assert.match(renderToStaticMarkup(<shellMenuPresentationContext.Provider value="panel">{shell(true)}</shellMenuPresentationContext.Provider>), /data-state="expanded"/);
});







test("ProductShell hands previewStates to the full menu and the drop-downs (TCRN-DS-SUB-151)", () => {
  const groups: ProductShellNavGroup[] = [
    {
      id: "people",
      label: "People",
      items: [
        { id: "roster", label: "Roster", href: "#roster", selected: true },
        { id: "teams", label: "Teams", href: "#teams" },
        {
          id: "contracts",
          label: "Contracts",
          children: [
            { id: "all-contracts", label: "All contracts", href: "#all-contracts" },
            { id: "templates", label: "Templates", children: [{ id: "signing", label: "Signing contracts", href: "#signing" }] }
          ]
        }
      ]
    }
  ];
  const shell = (options: { menuOpen?: boolean; openPinId?: string; previewStates?: Readonly<Record<string, string>> }) =>
    renderToStaticMarkup(
      <ProductShell
        productName="TCRN TMS"
        moduleName="People"
        brandProductId="tms"
        currentRouteLabel="Roster"
        pageHeader={{ title: "Roster" }}
        navGroups={groups}
        locales={shellLocales}
        currentLocale="en"
        pinnedIds={["contracts"]}
        {...options}
      >
        <div>content</div>
      </ProductShell>
    );
  // The full menu: the Teams row under the pointer, as the documentation shows it.
  const menu = shell({ menuOpen: true, previewStates: { teams: "hover" } });
  assert.match(menu, /<[a-z]+(?=[^>]*title="Teams")(?=[^>]*data-shell-row="")(?=[^>]*data-tcrn-preview-state="hover")[^>]*>/);
  assert.doesNotMatch(menu, /previewstates/i, "the prop does not reach the shell root as an attribute");
  // The drop-down: a row marked "open" starts with its cascade open; without it there is none.
  const drop = shell({ openPinId: "contracts", previewStates: { templates: "open" } });
  assert.match(drop, /data-shell-dropdown=""/);
  assert.match(drop, /<[a-z]+(?=[^>]*title="Templates")(?=[^>]*aria-expanded="true")[^>]*>/);
  assert.match(drop, /data-drop-col="2"/);
  assert.doesNotMatch(shell({ openPinId: "contracts" }), /data-drop-col=/);
});

test("STORY-142 GWT1 STORY-149 GWT1 a row carries the guide-column hooks, and data-shell-group lands on the column that holds the group's title row (TCRN-DS-SUB-152)", () => {
  const noop = () => undefined;
  const html = renderToStaticMarkup(
    <NavGroup label="Talent" data-shell-group="" data-shell-col="">
      <NavItem href="#roster" iconName="users" data-shell-row="">Roster</NavItem>
      <NavItem href="#teams" iconName="users" onPinnedChange={noop} data-shell-row="">Teams</NavItem>
      <NavItem href="#plain" data-shell-row="">Plain</NavItem>
    </NavGroup>
  );
  const { document } = new JSDOM(html).window;
  const group = document.querySelector("[data-shell-group]");
  assert.ok(group && group.matches(".tcrn-nav-group[data-shell-col]"), "the group hook lands on the group's column");
  assert.ok(group.querySelector(":scope > .tcrn-nav-group__label > .tcrn-nav-group__label-text"), "the title row is the column's own child");
  // Every row says where its text starts: on the label, once.
  const rows = [...document.querySelectorAll("[data-shell-row]")];
  assert.equal(rows.length, 3);
  for (const row of rows) {
    const texts = row.querySelectorAll('[data-text="prail"]');
    assert.equal(texts.length, 1);
    assert.ok(texts[0]?.matches(".tcrn-nav-item__label"));
  }
  // A row with an icon says where the guide column's icon starts: on the icon itself.
  const guides = [...document.querySelectorAll('[data-guide="prail"]')];
  assert.equal(guides.length, 2);
  for (const guide of guides) assert.ok(guide.matches("svg.tcrn-icon") && guide.closest("[data-shell-row]"));
  // A pinnable row keeps .tcrn-nav-item-row as its wrapper, the pin beside the link (P2).
  const wrapper = document.querySelector('[data-shell-row][href="#teams"]')?.parentElement;
  assert.ok(wrapper && wrapper.matches(".tcrn-nav-item-row"));
  assert.ok(wrapper.querySelector(":scope > [data-pin-button]"));
});

test("ProductShell hands the held and the default menu query to the full menu, and the groups' descriptions with them (TCRN-DS-SUB-147)", () => {
  const shell = (extra: Partial<ProductShellProps>) =>
    renderToStaticMarkup(
      <ProductShell
        productName="TCRN TMS"
        moduleName="Talent"
        brandProductId="tms"
        currentRouteLabel="Roster"
        pageHeader={{ title: "Roster" }}
        navGroups={shellNavGroups}
        locales={shellLocales}
        currentLocale="en"
        menuOpen
        {...extra}
      >
        <div>content</div>
      </ProductShell>
    );
  const results = (html: string) => {
    const { document } = new JSDOM(html).window;
    return {
      value: document.querySelector<HTMLInputElement>('[data-panel="expanded"] [data-shell-search] input[type="search"]')?.value,
      titles: [...document.querySelectorAll('[data-panel="expanded"] [data-search-result] strong')].map((element) => element.textContent),
      columns: document.querySelectorAll('[data-panel="expanded"] [data-shell-col]').length
    };
  };
  assert.deepEqual(results(shell({})), { value: "", titles: [], columns: 2 });
  assert.deepEqual(results(shell({ defaultMenuQuery: "Contr" })), { value: "Contr", titles: ["Active", "Drafts"], columns: 0 });
  assert.deepEqual(results(shell({ menuQuery: "State", defaultMenuQuery: "Contr", onMenuQueryChange: () => undefined })), { value: "State", titles: ["Statements"], columns: 0 });
  assert.doesNotMatch(shell({ menuQuery: "State", onMenuQueryChange: () => undefined }), /menuquery/i, "the props do not reach the shell root as attributes");
  // A group's description is said with its title row and draws nothing.
  const described = new JSDOM(shell({ navGroups: shellNavGroups.map((group, index) => (index === 1 ? { ...group, description: "Pay and statements" } : group)) })).window.document;
  const title = described.querySelector('[data-panel="expanded"] [data-shell-group]:nth-child(2) > .tcrn-nav-group__label');
  const said = described.getElementById(title?.getAttribute("aria-describedby") ?? "");
  assert.equal(said?.textContent, "Pay and statements");
  assert.ok(said?.matches(".tcrn-sr-only"));
});

test("ProductShell's paper gives the page header's title as the page's h1 unless the page says 2 (TCRN-DS-SUB-163)", () => {
  const shell = (pageHeader: ProductShellProps["pageHeader"]) =>
    renderToStaticMarkup(
      <ProductShell
        productName="TCRN TMS"
        moduleName="Talent"
        brandProductId="tms"
        currentRouteLabel="Roster"
        pageHeader={pageHeader}
        navGroups={shellNavGroups}
        locales={shellLocales}
        currentLocale="en"
      >
        <div>content</div>
      </ProductShell>
    );
  const headings = (html: string) => [...new JSDOM(html).window.document.querySelectorAll("[data-paper] h1, [data-paper] h2")].map((element) => `${element.tagName.toLowerCase()} ${element.className}`);
  // The heading carries the page header's title role (TCRN-DS-SUB-156).
  assert.deepEqual(headings(shell({ title: "Roster" })), ["h1 tcrn-heading tcrn-heading--2 tcrn-page-header__title"]);
  assert.deepEqual(headings(shell({ title: "Roster", headingLevel: 2 })), ["h2 tcrn-heading tcrn-heading--2 tcrn-page-header__title"]);
  assert.deepEqual(headings(shell({ title: "Roster", headingLevel: 1 })), ["h1 tcrn-heading tcrn-heading--2 tcrn-page-header__title"]);
});

test("STORY-147 STORY-140 landmarkLabel names a shell's two navs apart from another shell's on the same page; without it the names stay (TCRN-DS-SUB-148)", () => {
  const shell = (extra: Partial<ProductShellProps>) => (
    <ProductShell
      productName="TCRN TMS"
      moduleName="Talent"
      brandProductId="tms"
      currentRouteLabel="Roster"
      pageHeader={{ title: "Roster" }}
      navGroups={shellNavGroups}
      locales={shellLocales}
      currentLocale="en"
      pinnedIds={["roster", "contracts"]}
      {...extra}
    >
      <div>content</div>
    </ProductShell>
  );
  const navNames = (html: string) => [...new JSDOM(html).window.document.querySelectorAll("nav[data-pins], nav.tcrn-breadcrumb")].map((nav) => nav.getAttribute("aria-label"));
  assert.deepEqual(navNames(renderToStaticMarkup(shell({}))), ["Pinned items", "Breadcrumbs"], "without it the built-in names stay");
  assert.deepEqual(navNames(renderToStaticMarkup(shell({ landmarkLabel: "Docs" }))), ["Docs · Pinned items", "Docs · Breadcrumbs"]);
  assert.deepEqual(navNames(renderToStaticMarkup(shell({ landmarkLabel: "Docs", pageHeader: { title: "Roster", landmarkLabel: "Page" } }))), ["Docs · Pinned items", "Page · Breadcrumbs"]);
  // Two shells on one page: every nav name is its own.
  const both = navNames(renderToStaticMarkup(<>{shell({ landmarkLabel: "Docs" })}{shell({ landmarkLabel: "Example", currentLocale: "zh-CN" })}</>));
  assert.equal(both.length, 4);
  assert.equal(new Set(both).size, 4, both.join(" | "));
  assert.doesNotMatch(renderToStaticMarkup(shell({ landmarkLabel: "Docs" })), /landmarklabel/i, "the prop does not reach the shell root as an attribute");
});

// The landmarks of a page as a reader's tools list them: the elements with a landmark role (a
// section only once it has a name, a header or footer only outside sectioning content) and the
// dialogs, each with its role and its name.
function namedLandmarks(html: string): { role: string; name: string | null }[] {
  const landmarkRoles = new Set(["banner", "navigation", "region", "dialog", "complementary", "main", "contentinfo", "search", "form"]);
  const sectioned = (element: Element) => element.parentElement?.closest("article, aside, main, nav, section") != null;
  const implicitRole = (element: Element): string | null => {
    switch (element.tagName.toLowerCase()) {
      case "header":
        return sectioned(element) ? null : "banner";
      case "nav":
        return "navigation";
      case "aside":
        return "complementary";
      case "main":
        return "main";
      case "footer":
        return sectioned(element) ? null : "contentinfo";
      case "section":
      case "form":
        return element.hasAttribute("aria-label") || element.hasAttribute("aria-labelledby") ? (element.tagName.toLowerCase() === "form" ? "form" : "region") : null;
      default:
        return null;
    }
  };
  return [...new JSDOM(html).window.document.querySelectorAll("header, nav, aside, main, footer, section, form, [role]")]
    .map((element) => ({ role: element.getAttribute("role") ?? implicitRole(element), name: element.getAttribute("aria-label") }))
    .filter((entry): entry is { role: string; name: string | null } => entry.role !== null && landmarkRoles.has(entry.role));
}

test("STORY-140 STORY-147 STORY-143 landmarkLabel names every landmark of a shell, so two shells on a page share none, with the menu, the Sheet, a drop-down or the avatar menu open; without it the names stay (TCRN-DS-SUB-184)", () => {
  const shell = (extra: Partial<ProductShellProps>) => (
    <ProductShell
      productName="TCRN TMS"
      moduleName="Talent"
      brandProductId="tms"
      currentRouteLabel="Roster"
      pageHeader={{ title: "Roster" }}
      navGroups={shellNavGroups}
      locales={shellLocales}
      currentLocale="en"
      pinnedIds={["roster", "contracts"]}
      account={{ name: "Lin Xiao" }}
      products={[
        { id: "tms", label: "TCRN TMS", href: "#tms", current: true },
        { id: "aos", label: "TCRN AOS", href: "#aos" }
      ]}
      {...extra}
    >
      <div>content</div>
    </ProductShell>
  );
  const states: Record<string, Partial<ProductShellProps>> = {
    menu: { menuOpen: true },
    drop: { openPinId: "contracts" },
    account: { accountMenuOpen: true }
  };
  const render = (state: Partial<ProductShellProps>, extra: Partial<ProductShellProps>, presentation: "panel" | "sheet" = "panel") =>
    renderToStaticMarkup(<shellMenuPresentationContext.Provider value={presentation}>{shell({ ...state, ...extra })}</shellMenuPresentationContext.Provider>);
  // Without landmarkLabel every name is the built-in one, word for word as before.
  const names = (html: string) => namedLandmarks(html).map((entry) => `${entry.role} ${entry.name}`);
  assert.deepEqual(names(render(states.menu, {})), [
    "banner Talent shell controls",
    "navigation Pinned items",
    "dialog Navigation",
    "navigation Current location",
    "region Product shell workspace",
    "navigation Breadcrumbs"
  ]);
  assert.deepEqual(names(render(states.menu, {}, "sheet")), [
    "banner Talent shell controls",
    "navigation Pinned items",
    "dialog Navigation",
    "region All",
    "region Product shell workspace",
    "navigation Breadcrumbs"
  ]);
  assert.deepEqual(names(render(states.drop, {})), [
    "banner Talent shell controls",
    "navigation Pinned items",
    "dialog Contracts",
    "region Product shell workspace",
    "navigation Breadcrumbs"
  ]);
  assert.deepEqual(names(render(states.account, {})), [
    "banner Talent shell controls",
    "navigation Pinned items",
    "dialog Account",
    "navigation Switch product",
    "region Product shell workspace",
    "navigation Breadcrumbs"
  ]);
  // With it every name is "{landmarkLabel} · {name}", composed through the shell copy's landmarkOf.
  const copy = tcrnShellCopyFor("en");
  assert.deepEqual(
    names(render(states.menu, { landmarkLabel: "Docs" })),
    ["banner Talent shell controls", "navigation Pinned items", "dialog Navigation", "navigation Current location", "region Product shell workspace", "navigation Breadcrumbs"].map((entry) => {
      const [role, ...name] = entry.split(" ");
      return `${role} ${copy.landmarkOf("Docs", name.join(" "))}`;
    })
  );
  // Two shells on one page that differ in nothing but landmarkLabel: every landmark has a name and
  // no two names are the same, in each state and in the Sheet.
  for (const [label, state] of Object.entries(states)) {
    for (const presentation of ["panel", "sheet"] as const) {
      const both = namedLandmarks(
        renderToStaticMarkup(
          <shellMenuPresentationContext.Provider value={presentation}>
            {shell({ ...state, landmarkLabel: "Docs" })}
            {shell({ ...state, landmarkLabel: "Example" })}
          </shellMenuPresentationContext.Provider>
        )
      );
      const named = both.map((entry) => entry.name);
      assert.ok(named.every((name) => name !== null && name.trim() !== ""), `${label} ${presentation}: every landmark is named`);
      assert.equal(new Set(named).size, named.length, `${label} ${presentation}: ${named.join(" | ")}`);
    }
  }
  // In another language the composition is that language's; a given contentLabel stays as given.
  const zh = tcrnShellCopyFor("zh-CN");
  const zhNames = namedLandmarks(render(states.menu, { landmarkLabel: "文档", currentLocale: "zh-CN" })).map((entry) => entry.name);
  assert.ok(zhNames.includes(zh.landmarkOf("文档", zh.navigation)) && zhNames.includes(zh.landmarkOf("文档", zh.currentPosition)), zhNames.join(" | "));
  assert.ok(namedLandmarks(render(states.menu, { landmarkLabel: "Docs", contentLabel: "Roster page" })).some((entry) => entry.role === "region" && entry.name === "Roster page"));
  assert.doesNotMatch(render(states.drop, { landmarkLabel: "Docs" }), /landmarklabel/i, "the prop reaches no element as an attribute");
});

test("STORY-138 STORY-140 menuShortcut is ProductShell's switch for the full menu's ⌘K: on by default, it reaches no element as an attribute, and the markup is the same either way (TCRN-DS-SUB-185)", () => {
  const shell = (extra: Partial<ProductShellProps>) =>
    renderToStaticMarkup(
      <ProductShell
        productName="TCRN TMS"
        moduleName="Talent"
        brandProductId="tms"
        currentRouteLabel="Roster"
        pageHeader={{ title: "Roster" }}
        navGroups={shellNavGroups}
        locales={shellLocales}
        currentLocale="en"
        menuOpen
        {...extra}
      >
        <div>content</div>
      </ProductShell>
    );
  // The key is registered on the document after mounting (src/test/shell-menu.dom.spec.tsx); the
  // markup, and the menu's ⌘K hint in its search, do not depend on it.
  assert.equal(shell({ menuShortcut: false }), shell({}));
  assert.equal(shell({ menuShortcut: true }), shell({}));
  assert.doesNotMatch(shell({ menuShortcut: false }), /menushortcut/i);
});

test("STORY-145 STORY-149 a measured lockup's data-logo is its mark's id, the logos2 file's name: ds and mana, not the product keys (TCRN-DS-SUB-194)", () => {
  const logoOf = (html: string) => /<svg[^>]*\bdata-logo="([^"]*)"/.exec(html)?.[1] ?? null;
  const expected = { "design-system": "ds", "mana-orchestrate": "mana", tms: "tms", einzbern: "einzbern" } as const;
  for (const [productId, markId] of Object.entries(expected) as [keyof typeof expected, string][]) {
    assert.ok(tcrnProductMarks.some((mark) => mark.id === markId && mark.productId === productId), `${markId} is the mark of ${productId}`);
    for (const firstLine of ["rail", "lockup"] as const) {
      assert.equal(logoOf(renderToStaticMarkup(<ProductLockup productId={productId} firstLine={firstLine} />)), markId, `${productId} first line ${firstLine}`);
    }
    // The bottom bar's lockup, measured through its data-lockup hook, writes the same id.
    assert.equal(logoOf(renderToStaticMarkup(<ProductLockup productId={productId} scale="rail" data-lockup="lkr" />)), markId, `${productId} lockup`);
    // The product key stays where it was: data-product-id on the lockup and data-product-mark on the mark.
    const line = renderToStaticMarkup(<ProductLockup productId={productId} firstLine="rail" />);
    assert.match(line, new RegExp(`data-product-id="${productId}"`));
    assert.match(line, new RegExp(`data-product-mark="${productId}"`));
  }
});



test("published brand identities reject missing keys, AOS and free suffix fallbacks",()=>{
  assert.deepEqual(Object.keys(tcrnProductLogoRegistry).sort(),["design-system","einzbern","mana-orchestrate","tms"]);
  assert.throws(()=>renderToStaticMarkup(<ProductLogo productId={"aos" as never}/>));
  assert.throws(()=>TcrnBrandMark({} as never));
  assert.throws(()=>ProductLockup({suffix:"TMS"} as never));
  for(const productId of ["tms","einzbern","mana-orchestrate","design-system"] as const){
    const html=renderToStaticMarkup(<ProductLockup productId={productId} locale="zh-CN"/>);
    assert.match(html,/<svg/);assert.doesNotMatch(html,/<img|tcrn-brand-mark\.svg/);
  }
});
test("published paper Tabs keep ink underline and do not inherit selected-row wash",()=>{
  assert.match(tcrnComponentCss,/tcrn-tabs__tab\[aria-selected="true"\]:after/);
  assert.match(tcrnComponentCss,/height:1px;background:var\(--tcrn-color-rule\)/);
  assert.doesNotMatch(tcrnComponentCss,/\.tcrn-(?:toast|side-nav|state-surface|record-table|setting-row|badge|stamp)\b/);
});

 test("published ProductLogo is the symbol; text belongs to ProductLockup",()=>{
 const symbol=renderToStaticMarkup(<ProductLogo productId="tms"/>),lockup=renderToStaticMarkup(<ProductLockup productId="tms" locale="en"/>);
 assert.match(symbol,/data-product-mark="tms"/);assert.doesNotMatch(symbol,/<b|<small|<em/);
 assert.match(lockup,/tcrn-product-logo__line-one/);assert.match(lockup,/tcrn-product-logo__line-two/);
 });

test("paper Tabs have instance-local IDs and a named shared content panel",()=>{
 const items=[{id:"all",label:"All"},{id:"signed",label:"Signed"}];
 const html=renderToStaticMarkup(<div><Tabs items={items} selectedId="all" onSelect={()=>{}} label="First">One</Tabs><Tabs items={items} selectedId="signed" onSelect={()=>{}} label="Second">Two</Tabs></div>);
 const document=new JSDOM(html).window.document,ids=[...document.querySelectorAll("[id]")].map(el=>el.id);assert.equal(new Set(ids).size,ids.length);
 for(const tabs of document.querySelectorAll(".tcrn-tabs")){const panel=tabs.querySelector('[role="tabpanel"]');assert.ok(panel);const selected=tabs.querySelector('[role="tab"][aria-selected="true"]');assert.ok(selected);assert.equal(panel.getAttribute("aria-labelledby"),selected.id);for(const tab of tabs.querySelectorAll('[role="tab"]'))assert.equal(tab.getAttribute("aria-controls"),panel.id);}
});
test("paper Tabs keyboard selection moves focus and skips disabled choices",async()=>{
 const harness=createDomInteractionHarness();function Fixture(){const [selected,setSelected]=useState("all");return <Tabs items={[{id:"all",label:"All"},{id:"blocked",label:"Unavailable",disabled:true},{id:"signed",label:"Signed"}]} selectedId={selected} onSelect={setSelected} label="Roster">Table</Tabs>;}
 try{await harness.render(<Fixture/>);const first=harness.document.querySelector('[role="tab"][data-tab-id="all"]') as HTMLButtonElement;await act(async()=>{first.focus();first.dispatchEvent(new harness.window.KeyboardEvent("keydown",{key:"ArrowRight",bubbles:true}));});const selected=harness.document.querySelector('[role="tab"][aria-selected="true"]');assert.ok(selected);assert.equal(selected.getAttribute("data-tab-id"),"signed");assert.equal(harness.document.activeElement,selected);assert.equal(selected.getAttribute("tabindex"),"0");assert.equal(first.getAttribute("tabindex"),"-1");}
 finally{await harness.cleanup();}
});
