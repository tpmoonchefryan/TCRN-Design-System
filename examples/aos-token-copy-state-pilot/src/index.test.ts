import test from "node:test";
import assert from "node:assert/strict";
import { createSyntheticAosReadback } from "./index.js";

test("AOS token/copy-state pilot is a synthetic readback only", () => {
  const readback = createSyntheticAosReadback();
  assert.ok(readback.tokenCount >= 12);
  assert.equal(readback.readbackState.state, "local_only");
  assert.equal(readback.productRepoMutation, false);
  assert.equal(readback.productAcceptanceClaim, false);
});
