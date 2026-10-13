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
  const updateThemeLinks = (theme) => {
    const shell = document.querySelector("[data-contract-surface]");
    const currentLocale = shell?.getAttribute("data-storybook-locale");
    for (const link of themedLinks()) {
      const href = link.getAttribute("href");
      if (!href) {
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
    for (const option of document.querySelectorAll("[data-storybook-theme-option]")) {
      option.setAttribute("aria-pressed", option.getAttribute("data-storybook-theme-option") === resolvedTheme ? "true" : "false");
    }
    const toggle = document.querySelector("[data-storybook-theme-toggle]");
    if (toggle) {
      const labelKey = nextTheme === "dark" ? "shell.themeDarkLabel" : "shell.themeLightLabel";
      toggle.setAttribute("data-current-theme", resolvedTheme);
      toggle.setAttribute("data-storybook-theme-option", nextTheme);
      toggle.setAttribute("data-theme-label-key", labelKey);
      toggle.setAttribute("aria-pressed", resolvedTheme === "dark" ? "true" : "false");
      for (const icon of toggle.querySelectorAll("[data-theme-icon]")) {
        icon.hidden = false;
      }
      if (typeof window.tcrnStorybookTextFor === "function" && window.tcrnStorybookResolvedLocale) {
        const label = window.tcrnStorybookTextFor(window.tcrnStorybookResolvedLocale, labelKey);
        toggle.setAttribute("aria-label", label);
        toggle.setAttribute("title", label);
      }
    }
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
  for (const option of document.querySelectorAll("[data-storybook-theme-option]")) {
    option.addEventListener("click", () => applyTheme(option.getAttribute("data-storybook-theme-option"), true));
  }
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
  const applyClientShortcuts = () => {
    for (const node of document.querySelectorAll("[data-shortcut-auto='search']")) {
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
    const root = document.querySelector("[data-contract-surface]");
    if (!root) {
      return;
    }
    const skipTags = new Set(["SCRIPT", "STYLE"]);
    // Visual-instance oracles and the locale-invariant subtrees (the shell's brand wordmark) keep
    // their words in every language.
    const visualInstanceSelector = "[data-storybook-visual-instance], [data-locale-invariant]";
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
      if (node.matches(visualInstanceSelector)) {
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
    visit(root);
  };
  const updateLocalizedLinks = (locale) => {
    const shell = document.querySelector("[data-contract-surface]");
    const currentTheme = shell?.getAttribute("data-storybook-theme");
    for (const link of document.querySelectorAll("[data-shell-menu] a[href], [data-pins] a[href], [data-doc-toc] a[href]:not([href^='#']), .tcrn-page-header nav a[href], .tcrn-doc-chapter-pager__link")) {
      const href = link.getAttribute("href");
      if (!href) {
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
  const focusLocaleMenuTrigger = () => {
    const toggle = document.querySelector("[data-locale-menu-toggle]");
    if (toggle instanceof HTMLElement) {
      toggle.focus({ preventScroll: true });
    }
  };
  const closeLocaleMenu = (options = {}) => {
    const toggle = document.querySelector("[data-locale-menu-toggle]");
    const menu = document.querySelector("[data-locale-menu]");
    toggle?.setAttribute("aria-expanded", "false");
    if (menu) {
      menu.hidden = true;
    }
    if (options.restoreFocus) {
      focusLocaleMenuTrigger();
    }
  };
  const openLocaleMenu = () => {
    const toggle = document.querySelector("[data-locale-menu-toggle]");
    const menu = document.querySelector("[data-locale-menu]");
    toggle?.setAttribute("aria-expanded", "true");
    if (menu) {
      menu.hidden = false;
      menu.querySelector("[aria-selected='true'], [aria-current='true']")?.focus();
    }
  };
  const updateLocaleMenuState = (locale) => {
    for (const menu of document.querySelectorAll(".tcrn-shell-locale-menu")) {
      const selected = menu.querySelector("[data-locale-menu-option][data-locale='" + CSS.escape(locale) + "']");
      const nameNode = menu.querySelector("[data-locale-current-name], [data-locale-current]");
      if (selected && nameNode) {
        nameNode.textContent = selected.getAttribute("data-locale-name") ?? locale;
      }
      for (const option of menu.querySelectorAll("[data-locale-menu-option]")) {
        const nativeName = option.getAttribute("data-locale-name") ?? option.getAttribute("data-locale") ?? "";
        const visibleName = option.querySelector(".tcrn-shell-locale-menu__name, [data-locale-option-name]");
        if (visibleName) {
          visibleName.textContent = nativeName;
        }
        const isSelected = option.getAttribute("data-locale") === locale;
        option.setAttribute("aria-selected", isSelected ? "true" : "false");
        option.setAttribute("aria-current", isSelected ? "true" : "false");
      }
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
      const wordmark = logo.querySelector(".tcrn-product-logo__line-one");
      const tagline = logo.querySelector(".tcrn-product-logo__line-two");
      const wordmarkText = (wordmark?.getAttribute("aria-label") ?? wordmark?.textContent ?? "").trim();
      const taglineText = (tagline?.textContent ?? "").trim();
      if (!wordmarkText || !taglineText) {
        continue;
      }
      logo.setAttribute("aria-label", wordmarkText + " " + taglineText);
    }
  };
  const updateThemeButtonLabels = (locale) => {
    for (const option of document.querySelectorAll("[data-storybook-theme-option][data-theme-label-key]")) {
      const label = textFor(locale, option.getAttribute("data-theme-label-key"));
      option.setAttribute("aria-label", label);
      option.setAttribute("title", label);
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
    updateThemeButtonLabels(resolvedLocale);
    const selector = document.querySelector("[data-i18n-locale-select]");
    if (selector) {
      selector.value = resolvedLocale;
    }
    updateLocaleMenuState(resolvedLocale);
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
  const selector = document.querySelector("[data-i18n-locale-select]");
  selector?.addEventListener("change", (event) => applyLocale(event.target.value, true));
  document.querySelector("[data-locale-menu-toggle]")?.addEventListener("click", () => {
    const menu = document.querySelector("[data-locale-menu]");
    if (menu?.hidden) {
      openLocaleMenu();
    } else {
      closeLocaleMenu();
    }
  });
  for (const option of document.querySelectorAll("[data-locale-menu-option]")) {
    option.addEventListener("click", () => {
      applyLocale(option.getAttribute("data-locale"), true);
      closeLocaleMenu({ restoreFocus: true });
    });
  }
  document.addEventListener("mousedown", (event) => {
    if (!event.target.closest?.("[data-locale-menu-root]")) {
      closeLocaleMenu();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLocaleMenu({ restoreFocus: true });
    }
  });
  applyLocale(initialLocale, false);
})();
</script>`;

// TCRN-DS-SUB-131: the documentation shell is the package ProductShell rendered without client
// React, so the two layers it opens arrive as markup, hidden (page-template.tsx carries the full
// menu after the band and the avatar menu after the avatar). This script is the static page's
// stand-in for ProductShell's own state: the brand button opens the full menu and says so
// (aria-expanded, its name, the shell's data-state), the avatar opens its menu, one layer is open
// at a time, ⌘K / Ctrl+K opens the full menu at its search, and Esc or a press outside closes the
// open layer — Esc returns focus to the button that opened it. Choosing a row closes the menu.
export const docShellLayerScript = `<script>
(() => {
  const shell = document.querySelector("[data-doc-shell]");
  const brand = shell?.querySelector("[data-shell-brand]");
  const menu = shell?.querySelector("[data-shell-menu]");
  const avatar = shell?.querySelector("[data-shell-avatar]");
  const account = shell?.querySelector("[data-panel='account']");
  if (!shell || !brand || !menu || !avatar || !account) {
    return;
  }
  const search = menu.querySelector("[data-doc-search-input]");
  const setMenu = (open, options = {}) => {
    if (open && !account.hidden) {
      setAccount(false);
    }
    menu.hidden = !open;
    brand.setAttribute("aria-expanded", open ? "true" : "false");
    const label = brand.getAttribute(open ? "data-expanded-label" : "data-collapsed-label");
    if (label) {
      brand.setAttribute("aria-label", label);
    }
    shell.setAttribute("data-state", open ? "expanded" : "closed");
    if (open && options.focusSearch) {
      search?.focus();
    }
    if (!open && options.restoreFocus) {
      brand.focus();
    }
  };
  const setAccount = (open, options = {}) => {
    if (open && !menu.hidden) {
      setMenu(false);
    }
    account.hidden = !open;
    avatar.setAttribute("aria-expanded", open ? "true" : "false");
    if (!open && options.restoreFocus) {
      avatar.focus();
    }
  };
  brand.addEventListener("click", () => setMenu(menu.hidden));
  avatar.addEventListener("click", () => setAccount(account.hidden));
  menu.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a[href]")) {
      setMenu(false);
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.isComposing) {
      return;
    }
    if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey) && !event.altKey) {
      const target = event.target;
      const editable = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable;
      if (editable && target !== search) {
        return;
      }
      setMenu(true, { focusSearch: true });
      return;
    }
    if (event.key !== "Escape") {
      return;
    }
    if (!menu.hidden) {
      setMenu(false, { restoreFocus: true });
    } else if (!account.hidden) {
      setAccount(false, { restoreFocus: true });
    }
  });
  document.addEventListener("pointerdown", (event) => {
    const target = event.target instanceof Node ? event.target : null;
    if (!target) {
      return;
    }
    if (!menu.hidden && !menu.contains(target) && !brand.contains(target)) {
      setMenu(false);
    }
    if (!account.hidden && !account.contains(target) && !avatar.contains(target)) {
      setAccount(false);
    }
  });
  window.tcrnDocShellLayers = { setMenu, setAccount };
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

export const storybookSearchScript = `<script>
(() => {
  const input = document.querySelector("[data-doc-search-input]");
  const resultsBox = document.querySelector("[data-doc-search-results]");
  if (!(input instanceof HTMLInputElement)) {
    return;
  }
  const searchRoot = input.closest("[data-shell-search]");
  const searchWorkspace = searchRoot;
  const maxResults = 8;
  let results = [];
  let activeIndex = -1;
  const setSearchExpanded = (expanded) => {
    if (!(searchWorkspace instanceof HTMLElement)) {
      return;
    }
    if (expanded) {
      searchWorkspace.setAttribute("data-search-expanded", "true");
      return;
    }
    searchWorkspace.removeAttribute("data-search-expanded");
  };
  const normalize = (value) => String(value ?? "").trim().toLocaleLowerCase();
  const restoreWindowScroll = (scrollX, scrollY) => {
    if (document.activeElement !== input) {
      return;
    }
    window.scrollTo({ top: scrollY, left: scrollX, behavior: "auto" });
  };
  const preserveWindowScroll = (callback) => {
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    callback();
    restoreWindowScroll(scrollX, scrollY);
    window.requestAnimationFrame(() => restoreWindowScroll(scrollX, scrollY));
  };
  const focusSearchInput = () => {
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    input.focus({ preventScroll: true });
    restoreWindowScroll(scrollX, scrollY);
  };
  const textFor = (key) => {
    const locale = window.tcrnStorybookResolvedLocale;
    if (locale && typeof window.tcrnStorybookTextFor === "function") {
      return window.tcrnStorybookTextFor(locale, key);
    }
    return key;
  };
  const searchIndex = (() => {
    try {
      return JSON.parse(document.querySelector("[data-doc-search-index]")?.textContent ?? "[]");
    } catch {
      return [];
    }
  })();
  const readItems = () => searchIndex.map((entry) => {
    const label = textFor(entry.label);
    const groupLabel = entry.group ? textFor(entry.group) : "";
    const searchable = [label, groupLabel].filter(Boolean).join(" ");
    return { href: entry.href, label, groupLabel, searchable };
  });
  // TCRN-DS-STORY-060: also surface the current page's ReadbackPanels (by their static anchor id)
  // and, on a reference page, its component API regions — so search jumps to a panel/component,
  // not only to a story. Labels read the RENDERED (localized) heading text so matching follows the
  // active locale. New attributes only; the nav readers above are untouched.
  const readPanelItems = () => {
    return Array.from(document.querySelectorAll(".tcrn-readback-panel[id]")).map((panel) => {
      const heading = panel.querySelector(":scope > h2.tcrn-heading, :scope > h3.tcrn-heading, :scope > h4.tcrn-heading");
      const label = heading?.textContent?.trim() ?? "";
      const story = panel.closest("[data-contract-story-id]");
      const groupLabel = story?.querySelector(".tcrn-doc-story-disclosure__title")?.textContent?.trim() ?? "";
      const href = "#" + panel.id;
      const searchable = [label, groupLabel].filter(Boolean).join(" ");
      return { href, label, groupLabel, searchable };
    }).filter((item) => item.label);
  };
  const readComponentItems = () => {
    return Array.from(document.querySelectorAll("[data-component-reference-id][id]")).map((region) => {
      const label = region.getAttribute("data-component-reference-id") ?? "";
      const groupLabel = textFor("group.Components");
      const href = "#" + region.id;
      const searchable = [label, groupLabel].filter(Boolean).join(" ");
      return { href, label, groupLabel, searchable };
    }).filter((item) => item.label);
  };
  const setResultsVisible = (visible) => {
    if (!(resultsBox instanceof HTMLElement)) {
      return;
    }
    resultsBox.hidden = !visible;
    input.setAttribute("aria-expanded", visible ? "true" : "false");
  };
  const setActiveIndex = (nextIndex) => {
    if (!results.length) {
      activeIndex = -1;
      input.removeAttribute("aria-activedescendant");
      return;
    }
    activeIndex = (nextIndex + results.length) % results.length;
    for (const node of Array.from(document.querySelectorAll("[data-doc-search-result]"))) {
      const selected = Number(node.getAttribute("data-doc-search-result")) === activeIndex;
      node.setAttribute("aria-selected", selected ? "true" : "false");
      if (selected) {
        input.setAttribute("aria-activedescendant", node.id);
      }
    }
  };
  const renderResults = () => {
    if (!(resultsBox instanceof HTMLElement)) {
      return;
    }
    resultsBox.innerHTML = "";
    if (!input.value.trim()) {
      setResultsVisible(false);
      return;
    }
    if (!results.length) {
      const empty = document.createElement("span");
      empty.className = "tcrn-product-shell-search__empty";
      empty.textContent = textFor("shell.searchNoResults");
      resultsBox.append(empty);
      setResultsVisible(true);
      input.removeAttribute("aria-activedescendant");
      return;
    }
    results.forEach((result, index) => {
      const option = document.createElement("a");
      option.className = "tcrn-product-shell-search__result";
      option.setAttribute("data-search-result", "");
      option.id = "tcrn-doc-search-result-" + index;
      option.href = result.href;
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", index === activeIndex ? "true" : "false");
      option.setAttribute("data-doc-search-result", String(index));
      option.innerHTML = "<strong></strong><span></span>";
      option.querySelector("strong").textContent = result.label;
      const meta = option.querySelector("span");
      const metaLabel = result.groupLabel && result.groupLabel !== result.label ? result.groupLabel : "";
      meta.textContent = metaLabel;
      meta.hidden = !metaLabel;
      option.addEventListener("click", (event) => {
        event.preventDefault();
        openResult(index);
      });
      resultsBox.append(option);
    });
    setResultsVisible(true);
    setActiveIndex(activeIndex < 0 ? 0 : activeIndex);
  };
  const updateResults = () => {
    const normalizedQuery = normalize(input.value);
    results = normalizedQuery
      ? [...readItems(), ...readPanelItems(), ...readComponentItems()]
          .filter((item) => normalize(item.searchable).includes(normalizedQuery))
          .slice(0, maxResults)
      : [];
    activeIndex = results.length ? 0 : -1;
    renderResults();
  };
  const openResult = (index = activeIndex) => {
    const result = results[index];
    if (!result?.href) {
      return false;
    }
    const targetUrl = new URL(result.href, window.location.href);
    const shell = document.querySelector("[data-contract-surface]");
    const currentLocale = shell?.getAttribute("data-storybook-locale");
    const currentTheme = shell?.getAttribute("data-storybook-theme");
    if (currentLocale) {
      targetUrl.searchParams.set("locale", currentLocale);
    }
    if (currentTheme) {
      targetUrl.searchParams.set("theme", currentTheme);
    }
    setResultsVisible(false);
    if (targetUrl.origin === window.location.origin && targetUrl.pathname === window.location.pathname) {
      if (window.location.hash === targetUrl.hash) {
        window.tcrnStorybookScrollToHash?.();
      } else {
        window.location.hash = targetUrl.hash.replace(/^#/, "");
      }
      return true;
    }
    window.location.href = targetUrl.href;
    return true;
  };
  if (resultsBox instanceof HTMLElement) {
    resultsBox.addEventListener("mousedown", (event) => {
      event.preventDefault();
    });
  }
  input.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }
    event.preventDefault();
    focusSearchInput();
  });
  input.addEventListener("input", () => preserveWindowScroll(updateResults));
  input.addEventListener("focus", () => {
    setSearchExpanded(true);
    preserveWindowScroll(updateResults);
  });
  input.addEventListener("blur", () => {
    window.setTimeout(() => {
      if (document.activeElement !== input) {
        setSearchExpanded(false);
      }
      setResultsVisible(false);
    }, 120);
  });
  document.addEventListener("pointerdown", (event) => {
    const target = event.target;
    if (target instanceof Element && searchRoot?.contains(target)) {
      return;
    }
    if (document.activeElement === input) {
      input.blur();
    }
    setSearchExpanded(false);
    setResultsVisible(false);
  });
  input.addEventListener("keydown", (event) => {
    if (event.isComposing) {
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex(activeIndex + 1);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex(activeIndex - 1);
      return;
    }
    if (event.key === "Escape") {
      setResultsVisible(false);
      input.removeAttribute("aria-activedescendant");
      return;
    }
    if (event.key === "Enter") {
      if (openResult()) {
        event.preventDefault();
      }
    }
  });
  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const editable = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable;
    if (editable && target !== input) {
      return;
    }
    if (event.key.toLowerCase() !== "k" || (!event.metaKey && !event.ctrlKey) || event.altKey) {
      return;
    }
    event.preventDefault();
    focusSearchInput();
    input.select();
    preserveWindowScroll(updateResults);
  });
  window.addEventListener("tcrn-storybook-locale-applied", () => {
    if (resultsBox instanceof HTMLElement) {
      resultsBox.setAttribute("aria-label", textFor("shell.searchResultsLabel"));
    }
    input.setAttribute("aria-label", textFor("shell.searchLabel"));
    preserveWindowScroll(updateResults);
  });
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
