// The static pages' client mount for the top-band shell stories (TCRN-DS-SUB-151; STORY-136, 138,
// 139, 141, 144, 147, 149; C-12 of the INIT-016 R2 decomposition).
//
// The documentation pages are rendered on the server. The shell stories (shell-top-band,
// shell-narrow, shell-mobile, shell-intro) show the package ProductShell as the 07a board's
// screens, and what the shell does lives in the browser: the brand button opens the full menu,
// Esc returns the focus to it, ⌘K / Ctrl+K opens the menu at its search, a press outside closes
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
import { useEffect, useMemo, useState, type ReactNode, type RefObject } from "react";
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
  shellMenuPresentationContext,
  tcrnProductLogoRegistry,
  useProductShellController,
  type PageHeaderProps,
  type ProductShellNavGroup,
  type ProductShellProduct,
  type ProductShellProps,
  type ShellMenuPresentation,
  type TcrnProductLogoId
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
}

/** The pins and products a controlled screen takes from its controller (TCRN-DS-SUB-186). */
type ShellStoryControl = Pick<ProductShellProps, "pinnedIds" | "onPinnedChange" | "onPinsReorder" | "products">;

/**
 * One board screen: the package ProductShell with the board's sample, the board's state and its
 * preview states. Closed screens keep their own state, so their brand button opens the menu; the
 * open screens are held open.
 */
function ShellStoryScreenView({ storyId, screen, locale = tcrnDefaultLocale, t = untranslated, introScope = null, control }: ShellStoryScreenViewProps & { control?: ShellStoryControl }) {
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

// What the page's language script (client-scripts.ts, storybookI18nScript) leaves on window.
interface StorybookLocaleWindow {
  tcrnStorybookResolvedLocale?: string;
  tcrnStorybookTextFor?: (locale: string, key: string) => string;
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
  const introScope = useMemo<RefObject<HTMLElement | null>>(() => ({ current: block }), [block]);
  useEffect(() => {
    setMounted(true);
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
  return <View storyId={storyId} screen={screen} locale={locale} t={t} introScope={mounted && block ? introScope : null} />;
}

/** The screen a block names: its story's data-shell-story and its own data-shell-story-block. */
export function shellStoryScreenOf(storyId: string | null | undefined, screenId: string | null | undefined): ShellStoryScreen | undefined {
  if (!storyId || !screenId) return undefined;
  return shellStoryScreens[storyId]?.find((screen) => screen.screen === screenId);
}

// focus() into a block that has not mounted yet is held: the open screens' menus would otherwise
// move the reader's focus (and scroll the page) to the last of them when the page loads.
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

/** Hydrates every shell story block of the page; returns how many it mounted. */
export function mountShellStories(doc: Document = document): number {
  const blocks = [...doc.querySelectorAll<HTMLElement>(`[${shellHydrateAttribute}]`)];
  const mounted = holdFocusUntilMounted(blocks);
  let count = 0;
  for (const block of blocks) {
    const storyId = block.closest("[data-shell-story]")?.getAttribute("data-shell-story");
    const screen = shellStoryScreenOf(storyId, block.getAttribute("data-shell-story-block"));
    if (!storyId || !screen) {
      mounted(block);
      continue;
    }
    hydrateRoot(block, <ShellStoryRoot storyId={storyId} screen={screen} block={block} onMounted={() => mounted(block)} />, {
      identifierPrefix: shellStoryIdentifierPrefix(storyId, screen.screen)
    });
    count += 1;
  }
  return count;
}
