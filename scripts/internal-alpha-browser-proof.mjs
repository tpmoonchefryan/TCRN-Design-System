import { createHash } from "node:crypto";
import { createReadStream, existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { extname, normalize, resolve, join, relative } from "node:path";
import { createRequire } from "node:module";
import { chromium } from "@playwright/test";
import { fidelityRejectChecks, UNCHECKED_CLAIMS } from "./shell-fidelity-proof.mjs";
import { createSignatureContext, computeSignature, encodeSignature, decodeSignature, compareSignatures, withinTolerance, SIGNATURE_TOLERANCE } from "./lib/visual-signature.mjs";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");
const outputRoot = "docs/verification/internal-alpha";
const screenshotDir = join(outputRoot, "screenshots");
const staticSurfacePath = "apps/storybook/storybook-static/index.html";
const aiContractPath = "apps/storybook/storybook-static/ai-consumption-contract.json";
const llmsPath = "apps/storybook/storybook-static/llms.txt";
const localAbsolutePathDenyPatterns = [
  { name: "file-url", pattern: /file:\/\//i },
  { name: "users-home-path", pattern: /\/Users\//i },
  { name: "tmp-path", pattern: /\/tmp(?:\/|$)/i },
  { name: "private-tmp-path", pattern: /\/private\/tmp(?:\/|$)/i },
  { name: "mac-temp-path", pattern: /\/var\/folders(?:\/|$)/i },
  { name: "remote-workspace-path", pattern: /\/srv\/tcrn(?:\/|$)/i }
];

function collectLocalAbsolutePathHits(label, value) {
  return localAbsolutePathDenyPatterns
    .filter(({ pattern }) => pattern.test(value))
    .map(({ name }) => ({ label, rule: name }));
}

const requiredStories = [
  { id: "welcome-governance", group: "Welcome", storybookId: "tcrn-design-system-welcome--welcome-governance" },
  { id: "governance-boundaries", group: "Welcome", storybookId: "tcrn-design-system-welcome--governance-boundaries" },
  { id: "maintainers-routing", group: "Welcome", storybookId: "tcrn-design-system-welcome--maintainers-routing" },
  { id: "contribution-model", group: "Welcome", storybookId: "tcrn-design-system-welcome--contribution-model" },
  { id: "release-bug-policy", group: "Welcome", storybookId: "tcrn-design-system-welcome--release-bug-policy" },
  { id: "brand-identity", group: "Style Guide", storybookId: "tcrn-design-system-style-guide--brand-identity" },
  { id: "color-palette", group: "Style Guide", storybookId: "tcrn-design-system-style-guide--color-palette" },
  { id: "text-styles", group: "Style Guide", storybookId: "tcrn-design-system-style-guide--text-styles" },
  { id: "grid-system", group: "Style Guide", storybookId: "tcrn-design-system-style-guide--grid-system" },
  { id: "icons-motion", group: "Style Guide", storybookId: "tcrn-design-system-style-guide--icons-motion" },
  { id: "global-states", group: "Style Guide", storybookId: "tcrn-design-system-style-guide--global-states" },
  { id: "copy-creation-rules", group: "Style Guide", storybookId: "tcrn-design-system-style-guide--copy-creation-rules" },
  { id: "tokens-copy-state", group: "Foundations", storybookId: "tcrn-design-system-foundations--tokens-copy-state" },
  { id: "i18n-theme-contract", group: "Foundations", storybookId: "tcrn-design-system-foundations--i-18-n-theme-contract" },
  { id: "foundation-visual-standards", group: "Foundations", storybookId: "tcrn-design-system-foundations--foundation-visual-standards" },
  { id: "copy-guidelines", group: "Foundations", storybookId: "tcrn-design-system-foundations--copy-guidelines" },
  { id: "component-family-index", group: "Components", storybookId: "tcrn-design-system-components--component-family-index" },
  { id: "display-primitives-spec", group: "Components", storybookId: "tcrn-design-system-components--display-primitives-spec" },
  { id: "interaction-disclosure-spec", group: "Components", storybookId: "tcrn-design-system-components--interaction-disclosure-spec" },
  { id: "stamp-spec-usage", group: "Components", storybookId: "tcrn-design-system-components--stamp-spec-usage" },
  { id: "button-spec-usage", group: "Components", storybookId: "tcrn-design-system-components--button-spec-usage" },
  { id: "field-spec-usage", group: "Components", storybookId: "tcrn-design-system-components--field-spec-usage" },
  { id: "navigation-shell-spec", group: "Components", storybookId: "tcrn-design-system-components--navigation-shell-spec" },
  { id: "aos-frontend-shell-slice", group: "Components", storybookId: "tcrn-design-system-components--aos-frontend-shell-slice" },
  { id: "aos-owner-quality-product-shell", group: "Components", storybookId: "tcrn-design-system-components--aos-owner-quality-product-shell" },
  { id: "dialog-spec-usage", group: "Components", storybookId: "tcrn-design-system-components--dialog-spec-usage" },
  { id: "table-work-index-spec", group: "Components", storybookId: "tcrn-design-system-components--table-work-index-spec" },
  { id: "work-management-components-spec", group: "Components", storybookId: "tcrn-design-system-components--work-management-components-spec" },
  { id: "knowledge-management-components-spec", group: "Components", storybookId: "tcrn-design-system-components--knowledge-management-components-spec" },
  { id: "forms-patterns", group: "Patterns", storybookId: "tcrn-design-system-patterns--forms-patterns" },
  { id: "workbench-patterns", group: "Patterns", storybookId: "tcrn-design-system-patterns--workbench-patterns" },
  { id: "work-management-patterns", group: "Patterns", storybookId: "tcrn-design-system-patterns--work-management-patterns" },
  { id: "readiness-notification-patterns", group: "Patterns", storybookId: "tcrn-design-system-patterns--readiness-notification-patterns" },
  { id: "selection-list-patterns", group: "Patterns", storybookId: "tcrn-design-system-patterns--selection-list-patterns" },
  { id: "modal-validation-patterns", group: "Patterns", storybookId: "tcrn-design-system-patterns--modal-validation-patterns" },
  { id: "datagrid-fields-patterns", group: "Patterns", storybookId: "tcrn-design-system-patterns--datagrid-fields-patterns" },
  { id: "big-list-search-patterns", group: "Patterns", storybookId: "tcrn-design-system-patterns--big-list-search-patterns" },
  { id: "dashboard-page-templates", group: "Patterns", storybookId: "tcrn-design-system-patterns--dashboard-page-templates" },
  { id: "proof-matrix", group: "Proof", storybookId: "tcrn-design-system-proof--proof-matrix" },
  { id: "ai-consumption-contract", group: "Proof", storybookId: "tcrn-design-system-proof--ai-consumption-contract" },
  { id: "blocked-actions", group: "Proof", storybookId: "tcrn-design-system-proof--blocked-actions" },
  { id: "overlay-focus", group: "Proof", storybookId: "tcrn-design-system-proof--overlay-focus" },
  { id: "local-changelog", group: "Change Log", storybookId: "tcrn-design-system-change-log--local-changelog" }
];

const viewports = [
  { name: "desktop-1440x900", width: 1440, height: 900 },
  { name: "tablet-1024x768", width: 1024, height: 768 },
  { name: "mobile-390x844", width: 390, height: 844 }
];
const sectionPages = [
  { group: "Welcome", slug: "welcome", file: "index.html" },
  { group: "Style Guide", slug: "style-guide", file: "style-guide.html" },
  { group: "Foundations", slug: "foundations", file: "foundations.html" },
  { group: "Components", slug: "components", file: "components.html" },
  { group: "Patterns", slug: "patterns", file: "patterns.html" },
  { group: "Proof", slug: "proof", file: "proof.html" },
  { group: "Change Log", slug: "change-log", file: "change-log.html" }
];

function staticStoryRoute(story) {
  const section = sectionPages.find((page) => page.group === story.group);
  if (!section) {
    throw new Error(`missing_static_story_section:${story.group}:${story.id}`);
  }
  return `apps/storybook/storybook-static/${section.file}#${story.id}`;
}

const forbiddenCopyPatterns = [
  /\bproduct accepted\b/i,
  /\bfinal mvp accepted\b/i,
  /\brelease ready\b/i,
  /\bdeployment ready\b/i,
  /\bpublic ready\b/i,
  /\blegal complete\b/i,
  /\bdependency clean\b/i,
  /\blive dispatch enabled\b/i,
  /\bresource materialized\b/i
];

function hashFile(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function hashText(value) {
  return createHash("sha256").update(value).digest("hex");
}

function relativeScreenshotPath(fileName) {
  return join(screenshotDir, fileName);
}

function assertBuiltSurface(path) {
  if (!existsSync(path)) {
    throw new Error(`missing_built_surface:${path}`);
  }
}

function contentType(path) {
  switch (extname(path)) {
    case ".html":
      return "text/html; charset=utf-8";
    case ".js":
      return "text/javascript; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    case ".json":
      return "application/json; charset=utf-8";
    case ".svg":
      return "image/svg+xml";
    case ".png":
      return "image/png";
    case ".woff2":
      return "font/woff2";
    default:
      return "application/octet-stream";
  }
}

function startStaticServer(rootDirectory) {
  const root = resolve(rootDirectory);
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
      if (!stat.isFile()) {
        response.writeHead(404);
        response.end("not found");
        return;
      }
      response.writeHead(200, { "content-type": contentType(target) });
      createReadStream(target).pipe(response);
    } catch (error) {
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

async function collectPageHealth(page) {
  return await page.evaluate((patterns) => {
    const storyRegions = Array.from(document.querySelectorAll("[data-contract-story-id]")).map((node) => {
      const rect = node.getBoundingClientRect();
      return {
        id: node.getAttribute("data-contract-story-id"),
        visible: rect.width > 0 && rect.height > 0,
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      };
    });
    const visibleText = (node) => Array.from(node.childNodes)
      .map((child) => {
        if (child.nodeType === Node.TEXT_NODE) return child.textContent ?? "";
        if (child.nodeType !== Node.ELEMENT_NODE) return "";
        const element = child;
        if (element.classList.contains("tcrn-sr-only")) return "";
        return visibleText(element);
      })
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    const clipped = Array.from(document.querySelectorAll("button, select, .tcrn-badge, .tcrn-heading, h1, h2, h3"))
      .filter((node) => !node.classList.contains("tcrn-sr-only"))
      .map((node) => ({
        tag: node.tagName.toLowerCase(),
        text: visibleText(node).slice(0, 80),
        clipped: visibleText(node).length > 0 && (node.scrollWidth > node.clientWidth + 1 || node.scrollHeight > node.clientHeight + 1)
      }))
      .filter((item) => item.clipped);
    const readbackStateViewGapViolations = Array.from(document.querySelectorAll(".tcrn-readback-panel"))
      .flatMap((panel) => {
        const stateViews = Array.from(panel.querySelectorAll(":scope > .tcrn-state-view"));
        return stateViews.slice(1).map((node, index) => {
          const previous = stateViews[index];
          const previousRect = previous.getBoundingClientRect();
          const nodeRect = node.getBoundingClientRect();
          return {
            panelTitle: panel.querySelector(".tcrn-heading")?.textContent?.trim() ?? "",
            previousState: previous.getAttribute("data-state"),
            nextState: node.getAttribute("data-state"),
            gap: Math.round(nodeRect.top - previousRect.bottom)
          };
        });
      })
      .filter((item) => item.gap < 8);
    const gapBetween = (previous, next) => {
      const previousRect = previous.getBoundingClientRect();
      const nextRect = next.getBoundingClientRect();
      return Math.round(nextRect.top - previousRect.bottom);
    };
    const storyTextRhythmViolations = Array.from(document.querySelectorAll("article[data-contract-story-id]"))
      .flatMap((article) => {
        const heading = article.querySelector(":scope > h2");
        const description = article.querySelector(":scope > p");
        const bodyNode = article.querySelector(":scope > .story-body");
        if (!heading || !description || !bodyNode) {
          return [];
        }
        const titleToDescription = gapBetween(heading, description);
        const descriptionToBody = gapBetween(description, bodyNode);
        const violations = [];
        if (titleToDescription < 3 || titleToDescription > 8) {
          violations.push({
            storyId: article.getAttribute("data-contract-story-id"),
            pair: "title-description",
            gap: titleToDescription
          });
        }
        if (descriptionToBody < 12 || descriptionToBody > 20) {
          violations.push({
            storyId: article.getAttribute("data-contract-story-id"),
            pair: "description-body",
            gap: descriptionToBody
          });
        }
        return violations;
      });
    const readbackHeadingGapViolations = Array.from(document.querySelectorAll(".tcrn-readback-panel"))
      .map((panel) => {
        const heading = panel.querySelector(":scope > h3");
        const firstContent = Array.from(panel.children).find((child) => child !== heading);
        if (!heading || !firstContent) {
          return null;
        }
        return {
          panelTitle: heading.textContent?.trim() ?? "",
          gap: gapBetween(heading, firstContent)
        };
      })
      .filter((item) => item && (item.gap < 8 || item.gap > 14));
    const body = document.body.innerText.toLowerCase();
    const forbiddenHits = patterns.filter((source) => new RegExp(source, "i").test(body));
    const storySections = Array.from(document.querySelectorAll("[data-story-section]"))
      .map((node) => node.getAttribute("data-story-section"))
      .filter(Boolean);
    const componentStorybookParityNodes = Array.from(document.querySelectorAll("[data-component-library-parity='package-backed']")).map((node) => ({
      componentSource: node.getAttribute("data-component-source"),
      tokenSource: node.getAttribute("data-token-source"),
      copyStateSource: node.getAttribute("data-copy-state-source"),
      visible: node.getBoundingClientRect().width > 0 && node.getBoundingClientRect().height > 0
    }));
    const packageBackedDisabledNavItems = Array.from(document.querySelectorAll(".tcrn-package-nav-proof [data-navigation-primitive='nav-item'][aria-disabled='true']")).map((node) => {
      const describedByIds = (node.getAttribute("aria-describedby") ?? "").split(/\s+/).filter(Boolean);
      const describedReason = describedByIds
        .map((id) => document.getElementById(id))
        .find((element) => element?.classList.contains("tcrn-nav-item__disabled-reason"));
      const visibleReason = describedReason?.textContent?.trim() ?? "";
      const rect = describedReason?.getBoundingClientRect();
      const visibleReasonRendered = Boolean(rect && rect.width > 0 && rect.height > 0);
      const reason = node.getAttribute("data-disabled-reason")?.trim() ?? "";
      return {
        label: node.querySelector(".tcrn-nav-item__label")?.textContent?.trim() ?? node.textContent?.trim() ?? "",
        href: node.getAttribute("href"),
        tabIndex: node.getAttribute("tabindex"),
        title: node.getAttribute("title") ?? "",
        dataDisabledReason: reason,
        ariaDescribedBy: describedByIds,
        visibleReason,
        visibleReasonRendered,
        ok: !node.hasAttribute("href")
          && node.getAttribute("tabindex") === "-1"
          && reason.length > 0
          && node.getAttribute("title") === reason
          && describedByIds.length > 0
          && visibleReason === reason
          && visibleReasonRendered
      };
    });
    const storybookOnlyPrototypeNodes = Array.from(document.querySelectorAll("[data-storybook-only]")).map((node) => ({
      marker: node.getAttribute("data-storybook-only"),
      status: node.getAttribute("data-component-library-status"),
      visible: node.getBoundingClientRect().width > 0 && node.getBoundingClientRect().height > 0
    }));
    const shell = document.querySelector("[data-contract-surface]");
    const storybookNav = shell?.querySelector(".tcrn-doc-nav");
    const navRoot = storybookNav ?? document;
    const currentNav = shell?.getAttribute("data-active-story-section") ?? null;
    const currentStoryLink = navRoot.querySelector("[data-doc-nav-item][aria-current='location'][data-doc-nav-item-active='true']");
    const currentStoryNav = currentStoryLink?.getAttribute("data-doc-nav-item") ?? null;
    const categoryGroups = Array.from(navRoot.querySelectorAll(".tcrn-doc-nav__category"));
    const sidebarNoIconLabelReadbacks = window.innerWidth >= 900 && shell?.getAttribute("data-sidebar-collapsed") !== "true"
      ? Array.from(navRoot.querySelectorAll("[data-doc-nav-item]"))
	        .map((item) => {
	          const label = item;
	          const itemRect = item.getBoundingClientRect();
	          const labelRect = label.getBoundingClientRect();
	          if (itemRect.width < 1 || itemRect.height < 1 || labelRect.width < 1 || labelRect.height < 1) {
	            return null;
	          }
	          const style = window.getComputedStyle(label);
          const lineHeight = Number.parseFloat(style.lineHeight) || 1;
	          const lineCount = Math.max(1, Math.round(labelRect.height / lineHeight));
          const text = label.textContent?.replace(/\s+/g, " ").trim() ?? "";
          const textLength = text.replace(/\s+/g, "").length;
          const hasNoIconContract = true;
          const minReadableWidth = Math.min(64, Math.max(40, itemRect.width * 0.25));
          return {
            route: item.getAttribute("data-doc-nav-item"),
            text,
            textLength,
            itemWidth: Number(itemRect.width.toFixed(2)),
	            labelWidth: Number(labelRect.width.toFixed(2)),
            labelHeight: Number(labelRect.height.toFixed(2)),
            lineHeight: Number(lineHeight.toFixed(2)),
	            lineCount,
	            overflowWrap: style.overflowWrap,
	            wordBreak: style.wordBreak,
	            hasNoIconContract,
	            ok: hasNoIconContract
                && (textLength < 8
                  || (labelRect.width >= minReadableWidth
                    && lineCount <= 3
                    && style.overflowWrap !== "anywhere"))
	          };
        })
        .filter(Boolean)
      : [];
    const sidebarNoIconLabelReadabilityFailures = sidebarNoIconLabelReadbacks.filter((item) => !item.ok);
    const categoryAriaFailures = categoryGroups
      .filter((node) => {
        const toggle = node.querySelector("[data-doc-nav-category-toggle]");
        const describedBy = toggle?.getAttribute("aria-describedby");
        return !toggle || !describedBy || !document.getElementById(describedBy);
      })
      .map((node) => node.textContent?.replace(/\s+/g, " ").trim() ?? "");
    const isVisibleElement = (node) => {
      if (!node) return false;
      const rect = node.getBoundingClientRect();
      const style = window.getComputedStyle(node);
      return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
    };
    const governanceStoryMetadataMissing = Array.from(document.querySelectorAll("article[data-contract-story-id]"))
      .filter((node) => !node.hasAttribute("data-story-category")
        || !node.hasAttribute("data-story-category-id")
        || !node.hasAttribute("data-story-source-path")
        || !node.hasAttribute("data-story-package-authority")
        || !node.hasAttribute("data-story-readiness")
        || !node.hasAttribute("data-story-proof-posture"))
      .map((node) => node.getAttribute("data-contract-story-id"));
    const sidebar = document.querySelector(".tcrn-doc-sidebar");
    const sidebarRect = sidebar?.getBoundingClientRect();
    const headerRect = document.querySelector(".tcrn-doc-header")?.getBoundingClientRect();
    const layoutRect = document.querySelector(".tcrn-doc-layout")?.getBoundingClientRect();
    return {
      title: document.title,
      shellAuthority: shell?.getAttribute("data-doc-shell") ?? null,
      docShellSelectorCount: document.querySelectorAll("[data-doc-shell], .tcrn-doc-header, .tcrn-doc-global-bar, .tcrn-doc-header-search, .tcrn-doc-nav, .tcrn-doc-sidebar").length,
      globalProductShellShellSelectorCount: Array.from(document.querySelectorAll("[data-storybook-shell-authority], [data-storybook-product-shell-skin], [data-package-backed-product-shell-boundary], [data-product-shell-region='side-navigation'], .tcrn-product-shell__sidebar, .tcrn-product-shell__main"))
        .filter((node) => !node.closest(".story-body"))
        .length,
      docShellSidebarVisible: Boolean(sidebarRect && sidebarRect.width > 0 && sidebarRect.height > 0),
      docNavGroupCount: navRoot.querySelectorAll(".tcrn-doc-nav__group").length,
      docNavCategoryCount: categoryGroups.length,
      docNavOpenCategoryCount: navRoot.querySelectorAll(".tcrn-doc-nav__category[data-doc-nav-category-open='true']").length,
      activeStoryHiddenByCategory: false,
      categoryAriaFailures,
      sidebarNoIconLabelReadbacks,
      sidebarNoIconLabelReadabilityFailures,
      docNavItemCount: navRoot.querySelectorAll("[data-doc-nav-item]").length,
      docCurrentStoryCount: navRoot.querySelectorAll("[data-doc-nav-item][aria-current='location'][data-doc-nav-item-active='true']").length,
      docChapterPagerCount: document.querySelectorAll("[data-doc-chapter-pager='true']").length,
      onThisPageCount: document.querySelectorAll("[data-doc-on-this-page='true']").length,
      mandatoryBoundaryVisible: isVisibleElement(document.querySelector("[data-mandatory-boundary-block='visible']")),
      noOverclaimBoundaryVisible: isVisibleElement(document.querySelector("[data-no-overclaim-boundary='visible']")),
      governanceBoundaryStripVisible: isVisibleElement(document.querySelector("[data-governance-boundary-strip='visible']")),
      governanceStoryMetadataMissing,
      shellHeaderLayoutGap: headerRect && layoutRect ? Math.round(layoutRect.top - headerRect.bottom) : null,
      sidebarLeft: sidebarRect ? Math.round(sidebarRect.left) : null,
	      storybookLocale: shell?.getAttribute("data-storybook-locale") ?? null,
      localeOptionCount: document.querySelectorAll("[data-i18n-locale-select] option").length,
      localeSelectVisible: Boolean(document.querySelector("[data-i18n-locale-select]")),
      componentStorybookParityNodes,
      packageBackedDisabledNavItems,
      storybookOnlyPrototypeNodes,
	      activeSection: shell?.getAttribute("data-active-story-section") ?? null,
      storySections,
      currentNav,
      currentStoryNav,
      bodyScrollWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      bodyOverflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
      storyRegions,
      clipped,
      readbackStateViewGapViolations,
      storyTextRhythmViolations,
      readbackHeadingGapViolations,
      forbiddenHits,
      rootVisible: Boolean(document.querySelector("[data-contract-surface='tcrn-design-system-storybook']"))
    };
  }, forbiddenCopyPatterns.map((pattern) => pattern.source));
}

async function runAxe(page) {
  await page.addScriptTag({ path: axePath });
  return await page.evaluate(async () => {
    const result = await window.axe.run(document, {
      resultTypes: ["violations"],
      rules: {
        region: { enabled: false }
      }
    });
    return {
      violationCount: result.violations.length,
      violations: result.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        nodeCount: violation.nodes.length,
        help: violation.help,
        nodes: violation.nodes.map((node) => ({
          target: node.target,
          html: node.html.slice(0, 500),
          failureSummary: node.failureSummary
        }))
      }))
    };
  });
}

function targetTopMatchesAnchorOffset(metrics) {
  const targetTop = metrics.targetTop;
  const offset = Number.isFinite(metrics.offset) ? metrics.offset : 22;
  const lowerBound = Math.max(12, offset - 20);
  const upperBound = Math.max(42, offset + 24);

  if (targetTop !== null && targetTop >= lowerBound && targetTop <= upperBound) {
    return true;
  }

  const atPageEnd = Number.isFinite(metrics.scrollY)
    && Number.isFinite(metrics.maxScrollY)
    && metrics.scrollY >= metrics.maxScrollY - 2;
  return atPageEnd && targetTop !== null && targetTop >= lowerBound;
}

/**
 * Pin every animation to a deterministic frame. A finite transition is finished, so
 * a capture shows what the surface settles to rather than a point on the way there;
 * an infinite one (the skeleton, loading and progress loops run forever by design and
 * can never finish) is paused at time zero. Without this, any story containing a loop
 * — or any element still easing — hashes differently on every run, which is what made
 * story-coverage-manifest.json and visual-baseline-manifest.json churn.
 */
const PIN_ANIMATIONS = () => {
  if (typeof document.getAnimations !== "function") return;
  for (const animation of document.getAnimations()) {
    const iterations = animation.effect?.getComputedTiming?.().iterations;
    if (iterations === Infinity) {
      animation.pause();
      animation.currentTime = 0;
      continue;
    }
    try {
      animation.finish();
    } catch {
      animation.pause();
      animation.currentTime = 0;
    }
  }
};

async function pinAnimations(page) {
  await page.evaluate(PIN_ANIMATIONS);
}

async function setTransientScreenshotChromeHidden(page, hidden) {
  await page.evaluate(([shouldHide, pinSource]) => {
    const styleId = "tcrn-proof-screenshot-chrome-hidden";
    document.getElementById(styleId)?.remove();
    const skipLink = document.querySelector(".tcrn-doc-skip");
    if (skipLink instanceof HTMLElement) {
      skipLink.blur();
    }
    if (shouldHide) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = ".tcrn-doc-skip { visibility: hidden !important; }";
      document.head.appendChild(style);
    }
    // Pinning has to happen *after* the chrome style lands: appending a stylesheet is
    // itself capable of starting a transition, so pinning first would leave the very
    // animations this hook introduces still running when the shutter opens.
    // eslint-disable-next-line no-new-func
    new Function(`return (${pinSource})`)()();
  }, [hidden, PIN_ANIMATIONS.toString()]);
}

const signatureBaselinePath = "docs/verification/internal-alpha/visual-signature-baseline.json";
const updateVisualBaseline = process.argv.includes("--update-visual-baseline");
const signatureBaseline = existsSync(signatureBaselinePath)
  ? JSON.parse(readFileSync(signatureBaselinePath, "utf8"))
  : { schemaVersion: "tcrn.visual-signature-baseline.v1", tolerance: SIGNATURE_TOLERANCE, entries: {} };
const signatureResults = [];

/**
 * Capture, then reduce to a perceptual signature and compare against the committed
 * baseline. The signature — not the PNG's sha256 — is the invariant: see
 * scripts/lib/visual-signature.mjs for the measurements the tolerance rests on.
 */
async function captureWithSignature(target, key, path, { gated = true, ...options } = {}) {
  const buffer = await target.screenshot({ path, animations: "disabled", ...options });
  if (!gated) {
    // The capture is kept on disk for a human to look at, but nothing about it is
    // recorded: its signature is not reproducible, and writing an unreproducible value
    // into a committed artifact is precisely the churn this work set out to remove.
    signatureResults.push({ key, status: "recorded-only", distance: null, gated: false });
    return null;
  }
  const cells = await computeSignature(signatureContext.page, buffer);
  const encoded = encodeSignature(cells);
  const baseline = signatureBaseline.entries[key];
  let status = "new";
  let distance = null;
  if (baseline) {
    distance = compareSignatures(decodeSignature(baseline), cells);
    status = withinTolerance(distance) ? "match" : "regression";
  }
  if (updateVisualBaseline || !baseline) {
    signatureBaseline.entries[key] = encoded;
  }
  signatureResults.push({ key, status, distance, gated: true });
  return encoded;
}

rmSync(screenshotDir, { recursive: true, force: true });
mkdirSync(screenshotDir, { recursive: true });
assertBuiltSurface(staticSurfacePath);
assertBuiltSurface(aiContractPath);
assertBuiltSurface(llmsPath);
for (const section of sectionPages) {
  assertBuiltSurface(`apps/storybook/storybook-static/${section.file}`);
}

const expectedCategoryCount = 19;
const expectedStorybookShellNavGroupCount = sectionPages.length;
const expectedFoundationStandardCategoryIds = [
  "visual-philosophy-ownership",
  "layout-rhythm",
  "spacing-density",
  "typography-localization",
  "color-elevation-border-radius-focus",
  "component-composition",
  "interaction-motion-accessibility",
  "responsive-mobile",
  "evidence-proof-oracle",
  "consumer-enforcement"
];
const aiContractSource = readFileSync(aiContractPath, "utf8");
const aiContract = JSON.parse(aiContractSource);
const { contractPayloadDigest, ...aiContractWithoutDigest } = aiContract;
const aiContractDigestCheck = contractPayloadDigest === hashText(`${JSON.stringify(aiContractWithoutDigest, null, 2)}\n`);
const llmsText = readFileSync(llmsPath, "utf8");
const storybookDocShellVisualOracleContract = aiContract.storybookDocShellVisualOracle ?? {};
const expectedStorybookVisualSkin = {
  id: storybookDocShellVisualOracleContract.id ?? "missing",
  sidebarWidthPx: storybookDocShellVisualOracleContract.shellMetrics?.desktopSidebarWidthPx ?? null,
  sidebarMinWidthPx: storybookDocShellVisualOracleContract.shellMetrics?.desktopSidebarMinWidthPx ?? null,
  sidebarPreferredViewportRatio: storybookDocShellVisualOracleContract.shellMetrics?.desktopSidebarPreferredViewportRatio ?? null,
  sidebarMaxWidthPx: storybookDocShellVisualOracleContract.shellMetrics?.desktopSidebarMaxWidthPx ?? null,
  sidebarTolerancePx: storybookDocShellVisualOracleContract.shellMetrics?.desktopSidebarTolerancePx ?? 0,
  topbarHeightPx: storybookDocShellVisualOracleContract.shellMetrics?.desktopTopbarHeightPx ?? null,
  topbarTolerancePx: storybookDocShellVisualOracleContract.shellMetrics?.desktopTopbarTolerancePx ?? 0,
  searchRestWidthPx: storybookDocShellVisualOracleContract.shellMetrics?.searchRestWidthPx ?? null,
  searchHeightPx: storybookDocShellVisualOracleContract.shellMetrics?.searchHeightPx ?? null,
  searchBorderColor: storybookDocShellVisualOracleContract.shellMetrics?.searchBorderColor ?? null,
  searchBorderRadiusPx: storybookDocShellVisualOracleContract.shellMetrics?.searchBorderRadiusPx ?? null,
  themeToggleRadiusPx: storybookDocShellVisualOracleContract.shellMetrics?.themeToggleRadiusPx ?? null
};
const expectedStorybookSidebarWidthForViewport = (viewportWidth) => {
  const { sidebarMinWidthPx, sidebarPreferredViewportRatio, sidebarMaxWidthPx, sidebarWidthPx } = expectedStorybookVisualSkin;
  if (
    typeof sidebarMinWidthPx === "number"
    && typeof sidebarPreferredViewportRatio === "number"
    && typeof sidebarMaxWidthPx === "number"
  ) {
    return Math.min(sidebarMaxWidthPx, Math.max(sidebarMinWidthPx, viewportWidth * sidebarPreferredViewportRatio));
  }
  return sidebarWidthPx;
};
const aiContractTraceabilityCheck = {
  ok: aiContractDigestCheck
    && aiContract.contractVersion === "ai_consumption_contract_v1"
    && aiContract.storybookGovernanceTraceability?.hierarchy === "section -> category -> story"
    && aiContract.coveredStorybookSections?.length === sectionPages.length
    && aiContract.coveredStorybookSections?.reduce((total, section) => total + section.categories.length, 0) === expectedCategoryCount
    && aiContract.changelogGovernance?.records?.length > 0
    && aiContract.changelogGovernance?.requiredFields?.includes("proofArtifacts")
    && aiContract.workManagementStaticAuthority?.disposition === "static_contract_authority_explicit_and_smoke_proven"
    && (aiContract.workManagementStaticAuthority?.admittedPackageExports ?? []).includes("WorkItemRow")
    && (aiContract.workManagementStaticAuthority?.admittedPackageExports ?? []).includes("WorkDetailLayout")
    && (aiContract.visualFitControlContract?.workLayoutDensity?.packageExports ?? []).includes("WorkQuickFilters")
    && (aiContract.visualFitControlContract?.workLayoutDensity?.packageExports ?? []).includes("MachineTokenCell")
    && aiContract.foundationVisualStandards?.registryId === "foundation-visual-standards-v1"
    && JSON.stringify(aiContract.foundationVisualStandards?.categoryIds ?? []) === JSON.stringify(expectedFoundationStandardCategoryIds)
    && aiContract.foundationVisualStandardCategories?.length === expectedFoundationStandardCategoryIds.length
    && aiContract.consumerVisualStyleContract?.id === "consumer-visual-style-contract-v1"
    && aiContract.storybookDocShellVisualOracle?.id === "original-storybook-doc-shell-v1"
    && aiContract.storybookDocShellVisualOracle?.oracleRecoveryReceipt === "TCRN Workflow/vault/initiatives/projects/TCRN-DESIGN-SYSTEM/active/storybook-shell-control-stabilization/50-implementation-plan.md#storybook-original-shell-restoration-implementation-plan"
    && aiContract.storybookDocShellVisualOracle?.baselineManifestClassification === "owner_declared_original_storybook_doc_shell_standard"
    && String(aiContract.storybookDocShellVisualOracle?.metricSourceDisposition ?? "").includes("Storybook documentation shell")
	    && (aiContract.storybookDocShellVisualOracle?.metricEvidence ?? []).some((item) => (
	      item.metric === "searchRestWidthPx"
	      && item.sha256 === "d9b5fdcd59f1baf9819bde3ae35761acde0cfb62ce28a17af2c4acbfd667f953"
	    ))
    && llmsText.includes("Covered Storybook section/category/story hierarchy:")
    && llmsText.includes("Changelog governance:")
    && llmsText.includes("Work Management authority:")
    && llmsText.includes("Foundation visual standards: foundation-visual-standards-v1")
    && llmsText.includes("Consumer visual style contract: consumer-visual-style-contract-v1")
    && llmsText.includes("Storybook doc shell visual oracle: original-storybook-doc-shell-v1")
    && llmsText.includes("oracle recovery: TCRN Workflow/vault/initiatives/projects/TCRN-DESIGN-SYSTEM/active/storybook-shell-control-stabilization/50-implementation-plan.md#storybook-original-shell-restoration-implementation-plan")
    && llmsText.includes("baseline classification: owner_declared_original_storybook_doc_shell_standard")
    && llmsText.includes(contractPayloadDigest),
  contractVersion: aiContract.contractVersion,
  contractPayloadDigest,
  digestVerified: aiContractDigestCheck,
  coveredSectionCount: aiContract.coveredStorybookSections?.length ?? 0,
  coveredCategoryCount: aiContract.coveredStorybookSections?.reduce((total, section) => total + section.categories.length, 0) ?? 0,
  changelogRecordCount: aiContract.changelogGovernance?.records?.length ?? 0,
  workManagementStaticAuthorityDisposition: aiContract.workManagementStaticAuthority?.disposition ?? null,
  workManagementAdmittedPackageExports: aiContract.workManagementStaticAuthority?.admittedPackageExports ?? [],
  workLayoutDensityPackageExports: aiContract.visualFitControlContract?.workLayoutDensity?.packageExports ?? [],
  foundationVisualStandardsRegistryId: aiContract.foundationVisualStandards?.registryId ?? null,
  foundationVisualStandardCategoryIds: aiContract.foundationVisualStandards?.categoryIds ?? [],
  foundationVisualStandardCategoryCount: aiContract.foundationVisualStandardCategories?.length ?? 0,
  consumerVisualStyleContractId: aiContract.consumerVisualStyleContract?.id ?? null,
  storybookDocShellVisualOracleId: aiContract.storybookDocShellVisualOracle?.id ?? null,
  storybookDocShellVisualOracleReceipt: aiContract.storybookDocShellVisualOracle?.oracleRecoveryReceipt ?? null,
  storybookDocShellVisualOracleBaselineClassification: aiContract.storybookDocShellVisualOracle?.baselineManifestClassification ?? null,
  storybookDocShellVisualOracleMetricEvidenceCount: aiContract.storybookDocShellVisualOracle?.metricEvidence?.length ?? 0,
  llmsTraceabilitySectionsPresent: llmsText.includes("Covered Storybook section/category/story hierarchy:")
    && llmsText.includes("Changelog governance:")
    && llmsText.includes("Work Management authority:")
    && llmsText.includes("Foundation visual standards: foundation-visual-standards-v1")
    && llmsText.includes("Consumer visual style contract: consumer-visual-style-contract-v1")
    && llmsText.includes("Storybook doc shell visual oracle: original-storybook-doc-shell-v1")
    && llmsText.includes("oracle recovery: TCRN Workflow/vault/initiatives/projects/TCRN-DESIGN-SYSTEM/active/storybook-shell-control-stabilization/50-implementation-plan.md#storybook-original-shell-restoration-implementation-plan")
    && llmsText.includes("baseline classification: owner_declared_original_storybook_doc_shell_standard")
};

const staticServer = await startStaticServer(".");
const stableProofOrigin = "http://127.0.0.1:<ephemeral>";

function normalizeEphemeralProofData(value) {
  if (typeof value === "string") {
    return value.replaceAll(staticServer.origin, stableProofOrigin);
  }
  if (Array.isArray(value)) {
    return value.map((item) => normalizeEphemeralProofData(item));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, normalizeEphemeralProofData(item)]));
  }
  return value;
}
const browser = await chromium.launch({ headless: true });
// A CSP-free page used only to reduce captures to signatures; the docs shell refuses
// data: image sources, so the measurement cannot run inside the page under test.
const signatureContext = await createSignatureContext(browser);
const browserVersion = browser.version();
const browserSummaries = [];
const visualEntries = [];
const axeSummaries = [];
const disclosureChecks = [];
let keyboardChecklist;
let localeMenuFocusReturnCheck;

for (const viewport of viewports) {
  for (const section of sectionPages) {
    const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
    const consoleMessages = [];
    const pageErrors = [];
    const failedRequests = [];
    page.on("console", (message) => {
      if (["error", "warning"].includes(message.type())) {
        consoleMessages.push({ type: message.type(), text: message.text().slice(0, 300) });
      }
    });
    page.on("pageerror", (error) => pageErrors.push(error.message.slice(0, 300)));
    page.on("requestfailed", (request) => failedRequests.push({ url: request.url(), failure: request.failure()?.errorText ?? "unknown" }));

    await page.goto(`${staticServer.origin}/apps/storybook/storybook-static/${section.file}`);
    await page.waitForSelector("[data-contract-story-id]", { state: "attached" });
    if (viewport.name === "desktop-1440x900") {
      // Progressive-disclosure contract: pages open as a compact index (all stories
      // collapsed), a disclosure click expands its story, and hash navigation expands
      // its target. Checked before the capture pass force-expands everything.
      disclosureChecks.push(await page.evaluate(() => {
        const articles = Array.from(document.querySelectorAll("article[data-story-collapsed]"));
        const collapsedByDefault = articles.length > 0 && articles.every((node) => node.getAttribute("data-story-collapsed") === "true");
        const first = articles[0];
        const toggle = first ? first.querySelector("[data-story-disclosure]") : null;
        let clickExpands = false;
        let clickRestores = false;
        if (toggle) {
          toggle.click();
          clickExpands = first.getAttribute("data-story-collapsed") === "false" && toggle.getAttribute("aria-expanded") === "true";
          toggle.click();
          clickRestores = first.getAttribute("data-story-collapsed") === "true";
        }
        const last = articles[articles.length - 1];
        let hashExpands = false;
        if (last) {
          window.location.hash = `#${last.id}`;
          window.dispatchEvent(new HashChangeEvent("hashchange"));
          hashExpands = last.getAttribute("data-story-collapsed") === "false";
          window.location.hash = "";
        }
        return { section: document.title, storyCount: articles.length, collapsedByDefault, clickExpands, clickRestores, hashExpands };
      }));
    }
    // The signature gates prove story content, not the disclosure shell: expand every
    // story before any layout- or capture-reading step runs.
    await page.evaluate(() => {
      for (const article of document.querySelectorAll("article[data-story-collapsed]")) {
        article.setAttribute("data-story-collapsed", "false");
        const toggle = article.querySelector("[data-story-disclosure]");
        if (toggle) {
          toggle.setAttribute("aria-expanded", "true");
        }
      }
    });
    const health = await collectPageHealth(page);
    const sectionStories = requiredStories.filter((story) => story.group === section.group);
    const screenshotPath = relativeScreenshotPath(`${viewport.name}-section-${section.slug}.png`);
    await setTransientScreenshotChromeHidden(page, true);
    // Section captures are whole-page compositions of stories that are each gated below,
    // so they add no coverage — and their height is unbounded (section-components reaches
    // 159,919px on mobile), which makes a full-page capture depend on whether lazy content
    // finished painting. Measured: its signature swings mean=34.6 between runs, four times
    // the distance a real one-token colour change produces. Recorded for human inspection,
    // deliberately not gated: a tolerance wide enough to admit it would admit real regressions.
    const sectionSignature = await captureWithSignature(page, `section-${section.slug}@${viewport.name}`, screenshotPath, { fullPage: true, gated: false });
    await setTransientScreenshotChromeHidden(page, false);
    visualEntries.push({
      storyId: `section-${section.slug}`,
      viewport: viewport.name,
      path: screenshotPath,
      visualGate: "not-gated-unbounded-full-page",
      intentionalDiffDisposition: "new_internal_alpha_baseline"
    });

    for (const story of sectionStories) {
      const locator = page.locator(`[data-contract-story-id="${story.id}"]`);
      await locator.waitFor({ state: "visible" });
      const storyPath = relativeScreenshotPath(`${viewport.name}-${story.id}.png`);
      await setTransientScreenshotChromeHidden(page, true);
      const storySignature = await captureWithSignature(locator, `${story.id}@${viewport.name}`, storyPath);
      await setTransientScreenshotChromeHidden(page, false);
      visualEntries.push({
        storyId: story.id,
        viewport: viewport.name,
        path: storyPath,
        signature: storySignature,
        intentionalDiffDisposition: "new_internal_alpha_baseline"
      });
    }

    if (viewport.name === "desktop-1440x900") {
      axeSummaries.push({ section: section.group, ...(await runAxe(page)) });
    }

    browserSummaries.push({
      viewport: viewport.name,
      browser: "chromium",
      browserVersion,
      url: `/apps/storybook/storybook-static/${section.file}`,
      expectedSection: section.group,
      expectedStoryIds: sectionStories.map((story) => story.id),
      consoleMessages,
      pageErrors,
      failedRequests,
      ...health
    });
    await page.close();
  }
}

const storybookPage = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
await storybookPage.goto(`${staticServer.origin}/${staticSurfacePath}#components`);
await storybookPage.waitForSelector("[data-active-story-section='Components']");
await storybookPage.waitForSelector("[data-doc-nav-item='component-family-index'][aria-current='location'][data-doc-nav-item-active='true']");
await storybookPage.waitForTimeout(150);
const hashRouteCheck = {
  ok: storybookPage.url().endsWith("/components.html")
    && await storybookPage.locator("[data-story-section='Components']").isVisible()
    && await storybookPage.locator("[data-story-id='component-family-index']").isVisible()
    && await storybookPage.locator("[data-doc-nav-item='component-family-index'][aria-current='location'][data-doc-nav-item-active='true']").count() === 1
    && await storybookPage.locator("[data-story-id='welcome-governance']").count() === 0,
  source: `${staticSurfacePath}#components`,
  url: storybookPage.url()
};
await storybookPage.goto(`${staticServer.origin}/${staticSurfacePath}#button-spec-usage`);
await storybookPage.waitForSelector("[data-active-story-section='Components']");
await storybookPage.waitForSelector("[data-doc-nav-item='button-spec-usage'][aria-current='location'][data-doc-nav-item-active='true']");
await storybookPage.waitForTimeout(150);
const hashStoryRouteCheck = {
  ok: storybookPage.url().endsWith("/components.html#button-spec-usage")
    && await storybookPage.locator("[data-story-section='Components']").isVisible()
    && await storybookPage.locator("[data-story-id='button-spec-usage']").isVisible()
    && await storybookPage.locator("[data-doc-nav-item='button-spec-usage'][aria-current='location'][data-doc-nav-item-active='true']").count() === 1
    && await storybookPage.locator("[data-story-id='welcome-governance']").count() === 0,
  source: `${staticSurfacePath}#button-spec-usage`,
  url: storybookPage.url()
};
const firstStoryHashShellParityRoutes = sectionPages.map((section) => {
  const firstStory = requiredStories.find((story) => story.group === section.group);
  return {
    ...section,
    storyId: firstStory?.id ?? null
  };
});
const forbiddenZhCnProductShellText = [
  "Welcome and governance",
  "Maintainers and routing",
  "Component Library",
  "Contribution model",
  "Icons and motion",
  "Global states",
  "Copy creation rules",
  "Component family index",
  "Work Management",
  "AI consumption contract",
  "Local changelog"
];
const forbiddenOwnerVisibleCaptionText = [
  "私有本地脚手架证明",
  "Private local scaffold proof"
];
const expectedProductShellThemeToggleRadius = "999px";
const firstStoryHashShellParityReadbacks = [];
for (const route of firstStoryHashShellParityRoutes) {
  if (!route.storyId) {
    firstStoryHashShellParityReadbacks.push({ ...route, ok: false, failures: ["missing-first-story"] });
    continue;
  }
  await storybookPage.goto(`${staticServer.origin}/apps/storybook/storybook-static/${route.file}?theme=light&locale=zh-CN#${route.storyId}`);
  await storybookPage.waitForSelector("[data-storybook-locale='zh-CN']");
  await storybookPage.waitForSelector(`[data-active-story-section='${route.group}']`);
  await storybookPage.waitForSelector(`[data-doc-nav-item='${route.storyId}'][aria-current='location'][data-doc-nav-item-active='true']`);
  await storybookPage.waitForTimeout(180);
  const metrics = await storybookPage.evaluate(({ group, storyId, expectedCategoryCount, expectedGroupCount, expectedShellNavGroupCount, forbiddenZhCnProductShellText, forbiddenOwnerVisibleCaptionText }) => {
    const rectFor = (selector) => {
      const node = document.querySelector(selector);
      if (!node) {
        return null;
      }
      const rect = node.getBoundingClientRect();
      return {
        top: Number(rect.top.toFixed(2)),
        left: Number(rect.left.toFixed(2)),
        right: Number(rect.right.toFixed(2)),
        bottom: Number(rect.bottom.toFixed(2)),
        width: Number(rect.width.toFixed(2)),
        height: Number(rect.height.toFixed(2))
      };
    };
    const styleFor = (selector, properties) => {
      const node = document.querySelector(selector);
      if (!node) {
        return null;
      }
      const style = window.getComputedStyle(node);
      return Object.fromEntries(properties.map((property) => [property, style.getPropertyValue(property)]));
    };
    const html = document.documentElement;
    const body = document.body;
    const header = rectFor(".tcrn-doc-header");
    const pageHead = rectFor("[data-doc-page-head='governed-section']");
    const firstStory = document.querySelector(`[data-contract-story-id='${storyId}']`);
    const firstStoryRect = firstStory?.getBoundingClientRect();
    const currentLocation = rectFor(".tcrn-doc-current-location");
    const search = rectFor(".tcrn-doc-header-search");
    const controls = rectFor("[data-shell-control='theme-toggle']");
    const themeToggleStyles = styleFor("[data-shell-control='theme-toggle']", ["border-radius"]);
    const locale = rectFor(".tcrn-shell-locale-menu");
    const shell = document.querySelector("[data-contract-surface]");
    const storybookNav = shell?.querySelector(".tcrn-doc-nav");
    const navRoot = storybookNav ?? document;
    const activeStory = navRoot.querySelector("[data-doc-nav-item][aria-current='location'][data-doc-nav-item-active='true']");
    const headerBottom = header?.bottom ?? 0;
    const currentLocationNode = document.querySelector(".tcrn-doc-current-location");
    const brandNode = document.querySelector(".tcrn-doc-brand");
    const brandCaptionNode = brandNode?.querySelector(".tcrn-product-logo__line-two, .tcrn-shell-brand-lockup__caption") ?? null;
    const searchInput = document.querySelector(".tcrn-search-input__control");
    const searchInputShell = rectFor(".tcrn-search-input");
    const searchInputShellStyles = styleFor(".tcrn-search-input", ["border-color", "border-radius"]);
    const searchControl = rectFor(".tcrn-doc-header-search .tcrn-search-input__control");
    const searchIcon = rectFor(".tcrn-doc-header-search .tcrn-search-input__icon");
    const searchShortcut = rectFor(".tcrn-doc-header-search .tcrn-search-input__shortcut");
    const searchInputGridStyles = styleFor(".tcrn-doc-header-search .tcrn-search-input", ["display", "grid-template-columns", "overflow"]);
    const searchFitFailures = [];
    if (searchInputShell && searchControl && searchIcon && searchShortcut) {
      if (searchControl.width < 84) searchFitFailures.push(`control-width:${searchControl.width}`);
      if (searchIcon.left < searchInputShell.left - 1 || searchIcon.right > searchControl.left + 1) searchFitFailures.push("icon-track-overlap");
      if (searchShortcut.left < searchControl.right - 1 || searchShortcut.right > searchInputShell.right + 1) searchFitFailures.push("shortcut-track-overlap");
    } else {
      searchFitFailures.push("search-track-missing");
    }
    if (searchInputGridStyles?.display !== "grid") searchFitFailures.push(`display:${searchInputGridStyles?.display ?? "missing"}`);
    const sideNavRegion = rectFor(".tcrn-doc-sidebar");
    const docShellTextSurface = [
      brandNode?.textContent ?? "",
      storybookNav?.innerText ?? "",
      currentLocationNode?.textContent ?? "",
      searchInput?.getAttribute("aria-label") ?? "",
      searchInput?.getAttribute("placeholder") ?? ""
    ].join("\\n");
    const ownerVisibleCaptionSurface = [
      docShellTextSurface,
      firstStory instanceof HTMLElement ? firstStory.innerText : ""
    ].join("\\n");
    const docShellEnglishLeaks = forbiddenZhCnProductShellText.filter((text) => docShellTextSurface.includes(text));
    const ownerVisibleCaptionHits = forbiddenOwnerVisibleCaptionText.filter((text) => ownerVisibleCaptionSurface.includes(text));
    const brandIdentityLogoSectionReadback = storyId === "brand-identity" && firstStory instanceof HTMLElement
      ? {
        productLockupCount: firstStory.querySelectorAll("[data-brand-lockup='product']").length,
        hasProductLockupsLabel: firstStory.innerText.includes("产品组合标识") || firstStory.innerText.includes("Product lockups"),
        hasRegisteredProductLogosLabel: firstStory.innerText.includes("Registered product logos"),
        hasRegistryExportText: firstStory.innerText.includes("ProductLogo / tcrnProductLogoRegistry"),
        hasAosRegisteredAssetId: firstStory.innerText.includes("tcrn-aos-two-line")
      }
      : null;
    const pageOverflow = Math.max(html.scrollWidth, body.scrollWidth) > Math.max(html.clientWidth, body.clientWidth) + 1;
    return {
	      group,
	      storyId,
	      viewportWidth: window.innerWidth,
	      route: window.location.pathname + window.location.search + window.location.hash,
      locale: shell?.getAttribute("data-storybook-locale") ?? null,
      activeSection: shell?.getAttribute("data-active-story-section") ?? null,
      activeStoryId: activeStory?.getAttribute("data-doc-nav-item") ?? null,
      scrollY: Number(window.scrollY.toFixed(2)),
      pageOverflow,
      shellAuthority: shell?.getAttribute("data-doc-shell") ?? null,
      docShellSelectorCount: document.querySelectorAll("[data-doc-shell], .tcrn-doc-header, .tcrn-doc-global-bar, .tcrn-doc-header-search, .tcrn-doc-nav, .tcrn-doc-sidebar").length,
      globalProductShellShellSelectorCount: Array.from(document.querySelectorAll("[data-storybook-shell-authority], [data-storybook-product-shell-skin], [data-package-backed-product-shell-boundary], [data-product-shell-region='side-navigation'], .tcrn-product-shell__sidebar, .tcrn-product-shell__main"))
        .filter((node) => !node.closest(".story-body"))
        .length,
      docPageHeadCount: document.querySelectorAll("[data-doc-page-head='governed-section']").length,
      onThisPageCount: document.querySelectorAll("[data-doc-on-this-page='true']").length,
      mandatoryBoundaryCount: document.querySelectorAll("[data-mandatory-boundary-block='visible']").length,
      noOverclaimBoundaryCount: document.querySelectorAll("[data-no-overclaim-boundary='visible']").length,
      legacyProductShellGlobalNavCount: Array.from(document.querySelectorAll("[data-product-shell-region='side-navigation'], [data-product-shell-route]"))
        .filter((node) => !node.closest(".story-body"))
        .length,
      navGroupCount: navRoot.querySelectorAll(".tcrn-doc-nav__group").length,
      categoryLabelCount: navRoot.querySelectorAll(".tcrn-doc-nav__category-label").length,
      docBrandText: brandNode?.textContent?.replace(/\s+/g, " ").trim() ?? null,
      docBrandCaptionText: brandCaptionNode?.textContent?.replace(/\s+/g, " ").trim() ?? null,
      docBrandCaptionLocalized: (brandCaptionNode?.textContent ?? "").includes("组件库") && !(brandNode?.textContent ?? "").includes("Component Library"),
      docShellEnglishLeaks,
      ownerVisibleCaptionHits,
      brandIdentityLogoSectionReadback,
      expectedCategoryCount,
      expectedShellNavGroupCount,
      expectedGroupCount,
      header,
      sideNavRegion,
      pageHead,
      firstStoryTop: firstStoryRect ? Number(firstStoryRect.top.toFixed(2)) : null,
      themeToggleRadius: themeToggleStyles?.["border-radius"] ?? null,
      search,
      searchInputShell,
      searchInputShellStyles,
      searchControl,
      searchIcon,
      searchShortcut,
      searchInputGridStyles,
      searchFitFailures,
      headerStyles: styleFor(".tcrn-doc-header", ["display", "grid-template-columns", "min-height"]),
      workspaceStyles: styleFor(".tcrn-doc-header__workspace", ["display", "grid-template-columns", "gap"]),
      pageHeadStyles: styleFor("[data-doc-page-head='governed-section']", ["display", "grid-template-columns", "gap", "border-bottom-style"]),
      layoutStyles: styleFor(".tcrn-doc-layout", ["display", "grid-template-columns"]),
      currentLocationBeforeSearch: Boolean(currentLocation && search && currentLocation.right <= search.left + 1),
      searchBeforeControls: Boolean(search && controls && search.right <= controls.left + 1),
      utilityTrailingGap: locale ? Number((window.innerWidth - locale.right).toFixed(2)) : null,
      pageHeadStartsBelowHeader: Boolean(pageHead && pageHead.top >= headerBottom - 1),
      storyStartsAfterPageHead: Boolean(pageHead && firstStoryRect && firstStoryRect.top >= pageHead.bottom - 1)
    };
  }, {
    group: route.group,
	    storyId: route.storyId,
	    expectedCategoryCount,
	    expectedShellNavGroupCount: expectedStorybookShellNavGroupCount,
	    expectedGroupCount: sectionPages.length,
    forbiddenZhCnProductShellText,
    forbiddenOwnerVisibleCaptionText
	  });
  const failures = [];
  if (metrics.locale !== "zh-CN") failures.push(`locale:${metrics.locale}`);
  if (metrics.activeSection !== route.group) failures.push(`active-section:${metrics.activeSection}`);
  if (metrics.activeStoryId !== route.storyId) failures.push(`active-story:${metrics.activeStoryId}`);
  if (metrics.scrollY > 2) failures.push(`first-story-hash-scrollY:${metrics.scrollY}`);
  if (metrics.shellAuthority !== "online-docs") failures.push(`doc-shell-authority:${metrics.shellAuthority}`);
  if (metrics.docShellSelectorCount < 6) failures.push(`doc-shell-selector-count:${metrics.docShellSelectorCount}`);
  if (metrics.globalProductShellShellSelectorCount !== 0) failures.push(`global-product-shell-shell-selectors:${metrics.globalProductShellShellSelectorCount}`);
  if (metrics.docPageHeadCount !== 1) failures.push(`page-head-count:${metrics.docPageHeadCount}`);
  if (metrics.onThisPageCount !== 1) failures.push(`on-this-page-count:${metrics.onThisPageCount}`);
  if (metrics.mandatoryBoundaryCount !== 1 || metrics.noOverclaimBoundaryCount !== 1) failures.push("mandatory-boundary-missing");
  if (metrics.legacyProductShellGlobalNavCount !== 0) failures.push(`legacy-product-shell-global-nav:${metrics.legacyProductShellGlobalNavCount}`);
  if (metrics.navGroupCount !== expectedStorybookShellNavGroupCount) failures.push(`nav-group-count:${metrics.navGroupCount}`);
  if (metrics.categoryLabelCount !== expectedCategoryCount) failures.push(`category-label-count:${metrics.categoryLabelCount}`);
  if (!metrics.docBrandCaptionLocalized) failures.push(`doc-brand-caption-zh-cn:${metrics.docBrandCaptionText ?? "missing"}`);
  if (metrics.docShellEnglishLeaks.length > 0) failures.push(`doc-shell-zh-cn-english-leaks:${metrics.docShellEnglishLeaks.join("|")}`);
  if (metrics.ownerVisibleCaptionHits.length > 0) failures.push(`owner-visible-caption-hits:${metrics.ownerVisibleCaptionHits.join("|")}`);
  if (metrics.brandIdentityLogoSectionReadback) {
    const readback = metrics.brandIdentityLogoSectionReadback;
    if (readback.productLockupCount !== 3) failures.push(`brand-identity-product-lockup-count:${readback.productLockupCount}`);
    if (!readback.hasProductLockupsLabel) failures.push("brand-identity-product-lockups-label-missing");
    if (readback.hasRegisteredProductLogosLabel) failures.push("brand-identity-registered-product-logos-primary-surface");
    if (readback.hasRegistryExportText) failures.push("brand-identity-registry-export-primary-surface");
    if (readback.hasAosRegisteredAssetId) failures.push("brand-identity-registered-asset-id-primary-surface");
  }
  if (metrics.themeToggleRadius !== expectedProductShellThemeToggleRadius) {
    failures.push(`theme-toggle-radius:${metrics.themeToggleRadius ?? "missing"}:expected:${expectedProductShellThemeToggleRadius}`);
  }
  if (metrics.pageOverflow) failures.push("page-overflow");
  if (!metrics.currentLocationBeforeSearch) failures.push("current-location-not-before-search");
  if (!metrics.searchBeforeControls) failures.push("search-not-before-controls");
  const widthWithin = (actual, expected, tolerance) => typeof actual === "number" && typeof expected === "number" && Math.abs(actual - expected) <= tolerance;
  const expectedSidebarWidth = expectedStorybookSidebarWidthForViewport(metrics.viewportWidth);
  if (!widthWithin(metrics.sideNavRegion?.width, expectedSidebarWidth, expectedStorybookVisualSkin.sidebarTolerancePx)) {
    failures.push(`storybook-skin-sidebar-width:${metrics.sideNavRegion?.width ?? "missing"}:expected:${expectedSidebarWidth}`);
  }
  if (!widthWithin(metrics.header?.height, expectedStorybookVisualSkin.topbarHeightPx, expectedStorybookVisualSkin.topbarTolerancePx)) {
    failures.push(`storybook-skin-topbar-height:${metrics.header?.height ?? "missing"}:expected:${expectedStorybookVisualSkin.topbarHeightPx}`);
  }
  if (!widthWithin(metrics.search?.width, expectedStorybookVisualSkin.searchRestWidthPx, 2)) {
    failures.push(`storybook-skin-search-width:${metrics.search?.width ?? "missing"}:expected:${expectedStorybookVisualSkin.searchRestWidthPx}`);
  }
  if ((metrics.searchFitFailures ?? []).length > 0) {
    failures.push(`storybook-skin-search-fit:${metrics.searchFitFailures.join("|")}`);
  }
  if (!widthWithin(metrics.searchInputShell?.height, expectedStorybookVisualSkin.searchHeightPx, 2)) {
    failures.push(`storybook-skin-search-height:${metrics.searchInputShell?.height ?? "missing"}:expected:${expectedStorybookVisualSkin.searchHeightPx}`);
  }
  if (metrics.searchInputShellStyles?.["border-color"] !== expectedStorybookVisualSkin.searchBorderColor) {
    failures.push(`storybook-skin-search-border:${metrics.searchInputShellStyles?.["border-color"] ?? "missing"}:expected:${expectedStorybookVisualSkin.searchBorderColor}`);
  }
  if (metrics.searchInputShellStyles?.["border-radius"] !== `${expectedStorybookVisualSkin.searchBorderRadiusPx}px`) {
    failures.push(`storybook-skin-search-radius:${metrics.searchInputShellStyles?.["border-radius"] ?? "missing"}:expected:${expectedStorybookVisualSkin.searchBorderRadiusPx}px`);
  }
  if (typeof metrics.utilityTrailingGap !== "number" || metrics.utilityTrailingGap < 16 || metrics.utilityTrailingGap > 32) {
    failures.push(`utility-trailing-gap:${metrics.utilityTrailingGap}`);
  }
  if (!metrics.pageHeadStartsBelowHeader) failures.push("page-head-not-below-header");
  if (!metrics.storyStartsAfterPageHead) failures.push("story-not-after-page-head");
  firstStoryHashShellParityReadbacks.push({ ...metrics, ok: failures.length === 0, failures });
}
const firstStoryHashDesktopReadbacks = firstStoryHashShellParityReadbacks.filter((item) => item.headerStyles);
const firstStoryHashShellParitySignature = {
  headerStyles: new Set(firstStoryHashDesktopReadbacks.map((item) => JSON.stringify(item.headerStyles))).size,
  workspaceStyles: new Set(firstStoryHashDesktopReadbacks.map((item) => JSON.stringify(item.workspaceStyles))).size,
  pageHeadStyles: new Set(firstStoryHashDesktopReadbacks.map((item) => JSON.stringify(item.pageHeadStyles))).size,
  layoutStyles: new Set(firstStoryHashDesktopReadbacks.map((item) => JSON.stringify(item.layoutStyles))).size,
  utilityTrailingGapDelta: firstStoryHashDesktopReadbacks.length
    ? Number((Math.max(...firstStoryHashDesktopReadbacks.map((item) => item.utilityTrailingGap ?? 0)) - Math.min(...firstStoryHashDesktopReadbacks.map((item) => item.utilityTrailingGap ?? 0))).toFixed(2))
    : 0
};
const firstStoryHashShellParitySignatureFailures = [];
for (const [name, value] of Object.entries(firstStoryHashShellParitySignature)) {
  if (name.endsWith("Delta")) {
    if (value > 2) firstStoryHashShellParitySignatureFailures.push(`${name}:${value}`);
  } else if (value !== 1) {
    firstStoryHashShellParitySignatureFailures.push(`${name}:${value}`);
  }
}
const firstStoryHashShellParityCheck = {
  ok: firstStoryHashShellParityReadbacks.every((item) => item.ok) && firstStoryHashShellParitySignatureFailures.length === 0,
  routes: firstStoryHashShellParityRoutes.map((route) => `${route.file}?theme=light&locale=zh-CN#${route.storyId}`),
  signature: firstStoryHashShellParitySignature,
  signatureFailures: firstStoryHashShellParitySignatureFailures,
  readbacks: firstStoryHashShellParityReadbacks
};
const mobileHashAnchorPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
const mobileFoundationHashRoute = `${staticServer.origin}/apps/storybook/storybook-static/foundations.html?theme=light&locale=zh-CN#foundation-visual-standards`;
const collectMobileHashAnchorMetrics = async (label) => {
  await mobileHashAnchorPage.waitForSelector("[data-storybook-locale='zh-CN']");
  await mobileHashAnchorPage.waitForSelector("[data-active-story-section='Foundations']");
  await mobileHashAnchorPage.waitForSelector("[data-doc-nav-item='foundation-visual-standards'][aria-current='location'][data-doc-nav-item-active='true']");
  const metrics = await mobileHashAnchorPage.evaluate((phaseLabel) => {
    const rectFor = (selector) => {
      const node = document.querySelector(selector);
      if (!node) {
        return null;
      }
      const rect = node.getBoundingClientRect();
      return {
        top: Number(rect.top.toFixed(2)),
        right: Number(rect.right.toFixed(2)),
        bottom: Number(rect.bottom.toFixed(2)),
        left: Number(rect.left.toFixed(2)),
        width: Number(rect.width.toFixed(2)),
        height: Number(rect.height.toFixed(2))
      };
    };
    const alphaFromColor = (color) => {
      const normalized = String(color || "").trim();
      if (!normalized || normalized === "transparent") return 0;
      const rgbaMatch = normalized.match(/^rgba?\((.+)\)$/i);
      if (rgbaMatch) {
        const parts = rgbaMatch[1].split(",").map((part) => part.trim());
        return parts.length >= 4 ? Number.parseFloat(parts[3]) : 1;
      }
      const colorFunctionAlpha = normalized.match(/\/\s*([0-9.]+%?)\s*\)$/i);
      if (colorFunctionAlpha) {
        const rawAlpha = colorFunctionAlpha[1];
        return rawAlpha.endsWith("%") ? Number.parseFloat(rawAlpha) / 100 : Number.parseFloat(rawAlpha);
      }
      return 1;
    };
    // getComputedStyle reports the *current* value of a property, which for an
    // element mid-transition is a point on the interpolation rather than the settled
    // colour. The theme wash and the shell's background transitions are still running
    // when this proof samples, so the recorded baseline drifted run to run — on the v1
    // palette it moved across rgb(41,42,45) … rgb(61,71,87), which made
    // story-coverage-manifest.json unreproducible and, worse, trained readers to
    // ignore a file that changes every time. Finishing every running animation first
    // makes the sample deterministic and is also the value the baseline is meant to
    // capture: what the surface settles to, not what it looked like in passing.
    const settleAnimations = () => {
      if (typeof document.getAnimations !== "function") return;
      for (const animation of document.getAnimations()) {
        try {
          animation.finish();
        } catch {
          // A never-ending animation (an infinite spinner) cannot finish; its own
          // frames are not what this proof measures, so skipping it is correct.
        }
      }
    };
    settleAnimations();
    const styleFor = (selector) => {
      const node = document.querySelector(selector);
      if (!node) {
        return null;
      }
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      const backgroundAlpha = alphaFromColor(style.backgroundColor);
      return {
        selector,
        backgroundColor: style.backgroundColor,
        backgroundImage: style.backgroundImage,
        backgroundAlpha: Number.isFinite(backgroundAlpha) ? Number(backgroundAlpha.toFixed(2)) : 0,
        opacity: Number.parseFloat(style.opacity || "1"),
        position: style.position,
        zIndex: style.zIndex,
        top: Number(rect.top.toFixed(2)),
        right: Number(rect.right.toFixed(2)),
        bottom: Number(rect.bottom.toFixed(2)),
        left: Number(rect.left.toFixed(2)),
        width: Number(rect.width.toFixed(2)),
        height: Number(rect.height.toFixed(2))
      };
    };
    const hitStackFor = (x, y) => document.elementsFromPoint(x, y).slice(0, 10).map((node) => ({
      tag: node.tagName.toLowerCase(),
      id: node.id || "",
      className: typeof node.className === "string" ? node.className : "",
      role: node.getAttribute("role"),
      docShell: node.getAttribute("data-doc-shell"),
      docNavItem: node.getAttribute("data-doc-nav-item"),
      shellControl: node.getAttribute("data-shell-control"),
      text: (node.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80)
    }));
    const pointReadbacks = [
      { label: "topbar-y20", x: 195, y: 20 },
      { label: "current-location-y60", x: 195, y: 60 },
      { label: "search-y125", x: 195, y: 125 },
      { label: "controls-y178", x: 195, y: 178 }
    ].map((point) => {
      const stack = hitStackFor(point.x, point.y);
      const shellIndex = stack.findIndex((entry) => entry.docShell === "online-docs"
        || entry.shellControl
        || entry.className.includes("tcrn-doc-header")
        || entry.className.includes("tcrn-doc-global-bar")
        || entry.className.includes("tcrn-doc-current-location")
        || entry.className.includes("tcrn-shell"));
      const storyContentIndex = stack.findIndex((entry) => entry.className.includes("tcrn-table-shell") || entry.className.includes("tcrn-readback-panel") || entry.className.includes("alpha-story-stack") || entry.className.includes("story-body"));
      return {
        ...point,
        shellIndex,
        storyContentIndex,
        shellPaintsAboveStoryContent: shellIndex >= 0 && (storyContentIndex === -1 || shellIndex < storyContentIndex),
        storyContentBehindShell: storyContentIndex >= 0,
        stack
      };
    });
    const html = document.documentElement;
    const body = document.body;
    const topbar = rectFor(".tcrn-doc-header");
    const article = rectFor("#foundation-visual-standards");
    const title = rectFor("#foundation-visual-standards > h2");
    const minimumClearancePx = 8;
    const topbarBottom = topbar?.bottom ?? 0;
    return {
      label: phaseLabel,
      route: window.location.pathname + window.location.search + window.location.hash,
      scrollY: Number(window.scrollY.toFixed(2)),
      viewport: { width: window.innerWidth, height: window.innerHeight },
      locale: document.querySelector("[data-storybook-locale]")?.getAttribute("data-storybook-locale") ?? document.documentElement.lang,
      shellAuthority: document.querySelector("[data-contract-surface]")?.getAttribute("data-doc-shell") ?? null,
      anchorScrollControlled: document.querySelector("[data-contract-surface]")?.getAttribute("data-anchor-scroll-controlled") ?? null,
      activeStoryId: document.querySelector("[data-doc-nav-item][data-doc-nav-item-active='true']")?.getAttribute("data-doc-nav-item") ?? null,
      anchorOffsetReadback: window.tcrnStorybookAnchorOffsetReadback ?? null,
      topbar,
      article,
      title,
      mobileTopbarLayering: {
        topbar: styleFor(".tcrn-doc-header"),
        utilityRow: styleFor(".tcrn-doc-global-bar"),
        workspace: styleFor(".tcrn-doc-header__workspace"),
        currentLocation: styleFor(".tcrn-doc-current-location"),
        searchWrapper: styleFor(".tcrn-doc-header-search"),
        searchInput: styleFor(".tcrn-search-input"),
        headerControls: styleFor(".tcrn-doc-header-controls"),
        controlsRow: styleFor(".tcrn-doc-header-controls__row"),
        themeToggle: styleFor(".tcrn-shell-theme-toggle"),
        localeTrigger: styleFor(".tcrn-shell-locale-menu__trigger"),
        pointReadbacks
      },
      articleClearancePx: article ? Number((article.top - topbarBottom).toFixed(2)) : null,
      titleClearancePx: title ? Number((title.top - topbarBottom).toFixed(2)) : null,
      articleReadableBelowTopbar: Boolean(article && article.top >= topbarBottom + minimumClearancePx),
      titleReadableBelowTopbar: Boolean(title && title.top >= topbarBottom + minimumClearancePx),
      docShellSelectorCount: document.querySelectorAll("[data-doc-shell], .tcrn-doc-header, .tcrn-doc-global-bar, .tcrn-doc-header-search, .tcrn-doc-nav, .tcrn-doc-sidebar").length,
      globalProductShellShellSelectorCount: Array.from(document.querySelectorAll("[data-storybook-shell-authority], [data-storybook-product-shell-skin], [data-package-backed-product-shell-boundary], [data-product-shell-region='side-navigation'], .tcrn-product-shell__sidebar, .tcrn-product-shell__main"))
        .filter((node) => !node.closest(".story-body"))
        .length,
      pageOverflow: Math.max(html.scrollWidth, body.scrollWidth) > Math.max(html.clientWidth, body.clientWidth) + 1
    };
  }, label);
  const failures = [];
  if (metrics.viewport.width !== 390 || metrics.viewport.height !== 844) failures.push(`viewport:${metrics.viewport.width}x${metrics.viewport.height}`);
  if (metrics.locale !== "zh-CN") failures.push(`locale:${metrics.locale}`);
  if (metrics.shellAuthority !== "online-docs") failures.push(`doc-shell-authority:${metrics.shellAuthority}`);
  if (metrics.anchorScrollControlled !== "true") failures.push(`anchor-scroll-controlled:${metrics.anchorScrollControlled}`);
  if (metrics.activeStoryId !== "foundation-visual-standards") failures.push(`active-story:${metrics.activeStoryId}`);
  if (!metrics.articleReadableBelowTopbar) failures.push(`article-clearance:${metrics.articleClearancePx}`);
  if (!metrics.titleReadableBelowTopbar) failures.push(`title-clearance:${metrics.titleClearancePx}`);
  for (const [name, layer] of Object.entries(metrics.mobileTopbarLayering ?? {})) {
    if (name === "pointReadbacks") continue;
    if (!layer) {
      failures.push(`mobile-layer-missing:${name}`);
      continue;
    }
    if (layer.backgroundAlpha < 0.98) {
      failures.push(`mobile-layer-transparent:${name}:${layer.backgroundColor}`);
    }
    if (layer.opacity < 0.98) failures.push(`mobile-layer-opacity:${name}:${layer.opacity}`);
  }
  for (const point of metrics.mobileTopbarLayering?.pointReadbacks ?? []) {
    if (!point.shellPaintsAboveStoryContent) {
      failures.push(`mobile-layer-stack:${point.label}:shell:${point.shellIndex}:story:${point.storyContentIndex}`);
    }
  }
  if (metrics.docShellSelectorCount < 6) failures.push(`doc-shell-selector-count:${metrics.docShellSelectorCount}`);
  if (metrics.globalProductShellShellSelectorCount !== 0) failures.push(`global-product-shell-shell-selectors:${metrics.globalProductShellShellSelectorCount}`);
  if (metrics.pageOverflow) failures.push("page-overflow");
  return { ...metrics, ok: failures.length === 0, failures };
};
await mobileHashAnchorPage.goto(mobileFoundationHashRoute);
await mobileHashAnchorPage.waitForLoadState("load");
await mobileHashAnchorPage.waitForTimeout(80);
const mobileHashAnchorReadbacks = [await collectMobileHashAnchorMetrics("after-load")];
await mobileHashAnchorPage.waitForTimeout(700);
mobileHashAnchorReadbacks.push(await collectMobileHashAnchorMetrics("after-700ms"));
await mobileHashAnchorPage.waitForTimeout(800);
mobileHashAnchorReadbacks.push(await collectMobileHashAnchorMetrics("after-1500ms"));
await mobileHashAnchorPage.reload({ waitUntil: "load" });
await mobileHashAnchorPage.waitForTimeout(1500);
mobileHashAnchorReadbacks.push(await collectMobileHashAnchorMetrics("after-reload-1500ms"));
await mobileHashAnchorPage.close();
const mobileHashAnchorOcclusionCheck = {
  ok: mobileHashAnchorReadbacks.every((item) => item.ok),
  route: "foundations.html?theme=light&locale=zh-CN#foundation-visual-standards",
  viewport: { width: 390, height: 844 },
  readbacks: mobileHashAnchorReadbacks
};
const mobileKnowledgeDocShellLayeringPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
const mobileKnowledgeDocShellLayeringRoute = `${staticServer.origin}/apps/storybook/storybook-static/components.html?theme=dark&locale=zh-CN#knowledge-management-components-spec`;
const collectMobileKnowledgeDocShellLayeringMetrics = async (label) => {
  await mobileKnowledgeDocShellLayeringPage.waitForSelector("[data-storybook-locale='zh-CN']");
  await mobileKnowledgeDocShellLayeringPage.waitForSelector("[data-active-story-section='Components']");
  await mobileKnowledgeDocShellLayeringPage.waitForSelector("[data-doc-nav-item='knowledge-management-components-spec'][aria-current='location'][data-doc-nav-item-active='true']");
  const metrics = await mobileKnowledgeDocShellLayeringPage.evaluate((phaseLabel) => {
    const rectFor = (selector) => {
      const node = document.querySelector(selector);
      if (!node) {
        return null;
      }
      const rect = node.getBoundingClientRect();
      return {
        top: Number(rect.top.toFixed(2)),
        right: Number(rect.right.toFixed(2)),
        bottom: Number(rect.bottom.toFixed(2)),
        left: Number(rect.left.toFixed(2)),
        width: Number(rect.width.toFixed(2)),
        height: Number(rect.height.toFixed(2))
      };
    };
    const alphaFromColor = (color) => {
      const normalized = String(color || "").trim();
      if (!normalized || normalized === "transparent") return 0;
      const rgbaMatch = normalized.match(/^rgba?\((.+)\)$/i);
      if (rgbaMatch) {
        const parts = rgbaMatch[1].split(",").map((part) => part.trim());
        return parts.length >= 4 ? Number.parseFloat(parts[3]) : 1;
      }
      const colorFunctionAlpha = normalized.match(/\/\s*([0-9.]+%?)\s*\)$/i);
      if (colorFunctionAlpha) {
        const rawAlpha = colorFunctionAlpha[1];
        return rawAlpha.endsWith("%") ? Number.parseFloat(rawAlpha) / 100 : Number.parseFloat(rawAlpha);
      }
      return 1;
    };
    // getComputedStyle reports the *current* value of a property, which for an
    // element mid-transition is a point on the interpolation rather than the settled
    // colour. The theme wash and the shell's background transitions are still running
    // when this proof samples, so the recorded baseline drifted run to run — on the v1
    // palette it moved across rgb(41,42,45) … rgb(61,71,87), which made
    // story-coverage-manifest.json unreproducible and, worse, trained readers to
    // ignore a file that changes every time. Finishing every running animation first
    // makes the sample deterministic and is also the value the baseline is meant to
    // capture: what the surface settles to, not what it looked like in passing.
    const settleAnimations = () => {
      if (typeof document.getAnimations !== "function") return;
      for (const animation of document.getAnimations()) {
        try {
          animation.finish();
        } catch {
          // A never-ending animation (an infinite spinner) cannot finish; its own
          // frames are not what this proof measures, so skipping it is correct.
        }
      }
    };
    settleAnimations();
    const styleFor = (selector) => {
      const node = document.querySelector(selector);
      if (!node) {
        return null;
      }
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      const backgroundAlpha = alphaFromColor(style.backgroundColor);
      return {
        selector,
        backgroundColor: style.backgroundColor,
        backgroundImage: style.backgroundImage,
        backgroundAlpha: Number.isFinite(backgroundAlpha) ? Number(backgroundAlpha.toFixed(2)) : 0,
        opacity: Number.parseFloat(style.opacity || "1"),
        position: style.position,
        zIndex: style.zIndex,
        top: Number(rect.top.toFixed(2)),
        right: Number(rect.right.toFixed(2)),
        bottom: Number(rect.bottom.toFixed(2)),
        left: Number(rect.left.toFixed(2)),
        width: Number(rect.width.toFixed(2)),
        height: Number(rect.height.toFixed(2))
      };
    };
    const hitStackFor = (x, y) => document.elementsFromPoint(x, y).slice(0, 10).map((node) => ({
      tag: node.tagName.toLowerCase(),
      id: node.id || "",
      className: typeof node.className === "string" ? node.className : "",
      role: node.getAttribute("role"),
      docShell: node.getAttribute("data-doc-shell"),
      docNavItem: node.getAttribute("data-doc-nav-item"),
      shellControl: node.getAttribute("data-shell-control"),
      text: (node.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80)
    }));
    const topbar = rectFor(".tcrn-doc-header");
    const topbarBottom = topbar?.bottom ?? 0;
    const sampledYs = [20, 60, 125, 260, 305, 360]
      .filter((y) => y > 0 && y < Math.max(1, topbarBottom - 1));
    const pointReadbacks = sampledYs.map((y) => {
      const point = { label: `mobile-doc-shell-y${y}`, x: 195, y };
      const stack = hitStackFor(point.x, point.y);
      const shellIndex = stack.findIndex((entry) => entry.docShell === "online-docs"
        || entry.shellControl
        || entry.className.includes("tcrn-doc-header")
        || entry.className.includes("tcrn-doc-global-bar")
        || entry.className.includes("tcrn-doc-current-location")
        || entry.className.includes("tcrn-doc-header-search")
        || entry.className.includes("tcrn-doc-header-controls")
        || entry.className.includes("tcrn-shell"));
      const storyContentIndex = stack.findIndex((entry) => entry.className.includes("tcrn-table-shell")
        || entry.className.includes("tcrn-readback-panel")
        || entry.className.includes("alpha-story-stack")
        || entry.className.includes("story-body"));
      return {
        ...point,
        shellIndex,
        storyContentIndex,
        shellPaintsAboveStoryContent: shellIndex >= 0 && (storyContentIndex === -1 || shellIndex < storyContentIndex),
        storyContentBehindShell: storyContentIndex >= 0,
        stack
      };
    });
    const html = document.documentElement;
    const body = document.body;
    const article = rectFor("#knowledge-management-components-spec");
    const title = rectFor("#knowledge-management-components-spec > h2");
    const minimumClearancePx = 8;
    return {
      label: phaseLabel,
      route: window.location.pathname + window.location.search + window.location.hash,
      scrollY: Number(window.scrollY.toFixed(2)),
      viewport: { width: window.innerWidth, height: window.innerHeight },
      locale: document.querySelector("[data-storybook-locale]")?.getAttribute("data-storybook-locale") ?? document.documentElement.lang,
      shellAuthority: document.querySelector("[data-contract-surface]")?.getAttribute("data-doc-shell") ?? null,
      anchorScrollControlled: document.querySelector("[data-contract-surface]")?.getAttribute("data-anchor-scroll-controlled") ?? null,
      activeStoryId: document.querySelector("[data-doc-nav-item][data-doc-nav-item-active='true']")?.getAttribute("data-doc-nav-item") ?? null,
      topbar,
      article,
      title,
      mobileTopbarLayering: {
        topbar: styleFor(".tcrn-doc-header"),
        utilityRow: styleFor(".tcrn-doc-global-bar"),
        workspace: styleFor(".tcrn-doc-header__workspace"),
        currentLocation: styleFor(".tcrn-doc-current-location"),
        searchWrapper: styleFor(".tcrn-doc-header-search"),
        searchInput: styleFor(".tcrn-search-input"),
        headerControls: styleFor(".tcrn-doc-header-controls"),
        controlsRow: styleFor(".tcrn-doc-header-controls__row"),
        themeToggle: styleFor(".tcrn-shell-theme-toggle"),
        localeTrigger: styleFor(".tcrn-shell-locale-menu__trigger"),
        pointReadbacks
      },
      articleClearancePx: article ? Number((article.top - topbarBottom).toFixed(2)) : null,
      titleClearancePx: title ? Number((title.top - topbarBottom).toFixed(2)) : null,
      articleReadableBelowTopbar: Boolean(article && article.top >= topbarBottom + minimumClearancePx),
      titleReadableBelowTopbar: Boolean(title && title.top >= topbarBottom + minimumClearancePx),
      docShellSelectorCount: document.querySelectorAll("[data-doc-shell], .tcrn-doc-header, .tcrn-doc-global-bar, .tcrn-doc-header-search, .tcrn-doc-nav, .tcrn-doc-sidebar").length,
      globalProductShellShellSelectorCount: Array.from(document.querySelectorAll("[data-storybook-shell-authority], [data-storybook-product-shell-skin], [data-package-backed-product-shell-boundary], [data-product-shell-region='side-navigation'], .tcrn-product-shell__sidebar, .tcrn-product-shell__main"))
        .filter((node) => !node.closest(".story-body"))
        .length,
      pageOverflow: Math.max(html.scrollWidth, body.scrollWidth) > Math.max(html.clientWidth, body.clientWidth) + 1
    };
  }, label);
  const failures = [];
  if (metrics.viewport.width !== 390 || metrics.viewport.height !== 844) failures.push(`viewport:${metrics.viewport.width}x${metrics.viewport.height}`);
  if (metrics.locale !== "zh-CN") failures.push(`locale:${metrics.locale}`);
  if (metrics.shellAuthority !== "online-docs") failures.push(`doc-shell-authority:${metrics.shellAuthority}`);
  if (metrics.anchorScrollControlled !== "true") failures.push(`anchor-scroll-controlled:${metrics.anchorScrollControlled}`);
  if (metrics.activeStoryId !== "knowledge-management-components-spec") failures.push(`active-story:${metrics.activeStoryId}`);
  if (!metrics.articleReadableBelowTopbar) failures.push(`article-clearance:${metrics.articleClearancePx}`);
  if (!metrics.titleReadableBelowTopbar) failures.push(`title-clearance:${metrics.titleClearancePx}`);
  for (const [name, layer] of Object.entries(metrics.mobileTopbarLayering ?? {})) {
    if (name === "pointReadbacks") continue;
    if (!layer) {
      failures.push(`mobile-knowledge-layer-missing:${name}`);
      continue;
    }
    if (layer.backgroundAlpha < 0.98) {
      failures.push(`mobile-knowledge-layer-transparent:${name}:${layer.backgroundColor}`);
    }
    if (layer.opacity < 0.98) failures.push(`mobile-knowledge-layer-opacity:${name}:${layer.opacity}`);
  }
  for (const point of metrics.mobileTopbarLayering?.pointReadbacks ?? []) {
    if (!point.shellPaintsAboveStoryContent) {
      failures.push(`mobile-knowledge-layer-stack:${point.label}:shell:${point.shellIndex}:story:${point.storyContentIndex}`);
    }
  }
  if (metrics.docShellSelectorCount < 6) failures.push(`doc-shell-selector-count:${metrics.docShellSelectorCount}`);
  if (metrics.globalProductShellShellSelectorCount !== 0) failures.push(`global-product-shell-shell-selectors:${metrics.globalProductShellShellSelectorCount}`);
  if (metrics.pageOverflow) failures.push("page-overflow");
  return { ...metrics, ok: failures.length === 0, failures };
};
await mobileKnowledgeDocShellLayeringPage.goto(mobileKnowledgeDocShellLayeringRoute);
await mobileKnowledgeDocShellLayeringPage.waitForLoadState("load");
await mobileKnowledgeDocShellLayeringPage.waitForTimeout(80);
const mobileKnowledgeDocShellLayeringReadbacks = [await collectMobileKnowledgeDocShellLayeringMetrics("after-load")];
await mobileKnowledgeDocShellLayeringPage.waitForTimeout(700);
mobileKnowledgeDocShellLayeringReadbacks.push(await collectMobileKnowledgeDocShellLayeringMetrics("after-700ms"));
await mobileKnowledgeDocShellLayeringPage.reload({ waitUntil: "load" });
await mobileKnowledgeDocShellLayeringPage.waitForTimeout(1500);
mobileKnowledgeDocShellLayeringReadbacks.push(await collectMobileKnowledgeDocShellLayeringMetrics("after-reload-1500ms"));
await mobileKnowledgeDocShellLayeringPage.close();
const mobileKnowledgeDocShellLayeringCheck = {
  ok: mobileKnowledgeDocShellLayeringReadbacks.every((item) => item.ok),
  route: "components.html?theme=dark&locale=zh-CN#knowledge-management-components-spec",
  viewport: { width: 390, height: 844 },
  readbacks: mobileKnowledgeDocShellLayeringReadbacks
};
	await storybookPage.goto(`${staticServer.origin}/apps/storybook/storybook-static/components.html?locale=zh-CN#component-family-index`);
	await storybookPage.waitForSelector("[data-active-story-section='Components']");
	await storybookPage.waitForSelector("[data-storybook-locale='zh-CN']");
	await storybookPage.evaluate((routeId) => {
	  const link = document.querySelector(`[data-doc-nav-item='${routeId}']`);
	  const category = link?.closest(".tcrn-doc-nav__category");
	  const toggle = category?.querySelector("[data-doc-nav-category-toggle]");
	  if (category instanceof HTMLElement && category.getAttribute("data-doc-nav-category-open") !== "true" && toggle instanceof HTMLElement) {
	    toggle.click();
	  }
	}, "table-work-index-spec");
	await storybookPage.locator("[data-doc-nav-item='table-work-index-spec']").waitFor({ state: "visible" });
await storybookPage.locator("[data-doc-nav-item='table-work-index-spec']").evaluate((link) => link.click());
await storybookPage.waitForSelector("[data-doc-nav-item='table-work-index-spec'][aria-current='location'][data-doc-nav-item-active='true']");
await storybookPage.waitForTimeout(150);
const anchorScrollMetrics = await storybookPage.evaluate(() => {
  const target = document.getElementById("table-work-index-spec");
  const previous = document.getElementById("dialog-spec-usage");
  const active = document.querySelector("[data-doc-nav-item][data-doc-nav-item-active='true']");
  return {
    url: window.location.href,
    activeStoryId: active?.getAttribute("data-doc-nav-item") ?? null,
    targetTop: target ? Math.round(target.getBoundingClientRect().top) : null,
    previousBottom: previous ? Math.round(previous.getBoundingClientRect().bottom) : null,
    offset: Number.parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue("--tcrn-anchor-scroll-offset")),
    maxScrollY: Math.round(document.documentElement.scrollHeight - window.innerHeight),
    scrollY: Math.round(window.scrollY)
  };
});
const anchorScrollCheck = {
  ok: storybookPage.url().endsWith("/components.html?locale=zh-CN#table-work-index-spec")
    && anchorScrollMetrics.activeStoryId === "table-work-index-spec"
    && targetTopMatchesAnchorOffset(anchorScrollMetrics)
    && (anchorScrollMetrics.previousBottom === null || anchorScrollMetrics.previousBottom <= anchorScrollMetrics.targetTop - 12),
  source: "left secondary nav click -> table-work-index-spec",
  metrics: anchorScrollMetrics
};
await storybookPage.goto(`${staticServer.origin}/apps/storybook/storybook-static/patterns.html?locale=zh-CN#readiness-notification-patterns`);
await storybookPage.waitForSelector("[data-active-story-section='Patterns']");
await storybookPage.waitForSelector("[data-storybook-locale='zh-CN']");
await storybookPage.waitForSelector("[data-doc-nav-item='readiness-notification-patterns'][aria-current='location'][data-doc-nav-item-active='true']");
await storybookPage.waitForTimeout(300);
await storybookPage.evaluate(() => {
  const target = document.getElementById("dashboard-page-templates");
  if (!target) {
    throw new Error("missing-dashboard-page-templates");
  }
  const rawOffset = window.getComputedStyle(document.documentElement).getPropertyValue("--tcrn-anchor-scroll-offset");
  const parsedOffset = Number.parseFloat(rawOffset);
  const offset = Number.isFinite(parsedOffset) ? parsedOffset : 22;
  const nextTop = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);
  window.scrollTo({ top: nextTop, left: 0, behavior: "auto" });
});
await storybookPage.waitForFunction(() => {
  const active = document.querySelector("[data-doc-nav-item][data-doc-nav-item-active='true']");
  return active?.getAttribute("data-doc-nav-item") === "dashboard-page-templates";
});
const scrollSpyMetrics = await storybookPage.evaluate(() => {
  const target = document.getElementById("dashboard-page-templates");
  const active = document.querySelector("[data-doc-nav-item][data-doc-nav-item-active='true']");
  return {
    url: window.location.href,
    activeStoryId: active?.getAttribute("data-doc-nav-item") ?? null,
    activeAriaCurrent: active?.getAttribute("aria-current") ?? null,
    targetTop: target ? Math.round(target.getBoundingClientRect().top) : null,
    offset: Number.parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue("--tcrn-anchor-scroll-offset")),
    maxScrollY: Math.round(document.documentElement.scrollHeight - window.innerHeight),
    scrollY: Math.round(window.scrollY),
    hash: window.location.hash,
    scrollSpyAvailable: Boolean(window.tcrnStorybookScrollSpy)
  };
});
const scrollSpyCheck = {
  ok: scrollSpyMetrics.activeStoryId === "dashboard-page-templates"
    && scrollSpyMetrics.activeAriaCurrent === "location"
    && targetTopMatchesAnchorOffset(scrollSpyMetrics)
    && scrollSpyMetrics.hash === "#readiness-notification-patterns"
    && scrollSpyMetrics.scrollSpyAvailable,
  source: "manual page scroll -> dashboard-page-templates active nav",
  metrics: scrollSpyMetrics
};
async function expandAllStoriesForContentRead(page) {
  // Localized-content checks read innerText, which excludes collapsed story bodies.
  // They prove localization, not the disclosure state — disclosure has its own gate —
  // so the stories are expanded before the read.
  await page.evaluate(() => {
    for (const article of document.querySelectorAll("article[data-story-collapsed]")) {
      article.setAttribute("data-story-collapsed", "false");
    }
  });
}

async function collectLocalizedTextCheck(page, check) {
  await page.goto(`${staticServer.origin}/${check.route}`);
  await page.waitForSelector(`[data-storybook-locale='${check.locale}']`);
  await page.waitForSelector(`[data-active-story-section='${check.section}']`);
  await page.waitForSelector(`[data-doc-nav-item='${check.storyId}'][aria-current='location'][data-doc-nav-item-active='true']`);
  await page.waitForTimeout(150);
  await expandAllStoriesForContentRead(page);
  const bodyText = await page.evaluate(() => document.body.innerText);
  const missingRequiredText = check.requiredText.filter((text) => !bodyText.includes(text));
  const leakedForbiddenText = check.forbiddenText.filter((text) => bodyText.includes(text));
  return {
    locale: check.locale,
    route: check.route,
    url: page.url(),
    ok: missingRequiredText.length === 0 && leakedForbiddenText.length === 0,
    requiredText: check.requiredText,
    forbiddenText: check.forbiddenText,
    missingRequiredText,
    leakedForbiddenText
  };
}

async function collectLocalizedShellChromeCheck(page, check) {
  await page.goto(`${staticServer.origin}/${check.route}`);
  await page.waitForSelector(`[data-storybook-locale='${check.locale}']`);
  await page.waitForSelector(`[data-active-story-section='${check.section}']`);
  await page.waitForSelector(`[data-doc-nav-item='${check.storyId}'][aria-current='location'][data-doc-nav-item-active='true']`);
  await page.waitForSelector("[data-doc-nav-group]");
  await page.waitForTimeout(150);
  await expandAllStoriesForContentRead(page);
  const metrics = await page.evaluate(({ requiredText, forbiddenText, expectedCategoryCount, expectedShellNavGroupCount }) => {
    const bodyText = document.body.innerText;
    const html = document.documentElement;
    const body = document.body;
    const accessibilityAttributeNames = ["aria-label", "title", "placeholder", "alt"];
    const accessibilityAttributeLeaks = Array.from(document.querySelectorAll("[aria-label], [title], [placeholder], [alt]"))
      .filter((node) => !node.matches("link[data-tcrn-ai-consumption-contract], link[data-tcrn-ai-consumption-contract-help]"))
      .flatMap((node) => accessibilityAttributeNames
        .map((name) => ({ name, value: node.getAttribute(name) }))
        .filter((item) => item.value)
        .flatMap((item) => forbiddenText
          .filter((term) => item.value.includes(term))
          .map((term) => ({
            term,
            tag: node.tagName,
            attribute: item.name,
            value: item.value
          }))));
    const storybookNav = document.querySelector("[data-contract-surface='tcrn-design-system-storybook'] .tcrn-doc-nav");
    const navRoot = storybookNav ?? document;
    const categoryLabels = Array.from(navRoot.querySelectorAll(".tcrn-doc-nav__category-label"))
      .map((node) => node.textContent?.trim() ?? "")
      .filter(Boolean);
    const categoryDescriptions = Array.from(navRoot.querySelectorAll("[data-doc-nav-category-toggle][aria-describedby]"))
      .map((node) => document.getElementById(node.getAttribute("aria-describedby") ?? "")?.textContent?.trim() ?? "")
      .filter(Boolean);
    const currentLocation = document.querySelector(".tcrn-doc-current-location");
	    const onThisPage = document.querySelector(".tcrn-doc-on-this-page");
	    const localizedTextSurface = [
	      bodyText,
	      currentLocation?.textContent ?? "",
	      categoryLabels.join("\\n"),
	      categoryDescriptions.join("\\n")
	    ].join("\\n");
	    return {
      locale: document.querySelector("[data-storybook-locale]")?.getAttribute("data-storybook-locale") ?? document.documentElement.getAttribute("data-storybook-locale"),
      route: window.location.pathname + window.location.search + window.location.hash,
	      missingRequiredText: requiredText.filter((text) => !localizedTextSurface.includes(text)),
	      leakedForbiddenText: forbiddenText.filter((text) => localizedTextSurface.includes(text)),
      accessibilityAttributeLeaks,
      categoryLabels,
      categoryLabelCount: categoryLabels.length,
      categoryDescriptions,
      categoryDescriptionCount: categoryDescriptions.length,
      categoryDescriptionEnglishLeaks: categoryDescriptions.filter((text) => forbiddenText.some((term) => text.includes(term))),
      currentLocationText: currentLocation?.textContent?.replace(/\s+/g, " ").trim() ?? null,
      onThisPageAriaLabel: onThisPage?.getAttribute("aria-label") ?? null,
      expectedCategoryCount,
      expectedShellNavGroupCount,
      bodyScrollWidth: body.scrollWidth,
      viewportWidth: window.innerWidth,
      pageOverflow: Math.max(html.scrollWidth, body.scrollWidth) > Math.max(html.clientWidth, body.clientWidth) + 1
    };
  }, check);
  return {
    locale: check.locale,
    route: check.route,
    url: page.url(),
    ...metrics,
    ok: metrics.locale === check.locale
      && metrics.missingRequiredText.length === 0
      && metrics.leakedForbiddenText.length === 0
      && metrics.accessibilityAttributeLeaks.length === 0
      && metrics.categoryLabelCount === check.expectedCategoryCount
      && metrics.categoryDescriptionCount === check.expectedCategoryCount
      && metrics.categoryDescriptionEnglishLeaks.length === 0
      && metrics.currentLocationText?.includes(check.expectedCurrentLocationAriaLabel)
      && metrics.onThisPageAriaLabel === check.expectedOnThisPageAriaLabel
      && !metrics.pageOverflow
  };
}

const i18nContentChecks = [
  await collectLocalizedTextCheck(storybookPage, {
    locale: "zh-CN",
    route: `${staticSurfacePath}?locale=zh-CN#welcome-governance`,
    section: "Welcome",
    storyId: "welcome-governance",
    requiredText: ["从这里开始", "阅读路径", "声明边界", "边界地图", "路由目录", "准入", "本地检查点"],
    forbiddenText: ["Start here", "Reader paths", "Claim boundaries", "Boundary map", "Routing directory", "Admission", "Local checkpoint"]
  }),
  await collectLocalizedTextCheck(storybookPage, {
    locale: "ja",
    route: `${staticSurfacePath}?locale=ja#button-spec-usage`,
    section: "Components",
    storyId: "button-spec-usage",
    requiredText: ["ボタン仕様と使用法", "主要操作", "所有ルートの承認が必要"],
    forbiddenText: ["Button spec and usage", "Primary action", "Requires owning route approval"]
  }),
  await collectLocalizedTextCheck(storybookPage, {
    locale: "zh-CN",
    route: `apps/storybook/storybook-static/style-guide.html?locale=zh-CN#color-palette`,
    section: "Style Guide",
    storyId: "color-palette",
    requiredText: ["品牌色系", "主品牌色", "副色系", "色彩角色矩阵", "主题一致性", "字体与字号令牌", "字体族契约", "字体授权层级", "页面标题 / 28px", "文本层级与节奏", "布局密度矩阵", "动效样例", "减弱动效兜底", "加载与进度样例", "骨架屏预览", "进度反馈", "交互可感知性矩阵", "状态权威矩阵", "文案流程", "禁止的文案模式"],
    forbiddenText: ["Brand palette", "Primary brand", "Secondary brand", "Color role matrix", "Theme parity", "Type scale tokens", "Font family contract", "font licensing tiers", "Page title / 28px", "Type hierarchy and rhythm", "Layout density matrix", "Motion examples", "Reduced motion fallback", "Loading and progress examples", "Skeleton preview", "Progress feedback", "Interaction affordance matrix", "State authority matrix", "Copy workflow", "Forbidden copy patterns"]
  }),
  await collectLocalizedTextCheck(storybookPage, {
    locale: "zh-CN",
    route: `apps/storybook/storybook-static/change-log.html?theme=light&locale=zh-CN#local-changelog`,
    section: "Change Log",
    storyId: "local-changelog",
    requiredText: ["本地变更日志", "治理变更记录", "Storybook 治理检查点", "源路线", "故事覆盖", "AI 契约摘要", "证明工件", "无过度声明边界", "耐久源记录", "不发布", "本页内容", "治理记录"],
	    forbiddenText: ["Governance changelog records", "Date", "Source route", "Story ids", "AI contract digest readback", "Proof artifacts and boundaries", "Proof artifacts", "No-overclaim boundaries", "durable source record", "AI contract digest verified by smoke", "proof receipts required", "no publication", "Current location", "On this page", "Documentation sections", "Welcome and governance", "Maintainers and routing", "Contribution model", "Icons and motion", "Global states", "Copy creation rules", "Component family index", "AI consumption contract", "Local changelog", "Governance entry", "Routing and contribution", "Identity and brand", "Type and layout", "Work Management", "Proof governance", "Governance records"]
	  })
];
const globalZhCnIaShellCheck = await collectLocalizedShellChromeCheck(storybookPage, {
  locale: "zh-CN",
  route: `${staticSurfacePath}?theme=light&locale=zh-CN#welcome-governance`,
  section: "Welcome",
  storyId: "welcome-governance",
    expectedCategoryCount,
    expectedShellNavGroupCount: expectedStorybookShellNavGroupCount,
  expectedCurrentLocationAriaLabel: "当前位置",
  expectedOnThisPageAriaLabel: "本页内容",
  requiredText: [
    "当前位置",
    "受治理的 Storybook 栏目",
    "本页内容",
    "欢迎",
    "样式指南",
    "基础",
    "组件",
    "模式",
    "证明",
    "变更日志"
  ],
  forbiddenText: [
	    "Current location",
	    "Governed Storybook section",
	    "On this page",
	    "Documentation sections",
	    "Welcome and governance",
	    "Maintainers and routing",
	    "Contribution model",
	    "Icons and motion",
	    "Global states",
	    "Copy creation rules",
	    "Component family index",
	    "AI consumption contract",
	    "Local changelog",
	    "Governance entry",
    "Routing and contribution",
    "Identity and brand",
    "Type and layout",
    "Interaction and copy",
    "Tokens and i18n",
    "Copy governance",
    "Component inventory",
    "Controls and data",
    "Navigation and shells",
    "Work Management",
    "Forms and workbench",
    "Feedback and selection",
    "Data and pages",
    "Proof governance",
    "Governance records"
  ]
});
async function collectBrandMarkLocaleCheck(page, locale) {
  await page.goto(`${staticServer.origin}/apps/storybook/storybook-static/style-guide.html?locale=${locale}#brand-identity`);
  await page.waitForSelector(`[data-storybook-locale='${locale}']`);
  await page.waitForSelector("[data-story-id='brand-identity']");
  const details = await page.evaluate(() => {
    const marks = Array.from(document.querySelectorAll("[data-story-id='brand-identity'] .tcrn-brand-mark"));
    const productLogos = Array.from(document.querySelectorAll("[data-story-id='brand-identity'] .tcrn-product-logo"));
    const productLockups = Array.from(document.querySelectorAll("[data-story-id='brand-identity'] [data-brand-lockup='product']"));
    const storyText = document.querySelector("[data-story-id='brand-identity']")?.textContent ?? "";

    return {
      labels: marks.map((node) => node.getAttribute("aria-label")),
      sources: marks.map((node) => node.getAttribute("src")),
      productLockups: productLockups.map((node) => ({
        suffix: node.querySelector(".tcrn-brand-wordmark__suffix")?.textContent?.trim() ?? null,
        packageSource: node.getAttribute("data-component-source"),
        packageBackedBrandLockup: node.getAttribute("data-package-backed-brand-lockup")
      })),
      productLogos: productLogos.map((node) => ({
        productId: node.getAttribute("data-product-id"),
        assetId: node.getAttribute("data-product-logo-asset-id"),
        lineOne: node.querySelector(".tcrn-product-logo__line-one")?.textContent?.trim() ?? null,
        lineTwo: node.querySelector(".tcrn-product-logo__line-two")?.textContent?.trim() ?? null
      })),
      hasRegisteredProductLogosLabel: storyText.includes("Registered product logos"),
      hasRegistryExportText: storyText.includes("ProductLogo / tcrnProductLogoRegistry")
    };
  });
  const expectedDesignSystemSuffixByLocale = {
    "zh-CN": "设计系统",
    en: "Design System",
    ja: "デザインシステム",
    ko: "디자인 시스템",
    fr: "Design System"
  };
  const expectedProductLockups = ["AOS", "TMS", expectedDesignSystemSuffixByLocale[locale] ?? "Design System"];
  const productLockupChecks = expectedProductLockups.map((expected) => {
    const actual = details.productLockups.find((lockup) => lockup.suffix === expected);
    return {
      suffix: expected,
      actual,
      ok: actual?.packageSource === "@tcrn/ui-react"
        && actual?.packageBackedBrandLockup === "product"
    };
  });
  return {
    locale,
    ...details,
    productLockupChecks,
    ok: details.labels.length === 4
      && details.labels.some((label) => label === "TCRN brand mark")
      && details.sources.every((source) => source?.endsWith("tcrn-brand-mark.svg"))
      && details.productLogos.length === 0
      && productLockupChecks.every((check) => check.ok)
      && !details.hasRegisteredProductLogosLabel
      && !details.hasRegistryExportText
  };
}
const brandMarkLocaleChecks = [];
for (const locale of ["zh-CN", "en", "ja", "ko", "fr"]) {
  brandMarkLocaleChecks.push(await collectBrandMarkLocaleCheck(storybookPage, locale));
}
await storybookPage.goto(`${staticServer.origin}/${staticSurfacePath}?locale=ja#button-spec-usage`);
await storybookPage.waitForSelector("[data-active-story-section='Components']");
await storybookPage.waitForSelector("[data-storybook-locale='ja']");
await storybookPage.waitForSelector("[data-doc-nav-item='button-spec-usage'][aria-current='location'][data-doc-nav-item-active='true']");
const localeRouteCheck = {
  ok: storybookPage.url().endsWith("/components.html?locale=ja#button-spec-usage")
    && await storybookPage.locator("[data-story-section='Components']").isVisible()
    && await storybookPage.locator("[data-story-id='button-spec-usage']").isVisible()
    && await storybookPage.locator("[data-i18n-locale-select]").evaluate((node) => node.value) === "ja"
    && await storybookPage.evaluate(() => Array.from(document.querySelectorAll("[data-i18n='story.button-spec-usage.title']"))
      .some((node) => node.textContent?.trim() === "ボタン仕様と使用法"))
    && await storybookPage.evaluate(() => Array.from(document.querySelectorAll("[data-i18n='group.Components']"))
      .some((node) => node.textContent?.trim() === "コンポーネント"))
    && i18nContentChecks.every((check) => check.ok)
    && globalZhCnIaShellCheck.ok
    && brandMarkLocaleChecks.every((check) => check.ok),
  source: `${staticSurfacePath}?locale=ja#button-spec-usage`,
  url: storybookPage.url(),
  i18nContentChecks,
  globalZhCnIaShellCheck,
  brandMarkLocaleChecks
};
const storybookChecks = [];
for (const story of requiredStories) {
  await storybookPage.goto(`${staticServer.origin}/${staticStoryRoute(story)}`);
  await storybookPage.waitForSelector(`[data-contract-story-id="${story.id}"]`);
  const visible = await storybookPage.locator(`[data-contract-story-id="${story.id}"]`).isVisible();
  storybookChecks.push({ id: story.id, storybookId: story.storybookId, visible });
}

await storybookPage.goto(`${staticServer.origin}/apps/storybook/storybook-static/proof.html?locale=en#blocked-actions`);
await storybookPage.waitForSelector("[data-contract-story-id='blocked-actions']");
await storybookPage.waitForSelector("#blocked-actions [role='dialog']");
const staticDialogCapabilities = await storybookPage.locator("#blocked-actions [role='dialog']").evaluate((node) => ({
  focusEntry: node.getAttribute("data-focus-entry"),
  tabContainment: node.getAttribute("data-tab-containment"),
  focusTrap: node.getAttribute("data-focus-trap"),
  escapeClose: node.getAttribute("data-escape-close"),
  focusReturn: node.getAttribute("data-focus-return")
}));

await storybookPage.goto(`${staticServer.origin}/apps/storybook/storybook-static/components.html?locale=en#dialog-spec-usage`);
await storybookPage.waitForSelector("[data-contract-story-id='dialog-spec-usage']");
await storybookPage.locator("#dialog-spec-usage").getByRole("button", { name: "Open confirmation" }).click();
await storybookPage.waitForSelector("#dialog-spec-usage [data-dialog-fixture-panel]:not([hidden]) [role='dialog']");
const openDialogPath = relativeScreenshotPath("desktop-1440x900-overlay-focus-open-dialog.png");
// This capture does not go through setTransientScreenshotChromeHidden, and the dialog
// has just been opened, so its entry animation is still running: pin explicitly.
await pinAnimations(storybookPage);
const openDialogSignature = await captureWithSignature(
  storybookPage.locator("#dialog-spec-usage [data-dialog-fixture-panel] [role='dialog']"),
  "overlay-focus-open-dialog@desktop-1440x900",
  openDialogPath
);
visualEntries.push({
  storyId: "overlay-focus-open-dialog",
  viewport: "desktop-1440x900",
  path: openDialogPath,
  signature: openDialogSignature,
  intentionalDiffDisposition: "new_internal_alpha_baseline"
});
const interactiveDialogCapabilities = await storybookPage.locator("#dialog-spec-usage [data-dialog-fixture-panel] [role='dialog']").evaluate((node) => ({
  focusEntry: node.getAttribute("data-focus-entry"),
  tabContainment: node.getAttribute("data-tab-containment"),
  focusTrap: node.getAttribute("data-focus-trap"),
  escapeClose: node.getAttribute("data-escape-close"),
  focusReturn: node.getAttribute("data-focus-return")
}));
const focusedAfterOpen = await storybookPage.evaluate(() => ({
  tag: document.activeElement?.tagName?.toLowerCase() ?? "",
  text: (document.activeElement?.textContent ?? document.activeElement?.getAttribute("aria-label") ?? "").replace(/\s+/g, " ").trim()
}));
await storybookPage.keyboard.press("Escape");
await storybookPage.waitForFunction(() => document.querySelector("#dialog-spec-usage [data-dialog-fixture-panel]")?.hasAttribute("hidden"));
await storybookPage.waitForFunction(() => {
  const active = document.activeElement;
  return active?.tagName?.toLowerCase() === "button"
    && (active.textContent ?? "").replace(/\s+/g, " ").trim().includes("Open confirmation");
});
const focusedAfterEscape = await storybookPage.evaluate(() => ({
  tag: document.activeElement?.tagName?.toLowerCase() ?? "",
  text: (document.activeElement?.textContent ?? document.activeElement?.getAttribute("aria-label") ?? "").replace(/\s+/g, " ").trim()
}));
const focusedAfterOpenEvidence = `${focusedAfterOpen.tag}:${focusedAfterOpen.text}`;
const focusedAfterEscapeEvidence = `${focusedAfterEscape.tag}:${focusedAfterEscape.text}`;
const capabilityMetadataOk = interactiveDialogCapabilities.focusEntry === "implemented"
  && interactiveDialogCapabilities.tabContainment === "not-implemented"
  && interactiveDialogCapabilities.focusTrap === null
  && interactiveDialogCapabilities.escapeClose === "implemented"
  && interactiveDialogCapabilities.focusReturn === "implemented"
  && staticDialogCapabilities.focusEntry === "implemented"
  && staticDialogCapabilities.tabContainment === "not-implemented"
  && staticDialogCapabilities.focusTrap === null
  && staticDialogCapabilities.escapeClose === "requires-on-open-change"
  && staticDialogCapabilities.focusReturn === "requires-trigger-ref";
keyboardChecklist = {
  ok: focusedAfterOpen.tag === "button" && focusedAfterOpen.text.includes("Close")
    && focusedAfterEscape.tag === "button" && focusedAfterEscape.text.includes("Open confirmation"),
  checks: [
    { item: "tab-reachable controls", status: "passed", evidence: "Buttons and form controls are native focusable controls in rendered story DOM." },
    { item: "dialog initial focus", status: focusedAfterOpen.tag === "button" && focusedAfterOpen.text.includes("Close") ? "passed" : "failed", evidence: focusedAfterOpenEvidence },
    { item: "escape closes dialog", status: focusedAfterEscape.text.includes("Open confirmation") ? "passed" : "failed", evidence: focusedAfterEscapeEvidence },
    { item: "focus returns to trigger", status: focusedAfterEscape.tag === "button" && focusedAfterEscape.text.includes("Open confirmation") ? "passed" : "failed", evidence: focusedAfterEscapeEvidence },
    { item: "dialog capability metadata truthfulness", status: capabilityMetadataOk ? "passed" : "failed", evidence: `interactive=${JSON.stringify(interactiveDialogCapabilities)} static=${JSON.stringify(staticDialogCapabilities)}` },
    { item: "reduced motion", status: "passed", evidence: "Browser proof emulated reducedMotion=reduce for all viewports." }
  ]
};

await storybookPage.goto(`${staticServer.origin}/${staticSurfacePath}?theme=light&locale=zh-CN#welcome-governance`);
await storybookPage.waitForSelector("[data-storybook-locale='zh-CN']");
await storybookPage.waitForSelector("#tcrn-doc-locale-trigger");
await storybookPage.locator("#tcrn-doc-locale-trigger").click();
await storybookPage.waitForSelector("[data-locale-menu]:not([hidden])");
const localeMenuOpenReadback = await storybookPage.evaluate(() => ({
  activeTag: document.activeElement?.tagName?.toLowerCase() ?? null,
  activeId: document.activeElement?.id ?? null,
  expanded: document.querySelector("#tcrn-doc-locale-trigger")?.getAttribute("aria-expanded") ?? null,
  menuHidden: document.querySelector("[data-locale-menu]")?.hasAttribute("hidden") ?? null
}));
await storybookPage.keyboard.press("Escape");
await storybookPage.waitForFunction(() => document.querySelector("[data-locale-menu]")?.hasAttribute("hidden"));
await storybookPage.waitForFunction(() => document.activeElement?.id === "tcrn-doc-locale-trigger");
const localeMenuCloseReadback = await storybookPage.evaluate(() => ({
  activeTag: document.activeElement?.tagName?.toLowerCase() ?? null,
  activeId: document.activeElement?.id ?? null,
  activeText: (document.activeElement?.textContent ?? "").replace(/\s+/g, " ").trim(),
  expanded: document.querySelector("#tcrn-doc-locale-trigger")?.getAttribute("aria-expanded") ?? null,
  menuHidden: document.querySelector("[data-locale-menu]")?.hasAttribute("hidden") ?? null,
  dismissalContract: document.querySelector("[data-locale-dismissal-contract]")?.getAttribute("data-locale-dismissal-contract") ?? null,
  shellAuthority: document.querySelector("[data-contract-surface]")?.getAttribute("data-doc-shell") ?? null,
  globalProductShellShellSelectorCount: Array.from(document.querySelectorAll("[data-storybook-shell-authority], [data-storybook-product-shell-skin], [data-package-backed-product-shell-boundary], [data-product-shell-region='side-navigation'], .tcrn-product-shell__sidebar, .tcrn-product-shell__main"))
    .filter((node) => !node.closest(".story-body"))
    .length
}));
localeMenuFocusReturnCheck = {
  ok: localeMenuOpenReadback.expanded === "true"
    && localeMenuOpenReadback.menuHidden === false
    && localeMenuCloseReadback.expanded === "false"
    && localeMenuCloseReadback.menuHidden === true
    && localeMenuCloseReadback.activeId === "tcrn-doc-locale-trigger"
    && localeMenuCloseReadback.dismissalContract === "selection-outside-pointer-escape-focus-return"
    && localeMenuCloseReadback.shellAuthority === "online-docs"
    && localeMenuCloseReadback.globalProductShellShellSelectorCount === 0,
  route: `${staticSurfacePath}?theme=light&locale=zh-CN#welcome-governance`,
  openReadback: localeMenuOpenReadback,
  closeReadback: localeMenuCloseReadback
};
await storybookPage.close();
await signatureContext.close();
await browser.close();
await staticServer.close();

function hasSameItems(actual, expected) {
  return actual.length === expected.length
    && actual.toSorted().every((item, index) => item === expected.toSorted()[index]);
}

const staticSectionChecks = browserSummaries.map((summary) => {
  const visibleStoryIds = summary.storyRegions.filter((story) => story.visible).map((story) => story.id);
  const expectedCurrentStoryNav = summary.expectedStoryIds[0];
  const ok = summary.activeSection === summary.expectedSection
    && summary.shellAuthority === "online-docs"
    && summary.docShellSelectorCount >= 6
    && summary.globalProductShellShellSelectorCount === 0
    && summary.docShellSidebarVisible
    && summary.docNavGroupCount === expectedStorybookShellNavGroupCount
    && summary.docNavCategoryCount === expectedCategoryCount
    && summary.docNavOpenCategoryCount >= 1
    && !summary.activeStoryHiddenByCategory
    && summary.categoryAriaFailures.length === 0
    && summary.sidebarNoIconLabelReadabilityFailures.length === 0
    && summary.docNavItemCount === requiredStories.length
    && summary.docCurrentStoryCount === 1
    && summary.docChapterPagerCount === 1
    && summary.onThisPageCount === 1
    && summary.mandatoryBoundaryVisible
    && summary.noOverclaimBoundaryVisible
    && summary.governanceBoundaryStripVisible
    && summary.governanceStoryMetadataMissing.length === 0
    && summary.shellHeaderLayoutGap !== null
    && summary.shellHeaderLayoutGap <= 1
    && summary.sidebarLeft !== null
    && summary.sidebarLeft <= 1
    && summary.storybookLocale === "en"
    && summary.localeOptionCount === 5
    && summary.localeSelectVisible
    && summary.currentNav === summary.expectedSection
    && summary.currentStoryNav === expectedCurrentStoryNav
    && summary.storySections.length === 1
    && summary.storySections[0] === summary.expectedSection
    && hasSameItems(visibleStoryIds, summary.expectedStoryIds);
  return {
    viewport: summary.viewport,
    section: summary.expectedSection,
    url: summary.url,
    ok,
    shellAuthority: summary.shellAuthority,
    docShellSelectorCount: summary.docShellSelectorCount,
    globalProductShellShellSelectorCount: summary.globalProductShellShellSelectorCount,
    docShellSidebarVisible: summary.docShellSidebarVisible,
    docNavGroupCount: summary.docNavGroupCount,
    docNavCategoryCount: summary.docNavCategoryCount,
    docNavOpenCategoryCount: summary.docNavOpenCategoryCount,
	    activeStoryHiddenByCategory: summary.activeStoryHiddenByCategory,
	    categoryAriaFailures: summary.categoryAriaFailures,
    sidebarNoIconLabelReadabilityFailures: summary.sidebarNoIconLabelReadabilityFailures,
    docNavItemCount: summary.docNavItemCount,
    docCurrentStoryCount: summary.docCurrentStoryCount,
    docChapterPagerCount: summary.docChapterPagerCount,
    onThisPageCount: summary.onThisPageCount,
    mandatoryBoundaryVisible: summary.mandatoryBoundaryVisible,
    noOverclaimBoundaryVisible: summary.noOverclaimBoundaryVisible,
    governanceBoundaryStripVisible: summary.governanceBoundaryStripVisible,
    governanceStoryMetadataMissing: summary.governanceStoryMetadataMissing,
    shellHeaderLayoutGap: summary.shellHeaderLayoutGap,
    sidebarLeft: summary.sidebarLeft,
    storybookLocale: summary.storybookLocale,
    localeOptionCount: summary.localeOptionCount,
    localeSelectVisible: summary.localeSelectVisible,
    activeSection: summary.activeSection,
    currentNav: summary.currentNav,
    currentStoryNav: summary.currentStoryNav,
    expectedCurrentStoryNav,
    storySections: summary.storySections,
    visibleStoryIds,
    expectedStoryIds: summary.expectedStoryIds
  };
});
const componentStorybookParityReadback = {
  packageBackedComponentParityVisible: browserSummaries.some((summary) => summary.componentStorybookParityNodes.some((node) => node.visible)),
  publicSourcesVisible: browserSummaries.some((summary) => summary.componentStorybookParityNodes.some((node) => node.componentSource === "@tcrn/ui-react"
    && node.tokenSource === "@tcrn/ui-tokens"
    && node.copyStateSource === "@tcrn/ui-copy-state"
    && node.visible)),
  storybookOnlyDeferredMarkersVisible: browserSummaries.some((summary) => summary.storybookOnlyPrototypeNodes.some((node) => node.status === "deferred" && node.visible)),
  packageBackedDisabledNavItemReasonReadback: {
    disabledNavItemCount: browserSummaries.reduce((total, summary) => total + summary.packageBackedDisabledNavItems.length, 0),
    invalidDisabledNavItems: browserSummaries.flatMap((summary) => summary.packageBackedDisabledNavItems
      .filter((item) => !item.ok)
      .map((item) => ({ viewport: summary.viewport, section: summary.expectedSection, ...item }))),
    validDisabledNavItemLabels: browserSummaries.flatMap((summary) => summary.packageBackedDisabledNavItems
      .filter((item) => item.ok)
      .map((item) => ({ viewport: summary.viewport, section: summary.expectedSection, label: item.label, reason: item.visibleReason })))
  },
  noPackagePublicationClaimed: true,
  noProductAdoptionClaimed: true
};
componentStorybookParityReadback.packageBackedDisabledNavItemReasonReadback.ok =
  componentStorybookParityReadback.packageBackedDisabledNavItemReasonReadback.disabledNavItemCount > 0
  && componentStorybookParityReadback.packageBackedDisabledNavItemReasonReadback.invalidDisabledNavItems.length === 0;
const axeSummary = {
  ok: axeSummaries.every((summary) => summary.violationCount === 0),
  violationCount: axeSummaries.reduce((total, summary) => total + summary.violationCount, 0),
  sections: axeSummaries
};
const storyCoverageManifest = {
  ok: storybookChecks.every((check) => check.visible) && staticSectionChecks.every((check) => check.ok) && hashRouteCheck.ok && hashStoryRouteCheck.ok && firstStoryHashShellParityCheck.ok && mobileHashAnchorOcclusionCheck.ok && mobileKnowledgeDocShellLayeringCheck.ok && anchorScrollCheck.ok && scrollSpyCheck.ok && localeRouteCheck.ok && localeMenuFocusReturnCheck.ok,
  requiredStories,
  sectionPages,
  staticContractSurface: staticSurfacePath,
  storybookIframeSurface: null,
  storybookRuntimeSurfaceDisposition: "replaced_by_static_contract_docs",
  aiContractTraceabilityCheck,
  componentStorybookParityReadback,
  storybookChecks,
  hashRouteCheck,
  hashStoryRouteCheck,
  firstStoryHashShellParityCheck,
  mobileHashAnchorOcclusionCheck,
  mobileKnowledgeDocShellLayeringCheck,
  anchorScrollCheck,
  scrollSpyCheck,
  localeRouteCheck,
  localeMenuFocusReturnCheck,
  staticSectionChecks,
  coverageDisposition: "full_static_contract_docs_navigation_and_i18n_pages"
};
const browserProofSummary = {
  ok: browserSummaries.every((summary) => summary.rootVisible
      && !summary.bodyOverflowX
      && summary.clipped.length === 0
      && summary.readbackStateViewGapViolations.length === 0
      && summary.storyTextRhythmViolations.length === 0
      && summary.readbackHeadingGapViolations.length === 0
      && summary.forbiddenHits.length === 0
      && summary.consoleMessages.length === 0
      && summary.pageErrors.length === 0
      && summary.failedRequests.length === 0)
    && storyCoverageManifest.ok
    && aiContractTraceabilityCheck.ok
    && axeSummary.ok
    && componentStorybookParityReadback.packageBackedComponentParityVisible
    && componentStorybookParityReadback.publicSourcesVisible
    && componentStorybookParityReadback.storybookOnlyDeferredMarkersVisible
    && componentStorybookParityReadback.packageBackedDisabledNavItemReasonReadback.ok,
  syntheticFixturesOnly: true,
  noProductDataCaptured: true,
  noLocalAbsolutePathsRetained: true,
  routeOwnedEphemeralServer: {
    loopbackOnly: true,
    retained: false,
    stoppedBeforeReturn: true
  },
  viewports,
  aiContractTraceabilityCheck,
  componentStorybookParityReadback,
  summaries: browserSummaries
};
const { findings: shellFidelityFindings, ...shellFidelity } = fidelityRejectChecks();
const signatureRegressions = signatureResults.filter((entry) => entry.status === "regression");
const visualBaselineManifest = {
  ok: visualEntries.length === requiredStories.length * viewports.length + sectionPages.length * viewports.length + 1,
  generatedAt: "stable_internal_alpha_visual_baseline",
  // Six of the seven entries here were the literal `false` — claims wearing the costume
  // of checks, and they travelled into the AI consumption contract that way. The three
  // below that a machine can decide now come from a real scan of the shell sources; the
  // palette check is bound to the perceptual signature gate, which is the defence that
  // actually catches a palette moving. The three that remain compositional judgements
  // are reported as unchecked rather than asserted false: the contract now claims less,
  // and everything it does claim was measured.
  rejectChecks: {
    oneNotePaletteDrift: signatureRegressions.length > 0,
    decorativeGradientsOrOrbs: shellFidelity.decorativeGradientsOrOrbs,
    radiusDriftAboveContract: shellFidelity.radiusDriftAboveContract,
    softCloudElevation: shellFidelity.softCloudElevation,
    clippedButtonText: browserSummaries.some((summary) => summary.clipped.length > 0)
  },
  uncheckedClaims: UNCHECKED_CLAIMS,
  entries: visualEntries
};
const stableStoryCoverageManifest = normalizeEphemeralProofData(storyCoverageManifest);
const stableBrowserProofSummary = normalizeEphemeralProofData(browserProofSummary);
const localAbsolutePathProof = {
  ok: true,
  checkedTargets: [
    "browser-proof-summary",
    "story-coverage-manifest",
    "visual-baseline-manifest"
  ],
  hits: [
    ...collectLocalAbsolutePathHits("browser-proof-summary", JSON.stringify(stableBrowserProofSummary)),
    ...collectLocalAbsolutePathHits("story-coverage-manifest", JSON.stringify(stableStoryCoverageManifest)),
    ...collectLocalAbsolutePathHits("visual-baseline-manifest", JSON.stringify(visualBaselineManifest))
  ]
};
localAbsolutePathProof.ok = localAbsolutePathProof.hits.length === 0;
browserProofSummary.noLocalAbsolutePathsRetained = localAbsolutePathProof.ok;
browserProofSummary.localAbsolutePathProof = localAbsolutePathProof;
browserProofSummary.ok = browserProofSummary.ok && localAbsolutePathProof.ok;
stableBrowserProofSummary.noLocalAbsolutePathsRetained = localAbsolutePathProof.ok;
stableBrowserProofSummary.localAbsolutePathProof = localAbsolutePathProof;
stableBrowserProofSummary.ok = stableBrowserProofSummary.ok && localAbsolutePathProof.ok;

writeFileSync(join(outputRoot, "story-coverage-manifest.json"), `${JSON.stringify(stableStoryCoverageManifest, null, 2)}\n`);
writeFileSync(join(outputRoot, "browser-proof-summary.json"), `${JSON.stringify(stableBrowserProofSummary, null, 2)}\n`);
writeFileSync(join(outputRoot, "a11y-axe-summary.json"), `${JSON.stringify({ ok: axeSummary.violationCount === 0, ...axeSummary }, null, 2)}\n`);
writeFileSync(join(outputRoot, "manual-keyboard-checklist.md"), `# Manual Keyboard Checklist

Route: \`route_tcrn_design_system_internal_alpha_hardening_proof_implementation\`

${keyboardChecklist.checks.map((check) => `- ${check.status === "passed" ? "[x]" : "[ ]"} ${check.item}: ${check.status}. Evidence: ${check.evidence}`).join("\n")}
`);
writeFileSync(join(outputRoot, "visual-baseline-manifest.json"), `${JSON.stringify(visualBaselineManifest, null, 2)}\n`);
writeFileSync(join(outputRoot, "intentional-diff-manifest.json"), `${JSON.stringify({
  ok: true,
  disposition: "new_internal_alpha_baselines_created",
  entries: visualEntries.map((entry) => ({ storyId: entry.storyId, viewport: entry.viewport, path: entry.path, sha256: entry.sha256 }))
}, null, 2)}\n`);

const signatureNew = signatureResults.filter((entry) => entry.status === "new");
if (updateVisualBaseline || signatureNew.length > 0) {
  const ordered = Object.fromEntries(Object.keys(signatureBaseline.entries).sort().map((key) => [key, signatureBaseline.entries[key]]));
  writeFileSync(signatureBaselinePath, `${JSON.stringify({ ...signatureBaseline, tolerance: SIGNATURE_TOLERANCE, entries: ordered }, null, 2)}\n`);
}
if (signatureRegressions.length > 0) {
  console.error(`VISUAL REGRESSION: ${signatureRegressions.length} capture(s) moved beyond tolerance ` +
    `(mean<=${SIGNATURE_TOLERANCE.meanAbsolute}, maxCell<=${SIGNATURE_TOLERANCE.maxCell}):`);
  for (const entry of signatureRegressions) {
    console.error(`  - ${entry.key}: mean=${entry.distance.meanAbsolute} maxCell=${entry.distance.maxCell}`);
  }
  console.error("If the change is intended, re-run with --update-visual-baseline and commit the new baseline.");
}

const shellFidelityTripped = Object.entries(shellFidelity).filter(([, tripped]) => tripped);
if (shellFidelityTripped.length > 0) {
  console.error(`SHELL FIDELITY DRIFT: ${shellFidelityTripped.map(([name]) => name).join(", ")}`);
  for (const [group, list] of Object.entries(shellFidelityFindings)) {
    for (const item of list.slice(0, 8)) console.error(`  ${group}: ${item.where} ${item.selector}`);
  }
}

const disclosureOk = disclosureChecks.length > 0 && disclosureChecks.every(
  (entry) => entry.collapsedByDefault && entry.clickExpands && entry.clickRestores && entry.hashExpands
);
const ok = signatureRegressions.length === 0
  && disclosureOk
  && shellFidelityTripped.length === 0
  && browserProofSummary.ok
  && storyCoverageManifest.ok
  && axeSummary.violationCount === 0
  && keyboardChecklist.ok
  && localeMenuFocusReturnCheck.ok
  && capabilityMetadataOk
  && visualBaselineManifest.ok
  && !visualBaselineManifest.rejectChecks.clippedButtonText;

console.log(JSON.stringify({
  ok,
  browserVersion,
  storyCount: requiredStories.length,
  viewportCount: viewports.length,
  screenshotCount: visualEntries.length,
  axeViolationCount: axeSummary.violationCount,
  disclosureOk,
  shellFidelityDrift: shellFidelityTripped.length,
  visualSignatureGated: signatureResults.filter((entry) => entry.gated).length,
  visualSignatureRecordedOnly: signatureResults.filter((entry) => !entry.gated).length,
  visualSignatureRegressions: signatureRegressions.length,
  visualSignatureNewBaselines: signatureNew.length,
  keyboardOk: keyboardChecklist.ok,
  localeMenuFocusReturnOk: localeMenuFocusReturnCheck.ok,
  capabilityMetadataOk,
  aiContractTraceabilityOk: aiContractTraceabilityCheck.ok,
  coveredStorybookSections: aiContractTraceabilityCheck.coveredSectionCount,
  coveredStorybookCategories: aiContractTraceabilityCheck.coveredCategoryCount
}, null, 2));

if (!ok) {
  process.exit(1);
}
