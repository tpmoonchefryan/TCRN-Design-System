import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { chromium } from "@playwright/test";

const staticRoot = join(process.cwd(), "apps/storybook/storybook-static");
const contentTypes = {
  ".css": "text/css",
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml"
};

function serveStaticSurface() {
  return createServer((request, response) => {
    const requested = decodeURIComponent((request.url ?? "/").split("?")[0]);
    const normalized = normalize(requested === "/" ? "/index.html" : requested);
    const relative = normalized.startsWith("/") ? normalized.slice(1) : normalized;
    const filePath = join(staticRoot, relative);
    if (!filePath.startsWith(staticRoot) || !existsSync(filePath)) {
      response.statusCode = 404;
      response.end("not found");
      return;
    }
    response.setHeader("content-type", contentTypes[extname(filePath)] ?? "application/octet-stream");
    response.end(readFileSync(filePath));
  });
}

const server = serveStaticSurface();
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

try {
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`http://127.0.0.1:${port}/components-component-inventory.html?locale=en#display-primitives-spec`);
    const rendered = await page.locator("#display-primitives-spec").evaluate((root) => ({
      storyExpanded: root.querySelector(".tcrn-story-disclosure")?.getAttribute("aria-expanded") === "true",
      switchOn: root.querySelector(".tcrn-switch[data-switch-state=on]") !== null,
      statTones: [...root.querySelectorAll(".tcrn-stat-card")].map((node) => node.getAttribute("data-stat-tone")),
      settingModified: root.querySelector(".tcrn-setting-row[data-modified=true] .tcrn-setting-row__modified[role=img]") !== null,
      fieldOverridden: root.querySelector(".tcrn-field-provenance[data-provenance-state=overridden]") !== null,
      editorWarning: root.querySelector(".tcrn-line-numbered-editor [data-editor-finding-line=\"2\"]") !== null,
      statusRole: root.querySelector(".tcrn-app-status-bar[role=status]") !== null,
      definitionTerms: root.querySelectorAll(".tcrn-definition-list dt").length,
      lockHint: root.querySelector(".tcrn-lock-hint[role=note]") !== null
    }));
    const ok = rendered.storyExpanded
      && rendered.switchOn
      && rendered.statTones.includes("positive")
      && rendered.statTones.includes("warning")
      && rendered.settingModified
      && rendered.fieldOverridden
      && rendered.editorWarning
      && rendered.statusRole
      && rendered.definitionTerms === 2
      && rendered.lockHint;
    const receipt = {
      schemaVersion: "tcrn.inc254-story-dom-proof.v1",
      route: "components-component-inventory.html#display-primitives-spec",
      viewport: "desktop-1440x900",
      rendered,
      ok
    };
    console.log(JSON.stringify(receipt, null, 2));
    if (!ok) process.exitCode = 1;
  } finally {
    await browser.close();
  }
} finally {
  await new Promise((resolve) => server.close(resolve));
}
