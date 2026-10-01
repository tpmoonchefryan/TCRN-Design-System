import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils.js";
import { Heading } from "../Typography/index.js";

export function Surface({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <section {...props} className={cx("tcrn-surface", className)} />;
}

export function Divider(props: HTMLAttributes<HTMLHRElement>) {
  return <hr {...props} className={cx("tcrn-divider", props.className)} />;
}

export interface AppStatusBarProps extends HTMLAttributes<HTMLElement> {
  state: ReactNode;
  command?: ReactNode;
  action?: ReactNode;
}

export function AppStatusBar({ state, command, action, className, role, ...props }: AppStatusBarProps) {
  return (
    <div {...props} className={cx("tcrn-app-status-bar", className)} role={role ?? "status"} data-app-status-bar="true">
      {command ? <span className="tcrn-app-status-bar__command">{command}</span> : null}
      <span className="tcrn-app-status-bar__state">{state}</span>
      {action ? <span className="tcrn-app-status-bar__action">{action}</span> : null}
    </div>
  );
}

export interface CollapsibleRegionProps extends HTMLAttributes<HTMLDivElement> {
  expanded: boolean;
  children: ReactNode;
}

export function CollapsibleRegion({ expanded, className, children, ...props }: CollapsibleRegionProps) {
  return (
    <div
      {...props}
      aria-hidden={!expanded}
      inert={expanded ? undefined : true}
      className={cx("tcrn-collapsible-region", className)}
      data-collapsible-region="true"
      data-expanded={expanded ? "true" : "false"}
      data-focus-when-collapsed="inert"
      data-reduced-motion="snap"
    >
      <div className="tcrn-collapsible-region__inner">{children}</div>
    </div>
  );
}

export interface DisclosurePanelProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  expanded: boolean;
  title?: ReactNode;
  headingLevel?: 2 | 3 | 4;
  children: ReactNode;
}

export function DisclosurePanel({ expanded, title, headingLevel = 3, className, children, ...props }: DisclosurePanelProps) {
  return (
    <section
      {...props}
      className={cx("tcrn-disclosure-panel", className)}
      data-disclosure-panel="true"
      data-disclosure-scope="controlled-region"
      data-expanded={expanded ? "true" : "false"}
    >
      {title ? <Heading level={headingLevel} className="tcrn-disclosure-panel__title">{title}</Heading> : null}
      <CollapsibleRegion expanded={expanded}>{children}</CollapsibleRegion>
    </section>
  );
}

export interface SettingsLayoutProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Compact, local navigation for the settings surface. */
  navigation: ReactNode;
  navigationLabel: string;
  /** The single host selector shown before the host's complete configuration. */
  hostSwitcher?: ReactNode;
  contentLabel: string;
  children: ReactNode;
}

/**
 * A container-query-driven settings composition.
 *
 * The frame starts as one column so a narrow host never receives a clipped
 * two-host form. At the package's admitted frame width it gains a compact local
 * navigation column and one complete content column. The content column owns a
 * second container query so SettingRow stacks when its actual space is tight,
 * including when it is nested inside another shell. Direct SettingRow children
 * share the complete form's label, control, and tools tracks. SettingRowList
 * owns those shared tracks for an explicit group before those rows stack.
 */
export function SettingsLayout({
  navigation,
  navigationLabel,
  hostSwitcher,
  contentLabel,
  children,
  className,
  ...props
}: SettingsLayoutProps) {
  return (
    <div
      {...props}
      className={cx("tcrn-settings-layout", className)}
      data-settings-layout="true"
      data-settings-layout-mode="container-driven"
      data-settings-layout-form-policy="single-host-single-column"
      data-settings-layout-breakpoint="960px"
      data-settings-content-breakpoint="720px"
      data-settings-local-navigation="compact"
      data-settings-overflow-policy="no-page-overflow"
      data-settings-long-value-policy="native-inline-scroll-copy"
    >
      <div className="tcrn-settings-layout__frame">
        <div className="tcrn-settings-layout__grid">
          <aside className="tcrn-settings-layout__nav" aria-label={navigationLabel} data-settings-local-nav="true">
            {navigation}
          </aside>
          <div className="tcrn-settings-layout__content" aria-label={contentLabel} data-settings-content="true">
            {hostSwitcher ? <div className="tcrn-settings-layout__host-switcher">{hostSwitcher}</div> : null}
            <div className="tcrn-settings-layout__form" data-settings-complete-form="true">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export type PageHierarchyDepth = "two" | "three";

export interface PageHierarchyProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "content"> {
  /** Explicit business/page depth; width never infers or changes this value. */
  depth: PageHierarchyDepth;
  /** The page-level Header, separate from the global ProductShell topbar. */
  header: ReactNode;
  /** The parent-level horizontal sub-navigation shown below the Header. */
  sectionTabs: ReactNode;
  /** Only a third-level page may supply an internal local navigation slot. */
  localNavigation?: ReactNode;
  localNavigationLabel?: string;
  /** Two-level content sits below section tabs; three-level content sits beside local navigation. */
  content: ReactNode;
  contentLabel: string;
}

/**
 * Encodes the page hierarchy before applying container-responsive presentation.
 *
 * A two-level page is always Header -> parent tabs -> lower content. A three-level
 * page is Header -> parent tabs -> selected-subpage local navigation/content. The
 * global ProductShell topbar is outside this composition and never contributes a
 * page depth. The explicit depth prop is intentionally visible in the DOM so a
 * consumer proof can compare actual structure, not a depth-shaped class name.
 */
export function PageHierarchy({
  depth,
  header,
  sectionTabs,
  localNavigation,
  localNavigationLabel = "Local navigation",
  content,
  contentLabel,
  className,
  ...props
}: PageHierarchyProps) {
  const isThirdLevel = depth === "three";
  const validation = isThirdLevel
    ? localNavigation ? "valid" : "missing-third-level-local-navigation"
    : localNavigation ? "unexpected-third-level-local-navigation" : "valid";
  return (
    <div
      {...props}
      className={cx("tcrn-page-hierarchy", className)}
      data-page-hierarchy="true"
      data-page-hierarchy-depth={depth}
      data-page-hierarchy-source="explicit-depth-prop"
      data-page-hierarchy-width-policy="container-only"
      data-page-hierarchy-shell-boundary="global-product-shell-external"
      data-page-hierarchy-valid={validation === "valid" ? "true" : "false"}
      data-page-hierarchy-validation={validation}
    >
      <div className="tcrn-page-hierarchy__header" data-page-hierarchy-region="header" data-page-hierarchy-slot="header">
        {header}
      </div>
      <div className="tcrn-page-hierarchy__section-tabs" data-page-hierarchy-region="section-tabs" data-page-hierarchy-slot="section-tabs">
        {sectionTabs}
      </div>
      {isThirdLevel ? (
        <div className="tcrn-page-hierarchy__third-level-frame" data-page-hierarchy-region="third-level">
          <div className="tcrn-page-hierarchy__third-level">
            <aside className="tcrn-page-hierarchy__local-navigation" aria-label={localNavigationLabel} data-page-hierarchy-slot="local-navigation">
              {localNavigation}
            </aside>
            <div className="tcrn-page-hierarchy__content" aria-label={contentLabel} data-page-hierarchy-slot="content">
              {content}
            </div>
          </div>
        </div>
      ) : (
        <div className="tcrn-page-hierarchy__lower-content" aria-label={contentLabel} data-page-hierarchy-region="lower-content" data-page-hierarchy-slot="content">
          {content}
        </div>
      )}
    </div>
  );
}
