// Token surface sync + drift proof — TCRN-DS-INIT-001 (WS1/WS4), G+ blocks TCRN-DS-INIT-015.
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
// tokens.css is `tcrnTokenStylesheet` (the bundled-font @import, then the token blocks);
// the storybook block is `tcrnTokenCss`. Both carry three blocks: the light theme block, whose
// selector is the list `:root, [data-tcrn-theme="light"]` (tcrnGplusThemeSelectors.light), the
// theme-independent `:root` block and the `[data-tcrn-theme="dark"]` block after them. The C5
// check asserts that the theme block and the dark block declare the same property names
// (compareTokenThemeBlocks from @tcrn/ui-tokens, the same rule the unit tests use; it accepts
// selector lists).
//
// Run with `--check` to prove both artifacts match the source (build gate);
// run with no flag to regenerate them. `--deprecations` lists every deprecated token
// name the docs shell still references (a summary line is always printed).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  compareTokenThemeBlocks,
  findDeprecatedTokenUsages,
  formatDeprecatedTokenNotices,
  tcrnGplusThemeSelectors,
  tcrnTokenCss,
  tcrnTokenStylesheet
} from "../packages/ui-tokens/dist/index.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TOKENS_CSS = path.join(root, "packages/ui-tokens/src/tokens.css");
const STORYBOOK_CSS = path.join(root, "apps/storybook/src/storybook.css");

const SHELL_MARKER = "/* Token blocks below are generated from @tcrn/ui-tokens";
const THEME_MARKER = "/* tcrn-token-block: theme */";

// The generated part runs from the light theme block to the end of the dark block. The light
// block is found by its marker, not by a literal `:root {`, because its selector may be a list
// (`:root, [data-tcrn-theme="light"]`, or the plain `:root` of a file written before the list).
function storybookParts() {
  const raw = fs.readFileSync(STORYBOOK_CSS, "utf8");
  const marker = raw.indexOf(THEME_MARKER);
  if (marker === -1) throw new Error("storybook.css: no theme token block found");
  const brace = raw.lastIndexOf("{", marker);
  const start = raw.lastIndexOf("\n", brace) + 1;
  const opening = raw.slice(start, brace).split(",").map((selector) => selector.trim());
  if (!opening.includes(":root")) throw new Error(`storybook.css: the first theme token block opens with ${raw.slice(start, brace).trim()}, not a :root selector list`);
  const darkOpen = raw.indexOf(`\n${tcrnGplusThemeSelectors.dark} {\n`, marker);
  if (darkOpen === -1) throw new Error("storybook.css: no dark token block found");
  const darkClose = raw.indexOf("\n}\n", darkOpen);
  if (darkClose === -1) throw new Error("storybook.css: the dark token block is not closed");
  return { header: raw.slice(0, start), generated: raw.slice(start, darkClose + 3), rest: raw.slice(darkClose + 3) };
}

function themeBlockProblems(label, css) {
  const comparison = compareTokenThemeBlocks(css);
  return comparison.problems.map((problem) => `${label}: C5 theme blocks differ — ${problem}`);
}

const check = process.argv.includes("--check");
const listDeprecations = process.argv.includes("--deprecations");
const problems = [];

// 0. the generator itself must emit isomorphic theme blocks
problems.push(...themeBlockProblems("@tcrn/ui-tokens tcrnTokenCss", tcrnTokenCss));

// 1. published tokens.css
const onDisk = fs.existsSync(TOKENS_CSS) ? fs.readFileSync(TOKENS_CSS, "utf8") : "";
if (onDisk !== tcrnTokenStylesheet) {
  if (check) problems.push("packages/ui-tokens/src/tokens.css has drifted from index.ts");
  else {
    fs.writeFileSync(TOKENS_CSS, tcrnTokenStylesheet);
    console.log("regenerated packages/ui-tokens/src/tokens.css");
  }
} else if (!check) console.log("packages/ui-tokens/src/tokens.css already in sync");
if (check && onDisk) problems.push(...themeBlockProblems("packages/ui-tokens/src/tokens.css", onDisk));

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
if (check) problems.push(...themeBlockProblems("apps/storybook/src/storybook.css token block", generated));

// 3. deprecation notices for the docs shell, which consumes the tokens like any other client
const usages = findDeprecatedTokenUsages(rest);
if (usages.length) {
  const total = usages.reduce((sum, usage) => sum + usage.count, 0);
  console.log(
    `deprecation: apps/storybook/src/storybook.css references ${usages.length} deprecated token name(s), ${total} use(s); they resolve to the G+ values (rerun with --deprecations for the list)`
  );
  if (listDeprecations) for (const notice of formatDeprecatedTokenNotices(usages)) console.log(`  ${notice}`);
}

if (problems.length) {
  console.error("TOKEN SURFACE DRIFT:");
  for (const p of problems) console.error(`  - ${p}`);
  console.error("Run `pnpm tokens:sync` to regenerate from @tcrn/ui-tokens.");
  process.exit(1);
}
if (check) {
  const { light } = compareTokenThemeBlocks(tcrnTokenCss);
  console.log(
    `token surface in sync: tokens.css and storybook.css both match @tcrn/ui-tokens; C5 theme blocks declare the same ${light.length} properties`
  );
}
