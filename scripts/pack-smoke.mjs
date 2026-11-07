import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./lib/approved-site-source.mjs";

// Retain all three actual archives. A pack receipt alone is not an installation test.
const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== "--destination")) {
  throw new Error("Usage: node scripts/pack-smoke.mjs [--destination <new-or-empty-directory>]");
}
const parent = path.join(ROOT, ".tarball-smoke");
fs.mkdirSync(parent, { recursive: true });
const destination = args.length ? path.resolve(ROOT, args[1]) : fs.mkdtempSync(path.join(parent, "candidate-"));
fs.mkdirSync(destination, { recursive: true });
if (fs.lstatSync(destination).isSymbolicLink() || fs.readdirSync(destination).length) {
  throw new Error("Pack destination must be an empty directory owned by this invocation");
}
const receipts = [];
for (const name of ["ui-tokens", "ui-copy-state", "ui-react"]) {
  const packageRoot = path.join(ROOT, "packages", name);
  const manifest = JSON.parse(fs.readFileSync(path.join(packageRoot, "package.json"), "utf8"));
  execFileSync("corepack", ["pnpm@10.12.1", "pack", "--pack-destination", destination], { cwd: packageRoot, stdio: "pipe" });
  const tarball = `${manifest.name.replace(/^@/, "").replace("/", "-")}-${manifest.version}.tgz`;
  const file = path.join(destination, tarball);
  const bytes = fs.readFileSync(file);
  const members = execFileSync("tar", ["-tzf", file], { encoding: "utf8" }).trim().split("\n").sort();
  const packedManifest = JSON.parse(execFileSync("tar", ["-xOzf", file, "package/package.json"], { encoding: "utf8" }));
  if (Object.values(packedManifest.dependencies ?? {}).some(version => /^(workspace:|link:|file:)/.test(version))) {
    throw new Error(`Unresolved local dependency in ${manifest.name}`);
  }
  for (const required of ["package/LICENSE", "package/README.md", "package/dist/index.js", "package/dist/index.d.ts"]) {
    if (!members.includes(required)) throw new Error(`Missing ${required} in ${tarball}`);
  }
  receipts.push({ name: manifest.name, version: manifest.version, tarball, bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"), dependencies: packedManifest.dependencies ?? {}, members });
}
const receipt = { ok: true, validation: "archive-closure-only; run the independent installed consumer matrix", packages: receipts };
fs.writeFileSync(path.join(destination, "packages.json"), JSON.stringify(receipt, null, 2) + "\n");
console.log(JSON.stringify({ ...receipt, destination: path.relative(ROOT, destination) }, null, 2));
