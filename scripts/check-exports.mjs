import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const packagePaths = [
  "packages/ui-tokens",
  "packages/ui-copy-state",
  "packages/ui-react"
];

const checks = [];
for (const packagePath of packagePaths) {
  const manifest = JSON.parse(readFileSync(join(packagePath, "package.json"), "utf8"));
  const rootExport = manifest.exports["."];
  const jsPath = join(packagePath, rootExport.default);
  const typePath = join(packagePath, rootExport.types);
  checks.push({
    name: manifest.name,
    jsPath,
    typePath,
    jsExists: existsSync(jsPath),
    typeExists: existsSync(typePath)
  });
  await import(pathToFileURL(join(process.cwd(), jsPath)).href);
}

const ok = checks.every((check) => check.jsExists && check.typeExists);
console.log(JSON.stringify({ ok, checks }, null, 2));
if (!ok) {
  process.exit(1);
}
