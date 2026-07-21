// Token surface sync + drift proof — TCRN-DS-INIT-001 (WS1/WS4).
//
// `@tcrn/ui-tokens/src/index.ts` is the single source of truth for the visual
// language. Two artifacts are generated from it and were, before this Initiative,
// hand-maintained forks that had silently drifted:
//
//   1. packages/ui-tokens/src/tokens.css   — the published `./tokens.css` export.
//      Drift found 2026-07-21: 13 typography tokens present in the generator were
//      missing from the shipped CSS, including --tcrn-type-weight-strong, which
//      @tcrn/ui-react referenced 16 times.
//   2. apps/storybook/src/storybook.css    — the docs shell's token block.
//      Drift found 2026-07-21: a complete hardcoded copy of the v1 palette, which
//      would have kept the Storybook shell rendering the old visual language after
//      the package moved to v2 — contradicting the README's claim that Design
//      System compliance means using the same Storybook visual instance.
//
// Run with `--check` to prove both artifacts match the source (build gate);
// run with no flag to regenerate them.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { tcrnTokenCss } from "../packages/ui-tokens/dist/index.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TOKENS_CSS = path.join(root, "packages/ui-tokens/src/tokens.css");
const STORYBOOK_CSS = path.join(root, "apps/storybook/src/storybook.css");

const SHELL_MARKER = "/* Token blocks below are generated from @tcrn/ui-tokens";

function storybookParts() {
  const raw = fs.readFileSync(STORYBOOK_CSS, "utf8");
  const start = raw.indexOf(":root {");
  if (start === -1) throw new Error("storybook.css: no :root token block found");
  const darkClose = raw.indexOf("\n}\n", raw.indexOf('[data-tcrn-theme="dark"] {'));
  if (darkClose === -1) throw new Error("storybook.css: no dark token block found");
  return { header: raw.slice(0, start), generated: raw.slice(start, darkClose + 3), rest: raw.slice(darkClose + 3) };
}

const check = process.argv.includes("--check");
const problems = [];

// 1. published tokens.css
const onDisk = fs.existsSync(TOKENS_CSS) ? fs.readFileSync(TOKENS_CSS, "utf8") : "";
if (onDisk !== tcrnTokenCss) {
  if (check) problems.push("packages/ui-tokens/src/tokens.css has drifted from index.ts");
  else {
    fs.writeFileSync(TOKENS_CSS, tcrnTokenCss);
    console.log("regenerated packages/ui-tokens/src/tokens.css");
  }
} else if (!check) console.log("packages/ui-tokens/src/tokens.css already in sync");

// 2. storybook shell
const { header, generated, rest } = storybookParts();
if (generated !== tcrnTokenCss) {
  if (check) problems.push("apps/storybook/src/storybook.css token block has drifted from index.ts");
  else {
    const keptHeader = header.includes(SHELL_MARKER)
      ? header
      : `${SHELL_MARKER} — the single source of\n   truth for the visual language. Do not hand-edit: run \`pnpm tokens:sync\` and let\n   \`pnpm tokens:proof\` fail the build if this file drifts from the package. */\n`;
    fs.writeFileSync(STORYBOOK_CSS, keptHeader + tcrnTokenCss + rest);
    console.log("regenerated apps/storybook/src/storybook.css token block");
  }
} else if (!check) console.log("apps/storybook/src/storybook.css already in sync");

if (check) {
  if (problems.length) {
    console.error("TOKEN SURFACE DRIFT:");
    for (const p of problems) console.error(`  - ${p}`);
    console.error("Run `pnpm tokens:sync` to regenerate from @tcrn/ui-tokens.");
    process.exit(1);
  }
  console.log("token surface in sync: tokens.css and storybook.css both match @tcrn/ui-tokens");
}
