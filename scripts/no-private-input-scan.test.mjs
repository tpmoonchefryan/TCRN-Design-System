import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { exitCodeForReceipt } from "./no-private-input-scan.mjs";

const scanScript = fileURLToPath(new URL("./no-private-input-scan.mjs", import.meta.url));

test("scan command fails closed when a file is skipped", () => {
  const root = mkdtempSync(join(tmpdir(), "tcrn-scan-skip-"));
  writeFileSync(join(root, "large-fixture.txt"), "x".repeat(1_000_001));

  const result = spawnSync(process.execPath, [scanScript], {
    cwd: root,
    encoding: "utf8"
  });

  assert.equal(result.status, 1);
  const receipt = JSON.parse(readFileSync(join(root, "docs/verification/internal-alpha/no-overclaim-scan.json"), "utf8"));
  assert.equal(receipt.ok, false);
  assert.equal(receipt.hits.length, 0);
  assert.equal(receipt.skippedFiles.length, 1);
});

test("scan command records binary visual receipts without failing text scan", () => {
  const root = mkdtempSync(join(tmpdir(), "tcrn-scan-visual-receipt-"));
  const screenshotDir = join(root, "docs/verification/internal-alpha/screenshots");
  mkdirSync(screenshotDir, { recursive: true });
  writeFileSync(join(screenshotDir, "large-proof.png"), "x".repeat(1_000_001));

  const result = spawnSync(process.execPath, [scanScript], {
    cwd: root,
    encoding: "utf8"
  });

  assert.equal(result.status, 0);
  const receipt = JSON.parse(readFileSync(join(root, "docs/verification/internal-alpha/no-overclaim-scan.json"), "utf8"));
  assert.equal(receipt.ok, true);
  assert.equal(receipt.hits.length, 0);
  assert.equal(receipt.skippedFiles.length, 0);
  assert.equal(receipt.binaryVisualReceiptExclusions.length, 1);
});

test("scan command records Storybook visual proof binary receipts without failing text scan", () => {
  const root = mkdtempSync(join(tmpdir(), "tcrn-scan-storybook-visual-receipt-"));
  const screenshotDir = join(root, "docs/verification/storybook-visual-proof/screenshots/baseline");
  mkdirSync(screenshotDir, { recursive: true });
  writeFileSync(join(screenshotDir, "docs-shell-overview__desktop-1440x900.png"), "x".repeat(1_000_001));

  const result = spawnSync(process.execPath, [scanScript], {
    cwd: root,
    encoding: "utf8"
  });

  assert.equal(result.status, 0);
  const receipt = JSON.parse(readFileSync(join(root, "docs/verification/internal-alpha/no-overclaim-scan.json"), "utf8"));
  assert.equal(receipt.ok, true);
  assert.equal(receipt.hits.length, 0);
  assert.equal(receipt.skippedFiles.length, 0);
  assert.equal(receipt.binaryVisualReceiptExclusions.length, 1);
});

test("scan command ignores local Gemini candidate scratch space", () => {
  const root = mkdtempSync(join(tmpdir(), "tcrn-scan-gemini-scratch-"));
  const snippetDir = join(root, "gemini_chats/02-highlight-effect/snippets");
  mkdirSync(snippetDir, { recursive: true });
  writeFileSync(join(snippetDir, "Highlight.tsx"), "const API_TOKEN = 'local-candidate-placeholder';\n");

  const result = spawnSync(process.execPath, [scanScript], {
    cwd: root,
    encoding: "utf8"
  });

  assert.equal(result.status, 0);
  const receipt = JSON.parse(readFileSync(join(root, "docs/verification/internal-alpha/no-overclaim-scan.json"), "utf8"));
  assert.equal(receipt.ok, true);
  assert.equal(receipt.hits.length, 0);
  assert.equal(receipt.skippedFiles.length, 0);
});

test("receipt exit helper fails closed when negative fixture checks fail", () => {
  const receipt = {
    ok: false,
    hits: [],
    skippedFiles: [],
    negativeFixtureChecks: [{ id: "synthetic_negative_fixture", passed: false }]
  };

  assert.equal(exitCodeForReceipt(receipt), 1);
});

test("receipt exit helper exits zero only for ok receipts", () => {
  assert.equal(exitCodeForReceipt({ ok: true }), 0);
});
