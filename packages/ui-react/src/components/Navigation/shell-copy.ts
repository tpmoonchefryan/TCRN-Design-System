// Visible and accessible copy of the top-band shell parts (TCRN-DS-INIT-016, C-10): one table,
// five locales from one source (the locales of tcrnSupportedLocales). The shell parts read it
// through tcrnShellCopyFor(); a part that needs a new string adds its key in all five locales.
//
// TCRN-DS-SUB-114: the brand button's name, which says what pressing it does to the full menu
// and names the product (07a board: "展开导航 · TCRN TMS" closed, "收起导航 · TCRN TMS" open).
// TCRN-DS-SUB-115: the name of the pinned items group in the top band (07a board: "固定项").
// TCRN-DS-SUB-116: the full menu's name ("导航"), its search placeholder and the label of the
// current position in its bottom bar ("当前位置"). The board's placeholder names the TMS objects
// ("搜索页面、艺人、合约"); the built-in one is product-neutral and a product may pass its own.
// TCRN-DS-SUB-117: the full menu's extra group narrower than 1024, where the band shows no pinned
// items and the menu lists them all ("已固定").
// TCRN-DS-SUB-118: the drop-down's search placeholder, which names the pinned entry ("搜索合约").
// TCRN-DS-SUB-119: the top-right cluster of ProductShell (07a board: the bell "通知 · 3 条未读" and the
// avatar "林晓 · 账户、切换产品、主题与语言") and its avatar menu: the account, the product switcher,
// and the theme and language, which moved there from the old top bar (decomposition problem 14).
// TCRN-DS-SUB-126: the Sheet's two lists, 760 wide and narrower (07a board, screen A8: the pinned
// entries under "固定项 · 4", then every group under "全部").
import type { TcrnLocale } from "@tcrn/ui-copy-state";
import { resolveDocumentLocale } from "../../utils.js";

export interface TcrnShellCopy {
  /** Brand button name while the full menu is closed: pressing it opens the navigation. */
  openNavigationOf: (productName: string) => string;
  /** Brand button name while the full menu is open: pressing it closes the navigation. */
  closeNavigationOf: (productName: string) => string;
  /** Name of the pinned items group in the top band. */
  pinnedItems: string;
  /** Name of the full menu (the dialog the brand button opens). */
  navigation: string;
  /** Placeholder of the full menu's search. */
  searchNavigation: string;
  /** Label of the current position in the full menu's bottom bar; also the name of that trail. */
  currentPosition: string;
  /** Title of the full menu's group of pinned items, shown narrower than 1024. */
  pinnedGroup: string;
  /** Placeholder of a drop-down's search, which searches the pinned entry's part of the menu. */
  searchWithin: (name: string) => string;
  /** Name of the avatar menu, and of the avatar when no account is given. */
  account: string;
  /** Avatar name: the reader and what the menu holds. */
  accountMenuOf: (name: string) => string;
  /** Name and heading of the avatar menu's product switcher. */
  switchProduct: string;
  /** Name of the avatar menu's theme and language controls. */
  themeAndLanguage: string;
  /** Bell name, with the unread count when there is one. */
  notificationsOf: (unread: number) => string;
  /** Title of the Sheet's list of pinned entries, with their count. */
  pinnedItemsOf: (count: number) => string;
  /** Title of the Sheet's list of every group. */
  allNavigation: string;
}

export const tcrnShellCopy: Readonly<Record<TcrnLocale, TcrnShellCopy>> = {
  "zh-CN": {
    openNavigationOf: (productName) => `展开导航 · ${productName}`,
    closeNavigationOf: (productName) => `收起导航 · ${productName}`,
    pinnedItems: "固定项",
    navigation: "导航",
    searchNavigation: "搜索页面与内容",
    currentPosition: "当前位置",
    pinnedGroup: "已固定",
    searchWithin: (name) => `搜索${name}`,
    account: "账户",
    accountMenuOf: (name) => `${name} · 账户、切换产品、主题与语言`,
    switchProduct: "切换产品",
    themeAndLanguage: "主题与语言",
    notificationsOf: (unread) => (unread > 0 ? `通知 · ${unread} 条未读` : "通知"),
    pinnedItemsOf: (count) => `固定项 · ${count}`,
    allNavigation: "全部"
  },
  en: {
    openNavigationOf: (productName) => `Open navigation · ${productName}`,
    closeNavigationOf: (productName) => `Close navigation · ${productName}`,
    pinnedItems: "Pinned items",
    navigation: "Navigation",
    searchNavigation: "Search pages and content",
    currentPosition: "Current location",
    pinnedGroup: "Pinned",
    searchWithin: (name) => `Search ${name}`,
    account: "Account",
    accountMenuOf: (name) => `${name} · Account, switch product, theme and language`,
    switchProduct: "Switch product",
    themeAndLanguage: "Theme and language",
    notificationsOf: (unread) => (unread > 0 ? `Notifications · ${unread} unread` : "Notifications"),
    pinnedItemsOf: (count) => `Pinned items · ${count}`,
    allNavigation: "All"
  },
  ja: {
    openNavigationOf: (productName) => `ナビゲーションを開く · ${productName}`,
    closeNavigationOf: (productName) => `ナビゲーションを閉じる · ${productName}`,
    pinnedItems: "固定した項目",
    navigation: "ナビゲーション",
    searchNavigation: "ページとコンテンツを検索",
    currentPosition: "現在の位置",
    pinnedGroup: "固定済み",
    searchWithin: (name) => `${name}を検索`,
    account: "アカウント",
    accountMenuOf: (name) => `${name} · アカウント、プロダクトの切り替え、テーマと言語`,
    switchProduct: "プロダクトを切り替え",
    themeAndLanguage: "テーマと言語",
    notificationsOf: (unread) => (unread > 0 ? `通知 · 未読 ${unread} 件` : "通知"),
    pinnedItemsOf: (count) => `固定した項目 · ${count}`,
    allNavigation: "すべて"
  },
  ko: {
    openNavigationOf: (productName) => `내비게이션 열기 · ${productName}`,
    closeNavigationOf: (productName) => `내비게이션 닫기 · ${productName}`,
    pinnedItems: "고정한 항목",
    navigation: "내비게이션",
    searchNavigation: "페이지와 콘텐츠 검색",
    currentPosition: "현재 위치",
    pinnedGroup: "고정됨",
    searchWithin: (name) => `${name} 검색`,
    account: "계정",
    accountMenuOf: (name) => `${name} · 계정, 제품 전환, 테마와 언어`,
    switchProduct: "제품 전환",
    themeAndLanguage: "테마와 언어",
    notificationsOf: (unread) => (unread > 0 ? `알림 · 읽지 않음 ${unread}개` : "알림"),
    pinnedItemsOf: (count) => `고정한 항목 · ${count}`,
    allNavigation: "전체"
  },
  fr: {
    openNavigationOf: (productName) => `Ouvrir la navigation · ${productName}`,
    closeNavigationOf: (productName) => `Fermer la navigation · ${productName}`,
    pinnedItems: "Éléments épinglés",
    navigation: "Navigation",
    searchNavigation: "Rechercher des pages et des contenus",
    currentPosition: "Emplacement actuel",
    pinnedGroup: "Épinglés",
    searchWithin: (name) => `Rechercher dans ${name}`,
    account: "Compte",
    accountMenuOf: (name) => `${name} · Compte, changer de produit, thème et langue`,
    switchProduct: "Changer de produit",
    themeAndLanguage: "Thème et langue",
    notificationsOf: (unread) => (unread > 0 ? `Notifications · ${unread} non lues` : "Notifications"),
    pinnedItemsOf: (count) => `Éléments épinglés · ${count}`,
    allNavigation: "Tout"
  }
};

/** The shell copy for the reader's language (the page's own when no locale is given). */
export function tcrnShellCopyFor(locale?: TcrnLocale | string): TcrnShellCopy {
  return tcrnShellCopy[resolveDocumentLocale(locale)];
}
