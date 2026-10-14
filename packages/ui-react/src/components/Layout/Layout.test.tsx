import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { AppStatusBar, CollapsibleRegion, DisclosurePanel, Divider, PageHierarchy, SettingsLayout, Surface } from "./Layout.js";
import { PageHeader, SubNav } from "../DataDisplay/DomainDisplay.js";
import { createTokenMap } from "@tcrn/ui-tokens";
import { tcrnComponentCss } from "../../styles/index.js";

// The body of the top-level rule whose selector is exactly `selector` (a rule nested in an at-rule
// is indented and not read).
function topLevelRule(selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const found = new RegExp(`(?:^|\\n)${escaped} ?\\{([^}]*)\\}`).exec(tcrnComponentCss);
  assert.ok(found, `${selector} has a top-level rule`);
  return found[1];
}

const tokens = createTokenMap();
const px = (variable: string) => {
  const value = Number.parseFloat(tokens[variable] ?? "");
  assert.ok(Number.isFinite(value), `${variable} is a length`);
  return value;
};

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

test("collapsible region's inner leaves a control's 1px stroke room at the block end and the collapsed region 0 high (TCRN-DS-SUB-216)", () => {
  const inner = topLevelRule(".tcrn-collapsible-region__inner");
  // The inner still clips, but its clip edge sits outside its box by a token at least as wide as the
  // outward stroke a control draws (box-shadow 0 0 0 1px), so the stroke at the block end is not cut.
  assert.match(inner, /\n {2}overflow: clip;/);
  assert.doesNotMatch(inner, /overflow: hidden/);
  const margin = /\n {2}overflow-clip-margin: var\((--tcrn-[a-z0-9-]+)\);/.exec(inner);
  assert.ok(margin, "the inner's clip margin is a token");
  assert.ok(px(margin[1]) >= 1, `${margin[1]} leaves room for a 1px stroke`);
  // The room takes no height: no padding or border on the inner, so in the 0fr row the collapsed
  // region stays 0 high and the 0fr to 1fr transition is the same.
  assert.match(inner, /\n {2}min-height: 0;/);
  assert.doesNotMatch(inner, /padding|border/);
  assert.match(topLevelRule(".tcrn-collapsible-region"), /\n {2}grid-template-rows: 0fr;/);
  assert.match(topLevelRule('.tcrn-collapsible-region[data-expanded="true"]'), /\n {2}grid-template-rows: 1fr;/);
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

test("STORY-146 GWT3 a settings page is at most the layout content width, centred in the paper", () => {
  const settings = topLevelRule(".tcrn-settings-layout");
  assert.match(settings, /inline-size:100%/);
  assert.match(settings, /max-inline-size:var\(--tcrn-layout-content-max-w\)/);
  assert.match(settings, /margin-inline:auto/);
  assert.equal(tokens["--tcrn-layout-content-max-w"], "1040px");
  // At 1440: the paper is space-3 from both sides and its content twice space-3h inside it, so the
  // content row is 1360 and the settings page 1040, with equal room left and right.
  const paperContent = 1440 - 2 * px("--tcrn-space-3") - 2 * 2 * px("--tcrn-space-3h");
  assert.equal(paperContent, 1360);
  const width = Math.min(paperContent, px("--tcrn-layout-content-max-w"));
  const left = px("--tcrn-space-3") + 2 * px("--tcrn-space-3h") + (paperContent - width) / 2;
  const right = 1440 - left - width;
  assert.ok(width <= 1040);
  assert.equal(left, right, "centred");
  assert.equal(left, 200);
  // A document page is held to the same width, its border and inset included.
  const canvas = topLevelRule(".tcrn-document-canvas");
  assert.match(canvas, /box-sizing: border-box;/);
  assert.match(canvas, /max-inline-size: var\(--tcrn-layout-content-max-w\);/);
  assert.match(canvas, /margin-inline: auto;/);
  const html = renderToStaticMarkup(
    <SettingsLayout navigation={<nav>Sections</nav>} navigationLabel="Settings sections" contentLabel="Settings">
      <p>Row</p>
    </SettingsLayout>
  );
  assert.match(html, /^<div class="tcrn-settings-layout" data-settings-layout="true"/);
});

test("Surface and Divider take their spacing from the space tokens; only the 1px rule is a literal", () => {
  const spacing = /^(?:padding|margin|gap|row-gap|column-gap)(?:-[a-z-]+)?$/;
  for (const selector of [".tcrn-divider", ".tcrn-surface__head", ".tcrn-surface__head-actions"]) {
    for (const declaration of topLevelRule(selector).split(";").map((part) => part.trim()).filter(Boolean)) {
      const [property, value] = declaration.split(/:(.*)/s).map((part) => part.trim());
      if (!spacing.test(property ?? "")) continue;
      assert.match(value ?? "", /^(?:0|var\(--tcrn-space-[0-9a-z]+\))(?: (?:0|var\(--tcrn-space-[0-9a-z]+\)))*$/, `${selector} ${property} comes from the space tokens`);
    }
  }
  assert.match(topLevelRule(".tcrn-divider"), /border-top: 1px solid var\(--tcrn-color-border-subtle\);/);
  // The surface card rule is shared with the other panels: its inset and gap are tokens too.
  assert.match(tcrnComponentCss, /\.tcrn-action-drawer \{[^}]*padding: var\(--tcrn-space-3\);/);
  assert.match(tcrnComponentCss, /\.tcrn-action-drawer \{[^}]*gap: var\(--tcrn-space-2h\);/);
});
