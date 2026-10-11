// SPDX-License-Identifier: Apache-2.0
// Font render proof (TCRN-DS-SUB-007; STORY-121 GWT1 and GWT5).
//
// fonts-proof checks the vendored faces and fonts.css as bytes. This proof checks what the
// static docs build (apps/storybook/storybook-static, written by `pnpm build`) does with
// them in Chromium. It fails on any of:
//
//   copies       a face the package manifest lists is missing from storybook-static/fonts,
//                the copy differs from the vendored file by a byte, or that directory holds
//                a file the manifest does not list; likewise for each family's OFL text
//                under storybook-static/licenses
//   stylesheet   tcrn-fonts.css is missing, a face src is not url("fonts/<listed face>"), a
//                listed face is undeclared, a descriptor other than src differs from
//                @tcrn/ui-tokens/fonts.css, or it carries a data: URI or a remote URL
//   pages        a built page does not link tcrn-fonts.css exactly once, inside its head
//   cdn-strings  a text file under storybook-static names googleapis or gstatic
//   network      a built page, once loaded, requests googleapis, gstatic, a data: font or
//                any origin other than the local server, or a face it downloads is not
//                byte-identical to the vendored file
//   families     one of the five families has no face that loads for its sample text, a
//                loaded face reports another family, document.fonts.check() is false, or
//                the sample is drawn with anything but that family's web font
//   fallback     a heading set in --tcrn-type-family-heading with 季度复盘 is not drawn
//                entirely with the Noto Serif SC web font, a sample code point has no loaded
//                Noto Serif SC face covering it, or document.fonts.check() is false for the
//                sample with Noto Serif SC or with the resolved heading stack
//   control      with storybook-static/fonts blocked, the same heading probe still reports a
//                web font, which would mean the render check cannot tell vendored faces from
//                system ones
//
// "Drawn with" is Chromium's own record of the platform fonts used for a text node (CDP
// CSS.getPlatformFontsForNode). A system serif standing in for Noto Serif SC is red even
// where document.fonts.check() alone would say true.
//
//   node scripts/fonts-render-proof.mjs [--root <dir>]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseFontFaces } from "./fonts-proof.mjs";
import { CSS_NAME, FAMILIES, FONTS_DIR, MANIFEST_NAME, PRODUCT_SAMPLE, sha256 } from "./fonts-vendor.mjs";
import { settlePage, startStaticServer } from "./lib/gplus-measure.mjs";
import { STATIC_DOCS_ROOT } from "./lib/storybook-routes.mjs";

const scriptRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Mirrors STATIC_FONT_DIR, STATIC_FONT_LICENSE_DIR and STATIC_FONT_STYLESHEET in
// apps/storybook/src/build/write-static.ts.
export const STATIC_FONT_DIR = "fonts";
export const STATIC_FONT_LICENSE_DIR = "licenses";
export const STATIC_FONT_STYLESHEET = "tcrn-fonts.css";
export const LATIN_SAMPLE = "Quarterly review 2026";
const PROBE_PAGE = "index.html";
const CDN_PATTERN = /googleapis|gstatic/i;
const DATA_FONT_PATTERN = /^data:(?:font\/|application\/(?:x-)?font)/i;
const TEXT_EXTENSIONS = new Set([".css", ".html", ".js", ".json", ".map", ".md", ".svg", ".txt", ".xml"]);
const DOCS_SRC = /^url\("fonts\/([A-Za-z0-9._-]+\.woff2)"\)\s+format\(["']woff2["']\)$/;
const PACKAGE_SRC = /^url\((["']?)\.\/([A-Za-z0-9._-]+\.woff2)\1\)\s+format\(["']woff2["']\)$/;
const FONT_LINK = /<link\b[^>]*\brel="stylesheet"[^>]*\bhref="tcrn-fonts\.css"[^>]*>/g;

function walk(dir, visit, rel = "") {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const childRel = rel ? `${rel}/${entry.name}` : entry.name;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, visit, childRel);
    else if (entry.isFile()) visit(childRel, full);
  }
}

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

function readManifest(root) {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, FONTS_DIR, MANIFEST_NAME), "utf8"));
  if (!Array.isArray(manifest.files) || manifest.files.length === 0) throw new Error(`${FONTS_DIR}/${MANIFEST_NAME} lists no files`);
  return manifest;
}

function checkCopies(root, docsRoot, manifest, failures) {
  const copyDir = path.join(docsRoot, STATIC_FONT_DIR);
  if (!fs.existsSync(copyDir)) {
    failures.push(`${STATIC_DOCS_ROOT}/${STATIC_FONT_DIR} is missing`);
    return { faces: 0, bytes: 0 };
  }
  const listed = new Set(manifest.files.map((entry) => entry.file));
  for (const name of fs.readdirSync(copyDir)) {
    if (!listed.has(name)) failures.push(`${STATIC_DOCS_ROOT}/${STATIC_FONT_DIR}/${name} is not a face the manifest lists`);
  }
  let faces = 0;
  let bytes = 0;
  for (const entry of manifest.files) {
    const rel = `${STATIC_DOCS_ROOT}/${STATIC_FONT_DIR}/${entry.file}`;
    const copyPath = path.join(copyDir, entry.file);
    if (!fs.existsSync(copyPath)) {
      failures.push(`${rel} is missing`);
      continue;
    }
    const copy = fs.readFileSync(copyPath);
    const vendored = fs.readFileSync(path.join(root, FONTS_DIR, entry.file));
    if (!copy.equals(vendored)) failures.push(`${rel} is not byte-identical to ${FONTS_DIR}/${entry.file}`);
    else if (copy.length !== entry.bytes || sha256(copy) !== entry.sha256) failures.push(`${rel} matches the vendored file, but both differ from the manifest digest`);
    else {
      faces += 1;
      bytes += copy.length;
    }
  }
  // The OFL text of every family travels with its faces (manifest licence paths are
  // relative to the package root).
  const licenseDir = path.join(docsRoot, STATIC_FONT_LICENSE_DIR);
  const licenses = (manifest.families ?? []).map((family) => family.license?.file).filter(Boolean);
  if (licenses.length !== (manifest.families ?? []).length || licenses.length === 0) failures.push(`${FONTS_DIR}/${MANIFEST_NAME} does not name a licence file for every family`);
  const licenseNames = new Set(licenses.map((file) => path.posix.basename(file)));
  if (fs.existsSync(licenseDir)) {
    for (const name of fs.readdirSync(licenseDir)) {
      if (!licenseNames.has(name)) failures.push(`${STATIC_DOCS_ROOT}/${STATIC_FONT_LICENSE_DIR}/${name} is not a licence the manifest names`);
    }
  }
  let licenseCopies = 0;
  for (const file of licenses) {
    const rel = `${STATIC_DOCS_ROOT}/${STATIC_FONT_LICENSE_DIR}/${path.posix.basename(file)}`;
    const copyPath = path.join(licenseDir, path.posix.basename(file));
    if (!fs.existsSync(copyPath)) failures.push(`${rel} is missing`);
    else if (!fs.readFileSync(copyPath).equals(fs.readFileSync(path.join(root, path.posix.dirname(FONTS_DIR), file)))) failures.push(`${rel} differs from the packaged licence text`);
    else licenseCopies += 1;
  }
  return { faces, bytes, licenses: licenseCopies };
}

function checkStylesheet(root, docsRoot, manifest, failures) {
  const docsPath = path.join(docsRoot, STATIC_FONT_STYLESHEET);
  if (!fs.existsSync(docsPath)) {
    failures.push(`${STATIC_DOCS_ROOT}/${STATIC_FONT_STYLESHEET} is missing`);
    return 0;
  }
  const docsCss = fs.readFileSync(docsPath, "utf8");
  const code = stripComments(docsCss);
  if (/data:/i.test(code)) failures.push(`${STATIC_FONT_STYLESHEET} inlines a data: URI`);
  if (/[a-z][a-z0-9+.-]*:\/\/|url\(\s*["']?\/\//i.test(code)) failures.push(`${STATIC_FONT_STYLESHEET} references a remote URL`);
  if (CDN_PATTERN.test(docsCss)) failures.push(`${STATIC_FONT_STYLESHEET} names googleapis or gstatic`);

  const packageFaces = new Map();
  for (const face of parseFontFaces(fs.readFileSync(path.join(root, FONTS_DIR, CSS_NAME), "utf8"))) {
    const match = (face.src ?? "").match(PACKAGE_SRC);
    if (match) packageFaces.set(match[2], face);
  }
  const listed = new Set(manifest.files.map((entry) => entry.file));
  const declared = new Set();
  for (const face of parseFontFaces(docsCss)) {
    const match = (face.src ?? "").match(DOCS_SRC);
    if (!match) {
      failures.push(`an @font-face src in ${STATIC_FONT_STYLESHEET} is not url("${STATIC_FONT_DIR}/<face>.woff2"): ${(face.src ?? "").slice(0, 80)}`);
      continue;
    }
    const file = match[1];
    if (declared.has(file)) failures.push(`${file} is declared more than once in ${STATIC_FONT_STYLESHEET}`);
    declared.add(file);
    if (!listed.has(file)) {
      failures.push(`${STATIC_FONT_STYLESHEET} declares ${file}, which the manifest does not list`);
      continue;
    }
    const packageFace = packageFaces.get(file);
    if (!packageFace) {
      failures.push(`${STATIC_FONT_STYLESHEET} declares ${file}, which ${CSS_NAME} does not`);
      continue;
    }
    for (const key of new Set([...Object.keys(face), ...Object.keys(packageFace)])) {
      if (key === "src") continue;
      if ((face[key] ?? "").replace(/\s+/g, "") !== (packageFace[key] ?? "").replace(/\s+/g, "")) failures.push(`${file}: ${key} in ${STATIC_FONT_STYLESHEET} differs from ${CSS_NAME}`);
    }
  }
  for (const file of listed) if (!declared.has(file)) failures.push(`${STATIC_FONT_STYLESHEET} does not declare ${file}`);
  return declared.size;
}

function listPages(docsRoot) {
  return fs.readdirSync(docsRoot).filter((name) => name.endsWith(".html")).sort();
}

function checkPages(docsRoot, pages, failures) {
  if (pages.length === 0) failures.push(`${STATIC_DOCS_ROOT} holds no pages`);
  for (const file of pages) {
    const html = fs.readFileSync(path.join(docsRoot, file), "utf8");
    const headEnd = html.indexOf("</head>");
    const inHead = headEnd < 0 ? 0 : (html.slice(0, headEnd).match(FONT_LINK) ?? []).length;
    const total = (html.match(FONT_LINK) ?? []).length;
    if (inHead !== 1 || total !== 1) failures.push(`${file} links ${STATIC_FONT_STYLESHEET} ${total} time(s), ${inHead} inside <head>; expected exactly once in <head>`);
  }
}

function checkCdnStrings(docsRoot, failures) {
  let scanned = 0;
  walk(docsRoot, (rel, full) => {
    if (!TEXT_EXTENSIONS.has(path.extname(rel).toLowerCase())) return;
    scanned += 1;
    const hits = (fs.readFileSync(full, "utf8").match(/googleapis|gstatic/gi) ?? []).length;
    if (hits > 0) failures.push(`${STATIC_DOCS_ROOT}/${rel} names googleapis or gstatic ${hits} time(s)`);
  });
  return scanned;
}

// One probe per family and weight: variable faces at 400 and 600, static faces at each shipped weight.
export function familyProbes(manifest) {
  const probes = [];
  for (const family of FAMILIES) {
    const weights = new Set();
    for (const entry of manifest.files.filter((item) => item.family === family.family)) {
      const [low, high = low] = String(entry.weight).trim().split(/\s+/).map(Number);
      if (high > low) for (const weight of [400, 600]) if (weight >= low && weight <= high) weights.add(weight);
      if (high === low) weights.add(low);
    }
    const cjk = family.selection === "cjk";
    for (const weight of [...weights].sort((a, b) => a - b)) {
      probes.push({ id: `${family.id}-${weight}`, family: family.family, weight, text: cjk ? PRODUCT_SAMPLE : LATIN_SAMPLE, lang: cjk ? "zh-CN" : "en", fontFamily: `"${family.family}"` });
    }
  }
  return probes;
}

export function headingProbes() {
  return [400, 600].map((weight) => ({ id: `heading-${weight}`, family: "Noto Serif SC", weight, text: PRODUCT_SAMPLE, lang: "zh-CN", fontFamily: "var(--tcrn-type-family-heading)", tag: "h2" }));
}

function normalizeFamily(value = "") {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

async function mountProbes(page, probes) {
  await page.evaluate((list) => {
    document.querySelector("[data-fonts-render-probe]")?.remove();
    const host = document.createElement("div");
    host.setAttribute("data-fonts-render-probe", "");
    host.style.cssText = "position:absolute;left:0;top:0;z-index:2147483647;";
    list.forEach((probe, index) => {
      const element = document.createElement(probe.tag ?? "div");
      element.id = `fonts-render-probe-${index}`;
      element.lang = probe.lang;
      element.style.cssText = `margin:0;font-family:${probe.fontFamily};font-weight:${probe.weight};font-style:normal;font-size:20px;line-height:28px;white-space:nowrap;`;
      element.textContent = probe.text;
      host.append(element);
    });
    document.body.append(host);
  }, probes);
}

// Loads each probe's faces through the FontFaceSet and reports what loaded, what covers each
// code point, and what document.fonts.check() says for the bare family and the resolved stack.
async function evaluateProbes(page, probes) {
  return page.evaluate(async (list) => {
    const unquote = (value) => String(value).trim().replace(/^(["'])(.*)\1$/, "$2");
    const ranges = (value) => String(value || "U+0-10FFFF").split(",").map((part) => {
      const token = part.trim().replace(/^u\+/i, "");
      if (token.includes("?")) return [parseInt(token.replace(/\?/g, "0"), 16), parseInt(token.replace(/\?/g, "F"), 16)];
      const [low, high = low] = token.split("-");
      return [parseInt(low, 16), parseInt(high, 16)];
    });
    const weightCovers = (value, weight) => {
      const [low, high = low] = String(value).trim().split(/\s+/).map((part) => (part === "normal" ? 400 : part === "bold" ? 700 : Number(part)));
      return weight >= low && weight <= high;
    };
    const results = [];
    for (const [index, probe] of list.entries()) {
      const element = document.getElementById(`fonts-render-probe-${index}`);
      const stack = getComputedStyle(element).fontFamily;
      const font = `${probe.weight} 20px ${stack}`;
      const familyFont = `${probe.weight} 20px "${probe.family}"`;
      let loaded = [];
      let loadError = null;
      try {
        loaded = await document.fonts.load(font, probe.text);
      } catch (error) {
        loadError = String(error && error.message ? error.message : error);
      }
      const faces = loaded.map((face) => ({ family: unquote(face.family), status: face.status, weight: face.weight }));
      const uncovered = [...probe.text].filter((char) => char.trim()).filter((char) => {
        const codePoint = char.codePointAt(0);
        return ![...document.fonts].some((face) => unquote(face.family) === probe.family && face.status === "loaded" && weightCovers(face.weight, probe.weight) && ranges(face.unicodeRange).some(([low, high]) => codePoint >= low && codePoint <= high));
      });
      results.push({ index, stack, faces, loadError, uncovered, checkStack: document.fonts.check(font, probe.text), checkFamily: document.fonts.check(familyFont, probe.text) });
    }
    await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
    return results;
  }, probes);
}

async function platformFonts(page, count) {
  const cdp = await page.context().newCDPSession(page);
  try {
    await cdp.send("DOM.enable");
    await cdp.send("CSS.enable");
    const { root } = await cdp.send("DOM.getDocument", { depth: 1 });
    const fonts = [];
    for (let index = 0; index < count; index += 1) {
      const { nodeId } = await cdp.send("DOM.querySelector", { nodeId: root.nodeId, selector: `#fonts-render-probe-${index}` });
      const result = nodeId ? await cdp.send("CSS.getPlatformFontsForNode", { nodeId }) : { fonts: [] };
      fonts.push(result.fonts ?? []);
    }
    return fonts;
  } finally {
    await cdp.detach().catch(() => {});
  }
}

function describeFonts(fonts) {
  return fonts.map((font) => `${font.familyName}${font.isCustomFont ? " (web font)" : " (system)"} x${font.glyphCount}`).join(", ") || "nothing";
}

function judgeProbe(probe, evaluation, fonts, failures) {
  const label = `${probe.id} (${probe.text})`;
  if (evaluation.loadError) failures.push(`${label}: document.fonts.load rejected: ${evaluation.loadError}`);
  if (evaluation.faces.length === 0) failures.push(`${label}: no ${probe.family} face loads for the sample`);
  for (const face of evaluation.faces) {
    if (face.status !== "loaded") failures.push(`${label}: a ${face.family} face is ${face.status}`);
    if (face.family !== probe.family) failures.push(`${label}: the sample loaded ${face.family}, expected ${probe.family}`);
  }
  if (evaluation.uncovered.length > 0) failures.push(`${label}: no loaded ${probe.family} face covers ${evaluation.uncovered.join("")}`);
  if (!evaluation.checkFamily) failures.push(`${label}: document.fonts.check is false for "${probe.family}"`);
  if (!evaluation.checkStack && normalizeFamily(evaluation.stack) !== normalizeFamily(probe.family)) failures.push(`${label}: document.fonts.check is false for ${evaluation.stack}`);
  const want = normalizeFamily(probe.family);
  const drawnWith = (font) => font.isCustomFont && (normalizeFamily(font.familyName).startsWith(want) || normalizeFamily(font.postScriptName).startsWith(want));
  if (fonts.length === 0 || fonts.some((font) => !drawnWith(font))) failures.push(`${label}: drawn with ${describeFonts(fonts)}, expected only the ${probe.family} web font`);
}

async function renderLegs({ docsRoot, manifest, legs }) {
  const { chromium } = await import("@playwright/test");
  const server = await startStaticServer(docsRoot);
  const browser = await chromium.launch();
  const digests = new Map(manifest.files.map((entry) => [entry.file, entry.sha256]));
  try {
    // families + fallback, with the faces the page downloads checked byte for byte.
    {
      const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
      const page = await context.newPage();
      const pending = [];
      page.on("response", (response) => {
        if (response.request().resourceType() !== "font") return;
        pending.push(response.body().then((body) => ({ url: response.url(), status: response.status(), digest: sha256(body) }), (error) => ({ url: response.url(), status: response.status(), error: String(error) })));
      });
      try {
        await page.goto(`${server.origin}/${PROBE_PAGE}`, { waitUntil: "load" });
        await settlePage(page);
        const families = familyProbes(manifest);
        const headings = headingProbes();
        const probes = [...families, ...headings];
        await mountProbes(page, probes);
        const evaluations = await evaluateProbes(page, probes);
        const fonts = await platformFonts(page, probes.length);
        probes.forEach((probe, index) => {
          const leg = index < families.length ? legs.families : legs.fallback;
          leg.probes.push({ id: probe.id, stack: evaluations[index].stack, drawnWith: describeFonts(fonts[index]), checkFamily: evaluations[index].checkFamily, checkStack: evaluations[index].checkStack });
          judgeProbe(probe, evaluations[index], fonts[index], leg.failures);
        });
        const headingStack = evaluations[families.length]?.stack ?? "";
        if (!/^"?Source Serif 4"?\s*,\s*"?Noto Serif SC"?/.test(headingStack)) legs.fallback.failures.push(`--tcrn-type-family-heading resolves to ${headingStack || "nothing"} on ${PROBE_PAGE}; expected Source Serif 4 then Noto Serif SC`);
        await page.waitForLoadState("networkidle");
        for (const download of await Promise.all(pending)) {
          const file = decodeURIComponent(new URL(download.url).pathname).replace(/^\/+/, "");
          legs.network.fontDownloads += 1;
          if (download.error || download.status !== 200) legs.network.failures.push(`${file}: font response ${download.status}${download.error ? ` (${download.error})` : ""}`);
          else if (!file.startsWith(`${STATIC_FONT_DIR}/`) || digests.get(file.slice(STATIC_FONT_DIR.length + 1)) !== download.digest) legs.network.failures.push(`${file}: downloaded face is not byte-identical to a vendored file`);
        }
      } finally {
        await context.close();
      }
    }

    // control: the same heading probe with the copied faces blocked must fall back to system fonts.
    {
      const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
      await context.route((url) => url.pathname.startsWith(`/${STATIC_FONT_DIR}/`), (route) => route.abort());
      const page = await context.newPage();
      try {
        await page.goto(`${server.origin}/${PROBE_PAGE}`, { waitUntil: "load" });
        await settlePage(page);
        const probes = headingProbes();
        await mountProbes(page, probes);
        await evaluateProbes(page, probes);
        const fonts = await platformFonts(page, probes.length);
        probes.forEach((probe, index) => {
          legs.control.probes.push({ id: probe.id, drawnWith: describeFonts(fonts[index]) });
          if (fonts[index].length === 0) legs.control.failures.push(`${probe.id}: Chromium reported no platform font with the faces blocked`);
          if (fonts[index].some((font) => font.isCustomFont)) legs.control.failures.push(`${probe.id}: still drawn with a web font (${describeFonts(fonts[index])}) while ${STATIC_FONT_DIR}/ is blocked`);
        });
      } finally {
        await context.close();
      }
    }

    // network: every built page, loaded as a visitor would, asks only the local server.
    {
      const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
      try {
        for (const file of listPages(docsRoot)) {
          const page = await context.newPage();
          const requests = [];
          page.on("request", (request) => requests.push(request.url()));
          try {
            await page.goto(`${server.origin}/${file}`, { waitUntil: "load", timeout: 60_000 });
            await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
          } finally {
            await page.close();
          }
          legs.network.pages += 1;
          legs.network.requests += requests.length;
          for (const url of requests) {
            if (CDN_PATTERN.test(url)) {
              legs.network.cdnRequests += 1;
              legs.network.failures.push(`${file} requested ${url}`);
            } else if (DATA_FONT_PATTERN.test(url)) legs.network.failures.push(`${file} loaded a font from a data: URI`);
            else if (!/^(?:data|blob|about):/i.test(url) && !url.startsWith(`${server.origin}/`)) legs.network.failures.push(`${file} requested a foreign origin: ${url}`);
          }
        }
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
    await server.close();
  }
}

export async function runFontsRenderProof({ root = scriptRoot } = {}) {
  const docsRoot = path.join(root, STATIC_DOCS_ROOT);
  const checks = [];
  const record = (id, failures, pass, extra = {}) => checks.push({ id, ok: failures.length === 0, failures, pass, ...extra });
  if (!fs.existsSync(path.join(docsRoot, PROBE_PAGE))) {
    record("build", [`${STATIC_DOCS_ROOT}/${PROBE_PAGE} is missing; run pnpm build first`], "");
    return { ok: false, checks, cdn: { strings: null, requests: null } };
  }
  const manifest = readManifest(root);
  const pages = listPages(docsRoot);

  const copyFailures = [];
  const copies = checkCopies(root, docsRoot, manifest, copyFailures);
  record("copies", copyFailures, `${copies.faces} faces (${copies.bytes} bytes) under ${STATIC_DOCS_ROOT}/${STATIC_FONT_DIR} and ${copies.licenses} OFL texts under ${STATIC_DOCS_ROOT}/${STATIC_FONT_LICENSE_DIR} are byte-identical to the package files`);

  const stylesheetFailures = [];
  const declared = checkStylesheet(root, docsRoot, manifest, stylesheetFailures);
  record("stylesheet", stylesheetFailures, `${STATIC_FONT_STYLESHEET} declares the ${declared} manifest faces at ${STATIC_FONT_DIR}/<face>, every other descriptor as in ${CSS_NAME}`);

  const pageFailures = [];
  checkPages(docsRoot, pages, pageFailures);
  record("pages", pageFailures, `all ${pages.length} pages link ${STATIC_FONT_STYLESHEET} once inside <head>`);

  const cdnFailures = [];
  const scanned = checkCdnStrings(docsRoot, cdnFailures);
  record("cdn-strings", cdnFailures, `no googleapis or gstatic in ${scanned} text files under ${STATIC_DOCS_ROOT}`);

  const legs = {
    families: { failures: [], probes: [] },
    fallback: { failures: [], probes: [] },
    control: { failures: [], probes: [] },
    network: { failures: [], pages: 0, requests: 0, cdnRequests: 0, fontDownloads: 0 }
  };
  try {
    await renderLegs({ docsRoot, manifest, legs });
  } catch (error) {
    legs.network.failures.push(`browser run failed: ${error instanceof Error ? error.message : String(error)}`);
  }
  // A leg that never reached its probes is red, not vacuously green.
  if (legs.families.probes.length !== familyProbes(manifest).length) legs.families.failures.push("not every family/weight probe ran");
  if (legs.fallback.probes.length !== headingProbes().length) legs.fallback.failures.push("the heading probes did not run");
  if (legs.control.probes.length !== headingProbes().length) legs.control.failures.push("the control probes did not run");
  if (legs.network.pages !== pages.length) legs.network.failures.push(`${legs.network.pages} of ${pages.length} pages were loaded`);
  record("network", legs.network.failures, `${legs.network.pages} pages made ${legs.network.requests} requests, all to the local server (googleapis/gstatic: ${legs.network.cdnRequests}); ${legs.network.fontDownloads} downloaded faces on ${PROBE_PAGE} match the vendored digests`);
  record("families", legs.families.failures, `${legs.families.probes.length} family/weight samples load, pass document.fonts.check and are drawn with their own web font`, { probes: legs.families.probes });
  record("fallback", legs.fallback.failures, `${PRODUCT_SAMPLE} in --tcrn-type-family-heading falls back to the Noto Serif SC web font; document.fonts.check is true for it and the resolved stack`, { probes: legs.fallback.probes });
  record("control", legs.control.failures, `with ${STATIC_FONT_DIR}/ blocked the heading probe falls back to system fonts, so the render check tells vendored faces apart`, { probes: legs.control.probes });

  const cdnStringHits = cdnFailures.reduce((sum, failure) => sum + Number(failure.match(/ (\d+) time\(s\)$/)?.[1] ?? 1), 0);
  return { ok: checks.every((check) => check.ok), checks, cdn: { strings: cdnStringHits, requests: legs.network.cdnRequests } };
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
  const report = await runFontsRenderProof({ root });
  for (const check of report.checks) {
    if (check.ok) console.log(`pass  ${check.id}: ${check.pass}`);
    else {
      console.error(`FAIL: ${check.id}`);
      for (const failure of check.failures) console.error(`  - ${failure}`);
    }
    for (const probe of check.probes ?? []) console.log(`      ${probe.id}: ${probe.drawnWith}${"checkFamily" in probe ? `; check ${probe.checkFamily}/${probe.checkStack}` : ""}`);
  }
  console.log(JSON.stringify({ ok: report.ok, googleapisOrGstatic: report.cdn }));
  process.exit(report.ok ? 0 : 1);
}
