import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { EmptyState, ErrorState, Skeleton, StateSurface, StatusBadge, StateView, GateReadinessPanel } from "./Feedback.js";
import { presentCopyState } from "@tcrn/ui-copy-state";

test("stateful components fail closed without product acceptance claims", () => {
  const badge = renderToStaticMarkup(<StatusBadge state={{ state: "future_live" }} />);
  assert.match(badge, /data-state="unknown"/);

  const panel = renderToStaticMarkup(<GateReadinessPanel state={presentCopyState({ state: "proof_required" })} />);
  assert.match(panel, /Proof required/);
  assert.doesNotMatch(panel.toLowerCase(), /product accepted|final mvp accepted|release ready/);
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
});

test("state components reject raw enum label leakage", () => {
  const badge = renderToStaticMarkup(<StatusBadge state={{ state: "external_proof_needed", label: "external_proof_required" }} />);
  assert.match(badge, />External proof needed</);
  assert.doesNotMatch(badge, /external_proof_required/);
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
