import test from "node:test";
import assert from "node:assert/strict";
import { evaluateShellPreferenceEvidence, type ShellPreferenceEvidence } from "./ShellPreferenceEvidence.js";

function observation(): ShellPreferenceEvidence {
  return {
    schemaVersion: "tcrn.shell-preference-evidence.v1", source: "http-observation",
    scope: { user: "synthetic-user", tenant: "synthetic-tenant", product: "tms" },
    initialPins: ["a", "b"],
    actions: [
      { kind: "pin", submitted: ["a", "b", "c"], readback: ["a", "b", "c"], status: "success" },
      { kind: "unpin", submitted: ["a", "c"], readback: ["a", "c"], status: "success" },
      { kind: "reorder", submitted: ["c", "a"], readback: ["c", "a"], status: "success" },
    ],
    freshSessionReadback: ["c", "a"], isolatedUserReadback: [], isolatedTenantReadback: [], isolatedProductReadback: [],
    failureReported: true, command: "synthetic API test command",
  };
}
test("supplied adapter observations retain order, identity boundaries and failure meaning", () => {
  assert.equal(evaluateShellPreferenceEvidence(observation()).ok, true);
  for (const mutate of [
    (input: ShellPreferenceEvidence) => { input.freshSessionReadback = ["a", "b"]; },
    (input: ShellPreferenceEvidence) => { input.isolatedUserReadback = ["c", "a"]; },
    (input: ShellPreferenceEvidence) => { input.failureReported = false; },
    (input: ShellPreferenceEvidence) => { input.actions = []; },
  ]) {
    const input = observation(); mutate(input);
    assert.equal(evaluateShellPreferenceEvidence(input).ok, false);
  }
  assert.equal(evaluateShellPreferenceEvidence({ source: "localStorage" }).ok, false);
});
