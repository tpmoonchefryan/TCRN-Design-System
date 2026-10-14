// token-deprecation-notice: a consumer that only knows the old token names (TCRN-DS-STORY-120 GWT4).
// The consumer fixture is built in a throwaway directory: its stylesheet resolves through the
// shipped tokens.css to the G+ values in a real browser, and the notice script prints one
// old-name-to-new-name line per name it uses, exiting 0.
import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { createResolvedTokenMap, tcrnDeprecatedTokenAliases, tcrnDeprecatedTokens, tcrnThemeModes } from "../packages/ui-tokens/dist/index.js";
import { isSkippedDirectory, runDeprecationNotice, scanDeprecatedTokenUses } from "../scripts/token-deprecation-notice.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const script = path.join(repoRoot, "scripts/token-deprecation-notice.mjs");
const shippedTokensCss = fs.readFileSync(path.join(repoRoot, "packages/ui-tokens/src/tokens.css"), "utf8");

// [selector, property, old name]: colour, surface, edge, brand, status, focus, type and motion aliases.
const CONSUMER_RULES = [
  [".legacy-card", "color", "--tcrn-color-text-primary"],
  [".legacy-card", "background-color", "--tcrn-color-surface-panel"],
  [".legacy-card", "border-top-color", "--tcrn-color-border-control"],
  [".legacy-card__meta", "color", "--tcrn-color-text-muted"],
  [".legacy-card__hint", "color", "--tcrn-color-text-tertiary"],
  [".legacy-card__action", "background-color", "--tcrn-color-brand-primary"],
  [".legacy-card__action", "color", "--tcrn-color-text-inverse"],
  [".legacy-card__state", "color", "--tcrn-color-state-blocked"],
  [".legacy-card__state", "background-color", "--tcrn-color-state-blocked-bg"],
  [".legacy-card__focus", "box-shadow", "--tcrn-elevation-focus"],
  [".legacy-card__title", "font-family", "--tcrn-type-family-latin"],
  [".legacy-card__motion", "transition-timing-function", "--tcrn-motion-ease-out"]
];
const consumerCss = [...new Set(CONSUMER_RULES.map(([selector]) => selector))]
  .map((selector) => `${selector} {\n${CONSUMER_RULES.filter(([s]) => s === selector).map(([, property, old]) => `  ${property}: var(${old});`).join("\n")}\n}`)
  .join("\n");
// A component with inline styles, one of them on a name that has no G+ successor.
const consumerTsx = `export function LegacyBadge() {
  return <span style={{ color: "var(--tcrn-color-text-secondary)", borderColor: "var(--tcrn-color-border-subtle)", transform: "scale(var(--tcrn-motion-press-scale))" }}>legacy</span>;
}
`;
const FIXTURE_OLD_NAMES = [...CONSUMER_RULES.map(([, , old]) => old), "--tcrn-color-text-secondary", "--tcrn-color-border-subtle", "--tcrn-motion-press-scale"];

function write(root, rel, body) {
  fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
  fs.writeFileSync(path.join(root, rel), body);
}

// The consumer's source tree, with a vendored copy of the shipped tokens.css beside it.
function consumerProject(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "tcrn-token-consumer-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  write(root, "src/legacy-card.css", consumerCss);
  write(root, "src/LegacyBadge.tsx", consumerTsx);
  write(root, "src/vendor/tokens.css", shippedTokensCss);
  return root;
}

test("the fixture references old names only", () => {
  const deprecated = new Set(tcrnDeprecatedTokens.map((token) => token.variable));
  const referenced = [...`${consumerCss}\n${consumerTsx}`.matchAll(/var\(\s*(--tcrn-[a-z0-9-]+)/g)].map((match) => match[1]);
  assert.ok(referenced.length >= FIXTURE_OLD_NAMES.length);
  assert.deepEqual(referenced.filter((name) => !deprecated.has(name)), []);
  for (const old of FIXTURE_OLD_NAMES.filter((name) => name !== "--tcrn-motion-press-scale")) assert.ok(tcrnDeprecatedTokenAliases[old], `${old} has a successor`);
});

test("GWT4: the notice prints one old-to-new line per old name the consumer uses and exits 0", (t) => {
  const root = consumerProject(t);
  const run = spawnSync(process.execPath, [script, "--label", "legacy-consumer", path.join(root, "src")], { encoding: "utf8" });
  assert.equal(run.status, 0, run.stderr);
  assert.equal(run.stderr, "");
  const lines = run.stdout.trim().split("\n");
  assert.match(lines[0], /^@tcrn\/ui-tokens deprecated token notice \(legacy-consumer\): 15 deprecated name\(s\), 15 use\(s\) in 2 of 3 file\(s\)$/);
  const notices = lines.filter((line) => line.startsWith("  deprecated token "));
  assert.equal(notices.length, FIXTURE_OLD_NAMES.length);
  for (const old of FIXTURE_OLD_NAMES) {
    const line = notices.find((candidate) => candidate.startsWith(`  deprecated token ${old} `));
    assert.ok(line, `a notice names ${old}`);
    const replacement = tcrnDeprecatedTokenAliases[old];
    if (replacement) assert.match(line, new RegExp(`^  deprecated token ${old} \\(1 use\\): use ${replacement} \\[src/`));
    else assert.match(line, /no G\+ successor; plan its removal/);
  }
  // The vendored tokens.css defines the aliases; it uses none of them.
  assert.equal(run.stdout.includes("vendor/tokens.css"), false);
  t.diagnostic(notices.slice(0, 3).join(" | "));
});

test("the notice reports a path that does not exist as a usage error, and stays quiet on clean source", (t) => {
  const missing = spawnSync(process.execPath, [script, path.join(os.tmpdir(), "tcrn-token-consumer-missing", "src")], { encoding: "utf8" });
  assert.equal(missing.status, 2);
  assert.match(missing.stderr, /path not found/);
  const root = consumerProject(t);
  write(root, "clean/card.css", ".card { color: var(--tcrn-color-ink); border-color: var(--tcrn-color-line-ctl); }\n");
  const clean = runDeprecationNotice({ paths: [path.join(root, "clean")], label: "clean" });
  assert.deepEqual(clean.usages, []);
  assert.deepEqual(clean.lines, ["@tcrn/ui-tokens deprecated token notice (clean): no deprecated token names in 1 file(s)"]);
});

test("only build output is left out: a build directory under src is scanned, a root's own build output is not (TCRN-DS-SUB-222)", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "tcrn-token-consumer-build-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const oldName = 'export const muted = "var(--tcrn-color-text-secondary)";\n';
  write(root, "src/build/navigation.ts", oldName);
  write(root, "build/navigation.js", oldName);
  write(root, "src/dist/navigation.js", oldName);
  const name = path.basename(root);
  // Given the project root: the source file under src/build is counted; the root's build/ output
  // and a dist/ anywhere are still skipped. The old rule skipped every directory named build, so
  // it found no file here at all.
  const whole = runDeprecationNotice({ paths: [root], label: "build-dirs" });
  assert.deepEqual(whole.files, [`${name}/src/build/navigation.ts`]);
  assert.deepEqual(whole.usages.map(({ variable, count, files }) => ({ variable, count, files })), [
    { variable: "--tcrn-color-text-secondary", count: 1, files: [`${name}/src/build/navigation.ts`] }
  ]);
  // Given the source directory itself, as the Storybook build passes apps/storybook/src: its
  // build directory is still under src, so it is scanned.
  const fromSource = runDeprecationNotice({ paths: [path.join(root, "src")], label: "build-dirs" });
  assert.deepEqual(fromSource.files, ["src/build/navigation.ts"]);
  assert.deepEqual(fromSource.usages.map(({ variable, count }) => ({ variable, count })), [{ variable: "--tcrn-color-text-secondary", count: 1 }]);
  // The rule reads the relative path the notice prints.
  assert.equal(isSkippedDirectory("consumer/build"), true);
  assert.equal(isSkippedDirectory("consumer/packages/ui/build"), true);
  assert.equal(isSkippedDirectory("consumer/src/build"), false);
  assert.equal(isSkippedDirectory("src/build"), false);
  assert.equal(isSkippedDirectory("consumer/src/node_modules"), true);
});

test("definitions are not uses; setting an old name is, with a note to set the new one", () => {
  assert.deepEqual(scanDeprecatedTokenUses(shippedTokensCss, { stylesheet: true }), []);
  assert.deepEqual(scanDeprecatedTokenUses(":root { --tcrn-color-text-primary: var(--tcrn-color-ink); }", { stylesheet: true }), []);
  assert.deepEqual(scanDeprecatedTokenUses("/* was --tcrn-color-text-primary */ .a { color: red; }", { stylesheet: true }), []);
  assert.deepEqual(scanDeprecatedTokenUses(".scope { --tcrn-color-text-primary: #000; }", { stylesheet: true }), [
    { variable: "--tcrn-color-text-primary", replacement: "--tcrn-color-ink", count: 1, overrides: 1 }
  ]);
  // A longer deprecated name is not counted as its prefix.
  assert.deepEqual(scanDeprecatedTokenUses(".chip { background: var(--tcrn-color-state-warning-bg); }").map((use) => use.variable), ["--tcrn-color-state-warning-bg"]);
});

let browser;
before(async () => {
  browser = await chromium.launch();
});
after(async () => {
  await browser?.close();
});

test("GWT4: the consumer stylesheet resolves through the shipped tokens.css to the new values in both themes", async (t) => {
  // Each rule is mirrored by one that names the successor and one that holds the package's
  // resolved value for the theme, so both names and the literal value can be compared.
  const probes = CONSUMER_RULES.map(([selector, property, old], index) => ({ selector, property, old, replacement: tcrnDeprecatedTokenAliases[old], index }));
  const probeCss = probes
    .map(({ property, replacement, index }) => [
      `.ref-${index} { ${property}: var(${replacement}); }`,
      ...tcrnThemeModes.map((theme) => `.lit-${index}-${theme} { ${property}: ${createResolvedTokenMap(theme)[replacement]}; }`)
    ].join("\n"))
    .join("\n")
    // Negative control: a name nobody defines falls back to the inherited colour.
    .concat("\n.unaliased { color: var(--tcrn-color-text-primary-unaliased); }");
  const scope = (theme) =>
    '<div class="unaliased"></div>' +
    [...new Set(probes.map((probe) => probe.selector))].map((selector) => `<div class="${selector.slice(1)}"></div>`).join("") +
    probes.map(({ index }) => `<div class="ref-${index}"></div><div class="lit-${index}-${theme}"></div>`).join("");
  const page = await browser.newPage();
  try {
    await page.setContent(
      `<!doctype html><html><head><style>${shippedTokensCss.replace(/@import[^;]*;/g, "")}</style><style>${consumerCss}</style><style>${probeCss}</style></head>` +
        `<body><section data-scope="light">${scope("light")}</section><section data-scope="dark" data-tcrn-theme="dark">${scope("dark")}</section></body></html>`
    );
    const computed = await page.evaluate((list) => {
      const read = (section, selector, property) => getComputedStyle(section.querySelector(selector)).getPropertyValue(property).trim();
      return ["light", "dark"].flatMap((theme) => {
        const section = document.querySelector(`[data-scope="${theme}"]`);
        const unaliased = read(section, ".unaliased", "color");
        return list.map(({ selector, property, index }) => ({
          unaliased,
          theme,
          index,
          consumer: read(section, selector, property),
          successor: read(section, `.ref-${index}`, property),
          literal: read(section, `.lit-${index}-${theme}`, property)
        }));
      });
    }, probes);
    for (const { theme, index, consumer, successor, literal } of computed) {
      const { old, replacement, property } = probes[index];
      assert.ok(literal, `${replacement} has a ${theme} value for ${property}`);
      assert.equal(consumer, successor, `${old} resolves like ${replacement} (${theme}, ${property})`);
      assert.equal(consumer, literal, `${old} resolves to the package's ${theme} value of ${replacement} (${property})`);
    }
    // The themes really differ for the colour aliases, so the dark comparison is not vacuous.
    const textPrimary = computed.filter(({ index }) => probes[index].old === "--tcrn-color-text-primary").map((entry) => entry.consumer);
    assert.equal(textPrimary.length, 2);
    assert.notEqual(textPrimary[0], textPrimary[1]);
    // And a broken alias would have been caught: an undefined name does not land on the value.
    for (const entry of computed.filter(({ index }) => probes[index].old === "--tcrn-color-text-primary")) assert.notEqual(entry.unaliased, entry.consumer);
    for (const entry of computed.filter(({ index }) => ["--tcrn-color-text-primary", "--tcrn-elevation-focus"].includes(probes[index].old))) {
      t.diagnostic(`${entry.theme} ${probes[entry.index].old} -> ${entry.consumer}`);
    }
  } finally {
    await page.close();
  }
});

test("a [data-tcrn-theme=\"light\"] block inside a dark ancestor resolves through the shipped tokens.css to the light values", async () => {
  // TCRN-DS-SUB-047: the light theme block is `:root, [data-tcrn-theme="light"]`, so a light subtree
  // re-declares the light values instead of inheriting the night ones from the dark page. Themed
  // tokens, a token that references a themed token (surface, focus ring) and an old name are read;
  // each is mirrored by literal probes holding the package's resolved light and dark values.
  const probes = [
    ["--tcrn-color-bg", "background-color"],
    ["--tcrn-color-panel-2", "background-color"],
    ["--tcrn-color-ink", "color"],
    ["--tcrn-color-ink-3", "color"],
    ["--tcrn-color-acc", "color"],
    ["--tcrn-color-surface", "background-color"],
    ["--tcrn-focus-ring", "box-shadow"],
    ["--tcrn-color-text-primary", "color"]
  ].map(([variable, property], index) => ({ variable, property, index }));
  const resolved = Object.fromEntries(tcrnThemeModes.map((theme) => [theme, createResolvedTokenMap(theme)]));
  for (const { variable } of probes) assert.notEqual(resolved.light[variable], resolved.dark[variable], `${variable} differs between the themes`);
  const probeCss = probes
    .map(({ variable, property, index }) => [
      `.var-${index} { ${property}: var(${variable}); }`,
      ...tcrnThemeModes.map((theme) => `.lit-${index}-${theme} { ${property}: ${resolved[theme][variable]}; }`)
    ].join("\n"))
    .join("\n");
  const cells = probes.map(({ index }) => `<i class="var-${index}"></i>${tcrnThemeModes.map((theme) => `<i class="lit-${index}-${theme}"></i>`).join("")}`).join("");
  const page = await browser.newPage();
  try {
    // The page root is dark; a light subtree sits inside it, and a dark subtree inside that.
    await page.setContent(
      `<!doctype html><html data-tcrn-theme="dark"><head><style>${shippedTokensCss.replace(/@import[^;]*;/g, "")}</style><style>${probeCss}</style></head>` +
        `<body><div data-scope="page">${cells}</div><div data-scope="light" data-tcrn-theme="light">${cells}<div data-scope="dark" data-tcrn-theme="dark">${cells}</div></div></body></html>`
    );
    const computed = await page.evaluate((list) => {
      const read = (scope, selector, property) => getComputedStyle(document.querySelector(`[data-scope="${scope}"] > ${selector}`)).getPropertyValue(property).trim();
      return ["page", "light", "dark"].flatMap((scope) =>
        list.map(({ property, index }) => ({ scope, index, token: read(scope, `.var-${index}`, property), light: read(scope, `.lit-${index}-light`, property), dark: read(scope, `.lit-${index}-dark`, property) }))
      );
    }, probes);
    // The dark page root takes the night values (the dark block follows the light list), the light
    // subtree the light values, and a dark subtree inside it the night values again.
    const expected = { page: "dark", light: "light", dark: "dark" };
    for (const { scope, index, token, light, dark } of computed) {
      const { variable, property } = probes[index];
      assert.ok(light && dark && light !== dark, `${variable} has distinct light and dark literals for ${property}`);
      assert.equal(token, expected[scope] === "light" ? light : dark, `${variable} (${property}) in the ${scope} scope resolves to the ${expected[scope]} value`);
    }
  } finally {
    await page.close();
  }
});
