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

test("clipboard copy button says its own five words in the reader's language", () => {
  // All five were English literals in parameter defaults, and four of them are
  // announced through the `aria-live` region — so on a translated page a screen
  // reader was interrupted mid-task to say "Copy failed" in a language the rest of
  // the page was not in.
  const zh = renderToStaticMarkup(<ClipboardCopyButton locale="zh-CN" text="tenant-42" ariaLabel="复制会话令牌" />);
  assert.match(zh, />复制</);
  assert.equal(zh.includes(">Copy<"), false, "the idle label is not English on a zh-CN page");

  // The sixth was hidden inside `safeCopyActionLabel`: when the caller's own name
  // contains the copied value the component substitutes its own, and that
  // substitute was English too — reached by exactly the page most likely to be
  // translated, since a caller who interpolated the value wrote the label by hand.
  const zhFailClosed = renderToStaticMarkup(<ClipboardCopyButton locale="zh-CN" text="tenant-42" ariaLabel="复制 tenant-42" />);
  assert.match(zhFailClosed, /aria-label="复制该值"/);
  assert.equal(zhFailClosed.includes("Copy value"), false, "the fail-closed name is not English on a zh-CN page");
  assert.equal(zhFailClosed.includes("复制 tenant-42"), false, "the copied value still does not reach the accessible name");

  // Two more locales, so the table is proved to hold five rather than two.
  assert.match(renderToStaticMarkup(<ClipboardCopyButton locale="ja" text="x" ariaLabel="値をコピー" />), />コピー</);
  assert.match(renderToStaticMarkup(<ClipboardCopyButton locale="fr" text="x" ariaLabel="Copier la valeur" />), />Copier</);
  assert.match(renderToStaticMarkup(<ClipboardCopyButton locale="ko" text="x" ariaLabel="값 복사" />), />복사</);

  // A caller's own label still wins, and no locale keeps today's English.
  const explicit = renderToStaticMarkup(<ClipboardCopyButton locale="zh-CN" text="x" ariaLabel="复制" idleLabel="拷贝" />);
  assert.match(explicit, />拷贝</);
  assert.match(renderToStaticMarkup(<ClipboardCopyButton text="x" ariaLabel="Copy value" />), />Copy</);
});
