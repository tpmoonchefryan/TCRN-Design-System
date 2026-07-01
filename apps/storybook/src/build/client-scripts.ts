import { tcrnDefaultLocale, tcrnFallbackLocale, tcrnSupportedLocales } from "@tcrn/ui-copy-state";
import { contractStories, contractStoryGroups } from "../stories.js";
import { storybookContentText, storybookLocaleText } from "./i18n.js";
import { groupFileName, groupSlug } from "./navigation.js";

export const hashRouteScript = `<script>
(() => {
  const routes = ${JSON.stringify({
    ...Object.fromEntries(contractStoryGroups.map((group) => [groupSlug(group), groupFileName(group)])),
    ...Object.fromEntries(contractStories.map((story) => [story.id, `${groupFileName(story.group)}#${story.id}`]))
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
    light: "#f6f7fb",
    dark: "#101827"
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
  const themedLinks = () => document.querySelectorAll("[data-story-nav], [data-doc-nav-item], .tcrn-doc-brand, .tcrn-doc-chapter-pager__link");
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

export const storybookI18nScript = `<script>
(() => {
  const supportedLocales = ${JSON.stringify(tcrnSupportedLocales)};
  const defaultLocale = ${JSON.stringify(tcrnDefaultLocale)};
  const fallbackLocale = ${JSON.stringify(tcrnFallbackLocale)};
  const translations = ${JSON.stringify(storybookLocaleText)};
  const contentTranslations = ${JSON.stringify(storybookContentText)};
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
    return translations[locale]?.[key] ?? translations[fallbackLocale]?.[key] ?? key;
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
  const searchShortcutLabel = () => "Ctrl K";
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
    const visualInstanceSelector = "[data-storybook-visual-instance]";
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
          node.setAttribute(attributeName, contentTextFor(locale, current));
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
    for (const link of document.querySelectorAll("[data-story-nav], [data-doc-nav-item], .tcrn-doc-brand, .tcrn-doc-chapter-pager__link")) {
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
  const closeLocaleMenu = () => {
    const toggle = document.querySelector("[data-locale-menu-toggle]");
    const menu = document.querySelector("[data-locale-menu]");
    toggle?.setAttribute("aria-expanded", "false");
    if (menu) {
      menu.hidden = true;
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
    const selected = document.querySelector("[data-locale-menu-option][data-locale='" + CSS.escape(locale) + "']");
    const nameNode = document.querySelector("[data-locale-current-name], [data-locale-current]");
    if (selected && nameNode) {
      nameNode.textContent = selected.getAttribute("data-locale-name") ?? locale;
    }
    for (const option of document.querySelectorAll("[data-locale-menu-option]")) {
      const nativeName = option.getAttribute("data-locale-name") ?? option.getAttribute("data-locale") ?? "";
      const visibleName = option.querySelector(".tcrn-shell-locale-menu__name, [data-locale-option-name]");
      if (visibleName) {
        visibleName.textContent = nativeName;
      }
      const isSelected = option.getAttribute("data-locale") === locale;
      option.setAttribute("aria-selected", isSelected ? "true" : "false");
      option.setAttribute("aria-current", isSelected ? "true" : "false");
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
    translateContentTree(resolvedLocale);
    applyClientShortcuts();
    for (const toggle of document.querySelectorAll("[data-doc-sidebar-toggle]")) {
      toggle.setAttribute("data-expanded-label", textFor(resolvedLocale, "shell.collapseNavigationLabel"));
      toggle.setAttribute("data-collapsed-label", textFor(resolvedLocale, "shell.expandNavigationLabel"));
    }
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
      closeLocaleMenu();
      document.querySelector("[data-locale-menu-toggle]")?.focus();
    });
  }
  document.addEventListener("mousedown", (event) => {
    if (!event.target.closest?.("[data-locale-menu-root]")) {
      closeLocaleMenu();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLocaleMenu();
    }
  });
  applyLocale(initialLocale, false);
})();
</script>`;

export const sidebarToggleScript = `<script>
(() => {
  const shell = document.querySelector("[data-contract-surface]");
  const toggle = document.querySelector("[data-doc-sidebar-toggle]");
  if (!shell || !toggle) {
    return;
  }
  const storageKey = "tcrn-design-system-storybook-sidebar-collapsed";
  const motionDuration = 260;
  let motionTimer = null;
  const readStoredState = () => {
    try {
      return window.localStorage.getItem(storageKey) === "true";
    } catch {
      return false;
    }
  };
  const writeStoredState = (collapsed) => {
    try {
      window.localStorage.setItem(storageKey, collapsed ? "true" : "false");
    } catch {
      // Local persistence is helpful, not required for this documentation shell.
    }
  };
  const setCollapsed = (collapsed, persist = true, animate = true) => {
    const wasCollapsed = shell.getAttribute("data-sidebar-collapsed") === "true";
    if (motionTimer) {
      window.clearTimeout(motionTimer);
      motionTimer = null;
    }
    if (animate && wasCollapsed !== collapsed) {
      shell.setAttribute("data-sidebar-motion", collapsed ? "collapsing" : "expanding");
      motionTimer = window.setTimeout(() => {
        shell.removeAttribute("data-sidebar-motion");
        motionTimer = null;
      }, motionDuration);
    } else {
      shell.removeAttribute("data-sidebar-motion");
    }
    shell.setAttribute("data-sidebar-collapsed", collapsed ? "true" : "false");
    toggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
    const label = collapsed ? toggle.getAttribute("data-collapsed-label") : toggle.getAttribute("data-expanded-label");
    if (label) {
      toggle.setAttribute("aria-label", label);
      toggle.setAttribute("title", label);
    }
    if (persist) {
      writeStoredState(collapsed);
    }
  };
  window.tcrnUpdateSidebarToggle = () => {
    setCollapsed(shell.getAttribute("data-sidebar-collapsed") === "true", false);
  };
  toggle.addEventListener("click", () => {
    setCollapsed(shell.getAttribute("data-sidebar-collapsed") !== "true");
  });
  window.addEventListener("tcrn-storybook-locale-applied", window.tcrnUpdateSidebarToggle);
  setCollapsed(readStoredState(), false, false);
})();
</script>`;

export const storybookSearchScript = `<script>
(() => {
  const input = document.querySelector("[data-doc-search-input]");
  const resultsBox = document.querySelector("[data-doc-search-results]");
  if (!(input instanceof HTMLInputElement)) {
    return;
  }
  const searchRoot = input.closest(".tcrn-doc-header-search");
  const searchWorkspace = input.closest(".tcrn-doc-header__workspace");
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
  const readItems = () => {
    const links = Array.from(document.querySelectorAll("[data-story-nav], [data-doc-nav-item]"))
      .filter((link) => link instanceof HTMLAnchorElement);
    return links.map((link) => {
      const group = link.closest("[data-doc-nav-group]");
      const readLabel = (source) =>
        source?.querySelector(".tcrn-doc-nav__section-label")?.textContent?.trim() ?? source?.textContent?.trim() ?? "";
      const groupLabel = readLabel(group?.querySelector("[data-story-nav]"));
      const label = readLabel(link);
      const href = link.getAttribute("href") ?? "#";
      const searchable = [label, groupLabel].filter(Boolean).join(" ");
      return { href, label, groupLabel, searchable };
    });
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
      const empty = document.createElement("div");
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
      ? readItems().filter((item) => normalize(item.searchable).includes(normalizedQuery)).slice(0, maxResults)
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
  const targetSelector = "[data-doc-nav-item], .tcrn-doc-skip";
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
  const scrollToHashTarget = () => {
    const targetId = readHashId();
    if (!targetId) {
      return false;
    }
    const target = document.getElementById(targetId);
    if (!target) {
      return false;
    }
    const nextTop = Math.max(0, target.getBoundingClientRect().top + window.scrollY - readOffset());
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

export const activeStoryNavScript = `<script>
(() => {
  const storyNodes = Array.from(document.querySelectorAll("[data-story-id]"));
  const storyLinks = Array.from(document.querySelectorAll("[data-doc-nav-item]"));
  const categoryToggles = Array.from(document.querySelectorAll("[data-doc-nav-category-toggle]"));
  const storyIds = storyNodes.map((node) => node.getAttribute("data-story-id")).filter(Boolean);
  let hashPinnedStoryId = null;
  let suppressScrollSpyUntil = 0;
  let scrollSpyFrame = 0;
  let currentStoryId = storyIds[0] ?? null;
  const setCategoryOpen = (toggle, open) => {
    const controls = toggle.getAttribute("aria-controls");
    const list = controls ? document.getElementById(controls) : null;
    const category = toggle.closest("[data-doc-nav-category]");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    category?.setAttribute("data-doc-nav-category-open", open ? "true" : "false");
    if (list) {
      list.hidden = !open;
    }
  };
  const openCategoryForLink = (link) => {
    const category = link?.closest("[data-doc-nav-category]");
    const toggle = category?.querySelector("[data-doc-nav-category-toggle]");
    if (toggle) {
      setCategoryOpen(toggle, true);
    }
  };
  for (const toggle of categoryToggles) {
    setCategoryOpen(toggle, toggle.getAttribute("aria-expanded") === "true");
    toggle.addEventListener("click", () => {
      setCategoryOpen(toggle, toggle.getAttribute("aria-expanded") !== "true");
    });
  }
  const readOffset = () => {
    const raw = window.getComputedStyle(document.documentElement).getPropertyValue("--tcrn-anchor-scroll-offset");
    const value = Number.parseFloat(raw);
    return Number.isFinite(value) ? value : 22;
  };
  const keepActiveLinkVisible = (activeLink) => {
    const sidebar = activeLink.closest(".tcrn-doc-sidebar");
    if (!(sidebar instanceof HTMLElement)) {
      return;
    }
    const activeGroup = activeLink.closest("[data-doc-nav-group]");
    const groupSection = activeGroup?.querySelector(".tcrn-doc-nav__section[aria-current='page']");
    const anchor = groupSection instanceof HTMLElement ? groupSection : activeLink;
    const maxScrollTop = Math.max(0, sidebar.scrollHeight - sidebar.clientHeight);
    const nextScrollTop = Math.max(0, Math.min(anchor.offsetTop - 8, maxScrollTop));
    sidebar.scrollTop = nextScrollTop;
  };
  const setActiveStoryNav = (storyId) => {
    if (!storyId) {
      return;
    }
    currentStoryId = storyId;
    for (const link of storyLinks) {
      link.removeAttribute("aria-current");
      link.removeAttribute("data-doc-nav-item-active");
    }
    const activeLink = storyLinks.find((link) => link.getAttribute("data-doc-nav-item") === storyId);
    if (activeLink) {
      openCategoryForLink(activeLink);
      activeLink.setAttribute("aria-current", "location");
      activeLink.setAttribute("data-doc-nav-item-active", "true");
      keepActiveLinkVisible(activeLink);
    }
    const currentStory = document.querySelector("[data-doc-current-story]");
    if (currentStory) {
      const key = "story." + storyId + ".title";
      currentStory.setAttribute("data-i18n", key);
      const locale = window.tcrnStorybookResolvedLocale;
      if (locale && typeof window.tcrnStorybookTextFor === "function") {
        currentStory.textContent = window.tcrnStorybookTextFor(locale, key);
      } else if (activeLink?.textContent) {
        currentStory.textContent = activeLink.textContent.trim();
      }
    }
  };
  window.tcrnUpdateCurrentStoryContext = () => setActiveStoryNav(currentStoryId);
  const readCurrentStoryFromScroll = () => {
    const maxScrollY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    if (window.scrollY >= maxScrollY - 2) {
      return storyIds[storyIds.length - 1] ?? null;
    }
    const threshold = readOffset() + 10;
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
    syncFromScroll();
  };
  window.addEventListener("hashchange", syncFromHash);
  window.addEventListener("scroll", scheduleScrollSpy, { passive: true });
  window.addEventListener("resize", scheduleScrollSpy);
  window.tcrnStorybookScrollSpy = { sync: syncFromScroll };
  syncFromHash();
})();
</script>`;
