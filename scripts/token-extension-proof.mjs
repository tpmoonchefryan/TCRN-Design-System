// Extension-token registry + radius-agreement gate — TCRN-DS-INIT-007 (STORY-038).
//
// The package-truth component stylesheet is the `tcrnComponentCss` template literal in
// packages/ui-react/src/components/Navigation/Navigation.tsx. Besides consuming the
// generated @tcrn/ui-tokens custom properties, it defines a handful of its own:
//
//   * component-layer product brand/motion accents that intentionally live outside the
//     core token surface (they are consumed ONLY inside tcrnComponentCss and would
//     collide with the docs-shell convergence stories if hoisted into tokens.css); and
//   * component-scoped local custom properties declared inside individual selectors.
//
// Nothing gated the difference between "a deliberate component-layer extension" and "a
// token that silently drifted in without being registered anywhere". This proof is that
// gate: every `--tcrn-*` property DEFINED in tcrnComponentCss must be either a real
// @tcrn/ui-tokens token, a documented EXTENSION_TOKENS entry, or a documented LOCAL_VARS
// entry — an unknown definition fails the build. It also enforces the single-source and
// shared-silhouette contract for `--tcrn-radius-panel`: the redefinition must be gone from
// tcrnComponentCss (single-sourced from ui-tokens), and the token layer must keep
// radius.panel === radius.surface.
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { tcrnTokens, tcrnDarkThemeTokens, createTokenMap } from "../packages/ui-tokens/dist/index.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const NAVIGATION = resolve(root, "packages/ui-react/src/components/Navigation/Navigation.tsx");

// Documented component-layer extension tokens: product-specific brand and motion accents
// that are intentionally NOT part of the core @tcrn/ui-tokens surface. They are consumed
// only within tcrnComponentCss. Adding a new one here is a deliberate, reviewable act.
const EXTENSION_TOKENS = [
  "--tcrn-motion-product-shell",
  "--tcrn-motion-product-shell-search",
  "--tcrn-color-brand-secondary-readable",
  "--tcrn-brand-accent-aos",
  "--tcrn-brand-accent-tms",
  "--tcrn-brand-accent-design-system-1",
  "--tcrn-brand-accent-design-system-2",
  "--tcrn-brand-accent-design-system-3",
  "--tcrn-brand-accent-design-system-4"
];

// Documented component-scoped local custom properties. These are declared inside specific
// component selectors (not :root, not the token surface) and parameterise a single family
// of rules (brand mark size, product-shell sidebar width, search-input metrics, work
// density). They are legitimately local and must be allowlisted so the gate does not
// false-positive on them.
const LOCAL_VARS = [
  "--tcrn-brand-mark-size",
  "--tcrn-product-shell-sidebar-width",
  "--tcrn-search-input-icon-size",
  "--tcrn-search-input-block-size",
  "--tcrn-search-input-padding-inline",
  "--tcrn-search-input-column-gap",
  "--tcrn-search-input-control-min-inline-size",
  "--tcrn-work-density-gap",
  "--tcrn-work-density-padding",
  "--tcrn-work-density-row-min"
];

function componentCss(source) {
  const declStart = source.indexOf("export const tcrnComponentCss = `");
  if (declStart === -1) throw new Error("token-extension-proof: tcrnComponentCss declaration not found");
  const openBacktick = source.indexOf("`", declStart);
  const closeBacktick = source.indexOf("`", openBacktick + 1);
  if (closeBacktick === -1) throw new Error("token-extension-proof: tcrnComponentCss closing backtick not found");
  // The literal carries no `${}` interpolation and no escaped backticks, so the first
  // backtick after the opener is the terminator.
  return source.slice(openBacktick + 1, closeBacktick);
}

export function tokenExtensionChecks() {
  const css = componentCss(readFileSync(NAVIGATION, "utf8"));
  const definedProps = [...css.matchAll(/^\s*(--tcrn-[a-z0-9-]+)\s*:/gim)].map((match) => match[1]);
  const definedSet = new Set(definedProps);

  const known = new Set([...tcrnTokens, ...tcrnDarkThemeTokens].map((token) => token.variable));
  const allowlisted = new Set([...known, ...EXTENSION_TOKENS, ...LOCAL_VARS]);

  const problems = [];

  // 1. No unregistered token definitions (catches future drift).
  const unregistered = [...definedSet].filter((property) => !allowlisted.has(property));
  for (const property of unregistered) {
    problems.push(
      `unregistered token defined in tcrnComponentCss: ${property} — register it in @tcrn/ui-tokens or add it to the EXTENSION_TOKENS / LOCAL_VARS log with justification`
    );
  }

  // 2. Allowlist completeness: a listed extension token must still exist (catches stale allowlist).
  const staleExtension = EXTENSION_TOKENS.filter((property) => !definedSet.has(property));
  for (const property of staleExtension) {
    problems.push(
      `stale EXTENSION_TOKENS entry: ${property} is allowlisted but no longer defined in tcrnComponentCss — remove it from the log`
    );
  }

  // 3. radius-panel single-source: the tcrnComponentCss redefinition must be gone.
  if (definedSet.has("--tcrn-radius-panel")) {
    problems.push(
      "--tcrn-radius-panel is redefined in tcrnComponentCss — it must be single-sourced from @tcrn/ui-tokens (delete the component-layer redefinition)"
    );
  }

  // 4. radius-panel / radius-surface shared-silhouette agreement in the token layer.
  const tokenMap = createTokenMap();
  const panel = tokenMap["--tcrn-radius-panel"];
  const surface = tokenMap["--tcrn-radius-surface"];
  if (panel === undefined || surface === undefined) {
    problems.push(
      `radius agreement not verifiable: --tcrn-radius-panel=${panel}, --tcrn-radius-surface=${surface} — one is missing from @tcrn/ui-tokens`
    );
  } else if (panel !== surface) {
    problems.push(
      `radius agreement broken: --tcrn-radius-panel (${panel}) must equal --tcrn-radius-surface (${surface}) in @tcrn/ui-tokens`
    );
  }

  return {
    problems,
    definitions: definedSet.size,
    known: known.size,
    extensionTokens: EXTENSION_TOKENS.length,
    localVars: LOCAL_VARS.length,
    radiusPanel: panel,
    radiusSurface: surface
  };
}

// pathToFileURL, not string concatenation: this repository lives under a path with a
// space in it, so `file://${argv[1]}` never matches the percent-encoded import.meta.url
// and the entry point silently does nothing.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { problems, ...summary } = tokenExtensionChecks();
  if (problems.length > 0) {
    console.error("TOKEN EXTENSION REGISTRY DRIFT:");
    for (const problem of problems) console.error(`  - ${problem}`);
    process.exit(1);
  }
  console.log(JSON.stringify({ ok: true, ...summary }, null, 2));
}
