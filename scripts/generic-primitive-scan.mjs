#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
// TCRN-DS-STORY-094 — the generality rule, made machine-decidable.
//
//   node scripts/generic-primitive-scan.mjs
//
// Owner's rule (TCRN-TMS-MIN-008): a component belongs in the Design System if and
// only if its props can be described without naming any single product's business
// concept. That was prose, and prose does not stop the next commit — forty domain
// components reached DS core while the rule existed and nobody could point at the
// moment it was broken.
//
// This gate does not remove them. INIT-012 ruled extraction rather than deletion,
// because DS's only live consumer imports twenty-five of the thirty-two, and a
// library that deletes what its consumer imports has not become generic, it has
// become broken. So the existing surface is a REGISTERED DEBT: named, counted, and
// frozen. What the gate refuses is a thirty-third.
//
// The debt list is the reference and it is version-controlled, which is class A in
// the platform's gate-reference inventory: change it and the gate goes red until
// someone states the new number on purpose. That is the shape the convention wants
// — a deliberate-change tripwire, not a moving baseline.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const COMPONENT_ROOT = join(REPO_ROOT, "packages/ui-react/src/components");

/**
 * Business-concept prefixes. Deliberately narrow: these four name entities in the
 * governed product domain, and a generic library has no reason to know any of them.
 *
 * Not included, and the omissions are the interesting part: `Product*` (a shell is a
 * generic frame), `Status`/`State` (every product has states), `Table`/`Nav`/`Panel`
 * (structure, not domain). A prefix earns a place here by naming a THING THE PRODUCT
 * TRACKS, not by sounding specific.
 */
export const DOMAIN_PREFIXES = Object.freeze(["Work", "Knowledge", "Gate", "Evidence"]);

/**
 * The components that were already here when the rule became enforceable.
 *
 * Frozen on 2026-08-18, then thirty-two minus one: GateReadinessPanel left by the
 * route the gate's own message prescribes — "describe its props without the entity
 * and rename it". Its props were `{ state: CopyStatePresentation }` and its body a
 * Surface/Heading/Text/StatusBadge composition; the domain lived entirely in the
 * name, so it is now StatusSummaryPanel and no longer a domain component at all.
 * Nothing was deleted and no consumer lost a capability.
 *
 * Twenty-five of the remainder are live imports in the consuming
 * product; extraction is cross-repository work sequenced after this gate, tracked by
 * TCRN-DS-INIT-012. Removing a name from this list is how extraction reports
 * progress — the gate then refuses it coming back.
 */
export const REGISTERED_DOMAIN_DEBT = Object.freeze([
  "EvidenceAttachmentList", "EvidenceStrip",
  "GatePipeline", "GatePipelineCompact",
  "KnowledgeAttachmentList", "KnowledgeDocumentCanvas", "KnowledgeInlineCommentList",
  "KnowledgeLabelSet", "KnowledgeMetadataRail", "KnowledgePageTree",
  "KnowledgeSearchResults", "KnowledgeTemplateGallery", "KnowledgeTocRail",
  "KnowledgeVersionHistory",
  "WorkActivityFeed", "WorkBacklogGroup", "WorkBoard", "WorkBoardView",
  "WorkDetailLayout", "WorkFieldPanel", "WorkHierarchy", "WorkIndex",
  "WorkInlineCreateStatic", "WorkItemInspector", "WorkItemRow", "WorkList",
  "WorkManagementSubnav", "WorkPageHeader", "WorkQuickFilters", "WorkSplitView",
  "WorkViewTabs",
]);

function sourceFiles(root) {
  const found = [];
  const walk = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) { walk(path); continue; }
      if (!entry.name.endsWith(".tsx") && !entry.name.endsWith(".ts")) continue;
      if (entry.name.includes(".test.")) continue;
      found.push(path);
    }
  };
  walk(root);
  return found.sort();
}

/** Exported component names that name a product entity. */
export function domainComponents(root = COMPONENT_ROOT, read = readFileSync) {
  const pattern = new RegExp(`^export function ((?:${DOMAIN_PREFIXES.join("|")})[A-Z]\\w*)`, "gmu");
  const found = new Map();
  for (const path of sourceFiles(root)) {
    const text = String(read(path, "utf8"));
    for (const match of text.matchAll(pattern)) {
      found.set(match[1], path.slice(REPO_ROOT.length + 1));
    }
  }
  return found;
}

export function judgeGenericPrimitives(found = domainComponents()) {
  const registered = new Set(REGISTERED_DOMAIN_DEBT);
  const admitted = [...found.keys()].filter((name) => !registered.has(name)).sort();
  // A name that left the source but stayed on the list is extraction that happened
  // without the list being updated. It is not a failure, but it must be visible, or
  // the debt count stops meaning anything.
  const extracted = [...registered].filter((name) => !found.has(name)).sort();
  return {
    schemaVersion: "tcrn.ds.generic-primitive-scan.v1",
    ok: admitted.length === 0,
    reasonCode: admitted.length === 0 ? "GENERIC_PRIMITIVE_RULE_HELD" : "DOMAIN_COMPONENT_ADMITTED",
    prefixes: [...DOMAIN_PREFIXES],
    registeredDebt: REGISTERED_DOMAIN_DEBT.length,
    present: found.size,
    admitted: admitted.map((name) => ({ name, file: found.get(name) })),
    extracted,
  };
}

if (process.argv[1]?.endsWith("generic-primitive-scan.mjs")) {
  const result = judgeGenericPrimitives();
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  for (const entry of result.admitted) {
    process.stderr.write(`  DOMAIN COMPONENT ADMITTED: ${entry.name} (${entry.file})\n`);
  }
  if (result.admitted.length > 0) {
    process.stderr.write("A component naming a product entity does not belong in the Design System.\n");
    process.stderr.write("Build it in the product, or describe its props without the entity and rename it.\n");
  }
  if (!result.ok) process.exitCode = 1;
}
