#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
// TCRN-DS-STORY-132 (TCRN-DS-SUB-036) — the contract static gate.
//
// Checks the package CSS against the machine-consumable contract clauses that a static read can
// decide: C2 (state rules do not out-rank the variant and write no colour), C5 (light and dark declare
// the same property set per selector; the themed token blocks declare the same token set), C6 (no
// left bar or inset x offset as the selection mark; no opaque fill together with a one-side edge),
// C7 (declared single-line roles carry nowrap, ellipsis and a clipping overflow), C8 (each declared
// toolbar has one yielding item with a min-width and fixed items that do not shrink), C11 (the
// forbidden list: gradients, blur over 3px, card in card, emoji icons, left bars) and C13 (the
// documentation layer renders no tcrn-* class that the package CSS lacks). Clause numbers and text
// follow docs/design/gplus-2026-10/boards/V2-Rejections.dc.html; docs/contract/clauses.md has them.
//
// Inputs: the package CSS is the tcrnComponentCss export of the built packages/ui-react/dist/index.js
// and the token sheet is the published `@tcrn/ui-tokens/tokens.css` export, so the gate does not depend
// on the package source layout. C13 takes the out-of-package class difference of
// scripts/doc-shell-class-proof.mjs (built static docs plus documentation sources).
//
// Scope: the first-batch families of docs/contract/families.json are checked in full; every other
// family is checked too unless docs/contract/exemptions.json carries an entry for that family (or
// class) and clause with a ruling reference. Classes that belong to no family are always checked.
// A selector is exempt only when every tcrn-* class in it is exempt; selectors without a tcrn-*
// class are always checked. There is no unconditional skip.
//
// Story-render checks (C7 title and wrapping, C8 measured yielding, C11 element nesting and emoji
// glyphs in rendered markup) belong to the story layer (TCRN-DS-SUB-037).
//
// Usage: node scripts/contract-static-proof.mjs [--details] [--report <path>]
//   Run from the repository root after `pnpm build`.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  blurRadii,
  colourLiterals,
  compareSpecificity,
  compounds,
  emojiIn,
  formatSpecificity,
  gradientFunctions,
  invisibleLayer,
  lengthPx,
  parseCompound,
  parseCss,
  selectorClasses,
  selectorList,
  shadowLayers,
  specificity,
  splitTopLevel,
  varReferences,
  withoutPseudoElements
} from "./lib/css-rules.mjs";

export const SCHEMA_VERSION = "tcrn.ds.contract-static-proof.v1";
export const CHECKED_CLAUSES = Object.freeze(["C2", "C5", "C6", "C7", "C8", "C11", "C13"]);
export const CLAUSE_TITLES = Object.freeze({
  C2: "状态规则不得越级",
  C5: "主题属性集同构",
  C6: "选中态结构规则",
  C7: "单行元素不折行",
  C8: "工具栏让步声明",
  C11: "禁用清单",
  C13: "一处真相（包外类）"
});
export const NOT_CHECKED_HERE = Object.freeze({
  C1: "rendered contrast matrix (contract proof)",
  C3: "rendered overflow (geometry measure)",
  C4: "rendered fixed-height overflow (geometry measure)",
  C9: "brand asset digests (brand-asset-source-proof)",
  C10: "shell geometry literals (geometry gates)",
  C12: "placement-to-component table (selection-grammar-proof)",
  C14: "met by this gate's own mutation tests (tests/contract-static-proof.test.mjs)",
  C15: "five-locale string sources (existing string-source gate)",
  C16: "rendered badge and collapsed-state text (geometry measure)",
  C17: "rendered guide-column relations (geometry measure)"
});

export const DEFAULT_PATHS = Object.freeze({
  packageDistEntry: "packages/ui-react/dist/index.js",
  tokensPackage: "packages/ui-tokens",
  tokensExport: "./tokens.css",
  families: "docs/contract/families.json",
  exemptions: "docs/contract/exemptions.json",
  roles: "docs/contract/roles.json",
  pairs: "docs/design/gplus-2026-10/contract/pairs.json"
});

export const VARIANT_SPECIFICITY = Object.freeze([0, 2, 0]);
const FALLBACK_SELECTED_PAIR_KEYS = Object.freeze(["s", "c", "cf", "cx"]);

const STATE_PSEUDOS = new Set(["hover", "active", "focus", "focus-visible", "focus-within", "disabled", "checked", "indeterminate", "invalid", "user-invalid", "read-only"]);
const STATE_ATTRIBUTES = new Set([
  "data-tcrn-preview-state", "readonly", "disabled", "aria-busy", "aria-checked", "aria-current", "aria-disabled", "aria-expanded",
  "aria-invalid", "aria-pressed", "aria-readonly", "aria-selected", "aria-sort"
]);
const SELECTED_ATTRIBUTES = new Map([
  ["aria-selected", (value) => value !== "false"],
  ["aria-current", (value) => value !== "false"],
  ["aria-pressed", (value) => value === null || value === "true" || value === "mixed"],
  ["aria-checked", (value) => value === null || value === "true" || value === "mixed"],
  ["data-selected", (value) => value !== "false"],
  ["data-current", (value) => value !== "false"],
  ["data-active", (value) => value !== "false"],
  ["data-state", (value) => ["active", "on", "checked", "selected"].includes(value ?? "")],
  ["data-tcrn-preview-state", (value) => value === "selected" || value === "checked"]
]);
const SELECTED_PSEUDOS = new Set(["checked", "indeterminate"]);
const SELECTED_CLASS = /^(?:on|is-selected|is-current|is-active|is-checked)$|--(?:selected|current|active|on|checked)$/u;

const COLOUR_PROPS = new Set([
  "color", "background-color", "border-color", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color",
  "border-block-color", "border-inline-color", "border-block-start-color", "border-block-end-color", "border-inline-start-color",
  "border-inline-end-color", "outline-color", "fill", "stroke", "caret-color", "accent-color", "text-decoration-color",
  "text-emphasis-color", "column-rule-color", "-webkit-text-fill-color", "-webkit-text-stroke-color", "stop-color", "flood-color",
  "lighting-color", "scrollbar-color"
]);
const COMPOSITE_COLOUR_PROPS = new Set([
  "background", "background-image", "border", "border-top", "border-right", "border-bottom", "border-left", "border-block", "border-inline",
  "border-block-start", "border-block-end", "border-inline-start", "border-inline-end", "outline", "box-shadow", "text-shadow",
  "text-decoration", "column-rule", "filter", "-webkit-text-stroke"
]);
const COLOUR_VAR = /^--tcrn-(?:color-|shadow-|focus-ring|elevation-|selection-|brand-accent-|brand-suffix-|glass)/u;
const PAIR_VAR = /^--tcrn-pair-/u;
const SHADOW_PROPS = new Set(["box-shadow", "text-shadow"]);
const LEFT_EDGE_PROPS = new Set(["border-left", "border-left-width", "border-inline-start", "border-inline-start-width"]);
const SIDE_EDGE = /^border-(?:top|right|bottom|left|block-start|block-end|inline-start|inline-end)(?:-width)?$/u;
const CARD_BLOCK = /^tcrn-(?:[-a-z0-9]+-)?card$/u;

const SHORTHAND_LONGHANDS = [
  ["border", /^border-(?:(?:top|right|bottom|left|block|inline)(?:-(?:start|end))?-)?(?:color|width|style)$|^border-(?:top|right|bottom|left|block|inline)(?:-(?:start|end))?$/u],
  ["background", /^background-/u],
  ["outline", /^outline-(?:color|width|style)$/u],
  ["font", /^font-(?:style|variant|weight|stretch|size|family)$|^line-height$/u],
  ["margin", /^margin-/u],
  ["padding", /^padding-/u],
  ["inset", /^(?:top|right|bottom|left)$|^inset-/u],
  ["text-decoration", /^text-decoration-/u],
  ["transition", /^transition-/u],
  ["animation", /^animation-/u],
  ["overflow", /^overflow-(?:x|y|block|inline)$/u],
  ["gap", /^(?:row|column)-gap$/u],
  ["flex", /^flex-(?:grow|shrink|basis)$/u]
];

// ---------------------------------------------------------------------------------------------
// Scope: families and exemptions

export function blockOf(className) {
  return className.replace(/__.*$/u, "").replace(/--.*$/u, "");
}

/** Validate the exemption file against the family registry; returns { entries, errors }. */
export function validateExemptions(exemptions, families) {
  const errors = [];
  const entries = [];
  const familyById = new Map((families?.families ?? []).map((family) => [family.id, family]));
  const scopeBatch = families?.scope?.batch;
  const scopedBlocks = new Set((families?.families ?? []).filter((family) => family.batch === scopeBatch).flatMap((family) => family.blocks));
  const seen = new Set();
  for (const [index, entry] of (Array.isArray(exemptions?.entries) ? exemptions.entries : []).entries()) {
    const where = entry?.id ?? `entries[${index}]`;
    const problems = [];
    if (typeof entry?.id !== "string" || !entry.id.trim()) problems.push("id missing");
    else if (seen.has(entry.id)) problems.push("id repeated");
    if (!Array.isArray(entry?.clauses) || entry.clauses.length === 0) problems.push("clauses must list clause ids");
    else for (const clause of entry.clauses) if (!CHECKED_CLAUSES.includes(clause)) problems.push(`clause ${clause} is not checked by this gate`);
    if (typeof entry?.ruling !== "string" || entry.ruling.trim().length < 12) problems.push("ruling reference missing");
    if (typeof entry?.reason !== "string" || !entry.reason.trim()) problems.push("reason missing");
    const hasFamily = typeof entry?.family === "string";
    const hasClasses = Array.isArray(entry?.classes) && entry.classes.length > 0;
    const hasSelectors = Array.isArray(entry?.selectors) && entry.selectors.length > 0;
    if ([hasFamily, hasClasses, hasSelectors].filter(Boolean).length !== 1) problems.push("exactly one of family, classes or selectors is required");
    if (hasSelectors) {
      for (const selector of entry.selectors) {
        if (typeof selector !== "string" || !selector.trim()) problems.push("selectors must be non-empty strings");
        else if (selectorClasses(selector, { targetOnly: true }).some((name) => scopedBlocks.has(blockOf(name)))) problems.push(`selector ${selector} targets a checked family`);
      }
    }
    if (hasFamily) {
      const family = familyById.get(entry.family);
      if (!family) problems.push(`family ${entry.family} is not in the family registry`);
      else if (family.batch === scopeBatch) problems.push(`family ${entry.family} is in the checked batch and cannot be exempted`);
    }
    if (hasClasses) {
      for (const className of entry.classes) {
        if (typeof className !== "string" || !/^tcrn-[-\w]+$/u.test(className)) problems.push(`class ${className} is not a tcrn-* class`);
        else if (scopedBlocks.has(blockOf(className))) problems.push(`class ${className} belongs to a checked family`);
      }
    }
    if (problems.length > 0) errors.push({ entry: where, problems });
    else {
      seen.add(entry.id);
      entries.push(entry);
    }
  }
  if (!Array.isArray(exemptions?.entries)) errors.push({ entry: "(file)", problems: ["entries array missing"] });
  return { entries, errors };
}

export function buildScope({ families, exemptions }) {
  const blockFamily = new Map();
  for (const family of families?.families ?? []) for (const block of family.blocks ?? []) blockFamily.set(block, family.id);
  for (const block of families?.utilities ?? []) blockFamily.set(block, "utility");
  const scopeBatch = families?.scope?.batch;
  const checkedFamilies = (families?.families ?? []).filter((family) => family.batch === scopeBatch).map((family) => family.id);
  const { entries, errors } = validateExemptions(exemptions, families);
  const byClause = new Map(CHECKED_CLAUSES.map((clause) => [clause, { families: new Map(), classes: new Map(), selectors: new Map() }]));
  for (const entry of entries) {
    for (const clause of entry.clauses) {
      const index = byClause.get(clause);
      if (entry.family) index.families.set(entry.family, entry);
      for (const className of entry.classes ?? []) index.classes.set(className, entry);
      for (const selector of entry.selectors ?? []) index.selectors.set(selector.trim().replace(/\s+/gu, " "), entry);
    }
  }
  const used = new Map(entries.map((entry) => [entry.id, 0]));
  const familyOf = (className) => blockFamily.get(blockOf(className)) ?? "unattributed";
  /**
   * { exempt: entry ids or null, families } for one finding: a selectors entry matching the selector
   * exactly, or else every tcrn-* class covered by a classes or family entry.
   */
  const resolveClasses = (clause, classNames, selector = null) => {
    const tcrn = [...new Set(classNames.filter((name) => name.startsWith("tcrn-")))];
    const familiesHere = [...new Set(tcrn.map(familyOf))].sort();
    const index = byClause.get(clause);
    const bySelector = selector ? index.selectors.get(String(selector).trim().replace(/\s+/gu, " ")) : null;
    if (bySelector) return { exempt: [bySelector.id], families: familiesHere.length > 0 ? familiesHere : ["(no tcrn class)"] };
    if (tcrn.length === 0) return { exempt: null, families: ["(no tcrn class)"] };
    const hits = [];
    for (const className of tcrn) {
      const entry = index.classes.get(className) ?? index.families.get(familyOf(className));
      if (!entry) return { exempt: null, families: familiesHere };
      hits.push(entry.id);
    }
    return { exempt: [...new Set(hits)].sort(), families: familiesHere };
  };
  return { checkedFamilies, scopeBatch, entries, errors, used, familyOf, resolveClasses };
}

// ---------------------------------------------------------------------------------------------
// Selector facts

function walkCompound(parsed, visit, negated = false) {
  visit(parsed, negated);
  for (const pseudo of parsed.pseudoClasses) {
    if (!pseudo.arg || !["where", "is", "matches", "not", "has"].includes(pseudo.name)) continue;
    const innerNegated = negated || pseudo.name === "not" || pseudo.name === "has";
    for (const inner of selectorList(pseudo.arg)) for (const part of compounds(inner)) walkCompound(parseCompound(part.text), visit, innerNegated);
  }
}

function compoundHas(parsed, test) {
  let found = false;
  walkCompound(parsed, (compound, negated) => {
    if (!negated && test(compound)) found = true;
  });
  return found;
}

const isState = (compound) =>
  compound.pseudoClasses.some((pseudo) => STATE_PSEUDOS.has(pseudo.name)) ||
  compound.attributes.some((attribute) => STATE_ATTRIBUTES.has(attribute.name));

const isSelected = (compound) =>
  compound.pseudoClasses.some((pseudo) => SELECTED_PSEUDOS.has(pseudo.name)) ||
  compound.attributes.some((attribute) => SELECTED_ATTRIBUTES.get(attribute.name)?.(attribute.value) === true) ||
  compound.classes.some((name) => SELECTED_CLASS.test(name));

const THEME_ATTRIBUTE = /\[\s*data-tcrn-theme\s*(?:=\s*["']?([-\w]+)["']?\s*)?\]/u;

/** Facts about one selector of one rule. */
export function selectorFacts(selector, atRules = []) {
  const parts = compounds(selector).map((part) => ({ ...part, parsed: parseCompound(part.text) }));
  let theme = null;
  const kept = [];
  for (const part of parts) {
    const match = THEME_ATTRIBUTE.exec(part.text);
    if (!match) {
      kept.push({ text: part.text, combinator: part.combinator });
      continue;
    }
    theme = (match[1] ?? "dark").toLowerCase();
    const rest = part.text.replace(THEME_ATTRIBUTE, "").replace(/:where\(\s*\)|:is\(\s*\)/gu, "").trim();
    if (rest && !/^(?:html|:root|\*)$/u.test(rest)) kept.push({ text: rest, combinator: part.combinator });
    else if (part === parts[parts.length - 1] && kept.length === 0) kept.push({ text: ":root", combinator: "" });
  }
  const mediaDark = atRules.some((rule) => /prefers-color-scheme\s*:\s*dark/iu.test(rule));
  const mediaLight = atRules.some((rule) => /prefers-color-scheme\s*:\s*light/iu.test(rule));
  if (!theme && mediaDark) theme = "dark";
  if (!theme && mediaLight) theme = "light";
  const baseSelector = kept.map((part, index) => (index === 0 ? part.text : `${part.combinator === " " ? " " : ` ${part.combinator} `}${part.text}`)).join("");
  const subject = parts[parts.length - 1]?.parsed ?? parseCompound("");
  const stateful = parts.filter((part) => compoundHas(part.parsed, isState));
  return {
    selector,
    parts,
    theme,
    baseSelector,
    baseAtRules: atRules.filter((rule) => !/prefers-color-scheme/iu.test(rule)),
    subject,
    hasState: stateful.length > 0,
    statefulCompound: stateful[stateful.length - 1]?.parsed ?? null,
    hasSelected: parts.some((part) => compoundHas(part.parsed, isSelected)),
    classes: selectorClasses(selector, { targetOnly: true }),
    compoundCount: parts.length
  };
}

// ---------------------------------------------------------------------------------------------
// Declaration facts

function onlyPairReads(value) {
  const refs = varReferences(value);
  return refs.length > 0 && refs.every((name) => PAIR_VAR.test(name)) && colourLiterals(value).length === 0;
}

/**
 * Why a declaration writes colour, or null. One allowance: an outline whose only colour is
 * `transparent` paints nothing; it is the forced-colours focus ring (the system recolours it there),
 * so it does not count as writing colour. Every other colour literal or colour token does.
 */
export function colourWrite(declaration) {
  const { prop, value } = declaration;
  const colourVars = varReferences(value).filter((name) => COLOUR_VAR.test(name));
  const literals = colourLiterals(value);
  if ((prop === "outline" || prop === "outline-color") && colourVars.length === 0 && literals.length > 0 && literals.every((word) => word.toLowerCase() === "transparent")) return null;
  if (prop.startsWith("--")) {
    if (PAIR_VAR.test(prop) && onlyPairReads(value)) return null;
    return literals.length > 0 || colourVars.length > 0 ? `${prop}: ${value}` : null;
  }
  if (COLOUR_PROPS.has(prop)) return onlyPairReads(value) ? null : `${prop}: ${value}`;
  if (COMPOSITE_COLOUR_PROPS.has(prop)) return literals.length > 0 || colourVars.length > 0 ? `${prop}: ${value}` : null;
  return null;
}

function transparentValue(value) {
  const text = String(value).trim().toLowerCase().replace(/\s+/gu, "");
  return text === "" || /^(?:transparent|none|#0000|#00000000|rgba\([^)]*,0\)|rgba\([^)]*\/0\)|initial|unset)$/u.test(text);
}

/** Width in px of a border shorthand or width value (null when no width can be read, 0 when none). */
function borderWidth(value) {
  const text = String(value).trim();
  if (/^(?:none|hidden|0)$/iu.test(text)) return 0;
  const tokens = splitTopLevel(text.replace(/\s+/gu, " "), " ").map((token) => token.trim()).filter(Boolean);
  if (tokens.some((token) => /^(?:none|hidden)$/iu.test(token))) return 0;
  if (tokens.some((token) => /^transparent$/iu.test(token))) return 0;
  for (const token of tokens) {
    const px = lengthPx(token);
    if (px !== null) return px;
    if (/^thin$/iu.test(token)) return 1;
    if (/^medium$/iu.test(token)) return 3;
    if (/^thick$/iu.test(token)) return 5;
  }
  return tokens.some((token) => /^(?:solid|dashed|dotted|double|groove|ridge|inset|outset)$/iu.test(token)) ? 3 : null;
}

function visibleShadowLayers(value) {
  const layers = shadowLayers(value);
  return layers ? layers.filter((layer) => !invisibleLayer(layer)) : [];
}

const oneSideInset = (layer) => layer.inset && layer.blur === 0 && layer.spread === 0 && (layer.x === 0) !== (layer.y === 0);

// ---------------------------------------------------------------------------------------------
// Clause checks. Each takes the parsed rules and the scope, and returns { findings, exempted }.

function collector(clause, scope) {
  const findings = [];
  const exempted = [];
  const add = (classNames, finding) => {
    const resolved = scope.resolveClasses(clause, classNames, finding.selector);
    const full = { clause, ...finding, families: resolved.families };
    if (resolved.exempt) {
      for (const id of resolved.exempt) scope.used.set(id, (scope.used.get(id) ?? 0) + 1);
      exempted.push({ ...full, exemptions: resolved.exempt });
    } else findings.push(full);
  };
  return { add, result: () => ({ findings, exempted }) };
}

const styleSelectors = (rules) =>
  rules.filter((rule) => rule.kind === "style").flatMap((rule) => rule.selectors.map((selector) => ({ rule, facts: selectorFacts(selector, rule.atRules) })));

const where = (rule) => ({ source: rule.source, line: rule.line });

/** Most permissive specificity a state rule may have per component class: the lowest variant specificity. */
export function variantThresholds(rules) {
  const thresholds = new Map();
  for (const { facts } of styleSelectors(rules)) {
    if (facts.compoundCount !== 1 || facts.hasState || facts.theme || facts.baseAtRules.length > 0) continue;
    const classes = facts.subject.classes;
    for (const base of classes) {
      if (!base.startsWith("tcrn-") || base.includes("--")) continue;
      if (!classes.some((name) => name.startsWith(`${base}--`))) continue;
      const s = specificity(facts.selector);
      const current = thresholds.get(base);
      if (!current || compareSpecificity(s, current) < 0) thresholds.set(base, s);
    }
  }
  return thresholds;
}

export function checkC2(rules, scope) {
  const { add, result } = collector("C2", scope);
  const thresholds = variantThresholds(rules);
  for (const { rule, facts } of styleSelectors(rules)) {
    if (!facts.hasState) continue;
    const componentClass =
      facts.subject.classes.find((name) => name.startsWith("tcrn-") && !name.includes("--")) ??
      facts.statefulCompound?.classes.find((name) => name.startsWith("tcrn-") && !name.includes("--")) ??
      null;
    const threshold = (componentClass && thresholds.get(componentClass)) || VARIANT_SPECIFICITY;
    const s = specificity(withoutPseudoElements(facts.selector));
    if (compareSpecificity(s, threshold) > 0) {
      add(facts.classes, {
        rule: "C2.specificity",
        selector: facts.selector,
        ...where(rule),
        detail: `state selector ${formatSpecificity(s)} out-ranks the variant ${formatSpecificity(threshold)}${componentClass ? ` of .${componentClass}` : ""}`
      });
    }
    const writes = rule.declarations.map(colourWrite).filter(Boolean);
    if (writes.length > 0) add(facts.classes, { rule: "C2.colour", selector: facts.selector, ...where(rule), detail: `state rule writes colour: ${writes.join("; ")}` });
  }
  return result();
}

function covered(prop, set) {
  if (set.has(prop)) return true;
  if (prop.startsWith("--")) return false;
  for (const [shorthand, longhands] of SHORTHAND_LONGHANDS) if (set.has(shorthand) && longhands.test(prop)) return true;
  const side = /^border-(?:top|right|bottom|left|block|inline)(?:-(?:start|end))?-(color|width|style)$/u.exec(prop);
  if (side && set.has(`border-${side[1]}`)) return true;
  return false;
}

export function checkC5(rules, scope) {
  const { add, result } = collector("C5", scope);
  const groups = new Map();
  for (const rule of rules.filter((candidate) => candidate.kind === "style")) {
    const marker = rule.comments.map((body) => /tcrn-token-block:\s*([-\w]+)/u.exec(body)?.[1]).find(Boolean) ?? null;
    if (marker === "theme-independent") continue;
    for (const selector of rule.selectors) {
      const facts = selectorFacts(selector, rule.atRules);
      const key = `${rule.source}\u0000${facts.baseAtRules.join(" | ")}\u0000${facts.baseSelector}`;
      let group = groups.get(key);
      if (!group) {
        group = { base: new Set(), light: new Set(), dark: new Set(), strict: false, classes: facts.classes, baseSelector: facts.baseSelector, rules: [], source: rule.source };
        groups.set(key, group);
      }
      const bucket = facts.theme === "dark" ? group.dark : facts.theme ? group.light : group.base;
      for (const declaration of rule.declarations) bucket.add(declaration.prop);
      if (marker === "theme") group.strict = true;
      group.rules.push({ rule, theme: facts.theme });
    }
  }
  for (const group of groups.values()) {
    if (group.dark.size === 0 && group.light.size === 0) continue;
    const lightAll = new Set([...group.base, ...group.light]);
    const darkAll = new Set([...group.base, ...group.dark]);
    const darkOnly = [...group.dark].filter((prop) => !covered(prop, lightAll));
    const lightOnly = group.strict ? [...lightAll].filter((prop) => !covered(prop, darkAll) || !group.dark.has(prop)) : [...group.light].filter((prop) => !covered(prop, darkAll));
    const darkRule = group.rules.find((entry) => entry.theme === "dark")?.rule ?? group.rules[0].rule;
    if (darkOnly.length > 0) add(group.classes, { rule: "C5.dark-only", selector: group.baseSelector, ...where(darkRule), detail: `dark declares what light does not: ${darkOnly.join(", ")}` });
    if (group.strict && group.dark.size > 0 && lightOnly.length > 0) add(group.classes, { rule: "C5.token-set", selector: group.baseSelector, ...where(darkRule), detail: `themed token block lacks a dark value: ${lightOnly.join(", ")}` });
    else if (!group.strict && lightOnly.length > 0) add(group.classes, { rule: "C5.light-only", selector: group.baseSelector, ...where(group.rules[0].rule), detail: `light declares what dark does not: ${lightOnly.join(", ")}` });
  }
  return result();
}

/** Pair keys whose state is a selection (selected, checked …), read from pairs.json. */
export function selectedPairKeys(pairs) {
  const keys = new Set();
  for (const table of Object.values(pairs?.tables ?? {})) for (const state of table.states ?? []) if (/^(?:selected|checked)/u.test(state.name ?? "")) keys.add(state.key);
  return keys.size > 0 ? [...keys].sort() : [...FALLBACK_SELECTED_PAIR_KEYS];
}

export function checkC6(rules, scope, { selectedKeys = FALLBACK_SELECTED_PAIR_KEYS } = {}) {
  const { add, result } = collector("C6", scope);
  for (const { rule, facts } of styleSelectors(rules)) {
    // Pair tuples: the selected-state values a variant declares.
    const tuples = new Map();
    for (const declaration of rule.declarations) {
      const match = /^--tcrn-pair-(fill|edge)-([a-z]+)$/u.exec(declaration.prop);
      if (!match || !selectedKeys.includes(match[2])) continue;
      const tuple = tuples.get(match[2]) ?? {};
      tuple[match[1]] = declaration.value;
      tuples.set(match[2], tuple);
    }
    for (const [key, tuple] of tuples) {
      const layers = visibleShadowLayers(tuple.edge ?? "");
      if (layers.some((layer) => layer.inset && layer.x !== 0)) {
        add(facts.classes, { rule: "C6.inset-x", selector: facts.selector, ...where(rule), detail: `selected pair ${key} edge is an inset x offset: ${tuple.edge}` });
      } else if (tuple.fill !== undefined && !transparentValue(tuple.fill) && layers.some(oneSideInset)) {
        add(facts.classes, { rule: "C6.fill-with-one-side-edge", selector: facts.selector, ...where(rule), detail: `selected pair ${key} has fill ${tuple.fill} and a one-side edge ${tuple.edge}` });
      }
    }
    if (!facts.hasSelected) continue;
    const problems = [];
    let fill = false;
    let oneSide = false;
    for (const declaration of rule.declarations) {
      const { prop, value } = declaration;
      if (LEFT_EDGE_PROPS.has(prop) && (borderWidth(value) ?? 1) > 0) problems.push({ rule: "C6.left-border", detail: `${prop}: ${value}` });
      if (prop === "box-shadow" || PAIR_VAR.test(prop)) {
        const layers = visibleShadowLayers(value);
        if (layers.some((layer) => layer.inset && layer.x !== 0)) problems.push({ rule: "C6.inset-x", detail: `${prop}: ${value}` });
        if (layers.some(oneSideInset)) oneSide = true;
      }
      if (SIDE_EDGE.test(prop) && (borderWidth(value) ?? 1) > 0) oneSide = true;
      if ((prop === "background" || prop === "background-color" || prop === "--tcrn-pair-fill") && !transparentValue(value)) fill = true;
    }
    const sidesAll = rule.declarations.some((declaration) => declaration.prop === "border" && (borderWidth(declaration.value) ?? 1) > 0);
    if (fill && oneSide && !sidesAll) problems.push({ rule: "C6.fill-with-one-side-edge", detail: "selected state has an opaque fill and a one-side edge" });
    for (const problem of problems) add(facts.classes, { ...problem, selector: facts.selector, ...where(rule) });
  }
  return result();
}

function baseDeclarations(rules, className) {
  const found = [];
  for (const { rule, facts } of styleSelectors(rules)) {
    if (!facts.subject.classes.includes(className) || facts.subject.pseudoElements.length > 0) continue;
    found.push({ rule, facts, base: !facts.hasState && !facts.theme && rule.atRules.length === 0 });
  }
  return found;
}

export function checkC7(rules, scope, roles) {
  const { add, result } = collector("C7", scope);
  for (const role of roles?.singleLine ?? []) {
    const hits = baseDeclarations(rules, role.class);
    const synthetic = { source: "docs/contract/roles.json", line: null };
    if (hits.length === 0) {
      add([role.class], { rule: "C7.role-missing", selector: `.${role.class}`, ...synthetic, detail: `${role.role}: the package CSS has no rule for .${role.class}` });
      continue;
    }
    const props = new Map();
    for (const hit of hits.filter((entry) => entry.base)) for (const declaration of hit.rule.declarations) props.set(declaration.prop, declaration.value.trim().toLowerCase());
    const nowrap = props.get("white-space") === "nowrap" || props.get("white-space") === "pre" || props.get("text-wrap") === "nowrap" || props.get("text-wrap-mode") === "nowrap";
    const ellipsis = props.get("text-overflow") === "ellipsis";
    const clip = ["overflow", "overflow-x", "overflow-inline"].some((prop) => ["hidden", "clip"].includes((props.get(prop) ?? "").split(/\s+/u)[0]));
    const missing = [!nowrap && "white-space: nowrap", !ellipsis && "text-overflow: ellipsis", !clip && "overflow: hidden"].filter(Boolean);
    const first = hits.find((entry) => entry.base) ?? hits[0];
    if (missing.length > 0) add([role.class], { rule: "C7.not-single-line", selector: `.${role.class}`, ...where(first.rule), detail: `${role.role}: missing ${missing.join(", ")}` });
    for (const hit of hits) {
      for (const declaration of hit.rule.declarations) {
        const value = declaration.value.trim().toLowerCase();
        const undo =
          (declaration.prop === "white-space" && ["normal", "pre-wrap", "pre-line", "break-spaces"].includes(value)) ||
          (declaration.prop === "text-wrap" && value === "wrap") ||
          (declaration.prop === "text-overflow" && value === "clip") ||
          (["overflow", "overflow-x", "overflow-inline"].includes(declaration.prop) && value === "visible");
        if (undo) add(hit.facts.classes, { rule: "C7.wrap-allowed", selector: hit.facts.selector, ...where(hit.rule), detail: `${role.role}: ${declaration.prop}: ${declaration.value}` });
      }
    }
  }
  return result();
}

function shrinkOf(declarations) {
  let shrink = null;
  for (const { prop, value } of declarations) {
    const text = value.trim().toLowerCase();
    if (prop === "flex-shrink") shrink = Number(text);
    if (prop === "flex") {
      if (text === "none") shrink = 0;
      else if (text === "auto" || text === "initial") shrink = text === "auto" ? 1 : 1;
      else {
        const numbers = text.split(/\s+/u).filter((token) => /^\d*\.?\d+$/u.test(token));
        shrink = numbers.length >= 2 ? Number(numbers[1]) : 1;
      }
    }
  }
  return shrink;
}

export function checkC8(rules, scope, roles) {
  const { add, result } = collector("C8", scope);
  for (const toolbar of roles?.toolbars ?? []) {
    const synthetic = { source: "docs/contract/roles.json", line: null };
    const containerHits = baseDeclarations(rules, toolbar.container);
    if (containerHits.length === 0) {
      add([toolbar.container], { rule: "C8.toolbar-missing", selector: `.${toolbar.container}`, ...synthetic, detail: `${toolbar.toolbar}: the package CSS has no rule for .${toolbar.container}` });
      continue;
    }
    if (typeof toolbar.yield !== "string" || !toolbar.yield) {
      add([toolbar.container], { rule: "C8.yield-undeclared", selector: `.${toolbar.container}`, ...synthetic, detail: `${toolbar.toolbar}: no single yielding item is declared` });
      continue;
    }
    const yieldDeclarations = baseDeclarations(rules, toolbar.yield).filter((hit) => hit.base).flatMap((hit) => hit.rule.declarations);
    const minWidth = yieldDeclarations.find((declaration) => ["min-width", "min-inline-size"].includes(declaration.prop));
    const minWidthPx = minWidth ? lengthPx(minWidth.value) : null;
    if (!minWidth || minWidthPx === 0 || /^(?:auto|0|initial|unset)$/iu.test(minWidth.value.trim())) {
      add([toolbar.yield, toolbar.container], { rule: "C8.yield-without-min-width", selector: `.${toolbar.yield}`, ...synthetic, detail: `${toolbar.toolbar}: the yielding item declares no min-width` });
    }
    if (shrinkOf(yieldDeclarations) === 0) {
      add([toolbar.yield, toolbar.container], { rule: "C8.yield-does-not-shrink", selector: `.${toolbar.yield}`, ...synthetic, detail: `${toolbar.toolbar}: the yielding item has flex-shrink 0` });
    }
    for (const fixed of toolbar.fixed ?? []) {
      const declarations = baseDeclarations(rules, fixed).filter((hit) => hit.base).flatMap((hit) => hit.rule.declarations);
      if (declarations.length === 0 || shrinkOf(declarations) !== 0) {
        add([fixed, toolbar.container], { rule: "C8.fixed-item-shrinks", selector: `.${fixed}`, ...synthetic, detail: `${toolbar.toolbar}: fixed item .${fixed} does not declare flex-shrink 0` });
      }
    }
  }
  return result();
}

function shadowBlurs(prop, value) {
  if (SHADOW_PROPS.has(prop) || prop.startsWith("--")) {
    const layers = shadowLayers(value);
    if (layers && (SHADOW_PROPS.has(prop) || layers.every((layer) => layer.colour))) return layers.filter((layer) => !invisibleLayer(layer) && layer.blur > 3);
  }
  return [];
}

export function checkC11(rules, scope) {
  const { add, result } = collector("C11", scope);
  for (const rule of rules) {
    const selectors = rule.kind === "style" ? rule.selectors.map((selector) => selectorFacts(selector, rule.atRules)) : [null];
    const problems = [];
    for (const declaration of rule.declarations) {
      const { prop, value } = declaration;
      for (const gradient of gradientFunctions(value)) problems.push({ rule: "C11.gradient", detail: `${prop}: ${gradient}(…)` });
      for (const blur of blurRadii(value)) if (blur.px === null || blur.px > 3) problems.push({ rule: "C11.blur", detail: `${prop}: ${blur.raw}` });
      const dropShadows = [...value.matchAll(/drop-shadow\(([^)]*(?:\([^)]*\)[^)]*)*)\)/giu)].map((match) => shadowLayers(match[1])?.[0]).filter(Boolean);
      for (const layer of [...shadowBlurs(prop, value), ...dropShadows.filter((layer) => layer.blur > 3)]) problems.push({ rule: "C11.cloud-shadow", detail: `${prop}: ${layer.raw} (blur ${layer.blur}px)` });
      for (const emoji of emojiIn(value)) problems.push({ rule: "C11.emoji-icon", detail: `${prop}: ${emoji}` });
      if (LEFT_EDGE_PROPS.has(prop) && (borderWidth(value) ?? 0) >= 2) problems.push({ rule: "C11.left-bar", detail: `${prop}: ${value}` });
      if (prop === "box-shadow" || PAIR_VAR.test(prop)) {
        for (const layer of visibleShadowLayers(value)) if (layer.inset && layer.x >= 2 && layer.y === 0 && layer.blur === 0) problems.push({ rule: "C11.left-bar", detail: `${prop}: ${layer.raw}` });
      }
    }
    for (const facts of selectors) {
      const classes = facts ? facts.classes : [];
      const label = facts ? facts.selector : rule.selectorText;
      for (const problem of problems) add(classes, { ...problem, selector: label, ...where(rule) });
      if (facts) {
        const cards = facts.parts.filter((part) => part.parsed.classes.some((name) => CARD_BLOCK.test(blockOf(name)) && !name.includes("__")));
        if (cards.length >= 2) add(classes, { rule: "C11.card-in-card", selector: facts.selector, ...where(rule), detail: "a card selector nested in a card selector" });
      }
    }
  }
  return result();
}

/** Out-of-package classes: tcrn-* classes used by the documentation layer that the package CSS lacks. */
export function outOfPackageClasses(usedClasses, packageRules) {
  const defined = new Set(packageRules.flatMap((rule) => rule.selectors.flatMap((selector) => selectorClasses(selector))));
  return [...new Set(usedClasses)].filter((name) => name.startsWith("tcrn-") && !name.startsWith("tcrn-doc-") && !defined.has(name)).sort();
}

export function checkC13(outOfPackage, scope, source = "scripts/doc-shell-class-proof.mjs#outOfPackage") {
  const { add, result } = collector("C13", scope);
  for (const className of outOfPackage ?? []) {
    if (className.startsWith("tcrn-doc-")) continue;
    add([className], { rule: "C13.out-of-package", selector: `.${className}`, source, line: null, detail: "rendered by the documentation layer, not defined by the package CSS" });
  }
  return result();
}

// ---------------------------------------------------------------------------------------------
// Evaluation and report

function summarise(clause, { findings, exempted }, details) {
  const byFamily = {};
  for (const finding of findings) for (const family of finding.families) byFamily[family] = (byFamily[family] ?? 0) + 1;
  const byRule = {};
  for (const finding of findings) byRule[finding.rule] = (byRule[finding.rule] ?? 0) + 1;
  const exemptedByEntry = {};
  for (const finding of exempted) for (const id of finding.exemptions) exemptedByEntry[id] = (exemptedByEntry[id] ?? 0) + 1;
  return {
    title: CLAUSE_TITLES[clause],
    status: findings.length === 0 ? "green" : "red",
    findingCount: findings.length,
    exemptedCount: exempted.length,
    byRule,
    byFamily,
    exemptedByEntry,
    findings,
    ...(details ? { exempted } : {})
  };
}

/**
 * Pure evaluation. packageCss and tokensCss are stylesheet strings; outOfPackage is the class difference
 * for C13 (null when it could not be computed, which is red).
 */
export function evaluateContract({ packageCss, tokensCss = "", families, exemptions, roles, pairs, outOfPackage, outOfPackageSource, details = false }) {
  const scope = buildScope({ families, exemptions });
  const packageParsed = parseCss(packageCss, { source: "packages/ui-react/dist/index.js#tcrnComponentCss" });
  const tokensParsed = parseCss(tokensCss, { source: "@tcrn/ui-tokens/tokens.css" });
  const packageRules = packageParsed.rules;
  const allRules = [...packageRules, ...tokensParsed.rules];
  const results = {
    C2: checkC2(packageRules, scope),
    C5: checkC5(allRules, scope),
    C6: checkC6(packageRules, scope, { selectedKeys: selectedPairKeys(pairs) }),
    C7: checkC7(packageRules, scope, roles),
    C8: checkC8(packageRules, scope, roles),
    C11: checkC11(packageRules, scope),
    C13: Array.isArray(outOfPackage)
      ? checkC13(outOfPackage, scope, outOfPackageSource)
      : { findings: [{ clause: "C13", rule: "C13.input-missing", selector: null, source: outOfPackageSource ?? null, line: null, families: [], detail: "the out-of-package class difference could not be computed" }], exempted: [] }
  };
  const clauses = Object.fromEntries(CHECKED_CLAUSES.map((clause) => [clause, summarise(clause, results[clause], details)]));
  const reasonCodes = [];
  if (packageParsed.errors.length + tokensParsed.errors.length > 0) reasonCodes.push("CONTRACT_STATIC_CSS_UNREADABLE");
  if (scope.errors.length > 0) reasonCodes.push("CONTRACT_STATIC_EXEMPTION_INVALID");
  for (const clause of CHECKED_CLAUSES) if (clauses[clause].status === "red") reasonCodes.push(`CONTRACT_STATIC_${clause}_RED`);
  const ok = reasonCodes.length === 0;
  return {
    schemaVersion: SCHEMA_VERSION,
    gate: "scripts/contract-static-proof.mjs",
    ok,
    reasonCode: ok ? "CONTRACT_STATIC_CLAUSES_HOLD" : reasonCodes[0],
    reasonCodes,
    summary: Object.fromEntries(CHECKED_CLAUSES.map((clause) => [clause, `${clauses[clause].status} (${clauses[clause].findingCount} findings, ${clauses[clause].exemptedCount} exempted)`])),
    inputs: {
      packageCss: { source: "packages/ui-react/dist/index.js#tcrnComponentCss", ruleCount: packageRules.length, parseErrors: packageParsed.errors },
      tokensCss: { source: "@tcrn/ui-tokens/tokens.css", ruleCount: tokensParsed.rules.length, parseErrors: tokensParsed.errors },
      outOfPackage: { source: outOfPackageSource ?? null, count: Array.isArray(outOfPackage) ? outOfPackage.length : null },
      selectedPairKeys: selectedPairKeys(pairs)
    },
    scope: {
      batch: scope.scopeBatch,
      checkedFamilies: scope.checkedFamilies,
      exemptionEntries: scope.entries.length,
      invalidExemptions: scope.errors,
      unusedExemptions: [...scope.used].filter(([, count]) => count === 0).map(([id]) => id)
    },
    clauses,
    notCheckedHere: NOT_CHECKED_HERE
  };
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

export async function loadPackageCss(root, paths = DEFAULT_PATHS) {
  const entry = resolve(root, paths.packageDistEntry);
  if (!existsSync(entry)) throw new Error(`${paths.packageDistEntry} is missing: run \`pnpm build\` first`);
  const module = await import(pathToFileURL(entry).href);
  if (typeof module.tcrnComponentCss !== "string" || module.tcrnComponentCss.length === 0) throw new Error(`${paths.packageDistEntry} does not export a non-empty tcrnComponentCss string`);
  return module.tcrnComponentCss;
}

/** The token sheet through the package's published export, not a source path. */
export function loadTokensCss(root, paths = DEFAULT_PATHS) {
  const packageRoot = join(root, paths.tokensPackage);
  const manifest = readJson(join(packageRoot, "package.json"));
  const target = manifest.exports?.[paths.tokensExport];
  const file = typeof target === "string" ? target : target?.default;
  if (typeof file !== "string") throw new Error(`${paths.tokensPackage}/package.json does not export ${paths.tokensExport}`);
  return { css: readFileSync(join(packageRoot, file), "utf8"), source: `@tcrn/ui-tokens/${paths.tokensExport.replace(/^\.\//u, "")}` };
}

export async function runContractStaticProof({ root = process.cwd(), paths = DEFAULT_PATHS, details = false, outOfPackage } = {}) {
  const packageCss = await loadPackageCss(root, paths);
  const tokens = loadTokensCss(root, paths);
  const families = readJson(join(root, paths.families));
  const exemptions = readJson(join(root, paths.exemptions));
  const roles = readJson(join(root, paths.roles));
  const pairs = existsSync(join(root, paths.pairs)) ? readJson(join(root, paths.pairs)) : null;
  let classes = outOfPackage;
  let outOfPackageSource = "scripts/doc-shell-class-proof.mjs#outOfPackage";
  if (classes === undefined) {
    try {
      const { runDocShellClassProof } = await import(pathToFileURL(join(root, "scripts/doc-shell-class-proof.mjs")).href);
      const docResult = await runDocShellClassProof({ root });
      classes = Array.isArray(docResult.outOfPackage) ? docResult.outOfPackage : null;
      if (!classes) outOfPackageSource += ` (unavailable: ${docResult.reasonCode ?? "no result"})`;
    } catch (error) {
      classes = null;
      outOfPackageSource += ` (unavailable: ${error.message})`;
    }
  }
  return evaluateContract({ packageCss, tokensCss: tokens.css, families, exemptions, roles, pairs, outOfPackage: classes, outOfPackageSource, details });
}

if (process.argv[1]?.endsWith("contract-static-proof.mjs")) {
  const args = process.argv.slice(2);
  const reportIndex = args.indexOf("--report");
  const result = await runContractStaticProof({ root: process.cwd(), details: args.includes("--details") });
  const text = `${JSON.stringify(result, null, 2)}\n`;
  if (reportIndex !== -1 && args[reportIndex + 1]) {
    const target = resolve(process.cwd(), args[reportIndex + 1]);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, text);
  }
  process.stdout.write(text);
  if (!result.ok) process.exitCode = 1;
}
