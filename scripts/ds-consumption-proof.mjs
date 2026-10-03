#!/usr/bin/env node
// TCRN-DS-STORY-109/110/111/112/119 — consumer checks for the 106/107/112 rules and the DS verification cadence.
//
// This proof renders neutral fixtures in a real browser and inspects semantic,
// structural, DOM-cardinality, visibility, geometry, and layout facts, not only
// class names or a stylesheet digest. Its negative fixtures keep the detector
// honest: marker-only false greens, dropped disabled options, unmeasured binary
// labels, clipped numbers, over-capacity settings, and invalid page hierarchies
// must all be rejected.

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { chromium } from "@playwright/test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  Input,
  Field,
  Select,
  MultiSelect,
  NumberInput,
  SettingChoice,
  SettingsHostSwitcher,
  SettingsLayout,
  SettingRow,
  SettingRowList,
  PageHierarchy,
  PageHeader,
  SectionTabs,
  SubNav,
  tcrnComponentCss
} from "../packages/ui-react/dist/index.js";
import { tcrnTokenCss } from "../packages/ui-tokens/dist/index.js";
import { runMultiSelectRequiredProof } from "./lib/multi-select-required-proof.mjs";

export const DS_CONSUMPTION_PROOF_VERSION = "tcrn.ds-consumption-proof.v2";
export const DS_CONSUMPTION_CONTRACT_VERSION = "ds_consumption_contract_v2";

export const DS_VERIFICATION_CADENCE = Object.freeze({
  schemaVersion: "tcrn.ds.verification-cadence.v1",
  scope: "EPIC038 implementation and necessary DS dependencies",
  development: {
    preferredChecks: ["pnpm typecheck", "pnpm --filter @tcrn/ui-react test:ssr", "pnpm --filter @tcrn/ui-react test:dom", "pnpm tokens:proof", "pnpm ds:consumption:proof", "pnpm full-surface:proof", "pnpm storybook:smoke"],
    rule: "Select checks affected by the change and a focused negative leg for changed validators or boundaries; do not start the flat full verify/P1/push-gate set for each edit."
  },
  candidateFinal: {
    trigger: "All work in the bounded batch and necessary local dependencies are fixed at one candidate.",
    requiredChecks: ["pnpm verify", "pnpm public-docs:vercel-build"],
    rule: "Run one final top-level verify; retain the static-document build as a separate output target when requested."
  },
  parentChildDeduplication: {
    parent: "pnpm verify",
    contained: ["pnpm typecheck", "pnpm build", "pnpm test", "pnpm ds:consumption:proof", "pnpm full-surface:proof", "pnpm internal-alpha:proof"],
    rule: "Do not rerun a contained child after the same successful parent receipt without changed input or targeted diagnosis of a failure."
  },
  evidenceReuse: {
    requiredInputs: ["source tree SHA", "working-tree status", "lockfile and package versions", "command and flags", "browser/tool version", "fixture/input digest", "baseline and output-target digest"],
    invalidators: ["source, dependency, command, environment, fixture, baseline, or output-target change", "prior failure", "missing input or output digest", "empty or unknown identity content"],
    rule: "Reuse only when every required input matches exactly; otherwise mark the old receipt invalidated and rerun the affected check."
  },
  preservation: "Timing and de-duplication do not remove security, compatibility, replay, release-identity, localization, visual, or no-overclaim gates."
});

export const DS_VERIFICATION_INPUT_KEYS = Object.freeze([
  "sourceTreeSha",
  "workingTreeStatus",
  "lockfileDigest",
  "packageVersions",
  "command",
  "flags",
  "browserToolVersion",
  "fixtureDigest",
  "baselineDigest",
  "outputTargetDigest"
]);

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function hasConcreteValue(value, { allowEmptyObject = false } = {}) {
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "boolean") return true;
  if (value === null || value === undefined || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.length > 0 && value.every((item) => hasConcreteValue(item));
  const keys = Object.keys(value);
  if (keys.length === 0) return allowEmptyObject;
  return keys.every((key) => key.trim().length > 0 && hasConcreteValue(value[key]));
}

const nonEmptyVerificationIdentityKeys = new Set([
  "sourceTreeSha",
  "workingTreeStatus",
  "lockfileDigest",
  "packageVersions",
  "command",
  "browserToolVersion",
  "fixtureDigest",
  "baselineDigest",
  "outputTargetDigest"
]);

function hasConcreteVerificationIdentity(key, value) {
  if (key === "flags") {
    // An empty flag string/object is a meaningful declaration of the default
    // invocation. It is the only identity field allowed to be empty.
    return value === "" || hasConcreteValue(value, { allowEmptyObject: true });
  }
  if (key === "workingTreeStatus") {
    if (typeof value === "string") return value.trim().length > 0;
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    if (typeof value.state !== "string" || value.state.trim().length === 0 || typeof value.porcelain !== "string") return false;
    if (value.state === "clean") return value.porcelain === "";
    if (value.state === "dirty") return value.porcelain.trim().length > 0;
    return false;
  }
  if (["packageVersions", "browserToolVersion"].includes(key)) {
    if (typeof value === "string") return value.trim().length > 0;
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    const entries = Object.entries(value);
    return entries.length > 0 && entries.every(([entryKey, entryValue]) => entryKey.trim().length > 0 && typeof entryValue === "string" && entryValue.trim().length > 0);
  }
  if (nonEmptyVerificationIdentityKeys.has(key)) return typeof value === "string" && value.trim().length > 0;
  return value !== undefined && value !== null;
}

function fileDigest(path) {
  try {
    return `sha256:${createHash("sha256").update(readFileSync(path)).digest("hex")}`;
  } catch {
    return "";
  }
}

function gitOutput(args) {
  try {
    return execFileSync("git", args, { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

/**
 * Decide whether a successful verification receipt can be reused. The caller
 * must provide every identity input; an unknown input is not a cache hit.
 */
export function evaluateEvidenceReuse(previous, current) {
  const findings = [];
  if (!previous || typeof previous !== "object" || !current || typeof current !== "object") {
    return { reusable: false, findings: ["evidence_record_invalid"] };
  }
  if (previous.status !== "passed") findings.push("previous_receipt_not_successful");
  for (const key of DS_VERIFICATION_INPUT_KEYS) {
    if (!hasOwn(previous, key)) {
      findings.push(`previous_input_missing:${key}`);
      continue;
    }
    if (!hasConcreteVerificationIdentity(key, previous[key])) {
      findings.push(`previous_input_invalid:${key}`);
      continue;
    }
    if (!hasOwn(current, key)) {
      findings.push(`current_input_missing:${key}`);
      continue;
    }
    if (!hasConcreteVerificationIdentity(key, current[key])) {
      findings.push(`current_input_invalid:${key}`);
      continue;
    }
    if (JSON.stringify(previous[key]) !== JSON.stringify(current[key])) findings.push(`input_changed:${key}`);
  }
  return { reusable: findings.length === 0, findings };
}

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
  },
  {
    id: "DS-110-R1",
    name: "setting-choice-state-retention",
    rule: "SettingChoice retains valid controlled or uncontrolled values across radio/Select branch changes; onChange reports actual user value changes once and does not fire for layout-only swaps or unchanged values."
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

const GEOMETRY_EPSILON = 1;

function finiteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function validGeometryRect(rect) {
  if (!rect || !["left", "top", "right", "bottom", "width", "height"].every((key) => finiteNumber(rect[key]))) return false;
  if (rect.width <= 0 || rect.height <= 0 || rect.right <= rect.left || rect.bottom <= rect.top) return false;
  return Math.abs((rect.right - rect.left) - rect.width) <= GEOMETRY_EPSILON
    && Math.abs((rect.bottom - rect.top) - rect.height) <= GEOMETRY_EPSILON;
}

function rectContains(container, child) {
  return validGeometryRect(container)
    && validGeometryRect(child)
    && child.left >= container.left - GEOMETRY_EPSILON
    && child.top >= container.top - GEOMETRY_EPSILON
    && child.right <= container.right + GEOMETRY_EPSILON
    && child.bottom <= container.bottom + GEOMETRY_EPSILON;
}

function rectsOverlap(first, second) {
  return validGeometryRect(first)
    && validGeometryRect(second)
    && first.left < second.right - GEOMETRY_EPSILON
    && first.right > second.left + GEOMETRY_EPSILON
    && first.top < second.bottom - GEOMETRY_EPSILON
    && first.bottom > second.top + GEOMETRY_EPSILON;
}

function exactValues(actual, expected) {
  return Array.isArray(actual)
    && actual.length === expected.length
    && actual.every((value, index) => value === expected[index]);
}

function renderedDisabledValuesMatch(actualValues, expectedValues, findings, branch) {
  if (!Array.isArray(actualValues)) {
    finding(findings, `${branch} rendered disabled state evidence is missing`);
    return;
  }
  const actual = [...actualValues].sort();
  const expected = [...expectedValues].sort();
  if (!exactValues(actual, expected)) finding(findings, `${branch} rendered disabled values differ from the declared options`);
}

async function measureRenderedMarkup(browser, kind, markup, viewportWidth = 720) {
  const page = await browser.newPage({ viewport: { width: viewportWidth, height: 520 } });
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
      const pageHierarchyThirdLevel = pageHierarchy?.querySelector("[data-page-hierarchy-region='third-level']");
      const pageHierarchyThirdLevelGrid = pageHierarchy?.querySelector(".tcrn-page-hierarchy__third-level");
      const pageHierarchyLocalNavigation = pageHierarchy?.querySelector("[data-page-hierarchy-slot='local-navigation']");
      const pageHierarchyContent = pageHierarchy?.querySelector("[data-page-hierarchy-slot='content']");
      const selectNodes = Array.from(fixture?.querySelectorAll("select") ?? []);
      const radioNodes = Array.from(fixture?.querySelectorAll("input[type='radio']") ?? []);
      const numericNodes = Array.from(fixture?.querySelectorAll("input[type='number']") ?? []);
      const entryNodes = Array.from(fixture?.querySelectorAll("button,a,input,select,textarea,[role='button'],[role='menuitem']") ?? []);
      const visibleEntries = entryNodes.filter(visible);
      const hiddenOverflowNodes = Array.from(layout?.querySelectorAll("*") ?? []).filter((node) => {
        // Native Select owns its internal option viewport. Its UA overflow does
        // not conceal the form's labels, control border boxes or tools.
        if (node instanceof HTMLSelectElement) return false;
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
      const hierarchyThirdLevelRect = regionRect(pageHierarchyThirdLevel);
      const hierarchyThirdLevelGridRect = regionRect(pageHierarchyThirdLevelGrid);
      const hierarchyLocalNavigationRect = regionRect(pageHierarchyLocalNavigation);
      const hierarchyContentRect = regionRect(pageHierarchyContent);
      const settingsContent = layout?.querySelector(".tcrn-settings-layout__content");
      const settingsForm = layout?.querySelector(".tcrn-settings-layout__form");
      const settingRows = Array.from(settingsForm?.querySelectorAll(".tcrn-setting-row") ?? []);
      // Native input values scroll inside the control. Measure its border box,
      // while ordinary labels, descriptions and checklist text must wrap.
      const horizontalLeaks = (slot) => {
        if (!slot || !visible(slot)) return 0;
        const bounds = slot.getBoundingClientRect();
        const leaks = (box) => box.width > 0 && (box.left < bounds.left - 1 || box.right > bounds.right + 1);
        let count = Array.from(slot.querySelectorAll("*")).filter((node) => visible(node) && leaks(node.getBoundingClientRect())).length;
        const texts = document.createTreeWalker(slot, NodeFilter.SHOW_TEXT);
        while (texts.nextNode()) {
          const node = texts.currentNode;
          if (!node.textContent.trim() || !visible(node.parentElement) || node.parentElement.closest("select,textarea,.tcrn-sr-only")) continue;
          const range = document.createRange();
          range.selectNodeContents(node);
          count += Array.from(range.getClientRects()).filter(leaks).length;
        }
        return count;
      };
      return {
        schemaVersion: "tcrn.ds.rendered-consumption-evidence.v1",
        kind: fixtureKind,
        dom: {
          settingChoiceCount: fixture?.querySelectorAll("[data-setting-choice='true']").length ?? 0,
          radioCount: radioNodes.length,
          selectCount: selectNodes.length,
          optionCount: selectNodes.reduce((total, select) => total + select.options.length, 0),
          numericCount: numericNodes.length,
          settingRowCount: settingRows.length,
          pageHierarchyCount: fixture?.querySelectorAll("[data-page-hierarchy='true']").length ?? 0,
          pageHeaderCount: pageHierarchy?.querySelectorAll(".tcrn-page-header").length ?? 0,
          sectionTabsCount: pageHierarchy?.querySelectorAll("[data-page-hierarchy-region='section-tabs'] .tcrn-sub-nav,[data-page-hierarchy-region='section-tabs'] .tcrn-section-tabs").length ?? 0,
          thirdLevelRegionCount: pageHierarchy?.querySelectorAll("[data-page-hierarchy-region='third-level']").length ?? 0,
          localNavigationSlotCount: pageHierarchy?.querySelectorAll("[data-page-hierarchy-slot='local-navigation']").length ?? 0,
          hierarchyContentSlotCount: pageHierarchy?.querySelectorAll("[data-page-hierarchy-slot='content']").length ?? 0,
          pageHierarchySlotOrder: Array.from(pageHierarchy?.querySelectorAll("[data-page-hierarchy-slot]") ?? []).map((node) => node.getAttribute("data-page-hierarchy-slot")),
          pageHierarchyDepths: Array.from(fixture?.querySelectorAll("[data-page-hierarchy='true']") ?? []).map((node) => node.getAttribute("data-page-hierarchy-depth")),
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
          settings: settingsContent ? {
            contentRect: regionRect(settingsContent),
            stackThresholdPx: Number.parseFloat(layout.getAttribute("data-settings-content-breakpoint")),
            controlMinimumPx: Number.parseFloat(getComputedStyle(settingsContent).getPropertyValue("--tcrn-container-settings-control-min")),
            rows: settingRows.map((row) => {
              const label = row.querySelector(":scope > .tcrn-setting-row__label");
              const control = row.querySelector(":scope > .tcrn-setting-row__control");
              const tools = row.querySelector(":scope > .tcrn-setting-row__tools");
              return {
                rowRect: regionRect(row),
                labelRect: regionRect(label),
                controlRect: regionRect(control),
                toolsRect: regionRect(tools),
                toolsPresent: Boolean(tools?.childElementCount),
                gapPx: Number.parseFloat(getComputedStyle(row).columnGap),
                wrapperRects: Array.from(control?.children ?? []).filter(visible).map(regionRect),
                valueControlRects: Array.from(control?.querySelectorAll("input:not([type='checkbox']):not([type='radio']),select") ?? []).filter(visible).map(regionRect),
                horizontalLeakCount: [label, control, tools].reduce((count, slot) => count + horizontalLeaks(slot), 0)
              };
            })
          } : null,
          pageHierarchy: pageHierarchy ? {
            visible: visible(pageHierarchy),
            headerVisible: visible(pageHierarchyHeader),
            sectionTabsVisible: visible(pageHierarchyTabs),
            thirdLevelVisible: visible(pageHierarchyThirdLevel),
            localNavigationVisible: visible(pageHierarchyLocalNavigation),
            contentVisible: visible(pageHierarchyContent),
            pageHierarchyRect: regionRect(pageHierarchy),
            headerRect: hierarchyHeaderRect,
            sectionTabsRect: hierarchyTabsRect,
            thirdLevelRect: hierarchyThirdLevelRect,
            thirdLevelGridRect: hierarchyThirdLevelGridRect,
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

function inspectSettingRowGeometry(markup, renderedEvidence, findings) {
  const settings = renderedEvidence.geometry?.settings;
  const rows = settings?.rows;
  const rowCount = (markup.match(/data-setting-row="true"/gu) ?? []).length;
  if (!validGeometryRect(settings?.contentRect) || !Array.isArray(rows) || rows.length === 0 || rows.some((row) => !row || typeof row !== "object")
    || rows.length !== rowCount || renderedEvidence.dom?.settingRowCount !== rowCount
    || !finiteNumber(settings.stackThresholdPx) || settings.stackThresholdPx !== 720
    || !finiteNumber(settings.controlMinimumPx) || settings.controlMinimumPx <= 0) {
    finding(findings, "settings row/container geometry evidence is missing or invalid");
    return;
  }
  const wide = settings.contentRect.width >= settings.stackThresholdPx;
  const first = rows[0];
  if (!validGeometryRect(first.labelRect) || !validGeometryRect(first.controlRect)) {
    finding(findings, "settings first-row track geometry is missing or invalid");
    return;
  }
  const close = (a, b) => Math.abs(a - b) <= GEOMETRY_EPSILON;
  const toolStarts = rows.filter((row) => row.toolsPresent).map((row) => row.toolsRect?.left);
  for (const [index, row] of rows.entries()) {
    const { rowRect, labelRect, controlRect, toolsRect, gapPx } = row;
    const slots = [labelRect, controlRect, ...(row.toolsPresent ? [toolsRect] : [])];
    if (!rectContains(settings.contentRect, rowRect) || slots.some((slot) => !rectContains(rowRect, slot))
      || !finiteNumber(gapPx) || gapPx <= 0 || typeof row.toolsPresent !== "boolean") {
      finding(findings, `setting row ${index} has invalid or leaking slot geometry`);
      continue;
    }
    if (wide) {
      if (controlRect.left < labelRect.right + gapPx - GEOMETRY_EPSILON
        || controlRect.top >= labelRect.bottom || labelRect.top >= controlRect.bottom
        || controlRect.width < settings.controlMinimumPx - GEOMETRY_EPSILON
        || (row.toolsPresent && toolsRect.left < controlRect.right + gapPx - GEOMETRY_EPSILON)) {
        finding(findings, `setting row ${index} lacks distinct wide label/control/tools tracks`);
      }
      if (!close(labelRect.left, first.labelRect.left) || !close(labelRect.right, first.labelRect.right)
        || !close(controlRect.left, first.controlRect.left) || !close(controlRect.right, first.controlRect.right)
        || (row.toolsPresent && !close(toolsRect.left, toolStarts[0]))) {
        finding(findings, `setting row ${index} does not align with the shared wide tracks`);
      }
    } else if (controlRect.top < labelRect.bottom + gapPx - GEOMETRY_EPSILON
      || !close(controlRect.left, labelRect.left) || !close(controlRect.right, labelRect.right)
      || (row.toolsPresent && toolsRect.top < controlRect.bottom + gapPx - GEOMETRY_EPSILON)) {
      finding(findings, `setting row ${index} does not stack at the content-container boundary`);
    }
    if (!Array.isArray(row.wrapperRects) || row.wrapperRects.length === 0
      || !Array.isArray(row.valueControlRects)
      || [...row.wrapperRects, ...row.valueControlRects].some((box) => !rectContains(controlRect, box)
        || !close(box.left, controlRect.left) || !close(box.right, controlRect.right))) {
      finding(findings, `setting row ${index} control or wrapper does not fill its allocated track`);
    }
    if (!Number.isInteger(row.horizontalLeakCount) || row.horizontalLeakCount !== 0) {
      finding(findings, `setting row ${index} label, description, control or tools leaks horizontally`);
    }
  }
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
        renderedDisabledValuesMatch(renderedEvidence.dom?.disabledRadioValues, expectedDisabledOptionValues, findings, "RadioGroup");
        if (radioEvidence?.visible !== true) finding(findings, "binary value choice is not visibly rendered");
        if (Number(radioEvidence?.scrollWidth) > Number(radioEvidence?.clientWidth) + 1) finding(findings, "binary value choice overflows its rendered group");
        if ((radioEvidence?.optionScrollWidths ?? []).some((width, index) => Number(width) > Number(radioEvidence?.optionWidths?.[index] ?? 0) + 1)) {
          finding(findings, "binary value option content overflows its rendered option");
        }
      }
    } else if (control === "select") {
      if (elementTags(markup, "select").length !== 1) finding(findings, "Select control is missing or duplicated in a select decision");
      expectedDisabledValuesMatch(actualOptionValues, expectedDisabledOptionValues, findings, "Select");
      if (renderedEvidence) {
        if (renderedEvidence.dom?.selectCount !== 1) finding(findings, "actual Select DOM count is not exactly one");
        if (renderedEvidence.dom?.optionCount !== actualOptionValues.length) finding(findings, "actual Select option count is not carried by rendered evidence");
        renderedDisabledValuesMatch(renderedEvidence.dom?.disabledOptionValues, expectedDisabledOptionValues, findings, "Select");
      }
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
      inspectSettingRowGeometry(markup, renderedEvidence, findings);
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
      const hierarchyDom = renderedEvidence.dom;
      const expectedSlotOrder = depth === "three"
        ? ["header", "section-tabs", "local-navigation", "content"]
        : ["header", "section-tabs", "content"];
      if (hierarchyDom?.pageHierarchyCount !== 1
        || hierarchyDom?.pageHeaderCount !== 1
        || hierarchyDom?.sectionTabsCount !== 1
        || hierarchyDom?.hierarchyContentSlotCount !== 1
        || hierarchyDom?.thirdLevelRegionCount !== (depth === "three" ? 1 : 0)
        || hierarchyDom?.localNavigationSlotCount !== (depth === "three" ? 1 : 0)) {
        finding(findings, "actual page hierarchy component counts are not proven");
      }
      if (!exactValues(hierarchyDom?.pageHierarchyDepths, [depth])) finding(findings, "actual page hierarchy depth is not proven");
      if (!exactValues(hierarchyDom?.pageHierarchySlotOrder, expectedSlotOrder)) finding(findings, "actual page hierarchy slot order is not proven");

      const pageWidth = renderedEvidence.geometry?.pageWidthPx;
      const pageScrollWidth = renderedEvidence.geometry?.pageScrollWidthPx;
      if (!finiteNumber(pageWidth) || pageWidth <= 0 || !finiteNumber(pageScrollWidth) || pageScrollWidth <= 0) {
        finding(findings, "page overflow geometry evidence is missing or non-finite");
      } else {
        const computedPageOverflow = pageScrollWidth > pageWidth + GEOMETRY_EPSILON;
        if (typeof renderedEvidence.geometry?.pageOverflow !== "boolean") finding(findings, "page overflow evidence is missing");
        if (renderedEvidence.geometry?.pageOverflow !== computedPageOverflow) finding(findings, "page overflow boolean contradicts the measured widths");
        if (computedPageOverflow) finding(findings, "page hierarchy creates page-level horizontal overflow");
      }

      const requiredGeometry = [
        ["pageHierarchyRect", hierarchyEvidence?.pageHierarchyRect],
        ["headerRect", hierarchyEvidence?.headerRect],
        ["sectionTabsRect", hierarchyEvidence?.sectionTabsRect],
        ["contentRect", hierarchyEvidence?.contentRect]
      ];
      if (depth === "three") requiredGeometry.push(["thirdLevelRect", hierarchyEvidence?.thirdLevelRect], ["localNavigationRect", hierarchyEvidence?.localNavigationRect]);
      for (const [name, rect] of requiredGeometry) {
        if (!validGeometryRect(rect)) finding(findings, `${name} is missing or invalid`);
      }
      if (hierarchyEvidence?.visible !== true
        || hierarchyEvidence?.headerVisible !== true
        || hierarchyEvidence?.sectionTabsVisible !== true
        || hierarchyEvidence?.contentVisible !== true
        || (depth === "three" && (hierarchyEvidence?.thirdLevelVisible !== true || hierarchyEvidence?.localNavigationVisible !== true))) {
        finding(findings, "page hierarchy regions are not visibly rendered");
      }

      const pageHierarchyRect = hierarchyEvidence?.pageHierarchyRect;
      const headerRect = hierarchyEvidence?.headerRect;
      const sectionTabsRect = hierarchyEvidence?.sectionTabsRect;
      const thirdLevelRect = hierarchyEvidence?.thirdLevelRect;
      const localNavigationRect = hierarchyEvidence?.localNavigationRect;
      const contentRect = hierarchyEvidence?.contentRect;
      if (validGeometryRect(pageHierarchyRect) && validGeometryRect(headerRect) && !rectContains(pageHierarchyRect, headerRect)) finding(findings, "Header is outside the page hierarchy bounds");
      if (validGeometryRect(pageHierarchyRect) && validGeometryRect(sectionTabsRect) && !rectContains(pageHierarchyRect, sectionTabsRect)) finding(findings, "parent tabs are outside the page hierarchy bounds");
      if (validGeometryRect(pageHierarchyRect) && validGeometryRect(contentRect) && !rectContains(pageHierarchyRect, contentRect)) finding(findings, "content is outside the page hierarchy bounds");
      if (rectsOverlap(headerRect, sectionTabsRect) || rectsOverlap(sectionTabsRect, contentRect)) finding(findings, "page hierarchy regions overlap in the rendered geometry");
      if (!validGeometryRect(headerRect) || !validGeometryRect(sectionTabsRect) || headerRect.bottom > sectionTabsRect.top + GEOMETRY_EPSILON) finding(findings, "Header is not above parent tabs in the rendered geometry");
      if (!validGeometryRect(sectionTabsRect) || !validGeometryRect(contentRect) || sectionTabsRect.bottom > contentRect.top + GEOMETRY_EPSILON) finding(findings, "content is not below parent tabs in the rendered geometry");
      if (depth === "three") {
        if (!validGeometryRect(thirdLevelRect) || !rectContains(pageHierarchyRect, thirdLevelRect)) finding(findings, "third-level region is outside the page hierarchy bounds");
        if (!validGeometryRect(thirdLevelRect) || !rectContains(thirdLevelRect, localNavigationRect) || !rectContains(thirdLevelRect, contentRect)) finding(findings, "third-level local navigation/content are not contained in the selected subpage");
        if (rectsOverlap(localNavigationRect, contentRect)) finding(findings, "third-level local navigation and content overlap in the rendered geometry");
        const horizontalOrder = validGeometryRect(localNavigationRect) && validGeometryRect(contentRect)
          && localNavigationRect.right <= contentRect.left + GEOMETRY_EPSILON
          && localNavigationRect.top < contentRect.bottom - GEOMETRY_EPSILON
          && contentRect.top < localNavigationRect.bottom - GEOMETRY_EPSILON;
        const verticalOrder = validGeometryRect(localNavigationRect) && validGeometryRect(contentRect)
          && localNavigationRect.bottom <= contentRect.top + GEOMETRY_EPSILON
          && localNavigationRect.left < contentRect.right - GEOMETRY_EPSILON
          && contentRect.left < localNavigationRect.right - GEOMETRY_EPSILON;
        if (!horizontalOrder && !verticalOrder) finding(findings, "third-level local navigation/content order is not a valid left-right or responsive stacked layout");
      }
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

function validSettingsLayoutMarkup({ rows, shape = "direct", motherWidth } = {}) {
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
  const layout = createElement(SettingsLayout, {
    navigation,
    navigationLabel: "Settings navigation",
    hostSwitcher,
    contentLabel: "Settings content",
    children: shape === "list" ? createElement(SettingRowList, null, rows ?? row) : rows ?? row
  });
  return renderToStaticMarkup(motherWidth === undefined ? layout : createElement("section", {
    style: { inlineSize: motherWidth, maxInlineSize: "100%", minInlineSize: 0 }
  }, layout));
}

function mixedSettingsRows({ forcedColumns, shrinkControl, unwrappedText } = {}) {
  const longText = `A complete localized label /${"continuousidentifier".repeat(16)}`;
  const options = [{ value: "local", label: longText }, { value: "remote", label: "Remote" }, { value: "deferred", label: "Deferred", disabled: true }];
  const controls = [
    createElement(Input, { name: "raw", value: longText, readOnly: true }),
    createElement(Field, { label: "Wrapped input", hint: longText }, createElement(Input, { name: "wrapped", value: longText, readOnly: true })),
    createElement(Select, { name: "select", options, defaultValue: "local" }),
    createElement(SettingChoice, { name: "choice", label: longText, options, availableInlineSize: 240, defaultValue: "local" }),
    createElement("div", { className: "tcrn-number-input-field" }, createElement(NumberInput, { name: "numeric", value: 8192, min: 512, max: 8192, readOnly: true })),
    createElement(Field, { label: "Wrapped number", hint: longText }, createElement(NumberInput, { name: "wrapped-number", value: 8192, min: 512, max: 8192, readOnly: true })),
    createElement(MultiSelect, { name: "native-set", options, defaultValue: ["local"] }),
    createElement(Field, { label: "Checkbox collection", group: true }, createElement(MultiSelect, {
      name: "checkbox-set", options, defaultValue: ["local"], presentation: "checkboxes", clearSelectionLabel: "Clear selection"
    }))
  ];
  return controls.map((control, index) => createElement(SettingRow, {
    key: index,
    label: index === 0 ? longText : `Configuration ${index}`,
    settingKey: `settings.${"long-key-".repeat(12)}${index}`,
    description: longText,
    control: shrinkControl && index === 1 ? createElement("div", { style: { inlineSize: "75%" } }, control) : control,
    modified: index % 3 === 0,
    onReset: index % 3 === 0 ? () => {} : undefined,
    resetLabel: index === 0 ? "Restore defaults" : "Reset",
    style: index === 0 ? { gridTemplateColumns: forcedColumns, overflowWrap: unwrappedText ? "normal" : undefined } : undefined
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

function invalidReversedTwoLevelGeometryMarkup() {
  return '<div data-page-hierarchy="true" data-page-hierarchy-depth="two" data-page-hierarchy-source="explicit-depth-prop" data-page-hierarchy-width-policy="container-only" data-page-hierarchy-shell-boundary="global-product-shell-external" data-page-hierarchy-valid="true" style="position:relative;display:block;height:220px"><div class="tcrn-page-hierarchy__header" data-page-hierarchy-region="header" data-page-hierarchy-slot="header" style="position:absolute;inset-inline:0;top:160px;height:40px"><header class="tcrn-page-header"><h2>Settings</h2></header></div><div class="tcrn-page-hierarchy__section-tabs" data-page-hierarchy-region="section-tabs" data-page-hierarchy-slot="section-tabs" style="position:absolute;inset-inline:0;top:90px;height:40px"><nav class="tcrn-sub-nav">General</nav></div><div class="tcrn-page-hierarchy__lower-content" data-page-hierarchy-region="lower-content" data-page-hierarchy-slot="content" style="position:absolute;inset-inline:0;top:20px;height:40px"><div>Content</div></div></div>';
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
    ...["direct", "list"].flatMap((shape) => [
      { id: "wide", viewportWidth: 1440 },
      { id: "narrow", viewportWidth: 390 },
      { id: "wide-before-frame-split", viewportWidth: 980 },
      { id: "wide-after-frame-split", viewportWidth: 1024 },
      { id: "nested-narrow", viewportWidth: 1440, motherWidth: 600 },
      { id: "below-content-boundary", viewportWidth: 1440, motherWidth: 719 },
      { id: "at-content-boundary", viewportWidth: 1440, motherWidth: 720 }
    ].map(({ id, viewportWidth, motherWidth }) => ({
      id: `valid-settings-${shape}-${id}`,
      kind: "settings-layout",
      expected: "pass",
      viewportWidth,
      markup: validSettingsLayoutMarkup({ shape, motherWidth, rows: mixedSettingsRows() })
    }))),
    {
      id: "settings-wide-row-forced-to-stack",
      kind: "settings-layout",
      expected: "reject",
      viewportWidth: 1440,
      markup: validSettingsLayoutMarkup({ rows: mixedSettingsRows({ forcedColumns: "minmax(0,1fr)" }) })
    },
    {
      id: "settings-narrow-row-forced-to-columns",
      kind: "settings-layout",
      expected: "reject",
      viewportWidth: 1440,
      markup: validSettingsLayoutMarkup({ shape: "list", motherWidth: 600, rows: mixedSettingsRows({ forcedColumns: "minmax(0,1fr) minmax(0,1fr) max-content" }) })
    },
    {
      id: "settings-wrapper-does-not-fill-control-track",
      kind: "settings-layout",
      expected: "reject",
      viewportWidth: 1440,
      markup: validSettingsLayoutMarkup({ shape: "list", rows: mixedSettingsRows({ shrinkControl: true }) })
    },
    {
      id: "settings-long-label-leaks-its-track",
      kind: "settings-layout",
      expected: "reject",
      viewportWidth: 1440,
      markup: validSettingsLayoutMarkup({ rows: mixedSettingsRows({ unwrappedText: true }) })
    },
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
      id: "two-level-page-reversed-rendered-geometry",
      kind: "page-hierarchy",
      expected: "reject",
      expectedPageDepth: "two",
      markup: invalidReversedTwoLevelGeometryMarkup()
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
  let multiSelectRequired;
  try {
    results = [];
    for (const { markup, ...fixture } of fixtures) {
      const renderedEvidence = await measureRenderedMarkup(browser, fixture.kind, markup, fixture.viewportWidth);
      results.push({
        ...fixture,
        renderedEvidence,
        result: inspectDsConsumption({ kind: fixture.kind, markup, renderedEvidence, expectedDisabledOptionValues: fixture.expectedDisabledOptionValues, expectedPageDepth: fixture.expectedPageDepth })
      });
    }
    multiSelectRequired = await runMultiSelectRequiredProof(browser);
  } finally {
    await browser.close();
  }
  const mismatches = results.filter((fixture) => (fixture.expected === "pass") !== fixture.result.ok).map((fixture) => fixture.id);
  mismatches.push(...multiSelectRequired.mismatches);
  const rootPackage = JSON.parse(readFileSync("package.json", "utf8"));
  const uiReactPackage = JSON.parse(readFileSync("packages/ui-react/package.json", "utf8"));
  const uiTokensPackage = JSON.parse(readFileSync("packages/ui-tokens/package.json", "utf8"));
  const uiCopyStatePackage = JSON.parse(readFileSync("packages/ui-copy-state/package.json", "utf8"));
  const reuseBase = {
    status: "passed",
    sourceTreeSha: gitOutput(["rev-parse", "HEAD"]),
    workingTreeStatus: { state: gitOutput(["status", "--porcelain"]) === "" ? "clean" : "dirty", porcelain: gitOutput(["status", "--porcelain"]) },
    lockfileDigest: fileDigest("pnpm-lock.yaml"),
    packageVersions: { workspace: rootPackage.version, packageManager: rootPackage.packageManager, uiReact: uiReactPackage.version, uiTokens: uiTokensPackage.version, uiCopyState: uiCopyStatePackage.version },
    command: "pnpm full-surface:proof",
    flags: "",
    browserToolVersion: { browser: "playwright", version: rootPackage.devDependencies?.["@playwright/test"] ?? "" },
    fixtureDigest: `sha256:${createHash("sha256").update(JSON.stringify({ fixtures, multiSelectRequired: multiSelectRequired.fixtureDigest })).digest("hex")}`,
    baselineDigest: fileDigest("docs/verification/internal-alpha/visual-signature-baseline.json"),
    outputTargetDigest: fileDigest("apps/storybook/storybook-static/ai-consumption-contract.json")
  };
  const reuseSameInput = evaluateEvidenceReuse(reuseBase, { ...reuseBase });
  const reuseSourceChanged = evaluateEvidenceReuse(reuseBase, { ...reuseBase, sourceTreeSha: "changed-sha" });
  const reusePriorFailure = evaluateEvidenceReuse({ ...reuseBase, status: "failed" }, { ...reuseBase });
  const reuseMissingInput = evaluateEvidenceReuse(reuseBase, { ...reuseBase, fixtureDigest: undefined });
  const reuseEmptyIdentity = evaluateEvidenceReuse(reuseBase, { ...reuseBase, sourceTreeSha: "", lockfileDigest: "", command: "", fixtureDigest: "", baselineDigest: "", outputTargetDigest: "", packageVersions: {}, workingTreeStatus: {} });
  const reuseProof = {
    sameInput: reuseSameInput,
    sourceChanged: reuseSourceChanged,
    priorFailure: reusePriorFailure,
    missingInput: reuseMissingInput,
    emptyIdentity: reuseEmptyIdentity,
    ok: reuseSameInput.reusable
      && !reuseSourceChanged.reusable
      && !reusePriorFailure.reusable
      && !reuseMissingInput.reusable
      && !reuseEmptyIdentity.reusable
  };
  if (!reuseProof.ok) mismatches.push("verification-evidence-reuse");
  const contractDigest = createHash("sha256")
    .update(JSON.stringify({ contractVersion: DS_CONSUMPTION_CONTRACT_VERSION, rules: dsConsumptionRules, verificationCadence: DS_VERIFICATION_CADENCE }))
    .digest("hex");
  return {
    schemaVersion: DS_CONSUMPTION_PROOF_VERSION,
    contractVersion: DS_CONSUMPTION_CONTRACT_VERSION,
    contractDigest,
    rules: dsConsumptionRules,
    verificationCadence: DS_VERIFICATION_CADENCE,
    verificationInputKeys: DS_VERIFICATION_INPUT_KEYS,
    verificationReuseProof: reuseProof,
    multiSelectRequired,
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
