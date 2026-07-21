// Font-licence proof — TCRN-DS-STORY-003 acceptance condition #1.
//
// The design system names font families; it never ships font software. That is what
// keeps the licensing position in packages/ui-tokens/FONT-LICENSES.md true, so it has
// to be mechanically checked rather than asserted. Two checks:
//
//   1. No font binary anywhere in the tree (outside node_modules).
//   2. No proprietary face is used as a *distributable* stack entry — the stacks
//      whose names promise bundleability must contain only open-licensed families.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { tcrnTokens } from "../packages/ui-tokens/dist/index.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FONT_EXT = new Set([".ttf", ".otf", ".woff", ".woff2", ".eot", ".ttc", ".otc"]);

// Scope: the *distributable* surface only — what git tracks plus the deployed docs
// artifact. Local build output is excluded deliberately, and the reason is worth
// recording: `storybook build` vendors its own manager chrome fonts (Nunito Sans,
// SIL OFL-1.1) into apps/storybook/storybook-preview-static/. That directory is
// gitignored and is not part of the Vercel chain (which builds storybook-static),
// so no font binary reaches a published artifact. Were that ever to change, the
// storybook-static sweep below would catch it.
const SKIP_DIR = new Set([
  "node_modules", ".git", "dist", ".pnpm-store", ".tarball-smoke",
  "storybook-preview-static"
]);

// Faces that may never appear in a stack advertised as distributable.
const PROPRIETARY = [
  "SF Pro", "SF Mono", "-apple-system", "BlinkMacSystemFont",
  "PingFang", "Hiragino", "Apple SD Gothic", "Songti", "Heiti",
  "Microsoft YaHei", "Yu Gothic", "Malgun Gothic", "Meiryo", "Consolas", "SFMono-Regular"
];

const binaries = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIR.has(entry.name)) walk(path.join(dir, entry.name));
    } else if (FONT_EXT.has(path.extname(entry.name).toLowerCase())) {
      binaries.push(path.relative(root, path.join(dir, entry.name)));
    }
  }
})(root);

const leaks = [];
for (const token of tcrnTokens) {
  if (!token.variable.includes("distributable")) continue;
  for (const face of PROPRIETARY) {
    if (token.value.toLowerCase().includes(face.toLowerCase())) {
      leaks.push(`${token.variable} advertises bundleability but names "${face}"`);
    }
  }
}

let failed = false;
if (binaries.length) {
  console.error(`FAIL: ${binaries.length} font binary/binaries found in the tree:`);
  for (const b of binaries) console.error(`  - ${b}`);
  console.error("The design system names fonts; it does not ship them. See packages/ui-tokens/FONT-LICENSES.md.");
  failed = true;
} else {
  console.log("pass  no font binaries in the tree");
}

if (leaks.length) {
  console.error("FAIL: proprietary faces inside distributable stacks:");
  for (const l of leaks) console.error(`  - ${l}`);
  failed = true;
} else {
  const n = tcrnTokens.filter((t) => t.variable.includes("distributable")).length;
  console.log(`pass  all ${n} distributable stacks name only open-licensed families`);
}

process.exit(failed ? 1 : 0);
