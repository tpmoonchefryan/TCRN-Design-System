// SPDX-License-Identifier: Apache-2.0
// TCRN-DS-STORY-094 — both sides of the generality gate.
//
// The gate's whole value is refusing a thirty-third domain component, and a gate
// that has only ever been seen green has not shown it can refuse anything. Each red
// below is exercised against an injected source rather than by editing the tree.

import test from "node:test";
import assert from "node:assert/strict";

import {
  DOMAIN_PREFIXES,
  REGISTERED_DOMAIN_DEBT,
  domainComponents,
  judgeGenericPrimitives,
} from "./generic-primitive-scan.mjs";

test("the real tree holds exactly the registered debt and nothing more", () => {
  const result = judgeGenericPrimitives();
  assert.deepEqual(result.admitted, [], "a new domain component reached DS core");
  assert.equal(result.reasonCode, "GENERIC_PRIMITIVE_RULE_HELD");
  // The debt is a number someone has to change on purpose. If these drift apart the
  // list has stopped describing the tree, which is the failure the list exists to
  // prevent — see the platform's class A / class F distinction.
  assert.equal(result.registeredDebt, REGISTERED_DOMAIN_DEBT.length);
  assert.deepEqual(result.extracted, [], "a name left the source without leaving the list");
});

test("REDS on a thirty-third domain component", () => {
  const found = new Map([["WorkTimelineRail", "packages/ui-react/src/components/DataDisplay/DataDisplay.tsx"]]);
  const result = judgeGenericPrimitives(found);
  assert.equal(result.ok, false);
  assert.equal(result.reasonCode, "DOMAIN_COMPONENT_ADMITTED");
  // Naming the file matters: "something is wrong" costs a search, and a gate that
  // costs a search is a gate people stop running.
  assert.equal(result.admitted[0].name, "WorkTimelineRail");
  assert.match(result.admitted[0].file, /DataDisplay\.tsx$/);
});

test("REDS on each of the four prefixes, so none of them is decorative", () => {
  for (const prefix of DOMAIN_PREFIXES) {
    const result = judgeGenericPrimitives(new Map([[`${prefix}Whatever`, "f.tsx"]]));
    assert.equal(result.ok, false, `${prefix} is in the list but refuses nothing`);
  }
});

test("a structural name that merely sounds specific is never collected at all", () => {
  // The rule is "names a thing the product tracks", not "sounds domain-ish". A
  // library full of Panels and Rails is still generic; one that knows what a Work
  // Item is, is not. The distinction lives in the collector's pattern, so that is
  // what this exercises — judgeGenericPrimitives only ever sees names the collector
  // already decided are domain names.
  const source = [
    "export function ProductShell() {}",
    "export function StatusBadge() {}",
    "export function TableToolbar() {}",
    "export function MetadataRail() {}",
    "export function RelationshipChip() {}",
    "export function WorkItemRow() {}",
  ].join("\n");
  const found = domainComponents(undefined, (path) => (String(path).endsWith("DataDisplay.tsx") ? source : ""));
  assert.deepEqual([...found.keys()], ["WorkItemRow"], "only the one naming a tracked entity");
});

test("extraction is visible: a registered name that left the source is reported", () => {
  const remaining = new Map(REGISTERED_DOMAIN_DEBT.filter((name) => name !== "WorkBoard").map((name) => [name, "f.tsx"]));
  const result = judgeGenericPrimitives(remaining);
  // Still green — extracting is the goal, not a violation — but the count has to
  // stop claiming a component that is gone.
  assert.equal(result.ok, true);
  assert.deepEqual(result.extracted, ["WorkBoard"]);
});

test("the scan reads exported components, not mentions of them", () => {
  // A file that merely talks about WorkList must not register it — otherwise the
  // gate fires on documentation and gets muted, and a muted gate is worth less than
  // no gate because it still looks like coverage.
  const mentions = "// WorkList is extracted in INIT-012\nconst x = \"WorkBoard\";\n";
  const found = domainComponents(undefined, (path) => (String(path).endsWith("Button.tsx") ? mentions : ""));
  assert.equal(found.size, 0);
});
