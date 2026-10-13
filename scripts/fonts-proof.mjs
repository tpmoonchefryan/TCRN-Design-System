// Font proof.
//
// @tcrn/ui-tokens ships five SIL OFL-1.1 font families as byte-identical copies of
// pinned upstream files (packages/ui-tokens/FONT-LICENSES.md). That position only holds
// while it is checked mechanically, so this gate fails on any of:
//
//   manifest     manifest.json does not name the five families, or an entry is malformed
//   digests      a vendored file is missing, or its sha256 or byte count differs from
//                the manifest (a single changed byte is enough)
//   binaries     a font binary sits anywhere but packages/ui-tokens/fonts, or that
//                directory holds a file the manifest does not list; build output (dist,
//                storybook-static) may hold byte-identical copies of vendored files only
//   stylesheet   fonts.css and the manifest disagree in either direction, a face is not
//                font-display: swap, or a src is not one relative woff2 URL (no data:
//                URI, no remote host)
//   licences     a family lacks its OFL text, or the text differs from the recorded digest
//   package      @tcrn/ui-tokens does not ship fonts/, licenses/ and FONT-LICENSES.md or
//                does not export ./fonts.css and ./fonts/*
//   coverage     a product code point falls outside the shipped Chinese slices, the
//                sample 季度复盘 is not in the serif fallback, or a Latin family lacks
//                latin or latin-ext
//   build-output a package dist or the docs build references googleapis or gstatic, or
//                inlines a font as a data: URI
//   proprietary  a proprietary face appears in a stack that promises bundleability
//                (stacks are read with their var() references resolved)
//   token-families
//                a G+ family token (--tcrn-type-family-ui / heading / serif / mono) does
//                not open with its vendored face, drops its Noto Chinese fallback, or
//                names a bundled face that fonts.css does not declare with @font-face;
//                or fonts.css ships a family that no family token names
//
// Scope note kept from the earlier proof: `storybook build` writes its own manager
// chrome fonts (Nunito Sans, SIL OFL-1.1) into apps/storybook/storybook-preview-static/.
// That directory is gitignored and is not the deployed docs artifact (storybook-static),
// so it stays outside the binary sweep.
//
//   node scripts/fonts-proof.mjs [--root <dir>]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  CSS_NAME,
  FAMILIES,
  FONT_EXTENSIONS,
  FONTS_DIR,
  LATIN_SUBSETS,
  MANIFEST_NAME,
  MANIFEST_SCHEMA,
  PRODUCT_SAMPLE,
  UPSTREAM_LICENSE,
  collectProductCodepoints,
  formatCodepoint,
  inRanges,
  parseUnicodeRange,
  sha256,
  upstreamDir
} from "./fonts-vendor.mjs";

const scriptRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PACKAGE_DIR = "packages/ui-tokens";
const SKIP_DIRS = new Set(["node_modules", ".git", ".pnpm-store", ".tarball-smoke", "storybook-preview-static"]);
const BUILD_OUTPUT_DIRS = new Set(["dist", "storybook-static"]);
const DOCS_BUILD = "apps/storybook/storybook-static";
const CDN_PATTERN = /googleapis|gstatic/i;
const DATA_FONT_PATTERN = /data:(?:font\/|application\/(?:x-)?font)/i;
const BINARY_EXTENSIONS = new Set([...FONT_EXTENSIONS, ".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".ico", ".tgz", ".gz", ".zip"]);
const OFL_MARKER = /SIL OPEN FONT LICENSE Version 1\.1/i;

// Faces that may never appear in a stack advertised as distributable.
export const PROPRIETARY = [
  "SF Pro", "SF Mono", "-apple-system", "BlinkMacSystemFont",
  "PingFang", "Hiragino", "Apple SD Gothic", "Songti", "Heiti",
  "Microsoft YaHei", "Yu Gothic", "Malgun Gothic", "Meiryo", "Consolas", "SFMono-Regular"
];

function toPosix(rel) {
  return rel.split(path.sep).join("/");
}

function walk(root, start, visit) {
  const base = path.join(root, start);
  if (!fs.existsSync(base)) return;
  const stack = [base];
  while (stack.length) {
    const dir = stack.pop();
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name)) stack.push(full);
      } else if (entry.isFile()) {
        visit(toPosix(path.relative(root, full)), full);
      }
    }
  }
}

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

export function parseFontFaces(css) {
  const faces = [];
  for (const match of stripComments(css).matchAll(/@font-face\s*\{([^}]*)\}/g)) {
    const face = {};
    for (const declaration of match[1].split(";")) {
      const colon = declaration.indexOf(":");
      if (colon < 0) continue;
      face[declaration.slice(0, colon).trim().toLowerCase()] = declaration.slice(colon + 1).trim();
    }
    faces.push(face);
  }
  return faces;
}

function unquote(value = "") {
  return value.trim().replace(/^(["'])(.*)\1$/, "$2");
}

function readManifest(root, failures) {
  const file = path.join(root, FONTS_DIR, MANIFEST_NAME);
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    failures.push(`${FONTS_DIR}/${MANIFEST_NAME} is missing or not JSON (${error.message})`);
    return null;
  }
}

function checkManifest(manifest, failures) {
  if (!manifest) return;
  if (manifest.schemaVersion !== MANIFEST_SCHEMA) failures.push(`schemaVersion is ${manifest.schemaVersion}, expected ${MANIFEST_SCHEMA}`);
  const declared = (manifest.families ?? []).map((family) => family.family);
  for (const family of FAMILIES) if (!declared.includes(family.family)) failures.push(`family ${family.family} is missing`);
  for (const name of declared) if (!FAMILIES.some((family) => family.family === name)) failures.push(`unexpected family ${name}`);
  const files = Array.isArray(manifest.files) ? manifest.files : [];
  if (!files.length) failures.push("the manifest lists no font files");
  for (const entry of files) {
    const label = entry.file ?? "(unnamed entry)";
    for (const key of ["file", "family", "style", "weight", "subset", "unicodeRange", "sha256", "bytes"]) {
      if (entry[key] === undefined || entry[key] === "") failures.push(`${label}: ${key} is missing`);
    }
    if (!entry.upstream?.package || !entry.upstream?.version || !entry.upstream?.integrity) failures.push(`${label}: upstream package, version or integrity is missing`);
    if (typeof entry.file === "string" && (/[\\/]/.test(entry.file) || path.extname(entry.file).toLowerCase() !== ".woff2")) failures.push(`${label}: must be a .woff2 file directly in ${FONTS_DIR}`);
    if (!declared.includes(entry.family)) failures.push(`${label}: family ${entry.family} is not declared`);
    try {
      parseUnicodeRange(entry.unicodeRange ?? "");
    } catch (error) {
      failures.push(`${label}: ${error.message}`);
    }
  }
  const bytes = files.reduce((sum, entry) => sum + (Number(entry.bytes) || 0), 0);
  if (manifest.totals?.files !== files.length || manifest.totals?.bytes !== bytes) failures.push(`totals record ${manifest.totals?.files} files and ${manifest.totals?.bytes} bytes; entries sum to ${files.length} files and ${bytes} bytes`);
}

function checkDigests(root, files, failures) {
  for (const entry of files) {
    const rel = `${FONTS_DIR}/${entry.file}`;
    const full = path.join(root, FONTS_DIR, entry.file);
    if (!fs.existsSync(full)) {
      failures.push(`${rel} is listed in the manifest but missing`);
      continue;
    }
    const body = fs.readFileSync(full);
    if (body.length !== entry.bytes) failures.push(`${rel}: ${body.length} bytes, the manifest records ${entry.bytes}`);
    const digest = sha256(body);
    if (digest !== entry.sha256) failures.push(`${rel}: sha256 ${digest.slice(0, 16)} does not match the manifest's ${String(entry.sha256).slice(0, 16)}`);
  }
}

function checkBinaries(root, files, failures) {
  const listed = new Set(files.map((entry) => entry.file));
  const digests = new Set(files.map((entry) => entry.sha256));
  let copies = 0;
  walk(root, ".", (rel, full) => {
    if (!FONT_EXTENSIONS.has(path.extname(rel).toLowerCase())) return;
    if (path.posix.dirname(rel) === FONTS_DIR) {
      if (!listed.has(path.posix.basename(rel))) failures.push(`${rel} is not listed in the manifest`);
      return;
    }
    if (rel.split("/").some((segment) => BUILD_OUTPUT_DIRS.has(segment))) {
      if (digests.has(sha256(fs.readFileSync(full)))) copies += 1;
      else failures.push(`${rel} is a font binary in build output that is not a byte-identical copy of a vendored file`);
      return;
    }
    failures.push(`${rel}: font binaries may live only in ${FONTS_DIR}`);
  });
  return copies;
}

function checkStylesheet(root, files, failures) {
  const cssPath = path.join(root, FONTS_DIR, CSS_NAME);
  if (!fs.existsSync(cssPath)) {
    failures.push(`${FONTS_DIR}/${CSS_NAME} is missing`);
    return;
  }
  const css = fs.readFileSync(cssPath, "utf8");
  const code = stripComments(css);
  if (/data:/i.test(code)) failures.push(`${CSS_NAME} inlines a data: URI`);
  if (/[a-z][a-z0-9+.-]*:\/\/|url\(\s*["']?\/\//i.test(code)) failures.push(`${CSS_NAME} references a remote URL`);
  if (CDN_PATTERN.test(css)) failures.push(`${CSS_NAME} names googleapis or gstatic`);
  const byFile = new Map(files.map((entry) => [entry.file, entry]));
  const seen = new Set();
  for (const face of parseFontFaces(css)) {
    const src = face.src ?? "";
    const match = src.match(/^url\((["']?)\.\/([A-Za-z0-9._-]+\.woff2)\1\)\s+format\((["'])woff2\3\)$/);
    if (!match) {
      failures.push(`an @font-face src is not one relative woff2 URL: ${src.slice(0, 80)}`);
      continue;
    }
    const file = match[2];
    if (seen.has(file)) failures.push(`${file} is declared by more than one @font-face`);
    seen.add(file);
    const entry = byFile.get(file);
    if (!entry) {
      failures.push(`${CSS_NAME} declares ${file}, which the manifest does not list`);
      continue;
    }
    const family = unquote(face["font-family"]);
    if (family !== entry.family) failures.push(`${file}: font-family "${family}" but the manifest records "${entry.family}"`);
    if (face["font-style"] !== entry.style) failures.push(`${file}: font-style ${face["font-style"]} but the manifest records ${entry.style}`);
    if (face["font-weight"] !== entry.weight) failures.push(`${file}: font-weight ${face["font-weight"]} but the manifest records ${entry.weight}`);
    if ((face["unicode-range"] ?? "").replace(/\s+/g, "") !== String(entry.unicodeRange).replace(/\s+/g, "")) failures.push(`${file}: unicode-range differs from the manifest`);
    if (face["font-display"] !== "swap") failures.push(`${file}: font-display is ${face["font-display"] ?? "unset"}, expected swap`);
  }
  for (const entry of files) if (!seen.has(entry.file)) failures.push(`the manifest lists ${entry.file}, which ${CSS_NAME} does not declare`);
}

function checkLicences(root, manifest, failures) {
  for (const family of manifest?.families ?? []) {
    const license = family.license;
    if (!license?.file) {
      failures.push(`${family.family}: no licence file recorded`);
      continue;
    }
    if (license.spdx !== UPSTREAM_LICENSE) failures.push(`${family.family}: licence ${license.spdx}, expected ${UPSTREAM_LICENSE}`);
    if (!/^licenses\/[A-Za-z0-9._-]+$/.test(license.file)) failures.push(`${family.family}: licence file ${license.file} is not in licenses/`);
    const full = path.join(root, PACKAGE_DIR, license.file);
    if (!fs.existsSync(full)) {
      failures.push(`${family.family}: ${PACKAGE_DIR}/${license.file} is missing`);
      continue;
    }
    const body = fs.readFileSync(full);
    if (sha256(body) !== license.sha256) failures.push(`${family.family}: ${license.file} differs from the recorded sha256`);
    if (!OFL_MARKER.test(body.toString("utf8"))) failures.push(`${family.family}: ${license.file} is not the SIL OFL 1.1 text`);
  }
  const docPath = path.join(root, PACKAGE_DIR, "FONT-LICENSES.md");
  if (!fs.existsSync(docPath)) failures.push(`${PACKAGE_DIR}/FONT-LICENSES.md is missing`);
  else {
    const doc = fs.readFileSync(docPath, "utf8");
    for (const family of FAMILIES) if (!doc.includes(family.family)) failures.push(`FONT-LICENSES.md does not name ${family.family}`);
  }
}

function checkPackage(root, failures) {
  const packagePath = path.join(root, PACKAGE_DIR, "package.json");
  if (!fs.existsSync(packagePath)) {
    failures.push(`${PACKAGE_DIR}/package.json is missing`);
    return;
  }
  const manifest = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  for (const needed of ["fonts", "licenses", "FONT-LICENSES.md"]) {
    if (!manifest.files?.includes(needed)) failures.push(`${manifest.name} files does not ship ${needed}`);
  }
  if (manifest.exports?.["./fonts.css"] !== `./fonts/${CSS_NAME}`) failures.push(`${manifest.name} does not export ./fonts.css as ./fonts/${CSS_NAME}`);
  if (manifest.exports?.["./fonts/*"] !== "./fonts/*") failures.push(`${manifest.name} does not export ./fonts/*`);
}

function upstreamSliceRanges(root, family) {
  const file = path.join(upstreamDir(root, family.package), "unicode.json");
  if (!fs.existsSync(file)) return null;
  const unicode = JSON.parse(fs.readFileSync(file, "utf8"));
  return Object.entries(unicode).filter(([key]) => /^\[\d+\]$/.test(key)).flatMap(([, range]) => parseUnicodeRange(range));
}

function checkCoverage(root, files, failures, notes) {
  const product = collectProductCodepoints(root);
  const rangesOf = (name) => files.filter((entry) => entry.family === name).flatMap((entry) => parseUnicodeRange(entry.unicodeRange ?? ""));
  for (const family of FAMILIES.filter((candidate) => candidate.selection === "cjk")) {
    const ranges = rangesOf(family.family);
    const missing = product.codepoints.filter((codepoint) => !inRanges(codepoint, ranges));
    if (!missing.length) continue;
    const upstream = upstreamSliceRanges(root, family);
    const fixable = upstream ? missing.filter((codepoint) => inRanges(codepoint, upstream)) : missing;
    const unavailable = upstream ? missing.filter((codepoint) => !inRanges(codepoint, upstream)) : [];
    if (fixable.length) {
      const shown = fixable.slice(0, 12).map(formatCodepoint).join(", ");
      failures.push(`${family.family}: ${fixable.length} product code point(s) outside the shipped slices (${shown}${fixable.length > 12 ? ", ..." : ""}); run node scripts/fonts-vendor.mjs`);
    }
    if (unavailable.length) notes.push(`${family.family}: upstream has no slice for ${unavailable.map(formatCodepoint).join(", ")}`);
  }
  const serif = FAMILIES.find((family) => family.role === "heading-zh-fallback");
  const serifRanges = rangesOf(serif.family);
  for (const char of PRODUCT_SAMPLE) {
    if (!inRanges(char.codePointAt(0), serifRanges)) failures.push(`${serif.family} does not cover ${formatCodepoint(char.codePointAt(0))} of the sample ${PRODUCT_SAMPLE}`);
  }
  for (const family of FAMILIES.filter((candidate) => candidate.selection === "latin")) {
    for (const subset of LATIN_SUBSETS) {
      if (!files.some((entry) => entry.family === family.family && entry.subset === subset)) failures.push(`${family.family}: the ${subset} subset is not shipped`);
    }
  }
  return product;
}

function checkBuildOutput(root, failures, notes) {
  const roots = [];
  const packagesDir = path.join(root, "packages");
  if (fs.existsSync(packagesDir)) {
    for (const entry of fs.readdirSync(packagesDir, { withFileTypes: true })) {
      if (entry.isDirectory() && fs.existsSync(path.join(packagesDir, entry.name, "dist"))) roots.push(`packages/${entry.name}/dist`);
    }
  }
  if (fs.existsSync(path.join(root, DOCS_BUILD))) roots.push(DOCS_BUILD);
  else notes.push(`${DOCS_BUILD} is not built; only the package dist directories were scanned`);
  if (!roots.some((rel) => rel.startsWith("packages/"))) failures.push("no packages/*/dist to scan; build the packages before running the proof");
  let scanned = 0;
  for (const start of roots) {
    walk(root, start, (rel, full) => {
      if (BINARY_EXTENSIONS.has(path.extname(rel).toLowerCase())) return;
      scanned += 1;
      const body = fs.readFileSync(full, "utf8");
      if (CDN_PATTERN.test(body)) failures.push(`${rel} references googleapis or gstatic`);
      if (DATA_FONT_PATTERN.test(body)) failures.push(`${rel} inlines a font as a data: URI`);
    });
  }
  return { roots, scanned };
}

async function loadTokenList(root, tokens, failures) {
  if (tokens) return tokens;
  const distIndex = path.join(root, PACKAGE_DIR, "dist/index.js");
  if (!fs.existsSync(distIndex)) {
    failures.push(`${PACKAGE_DIR}/dist/index.js is missing; build @tcrn/ui-tokens first`);
    return null;
  }
  return (await import(pathToFileURL(distIndex).href)).tcrnTokens ?? [];
}

// Deprecated aliases are `var(--new)`; read every stack the way a browser computes it.
export function resolveTokenValue(value, byVariable, depth = 0) {
  return String(value).replace(/var\(\s*(--[a-z0-9-]+)\s*\)/g, (whole, name) =>
    depth < 8 && byVariable.has(name) ? resolveTokenValue(byVariable.get(name), byVariable, depth + 1) : whole
  );
}

async function checkProprietary(root, tokens, manifest, failures) {
  const list = await loadTokenList(root, tokens, failures);
  if (!list) return 0;
  const byVariable = new Map(list.map((token) => [String(token.variable), String(token.value)]));
  const distributable = list.filter((token) => String(token.variable).includes("distributable"));
  for (const token of distributable) {
    const value = resolveTokenValue(token.value, byVariable).toLowerCase();
    for (const face of PROPRIETARY) {
      if (value.includes(face.toLowerCase())) failures.push(`${token.variable} advertises bundleability but names "${face}"`);
    }
  }
  for (const family of manifest?.families ?? []) {
    for (const face of PROPRIETARY) {
      if (String(family.family).toLowerCase().includes(face.toLowerCase())) failures.push(`the vendored family ${family.family} is a proprietary face`);
    }
  }
  return distributable.length;
}

// G+ family tokens and the vendored roles they must use (FAMILIES[].role): the stack opens
// with the `role` face, and Chinese text falls back to the `fallback` face.
export const TOKEN_FAMILY_STACKS = [
  { variable: "--tcrn-type-family-ui", role: "ui", fallback: "ui-zh-fallback" },
  { variable: "--tcrn-type-family-heading", role: "heading", fallback: "heading-zh-fallback" },
  { variable: "--tcrn-type-family-serif", role: "heading", fallback: "heading-zh-fallback" },
  { variable: "--tcrn-type-family-mono", role: "mono", fallback: "ui-zh-fallback" }
];

export function parseFamilyStack(value) {
  const entries = [];
  let current = "";
  let quote = null;
  for (const char of String(value)) {
    if (quote) {
      if (char === quote) quote = null;
      current += char;
    } else if (char === '"' || char === "'") {
      quote = char;
      current += char;
    } else if (char === ",") {
      entries.push(current.trim());
      current = "";
    } else current += char;
  }
  if (current.trim()) entries.push(current.trim());
  return entries.filter(Boolean).map((entry) => ({ name: unquote(entry), quoted: /^["']/.test(entry) }));
}

async function checkTokenFamilies(root, tokens, failures) {
  const list = await loadTokenList(root, tokens, failures);
  if (!list) return { stacks: 0, faces: 0 };
  const cssPath = path.join(root, FONTS_DIR, CSS_NAME);
  const declared = new Set(
    fs.existsSync(cssPath) ? parseFontFaces(fs.readFileSync(cssPath, "utf8")).map((face) => unquote(face["font-family"])) : []
  );
  if (!declared.size) failures.push(`${FONTS_DIR}/${CSS_NAME} declares no @font-face`);
  const vendored = new Set(FAMILIES.map((family) => family.family));
  const byRole = new Map(FAMILIES.map((family) => [family.role, family.family]));
  const byVariable = new Map(list.map((token) => [String(token.variable), String(token.value)]));
  const named = new Set();
  for (const { variable, role, fallback } of TOKEN_FAMILY_STACKS) {
    if (!byVariable.has(variable)) {
      failures.push(`${variable} is missing from @tcrn/ui-tokens`);
      continue;
    }
    const stack = parseFamilyStack(resolveTokenValue(byVariable.get(variable), byVariable));
    const names = stack.map((entry) => entry.name);
    if (names[0] !== byRole.get(role)) failures.push(`${variable} opens with "${names[0] ?? ""}", expected the vendored ${role} face "${byRole.get(role)}"`);
    if (fallback && !names.slice(1).includes(byRole.get(fallback))) failures.push(`${variable} lacks the Chinese fallback "${byRole.get(fallback)}"`);
    for (const entry of stack.filter((candidate) => candidate.quoted || vendored.has(candidate.name))) {
      named.add(entry.name);
      if (!declared.has(entry.name)) failures.push(`${variable} names "${entry.name}", which ${CSS_NAME} does not declare with @font-face`);
    }
  }
  for (const family of declared) if (!named.has(family)) failures.push(`${CSS_NAME} ships "${family}", which no family token names`);
  return { stacks: TOKEN_FAMILY_STACKS.length, faces: named.size };
}

export async function runFontsProof({ root = scriptRoot, tokens } = {}) {
  const checks = [];
  const record = (id, failures, pass, notes = []) => checks.push({ id, ok: failures.length === 0, failures, pass, notes });

  const manifestFailures = [];
  const manifest = readManifest(root, manifestFailures);
  checkManifest(manifest, manifestFailures);
  const files = Array.isArray(manifest?.files) ? manifest.files : [];
  const bytes = files.reduce((sum, entry) => sum + (Number(entry.bytes) || 0), 0);
  record("manifest", manifestFailures, `manifest names the ${FAMILIES.length} families and ${files.length} files`);

  const digestFailures = [];
  checkDigests(root, files, digestFailures);
  record("digests", digestFailures, `${files.length} vendored files match their manifest sha256 and byte counts (${bytes} bytes)`);

  const binaryFailures = [];
  const copies = checkBinaries(root, files, binaryFailures);
  record("binaries", binaryFailures, `font binaries only in ${FONTS_DIR}${copies ? `, plus ${copies} byte-identical copies in build output` : ""}`);

  const stylesheetFailures = [];
  checkStylesheet(root, files, stylesheetFailures);
  record("stylesheet", stylesheetFailures, `${CSS_NAME} declares exactly the ${files.length} manifest files (swap, relative URLs, no data: URI)`);

  const licenceFailures = [];
  checkLicences(root, manifest, licenceFailures);
  record("licences", licenceFailures, `each of the ${manifest?.families?.length ?? 0} families ships its SIL OFL 1.1 text with the recorded digest`);

  const packageFailures = [];
  checkPackage(root, packageFailures);
  record("package", packageFailures, "@tcrn/ui-tokens ships fonts/, licenses/ and FONT-LICENSES.md and exports ./fonts.css and ./fonts/*");

  const coverageFailures = [];
  const coverageNotes = [];
  const product = checkCoverage(root, files, coverageFailures, coverageNotes);
  record("coverage", coverageFailures, `the shipped Chinese slices cover all ${product.codepoints.length} product code points from ${product.files.length} source files, including ${PRODUCT_SAMPLE}; the Latin families ship latin and latin-ext`, coverageNotes);

  const outputFailures = [];
  const outputNotes = [];
  const output = checkBuildOutput(root, outputFailures, outputNotes);
  record("build-output", outputFailures, `no googleapis or gstatic reference and no data: font in ${output.scanned} files under ${output.roots.join(", ") || "(nothing)"}`, outputNotes);

  const proprietaryFailures = [];
  const distributable = await checkProprietary(root, tokens, manifest, proprietaryFailures);
  record("proprietary", proprietaryFailures, `all ${distributable} distributable stacks name only open-licensed families`);

  const familyFailures = [];
  const families = await checkTokenFamilies(root, tokens, familyFailures);
  record("token-families", familyFailures, `the ${families.stacks} G+ family tokens open with their vendored faces and keep the Noto fallbacks; all ${families.faces} faces they name have an @font-face in ${CSS_NAME}`);

  return { ok: checks.every((check) => check.ok), checks };
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
  const rootFlag = process.argv.indexOf("--root");
  const root = rootFlag > 0 && process.argv[rootFlag + 1] ? path.resolve(process.argv[rootFlag + 1]) : scriptRoot;
  const report = await runFontsProof({ root });
  for (const check of report.checks) {
    if (check.ok) console.log(`pass  ${check.id}: ${check.pass}`);
    else {
      console.error(`FAIL: ${check.id}`);
      for (const failure of check.failures) console.error(`  - ${failure}`);
    }
    for (const note of check.notes) console.log(`note  ${check.id}: ${note}`);
  }
  if (!report.ok) console.error("See packages/ui-tokens/FONT-LICENSES.md; regenerate vendored fonts with node scripts/fonts-vendor.mjs.");
  process.exit(report.ok ? 0 : 1);
}
