// SPDX-License-Identifier: Apache-2.0
// TCRN-DS-INIT-012 — the partition is checked, in both directions.
//
// A split stylesheet is the one artifact where a mistake is invisible: nothing
// throws, nothing fails to compile, a rule simply stops applying and the page
// looks slightly wrong to someone who was not looking. So the properties are
// asserted rather than trusted.

import assert from "node:assert/strict";
import test from "node:test";

import { tcrnComponentCss } from "./Navigation.js";
import {
  DOMAIN_EXTRA_CLASSES,
  isDomainSelector,
  partitionComponentCss,
  tcrnCoreComponentCss,
  tcrnDomainComponentCss,
  topLevelBlocks,
} from "./component-css-partition.js";

const withoutComments = (text: string): string => text.replace(/\/\*[\s\S]*?\*\//gu, "");

function selectorsOf(css: string): string[] {
  return topLevelBlocks(css)
    .flatMap((block) =>
      withoutComments(block.slice(0, block.indexOf("{")))
        .split(",")
        .map((entry) => entry.trim())
    )
    .filter((entry) => entry.length > 0)
    .sort();
}

test("every selector in the sheet lands in exactly one half", () => {
  // The property that matters: a selector that fell out of both halves is styling
  // that silently disappears, and one that landed in both is a rule applied twice.
  assert.deepEqual(
    [...selectorsOf(tcrnCoreComponentCss), ...selectorsOf(tcrnDomainComponentCss)].sort(),
    selectorsOf(tcrnComponentCss)
  );
});

test("the core half carries no domain selector", () => {
  const leaked = selectorsOf(tcrnCoreComponentCss).filter((entry) => isDomainSelector(entry));

  assert.deepEqual(leaked, [], "domain selectors remained in the core sheet");
});

test("the domain half carries only domain selectors", () => {
  const strays = selectorsOf(tcrnDomainComponentCss).filter((entry) => !isDomainSelector(entry));

  assert.deepEqual(strays, [], "generic selectors were carried into the domain sheet");
});

test("neither half is empty, and the domain half is the smaller one", () => {
  // A partition that put everything on one side would satisfy every check above.
  assert.ok(tcrnCoreComponentCss.length > 0);
  assert.ok(tcrnDomainComponentCss.length > 0);
  assert.ok(tcrnDomainComponentCss.length < tcrnCoreComponentCss.length);
});

test("blocks spanning both sides are split, with the body duplicated verbatim", () => {
  const source = [
    ".tcrn-work-list,",
    ".tcrn-module-tabs {",
    "  color: red;",
    "}",
  ].join("\n");
  const result = partitionComponentCss(source);

  assert.equal(result.splitBlockCount, 1);
  assert.match(result.core, /\.tcrn-module-tabs/u);
  assert.doesNotMatch(result.core, /\.tcrn-work-list/u);
  assert.match(result.domain, /\.tcrn-work-list/u);
  assert.doesNotMatch(result.domain, /\.tcrn-module-tabs/u);
  // Identical bodies are what makes concatenating the halves safe: two copies that
  // could disagree would reintroduce a cascade question the split exists to avoid.
  assert.match(result.core, /color: red;/u);
  assert.match(result.domain, /color: red;/u);
});

test("the real sheet splits exactly the blocks that span both sides", () => {
  // Five, measured. A number that moves is either new entanglement or a
  // classification that changed, and both deserve to be looked at on purpose.
  //
  // It read twelve when the classifier knew only the four component prefixes, and
  // six when `metadata-rail` and `saved-view-toolbar` were recognised as domain but
  // `[data-work-list]` still was not. Each correction made the number smaller
  // because it moved a block from "split" to "wholly domain" — which is the right
  // direction: a block that does not need splitting is one less duplicated body.
  assert.equal(partitionComponentCss(tcrnComponentCss).splitBlockCount, 5);
});

test("an attribute selector naming a product entity is domain", () => {
  // The defect the gate caught: `[data-work-list]` sorted into core while its twin
  // `.tcrn-work-list` went to domain, leaving a Work Management element styled by
  // the generic sheet.
  assert.equal(isDomainSelector("[data-work-list]"), true);
  assert.equal(isDomainSelector("[data-density]"), false);
});

test("structurally-named domain furniture is classified as domain", () => {
  // MetadataRail and SavedViewToolbar are Work Management components whose class
  // names happen to read structurally. Reading names alone would leave their
  // styling in core while their components left.
  for (const name of DOMAIN_EXTRA_CLASSES) {
    assert.equal(isDomainSelector(`.${name}`), true, `${name} classified as generic`);
  }
});

test("genuinely generic navs are NOT classified as domain", () => {
  // The converse, and the more likely mistake: these share rule bodies with domain
  // classes, so a coarser rule would sweep them out of core and strip the styling
  // from components that are staying.
  for (const name of [
    "tcrn-module-tabs",
    "tcrn-section-tabs",
    "tcrn-segmented-nav",
    "tcrn-product-launcher",
    "tcrn-product-switcher",
    "tcrn-template-gallery",
  ]) {
    assert.equal(isDomainSelector(`.${name}`), false, `${name} classified as domain`);
  }
});

test("the combined sheet is untouched", () => {
  // The migration's safety property: today's consumers read `tcrnComponentCss` and
  // must see exactly what they saw before the split existed.
  assert.ok(tcrnComponentCss.includes(".tcrn-work-list"));
  assert.ok(tcrnComponentCss.includes(".tcrn-module-tabs"));
});
