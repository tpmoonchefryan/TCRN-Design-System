#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
// TCRN-DS-INC-012 — the contract's brand URL must be a live published asset,
// not a development-source path or an untested prose claim.
//
// TCRN-DS-STORY-127 — and the four product marks are held to their files. The eight
// files in docs/design/gplus-2026-10/logos2 (each mark in color and mono) are
// registered by sha256 in the AI consumption contract; this gate recomputes every
// digest, and compares the package's own renditions with the file bytes, so changing
// one byte of a mark — in the file or in what the package draws — turns it red. The
// product marks are not published yet (publication is an Owner stop), so they have no
// remote URL to fetch; the mother mark keeps its published-asset check unchanged.
//
// TCRN-DS-SUB-127 — what the package draws includes ProductLockup's first line (the second of
// the three renditions), at the rail and the lockup scale, held to the colour files the same way.

import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const contractPath = "apps/storybook/storybook-static/ai-consumption-contract.json";
const localAssetPath = "apps/storybook/assets/tcrn-brand-mark.svg";
const marksContractPath = "docs/design/gplus-2026-10/contract/marks.json";
const productMarkDirectory = "docs/design/gplus-2026-10/logos2";
const packageEntryPath = "packages/ui-react/dist/index.js";
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

const contract = JSON.parse(readFileSync(contractPath, "utf8"));
const source = contract.brandAssetSource ?? {};
const localDigest = sha256(readFileSync(localAssetPath));
const failures = [];

// --- The mother mark: the published asset must be the registered local file. ---
if (!/^https:\/\//u.test(source.url ?? "")) failures.push("brandAssetSource.url must be https");
if (/apps\/storybook|packages\/|file:\/\//u.test(source.url ?? "")) failures.push("brandAssetSource.url points at development input");
if (source.mimeType !== "image/svg+xml") failures.push("brandAssetSource.mimeType must be image/svg+xml");
if (source.sha256 !== localDigest) failures.push("brandAssetSource.sha256 does not match the registered local asset");

let response;
let remoteDigest = null;
if (failures.length === 0) {
  try {
    response = await fetch(source.url, { redirect: "follow" });
    const body = Buffer.from(await response.arrayBuffer());
    remoteDigest = sha256(body);
    if (!response.ok) failures.push(`brand asset request returned ${response.status}`);
    if (!response.headers.get("content-type")?.toLowerCase().includes("image/svg+xml")) failures.push("brand asset response is not image/svg+xml");
    if (remoteDigest !== localDigest) failures.push("published brand asset differs from the registered asset");
  } catch (error) {
    failures.push(`brand asset request failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// --- The product marks: eight local files, registered by digest. ---
const markFailures = [];
const marksContract = JSON.parse(readFileSync(marksContractPath, "utf8"));
const monoInk = marksContract.monoInk;
const expectedFiles = (marksContract.marks ?? []).flatMap((mark) => [
  { productId: mark.productId, variant: "color", path: `${productMarkDirectory}/${mark.id}.svg`, mark },
  { productId: mark.productId, variant: "mono", path: `${productMarkDirectory}/${mark.id}-mono.svg`, mark }
]);
if (expectedFiles.length !== 8) markFailures.push(`marks.json names ${expectedFiles.length / 2} marks; the registered set is four marks in two files each`);

const registered = contract.productMarkSources?.files ?? [];
const registeredByPath = new Map(registered.map((entry) => [entry.path, entry]));
if (registered.length !== expectedFiles.length || registeredByPath.size !== registered.length) {
  markFailures.push(`productMarkSources.files registers ${registered.length} files; expected the ${expectedFiles.length} files of ${productMarkDirectory}`);
}

const fileResults = expectedFiles.map((file) => {
  const entry = registeredByPath.get(file.path);
  if (!existsSync(file.path)) {
    markFailures.push(`${file.path} is missing`);
    return { path: file.path, productId: file.productId, variant: file.variant, registeredSha256: entry?.sha256 ?? null, localSha256: null };
  }
  const bytes = readFileSync(file.path);
  const digest = sha256(bytes);
  if (!entry) markFailures.push(`${file.path} is not registered in productMarkSources.files`);
  else {
    if (entry.sha256 !== digest) markFailures.push(`${file.path} sha256 ${digest} differs from the registered ${entry.sha256}`);
    if (entry.bytes !== bytes.length) markFailures.push(`${file.path} is ${bytes.length} bytes; the contract registers ${entry.bytes}`);
    if (entry.productId !== file.productId || entry.variant !== file.variant) markFailures.push(`${file.path} is registered as ${entry.productId}/${entry.variant}`);
  }
  return { path: file.path, productId: file.productId, variant: file.variant, bytes: bytes.length, registeredSha256: entry?.sha256 ?? null, localSha256: digest, text: bytes.toString("utf8") };
});
for (const entry of registered) {
  if (!expectedFiles.some((file) => file.path === entry.path)) markFailures.push(`productMarkSources.files registers ${entry.path}, which is not a product mark file`);
}

// --- What the package draws must be the same bytes. ---
const packageChecks = [];
if (!existsSync(packageEntryPath)) {
  markFailures.push(`${packageEntryPath} is missing; build @tcrn/ui-react before this gate`);
} else {
  const ui = await import(pathToFileURL(resolve(packageEntryPath)).href);
  const requireFromPackage = createRequire(resolve("packages/ui-react/package.json"));
  const { createElement } = await import(pathToFileURL(requireFromPackage.resolve("react")).href);
  const { renderToStaticMarkup } = await import(pathToFileURL(requireFromPackage.resolve("react-dom/server")).href);
  const innerOf = (svg) => svg.replace(/^<svg\b[^>]*>/u, "").replace(/<\/svg>\s*$/u, "");
  const tile = marksContract.tile ?? {};

  if (typeof ui.tcrnProductMarkSvg !== "function" || typeof ui.TcrnBrandMark !== "function") {
    markFailures.push("@tcrn/ui-react does not export tcrnProductMarkSvg and TcrnBrandMark");
  } else {
    for (const file of fileResults) {
      if (typeof file.text !== "string") continue;
      const fileExport = file.variant === "color"
        ? ui.tcrnProductMarkSvg(file.productId, "color")
        : ui.tcrnProductMarkSvg(file.productId, "mono", { ink: monoInk });
      const fileExportMatches = fileExport === file.text;
      if (!fileExportMatches) markFailures.push(`tcrnProductMarkSvg(${file.productId}, ${file.variant}) differs from ${file.path}`);

      // The component's mono follows the surrounding text, so it draws currentColor
      // where the file has the mono ink; every other byte must be the file's.
      const expectedInner = file.variant === "color" ? innerOf(file.text) : innerOf(file.text).replaceAll(monoInk, "currentColor");
      const rendered = renderToStaticMarkup(createElement(ui.TcrnBrandMark, { productId: file.productId, variant: file.variant }));
      const renderedMatches = innerOf(rendered) === expectedInner;
      if (!renderedMatches) markFailures.push(`TcrnBrandMark ${file.productId}/${file.variant} renders different bytes from ${file.path}`);
      packageChecks.push({ productId: file.productId, variant: file.variant, fileExportMatches, renderedMatches });
    }
    for (const mark of marksContract.marks ?? []) {
      for (const [variant, fill] of [["tile-tint", mark.palette?.tint], ["tile-deep", mark.palette?.deep]]) {
        const svg = ui.tcrnProductMarkSvg(mark.productId, variant);
        const tileMatches = svg.includes(`rx="${tile.radius}" fill="${fill}"/>`) && svg.includes(`<g transform="${tile.inset}">`);
        if (!tileMatches) markFailures.push(`tcrnProductMarkSvg(${mark.productId}, ${variant}) does not follow marks.json tile (radius ${tile.radius}, ${tile.inset}, fill ${fill})`);
        packageChecks.push({ productId: mark.productId, variant, tileMatches });
      }
    }

    // TCRN-DS-SUB-127 (STORY-145): ProductLockup's first line, the second of the three
    // renditions, draws the colour file at both of its scales; its svg[data-logo] names the
    // product and holds the file's bytes.
    if (typeof ui.ProductLockup !== "function") {
      markFailures.push("@tcrn/ui-react does not export ProductLockup");
    } else {
      for (const file of fileResults) {
        if (file.variant !== "color" || typeof file.text !== "string") continue;
        for (const scale of ["rail", "lockup"]) {
          const rendered = renderToStaticMarkup(createElement(ui.ProductLockup, { productId: file.productId, firstLine: scale }));
          const svg = /<svg\b[^>]*\bdata-logo="([^"]*)"[^>]*>([\s\S]*?)<\/svg>/u.exec(rendered);
          const firstLineMatches = svg !== null && svg[1] === file.productId && svg[2] === innerOf(file.text);
          if (!firstLineMatches) markFailures.push(`ProductLockup ${file.productId} first line (${scale}) does not draw ${file.path}`);
          packageChecks.push({ productId: file.productId, variant: `first-line-${scale}`, firstLineMatches });
        }
      }
    }
  }
}

const ok = failures.length === 0 && markFailures.length === 0;
const result = {
  schemaVersion: "tcrn.ds.brand-asset-source-proof.v2",
  ok,
  reasonCode: ok ? "BRAND_ASSET_SOURCE_VERIFIED" : "BRAND_ASSET_SOURCE_UNVERIFIED",
  url: source.url ?? null,
  declaredMimeType: source.mimeType ?? null,
  responseStatus: response?.status ?? null,
  responseContentType: response?.headers.get("content-type") ?? null,
  localSha256: localDigest,
  remoteSha256: remoteDigest,
  productMarks: {
    ok: markFailures.length === 0,
    remoteCheck: "none: the product marks are not published (Owner stop)",
    files: fileResults.map(({ text, ...rest }) => rest),
    packageChecks
  },
  failures: [...failures, ...markFailures]
};
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
if (!result.ok) process.exitCode = 1;
