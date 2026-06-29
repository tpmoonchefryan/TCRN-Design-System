import type { AnchorHTMLAttributes, HTMLAttributes, ImgHTMLAttributes, ReactNode } from "react";
import { useId } from "react";
import { IconButton, type IconButtonProps } from "../Button/index.js";
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

export interface ProductLockupProps extends HTMLAttributes<HTMLDivElement> {
  suffix: string;
  suffixClassName?: string;
  brandMarkSrc?: string;
  brandMarkAlt?: string;
}

export function ProductLockup({ suffix, suffixClassName, brandMarkSrc, brandMarkAlt, className, ...props }: ProductLockupProps) {
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
  caption: string;
}

export function ShellBrandLockup({ caption, suffix, suffixClassName, brandMarkSrc, brandMarkAlt, className, ...props }: ShellBrandLockupProps) {
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

export interface ShellThemeToggleProps extends Omit<IconButtonProps, "ariaLabel" | "icon" | "iconName" | "children"> {
  currentTheme: ShellThemeMode;
  lightLabel?: string;
  darkLabel?: string;
}

export function ShellThemeToggle({
  currentTheme,
  lightLabel = "Switch to light mode",
  darkLabel = "Switch to dark mode",
  className,
  ...props
}: ShellThemeToggleProps) {
  const normalizedTheme = currentTheme === "dark" ? "dark" : "light";
  return (
    <IconButton
      {...props}
      ariaLabel={normalizedTheme === "dark" ? lightLabel : darkLabel}
      title={normalizedTheme === "dark" ? lightLabel : darkLabel}
      className={cx("tcrn-shell-theme-toggle", className)}
      data-shell-control="theme-toggle"
      data-package-backed-shell-control="theme-toggle"
      data-theme-toggle="true"
      data-current-theme={normalizedTheme}
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
}

export function ShellLocaleMenu({ locales, currentLocale, label = "Language", className, ...props }: ShellLocaleMenuProps) {
  const current = locales.find((entry) => entry.locale === currentLocale) ?? locales[0];
  const currentName = requiredText(current?.nativeName, currentLocale);
  return (
    <div
      {...props}
      className={cx("tcrn-shell-locale-menu", className)}
      data-shell-control="locale-menu"
      data-package-backed-shell-control="locale-menu"
      data-locale-control="native-name-menu"
    >
      <button
        className="tcrn-shell-locale-menu__trigger"
        type="button"
        data-locale-menu-toggle
        aria-haspopup="menu"
        aria-expanded="false"
        aria-label={label}
      >
        <Icon name="globe-2" />
        <span className="tcrn-shell-locale-menu__current" data-locale-current>{currentName}</span>
        <Icon name="chevron-down" className="tcrn-shell-locale-menu__chevron" />
      </button>
      <div className="tcrn-shell-locale-menu__panel" role="menu" data-locale-menu hidden>
        {locales.map((entry) => (
          <button key={entry.locale}
            className="tcrn-shell-locale-menu__option"
            type="button"
            role="menuitem"
            data-locale-option={entry.locale}
            data-locale-menu-option
            aria-current={entry.locale === currentLocale ? "true" : undefined}
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
  persistedKey?: string;
}

export function SideNavCollapseButton({
  collapsed,
  controls,
  expandedLabel = "Collapse side navigation",
  collapsedLabel = "Expand side navigation",
  persistedKey,
  className,
  ...props
}: SideNavCollapseButtonProps) {
  return (
    <IconButton
      {...props}
      ariaLabel={collapsed ? collapsedLabel : expandedLabel}
      title={collapsed ? collapsedLabel : expandedLabel}
      aria-controls={controls}
      aria-expanded={collapsed ? "false" : "true"}
      className={cx("tcrn-shell-side-nav-toggle", className)}
      data-shell-control="side-nav-collapse"
      data-package-backed-shell-control="side-nav-collapse"
      data-side-nav-toggle="true"
      data-side-nav-collapsed={String(collapsed)}
      data-side-nav-persisted-key={persistedKey}
      icon={
        <>
          <span className="tcrn-shell-side-nav-toggle__icon" data-side-nav-icon="collapse">
            <Icon name="panel-left-close" />
          </span>
          <span className="tcrn-shell-side-nav-toggle__icon" data-side-nav-icon="expand">
            <Icon name="panel-left-open" />
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

export function Pagination({ label }: { label: string }) {
  return <nav className="tcrn-pagination" aria-label={label} />;
}

export const tcrnComponentCss = `
:root {
  --tcrn-space-1: 4px;
  --tcrn-space-3: 12px;
  --tcrn-space-5: 20px;
  --tcrn-radius-panel: var(--tcrn-radius-surface);
  --tcrn-motion-duration-md: var(--tcrn-motion-emphasis);
  --tcrn-color-text-inverse: #ffffff;
  --tcrn-elevation-floating: 0 18px 42px rgba(23, 32, 51, 0.16);
}
[data-tcrn-theme="dark"] {
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
.tcrn-icon-button,
.tcrn-shell-theme-toggle,
.tcrn-shell-side-nav-toggle {
  inline-size: 38px;
  block-size: 38px;
  padding: 0;
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
.tcrn-shell-brand-lockup {
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
  color: var(--tcrn-color-brand-secondary);
}
.tcrn-brand-lockup--long-name .tcrn-brand-wordmark {
  display: grid;
  gap: 2px;
}
.tcrn-shell-brand-lockup__copy {
  display: grid;
  min-width: 0;
  gap: 2px;
}
.tcrn-shell-brand-lockup__caption {
  color: var(--tcrn-color-text-secondary);
  font-size: 12px;
  font-weight: var(--tcrn-type-weight-strong);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
.tcrn-nav-item[data-selected="true"],
.tcrn-nav-item[aria-current="page"] {
  color: var(--tcrn-color-text-primary);
  background: var(--tcrn-color-brand-primary-bg);
  border-color: color-mix(in srgb, var(--tcrn-color-brand-primary), transparent 64%);
}
.tcrn-nav-item:hover {
  background: var(--tcrn-color-surface-muted);
  color: var(--tcrn-color-text-primary);
}
.tcrn-nav-item__label {
  overflow-wrap: anywhere;
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
.tcrn-search-input__control {
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--tcrn-color-text-primary);
}
.tcrn-search-input__shortcut {
  color: var(--tcrn-color-text-muted);
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: 5px;
  padding: 1px 5px;
  font-size: 11px;
}
.tcrn-shell-locale-menu {
  position: relative;
}
.tcrn-shell-locale-menu__trigger {
  display: inline-flex;
  align-items: center;
  gap: var(--tcrn-space-2);
  max-width: 150px;
  min-height: 38px;
  padding: 0 var(--tcrn-space-3);
  border: 1px solid var(--tcrn-color-border-strong);
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-color-surface-panel);
  color: var(--tcrn-color-text-primary);
  font-weight: var(--tcrn-type-weight-strong);
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
  padding: var(--tcrn-space-4);
  overflow: hidden;
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
  .tcrn-shell-brand-lockup__caption {
    white-space: normal;
  }
  .tcrn-top-bar {
    grid-template-columns: 1fr;
    align-items: stretch;
  }
  .tcrn-key-value-list {
    grid-template-columns: 1fr;
  }
}
@media (prefers-reduced-motion: reduce) {
  .tcrn-button,
  .tcrn-nav-item,
  .tcrn-search-input,
  .tcrn-shell-locale-menu__trigger {
    transition: none;
  }
}
`;
