import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { build } from "esbuild";
import { ROOT } from "./lib/approved-site-source.mjs";

const args = process.argv.slice(2);
if (args.length !== 2 || args[0] !== "--destination") throw new Error("Usage: node scripts/pack-consumer-tools.mjs --destination <new-directory>");
const destination = path.resolve(ROOT, args[1]);
if (fs.existsSync(destination)) throw new Error("Consumer tool destination must be new; retained artifacts are never overwritten");
const staging = path.join(destination, "source");
fs.mkdirSync(staging, { recursive: true });
const version = JSON.parse(fs.readFileSync(path.join(ROOT, "packages/ui-react/package.json"), "utf8")).version;
const playwright = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8")).devDependencies["@playwright/test"];
const typescript = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8")).devDependencies.typescript;
const candidate = { commit: execFileSync("git", ["rev-parse", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim(), dirty: execFileSync("git", ["status", "--porcelain"], { cwd: ROOT, encoding: "utf8" }).trim().length > 0 };
const inputs = ["scripts/consumer-contract-check.mjs", "scripts/consumer-layout-check.mjs", "packages/ui-react/dist/verification/ShellPreferenceEvidence.js", "packages/ui-react/src/verification/ShellPreferenceEvidence.ts", "scripts/pack-consumer-tools.mjs"];
const sources = inputs.map(relative => {
  const bytes = fs.readFileSync(path.join(ROOT, relative));
  const target = path.join(staging, "inputs", relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, bytes);
  return { path: relative, sha256: createHash("sha256").update(bytes).digest("hex") };
});
await build({ entryPoints: [path.join(ROOT, inputs[0])], outfile: path.join(staging, "lib/checker.mjs"),
  bundle: true, platform: "node", format: "esm", target: "node22", external: ["typescript", "@playwright/test"] });
fs.mkdirSync(path.join(staging, "bin"));
fs.writeFileSync(path.join(staging, "bin/consumer-contract-check.mjs"), `#!/usr/bin/env node
import { checkConsumerContract, checkConsumerPage } from "../lib/checker.mjs";
try {
  const args = process.argv.slice(2);
  const allowed = ["--project", "--index", "--declaration", "--layout-url"];
  const flags = args.filter((_, index) => index % 2 === 0);
  if (![6, 8].includes(args.length) || !["--project", "--index", "--declaration"].every(flag => flags.includes(flag)) || flags.some(flag => !allowed.includes(flag)) || new Set(flags).size !== args.length / 2) throw new Error("Usage: tcrn-ds-check --project <consumer> --index <artifact>/ai/index.json --declaration <relative.json> [--layout-url <consumer-page>]");
  const get = flag => args.includes(flag) ? args[args.indexOf(flag) + 1] : undefined;
  const result = checkConsumerContract({ projectRoot: get("--project"), indexPath: get("--index"), declarationPath: get("--declaration") });
  if (get("--layout-url")) {
    result.layout = await checkConsumerPage(get("--layout-url"));
    result.ok = result.ok && result.layout.ok;
  }
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exitCode = 1;
} catch (error) { console.error(JSON.stringify({ ok: false, error: error.message })); process.exitCode = 1; }
`);
fs.chmodSync(path.join(staging, "bin/consumer-contract-check.mjs"), 0o755);
fs.writeFileSync(path.join(staging, "package.json"), JSON.stringify({ name: "@tcrn/ds-consumer-tools", version,
  type: "module", license: "Apache-2.0", engines: { node: ">=22" },
  bin: { "tcrn-ds-check": "./bin/consumer-contract-check.mjs" },
  files: ["bin", "lib", "inputs", "source-manifest.json", "README.md", "LICENSE"], dependencies: { typescript, "@playwright/test": playwright } }, null, 2) + "\n");
fs.copyFileSync(path.join(ROOT, "LICENSE"), path.join(staging, "LICENSE"));
fs.writeFileSync(path.join(staging, "source-manifest.json"), JSON.stringify({ version, candidate, status: "local-candidate-unpublished", sources }, null, 2) + "\n");
fs.writeFileSync(path.join(staging, "README.md"), `# DS consumer tools ${version}\n\nLocal unpublished candidate. Install the archive and its exact TypeScript and Playwright runtime dependencies.\nRun tcrn-ds-check --project . --index ./producer/ai/index.json --declaration .tcrn-ds.json.\nThe offline producer AI tree and trusted identity must come from the same candidate.\nThe CLI bundles the unmodified checker and pure observation validator; inputs/ retains their exact bytes.\nAdd --layout-url http://127.0.0.1:PORT/page to measure actual action and fill-field geometry at desktop and narrow widths in Chromium. Install the matching browser with npx playwright install chromium when absent.\nIt does not authenticate reports or replace types, keyboard/focus, API or publication checks.\n`);
const result = JSON.parse(execFileSync("npm", ["pack", "--json", "--pack-destination", destination], { cwd: staging, encoding: "utf8" }))[0];
const tarball = path.join(destination, result.filename);
console.log(JSON.stringify({ name: "@tcrn/ds-consumer-tools", version, tarball: path.relative(ROOT, tarball),
  sha256: createHash("sha256").update(fs.readFileSync(tarball)).digest("hex"), sources, runtimeDependencies: { typescript, "@playwright/test": playwright } }, null, 2));
