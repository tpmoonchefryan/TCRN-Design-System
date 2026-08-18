// SPDX-License-Identifier: Apache-2.0
// TCRN-DS-INIT-012 — the re-export surface is real, and it is the whole surface.

import assert from "node:assert/strict";
import test from "node:test";

import * as domain from "./index.js";
import { domainComponentNames, domainUtilityNames } from "./index.js";

test("every name the roster claims is actually exported", () => {
  // A roster that names something it does not export is the failure mode this
  // repository spent INC-008 removing. Both lists are checked against the module.
  const missing = [...domainComponentNames, ...domainUtilityNames].filter(
    (name) => !Object.prototype.hasOwnProperty.call(domain, name)
  );

  assert.deepEqual(missing, []);
});

test("every runtime export is named by the roster", () => {
  // The other direction: a re-export nobody listed is domain surface that the
  // migration's counter does not know about, so stage two would leave it behind.
  const named = new Set<string>([...domainComponentNames, ...domainUtilityNames]);
  const unnamed = Object.keys(domain)
    .filter((key) => key !== "domainComponentNames" && key !== "domainUtilityNames")
    .filter((key) => !named.has(key))
    .sort();

  assert.deepEqual(unnamed, []);
});

test("the counts are stated, so a change to them is deliberate", () => {
  assert.equal(domainComponentNames.length, 35);
  assert.equal(domainUtilityNames.length, 4);
});

test("the two rosters are disjoint", () => {
  for (const name of domainComponentNames) {
    assert.equal((domainUtilityNames as readonly string[]).includes(name), false, `${name} in both`);
  }
});
