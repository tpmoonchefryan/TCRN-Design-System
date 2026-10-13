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
      {asset.markId ? (
        <TcrnBrandMark productId={asset.markId} variant={markVariant} alt={markAlt} />
      ) : (
        <TcrnBrandMark src={brandMarkSrc} alt={markAlt} />
      )}
      <span className="tcrn-product-logo__copy" aria-hidden="true">
        <span className="tcrn-product-logo__line-one" aria-label={asset.lineOne}>
          <span className="tcrn-product-logo__line-one-base">{asset.lineOneBase}</span>
          {asset.lineOneSuffix ? (
            <span className={cx("tcrn-product-logo__line-one-suffix", asset.suffixClassName ?? undefined)}>{asset.lineOneSuffix}</span>
          ) : null}
        </span>
        <span className="tcrn-product-logo__line-two">{tagline}</span>
        {asset.byline ? <span className="tcrn-product-logo__byline">{asset.byline}</span> : null}
      </span>
    </div>
  );
}

export interface ProductLockupProps extends HTMLAttributes<HTMLDivElement> {
  suffix?: string;
  suffixClassName?: string;
  brandMarkSrc?: string;
  brandMarkAlt?: string;
  productId?: TcrnProductLogoId;
  /** Passed to `ProductLogo` when `productId` is given; ignored otherwise. */
  markVariant?: TcrnProductMarkVariant;
  /** Passed to `ProductLogo` when `productId` is given; ignored otherwise. */
  locale?: string;
}

export function ProductLockup({ suffix, suffixClassName, brandMarkSrc, brandMarkAlt, productId, markVariant, locale, className, ...props }: ProductLockupProps) {
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

export interface ShellBrandLockupProps extends ProductLockupProps {
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

export function ProductLauncher({ items, locale }: ProductLauncherProps) {
  return (
    <nav className="tcrn-product-launcher" aria-label={chromeLabels(locale).productLauncher}>
      <LauncherItems items={items} />
    </nav>
  );
}

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
  items: BreadcrumbItem[];
  /** Accessible name for the trail. Omit it and the reader's language is used. */
  label?: string;
  /** Which language the built-in label is said in; defaults to the page's own. */
  locale?: TcrnLocale | string;
}

/**
 * The ancestor trail, and the product's way back.
 *
 * Every crumb used to render as an inert `<span>`, which made the component
 * decorative: it told you where you were and offered no way to leave. A
 * consumer reported that the only way back from a drilled-down page was the
 * browser's own back button — true of every page in their product, because this
 * was the component they were using for the job.
 *
 * A crumb with an `href` is now a link. The current page is still inert, which
 * is the point: `aria-current="page"` plus no link is what tells a screen-reader
 * user which end of the trail they are standing on.
 */
export function Breadcrumb({ items, label, locale }: BreadcrumbProps) {
  return (
    <nav className="tcrn-breadcrumb" aria-label={label ?? chromeLabels(locale).breadcrumb}>
      {items.map((item, index) => (
        <span key={item.id} className="tcrn-breadcrumb__item">
          {index > 0 ? <Icon name="chevron-right" className="tcrn-breadcrumb__separator" /> : null}
          {item.href && !item.selected ? (
            <a href={item.href}>{item.label}</a>
          ) : (
            <span aria-current={item.selected ? "page" : undefined}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/**
 * The ARIA tab pattern, with the keyboard behaviour that makes it one.
 *
 * This repository already had three tab-shaped components — ModuleTabs,
 * SectionTabs, SegmentedNav — and none of them is this. They render buttons with
 * `aria-current`, which is correct for navigation that changes the page. A tab
 * does not change the page: it swaps a panel, and the contract for that is
 * `role="tablist"` / `role="tab"` / `role="tabpanel"` plus `aria-controls` and
 * `aria-selected`. Announcing "2 of 4 selected" instead of "link, current page"
 * is the whole difference to a screen reader.
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
    <div className="tcrn-tabs" data-tabs="true">
      <div className="tcrn-tabs__list" role="tablist" aria-label={label} onKeyDown={onKeyDown}>
        {items.map((item) => {
          const selected = item.id === selectedId;
          return (
            <button key={item.id} type="button"
              id={`tcrn-tab-${item.id}`}
              role="tab"
              className={cx("tcrn-tabs__tab", selected && "tcrn-tabs__tab--selected")}
              aria-selected={selected}
              aria-controls={`tcrn-tabpanel-${item.id}`}
              disabled={item.disabled}
              tabIndex={selected ? 0 : -1}
              onClick={() => onSelect(item.id)}
            >
              {item.label}
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

export function ModuleTabs({ items, locale, label, onSelect }: SelectableNavProps) {
  return <TabList items={items} locale={locale} label={label} onSelect={onSelect} className="tcrn-module-tabs" />;
}

export function SectionTabs({ items, locale, label, onSelect }: SelectableNavProps) {
  return <TabList items={items} locale={locale} label={label} onSelect={onSelect} className="tcrn-section-tabs" />;
}

export function SegmentedNav({ items, locale, label, onSelect }: SelectableNavProps) {
  return <TabList items={items} locale={locale} label={label} onSelect={onSelect} className="tcrn-segmented-nav" />;
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

function TabList({ items, locale, className, label, onSelect }: SelectableNavProps & { className: string }) {
  const chrome = chromeLabels(locale);
  return (
    <nav className={className} aria-label={label ?? (className === "tcrn-module-tabs" ? chrome.moduleSections : chrome.sectionNavigation)} data-tab-semantics="segmented-navigation">
      {items.map((item) => (
        <button key={item.id} type="button"
          aria-current={item.selected ? "page" : undefined}
          data-selected={item.selected ? "true" : undefined}
          onClick={onSelect ? () => onSelect(item.id) : undefined}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}

export interface SideNavProps extends HTMLAttributes<HTMLElement> {
  label: string;
  children: ReactNode;
}

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
        <div className="tcrn-nav-group__label">{label}</div>
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
        <span className="tcrn-nav-item__label">{children}</span>
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
        hidden={!isExpanded || !hasResults}
      >
        {hasResults ? results.map((result) => (
          <a key={result.id}
            className="tcrn-product-shell-search__result"
            href={result.href}
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
          <span className="tcrn-product-shell-search__empty">{resolvedEmptyLabel}</span>
        )}
      </div>
    </div>
  );
}

export interface ProductShellNavItem {
  id: string;
  label: string;
  labelKey?: string;
  href: string;
  iconName?: IconName;
  selected?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  depth?: number;
}

export interface ProductShellNavGroup {
  id: string;
  label: string;
  labelKey?: string;
  description?: string;
  descriptionKey?: string;
  sectionLabel?: string;
  sectionLabelKey?: string;
  selected?: boolean;
  items: readonly ProductShellNavItem[];
}

export interface ProductShellProps extends HTMLAttributes<HTMLDivElement> {
  productName: string;
  moduleName: string;
  brandProductId?: TcrnProductLogoId;
  brandHref?: string;
  brandSuffix?: string;
  brandCaption?: string;
  brandMarkSrc?: string;
  brandMarkAlt?: string;
  currentRouteLabel: string;
  currentRouteLabelKey?: string;
  currentLocationLabel?: string;
  currentLocationLabelKey?: string;
  navLabel: string;
  navGroups: readonly ProductShellNavGroup[];
  locales: readonly ShellLocaleOption[];
  currentLocale: string;
  children: ReactNode;
  collapsed?: boolean;
  collapsedStorageKey?: string;
  currentTheme?: ShellThemeMode;
  localeMenuOpen?: boolean;
  search?: ProductShellSearchProps;
  /**
   * Product-owned controls for the shell's utility row, rendered between the
   * search field and the shell's own theme and locale utilities.
   *
   * The shell composes its utility row itself, so a product that needs a control
   * there — a workspace switcher, a data-freshness indicator — previously had
   * nowhere to put it and had to push it into page content, where it scrolls away
   * and repeats on every route. Shell utilities stay rightmost so their position
   * does not move as products add controls.
   *
   * Purely additive: omitting it renders the utility row exactly as before.
   */
  headerActions?: ReactNode;
  sideNavCollapseDisabledReason?: string;
  /**
   * Whether the navigation is showing, below the mobile breakpoint.
   *
   * Deliberately NOT `collapsed`. That one narrows the desktop rail, is
   * persisted, and is serialized into product links — reusing it here would let
   * a phone tap rewrite a desktop preference and carry it across routes. This
   * is a transient view state: it starts closed on every mobile page load,
   * which is also why the closed state is the CSS default and needs no
   * client-side media query to arrive at (a server render would otherwise emit
   * the open nav and collapse it after hydration, which is the flash this
   * platform has already paid for once).
   */
  mobileNavExpanded?: boolean;
  onMobileNavExpandedChange?: (expanded: boolean) => void;
  onCollapsedChange?: (collapsed: boolean) => void;
  onThemeChange?: (theme: ShellThemeMode) => void;
  onLocaleMenuOpenChange?: (open: boolean, reason: ProductShellLocaleMenuChangeReason) => void;
  onLocaleChange?: (locale: string) => void;
  onSearchQueryChange?: (query: string) => void;
  onSearchExpandedChange?: (expanded: boolean, reason: ProductShellSearchExpandedChangeReason) => void;
  onSearchDismiss?: (reason: ProductShellSearchDismissReason) => void;
  onSearchResultActivate?: (result: ProductShellSearchResult, event: ReactMouseEvent<HTMLAnchorElement>) => void;
  contentId?: string;
  contentRole?: "main" | "region";
  contentLabel?: string;
  navId?: string;
  skipLinkLabel?: string;
}

export function ProductShell({
  productName,
  moduleName,
  brandProductId,
  brandHref = "/",
  brandSuffix,
  brandCaption,
  brandMarkSrc,
  brandMarkAlt,
  currentRouteLabel,
  currentRouteLabelKey,
  currentLocationLabel,
  currentLocationLabelKey,
  navLabel,
  navGroups,
  locales,
  currentLocale,
  children,
  collapsed = false,
  collapsedStorageKey,
  currentTheme = "light",
  localeMenuOpen = false,
  search,
  headerActions,
  sideNavCollapseDisabledReason,
  mobileNavExpanded = false,
  onMobileNavExpandedChange,
  onCollapsedChange,
  onThemeChange,
  onLocaleMenuOpenChange,
  onLocaleChange,
  onSearchQueryChange,
  onSearchExpandedChange,
  onSearchDismiss,
  onSearchResultActivate,
  contentId = "product-shell-content",
  contentRole = "region",
  contentLabel,
  navId = "tcrn-product-shell-side-nav",
  skipLinkLabel,
  className,
  ...props
}: ProductShellProps) {
  const ContentElement = contentRole === "main" ? "main" : "section";
  // Like `ShellLocaleMenu`, this needs no `locale` prop: `currentLocale` is
  // required here, so the shell already knows the reader's language and a second
  // way to say it could only disagree with the first.
  //
  // The skip link is the load-bearing one. It is the first thing a keyboard user
  // reaches on any page in the product, and it was in English on every localized
  // route of every consumer.
  const chrome = chromeLabels(currentLocale);
  const resolvedCurrentLocationLabel = currentLocationLabel ?? chrome.currentLocation;
  const resolvedContentLabel = contentLabel ?? chrome.shellWorkspace;
  const resolvedSkipLinkLabel = skipLinkLabel ?? chrome.skipToContent;
  const mergedSearch: ProductShellSearchProps | undefined = search
    ? {
        ...search,
        onQueryChange: (nextQuery) => {
          search.onQueryChange?.(nextQuery);
          onSearchQueryChange?.(nextQuery);
        },
        onExpandedChange: (nextExpanded, reason) => {
          search.onExpandedChange?.(nextExpanded, reason);
          onSearchExpandedChange?.(nextExpanded, reason);
        },
        onDismiss: (reason) => {
          search.onDismiss?.(reason);
          onSearchDismiss?.(reason);
        },
        onResultActivate: (result, event) => {
          search.onResultActivate?.(result, event);
          onSearchResultActivate?.(result, event);
        }
      }
    : undefined;

  return (
    <div
      {...props}
      className={cx("tcrn-product-shell", className)}
      data-package-backed-product-shell-boundary="side-nav-shell-v1"
      data-product-shell-pattern="attached-side-nav"
      data-product-shell-collapsed={collapsed ? "true" : "false"}
      data-side-nav-collapsed={collapsed ? "true" : "false"}
      data-product-shell-theme={currentTheme}
      data-product-shell-responsive="desktop-attached-mobile-stacked"
      data-product-shell-effect-boundary="ds-owned-tokens-motion-focus"
      data-product-shell-consumer-scope="ia-data-route-labels-content-callbacks"
      data-product-shell-semantic-api={mergedSearch ? "collapse-theme-locale-search" : "collapse-theme-locale"}
      data-product-shell-header-actions={headerActions ? "present" : "absent"}
      data-mobile-nav-expanded={mobileNavExpanded ? "true" : "false"}
    >
      <SkipLink href={`#${contentId}`}>{resolvedSkipLinkLabel}</SkipLink>
      <aside className="tcrn-product-shell__sidebar" data-product-shell-region="side-navigation">
        <div className="tcrn-product-shell__sidebar-header">
          <a
            className="tcrn-product-shell__brand"
            href={brandHref}
            // Composed per locale: the product name is the consumer's own, so
            // welding " home" onto it produces a link name in neither language.
            aria-label={chrome.brandHomeOf(productName)}
            data-registered-brand-lockup="@tcrn/ui-react/ShellBrandLockup"
            data-registered-product-logo="@tcrn/ui-react/ProductLogo"
          >
            <ShellBrandLockup
              productId={brandProductId}
              // The shell already knows the reader's locale for its own utility
              // row; the brand block was the one part of it still resolved
              // without that knowledge.
              locale={currentLocale}
              suffix={brandSuffix}
              caption={brandCaption}
              brandMarkSrc={brandMarkSrc}
              brandMarkAlt={brandMarkAlt}
              data-visible-registered-brand-lockup="true"
            />
          </a>
          <SideNavCollapseButton
            collapsed={collapsed}
            controls={navId}
            locale={currentLocale}
            disabledReason={sideNavCollapseDisabledReason}
            persistedKey={collapsedStorageKey}
            onCollapsedChange={onCollapsedChange}
          />
          <MobileNavToggle
            expanded={mobileNavExpanded}
            controls={navId}
            locale={currentLocale}
            onExpandedChange={onMobileNavExpandedChange}
          />
        </div>
          <SideNav id={navId} label={navLabel} data-registered-navigation-only="true">
            {navGroups.map((group) => (
              <NavGroup key={group.id}
                label={group.label}
                selected={group.selected}
                title={group.description}
                data-storybook-category-id={group.id}
                data-storybook-category-label={group.label}
                data-storybook-category-description={group.description}
                data-storybook-section-label={group.sectionLabel}
                data-product-shell-nav-group-label-key={group.labelKey}
                data-product-shell-nav-group-description-key={group.descriptionKey}
                data-product-shell-nav-group-section-label-key={group.sectionLabelKey}
              >
                {group.items.map((item) => (
                  <NavItem key={item.id}
                    href={item.href}
                    iconName={item.iconName}
                    selected={item.selected}
                    disabled={item.disabled}
                    disabledReason={item.disabledReason}
                    depth={item.depth}
                    locale={currentLocale}
                    data-product-shell-route={item.id}
                    data-product-shell-route-label-key={item.labelKey}
                  >
                    {item.label}
                  </NavItem>
                ))}
              </NavGroup>
            ))}
          </SideNav>
      </aside>
      <div className="tcrn-product-shell__workspace">
        {/* Composed per locale, for the same reason as the brand link above. */}
        <header className="tcrn-top-bar" aria-label={chrome.shellControlsOf(moduleName)} data-product-shell-region="topbar">
          <div className="tcrn-product-shell__utility-row" data-product-shell-region="utility-row">
            <div
              className="tcrn-product-shell__current-location"
              data-product-shell-current-location-label-key={currentLocationLabelKey}
              data-product-shell-current-route-label-key={currentRouteLabelKey}
            >
              <span>{resolvedCurrentLocationLabel}</span>
              <strong>{currentRouteLabel}</strong>
            </div>
            {/* `locale` forwarded, and placed before the spread so a consumer who
                sets it on `search` still wins. Omitting it is the nested-locale
                bug: the search field would resolve against the document while the
                shell around it resolves against `currentLocale`. */}
            {mergedSearch ? <ProductShellSearch locale={currentLocale} {...mergedSearch} /> : null}
            {headerActions ? (
              <div
                className="tcrn-product-shell__header-actions"
                data-product-shell-region="header-actions"
              >
                {headerActions}
              </div>
            ) : null}
            <ShellThemeToggle currentTheme={currentTheme} locale={currentLocale} onThemeChange={onThemeChange} />
            <ShellLocaleMenu
              locales={locales}
              currentLocale={currentLocale}
              open={localeMenuOpen}
              onOpenChange={onLocaleMenuOpenChange}
              onLocaleChange={onLocaleChange}
            />
          </div>
        </header>
        <ContentElement
          id={contentId}
          className="tcrn-product-shell__main"
          data-product-shell-region="content"
          aria-label={resolvedContentLabel}
        >
          {children}
        </ContentElement>
      </div>
    </div>
  );
}

/**
 * The three preferences a request may carry, already parsed and narrowed.
 *
 * Each field is either a value in its own domain or absent. Absent means "the
 * request did not state this preference", so the controller's `initial*` fallback
 * stands — which is why garbage narrows to `undefined` here rather than to a
 * default: a cookie that cannot be trusted must not outrank the product's own
 * fallback.
 */
export interface ProductShellRequestPreferences {
  collapsed?: boolean | undefined;
  theme?: ShellThemeMode | undefined;
  locale?: TcrnLocale | undefined;
}

export interface ProductShellControllerConfig {
  initialCollapsed?: boolean;
  initialTheme?: ShellThemeMode;
  initialLocale?: string;
  navId?: string;
  collapsedStorageKey?: string;
  themeStorageKey?: string;
  localeStorageKey?: string;
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
   * all it may hold is three display preferences. `readPreferenceCookieValues`
   * does the narrowing on the consumer's server, so what crosses the package
   * boundary is exactly the three values this controller governs.
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
  onCollapsedChange?: (collapsed: boolean) => void;
  onThemeChange?: (theme: ShellThemeMode) => void;
  onLocaleMenuOpenChange?: (open: boolean, reason: ProductShellLocaleMenuChangeReason) => void;
  onLocaleChange?: (locale: string) => void;
  onSearchQueryChange?: (query: string) => void;
  onSearchExpandedChange?: (expanded: boolean, reason: ProductShellSearchExpandedChangeReason) => void;
  onSearchDismiss?: (reason: ProductShellSearchDismissReason) => void;
  onSearchResultActivate?: (result: ProductShellSearchResult, event: ReactMouseEvent<HTMLAnchorElement>) => void;
}

export function useProductShellController({
  initialCollapsed = false,
  initialTheme = "light",
  initialLocale = "en",
  navId = "tcrn-product-shell-side-nav",
  collapsedStorageKey,
  themeStorageKey,
  localeStorageKey,
  requestPreferences,
  searchRecords = [],
  searchLimit = 8,
  onCollapsedChange,
  onThemeChange,
  onLocaleMenuOpenChange,
  onLocaleChange,
  onSearchQueryChange,
  onSearchExpandedChange,
  onSearchDismiss,
  onSearchResultActivate
}: ProductShellControllerConfig = {}) {
  const [collapsed, setCollapsedState] = useState(
    () => readStoredBoolean(collapsedStorageKey, initialCollapsed, requestPreferences?.collapsed));
  const [theme, setThemeState] = useState<ShellThemeMode>(
    () => readStoredTheme(themeStorageKey, initialTheme, requestPreferences?.theme));
  const [locale, setLocaleState] = useState(
    () => readStoredLocale(localeStorageKey, initialLocale, requestPreferences?.locale));
  const [localeMenuOpen, setLocaleMenuOpenState] = useState(false);
  // Transient by construction: no storage key, no initial* input, no cookie.
  // Every mobile page load starts with the navigation put away, which is what
  // lets the closed state be the CSS default and the server render be correct
  // before any script runs.
  const [mobileNavExpanded, setMobileNavExpandedState] = useState(false);
  const [searchQuery, setSearchQueryState] = useState("");
  const [searchExpanded, setSearchExpandedState] = useState(false);

  const setCollapsed = useCallback((nextCollapsed: boolean) => {
    setCollapsedState(nextCollapsed);
    writeStoredBoolean(collapsedStorageKey, nextCollapsed);
    onCollapsedChange?.(nextCollapsed);
  }, [collapsedStorageKey, onCollapsedChange]);

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

  const searchResults = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return [];
    return searchRecords
      .filter((record) => `${record.title} ${record.meta ?? ""}`.toLowerCase().includes(normalizedQuery))
      .slice(0, searchLimit);
  }, [searchLimit, searchQuery, searchRecords]);

  const toggleCollapsed = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed, setCollapsed]);

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

  const sideNavCollapseButtonProps = {
    collapsed,
    controls: navId,
    persistedKey: collapsedStorageKey,
    onCollapsedChange: setCollapsed
  };

  const productShellControlProps = {
    collapsed,
    collapsedStorageKey,
    currentTheme: theme,
    currentLocale: locale,
    localeMenuOpen,
    mobileNavExpanded,
    navId,
    onMobileNavExpandedChange: setMobileNavExpandedState,
    onCollapsedChange: setCollapsed,
    onThemeChange: setTheme,
    onLocaleMenuOpenChange: setLocaleMenuOpen,
    onLocaleChange: setLocale,
    onSearchQueryChange: setSearchQuery,
    onSearchExpandedChange: setSearchExpanded,
    onSearchDismiss: collapseSearch,
    onSearchResultActivate: handleSearchResultActivate,
    search: productShellSearchProps
  };

  return {
    collapsed,
    setCollapsed,
    toggleCollapsed,
    theme,
    setTheme,
    toggleTheme,
    locale,
    setLocale,
    localeMenuOpen,
    setLocaleMenuOpen,
    openLocaleMenu,
    closeLocaleMenu,
    mobileNavExpanded,
    setMobileNavExpanded: setMobileNavExpandedState,
    searchQuery,
    setSearchQuery,
    searchExpanded,
    setSearchExpanded,
    collapseSearch,
    searchResults,
    sideNavCollapseButtonProps,
    shellThemeToggleProps,
    shellLocaleMenuProps,
    productShellSearchProps,
    productShellControlProps,
    productShellStateProps: {
      collapsed,
      currentTheme: theme,
      currentLocale: locale,
      localeMenuOpen,
      mobileNavExpanded
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

function readStoredBoolean(key: string | undefined, fallback: boolean, requestValue?: boolean): boolean {
  const value = readStoredPreference(key);
  if (value !== null) return value === "true";
  return requestValue ?? fallback;
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
 * theme and collapsed readers each narrow to their own domain (`dark`/`light`,
 * `true`/`false`); this one narrows through the locale contract, so a consumer
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
 * three narrowed values come out, and nothing else crosses into the shell.
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
    collapsedKey?: string | undefined;
    themeKey?: string | undefined;
    localeKey?: string | undefined;
  }
): ProductShellRequestPreferences {
  const header = cookieHeader ?? "";
  const collapsedValue = keys.collapsedKey ? readCookiePreference(keys.collapsedKey, header) : null;
  const themeValue = keys.themeKey ? readCookiePreference(keys.themeKey, header) : null;
  const localeValue = keys.localeKey ? readCookiePreference(keys.localeKey, header) : null;
  return {
    collapsed: collapsedValue === "true" ? true : collapsedValue === "false" ? false : undefined,
    theme: themeValue === "dark" || themeValue === "light" ? themeValue : undefined,
    locale: localeValue !== null && (tcrnSupportedLocales as readonly string[]).includes(localeValue)
      ? (localeValue as TcrnLocale)
      : undefined
  };
}

function writeStoredBoolean(key: string | undefined, value: boolean) {
  writeStoredString(key, String(value));
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
export { tcrnComponentCss } from "../../styles/index.js";
