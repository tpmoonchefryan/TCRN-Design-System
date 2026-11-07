import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { ROOT } from "../scripts/lib/approved-site-source.mjs";

test("a release checkout without tags cannot claim its release-history check passed", () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "tcrn-release-history-"));
  try {
    fs.mkdirSync(path.join(fixture, "scripts"));
    fs.copyFileSync(path.join(ROOT, "scripts/changelog-release-sections-proof.mjs"), path.join(fixture, "scripts/changelog-release-sections-proof.mjs"));
    fs.writeFileSync(path.join(fixture, "CHANGELOG.md"), "## Unreleased\n\n### Candidate\n");
    const init = spawnSync("git", ["init", "--quiet"], { cwd: fixture, encoding: "utf8" });
    assert.equal(init.status, 0, init.stderr);
    const result = spawnSync(process.execPath, ["scripts/changelog-release-sections-proof.mjs"], { cwd: fixture, encoding: "utf8" });
    assert.equal(result.status, 1, result.stderr);
    const receipt = JSON.parse(result.stdout);
    assert.equal(receipt.ok, false);
    assert.equal(receipt.skipped, "no-tags-visible");
  } finally { fs.rmSync(fixture, { recursive: true }); }
});
