/**
 * Pure consumer-evidence validation for DS-backed interactive surfaces.
 *
 * This module intentionally has no React or DOM dependency. A product or a
 * browser proof supplies the actual observations; this function only checks
 * that the observations are complete, internally consistent, and backed by
 * the visible instance that was exercised.
 */

export const consumerEvidenceZoomAxes = ["dpr", "pinch-visual-viewport", "page-zoom"] as const;
export type ConsumerEvidenceZoomAxis = (typeof consumerEvidenceZoomAxes)[number];

export const consumerEvidenceStatuses = ["idle", "loading", "success", "error"] as const;
export type ConsumerEvidenceStatus = (typeof consumerEvidenceStatuses)[number];

export interface ExpectedConsumerInstance {
  id: string;
  requestedSurface: string;
  selectedSurface: string;
  expectedControl: string;
  expectedPanelSurface?: string;
  applicability: "required" | "not-applicable";
  applicabilityEvidence?: string;
}

export interface ConsumerInputEvidence {
  modality: "keyboard" | "pointer";
  targetId: string;
  changed: boolean;
  targetOffsetMeasured: boolean;
  targetOffsetPx: number;
}

export interface ConsumerResultEvidence {
  status: ConsumerEvidenceStatus;
  resultId: string;
  observedInDom: boolean;
  source: "dom";
}

export interface ConsumerUiFeedbackEvidence {
  source: "dom";
  status: ConsumerEvidenceStatus;
  domPresent: boolean;
  statusVisible: boolean;
  identityVisible: boolean;
  detailsReachable: boolean;
  errorDomChecked?: boolean;
}

export interface ConsumerGeometryEvidence {
  afterOperation: boolean;
  requestedSurfaceVisible: boolean;
  selectedSurfaceVisible: boolean;
  panelSurfaceVisible: boolean;
  actualInstanceVisible: boolean;
  pageWidthPx: number;
  pageScrollWidthPx: number;
  visibleViewportWidthPx: number;
  visibleViewportHeightPx: number;
  targetLeftPx: number;
  targetTopPx: number;
  targetRightPx: number;
  targetBottomPx: number;
}

export interface ConsumerZoomEvidence {
  measured: boolean;
  effectiveScale: number;
  elementWidthPx: number;
  viewportWidthPx: number;
  viewportHeightPx: number;
  elementVisible: boolean;
  source: "browser-measurement";
}

export interface ObservedConsumerInstance {
  instanceId: string;
  requestedSurface: string;
  selectedSurface: string;
  panelSurface: string;
  controlId: string;
  controlPresent: boolean;
  input?: ConsumerInputEvidence;
  result?: ConsumerResultEvidence;
  uiFeedback?: ConsumerUiFeedbackEvidence;
  geometry?: ConsumerGeometryEvidence;
  zoom?: Partial<Record<ConsumerEvidenceZoomAxis, ConsumerZoomEvidence>>;
}

export interface ConsumerEvidenceInput {
  expectedInventory: readonly ExpectedConsumerInstance[];
  observed: readonly ObservedConsumerInstance[];
  requiredZoomAxes?: readonly ConsumerEvidenceZoomAxis[];
}

export interface ConsumerEvidenceResult {
  ok: boolean;
  checkedInstanceIds: string[];
  findings: string[];
}

type RecordValue = Record<string, unknown>;

function isRecord(value: unknown): value is RecordValue {
  return typeof value === "object" && value !== null;
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function finitePositive(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function finiteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isStatus(value: unknown): value is ConsumerEvidenceStatus {
  return typeof value === "string" && (consumerEvidenceStatuses as readonly string[]).includes(value);
}

function isZoomAxis(value: unknown): value is ConsumerEvidenceZoomAxis {
  return typeof value === "string" && (consumerEvidenceZoomAxes as readonly string[]).includes(value);
}

function addFinding(findings: string[], value: string) {
  if (!findings.includes(value)) findings.push(value);
}

function validateGeometry(geometry: unknown, findings: string[], instanceId: string) {
  if (!isRecord(geometry)) {
    addFinding(findings, `${instanceId}:geometry_missing`);
    return;
  }
  const numericFields = [
    "pageWidthPx",
    "pageScrollWidthPx",
    "visibleViewportWidthPx",
    "visibleViewportHeightPx",
    "targetLeftPx",
    "targetTopPx",
    "targetRightPx",
    "targetBottomPx"
  ];
  for (const field of numericFields) {
    if (!finiteNumber(geometry[field])) addFinding(findings, `${instanceId}:geometry_${field}_unknown`);
  }
  if (geometry.afterOperation !== true) addFinding(findings, `${instanceId}:geometry_not_after_operation`);
  for (const field of ["requestedSurfaceVisible", "selectedSurfaceVisible", "panelSurfaceVisible", "actualInstanceVisible"]) {
    if (geometry[field] !== true) addFinding(findings, `${instanceId}:geometry_${field}_not_visible`);
  }
  if (!finitePositive(geometry.pageWidthPx) || !finitePositive(geometry.pageScrollWidthPx)) {
    addFinding(findings, `${instanceId}:geometry_page_width_invalid`);
  } else if ((geometry.pageScrollWidthPx as number) > (geometry.pageWidthPx as number)) {
    addFinding(findings, `${instanceId}:geometry_root_overflow`);
  }
  if (!finitePositive(geometry.visibleViewportWidthPx) || !finitePositive(geometry.visibleViewportHeightPx)) {
    addFinding(findings, `${instanceId}:geometry_visible_viewport_invalid`);
  }
  if (numericFields.every((field) => finiteNumber(geometry[field]))) {
    const viewportWidth = geometry.visibleViewportWidthPx as number;
    const viewportHeight = geometry.visibleViewportHeightPx as number;
    const left = geometry.targetLeftPx as number;
    const top = geometry.targetTopPx as number;
    const right = geometry.targetRightPx as number;
    const bottom = geometry.targetBottomPx as number;
    if (right <= left || bottom <= top) addFinding(findings, `${instanceId}:geometry_target_has_no_area`);
    if (left < 0 || top < 0 || right > viewportWidth || bottom > viewportHeight) {
      addFinding(findings, `${instanceId}:geometry_target_outside_visible_viewport`);
    }
  }
}

function validateZoom(
  zoom: unknown,
  requiredAxes: readonly ConsumerEvidenceZoomAxis[],
  visibleViewportWidthPx: unknown,
  visibleViewportHeightPx: unknown,
  findings: string[],
  instanceId: string
) {
  if (!isRecord(zoom)) {
    addFinding(findings, `${instanceId}:zoom_measurements_missing`);
    return;
  }
  for (const key of Object.keys(zoom)) {
    if (!isZoomAxis(key)) addFinding(findings, `${instanceId}:zoom_axis_unknown:${key}`);
  }
  for (const axis of requiredAxes) {
    const measurement = zoom[axis];
    if (!isRecord(measurement)) {
      addFinding(findings, `${instanceId}:zoom_axis_missing:${axis}`);
      continue;
    }
    if (measurement.measured !== true) addFinding(findings, `${instanceId}:zoom_axis_unmeasured:${axis}`);
    if (!finitePositive(measurement.effectiveScale)) addFinding(findings, `${instanceId}:zoom_scale_invalid:${axis}`);
    if (!finitePositive(measurement.elementWidthPx)) addFinding(findings, `${instanceId}:zoom_element_width_invalid:${axis}`);
    if (!finitePositive(measurement.viewportWidthPx) || !finitePositive(measurement.viewportHeightPx)) {
      addFinding(findings, `${instanceId}:zoom_viewport_measurement_invalid:${axis}`);
    }
    if (measurement.elementVisible !== true) addFinding(findings, `${instanceId}:zoom_element_not_visible:${axis}`);
    if (measurement.source !== "browser-measurement") addFinding(findings, `${instanceId}:zoom_source_invalid:${axis}`);
    if (finiteNumber(visibleViewportWidthPx) && measurement.viewportWidthPx !== visibleViewportWidthPx) {
      addFinding(findings, `${instanceId}:zoom_viewport_width_not_traceable:${axis}`);
    }
    if (finiteNumber(visibleViewportHeightPx) && measurement.viewportHeightPx !== visibleViewportHeightPx) {
      addFinding(findings, `${instanceId}:zoom_viewport_height_not_traceable:${axis}`);
    }
  }
}

function validateRequiredObservation(
  expected: ExpectedConsumerInstance,
  observed: RecordValue,
  requiredAxes: readonly ConsumerEvidenceZoomAxis[],
  findings: string[]
) {
  const instanceId = expected.id;
  if (observed.controlPresent !== true) addFinding(findings, `${instanceId}:required_control_missing`);

  const input = observed.input;
  if (!isRecord(input)) {
    addFinding(findings, `${instanceId}:input_evidence_missing`);
  } else {
    if (input.modality !== "keyboard" && input.modality !== "pointer") addFinding(findings, `${instanceId}:input_modality_unknown`);
    if (!nonEmptyString(input.targetId) || input.targetId !== observed.controlId) addFinding(findings, `${instanceId}:input_target_untraceable`);
    if (input.changed !== true) addFinding(findings, `${instanceId}:input_change_unverified`);
    if (input.targetOffsetMeasured !== true || !finiteNumber(input.targetOffsetPx)) {
      addFinding(findings, `${instanceId}:keyboard_target_offset_unverified`);
    }
  }

  const result = observed.result;
  if (!isRecord(result)) {
    addFinding(findings, `${instanceId}:result_evidence_missing`);
  } else {
    if (!isStatus(result.status)) addFinding(findings, `${instanceId}:result_status_unknown`);
    if (!nonEmptyString(result.resultId)) addFinding(findings, `${instanceId}:result_identity_missing`);
    if (result.observedInDom !== true || result.source !== "dom") addFinding(findings, `${instanceId}:result_not_dom_backed`);
  }

  const uiFeedback = observed.uiFeedback;
  if (!isRecord(uiFeedback)) {
    addFinding(findings, `${instanceId}:ui_feedback_missing`);
  } else {
    if (uiFeedback.source !== "dom") addFinding(findings, `${instanceId}:ui_feedback_not_dom_backed`);
    if (!isStatus(uiFeedback.status)) addFinding(findings, `${instanceId}:ui_feedback_status_unknown`);
    if (uiFeedback.domPresent !== true) addFinding(findings, `${instanceId}:ui_feedback_dom_missing`);
    if (uiFeedback.statusVisible !== true) addFinding(findings, `${instanceId}:ui_feedback_status_not_visible`);
    if (uiFeedback.identityVisible !== true) addFinding(findings, `${instanceId}:ui_feedback_identity_not_visible`);
    if (uiFeedback.detailsReachable !== true) addFinding(findings, `${instanceId}:ui_feedback_details_not_reachable`);
    if (uiFeedback.status === "error" && uiFeedback.errorDomChecked !== true) {
      addFinding(findings, `${instanceId}:error_dom_not_checked`);
    }
    if (isRecord(result) && result.status !== uiFeedback.status) addFinding(findings, `${instanceId}:result_ui_status_mismatch`);
  }

  validateGeometry(observed.geometry, findings, instanceId);
  const geometry = isRecord(observed.geometry) ? observed.geometry : undefined;
  validateZoom(
    observed.zoom,
    requiredAxes,
    geometry?.visibleViewportWidthPx,
    geometry?.visibleViewportHeightPx,
    findings,
    instanceId
  );
}

/**
 * Evaluate evidence from the same rules for both positive and negative legs.
 * Any missing observation, unmeasured geometry, or synthetic result is a
 * finding; there is no caller-supplied pass/fail override.
 */
export function evaluateConsumerEvidence(input: ConsumerEvidenceInput): ConsumerEvidenceResult {
  const findings: string[] = [];
  if (!input || typeof input !== "object") {
    return { ok: false, checkedInstanceIds: [], findings: ["input_invalid"] };
  }
  if (Object.prototype.hasOwnProperty.call(input as object, "wouldFail")) {
    addFinding(findings, "hardcoded_would_fail_forbidden");
  }

  const expected = Array.isArray(input.expectedInventory) ? input.expectedInventory : [];
  const observed = Array.isArray(input.observed) ? input.observed : [];
  if (expected.length === 0) addFinding(findings, "expected_inventory_empty");
  if (!Array.isArray(input.expectedInventory)) addFinding(findings, "expected_inventory_missing");
  if (!Array.isArray(input.observed)) addFinding(findings, "observed_inventory_missing");

  const requiredAxes = input.requiredZoomAxes === undefined
    ? consumerEvidenceZoomAxes
    : Array.isArray(input.requiredZoomAxes) ? input.requiredZoomAxes : [];
  const currentRequiredAxes = requiredAxes.filter(isZoomAxis);
  if (requiredAxes.length === 0) addFinding(findings, "required_zoom_axes_empty");
  if (currentRequiredAxes.length !== requiredAxes.length) addFinding(findings, "required_zoom_axis_unknown");
  if (new Set(currentRequiredAxes).size !== currentRequiredAxes.length) addFinding(findings, "required_zoom_axes_duplicated");

  const expectedById = new Map<string, ExpectedConsumerInstance>();
  for (const entry of expected) {
    if (!isRecord(entry) || !nonEmptyString(entry.id)) {
      addFinding(findings, "expected_instance_id_invalid");
      continue;
    }
    if (expectedById.has(entry.id)) addFinding(findings, `expected_instance_duplicated:${entry.id}`);
    expectedById.set(entry.id, entry as unknown as ExpectedConsumerInstance);
    for (const field of ["requestedSurface", "selectedSurface", "expectedControl"]) {
      if (!nonEmptyString(entry[field])) addFinding(findings, `${entry.id}:expected_${field}_missing`);
    }
    if (entry.expectedPanelSurface !== undefined && !nonEmptyString(entry.expectedPanelSurface)) {
      addFinding(findings, `${entry.id}:expected_panel_surface_invalid`);
    }
    if (entry.applicability !== "required" && entry.applicability !== "not-applicable") {
      addFinding(findings, `${entry.id}:applicability_unknown`);
    }
    if (entry.applicability === "not-applicable" && !nonEmptyString(entry.applicabilityEvidence)) {
      addFinding(findings, `${entry.id}:not_applicable_evidence_missing`);
    }
  }

  const observedById = new Map<string, RecordValue>();
  for (const entry of observed) {
    if (!isRecord(entry) || !nonEmptyString(entry.instanceId)) {
      addFinding(findings, "observed_instance_id_invalid");
      continue;
    }
    if (observedById.has(entry.instanceId)) addFinding(findings, `observed_instance_duplicated:${entry.instanceId}`);
    observedById.set(entry.instanceId, entry);
    if (!expectedById.has(entry.instanceId)) addFinding(findings, `observed_instance_unexpected:${entry.instanceId}`);
  }

  const checkedInstanceIds: string[] = [];
  for (const [instanceId, expectedEntry] of expectedById) {
    checkedInstanceIds.push(instanceId);
    const observation = observedById.get(instanceId);
    if (!observation) {
      addFinding(findings, `${instanceId}:observation_missing`);
      continue;
    }
    if (observation.instanceId !== expectedEntry.id) addFinding(findings, `${instanceId}:instance_identity_mismatch`);
    if (observation.requestedSurface !== expectedEntry.requestedSurface) addFinding(findings, `${instanceId}:requested_surface_mismatch`);
    if (observation.selectedSurface !== expectedEntry.selectedSurface) addFinding(findings, `${instanceId}:selected_surface_mismatch`);
    if (expectedEntry.expectedPanelSurface !== undefined && observation.panelSurface !== expectedEntry.expectedPanelSurface) {
      addFinding(findings, `${instanceId}:panel_surface_mismatch`);
    }
    if (observation.panelSurface !== expectedEntry.selectedSurface && expectedEntry.expectedPanelSurface === undefined) {
      addFinding(findings, `${instanceId}:panel_surface_untraceable`);
    }
    if (observation.controlId !== expectedEntry.expectedControl) addFinding(findings, `${instanceId}:control_identity_mismatch`);

    if (expectedEntry.applicability === "not-applicable") {
      if (observation.controlPresent === true) addFinding(findings, `${instanceId}:not_applicable_control_present`);
      if (!nonEmptyString(expectedEntry.applicabilityEvidence)) addFinding(findings, `${instanceId}:not_applicable_evidence_missing`);
      continue;
    }
    validateRequiredObservation(expectedEntry, observation, currentRequiredAxes, findings);
  }
  return { ok: findings.length === 0, checkedInstanceIds, findings };
}
