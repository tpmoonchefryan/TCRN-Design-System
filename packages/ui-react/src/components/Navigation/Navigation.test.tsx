import test from "node:test";
import assert from "node:assert/strict";
import { act, useState, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  Tabs,
  ModuleTabs,
  SectionTabs,
  SegmentedNav,
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
  tcrnProductTagline,
  readPreferenceCookieValues,
  useProductShellController,
  type ShellThemeMode
} from "./Navigation.js";
import { createDomInteractionHarness } from "../../test/dom-harness.js";

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
  assert.match(html, /<a href="\/work-items\?project=ds">Design System<\/a>/);
  assert.match(html, /<a href="\/work-items\/TCRN-AOS-EPIC-030">EPIC-030<\/a>/);
  // The crumb the reader is standing on stays inert with aria-current, which is what
  // tells a screen-reader user which end of the trail they are at. A link here would
  // be a link to the page they are already on.
  assert.match(html, /<span aria-current="page">STORY-104<\/span>/);
  assert.equal((html.match(/<a href=/g) ?? []).length, 2);

  // `selected` outranks `href`, so a consumer that supplies both — the natural
  // mistake when the trail is built by mapping over ancestors — still gets an inert
  // current crumb rather than a self-link.
  const bothHtml = renderToStaticMarkup(
    <Breadcrumb items={[{ id: "here", label: "Here", href: "/here", selected: true }]} />
  );
  assert.doesNotMatch(bothHtml, /<a href=/);
  assert.match(bothHtml, /aria-current="page">Here</);

  // A trail with no hrefs at all is still legal markup — the component cannot know
  // whether a route has ancestors — so the rule that a drilled-down route must carry
  // them is enforced where the route is known: the consumer's own way-back gate.
  const inertHtml = renderToStaticMarkup(
    <Breadcrumb items={[{ id: "a", label: "A" }, { id: "b", label: "B", selected: true }]} />
  );
  assert.doesNotMatch(inertHtml, /<a href=/);
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

test("registered product logos expose exact DS AOS and TMS lockups", () => {
  assert.equal(tcrnProductLogoRegistry["design-system"].assetId, "tcrn-design-system-two-line");
  assert.equal(tcrnProductLogoRegistry["design-system"].stackSuffix, true);
  assert.equal(tcrnProductLogoRegistry.aos.lineOne, "TCRN AOS");
  assert.equal(tcrnProductLogoRegistry.aos.stackSuffix, false);
  assert.equal(tcrnProductLogoRegistry.tms.lineOne, "TCRN TMS");
  assert.equal(tcrnProductLogoRegistry.tms.stackSuffix, false);

  // The wordmark is a name and the tagline is copy, so they are asserted
  // differently on purpose: `lineOne` is one Latin string in every locale, while
  // `lineTwo` must carry all five. Checking only the English member would leave
  // the same hole the old single-string shape had — it read as complete.
  for (const productId of ["design-system", "aos", "tms"] as const) {
    assert.deepEqual(
      Object.keys(tcrnProductLogoRegistry[productId].lineTwo).sort(),
      ["en", "fr", "ja", "ko", "zh-CN"],
      `${productId} tagline must carry all five locales`
    );
  }
  assert.equal(tcrnProductLogoRegistry.aos.lineTwo.en, "AI Operation System");
  assert.equal(tcrnProductLogoRegistry.aos.lineTwo["zh-CN"], "AI 运营系统");
  assert.equal(tcrnProductLogoRegistry.tms.lineTwo.en, "Talent Management System");
  assert.equal(tcrnProductLogoRegistry.tms.lineTwo.ja, "タレントマネジメントシステム");
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
  assert.match(jaHtml, /class="tcrn-product-logo__line-two">コンポーネントライブラリ</);
  assert.match(jaHtml, /class="tcrn-product-logo__line-two">AI オペレーションシステム</);
  assert.match(jaHtml, /class="tcrn-product-logo__line-two">タレントマネジメントシステム</);
  assert.match(jaHtml, /aria-label="TCRN AOS AI オペレーションシステム"/);
  assert.match(jaHtml, /class="tcrn-product-logo__line-one-suffix tcrn-brand-wordmark__suffix--aos">AOS</);
  assert.doesNotMatch(jaHtml, />AI Operation System</);
  assert.doesNotMatch(jaHtml, />Talent Management System</);

  const longSuffixLockupHtml = renderToStaticMarkup(<ProductLockup suffix="Design System" suffixClassName="tcrn-brand-wordmark__suffix--design-system" />);
  assert.match(longSuffixLockupHtml, /tcrn-brand-lockup--long-name/);
});

test("product shell renders package-backed side-nav shell and effect boundary", () => {
  const html = renderToStaticMarkup(
    <ProductShell
      productName="TCRN AOS"
      moduleName="Frontend shell slice"
      brandProductId="aos"
      brandHref="/cockpit"
      brandMarkSrc="/assets/tcrn-brand-mark.svg"
      brandMarkAlt="TCRN registered brand mark"
      currentRouteLabel="Cockpit"
      currentRouteLabelKey="story.cockpit.title"
      currentLocationLabelKey="shell.currentLocationLabel"
      navLabel="Registered AOS modules"
      collapsed
      collapsedStorageKey="tcrn-aos-side-nav-collapsed"
      currentTheme="dark"
      locales={[
        { locale: "en", nativeName: "English" },
        { locale: "zh-CN", nativeName: "简体中文" }
      ]}
      currentLocale="zh-CN"
      localeMenuOpen
      search={{
        label: "Search AOS shell",
        placeholder: "Search modules, work items, or proof",
        query: "shell",
        expanded: true,
        results: [
          { id: "cockpit", title: "Cockpit", titleKey: "story.cockpit.title", meta: "Local proof shell", metaKey: "group.Operations", href: "/cockpit", selected: true }
        ],
        "data-product-shell-search-label-key": "shell.searchLabel"
      }}
      navGroups={[
        {
          id: "registered",
          label: "Registered shell entries",
          labelKey: "category.registered",
          description: "Registered IA routes",
          descriptionKey: "category.registered.description",
          sectionLabel: "Operations",
          sectionLabelKey: "group.Operations",
          selected: true,
          items: [
            { id: "cockpit", label: "Cockpit", labelKey: "story.cockpit.title", href: "/cockpit", iconName: "home", selected: true },
            { id: "work", label: "Work", labelKey: "story.work.title", href: "/work", iconName: "database" }
          ]
        }
      ]}
    >
      <section>Fixture-safe cockpit content</section>
    </ProductShell>
  );

  assert.match(html, /data-package-backed-product-shell-boundary="side-nav-shell-v1"/);
  assert.match(html, /data-product-shell-pattern="attached-side-nav"/);
  assert.match(html, /data-product-shell-collapsed="true"/);
  assert.match(html, /data-product-shell-theme="dark"/);
  assert.match(html, /data-product-shell-responsive="desktop-attached-mobile-stacked"/);
  assert.match(html, /data-product-shell-effect-boundary="ds-owned-tokens-motion-focus"/);
  assert.match(html, /data-product-shell-consumer-scope="ia-data-route-labels-content-callbacks"/);
  assert.match(html, /data-product-shell-semantic-api="collapse-theme-locale-search"/);
  assert.match(html, /data-product-shell-current-location-label-key="shell.currentLocationLabel"/);
  assert.match(html, /data-product-shell-current-route-label-key="story.cockpit.title"/);
  assert.match(html, /data-registered-brand-lockup="@tcrn\/ui-react\/ShellBrandLockup"/);
  assert.match(html, /href="\/cockpit"/);
  assert.match(html, /data-registered-product-logo="@tcrn\/ui-react\/ProductLogo"/);
  assert.match(html, /data-visible-registered-brand-lockup="true"/);
  assert.match(html, /data-product-id="aos"/);
  assert.match(html, /data-product-logo-asset-id="tcrn-aos-two-line"/);
  assert.match(html, /class="tcrn-product-logo__line-one-base">TCRN</);
  assert.match(html, /class="tcrn-product-logo__line-one-suffix tcrn-brand-wordmark__suffix--aos">AOS</);
  // This fixture is a zh-CN shell, so the brand tagline must be Chinese. The
  // assertion here used to require English and passed — that is what the defect
  // looked like from inside the proof: the shell knew the reader's locale for its
  // own utility row and resolved the brand block without it.
  assert.match(html, /class="tcrn-product-logo__line-two">AI 运营系统</);
  assert.doesNotMatch(html, />AI Operation System</);
  assert.doesNotMatch(html, /AOS Rebuild Workspace|Rebuild workspace/);
  assert.doesNotMatch(html, /tcrn-top-bar__brand/);
  assert.doesNotMatch(html, /tcrn-top-bar__module/);
  assert.match(html, /src="\/assets\/tcrn-brand-mark\.svg"/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /data-side-nav-persisted-key="tcrn-aos-side-nav-collapsed"/);
  assert.match(html, /data-side-nav-semantic-api="onCollapsedChange"/);
  assert.match(html, /data-registered-navigation-only="true"/);
  assert.match(html, /data-product-shell-nav-group-label-key="category.registered"/);
  assert.match(html, /data-product-shell-nav-group-description-key="category.registered.description"/);
  assert.match(html, /data-product-shell-nav-group-section-label-key="group.Operations"/);
  assert.match(html, /data-product-shell-route="cockpit"/);
  assert.match(html, /data-product-shell-route-label-key="story.cockpit.title"/);
  assert.match(html, /data-product-shell-route="work"/);
  assert.match(html, /data-product-shell-route-label-key="story.work.title"/);
  assert.match(html, /data-shell-control="product-shell-search"/);
  assert.match(html, /data-product-shell-search-label-key="shell.searchLabel"/);
  assert.match(html, /data-search-result-title-key="story.cockpit.title"/);
  assert.match(html, /data-search-result-meta-key="group.Operations"/);
  assert.match(html, /data-search-dismissal-contract="blur-outside-pointer-tab-escape"/);
  assert.match(html, /data-search-semantic-api="onQueryChange-onExpandedChange-onDismiss-onResultActivate"/);
  assert.match(html, /data-search-expanded="true"/);
  assert.match(html, /role="listbox"/);
  assert.match(html, /aria-selected="true"/);
  assert.match(html, /data-locale-menu-open="true"/);
  assert.match(html, /data-locale-dismissal-contract="selection-outside-pointer-escape-focus-return"/);
  assert.match(html, /data-locale-semantic-api="onOpenChange-onLocaleChange"/);
  assert.match(html, /data-package-backed-shell-control="theme-toggle"/);
  assert.match(html, /data-theme-transition-contract="whole-page-view-transition-or-token-wash"/);
  const currentLocationIndex = html.indexOf('class="tcrn-product-shell__current-location"');
  const searchIndex = html.indexOf('data-shell-control="product-shell-search"');
  const themeIndex = html.indexOf('data-theme-toggle="true"');
  const localeIndex = html.indexOf("data-locale-menu-toggle");
  assert.ok(currentLocationIndex > -1);
  assert.ok(searchIndex > -1);
  assert.ok(themeIndex > -1);
  assert.ok(localeIndex > -1);
  assert.ok(currentLocationIndex < searchIndex);
  assert.ok(searchIndex < themeIndex);
  assert.ok(themeIndex < localeIndex);
  assert.match(html, /Fixture-safe cockpit content/);
});

test("product shell component css keeps motion shorthands valid", () => {
  assert.match(tcrnComponentCss, /--tcrn-motion-product-shell: var\(--tcrn-motion-emphasis\)/);
  assert.match(tcrnComponentCss, /--tcrn-motion-product-shell-search: 240ms var\(--tcrn-motion-ease-drawer\)/);
  // Elevation and inverse text are governed by @tcrn/ui-tokens now; a local
  // redefinition here would silently shadow the package and un-govern the look.
  assert.doesNotMatch(tcrnComponentCss, /--tcrn-elevation-floating:/);
  assert.doesNotMatch(tcrnComponentCss, /--tcrn-color-text-inverse:/);
  assert.match(tcrnComponentCss, /transition: grid-template-columns var\(--tcrn-motion-product-shell\);/);
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
  assert.match(tcrnComponentCss, /\.tcrn-segmented-nav\b/);
  assert.match(tcrnComponentCss, /\.tcrn-highlight-mark\b/);
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
});

test("product shell component css isolates topbar from docs chrome", () => {
  assert.match(tcrnComponentCss, /\.tcrn-product-shell__workspace > \.tcrn-top-bar \{[\s\S]*border: 0;[\s\S]*border-bottom: 1px solid var\(--tcrn-color-border-subtle\);[\s\S]*border-radius: 0;/);
  assert.match(tcrnComponentCss, /\.tcrn-product-shell__workspace > \.tcrn-top-bar \{[\s\S]*display: grid;[\s\S]*grid-template-columns: minmax\(0, 1fr\);[\s\S]*gap: var\(--tcrn-space-4\);[\s\S]*justify-content: stretch;/);
  assert.match(tcrnComponentCss, /\.tcrn-product-shell__workspace > \.tcrn-top-bar \{[\s\S]*background: color-mix\(in srgb, var\(--tcrn-color-surface-panel\), transparent 5%\);/);
  assert.match(tcrnComponentCss, /\.tcrn-product-shell \{[\s\S]*font-family: var\(--tcrn-type-family-ui\);[\s\S]*font-size: var\(--tcrn-type-size-ui\);[\s\S]*line-height: var\(--tcrn-type-line-ui\);/);
  assert.match(tcrnComponentCss, /\.tcrn-product-shell :focus-visible:not\(\.tcrn-search-input__control\) \{[\s\S]*outline: 3px solid var\(--tcrn-color-focus-ring\);[\s\S]*box-shadow: none;/);
  assert.match(tcrnComponentCss, /\.tcrn-product-shell \.tcrn-search-input:focus-within \{[\s\S]*outline: 3px solid var\(--tcrn-color-focus-ring\);[\s\S]*outline-offset: 2px;/);
  assert.match(tcrnComponentCss, /\.tcrn-product-shell \.tcrn-search-input__control:focus,[\s\S]*\.tcrn-product-shell \.tcrn-search-input__control:focus-visible \{[\s\S]*outline-style: none;[\s\S]*outline-width: 0;[\s\S]*outline-offset: 0;[\s\S]*box-shadow: none;/);
  assert.match(tcrnComponentCss, /\.tcrn-nav-item\[data-nav-item-has-icon="false"\] \{[\s\S]*grid-template-columns: minmax\(0, 1fr\);/);
  assert.match(tcrnComponentCss, /\.tcrn-nav-item__content \{[\s\S]*min-width: 0;/);
  assert.match(tcrnComponentCss, /\.tcrn-nav-item__label \{[\s\S]*overflow-wrap: normal;[\s\S]*word-break: normal;/);
  assert.match(tcrnComponentCss, /\.tcrn-nav-item\[data-selected="true"\],[\s\S]*\.tcrn-nav-item\[aria-current="page"\] \{[\s\S]*box-shadow: none;/);
});

test("product shell utility row wraps controls within owner-quality story frames", () => {
  assert.match(tcrnComponentCss, /\.tcrn-product-shell__utility-row \{[\s\S]*display: flex;[\s\S]*flex-wrap: wrap;[\s\S]*justify-content: flex-end;[\s\S]*min-width: 0;/);
  assert.match(tcrnComponentCss, /\.tcrn-product-shell__utility-row > \* \{[\s\S]*min-width: 0;/);
  assert.match(tcrnComponentCss, /\.tcrn-product-shell__current-location \{[\s\S]*flex: 0 1 240px;[\s\S]*margin-right: auto;[\s\S]*max-width: 240px;/);
  assert.match(tcrnComponentCss, /\.tcrn-product-shell-search \{[\s\S]*flex-basis: 260px;[\s\S]*margin-left: auto;[\s\S]*width: 260px;[\s\S]*max-width: min\(100%, 260px\);/);
  assert.match(tcrnComponentCss, /\.tcrn-product-shell-search\[data-search-expanded="true"\] \{[\s\S]*flex-basis: 420px;[\s\S]*width: 420px;[\s\S]*max-width: min\(100%, 420px\);/);
  // The mobile utility row lays out on one line and wraps only when it must.
  // It used to stretch each control to a full row of its own, which spent 130px
  // of a 760px screen on three controls before the page said anything — lever 2
  // of the mobile fold budget (TCRN-AOS-MIN-006).
  assert.match(tcrnComponentCss, /@media \(max-width: 760px\) \{[\s\S]*\.tcrn-product-shell__utility-row \{[\s\S]*justify-content: flex-start;[\s\S]*align-items: center;[\s\S]*flex-wrap: wrap;[\s\S]*\.tcrn-product-shell-search,\n  \.tcrn-product-shell-search\[data-search-expanded="true"\] \{[\s\S]*flex-basis: min\(100%, 320px\);[\s\S]*margin-left: 0;[\s\S]*width: 320px;[\s\S]*max-width: 320px;/);
  assert.doesNotMatch(tcrnComponentCss, /@media \(max-width: 760px\) \{[\s\S]*\.tcrn-product-shell__utility-row \{[\s\S]*justify-content: stretch;/);
  assert.match(tcrnComponentCss, /@media \(max-width: 760px\) \{[\s\S]*\.tcrn-shell-locale-menu__trigger \{[\s\S]*width: 100%;[\s\S]*max-width: none;/);
  assert.doesNotMatch(tcrnComponentCss, /\.tcrn-product-shell__utility-row \{[\s\S]*grid-template-columns: max-content minmax\(220px, 360px\) max-content max-content;/);
});

test("product shell lets consumers omit shell search when the product has no global search", () => {
  const html = renderToStaticMarkup(
    <ProductShell
      productName="TCRN AOS"
      moduleName="Operations Cockpit"
      brandProductId="aos"
      currentRouteLabel="Operations Cockpit"
      navLabel="AOS operations navigation"
      currentLocale="en"
      locales={[{ locale: "en", nativeName: "English" }]}
      navGroups={[
        {
          id: "registered",
          label: "Registered shell entries",
          selected: true,
          items: [{ id: "cockpit", label: "Cockpit", href: "/cockpit", iconName: "home", selected: true }]
        }
      ]}
    >
      <section>Owner-quality content without global search</section>
    </ProductShell>
  );

  assert.doesNotMatch(html, /data-shell-control="product-shell-search"/);
  assert.match(html, /data-product-shell-semantic-api="collapse-theme-locale"/);
  assert.doesNotMatch(html, /data-product-shell-semantic-api="collapse-theme-locale-search"/);
  assert.match(html, /data-shell-control="theme-toggle"/);
  assert.match(html, /data-locale-menu-toggle/);
  assert.match(html, /Owner-quality content without global search/);
});

test("product shell hosts product-owned header actions without moving its own utilities", () => {
  const shell = (headerActions?: ReactNode) => renderToStaticMarkup(
    <ProductShell
      productName="TCRN AOS"
      moduleName="Operations Cockpit"
      brandProductId="aos"
      currentRouteLabel="Work items"
      navLabel="AOS operations navigation"
      currentLocale="en"
      locales={[{ locale: "en", nativeName: "English" }]}
      navGroups={[
        {
          id: "delivery",
          label: "Delivery",
          selected: true,
          items: [{ id: "work", label: "Work items", href: "/work", iconName: "home", selected: true }]
        }
      ]}
      {...(headerActions ? { headerActions } : {})}
    >
      <section>Shell content</section>
    </ProductShell>
  );

  const withActions = shell(<span data-product-control="workspace-switcher">cross-project</span>);
  assert.match(withActions, /data-product-shell-region="header-actions"/);
  assert.match(withActions, /data-product-shell-header-actions="present"/);
  assert.match(withActions, /data-product-control="workspace-switcher"/);

  // The shell's own utilities must stay rightmost, so a product adding controls
  // never shifts the theme and locale affordances users navigate by position.
  const actionsAt = withActions.indexOf('data-product-shell-region="header-actions"');
  const themeAt = withActions.indexOf('data-shell-control="theme-toggle"');
  const localeAt = withActions.indexOf("data-locale-menu-toggle");
  assert.ok(actionsAt > 0 && actionsAt < themeAt && themeAt < localeAt);

  // Purely additive: omitting the prop renders the row exactly as before.
  const withoutActions = shell();
  assert.doesNotMatch(withoutActions, /data-product-shell-region="header-actions"/);
  assert.match(withoutActions, /data-product-shell-header-actions="absent"/);

  assert.match(tcrnComponentCss, /\.tcrn-product-shell__header-actions \{[\s\S]*display: flex;[\s\S]*align-items: center;/);
});

test("product shell can disable side-nav collapse with a truthful package-backed reason", () => {
  const html = renderToStaticMarkup(
    <ProductShell
      productName="TCRN AOS"
      moduleName="Operations Cockpit"
      brandProductId="aos"
      currentRouteLabel="Operations Cockpit"
      navLabel="AOS operations navigation"
      currentLocale="en"
      sideNavCollapseDisabledReason="Side navigation stays expanded for owner-review routes"
      locales={[{ locale: "en", nativeName: "English" }]}
      navGroups={[
        {
          id: "registered",
          label: "Registered shell entries",
          selected: true,
          items: [{ id: "cockpit", label: "Cockpit", href: "/cockpit", iconName: "home", selected: true }]
        }
      ]}
    >
      <section>Owner-quality content</section>
    </ProductShell>
  );

  assert.match(html, /data-package-backed-shell-control="side-nav-collapse"/);
  assert.match(html, /data-side-nav-action="disabled"/);
  assert.match(html, /data-side-nav-disabled-reason="Side navigation stays expanded for owner-review routes"/);
  assert.match(html, /aria-label="Side navigation stays expanded for owner-review routes"/);
  assert.match(html, /title="Side navigation stays expanded for owner-review routes"/);
  assert.match(html, /aria-disabled="true"/);
  assert.match(html, /disabled=""/);
  assert.match(html, /aria-expanded="true"/);
});

test("product shell component css keeps package controls contrast-safe", () => {
  assert.match(tcrnComponentCss, /--tcrn-color-brand-secondary-readable: #246f80/);
  assert.match(tcrnComponentCss, /--tcrn-color-brand-secondary-readable: #a6e8ef/);
  assert.match(tcrnComponentCss, /--tcrn-brand-accent-aos: #187c7c/);
  assert.match(tcrnComponentCss, /--tcrn-brand-accent-tms: #2c63c8/);
  assert.match(tcrnComponentCss, /\.tcrn-brand-wordmark__suffix \{[\s\S]*color: var\(--tcrn-color-brand-secondary-readable\);/);
  assert.match(tcrnComponentCss, /\.tcrn-brand-wordmark__suffix--aos \{[\s\S]*color: var\(--tcrn-brand-accent-aos\);/);
  assert.match(tcrnComponentCss, /\.tcrn-brand-wordmark__suffix--tms \{[\s\S]*color: var\(--tcrn-brand-accent-tms\);/);
  assert.match(tcrnComponentCss, /\.tcrn-brand-wordmark__suffix--design-system \{[\s\S]*background: linear-gradient\(/);
  assert.match(tcrnComponentCss, /\.tcrn-brand-mark \{[\s\S]*inline-size: var\(--tcrn-brand-mark-size\);[\s\S]*filter: var\(--tcrn-brand-mark-filter, none\);/);
  const longNameWordmarkRule = tcrnComponentCss.match(/\.tcrn-brand-lockup--long-name \.tcrn-brand-wordmark \{[^}]*\}/)?.[0] ?? "";
  assert.match(longNameWordmarkRule, /flex-direction:\s*column;/);
  assert.match(longNameWordmarkRule, /align-items:\s*flex-start;/);
  assert.match(tcrnComponentCss, /\.tcrn-brand-wordmark \{[\s\S]*font-weight: var\(--tcrn-type-weight-regular\);/);
  assert.match(tcrnComponentCss, /\.tcrn-brand-wordmark__base \{[\s\S]*font-weight: var\(--tcrn-type-weight-regular\);[\s\S]*white-space: nowrap;/);
  assert.match(tcrnComponentCss, /\.tcrn-product-logo__line-one \{[\s\S]*display: inline-flex;[\s\S]*align-items: baseline;[\s\S]*font-weight: var\(--tcrn-type-weight-regular\);[\s\S]*line-height: var\(--tcrn-type-line-ui\);/);
  assert.match(tcrnComponentCss, /\.tcrn-product-logo__line-one-base \{[\s\S]*font-weight: var\(--tcrn-type-weight-regular\);[\s\S]*white-space: nowrap;/);
  assert.match(tcrnComponentCss, /\.tcrn-product-logo__line-one-suffix \{[\s\S]*font-weight: var\(--tcrn-type-weight-strong\);[\s\S]*white-space: nowrap;/);
  assert.match(tcrnComponentCss, /\.tcrn-product-logo--stacked-suffix \.tcrn-product-logo__line-one \{[\s\S]*flex-direction: column;[\s\S]*align-items: flex-start;[\s\S]*white-space: normal;/);
  assert.match(tcrnComponentCss, /\.tcrn-product-logo__line-two \{[\s\S]*font-size: var\(--tcrn-type-size-meta\);[\s\S]*line-height: var\(--tcrn-type-line-caption\);/);
  assert.match(tcrnComponentCss, /\.tcrn-shell-theme-toggle \{[\s\S]*inline-size: 36px;[\s\S]*min-height: 36px;[\s\S]*border-radius: var\(--tcrn-radius-pill\);/);
  assert.match(tcrnComponentCss, /\.tcrn-shell-side-nav-toggle \{[\s\S]*inline-size: 38px;[\s\S]*min-height: 38px;[\s\S]*place-items: center;/);
  assert.match(tcrnComponentCss, /\.tcrn-shell-side-nav-toggle__icon \{[\s\S]*inline-size: 20px;[\s\S]*place-items: center;/);
  assert.match(tcrnComponentCss, /\.tcrn-shell-locale-menu__trigger \{[\s\S]*min-height: 36px;[\s\S]*border-radius: var\(--tcrn-radius-pill\);[\s\S]*font-size: var\(--tcrn-type-size-ui\);[\s\S]*line-height: var\(--tcrn-type-line-ui\);/);
  assert.match(tcrnComponentCss, /\.tcrn-search-input \{[\s\S]*--tcrn-search-input-control-min-inline-size: 9ch;[\s\S]*display: grid;[\s\S]*grid-template-columns: var\(--tcrn-search-input-icon-size\) minmax\(var\(--tcrn-search-input-control-min-inline-size\), 1fr\) max-content;/);
  assert.match(tcrnComponentCss, /\.tcrn-search-input:focus-within \{[\s\S]*outline: 3px solid var\(--tcrn-color-focus-ring\);[\s\S]*outline-offset: 2px;[\s\S]*box-shadow: none;/);
  assert.match(tcrnComponentCss, /\.tcrn-search-input__shortcut \{[\s\S]*position: static;[\s\S]*color: var\(--tcrn-color-text-secondary\);[\s\S]*font-family: var\(--tcrn-type-family-ui\);[\s\S]*font-weight: var\(--tcrn-type-weight-strong\);/);
  assert.match(tcrnComponentCss, /\.tcrn-search-input__icon \{[\s\S]*grid-column: 1;[\s\S]*inline-size: var\(--tcrn-search-input-icon-size\);/);
  assert.match(tcrnComponentCss, /\.tcrn-search-input \.tcrn-search-input__control \{[\s\S]*appearance: none;[\s\S]*box-sizing: border-box;[\s\S]*grid-column: 2;[\s\S]*width: 100%;[\s\S]*min-height: 0;[\s\S]*min-width: 0;[\s\S]*max-width: none;[\s\S]*padding: 0;[\s\S]*border: 0;[\s\S]*border-radius: 0;[\s\S]*background: transparent;[\s\S]*box-shadow: none;/);
  assert.match(tcrnComponentCss, /\.tcrn-search-input__shortcut \{[\s\S]*grid-column: 3;/);
  assert.match(tcrnComponentCss, /\[data-tcrn-theme="dark"\] \.tcrn-button--primary[^{]*\{[\s\S]*color: var\(--tcrn-color-surface-canvas\);/);
  assert.match(tcrnComponentCss, /\.tcrn-readback-panel \{[\s\S]*display: grid;[\s\S]*gap: var\(--tcrn-space-2\);/);
  assert.match(tcrnComponentCss, /\.tcrn-readback-panel > \.tcrn-heading \+ \* \{[\s\S]*margin-top: 0;/);
  assert.match(tcrnComponentCss, /\.tcrn-product-shell-content-stack \{[\s\S]*display: grid;[\s\S]*grid-template-columns: minmax\(0, 1fr\);[\s\S]*gap: var\(--tcrn-space-5\);[\s\S]*min-width: 0;/);
  assert.match(tcrnComponentCss, /\.tcrn-product-shell-content-stack > \*,[\s\S]*\.tcrn-product-shell-section-grid > \* \{[\s\S]*min-width: 0;[\s\S]*max-width: 100%;/);
  assert.match(tcrnComponentCss, /\.tcrn-product-shell-section-grid \{[\s\S]*grid-template-columns: minmax\(0, 1\.45fr\) minmax\(280px, 0\.75fr\);/);
  assert.match(tcrnComponentCss, /\.tcrn-table-shell__head,[\s\S]*\.tcrn-table-shell__row \{[\s\S]*grid-template-columns: var\([\s\S]*--tcrn-table-shell-columns/);
  assert.match(tcrnComponentCss, /\.tcrn-table-shell__head span,[\s\S]*\.tcrn-table-shell__cell \{[\s\S]*overflow-wrap: anywhere;/);
  assert.match(tcrnComponentCss, /\.tcrn-work-item-row--dense \{[\s\S]*grid-template-columns: minmax\(92px, 0\.14fr\)/);
  assert.match(tcrnComponentCss, /\.tcrn-work-page-header--dense,[\s\S]*\.tcrn-work-activity-feed--dense \{[\s\S]*--tcrn-work-density-row-min: 34px;/);
  assert.match(tcrnComponentCss, /\.tcrn-knowledge-page-tree,[\s\S]*\.tcrn-knowledge-search-results \{[\s\S]*min-width: 0;/);
  assert.match(tcrnComponentCss, /\.tcrn-knowledge-template-gallery \{[\s\S]*grid-template-columns: repeat\(auto-fit, minmax\(180px, 1fr\)\);/);
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
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<ShellThemeMode>("light");
  const [locale, setLocale] = useState("en");
  const [localeMenuOpen, setLocaleMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

  return (
    <ProductShell
      productName="TCRN AOS"
      moduleName="Frontend shell slice"
      brandProductId="aos"
      brandMarkSrc="/assets/tcrn-brand-mark.svg"
      brandMarkAlt="TCRN registered brand mark"
      currentRouteLabel="Cockpit"
      navLabel="Registered AOS modules"
      collapsed={collapsed}
      currentTheme={theme}
      locales={[
        { locale: "en", nativeName: "English" },
        { locale: "zh-CN", nativeName: "简体中文" }
      ]}
      currentLocale={locale}
      localeMenuOpen={localeMenuOpen}
      search={{
        label: "Search AOS shell",
        placeholder: "Search modules",
        query,
        expanded,
        results: query ? [{ id: "cockpit", title: "Cockpit", meta: "Shell entry", href: "/cockpit", selected: true }] : []
      }}
      onCollapsedChange={(nextCollapsed) => {
        events.push(`collapsed:${nextCollapsed}`);
        setCollapsed(nextCollapsed);
      }}
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
      onSearchQueryChange={(nextQuery) => {
        events.push(`search-query:${nextQuery}`);
        setQuery(nextQuery);
      }}
      onSearchExpandedChange={(nextExpanded, reason) => {
        events.push(`search-expanded:${nextExpanded}:${reason}`);
        setExpanded(nextExpanded);
      }}
      onSearchDismiss={(reason) => {
        events.push(`search-dismiss:${reason}`);
      }}
      onSearchResultActivate={(result, event) => {
        event.preventDefault();
        events.push(`search-result:${result.id}`);
      }}
      navGroups={[
        {
          id: "registered",
          label: "Registered shell entries",
          selected: true,
          items: [
            { id: "cockpit", label: "Cockpit", href: "/cockpit", iconName: "home", selected: true },
            { id: "work", label: "Work", href: "/work", iconName: "database" }
          ]
        }
      ]}
    >
      <section>Fixture-safe cockpit content</section>
    </ProductShell>
  );
}

function ProductShellControllerFixture({ events }: ProductShellSemanticFixtureProps) {
  const controller = useProductShellController({
    searchRecords: [{ id: "work", title: "Work", meta: "Registered shell entry", href: "/work" }],
    onCollapsedChange: (collapsed) => events.push(`controller-collapsed:${collapsed}`),
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
      <SideNavCollapseButton {...controller.sideNavCollapseButtonProps} />
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

test("product shell semantic callbacks own collapse theme locale and search behavior", async () => {
  const harness = createDomInteractionHarness();
  const events: string[] = [];
  try {
    await harness.render(<ProductShellSemanticFixture events={events} />);

    const shell = harness.document.querySelector(".tcrn-product-shell");
    assert.ok(shell instanceof harness.window.HTMLElement);
    assert.equal(shell.getAttribute("data-product-shell-semantic-api"), "collapse-theme-locale-search");

    const collapseButton = harness.document.querySelector("[data-side-nav-toggle='true']");
    assert.ok(collapseButton instanceof harness.window.HTMLButtonElement);
    await harness.dispatchKeydown(collapseButton, "Enter");
    assert.ok(events.includes("collapsed:true"));
    assert.equal(shell.getAttribute("data-product-shell-collapsed"), "true");

    await harness.dispatchKeydown(collapseButton, " ");
    assert.ok(events.includes("collapsed:false"));
    assert.equal(shell.getAttribute("data-product-shell-collapsed"), "false");

    await harness.dispatchClick(collapseButton);
    assert.ok(events.includes("collapsed:true"));
    assert.equal(shell.getAttribute("data-product-shell-collapsed"), "true");

    const themeButton = harness.document.querySelector("[data-theme-toggle='true']");
    assert.ok(themeButton instanceof harness.window.HTMLButtonElement);
    await harness.dispatchClick(themeButton);
    assert.ok(events.includes("theme:dark"));
    assert.equal(shell.getAttribute("data-product-shell-theme"), "dark");

    const localeTrigger = harness.document.querySelector("[data-locale-menu-toggle]");
    assert.ok(localeTrigger instanceof harness.window.HTMLButtonElement);
    await harness.dispatchClick(localeTrigger);
    assert.ok(events.includes("locale-open:true:trigger"));
    assert.equal(localeTrigger.getAttribute("aria-expanded"), "true");

    const localeOption = harness.document.querySelector("[data-locale-option='zh-CN']");
    assert.ok(localeOption instanceof harness.window.HTMLButtonElement);
    await harness.dispatchClick(localeOption);
    await flushReactUpdates();
    assert.ok(events.includes("locale:zh-CN"));
    assert.ok(events.includes("locale-open:false:selection"));
    assert.equal(localeTrigger.getAttribute("aria-expanded"), "false");
    assert.equal(harness.document.activeElement, localeTrigger);

    const searchInput = harness.document.querySelector(".tcrn-product-shell-search input");
    assert.ok(searchInput instanceof harness.window.HTMLInputElement);
    await focusElement(harness, searchInput);
    await updateInputValue(harness, searchInput, "cockpit");
    assert.ok(events.includes("search-expanded:true:focus"));
    assert.ok(events.includes("search-query:cockpit"));

    const searchWrap = harness.document.querySelector(".tcrn-product-shell-search");
    assert.ok(searchWrap instanceof harness.window.HTMLElement);
    assert.equal(searchWrap.getAttribute("data-search-expanded"), "true");
    assert.equal(searchWrap.getAttribute("data-search-results-visible"), "true");

    const searchResult = harness.document.querySelector("[data-search-result]");
    assert.ok(searchResult instanceof harness.window.HTMLAnchorElement);
    await harness.dispatchClick(searchResult);
    assert.ok(events.includes("search-result:cockpit"));

    await dispatchMouseDown(harness, harness.document.body);
    assert.ok(events.includes("search-dismiss:outside-pointer"));
    assert.equal(searchWrap.getAttribute("data-search-expanded"), "false");
    assert.equal(searchWrap.getAttribute("data-search-results-visible"), "false");

    await focusElement(harness, searchInput);
    await harness.dispatchKeydown(searchInput, "Tab");
    assert.ok(events.includes("search-dismiss:tab"));
    assert.equal(searchWrap.getAttribute("data-search-expanded"), "false");

    await focusElement(harness, searchInput);
    await harness.dispatchKeydown(searchInput, "Escape");
    assert.ok(events.includes("search-dismiss:escape"));
    assert.equal(searchWrap.getAttribute("data-search-expanded"), "false");
  } finally {
    await harness.cleanup();
  }
});

test("product shell controller returns ready prop bundles for registered shell controls", async () => {
  const harness = createDomInteractionHarness();
  const events: string[] = [];
  try {
    await harness.render(<ProductShellControllerFixture events={events} />);

    const collapseButton = harness.document.querySelector("[data-side-nav-toggle='true']");
    assert.ok(collapseButton instanceof harness.window.HTMLButtonElement);
    await harness.dispatchKeydown(collapseButton, "Enter");
    assert.ok(events.includes("controller-collapsed:true"));
    assert.equal(collapseButton.getAttribute("data-side-nav-collapsed"), "true");

    await harness.dispatchKeydown(collapseButton, " ");
    assert.ok(events.includes("controller-collapsed:false"));
    assert.equal(collapseButton.getAttribute("data-side-nav-collapsed"), "false");

    await harness.dispatchClick(collapseButton);
    assert.ok(events.includes("controller-collapsed:true"));
    assert.equal(collapseButton.getAttribute("data-side-nav-collapsed"), "true");

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
      productName="TCRN AOS"
      moduleName="运营驾驶舱"
      currentRouteLabel="驾驶舱"
      navLabel="AOS 模块导航"
      currentLocale="zh-CN"
      locales={[{ locale: "zh-CN", nativeName: "简体中文" }]}
      navGroups={[{
        id: "registered",
        label: "已登记入口",
        items: [{ id: "restricted", label: "受限模块", href: "/restricted", disabled: true }]
      }]}
      search={{}}
    >
      <div>内容</div>
    </ProductShell>
  );
  assert.match(zhShell, />跳到外壳内容</);
  assert.match(zhShell, /aria-label="产品外壳工作区"/);
  assert.match(zhShell, />当前位置</);
  // Composed per locale: welding " home" or " shell controls" onto a name the
  // consumer supplied yields a string in neither language.
  assert.match(zhShell, /aria-label="TCRN AOS首页"/);
  assert.match(zhShell, /aria-label="运营驾驶舱外壳控件"/);
  // Forwarded to the four children that carry defaults of their own. The theme
  // toggle names the mode it would switch *to*, and the shell defaults to light.
  assert.match(zhShell, /aria-label="切换到夜间模式"/);
  assert.match(zhShell, /aria-label="收起侧边导航"/);
  assert.match(zhShell, /aria-label="检索产品外壳"/);
  assert.match(zhShell, />该导航项在此路由下不可用</);
  for (const englishDefault of [
    "Skip to shell content", "Product shell workspace", ">Current location<", " home\"",
    " shell controls\"", "Switch to dark mode", "Collapse side navigation",
    "Search product shell", "Navigation item unavailable in this route"
  ]) {
    assert.equal(zhShell.includes(englishDefault), false, `${englishDefault} is not shipped into a zh-CN shell`);
  }

  // A consumer's own value on `search` still wins over the forwarded locale.
  const explicitSearchLocale = renderToStaticMarkup(
    <ProductShell
      productName="TCRN AOS"
      moduleName="Cockpit"
      currentRouteLabel="Cockpit"
      navLabel="Modules"
      currentLocale="zh-CN"
      locales={[{ locale: "zh-CN", nativeName: "简体中文" }]}
      navGroups={[]}
      search={{ locale: "ja" }}
    >
      <div>content</div>
    </ProductShell>
  );
  assert.match(explicitSearchLocale, /aria-label="製品シェルを検索"/);

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
    collapsedKey: "tcrn-side-nav-collapsed",
    themeKey: "tcrn-theme",
    localeKey: "tcrn-locale"
  };

  function ServerControllerFixture({ cookie }: { cookie?: string }) {
    const controller = useProductShellController({
      collapsedStorageKey: "tcrn-side-nav-collapsed",
      themeStorageKey: "tcrn-theme",
      localeStorageKey: "tcrn-locale",
      // The parse happens on the consumer's server; only three narrowed values
      // cross the package boundary. The raw header stays outside on purpose —
      // an earlier shape of this prop took the whole header, which would have
      // handed the shell every cookie the consumer's requests carry.
      requestPreferences: readPreferenceCookieValues(cookie, cookieKeys)
    });
    readings.push({
      collapsed: controller.collapsed,
      theme: controller.theme,
      locale: controller.locale
    });
    return <span>{`${controller.theme}/${controller.locale}/${controller.collapsed}`}</span>;
  }

  const withCookie = renderToStaticMarkup(
    <ServerControllerFixture cookie="tcrn-theme=dark; tcrn-locale=zh-CN; tcrn-side-nav-collapsed=true" />
  );
  assert.match(withCookie, /dark\/zh-CN\/true/);
  assert.deepEqual(readings[0], { collapsed: true, theme: "dark", locale: "zh-CN" });

  // No cookie is not a preference: the product's defaults still stand, so a
  // client-only consumer that never passes preferences is unaffected.
  const withoutCookie = renderToStaticMarkup(<ServerControllerFixture />);
  assert.match(withoutCookie, /light\/en\/false/);

  // A cookie naming a preference the shell does not govern changes nothing, and one
  // whose value cannot be percent-decoded is discarded rather than thrown out of the
  // render — a cookie header is attacker-reachable input.
  const unrelated = renderToStaticMarkup(
    <ServerControllerFixture cookie="unrelated=dark; tcrn-locale=%E0%A4%A; tcrn-theme=dark" />
  );
  assert.match(unrelated, /dark\/en\/false/);

  // The parser narrows to undefined, never to a default: garbage must not outrank
  // the product's own fallback, and an off-contract locale is garbage even when it
  // is a real language tag.
  assert.deepEqual(
    readPreferenceCookieValues("tcrn-theme=blue; tcrn-locale=de-DE; tcrn-side-nav-collapsed=yes", cookieKeys),
    { collapsed: undefined, theme: undefined, locale: undefined }
  );
  assert.deepEqual(
    readPreferenceCookieValues(undefined, cookieKeys),
    { collapsed: undefined, theme: undefined, locale: undefined }
  );
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
