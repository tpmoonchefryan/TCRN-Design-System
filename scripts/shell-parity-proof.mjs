#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0

import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, normalize, relative, resolve } from "node:path";
import { chromium } from "@playwright/test";

const staticRoot = resolve("apps/storybook/storybook-static");
const route = "/components-navigation-shells.html?theme=light&locale=en#navigation-product-shell-spec";
const packageStorySelector = 'article[data-story-id="navigation-product-shell-spec"]';
const expectedParityRoleCount = 10;
const brandLockupRole = {
  id: "brand-lockup",
  kind: "brand-lockup",
  document: '[data-story-id="navigation-focused-shells-spec"] [data-standard-shell="online-docs"] .tcrn-knowledge-shell__brand .tcrn-shell-brand-lockup',
  package: ".tcrn-doc-global-brand .tcrn-doc-brand .tcrn-product-logo",
  brandSurface: ".tcrn-doc-global-brand",
  sidebarSurface: ".tcrn-doc-sidebar",
  documentMark: ".tcrn-brand-mark",
  packageMark: ".tcrn-brand-mark",
  documentLine: ".tcrn-brand-wordmark, .tcrn-product-logo__line-one",
  packageLine: ".tcrn-product-logo__line-one"
};

export const parityRoles = [
  { id: "canvas", document: ".tcrn-doc-shell", package: ".tcrn-product-shell", authority: "package", properties: ["backgroundColor"] },
  { id: "topbar", document: ".tcrn-doc-global-bar", package: ".tcrn-product-shell__workspace > .tcrn-top-bar", authority: "package", properties: ["gap", "minHeight", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft"] },
  { id: "sidebar-group-spacing", document: ".tcrn-doc-nav__groups", package: ".tcrn-side-nav", authority: "package", properties: ["gap"] },
  { id: "group-title", document: ".tcrn-doc-nav__category-toggle", package: ".tcrn-nav-group__label", authority: "package", properties: ["fontSize", "fontWeight", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft"] },
  { id: "breadcrumb", document: ".tcrn-doc-current-location__story", package: ".tcrn-product-shell__current-location", authority: "package", properties: ["fontSize"] },
  { id: "search", document: ".tcrn-doc-header-search .tcrn-search-input", package: ".tcrn-product-shell-search .tcrn-search-input", authority: "package", properties: ["borderTopWidth", "borderTopStyle", "borderRadius", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft"] },
  { id: "locale", document: ".tcrn-doc-locale-control-slot .tcrn-shell-locale-menu__trigger", package: ".tcrn-shell-locale-menu__trigger", authority: "package", properties: ["borderTopWidth", "borderTopStyle", "borderRadius", "minHeight", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft"] },
  { id: "sidebar-surface", document: ".tcrn-doc-sidebar", package: ".tcrn-product-shell__sidebar", authority: "document", properties: ["backgroundColor"] },
  { id: "nav-item", document: ".tcrn-doc-nav__stories a", package: ".tcrn-nav-item", authority: "document", properties: ["minHeight", "fontSize", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft"] },
  brandLockupRole
];

// An empty production table still executes all ten roles. It is not a switch.
export const parityExceptions = [];

function contentType(path) {
  switch (extname(path)) {
    case ".html": return "text/html; charset=utf-8";
    case ".js": return "text/javascript; charset=utf-8";
    case ".css": return "text/css; charset=utf-8";
    case ".json": return "application/json; charset=utf-8";
    case ".svg": return "image/svg+xml";
    default: return "application/octet-stream";
  }
}

function startStaticServer() {
  const server = createServer((request, response) => {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    const requested = normalize(decodeURIComponent(url.pathname)).replace(/^\/+/, "");
    const target = resolve(staticRoot, requested || "index.html");
    if (relative(staticRoot, target).startsWith("..")) {
      response.writeHead(403);
      response.end("forbidden");
      return;
    }
    try {
      const stats = statSync(target);
      if (!stats.isFile()) throw new Error("not_file");
      response.writeHead(200, { "content-type": contentType(target) });
      createReadStream(target).pipe(response);
    } catch {
      response.writeHead(404);
      response.end("not found");
    }
  });
  return new Promise((resolveServer, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        reject(new Error("shell_parity_no_port"));
        return;
      }
      resolveServer({
        origin: `http://127.0.0.1:${address.port}`,
        close: () => new Promise((resolveClose, rejectClose) => server.close((error) => error ? rejectClose(error) : resolveClose()))
      });
    });
  });
}

async function settle(page) {
  await page.waitForLoadState("networkidle");
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}

async function expandAllStories(page) {
  await page.evaluate(() => {
    for (const article of document.querySelectorAll("article[data-story-collapsed]")) {
      article.setAttribute("data-story-collapsed", "false");
      article.querySelector("[data-story-disclosure]")?.setAttribute("aria-expanded", "true");
    }
  });
  await settle(page);
}

async function addMutation(page) {
  await addCssMutation(page, `${packageStorySelector} .tcrn-nav-item { font-size: 99px !important; }`);
}

async function addCssMutation(page, cssText) {
  await page.evaluate((text) => {
    const style = document.createElement("style");
    style.dataset.shellParityMutation = "true";
    style.textContent = text;
    document.head.append(style);
  }, cssText);
  await settle(page);
}

async function removeMutation(page) {
  await page.evaluate(() => document.querySelector("style[data-shell-parity-mutation]")?.remove());
  await settle(page);
}

export async function measureParity(page, roles = parityRoles, exceptions = parityExceptions) {
  return page.evaluate(({ roles: roleTable, exceptionTable, storySelector, enforceRoleCount, expectedRoleCount }) => {
    const read = (node, properties) => {
      const style = getComputedStyle(node);
      return Object.fromEntries(properties.map((property) => [property, style[property]]));
    };
    const rect = (node) => {
      if (!node) return null;
      const box = node.getBoundingClientRect();
      return {
        left: Number(box.left.toFixed(2)),
        right: Number(box.right.toFixed(2)),
        top: Number(box.top.toFixed(2)),
        bottom: Number(box.bottom.toFixed(2)),
        width: Number(box.width.toFixed(2)),
        height: Number(box.height.toFixed(2))
      };
    };
    const closeEnough = (left, right) => Math.abs(left - right) <= 0.5;
    const measureBrandLockup = (role) => {
      const example = document.querySelector(role.document);
      const truth = document.querySelector(role.package);
      const exampleMark = example?.querySelector(role.documentMark);
      const truthMark = truth?.querySelector(role.packageMark);
      const exampleLine = example?.querySelector(role.documentLine);
      const truthLine = truth?.querySelector(role.packageLine);
      const brandSurface = document.querySelector(role.brandSurface);
      const sidebarSurface = document.querySelector(role.sidebarSurface);
      const exampleMarkRect = rect(exampleMark);
      const truthMarkRect = rect(truthMark);
      const brandSurfaceRect = rect(brandSurface);
      const sidebarSurfaceRect = rect(sidebarSurface);
      const differences = [];
      const measurements = {
        example: {
          selector: role.document,
          className: example?.className ?? null,
          assetId: example?.getAttribute("data-product-logo-asset-id") ?? null,
          mark: exampleMarkRect,
          firstLineFontSize: exampleLine ? getComputedStyle(exampleLine).fontSize : null,
          lockup: rect(example)
        },
        truth: {
          selector: role.package,
          className: truth?.className ?? null,
          assetId: truth?.getAttribute("data-product-logo-asset-id") ?? null,
          mark: truthMarkRect,
          firstLineFontSize: truthLine ? getComputedStyle(truthLine).fontSize : null,
          lockup: rect(truth)
        },
        surfaces: {
          brand: brandSurfaceRect,
          sidebar: sidebarSurfaceRect,
          verticalGap: brandSurfaceRect && sidebarSurfaceRect
            ? Number((sidebarSurfaceRect.top - brandSurfaceRect.bottom).toFixed(2))
            : null
        }
      };
      if (!example || !truth || !exampleMark || !truthMark || !exampleLine || !truthLine || !brandSurface || !sidebarSurface) {
        differences.push({
          property: "selector",
          document: Boolean(example && exampleMark && exampleLine && brandSurface),
          package: Boolean(truth && truthMark && truthLine && sidebarSurface)
        });
      } else {
        const comparisons = [
          ["brandMarkWidth", exampleMarkRect?.width, truthMarkRect?.width],
          ["brandMarkHeight", exampleMarkRect?.height, truthMarkRect?.height]
        ];
        for (const [property, documentValue, packageValue] of comparisons) {
          if (!closeEnough(documentValue, packageValue)) {
            differences.push({ property, document: documentValue, package: packageValue, direction: "document-lags" });
          }
        }
        const exampleFontSize = getComputedStyle(exampleLine).fontSize;
        const truthFontSize = getComputedStyle(truthLine).fontSize;
        if (exampleFontSize !== truthFontSize) {
          differences.push({ property: "firstLineFontSize", document: exampleFontSize, package: truthFontSize, direction: "document-lags" });
        }
        const exampleAssetId = example.getAttribute("data-product-logo-asset-id");
        const truthAssetId = truth.getAttribute("data-product-logo-asset-id");
        if (exampleAssetId !== truthAssetId) {
          differences.push({ property: "productLogoAssetId", document: exampleAssetId, package: truthAssetId, direction: "document-lags" });
        }
        if (!closeEnough(brandSurfaceRect.left, sidebarSurfaceRect.left)) {
          differences.push({ property: "surfaceLeft", document: brandSurfaceRect.left, package: sidebarSurfaceRect.left, direction: "document-lags" });
        }
        if (!closeEnough(brandSurfaceRect.right, sidebarSurfaceRect.right)) {
          differences.push({ property: "surfaceRight", document: brandSurfaceRect.right, package: sidebarSurfaceRect.right, direction: "document-lags" });
        }
        const verticalGap = sidebarSurfaceRect.top - brandSurfaceRect.bottom;
        if (verticalGap > 0.5) {
          differences.push({ property: "surfaceVerticalGap", document: verticalGap, package: 0, direction: "document-lags" });
        }
      }
      return {
        id: role.id,
        document: role.document,
        package: role.package,
        measurements,
        differences,
        accepted: [],
        ok: differences.length === 0
      };
    };
    const results = roleTable.map((role) => {
      if (role.kind === "brand-lockup") return measureBrandLockup(role);
      const documentNode = document.querySelector(role.document);
      const packageNode = document.querySelector(storySelector)?.querySelector(role.package);
      const differences = [];
      const accepted = [];
      if (!documentNode || !packageNode) {
        differences.push({ property: "selector", document: Boolean(documentNode), package: Boolean(packageNode) });
      } else {
        const documentValues = read(documentNode, role.properties);
        const packageValues = read(packageNode, role.properties);
        for (const property of role.properties) {
          if (documentValues[property] === packageValues[property]) continue;
          const exception = exceptionTable.find((candidate) => candidate.role === role.id && candidate.property === property);
          if (exception) {
            accepted.push({ role: role.id, property, reason: exception.reason, acceptedAt: exception.acceptedAt });
            continue;
          }
          differences.push({
            property,
            document: documentValues[property],
            package: packageValues[property],
            direction: role.authority === "package" ? "document-lags" : "package-lags"
          });
        }
      }
      return { id: role.id, document: role.document, package: role.package, differences, accepted, ok: differences.length === 0 };
    });
    return {
      roleCount: results.length,
      roles: results,
      acceptedExceptions: results.flatMap((result) => result.accepted),
      ok: results.length === roleTable.length
        && (!enforceRoleCount || roleTable.length === expectedRoleCount)
        && results.every((result) => result.ok)
    };
  }, { roles, exceptionTable: exceptions, storySelector: packageStorySelector, enforceRoleCount: roles === parityRoles, expectedRoleCount: expectedParityRoleCount });
}

async function main() {
  if (!existsSync(staticRoot)) throw new Error("shell_parity_missing_static_surface");
  const server = await startStaticServer();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  let result;
  try {
    await page.goto(`${server.origin}${route}`);
    await settle(page);
    await expandAllStories(page);
    const baseline = await measureParity(page);
    const brandMatrix = [];
    for (const combination of [
      { theme: "light", locale: "en" },
      { theme: "light", locale: "zh-CN" },
      { theme: "dark", locale: "en" },
      { theme: "dark", locale: "zh-CN" }
    ]) {
      await page.goto(`${server.origin}/components-navigation-shells.html?theme=${combination.theme}&locale=${combination.locale}#navigation-product-shell-spec`);
      await settle(page);
      await expandAllStories(page);
      const parity = await measureParity(page, [brandLockupRole]);
      brandMatrix.push({ ...combination, ...parity });
    }
    await page.goto(`${server.origin}${route}`);
    await settle(page);
    await expandAllStories(page);
    await addMutation(page);
    const mutated = await measureParity(page);
    await removeMutation(page);
    await addCssMutation(page, ".tcrn-doc-locale-control-slot .tcrn-shell-locale-menu__trigger { border-radius: 1px !important; }");
    const exceptionProbe = await measureParity(page, [parityRoles.find((role) => role.id === "locale")], [{
      role: "locale",
      property: "borderRadius",
      acceptedAt: "synthetic-proof",
      reason: "SYNTHETIC_EXCEPTION_PATH"
    }]);
    await removeMutation(page);
    const restored = await measureParity(page);
    const brandMutationCss = `${brandLockupRole.document} .tcrn-brand-wordmark, ${brandLockupRole.document} .tcrn-product-logo__line-one { font-size: 99px !important; }`;
    await addCssMutation(page, brandMutationCss);
    const brandMutated = await measureParity(page, [brandLockupRole]);
    await removeMutation(page);
    const brandRestored = await measureParity(page, [brandLockupRole]);
    const brandBaseline = baseline.roles.find((role) => role.id === brandLockupRole.id);
    result = {
      schemaVersion: "tcrn.ds.shell-parity-proof.v2",
      roleCount: parityRoles.length,
      baseline,
      mutated,
      restored,
      brandLockup: {
        baseline: brandBaseline,
        matrix: brandMatrix,
        mutated: brandMutated,
        restored: brandRestored
      },
      exceptionProbe: {
        ok: exceptionProbe.roles.find((role) => role.id === "locale")?.ok === true
          && exceptionProbe.acceptedExceptions.some((entry) => entry.reason === "SYNTHETIC_EXCEPTION_PATH"),
        acceptedExceptions: exceptionProbe.acceptedExceptions
      },
      redThenGreen: {
        baselineRed: !baseline.ok,
        mutationRed: !mutated.ok,
        restoredGreen: restored.ok,
        brandLockup: {
          baselineRed: !brandBaseline?.ok,
          mutationRed: !brandMutated.ok,
          restoredGreen: brandRestored.ok
        }
      }
    };
    result.ok = baseline.ok
      && !mutated.ok
      && restored.ok
      && result.exceptionProbe.ok
      && brandMatrix.every((entry) => entry.ok)
      && !brandMutated.ok
      && brandRestored.ok;
  } finally {
    await page.close();
    await browser.close();
    await server.close();
  }
  console.log(JSON.stringify(result));
  if (!result.ok) process.exitCode = 1;
}

await main();
