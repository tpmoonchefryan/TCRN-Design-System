import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { Badge, EmptyState, EnvironmentBanner, ErrorState, OperationFeedback, Skeleton, StateSurface, StatusBadge, StateView, StatusSummaryPanel, Toast } from "./Feedback.js";
import { presentCopyState } from "@tcrn/ui-copy-state";

test("stateful components fail closed without product acceptance claims", () => {
  const badge = renderToStaticMarkup(<StatusBadge state={{ state: "future_live" }} />);
  assert.match(badge, /data-state="unknown"/);

  const panel = renderToStaticMarkup(<StatusSummaryPanel state={presentCopyState({ state: "proof_required" })} />);
  assert.match(panel, /Proof required/);
  assert.doesNotMatch(panel.toLowerCase(), /product accepted|final mvp accepted|release ready/);
});

test("badges keep a single-line label and expose the full text", () => {
  const badge = renderToStaticMarkup(<Badge>pending acceptance</Badge>);
  assert.match(badge, /class="tcrn-badge tcrn-badge--neutral"/);
  assert.match(badge, /class="tcrn-badge__label">pending acceptance<\/span>/);
  assert.match(badge, /title="pending acceptance"/);
  assert.match(badge, /aria-label="pending acceptance"/);

  const wrapped = renderToStaticMarkup(<Badge className="tcrn-badge--wrap">free-form label</Badge>);
  assert.match(wrapped, /tcrn-badge--wrap/);
});

test("state labels reject caller-provided forbidden positive claims", () => {
  const badge = renderToStaticMarkup(<StatusBadge state={{ state: "future_live", label: "Release ready" }} />);
  assert.match(badge, /data-state="unknown"/);
  assert.match(badge, />Unknown</);
  assert.doesNotMatch(badge.toLowerCase(), /release ready/);

  const childOverride = renderToStaticMarkup(
    <StatusBadge state={{ state: "local_only" }}>
      Release ready
    </StatusBadge>
  );
  assert.match(childOverride, />Local proof only</);
  assert.doesNotMatch(childOverride.toLowerCase(), /release ready/);

  const stateView = renderToStaticMarkup(<StateView state={{ state: "future_live", label: "Product accepted" }} />);
  assert.match(stateView, /Unknown/);
  assert.doesNotMatch(stateView.toLowerCase(), /product accepted/);

  const titleOverride = renderToStaticMarkup(<StateView state={{ state: "local_only" }} title="Release ready" />);
  assert.match(titleOverride, /Local proof only/);
  assert.doesNotMatch(titleOverride.toLowerCase(), /release ready/);
});

test("state components can render localized copy-state labels", () => {
  const badge = renderToStaticMarkup(<StatusBadge state={{ state: "not_claimed" }} locale="zh-CN" />);
  assert.match(badge, /未声明/);
  assert.doesNotMatch(badge, />not_claimed</);

  const stateView = renderToStaticMarkup(<StateView state={{ state: "blocked" }} locale="ja" />);
  assert.match(stateView, /ブロック中/);
  assert.doesNotMatch(stateView, />blocked</);

  const banner = renderToStaticMarkup(<EnvironmentBanner label="只读预览" state={{ state: "local_only" }} locale="zh-CN" />);
  assert.match(banner, /仅本地证明/);
  assert.doesNotMatch(banner, /Local proof only/);
});

test("state components reject raw enum label leakage", () => {
  const badge = renderToStaticMarkup(<StatusBadge state={{ state: "external_proof_needed", label: "external_proof_required" }} />);
  assert.match(badge, />External proof needed</);
  assert.doesNotMatch(badge, /external_proof_required/);
});

test("STORY-116 keeps short operation status separate from full identity and receipt details", () => {
  const html = renderToStaticMarkup(
    <OperationFeedback
      phase="success"
      identity={{
        operation: "Rebuild local index",
        operationId: "operation-2026-09-13-very-long-identity-9f4d1c2b7a6e",
        actor: "Synthetic operator",
        actorId: "actor-very-long-identity-0c2e8a9d7b6f",
        occurredAt: "2026-09-13T12:34:56.789Z"
      }}
      identityLabels={{ operation: "Operation", operationId: "Operation id", actor: "Actor", actorId: "Actor id", occurredAt: "Occurred at" }}
      detailTitle="Full receipt"
      detailsLabel="View full receipt"
      details={<p>reason-code-with-a-long-machine-suffix-2026-09-13; the complete receipt remains readable and wraps inside the panel.</p>}
      expanded
    />
  );
  assert.match(html, /data-operation-feedback="true"/);
  assert.match(html, /data-operation-phase="success"/);
  assert.match(html, /data-operation-short-status="true"/);
  assert.match(html, />Ready for local use</);
  assert.match(html, /data-operation-identity-field="operation-id"/);
  assert.match(html, /operation-2026-09-13-very-long-identity-9f4d1c2b7a6e/);
  assert.match(html, /data-operation-details="true"/);
  assert.match(html, /reason-code-with-a-long-machine-suffix-2026-09-13/);
  assert.match(html, /aria-expanded="true"/);
  assert.match(html, /aria-controls="tcrn-operation-details-/);
  assert.doesNotMatch(html, /data-operation-short-status="true"[^>]*>[^<]*reason-code/);
});

test("STORY-116 renders every operation phase through the same compact status contract", () => {
  for (const phase of ["idle", "loading", "success", "error"] as const) {
    const html = renderToStaticMarkup(
      <OperationFeedback
        phase={phase}
        identity={{ operation: "Check fixture", actor: "Synthetic operator" }}
        identityLabels={{ operation: "Operation", actor: "Actor" }}
        detailTitle="Receipt details"
        detailsLabel="Details"
        details="Neutral operation details."
      />
    );
    assert.match(html, new RegExp(`data-operation-phase="${phase}"`));
    assert.match(html, /data-operation-short-status="true"/);
    assert.match(html, /data-operation-geometry="responsive-safe"/);
  }
});

test("skeleton remains decorative and supports bounded variants", () => {
  const text = renderToStaticMarkup(<Skeleton variant="text" className="fixture-skeleton" />);
  assert.match(text, /aria-hidden="true"/);
  assert.match(text, /data-skeleton-variant="text"/);
  assert.match(text, /class="tcrn-skeleton tcrn-skeleton--text fixture-skeleton"/);

  const lines = renderToStaticMarkup(<Skeleton variant="rectangular" lines={3} />);
  assert.match(lines, /class="tcrn-skeleton-group"/);
  assert.match(lines, /data-skeleton-lines="3"/);
  assert.equal((lines.match(/class="tcrn-skeleton tcrn-skeleton--rectangular"/g) ?? []).length, 3);
});

test("state surface primitives stay presentation-only", () => {
  const surface = renderToStaticMarkup(
    <StateSurface title="No evidence yet" description="Connect a proof route before claiming readiness." tone="warning" />
  );
  assert.match(surface, /class="tcrn-state-surface tcrn-state-surface--warning"/);
  assert.match(surface, /data-tone="warning"/);
  assert.match(surface, /No evidence yet/);
  assert.doesNotMatch(surface.toLowerCase(), /product accepted|release ready|final mvp accepted/);

  const empty = renderToStaticMarkup(<EmptyState title="No rows" description="Clear filters or add a source." />);
  assert.match(empty, /data-state-surface-kind="empty"/);
  assert.match(empty, /data-tone="neutral"/);

  const error = renderToStaticMarkup(<ErrorState title="Panel unavailable" description="Retry from the owning product route." />);
  assert.match(error, /data-state-surface-kind="error"/);
  assert.match(error, /data-tone="danger"/);
  assert.doesNotMatch(error, /ErrorBoundary/);
});


test("STORY-092 only a danger toast interrupts, so urgency still means something", () => {
  const polite = renderToStaticMarkup(<Toast>Saved</Toast>);
  assert.match(polite, /role="status"/);
  assert.match(polite, /aria-live="polite"/);
  const urgent = renderToStaticMarkup(<Toast tone="danger">Failed</Toast>);
  assert.match(urgent, /role="alert"/);
  assert.match(urgent, /aria-live="assertive"/);
  // A product where every toast is assertive has made none of them urgent.
  for (const tone of ["neutral", "positive", "warning"] as const) {
    assert.match(renderToStaticMarkup(<Toast tone={tone}>m</Toast>), /aria-live="polite"/);
  }
});

test("STORY-092 a toast renders a dismiss control only when it can actually dismiss", () => {
  // An inert X is worse than no X: it says the message can be taken away and then
  // does not take it away.
  assert.doesNotMatch(renderToStaticMarkup(<Toast dismissLabel="Close">m</Toast>), /<button/);
  assert.doesNotMatch(renderToStaticMarkup(<Toast onDismiss={() => {}}>m</Toast>), /<button/);
  assert.match(renderToStaticMarkup(<Toast dismissLabel="Close" onDismiss={() => {}}>m</Toast>), /aria-label="Close"/);
});
