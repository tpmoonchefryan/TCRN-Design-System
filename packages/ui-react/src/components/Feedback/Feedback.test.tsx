import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { StatusBadge, StateView, GateReadinessPanel } from "./Feedback.js";
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
