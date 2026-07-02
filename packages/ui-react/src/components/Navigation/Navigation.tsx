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
    lineTwo: "Component Library",
    alt: "TCRN Design System"
  },
  aos: {
    productId: "aos",
    assetId: "tcrn-aos-two-line",
    lineOne: "TCRN AOS",
    lineTwo: "AI Operation System",
    alt: "TCRN AOS AI Operation System"
  },
  tms: {
    productId: "tms",
    assetId: "tcrn-tms-two-line",
    lineOne: "TCRN TMS",
    lineTwo: "Talent Management System",
    alt: "TCRN TMS Talent Management System"
  }
} as const;

export type TcrnProductLogoId = keyof typeof tcrnProductLogoRegistry;
export type TcrnProductLogoAssetId = (typeof tcrnProductLogoRegistry)[TcrnProductLogoId]["assetId"];

export function getTcrnProductLogoAsset(productId: TcrnProductLogoId) {
  return tcrnProductLogoRegistry[productId];
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
      className={cx("tcrn-product-logo", className)}
      aria-label={asset.alt}
      data-component-source="@tcrn/ui-react"
      data-registered-product-logo="@tcrn/ui-react/ProductLogo"
      data-product-id={asset.productId}
      data-product-logo-asset-id={asset.assetId}
    >
      <TcrnBrandMark src={brandMarkSrc} alt={brandMarkAlt ?? asset.alt} />
      <span className="tcrn-product-logo__copy" aria-hidden="true">
        <span className="tcrn-product-logo__line-one">{asset.lineOne}</span>
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
  const isLongSuffix = productSuffix.length > 8;

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
  meta?: string;
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
  href: string;
  iconName?: IconName;
  selected?: boolean;
  disabled?: boolean;
  disabledReason?: string;
}

export interface ProductShellNavGroup {
  id: string;
  label: string;
  description?: string;
  sectionLabel?: string;
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
  currentLocationLabel?: string;
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
  currentLocationLabel = "Current location",
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
              >
                {group.items.map((item) => (
                  <NavItem key={item.id}
                    href={item.href}
                    iconName={item.iconName}
                    selected={item.selected}
                    disabled={item.disabled}
                    disabledReason={item.disabledReason}
                    data-product-shell-route={item.id}
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
            <div className="tcrn-product-shell__current-location">
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
  --tcrn-space-1: 4px;
  --tcrn-space-3: 12px;
  --tcrn-space-5: 20px;
  --tcrn-radius-panel: var(--tcrn-radius-surface);
  --tcrn-motion-product-shell: var(--tcrn-motion-emphasis);
  --tcrn-motion-product-shell-search: 320ms cubic-bezier(0.2, 0, 0.2, 1);
  --tcrn-color-brand-secondary-readable: #246f80;
  --tcrn-color-text-inverse: #ffffff;
  --tcrn-elevation-floating: 0 18px 42px rgba(23, 32, 51, 0.16);
}
[data-tcrn-theme="dark"] {
  --tcrn-color-brand-secondary-readable: #a6e8ef;
  --tcrn-elevation-floating: 0 18px 42px rgba(0, 0, 0, 0.34);
}
.tcrn-button,
.tcrn-shell-locale-menu__trigger,
.tcrn-shell-locale-menu__option {
  font: inherit;
}
.tcrn-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--tcrn-space-2);
  min-height: 38px;
  padding: 0 var(--tcrn-space-3);
  border: 1px solid var(--tcrn-color-border-strong);
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-color-surface-panel);
  color: var(--tcrn-color-text-primary);
  font-size: var(--tcrn-type-size-ui);
  font-weight: var(--tcrn-type-weight-strong);
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
.tcrn-shell-theme-toggle {
  position: relative;
  inline-size: 36px;
  block-size: 36px;
  min-inline-size: 36px;
  min-block-size: 36px;
  min-height: 36px;
  padding: 0;
  overflow: hidden;
  border-radius: 999px;
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
.tcrn-shell-locale-menu__trigger:hover,
.tcrn-shell-locale-menu__trigger[aria-expanded="true"] {
  border-color: var(--tcrn-color-border-strong);
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
  display: inline-flex;
  align-items: center;
  min-width: 0;
  gap: var(--tcrn-space-3);
}
.tcrn-brand-mark {
  display: block;
  inline-size: 38px;
  block-size: 38px;
  flex: 0 0 auto;
}
.tcrn-brand-wordmark {
  display: inline-flex;
  align-items: baseline;
  min-width: 0;
  gap: var(--tcrn-space-2);
  color: var(--tcrn-color-text-primary);
  font-weight: 800;
  line-height: 1;
}
.tcrn-brand-wordmark__base {
  letter-spacing: 0;
}
.tcrn-brand-wordmark__suffix {
  color: var(--tcrn-color-brand-secondary-readable);
}
.tcrn-brand-lockup--long-name .tcrn-brand-wordmark {
  display: grid;
  gap: 2px;
}
.tcrn-shell-brand-lockup__copy,
.tcrn-product-logo__copy {
  display: grid;
  min-width: 0;
  gap: 2px;
}
.tcrn-product-logo__line-one {
  color: var(--tcrn-color-text-primary);
  font-size: var(--tcrn-type-size-ui);
  font-weight: 800;
  line-height: var(--tcrn-type-line-ui);
  white-space: nowrap;
}
.tcrn-shell-brand-lockup__caption,
.tcrn-product-logo__line-two {
  color: var(--tcrn-color-text-secondary);
  font-size: 12px;
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
  border-radius: 999px;
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
  gap: 1px;
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
  gap: 2px;
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
  font-size: 12px;
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
  font-size: 11px;
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
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr) max-content;
  align-items: center;
  gap: var(--tcrn-space-2);
  min-height: 38px;
  padding: 0 var(--tcrn-space-3);
  border: 1px solid var(--tcrn-color-border-strong);
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-color-surface-panel);
}
.tcrn-search-input__icon {
  grid-column: 1;
}
.tcrn-search-input__control {
  appearance: none;
  box-sizing: border-box;
  grid-column: 2;
  width: 100%;
  min-width: 0;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--tcrn-color-text-primary);
  font: inherit;
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
  border-radius: 6px;
  background: var(--tcrn-color-surface-muted);
  padding: 2px 6px;
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
  padding: 0 10px;
  border: 1px solid var(--tcrn-color-border-strong);
  border-radius: 999px;
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
  font-size: 22px;
}
.tcrn-heading--3 {
  font-size: 16px;
}
.tcrn-text {
  margin: var(--tcrn-space-2) 0 0;
  color: var(--tcrn-color-text-secondary);
}
.tcrn-badge {
  display: inline-flex;
  align-items: center;
  width: max-content;
  min-height: 24px;
  padding: 3px var(--tcrn-space-2);
  border-radius: 999px;
  font-size: 12px;
  font-weight: var(--tcrn-type-weight-strong);
  background: var(--tcrn-color-surface-muted);
  color: var(--tcrn-color-text-secondary);
}
.tcrn-badge--warning {
  background: var(--tcrn-color-state-warning-bg);
  color: var(--tcrn-color-text-primary);
}
.tcrn-badge--positive {
  background: var(--tcrn-color-state-ready-bg);
  color: var(--tcrn-color-state-ready);
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
  gap: 3px;
  padding: var(--tcrn-space-2);
  border-radius: var(--tcrn-radius-panel);
  background: var(--tcrn-color-surface-muted);
}
.tcrn-key-value-list dt {
  color: var(--tcrn-color-text-secondary);
  font-size: 12px;
}
.tcrn-key-value-list dd {
  margin: 0;
  font-weight: var(--tcrn-type-weight-strong);
}
.tcrn-table-shell {
  display: grid;
  overflow: auto;
}
.tcrn-table-shell__head,
.tcrn-table-shell__row {
  display: grid;
  grid-template-columns: var(--tcrn-table-shell-columns, repeat(auto-fit, minmax(140px, 1fr)));
  min-width: var(--tcrn-table-shell-min-width, 720px);
}
.tcrn-table-shell__head {
  position: sticky;
  top: 0;
  background: var(--tcrn-color-surface-muted);
  color: var(--tcrn-color-text-secondary);
  font-size: 12px;
  font-weight: var(--tcrn-type-weight-strong);
}
.tcrn-table-shell__head span,
.tcrn-table-shell__cell {
  padding: var(--tcrn-space-3);
  border-bottom: 1px solid var(--tcrn-color-border-subtle);
}
.tcrn-table-shell__row:last-child .tcrn-table-shell__cell {
  border-bottom: 0;
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
  font-size: 11px;
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
  font-size: 12px;
  line-height: 1.35;
  overflow-wrap: anywhere;
  word-break: break-word;
}
.tcrn-machine-token__copy {
  min-height: 28px;
  padding: 2px var(--tcrn-space-2);
}
.tcrn-work-management-subnav,
.tcrn-saved-view-toolbar,
.tcrn-gate-pipeline,
.tcrn-evidence-attachment-list,
.tcrn-work-hierarchy,
.tcrn-work-item-inspector {
  min-width: 0;
}
.tcrn-work-management-subnav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--tcrn-space-2);
}
.tcrn-work-management-subnav a,
.tcrn-work-management-subnav span {
  display: inline-flex;
  align-items: center;
  gap: var(--tcrn-space-2);
  min-height: 32px;
  padding: 4px var(--tcrn-space-3);
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-control);
  color: var(--tcrn-color-text-primary);
  text-decoration: none;
  background: var(--tcrn-color-surface-panel);
}
.tcrn-work-management-subnav [data-selected="true"] {
  border-color: var(--tcrn-color-border-strong);
  background: var(--tcrn-color-brand-primary-bg);
}
.tcrn-saved-view-toolbar {
  display: grid;
  gap: var(--tcrn-space-3);
}
.tcrn-work-board {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--tcrn-space-3);
  min-width: 0;
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
  gap: var(--tcrn-space-2);
  min-width: 0;
  padding: var(--tcrn-space-3);
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
.tcrn-work-board__relations,
.tcrn-work-item-inspector__relationships {
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
.tcrn-skip-link {
  position: fixed;
  z-index: 1000;
  top: var(--tcrn-space-3);
  left: var(--tcrn-space-3);
  transform: translateY(-150%);
  padding: var(--tcrn-space-2) var(--tcrn-space-3);
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-color-surface-panel);
  border: 1px solid var(--tcrn-color-border-strong);
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
  .tcrn-work-item-inspector__grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .tcrn-work-management-subnav a,
  .tcrn-work-management-subnav span {
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
  .tcrn-product-shell,
  .tcrn-product-shell-search {
    transition: none;
  }
  .tcrn-product-shell[data-theme-switching="true"]::after {
    animation: none;
  }
  .tcrn-button,
  .tcrn-nav-item,
  .tcrn-search-input,
  .tcrn-shell-theme-toggle__icon,
  .tcrn-shell-locale-menu__trigger,
  .tcrn-shell-locale-menu__chevron {
    transition: none;
  }
}
`;
