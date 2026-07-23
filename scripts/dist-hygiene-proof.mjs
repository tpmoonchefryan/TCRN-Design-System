// Dist orphan-artifact gate — TCRN-DS-INIT-007 (STORY-038).
//
// @tcrn/ui-react ships `files: ["dist"]`, so anything in packages/ui-react/dist is
// published. The build was `tsc -p tsconfig.json` with no clean step, so emit from a
// prior refactor persisted: dist/styles.*, dist/components/Brand/* and
// dist/components/Shell/* survived after their src/ modules were removed — orphan bytes
// that would ride along in the tarball. The build is now clean-first (it wipes dist
// before tsc), and this gate — run AFTER build — proves it worked: every emit artifact in
// dist must map back to a real src/ module, or the build failed to stay clean.
import { readdirSync, existsSync } from "node:fs";
import { resolve, dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = resolve(root, "packages/ui-react/dist");
const SRC = resolve(root, "packages/ui-react/src");

// tsc emit suffixes, longest first so a `.d.ts.map` is not mis-stripped as `.map`/`.ts`.
const EMIT_SUFFIXES = [".d.ts.map", ".js.map", ".d.ts", ".js"];

function walk(dir) {
  const files = [];
  if (!existsSync(dir)) return files;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.isFile()) files.push(full);
  }
  return files;
}

// Strip a tsc emit suffix to recover the module base path; null for non-emit files.
function moduleBase(relPath) {
  for (const suffix of EMIT_SUFFIXES) {
    if (relPath.endsWith(suffix)) return relPath.slice(0, -suffix.length);
  }
  return null;
}

export function distHygieneChecks() {
  if (!existsSync(DIST)) {
    return {
      problems: ["packages/ui-react/dist does not exist — run `pnpm build` before the dist hygiene gate"],
      checked: 0,
      orphans: []
    };
  }
  const orphans = [];
  let checked = 0;
  for (const file of walk(DIST)) {
    const relPath = relative(DIST, file);
    const base = moduleBase(relPath);
    if (base === null) continue; // not a tsc emit artifact — ignore
    checked += 1;
    const hasSource = existsSync(join(SRC, `${base}.ts`)) || existsSync(join(SRC, `${base}.tsx`));
    if (!hasSource) orphans.push(relPath);
  }
  const problems = orphans.map(
    (relPath) => `orphan dist artifact with no src/ source: packages/ui-react/dist/${relPath}`
  );
  return { problems, checked, orphans };
}

// pathToFileURL, not string concatenation: this repository lives under a path with a
// space in it, so `file://${argv[1]}` never matches the percent-encoded import.meta.url
// and the entry point silently does nothing.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { problems, checked, orphans } = distHygieneChecks();
  if (problems.length > 0) {
    console.error(`DIST HYGIENE: ${orphans.length} orphan artifact(s) in packages/ui-react/dist:`);
    for (const problem of problems) console.error(`  - ${problem}`);
    console.error(
      "These are stale build output. `pnpm --filter @tcrn/ui-react build` now wipes dist first; rebuild to clear them."
    );
    process.exit(1);
  }
  console.log(JSON.stringify({ ok: true, checked }, null, 2));
}
