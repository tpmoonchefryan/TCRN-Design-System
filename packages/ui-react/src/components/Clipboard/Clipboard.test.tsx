import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { ClipboardCopyButton } from "./Clipboard.js";
import { DEFAULT_RESET_DELAY_MS, clipboardLabelsFor } from "./clipboard-copy.js";
import { mountStaticClipboardCopyButton } from "./static-clipboard.js";
import { tcrnComponentCss } from "../../styles/index.js";

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

test("the static bridge is safe to import and call where there is no document", () => {
  // A server render or a test runner imports the package without a DOM. The bridge must
  // neither throw there nor touch anything; it only starts work in a browser.
  assert.equal(typeof document, "undefined");
  const handle = mountStaticClipboardCopyButton({ root: {} as HTMLElement });
  assert.equal(typeof handle.destroy, "function");
  assert.doesNotThrow(() => handle.destroy());
});

test("the server-rendered construct carries what the static bridge reads, and only when asked", () => {
  // The static construct is the component's own markup plus one attribute the consumer
  // adds on purpose. Without that attribute the component still never writes the value.
  const construct = renderToStaticMarkup(
    <ClipboardCopyButton text="synthetic-trace-id-042" ariaLabel="Copy trace ID" idleLabel="Copy trace ID" data-clipboard-text="synthetic-trace-id-042" />
  );
  assert.match(construct, /^<button [^>]*type="button"/);
  assert.match(construct, /data-clipboard-copy-state="idle"/);
  assert.match(construct, /data-clipboard-text="synthetic-trace-id-042"/);
  assert.match(construct, /aria-live="polite" role="status"/);
  assert.match(construct, />Copy trace ID</);

  const plain = renderToStaticMarkup(<ClipboardCopyButton text="synthetic-trace-id-042" ariaLabel="Copy trace ID" />);
  assert.doesNotMatch(plain, /synthetic-trace-id-042/);
});

test("the button and the static bridge read one five-locale label table", () => {
  for (const locale of ["zh-CN", "en", "ja", "ko", "fr"] as const) {
    const labels = clipboardLabelsFor(locale);
    const html = renderToStaticMarkup(<ClipboardCopyButton locale={locale} text="x" ariaLabel={labels.copyValue} />);
    assert.match(html, new RegExp(`>${labels.idle}<`));
    assert.equal(new Set([labels.idle, labels.copying, labels.copied, labels.failed, labels.unsupported]).size, 5, `${locale} states are distinct`);
  }
  assert.equal(DEFAULT_RESET_DELAY_MS, 2000);
});

test("copied, failed and unsupported change the ink only; idle and copying keep the variant's pair", () => {
  const sheet = tcrnComponentCss.replace(/\/\*[\s\S]*?\*\//g, "");
  for (const [state, token] of [
    ["copied", "ok"],
    ["failed", "bad"],
    ["unsupported", "ink-3"]
  ] as const) {
    const rule = new RegExp(`\\.tcrn-button\\[data-clipboard-copy-state="${state}"\\]\\s*\\{([^}]*)\\}`).exec(sheet);
    assert.ok(rule, `${state} has its rule`);
    const declarations = rule[1].split(";").map((item) => item.trim()).filter(Boolean);
    // Default, hover, active and focus all carry the result: the pointer and the focus are
    // still on the button when it arrives. Fill and edge are never touched.
    assert.deepEqual(
      declarations,
      ["d", "h", "a", "f"].map((slot) => `--tcrn-pair-ink-${slot}: var(--tcrn-color-${token})`)
    );
  }
  // Idle and copying keep the variant's pair: a rule keyed on either state may pick an icon,
  // but it never sets a pair variable or a colour.
  for (const [, body] of sheet.matchAll(/[^{}]*data-clipboard-copy-state="(?:idle|copying)"[^{}]*\{([^}]*)\}/g)) {
    assert.doesNotMatch(body, /--tcrn-pair-|color|background|box-shadow/);
  }
});

test("the copy button carries one icon per settled state and the stylesheet shows the current one", () => {
  const html = renderToStaticMarkup(<ClipboardCopyButton text="x" ariaLabel="Copy trace ID" idleLabel="Copy trace ID" />);
  // idle copy, copied check, failed alert-triangle, unsupported info (Actions board); all
  // four are in the markup, so the static bridge only has to switch the state attribute.
  for (const [state, name] of [
    ["idle", "copy"],
    ["copied", "check"],
    ["failed", "alert-triangle"],
    ["unsupported", "info"]
  ] as const) {
    assert.match(html, new RegExp(`<svg(?=[^>]*data-clipboard-state-icon="${state}")(?=[^>]*data-icon-name="${name}")(?=[^>]*aria-hidden="true")[^>]*>`));
  }
  assert.doesNotMatch(html, /data-clipboard-state-icon="copying"/);
  // The icons come before the label, after the loader.
  assert.match(html, /tcrn-button__spinner[\s\S]*data-clipboard-state-icon="idle"[\s\S]*<span class="tcrn-button__label">Copy trace ID<\/span>/);

  const sheet = tcrnComponentCss.replace(/\/\*[\s\S]*?\*\//g, "");
  // Hidden by default, in the loader's box.
  assert.match(sheet, /\.tcrn-icon\[data-clipboard-state-icon\] \{\s*display: none;\s*inline-size: 13px;\s*block-size: 13px;\s*\}/);
  assert.match(sheet, /\.tcrn-button--lg > \.tcrn-icon\[data-clipboard-state-icon\] \{\s*inline-size: 15px;\s*block-size: 15px;\s*\}/);
  // Shown only where the button's state names it; copying shows none of them.
  const shown = /((?:\[data-clipboard-copy-state="[a-z]+"\] > \.tcrn-icon\[data-clipboard-state-icon="[a-z]+"\],?\s*)+)\{\s*display: inline-block;\s*\}/.exec(sheet);
  assert.ok(shown, "the show rule exists");
  const pairs = [...shown[1].matchAll(/\[data-clipboard-copy-state="([a-z]+)"\] > \.tcrn-icon\[data-clipboard-state-icon="([a-z]+)"\]/g)].map(([, state, icon]) => [state, icon]);
  assert.deepEqual(pairs, [
    ["idle", "idle"],
    ["copied", "copied"],
    ["failed", "failed"],
    ["unsupported", "unsupported"]
  ]);
});

test("the copy button carries the loader for its busy state and repeats its label in title", () => {
  const html = renderToStaticMarkup(<ClipboardCopyButton text="x" ariaLabel="Copy trace ID" idleLabel="Copy trace ID" />);
  // Rendered in every state and shown by the stylesheet only while aria-busy is set, so the
  // static bridge, which only sets aria-busy, shows the same loader.
  assert.match(html, /data-icon-name="loader-circle"/);
  assert.match(html, /class="[^"]*\btcrn-button__spinner\b[^"]*"/);
  assert.doesNotMatch(html, /aria-busy/);
  assert.match(html, /<span class="tcrn-button__label">Copy trace ID<\/span>/);
  assert.match(html, /title="Copy trace ID"/);

  // A disabled copy button puts the reason after its label in title (TCRN-DS-SUB-079).
  const blocked = renderToStaticMarkup(
    <ClipboardCopyButton text="x" ariaLabel="Copy audit ID" disabledReason="Requires owning product permission" />
  );
  assert.match(blocked, /title="Copy — Requires owning product permission"/);
});
