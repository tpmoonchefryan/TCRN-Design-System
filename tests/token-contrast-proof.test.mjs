import assert from "node:assert/strict";
import test from "node:test";
import { contrast, checkContrast } from "../scripts/lib/published-standard-proof.mjs";
import { readApprovedSource, cssRule, extractBrandSuffixTokens } from "../scripts/lib/approved-site-source.mjs";

test("V4 published v2 resolves the seven nominal findings at unchanged thresholds", () => {
  assert.equal(contrast("#000000", "#ffffff"), 21);
  assert.equal(contrast("#ffffff", "#ffffff"), 1);
  const result = checkContrast();
  assert.deepEqual(result.thresholds, { text: 4.5, icon: 3, edge: 3 });
  assert.deepEqual(result.issues, []);
  const suffixes = extractBrandSuffixTokens(readApprovedSource());
  assert.deepEqual(suffixes.map(({ value, dark }) => [value, dark]), [["#2c63c8", "#7aa0f5"], ["#4b59be", "#6577f3"]]);
  // The former failing inputs still fail the same calculation and threshold.
  assert.ok(contrast("#2c63c8", "#191916") < 4.5);
  assert.ok(contrast("#6577f3", "#ffffff") < 4.5);
  assert.ok(contrast("#85827a", "rgba(235,232,223,.07)", "#191916") < 4.5);
  assert.ok(result.measurements.filter(row => row.conflict).every(row => row.ratio >= row.min));
});

test("V4 K5 prose now matches the unchanged strong ink and 600 weight", () => {
  const board = readApprovedSource().board("02-typography");
  assert.ok(board.html.includes("强调采用主墨 ink 与600字重"));
  assert.ok(!board.html.includes("强调加字重不换色"));
  assert.equal(cssRule(board.css, ".tx").color, "var(--ink-2)");
  assert.equal(cssRule(board.css, ".tx.strong").color, "var(--ink)");
  assert.equal(cssRule(board.css, ".tx.strong")["font-weight"], "600");
});
