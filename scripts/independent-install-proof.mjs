import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import http from "node:http";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";
import { ROOT } from "./lib/approved-site-source.mjs";

const flags = process.argv.slice(2);
const resumeBrowser = flags.includes("--resume-browser");
const value = flag => flags[flags.indexOf(flag) + 1];
if (flags.length !== (resumeBrowser ? 9 : 8) || !["--archives", "--tools", "--producer", "--destination"].every(flag => flags.includes(flag))) {
  throw new Error("Usage: node scripts/independent-install-proof.mjs --archives <three-package-directory> --tools <tool.tgz> --producer <offline-artifact> --destination <new-external-directory>");
}
const destination = path.resolve(value("--destination"));
if (destination === ROOT || destination.startsWith(ROOT + path.sep) || (fs.existsSync(destination) && !resumeBrowser)) throw new Error("Use a new directory outside the monorepo");
for (let parent = path.dirname(destination); ; parent = path.dirname(parent)) {
  if (fs.existsSync(path.join(parent, "node_modules"))) throw new Error(`Ancestor node_modules would contaminate the consumer: ${parent}`);
  if (parent === path.dirname(parent)) break;
}
fs.mkdirSync(destination, { recursive: true });
const archiveRoot = path.resolve(value("--archives"));
const packageReceipt = JSON.parse(fs.readFileSync(path.join(archiveRoot, "packages.json"), "utf8"));
const archives = path.join(destination, "archives");
fs.mkdirSync(archives, { recursive: true });
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
for (const receipt of packageReceipt.packages) {
  const bytes = fs.readFileSync(path.join(archiveRoot, receipt.tarball));
  if (hash(bytes) !== receipt.sha256) throw new Error(`Archive digest mismatch: ${receipt.tarball}`);
  fs.writeFileSync(path.join(archives, receipt.tarball), bytes);
}
const tool = path.resolve(value("--tools"));
fs.copyFileSync(tool, path.join(archives, path.basename(tool)));
fs.cpSync(path.join(path.resolve(value("--producer")), "ai"), path.join(destination, "producer/ai"), { recursive: true });
const identity = JSON.parse(fs.readFileSync(path.join(destination, "producer/ai/index.json"), "utf8")).identity;
const recordFile = path.join(destination, "commands.json");
const commands = resumeBrowser ? JSON.parse(fs.readFileSync(recordFile, "utf8")) : [];
function run(cwd, command, args, expected = 0) {
  const result = spawnSync(command, args, { cwd, encoding: "utf8", env: { ...process.env, NODE_PATH: "" } });
  commands.push({ cwd: path.relative(destination, cwd) || ".", command, args, status: result.status, stdout: result.stdout, stderr: result.stderr, error: result.error?.message });
  fs.writeFileSync(recordFile, JSON.stringify(commands, null, 2) + "\n");
  if (result.status !== expected) throw new Error(`Unexpected exit ${result.status}: ${command} ${args.join(" ")}\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}
const fixture = `import React, { useState } from "react";
import { Button, Heading, Input, Text } from "@tcrn/ui-react/approved";
import { evaluateShellPreferenceEvidence, type ShellPreferenceEvidence } from "@tcrn/ui-react";
export const validator: (input: ShellPreferenceEvidence) => { ok: boolean; findings: string[] } = evaluateShellPreferenceEvidence;
export function App() {
  const [saved, setSaved] = useState(0);
  return <main><Heading>Independent package consumer</Heading><Text>React installation fixture</Text>
    <form onSubmit={event => { event.preventDefault(); setSaved(saved + 1); }}>
      <Input name="customer" aria-label="Customer" defaultValue="Example" />
      <Button type="submit">Save</Button><output aria-live="polite">Saved {saved}</output>
    </form>
    <div className="font-ui" data-font="ui">Q3 Review 128</div>
    <div className="font-heading" data-font="heading">Q3 Review 128</div>
    <div className="font-mono" data-font="mono">Q3 Review 128</div>
    <div className="font-sc" data-font="sc">季度复盘</div>
    <div className="font-serif-sc" data-font="serif-sc">季度复盘</div>
  </main>;
}
`;
const client = `import React from "react";
import { hydrateRoot } from "react-dom/client";
import { App } from "./App.js";
import "@tcrn/ui-tokens/tokens.css";
import "@tcrn/ui-tokens/fonts.css";
import "./fixture.css";
hydrateRoot(document.getElementById("root")!, <App />);
`;
const matrices = [
  { id: "react-18.3", react: "18.3.1", typesReact: "18.3.20", typesDOM: "18.3.7" },
  { id: "react-19-baseline", react: "19.1.0", typesReact: "19.1.8", typesDOM: "19.1.6" },
  { id: "tms-19.2.6", react: "19.2.6", typesReact: "19.1.8", typesDOM: "19.1.6" },
];
const observations = [];
for (const matrix of matrices) {
  const consumer = path.join(destination, matrix.id);
  if (!resumeBrowser) {
    fs.mkdirSync(path.join(consumer, "src"), { recursive: true });
    fs.writeFileSync(path.join(consumer, "package.json"), JSON.stringify({ name: `independent-${matrix.id}`, version: "0.0.0", private: true, type: "module" }, null, 2));
    const archivePaths = [...packageReceipt.packages.map(row => `../archives/${row.tarball}`), `../archives/${path.basename(tool)}`];
    run(consumer, "npm", ["install", "--save-exact", "--ignore-scripts", "--no-audit", "--no-fund", ...archivePaths,
      `react@${matrix.react}`, `react-dom@${matrix.react}`, `@types/react@${matrix.typesReact}`, `@types/react-dom@${matrix.typesDOM}`, "typescript@5.8.3", "esbuild@0.28.1"]);
    // Preserve exact public declarations while retaining the real archive URLs/integrities in the lock.
    const manifest = JSON.parse(fs.readFileSync(path.join(consumer, "package.json"), "utf8"));
    for (const row of packageReceipt.packages) manifest.dependencies[row.name] = row.version;
    manifest.dependencies["@tcrn/ds-consumer-tools"] = packageReceipt.packages[0].version;
    fs.writeFileSync(path.join(consumer, "package.json"), JSON.stringify(manifest, null, 2) + "\n");
    run(consumer, "npm", ["install", "--package-lock-only", "--offline", "--ignore-scripts", "--no-audit", "--no-fund"]);
    run(consumer, "npm", ["ci", "--offline", "--ignore-scripts", "--no-audit", "--no-fund"]);
    fs.writeFileSync(path.join(consumer, "src/App.tsx"), fixture);
    fs.writeFileSync(path.join(consumer, "src/client.tsx"), client);
    fs.writeFileSync(path.join(consumer, ".tcrn-ds.json"), JSON.stringify({ schemaVersion: "tcrn.consumer-contract.v1", identity, components: ["Button", "Heading", "Input", "Text"], patterns: [], sourceRoots: ["src"] }, null, 2));
    fs.writeFileSync(path.join(consumer, "tsconfig.json"), JSON.stringify({ compilerOptions: { target: "ES2022", module: "NodeNext", moduleResolution: "NodeNext", strict: true, skipLibCheck: false, jsx: "react-jsx", noEmit: true }, include: ["src"] }, null, 2));
    run(consumer, path.join(consumer, "node_modules/.bin/tsc"), ["--project", "tsconfig.json", "--pretty", "false"]);
  }
  fs.writeFileSync(path.join(consumer, "src/fixture.css"), `body{margin:0;background:var(--tcrn-color-bg);color:var(--tcrn-color-ink);font-family:var(--tcrn-type-family-ui)}main{padding:var(--tcrn-space-3);display:grid;gap:var(--tcrn-space-3)}form{display:grid;gap:var(--tcrn-space-3)}.font-ui{font-family:var(--tcrn-type-family-ui)}.font-heading{font-family:var(--tcrn-type-family-heading)}.font-mono{font-family:var(--tcrn-type-family-mono)}.font-sc{font-family:"Noto Sans SC"}.font-serif-sc{font-family:"Noto Serif SC"}\n`);
  run(consumer, path.join(consumer, "node_modules/.bin/esbuild"), ["src/client.tsx", "--bundle", "--format=esm", "--outdir=public", "--loader:.woff2=file", "--asset-names=fonts/[name]"]);
  run(consumer, path.join(consumer, "node_modules/.bin/esbuild"), ["src/App.tsx", "--bundle", "--platform=node", "--packages=external", "--format=esm", "--outfile=server.js"]);
  const app = await import(pathToFileURL(path.join(consumer, "server.js")).href);
  const react = await import(pathToFileURL(path.join(consumer, "node_modules/react/index.js")).href);
  const ssr = await import(pathToFileURL(path.join(consumer, "node_modules/react-dom/server.node.js")).href);
  const ui = await import(pathToFileURL(path.join(consumer, "node_modules/@tcrn/ui-react/dist/index.js")).href);
  fs.writeFileSync(path.join(consumer, "public/index.html"), `<!doctype html><html lang="en"><meta charset="utf-8"><link rel="icon" href="data:,"><link rel="stylesheet" href="/client.css"><style>${ui.tcrnComponentCss}</style><div id="root">${ssr.renderToString(react.createElement(app.App))}</div><script type="module" src="/client.js"></script></html>`);
  const bin = path.join(consumer, "node_modules/.bin/tcrn-ds-check");
  const cliArgs = ["--project", ".", "--index", "../producer/ai/index.json", "--declaration", ".tcrn-ds.json"];
  run(consumer, bin, cliArgs);
  fs.writeFileSync(path.join(consumer, "src/negative.css"), ".bad{color:var(--tcrn-unknown-fixture)}\n");
  run(consumer, bin, cliArgs, 1);
  fs.rmSync(path.join(consumer, "src/negative.css"));
  const installed = run(consumer, "npm", ["ls", "--all", "--json"]);
  for (const name of ["ui-tokens", "ui-copy-state", "ui-react"]) {
    const packagePath = path.join(consumer, "node_modules/@tcrn", name);
    if (fs.lstatSync(packagePath).isSymbolicLink() || !fs.realpathSync(packagePath).startsWith(fs.realpathSync(consumer) + path.sep)) throw new Error(`Non-independent package ${name}`);
    if (!fs.readFileSync(path.join(packagePath, "LICENSE"), "utf8").includes("Apache License")) throw new Error(`Missing package license ${name}`);
  }
  const tokens = path.join(consumer, "node_modules/@tcrn/ui-tokens");
  for (const name of ["hanken-grotesk-OFL.txt", "source-serif-4-OFL.txt", "ibm-plex-mono-OFL.txt", "noto-sans-sc-OFL.txt", "noto-serif-sc-OFL.txt", "approved-site-original-notice.txt"]) {
    if (!fs.readFileSync(path.join(tokens, "licenses", name), "utf8").includes("OPEN FONT LICENSE")) throw new Error(`Missing font notice ${name}`);
  }
  const network = [];
  const publicRoot = path.join(consumer, "public");
  const server = http.createServer((request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
      const file = path.resolve(publicRoot, "." + (pathname === "/" ? "/index.html" : pathname));
      if (!file.startsWith(publicRoot + path.sep)) throw new Error("Outside served root");
      const bytes = fs.readFileSync(file);
      network.push({ path: pathname, bytes: bytes.length, sha256: hash(bytes) });
      response.setHeader("content-type", ({ ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2" })[path.extname(file)] ?? "application/octet-stream");
      response.end(bytes);
    } catch { response.writeHead(404); response.end(); }
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const browser = await chromium.launch({ headless: true });
  const browserRows = [];
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    for (const theme of ["light", "dark"]) for (const width of [1440, 390]) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
      await page.route("**/*", route => route.request().url().startsWith(base) ? route.continue() : route.abort());
      await page.goto(base);
      await page.evaluate(theme => document.documentElement.setAttribute("data-tcrn-theme", theme), theme);
      await page.getByRole("textbox", { name: "Customer" }).fill("Saved customer");
      await page.getByRole("button", { name: "Save", exact: true }).click();
      await page.getByText("Saved 1", { exact: true }).waitFor();
      const loadedFonts = await page.evaluate(async () => {
        const families = ["Hanken Grotesk", "Source Serif 4", "IBM Plex Mono", "Noto Sans SC", "Noto Serif SC"];
        await Promise.all(families.map(family => document.fonts.load(`16px "${family}"`, family.startsWith("Noto") ? "季度复盘" : "Q3 Review 128")));
        await document.fonts.ready;
        return families.map(family => ({ family, loaded: document.fonts.check(`16px "${family}"`, family.startsWith("Noto") ? "季度复盘" : "Q3 Review 128") }));
      });
      if (errors.length || loadedFonts.some(font => !font.loaded)) throw new Error(`Browser failure ${JSON.stringify({ errors, loadedFonts })}`);
      const session = await context.newCDPSession(page);
      await session.send("DOM.enable");
      await session.send("CSS.enable");
      const { root: documentRoot } = await session.send("DOM.getDocument");
      const renderedFonts = [];
      for (const [role, expected] of [["ui", "Hanken Grotesk"], ["heading", "Source Serif 4"], ["mono", "IBM Plex Mono"], ["sc", "Noto Sans SC"], ["serif-sc", "Noto Serif SC"]]) {
        const { nodeId } = await session.send("DOM.querySelector", { nodeId: documentRoot.nodeId, selector: `[data-font="${role}"]` });
        const { fonts } = await session.send("CSS.getPlatformFontsForNode", { nodeId });
        const declaredFamily = await page.locator(`[data-font="${role}"]`).evaluate(element => getComputedStyle(element).fontFamily);
        // The pinned SC files expose internal family names such as Noto Sans SC Thin.
        // Match the declared CSS family, actual custom glyphs and independently checked font bytes.
        if (!declaredFamily.includes(expected) || !fonts.length || fonts.some(font => !font.isCustomFont || font.glyphCount <= 0)) throw new Error(`Fallback font rendered for ${role}: ${JSON.stringify(fonts)}`);
        renderedFonts.push({ role, expected, declaredFamily, fonts });
      }
      await session.detach();
      await page.screenshot({ path: path.join(destination, `${matrix.id}-${theme}-${width}.png`) });
      browserRows.push({ theme, width, saved: await page.locator("output").textContent(), loadedFonts, renderedFonts, errors });
      await context.close();
    }
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.route("**/*.woff2", route => route.abort());
    await page.goto(base);
    const control = await page.evaluate(async () => {
      await document.fonts.ready;
      return document.fonts.check('16px "Hanken Grotesk"', "Q3 Review 128");
    });
    if (control) throw new Error("Blocked-font control did not reject the unavailable vendored font");
    await context.close();
    const fontResponses = network.filter(row => row.path.endsWith(".woff2"));
    if (!fontResponses.length || fontResponses.some(row => path.basename(row.path, ".woff2") !== row.sha256)) throw new Error("HTTP font bytes drift from the archive content hashes");
    observations.push({ ...matrix, browser: browser.version(), browserRows, blockedFontControl: control,
      installed: JSON.parse(installed), lockSha256: hash(fs.readFileSync(path.join(consumer, "package-lock.json"))), network });
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  fs.writeFileSync(path.join(destination, "observations.json"), JSON.stringify(observations, null, 2) + "\n");
}
console.log(JSON.stringify({ ok: true, node: process.version, platform: `${os.platform()}-${os.arch()}`, matrices: observations.map(({ id, react, browser, lockSha256 }) => ({ id, react, browser, lockSha256 })), toolSha256: hash(fs.readFileSync(tool)), archives: packageReceipt.packages.map(({ name, sha256 }) => ({ name, sha256 })) }, null, 2));
