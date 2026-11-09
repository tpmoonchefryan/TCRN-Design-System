import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import path from "node:path";

// Executed reports are retained outputs. The tracked verification snapshots stay
// historical, so verification does not change the source used by later builds.
export function writeVerificationReport(name, result, root = process.cwd()) {
  const generatedAt = new Date().toISOString();
  const options = { cwd: root, encoding: "utf8" };
  const probe = spawnSync("git", ["rev-parse", "--is-inside-work-tree"], options);
  if (probe.error) throw probe.error;
  const source = probe.status === 0
    ? {
      commit: execFileSync("git", ["rev-parse", "HEAD"], options).trim(),
      dirty: execFileSync("git", ["status", "--porcelain=v1"], options).trim().length > 0
    }
    : { commit: null, dirty: null, status: "unavailable", reason: probe.stderr.trim() };
  const parent = path.join(root, "docs/verification/generated");
  mkdirSync(parent, { recursive: true });
  const directory = mkdtempSync(path.join(parent, `${generatedAt.replaceAll(":", "-")}-${name}-`));
  const file = path.join(directory, "report.json");
  writeFileSync(file, `${JSON.stringify({ schemaVersion: "tcrn.verification-report.v1", generatedAt, source, result }, null, 2)}\n`, { flag: "wx" });
  console.error(`Retained verification report: ${path.relative(root, file)}`);
  return file;
}
