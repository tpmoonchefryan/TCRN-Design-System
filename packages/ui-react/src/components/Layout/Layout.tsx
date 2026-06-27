import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils.js";
import { Heading } from "../Typography/index.js";

export function Surface({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <section {...props} className={cx("tcrn-surface", className)} />;
}

export function Divider(props: HTMLAttributes<HTMLHRElement>) {
  return <hr {...props} className={cx("tcrn-divider", props.className)} />;
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
