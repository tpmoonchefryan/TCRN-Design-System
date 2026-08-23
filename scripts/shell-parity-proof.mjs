#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0

import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, normalize, relative, resolve } from "node:path";
import { chromium } from "@playwright/test";

const staticRoot = resolve("apps/storybook/storybook-static");
const route = "/components-navigation-shells.html?theme=light&locale=en#navigation-product-shell-spec";
const packageStorySelector = 'article[data-story-id="navigation-product-shell-spec"]';
const expectedParityRoleCount = 17;
const sampleShellRoot = '[data-story-id="navigation-focused-shells-spec"] [data-standard-shell="online-docs"]';
const brandLockupRole = {
  id: "brand-lockup",
  kind: "brand-lockup",
  document: '[data-story-id="navigation-focused-shells-spec"] [data-standard-shell="online-docs"] .tcrn-knowledge-shell__brand .tcrn-shell-brand-lockup',
  package: ".tcrn-doc-global-brand .tcrn-doc-brand .tcrn-product-logo",
  brandSurface: ".tcrn-doc-global-brand",
  sidebarSurface: ".tcrn-doc-sidebar",
  truthTopbarSurface: ".tcrn-doc-global-bar",
  sampleBrandSurface: `${sampleShellRoot} .tcrn-knowledge-shell__brand-cell`,
  sampleTopbarSurface: `${sampleShellRoot} .tcrn-knowledge-shell__topbar`,
  documentMark: ".tcrn-brand-mark",
  packageMark: ".tcrn-brand-mark",
  documentLine: ".tcrn-brand-wordmark, .tcrn-product-logo__line-one",
  packageLine: ".tcrn-product-logo__line-one"
};

export const parityRoles = [
  { id: "canvas", document: ".tcrn-doc-shell", package: ".tcrn-product-shell", authority: "package", properties: ["backgroundColor"] },
  { id: "package-topbar", document: ".tcrn-doc-global-bar", package: ".tcrn-product-shell__workspace > .tcrn-top-bar", authority: "package", properties: ["gap", "minHeight", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft"] },
  { id: "sidebar-group-spacing", document: ".tcrn-doc-nav__groups", package: ".tcrn-side-nav", authority: "package", properties: ["gap"] },
  { id: "package-group-title", document: ".tcrn-doc-nav__category-toggle", package: ".tcrn-nav-group__label", authority: "package", properties: ["fontSize", "fontWeight", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft"] },
  { id: "breadcrumb", document: ".tcrn-doc-current-location__story", package: ".tcrn-product-shell__current-location", authority: "package", properties: ["fontSize"] },
  { id: "search", document: ".tcrn-doc-header-search .tcrn-search-input", package: ".tcrn-product-shell-search .tcrn-search-input", authority: "package", properties: ["borderTopWidth", "borderTopStyle", "borderRadius", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft"] },
  { id: "locale", document: ".tcrn-doc-locale-control-slot .tcrn-shell-locale-menu__trigger", package: ".tcrn-shell-locale-menu__trigger", authority: "package", properties: ["borderTopWidth", "borderTopStyle", "borderRadius", "minHeight", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft"] },
  { id: "sidebar-surface", document: ".tcrn-doc-sidebar", package: ".tcrn-product-shell__sidebar", authority: "document", properties: ["backgroundColor"] },
  { id: "package-nav-item", document: ".tcrn-doc-nav__stories a", package: ".tcrn-nav-item", authority: "document", properties: ["minHeight", "fontSize", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft"] },
  brandLockupRole
];

export const sampleShellRoles = [
  {
    id: "collapse-toggle",
    kind: "sample-shell",
    document: `${sampleShellRoot} .tcrn-knowledge-shell__brand-cell`,
    package: ".tcrn-doc-global-brand",
    documentControl: `${sampleShellRoot} .tcrn-knowledge-shell__brand-cell button`,
    packageControl: ".tcrn-doc-sidebar-toggle-slot button",
    documentText: `${sampleShellRoot} .tcrn-knowledge-shell__brand .tcrn-product-logo__copy`,
    packageText: ".tcrn-doc-global-brand .tcrn-doc-brand .tcrn-product-logo__copy",
    primitiveAttribute: "data-package-backed-shell-control",
    primitiveValue: "side-nav-collapse",
    authority: "truth",
    properties: []
  },
  {
    id: "topbar",
    kind: "sample-shell",
    document: `${sampleShellRoot} .tcrn-knowledge-shell__topbar`,
    package: ".tcrn-doc-global-bar",
    primitiveAttribute: "data-registered-shell-primitive",
    primitiveValue: "@tcrn/ui-react/TopBar",
    authority: "truth",
    properties: ["minHeight", "paddingTop", "paddingBottom", "paddingLeft", "paddingRight", "gap", "backgroundColor"]
  },
  {
    id: "sidebar",
    kind: "sample-shell",
    document: `${sampleShellRoot} .tcrn-knowledge-shell__sidebar`,
    package: ".tcrn-doc-sidebar",
    primitiveAttribute: "data-navigation-primitive",
    primitiveValue: "side-nav",
    authority: "truth",
    properties: ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "gap", "backgroundColor"]
  },
  {
    id: "group-container",
    kind: "sample-shell",
    document: `${sampleShellRoot} .tcrn-knowledge-shell__groups`,
    package: ".tcrn-doc-nav__groups",
    authority: "truth",
    properties: ["gap"]
  },
  {
    id: "shell-relations",
    kind: "sample-shell-relations",
    document: `${sampleShellRoot} .tcrn-knowledge-shell__brand-cell`,
    package: ".tcrn-doc-global-brand",
    sampleBrand: `${sampleShellRoot} .tcrn-knowledge-shell__brand-cell`,
    sampleSidebar: `${sampleShellRoot} .tcrn-knowledge-shell__sidebar`,
    sampleNav: `${sampleShellRoot} .tcrn-nav-item`,
    truthBrand: ".tcrn-doc-global-brand",
    truthSidebar: ".tcrn-doc-sidebar",
    truthNav: ".tcrn-doc-nav__stories:not([hidden]) a",
    authority: "truth",
    properties: []
  },
  {
    id: "nav-item",
    kind: "sample-shell",
    document: `${sampleShellRoot} .tcrn-nav-item`,
    package: ".tcrn-doc-nav__stories a",
    primitiveAttribute: "data-navigation-primitive",
    primitiveValue: "nav-item",
    authority: "truth",
    properties: ["fontSize", "paddingTop", "paddingBottom", "paddingLeft", "borderRadius", "minHeight", "backgroundColor"]
  },
  {
    id: "group-title",
    kind: "sample-shell",
    document: `${sampleShellRoot} .tcrn-nav-group__label`,
    package: ".tcrn-doc-nav__category-toggle",
    primitiveSelector: `${sampleShellRoot} .tcrn-nav-group`,
    primitiveAttribute: "data-navigation-primitive",
    primitiveValue: "nav-group",
    authority: "truth",
    properties: ["fontSize", "fontWeight", "paddingLeft", "paddingRight", "color"]
  }
];

parityRoles.push(...sampleShellRoles);

// The production exception table is explicit; empty-table behavior is exercised by
// emptyExceptionProbe below rather than treated as a disabled gate.
export const parityExceptions = [{
  role: "nav-item",
  property: "borderRadius",
  acceptedAt: "2026-08-23",
  reason: "SAMPLE_CARD_REGISTERED_NAV_RADIUS: the microcard keeps NavItem's registered product-nav radius while the full documentation shell keeps its leaf links flat"
}];

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
      const truthTopbarSurface = document.querySelector(role.truthTopbarSurface);
      const sampleBrandSurface = document.querySelector(role.sampleBrandSurface);
      const sampleTopbarSurface = document.querySelector(role.sampleTopbarSurface);
      const exampleMarkRect = rect(exampleMark);
      const truthMarkRect = rect(truthMark);
      const brandSurfaceRect = rect(brandSurface);
      const sidebarSurfaceRect = rect(sidebarSurface);
      const truthTopbarSurfaceRect = rect(truthTopbarSurface);
      const sampleBrandSurfaceRect = rect(sampleBrandSurface);
      const sampleTopbarSurfaceRect = rect(sampleTopbarSurface);
      const truthTopGap = truthTopbarSurfaceRect && brandSurfaceRect
        ? Number((brandSurfaceRect.top - truthTopbarSurfaceRect.top).toFixed(2))
        : null;
      const sampleTopGap = sampleTopbarSurfaceRect && sampleBrandSurfaceRect
        ? Number((sampleBrandSurfaceRect.top - sampleTopbarSurfaceRect.top).toFixed(2))
        : null;
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
          top: {
            truth: truthTopGap,
            sample: sampleTopGap
          },
          verticalGap: brandSurfaceRect && sidebarSurfaceRect
            ? Number((sidebarSurfaceRect.top - brandSurfaceRect.bottom).toFixed(2))
            : null
        }
      };
      if (!example || !truth || !exampleMark || !truthMark || !exampleLine || !truthLine || !brandSurface || !sidebarSurface || !truthTopbarSurface || !sampleBrandSurface || !sampleTopbarSurface) {
        differences.push({
          property: "selector",
          document: Boolean(example && exampleMark && exampleLine && brandSurface && sampleBrandSurface && sampleTopbarSurface),
          package: Boolean(truth && truthMark && truthLine && sidebarSurface && truthTopbarSurface)
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
        if (truthTopGap > 0.5 || sampleTopGap > 0.5) {
          differences.push({ property: "surfaceTopGap", document: sampleTopGap, package: truthTopGap, direction: "document-lags" });
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
    const measureSampleShellRelations = (role) => {
      const sampleBrand = document.querySelector(role.sampleBrand);
      const sampleSidebar = document.querySelector(role.sampleSidebar);
      const sampleNav = document.querySelector(role.sampleNav);
      const truthBrand = document.querySelector(role.truthBrand);
      const truthSidebar = document.querySelector(role.truthSidebar);
      const truthNav = document.querySelector(role.truthNav);
      const sampleBrandRect = rect(sampleBrand);
      const sampleSidebarRect = rect(sampleSidebar);
      const sampleNavRect = rect(sampleNav);
      const truthBrandRect = rect(truthBrand);
      const truthSidebarRect = rect(truthSidebar);
      const truthNavRect = rect(truthNav);
      const relationValues = (brand, sidebar, nav) => brand && sidebar && nav ? {
        brandSurfaceLeft: Number((brand.left - sidebar.left).toFixed(2)),
        brandSurfaceRight: Number((brand.right - sidebar.right).toFixed(2)),
        sidebarTopFromBrandBottom: Number((sidebar.top - brand.bottom).toFixed(2)),
        navItemLeft: Number((nav.left - sidebar.left).toFixed(2))
      } : null;
      const sampleRelations = relationValues(sampleBrandRect, sampleSidebarRect, sampleNavRect);
      const truthRelations = relationValues(truthBrandRect, truthSidebarRect, truthNavRect);
      const measurements = {
        sample: { brand: sampleBrandRect, sidebar: sampleSidebarRect, nav: sampleNavRect, relations: sampleRelations },
        truth: { brand: truthBrandRect, sidebar: truthSidebarRect, nav: truthNavRect, relations: truthRelations }
      };
      const differences = [];
      if (!sampleRelations || !truthRelations) {
        differences.push({
          property: "relation-selector",
          sample: Boolean(sampleRelations),
          truth: Boolean(truthRelations)
        });
      } else {
        for (const property of Object.keys(truthRelations)) {
          if (!closeEnough(sampleRelations[property], truthRelations[property])) {
            differences.push({
              property,
              sample: sampleRelations[property],
              truth: truthRelations[property],
              direction: "sample-lags"
            });
          }
        }
      }
      return { id: role.id, document: role.document, package: role.package, measurements, differences, accepted: [], ok: differences.length === 0 };
    };
    const measureSampleShell = (role) => {
      const example = document.querySelector(role.document);
      const truth = document.querySelector(role.package);
      const differences = [];
      const accepted = [];
      const exampleRect = rect(example);
      const truthRect = rect(truth);
      const measurements = {
        example: {
          selector: role.document,
          className: example?.className ?? null,
          rect: exampleRect,
          styles: example ? read(example, role.properties) : null
        },
        truth: {
          selector: role.package,
          className: truth?.className ?? null,
          rect: truthRect,
          styles: truth ? read(truth, role.properties) : null
        }
      };
      if (!example || !truth) {
        differences.push({ property: "selector", document: Boolean(example), package: Boolean(truth) });
      } else if (role.id === "collapse-toggle") {
        const primitiveNode = document.querySelector(role.documentControl);
        if (role.primitiveAttribute && primitiveNode?.getAttribute(role.primitiveAttribute) !== role.primitiveValue) {
          differences.push({ property: "registered-primitive", document: primitiveNode?.getAttribute(role.primitiveAttribute) ?? null, package: role.primitiveValue, direction: "sample-lags" });
        }
        const exampleControl = document.querySelector(role.documentControl);
        const truthControl = document.querySelector(role.packageControl);
        const exampleText = document.querySelector(role.documentText);
        const truthText = document.querySelector(role.packageText);
        const exampleControlRect = rect(exampleControl);
        const truthControlRect = rect(truthControl);
        const exampleTextRect = rect(exampleText);
        const truthTextRect = rect(truthText);
        const exampleStyle = exampleControl ? getComputedStyle(exampleControl) : null;
        const truthStyle = truthControl ? getComputedStyle(truthControl) : null;
        const exampleRightInset = exampleRect && exampleControlRect ? Number((exampleRect.right - exampleControlRect.right).toFixed(2)) : null;
        const truthRightInset = truthRect && truthControlRect ? Number((truthRect.right - truthControlRect.right).toFixed(2)) : null;
        const expectedRightInset = Number(Math.min(24, Math.max(16, window.innerWidth * 0.016)).toFixed(2));
        const exampleTextGap = exampleTextRect && exampleControlRect ? Number((exampleControlRect.left - exampleTextRect.right).toFixed(2)) : null;
        const truthTextGap = truthTextRect && truthControlRect ? Number((truthControlRect.left - truthTextRect.right).toFixed(2)) : null;
        measurements.controls = {
          example: {
            selector: role.documentControl,
            rect: exampleControlRect,
            ariaLabel: exampleControl?.getAttribute("aria-label") ?? null,
            rightInset: exampleRightInset,
            expectedRightInset,
            textGap: exampleTextGap,
            minimumTruthTextGap: 7,
            width: exampleStyle?.width ?? null,
            height: exampleStyle?.height ?? null
          },
          truth: {
            selector: role.packageControl,
            rect: truthControlRect,
            ariaLabel: truthControl?.getAttribute("aria-label") ?? null,
            rightInset: truthRightInset,
            textGap: truthTextGap,
            width: truthStyle?.width ?? null,
            height: truthStyle?.height ?? null
          }
        };
        if (!exampleControl || !truthControl || !exampleControlRect || !truthControlRect || !exampleText || !truthText || !exampleTextRect || !truthTextRect) {
          differences.push({ property: "control-selector", document: Boolean(exampleControl && exampleText), package: Boolean(truthControl && truthText) });
        } else {
          if (!closeEnough(exampleControlRect.width, truthControlRect.width)) {
            differences.push({ property: "controlWidth", document: exampleControlRect.width, package: truthControlRect.width, direction: "sample-lags" });
          }
          if (!closeEnough(exampleControlRect.height, truthControlRect.height)) {
            differences.push({ property: "controlHeight", document: exampleControlRect.height, package: truthControlRect.height, direction: "sample-lags" });
          }
          if (!closeEnough(exampleRightInset, expectedRightInset)) {
            differences.push({ property: "controlRightAlignment", document: exampleRightInset, package: expectedRightInset, direction: "sample-lags" });
          }
          if (exampleTextGap < 7) {
            differences.push({ property: "textToControlGap", document: exampleTextGap, package: 7, direction: "sample-lags" });
          }
          const exampleLabel = exampleControl.getAttribute("aria-label");
          const truthLabel = truthControl.getAttribute("aria-label");
          if (exampleLabel !== truthLabel) {
            differences.push({ property: "ariaLabel", document: exampleLabel, package: truthLabel, direction: "sample-lags" });
          }
        }
      } else {
        const primitiveNode = role.primitiveSelector ? document.querySelector(role.primitiveSelector) : example;
        if (role.primitiveAttribute && primitiveNode?.getAttribute(role.primitiveAttribute) !== role.primitiveValue) {
          differences.push({ property: "registered-primitive", document: primitiveNode?.getAttribute(role.primitiveAttribute) ?? null, package: role.primitiveValue, direction: "sample-lags" });
        }
        const exampleValues = read(example, role.properties);
        const truthValues = read(truth, role.properties);
        for (const property of role.properties) {
          if (exampleValues[property] === truthValues[property]) continue;
          const exception = exceptionTable.find((candidate) => candidate.role === role.id && candidate.property === property);
          if (exception) {
            accepted.push({ role: role.id, property, reason: exception.reason, acceptedAt: exception.acceptedAt });
            continue;
          }
          differences.push({ property, document: exampleValues[property], package: truthValues[property], direction: "sample-lags" });
        }
      }
      return { id: role.id, document: role.document, package: role.package, measurements, differences, accepted, ok: differences.length === 0 };
    };
    const results = roleTable.map((role) => {
      if (role.kind === "brand-lockup") return measureBrandLockup(role);
      if (role.kind === "sample-shell-relations") return measureSampleShellRelations(role);
      if (role.kind === "sample-shell") return measureSampleShell(role);
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
    const collapseRole = sampleShellRoles.find((role) => role.id === "collapse-toggle");
    const relationRole = sampleShellRoles.find((role) => role.id === "shell-relations");
    await addCssMutation(page, `${relationRole.sampleBrand} { transform: translateX(-20px) !important; }`);
    const relationPreRepair = await measureParity(page, [relationRole]);
    await removeMutation(page);
    const sampleShellMutations = {};
    const sampleMutationCss = {
      "collapse-toggle": `${sampleShellRoles.find((role) => role.id === "collapse-toggle").document} button { transform: translateX(-99px) !important; }`,
      topbar: `${sampleShellRoles.find((role) => role.id === "topbar").document} { gap: 99px !important; }`,
      sidebar: `${sampleShellRoles.find((role) => role.id === "sidebar").document} { padding-left: 99px !important; }`,
      "group-container": `${sampleShellRoles.find((role) => role.id === "group-container").document} { gap: 99px !important; }`,
      "shell-relations": `${relationRole.sampleBrand} { transform: translateX(-20px) !important; }`,
      "nav-item": `${sampleShellRoles.find((role) => role.id === "nav-item").document} { font-size: 99px !important; }`,
      "group-title": `${sampleShellRoles.find((role) => role.id === "group-title").document} { font-size: 99px !important; }`
    };
    for (const role of sampleShellRoles) {
      await addCssMutation(page, sampleMutationCss[role.id]);
      const mutatedRole = await measureParity(page, [role]);
      await removeMutation(page);
      const restoredRole = await measureParity(page, [role]);
      sampleShellMutations[role.id] = {
        mutation: sampleMutationCss[role.id],
        mutated: mutatedRole,
        restored: restoredRole
      };
      if (role.id === "collapse-toggle") {
        const baselineLabel = await page.locator(role.documentControl).getAttribute("aria-label");
        await page.evaluate((selector) => document.querySelector(selector)?.setAttribute("aria-label", "SAMPLE_ARIA_MUTATION"), role.documentControl);
        await settle(page);
        const ariaMutated = await measureParity(page, [role]);
        await page.evaluate(({ selector, label }) => document.querySelector(selector)?.setAttribute("aria-label", label ?? ""), { selector: role.documentControl, label: baselineLabel });
        await settle(page);
        const ariaRestored = await measureParity(page, [role]);
        sampleShellMutations[role.id].ariaLabel = {
          mutation: "aria-label=SAMPLE_ARIA_MUTATION",
          mutated: ariaMutated,
          restored: ariaRestored
        };
      }
    }
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
    const sampleLocaleMatrix = [];
    for (const locale of ["en", "zh-CN", "ja", "fr", "ko"]) {
      await page.goto(`${server.origin}/components-navigation-shells.html?theme=light&locale=${locale}#navigation-product-shell-spec`);
      await settle(page);
      await expandAllStories(page);
      sampleLocaleMatrix.push({ locale, ...(await measureParity(page, [collapseRole])) });
    }
    const sampleNetGapMatrix = [];
    for (const locale of ["en", "zh-CN", "ja", "fr", "ko"]) {
      for (const width of [1024, 1920]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`${server.origin}/components-navigation-shells.html?theme=light&locale=${locale}#navigation-product-shell-spec`);
        await settle(page);
        await expandAllStories(page);
        sampleNetGapMatrix.push({ locale, width, ...(await measureParity(page, [collapseRole])) });
      }
    }
    const sampleShellViewportMatrix = [];
    for (const width of [1024, 1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${server.origin}${route}`);
      await settle(page);
      await expandAllStories(page);
      sampleShellViewportMatrix.push({ width, ...(await measureParity(page, [collapseRole])) });
    }
    await page.setViewportSize({ width: 1440, height: 900 });
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
    const emptyExceptionProbe = await measureParity(page, [sampleShellRoles.find((role) => role.id === "nav-item")], []);
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
      sampleShell: {
        baseline: baseline.roles.filter((role) => sampleShellRoles.some((candidate) => candidate.id === role.id)),
        localeMatrix: sampleLocaleMatrix,
        netGapMatrix: sampleNetGapMatrix,
        viewportMatrix: sampleShellViewportMatrix,
        mutations: sampleShellMutations
      },
      exceptionProbe: {
        ok: exceptionProbe.roles.find((role) => role.id === "locale")?.ok === true
          && exceptionProbe.acceptedExceptions.some((entry) => entry.reason === "SYNTHETIC_EXCEPTION_PATH"),
        acceptedExceptions: exceptionProbe.acceptedExceptions
      },
      relationPreRepair: {
        ok: !relationPreRepair.ok,
        differences: relationPreRepair.roles.flatMap((role) => role.differences)
      },
      emptyExceptionProbe: {
        ok: !emptyExceptionProbe.ok,
        differences: emptyExceptionProbe.roles.flatMap((role) => role.differences)
      },
      redThenGreen: {
        baselineRed: !baseline.ok,
        mutationRed: !mutated.ok,
        restoredGreen: restored.ok,
        brandLockup: {
          baselineRed: !brandBaseline?.ok,
          mutationRed: !brandMutated.ok,
          restoredGreen: brandRestored.ok
        },
        sampleShell: Object.fromEntries(sampleShellRoles.map((role) => [role.id, {
          baselineRed: !baseline.roles.find((candidate) => candidate.id === role.id)?.ok,
          mutationRed: !sampleShellMutations[role.id].mutated.ok,
          restoredGreen: sampleShellMutations[role.id].restored.ok,
          ...(role.id === "collapse-toggle" ? {
            ariaLabelMutationRed: !sampleShellMutations[role.id].ariaLabel.mutated.ok,
            ariaLabelRestoredGreen: sampleShellMutations[role.id].ariaLabel.restored.ok
          } : {})
        }]))
      }
    };
    result.ok = baseline.ok
      && !mutated.ok
      && restored.ok
      && result.exceptionProbe.ok
      && result.relationPreRepair.ok
      && result.emptyExceptionProbe.ok
      && brandMatrix.every((entry) => entry.ok)
      && !brandMutated.ok
      && brandRestored.ok
      && sampleShellRoles.every((role) => baseline.roles.find((candidate) => candidate.id === role.id)?.ok)
      && sampleLocaleMatrix.every((entry) => entry.ok)
      && sampleNetGapMatrix.every((entry) => entry.ok && entry.roles[0].measurements.controls.example.textGap >= 7)
      && sampleShellViewportMatrix.every((entry) => entry.ok)
      && sampleShellRoles.every((role) => !sampleShellMutations[role.id].mutated.ok && sampleShellMutations[role.id].restored.ok)
      && !sampleShellMutations["collapse-toggle"].ariaLabel.mutated.ok
      && sampleShellMutations["collapse-toggle"].ariaLabel.restored.ok;
  } finally {
    await page.close();
    await browser.close();
    await server.close();
  }
  console.log(JSON.stringify(result));
  if (!result.ok) process.exitCode = 1;
}

await main();
