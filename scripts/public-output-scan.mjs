import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const outputRoot = "apps/storybook/storybook-static";
const vercelConfig = JSON.parse(readFileSync("vercel.json", "utf8"));
const textExtensions = new Set([".css", ".html", ".js", ".json", ".map", ".svg", ".txt", ".xml"]);

const requiredFiles = [
  "index.html",
  "components.html",
  "style-guide.html",
  "foundations.html",
  "patterns.html",
  "proof.html",
  "change-log.html",
  "tcrn-brand-mark.svg"
];

const forbiddenFileNames = new Set([
  "iframe.html",
  "index.json",
  "project.json",
  "vite-inject-mocker-entry.js"
]);

const forbiddenPatterns = [
  { id: "abovecloud-development-host", pattern: /(?:https?:\/\/)?eu1\.web-components\.cicd\.development\.abovecloud\.io/i },
  { id: "abovecloud-domain", pattern: /abovecloud\.io/i },
  { id: "storybook-global-runtime", pattern: /__STORYBOOK_/ },
  { id: "storybook-manager-bundle", pattern: /sb-(?:manager|addons|common-manager)/i },
  { id: "prop-types-any", pattern: /(?:PropTypes|prop_types)[._]any|\.any\.isRequired/ },
  { id: "storybook-any-control", pattern: /type=['"]?any['"]?|type=any/ },
  { id: "storybook-preview-iframe", pattern: /storybook-preview-iframe/ }
];

function walk(directory, files = []) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(path, files);
      continue;
    }
    if (entry.isFile()) {
      files.push(path);
    }
  }
  return files;
}

function readIfText(path) {
  if (!textExtensions.has(extname(path).toLowerCase())) {
    return null;
  }
  const stat = statSync(path);
  if (stat.size > 2_000_000) {
    return null;
  }
  return readFileSync(path, "utf8");
}

const files = walk(outputRoot);
const relativeFiles = files.map((file) => file.slice(`${outputRoot}/`.length));
const missingRequiredFiles = requiredFiles.filter((file) => !relativeFiles.includes(file));
const forbiddenFiles = relativeFiles.filter((file) => forbiddenFileNames.has(file) || /^sb-/.test(file));
const hits = [];

for (const file of files) {
  const body = readIfText(file);
  if (body === null) {
    continue;
  }
  for (const rule of forbiddenPatterns) {
    const match = body.match(rule.pattern);
    if (match) {
      hits.push({
        file: file.slice(`${outputRoot}/`.length),
        rule: rule.id,
        matchLength: match[0].length
      });
    }
  }
}

const ok = vercelConfig.outputDirectory === outputRoot
  && vercelConfig.buildCommand === "pnpm public-docs:vercel-build"
  && missingRequiredFiles.length === 0
  && forbiddenFiles.length === 0
  && hits.length === 0;

const receipt = {
  ok,
  outputRoot,
  vercelOutputDirectory: vercelConfig.outputDirectory,
  vercelBuildCommand: vercelConfig.buildCommand,
  checkedFiles: relativeFiles.length,
  requiredFiles,
  missingRequiredFiles,
  forbiddenFiles,
  forbiddenPatternIds: forbiddenPatterns.map((rule) => rule.id),
  hits
};

console.log(JSON.stringify(receipt, null, 2));
if (!ok) {
  process.exit(1);
}
