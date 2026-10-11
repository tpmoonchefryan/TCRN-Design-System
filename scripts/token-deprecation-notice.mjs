// Deprecated token notice — TCRN-DS-STORY-120 GWT4.
//
// G+ renamed the colour, elevation, selection, motion and type-family tokens. The old names stay
// in @tcrn/ui-tokens/tokens.css as aliases (`--old: var(--new)`), so a consumer stylesheet that
// still says an old name keeps resolving to the G+ value. This notice lists the old names a
// consumer's source still uses, one line per name, with the name to write instead. The table
// comes from the @tcrn/ui-tokens build: tcrnDeprecatedTokenAliases (old name to new name) and
// tcrnDeprecatedTokens (which also lists the names without a successor); the wording of each line
// is formatDeprecatedTokenNotices from the same package.
//
//   node scripts/token-deprecation-notice.mjs [--label <name>] <file-or-directory>...
//
// It never fails a build: exit 0 whatever it finds. Exit 2 is kept for a usage error (no path
// given, or a path that does not exist). The Storybook build calls it once over its own sources;
// a consumer can call it over theirs.
//
// Token definitions are not uses: a token block carrying a `tcrn-token-block` marker (a vendored
// tokens.css, a generated token block) is skipped, and so is a single copied alias declaration
// (`--old: var(--new)`). Setting an old name to anything else counts as a use and gets a note,
// because the G+ names are the ones to set.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { formatDeprecatedTokenNotices, tcrnDeprecatedTokenAliases, tcrnDeprecatedTokens } from "../packages/ui-tokens/dist/index.js";

export const SOURCE_EXTENSIONS = Object.freeze([".css", ".scss", ".sass", ".less", ".pcss", ".html", ".vue", ".svelte", ".astro", ".js", ".jsx", ".mjs", ".cjs", ".ts", ".tsx", ".mts", ".cts"]);
const STYLESHEET_EXTENSIONS = new Set([".css", ".scss", ".sass", ".less", ".pcss"]);
export const SKIPPED_DIRECTORIES = Object.freeze(["node_modules", ".git", "dist", "build", "coverage", "storybook-static", "storybook-preview-static", ".next", ".turbo"]);

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
  const walk = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        if (!SKIPPED_DIRECTORIES.includes(entry.name)) walk(full);
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
    lines.push("Old names still resolve through the aliases in @tcrn/ui-tokens/tokens.css; move to the new names before the aliases are removed.");
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
