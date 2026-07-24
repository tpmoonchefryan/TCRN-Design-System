import assert from "node:assert/strict";
import test from "node:test";

import { classifyHtml, exitCodeForReceipt, extractVisibleText } from "./internal-vocabulary-scan.mjs";

const rulesOf = (hits) => hits.map((hit) => hit.rule).sort();

test("classifier fires on each forbidden class in rendered text", () => {
  const { hits, exempted } = classifyHtml(
    "fixture.html",
    "<p>live Codex dispatch by Elara for INIT-008</p>"
  );
  assert.deepEqual(rulesOf(hits), ["codex", "initiative-id", "persona"]);
  assert.equal(exempted.length, 0);
});

test("registered fixture domain data is exempt, not a hit", () => {
  const { hits, exempted } = classifyHtml("fixture.html", "<p>INIT-WM owned by the team</p>");
  assert.equal(hits.length, 0);
  assert.equal(exempted.length, 1);
  assert.equal(exempted[0].rule, "initiative-id");
});

test("comments and script/style blocks are stripped before matching", () => {
  // Regression guard for the RENDERED-text surface choice: S036 lives in a
  // comment and Gemini inside a <script>; neither renders, so neither is a hit.
  const { hits } = classifyHtml(
    "fixture.html",
    "<!-- S036 --><script>Gemini candidate</script><style>.persona::after{content:'Rowan'}</style><p>ok</p>"
  );
  assert.equal(hits.length, 0);
});

test("exemption is by exact literal — near-miss keys still fire", () => {
  const { hits, exempted } = classifyHtml("fixture.html", "<p>INIT-WM vs INIT-008</p>");
  assert.deepEqual(rulesOf(hits), ["initiative-id"]);
  assert.equal(hits[0].count, 1);
  assert.equal(exempted.length, 1);
  assert.equal(exempted[0].rule, "initiative-id");
});

test("TCRN-DS keys in visible text fire the tcrn-ds rule", () => {
  const { hits } = classifyHtml("fixture.html", "<p>See TCRN-DS-STORY-053 for details.</p>");
  assert.ok(rulesOf(hits).includes("tcrn-ds-key"));
  assert.equal(hits.every((hit) => hit.matchSha256.length === 64), true);
});

test("internal story-key rule matches S0xx but not shorter or longer runs", () => {
  assert.equal(classifyHtml("f.html", "<p>S036</p>").hits.length, 1);
  assert.equal(classifyHtml("f.html", "<p>S0 and S1234</p>").hits.length, 0);
});

test("hits are redacted — no raw forbidden string is retained", () => {
  const { hits } = classifyHtml("fixture.html", "<p>Codex</p>");
  assert.equal(hits.length, 1);
  assert.match(hits[0].matchSha256, /^[0-9a-f]{64}$/);
  assert.equal(hits[0].matchLength, 5);
  assert.equal(Object.prototype.hasOwnProperty.call(hits[0], "match"), false);
});

test("visible-text extractor drops tags but keeps body copy", () => {
  const text = extractVisibleText("<div class=\"Codex\">Buttons &amp; badges</div>");
  assert.match(text, /Buttons & badges/);
  // `Codex` only appears as an attribute value, so it must not survive extraction.
  assert.doesNotMatch(text, /Codex/);
});

test("receipt exit helper fails closed for non-ok receipts", () => {
  assert.equal(exitCodeForReceipt({ ok: false }), 1);
  assert.equal(exitCodeForReceipt({ ok: true }), 0);
});
