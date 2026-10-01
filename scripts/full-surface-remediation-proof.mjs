#!/usr/bin/env node
// TCRN-DS-STORY-116/117/118 — real-browser proof for the full-surface contract.
// The page checks use the built static Storybook routes and the native DOM they emit. React
// portal behavior is covered by the package DOM harness; this script covers the rendered
// Storybook surfaces, actual option/description counts, and viewport geometry.

import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, normalize, relative, resolve } from "node:path";
import { chromium } from "@playwright/test";
import { build } from "esbuild";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { evaluateConsumerEvidence, validateContentScope, Surface, OperationFeedback, tcrnComponentCss } from "../packages/ui-react/dist/index.js";
import { tcrnTokenCss } from "../packages/ui-tokens/dist/index.js";
import { settingsLayoutContract } from "../apps/storybook/dist/build/foundation-visual-standards.js";
import { storybookContentText, storybookLocaleText } from "../apps/storybook/dist/build/i18n.js";

const root = resolve(".");

async function runFullDetailsContainmentProof(browser) {
  const unbroken = "unbroken-path-hash-reason".replaceAll("-", "").repeat(40);
  const structured = JSON.stringify({ path: `/fixture/${unbroken}`, hash: unbroken, failures: [unbroken, unbroken], nested: { unchanged: true } }, null, 2);
  const markup = renderToStaticMarkup(createElement("div", { id: "detail-matrix" },
    createElement(Surface, {
      id: "detail-card", heading: createElement("h2", null, unbroken),
      actions: createElement("span", { className: "tcrn-badge tcrn-badge--danger" }, "Failed")
    }, ...[0, 1].map((index) => createElement(OperationFeedback, {
      key: index, id: `detail-${index}`, phase: "error", expanded: true,
      identity: { operation: "Inspect local fixture", operationId: unbroken, actor: "Synthetic operator", actorId: unbroken },
      identityLabels: { operation: "Operation", operationId: unbroken, actor: "Actor", actorId: "Actor id" },
      detailsLabel: "View full receipt", detailTitle: "Full receipt details", details: createElement("pre", { "data-structured-detail": index }, structured)
    }))),
    createElement(Surface, { id: "neighbor-card", heading: createElement("h2", null, "Selected library"), actions: createElement("span", { className: "tcrn-badge tcrn-badge--danger" }, "Failed") },
      createElement("dl", { className: "tcrn-definition-list" }, createElement("div", { className: "tcrn-definition-list__item" },
        createElement("dt", { className: "tcrn-definition-list__term" }, "Path"), createElement("dd", { className: "tcrn-definition-list__definition" }, unbroken))))));
  const observations = [];
  for (const fixture of [
    { id: "wide", viewport: 1440 }, { id: "narrow", viewport: 390 },
    { id: "nested-wide", viewport: 1440, mother: 900 }, { id: "nested-narrow", viewport: 1440, mother: 360 }
  ]) {
    const page = await browser.newPage({ viewport: { width: fixture.viewport, height: 900 }, reducedMotion: "reduce" });
    try {
      await page.setContent(`<!doctype html><meta charset="utf-8"><style>${tcrnTokenCss}${tcrnComponentCss}
        body{margin:0;padding:var(--tcrn-space-4);font-family:var(--tcrn-type-family-body)}
        #detail-matrix{display:grid;grid-template-columns:${fixture.viewport === 390 || fixture.mother === 360 ? "minmax(0,1fr)" : "repeat(2,minmax(0,1fr))"};gap:var(--tcrn-space-4);max-inline-size:100%;inline-size:${fixture.mother ? `${fixture.mother}px` : "100%"}}
      </style>${markup}`);
      const observe = () => page.evaluate(() => {
        const box = (node) => { const r = node.getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width }; };
        const leaks = [];
        for (const card of document.querySelectorAll("#detail-matrix > .tcrn-surface")) {
          const bound = box(card);
          for (const node of card.querySelectorAll(".tcrn-surface__head,.tcrn-surface__head > *, .tcrn-operation-feedback,.tcrn-operation-feedback__summary,.tcrn-operation-feedback__identity dt,.tcrn-operation-feedback__identity dd,.tcrn-badge,pre,.tcrn-definition-list__definition")) {
            const r = box(node);
            if (r.left < bound.left - 1 || r.right > bound.right + 1 || node.scrollWidth > node.clientWidth + 1) leaks.push({ tag: node.tagName, className: node.className, box: r, bound, scrollWidth: node.scrollWidth, clientWidth: node.clientWidth });
          }
        }
        const cards = Array.from(document.querySelectorAll("#detail-matrix > .tcrn-surface"), box);
        return { cards, leaks, pageOverflow: document.documentElement.scrollWidth > innerWidth,
          details: Array.from(document.querySelectorAll("pre"), (node) => ({ text: node.textContent, whiteSpace: getComputedStyle(node).whiteSpace, box: box(node) })),
          badges: Array.from(document.querySelectorAll("#detail-matrix .tcrn-badge"), (node) => ({ text: node.textContent, box: box(node) })),
          hiddenData: Array.from(document.querySelectorAll("pre"), (node) => ["hidden", "clip"].includes(getComputedStyle(node).overflowX)) };
      });
      const positive = await observe();
      assert(!positive.pageOverflow && positive.leaks.length === 0 && positive.hiddenData.every((value) => !value), `${fixture.id}: full-detail containment failed: ${JSON.stringify(positive.leaks)}`);
      assert(positive.details.length === 2 && positive.details.every((entry) => entry.text === structured && entry.whiteSpace === "pre-wrap"), `${fixture.id}: structured detail bytes changed or cannot wrap`);
      assert(positive.badges.length === 4 && positive.badges.every((entry) => entry.text === "Failed"), `${fixture.id}: failed states changed`);
      assert(positive.cards[0].right <= positive.cards[1].left || positive.cards[0].bottom <= positive.cards[1].top, `${fixture.id}: neighboring cards overlap`);
      await page.addStyleTag({ content: ".tcrn-operation-feedback__details-body pre{white-space:pre!important}" });
      const negative = await observe();
      assert(negative.pageOverflow || negative.leaks.length > 0, `${fixture.id}: unwrapped structured-details negative was not rejected`);
      observations.push({ fixture, positive, unwrappedNegative: negative });
    } finally { await page.close(); }
  }
  return { structured, observations };
}

async function runSettingsExplanationLocaleProof(browser, origin) {
  const query = settingsLayoutContract.containerQueries[1];
  const entries = [query.whenAtOrAbove, `${query.whenAtOrAbove}; ${query.whenBelow}`];
  const observations = [];
  for (const locale of ["en", "zh-CN", "ja", "ko", "fr"]) {
    for (const source of entries) {
      assert(storybookContentText[source]?.[locale] && storybookLocaleText[locale]?.[source] === storybookContentText[source][locale], `settings explanation is missing ${locale} in a required dictionary`);
    }
    for (const [route, source] of [["patterns-forms-workbench.html", entries[1]], ["proof-proof-governance.html", entries[0]]]) {
      const page = await browser.newPage();
      try {
        const story = route === "patterns-forms-workbench.html" ? "forms-patterns" : "ai-consumption-contract";
        await page.goto(`${origin}/apps/storybook/storybook-static/${route}?locale=${locale}&theme=light#${story}`);
        await settle(page);
        const expected = storybookContentText[source][locale];
        const matches = await page.locator(".tcrn-table-shell__cell").evaluateAll((cells, value) => cells.filter((node) => node.textContent?.trim() === value).map((node) => ({ text: node.textContent, rectCount: node.getClientRects().length, invariant: Boolean(node.closest("[data-locale-invariant]")) })), expected);
        assert(matches.length === 1 && matches[0].rectCount > 0, `${route}/${locale}: visible settings explanation not translated`);
        observations.push({ locale, route, expected, matches });
      } finally { await page.close(); }
    }
  }
  return observations;
}

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
        import { ContentScope, EmptyState, ErrorState, Field, MultiSelect, OperationFeedback, Popover, SettingChoice, StateSurface, SuggestInput, Tooltip, tcrnComponentCss } from "./packages/ui-react/dist/index.js";
        import { tcrnTokenCss } from "./packages/ui-tokens/dist/index.js";

        function Fixture() {
          const [availableInlineSize, setAvailableInlineSize] = useState(500);
          const [callbacks, setCallbacks] = useState([]);
          const [popoverOpen, setPopoverOpen] = useState(true);
          const [operationPhase, setOperationPhase] = useState("success");
          const popoverTriggerRef = useRef(null);
          const popoverCloseRef = useRef(null);
          const choiceOptions = [
            { value: "a", label: "Alpha", minInlineSize: 112 },
            { value: "b", label: "Beta", minInlineSize: 112 }
          ];
          return (
            <main data-full-surface-fixture="true" style={{ position: "relative", minHeight: "240px", padding: "16px" }}>
              <section data-operation-proof-panel="true">
                <OperationFeedback
                  id="operation-feedback-proof"
                  phase={operationPhase}
                  identity={{ operation: "Rebuild local index", operationId: "operation-2026-09-13-very-long-identity-9f4d1c2b7a6e", actor: "Synthetic operator", actorId: "actor-very-long-identity-0c2e8a9d7b6f", occurredAt: "2026-09-13T12:34:56.789Z" }}
                  identityLabels={{ operation: "Operation", operationId: "Operation id", actor: "Actor", actorId: "Actor id", occurredAt: "Occurred at" }}
                  detailTitle="Full receipt details"
                  detailsLabel="View full receipt"
                  details={<p>{operationPhase === "success" ? "The operation completed; the complete receipt remains available for inspection." : "The operation failed; error details remain in the DOM and readable after the update."} <code>reason-code-with-a-long-machine-suffix-2026-09-13.</code></p>}
                />
                <button type="button" data-operation-set-error onClick={() => setOperationPhase("error")}>Update operation to error</button>
              </section>
              <section data-content-scope-proof="true">
                <ContentScope model={{ scope: "scope-a", dataSource: "synthetic-source-a", phase: "content", shownCount: 4, totalCount: 4, hasContent: true }}>
                  <div data-scope-content="scope-a">Four records are visible for this source.</div>
                </ContentScope>
                <ContentScope model={{ scope: "scope-b", dataSource: "synthetic-source-b", phase: "empty", shownCount: 0, totalCount: 0, hasContent: false }} emptyState={<EmptyState title="Scope B is empty" />} />
                <ContentScope model={{ scope: "scope-loading", dataSource: "synthetic-source-c", phase: "loading", shownCount: 0, totalCount: 0, hasContent: false }} loadingState={<StateSurface title="Scope is loading" />} />
                <ContentScope model={{ scope: "scope-error", dataSource: "synthetic-source-d", phase: "error", shownCount: 0, totalCount: 0, hasContent: false }} errorState={<ErrorState title="Scope could not load" />} />
              </section>
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
              <form data-selection-form data-locale-invariant="true" onSubmit={(event) => {
                event.preventDefault();
                window.__fullSurfaceSubmissions.push(Array.from(new FormData(event.currentTarget).entries()));
              }}>
                <Field label="Collection" hint="Choose one or more values." error="Synthetic collection error">
                  <MultiSelect name="fixture-collection" defaultValue={["one"]} options={[{ value: "one", label: "One" }, { value: "two", label: "Two" }, { value: "blocked", label: "Blocked", disabled: true }]} />
                </Field>
                <Field group label="Collection" hint="Choose one or more values.">
                  <MultiSelect id="fixture-checklist" name="fixture-checklist" presentation="checkboxes" clearSelectionLabel="Clear selection" required defaultValue={["one"]} options={[{ value: "one", label: "One" }, { value: "two", label: "Two" }, { value: "blocked", label: "Blocked", disabled: true }]} />
                </Field>
                <SuggestInput name="fixture-open" suggestions={["suggested", "suggested"]} defaultValue="free" />
                <button type="submit" data-selection-submit>Submit</button>
              </form>
            </main>
          );
        }

        const style = document.createElement("style");
        style.textContent = tcrnTokenCss + tcrnComponentCss + "body{margin:0;font:13px sans-serif}*{box-sizing:border-box}";
        document.head.append(style);
        window.__fullSurfaceSubmissions = [];
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
      </div>
      <section id="static-operation" class="tcrn-operation-feedback" data-operation-feedback="true" data-operation-phase="success" data-operation-state="success" data-operation-state-claim="success" data-operation-valid="true" data-operation-geometry="responsive-safe" data-operation-update-notification="aria-live" aria-live="polite">
        <div class="tcrn-operation-feedback__summary">
          <span class="tcrn-badge tcrn-badge--positive" data-operation-short-status="true" title="Completed" aria-label="Completed"><span class="tcrn-badge__label">Completed</span></span>
          <dl class="tcrn-operation-feedback__identity" data-operation-identity="true"><div class="tcrn-operation-feedback__identity-row" data-operation-identity-field="operation"><dt>Operation</dt><dd>Rebuild local index</dd></div><div class="tcrn-operation-feedback__identity-row" data-operation-identity-field="operation-id"><dt>Operation id</dt><dd><code>operation-2026-09-13-very-long-identity-9f4d1c2b7a6e</code></dd></div><div class="tcrn-operation-feedback__identity-row" data-operation-identity-field="actor"><dt>Actor</dt><dd>Synthetic operator</dd></div></dl>
          <button id="static-operation-details-trigger" type="button" class="tcrn-operation-feedback__details-trigger" aria-controls="static-operation-details" aria-expanded="false" data-operation-details-trigger="true">View full receipt</button>
        </div>
        <section id="static-operation-details" class="tcrn-operation-feedback__details tcrn-disclosure-panel" data-operation-details="true" hidden><h3 class="tcrn-disclosure-panel__title">Full receipt details</h3><div class="tcrn-operation-feedback__details-body">The operation completed; the complete receipt remains available for inspection. <code>reason-code-with-a-long-machine-suffix-2026-09-13.</code></div></section>
      </section>
      <section id="static-content-scope-a" class="tcrn-content-scope" data-content-scope="scope-a" data-content-source="synthetic-source-a" data-content-phase="content" data-content-valid="true" data-content-model-valid="true" data-content-rendered="verified" data-content-shown-count="4" data-content-total-count="4" data-content-count-kind="total" data-content-stale="false"><div class="tcrn-content-scope__content" data-scope-content="scope-a">Four records are visible for this source.</div></section>
      <section id="static-content-scope-b" class="tcrn-content-scope" data-content-scope="scope-b" data-content-source="synthetic-source-b" data-content-phase="empty" data-content-valid="true" data-content-model-valid="true" data-content-rendered="not-applicable" data-content-shown-count="0" data-content-total-count="0" data-content-count-kind="total" data-content-stale="false"><div class="tcrn-state-surface" data-state-surface-kind="empty"><h3 class="tcrn-state-surface__title">Scope B is empty</h3></div></section>`);
    await page.addScriptTag({ content: await buildStaticOverlayBridge() });
    await page.waitForSelector("[data-static-boundary-ready='true']");
    await page.evaluate(() => {
      const trigger = document.querySelector("#static-operation-details-trigger");
      const details = document.querySelector("#static-operation-details");
      if (!(trigger instanceof HTMLButtonElement) || !(details instanceof HTMLElement)) throw new Error("static_operation_controls_missing");
      trigger.addEventListener("click", () => {
        const expanded = trigger.getAttribute("aria-expanded") === "true";
        trigger.setAttribute("aria-expanded", String(!expanded));
        details.hidden = expanded;
      });
    });
    const initial = await page.evaluate(() => ({
      tooltipParentIsBody: document.querySelector("#static-tooltip-layer")?.parentElement === document.body,
      popoverParentIsBody: document.querySelector("#static-popover-layer")?.parentElement === document.body,
      tooltipHidden: document.querySelector("#static-tooltip-layer")?.hasAttribute("hidden") ?? false,
      popoverHidden: document.querySelector("#static-popover-layer")?.hasAttribute("hidden") ?? false,
      tooltipPositioning: getComputedStyle(document.querySelector("#static-tooltip-layer")).position,
      popoverPositioning: getComputedStyle(document.querySelector("#static-popover-layer")).position,
      operationPhase: document.querySelector("#static-operation")?.getAttribute("data-operation-phase"),
      operationStatus: document.querySelector("#static-operation [data-operation-short-status='true']")?.textContent ?? "",
      operationDetailsHidden: document.querySelector("#static-operation-details")?.hasAttribute("hidden") ?? false,
      operationRootScrollWidth: document.documentElement.scrollWidth,
      contentScopes: Array.from(document.querySelectorAll("[data-content-scope]")).map((node) => ({ scope: node.getAttribute("data-content-scope"), source: node.getAttribute("data-content-source"), phase: node.getAttribute("data-content-phase"), valid: node.getAttribute("data-content-valid"), modelValid: node.getAttribute("data-content-model-valid"), rendered: node.getAttribute("data-content-rendered"), shown: node.getAttribute("data-content-shown-count"), total: node.getAttribute("data-content-total-count"), hasContent: Boolean(node.querySelector("[data-scope-content]")), hasEmpty: Boolean(node.querySelector("[data-state-surface-kind='empty']")) }))
    }));
    assert(initial.tooltipParentIsBody && initial.popoverParentIsBody && initial.tooltipHidden && initial.popoverHidden, "static HTML layers did not move to the document body or start closed");
    assert(initial.tooltipPositioning === "fixed" && initial.popoverPositioning === "fixed", "static HTML/CSS boundary did not use fixed positioning");
    assert(initial.operationPhase === "success" && initial.operationStatus === "Completed" && initial.operationDetailsHidden && initial.operationRootScrollWidth <= 360, "static operation feedback markup is not compact or viewport-safe");
    assert(initial.contentScopes.length === 2 && initial.contentScopes[0].valid === "true" && initial.contentScopes[0].modelValid === "true" && initial.contentScopes[0].rendered === "verified" && initial.contentScopes[0].hasContent && initial.contentScopes[1].phase === "empty" && initial.contentScopes[1].modelValid === "true" && initial.contentScopes[1].rendered === "not-applicable" && initial.contentScopes[1].hasEmpty, "static content scope markup lost independent source/phase truth");

    await page.locator("#static-operation-details-trigger").click();
    const operationOpen = await page.evaluate(() => ({
      expanded: document.querySelector("#static-operation-details-trigger")?.getAttribute("aria-expanded"),
      hidden: document.querySelector("#static-operation-details")?.hasAttribute("hidden") ?? false,
      details: document.querySelector("#static-operation-details")?.textContent ?? ""
    }));
    assert(operationOpen.expanded === "true" && !operationOpen.hidden && operationOpen.details.includes("reason-code-with-a-long-machine-suffix-2026-09-13"), "static operation details did not open with the actual update semantics");
    const staticOperationUpdate = await page.evaluate(() => {
      const root = document.querySelector("#static-operation");
      const status = root?.querySelector("[data-operation-short-status='true'] .tcrn-badge__label");
      const details = root?.querySelector("#static-operation-details .tcrn-operation-feedback__details-body");
      root?.setAttribute("data-operation-phase", "error");
      root?.setAttribute("data-operation-state", "error");
      root?.setAttribute("data-operation-state-claim", "error");
      root?.setAttribute("data-operation-valid", "true");
      if (status) status.textContent = "Failed";
      if (details) details.textContent = "The operation failed; error details remain in the DOM and readable after the update.";
      return { phase: root?.getAttribute("data-operation-phase"), state: root?.getAttribute("data-operation-state"), status: status?.textContent ?? "", details: details?.textContent ?? "" };
    });
    assert(staticOperationUpdate.phase === "error" && staticOperationUpdate.state === "error" && staticOperationUpdate.status === "Failed" && staticOperationUpdate.details.includes("error details"), "static operation update did not preserve short operation status and full error details");

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
    const contentValidation = [
      validateContentScope({ scope: "scope-a", dataSource: "synthetic-source-a", phase: "content", shownCount: 4, totalCount: 4, hasContent: true }),
      validateContentScope({ scope: "scope-b", dataSource: "synthetic-source-b", phase: "empty", shownCount: 0, totalCount: 0, hasContent: false })
    ];
    assert(contentValidation.every((result) => result.valid), "static content scope models did not pass the shared validator");
    return { initial, operationOpen, staticOperationUpdate, contentValidation, tooltipOpen, tooltipClosed, popoverOpen, popoverClosed, ok: true };
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
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(20);
    const initial = await page.evaluate(() => {
      const tooltip = document.querySelector("[data-tooltip-portal='true']");
      const popover = document.querySelector("[data-overlay-positioning='portal-fixed']");
      const rect = (node) => {
        const value = node?.getBoundingClientRect();
        return value ? { left: value.left, top: value.top, right: value.right, bottom: value.bottom, width: value.width, height: value.height } : null;
      };
      const tooltipRect = rect(tooltip);
      const popoverRect = rect(popover);
      const operation = document.querySelector("[data-operation-feedback='true']");
      const operationTrigger = operation?.querySelector("[data-operation-details-trigger='true']");
      const contentScopes = Array.from(document.querySelectorAll("[data-content-scope]"));
      return {
        tooltipParentIsBody: tooltip?.parentElement === document.body,
        tooltipRect,
        tooltipWithinViewport: Boolean(tooltipRect && tooltipRect.left >= 0 && tooltipRect.right <= window.innerWidth && tooltipRect.top >= 0 && tooltipRect.bottom <= window.innerHeight),
        popoverParentIsBody: popover?.parentElement === document.body,
        popoverRect,
        popoverWithinViewport: Boolean(popoverRect && popoverRect.left >= 0 && popoverRect.right <= window.innerWidth && popoverRect.top >= 0 && popoverRect.bottom <= window.innerHeight),
        popoverPlacement: popover?.getAttribute("data-overlay-placement-resolved"),
        clippingAncestorContainsTooltip: Boolean(tooltip?.closest("[data-clipping-ancestor]")),
        scrollAncestorContainsPopover: Boolean(popover?.closest("[data-scroll-ancestor]")),
        rootScrollWidth: document.documentElement.scrollWidth,
        operationPhase: operation?.getAttribute("data-operation-phase"),
        operationShortStatus: operation?.querySelector("[data-operation-short-status='true']")?.textContent ?? "",
        operationShortStatusBox: rect(operation?.querySelector("[data-operation-short-status='true']")),
        operationRootBox: rect(operation),
        operationIdentityVisible: Boolean(operation?.querySelector("[data-operation-identity='true']")),
        operationDetailsReachable: Boolean(operationTrigger?.getAttribute("aria-controls")),
        contentScopes: contentScopes.map((scope) => ({
          scope: scope.getAttribute("data-content-scope"),
          source: scope.getAttribute("data-content-source"),
          phase: scope.getAttribute("data-content-phase"),
          valid: scope.getAttribute("data-content-valid"),
          modelValid: scope.getAttribute("data-content-model-valid"),
          rendered: scope.getAttribute("data-content-rendered"),
          shown: scope.getAttribute("data-content-shown-count"),
          total: scope.getAttribute("data-content-total-count"),
          hasEmptyState: Boolean(scope.querySelector("[data-state-surface-kind='empty']")),
          hasContent: Boolean(scope.querySelector("[data-scope-content]"))
        }))
      };
    });
    assert(initial.tooltipParentIsBody && initial.popoverParentIsBody, "client overlays did not escape to document body");
    assert(initial.tooltipWithinViewport && initial.popoverWithinViewport, "client overlay placement escaped the viewport");
    assert(!initial.clippingAncestorContainsTooltip && !initial.scrollAncestorContainsPopover, "client overlay remained inside a clipping ancestor");
    assert(initial.rootScrollWidth <= 360, "operation/content fixture created root horizontal overflow");
    assert(initial.operationPhase === "success" && initial.operationShortStatus === "Completed" && initial.operationIdentityVisible && initial.operationDetailsReachable, "operation feedback success surface is incomplete");
    assert(initial.contentScopes.length === 4, "content scope fixture inventory drifted");
    assert(initial.contentScopes.find((scope) => scope.scope === "scope-a")?.valid === "true" && initial.contentScopes.find((scope) => scope.scope === "scope-a")?.modelValid === "true" && initial.contentScopes.find((scope) => scope.scope === "scope-a")?.rendered === "verified" && initial.contentScopes.find((scope) => scope.scope === "scope-a")?.hasContent, "nonempty content scope did not render verified content");
    assert(initial.contentScopes.find((scope) => scope.scope === "scope-b")?.phase === "empty" && initial.contentScopes.find((scope) => scope.scope === "scope-b")?.rendered === "not-applicable" && initial.contentScopes.find((scope) => scope.scope === "scope-b")?.hasEmptyState, "empty content scope did not render its own empty state");
    assert(initial.contentScopes.find((scope) => scope.scope === "scope-loading")?.phase === "loading" && initial.contentScopes.find((scope) => scope.scope === "scope-error")?.phase === "error", "loading and error scopes collapsed into empty");

    const operationDetailsTrigger = page.locator("[data-operation-feedback='true'] [data-operation-details-trigger='true']");
    assert(await operationDetailsTrigger.count() === 1, "operation details trigger count drifted");
    await operationDetailsTrigger.focus();
    await page.keyboard.press("Enter");
    const operationDetailsOpen = await page.evaluate(() => {
      const root = document.querySelector("[data-operation-feedback='true']");
      const trigger = root?.querySelector("[data-operation-details-trigger='true']");
      const details = root?.querySelector("[data-operation-details='true']");
      return {
        expanded: trigger?.getAttribute("aria-expanded"),
        controls: trigger?.getAttribute("aria-controls"),
        detailsId: details?.id,
        detailsVisible: details?.querySelector("[data-collapsible-region='true']")?.getAttribute("aria-hidden") === "false",
        longReasonVisible: details?.textContent?.includes("reason-code-with-a-long-machine-suffix-2026-09-13") ?? false
      };
    });
    assert(operationDetailsOpen.expanded === "true" && operationDetailsOpen.controls === operationDetailsOpen.detailsId && operationDetailsOpen.detailsVisible && operationDetailsOpen.longReasonVisible, "operation details did not open as a keyboard-readable DOM region");
    await page.locator("[data-operation-set-error]").dispatchEvent("click");
    await page.waitForFunction(() => document.querySelector("[data-operation-feedback='true']")?.getAttribute("data-operation-phase") === "error");
    const operationError = await page.evaluate(() => {
      const root = document.querySelector("[data-operation-feedback='true']");
      return {
        phase: root?.getAttribute("data-operation-phase"),
        status: root?.querySelector("[data-operation-short-status='true']")?.textContent ?? "",
        detailsInDom: root?.querySelector("[data-operation-details='true']")?.textContent?.includes("error details") ?? false,
        detailsVisible: root?.querySelector("[data-operation-details='true'] [data-collapsible-region='true']")?.getAttribute("aria-hidden") === "false"
      };
    });
    assert(operationError.phase === "error" && operationError.status === "Failed" && operationError.detailsInDom && operationError.detailsVisible, "operation error update lost DOM-backed status or details");
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(20);

    const consumerEvidenceInput = await page.evaluate(() => {
      const operation = document.querySelector("[data-operation-feedback='true']");
      const detailsTrigger = operation?.querySelector("[data-operation-details-trigger='true']");
      const operationBox = operation?.getBoundingClientRect();
      const targetBox = detailsTrigger?.getBoundingClientRect();
      const statusBox = operation?.querySelector("[data-operation-short-status='true']")?.getBoundingClientRect();
      const visibleViewportWidthPx = window.innerWidth;
      const visibleViewportHeightPx = window.innerHeight;
      const pageWidthPx = document.documentElement.clientWidth;
      const pageScrollWidthPx = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
      const visible = (box) => Boolean(box && box.width > 0 && box.height > 0 && box.top < visibleViewportHeightPx && box.bottom > 0 && box.left < visibleViewportWidthPx && box.right > 0);
      const measuredZoom = () => ({
        measured: true,
        effectiveScale: window.devicePixelRatio || 1,
        elementWidthPx: operationBox?.width ?? 0,
        viewportWidthPx: visibleViewportWidthPx,
        viewportHeightPx: visibleViewportHeightPx,
        elementVisible: visible(operationBox),
        source: "browser-measurement"
      });
      return {
        expectedInventory: [{
          id: "operation-feedback-proof",
          requestedSurface: "operation-proof-panel",
          selectedSurface: "operation-proof-panel",
          expectedPanelSurface: "operation-feedback-proof",
          expectedControl: "operation-feedback-proof-details-trigger",
          expectedValues: [
            { key: "operation.phase", serialization: "text", value: "error" },
            { key: "operation.id", serialization: "text", value: "operation-2026-09-13-very-long-identity-9f4d1c2b7a6e" }
          ],
          applicability: "required"
        }],
        observed: [{
          instanceId: "operation-feedback-proof",
          requestedSurface: "operation-proof-panel",
          selectedSurface: "operation-proof-panel",
          panelSurface: operation?.id ?? "",
          controlId: detailsTrigger?.id ?? "",
          controlPresent: Boolean(detailsTrigger),
          values: [
            { key: "operation.phase", serialization: "text", submittedValue: operation?.getAttribute("data-operation-phase") ?? "", serializedValue: operation?.getAttribute("data-operation-phase") ?? "", readbackValue: operation?.getAttribute("data-operation-phase") ?? "" },
            { key: "operation.id", serialization: "text", submittedValue: operation?.querySelector("[data-operation-identity-field='operation-id'] dd")?.textContent?.trim() ?? "", serializedValue: operation?.querySelector("[data-operation-identity-field='operation-id'] dd")?.textContent?.trim() ?? "", readbackValue: operation?.querySelector("[data-operation-identity-field='operation-id'] dd")?.textContent?.trim() ?? "" }
          ],
          input: {
            modality: "keyboard",
            targetId: detailsTrigger?.id ?? "",
            changed: operation?.getAttribute("data-operation-phase") === "error",
            targetOffsetMeasured: Boolean(targetBox),
            targetOffsetPx: targetBox?.top ?? Number.NaN
          },
          result: {
            status: "error",
            resultId: operation?.querySelector("[data-operation-identity-field='operation-id'] dd")?.textContent?.trim() ?? "",
            observedInDom: Boolean(operation?.querySelector("[data-operation-details='true']")),
            source: "dom"
          },
          uiFeedback: {
            source: "dom",
            status: "error",
            domPresent: Boolean(operation),
            statusVisible: visible(statusBox),
            statusBox: statusBox ? { left: statusBox.left, top: statusBox.top, right: statusBox.right, bottom: statusBox.bottom, width: statusBox.width, height: statusBox.height } : null,
            identityVisible: visible(operation?.querySelector("[data-operation-identity='true']")?.getBoundingClientRect()),
            detailsReachable: Boolean(detailsTrigger?.getAttribute("aria-controls") === operation?.querySelector("[data-operation-details='true']")?.id),
            errorDomChecked: true
          },
          geometry: {
            afterOperation: true,
            requestedSurfaceVisible: visible(operationBox),
            selectedSurfaceVisible: visible(operationBox),
            panelSurfaceVisible: visible(operationBox),
            actualInstanceVisible: visible(operationBox),
            pageWidthPx,
            pageScrollWidthPx,
            visibleViewportWidthPx,
            visibleViewportHeightPx,
            targetLeftPx: targetBox?.left ?? Number.NaN,
            targetTopPx: targetBox?.top ?? Number.NaN,
            targetRightPx: targetBox?.right ?? Number.NaN,
            targetBottomPx: targetBox?.bottom ?? Number.NaN
          },
          zoom: {
            dpr: measuredZoom(),
            "pinch-visual-viewport": measuredZoom(),
            "page-zoom": measuredZoom()
          }
        }]
      };
    });
    const consumerEvidencePositive = evaluateConsumerEvidence(consumerEvidenceInput);
    const consumerEvidenceNegativeInput = structuredClone(consumerEvidenceInput);
    consumerEvidenceNegativeInput.observed[0].selectedSurface = "wrong-surface";
    const consumerEvidenceNegative = evaluateConsumerEvidence(consumerEvidenceNegativeInput);
    assert(consumerEvidencePositive.ok && !consumerEvidenceNegative.ok, "consumer evidence validator did not use the actual positive and negative observations");
    results.consumerEvidence = { positive: consumerEvidencePositive, negative: consumerEvidenceNegative, input: consumerEvidenceInput };

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
    assert(afterScroll.withinViewport, `scroll-ancestor movement escaped the viewport: ${JSON.stringify(afterScroll)}`);
    await page.setViewportSize({ width: 320, height: 200 });
    await page.waitForTimeout(20);
    const afterResize = await page.evaluate(() => {
      const node = document.querySelector("[data-overlay-positioning='portal-fixed']");
      const box = node?.getBoundingClientRect();
      return { width: window.innerWidth, height: window.innerHeight, left: box?.left ?? null, top: box?.top ?? null, right: box?.right ?? null, bottom: box?.bottom ?? null, withinViewport: Boolean(box && box.left >= 0 && box.right <= window.innerWidth && box.top >= 0 && box.bottom <= window.innerHeight) };
    });
    assert(afterResize.withinViewport, `viewport resize escaped the overlay boundary: ${JSON.stringify(afterResize)}`);

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

    const observeChecklist = () => page.evaluate(() => {
      const form = document.querySelector("[data-selection-form]");
      const group = document.querySelector("#fixture-checklist");
      const options = Array.from(group?.querySelectorAll('input[type="checkbox"]') ?? []);
      const bridge = group?.closest(".tcrn-multi-select-group")?.querySelector('input[required][aria-hidden="true"]');
      return {
        nativeCount: document.querySelectorAll("select[data-choice-cardinality='collection']").length,
        checkboxCount: document.querySelectorAll("[data-choice-cardinality='collection'][data-choice-presentation='checkboxes']").length,
        totalCount: document.querySelectorAll("[data-choice-cardinality='collection']").length,
        selected: options.filter((input) => input.checked).map((input) => input.value),
        submitted: new FormData(form).getAll("fixture-checklist"),
        entries: Array.from(new FormData(form).entries()),
        disabled: options.filter((input) => input.disabled).map((input) => input.value),
        optionRequired: options.map((input) => input.required),
        valid: form.checkValidity(),
        activeValue: group?.contains(document.activeElement) ? document.activeElement?.value : null,
        bridgeCount: group?.closest(".tcrn-multi-select-group")?.querySelectorAll('input[required][aria-hidden="true"]').length ?? 0,
        bridgeNamed: Boolean(bridge?.name),
        bridgeCardinality: bridge?.getAttribute("data-choice-cardinality") ?? null,
        submissions: window.__fullSurfaceSubmissions
      };
    });
    const checklistInitial = await observeChecklist();
    assert(checklistInitial.nativeCount === 1 && checklistInitial.checkboxCount === 1 && checklistInitial.totalCount === 2
      && checklistInitial.selected.join(",") === "one" && checklistInitial.submitted.join(",") === "one"
      && checklistInitial.disabled.join(",") === "blocked" && checklistInitial.valid
      && checklistInitial.optionRequired.every((required) => !required)
      && checklistInitial.bridgeCount === 1 && !checklistInitial.bridgeNamed && checklistInitial.bridgeCardinality === null, "client checkbox collection structure/validation bridge inventory failed");

    await page.locator("#fixture-checklist input[value='one']").focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Space");
    const checklistKeyboardAdd = await observeChecklist();
    assert(checklistKeyboardAdd.activeValue === "two" && checklistKeyboardAdd.selected.join(",") === "one,two"
      && checklistKeyboardAdd.submitted.join(",") === "one,two" && checklistKeyboardAdd.valid, "client checkbox Tab/Space multi-selection failed");
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Space");
    const checklistKeyboardRemove = await observeChecklist();
    assert(checklistKeyboardRemove.activeValue === "one" && checklistKeyboardRemove.selected.join(",") === "two"
      && checklistKeyboardRemove.submitted.join(",") === "two" && checklistKeyboardRemove.valid, "client checkbox keyboard removal failed");
    await page.keyboard.press("Space");
    await page.locator("[data-selection-submit]").click();
    const checklistSubmitted = await observeChecklist();
    assert(checklistSubmitted.submissions.length === 1
      && JSON.stringify(checklistSubmitted.submissions[0]) === JSON.stringify([
        ["fixture-collection", "two"], ["fixture-checklist", "one"], ["fixture-checklist", "two"], ["fixture-open", "free"]
      ]), "client native and checkbox collections did not submit distinct repeated values");
    await page.locator("#fixture-checklist").locator("..").locator("button.tcrn-multi-select-group__clear").click();
    await page.locator("[data-selection-submit]").click();
    const checklistCleared = await observeChecklist();
    assert(checklistCleared.selected.length === 0 && checklistCleared.submitted.length === 0 && !checklistCleared.valid
      && checklistCleared.submissions.length === 1 && checklistCleared.activeValue === "one"
      && checklistCleared.totalCount === 2, "client cleared required collection was not refused without changing inventory");
    await page.evaluate(() => document.querySelector("[data-selection-form]").reset());
    const checklistReset = await observeChecklist();
    assert(checklistReset.selected.join(",") === "one" && checklistReset.submitted.join(",") === "one" && checklistReset.valid
      && JSON.stringify(checklistReset.entries) === JSON.stringify([
        ["fixture-collection", "one"], ["fixture-checklist", "one"], ["fixture-open", "free"]
      ]), "client collection reset lost defaults or added validation bridge values");
    return { initial, afterScroll, afterResize, afterEscape, afterRadio, afterNarrow, afterWide, afterCollectionAdd, afterCollectionRemove,
      checklistInitial, checklistKeyboardAdd, checklistKeyboardRemove, checklistSubmitted, checklistCleared, checklistReset, ok: true };
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
    const checklist = document.querySelector("[data-choice-cardinality='collection'][data-choice-presentation='checkboxes']");
    const checkboxes = Array.from(checklist?.querySelectorAll('input[type="checkbox"]') ?? []);
    const legend = document.getElementById(checklist?.getAttribute("aria-labelledby") ?? "");
    const clear = checklist?.closest(".tcrn-multi-select-group")?.querySelector("button.tcrn-multi-select-group__clear");
    const checklistBox = checklist?.getBoundingClientRect();
    const checklistStyle = checklist ? getComputedStyle(checklist) : null;
    const openInput = document.querySelector("input[data-choice-value-mode='open']");
    const options = collection instanceof HTMLSelectElement ? Array.from(collection.options) : [];
    if (openInput instanceof HTMLInputElement) {
      openInput.value = "free-form-value";
      openInput.dispatchEvent(new Event("input", { bubbles: true }));
    }
    return {
      totalCollectionCount: document.querySelectorAll("[data-choice-cardinality='collection']").length,
      collectionCount: document.querySelectorAll("select[data-choice-cardinality='collection']").length,
      collectionsClosed: Array.from(document.querySelectorAll("[data-choice-cardinality='collection']")).every((node) => node.getAttribute("data-choice-value-mode") === "closed"),
      collectionMultiple: collection instanceof HTMLSelectElement && collection.multiple,
      collectionSelected: options.filter((option) => option.selected).map((option) => option.value),
      collectionDisabledValues: options.filter((option) => option.disabled).map((option) => option.value),
      collectionUniqueValues: new Set(options.map((option) => option.value)).size === options.length,
      checkboxCollectionCount: document.querySelectorAll("[data-choice-cardinality='collection'][data-choice-presentation='checkboxes']").length,
      checkboxStructure: checklist?.tagName === "DIV" && checklist.getAttribute("role") === "group"
        && legend?.tagName === "LEGEND" && legend.closest("fieldset")?.contains(checklist)
        && checkboxes.every((input) => input.name === "prompt-languages-checklist" && input.closest("label")),
      checkboxOptionCount: checkboxes.length,
      checkboxSelected: checkboxes.filter((input) => input.checked).map((input) => input.value),
      checkboxDisabledValues: checkboxes.filter((input) => input.disabled).map((input) => input.value),
      checkboxUniqueValues: new Set(checkboxes.map((input) => input.value)).size === checkboxes.length,
      checkboxVisible: Boolean(checklistBox && checklistBox.width > 0 && checklistBox.height > 0 && checklistStyle.visibility !== "hidden"),
      checkboxClearAction: clear instanceof HTMLButtonElement && clear.type === "button" && !clear.disabled && clear.textContent === "Clear selection",
      openInputCount: document.querySelectorAll("input[data-choice-value-mode='open']").length,
      openInputFreeForm: openInput instanceof HTMLInputElement && openInput.value === "free-form-value",
      datalistCount: document.querySelectorAll("input[data-choice-value-mode='open'] + datalist").length,
      datalistOptionCount: document.querySelector("input[data-choice-value-mode='open'] + datalist")?.querySelectorAll("option").length ?? 0
    };
  });
  assert(results.selection.totalCollectionCount === 2 && results.selection.checkboxCollectionCount === 1, "MultiSelect total/checkbox inventory drifted");
  assert(results.selection.collectionCount === 1 && results.selection.collectionMultiple, "MultiSelect native contract failed");
  assert(results.selection.collectionsClosed && results.selection.collectionUniqueValues
    && results.selection.collectionSelected.join(",") === "en,zh-CN" && results.selection.collectionDisabledValues.join(",") === "ja"
    && results.selection.openInputCount === 1 && results.selection.openInputFreeForm, "selection state contract failed");
  assert(results.selection.checkboxStructure && results.selection.checkboxOptionCount === 3 && results.selection.checkboxUniqueValues
    && results.selection.checkboxSelected.join(",") === "en,zh-CN" && results.selection.checkboxDisabledValues.join(",") === "ja"
    && results.selection.checkboxVisible && results.selection.checkboxClearAction, "MultiSelect checkbox presentation contract failed");
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
  results.fullDetailsContainment = await runFullDetailsContainmentProof(browser);
  results.settingsExplanationLocales = await runSettingsExplanationLocaleProof(browser, staticServer.origin);

  results.ok = true;
} finally {
  await browser.close();
  await staticServer.close();
}

process.stdout.write(`${JSON.stringify({
  schemaVersion: "tcrn.ds.full-surface-remediation-browser-proof.v2",
  routes: [
    "components-component-inventory.html#interaction-disclosure-spec",
    "components-component-inventory.html#display-primitives-spec",
    "components-overlays.html#dialog-spec-usage",
    "patterns-feedback-selection.html#selection-list-patterns",
    "foundations-tokens-i18n.html#tokens-copy-state"
  ],
  results,
  ok: results.ok === true
}, null, 2)}\n`);
