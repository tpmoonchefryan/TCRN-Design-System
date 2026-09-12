#!/usr/bin/env node
// TCRN-DS-STORY-108 — package-independent consumer checks for the 106/107 rules.
//
// This proof intentionally inspects semantic and layout markers in rendered HTML,
// not only class names or a stylesheet digest. Its negative fixtures keep the
// detector honest: a class/CSS match with the wrong semantic purpose, a Stepper
// standing in for numeric entry, a clipped number, and an over-capacity two-column
// settings layout must all be rejected.

import { createHash } from "node:crypto";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  Input,
  NumberInput,
  SettingChoice,
  SettingsHostSwitcher,
  SettingsLayout,
  SettingRow
} from "../packages/ui-react/dist/index.js";

export const DS_CONSUMPTION_PROOF_VERSION = "tcrn.ds-consumption-proof.v1";
export const DS_CONSUMPTION_CONTRACT_VERSION = "ds_consumption_contract_v1";

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
    rule: "Consumer proof checks component identity, semantic markers, element structure, value visibility, and layout policy; class or CSS equality alone is insufficient."
  },
  {
    id: "DS-108-R2",
    name: "consumer-owned-feature-applicability",
    rule: "A consumer may declare a feature not applicable; the check rejects an entry that remains visible while the consumer declaration says it is not applicable."
  }
]);

function attr(markup, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return markup.match(new RegExp(`${escaped}="([^"]*)"`, "u"))?.[1] ?? null;
}

function has(markup, fragment) {
  return markup.includes(fragment);
}

function finding(findings, message) {
  findings.push(message);
}

export function inspectDsConsumption({ kind, markup }) {
  const findings = [];
  if (typeof markup !== "string" || markup.trim().length === 0) {
    return { ok: false, findings: ["rendered markup is empty"] };
  }

  if (kind === "setting-choice") {
    if (attr(markup, "data-setting-choice") !== "true") finding(findings, "missing SettingChoice identity marker");
    if (attr(markup, "data-setting-choice-semantic") !== "value-selection") finding(findings, "setting choice is not marked as value-selection");
    const control = attr(markup, "data-setting-choice-control");
    const optionCount = Number(attr(markup, "data-setting-choice-option-count"));
    if (!Number.isInteger(optionCount) || optionCount < 0) finding(findings, "option count is not machine-readable");
    if (optionCount > 2 && control !== "select") finding(findings, "more than two setting options did not select Select");
    if (control === "radio") {
      if (optionCount !== 2) finding(findings, "radio value choice is not exactly binary");
      if (attr(markup, "data-setting-choice-fit") !== "true") finding(findings, "radio value choice has no positive fit proof");
      if (!has(markup, "<fieldset") || !has(markup, "<legend") || !has(markup, "type=\"radio\"")) {
        finding(findings, "binary value choice is missing native fieldset, legend, or radio structure");
      }
    } else if (control === "select") {
      if (!has(markup, "<select")) finding(findings, "Select control is missing from a select decision");
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
    if (!has(markup, "type=\"number\"")) finding(findings, "numeric entry is not a native number input");
    if (!/\bvalue="[^"]+"/u.test(markup)) finding(findings, "numeric fixture has no complete value attribute");
    if (has(markup, "tcrn-stepper") || has(markup, "tcrn-segmented-nav")) finding(findings, "workflow/navigation primitive was used as numeric entry");
    if (has(markup, "text-overflow:ellipsis") || attr(markup, "data-number-input-visibility") === "clipped") finding(findings, "numeric entry declares clipping");
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
    if (has(markup, "overflow:hidden") || has(markup, "data-settings-overflow-policy=\"clipped\"")) finding(findings, "settings layout hides content through overflow clipping");
    if (has(markup, "data-settings-layout-form-policy=\"two-host-columns\"")) finding(findings, "settings layout preserves parallel host columns");
  } else if (kind === "consumer-feature") {
    const applicable = attr(markup, "data-consumer-feature-applicable");
    const visible = attr(markup, "data-consumer-feature-visible");
    if (!(["true", "false"].includes(applicable ?? "") && ["true", "false"].includes(visible ?? ""))) {
      finding(findings, "consumer feature applicability is not explicit");
    } else if (applicable === "false" && visible === "true") {
      finding(findings, "consumer marked feature not applicable but left its entry visible");
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
      { value: "remote", label: "Remote", minInlineSize: 112 }
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
      { value: "deferred", label: "Deferred" }
    ],
    availableInlineSize: 720
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

export async function runDsConsumptionProof() {
  const fixtures = [
    { id: "valid-setting-choice", kind: "setting-choice", expected: "pass", markup: validSettingChoiceMarkup() },
    { id: "valid-multi-option-setting-choice", kind: "setting-choice", expected: "pass", markup: validMultiOptionSettingChoiceMarkup() },
    {
      id: "valid-number-input",
      kind: "number-input",
      expected: "pass",
      markup: validNumberInputMarkup()
    },
    { id: "valid-settings-layout", kind: "settings-layout", expected: "pass", markup: validSettingsLayoutMarkup() },
    {
      id: "valid-consumer-not-applicable",
      kind: "consumer-feature",
      expected: "pass",
      markup: '<div data-consumer-feature-applicable="false" data-consumer-feature-visible="false"></div>'
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
      id: "consumer-not-applicable-entry-visible",
      kind: "consumer-feature",
      expected: "reject",
      markup: '<button data-consumer-feature-applicable="false" data-consumer-feature-visible="true">Retired feature</button>'
    }
  ];
  const results = fixtures.map(({ markup, ...fixture }) => ({
    ...fixture,
    result: inspectDsConsumption({ kind: fixture.kind, markup })
  }));
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
