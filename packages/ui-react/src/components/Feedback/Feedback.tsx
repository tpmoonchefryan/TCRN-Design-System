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
