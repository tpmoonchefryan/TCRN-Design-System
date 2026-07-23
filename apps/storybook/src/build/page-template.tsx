import { renderToStaticMarkup } from "react-dom/server";
import { tcrnDefaultLocale, tcrnLocaleMetadata, tcrnSupportedLocales } from "@tcrn/ui-copy-state";
import {
  Icon,
  SearchInput,
  ShellBrandLockup,
  ShellLocaleMenu,
  ShellThemeToggle,
  SideNavCollapseButton,
  SkipLink,
  tcrnComponentCss,
  type IconName
} from "@tcrn/ui-react";
import { DialogSpecFixture, contractStoriesByGroup, contractStoryGroups } from "../stories.js";
import type { ContractStoryGroup } from "../stories.js";
import { alphaStoryCss } from "../alpha-styles.js";
import {
  activeStoryNavScript,
  anchorScrollScript,
  dialogFixtureScript,
  hashRouteScript,
  sidebarToggleScript,
  storyDisclosureScript,
  tableToolbarScript,
  storybookI18nScript,
  storybookThemeScript,
  storybookSearchScript
} from "./client-scripts.js";
import { escapeHtml, i18nText, localeText } from "./i18n.js";
import { categoryDomId, groupFileName, groupSlug, navAbbreviations, storyCategoriesForGroup } from "./navigation.js";

const navGroupIcons: Record<ContractStoryGroup, IconName> = {
  Welcome: "home",
  "Style Guide": "palette",
  Foundations: "layers",
  Components: "package",
  Patterns: "layout-grid",
  Proof: "shield-check",
  "Change Log": "history"
};

function iconHtml(name: IconName, className: string, dataDocShellIcon: string): string {
  return renderToStaticMarkup(
    <Icon name={name} className={className} data-doc-shell-icon={dataDocShellIcon} />
  );
}

function scopeComponentSelector(selector: string, scope: string): string {
  const trimmed = selector.trim();
  if (!trimmed) return trimmed;
  if (trimmed === ":root") return scope;
  if (trimmed.startsWith("html[data-tcrn-theme")) {
    return trimmed.replace(/^(html\[[^\]]+\])\s*/, `$1 ${scope} `);
  }
  if (trimmed.startsWith("[data-tcrn-theme")) {
    const pageThemeSelector = trimmed.replace(/^(\[[^\]]+\])\s*/, `$1 ${scope} `);
    return `${pageThemeSelector},\n${scope} ${trimmed}`;
  }
  return `${scope} ${trimmed}`;
}

function scopeComponentCss(css: string, scope: string): string {
  const lines = css.split("\n");
  const output: string[] = [];
  const selectorBuffer: string[] = [];
  const blockStack: Array<"rule" | "media" | "keyframes" | "property"> = [];
  const insideRule = () => blockStack[blockStack.length - 1] === "rule";
  const insideKeyframes = () => blockStack.includes("keyframes");
  const popBlock = () => {
    blockStack.pop();
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      output.push(line);
      continue;
    }

    if (selectorBuffer.length > 0 && !trimmed.includes("{")) {
      selectorBuffer.push(line);
      continue;
    }

    if (insideKeyframes()) {
      output.push(line);
      if (trimmed === "}") popBlock();
      continue;
    }

    if (trimmed.startsWith("@keyframes")) {
      output.push(line);
      blockStack.push("keyframes");
      continue;
    }

    if (trimmed.startsWith("@property")) {
      output.push(line);
      blockStack.push("property");
      continue;
    }

    if (trimmed.startsWith("@media") || trimmed.startsWith("@supports")) {
      output.push(line);
      blockStack.push("media");
      continue;
    }

    if (insideRule() || blockStack[blockStack.length - 1] === "property") {
      output.push(line);
      if (trimmed === "}") popBlock();
      continue;
    }

    if (trimmed.endsWith(",") && !trimmed.includes("{")) {
      selectorBuffer.push(line);
      continue;
    }

    if (trimmed.includes("{")) {
      const braceIndex = line.indexOf("{");
      const selectorText = [...selectorBuffer, line.slice(0, braceIndex)].join("\n");
      selectorBuffer.length = 0;
      const scopedSelector = selectorText
        .split(",")
        .map((selector) => scopeComponentSelector(selector, scope))
        .join(",\n");
      output.push(`${scopedSelector}${line.slice(braceIndex)}`);
      blockStack.push("rule");
      continue;
    }

    output.push(line);
    if (trimmed === "}") popBlock();
  }

  return output.join("\n");
}

const staticStoryComponentCss = scopeComponentCss(tcrnComponentCss, ".story-body");

function skipLinkHtml(): string {
  return renderToStaticMarkup(
    <SkipLink className="tcrn-doc-skip" href="#content" aria-label={localeText("shell.skip")}>
      {localeText("shell.skip")}
    </SkipLink>
  );
}

function docBrandHtml(): string {
  return renderToStaticMarkup(
    <a className="tcrn-doc-brand" href="index.html" data-doc-brand-link="true">
      <ShellBrandLockup
        productId="design-system"
        brandMarkSrc="tcrn-brand-mark.svg"
        brandMarkAlt={localeText("shell.brand")}
      />
    </a>
  );
}

function sidebarToggleHtml(): string {
  return `<span class="tcrn-doc-sidebar-toggle-slot">${renderToStaticMarkup(
    <SideNavCollapseButton
      collapsed={false}
      controls="tcrn-doc-sidebar"
      expandedLabel={localeText("shell.collapseNavigationLabel")}
      collapsedLabel={localeText("shell.expandNavigationLabel")}
      data-doc-sidebar-toggle
      data-expanded-label={localeText("shell.collapseNavigationLabel")}
      data-collapsed-label={localeText("shell.expandNavigationLabel")}
    />
  )}</span>`;
}

function navHtml(activeGroup: ContractStoryGroup): string {
  return `<nav class="tcrn-doc-nav" aria-label="${escapeHtml(localeText("shell.topNavLabel"))}" data-i18n-aria-label="shell.topNavLabel" data-doc-nav="sections">
  <ol class="tcrn-doc-nav__groups">
${contractStoryGroups.map((group) => {
  const current = group === activeGroup ? " aria-current=\"page\"" : "";
  const stories = contractStoriesByGroup(group);
  const categories = storyCategoriesForGroup(group, stories);
  const activeStory = group === activeGroup ? stories[0] : null;
  const activeCategoryId = activeStory?.categoryId ?? categories[0]?.id ?? "";
  const groupLabel = i18nText(`group.${group}`);
  const groupAbbr = escapeHtml(navAbbreviations[group]);
  return `    <li class="tcrn-doc-nav__group" data-doc-nav-group="${group}">
      <a class="tcrn-doc-nav__section" href="${groupFileName(group)}" data-story-nav="${group}"${current} data-nav-abbr="${groupAbbr}">
        <span class="tcrn-doc-nav__section-label">${groupLabel}</span>
        <span class="tcrn-doc-nav__section-icon" aria-hidden="true">${iconHtml(navGroupIcons[group], "tcrn-doc-nav__section-icon-svg", "nav-group")}</span>
        <span class="tcrn-doc-nav__section-abbr" aria-hidden="true">${groupAbbr}</span>
      </a>
      <ol class="tcrn-doc-nav__categories" aria-label="${escapeHtml(`${localeText(`group.${group}`)} ${localeText("shell.categoriesLabel")}`)}">
${categories.map((category) => {
  const open = group === activeGroup && category.id === activeCategoryId;
  const listId = categoryDomId(group, category.id);
  const categoryLabel = localeText(category.label);
  const categoryDescriptionId = `${listId}-description`;
  return `        <li class="tcrn-doc-nav__category" data-doc-nav-category="${escapeHtml(category.id)}" data-doc-nav-category-open="${open ? "true" : "false"}">
          <button class="tcrn-doc-nav__category-toggle" type="button" aria-expanded="${open ? "true" : "false"}" aria-controls="${listId}" aria-describedby="${categoryDescriptionId}" data-doc-nav-category-toggle="${escapeHtml(category.id)}">
            <span class="tcrn-doc-nav__category-label" data-i18n="${escapeHtml(category.label)}">${escapeHtml(categoryLabel)}</span>
            <span class="tcrn-doc-nav__category-count" aria-label="${category.stories.length} ${escapeHtml(localeText("shell.storiesCountLabel"))}">${category.stories.length}</span>
          </button>
          <span class="tcrn-sr-only" id="${categoryDescriptionId}" data-i18n="${escapeHtml(category.description)}">${escapeHtml(localeText(category.description))}</span>
          <ol class="tcrn-doc-nav__stories" id="${listId}" aria-label="${escapeHtml(categoryLabel)}" data-i18n-aria-label="${escapeHtml(category.label)}"${open ? "" : " hidden"}>
${category.stories.map((story, index) => {
  const href = `${groupFileName(story.group)}#${story.id}`;
  const currentStory = group === activeGroup && category.id === activeCategoryId && index === 0 ? " aria-current=\"location\" data-doc-nav-item-active=\"true\"" : "";
  return `            <li><a href="${href}" data-doc-nav-item="${story.id}" data-doc-nav-category-item="${escapeHtml(story.categoryId)}"${currentStory}>${i18nText(`story.${story.id}.title`)}</a></li>`;
}).join("\n")}
          </ol>
        </li>`;
}).join("\n")}
      </ol>
    </li>`;
}).join("\n")}
  </ol>
</nav>`;
}

function chapterPagerHtml(group: ContractStoryGroup): string {
  const groupIndex = contractStoryGroups.indexOf(group);
  const previousGroup = groupIndex > 0 ? contractStoryGroups[groupIndex - 1] : null;
  const nextGroup = groupIndex >= 0 && groupIndex < contractStoryGroups.length - 1 ? contractStoryGroups[groupIndex + 1] : null;
  const previous = previousGroup
    ? `<a class="tcrn-doc-chapter-pager__link tcrn-doc-chapter-pager__link--previous" href="${groupFileName(previousGroup)}">
      ${iconHtml("arrow-left", "tcrn-doc-chapter-pager__icon", "previous-chapter")}
      <span class="tcrn-doc-chapter-pager__eyebrow">${i18nText("shell.previousChapterLabel")}</span>
      <span class="tcrn-doc-chapter-pager__title">${i18nText(`group.${previousGroup}`)}</span>
    </a>`
    : `<span class="tcrn-doc-chapter-pager__placeholder" aria-hidden="true"></span>`;
  const next = nextGroup
    ? `<a class="tcrn-doc-chapter-pager__link tcrn-doc-chapter-pager__link--next" href="${groupFileName(nextGroup)}">
      ${iconHtml("arrow-right", "tcrn-doc-chapter-pager__icon", "next-chapter")}
      <span class="tcrn-doc-chapter-pager__eyebrow">${i18nText("shell.nextChapterLabel")}</span>
      <span class="tcrn-doc-chapter-pager__title">${i18nText(`group.${nextGroup}`)}</span>
    </a>`
    : `<span class="tcrn-doc-chapter-pager__placeholder" aria-hidden="true"></span>`;
  return `<nav class="tcrn-doc-chapter-pager" aria-label="${escapeHtml(localeText("shell.chapterNavLabel"))}" data-doc-chapter-pager="true">
  ${previous}
  ${next}
</nav>`;
}

function docHeaderWorkspaceHtml(group: ContractStoryGroup): string {
  const firstStory = contractStoriesByGroup(group)[0];
  if (!firstStory) {
    throw new Error(`missing_story_for_group:${group}`);
  }
  return `<div class="tcrn-doc-header__workspace" aria-label="${escapeHtml(localeText("shell.currentLocationLabel"))}" data-i18n-aria-label="shell.currentLocationLabel">
          <div class="tcrn-doc-current-location">
            <span class="tcrn-doc-current-location__label">${i18nText("shell.currentLocationLabel")}</span>
            <span class="tcrn-doc-current-location__path">
              <span class="tcrn-doc-current-location__group" data-i18n="${escapeHtml(`group.${group}`)}">${i18nText(`group.${group}`)}</span>
              <span class="tcrn-doc-current-location__separator" aria-hidden="true">${iconHtml("chevron-right", "tcrn-doc-current-location__separator-icon", "current-location-separator")}</span>
              <span class="tcrn-doc-current-location__story" data-doc-current-story data-i18n="${escapeHtml(`story.${firstStory.id}.title`)}">${i18nText(`story.${firstStory.id}.title`)}</span>
            </span>
          </div>
          <div class="tcrn-doc-header-search" aria-label="${escapeHtml(localeText("shell.searchLabel"))}">
            <span class="tcrn-sr-only">${i18nText("shell.searchLabel")}</span>
            ${renderToStaticMarkup(
              <SearchInput
                className="tcrn-search-input--compact"
                placeholder={localeText("shell.searchLabel")}
                aria-label={localeText("shell.searchLabel")}
                role="combobox"
                aria-autocomplete="list"
                aria-expanded="false"
                aria-controls="tcrn-doc-search-results"
                shortcut="auto"
                data-doc-search-input
              />
            )}
            <div id="tcrn-doc-search-results" class="tcrn-doc-search-results" role="listbox" aria-label="${escapeHtml(localeText("shell.searchResultsLabel"))}" data-doc-search-results hidden></div>
          </div>
        </div>`;
}

function docHeaderControlsHtml(): string {
  return `<div class="tcrn-doc-header-controls">
          <div class="tcrn-doc-header-controls__row">
            <div class="tcrn-doc-theme-control-slot" data-storybook-theme-control>
              ${renderToStaticMarkup(
                <ShellThemeToggle
                  currentTheme="light"
                  lightLabel={localeText("shell.themeLightLabel")}
                  darkLabel={localeText("shell.themeDarkLabel")}
                  data-storybook-theme-toggle
                  data-storybook-theme-option="dark"
                  data-theme-label-key="shell.themeDarkLabel"
                  aria-pressed="false"
                />
              )}
            </div>
            <div class="tcrn-doc-locale-control-slot">
              ${renderToStaticMarkup(
                <ShellLocaleMenu
                  locales={tcrnLocaleMetadata}
                  currentLocale={tcrnDefaultLocale}
                  label={localeText("shell.languageLabel")}
                  menuId="tcrn-doc-locale-menu"
                  triggerId="tcrn-doc-locale-trigger"
                  data-locale-menu-root
                  data-i18n-aria-label="shell.languageLabel"
                />
              )}
              <select id="tcrn-doc-locale" data-i18n-locale-select data-i18n-aria-label="shell.languageLabel" aria-label="${escapeHtml(localeText("shell.languageLabel"))}" tabindex="-1" aria-hidden="true" hidden>
${tcrnLocaleMetadata.map((metadata) => `                <option value="${metadata.locale}">${metadata.nativeName}</option>`).join("\n")}
              </select>
            </div>
          </div>
        </div>`;
}

function storyHtml(group: ContractStoryGroup): string {
  const stories = contractStoriesByGroup(group);
  return `<section class="tcrn-static-section" id="${groupSlug(group)}" data-story-section="${group}">
  <h2>${i18nText(`group.${group}`)}</h2>
${stories.map((story) => {
  // Each story is rendered in its own renderToStaticMarkup pass, so React's useId counter
  // restarts per story; without a per-story identifierPrefix, two stories on the same page
  // can mint the same useId value and collide (e.g. two dialogs sharing an aria-labelledby
  // target — a serious axe failure). Scope the ids to the story id so they are page-unique.
  const body = renderToStaticMarkup(story.id === "overlay-focus" ? <DialogSpecFixture /> : story.render(), {
    identifierPrefix: `${story.id}-`
  });
  return `  <article id="${story.id}" data-contract-story-id="${story.id}" data-story-id="${story.id}" data-story-group="${story.group}" data-story-category="${escapeHtml(story.category)}" data-story-category-id="${escapeHtml(story.categoryId)}" data-story-source-path="${escapeHtml(story.sourcePath)}" data-story-package-authority="${escapeHtml(story.packageAuthority)}" data-story-readiness="${escapeHtml(story.readiness)}" data-story-proof-posture="${escapeHtml(story.proofPosture)}" data-story-collapsed="true">
  <h2 class="tcrn-story-disclosure__heading"><button type="button" class="tcrn-story-disclosure" aria-expanded="false" aria-controls="${story.id}-region" data-story-disclosure="${story.id}"><span class="tcrn-story-disclosure__title">${i18nText(`story.${story.id}.title`)}</span><span class="tcrn-story-disclosure__chevron" aria-hidden="true">${iconHtml("chevron-right", "tcrn-story-disclosure__chevron-svg", "story-disclosure")}</span></button></h2>
  <p>${i18nText(`story.${story.id}.description`)}</p>
  <div class="story-body" id="${story.id}-region">${body}</div>
</article>`;
}).join("\n")}
</section>`;
}

function pageHeadHtml(group: ContractStoryGroup): string {
  const stories = contractStoriesByGroup(group);
  const categories = storyCategoriesForGroup(group, stories);
  return `<section class="tcrn-doc-page-head" aria-labelledby="tcrn-doc-visible-page-title" data-doc-page-head="governed-section" data-mandatory-boundary-block="visible" data-no-overclaim-boundary="visible">
  <div class="tcrn-doc-page-head__intro">
    <span class="tcrn-doc-page-head__eyebrow">${i18nText("shell.governedSectionLabel")}</span>
    <h2 id="tcrn-doc-visible-page-title">${i18nText(`group.${group}`)}</h2>
  </div>
  <nav class="tcrn-doc-on-this-page" aria-label="${escapeHtml(localeText("shell.onThisPageLabel"))}" data-doc-on-this-page="true">
    <strong>${i18nText("shell.onThisPageLabel")}</strong>
    <ol>
${categories.map((category) => `      <li><a href="#${category.stories[0]?.id ?? groupSlug(group)}">${i18nText(category.label)}</a><span>${category.stories.length}</span></li>`).join("\n")}
    </ol>
  </nav>
  <div class="tcrn-doc-boundary-strip" data-governance-boundary-strip="visible">
    <span>${i18nText("shell.noPackagePublicationClaim")}</span>
    <span>${i18nText("shell.noProductAdoptionClaim")}</span>
    <span>${i18nText("shell.acceptanceDownstreamClaim")}</span>
  </div>
</section>`;
}

export function pageHtml(group: ContractStoryGroup): string {
  return `<!doctype html>
<html lang="${tcrnDefaultLocale}" data-tcrn-theme="light">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light dark" />
  <meta name="theme-color" content="#fafaf9" data-storybook-theme-color />
  <link rel="icon" href="tcrn-brand-mark.svg" type="image/svg+xml" />
  <link rel="alternate" type="application/json" href="ai-consumption-contract.json" title="TCRN AI consumption contract" data-tcrn-ai-consumption-contract="true" />
  <link rel="help" type="text/plain" href="llms.txt" data-tcrn-ai-consumption-contract-help="true" />
  <meta name="tcrn-ai-consumption-contract" content="ai-consumption-contract.json" />
  <meta name="tcrn-ai-consumption-contract-route" content="proof.html#ai-consumption-contract" />
  <meta name="tcrn-ai-consumption-contract-required" content="must-read-first" />
  <title>${localeText(`group.${group}`)} - ${localeText("shell.title")}</title>
  <style data-tcrn-component-style-source="@tcrn/ui-react" data-tcrn-doc-shell-component-style="package-backed">
${tcrnComponentCss}
  </style>
  <style data-tcrn-static-doc-style-source="storybook">
${alphaStoryCss}
  </style>
  <style data-tcrn-component-style-source="@tcrn/ui-react" data-tcrn-product-shell-comparator-style="package-backed" data-tcrn-component-style-scope=".story-body">
${staticStoryComponentCss}
  </style>
</head>
<body>
  ${skipLinkHtml()}
  <div class="tcrn-doc-shell" data-doc-shell="online-docs" data-contract-surface="tcrn-design-system-storybook" data-anchor-scroll-controlled="true" data-active-story-section="${group}" data-storybook-locale="${tcrnDefaultLocale}" data-storybook-supported-locales="${tcrnSupportedLocales.join(",")}" data-storybook-theme="light" data-storybook-supported-themes="light,dark" data-tcrn-theme="light">
    <header class="tcrn-doc-header">
      <div class="tcrn-doc-global-bar">
        <div class="tcrn-doc-global-brand">
          ${docBrandHtml()}
          ${sidebarToggleHtml()}
        </div>
        ${docHeaderWorkspaceHtml(group)}
        ${docHeaderControlsHtml()}
      </div>
    </header>
    <div class="tcrn-doc-layout">
      <aside class="tcrn-doc-sidebar" id="tcrn-doc-sidebar" aria-labelledby="tcrn-doc-sidebar-label">
        <p class="tcrn-sr-only" id="tcrn-doc-sidebar-label">${i18nText("shell.sidebarLabel")}</p>
${navHtml(group)}
      </aside>
      <main class="tcrn-doc-content" id="content">
        <h1 class="tcrn-sr-only" id="tcrn-doc-page-title">${i18nText("shell.title")}</h1>
${pageHeadHtml(group)}
${storyHtml(group)}
${chapterPagerHtml(group)}
      </main>
    </div>
  </div>
${hashRouteScript}
${activeStoryNavScript}
${storybookThemeScript}
${storybookI18nScript}
${sidebarToggleScript}
${storybookSearchScript}
${dialogFixtureScript}
${storyDisclosureScript}
${tableToolbarScript}
${anchorScrollScript}
</body>
</html>
`;
}
