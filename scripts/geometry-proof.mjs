import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, normalize, relative, resolve } from "node:path";
import { chromium } from "@playwright/test";
import { build } from "esbuild";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { RecordInspector, StatusBadge, tcrnComponentCss } from "../packages/ui-react/dist/index.js";

import { tcrnTokenCss, tcrnTokens } from "../packages/ui-tokens/dist/index.js";
import { pathToFileURL } from "node:url";

const staticRoot = resolve("apps/storybook/storybook-static");
const badgeRoute = "/components-navigation-shells.html#navigation-product-shell-spec";
const brandRoute = "/components-navigation-shells.html#shell-top-band";
const copyRoute = "/components-navigation-shells.html#navigation-product-shell-spec";
const searchRoute = "/components-navigation-shells.html?theme=light&locale=en&proof=search#navigation-product-shell-spec";
const badgeStory = "navigation-product-shell-spec";
const brandStory = "shell-top-band";
const searchStory = "navigation-product-shell-spec";
// The brand host is the closed top band (07a board, section A): the first screen of shell-top-band.
const closedScreen = "ts-closed-l";
// Open menus ([aria-expanded="true"]) on the search route: the docs sidebar toggle, the docs
// "Navigation and shells" category toggle, the knowledge-base shell sidebar toggle, the
// ProductShell story disclosure and the ProductShell contract's avatar menu; then the top-band
// shell stories (TCRN-DS-SUB-121): the brand buttons of the two full-menu screens of
// shell-top-band, the pinned item and the open Templates row of its two drop-down screens, and the
// brand buttons of the full-menu screens of shell-narrow and shell-mobile. It was 6 with the side
// rail shell (its side-nav toggle and its top-bar search combobox), 8 before the dense operations
// shell prototype and its two menu buttons were retired (TCRN-DS-SUB-066).
const EXPECTED_OPEN_MENUS = 13;
// The closed top band (TCRN-DS-SUB-121; the composition-one rail of O-1 is gone): the band is
// --tcrn-shell-strip-h high and the brand button --tcrn-shell-brand-w by --tcrn-shell-brand-h (its
// second version, at 1440), read from the token registry; the product mark is the Brand board's
// side-rail tier, 22 x 22.
function shellTokenPx(variable) {
  const value = tcrnTokens.find((token) => token.variable === variable)?.value ?? "";
  if (!/^\d+(?:\.\d+)?px$/.test(value)) throw new Error(`geometry_proof_token_not_px:${variable}`);
  return Number.parseFloat(value);
}
const CLOSED_BAND = Object.freeze({
  stripHeightPx: shellTokenPx("--tcrn-shell-strip-h"),
  brandWidthPx: shellTokenPx("--tcrn-shell-brand-w"),
  brandHeightPx: shellTokenPx("--tcrn-shell-brand-h"),
  markPx: 22,
  tolerancePx: 0.5
});

function contentType(path) {
  switch (extname(path)) {
    case ".html": return "text/html; charset=utf-8";
    case ".js": return "text/javascript; charset=utf-8";
    case ".css": return "text/css; charset=utf-8";
    case ".json": return "application/json; charset=utf-8";
    case ".svg": return "image/svg+xml";
    case ".png": return "image/png";
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
      const stat = statSync(target);
      if (!stat.isFile()) throw new Error("not_file");
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
        reject(new Error("geometry_proof_no_port"));
        return;
      }
      resolveServer({
        origin: `http://127.0.0.1:${address.port}`,
        close: () => new Promise((resolveClose, rejectClose) => {
          server.close((error) => error ? rejectClose(error) : resolveClose());
        })
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

async function measureBadge(page) {
  return page.evaluate((storyId) => {
    const root = document.querySelector(`article[data-story-id="${storyId}"]`);
    const nodes = root ? [...root.querySelectorAll(".tcrn-badge")] : [];
    const badges = nodes.map((node) => {
      const style = getComputedStyle(node);
      const box = node.getBoundingClientRect();
      const label = node.querySelector(".tcrn-badge__label");
      const labelBox = label?.getBoundingClientRect();
      const pseudo = getComputedStyle(node, "::before");
      const dotLeft = box.left + Number.parseFloat(pseudo.insetInlineStart || "0");
      const dotRight = dotLeft + Number.parseFloat(pseudo.inlineSize || "0");
      return {
        label: node.textContent?.trim() ?? "",
        paddingInlineStart: style.paddingInlineStart,
        width: Number(box.width.toFixed(2)),
        height: Number(box.height.toFixed(2)),
        labelLeft: labelBox ? Number(labelBox.left.toFixed(2)) : null,
        dotRight: Number(dotRight.toFixed(2)),
        textClearsDot: Boolean(labelBox && labelBox.left >= dotRight - 0.5)
      };
    });
    return {
      count: badges.length,
      badges,
      ok: badges.length > 0 && badges.every((badge) =>
        badge.width > 0
        && badge.height > 0
        && Math.abs(Number.parseFloat(badge.paddingInlineStart) - 18) < 0.1
        && badge.textClearsDot
      )
    };
  }, badgeStory);
}

async function measureBrands(page) {
  return page.evaluate(({ storyId, screen, band }) => {
    const root = document.querySelector(`article[data-story-id="${storyId}"]`);
    const nodes = root ? [...root.querySelectorAll("[data-shell-brand] svg[data-logo]")] : [];
    const marks = nodes.map((node) => {
      const box = node.getBoundingClientRect();
      const parent = node.parentElement?.getBoundingClientRect();
      return {
        screen: node.closest("[data-shell]")?.getAttribute("data-shell") ?? null,
        width: Number(box.width.toFixed(2)),
        height: Number(box.height.toFixed(2)),
        parentWidth: parent ? Number(parent.width.toFixed(2)) : null,
        parentHeight: parent ? Number(parent.height.toFixed(2)) : null
      };
    });
    // The closed band of the host screen: the band's height, the brand button and its product mark.
    const shell = root?.querySelector(`[data-shell="${screen}"]`);
    const stripBox = shell?.querySelector("[data-shell-strip]")?.getBoundingClientRect();
    const brandBox = shell?.querySelector("[data-tab]")?.getBoundingClientRect();
    const mark = shell?.querySelector("[data-tab] svg[data-logo]");
    const markBox = mark?.getBoundingClientRect();
    const markParent = mark?.parentElement?.getBoundingClientRect();
    const near = (value, expected) => typeof value === "number" && Math.abs(value - expected) <= band.tolerancePx;
    const closedBand = {
      state: shell?.getAttribute("data-state") ?? null,
      stripHeight: stripBox ? Number(stripBox.height.toFixed(2)) : null,
      brandWidth: brandBox ? Number(brandBox.width.toFixed(2)) : null,
      brandHeight: brandBox ? Number(brandBox.height.toFixed(2)) : null,
      markWidth: markBox ? Number(markBox.width.toFixed(2)) : null,
      markHeight: markBox ? Number(markBox.height.toFixed(2)) : null,
      markParentWidth: markParent ? Number(markParent.width.toFixed(2)) : null,
      markParentHeight: markParent ? Number(markParent.height.toFixed(2)) : null,
      expected: { state: "closed", stripHeight: band.stripHeightPx, brand: `${band.brandWidthPx}x${band.brandHeightPx}`, mark: `${band.markPx}x${band.markPx}`, tolerancePx: band.tolerancePx }
    };
    closedBand.ok = closedBand.state === "closed"
      && near(closedBand.stripHeight, band.stripHeightPx)
      && near(closedBand.brandWidth, band.brandWidthPx)
      && near(closedBand.brandHeight, band.brandHeightPx)
      && near(closedBand.markWidth, band.markPx)
      && near(closedBand.markHeight, band.markPx)
      && closedBand.markParentWidth > 0
      && closedBand.markParentHeight > 0;
    return {
      count: marks.length,
      marks,
      closedBand,
      ok: closedBand.ok
        && marks.length > 0
        && marks.every((entry) => entry.width > 0 && entry.height > 0 && entry.parentWidth > 0 && entry.parentHeight > 0)
    };
  }, { storyId: brandStory, screen: closedScreen, band: CLOSED_BAND });
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

async function measureBrandCopies(page) {
  return page.evaluate(() => {
    const copies = [...document.querySelectorAll(".tcrn-shell-brand-lockup__copy, .tcrn-product-logo__copy")];
    const details = copies.map((copy) => {
      const style = getComputedStyle(copy);
      const box = copy.getBoundingClientRect();
      const collapsedAncestor = copy.closest(
        '.tcrn-doc-shell[data-sidebar-collapsed="true"], .tcrn-product-shell[data-product-shell-collapsed="true"]'
      );
      const explicitHidden = Boolean(
        collapsedAncestor
        && (
          style.display === "none"
          || style.visibility === "hidden"
          || style.clipPath !== "none"
          || (style.position === "absolute" && style.overflow === "hidden" && box.width <= 1 && box.height <= 1)
        )
      );
      const laidOut = copy.getClientRects().length > 0 && (box.width > 0 || box.height > 0 || copy.scrollWidth > 0);
      return {
        className: copy.className,
        storyId: copy.closest("article[data-story-id]")?.getAttribute("data-story-id") ?? null,
        collapsed: Boolean(collapsedAncestor),
        laidOut,
        clientWidth: copy.clientWidth,
        scrollWidth: copy.scrollWidth,
        width: Number(box.width.toFixed(2)),
        height: Number(box.height.toFixed(2)),
        display: style.display,
        visibility: style.visibility,
        overflow: style.overflow,
        explicitHidden,
        ok: !laidOut || explicitHidden || copy.clientWidth >= copy.scrollWidth
      };
    });
    const laidOut = details.filter((detail) => detail.laidOut);
    return {
      count: details.length,
      laidOutCount: laidOut.length,
      copies: details,
      ok: details.length > 0 && details.every((detail) => detail.ok)
    };
  });
}

async function measureSearchOverlay(page) {
  return page.evaluate(({ storyId, expectedOpenMenus }) => {
    const root = document.querySelector(`article[data-story-id="${storyId}"]`);
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
    const visible = (node) => {
      const box = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return box.width > 0 && box.height > 0 && style.display !== "none" && style.visibility !== "hidden";
    };
    const intersects = (first, second) => Boolean(first && second
      && Math.min(first.right, second.right) - Math.max(first.left, second.left) > 0.5
      && Math.min(first.bottom, second.bottom) - Math.max(first.top, second.top) > 0.5);
    const openMenus = document.querySelectorAll('[aria-expanded="true"]').length;
    const overlays = root
      ? [...root.querySelectorAll("[data-product-shell-search-results]")]
        .filter((node) => !node.hasAttribute("hidden") && visible(node))
        .map((node) => ({ rect: rect(node), label: node.getAttribute("aria-label") ?? "" }))
      : [];
    const textTargets = root
      ? [...root.querySelectorAll(".tcrn-product-shell__main h1, .tcrn-product-shell__main h2, .tcrn-product-shell__main h3, .tcrn-product-shell__main h4, .tcrn-product-shell__main p, .tcrn-product-shell__main li, .tcrn-product-shell__main dt, .tcrn-product-shell__main dd")]
        .filter((node) => visible(node) && node.textContent?.trim())
        .map((node) => ({
          text: node.textContent.trim().replace(/\s+/g, " ").slice(0, 120),
          tag: node.tagName.toLowerCase(),
          rect: rect(node)
        }))
      : [];
    const collisions = overlays.flatMap((overlay) => textTargets
      .filter((target) => intersects(overlay.rect, target.rect))
      .map((target) => ({ overlay: overlay.label, target })));
    return {
      openMenus,
      overlayCount: overlays.length,
      overlays,
      textTargets,
      collisions,
      ok: openMenus === expectedOpenMenus && overlays.length > 0 && collisions.length === 0
    };
  }, { storyId: searchStory, expectedOpenMenus: EXPECTED_OPEN_MENUS });
}

async function addMutation(page, cssText) {
  await page.evaluate((text) => {
    const style = document.createElement("style");
    style.dataset.geometryProofMutation = "true";
    style.textContent = text;
    document.head.append(style);
  }, cssText);
  await settle(page);
}

async function removeMutation(page) {
  await page.evaluate(() => {
    document.querySelector("style[data-geometry-proof-mutation]")?.remove();
  });
  await settle(page);
}

// INC-399 reachability (TCRN-DS-SUB-126; 07b board, section D row "窄于 1024"): 760 and 390 wide
// the brand button is still reached after the page has scrolled, and it opens the Sheet. A real
// ProductShell runs in the page (client React, bundled once with esbuild from the built packages)
// with a long page in its paper; the paper and the window are scrolled 2000px, the brand button
// ([data-tab]) is hit at its centre and pressed, and the Sheet is read: [data-panel="sheet"], shown
// inside the viewport. The shell holds two pins, which the band does not show at these widths. The
// broken leg lets the band scroll away with the page, the way the old sticky top bar hid the
// mobile navigation toggle.
const MOBILE_SCROLL_PX = 2000;
const MOBILE_HEIGHT_PX = 844;
const MOBILE_BROKEN_CSS = ".tcrn-product-shell { block-size: auto; overflow: visible; } .tcrn-product-shell__paper, .tcrn-product-shell__paper > .tcrn-product-shell__main { overflow: visible; }";
const mobileNavigationFixture = `
import { createElement as h } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { ProductShell, tcrnComponentCss } from "./packages/ui-react/dist/index.js";
import { tcrnTokenCss } from "./packages/ui-tokens/dist/index.js";
const style = document.createElement("style");
style.textContent = tcrnTokenCss + tcrnComponentCss;
document.head.append(style);
const navGroups = [{ id: "pages", label: "Pages", items: [{ id: "settings", label: "Settings", href: "#settings" }, { id: "members", label: "Members", href: "#members" }] }];
const content = Array.from({ length: 160 }, (_, i) => h("p", { key: i }, "Example content " + i));
flushSync(() => createRoot(document.getElementById("fixture")).render(h(ProductShell, {
  productName: "Navigation example", moduleName: "Library", brandProductId: "design-system", currentRouteLabel: "Settings",
  pageHeader: { title: "Settings" }, navGroups, locales: [{ value: "en", label: "English" }], currentLocale: "en",
  pinnedIds: ["settings", "members"], onPinnedChange: () => undefined
}, content)));
`;
let mobileNavigationBundle;

async function mobileNavigationScript() {
  mobileNavigationBundle ??= (await build({
    stdin: { contents: mobileNavigationFixture, resolveDir: resolve("."), sourcefile: "mobile-navigation-fixture.js", loader: "js" },
    write: false, bundle: true, platform: "browser", format: "iife", logLevel: "silent"
  })).outputFiles[0].text;
  return mobileNavigationBundle;
}

async function measureMobileNavigation(page, width, broken = false) {
  await page.setViewportSize({ width, height: MOBILE_HEIGHT_PX });
  await page.setContent('<!doctype html><meta charset="utf-8"><body style="margin:0"><div id="fixture"></div></body>');
  await page.addScriptTag({ content: await mobileNavigationScript() });
  if (broken) await page.addStyleTag({ content: MOBILE_BROKEN_CSS });
  await settle(page);
  const scrolled = await page.evaluate((distance) => {
    const scroller = document.querySelector("[data-paper] > .tcrn-product-shell__main");
    if (scroller) scroller.scrollTop = distance;
    window.scrollTo(0, distance);
    return { paper: scroller ? Math.round(scroller.scrollTop) : null, window: Math.round(window.scrollY) };
  }, MOBILE_SCROLL_PX);
  const observation = await page.locator("[data-tab]").evaluate((tab) => {
    const box = tab.getBoundingClientRect();
    const hit = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2);
    // Narrower than 1024 the band shows the first version of the brand button and no pinned item.
    const pinsShown = [...document.querySelectorAll("[data-pins] [data-pin]")].filter((pin) => pin.getBoundingClientRect().width > 0).length;
    return { box: box.toJSON(), brandVersion: tab.getAttribute("data-shell-brand"), pinsShown, hit: hit ? hit.outerHTML.slice(0, 200) : null, reachable: tab === hit || tab.contains(hit) };
  });
  let sheet = null;
  if (observation.reachable) {
    await page.locator("[data-tab]").click();
    sheet = await page.evaluate(() => {
      const panel = document.querySelector('[data-panel="sheet"]');
      if (!panel) return null;
      const box = panel.getBoundingClientRect();
      const band = document.querySelector("[data-shell-strip]")?.getBoundingClientRect();
      const rows = [...new Set([...panel.querySelectorAll("[data-shell-row]")].map((row) => Math.round(row.getBoundingClientRect().height * 10) / 10))];
      const search = panel.querySelector("[data-shell-search]")?.getBoundingClientRect().height ?? null;
      return { box: box.toJSON(), bandBottom: band ? band.bottom : null, rows, search, shown: box.height > 0 && box.top >= 0 && box.bottom <= window.innerHeight + 0.5 };
    });
  }
  const expanded = await page.locator("[data-tab]").getAttribute("aria-expanded") === "true";
  return { width, broken, scrolled, ...observation, expanded, sheet, ok: observation.reachable && expanded && Boolean(sheet?.shown) };
}

/** Browser-serializable geometry oracle shared by capture qualification and mutation proof.
 * Text ranges detect overflow even when a box itself fits; scroll tables retain their
 * deliberate scrollport, while each cell must still contain its own readable content. */
export function measureRecordContainment(root) {
  const surfaces = [...root.querySelectorAll(".tcrn-record-inspector, .tcrn-detail-inspector, .tcrn-record-table, .tcrn-detail-layout")];
  if (root.matches?.(".tcrn-record-inspector, .tcrn-detail-inspector, .tcrn-record-table, .tcrn-detail-layout")) surfaces.unshift(root);
  const failures = [];
  const visible = (node) => node.getClientRects().length && getComputedStyle(node).visibility !== "hidden";
  const inside = (outer, inner) => inner.left >= outer.left - 1 && inner.right <= outer.right + 1
    && inner.top >= outer.top - 1 && inner.bottom <= outer.bottom + 1;
  for (const surface of surfaces.filter(visible)) {
    if (surface.scrollWidth > surface.clientWidth + 1) failures.push({ kind: "surface-overflow", className: surface.className });
    const slots = surface.querySelectorAll(".tcrn-key-value-list > div, .tcrn-record-row__summary, .tcrn-record-row__meta, .tcrn-table-shell__cell");
    for (const slot of slots) {
      if (!visible(slot)) continue;
      const box = slot.getBoundingClientRect();
      const walker = document.createTreeWalker(slot, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const text = walker.currentNode;
        if (!text.textContent.trim() || !visible(text.parentElement)) continue;
        const range = document.createRange();
        range.selectNodeContents(text);
        const rects = [...range.getClientRects()];
        if (rects.some((rect) => !inside(box, rect))) failures.push({ kind: "text-outside-slot", text: text.textContent, className: slot.className });
        for (let parent = text.parentElement; parent && parent !== slot.parentElement; parent = parent.parentElement) {
          const style = getComputedStyle(parent);
          if (["hidden", "clip"].includes(style.overflowX) || ["hidden", "clip"].includes(style.overflowY)) {
            if (rects.some((rect) => !inside(parent.getBoundingClientRect(), rect))) failures.push({ kind: "clipped-text", text: text.textContent, className: parent.className });
          }
        }
      }
    }
  }
  return { count: surfaces.length, failures, ok: failures.length === 0 };
}

async function recordContainmentMatrix(page, origin) {
  const rows = [];
  const words = { "zh-CN": "完整的层级与负责人信息", en: "Complete hierarchy and owner information", ja: "階層と担当者の完全な情報", ko: "전체 계층 및 담당자 정보", fr: "Informations complètes sur la hiérarchie et le responsable" };
  for (const locale of Object.keys(words)) for (const theme of ["light", "dark"]) {
    for (const width of [280, 390, 464, 488, 640]) {
      await page.setViewportSize({ width: 1440, height: 900 });
      const label = words[locale];
      const record = { id: "record-identifier-with-a-long-unbroken-suffix-0123456789", title: label, state: { state: "proof_required" }, owner: label, href: "#record", fields: [{ key: "owner", label, value: label.repeat(3) }] };
      const markup = renderToStaticMarkup(createElement(RecordInspector, {
        title: label, summary: label.repeat(3), locale,
        hierarchy: [{ key: "parent", label, value: label.repeat(3) }, { key: "id", label, value: "identifier".repeat(15) }],
        details: [{ key: "owner", label, value: label }, { key: "status", label, value: createElement(StatusBadge, { state: { state: "proof_required" }, locale }) }],
        subtasks: [record, { ...record, id: "dense-row", density: "dense" }, { ...record, id: "comfortable-row", density: "comfortable" }],
        attachments: [{ id: "reference", label, reference: "artifact-reference/".repeat(8), state: { state: "proof_required" } }]
      }));
      await page.setContent(`<style>${tcrnTokenCss} ${tcrnComponentCss}</style><main data-theme="${theme}" data-tcrn-theme="${theme}" lang="${locale}" style="width:${width}px">${markup}</main>`);
      await settle(page);
      const root = page.locator("main");
      const baseline = await root.evaluate(measureRecordContainment);
      const table = page.locator(".tcrn-table-shell");
      await table.focus();
      const before = await table.evaluate((node) => ({ scroll: node.scrollLeft, max: node.scrollWidth - node.clientWidth, focused: document.activeElement === node }));
      // Exercise the native horizontal scrollport with keys through its full range.
      let after = before.scroll;
      for (let step = 0; step < 32 && after < before.max - 1; step += 1) {
        await page.keyboard.press("ArrowRight");
        await page.waitForTimeout(50);
        after = await table.evaluate((node) => node.scrollLeft);
      }
      const rightmostVisible = await table.evaluate((node) => {
        const port = node.getBoundingClientRect();
        const last = node.querySelector(".tcrn-table-shell__row .tcrn-table-shell__cell:last-child").getBoundingClientRect();
        return last.right <= port.right + 1 && last.left >= port.left - 1;
      });
      const scrollKeyboard = before.focused && (before.max <= 1 || after >= before.max - 1) && rightmostVisible;
      const rowLink = page.locator("a.tcrn-record-row").first();
      await rowLink.focus();
      const rowFocused = await rowLink.evaluate((node) => document.activeElement === node);
      await page.keyboard.press("Enter");
      const keyboard = scrollKeyboard && rowFocused && new URL(page.url()).hash === "#record";
      const fullReference = await page.locator(".tcrn-attachment-list [data-full-token]").getAttribute("data-full-token") === "artifact-reference/".repeat(8);
      // Restore the previous intrinsic sizing, wrapping and global-breakpoint-only behavior.
      await addMutation(page, ".tcrn-detail-inspector, .tcrn-record-inspector { container-type: normal !important; } .tcrn-key-value-list { grid-template-columns: repeat(2,minmax(0,1fr)) !important; } .tcrn-key-value-list > div { grid-template-columns: minmax(120px, .32fr) minmax(0, 1fr) !important; min-width: auto !important; overflow-wrap: normal !important; } .tcrn-key-value-list dt, .tcrn-key-value-list dd { min-width: auto !important; overflow-wrap: normal !important; } .tcrn-record-inspector__grid { grid-template-columns: repeat(2,minmax(0,1fr)) !important; }");
      const oldGeometry = await root.evaluate(measureRecordContainment);
      await removeMutation(page);
      await addMutation(page, ".tcrn-key-value-list .tcrn-badge__label, .tcrn-record-row__meta .tcrn-badge__label { max-width: 2px !important; overflow: hidden !important; white-space: nowrap !important; }");
      const clipped = await root.evaluate(measureRecordContainment);
      await removeMutation(page);
      const restored = await root.evaluate(measureRecordContainment);
      rows.push({ locale, theme, width, baseline, keyboard, fullReference, oldRejected: !oldGeometry.ok, clipRejected: !clipped.ok, restored,
        ok: baseline.count > 0 && baseline.ok && keyboard && fullReference && !oldGeometry.ok && !clipped.ok && restored.ok });
    }
  }
  // Actual consumers, including the nested route/pattern detail layout, not just a fixture.
  const routes = [
    ["components-detail-and-inspection.html", "detail-and-inspection-inspector-spec"],
    ["components-detail-and-inspection.html", "detail-and-inspection-route-spec"],
    ["patterns-data-pages.html", "records-and-boards-patterns"]
  ];
  for (const locale of Object.keys(words)) for (const theme of ["light", "dark"]) for (const width of [1440, 1024, 390]) {
    await page.setViewportSize({ width, height: width === 1024 ? 768 : width === 390 ? 844 : 900 });
    for (const [file, id] of routes) {
      await page.goto(`${origin}/${file}?locale=${locale}&theme=${theme}#${id}`);
      await settle(page);
      const story = page.locator(`[data-contract-story-id="${id}"]`);
      const geometry = await story.evaluate(measureRecordContainment);
      rows.push({ locale, theme, width, story: id, ...geometry, ok: geometry.count > 0 && geometry.ok });
    }
  }
  return { rows, ok: rows.length > 0 && rows.every((row) => row.ok) };
}

async function main() {
  if (!existsSync(staticRoot)) throw new Error("geometry_proof_missing_static_surface");
  const server = await startStaticServer();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  let result;
  try {
    await page.goto(`${server.origin}${badgeRoute}`);
    await settle(page);
    const badgeBaseline = await measureBadge(page);
    await addMutation(page, ".story-body .tcrn-badge { padding-inline-start: 0 !important; }");
    const badgeBroken = await measureBadge(page);
    await removeMutation(page);
    const badgeRestored = await measureBadge(page);

    await page.goto(`${server.origin}${brandRoute}`);
    await settle(page);
    await expandAllStories(page);
    const brandBaseline = await measureBrands(page);
    await addMutation(page, `[data-shell="${closedScreen}"] [data-tab] { inline-size: 0 !important; min-width: 0 !important; padding: 0 !important; }`);
    const brandBroken = await measureBrands(page);
    await removeMutation(page);
    const brandRestored = await measureBrands(page);
    // Closed band mutations: the brand button narrowed to 92, and the product mark scaled down.
    await addMutation(page, `[data-shell="${closedScreen}"] { --tcrn-shell-brand-w: 92px !important; }`);
    const brandRailBroken = await measureBrands(page);
    await removeMutation(page);
    const brandRailRestored = await measureBrands(page);
    await addMutation(page, `[data-shell="${closedScreen}"] [data-tab] svg[data-logo] { transform: scale(0.5) !important; }`);
    const brandMarkBroken = await measureBrands(page);
    await removeMutation(page);
    const brandMarkRestored = await measureBrands(page);

    await page.goto(`${server.origin}${copyRoute}`);
    await settle(page);
    await expandAllStories(page);
    const copyBaseline = await measureBrandCopies(page);
    await addMutation(page, ".tcrn-shell-brand-lockup__copy, .tcrn-product-logo__copy { inline-size: 2px !important; max-width: 2px !important; visibility: visible !important; opacity: 1 !important; }");
    const copyBroken = await measureBrandCopies(page);
    await removeMutation(page);
    const copyRestored = await measureBrandCopies(page);

    await page.goto(`${server.origin}${searchRoute}`);
    await settle(page);
    const searchBaseline = await measureSearchOverlay(page);
    await addMutation(page, `article[data-story-id="${searchStory}"] .tcrn-product-shell-search__results { position: absolute !important; inset-block-start: calc(100% + var(--tcrn-space-2)) !important; inset-inline-end: 0 !important; margin-block-start: 0 !important; }`);
    const searchBroken = await measureSearchOverlay(page);
    await removeMutation(page);
    const searchRestored = await measureSearchOverlay(page);

    const mobileNavigation = [];
    for (const width of [760, 390]) mobileNavigation.push({
      baseline: await measureMobileNavigation(page, width),
      broken: await measureMobileNavigation(page, width, true),
      restored: await measureMobileNavigation(page, width),
    });
    const recordContainment = await recordContainmentMatrix(page, server.origin);
    result = {
      recordContainment,
      mobileNavigation,
      schemaVersion: "tcrn.ds.geometry-proof.v2",
      ok: recordContainment.ok && mobileNavigation.every(row => row.baseline.ok && !row.broken.ok && row.restored.ok) && badgeBaseline.ok && !badgeBroken.ok && badgeRestored.ok
        && brandBaseline.ok && !brandBroken.ok && brandRestored.ok
        && !brandRailBroken.ok && brandRailRestored.ok && !brandMarkBroken.ok && brandMarkRestored.ok
        && copyBaseline.ok && !copyBroken.ok && copyRestored.ok
        && searchBaseline.ok && !searchBroken.ok && searchRestored.ok,
      redThenGreen: {
        badge: { red: !badgeBroken.ok, green: badgeRestored.ok },
        brand: { red: !brandBroken.ok, green: brandRestored.ok },
        brandClosedBandWidth: { red: !brandRailBroken.ok, green: brandRailRestored.ok },
        brandClosedMarkScale: { red: !brandMarkBroken.ok, green: brandMarkRestored.ok },
        copy: { red: !copyBroken.ok, green: copyRestored.ok },
        searchOverlay: { red: !searchBroken.ok, green: searchRestored.ok }
      },
      badge: { baseline: badgeBaseline, broken: badgeBroken, restored: badgeRestored },
      brand: { baseline: brandBaseline, broken: brandBroken, restored: brandRestored },
      brandClosedBandWidth: { broken: brandRailBroken, restored: brandRailRestored },
      brandClosedMarkScale: { broken: brandMarkBroken, restored: brandMarkRestored },
      copy: { baseline: copyBaseline, broken: copyBroken, restored: copyRestored },
      searchOverlay: { baseline: searchBaseline, broken: searchBroken, restored: searchRestored }
    };
  } finally {
    await page.close();
    await browser.close();
    await server.close();
  }
  console.log(JSON.stringify(result));
  if (!result.ok) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await main();
