#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0

import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, normalize, relative, resolve } from "node:path";
import { chromium } from "@playwright/test";

const staticRoot = resolve("apps/storybook/storybook-static");
// The package side is the top-band ProductShell (TCRN-DS-SUB-121): the shell-top-band story, the 07a
// board's section A. Its first screen (ts-closed-l) carries the band and the paper; the full-menu
// screen (ts-x-l) carries what the side rail and the top bar used to hold (the menu groups, their
// titles and rows, the search and the current position); the locale menu sits in the avatar menu, which
// the ProductShell contract story shows open (a role's packageStory names that story). The document
// side is the documentation page's own top-band ProductShell (TCRN-DS-SUB-131, SUB-132): its root
// [data-shell="doc"], band, paper, full menu [data-shell-menu] and avatar menu [data-panel="account"].
// The two menus are hidden until the page script opens them, so a role's documentLayer names the layer
// measureParity opens through window.tcrnDocShellLayers before it reads that role, and closes after.
// The stories render inside the documentation page's paper, so a document selector names the shell's own
// layer with :not([data-paper] *) — a story's band, menu or avatar menu inside the paper never matches it.
//
// TCRN-DS-SUB-168 (STORY-147, judgment §3.4 item 1): the ten sample roles (the brand lockup and the
// knowledge-base sample shell's collapse toggle, top bar, side rail, group container, shell relations,
// nav item, group title, element inventory and string sources) compared the old standalone TopBar and
// SideNav sample with the old documentation rail. Both sides are the top-band ProductShell now and
// none of those surfaces exists on either, so the roles are retired rather than redefined; the shell
// layer gate (shell-measure) holds the sample against the real part. Their probes went with them: the
// sampling-validity probe now hides the full-menu search, and the empty-exception probe reads the
// locale mutation with an empty table, which is the production table now.
const docShell = '[data-shell="doc"]';
const docOwn = (layer) => `${docShell} ${layer}:not([data-paper] *)`;
const route = "/components-navigation-shells.html?theme=light&locale=en#shell-top-band";
const packageStorySelector = 'article[data-story-id="shell-top-band"]';
const expectedParityRoleCount = 9;
// The retired sample roles, named in the report so a reader can see they are gone on purpose.
const retiredSampleRoles = ["brand-lockup", "collapse-toggle", "topbar", "sidebar", "group-container", "shell-relations", "nav-item", "group-title", "element-inventory", "string-source"];
export const parityRoles = [
  { id: "canvas", document: docShell, package: '[data-shell="ts-closed-l"]', authority: "package", properties: ["backgroundColor"] },
  { id: "top-band", document: docOwn("[data-shell-strip]"), package: '[data-shell="ts-closed-l"] [data-shell-strip]', authority: "package", properties: ["gap", "minHeight", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft"] },
  { id: "menu-group-spacing", document: `${docOwn("[data-shell-menu]")} [data-shell-cols]`, documentLayer: "menu", package: '[data-shell="ts-x-l"] [data-shell-cols]', authority: "package", properties: ["gap"] },
  { id: "package-group-title", document: `${docOwn("[data-shell-menu]")} [data-shell-group] > .tcrn-nav-group__label`, documentLayer: "menu", package: '[data-shell="ts-x-l"] [data-shell-group] > .tcrn-nav-group__label', authority: "package", properties: ["fontSize", "fontWeight", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft"] },
  { id: "breadcrumb", document: `${docOwn("[data-shell-menu]")} [data-shell-pbar] nav .tcrn-shell-menu__crumb--current`, documentLayer: "menu", package: '[data-shell="ts-x-l"] [data-shell-pbar] nav .tcrn-shell-menu__crumb--current', authority: "package", properties: ["fontSize"] },
  { id: "search", document: `${docOwn("[data-shell-menu]")} [data-shell-search] .tcrn-search-input`, documentLayer: "menu", package: '[data-shell="ts-x-l"] [data-shell-search] .tcrn-search-input', authority: "package", properties: ["borderTopWidth", "borderTopStyle", "borderRadius", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft"] },
  { id: "locale", document: `${docOwn('[data-panel="account"]')} .tcrn-shell-locale-menu__trigger`, documentLayer: "account", package: '[data-panel="account"] .tcrn-shell-locale-menu__trigger', packageStory: "navigation-product-shell-spec", authority: "package", properties: ["borderTopWidth", "borderTopStyle", "borderRadius", "minHeight", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft"] },
  { id: "paper", document: docOwn("[data-paper]"), package: '[data-shell="ts-closed-l"] [data-paper]', authority: "document", properties: ["backgroundColor"] },
  { id: "package-nav-item", document: `${docOwn("[data-shell-menu]")} [data-shell-row]`, documentLayer: "menu", package: '[data-shell="ts-x-l"] [data-shell-row]', authority: "document", rowBox: true, properties: ["minHeight", "fontSize", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft"] }
];
// The row box (TCRN-DS-SUB-197, R3-5). The board draws a menu row as one box, .ts-it, padded 0 4 0 8
// with its 12.5px text; the documentation menu's rows are plain rows, the link .tcrn-nav-item drawn the
// same way, while the full-menu screen's rows can be pinned, so the link sits in a .tcrn-nav-item-row
// wrapper that holds the pin and the row's right inset (link 0, wrapper 4). A rowBox role therefore
// reads each side's row by its own kind, then pairs the two: a plain row is its own box; a pinnable
// row's box is the wrapper, and each padding is the wrapper's plus the link's on a side where the link
// lies against the wrapper's content edge (left, top and bottom; on the right the pin sits between).
// fontSize and minHeight stay the link's, where the row's text is; the wrapper's font size is the
// menu's, inherited, and sizes no text. Fields and the exact-match comparison are unchanged.
export const pinnableRowWrapper = "tcrn-nav-item-row";

// The production exception table is explicit and, since the sample roles retired (their one entry
// kept the sample NavItem's radius), empty; empty-table behavior is exercised by emptyExceptionProbe
// below rather than treated as a disabled gate.
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
  await addCssMutation(page, `${packageStorySelector} [data-shell-row] { font-size: 99px !important; }`);
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
  return page.evaluate(({ roles: roleTable, exceptionTable, storySelector, enforceRoleCount, expectedRoleCount, wrapperClass }) => {
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
    // A row read as its row box (see pinnableRowWrapper): plain rows are their own box; a pinnable
    // row's paddings are the wrapper's plus the link's on each side where the link meets the wrapper's
    // content edge (within 0.5px), its other fields the link's.
    const sides = ["Top", "Right", "Bottom", "Left"];
    const readRow = (node, properties) => {
      const wrapper = node.parentElement?.classList.contains(wrapperClass) ? node.parentElement : null;
      if (!wrapper) return { kind: "plain", values: read(node, properties) };
      const item = getComputedStyle(node);
      const box = getComputedStyle(wrapper);
      const itemRect = node.getBoundingClientRect();
      const boxRect = wrapper.getBoundingClientRect();
      const inset = (side) => Number.parseFloat(box[`border${side}Width`]) + Number.parseFloat(box[`padding${side}`]);
      const flush = {
        Top: Math.abs(itemRect.top - (boxRect.top + inset("Top"))) <= 0.5,
        Right: Math.abs(itemRect.right - (boxRect.right - inset("Right"))) <= 0.5,
        Bottom: Math.abs(itemRect.bottom - (boxRect.bottom - inset("Bottom"))) <= 0.5,
        Left: Math.abs(itemRect.left - (boxRect.left + inset("Left"))) <= 0.5
      };
      const values = Object.fromEntries(properties.map((property) => {
        const side = sides.find((candidate) => property === `padding${candidate}`);
        if (!side) return [property, item[property]];
        const own = Number.parseFloat(box[property]);
        const inner = flush[side] ? Number.parseFloat(item[property]) : 0;
        return [property, `${Number((own + inner).toFixed(3))}px`];
      }));
      return { kind: "pinnable", values, flush };
    };
    const documentLayers = window.tcrnDocShellLayers;
    const setDocumentLayer = (layer, open) => {
      if (!layer || !documentLayers) return;
      (layer === "account" ? documentLayers.setAccount : documentLayers.setMenu)(open);
    };
    const results = roleTable.map((role) => {
      setDocumentLayer(role.documentLayer, true);
      try {
        return measureRole(role);
      } finally {
        setDocumentLayer(role.documentLayer, false);
      }
    });
    function measureRole(role) {
      const documentNode = document.querySelector(role.document);
      const packageRoot = document.querySelector(role.packageStory ? `article[data-story-id="${role.packageStory}"]` : storySelector);
      const packageNode = packageRoot?.querySelector(role.package);
      const differences = [];
      const accepted = [];
      let rowBoxes = null;
      if (!documentNode || !packageNode) {
        differences.push({ property: "selector", document: Boolean(documentNode), package: Boolean(packageNode) });
      } else if (!layoutState(documentNode).ok || !layoutState(packageNode).ok) {
        addSampleValidity(differences, documentNode, "sample", role.document);
        addSampleValidity(differences, packageNode, "truth", role.package);
      } else {
        const documentRow = role.rowBox ? readRow(documentNode, role.properties) : null;
        const packageRow = role.rowBox ? readRow(packageNode, role.properties) : null;
        if (role.rowBox) rowBoxes = { document: documentRow, package: packageRow };
        const documentValues = documentRow ? documentRow.values : read(documentNode, role.properties);
        const packageValues = packageRow ? packageRow.values : read(packageNode, role.properties);
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
      return { id: role.id, document: role.document, package: role.package, ...(rowBoxes ? { rowBoxes } : {}), differences, accepted, ok: differences.length === 0 };
    }
    return {
      roleCount: results.length,
      roles: results,
      acceptedExceptions: results.flatMap((result) => result.accepted),
      ok: results.length === roleTable.length
        && (!enforceRoleCount || roleTable.length === expectedRoleCount)
        && results.every((result) => result.ok)
    };
  }, { roles, exceptionTable: exceptions, storySelector: packageStorySelector, enforceRoleCount: roles === parityRoles, expectedRoleCount: expectedParityRoleCount, wrapperClass: pinnableRowWrapper });
}

// Compare actual content edges, not padding strings. On the top-band documentation shell
// (TCRN-DS-SUB-131) the current location is the page header's breadcrumb in the paper, the content is
// the paper's scroll container #content, and the page head is the governance section of the page body.
// Every story renders inside that paper, so the readings name the page's own #content and its direct
// page header rather than any [data-paper] (a story shell's paper is nested in the page's).
// Missing/hidden samples fail.
async function measureDocumentContentEdge(page) {
  return page.evaluate(() => {
    const location = document.querySelector('[data-shell="doc"] #content > .tcrn-page-header .tcrn-breadcrumb');
    const content = document.querySelector('[data-shell="doc"] #content');
    const heading = document.querySelector('[data-shell="doc"] .tcrn-doc-page-head');
    // The page body is the centred 1040 column (TCRN-DS-SUB-130, SUB-131); the page head starts on its edge.
    const column = document.querySelector('[data-shell="doc"] .tcrn-doc-page__body');
    if (!location || !content || !heading || !column) return { ok: false, reason: "missing-surface" };
    const locationRect = location.getBoundingClientRect();
    const headingRect = heading.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    const style = getComputedStyle(content);
    const contentLeft = contentRect.left + parseFloat(style.borderLeftWidth) + parseFloat(style.paddingLeft);
    const delta = locationRect.left - contentLeft;
    const columnRect = column.getBoundingClientRect();
    const columnStyle = getComputedStyle(column);
    const columnLeft = columnRect.left + parseFloat(columnStyle.borderLeftWidth) + parseFloat(columnStyle.paddingLeft);
    return {
      ok: locationRect.width > 0 && locationRect.height > 0 && headingRect.width > 0
        && Math.abs(delta) <= 1 && Math.abs(headingRect.left - columnLeft) <= 1,
      locationLeft: locationRect.left, contentLeft, headingLeft: headingRect.left, columnLeft, delta
    };
  });
}

async function documentContentEdgeProof(page, origin) {
  const matrix = [];
  for (const locale of ["en", "zh-CN", "ja", "ko", "fr"]) {
    for (const theme of ["light", "dark"]) {
      for (const width of [195, 390, 760, 1024, 1440, 1920]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`${origin}/style-guide.html?theme=${theme}&locale=${locale}`);
        // The top-band shell has no side rail to collapse (MIN-20261013-SHELL D1), so each cell is read once.
        await settle(page);
        await page.evaluate(async () => {
          const node = document.querySelector('[data-shell="doc"]');
          if (!node) return;
          await Promise.all(node.getAnimations({ subtree: true })
            .filter((animation) => animation.effect?.getComputedTiming().iterations !== Infinity)
            .map((animation) => animation.finished.catch(() => {})));
        });
        matrix.push({ locale, theme, width, ...(await measureDocumentContentEdge(page)) });
      }
    }
  }
  const negative = [];
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${origin}/style-guide.html?theme=light&locale=en`);
    await settle(page);
    // Recreate the consumer's extra nested inset; the shared package is untouched.
    await addCssMutation(page, '[data-shell="doc"] #content > .tcrn-page-header { padding-left: 48px !important; }');
    const mutated = await measureDocumentContentEdge(page);
    await removeMutation(page);
    await settle(page);
    const restored = await measureDocumentContentEdge(page);
    negative.push({ width, mutated, restored, ok: !mutated.ok && restored.ok });
  }
  return { matrix, negative, ok: matrix.every((entry) => entry.ok) && negative.every((entry) => entry.ok) };
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
    // A hidden sample cannot pass: the package search of the full-menu screen is hidden under its
    // search region, and the role has to report sample-validity instead of comparing nothing.
    const samplingValidityRole = parityRoles.find((role) => role.id === "search");
    const samplingValidityTarget = `${packageStorySelector} ${samplingValidityRole.package}`;
    const samplingValidityProbeTarget = await page.evaluate((selector) => {
      const node = document.querySelector(selector);
      const ancestor = node?.closest("[data-shell-search]") ?? node?.parentElement;
      ancestor?.setAttribute("hidden", "");
      return ancestor ? { selector, ancestor: ancestor.className || ancestor.tagName.toLowerCase() } : null;
    }, samplingValidityTarget);
    await settle(page);
    const samplingValidityProbe = await measureParity(page, [samplingValidityRole]);
    await page.evaluate((selector) => {
      const node = document.querySelector(selector);
      const ancestor = node?.closest("[data-shell-search]") ?? node?.parentElement;
      ancestor?.removeAttribute("hidden");
    }, samplingValidityTarget);
    await settle(page);
    const samplingValidityRestored = await measureParity(page, [samplingValidityRole]);
    await addMutation(page);
    const mutated = await measureParity(page);
    await removeMutation(page);
    // The row box self-check (TCRN-DS-SUB-197): with the pinnable rows' wrapper stripped of its right
    // inset, the package row box reads paddingRight 0 against the plain row's 4, and the role reds.
    const rowBoxRole = parityRoles.find((role) => role.id === "package-nav-item");
    await addCssMutation(page, `${packageStorySelector} [data-shell="ts-x-l"] .${pinnableRowWrapper} { padding-inline-end: 0 !important; }`);
    const rowBoxBroken = await measureParity(page, [rowBoxRole]);
    await removeMutation(page);
    const rowBoxRestored = await measureParity(page, [rowBoxRole]);
    // One difference read twice: an accepted exception makes it pass, and the empty table (the
    // production table since the sample roles retired) leaves it red.
    const localeRole = parityRoles.find((role) => role.id === "locale");
    await addCssMutation(page, `${docOwn('[data-panel="account"]')} .tcrn-shell-locale-menu__trigger { border-radius: 1px !important; }`);
    const exceptionProbe = await measureParity(page, [localeRole], [{
      role: "locale",
      property: "borderRadius",
      acceptedAt: "synthetic-proof",
      reason: "SYNTHETIC_EXCEPTION_PATH"
    }]);
    const emptyExceptionProbe = await measureParity(page, [localeRole], []);
    await removeMutation(page);
    const restored = await measureParity(page);
    const documentContentEdge = await documentContentEdgeProof(page, server.origin);
    result = {
      documentContentEdge,
      schemaVersion: "tcrn.ds.shell-parity-proof.v3",
      roleCount: parityRoles.length,
      retiredSampleRoles,
      baseline,
      mutated,
      restored,
      exceptionProbe: {
        ok: exceptionProbe.roles.find((role) => role.id === "locale")?.ok === true
          && exceptionProbe.acceptedExceptions.some((entry) => entry.reason === "SYNTHETIC_EXCEPTION_PATH"),
        acceptedExceptions: exceptionProbe.acceptedExceptions
      },
      samplingValidity: {
        target: samplingValidityProbeTarget,
        failed: samplingValidityProbe,
        restored: samplingValidityRestored,
        ok: !samplingValidityProbe.ok
          && samplingValidityProbe.roles.some((role) => role.differences.some((difference) => difference.property === "sample-validity"))
          && samplingValidityRestored.ok
      },
      rowBoxProbe: {
        ok: !rowBoxBroken.ok
          && rowBoxBroken.roles.some((role) => role.differences.some((difference) => difference.property === "paddingRight" && difference.package === "0px"))
          && rowBoxRestored.ok,
        broken: rowBoxBroken.roles.flatMap((role) => role.differences),
        restored: rowBoxRestored.roles.map((role) => ({ id: role.id, rowBoxes: role.rowBoxes, ok: role.ok }))
      },
      emptyExceptionProbe: {
        ok: !emptyExceptionProbe.ok
          && emptyExceptionProbe.roles.some((role) => role.differences.some((difference) => difference.property === "borderRadius")),
        differences: emptyExceptionProbe.roles.flatMap((role) => role.differences)
      },
      redThenGreen: {
        baselineRed: !baseline.ok,
        mutationRed: !mutated.ok,
        restoredGreen: restored.ok
      }
    };
    result.ok = documentContentEdge.ok
      && baseline.ok
      && !mutated.ok
      && restored.ok
      && result.exceptionProbe.ok
      && result.samplingValidity.ok
      && result.rowBoxProbe.ok
      && result.emptyExceptionProbe.ok;
  } finally {
    await page.close();
    await browser.close();
    await server.close();
  }
  console.log(JSON.stringify(result));
  if (!result.ok) process.exitCode = 1;
}

await main();
