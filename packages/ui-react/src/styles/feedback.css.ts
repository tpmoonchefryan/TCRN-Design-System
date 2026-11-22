// Feedback segments of tcrnComponentCss: Badge, StatusBadge, StatusDot, InlineAlert,
// EnvironmentBanner, StateSurface, EmptyState, ErrorState, StateView, Toast, Skeleton,
// OperationFeedback, StatusSummaryPanel, ReadbackPanel, and Stamp.
// Never use backticks inside the CSS template literal.

export const feedbackCss = `
.tcrn-badge,
.tcrn-inline-alert,
.tcrn-environment-banner,
.tcrn-state-surface,
.tcrn-state-view,
.tcrn-toast {
  --tcrn-pair-fill: var(--tcrn-color-wash);
  --tcrn-pair-ink: var(--tcrn-color-ink-2);
  --tcrn-pair-edge: inset 0 0 0 1px var(--tcrn-color-line);
}

.tcrn-badge--neutral,
.tcrn-inline-alert--neutral,
.tcrn-environment-banner--neutral,
.tcrn-state-surface--neutral,
.tcrn-state-view--neutral,
.tcrn-toast--neutral {
  --tcrn-pair-fill: var(--tcrn-color-wash);
  --tcrn-pair-ink: var(--tcrn-color-ink-2);
  --tcrn-pair-edge: inset 0 0 0 1px var(--tcrn-color-line);
}

.tcrn-badge--positive,
.tcrn-inline-alert--positive,
.tcrn-environment-banner--positive,
.tcrn-state-surface--positive,
.tcrn-state-view--positive,
.tcrn-toast--positive {
  --tcrn-pair-fill: var(--tcrn-color-ok-bg);
  --tcrn-pair-ink: var(--tcrn-color-ok);
  --tcrn-pair-edge: inset 0 0 0 1px var(--tcrn-color-line);
}

.tcrn-badge--warning,
.tcrn-inline-alert--warning,
.tcrn-environment-banner--warning,
.tcrn-state-surface--warning,
.tcrn-state-view--warning,
.tcrn-toast--warning {
  --tcrn-pair-fill: var(--tcrn-color-warn-bg);
  --tcrn-pair-ink: var(--tcrn-color-warn);
  --tcrn-pair-edge: inset 0 0 0 1px var(--tcrn-color-line);
}

.tcrn-badge--danger,
.tcrn-inline-alert--danger,
.tcrn-environment-banner--danger,
.tcrn-state-surface--danger,
.tcrn-state-view--danger,
.tcrn-toast--danger {
  --tcrn-pair-fill: var(--tcrn-color-bad-bg);
  --tcrn-pair-ink: var(--tcrn-color-bad);
  --tcrn-pair-edge: inset 0 0 0 1px var(--tcrn-color-line);
}

.tcrn-badge--accent,
.tcrn-inline-alert--accent,
.tcrn-environment-banner--accent,
.tcrn-state-surface--accent,
.tcrn-state-view--accent {
  --tcrn-pair-fill: var(--tcrn-color-acc-bg);
  --tcrn-pair-ink: var(--tcrn-color-acc);
  --tcrn-pair-edge: inset 0 0 0 1px var(--tcrn-color-line);
}

.tcrn-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--tcrn-space-1);
  max-width: 100%;
  min-width: 0;
  padding: var(--tcrn-space-0h) var(--tcrn-space-2);
  border-radius: var(--tcrn-radius-pill);
  background: var(--tcrn-pair-fill);
  color: var(--tcrn-pair-ink);
  box-shadow: var(--tcrn-pair-edge);
  font-family: var(--tcrn-type-family-ui);
  font-size: var(--tcrn-type-size-meta);
  font-weight: var(--tcrn-type-weight-medium);
  line-height: var(--tcrn-type-line-caption);
  white-space: nowrap;
}

.tcrn-badge__label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tcrn-badge--wrap,
.tcrn-badge--wrap .tcrn-badge__label {
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
}

.tcrn-status-dot {
  --tcrn-pair-ink: var(--tcrn-color-ink-2);
  --tcrn-pair-dot: var(--tcrn-color-ink-3);
  display: inline-flex;
  align-items: center;
  gap: var(--tcrn-space-1h);
  min-width: 0;
  color: var(--tcrn-pair-ink);
  font-family: var(--tcrn-type-family-ui);
  font-size: var(--tcrn-type-size-meta);
  font-weight: var(--tcrn-type-weight-medium);
  line-height: var(--tcrn-type-line-ui);
}

.tcrn-status-dot--neutral {
  --tcrn-pair-ink: var(--tcrn-color-ink-2);
  --tcrn-pair-dot: var(--tcrn-color-ink-3);
}

.tcrn-status-dot--positive {
  --tcrn-pair-ink: var(--tcrn-color-ok);
  --tcrn-pair-dot: var(--tcrn-color-ok);
}

.tcrn-status-dot--warning {
  --tcrn-pair-ink: var(--tcrn-color-warn);
  --tcrn-pair-dot: var(--tcrn-color-warn);
}

.tcrn-status-dot--danger {
  --tcrn-pair-ink: var(--tcrn-color-bad);
  --tcrn-pair-dot: var(--tcrn-color-bad);
}

.tcrn-status-dot--accent {
  --tcrn-pair-ink: var(--tcrn-color-acc);
  --tcrn-pair-dot: var(--tcrn-color-acc);
}

.tcrn-status-dot__dot {
  flex: 0 0 auto;
  inline-size: var(--tcrn-space-1h);
  block-size: var(--tcrn-space-1h);
  border-radius: var(--tcrn-radius-pill);
  background: var(--tcrn-pair-dot);
}

.tcrn-status-dot__label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tcrn-inline-alert {
  display: flex;
  align-items: flex-start;
  gap: var(--tcrn-space-2);
  min-width: 0;
  padding: var(--tcrn-space-2) var(--tcrn-space-3);
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-pair-fill);
  color: var(--tcrn-pair-ink);
  box-shadow: var(--tcrn-pair-edge);
  font-size: var(--tcrn-type-size-ui);
  line-height: var(--tcrn-type-line-ui);
}

.tcrn-environment-banner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--tcrn-space-2);
  min-width: 0;
  padding: var(--tcrn-space-2) var(--tcrn-space-3);
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-pair-fill);
  color: var(--tcrn-pair-ink);
  box-shadow: var(--tcrn-pair-edge);
  font-size: var(--tcrn-type-size-meta);
  line-height: var(--tcrn-type-line-ui);
}

.tcrn-state-surface,
.tcrn-state-view {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--tcrn-space-2);
  min-width: 0;
  padding: var(--tcrn-space-4);
  border-radius: var(--tcrn-radius-panel);
  background: var(--tcrn-pair-fill);
  color: var(--tcrn-pair-ink);
  box-shadow: var(--tcrn-pair-edge);
}

.tcrn-state-surface__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--tcrn-pair-ink);
}

.tcrn-state-surface__title {
  margin: 0;
  color: var(--tcrn-color-ink);
}

.tcrn-state-surface__description {
  margin: 0;
  color: var(--tcrn-color-ink-2);
}

.tcrn-state-surface__action {
  display: flex;
  flex-wrap: wrap;
  gap: var(--tcrn-space-2);
  margin-top: var(--tcrn-space-1);
}

.tcrn-toast {
  display: inline-flex;
  align-items: center;
  gap: var(--tcrn-space-2h);
  min-width: 0;
  max-width: 100%;
  padding: var(--tcrn-space-2) var(--tcrn-space-3);
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-color-panel);
  color: var(--tcrn-pair-ink);
  box-shadow: var(--tcrn-pair-edge), var(--tcrn-elevation-s2);
  font-size: var(--tcrn-type-size-ui);
  line-height: var(--tcrn-type-line-ui);
}

.tcrn-toast__message {
  min-width: 0;
  flex: 1;
}

.tcrn-toast__dismiss {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  padding: var(--tcrn-space-1);
  border: 0;
  border-radius: var(--tcrn-radius-sm);
  background: transparent;
  color: var(--tcrn-color-ink-2);
  cursor: pointer;
}

.tcrn-toast__dismiss:hover {
  background: var(--tcrn-color-hover);
  color: var(--tcrn-color-ink);
}

.tcrn-toast__dismiss:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: var(--tcrn-focus-ring);
}

.tcrn-skeleton-group {
  display: flex;
  flex-direction: column;
  gap: var(--tcrn-space-2);
  min-width: 0;
}

.tcrn-skeleton {
  display: block;
  min-width: 0;
  block-size: var(--tcrn-space-4);
  border-radius: var(--tcrn-radius-sm);
  background: var(--tcrn-color-wash);
}

.tcrn-skeleton--text {
  block-size: var(--tcrn-space-3);
}

.tcrn-skeleton--circular {
  inline-size: var(--tcrn-control-height-md);
  block-size: var(--tcrn-control-height-md);
  border-radius: var(--tcrn-radius-pill);
}

.tcrn-operation-feedback {
  display: flex;
  flex-direction: column;
  gap: var(--tcrn-space-2);
  min-width: 0;
  padding: var(--tcrn-space-3);
  border-radius: var(--tcrn-radius-panel);
  background: var(--tcrn-color-panel);
  box-shadow: inset 0 0 0 1px var(--tcrn-color-line-2);
}

.tcrn-operation-feedback__summary {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--tcrn-space-2);
  min-width: 0;
}

.tcrn-operation-feedback__identity {
  display: flex;
  flex-wrap: wrap;
  gap: var(--tcrn-space-2) var(--tcrn-space-3);
  margin: 0;
  min-width: 0;
  flex: 1;
}

.tcrn-operation-feedback__identity-row {
  display: inline-flex;
  align-items: baseline;
  gap: var(--tcrn-space-1);
  min-width: 0;
}

.tcrn-operation-feedback__identity-row dt {
  color: var(--tcrn-color-ink-3);
  font-size: var(--tcrn-type-size-meta);
}

.tcrn-operation-feedback__identity-value {
  margin: 0;
  min-width: 0;
  overflow-wrap: anywhere;
}

.tcrn-operation-feedback__details-trigger {
  flex: 0 0 auto;
  height: var(--tcrn-control-height-sm);
  padding: 0 var(--tcrn-control-padding-sm);
  border: 0;
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-color-wash);
  color: var(--tcrn-color-ink);
  font-family: var(--tcrn-type-family-ui);
  font-size: var(--tcrn-type-size-control-sm);
  cursor: pointer;
}

.tcrn-operation-feedback__details-trigger:hover {
  background: var(--tcrn-color-hover);
}

.tcrn-operation-feedback__details-body {
  min-width: 0;
  overflow-wrap: anywhere;
}

.tcrn-stamp {
  display: inline-flex;
  align-items: center;
  padding: var(--tcrn-space-0h) var(--tcrn-space-2);
  border-radius: var(--tcrn-radius-stamp);
  background: var(--tcrn-color-red-bg);
  color: var(--tcrn-color-red);
  box-shadow: inset 0 0 0 1px var(--tcrn-color-line);
  font-family: var(--tcrn-type-family-heading);
  font-size: var(--tcrn-type-size-meta);
  font-weight: var(--tcrn-type-weight-medium);
}

.tcrn-stamp-rule {
  border: 0;
  border-top: 1px solid var(--tcrn-color-line-2);
  margin: var(--tcrn-space-2) 0;
}
`;
