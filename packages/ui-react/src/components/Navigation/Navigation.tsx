import type {
  AnchorHTMLAttributes,
  FocusEvent,
  FormEvent,
  HTMLAttributes,
  ImgHTMLAttributes,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  ReactNode
} from "react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { IconButton, type IconButtonProps } from "../Button/index.js";
import { SearchInput, type SearchInputProps } from "../Form/index.js";
import { Icon, type IconName } from "../Icon/index.js";
import { cx, mergeIds, requiredText } from "../../utils.js";

export interface NavItem {
  id: string;
  label: string;
  selected?: boolean;
}

export interface TopBarProps {
  productName: string;
  moduleName: string;
  actions?: ReactNode;
}

export function TopBar({ productName, moduleName, actions }: TopBarProps) {
  return (
    <header className="tcrn-top-bar">
      <div className="tcrn-top-bar__brand">{productName}</div>
      <div className="tcrn-top-bar__module">{moduleName}</div>
      <div className="tcrn-top-bar__actions">{actions}</div>
    </header>
  );
}

export interface TcrnBrandMarkProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  src?: string;
  alt?: string;
}

export function TcrnBrandMark({ src = "tcrn-brand-mark.svg", alt = "TCRN brand mark", className, ...props }: TcrnBrandMarkProps) {
  const accessibleName = requiredText(alt, "TCRN brand mark");
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

export const tcrnProductLogoRegistry = {
  "design-system": {
    productId: "design-system",
    assetId: "tcrn-design-system-two-line",
    lineOne: "TCRN Design System",
    lineOneBase: "TCRN",
    lineOneSuffix: "Design System",
    suffixClassName: "tcrn-brand-wordmark__suffix--design-system",
    lineTwo: "Component Library",
    stackSuffix: true,
    alt: "TCRN Design System"
  },
  aos: {
    productId: "aos",
    assetId: "tcrn-aos-two-line",
    lineOne: "TCRN AOS",
    lineOneBase: "TCRN",
    lineOneSuffix: "AOS",
    suffixClassName: "tcrn-brand-wordmark__suffix--aos",
    lineTwo: "AI Operation System",
    stackSuffix: false,
    alt: "TCRN AOS AI Operation System"
  },
  tms: {
    productId: "tms",
    assetId: "tcrn-tms-two-line",
    lineOne: "TCRN TMS",
    lineOneBase: "TCRN",
    lineOneSuffix: "TMS",
    suffixClassName: "tcrn-brand-wordmark__suffix--tms",
    lineTwo: "Talent Management System",
    stackSuffix: false,
    alt: "TCRN TMS Talent Management System"
  }
} as const;

export type TcrnProductLogoId = keyof typeof tcrnProductLogoRegistry;
export type TcrnProductLogoAssetId = (typeof tcrnProductLogoRegistry)[TcrnProductLogoId]["assetId"];

export function getTcrnProductLogoAsset(productId: TcrnProductLogoId) {
  return tcrnProductLogoRegistry[productId];
}

function shouldStackProductSuffix(productSuffix: string) {
  const cjkCount = Array.from(productSuffix).filter((character) => /[\u3400-\u9fff]/u.test(character)).length;
  return productSuffix.length > 8 || productSuffix.includes(" ") || cjkCount >= 4;
}

export interface ProductLogoProps extends HTMLAttributes<HTMLDivElement> {
  productId: TcrnProductLogoId;
  brandMarkSrc?: string;
  brandMarkAlt?: string;
}

export function ProductLogo({
  productId,
  brandMarkSrc = "tcrn-brand-mark.svg",
  brandMarkAlt,
  className,
  ...props
}: ProductLogoProps) {
  const asset = getTcrnProductLogoAsset(productId);

  return (
    <div
      {...props}
      className={cx("tcrn-product-logo", asset.stackSuffix && "tcrn-product-logo--stacked-suffix", className)}
      aria-label={asset.alt}
      data-component-source="@tcrn/ui-react"
      data-registered-product-logo="@tcrn/ui-react/ProductLogo"
      data-product-id={asset.productId}
      data-product-logo-asset-id={asset.assetId}
    >
      <TcrnBrandMark src={brandMarkSrc} alt={brandMarkAlt ?? asset.alt} />
      <span className="tcrn-product-logo__copy" aria-hidden="true">
        <span className="tcrn-product-logo__line-one" aria-label={asset.lineOne}>
          <span className="tcrn-product-logo__line-one-base">{asset.lineOneBase}</span>
          <span className={cx("tcrn-product-logo__line-one-suffix", asset.suffixClassName)}>{asset.lineOneSuffix}</span>
        </span>
        <span className="tcrn-product-logo__line-two">{asset.lineTwo}</span>
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
}

export function ProductLockup({ suffix, suffixClassName, brandMarkSrc, brandMarkAlt, productId, className, ...props }: ProductLockupProps) {
  if (productId) {
    return (
      <ProductLogo
        {...props}
        productId={productId}
        brandMarkSrc={brandMarkSrc}
        brandMarkAlt={brandMarkAlt}
        className={cx("tcrn-brand-lockup", className)}
      />
    );
  }

  const productSuffix = requiredText(suffix, "Product");
  const isLongSuffix = shouldStackProductSuffix(productSuffix);

  return (
    <div
      {...props}
      className={cx("tcrn-brand-lockup", isLongSuffix && "tcrn-brand-lockup--long-name", className)}
      data-component-source="@tcrn/ui-react"
      data-brand-lockup="product"
      data-package-backed-brand-lockup="product"
    >
      <TcrnBrandMark src={brandMarkSrc} alt={brandMarkAlt} />
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

export function ShellBrandLockup({ caption, suffix, suffixClassName, brandMarkSrc, brandMarkAlt, productId, className, ...props }: ShellBrandLockupProps) {
  if (productId) {
    return (
      <ProductLogo
        {...props}
        productId={productId}
        brandMarkSrc={brandMarkSrc}
        brandMarkAlt={brandMarkAlt}
        className={cx("tcrn-shell-brand-lockup", className)}
      />
    );
  }

  return (
    <div
      {...props}
      className={cx("tcrn-shell-brand-lockup", className)}
      data-component-source="@tcrn/ui-react"
      data-brand-lockup="shell"
      data-package-backed-brand-lockup="shell"
    >
      <TcrnBrandMark src={brandMarkSrc} alt={brandMarkAlt} />
      <span className="tcrn-shell-brand-lockup__copy">
        <span className="tcrn-brand-wordmark">
          <span className="tcrn-brand-wordmark__base">TCRN</span>
          <span className={cx("tcrn-brand-wordmark__suffix", suffixClassName)}>{requiredText(suffix, "Product")}</span>
        </span>
        <span className="tcrn-shell-brand-lockup__caption">{requiredText(caption, "Product shell")}</span>
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
  onThemeChange?: (nextTheme: ShellThemeMode) => void;
}

export function ShellThemeToggle({
  currentTheme,
  lightLabel = "Switch to light mode",
  darkLabel = "Switch to dark mode",
  onThemeChange,
  className,
  onClick,
  ...props
}: ShellThemeToggleProps) {
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
      ariaLabel={normalizedTheme === "dark" ? lightLabel : darkLabel}
      title={normalizedTheme === "dark" ? lightLabel : darkLabel}
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
  label = "Language",
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
        aria-label={label}
        title={label}
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
  disabledReason?: string;
  persistedKey?: string;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function SideNavCollapseButton({
  collapsed,
  controls,
  expandedLabel = "Collapse side navigation",
  collapsedLabel = "Expand side navigation",
  disabledReason,
  persistedKey,
  onCollapsedChange,
  className,
  onClick,
  onKeyDown,
  ...props
}: SideNavCollapseButtonProps) {
  const disabled = props.disabled ?? Boolean(disabledReason);
  const label = disabledReason ?? (collapsed ? collapsedLabel : expandedLabel);
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

export interface ProductLauncherProps {
  items: NavItem[];
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

export function ProductLauncher({ items }: ProductLauncherProps) {
  return (
    <nav className="tcrn-product-launcher" aria-label="Product launcher">
      <LauncherItems items={items} />
    </nav>
  );
}

export function ProductSwitcher({ items }: ProductLauncherProps) {
  return (
    <nav className="tcrn-product-switcher" aria-label="Product switcher">
      <LauncherItems items={items} />
    </nav>
  );
}

export function Breadcrumb({ items }: ProductLauncherProps) {
  return (
    <nav className="tcrn-breadcrumb" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={item.id} className="tcrn-breadcrumb__item">
          {index > 0 ? <Icon name="chevron-right" className="tcrn-breadcrumb__separator" /> : null}
          <span aria-current={item.selected ? "page" : undefined}>{item.label}</span>
        </span>
      ))}
    </nav>
  );
}

export function ModuleTabs({ items }: ProductLauncherProps) {
  return <TabList items={items} className="tcrn-module-tabs" />;
}

export function SectionTabs({ items }: ProductLauncherProps) {
  return <TabList items={items} className="tcrn-section-tabs" />;
}

export function SegmentedNav({ items }: ProductLauncherProps) {
  return <TabList items={items} className="tcrn-segmented-nav" />;
}

function TabList({ items, className }: ProductLauncherProps & { className: string }) {
  return (
    <nav className={className} aria-label={className === "tcrn-module-tabs" ? "Module sections" : "Section navigation"} data-tab-semantics="segmented-navigation">
      {items.map((item) => (
        <button key={item.id} type="button" aria-current={item.selected ? "page" : undefined} data-selected={item.selected ? "true" : undefined}>
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

export interface NavGroupProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  selected?: boolean;
  children: ReactNode;
}

export function NavGroup({ label, selected = false, className, children, ...props }: NavGroupProps) {
  return (
    <div
      {...props}
      className={cx("tcrn-nav-group", className)}
      data-selected={selected ? "true" : undefined}
      data-navigation-primitive="nav-group"
    >
      <div className="tcrn-nav-group__label">{label}</div>
      <div className="tcrn-nav-group__items">{children}</div>
    </div>
  );
}

export interface NavItemProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> {
  selected?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  iconName?: IconName;
  children: ReactNode;
}

export function NavItem({ selected = false, disabled = false, disabledReason, iconName, className, children, href = "#", ...props }: NavItemProps) {
  const normalizedReason = disabled ? requiredText(disabledReason, "Navigation item unavailable in this route") : undefined;
  const disabledReasonId = useId();
  const ariaDescribedBy = mergeIds(props["aria-describedby"], normalizedReason ? disabledReasonId : undefined);
  return (
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
      data-navigation-primitive="nav-item"
      data-nav-item-has-icon={iconName ? "true" : "false"}
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
  label = "Search product shell",
  placeholder = "Search",
  shortcut = "auto",
  query = "",
  expanded = false,
  results = [],
  resultsLabel = "Search results",
  emptyLabel = "No results",
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
        aria-label={label}
        aria-controls={resultsId}
        aria-expanded={isExpanded ? "true" : "false"}
        aria-haspopup="listbox"
        aria-autocomplete="list"
        placeholder={placeholder}
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
        aria-label={resultsLabel}
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
          <span className="tcrn-product-shell-search__empty">{emptyLabel}</span>
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
  sideNavCollapseDisabledReason?: string;
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
  currentLocationLabel = "Current location",
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
  sideNavCollapseDisabledReason,
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
  contentLabel = "Product shell workspace",
  navId = "tcrn-product-shell-side-nav",
  skipLinkLabel = "Skip to shell content",
  className,
  ...props
}: ProductShellProps) {
  const ContentElement = contentRole === "main" ? "main" : "section";
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
    >
      <SkipLink href={`#${contentId}`}>{skipLinkLabel}</SkipLink>
      <aside className="tcrn-product-shell__sidebar" data-product-shell-region="side-navigation">
        <div className="tcrn-product-shell__sidebar-header">
          <a
            className="tcrn-product-shell__brand"
            href={brandHref}
            aria-label={`${productName} home`}
            data-registered-brand-lockup="@tcrn/ui-react/ShellBrandLockup"
            data-registered-product-logo="@tcrn/ui-react/ProductLogo"
          >
            <ShellBrandLockup
              productId={brandProductId}
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
            disabledReason={sideNavCollapseDisabledReason}
            persistedKey={collapsedStorageKey}
            onCollapsedChange={onCollapsedChange}
          />
        </div>
          <SideNav id={navId} label={navLabel} className="tcrn-product-shell__nav" data-registered-navigation-only="true">
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
        <header className="tcrn-top-bar" aria-label={`${moduleName} shell controls`} data-product-shell-region="topbar">
          <div className="tcrn-product-shell__utility-row" data-product-shell-region="utility-row">
            <div
              className="tcrn-product-shell__current-location"
              data-product-shell-current-location-label-key={currentLocationLabelKey}
              data-product-shell-current-route-label-key={currentRouteLabelKey}
            >
              <span>{currentLocationLabel}</span>
              <strong>{currentRouteLabel}</strong>
            </div>
            {mergedSearch ? <ProductShellSearch {...mergedSearch} /> : null}
            <ShellThemeToggle currentTheme={currentTheme} onThemeChange={onThemeChange} />
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
          aria-label={contentLabel}
        >
          {children}
        </ContentElement>
      </div>
    </div>
  );
}

export interface ProductShellControllerConfig {
  initialCollapsed?: boolean;
  initialTheme?: ShellThemeMode;
  initialLocale?: string;
  navId?: string;
  collapsedStorageKey?: string;
  themeStorageKey?: string;
  localeStorageKey?: string;
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
  const [collapsed, setCollapsedState] = useState(() => readStoredBoolean(collapsedStorageKey, initialCollapsed));
  const [theme, setThemeState] = useState<ShellThemeMode>(() => readStoredTheme(themeStorageKey, initialTheme));
  const [locale, setLocaleState] = useState(() => readStoredString(localeStorageKey, initialLocale));
  const [localeMenuOpen, setLocaleMenuOpenState] = useState(false);
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

  const setLocale = useCallback((nextLocale: string) => {
    setLocaleState(nextLocale);
    writeStoredString(localeStorageKey, nextLocale);
    onLocaleChange?.(nextLocale);
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
    navId,
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
      localeMenuOpen
    }
  };
}

function readStoredBoolean(key: string | undefined, fallback: boolean): boolean {
  if (!key || typeof window === "undefined") return fallback;
  const value = window.localStorage.getItem(key);
  return value === null ? fallback : value === "true";
}

function readStoredTheme(key: string | undefined, fallback: ShellThemeMode): ShellThemeMode {
  const value = readStoredString(key, fallback);
  return value === "dark" ? "dark" : "light";
}

function readStoredString(key: string | undefined, fallback: string): string {
  if (!key || typeof window === "undefined") return fallback;
  return window.localStorage.getItem(key) ?? fallback;
}

function writeStoredBoolean(key: string | undefined, value: boolean) {
  writeStoredString(key, String(value));
}

function writeStoredString(key: string | undefined, value: string) {
  if (!key || typeof window === "undefined") return;
  window.localStorage.setItem(key, value);
}

export function Pagination({ label }: { label: string }) {
  return <nav className="tcrn-pagination" aria-label={label} />;
}

export const tcrnComponentCss = `
:root {
  --tcrn-radius-panel: var(--tcrn-radius-surface);
  --tcrn-motion-product-shell: var(--tcrn-motion-emphasis);
  --tcrn-motion-product-shell-search: 240ms var(--tcrn-motion-ease-drawer);
  --tcrn-color-brand-secondary-readable: #246f80;
  --tcrn-brand-accent-aos: #187c7c;
  --tcrn-brand-accent-tms: #2c63c8;
  --tcrn-brand-accent-design-system-1: #6577f3;
  --tcrn-brand-accent-design-system-2: #3096f4;
  --tcrn-brand-accent-design-system-3: #43d4cf;
  --tcrn-brand-accent-design-system-4: #78b957;
}
[data-tcrn-theme="dark"] {
  --tcrn-color-brand-secondary-readable: #a6e8ef;
  --tcrn-brand-accent-aos: #69d6d0;
  --tcrn-brand-accent-tms: #9bb8ff;
  --tcrn-brand-accent-design-system-1: #aeb8ff;
  --tcrn-brand-accent-design-system-2: #83c8ff;
  --tcrn-brand-accent-design-system-3: #7ce4df;
  --tcrn-brand-accent-design-system-4: #c9f08f;
}
.tcrn-button,
.tcrn-shell-locale-menu__trigger,
.tcrn-shell-locale-menu__option {
  font: inherit;
}
.tcrn-button,
.tcrn-link-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--tcrn-space-2);
  min-height: 38px;
  padding: 0 var(--tcrn-space-3);
  border: 1px solid var(--tcrn-color-border-control);
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-color-surface-panel);
  color: var(--tcrn-color-text-primary);
  font-size: var(--tcrn-type-size-ui);
  font-weight: var(--tcrn-type-weight-strong);
  transition: transform var(--tcrn-motion-instant), background-color var(--tcrn-motion-fast), border-color var(--tcrn-motion-fast), color var(--tcrn-motion-fast);
}
/* A pressable surface has to answer the press, or the interface reads as not
   listening. Scale is deliberately subtle and lives on :active (not :hover), so it
   works the same under a finger as under a pointer. */
.tcrn-button:active {
  transform: scale(var(--tcrn-motion-press-scale));
}
.tcrn-button--primary {
  background: var(--tcrn-color-brand-primary);
  border-color: var(--tcrn-color-brand-primary);
  color: var(--tcrn-color-text-inverse);
}
[data-tcrn-theme="dark"] .tcrn-button--primary {
  color: var(--tcrn-color-surface-canvas);
}
.tcrn-button--quiet {
  border-color: transparent;
  background: transparent;
}
.tcrn-button--danger {
  border-color: var(--tcrn-color-state-blocked);
  color: var(--tcrn-color-state-blocked);
}
.tcrn-button[disabled],
.tcrn-nav-item[aria-disabled="true"] {
  cursor: not-allowed;
  opacity: 0.64;
}
.tcrn-icon-button {
  inline-size: 38px;
  block-size: 38px;
  padding: 0;
}
.tcrn-shell-theme-toggle,
.tcrn-button.tcrn-shell-theme-toggle {
  position: relative;
  inline-size: 36px;
  block-size: 36px;
  min-inline-size: 36px;
  min-block-size: 36px;
  min-height: 36px;
  padding: 0;
  overflow: hidden;
  border-radius: var(--tcrn-radius-pill);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
  transition:
    background-color var(--tcrn-motion-standard),
    border-color var(--tcrn-motion-standard),
    color var(--tcrn-motion-standard),
    box-shadow var(--tcrn-motion-standard);
}
.tcrn-shell-side-nav-toggle {
  transition:
    background-color var(--tcrn-motion-standard),
    border-color var(--tcrn-motion-standard),
    color var(--tcrn-motion-standard),
    box-shadow var(--tcrn-motion-standard);
}
.tcrn-shell-theme-toggle:hover,
.tcrn-shell-side-nav-toggle:hover,
.tcrn-shell-locale-menu__trigger:hover,
.tcrn-shell-locale-menu__trigger[aria-expanded="true"] {
  border-color: var(--tcrn-color-border-control);
  background: color-mix(in srgb, var(--tcrn-color-surface-muted) 72%, var(--tcrn-color-surface-panel));
  color: var(--tcrn-color-text-primary);
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.12);
}
.tcrn-product-shell .tcrn-shell-theme-toggle:focus-visible,
.tcrn-product-shell .tcrn-shell-side-nav-toggle:focus-visible,
.tcrn-product-shell .tcrn-shell-locale-menu__trigger:focus-visible,
.tcrn-product-shell .tcrn-search-input:focus-within {
  box-shadow: none;
}
.tcrn-product-shell .tcrn-search-input:focus-within {
  outline: 3px solid var(--tcrn-color-focus-ring);
  outline-offset: 2px;
}
.tcrn-product-shell .tcrn-search-input__control:focus,
.tcrn-product-shell .tcrn-search-input__control:focus-visible {
  outline-style: none;
  outline-width: 0;
  outline-offset: 0;
  box-shadow: none;
}
.tcrn-shell-theme-toggle__icon {
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.58) rotate(-90deg);
  transition:
    opacity var(--tcrn-motion-emphasis),
    transform var(--tcrn-motion-emphasis);
}
.tcrn-shell-theme-toggle[data-current-theme="light"] .tcrn-shell-theme-toggle__icon[data-theme-icon="light"],
.tcrn-shell-theme-toggle[data-current-theme="dark"] .tcrn-shell-theme-toggle__icon[data-theme-icon="dark"] {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1) rotate(0deg);
}
.tcrn-shell-theme-toggle[data-current-theme="light"] .tcrn-shell-theme-toggle__icon[data-theme-icon="dark"] {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.58) rotate(-90deg);
}
.tcrn-shell-theme-toggle[data-current-theme="dark"] .tcrn-shell-theme-toggle__icon[data-theme-icon="light"] {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.58) rotate(90deg);
}
.tcrn-shell-side-nav-toggle {
  inline-size: 38px;
  block-size: 38px;
  min-inline-size: 38px;
  min-block-size: 38px;
  min-height: 38px;
  display: inline-grid;
  place-items: center;
  padding: 0;
  color: var(--tcrn-color-brand-primary);
}
.tcrn-shell-side-nav-toggle__icon {
  display: inline-grid;
  inline-size: 20px;
  block-size: 20px;
  place-items: center;
}
.tcrn-icon-button__label,
.tcrn-sr-only {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
.tcrn-brand-lockup,
.tcrn-shell-brand-lockup,
.tcrn-product-logo {
  --tcrn-brand-mark-size: 38px;
  display: inline-flex;
  align-items: center;
  min-width: 0;
  gap: var(--tcrn-space-3);
}
.tcrn-brand-mark {
  display: block;
  inline-size: var(--tcrn-brand-mark-size);
  block-size: var(--tcrn-brand-mark-size);
  flex: 0 0 auto;
  filter: var(--tcrn-brand-mark-filter, none);
  transition:
    inline-size var(--tcrn-motion-emphasis),
    block-size var(--tcrn-motion-emphasis),
    filter var(--tcrn-motion-standard);
}
.tcrn-brand-wordmark {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: baseline;
  min-width: 0;
  gap: var(--tcrn-space-0h) var(--tcrn-space-2);
  color: var(--tcrn-color-text-primary);
  font-size: var(--tcrn-type-size-section);
  font-weight: var(--tcrn-type-weight-regular);
  line-height: var(--tcrn-type-line-section);
  overflow-wrap: anywhere;
}
.tcrn-brand-wordmark__base {
  flex: 0 0 auto;
  letter-spacing: 0;
  font-weight: var(--tcrn-type-weight-regular);
  white-space: nowrap;
}
.tcrn-brand-wordmark__suffix {
  flex: 0 1 auto;
  min-width: 0;
  color: var(--tcrn-color-brand-secondary-readable);
  font-size: inherit;
  font-weight: var(--tcrn-type-weight-strong);
}
.tcrn-brand-wordmark__suffix--aos {
  color: var(--tcrn-brand-accent-aos);
}
.tcrn-brand-wordmark__suffix--tms {
  color: var(--tcrn-brand-accent-tms);
}
.tcrn-brand-wordmark__suffix--design-system {
  background: linear-gradient(
    105deg,
    var(--tcrn-brand-accent-design-system-1) 0%,
    var(--tcrn-brand-accent-design-system-2) 31%,
    var(--tcrn-brand-accent-design-system-3) 62%,
    var(--tcrn-brand-accent-design-system-4) 100%
  );
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.tcrn-brand-lockup--long-name .tcrn-brand-wordmark {
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
}
.tcrn-shell-brand-lockup__copy,
.tcrn-product-logo__copy {
  display: grid;
  min-width: 0;
  gap: var(--tcrn-space-0h);
}
.tcrn-product-logo__line-one {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--tcrn-space-0h) var(--tcrn-space-1);
  color: var(--tcrn-color-text-primary);
  font-size: var(--tcrn-type-size-ui);
  font-weight: var(--tcrn-type-weight-regular);
  line-height: var(--tcrn-type-line-ui);
  white-space: nowrap;
}
.tcrn-product-logo__line-one-base {
  flex: 0 0 auto;
  font-weight: var(--tcrn-type-weight-regular);
  white-space: nowrap;
}
.tcrn-product-logo__line-one-suffix {
  flex: 0 1 auto;
  min-width: 0;
  font-weight: var(--tcrn-type-weight-strong);
  white-space: nowrap;
}
.tcrn-product-logo--stacked-suffix .tcrn-product-logo__line-one {
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
  white-space: normal;
}
.tcrn-shell-brand-lockup__caption,
.tcrn-product-logo__line-two {
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-meta);
  font-weight: var(--tcrn-type-weight-strong);
  line-height: var(--tcrn-type-line-caption);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tcrn-product-shell {
  --tcrn-product-shell-sidebar-width: 280px;
  min-height: 100vh;
  display: grid;
  grid-template-columns: var(--tcrn-product-shell-sidebar-width) minmax(0, 1fr);
  background: var(--tcrn-color-surface-canvas);
  color: var(--tcrn-color-text-primary);
  font-family: var(--tcrn-type-family-ui);
  font-size: var(--tcrn-type-size-ui);
  line-height: var(--tcrn-type-line-ui);
  letter-spacing: 0;
  transition: grid-template-columns var(--tcrn-motion-product-shell);
}
.tcrn-product-shell[data-product-shell-collapsed="true"] {
  --tcrn-product-shell-sidebar-width: 92px;
}
.tcrn-product-shell[data-theme-switching="true"]::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 999;
  pointer-events: none;
  background: color-mix(in srgb, var(--tcrn-color-brand-primary-bg), transparent 20%);
  animation: tcrn-product-shell-theme-wash var(--tcrn-motion-product-shell) both;
}
@keyframes tcrn-product-shell-theme-wash {
  from { opacity: 0.22; }
  to { opacity: 0; }
}
.tcrn-product-shell :focus-visible:not(.tcrn-search-input__control) {
  outline: 3px solid var(--tcrn-color-focus-ring);
  outline-offset: 2px;
  box-shadow: none;
}
.tcrn-product-shell__sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: var(--tcrn-space-5);
  min-width: 0;
  padding: var(--tcrn-space-4);
  border-right: 1px solid var(--tcrn-color-border-subtle);
  background: var(--tcrn-color-surface-panel);
}
.tcrn-product-shell__sidebar-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 38px;
  align-items: center;
  gap: var(--tcrn-space-2);
}
.tcrn-product-shell__brand {
  display: flex;
  min-width: 0;
  min-height: 46px;
  align-items: center;
  overflow: hidden;
  text-decoration: none;
}
.tcrn-product-shell[data-product-shell-collapsed="true"] .tcrn-product-shell__sidebar-header {
  grid-template-columns: 1fr;
  justify-items: center;
}
.tcrn-product-shell[data-product-shell-collapsed="true"] .tcrn-product-shell__brand {
  inline-size: 42px;
  min-height: 42px;
}
.tcrn-product-shell[data-product-shell-collapsed="true"] .tcrn-shell-brand-lockup__copy,
.tcrn-product-shell[data-product-shell-collapsed="true"] .tcrn-product-logo__copy,
.tcrn-product-shell[data-product-shell-collapsed="true"] .tcrn-nav-group__label,
.tcrn-product-shell[data-product-shell-collapsed="true"] .tcrn-nav-item__label,
.tcrn-product-shell[data-product-shell-collapsed="true"] .tcrn-nav-item__disabled-reason {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
.tcrn-product-shell[data-product-shell-collapsed="true"] .tcrn-side-nav {
  align-items: center;
}
.tcrn-product-shell[data-product-shell-collapsed="true"] .tcrn-nav-group {
  width: 48px;
}
.tcrn-product-shell[data-product-shell-collapsed="true"] .tcrn-nav-item {
  grid-template-columns: 20px;
  justify-content: center;
  inline-size: 44px;
  min-height: 42px;
  padding: var(--tcrn-space-2);
}
.tcrn-product-shell[data-product-shell-collapsed="true"] .tcrn-nav-item[data-nav-item-has-icon="false"]::before {
  content: "";
  inline-size: 6px;
  block-size: 6px;
  border-radius: var(--tcrn-radius-pill);
  background: currentColor;
}
.tcrn-product-shell__workspace {
  min-width: 0;
  display: grid;
  grid-template-rows: auto 1fr;
}
.tcrn-product-shell__workspace > .tcrn-top-bar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: center;
  gap: var(--tcrn-space-4);
  min-height: 68px;
  padding: var(--tcrn-space-3) var(--tcrn-space-5);
  border: 0;
  border-bottom: 1px solid var(--tcrn-color-border-subtle);
  border-radius: 0;
  justify-content: stretch;
  background: color-mix(in srgb, var(--tcrn-color-surface-panel), transparent 5%);
  backdrop-filter: blur(16px);
}
.tcrn-product-shell__utility-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  gap: var(--tcrn-space-3);
  min-width: 0;
}
.tcrn-product-shell__utility-row > * {
  min-width: 0;
}
.tcrn-product-shell__current-location {
  display: grid;
  flex: 0 1 240px;
  gap: var(--tcrn-space-0h);
  margin-right: auto;
  min-width: 0;
  max-width: 240px;
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-caption);
  line-height: var(--tcrn-type-line-caption);
  letter-spacing: 0;
}
.tcrn-product-shell__current-location strong {
  color: var(--tcrn-color-text-primary);
  font-size: var(--tcrn-type-size-ui);
  font-weight: var(--tcrn-type-weight-strong);
  line-height: var(--tcrn-type-line-ui);
}
.tcrn-product-shell__current-location span,
.tcrn-product-shell__current-location strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tcrn-product-shell-search {
  position: relative;
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: 260px;
  margin-left: auto;
  justify-self: end;
  width: 260px;
  max-width: min(100%, 260px);
  transition:
    flex-basis var(--tcrn-motion-product-shell-search),
    width var(--tcrn-motion-product-shell-search),
    max-width var(--tcrn-motion-product-shell-search);
}
.tcrn-product-shell-search[data-search-expanded="true"] {
  flex-basis: 420px;
  width: 420px;
  max-width: min(100%, 420px);
}
.tcrn-product-shell-search__results {
  position: absolute;
  inset-block-start: calc(100% + var(--tcrn-space-2));
  inset-inline-end: 0;
  z-index: 40;
  display: grid;
  gap: var(--tcrn-space-1);
  width: min(420px, calc(100vw - 32px));
  padding: var(--tcrn-space-2);
  border: 1px solid var(--tcrn-color-border-strong);
  border-radius: var(--tcrn-radius-panel);
  background: var(--tcrn-color-surface-panel);
  box-shadow: var(--tcrn-elevation-floating);
}
.tcrn-product-shell-search__results[hidden] {
  display: none;
}
.tcrn-product-shell-search__result,
.tcrn-product-shell-search__empty {
  display: grid;
  gap: var(--tcrn-space-0h);
  padding: var(--tcrn-space-2);
  border-radius: var(--tcrn-radius-control);
  color: var(--tcrn-color-text-primary);
  text-decoration: none;
}
.tcrn-product-shell-search__result:hover,
.tcrn-product-shell-search__result[data-selected="true"] {
  background: var(--tcrn-color-surface-muted);
}
.tcrn-product-shell-search__result span,
.tcrn-product-shell-search__empty {
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-meta);
}
.tcrn-product-shell__main {
  min-width: 0;
  padding: var(--tcrn-space-5);
}
.tcrn-product-shell-content-stack {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--tcrn-space-5);
  min-width: 0;
  max-width: 1180px;
}
.tcrn-product-shell-content-stack > *,
.tcrn-product-shell-section-grid > * {
  min-width: 0;
  max-width: 100%;
}
.tcrn-product-shell-section-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(280px, 0.75fr);
  gap: var(--tcrn-space-4);
  align-items: start;
}
.tcrn-top-bar {
  display: grid;
  grid-template-columns: max-content max-content minmax(0, 1fr);
  align-items: center;
  gap: var(--tcrn-space-4);
  min-height: 68px;
  padding: var(--tcrn-space-3) var(--tcrn-space-5);
  border-bottom: 1px solid var(--tcrn-color-border-subtle);
  background: color-mix(in srgb, var(--tcrn-color-surface-panel), transparent 5%);
  backdrop-filter: blur(16px);
}
.tcrn-top-bar__brand {
  font-weight: var(--tcrn-type-weight-strong);
}
.tcrn-top-bar__module {
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-ui);
}
.tcrn-top-bar__actions {
  min-width: 0;
}
.tcrn-side-nav {
  display: flex;
  flex-direction: column;
  gap: var(--tcrn-space-4);
}
.tcrn-nav-group {
  display: grid;
  gap: var(--tcrn-space-2);
}
.tcrn-nav-group__label {
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-caption);
  font-weight: var(--tcrn-type-weight-strong);
  text-transform: uppercase;
  letter-spacing: 0;
  padding: 0 var(--tcrn-space-2);
}
.tcrn-nav-group__items {
  display: grid;
  gap: var(--tcrn-space-1);
}
.tcrn-nav-item {
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr);
  align-items: center;
  gap: var(--tcrn-space-2);
  min-height: 38px;
  padding: var(--tcrn-space-2);
  border: 1px solid transparent;
  border-radius: var(--tcrn-radius-control);
  color: var(--tcrn-color-text-secondary);
  text-decoration: none;
}
.tcrn-nav-item[data-nav-item-has-icon="false"] {
  grid-template-columns: minmax(0, 1fr);
}
.tcrn-nav-item__content {
  min-width: 0;
}
.tcrn-nav-item[data-selected="true"],
.tcrn-nav-item[aria-current="page"] {
  color: var(--tcrn-color-text-primary);
  background: var(--tcrn-color-brand-primary-bg);
  border-color: color-mix(in srgb, var(--tcrn-color-brand-primary), transparent 64%);
  box-shadow: none;
}
.tcrn-nav-item:hover {
  background: var(--tcrn-color-surface-muted);
  color: var(--tcrn-color-text-primary);
}
.tcrn-nav-item__label {
  overflow-wrap: normal;
  word-break: normal;
}
.tcrn-search-input {
  --tcrn-search-input-icon-size: 16px;
  --tcrn-search-input-block-size: 38px;
  --tcrn-search-input-padding-inline: var(--tcrn-space-3);
  --tcrn-search-input-column-gap: var(--tcrn-space-2);
  --tcrn-search-input-control-min-inline-size: 9ch;
  display: grid;
  grid-template-columns: var(--tcrn-search-input-icon-size) minmax(var(--tcrn-search-input-control-min-inline-size), 1fr) max-content;
  align-items: center;
  gap: var(--tcrn-search-input-column-gap);
  min-block-size: var(--tcrn-search-input-block-size);
  min-inline-size: var(--tcrn-search-input-min-inline-size, 0);
  max-inline-size: 100%;
  padding: 0 var(--tcrn-search-input-padding-inline);
  border: 1px solid var(--tcrn-color-border-control);
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-color-surface-panel);
}
.tcrn-search-input__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  grid-column: 1;
  inline-size: var(--tcrn-search-input-icon-size);
  block-size: var(--tcrn-search-input-icon-size);
  color: var(--tcrn-color-text-secondary);
  pointer-events: none;
}
.tcrn-search-input__icon svg {
  inline-size: var(--tcrn-search-input-icon-size);
  block-size: var(--tcrn-search-input-icon-size);
}
.tcrn-search-input .tcrn-search-input__control {
  appearance: none;
  box-sizing: border-box;
  grid-column: 2;
  width: 100%;
  min-height: 0;
  min-width: 0;
  max-width: none;
  padding: 0;
  border: 0;
  border-radius: 0;
  outline: 0;
  background: transparent;
  color: var(--tcrn-color-text-primary);
  font: inherit;
  box-shadow: none;
}
.tcrn-search-input:focus-within {
  outline: 3px solid var(--tcrn-color-focus-ring);
  outline-offset: 2px;
  box-shadow: none;
}
.tcrn-search-input .tcrn-search-input__control:focus,
.tcrn-search-input .tcrn-search-input__control:focus-visible {
  outline-style: none;
  outline-width: 0;
  outline-offset: 0;
  box-shadow: none;
}
.tcrn-search-input__shortcut {
  position: static;
  z-index: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  grid-column: 3;
  color: var(--tcrn-color-text-secondary);
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  background: var(--tcrn-color-surface-muted);
  padding: var(--tcrn-space-0h) var(--tcrn-space-1h);
  font-family: var(--tcrn-type-family-ui);
  font-size: var(--tcrn-type-size-caption);
  font-weight: var(--tcrn-type-weight-strong);
  line-height: var(--tcrn-type-line-caption);
  letter-spacing: 0;
  pointer-events: none;
}
.tcrn-shell-locale-menu {
  position: relative;
}
.tcrn-shell-locale-menu__trigger {
  display: inline-flex;
  align-items: center;
  gap: var(--tcrn-space-2);
  max-width: 132px;
  min-height: 36px;
  padding: 0 var(--tcrn-space-2h);
  border: 1px solid var(--tcrn-color-border-control);
  border-radius: var(--tcrn-radius-pill);
  background: var(--tcrn-color-surface-panel);
  color: var(--tcrn-color-text-primary);
  font-size: var(--tcrn-type-size-ui);
  font-weight: var(--tcrn-type-weight-strong);
  line-height: var(--tcrn-type-line-ui);
  letter-spacing: 0;
  transition:
    background-color var(--tcrn-motion-standard),
    border-color var(--tcrn-motion-standard),
    color var(--tcrn-motion-standard),
    box-shadow var(--tcrn-motion-standard);
}
.tcrn-shell-locale-menu__current {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tcrn-shell-locale-menu__panel {
  position: absolute;
  right: 0;
  top: calc(100% + var(--tcrn-space-2));
  z-index: 30;
  display: grid;
  gap: var(--tcrn-space-1);
  min-width: 148px;
  padding: var(--tcrn-space-2);
  border: 1px solid var(--tcrn-color-border-strong);
  border-radius: var(--tcrn-radius-panel);
  background: var(--tcrn-color-surface-panel);
  box-shadow: var(--tcrn-elevation-floating);
}
.tcrn-shell-locale-menu__chevron {
  flex: 0 0 auto;
  width: 11px;
  height: 11px;
  color: var(--tcrn-color-text-tertiary);
  pointer-events: none;
  transition: transform var(--tcrn-motion-emphasis);
}
.tcrn-shell-locale-menu[data-locale-menu-open="true"] .tcrn-shell-locale-menu__chevron,
.tcrn-shell-locale-menu__trigger[aria-expanded="true"] .tcrn-shell-locale-menu__chevron {
  transform: rotate(180deg);
}
.tcrn-shell-locale-menu__panel[hidden] {
  display: none;
}
.tcrn-shell-locale-menu__option {
  border: 0;
  border-radius: var(--tcrn-radius-control);
  padding: var(--tcrn-space-2);
  text-align: left;
  background: transparent;
  color: var(--tcrn-color-text-primary);
}
.tcrn-shell-locale-menu__option[aria-current="true"],
.tcrn-shell-locale-menu__option:hover {
  background: var(--tcrn-color-surface-muted);
}
[data-theme-icon="dark"],
[data-side-nav-icon="expand"] {
  display: none;
}
html[data-tcrn-theme="dark"] [data-theme-icon="light"],
[data-side-nav-collapsed="true"] [data-side-nav-icon="collapse"] {
  display: none;
}
html[data-tcrn-theme="dark"] [data-theme-icon="dark"],
[data-side-nav-collapsed="true"] [data-side-nav-icon="expand"] {
  display: inline-flex;
}
.tcrn-table-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--tcrn-space-2);
  margin-block-end: var(--tcrn-space-2);
}
.tcrn-table-toolbar .tcrn-search-input {
  flex: 1 1 220px;
  min-width: 180px;
}
.tcrn-table-toolbar .tcrn-filter-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--tcrn-space-1);
}
.tcrn-table-toolbar__chip {
  min-height: 26px;
  padding: 0 var(--tcrn-space-2);
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-control);
  background: transparent;
  color: var(--tcrn-color-text-secondary);
  font: inherit;
  font-size: var(--tcrn-type-size-meta);
  cursor: pointer;
  transition:
    background-color var(--tcrn-motion-fast),
    border-color var(--tcrn-motion-fast),
    color var(--tcrn-motion-fast);
}
.tcrn-table-toolbar__chip:hover {
  border-color: var(--tcrn-color-border-control);
  color: var(--tcrn-color-text-primary);
}
.tcrn-table-toolbar__chip[aria-pressed="true"] {
  border-color: var(--tcrn-color-brand-primary);
  color: var(--tcrn-color-brand-primary);
  background: color-mix(in srgb, var(--tcrn-color-brand-primary-bg) 42%, transparent);
}
.tcrn-table-toolbar__count {
  margin-inline-start: auto;
  /* text-secondary, not text-muted: the live match count is real information and
     muted fails the 4.5:1 contrast floor on panel surfaces. */
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-meta);
  font-variant-numeric: tabular-nums;
}
.tcrn-table-toolbar__collapse {
  min-height: 26px;
  padding: 0 var(--tcrn-space-2);
  border: 1px solid transparent;
  border-radius: var(--tcrn-radius-control);
  background: transparent;
  color: var(--tcrn-color-text-secondary);
  font: inherit;
  font-size: var(--tcrn-type-size-meta);
  cursor: pointer;
}
.tcrn-table-toolbar__collapse:hover {
  color: var(--tcrn-color-text-primary);
  border-color: var(--tcrn-color-border-subtle);
}
.tcrn-table-toolbar__collapse [data-table-toolbar-collapse-label="expand"],
.tcrn-table-toolbar__collapse[aria-expanded="false"] [data-table-toolbar-collapse-label="collapse"] {
  display: none;
}
.tcrn-table-toolbar__collapse[aria-expanded="false"] [data-table-toolbar-collapse-label="expand"] {
  display: inline;
}
.tcrn-table-shell [role="row"][hidden] {
  display: none;
}
.tcrn-environment-banner,
.tcrn-inline-alert {
  display: flex;
  align-items: center;
  gap: var(--tcrn-space-3);
  min-height: 42px;
  padding: var(--tcrn-space-2) var(--tcrn-space-3);
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-panel);
  background: var(--tcrn-color-brand-neutral-bg);
}
.tcrn-inline-alert--warning {
  background: var(--tcrn-color-state-warning-bg);
}
.tcrn-heading {
  margin: 0;
  letter-spacing: 0;
}
.tcrn-heading--1 {
  font-size: clamp(28px, 3vw, 44px);
  line-height: 1.04;
}
.tcrn-heading--2 {
  font-size: var(--tcrn-type-size-heading-2);
}
.tcrn-heading--3 {
  font-size: var(--tcrn-type-size-heading-3);
}
.tcrn-text {
  margin: var(--tcrn-space-2) 0 0;
  color: var(--tcrn-color-text-secondary);
}
/* Status reads as ink dot plus word. The pill-with-pastel-fill it replaces put a
   saturated block of colour behind every row in a dense table, which is loud at
   this density and is the single most recognisable tell of generated UI. Squaring
   the chip to the control radius keeps it reading as an instrument value rather
   than a marketing badge. */
.tcrn-badge {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: max-content;
  max-width: 100%;
  min-width: 0;
  min-height: 24px;
  padding: var(--tcrn-state-chip-padding);
  padding-inline-start: calc(var(--tcrn-space-2) + var(--tcrn-state-dot-size) + 4px);
  border-radius: var(--tcrn-radius-control);
  font-size: var(--tcrn-type-size-meta);
  line-height: 1.25;
  font-weight: var(--tcrn-type-weight-strong);
  white-space: normal;
  overflow-wrap: anywhere;
  text-align: center;
  background: var(--tcrn-color-surface-muted);
  color: var(--tcrn-color-text-secondary);
}
/* The dot is positioned rather than laid out. As a flex item it contributed its own
   min-content width, which left the anonymous text item unable to shrink and clipped
   longer labels ("Proof required") at narrow widths; out of flow it costs the label
   nothing and the text wraps as it did before. */
.tcrn-badge::before {
  content: "";
  position: absolute;
  inset-inline-start: var(--tcrn-space-2);
  inset-block-start: 50%;
  inline-size: var(--tcrn-state-dot-size);
  block-size: var(--tcrn-state-dot-size);
  margin-block-start: calc(var(--tcrn-state-dot-size) / -2);
  border-radius: 50%;
  background: currentColor;
}
.tcrn-badge--warning {
  background: var(--tcrn-color-state-warning-bg);
  color: var(--tcrn-color-state-warning);
}
.tcrn-badge--positive {
  background: var(--tcrn-color-state-ready-bg);
  color: var(--tcrn-color-state-ready);
}
.tcrn-badge--danger {
  background: var(--tcrn-color-state-blocked-bg);
  color: var(--tcrn-color-state-blocked);
}

/* ── B「治理纸感」identity stamp ──────────────────────────────────────────────
   Reserved for identity moments: a gate closing, a ruling landing, a release being
   accepted. It is deliberately the only place the serif and the oxblood ink appear,
   because an impression that shows up everywhere stops meaning anything. The
   whitelist is enforced mechanically by scripts/stamp-whitelist-proof.mjs. */
.tcrn-stamp {
  display: inline-flex;
  align-items: center;
  gap: var(--tcrn-space-2);
  padding: var(--tcrn-space-1) var(--tcrn-space-2h);
  border: 1px solid currentColor;
  border-radius: var(--tcrn-radius-control);
  color: var(--tcrn-color-brand-accent);
  background: transparent;
  font-family: var(--tcrn-type-family-stamp);
  font-size: var(--tcrn-type-size-stamp-min);
  font-weight: var(--tcrn-type-weight-strong);
  letter-spacing: var(--tcrn-type-tracking-stamp);
  line-height: 1.2;
  text-transform: uppercase;
}
.tcrn-stamp[data-stamp-moment="release"] {
  color: var(--tcrn-color-state-ready);
}
/* The double rule is the archival-document memory: two weights, not one, so a
   header carrying a ruling reads differently from an ordinary panel header. */
.tcrn-stamp-rule {
  border: 0;
  border-top: 2px solid var(--tcrn-color-border-strong);
  border-bottom: 1px solid var(--tcrn-color-border-subtle);
  block-size: 3px;
  margin: 0;
}
.tcrn-readback-panel,
.tcrn-table-shell {
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-panel);
  background: var(--tcrn-color-surface-panel);
}
.tcrn-readback-panel {
  display: grid;
  gap: var(--tcrn-space-2);
  padding: var(--tcrn-space-4);
  overflow: hidden;
}
.tcrn-readback-panel > .tcrn-heading + * {
  margin-top: 0;
}
.tcrn-evidence-strip {
  display: flex;
  flex-wrap: wrap;
  gap: var(--tcrn-space-2);
  margin-top: var(--tcrn-space-3);
}
.tcrn-key-value-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--tcrn-space-3);
  margin: var(--tcrn-space-3) 0 0;
}
.tcrn-key-value-list div {
  display: grid;
  gap: var(--tcrn-space-0h);
  padding: var(--tcrn-space-2);
  border-radius: var(--tcrn-radius-panel);
  background: var(--tcrn-color-surface-muted);
}
.tcrn-key-value-list dt {
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-meta);
}
.tcrn-key-value-list dd {
  margin: 0;
  font-weight: var(--tcrn-type-weight-strong);
}
.tcrn-table-shell {
  display: grid;
  min-width: 0;
  max-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-inline: contain;
}
.tcrn-table-shell__head,
.tcrn-table-shell__row {
  display: grid;
  grid-template-columns: var(
    --tcrn-table-shell-columns,
    repeat(var(--tcrn-table-column-count, 1), minmax(var(--tcrn-table-shell-column-min-width, 160px), 1fr))
  );
  min-width: var(
    --tcrn-table-shell-min-width,
    max(100%, calc(var(--tcrn-table-column-count, 1) * var(--tcrn-table-shell-column-min-width, 160px)))
  );
}
.tcrn-table-shell__head {
  position: sticky;
  top: 0;
  background: var(--tcrn-color-surface-muted);
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-meta);
  font-weight: var(--tcrn-type-weight-strong);
}
.tcrn-table-shell__head span,
.tcrn-table-shell__cell {
  min-width: 0;
  min-height: 44px;
  padding: var(--tcrn-space-3);
  border-bottom: 1px solid var(--tcrn-color-border-subtle);
  overflow-wrap: anywhere;
  word-break: normal;
}
.tcrn-table-shell__row:last-child .tcrn-table-shell__cell {
  border-bottom: 0;
}
.tcrn-table-shell__empty {
  padding: var(--tcrn-space-3);
  color: var(--tcrn-color-text-secondary);
}
@media (max-width: 520px) {
  .tcrn-table-shell {
    overflow-x: visible;
  }
  .tcrn-table-shell__head {
    display: none;
  }
  .tcrn-table-shell__row {
    grid-template-columns: 1fr;
    gap: var(--tcrn-space-2);
    min-width: 0;
    padding: var(--tcrn-space-3);
  }
  .tcrn-table-shell__cell {
    display: grid;
    grid-template-columns: minmax(84px, 0.4fr) minmax(0, 1fr);
    gap: var(--tcrn-space-2);
    min-width: 0;
  }
  .tcrn-table-shell__cell::before {
    content: attr(data-label);
    color: var(--tcrn-color-text-secondary);
    font-weight: var(--tcrn-type-weight-strong);
  }
}
.tcrn-relationship-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--tcrn-space-1);
  width: max-content;
  max-width: 100%;
  text-decoration: none;
  white-space: nowrap;
}
.tcrn-relationship-chip__label {
  font-weight: var(--tcrn-type-weight-strong);
}
.tcrn-relationship-chip__target {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tcrn-machine-token {
  display: inline-grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--tcrn-space-2);
  width: min(100%, max-content);
  max-width: 100%;
  min-width: 0;
}
.tcrn-machine-token__label {
  grid-column: 1 / -1;
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-caption);
  font-weight: var(--tcrn-type-weight-strong);
  line-height: var(--tcrn-type-line-caption);
}
.tcrn-machine-token__value {
  display: block;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  color: var(--tcrn-color-text-primary);
  font-family: var(--tcrn-type-family-mono);
  font-size: var(--tcrn-type-size-meta);
  line-height: 1.35;
  overflow-wrap: anywhere;
  word-break: break-word;
}
.tcrn-machine-token__copy {
  min-height: 28px;
  padding: var(--tcrn-space-0h) var(--tcrn-space-2);
}
.tcrn-machine-token--compact {
  gap: var(--tcrn-space-1);
}
.tcrn-machine-token--compact .tcrn-machine-token__label {
  font-size: var(--tcrn-type-size-caption);
}
.tcrn-machine-token--compact .tcrn-machine-token__value {
  font-size: var(--tcrn-type-size-caption);
}
.tcrn-machine-token-cell {
  display: inline-grid;
  min-width: 0;
  max-width: 100%;
}
.tcrn-work-management-subnav,
.tcrn-saved-view-toolbar,
.tcrn-work-page-header,
.tcrn-work-view-tabs,
.tcrn-work-quick-filters,
.tcrn-work-item-row,
.tcrn-work-list,
.tcrn-work-split-view,
.tcrn-work-backlog-group,
.tcrn-work-inline-create-static,
.tcrn-work-board-view,
.tcrn-gate-pipeline,
.tcrn-evidence-attachment-list,
.tcrn-work-hierarchy,
.tcrn-work-field-panel,
.tcrn-metadata-rail,
.tcrn-work-activity-feed,
.tcrn-work-detail-layout,
.tcrn-work-item-inspector {
  min-width: 0;
}
.tcrn-work-page-header,
.tcrn-work-view-tabs,
.tcrn-work-quick-filters,
.tcrn-work-item-row,
.tcrn-work-list,
.tcrn-work-split-view,
.tcrn-work-backlog-group,
.tcrn-work-board,
.tcrn-work-board-view,
.tcrn-work-detail-layout,
.tcrn-work-field-panel,
.tcrn-metadata-rail,
.tcrn-work-activity-feed {
  --tcrn-work-density-gap: var(--tcrn-space-2);
  --tcrn-work-density-padding: var(--tcrn-space-3);
  --tcrn-work-density-row-min: 40px;
}
.tcrn-work-page-header--dense,
.tcrn-work-view-tabs--dense,
.tcrn-work-quick-filters--dense,
.tcrn-work-item-row--dense,
.tcrn-work-list--dense,
.tcrn-work-split-view--dense,
.tcrn-work-backlog-group--dense,
.tcrn-work-board--dense,
.tcrn-work-board-view--dense,
.tcrn-work-detail-layout--dense,
.tcrn-work-field-panel--dense,
.tcrn-metadata-rail--dense,
.tcrn-work-activity-feed--dense {
  --tcrn-work-density-gap: var(--tcrn-space-1);
  --tcrn-work-density-padding: var(--tcrn-space-2);
  --tcrn-work-density-row-min: 34px;
}
.tcrn-work-page-header {
  display: grid;
  gap: var(--tcrn-work-density-gap);
  padding-block-end: var(--tcrn-space-3);
  border-bottom: 1px solid var(--tcrn-color-border-subtle);
}
.tcrn-work-page-header__breadcrumbs,
.tcrn-work-page-header__breadcrumb,
.tcrn-work-page-header__meta,
.tcrn-work-page-header__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--tcrn-space-2);
  min-width: 0;
}
.tcrn-work-page-header__breadcrumbs {
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-meta);
  font-weight: var(--tcrn-type-weight-strong);
}
.tcrn-work-page-header__breadcrumbs a {
  color: inherit;
  text-decoration: none;
}
.tcrn-work-page-header__body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
  gap: var(--tcrn-space-3);
  min-width: 0;
}
.tcrn-work-page-header__title {
  min-width: 0;
}
.tcrn-work-page-header__title .tcrn-heading,
.tcrn-work-page-header__title .tcrn-text {
  margin: 0;
}
.tcrn-work-page-header__meta {
  justify-content: flex-end;
}
.tcrn-work-page-header__actions {
  grid-column: 1 / -1;
}
.tcrn-work-management-subnav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--tcrn-space-2);
}
.tcrn-work-management-subnav > a,
.tcrn-work-management-subnav > span {
  display: inline-flex;
  align-items: center;
  gap: var(--tcrn-space-2);
  min-height: 32px;
  padding: var(--tcrn-space-1) var(--tcrn-space-3);
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-control);
  color: var(--tcrn-color-text-primary);
  text-decoration: none;
  background: var(--tcrn-color-surface-panel);
}
.tcrn-work-management-subnav [data-selected="true"] {
  border-color: var(--tcrn-color-border-control);
  background: var(--tcrn-color-brand-primary-bg);
}
.tcrn-saved-view-toolbar {
  display: grid;
  gap: var(--tcrn-space-3);
}
.tcrn-work-view-tabs,
.tcrn-work-quick-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--tcrn-work-density-gap);
}
.tcrn-work-view-tabs > a,
.tcrn-work-view-tabs > span,
.tcrn-work-quick-filters > a,
.tcrn-work-quick-filters > span {
  display: inline-flex;
  align-items: center;
  gap: var(--tcrn-space-2);
  min-width: 0;
  min-height: var(--tcrn-work-density-row-min);
  padding: var(--tcrn-space-0h) var(--tcrn-space-2);
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-control);
  color: var(--tcrn-color-text-primary);
  text-decoration: none;
  background: var(--tcrn-color-surface-panel);
}
.tcrn-work-view-tabs [data-selected="true"],
.tcrn-work-quick-filters [data-selected="true"] {
  border-color: var(--tcrn-color-border-control);
  box-shadow: inset 0 -2px 0 var(--tcrn-color-brand-primary);
}
.tcrn-work-quick-filters__value {
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-meta);
}
.tcrn-work-item-row,
.tcrn-work-backlog-group,
.tcrn-work-activity-feed__item,
.tcrn-work-detail-layout,
.tcrn-work-field-panel {
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-panel);
  background: var(--tcrn-color-surface-panel);
}
.tcrn-work-item-row {
  display: grid;
  grid-template-columns: minmax(112px, 0.18fr) minmax(180px, 1fr) minmax(220px, 0.8fr);
  align-items: center;
  gap: var(--tcrn-work-density-gap);
  min-height: var(--tcrn-work-density-row-min);
  padding: var(--tcrn-work-density-padding);
  color: var(--tcrn-color-text-primary);
  text-decoration: none;
}
.tcrn-work-item-row--compact {
  grid-template-columns: minmax(96px, 0.16fr) minmax(160px, 1fr) minmax(192px, 0.72fr);
  gap: var(--tcrn-space-2);
  padding: var(--tcrn-space-2) var(--tcrn-space-3);
}
.tcrn-work-item-row--dense {
  grid-template-columns: minmax(92px, 0.14fr) minmax(180px, 1fr) minmax(172px, 0.62fr);
  padding: var(--tcrn-space-1) var(--tcrn-space-2);
  font-size: var(--tcrn-type-size-ui);
}
.tcrn-work-item-row[data-selected="true"] {
  border-color: var(--tcrn-color-border-control);
  box-shadow: inset 3px 0 0 var(--tcrn-color-brand-primary);
}
.tcrn-work-item-row__id,
.tcrn-work-item-row__summary,
.tcrn-work-item-row__meta,
.tcrn-work-item-row__relationships {
  min-width: 0;
}
.tcrn-work-item-row__id,
.tcrn-work-item-row__meta,
.tcrn-work-item-row__relationships {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--tcrn-space-2);
}
.tcrn-work-item-row__summary {
  display: grid;
  gap: var(--tcrn-space-0h);
}
.tcrn-work-item-row__summary strong {
  overflow-wrap: anywhere;
}
.tcrn-work-item-row__summary .tcrn-text {
  margin: 0;
}
.tcrn-work-item-row__field,
.tcrn-work-board__card-field {
  display: inline-grid;
  gap: var(--tcrn-space-0h);
  min-width: 0;
  font-size: var(--tcrn-type-size-meta);
}
.tcrn-work-item-row__field span,
.tcrn-work-board__card-field span {
  color: var(--tcrn-color-text-secondary);
}
.tcrn-work-item-row__relationships {
  grid-column: 1 / -1;
}
.tcrn-work-list,
.tcrn-work-board-view,
.tcrn-work-backlog-group,
.tcrn-work-field-panel,
.tcrn-metadata-rail,
.tcrn-work-activity-feed,
.tcrn-work-detail-layout__main,
.tcrn-work-detail-layout__rail {
  display: grid;
  gap: var(--tcrn-work-density-gap);
}
.tcrn-work-split-view {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.6fr);
  gap: var(--tcrn-work-density-gap);
  align-items: start;
}
.tcrn-work-split-view__list,
.tcrn-work-split-view__detail {
  min-width: 0;
}
.tcrn-work-backlog-group,
.tcrn-work-field-panel,
.tcrn-work-activity-feed__item,
.tcrn-work-detail-layout {
  padding: var(--tcrn-work-density-padding);
}
.tcrn-work-backlog-group__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--tcrn-space-2);
  min-width: 0;
}
.tcrn-work-backlog-group__head > div:first-child {
  min-width: 0;
  margin-right: auto;
}
.tcrn-work-backlog-group__head .tcrn-heading,
.tcrn-work-backlog-group__head .tcrn-text,
.tcrn-work-field-panel .tcrn-heading {
  margin: 0;
}
.tcrn-work-field-panel .tcrn-key-value-list > div,
.tcrn-metadata-rail .tcrn-key-value-list > div {
  grid-template-columns: minmax(0, 1fr);
}
.tcrn-work-backlog-group__actions,
.tcrn-work-inline-create-static,
.tcrn-metadata-rail__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--tcrn-space-2);
}
.tcrn-work-inline-create-static .tcrn-text {
  margin: 0;
}
.tcrn-work-board {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--tcrn-work-density-gap);
  min-width: 0;
}
.tcrn-work-board--compact {
  grid-template-columns: repeat(auto-fit, minmax(196px, 1fr));
  gap: var(--tcrn-space-2);
}
.tcrn-work-board--dense {
  grid-template-columns: repeat(auto-fit, minmax(188px, 1fr));
}
.tcrn-work-board__lane {
  display: grid;
  gap: var(--tcrn-space-3);
  min-width: 0;
  max-height: 620px;
  overflow: auto;
}
.tcrn-work-board__lane-head,
.tcrn-work-board__card-head,
.tcrn-work-item-inspector__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--tcrn-space-2);
  min-width: 0;
}
.tcrn-work-board__lane-head > .tcrn-heading,
.tcrn-work-item-inspector__head > div {
  min-width: 0;
  margin-right: auto;
}
.tcrn-work-board__cards {
  display: grid;
  gap: var(--tcrn-space-2);
}
.tcrn-work-board__card {
  display: grid;
  gap: var(--tcrn-work-density-gap);
  min-width: 0;
  padding: var(--tcrn-work-density-padding);
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-panel);
  background: var(--tcrn-color-surface-muted);
}
.tcrn-work-board__card > strong {
  min-width: 0;
  overflow-wrap: anywhere;
}
.tcrn-work-board__card .tcrn-text {
  margin: 0;
}
.tcrn-work-board--compact .tcrn-work-board__lane,
.tcrn-work-board--compact .tcrn-work-board__card {
  gap: var(--tcrn-space-2);
}
.tcrn-work-board--compact .tcrn-work-board__card {
  padding: var(--tcrn-space-2);
}
.tcrn-work-board__card-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--tcrn-space-2);
  min-width: 0;
}
.tcrn-work-board__relations,
.tcrn-work-item-inspector__relationships,
.tcrn-work-detail-layout__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--tcrn-space-2);
  min-width: 0;
}
.tcrn-work-hierarchy {
  display: grid;
  gap: var(--tcrn-space-3);
}
.tcrn-work-hierarchy__levels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--tcrn-space-3);
  min-width: 0;
}
.tcrn-work-hierarchy__node {
  display: grid;
  gap: var(--tcrn-space-2);
  min-width: 0;
}
.tcrn-work-hierarchy__node .tcrn-heading,
.tcrn-work-hierarchy__node .tcrn-text {
  margin: 0;
}
.tcrn-work-item-inspector {
  display: grid;
  gap: var(--tcrn-space-4);
}
.tcrn-work-item-inspector__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--tcrn-space-3);
  min-width: 0;
}
.tcrn-work-item-inspector__grid > section {
  min-width: 0;
}
.tcrn-work-item-inspector__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--tcrn-space-2);
}
.tcrn-work-activity-feed__head,
.tcrn-work-detail-layout__head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: var(--tcrn-space-2);
  min-width: 0;
}
.tcrn-work-activity-feed__head time {
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-meta);
  margin-left: auto;
}
.tcrn-work-activity-feed__item .tcrn-text,
.tcrn-work-detail-layout__head .tcrn-heading,
.tcrn-work-detail-layout__head .tcrn-text {
  margin: 0;
}
.tcrn-work-detail-layout {
  gap: var(--tcrn-work-density-gap);
  padding: var(--tcrn-work-density-padding);
}
.tcrn-work-detail-layout__head > div {
  min-width: 0;
  margin-right: auto;
}
.tcrn-work-detail-layout__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(240px, 0.34fr);
  gap: var(--tcrn-space-3);
  min-width: 0;
  align-items: start;
}
.tcrn-knowledge-page-tree,
.tcrn-knowledge-document-canvas,
.tcrn-knowledge-toc-rail,
.tcrn-knowledge-inline-comment-list,
.tcrn-knowledge-metadata-rail,
.tcrn-knowledge-attachment-list,
.tcrn-knowledge-label-set,
.tcrn-knowledge-version-history,
.tcrn-knowledge-template-gallery,
.tcrn-knowledge-search-results {
  min-width: 0;
}
.tcrn-knowledge-page-tree,
.tcrn-knowledge-document-canvas,
.tcrn-knowledge-toc-rail,
.tcrn-knowledge-inline-comment-list__item,
.tcrn-knowledge-metadata-rail,
.tcrn-knowledge-version-history__item,
.tcrn-knowledge-search-results__item {
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-panel);
  background: var(--tcrn-color-surface-panel);
}
.tcrn-knowledge-page-tree,
.tcrn-knowledge-document-canvas,
.tcrn-knowledge-toc-rail,
.tcrn-knowledge-inline-comment-list__item,
.tcrn-knowledge-metadata-rail,
.tcrn-knowledge-version-history__item,
.tcrn-knowledge-search-results__item {
  padding: var(--tcrn-space-3);
}
.tcrn-knowledge-page-tree__list {
  display: grid;
  gap: var(--tcrn-space-1);
  margin: 0;
  padding: 0;
  list-style: none;
}
.tcrn-knowledge-page-tree__item {
  min-width: 0;
}
.tcrn-knowledge-page-tree__item > a,
.tcrn-knowledge-page-tree__item > span,
.tcrn-knowledge-toc-rail nav > a,
.tcrn-knowledge-toc-rail nav > span {
  display: flex;
  align-items: center;
  gap: var(--tcrn-space-2);
  min-height: 32px;
  min-width: 0;
  padding: var(--tcrn-space-0h) var(--tcrn-space-2);
  border-radius: var(--tcrn-radius-control);
  color: var(--tcrn-color-text-primary);
  text-decoration: none;
}
.tcrn-knowledge-page-tree__item > [data-selected="true"],
.tcrn-knowledge-toc-rail nav > [data-selected="true"] {
  background: var(--tcrn-color-brand-primary-bg);
  box-shadow: inset 3px 0 0 var(--tcrn-color-brand-primary);
}
.tcrn-knowledge-page-tree__item[data-tree-level="2"] > a,
.tcrn-knowledge-page-tree__item[data-tree-level="2"] > span {
  padding-inline-start: var(--tcrn-space-4);
}
.tcrn-knowledge-page-tree__item[data-tree-level="3"] > a,
.tcrn-knowledge-page-tree__item[data-tree-level="3"] > span {
  padding-inline-start: var(--tcrn-space-6);
}
.tcrn-knowledge-page-tree__title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tcrn-knowledge-document-canvas,
.tcrn-knowledge-inline-comment-list,
.tcrn-knowledge-metadata-rail,
.tcrn-knowledge-attachment-list,
.tcrn-knowledge-version-history,
.tcrn-knowledge-template-gallery,
.tcrn-knowledge-search-results {
  display: grid;
  gap: var(--tcrn-space-2);
}
.tcrn-knowledge-document-canvas__head,
.tcrn-knowledge-inline-comment-list__head,
.tcrn-knowledge-search-results__head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: var(--tcrn-space-2);
  min-width: 0;
}
.tcrn-knowledge-document-canvas__head > div:first-child,
.tcrn-knowledge-search-results__head > strong {
  min-width: 0;
  margin-right: auto;
}
.tcrn-knowledge-document-canvas__head .tcrn-heading,
.tcrn-knowledge-document-canvas__head .tcrn-text,
.tcrn-knowledge-document-canvas__section .tcrn-heading,
.tcrn-knowledge-document-canvas__section .tcrn-text,
.tcrn-knowledge-inline-comment-list__item .tcrn-text,
.tcrn-knowledge-template-gallery__card .tcrn-heading,
.tcrn-knowledge-template-gallery__card .tcrn-text,
.tcrn-knowledge-search-results__item .tcrn-text,
.tcrn-knowledge-toc-rail .tcrn-heading {
  margin: 0;
}
.tcrn-knowledge-document-canvas__body {
  display: grid;
  gap: var(--tcrn-space-4);
  max-width: 74ch;
}
.tcrn-knowledge-document-canvas__section {
  display: grid;
  gap: var(--tcrn-space-2);
}
.tcrn-knowledge-label-set,
.tcrn-knowledge-metadata-rail__actions,
.tcrn-knowledge-version-history__item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--tcrn-space-2);
}
.tcrn-knowledge-toc-rail nav {
  display: grid;
  gap: var(--tcrn-space-1);
}
.tcrn-knowledge-template-gallery {
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}
.tcrn-knowledge-template-gallery__card {
  display: grid;
  gap: var(--tcrn-space-2);
  min-width: 0;
}
.tcrn-knowledge-version-history__item {
  justify-content: flex-start;
}
.tcrn-knowledge-version-history__item > strong,
.tcrn-knowledge-search-results__head a,
.tcrn-knowledge-search-results__head span {
  min-width: 0;
  overflow-wrap: anywhere;
}
.tcrn-work-detail-layout__main,
.tcrn-work-detail-layout__rail,
.tcrn-work-detail-layout__activity {
  min-width: 0;
}
.tcrn-skip-link {
  position: fixed;
  z-index: 1000;
  top: var(--tcrn-space-3);
  left: var(--tcrn-space-3);
  transform: translateY(-150%);
  padding: var(--tcrn-space-2) var(--tcrn-space-3);
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-color-surface-panel);
  border: 1px solid var(--tcrn-color-border-control);
}
.tcrn-skip-link:focus {
  transform: translateY(0);
}
@media (max-width: 760px) {
  .tcrn-product-shell {
    --tcrn-product-shell-sidebar-width: 1fr;
    grid-template-columns: 1fr;
  }
  .tcrn-product-shell__sidebar {
    position: relative;
    height: auto;
    border-right: 0;
    border-bottom: 1px solid var(--tcrn-color-border-subtle);
  }
  .tcrn-product-shell__workspace > .tcrn-top-bar,
  .tcrn-top-bar {
    grid-template-columns: 1fr;
    align-items: stretch;
  }
  .tcrn-product-shell__utility-row {
    justify-content: stretch;
    align-items: stretch;
  }
  .tcrn-product-shell__current-location,
  .tcrn-shell-locale-menu {
    flex: 1 1 100%;
    margin-right: 0;
    max-width: none;
    width: 100%;
  }
  .tcrn-product-shell-search,
  .tcrn-product-shell-search[data-search-expanded="true"] {
    flex-basis: min(100%, 320px);
    margin-left: 0;
    justify-self: start;
    width: 320px;
    max-width: 320px;
  }
  .tcrn-product-shell__sidebar-header .tcrn-shell-side-nav-toggle {
    display: none;
  }
  .tcrn-work-board,
  .tcrn-work-hierarchy__levels,
  .tcrn-work-item-inspector__grid,
  .tcrn-work-page-header__body,
  .tcrn-work-item-row,
  .tcrn-work-item-row--compact,
  .tcrn-work-split-view,
  .tcrn-work-detail-layout__grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .tcrn-work-page-header__meta,
  .tcrn-work-page-header__actions,
  .tcrn-work-detail-layout__actions {
    justify-content: flex-start;
  }
  .tcrn-work-management-subnav > a,
  .tcrn-work-management-subnav > span,
  .tcrn-work-view-tabs > a,
  .tcrn-work-view-tabs > span,
  .tcrn-work-quick-filters > a,
  .tcrn-work-quick-filters > span {
    flex: 1 1 160px;
  }
  .tcrn-shell-locale-menu__trigger {
    width: 100%;
    max-width: none;
    justify-content: space-between;
  }
  .tcrn-product-shell__main {
    padding: var(--tcrn-space-4);
  }
  .tcrn-shell-brand-lockup__caption,
  .tcrn-product-logo__line-two {
    white-space: normal;
  }
  .tcrn-product-shell-section-grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .tcrn-key-value-list {
    grid-template-columns: 1fr;
  }
}
@media (prefers-reduced-motion: reduce) {
  /* Reduced motion means fewer and gentler animations, not none. Travel is what
     causes discomfort, so transform and position animation is removed; opacity and
     colour transitions stay, because they are how the interface says that something
     changed. Killing them outright leaves state changes to happen with no cue at
     all, which is a comprehension regression dressed up as an accessibility win. */
  .tcrn-product-shell,
  .tcrn-product-shell-search {
    transition: opacity var(--tcrn-motion-comprehension), background-color var(--tcrn-motion-comprehension), color var(--tcrn-motion-comprehension), border-color var(--tcrn-motion-comprehension);
  }
  .tcrn-product-shell[data-theme-switching="true"]::after {
    animation: none;
  }
  .tcrn-button,
  .tcrn-button.tcrn-shell-theme-toggle,
  .tcrn-nav-item,
  .tcrn-search-input,
  .tcrn-shell-theme-toggle__icon,
  .tcrn-shell-locale-menu__trigger,
  .tcrn-shell-locale-menu__chevron {
    transition: opacity var(--tcrn-motion-comprehension), background-color var(--tcrn-motion-comprehension), color var(--tcrn-motion-comprehension), border-color var(--tcrn-motion-comprehension);
  }
  /* No travel, and no press-scale either: scale is transform. */
  .tcrn-button:active,
  .tcrn-nav-item:active,
  .tcrn-shell-locale-menu__trigger:active {
    transform: none;
  }
}
`;
