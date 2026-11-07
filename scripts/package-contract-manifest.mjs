import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { ROOT, readApprovedSource, extractIcons } from "./lib/approved-site-source.mjs";
import { compiled } from "./lib/published-standard-proof.mjs";

export async function buildPackageContractManifest(root = ROOT) {
  const source = readApprovedSource(root);
  const ui = await compiled(root, "packages/ui-react/dist/index.js");
  const api = await compiled(root, "apps/storybook/dist/approved-api.js");
  return {
    schemaVersion: "tcrn.package-engineering-contract.v2", standardSource: source.manifest.site,
    boards: source.manifest.boards, engineeringComponents: ui.componentLibraryPublicComponentNames,
    engineeringUtilities: ui.componentLibraryPublicUtilityNames, iconSources: extractIcons(source),
    publishedDocumentationEntry: "@tcrn/ui-react/approved",
    formalComponents: api.approvedApi.map(({ name, board, line }) => ({ name, board, line })),
    aiIndex: "ai/index.json",
    note: "Engineering exports are not a published design catalogue. Storybook API obligations come only from the explicit published E sections.",
  };
}

async function run() {
  const manifest = await buildPackageContractManifest();
  const output = path.join(ROOT, "docs/verification/current-standard-only/package-contract-manifest.json");
  const bytes = JSON.stringify(manifest, null, 2) + "\n";
  if (process.argv.includes("--check")) {
    if (!fs.existsSync(output) || fs.readFileSync(output, "utf8") !== bytes) throw new Error("PACKAGE CONTRACT MANIFEST DRIFT: regenerate from current source");
  } else {
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, bytes);
  }
  console.log(JSON.stringify({ ok: true, formalComponents: manifest.formalComponents.length, mode: process.argv.includes("--check") ? "check" : "regenerate" }));
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) await run();
