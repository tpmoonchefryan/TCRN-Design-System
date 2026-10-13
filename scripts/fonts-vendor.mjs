// Font vendoring for @tcrn/ui-tokens.
//
// The token stacks name five SIL OFL-1.1 families. Product pages must not depend on
// the Google Fonts CDN (fonts.googleapis.com is unreliable in mainland China), so the
// package ships the font files itself. This script copies them from the exactly pinned
// root devDependencies into packages/ui-tokens/fonts and writes manifest.json and
// fonts.css from what it copied:
//
//   Hanken Grotesk  @fontsource-variable/hanken-grotesk  wght         latin + latin-ext
//   Source Serif 4  @fontsource-variable/source-serif-4  opsz + wght  latin + latin-ext
//   IBM Plex Mono   @fontsource/ibm-plex-mono            400, 500     latin + latin-ext
//   Noto Sans SC    @fontsource-variable/noto-sans-sc    wght         slices covering product text
//   Noto Serif SC   @fontsource-variable/noto-serif-sc   wght         slices covering product text
//
// Nothing is subset or modified here. Every vendored file is a byte-identical copy of an
// upstream file. The Chinese families arrive pre-sliced upstream (the Google Fonts
// unicode-range slices), and this script only decides which slices to keep: every slice
// that contains at least one code point of the product text. Product text is the string
// content of the package sources, the Storybook sources (including the locale
// dictionaries), the design contract JSON when present, and the fixed sample 季度复盘.
// Strings under a locale key other than zh-CN are skipped, and so are untagged strings
// that contain kana or hangul: the Chinese faces back zh-CN text, so they are sized for
// Chinese copy rather than for the Japanese or Korean strings.
//
//   node scripts/fonts-vendor.mjs          regenerate packages/ui-tokens/fonts and licenses
//   node scripts/fonts-vendor.mjs --check  prove the committed files equal a fresh run
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const scriptRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const FONTS_DIR = "packages/ui-tokens/fonts";
export const LICENSES_DIR = "packages/ui-tokens/licenses";
export const MANIFEST_NAME = "manifest.json";
export const CSS_NAME = "fonts.css";
export const UPSTREAM_VERSION = "5.3.0";
export const UPSTREAM_LICENSE = "OFL-1.1";
export const REGISTRY = "https://registry.npmjs.org/";
export const MANIFEST_SCHEMA = "tcrn.ui-tokens.fonts.v1";
export const FONT_EXTENSIONS = new Set([".ttf", ".otf", ".woff", ".woff2", ".eot", ".ttc", ".otc"]);
export const PRODUCT_SAMPLE = "季度复盘";
// Mirrors tcrnSupportedLocales in @tcrn/ui-copy-state.
export const LOCALE_KEYS = new Set(["zh-CN", "en", "ja", "ko", "fr"]);
export const CJK_LOCALE = "zh-CN";
export const LATIN_SUBSETS = ["latin", "latin-ext"];

export const FAMILIES = [
  { id: "hanken-grotesk", family: "Hanken Grotesk", role: "ui", package: "@fontsource-variable/hanken-grotesk", variant: "wght", axes: ["wght"], selection: "latin" },
  { id: "source-serif-4", family: "Source Serif 4", role: "heading", package: "@fontsource-variable/source-serif-4", variant: "opsz", axes: ["opsz", "wght"], selection: "latin" },
  { id: "ibm-plex-mono", family: "IBM Plex Mono", role: "mono", package: "@fontsource/ibm-plex-mono", weights: [400, 500], axes: [], selection: "latin" },
  { id: "noto-sans-sc", family: "Noto Sans SC", role: "ui-zh-fallback", package: "@fontsource-variable/noto-sans-sc", variant: "wght", axes: ["wght"], selection: "cjk" },
  { id: "noto-serif-sc", family: "Noto Serif SC", role: "heading-zh-fallback", package: "@fontsource-variable/noto-serif-sc", variant: "wght", axes: ["wght"], selection: "cjk" }
];

// Code points the Chinese faces are responsible for: CJK punctuation, the ideograph
// blocks, CJK compatibility and vertical forms, and the fullwidth forms used in Chinese
// copy (halfwidth katakana and hangul excluded). Latin, general punctuation and the
// rest resolve through the Latin families earlier in each stack.
export const CJK_RANGES = [
  [0x3000, 0x303f], [0x3400, 0x4dbf], [0x4e00, 0x9fff], [0xf900, 0xfaff],
  [0xfe10, 0xfe1f], [0xfe30, 0xfe4f], [0xff00, 0xff65], [0xffe0, 0xffee], [0x20000, 0x2fa1f]
];
const KANA_OR_HANGUL = /[ᄀ-ᇿ぀-ヿ㄰-㆏ㇰ-ㇿ가-힯ｦ-ￜ]/u;
const MAYBE_CJK = /[　-￯]|[\ud800-\udbff]/;
const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".mts", ".cts", ".js", ".jsx", ".mjs", ".cjs", ".json"]);
const SKIP_SOURCE_DIRS = new Set(["node_modules", "dist", "test", "tests", "__tests__", "storybook-static", "storybook-preview-static"]);
const CONTRACT_DIR = "docs/design/gplus-2026-10/contract";

export function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

export function parseUnicodeRange(value) {
  return String(value).split(",").map((part) => part.trim()).filter(Boolean).map((part) => {
    const [start, end] = part.replace(/^U\+/i, "").split("-");
    const a = Number.parseInt(start, 16);
    const b = end === undefined ? a : Number.parseInt(end, 16);
    if (!Number.isInteger(a) || !Number.isInteger(b) || b < a) throw new Error(`bad unicode-range part: ${part}`);
    return [a, b];
  });
}

export function inRanges(codepoint, ranges) {
  return ranges.some(([a, b]) => codepoint >= a && codepoint <= b);
}

export function formatCodepoint(codepoint) {
  return `U+${codepoint.toString(16).toUpperCase().padStart(4, "0")} ${String.fromCodePoint(codepoint)}`;
}

function toPosix(rel) {
  return rel.split(path.sep).join("/");
}

function walkFiles(dir, accept, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_SOURCE_DIRS.has(entry.name)) walkFiles(full, accept, out);
    } else if (entry.isFile() && accept(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function isProductSourceName(name) {
  if (!SOURCE_EXTENSIONS.has(path.extname(name).toLowerCase())) return false;
  return !/\.(test|spec)\.[cm]?[jt]sx?$/i.test(name);
}

// Package sources, the Storybook sources and the design contract JSON, as sorted
// root-relative paths. Tests are excluded: they are not rendered product text.
export function listProductSources(root = scriptRoot) {
  const files = [];
  const packagesDir = path.join(root, "packages");
  if (fs.existsSync(packagesDir)) {
    for (const entry of fs.readdirSync(packagesDir, { withFileTypes: true })) {
      if (entry.isDirectory()) walkFiles(path.join(packagesDir, entry.name, "src"), isProductSourceName, files);
    }
  }
  walkFiles(path.join(root, "apps/storybook/src"), isProductSourceName, files);
  walkFiles(path.join(root, CONTRACT_DIR), (name) => name.toLowerCase().endsWith(".json"), files);
  return files.map((file) => toPosix(path.relative(root, file))).sort();
}

function propertyKey(name) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNoSubstitutionTemplateLiteral(name) || ts.isNumericLiteral(name)) return name.text;
  if (ts.isComputedPropertyName(name) && ts.isStringLiteralLike(name.expression)) return name.expression.text;
  return null;
}

function isTextNode(node) {
  return ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateHead(node)
    || ts.isTemplateMiddle(node) || ts.isTemplateTail(node) || ts.isJsxText(node);
}

function wantsText(locale, text) {
  return locale === null ? !KANA_OR_HANGUL.test(text) : locale === CJK_LOCALE;
}

function scriptKindFor(rel) {
  const ext = path.extname(rel).toLowerCase();
  if (ext === ".tsx") return ts.ScriptKind.TSX;
  if (ext === ".jsx") return ts.ScriptKind.JSX;
  if (ext === ".ts" || ext === ".mts" || ext === ".cts") return ts.ScriptKind.TS;
  return ts.ScriptKind.JS;
}

function collectFromScript(rel, text, add) {
  const sourceFile = ts.createSourceFile(rel, text, ts.ScriptTarget.Latest, true, scriptKindFor(rel));
  const visit = (node, locale) => {
    let here = locale;
    if (ts.isPropertyAssignment(node)) {
      const key = propertyKey(node.name);
      if (key !== null && LOCALE_KEYS.has(key)) here = key;
    }
    if (isTextNode(node) && wantsText(here, node.text)) add(node.text);
    ts.forEachChild(node, (child) => visit(child, here));
  };
  visit(sourceFile, null);
}

function collectFromJson(value, locale, add) {
  if (typeof value === "string") {
    if (wantsText(locale, value)) add(value);
  } else if (Array.isArray(value)) {
    for (const item of value) collectFromJson(item, locale, add);
  } else if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      const next = LOCALE_KEYS.has(key) ? key : locale;
      if (wantsText(locale, key)) add(key);
      collectFromJson(item, next, add);
    }
  }
}

// The code points the Chinese faces must cover, sorted ascending.
export function collectProductCodepoints(root = scriptRoot) {
  const files = listProductSources(root);
  const set = new Set();
  const add = (text) => {
    for (const char of text) {
      const codepoint = char.codePointAt(0);
      if (inRanges(codepoint, CJK_RANGES)) set.add(codepoint);
    }
  };
  for (const rel of files) {
    const text = fs.readFileSync(path.join(root, rel), "utf8");
    if (!MAYBE_CJK.test(text)) continue;
    if (rel.toLowerCase().endsWith(".json")) collectFromJson(JSON.parse(text), null, add);
    else collectFromScript(rel, text, add);
  }
  add(PRODUCT_SAMPLE);
  return { files, codepoints: [...set].sort((a, b) => a - b) };
}

export function upstreamDir(root, packageName) {
  return path.join(root, "node_modules", ...packageName.split("/"));
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function lockfileIntegrity(lockText, name, version) {
  const key = `${name}@${version}`.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
  const match = lockText.match(new RegExp(`\\n  '?${key}'?:\\n    resolution: \\{integrity: ([^},\\s]+)\\}`));
  return match ? match[1] : null;
}

function fileNameFor(family, subset, weight) {
  const token = subset.replace(/^\[(\d+)\]$/, "$1");
  return family.weights ? `${family.id}-${token}-${weight}-normal.woff2` : `${family.id}-${token}-${family.variant}-normal.woff2`;
}

function licenseNameFor(family) {
  return `${family.id}-OFL.txt`;
}

function countRanges(rangesList) {
  const set = new Set();
  for (const ranges of rangesList) for (const [a, b] of ranges) for (let cp = a; cp <= b; cp += 1) set.add(cp);
  return set.size;
}

// Everything a fresh run would write, computed in memory. Throws only on unreadable
// input; policy violations are returned in `problems`.
export function planVendor(root = scriptRoot) {
  const problems = [];
  const rootPackage = readJson(path.join(root, "package.json"));
  const lockText = fs.readFileSync(path.join(root, "pnpm-lock.yaml"), "utf8");
  const product = collectProductCodepoints(root);
  const families = [];
  const files = [];
  const copies = [];
  const licenses = [];
  const unavailable = {};

  for (const family of FAMILIES) {
    const dir = upstreamDir(root, family.package);
    const packagePath = path.join(dir, "package.json");
    if (!fs.existsSync(packagePath)) {
      problems.push(`${family.package} is not installed; run pnpm install`);
      continue;
    }
    const upstream = readJson(packagePath);
    const pinned = rootPackage.devDependencies?.[family.package];
    if (pinned !== UPSTREAM_VERSION) problems.push(`${family.package}: root devDependencies pins ${pinned ?? "nothing"}, expected exactly ${UPSTREAM_VERSION}`);
    if (upstream.version !== UPSTREAM_VERSION) problems.push(`${family.package}: installed ${upstream.version}, expected ${UPSTREAM_VERSION}`);
    if (upstream.license !== UPSTREAM_LICENSE) problems.push(`${family.package}: licence ${upstream.license}, expected ${UPSTREAM_LICENSE}`);
    const integrity = lockfileIntegrity(lockText, family.package, UPSTREAM_VERSION);
    if (!integrity) problems.push(`${family.package}@${UPSTREAM_VERSION}: no integrity in pnpm-lock.yaml`);
    const metadata = readJson(path.join(dir, "metadata.json"));
    const unicode = readJson(path.join(dir, "unicode.json"));

    const axes = {};
    for (const axis of family.axes) {
      const spec = metadata.variable?.[axis];
      if (!spec) problems.push(`${family.package}: upstream metadata has no ${axis} axis`);
      else axes[axis] = `${spec.min} ${spec.max}`;
    }
    const weights = family.weights ? family.weights.map(String) : [axes.wght];

    let subsets;
    if (family.selection === "latin") {
      subsets = Object.keys(unicode).filter((key) => LATIN_SUBSETS.includes(key));
      for (const wanted of LATIN_SUBSETS) if (!subsets.includes(wanted)) problems.push(`${family.package}: upstream has no ${wanted} subset`);
    } else {
      const slices = Object.keys(unicode).filter((key) => /^\[\d+\]$/.test(key));
      const sliceRanges = new Map(slices.map((key) => [key, parseUnicodeRange(unicode[key])]));
      subsets = slices.filter((key) => product.codepoints.some((cp) => inRanges(cp, sliceRanges.get(key))));
      unavailable[family.family] = product.codepoints.filter((cp) => !slices.some((key) => inRanges(cp, sliceRanges.get(key))));
    }

    let familyBytes = 0;
    const familyRanges = [];
    for (const subset of subsets) {
      const unicodeRange = unicode[subset];
      familyRanges.push(parseUnicodeRange(unicodeRange));
      for (const weight of weights) {
        const file = fileNameFor(family, subset, weight);
        const from = path.join(dir, "files", file);
        if (!fs.existsSync(from)) {
          problems.push(`${family.package}: upstream file files/${file} is missing`);
          continue;
        }
        const body = fs.readFileSync(from);
        familyBytes += body.length;
        copies.push({ from, to: path.join(root, FONTS_DIR, file), sha256: sha256(body), bytes: body.length });
        files.push({
          file,
          family: family.family,
          style: "normal",
          weight,
          axes: { ...axes },
          subset,
          unicodeRange,
          bytes: body.length,
          sha256: sha256(body),
          upstream: { package: family.package, version: upstream.version, integrity, path: `files/${file}` }
        });
      }
    }

    const licenseFrom = path.join(dir, "LICENSE");
    const licenseBody = fs.readFileSync(licenseFrom);
    const licenseName = licenseNameFor(family);
    licenses.push({ from: licenseFrom, to: path.join(root, LICENSES_DIR, licenseName), sha256: sha256(licenseBody), bytes: licenseBody.length });
    const entry = {
      family: family.family,
      role: family.role,
      package: family.package,
      version: upstream.version,
      integrity,
      license: { spdx: upstream.license, file: `licenses/${licenseName}`, sha256: sha256(licenseBody), bytes: licenseBody.length },
      axes,
      weights,
      style: "normal",
      subsets,
      files: subsets.length * weights.length,
      bytes: familyBytes
    };
    if (family.selection === "cjk") {
      entry.slices = subsets.length;
      entry.coveredCodepoints = countRanges(familyRanges);
    }
    families.push(entry);
  }

  const manifest = {
    schemaVersion: MANIFEST_SCHEMA,
    generatedBy: "scripts/fonts-vendor.mjs",
    notice: "Generated file; do not edit by hand. Each font file is a byte-identical copy of the upstream npm package file named in its entry.",
    css: CSS_NAME,
    registry: REGISTRY,
    selection: {
      latin: "latin and latin-ext subsets, complete",
      cjk: `upstream unicode-range slices containing at least one code point of the zh-CN and untagged product strings or the sample ${PRODUCT_SAMPLE}`
    },
    totals: {
      families: families.length,
      files: files.length,
      bytes: files.reduce((sum, file) => sum + file.bytes, 0)
    },
    families,
    files
  };
  return { manifest, css: renderFontsCss(manifest), copies, licenses, problems, product, unavailable };
}

export function renderFontsCss(manifest) {
  const lines = [
    `/* Generated by scripts/fonts-vendor.mjs from ${MANIFEST_NAME}; do not edit by hand. */`,
    "/* SIL OFL-1.1 faces, byte-identical to their pinned upstream npm files; licence texts ship in ../licenses/. */",
    ""
  ];
  for (const file of manifest.files) {
    lines.push(`/* ${file.family} ${file.subset} ${file.weight} (${file.upstream.package}@${file.upstream.version}) */`);
    lines.push("@font-face {");
    lines.push(`  font-family: "${file.family}";`);
    lines.push(`  font-style: ${file.style};`);
    lines.push(`  font-weight: ${file.weight};`);
    lines.push("  font-display: swap;");
    lines.push(`  src: url("./${file.file}") format("woff2");`);
    lines.push(`  unicode-range: ${file.unicodeRange};`);
    lines.push("}");
    lines.push("");
  }
  return lines.join("\n");
}

export function manifestText(manifest) {
  return `${JSON.stringify(manifest, null, 2)}\n`;
}

function summary(plan) {
  const out = [];
  const { totals } = plan.manifest;
  out.push(`fonts-vendor: ${totals.families} families, ${totals.files} files, ${totals.bytes} bytes`);
  for (const family of plan.manifest.families) {
    const detail = family.slices === undefined
      ? family.subsets.join(", ")
      : `${family.slices} slices covering ${family.coveredCodepoints} code points`;
    out.push(`  ${family.family.padEnd(15)} ${String(family.files).padStart(3)} files ${String(family.bytes).padStart(9)} bytes  ${detail}`);
  }
  out.push(`product text: ${plan.product.codepoints.length} CJK code points from ${plan.product.files.length} source files (zh-CN and untagged strings, plus ${PRODUCT_SAMPLE})`);
  for (const [family, codepoints] of Object.entries(plan.unavailable)) {
    if (codepoints.length) out.push(`  note: ${family} upstream has no slice for ${codepoints.length} code point(s): ${codepoints.map(formatCodepoint).join(", ")}`);
  }
  return out.join("\n");
}

function listDir(dir, accept) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).filter((entry) => entry.isFile() && accept(entry.name)).map((entry) => entry.name).sort();
}

export function checkVendor(root = scriptRoot) {
  const plan = planVendor(root);
  const drift = [...plan.problems];
  const fontsDir = path.join(root, FONTS_DIR);
  const licensesDir = path.join(root, LICENSES_DIR);
  const manifestPath = path.join(fontsDir, MANIFEST_NAME);
  const cssPath = path.join(fontsDir, CSS_NAME);

  const committedManifest = fs.existsSync(manifestPath) ? fs.readFileSync(manifestPath, "utf8") : null;
  if (committedManifest === null) drift.push(`${FONTS_DIR}/${MANIFEST_NAME} is missing`);
  else if (committedManifest !== manifestText(plan.manifest)) {
    drift.push(`${FONTS_DIR}/${MANIFEST_NAME} differs from a fresh run`);
    try {
      const before = new Set(JSON.parse(committedManifest).files?.map((file) => file.file) ?? []);
      const after = new Set(plan.manifest.files.map((file) => file.file));
      const added = [...after].filter((file) => !before.has(file));
      const removed = [...before].filter((file) => !after.has(file));
      if (added.length) drift.push(`  selection would add: ${added.join(", ")}`);
      if (removed.length) drift.push(`  selection would drop: ${removed.join(", ")}`);
    } catch {
      drift.push("  committed manifest is not valid JSON");
    }
  }
  const committedCss = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, "utf8") : null;
  if (committedCss === null) drift.push(`${FONTS_DIR}/${CSS_NAME} is missing`);
  else if (committedCss !== plan.css) drift.push(`${FONTS_DIR}/${CSS_NAME} differs from a fresh run`);

  for (const copy of plan.copies) {
    const rel = toPosix(path.relative(root, copy.to));
    if (!fs.existsSync(copy.to)) drift.push(`${rel} is missing`);
    else if (sha256(fs.readFileSync(copy.to)) !== copy.sha256) drift.push(`${rel} is not byte-identical to ${toPosix(path.relative(root, copy.from))}`);
  }
  const expectedFonts = new Set(plan.copies.map((copy) => path.basename(copy.to)));
  for (const name of listDir(fontsDir, (n) => FONT_EXTENSIONS.has(path.extname(n).toLowerCase()))) {
    if (!expectedFonts.has(name)) drift.push(`${FONTS_DIR}/${name} is not part of the selection`);
  }
  for (const name of listDir(fontsDir, (n) => !FONT_EXTENSIONS.has(path.extname(n).toLowerCase()))) {
    if (name !== MANIFEST_NAME && name !== CSS_NAME) drift.push(`${FONTS_DIR}/${name} is not a generated file`);
  }

  for (const license of plan.licenses) {
    const rel = toPosix(path.relative(root, license.to));
    if (!fs.existsSync(license.to)) drift.push(`${rel} is missing`);
    else if (sha256(fs.readFileSync(license.to)) !== license.sha256) drift.push(`${rel} is not byte-identical to ${toPosix(path.relative(root, license.from))}`);
  }
  const expectedLicenses = new Set(plan.licenses.map((license) => path.basename(license.to)));
  for (const name of listDir(licensesDir, () => true)) {
    if (!expectedLicenses.has(name)) drift.push(`${LICENSES_DIR}/${name} is not an upstream licence copy`);
  }
  return { ok: drift.length === 0, drift, plan };
}

export function writeVendor(root = scriptRoot) {
  const plan = planVendor(root);
  if (plan.problems.length) return { ok: false, problems: plan.problems, plan };
  const fontsDir = path.join(root, FONTS_DIR);
  const licensesDir = path.join(root, LICENSES_DIR);
  fs.mkdirSync(fontsDir, { recursive: true });
  fs.mkdirSync(licensesDir, { recursive: true });
  const expectedFonts = new Set(plan.copies.map((copy) => path.basename(copy.to)));
  // Stale slices from an earlier selection are generator output; drop them.
  for (const name of listDir(fontsDir, (n) => FONT_EXTENSIONS.has(path.extname(n).toLowerCase()))) {
    if (!expectedFonts.has(name)) fs.unlinkSync(path.join(fontsDir, name));
  }
  for (const copy of [...plan.copies, ...plan.licenses]) {
    if (!fs.existsSync(copy.to) || sha256(fs.readFileSync(copy.to)) !== copy.sha256) fs.copyFileSync(copy.from, copy.to);
  }
  fs.writeFileSync(path.join(fontsDir, MANIFEST_NAME), manifestText(plan.manifest));
  fs.writeFileSync(path.join(fontsDir, CSS_NAME), plan.css);
  return { ok: true, problems: [], plan };
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
  const check = process.argv.includes("--check");
  if (check) {
    const result = checkVendor(scriptRoot);
    console.log(summary(result.plan));
    if (!result.ok) {
      console.error("FAIL: vendored fonts drift from a fresh run of scripts/fonts-vendor.mjs:");
      for (const line of result.drift) console.error(`  - ${line}`);
      console.error("Run `node scripts/fonts-vendor.mjs` and commit the result.");
      process.exit(1);
    }
    console.log("pass  vendored fonts, manifest, fonts.css and licences equal a fresh run");
  } else {
    const result = writeVendor(scriptRoot);
    console.log(summary(result.plan));
    if (!result.ok) {
      console.error("FAIL: nothing written:");
      for (const line of result.problems) console.error(`  - ${line}`);
      process.exit(1);
    }
    console.log(`wrote ${FONTS_DIR} and ${LICENSES_DIR}`);
  }
}
