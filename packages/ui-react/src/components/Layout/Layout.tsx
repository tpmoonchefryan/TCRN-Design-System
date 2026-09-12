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
 * including when it is nested inside another shell.
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
