import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { ROOT } from "./lib/approved-site-source.mjs";

const [command, ...args] = process.argv.slice(2);
if (!command) throw new Error("Usage: node scripts/with-build-trash.mjs <command> [arguments...]");

const supplied = process.env.TCRN_BUILD_TRASH;
let trash;
if (supplied !== undefined) {
  if (!supplied || !/^trash(?:-|$)/.test(path.basename(path.resolve(ROOT, supplied)))) {
    throw new Error("TCRN_BUILD_TRASH must name an explicit owned trash directory");
  }
  trash = path.resolve(ROOT, supplied);
  const entry = fs.lstatSync(trash, { throwIfNoEntry: false });
  if (entry) {
    if (entry.isSymbolicLink() || !entry.isDirectory()) {
      throw new Error("TCRN_BUILD_TRASH must be a directory, not a symlink or file");
    }
  }
  fs.mkdirSync(trash, { recursive: true });
} else {
  // Retirement uses preserving rename, so the default must share the checkout's
  // filesystem. Vercel's host temp directory can be a separate mount.
  const scratch = path.join(ROOT, ".codex-scratch");
  fs.mkdirSync(scratch, { recursive: true });
  const entry = fs.lstatSync(scratch);
  if (entry.isSymbolicLink() || !entry.isDirectory() || entry.dev !== fs.statSync(ROOT).dev) {
    throw new Error("Default build trash must be a directory on the checkout filesystem");
  }
  trash = fs.mkdtempSync(path.join(scratch, "trash-tcrn-build-"));
}

// Resolve ownership once, before pnpm changes cwd for workspace child commands.
// Retired bytes and reconciliation.jsonl remain here after either child outcome.
console.log(JSON.stringify({
  kind: "build-environment", executionBase: ROOT, trashRoot: trash,
  ownership: supplied === undefined ? "created" : "caller-supplied", command: [command, ...args],
}));
const result = spawnSync(command, args, {
  cwd: ROOT, env: { ...process.env, TCRN_BUILD_TRASH: trash }, stdio: "inherit",
});
if (result.error) throw result.error;
if (result.signal) process.kill(process.pid, result.signal);
else process.exit(result.status);
