import { renderToStaticMarkup } from "react-dom/server";
import { tcrnDefaultLocale, tcrnLocaleMetadata, tcrnSupportedLocales } from "@tcrn/ui-copy-state";
import {
  Icon,
  ProductShell,
  tcrnComponentCss,
  type IconName,
  type ProductShellNavGroup,
  type ProductShellSearchResult
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
  storybookI18nScript,
  storybookThemeScript,
  storybookSearchScript
} from "./client-scripts.js";
import { escapeHtml, i18nText, localeText } from "./i18n.js";
import { groupFileName, groupSlug, storyCategoriesForGroup } from "./navigation.js";

function iconHtml(name: IconName, className: string, dataStorybookContentIcon: string): string {
  return renderToStaticMarkup(
    <Icon name={name} className={className} data-storybook-content-icon={dataStorybookContentIcon} />
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

function storyHref(story: ReturnType<typeof contractStoriesByGroup>[number]): string {
  return `${groupFileName(story.group)}#${story.id}`;
}

function buildStorybookNavGroups(activeGroup: ContractStoryGroup): ProductShellNavGroup[] {
  return contractStoryGroups.flatMap((group) => {
    const stories = contractStoriesByGroup(group);
    const firstStory = stories[0];
    return storyCategoriesForGroup(group, stories).map((category) => ({
      id: `${groupSlug(group)}-${category.id}`,
      label: category.label,
      description: category.description,
      sectionLabel: localeText(`group.${group}`),
      selected: group === activeGroup && category.stories.some((story) => story.id === firstStory?.id),
      items: category.stories.map((story) => ({
        id: story.id,
        label: localeText(`story.${story.id}.title`),
        href: storyHref(story),
        selected: group === activeGroup && firstStory?.id === story.id
      }))
    }));
  });
}

function buildStorybookSearchResults(): ProductShellSearchResult[] {
  return contractStoryGroups.flatMap((group) => contractStoriesByGroup(group).map((story) => ({
    id: story.id,
    title: localeText(`story.${story.id}.title`),
    meta: localeText(`group.${group}`),
    href: storyHref(story)
  })));
}

function hiddenLocaleSelectHtml(): string {
  return `<select id="tcrn-storybook-locale" data-i18n-locale-select data-i18n-aria-label="shell.languageLabel" aria-label="${escapeHtml(localeText("shell.languageLabel"))}" tabindex="-1" aria-hidden="true" hidden>
${tcrnLocaleMetadata.map((metadata) => `  <option value="${metadata.locale}">${metadata.nativeName}</option>`).join("\n")}
</select>`;
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

function storyHtml(group: ContractStoryGroup): string {
  const stories = contractStoriesByGroup(group);
  return `<section class="tcrn-static-section" id="${groupSlug(group)}" data-story-section="${group}">
  <h2>${i18nText(`group.${group}`)}</h2>
${stories.map((story) => {
  const body = renderToStaticMarkup(story.id === "overlay-focus" ? <DialogSpecFixture /> : story.render());
  return `  <article id="${story.id}" data-contract-story-id="${story.id}" data-story-id="${story.id}" data-story-group="${story.group}" data-story-category="${escapeHtml(story.category)}" data-story-category-id="${escapeHtml(story.categoryId)}" data-story-source-path="${escapeHtml(story.sourcePath)}" data-story-package-authority="${escapeHtml(story.packageAuthority)}" data-story-readiness="${escapeHtml(story.readiness)}" data-story-proof-posture="${escapeHtml(story.proofPosture)}">
  <h2>${i18nText(`story.${story.id}.title`)}</h2>
  <p>${i18nText(`story.${story.id}.description`)}</p>
  <div class="story-body">${body}</div>
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
    <p>${i18nText("shell.governedSectionDescription")}</p>
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

function storybookProductShellHtml(group: ContractStoryGroup): string {
  const firstStory = contractStoriesByGroup(group)[0];
  if (!firstStory) {
    throw new Error(`missing_story_for_group:${group}`);
  }
  const contentHtml = `<div class="tcrn-doc-content" data-storybook-content-slot="contract-stories">
  <h1 class="tcrn-sr-only" id="tcrn-doc-page-title">${i18nText("shell.title")}</h1>
${hiddenLocaleSelectHtml()}
${pageHeadHtml(group)}
${storyHtml(group)}
${chapterPagerHtml(group)}
</div>`;

  return renderToStaticMarkup(
    <ProductShell
      productName="TCRN Design System"
      moduleName={localeText("shell.title")}
      brandProductId="design-system"
      brandHref="index.html"
      brandMarkSrc="tcrn-brand-mark.svg"
      brandMarkAlt={localeText("shell.brand")}
      currentRouteLabel={`${localeText(`group.${group}`)} / ${localeText(`story.${firstStory.id}.title`)}`}
      currentLocationLabel={localeText("shell.currentLocationLabel")}
      navLabel={localeText("shell.topNavLabel")}
      navGroups={buildStorybookNavGroups(group)}
      locales={tcrnLocaleMetadata}
      currentLocale={tcrnDefaultLocale}
      collapsed={false}
      collapsedStorageKey="tcrn-design-system-storybook-sidebar-collapsed"
      currentTheme="light"
      search={{
        label: localeText("shell.searchLabel"),
        placeholder: localeText("shell.searchLabel"),
        shortcut: "auto",
        query: "",
        expanded: false,
        results: buildStorybookSearchResults(),
        resultsLabel: localeText("shell.searchResultsLabel"),
        emptyLabel: localeText("shell.searchNoResults"),
        inputProps: {
          readOnly: false
        }
      }}
      contentId="content"
      contentRole="main"
      contentLabel={localeText("shell.title")}
      skipLinkLabel={localeText("shell.skip")}
      className="tcrn-storybook-product-shell"
      data-contract-surface="tcrn-design-system-storybook"
      data-anchor-scroll-controlled="true"
      data-active-story-section={group}
      data-storybook-locale={tcrnDefaultLocale}
      data-storybook-supported-locales={tcrnSupportedLocales.join(",")}
      data-storybook-theme="light"
      data-storybook-supported-themes="light,dark"
      data-tcrn-theme="light"
      data-storybook-shell-authority="@tcrn/ui-react/ProductShell"
      data-storybook-private-doc-shell-retired="true"
    >
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </ProductShell>
  );
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
  <style data-tcrn-component-style-source="@tcrn/ui-react" data-storybook-product-shell-component-style="package-backed">
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
  ${storybookProductShellHtml(group)}
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
