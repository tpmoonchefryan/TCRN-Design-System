import fs from "node:fs";
import path from "node:path";
import { ROOT, sha256 } from "./lib/approved-site-source.mjs";
import { listFiles, reconcileOutput } from "./lib/generated-output.mjs";

const portal = path.join(ROOT, "apps/storybook/storybook-static");
const manager = path.join(ROOT, "apps/storybook/storybook-preview-static");
const output = path.join(ROOT, "apps/storybook/distribution-static");
const authority = JSON.parse(fs.readFileSync(path.join(portal, "design-authority.json"), "utf8"));
const index = JSON.parse(fs.readFileSync(path.join(portal, "ai/index.json"), "utf8"));
if (JSON.stringify(authority.identity) !== JSON.stringify(index.identity)) throw new Error("Portal/AI identity mismatch");

// The portal keeps the root. The official build owns only its own subdirectory.
const files = new Map();
for (const [source, prefix] of [[portal, ""], [manager, "storybook/"]]) {
  for (const file of listFiles(source)) {
    const target = prefix + file;
    if (files.has(target)) throw new Error(`Overlapping documentation output: ${target}`);
    files.set(target, fs.readFileSync(path.join(source, file)));
  }
}
for (const required of ["index.html", "storybook/index.html", "storybook/iframe.html", "storybook/index.json", "ai/index.json", `ai/${authority.candidate.version}/index.json`, "llms.txt"]) {
  if (!files.has(required)) throw new Error(`Missing public documentation entry: ${required}`);
}
const inventory = [...files].map(([file, bytes]) => ({ path: file, bytes: bytes.length, sha256: sha256(bytes) }));
const manifest = {
  schemaVersion: "tcrn.distribution-output.v1",
  publication: "local-candidate-only",
  candidate: authority.candidate,
  identity: authority.identity,
  entries: { portal: "/", storybook: "/storybook/", preview: "/storybook/iframe.html", ai: "/ai/index.json", llms: "/llms.txt", authority: "/design-authority.json" },
  files: inventory,
};
files.set("distribution-manifest.json", Buffer.from(JSON.stringify(manifest, null, 2) + "\n"));
reconcileOutput(output, [...files.keys()]);
for (const [file, bytes] of files) {
  const target = path.join(output, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, bytes);
}
console.log(JSON.stringify({ output: path.relative(ROOT, output), files: files.size, candidate: authority.candidate, entries: manifest.entries }, null, 2));
