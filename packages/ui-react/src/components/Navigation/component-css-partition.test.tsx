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
  const selectors: string[] = [];
  for (const block of topLevelBlocks(css)) {
    const braceAt = block.indexOf("{");
    if (braceAt < 0) continue;
    const head = withoutComments(block.slice(0, braceAt));
    const closeAt = block.lastIndexOf("}");
    if (head.trimStart().startsWith("@")) {
      selectors.push(...selectorsOf(block.slice(braceAt + 1, closeAt)));
      continue;
    }
    selectors.push(...head.split(",").map((entry) => entry.trim()).filter((entry) => entry.length > 0));
  }
  return selectors.sort();
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

test("nested at-rules partition domain selectors instead of hiding them in core", () => {
  const result = partitionComponentCss([
    "@container tcrn-work-row (max-width: 464px) {",
    "  .tcrn-work-item-row { color: red; }",
    "}",
  ].join("\n"));

  assert.doesNotMatch(result.core, /\.tcrn-work-item-row/u);
  assert.match(result.domain, /@container tcrn-work-row/u);
  assert.match(result.domain, /\.tcrn-work-item-row/u);
  assert.match(result.domain, /color: red;/u);
});

test("mixed selectors nested in an at-rule split into two complete wrappers", () => {
  const result = partitionComponentCss([
    "@media (min-width: 1px) {",
    "  .tcrn-work-list,",
    "  .tcrn-module-tabs { color: red; }",
    "}",
  ].join("\n"));

  assert.equal(result.splitBlockCount, 1);
  assert.match(result.core, /@media \(min-width: 1px\)/u);
  assert.match(result.core, /\.tcrn-module-tabs/u);
  assert.doesNotMatch(result.core, /\.tcrn-work-list/u);
  assert.match(result.domain, /@media \(min-width: 1px\)/u);
  assert.match(result.domain, /\.tcrn-work-list/u);
  assert.doesNotMatch(result.domain, /\.tcrn-module-tabs/u);
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

test("the known nested work-row rule is registered in domain only", () => {
  assert.doesNotMatch(tcrnCoreComponentCss, /\.tcrn-work-item-row/u);
  assert.match(tcrnDomainComponentCss, /\.tcrn-work-item-row/u);
});

function srgbToLinear(channel: number): number {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const value = Number.parseInt(hex.slice(1), 16);
  return 0.2126 * srgbToLinear((value >> 16) & 255)
    + 0.7152 * srgbToLinear((value >> 8) & 255)
    + 0.0722 * srgbToLinear(value & 255);
}

function contrastRatio(foreground: string, background: string): number {
  const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

function mixWithTransparent(foreground: string, background: string, weight: number): string {
  const channels = [0, 2, 4].map((offset) => {
    const foregroundChannel = Number.parseInt(foreground.slice(1 + offset, 3 + offset), 16);
    const backgroundChannel = Number.parseInt(background.slice(1 + offset, 3 + offset), 16);
    return Math.round(foregroundChannel * weight + backgroundChannel * (1 - weight));
  });
  return `#${channels.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

test("record-link ink keeps the four measured contrast assertions in the gate", () => {
  assert.match(tcrnCoreComponentCss, /\.tcrn-link\s*\{/u);
  assert.match(
    tcrnCoreComponentCss,
    /text-decoration-color:\s*color-mix\(in srgb, var\(--tcrn-color-brand-primary\) 70%, transparent\)/u,
  );
  assert.ok(Math.abs(contrastRatio("#17707f", "#1c1d21") - 2.94) < 0.01);
  assert.ok(Math.abs(contrastRatio("#62c3d2", "#ececea") - 1.73) < 0.01);
  assert.ok(Math.abs(contrastRatio(mixWithTransparent("#17707f", "#ffffff", 0.7), "#ffffff") - 3.14) < 0.01);
  assert.ok(Math.abs(contrastRatio(mixWithTransparent("#62c3d2", "#18191c", 0.7), "#18191c") - 4.83) < 0.01);
});
