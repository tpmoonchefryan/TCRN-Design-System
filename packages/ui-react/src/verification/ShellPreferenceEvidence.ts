/** Validates supplied observations; it neither authenticates a report nor calls a service. */
export interface ShellPreferenceEvidence {
  schemaVersion: "tcrn.shell-preference-evidence.v1";
  source: "http-observation";
  scope: { user: string; tenant: string; product: string };
  initialPins: readonly string[];
  actions: readonly { kind: "pin" | "unpin" | "reorder"; submitted: readonly string[]; readback: readonly string[]; status: "success" | "error" }[];
  freshSessionReadback: readonly string[];
  isolatedUserReadback: readonly string[];
  isolatedTenantReadback: readonly string[];
  isolatedProductReadback: readonly string[];
  failureReported: boolean;
  command: string;
}

export function evaluateShellPreferenceEvidence(input: unknown): { ok: boolean; findings: string[] } {
  const findings: string[] = [];
  if (!input || typeof input !== "object" || Array.isArray(input)) return { ok: false, findings: ["adapter_evidence_missing"] };
  const evidence = input as Record<string, unknown>;
  if (evidence.schemaVersion !== "tcrn.shell-preference-evidence.v1" || evidence.source !== "http-observation") findings.push("adapter_evidence_source_invalid");
  const scope = evidence.scope as Record<string, unknown> | undefined;
  if (!scope || ["user", "tenant", "product"].some(key => typeof scope[key] !== "string" || !(scope[key] as string).trim())) findings.push("adapter_scope_missing");
  const pins = (value: unknown): value is string[] => Array.isArray(value) && value.every(id => typeof id === "string" && id.length > 0) && new Set(value).size === value.length;
  let final: string[] | undefined = pins(evidence.initialPins) ? [...evidence.initialPins] : undefined;
  if (!final) findings.push("adapter_initial_pins_missing");
  const kinds = new Set<string>();
  if (!Array.isArray(evidence.actions) || evidence.actions.length < 3) findings.push("adapter_actions_missing");
  else for (const action of evidence.actions) {
    if (!action || typeof action !== "object" || !["pin", "unpin", "reorder"].includes(action.kind)) { findings.push("adapter_action_invalid"); continue; }
    kinds.add(action.kind);
    if (action.status !== "success" || !pins(action.submitted) || !pins(action.readback) || JSON.stringify(action.submitted) !== JSON.stringify(action.readback)) findings.push(`adapter_readback_mismatch:${action.kind}`);
    else {
      const next = action.submitted;
      if (final) {
        const added = next.filter((id: string) => !final!.includes(id));
        const removed = final.filter(id => !next.includes(id));
        const retained = next.filter((id: string) => final!.includes(id));
        if (action.kind === "pin" && (added.length !== 1 || removed.length !== 0 || next.at(-1) !== added[0] || JSON.stringify(retained) !== JSON.stringify(final))) findings.push("adapter_pin_transition_invalid");
        if (action.kind === "unpin" && (removed.length !== 1 || added.length !== 0 || JSON.stringify(next) !== JSON.stringify(final.filter(id => !removed.includes(id))))) findings.push("adapter_unpin_transition_invalid");
        if (action.kind === "reorder" && (added.length || removed.length || JSON.stringify(next) === JSON.stringify(final))) findings.push("adapter_reorder_transition_invalid");
      }
      final = action.readback;
    }
  }
  for (const kind of ["pin", "unpin", "reorder"]) if (!kinds.has(kind)) findings.push(`adapter_action_missing:${kind}`);
  if (!final || !pins(evidence.freshSessionReadback) || JSON.stringify(final) !== JSON.stringify(evidence.freshSessionReadback)) findings.push("adapter_fresh_session_mismatch");
  for (const key of ["isolatedUserReadback", "isolatedTenantReadback", "isolatedProductReadback"]) {
    if (!pins(evidence[key]) || (final?.length && JSON.stringify(final) === JSON.stringify(evidence[key]))) findings.push(`adapter_isolation_unverified:${key}`);
  }
  if (evidence.failureReported !== true) findings.push("adapter_failure_unreported");
  if (typeof evidence.command !== "string" || !evidence.command.trim()) findings.push("adapter_command_missing");
  return { ok: findings.length === 0, findings };
}
