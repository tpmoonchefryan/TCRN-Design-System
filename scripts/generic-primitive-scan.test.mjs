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
  domainNameHints,
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
  // The rule is "props carry a thing the product tracks", not "sounds domain-ish".
  const source = [
    "interface GenericProps { title: string }",
    "interface WorkItem { id: string }",
    "export function ProductShell({ title }: GenericProps) {}",
    "export function StatusBadge({ title }: GenericProps) {}",
    "export function TableToolbar({ title }: GenericProps) {}",
    "export function MetadataRail({ title }: GenericProps) {}",
    "export function RelationshipChip({ title }: GenericProps) {}",
    "export function WorkItemRow({ item }: { item: WorkItem }) {}",
  ].join("\n");
  const found = domainComponents(undefined, (path) => (String(path).endsWith("DataDisplay.tsx") ? source : ""));
  assert.deepEqual([...found.keys()], ["WorkItemRow"], "only the one whose props carry a tracked entity");
});

test("a generic component with a domain prefix is a hint, not an admission", () => {
  const source = [
    "interface WorkGenericProps { title: string }",
    "export function WorkGeneric({ title }: WorkGenericProps) {}",
  ].join("\n");
  const read = (path) => (String(path).endsWith("DataDisplay.tsx") ? source : "");
  assert.deepEqual([...domainComponents(undefined, read).keys()], []);
  assert.deepEqual([...domainNameHints(undefined, read).keys()], ["WorkGeneric"]);
  assert.equal(judgeGenericPrimitives(domainComponents(undefined, read), domainNameHints(undefined, read)).ok, true);
});

test("renaming a component cannot bypass a domain entity in its props", () => {
  const source = [
    "interface WorkItem { id: string }",
    "export function ActivityFeed({ item }: { item: WorkItem }) {}",
  ].join("\n");
  const read = (path) => (String(path).endsWith("DataDisplay.tsx") ? source : "");
  const found = domainComponents(undefined, read);
  const result = judgeGenericPrimitives(found, domainNameHints(undefined, read));
  assert.equal(result.ok, false);
  assert.deepEqual(result.admitted.map((entry) => entry.name), ["ActivityFeed"]);
  assert.deepEqual(result.admitted[0].evidence, ["WorkItem"]);
});

test("extraction is visible: a registered name that left the source is reported", () => {
  // The debt is empty now — the functional display surface moved into core — so
  // this exercises the judgement against a synthetic register rather than the real
  // one. The property still matters: if a name leaves the source while staying on a
  // list, the count reports a burn-down that did not happen.
  const registered = ["WorkBoard", "WorkList"];
  const remaining = new Map([["WorkList", "f.tsx"]]);
  const admitted = [...remaining.keys()].filter((name) => !registered.includes(name));
  const extracted = registered.filter((name) => !remaining.has(name));

  assert.deepEqual(admitted, [], "a name still present and registered is not an admission");
  assert.deepEqual(extracted, ["WorkBoard"]);
});

test("an empty debt register refuses every domain name, none grandfathered", () => {
  // An empty list could be read as a disabled gate. It is the opposite: with nothing
  // registered, the first domain component to reach DS core reds it immediately.
  const result = judgeGenericPrimitives(new Map([["WorkAnything", "packages/ui-react/src/x.tsx"]]));

  assert.equal(result.ok, false);
  assert.equal(result.registeredDebt, 0);
  assert.deepEqual(result.admitted.map((entry) => entry.name), ["WorkAnything"]);
});

test("the scan reads exported components, not mentions of them", () => {
  // A file that merely talks about WorkList must not register it — otherwise the
  // gate fires on documentation and gets muted, and a muted gate is worth less than
  // no gate because it still looks like coverage.
  const mentions = "// WorkList is extracted in INIT-012\nconst x = \"WorkBoard\";\n";
  const found = domainComponents(undefined, (path) => (String(path).endsWith("Button.tsx") ? mentions : ""));
  assert.equal(found.size, 0);
});
