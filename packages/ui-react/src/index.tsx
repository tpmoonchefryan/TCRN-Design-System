import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactElement,
  ReactNode,
  RefObject,
  SelectHTMLAttributes,
  SVGProps,
  TextareaHTMLAttributes
} from "react";
import type { LucideIcon } from "lucide-react";
import { Children, cloneElement, forwardRef, isValidElement, useEffect, useId, useRef } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Database,
  ExternalLink,
  Home,
  Info,
  LoaderCircle,
  Menu,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  X
} from "lucide-react";
import {
  presentCopyState,
  sanitizeCopyStateLabel,
  type CopyStateInput,
  type CopyStatePresentation,
  type TcrnLocale
} from "@tcrn/ui-copy-state";

type Tone = "neutral" | "positive" | "warning" | "danger";
type Size = "sm" | "md";

export const componentLibraryPublicComponentNames = [
  "Button",
  "Icon",
  "IconButton",
  "LinkButton",
  "Field",
  "Input",
  "Textarea",
  "SearchInput",
  "Select",
  "Checkbox",
  "Badge",
  "StatusBadge",
  "StateView",
  "InlineAlert",
  "LiveRegion",
  "Skeleton",
  "EnvironmentBanner",
  "GateReadinessPanel",
  "EvidenceStrip",
  "ReadbackPanel",
  "Text",
  "Heading",
  "Surface",
  "Divider",
  "KeyValueList",
  "FilterBar",
  "TableShell",
  "WorkIndex",
  "DetailInspector",
  "Breadcrumb",
  "ModuleTabs",
  "SectionTabs",
  "SegmentedNav",
  "Pagination",
  "TopBar",
  "SideNav",
  "NavGroup",
  "NavItem",
  "ProductLauncher",
  "ProductSwitcher",
  "SkipLink",
  "DetailDrawer",
  "ActionDrawer",
  "Popover",
  "Dialog",
  "ConfirmActionDialog"
] as const;

export type ComponentLibraryPublicComponentName = (typeof componentLibraryPublicComponentNames)[number];

export const componentLibraryPublicUtilityNames = [
  "tcrnIconNames"
] as const;

export type ComponentLibraryPublicUtilityName = (typeof componentLibraryPublicUtilityNames)[number];

export const componentLibraryDeferredPrototypeNames = [
  "TcrnBrandMark",
  "ProductLockup",
  "ShellBrandLockup",
  "TmsDenseShellDemo",
  "KnowledgeBaseShellDemo",
  "CompactToolShellDemo"
] as const;

export type ComponentLibraryDeferredPrototypeName = (typeof componentLibraryDeferredPrototypeNames)[number];

export const tcrnIconNames = [
  "alert-triangle",
  "arrow-left",
  "arrow-right",
  "book-open",
  "check",
  "chevron-down",
  "chevron-left",
  "chevron-right",
  "database",
  "external-link",
  "home",
  "info",
  "loader-circle",
  "menu",
  "package",
  "panel-left-close",
  "panel-left-open",
  "search",
  "settings",
  "x"
] as const;

export type IconName = (typeof tcrnIconNames)[number];
type IconSize = "sm" | "md" | "lg" | number;

const tcrnIconRegistry: Record<IconName, LucideIcon> = {
  "alert-triangle": AlertTriangle,
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  "book-open": BookOpen,
  check: Check,
  "chevron-down": ChevronDown,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  database: Database,
  "external-link": ExternalLink,
  home: Home,
  info: Info,
  "loader-circle": LoaderCircle,
  menu: Menu,
  package: Package,
  "panel-left-close": PanelLeftClose,
  "panel-left-open": PanelLeftOpen,
  search: Search,
  settings: Settings,
  x: X
};

function cx(...classes: Array<string | undefined | false>): string {
  return classes.filter(Boolean).join(" ");
}

function requiredText(value: string | undefined, fallback: string): string {
  const normalized = value?.trim();
  return normalized ? normalized : fallback;
}

function mergeIds(...ids: Array<string | undefined>): string | undefined {
  const merged = ids.flatMap((id) => id?.split(/\s+/).filter(Boolean) ?? []);
  return merged.length > 0 ? Array.from(new Set(merged)).join(" ") : undefined;
}

function childPropsOf(element: ReactElement<Record<string, unknown>>): Record<string, unknown> {
  return element.props as Record<string, unknown>;
}

function iconSizeToPixels(size: IconSize): number {
  if (typeof size === "number") {
    return size;
  }
  return size === "sm" ? 14 : size === "lg" ? 20 : 16;
}

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  decorative?: boolean;
  size?: IconSize;
  title?: string;
}

export function Icon({ name, decorative = true, size = "md", title, className, ...props }: IconProps) {
  const SvgIcon = tcrnIconRegistry[name];
  const accessibleName = props["aria-label"] ?? title;
  const isDecorative = decorative && !accessibleName;
  return (
    <SvgIcon
      {...props}
      aria-hidden={isDecorative ? true : props["aria-hidden"]}
      aria-label={isDecorative ? undefined : accessibleName}
      role={isDecorative ? props.role : props.role ?? "img"}
      data-icon-name={name}
      className={cx("tcrn-icon", className)}
      focusable="false"
      size={iconSizeToPixels(size)}
      strokeWidth={props.strokeWidth ?? 2}
    />
  );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "quiet" | "danger";
  size?: Size;
  disabledReason?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = "md", className, disabledReason, children, ...props },
  ref
) {
  const normalizedReason = props.disabled ? requiredText(disabledReason, "Action unavailable in this route") : undefined;
  const disabledReasonId = useId();
  const ariaDescribedBy = mergeIds(props["aria-describedby"], normalizedReason ? disabledReasonId : undefined);
  return (
    <button
      {...props}
      ref={ref}
      title={normalizedReason ?? props.title}
      aria-describedby={ariaDescribedBy}
      data-disabled-reason={normalizedReason}
      className={cx("tcrn-button", `tcrn-button--${variant}`, `tcrn-button--${size}`, className)}
    >
      {children}
      {normalizedReason ? <span id={disabledReasonId} className="tcrn-sr-only">{normalizedReason}</span> : null}
    </button>
  );
});

export interface IconButtonProps extends ButtonProps {
  ariaLabel: string;
  icon?: ReactNode;
  iconName?: IconName;
}

export function IconButton({ ariaLabel, icon, iconName, children, ...props }: IconButtonProps) {
  const renderedIcon = icon ?? (iconName ? <Icon name={iconName} /> : null);
  return (
    <Button {...props} aria-label={requiredText(ariaLabel, "Unnamed icon action")} className={cx("tcrn-icon-button", props.className)}>
      {renderedIcon}
      {children ? <span className="tcrn-icon-button__label">{children}</span> : null}
    </Button>
  );
}

export interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "primary" | "secondary" | "quiet";
}

export function LinkButton({ variant = "secondary", className, ...props }: LinkButtonProps) {
  return <a {...props} className={cx("tcrn-link-button", `tcrn-link-button--${variant}`, className)} />;
}

export function Text({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} className={cx("tcrn-text", className)} />;
}

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4;
}

export function Heading({ level = 2, className, ...props }: HeadingProps) {
  const Tag = `h${level}` as const;
  return <Tag {...props} className={cx("tcrn-heading", `tcrn-heading--${level}`, className)} />;
}

export function Surface({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <section {...props} className={cx("tcrn-surface", className)} />;
}

export function Divider(props: HTMLAttributes<HTMLHRElement>) {
  return <hr {...props} className={cx("tcrn-divider", props.className)} />;
}

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return <span {...props} className={cx("tcrn-badge", `tcrn-badge--${tone}`, className)} />;
}

export interface StatusBadgeProps extends Omit<BadgeProps, "tone"> {
  state: CopyStateInput;
  locale?: TcrnLocale | string;
}

export function StatusBadge({ state, locale, children: _children, ...props }: StatusBadgeProps) {
  const presentation = presentCopyState(state, locale);
  return (
    <Badge {...props} tone={presentation.tone} data-state={presentation.state}>
      {presentation.label}
    </Badge>
  );
}

export interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export function Field({ label, hint, error, children }: FieldProps) {
  const hintId = useId();
  const errorId = useId();
  const describedBy = mergeIds(hint ? hintId : undefined, error ? errorId : undefined);
  const controls = Children.map(children, (child) => {
    if (!isValidElement(child)) {
      return child;
    }
    const childElement = child as ReactElement<Record<string, unknown>>;
    const props = childPropsOf(childElement);
    return cloneElement(childElement, {
      "aria-describedby": mergeIds(props["aria-describedby"] as string | undefined, describedBy),
      "aria-invalid": error ? true : props["aria-invalid"]
    });
  });
  return (
    <label
      className={cx("tcrn-field", error && "tcrn-field--error")}
      data-field-description={hint ? hintId : undefined}
      data-field-error={error ? errorId : undefined}
    >
      <span className="tcrn-field__label">{label}</span>
      {controls}
      {hint ? <span id={hintId} className="tcrn-field__hint">{hint}</span> : null}
      {error ? <span id={errorId} className="tcrn-field__error">{error}</span> : null}
    </label>
  );
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  disabledReason?: string;
}

export function Input({ className, disabled, disabledReason, title, ...props }: InputProps) {
  const normalizedReason = disabled ? requiredText(disabledReason, "Input unavailable in this route") : undefined;
  const disabledReasonId = useId();
  const ariaDescribedBy = mergeIds(props["aria-describedby"], normalizedReason ? disabledReasonId : undefined);
  return (
    <>
      <input
        {...props}
        disabled={disabled}
        title={normalizedReason ?? title}
        aria-describedby={ariaDescribedBy}
        data-disabled-reason={normalizedReason}
        className={cx("tcrn-input", className)}
      />
      {normalizedReason ? <span id={disabledReasonId} className="tcrn-sr-only">{normalizedReason}</span> : null}
    </>
  );
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  disabledReason?: string;
}

export function Textarea({ className, disabled, disabledReason, title, ...props }: TextareaProps) {
  const normalizedReason = disabled ? requiredText(disabledReason, "Textarea unavailable in this route") : undefined;
  const disabledReasonId = useId();
  const ariaDescribedBy = mergeIds(props["aria-describedby"], normalizedReason ? disabledReasonId : undefined);
  return (
    <>
      <textarea
        {...props}
        disabled={disabled}
        title={normalizedReason ?? title}
        aria-describedby={ariaDescribedBy}
        data-disabled-reason={normalizedReason}
        className={cx("tcrn-input", "tcrn-textarea", className)}
      />
      {normalizedReason ? <span id={disabledReasonId} className="tcrn-sr-only">{normalizedReason}</span> : null}
    </>
  );
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  disabledReason?: string;
}

export function Select({ options, className, disabled, disabledReason, title, ...props }: SelectProps) {
  const normalizedReason = disabled ? requiredText(disabledReason, "Select unavailable in this route") : undefined;
  const disabledReasonId = useId();
  const ariaDescribedBy = mergeIds(props["aria-describedby"], normalizedReason ? disabledReasonId : undefined);
  return (
    <>
      <select
        {...props}
        disabled={disabled}
        title={normalizedReason ?? title}
        aria-describedby={ariaDescribedBy}
        data-disabled-reason={normalizedReason}
        className={cx("tcrn-select", className)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {normalizedReason ? <span id={disabledReasonId} className="tcrn-sr-only">{normalizedReason}</span> : null}
    </>
  );
}

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  disabledReason?: string;
}

export function Checkbox({ className, disabled, disabledReason, title, ...props }: CheckboxProps) {
  const normalizedReason = disabled ? requiredText(disabledReason, "Checkbox unavailable in this route") : undefined;
  const disabledReasonId = useId();
  const ariaDescribedBy = mergeIds(props["aria-describedby"], normalizedReason ? disabledReasonId : undefined);
  return (
    <>
      <input
        {...props}
        type="checkbox"
        disabled={disabled}
        title={normalizedReason ?? title}
        aria-describedby={ariaDescribedBy}
        data-disabled-reason={normalizedReason}
        className={cx("tcrn-checkbox", className)}
      />
      {normalizedReason ? <span id={disabledReasonId} className="tcrn-sr-only">{normalizedReason}</span> : null}
    </>
  );
}

export interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  shortcut?: "auto" | string | false;
  disabledReason?: string;
}

export function SearchInput({ className, shortcut = false, disabled, disabledReason, title, ...props }: SearchInputProps) {
  const shortcutLabel = shortcut === false ? undefined : shortcut === "auto" ? "Ctrl K" : shortcut;
  const ariaKeyShortcuts = props["aria-keyshortcuts"] ?? (shortcutLabel ? "Control+K Meta+K" : undefined);
  const normalizedReason = disabled ? requiredText(disabledReason, "Search unavailable in this route") : undefined;
  const disabledReasonId = useId();
  const ariaDescribedBy = mergeIds(props["aria-describedby"], normalizedReason ? disabledReasonId : undefined);
  return (
    <span className="tcrn-search-input" data-search-input="true" data-shortcut-visible={shortcutLabel ? "true" : undefined}>
      <span className="tcrn-search-input__icon" aria-hidden="true">
        <Icon name="search" />
      </span>
      <input
        {...props}
        type="search"
        disabled={disabled}
        title={normalizedReason ?? title}
        aria-describedby={ariaDescribedBy}
        aria-keyshortcuts={ariaKeyShortcuts}
        data-disabled-reason={normalizedReason}
        className={cx("tcrn-input", "tcrn-search-input__control", className)}
      />
      {normalizedReason ? <span id={disabledReasonId} className="tcrn-sr-only">{normalizedReason}</span> : null}
      {shortcutLabel ? (
        <kbd className="tcrn-search-input__shortcut" data-shortcut-auto={shortcut === "auto" ? "search" : undefined} aria-hidden="true">
          {shortcutLabel}
        </kbd>
      ) : null}
    </span>
  );
}

export interface StateViewProps {
  state: CopyStateInput;
  title?: string;
  action?: ReactNode;
  locale?: TcrnLocale | string;
}

export function StateView({ state, title, action, locale }: StateViewProps) {
  const presentation = presentCopyState(state, locale);
  const heading = sanitizeCopyStateLabel(title, presentation.label);
  return (
    <section className={cx("tcrn-state-view", `tcrn-state-view--${presentation.tone}`)} data-state={presentation.state}>
      <Heading level={3}>{heading}</Heading>
      <Text>{presentation.description}</Text>
      {action}
    </section>
  );
}

export interface InlineAlertProps extends HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
}

export function InlineAlert({ tone = "neutral", className, ...props }: InlineAlertProps) {
  return <div role="status" {...props} className={cx("tcrn-inline-alert", `tcrn-inline-alert--${tone}`, className)} />;
}

export function LiveRegion({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div aria-live="polite" {...props} className={cx("tcrn-live-region", className)} />;
}

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden="true" {...props} className={cx("tcrn-skeleton", className)} />;
}

export interface EnvironmentBannerProps {
  label: string;
  state?: CopyStateInput;
}

export function EnvironmentBanner({ label, state = { state: "local_only" } }: EnvironmentBannerProps) {
  const presentation = presentCopyState(state);
  return (
    <div className="tcrn-environment-banner" data-state={presentation.state}>
      <strong>{label}</strong>
      <span>{presentation.label}</span>
    </div>
  );
}

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

export interface DrawerProps {
  title: string;
  open: boolean;
  children: ReactNode;
}

export function DetailDrawer({ title, open, children }: DrawerProps) {
  const titleId = useId();
  return (
    <aside className="tcrn-detail-drawer" aria-hidden={!open} aria-labelledby={titleId} data-modal-scope="structural-drawer" role="complementary" tabIndex={open ? -1 : undefined}>
      <Heading id={titleId} level={3}>{title}</Heading>
      {children}
    </aside>
  );
}

export function ActionDrawer({ title, open, children }: DrawerProps) {
  const titleId = useId();
  return (
    <aside className="tcrn-action-drawer" aria-hidden={!open} aria-labelledby={titleId} data-modal-scope="structural-drawer" role="complementary" tabIndex={open ? -1 : undefined}>
      <Heading id={titleId} level={3}>{title}</Heading>
      {children}
    </aside>
  );
}

export type PopoverPlacement = "bottom-start" | "bottom-end" | "top-start" | "top-end";

export interface PopoverProps {
  title: string;
  open: boolean;
  children: ReactNode;
  className?: string;
  placement?: PopoverPlacement;
  triggerRef?: RefObject<HTMLElement | null>;
  initialFocusRef?: RefObject<HTMLElement | null>;
  onOpenChange?: (open: boolean) => void;
}

export function Popover({ title, open, children, className, placement = "bottom-start", triggerRef, initialFocusRef, onOpenChange }: PopoverProps) {
  const titleId = useId();
  const popoverRef = useRef<HTMLElement>(null);
  const wasOpenRef = useRef(false);
  const supportsEscapeClose = Boolean(onOpenChange);
  const supportsFocusReturn = Boolean(triggerRef);

  useEffect(() => {
    if (!open) {
      return;
    }
    wasOpenRef.current = true;
    const focusTarget = initialFocusRef?.current ?? popoverRef.current;
    focusTarget?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange?.(false);
        window.setTimeout(() => triggerRef?.current?.focus(), 0);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [initialFocusRef, onOpenChange, open, triggerRef]);

  useEffect(() => {
    if (open || !wasOpenRef.current) {
      return;
    }
    wasOpenRef.current = false;
    window.setTimeout(() => triggerRef?.current?.focus(), 0);
  }, [open, triggerRef]);

  if (!open) {
    return null;
  }

  return (
    <section
      ref={popoverRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      className={cx("tcrn-popover", className)}
      data-overlay-scope="popover"
      data-placement={placement}
      data-focus-entry="implemented"
      data-tab-containment="not-implemented"
      data-escape-close={supportsEscapeClose ? "implemented" : "requires-on-open-change"}
      data-focus-return={supportsFocusReturn ? "implemented" : "requires-trigger-ref"}
      tabIndex={-1}
    >
      <Heading id={titleId} level={3}>{title}</Heading>
      {children}
    </section>
  );
}

export interface DialogProps {
  title: string;
  open: boolean;
  children: ReactNode;
  className?: string;
  triggerRef?: RefObject<HTMLElement | null>;
  initialFocusRef?: RefObject<HTMLElement | null>;
  onOpenChange?: (open: boolean) => void;
}

export function Dialog({ title, open, children, className, triggerRef, initialFocusRef, onOpenChange }: DialogProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const wasOpenRef = useRef(false);
  const supportsEscapeClose = Boolean(onOpenChange);
  const supportsFocusReturn = Boolean(triggerRef);

  useEffect(() => {
    if (!open) {
      return;
    }
    wasOpenRef.current = true;
    const focusTarget = initialFocusRef?.current ?? dialogRef.current;
    focusTarget?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange?.(false);
        window.setTimeout(() => triggerRef?.current?.focus(), 0);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [initialFocusRef, onOpenChange, open, triggerRef]);

  useEffect(() => {
    if (open || !wasOpenRef.current) {
      return;
    }
    wasOpenRef.current = false;
    window.setTimeout(() => triggerRef?.current?.focus(), 0);
  }, [open, triggerRef]);

  if (!open) {
    return null;
  }

  return (
    <section
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className={cx("tcrn-dialog", className)}
      data-focus-entry="implemented"
      data-tab-containment="not-implemented"
      data-escape-close={supportsEscapeClose ? "implemented" : "requires-on-open-change"}
      data-focus-return={supportsFocusReturn ? "implemented" : "requires-trigger-ref"}
      tabIndex={-1}
    >
      <Heading id={titleId} level={3}>{title}</Heading>
      {children}
    </section>
  );
}

export interface ConfirmActionDialogProps {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  disabled?: boolean;
}

export function ConfirmActionDialog({ title, message, confirmLabel, cancelLabel, disabled }: ConfirmActionDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  return (
    <Dialog title={title} open className="tcrn-confirm-dialog" initialFocusRef={cancelRef}>
      <Text>{message}</Text>
      <Button disabled={disabled} disabledReason={disabled ? "Action is blocked until an authorized route clears it" : undefined} variant="danger">
        {confirmLabel}
      </Button>
      <Button ref={cancelRef} variant="secondary">{cancelLabel}</Button>
    </Dialog>
  );
}

export interface TableColumn {
  key: string;
  label: string;
}

export interface TableShellProps {
  columns: TableColumn[];
  rows: Array<Record<string, ReactNode>>;
  emptyState?: ReactNode;
  label?: string;
}

type TableShellStyle = CSSProperties & {
  "--tcrn-table-column-count"?: number;
};

export function TableShell({ columns, rows, emptyState, label }: TableShellProps) {
  const columnCount = Math.max(columns.length, 1);
  const tableStyle: TableShellStyle = {
    "--tcrn-table-column-count": columnCount
  };

  return (
    <div className="tcrn-table-shell" role="table" aria-label={label} data-mobile-layout="stacked-cards" style={tableStyle} tabIndex={0}>
      <div role="row" className="tcrn-table-shell__head">
        {columns.map((column) => (
          <span key={column.key} role="columnheader">
            {column.label}
          </span>
        ))}
      </div>
      {rows.length === 0 ? (
        <div role="row" className="tcrn-table-shell__empty-row">
          <div role="cell" aria-colspan={columnCount} className="tcrn-table-shell__empty">
            {emptyState ?? "No rows"}
          </div>
        </div>
      ) : (
        rows.map((row, rowIndex) => (
          <div role="row" key={rowIndex} className="tcrn-table-shell__row">
            {columns.map((column) => (
              <span key={column.key} role="cell" data-label={column.label} className="tcrn-table-shell__cell">
                {row[column.key]}
              </span>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

export function Pagination({ label }: { label: string }) {
  return <nav className="tcrn-pagination" aria-label={label} />;
}

export interface KeyValueItem {
  key: string;
  label: string;
  value: ReactNode;
}

export function KeyValueList({ items }: { items: KeyValueItem[] }) {
  return (
    <dl className="tcrn-key-value-list">
      {items.map((item) => (
        <div key={item.key}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export interface WorkIndexRow {
  id: string;
  title: string;
  state: CopyStateInput;
  owner: string;
}

export function WorkIndex({ rows, label = "Work index" }: { rows: WorkIndexRow[]; label?: string }) {
  return (
    <TableShell
      label={label}
      columns={[
        { key: "title", label: "Work item" },
        { key: "state", label: "State" },
        { key: "owner", label: "Owner" }
      ]}
      rows={rows.map((row) => ({
        title: row.title,
        state: <StatusBadge state={row.state} />,
        owner: row.owner
      }))}
      emptyState={<StateView state={{ state: "not_configured" }} title="No work items" />}
    />
  );
}

export interface FilterBarProps {
  label: string;
  children: ReactNode;
}

export function FilterBar({ label, children }: FilterBarProps) {
  return (
    <section className="tcrn-filter-bar" aria-label={label}>
      {children}
    </section>
  );
}

export interface DetailInspectorProps {
  title: string;
  items: KeyValueItem[];
}

export function DetailInspector({ title, items }: DetailInspectorProps) {
  return (
    <Surface className="tcrn-detail-inspector">
      <Heading level={3}>{title}</Heading>
      <KeyValueList items={items} />
    </Surface>
  );
}

export function GateReadinessPanel({ state }: { state: CopyStatePresentation }) {
  const safeLabel = sanitizeCopyStateLabel(state.label, presentCopyState({ state: state.state }).label);
  return (
    <Surface className="tcrn-gate-readiness-panel" data-state={state.state}>
      <Heading level={3}>{safeLabel}</Heading>
      <Text>{state.description}</Text>
      <StatusBadge state={{ state: state.state }} />
    </Surface>
  );
}

export function EvidenceStrip({ items }: { items: string[] }) {
  return (
    <div className="tcrn-evidence-strip">
      {items.map((item) => (
        <Badge key={item}>{item}</Badge>
      ))}
    </div>
  );
}

export function ReadbackPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Surface className="tcrn-readback-panel">
      <Heading level={3}>{title}</Heading>
      {children}
    </Surface>
  );
}
