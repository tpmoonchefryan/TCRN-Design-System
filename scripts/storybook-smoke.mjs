import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join } from "node:path";
import { chromium } from "@playwright/test";

const pagesByGroup = {
  Welcome: "index.html",
  "Style Guide": "style-guide.html",
  Foundations: "foundations.html",
  Components: "components.html",
  Patterns: "patterns.html",
  Proof: "proof.html",
  "Change Log": "change-log.html"
};
const requiredStories = [
  { id: "welcome-governance", group: "Welcome" },
  { id: "governance-boundaries", group: "Welcome" },
  { id: "maintainers-routing", group: "Welcome" },
  { id: "contribution-model", group: "Welcome" },
  { id: "release-bug-policy", group: "Welcome" },
  { id: "brand-identity", group: "Style Guide" },
  { id: "color-palette", group: "Style Guide" },
  { id: "text-styles", group: "Style Guide" },
  { id: "grid-system", group: "Style Guide" },
  { id: "icons-motion", group: "Style Guide" },
  { id: "global-states", group: "Style Guide" },
  { id: "copy-creation-rules", group: "Style Guide" },
  { id: "tokens-copy-state", group: "Foundations" },
  { id: "i18n-theme-contract", group: "Foundations" },
  { id: "copy-guidelines", group: "Foundations" },
  { id: "component-family-index", group: "Components" },
  { id: "display-primitives-spec", group: "Components" },
  { id: "interaction-disclosure-spec", group: "Components" },
  { id: "button-spec-usage", group: "Components" },
  { id: "field-spec-usage", group: "Components" },
  { id: "navigation-shell-spec", group: "Components" },
  { id: "dialog-spec-usage", group: "Components" },
  { id: "table-work-index-spec", group: "Components" },
  { id: "forms-patterns", group: "Patterns" },
  { id: "workbench-patterns", group: "Patterns" },
  { id: "readiness-notification-patterns", group: "Patterns" },
  { id: "selection-list-patterns", group: "Patterns" },
  { id: "modal-validation-patterns", group: "Patterns" },
  { id: "datagrid-fields-patterns", group: "Patterns" },
  { id: "big-list-search-patterns", group: "Patterns" },
  { id: "dashboard-page-templates", group: "Patterns" },
  { id: "proof-matrix", group: "Proof" },
  { id: "ai-consumption-contract", group: "Proof" },
  { id: "blocked-actions", group: "Proof" },
  { id: "overlay-focus", group: "Proof" },
  { id: "local-changelog", group: "Change Log" }
];
const pages = Object.fromEntries(Object.entries(pagesByGroup).map(([group, file]) => [
  group,
  readFileSync(`apps/storybook/storybook-static/${file}`, "utf8")
]));
const combinedHtml = Object.values(pages).join("\n");
const contract = JSON.parse(readFileSync("apps/storybook/storybook-static/ai-consumption-contract.json", "utf8"));
const llmsTxt = readFileSync("apps/storybook/storybook-static/llms.txt", "utf8");
const robotsTxt = readFileSync("apps/storybook/storybook-static/robots.txt", "utf8");
const staticRoot = "apps/storybook/storybook-static";
const productShellComparatorContract = {
  styleSource: "@tcrn/ui-react/tcrnComponentCss",
  page: "components.html#navigation-shell-spec",
  scopedSelector: ".tcrn-product-shell-contract-proof .tcrn-product-shell",
  componentSelectors: {
    themeToggle: ".tcrn-shell-theme-toggle",
    localeTrigger: ".tcrn-shell-locale-menu__trigger",
    sideNavToggle: ".tcrn-shell-side-nav-toggle",
    searchWrapper: ".tcrn-product-shell-search",
    searchInput: ".tcrn-search-input",
    searchResults: ".tcrn-product-shell-search__results",
    topBar: ".tcrn-top-bar",
    contentRegion: "[data-product-shell-region=\"content\"]"
  },
  expectedControlMetrics: {
    themeToggle: { width: 38, height: 38, radius: 5 },
    sideNavToggle: { width: 38, height: 38, radius: 5 },
    localeTrigger: { minHeight: 38, radius: 5 },
    searchInput: { minHeight: 38, radius: 5, minWidth: 220 }
  },
  motionProof: {
    productShellTransition: "grid-template-columns",
    searchTransition: "width",
    themeWashPseudo: "tcrn-product-shell-theme-wash",
    reducedMotionFallback: "transition-none"
  }
};
const required = [
  "data-doc-shell=\"online-docs\"",
  "data-doc-nav=\"sections\"",
  "data-doc-chapter-pager=\"true\"",
  "data-anchor-scroll-controlled=\"true\"",
  "<link rel=\"icon\" href=\"tcrn-brand-mark.svg\" type=\"image/svg+xml\" />",
  "--tcrn-anchor-scroll-offset: 96px",
  "tcrnStorybookScrollToHash",
  "keepActiveLinkVisible",
  "data-i18n-locale-select",
  "data-storybook-locale=\"en\"",
  "data-storybook-supported-locales=\"zh-CN,en,ja,ko,fr\"",
  "data-storybook-theme=\"light\"",
  "data-storybook-supported-themes=\"light,dark\"",
  "data-storybook-theme-control",
  "data-storybook-theme-toggle",
  "data-current-theme=\"light\"",
  "data-storybook-theme-option=\"dark\"",
  "tcrn-design-system-storybook-theme",
  "data-doc-shell-icon=\"theme-light\"",
  "data-doc-shell-icon=\"theme-dark\"",
  "--tcrn-doc-motion-spring: 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  "--tcrn-doc-motion-smooth: 0.4s ease",
  "--tcrn-doc-theme-crossfade-duration: 0.4s",
  "::view-transition-old(root)",
  "::view-transition-new(root)",
  "data-theme-switching",
  "tcrn-doc-theme-transition-wash",
  "document.startViewTransition",
  "runFallbackThemeTransition",
  "--tcrn-doc-header-search-resting-width: 180px",
  "--tcrn-doc-header-search-expanded-width: 320px",
  "data-locale-menu-toggle",
  "data-doc-shell-icon=\"locale-globe\"",
  "data-locale-current-name",
  "data-locale-menu-option",
  "data-locale-name=\"简体中文\"",
  "option value=\"zh-CN\"",
  "option value=\"en\"",
  "option value=\"ja\"",
  "option value=\"ko\"",
  "option value=\"fr\"",
  "data-i18n=\"story.welcome-governance.title\"",
  "TCRN デザインシステム契約ストーリー",
  "TCRN 디자인 시스템 계약 스토리",
  "data-contract-surface=\"tcrn-design-system-storybook\"",
  "data-contract-story-id=\"tokens-copy-state\"",
  "data-contract-story-id=\"brand-identity\"",
  "data-contract-story-id=\"color-palette\"",
  "data-contract-story-id=\"dashboard-page-templates\"",
  "data-contract-story-id=\"ai-consumption-contract\"",
  "data-ai-consumption-contract-story=\"true\"",
  "ai-consumption-contract.json",
  "rel=\"alternate\" type=\"application/json\" href=\"ai-consumption-contract.json\"",
  "data-tcrn-ai-consumption-contract=\"true\"",
  "rel=\"help\" type=\"text/plain\" href=\"llms.txt\"",
  "name=\"tcrn-ai-consumption-contract\" content=\"ai-consumption-contract.json\"",
  "name=\"tcrn-ai-consumption-contract-route\" content=\"proof.html#ai-consumption-contract\"",
  "name=\"tcrn-ai-consumption-contract-required\" content=\"must-read-first\"",
  "Light and dark Storybook shell",
  "Docs shell control contract",
  "Use one circular icon-only button",
  "one whole-page transition",
  "current locale name in that locale",
  "Keep search compact at rest, expand smoothly on focus, and collapse on blur",
  "not as a top-bar human navigation item",
  "Storybook shell controls",
  "single icon theme toggle, native-name locale menu, focus-expanded search, no AI JSON link in the top bar, and one whole-page theme transition",
  "Theme modes",
  "aria-label=\"TCRN brand mark\"",
  "src=\"tcrn-brand-mark.svg\"",
  "tcrn-brand-lockup--long-name",
  "tcrn-brand-wordmark__suffix--design-system",
  "Four large rounded diamond tiles use iris blue, violet-blue, aqua, and slate with tight even gaps.",
  "Each point uses a white ring with a same-family inner color that differs from the tile fill.",
  "No red, pink, coral, or orange connector points.",
  "Product adoption, publication, release readiness, product acceptance, and final MVP acceptance are not claimed.",
  "tcrn-shell-layer",
  "data-shell-layer=\"mega-menu\"",
  "tcrn-knowledge-shell-layout",
  "data-standard-shell=\"online-docs\"",
  "tcrn-knowledge-shell__topbar",
  "tcrn-knowledge-shell__sidebar",
  "tcrn-knowledge-shell__content",
  "tcrn-knowledge-shell__pager",
  "Top bar, attached side navigation, content column, and chapter navigation stay one shell"
];
const componentPage = pages.Components;
const staticDocStyleIndex = componentPage.indexOf("data-tcrn-static-doc-style-source=\"storybook\"");
const componentStyleIndex = componentPage.indexOf("data-tcrn-component-style-source=\"@tcrn/ui-react\"");
if (staticDocStyleIndex < 0) {
  required.push("data-tcrn-static-doc-style-source=\"storybook\"");
}
if (componentStyleIndex < 0) {
  required.push("data-tcrn-component-style-source=\"@tcrn/ui-react\"");
}
if (componentStyleIndex >= 0 && staticDocStyleIndex >= 0 && componentStyleIndex < staticDocStyleIndex) {
  required.push("component-style-after-static-doc-style");
}
for (const text of [
  "data-tcrn-product-shell-comparator-style=\"package-backed\"",
  ".tcrn-product-shell",
  ".tcrn-shell-theme-toggle",
  ".tcrn-shell-locale-menu__trigger",
  ".tcrn-shell-side-nav-toggle",
  ".tcrn-product-shell-search[data-search-expanded=\"true\"]",
  ".tcrn-product-shell[data-theme-switching=\"true\"]::after",
  "tcrn-product-shell-theme-wash",
  "@media (prefers-reduced-motion: reduce)"
]) {
  required.push(text);
}
const missing = required.filter((text) => !combinedHtml.includes(text));
if (contract.mustReadFirst !== true) {
  missing.push("contract.mustReadFirst:true");
}
for (const route of ["ai-consumption-contract.json", "llms.txt", "proof.html#ai-consumption-contract"]) {
  if (!contract.firstReadRoutes?.includes(route)) {
    missing.push(`contract.firstReadRoutes:${route}`);
  }
}
for (const field of ["contractVersion", "contractPayloadDigest", "artifact", "route", "readAt", "coveredRules", "requiredProof", "noOverclaimBoundaries"]) {
  if (!contract.requiredReadbackFields?.includes(field)) {
    missing.push(`contract.requiredReadbackFields:${field}`);
  }
}
if (!llmsTxt.includes("Agents must read ai-consumption-contract.json before implementation work.")) {
  missing.push("llms-first-read-requirement");
}
if (!llmsTxt.includes("Required readback fields: contractVersion, contractPayloadDigest, artifact, route, readAt, coveredRules, requiredProof, noOverclaimBoundaries")) {
  missing.push("llms-required-readback-fields");
}
if (!robotsTxt.includes("AI-Consumption-Contract: ai-consumption-contract.json")) {
  missing.push("robots-ai-contract-pointer");
}
const forbidden = [
  "data-contract-story-id=\"aos-operations-cockpit-standard\"",
  "data-contract-story-id=\"aos-docs-readiness-standard\"",
  "data-contract-story-id=\"aos-product-design-target-set-standard\"",
  "data-aos-served-surface-standard=",
  "data-aos-component-registration=\"registered\"",
  "data-aos-exception-record=\"brand-lockup-product-specific\""
].filter((text) => combinedHtml.includes(text));
if (forbidden.length > 0) {
  missing.push(...forbidden.map((text) => `forbidden:${text}`));
}
for (const [group, html] of Object.entries(pages)) {
  const defaultStory = requiredStories.find((story) => story.group === group);
  if (!html.includes(`data-active-story-section="${group}"`)) {
    missing.push(`data-active-story-section="${group}"`);
  }
  if (!html.includes(`data-story-section="${group}"`)) {
    missing.push(`data-story-section="${group}"`);
  }
  if (!html.includes(`data-story-nav="${group}" aria-current="page"`)) {
    missing.push(`data-story-nav="${group}" aria-current="page"`);
  }
  if (!defaultStory || !html.includes(`data-doc-nav-item="${defaultStory.id}" aria-current="location" data-doc-nav-item-active="true"`)) {
    missing.push(`current-doc-nav-item:${group}:${defaultStory?.id ?? "missing"}`);
  }
  const groupNavCount = html.match(/data-doc-nav-group="/g)?.length ?? 0;
  if (groupNavCount !== Object.keys(pagesByGroup).length) {
    missing.push(`doc-nav-group-count:${group}:${groupNavCount}`);
  }
  const storyNavCount = html.match(/data-doc-nav-item="/g)?.length ?? 0;
  if (storyNavCount !== requiredStories.length) {
    missing.push(`doc-nav-story-count:${group}:${storyNavCount}`);
  }
  const currentStoryNavCount = html.match(/<a [^>]*data-doc-nav-item-active="true"/g)?.length ?? 0;
  if (currentStoryNavCount !== 1) {
    missing.push(`doc-nav-current-story-count:${group}:${currentStoryNavCount}`);
  }
  const ariaCurrentStoryCount = html.match(/<a [^>]*aria-current="location"/g)?.length ?? 0;
  if (ariaCurrentStoryCount !== 1) {
    missing.push(`doc-nav-current-story-aria-count:${group}:${ariaCurrentStoryCount}`);
  }
  const sectionCount = html.match(/data-story-section="/g)?.length ?? 0;
  if (sectionCount !== 1) {
    missing.push(`single-section-page:${group}:${sectionCount}`);
  }
}
for (const story of requiredStories) {
  if (!pages[story.group].includes(`data-story-id="${story.id}"`)) {
    missing.push(`owning-page-story:${story.group}:${story.id}`);
  }
  for (const html of Object.values(pages)) {
    if (!html.includes(`data-doc-nav-item="${story.id}"`)) {
      missing.push(`missing-doc-nav-item:${story.id}`);
    }
  }
  for (const [group, html] of Object.entries(pages)) {
    if (group !== story.group && html.includes(`data-story-id="${story.id}"`)) {
      missing.push(`cross-section-story:${group}:${story.id}`);
    }
  }
}
if (pages.Welcome.includes("data-story-id=\"component-family-index\"")) {
  missing.push("legacy-single-page-stack:index-includes-components");
}
if (pages.Welcome.includes("data-story-id=\"color-palette\"")) {
  missing.push("legacy-single-page-stack:index-includes-style-guide");
}
if (pages["Style Guide"].includes("data-story-id=\"tokens-copy-state\"")) {
  missing.push("style-guide-includes-foundations-story");
}
if (combinedHtml.includes("data-doc-global-nav=\"sections\"")) {
  missing.push("duplicate-topbar-global-nav-present");
}
if (combinedHtml.includes("data-doc-global-nav-item=\"")) {
  missing.push("duplicate-topbar-global-nav-item-present");
}
const forbiddenPositiveHits = [
  /\bproduct accepted\b/i,
  /\bfinal mvp accepted\b/i,
  /\brelease ready\b/i,
  /\bdeployment ready\b/i,
  /\bpublic ready\b/i
].filter((pattern) => pattern.test(combinedHtml)).map((pattern) => String(pattern));
const storybookPreviewExists = combinedHtml.includes("data-contract-surface=\"tcrn-design-system-storybook\"");
const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8"
};

function startStaticServer(rootDirectory) {
  return new Promise((resolve, reject) => {
    const server = createServer((request, response) => {
      const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1");
      const pathname = decodeURIComponent(requestUrl.pathname);
      const fileName = pathname === "/" ? "index.html" : pathname.replace(/^\//, "");
      if (fileName.includes("..")) {
        response.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
        response.end("invalid path");
        return;
      }
      try {
        const filePath = join(rootDirectory, fileName);
        const body = readFileSync(filePath);
        response.writeHead(200, { "content-type": contentTypes[extname(filePath)] ?? "application/octet-stream" });
        response.end(body);
      } catch {
        response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
        response.end("not found");
      }
    });
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close();
        reject(new Error("storybook_smoke_server_address_unavailable"));
        return;
      }
      resolve({ server, origin: `http://127.0.0.1:${address.port}` });
    });
  });
}

function parsePixels(value) {
  const parsed = Number.parseFloat(String(value).replace("px", ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeTransitionProperty(value) {
  return String(value).split(",").map((part) => part.trim()).filter(Boolean);
}

function validateMetric({ failures, name, metric, expected }) {
  const width = Number(metric.width.toFixed(2));
  const height = Number(metric.height.toFixed(2));
  const radius = parsePixels(metric.borderRadius);
  const minWidth = expected.minWidth ?? expected.width;
  const minHeight = expected.minHeight ?? expected.height;
  if (expected.width !== undefined && Math.abs(width - expected.width) > 1) {
    failures.push(`${name}:width:${width}`);
  }
  if (expected.height !== undefined && Math.abs(height - expected.height) > 1) {
    failures.push(`${name}:height:${height}`);
  }
  if (minWidth !== undefined && width + 1 < minWidth) {
    failures.push(`${name}:min-width:${width}`);
  }
  if (minHeight !== undefined && height + 1 < minHeight) {
    failures.push(`${name}:min-height:${height}`);
  }
  if (Math.abs(radius - expected.radius) > 1) {
    failures.push(`${name}:radius:${metric.borderRadius}`);
  }
  if (metric.borderStyle === "outset") {
    failures.push(`${name}:default-browser-border-style`);
  }
  if (metric.backgroundColor === "rgba(0, 0, 0, 0)" || metric.backgroundColor === "transparent") {
    failures.push(`${name}:transparent-background`);
  }
}

function transitionIncludes(metric, property) {
  const properties = normalizeTransitionProperty(metric.transitionProperty);
  return properties.includes(property) || properties.includes("all");
}

async function collectProductShellMetrics(origin, viewport, reducedMotion) {
  const browser = await chromium.launch({
    headless: true,
    args: [
      "--disable-gpu",
      "--font-render-hinting=none",
      "--force-color-profile=srgb"
    ]
  });
  const page = await browser.newPage({
    viewport,
    deviceScaleFactor: 1,
    colorScheme: "light",
    reducedMotion,
    locale: "en-US",
    timezoneId: "UTC"
  });
  const pageErrors = [];
  const consoleMessages = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      consoleMessages.push(`${message.type()}:${message.text()}`);
    }
  });
  await page.goto(`${origin}/components.html#navigation-shell-spec`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts?.ready);
  const metrics = await page.evaluate(({ contract }) => {
    const shell = document.querySelector(contract.scopedSelector);
    if (!shell) {
      return { missingShell: true };
    }
    const measured = {};
    const measure = (name, selector) => {
      const element = shell.querySelector(selector);
      if (!element) {
        measured[name] = { missing: true };
        return;
      }
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      measured[name] = {
        width: rect.width,
        height: rect.height,
        left: rect.left,
        top: rect.top,
        display: style.display,
        position: style.position,
        gridTemplateColumns: style.gridTemplateColumns,
        gap: style.gap,
        paddingLeft: style.paddingLeft,
        paddingRight: style.paddingRight,
        borderRadius: style.borderRadius,
        borderStyle: style.borderStyle,
        borderWidth: style.borderWidth,
        backgroundColor: style.backgroundColor,
        transitionProperty: style.transitionProperty,
        transitionDuration: style.transitionDuration,
        animationName: style.animationName
      };
    };
    for (const [name, selector] of Object.entries(contract.componentSelectors)) {
      measure(name, selector);
    }
    const shellRect = shell.getBoundingClientRect();
    const shellStyle = getComputedStyle(shell);
    shell.setAttribute("data-theme-switching", "true");
    const themeWashStyle = getComputedStyle(shell, "::after");
    const documentElement = document.documentElement;
    return {
      missingShell: false,
      shell: {
        width: shellRect.width,
        height: shellRect.height,
        gridTemplateColumns: shellStyle.gridTemplateColumns,
        transitionProperty: shellStyle.transitionProperty,
        transitionDuration: shellStyle.transitionDuration,
        backgroundColor: shellStyle.backgroundColor,
        color: shellStyle.color,
        themeWashAnimationName: themeWashStyle.animationName,
        themeWashAnimationDuration: themeWashStyle.animationDuration,
        sourceMarker: document.querySelector("style[data-tcrn-component-style-source=\"@tcrn/ui-react\"]")?.getAttribute("data-tcrn-product-shell-comparator-style") ?? null
      },
      measured,
      viewport: { width: window.innerWidth, height: window.innerHeight, scrollWidth: documentElement.scrollWidth }
    };
  }, { contract: productShellComparatorContract });
  await browser.close();
  return { ...metrics, pageErrors, consoleMessages, reducedMotion, viewport };
}

async function runProductShellComparatorProof() {
  const failures = [];
  const { server, origin } = await startStaticServer(staticRoot);
  try {
    const desktop = await collectProductShellMetrics(origin, { width: 1440, height: 900 }, "no-preference");
    const reduced = await collectProductShellMetrics(origin, { width: 1440, height: 900 }, "reduce");
    const mobile = await collectProductShellMetrics(origin, { width: 390, height: 844 }, "no-preference");
    for (const [mode, proof] of Object.entries({ desktop, reduced, mobile })) {
      if (proof.missingShell) failures.push(`${mode}:missing-product-shell-comparator`);
      for (const error of proof.pageErrors ?? []) failures.push(`${mode}:pageerror:${error}`);
      for (const message of proof.consoleMessages ?? []) failures.push(`${mode}:console:${message}`);
    }
    if (!desktop.missingShell) {
      if (desktop.shell.sourceMarker !== "package-backed") {
        failures.push("desktop:missing-package-backed-style-marker");
      }
      for (const [name, expected] of Object.entries(productShellComparatorContract.expectedControlMetrics)) {
        const metric = desktop.measured[name];
        if (!metric || metric.missing) {
          failures.push(`${name}:missing`);
        } else {
          validateMetric({ failures, name, metric, expected });
        }
      }
      if (!transitionIncludes(desktop.shell, productShellComparatorContract.motionProof.productShellTransition)) {
        failures.push(`product-shell-transition:${desktop.shell.transitionProperty}`);
      }
      if (!transitionIncludes(desktop.measured.searchWrapper, productShellComparatorContract.motionProof.searchTransition)) {
        failures.push(`search-transition:${desktop.measured.searchWrapper.transitionProperty}`);
      }
      if (desktop.shell.themeWashAnimationName !== productShellComparatorContract.motionProof.themeWashPseudo) {
        failures.push(`theme-wash-animation:${desktop.shell.themeWashAnimationName}`);
      }
      if (desktop.measured.searchResults?.display === "none") {
        failures.push("search-results-not-visible-for-expanded-proof");
      }
    }
    if (!reduced.missingShell) {
      if (reduced.shell.transitionProperty !== "none") {
        failures.push(`reduced-motion-product-shell-transition:${reduced.shell.transitionProperty}`);
      }
      if (reduced.measured.searchWrapper?.transitionProperty !== "none") {
        failures.push(`reduced-motion-search-transition:${reduced.measured.searchWrapper?.transitionProperty}`);
      }
      if (reduced.shell.themeWashAnimationName !== "none") {
        failures.push(`reduced-motion-theme-wash:${reduced.shell.themeWashAnimationName}`);
      }
    }
    if (!mobile.missingShell) {
      if (mobile.viewport.scrollWidth > mobile.viewport.width + 1) {
        failures.push(`mobile-horizontal-overflow:${mobile.viewport.scrollWidth}>${mobile.viewport.width}`);
      }
      if (mobile.measured.sideNavToggle?.width > 44 || mobile.measured.themeToggle?.width > 44) {
        failures.push("mobile-control-size-exceeds-package-shell-boundary");
      }
      if (mobile.measured.contentRegion?.width > mobile.viewport.width + 1) {
        failures.push(`mobile-content-width:${mobile.measured.contentRegion.width}`);
      }
    }
    return {
      ok: failures.length === 0,
      failures,
      contract: productShellComparatorContract,
      readbacks: {
        desktop,
        reducedMotion: reduced,
        mobile
      },
      routeOwnedLoopbackServer: "127.0.0.1:<ephemeral>"
    };
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

async function main() {
  const productShellComparatorProof = await runProductShellComparatorProof().catch((error) => ({
    ok: false,
    failures: [`product-shell-comparator-proof-error:${error instanceof Error ? error.message : String(error)}`],
    contract: productShellComparatorContract
  }));
  const ok = missing.length === 0
    && forbiddenPositiveHits.length === 0
    && storybookPreviewExists
    && productShellComparatorProof.ok;
  console.log(JSON.stringify({
    ok,
    missing,
    forbiddenPositiveHits,
    storybookPreviewExists,
    pages: pagesByGroup,
    productShellComparatorProof
  }, null, 2));
  if (!ok) {
    process.exit(1);
  }
}

await main();
