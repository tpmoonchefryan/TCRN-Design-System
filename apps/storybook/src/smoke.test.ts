import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { tcrnSupportedLocales } from "@tcrn/ui-copy-state";
import { createTokenMap, tcrnDarkThemeTokens, tcrnTokens } from "@tcrn/ui-tokens";
import alphaMeta from "./alpha.stories.js";
import {
  i18nText,
  localeText,
  storybookContentText,
  storybookLocaleText
} from "./build/i18n.js";
import {
  storybookContentText as extractedStorybookContentText,
  storybookLocaleText as extractedStorybookLocaleText
} from "./build/locales/index.js";
import changeLogMeta from "./change-log.stories.js";
import componentsMeta from "./components.stories.js";
import foundationsMeta from "./foundations.stories.js";
import patternsMeta from "./patterns.stories.js";
import proofMeta from "./proof.stories.js";
import styleGuideMeta from "./style-guide.stories.js";
import { storybookGovernanceChangelogRecords, storyCategoryDefinitions } from "./contract-stories/governance.js";
import {
  consumerVisualStyleContract,
  foundationVisualStandardCategoryIds,
  foundationVisualStandards,
  storybookDocShellVisualOracle
} from "./build/foundation-visual-standards.js";
import { contractStories, contractStoriesByGroup, contractStoryGroups } from "./stories.js";
import type { ContractStoryGroup } from "./stories.js";

const expectedContractStoryGroups: readonly ContractStoryGroup[] = [
  "Welcome",
  "Style Guide",
  "Foundations",
  "Components",
  "Patterns",
  "Proof",
  "Change Log"
];

const expectedAiReadbackFields = [
  "contractVersion",
  "contractPayloadDigest",
  "artifact",
  "route",
  "readAt",
  "coveredRules",
  "coveredStorybookSections",
  "foundationVisualStandards",
  "consumerVisualStyleContract",
  "requiredProof",
  "noOverclaimBoundaries"
];

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

const expectedContractStoryIds = [
  "welcome-governance",
  "governance-boundaries",
  "maintainers-routing",
  "contribution-model",
  "release-bug-policy",
  "brand-identity",
  "color-palette",
  "text-styles",
  "grid-system",
  "icons-motion",
  "global-states",
  "copy-creation-rules",
  "tokens-copy-state",
  "i18n-theme-contract",
  "foundation-visual-standards",
  "copy-guidelines",
  "component-family-index",
  "display-primitives-spec",
  "interaction-disclosure-spec",
  "stamp-spec-usage",
  "button-spec-usage",
  "field-spec-usage",
  "navigation-shell-spec",
  "aos-frontend-shell-slice",
  "aos-owner-quality-product-shell",
  "dialog-spec-usage",
  "table-work-index-spec",
  "work-management-components-spec",
  "knowledge-management-components-spec",
  "forms-patterns",
  "workbench-patterns",
  "work-management-patterns",
  "readiness-notification-patterns",
  "selection-list-patterns",
  "modal-validation-patterns",
  "datagrid-fields-patterns",
  "big-list-search-patterns",
  "dashboard-page-templates",
  "proof-matrix",
  "ai-consumption-contract",
  "blocked-actions",
  "overlay-focus",
  "local-changelog"
];

const expectedAiRequiredBeforeProductFrontendImplementation = [
  "read_ai_consumption_contract",
  "read_every_required_storybook_section",
  "read_foundation_visual_standards",
  "consume_consumer_visual_style_contract",
  "prove_same_storybook_visual_instance_not_only_package_import",
  "use_tcrn_i18n_and_copy_state",
  "use_registered_product_logo_asset_or_route_logo_admission",
  "use_registered_product_logo_components_for_product_identity",
  "reject_unregistered_or_deprecated_brand_assets",
  "import_package_backed_ds_primitives",
  "use_design_tokens_and_accessibility_rules",
  "verify_light_and_dark_storybook_theme_contract",
  "verify_motion_effect_parity_and_reduced_motion",
  "preserve_compact_storybook_shell_controls",
  "prove_product_shell_visual_oracle_skin",
  "use_product_shell_semantic_control_api",
  "prove_locale_popup_dismissal_and_focus_return",
  "prove_side_navigation_collapse_state",
  "use_work_management_patterns_for_static_work_surfaces",
  "use_knowledge_management_patterns_for_static_knowledge_surfaces",
  "block_unregistered_modules_from_primary_navigation",
  "prove_browser_interactions_not_static_markers",
  "prove_product_adoption_before_ds_compliance_claim"
];

const expectedAiRequiredProof = [
  "contract_story_readback",
  "i18n_copy_state_receipt",
  "brand_surface_receipt",
  "forbidden_brand_asset_absence_receipt",
  "package_import_receipt",
  "storybook_doc_shell_package_boundary_receipt",
  "foundation_visual_standards_registry_receipt",
  "consumer_visual_style_contract_receipt",
  "theme_mode_receipt",
  "storybook_shell_control_receipt",
  "storybook_doc_shell_visual_oracle_receipt",
  "locale_popup_dismissal_receipt",
  "side_navigation_collapse_receipt",
  "work_management_static_pattern_receipt",
  "knowledge_management_static_pattern_receipt",
  "registered_navigation_receipt",
  "browser_interaction_receipt",
  "storybook_section_coverage_receipt",
  "visual_equivalence_receipt",
  "motion_effect_receipt",
  "product_adoption_route_receipt"
];

const expectedRootAdapterTitles = [
  "TCRN Design System/Welcome",
  "TCRN Design System/Style Guide",
  "TCRN Design System/Foundations",
  "TCRN Design System/Components",
  "TCRN Design System/Patterns",
  "TCRN Design System/Proof",
  "TCRN Design System/Change Log"
];

const expectedStoryCategoryCount = Object.values(storyCategoryDefinitions).reduce((count, categories) => count + categories.length, 0);
const expectedStorybookShellNavGroupCount = expectedContractStoryGroups.length;

function groupSlug(group: ContractStoryGroup): string {
  return group.toLowerCase().replace(/\s+/g, "-");
}

function groupFileName(group: ContractStoryGroup): string {
  return group === "Welcome" ? "index.html" : `${groupSlug(group)}.html`;
}

function readGroupPage(group: ContractStoryGroup): string {
  return readFileSync(join(process.cwd(), "storybook-static", groupFileName(group)), "utf8");
}

function readStorybookSource(path: string): string {
  return readFileSync(join(process.cwd(), path), "utf8");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const localAbsolutePathPattern = /(?:file:\/\/|\/Users\/|\/tmp(?:\/|$)|\/private\/tmp(?:\/|$)|\/var\/folders(?:\/|$)|\/srv\/tcrn(?:\/|$))/i;

function assertNoLocalAbsolutePathText(label: string, value: string): void {
  assert.doesNotMatch(value, localAbsolutePathPattern, `${label} must not retain local absolute paths`);
}

function readDocShellNavHtml(html: string): string {
  const start = html.indexOf('class="tcrn-doc-nav"');
  const asideStart = html.lastIndexOf("<aside", start);
  const end = html.indexOf("</nav>", start);
  assert.ok(start > -1, "missing doc shell nav start");
  assert.ok(asideStart > -1, "missing doc shell nav aside start");
  assert.ok(end > start, "missing doc shell nav end");
  return html.slice(asideStart, end + "</nav>".length);
}

function readDocShellCategoryIds(html: string): string[] {
  return Array.from(readDocShellNavHtml(html).matchAll(/data-doc-nav-category="([^"]+)"/g), (match) => match[1]);
}

function readDocShellNavItemIds(html: string): string[] {
  return Array.from(readDocShellNavHtml(html).matchAll(/data-doc-nav-item="([^"]+)"/g), (match) => match[1]);
}

function readDocShellActiveStoryIds(html: string): string[] {
  return Array.from(readDocShellNavHtml(html).matchAll(/data-doc-nav-item="([^"]+)"[^>]*data-doc-nav-item-active="true"/g), (match) => match[1]);
}

function readDocShellActiveSectionCount(html: string): number {
  return readDocShellNavHtml(html).match(/data-story-nav="[^"]+"[^>]*aria-current="page"/g)?.length ?? 0;
}

function readStoryHtml(html: string, storyId: string): string {
  const storyMarker = `data-contract-story-id="${storyId}"`;
  const markerStart = html.indexOf(storyMarker);
  assert.ok(markerStart > -1, `missing story ${storyId}`);
  const articleStart = html.lastIndexOf("<article", markerStart);
  const articleEnd = html.indexOf("</article>", markerStart);
  assert.ok(articleStart > -1 && articleEnd > articleStart, `missing story article ${storyId}`);
  return html.slice(articleStart, articleEnd + "</article>".length);
}

function readInternalLabSource(): string {
  const internalLabDir = join(process.cwd(), "src", "internal-dev", "overlay-family-lab");
  return readdirSync(internalLabDir)
    .filter((fileName) => fileName.endsWith(".ts") || fileName.endsWith(".tsx"))
    .map((fileName) => readFileSync(join(internalLabDir, fileName), "utf8"))
    .join("\n");
}

test("static contract story surface is retained and synthetic", () => {
  const pages = contractStoryGroups.map((group) => ({ group, html: readGroupPage(group) }));
  const combinedHtml = pages.map((page) => page.html).join("\n");
  assert.deepEqual(contractStoryGroups, expectedContractStoryGroups);
  assert.equal(contractStories.length, expectedContractStoryIds.length);
  assert.deepEqual(contractStories.map((story) => story.id), expectedContractStoryIds);
  for (const story of contractStories) {
    assert.ok(story.category.length > 0, `missing category label for ${story.id}`);
    assert.ok(story.categoryId.length > 0, `missing category id for ${story.id}`);
    assert.equal(story.sourcePath, "apps/storybook/src/contract-stories/story-content.tsx");
    assert.match(story.packageAuthority, /Storybook static|@tcrn\/ui-react|Durable Storybook/);
    assert.equal(story.readiness, "local_storybook_contract_review_required");
    assert.equal(story.proofPosture, "visible_boundary_no_product_adoption_or_publication_claim");
  }
  assert.deepEqual(
    [alphaMeta, styleGuideMeta, foundationsMeta, componentsMeta, patternsMeta, proofMeta, changeLogMeta].map((meta) => meta.title),
    expectedRootAdapterTitles
  );
  // Per-story CSF registration gate: every contract story in the registry must have a
  // matching CSF export in its group's *.stories.tsx adapter, in registry order. This closes
  // the gap where only the 7 default-meta titles were gated. internal-dev/overlay-family-lab is
  // intentionally NOT a contract story group, so iterating the registry groups self-excludes it
  // (see the overlay-family-lab exclusions below at data-internal-dev-surface / Internal/Overlay).
  const csfAdapterFileByGroup: Record<ContractStoryGroup, string> = {
    Welcome: "src/alpha.stories.tsx", // NOTE: alpha.stories.tsx IS the Welcome adapter
    "Style Guide": "src/style-guide.stories.tsx",
    Foundations: "src/foundations.stories.tsx",
    Components: "src/components.stories.tsx",
    Patterns: "src/patterns.stories.tsx",
    Proof: "src/proof.stories.tsx",
    "Change Log": "src/change-log.stories.tsx"
  };
  for (const group of expectedContractStoryGroups) {
    const adapterFile = csfAdapterFileByGroup[group];
    const adapterSource = readStorybookSource(adapterFile);
    const registeredIds = Array.from(
      adapterSource.matchAll(/renderContractStory\("([^"]+)"\)/g),
      (match) => match[1]
    );
    assert.deepEqual(
      registeredIds,
      contractStoriesByGroup(group).map((story) => story.id),
      `CSF adapter ${adapterFile} must register every contract story for ${group} in registry order`
    );
  }
  assert.deepEqual(pages.map((page) => groupFileName(page.group)), [
    "index.html",
    "style-guide.html",
    "foundations.html",
    "components.html",
    "patterns.html",
    "proof.html",
    "change-log.html"
  ]);
  assert.equal(contractStories.some((story) => story.id.includes("overlay-family-lab")), false);
  assert.equal(contractStoryGroups.some((group) => group.includes("Internal")), false);
  assert.equal(storybookLocaleText, extractedStorybookLocaleText);
  assert.equal(storybookContentText, extractedStorybookContentText);
  assert.equal(localeText("shell.title"), "TCRN Design System Contract Stories");
  assert.equal(localeText("shell.title", "zh-CN"), "TCRN 设计系统契约故事");
  assert.equal(localeText("missing.storybook.copy.key"), "missing.storybook.copy.key");
  assert.equal(storybookContentText["Design System"].en, "Design System");
  assert.equal(storybookContentText["Design System"]["zh-CN"], "设计系统");
  assert.match(i18nText("shell.title"), /data-i18n="shell.title"/);
  for (const story of contractStories) {
    for (const suffix of ["title", "description"] as const) {
      const key = `story.${story.id}.${suffix}`;
      for (const locale of tcrnSupportedLocales) {
        assert.notEqual(localeText(key, locale), key, `missing Storybook locale text for ${locale}:${key}`);
      }
    }
  }
  assert.doesNotMatch(combinedHtml, /data-internal-dev-surface="overlay-family-lab"/);
  assert.doesNotMatch(combinedHtml, /data-contract-docs="excluded"/);
  assert.doesNotMatch(combinedHtml, /Internal\/Overlay family lab/);
  assert.doesNotMatch(combinedHtml, />story\.[^<]+</);
  assert.doesNotMatch(combinedHtml, /data-storybook-contract-truth="not-authoritative"/);
  assert.match(combinedHtml, /data-doc-shell="online-docs"/);
  assert.match(combinedHtml, /class="[^"]*tcrn-doc-global-bar/);
  assert.match(combinedHtml, /class="[^"]*tcrn-doc-header(?:\b|__|-search)/);
  assert.match(combinedHtml, /class="[^"]*tcrn-doc-nav(?:\b|__)/);
  assert.match(combinedHtml, /class="[^"]*tcrn-doc-sidebar/);
  assert.match(combinedHtml, /data-doc-nav-item="/);
  assert.match(combinedHtml, /data-doc-nav-category-toggle="/);
  assert.match(combinedHtml, /data-doc-nav-item-active="true"/);
  assert.doesNotMatch(combinedHtml, /data-storybook-shell-authority="@tcrn\/ui-react\/ProductShell"/);
  assert.doesNotMatch(combinedHtml, /data-storybook-product-shell-skin="confirmed-storybook-visual-v1"/);
  assert.doesNotMatch(combinedHtml, /Atlassian|Jira|jira-like|issue-style|WorkIssueRow|IssueRow|Kanban|Scrum/i);
  assertNoLocalAbsolutePathText("generated static Storybook HTML", combinedHtml);
  assertNoLocalAbsolutePathText("Work Management story source", readStorybookSource("src/contract-stories/story-content.tsx"));
  assertNoLocalAbsolutePathText("Work Management package test fixture", readStorybookSource("../../packages/ui-react/src/components/DataDisplay/DataDisplay.test.tsx"));
  for (const receiptPath of [
    "docs/verification/storybook-visual-proof/baseline-manifest.json",
    "docs/verification/storybook-visual-proof/check-receipt.json",
    "docs/verification/storybook-visual-proof/update-receipt.json",
    "docs/verification/internal-alpha/browser-proof-summary.json",
    "docs/verification/internal-alpha/story-coverage-manifest.json",
    "docs/verification/internal-alpha/visual-baseline-manifest.json",
    "docs/verification/internal-alpha/package-contract-manifest.json"
  ]) {
    assertNoLocalAbsolutePathText(`proof receipt ${receiptPath}`, readFileSync(join(process.cwd(), "..", "..", receiptPath), "utf8"));
  }
  for (const { group, html } of pages.filter((page) => page.group !== "Components")) {
    assert.doesNotMatch(html, /data-package-backed-product-shell-boundary="side-nav-shell-v1"/, `unexpected ProductShell boundary outside component examples: ${group}`);
    assert.doesNotMatch(html, /data-product-shell-region="side-navigation"/, `unexpected ProductShell side nav outside component examples: ${group}`);
    assert.doesNotMatch(html, /class="[^"]*tcrn-product-shell__sidebar/, `unexpected ProductShell sidebar outside component examples: ${group}`);
    assert.doesNotMatch(html, /class="[^"]*tcrn-product-shell__main/, `unexpected ProductShell main outside component examples: ${group}`);
    assert.doesNotMatch(html, /data-product-shell-route="/, `unexpected ProductShell route outside component examples: ${group}`);
    assert.doesNotMatch(html, /data-shell-control="product-shell-search"/, `unexpected ProductShell search outside component examples: ${group}`);
    assert.doesNotMatch(html, /class="[^"]*tcrn-product-shell-search__results/, `unexpected ProductShell search results outside component examples: ${group}`);
  }
  assert.match(combinedHtml, /data-shell-control="theme-toggle"/);
  assert.match(combinedHtml, /data-shell-control="locale-menu"/);
  assert.match(combinedHtml, /data-shell-control="side-nav-collapse"/);
  assert.match(combinedHtml, /--tcrn-doc-shell/);
  assert.match(combinedHtml, /--tcrn-doc-header/);
  assert.match(combinedHtml, /data-i18n-aria-label="shell\.topNavLabel"/);
  assert.match(combinedHtml, /data-doc-on-this-page="true"/);
  assert.match(combinedHtml, /data-mandatory-boundary-block="visible"/);
  assert.match(combinedHtml, /data-no-overclaim-boundary="visible"/);
  assert.match(combinedHtml, /data-governance-boundary-strip="visible"/);
  assert.match(combinedHtml, /data-doc-chapter-pager="true"/);
  assert.match(combinedHtml, /data-contract-surface="tcrn-design-system-storybook"/);
  assert.match(combinedHtml, /data-anchor-scroll-controlled="true"/);
  assert.match(combinedHtml, /--tcrn-anchor-scroll-offset: 96px/);
  assert.match(combinedHtml, /tcrnStorybookScrollToHash/);
  assert.match(combinedHtml, /tcrnStorybookScrollSpy/);
  assert.match(combinedHtml, /keepActiveLinkVisible/);
  assert.match(combinedHtml, /addEventListener\("scroll", scheduleScrollSpy/);
  assert.match(combinedHtml, /data-i18n-locale-select/);
  assert.match(combinedHtml, /<link rel="icon" href="tcrn-brand-mark\.svg" type="image\/svg\+xml" \/>/);
  assert.match(combinedHtml, /data-tcrn-doc-shell-component-style="package-backed"/);
  assert.match(combinedHtml, /class="[^"]*tcrn-search-input__control/);
  assert.match(combinedHtml, /--tcrn-doc-motion-spring: 0\.5s cubic-bezier\(0\.175, 0\.885, 0\.32, 1\.275\)/);
  assert.match(combinedHtml, /--tcrn-doc-motion-smooth: 0\.4s ease/);
  assert.match(combinedHtml, /--tcrn-doc-theme-crossfade-duration: 0\.4s/);
  assert.match(combinedHtml, /::view-transition-old\(root\)/);
  assert.match(combinedHtml, /::view-transition-new\(root\)/);
  assert.match(combinedHtml, /data-theme-switching/);
  assert.match(combinedHtml, /tcrn-doc-theme-transition-wash/);
  assert.match(combinedHtml, /role="combobox"/);
  assert.match(combinedHtml, /aria-keyshortcuts="Control\+K Meta\+K"/);
  assert.match(combinedHtml, /data-doc-search-results/);
  assert.match(combinedHtml, /class="tcrn-doc-search-results"/);
  assert.match(combinedHtml, /role="listbox"/);
  assert.match(combinedHtml, /data-doc-search-result/);
  assert.match(combinedHtml, /data-storybook-theme="light"/);
  assert.match(combinedHtml, /data-storybook-supported-themes="light,dark"/);
  assert.match(combinedHtml, /data-current-theme="light"/);
  assert.match(combinedHtml, /data-package-backed-shell-control="theme-toggle"/);
  assert.match(combinedHtml, /data-theme-icon="light"[\s\S]*data-icon-name="sun"/);
  assert.match(combinedHtml, /data-theme-icon="dark"[\s\S]*data-icon-name="moon"/);
  assert.match(combinedHtml, /toggle\.setAttribute\("data-theme-label-key", labelKey\)/);
  assert.match(combinedHtml, /data-i18n-aria-label="shell\.languageLabel"/);
  assert.match(combinedHtml, /data-locale-menu-toggle/);
  assert.match(combinedHtml, /data-package-backed-shell-control="locale-menu"/);
  assert.match(combinedHtml, /data-icon-name="globe-2"/);
  assert.match(combinedHtml, /data-locale-current-name(?:="true")?>English</);
  assert.match(combinedHtml, /data-locale-menu-option/);
  assert.match(combinedHtml, /data-locale-name="简体中文"/);
  assert.match(combinedHtml, /data-icon-name="chevron-down"/);
  assert.doesNotMatch(combinedHtml, /简体中文 \/ Simplified Chinese/);
  assert.match(combinedHtml, /tcrnStorybookApplyTheme/);
  assert.match(combinedHtml, /document\.startViewTransition/);
  assert.match(combinedHtml, /runFallbackThemeTransition/);
  assert.doesNotMatch(combinedHtml, /data-ai-consumption-contract-link="true"/);
  assert.doesNotMatch(combinedHtml, /data-storybook-content-icon="ai-contract"/);
  assert.doesNotMatch(combinedHtml, /tcrn-doc-ai-contract-link/);
  assert.match(combinedHtml, /event\.key\.toLowerCase\(\) !== "k"/);
  assert.match(combinedHtml, /readItems\(\)\.filter/);
  assert.match(combinedHtml, /resultsBox\.addEventListener\("mousedown"/);
  assert.match(combinedHtml, /new URL\(result\.href, window\.location\.href\)/);
  assert.match(combinedHtml, /window\.location\.href = targetUrl\.href/);
  assert.match(combinedHtml, /preserveWindowScroll/);
  assert.match(combinedHtml, /focusSearchInput/);
  assert.match(combinedHtml, /setSearchExpanded/);
  assert.match(combinedHtml, /data-search-expanded/);
  assert.match(combinedHtml, /document\.addEventListener\("pointerdown"/);
  assert.match(combinedHtml, /input\.focus\(\{ preventScroll: true \}\)/);
  assert.match(combinedHtml, /input\.addEventListener\("pointerdown"/);
  assert.match(combinedHtml, /shell\.searchNoResults/);
  assert.match(combinedHtml, /data-package-backed-shell-control="side-nav-collapse"/);
  assert.match(combinedHtml, /data-side-nav-action="toggle"/);
  assert.match(combinedHtml, /data-side-nav-icon="collapse"[\s\S]*data-icon-name="chevron-left"/);
  assert.match(combinedHtml, /data-side-nav-icon="expand"[\s\S]*data-icon-name="chevron-right"/);
  assert.match(combinedHtml, /data-doc-shell-icon="previous-chapter"/);
  assert.match(combinedHtml, /data-doc-shell-icon="next-chapter"/);
  assert.match(combinedHtml, /data-sidebar-motion/);
  assert.match(combinedHtml, /setCollapsed\(readStoredState\(\), false, false\)/);
  assert.doesNotMatch(combinedHtml, /font-size var\(--tcrn-motion-emphasis\)/);
  assert.doesNotMatch(combinedHtml, /max-width var\(--tcrn-motion-emphasis\)/);
  assert.match(combinedHtml, /data-side-nav-icon="collapse"[\s\S]*data-icon-name="chevron-left"/);
  assert.match(combinedHtml, /data-side-nav-icon="expand"[\s\S]*data-icon-name="chevron-right"/);
  assert.match(combinedHtml, /data-icon-name="chevron-right"/);
  assert.doesNotMatch(combinedHtml, /viewBox="0 0 20 20" focusable="false" aria-hidden="true"/);
  assert.doesNotMatch(combinedHtml, /tcrn-knowledge-shell__collapse-button span::before/);
  assert.match(combinedHtml, /<main class="tcrn-doc-content" id="content">/);
  assert.match(combinedHtml, /tcrn-doc-page-head/);
  assert.doesNotMatch(combinedHtml, /<main class="tcrn-doc-shell"/);
  assert.match(combinedHtml, /data-storybook-locale="en"/);
  assert.match(combinedHtml, new RegExp(`data-storybook-supported-locales="${tcrnSupportedLocales.join(",")}"`));
  assert.match(combinedHtml, /data-tcrn-theme="light"/);
  assert.match(combinedHtml, /data-storybook-theme="light"/);
  assert.match(combinedHtml, /data-storybook-supported-themes="light,dark"/);
  assert.match(combinedHtml, /data-shell-control="theme-toggle"/);
  assert.match(combinedHtml, /data-package-backed-shell-control="theme-toggle"/);
  assert.match(combinedHtml, /data-current-theme="light"/);
  assert.match(combinedHtml, /data-theme-next="dark"/);
  assert.doesNotMatch(combinedHtml, /tcrn-doc-theme-toggle/);
  assert.doesNotMatch(combinedHtml, /tcrn-doc-locale-toggle/);
  assert.doesNotMatch(combinedHtml, /tcrn-doc-locale-menu__/);
  assert.doesNotMatch(combinedHtml, /tcrn-doc-sidebar-toggle__/);
  assert.match(combinedHtml, /data-locale-menu/);
  assert.match(combinedHtml, /data-locale-menu-option[\s\S]*data-locale="ja"[\s\S]*data-locale-name="日本語"/);
  assert.match(combinedHtml, /querySelector\("\.tcrn-shell-locale-menu__name, \[data-locale-option-name\]"\)/);
  assert.match(combinedHtml, /querySelectorAll\("\[data-i18n-aria-label\]"\)/);
  assert.match(combinedHtml, /querySelectorAll\("\[data-i18n-title\]"\)/);
  assert.match(combinedHtml, /tcrn-design-system-storybook-theme/);
  assert.match(combinedHtml, /document\.documentElement\.style\.colorScheme = resolvedTheme/);
  assert.match(combinedHtml, /next\.searchParams\.set\("theme", theme\)/);
  assert.match(combinedHtml, /next\.searchParams\.set\("theme", currentTheme\)/);
  for (const locale of tcrnSupportedLocales) {
    assert.match(combinedHtml, new RegExp(`option value="${escapeRegExp(locale)}"`));
    for (const key of ["shell.themeLabel", "shell.themeHint", "shell.themeLightLabel", "shell.themeDarkLabel", "shell.themeLightShort", "shell.themeDarkShort"]) {
      assert.notEqual(localeText(key, locale), key, `missing Storybook theme locale text for ${locale}:${key}`);
    }
  }
  assert.match(combinedHtml, /data-i18n="story\.welcome-governance\.title"/);
  assert.match(combinedHtml, /TCRN デザインシステム契約ストーリー/);
  assert.match(combinedHtml, /TCRN 디자인 시스템 계약 스토리/);
  assert.ok(contractStories.length >= 15);
  for (const story of contractStories) {
    const owningPage = readGroupPage(story.group);
    assert.match(owningPage, new RegExp(`data-story-id="${story.id}"`));
    for (const page of pages) {
      assert.match(page.html, new RegExp(`data-doc-nav-item="${story.id}"`));
    }
    for (const group of contractStoryGroups.filter((item) => item !== story.group)) {
      assert.doesNotMatch(readGroupPage(group), new RegExp(`data-story-id="${story.id}"`));
    }
  }
  for (const group of contractStoryGroups) {
    const html = readGroupPage(group);
    const defaultStory = contractStories.find((story) => story.group === group);
    assert.match(html, new RegExp(`data-active-story-section="${escapeRegExp(group)}"`));
    assert.match(html, new RegExp(`data-story-section="${escapeRegExp(group)}"`));
    assert.ok(defaultStory);
    assert.match(html, new RegExp(`data-doc-nav-item="${escapeRegExp(defaultStory.id)}"[^>]*aria-current="location"`));
    assert.equal(readDocShellCategoryIds(html).length, expectedStoryCategoryCount);
    assert.equal(readDocShellNavHtml(html).match(/data-doc-nav-group="/g)?.length, expectedStorybookShellNavGroupCount);
    assert.equal(readDocShellNavItemIds(html).length, contractStories.length);
    assert.equal(html.match(/data-doc-chapter-pager="true"/g)?.length, 1);
    assert.equal(readDocShellActiveStoryIds(html).length, 1);
    assert.equal(readDocShellActiveSectionCount(html), 1);
    assert.equal(html.match(/data-story-section="/g)?.length, 1);
    for (const story of contractStories.filter((item) => item.group === group)) {
      assert.match(html, new RegExp(`data-story-id="${escapeRegExp(story.id)}"[^>]*data-story-category="${escapeRegExp(story.category)}"`));
      assert.match(html, new RegExp(`data-story-id="${escapeRegExp(story.id)}"[^>]*data-story-source-path="${escapeRegExp(story.sourcePath)}"`));
    }
  }
  assert.match(readGroupPage("Welcome"), /Welcome and governance/);
  assert.match(readGroupPage("Welcome"), /Maintainers and routing/);
  assert.match(readGroupPage("Style Guide"), /Brand identity/);
  assert.match(readGroupPage("Style Guide"), /Logo construction rules/);
  assert.match(readGroupPage("Style Guide"), /src="tcrn-brand-mark\.svg"/);
  const brandIdentityHtml = readStoryHtml(readGroupPage("Style Guide"), "brand-identity");
  assert.match(brandIdentityHtml, /Product lockups/);
  assert.match(brandIdentityHtml, /TCRN product lockup examples/);
  assert.equal(brandIdentityHtml.match(/data-brand-lockup="product"/g)?.length, 3);
  assert.match(brandIdentityHtml, />AOS</);
  assert.match(brandIdentityHtml, />TMS</);
  assert.match(brandIdentityHtml, />Design System</);
  assert.doesNotMatch(brandIdentityHtml, /Registered product logos/);
  assert.doesNotMatch(brandIdentityHtml, /ProductLogo \/ tcrnProductLogoRegistry/);
  assert.doesNotMatch(brandIdentityHtml, /data-product-logo-asset-id="tcrn-aos-two-line"/);
  assert.match(readGroupPage("Style Guide"), /Icon library contract/);
  assert.match(readGroupPage("Style Guide"), /data-icon-library-source="lucide-react"/);
  assert.match(readGroupPage("Style Guide"), /data-icon-library-wrapper="@tcrn\/ui-react\/Icon"/);
  assert.match(readGroupPage("Style Guide"), /data-icon-library-license="ISC"/);
  assert.match(readGroupPage("Style Guide"), /data-icon-brand-boundary="not-brand-identity"/);
  assert.match(readGroupPage("Style Guide"), /class="tcrn-icon-sample-grid"/);
  assert.match(readGroupPage("Style Guide"), /class="tcrn-icon-sample"/);
  const iconSampleGridCss = readGroupPage("Style Guide").match(/\.tcrn-icon-sample-grid \{[\s\S]*?\}/)?.[0] ?? "";
  assert.doesNotMatch(iconSampleGridCss, /--tcrn-space-3/);
  assert.match(readGroupPage("Style Guide"), /\.tcrn-icon-sample-grid[\s\S]*margin: var\(--tcrn-space-4\) 0 0/);
  assert.match(readGroupPage("Style Guide"), /data-icon-name="search"/);
  assert.match(readGroupPage("Style Guide"), /No red, pink, coral, or orange connector points/);
  assert.match(readGroupPage("Style Guide"), /Color palette/);
  assert.match(readGroupPage("Style Guide"), /Copy creation rules/);
  assert.match(readGroupPage("Components"), /Component family index/);
  assert.match(readGroupPage("Components"), /Recommended component families/);
  assert.match(readGroupPage("Components"), /Package-backed component API/);
  assert.match(readGroupPage("Components"), /Package utility exports/);
  assert.match(readGroupPage("Components"), /ProductShell/);
  assert.match(readGroupPage("Components"), /ProductShellSearch/);
  assert.match(readGroupPage("Components"), /useProductShellController/);
  assert.match(readGroupPage("Components"), /Component library available/);
  assert.match(readGroupPage("Components"), /data-component-library-parity="package-backed"/);
  assert.match(readGroupPage("Components"), /data-component-source="@tcrn\/ui-react"/);
  assert.match(readGroupPage("Components"), /data-token-source="@tcrn\/ui-tokens"/);
  assert.match(readGroupPage("Components"), /data-copy-state-source="@tcrn\/ui-copy-state"/);
  assert.match(readGroupPage("Components"), /Storybook-only prototypes/);
  assert.match(readGroupPage("Components"), /Storybook prototype/);
  assert.match(readGroupPage("Components"), /ProductLogo/);
  assert.match(readGroupPage("Components"), /tcrnProductLogoRegistry/);
  assert.doesNotMatch(readGroupPage("Components"), /Foundation A package exports/);
  assert.doesNotMatch(readGroupPage("Components"), /Component Library Foundation A/);
  assert.doesNotMatch(readGroupPage("Components"), /Non-Foundation public exports/);
  assert.doesNotMatch(readGroupPage("Components"), /storybook_only deferred/);
  assert.doesNotMatch(readGroupPage("Components"), /LogoMark/);
  assert.doesNotMatch(readGroupPage("Components"), /ProductName/);
  assert.doesNotMatch(readGroupPage("Components"), /BrandHeader/);
  assert.match(readGroupPage("Components"), /data-storybook-only="dense-shell-prototype"/);
  assert.match(readGroupPage("Components"), /data-storybook-only="knowledge-shell-prototype"/);
  assert.match(readGroupPage("Components"), /data-storybook-only="compact-shell-prototype"/);
  assert.match(readGroupPage("Components"), /data-package-backed-navigation-proof="true"/);
  assert.match(readGroupPage("Components"), /data-package-backed-product-shell-proof="true"/);
  assert.match(readGroupPage("Components"), /data-package-backed-product-shell-boundary="side-nav-shell-v1"/);
  assert.match(readGroupPage("Components"), /data-product-shell-pattern="attached-side-nav"/);
  assert.match(readGroupPage("Components"), /data-product-shell-effect-boundary="ds-owned-tokens-motion-focus"/);
  assert.match(readGroupPage("Components"), /data-product-shell-consumer-scope="ia-data-route-labels-content-callbacks"/);
  assert.match(readGroupPage("Components"), /data-product-shell-semantic-api="collapse-theme-locale-search"/);
  assert.match(readGroupPage("Components"), /data-side-nav-semantic-api="onCollapsedChange"/);
  assert.match(readGroupPage("Components"), /data-side-nav-action="toggle"/);
  assert.match(readGroupPage("Components"), /data-shell-control="product-shell-search"/);
  assert.match(readGroupPage("Components"), /data-search-dismissal-contract="blur-outside-pointer-tab-escape"/);
  assert.match(readGroupPage("Components"), /data-search-semantic-api="onQueryChange-onExpandedChange-onDismiss-onResultActivate"/);
  assert.match(readGroupPage("Components"), /data-locale-dismissal-contract="selection-outside-pointer-escape-focus-return"/);
  assert.match(readGroupPage("Components"), /data-locale-semantic-api="onOpenChange-onLocaleChange"/);
  assert.match(readGroupPage("Components"), /data-theme-transition-contract="whole-page-view-transition-or-token-wash"/);
  assert.match(readGroupPage("Components"), /Package-backed AOS shell boundary/);
  assert.match(readGroupPage("Components"), /Product consumers supply only route IA, labels, locale data, search records, content slots, and named DS callbacks/);
  assert.match(readGroupPage("Components"), /useProductShellController prop bundles instead of wrapper event delegation/);
  assert.match(readGroupPage("Components"), /tcrn-side-nav/);
  assert.match(readGroupPage("Components"), /data-navigation-primitive="side-nav"/);
  assert.match(readGroupPage("Components"), /data-navigation-primitive="nav-group"/);
  assert.match(readGroupPage("Components"), /data-navigation-primitive="nav-item"/);
  assert.match(readGroupPage("Components"), /tcrn-segmented-nav/);
  assert.match(readGroupPage("Components"), /tcrn-product-switcher/);
  assert.match(readGroupPage("Components"), /tcrn-skip-link/);
  assert.match(readGroupPage("Style Guide"), /data-registered-product-logo="@tcrn\/ui-react\/ProductLogo"/);
  assert.match(readGroupPage("Style Guide"), /data-brand-asset-registration="design-system"/);
  assert.match(readGroupPage("Components"), /Navigation and shell spec/);
  assert.match(readGroupPage("Components"), /Navigation shell components are first-class component contracts/);
  assert.match(readGroupPage("Components"), /Current location may scroll into view and highlight, but must not reorder sections/);
  assert.match(readGroupPage("Components"), /Control\/Command\+K shortcut labels belong only to navigation or shell search with a real focus target and result behavior/);
  assert.match(readGroupPage("Components"), /Shell selection matrix/);
  assert.match(readGroupPage("Components"), /TMS dense operations shell/);
  assert.match(readGroupPage("Components"), /Knowledge base bookmark shell/);
  assert.match(readGroupPage("Components"), /tcrn-shell-mega-menu/);
  assert.match(readGroupPage("Components"), /tcrn-shell-layer/);
  assert.match(readGroupPage("Components"), /data-shell-layer="mega-menu"/);
  assert.match(readGroupPage("Components"), /data-tms-menu-density-standard="adaptive"/);
  assert.match(readGroupPage("Components"), /data-menu-layer="low-secondary"/);
  assert.match(readGroupPage("Components"), /data-menu-layout="hub"/);
  assert.match(readGroupPage("Components"), /data-menu-density="hub"/);
  assert.match(readGroupPage("Components"), /data-density-trigger="3-to-8-secondary-routes"/);
  assert.match(readGroupPage("Components"), /data-secondary-route-count="6"/);
  assert.match(readGroupPage("Components"), /data-menu-layer="10-plus-primary"/);
  assert.match(readGroupPage("Components"), /data-menu-layout="command-center"/);
  assert.match(readGroupPage("Components"), /data-menu-density="command-center"/);
  assert.match(readGroupPage("Components"), /data-shell-width="edge-to-edge"/);
  assert.match(readGroupPage("Components"), /data-shell-topbar="edge-to-edge"/);
  const internalLabSource = readInternalLabSource();
  assert.match(internalLabSource, /title: "Internal\/Overlay family lab"/);
  assert.match(internalLabSource, /data-internal-dev-surface/);
  assert.match(internalLabSource, /data-contract-docs/);
  assert.match(internalLabSource, /data-storybook-contract-truth/);
  assert.match(internalLabSource, /data-package-publication/);
  assert.match(internalLabSource, /data-storybook-docs-publication/);
  assert.match(internalLabSource, /data-consumer-adoption/);
  assert.match(internalLabSource, /data-release-readiness/);
  assert.match(internalLabSource, /data-acceptance-state/);
  assert.match(internalLabSource, /from "@tcrn\/ui-react"/);
  assert.doesNotMatch(internalLabSource, /packages\/ui-react\/src/);
  assert.doesNotMatch(internalLabSource, /@tcrn\/ui-react\//);
  assert.match(readGroupPage("Components"), /data-icon-only-menu="true"/);
  assert.match(readGroupPage("Components"), /data-primary-nav-capacity="10-plus"/);
  assert.match(readGroupPage("Components"), /data-primary-nav-count="12"/);
  assert.match(readGroupPage("Components"), /data-secondary-directory-groups="4"/);
  assert.match(readGroupPage("Components"), /tcrn-shell-demo__topbar--dense/);
  assert.match(readGroupPage("Components"), /tcrn-shell-brand-lockup/);
  assert.match(readGroupPage("Components"), /tcrn-shell-hub-menu/);
  assert.match(readGroupPage("Components"), /tcrn-shell-hub-actions/);
  assert.match(readGroupPage("Components"), /tcrn-shell-hub-sidecar/);
  assert.match(readGroupPage("Components"), /tcrn-shell-domain-nav/);
  assert.match(readGroupPage("Components"), /tcrn-shell-command-board/);
  assert.match(readGroupPage("Components"), /tcrn-shell-task-lanes/);
  assert.match(readGroupPage("Components"), /tcrn-shell-quick-rail/);
  assert.match(readGroupPage("Components"), /tcrn-knowledge-shell-layout/);
  assert.match(readGroupPage("Components"), /data-standard-shell="online-docs"/);
  assert.match(readGroupPage("Components"), /tcrn-knowledge-shell__topbar/);
  assert.match(readGroupPage("Components"), /tcrn-knowledge-shell__sidebar/);
  assert.match(readGroupPage("Components"), /tcrn-knowledge-shell__content/);
  assert.match(readGroupPage("Components"), /tcrn-knowledge-shell__pager/);
  assert.match(readGroupPage("Components"), /Top bar, attached side navigation, content column, and chapter navigation stay one shell/);
  assert.match(readGroupPage("Components"), /tcrn-bookmark-nav/);
  assert.match(readGroupPage("Components"), /tcrn-bookmark-nav--tracked/);
  assert.match(readGroupPage("Components"), /Search menu/);
  assert.match(readGroupPage("Components"), /Open dense navigation menu/);
  assert.match(readGroupPage("Components"), /Open compact operations hub/);
  assert.match(readGroupPage("Components"), /Use when the selected primary area has 3-8 secondary routes and no overflow/);
  assert.match(readGroupPage("Components"), /Do not force sparse secondary routes into the command-center or dense directory layout/);
  assert.match(readGroupPage("Components"), /Low secondary density/);
  assert.match(readGroupPage("Components"), /Switch density when/);
  assert.match(readGroupPage("Components"), /Zoom or available space causes overflow/);
  assert.match(readGroupPage("Components"), /Campaigns/);
  assert.match(readGroupPage("Components"), /Configuration/);
  assert.match(readGroupPage("Components"), /Support/);
  assert.match(readGroupPage("Components"), /This command-center layer groups 10\+ primary routes by business domain/);
  assert.match(readGroupPage("Components"), /Operations/);
  assert.match(readGroupPage("Components"), /Commercial/);
  assert.match(readGroupPage("Components"), /Control tower/);
  assert.match(readGroupPage("Components"), /Daily operations/);
  assert.match(readGroupPage("Components"), /Review and exceptions/);
  assert.match(readGroupPage("Components"), /Quick entries/);
  assert.match(readGroupPage("Components"), /Search docs/);
  assert.match(readGroupPage("Components"), /Navigation shell search fixture/);
  assert.match(readGroupPage("Components"), /Shortcut labels are allowed only for navigation or shell search with a real focus target and visible result list/);
  assert.match(readGroupPage("Components"), /Search shortcut rules/);
  assert.match(readGroupPage("Components"), /Ordinary search field/);
  assert.match(readGroupPage("Components"), /No shortcut label/);
  assert.match(readGroupPage("Components"), /Navigation or shell search/);
  assert.match(readGroupPage("Components"), /Shortcut allowed/);
  assert.match(combinedHtml, /\.tcrn-field:focus-within[\s\S]*background-color/);
  assert.match(combinedHtml, /\.tcrn-field--error[\s\S]*outline-color: var\(--tcrn-color-state-blocked\)/);
  assert.match(combinedHtml, /\.tcrn-field \{[\s\S]*transition:[\s\S]*background-color 150ms ease-out,[\s\S]*outline-color 150ms ease-out/);
  assert.match(combinedHtml, /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.tcrn-field[\s\S]*transition: none/);
  assert.match(combinedHtml, /@media \(forced-colors: active\)[\s\S]*\.tcrn-field:focus-within,[\s\S]*\.tcrn-field--error[\s\S]*outline: 2px solid Highlight/);
  const fieldAttentionBlocks = Array.from(
    combinedHtml.matchAll(/\.tcrn-field[^{]*\{[^}]*\}/g),
    (match) => match[0]
  ).join("\n");
  assert.doesNotMatch(fieldAttentionBlocks, /transition:\s*all/);
  assert.doesNotMatch(fieldAttentionBlocks, /animation:/);
  assert.doesNotMatch(fieldAttentionBlocks, /transform:/);
  assert.doesNotMatch(combinedHtml, /@keyframes[^{}]*field/i);
  assert.doesNotMatch(combinedHtml, /highlightError/);
  assert.doesNotMatch(combinedHtml, /\.is-invalid/);
  for (const [sourceName, source] of [
    ["src/alpha-styles.ts", readStorybookSource("src/alpha-styles.ts")],
    ["src/storybook.css", readStorybookSource("src/storybook.css")],
    ["src/story-demo-styles.ts", readStorybookSource("src/story-demo-styles.ts")]
  ] as const) {
    for (const [ruleName, pattern] of [
      ["raw-search-control", /(^|\n)[^{\n]*\.tcrn-search-input__control[^{]*\{/],
      ["raw-search-shortcut", /(^|\n)[^{\n]*\.tcrn-search-input__shortcut[^{]*\{/],
      ["raw-table-shell-row", /(^|\n)[^{\n]*\.tcrn-table-shell__(?:head|row|cell|empty)[^{]*\{/],
      ["raw-brand-mark", /(^|\n)[^{\n]*\.tcrn-brand-mark[^{]*\{/],
      ["raw-brand-lockup", /(^|\n)[^{\n]*\.tcrn-brand-lockup(?:[\s.{:#,[>+~]|$)/]
    ] as const) {
      assert.doesNotMatch(source, pattern, `Storybook source must not clone package primitive internals: ${sourceName}:${ruleName}`);
    }
  }
  assert.match(readGroupPage("Components"), /tcrn-brand-mark.svg/);
  assert.match(readGroupPage("Components"), /tcrn-search-input__icon/);
  assert.match(readGroupPage("Components"), /data-dialog-proof="escape-focus-return"/);
  assert.match(readGroupPage("Components"), /data-dialog-tab-containment="not-claimed"/);
  assert.match(readGroupPage("Components"), /data-dialog-fixture-open/);
  assert.match(readGroupPage("Components"), /data-dialog-fixture-panel/);
  assert.match(readGroupPage("Components"), /data-overlay-transition-state="closed"/);
  assert.match(readGroupPage("Components"), /data-popover-proof="anchored-close-return"/);
  assert.match(readGroupPage("Components"), /data-popover-fixture-open/);
  assert.match(readGroupPage("Components"), /data-overlay-scope="popover"/);
  assert.match(readGroupPage("Components"), /Overlay mode matrix/);
  assert.match(readGroupPage("Components"), /Popover proof fixture/);
  assert.match(readGroupPage("Components"), /Confirm action dialog/);
  assert.match(readGroupPage("Components"), /Structural drawers/);
  assert.ok(combinedHtml.includes("querySelectorAll(\"[data-dialog-proof='escape-focus-return']\")"));
  assert.ok(combinedHtml.includes("querySelectorAll(\"[data-popover-proof='anchored-close-return']\")"));
  assert.ok(combinedHtml.includes("data-overlay-transition-state"));
  assert.ok(combinedHtml.includes("panel.setAttribute(\"data-overlay-transition-state\", \"closed\")"));
  assert.ok(combinedHtml.includes("panel.getBoundingClientRect()"));
  assert.ok(combinedHtml.includes("panel.setAttribute(\"data-overlay-transition-state\", \"opening\")"));
  assert.ok(combinedHtml.includes("openButton.setAttribute(\"aria-expanded\", open ? \"true\" : \"false\")"));
  assert.match(readGroupPage("Components"), /Interactive proof fixture/);
  assert.match(readGroupPage("Components"), /Open the fixture to verify focus entry, Escape close, and focus return without claiming Tab containment/);
  assert.doesNotMatch(readGroupPage("Components"), />Static capability readback</);
  assert.match(readGroupPage("Components"), /data-icon-name="menu"/);
  assert.match(readGroupPage("Components"), /data-icon-name="arrow-left"/);
  assert.match(readGroupPage("Components"), /data-icon-name="arrow-right"/);
  assert.match(readGroupPage("Components"), /data-icon-name="chevron-left"/);
  assert.match(readGroupPage("Components"), /data-shortcut-auto="search"/);
  assert.match(readGroupPage("Components"), /tcrn-input--short/);
  assert.match(readGroupPage("Components"), /Field width rules/);
  assert.match(readGroupPage("Components"), /Table shell rules/);
  assert.match(readGroupPage("Components"), /Accessibility receipt/);
  assert.match(readGroupPage("Components"), /Never place headings or arbitrary blocks directly under role=table/);
  assert.match(readGroupPage("Components"), /Sorting and filtering/);
  assert.match(readGroupPage("Components"), /TableShell does not imply remote filtering, column configuration, or persisted sort state/);
  assert.match(readGroupPage("Components"), /Row actions/);
  assert.match(readGroupPage("Components"), /Bulk selection/);
  assert.match(readGroupPage("Components"), /DataGrid escalation boundary/);
  assert.match(readGroupPage("Components"), /DataGrid escalation criteria/);
  assert.match(readGroupPage("Components"), /Editable cells/);
  assert.match(readGroupPage("Components"), /Remote pagination or filtering/);
  assert.match(readGroupPage("Components"), /Virtual scrolling/);
  assert.match(readGroupPage("Components"), /Column resize or frozen columns/);
  assert.match(readGroupPage("Components"), /Selected count, all\/none behavior, disabled reasons, and undo or confirmation/);
  assert.match(readGroupPage("Components"), /Work Management component specs/);
  assert.match(readGroupPage("Components"), /data-work-management-contract="package-backed-static"/);
  assert.match(readGroupPage("Components"), /RelationshipChip/);
  assert.match(readGroupPage("Components"), /MachineToken/);
  assert.match(readGroupPage("Components"), /MachineTokenCell/);
  assert.match(readGroupPage("Components"), /WorkManagementSubnav/);
  assert.match(readGroupPage("Components"), /WorkPageHeader/);
  assert.match(readGroupPage("Components"), /WorkViewTabs/);
  assert.match(readGroupPage("Components"), /WorkQuickFilters/);
  assert.match(readGroupPage("Components"), /WorkItemRow/);
  assert.match(readGroupPage("Components"), /WorkList/);
  assert.match(readGroupPage("Components"), /WorkSplitView/);
  assert.match(readGroupPage("Components"), /WorkBacklogGroup/);
  assert.match(readGroupPage("Components"), /WorkBoard/);
  assert.match(readGroupPage("Components"), /WorkBoardView/);
  assert.match(readGroupPage("Components"), /WorkDetailLayout/);
  assert.match(readGroupPage("Components"), /MetadataRail/);
  assert.match(readGroupPage("Components"), /WorkFieldPanel/);
  assert.match(readGroupPage("Components"), /WorkActivityFeed/);
  assert.match(readGroupPage("Components"), /WorkHierarchy/);
  assert.match(readGroupPage("Components"), /GatePipeline/);
  assert.match(readGroupPage("Components"), /GatePipelineCompact/);
  assert.match(readGroupPage("Components"), /EvidenceAttachmentList/);
  assert.match(readGroupPage("Components"), /WorkItemInspector/);
  assert.match(readGroupPage("Components"), /SavedViewToolbar/);
  assert.match(readGroupPage("Components"), /Knowledge Management component specs/);
  assert.match(readGroupPage("Components"), /data-knowledge-management-contract="package-backed-static"/);
  assert.match(readGroupPage("Components"), /KnowledgePageTree/);
  assert.match(readGroupPage("Components"), /KnowledgeDocumentCanvas/);
  assert.match(readGroupPage("Components"), /KnowledgeTocRail/);
  assert.match(readGroupPage("Components"), /KnowledgeInlineCommentList/);
  assert.match(readGroupPage("Components"), /KnowledgeMetadataRail/);
  assert.match(readGroupPage("Components"), /KnowledgeAttachmentList/);
  assert.match(readGroupPage("Components"), /KnowledgeLabelSet/);
  assert.match(readGroupPage("Components"), /KnowledgeVersionHistory/);
  assert.match(readGroupPage("Components"), /KnowledgeTemplateGallery/);
  assert.match(readGroupPage("Components"), /KnowledgeSearchResults/);
  for (const relation of ["blocks", "blocked_by", "depends_on", "relates_to", "duplicates", "supersedes", "split_from", "caused_by", "implements", "verifies", "reviews", "refreshes"]) {
    assert.match(readGroupPage("Components"), new RegExp(`data-work-relationship="${relation}"`));
  }
  assert.match(readGroupPage("Components"), /route_tcrn_ds_work_management_patterns_ilya_ds_package_storybook_implementation_after_minerva_initiative_c4865675/);
  assert.match(readGroupPage("Components"), /Codex Activity is execution and evidence context attached to this Work Item; it is not a replacement for Story or Task \/ Work Item/);
  assert.match(readGroupPage("Patterns"), /Work Management patterns/);
  assert.match(readGroupPage("Patterns"), /data-work-management-patterns="static-no-live"/);
  assert.match(readGroupPage("Patterns"), /Smallest acceptable human\/business\/workflow result/);
  assert.match(readGroupPage("Patterns"), /Smallest executable ticket\/task unit/);
  assert.match(readGroupPage("Patterns"), /no API integration, backend persistence, live Codex dispatch, external queue, product adoption, owner acceptance, package publication, or release readiness is claimed/i);
  assert.doesNotMatch(readGroupPage("Patterns"), /data-story-id="aos-operations-cockpit-standard"/);
  assert.doesNotMatch(readGroupPage("Patterns"), /data-story-id="aos-docs-readiness-standard"/);
  assert.doesNotMatch(readGroupPage("Patterns"), /data-story-id="aos-product-design-target-set-standard"/);
  assert.doesNotMatch(readGroupPage("Patterns"), /data-aos-served-surface-standard=/);
  assert.doesNotMatch(readGroupPage("Patterns"), /data-aos-component-registration="registered"/);
  assert.doesNotMatch(readGroupPage("Patterns"), /data-aos-disabled-reason-standard="all-controls"/);
  assert.doesNotMatch(readGroupPage("Patterns"), /data-aos-exception-record="brand-lockup-product-specific"/);
  assert.doesNotMatch(readGroupPage("Patterns"), /AOS brand treatment exception/);
  assert.match(readGroupPage("Foundations"), /Copy guidelines/);
  assert.match(readGroupPage("Foundations"), /Foundation visual standards/);
  assert.match(readGroupPage("Foundations"), /data-foundation-visual-standards="registry"/);
  for (const categoryId of foundationVisualStandardCategoryIds) {
    assert.match(readGroupPage("Foundations"), new RegExp(`data-foundation-standard-category-id="${categoryId}"`));
  }
  assert.match(readGroupPage("Foundations"), /consumer-visual-style-contract-v1/);
  assert.match(readGroupPage("Foundations"), /original-storybook-doc-shell-v1/);
  assert.match(readGroupPage("Foundations"), /consumer-local shell-control geometry/);
  assert.match(readGroupPage("Foundations"), /Missing standard escalation/);
  assert.match(readGroupPage("Foundations"), /Storybook doc shell control contract/);
  assert.match(readGroupPage("Foundations"), /Use one circular icon-only button/);
  assert.match(readGroupPage("Foundations"), /Use the Storybook doc shell as the documentation shell authority/);
  assert.match(readGroupPage("Foundations"), /ProductShell remains scoped to component docs, product visual instances, and consumer rules/);
  assert.match(readGroupPage("Foundations"), /Global Storybook pages rendered through ProductShell/);
  assert.match(readGroupPage("Foundations"), /one whole-page transition/);
  assert.match(readGroupPage("Foundations"), /current locale name in that locale/);
  assert.match(readGroupPage("Foundations"), /outside pointer down or click, and Escape/);
  assert.match(readGroupPage("Foundations"), /return focus to the trigger/);
  assert.match(readGroupPage("Foundations"), /keyboard-accessible collapse and expand control/);
  assert.match(readGroupPage("Foundations"), /planned modules presented as registered product IA/);
  assert.match(readGroupPage("Foundations"), /Keep search compact at rest, expand smoothly on focus, and collapse on blur/);
  assert.match(readGroupPage("Foundations"), /not as a top-bar human navigation item/);
  assert.match(readGroupPage("Proof"), /AI consumption contract/);
  assert.match(readGroupPage("Proof"), /data-ai-consumption-contract-story="true"/);
  assert.match(readGroupPage("Proof"), /Covered section hierarchy/);
  assert.match(readGroupPage("Proof"), /Changelog and static-authority readback/);
  assert.match(readGroupPage("Proof"), /ai-consumption-contract\.json/);
  assert.match(readGroupPage("Proof"), /Light and dark Storybook shell/);
  assert.match(readGroupPage("Proof"), /Check both light and dark Storybook shell modes before product frontend work/);
  assert.match(readGroupPage("Proof"), /Storybook shell controls/);
  assert.match(readGroupPage("Proof"), /single icon theme toggle, native-name locale menu, focus-expanded search, no AI JSON link in the top bar, and one whole-page theme transition/);
  assert.match(readGroupPage("Proof"), /Storybook doc shell boundary/);
  assert.match(readGroupPage("Proof"), /Storybook uses the restored doc shell for global shell\/header\/sidebar\/search\/theme\/locale\/collapse behavior/);
  assert.match(readGroupPage("Proof"), /ProductShell remains scoped to component and product examples/);
  assert.match(readGroupPage("Proof"), /Locale menu behavior/);
  assert.match(readGroupPage("Proof"), /Side navigation collapse/);
  assert.match(readGroupPage("Proof"), /Registered product IA/);
  assert.match(readGroupPage("Proof"), /Browser interaction proof/);
  assert.match(readGroupPage("Proof"), /marker-only proof is insufficient/);
  assert.match(readGroupPage("Proof"), /Theme modes/);
  assert.match(readGroupPage("Proof"), /Import package-backed Design System primitives from @tcrn\/ui-react; do not rebuild local clones/);
  assert.match(readGroupPage("Proof"), /Requires a downstream product adoption route/);
  assert.match(readGroupPage("Proof"), /Proof matrix/);
  assert.match(readGroupPage("Change Log"), /Local changelog/);
  assert.match(readGroupPage("Change Log"), /Governance changelog records/);
  assert.match(readGroupPage("Change Log"), /data-changelog-localized-readback="true"/);
  assert.match(readGroupPage("Change Log"), /data-changelog-records="governance"/);
  assert.match(readGroupPage("Change Log"), /route_tcrn_ds_storybook_governance_ilya_implementation_after_plan_reviews_success_a1f19b1a_dded541/);
  assert.match(readGroupPage("Change Log"), /data-changelog-route-id="route_tcrn_ds_storybook_governance_ilya_implementation_after_plan_reviews_success_a1f19b1a_dded541"/);
  assert.match(readGroupPage("Change Log"), /data-changelog-proof-artifact="docs\/verification\/internal-alpha\/browser-proof-summary\.json"/);
  assert.match(readGroupPage("Change Log"), /data-changelog-no-overclaim-boundary="no package publication"/);
  assert.match(readGroupPage("Change Log"), /Storybook governance checkpoint/);
  assert.match(readGroupPage("Change Log"), /AI contract digest/);
  assert.match(readGroupPage("Change Log"), /No-overclaim boundaries/);
  assert.doesNotMatch(readGroupPage("Change Log"), /aria-label="Storybook governance changelog"/);
  assert.doesNotMatch(readGroupPage("Change Log"), /role="columnheader"[^>]*>Story ids</);
  assert.doesNotMatch(readGroupPage("Welcome"), /data-story-id="component-family-index"/);
  assert.doesNotMatch(readGroupPage("Welcome"), /data-story-id="color-palette"/);
  assert.doesNotMatch(readGroupPage("Style Guide"), /data-story-id="tokens-copy-state"/);
  assert.doesNotMatch(combinedHtml, /from ['"]TCRN-AOS|from ['"]TCRN-TMS|product accepted|final mvp accepted|release ready/i);
  assert.doesNotMatch(combinedHtml, />external_proof_required</i);
  for (const group of expectedContractStoryGroups) {
    const html = readGroupPage(group);
    assert.match(html, /<link rel="alternate" type="application\/json" href="ai-consumption-contract\.json" title="TCRN AI consumption contract" data-tcrn-ai-consumption-contract="true" \/>/);
    assert.match(html, /<link rel="help" type="text\/plain" href="llms\.txt" data-tcrn-ai-consumption-contract-help="true" \/>/);
    assert.match(html, /<meta name="tcrn-ai-consumption-contract" content="ai-consumption-contract\.json" \/>/);
    assert.match(html, /<meta name="tcrn-ai-consumption-contract-route" content="proof\.html#ai-consumption-contract" \/>/);
    assert.match(html, /<meta name="tcrn-ai-consumption-contract-required" content="must-read-first" \/>/);
  }
});

test("style guide color index surfaces every color token and type-scale sizes stay token-derived", () => {
  const tokenValueOf = (variable: string): string => {
    const token = tcrnTokens.find((candidate) => candidate.variable === variable);
    assert.ok(token, `design token ${variable} must exist in @tcrn/ui-tokens`);
    return token.value;
  };

  // Completeness: the registry-driven "Color token index" panel must render EVERY color token
  // (identifier + live value) inside the color-palette story, so no color can be silently
  // omitted and a rename/removal cannot leave a transparent swatch behind (S039). Iterating the
  // same registry the page iterates keeps this gate true through future token renames.
  const colorPaletteHtml = readStoryHtml(readGroupPage("Style Guide"), "color-palette");
  const colorTokens = tcrnTokens.filter((token) => token.group === "color");
  assert.ok(colorTokens.length >= 39, `expected at least 39 color tokens, found ${colorTokens.length}`);
  for (const token of colorTokens) {
    assert.ok(
      colorPaletteHtml.includes(token.variable),
      `color token ${token.variable} must render in the Style Guide color-palette swatches`
    );
  }

  // Drift: every type-scale size cell and demo specimen must equal its token-derived value, so a
  // prose-frozen literal that no longer matches the registry is rejected. The expected strings are
  // themselves derived from the registry, guarding the template reconstruction against byte drift.
  const textStylesHtml = readStoryHtml(readGroupPage("Style Guide"), "text-styles");
  const expectedTypeScaleSizes = [
    `${tokenValueOf("--tcrn-type-size-page")} / ${tokenValueOf("--tcrn-type-line-page")} / ${tokenValueOf("--tcrn-type-weight-strong")}`,
    `${tokenValueOf("--tcrn-type-size-section")} / ${tokenValueOf("--tcrn-type-line-section")} / ${tokenValueOf("--tcrn-type-weight-strong")}`,
    `${tokenValueOf("--tcrn-type-size-ui")} / ${tokenValueOf("--tcrn-type-line-ui")} / ${tokenValueOf("--tcrn-type-weight-regular")}`,
    `${tokenValueOf("--tcrn-type-size-reading")} / ${tokenValueOf("--tcrn-type-line-reading")} / ${tokenValueOf("--tcrn-type-weight-regular")}`,
    `${tokenValueOf("--tcrn-type-size-body")} / ${tokenValueOf("--tcrn-type-line-body")} / ${tokenValueOf("--tcrn-type-weight-regular")}`,
    `${tokenValueOf("--tcrn-type-size-control")} / ${tokenValueOf("--tcrn-type-line-control")} / ${tokenValueOf("--tcrn-type-weight-medium")}`,
    `${tokenValueOf("--tcrn-type-size-caption")} / ${tokenValueOf("--tcrn-type-line-caption")} / ${tokenValueOf("--tcrn-type-weight-medium")}`,
    `${tokenValueOf("--tcrn-type-size-meta")} / 1.4 / mono`
  ];
  for (const size of expectedTypeScaleSizes) {
    assert.ok(
      textStylesHtml.includes(size),
      `type-scale size "${size}" must render from a token-derived template, not a frozen literal`
    );
  }
  const expectedTypeScaleSpecimens = [
    `Page title / ${tokenValueOf("--tcrn-type-size-page")}`,
    `Section title / ${tokenValueOf("--tcrn-type-size-section")}`,
    `Dense UI body / ${tokenValueOf("--tcrn-type-size-ui")} remains the default for operational scanning.`,
    `Reading body / ${tokenValueOf("--tcrn-type-size-reading")} is reserved for proof-gated explanatory copy.`,
    `Body copy / ${tokenValueOf("--tcrn-type-size-body")} keeps dense product surfaces readable without becoming tiny.`,
    `Caption / ${tokenValueOf("--tcrn-type-size-caption")} is reserved for metadata and helper context.`
  ];
  for (const specimen of expectedTypeScaleSpecimens) {
    assert.ok(
      textStylesHtml.includes(specimen),
      `type-scale specimen "${specimen}" must render from a token-derived template`
    );
  }
});

test("canvas color and theme-color first-paint mirror the surface-canvas token", () => {
  const canvasVar = "--tcrn-color-surface-canvas";
  const canvasLight = createTokenMap()[canvasVar];
  const canvasDark = tcrnDarkThemeTokens.find((token) => token.variable === canvasVar)?.value;
  assert.ok(canvasLight, "light surface-canvas token missing");
  assert.ok(canvasDark, "dark surface-canvas token missing");

  // Real-Storybook preview background must equal the light canvas token.
  const preview = readStorybookSource(".storybook/preview.ts");
  assert.match(preview, new RegExp('"TCRN canvas",\\s*value:\\s*"' + escapeRegExp(canvasLight) + '"'));
  assert.doesNotMatch(preview, /#f4f7fa/i, "stale preview canvas value #f4f7fa must be gone");

  // Static-docs first-paint theme-color meta must equal the light canvas token.
  const componentsPage = readGroupPage("Components");
  assert.ok(
    componentsPage.includes('<meta name="theme-color" content="' + canvasLight + '" data-storybook-theme-color'),
    "first-paint theme-color meta must equal the light canvas token"
  );
  assert.doesNotMatch(componentsPage, /content="#f6f7fb"/i, "stale first-paint theme-color #f6f7fb must be gone");

  // Manual mirror in client-scripts must equal the light/dark canvas tokens.
  const clientScripts = readStorybookSource("src/build/client-scripts.ts");
  assert.match(clientScripts, new RegExp('light:\\s*"' + escapeRegExp(canvasLight) + '"'));
  assert.match(clientScripts, new RegExp('dark:\\s*"' + escapeRegExp(canvasDark) + '"'));
});

test("storybook AI consumption contract is machine-readable and no-overclaim", () => {
  const contractSource = readFileSync(join(process.cwd(), "storybook-static", "ai-consumption-contract.json"), "utf8");
  const contract = JSON.parse(contractSource);
  const requiredStorybookSectionChecklist = contract.requiredStorybookSectionChecklist as Array<{
    section: string;
    route: string;
    requiredStories: string[];
    consumerChecks: string[];
  }>;
  const { contractPayloadDigest, ...baseContract } = contract;
  assert.equal(contract.contractVersion, "ai_consumption_contract_v1");
  assert.equal(contract.storyId, "ai-consumption-contract");
  assert.equal(contract.route, "proof.html#ai-consumption-contract");
  assert.equal(contract.artifact, "ai-consumption-contract.json");
  assert.equal(contract.mustReadFirst, true);
  assert.equal(contractPayloadDigest, sha256(`${JSON.stringify(baseContract, null, 2)}\n`));
  assert.equal(contract.discovery.staticArtifact, "apps/storybook/storybook-static/ai-consumption-contract.json");
  assert.equal(contract.discovery.hostedArtifact, "https://tcrn-design-system-storybook.vercel.app/ai-consumption-contract.json");
  assert.equal(contract.discovery.llmsTxt, "llms.txt");
  assert.equal(contract.discovery.robotsTxt, "robots.txt");
  assert.deepEqual(contract.firstReadRoutes, ["ai-consumption-contract.json", "llms.txt", "proof.html#ai-consumption-contract"]);
  assert.deepEqual(contract.requiredReadbackFields, expectedAiReadbackFields);
  assert.equal(contract.discovery.htmlHead.alternateJson.dataMarker, "data-tcrn-ai-consumption-contract=\"true\"");
  assert.equal(contract.discovery.htmlHead.meta.required, "tcrn-ai-consumption-contract-required");
  assert.deepEqual(contract.requiredBeforeProductFrontendImplementation, expectedAiRequiredBeforeProductFrontendImplementation);
  assert.deepEqual(contract.requiredProof, expectedAiRequiredProof);
  assert.deepEqual(requiredStorybookSectionChecklist.map((section) => section.section), expectedContractStoryGroups);
  assert.deepEqual(requiredStorybookSectionChecklist.flatMap((section) => section.requiredStories), expectedContractStoryIds);
  assert.deepEqual(contract.coveredStorybookSections.map((section: { section: string }) => section.section), expectedContractStoryGroups);
  assert.equal(
    contract.coveredStorybookSections.reduce((count: number, section: { categories: unknown[] }) => count + section.categories.length, 0),
    expectedStoryCategoryCount
  );
  assert.equal(contract.storybookGovernanceTraceability?.hierarchy, "section -> category -> story");
  assert.deepEqual(contract.storybookGovernanceTraceability?.topLevelSections, expectedContractStoryGroups);
  assert.match(contract.storybookGovernanceTraceability?.currentItemAutoOpenProof ?? "", /active category expansion/);
  assert.match(contract.storybookGovernanceTraceability?.hiddenFocusSafetyProof ?? "", /no active story remains hidden/);
  assert.match(contract.storybookGovernanceTraceability?.mandatoryBoundaryVisibility ?? "", /outside optional disclosure/);
  assert.equal(contract.changelogGovernance?.records?.length, storybookGovernanceChangelogRecords.length);
  assert.match(contract.changelogGovernance?.storybookStory ?? "", /change-log\.html#local-changelog/);
  assert.ok(contract.changelogGovernance?.requiredFields?.includes("proofArtifacts"));
  assert.match(contract.changelogGovernance?.digestAlignmentProof ?? "", /contractPayloadDigest/);
  assert.equal(contract.workManagementStaticAuthority?.disposition, "static_contract_authority_explicit_and_smoke_proven");
  assert.match(contract.workManagementStaticAuthority?.componentStory ?? "", /work-management-components-spec/);
  assert.match(contract.workManagementStaticAuthority?.patternStory ?? "", /work-management-patterns/);
  assert.match(contract.workManagementStaticAuthority?.managerRuntimeCoverageDisposition ?? "", /static contract story ids are the authoritative/);
  assert.match(contract.workManagementStaticAuthority?.noOverclaimBoundary ?? "", /initiative completion/);
  assert.equal(contract.foundationVisualStandards?.registryId, "foundation-visual-standards-v1");
  assert.equal(contract.foundationVisualStandards?.storybookRoute, "foundations.html#foundation-visual-standards");
  assert.deepEqual(contract.foundationVisualStandards?.categoryIds, foundationVisualStandardCategoryIds);
  assert.equal(contract.foundationVisualStandardCategories?.length, foundationVisualStandards.length);
  assert.deepEqual(
    contract.foundationVisualStandardCategories?.map((standard: { id: string }) => standard.id),
    foundationVisualStandardCategoryIds
  );
  for (const standard of contract.foundationVisualStandardCategories ?? []) {
    assert.ok(standard.sourcePaths?.length > 0, `foundation standard missing source paths: ${standard.id}`);
    assert.ok(standard.storybookRoutes?.length > 0, `foundation standard missing storybook routes: ${standard.id}`);
    assert.ok(standard.readbackFields?.length > 0, `foundation standard missing readback fields: ${standard.id}`);
    assert.ok(standard.proofExpectations?.length > 0, `foundation standard missing proof expectations: ${standard.id}`);
    assert.match(standard.missingStandardEscalation ?? "", /Block|Return|Route|Skip|Do not close/);
  }
  assert.equal(contract.storybookDocShellVisualOracle?.id, storybookDocShellVisualOracle.id);
  assert.equal(contract.storybookDocShellVisualOracle?.shellAuthority, "storybook_doc_shell_with_package_primitives");
  assert.equal(contract.storybookDocShellVisualOracle?.oracleRecoveryReceipt, storybookDocShellVisualOracle.oracleRecoveryReceipt);
  assert.equal(contract.storybookDocShellVisualOracle?.baselineManifestClassification, "owner_declared_original_storybook_doc_shell_standard");
  assert.match(contract.storybookDocShellVisualOracle?.metricSourceDisposition ?? "", /Storybook documentation shell/);
  assert.ok(
	  contract.storybookDocShellVisualOracle?.metricEvidence?.some((item: { metric: string; signatureBaseline?: string | null }) => (
	    item.metric === "desktopSidebarWidthPx"
	    && item.signatureBaseline === "docs/verification/internal-alpha/visual-signature-baseline.json"
	  )),
	  "Storybook doc shell visual oracle must cite perceptual-signature-backed sidebar evidence"
	);
  assert.equal(contract.storybookDocShellVisualOracle?.shellMetrics?.desktopSidebarWidthPx, 288);
	assert.equal(contract.storybookDocShellVisualOracle?.shellMetrics?.desktopSidebarMinWidthPx, 280);
	assert.equal(contract.storybookDocShellVisualOracle?.shellMetrics?.desktopSidebarMaxWidthPx, 360);
  assert.equal(contract.storybookDocShellVisualOracle?.shellMetrics?.desktopTopbarHeightPx, 96);
  assert.equal(contract.storybookDocShellVisualOracle?.shellMetrics?.searchRestWidthPx, 260);
  assert.equal(contract.storybookDocShellVisualOracle?.shellMetrics?.searchExpandedWidthPx, 360);
  assert.equal(contract.storybookDocShellVisualOracle?.shellMetrics?.themeToggleRadiusPx, 999);
  assert.deepEqual(contract.storybookDocShellVisualOracle?.globalProductShellSelectorsForbidden, storybookDocShellVisualOracle.globalProductShellSelectorsForbidden);
  assert.equal(contract.designSystemAuthorityDisposition, "package_primitives_and_storybook_doc_shell_split");
  assert.equal(contract.componentStorybookParityDisposition, "package_primitives_consumed_without_internal_clones");
  assert.equal(contract.ownerVisualAdmissionDisposition, "owner_review_required");
  assert.equal(contract.visualFitControlContract?.search?.storybookRestWidthPx, 260);
  assert.equal(contract.visualFitControlContract?.search?.storybookExpandedWidthPx, 360);
  assert.equal(contract.visualFitControlContract?.search?.packageDefaultControlMinInlineSize, "9ch");
  assert.match(contract.visualFitControlContract?.productLockups?.rule ?? "", /suffix accents are package-owned/);
  assert.match(contract.visualFitControlContract?.sidebar?.rule ?? "", /orphan visual lane/);
  assert.match(contract.visualFitControlContract?.tablesAndContainers?.rule ?? "", /package-emitted column\/min-width variables/);
  assert.match(contract.visualFitControlContract?.workLayoutDensity?.authority ?? "", /Work Management exports/);
  assert.ok(contract.visualFitControlContract?.workLayoutDensity?.packageExports?.includes("WorkItemRow"));
  assert.ok(contract.visualFitControlContract?.workLayoutDensity?.packageExports?.includes("WorkDetailLayout"));
  assert.match(contract.visualFitControlContract?.workLayoutDensity?.rule ?? "", /admitted package exports/);
  assert.match(contract.visualFitControlContract?.knowledgeLayoutDensity?.authority ?? "", /Knowledge Management exports/);
  assert.ok(contract.visualFitControlContract?.knowledgeLayoutDensity?.packageExports?.includes("KnowledgePageTree"));
  assert.ok(contract.visualFitControlContract?.knowledgeLayoutDensity?.packageExports?.includes("KnowledgeDocumentCanvas"));
  assert.match(contract.visualFitControlContract?.knowledgeLayoutDensity?.rule ?? "", /backend publishing/);
  assert.equal(contract.consumerVisualStyleContract?.id, consumerVisualStyleContract.id);
  assert.match(contract.consumerVisualStyleContract?.disposition ?? "", /fail_closed/);
  assert.ok(contract.consumerVisualStyleContract?.allowedConsumerInputs?.includes("product data"));
  assert.ok(contract.consumerVisualStyleContract?.forbiddenConsumerOverrides?.includes("consumer-local ProductShell/search/theme/locale/sidebar clones"));
  assert.match(contract.consumerVisualStyleContract?.forbiddenConsumerOverrides?.join(" ") ?? "", /consumer-local Work page header/);
  assert.ok(contract.consumerVisualStyleContract?.requiredReadbackFields?.includes("foundationVisualStandards"));
  assert.match(contract.consumerVisualStyleContract?.rejectCriteria?.join(" ") ?? "", /claims DS compliance/);
  assert.match(contract.consumerVisualStyleContract?.rejectCriteria?.join(" ") ?? "", /reusable Work module rows/);
  assert.deepEqual(contract.visualEquivalenceLevels, [
    "same_package_version",
    "same_exported_component",
    "same_variant_props_slots",
    "same_storybook_visual_instance"
  ]);
  assert.match(contract.storybookVisualParityProof, /same Storybook visual instance/);
  assert.match(contract.storybookVisualParityProof, /computed size, radius, padding, border, background, typography/);
  assert.match(contract.storybookVisualParityProof, /motion duration\/easing\/opacity\/transform/);
  assert.match(contract.storybookVisualParityProof, /mobile reflow, and information hierarchy/);
  assert.equal(contract.shellControlVisualParityProof?.disposition, "executable_required_for_product_shell_consumption");
  assert.deepEqual(contract.shellControlVisualParityProof?.controlOrder, ["currentLocation", "searchWrapper", "themeToggle", "localeTrigger"]);
  assert.match(contract.shellControlVisualParityProof?.computedStyleFields?.join(" ") ?? "", /fontFamily fontSize fontWeight lineHeight letterSpacing/);
  assert.match(contract.shellControlVisualParityProof?.computedStyleFields?.join(" ") ?? "", /backgroundColor borderRadius borderStyle borderWidth boxShadow/);
  assert.match(contract.shellControlVisualParityProof?.focusFields?.join(" ") ?? "", /outlineWidth outlineStyle outlineColor outlineOffset boxShadow/);
  assert.match(contract.shellControlVisualParityProof?.motionFields?.join(" ") ?? "", /transitionProperty transitionDuration transitionTimingFunction/);
  assert.match(contract.shellControlVisualParityProof?.reducedMotionExpectation ?? "", /transitions and animations disabled/);
  assert.equal(contract.visualInstanceOracles?.[0]?.id, "aos-frontend-shell-slice");
  assert.equal(contract.visualInstanceOracles?.[0]?.route, "components.html#aos-frontend-shell-slice");
  assert.deepEqual(contract.visualInstanceOracles?.[0]?.primaryIa, ["Cockpit", "Work"]);
  assert.deepEqual(contract.visualInstanceOracles?.[0]?.requiredVariants, [
    "desktop-light-expanded-cockpit-search-results",
    "desktop-light-expanded-cockpit-search-rest",
    "desktop-dark-expanded-cockpit",
    "desktop-light-collapsed-work",
    "mobile-dark-work-stacked",
    "reduced-motion"
  ]);
  assert.equal(contract.visualInstanceOracles?.[0]?.requiredVariantFixtures?.length, 6);
  assert.equal(
    contract.visualInstanceOracles?.[0]?.requiredVariantFixtures?.[0]?.selector,
    "[data-storybook-visual-instance=\"aos-frontend-shell-slice\"][data-visual-instance-variant=\"desktop-light-expanded-cockpit-search-results\"]"
  );
  assert.equal(
    contract.visualInstanceOracles?.[0]?.requiredVariantFixtures?.[1]?.selector,
    "[data-storybook-visual-instance=\"aos-frontend-shell-slice\"][data-visual-instance-variant=\"desktop-light-expanded-cockpit-search-rest\"]"
  );
  assert.equal(contract.visualInstanceOracles?.[0]?.requiredVariantFixtures?.[1]?.expectedState?.search, "rest");
  assert.equal(contract.visualInstanceOracles?.[0]?.requiredVariantFixtures?.[1]?.expectedState?.searchExpanded, false);
  assert.equal(contract.visualInstanceOracles?.[0]?.requiredVariantFixtures?.[1]?.expectedState?.searchResultsVisible, false);
  assert.equal(contract.visualInstanceOracles?.[0]?.requiredVariantFixtures?.[3]?.expectedState?.collapsed, true);
  assert.equal(contract.visualInstanceOracles?.[0]?.requiredVariantFixtures?.[4]?.expectedState?.locale, "zh-CN");
  assert.equal(contract.visualInstanceOracles?.[0]?.requiredVariantFixtures?.[5]?.expectedState?.reducedMotion, true);
  assert.match(contract.visualInstanceOracles?.[0]?.delegatedInteractionProofs?.join(" ") ?? "", /Locale menu dismissal/);
  assert.equal(
    contract.visualInstanceOracles?.[0]?.ownerVisualAdmissionBoundary,
    "internal_ds_oracle_review_required_before_owner_visual_admission"
  );
  assert.equal(
    contract.visualInstanceOracles?.[0]?.persistedCockpitRestPolicy?.defaultCockpitRestVariant,
    "desktop-light-expanded-cockpit-search-rest"
  );
  assert.match(
    contract.visualInstanceOracles?.[0]?.persistedCockpitRestPolicy?.coveredOwnerReachableRoutes?.join(" ") ?? "",
    /post-search-dismissal:\/cockpit\?locale=en&theme=light&collapsed=false&search=shell/
  );
  assert.equal(
    contract.visualInstanceOracles?.[0]?.persistedCockpitRestPolicy?.outsideMatrixMarkerForbiddenForOwnerReview,
    "aos-route-state-outside-accepted-oracle-matrix"
  );
  assert.match(contract.visualInstanceOracles?.[0]?.packageMapping?.join(" ") ?? "", /ProductShell ProductShellSearch useProductShellController/);
  assert.match(contract.visualInstanceOracles?.[0]?.negativeCriteria?.join(" ") ?? "", /no raw API\/debug payload as primary UX/);
  const ownerQualityOracle = contract.visualInstanceOracles?.find((oracle: { id?: string }) => oracle.id === "aos-owner-quality-product-shell");
  assert.equal(ownerQualityOracle?.name, "AosOwnerQualityProductShell");
  assert.equal(ownerQualityOracle?.route, "components.html#aos-owner-quality-product-shell");
  assert.equal(ownerQualityOracle?.disposition, "owner_quality_candidate_requires_ds_review_before_product_use");
  assert.equal(ownerQualityOracle?.replacesOwnerQualityTarget, "aos-frontend-shell-slice");
  assert.deepEqual(ownerQualityOracle?.primaryIa, ["Operations Cockpit", "Work queue"]);
  assert.deepEqual(ownerQualityOracle?.requiredVariants, [
    "desktop-light-operations-cockpit",
    "desktop-light-operations-cockpit-collapsed",
    "desktop-dark-operations-cockpit",
    "desktop-dark-operations-cockpit-collapsed",
    "desktop-light-work-queue",
    "desktop-light-work-queue-collapsed",
    "mobile-dark-zh-cn-work-queue",
    "desktop-light-operations-search-results",
    "reduced-motion"
  ]);
  assert.equal(ownerQualityOracle?.requiredVariantFixtures?.length, 9);
  assert.equal(
    ownerQualityOracle?.requiredVariantFixtures?.[0]?.selector,
    "[data-storybook-visual-instance=\"aos-owner-quality-product-shell\"][data-visual-instance-variant=\"desktop-light-operations-cockpit\"]"
  );
  assert.equal(ownerQualityOracle?.requiredVariantFixtures?.[0]?.expectedState?.search, "rest");
  assert.equal(ownerQualityOracle?.requiredVariantFixtures?.[0]?.expectedState?.searchExpanded, false);
  assert.equal(ownerQualityOracle?.requiredVariantFixtures?.[1]?.expectedState?.collapsed, true);
  assert.equal(ownerQualityOracle?.requiredVariantFixtures?.[1]?.expectedState?.selectedRoute, "cockpit");
  assert.equal(ownerQualityOracle?.requiredVariantFixtures?.[3]?.expectedState?.collapsed, true);
  assert.equal(ownerQualityOracle?.requiredVariantFixtures?.[5]?.expectedState?.collapsed, true);
  assert.equal(ownerQualityOracle?.requiredVariantFixtures?.[5]?.expectedState?.selectedRoute, "work");
  assert.equal(ownerQualityOracle?.requiredVariantFixtures?.[7]?.expectedState?.search, "results");
  assert.equal(ownerQualityOracle?.requiredVariantFixtures?.[7]?.expectedState?.searchExpanded, true);
  assert.equal(ownerQualityOracle?.requiredVariantFixtures?.[6]?.expectedState?.locale, "zh-CN");
  assert.match(ownerQualityOracle?.requiredVariantFixtures?.[6]?.requiredText?.join(" ") ?? "", /工作项/);
  assert.match(ownerQualityOracle?.requiredVariantFixtures?.[6]?.requiredText?.join(" ") ?? "", /需要评审/);
  assert.match(ownerQualityOracle?.requiredVariantFixtures?.[6]?.forbiddenText?.join(" ") ?? "", /Unknown/);
  assert.match(ownerQualityOracle?.requiredVariantFixtures?.[6]?.forbiddenText?.join(" ") ?? "", /Local proof only/);
  assert.equal(ownerQualityOracle?.requiredVariantFixtures?.[8]?.expectedState?.reducedMotion, true);
  assert.match(ownerQualityOracle?.packageMapping?.join(" ") ?? "", /ProductShell ProductShellSearch useProductShellController/);
  assert.match(ownerQualityOracle?.packageMapping?.join(" ") ?? "", /ProductLogo tcrnProductLogoRegistry/);
  assert.match(ownerQualityOracle?.packageMapping?.join(" ") ?? "", /Surface WorkIndex TableShell KeyValueList/);
  assert.match(ownerQualityOracle?.ownerQualityAcceptanceCriteria?.join(" ") ?? "", /AOS Operations Cockpit/);
  assert.match(ownerQualityOracle?.ownerQualityAcceptanceCriteria?.join(" ") ?? "", /registered TCRN AOS product identity/);
  assert.doesNotMatch(ownerQualityOracle?.ownerQualityAcceptanceCriteria?.join(" ") ?? "", /AOS Rebuild Workspace/);
  assert.match(ownerQualityOracle?.ownerQualityAcceptanceCriteria?.join(" ") ?? "", /exactly one primary H1/);
  assert.match(ownerQualityOracle?.ownerQualityAcceptanceCriteria?.join(" ") ?? "", /zh-CN owner-quality fixtures localize/);
  assert.match(ownerQualityOracle?.ownerQualityAcceptanceCriteria?.join(" ") ?? "", /topbar controls stay within/);
  assert.match(ownerQualityOracle?.rejectCriteria?.join(" ") ?? "", /Dummy Cockpit/);
  assert.match(ownerQualityOracle?.rejectCriteria?.join(" ") ?? "", /implementation\/proof\/debug terminology/);
  assert.match(ownerQualityOracle?.rejectCriteria?.join(" ") ?? "", /root\/topbar horizontal overflow/);
  assert.match(ownerQualityOracle?.delegatedSubOracles?.join(" ") ?? "", /actionable desktop side-nav collapse\/expand behavior/);
  assert.equal(ownerQualityOracle?.ownerQualitySideNavPolicy?.expandedOnly, false);
  assert.equal(ownerQualityOracle?.ownerQualitySideNavPolicy?.collapseAffordance, "actionable_toggle");
  assert.equal(ownerQualityOracle?.ownerQualitySideNavPolicy?.iconCenterDeltaMaxPx, 1);
  assert.deepEqual(ownerQualityOracle?.ownerQualitySideNavPolicy?.admittedCollapsedVariants, [
    "desktop-light-operations-cockpit-collapsed",
    "desktop-dark-operations-cockpit-collapsed",
    "desktop-light-work-queue-collapsed"
  ]);
  assert.equal(ownerQualityOracle?.ownerVisualAdmissionBoundary, "internal_ds_oracle_review_required_before_owner_visual_admission");
  assert.match(ownerQualityOracle?.negativeCriteria?.join(" ") ?? "", /no proof-scaffold headline as Level 1 content/);
  assert.match(requiredStorybookSectionChecklist.find((section) => section.section === "Style Guide")?.consumerChecks.join(" ") ?? "", /motion\/effect parity/);
  assert.match(requiredStorybookSectionChecklist.find((section) => section.section === "Components")?.consumerChecks.join(" ") ?? "", /same Storybook visual instance/);
  assert.match(requiredStorybookSectionChecklist.find((section) => section.section === "Patterns")?.consumerChecks.join(" ") ?? "", /information hierarchy, density, mobile reflow/);
  assert.deepEqual(contract.supportedThemeModes, ["light", "dark"]);
  assert.match(contract.productLogoRegistry?.map((logo: { assetId: string }) => logo.assetId).join(" ") ?? "", /tcrn-aos-two-line/);
  assert.match(contract.productLogoRegistry?.map((logo: { lineTwo: string }) => logo.lineTwo).join(" ") ?? "", /AI Operation System/);
  assert.equal(contract.productLogoRegistry?.find((logo: { productId: string }) => logo.productId === "design-system")?.stackSuffix, true);
  assert.match(contract.brandSurfaceDisposition, /ProductLogo and tcrnProductLogoRegistry are registered @tcrn\/ui-react exports/);
  assert.match(contract.brandSurfaceDisposition, /TCRN stays regular weight/);
  assert.match(contract.brandSurfaceDisposition, /long suffixes such as Design System must stack under TCRN/);
  assert.match(contract.brandSurfaceDisposition, /deprecated or unregistered AOS wordmark image assets are forbidden/);
  assert.match(contract.brandSurfaceDisposition, /Generic icons, text-only substitutes, and deprecated or unregistered AOS wordmark image assets are forbidden product shell inputs/);
  assert.match(contract.i18nDisposition, /approved locale and copy-state contract/);
  assert.match(contract.componentConsumptionDisposition, /ShellThemeToggle, ShellLocaleMenu, SideNavCollapseButton, ProductLogo/);
  assert.match(contract.componentConsumptionDisposition, /ProductShell, TopBar, SideNav/);
  assert.match(contract.componentConsumptionDisposition, /ProductShellSearch is required only when the product exposes a real topbar\/global search surface/);
  assert.match(contract.componentConsumptionDisposition, /must be omitted rather than rendered as an inert placeholder/);
  assert.match(contract.componentConsumptionDisposition, /RelationshipChip, MachineToken, MachineTokenCell, WorkManagementSubnav, WorkPageHeader/);
  assert.match(contract.componentConsumptionDisposition, /WorkItemRow, WorkList, WorkSplitView, WorkBacklogGroup/);
  assert.match(contract.componentConsumptionDisposition, /WorkDetailLayout, MetadataRail, WorkFieldPanel, WorkActivityFeed/);
  assert.match(contract.componentConsumptionDisposition, /KnowledgePageTree, KnowledgeDocumentCanvas, KnowledgeTocRail/);
  assert.match(contract.componentConsumptionDisposition, /KnowledgeVersionHistory, KnowledgeTemplateGallery, and KnowledgeSearchResults/);
  assert.match(contract.componentConsumptionDisposition, /useProductShellController/);
  assert.match(contract.componentConsumptionDisposition, /ProductShell semantic callbacks/);
  assert.match(contract.componentConsumptionDisposition, /productShellControlProps/);
  assert.match(contract.componentConsumptionDisposition, /when search is present, onSearchQueryChange/);
  assert.match(contract.componentConsumptionDisposition, /onSearchResultActivate/);
  assert.match(contract.workManagementPatternDisposition, /static Initiative\/Epic\/Story\/Task or Work Item\/Subtask or Evidence Task presentation/);
  assert.match(contract.workManagementPatternDisposition, /compact route context, local view tabs, quick filters, dense Work item rows\/lists/);
  assert.match(contract.workManagementPatternDisposition, /relationship vocabulary, gate pipelines, evidence attachments, saved view toolbar patterns, work item inspection, and machine-token containment/);
  assert.match(contract.workManagementPatternDisposition, /API integration, backend persistence, live Codex dispatch, external queues, runtime data mutation, AOS\/TMS product adoption, owner acceptance, release readiness, and package publication are not claimed/);
  assert.match(contract.knowledgeManagementPatternDisposition, /static page trees, document canvas, table of contents/);
  assert.match(contract.knowledgeManagementPatternDisposition, /backend publishing, live collaboration, external workspace integration/);
  assert.ok(contract.requiredProof.includes("storybook_doc_shell_package_boundary_receipt"));
  assert.ok(contract.requiredProof.includes("work_management_static_pattern_receipt"));
  assert.match(contract.storybookDocShellAuthorityDisposition, /original Storybook-owned doc shell composition/);
  assert.match(contract.storybookDocShellAuthorityDisposition, /data-doc-shell='online-docs'/);
  assert.match(contract.storybookDocShellAuthorityDisposition, /ProductShell remains documented and package-backed for component examples/);
  assert.doesNotMatch(JSON.stringify(contract), /must render the merged shell through @tcrn\/ui-react ProductShell/);
  assert.doesNotMatch(JSON.stringify(contract), /Shell\/header\/sidebar\/search\/theme\/locale\/collapse behavior remains ProductShell-owned/);
  assert.match(contract.tokenConsumptionDisposition, /Design System tokens/);
  assert.match(contract.themeModeDisposition, /light and dark Storybook shell modes/);
  assert.match(contract.storybookDocShellControlContract.implementationBoundary, /global Storybook shell is a Storybook-owned doc shell/);
  assert.match(contract.storybookDocShellControlContract.implementationBoundary, /data-doc-shell='online-docs'/);
  assert.match(contract.storybookDocShellControlContract.implementationBoundary, /ProductShell selectors must not replace the global page shell/);
  assert.match(contract.storybookDocShellControlContract.themeToggle, /compact circular icon-only theme toggle/);
  assert.match(contract.storybookDocShellControlContract.visualSkin, /internal-alpha\/visual-signature-baseline\.json/);
  assert.match(contract.storybookDocShellControlContract.visualSkin, /doc-shell selector authority/);
  assert.match(contract.storybookDocShellControlContract.themeTransition, /one whole-page transition/);
  assert.match(contract.storybookDocShellControlContract.themeTransition, /must not darken as independent sections/);
  assert.match(contract.storybookDocShellControlContract.localeSelector, /native names only/);
  assert.match(contract.storybookDocShellControlContract.localeSelector, /outside pointer down or click, and Escape/);
  assert.match(contract.storybookDocShellControlContract.localeSelector, /focus returns to the trigger/);
  assert.match(contract.storybookDocShellControlContract.search, /compact at rest/);
  assert.match(contract.storybookDocShellControlContract.aiContractAccess, /not in the human top toolbar/);
  assert.match(contract.productShellHardeningRules.sideNavigation, /keyboard-accessible collapse and expand control/);
  assert.match(contract.productShellHardeningRules.sideNavigation, /center the collapse icon/);
  assert.match(contract.productShellHardeningRules.sideNavigation, /prove both expanded and collapsed states/);
  assert.match(contract.productShellHardeningRules.brandSurface, /registered package-backed ProductLogo assets/);
  assert.match(contract.productShellHardeningRules.registeredNavigation, /must not surface unregistered or planned modules/);
  assert.match(contract.productShellHardeningRules.primitiveConsumption, /registered package-backed primitives from @tcrn\/ui-react/);
  assert.match(contract.productShellHardeningRules.primitiveConsumption, /ProductShell\/useProductShellController/);
  assert.match(contract.productShellHardeningRules.primitiveConsumption, /ProductShellSearch only when a real product topbar\/global search capability is present/);
  assert.match(contract.productShellHardeningRules.primitiveConsumption, /semantic control callbacks/);
  assert.match(contract.productShellHardeningRules.shellEffectBoundary, /attached side-nav shell layout/);
  assert.match(contract.productShellHardeningRules.shellEffectBoundary, /collapsed rail styling/);
  assert.match(contract.productShellHardeningRules.shellEffectBoundary, /must not fork those effects/);
  assert.match(contract.productShellHardeningRules.semanticControlApi, /onCollapsedChange/);
  assert.match(contract.productShellHardeningRules.semanticControlApi, /onSearchDismiss/);
  assert.match(contract.productShellHardeningRules.semanticControlApi, /Wrapper-level event delegation/);
  assert.match(contract.productShellHardeningRules.browserProof, /rather than relying only on static marker checks/);
  assert.deepEqual(contract.forbiddenBrandAssets, [
    "tcrn-aos-wordmark-geometric-dark.png",
    "tcrn-aos-wordmark-geometric-dark-preview.png",
    "tcrn-aos-wordmark-geometric-spec.md",
    "tcrn-aos-wordmark.png",
    "tcrn-aos-wordmark.svg",
    "aos-favicon.png",
    "favicon.ico"
  ]);
  assert.ok(contract.forbiddenClaims.includes("automatic_component_registration"));
  assert.ok(contract.forbiddenClaims.includes("automatic_product_adoption"));
  assert.ok(contract.forbiddenClaims.includes("aos_tms_acceptance"));
  assert.ok(contract.noOverclaimBoundaries.includes("consumer_product_adoption_separate"));
  assert.ok(contract.noOverclaimBoundaries.includes("aos_tms_mutation_not_authorized"));
  const llms = readFileSync(join(process.cwd(), "storybook-static", "llms.txt"), "utf8");
  assert.match(llms, /Agents must read ai-consumption-contract\.json before implementation work\./);
  assert.match(llms, new RegExp(contractPayloadDigest));
  assert.match(llms, /Required readback fields: contractVersion, contractPayloadDigest, artifact, route, readAt, coveredRules, foundationVisualStandards, consumerVisualStyleContract, requiredProof, noOverclaimBoundaries, coveredStorybookSections/);
  assert.match(llms, /Required Storybook sections:/);
  assert.match(llms, /Covered Storybook section\/category\/story hierarchy:/);
  assert.match(llms, /Changelog governance: change-log\.html#local-changelog/);
  assert.match(llms, /Work Management authority: static_contract_authority_explicit_and_smoke_proven/);
  assert.match(llms, /Foundation visual standards: foundation-visual-standards-v1/);
  assert.match(llms, /Foundation visual standard category details:/);
  assert.match(llms, /consumer-enforcement: Consumer enforcement and reject criteria/);
  assert.match(llms, /Consumer visual style contract: consumer-visual-style-contract-v1/);
  assert.match(llms, /Storybook doc shell visual oracle: original-storybook-doc-shell-v1/);
  assert.match(llms, /oracle recovery: TCRN Workflow\/vault\/initiatives\/projects\/TCRN-DESIGN-SYSTEM\/active\/storybook-shell-control-stabilization\/50-implementation-plan\.md#storybook-original-shell-restoration-implementation-plan/);
  assert.match(llms, /baseline classification: owner_declared_original_storybook_doc_shell_standard/);
  assert.match(llms, /Welcome \(index\.html\): welcome-governance, governance-boundaries, maintainers-routing, contribution-model, release-bug-policy/);
  assert.match(llms, /Style Guide \(style-guide\.html\): brand-identity, color-palette, text-styles, grid-system, icons-motion, global-states, copy-creation-rules/);
  assert.match(llms, /Foundations \(foundations\.html\): tokens-copy-state, i18n-theme-contract, foundation-visual-standards, copy-guidelines/);
  assert.match(llms, /Components \(components\.html\): component-family-index, display-primitives-spec, interaction-disclosure-spec, stamp-spec-usage, button-spec-usage, field-spec-usage, navigation-shell-spec, aos-frontend-shell-slice, aos-owner-quality-product-shell, dialog-spec-usage, table-work-index-spec, work-management-components-spec, knowledge-management-components-spec/);
  assert.match(llms, /Patterns \(patterns\.html\): forms-patterns, workbench-patterns, work-management-patterns, readiness-notification-patterns/);
  assert.match(llms, /Visual equivalence levels: same_package_version -> same_exported_component -> same_variant_props_slots -> same_storybook_visual_instance/);
  assert.match(llms, /Package publication, Storybook\/docs publication, product adoption, release readiness, acceptance-state movement, and Owner Intent live dispatch are not claimed here\./);
  const robots = readFileSync(join(process.cwd(), "storybook-static", "robots.txt"), "utf8");
  assert.match(robots, /User-agent: \*/);
  assert.match(robots, /Allow: \//);
  assert.match(robots, /AI-Consumption-Contract: ai-consumption-contract\.json/);
  assert.match(robots, /AI-Consumption-Contract-Required: must-read-first/);
});

test("GitHub README exposes the Storybook AI contract without publication overclaim", () => {
  const readme = readFileSync(join(process.cwd(), "..", "..", "README.md"), "utf8");
  assert.match(readme, /Storybook Contract Docs/);
  assert.match(readme, /AI Consumption Contract/);
  // The README must point a fresh clone at the tracked contract source (the JSON/llms.txt
  // are gitignored build outputs), and name where the build outputs land — without pinning
  // the unbuilt path as if it were present in the repo (TCRN-DS-STORY-043).
  assert.match(readme, /apps\/storybook\/src\/build\/ai-consumption-contract\.ts/);
  assert.match(readme, /gitignored, absent from a fresh clone/);
  assert.match(readme, /apps\/storybook\/storybook-static\//);
  assert.match(readme, /https:\/\/tcrn-design-system-storybook\.vercel\.app\/ai-consumption-contract\.json/);
  assert.match(readme, /llms\.txt/);
  assert.match(readme, /HTML head discovery/);
  assert.match(readme, /contractVersion, contractPayloadDigest, artifact, route, readAt, coveredRules, coveredStorybookSections, requiredProof, noOverclaimBoundaries/);
  assert.match(readme, /must cover every Storybook section/);
  assert.match(readme, /same Storybook visual instance/);
  assert.match(readme, /Supported Locales/);
  assert.match(readme, /`zh-CN`/);
  assert.match(readme, /`ja`/);
  assert.match(readme, /README\.zh-CN\.md/);
  assert.match(readme, /Chinese reader path/);
  assert.match(readme, /\?locale=zh-CN/);
  assert.match(readme, /Theme And Dark Mode/);
  assert.match(readme, /Brand And Logo Boundary/);
  assert.match(readme, /No-Overclaim Boundaries/);
  assert.match(readme, /No npm\/package publication is claimed/);
  assert.doesNotMatch(readme, /package registry publication is complete/i);
  assert.doesNotMatch(readme, /Storybook\/docs publication is complete/i);
  assert.doesNotMatch(readme, /release readiness is claimed/i);
  assert.doesNotMatch(readme, /product adoption is claimed/i);
});
