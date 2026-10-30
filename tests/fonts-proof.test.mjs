import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { runFontsProof } from "../scripts/fonts-proof.mjs";
import { CSS_NAME, FONTS_DIR, LICENSES_DIR, MANIFEST_NAME, inRanges, parseUnicodeRange } from "../scripts/fonts-vendor.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(fs.readFileSync(path.join(repoRoot, FONTS_DIR, MANIFEST_NAME), "utf8"));
const firstFile = manifest.files[0].file;

// The four G+ family tokens the token-families check reads, with the stacks contract/tokens.json
// gives them (the heading token carries the serif stack, as @tcrn/ui-tokens does).
const contract = JSON.parse(fs.readFileSync(path.join(repoRoot, "docs/design/gplus-2026-10/contract/tokens.json"), "utf8"));
function contractStack(cssVar) {
  const entry = contract.fixed.find((token) => token.cssVar === cssVar);
  assert.ok(entry, `contract/tokens.json defines ${cssVar}`);
  return entry.value;
}
const openTokens = [
  { variable: "--tcrn-type-family-ui", value: contractStack("--tcrn-type-family-ui") },
  { variable: "--tcrn-type-family-heading", value: contractStack("--tcrn-type-family-serif") },
  { variable: "--tcrn-type-family-serif", value: contractStack("--tcrn-type-family-serif") },
  { variable: "--tcrn-type-family-mono", value: contractStack("--tcrn-type-family-mono") }
];
// Each family token and the Noto face its Chinese text must fall back to.
const CHINESE_FALLBACKS = [
  ["--tcrn-type-family-ui", "Noto Sans SC"],
  ["--tcrn-type-family-heading", "Noto Serif SC"],
  ["--tcrn-type-family-serif", "Noto Serif SC"],
  ["--tcrn-type-family-mono", "Noto Sans SC"]
];

function withToken(variable, value) {
  return openTokens.flatMap((token) => (token.variable !== variable ? [token] : value === undefined ? [] : [{ variable, value }]));
}

// The first ideograph that no shipped Chinese slice covers.
const chineseRanges = manifest.files.filter((entry) => entry.family === "Noto Sans SC").flatMap((entry) => parseUnicodeRange(entry.unicodeRange));
let uncoveredCodepoint = 0x4e00;
while (inRanges(uncoveredCodepoint, chineseRanges)) uncoveredCodepoint += 1;
const uncovered = String.fromCodePoint(uncoveredCodepoint);

function write(root, rel, body) {
  fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
  fs.writeFileSync(path.join(root, rel), body);
}

// A throwaway tree holding the committed fonts, licences and package metadata, one
// product source and a built dist, so each case can break exactly one thing.
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "tcrn-fonts-proof-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const rel of [FONTS_DIR, LICENSES_DIR]) fs.cpSync(path.join(repoRoot, rel), path.join(root, rel), { recursive: true });
  for (const rel of ["packages/ui-tokens/FONT-LICENSES.md", "packages/ui-tokens/package.json"]) fs.cpSync(path.join(repoRoot, rel), path.join(root, rel));
  write(root, "packages/demo/src/copy.ts", 'export const copy = { "zh-CN": "季度复盘", en: "Quarterly review", ja: "四半期レビュー" };\n');
  write(root, "packages/ui-tokens/dist/index.js", "export const tcrnTokens = [];\n");
  return root;
}

async function prove(root, tokens = openTokens) {
  return runFontsProof({ root, tokens });
}

function failures(report, id) {
  const check = report.checks.find((candidate) => candidate.id === id);
  assert.ok(check, `check ${id} exists`);
  return check.failures.join("\n");
}

function vendored(root, file = firstFile) {
  return path.join(root, FONTS_DIR, file);
}

function oneByteChanged(file) {
  const body = Buffer.from(fs.readFileSync(file));
  body[Math.floor(body.length / 2)] ^= 0xff;
  return body;
}

test("the committed fonts, manifest, stylesheet and licences pass every check", async (t) => {
  const report = await prove(fixture(t));
  assert.deepEqual(report.checks.filter((check) => !check.ok).map((check) => `${check.id}: ${check.failures.join("; ")}`), []);
  assert.equal(report.ok, true);
});

test("the fixture's family tokens are the contract's G+ stacks, mono with its Noto Sans SC fallback", async (t) => {
  assert.match(contractStack("--tcrn-type-family-mono"), /^"IBM Plex Mono","Noto Sans SC",/);
  assert.match(contractStack("--tcrn-type-family-ui"), /^"Hanken Grotesk","Noto Sans SC",/);
  assert.match(contractStack("--tcrn-type-family-serif"), /^"Source Serif 4","Noto Serif SC",/);
  const check = (await prove(fixture(t))).checks.find((candidate) => candidate.id === "token-families");
  assert.equal(check.ok, true, check.failures.join("; "));
  assert.match(check.pass, /^the 4 G\+ family tokens open with their vendored faces/);
});

test("a missing G+ family token turns token-families red", async (t) => {
  for (const { variable } of openTokens) {
    const report = await prove(fixture(t), withToken(variable, undefined));
    assert.equal(report.ok, false, `${variable} dropped`);
    assert.match(failures(report, "token-families"), new RegExp(`${variable} is missing from @tcrn/ui-tokens`));
  }
});

test("a G+ family token without its Noto Chinese fallback turns token-families red", async (t) => {
  for (const [variable, fallback] of CHINESE_FALLBACKS) {
    const stack = openTokens.find((token) => token.variable === variable).value;
    const stripped = stack.replace(`,"${fallback}"`, "");
    assert.notEqual(stripped, stack, `${variable} names "${fallback}" in the contract`);
    const report = await prove(fixture(t), withToken(variable, stripped));
    assert.equal(report.ok, false, `${variable} without "${fallback}"`);
    assert.match(failures(report, "token-families"), new RegExp(`${variable} lacks the Chinese fallback "${fallback}"`));
  }
});

test("a family fonts.css ships that no family token names turns token-families red", async (t) => {
  const root = fixture(t);
  fs.appendFileSync(path.join(root, FONTS_DIR, CSS_NAME), '@font-face {\n  font-family: "Example Grotesk";\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url("./example-grotesk.woff2") format("woff2");\n  unicode-range: U+0000-00FF;\n}\n');
  const report = await prove(root);
  assert.equal(report.ok, false);
  assert.equal(failures(report, "token-families"), 'fonts.css ships "Example Grotesk", which no family token names');
});

test("a woff2 copy with one byte changed turns the digest check red", async (t) => {
  const root = fixture(t);
  fs.writeFileSync(vendored(root), oneByteChanged(vendored(root)));
  const report = await prove(root);
  assert.equal(report.ok, false);
  assert.match(failures(report, "digests"), new RegExp(`${firstFile}: sha256 .* does not match`));
});

test("121 GWT3: a one-byte font mutation turns the real fonts-proof process red", (t) => {
  const root = fixture(t);
  write(root, "packages/ui-tokens/dist/index.js", `export const tcrnTokens = ${JSON.stringify(openTokens)};\n`);
  const invoke = () => {
    const argv = [path.join(repoRoot, "scripts/fonts-proof.mjs"), "--root", root];
    const run = spawnSync(process.execPath, argv, { cwd: root, encoding: "utf8" });
    return { argv: [process.execPath, ...argv], cwd: root, status: run.status, stdout: run.stdout, stderr: run.stderr };
  };
  const clean = invoke();
  assert.equal(clean.status, 0, clean.stderr);
  fs.writeFileSync(vendored(root), oneByteChanged(vendored(root)));
  const changed = invoke();
  t.diagnostic(JSON.stringify({ criterion: "121#3", fixture: root, file: firstFile, changedBytes: 1, clean, changed, cleanup: "test after removes isolated fixture" }));
  assert.equal(changed.status, 1, changed.stderr);
  assert.match(changed.stderr, /FAIL: digests/);
  assert.match(changed.stderr, /sha256 .* does not match/);
});

test("build output may hold identical copies of vendored files, never altered ones", async (t) => {
  const root = fixture(t);
  write(root, "apps/storybook/storybook-static/assets/face.woff2", fs.readFileSync(vendored(root)));
  assert.equal((await prove(root)).ok, true);
  write(root, "apps/storybook/storybook-static/assets/face.woff2", oneByteChanged(vendored(root)));
  const report = await prove(root);
  assert.equal(report.ok, false);
  assert.match(failures(report, "binaries"), /storybook-static\/assets\/face\.woff2 is a font binary in build output that is not a byte-identical copy/);
});

test("a font binary outside the vendored directory is red even when identical", async (t) => {
  const root = fixture(t);
  write(root, "apps/storybook/public/face.woff2", fs.readFileSync(vendored(root)));
  const report = await prove(root);
  assert.equal(report.ok, false);
  assert.match(failures(report, "binaries"), /apps\/storybook\/public\/face\.woff2: font binaries may live only in packages\/ui-tokens\/fonts/);
});

test("a file the manifest does not list is red inside the vendored directory", async (t) => {
  const root = fixture(t);
  write(root, `${FONTS_DIR}/extra.woff2`, fs.readFileSync(vendored(root)));
  const report = await prove(root);
  assert.equal(report.ok, false);
  assert.match(failures(report, "binaries"), /extra\.woff2 is not listed in the manifest/);
});

test("fonts.css and the manifest must agree in both directions", async (t) => {
  const dropped = fixture(t);
  const cssPath = path.join(dropped, FONTS_DIR, CSS_NAME);
  const css = fs.readFileSync(cssPath, "utf8");
  fs.writeFileSync(cssPath, css.replace(/@font-face \{[^}]*\}\n/, ""));
  assert.match(failures(await prove(dropped), "stylesheet"), new RegExp(`the manifest lists ${firstFile}, which fonts.css does not declare`));

  const extra = fixture(t);
  fs.appendFileSync(path.join(extra, FONTS_DIR, CSS_NAME), '@font-face {\n  font-family: "Hanken Grotesk";\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url("./unlisted.woff2") format("woff2");\n  unicode-range: U+0000-00FF;\n}\n');
  assert.match(failures(await prove(extra), "stylesheet"), /fonts\.css declares unlisted\.woff2, which the manifest does not list/);

  const blocking = fixture(t);
  const blockingPath = path.join(blocking, FONTS_DIR, CSS_NAME);
  fs.writeFileSync(blockingPath, fs.readFileSync(blockingPath, "utf8").replace("font-display: swap;", "font-display: block;"));
  assert.match(failures(await prove(blocking), "stylesheet"), /font-display is block, expected swap/);
});

test("a data: URI or a remote font host in fonts.css is red", async (t) => {
  for (const [src, expected] of [
    ['url("data:font/woff2;base64,d09GMg==") format("woff2")', /inlines a data: URI/],
    ['url("https://fonts.gstatic.com/s/face.woff2") format("woff2")', /references a remote URL/]
  ]) {
    const root = fixture(t);
    const cssPath = path.join(root, FONTS_DIR, CSS_NAME);
    fs.writeFileSync(cssPath, fs.readFileSync(cssPath, "utf8").replace(`url("./${firstFile}") format("woff2")`, src));
    const report = await prove(root);
    assert.equal(report.ok, false);
    assert.match(failures(report, "stylesheet"), expected);
  }
});

test("every family needs its OFL text with the recorded digest", async (t) => {
  const missing = fixture(t);
  fs.rmSync(path.join(missing, LICENSES_DIR, "noto-serif-sc-OFL.txt"));
  assert.match(failures(await prove(missing), "licences"), /Noto Serif SC: packages\/ui-tokens\/licenses\/noto-serif-sc-OFL\.txt is missing/);

  const edited = fixture(t);
  fs.appendFileSync(path.join(edited, LICENSES_DIR, "ibm-plex-mono-OFL.txt"), "\nedited\n");
  assert.match(failures(await prove(edited), "licences"), /IBM Plex Mono: licenses\/ibm-plex-mono-OFL\.txt differs from the recorded sha256/);
});

test("the package must ship the fonts, the licences and the licence notes", async (t) => {
  const root = fixture(t);
  const packagePath = path.join(root, "packages/ui-tokens/package.json");
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  packageJson.files = packageJson.files.filter((entry) => entry !== "licenses");
  delete packageJson.exports["./fonts.css"];
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  const text = failures(await prove(root), "package");
  assert.match(text, /files does not ship licenses/);
  assert.match(text, /does not export \.\/fonts\.css/);
});

test("zh-CN and untagged Chinese text outside the shipped slices is red; other locales are not", async (t) => {
  const tagged = fixture(t);
  write(tagged, "packages/demo/src/more.ts", `export const more = { "zh-CN": "${uncovered}", en: "x" };\n`);
  assert.match(failures(await prove(tagged), "coverage"), new RegExp(`Noto Sans SC: 1 product code point\\(s\\) outside the shipped slices \\(U\\+${uncoveredCodepoint.toString(16).toUpperCase()}`));

  const untagged = fixture(t);
  write(untagged, "apps/storybook/src/label.tsx", `export const Label = () => <span>${uncovered}</span>;\n`);
  assert.equal((await prove(untagged)).ok, false);

  const otherLocales = fixture(t);
  write(otherLocales, "packages/demo/src/more.ts", `export const more = { ja: "${uncovered}", ko: { title: "${uncovered}" } };\nexport const hint = "テスト${uncovered}";\n`);
  assert.equal((await prove(otherLocales)).ok, true);

  const testsOnly = fixture(t);
  write(testsOnly, "packages/demo/src/copy.test.ts", `export const fixtureText = "${uncovered}";\n`);
  assert.equal((await prove(testsOnly)).ok, true);
});

test("googleapis, gstatic or an inlined data: font in build output is red, and an unbuilt tree is not a pass", async (t) => {
  const cdn = fixture(t);
  write(cdn, "packages/ui-tokens/dist/fonts.js", 'export const href = "https://fonts.googleapis.com/css2?family=Hanken+Grotesk";\n');
  assert.match(failures(await prove(cdn), "build-output"), /packages\/ui-tokens\/dist\/fonts\.js references googleapis or gstatic/);

  const docs = fixture(t);
  write(docs, "apps/storybook/storybook-static/index.html", '<link rel="preconnect" href="https://fonts.gstatic.com">\n');
  assert.match(failures(await prove(docs), "build-output"), /storybook-static\/index\.html references googleapis or gstatic/);

  const inlined = fixture(t);
  write(inlined, "packages/ui-tokens/dist/fonts.css", "@font-face { font-family: X; src: url(data:font/woff2;base64,d09GMg==) format(\"woff2\"); }\n");
  assert.match(failures(await prove(inlined), "build-output"), /packages\/ui-tokens\/dist\/fonts\.css inlines a font as a data: URI/);

  const unbuilt = fixture(t);
  fs.rmSync(path.join(unbuilt, "packages/ui-tokens/dist"), { recursive: true });
  assert.match(failures(await prove(unbuilt), "build-output"), /no packages\/\*\/dist to scan/);
});

test("a proprietary face inside a distributable stack stays red", async (t) => {
  // distributable-* stacks only appear here: an open one passes, the proprietary one does not.
  const report = await prove(fixture(t), [
    ...openTokens,
    { variable: "--tcrn-type-family-distributable-latin", value: '"Hanken Grotesk", "Noto Sans SC", sans-serif' },
    { variable: "--tcrn-type-family-distributable-zh-cn", value: '"Noto Sans SC", "PingFang SC", sans-serif' }
  ]);
  assert.equal(report.ok, false);
  const text = failures(report, "proprietary");
  assert.match(text, /--tcrn-type-family-distributable-zh-cn advertises bundleability but names "PingFang"/);
  assert.doesNotMatch(text, /distributable-latin/);
});

test("build-time source guard retains local CSS and rejects remote, inline and host controls", async () => {
  const { guardStaticFontSource } = await import("../scripts/fonts-proof.mjs");
  const local = '@font-face { src: url("fonts/local.woff2") format("woff2"); }';
  assert.equal(guardStaticFontSource(local), local);
  for (const css of [
    '@import url("https://fonts.googleapis.com/css2?family=Example");',
    '@font-face { src: url("//fonts.gstatic.com/example.woff2"); }',
    '@font-face { src: url("https://example.test/font.woff2"); }',
    '@font-face { src: url("data:font/woff2;base64,AAAA"); }',
    '/* fonts.googleapis.com: retained literal guard also rejects this comment */' + local
  ]) assert.throws(() => guardStaticFontSource(css), /storybook_fonts_remote_or_inline_source/);
});
