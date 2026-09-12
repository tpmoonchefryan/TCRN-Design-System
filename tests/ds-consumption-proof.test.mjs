import test from "node:test";
import assert from "node:assert/strict";
import { inspectDsConsumption } from "../scripts/ds-consumption-proof.mjs";

test("STORY-108 positive consumer fixture requires semantic and structure markers", () => {
  const result = inspectDsConsumption({
    kind: "setting-choice",
    markup: '<div class="tcrn-setting-choice" data-setting-choice="true" data-setting-choice-semantic="value-selection" data-setting-choice-control="select" data-setting-choice-option-count="3"><label>Mode<select><option>Local</option></select></label></div>'
  });
  assert.equal(result.ok, true);
  assert.deepEqual(result.findings, []);
});

test("STORY-108 negative consumer fixture rejects class and CSS lookalikes", () => {
  const result = inspectDsConsumption({
    kind: "setting-choice",
    markup: '<div class="tcrn-setting-choice tcrn-segmented-nav" data-setting-choice="true" data-setting-choice-semantic="navigation" data-setting-choice-control="radio" data-setting-choice-option-count="2" data-setting-choice-fit="true"><nav class="tcrn-segmented-nav"><button>Local</button><button>Remote</button></nav></div>'
  });
  assert.equal(result.ok, false);
  assert.match(result.findings.join("; "), /value-selection|navigation component/);
});

test("STORY-108 negative consumer fixture rejects a Stepper and a clipped numeric value", () => {
  const stepper = inspectDsConsumption({
    kind: "number-input",
    markup: '<nav class="tcrn-stepper" data-stepper="true"><ol><li>1</li></ol></nav>'
  });
  const clipped = inspectDsConsumption({
    kind: "number-input",
    markup: '<input class="tcrn-number-input" data-number-input="true" data-number-input-semantic="numeric-entry" data-number-input-visibility="clipped" type="number" value="8192" />'
  });
  assert.equal(stepper.ok, false);
  assert.equal(clipped.ok, false);
  assert.match(stepper.findings.join("; "), /numeric entry|Stepper/);
  assert.match(clipped.findings.join("; "), /visible|clipping/);
});

test("STORY-108 consumer-owned applicability rejects visible not-applicable entries", () => {
  const result = inspectDsConsumption({
    kind: "consumer-feature",
    markup: '<button data-consumer-feature-applicable="false" data-consumer-feature-visible="true">Retired feature</button>'
  });
  assert.equal(result.ok, false);
  assert.match(result.findings.join("; "), /not applicable/);
});
