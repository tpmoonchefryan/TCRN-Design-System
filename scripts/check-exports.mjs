import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { APPROVED_API_BOARDS } from "./lib/published-standard-proof.mjs";
import { ROOT } from "./lib/approved-site-source.mjs";

const checks = [];
for (const name of ["ui-tokens", "ui-copy-state", "ui-react"]) {
  const base = path.join(ROOT, "packages", name);
  const manifest = JSON.parse(fs.readFileSync(path.join(base, "package.json"), "utf8"));
  for (const [subpath, target] of Object.entries(manifest.exports)) {
    for (const [condition, relative] of Object.entries(typeof target === "string" ? { asset: target } : target)) {
      const resolved = path.resolve(base, relative);
      if (!resolved.startsWith(base + path.sep)) throw new Error(`Export escapes package: ${name}/${subpath}`);
      let files = [resolved];
      if (resolved.includes("*")) {
        const directory = path.dirname(resolved);
        const [prefix, suffix] = path.basename(resolved).split("*");
        files = fs.readdirSync(directory).filter(file => file.startsWith(prefix) && file.endsWith(suffix)).map(file => path.join(directory, file));
      }
      const exists = files.length > 0 && files.every(file => fs.statSync(file).isFile());
      if (exists && condition === "default") await import(pathToFileURL(resolved).href);
      checks.push({ name: manifest.name, subpath, condition, exists, files: files.length });
    }
  }
}
const ui = await import(pathToFileURL(path.join(ROOT, "packages/ui-react/dist/index.js")).href);
for (const name of [...ui.componentLibraryPublicComponentNames, ...ui.componentLibraryPublicUtilityNames]) {
  checks.push({ name, condition: "registered-runtime-export", exists: Object.hasOwn(ui, name) });
}
const approved = await import(pathToFileURL(path.join(ROOT, "packages/ui-react/dist/approved.js")).href);
checks.push({ name: "formal-component-family-count", exists: Object.keys(APPROVED_API_BOARDS).length === 28 && Object.keys(APPROVED_API_BOARDS).every(name => Object.hasOwn(approved, name)) });
const ok = checks.every(check => check.exists);
console.log(JSON.stringify({ ok, checks }, null, 2));
if (!ok) process.exitCode = 1;
