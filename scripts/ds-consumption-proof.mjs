#!/usr/bin/env node
// TCRN-DS-STORY-109/110/111/112 — consumer checks for the 106/107/112 rules.
//
// This proof renders neutral fixtures in a real browser and inspects semantic,
// structural, DOM-cardinality, visibility, geometry, and layout facts, not only
// class names or a stylesheet digest. Its negative fixtures keep the detector
// honest: marker-only false greens, dropped disabled options, unmeasured binary
// labels, clipped numbers, over-capacity settings, and invalid page hierarchies
// must all be rejected.

import { createHash } from "node:crypto";
import { chromium } from "@playwright/test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  Input,
  NumberInput,
  SettingChoice,
  SettingsHostSwitcher,
  SettingsLayout,
  SettingRow,
  PageHierarchy,
  PageHeader,
  SectionTabs,
  SubNav,
  tcrnComponentCss
} from "../packages/ui-react/dist/index.js";
import { tcrnTokenCss } from "../packages/ui-tokens/dist/index.js";

export const DS_CONSUMPTION_PROOF_VERSION = "tcrn.ds-consumption-proof.v2";
export const DS_CONSUMPTION_CONTRACT_VERSION = "ds_consumption_contract_v2";

export const dsConsumptionRules = Object.freeze([
  {
    id: "DS-106-R1",
    name: "value-selection-semantics",
    rule: "More than two setting values use Select; a binary value uses a native radio group only when every label and control fits measured inline space; navigation components never carry setting values."
  },
  {
    id: "DS-106-R2",
    name: "numeric-entry-semantics",
    rule: "Numeric values use NumberInput/native number entry with full-value visibility, range constraints, keyboard entry, paste, disabled, and error states; Stepper is not numeric entry."
  },
  {
    id: "DS-107-R1",
    name: "container-driven-settings-layout",
    rule: "SettingsLayout uses the actual frame and content container: 960px admits compact local navigation beside one content column, and 720px stacks setting rows."
  },
  {
    id: "DS-107-R2",
    name: "single-host-complete-form",
    rule: "A host switch precedes one complete host configuration form; narrow content does not preserve parallel host columns or hide fields with overflow clipping."
  },
  {
    id: "DS-108-R1",
    name: "semantic-and-structure-proof",
    rule: "Consumer proof checks component identity, semantic markers, actual DOM cardinality, native element structure, computed visibility, rendered geometry, and layout policy; class or CSS equality alone is insufficient."
  },
  {
    id: "DS-108-R2",
    name: "consumer-owned-feature-applicability",
    rule: "A consumer may declare a feature not applicable; the check rejects an entry that remains visible while the consumer declaration says it is not applicable."
  },
  {
    id: "DS-112-R1",
    name: "explicit-page-depth-structure",
    rule: "PageHierarchy takes explicit two- or three-level depth: two-level pages place content below parent tabs, while three-level pages place local navigation and content inside the selected subpage; ProductShell is external."
  },
  {
    id: "DS-112-R2",
    name: "page-depth-rendered-evidence",
    rule: "Page hierarchy checks actual DOM order, region existence, rendered geometry, overlap, and page overflow; depth cannot be inferred from width, option count, or self-reported markers."
  }
]);

function attr(markup, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return markup.match(new RegExp(`${escaped}="([^"]*)"`, "u"))?.[1] ?? null;
}

function has(markup, fragment) {
  return markup.includes(fragment);
}

function elementTags(markup, tagName) {
  return markup.match(new RegExp(`<${tagName}\\b[^>]*>`, "giu")) ?? [];
}

function tagAttributes(tagMarkup) {
  const attributes = {};
  for (const match of tagMarkup.matchAll(/\s([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/gu)) {
    attributes[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? "";
  }
  return attributes;
}

function tagAttribute(tagMarkup, name) {
  return tagAttributes(tagMarkup)[name.toLowerCase()] ?? null;
}

function styleNumber(tagMarkup, property) {
  const style = tagAttribute(tagMarkup, "style") ?? "";
  const match = style.match(new RegExp(`(?:^|;)\\s*${property.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")}\\s*:\\s*(-?\\d+(?:\\.\\d+)?)px`, "iu"));
  return match ? Number(match[1]) : undefined;
}

function isHiddenElementTag(tagMarkup) {
  const attrs = tagAttributes(tagMarkup);
  if (Object.prototype.hasOwnProperty.call(attrs, "hidden") || attrs["aria-hidden"] === "true") return true;
  const style = attrs.style ?? "";
  return /(?:^|;)\s*(?:display\s*:\s*none|visibility\s*:\s*hidden|opacity\s*:\s*0(?:[;\s]|$))/iu.test(style);
}

function interactiveEntryTags(markup) {
  return [
    ...["button", "a", "input", "select", "textarea"].flatMap((tagName) => elementTags(markup, tagName)),
    ...(markup.match(/<[^>]+\brole\s*=\s*(?:"(?:button|menuitem)"|'(?:button|menuitem)')\b[^>]*>/giu) ?? [])
  ];
}

function optionValues(markup) {
  return elementTags(markup, "option").map((option) => ({
    value: tagAttribute(option, "value"),
    disabled: Object.prototype.hasOwnProperty.call(tagAttributes(option), "disabled")
  }));
}

function radioValues(markup) {
  return elementTags(markup, "input")
    .filter((input) => tagAttribute(input, "type")?.toLowerCase() === "radio")
    .map((input) => ({
      value: tagAttribute(input, "value"),
      disabled: Object.prototype.hasOwnProperty.call(tagAttributes(input), "disabled")
    }));
}

function expectedDisabledValuesMatch(actualValues, expectedValues, findings, branch) {
  for (const expectedValue of expectedValues) {
    const actual = actualValues.find((option) => option.value === expectedValue);
    if (!actual?.disabled) finding(findings, `${branch} dropped disabled option ${expectedValue}`);
  }
}

async function measureRenderedMarkup(browser, kind, markup) {
  const page = await browser.newPage({ viewport: { width: 720, height: 520 } });
  try {
    await page.setContent(`<!doctype html><meta charset="utf-8"><style>${tcrnTokenCss}${tcrnComponentCss}*{box-sizing:border-box}body{margin:0;padding:16px;font:13px sans-serif}#fixture{inline-size:100%;max-inline-size:100%;min-inline-size:0}</style><main id="fixture">${markup}</main>`);
    await page.evaluate(async () => {
      if (document.fonts?.ready) await document.fonts.ready;
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });
    return await page.evaluate((fixtureKind) => {
      const fixture = document.querySelector("#fixture");
      const visible = (node) => {
        if (!(node instanceof Element)) return false;
        const style = getComputedStyle(node);
        const rect = node.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) !== 0 && !node.hasAttribute("hidden") && node.getAttribute("aria-hidden") !== "true";
      };
      const rect = (node) => {
        const box = node?.getBoundingClientRect();
        return box ? { widthPx: box.width, heightPx: box.height } : { widthPx: 0, heightPx: 0 };
      };
      const setting = fixture?.querySelector("[data-setting-choice='true']");
      const radioGroup = setting?.querySelector("fieldset");
      const numericInput = fixture?.querySelector("input[data-number-input='true']");
      const layout = fixture?.querySelector("[data-settings-layout='true']");
      const pageHierarchy = fixture?.querySelector("[data-page-hierarchy='true']");
      const pageHierarchyHeader = pageHierarchy?.querySelector("[data-page-hierarchy-region='header']");
      const pageHierarchyTabs = pageHierarchy?.querySelector("[data-page-hierarchy-region='section-tabs']");
      const pageHierarchyLocalNavigation = pageHierarchy?.querySelector("[data-page-hierarchy-slot='local-navigation']");
      const pageHierarchyContent = pageHierarchy?.querySelector("[data-page-hierarchy-slot='content']");
      const selectNodes = Array.from(fixture?.querySelectorAll("select") ?? []);
      const radioNodes = Array.from(fixture?.querySelectorAll("input[type='radio']") ?? []);
      const numericNodes = Array.from(fixture?.querySelectorAll("input[type='number']") ?? []);
      const entryNodes = Array.from(fixture?.querySelectorAll("button,a,input,select,textarea,[role='button'],[role='menuitem']") ?? []);
      const visibleEntries = entryNodes.filter(visible);
      const hiddenOverflowNodes = Array.from(layout?.querySelectorAll("*") ?? []).filter((node) => {
        const style = getComputedStyle(node);
        return style.overflowX === "hidden" || style.overflowY === "hidden";
      });
      const numberStyle = numericInput ? getComputedStyle(numericInput) : null;
      const numberBox = numericInput?.getBoundingClientRect();
      const radioBox = radioGroup?.getBoundingClientRect();
      const pageWidth = Math.max(document.documentElement.clientWidth, document.body.clientWidth);
      const pageScrollWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
      const regionRect = (node) => {
        const box = node?.getBoundingClientRect();
        return box ? { left: box.left, top: box.top, right: box.right, bottom: box.bottom, width: box.width, height: box.height } : null;
      };
      const boxesOverlap = (first, second) => Boolean(first && second && first.left < second.right - 1 && first.right > second.left + 1 && first.top < second.bottom - 1 && first.bottom > second.top + 1);
      const hierarchyHeaderRect = regionRect(pageHierarchyHeader);
      const hierarchyTabsRect = regionRect(pageHierarchyTabs);
      const hierarchyLocalNavigationRect = regionRect(pageHierarchyLocalNavigation);
      const hierarchyContentRect = regionRect(pageHierarchyContent);
      return {
        schemaVersion: "tcrn.ds.rendered-consumption-evidence.v1",
        kind: fixtureKind,
        dom: {
          settingChoiceCount: fixture?.querySelectorAll("[data-setting-choice='true']").length ?? 0,
          radioCount: radioNodes.length,
          selectCount: selectNodes.length,
          optionCount: selectNodes.reduce((total, select) => total + select.options.length, 0),
          numericCount: numericNodes.length,
          pageHierarchyCount: fixture?.querySelectorAll("[data-page-hierarchy='true']").length ?? 0,
          pageHeaderCount: pageHierarchy?.querySelectorAll(".tcrn-page-header").length ?? 0,
          sectionTabsCount: pageHierarchy?.querySelectorAll("[data-page-hierarchy-region='section-tabs'] .tcrn-sub-nav,[data-page-hierarchy-region='section-tabs'] .tcrn-section-tabs").length ?? 0,
          localNavigationSlotCount: pageHierarchy?.querySelectorAll("[data-page-hierarchy-slot='local-navigation']").length ?? 0,
          hierarchyContentSlotCount: pageHierarchy?.querySelectorAll("[data-page-hierarchy-slot='content']").length ?? 0,
          featureEntryCount: entryNodes.length,
          featureVisibleEntryCount: visibleEntries.length,
          disabledOptionValues: selectNodes.flatMap((select) => Array.from(select.options).filter((option) => option.disabled).map((option) => option.value)),
          disabledRadioValues: radioNodes.filter((radio) => radio.disabled).map((radio) => radio.value)
        },
        geometry: {
          pageWidthPx: pageWidth,
          pageScrollWidthPx: pageScrollWidth,
          pageOverflow: pageScrollWidth > pageWidth + 1,
          settingVisible: visible(setting),
          layoutVisible: visible(layout),
          hiddenOverflowCount: hiddenOverflowNodes.length,
          pageHierarchy: pageHierarchy ? {
            visible: visible(pageHierarchy),
            headerRect: hierarchyHeaderRect,
            sectionTabsRect: hierarchyTabsRect,
            localNavigationRect: hierarchyLocalNavigationRect,
            contentRect: hierarchyContentRect,
            headerTabsOverlap: boxesOverlap(hierarchyHeaderRect, hierarchyTabsRect),
            tabsContentOverlap: boxesOverlap(hierarchyTabsRect, hierarchyContentRect),
            localContentOverlap: boxesOverlap(hierarchyLocalNavigationRect, hierarchyContentRect)
          } : null,
          number: numericInput ? {
            ...rect(numericInput),
            visible: visible(numericInput),
            widthPx: numberBox?.width ?? 0,
            minInlineSizePx: Number.parseFloat(numberStyle?.minInlineSize ?? "0") || 0,
            overflowX: numberStyle?.overflowX ?? "",
            overflowY: numberStyle?.overflowY ?? "",
            textOverflow: numberStyle?.textOverflow ?? "",
            value: numericInput instanceof HTMLInputElement ? numericInput.value : "",
            scrollWidth: numericInput instanceof HTMLElement ? numericInput.scrollWidth : 0,
            clientWidth: numericInput instanceof HTMLElement ? numericInput.clientWidth : 0
          } : null,
          radioGroup: radioGroup ? {
            ...rect(radioGroup),
            visible: visible(radioGroup),
            widthPx: radioBox?.width ?? 0,
            scrollWidth: radioGroup instanceof HTMLElement ? radioGroup.scrollWidth : 0,
            clientWidth: radioGroup instanceof HTMLElement ? radioGroup.clientWidth : 0,
            optionWidths: Array.from(radioGroup.querySelectorAll(".tcrn-radio-group__option")).map((option) => option.getBoundingClientRect().width),
            optionScrollWidths: Array.from(radioGroup.querySelectorAll(".tcrn-radio-group__option")).map((option) => option instanceof HTMLElement ? option.scrollWidth : 0)
          } : null
        }
      };
    }, kind);
  } finally {
    await page.close();
  }
}

function finding(findings, message) {
  findings.push(message);
}

export function inspectDsConsumption({ kind, markup, renderedEvidence, expectedDisabledOptionValues = [], expectedPageDepth }) {
  const findings = [];
  if (typeof markup !== "string" || markup.trim().length === 0) {
    return { ok: false, findings: ["rendered markup is empty"] };
  }

  if (kind === "setting-choice") {
    if (attr(markup, "data-setting-choice") !== "true") finding(findings, "missing SettingChoice identity marker");
    if (attr(markup, "data-setting-choice-semantic") !== "value-selection") finding(findings, "setting choice is not marked as value-selection");
    const control = attr(markup, "data-setting-choice-control");
    const optionCount = Number(attr(markup, "data-setting-choice-option-count"));
    const actualRadioValues = radioValues(markup);
    const actualOptionValues = optionValues(markup);
    const actualOptionCount = control === "radio" ? actualRadioValues.length : actualOptionValues.length;
    if (!Number.isInteger(optionCount) || optionCount < 0) finding(findings, "option count is not machine-readable");
    if (Number.isInteger(optionCount) && optionCount !== actualOptionCount) finding(findings, `declared option count ${optionCount} differs from actual DOM count ${actualOptionCount}`);
    if (optionCount > 2 && control !== "select") finding(findings, "more than two setting options did not select Select");
    if (control === "radio") {
      if (optionCount !== 2) finding(findings, "radio value choice is not exactly binary");
      if (attr(markup, "data-setting-choice-fit") !== "true") finding(findings, "radio value choice has no positive fit proof");
      if (actualRadioValues.length !== 2 || !has(markup, "<fieldset") || !has(markup, "<legend")) {
        finding(findings, "binary value choice is missing native fieldset, legend, or radio structure");
      }
      expectedDisabledValuesMatch(actualRadioValues, expectedDisabledOptionValues, findings, "RadioGroup");
      if (!renderedEvidence) {
        finding(findings, "binary value choice rendered geometry evidence is missing");
      } else {
        const radioEvidence = renderedEvidence.geometry?.radioGroup;
        if (renderedEvidence.dom?.radioCount !== actualRadioValues.length) finding(findings, "actual radio DOM count is not carried by rendered evidence");
        if (radioEvidence?.visible !== true) finding(findings, "binary value choice is not visibly rendered");
        if (Number(radioEvidence?.scrollWidth) > Number(radioEvidence?.clientWidth) + 1) finding(findings, "binary value choice overflows its rendered group");
        if ((radioEvidence?.optionScrollWidths ?? []).some((width, index) => Number(width) > Number(radioEvidence?.optionWidths?.[index] ?? 0) + 1)) {
          finding(findings, "binary value option content overflows its rendered option");
        }
      }
    } else if (control === "select") {
      if (elementTags(markup, "select").length !== 1) finding(findings, "Select control is missing or duplicated in a select decision");
      expectedDisabledValuesMatch(actualOptionValues, expectedDisabledOptionValues, findings, "Select");
    } else {
      finding(findings, "unknown setting choice control");
    }
    if (has(markup, "tcrn-segmented-nav") || has(markup, "data-tab-semantics=\"segmented-navigation\"")) {
      finding(findings, "navigation component was used for a setting value");
    }
  } else if (kind === "number-input") {
    if (attr(markup, "data-number-input") !== "true") finding(findings, "missing NumberInput identity marker");
    if (attr(markup, "data-number-input-semantic") !== "numeric-entry") finding(findings, "numeric entry semantic marker is missing");
    if (attr(markup, "data-number-input-visibility") !== "full-value") finding(findings, "numeric value is not declared fully visible");
    const numberInputs = elementTags(markup, "input").filter((input) => tagAttribute(input, "type")?.toLowerCase() === "number");
    if (numberInputs.length !== 1) finding(findings, "numeric entry does not contain exactly one native number input");
    const numberInput = numberInputs[0];
    const numberAttributes = numberInput ? tagAttributes(numberInput) : {};
    if (!Object.prototype.hasOwnProperty.call(numberAttributes, "value") || numberAttributes.value.length === 0) finding(findings, "numeric fixture has no complete value attribute");
    if (!Object.prototype.hasOwnProperty.call(numberAttributes, "min") || !Object.prototype.hasOwnProperty.call(numberAttributes, "max")) finding(findings, "numeric fixture is missing native range constraints");
    if (has(markup, "tcrn-stepper") || has(markup, "tcrn-segmented-nav")) finding(findings, "workflow/navigation primitive was used as numeric entry");
    if (/text-overflow\s*:\s*ellipsis/iu.test(markup) || attr(markup, "data-number-input-visibility") === "clipped") finding(findings, "numeric entry declares clipping");
    const declaredWidth = numberInput ? styleNumber(numberInput, "width") : undefined;
    const declaredMaxWidth = numberInput ? styleNumber(numberInput, "max-width") : undefined;
    const declaredMinInlineSize = numberInput ? styleNumber(numberInput, "min-inline-size") : undefined;
    if ((declaredWidth !== undefined && declaredWidth <= 1) || (declaredMaxWidth !== undefined && declaredMaxWidth <= 1) || (declaredMinInlineSize !== undefined && declaredMinInlineSize <= 0)) {
      finding(findings, "numeric entry declares a rendered width too small for its value");
    }
    if (!renderedEvidence) {
      finding(findings, "numeric entry rendered geometry evidence is missing");
    } else {
      const numberEvidence = renderedEvidence.geometry?.number;
      if (renderedEvidence.dom?.numericCount !== numberInputs.length) finding(findings, "actual numeric DOM count is not carried by rendered evidence");
      if (numberEvidence?.visible !== true) finding(findings, "numeric entry is not visibly rendered");
      if (!Number.isFinite(Number(numberEvidence?.widthPx)) || Number(numberEvidence?.widthPx) <= 1) finding(findings, "numeric entry rendered width is too small for its value");
      if (!Number.isFinite(Number(numberEvidence?.minInlineSizePx)) || Number(numberEvidence?.minInlineSizePx) <= 0) finding(findings, "numeric entry has no positive rendered minimum inline size");
      if ([numberEvidence?.overflowX, numberEvidence?.overflowY].includes("hidden") || numberEvidence?.textOverflow === "ellipsis") finding(findings, "numeric entry rendered geometry clips its value");
      if (numberInput && numberEvidence?.value !== numberAttributes.value) finding(findings, "rendered numeric value differs from the declared value");
    }
  } else if (kind === "settings-layout") {
    for (const [name, expected] of [
      ["data-settings-layout", "true"],
      ["data-settings-layout-mode", "container-driven"],
      ["data-settings-layout-form-policy", "single-host-single-column"],
      ["data-settings-layout-breakpoint", "960px"],
      ["data-settings-content-breakpoint", "720px"],
      ["data-settings-local-navigation", "compact"],
      ["data-settings-overflow-policy", "no-page-overflow"],
      ["data-settings-long-value-policy", "native-inline-scroll-copy"],
      ["data-settings-complete-form", "true"]
    ]) {
      if (attr(markup, name) !== expected) finding(findings, `${name}=${expected} is missing`);
    }
    if (!has(markup, "data-settings-local-nav=\"true\"")) finding(findings, "compact local navigation region is missing");
    if (!has(markup, "tcrn-settings-layout__frame") || !has(markup, "tcrn-settings-layout__grid") || !has(markup, "tcrn-settings-layout__content") || !has(markup, "tcrn-settings-layout__form")) finding(findings, "settings layout DOM structure is incomplete");
    if (/overflow\s*:\s*hidden/iu.test(markup) || has(markup, "data-settings-overflow-policy=\"clipped\"")) finding(findings, "settings layout hides content through overflow clipping");
    if (has(markup, "data-settings-layout-form-policy=\"two-host-columns\"")) finding(findings, "settings layout preserves parallel host columns");
    if (!renderedEvidence) {
      finding(findings, "settings layout rendered overflow evidence is missing");
    } else {
      if (Number(renderedEvidence.dom?.settingChoiceCount) < 1) finding(findings, "settings layout rendered DOM has no host/value choice");
      if (renderedEvidence.geometry?.layoutVisible !== true) finding(findings, "settings layout is not visibly rendered");
      if (renderedEvidence.geometry?.pageOverflow === true) finding(findings, "settings layout creates page-level horizontal overflow");
      if (Number(renderedEvidence.geometry?.hiddenOverflowCount) > 0) finding(findings, "settings layout contains hidden overflow in its rendered content");
    }
  } else if (kind === "page-hierarchy") {
    const depth = attr(markup, "data-page-hierarchy-depth");
    const expectedDepth = expectedPageDepth;
    if (attr(markup, "data-page-hierarchy") !== "true") finding(findings, "missing PageHierarchy identity marker");
    if (!(depth === "two" || depth === "three")) finding(findings, "page hierarchy depth is not explicit");
    if (expectedDepth && depth !== expectedDepth) finding(findings, `page hierarchy depth ${depth} differs from expected ${expectedDepth}`);
    if (attr(markup, "data-page-hierarchy-source") !== "explicit-depth-prop") finding(findings, "page hierarchy does not declare an explicit depth source");
    if (attr(markup, "data-page-hierarchy-width-policy") !== "container-only") finding(findings, "page hierarchy width policy is not container-only");
    if (attr(markup, "data-page-hierarchy-shell-boundary") !== "global-product-shell-external") finding(findings, "global ProductShell boundary is not explicit");
    if (!has(markup, "tcrn-page-header")) finding(findings, "page hierarchy is missing the page Header component");
    if (!has(markup, "tcrn-sub-nav") && !has(markup, "tcrn-section-tabs")) finding(findings, "page hierarchy is missing parent-level tabs");
    const headerIndex = markup.indexOf('data-page-hierarchy-region="header"');
    const sectionTabsIndex = markup.indexOf('data-page-hierarchy-region="section-tabs"');
    const lowerContentIndex = markup.indexOf('data-page-hierarchy-region="lower-content"');
    const thirdLevelIndex = markup.indexOf('data-page-hierarchy-region="third-level"');
    const localNavigationIndex = markup.indexOf('data-page-hierarchy-slot="local-navigation"');
    const contentIndex = markup.indexOf('data-page-hierarchy-slot="content"');
    if (headerIndex < 0 || sectionTabsIndex <= headerIndex) finding(findings, "page hierarchy Header and parent tabs are not in source order");
    if (depth === "two") {
      if (localNavigationIndex >= 0 || thirdLevelIndex >= 0) finding(findings, "two-level page contains an internal third-level navigation region");
      if (lowerContentIndex <= sectionTabsIndex || contentIndex <= sectionTabsIndex) finding(findings, "two-level page content is not below parent tabs");
    }
    if (depth === "three") {
      if (thirdLevelIndex <= sectionTabsIndex || localNavigationIndex <= sectionTabsIndex || contentIndex <= localNavigationIndex) finding(findings, "three-level page does not contain ordered local navigation and content inside the selected subpage");
    }
    if (has(markup, "tcrn-product-shell")) finding(findings, "PageHierarchy duplicates the global ProductShell shell");
    if (!renderedEvidence) {
      finding(findings, "page hierarchy rendered geometry evidence is missing");
    } else {
      const hierarchyEvidence = renderedEvidence.geometry?.pageHierarchy;
      if (renderedEvidence.dom?.pageHierarchyCount !== 1 || renderedEvidence.dom?.pageHeaderCount !== 1 || renderedEvidence.dom?.sectionTabsCount !== 1) finding(findings, "actual page hierarchy component counts are not proven");
      if (depth === "two" && Number(renderedEvidence.dom?.localNavigationSlotCount) !== 0) finding(findings, "two-level rendered DOM contains local navigation");
      if (depth === "three" && Number(renderedEvidence.dom?.localNavigationSlotCount) !== 1) finding(findings, "three-level rendered DOM is missing local navigation");
      if (hierarchyEvidence?.visible !== true) finding(findings, "page hierarchy is not visibly rendered");
      if (hierarchyEvidence?.headerTabsOverlap || hierarchyEvidence?.tabsContentOverlap || hierarchyEvidence?.localContentOverlap) finding(findings, "page hierarchy regions overlap in the rendered geometry");
      if (renderedEvidence.geometry?.pageOverflow === true) finding(findings, "page hierarchy creates page-level horizontal overflow");
    }
  } else if (kind === "consumer-feature") {
    const applicable = attr(markup, "data-consumer-feature-applicable");
    const declaredVisible = attr(markup, "data-consumer-feature-visible");
    const actualEntries = interactiveEntryTags(markup);
    const actualVisibleEntries = actualEntries.filter((entry) => !isHiddenElementTag(entry));
    if (!(["true", "false"].includes(applicable ?? "") && ["true", "false"].includes(declaredVisible ?? ""))) {
      finding(findings, "consumer feature applicability is not explicit");
    } else {
      if (applicable === "false" && actualVisibleEntries.length > 0) finding(findings, "consumer marked feature not applicable but left an actual entry visible");
      if (!renderedEvidence) {
        finding(findings, "consumer feature rendered visibility evidence is missing");
      } else {
        if (renderedEvidence.dom?.featureEntryCount !== actualEntries.length) finding(findings, "actual feature entry count is not carried by rendered evidence");
        if (applicable === "false" && Number(renderedEvidence.dom?.featureVisibleEntryCount) > 0) finding(findings, "consumer marked feature not applicable but rendered an actual visible entry");
      }
    }
  } else {
    finding(findings, `unknown fixture kind: ${String(kind)}`);
  }

  return { ok: findings.length === 0, findings };
}

function validSettingChoiceMarkup() {
  return renderToStaticMarkup(createElement(SettingChoice, {
    label: "Execution host",
    name: "host",
    options: [
      { value: "local", label: "Local", minInlineSize: 112 },
      { value: "remote", label: "Remote", minInlineSize: 112, disabled: true }
    ],
    availableInlineSize: 248
  }));
}

function validMultiOptionSettingChoiceMarkup() {
  return renderToStaticMarkup(createElement(SettingChoice, {
    label: "Execution mode",
    name: "mode",
    options: [
      { value: "local", label: "Local" },
      { value: "remote", label: "Remote" },
      { value: "deferred", label: "Deferred", disabled: true }
    ],
    availableInlineSize: 720
  }));
}

function validUnmeasuredBinaryMarkup() {
  return renderToStaticMarkup(createElement(SettingChoice, {
    label: "Execution profile",
    name: "profile",
    options: [
      { value: "local", label: "L".repeat(100) },
      { value: "remote", label: "R".repeat(100) }
    ],
    availableInlineSize: 248
  }));
}

function validNumberInputMarkup() {
  return renderToStaticMarkup(createElement(NumberInput, {
    name: "budget",
    value: 8192,
    min: 512,
    max: 8192,
    readOnly: true
  }));
}

function narrowNumberInputMarkup() {
  return renderToStaticMarkup(createElement(NumberInput, {
    name: "budget",
    value: 4096,
    min: 512,
    max: 8192,
    readOnly: true,
    style: { width: "1px", minInlineSize: "0px", maxWidth: "1px", fontSize: "40px" }
  }));
}

function validSettingsLayoutMarkup() {
  const hostSwitcher = createElement(SettingsHostSwitcher, {
    label: "Execution host",
    name: "host",
    hosts: [
      { value: "local", label: "Local", minInlineSize: 112 },
      { value: "remote", label: "Remote", minInlineSize: 112 }
    ],
    availableInlineSize: 248
  });
  const navigation = createElement("a", { href: "#configuration" }, "Configuration");
  const longValue = createElement(Input, {
    name: "model",
    value: "model-with-a-long-but-editable-identifier",
    readOnly: true
  });
  const row = createElement(SettingRow, {
    label: "Model",
    description: "The complete value stays selectable and copyable.",
    control: longValue
  });
  return renderToStaticMarkup(createElement(SettingsLayout, {
    navigation,
    navigationLabel: "Settings navigation",
    hostSwitcher,
    contentLabel: "Settings content",
    children: row
  }));
}

function validTwoLevelPageHierarchyMarkup() {
  return renderToStaticMarkup(createElement(PageHierarchy, {
    depth: "two",
    header: createElement(PageHeader, { title: "Settings" }),
    sectionTabs: createElement(SubNav, {
      label: "Settings sections",
      items: [{ id: "general", label: "General", current: true }, { id: "connection", label: "Connection" }, { id: "limits", label: "Limits" }]
    }),
    content: createElement("p", null, "More than two values use Select."),
    contentLabel: "Complete configuration"
  }));
}

function validThreeLevelPageHierarchyMarkup() {
  return renderToStaticMarkup(createElement(PageHierarchy, {
    depth: "three",
    header: createElement(PageHeader, { title: "Settings" }),
    sectionTabs: createElement(SubNav, {
      label: "Settings sections",
      items: [{ id: "general", label: "General", current: true }, { id: "connection", label: "Connection" }, { id: "limits", label: "Limits" }]
    }),
    localNavigation: createElement(SectionTabs, {
      items: [{ id: "general", label: "General", selected: true }, { id: "connection", label: "Connection" }, { id: "limits", label: "Limits" }]
    }),
    localNavigationLabel: "Settings sections",
    content: createElement("p", null, "Long values remain editable, selectable, and copyable."),
    contentLabel: "Complete configuration"
  }));
}

function invalidTwoLevelWithLocalNavigationMarkup() {
  return '<div data-page-hierarchy="true" data-page-hierarchy-depth="two" data-page-hierarchy-source="explicit-depth-prop" data-page-hierarchy-width-policy="container-only" data-page-hierarchy-shell-boundary="global-product-shell-external" data-page-hierarchy-valid="true"><div class="tcrn-page-hierarchy__header" data-page-hierarchy-region="header" data-page-hierarchy-slot="header"><header class="tcrn-page-header"><h2>Settings</h2></header></div><div class="tcrn-page-hierarchy__section-tabs" data-page-hierarchy-region="section-tabs" data-page-hierarchy-slot="section-tabs"><nav class="tcrn-sub-nav">General</nav></div><div class="tcrn-page-hierarchy__third-level" data-page-hierarchy-region="third-level"><aside data-page-hierarchy-slot="local-navigation">Details</aside><div data-page-hierarchy-slot="content">Content</div></div></div>';
}

function invalidThreeLevelMissingParentTabsMarkup() {
  return '<div data-page-hierarchy="true" data-page-hierarchy-depth="three" data-page-hierarchy-source="explicit-depth-prop" data-page-hierarchy-width-policy="container-only" data-page-hierarchy-shell-boundary="global-product-shell-external" data-page-hierarchy-valid="true"><div class="tcrn-page-hierarchy__header" data-page-hierarchy-region="header" data-page-hierarchy-slot="header"><header class="tcrn-page-header"><h2>Settings</h2></header></div><div class="tcrn-page-hierarchy__third-level" data-page-hierarchy-region="third-level"><aside data-page-hierarchy-slot="local-navigation">Details</aside><div data-page-hierarchy-slot="content">Content</div></div></div>';
}

function invalidThreeLevelOverlappingRegionsMarkup() {
  return '<div data-page-hierarchy="true" data-page-hierarchy-depth="three" data-page-hierarchy-source="explicit-depth-prop" data-page-hierarchy-width-policy="container-only" data-page-hierarchy-shell-boundary="global-product-shell-external" data-page-hierarchy-valid="true"><div class="tcrn-page-hierarchy__header" data-page-hierarchy-region="header" data-page-hierarchy-slot="header"><header class="tcrn-page-header"><h2>Settings</h2></header></div><div class="tcrn-page-hierarchy__section-tabs" data-page-hierarchy-region="section-tabs" data-page-hierarchy-slot="section-tabs"><nav class="tcrn-sub-nav">General</nav></div><div class="tcrn-page-hierarchy__third-level" data-page-hierarchy-region="third-level" style="position:relative;height:40px"><aside data-page-hierarchy-slot="local-navigation" style="position:absolute;inset:0">Details</aside><div data-page-hierarchy-slot="content" style="position:absolute;inset:0">Content</div></div></div>';
}

export async function runDsConsumptionProof() {
  const fixtures = [
    { id: "valid-setting-choice", kind: "setting-choice", expected: "pass", expectedDisabledOptionValues: ["remote"], markup: validSettingChoiceMarkup() },
    { id: "valid-multi-option-setting-choice", kind: "setting-choice", expected: "pass", expectedDisabledOptionValues: ["deferred"], markup: validMultiOptionSettingChoiceMarkup() },
    { id: "valid-unmeasured-binary-falls-back-to-select", kind: "setting-choice", expected: "pass", markup: validUnmeasuredBinaryMarkup() },
    {
      id: "valid-number-input",
      kind: "number-input",
      expected: "pass",
      markup: validNumberInputMarkup()
    },
    { id: "valid-settings-layout", kind: "settings-layout", expected: "pass", markup: validSettingsLayoutMarkup() },
    {
      id: "number-value-too-narrow",
      kind: "number-input",
      expected: "reject",
      markup: narrowNumberInputMarkup()
    },
    {
      id: "valid-consumer-not-applicable",
      kind: "consumer-feature",
      expected: "pass",
      markup: '<div data-consumer-feature-applicable="false" data-consumer-feature-visible="false"></div>'
    },
    {
      id: "valid-two-level-page-hierarchy",
      kind: "page-hierarchy",
      expected: "pass",
      expectedPageDepth: "two",
      markup: validTwoLevelPageHierarchyMarkup()
    },
    {
      id: "valid-three-level-page-hierarchy",
      kind: "page-hierarchy",
      expected: "pass",
      expectedPageDepth: "three",
      markup: validThreeLevelPageHierarchyMarkup()
    },
    {
      id: "wrong-component-same-css",
      kind: "setting-choice",
      expected: "reject",
      markup: '<div class="tcrn-setting-choice tcrn-segmented-nav" data-setting-choice="true" data-setting-choice-semantic="navigation" data-setting-choice-control="radio" data-setting-choice-option-count="2" data-setting-choice-fit="true"><nav class="tcrn-segmented-nav" data-tab-semantics="segmented-navigation"><button>Local</button><button>Remote</button></nav></div>'
    },
    {
      id: "three-options-radio",
      kind: "setting-choice",
      expected: "reject",
      markup: '<div class="tcrn-setting-choice" data-setting-choice="true" data-setting-choice-semantic="value-selection" data-setting-choice-control="radio" data-setting-choice-option-count="3" data-setting-choice-fit="true"><fieldset><legend>Mode</legend><input type="radio" /><input type="radio" /><input type="radio" /></fieldset></div>'
    },
    {
      id: "stepper-used-for-number",
      kind: "number-input",
      expected: "reject",
      markup: '<nav class="tcrn-stepper" data-stepper="true"><ol><li>1</li><li>2</li></ol></nav>'
    },
    {
      id: "number-value-clipped",
      kind: "number-input",
      expected: "reject",
      markup: '<input class="tcrn-number-input" data-number-input="true" data-number-input-semantic="numeric-entry" data-number-input-visibility="clipped" type="number" value="4096" style="text-overflow:ellipsis" />'
    },
    {
      id: "two-host-columns-at-narrow-width",
      kind: "settings-layout",
      expected: "reject",
      markup: '<div class="tcrn-settings-layout" data-settings-layout="true" data-settings-layout-mode="viewport-only" data-settings-layout-form-policy="two-host-columns" data-settings-layout-breakpoint="980px" data-settings-content-breakpoint="760px" data-settings-local-navigation="wide" data-settings-overflow-policy="clipped" data-settings-long-value-policy="truncate"><aside data-settings-local-nav="true"></aside><div data-settings-complete-form="true"></div></div>'
    },
    {
      id: "two-level-page-adds-local-navigation",
      kind: "page-hierarchy",
      expected: "reject",
      expectedPageDepth: "two",
      markup: invalidTwoLevelWithLocalNavigationMarkup()
    },
    {
      id: "three-level-page-drops-parent-tabs",
      kind: "page-hierarchy",
      expected: "reject",
      expectedPageDepth: "three",
      markup: invalidThreeLevelMissingParentTabsMarkup()
    },
    {
      id: "three-level-page-regions-overlap",
      kind: "page-hierarchy",
      expected: "reject",
      expectedPageDepth: "three",
      markup: invalidThreeLevelOverlappingRegionsMarkup()
    },
    {
      id: "consumer-not-applicable-entry-visible",
      kind: "consumer-feature",
      expected: "reject",
      markup: '<button data-consumer-feature-applicable="false" data-consumer-feature-visible="true">Retired feature</button>'
    }
  ];
  const browser = await chromium.launch({ headless: true });
  let results;
  try {
    results = [];
    for (const { markup, ...fixture } of fixtures) {
      const renderedEvidence = await measureRenderedMarkup(browser, fixture.kind, markup);
      results.push({
        ...fixture,
        renderedEvidence,
        result: inspectDsConsumption({ kind: fixture.kind, markup, renderedEvidence, expectedDisabledOptionValues: fixture.expectedDisabledOptionValues, expectedPageDepth: fixture.expectedPageDepth })
      });
    }
  } finally {
    await browser.close();
  }
  const mismatches = results.filter((fixture) => (fixture.expected === "pass") !== fixture.result.ok).map((fixture) => fixture.id);
  const contractDigest = createHash("sha256")
    .update(JSON.stringify({ contractVersion: DS_CONSUMPTION_CONTRACT_VERSION, rules: dsConsumptionRules }))
    .digest("hex");
  return {
    schemaVersion: DS_CONSUMPTION_PROOF_VERSION,
    contractVersion: DS_CONSUMPTION_CONTRACT_VERSION,
    contractDigest,
    rules: dsConsumptionRules,
    fixtures: results,
    mismatches,
    ok: mismatches.length === 0
  };
}

if (process.argv[1]?.endsWith("ds-consumption-proof.mjs")) {
  const result = await runDsConsumptionProof();
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!result.ok) process.exitCode = 1;
}
