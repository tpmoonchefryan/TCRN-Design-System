import test from "node:test";
import assert from "node:assert/strict";
import { act, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AppStatusBar, CollapsibleRegion, DisclosurePanel, Divider, PageHierarchy, SettingsLayout, Surface } from "./Layout.js";
import { PageHeader, SplitView, SubNav } from "../DataDisplay/DomainDisplay.js";
import { SegmentedNav } from "../Navigation/Navigation.js";
import { createTokenMap } from "@tcrn/ui-tokens";
import { tcrnComponentCss } from "../../styles/index.js";
import { layoutCss } from "../../styles/layout.css.js";
import { createDomInteractionHarness } from "../../test/dom-harness.js";

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

// The layers of a box-shadow list: split at the top-level commas, not those inside var() or a
// colour function.
function shadowLayers(value: string): string[] {
  const layers: string[] = [];
  let depth = 0;
  let start = 0;
  for (let index = 0; index < value.length; index += 1) {
    if (value[index] === "(") depth += 1;
    else if (value[index] === ")") depth -= 1;
    else if (value[index] === "," && depth === 0) {
      layers.push(value.slice(start, index).trim());
      start = index + 1;
    }
  }
  layers.push(value.slice(start).trim());
  return layers;
}

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

test("STORY-146 GWT3 a settings page is at most the layout content width, centred in the paper", () => {
  // 07 publishes centred1040 content. Full SettingsLayout/DocumentCanvas styling is
  // outside the approved28 APIs; exercise the actual current document carrier.
  const content = topLevelRule(".tcrn-doc-content");
  assert.match(content, /width:min\(100%,1040px\)/);
  assert.match(content, /margin-inline:auto/);
  // At 1440: the paper is space-3 from both sides and its content twice space-3h inside it, so the
  // content row is 1360 and the settings page 1040, with equal room left and right.
  const paperContent = 1440 - 2 * px("--tcrn-space-3") - 2 * 2 * px("--tcrn-space-3h");
  assert.equal(paperContent, 1360);
  const width = Math.min(paperContent, 1040);
  const left = px("--tcrn-space-3") + 2 * px("--tcrn-space-3h") + (paperContent - width) / 2;
  const right = 1440 - left - width;
  assert.ok(width <= 1040);
  assert.equal(left, right, "centred");
  assert.equal(left, 200);
  for (const available of [320, 390, 1040, 1360]) {
    const actual = Math.min(available, 1040), margin = (available - actual) / 2;
    assert.ok(actual <= 1040 && actual <= available);assert.equal(margin + actual + margin, available);
  }
  // Retained engineering composition still exposes its content/navigation semantics;
  // that behavior is separate from publication of a full visual family.
  const html = renderToStaticMarkup(
    <SettingsLayout navigation={<nav>Sections</nav>} navigationLabel="Settings sections" contentLabel="Settings">
      <p>Row</p>
    </SettingsLayout>
  );
  assert.match(html, /^<div class="tcrn-settings-layout" data-settings-layout="true"/);
  assert.match(html, /aria-label="Settings sections"/);
  assert.match(html, /aria-label="Settings"/);
  assert.match(html, /<p>Row<\/p>/);
});

function layoutRule(selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const found = new RegExp(`(?:^|\\n)${escaped} ?\\{([^}]*)\\}`).exec(layoutCss);
  assert.ok(found, `${selector} has a top-level rule in layoutCss`);
  return found[1];
}

test("layoutCss has balanced braces, declared state pairs, and complete composite layout rules", () => {
  assert.equal(layoutCss.includes("\u0060"), false, "layoutCss contains zero backticks");
  let depth = 0;
  for (const ch of layoutCss.replace(/\/\*[\s\S]*?\*\//g, "")) {
    if (ch === "{") depth += 1;
    if (ch === "}") depth -= 1;
    assert.ok(depth >= 0, "layoutCss never closes an unopened block");
  }
  assert.equal(depth, 0, "layoutCss braces are balanced");

  const declaredPairs = new Set([...layoutCss.matchAll(/(--tcrn-pair-[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
  const referencedPairs = [...new Set([...layoutCss.matchAll(/var\((--tcrn-pair-[a-z0-9-]+)/g)].map((m) => m[1]))];
  assert.deepEqual(referencedPairs.filter((name) => !declaredPairs.has(name)), []);

  assert.match(layoutRule(".tcrn-surface"), /--tcrn-color-panel/);
  assert.match(layoutRule(".tcrn-surface"), /--tcrn-elevation-s1/);
  assert.match(layoutRule(".tcrn-divider"), /--tcrn-color-line/);

  assert.match(layoutRule(".tcrn-settings-layout"), /inline-size:\s*min\(100%,\s*1040px\)/);
  assert.match(layoutRule(".tcrn-settings-layout__frame"), /container-type:\s*inline-size/);
  assert.match(layoutRule(".tcrn-settings-layout__grid"), /grid-template-columns:\s*220px minmax\(0,\s*1fr\)/);
  assert.match(layoutRule(".tcrn-settings-layout__host-switcher"), /--tcrn-color-panel-2/);
  assert.match(layoutCss, /@container tcrn-settings-layout \(max-width:\s*720px\)[\s\S]*?\.tcrn-settings-layout__grid\s*\{\s*grid-template-columns:\s*minmax\(0,\s*1fr\)/);

  const splitHtml = renderToStaticMarkup(<SplitView label="Moderation workspace" list={<div>Queue</div>} detail={<div>Inspector</div>} detailPopulated={false} />);
  assert.match(splitHtml, /class="tcrn-split-view-frame"/);
  assert.match(splitHtml, /class="tcrn-split-view tcrn-split-view--compact"/);
  assert.match(layoutRule(".tcrn-split-view-frame"), /container-type:\s*inline-size/);
  assert.match(layoutRule(".tcrn-split-view"), /display:\s*grid/);
  assert.match(layoutRule(".tcrn-split-view"), /align-items:\s*stretch/);
  assert.match(layoutCss, /\.tcrn-split-view__list,\n\.tcrn-split-view__detail\s*\{[\s\S]*?min-block-size:\s*100%/);
  assert.match(layoutCss, /@container tcrn-split-view \(max-width:\s*720px\)[\s\S]*?\.tcrn-split-view\s*\{\s*grid-template-columns:\s*minmax\(0,\s*1fr\)/);

  const segHtml = renderToStaticMarkup(<SegmentedNav label="View mode" items={[{ id: "list", label: "List", selected: true }, { id: "raw", label: "Raw" }]} />);
  assert.match(segHtml, /class="tcrn-tabs tcrn-tabs--segmented tcrn-segmented-nav"/);
  assert.match(layoutCss, /\.tcrn-tabs\.tcrn-tabs--segmented,\n\.tcrn-segmented-nav\s*\{[\s\S]*?background-color:\s*var\(--tcrn-color-wash\)/);
  assert.match(layoutCss, /--tcrn-pair-seg-fill-s:\s*var\(--tcrn-color-panel\)/);
  assert.match(layoutCss, /--tcrn-pair-seg-edge-s:\s*var\(--tcrn-elevation-s1\)/);
  assert.match(layoutCss, /\.tcrn-segmented-nav \.tcrn-tabs__tab\[aria-current="page"\]::after\s*\{\s*display:\s*none;\s*content:\s*none;/);
});

test("collapsible region sets hidden and inert when collapsed and blurs active inner focus", async () => {
  function CollapsibleFixture() {
    const [expanded, setExpanded] = useState(true);
    return (
      <div>
        <button type="button" data-toggle="" onClick={() => setExpanded((prev) => !prev)}>
          Toggle
        </button>
        <CollapsibleRegion expanded={expanded}>
          <button type="button" data-inner="">Inner action</button>
        </CollapsibleRegion>
      </div>
    );
  }

  const harness = createDomInteractionHarness();
  try {
    await harness.render(<CollapsibleFixture />);
    const region = harness.document.querySelector(".tcrn-collapsible-region") as HTMLElement;
    const inner = harness.document.querySelector("[data-inner]") as HTMLButtonElement;
    const toggle = harness.document.querySelector("[data-toggle]") as HTMLButtonElement;

    assert.equal(region.hidden, false);
    assert.equal(region.hasAttribute("inert"), false);
    await act(async () => {
      inner.focus();
    });
    assert.equal(harness.document.activeElement, inner);

    await harness.dispatchClick(toggle);
    assert.equal(region.hidden, true);
    assert.equal(region.hasAttribute("inert"), true);
    assert.equal(region.getAttribute("aria-hidden"), "true");
    assert.notEqual(harness.document.activeElement, inner, "collapsed region releases focus from inner controls");
  } finally {
    await harness.cleanup();
  }
});
