#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
// TCRN-DS-STORY-128 (TCRN-DS-SUB-024) — the documentation layer may only render package classes.
//
// The gate collects every tcrn-* class from the built static docs (apps/storybook/storybook-static:
// markup class attributes, <style> selectors, class writes and selector queries in inline and bundled
// scripts) and from the documentation-layer sources (apps/storybook/src and apps/storybook/.storybook:
// class contexts read from the TypeScript syntax tree, CSS selectors, markup inside strings). It then
// subtracts the classes that the package CSS defines. The package CSS is the tcrnComponentCss export of
// the built packages/ui-react/dist/index.js, so the gate does not depend on the package source layout.
// tcrn-doc-* is the documentation layer's own prefix and is exempt. The gate is green only when the
// difference is empty.
//
// Classes that the package's own compiled components write (a class literal, or a class template such as
// `tcrn-tree-nav--${density}`) are package classes even where tcrnComponentCss has no rule for them; they
// are reported as packageEmittedWithoutRule and are not counted. A class that a documentation source
// writes itself is always counted unless tcrnComponentCss defines it or the package writes the same
// literal. A package literal that reaches the markup through a class-named parameter of another package
// function (ShellDropdown hands "tcrn-shell-menu__cascade tcrn-shell-dropdown__col" to shellMenuCascades,
// whose third parameter is className) is a package literal as well (TCRN-DS-SUB-132); the documentation
// sources are still read without that parameter lookup.
//
// The TCRN-DS-INC-010 sub-check is kept: every class the page template writes must have a definition.
//
// Usage: node scripts/doc-shell-class-proof.mjs [--details] [--write-baseline]
//   Run from the repository root after `pnpm build` (the package dist and the static docs must exist).

import ts from "typescript";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative, sep } from "node:path";
import { pathToFileURL } from "node:url";

export const SCHEMA_VERSION = "tcrn.ds.doc-shell-class-proof.v2";
export const BASELINE_SCHEMA_VERSION = "tcrn.ds.doc-shell-class-baseline.v1";
export const DOC_CLASS_PREFIX = "tcrn-doc-";
export const DOC_CLASS_DISPOSITIONS = Object.freeze(["delete-package-provided", "rename-tcrn-doc", "delete-demo", "delete-dead"]);

export const DEFAULT_PATHS = Object.freeze({
  packageDistEntry: "packages/ui-react/dist/index.js",
  packageDistRoot: "packages/ui-react/dist",
  staticRoot: "apps/storybook/storybook-static",
  sourceRoots: Object.freeze(["apps/storybook/src", "apps/storybook/.storybook"]),
  templatePath: "apps/storybook/src/build/page-template.tsx",
  docCssSources: Object.freeze([
    "apps/storybook/src/alpha-styles.ts",
    "apps/storybook/src/story-demo-styles.ts",
    "apps/storybook/src/storybook.css"
  ]),
  referenceRoots: Object.freeze(["scripts", "tests"]),
  referenceExclude: Object.freeze(["scripts/doc-shell-class-proof.mjs", "tests/doc-shell-class-proof.test.mjs"]),
  baselinePath: "docs/verification/doc-shell-class/baseline.json",
  mapPath: "docs/design/gplus-2026-10/doc-class-map.json"
});

const PLACEHOLDER = "\u0000";
const MIN_TOKEN_LENGTH = "tcrn-".length + 1;
const TOKEN_PATTERN = /(?<![A-Za-z0-9_-])tcrn-[A-Za-z0-9_-]*/gu;
const CLASSLIST_METHODS = new Set(["add", "remove", "toggle", "replace", "contains"]);
const SELECTOR_METHODS = new Set(["querySelector", "querySelectorAll", "closest", "matches"]);
const CLASS_JOIN_CALLEES = new Set(["cx", "clsx", "classNames", "classnames", "cn", "joinClassNames", "joinClasses", "mergeClassNames"]);
const CLASS_CHAIN_METHODS = new Set(["join", "filter", "concat", "trim", "map", "flat"]);

const toPosix = (path) => path.split(sep).join("/");
const sortedUnique = (values) => [...new Set(values)].sort();
const locationKey = (where) => {
  const match = /^(.*):(\d+)$/u.exec(where);
  return match ? [match[1], Number(match[2])] : [where, 0];
};
const sortLocations = (values) =>
  [...new Set(values)].sort((left, right) => {
    const [leftPath, leftLine] = locationKey(left);
    const [rightPath, rightLine] = locationKey(right);
    return leftPath === rightPath ? leftLine - rightLine : leftPath < rightPath ? -1 : 1;
  });

function lineLocator(text) {
  const starts = [0];
  for (let index = 0; index < text.length; index += 1) if (text.charCodeAt(index) === 10) starts.push(index + 1);
  return (offset) => {
    let low = 0;
    let high = starts.length - 1;
    while (low < high) {
      const middle = (low + high + 1) >> 1;
      if (starts[middle] <= offset) low = middle;
      else high = middle - 1;
    }
    return low + 1;
  };
}

/**
 * Splits a class-list value into static class names and dynamic prefixes. A token that touches an
 * interpolation (the placeholder) or ends with a separator is a prefix, not a class name.
 */
export function classListTokens(text) {
  const found = [];
  for (const match of text.matchAll(TOKEN_PATTERN)) {
    const token = match[0];
    if (token.length < MIN_TOKEN_LENGTH) continue;
    const next = text[match.index + token.length];
    const prefix = next === PLACEHOLDER || /[-_]$/u.test(token);
    found.push({ token, index: match.index, prefix });
  }
  return found;
}

function blankComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//gu, (comment) => comment.replace(/[^\n]/gu, " "));
}

/** Class selectors in CSS text: only rule preludes (the text in front of `{`) are read. */
export function cssSelectorTokens(cssText) {
  const css = blankComments(cssText);
  const found = [];
  const collect = (prelude, offset) => {
    for (const match of prelude.matchAll(/\.(tcrn-[A-Za-z0-9_-]*)|\[class~?=\s*["']?(tcrn-[A-Za-z0-9_-]*)/gu)) {
      const token = match[1] ?? match[2];
      if (token.length < MIN_TOKEN_LENGTH) continue;
      const start = offset + match.index + match[0].length - token.length;
      const next = css[start + token.length];
      found.push({ token, index: start, prefix: next === PLACEHOLDER || /[-_]$/u.test(token) });
    }
  };
  let segmentStart = 0;
  for (let index = 0; index < css.length; index += 1) {
    const character = css[index];
    if (character === "{") {
      collect(css.slice(segmentStart, index), segmentStart);
      segmentStart = index + 1;
    } else if (character === "}" || character === ";") {
      segmentStart = index + 1;
    }
  }
  return found;
}

/** Classes in markup class attributes: class="…", class='…', class=\"…\" and className="…". */
export function markupClassTokens(text) {
  const found = [];
  for (const match of text.matchAll(/(?<![A-Za-z0-9_:.-])class(?:Name)?\s*=\s*(\\?["'])([\s\S]*?)\1/gu)) {
    const valueStart = match.index + match[0].length - match[1].length - match[2].length;
    for (const token of classListTokens(match[2])) found.push({ ...token, index: valueStart + token.index });
  }
  return found;
}

/** Class names in a selector string such as ".tcrn-doc-page, [data-x]". */
export function selectorTokens(value) {
  const found = [];
  for (const match of value.matchAll(/\.(tcrn-[A-Za-z0-9_-]*)/gu)) {
    const token = match[1];
    if (token.length < MIN_TOKEN_LENGTH) continue;
    const index = match.index + 1;
    found.push({ token, index, prefix: value[index + token.length] === PLACEHOLDER || /[-_]$/u.test(token) });
  }
  return found;
}

/** Class writes and selector queries inside JavaScript that is carried in a string. */
function scriptStringTokens(text) {
  const found = [];
  const push = (value, valueStart, selector) => {
    const tokens = selector ? selectorTokens(value) : classListTokens(value);
    for (const token of tokens) found.push({ ...token, index: valueStart + token.index });
  };
  const quoted = String.raw`(["'\x60])((?:(?!\1)[\s\S])*?)\1`;
  const patterns = [
    [new RegExp(String.raw`\.className\s*\+?=\s*${quoted}`, "gu"), false],
    [new RegExp(String.raw`classList\.(?:add|remove|toggle|replace|contains)\(\s*${quoted}`, "gu"), false],
    [new RegExp(String.raw`getElementsByClassName\(\s*${quoted}`, "gu"), false],
    [new RegExp(String.raw`setAttribute\(\s*["']class["']\s*,\s*${quoted}`, "gu"), false],
    [new RegExp(String.raw`(?:querySelectorAll|querySelector|closest|matches)\(\s*${quoted}`, "gu"), true]
  ];
  for (const [pattern, selector] of patterns) {
    for (const match of text.matchAll(pattern)) {
      const value = match[2];
      push(value, match.index + match[0].length - 1 - value.length, selector);
    }
  }
  return found;
}

function isClassLikeName(name) {
  return /^(?:class|className|classNames|classes)$/u.test(name) || /[a-z0-9](?:Class|ClassName|ClassNames|Classes)$/u.test(name);
}

function propertyNameText(name) {
  if (!name) return "";
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNoSubstitutionTemplateLiteral(name) || ts.isPrivateIdentifier(name)) return name.text;
  return "";
}

function functionNameOf(fn) {
  if ((ts.isFunctionDeclaration(fn) || ts.isFunctionExpression(fn) || ts.isMethodDeclaration(fn)) && fn.name) return propertyNameText(fn.name);
  const parent = fn.parent;
  if (parent && ts.isVariableDeclaration(parent) && ts.isIdentifier(parent.name)) return parent.name.text;
  if (parent && ts.isPropertyAssignment(parent)) return propertyNameText(parent.name);
  return "";
}

function isClassNameTarget(left) {
  if (ts.isPropertyAccessExpression(left)) return left.name.text === "className" || isClassLikeName(left.name.text);
  if (ts.isElementAccessExpression(left) && ts.isStringLiteralLike(left.argumentExpression)) return left.argumentExpression.text === "className";
  if (ts.isIdentifier(left)) return isClassLikeName(left.text);
  return false;
}

function calleeNames(callee) {
  if (ts.isIdentifier(callee)) return { name: callee.text, owner: "" };
  if (ts.isPropertyAccessExpression(callee)) {
    const owner = ts.isPropertyAccessExpression(callee.expression)
      ? callee.expression.name.text
      : ts.isIdentifier(callee.expression)
        ? callee.expression.text
        : "";
    return { name: callee.name.text, owner };
  }
  return { name: "", owner: "" };
}

/** Walks up from a string literal to decide whether its value is a class list or a selector. */
function literalContext(node) {
  let child = node;
  let parent = node.parent;
  while (parent) {
    if (ts.isJsxAttribute(parent)) return isClassLikeName(parent.name.getText()) ? "class" : null;
    if (
      ts.isJsxExpression(parent) ||
      ts.isParenthesizedExpression(parent) ||
      ts.isAsExpression(parent) ||
      ts.isSatisfiesExpression(parent) ||
      ts.isNonNullExpression(parent) ||
      ts.isTypeAssertionExpression(parent) ||
      ts.isTemplateSpan(parent) ||
      ts.isTemplateExpression(parent) ||
      ts.isArrayLiteralExpression(parent) ||
      ts.isSpreadElement(parent) ||
      ts.isObjectLiteralExpression(parent) ||
      ts.isConditionalExpression(parent)
    ) {
      child = parent;
      parent = parent.parent;
      continue;
    }
    if (ts.isBinaryExpression(parent)) {
      const operator = parent.operatorToken.kind;
      if ((operator === ts.SyntaxKind.EqualsToken || operator === ts.SyntaxKind.PlusEqualsToken) && child === parent.right) {
        return isClassNameTarget(parent.left) ? "class" : null;
      }
      if (
        operator === ts.SyntaxKind.AmpersandAmpersandToken ||
        operator === ts.SyntaxKind.BarBarToken ||
        operator === ts.SyntaxKind.QuestionQuestionToken ||
        operator === ts.SyntaxKind.PlusToken
      ) {
        child = parent;
        parent = parent.parent;
        continue;
      }
      return null;
    }
    if (ts.isPropertyAssignment(parent)) {
      if (child !== parent.initializer) return null;
      if (isClassLikeName(propertyNameText(parent.name))) return "class";
      child = parent;
      parent = parent.parent;
      continue;
    }
    if (ts.isVariableDeclaration(parent) || ts.isPropertyDeclaration(parent) || ts.isParameter(parent) || ts.isBindingElement(parent)) {
      if (child !== parent.initializer) return null;
      const name = ts.isBindingElement(parent) && parent.propertyName ? propertyNameText(parent.propertyName) : propertyNameText(parent.name);
      return isClassLikeName(name) ? "class" : null;
    }
    if (ts.isPropertyAccessExpression(parent)) {
      if (child === parent.expression && CLASS_CHAIN_METHODS.has(parent.name.text)) {
        child = parent;
        parent = parent.parent;
        continue;
      }
      return null;
    }
    if (ts.isCallExpression(parent)) {
      if (child === parent.expression) {
        child = parent;
        parent = parent.parent;
        continue;
      }
      const { name, owner } = calleeNames(parent.expression);
      if (owner === "classList" && CLASSLIST_METHODS.has(name)) return "class";
      if (name === "getElementsByClassName") return "class";
      if (name === "setAttribute") {
        const [first, second] = parent.arguments;
        return first && ts.isStringLiteralLike(first) && first.text === "class" && child === second ? "class" : null;
      }
      if (name === "iconHtml") return child === parent.arguments[1] ? "class" : null;
      if (SELECTOR_METHODS.has(name)) return "selector";
      if (CLASS_JOIN_CALLEES.has(name) || CLASS_CHAIN_METHODS.has(name)) {
        child = parent;
        parent = parent.parent;
        continue;
      }
      return null;
    }
    if (ts.isReturnStatement(parent)) {
      let scope = parent.parent;
      while (scope && !ts.isFunctionLike(scope)) scope = scope.parent;
      return scope && isClassLikeName(functionNameOf(scope)) ? "class" : null;
    }
    if (ts.isArrowFunction(parent) && child === parent.body) return isClassLikeName(functionNameOf(parent)) ? "class" : null;
    return null;
  }
  return null;
}

function scriptKindFor(fileName) {
  const extension = extname(fileName);
  if (extension === ".tsx") return ts.ScriptKind.TSX;
  if (extension === ".jsx") return ts.ScriptKind.JSX;
  if (extension === ".js" || extension === ".mjs" || extension === ".cjs") return ts.ScriptKind.JS;
  return ts.ScriptKind.TS;
}

/**
 * Class occurrences in TypeScript or JavaScript code. Each string literal (template literals are read
 * whole, with a placeholder where an interpolation sits) is read in its syntax context, and its text is
 * also read for markup class attributes, CSS rule preludes and class writes in embedded scripts.
 * Comments and JSX text are never read.
 */
export function codeClassOccurrences(text, fileName = "inline.js", lineOffset = 0, depth = 0) {
  const sourceFile = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true, scriptKindFor(fileName));
  const lineOf = lineLocator(text);
  const occurrences = [];
  const emit = (found, kind, locate) => {
    for (const entry of found) occurrences.push({ token: entry.token, prefix: entry.prefix, kind, line: lineOffset + locate(entry.index) });
  };
  const handleLiteral = (node, literalText, locate) => {
    const context = literalContext(node);
    if (context === "class") emit(classListTokens(literalText), "class-context", locate);
    if (context === "selector") emit(selectorTokens(literalText), "selector", locate);
    emit(markupClassTokens(literalText), "markup", locate);
    if (literalText.includes("{")) emit(cssSelectorTokens(literalText), "css", locate);
    if (depth < 2 && /<script\b/iu.test(literalText)) {
      for (const match of literalText.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/giu)) {
        const bodyStart = match.index + match[0].indexOf(">") + 1;
        // The interpolation placeholder stays in the embedded script: the parser skips it outside strings,
        // and inside strings it still marks a class name as a dynamic prefix.
        const nested = codeClassOccurrences(match[1], "embedded.js", locate(bodyStart) - 1, depth + 1);
        for (const entry of nested) occurrences.push({ ...entry, kind: entry.kind === "class-context" ? "script-class" : entry.kind === "selector" ? "script-selector" : entry.kind });
      }
    } else if (/classList|className|querySelector|closest\(|matches\(|getElementsByClassName|setAttribute/u.test(literalText)) {
      emit(scriptStringTokens(literalText), "script-string", locate);
    }
  };
  const visit = (node) => {
    if (ts.isTemplateExpression(node)) {
      const parts = [{ start: node.head.getStart(sourceFile) + 1, text: node.head.text }];
      for (const span of node.templateSpans) parts.push({ start: span.literal.getStart(sourceFile) + 1, text: span.literal.text });
      let combined = "";
      const offsets = [];
      parts.forEach((part, index) => {
        if (index > 0) combined += PLACEHOLDER;
        offsets.push({ combinedStart: combined.length, ...part });
        combined += part.text;
      });
      const locate = (index) => {
        let current = offsets[0];
        for (const entry of offsets) if (entry.combinedStart <= index) current = entry;
        const within = Math.max(0, index - current.combinedStart);
        const newlines = (current.text.slice(0, within).match(/\n/gu) ?? []).length;
        return lineOf(current.start) + newlines;
      };
      handleLiteral(node, combined, locate);
      for (const span of node.templateSpans) visit(span.expression);
      return;
    }
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      const start = node.getStart(sourceFile) + 1;
      const literalText = node.text;
      handleLiteral(node, literalText, (index) => lineOf(start) + (literalText.slice(0, index).match(/\n/gu) ?? []).length);
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return occurrences;
}

/** Class occurrences in a built HTML page: markup attributes, <style> selectors and <script> code. */
export function htmlClassOccurrences(html, cache = new Map()) {
  const occurrences = [];
  const blanked = html.replace(/<(style|script)\b([^>]*)>([\s\S]*?)<\/\1>/giu, (whole, tag, attributes, body) => {
    const key = `${tag}\u0001${attributes}\u0001${body}`;
    let found = cache.get(key);
    if (!found) {
      if (tag.toLowerCase() === "style") {
        const kind = /data-tcrn-static-doc-style-source/u.test(attributes) ? "doc-style" : "package-style";
        found = cssSelectorTokens(body).map((entry) => ({ token: entry.token, prefix: entry.prefix, kind }));
      } else if (/type\s*=\s*["']application\/(?:ld\+)?json["']/iu.test(attributes)) {
        found = [];
      } else {
        found = codeClassOccurrences(body, "inline.js").map((entry) => ({ ...entry, kind: `script:${entry.kind}` }));
      }
      cache.set(key, found);
    }
    occurrences.push(...found);
    return "";
  });
  for (const entry of markupClassTokens(blanked)) occurrences.push({ token: entry.token, prefix: entry.prefix, kind: "markup" });
  return occurrences;
}

function walkFiles(root, accept) {
  const out = [];
  if (!existsSync(root)) return out;
  const visit = (directory) => {
    for (const name of readdirSync(directory).sort()) {
      if (name === "node_modules") continue;
      const path = join(directory, name);
      const stats = statSync(path);
      if (stats.isDirectory()) visit(path);
      else if (accept(path)) out.push(path);
    }
  };
  visit(root);
  return out;
}

const isTestFile = (path) => /\.(?:test|spec)\.[cm]?[jt]sx?$/u.test(path) || /\.dom\.spec\./u.test(path);
const isSourceFile = (path) => /\.(?:[cm]?tsx?|css)$/u.test(path) && !path.endsWith(".d.ts") && !isTestFile(path);

/** Classes defined by the package CSS (rule preludes of tcrnComponentCss). */
export function packageCssClasses(css) {
  return new Set(cssSelectorTokens(css).filter((entry) => !entry.prefix).map((entry) => entry.token));
}

function functionParameterNames(node) {
  return node.parameters.map((parameter) => (ts.isIdentifier(parameter.name) ? parameter.name.text : ""));
}

/**
 * String literals the package passes as an argument whose parameter, in a function the package declares,
 * has a class-like name (className, columnClassName …). Functions are matched by name across the given
 * files, because the compiled modules import each other's helpers.
 */
export function classParameterArguments(files) {
  const parsed = files.map(({ path, text }) => ({ path, text, sourceFile: ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, scriptKindFor(path)) }));
  const classParameters = new Map();
  const declare = (name, fn) => {
    const positions = functionParameterNames(fn).flatMap((parameter, index) => (isClassLikeName(parameter) ? [index] : []));
    if (name && positions.length > 0) classParameters.set(name, positions);
  };
  for (const { sourceFile } of parsed) {
    const visit = (node) => {
      if (ts.isFunctionDeclaration(node) && node.name) declare(node.name.text, node);
      if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer && (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer))) {
        declare(node.name.text, node.initializer);
      }
      ts.forEachChild(node, visit);
    };
    visit(sourceFile);
  }
  const occurrences = [];
  for (const { path, text, sourceFile } of parsed) {
    const lineOf = lineLocator(text);
    const visit = (node) => {
      if (ts.isCallExpression(node)) {
        const { name } = calleeNames(node.expression);
        for (const index of classParameters.get(name) ?? []) {
          const argument = node.arguments[index];
          if (!argument || !(ts.isStringLiteral(argument) || ts.isNoSubstitutionTemplateLiteral(argument))) continue;
          const start = argument.getStart(sourceFile) + 1;
          for (const entry of classListTokens(argument.text)) occurrences.push({ token: entry.token, prefix: entry.prefix, kind: "class-argument", where: `${path}:${lineOf(start)}` });
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sourceFile);
  }
  return occurrences;
}

/** Class literals and class templates written by the package's compiled components. */
export function packageEmittedVocabulary(files) {
  const literals = new Set();
  const prefixes = new Set();
  for (const entry of classParameterArguments(files)) {
    if (!entry.prefix) literals.add(entry.token);
  }
  for (const { path, text } of files) {
    for (const entry of codeClassOccurrences(text, path)) {
      if (!["class-context", "markup", "script-string", "script-class"].includes(entry.kind)) continue;
      if (entry.prefix) {
        if (/(?:--|__)$/u.test(entry.token) && entry.token.length > MIN_TOKEN_LENGTH + 1) prefixes.add(entry.token);
      } else {
        literals.add(entry.token);
      }
    }
  }
  return { literals, prefixes: [...prefixes].sort() };
}

/**
 * The gate arithmetic. Every argument is plain data so the test can drive it without a build.
 *   packageClasses   Set of classes tcrnComponentCss defines
 *   packageEmitted   { literals: Set, prefixes: string[] } from the package's compiled components
 *   output           Map class -> { kinds:Set, pages:Set } from the built static docs
 *   sources          Map class -> { kinds:Set, locations:Set } from the documentation-layer sources
 */
export function computeOutOfPackage({ packageClasses, packageEmitted, output, sources }) {
  const outOfPackage = [];
  const packageEmittedWithoutRule = [];
  const exemptDocClasses = new Set();
  const all = sortedUnique([...output.keys(), ...sources.keys()]);
  for (const className of all) {
    if (className.startsWith(DOC_CLASS_PREFIX)) {
      exemptDocClasses.add(className);
      continue;
    }
    if (packageClasses.has(className)) continue;
    if (packageEmitted.literals.has(className)) {
      packageEmittedWithoutRule.push({ className, via: "literal" });
      continue;
    }
    if (!sources.has(className)) {
      const prefix = packageEmitted.prefixes.find((candidate) => className.startsWith(candidate) && className.length > candidate.length);
      if (prefix) {
        packageEmittedWithoutRule.push({ className, via: `template:${prefix}` });
        continue;
      }
    }
    outOfPackage.push(className);
  }
  return { outOfPackage, packageEmittedWithoutRule, exemptDocClasses: [...exemptDocClasses].sort() };
}

const SOURCE_DEFINITION_KINDS = new Set(["css"]);

function addOccurrence(map, className, kind, where, field) {
  let entry = map.get(className);
  if (!entry) {
    entry = { kinds: new Set(), [field]: new Set() };
    map.set(className, entry);
  }
  entry.kinds.add(kind);
  entry[field].add(where);
}

/** The original TCRN-DS-INC-010 check, reading definitions from the built package CSS and the doc CSS. */
export function templateClassCheck({ templatePath, templateText, styleText }) {
  const classValues = [
    ...[...templateText.matchAll(/\bclass(?:Name)?=["']([^"']+)["']/gu)].map((match) => match[1]),
    ...[...templateText.matchAll(/iconHtml\([^,]+,\s*["']([^"']+)["']/gu)].map((match) => match[1])
  ];
  const classes = sortedUnique(classValues.flatMap((value) => value.match(/tcrn-[A-Za-z0-9_-]+/gu) ?? []));
  const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  const missing = classes.filter((className) => !new RegExp(`\\.${escapeRegExp(className)}(?:[^A-Za-z0-9_-]|$)`, "u").test(styleText));
  return {
    ok: missing.length === 0,
    reasonCode: missing.length === 0 ? "DOC_SHELL_CLASSES_DEFINED" : "DOC_SHELL_CLASS_UNDEFINED",
    template: templatePath,
    checkedClassCount: classes.length,
    missing
  };
}

function readJsonIfPresent(path) {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    return { parseError: String(error.message ?? error) };
  }
}

async function loadPackageCss(entryPath) {
  const module = await import(pathToFileURL(entryPath).href);
  if (typeof module.tcrnComponentCss !== "string" || module.tcrnComponentCss.length === 0) {
    throw new Error(`${entryPath} does not export a non-empty tcrnComponentCss string`);
  }
  return module.tcrnComponentCss;
}

/** Runs the whole gate against a repository root. */
export async function runDocShellClassProof({ root = process.cwd(), paths = DEFAULT_PATHS } = {}) {
  const rel = (path) => toPosix(relative(root, path));
  const reasonCodes = [];
  const entryPath = join(root, paths.packageDistEntry);
  const staticRoot = join(root, paths.staticRoot);
  let packageCss = "";
  if (!existsSync(entryPath)) {
    reasonCodes.push("DOC_SHELL_PACKAGE_DIST_MISSING");
  } else {
    try {
      packageCss = await loadPackageCss(entryPath);
    } catch {
      reasonCodes.push("DOC_SHELL_PACKAGE_DIST_MISSING");
    }
  }
  const pages = walkFiles(staticRoot, (path) => path.endsWith(".html"));
  const bundles = walkFiles(staticRoot, (path) => /\.m?js$/u.test(path));
  if (pages.length === 0) reasonCodes.push("DOC_SHELL_STATIC_OUTPUT_MISSING");
  if (reasonCodes.length > 0) {
    return {
      schemaVersion: SCHEMA_VERSION,
      ok: false,
      reasonCode: reasonCodes[0],
      reasonCodes,
      hint: "Run `pnpm build` first: the gate reads packages/ui-react/dist and apps/storybook/storybook-static."
    };
  }

  const packageClasses = packageCssClasses(packageCss);
  const distFiles = walkFiles(join(root, paths.packageDistRoot), (path) => /\.m?js$/u.test(path) && !isTestFile(path) && !toPosix(path).includes("/test/"))
    .map((path) => ({ path: rel(path), text: readFileSync(path, "utf8") }));
  const packageEmitted = packageEmittedVocabulary(distFiles);

  // Built static docs.
  const output = new Map();
  const outputDefinitions = new Map();
  const cache = new Map();
  for (const page of pages) {
    const name = rel(page).slice(toPosix(paths.staticRoot).length + 1);
    for (const entry of htmlClassOccurrences(readFileSync(page, "utf8"), cache)) {
      if (entry.prefix) continue;
      if (entry.kind === "doc-style") addOccurrence(outputDefinitions, entry.token, entry.kind, name, "pages");
      else addOccurrence(output, entry.token, entry.kind, name, "pages");
    }
  }
  for (const bundle of bundles) {
    const name = rel(bundle).slice(toPosix(paths.staticRoot).length + 1);
    for (const entry of codeClassOccurrences(readFileSync(bundle, "utf8"), bundle)) {
      if (entry.prefix) continue;
      addOccurrence(output, entry.token, `bundle:${entry.kind}`, name, "pages");
    }
  }
  for (const [className, entry] of outputDefinitions) {
    for (const kind of entry.kinds) addOccurrence(output, className, kind, "(doc style block)", "pages");
  }

  // Documentation-layer sources.
  const sources = new Map();
  const sourceDefinitions = new Map();
  const sourceUses = new Map();
  const dynamicPrefixes = new Map();
  const sourceFiles = paths.sourceRoots.flatMap((sourceRoot) => walkFiles(join(root, sourceRoot), isSourceFile));
  for (const file of sourceFiles) {
    const path = rel(file);
    const text = readFileSync(file, "utf8");
    const found = path.endsWith(".css")
      ? (() => {
          const lineOf = lineLocator(text);
          return cssSelectorTokens(text).map((entry) => ({ token: entry.token, prefix: entry.prefix, kind: "css", line: lineOf(entry.index) }));
        })()
      : codeClassOccurrences(text, path);
    for (const entry of found) {
      const where = `${path}:${entry.line}`;
      if (entry.prefix) {
        if (!entry.token.startsWith(DOC_CLASS_PREFIX)) addOccurrence(dynamicPrefixes, entry.token, entry.kind, where, "locations");
        continue;
      }
      addOccurrence(SOURCE_DEFINITION_KINDS.has(entry.kind) ? sourceDefinitions : sourceUses, entry.token, entry.kind, where, "locations");
      addOccurrence(sources, entry.token, entry.kind, where, "locations");
    }
  }

  const { outOfPackage, packageEmittedWithoutRule, exemptDocClasses } = computeOutOfPackage({ packageClasses, packageEmitted, output, sources });

  // References from proofs and tests, so a rename or a delete can update them in the same change.
  const referenceFiles = paths.referenceRoots
    .flatMap((referenceRoot) => walkFiles(join(root, referenceRoot), (path) => /\.(?:mjs|cjs|js|ts|json)$/u.test(path)))
    .concat(walkFiles(join(root, "apps/storybook/src"), (path) => isTestFile(path)))
    .filter((path) => !paths.referenceExclude.includes(rel(path)));
  const references = new Map();
  if (outOfPackage.length > 0) {
    const wanted = new Set(outOfPackage);
    for (const file of referenceFiles) {
      const text = readFileSync(file, "utf8");
      const lineOf = lineLocator(text);
      for (const match of text.matchAll(TOKEN_PATTERN)) {
        if (!wanted.has(match[0])) continue;
        addOccurrence(references, match[0], "reference", `${rel(file)}:${lineOf(match.index)}`, "locations");
      }
    }
  }

  const details = outOfPackage.map((className) => {
    const out = output.get(className);
    const src = sources.get(className);
    const pagesFor = out ? [...out.pages].filter((page) => page !== "(doc style block)").sort() : [];
    return {
      className,
      definedIn: sortLocations(sourceDefinitions.get(className)?.locations ?? []),
      usedIn: sortLocations(sourceUses.get(className)?.locations ?? []),
      sourceKinds: src ? [...src.kinds].sort() : [],
      outputKinds: out ? [...out.kinds].sort() : [],
      renderedPageCount: pagesFor.length,
      renderedPages: pagesFor.slice(0, 3),
      references: sortLocations(references.get(className)?.locations ?? [])
    };
  });

  const docStyleSource = paths.docCssSources.map((path) => (existsSync(join(root, path)) ? readFileSync(join(root, path), "utf8") : "")).join("\n");
  const templateFile = join(root, paths.templatePath);
  const template = existsSync(templateFile)
    ? templateClassCheck({ templatePath: paths.templatePath, templateText: readFileSync(templateFile, "utf8"), styleText: `${packageCss}\n${docStyleSource}` })
    : { ok: false, reasonCode: "DOC_SHELL_TEMPLATE_MISSING", template: paths.templatePath, checkedClassCount: 0, missing: [] };

  const baseline = readJsonIfPresent(join(root, paths.baselinePath));
  const baselineClasses = Array.isArray(baseline?.outOfPackage) ? baseline.outOfPackage.map((entry) => (typeof entry === "string" ? entry : entry.className)) : null;
  const map = readJsonIfPresent(join(root, paths.mapPath));
  const mapEntries = map && map.classes && typeof map.classes === "object" ? map.classes : null;

  if (outOfPackage.length > 0) reasonCodes.push("DOC_SHELL_OUT_OF_PACKAGE_CLASSES");
  if (!template.ok) reasonCodes.push(template.reasonCode);
  const ok = reasonCodes.length === 0;
  return {
    schemaVersion: SCHEMA_VERSION,
    ok,
    reasonCode: ok ? "DOC_SHELL_CLASSES_PACKAGE_BACKED" : reasonCodes[0],
    reasonCodes,
    packageCss: { source: `${paths.packageDistEntry}#tcrnComponentCss`, definedClassCount: packageClasses.size },
    scanned: {
      staticRoot: paths.staticRoot,
      pageCount: pages.length,
      bundleCount: bundles.length,
      sourceRoots: [...paths.sourceRoots],
      sourceFileCount: sourceFiles.length
    },
    outOfPackageCount: outOfPackage.length,
    outOfPackage,
    exemptDocClassCount: exemptDocClasses.length,
    packageEmittedWithoutRuleCount: packageEmittedWithoutRule.length,
    packageEmittedWithoutRule,
    docDynamicPrefixes: [...dynamicPrefixes.keys()].sort(),
    baseline: baselineClasses
      ? {
          path: paths.baselinePath,
          count: baselineClasses.length,
          newSinceBaseline: outOfPackage.filter((className) => !baselineClasses.includes(className)),
          clearedSinceBaseline: baselineClasses.filter((className) => !outOfPackage.includes(className))
        }
      : { path: paths.baselinePath, present: false },
    classMap: mapEntries
      ? { path: paths.mapPath, entryCount: Object.keys(mapEntries).length, unmapped: outOfPackage.filter((className) => !(className in mapEntries)) }
      : { path: paths.mapPath, present: false },
    templateClassCheck: template,
    details
  };
}

function baselineDocument(result) {
  return {
    schemaVersion: BASELINE_SCHEMA_VERSION,
    gate: "scripts/doc-shell-class-proof.mjs",
    gateSchemaVersion: result.schemaVersion,
    purpose:
      "First run of the out-of-package class gate (TCRN-DS-SUB-024): every tcrn-* class that the built static docs or the documentation-layer sources use and tcrnComponentCss does not define. SUB-025/026/027 clear it to zero; docs/design/gplus-2026-10/doc-class-map.json gives each class its disposition.",
    ok: result.ok,
    reasonCodes: result.reasonCodes,
    packageCss: result.packageCss,
    scanned: result.scanned,
    outOfPackageCount: result.outOfPackageCount,
    exemptDocClassCount: result.exemptDocClassCount,
    packageEmittedWithoutRuleCount: result.packageEmittedWithoutRuleCount,
    packageEmittedWithoutRule: result.packageEmittedWithoutRule,
    docDynamicPrefixes: result.docDynamicPrefixes,
    templateClassCheck: result.templateClassCheck,
    outOfPackage: result.outOfPackage,
    classSummary: Object.fromEntries(
      result.details.map((detail) => [
        detail.className,
        {
          sourceKinds: detail.sourceKinds,
          outputKinds: detail.outputKinds,
          definitions: detail.definedIn.length,
          uses: detail.usedIn.length,
          renderedPages: detail.renderedPageCount,
          references: detail.references.length
        }
      ])
    ),
    locations: "Definition, use and reference locations per class are in docs/design/gplus-2026-10/doc-class-map.json (same run)."
  };
}

/** JSON with the top two levels expanded and everything deeper on one line, so a class reads as one line. */
export function stringifyCompact(value, depth = 0, inlineFrom = 2) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (depth >= inlineFrom) return JSON.stringify(value);
  const pad = "  ".repeat(depth + 1);
  const close = "  ".repeat(depth);
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    if (value.every((item) => item === null || typeof item !== "object")) return `[${value.map((item) => JSON.stringify(item)).join(", ")}]`;
    return `[\n${value.map((item) => `${pad}${stringifyCompact(item, depth + 1, inlineFrom)}`).join(",\n")}\n${close}]`;
  }
  const entries = Object.entries(value).filter(([, item]) => item !== undefined);
  if (entries.length === 0) return "{}";
  return `{\n${entries.map(([key, item]) => `${pad}${JSON.stringify(key)}: ${stringifyCompact(item, depth + 1, inlineFrom)}`).join(",\n")}\n${close}}`;
}

if (process.argv[1]?.endsWith("doc-shell-class-proof.mjs")) {
  const root = process.cwd();
  const args = new Set(process.argv.slice(2));
  const result = await runDocShellClassProof({ root });
  if (args.has("--write-baseline") && Array.isArray(result.details)) {
    const target = join(root, DEFAULT_PATHS.baselinePath);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, `${stringifyCompact(baselineDocument(result))}\n`);
  }
  const printed = args.has("--details") ? result : { ...result, details: undefined };
  process.stdout.write(`${JSON.stringify(printed, null, 2)}\n`);
  if (!result.ok) process.exitCode = 1;
}
