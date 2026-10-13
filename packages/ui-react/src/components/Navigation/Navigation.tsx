import type {
  AnchorHTMLAttributes,
  FocusEvent,
  FormEvent,
  HTMLAttributes,
  ImgHTMLAttributes,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  CSSProperties,
  ReactNode,
  SVGAttributes
} from "react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { IconButton, type IconButtonProps } from "../Button/index.js";
// PageHeader is the paper's first row (TCRN-DS-SUB-129). DomainDisplay imports Breadcrumb from here for
// that header's trail (TCRN-DS-SUB-124); both sides use the other only inside function bodies.
import { PageHeader, type PageHeaderBreadcrumb, type PageHeaderProps } from "../DataDisplay/DomainDisplay.js";
import { SearchInput, type SearchInputProps } from "../Form/index.js";
import { Icon, type IconName } from "../Icon/index.js";
import { resolveTcrnLocale, tcrnSupportedLocales, type TcrnLocale } from "@tcrn/ui-copy-state";
import { cx, mergeIds, requiredText, resolveDocumentLocale } from "../../utils.js";
import {
  tcrnProductMarks,
  tcrnProductMarkViewBox,
  tcrnProductMarkWordmark,
  type TcrnProductMark
} from "./product-marks.generated.js";
// The shell parts and Navigation.tsx import each other; what this module takes from them is used
// inside function bodies only, never evaluated when the module loads (C-4).
import { ShellBrandButton } from "./ShellBrandButton.js";
import { ShellDropdown } from "./ShellDropdown.js";
import {
  ShellMenu,
  shellMenuMaxDepth,
  useShellTransientLayer,
  type ShellMenuCrumb,
  type ShellMenuGroup,
  type ShellMenuItem,
  type ShellMenuOpenChangeReason,
  type ShellMenuSearchProvider
} from "./ShellMenu.js";
import { ShellPins, shellPinsMax, type ShellPinItem } from "./ShellPins.js";
import { tcrnShellCopyFor } from "./shell-copy.js";

/**
 * The shell's own words about itself, in every supported locale.
 *
 * Every one of these was an English literal in a parameter default, and they are
 * the shell's most load-bearing strings: the skip link is the first thing a
 * keyboard user reaches on any page, and the theme, collapse and locale controls
 * are icon-only, so their labels are the *entire* accessible name — a
 * screen-reader user on a translated page had nothing else to go on.
 *
 * `ShellLocaleMenu`'s trigger label is the sharpest case: the one control whose
 * job is to change language was the control that could not say so in the reader's
 * language.
 */
interface ShellChromeLabels {
  switchToLight: string;
  switchToDark: string;
  language: string;
  collapseSideNav: string;
  expandSideNav: string;
  /**
   * The mobile navigation control, which is a different control from the two
   * above and says a different thing.
   *
   * `collapseSideNav`/`expandSideNav` narrow the desktop rail to icons — the
   * destinations stay on screen. Below the mobile breakpoint the rail is not a
   * rail, and the same control would be a no-op, so it is hidden there; this
   * one shows and hides the navigation itself. Reusing either label would tell
   * a screen-reader user the rail is about to narrow when it is about to
   * disappear.
   */
  showNavigation: string;
  hideNavigation: string;
  breadcrumb: string;
  searchShell: string;
  searchPlaceholder: string;
  searchResults: string;
  searchEmpty: string;
  currentLocation: string;
  shellWorkspace: string;
  skipToContent: string;
  /**
   * The five with no prop behind them at all.
   *
   * A bad default at least lets a consumer pass the right string; these were
   * literals inline in the JSX, so a product shipping a ja route had no way to
   * reach them short of forking the component. Two are the only accessible name
   * their nav has.
   */
  brandMarkAlt: string;
  navItemUnavailable: string;
  moduleSections: string;
  sectionNavigation: string;
  productLauncher: string;
  productSwitcher: string;
  /** The visible fallbacks in the two lockups that have no `productId`. */
  productSuffix: string;
  productShellCaption: string;
  /**
   * Two names composed from a value the consumer supplied. Concatenating an
   * English word onto a translated product or module name yields a string in
   * neither language, so the composition is per locale.
   */
  brandHomeOf: (productName: string) => string;
  shellControlsOf: (moduleName: string) => string;
  /**
   * The pin control of a NavItem or NavGroup row (TCRN-DS-SUB-123). It is icon-only,
   * so this is its whole accessible name; it says the action and the row it acts on,
   * and the action flips with the pinned state.
   */
  pinToStrip: (label: string) => string;
  unpinFromStrip: (label: string) => string;
}

const shellChromeLabels: Record<TcrnLocale, ShellChromeLabels> = {
  "zh-CN": {
    switchToLight: "切换到日间模式",
    switchToDark: "切换到夜间模式",
    language: "语言",
    collapseSideNav: "收起侧边导航",
    expandSideNav: "展开侧边导航",
    showNavigation: "显示导航",
    hideNavigation: "隐藏导航",
    breadcrumb: "面包屑导航",
    searchShell: "检索产品外壳",
    searchPlaceholder: "检索",
    searchResults: "检索结果",
    searchEmpty: "没有结果",
    currentLocation: "当前位置",
    shellWorkspace: "产品外壳工作区",
    skipToContent: "跳到外壳内容",
    brandMarkAlt: "TCRN 品牌标识",
    navItemUnavailable: "该导航项在此路由下不可用",
    moduleSections: "模块分区",
    sectionNavigation: "分区导航",
    productLauncher: "产品启动器",
    productSwitcher: "产品切换器",
    productSuffix: "产品",
    productShellCaption: "产品外壳",
    brandHomeOf: (productName) => `${productName}首页`,
    shellControlsOf: (moduleName) => `${moduleName}外壳控件`,
    pinToStrip: (label) => `固定到顶带：${label}`,
    unpinFromStrip: (label) => `从顶带取下：${label}`
  },
  en: {
    switchToLight: "Switch to light mode",
    switchToDark: "Switch to dark mode",
    language: "Language",
    collapseSideNav: "Collapse side navigation",
    expandSideNav: "Expand side navigation",
    showNavigation: "Show navigation",
    hideNavigation: "Hide navigation",
    breadcrumb: "Breadcrumb",
    searchShell: "Search product shell",
    searchPlaceholder: "Search",
    searchResults: "Search results",
    searchEmpty: "No results",
    currentLocation: "Current location",
    shellWorkspace: "Product shell workspace",
    skipToContent: "Skip to shell content",
    brandMarkAlt: "TCRN brand mark",
    navItemUnavailable: "Navigation item unavailable in this route",
    moduleSections: "Module sections",
    sectionNavigation: "Section navigation",
    productLauncher: "Product launcher",
    productSwitcher: "Product switcher",
    productSuffix: "Product",
    productShellCaption: "Product shell",
    brandHomeOf: (productName) => `${productName} home`,
    shellControlsOf: (moduleName) => `${moduleName} shell controls`,
    pinToStrip: (label) => `Pin to top bar: ${label}`,
    unpinFromStrip: (label) => `Unpin from top bar: ${label}`
  },
  ja: {
    switchToLight: "ライトモードに切り替え",
    switchToDark: "ダークモードに切り替え",
    language: "言語",
    collapseSideNav: "サイドナビゲーションを折りたたむ",
    expandSideNav: "サイドナビゲーションを展開する",
    showNavigation: "ナビゲーションを表示する",
    hideNavigation: "ナビゲーションを隠す",
    breadcrumb: "パンくずリスト",
    searchShell: "製品シェルを検索",
    searchPlaceholder: "検索",
    searchResults: "検索結果",
    searchEmpty: "結果はありません",
    currentLocation: "現在の位置",
    shellWorkspace: "製品シェルのワークスペース",
    skipToContent: "シェルの本文へスキップ",
    brandMarkAlt: "TCRN のブランドマーク",
    navItemUnavailable: "このルートではこのナビゲーション項目を使用できません",
    moduleSections: "モジュールのセクション",
    sectionNavigation: "セクションのナビゲーション",
    productLauncher: "製品ランチャー",
    productSwitcher: "製品の切り替え",
    productSuffix: "製品",
    productShellCaption: "製品シェル",
    brandHomeOf: (productName) => `${productName}のホーム`,
    shellControlsOf: (moduleName) => `${moduleName}のシェル操作`,
    pinToStrip: (label) => `トップバーに固定：${label}`,
    unpinFromStrip: (label) => `トップバーから外す：${label}`
  },
  ko: {
    switchToLight: "라이트 모드로 전환",
    switchToDark: "다크 모드로 전환",
    language: "언어",
    collapseSideNav: "사이드 내비게이션 접기",
    expandSideNav: "사이드 내비게이션 펼치기",
    showNavigation: "내비게이션 표시",
    hideNavigation: "내비게이션 숨기기",
    breadcrumb: "이동 경로",
    searchShell: "제품 셸 검색",
    searchPlaceholder: "검색",
    searchResults: "검색 결과",
    searchEmpty: "결과 없음",
    currentLocation: "현재 위치",
    shellWorkspace: "제품 셸 작업 공간",
    skipToContent: "셸 본문으로 이동",
    brandMarkAlt: "TCRN 브랜드 마크",
    navItemUnavailable: "이 경로에서는 이 내비게이션 항목을 사용할 수 없습니다",
    moduleSections: "모듈 섹션",
    sectionNavigation: "섹션 내비게이션",
    productLauncher: "제품 실행기",
    productSwitcher: "제품 전환기",
    productSuffix: "제품",
    productShellCaption: "제품 셸",
    brandHomeOf: (productName) => `${productName} 홈`,
    shellControlsOf: (moduleName) => `${moduleName} 셸 컨트롤`,
    pinToStrip: (label) => `상단 바에 고정: ${label}`,
    unpinFromStrip: (label) => `상단 바에서 해제: ${label}`
  },
  fr: {
    switchToLight: "Passer en mode clair",
    switchToDark: "Passer en mode sombre",
    language: "Langue",
    collapseSideNav: "Replier la navigation latérale",
    expandSideNav: "Déplier la navigation latérale",
    showNavigation: "Afficher la navigation",
    hideNavigation: "Masquer la navigation",
    breadcrumb: "Fil d’Ariane",
    searchShell: "Rechercher dans la coque produit",
    searchPlaceholder: "Rechercher",
    searchResults: "Résultats de recherche",
    searchEmpty: "Aucun résultat",
    currentLocation: "Emplacement actuel",
    shellWorkspace: "Espace de travail de la coque produit",
    skipToContent: "Aller au contenu de la coque",
    brandMarkAlt: "Marque TCRN",
    navItemUnavailable: "Élément de navigation indisponible sur cette route",
    moduleSections: "Sections du module",
    sectionNavigation: "Navigation des sections",
    productLauncher: "Lanceur de produits",
    productSwitcher: "Sélecteur de produit",
    productSuffix: "Produit",
    productShellCaption: "Coque produit",
    brandHomeOf: (productName) => `Accueil : ${productName}`,
    shellControlsOf: (moduleName) => `Commandes de la coque : ${moduleName}`,
    pinToStrip: (label) => `Épingler à la barre supérieure : ${label}`,
    unpinFromStrip: (label) => `Retirer de la barre supérieure : ${label}`
  }
};

/** The shell chrome labels for the reader's language. */
function chromeLabels(locale: TcrnLocale | string | undefined): ShellChromeLabels {
  return shellChromeLabels[resolveDocumentLocale(locale)];
}

export interface NavItem {
  id: string;
  label: string;
  selected?: boolean;
}

export interface TopBarProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  productName: ReactNode;
  moduleName: ReactNode;
  actions?: ReactNode;
  brandProps?: HTMLAttributes<HTMLDivElement>;
}

/**
 * @deprecated Since 4.0.0 (TCRN-DS-SUB-125): the shell is the top band. Use ProductShell, whose band
 * holds the brand button, the pins and the cluster. Its rules moved to tcrnRetiredComponentCss; removed
 * in 4.1 (docs/migration-4.0.md).
 */
export function TopBar({ productName, moduleName, actions, brandProps, className, ...rest }: TopBarProps) {
  return (
    <header {...rest} className={cx("tcrn-top-bar", className)}>
      <div {...brandProps} className={cx("tcrn-top-bar__brand", brandProps?.className)}>{productName}</div>
      <div className="tcrn-top-bar__module">{moduleName}</div>
      <div className="tcrn-top-bar__actions">{actions}</div>
    </header>
  );
}

/**
 * The registered product marks.
 *
 * Four solid marks on a 48 grid, each in two flat tones (the design system's in
 * four), approved by the Owner on 2026-10-11. Their SVG bodies, palettes, names and
 * taglines are generated from the design contract into product-marks.generated.ts,
 * so nothing here redraws a shape or restates a colour; a product without a
 * registered mark (AOS) keeps the TCRN mother mark, which awaits its own redesign.
 */
export const tcrnProductMarkIds = ["tms", "einzbern", "mana-orchestrate", "design-system"] as const;
export type TcrnProductMarkId = (typeof tcrnProductMarkIds)[number];

/**
 * The four renditions every product mark ships in: `color` (its own tones), `mono`
 * (one ink, currentColor unless another is given), `tile-tint` (the colour mark on
 * its pale tint, for the side rail and application icons) and `tile-deep` (the mark
 * in white on its deep tone, for favicons and dark places).
 */
export const tcrnProductMarkVariants = ["color", "mono", "tile-tint", "tile-deep"] as const;
export type TcrnProductMarkVariant = (typeof tcrnProductMarkVariants)[number];

// The grid comes from the generated viewBox. The tile geometry (radius 11 of 48,
// the mark inset at 70%) and the white of the deep tile are the logos board's; the
// generator does not emit the contract's `tile` block, so they are restated here and
// scripts/brand-asset-source-proof.mjs checks them against marks.json.
const productMarkGrid = Number(tcrnProductMarkViewBox.split(" ")[2]);
const productMarkTileRadius = 11;
const productMarkTileInset = "translate(7.2 7.2) scale(0.7)";
const productMarkTileInk = "#ffffff";

function productMark(productId: TcrnProductMarkId): TcrnProductMark {
  const mark = tcrnProductMarks.find((candidate) => candidate.productId === productId);
  if (!mark) throw new Error(`No product mark is generated for "${productId}"`);
  return mark;
}

function inkedProductMarkBody(mark: TcrnProductMark, ink: string): string {
  return ink === "currentColor" ? mark.inkBody : mark.inkBody.replaceAll("currentColor", ink);
}

function productMarkTile(fill: string, inner: string): string {
  return `<rect width="${productMarkGrid}" height="${productMarkGrid}" rx="${productMarkTileRadius}" fill="${fill}"/><g transform="${productMarkTileInset}">${inner}</g>`;
}

/** The children of one rendition's `<svg>`, shared by the component and the file export. */
function productMarkBody(mark: TcrnProductMark, variant: TcrnProductMarkVariant, ink = "currentColor"): string {
  switch (variant) {
    case "mono":
      return inkedProductMarkBody(mark, ink);
    case "tile-tint":
      return productMarkTile(mark.palette.tint, mark.colorBody);
    case "tile-deep":
      return productMarkTile(mark.palette.deep, inkedProductMarkBody(mark, productMarkTileInk));
    default:
      return mark.colorBody;
  }
}

function escapeSvgAttribute(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("\"", "&quot;").replaceAll("<", "&lt;");
}

export interface TcrnProductMarkSvgOptions {
  /** The single ink of the `mono` rendition; currentColor when omitted. */
  ink?: string;
  /** Rendered width and height in px; the grid size (48) when omitted. */
  size?: number;
}

/**
 * One rendition of a registered product mark as a standalone SVG file, for the
 * places that serve a file rather than mount a component: favicons, application
 * icons, an about page. `color`, and `mono` given the contract's mono ink, are byte
 * for byte the files in docs/design/gplus-2026-10/logos2.
 */
export function tcrnProductMarkSvg(
  productId: TcrnProductMarkId,
  variant: TcrnProductMarkVariant = "color",
  options: TcrnProductMarkSvgOptions = {}
): string {
  const mark = productMark(productId);
  const size = options.size ?? productMarkGrid;
  const body = productMarkBody(mark, variant, options.ink ?? "currentColor");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${tcrnProductMarkViewBox}" width="${size}" height="${size}" role="img" aria-label="${escapeSvgAttribute(mark.name)}">${body}</svg>\n`;
}

export interface TcrnBrandMarkProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  /** The mother mark's image; ignored when `productId` names a registered product mark. */
  src?: string;
  alt?: string;
  /** Which language the built-in alt text is said in; defaults to the page's own. */
  locale?: TcrnLocale | string;
  /**
   * A registered product mark, drawn inline from the design contract. Without it
   * the component is the TCRN mother mark image.
   */
  productId?: TcrnProductMarkId;
  /** Which rendition of the product mark; `color` when omitted. */
  variant?: TcrnProductMarkVariant;
}

export function TcrnBrandMark({ src = "tcrn-brand-mark.svg", alt, locale, productId, variant = "color", className, ...props }: TcrnBrandMarkProps) {
  if (productId) {
    // A product mark is inline SVG, so `mono` can follow the text colour around it
    // and the bytes on the page are the contract's own. Its default name is the
    // product's, which is Latin in every locale.
    const mark = productMark(productId);
    const accessibleName = requiredText(alt, mark.name);
    const svgProps = props as unknown as SVGAttributes<SVGSVGElement>;
    return (
      <svg
        {...svgProps}
        className={cx("tcrn-brand-mark", className)}
        viewBox={tcrnProductMarkViewBox}
        role="img"
        aria-label={accessibleName}
        focusable="false"
        data-component-source="@tcrn/ui-react"
        data-brand-asset={`tcrn-product-mark-${productId}`}
        data-tcrn-brand-mark="registered"
        data-brand-asset-registration="design-system"
        data-product-mark={productId}
        data-product-mark-variant={variant}
        dangerouslySetInnerHTML={{ __html: productMarkBody(mark, variant) }}
      />
    );
  }

  // The mark is an image, so this alt text is its whole contribution to the
  // accessibility tree — and this component is mounted by every lockup on every
  // page, which made one English literal the most widely rendered of them all.
  const accessibleName = requiredText(alt, chromeLabels(locale).brandMarkAlt);
  return (
    <img
      {...props}
      className={cx("tcrn-brand-mark", className)}
      src={src}
      alt={accessibleName}
      aria-label={accessibleName}
      data-component-source="@tcrn/ui-react"
      data-brand-asset="tcrn-brand-mark"
      data-tcrn-brand-mark="registered"
      data-brand-asset-registration="design-system"
    />
  );
}

const tmsMark = productMark("tms");
const einzbernMark = productMark("einzbern");
const manaOrchestrateMark = productMark("mana-orchestrate");
const designSystemMark = productMark("design-system");

/**
 * The registered product lockups.
 *
 * `lineOne` is the wordmark and stays Latin in every locale — it is the product's
 * name, and a translated name is a different product. `lineTwo` is a descriptive
 * tagline, which is copy: it says what the product *is*, and a reader who cannot
 * read it learns nothing from it. So the taglines carry all five locales while
 * the wordmarks carry none, and the distinction is the point — "brand identity"
 * covered both here, so `AI Operation System` and `Talent Management System`
 * rendered in English on every localized route of every consuming product, in the
 * one component every page mounts.
 *
 * The four products with a registered mark take their names, wordmark face and
 * taglines from the design contract (product-marks.generated.ts). A TCRN product
 * (`wordmark: "sans"`) is TCRN in ink plus a suffix in the product's deep colour;
 * Einzbern and Mana Orchestrate (`wordmark: "serif"`) are whole names in ink with
 * the byline. AOS is not in this phase and keeps its entry and the mother mark.
 *
 * `alt` combines the two and follows the tagline, because a screen-reader user on
 * a ja route should hear the shell's brand the way a sighted reader sees it.
 */
export const tcrnProductLogoRegistry = {
  "design-system": {
    productId: "design-system",
    assetId: "tcrn-design-system-two-line",
    markId: "design-system",
    wordmark: designSystemMark.font,
    lineOne: designSystemMark.name,
    lineOneBase: designSystemMark.word,
    lineOneSuffix: designSystemMark.suffix ?? null,
    suffixClassName: "tcrn-brand-wordmark__suffix--design-system",
    byline: null,
    lineTwo: designSystemMark.taglines,
    // "Design System" is two words that would otherwise double the lockup's width.
    stackSuffix: true,
    alt: designSystemMark.name
  },
  aos: {
    productId: "aos",
    assetId: "tcrn-aos-two-line",
    markId: null,
    wordmark: "sans",
    lineOne: "TCRN AOS",
    lineOneBase: "TCRN",
    lineOneSuffix: "AOS",
    suffixClassName: "tcrn-brand-wordmark__suffix--aos",
    byline: null,
    lineTwo: {
      "zh-CN": "AI 运营系统",
      en: "AI Operation System",
      ja: "AI オペレーションシステム",
      ko: "AI 운영 시스템",
      fr: "Système d'exploitation IA"
    },
    stackSuffix: false,
    alt: "TCRN AOS"
  },
  tms: {
    productId: "tms",
    assetId: "tcrn-tms-two-line",
    markId: "tms",
    wordmark: tmsMark.font,
    lineOne: tmsMark.name,
    lineOneBase: tmsMark.word,
    lineOneSuffix: tmsMark.suffix ?? null,
    suffixClassName: "tcrn-brand-wordmark__suffix--tms",
    byline: null,
    lineTwo: tmsMark.taglines,
    stackSuffix: false,
    alt: tmsMark.name
  },
  einzbern: {
    productId: "einzbern",
    assetId: "tcrn-einzbern-two-line",
    markId: "einzbern",
    wordmark: einzbernMark.font,
    lineOne: einzbernMark.name,
    lineOneBase: einzbernMark.word,
    lineOneSuffix: einzbernMark.suffix ?? null,
    suffixClassName: null,
    byline: tcrnProductMarkWordmark.serif.byline,
    lineTwo: einzbernMark.taglines,
    stackSuffix: false,
    alt: einzbernMark.name
  },
  "mana-orchestrate": {
    productId: "mana-orchestrate",
    assetId: "tcrn-mana-orchestrate-two-line",
    markId: "mana-orchestrate",
    wordmark: manaOrchestrateMark.font,
    lineOne: manaOrchestrateMark.name,
    lineOneBase: manaOrchestrateMark.word,
    lineOneSuffix: manaOrchestrateMark.suffix ?? null,
    suffixClassName: null,
    byline: tcrnProductMarkWordmark.serif.byline,
    lineTwo: manaOrchestrateMark.taglines,
    stackSuffix: false,
    alt: manaOrchestrateMark.name
  }
} as const;

export type TcrnProductLogoId = keyof typeof tcrnProductLogoRegistry;
export type TcrnProductLogoAssetId = (typeof tcrnProductLogoRegistry)[TcrnProductLogoId]["assetId"];

export function getTcrnProductLogoAsset(productId: TcrnProductLogoId) {
  return tcrnProductLogoRegistry[productId];
}

function shouldStackProductSuffix(productSuffix: string) {
  const cjkCount = Array.from(productSuffix).filter((character) => /[㐀-鿿]/u.test(character)).length;
  return productSuffix.length > 8 || productSuffix.includes(" ") || cjkCount >= 4;
}

/** The registered tagline for `productId`, in the reader's language. */
export function tcrnProductTagline(productId: TcrnProductLogoId, locale?: string): string {
  return tcrnProductLogoRegistry[productId].lineTwo[resolveTcrnLocale(locale)];
}

export interface ProductLogoProps extends HTMLAttributes<HTMLDivElement> {
  productId: TcrnProductLogoId;
  /** The mother mark's image, for a product with no registered mark (AOS). */
  brandMarkSrc?: string;
  brandMarkAlt?: string;
  /** Which rendition of a registered product mark; `color` when omitted. */
  markVariant?: TcrnProductMarkVariant;
  /**
   * Which language the tagline is said in. Defaults to the fallback locale, so a
   * consumer that never passes it keeps today's English rather than losing the
   * line — but a localized shell must pass it or the brand block is the one part
   * of the page that stays English.
   */
  locale?: string;
}

export function ProductLogo({
  productId,
  brandMarkSrc = "tcrn-brand-mark.svg",
  brandMarkAlt,
  markVariant,
  locale,
  className,
  ...props
}: ProductLogoProps) {
  const asset = getTcrnProductLogoAsset(productId);
  const tagline = tcrnProductTagline(productId, locale);
  // The accessible name says the wordmark and the tagline together, so a
  // screen-reader user hears what a sighted reader sees — including the
  // translation, which is why it is composed here rather than stored.
  const accessibleName = `${asset.lineOne} ${tagline}`;
  const markAlt = brandMarkAlt ?? accessibleName;

  return (
    <div
      {...props}
      className={cx(
        "tcrn-product-logo",
        asset.stackSuffix && "tcrn-product-logo--stacked-suffix",
        asset.wordmark === "serif" && "tcrn-product-logo--serif",
        className
      )}
      aria-label={accessibleName}
      data-component-source="@tcrn/ui-react"
      data-registered-product-logo="@tcrn/ui-react/ProductLogo"
      data-product-id={asset.productId}
      data-product-logo-asset-id={asset.assetId}
      data-product-wordmark={asset.wordmark}
    >
      {/* The colour mark carries data-logo like the first line's (C-6); other renditions do not,
          since their bytes are not the logos2 file's. */}
      {asset.markId ? (
        <TcrnBrandMark
          productId={asset.markId}
          variant={markVariant}
          alt={markAlt}
          data-logo={(markVariant ?? "color") === "color" ? asset.productId : undefined}
        />
      ) : (
        <TcrnBrandMark src={brandMarkSrc} alt={markAlt} />
      )}
      {/* The Brand board's section E writing (C-6): the wordmark is <b>{word} <em>{suffix}</em></b>
          and the tagline a <small>; the space between word and suffix is the copy's, the flex gap
          draws it. */}
      <span className="tcrn-product-logo__copy" aria-hidden="true">
        <b className="tcrn-product-logo__line-one" aria-label={asset.lineOne}>
          <span className="tcrn-product-logo__line-one-base">{asset.lineOneBase}</span>
          {asset.lineOneSuffix ? (
            <>
              {" "}
              <em className={cx("tcrn-product-logo__line-one-suffix", asset.suffixClassName ?? undefined)}>{asset.lineOneSuffix}</em>
            </>
          ) : null}
        </b>
        <small className="tcrn-product-logo__line-two">{tagline}</small>
        {asset.byline ? <span className="tcrn-product-logo__byline">{asset.byline}</span> : null}
      </span>
    </div>
  );
}

/**
 * The scale of ProductLockup's first-line rendition: `rail` is the side-rail writing of the
 * Brand board's section E (mark 22, wordmark 12.5/600), `lockup` the lockup writing (mark 44,
 * wordmark 16/600). The top band's brand button uses the rail scale.
 */
export type ProductLockupFirstLineScale = "rail" | "lockup";

export interface ProductLockupProps extends HTMLAttributes<HTMLDivElement> {
  suffix?: string;
  suffixClassName?: string;
  brandMarkSrc?: string;
  brandMarkAlt?: string;
  productId?: TcrnProductLogoId;
  /** Passed to `ProductLogo` when `productId` is given; ignored otherwise and by `firstLine`. */
  markVariant?: TcrnProductMarkVariant;
  /** Passed to `ProductLogo` when `productId` is given; ignored otherwise. */
  locale?: string;
  /**
   * The second of the product's three renditions (MIN-20261013-SHELL D2, STORY-145): the
   * lockup's first line alone, centred on the mark, at the given scale. Nothing is redrawn or
   * restyled: the mark is the colour mark of logos2 (never mono or faded), the line keeps the
   * lockup's words, weights and suffix colour, and the two are centred by the flex row, not by
   * nudging the line. Omitted, the lockup is the whole block (the third rendition).
   */
  firstLine?: ProductLockupFirstLineScale;
}

/** The first-line rendition of ProductLockup: data-lockup lk-line or lkr-line (C-6). */
function ProductLockupFirstLine({
  scale,
  productId,
  suffix,
  suffixClassName,
  brandMarkSrc,
  brandMarkAlt,
  locale,
  className,
  ...props
}: Omit<ProductLockupProps, "firstLine" | "markVariant"> & { scale: ProductLockupFirstLineScale }) {
  const asset = productId ? getTcrnProductLogoAsset(productId) : null;
  const word = asset ? asset.lineOneBase : "TCRN";
  const lineSuffix = asset ? asset.lineOneSuffix : requiredText(suffix, chromeLabels(locale).productSuffix);
  const lineSuffixClassName = asset ? asset.suffixClassName : suffixClassName;
  const name = asset ? asset.lineOne : `${word} ${lineSuffix}`;
  return (
    <div
      {...props}
      className={cx(
        "tcrn-brand-lockup",
        "tcrn-brand-lockup--line",
        scale === "rail" && "tcrn-brand-lockup--line-rail",
        asset?.wordmark === "serif" && "tcrn-brand-lockup--line-serif",
        className
      )}
      role="img"
      aria-label={name}
      data-component-source="@tcrn/ui-react"
      data-brand-lockup="line"
      data-lockup={scale === "rail" ? "lkr-line" : "lk-line"}
      data-product-id={asset?.productId}
    >
      {asset?.markId ? (
        <TcrnBrandMark productId={asset.markId} variant="color" aria-hidden="true" data-logo={asset.productId} />
      ) : (
        <TcrnBrandMark src={brandMarkSrc} alt={brandMarkAlt} locale={locale} aria-hidden="true" />
      )}
      <span className="tcrn-brand-lockup__line" aria-hidden="true">
        {/* A word too long for its line ends in an ellipsis; the title says it in full (C7). */}
        <b className="tcrn-brand-lockup__word" title={name}>
          {word}
          {lineSuffix ? (
            <>
              {" "}
              <em className={cx("tcrn-brand-lockup__suffix", lineSuffixClassName ?? undefined)}>{lineSuffix}</em>
            </>
          ) : null}
        </b>
      </span>
    </div>
  );
}

export function ProductLockup({ suffix, suffixClassName, brandMarkSrc, brandMarkAlt, productId, markVariant, locale, firstLine, className, ...props }: ProductLockupProps) {
  if (firstLine) {
    return (
      <ProductLockupFirstLine
        {...props}
        scale={firstLine}
        productId={productId}
        suffix={suffix}
        suffixClassName={suffixClassName}
        brandMarkSrc={brandMarkSrc}
        brandMarkAlt={brandMarkAlt}
        locale={locale}
        className={className}
      />
    );
  }
  if (productId) {
    return (
      <ProductLogo
        {...props}
        locale={locale}
        productId={productId}
        brandMarkSrc={brandMarkSrc}
        brandMarkAlt={brandMarkAlt}
        markVariant={markVariant}
        className={cx("tcrn-brand-lockup", className)}
      />
    );
  }

  // Reached only without a `productId`, where there is no registered lockup to
  // read a name from — so this visible fallback is the product's whole name.
  const productSuffix = requiredText(suffix, chromeLabels(locale).productSuffix);
  const isLongSuffix = shouldStackProductSuffix(productSuffix);

  return (
    <div
      {...props}
      className={cx("tcrn-brand-lockup", isLongSuffix && "tcrn-brand-lockup--long-name", className)}
      data-component-source="@tcrn/ui-react"
      data-brand-lockup="product"
      data-package-backed-brand-lockup="product"
    >
      <TcrnBrandMark src={brandMarkSrc} alt={brandMarkAlt} locale={locale} />
      <span className="tcrn-brand-wordmark">
        <span className="tcrn-brand-wordmark__base">TCRN</span>
        <span className={cx("tcrn-brand-wordmark__suffix", suffixClassName)}>{productSuffix}</span>
      </span>
    </div>
  );
}

export interface ShellBrandLockupProps extends Omit<ProductLockupProps, "firstLine"> {
  caption?: string;
}

export function ShellBrandLockup({ caption, suffix, suffixClassName, brandMarkSrc, brandMarkAlt, productId, markVariant, locale, className, ...props }: ShellBrandLockupProps) {
  if (productId) {
    return (
      <ProductLogo
        {...props}
        locale={locale}
        productId={productId}
        brandMarkSrc={brandMarkSrc}
        brandMarkAlt={brandMarkAlt}
        markVariant={markVariant}
        className={cx("tcrn-shell-brand-lockup", className)}
      />
    );
  }

  // Two visible fallbacks and the mark's alt text, all reached only on the
  // no-`productId` path.
  const chrome = chromeLabels(locale);

  return (
    <div
      {...props}
      className={cx("tcrn-shell-brand-lockup", className)}
      data-component-source="@tcrn/ui-react"
      data-brand-lockup="shell"
      data-package-backed-brand-lockup="shell"
    >
      <TcrnBrandMark src={brandMarkSrc} alt={brandMarkAlt} locale={locale} />
      <span className="tcrn-shell-brand-lockup__copy">
        <span className="tcrn-brand-wordmark">
          <span className="tcrn-brand-wordmark__base">TCRN</span>
          <span className={cx("tcrn-brand-wordmark__suffix", suffixClassName)}>{requiredText(suffix, chrome.productSuffix)}</span>
        </span>
        <span className="tcrn-shell-brand-lockup__caption">{requiredText(caption, chrome.productShellCaption)}</span>
      </span>
    </div>
  );
}

export type ShellThemeMode = "light" | "dark";
export type ProductShellLocaleMenuChangeReason = "trigger" | "selection" | "outside-pointer" | "escape" | "controller";
export type ProductShellSearchDismissReason = "blur" | "outside-pointer" | "tab" | "escape" | "result-activate" | "controller";
export type ProductShellSearchExpandedChangeReason = "focus" | "input" | ProductShellSearchDismissReason;

export interface ShellThemeToggleProps extends Omit<IconButtonProps, "ariaLabel" | "icon" | "iconName" | "children"> {
  currentTheme: ShellThemeMode;
  lightLabel?: string;
  darkLabel?: string;
  /** Which language the two built-in labels are said in; defaults to the page's own. */
  locale?: TcrnLocale | string;
  onThemeChange?: (nextTheme: ShellThemeMode) => void;
}

export function ShellThemeToggle({
  currentTheme,
  lightLabel,
  darkLabel,
  locale,
  onThemeChange,
  className,
  onClick,
  ...props
}: ShellThemeToggleProps) {
  // Icon-only, so this label is the entire accessible name — there is no visible
  // text a reader could fall back on when it is in the wrong language.
  const labels = chromeLabels(locale);
  const resolvedLightLabel = lightLabel ?? labels.switchToLight;
  const resolvedDarkLabel = darkLabel ?? labels.switchToDark;
  const normalizedTheme = currentTheme === "dark" ? "dark" : "light";
  const nextTheme: ShellThemeMode = normalizedTheme === "dark" ? "light" : "dark";
  const handleClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented) {
      onThemeChange?.(nextTheme);
    }
  };

  return (
    <IconButton
      {...props}
      onClick={handleClick}
      ariaLabel={normalizedTheme === "dark" ? resolvedLightLabel : resolvedDarkLabel}
      title={normalizedTheme === "dark" ? resolvedLightLabel : resolvedDarkLabel}
      className={cx("tcrn-shell-theme-toggle", className)}
      data-shell-control="theme-toggle"
      data-package-backed-shell-control="theme-toggle"
      data-theme-toggle="true"
      data-current-theme={normalizedTheme}
      data-theme-next={nextTheme}
      data-theme-transition-contract="whole-page-view-transition-or-token-wash"
      icon={
        <>
          <span className="tcrn-shell-theme-toggle__icon" data-theme-icon="light">
            <Icon name="sun" />
          </span>
          <span className="tcrn-shell-theme-toggle__icon" data-theme-icon="dark">
            <Icon name="moon" />
          </span>
        </>
      }
    />
  );
}

export interface ShellLocaleOption {
  locale: string;
  nativeName: string;
}

export interface ShellLocaleMenuProps extends HTMLAttributes<HTMLDivElement> {
  locales: readonly ShellLocaleOption[];
  currentLocale: string;
  label?: string;
  open?: boolean;
  menuId?: string;
  triggerId?: string;
  onOpenChange?: (open: boolean, reason: ProductShellLocaleMenuChangeReason) => void;
  onLocaleChange?: (locale: string) => void;
}

export function ShellLocaleMenu({
  locales,
  currentLocale,
  // The one control whose job is to change language was the one that could not
  // say so in the reader's language. It needs no `locale` prop: `currentLocale`
  // already *is* the language this menu should speak, so a consumer who wires the
  // menu at all has already supplied the answer.
  label,
  open = false,
  menuId,
  triggerId,
  onOpenChange,
  onLocaleChange,
  className,
  ...props
}: ShellLocaleMenuProps) {
  const current = locales.find((entry) => entry.locale === currentLocale) ?? locales[0];
  const currentName = requiredText(current?.nativeName, currentLocale);
  const resolvedLabel = label ?? chromeLabels(currentLocale).language;
  const generatedMenuId = useId();
  const resolvedMenuId = menuId ?? generatedMenuId;
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const requestOpenChange = useCallback((nextOpen: boolean, reason: ProductShellLocaleMenuChangeReason, focusTrigger = false) => {
    onOpenChange?.(nextOpen, reason);
    if (!nextOpen && focusTrigger) {
      triggerRef.current?.focus();
    }
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) return undefined;
    const ownerDocument = rootRef.current?.ownerDocument ?? document;
    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target instanceof Node ? event.target : null;
      if (target && !rootRef.current?.contains(target)) {
        requestOpenChange(false, "outside-pointer");
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        requestOpenChange(false, "escape", true);
      }
    };
    ownerDocument.addEventListener("mousedown", handleMouseDown);
    ownerDocument.addEventListener("keydown", handleKeyDown);
    return () => {
      ownerDocument.removeEventListener("mousedown", handleMouseDown);
      ownerDocument.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, requestOpenChange]);

  const handleTriggerClick = () => {
    requestOpenChange(!open, "trigger");
  };

  const handleLocaleSelect = (locale: string) => {
    onLocaleChange?.(locale);
    requestOpenChange(false, "selection", true);
  };

  return (
    <div
      {...props}
      ref={rootRef}
      className={cx("tcrn-shell-locale-menu", className)}
      data-shell-control="locale-menu"
      data-package-backed-shell-control="locale-menu"
      data-locale-control="native-name-menu"
      data-locale-menu-open={open ? "true" : "false"}
      data-locale-dismissal-contract="selection-outside-pointer-escape-focus-return"
      data-locale-semantic-api="onOpenChange-onLocaleChange"
    >
      <button
        ref={triggerRef}
        id={triggerId}
        className="tcrn-shell-locale-menu__trigger"
        type="button"
        onClick={handleTriggerClick}
        data-locale-menu-toggle
        aria-haspopup="listbox"
        aria-expanded={open ? "true" : "false"}
        aria-controls={resolvedMenuId}
        aria-label={resolvedLabel}
        title={resolvedLabel}
      >
        <Icon name="globe-2" />
        <span className="tcrn-shell-locale-menu__current" data-locale-current data-locale-current-name>{currentName}</span>
        <Icon name="chevron-down" className="tcrn-shell-locale-menu__chevron" />
      </button>
      <div id={resolvedMenuId} className="tcrn-shell-locale-menu__panel" role="listbox" data-locale-menu hidden={!open}>
        {locales.map((entry) => (
          <button key={entry.locale}
            className="tcrn-shell-locale-menu__option"
            type="button"
            role="option"
            onClick={() => handleLocaleSelect(entry.locale)}
            data-locale={entry.locale}
            data-locale-name={entry.nativeName}
            data-locale-option={entry.locale}
            data-locale-menu-option
            aria-current={entry.locale === currentLocale ? "true" : undefined}
            aria-selected={entry.locale === currentLocale ? "true" : "false"}
          >
            <span className="tcrn-shell-locale-menu__name">{entry.nativeName}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export interface SideNavCollapseButtonProps extends Omit<IconButtonProps, "ariaLabel" | "icon" | "iconName" | "children"> {
  collapsed: boolean;
  controls: string;
  expandedLabel?: string;
  collapsedLabel?: string;
  /** Which language the two built-in labels are said in; defaults to the page's own. */
  locale?: TcrnLocale | string;
  disabledReason?: string;
  persistedKey?: string;
  onCollapsedChange?: (collapsed: boolean) => void;
}

/**
 * @deprecated Since 4.0.0 (TCRN-DS-SUB-125): there is no side rail left to collapse; the full menu
 * opens from ProductShell's brand button. Its rules moved to tcrnRetiredComponentCss; removed in 4.1.
 */
export function SideNavCollapseButton({
  collapsed,
  controls,
  expandedLabel,
  collapsedLabel,
  locale,
  disabledReason,
  persistedKey,
  onCollapsedChange,
  className,
  onClick,
  onKeyDown,
  ...props
}: SideNavCollapseButtonProps) {
  const disabled = props.disabled ?? Boolean(disabledReason);
  // Icon-only, like the theme toggle: the label is the whole accessible name.
  const chrome = chromeLabels(locale);
  const label = disabledReason
    ?? (collapsed ? collapsedLabel ?? chrome.expandSideNav : expandedLabel ?? chrome.collapseSideNav);
  const handleClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!disabled && !event.defaultPrevented) {
      onCollapsedChange?.(!collapsed);
    }
  };
  const handleKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event);
    if (disabled || event.defaultPrevented) {
      return;
    }
    if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      onCollapsedChange?.(!collapsed);
    }
  };

  return (
    <IconButton
      {...props}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      disabledReason={disabledReason}
      aria-disabled={disabled ? true : undefined}
      ariaLabel={label}
      title={label}
      aria-controls={controls}
      aria-expanded={collapsed ? "false" : "true"}
      className={cx("tcrn-shell-side-nav-toggle", className)}
      data-shell-control="side-nav-collapse"
      data-package-backed-shell-control="side-nav-collapse"
      data-side-nav-toggle="true"
      data-side-nav-collapsed={String(collapsed)}
      data-side-nav-action={disabled ? "disabled" : "toggle"}
      data-side-nav-keyboard-activation="enter-space"
      data-side-nav-disabled-reason={disabledReason}
      data-side-nav-persisted-key={persistedKey}
      data-side-nav-semantic-api="onCollapsedChange"
      icon={
        <>
          <span className="tcrn-shell-side-nav-toggle__icon" data-side-nav-icon="collapse">
            <Icon name="chevron-left" />
          </span>
          <span className="tcrn-shell-side-nav-toggle__icon" data-side-nav-icon="expand">
            <Icon name="chevron-right" />
          </span>
        </>
      }
    />
  );
}

export interface MobileNavToggleProps extends Omit<IconButtonProps, "ariaLabel" | "icon" | "iconName" | "children"> {
  expanded: boolean;
  controls: string;
  /** Which language the two built-in labels are said in; defaults to the page's own. */
  locale?: TcrnLocale | string;
  onExpandedChange?: (expanded: boolean) => void;
}

/**
 * Show or hide the navigation, below the mobile breakpoint only.
 *
 * A separate control from `SideNavCollapseButton` on purpose. That one narrows
 * the desktop rail to icons and stays hidden here, because a width collapse in
 * a full-width stacked layout is a control that does nothing — which the
 * responsive standard forbids. This one shows and hides the navigation itself,
 * which is a different question, and the one nobody had answered: the shell had
 * two destinations when the rail's mobile policy was written and has eleven now,
 * so "no width-collapse affordance" had quietly come to mean "no way to put the
 * navigation away at all".
 *
 * The glyph is a menu, not a chevron pair: a chevron says a thing will move, and
 * on this viewport the navigation appears and disappears.
 *
 * @deprecated Since 4.0.0 (TCRN-DS-SUB-125): on a phone ProductShell's brand button opens the full
 * menu as a Sheet, so there is no separate navigation toggle. Its rules moved to
 * tcrnRetiredComponentCss; removed in 4.1.
 */
export function MobileNavToggle({
  expanded,
  controls,
  locale,
  onExpandedChange,
  className,
  onClick,
  ...props
}: MobileNavToggleProps) {
  // Icon-only, so this label is the whole accessible name.
  const label = expanded ? chromeLabels(locale).hideNavigation : chromeLabels(locale).showNavigation;
  const handleClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented) onExpandedChange?.(!expanded);
  };
  return (
    <IconButton
      {...props}
      onClick={handleClick}
      ariaLabel={label}
      title={label}
      aria-controls={controls}
      aria-expanded={expanded ? "true" : "false"}
      className={cx("tcrn-shell-mobile-nav-toggle", className)}
      data-shell-control="mobile-nav-toggle"
      data-package-backed-shell-control="mobile-nav-toggle"
      data-mobile-nav-toggle="true"
      data-mobile-nav-expanded={String(expanded)}
      data-mobile-nav-semantic-api="onExpandedChange"
      icon={<Icon name="menu" />}
    />
  );
}

export interface ProductLauncherProps {
  items: NavItem[];
  /**
   * Which language the built-in nav label is said in; defaults to the page's own.
   *
   * These five navs render only their items, so the label is the entire name
   * their landmark has — and it was a literal in the JSX with no prop behind it,
   * so a localized consumer could not override it either.
   */
  locale?: TcrnLocale | string;
}

function LauncherItems({ items }: ProductLauncherProps) {
  return (
    <>
      {items.map((item) => (
        <button key={item.id} type="button" aria-current={item.selected ? "page" : undefined} data-selected={item.selected ? "true" : undefined}>
          {item.label}
        </button>
      ))}
    </>
  );
}

/**
 * @deprecated Since 4.0.0 (TCRN-DS-SUB-125): products are switched from the avatar menu; pass
 * ProductShell its products. Its rules moved to tcrnRetiredComponentCss; removed in 4.1.
 */
export function ProductLauncher({ items, locale }: ProductLauncherProps) {
  return (
    <nav className="tcrn-product-launcher" aria-label={chromeLabels(locale).productLauncher}>
      <LauncherItems items={items} />
    </nav>
  );
}

/**
 * @deprecated Since 4.0.0 (TCRN-DS-SUB-125): products are switched from the avatar menu; pass
 * ProductShell its products. Its rules moved to tcrnRetiredComponentCss; removed in 4.1.
 */
export function ProductSwitcher({ items, locale }: ProductLauncherProps) {
  return (
    <nav className="tcrn-product-switcher" aria-label={chromeLabels(locale).productSwitcher}>
      <LauncherItems items={items} />
    </nav>
  );
}

/**
 * One crumb. `NavItem` plus the ancestor's address.
 *
 * Breadcrumb takes its own item type rather than gaining an `href` on the shared
 * `NavItem`: five other components read that type (ProductLauncher,
 * ProductSwitcher, ModuleTabs, SectionTabs, SegmentedNav) and none of them wants
 * a link. Widening the shared type to fix one component would have offered an
 * href on five surfaces that ignore it, which is a worse contract than a
 * slightly larger type surface.
 */
export interface BreadcrumbItem extends NavItem {
  /**
   * Where this ancestor lives. Omit for the current page — the last crumb is
   * where the reader already is, so a link to it is a link to nowhere.
   */
  href?: string;
}

export interface BreadcrumbProps {
  items: readonly BreadcrumbItem[];
  /** Accessible name for the trail. Omit it and the reader's language is used. */
  label?: string;
  /** Which language the built-in label is said in; defaults to the page's own. */
  locale?: TcrnLocale | string;
}

/**
 * The ancestor trail, and the product's way back. It is also the page header's first row:
 * PageHeader renders this component for its trail (TCRN-DS-SUB-124, STORY-143 GWT4; 07b board
 * .ts-crumbs and section D row 面包屑), so there is one trail in the system, not two.
 *
 * Every crumb used to render as an inert `<span>`, which made the component
 * decorative: it told you where you were and offered no way to leave. A
 * consumer reported that the only way back from a drilled-down page was the
 * browser's own back button — true of every page in their product, because this
 * was the component they were using for the job.
 *
 * A crumb with an `href` is a link. The current page is inert, which is the point:
 * `aria-current="page"` plus no link is what tells a screen-reader user which end
 * of the trail they are standing on. It is set as a `b` in the ink and weight of the
 * board's current crumb.
 *
 * The trail stays on one line at every width: the separators (the board's 11 chevron)
 * keep their size, a crumb that does not fit gives way and ends in an ellipsis, and
 * every crumb carries its label as a title.
 */
export function Breadcrumb({ items, label, locale }: BreadcrumbProps) {
  return (
    <nav className="tcrn-breadcrumb" aria-label={label ?? chromeLabels(locale).breadcrumb}>
      {items.map((item, index) => (
        <span key={item.id} className="tcrn-breadcrumb__item">
          {index > 0 ? <Icon name="chevron-right" size={11} className="tcrn-breadcrumb__separator" /> : null}
          {item.selected ? (
            <b className="tcrn-breadcrumb__crumb" title={item.label} aria-current="page">{item.label}</b>
          ) : item.href ? (
            <a className="tcrn-breadcrumb__crumb" href={item.href} title={item.label}>{item.label}</a>
          ) : (
            <span className="tcrn-breadcrumb__crumb" title={item.label}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/**
 * The Tabs family (TCRN-DS-SUB-124, STORY-143 GWT2). Five tab-shaped forms grew up
 * separately — this component, ModuleTabs, SectionTabs, SegmentedNav and ViewTabs — and
 * said "selected" three different ways (a bottom edge here, a track fill there, a fill
 * without weight elsewhere). They are now one block, `tcrn-tabs`, in three variants:
 *
 * - `tcrn-tabs--panel`: this component, the ARIA tab pattern that swaps a panel;
 * - `tcrn-tabs--nav`: ModuleTabs, SectionTabs and ViewTabs, navigation between pages or
 *   views (`aria-current`);
 * - `tcrn-tabs--segmented`: SegmentedNav, a few stable peer views.
 *
 * Every variant renders the same tab, `tcrn-tabs__tab` with its label in
 * `tcrn-tabs__label`, marks the chosen one with `data-selected="true"` and says so one
 * way: the 6% ink wash and the strong weight, nothing added on top. The old names stay
 * exported as the family's variant exports, and their old root class stays on the root
 * through 4.0.x as a hook without rules.
 */
export type TabsVariant = "panel" | "nav" | "segmented";

/**
 * The ARIA tab pattern, with the keyboard behaviour that makes it one.
 *
 * The nav variants below render buttons or links with `aria-current`, which is correct
 * for navigation that changes the page. A tab does not change the page: it swaps a
 * panel, and the contract for that is `role="tablist"` / `role="tab"` /
 * `role="tabpanel"` plus `aria-controls` and `aria-selected`. Announcing "2 of 4
 * selected" instead of "link, current page" is the whole difference to a screen reader.
 *
 * The keyboard half is what hand-rolled tabs drop. Arrow keys move between tabs,
 * Home and End jump to the ends, and only the selected tab is in the tab order —
 * `tabIndex={-1}` on the rest. Without that, tabbing through a four-tab strip
 * costs four stops before reaching the content the tabs exist to reveal.
 */
export interface TabItem {
  id: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  /** The `id` of the selected tab. */
  selectedId: string;
  onSelect: (id: string) => void;
  /** Accessible name for the tab strip. */
  label: string;
  /** Rendered inside the panel for the selected tab. */
  children?: ReactNode;
}

export function Tabs({ items, selectedId, onSelect, label, children }: TabsProps) {
  const enabled = items.filter((item) => !item.disabled);
  const move = (delta: number) => {
    if (enabled.length === 0) return;
    const at = enabled.findIndex((item) => item.id === selectedId);
    // Wrapping is the documented behaviour: a reader holding ArrowRight expects to
    // come round rather than to stop at a wall with no feedback.
    const next = enabled[(((at < 0 ? 0 : at) + delta) % enabled.length + enabled.length) % enabled.length];
    if (next) onSelect(next.id);
  };
  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") { event.preventDefault(); move(1); }
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") { event.preventDefault(); move(-1); }
    else if (event.key === "Home") { event.preventDefault(); if (enabled[0]) onSelect(enabled[0].id); }
    else if (event.key === "End") { event.preventDefault(); const last = enabled[enabled.length - 1]; if (last) onSelect(last.id); }
  };
  return (
    <div className="tcrn-tabs tcrn-tabs--panel" data-tabs="true">
      <div className="tcrn-tabs__list" role="tablist" aria-label={label} onKeyDown={onKeyDown}>
        {items.map((item) => {
          const selected = item.id === selectedId;
          return (
            <button key={item.id} type="button"
              id={`tcrn-tab-${item.id}`}
              role="tab"
              className="tcrn-tabs__tab"
              data-selected={selected ? "true" : undefined}
              aria-selected={selected}
              aria-controls={`tcrn-tabpanel-${item.id}`}
              disabled={item.disabled}
              tabIndex={selected ? 0 : -1}
              title={typeof item.label === "string" ? item.label : undefined}
              onClick={() => onSelect(item.id)}
            >
              <span className="tcrn-tabs__label">{item.label}</span>
            </button>
          );
        })}
      </div>
      <div className="tcrn-tabs__panel" role="tabpanel" id={`tcrn-tabpanel-${selectedId}`} aria-labelledby={`tcrn-tab-${selectedId}`} tabIndex={0}>
        {children}
      </div>
    </div>
  );
}

/** The Tabs family's nav variant for a module's sections (root hook `tcrn-module-tabs` through 4.0.x). */
export function ModuleTabs({ items, locale, label, onSelect }: SelectableNavProps) {
  return <TabList items={items} label={label ?? chromeLabels(locale).moduleSections} onSelect={onSelect} variant="nav" legacyClassName="tcrn-module-tabs" />;
}

/** The Tabs family's nav variant for a page's sections (root hook `tcrn-section-tabs` through 4.0.x). */
export function SectionTabs({ items, locale, label, onSelect }: SelectableNavProps) {
  return <TabList items={items} label={label ?? chromeLabels(locale).sectionNavigation} onSelect={onSelect} variant="nav" legacyClassName="tcrn-section-tabs" />;
}

/** The Tabs family's segmented variant (root hook `tcrn-segmented-nav` through 4.0.x). */
export function SegmentedNav({ items, locale, label, onSelect }: SelectableNavProps) {
  return <TabList items={items} label={label ?? chromeLabels(locale).sectionNavigation} onSelect={onSelect} variant="segmented" legacyClassName="tcrn-segmented-nav" />;
}

/**
 * The five navs above share `ProductLauncherProps`, and only three of them
 * select anything — so the handler goes on its own type rather than the shared
 * one, the same call Breadcrumb made when it needed an href. Widening the shared
 * type would offer an `onSelect` to ProductLauncher and ProductSwitcher, which
 * do not select.
 */
export interface SelectableNavProps extends ProductLauncherProps {
  /** Optional accessible name for a local navigation instance. */
  label?: string;
  /** Called with the item's `id`. Omit for a nav the consumer wires another way. */
  onSelect?: (id: string) => void;
}

interface TabListProps {
  items: NavItem[];
  label: string;
  onSelect?: (id: string) => void;
  variant: Exclude<TabsVariant, "panel">;
  legacyClassName: string;
}

function TabList({ items, label, onSelect, variant, legacyClassName }: TabListProps) {
  return (
    <nav className={cx("tcrn-tabs", `tcrn-tabs--${variant}`, legacyClassName)} aria-label={label} data-tab-semantics="segmented-navigation">
      {items.map((item) => (
        <button key={item.id} type="button"
          className="tcrn-tabs__tab"
          title={item.label}
          aria-current={item.selected ? "page" : undefined}
          data-selected={item.selected ? "true" : undefined}
          onClick={onSelect ? () => onSelect(item.id) : undefined}
        >
          <span className="tcrn-tabs__label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

export interface SideNavProps extends HTMLAttributes<HTMLElement> {
  label: string;
  children: ReactNode;
}

/**
 * @deprecated Since 4.0.0 (TCRN-DS-SUB-125): the top-band shell has no resident side rail. Give
 * ProductShell the navigation as its menu model (navGroups); NavGroup and NavItem rows render in the
 * full menu and the drop-downs. Its rules moved to tcrnRetiredComponentCss; removed in 4.1.
 */
export function SideNav({ label, className, children, ...props }: SideNavProps) {
  return (
    <nav {...props} aria-label={label} className={cx("tcrn-side-nav", className)} data-navigation-primitive="side-nav">
      {children}
    </nav>
  );
}

/**
 * The pin of a NavItem or NavGroup row (TCRN-DS-SUB-123, MIN-20261013-SHELL D6: the pin
 * replaces draft one's star). Pinning puts the row's destination or group in the top band.
 *
 * Both components take the same three props and render the pin only when
 * `onPinnedChange` is given, so a row that cannot be pinned keeps its markup. A pinnable
 * row keeps a 24 slot (the shell pin-button token) whether the pin shows or not: the pin
 * is shown with opacity (row hover, focus inside the row, or pinned), never with display,
 * so the row's text box is the same width at rest and on hover.
 */
export interface NavPinProps {
  /** Whether the row is pinned to the top band; the pin's aria-pressed. */
  pinned?: boolean;
  /** Called with the requested state when the pin is pressed. Without it there is no pin. */
  onPinnedChange?: (pinned: boolean) => void;
  /**
   * The row's name inside the pin's accessible name ("Pin to top bar: {pinLabel}").
   * Defaults to the group label, or to the item's text when its children are a string;
   * give it when a NavItem's children are not plain text.
   */
  pinLabel?: string;
}

interface NavPinButtonProps {
  pinned: boolean;
  label: string;
  locale?: TcrnLocale | string;
  onPinnedChange: (pinned: boolean) => void;
}

function NavPinButton({ pinned, label, locale, onPinnedChange }: NavPinButtonProps) {
  const chrome = chromeLabels(locale);
  return (
    <button
      type="button"
      className="tcrn-nav-pin"
      aria-pressed={pinned}
      aria-label={pinned ? chrome.unpinFromStrip(label) : chrome.pinToStrip(label)}
      data-pin-button=""
      data-navigation-primitive="nav-pin"
      onClick={() => onPinnedChange(!pinned)}
    >
      <Icon name="pin" />
    </button>
  );
}

function navItemText(children: ReactNode): string | undefined {
  return typeof children === "string" || typeof children === "number" ? String(children) : undefined;
}

export interface NavGroupProps extends HTMLAttributes<HTMLDivElement>, NavPinProps {
  label: string;
  selected?: boolean;
  /** Which language the built-in pin name is said in; defaults to the page's own. */
  locale?: TcrnLocale | string;
  children: ReactNode;
}

export function NavGroup({ label, selected = false, pinned = false, onPinnedChange, pinLabel, locale, className, children, ...props }: NavGroupProps) {
  return (
    <div
      {...props}
      className={cx("tcrn-nav-group", className)}
      data-selected={selected ? "true" : undefined}
      data-navigation-primitive="nav-group"
    >
      {onPinnedChange ? (
        <div className="tcrn-nav-group__label" data-nav-pinnable="true">
          <span className="tcrn-nav-group__label-text" title={label}>
            {label}
          </span>
          <NavPinButton pinned={pinned} label={pinLabel ?? label} locale={locale} onPinnedChange={onPinnedChange} />
        </div>
      ) : (
        // The title row is one line that ends in an ellipsis when it is too long, so its text
        // carries the whole label as its title (C7; TCRN-DS-SUB-154).
        <div className="tcrn-nav-group__label">
          <span className="tcrn-nav-group__label-text" title={label}>
            {label}
          </span>
        </div>
      )}
      <div className="tcrn-nav-group__items">{children}</div>
    </div>
  );
}

export interface NavItemProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children">, NavPinProps {
  selected?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  /** Which language the built-in disabled reason and pin name are said in; defaults to the page's own. */
  locale?: TcrnLocale | string;
  iconName?: IconName;
  /** Data-owned nesting depth used to derive the item's visual inset. */
  depth?: number;
  children: ReactNode;
}

export function NavItem({
  selected = false,
  disabled = false,
  disabledReason,
  locale,
  iconName,
  depth = 0,
  pinned = false,
  onPinnedChange,
  pinLabel,
  className,
  style,
  children,
  href = "#",
  ...props
}: NavItemProps) {
  // Rendered visibly, in the `title`, and as the item's description — so when it
  // falls back it says one English sentence in three places at once.
  const normalizedReason = disabled ? requiredText(disabledReason, chromeLabels(locale).navItemUnavailable) : undefined;
  const disabledReasonId = useId();
  const ariaDescribedBy = mergeIds(props["aria-describedby"], normalizedReason ? disabledReasonId : undefined);
  const resolvedDepth = Number.isInteger(depth) && depth >= 0 ? depth : 0;
  const navStyle = { ...style, "--tcrn-nav-item-depth": resolvedDepth } as CSSProperties;
  // A pinnable row's label is one line that ends in an ellipsis, so it carries its text as its
  // title: the label itself, or the title the row was given when the label is markup (C7;
  // TCRN-DS-SUB-154).
  const labelTitle = onPinnedChange ? (navItemText(children) ?? (typeof props.title === "string" ? props.title : undefined)) : undefined;
  const link = (
    <a
      {...props}
      href={disabled ? undefined : href}
      aria-current={selected ? "page" : undefined}
      aria-disabled={disabled ? true : undefined}
      aria-describedby={ariaDescribedBy}
      data-selected={selected ? "true" : undefined}
      data-disabled-reason={normalizedReason}
      tabIndex={disabled ? -1 : props.tabIndex}
      title={normalizedReason ?? props.title}
      className={cx("tcrn-nav-item", className)}
      style={navStyle}
      data-navigation-primitive="nav-item"
      data-nav-item-has-icon={iconName ? "true" : "false"}
      data-nav-depth={resolvedDepth}
    >
      {iconName ? <Icon name={iconName} /> : null}
      <span className="tcrn-nav-item__content">
        <span className="tcrn-nav-item__label" title={labelTitle}>
          {children}
        </span>
        {normalizedReason ? (
          <span id={disabledReasonId} className="tcrn-nav-item__disabled-reason">
            {normalizedReason}
          </span>
        ) : null}
      </span>
    </a>
  );
  if (!onPinnedChange) return link;
  // A link cannot hold a button, so a pinnable item is a row of two siblings: the link and
  // its pin. The row paints the item's fill and ink, so hovering the pin keeps the row lit.
  const pinName = pinLabel ?? navItemText(children) ?? props["aria-label"] ?? "";
  return (
    <div
      className="tcrn-nav-item-row"
      data-navigation-primitive="nav-item-row"
      data-nav-pinnable="true"
      data-selected={selected ? "true" : undefined}
    >
      {link}
      <NavPinButton pinned={pinned} label={pinName} locale={locale} onPinnedChange={onPinnedChange} />
    </div>
  );
}

export interface SkipLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
}

export function SkipLink({ href = "#content", className, children, ...props }: SkipLinkProps) {
  return (
    <a {...props} href={href} className={cx("tcrn-skip-link", className)}>
      {children}
    </a>
  );
}

export interface ProductShellSearchResult {
  id: string;
  title: string;
  titleKey?: string;
  meta?: string;
  metaKey?: string;
  href: string;
  selected?: boolean;
}

export interface ProductShellSearchProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "results"> {
  label?: string;
  placeholder?: string;
  /** Which language the four built-in strings are said in; defaults to the page's own. */
  locale?: TcrnLocale | string;
  shortcut?: SearchInputProps["shortcut"];
  query?: string;
  expanded?: boolean;
  results?: readonly ProductShellSearchResult[];
  resultsLabel?: string;
  emptyLabel?: string;
  onQueryChange?: (query: string) => void;
  onExpandedChange?: (expanded: boolean, reason: ProductShellSearchExpandedChangeReason) => void;
  onDismiss?: (reason: ProductShellSearchDismissReason) => void;
  onResultActivate?: (result: ProductShellSearchResult, event: ReactMouseEvent<HTMLAnchorElement>) => void;
  inputProps?: Omit<SearchInputProps, "type" | "placeholder" | "shortcut" | "value" | "defaultValue" | "onChange" | "onInput" | "onFocus" | "onBlur" | "onKeyDown">;
  "data-product-shell-search-label-key"?: string;
  "data-product-shell-search-results-label-key"?: string;
  "data-product-shell-search-empty-label-key"?: string;
}

export function ProductShellSearch({
  label,
  placeholder,
  locale,
  shortcut = "auto",
  query = "",
  expanded = false,
  results = [],
  resultsLabel,
  emptyLabel,
  onQueryChange,
  onExpandedChange,
  onDismiss,
  onResultActivate,
  inputProps,
  className,
  ...props
}: ProductShellSearchProps) {
  const resultsId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const isExpanded = expanded;
  const hasResults = results.length > 0;
  // The placeholder and the empty-state line are the two visible ones here; the
  // other two are the names a screen-reader user hears for the field and its
  // result list.
  const chrome = chromeLabels(locale);
  const resolvedLabel = label ?? chrome.searchShell;
  const resolvedPlaceholder = placeholder ?? chrome.searchPlaceholder;
  const resolvedResultsLabel = resultsLabel ?? chrome.searchResults;
  const resolvedEmptyLabel = emptyLabel ?? chrome.searchEmpty;

  const requestExpandedChange = useCallback((nextExpanded: boolean, reason: ProductShellSearchExpandedChangeReason) => {
    onExpandedChange?.(nextExpanded, reason);
  }, [onExpandedChange]);

  const dismissSearch = useCallback((reason: ProductShellSearchDismissReason) => {
    requestExpandedChange(false, reason);
    onDismiss?.(reason);
  }, [onDismiss, requestExpandedChange]);

  useEffect(() => {
    if (!isExpanded) return undefined;
    const ownerDocument = rootRef.current?.ownerDocument ?? document;
    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target instanceof Node ? event.target : null;
      if (target && !rootRef.current?.contains(target)) {
        dismissSearch("outside-pointer");
      }
    };
    ownerDocument.addEventListener("mousedown", handleMouseDown);
    return () => {
      ownerDocument.removeEventListener("mousedown", handleMouseDown);
    };
  }, [dismissSearch, isExpanded]);

  const handleFocus = () => {
    requestExpandedChange(true, "focus");
  };

  const handleInput = (event: FormEvent<HTMLInputElement>) => {
    onQueryChange?.(event.currentTarget.value);
    requestExpandedChange(true, "input");
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    const nextTarget = event.relatedTarget instanceof Node ? event.relatedTarget : null;
    if (!nextTarget || !rootRef.current?.contains(nextTarget)) {
      dismissSearch("blur");
    }
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      dismissSearch("escape");
      event.currentTarget.blur();
    }
    if (event.key === "Tab") {
      dismissSearch("tab");
    }
  };

  const handleResultActivate = (result: ProductShellSearchResult, event: ReactMouseEvent<HTMLAnchorElement>) => {
    onResultActivate?.(result, event);
    if (!event.defaultPrevented) {
      dismissSearch("result-activate");
    }
  };

  return (
    <div
      {...props}
      ref={rootRef}
      className={cx("tcrn-product-shell-search", className)}
      data-shell-control="product-shell-search"
      data-package-backed-shell-control="product-shell-search"
      data-search-expanded={isExpanded ? "true" : "false"}
      data-search-results-visible={isExpanded && hasResults ? "true" : "false"}
      data-search-dismissal-contract="blur-outside-pointer-tab-escape"
      data-search-semantic-api="onQueryChange-onExpandedChange-onDismiss-onResultActivate"
    >
      <SearchInput
        {...inputProps}
        role="combobox"
        aria-label={resolvedLabel}
        aria-controls={resultsId}
        aria-expanded={isExpanded ? "true" : "false"}
        aria-haspopup="listbox"
        aria-autocomplete="list"
        placeholder={resolvedPlaceholder}
        shortcut={shortcut}
        value={query}
        readOnly={inputProps?.readOnly ?? !onQueryChange}
        onFocus={handleFocus}
        onInput={handleInput}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
      <div
        id={resultsId}
        className="tcrn-product-shell-search__results"
        role="listbox"
        aria-label={resolvedResultsLabel}
        data-product-shell-search-results
        hidden={!isExpanded}
      >
        {hasResults ? results.map((result) => (
          <a key={result.id}
            className="tcrn-product-shell-search__result"
            href={result.href}
            title={result.meta ? `${result.title} — ${result.meta}` : result.title}
            role="option"
            onClick={(event) => handleResultActivate(result, event)}
            aria-selected={result.selected ? "true" : undefined}
            data-search-result
            data-selected={result.selected ? "true" : undefined}
            data-search-result-title-key={result.titleKey}
            data-search-result-meta-key={result.metaKey}
          >
            <strong>{result.title}</strong>
            {result.meta ? <span>{result.meta}</span> : null}
          </a>
        )) : (
          // While the search is open and nothing matches, the empty line shows in place of the
          // results; it is not hidden with them (TCRN-DS-SUB-154).
          <span className="tcrn-product-shell-search__empty">{resolvedEmptyLabel}</span>
        )}
      </div>
    </div>
  );
}

/**
 * An entry of the product's menu model below the groups (C-7): a ShellMenuItem plus what a
 * product already passed — a key into its own dictionary and the flag of the current page. An
 * item's children are the third level, theirs the fourth and last; a row with children opens
 * them instead of navigating, so its `href` may be left out.
 */
export interface ProductShellNavItem extends ShellMenuItem {
  labelKey?: string;
  /** The current page: the shell derives the selected row, the selected pin and the current position from it. */
  selected?: boolean;
  children?: readonly ProductShellNavItem[];
}

/**
 * A group of the product's menu model (C-7): a ShellMenuGroup, one column of the full menu. The
 * keys, the description and the section label are the product's own metadata for its
 * dictionary; the shell does not render them.
 */
export interface ProductShellNavGroup extends ShellMenuGroup {
  labelKey?: string;
  description?: string;
  descriptionKey?: string;
  sectionLabel?: string;
  sectionLabelKey?: string;
  selected?: boolean;
  items: readonly ProductShellNavItem[];
}

/** Why the full menu opens or closes: a shell control (the brand button, another layer), ⌘K or Ctrl+K, Esc, a press outside, a choice. */
export type ProductShellMenuChangeReason = "trigger" | ShellMenuOpenChangeReason;

/** The signed-in reader the 28 avatar of the top-right cluster stands for. */
export interface ProductShellAccount {
  name: string;
  /** What the avatar shows; the first character of the name when omitted. */
  initials?: string;
}

/** One product of the avatar menu's product switcher. */
export interface ProductShellProduct {
  id: string;
  label: string;
  href: string;
  /** The product this shell belongs to: aria-current="page", the 6% wash and weight 600. */
  current?: boolean;
}

/** The bell of the top-right cluster; without it the cluster is the avatar alone. */
export interface ProductShellNotifications {
  /** Unread notifications: more than none shows the dot and is said in the bell's name. */
  unread?: number;
  onOpen?: () => void;
}

export interface ProductShellProps extends HTMLAttributes<HTMLDivElement> {
  productName: string;
  moduleName: string;
  /** The product key: the brand button's mark and wordmark and the full menu's lockup, from logos2 as they are. */
  brandProductId: TcrnProductMarkId;
  /** Name of the current page, the current position's last step when no menu entry is selected. */
  currentRouteLabel: string;
  currentRouteLabelKey?: string;
  /** The menu model: groups → items → children → children (C-7). */
  navGroups: readonly ProductShellNavGroup[];
  locales: readonly ShellLocaleOption[];
  currentLocale: string;
  /**
   * The page's header, the paper's first row: the trail, the title and the page's actions (07b
   * board, section E, "PageHeader 必有"). Required, so a shell page without one does not type-check.
   * An omitted trail is the current position in `navGroups` (group › … › page); an omitted locale is
   * `currentLocale`.
   */
  pageHeader: PageHeaderProps;
  /** The page below its header. */
  children: ReactNode;
  currentTheme?: ShellThemeMode;
  localeMenuOpen?: boolean;
  /**
   * Product-owned controls for the top-right cluster, before the bell and the avatar, which stay
   * rightmost so their position does not move as products add controls. Omitting it renders the
   * cluster without them.
   */
  headerActions?: ReactNode;
  /** The signed-in reader; the avatar shows their initials. */
  account?: ProductShellAccount;
  /** The products the avatar menu switches between; the full menu and the lockup carry no product list. */
  products?: readonly ProductShellProduct[];
  notifications?: ProductShellNotifications;
  /** Ids of the pinned groups, items and children in the reader's order; the band shows the first six. */
  pinnedIds?: readonly string[];
  /** Pins or unpins an entry; without it the menu rows have no pin. */
  onPinnedChange?: (id: string, pinned: boolean) => void;
  /** Whether the full menu is open; the shell keeps its own state when omitted. */
  menuOpen?: boolean;
  onMenuOpenChange?: (open: boolean, reason: ProductShellMenuChangeReason) => void;
  /** The pinned item whose drop-down is open; the shell keeps its own state when omitted. */
  openPinId?: string | null;
  onOpenPinChange?: (id: string | null) => void;
  /** Whether the avatar menu is open; the shell keeps its own state when omitted. */
  accountMenuOpen?: boolean;
  onAccountMenuOpenChange?: (open: boolean) => void;
  /** Placeholder of the full menu's search. */
  searchPlaceholder?: string;
  /** The full menu's search provider (whole-site targets); the menu model is searched when omitted. */
  searchProvider?: ShellMenuSearchProvider;
  onSearchQueryChange?: (query: string) => void;
  onThemeChange?: (theme: ShellThemeMode) => void;
  onLocaleMenuOpenChange?: (open: boolean, reason: ProductShellLocaleMenuChangeReason) => void;
  onLocaleChange?: (locale: string) => void;
  contentId?: string;
  contentRole?: "main" | "region";
  contentLabel?: string;
  skipLinkLabel?: string;
}

/** A pinned entry the menu model holds: its ShellPins item, its drop-down source and the level of the drop-down's rows. */
interface ProductShellPinTarget {
  pin: ShellPinItem;
  source: ShellMenuGroup | ShellMenuItem | null;
  level: number;
  /** Ids of the entries under it: a pin is selected when the current page sits in its menu. */
  holds: ReadonlySet<string>;
}

function productShellEntryIds(entries: readonly ShellMenuItem[], into: Set<string>, level: number): Set<string> {
  for (const entry of entries) {
    into.add(entry.id);
    if (entry.children && level < shellMenuMaxDepth) productShellEntryIds(entry.children, into, level + 1);
  }
  return into;
}

function productShellFindEntry(groups: readonly ProductShellNavGroup[], id: string): ProductShellPinTarget | null {
  for (const group of groups) {
    if (group.id === id) {
      const source = group.items.length > 0 ? group : null;
      return { pin: { id, label: group.label, hasMenu: source !== null }, source, level: 2, holds: productShellEntryIds(group.items, new Set(), 2) };
    }
    const visit = (entries: readonly ProductShellNavItem[], level: number): ProductShellPinTarget | null => {
      for (const entry of entries) {
        const next = level < shellMenuMaxDepth && (entry.children?.length ?? 0) > 0 ? (entry.children ?? []) : [];
        if (entry.id === id) {
          const source = next.length > 0 ? entry : null;
          return { pin: { id, label: entry.label, href: entry.href, hasMenu: source !== null }, source, level: level + 1, holds: productShellEntryIds(next, new Set(), level + 1) };
        }
        const found = visit(next, level + 1);
        if (found) return found;
      }
      return null;
    };
    const found = visit(group.items, 2);
    if (found) return found;
  }
  return null;
}

/** The selected entry of the menu model and the current position down to it (group › … › page). */
function productShellSelection(groups: readonly ProductShellNavGroup[]): { id: string; path: ShellMenuCrumb[] } | null {
  for (const group of groups) {
    const visit = (entries: readonly ProductShellNavItem[], path: ShellMenuCrumb[], level: number): { id: string; path: ShellMenuCrumb[] } | null => {
      for (const entry of entries) {
        const step: ShellMenuCrumb = entry.href ? { label: entry.label, href: entry.href } : { label: entry.label };
        if (entry.selected) return { id: entry.id, path: [...path, step] };
        if (entry.children && level < shellMenuMaxDepth) {
          const found = visit(entry.children, [...path, step], level + 1);
          if (found) return found;
        }
      }
      return null;
    };
    const found = visit(group.items, [{ label: group.label }], 2);
    if (found) return found;
  }
  return null;
}

function productShellInitials(account: ProductShellAccount): string {
  return account.initials ?? Array.from(account.name.trim())[0] ?? "";
}

/**
 * The product shell: the top band and the paper (TCRN-DS-SUB-119; 07a board, section A; 07b board,
 * section D rows "顶带高" and "纸"). There is one shell and no side rail. The band is the strip-h
 * token high with no fill and no rule: the brand button (which opens the full menu, ShellMenu),
 * the pinned items (ShellPins; a pinned group or submenu opens its drop-down, ShellDropdown) and
 * the top-right cluster — the product's own controls, the bell and the avatar, whose menu holds
 * the product switcher, the theme and the language. The paper holds the page: space-3 from the
 * shell's sides and bottom, under the band, with the paper radius and shadow s1. Its first row is
 * the page header (`pageHeader`, required: TCRN-DS-SUB-129), then the page. One layer is open
 * at a time: opening the full menu, a drop-down or the avatar menu closes the other two. The phone
 * presentation is the full menu's own (C-7); the shell has no branch for it.
 */
export function ProductShell({
  productName,
  moduleName,
  brandProductId,
  currentRouteLabel,
  currentRouteLabelKey,
  navGroups,
  locales,
  currentLocale,
  pageHeader,
  children,
  currentTheme = "light",
  localeMenuOpen = false,
  headerActions,
  account,
  products,
  notifications,
  pinnedIds = [],
  onPinnedChange,
  menuOpen,
  onMenuOpenChange,
  openPinId,
  onOpenPinChange,
  accountMenuOpen,
  onAccountMenuOpenChange,
  searchPlaceholder,
  searchProvider,
  onSearchQueryChange,
  onThemeChange,
  onLocaleMenuOpenChange,
  onLocaleChange,
  contentId = "product-shell-content",
  contentRole = "region",
  contentLabel,
  skipLinkLabel,
  className,
  ...props
}: ProductShellProps) {
  const ContentElement = contentRole === "main" ? "main" : "section";
  // Like `ShellLocaleMenu`, this needs no `locale` prop: `currentLocale` is required here, so the
  // shell already knows the reader's language and a second way to say it could only disagree.
  const chrome = chromeLabels(currentLocale);
  const copy = tcrnShellCopyFor(currentLocale);
  const resolvedContentLabel = contentLabel ?? chrome.shellWorkspace;
  const resolvedSkipLinkLabel = skipLinkLabel ?? chrome.skipToContent;
  const baseId = useId();
  const menuId = `${baseId}-menu`;
  const accountId = `${baseId}-account`;
  const dropIdOf = (id: string) => `${baseId}-drop-${id}`;
  const brandRef = useRef<HTMLButtonElement>(null);
  const avatarRef = useRef<HTMLButtonElement>(null);
  const accountRef = useRef<HTMLElement>(null);
  const [ownMenuOpen, setOwnMenuOpen] = useState(false);
  const [ownOpenPin, setOwnOpenPin] = useState<string | null>(null);
  const [ownAccountOpen, setOwnAccountOpen] = useState(false);
  const shownMenuOpen = menuOpen ?? ownMenuOpen;
  const shownOpenPin = openPinId === undefined ? ownOpenPin : openPinId;
  const shownAccountOpen = accountMenuOpen ?? ownAccountOpen;

  const closeLayers = (keep: "menu" | "pin" | "account") => {
    if (keep !== "menu" && shownMenuOpen) {
      setOwnMenuOpen(false);
      onMenuOpenChange?.(false, "trigger");
    }
    if (keep !== "pin" && shownOpenPin !== null) {
      setOwnOpenPin(null);
      onOpenPinChange?.(null);
    }
    if (keep !== "account" && shownAccountOpen) {
      setOwnAccountOpen(false);
      onAccountMenuOpenChange?.(false);
    }
  };
  const changeMenu = (open: boolean, reason: ProductShellMenuChangeReason) => {
    if (open) closeLayers("menu");
    setOwnMenuOpen(open);
    onMenuOpenChange?.(open, reason);
  };
  const changeOpenPin = (id: string | null) => {
    if (id !== null) closeLayers("pin");
    setOwnOpenPin(id);
    onOpenPinChange?.(id);
  };
  const changeAccount = (open: boolean) => {
    if (open) closeLayers("account");
    setOwnAccountOpen(open);
    onAccountMenuOpenChange?.(open);
  };

  useShellTransientLayer({
    open: shownAccountOpen,
    layerRef: accountRef,
    triggerRef: avatarRef,
    onClose: () => changeAccount(false)
  });

  const pinTargets = pinnedIds
    .map((id) => productShellFindEntry(navGroups, id))
    .filter((target): target is ProductShellPinTarget => target !== null);
  const pinItems = pinTargets.map((target) => target.pin);
  const shownTargets = pinTargets.slice(0, shellPinsMax());
  const selection = productShellSelection(navGroups);
  const selectedId = selection?.id ?? null;
  const selectedPin = selectedId === null
    ? undefined
    : shownTargets.find((target) => target.pin.id === selectedId) ?? shownTargets.find((target) => target.holds.has(selectedId));
  const openTarget = shownOpenPin === null ? undefined : shownTargets.find((target) => target.pin.id === shownOpenPin && target.source);
  const currentPath: readonly ShellMenuCrumb[] = selection?.path ?? [{ label: currentRouteLabel }];
  // The page header's trail defaults to the current position; its last step, the page, is no link.
  const currentTrail: readonly PageHeaderBreadcrumb[] = currentPath.map((step, index) => (
    step.href && index < currentPath.length - 1 ? { id: `${baseId}-crumb-${index}`, label: step.label, href: step.href } : { id: `${baseId}-crumb-${index}`, label: step.label }
  ));
  const state = shownMenuOpen ? "expanded" : openTarget ? "drop" : "closed";
  const unread = notifications?.unread ?? 0;

  return (
    <div
      // data-shell names the shell for the measurement; a consumer may give it a value.
      data-shell=""
      {...props}
      className={cx("tcrn-product-shell", className)}
      data-state={state}
      data-package-backed-product-shell-boundary="top-band-shell-v2"
      data-product-shell-pattern="top-band"
      data-product-shell-theme={currentTheme}
      data-product-shell-effect-boundary="ds-owned-tokens-motion-focus"
      data-product-shell-consumer-scope="ia-data-route-labels-content-callbacks"
      data-product-shell-semantic-api="menu-pins-theme-locale"
      data-product-shell-header-actions={headerActions ? "present" : "absent"}
      data-product-shell-current-route-label-key={currentRouteLabelKey}
    >
      <SkipLink href={`#${contentId}`}>{resolvedSkipLinkLabel}</SkipLink>
      {/* Composed per locale: the module name is the consumer's own. */}
      <header className="tcrn-shell-strip" aria-label={chrome.shellControlsOf(moduleName)} data-shell-strip="" data-product-shell-region="strip">
        <ShellBrandButton
          ref={brandRef}
          productId={brandProductId}
          expanded={shownMenuOpen}
          aria-controls={menuId}
          locale={currentLocale}
          onClick={() => changeMenu(!shownMenuOpen, "trigger")}
        />
        <ShellPins
          items={pinItems}
          selectedId={selectedPin?.pin.id ?? null}
          openId={openTarget?.pin.id ?? null}
          onOpenChange={changeOpenPin}
          menuIdOf={dropIdOf}
          locale={currentLocale}
        />
        <div className="tcrn-shell-cluster" data-cluster="">
          {headerActions ? (
            <div className="tcrn-product-shell__header-actions" data-product-shell-region="header-actions">
              {headerActions}
            </div>
          ) : null}
          {notifications ? (
            <button type="button" className="tcrn-shell-bell" aria-label={copy.notificationsOf(unread)} data-shell-bell="" onClick={notifications.onOpen}>
              <Icon name="bell" size={20} />
              {unread > 0 ? <i className="tcrn-shell-bell__dot" aria-hidden="true" /> : null}
            </button>
          ) : null}
          <div className="tcrn-shell-account" data-shell-account="">
            <button
              ref={avatarRef}
              type="button"
              className="tcrn-shell-avatar"
              aria-label={account ? copy.accountMenuOf(account.name) : copy.account}
              aria-haspopup="dialog"
              aria-expanded={shownAccountOpen}
              aria-controls={accountId}
              data-shell-avatar=""
              onClick={() => changeAccount(!shownAccountOpen)}
            >
              {account ? <span aria-hidden="true">{productShellInitials(account)}</span> : <Icon name="users" size={14} />}
            </button>
            {shownAccountOpen ? (
              <section
                ref={accountRef}
                id={accountId}
                className="tcrn-shell-account__panel"
                role="dialog"
                aria-modal="false"
                aria-label={copy.account}
                data-panel="account"
              >
                {account ? (
                  <p className="tcrn-shell-account__who">
                    <b title={account.name}>{account.name}</b>
                    <span title={productName}>{productName}</span>
                  </p>
                ) : null}
                {products && products.length > 0 ? (
                  <nav className="tcrn-shell-account__products" aria-label={copy.switchProduct} data-shell-products="">
                    <span className="tcrn-shell-account__heading" aria-hidden="true">
                      {copy.switchProduct}
                    </span>
                    {products.map((product) => (
                      <NavItem key={product.id}
                        href={product.href}
                        selected={product.current}
                        locale={currentLocale}
                        title={product.label}
                        data-shell-product={product.id}
                      >
                        {product.label}
                      </NavItem>
                    ))}
                  </nav>
                ) : null}
                <div className="tcrn-shell-account__prefs" role="group" aria-label={copy.themeAndLanguage} data-shell-preferences="">
                  <ShellThemeToggle currentTheme={currentTheme} locale={currentLocale} onThemeChange={onThemeChange} />
                  <ShellLocaleMenu
                    locales={locales}
                    currentLocale={currentLocale}
                    open={localeMenuOpen}
                    onOpenChange={onLocaleMenuOpenChange}
                    onLocaleChange={onLocaleChange}
                  />
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </header>
      <ShellMenu
        id={menuId}
        open={shownMenuOpen}
        onOpenChange={changeMenu}
        triggerRef={brandRef}
        productId={brandProductId}
        groups={navGroups}
        selectedId={selectedId}
        currentPath={currentPath}
        pinnedIds={pinnedIds}
        onPinnedChange={onPinnedChange}
        pinnedItems={pinItems}
        searchPlaceholder={searchPlaceholder}
        searchProvider={searchProvider}
        onSearchQueryChange={onSearchQueryChange}
        locale={currentLocale}
      />
      {shownTargets.map((target) =>
        target.source ? (
          <ShellDropdown key={target.pin.id}
            id={dropIdOf(target.pin.id)}
            source={target.source}
            level={target.level}
            open={openTarget === target}
            onOpenChange={(open) => {
              if (!open) changeOpenPin(null);
            }}
            selectedId={selectedId}
            pinnedIds={pinnedIds}
            onPinnedChange={onPinnedChange}
            locale={currentLocale}
          />
        ) : null
      )}
      <div className="tcrn-product-shell__paper" data-paper="" data-product-shell-region="paper">
        <ContentElement id={contentId} className="tcrn-product-shell__main" data-product-shell-region="content" aria-label={resolvedContentLabel}>
          <PageHeader {...pageHeader} breadcrumbs={pageHeader.breadcrumbs ?? currentTrail} locale={pageHeader.locale ?? currentLocale} />
          {children}
        </ContentElement>
      </div>
    </div>
  );
}

/**
 * The preferences a request may carry, already parsed and narrowed: the two display
 * preferences of the preference cookies (theme and locale, which
 * `readPreferenceCookieValues` reads) and the reader's pinned items in this product.
 *
 * Each field is either a value in its own domain or absent. Absent means "the
 * request did not state this preference", so the controller's `initial*` fallback
 * stands — which is why garbage narrows to `undefined` here rather than to a
 * default: a cookie that cannot be trusted must not outrank the product's own
 * fallback.
 *
 * The pins are not a cookie preference. They are a server preference per user and
 * per product that follows the reader across devices, so the product's backend keeps
 * them and passes them here; the package defines only how they are read and written,
 * and keeps a local copy as the fallback. The order is the reader's: groups, items
 * and submenus can be pinned, the band shows the first --tcrn-shell-pins-max (6) and
 * the full menu marks the rest as pinned.
 */
export interface ProductShellRequestPreferences {
  theme?: ShellThemeMode | undefined;
  locale?: TcrnLocale | undefined;
  pins?: readonly string[] | undefined;
}

export interface ProductShellControllerConfig {
  initialTheme?: ShellThemeMode;
  initialLocale?: string;
  /** Pinned ids when neither the request nor the local fallback has any. */
  initialPins?: readonly string[];
  /** The product the pins belong to: the local fallback keeps each product's pins under its own key. */
  productId?: string;
  themeStorageKey?: string;
  localeStorageKey?: string;
  /** Key of the pins' local fallback (the browser's own store, never a cookie); `tcrn-shell-pins:<productId>` when omitted. */
  pinsStorageKey?: string;
  /**
   * The request's stored preferences, for a server-rendered product.
   *
   * There is no `document` on the server, so without this the shell's stored
   * preferences are unreadable exactly where reading them matters — during the
   * render that produces the first paint. Passing them is what lets the first bytes
   * already carry the reader's theme and locale instead of correcting to them after
   * hydration; a client-only product omits this and loses nothing.
   *
   * Parsed values, deliberately not the raw `Cookie` header. An earlier shape of
   * this prop took the whole header, which handed the design system every cookie
   * the consumer's requests carry — including any future session credential — when
   * all it may hold is two display preferences. `readPreferenceCookieValues`
   * does the narrowing on the consumer's server, so what crosses the package
   * boundary from the cookie is exactly the two values this controller governs.
   * The pins never travel in a cookie: the product's backend passes them as `pins`.
   *
   * A query parameter still outranks this. The product resolves that itself and
   * passes the winner as `initialTheme`/`initialLocale`, because only the product
   * knows its own URL vocabulary.
   */
  // Explicitly `| undefined`: a request with no preference cookies is the ordinary
  // first-visit case, not a caller who forgot the argument. A consumer compiled
  // with `exactOptionalPropertyTypes` would otherwise have to spread the prop
  // conditionally to say the one thing it most often needs to say.
  requestPreferences?: ProductShellRequestPreferences | undefined;
  searchRecords?: readonly ProductShellSearchResult[];
  searchLimit?: number;
  /** Told the pins after every change, in order, for the product's backend to keep. */
  onPinsChange?: (pins: readonly string[]) => void;
  onThemeChange?: (theme: ShellThemeMode) => void;
  onLocaleMenuOpenChange?: (open: boolean, reason: ProductShellLocaleMenuChangeReason) => void;
  onLocaleChange?: (locale: string) => void;
  onSearchQueryChange?: (query: string) => void;
  onSearchExpandedChange?: (expanded: boolean, reason: ProductShellSearchExpandedChangeReason) => void;
  onSearchDismiss?: (reason: ProductShellSearchDismissReason) => void;
  onSearchResultActivate?: (result: ProductShellSearchResult, event: ReactMouseEvent<HTMLAnchorElement>) => void;
}

export function useProductShellController({
  initialTheme = "light",
  initialLocale = "en",
  initialPins,
  productId,
  themeStorageKey,
  localeStorageKey,
  pinsStorageKey,
  requestPreferences,
  searchRecords = [],
  searchLimit = 8,
  onPinsChange,
  onThemeChange,
  onLocaleMenuOpenChange,
  onLocaleChange,
  onSearchQueryChange,
  onSearchExpandedChange,
  onSearchDismiss,
  onSearchResultActivate
}: ProductShellControllerConfig = {}) {
  // The product's backend is the store of record for the pins; the local copy, kept per product,
  // answers only when the request carries none.
  const pinsKey = pinsStorageKey ?? (productId ? `tcrn-shell-pins:${productId}` : undefined);
  const [pins, setPinsState] = useState<readonly string[]>(
    () => requestPreferences?.pins ?? readStoredPins(pinsKey) ?? initialPins ?? []);
  const pinsRef = useRef(pins);
  const [theme, setThemeState] = useState<ShellThemeMode>(
    () => readStoredTheme(themeStorageKey, initialTheme, requestPreferences?.theme));
  const [locale, setLocaleState] = useState(
    () => readStoredLocale(localeStorageKey, initialLocale, requestPreferences?.locale));
  const [localeMenuOpen, setLocaleMenuOpenState] = useState(false);
  const [searchQuery, setSearchQueryState] = useState("");
  const [searchExpanded, setSearchExpandedState] = useState(false);

  // Every change goes to the local fallback and to the product, which keeps the server
  // preference. Ids are unique and the order is the reader's; nothing is dropped past the
  // sixth, which the band does not show and the full menu marks as pinned.
  const setPins = useCallback((nextPins: readonly string[]) => {
    const unique = [...new Set(nextPins)];
    pinsRef.current = unique;
    setPinsState(unique);
    writeStoredPins(pinsKey, unique);
    onPinsChange?.(unique);
  }, [onPinsChange, pinsKey]);

  /** Pins an entry (a group, an item or a submenu) at the end of the order, or unpins it. */
  const setPinned = useCallback((id: string, pinned: boolean) => {
    const current = pinsRef.current;
    if (pinned === current.includes(id)) return;
    setPins(pinned ? [...current, id] : current.filter((entry) => entry !== id));
  }, [setPins]);

  /** Moves a pin to a new place in the order: where a drag in the band or the menu ends. */
  const movePin = useCallback((id: string, toIndex: number) => {
    const current = pinsRef.current;
    const from = current.indexOf(id);
    if (from < 0) return;
    const rest = current.filter((entry) => entry !== id);
    const to = Math.max(0, Math.min(Math.trunc(toIndex), rest.length));
    if (to === from) return;
    setPins([...rest.slice(0, to), id, ...rest.slice(to)]);
  }, [setPins]);

  const setTheme = useCallback((nextTheme: ShellThemeMode) => {
    const resolvedTheme = nextTheme === "dark" ? "dark" : "light";
    const update = () => {
      setThemeState(resolvedTheme);
      writeStoredString(themeStorageKey, resolvedTheme);
      onThemeChange?.(resolvedTheme);
    };
    const viewTransitionDocument = typeof document === "undefined"
      ? undefined
      : document as Document & { startViewTransition?: (callback: () => void) => { finished?: Promise<unknown> } };
    if (viewTransitionDocument?.startViewTransition) {
      viewTransitionDocument.startViewTransition(update);
      return;
    }
    update();
  }, [onThemeChange, themeStorageKey]);

  // The setter narrows too, not only the reader. A locale reaches this function
  // from a menu today, but the signature is public and the value ends up in
  // `<html lang>` and the dictionary index either way, so the boundary is the
  // function rather than any one of its callers.
  const setLocale = useCallback((nextLocale: string) => {
    const resolvedLocale = resolveTcrnLocale(nextLocale);
    setLocaleState(resolvedLocale);
    writeStoredString(localeStorageKey, resolvedLocale);
    onLocaleChange?.(resolvedLocale);
  }, [localeStorageKey, onLocaleChange]);

  const setLocaleMenuOpen = useCallback((nextOpen: boolean, reason: ProductShellLocaleMenuChangeReason = "controller") => {
    setLocaleMenuOpenState(nextOpen);
    onLocaleMenuOpenChange?.(nextOpen, reason);
  }, [onLocaleMenuOpenChange]);

  const setSearchQuery = useCallback((nextQuery: string) => {
    setSearchQueryState(nextQuery);
    onSearchQueryChange?.(nextQuery);
  }, [onSearchQueryChange]);

  const setSearchExpanded = useCallback((nextExpanded: boolean, reason: ProductShellSearchExpandedChangeReason = "controller") => {
    setSearchExpandedState(nextExpanded);
    onSearchExpandedChange?.(nextExpanded, reason);
  }, [onSearchExpandedChange]);

  const collapseSearch = useCallback((reason: ProductShellSearchDismissReason = "controller") => {
    setSearchExpanded(false, reason);
    onSearchDismiss?.(reason);
  }, [onSearchDismiss, setSearchExpanded]);

  // The records are the whole-site targets; the full menu asks for the results of what is typed in
  // its search. Without records the menu searches its own model.
  const searchProvider = useCallback<ShellMenuSearchProvider>((query) => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return [];
    return searchRecords
      .filter((record) => `${record.title} ${record.meta ?? ""}`.toLowerCase().includes(normalizedQuery))
      .slice(0, searchLimit);
  }, [searchLimit, searchRecords]);

  const searchResults = useMemo(() => searchProvider(searchQuery, []), [searchProvider, searchQuery]);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  const openLocaleMenu = useCallback(() => {
    setLocaleMenuOpen(true, "controller");
  }, [setLocaleMenuOpen]);

  const closeLocaleMenu = useCallback(() => {
    setLocaleMenuOpen(false, "controller");
  }, [setLocaleMenuOpen]);

  const handleSearchResultActivate = useCallback((result: ProductShellSearchResult, event: ReactMouseEvent<HTMLAnchorElement>) => {
    onSearchResultActivate?.(result, event);
  }, [onSearchResultActivate]);

  const productShellSearchProps: ProductShellSearchProps = {
    query: searchQuery,
    expanded: searchExpanded,
    results: searchResults,
    onQueryChange: setSearchQuery,
    onExpandedChange: setSearchExpanded,
    onDismiss: collapseSearch,
    onResultActivate: handleSearchResultActivate
  };

  const shellLocaleMenuProps = {
    currentLocale: locale,
    open: localeMenuOpen,
    onOpenChange: setLocaleMenuOpen,
    onLocaleChange: setLocale
  };

  const shellThemeToggleProps = {
    currentTheme: theme,
    onThemeChange: setTheme
  };

  // What ProductShell takes from the controller. The shell's search is the full menu's: it asks the
  // provider for the results of the query typed there.
  const productShellControlProps = {
    currentTheme: theme,
    currentLocale: locale,
    localeMenuOpen,
    onThemeChange: setTheme,
    onLocaleMenuOpenChange: setLocaleMenuOpen,
    onLocaleChange: setLocale,
    onSearchQueryChange: setSearchQuery,
    searchProvider: searchRecords.length > 0 ? searchProvider : undefined,
    pinnedIds: pins,
    onPinnedChange: setPinned
  } satisfies Partial<ProductShellProps>;

  return {
    pins,
    setPins,
    setPinned,
    movePin,
    theme,
    setTheme,
    toggleTheme,
    locale,
    setLocale,
    localeMenuOpen,
    setLocaleMenuOpen,
    openLocaleMenu,
    closeLocaleMenu,
    searchQuery,
    setSearchQuery,
    searchExpanded,
    setSearchExpanded,
    collapseSearch,
    searchResults,
    shellThemeToggleProps,
    shellLocaleMenuProps,
    productShellSearchProps,
    productShellControlProps,
    productShellStateProps: {
      currentTheme: theme,
      currentLocale: locale,
      localeMenuOpen,
      pinnedIds: pins
    }
  };
}

/**
 * How long a stored preference outlives the session it was chosen in.
 *
 * A session cookie would be cleared on browser close, and the flash the consumer
 * reported would come back on the next visit — the same defect, just less often,
 * which is the hardest kind to notice. A year is long enough that a returning
 * reader never re-chooses and short enough to expire on an abandoned device.
 */
const preferenceCookieMaxAgeSeconds = 60 * 60 * 24 * 365;

/**
 * A preference, from whichever store can answer where this runs.
 *
 * This used to read `window.localStorage` and nothing else, which made the shell's
 * own persistence unusable by a server-rendered product: the server cannot read
 * that store, so the first paint went out in the default and corrected itself after
 * hydration. A consumer reported exactly that — every page flashing English
 * light-mode before settling — and worked around it by reading cookies themselves
 * and passing the result in through `initialTheme`/`initialLocale`, leaving the
 * shell's `themeStorageKey`/`localeStorageKey` unused. That workaround is the
 * evidence the defect was here: the reference implementation was the thing teaching
 * the shape.
 *
 * `localStorage` wins where both can answer because it is the store the browser
 * cannot drop on its own — a cookie can expire or be cleared by a privacy setting
 * while site storage stays, and in that case the cookie's absence is not a choice
 * the reader made. On the server there is only the cookie.
 */
function readStoredPreference(key: string | undefined): string | null {
  if (!key) return null;
  if (typeof window !== "undefined") {
    const fromBrowserStore = window.localStorage.getItem(key);
    if (fromBrowserStore !== null) return fromBrowserStore;
  }
  return readCookiePreference(key, readDocumentCookieHeader());
}

/**
 * The pins' local fallback: the browser's own store and never a cookie, because the
 * request carries display preferences only. A stored value that is not a list of ids
 * is no preference.
 */
function readStoredPins(key: string | undefined): readonly string[] | undefined {
  if (!key || typeof window === "undefined") return undefined;
  const stored = window.localStorage.getItem(key);
  if (stored === null) return undefined;
  try {
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.every((entry) => typeof entry === "string") ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function writeStoredPins(key: string | undefined, pins: readonly string[]) {
  if (!key || typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(pins));
}

function readStoredTheme(
  key: string | undefined,
  fallback: ShellThemeMode,
  requestValue?: ShellThemeMode
): ShellThemeMode {
  const value = readStoredPreference(key);
  if (value !== null) return value === "dark" ? "dark" : "light";
  return requestValue ?? fallback;
}

/**
 * Locale is the one preference whose stored value is attacker-writable and lands
 * somewhere that matters: it becomes `<html lang>` and the dictionary index. The
 * theme reader narrows to its own domain (`dark`/`light`); this one narrows
 * through the locale contract, so a consumer
 * that does not re-resolve it downstream inherits a supported locale regardless
 * of what the store said.
 */
function readStoredLocale(key: string | undefined, fallback: string, requestValue?: TcrnLocale): TcrnLocale {
  const value = readStoredPreference(key);
  if (value !== null) return resolveTcrnLocale(value);
  return requestValue ?? resolveTcrnLocale(fallback);
}

/**
 * The server-side half of preference transport: the raw `Cookie` header goes in,
 * two narrowed values (theme and locale) come out, and nothing else crosses into
 * the shell. The pins are not read here: they are the product's server preference
 * and reach the controller as `requestPreferences.pins`.
 *
 * Narrowing to `undefined` rather than to a default is deliberate: an absent or
 * garbage cookie means "the request stated no preference", and the product's own
 * `initial*` fallback must win. `resolveTcrnLocale` would coerce garbage to a
 * real locale and silently outrank that fallback, so membership is checked
 * instead. A consumer calls this once in its request handler and passes the
 * result as `requestPreferences`.
 */
export function readPreferenceCookieValues(
  cookieHeader: string | undefined,
  keys: {
    themeKey?: string | undefined;
    localeKey?: string | undefined;
  }
): ProductShellRequestPreferences {
  const header = cookieHeader ?? "";
  const themeValue = keys.themeKey ? readCookiePreference(keys.themeKey, header) : null;
  const localeValue = keys.localeKey ? readCookiePreference(keys.localeKey, header) : null;
  return {
    theme: themeValue === "dark" || themeValue === "light" ? themeValue : undefined,
    locale: localeValue !== null && (tcrnSupportedLocales as readonly string[]).includes(localeValue)
      ? (localeValue as TcrnLocale)
      : undefined
  };
}

/**
 * Both stores, because writing only one is the defect in either direction.
 *
 * `localStorage` alone leaves the server blind, which is where the flash came from.
 * A cookie alone is lost to a privacy setting that keeps site storage but clears
 * cookies. Neither contains the other, so a change writes both and
 * `readStoredPreference` states which wins.
 */
function writeStoredString(key: string | undefined, value: string) {
  if (!key || typeof window === "undefined") return;
  window.localStorage.setItem(key, value);
  writeCookiePreference(key, value);
}

function readDocumentCookieHeader(): string {
  if (typeof document === "undefined") return "";
  return document.cookie;
}

function readCookiePreference(name: string, header: string): string | null {
  if (!header) return null;
  for (const pair of header.split(";")) {
    const separator = pair.indexOf("=");
    if (separator < 0) continue;
    if (pair.slice(0, separator).trim() !== name) continue;
    // A cookie header is attacker-reachable input and a malformed percent-escape
    // throws out of `decodeURIComponent`. A preference that cannot be decoded is no
    // preference — not an exception thrown while rendering the shell.
    try {
      return decodeURIComponent(pair.slice(separator + 1).trim());
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * `SameSite=Lax`, and `Secure` follows the page's own protocol.
 *
 * `Lax` keeps the cookie off cross-site subrequests. `Secure` is set whenever the
 * page itself was served over HTTPS — "never set it, because the plain-HTTP local
 * service would drop it" was a false choice between the two hosts: on HTTPS an
 * unmarked preference cookie can be read and rewritten by an on-path attacker,
 * and rewriting the locale rewrites a server-side render branch. Conditioning on
 * the protocol serves both hosts, and deliberately not `HttpOnly`: the client
 * half of this store is read from `document.cookie` by design.
 */
function writeCookiePreference(name: string, value: string) {
  if (typeof document === "undefined") return;
  const secure =
    typeof location !== "undefined" && location.protocol === "https:" ? "; secure" : "";
  document.cookie =
    `${name}=${encodeURIComponent(value)}; path=/; max-age=${preferenceCookieMaxAgeSeconds}; samesite=lax${secure}`;
}

interface PaginationLabels {
  previous: string;
  next: string;
  range: (shown: number, total: number) => ReactNode;
}

const paginationLabels: Record<TcrnLocale, PaginationLabels> = {
  "zh-CN": {
    previous: "上一页",
    next: "下一页",
    range: (shown, total) => <>显示 <b>{shown}</b> 条，共 <b>{total}</b> 条</>,
  },
  en: {
    previous: "Previous",
    next: "Next",
    range: (shown, total) => <>Showing <b>{shown}</b> of <b>{total}</b></>,
  },
  ja: {
    previous: "前へ",
    next: "次へ",
    range: (shown, total) => <><b>{total}</b> 件中 <b>{shown}</b> 件を表示</>,
  },
  ko: {
    previous: "이전",
    next: "다음",
    range: (shown, total) => <><b>{total}</b>개 중 <b>{shown}</b>개 표시</>,
  },
  fr: {
    previous: "Précédent",
    next: "Suivant",
    range: (shown, total) => <><b>{shown}</b> sur <b>{total}</b></>,
  },
};

export interface PaginationProps {
  label: string;
  shown?: number;
  total?: number;
  nextHref?: string;
  prevHref?: string;
  locale?: TcrnLocale | string;
}

export function Pagination({ label, shown, total, nextHref, prevHref, locale }: PaginationProps) {
  // A missing count is not a count of zero. Without product data the component must not
  // manufacture a range, and a complete page must not leave an inert navigation landmark.
  if (typeof shown !== "number" || typeof total !== "number" || shown >= total) return null;

  const copy = paginationLabels[resolveDocumentLocale(locale)];
  return (
    <nav className="tcrn-pagination" aria-label={label}>
      <span className="tcrn-pagination__range">{copy.range(shown, total)}</span>
      {prevHref ? <a className="tcrn-link tcrn-pagination__prev" href={prevHref}>{copy.previous}</a> : null}
      {nextHref ? <a className="tcrn-link tcrn-pagination__next" href={nextHref}>{copy.next}</a> : null}
    </nav>
  );
}

// The component stylesheet is composed in ../../styles/: one module per family, joined in
// cascade order by styles/index.ts. It is re-exported here so the public export and every
// existing import of it from this module keep working.
export { tcrnComponentCss, tcrnRetiredComponentCss } from "../../styles/index.js";
