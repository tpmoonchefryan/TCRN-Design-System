#!/usr/bin/env node
// TCRN-DS-STORY-113/114/115 — real-browser proof for the full-surface contract.
// The page checks use the built static Storybook routes and the native DOM they emit. React
// portal behavior is covered by the package DOM harness; this script covers the rendered
// Storybook surfaces, actual option/description counts, and viewport geometry.

import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, normalize, relative, resolve } from "node:path";
import { chromium } from "@playwright/test";
import { build } from "esbuild";

const root = resolve(".");

function contentType(path) {
  if (extname(path) === ".html") return "text/html; charset=utf-8";
  if (extname(path) === ".css") return "text/css; charset=utf-8";
  if (extname(path) === ".js") return "text/javascript; charset=utf-8";
  if (extname(path) === ".json") return "application/json; charset=utf-8";
  if (extname(path) === ".svg") return "image/svg+xml";
  return "application/octet-stream";
}

function startStaticServer() {
  const server = createServer((request, response) => {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    const requested = normalize(decodeURIComponent(url.pathname)).replace(/^\/+/, "");
    const target = resolve(root, requested || "index.html");
    if (relative(root, target).startsWith("..")) {
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
        reject(new Error("static_server_no_port"));
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
  await page.waitForLoadState("load");
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function buildClientFixture() {
  const result = await build({
    stdin: {
      resolveDir: root,
      sourcefile: "full-surface-remediation-fixture.tsx",
      loader: "tsx",
      contents: `
        import React, { useRef, useState } from "react";
        import { createRoot } from "react-dom/client";
        import { Field, MultiSelect, Popover, SettingChoice, SuggestInput, Tooltip, tcrnComponentCss } from "./packages/ui-react/dist/index.js";
        import { tcrnTokenCss } from "./packages/ui-tokens/dist/index.js";

        function Fixture() {
          const [availableInlineSize, setAvailableInlineSize] = useState(500);
          const [callbacks, setCallbacks] = useState([]);
          const [popoverOpen, setPopoverOpen] = useState(true);
          const popoverTriggerRef = useRef(null);
          const popoverCloseRef = useRef(null);
          const choiceOptions = [
            { value: "a", label: "Alpha", minInlineSize: 112 },
            { value: "b", label: "Beta", minInlineSize: 112 }
          ];
          return (
            <main data-full-surface-fixture="true" style={{ position: "relative", minHeight: "240px", padding: "16px" }}>
              <div data-clipping-ancestor="true" style={{ overflow: "hidden", width: "120px", height: "72px" }}>
                <Tooltip content="Supplemental content is positioned outside the clipping ancestor." placement="right">
                  <button type="button" data-tooltip-trigger>Tooltip trigger</button>
                </Tooltip>
              </div>
              <div data-scroll-ancestor="true" style={{ position: "absolute", left: "260px", top: "170px", width: "90px", height: "50px", overflow: "auto" }}>
                <div style={{ position: "relative", width: "80px", height: "120px" }}>
                  <button ref={popoverTriggerRef} type="button" data-popover-trigger style={{ position: "absolute", left: "0", top: "0" }}>Open context</button>
                </div>
              </div>
              <Popover title="Long context" open={popoverOpen} triggerRef={popoverTriggerRef} initialFocusRef={popoverCloseRef} onOpenChange={setPopoverOpen}>
                <p>Long context remains readable and scrollable when the viewport is short.</p>
                <button ref={popoverCloseRef} type="button" data-popover-close>Close context</button>
              </Popover>
              <section data-choice-fixture="true">
                <SettingChoice label="Execution mode" name="execution-mode" options={choiceOptions} defaultValue="a" availableInlineSize={availableInlineSize} onChange={(value) => setCallbacks((current) => [...current, value])} />
                <button type="button" data-narrow onClick={() => setAvailableInlineSize(100)}>Narrow</button>
                <button type="button" data-wide onClick={() => setAvailableInlineSize(500)}>Wide</button>
                <output data-choice-callbacks>{callbacks.join(",")}</output>
              </section>
              <form data-selection-form>
                <Field label="Collection" hint="Choose one or more values." error="Synthetic collection error">
                  <MultiSelect name="fixture-collection" defaultValue={["one"]} options={[{ value: "one", label: "One" }, { value: "two", label: "Two" }, { value: "blocked", label: "Blocked", disabled: true }]} />
                </Field>
                <SuggestInput name="fixture-open" suggestions={["suggested", "suggested"]} defaultValue="free" />
              </form>
            </main>
          );
        }

        const style = document.createElement("style");
        style.textContent = tcrnTokenCss + tcrnComponentCss + "body{margin:0;font:13px sans-serif}*{box-sizing:border-box}";
        document.head.append(style);
        createRoot(document.querySelector("#root")).render(<Fixture />);
      `
    },
    bundle: true,
    format: "iife",
    platform: "browser",
    write: false,
    logLevel: "silent"
  });
  return result.outputFiles[0].text;
}

async function buildStaticOverlayBridge() {
  const result = await build({
    stdin: {
      resolveDir: root,
      sourcefile: "static-overlay-bridge-fixture.js",
      loader: "js",
      contents: `
        import { mountStaticOverlayBoundary, tcrnComponentCss } from "./packages/ui-react/dist/index.js";
        import { tcrnTokenCss } from "./packages/ui-tokens/dist/index.js";
        const style = document.createElement("style");
        style.textContent = tcrnTokenCss + tcrnComponentCss + "*{box-sizing:border-box}body{margin:0;font:13px sans-serif}";
        document.head.append(style);
        const tooltip = mountStaticOverlayBoundary({
          trigger: document.querySelector("#static-tooltip-trigger"),
          layer: document.querySelector("#static-tooltip-layer"),
          kind: "tooltip",
          placement: "right"
        });
        const popover = mountStaticOverlayBoundary({
          trigger: document.querySelector("#static-popover-trigger"),
          layer: document.querySelector("#static-popover-layer"),
          kind: "popover",
          placement: "bottom-start"
        });
        document.documentElement.setAttribute("data-static-boundary-ready", "true");
        window.__tcrnStaticOverlayHandles = { tooltip, popover };
      `
    },
    bundle: true,
    format: "iife",
    platform: "browser",
    write: false,
    logLevel: "silent"
  });
  return result.outputFiles[0].text;
}

async function runStaticHtmlCssConsumerProof(browser) {
  const page = await browser.newPage({ viewport: { width: 360, height: 240 }, reducedMotion: "reduce" });
  try {
    await page.setContent(`<!doctype html><meta charset="utf-8">
      <div id="static-clip" style="position:relative;width:120px;height:72px;overflow:hidden;padding:16px">
        <button id="static-tooltip-trigger" aria-describedby="static-tooltip-layer">Help</button>
        <span id="static-tooltip-layer" class="tcrn-tooltip__content" role="tooltip" hidden>Static supplemental text remains outside the clipping panel.</span>
      </div>
      <div id="static-popover-clip" style="position:relative;overflow:hidden;width:160px;height:72px;margin-top:112px;padding:8px">
        <button id="static-popover-trigger" aria-controls="static-popover-layer" aria-expanded="false">Open context</button>
        <section id="static-popover-layer" class="tcrn-popover" role="dialog" aria-label="Static context" hidden>
          <p>Static context remains readable at the viewport edge.</p>
          <button type="button">Close context</button>
        </section>
      </div>`);
    await page.addScriptTag({ content: await buildStaticOverlayBridge() });
    await page.waitForSelector("[data-static-boundary-ready='true']");
    const initial = await page.evaluate(() => ({
      tooltipParentIsBody: document.querySelector("#static-tooltip-layer")?.parentElement === document.body,
      popoverParentIsBody: document.querySelector("#static-popover-layer")?.parentElement === document.body,
      tooltipHidden: document.querySelector("#static-tooltip-layer")?.hasAttribute("hidden") ?? false,
      popoverHidden: document.querySelector("#static-popover-layer")?.hasAttribute("hidden") ?? false,
      tooltipPositioning: getComputedStyle(document.querySelector("#static-tooltip-layer")).position,
      popoverPositioning: getComputedStyle(document.querySelector("#static-popover-layer")).position
    }));
    assert(initial.tooltipParentIsBody && initial.popoverParentIsBody && initial.tooltipHidden && initial.popoverHidden, "static HTML layers did not move to the document body or start closed");
    assert(initial.tooltipPositioning === "fixed" && initial.popoverPositioning === "fixed", "static HTML/CSS boundary did not use fixed positioning");

    const tooltipTrigger = page.locator("#static-tooltip-trigger");
    assert(await tooltipTrigger.count() === 1, "static tooltip trigger count drifted");
    await tooltipTrigger.focus();
    const tooltipOpen = await page.evaluate(() => {
      const layer = document.querySelector("#static-tooltip-layer");
      const box = layer?.getBoundingClientRect();
      return {
        open: layer?.getAttribute("data-tooltip-open"),
        boundary: layer?.getAttribute("data-overlay-boundary"),
        placement: layer?.getAttribute("data-overlay-placement-resolved"),
        withinViewport: Boolean(box && box.left >= 0 && box.right <= window.innerWidth && box.top >= 0 && box.bottom <= window.innerHeight),
        clippingAncestorContainsLayer: Boolean(layer?.closest("#static-clip"))
      };
    });
    assert(tooltipOpen.open === "true" && tooltipOpen.boundary === "document-body" && tooltipOpen.withinViewport && !tooltipOpen.clippingAncestorContainsLayer, "static tooltip boundary did not open outside clipping or stay in the viewport");
    await page.keyboard.press("Escape");
    const tooltipClosed = await page.evaluate(() => ({
      open: document.querySelector("#static-tooltip-layer")?.getAttribute("data-tooltip-open"),
      hidden: document.querySelector("#static-tooltip-layer")?.hasAttribute("hidden") ?? false,
      focusReturned: document.activeElement?.id === "static-tooltip-trigger"
    }));
    assert(tooltipClosed.open === "false" && tooltipClosed.hidden && tooltipClosed.focusReturned, "static tooltip Escape close did not update the actual state");

    const popoverTrigger = page.locator("#static-popover-trigger");
    assert(await popoverTrigger.count() === 1, "static popover trigger count drifted");
    await popoverTrigger.click();
    const popoverOpen = await page.evaluate(() => {
      const layer = document.querySelector("#static-popover-layer");
      const box = layer?.getBoundingClientRect();
      return {
        open: layer?.getAttribute("data-overlay-open"),
        boundary: layer?.getAttribute("data-overlay-boundary"),
        withinViewport: Boolean(box && box.left >= 0 && box.right <= window.innerWidth && box.top >= 0 && box.bottom <= window.innerHeight),
        clippingAncestorContainsLayer: Boolean(layer?.closest("#static-popover-clip")),
        overflowY: getComputedStyle(layer).overflowY
      };
    });
    assert(popoverOpen.open === "true" && popoverOpen.boundary === "document-body" && popoverOpen.withinViewport && !popoverOpen.clippingAncestorContainsLayer && popoverOpen.overflowY === "auto", "static popover boundary did not open outside clipping or stay viewport-safe");
    await page.mouse.click(8, 8);
    const popoverClosed = await page.evaluate(() => ({
      open: document.querySelector("#static-popover-layer")?.getAttribute("data-overlay-open"),
      hidden: document.querySelector("#static-popover-layer")?.hasAttribute("hidden") ?? false
    }));
    assert(popoverClosed.open === "false" && popoverClosed.hidden, "static popover outside dismissal did not update the actual state");
    return { initial, tooltipOpen, tooltipClosed, popoverOpen, popoverClosed, ok: true };
  } finally {
    await page.close();
  }
}

async function runClientFixtureProof(browser) {
  const page = await browser.newPage({ viewport: { width: 360, height: 240 }, reducedMotion: "reduce" });
  try {
    await page.setContent("<!doctype html><meta charset='utf-8'><div id='root'></div>");
    await page.addScriptTag({ content: await buildClientFixture() });
    await page.waitForSelector("[data-full-surface-fixture='true']");
    await page.waitForTimeout(100);
    const initial = await page.evaluate(() => {
      const tooltip = document.querySelector("[data-tooltip-portal='true']");
      const popover = document.querySelector("[data-overlay-positioning='portal-fixed']");
      const rect = (node) => {
        const value = node?.getBoundingClientRect();
        return value ? { left: value.left, top: value.top, right: value.right, bottom: value.bottom, width: value.width, height: value.height } : null;
      };
      const tooltipRect = rect(tooltip);
      const popoverRect = rect(popover);
      return {
        tooltipParentIsBody: tooltip?.parentElement === document.body,
        tooltipRect,
        tooltipWithinViewport: Boolean(tooltipRect && tooltipRect.left >= 0 && tooltipRect.right <= window.innerWidth && tooltipRect.top >= 0 && tooltipRect.bottom <= window.innerHeight),
        popoverParentIsBody: popover?.parentElement === document.body,
        popoverRect,
        popoverWithinViewport: Boolean(popoverRect && popoverRect.left >= 0 && popoverRect.right <= window.innerWidth && popoverRect.top >= 0 && popoverRect.bottom <= window.innerHeight),
        popoverPlacement: popover?.getAttribute("data-overlay-placement-resolved"),
        clippingAncestorContainsTooltip: Boolean(tooltip?.closest("[data-clipping-ancestor]")),
        scrollAncestorContainsPopover: Boolean(popover?.closest("[data-scroll-ancestor]"))
      };
    });
    assert(initial.tooltipParentIsBody && initial.popoverParentIsBody, "client overlays did not escape to document body");
    assert(initial.tooltipWithinViewport && initial.popoverWithinViewport, "client overlay placement escaped the viewport");
    assert(!initial.clippingAncestorContainsTooltip && !initial.scrollAncestorContainsPopover, "client overlay remained inside a clipping ancestor");

    await page.evaluate(() => {
      const scrollAncestor = document.querySelector("[data-scroll-ancestor]");
      if (!(scrollAncestor instanceof HTMLElement)) throw new Error("missing_scroll_ancestor");
      scrollAncestor.scrollTop = 16;
      scrollAncestor.dispatchEvent(new Event("scroll", { bubbles: true }));
    });
    await page.waitForTimeout(20);
    const afterScroll = await page.evaluate(() => {
      const node = document.querySelector("[data-overlay-positioning='portal-fixed']");
      const box = node?.getBoundingClientRect();
      return { top: box?.top ?? null, bottom: box?.bottom ?? null, withinViewport: Boolean(box && box.left >= 0 && box.right <= window.innerWidth && box.top >= 0 && box.bottom <= window.innerHeight) };
    });
    assert(afterScroll.withinViewport, "scroll-ancestor movement escaped the viewport");
    await page.setViewportSize({ width: 320, height: 200 });
    await page.waitForTimeout(20);
    const afterResize = await page.evaluate(() => {
      const node = document.querySelector("[data-overlay-positioning='portal-fixed']");
      const box = node?.getBoundingClientRect();
      return { width: window.innerWidth, height: window.innerHeight, left: box?.left ?? null, top: box?.top ?? null, right: box?.right ?? null, bottom: box?.bottom ?? null, withinViewport: Boolean(box && box.left >= 0 && box.right <= window.innerWidth && box.top >= 0 && box.bottom <= window.innerHeight) };
    });
    assert(afterResize.withinViewport, "viewport resize escaped the overlay boundary");

    const tooltipTrigger = page.locator("[data-tooltip-trigger]");
    assert(await tooltipTrigger.count() === 1, "client tooltip trigger count drifted");
    await tooltipTrigger.focus();
    const tooltipOpen = await page.locator("[data-tooltip-portal='true']").getAttribute("data-tooltip-open");
    assert(tooltipOpen === "true", "tooltip focus reveal did not reach the portaled content");

    await page.keyboard.press("Escape");
    await page.waitForSelector("[data-overlay-positioning='portal-fixed']", { state: "detached" });
    await page.waitForTimeout(20);
    const afterEscape = await page.evaluate(() => ({
      popoverCount: document.querySelectorAll("[data-overlay-positioning='portal-fixed']").length,
      activePopoverTrigger: document.activeElement?.matches("[data-popover-trigger]") ?? false
    }));
    assert(afterEscape.popoverCount === 0 && afterEscape.activePopoverTrigger, "popover Escape close/focus return failed");

    const radioB = page.locator("[data-choice-fixture='true'] input[type='radio'][value='b']");
    assert(await radioB.count() === 1, "client SettingChoice radio branch count drifted");
    await radioB.click();
    const afterRadio = await page.evaluate(() => ({
      checked: document.querySelector("[data-choice-fixture='true'] input[type='radio'][value='b']")?.checked ?? false,
      callbacks: document.querySelector("[data-choice-callbacks]")?.textContent ?? ""
    }));
    assert(afterRadio.checked && afterRadio.callbacks === "b", "client radio change did not retain or report value");

    const narrow = page.locator("[data-narrow]");
    const wide = page.locator("[data-wide]");
    assert(await narrow.count() === 1 && await wide.count() === 1, "client SettingChoice layout controls drifted");
    await narrow.click();
    await page.waitForSelector("[data-choice-fixture='true'] select");
    const afterNarrow = await page.evaluate(() => ({
      value: document.querySelector("[data-choice-fixture='true'] select")?.value ?? "",
      callbacks: document.querySelector("[data-choice-callbacks]")?.textContent ?? ""
    }));
    assert(afterNarrow.value === "b" && afterNarrow.callbacks === "b", "client narrow branch lost value or fired a layout callback");
    await wide.click();
    await page.waitForSelector("[data-choice-fixture='true'] input[type='radio'][value='b']");
    const afterWide = await page.evaluate(() => ({
      checked: document.querySelector("[data-choice-fixture='true'] input[type='radio'][value='b']")?.checked ?? false,
      callbacks: document.querySelector("[data-choice-callbacks]")?.textContent ?? ""
    }));
    assert(afterWide.checked && afterWide.callbacks === "b", "client wide branch lost value or fired a layout callback");

    const collection = page.locator("select[name='fixture-collection']");
    assert(await collection.count() === 1, "client collection control count drifted");
    await collection.focus();
    await collection.selectOption(["one", "two"]);
    const afterCollectionAdd = await page.evaluate(() => {
      const node = document.querySelector("select[name='fixture-collection']");
      const form = document.querySelector("[data-selection-form]");
      const values = node instanceof HTMLSelectElement ? Array.from(node.selectedOptions, (option) => option.value) : [];
      const submitted = form instanceof HTMLFormElement ? new FormData(form).getAll("fixture-collection") : [];
      return {
        selected: values,
        submitted,
        disabled: node instanceof HTMLSelectElement && node.querySelector("option[value='blocked']")?.disabled === true,
        focused: document.activeElement === node,
        openValue: form instanceof HTMLFormElement ? new FormData(form).get("fixture-open") : null,
        datalistOptions: document.querySelector("input[name='fixture-open'] + datalist")?.querySelectorAll("option").length ?? 0,
        invalid: node?.getAttribute("aria-invalid")
      };
    });
    assert(afterCollectionAdd.selected.join(",") === "one,two"
      && afterCollectionAdd.submitted.join(",") === "one,two"
      && afterCollectionAdd.disabled
      && afterCollectionAdd.focused
      && afterCollectionAdd.openValue === "free"
      && afterCollectionAdd.datalistOptions === 1
      && afterCollectionAdd.invalid === "true", "client collection selection/form/error contract failed");
    await collection.selectOption(["two"]);
    const afterCollectionRemove = await page.evaluate(() => {
      const node = document.querySelector("select[name='fixture-collection']");
      const form = document.querySelector("[data-selection-form]");
      return {
        selected: node instanceof HTMLSelectElement ? Array.from(node.selectedOptions, (option) => option.value) : [],
        submitted: form instanceof HTMLFormElement ? new FormData(form).getAll("fixture-collection") : []
      };
    });
    assert(afterCollectionRemove.selected.join(",") === "two" && afterCollectionRemove.submitted.join(",") === "two", "client collection removal did not preserve native submission");
    return { initial, afterScroll, afterResize, afterEscape, afterRadio, afterNarrow, afterWide, afterCollectionAdd, afterCollectionRemove, ok: true };
  } finally {
    await page.close();
  }
}

const staticServer = await startStaticServer();
const browser = await chromium.launch({ headless: true });
const results = {};
try {
  const overlayPage = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  await overlayPage.goto(`${staticServer.origin}/apps/storybook/storybook-static/components-component-inventory.html?theme=light&locale=en#interaction-disclosure-spec`);
  await settle(overlayPage);
  results.tooltip = await overlayPage.evaluate(() => {
    const story = document.querySelector("[data-contract-story-id='interaction-disclosure-spec']");
    const tooltips = Array.from(story?.querySelectorAll(".tcrn-tooltip") ?? []);
    const content = tooltips.map((tooltip) => tooltip.querySelector("[role='tooltip']"));
    return {
      count: tooltips.length,
      placements: tooltips.map((tooltip) => tooltip.getAttribute("data-placement")),
      allTextOnly: tooltips.every((tooltip) => tooltip.getAttribute("data-tooltip-interactive-content") === "forbidden"),
      describedTriggers: tooltips.every((tooltip) => Boolean(tooltip.querySelector("[aria-describedby]"))),
      noInteractiveContent: content.every((node) => !node?.querySelector("a,button,input,select,textarea")),
      staticBoundary: tooltips.every((tooltip) => tooltip.getAttribute("data-overlay-boundary") === "inline-static")
    };
  });
  assert(results.tooltip.count === 4, "tooltip inventory count drifted");
  assert(results.tooltip.allTextOnly && results.tooltip.describedTriggers && results.tooltip.noInteractiveContent, "tooltip semantic contract failed");

  await overlayPage.goto(`${staticServer.origin}/apps/storybook/storybook-static/components-overlays.html?theme=light&locale=en#dialog-spec-usage`);
  await settle(overlayPage);
  const openPopover = overlayPage.locator("[data-popover-fixture-open]");
  assert(await openPopover.count() === 1, "popover fixture trigger count drifted");
  await openPopover.click();
  const visiblePopover = overlayPage.locator("[data-popover-fixture-panel]:not([hidden]) [data-overlay-scope='popover']");
  assert(await visiblePopover.count() === 1, "popover fixture did not open");
  results.popover = await visiblePopover.evaluate((node) => {
    const box = node.getBoundingClientRect();
    const style = getComputedStyle(node);
    return {
      boundary: node.getAttribute("data-overlay-boundary"),
      positioning: node.getAttribute("data-overlay-positioning"),
      modal: node.getAttribute("aria-modal"),
      visible: box.width > 0 && box.height > 0 && style.visibility !== "hidden",
      withinViewport: box.left >= 0 && box.right <= window.innerWidth && box.top >= 0 && box.bottom <= window.innerHeight,
      longContentOverflowPolicy: style.overflowY
    };
  });
  assert(results.popover.visible && results.popover.withinViewport && results.popover.modal === "false", "popover rendered contract failed");
  results.popover.matrix = await overlayPage.evaluate(() => {
    const popovers = Array.from(document.querySelectorAll("[data-overlay-scope='popover']"));
    return {
      count: popovers.length,
      placements: popovers.map((node) => node.getAttribute("data-placement")),
      allNonModal: popovers.every((node) => node.getAttribute("aria-modal") === "false"),
      allStaticBoundary: popovers.every((node) => node.getAttribute("data-overlay-boundary") === "inline-static")
    };
  });
  assert(results.popover.matrix.count === 5
    && ["bottom-start", "bottom-end", "top-start", "top-end"].every((placement) => results.popover.matrix.placements.includes(placement))
    && results.popover.matrix.allNonModal
    && results.popover.matrix.allStaticBoundary, "popover placement matrix drifted");
  const closePopover = overlayPage.locator("[data-popover-fixture-panel]:not([hidden]) [data-popover-fixture-close]");
  assert(await closePopover.count() === 1, "popover close trigger count drifted");
  await closePopover.click();
  await overlayPage.close();

  const fieldPage = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  await fieldPage.goto(`${staticServer.origin}/apps/storybook/storybook-static/patterns-feedback-selection.html?theme=light&locale=en#selection-list-patterns`);
  await settle(fieldPage);
  results.selection = await fieldPage.evaluate(() => {
    const collection = document.querySelector("select[data-choice-cardinality='collection']");
    const openInput = document.querySelector("input[data-choice-value-mode='open']");
    const options = collection instanceof HTMLSelectElement ? Array.from(collection.options) : [];
    if (openInput instanceof HTMLInputElement) {
      openInput.value = "free-form-value";
      openInput.dispatchEvent(new Event("input", { bubbles: true }));
    }
    return {
      collectionCount: document.querySelectorAll("select[data-choice-cardinality='collection']").length,
      collectionMultiple: collection instanceof HTMLSelectElement && collection.multiple,
      collectionSelected: options.filter((option) => option.selected).map((option) => option.value),
      collectionDisabledValues: options.filter((option) => option.disabled).map((option) => option.value),
      collectionUniqueValues: new Set(options.map((option) => option.value)).size === options.length,
      openInputCount: document.querySelectorAll("input[data-choice-value-mode='open']").length,
      openInputFreeForm: openInput instanceof HTMLInputElement && openInput.value === "free-form-value",
      datalistCount: document.querySelectorAll("input[data-choice-value-mode='open'] + datalist").length,
      datalistOptionCount: document.querySelector("input[data-choice-value-mode='open'] + datalist")?.querySelectorAll("option").length ?? 0
    };
  });
  assert(results.selection.collectionCount === 1 && results.selection.collectionMultiple, "MultiSelect native contract failed");
  assert(results.selection.collectionDisabledValues.length === 1 && results.selection.openInputFreeForm, "selection state contract failed");
  assert(results.selection.datalistCount === 1 && results.selection.datalistOptionCount === 2, "SuggestInput datalist contract failed");
  await fieldPage.close();

  const dictionaryPage = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  await dictionaryPage.goto(`${staticServer.origin}/apps/storybook/storybook-static/foundations-tokens-i18n.html?theme=light&locale=en#tokens-copy-state`);
  await settle(dictionaryPage);
  results.dictionary = await dictionaryPage.evaluate(() => Array.from(document.querySelectorAll("[data-dictionary-category='true']")).map((category) => {
    const entries = Array.from(category.querySelectorAll("[data-dictionary-entry='true']"));
    const values = entries.map((entry) => entry.getAttribute("data-dictionary-value"));
    return {
      validMarker: category.getAttribute("data-dictionary-valid"),
      categoryDescriptionCount: category.querySelectorAll("[data-dictionary-category-description='true']").length,
      entryCount: entries.length,
      uniqueValues: new Set(values).size === values.length,
      entryDescriptionsComplete: entries.every((entry) => entry.getAttribute("data-dictionary-entry-description-present") === "true")
    };
  }));
  assert(results.dictionary.length === 2, "dictionary category inventory count drifted");
  assert(results.dictionary.every((category) => category.validMarker === "true" && category.categoryDescriptionCount === 1 && category.entryCount > 0 && category.uniqueValues && category.entryDescriptionsComplete), "dictionary content contract failed");
  await dictionaryPage.close();

  results.staticHtmlCssConsumer = await runStaticHtmlCssConsumerProof(browser);
  results.clientFixture = await runClientFixtureProof(browser);

  results.ok = true;
} finally {
  await browser.close();
  await staticServer.close();
}

process.stdout.write(`${JSON.stringify({
  schemaVersion: "tcrn.ds.full-surface-remediation-browser-proof.v1",
  routes: [
    "components-component-inventory.html#interaction-disclosure-spec",
    "components-overlays.html#dialog-spec-usage",
    "patterns-feedback-selection.html#selection-list-patterns",
    "foundations-tokens-i18n.html#tokens-copy-state"
  ],
  results,
  ok: results.ok === true
}, null, 2)}\n`);
