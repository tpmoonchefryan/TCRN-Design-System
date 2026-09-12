import test from "node:test";
import assert from "node:assert/strict";
import { evaluateConsumerEvidence, type ConsumerEvidenceInput } from "./ConsumerVerification.js";

function positiveEvidence(): ConsumerEvidenceInput {
  const geometry = {
    afterOperation: true,
    requestedSurfaceVisible: true,
    selectedSurfaceVisible: true,
    panelSurfaceVisible: true,
    actualInstanceVisible: true,
    pageWidthPx: 360,
    pageScrollWidthPx: 360,
    visibleViewportWidthPx: 360,
    visibleViewportHeightPx: 240,
    targetLeftPx: 24,
    targetTopPx: 40,
    targetRightPx: 336,
    targetBottomPx: 180
  } as const;
  const zoom = {
    dpr: { measured: true, effectiveScale: 1, elementWidthPx: 312, viewportWidthPx: 360, viewportHeightPx: 240, elementVisible: true, source: "browser-measurement" },
    "pinch-visual-viewport": { measured: true, effectiveScale: 1, elementWidthPx: 312, viewportWidthPx: 360, viewportHeightPx: 240, elementVisible: true, source: "browser-measurement" },
    "page-zoom": { measured: true, effectiveScale: 1, elementWidthPx: 312, viewportWidthPx: 360, viewportHeightPx: 240, elementVisible: true, source: "browser-measurement" }
  } as const;
  return {
    expectedInventory: [{
      id: "operation-1",
      requestedSurface: "settings-panel",
      selectedSurface: "settings-panel",
      expectedPanelSurface: "operation-feedback-panel",
      expectedControl: "operation-feedback",
      applicability: "required"
    }],
    observed: [{
      instanceId: "operation-1",
      requestedSurface: "settings-panel",
      selectedSurface: "settings-panel",
      panelSurface: "operation-feedback-panel",
      controlId: "operation-feedback",
      controlPresent: true,
      input: { modality: "keyboard", targetId: "operation-feedback", changed: true, targetOffsetMeasured: true, targetOffsetPx: 18 },
      result: { status: "success", resultId: "result-1", observedInDom: true, source: "dom" },
      uiFeedback: { source: "dom", status: "success", domPresent: true, statusVisible: true, identityVisible: true, detailsReachable: true },
      geometry,
      zoom
    }]
  };
}

test("STORY-118 the reusable evidence validator accepts one complete positive instance", () => {
  const result = evaluateConsumerEvidence(positiveEvidence());
  assert.equal(result.ok, true);
  assert.deepEqual(result.checkedInstanceIds, ["operation-1"]);
  assert.deepEqual(result.findings, []);
});

test("STORY-118 the same validator rejects traceability, lifecycle, geometry, zoom, and applicability gaps", () => {
  const cases: Array<[string, (input: ConsumerEvidenceInput) => void]> = [
    ["wrong selected group", (input) => { input.observed[0].selectedSurface = "other-surface"; }],
    ["missing instance", (input) => { input.observed = []; }],
    ["missing DOM on error", (input) => {
      input.observed[0].result = { status: "error", resultId: "result-error", observedInDom: true, source: "dom" };
      input.observed[0].uiFeedback = { source: "dom", status: "error", domPresent: false, statusVisible: true, identityVisible: true, detailsReachable: true, errorDomChecked: false };
    }],
    ["HTTP-only result", (input) => { input.observed[0].result = { status: "success", resultId: "result-http", observedInDom: false, source: "http" } as never; }],
    ["root overflow", (input) => { input.observed[0].geometry!.pageScrollWidthPx = 401; }],
    ["target outside viewport", (input) => { input.observed[0].geometry!.targetRightPx = 500; }],
    ["invalid page zoom measurement", (input) => { input.observed[0].zoom!["page-zoom"]!.effectiveScale = 0; }],
    ["missing required control", (input) => { input.observed[0].controlPresent = false; }],
    ["not-applicable without evidence", (input) => {
      input.expectedInventory[0].applicability = "not-applicable";
      input.expectedInventory[0].applicabilityEvidence = "";
      input.observed[0].controlPresent = false;
    }],
    ["hardcoded wouldFail", (input) => { (input as unknown as Record<string, unknown>).wouldFail = true; }]
  ];

  for (const [label, mutate] of cases) {
    const input = structuredClone(positiveEvidence());
    mutate(input);
    assert.equal(evaluateConsumerEvidence(input).ok, false, label);
  }
});

test("STORY-118 a genuinely absent not-applicable control needs evidence and remains traceable", () => {
  const input = positiveEvidence();
  input.expectedInventory[0].applicability = "not-applicable";
  input.expectedInventory[0].applicabilityEvidence = "Capability is not present in this surface.";
  input.observed[0].controlPresent = false;
  assert.equal(evaluateConsumerEvidence(input).ok, true);
});
