// Visible and accessible copy of the top-band shell parts (TCRN-DS-INIT-016, C-10): one table,
// five locales from one source (the locales of tcrnSupportedLocales). The shell parts read it
// through tcrnShellCopyFor(); a part that needs a new string adds its key in all five locales.
//
// TCRN-DS-SUB-114: the brand button's name, which says what pressing it does to the full menu
// and names the product (07a board: "展开导航 · TCRN TMS" closed, "收起导航 · TCRN TMS" open).
// TCRN-DS-SUB-115: the name of the pinned items group in the top band (07a board: "固定项").
import type { TcrnLocale } from "@tcrn/ui-copy-state";
import { resolveDocumentLocale } from "../../utils.js";

export interface TcrnShellCopy {
  /** Brand button name while the full menu is closed: pressing it opens the navigation. */
  openNavigationOf: (productName: string) => string;
  /** Brand button name while the full menu is open: pressing it closes the navigation. */
  closeNavigationOf: (productName: string) => string;
  /** Name of the pinned items group in the top band. */
  pinnedItems: string;
}

export const tcrnShellCopy: Readonly<Record<TcrnLocale, TcrnShellCopy>> = {
  "zh-CN": {
    openNavigationOf: (productName) => `展开导航 · ${productName}`,
    closeNavigationOf: (productName) => `收起导航 · ${productName}`,
    pinnedItems: "固定项"
  },
  en: {
    openNavigationOf: (productName) => `Open navigation · ${productName}`,
    closeNavigationOf: (productName) => `Close navigation · ${productName}`,
    pinnedItems: "Pinned items"
  },
  ja: {
    openNavigationOf: (productName) => `ナビゲーションを開く · ${productName}`,
    closeNavigationOf: (productName) => `ナビゲーションを閉じる · ${productName}`,
    pinnedItems: "固定した項目"
  },
  ko: {
    openNavigationOf: (productName) => `내비게이션 열기 · ${productName}`,
    closeNavigationOf: (productName) => `내비게이션 닫기 · ${productName}`,
    pinnedItems: "고정한 항목"
  },
  fr: {
    openNavigationOf: (productName) => `Ouvrir la navigation · ${productName}`,
    closeNavigationOf: (productName) => `Fermer la navigation · ${productName}`,
    pinnedItems: "Éléments épinglés"
  }
};

/** The shell copy for the reader's language (the page's own when no locale is given). */
export function tcrnShellCopyFor(locale?: TcrnLocale | string): TcrnShellCopy {
  return tcrnShellCopy[resolveDocumentLocale(locale)];
}
