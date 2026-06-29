import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import {
  ModuleTabs,
  SegmentedNav,
  Breadcrumb,
  ProductShell,
  ProductShellSearch,
  SkipLink,
  SideNav,
  NavGroup,
  NavItem
} from "./Navigation.js";

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

test("side navigation primitives render package-backed hierarchy and disabled reasons", () => {
  const html = renderToStaticMarkup(
    <>
      <SkipLink href="#content">Skip to content</SkipLink>
      <SideNav label="Component navigation">
        <NavGroup label="Components" selected>
          <NavItem href="#navigation" iconName="panel-left-open" selected>Navigation</NavItem>
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

test("product shell renders package-backed side-nav shell and effect boundary", () => {
  const html = renderToStaticMarkup(
    <ProductShell
      productName="AOS Rebuild Workspace"
      moduleName="Frontend shell slice"
      brandSuffix="AOS"
      brandCaption="Rebuild workspace"
      brandMarkSrc="/assets/tcrn-brand-mark.svg"
      brandMarkAlt="TCRN registered brand mark"
      currentRouteLabel="Cockpit"
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
          { id: "cockpit", title: "Cockpit", meta: "Local proof shell", href: "/cockpit", selected: true }
        ]
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

  assert.match(html, /data-package-backed-product-shell-boundary="side-nav-shell-v1"/);
  assert.match(html, /data-product-shell-pattern="attached-side-nav"/);
  assert.match(html, /data-product-shell-collapsed="true"/);
  assert.match(html, /data-product-shell-theme="dark"/);
  assert.match(html, /data-product-shell-responsive="desktop-attached-mobile-stacked"/);
  assert.match(html, /data-product-shell-effect-boundary="ds-owned-tokens-motion-focus"/);
  assert.match(html, /data-product-shell-consumer-scope="ia-data-route-labels-content-callbacks"/);
  assert.match(html, /data-registered-brand-lockup="@tcrn\/ui-react\/ShellBrandLockup"/);
  assert.match(html, /data-visible-registered-brand-lockup="true"/);
  assert.match(html, /src="\/assets\/tcrn-brand-mark\.svg"/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /data-side-nav-persisted-key="tcrn-aos-side-nav-collapsed"/);
  assert.match(html, /data-registered-navigation-only="true"/);
  assert.match(html, /data-product-shell-route="cockpit"/);
  assert.match(html, /data-product-shell-route="work"/);
  assert.match(html, /data-shell-control="product-shell-search"/);
  assert.match(html, /data-search-dismissal-contract="blur-outside-pointer-tab-escape"/);
  assert.match(html, /data-search-expanded="true"/);
  assert.match(html, /role="listbox"/);
  assert.match(html, /aria-selected="true"/);
  assert.match(html, /data-locale-menu-open="true"/);
  assert.match(html, /data-locale-dismissal-contract="selection-outside-pointer-escape-focus-return"/);
  assert.match(html, /data-package-backed-shell-control="theme-toggle"/);
  assert.match(html, /Fixture-safe cockpit content/);
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
