#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
// TCRN-DS-INC-011 — every modifier a core component can emit has a definition.

import { readFileSync } from "node:fs";

const componentCssPath = "packages/ui-react/src/components/Navigation/Navigation.tsx";
const feedbackPath = "packages/ui-react/src/components/Feedback/Feedback.tsx";
const typographyPath = "packages/ui-react/src/components/Typography/Typography.tsx";
const css = readFileSync(componentCssPath, "utf8");
const feedback = readFileSync(feedbackPath, "utf8");
const typography = readFileSync(typographyPath, "utf8");

const expected = [
  ...["neutral", "positive", "warning", "danger"].map((tone) => ({ selector: `.tcrn-inline-alert--${tone}`, source: "InlineAlert tone" })),
  ...["neutral", "positive", "warning", "danger"].map((tone) => ({ selector: `.tcrn-state-view--${tone}`, source: "StateView tone" })),
  { selector: ".tcrn-heading--1", source: "Heading visualLevel" },
  { selector: ".tcrn-heading--2", source: "Heading visualLevel" },
  { selector: ".tcrn-heading--3", source: "Heading visualLevel" },
  { selector: ".tcrn-heading--4", source: "Heading visualLevel" }
];

const emittedFamilies = {
  inlineAlert: /`tcrn-inline-alert--\$\{tone\}`/.test(feedback),
  stateView: /`tcrn-state-view--\$\{presentation\.tone\}`/.test(feedback),
  heading: /`tcrn-heading--\$\{visualLevel\}`/.test(typography)
};
const missing = expected.filter(({ selector }) => !css.includes(selector));
const result = {
  schemaVersion: "tcrn.ds.component-modifier-proof.v1",
  ok: missing.length === 0,
  reasonCode: missing.length === 0 ? "COMPONENT_MODIFIERS_DEFINED" : "COMPONENT_MODIFIER_UNDEFINED",
  emittedFamilies,
  expected,
  missing
};
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
if (!result.ok) process.exitCode = 1;
