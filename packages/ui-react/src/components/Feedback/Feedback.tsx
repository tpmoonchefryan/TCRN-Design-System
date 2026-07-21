import type { HTMLAttributes, ReactNode } from "react";
import {
  presentCopyState,
  sanitizeCopyStateLabel,
  type CopyStateInput,
  type CopyStatePresentation,
  type TcrnLocale
} from "@tcrn/ui-copy-state";
import { cx } from "../../utils.js";
import { Heading, Text } from "../Typography/index.js";
import { Surface } from "../Layout/index.js";

type Tone = "neutral" | "positive" | "warning" | "danger";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return <span {...props} className={cx("tcrn-badge", `tcrn-badge--${tone}`, className)} />;
}

/**
 * Identity moments in which a stamp is admitted. The list is closed on purpose: the
 * B「治理纸感」語彙 earns its weight by being rare, so it is bound to the three
 * points where the governed workflow records something irreversible.
 */
export type StampMoment = "gate-close" | "ruling" | "release";

export interface StampProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Which identity moment this stamp marks. */
  moment: StampMoment;
  /** The impression text, e.g. the gate name or the ruling id. */
  children: ReactNode;
}

/**
 * Stamp marks an identity moment — a gate closing, a ruling landing, a release being
 * accepted. It is the only component that may use the serif face and the oxblood ink.
 * Using it anywhere else is a design-system violation and is caught by
 * `pnpm stamp:proof`, not merely discouraged in prose.
 */
export function Stamp({ moment, className, ...props }: StampProps) {
  return <span {...props} data-stamp-moment={moment} className={cx("tcrn-stamp", className)} />;
}

/** The archival double rule that accompanies a stamped header. Decorative by design. */
export function StampRule({ className, ...props }: HTMLAttributes<HTMLHRElement>) {
  return <hr {...props} aria-hidden="true" className={cx("tcrn-stamp-rule", className)} />;
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

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "rectangular" | "circular";
  lines?: number;
}

export function Skeleton({ variant = "rectangular", lines = 1, className, ...props }: SkeletonProps) {
  const lineCount = Math.max(1, Math.floor(lines));
  if (lineCount === 1) {
    return (
      <div
        {...props}
        aria-hidden="true"
        className={cx("tcrn-skeleton", `tcrn-skeleton--${variant}`, className)}
        data-skeleton-variant={variant}
      />
    );
  }

  return (
    <div
      {...props}
      aria-hidden="true"
      className={cx("tcrn-skeleton-group", className)}
      data-skeleton-lines={lineCount}
      data-skeleton-variant={variant}
    >
      {Array.from({ length: lineCount }, (_, index) => (
        <span key={index} className={cx("tcrn-skeleton", `tcrn-skeleton--${variant}`)} />
      ))}
    </div>
  );
}

export interface EnvironmentBannerProps {
  label: string;
  state?: CopyStateInput;
  locale?: TcrnLocale | string;
}

export function EnvironmentBanner({ label, state = { state: "local_only" }, locale }: EnvironmentBannerProps) {
  const presentation = presentCopyState(state, locale);
  return (
    <div className="tcrn-environment-banner" data-state={presentation.state}>
      <strong>{label}</strong>
      <span>{presentation.label}</span>
    </div>
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

type StateSurfaceTone = Tone;

export interface StateSurfaceProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  tone?: StateSurfaceTone;
  headingLevel?: 2 | 3 | 4;
}

export function StateSurface({
  title,
  description,
  icon,
  action,
  tone = "neutral",
  headingLevel = 3,
  className,
  children,
  ...props
}: StateSurfaceProps) {
  return (
    <section {...props} className={cx("tcrn-state-surface", `tcrn-state-surface--${tone}`, className)} data-tone={tone}>
      {icon ? <div className="tcrn-state-surface__icon" aria-hidden="true">{icon}</div> : null}
      <Heading level={headingLevel} className="tcrn-state-surface__title">{title}</Heading>
      {description ? <Text className="tcrn-state-surface__description">{description}</Text> : null}
      {children}
      {action ? <div className="tcrn-state-surface__action">{action}</div> : null}
    </section>
  );
}

export type EmptyStateProps = Omit<StateSurfaceProps, "tone"> & {
  tone?: "neutral" | "warning";
};

export function EmptyState({ tone = "neutral", ...props }: EmptyStateProps) {
  return <StateSurface {...props} tone={tone} data-state-surface-kind="empty" />;
}

export type ErrorStateProps = Omit<StateSurfaceProps, "tone"> & {
  tone?: "danger" | "warning";
};

export function ErrorState({ tone = "danger", ...props }: ErrorStateProps) {
  return <StateSurface {...props} tone={tone} data-state-surface-kind="error" />;
}
