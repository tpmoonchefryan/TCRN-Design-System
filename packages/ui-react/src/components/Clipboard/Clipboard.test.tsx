import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { ClipboardCopyButton } from "./Clipboard.js";

test("clipboard copy button renders as a native button without exposing copied text", () => {
  const html = renderToStaticMarkup(
    <ClipboardCopyButton text="secret-token-123" ariaLabel="Copy session token" idleLabel="Copy token" />
  );

  assert.match(html, /type="button"/);
  assert.match(html, /aria-label="Copy session token"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /role="status"/);
  assert.match(html, /data-clipboard-copy-state="idle"/);
  assert.match(html, /Copy token/);
  assert.doesNotMatch(html, /secret-token-123/);
});

test("clipboard copy button fails closed when the accessible label includes the copied value", () => {
  const html = renderToStaticMarkup(
    <ClipboardCopyButton text="tenant-42" ariaLabel="Copy tenant-42" />
  );

  assert.match(html, /aria-label="Copy value"/);
  assert.doesNotMatch(html, /Copy tenant-42/);
});

test("clipboard copy button exposes disabled reasons without leaking copied text", () => {
  const html = renderToStaticMarkup(
    <ClipboardCopyButton
      text="hidden-audit-id"
      ariaLabel="Copy audit ID"
      disabledReason="Requires owning product permission"
    />
  );

  assert.match(html, /disabled=""/);
  assert.match(html, /Requires owning product permission/);
  assert.doesNotMatch(html, /hidden-audit-id/);
});
