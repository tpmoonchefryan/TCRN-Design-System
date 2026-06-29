import test from "node:test";
import assert from "node:assert/strict";
import { act, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  ModuleTabs,
  SegmentedNav,
  Breadcrumb,
  ProductShell,
  ProductShellSearch,
  ShellLocaleMenu,
  ShellThemeToggle,
  SideNavCollapseButton,
  SkipLink,
  SideNav,
  NavGroup,
  NavItem,
  tcrnComponentCss,
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
  assert.match(html, /data-product-shell-semantic-api="collapse-theme-locale-search"/);
  assert.match(html, /data-registered-brand-lockup="@tcrn\/ui-react\/ShellBrandLockup"/);
  assert.match(html, /data-visible-registered-brand-lockup="true"/);
  assert.match(html, /src="\/assets\/tcrn-brand-mark\.svg"/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /data-side-nav-persisted-key="tcrn-aos-side-nav-collapsed"/);
  assert.match(html, /data-side-nav-semantic-api="onCollapsedChange"/);
  assert.match(html, /data-registered-navigation-only="true"/);
  assert.match(html, /data-product-shell-route="cockpit"/);
  assert.match(html, /data-product-shell-route="work"/);
  assert.match(html, /data-shell-control="product-shell-search"/);
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
  assert.match(html, /Fixture-safe cockpit content/);
});

test("product shell component css keeps motion shorthands valid", () => {
  assert.match(tcrnComponentCss, /--tcrn-motion-product-shell: var\(--tcrn-motion-emphasis\)/);
  assert.match(tcrnComponentCss, /transition: grid-template-columns var\(--tcrn-motion-product-shell\);/);
  assert.match(tcrnComponentCss, /animation: tcrn-product-shell-theme-wash var\(--tcrn-motion-product-shell\) both;/);
  assert.match(tcrnComponentCss, /transition: width var\(--tcrn-motion-product-shell\);/);
  assert.doesNotMatch(tcrnComponentCss, /var\(--tcrn-motion-emphasis\) ease/);
});

test("product shell component css keeps package controls contrast-safe", () => {
  assert.match(tcrnComponentCss, /--tcrn-color-brand-secondary-readable: #246f80/);
  assert.match(tcrnComponentCss, /--tcrn-color-brand-secondary-readable: #a6e8ef/);
  assert.match(tcrnComponentCss, /\.tcrn-brand-wordmark__suffix \{[\s\S]*color: var\(--tcrn-color-brand-secondary-readable\);/);
  assert.match(tcrnComponentCss, /\.tcrn-search-input__shortcut \{[\s\S]*color: var\(--tcrn-color-text-secondary\);/);
  assert.match(tcrnComponentCss, /\.tcrn-search-input__icon \{[\s\S]*grid-column: 1;/);
  assert.match(tcrnComponentCss, /\.tcrn-search-input__control \{[\s\S]*appearance: none;[\s\S]*box-sizing: border-box;[\s\S]*grid-column: 2;[\s\S]*width: 100%;[\s\S]*min-width: 0;[\s\S]*padding: 0;/);
  assert.match(tcrnComponentCss, /\.tcrn-search-input__shortcut \{[\s\S]*grid-column: 3;/);
  assert.match(tcrnComponentCss, /\[data-tcrn-theme="dark"\] \.tcrn-button--primary \{[\s\S]*color: var\(--tcrn-color-surface-canvas\);/);
  assert.match(tcrnComponentCss, /\.tcrn-readback-panel \{[\s\S]*display: grid;[\s\S]*gap: var\(--tcrn-space-2\);/);
  assert.match(tcrnComponentCss, /\.tcrn-readback-panel > \.tcrn-heading \+ \* \{[\s\S]*margin-top: 0;/);
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
      productName="AOS Rebuild Workspace"
      moduleName="Frontend shell slice"
      brandSuffix="AOS"
      brandCaption="Rebuild workspace"
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
