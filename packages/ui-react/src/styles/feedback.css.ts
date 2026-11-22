// Feedback segments of tcrnComponentCss: Badge, StatusBadge, StatusDot, InlineAlert,
// EnvironmentBanner, StateSurface, EmptyState, and ErrorState.
// Never use backticks inside the CSS template literal.

export const feedbackCss = `
.tcrn-badge,
.tcrn-inline-alert,
.tcrn-environment-banner,
.tcrn-state-surface {
  --tcrn-pair-fill: var(--tcrn-color-wash);
  --tcrn-pair-ink: var(--tcrn-color-ink-2);
  --tcrn-pair-edge: inset 0 0 0 1px var(--tcrn-color-line);
}

.tcrn-badge--neutral,
.tcrn-inline-alert--neutral,
.tcrn-environment-banner--neutral,
.tcrn-state-surface--neutral {
  --tcrn-pair-fill: var(--tcrn-color-wash);
  --tcrn-pair-ink: var(--tcrn-color-ink-2);
  --tcrn-pair-edge: inset 0 0 0 1px var(--tcrn-color-line);
}

.tcrn-badge--positive,
.tcrn-inline-alert--positive,
.tcrn-environment-banner--positive,
.tcrn-state-surface--positive {
  --tcrn-pair-fill: var(--tcrn-color-ok-bg);
  --tcrn-pair-ink: var(--tcrn-color-ok);
  --tcrn-pair-edge: inset 0 0 0 1px var(--tcrn-color-line);
}

.tcrn-badge--warning,
.tcrn-inline-alert--warning,
.tcrn-environment-banner--warning,
.tcrn-state-surface--warning {
  --tcrn-pair-fill: var(--tcrn-color-warn-bg);
  --tcrn-pair-ink: var(--tcrn-color-warn);
  --tcrn-pair-edge: inset 0 0 0 1px var(--tcrn-color-line);
}

.tcrn-badge--danger,
.tcrn-inline-alert--danger,
.tcrn-environment-banner--danger,
.tcrn-state-surface--danger {
  --tcrn-pair-fill: var(--tcrn-color-bad-bg);
  --tcrn-pair-ink: var(--tcrn-color-bad);
  --tcrn-pair-edge: inset 0 0 0 1px var(--tcrn-color-line);
}

.tcrn-badge--accent,
.tcrn-inline-alert--accent,
.tcrn-environment-banner--accent,
.tcrn-state-surface--accent {
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

.tcrn-status-dot--unlabelled {
  gap: 0;
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

.tcrn-state-surface {
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
`;
