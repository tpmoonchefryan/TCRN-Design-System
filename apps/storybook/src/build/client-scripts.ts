import { tcrnDefaultLocale, tcrnFallbackLocale, tcrnSupportedLocales, type TcrnLocale } from "@tcrn/ui-copy-state";
import { createResolvedTokenMap } from "@tcrn/ui-tokens";
import { contractStories, contractStoriesByGroup, contractStoryGroups } from "../stories.js";
import { storybookLocaleText } from "./i18n.js";
import { categoryFileForStory, categoryFileName, groupFileName, groupSlug, storyCategoriesForGroup } from "./navigation.js";

function canvasColor(theme: "light" | "dark"): string {
  const value = createResolvedTokenMap(theme)["--tcrn-color-bg"];
  if (!/^#[0-9a-f]{6}$/i.test(value ?? "")) {
    throw new Error(`storybook_canvas_token_unresolved:${theme}:${value ?? "missing"}`);
  }
  return value;
}

// The docs canvas paints with the G+ ground token --tcrn-color-bg. The first-paint
// theme-color meta (page-template.tsx) and the theme-switch mirror below read the light and
// dark values from @tcrn/ui-tokens instead of keeping a hand-copied pair.
export const storybookCanvasColors = Object.freeze({
  light: canvasColor("light"),
  dark: canvasColor("dark")
});

export const hashRouteScript = `<script>
(() => {
  const routes = ${JSON.stringify({
    // Section-slug -> section INDEX page (unchanged): #components -> components.html.
    ...Object.fromEntries(contractStoryGroups.map((group) => [groupSlug(group), groupFileName(group)])),
    // Story-id -> its CATEGORY page (TCRN-DS-STORY-056): a legacy deep link such as
    // components.html#button-spec-usage lands on the components INDEX page, whose
    // hashRouteScript redirects to components-controls-data.html#button-spec-usage.
    // Landing directly on the category page is a no-op (currentFile === targetFile), so
    // there is no redirect loop.
    ...Object.fromEntries(contractStories.map((story) => [story.id, `${categoryFileForStory(story)}#${story.id}`]))
  })};
  const target = routes[window.location.hash.replace("#", "")];
  const [targetFile, targetHash] = target ? target.split("#") : ["", ""];
  const currentFile = window.location.pathname.split("/").pop() || "index.html";
  const targetHashValue = targetHash ? "#" + targetHash : "";
  if (target && (currentFile !== targetFile || (targetHashValue && window.location.hash !== targetHashValue))) {
    window.location.replace(targetFile + window.location.search + targetHashValue);
  }
})();
</script>`;

export const storybookThemeScript = `<script>
(() => {
  const supportedThemes = ["light", "dark"];
  const defaultTheme = "light";
  const storageKey = "tcrn-design-system-storybook-theme";
  const themeColors = {
    light: ${JSON.stringify(storybookCanvasColors.light)},
    dark: ${JSON.stringify(storybookCanvasColors.dark)}
  };
  const themeTransitionMs = 400;
  const isSupported = (theme) => supportedThemes.includes(theme);
  const prefersReducedMotion = () => {
    try {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      return false;
    }
  };
  const readStoredTheme = () => {
    try {
      return window.localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  };
  const writeStoredTheme = (theme) => {
    try {
      window.localStorage.setItem(storageKey, theme);
    } catch {
      // Local persistence is helpful, not required for the static proof surface.
    }
  };
  const themedLinks = () => document.querySelectorAll("[data-shell-menu] a[href], [data-pins] a[href], [data-doc-toc] a[href]:not([href^='#']), .tcrn-page-header nav a[href], .tcrn-doc-chapter-pager__link");
  // A link inside a block React renders (the documentation shell, the shell story screens) carries
  // the page's preferences in the href React gives it (build/shell-hydrate.tsx); only the static page
  // body's links are rewritten here. The documentation shell's page body is static markup.
  const inMountedShell = (node) => Boolean(node.closest?.("[data-shell-hydrate], [data-doc-page-body]")?.matches("[data-shell-hydrate]"));
  const updateThemeLinks = (theme) => {
    const shell = document.querySelector("[data-contract-surface]");
    const currentLocale = shell?.getAttribute("data-storybook-locale");
    for (const link of themedLinks()) {
      const href = link.getAttribute("href");
      if (!href || inMountedShell(link)) {
        continue;
      }
      const next = new URL(href, window.location.href);
      next.searchParams.set("theme", theme);
      if (currentLocale) {
        next.searchParams.set("locale", currentLocale);
      }
      const file = next.pathname.split("/").pop() || "index.html";
      link.setAttribute("href", file + next.search + next.hash);
    }
  };
  const commitTheme = (theme, updateUrl) => {
    const resolvedTheme = isSupported(theme) ? theme : defaultTheme;
    const shell = document.querySelector("[data-contract-surface]");
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
    window.tcrnStorybookResolvedTheme = resolvedTheme;
    document.documentElement.setAttribute("data-tcrn-theme", resolvedTheme);
    document.documentElement.style.colorScheme = resolvedTheme;
    shell?.setAttribute("data-storybook-theme", resolvedTheme);
    shell?.setAttribute("data-tcrn-theme", resolvedTheme);
    shell?.setAttribute("data-product-shell-theme", resolvedTheme);
    const themeColor = document.querySelector("[data-storybook-theme-color]");
    themeColor?.setAttribute("content", themeColors[resolvedTheme] ?? themeColors.light);
    updateThemeLinks(resolvedTheme);
    writeStoredTheme(resolvedTheme);
    window.dispatchEvent(new CustomEvent("tcrn-storybook-theme-applied"));
    if (updateUrl) {
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set("theme", resolvedTheme);
      window.history.replaceState(null, "", nextUrl.pathname + nextUrl.search + nextUrl.hash);
    }
  };
  const runFallbackThemeTransition = (resolvedTheme, update) => {
    const overlay = document.createElement("div");
    overlay.className = "tcrn-doc-theme-transition-wash";
    overlay.setAttribute("aria-hidden", "true");
    overlay.style.background = themeColors[resolvedTheme] ?? themeColors.light;
    document.body.append(overlay);
    document.documentElement.setAttribute("data-theme-switching", "true");
    window.requestAnimationFrame(() => {
      overlay.setAttribute("data-active", "true");
      window.setTimeout(() => {
        update();
        overlay.removeAttribute("data-active");
        window.setTimeout(() => {
          overlay.remove();
          document.documentElement.removeAttribute("data-theme-switching");
        }, themeTransitionMs);
      }, themeTransitionMs);
    });
  };
  const applyTheme = (theme, updateUrl) => {
    const resolvedTheme = isSupported(theme) ? theme : defaultTheme;
    const previousTheme = window.tcrnStorybookResolvedTheme;
    const shouldAnimate = Boolean(updateUrl && previousTheme && previousTheme !== resolvedTheme && !prefersReducedMotion());
    if (!shouldAnimate) {
      commitTheme(resolvedTheme, updateUrl);
      return;
    }
    const update = () => commitTheme(resolvedTheme, updateUrl);
    const startViewTransition = document.startViewTransition?.bind(document);
    if (startViewTransition) {
      document.documentElement.setAttribute("data-theme-switching", "true");
      const transition = startViewTransition(update);
      Promise.resolve(transition.finished).finally(() => {
        document.documentElement.removeAttribute("data-theme-switching");
      });
      return;
    }
    runFallbackThemeTransition(resolvedTheme, update);
  };
  const urlTheme = new URL(window.location.href).searchParams.get("theme");
  const storedTheme = readStoredTheme();
  const initialTheme = isSupported(urlTheme) ? urlTheme : isSupported(storedTheme) ? storedTheme : defaultTheme;
  // The documentation shell's theme toggle is the package's (ShellThemeToggle in the avatar menu): its
  // onThemeChange calls this (build/shell-hydrate.tsx, TCRN-DS-SUB-201), and the shell follows
  // tcrn-storybook-theme-applied.
  window.tcrnStorybookApplyTheme = applyTheme;
  window.tcrnStorybookUpdateThemeLinks = () => updateThemeLinks(window.tcrnStorybookResolvedTheme ?? defaultTheme);
  window.addEventListener("tcrn-storybook-locale-applied", window.tcrnStorybookUpdateThemeLinks);
  applyTheme(initialTheme, false);
})();
</script>`;

// TCRN-DS-STORY-054: this script is emitted per page and now takes only the subset of the
// content-translation dictionary whose English sources actually render on that page (computed
// in page-template.tsx). The locale dictionary (`storybookLocaleText`, shell/nav/titles) stays
// WHOLE on every page — it is small and the nav/shell gates read every entry. Only the large
// content dictionary is pruned, which is where the ~370KB/page payload lived.
// TCRN-DS-SUB-079 gives a button with a disabled reason the title "label — reason". The dictionary
// holds the label and the reason, not the pair, so attributeTextFor translates such a value part by
// part (TCRN-DS-INIT-015 R2 integration item RM14).
export const storybookI18nScript = (pageContentTranslations: Record<string, Record<TcrnLocale, string>>) => `<script>
(() => {
  const supportedLocales = ${JSON.stringify(tcrnSupportedLocales)};
  const defaultLocale = ${JSON.stringify(tcrnDefaultLocale)};
  const fallbackLocale = ${JSON.stringify(tcrnFallbackLocale)};
  const translations = ${JSON.stringify(storybookLocaleText)};
  const contentTranslations = ${JSON.stringify(pageContentTranslations)};
  const storageKey = "tcrn-design-system-storybook-locale";
  const contentCanonicalLookup = new Map();
  for (const [source, localized] of Object.entries(contentTranslations)) {
    contentCanonicalLookup.set(source, source);
    for (const value of Object.values(localized)) {
      contentCanonicalLookup.set(value, source);
    }
  }
  const isSupported = (locale) => supportedLocales.includes(locale);
  const readStoredLocale = () => {
    try {
      return window.localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  };
  const writeStoredLocale = (locale) => {
    try {
      window.localStorage.setItem(storageKey, locale);
    } catch {
      // Local persistence is helpful, not required for the static proof surface.
    }
  };
  const textFor = (locale, key) => {
    return translations[locale]?.[key]
      ?? contentTranslations[key]?.[locale]
      ?? translations[fallbackLocale]?.[key]
      ?? contentTranslations[key]?.[fallbackLocale]
      ?? key;
  };
  const contentTextFor = (locale, value) => {
    const trimmed = String(value ?? "").trim();
    if (!trimmed) {
      return value;
    }
    const source = contentCanonicalLookup.get(trimmed);
    if (!source) {
      return value;
    }
    return contentTranslations[source]?.[locale] ?? contentTranslations[source]?.[fallbackLocale] ?? value;
  };
  // An attribute value the dictionary does not hold whole but that joins two parts with " — " (a
  // button title "label — reason") is translated on each side and joined again. A side the
  // dictionary does not hold stays as it is; when neither side is held the value is left alone.
  const partSeparator = " — ";
  const attributeTextFor = (locale, value) => {
    const trimmed = String(value ?? "").trim();
    if (contentCanonicalLookup.has(trimmed) || !trimmed.includes(partSeparator)) {
      return contentTextFor(locale, value);
    }
    const parts = trimmed.split(partSeparator);
    let partial = null;
    for (let cut = 1; cut < parts.length; cut += 1) {
      const sides = [parts.slice(0, cut).join(partSeparator), parts.slice(cut).join(partSeparator)];
      const held = sides.filter((side) => contentCanonicalLookup.has(side.trim())).length;
      const joined = sides.map((side) => contentTextFor(locale, side)).join(partSeparator);
      if (held === sides.length) {
        return joined;
      }
      if (held > 0 && partial === null) {
        partial = joined;
      }
    }
    return partial ?? value;
  };
  const searchShortcutLabel = () => {
    // TCRN-DS-STORY-060: show the platform-correct modifier — the Command glyph on Apple
    // platforms, Ctrl elsewhere. Keyboard shortcut labels are locale-invariant symbols, not
    // translated copy. (aria-keyshortcuts advertises both Control+K and Meta+K regardless.)
    const platform = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || navigator.userAgent || "";
    return /mac|iphone|ipad|ipod/i.test(platform) ? "⌘ K" : "Ctrl K";
  };
  // The shell story blocks and the documentation shell are mounted by React (build/shell-hydrate.tsx,
  // TCRN-DS-SUB-151, SUB-201), which renders them in the page's language itself: the swaps below leave
  // them alone, so the markup React hydrates is the markup it rendered. The documentation shell's page
  // body ([data-doc-page-body]) is the page's static markup inside it and is swapped as before; a shell
  // story block inside the body is React's again.
  const mountedShellBlock = "[data-shell-hydrate]";
  const staticPageBody = "[data-doc-page-body]";
  const inMountedShell = (node) => Boolean(node.closest?.(mountedShellBlock + ", " + staticPageBody)?.matches(mountedShellBlock));
  const applyClientShortcuts = () => {
    for (const node of document.querySelectorAll("[data-shortcut-auto='search']")) {
      if (inMountedShell(node)) {
        continue;
      }
      node.textContent = searchShortcutLabel();
    }
  };
  const translateTextNode = (node, locale) => {
    const current = node.nodeValue ?? "";
    const trimmed = current.trim();
    if (!trimmed) {
      return;
    }
    const next = contentTextFor(locale, trimmed);
    if (next !== trimmed) {
      node.nodeValue = current.replace(trimmed, next);
    }
  };
  const translateContentTree = (locale) => {
    const surface = document.querySelector("[data-contract-surface]");
    if (!surface) {
      return;
    }
    // Inside the documentation shell only its static page body is the swap's.
    const roots = inMountedShell(surface) ? Array.from(surface.querySelectorAll(staticPageBody)) : [surface];
    const skipTags = new Set(["SCRIPT", "STYLE"]);
    // Visual-instance oracles keep their words in every language, and so does the brand wordmark,
    // the brand asset's own words (Logos board, section E; TCRN-DS-SUB-166): the brand button's
    // word (its b and em), a lockup's first line (base and suffix), the first-line lockup's word (its
    // b and em; TCRN-DS-SUB-195) and the BrandWordmark. A lockup's description line is copy and is
    // swapped. The wordmark carriers here are the ones the English-leak ledger exempts and the axe
    // suffix exemption reads (apps/storybook/src/smoke.test.ts holds the three lists to one set).
    // data-locale-invariant belongs to the English-leak ledger (scripts/lib/locale-invariant-ledger.mjs),
    // not to this swap: a story that carries it (the AI contract story) is translated like any other.
    const visualInstanceSelector = "[data-storybook-visual-instance], .tcrn-shell-brand__word, .tcrn-product-logo__line-one, .tcrn-brand-lockup__word, .tcrn-brand-wordmark";
    const visit = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.parentElement?.closest(visualInstanceSelector)) {
          return;
        }
        translateTextNode(node, locale);
        return;
      }
      if (!(node instanceof Element) || skipTags.has(node.tagName)) {
        return;
      }
      if (node.matches(visualInstanceSelector) || node.matches(mountedShellBlock)) {
        return;
      }
      for (const attributeName of ["title", "aria-label", "data-label", "data-disabled-reason", "data-expanded-label", "data-collapsed-label", "placeholder"]) {
        const current = node.getAttribute(attributeName);
        if (current) {
          node.setAttribute(attributeName, attributeTextFor(locale, current));
        }
      }
      if (node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement) {
        const nextValue = contentTextFor(locale, node.value);
        if (nextValue !== node.value) {
          node.value = nextValue;
          node.setAttribute("value", nextValue);
        }
      }
      for (const child of Array.from(node.childNodes)) {
        visit(child);
      }
    };
    roots.forEach(visit);
  };
  const updateLocalizedLinks = (locale) => {
    const shell = document.querySelector("[data-contract-surface]");
    const currentTheme = shell?.getAttribute("data-storybook-theme");
    for (const link of document.querySelectorAll("[data-shell-menu] a[href], [data-pins] a[href], [data-doc-toc] a[href]:not([href^='#']), .tcrn-page-header nav a[href], .tcrn-doc-chapter-pager__link")) {
      const href = link.getAttribute("href");
      if (!href || inMountedShell(link)) {
        continue;
      }
      const next = new URL(href, window.location.href);
      next.searchParams.set("locale", locale);
      if (currentTheme) {
        next.searchParams.set("theme", currentTheme);
      }
      const file = next.pathname.split("/").pop() || "index.html";
      link.setAttribute("href", file + next.search + next.hash);
    }
  };
  const updateProductLogoAccessibleNames = () => {
    // ProductLogo composes its accessible name as wordmark + tagline. A composed
    // string can never be a dictionary key, so the exact-string swap above cannot
    // touch it: the visible brand read 组件库 while a screen reader still heard
    // "Component Library". Recompose it from the parts already rendered on the
    // page — after translateContentTree, the tagline text node is in the reader's
    // language, and a visual-instance subtree it deliberately skipped is still
    // consistent with itself.
    for (const logo of document.querySelectorAll("[data-registered-product-logo][data-product-id]")) {
      if (inMountedShell(logo)) {
        continue;
      }
      const wordmark = logo.querySelector(".tcrn-product-logo__line-one");
      const tagline = logo.querySelector(".tcrn-product-logo__line-two");
      const wordmarkText = (wordmark?.getAttribute("aria-label") ?? wordmark?.textContent ?? "").trim();
      const taglineText = (tagline?.textContent ?? "").trim();
      if (!wordmarkText || !taglineText) {
        continue;
      }
      logo.setAttribute("aria-label", wordmarkText + " " + taglineText);
    }
    // A first-line lockup (data-brand-lockup="line"; TCRN-DS-SUB-195) is named by its wordmark alone, and
    // the swap leaves its word alone: its name stays the word's own title (the whole name), as drawn, in
    // every language, where the exact-string swap would otherwise translate the name it holds whole.
    for (const lockup of document.querySelectorAll("[data-brand-lockup='line']")) {
      if (inMountedShell(lockup)) {
        continue;
      }
      const name = lockup.querySelector(".tcrn-brand-lockup__word")?.getAttribute("title")?.trim();
      if (name) {
        lockup.setAttribute("aria-label", name);
      }
    }
  };
  const applyLocale = (locale, updateUrl) => {
    const resolvedLocale = isSupported(locale) ? locale : defaultLocale;
    window.tcrnStorybookResolvedLocale = resolvedLocale;
    window.tcrnStorybookTextFor = textFor;
    const shell = document.querySelector("[data-contract-surface]");
    const activeSection = shell?.getAttribute("data-active-story-section") ?? "Welcome";
    document.documentElement.lang = resolvedLocale;
    shell?.setAttribute("data-storybook-locale", resolvedLocale);
    for (const node of document.querySelectorAll("[data-i18n]")) {
      node.textContent = textFor(resolvedLocale, node.getAttribute("data-i18n"));
    }
    for (const node of document.querySelectorAll("[data-i18n-aria-label]")) {
      node.setAttribute("aria-label", textFor(resolvedLocale, node.getAttribute("data-i18n-aria-label")));
    }
    for (const node of document.querySelectorAll("[data-i18n-title]")) {
      node.setAttribute("title", textFor(resolvedLocale, node.getAttribute("data-i18n-title")));
    }
    for (const node of document.querySelectorAll("[data-i18n-placeholder]")) {
      node.setAttribute("placeholder", textFor(resolvedLocale, node.getAttribute("data-i18n-placeholder")));
    }
    translateContentTree(resolvedLocale);
    // Must follow translateContentTree: it reads the tagline the swap just wrote.
    updateProductLogoAccessibleNames();
    applyClientShortcuts();
    document.title = textFor(resolvedLocale, "group." + activeSection) + " - " + textFor(resolvedLocale, "shell.title");
    updateLocalizedLinks(resolvedLocale);
    window.tcrnStorybookUpdateThemeLinks?.();
    writeStoredLocale(resolvedLocale);
    window.tcrnUpdateCurrentStoryContext?.();
    window.dispatchEvent(new CustomEvent("tcrn-storybook-locale-applied"));
    if (updateUrl) {
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set("locale", resolvedLocale);
      window.history.replaceState(null, "", nextUrl.pathname + nextUrl.search + nextUrl.hash);
    }
  };
  const urlLocale = new URL(window.location.href).searchParams.get("locale");
  const storedLocale = readStoredLocale();
  const initialLocale = isSupported(urlLocale) ? urlLocale : isSupported(storedLocale) ? storedLocale : defaultLocale;
  // The documentation shell's language menu is the package's (ShellLocaleMenu in the avatar menu): its
  // onLocaleChange calls this (build/shell-hydrate.tsx, TCRN-DS-SUB-201), and the shell follows
  // tcrn-storybook-locale-applied.
  window.tcrnStorybookApplyLocale = applyLocale;
  applyLocale(initialLocale, false);
})();
</script>`;

// TCRN-DS-SUB-131: the documentation search is the full menu's search and finds every section,
// category and story of the site. The rail that used to list every story on every page is gone,
// so the page carries the site's entries as data: dictionary keys for the labels (resolved in the
// reader's language when searching) and the destination of each.
let memoizedSearchIndexJson: string | undefined;
export function storybookSearchIndexJson(): string {
  if (memoizedSearchIndexJson === undefined) {
    const entries = contractStoryGroups.flatMap((group) => {
      const categories = storyCategoriesForGroup(group, contractStoriesByGroup(group));
      return [
        { label: `group.${group}`, href: groupFileName(group) },
        ...categories.flatMap((category) => [
          { label: category.label, group: `group.${group}`, href: categoryFileName(group, category.id) },
          ...category.stories.map((story) => ({ label: `story.${story.id}.title`, group: category.label, href: `${categoryFileForStory(story)}#${story.id}` }))
        ])
      ];
    });
    memoizedSearchIndexJson = `<script type="application/json" data-doc-search-index>${JSON.stringify(entries).replace(/</g, "\\u003c")}</script>`;
  }
  return memoizedSearchIndexJson;
}

export const storyDisclosureScript = `<script>
(() => {
  const articles = Array.from(document.querySelectorAll("article[data-story-collapsed]"));
  if (articles.length === 0) {
    return;
  }
  const setOpen = (article, open) => {
    article.setAttribute("data-story-collapsed", open ? "false" : "true");
    const toggle = article.querySelector("[data-story-disclosure]");
    if (toggle) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    }
  };
  for (const article of articles) {
    const toggle = article.querySelector("[data-story-disclosure]");
    if (toggle) {
      toggle.addEventListener("click", () => {
        setOpen(article, article.getAttribute("data-story-collapsed") === "true");
      });
    }
  }
  const expandForHash = () => {
    const id = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    if (!id) {
      return;
    }
    const target = document.getElementById(id);
    if (!target) {
      return;
    }
    const article = target.closest("article[data-story-collapsed]") || (target.matches("article[data-story-collapsed]") ? target : null);
    if (article) {
      setOpen(article, true);
    }
  };
  window.addEventListener("hashchange", expandForHash);
  expandForHash();
})();
</script>`;

export const tableToolbarScript = `<script>
(() => {
  for (const toolbar of document.querySelectorAll("[data-table-toolbar]")) {
    const target = document.getElementById(toolbar.getAttribute("data-table-toolbar-target") || "");
    if (!target) {
      continue;
    }
    const rows = Array.from(target.querySelectorAll('[role="row"]')).filter(
      (row) => !row.classList.contains("tcrn-table-shell__head")
    );
    const input = toolbar.querySelector("[data-table-toolbar-search]");
    const chips = Array.from(toolbar.querySelectorAll("[data-table-toolbar-filter]"));
    const count = toolbar.querySelector("[data-table-toolbar-count]");
    const collapse = toolbar.querySelector("[data-table-toolbar-collapse]");
    const countFormat = count ? count.getAttribute("data-table-toolbar-count") || "{shown} / {total}" : "";
    const apply = () => {
      const query = input ? input.value.trim().toLowerCase() : "";
      const active = chips.find((chip) => chip.getAttribute("aria-pressed") === "true");
      const filterKey = active ? active.getAttribute("data-table-toolbar-filter") || "" : "";
      let shown = 0;
      for (const row of rows) {
        const matchesQuery = !query || (row.textContent || "").toLowerCase().includes(query);
        const matchesFilter = !filterKey || Boolean(row.querySelector('[data-table-filter-key~="' + filterKey + '"]'));
        const visible = matchesQuery && matchesFilter;
        if (visible) {
          row.removeAttribute("hidden");
          shown += 1;
        } else {
          row.setAttribute("hidden", "");
        }
      }
      if (count) {
        count.textContent = countFormat.replace("{shown}", String(shown)).replace("{total}", String(rows.length));
      }
    };
    if (input) {
      input.addEventListener("input", apply);
    }
    for (const chip of chips) {
      chip.addEventListener("click", () => {
        for (const other of chips) {
          other.setAttribute("aria-pressed", other === chip ? "true" : "false");
        }
        apply();
      });
    }
    if (collapse) {
      collapse.addEventListener("click", () => {
        const open = collapse.getAttribute("aria-expanded") !== "false";
        collapse.setAttribute("aria-expanded", open ? "false" : "true");
        if (open) {
          target.setAttribute("hidden", "");
        } else {
          target.removeAttribute("hidden");
        }
      });
    }
    apply();
  }
})();
</script>`;

export const dialogFixtureScript = `<script>
(() => {
  const transitionMs = 260;
  const bindOverlayFixture = (fixture, openSelector, panelSelector, closeSelector) => {
    const openButton = fixture.querySelector(openSelector);
    const panel = fixture.querySelector(panelSelector);
    const dialog = panel?.querySelector("[role='dialog']");
    const closeButton = panel?.querySelector(closeSelector);
    if (!(openButton instanceof HTMLButtonElement) || !(panel instanceof HTMLElement) || !(dialog instanceof HTMLElement)) {
      return;
    }
    let transitionTimer = null;
    const setOpen = (open) => {
      if (transitionTimer) {
        window.clearTimeout(transitionTimer);
        transitionTimer = null;
      }
      openButton.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) {
        panel.setAttribute("data-overlay-transition-state", "closed");
        panel.hidden = false;
        panel.getBoundingClientRect();
        window.requestAnimationFrame(() => {
          panel.setAttribute("data-overlay-transition-state", "opening");
          const focusTarget = closeButton instanceof HTMLElement ? closeButton : dialog;
          focusTarget.focus({ preventScroll: true });
        });
        transitionTimer = window.setTimeout(() => {
          panel.setAttribute("data-overlay-transition-state", "open");
          transitionTimer = null;
        }, transitionMs);
        return;
      }
      panel.setAttribute("data-overlay-transition-state", "closing");
      transitionTimer = window.setTimeout(() => {
        panel.hidden = true;
        panel.setAttribute("data-overlay-transition-state", "closed");
        openButton.focus({ preventScroll: true });
        transitionTimer = null;
      }, transitionMs);
    };
    openButton.addEventListener("click", () => setOpen(openButton.getAttribute("aria-expanded") !== "true"));
    closeButton?.addEventListener("click", () => setOpen(false));
    fixture.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || panel.hidden) {
        return;
      }
      event.preventDefault();
      setOpen(false);
    });
  };
  for (const fixture of document.querySelectorAll("[data-dialog-proof='escape-focus-return']")) {
    bindOverlayFixture(fixture, "[data-dialog-fixture-open]", "[data-dialog-fixture-panel]", "[data-dialog-fixture-close]");
  }
  for (const fixture of document.querySelectorAll("[data-popover-proof='anchored-close-return']")) {
    bindOverlayFixture(fixture, "[data-popover-fixture-open]", "[data-popover-fixture-panel]", "[data-popover-fixture-close]");
  }
})();
</script>`;

export const anchorScrollScript = `<script>
(() => {
  const targetSelector = "[data-doc-toc] a, .tcrn-skip-link";
  const readOffset = () => {
    const source = document.documentElement;
    const raw = window.getComputedStyle(source).getPropertyValue("--tcrn-anchor-scroll-offset");
    const value = Number.parseFloat(raw);
    return Number.isFinite(value) ? value : 22;
  };
  const readHashId = (hash = window.location.hash) => {
    try {
      return decodeURIComponent(hash.replace(/^#/, ""));
    } catch {
      return hash.replace(/^#/, "");
    }
  };
  const isFirstStoryTarget = (target) => {
    if (!(target instanceof HTMLElement)) {
      return false;
    }
    if (!target.matches("[data-contract-story-id]")) {
      return false;
    }
    const section = target.closest("[data-story-section]");
    const firstStory = section?.querySelector("[data-contract-story-id]");
    return firstStory === target;
  };
  const scrollToHashTarget = () => {
    const targetId = readHashId();
    if (!targetId) {
      return false;
    }
    const target = document.getElementById(targetId);
    if (!target) {
      return false;
    }
    // TCRN-DS-SUB-131: the shell scrolls its paper, not the window.
    const scroller = document.getElementById("content");
    if (scroller && scroller !== target && scroller.contains(target)) {
      const nextScrollTop = isFirstStoryTarget(target)
        ? 0
        : Math.max(0, target.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - readOffset());
      scroller.scrollTo({ top: nextScrollTop, left: 0, behavior: "auto" });
      return true;
    }
    const nextTop = isFirstStoryTarget(target)
      ? 0
      : Math.max(0, target.getBoundingClientRect().top + window.scrollY - readOffset());
    window.scrollTo({ top: nextTop, left: 0, behavior: "auto" });
    return true;
  };
  const scheduleScrollToHashTarget = () => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(scrollToHashTarget);
    });
  };
  window.tcrnStorybookScrollToHash = scheduleScrollToHashTarget;
  document.addEventListener("click", (event) => {
    const source = event.target instanceof Element ? event.target.closest(targetSelector) : null;
    if (!(source instanceof HTMLAnchorElement)) {
      return;
    }
    const targetUrl = new URL(source.href, window.location.href);
    if (targetUrl.origin !== window.location.origin || targetUrl.pathname !== window.location.pathname || !targetUrl.hash) {
      return;
    }
    event.preventDefault();
    if (window.location.hash === targetUrl.hash) {
      scheduleScrollToHashTarget();
      return;
    }
    window.location.hash = targetUrl.hash.replace(/^#/, "");
  });
  window.addEventListener("hashchange", scheduleScrollToHashTarget);
  window.addEventListener("load", scheduleScrollToHashTarget);
  scheduleScrollToHashTarget();
})();
</script>`;

// TCRN-DS-SUB-131: the current story is marked in the page's own TocRail (aria-current="location"
// and the TocRail's selected state) as the reader scrolls the paper, which is the shell's scroller.
export const activeStoryNavScript = `<script>
(() => {
  const scroller = document.getElementById("content");
  const storyNodes = Array.from(document.querySelectorAll("article[data-story-id]"));
  const storyIds = storyNodes.map((node) => node.getAttribute("data-story-id")).filter(Boolean);
  const tocLinks = Array.from(document.querySelectorAll("[data-doc-toc] a[href^='#']"));
  let hashPinnedStoryId = null;
  let suppressScrollSpyUntil = 0;
  let scrollSpyFrame = 0;
  let currentStoryId = storyIds[0] ?? null;
  const readOffset = () => {
    const raw = window.getComputedStyle(document.documentElement).getPropertyValue("--tcrn-anchor-scroll-offset");
    const value = Number.parseFloat(raw);
    return Number.isFinite(value) ? value : 14;
  };
  const setActiveStoryNav = (storyId) => {
    if (!storyId) {
      return;
    }
    currentStoryId = storyId;
    for (const link of tocLinks) {
      const active = link.getAttribute("href") === "#" + storyId;
      if (active) {
        link.setAttribute("aria-current", "location");
        link.setAttribute("data-selected", "true");
      } else {
        link.removeAttribute("aria-current");
        link.removeAttribute("data-selected");
      }
    }
  };
  window.tcrnUpdateCurrentStoryContext = () => setActiveStoryNav(currentStoryId);
  const readCurrentStoryFromScroll = () => {
    if (!scroller) {
      return storyIds[0] ?? null;
    }
    const maxScrollTop = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
    if (maxScrollTop > 0 && scroller.scrollTop >= maxScrollTop - 2) {
      return storyIds[storyIds.length - 1] ?? null;
    }
    const threshold = scroller.getBoundingClientRect().top + readOffset() + 10;
    let activeStoryId = storyIds[0] ?? null;
    for (const node of storyNodes) {
      const storyId = node.getAttribute("data-story-id");
      if (!storyId) {
        continue;
      }
      const rect = node.getBoundingClientRect();
      if (rect.top <= threshold && rect.bottom > threshold) {
        activeStoryId = storyId;
        break;
      }
      if (rect.top <= threshold) {
        activeStoryId = storyId;
      }
    }
    return activeStoryId;
  };
  const syncFromScroll = () => {
    if (hashPinnedStoryId && Date.now() < suppressScrollSpyUntil) {
      return;
    }
    hashPinnedStoryId = null;
    setActiveStoryNav(readCurrentStoryFromScroll());
  };
  const scheduleScrollSpy = () => {
    if (scrollSpyFrame) {
      return;
    }
    scrollSpyFrame = window.requestAnimationFrame(() => {
      scrollSpyFrame = 0;
      syncFromScroll();
    });
  };
  const syncFromHash = () => {
    const hashId = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    hashPinnedStoryId = storyIds.includes(hashId) ? hashId : null;
    if (hashPinnedStoryId) {
      suppressScrollSpyUntil = Date.now() + 250;
      setActiveStoryNav(hashPinnedStoryId);
      return;
    }
    if (hashId) {
      const target = document.getElementById(hashId);
      if (target && target.matches(".tcrn-readback-panel[id]")) {
        const owningStory = target.closest("[data-contract-story-id]");
        const owningStoryId = owningStory ? owningStory.getAttribute("data-story-id") : null;
        if (owningStoryId && storyIds.includes(owningStoryId)) {
          hashPinnedStoryId = owningStoryId;
          suppressScrollSpyUntil = Date.now() + 250;
          setActiveStoryNav(owningStoryId);
          return;
        }
      }
    }
    syncFromScroll();
  };
  window.addEventListener("hashchange", syncFromHash);
  (scroller ?? window).addEventListener("scroll", scheduleScrollSpy, { passive: true });
  window.addEventListener("resize", scheduleScrollSpy);
  window.tcrnStorybookScrollSpy = { sync: syncFromScroll };
  syncFromHash();
})();
</script>`;
