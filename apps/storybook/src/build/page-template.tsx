import { renderToStaticMarkup } from "react-dom/server";
import { tcrnDefaultLocale, tcrnLocaleMetadata, tcrnSupportedLocales } from "@tcrn/ui-copy-state";
import { Icon, tcrnComponentCss, type IconName } from "@tcrn/ui-react";
import { DialogSpecFixture, contractStoriesByGroup, contractStoryGroups } from "../stories.js";
import type { ContractStoryGroup } from "../stories.js";
import { alphaStoryCss } from "../alpha-styles.js";
import {
  activeStoryNavScript,
  anchorScrollScript,
  dialogFixtureScript,
  hashRouteScript,
  sidebarToggleScript,
  storybookI18nScript,
  storybookThemeScript,
  storybookSearchScript
} from "./client-scripts.js";
import { escapeHtml, i18nText, localeText } from "./i18n.js";
import { groupFileName, groupSlug, navAbbreviations } from "./navigation.js";

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

function navHtml(activeGroup: ContractStoryGroup): string {
  return `<nav class="tcrn-doc-nav" aria-label="Documentation sections" data-doc-nav="sections">
  <ol class="tcrn-doc-nav__groups">
${contractStoryGroups.map((group) => {
  const current = group === activeGroup ? " aria-current=\"page\"" : "";
  const stories = contractStoriesByGroup(group);
  const groupLabel = i18nText(`group.${group}`);
  const groupAbbr = escapeHtml(navAbbreviations[group]);
  return `    <li class="tcrn-doc-nav__group" data-doc-nav-group="${group}">
      <a class="tcrn-doc-nav__section" href="${groupFileName(group)}" data-story-nav="${group}"${current} data-nav-abbr="${groupAbbr}">
        <span class="tcrn-doc-nav__section-label">${groupLabel}</span>
        <span class="tcrn-doc-nav__section-abbr" aria-hidden="true">${groupAbbr}</span>
      </a>
      <ol class="tcrn-doc-nav__stories" aria-label="${group} stories">
${stories.map((story, index) => {
  const href = `${groupFileName(story.group)}#${story.id}`;
  const currentStory = group === activeGroup && index === 0 ? " aria-current=\"location\" data-doc-nav-item-active=\"true\"" : "";
  return `        <li><a href="${href}" data-doc-nav-item="${story.id}"${currentStory}>${i18nText(`story.${story.id}.title`)}</a></li>`;
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
  return `<div class="tcrn-doc-header__workspace" aria-label="${escapeHtml(localeText("shell.currentLocationLabel"))}">
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
            <span class="tcrn-search-input" data-search-input="true">
              <span class="tcrn-search-input__icon" aria-hidden="true">
                ${iconHtml("search", "tcrn-search-input__icon-svg", "header-search")}
              </span>
              <input class="tcrn-input tcrn-search-input__control tcrn-search-input--compact" type="search" placeholder="${escapeHtml(localeText("shell.searchLabel"))}" aria-label="${escapeHtml(localeText("shell.searchLabel"))}" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="tcrn-doc-search-results" aria-keyshortcuts="Control+K Meta+K" data-doc-search-input />
              <kbd class="tcrn-search-input__shortcut" data-shortcut-auto="search" aria-hidden="true">Ctrl K</kbd>
            </span>
            <div id="tcrn-doc-search-results" class="tcrn-doc-search-results" role="listbox" aria-label="${escapeHtml(localeText("shell.searchResultsLabel"))}" data-doc-search-results hidden></div>
          </div>
        </div>`;
}

function docHeaderControlsHtml(): string {
  return `<div class="tcrn-doc-header-controls">
          <div class="tcrn-doc-header-controls__row">
            <div class="tcrn-doc-theme-control" data-storybook-theme-control>
              <button class="tcrn-doc-theme-toggle" type="button" data-storybook-theme-toggle data-storybook-theme-option="dark" data-theme-label-key="shell.themeDarkLabel" data-current-theme="light" aria-pressed="false" aria-label="${escapeHtml(localeText("shell.themeDarkLabel"))}" title="${escapeHtml(localeText("shell.themeDarkLabel"))}">
                <span class="tcrn-doc-theme-toggle__icon" data-theme-icon="light" aria-hidden="true">${iconHtml("sun", "tcrn-doc-theme-control__icon", "theme-light")}</span>
                <span class="tcrn-doc-theme-toggle__icon" data-theme-icon="dark" aria-hidden="true">${iconHtml("moon", "tcrn-doc-theme-control__icon", "theme-dark")}</span>
                <span class="tcrn-sr-only" data-i18n="shell.themeLabel">${i18nText("shell.themeLabel")}</span>
              </button>
            </div>
            <div class="tcrn-doc-locale-control" data-locale-menu-root>
              <button class="tcrn-doc-locale-toggle" type="button" data-locale-menu-toggle aria-haspopup="listbox" aria-expanded="false" aria-controls="tcrn-doc-locale-menu" data-i18n-aria-label="shell.languageLabel" aria-label="${escapeHtml(localeText("shell.languageLabel"))}" title="${escapeHtml(localeText("shell.languageLabel"))}">
                ${iconHtml("globe-2", "tcrn-doc-locale-control__globe", "locale-globe")}
                <span class="tcrn-doc-locale-toggle__name" data-locale-current-name>${tcrnLocaleMetadata.find((metadata) => metadata.locale === tcrnDefaultLocale)?.nativeName ?? tcrnDefaultLocale}</span>
                ${iconHtml("chevron-down", "tcrn-doc-locale-control__chevron", "locale-select")}
              </button>
              <div id="tcrn-doc-locale-menu" class="tcrn-doc-locale-menu" role="listbox" data-locale-menu data-i18n-aria-label="shell.languageLabel" aria-label="${escapeHtml(localeText("shell.languageLabel"))}" hidden>
${tcrnLocaleMetadata.map((metadata) => {
  const selected = metadata.locale === tcrnDefaultLocale ? "true" : "false";
  return `                <button class="tcrn-doc-locale-menu__option" type="button" role="option" data-locale-menu-option data-locale="${metadata.locale}" data-locale-name="${metadata.nativeName}" aria-selected="${selected}">
                  <span class="tcrn-doc-locale-menu__name">${metadata.nativeName}</span>
                </button>`;
}).join("\n")}
              </div>
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
  const body = renderToStaticMarkup(story.id === "overlay-focus" ? <DialogSpecFixture /> : story.render());
  return `  <article id="${story.id}" data-contract-story-id="${story.id}" data-story-id="${story.id}" data-story-group="${story.group}">
  <h2>${i18nText(`story.${story.id}.title`)}</h2>
  <p>${i18nText(`story.${story.id}.description`)}</p>
  <div class="story-body">${body}</div>
</article>`;
}).join("\n")}
</section>`;
}

export function pageHtml(group: ContractStoryGroup): string {
  return `<!doctype html>
<html lang="${tcrnDefaultLocale}" data-tcrn-theme="light">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light dark" />
  <meta name="theme-color" content="#f6f7fb" data-storybook-theme-color />
  <link rel="icon" href="tcrn-brand-mark.svg" type="image/svg+xml" />
  <link rel="alternate" type="application/json" href="ai-consumption-contract.json" title="TCRN AI consumption contract" data-tcrn-ai-consumption-contract="true" />
  <link rel="help" type="text/plain" href="llms.txt" data-tcrn-ai-consumption-contract-help="true" />
  <meta name="tcrn-ai-consumption-contract" content="ai-consumption-contract.json" />
  <meta name="tcrn-ai-consumption-contract-route" content="proof.html#ai-consumption-contract" />
  <meta name="tcrn-ai-consumption-contract-required" content="must-read-first" />
  <title>${localeText(`group.${group}`)} - ${localeText("shell.title")}</title>
  <style data-tcrn-static-doc-style-source="storybook">
${alphaStoryCss}
  </style>
  <style data-tcrn-component-style-source="@tcrn/ui-react" data-tcrn-product-shell-comparator-style="package-backed" data-tcrn-component-style-scope=".story-body">
${staticStoryComponentCss}
  </style>
</head>
<body>
  <a class="tcrn-doc-skip" href="#content" aria-label="${escapeHtml(localeText("shell.skip"))}">${i18nText("shell.skip")}</a>
  <div class="tcrn-doc-shell" data-doc-shell="online-docs" data-contract-surface="tcrn-design-system-storybook" data-anchor-scroll-controlled="true" data-active-story-section="${group}" data-storybook-locale="${tcrnDefaultLocale}" data-storybook-supported-locales="${tcrnSupportedLocales.join(",")}" data-storybook-theme="light" data-storybook-supported-themes="light,dark" data-tcrn-theme="light">
    <header class="tcrn-doc-header">
      <div class="tcrn-doc-global-bar">
        <div class="tcrn-doc-global-brand">
          <a class="tcrn-doc-brand" href="index.html">
            <img class="tcrn-brand-mark tcrn-doc-brand__mark" src="tcrn-brand-mark.svg" alt="" aria-hidden="true" />
            <span class="tcrn-doc-brand__copy">
              <span class="tcrn-brand-wordmark" aria-label="${escapeHtml(localeText("shell.brand"))}">
                <span class="tcrn-brand-wordmark__base">TCRN</span>
                <span class="tcrn-brand-wordmark__suffix tcrn-brand-wordmark__suffix--design-system">${i18nText("shell.brandSuffix")}</span>
              </span>
              <span class="tcrn-doc-brand__caption">${i18nText("shell.eyebrow")}</span>
            </span>
          </a>
          <button class="tcrn-doc-sidebar-toggle" type="button" aria-controls="tcrn-doc-sidebar" aria-expanded="true" aria-label="${escapeHtml(localeText("shell.collapseNavigationLabel"))}" title="${escapeHtml(localeText("shell.collapseNavigationLabel"))}" data-doc-sidebar-toggle data-expanded-label="${escapeHtml(localeText("shell.collapseNavigationLabel"))}" data-collapsed-label="${escapeHtml(localeText("shell.expandNavigationLabel"))}">
            <span class="tcrn-doc-sidebar-toggle__icon" aria-hidden="true">
              ${iconHtml("chevron-left", "tcrn-doc-sidebar-toggle__icon-svg tcrn-doc-sidebar-toggle__icon-svg--close", "sidebar-collapse")}
              ${iconHtml("chevron-right", "tcrn-doc-sidebar-toggle__icon-svg tcrn-doc-sidebar-toggle__icon-svg--open", "sidebar-expand")}
            </span>
          </button>
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
${anchorScrollScript}
</body>
</html>
`;
}
