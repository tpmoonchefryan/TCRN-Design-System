#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
// TCRN-DS-STORY-101 — the generality rule, made machine-decidable from props.

import ts from "typescript";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const COMPONENT_ROOT = join(REPO_ROOT, "packages/ui-react/src/components");

/**
 * These prefixes remain useful as a naming smell, but they are not the rule.
 * A component belongs in core or outside it according to the entities its props
 * carry, not according to the name somebody happened to give it.
 */
export const DOMAIN_PREFIXES = Object.freeze(["Work", "Knowledge", "Gate", "Evidence"]);

/** The domain debt is deliberately empty: an empty register is still a live gate. */
export const REGISTERED_DOMAIN_DEBT = Object.freeze([]);

function sourceFiles(root) {
  const found = [];
  const walk = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(path);
        continue;
      }
      if (!entry.name.endsWith(".tsx") && !entry.name.endsWith(".ts")) continue;
      if (entry.name.includes(".test.")) continue;
      found.push(path);
    }
  };
  walk(root);
  return found.sort();
}

function isDomainPrefixName(name) {
  return DOMAIN_PREFIXES.some((prefix) => name.startsWith(prefix) && /^[A-Z]/u.test(name.slice(prefix.length)));
}

function nodeText(node, sourceFile) {
  return node ? node.getText(sourceFile) : "";
}

function declarationBody(declaration) {
  if (ts.isInterfaceDeclaration(declaration)) return declaration.members;
  if (ts.isTypeAliasDeclaration(declaration)) return declaration.type;
  return declaration;
}

function declarationName(declaration) {
  return declaration.name?.text ?? "";
}

function collectDeclarations(sourceFile) {
  const declarations = new Map();
  for (const statement of sourceFile.statements) {
    if (ts.isInterfaceDeclaration(statement) || ts.isTypeAliasDeclaration(statement)) {
      declarations.set(declarationName(statement), statement);
    }
  }
  return declarations;
}

function typeReferences(node, sourceFile) {
  const references = new Set();
  if (!node) return references;
  const visit = (current) => {
    if (Array.isArray(current)) {
      current.forEach(visit);
      return;
    }
    if (ts.isIdentifier(current)) references.add(current.text);
    ts.forEachChild(current, visit);
  };
  visit(node);
  return references;
}

function propertyNames(node, sourceFile) {
  const names = new Set();
  if (!node) return names;
  const visit = (current) => {
    if (Array.isArray(current)) {
      current.forEach(visit);
      return;
    }
    if (ts.isPropertySignature(current) && current.name) {
      names.add(nodeText(current.name, sourceFile).replace(/["']/gu, ""));
    }
    ts.forEachChild(current, visit);
  };
  visit(node);
  return names;
}

function looksLikeEntityProperty(name) {
  return /^(?:work|knowledge|gate|evidence)[A-Z_]/u.test(name);
}

function resolveDomainReferences(node, declarations, sourceFile, seen = new Set()) {
  const evidence = new Set();
  if (!node) return evidence;
  for (const name of typeReferences(node, sourceFile)) {
    const declaration = declarations.get(name);
    if (!declaration) {
      if (isDomainPrefixName(name)) evidence.add(name);
      continue;
    }
    if (seen.has(name)) continue;
    seen.add(name);
    // Props wrappers are not entities merely because somebody prefixed the
    // wrapper. Inspect their fields and referenced types instead.
    if (isDomainPrefixName(name) && !/(?:Props|Options|Attributes)$/u.test(name)) {
      evidence.add(name);
    }
    for (const nested of resolveDomainReferences(declarationBody(declaration), declarations, sourceFile, seen)) {
      evidence.add(nested);
    }
  }
  for (const name of propertyNames(node, sourceFile)) {
    if (looksLikeEntityProperty(name)) evidence.add(name);
  }
  return evidence;
}

function exportedFunctions(sourceFile) {
  return sourceFile.statements.filter((statement) => {
    if (!ts.isFunctionDeclaration(statement) || !statement.name) return false;
    return statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword);
  });
}

function inspectComponents(root = COMPONENT_ROOT, read = readFileSync) {
  const substantive = new Map();
  const hints = new Map();
  for (const path of sourceFiles(root)) {
    const text = String(read(path, "utf8"));
    const sourceFile = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, path.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    const declarations = collectDeclarations(sourceFile);
    for (const functionDeclaration of exportedFunctions(sourceFile)) {
      const name = functionDeclaration.name.text;
      const parameter = functionDeclaration.parameters[0];
      const propsNode = parameter?.type;
      const evidence = resolveDomainReferences(propsNode, declarations, sourceFile);
      const file = path.slice(REPO_ROOT.length + 1);
      const metadata = { file, props: nodeText(propsNode, sourceFile), evidence: [...evidence].sort() };
      if (evidence.size > 0) substantive.set(name, metadata);
      if (isDomainPrefixName(name) && evidence.size === 0) hints.set(name, metadata);
    }
  }
  return { substantive, hints };
}

/** Exported components whose props name or carry a product business entity. */
export function domainComponents(root = COMPONENT_ROOT, read = readFileSync) {
  return inspectComponents(root, read).substantive;
}

/** Prefix hits that are only naming smells, never domain admissions. */
export function domainNameHints(root = COMPONENT_ROOT, read = readFileSync) {
  return inspectComponents(root, read).hints;
}

function metadataFile(value) {
  return typeof value === "string" ? value : value?.file ?? "unknown";
}

function metadataEvidence(value, name) {
  if (typeof value === "string") return [name];
  return value?.evidence?.length ? value.evidence : [name];
}

export function judgeGenericPrimitives(found = domainComponents(), hints = domainNameHints()) {
  const registered = new Set(REGISTERED_DOMAIN_DEBT);
  const admitted = [...found.keys()].filter((name) => !registered.has(name)).sort();
  const extracted = [...registered].filter((name) => !found.has(name)).sort();
  const nameHints = [...hints.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([name, value]) => ({ name, file: metadataFile(value) }));
  return {
    schemaVersion: "tcrn.ds.generic-primitive-scan.v2",
    ok: admitted.length === 0,
    reasonCode: admitted.length === 0 ? "GENERIC_PRIMITIVE_RULE_HELD" : "DOMAIN_COMPONENT_ADMITTED",
    prefixes: [...DOMAIN_PREFIXES],
    registeredDebt: REGISTERED_DOMAIN_DEBT.length,
    present: found.size,
    admitted: admitted.map((name) => ({ name, file: metadataFile(found.get(name)), evidence: metadataEvidence(found.get(name), name) })),
    extracted,
    nameHints
  };
}

if (process.argv[1]?.endsWith("generic-primitive-scan.mjs")) {
  const result = judgeGenericPrimitives();
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  for (const entry of result.nameHints) {
    process.stderr.write(`  DOMAIN NAME HINT: ${entry.name} (${entry.file}); props are generic\n`);
  }
  for (const entry of result.admitted) {
    process.stderr.write(`  DOMAIN COMPONENT ADMITTED: ${entry.name} (${entry.file}) via ${entry.evidence.join(", ")}\n`);
  }
  if (result.admitted.length > 0) {
    process.stderr.write("A component whose props carry a product entity does not belong in the Design System.\n");
    process.stderr.write("A name prefix is only a warning; changing the name cannot bypass the props rule.\n");
    process.exitCode = 1;
  }
}
