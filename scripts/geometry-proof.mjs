import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, normalize, relative, resolve } from "node:path";
import { chromium } from "@playwright/test";

const staticRoot = resolve("apps/storybook/storybook-static");
const badgeRoute = "/components-navigation-shells.html#navigation-dense-operations-shell-spec";
const brandRoute = "/proof-proof-visual-instances.html#owner-quality-product-shell";
const copyRoute = "/components-navigation-shells.html#navigation-dense-operations-shell-spec";
const badgeStory = "navigation-dense-operations-shell-spec";
const brandStory = "owner-quality-product-shell";
const collapsedVariant = "desktop-light-operations-cockpit-collapsed";

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
  return page.evaluate(({ storyId, variant }) => {
    const root = document.querySelector(`article[data-story-id="${storyId}"]`);
    const nodes = root ? [...root.querySelectorAll(".tcrn-brand-mark")] : [];
    const marks = nodes.map((node) => {
      const box = node.getBoundingClientRect();
      const parent = node.parentElement?.getBoundingClientRect();
      return {
        variant: node.closest("[data-visual-instance-variant]")?.getAttribute("data-visual-instance-variant") ?? null,
        width: Number(box.width.toFixed(2)),
        height: Number(box.height.toFixed(2)),
        parentWidth: parent ? Number(parent.width.toFixed(2)) : null,
        parentHeight: parent ? Number(parent.height.toFixed(2)) : null
      };
    });
    const collapsed = root?.querySelector(`[data-visual-instance-variant="${variant}"] .tcrn-brand-mark`);
    const collapsedBox = collapsed?.getBoundingClientRect();
    const collapsedParent = collapsed?.parentElement?.getBoundingClientRect();
    return {
      count: marks.length,
      marks,
      collapsedVariant: {
        width: collapsedBox ? Number(collapsedBox.width.toFixed(2)) : null,
        height: collapsedBox ? Number(collapsedBox.height.toFixed(2)) : null,
        parentWidth: collapsedParent ? Number(collapsedParent.width.toFixed(2)) : null,
        parentHeight: collapsedParent ? Number(collapsedParent.height.toFixed(2)) : null
      },
      ok: marks.length > 0
        && marks.every((mark) => mark.width > 0 && mark.height > 0 && mark.parentWidth > 0 && mark.parentHeight > 0)
        && Boolean(collapsedBox && collapsedParent && collapsedBox.width > 0 && collapsedBox.height > 0 && collapsedParent.width > 0 && collapsedParent.height > 0)
    };
  }, { storyId: brandStory, variant: collapsedVariant });
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
    const brandBaseline = await measureBrands(page);
    await addMutation(page, `[data-visual-instance-variant="${collapsedVariant}"] .tcrn-product-shell__brand { inline-size: 0 !important; min-width: 0 !important; min-height: 0 !important; } [data-visual-instance-variant="${collapsedVariant}"] .tcrn-shell-brand-lockup { inline-size: 0 !important; min-width: 0 !important; min-height: 0 !important; }`);
    const brandBroken = await measureBrands(page);
    await removeMutation(page);
    const brandRestored = await measureBrands(page);

    await page.goto(`${server.origin}${copyRoute}`);
    await settle(page);
    await expandAllStories(page);
    const copyBaseline = await measureBrandCopies(page);
    await addMutation(page, ".tcrn-shell-brand-lockup__copy, .tcrn-product-logo__copy { inline-size: 2px !important; max-width: 2px !important; visibility: visible !important; opacity: 1 !important; }");
    const copyBroken = await measureBrandCopies(page);
    await removeMutation(page);
    const copyRestored = await measureBrandCopies(page);

    result = {
      schemaVersion: "tcrn.ds.geometry-proof.v1",
      ok: badgeBaseline.ok && !badgeBroken.ok && badgeRestored.ok
        && brandBaseline.ok && !brandBroken.ok && brandRestored.ok
        && copyBaseline.ok && !copyBroken.ok && copyRestored.ok,
      redThenGreen: {
        badge: { red: !badgeBroken.ok, green: badgeRestored.ok },
        brand: { red: !brandBroken.ok, green: brandRestored.ok },
        copy: { red: !copyBroken.ok, green: copyRestored.ok }
      },
      badge: { baseline: badgeBaseline, broken: badgeBroken, restored: badgeRestored },
      brand: { baseline: brandBaseline, broken: brandBroken, restored: brandRestored },
      copy: { baseline: copyBaseline, broken: copyBroken, restored: copyRestored }
    };
  } finally {
    await page.close();
    await browser.close();
    await server.close();
  }
  console.log(JSON.stringify(result));
  if (!result.ok) process.exitCode = 1;
}

await main();
