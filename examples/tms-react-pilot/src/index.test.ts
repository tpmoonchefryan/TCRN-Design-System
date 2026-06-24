import test from "node:test";
import assert from "node:assert/strict";
import { renderSyntheticTmsPilot } from "./index.js";

test("TMS pilot remains synthetic and local", () => {
  const html = renderSyntheticTmsPilot();
  assert.match(html, /data-example="tms-react-pilot"/);
  assert.match(html, /Synthetic talent workflow/);
  assert.doesNotMatch(html, /product accepted|final mvp accepted|release ready/i);
});
