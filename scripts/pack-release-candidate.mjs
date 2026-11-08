import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { ROOT, sha256 } from "./lib/approved-site-source.mjs";

const args = process.argv.slice(2);
if (args.length !== 2 || args[0] !== "--destination") throw new Error("Usage: node scripts/pack-release-candidate.mjs --destination <new-directory>");
const destination = path.resolve(args[1]);
if (fs.existsSync(destination)) throw new Error("Release candidate destination must be new");
const docs = path.join(ROOT, "apps/storybook/distribution-static");
const distribution = JSON.parse(fs.readFileSync(path.join(docs, "distribution-manifest.json"), "utf8"));
const commit = execFileSync("git", ["rev-parse", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim();
const dirty = execFileSync("git", ["status", "--porcelain=v1"], { cwd: ROOT, encoding: "utf8" }).trim().length > 0;
if (commit !== distribution.candidate.commit || dirty !== distribution.candidate.dirty) throw new Error("Rebuild public docs from the current source before packing");
for (const file of distribution.files) {
  if (sha256(fs.readFileSync(path.join(docs, file.path))) !== file.sha256) throw new Error(`Documentation bytes changed: ${file.path}`);
}
const libraries = path.join(destination, "libraries");
execFileSync(process.execPath, ["scripts/pack-smoke.mjs", "--destination", libraries], { cwd: ROOT, stdio: "inherit" });
const tools = path.join(destination, "tools");
execFileSync(process.execPath, ["scripts/pack-consumer-tools.mjs", "--destination", tools], { cwd: ROOT, stdio: "inherit" });
const receipt = JSON.parse(fs.readFileSync(path.join(libraries, "packages.json"), "utf8"));
const version = distribution.candidate.version;
const rows = [...receipt.packages, { name: "@tcrn/ds-consumer-tools", version, tarball: `tcrn-ds-consumer-tools-${version}.tgz` }];
const packages = rows.map(row => {
  const source = path.join(row.name === "@tcrn/ds-consumer-tools" ? tools : libraries, row.tarball);
  const bytes = fs.readFileSync(source);
  fs.copyFileSync(source, path.join(destination, row.tarball));
  return { name: row.name, version: row.version, archive: row.tarball, bytes: bytes.length, sha256: sha256(bytes), plannedUrl: `https://github.com/tpmoonchefryan/TCRN-Design-System/releases/download/v${version}/${row.tarball}` };
});
if (packages.some(row => row.version !== version)) throw new Error("Release package versions must match the docs candidate");
for (const row of receipt.packages) {
  for (const [name, dependency] of Object.entries(row.dependencies)) {
    if (name.startsWith("@tcrn/") && !packages.some(candidate => candidate.name === name && candidate.version === dependency)) throw new Error(`Internal dependency is not in this exact release: ${name}@${dependency}`);
  }
}
const manifest = {
  schemaVersion: "tcrn.release-candidate.v1", publication: "unpublished",
  repository: "tpmoonchefryan/TCRN-Design-System", plannedTag: `v${version}`,
  candidate: { version, commit, dirty }, identity: distribution.identity,
  docsManifestSha256: sha256(fs.readFileSync(path.join(docs, "distribution-manifest.json"))),
  plannedUrlsReachability: "not-verified; no release created by this command",
  packages,
};
fs.writeFileSync(path.join(destination, "release-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
fs.writeFileSync(path.join(destination, "SHA256SUMS"), packages.map(row => `${row.sha256}  ${row.archive}\n`).join(""));
console.log(JSON.stringify(manifest, null, 2));
