import {
  ProductShell,
  productShellCopyFor,
  useProductShellController,
  type ProductShellCopy,
  type ProductShellLocaleDefinition,
  type ProductShellNavGroup,
  type ProductShellRequestPreferences
} from "../approved.js";
import type { ReactNode } from "react";

// Product-owned candidate copy, exercised through the public API. This is not a sixth DS locale.
export const traditionalChineseShellCopy: ProductShellCopy = {
  shell: {
    openNavigationOf: (name) => `展開導覽 · ${name}`,
    closeNavigationOf: (name) => `收起導覽 · ${name}`,
    pinnedItems: "固定項",
    navigation: "導覽",
    searchNavigation: "搜尋頁面與內容",
    currentPosition: "目前位置",
    pinnedGroup: "已固定",
    searchWithin: (name) => `搜尋${name}`,
    account: "帳戶",
    accountMenuOf: (name) => `${name} · 帳戶、切換產品、主題與語言`,
    switchProduct: "切換產品",
    themeAndLanguage: "主題與語言",
    notificationsOf: (unread) => unread > 0 ? `通知 · ${unread} 則未讀` : "通知",
    pinnedItemsOf: (count) => `固定項 · ${count}`,
    allNavigation: "全部",
    landmarkOf: (prefix, name) => `${prefix} · ${name}`
  },
  chrome: {
    switchToLight: "切換至日間模式",
    switchToDark: "切換至夜間模式",
    language: "語言",
    collapseSideNav: "收起側邊導覽",
    expandSideNav: "展開側邊導覽",
    showNavigation: "顯示導覽",
    hideNavigation: "隱藏導覽",
    breadcrumb: "麵包屑導覽",
    searchShell: "搜尋產品外殼",
    searchPlaceholder: "搜尋",
    searchResults: "搜尋結果",
    searchEmpty: "沒有結果",
    currentLocation: "目前位置",
    shellWorkspace: "產品外殼工作區",
    skipToContent: "跳至外殼內容",
    navItemUnavailable: "此路由無法使用此導覽項目",
    moduleSections: "模組分區",
    sectionNavigation: "分區導覽",
    productLauncher: "產品啟動器",
    productSwitcher: "產品切換器",
    brandHomeOf: (name) => `${name}首頁`,
    shellControlsOf: (name) => `${name}外殼控制`,
    pinToStrip: (label) => `固定至頂帶：${label}`,
    unpinFromStrip: (label) => `從頂帶移除：${label}`
  },
  productTagline: (productId) => {
    if (productId !== "tms") throw new Error(`This product copy has no tagline for ${productId}`);
    return "藝人管理系統";
  }
};

export const productLocaleDefinitions = [
  { locale: "en", lang: "en", copy: productShellCopyFor("en") },
  { locale: "zh_HANS", lang: "zh-Hans", copy: productShellCopyFor("zh-CN") },
  { locale: "zh_HANT", lang: "zh-Hant", copy: traditionalChineseShellCopy },
  { locale: "ja", lang: "ja", copy: productShellCopyFor("ja") },
  { locale: "ko", lang: "ko", copy: productShellCopyFor("ko") },
  { locale: "fr", lang: "fr", copy: productShellCopyFor("fr") }
] as const satisfies readonly ProductShellLocaleDefinition[];

export type BusinessLocale = typeof productLocaleDefinitions[number]["locale"];

const nativeNames: Record<BusinessLocale, string> = {
  en: "English", zh_HANS: "简体中文", zh_HANT: "繁體中文", ja: "日本語", ko: "한국어", fr: "Français"
};
export const productLocaleOptions = productLocaleDefinitions.map(({ locale, lang }) => ({ locale, lang, nativeName: nativeNames[locale] }));

const businessLabels: Record<BusinessLocale, { workspace: string; customers: string; reports: string; daily: string }> = {
  en: { workspace: "Talent workspace", customers: "Customer management", reports: "Reports", daily: "Daily report" },
  zh_HANS: { workspace: "艺人工作区", customers: "客户管理", reports: "报表", daily: "每日报表" },
  zh_HANT: { workspace: "藝人工作區", customers: "客戶管理", reports: "報表", daily: "每日報表" },
  ja: { workspace: "タレントワークスペース", customers: "顧客管理", reports: "レポート", daily: "日次レポート" },
  ko: { workspace: "탤런트 워크스페이스", customers: "고객 관리", reports: "보고서", daily: "일일 보고서" },
  fr: { workspace: "Espace talent", customers: "Gestion des clients", reports: "Rapports", daily: "Rapport quotidien" }
};

export function talentGroupsFor(locale: BusinessLocale): readonly ProductShellNavGroup[] {
  const labels = businessLabels[locale];
  return [{
    id: "talent",
    label: labels.workspace,
    items: [{ id: "customers", label: labels.customers, href: "/tenant/one/talent/one/customers", selected: true }, {
      id: "reports", label: labels.reports, href: "/reports", children: [{ id: "daily", label: labels.daily, href: "/reports/daily" }]
    }]
  }];
}

export function TalentShellLocaleFixture({
  initialLocale = "zh_HANT",
  identity = "user-a/tms",
  accountName = "林曉",
  requestPreferences,
  onLocaleChange,
  onPinsChange,
  onProductClick,
  children
}: {
  initialLocale?: string;
  identity?: string;
  accountName?: string;
  requestPreferences?: ProductShellRequestPreferences<BusinessLocale>;
  onLocaleChange?: (locale: string) => void;
  onPinsChange?: (pins: readonly string[]) => void;
  onProductClick?: (href: string) => void;
  children?: ReactNode;
}) {
  const controller = useProductShellController({
    initialLocale,
    localeDefinitions: productLocaleDefinitions,
    initialPins: ["talent"],
    localeStorageKey: `locale-${encodeURIComponent(identity)}`,
    pinsStorageKey: `pins:${identity}`,
    requestPreferences,
    onLocaleChange,
    onPinsChange
  });
  // The inferred state retains the real product id instead of widening it to an unrelated locale.
  const locale: BusinessLocale = controller.locale;
  const labels = businessLabels[locale];
  return (
    <ProductShell
      {...controller.productShellControlProps}
      data-fixture="talent"
      productName="TCRN TMS"
      moduleName={labels.workspace}
      brandProductId="tms"
      currentRouteLabel={labels.customers}
      navGroups={talentGroupsFor(locale)}
      locales={productLocaleOptions}
      pageHeader={{ title: labels.customers, headingLevel: 2 }}
      menuShortcut={false}
      landmarkLabel="藝人"
      contentId={`talent-content-${identity}`}
      account={{ name: accountName }}
      products={[{ id: "tms", label: "TCRN TMS", href: "/tms", current: true }, { id: "other", label: "其他產品", href: "/other" }]}
      notifications={{ unread: 3 }}
      onClickCapture={(event) => {
        const target = event.target as Element;
        const link = target.closest<HTMLAnchorElement>("[data-shell-product]");
        if (link) {
          event.preventDefault();
          onProductClick?.(link.getAttribute("href") ?? "");
        }
      }}
    >
      <output data-controller-locale={locale} />
      {children ?? <p>{labels.customers}</p>}
    </ProductShell>
  );
}
