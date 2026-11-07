import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { renderToString } from "react-dom/server";
import { tcrnComponentCss, tcrnProductMarkSvg, tcrnIconNames, tcrnProductMarkIds } from "@tcrn/ui-react/approved";
import { tcrnTokenCss, tcrnTokens } from "@tcrn/ui-tokens";
import { App, docsPreferenceKey } from "../app.js";
import { docsNavigation, type DocsPage } from "../portal-navigation.js";
import { approvedSource, supportedLocales, type DocsLocale } from "../approved-source.js";
import { approvedApi } from "../approved-api.js";
import { docsCopy } from "../locales.js";
import { createAiConsumptionContract } from "./ai-consumption-contract.js";
import { createAiRuleBundle, aiHash, aiJson, type AiApiEntry } from "./ai-rule-bundle.js";
import { designAuthority } from "./design-authority.js";

const root = fileURLToPath(new URL("../../../../", import.meta.url));
const escape = (value: string) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
// Apply the saved token set before CSS paints. React hydrates the stable tree under #app.
const themeBootstrap = `try{const saved=JSON.parse(localStorage.getItem(${JSON.stringify(docsPreferenceKey)})??"null");if(saved?.theme==="light"||saved?.theme==="dark")document.documentElement.dataset.tcrnTheme=saved.theme;}catch{}`;

function pageHtml(page: DocsPage, locale: DocsLocale) {
  const c = docsCopy(locale);
  const state = { page, locale };
  const title = page === "index" ? c.title : `${docsNavigation(locale, "static").byPage.get(page)!.label} · ${c.title}`;
  return `<!doctype html><html lang="${locale}" data-tcrn-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="standard-source-commit" content="${approvedSource.site.sourceCommit}"><title>${escape(title)}</title><script>${themeBootstrap}</script><link rel="icon" type="image/svg+xml" href="/assets/ds-tile-deep.svg"><link rel="stylesheet" href="/fonts/fonts.css"><link rel="stylesheet" href="/storybook.css"></head><body style="margin:0"><div id="app">${renderToString(<App {...state} />)}</div><script id="page-state" type="application/json">${JSON.stringify(state).replaceAll("<", "\\u003c")}</script><script type="module" src="/storybook.js"></script></body></html>`;
}

function sourceFiles(directory: string): string[] {
  return fs.readdirSync(path.join(root, directory), { withFileTypes: true }).flatMap(entry => {
    const file = `${directory}/${entry.name}`;
    if (entry.isSymbolicLink()) throw new Error(`AI source must be a regular file: ${file}`);
    return entry.isDirectory() ? sourceFiles(file) : /\.(?:tsx?|css|md|html|json)$/.test(file) ? [file] : [];
  });
}

export async function writeStorybookStaticBuild(bundle: Uint8Array) {
  const output = path.join(root, "apps/storybook/storybook-static");
  const fontRoot = path.join(root, "packages/ui-tokens/fonts");
  const fonts = JSON.parse(fs.readFileSync(path.join(fontRoot, "manifest.json"), "utf8"));
  if (fonts.site?.sourceCommit !== approvedSource.site.sourceCommit) throw new Error("Fonts were not generated from this published Site");
  const packageVersions = Object.fromEntries(["ui-react", "ui-tokens", "ui-copy-state"].map(name => {
    const manifest = JSON.parse(fs.readFileSync(path.join(root, `packages/${name}/package.json`), "utf8"));
    return [manifest.name, manifest.version as string];
  }));
  const candidate = {
    version: packageVersions["@tcrn/ui-react"],
    commit: execFileSync("git", ["-C", root, "rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
    dirty: execFileSync("git", ["-C", root, "status", "--porcelain=v1"], { encoding: "utf8" }).trim().length > 0,
  };
  const manifestBuilder = await import(pathToFileURL(path.join(root, "scripts/component-api-manifest.mjs")).href) as {
    extractComponentExamples: () => Record<string, { path: string; line: number; snippet: string }>;
    buildManifest: (options: { entryPath: string; componentNames: string[] }) => { ok: boolean; components: Record<string, AiApiEntry> };
  };
  const api = manifestBuilder.buildManifest({ entryPath: "packages/ui-react/src/approved.tsx", componentNames: approvedApi.map(api => api.name) });
  const standardReader = await import(pathToFileURL(path.join(root, "scripts/lib/published-standard-proof.mjs")).href) as { formalApiContracts: () => Record<string, { formal: string; board: string; line: number }> };
  const normative = standardReader.formalApiContracts();
  for (const contract of approvedApi) {
    const expected = normative[contract.name];
    if (!expected || contract.formal !== expected.formal || contract.board !== expected.board || contract.line !== expected.line) throw new Error(`AI normative source drift: ${contract.name}`);
  }
  const sourcePaths = new Set([
    ...sourceFiles("apps/storybook/src"), ...sourceFiles("packages/ui-react/src/components"), ...sourceFiles("packages/ui-react/src/styles"),
    "apps/storybook/.storybook/main.ts", "apps/storybook/.storybook/preview.ts", "packages/ui-tokens/fonts/manifest.json",
    ...sourceFiles("packages/ui-copy-state/src"), ...sourceFiles("packages/ui-tokens/src"),
    ...sourceFiles("docs/consumption"), ...approvedSource.boards.map(board => `docs/design/approved-site-v1/src/boards/${board.slug}/index.dc.html`),
    "docs/design/approved-site-v1/source-manifest.json", "scripts/component-api-manifest.mjs",
    "scripts/consumer-contract-check.mjs", "scripts/package-contract-manifest.mjs", "scripts/lib/published-style-closure.mjs",
    "packages/ui-react/src/approved.tsx", ...sourceFiles("packages/ui-react/src/verification"),
    ...["ui-react", "ui-tokens", "ui-copy-state"].map(name => `packages/${name}/package.json`),
    "packages/ui-tokens/src/index.ts", "packages/ui-tokens/src/gplus-tokens.generated.ts",
  ]);
  const sources = [...sourcePaths].sort().map(file => {
    const content = fs.readFileSync(path.join(root, file), "utf8");
    return { path: file, sha256: aiHash(content), content };
  });
  const ai = createAiRuleBundle({ candidate, packageVersions, api, examples: manifestBuilder.extractComponentExamples(), tokens: tcrnTokens, sources, fonts: fonts.files, icons: tcrnIconNames, products: tcrnProductMarkIds });
  const files = new Map<string, Uint8Array | string>();
  for (const locale of supportedLocales) for (const page of ["index", ...approvedSource.boards.map(board => board.slug), "api"] as DocsPage[]) {
    files.set(`${locale}/${page}.html`, pageHtml(page, locale));
  }
  files.set("index.html", pageHtml("index", "en"));
  files.set("storybook.js", bundle);
  files.set("storybook.css", tcrnTokenCss + "\n" + tcrnComponentCss + "\n" + fs.readFileSync(path.join(root, "apps/storybook/src/docs.css"), "utf8"));
  files.set("assets/ds-tile-deep.svg", tcrnProductMarkSvg("design-system", "tile-deep", { size: 48 }));
  for (const file of fonts.files) {
    const bytes = fs.readFileSync(path.join(fontRoot, file.file));
    if (aiHash(bytes) !== file.sha256) throw new Error(`Font digest mismatch ${file.file}`);
    files.set(`fonts/${file.file}`, bytes);
  }
  files.set("fonts/fonts.css", fs.readFileSync(path.join(fontRoot, "fonts.css")));
  files.set("fonts/manifest.json", aiJson(fonts));
  for (const name of fonts.licenses) files.set(`licenses/${name}`, fs.readFileSync(path.join(root, "packages/ui-tokens/licenses", name)));
  for (const [file, bytes] of ai.files) files.set(file, bytes);
  files.set("ai-consumption-contract.json", aiJson(createAiConsumptionContract(candidate, fonts.files, ai)));
  files.set("design-authority.json", aiJson({ ...designAuthority, candidate, identity: ai.identity }));
  files.set("llms.txt", `# TCRN Design System candidate ${candidate.version}\n\nStart: /ai/index.json\nVersioned index: /ai/${candidate.version}/index.json\nRead global and the transitive required closure for your task. Optional links are further reading. Full compatibility entry: /ai-consumption-contract.json.\nCandidate commit: ${candidate.commit}\nPublished standard: ${approvedSource.site.url}\nPublished Site version: ${approvedSource.site.versionNumber}\nPublished source commit: ${approvedSource.site.sourceCommit}\nPackage candidate publication: local only. The prior portal visual acceptance does not approve this revision. K1/K5/C01 and customer compositions remain unadopted. Refresh on any identity or required shard change; missing sources fail.\nConsumer setup: docs/consumption/README.md in the matching source release.\n`);
  files.set("robots.txt", "User-agent: *\nAllow: /\n");
  const inventory = [...files].map(([name, bytes]) => ({ path: name, bytes: typeof bytes === "string" ? Buffer.byteLength(bytes) : bytes.length, sha256: aiHash(bytes) }));
  files.set("output-manifest.json", aiJson({ schemaVersion: "tcrn.storybook-output.v1", candidate, standardSource: approvedSource.site, identity: ai.identity, files: inventory }));
  const helpers = await import(pathToFileURL(path.join(root, "scripts/lib/generated-output.mjs")).href) as { reconcileOutput: (dir: string, expected: string[]) => unknown };
  helpers.reconcileOutput(output, [...files.keys()]);
  for (const [file, bytes] of files) {
    const target = path.join(output, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, bytes);
  }
  console.log(`Storybook: ${supportedLocales.length} locales, ${approvedSource.boards.length} boards, ${approvedApi.length} formal components; ${ai.rules.length} AI shards; ${files.size} exact output files. Candidate validation and publication remain separate.`);
}
