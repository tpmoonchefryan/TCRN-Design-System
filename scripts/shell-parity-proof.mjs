#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0

import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, normalize, relative, resolve } from "node:path";
import { chromium } from "@playwright/test";

const staticRoot = resolve("apps/storybook/storybook-static");
const route = "/components-navigation-shells.html?theme=light&locale=en#navigation-product-shell-spec";
const packageStorySelector = 'article[data-story-id="navigation-product-shell-spec"]';
const expectedParityRoleCount = 19;
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
  { id: "package-nav-item", document: ".tcrn-doc-nav__stories:not([hidden]) a", package: ".tcrn-nav-item", authority: "document", properties: ["minHeight", "fontSize", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft"] },
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
    package: ".tcrn-doc-nav__stories:not([hidden]) a",
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
  },
  {
    id: "element-inventory",
    kind: "element-inventory",
    sampleRoots: [
      { id: "topbar", selector: `${sampleShellRoot} .tcrn-knowledge-shell__topbar`, includeControls: true },
      { id: "sidebar", selector: `${sampleShellRoot} .tcrn-knowledge-shell__sidebar`, includeControls: false }
    ],
    truthRoots: [
      { id: "topbar", selector: ".tcrn-doc-global-bar", includeControls: true },
      { id: "sidebar", selector: ".tcrn-doc-sidebar", includeControls: false }
    ]
  },
  {
    id: "string-source",
    kind: "visible-string-source",
    sampleRoots: [
      { id: "topbar", selector: `${sampleShellRoot} .tcrn-knowledge-shell__topbar` }
    ],
    truthRoots: [
      { id: "topbar", selector: ".tcrn-doc-global-bar" }
    ]
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
    const rawRect = (node) => {
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
    const layoutState = (node) => {
      if (!node) return { ok: false, reason: "missing" };
      const hiddenAncestor = node.closest("[hidden]");
      if (hiddenAncestor) {
        return {
          ok: false,
          reason: "hidden-ancestor",
          hiddenAncestor: hiddenAncestor.id || hiddenAncestor.className || hiddenAncestor.tagName.toLowerCase()
        };
      }
      const box = node.getBoundingClientRect();
      if (box.width <= 0 || box.height <= 0) {
        return {
          ok: false,
          reason: "zero-dimensions",
          dimensions: { width: Number(box.width.toFixed(2)), height: Number(box.height.toFixed(2)) }
        };
      }
      return { ok: true };
    };
    const addSampleValidity = (differences, node, side, target) => {
      if (!node) return true;
      const state = layoutState(node);
      if (state.ok) return true;
      differences.push({ property: "sample-validity", side, target, reason: state.reason, ...(state.hiddenAncestor ? { hiddenAncestor: state.hiddenAncestor } : {}), ...(state.dimensions ? { dimensions: state.dimensions } : {}) });
      return false;
    };
    const read = (node, properties) => {
      const style = getComputedStyle(node);
      return Object.fromEntries(properties.map((property) => [property, style[property]]));
    };
    const rect = (node) => {
      return layoutState(node).ok ? rawRect(node) : null;
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
      const required = [
        ["sample", "lockup", example],
        ["truth", "lockup", truth],
        ["sample", "mark", exampleMark],
        ["truth", "mark", truthMark],
        ["sample", "line", exampleLine],
        ["truth", "line", truthLine],
        ["truth", "brand-surface", brandSurface],
        ["truth", "sidebar-surface", sidebarSurface],
        ["truth", "topbar-surface", truthTopbarSurface],
        ["sample", "brand-surface", sampleBrandSurface],
        ["sample", "topbar-surface", sampleTopbarSurface]
      ];
      const missing = required.filter(([, , node]) => !node);
      const validity = Object.fromEntries(required.filter(([, , node]) => node).map(([side, target, node]) => [`${side}:${target}`, layoutState(node)]));
      const differences = [];
      if (missing.length > 0) {
        differences.push({
          property: "selector",
          document: Boolean(example && exampleMark && exampleLine && brandSurface && sampleBrandSurface && sampleTopbarSurface),
          package: Boolean(truth && truthMark && truthLine && sidebarSurface && truthTopbarSurface)
        });
      }
      for (const [side, target, node] of required) addSampleValidity(differences, node, side, target);
      const canMeasure = missing.length === 0 && required.every(([, , node]) => layoutState(node).ok);
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
      const measurements = {
        example: {
          selector: role.document,
          className: example?.className ?? null,
          assetId: example?.getAttribute("data-product-logo-asset-id") ?? null,
          mark: exampleMarkRect,
          firstLineFontSize: canMeasure && exampleLine ? getComputedStyle(exampleLine).fontSize : null,
          lockup: rect(example)
        },
        truth: {
          selector: role.package,
          className: truth?.className ?? null,
          assetId: truth?.getAttribute("data-product-logo-asset-id") ?? null,
          mark: truthMarkRect,
          firstLineFontSize: canMeasure && truthLine ? getComputedStyle(truthLine).fontSize : null,
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
        },
        validity
      };
      if (canMeasure) {
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
      const required = [
        ["sample", "brand", sampleBrand],
        ["sample", "sidebar", sampleSidebar],
        ["sample", "nav", sampleNav],
        ["truth", "brand", truthBrand],
        ["truth", "sidebar", truthSidebar],
        ["truth", "nav", truthNav]
      ];
      const missing = required.filter(([, , node]) => !node);
      const validity = Object.fromEntries(required.filter(([, , node]) => node).map(([side, target, node]) => [`${side}:${target}`, layoutState(node)]));
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
        truth: { brand: truthBrandRect, sidebar: truthSidebarRect, nav: truthNavRect, relations: truthRelations },
        validity
      };
      const differences = [];
      if (missing.length > 0) {
        differences.push({
          property: "relation-selector",
          sample: Boolean(sampleRelations),
          truth: Boolean(truthRelations)
        });
      }
      for (const [side, target, node] of required) addSampleValidity(differences, node, side, target);
      if (missing.length === 0 && required.every(([, , node]) => layoutState(node).ok) && (!sampleRelations || !truthRelations)) {
        differences.push({
          property: "relation-sample",
          sample: Boolean(sampleRelations),
          truth: Boolean(truthRelations)
        });
      } else {
        if (missing.length === 0 && required.every(([, , node]) => layoutState(node).ok)) {
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
      }
      return { id: role.id, document: role.document, package: role.package, measurements, differences, accepted: [], ok: differences.length === 0 };
    };
    const measureSampleShell = (role) => {
      const example = document.querySelector(role.document);
      const truth = document.querySelector(role.package);
      const differences = [];
      const accepted = [];
      const exampleValidity = layoutState(example);
      const truthValidity = layoutState(truth);
      const exampleRect = rect(example);
      const truthRect = rect(truth);
      const measurements = {
        example: {
          selector: role.document,
          className: example?.className ?? null,
          rect: exampleRect,
          styles: exampleValidity.ok ? read(example, role.properties) : null
        },
        truth: {
          selector: role.package,
          className: truth?.className ?? null,
          rect: truthRect,
          styles: truthValidity.ok ? read(truth, role.properties) : null
        },
        validity: { sample: exampleValidity, truth: truthValidity }
      };
      if (!example || !truth) {
        differences.push({ property: "selector", document: Boolean(example), package: Boolean(truth) });
      } else if (!exampleValidity.ok || !truthValidity.ok) {
        addSampleValidity(differences, example, "sample", "shell");
        addSampleValidity(differences, truth, "truth", "shell");
      } else if (role.id === "collapse-toggle") {
        const primitiveNode = document.querySelector(role.documentControl);
        if (role.primitiveAttribute && primitiveNode?.getAttribute(role.primitiveAttribute) !== role.primitiveValue) {
          differences.push({ property: "registered-primitive", document: primitiveNode?.getAttribute(role.primitiveAttribute) ?? null, package: role.primitiveValue, direction: "sample-lags" });
        }
        const exampleControl = document.querySelector(role.documentControl);
        const truthControl = document.querySelector(role.packageControl);
        const exampleText = document.querySelector(role.documentText);
        const truthText = document.querySelector(role.packageText);
        const controlTargets = [
          ["sample", "control", exampleControl],
          ["truth", "control", truthControl],
          ["sample", "text", exampleText],
          ["truth", "text", truthText]
        ];
        for (const [side, target, node] of controlTargets) addSampleValidity(differences, node, side, target);
        const controlsCanBeMeasured = controlTargets.every(([, , node]) => node && layoutState(node).ok);
        const exampleControlRect = rect(exampleControl);
        const truthControlRect = rect(truthControl);
        const exampleTextRect = rect(exampleText);
        const truthTextRect = rect(truthText);
        const exampleStyle = controlsCanBeMeasured ? getComputedStyle(exampleControl) : null;
        const truthStyle = controlsCanBeMeasured ? getComputedStyle(truthControl) : null;
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
        if (!controlsCanBeMeasured) {
          if (!exampleControl || !truthControl || !exampleText || !truthText) {
            differences.push({ property: "control-selector", document: Boolean(exampleControl && exampleText), package: Boolean(truthControl && truthText) });
          }
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
    const measureElementInventory = (role) => {
      const controlSelector = 'button, input, select, textarea, [role="button"], [role="combobox"]';
      const regionSelector = '[data-parity-region]';
      const tokenDefinitions = [
        ["search", /search/],
        ["theme", /theme|appearance|color[-_ ]?scheme/],
        ["locale", /locale|language/],
        ["collapse", /collapse|expand.*navigation|navigation.*expand|side[-_ ]?nav[-_ ]?collapse/],
        ["nav-group", /nav[-_ ]?group|navigation.*group/],
        ["topbar", /topbar|global[-_ ]?bar|top[-_ ]?bar/],
        ["sidebar", /sidebar|side[-_ ]?nav/],
        ["groups", /groups/],
        ["brand", /brand|product[-_ ]?logo/],
        ["actions", /actions|controls/],
        ["module", /module/]
      ];
      const textSignals = (node) => [
        node.getAttribute("data-parity-name"),
        node.getAttribute("data-navigation-primitive"),
        node.getAttribute("data-registered-shell-primitive"),
        node.getAttribute("aria-label"),
        node.getAttribute("title"),
        node.getAttribute("placeholder"),
        node.getAttribute("class"),
        node.getAttribute("name"),
        node.getAttribute("type")
      ].filter(Boolean).join(" ").toLowerCase();
      const semanticName = (node, kind) => {
        const signal = textSignals(node);
        return tokenDefinitions.find(([, pattern]) => pattern.test(signal))?.[0]
          ?? `${kind}-${node.tagName.toLowerCase()}${node.getAttribute("role") ? `-${node.getAttribute("role")}` : ""}${node.getAttribute("type") ? `-${node.getAttribute("type")}` : ""}`;
      };
      const relativeGeometry = (nodeRect, parentRect) => {
        const width = Math.max(parentRect.width, 1);
        const height = Math.max(parentRect.height, 1);
        return {
          left: Number(((nodeRect.left - parentRect.left) / width).toFixed(4)),
          top: Number(((nodeRect.top - parentRect.top) / height).toFixed(4)),
          width: Number((nodeRect.width / width).toFixed(4)),
          height: Number((nodeRect.height / height).toFixed(4))
        };
      };
      const inventoryForSide = (rootDefinitions, side) => {
        const items = [];
        const failures = [];
        const missingRoots = [];
        for (const rootDefinition of rootDefinitions) {
          const root = document.querySelector(rootDefinition.selector);
          if (!root) {
            missingRoots.push({ root: rootDefinition.id, selector: rootDefinition.selector });
            continue;
          }
          const rootState = layoutState(root);
          if (!rootState.ok) {
            failures.push({ side, root: rootDefinition.id, target: "root", reason: rootState.reason, ...(rootState.hiddenAncestor ? { hiddenAncestor: rootState.hiddenAncestor } : {}), ...(rootState.dimensions ? { dimensions: rootState.dimensions } : {}) });
            continue;
          }
          const parentRect = rawRect(root);
          const seen = new Set();
          const occurrences = new Map();
          const add = (node, kind, rootKey) => {
            if (seen.has(node)) return;
            seen.add(node);
            const state = layoutState(node);
            if (!state.ok) {
              if (state.reason !== "hidden-ancestor") {
                failures.push({ side, root: rootDefinition.id, target: `${kind}:${semanticName(node, kind)}`, reason: state.reason, ...(state.dimensions ? { dimensions: state.dimensions } : {}) });
              }
              return;
            }
            const nodeRect = rawRect(node);
            let container = node;
            if (node !== root) {
              container = node.parentElement ?? root;
              while (container.parentElement && container.parentElement !== root) container = container.parentElement;
            }
            const containerRect = rawRect(container);
            const name = semanticName(node, kind);
            const occurrenceKey = `${kind}:${name}`;
            const occurrence = (occurrences.get(occurrenceKey) ?? 0) + 1;
            occurrences.set(occurrenceKey, occurrence);
            const key = `${rootKey}/${kind}:${name}#${occurrence}`;
            items.push({
              key,
              root: rootDefinition.id,
              kind,
              name,
              tagName: node.tagName.toLowerCase(),
              role: node.getAttribute("role"),
              className: node.getAttribute("class"),
              source: textSignals(node),
              rect: nodeRect,
              rootRect: parentRect,
              containerRect,
              relative: relativeGeometry(nodeRect, parentRect)
            });
          };
          add(root, "region", `${rootDefinition.id}/root`);
          if (rootDefinition.includeControls !== false) {
            for (const node of root.querySelectorAll(controlSelector)) add(node, "control", rootDefinition.id);
          }
          for (const node of root.querySelectorAll(regionSelector)) add(node, "region", rootDefinition.id);
        }
        return { items, failures, missingRoots };
      };
      const sample = inventoryForSide(role.sampleRoots, "sample");
      const truth = inventoryForSide(role.truthRoots, "truth");
      const sampleByKey = new Map(sample.items.map((item) => [item.key, item]));
      const truthByKey = new Map(truth.items.map((item) => [item.key, item]));
      const onlyInSample = sample.items.filter((item) => !truthByKey.has(item.key));
      const onlyInTruth = truth.items.filter((item) => !sampleByKey.has(item.key));
      const sameName = [];
      const outliers = [];
      for (const [key, sampleItem] of sampleByKey) {
        const truthItem = truthByKey.get(key);
        if (!truthItem) continue;
        const size = {
          width: Number((sampleItem.rect.width - truthItem.rect.width).toFixed(2)),
          height: Number((sampleItem.rect.height - truthItem.rect.height).toFixed(2))
        };
        const position = sampleItem.kind === "control"
          ? {
            rootRight: Number(((sampleItem.rootRect.right - sampleItem.rect.right) - (truthItem.rootRect.right - truthItem.rect.right)).toFixed(2)),
            containerRight: Number(((sampleItem.containerRect.right - sampleItem.rect.right) - (truthItem.containerRect.right - truthItem.rect.right)).toFixed(2)),
            top: Number((sampleItem.relative.top - truthItem.relative.top).toFixed(4))
          }
          : {
            left: Number((sampleItem.relative.left - truthItem.relative.left).toFixed(4)),
            top: Number((sampleItem.relative.top - truthItem.relative.top).toFixed(4))
          };
        const normalizedSize = {
          width: Number((sampleItem.relative.width - truthItem.relative.width).toFixed(4)),
          height: Number((sampleItem.relative.height - truthItem.relative.height).toFixed(4))
        };
        const sizeOutlier = sampleItem.kind === "control"
          ? Math.abs(size.width) > 0.5 || Math.abs(size.height) > 0.5
          : Math.abs(normalizedSize.width) > 0.02 || Math.abs(normalizedSize.height) > 0.02;
        const positionOutlier = sampleItem.kind === "control"
          ? sampleItem.name !== "collapse"
            && (Math.abs(position.rootRight) > (sampleItem.name === "search" ? 24.5 : 2.5) || Math.abs(position.top) > 0.02)
          : Math.abs(position.left) > 0.01 || Math.abs(position.top) > 0.01;
        const comparison = { key, kind: sampleItem.kind, name: sampleItem.name, sample: { rect: sampleItem.rect, relative: sampleItem.relative }, truth: { rect: truthItem.rect, relative: truthItem.relative }, size, normalizedSize, position, sizeOutlier, positionOutlier };
        sameName.push(comparison);
        if (sizeOutlier || positionOutlier) outliers.push(comparison);
      }
      const differences = [];
      for (const item of onlyInSample) differences.push({ property: "inventory-only-in-sample", key: item.key, kind: item.kind, name: item.name, source: item.source });
      for (const item of onlyInTruth) differences.push({ property: "inventory-only-in-truth", key: item.key, kind: item.kind, name: item.name, source: item.source });
      for (const failure of [...sample.failures, ...truth.failures]) differences.push({ property: "sample-validity", ...failure });
      for (const missing of sample.missingRoots) differences.push({ property: "inventory-selector", side: "sample", ...missing });
      for (const missing of truth.missingRoots) differences.push({ property: "inventory-selector", side: "truth", ...missing });
      for (const outlier of outliers) differences.push({ property: outlier.sizeOutlier ? "inventory-size-outlier" : "inventory-position-outlier", ...outlier });
      const topbarSummary = (items) => {
        const controls = items.filter((item) => item.root === "topbar" && item.kind === "control");
        const root = items.find((item) => item.root === "topbar" && item.kind === "region" && item.key.endsWith("/region:topbar#1"));
        const rightEdge = controls.length > 0 ? Math.max(...controls.map((item) => item.rect.right)) : null;
        const search = controls.find((item) => item.name === "search");
        return {
          controlCount: controls.length,
          controlNames: controls.map((item) => item.name),
          searchInnerWidth: search?.rect.width ?? null,
          controlAreaRightMargin: root && rightEdge !== null ? Number((root.rect.right - rightEdge).toFixed(2)) : null
        };
      };
      return {
        id: role.id,
        kind: role.kind,
        sampleRoots: role.sampleRoots,
        truthRoots: role.truthRoots,
        measurements: {
          sample: sample.items,
          truth: truth.items,
          onlyInSample,
          onlyInTruth,
          sameName,
          outliers,
          samplingFailures: [...sample.failures, ...truth.failures],
          topbar: {
            sample: topbarSummary(sample.items),
            truth: topbarSummary(truth.items)
          }
        },
        differences,
        accepted: [],
        ok: differences.length === 0
      };
    };
    const measureVisibleStringSources = (role) => {
      const controlSelector = 'button, input, select, textarea, [role="button"], [role="combobox"], img';
      const userFacingAttribute = (name) => {
        const normalized = name.toLowerCase();
        if (normalized.startsWith("data-i18n-")) return false;
        return /(?:aria-label|placeholder|title|alt|(?:^|-)label$|(?:^|-)placeholder$|(?:^|-)title$|(?:^|-)alt$)/u.test(normalized);
      };
      const sourceFor = (node, kind) => {
        const markerName = kind === "text" ? "data-i18n" : `data-i18n-${kind}`;
        const marker = node.getAttribute(markerName);
        if (marker) return { kind: "storybook-locale", key: marker };
        const controlMarker = node.getAttribute("data-i18n-aria-label") ?? node.getAttribute("data-i18n-title");
        if (controlMarker && kind.startsWith("data-")) return { kind: "storybook-locale", key: controlMarker };
        const localeRoot = node.closest(".tcrn-shell-locale-menu");
        const localeMarker = localeRoot?.getAttribute(`data-i18n-${kind}`) ?? localeRoot?.getAttribute("data-i18n-aria-label") ?? localeRoot?.getAttribute("data-i18n-title");
        if (localeMarker) return { kind: "storybook-locale", key: localeMarker };
        const themeKey = node.closest("[data-theme-label-key]")?.getAttribute("data-theme-label-key");
        if (themeKey && (kind === "aria-label" || kind === "title")) return { kind: "storybook-locale", key: themeKey };
        const localeMenu = node.closest(".tcrn-shell-locale-menu");
        if (localeMenu && (kind === "text" || node.matches("[data-locale-current-name], [data-locale-current]"))) {
          const selected = localeMenu.querySelector('[data-locale-menu-option][aria-current="true"]');
          return { kind: "tcrn-locale-metadata", key: selected?.getAttribute("data-locale") ?? document.documentElement.lang };
        }
        if (node.matches("img") && node.closest("[data-registered-product-logo]")) return { kind: "registered-brand-asset", key: "tcrn-brand-mark" };
        return { kind: "literal", key: null };
      };
      const semanticName = (node) => {
        const signal = [
          node.getAttribute("data-shell-control"),
          node.getAttribute("data-package-backed-shell-control"),
          node.getAttribute("data-locale-control"),
          node.getAttribute("data-theme-label-key"),
          node.getAttribute("aria-label"),
          node.getAttribute("placeholder"),
          node.getAttribute("class"),
          node.tagName.toLowerCase()
        ].filter(Boolean).join(" ").toLowerCase();
        return signal.includes("search") ? "search"
          : signal.includes("theme") ? "theme"
            : signal.includes("locale") || signal.includes("language") ? "locale"
              : signal.includes("collapse") || signal.includes("side-nav") ? "collapse"
                : signal.includes("brand") || signal.includes("product-logo") || node.matches("img") ? "brand"
                  : `${node.tagName.toLowerCase()}-${node.getAttribute("role") ?? "element"}`;
      };
      const visible = (node) => {
        if (!layoutState(node).ok) return false;
        if (node.closest('[aria-hidden="true"]')) return false;
        const className = node.getAttribute("class") ?? "";
        if (/(?:sr-only|icon-button__label)/u.test(className)) return false;
        return true;
      };
      const collect = (rootDefinitions, side) => {
        const items = [];
        const failures = [];
        const missingRoots = [];
        for (const rootDefinition of rootDefinitions) {
          const root = document.querySelector(rootDefinition.selector);
          if (!root) {
            missingRoots.push({ root: rootDefinition.id, selector: rootDefinition.selector });
            continue;
          }
          if (!layoutState(root).ok) {
            failures.push({ side, root: rootDefinition.id, reason: layoutState(root).reason });
            continue;
          }
          const nodes = [...root.querySelectorAll(controlSelector)];
          const seen = new Set();
          for (const node of nodes) {
            if (seen.has(node) || !visible(node)) continue;
            seen.add(node);
            const semantic = semanticName(node);
            for (const attribute of [...node.attributes].filter((candidate) => userFacingAttribute(candidate.name))) {
              const value = attribute.value.trim();
              if (!value) continue;
              const source = sourceFor(node, attribute.name);
              items.push({
                key: `${rootDefinition.id}/${semantic}/attribute:${attribute.name}`,
                side,
                semantic,
                kind: attribute.name,
                value,
                source,
              });
            }
            const textNodes = [node, ...node.querySelectorAll("*")].filter((candidate) => candidate.children.length === 0 && candidate.textContent?.trim() && visible(candidate));
            for (const textNode of textNodes) {
              const value = textNode.textContent.trim();
              const source = sourceFor(textNode, "text");
              items.push({
                key: `${rootDefinition.id}/${semanticName(textNode)}/visible-text`,
                side,
                semantic: semanticName(textNode),
                kind: "visible-text",
                value,
                source,
              });
            }
          }
        }
        return { items, failures, missingRoots };
      };
      const sample = collect(role.sampleRoots, "sample");
      const truth = collect(role.truthRoots, "truth");
      const sampleByKey = new Map(sample.items.map((item) => [item.key, item]));
      const truthByKey = new Map(truth.items.map((item) => [item.key, item]));
      const onlyInSample = sample.items.filter((item) => !truthByKey.has(item.key));
      const onlyInTruth = truth.items.filter((item) => !sampleByKey.has(item.key));
      const sameName = [];
      const differences = [];
      const accepted = [];
      const addDifference = (difference) => {
        const exception = exceptionTable.find((candidate) => candidate.role === role.id && candidate.property === difference.property);
        if (exception) {
          accepted.push({ role: role.id, property: difference.property, reason: exception.reason, acceptedAt: exception.acceptedAt });
          return;
        }
        differences.push(difference);
      };
      for (const item of onlyInSample) addDifference({ property: "visible-string-only-in-sample", key: item.key, value: item.value, source: item.source });
      for (const item of onlyInTruth) addDifference({ property: "visible-string-only-in-truth", key: item.key, value: item.value, source: item.source });
      for (const failure of [...sample.failures, ...truth.failures]) addDifference({ property: "sample-validity", ...failure });
      for (const missing of sample.missingRoots) addDifference({ property: "string-source-selector", side: "sample", ...missing });
      for (const missing of truth.missingRoots) addDifference({ property: "string-source-selector", side: "truth", ...missing });
      for (const [key, sampleItem] of sampleByKey) {
        const truthItem = truthByKey.get(key);
        if (!truthItem) continue;
        const sourceEqual = sampleItem.source.kind === truthItem.source.kind && sampleItem.source.key === truthItem.source.key;
        const valueEqual = sampleItem.value === truthItem.value;
        const comparison = { key, semantic: sampleItem.semantic, kind: sampleItem.kind, sample: { value: sampleItem.value, source: sampleItem.source }, truth: { value: truthItem.value, source: truthItem.source }, sourceEqual, valueEqual };
        sameName.push(comparison);
        if (!sourceEqual) addDifference({ property: "visible-string-source", ...comparison });
        if (!valueEqual) addDifference({ property: "visible-string-value", ...comparison });
        if (sampleItem.source.kind === "literal" || truthItem.source.kind === "literal") addDifference({ property: "visible-string-unbound", ...comparison });
      }
      return {
        id: role.id,
        kind: role.kind,
        sampleRoots: role.sampleRoots,
        truthRoots: role.truthRoots,
        measurements: { sample: sample.items, truth: truth.items, onlyInSample, onlyInTruth, sameName, samplingFailures: [...sample.failures, ...truth.failures] },
        differences,
        accepted,
        ok: differences.length === 0,
      };
    };
    const results = roleTable.map((role) => {
      if (role.kind === "brand-lockup") return measureBrandLockup(role);
      if (role.kind === "sample-shell-relations") return measureSampleShellRelations(role);
      if (role.kind === "sample-shell") return measureSampleShell(role);
      if (role.kind === "element-inventory") return measureElementInventory(role);
      if (role.kind === "visible-string-source") return measureVisibleStringSources(role);
      const documentNode = document.querySelector(role.document);
      const packageNode = document.querySelector(storySelector)?.querySelector(role.package);
      const differences = [];
      const accepted = [];
      if (!documentNode || !packageNode) {
        differences.push({ property: "selector", document: Boolean(documentNode), package: Boolean(packageNode) });
      } else if (!layoutState(documentNode).ok || !layoutState(packageNode).ok) {
        addSampleValidity(differences, documentNode, "sample", role.document);
        addSampleValidity(differences, packageNode, "truth", role.package);
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
    const stringSourceRole = sampleShellRoles.find((role) => role.id === "string-source");
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
      if (role.kind === "element-inventory") {
        const inventoryTarget = `${sampleShellRoot} .tcrn-knowledge-shell__brand-cell button`;
        await page.evaluate((selector) => document.querySelector(selector)?.setAttribute("hidden", ""), inventoryTarget);
        await settle(page);
        const inventoryMutated = await measureParity(page, [role]);
        await page.evaluate((selector) => document.querySelector(selector)?.removeAttribute("hidden"), inventoryTarget);
        await settle(page);
        const inventoryRestored = await measureParity(page, [role]);
        sampleShellMutations[role.id] = {
          mutation: `${inventoryTarget}[hidden]`,
          mutated: inventoryMutated,
          restored: inventoryRestored
        };
        continue;
      }
      if (role.kind === "visible-string-source") {
        const localeRootSelector = `${sampleShellRoot} .tcrn-shell-locale-menu`;
        const originalSource = await page.locator(localeRootSelector).getAttribute("data-i18n-aria-label");
        await page.locator(localeRootSelector).evaluate((node) => node.setAttribute("data-i18n-aria-label", "shell.searchLabel"));
        await settle(page);
        const sourceMutated = await measureParity(page, [role]);
        await page.locator(localeRootSelector).evaluate((node, value) => {
          if (value === null) node.removeAttribute("data-i18n-aria-label");
          else node.setAttribute("data-i18n-aria-label", value);
        }, originalSource);
        await settle(page);
        const sourceRestored = await measureParity(page, [role]);
        sampleShellMutations[role.id] = {
          mutation: `${localeRootSelector}[data-i18n-aria-label=shell.searchLabel]`,
          mutated: sourceMutated,
          restored: sourceRestored,
          sourceMutation: { mutated: sourceMutated, restored: sourceRestored }
        };
        continue;
      }
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
    const samplingValidityRole = sampleShellRoles.find((role) => role.id === "nav-item");
    const samplingValidityTarget = samplingValidityRole.document;
    const samplingValidityProbeTarget = await page.evaluate((selector) => {
      const node = document.querySelector(selector);
      const ancestor = node?.closest('[data-navigation-primitive="nav-group"]') ?? node?.parentElement;
      ancestor?.setAttribute("hidden", "");
      return ancestor ? { selector, ancestor: ancestor.className || ancestor.tagName.toLowerCase() } : null;
    }, samplingValidityTarget);
    await settle(page);
    const samplingValidityProbe = await measureParity(page, [samplingValidityRole]);
    await page.evaluate((selector) => {
      const node = document.querySelector(selector);
      const ancestor = node?.closest('[data-navigation-primitive="nav-group"]') ?? node?.parentElement;
      ancestor?.removeAttribute("hidden");
    }, samplingValidityTarget);
    await settle(page);
    const samplingValidityRestored = await measureParity(page, [samplingValidityRole]);
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
    const stringSourceLocales = await page.evaluate(() => [...document.querySelectorAll(".tcrn-doc-locale-control-slot [data-locale-menu-option]")]
      .map((node) => node.getAttribute("data-locale"))
      .filter((locale, index, all) => typeof locale === "string" && all.indexOf(locale) === index));
    const stringSourceMatrix = [];
    for (const locale of stringSourceLocales) {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`${server.origin}/components-navigation-shells.html?theme=light&locale=${locale}#navigation-product-shell-spec`);
      await settle(page);
      await expandAllStories(page);
      stringSourceMatrix.push({ locale, ...(await measureParity(page, [stringSourceRole])) });
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
    const stringSourceMutationRoot = `${sampleShellRoot} .tcrn-shell-locale-menu`;
    const stringSourceOriginalMarker = await page.locator(stringSourceMutationRoot).getAttribute("data-i18n-aria-label");
    await page.locator(stringSourceMutationRoot).evaluate((node) => node.setAttribute("data-i18n-aria-label", "shell.searchLabel"));
    await settle(page);
    const stringSourceEmptyExceptionProbe = await measureParity(page, [stringSourceRole], []);
    const stringSourceExceptionProbe = await measureParity(page, [stringSourceRole], [{
      role: "string-source",
      property: "visible-string-source",
      acceptedAt: "synthetic-proof",
      reason: "SYNTHETIC_STRING_SOURCE_EXCEPTION"
    }]);
    await page.locator(stringSourceMutationRoot).evaluate((node, value) => {
      if (value === null) node.removeAttribute("data-i18n-aria-label");
      else node.setAttribute("data-i18n-aria-label", value);
    }, stringSourceOriginalMarker);
    await settle(page);
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
        stringSourceMatrix,
        viewportMatrix: sampleShellViewportMatrix,
        mutations: sampleShellMutations
      },
      exceptionProbe: {
        ok: exceptionProbe.roles.find((role) => role.id === "locale")?.ok === true
          && exceptionProbe.acceptedExceptions.some((entry) => entry.reason === "SYNTHETIC_EXCEPTION_PATH"),
        acceptedExceptions: exceptionProbe.acceptedExceptions
      },
      stringSourceExceptionProbe: {
        empty: {
          ok: !stringSourceEmptyExceptionProbe.ok,
          differences: stringSourceEmptyExceptionProbe.roles.flatMap((role) => role.differences)
        },
        accepted: {
          ok: stringSourceExceptionProbe.roles.find((role) => role.id === "string-source")?.ok === true
            && stringSourceExceptionProbe.acceptedExceptions.some((entry) => entry.reason === "SYNTHETIC_STRING_SOURCE_EXCEPTION"),
          acceptedExceptions: stringSourceExceptionProbe.acceptedExceptions
        }
      },
      relationPreRepair: {
        ok: !relationPreRepair.ok,
        differences: relationPreRepair.roles.flatMap((role) => role.differences)
      },
      samplingValidity: {
        target: samplingValidityProbeTarget,
        failed: samplingValidityProbe,
        restored: samplingValidityRestored,
        ok: !samplingValidityProbe.ok
          && samplingValidityProbe.roles.some((role) => role.differences.some((difference) => difference.property === "sample-validity"))
          && samplingValidityRestored.ok
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
          ...(role.id === "string-source" ? {
            sourceMutationRed: !sampleShellMutations[role.id].sourceMutation.mutated.ok,
            sourceRestoredGreen: sampleShellMutations[role.id].sourceMutation.restored.ok
          } : {}),
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
      && result.stringSourceExceptionProbe.empty.ok
      && result.stringSourceExceptionProbe.accepted.ok
      && result.relationPreRepair.ok
      && result.samplingValidity.ok
      && result.emptyExceptionProbe.ok
      && brandMatrix.every((entry) => entry.ok)
      && !brandMutated.ok
      && brandRestored.ok
      && sampleShellRoles.every((role) => baseline.roles.find((candidate) => candidate.id === role.id)?.ok)
      && sampleLocaleMatrix.every((entry) => entry.ok)
      && sampleNetGapMatrix.every((entry) => entry.ok && entry.roles[0].measurements.controls.example.textGap >= 7)
      && stringSourceMatrix.every((entry) => entry.ok)
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
