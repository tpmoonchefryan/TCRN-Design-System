import { readFileSync } from "node:fs";

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
const required = [
  "data-doc-shell=\"online-docs\"",
  "data-doc-nav=\"sections\"",
  "data-doc-chapter-pager=\"true\"",
  "data-anchor-scroll-controlled=\"true\"",
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
  "data-locale-menu-toggle",
  "data-locale-current-code",
  "data-locale-menu-option",
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
  "Light and dark Storybook shell",
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
const missing = required.filter((text) => !combinedHtml.includes(text));
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
const ok = missing.length === 0 && forbiddenPositiveHits.length === 0 && storybookPreviewExists;
console.log(JSON.stringify({ ok, missing, forbiddenPositiveHits, storybookPreviewExists, pages: pagesByGroup }, null, 2));
if (!ok) {
  process.exit(1);
}
