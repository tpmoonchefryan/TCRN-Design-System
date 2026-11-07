// Optional engineering scanner; the current published-source token registry has no legacy aliases.
// Injecting a table lets an external migration tool inspect its own vocabulary. That does not add
// old names to the token sheet or Storybook. This command is informational and never publishes CSS.
// Usage: node scripts/token-deprecation-notice.mjs [--label <name>] <file-or-directory>...
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { formatDeprecatedTokenNotices, tcrnDeprecatedTokenAliases, tcrnDeprecatedTokens } from "../packages/ui-tokens/dist/index.js";

export const SOURCE_EXTENSIONS = Object.freeze([".css", ".scss", ".sass", ".less", ".pcss", ".html", ".vue", ".svelte", ".astro", ".js", ".jsx", ".mjs", ".cjs", ".ts", ".tsx", ".mts", ".cts"]);
const STYLESHEET_EXTENSIONS = new Set([".css", ".scss", ".sass", ".less", ".pcss"]);
export const SKIPPED_DIRECTORIES = Object.freeze(["node_modules", ".git", "dist", "coverage", "storybook-static", "storybook-preview-static", ".next", ".turbo"]);
export const BUILD_OUTPUT_DIRECTORY = "build";

/**
 * Whether the walk skips a directory, given its relative path as the notice prints it (from the
 * parent of the path given, `/`-separated): the build output names anywhere, and `build` unless a
 * `src` segment sits above it.
 */
export function isSkippedDirectory(relativePath) {
  const segments = relativePath.split("/").filter(Boolean);
  const name = segments[segments.length - 1];
  if (SKIPPED_DIRECTORIES.includes(name)) return true;
  return name === BUILD_OUTPUT_DIRECTORY && !segments.slice(0, -1).includes("src");
}

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const TOKEN_BLOCK = /\{[^{}]*\/\*\s*tcrn-token-block:[^{}]*\}/g;

/** The deprecated names and their successors, as published by @tcrn/ui-tokens. */
export function deprecatedTokenTable({ aliases = tcrnDeprecatedTokenAliases, deprecated = tcrnDeprecatedTokens } = {}) {
  const names = new Set([...Object.keys(aliases), ...deprecated.map((token) => token.variable)]);
  return [...names].map((variable) => ({
    variable,
    replacement: aliases[variable] ?? null,
    pattern: new RegExp(`(?<![\\w-])${escapeRegExp(variable)}(?![\\w-])`, "g")
  }));
}

/**
 * Uses of deprecated names in one source text: `count` (references and overrides) and
 * `overrides` (declarations that set the old name to something other than its alias).
 */
export function scanDeprecatedTokenUses(source, { stylesheet = false, table = deprecatedTokenTable() } = {}) {
  let text = source.replace(TOKEN_BLOCK, "{}");
  if (stylesheet) text = text.replace(/\/\*[\s\S]*?\*\//g, "");
  const uses = [];
  for (const { variable, replacement, pattern } of table) {
    let count = 0;
    let overrides = 0;
    pattern.lastIndex = 0;
    for (let match = pattern.exec(text); match; match = pattern.exec(text)) {
      const declaration = /^["'`]?\s*:\s*([^;{}\n]*)/.exec(text.slice(match.index + variable.length));
      if (declaration) {
        const value = declaration[1].trim().replace(/["'`,]+$/, "").replace(/^["'`]/, "").trim();
        if (replacement && value === `var(${replacement})`) continue;
        overrides += 1;
      }
      count += 1;
    }
    if (count) uses.push({ variable, replacement, count, overrides });
  }
  return uses;
}

function collectFiles(target, problems) {
  if (!fs.existsSync(target)) {
    problems.push(`path not found: ${target}`);
    return [];
  }
  const stat = fs.statSync(target);
  if (stat.isFile()) return [target];
  const files = [];
  const base = path.dirname(target);
  const walk = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        if (!isSkippedDirectory(path.relative(base, full).split(path.sep).join("/"))) walk(full);
      } else if (entry.isFile() && SOURCE_EXTENSIONS.includes(path.extname(entry.name))) {
        files.push(full);
      }
    }
  };
  walk(target);
  return files;
}

const listFiles = (files) => (files.length <= 3 ? files.join(", ") : `${files.slice(0, 3).join(", ")} and ${files.length - 3} more`);

/** Scans the given files and directories and returns the notice lines. */
export function runDeprecationNotice({ paths, label = "consumer", table = deprecatedTokenTable() }) {
  const problems = [];
  const files = [];
  for (const target of paths) {
    const absolute = path.resolve(target);
    const base = path.dirname(absolute);
    for (const file of collectFiles(absolute, problems)) files.push({ file, shown: path.relative(base, file).split(path.sep).join("/") });
  }
  const byName = new Map();
  for (const { file, shown } of files) {
    const uses = scanDeprecatedTokenUses(fs.readFileSync(file, "utf8"), { stylesheet: STYLESHEET_EXTENSIONS.has(path.extname(file)), table });
    for (const use of uses) {
      const entry = byName.get(use.variable) ?? { variable: use.variable, replacement: use.replacement, count: 0, files: [], overriddenIn: [] };
      entry.count += use.count;
      entry.files.push(shown);
      if (use.overrides) entry.overriddenIn.push(shown);
      byName.set(use.variable, entry);
    }
  }
  const usages = table.map(({ variable }) => byName.get(variable)).filter(Boolean);
  const total = usages.reduce((sum, usage) => sum + usage.count, 0);
  const filesWithUses = new Set(usages.flatMap((usage) => usage.files)).size;
  const lines = [];
  if (!usages.length) {
    lines.push(`@tcrn/ui-tokens deprecated token notice (${label}): no deprecated token names in ${files.length} file(s)`);
  } else {
    lines.push(`@tcrn/ui-tokens deprecated token notice (${label}): ${usages.length} deprecated name(s), ${total} use(s) in ${filesWithUses} of ${files.length} file(s)`);
    const notices = formatDeprecatedTokenNotices(usages);
    usages.forEach((usage, index) => lines.push(`  ${notices[index]} [${listFiles(usage.files)}]`));
    for (const usage of usages.filter((entry) => entry.overriddenIn.length)) {
      lines.push(`  note: ${usage.variable} is set in ${listFiles(usage.overriddenIn)}; ${usage.replacement ? `set ${usage.replacement} instead` : "it has no G+ successor"}`);
    }
    lines.push("This notice uses the supplied migration table. Check the installed package for alias availability; the current published registry emits no legacy aliases.");
  }
  return { problems, files: files.map((entry) => entry.shown), usages, lines };
}

function isMain() {
  if (!process.argv[1]) return false;
  try {
    return fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
}

if (isMain()) {
  const args = process.argv.slice(2);
  const labelAt = args.indexOf("--label");
  const label = labelAt >= 0 ? args[labelAt + 1] : undefined;
  const paths = args.filter((arg, index) => arg !== "--label" && (labelAt < 0 || index !== labelAt + 1));
  if (!paths.length || (labelAt >= 0 && !label)) {
    console.error("usage: node scripts/token-deprecation-notice.mjs [--label <name>] <file-or-directory>...");
    process.exit(2);
  }
  const report = runDeprecationNotice({ paths, label });
  for (const problem of report.problems) console.error(problem);
  if (report.problems.length) process.exit(2);
  console.log(report.lines.join("\n"));
  process.exit(0);
}
