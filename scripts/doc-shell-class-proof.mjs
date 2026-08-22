#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
// TCRN-DS-INC-010 — template classes cannot silently fall back to browser defaults.

import { readFileSync } from "node:fs";

const templatePath = "apps/storybook/src/build/page-template.tsx";
const stylePaths = [
  "apps/storybook/src/alpha-styles.ts",
  "apps/storybook/src/storybook.css",
  "packages/ui-react/src/components/Navigation/Navigation.tsx"
];
const template = readFileSync(templatePath, "utf8");
const styles = stylePaths.map((path) => readFileSync(path, "utf8")).join("\n");
const classValues = [
  ...[...template.matchAll(/\bclass(?:Name)?=["']([^"']+)["']/gu)].map((match) => match[1]),
  ...[...template.matchAll(/iconHtml\([^,]+,\s*["']([^"']+)["']/gu)].map((match) => match[1])
];
const classes = [...new Set(classValues.flatMap((value) => value.match(/tcrn-[A-Za-z0-9_-]+/gu) ?? []))].sort();
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
const definitions = classes.filter((className) => new RegExp(`\\.${escapeRegExp(className)}(?:[^A-Za-z0-9_-]|$)`, "u").test(styles));
const missing = classes.filter((className) => !definitions.includes(className));
const result = {
  schemaVersion: "tcrn.ds.doc-shell-class-proof.v1",
  ok: missing.length === 0,
  reasonCode: missing.length === 0 ? "DOC_SHELL_CLASSES_DEFINED" : "DOC_SHELL_CLASS_UNDEFINED",
  template: templatePath,
  checkedClassCount: classes.length,
  missing,
  definitions
};
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
if (!result.ok) process.exitCode = 1;
