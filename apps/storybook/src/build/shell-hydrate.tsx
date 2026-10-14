// The static pages' client mount for the top-band shell stories (TCRN-DS-SUB-151; STORY-136, 138,
// 139, 141, 144, 147, 149; C-12 of the INIT-016 R2 decomposition).
//
// The documentation pages are rendered on the server. The shell stories (shell-top-band,
// shell-narrow, shell-mobile, shell-intro) show the package ProductShell as the 07a board's
// screens, and what the shell does lives in the browser: the brand button opens the full menu,
// Esc returns the focus to it, ⌘K / Ctrl+K opens the menu at its search (on the one screen the
// page's address names with shell-shortcut=<screen>; TCRN-DS-SUB-179), a press outside closes
// it, 760 wide and narrower the menu is the Sheet, the brand button reports the version it shows
// (data-shell-brand), and the sign-in intro plays once a session. So each screen is rendered here
// once for both sides: story-content.tsx renders ShellStoryRoot to a string inside the screen's
// block (data-shell-hydrate), and mountShellStories, bundled for the page by build.tsx
// (ds-shell-hydrate.js), hydrates the same element in that block with the same id prefix.
//
// After it mounts, a screen speaks the page's language: the package's own words through
// currentLocale, the sample's through the page's content dictionary (window.tcrnStorybookTextFor),
// and again on every tcrn-storybook-locale-applied. The page's string swap leaves these blocks to
// React (client-scripts.ts), so the server markup it hydrates is the markup React rendered.
//
// The open screens are open from their first render, and an open full menu puts the focus in its
// search when it mounts; a documentation page must not move the reader's focus, so focus() into a
// block is held until that block has mounted. ShellIntro does not play on a server-rendered first
// screen, which is what hydration is: the intro screen mounts it once the shell has hydrated, the
// moment the page stands for sign-in succeeding.
//
// This module is imported on the server by story-content.tsx; nothing in it runs when it loads.
import { memo, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { flushSync } from "react-dom";
import { hydrateRoot } from "react-dom/client";
import {
  Badge,
  ProductLockup,
  ProductShell,
  SectionTabs,
  Select,
  SettingRow,
  SettingRowList,
  SettingsLayout,
  ShellIntro,
  SplitView,
  Switch,
  Text,
  TocRail,
  shellMenuPresentationContext,
  tcrnProductLogoRegistry,
  useProductShellController,
  type PageHeaderBreadcrumb,
  type PageHeaderProps,
  type ProductShellNavGroup,
  type ProductShellProduct,
  type ProductShellProps,
  type ShellMenuPresentation,
  type TcrnProductLogoId,
  type TocItem
} from "@tcrn/ui-react";
import { tcrnDefaultLocale, tcrnLocaleMetadata, tcrnSupportedLocales, type TcrnLocale } from "@tcrn/ui-copy-state";

export type ShellStoryState = "closed" | "expanded" | "drop";
/** The page a screen's paper shows when it is not the board's roster sample (TCRN-DS-SUB-161). */
export type ShellStoryPage = "settings" | "roster";
export type ShellStoryTheme = "light" | "night";

export interface ShellStoryScreen {
  /** The board's name for the screen, written to data-shell. */
  screen: string;
  state: ShellStoryState;
  theme: ShellStoryTheme;
  /** Accessible name of the screen's content region, unique on the page. */
  label: string;
  /**
   * The full menu's presentation (shellMenuPresentationContext); the viewport's when omitted. The
   * open screens of the desktop board keep the panel at any viewport: they picture a 1240 screen.
   */
  presentation?: ShellMenuPresentation;
  /** The screen plays the sign-in intro once it has mounted. */
  intro?: boolean;
  /**
   * A query typed into the full menu's search, so the menu shows its results (TCRN-DS-SUB-150, R2-24):
   * the start of this menu entry's label, in the page's language (shellStoryTypedQuery), so every
   * language finds the same entries.
   */
  typed?: string;
  /**
   * The page in the paper (TCRN-DS-SUB-161, R2-28): a settings page (SettingsLayout) or a roster page
   * (SplitView), each under a long trail; omitted, the paper shows the board's sample sentence.
   */
  page?: ShellStoryPage;
  /**
   * The screen works as a product's shell does (TCRN-DS-SUB-186; STORY-140 GWT3, GWT4): its pins are the
   * reader's local preference through useProductShellController, so a pinned item moves under the pointer
   * or with Alt+← / Alt+→ and keeps its place after a reload, and its avatar menu switches products. The
   * other screens are the board's pictures and hold the board's pins still.
   */
  controlled?: boolean;
}

/** The marker of a block this module hydrates. */
export const shellHydrateAttribute = "data-shell-hydrate";
/**
 * What a block says once its screen has committed in a language (TCRN-DS-SUB-198, C-12 of the INIT-016 R3
 * decomposition): data-shell-hydrated="<locale>", written after the hydration's commit and again after
 * every change of the page's language has been committed. A reader of the page's words (the English-leak
 * scan of internal-alpha-browser-proof.mjs) waits for every block to say the page's language.
 */
export const shellHydratedAttribute = "data-shell-hydrated";
/**
 * The page parameter that gives ⌘K / Ctrl+K to one screen (TCRN-DS-SUB-179, C-12 of the INIT-016 R3 decomposition):
 * shell-shortcut=<screen>. The key is registered on the document once per shell, so a page of many shells lets one
 * have it: the documentation shell has it, the screens leave it alone (menuShortcut false), and a page opened with
 * the parameter gives it to the named screen alone, the documentation shell included (the shell gate's focusLoop).
 */
export const shellShortcutParameter = "shell-shortcut";

/** The screen the page's address gives ⌘K to, or null (client only). */
export function shellShortcutScreen(): string | null {
  if (typeof window === "undefined") return null;
  return new URL(window.location.href).searchParams.get(shellShortcutParameter);
}

export const shellStoryThemeAttribute: Readonly<Record<ShellStoryTheme, "light" | "dark">> = { light: "light", night: "dark" };
// PINS of the board: the current page, a pinned item with a menu, a link and a second menu.
export const shellStoryPinnedIds: readonly string[] = ["roster", "contracts", "statements", "schedule"];
const shellStoryDropPinId = "contracts";
// The board's states, by screen state: the full-menu screens show the Teams row under the pointer;
// the drop-down screens show the Contracts drop-down with its Templates row's cascade open. (The
// closed screens' third pinned item under the pointer is a markup edit of story-content.tsx:
// ShellPins takes no preview states.)
const shellStoryPreviewStates: Readonly<Record<ShellStoryState, Readonly<Record<string, string>> | undefined>> = {
  closed: undefined,
  expanded: { teams: "hover" },
  drop: { templates: "open" }
};

export const shellTopBandScreens: readonly ShellStoryScreen[] = [
  { screen: "ts-closed-l", state: "closed", theme: "light", label: "Closed band", controlled: true },
  { screen: "ts-closed-n", state: "closed", theme: "night", label: "Closed band (night)" },
  { screen: "ts-x-l", state: "expanded", theme: "light", label: "Full menu open", presentation: "panel" },
  { screen: "ts-x-n", state: "expanded", theme: "night", label: "Full menu open (night)", presentation: "panel" },
  { screen: "ts-drop-l", state: "drop", theme: "light", label: "Drop-down open" },
  { screen: "ts-drop-n", state: "drop", theme: "night", label: "Drop-down open (night)" },
  // The full menu with a query typed and its results open (TCRN-DS-SUB-150, R2-24): the host of
  // geometry-proof's searchOverlay.
  { screen: "ts-search-l", state: "expanded", theme: "light", label: "Full menu with search results", presentation: "panel", typed: "Contracts" },
  // The page in the paper at 1440 (TCRN-DS-SUB-161, R2-28): the shell gate reads the page's trail, the
  // settings page's width and centring and the roster page's left edge on these screens.
  { screen: "ts-settings-l", state: "closed", theme: "light", label: "Settings page", page: "settings" },
  { screen: "ts-roster-l", state: "closed", theme: "light", label: "Roster page", page: "roster" }
];
export const shellNarrowScreens: readonly ShellStoryScreen[] = [
  { screen: "ts-narrow-l", state: "closed", theme: "light", label: "Narrow band" },
  { screen: "ts-narrow-x-l", state: "expanded", theme: "light", label: "Narrow band with the full menu", presentation: "panel" }
];
// ts-m-s is the board's phone screen with the menu open: the Sheet, at any viewport, as on the
// server, so its shell root reads data-state="sheet" (TCRN-DS-SUB-160).
export const shellMobileScreens: readonly ShellStoryScreen[] = [
  { screen: "ts-m-l", state: "closed", theme: "light", label: "Phone band" },
  { screen: "ts-m-s", state: "expanded", theme: "light", label: "Phone band with the menu", presentation: "sheet" },
  // The same two pages at the phone width (TCRN-DS-SUB-161, R2-28).
  { screen: "ts-settings-m", state: "closed", theme: "light", label: "Settings page on the phone", page: "settings" },
  { screen: "ts-roster-m", state: "closed", theme: "light", label: "Roster page on the phone", page: "roster" }
];
export const shellIntroScreen: ShellStoryScreen = { screen: "ts-intro-l", state: "closed", theme: "light", label: "Band after sign-in", intro: true };

const shellStoryScreens: Readonly<Record<string, readonly ShellStoryScreen[]>> = {
  "shell-top-band": shellTopBandScreens,
  "shell-narrow": shellNarrowScreens,
  "shell-mobile": shellMobileScreens,
  "shell-intro": [shellIntroScreen]
};

/**
 * The part of a label a reader has typed: its first three fifths, at least two characters, as one
 * stops typing once the results hold the page ("Contracts" types "Contra", 合同 types 合同).
 */
export function shellStoryTypedQuery(label: string): string {
  const characters = Array.from(label);
  return characters.slice(0, Math.max(2, Math.ceil(characters.length * 0.6))).join("");
}

/** The id prefix of a screen's render, the same on the server and in hydration. */
export function shellStoryIdentifierPrefix(storyId: string, screen: string): string {
  return `${storyId}-${screen}-`;
}

type Translate = (text: string) => string;
const untranslated: Translate = (text) => text;
const ignore = () => undefined;

// The board's sample navigation (NAV and PINS of docs/design/gplus-2026-10/tools/build-shell2.mjs)
// as generic product content.
export function shellStoryNavGroups(storyId: string, t: Translate = untranslated, current = "roster"): ProductShellNavGroup[] {
  const href = `#${storyId}`;
  const selected = (id: string) => (id === current ? { selected: true } : {});
  return [
    {
      id: "people",
      label: t("People"),
      items: [
        { id: "roster", label: t("Roster"), href, iconName: "users", ...selected("roster") },
        { id: "teams", label: t("Teams"), href, iconName: "layers" },
        {
          id: "contracts",
          label: t("Contracts"),
          iconName: "book-open",
          children: [
            { id: "all-contracts", label: t("All contracts"), href },
            {
              id: "templates",
              label: t("Templates"),
              children: [
                { id: "signing-contracts", label: t("Signing contracts"), href },
                { id: "agency-contracts", label: t("Agency contracts"), href },
                { id: "event-contracts", label: t("Event contracts"), href },
                { id: "confidentiality-agreements", label: t("Confidentiality agreements"), href }
              ]
            },
            { id: "approvals", label: t("Approvals"), href },
            { id: "expiry-reminders", label: t("Expiry reminders"), href }
          ]
        },
        { id: "statements", label: t("Statements"), href, iconName: "database" }
      ]
    },
    {
      id: "operations",
      label: t("Operations"),
      items: [
        {
          id: "schedule",
          label: t("Schedule"),
          iconName: "calendar",
          children: [
            { id: "this-week", label: t("This week"), href },
            { id: "month-view", label: t("Month view"), href },
            { id: "conflict-check", label: t("Conflict check"), href }
          ]
        },
        { id: "live-streams", label: t("Live streams"), href, iconName: "globe-2" },
        { id: "events", label: t("Events"), href, iconName: "package" },
        { id: "reports", label: t("Reports"), href, iconName: "layout-grid" }
      ]
    },
    {
      id: "system",
      label: t("System"),
      items: [
        { id: "members", label: t("Members"), href, iconName: "users" },
        { id: "permissions", label: t("Permissions"), href, iconName: "shield-check" },
        { id: "settings", label: t("Settings"), href, iconName: "settings", ...selected("settings") },
        { id: "audit-log", label: t("Audit log"), href, iconName: "history" }
      ]
    }
  ];
}

// The controlled screen's product (TCRN-DS-SUB-186): its pins are kept under the controller's local key for
// the product, `tcrn-shell-pins:<productId>` (the browser's own store, never a cookie).
const shellStoryProductId = "tms";
const shellStoryPinsStorageKey = `tcrn-shell-pins:${shellStoryProductId}`;

/**
 * The avatar menu's products on the controlled screen (TCRN-DS-SUB-186; STORY-140 GWT4): the products of
 * the package's logo registry in its order, each named by its wordmark, the product's own name in every
 * language, with this shell's product current. The menu links back to the story, as the sample's rows do.
 */
export function shellStoryProducts(storyId: string): ProductShellProduct[] {
  const href = `#${storyId}`;
  return (Object.keys(tcrnProductLogoRegistry) as TcrnProductLogoId[]).map((id) => ({
    id,
    label: tcrnProductLogoRegistry[id].lineOne,
    href,
    ...(id === shellStoryProductId ? { current: true } : {})
  }));
}

/** The pins the controller kept for the product, read as it writes them: a JSON list of ids. */
function storedShellStoryPins(): readonly string[] | undefined {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(shellStoryPinsStorageKey) ?? "null");
    return Array.isArray(parsed) && parsed.every((entry) => typeof entry === "string") ? parsed : undefined;
  } catch {
    return undefined;
  }
}

/** What a screen's paper shows and where the shell stands for it. */
interface ShellStoryPageView {
  moduleName: string;
  routeLabel: string;
  /** The menu entry that is the current page. */
  current: string;
  header: PageHeaderProps;
  content: ReactNode;
}

// The board's people for the roster page: names that stay in their own script in every language, as
// on the actions sample's roster (composition-one.tsx), so no page carries a Latin run of them.
const shellStoryRosterPeople = [
  { name: "星野ひかり", team: "Team A", status: "Signed", tone: "positive" },
  { name: "김하늘", team: "Team C", status: "Trial", tone: "warning" },
  { name: "陈嘉怡", team: "Team B", status: "Signed", tone: "positive" }
] as const;

/**
 * The page in a screen's paper. The board's screens show the roster sample's sentence; the settings
 * and roster screens (TCRN-DS-SUB-161, R2-28) show a page deeper than the menu model, so its trail
 * runs from the product through the page's section to the page and is long: on one line, every crumb
 * gives way under its title (07b D 面包屑). The settings page is SettingsLayout, at most 1040 and
 * centred in the paper (D1); the roster page is SplitView from the paper's content edge. Every word is
 * a sample word in five languages; the regions inside the page are named after the screen, so the
 * page's landmarks stay unique beside the other screens'.
 */
function shellStoryPage(storyId: string, screen: ShellStoryScreen, t: Translate): ShellStoryPageView {
  const href = `#${storyId}`;
  const named = (name: string) => `${t(screen.label)} · ${t(name)}`;
  const trail = (section: string, page: string): PageHeaderProps["breadcrumbs"] => [
    { id: `${screen.screen}-crumb-product`, label: t("Talent Management System"), href },
    { id: `${screen.screen}-crumb-section`, label: t(section), href },
    { id: `${screen.screen}-crumb-page`, label: t(page) }
  ];
  if (screen.page === "settings") {
    return {
      moduleName: t("System"),
      routeLabel: t("Notification preferences"),
      current: "settings",
      header: { title: t("Notification preferences"), headingLevel: 2, breadcrumbs: trail("Settings", "Notification preferences") },
      content: (
        <SettingsLayout
          navigation={
            <SectionTabs
              label={named("Settings local navigation")}
              // Two sections, so the tabs fit the 390 phone's paper as they are.
              items={[
                { id: "general", label: t("General") },
                { id: "notifications", label: t("Notifications"), selected: true }
              ]}
            />
          }
          navigationLabel={named("Settings sections")}
          contentLabel={named("Notification preferences")}
        >
          <SettingRowList>
            <SettingRow
              label={t("Role")}
              control={
                <Select
                  defaultValue="member"
                  options={[
                    { value: "member", label: t("Member") },
                    { value: "admin", label: t("Admin") },
                    { value: "read-only", label: t("Read-only") }
                  ]}
                />
              }
            />
          </SettingRowList>
          <Switch label={t("Email notifications")} description={t("Invitations and expiry reminders")} defaultChecked />
        </SettingsLayout>
      )
    };
  }
  if (screen.page === "roster") {
    const [first] = shellStoryRosterPeople;
    return {
      moduleName: t("People"),
      routeLabel: t("Roster"),
      current: "roster",
      header: { title: t("Roster"), description: t("24 people · 3 to invite"), headingLevel: 2, breadcrumbs: trail("Members and permissions", "Roster") },
      content: (
        <SplitView
          label={named("Roster")}
          detailPopulated
          // One row a person, wrapping at the phone width (a table's columns keep 160 each and would
          // run past the phone's paper).
          list={
            <div className="tcrn-product-shell-content-stack">
              {shellStoryRosterPeople.map((person) => (
                <div key={person.name} className="tcrn-doc-action-row">
                  <Text tone="strong">{person.name}</Text>
                  <Text>{t(person.team)}</Text>
                  <Badge tone={person.tone}>{t(person.status)}</Badge>
                </div>
              ))}
            </div>
          }
          detail={
            <div className="tcrn-product-shell-content-stack">
              <Text tone="strong">{first.name}</Text>
              <Text>{t(first.team)}</Text>
              <Badge tone={first.tone}>{t(first.status)}</Badge>
            </div>
          }
        />
      )
    };
  }
  return {
    moduleName: t("People"),
    routeLabel: t("Roster"),
    current: "roster",
    // The paper's first row (TCRN-DS-SUB-129): its trail is the current position, People › Roster.
    // The documentation page has its own h1 (the documentation shell's title), so the screen's title
    // is a level-2 heading (TCRN-DS-SUB-150, SUB-163).
    header: { title: t("Roster"), headingLevel: 2 },
    content: (
      <div className="tcrn-product-shell-content-stack">
        <Text>{t("Twelve people across four teams, updated today.")}</Text>
      </div>
    )
  };
}

interface ShellStoryScreenViewProps {
  storyId: string;
  screen: ShellStoryScreen;
  locale?: TcrnLocale;
  t?: Translate;
  /** The shell the intro lands in, once it is mounted; nothing plays without it. */
  introScope?: RefObject<HTMLElement | null> | null;
  /** Whether this screen takes ⌘K / Ctrl+K: only the one the page's address names (shellShortcutParameter). */
  shortcut?: boolean;
}

/** The pins and products a controlled screen takes from its controller (TCRN-DS-SUB-186). */
type ShellStoryControl = Pick<ProductShellProps, "pinnedIds" | "onPinnedChange" | "onPinsReorder" | "products">;

/**
 * One board screen: the package ProductShell with the board's sample, the board's state and its
 * preview states. Closed screens keep their own state, so their brand button opens the menu; the
 * open screens are held open.
 */
function ShellStoryScreenView({ storyId, screen, locale = tcrnDefaultLocale, t = untranslated, introScope = null, shortcut = false, control }: ShellStoryScreenViewProps & { control?: ShellStoryControl }) {
  const page = shellStoryPage(storyId, screen, t);
  const shell = (
    <ProductShell
      productName="TCRN TMS"
      moduleName={page.moduleName}
      brandProductId="tms"
      currentRouteLabel={page.routeLabel}
      pageHeader={page.header}
      navGroups={shellStoryNavGroups(storyId, t, page.current)}
      locales={tcrnLocaleMetadata}
      currentLocale={locale}
      currentTheme={shellStoryThemeAttribute[screen.theme]}
      account={{ name: "Lin Xia", initials: "LX" }}
      notifications={{ unread: 3 }}
      pinnedIds={control?.pinnedIds ?? shellStoryPinnedIds}
      onPinnedChange={control?.onPinnedChange ?? ignore}
      onPinsReorder={control?.onPinsReorder}
      products={control?.products}
      menuOpen={screen.state === "expanded" ? true : undefined}
      // A screen leaves ⌘K to the page's own shell unless the page names it (TCRN-DS-SUB-179).
      menuShortcut={shortcut}
      openPinId={screen.state === "drop" ? shellStoryDropPinId : undefined}
      previewStates={shellStoryPreviewStates[screen.state]}
      menuQuery={screen.typed ? shellStoryTypedQuery(t(screen.typed)) : undefined}
      // Every screen is a shell of its own on the documentation page, beside the page's shell: its
      // landmarks are named after the screen (TCRN-DS-SUB-150, SUB-148; axe landmark-unique).
      landmarkLabel={t(screen.label)}
      contentId={`${storyId}-${screen.screen}-content`}
      contentLabel={t(screen.label)}
      data-shell={screen.screen}
    >
      {page.content}
    </ProductShell>
  );
  const framed: ReactNode = screen.presentation ? (
    <shellMenuPresentationContext.Provider value={screen.presentation}>{shell}</shellMenuPresentationContext.Provider>
  ) : (
    shell
  );
  return (
    <>
      {framed}
      {screen.intro && introScope ? <ShellIntro productId="tms" card={<ProductLockup productId="tms" />} locale={locale} shellRef={introScope} /> : null}
    </>
  );
}

/**
 * A controlled screen (TCRN-DS-SUB-186): the board's screen with its pins taken from
 * useProductShellController's productShellControlProps (the pins, pinning and reordering; the screen's
 * theme and the page's language stay the screen's) and the products of the avatar menu. The server and the
 * hydration render the board's pins, so the markup React hydrates is the markup it rendered; once mounted,
 * the pins the reader left in the browser's store take their place.
 */
function ShellStoryControlledScreenView({ storyId, ...props }: ShellStoryScreenViewProps) {
  const controller = useProductShellController({
    productId: shellStoryProductId,
    pinsStorageKey: shellStoryPinsStorageKey,
    initialPins: shellStoryPinnedIds,
    requestPreferences: { pins: shellStoryPinnedIds }
  });
  const { pinnedIds, onPinnedChange, onPinsReorder } = controller.productShellControlProps;
  const { setPins } = controller;
  useEffect(() => {
    const stored = storedShellStoryPins();
    if (stored) setPins(stored);
  }, [setPins]);
  const products = useMemo(() => shellStoryProducts(storyId), [storyId]);
  return <ShellStoryScreenView storyId={storyId} {...props} control={{ pinnedIds, onPinnedChange, onPinsReorder, products }} />;
}

interface ShellStoryRootProps {
  storyId: string;
  screen: ShellStoryScreen;
  /** The block the screen is mounted in (client only). */
  block?: HTMLElement | null;
  /** Told once the screen has mounted (client only). */
  onMounted?: () => void;
}

// What the page's language and theme scripts (client-scripts.ts, storybookI18nScript and
// storybookThemeScript) leave on window, and what the documentation shell leaves there for the gates.
interface StorybookLocaleWindow {
  tcrnStorybookResolvedLocale?: string;
  tcrnStorybookTextFor?: (locale: string, key: string) => string;
  tcrnStorybookResolvedTheme?: string;
  tcrnStorybookApplyTheme?: (theme: string, updateUrl: boolean) => void;
  tcrnStorybookApplyLocale?: (locale: string, updateUrl: boolean) => void;
  tcrnDocShellLayers?: DocShellLayers;
}
const storybookWindow = (): StorybookLocaleWindow | undefined => (typeof window === "undefined" ? undefined : (window as unknown as StorybookLocaleWindow));

function pageLocale(): TcrnLocale {
  const locale = storybookWindow()?.tcrnStorybookResolvedLocale;
  return (tcrnSupportedLocales as readonly string[]).includes(locale ?? "") ? (locale as TcrnLocale) : tcrnDefaultLocale;
}

function translatorFor(locale: TcrnLocale): Translate {
  const textFor = storybookWindow()?.tcrnStorybookTextFor;
  if (locale === tcrnDefaultLocale) return untranslated;
  return textFor ? (text) => textFor(locale, text) ?? text : untranslated;
}

/**
 * A screen as the page renders it: on the server and in the first client render it is the English
 * screen of the build; once mounted it follows the page's language and, on the intro screen,
 * mounts ShellIntro.
 */
export function ShellStoryRoot({ storyId, screen, block = null, onMounted }: ShellStoryRootProps) {
  const [locale, setLocale] = useState<TcrnLocale>(tcrnDefaultLocale);
  const [mounted, setMounted] = useState(false);
  const [shortcutScreen, setShortcutScreen] = useState<string | null>(null);
  const introScope = useMemo<RefObject<HTMLElement | null>>(() => ({ current: block }), [block]);
  useEffect(() => {
    setMounted(true);
    setShortcutScreen(shellShortcutScreen());
    onMounted?.();
    const follow = () => setLocale(pageLocale());
    follow();
    window.addEventListener("tcrn-storybook-locale-applied", follow);
    return () => window.removeEventListener("tcrn-storybook-locale-applied", follow);
    // Mounted once: the callback that matters is the mount's.
  }, []);
  // The block says the language its screen now shows (shellHydratedAttribute): an effect runs after its
  // commit, so the block's markup is the language's when the attribute changes. The hydration's own
  // commit (the build's English, before the page's language is read) is not marked.
  useEffect(() => {
    if (mounted && block) block.setAttribute(shellHydratedAttribute, locale);
  }, [block, locale, mounted]);
  const t = useMemo(() => translatorFor(locale), [locale]);
  const View = screen.controlled ? ShellStoryControlledScreenView : ShellStoryScreenView;
  return <View storyId={storyId} screen={screen} locale={locale} t={t} introScope={mounted && block ? introScope : null} shortcut={mounted && shortcutScreen === screen.screen} />;
}

// ---------------------------------------------------------------------------------------------
// The documentation shell (TCRN-DS-SUB-201; STORY-147 D1, STORY-144, STORY-141). Every page wears the
// one shell there is, the package ProductShell, and it is the live part, hydrated here as the screens
// are: the page carries its model as JSON (data-doc-shell-config, written by page-template.tsx in the
// build's English) and the server render of DocShellRoot in a block (data-doc-shell-root). Once mounted
// the shell holds its layers itself (the full menu, the avatar menu, its language list), 760 wide and
// narrower its full menu is the Sheet (data-state="sheet"), its search is the page's index
// (data-doc-search-index) through searchProvider, and its theme toggle and language menu call the
// page's own theme and language scripts, whose events it follows. The page body inside the paper is
// the page's static markup (data-doc-page-body): React renders it once, as the server did, and leaves
// it to the page's scripts and to the shell story blocks in it.

/** The block of the documentation shell. */
export const docShellRootAttribute = "data-doc-shell-root";
/** The script element that holds the documentation shell's model as JSON. */
export const docShellConfigAttribute = "data-doc-shell-config";
/** The documentation shell's page body: static markup, the page scripts'. */
export const docPageBodyAttribute = "data-doc-page-body";
/** The id prefix of the documentation shell's render, the same on the server and in hydration. */
export const docShellIdentifierPrefix = "tcrn-doc-shell-";

/** The documentation shell's model for a page, in one language (page-template.tsx builds it). */
export interface DocShellConfig {
  /** The page's kind: a section index, a category page or a reference page (data-doc-page). */
  kind: string;
  /** The page's section (data-active-story-section). */
  section: string;
  /** The site's name: the shell's product, its module and the name of its landmarks. */
  siteName: string;
  /** The page's title: the paper's h1, the current position's last step and the main region's name. */
  title: string;
  breadcrumbs: PageHeaderBreadcrumb[];
  /** The full menu: the sections, then one column per section with its categories. */
  navGroups: ProductShellNavGroup[];
  pinnedIds: string[];
  searchPlaceholder: string;
  skipLinkLabel: string;
  /** The page's contents in the paper (TocRail). */
  toc: { label: string; headingLevel?: 2 | 3; items: TocItem[] };
}

export type DocShellTheme = "light" | "dark";

/**
 * What the documentation shell leaves on window for the gates: its two layers, opened or closed at once, leaving the
 * reader's focus where it is. `presentation: "panel"` opens the full menu as the panel at any width, for a gate that
 * reads the menu model's rows and bottom bar where the viewport would show the Sheet; a reader's menu follows the viewport.
 */
export interface DocShellLayers {
  setMenu: (open: boolean, options?: { presentation?: "panel" }) => void;
  setAccount: (open: boolean) => void;
}

type DocMenuEntry = ProductShellNavGroup["items"][number];

/** The strings of a model in a fixed order: the same order in every language, so they pair up. */
export function docShellConfigStrings(config: DocShellConfig): string[] {
  const entries = (items: readonly DocMenuEntry[]): string[] =>
    items.flatMap((item) => [item.label, ...(item.description ? [item.description] : []), ...(item.children ? entries(item.children as readonly DocMenuEntry[]) : [])]);
  return [
    config.siteName,
    config.title,
    config.searchPlaceholder,
    config.skipLinkLabel,
    config.toc.label,
    ...config.breadcrumbs.map((crumb) => crumb.label),
    ...config.toc.items.map((item) => item.label),
    ...config.navGroups.flatMap((group) => [group.label, ...entries(group.items)])
  ];
}

// The page body: React renders the markup it is given once and leaves it (memo: the same string is
// the same body), so the page's scripts and the shell story blocks in it keep their nodes.
const DocPageBody = memo(function DocPageBody({ html }: { html: string }) {
  return <div className="tcrn-doc-page__body" data-doc-page-body="" dangerouslySetInnerHTML={{ __html: html }} />;
});

export interface DocShellViewProps {
  config: DocShellConfig;
  locale: TcrnLocale;
  theme: DocShellTheme;
  /** The page body's markup (the server's marker, or the page's body when hydrating). */
  body: string;
  t?: Translate;
  /** The href a destination of the shell links to (the page's preferences in its query). */
  link?: (href: string) => string;
  menuOpen?: boolean;
  onMenuOpenChange?: (open: boolean) => void;
  accountMenuOpen?: boolean;
  onAccountMenuOpenChange?: (open: boolean) => void;
  localeMenuOpen?: boolean;
  onLocaleMenuOpenChange?: (open: boolean) => void;
  /** Whether ⌘K / Ctrl+K is this shell's (TCRN-DS-SUB-185, SUB-179). */
  menuShortcut?: boolean;
  searchProvider?: ProductShellProps["searchProvider"];
  onThemeChange?: ProductShellProps["onThemeChange"];
  onLocaleChange?: (locale: string) => void;
  /** The full menu's presentation; the viewport's ("auto") unless a gate asks for the panel (DocShellLayers). */
  presentation?: ShellMenuPresentation;
}

const sameHref = (href: string) => href;

/** The documentation shell as a page shows it: the package ProductShell with the page's model. */
export function DocShellView({ config, locale, theme, body, t = untranslated, link = sameHref, presentation = "auto", ...layers }: DocShellViewProps) {
  const entry = (item: DocMenuEntry): DocMenuEntry => ({
    ...item,
    label: t(item.label),
    ...(item.description ? { description: t(item.description) } : {}),
    ...(item.href ? { href: link(item.href) } : {}),
    ...(item.children ? { children: (item.children as readonly DocMenuEntry[]).map(entry) } : {})
  });
  // The provider is always there (its default is "auto"), so the tree keeps its shape when a gate asks for the panel.
  return (
    <shellMenuPresentationContext.Provider value={presentation}>
    <ProductShell
      productName={t(config.siteName)}
      moduleName={t(config.siteName)}
      brandProductId="design-system"
      currentRouteLabel={t(config.title)}
      navGroups={config.navGroups.map((group) => ({ ...group, label: t(group.label), items: group.items.map(entry) }))}
      locales={tcrnLocaleMetadata}
      currentLocale={locale}
      currentTheme={theme}
      // The page's own shell: its title is the page's h1 (the paper's default), and its landmarks are
      // named after the site, apart from the story shells' on the same page (TCRN-DS-SUB-150, SUB-184).
      pageHeader={{ title: t(config.title), breadcrumbs: config.breadcrumbs.map((crumb) => ({ ...crumb, label: t(crumb.label), ...(crumb.href ? { href: link(crumb.href) } : {}) })) }}
      landmarkLabel={t(config.siteName)}
      pinnedIds={config.pinnedIds}
      menuOpen={layers.menuOpen ?? false}
      onMenuOpenChange={layers.onMenuOpenChange ? (open) => layers.onMenuOpenChange?.(open) : undefined}
      menuShortcut={layers.menuShortcut}
      accountMenuOpen={layers.accountMenuOpen ?? false}
      onAccountMenuOpenChange={layers.onAccountMenuOpenChange}
      localeMenuOpen={layers.localeMenuOpen ?? false}
      onLocaleMenuOpenChange={layers.onLocaleMenuOpenChange ? (open) => layers.onLocaleMenuOpenChange?.(open) : undefined}
      searchPlaceholder={t(config.searchPlaceholder)}
      searchProvider={layers.searchProvider}
      onThemeChange={layers.onThemeChange}
      onLocaleChange={layers.onLocaleChange}
      contentId="content"
      contentRole="main"
      contentLabel={t(config.title)}
      skipLinkLabel={t(config.skipLinkLabel)}
      data-shell="doc"
      data-doc-shell="online-docs"
      data-contract-surface="tcrn-design-system-storybook"
      data-anchor-scroll-controlled="true"
      data-active-story-section={config.section}
      data-storybook-locale={locale}
      data-storybook-supported-locales={tcrnSupportedLocales.join(",")}
      data-storybook-theme={theme}
      data-storybook-supported-themes="light,dark"
      data-tcrn-theme={theme}
    >
      <div className="tcrn-doc-page" data-doc-page={config.kind}>
        <DocPageBody html={body} />
        <div className="tcrn-doc-page__toc" data-doc-toc="">
          <TocRail
            label={t(config.toc.label)}
            items={config.toc.items.map((item) => ({ ...item, label: t(item.label), ...(item.href ? { href: link(item.href) } : {}) }))}
            headingLevel={config.toc.headingLevel}
          />
        </div>
      </div>
    </ProductShell>
    </shellMenuPresentationContext.Provider>
  );
}

function pageTheme(): DocShellTheme {
  return storybookWindow()?.tcrnStorybookResolvedTheme === "dark" ? "dark" : "light";
}

/**
 * A destination with the page's language and theme in its query, as the page's scripts write the
 * static links: another page keeps the reader's preferences; a fragment of this page stays a fragment.
 */
function docPreferenceLink(href: string, locale: string, theme: string): string {
  if (!href || href.startsWith("#")) return href;
  const next = new URL(href, window.location.href);
  if (next.pathname === window.location.pathname && next.hash) return next.hash;
  next.searchParams.set("locale", locale);
  next.searchParams.set("theme", theme);
  return `${next.pathname.split("/").pop() || "index.html"}${next.search}${next.hash}`;
}

interface DocSearchIndexEntry {
  label: string;
  group?: string;
  href: string;
}

let docSearchIndexCache: readonly DocSearchIndexEntry[] | undefined;
function docSearchIndex(): readonly DocSearchIndexEntry[] {
  if (docSearchIndexCache) return docSearchIndexCache;
  try {
    const parsed: unknown = JSON.parse(document.querySelector("[data-doc-search-index]")?.textContent ?? "[]");
    docSearchIndexCache = Array.isArray(parsed) ? (parsed as DocSearchIndexEntry[]) : [];
  } catch {
    docSearchIndexCache = [];
  }
  return docSearchIndexCache;
}

const docSearchMaxResults = 8;
const docSearchNormal = (value: string) => value.trim().toLocaleLowerCase();

/**
 * The documentation search (the full menu's): the site's sections, categories and stories from the
 * page's index (their labels are dictionary keys, said in the reader's language), then this page's
 * ReadbackPanels and, on a reference page, its component regions, as the page reads them now.
 */
function docSearchProvider(locale: TcrnLocale, link: (href: string) => string): NonNullable<ProductShellProps["searchProvider"]> {
  return (query) => {
    const needle = docSearchNormal(query);
    if (!needle) return [];
    const textFor = storybookWindow()?.tcrnStorybookTextFor;
    const say = (key: string) => (textFor ? textFor(locale, key) ?? key : key);
    const site = docSearchIndex().map((entry) => ({ title: say(entry.label), meta: entry.group ? say(entry.group) : "", href: entry.href }));
    const panels = Array.from(document.querySelectorAll<HTMLElement>(".tcrn-readback-panel[id]")).map((panel) => ({
      title: panel.querySelector(":scope > h2.tcrn-heading, :scope > h3.tcrn-heading, :scope > h4.tcrn-heading")?.textContent?.trim() ?? "",
      meta: panel.closest("[data-contract-story-id]")?.querySelector(".tcrn-doc-story-disclosure__title")?.textContent?.trim() ?? "",
      href: `#${panel.id}`
    }));
    const components = Array.from(document.querySelectorAll<HTMLElement>("[data-component-reference-id][id]")).map((region) => ({
      title: region.getAttribute("data-component-reference-id") ?? "",
      meta: say("group.Components"),
      href: `#${region.id}`
    }));
    return [...site, ...panels, ...components]
      .filter((item) => item.title && docSearchNormal([item.title, item.meta].filter(Boolean).join(" ")).includes(needle))
      .slice(0, docSearchMaxResults)
      .map((item, index) => ({
        id: `doc-search-${index}`,
        title: item.title,
        ...(item.meta && item.meta !== item.title ? { meta: item.meta } : {}),
        href: link(item.href)
      }));
  };
}

interface DocShellRootProps {
  config: DocShellConfig;
  body: string;
  /** The block the shell is mounted in (client only). */
  block?: HTMLElement | null;
}

/**
 * The documentation shell as the page renders it: on the server and in the first client render it is
 * the build's English shell with its layers closed; once mounted it speaks the page's language, wears
 * its theme, links with both, and holds its layers.
 */
export function DocShellRoot({ config, body, block = null }: DocShellRootProps) {
  const [locale, setLocale] = useState<TcrnLocale>(tcrnDefaultLocale);
  const [theme, setTheme] = useState<DocShellTheme>("light");
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [localeMenuOpen, setLocaleMenuOpen] = useState(false);
  const [presentation, setPresentation] = useState<ShellMenuPresentation>("auto");
  // ⌘K is the documentation shell's unless the page's address gives it to a screen (TCRN-DS-SUB-179).
  const [ownsShortcut, setOwnsShortcut] = useState(true);
  const localeMenuOpenRef = useRef(false);
  const listEscapeRef = useRef(false);
  useEffect(() => {
    setMounted(true);
    setOwnsShortcut(shellShortcutScreen() === null);
    const followLocale = () => setLocale(pageLocale());
    const followTheme = () => setTheme(pageTheme());
    followLocale();
    followTheme();
    window.addEventListener("tcrn-storybook-locale-applied", followLocale);
    window.addEventListener("tcrn-storybook-theme-applied", followTheme);
    // Esc in the open language list closes the list and returns the focus to its trigger, and leaves the
    // avatar menu around it open (TCRN-DS-SUB-166): the avatar menu's own Esc, heard first, is not taken
    // while the list is open. The press is noted on the way down and forgotten once it has been handled.
    const noteListEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !localeMenuOpenRef.current) return;
      listEscapeRef.current = true;
      window.setTimeout(() => {
        listEscapeRef.current = false;
      }, 0);
    };
    document.addEventListener("keydown", noteListEscape, true);
    const page = storybookWindow();
    // The gates open and close the layers through this and read the result at once (flushSync); like the
    // page's former layer interface it leaves the reader's focus where it is.
    const keepingFocus = (change: () => void) => {
      const before = document.activeElement;
      const focused = before instanceof HTMLElement && before !== document.body ? before : null;
      flushSync(change);
      const now = document.activeElement;
      if (now === focused) return;
      if (focused && focused.isConnected) focused.focus({ preventScroll: true });
      else if (now instanceof HTMLElement && now !== document.body) now.blur();
    };
    if (page) {
      page.tcrnDocShellLayers = {
        setMenu: (open, options) => keepingFocus(() => {
          setPresentation(open && options?.presentation ? options.presentation : "auto");
          setMenuOpen(open);
          if (open) setAccountMenuOpen(false);
        }),
        setAccount: (open) => keepingFocus(() => {
          setAccountMenuOpen(open);
          if (open) setMenuOpen(false);
          else setLocaleMenuOpen(false);
        })
      };
    }
    return () => {
      window.removeEventListener("tcrn-storybook-locale-applied", followLocale);
      window.removeEventListener("tcrn-storybook-theme-applied", followTheme);
      document.removeEventListener("keydown", noteListEscape, true);
      if (page) delete page.tcrnDocShellLayers;
    };
  }, []);
  useEffect(() => {
    localeMenuOpenRef.current = localeMenuOpen;
  }, [localeMenuOpen]);
  // The block says the language its shell now shows, as the screens' blocks do (shellHydratedAttribute).
  useEffect(() => {
    if (mounted && block) block.setAttribute(shellHydratedAttribute, locale);
  }, [block, locale, mounted]);
  const t = useMemo(() => translatorFor(locale), [locale]);
  // The server's links are the model's; once mounted they carry the page's preferences.
  const link = useMemo(() => (mounted ? (href: string) => docPreferenceLink(href, locale, theme) : sameHref), [mounted, locale, theme]);
  const searchProvider = useMemo(() => docSearchProvider(locale, link), [locale, link]);
  return (
    <DocShellView
      config={config}
      locale={locale}
      theme={theme}
      body={body}
      t={t}
      link={link}
      presentation={presentation}
      menuShortcut={ownsShortcut}
      menuOpen={menuOpen}
      onMenuOpenChange={(open) => {
        setMenuOpen(open);
        if (!open) setPresentation("auto");
      }}
      accountMenuOpen={accountMenuOpen}
      onAccountMenuOpenChange={(open) => {
        if (!open && listEscapeRef.current) return;
        setAccountMenuOpen(open);
        if (!open) setLocaleMenuOpen(false);
      }}
      localeMenuOpen={localeMenuOpen}
      onLocaleMenuOpenChange={setLocaleMenuOpen}
      searchProvider={searchProvider}
      onThemeChange={(next) => storybookWindow()?.tcrnStorybookApplyTheme?.(next, true)}
      onLocaleChange={(next) => {
        setLocaleMenuOpen(false);
        storybookWindow()?.tcrnStorybookApplyLocale?.(next, true);
      }}
    />
  );
}

/** Reports an error the way an uncaught one is reported, without stopping the page's other mounts. */
function reportMountError(error: unknown): void {
  if (typeof window !== "undefined" && typeof window.reportError === "function") window.reportError(error);
  else console.error(error);
}

/** Hydrates the page's documentation shell; returns whether it mounted it. */
function mountDocShell(doc: Document): boolean {
  const block = doc.querySelector<HTMLElement>(`[${docShellRootAttribute}]`);
  const source = doc.querySelector(`script[${docShellConfigAttribute}]`);
  if (!block || !source) return false;
  try {
    const config = JSON.parse(source.textContent ?? "") as DocShellConfig;
    const body = block.querySelector(`[${docPageBodyAttribute}]`)?.innerHTML ?? "";
    hydrateRoot(block, <DocShellRoot config={config} body={body} block={block} />, { identifierPrefix: docShellIdentifierPrefix });
    return true;
  } catch (error) {
    reportMountError(error);
    return false;
  }
}

/** The screen a block names: its story's data-shell-story and its own data-shell-story-block. */
export function shellStoryScreenOf(storyId: string | null | undefined, screenId: string | null | undefined): ShellStoryScreen | undefined {
  if (!storyId || !screenId) return undefined;
  return shellStoryScreens[storyId]?.find((screen) => screen.screen === screenId);
}

// focus() into a block that has not mounted yet is held: the open screens' menus would otherwise
// move the reader's focus (and scroll the page) to the last of them when the page loads. Each block is
// let go once it has mounted, or at once when its mount fails (TCRN-DS-SUB-201): a block that never
// mounts does not hold the others' focus, and focus() is the browser's own again once every block is
// let go. The documentation shell is not held: it mounts closed and moves no focus.
function holdFocusUntilMounted(blocks: readonly HTMLElement[]): (block: HTMLElement) => void {
  const pending = new Set(blocks);
  const prototype = HTMLElement.prototype;
  const focus = prototype.focus;
  if (pending.size === 0) return () => undefined;
  prototype.focus = function focusOutsideMountingBlocks(this: HTMLElement, options?: FocusOptions) {
    for (const block of pending) if (block.contains(this)) return;
    focus.call(this, options);
  };
  return (block) => {
    if (!pending.delete(block) || pending.size > 0) return;
    if (prototype.focus !== focus) prototype.focus = focus;
  };
}

/**
 * Hydrates the page's documentation shell and every shell story block of the page; returns how many
 * story screens it mounted. Each block is mounted in its own try / finally: a block that throws, or
 * whose screen fails to render, is let go and reported, and the other blocks still mount.
 */
export function mountShellStories(doc: Document = document): number {
  mountDocShell(doc);
  const blocks = [...doc.querySelectorAll<HTMLElement>(`[${shellHydrateAttribute}]`)].filter((block) => !block.hasAttribute(docShellRootAttribute));
  const release = holdFocusUntilMounted(blocks);
  let count = 0;
  for (const block of blocks) {
    let mounting = false;
    try {
      const storyId = block.closest("[data-shell-story]")?.getAttribute("data-shell-story");
      const screen = shellStoryScreenOf(storyId, block.getAttribute("data-shell-story-block"));
      if (storyId && screen) {
        hydrateRoot(block, <ShellStoryRoot storyId={storyId} screen={screen} block={block} onMounted={() => release(block)} />, {
          identifierPrefix: shellStoryIdentifierPrefix(storyId, screen.screen),
          onUncaughtError: (error) => {
            release(block);
            reportMountError(error);
          }
        });
        mounting = true;
        count += 1;
      }
    } catch (error) {
      reportMountError(error);
    } finally {
      if (!mounting) release(block);
    }
  }
  return count;
}
