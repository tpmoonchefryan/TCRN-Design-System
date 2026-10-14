import { renderToStaticMarkup } from "react-dom/server";
import { tcrnDefaultLocale, tcrnLocaleMetadata, tcrnSupportedLocales, type TcrnLocale } from "@tcrn/ui-copy-state";
import {
  Icon,
  ProductShell,
  TocRail,
  tcrnComponentCss,
  tcrnRetiredComponentCss,
  type IconName,
  type PageHeaderBreadcrumb,
  type ProductShellNavGroup,
  type TocItem
} from "@tcrn/ui-react";
import { DialogSpecFixture, contractStoriesByGroup, contractStoryGroups } from "../stories.js";
import type { ContractStory, ContractStoryGroup } from "../stories.js";
import { alphaStoryCss } from "../alpha-styles.js";
import {
  activeStoryNavScript,
  anchorScrollScript,
  dialogFixtureScript,
  docShellLayerScript,
  hashRouteScript,
  storyDisclosureScript,
  tableToolbarScript,
  storybookI18nScript,
  storybookThemeScript,
  storybookSearchIndexJson,
  storybookSearchScript,
  storybookCanvasColors
} from "./client-scripts.js";
import { escapeHtml, i18nText, localeText, storybookContentText } from "./i18n.js";
import { categoryFileForStory, categoryFileName, categorySlug, groupFileName, groupSlug, storyCategoriesForGroup } from "./navigation.js";
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

// TCRN-DS-SUB-035: the static pages carry the package CSS a second time under `.story-body` so the
// package wins inside a story. This scoper used to split selectors at every comma and to assume one
// rule per line: `:where(:hover,[data-tcrn-preview-state="hover"])` state rules were cut into invalid
// selectors (the browser dropped the whole rule, so the scoped base rule beat every hover, active,
// focus, disabled and selected state), and the rules after a one-line rule were copied unscoped. It
// now walks the stylesheet: a selector list splits only at top-level commas (never inside (), [] or a
// string), any number of rules may share a line, conditional group rules (@media, @supports,
// @container, @layer, @scope, @starting-style, @document) are scoped inside, and other at-rules
// (@keyframes, @font-face, @property, ...) and statements (`@layer a, b;`) are copied verbatim.
const scopedGroupAtRules = new Set(["media", "supports", "container", "layer", "scope", "starting-style", "document"]);

function skipCssString(css: string, index: number): number {
  const quote = css[index];
  let cursor = index + 1;
  while (cursor < css.length) {
    const char = css[cursor];
    if (char === "\\") {
      cursor += 2;
      continue;
    }
    if (char === quote) return cursor + 1;
    cursor += 1;
  }
  return cursor;
}

function skipCssComment(css: string, index: number): number {
  const end = css.indexOf("*/", index + 2);
  return end === -1 ? css.length : end + 2;
}

// Index of the `}` closing the block whose `{` is at `open`; strings, comments and nested blocks are
// skipped. An unterminated block runs to the end of the input.
function matchingCssBrace(css: string, open: number): number {
  let depth = 0;
  let cursor = open;
  while (cursor < css.length) {
    const char = css[cursor];
    if (char === "\"" || char === "'") {
      cursor = skipCssString(css, cursor);
      continue;
    }
    if (char === "/" && css[cursor + 1] === "*") {
      cursor = skipCssComment(css, cursor);
      continue;
    }
    if (char === "\\") {
      cursor += 2;
      continue;
    }
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return cursor;
    }
    cursor += 1;
  }
  return css.length;
}

function stripCssComments(text: string): string {
  let output = "";
  let cursor = 0;
  while (cursor < text.length) {
    const char = text[cursor];
    if (char === "\"" || char === "'") {
      const end = skipCssString(text, cursor);
      output += text.slice(cursor, end);
      cursor = end;
      continue;
    }
    if (char === "/" && text[cursor + 1] === "*") {
      cursor = skipCssComment(text, cursor);
      output += " ";
      continue;
    }
    output += char;
    cursor += 1;
  }
  return output;
}

// Splits a selector list at its top-level commas only: the commas inside `:where()`, `:is()`,
// `:not()`, `:has()`, an attribute selector or a string stay with their selector.
export function splitTopLevelSelectors(selectorList: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  let cursor = 0;
  while (cursor < selectorList.length) {
    const char = selectorList[cursor];
    if (char === "\"" || char === "'") {
      cursor = skipCssString(selectorList, cursor);
      continue;
    }
    if (char === "/" && selectorList[cursor + 1] === "*") {
      cursor = skipCssComment(selectorList, cursor);
      continue;
    }
    if (char === "\\") {
      cursor += 2;
      continue;
    }
    if (char === "(" || char === "[") depth += 1;
    else if ((char === ")" || char === "]") && depth > 0) depth -= 1;
    else if (char === "," && depth === 0) {
      parts.push(selectorList.slice(start, cursor));
      start = cursor + 1;
    }
    cursor += 1;
  }
  parts.push(selectorList.slice(start));
  return parts;
}

export function scopeComponentCss(css: string, scope: string): string {
  let output = "";
  let preludeStart = 0;
  let cursor = 0;
  while (cursor < css.length) {
    const char = css[cursor];
    if (char === "\"" || char === "'") {
      cursor = skipCssString(css, cursor);
      continue;
    }
    if (char === "/" && css[cursor + 1] === "*") {
      cursor = skipCssComment(css, cursor);
      continue;
    }
    if (char === "\\") {
      cursor += 2;
      continue;
    }
    if (char === ";" || char === "}") {
      // A statement at-rule (`@layer a, b;`), or a stray token: copy it as written.
      output += css.slice(preludeStart, cursor + 1);
      cursor += 1;
      preludeStart = cursor;
      continue;
    }
    if (char !== "{") {
      cursor += 1;
      continue;
    }
    const raw = css.slice(preludeStart, cursor);
    const leading = /^(?:\s|\/\*[\s\S]*?\*\/)*/.exec(raw)?.[0] ?? "";
    const prelude = stripCssComments(raw.slice(leading.length)).trim();
    const close = matchingCssBrace(css, cursor);
    const body = css.slice(cursor + 1, close);
    const closing = close < css.length ? "}" : "";
    if (prelude.startsWith("@")) {
      const name = /^@([\w-]+)/.exec(prelude)?.[1]?.toLowerCase() ?? "";
      output += scopedGroupAtRules.has(name)
        ? `${leading}${prelude} {${scopeComponentCss(body, scope)}${closing}`
        : `${raw}{${body}${closing}`;
    } else {
      const scopedSelector = splitTopLevelSelectors(prelude)
        .map((selector) => scopeComponentSelector(selector, scope))
        .filter(Boolean)
        .join(",\n");
      output += `${leading}${scopedSelector} {${body}${closing}`;
    }
    cursor = close + 1;
    preludeStart = cursor;
  }
  return output + css.slice(preludeStart);
}

// The package export stays readable for consumers and source-level proof. Static
// pages carry it twice (global and scoped); compacting only the emitted copy keeps
// the public docs smaller without changing selectors or declarations.
function compactCss(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    // Keep the whitespace around `+` inside calc(), where CSS requires it for
    // additive operators. Selector `+` combinators are still valid with their
    // surrounding whitespace, so they do not need this byte-saving pass.
    .replace(/\s*([{},;>~])\s*/g, "$1")
    .replace(/:\s+/g, ":")
    .replace(/;}/g, "}")
    .trim();
}

// Keep readable declaration spacing used by the emitted semantic contracts while
// removing indentation from the global copy. This changes no declaration or selector.
function compactGlobalCss(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^[ \t]+/gm, "").replace(/\n[ \t]*\n/g, "\n").replace(/([{};,])\n/g, "$1").trim();
}

// SettingsLayout and its controls are already present in the global package CSS above.
// Keep their container-query block out of the scoped duplicate so adding a reusable
// package family does not make every large proof page pay for the same rules twice.
const settingsContractCssStart = tcrnComponentCss.indexOf("/* DS-106/107 settings contract. */");
const scopedComponentCss = settingsContractCssStart === -1
  ? tcrnComponentCss
  : tcrnComponentCss.slice(0, settingsContractCssStart);
const fullSurfaceContractCssStart = tcrnComponentCss.indexOf("/* DS-113/114/115 full-surface boundary and content rules.");
const pageHierarchyContractCssStart = tcrnComponentCss.indexOf("/* DS-112 page hierarchy contract. */");
const prePageHierarchyComponentCss = pageHierarchyContractCssStart === -1
  ? tcrnComponentCss
  : tcrnComponentCss.slice(0, pageHierarchyContractCssStart);
const fullSurfaceContractCssEnd = pageHierarchyContractCssStart === -1 ? tcrnComponentCss.length : pageHierarchyContractCssStart;
const fullSurfaceContractCss = fullSurfaceContractCssStart === -1
  ? ""
  : tcrnComponentCss.slice(fullSurfaceContractCssStart, fullSurfaceContractCssEnd);
const globalComponentCssWithoutFullSurface = fullSurfaceContractCssStart === -1
  ? prePageHierarchyComponentCss
  : `${prePageHierarchyComponentCss.slice(0, fullSurfaceContractCssStart)}${prePageHierarchyComponentCss.slice(fullSurfaceContractCssEnd)}`;
const globalComponentCss = globalComponentCssWithoutFullSurface;
// TCRN-DS-SUB-131: the documentation pages render inside the package ProductShell, so the shell's
// own rules (shell.css.ts, shell-intro.css.ts and shell-sheet.css.ts, the last segments of the
// package sheet, after the page hierarchy contract) travel on every page; only the page hierarchy
// contract itself stays with the pages that render a page hierarchy.
// TCRN-DS-SUB-170 (STORY-147, 149): the shell layer is cut at the package's own segment marker,
// written once in front of the first shell rule (TCRN-DS-SUB-145), not at the brand button's first
// rule. A sheet without the marker, with it more than once, or with it ahead of the page hierarchy
// contract fails the build here instead of dropping or doubling the shell's rules silently.
const shellLayerMarker = "/* tcrn:shell-layer-start */";
const shellLayerMarkerCount = tcrnComponentCss.split(shellLayerMarker).length - 1;
if (shellLayerMarkerCount === 0) {
  throw new Error("doc_shell_package_css_layer_marker_missing");
}
if (shellLayerMarkerCount > 1) {
  throw new Error("doc_shell_package_css_layer_marker_repeated");
}
const shellLayerMarkerAt = tcrnComponentCss.indexOf(shellLayerMarker);
if (pageHierarchyContractCssStart === -1 || shellLayerMarkerAt < pageHierarchyContractCssStart) {
  throw new Error("doc_shell_package_css_segments_moved");
}
// The marker comment itself stays out of both slices; the shell layer starts right after it.
const shellComponentCssStart = shellLayerMarkerAt + shellLayerMarker.length;
const pageHierarchyComponentCss = tcrnComponentCss.slice(pageHierarchyContractCssStart, shellLayerMarkerAt);
const shellComponentCss = tcrnComponentCss.slice(shellComponentCssStart);
// The retired navigation parts (TopBar, SideNav, the launchers and the old toggles) are still
// exported but their rules left tcrnComponentCss for tcrnRetiredComponentCss (TCRN-DS-SUB-125). A
// page whose stories still render one takes the retired sheet, as a consumer would; others do not.
const retiredComponentClasses = [...new Set(tcrnRetiredComponentCss.match(/(?<=\.)tcrn-[A-Za-z0-9_-]+/g) ?? [])];
function usesRetiredComponent(mainBody: string): boolean {
  return retiredComponentClasses.some((className) => new RegExp(`class="(?:[^"]* )?${className}(?:[ "])`).test(mainBody));
}
// The older scoped copy has a `.story-body .tcrn-setting-row` rule. Re-apply
// only the settings-specific container overrides after that copy. Wide rows must
// inherit the complete form/list tracks, including the empty tools slots.
const settingsScopedOverrides = `
.story-body .tcrn-settings-layout__content{grid-template-columns:minmax(0,1fr)}
.story-body .tcrn-settings-layout__form .tcrn-setting-row{grid-template-columns:minmax(0,1fr);gap:var(--tcrn-space-2)}
.story-body .tcrn-settings-layout__form :is(.tcrn-setting-row__control,.tcrn-setting-row__tools){grid-column:auto;grid-row:auto}
@container tcrn-settings-content (width < 720px){.story-body .tcrn-settings-layout__form{grid-template-columns:minmax(0,1fr)}}
@container tcrn-settings-content (min-width:720px){.story-body .tcrn-settings-layout__form>.tcrn-setting-row,.story-body .tcrn-settings-layout__form .tcrn-setting-row-list .tcrn-setting-row{grid-template-columns:subgrid}.story-body .tcrn-settings-layout__form .tcrn-setting-row__tools{justify-content:flex-end}}
`;
// TCRN-DS-SUB-165 (STORY-138, 139, 140, 142, 147, 149): the scoped copy replays the package order
// inside a story body, so it carries the shell's own segments (shellCss*, shellIntroCss* and
// shellSheetCss*, the same slice the pages take globally above) after the scoped family segments and
// the settings overrides, last as they are in tcrnComponentCss. Without them every scoped family rule
// (one class more, and a later sheet) out-ranked the shell rule it loses to in the package: the
// shell stories read the old NavItem and NavGroup type, a 260 search in the full menu and the
// drop-down, the pinned group still shown at 1024 and up, and no static hover. The segment is the
// one cut at the shell layer marker above (TCRN-DS-SUB-170).
const staticStoryComponentCss = compactCss(
  `${scopeComponentCss(scopedComponentCss, ".story-body")}${settingsScopedOverrides}${scopeComponentCss(shellComponentCss, ".story-body")}`
);

function globalComponentCssForBody(mainBody: string): string {
  const pageCss = mainBody.includes("data-page-hierarchy")
    ? globalComponentCss + pageHierarchyComponentCss + shellComponentCss
    : globalComponentCss + shellComponentCss;
  const needsFullSurfaceCss = /data-tooltip-scope|data-overlay-scope|data-dictionary-category|data-choice-cardinality|data-choice-value-mode/u.test(mainBody);
  const surfaceCss = needsFullSurfaceCss ? `${pageCss}${fullSurfaceContractCss}` : pageCss;
  return usesRetiredComponent(mainBody) ? `${surfaceCss}${tcrnRetiredComponentCss}` : surfaceCss;
}

function alphaStoryCssForBody(mainBody: string): string {
  if (mainBody.includes("data-page-hierarchy")) return alphaStoryCss;
  return alphaStoryCss.replace(/  --tcrn-container-page-third-level-(?:split|nav): [^;]+;\n/g, "");
}

// TCRN-DS-SUB-131 (STORY-147): the documentation pages wear the one shell there is, the package
// ProductShell in its top-band state (07a board, section A; Shell-2 board, section E: the
// documentation site uses the same top band, with its contents and bookmarks in the page). There
// is no documentation header, rail or rail toggle any more: the brand button opens the full menu,
// whose first column is the documentation sections and whose other columns hold each section's
// categories; the band pins every section but Welcome (six, --tcrn-shell-pins-max); the avatar menu
// holds the theme and the language; the paper holds the page header, the page and, in the page,
// the TocRail with this page's contents. tcrn-doc-* is left to the documentation's own layout and
// typography inside the paper.
type DocPageKind = "index" | "category" | "reference";

interface DocShellPage {
  kind: DocPageKind;
  group: ContractStoryGroup;
  activeCategoryId: string;
  /** The page's title in a locale: its section, its category or its reference page. */
  title: (locale: TcrnLocale) => string;
  /** The page's own contents for the TocRail, in a locale. */
  toc: (locale: TcrnLocale) => TocItem[];
}

const docShellBodyMarker = "<!--tcrn-doc-page-body-->";

function docSectionItemId(group: ContractStoryGroup): string {
  return `section-${groupSlug(group)}`;
}

function docCategoryItemId(group: ContractStoryGroup, categoryId: string): string {
  return `category-${groupSlug(group)}-${categorySlug(categoryId)}`;
}

// The menu model (C-7): the sections, then one column per section with its categories. Every row
// is a link: a static page has no client React to open a cascade, so the stories stay in the
// category page's own TocRail rather than a third menu level.
function docMenuModel(page: DocShellPage, locale: TcrnLocale): ProductShellNavGroup[] {
  const sections: ProductShellNavGroup = {
    id: "sections",
    label: localeText("shell.topNavLabel", locale),
    items: contractStoryGroups.map((group) => ({
      id: docSectionItemId(group),
      label: localeText(`group.${group}`, locale),
      href: groupFileName(group),
      iconName: navGroupIcons[group],
      selected: page.kind === "index" && group === page.group
    }))
  };
  const columns = contractStoryGroups.map((group): ProductShellNavGroup => ({
    id: `group-${groupSlug(group)}`,
    label: localeText(`group.${group}`, locale),
    iconName: navGroupIcons[group],
    items: storyCategoriesForGroup(group, contractStoriesByGroup(group)).map((category) => ({
      id: docCategoryItemId(group, category.id),
      label: localeText(category.label, locale),
      href: categoryFileName(group, category.id),
      selected: page.kind !== "index" && group === page.group && category.id === page.activeCategoryId
    }))
  }));
  return [sections, ...columns];
}

function docBreadcrumbs(page: DocShellPage, locale: TcrnLocale): PageHeaderBreadcrumb[] {
  const sectionLabel = localeText(`group.${page.group}`, locale);
  if (page.kind === "index") return [{ id: "doc-crumb-section", label: sectionLabel }];
  return [
    { id: "doc-crumb-section", label: sectionLabel, href: groupFileName(page.group) },
    { id: "doc-crumb-page", label: page.title(locale) }
  ];
}

// One render of the shell around a marker for the page body. `open` renders the two layers a
// static page opens without React, the full menu and the avatar menu, so their markup can be
// carried hidden and opened by docShellLayerScript.
function docShellMarkup(page: DocShellPage, locale: TcrnLocale, open: boolean): string {
  return renderToStaticMarkup(
    <ProductShell
      productName={localeText("shell.brand", locale)}
      moduleName={localeText("shell.brand", locale)}
      brandProductId="design-system"
      currentRouteLabel={page.title(locale)}
      navGroups={docMenuModel(page, locale)}
      locales={tcrnLocaleMetadata}
      currentLocale={locale}
      pageHeader={{ title: page.title(locale), breadcrumbs: docBreadcrumbs(page, locale) }}
      pinnedIds={contractStoryGroups.filter((group) => group !== "Welcome").map(docSectionItemId)}
      menuOpen={open}
      accountMenuOpen={open}
      searchPlaceholder={localeText("shell.searchLabel", locale)}
      onSearchQueryChange={() => undefined}
      contentId="content"
      contentRole="main"
      contentLabel={page.title(locale)}
      skipLinkLabel={localeText("shell.skip", locale)}
      data-shell="doc"
      data-doc-shell="online-docs"
      data-contract-surface="tcrn-design-system-storybook"
      data-anchor-scroll-controlled="true"
      data-active-story-section={page.group}
      data-storybook-locale={tcrnDefaultLocale}
      data-storybook-supported-locales={tcrnSupportedLocales.join(",")}
      data-storybook-theme="light"
      data-storybook-supported-themes="light,dark"
      data-tcrn-theme="light"
    >
      <div className="tcrn-doc-page" data-doc-page={page.kind}>
        <div className="tcrn-doc-page__body" dangerouslySetInnerHTML={{ __html: docShellBodyMarker }} />
        <div className="tcrn-doc-page__toc" data-doc-toc="">
          <TocRail label={localeText("shell.onThisPageLabel", locale)} items={page.toc(locale)} />
        </div>
      </div>
    </ProductShell>,
    { identifierPrefix: "tcrn-doc-shell-" }
  );
}

// The element that opens at `start` (a tag name and the index of its `<`) ends after the index
// this returns: the matching close tag, counted through nested tags of the same name.
function closingTagEnd(html: string, start: number, tag: string): number {
  const tags = new RegExp(`<${tag}\\b|</${tag}>`, "g");
  tags.lastIndex = start;
  let depth = 0;
  for (let match = tags.exec(html); match; match = tags.exec(html)) {
    depth += match[0] === `</${tag}>` ? -1 : 1;
    if (depth === 0) return match.index + match[0].length;
  }
  throw new Error(`doc_shell_unclosed_${tag}`);
}

function sliceElement(html: string, marker: string, tag: string): string {
  const at = html.indexOf(marker);
  if (at === -1) throw new Error(`doc_shell_markup_missing:${marker}`);
  const start = html.lastIndexOf(`<${tag}`, at);
  return html.slice(start, closingTagEnd(html, start, tag));
}

function setAttributes(html: string, marker: string, attributes: string): string {
  const at = html.indexOf(marker);
  if (at === -1) throw new Error(`doc_shell_markup_missing:${marker}`);
  const tagEnd = html.indexOf(">", at);
  return `${html.slice(0, tagEnd)} ${attributes}${html.slice(tagEnd)}`;
}

function attributeValue(html: string, marker: string, name: string): string {
  const at = html.indexOf(marker);
  const tagStart = html.lastIndexOf("<", at);
  const tag = html.slice(tagStart, html.indexOf(">", at));
  const value = new RegExp(`\\s${name}="([^"]*)"`).exec(tag)?.[1];
  if (value === undefined) throw new Error(`doc_shell_attribute_missing:${marker}:${name}`);
  return value;
}

// The page's shell: the closed render, with the open render's full menu and avatar menu carried
// hidden in the places React would mount them, and the hooks the documentation scripts use.
function docShellHtml(page: DocShellPage, locale: TcrnLocale = tcrnDefaultLocale): string {
  const closed = docShellMarkup(page, locale, false);
  const open = docShellMarkup(page, locale, true);
  const menu = sliceElement(open, 'data-shell-menu=""', "div")
    .replace('data-shell-menu=""', 'data-shell-menu="" hidden=""')
    .replace("<input role=\"combobox\"", "<input data-doc-search-input=\"\" role=\"combobox\"")
    .replace('data-product-shell-search-results="true"', 'data-product-shell-search-results="true" data-doc-search-results=""');
  const account = sliceElement(open, 'data-panel="account"', "section")
    .replace('data-panel="account"', 'data-panel="account" hidden=""')
    .replace('data-shell-control="theme-toggle"', 'data-shell-control="theme-toggle" data-storybook-theme-toggle="" data-storybook-theme-option="dark" data-theme-label-key="shell.themeDarkLabel" aria-pressed="false"')
    .replace('data-shell-control="locale-menu"', 'data-shell-control="locale-menu" data-locale-menu-root=""');
  const localeSelect = `<select id="tcrn-doc-locale" data-i18n-locale-select data-i18n-aria-label="shell.languageLabel" aria-label="${escapeHtml(localeText("shell.languageLabel", locale))}" tabindex="-1" aria-hidden="true" hidden>${tcrnLocaleMetadata.map((metadata) => `<option value="${metadata.locale}">${metadata.nativeName}</option>`).join("")}</select>`;
  const expandedLabel = attributeValue(open, 'data-shell-brand="', "aria-label");
  const collapsedLabel = attributeValue(closed, 'data-shell-brand="', "aria-label");
  let html = setAttributes(closed, 'data-shell-brand="', `data-expanded-label="${expandedLabel}" data-collapsed-label="${collapsedLabel}"`);
  // The wordmark is the brand asset's own words (Logos board, section E) and reads the same in every
  // language: the page's string swap leaves every brand wordmark alone by its class (client-scripts.ts,
  // TCRN-DS-SUB-166), so the shell needs no data-locale-invariant, which is the English-leak ledger's.
  const avatarEnd = html.indexOf("</button>", html.indexOf('data-shell-avatar=""')) + "</button>".length;
  html = `${html.slice(0, avatarEnd)}${account}${localeSelect}${html.slice(avatarEnd)}`;
  const stripEnd = html.indexOf("</header>") + "</header>".length;
  return `${html.slice(0, stripEnd)}${menu}${html.slice(stripEnd)}`;
}

// The shell's own words are the package's, in five languages. The page is built in English and
// the browser swaps strings through the content dictionary, so the dictionary takes the shell's
// strings from the same render in every locale: the markup is the same element for element, and
// the n-th text or translatable attribute of one render is the n-th of the others.
const docShellTextPattern = /\s(title|aria-label|placeholder|data-label|data-expanded-label|data-collapsed-label)="([^"]*)"|>([^<]+)</g;

function docShellTexts(html: string): string[] {
  const texts: string[] = [];
  for (const match of html.matchAll(docShellTextPattern)) {
    const text = decodeEntities(match[2] ?? match[3] ?? "").trim();
    if (text) texts.push(text);
  }
  return texts;
}

function docShellTranslations(page: DocShellPage): Record<string, Record<TcrnLocale, string>> {
  const source = docShellTexts(docShellHtml(page, tcrnDefaultLocale));
  const translated = tcrnSupportedLocales.map((locale) => [locale, docShellTexts(docShellHtml(page, locale))] as const);
  const entries: Record<string, Record<TcrnLocale, string>> = {};
  for (const [locale, texts] of translated) {
    if (texts.length !== source.length) throw new Error(`doc_shell_locale_markup_differs:${locale}`);
  }
  source.forEach((text, index) => {
    if (entries[text] || translated.every(([, texts]) => texts[index] === text)) return;
    entries[text] = Object.fromEntries(translated.map(([locale, texts]) => [locale, texts[index]])) as Record<TcrnLocale, string>;
  });
  return entries;
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
  return `<section class="tcrn-doc-static-section" id="${groupSlug(group)}" data-story-section="${group}">
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
  <h2 class="tcrn-doc-story-disclosure__heading"><button type="button" class="tcrn-doc-story-disclosure" aria-expanded="false" aria-controls="${story.id}-region" data-story-disclosure="${story.id}"><span class="tcrn-doc-story-disclosure__title">${i18nText(`story.${story.id}.title`)}</span><span class="tcrn-doc-story-disclosure__chevron" aria-hidden="true">${iconHtml("chevron-right", "tcrn-doc-story-disclosure__chevron-svg", "story-disclosure")}</span></button></h2>
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
  return `<section class="tcrn-doc-static-section tcrn-doc-static-section--category-index" id="${groupSlug(group)}" data-doc-category-index="${group}">
  <ol class="tcrn-doc-category-index">
${categories.map((category) => {
  const categoryLabel = localeText(category.label);
  return `    <li class="tcrn-doc-category-index__category" data-doc-category-index-item="${escapeHtml(category.id)}">
      <a class="tcrn-link tcrn-doc-category-index__link" href="${categoryFileName(group, category.id)}" data-doc-category-link="${escapeHtml(category.id)}">
        <span class="tcrn-doc-category-index__label" data-i18n="${escapeHtml(category.label)}">${escapeHtml(categoryLabel)}</span>
        <span class="tcrn-doc-category-index__count" aria-label="${category.stories.length} ${escapeHtml(localeText("shell.storiesCountLabel"))}">${category.stories.length}</span>
      </a>
      <span class="tcrn-sr-only" data-i18n="${escapeHtml(category.description)}">${escapeHtml(localeText(category.description))}</span>
      <ol class="tcrn-doc-category-index__stories">
${category.stories.map((story) => `        <li><a class="tcrn-link tcrn-doc-category-index__story" href="${categoryFileForStory(story)}#${story.id}" data-doc-category-story-link="${story.id}">${i18nText(`story.${story.id}.title`)}</a></li>`).join("\n")}
      </ol>
    </li>`;
}).join("\n")}
  </ol>
</section>`;
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
  return `<nav class="tcrn-doc-chapter-pager" aria-label="${escapeHtml(localeText("shell.chapterNavLabel"))}" data-i18n-aria-label="shell.chapterNavLabel" data-doc-chapter-pager="true">
  ${previous}
  ${next}
</nav>`;
}

// The governed-section boundary leads every page body under the page header: the three
// no-overclaim claims stay visible. The page's title is the page header's and its contents are the
// TocRail's (TCRN-DS-SUB-131), so this block keeps only the boundary.
function pageHeadHtml(): string {
  return `<section class="tcrn-doc-page-head" aria-label="${escapeHtml(localeText("shell.governedSectionLabel"))}" data-i18n-aria-label="shell.governedSectionLabel" data-doc-page-head="governed-section" data-mandatory-boundary-block="visible" data-no-overclaim-boundary="visible">
  <span class="tcrn-doc-page-head__eyebrow">${i18nText("shell.governedSectionLabel")}</span>
  <div class="tcrn-doc-boundary-strip" data-governance-boundary-strip="visible">
    <span>${i18nText("shell.noPackagePublicationClaim")}</span>
    <span>${i18nText("shell.noProductAdoptionClaim")}</span>
    <span>${i18nText("shell.acceptanceDownstreamClaim")}</span>
  </div>
</section>`;
}

// TCRN-DS-STORY-056: the shared document used by the section index page, every category page and
// the reference pages. Everything except the page body, the menu's current row, the page header and
// the TocRail is identical between them.
function renderContractDocument(options: { page: DocShellPage; pageTitleText: string; mainBody: string }): string {
  const { page, pageTitleText, mainBody } = options;
  const shell = docShellHtml(page);
  const body = `${pageHeadHtml()}
${mainBody}
${chapterPagerHtml(page.group)}`;
  // TCRN-DS-STORY-054: prune the embedded content-translation dictionary to only the entries
  // whose English source actually renders inside this page's [data-contract-surface]. The runtime
  // swap (translateContentTree in client-scripts.ts) skips SCRIPT/STYLE, so the <style> blocks and
  // scripts are excluded from the match here too — this covers every text node and translatable
  // attribute the swap can touch. Match on the entity-decoded body so build-time escaping equals
  // the runtime text value. This is a deliberate SUPERSET: over-inclusion only costs bytes, whereas
  // under-inclusion would leak English after a locale switch, so err toward including. The shell's
  // own strings come from its renders in every locale; a dictionary entry for the same English
  // source wins.
  const translatableSurface = decodeEntities(`${shell}\n${body}`);
  const usedContentTranslations = {
    ...docShellTranslations(page),
    ...Object.fromEntries(Object.entries(storybookContentText).filter(([source]) => translatableSurface.includes(source)))
  };
  return `<!doctype html>
<html lang="${tcrnDefaultLocale}" data-tcrn-theme="light">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light dark" />
  <meta name="theme-color" content="${storybookCanvasColors.light}" data-storybook-theme-color />
  <link rel="icon" href="tcrn-brand-mark.svg" type="image/svg+xml" />
  <link rel="alternate" type="application/json" href="ai-consumption-contract.json" title="TCRN AI consumption contract" data-tcrn-ai-consumption-contract="true" />
  <link rel="help" type="text/plain" href="llms.txt" data-tcrn-ai-consumption-contract-help="true" />
  <meta name="tcrn-ai-consumption-contract" content="ai-consumption-contract.json" />
  <meta name="tcrn-ai-consumption-contract-route" content="proof.html#ai-consumption-contract" />
  <meta name="tcrn-ai-consumption-contract-required" content="must-read-first" />
  <title>${pageTitleText} - ${localeText("shell.title")}</title>
  <style data-tcrn-component-style-source="@tcrn/ui-react" data-tcrn-doc-shell-component-style="package-backed">
${compactGlobalCss(globalComponentCssForBody(mainBody))}
  </style>
  <style data-tcrn-static-doc-style-source="storybook">
${alphaStoryCssForBody(mainBody)}
  </style>
  <style data-tcrn-component-style-source="@tcrn/ui-react" data-tcrn-product-shell-comparator-style="package-backed" data-tcrn-component-style-scope=".story-body">
${staticStoryComponentCss}
  </style>
</head>
<body>
${shell.replace(docShellBodyMarker, () => body)}
${hashRouteScript}
${activeStoryNavScript}
${storybookThemeScript}
${storybookI18nScript(usedContentTranslations)}
${docShellLayerScript}
${storybookSearchIndexJson()}
${storybookSearchScript}
${dialogFixtureScript}
${storyDisclosureScript}
${tableToolbarScript}
<script type="module">import { mountStaticMultiSelect, mountStaticClipboardCopyButton } from "./ds-static-bridges.js"; for (const root of document.querySelectorAll("[data-choice-presentation=dropdown]")) mountStaticMultiSelect({ root }); for (const root of document.querySelectorAll("button[data-clipboard-text]")) mountStaticClipboardCopyButton({ root });</script>
${shellHydrateScript(body)}
${anchorScrollScript}
</body>
</html>
`;
}

// TCRN-DS-SUB-151: a page that carries shell story blocks mounts them (build/shell-hydrate.tsx,
// bundled as ds-shell-hydrate.js by build.tsx). A module script runs after the page's own scripts,
// so the language script has left window.tcrnStorybookTextFor and the resolved locale for it.
function shellHydrateScript(body: string): string {
  if (!body.includes("data-shell-hydrate=")) return "";
  return '<script type="module">import { mountShellStories } from "./ds-shell-hydrate.js"; mountShellStories(document);</script>';
}

// Section INDEX page: the shell, the boundary and a bounded category-index body; the TocRail lists
// the section's categories. The menu's current row is the section's.
export function sectionIndexHtml(group: ContractStoryGroup): string {
  const stories = contractStoriesByGroup(group);
  const activeStory = stories[0];
  if (!activeStory) {
    throw new Error(`missing_story_for_group:${group}`);
  }
  const categories = storyCategoriesForGroup(group, stories);
  return renderContractDocument({
    page: {
      kind: "index",
      group,
      activeCategoryId: activeStory.categoryId,
      title: (locale) => localeText(`group.${group}`, locale),
      toc: (locale) => categories.map((category) => ({ id: category.id, label: localeText(category.label, locale), href: categoryFileName(group, category.id) }))
    },
    pageTitleText: localeText(`group.${group}`),
    mainBody: sectionIndexBodyHtml(group)
  });
}

// Category page: the shell, the boundary and ONLY this category's story bodies; the TocRail lists
// them, the first one current until the reader scrolls. The menu's current row is the category's.
export function categoryPageHtml(group: ContractStoryGroup, categoryId: string, categoryLabel: string): string {
  const stories = contractStoriesByGroup(group).filter((story) => story.categoryId === categoryId);
  const activeStory = stories[0];
  if (!activeStory) {
    throw new Error(`missing_story_for_category:${group}:${categoryId}`);
  }
  return renderContractDocument({
    page: {
      kind: "category",
      group,
      activeCategoryId: categoryId,
      title: (locale) => localeText(categoryLabel, locale),
      toc: (locale) => stories.map((story, index) => ({ id: story.id, label: localeText(`story.${story.id}.title`, locale), href: `#${story.id}`, current: index === 0 }))
    },
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
    ? `<p class="tcrn-doc-component-reference__empty">${i18nText("reference.noProps")}</p>`
    : `<div class="tcrn-doc-reference-table-scroll">
      <table class="tcrn-doc-reference-table">
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
    : `<p class="tcrn-doc-component-reference__facet">${i18nText("reference.variants")}: ${variantKeys.map((axis) =>
        `<code>${escapeHtml(axis)}</code> (${component.variants[axis].map((value) => `<code>${escapeHtml(String(value))}</code>`).join(", ")})`).join("; ")}</p>`;
  const slotsBody = component.slots.length === 0
    ? ""
    : `<p class="tcrn-doc-component-reference__facet">${i18nText("reference.slots")}: ${component.slots.map((slot) => `<code>${escapeHtml(slot)}</code>`).join(", ")}</p>`;
  return `      <article class="tcrn-doc-component-reference" data-component-reference-id="${escapeHtml(component.name)}" id="${anchor}">
        <h2 class="tcrn-heading"><code>${escapeHtml(component.name)}</code></h2>
        <p class="tcrn-doc-component-reference__meta">${i18nText("reference.propsType")}: ${propsType}</p>
        ${propsBody}
        ${variantsBody}
        ${slotsBody}
      </article>`;
}

function referenceBodyHtml(page: ReferencePage): string {
  return `<section class="alpha-story-stack" data-reference-page="${page.pageIndex}">
      <p class="tcrn-doc-component-reference__intro">${i18nText("reference.intro")}</p>
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
    page: {
      kind: "reference",
      group: "Components",
      activeCategoryId: indexStory.categoryId,
      title: (locale) => `${localeText("reference.pageTitle", locale)} ${page.pageIndex}`,
      toc: () => page.components.map((component) => ({ id: referenceComponentAnchor(component.name), label: component.name, href: `#${referenceComponentAnchor(component.name)}` }))
    },
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
