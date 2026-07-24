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
import type { ContractStory, ContractStoryGroup } from "../stories.js";
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
import { escapeHtml, i18nText, localeText, storybookContentText } from "./i18n.js";
import { categoryDomId, categoryFileForStory, categoryFileName, groupFileName, groupSlug, navAbbreviations, storyCategoriesForGroup } from "./navigation.js";
import type { ContractPage } from "./navigation.js";
import { referenceComponentAnchor } from "./reference-pages.js";
import type { ComponentApiEntry, ReferencePage } from "./reference-pages.js";

const navGroupIcons: Record<ContractStoryGroup, IconName> = {
  Welcome: "home",
  "Style Guide": "palette",
  Foundations: "layers",
  Components: "package",
  Patterns: "layout-grid",
  Proof: "shield-check",
  "Change Log": "history"
};

// TCRN-DS-STORY-054: reverse the HTML escaping that React's renderToStaticMarkup and the
// build's escapeHtml apply, so a build-time substring test over the rendered page equals the
// runtime text-node value the locale swap matches on (translateContentTree trims a text node
// and looks its raw value up in the content dictionary). React encodes `'` as `&#x27;` while
// escapeHtml (i18n.ts) uses `&#39;`; decode both. `&amp;` is decoded LAST so an escaped literal
// such as `&amp;lt;` (source text "&lt;") is not double-decoded into "<".
function decodeEntities(value: string): string {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&");
}

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

function navHtml(activeGroup: ContractStoryGroup, activeCategoryId: string, activeStoryId: string): string {
  return `<nav class="tcrn-doc-nav" aria-label="${escapeHtml(localeText("shell.topNavLabel"))}" data-i18n-aria-label="shell.topNavLabel" data-doc-nav="sections">
  <ol class="tcrn-doc-nav__groups">
${contractStoryGroups.map((group) => {
  const current = group === activeGroup ? " aria-current=\"page\"" : "";
  const stories = contractStoriesByGroup(group);
  const categories = storyCategoriesForGroup(group, stories);
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
${category.stories.map((story) => {
  // TCRN-DS-STORY-056: every nav story link points at the story's CATEGORY page. On the
  // page that owns the story the anchor-scroll script recognises the same pathname and
  // scrolls in place; from any other page it is a normal cross-page navigation.
  const href = `${categoryFileForStory(story)}#${story.id}`;
  const currentStory = story.id === activeStoryId ? " aria-current=\"location\" data-doc-nav-item-active=\"true\"" : "";
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

function docHeaderWorkspaceHtml(group: ContractStoryGroup, activeStory: ContractStory): string {
  return `<div class="tcrn-doc-header__workspace" aria-label="${escapeHtml(localeText("shell.currentLocationLabel"))}" data-i18n-aria-label="shell.currentLocationLabel">
          <div class="tcrn-doc-current-location">
            <span class="tcrn-doc-current-location__label">${i18nText("shell.currentLocationLabel")}</span>
            <span class="tcrn-doc-current-location__path">
              <span class="tcrn-doc-current-location__group" data-i18n="${escapeHtml(`group.${group}`)}">${i18nText(`group.${group}`)}</span>
              <span class="tcrn-doc-current-location__separator" aria-hidden="true">${iconHtml("chevron-right", "tcrn-doc-current-location__separator-icon", "current-location-separator")}</span>
              <span class="tcrn-doc-current-location__story" data-doc-current-story data-i18n="${escapeHtml(`story.${activeStory.id}.title`)}">${i18nText(`story.${activeStory.id}.title`)}</span>
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

// TCRN-DS-STORY-056: a category page renders ONLY its category's story bodies (still inside
// the one `data-story-section` wrapper the gates expect). Index pages never call this.
// TCRN-DS-STORY-060: give every ReadbackPanel a STATIC-html anchor id so it is deep-linkable
// (before JS) and indexable by the doc search. The id is POSITION-based (`${storyId}--panel-N`),
// not title-derived: position ids survive the S046/S047 rewording and S049 translation churn that
// would break slug ids, and the story-id prefix makes them page-unique for free — dissolving the
// real collision where two different stories both render a panel titled "Negative acceptance
// criteria" on the shared Proof page. Attribute-only injection; the panel markup is untouched.
function injectReadbackPanelAnchors(html: string, storyId: string): string {
  let panelIndex = 0;
  return html.replace(/<section class="([^"]*\btcrn-readback-panel\b[^"]*)"/g, (_match, className) => {
    panelIndex += 1;
    return `<section class="${className}" id="${storyId}--panel-${panelIndex}" data-readback-panel-anchor="${panelIndex}"`;
  });
}

function storyHtml(group: ContractStoryGroup, stories: ContractStory[]): string {
  return `<section class="tcrn-static-section" id="${groupSlug(group)}" data-story-section="${group}">
  <h2>${i18nText(`group.${group}`)}</h2>
${stories.map((story) => {
  // Each story is rendered in its own renderToStaticMarkup pass, so React's useId counter
  // restarts per story; without a per-story identifierPrefix, two stories on the same page
  // can mint the same useId value and collide (e.g. two dialogs sharing an aria-labelledby
  // target — a serious axe failure). Scope the ids to the story id so they are page-unique.
  const body = injectReadbackPanelAnchors(renderToStaticMarkup(story.id === "overlay-focus" ? <DialogSpecFixture /> : story.render(), {
    identifierPrefix: `${story.id}-`
  }), story.id);
  return `  <article id="${story.id}" data-contract-story-id="${story.id}" data-story-id="${story.id}" data-story-group="${story.group}" data-story-category="${escapeHtml(story.category)}" data-story-category-id="${escapeHtml(story.categoryId)}" data-story-source-path="${escapeHtml(story.sourcePath)}" data-story-package-authority="${escapeHtml(story.packageAuthority)}" data-story-readiness="${escapeHtml(story.readiness)}" data-story-proof-posture="${escapeHtml(story.proofPosture)}" data-story-collapsed="true">
  <h2 class="tcrn-story-disclosure__heading"><button type="button" class="tcrn-story-disclosure" aria-expanded="false" aria-controls="${story.id}-region" data-story-disclosure="${story.id}"><span class="tcrn-story-disclosure__title">${i18nText(`story.${story.id}.title`)}</span><span class="tcrn-story-disclosure__chevron" aria-hidden="true">${iconHtml("chevron-right", "tcrn-story-disclosure__chevron-svg", "story-disclosure")}</span></button></h2>
  <p>${i18nText(`story.${story.id}.description`)}</p>
  <div class="story-body" id="${story.id}-region">${body}</div>
</article>`;
}).join("\n")}
</section>`;
}

// TCRN-DS-STORY-056: the bounded section INDEX body. It carries ZERO `data-contract-story-id`
// / `data-story-id` article bodies and NO `data-story-section` wrapper — only links out to
// the category pages that own the bodies. This is what closes the not-gated unbounded-full-page
// holes: the index page can never accumulate story bodies.
function sectionIndexBodyHtml(group: ContractStoryGroup): string {
  const stories = contractStoriesByGroup(group);
  const categories = storyCategoriesForGroup(group, stories);
  return `<section class="tcrn-static-section tcrn-static-section--category-index" id="${groupSlug(group)}" data-doc-category-index="${group}">
  <h2>${i18nText(`group.${group}`)}</h2>
  <ol class="tcrn-doc-category-index">
${categories.map((category) => {
  const categoryLabel = localeText(category.label);
  return `    <li class="tcrn-doc-category-index__category" data-doc-category-index-item="${escapeHtml(category.id)}">
      <a class="tcrn-doc-category-index__link" href="${categoryFileName(group, category.id)}" data-doc-category-link="${escapeHtml(category.id)}">
        <span class="tcrn-doc-category-index__label" data-i18n="${escapeHtml(category.label)}">${escapeHtml(categoryLabel)}</span>
        <span class="tcrn-doc-category-index__count" aria-label="${category.stories.length} ${escapeHtml(localeText("shell.storiesCountLabel"))}">${category.stories.length}</span>
      </a>
      <span class="tcrn-sr-only" data-i18n="${escapeHtml(category.description)}">${escapeHtml(localeText(category.description))}</span>
      <ol class="tcrn-doc-category-index__stories">
${category.stories.map((story) => `        <li><a class="tcrn-doc-category-index__story" href="${categoryFileForStory(story)}#${story.id}" data-doc-category-story-link="${story.id}">${i18nText(`story.${story.id}.title`)}</a></li>`).join("\n")}
      </ol>
    </li>`;
}).join("\n")}
  </ol>
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
${categories.map((category) => `      <li><a href="${categoryFileName(group, category.id)}#${category.stories[0]?.id ?? groupSlug(group)}">${i18nText(category.label)}</a><span>${category.stories.length}</span></li>`).join("\n")}
    </ol>
  </nav>
  <div class="tcrn-doc-boundary-strip" data-governance-boundary-strip="visible">
    <span>${i18nText("shell.noPackagePublicationClaim")}</span>
    <span>${i18nText("shell.noProductAdoptionClaim")}</span>
    <span>${i18nText("shell.acceptanceDownstreamClaim")}</span>
  </div>
</section>`;
}

// TCRN-DS-STORY-056: the shared shell used by BOTH the section index page and every category
// page. Everything except `mainBody` (index-of-categories vs the category's story bodies), the
// active nav state, the current-location story, and the <title> is identical between the two.
function renderContractDocument(options: {
  group: ContractStoryGroup;
  activeCategoryId: string;
  activeStory: ContractStory;
  pageTitleText: string;
  mainBody: string;
}): string {
  const { group, activeCategoryId, activeStory, pageTitleText, mainBody } = options;
  // Render every translatable body region exactly once (each of these makes renderToStaticMarkup
  // passes) so they can be both measured for the content-dict prune and reused in the template
  // below without a second render.
  const skipLink = skipLinkHtml();
  const docBrand = docBrandHtml();
  const sidebarToggle = sidebarToggleHtml();
  const headerWorkspace = docHeaderWorkspaceHtml(group, activeStory);
  const headerControls = docHeaderControlsHtml();
  const nav = navHtml(group, activeCategoryId, activeStory.id);
  const pageHead = pageHeadHtml(group);
  const chapterPager = chapterPagerHtml(group);
  const sidebarLabel = i18nText("shell.sidebarLabel");
  const pageTitleHeading = i18nText("shell.title");
  // TCRN-DS-STORY-054: prune the embedded content-translation dictionary to only the entries
  // whose English source actually renders inside this page's [data-contract-surface]. The runtime
  // swap (translateContentTree in client-scripts.ts) skips SCRIPT/STYLE, so the <style> blocks and
  // scripts are excluded from the match here too — this covers every text node and translatable
  // attribute the swap can touch. Match on the entity-decoded body so build-time escaping equals
  // the runtime text value. This is a deliberate SUPERSET: over-inclusion only costs bytes, whereas
  // under-inclusion would leak English after a locale switch, so err toward including.
  const translatableSurface = decodeEntities(
    [
      skipLink,
      docBrand,
      sidebarToggle,
      headerWorkspace,
      headerControls,
      sidebarLabel,
      pageTitleHeading,
      nav,
      pageHead,
      mainBody,
      chapterPager
    ].join("\n")
  );
  const usedContentTranslations = Object.fromEntries(
    Object.entries(storybookContentText).filter(([source]) => translatableSurface.includes(source))
  );
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
  <title>${pageTitleText} - ${localeText("shell.title")}</title>
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
  ${skipLink}
  <div class="tcrn-doc-shell" data-doc-shell="online-docs" data-contract-surface="tcrn-design-system-storybook" data-anchor-scroll-controlled="true" data-active-story-section="${group}" data-storybook-locale="${tcrnDefaultLocale}" data-storybook-supported-locales="${tcrnSupportedLocales.join(",")}" data-storybook-theme="light" data-storybook-supported-themes="light,dark" data-tcrn-theme="light">
    <header class="tcrn-doc-header">
      <div class="tcrn-doc-global-bar">
        <div class="tcrn-doc-global-brand">
          ${docBrand}
          ${sidebarToggle}
        </div>
        ${headerWorkspace}
        ${headerControls}
      </div>
    </header>
    <div class="tcrn-doc-layout">
      <aside class="tcrn-doc-sidebar" id="tcrn-doc-sidebar" aria-labelledby="tcrn-doc-sidebar-label">
        <p class="tcrn-sr-only" id="tcrn-doc-sidebar-label">${sidebarLabel}</p>
${nav}
      </aside>
      <main class="tcrn-doc-content" id="content">
        <h1 class="tcrn-sr-only" id="tcrn-doc-page-title">${pageTitleHeading}</h1>
${pageHead}
${mainBody}
${chapterPager}
      </main>
    </div>
  </div>
${hashRouteScript}
${activeStoryNavScript}
${storybookThemeScript}
${storybookI18nScript(usedContentTranslations)}
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

// Section INDEX page: full shell + nav + page-head strip + a bounded category-index body.
// Active nav state falls on the group's first category / first story (mirrors the old default).
export function sectionIndexHtml(group: ContractStoryGroup): string {
  const stories = contractStoriesByGroup(group);
  const activeStory = stories[0];
  if (!activeStory) {
    throw new Error(`missing_story_for_group:${group}`);
  }
  return renderContractDocument({
    group,
    activeCategoryId: activeStory.categoryId,
    activeStory,
    pageTitleText: localeText(`group.${group}`),
    mainBody: sectionIndexBodyHtml(group)
  });
}

// Category page: full shell + nav + page-head strip + ONLY this category's story bodies.
// Active nav state falls on this category and its first story so per-page aria-current
// assertions resolve.
export function categoryPageHtml(group: ContractStoryGroup, categoryId: string, categoryLabel: string): string {
  const stories = contractStoriesByGroup(group).filter((story) => story.categoryId === categoryId);
  const activeStory = stories[0];
  if (!activeStory) {
    throw new Error(`missing_story_for_category:${group}:${categoryId}`);
  }
  return renderContractDocument({
    group,
    activeCategoryId: categoryId,
    activeStory,
    pageTitleText: localeText(categoryLabel),
    mainBody: storyHtml(group, stories)
  });
}

// TCRN-DS-STORY-058: a reference page renders the shared shell (Components active, nav state
// on the component-family-index story) around one API region per component. Every component,
// prop, type, slot, and variant identifier is a machine token wrapped in <code> (locale-invariant
// per the ledger), so the pages cost zero per-component translation; only the small set of shared
// column/section labels is dictionary-backed (reference.* keys).
function componentReferenceRegionHtml(component: ComponentApiEntry): string {
  const anchor = referenceComponentAnchor(component.name);
  const propsType = component.propsType ? `<code>${escapeHtml(component.propsType)}</code>` : "<code>—</code>";
  const propsBody = component.props.length === 0
    ? `<p class="tcrn-component-reference__empty">${i18nText("reference.noProps")}</p>`
    : `<div class="tcrn-reference-table-scroll">
      <table class="tcrn-reference-table">
        <thead>
          <tr>
            <th scope="col">${i18nText("reference.colProp")}</th>
            <th scope="col">${i18nText("reference.colType")}</th>
            <th scope="col">${i18nText("reference.colRequired")}</th>
            <th scope="col">${i18nText("reference.colSlot")}</th>
          </tr>
        </thead>
        <tbody>
${component.props.map((prop) => `          <tr>
            <td><code>${escapeHtml(prop.name)}</code></td>
            <td><code>${escapeHtml(prop.type)}</code></td>
            <td><code>${prop.required ? "true" : "false"}</code></td>
            <td><code>${prop.slot ? "true" : "false"}</code></td>
          </tr>`).join("\n")}
        </tbody>
      </table>
    </div>`;
  const variantKeys = Object.keys(component.variants);
  const variantsBody = variantKeys.length === 0
    ? ""
    : `<p class="tcrn-component-reference__facet">${i18nText("reference.variants")}: ${variantKeys.map((axis) =>
        `<code>${escapeHtml(axis)}</code> (${component.variants[axis].map((value) => `<code>${escapeHtml(String(value))}</code>`).join(", ")})`).join("; ")}</p>`;
  const slotsBody = component.slots.length === 0
    ? ""
    : `<p class="tcrn-component-reference__facet">${i18nText("reference.slots")}: ${component.slots.map((slot) => `<code>${escapeHtml(slot)}</code>`).join(", ")}</p>`;
  return `      <article class="tcrn-component-reference" data-component-reference-id="${escapeHtml(component.name)}" id="${anchor}">
        <h2 class="tcrn-heading"><code>${escapeHtml(component.name)}</code></h2>
        <p class="tcrn-component-reference__meta">${i18nText("reference.propsType")}: ${propsType}</p>
        ${propsBody}
        ${variantsBody}
        ${slotsBody}
      </article>`;
}

function referenceBodyHtml(page: ReferencePage): string {
  return `<section class="alpha-story-stack" data-reference-page="${page.pageIndex}">
      <p class="tcrn-component-reference__intro">${i18nText("reference.intro")}</p>
${page.components.map(componentReferenceRegionHtml).join("\n")}
    </section>`;
}

export function referencePageHtml(page: ReferencePage): string {
  const componentsStories = contractStoriesByGroup("Components");
  const indexStory = componentsStories.find((story) => story.id === "component-family-index") ?? componentsStories[0];
  if (!indexStory) {
    throw new Error("missing_component_index_story_for_reference_page");
  }
  return renderContractDocument({
    group: "Components",
    activeCategoryId: indexStory.categoryId,
    activeStory: indexStory,
    pageTitleText: `${localeText("reference.pageTitle")} ${page.pageIndex}`,
    mainBody: referenceBodyHtml(page)
  });
}

export function pageHtml(page: ContractPage): string {
  if (page.kind === "reference") {
    return referencePageHtml(page);
  }
  return page.kind === "index"
    ? sectionIndexHtml(page.group)
    : categoryPageHtml(page.group, page.categoryId, page.categoryLabel);
}
