import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { tcrnLocaleMetadata } from "@tcrn/ui-copy-state";
import {
  Icon, LinkButton, PageHeader, ShellBrandButton, ShellLocaleMenu, ShellMenu, ShellThemeToggle,
  SkipLink, Text, useShellMenuPresentation, type ShellThemeMode,
} from "@tcrn/ui-react/approved";
import { ApiReference } from "./api-reference.js";
import { approvedSource, type ApprovedBoardId, type DocsLocale } from "./approved-source.js";
import { docsCopy } from "./locales.js";
import { Portal } from "./portal.js";
import { portalCopy } from "./portal-copy.js";
import { docsNavigation, managerFragment, pageHref, sourceSearch, type DocsEntry, type DocsPage } from "./portal-navigation.js";
import { SourceMatrices } from "./source-matrices.js";
import { BoardSpecimens } from "./specimens.js";

export interface PageProps {
  page: DocsPage;
  locale: DocsLocale;
  theme?: ShellThemeMode;
  entry?: DocsEntry;
  onLocaleChange?: (locale: DocsLocale) => void;
}

export const docsPreferenceKey = "tcrn-published-docs:anonymous:design-system";
const contentId = "standards-content";

function readPreferences(): Record<string, unknown> {
  const stored = localStorage.getItem(docsPreferenceKey);
  try {
    const saved: unknown = JSON.parse(stored ?? "null");
    return saved && typeof saved === "object" && !Array.isArray(saved) ? saved as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

function savedTheme(fallback: ShellThemeMode): ShellThemeMode {
  try {
    const { theme } = readPreferences();
    if (theme === "light" || theme === "dark") return theme;
  } catch { /* Storage may be unavailable. */ }
  return fallback;
}

function PublishedSource({ locale, board }: { locale: DocsLocale; board?: ApprovedBoardId }) {
  const labels = docsCopy(locale);
  const { site, boards } = approvedSource;
  return (
    <>
      <Text>{labels.provenance}</Text>
      <p>
        <a className="tcrn-link" href={site.url}>{labels.source} · Sites v{site.versionNumber}</a>
        {" · "}<code className="tcrn-doc-code">{site.sourceCommit}</code>
      </p>
      <ul className="docs-source-list">
        {boards.map((item, index) => (!board || item.slug === board) && (
          <li key={item.slug}>
            <a className="tcrn-link" href={`${site.url}/boards/${item.slug}/index.html`}>{labels.boardTitles[index]}</a>
            {" · "}<code className="tcrn-doc-source">{item.sourceId}</code>
          </li>
        ))}
      </ul>
    </>
  );
}

function targetCanvasFragment(event: MouseEvent<HTMLDivElement>) {
  const link = event.target instanceof Element
    ? event.target.closest<HTMLAnchorElement>('a[href^="#"]:not([target])')
    : null;
  // Keep native fragment navigation in the iframe despite Storybook's base target="_parent".
  if (link) link.target = "_self";
}

export function App({ page, locale, theme: initialTheme = "light", entry = "static", onLocaleChange }: PageProps) {
  const inStorybook = entry !== "static";
  const inManager = typeof entry === "object";
  const labels = docsCopy(locale);
  const navigation = docsNavigation(locale, entry);
  const index = approvedSource.boards.findIndex(board => board.slug === page);
  const board = approvedSource.boards[index];
  const current = navigation.byPage.get(page)!;
  const apiHref = inStorybook ? "#api" : pageHref(locale, "api", entry);
  const topic = navigation.cards.find(card => card.chapters.some(chapter => chapter.id === page));
  const trail = page === "index"
    ? [{ ...navigation.home, linkWhenCurrent: true }]
    : [
      navigation.home,
      ...(topic && topic.id !== page ? [topic] : []),
      { id: current.id, label: current.label },
    ];

  const [theme, setTheme] = useState(() => inStorybook ? savedTheme(initialTheme) : initialTheme);
  const [preferencesReady, setPreferencesReady] = useState(false);
  const [searchKey, setSearchKey] = useState("Ctrl K");
  useEffect(() => {
    if (!inStorybook) setTheme(savedTheme(initialTheme));
    if (/Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent)) setSearchKey("⌘K");
    setPreferencesReady(true);
  }, [inStorybook, initialTheme]);
  useEffect(() => {
    document.documentElement.lang = locale;
    if (preferencesReady) document.documentElement.dataset.tcrnTheme = theme;
  }, [locale, preferencesReady, theme]);
  useEffect(() => {
    if (!inManager) return;
    const story = new URLSearchParams(window.location.search).get("id");
    return () => {
      const { pathname, search, hash } = window.location;
      // The native sidebar reuses the iframe and changes its story ID before unmounting this page.
      if (hash && new URLSearchParams(search).get("id") !== story) {
        window.history.replaceState(window.history.state, "", pathname + search);
      }
    };
  }, [inManager, page]);
  useEffect(() => {
    if (!inStorybook) return;
    const { hash, search } = window.location;
    const fragment = hash.slice(1) || (inManager ? managerFragment(page, search) : "");
    const target = document.getElementById(fragment);
    // Manager forwards cross-story fragments in the iframe query. Activate the native hash once the target exists.
    if (target && !hash) window.location.replace(`#${encodeURIComponent(fragment)}`);
    else target?.scrollIntoView();
  }, [inManager, inStorybook, locale, page]);

  function changeTheme(next: ShellThemeMode) {
    setTheme(next);
    try {
      // Keep earlier keys in the anonymous record while this shell uses fixed destinations.
      localStorage.setItem(docsPreferenceKey, JSON.stringify({ ...readPreferences(), theme: next }));
    } catch { /* The theme can still change for this visit. */ }
  }

  const [layer, setLayer] = useState<"directory" | "search" | "locale" | null>(null);
  const menuOpen = layer === "directory" || layer === "search";
  const shellRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLButtonElement>(null);
  const menuOwnerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const menuPresentation = useShellMenuPresentation(undefined, shellRef);
  const menuState = menuOpen ? (menuPresentation === "sheet" ? "sheet" : "expanded") : "closed";

  return (
    <div
      ref={shellRef}
      className="tcrn-product-shell docs-shell"
      data-shell=""
      data-state={menuState}
      data-docs-page={page}
      data-docs-ready={preferencesReady ? "true" : "false"}
      data-tcrn-root=""
      data-tcrn-theme={inStorybook || preferencesReady ? theme : undefined}
      data-published-source={approvedSource.site.sourceCommit}
      lang={locale}
      onClickCapture={inManager ? targetCanvasFragment : undefined}
    >
      <SkipLink href={`#${contentId}`}>{portalCopy[locale].skip}</SkipLink>
      <header className="tcrn-shell-strip" data-shell-strip="">
        <ShellBrandButton
          ref={brandRef}
          productId="design-system"
          locale={locale}
          expanded={menuOpen}
          aria-controls={menuId}
          onClick={event => {
            menuOwnerRef.current = event.currentTarget;
            setLayer(menuOpen ? null : "directory");
          }}
        />
        <nav className="tcrn-shell-pins docs-topics" aria-label={labels.title}>
          {navigation.primary.map(item => (
            <span key={item.id} className="tcrn-shell-pins__pin">
              <a
                href={item.href}
                className="tcrn-shell-pins__item"
                aria-current={item.id === page ? "page" : undefined}
                data-current-topic={item.id === topic?.id ? "" : undefined}
              >
                <span className="tcrn-shell-pins__label" title={item.label}>{item.label}</span>
              </a>
            </span>
          ))}
        </nav>
        <div className="tcrn-shell-cluster docs-preferences" data-cluster="">
          <ShellThemeToggle currentTheme={theme} onThemeChange={changeTheme} locale={locale} variant="quiet" />
          <ShellLocaleMenu
            currentLocale={locale}
            locales={tcrnLocaleMetadata}
            open={layer === "locale"}
            onOpenChange={open => setLayer(previous => open ? "locale" : previous === "locale" ? null : previous)}
            onLocaleChange={next => {
              const selected = tcrnLocaleMetadata.find(option => option.locale === next);
              if (selected && selected.locale !== locale) {
                if (onLocaleChange) onLocaleChange(selected.locale);
                else window.location.assign(pageHref(selected.locale, page, entry) + window.location.hash);
              }
            }}
          />
        </div>
      </header>
      <ShellMenu
        id={menuId}
        productId="design-system"
        locale={locale}
        groups={navigation.directory}
        selectedId={page}
        currentPath={trail}
        open={menuOpen}
        presentation={menuPresentation}
        animateExit
        showSheetPosition
        focusSearchOnOpen={layer === "search"}
        triggerRef={menuOwnerRef}
        onOpenChange={open => {
          if (open) {
            menuOwnerRef.current = brandRef.current;
            setLayer("directory");
          } else {
            setLayer(previous => previous === "locale" ? previous : null);
          }
        }}
        searchPlaceholder={labels.search}
        searchProvider={query => sourceSearch(locale, query, entry, page)}
      />
      <div className="tcrn-product-shell__paper docs-paper" data-paper="">
        <main id={contentId} className="tcrn-product-shell__main" tabIndex={0}>
          {page === "index" ? (
            <Portal locale={locale} theme={theme} navigation={navigation} search={
              <button
                className="portal-search"
                type="button"
                aria-haspopup="dialog"
                aria-controls={menuId}
                aria-expanded={layer === "search"}
                aria-keyshortcuts="Control+K Meta+K"
                onClick={event => {
                  menuOwnerRef.current = event.currentTarget;
                  setLayer(layer === "search" ? null : "search");
                }}
              >
                <Icon name="search" />
                {labels.search}
                <kbd aria-hidden="true">{searchKey}</kbd>
              </button>
            } />
          ) : (
            <div className="docs-frame">
              <PageHeader
                title={current.label}
                description={board ? labels.summaries[index] : undefined}
                breadcrumbs={trail}
                locale={locale}
                headingLevel={1}
                actions={page !== "source" ? <LinkButton variant="quiet" size="sm" href={navigation.source.href}>{labels.source}</LinkButton> : null}
              />
              <div className="tcrn-doc-content">
                {board ? (
                  <>
                    <article lang={locale} data-approved-board={board.slug} data-source-id={board.sourceId}>
                      <BoardSpecimens board={board.slug} locale={locale} apiHref={apiHref} />
                      <SourceMatrices board={board.slug} locale={locale} apiHref={apiHref} />
                    </article>
                    {inStorybook && <>
                      <section id="api"><ApiReference board={board.slug} locale={locale} entry={entry} /></section>
                      <section id="source"><PublishedSource locale={locale} board={board.slug} /></section>
                    </>}
                  </>
                ) : page === "api" ? <ApiReference locale={locale} entry={entry} /> : <PublishedSource locale={locale} />}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
