import test from "node:test";
import assert from "node:assert/strict";
import { inspectDsConsumption } from "../scripts/ds-consumption-proof.mjs";

test("STORY-108 positive consumer fixture requires semantic and structure markers", () => {
  const result = inspectDsConsumption({
    kind: "setting-choice",
    markup: '<div class="tcrn-setting-choice" data-setting-choice="true" data-setting-choice-semantic="value-selection" data-setting-choice-control="select" data-setting-choice-option-count="3"><label>Mode<select><option>Local</option><option>Remote</option><option>Deferred</option></select></label></div>'
  });
  assert.equal(result.ok, true);
  assert.deepEqual(result.findings, []);
});

test("STORY-108 negative consumer fixture rejects class and CSS lookalikes", () => {
  const result = inspectDsConsumption({
    kind: "setting-choice",
    markup: '<div class="tcrn-setting-choice tcrn-segmented-nav" data-setting-choice="true" data-setting-choice-semantic="navigation" data-setting-choice-control="radio" data-setting-choice-option-count="2" data-setting-choice-fit="true"><nav class="tcrn-segmented-nav"><button>Local</button><button>Remote</button></nav></div>'
  });
  assert.equal(result.ok, false);
  assert.match(result.findings.join("; "), /value-selection|navigation component/);
});

test("STORY-108 negative consumer fixture rejects a Stepper and a clipped numeric value", () => {
  const stepper = inspectDsConsumption({
    kind: "number-input",
    markup: '<nav class="tcrn-stepper" data-stepper="true"><ol><li>1</li></ol></nav>'
  });
  const clipped = inspectDsConsumption({
    kind: "number-input",
    markup: '<input class="tcrn-number-input" data-number-input="true" data-number-input-semantic="numeric-entry" data-number-input-visibility="clipped" type="number" value="8192" />'
  });
  assert.equal(stepper.ok, false);
  assert.equal(clipped.ok, false);
  assert.match(stepper.findings.join("; "), /numeric entry|Stepper/);
  assert.match(clipped.findings.join("; "), /visible|clipping/);
});

test("STORY-108 consumer-owned applicability rejects visible not-applicable entries", () => {
  const result = inspectDsConsumption({
    kind: "consumer-feature",
    markup: '<button data-consumer-feature-applicable="false" data-consumer-feature-visible="true">Retired feature</button>'
  });
  assert.equal(result.ok, false);
  assert.match(result.findings.join("; "), /not applicable/);
});

test("STORY-109 rejects marker-only geometry, visibility, and cardinality claims", () => {
  const number = inspectDsConsumption({
    kind: "number-input",
    markup: '<input data-number-input="true" data-number-input-semantic="numeric-entry" data-number-input-visibility="full-value" type="number" value="4096" min="512" max="8192" style="width:1px;min-inline-size:0px;max-width:1px" />'
  });
  const feature = inspectDsConsumption({
    kind: "consumer-feature",
    markup: '<button data-consumer-feature-applicable="false" data-consumer-feature-visible="false">Retired feature</button>'
  });
  const radios = inspectDsConsumption({
    kind: "setting-choice",
    markup: '<div data-setting-choice="true" data-setting-choice-semantic="value-selection" data-setting-choice-control="radio" data-setting-choice-option-count="2" data-setting-choice-fit="true"><fieldset><legend>Mode</legend><input type="radio" /><input type="radio" /><input type="radio" /></fieldset></div>'
  });

  assert.equal(number.ok, false);
  assert.match(number.findings.join("; "), /width|geometry/);
  assert.equal(feature.ok, false);
  assert.match(feature.findings.join("; "), /actual entry|visibility/);
  assert.equal(radios.ok, false);
  assert.match(radios.findings.join("; "), /actual DOM count|binary/);
});

test("STORY-111 unmeasured binary labels conservatively choose Select", () => {
  const result = inspectDsConsumption({
    kind: "setting-choice",
    markup: '<div data-setting-choice="true" data-setting-choice-semantic="value-selection" data-setting-choice-control="select" data-setting-choice-option-count="2"><label>Mode<select><option value="a">AAAAAAAAAA</option><option value="b">BBBBBBBBBB</option></select></label></div>'
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.findings, []);
});

const validTwoLevelMarkup = '<div data-page-hierarchy="true" data-page-hierarchy-depth="two" data-page-hierarchy-source="explicit-depth-prop" data-page-hierarchy-width-policy="container-only" data-page-hierarchy-shell-boundary="global-product-shell-external"><div data-page-hierarchy-region="header" data-page-hierarchy-slot="header"><header class="tcrn-page-header"><h2>Settings</h2></header></div><div data-page-hierarchy-region="section-tabs" data-page-hierarchy-slot="section-tabs"><nav class="tcrn-sub-nav">General</nav></div><div data-page-hierarchy-region="lower-content" data-page-hierarchy-slot="content">Content</div></div>';

const validTwoLevelEvidence = {
  schemaVersion: "tcrn.ds.rendered-consumption-evidence.v1",
  kind: "page-hierarchy",
  dom: {
    pageHierarchyCount: 1,
    pageHeaderCount: 1,
    sectionTabsCount: 1,
    thirdLevelRegionCount: 0,
    localNavigationSlotCount: 0,
    hierarchyContentSlotCount: 1,
    pageHierarchySlotOrder: ["header", "section-tabs", "content"],
    pageHierarchyDepths: ["two"]
  },
  geometry: {
    pageWidthPx: 300,
    pageScrollWidthPx: 300,
    pageOverflow: false,
    pageHierarchy: {
      visible: true,
      headerVisible: true,
      sectionTabsVisible: true,
      thirdLevelVisible: false,
      localNavigationVisible: false,
      contentVisible: true,
      pageHierarchyRect: { left: 0, top: 0, right: 300, bottom: 150, width: 300, height: 150 },
      headerRect: { left: 0, top: 0, right: 300, bottom: 40, width: 300, height: 40 },
      sectionTabsRect: { left: 0, top: 50, right: 300, bottom: 90, width: 300, height: 40 },
      contentRect: { left: 0, top: 100, right: 300, bottom: 140, width: 300, height: 40 },
      thirdLevelRect: null,
      localNavigationRect: null
    }
  }
};

test("STORY-109/112 reject missing, non-finite, invalid, and reversed page geometry evidence", () => {
  const missing = structuredClone(validTwoLevelEvidence);
  delete missing.geometry.pageHierarchy.headerRect;
  assert.equal(inspectDsConsumption({ kind: "page-hierarchy", markup: validTwoLevelMarkup, renderedEvidence: missing, expectedPageDepth: "two" }).ok, false);

  const nonFinite = structuredClone(validTwoLevelEvidence);
  nonFinite.geometry.pageHierarchy.headerRect.top = Number.NaN;
  assert.equal(inspectDsConsumption({ kind: "page-hierarchy", markup: validTwoLevelMarkup, renderedEvidence: nonFinite, expectedPageDepth: "two" }).ok, false);

  const invalidRect = structuredClone(validTwoLevelEvidence);
  invalidRect.geometry.pageHierarchy.sectionTabsRect.right = 20;
  assert.equal(inspectDsConsumption({ kind: "page-hierarchy", markup: validTwoLevelMarkup, renderedEvidence: invalidRect, expectedPageDepth: "two" }).ok, false);

  const reversed = structuredClone(validTwoLevelEvidence);
  reversed.geometry.pageHierarchy.headerRect = { left: 0, top: 100, right: 300, bottom: 140, width: 300, height: 40 };
  reversed.geometry.pageHierarchy.sectionTabsRect = { left: 0, top: 50, right: 300, bottom: 90, width: 300, height: 40 };
  reversed.geometry.pageHierarchy.contentRect = { left: 0, top: 0, right: 300, bottom: 40, width: 300, height: 40 };
  const reversedResult = inspectDsConsumption({ kind: "page-hierarchy", markup: validTwoLevelMarkup, renderedEvidence: reversed, expectedPageDepth: "two" });
  assert.equal(reversedResult.ok, false);
  assert.match(reversedResult.findings.join("; "), /not above|not below/);
});
