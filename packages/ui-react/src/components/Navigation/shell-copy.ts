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
    searchWithin: (name) => `搜索${name}`
  },
  en: {
    openNavigationOf: (productName) => `Open navigation · ${productName}`,
    closeNavigationOf: (productName) => `Close navigation · ${productName}`,
    pinnedItems: "Pinned items",
    navigation: "Navigation",
    searchNavigation: "Search pages and content",
    currentPosition: "Current location",
    pinnedGroup: "Pinned",
    searchWithin: (name) => `Search ${name}`
  },
  ja: {
    openNavigationOf: (productName) => `ナビゲーションを開く · ${productName}`,
    closeNavigationOf: (productName) => `ナビゲーションを閉じる · ${productName}`,
    pinnedItems: "固定した項目",
    navigation: "ナビゲーション",
    searchNavigation: "ページとコンテンツを検索",
    currentPosition: "現在の位置",
    pinnedGroup: "固定済み",
    searchWithin: (name) => `${name}を検索`
  },
  ko: {
    openNavigationOf: (productName) => `내비게이션 열기 · ${productName}`,
    closeNavigationOf: (productName) => `내비게이션 닫기 · ${productName}`,
    pinnedItems: "고정한 항목",
    navigation: "내비게이션",
    searchNavigation: "페이지와 콘텐츠 검색",
    currentPosition: "현재 위치",
    pinnedGroup: "고정됨",
    searchWithin: (name) => `${name} 검색`
  },
  fr: {
    openNavigationOf: (productName) => `Ouvrir la navigation · ${productName}`,
    closeNavigationOf: (productName) => `Fermer la navigation · ${productName}`,
    pinnedItems: "Éléments épinglés",
    navigation: "Navigation",
    searchNavigation: "Rechercher des pages et des contenus",
    currentPosition: "Emplacement actuel",
    pinnedGroup: "Épinglés",
    searchWithin: (name) => `Rechercher dans ${name}`
  }
};

/** The shell copy for the reader's language (the page's own when no locale is given). */
export function tcrnShellCopyFor(locale?: TcrnLocale | string): TcrnShellCopy {
  return tcrnShellCopy[resolveDocumentLocale(locale)];
}
