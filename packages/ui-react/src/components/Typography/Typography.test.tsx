import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { Highlight } from "./Typography.js";

test("highlight renders plain text when the query is empty", () => {
  const html = renderToStaticMarkup(<Highlight text="TCRN search result" query="" />);
  assert.match(html, />TCRN search result</);
  assert.doesNotMatch(html, /<mark/);
});

test("highlight marks case-insensitive matches without changing text content", () => {
  const html = renderToStaticMarkup(<Highlight text="Gate proof needs proof owner" query="proof" />);
  assert.match(html, /Gate <mark class="tcrn-highlight-mark">proof<\/mark> needs <mark class="tcrn-highlight-mark">proof<\/mark> owner/);
});

test("highlight escapes source text through React text nodes", () => {
  const html = renderToStaticMarkup(<Highlight text="<script>alert('x')</script> proof" query="proof" />);
  assert.match(html, /&lt;script&gt;alert/);
  assert.doesNotMatch(html, /<script>/);
  assert.doesNotMatch(html, /dangerouslySetInnerHTML/);
});
