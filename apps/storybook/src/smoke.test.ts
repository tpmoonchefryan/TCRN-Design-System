import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { tcrnSupportedLocales } from "@tcrn/ui-copy-state";
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
import { contractStories, contractStoryGroups } from "./stories.js";
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
  "copy-guidelines",
  "component-family-index",
  "display-primitives-spec",
  "interaction-disclosure-spec",
  "button-spec-usage",
  "field-spec-usage",
  "navigation-shell-spec",
  "aos-frontend-shell-slice",
  "aos-owner-quality-product-shell",
  "dialog-spec-usage",
  "table-work-index-spec",
  "forms-patterns",
  "workbench-patterns",
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
  "prove_same_storybook_visual_instance_not_only_package_import",
  "use_tcrn_i18n_and_copy_state",
  "use_admitted_brand_asset_or_route_brand_component_admission",
  "use_registered_brand_lockup_components_for_product_suffixes",
  "reject_unregistered_or_deprecated_brand_assets",
  "import_package_backed_ds_primitives",
  "use_design_tokens_and_accessibility_rules",
  "verify_light_and_dark_storybook_theme_contract",
  "verify_motion_effect_parity_and_reduced_motion",
  "preserve_compact_storybook_shell_controls",
  "use_product_shell_semantic_control_api",
  "prove_locale_popup_dismissal_and_focus_return",
  "prove_side_navigation_collapse_state",
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
  "theme_mode_receipt",
  "storybook_shell_control_receipt",
  "locale_popup_dismissal_receipt",
  "side_navigation_collapse_receipt",
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

function groupSlug(group: ContractStoryGroup): string {
  return group.toLowerCase().replace(/\s+/g, "-");
}

function groupFileName(group: ContractStoryGroup): string {
  return group === "Welcome" ? "index.html" : `${groupSlug(group)}.html`;
}

function readGroupPage(group: ContractStoryGroup): string {
  return readFileSync(join(process.cwd(), "storybook-static", groupFileName(group)), "utf8");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function readNavGroupOrder(html: string): string[] {
  return Array.from(html.matchAll(/data-doc-nav-group="([^"]+)"/g), (match) => match[1]);
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
  assert.equal(contractStories.length, 38);
  assert.deepEqual(contractStories.map((story) => story.id), expectedContractStoryIds);
  assert.deepEqual(
    [alphaMeta, styleGuideMeta, foundationsMeta, componentsMeta, patternsMeta, proofMeta, changeLogMeta].map((meta) => meta.title),
    expectedRootAdapterTitles
  );
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
  assert.doesNotMatch(combinedHtml, /data-doc-global-nav="sections"/);
  assert.doesNotMatch(combinedHtml, /data-doc-global-nav-item="/);
  assert.doesNotMatch(combinedHtml, /data-i18n="shell\.topNavLabel"/);
  assert.match(combinedHtml, /data-doc-nav="sections"/);
  assert.match(combinedHtml, /data-doc-chapter-pager="true"/);
  assert.match(combinedHtml, /data-contract-surface="tcrn-design-system-storybook"/);
  assert.match(combinedHtml, /data-anchor-scroll-controlled="true"/);
  assert.match(combinedHtml, /--tcrn-anchor-scroll-offset: 96px/);
  assert.match(combinedHtml, /tcrnStorybookScrollToHash/);
  assert.match(combinedHtml, /tcrnStorybookScrollSpy/);
  assert.match(combinedHtml, /keepActiveLinkVisible/);
  assert.match(combinedHtml, /addEventListener\("scroll", scheduleScrollSpy/);
  assert.match(combinedHtml, /data-i18n-locale-select/);
  assert.match(combinedHtml, /tcrn-doc-global-bar/);
  assert.match(combinedHtml, /tcrn-doc-global-brand/);
  assert.match(combinedHtml, /<link rel="icon" href="tcrn-brand-mark\.svg" type="image\/svg\+xml" \/>/);
  assert.match(combinedHtml, /data-tcrn-doc-shell-component-style="package-backed"/);
  assert.match(combinedHtml, /class="[^"]*tcrn-search-input__control[^"]*tcrn-search-input--compact/);
  assert.match(combinedHtml, /data-doc-search-input/);
  assert.match(combinedHtml, /--tcrn-doc-motion-spring: 0\.5s cubic-bezier\(0\.175, 0\.885, 0\.32, 1\.275\)/);
  assert.match(combinedHtml, /--tcrn-doc-motion-smooth: 0\.4s ease/);
  assert.match(combinedHtml, /--tcrn-doc-theme-crossfade-duration: 0\.4s/);
  assert.match(combinedHtml, /::view-transition-old\(root\)/);
  assert.match(combinedHtml, /::view-transition-new\(root\)/);
  assert.match(combinedHtml, /data-theme-switching/);
  assert.match(combinedHtml, /tcrn-doc-theme-transition-wash/);
  assert.match(combinedHtml, /--tcrn-doc-header-search-resting-width: 180px/);
  assert.match(combinedHtml, /--tcrn-doc-header-search-expanded-width: 320px/);
  assert.match(combinedHtml, /\.tcrn-doc-header__workspace:focus-within,[\s\S]*\.tcrn-doc-header__workspace\[data-search-expanded="true"\] \{[\s\S]*grid-template-columns: minmax\(180px, 1fr\) var\(--tcrn-doc-header-search-expanded-width\)/);
  assert.match(combinedHtml, /@media \(max-width: 760px\)[\s\S]*\.tcrn-doc-header__workspace:focus-within,[\s\S]*\.tcrn-doc-header__workspace\[data-search-expanded="true"\] \{[\s\S]*grid-template-columns: 1fr/);
  assert.match(combinedHtml, /role="combobox"/);
  assert.match(combinedHtml, /aria-controls="tcrn-doc-search-results"/);
  assert.match(combinedHtml, /aria-keyshortcuts="Control\+K Meta\+K"/);
  assert.match(combinedHtml, /data-doc-search-results/);
  assert.match(combinedHtml, /role="listbox"/);
  assert.match(combinedHtml, /data-doc-search-result/);
  assert.match(combinedHtml, /data-storybook-theme="light"/);
  assert.match(combinedHtml, /data-storybook-supported-themes="light,dark"/);
  assert.match(combinedHtml, /data-storybook-theme-toggle/);
  assert.match(combinedHtml, /data-current-theme="light"/);
  assert.match(combinedHtml, /data-storybook-theme-option="dark"/);
  assert.match(combinedHtml, /data-package-backed-shell-control="theme-toggle"/);
  assert.match(combinedHtml, /data-theme-icon="light"[\s\S]*data-icon-name="sun"/);
  assert.match(combinedHtml, /data-theme-icon="dark"[\s\S]*data-icon-name="moon"/);
  assert.match(combinedHtml, /tcrn-doc-header-controls__row/);
  assert.match(combinedHtml, /data-theme-label-key="shell\.themeDarkLabel"/);
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
  assert.doesNotMatch(combinedHtml, /data-doc-shell-icon="ai-contract"/);
  assert.doesNotMatch(combinedHtml, /tcrn-doc-ai-contract-link/);
  assert.doesNotMatch(combinedHtml, /tcrn-doc-header-controls__hint/);
  assert.match(combinedHtml, /event\.key\.toLowerCase\(\) !== "k"/);
  assert.match(combinedHtml, /readItems\(\)\.filter/);
  assert.match(combinedHtml, /querySelector\("\.tcrn-doc-nav__section-label"\)/);
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
  assert.match(combinedHtml, /data-doc-shell-icon="current-location-separator"/);
  assert.match(combinedHtml, /data-package-backed-shell-control="side-nav-collapse"/);
  assert.match(combinedHtml, /data-side-nav-icon="collapse"[\s\S]*data-icon-name="chevron-left"/);
  assert.match(combinedHtml, /data-side-nav-icon="expand"[\s\S]*data-icon-name="chevron-right"/);
  assert.match(combinedHtml, /data-doc-shell-icon="previous-chapter"/);
  assert.match(combinedHtml, /data-doc-shell-icon="next-chapter"/);
  assert.match(combinedHtml, /@property --tcrn-doc-shell-side-width/);
  assert.match(combinedHtml, /@keyframes tcrn-doc-sidebar-copy-reveal/);
  assert.match(combinedHtml, /@keyframes tcrn-doc-nav-label-reveal/);
  assert.match(combinedHtml, /@keyframes tcrn-doc-nav-abbr-release/);
  assert.match(combinedHtml, /@keyframes tcrn-doc-nav-stories-fold/);
  assert.match(combinedHtml, /@keyframes tcrn-doc-nav-stories-unfold/);
  assert.match(combinedHtml, /data-sidebar-motion/);
  assert.match(combinedHtml, /setCollapsed\(readStoredState\(\), false, false\)/);
  assert.match(combinedHtml, /\.tcrn-doc-shell \{[\s\S]*--tcrn-doc-shell-side-width var\(--tcrn-motion-emphasis\)/);
  assert.match(combinedHtml, /\.tcrn-doc-global-bar[\s\S]*transition: grid-template-columns var\(--tcrn-motion-emphasis\)/);
  assert.match(combinedHtml, /\.tcrn-doc-layout[\s\S]*transition: grid-template-columns var\(--tcrn-motion-emphasis\)/);
  assert.match(combinedHtml, /\.tcrn-doc-nav__stories[\s\S]*max-height var\(--tcrn-motion-emphasis\)/);
  assert.match(combinedHtml, /\.tcrn-doc-brand \.tcrn-shell-brand-lockup__copy,[\s\S]*white-space: nowrap/);
  assert.match(combinedHtml, /\.tcrn-doc-nav__section,[\s\S]*white-space: nowrap/);
  assert.match(combinedHtml, /tcrn-doc-nav__section-label/);
  assert.match(combinedHtml, /tcrn-doc-nav__section-abbr/);
  assert.match(combinedHtml, /data-sidebar-motion="collapsing"[\s\S]*\.tcrn-doc-nav__section-label[\s\S]*scale\(0\.78\)/);
  assert.match(combinedHtml, /data-sidebar-motion="collapsing"[\s\S]*animation: tcrn-doc-nav-stories-fold var\(--tcrn-motion-emphasis\) both/);
  assert.match(combinedHtml, /data-sidebar-motion="collapsing"[\s\S]*\.tcrn-doc-nav__stories[\s\S]*visibility: visible/);
  assert.match(combinedHtml, /data-sidebar-motion="expanding"[\s\S]*animation: tcrn-doc-sidebar-copy-reveal var\(--tcrn-motion-emphasis\) both/);
  assert.match(combinedHtml, /data-sidebar-motion="expanding"[\s\S]*\.tcrn-doc-nav__section-label[\s\S]*animation: tcrn-doc-nav-label-reveal var\(--tcrn-motion-emphasis\) both/);
  assert.match(combinedHtml, /data-sidebar-motion="expanding"[\s\S]*\.tcrn-doc-nav__section-abbr[\s\S]*animation: tcrn-doc-nav-abbr-release var\(--tcrn-motion-emphasis\) both/);
  assert.match(combinedHtml, /data-sidebar-motion="expanding"[\s\S]*animation: tcrn-doc-nav-stories-unfold var\(--tcrn-motion-emphasis\) both/);
  assert.match(combinedHtml, /data-sidebar-motion="expanding"[\s\S]*\.tcrn-doc-nav__stories[\s\S]*visibility: visible/);
  assert.doesNotMatch(combinedHtml, /tcrn-doc-nav__section::after[\s\S]*content: attr\(data-nav-abbr\)/);
  assert.doesNotMatch(combinedHtml, /font-size var\(--tcrn-motion-emphasis\)/);
  assert.doesNotMatch(combinedHtml, /max-width var\(--tcrn-motion-emphasis\)/);
  assert.doesNotMatch(combinedHtml, /data-sidebar-collapsed="true"\] \.tcrn-doc-nav__stories \{[^}]*display: none/);
  assert.match(combinedHtml, /data-side-nav-icon="collapse"[\s\S]*data-icon-name="chevron-left"/);
  assert.match(combinedHtml, /data-side-nav-icon="expand"[\s\S]*data-icon-name="chevron-right"/);
  assert.match(combinedHtml, /data-icon-name="chevron-right"/);
  assert.doesNotMatch(combinedHtml, /viewBox="0 0 20 20" focusable="false" aria-hidden="true"/);
  assert.doesNotMatch(combinedHtml, /tcrn-doc-sidebar-toggle__icon::before/);
  assert.doesNotMatch(combinedHtml, /tcrn-knowledge-shell__collapse-button span::before/);
  assert.match(combinedHtml, /tcrn-doc-sidebar__label/);
  assert.match(combinedHtml, /<header class="tcrn-doc-header">/);
  assert.match(combinedHtml, /\.tcrn-doc-shell \{[\s\S]*padding: var\(--tcrn-anchor-scroll-offset\) 0 0/);
  assert.match(combinedHtml, /\.tcrn-doc-header \{[\s\S]*position: fixed/);
  assert.match(combinedHtml, /<main class="tcrn-doc-content" id="content">/);
  assert.match(combinedHtml, /tcrn-doc-page-head/);
  assert.doesNotMatch(combinedHtml, /<main class="tcrn-doc-shell"/);
  assert.match(combinedHtml, /data-storybook-locale="en"/);
  assert.match(combinedHtml, new RegExp(`data-storybook-supported-locales="${tcrnSupportedLocales.join(",")}"`));
  assert.match(combinedHtml, /data-tcrn-theme="light"/);
  assert.match(combinedHtml, /data-storybook-theme="light"/);
  assert.match(combinedHtml, /data-storybook-supported-themes="light,dark"/);
  assert.match(combinedHtml, /data-storybook-theme-control/);
  assert.match(combinedHtml, /data-storybook-theme-toggle/);
  assert.match(combinedHtml, /data-current-theme="light"/);
  assert.match(combinedHtml, /data-storybook-theme-option="dark"/);
  assert.doesNotMatch(combinedHtml, /tcrn-doc-theme-toggle/);
  assert.doesNotMatch(combinedHtml, /tcrn-doc-locale-toggle/);
  assert.doesNotMatch(combinedHtml, /tcrn-doc-locale-menu__/);
  assert.doesNotMatch(combinedHtml, /tcrn-doc-sidebar-toggle__/);
  assert.doesNotMatch(combinedHtml, /class="[^"]*tcrn-doc-search-result/);
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
    assert.match(html, new RegExp(`data-story-nav="${escapeRegExp(group)}" aria-current="page"`));
    assert.ok(defaultStory);
    assert.match(html, new RegExp(`data-doc-nav-item="${escapeRegExp(defaultStory.id)}" aria-current="location" data-doc-nav-item-active="true"`));
    assert.deepEqual(readNavGroupOrder(html), contractStoryGroups);
    assert.equal(html.match(/data-doc-nav-group="/g)?.length, contractStoryGroups.length);
    assert.equal(html.match(/data-doc-nav-item="/g)?.length, contractStories.length);
    assert.equal(html.match(/data-doc-chapter-pager="true"/g)?.length, 1);
    assert.equal(html.match(/<a [^>]*data-doc-nav-item-active="true"/g)?.length, 1);
    assert.equal(html.match(/<a [^>]*aria-current="location"/g)?.length, 1);
    assert.equal(html.match(/data-story-section="/g)?.length, 1);
  }
  assert.match(readGroupPage("Welcome"), /Welcome and governance/);
  assert.match(readGroupPage("Welcome"), /Maintainers and routing/);
  assert.match(readGroupPage("Style Guide"), /Brand identity/);
  assert.match(readGroupPage("Style Guide"), /Logo construction rules/);
  assert.match(readGroupPage("Style Guide"), /src="tcrn-brand-mark\.svg"/);
  assert.match(readGroupPage("Style Guide"), /tcrn-brand-lockup--long-name/);
  assert.match(readGroupPage("Style Guide"), /tcrn-brand-wordmark__suffix--design-system/);
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
  assert.match(readGroupPage("Components"), /TcrnBrandMark, ProductLockup, ShellBrandLockup/);
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
  assert.match(readGroupPage("Style Guide"), /data-package-backed-brand-lockup="product"/);
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
  assert.doesNotMatch(readGroupPage("Patterns"), /data-story-id="aos-operations-cockpit-standard"/);
  assert.doesNotMatch(readGroupPage("Patterns"), /data-story-id="aos-docs-readiness-standard"/);
  assert.doesNotMatch(readGroupPage("Patterns"), /data-story-id="aos-product-design-target-set-standard"/);
  assert.doesNotMatch(readGroupPage("Patterns"), /data-aos-served-surface-standard=/);
  assert.doesNotMatch(readGroupPage("Patterns"), /data-aos-component-registration="registered"/);
  assert.doesNotMatch(readGroupPage("Patterns"), /data-aos-disabled-reason-standard="all-controls"/);
  assert.doesNotMatch(readGroupPage("Patterns"), /data-aos-exception-record="brand-lockup-product-specific"/);
  assert.doesNotMatch(readGroupPage("Patterns"), /AOS brand treatment exception/);
  assert.match(readGroupPage("Foundations"), /Copy guidelines/);
  assert.match(readGroupPage("Foundations"), /Docs shell control contract/);
  assert.match(readGroupPage("Foundations"), /Use one circular icon-only button/);
  assert.match(readGroupPage("Foundations"), /Keep Storybook-specific page skeleton/);
  assert.match(readGroupPage("Foundations"), /consume reusable controls from @tcrn\/ui-react/);
  assert.match(readGroupPage("Foundations"), /Private documentation-shell clones of theme toggle, locale menu, search results, side-nav collapse, or brand lockup components/);
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
  assert.match(readGroupPage("Proof"), /ai-consumption-contract\.json/);
  assert.match(readGroupPage("Proof"), /Light and dark Storybook shell/);
  assert.match(readGroupPage("Proof"), /Check both light and dark Storybook shell modes before product frontend work/);
  assert.match(readGroupPage("Proof"), /Storybook shell controls/);
  assert.match(readGroupPage("Proof"), /single icon theme toggle, native-name locale menu, focus-expanded search, no AI JSON link in the top bar, and one whole-page theme transition/);
  assert.match(readGroupPage("Proof"), /Storybook doc shell boundary/);
  assert.match(readGroupPage("Proof"), /Storybook page skeleton may keep \.tcrn-doc-\* layout slots/);
  assert.match(readGroupPage("Proof"), /SearchInput, ShellBrandLockup, ShellThemeToggle, ShellLocaleMenu, SideNavCollapseButton, ProductShell comparator CSS/);
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
    "desktop-dark-operations-cockpit",
    "desktop-light-work-queue",
    "mobile-dark-zh-cn-work-queue",
    "desktop-light-operations-search-results",
    "reduced-motion"
  ]);
  assert.equal(ownerQualityOracle?.requiredVariantFixtures?.length, 6);
  assert.equal(
    ownerQualityOracle?.requiredVariantFixtures?.[0]?.selector,
    "[data-storybook-visual-instance=\"aos-owner-quality-product-shell\"][data-visual-instance-variant=\"desktop-light-operations-cockpit\"]"
  );
  assert.equal(ownerQualityOracle?.requiredVariantFixtures?.[0]?.expectedState?.search, "rest");
  assert.equal(ownerQualityOracle?.requiredVariantFixtures?.[0]?.expectedState?.searchExpanded, false);
  assert.equal(ownerQualityOracle?.requiredVariantFixtures?.[4]?.expectedState?.search, "results");
  assert.equal(ownerQualityOracle?.requiredVariantFixtures?.[4]?.expectedState?.searchExpanded, true);
  assert.equal(ownerQualityOracle?.requiredVariantFixtures?.[3]?.expectedState?.locale, "zh-CN");
  assert.match(ownerQualityOracle?.requiredVariantFixtures?.[3]?.requiredText?.join(" ") ?? "", /工作项/);
  assert.match(ownerQualityOracle?.requiredVariantFixtures?.[3]?.requiredText?.join(" ") ?? "", /需要评审/);
  assert.match(ownerQualityOracle?.requiredVariantFixtures?.[3]?.forbiddenText?.join(" ") ?? "", /Unknown/);
  assert.match(ownerQualityOracle?.requiredVariantFixtures?.[3]?.forbiddenText?.join(" ") ?? "", /Local proof only/);
  assert.equal(ownerQualityOracle?.requiredVariantFixtures?.[5]?.expectedState?.reducedMotion, true);
  assert.match(ownerQualityOracle?.packageMapping?.join(" ") ?? "", /ProductShell ProductShellSearch useProductShellController/);
  assert.match(ownerQualityOracle?.packageMapping?.join(" ") ?? "", /Surface WorkIndex TableShell KeyValueList/);
  assert.match(ownerQualityOracle?.ownerQualityAcceptanceCriteria?.join(" ") ?? "", /AOS Operations Cockpit/);
  assert.match(ownerQualityOracle?.ownerQualityAcceptanceCriteria?.join(" ") ?? "", /exactly one primary H1/);
  assert.match(ownerQualityOracle?.ownerQualityAcceptanceCriteria?.join(" ") ?? "", /zh-CN owner-quality fixtures localize/);
  assert.match(ownerQualityOracle?.ownerQualityAcceptanceCriteria?.join(" ") ?? "", /topbar controls stay within/);
  assert.match(ownerQualityOracle?.rejectCriteria?.join(" ") ?? "", /Dummy Cockpit/);
  assert.match(ownerQualityOracle?.rejectCriteria?.join(" ") ?? "", /implementation\/proof\/debug terminology/);
  assert.match(ownerQualityOracle?.rejectCriteria?.join(" ") ?? "", /root\/topbar horizontal overflow/);
  assert.match(ownerQualityOracle?.delegatedSubOracles?.join(" ") ?? "", /ProductShell owns side-nav collapse/);
  assert.equal(ownerQualityOracle?.ownerVisualAdmissionBoundary, "internal_ds_oracle_review_required_before_owner_visual_admission");
  assert.match(ownerQualityOracle?.negativeCriteria?.join(" ") ?? "", /no proof-scaffold headline as Level 1 content/);
  assert.match(requiredStorybookSectionChecklist.find((section) => section.section === "Style Guide")?.consumerChecks.join(" ") ?? "", /motion\/effect parity/);
  assert.match(requiredStorybookSectionChecklist.find((section) => section.section === "Components")?.consumerChecks.join(" ") ?? "", /same Storybook visual instance/);
  assert.match(requiredStorybookSectionChecklist.find((section) => section.section === "Patterns")?.consumerChecks.join(" ") ?? "", /information hierarchy, density, mobile reflow/);
  assert.deepEqual(contract.supportedThemeModes, ["light", "dark"]);
  assert.match(contract.brandSurfaceDisposition, /TcrnBrandMark, ProductLockup, and ShellBrandLockup are registered @tcrn\/ui-react exports/);
  assert.match(contract.brandSurfaceDisposition, /Deprecated or unregistered AOS wordmark image assets are forbidden/);
  assert.match(contract.brandSurfaceDisposition, /Generic icons or text-only substitutes are not brand marks/);
  assert.match(contract.i18nDisposition, /approved locale and copy-state contract/);
  assert.match(contract.componentConsumptionDisposition, /ShellThemeToggle, ShellLocaleMenu, SideNavCollapseButton, brand lockups/);
  assert.match(contract.componentConsumptionDisposition, /ProductShell, ProductShellSearch/);
  assert.match(contract.componentConsumptionDisposition, /useProductShellController/);
  assert.match(contract.componentConsumptionDisposition, /ProductShell semantic callbacks/);
  assert.match(contract.componentConsumptionDisposition, /productShellControlProps/);
  assert.match(contract.componentConsumptionDisposition, /onSearchResultActivate/);
  assert.ok(contract.requiredProof.includes("storybook_doc_shell_package_boundary_receipt"));
  assert.match(contract.storybookDocShellCompositionDisposition, /may retain page skeleton, routing, section navigation/);
  assert.match(contract.storybookDocShellCompositionDisposition, /Reusable controls, component visuals, icons, brand lockups, shell search, theme toggle, locale menu, side-navigation collapse/);
  assert.match(contract.storybookDocShellCompositionDisposition, /must come from registered @tcrn\/ui-react exports and package CSS/);
  assert.match(contract.storybookDocShellCompositionDisposition, /must not keep private component clones/);
  assert.match(contract.tokenConsumptionDisposition, /Design System tokens/);
  assert.match(contract.themeModeDisposition, /light and dark Storybook shell modes/);
  assert.match(contract.storybookShellControlContract.implementationBoundary, /consumer of @tcrn\/ui-react/);
  assert.match(contract.storybookShellControlContract.implementationBoundary, /SearchInput, ShellBrandLockup, ShellThemeToggle, ShellLocaleMenu, SideNavCollapseButton/);
  assert.match(contract.storybookShellControlContract.implementationBoundary, /\.tcrn-doc-\* selectors may style only documentation skeleton/);
  assert.match(contract.storybookShellControlContract.themeToggle, /compact circular icon-only theme toggle/);
  assert.match(contract.storybookShellControlContract.themeTransition, /one whole-page transition/);
  assert.match(contract.storybookShellControlContract.themeTransition, /must not darken as independent sections/);
  assert.match(contract.storybookShellControlContract.localeSelector, /native names only/);
  assert.match(contract.storybookShellControlContract.localeSelector, /outside pointer down or click, and Escape/);
  assert.match(contract.storybookShellControlContract.localeSelector, /focus returns to the trigger/);
  assert.match(contract.storybookShellControlContract.search, /compact at rest/);
  assert.match(contract.storybookShellControlContract.aiContractAccess, /not in the human top toolbar/);
  assert.match(contract.productShellHardeningRules.sideNavigation, /keyboard-accessible collapse and expand control/);
  assert.match(contract.productShellHardeningRules.sideNavigation, /prove both expanded and collapsed states/);
  assert.match(contract.productShellHardeningRules.brandSurface, /deprecated AOS wordmark images are not accepted brand marks/);
  assert.match(contract.productShellHardeningRules.registeredNavigation, /must not surface unregistered or planned modules/);
  assert.match(contract.productShellHardeningRules.primitiveConsumption, /registered package-backed primitives from @tcrn\/ui-react/);
  assert.match(contract.productShellHardeningRules.primitiveConsumption, /ProductShell\/ProductShellSearch\/useProductShellController/);
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
  assert.match(llms, /Required readback fields: contractVersion, contractPayloadDigest, artifact, route, readAt, coveredRules, requiredProof, noOverclaimBoundaries, coveredStorybookSections/);
  assert.match(llms, /Required Storybook sections:/);
  assert.match(llms, /Welcome \(index\.html\): welcome-governance, governance-boundaries, maintainers-routing, contribution-model, release-bug-policy/);
  assert.match(llms, /Style Guide \(style-guide\.html\): brand-identity, color-palette, text-styles, grid-system, icons-motion, global-states, copy-creation-rules/);
  assert.match(llms, /Components \(components\.html\): component-family-index, display-primitives-spec, interaction-disclosure-spec, button-spec-usage, field-spec-usage, navigation-shell-spec, aos-frontend-shell-slice, aos-owner-quality-product-shell, dialog-spec-usage, table-work-index-spec/);
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
  assert.match(readme, /apps\/storybook\/storybook-static\/ai-consumption-contract\.json/);
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
