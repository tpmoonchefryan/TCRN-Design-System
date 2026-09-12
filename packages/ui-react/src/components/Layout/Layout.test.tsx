import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { AppStatusBar, CollapsibleRegion, DisclosurePanel, Divider, PageHierarchy, SettingsLayout, Surface } from "./Layout.js";
import { PageHeader, SubNav } from "../DataDisplay/DomainDisplay.js";

test("layout primitives include surfaces and dividers", () => {
  const html = renderToStaticMarkup(
    <>
      <Surface>Panel</Surface>
      <Divider />
    </>
  );

  assert.match(html, /class="tcrn-surface"/);
  assert.match(html, /class="tcrn-divider"/);
});

test("collapsible region records hidden and focus boundaries when collapsed", () => {
  const html = renderToStaticMarkup(
    <CollapsibleRegion expanded={false}>
      <button type="button">Hidden action</button>
    </CollapsibleRegion>
  );

  assert.match(html, /class="tcrn-collapsible-region"/);
  assert.match(html, /data-collapsible-region="true"/);
  assert.match(html, /data-expanded="false"/);
  assert.match(html, /aria-hidden="true"/);
  assert.match(html, /inert=""/);
  assert.match(html, /data-focus-when-collapsed="inert"/);
  assert.match(html, /data-reduced-motion="snap"/);
});

test("collapsible region keeps expanded content exposed", () => {
  const html = renderToStaticMarkup(
    <CollapsibleRegion expanded>
      <button type="button">Visible action</button>
    </CollapsibleRegion>
  );

  assert.match(html, /data-expanded="true"/);
  assert.match(html, /aria-hidden="false"/);
  assert.doesNotMatch(html, /inert=""/);
  assert.match(html, /Visible action/);
});

test("disclosure panel is a controlled region and not an accordion claim", () => {
  const html = renderToStaticMarkup(
    <DisclosurePanel expanded title="Route details">
      Static proof details
    </DisclosurePanel>
  );

  assert.match(html, /data-disclosure-panel="true"/);
  assert.match(html, /data-disclosure-scope="controlled-region"/);
  assert.match(html, /data-expanded="true"/);
  assert.match(html, /Route details/);
  assert.match(html, /Static proof details/);
  assert.doesNotMatch(html, /data-accordion/);
});

test("app status bar exposes command, state, and optional action slots", () => {
  const html = renderToStaticMarkup(
    <AppStatusBar command="local" state="Ready" action={<button type="button">Details</button>} />
  );

  assert.match(html, /data-app-status-bar="true"/);
  assert.match(html, /role="status"/);
  assert.match(html, /class="tcrn-app-status-bar__command">local<\/span>/);
  assert.match(html, /class="tcrn-app-status-bar__state">Ready<\/span>/);
  assert.match(html, /class="tcrn-app-status-bar__action"><button/);
});

test("settings layout declares container-driven navigation and complete-form boundaries", () => {
  const html = renderToStaticMarkup(
    <SettingsLayout
      navigation={<a href="#appearance">Appearance</a>}
      navigationLabel="Settings navigation"
      contentLabel="Settings content"
      hostSwitcher={<select aria-label="Host"><option>Local</option></select>}
    >
      <div data-setting-row="true">Complete configuration</div>
    </SettingsLayout>
  );

  assert.match(html, /data-settings-layout="true"/);
  assert.match(html, /data-settings-layout-mode="container-driven"/);
  assert.match(html, /data-settings-layout-form-policy="single-host-single-column"/);
  assert.match(html, /data-settings-layout-breakpoint="960px"/);
  assert.match(html, /data-settings-content-breakpoint="720px"/);
  assert.match(html, /data-settings-local-navigation="compact"/);
  assert.match(html, /data-settings-overflow-policy="no-page-overflow"/);
  assert.match(html, /aria-label="Settings navigation"/);
  assert.match(html, /data-settings-complete-form="true"/);
  assert.match(html, /class="tcrn-settings-layout__host-switcher"/);
});

test("page hierarchy keeps two-level content below the page header and parent tabs", () => {
  const html = renderToStaticMarkup(
    <PageHierarchy
      depth="two"
      header={<PageHeader title="Settings" />}
      sectionTabs={<SubNav label="Settings pages" items={[{ id: "general", label: "General", current: true }]} />}
      content={<div data-page-content="true">Page content</div>}
      contentLabel="Page content"
    />
  );

  assert.match(html, /data-page-hierarchy="true"/);
  assert.match(html, /data-page-hierarchy-depth="two"/);
  assert.match(html, /data-page-hierarchy-source="explicit-depth-prop"/);
  assert.match(html, /data-page-hierarchy-shell-boundary="global-product-shell-external"/);
  assert.match(html, /data-page-hierarchy-valid="true"/);
  assert.doesNotMatch(html, /data-page-hierarchy-slot="local-navigation"/);
  assert.ok(html.indexOf('data-page-hierarchy-slot="header"') < html.indexOf('data-page-hierarchy-slot="section-tabs"'));
  assert.ok(html.indexOf('data-page-hierarchy-slot="section-tabs"') < html.indexOf('data-page-hierarchy-slot="content"'));
  assert.match(html, /class="[^"]*tcrn-page-header/);
  assert.match(html, /class="tcrn-sub-nav"/);
});

test("page hierarchy reserves the internal local navigation slot for explicit third-level pages", () => {
  const html = renderToStaticMarkup(
    <PageHierarchy
      depth="three"
      header={<PageHeader title="Settings detail" />}
      sectionTabs={<SubNav label="Settings pages" items={[{ id: "general", label: "General", current: true }]} />}
      localNavigation={<nav aria-label="Detail sections">Details</nav>}
      localNavigationLabel="Detail sections"
      content={<div data-page-content="true">Detail content</div>}
      contentLabel="Detail content"
    />
  );

  assert.match(html, /data-page-hierarchy-depth="three"/);
  assert.match(html, /data-page-hierarchy-valid="true"/);
  assert.match(html, /data-page-hierarchy-region="third-level"/);
  assert.match(html, /data-page-hierarchy-slot="local-navigation"/);
  assert.match(html, /data-page-hierarchy-slot="content"/);
});
