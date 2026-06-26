import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { useId } from "react";
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
