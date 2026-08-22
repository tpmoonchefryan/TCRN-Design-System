#!/usr/bin/env node
// TCRN-DS-STORY-100 — the release surface names are functional, not product-owned.

import { readFileSync } from "node:fs";

const GOVERNANCE_SOURCE = "apps/storybook/src/contract-stories/governance.ts";
const LOCALE_SOURCE = "apps/storybook/src/build/locales/storybook-locale-text.ts";

/** Product names and product-domain compounds are a maintained vocabulary. */
export const PUBLIC_NAME_TERMS = Object.freeze([
  "aos",
  "tms",
  "workflow",
  "work-management",
  "knowledge-management",
  "gate-management",
  "evidence-management"
]);

/** An empty register is still a live gate, just like the component generality gate. */
export const REGISTERED_PUBLIC_NAME_DEBT = Object.freeze([]);

function hasForbiddenTerm(value, terms = PUBLIC_NAME_TERMS) {
  const normalized = String(value).toLowerCase();
  return terms.find((term) => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
    return new RegExp(`(^|[^a-z0-9])${escaped}(?=$|[^a-z0-9])`, "iu").test(normalized);
  }) ?? null;
}

export function judgePublicNames({ categories = [], stories = [], localeLabels = [], debt = REGISTERED_PUBLIC_NAME_DEBT } = {}) {
  const candidates = [
    ...categories.map((entry) => ({ surface: "category", id: entry.id, value: entry.id })),
    ...categories.map((entry) => ({ surface: "category-label", id: entry.id, value: entry.label })),
    ...stories.map((entry) => ({ surface: "story", id: entry.id, value: entry.id })),
    ...localeLabels.map((entry) => ({ surface: "story-title", id: entry.id, locale: entry.locale, value: entry.value }))
  ];
  const violations = candidates.flatMap((candidate) => {
    const term = hasForbiddenTerm(candidate.value);
    return term ? [{ ...candidate, term }] : [];
  });
  const activeValues = new Set(candidates.map((candidate) => `${candidate.surface}:${candidate.id}:${candidate.value}`));
  const staleDebt = debt.filter((entry) => !activeValues.has(`${entry.surface}:${entry.id}:${entry.value}`));
  const ok = violations.length === 0 && staleDebt.length === 0 && Array.isArray(debt);
  return {
    schemaVersion: "tcrn.ds.public-naming-proof.v1",
    ok,
    terms: [...PUBLIC_NAME_TERMS],
    registeredDebt: debt.length,
    violations,
    staleDebt,
    checked: {
      categories: categories.length,
      stories: stories.length,
      localeLabels: localeLabels.length
    }
  };
}

function quotedValue(source, start, key) {
  const slice = source.slice(start, start + 240);
  return slice.match(new RegExp(`${key}:\\s*["']([^"']+)["']`, "u"))?.[1] ?? "";
}

export function readPublicNamingInputs({ governanceSource = readFileSync(GOVERNANCE_SOURCE, "utf8"), localeSource = readFileSync(LOCALE_SOURCE, "utf8") } = {}) {
  const categories = [...governanceSource.matchAll(/\{\s*id:\s*"([^"]+)",\s*label:\s*"([^"]+)"/gu)]
    .map((match) => ({ id: match[1], label: match[2] }));
  const stories = [...governanceSource.matchAll(/\{\s*id:\s*"([^"]+)",\s*group:\s*"(?:Welcome|Style Guide|Foundations|Components|Patterns|Proof|Change Log)"/gu)]
    .map((match) => ({ id: match[1] }));
  const knownStoryIds = new Set(stories.map((story) => story.id));
  const localeLabels = [...localeSource.matchAll(/"story\.([^".]+)\.title":\s*"([^"]*)"/gu)]
    .filter((match) => knownStoryIds.has(match[1]))
    .map((match) => ({ id: match[1], locale: "source", value: match[2] }));
  return { categories, stories, localeLabels };
}

if (process.argv[1]?.endsWith("public-naming-proof.mjs")) {
  const result = judgePublicNames(readPublicNamingInputs());
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!result.ok) process.exitCode = 1;
}
