// SPDX-License-Identifier: Apache-2.0
// TCRN-DS-INC-008 — the declared public surface, checked against the real one.
//
// This file used to hold a verbatim copy of `componentLibraryPublicComponentNames`
// and assert the two were equal. Two hand-kept copies agreeing with each other
// detects nothing: it cannot fail unless someone edits one and not the other, and
// when that happened the only thing it proved was that a person had made a
// clerical slip. Meanwhile the surface it claimed to guard drifted — the package
// exported `MobileNavToggle`, with a public props interface, and no roster of the
// three named it at all.
//
// So the copy is gone. The roster in `index.tsx` is the single written source, and
// what it is compared against here is what the module actually exports. One side
// is a deliberate-change tripwire; the other is reality. That is the only
// arrangement in which this test can fail for a reason worth knowing.

import assert from "node:assert/strict";
import test from "node:test";

import * as packageExports from "./index.js";
import {
  componentLibraryDeferredPrototypeNames,
  componentLibraryPublicComponentNames,
  componentLibraryPublicUtilityNames
} from "./index.js";

const declaredComponents = componentLibraryPublicComponentNames as readonly string[];
const declaredUtilities = componentLibraryPublicUtilityNames as readonly string[];
const declaredPrototypes = componentLibraryDeferredPrototypeNames as readonly string[];

/**
 * Every export whose name is component-shaped, minus the two categories that are
 * declared to be something else. Utilities and prototypes are subtracted by name
 * rather than by shape because `tcrnComponentCss` is a string and `ProductShell` is
 * a forwardRef object — runtime type does not separate them, and a filter that
 * guessed from `typeof` would quietly reclassify a component the day it gained a
 * `memo()` wrapper.
 */
const actualComponentExports = Object.keys(packageExports)
  .filter((name) => /^[A-Z]/u.test(name))
  .filter((name) => !declaredUtilities.includes(name) && !declaredPrototypes.includes(name))
  .sort();

test("every component-shaped export is declared, and every declared name is exported", () => {
  const undeclared = actualComponentExports.filter((name) => !declaredComponents.includes(name));
  const missing = [...declaredComponents]
    .filter((name) => !Object.prototype.hasOwnProperty.call(packageExports, name))
    .sort();

  // Both directions, and both named. An export nobody declared is public API that
  // no contract covers; a declared name that is not exported is a roster claiming
  // coverage of something that is not there, which is how a list stops describing
  // the thing it governs.
  assert.deepEqual(undeclared, [], "exported but named by no roster");
  assert.deepEqual(missing, [], "declared but not exported");
});

test("the roster has no duplicates and no empty names", () => {
  // A duplicate would make the count disagree with the set while both comparisons
  // above still pass, and the count is what the package contract manifest reports.
  assert.equal(new Set(declaredComponents).size, declaredComponents.length);
  assert.equal(declaredComponents.filter((name) => name.trim() === "").length, 0);
});

test("every declared utility is actually exported", () => {
  const missing = declaredUtilities.filter(
    (name) => !Object.prototype.hasOwnProperty.call(packageExports, name)
  );

  assert.deepEqual(missing, []);
});

test("no deferred prototype is exported from the package", () => {
  // The prototypes are storybook-only sketches. One of them appearing in the
  // package's exports would ship it as public API under a name the roster says is
  // not public — the failure mode this category exists to make visible.
  const leaked = declaredPrototypes.filter((name) =>
    Object.prototype.hasOwnProperty.call(packageExports, name)
  );

  assert.deepEqual(leaked, []);
  assert.ok(declaredPrototypes.includes("DenseOperationsShellDemo"));
  assert.ok(declaredPrototypes.includes("KnowledgeBaseShellDemo"));
  assert.ok(declaredPrototypes.includes("CompactToolShellDemo"));
});

test("the three rosters are disjoint", () => {
  // Overlap would let a name satisfy one category's check while being subtracted
  // out of another's, so a component could hide inside the utility list and never
  // be compared against anything.
  for (const name of declaredComponents) {
    assert.equal(declaredUtilities.includes(name), false, `${name} is both component and utility`);
    assert.equal(declaredPrototypes.includes(name), false, `${name} is both component and prototype`);
  }
  for (const name of declaredUtilities) {
    assert.equal(declaredPrototypes.includes(name), false, `${name} is both utility and prototype`);
  }
});

test("the checks can fail — a name removed from the roster is caught", () => {
  // The gate's whole value is refusing an undeclared export, and a gate only ever
  // seen green has not shown it can refuse anything. This exercises the judgement
  // against a shortened roster rather than by editing the real one.
  const shortened = declaredComponents.filter((name) => name !== "Button");
  const undeclared = actualComponentExports.filter((name) => !shortened.includes(name));

  assert.deepEqual(undeclared, ["Button"]);
});
