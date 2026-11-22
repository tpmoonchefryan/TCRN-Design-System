// DataDisplay segments of tcrnComponentCss: Card, Avatar, StatCard, TableShell,
// TableToolbar, FilterBar, RecordTable, RecordRow, KeyValueList, StagePipeline, and RawPayloadBox.
// Surface (.tcrn-surface*) and Divider (.tcrn-divider*) are owned by Layout.
// Never use backticks inside the CSS template literal.

export const dataDisplayCss = `
.tcrn-card {
  --tcrn-pair-fill: var(--tcrn-color-panel);
  --tcrn-pair-ink: var(--tcrn-color-ink);
  --tcrn-pair-edge: inset 0 0 0 1px var(--tcrn-color-line-2);
  display: flex;
  flex-direction: column;
  gap: var(--tcrn-space-2);
  min-width: 0;
  padding: var(--tcrn-space-3) var(--tcrn-space-4);
  border-radius: var(--tcrn-radius-panel);
  background: var(--tcrn-pair-fill);
  color: var(--tcrn-pair-ink);
  box-shadow: var(--tcrn-pair-edge);
}

.tcrn-card--neutral {
  --tcrn-pair-fill: var(--tcrn-color-panel);
  --tcrn-pair-edge: inset 0 0 0 1px var(--tcrn-color-line-2);
}

.tcrn-card--raised {
  --tcrn-pair-fill: var(--tcrn-color-panel);
  --tcrn-pair-edge: var(--tcrn-elevation-s1);
}

.tcrn-card--quiet {
  --tcrn-pair-fill: var(--tcrn-color-wash);
  --tcrn-pair-edge: 0 0 #0000;
}

.tcrn-card--interactive {
  cursor: pointer;
  transition:
    background-color var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease),
    box-shadow var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease);
}

.tcrn-card--interactive:hover {
  --tcrn-pair-fill: var(--tcrn-color-hover);
}

.tcrn-card--interactive:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: var(--tcrn-focus-ring);
}

.tcrn-avatar {
  --tcrn-pair-fill: var(--tcrn-color-av-bg);
  --tcrn-pair-ink: var(--tcrn-color-av-ink);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  inline-size: var(--tcrn-control-height-md);
  block-size: var(--tcrn-control-height-md);
  border-radius: var(--tcrn-radius-pill);
  background: var(--tcrn-pair-fill);
  color: var(--tcrn-pair-ink);
  font-family: var(--tcrn-type-family-ui);
  font-size: var(--tcrn-type-size-meta);
  font-weight: var(--tcrn-type-weight-strong);
  line-height: 1;
  overflow: hidden;
  user-select: none;
}

.tcrn-avatar--sm,
.tcrn-avatar--small {
  inline-size: var(--tcrn-control-height-sm);
  block-size: var(--tcrn-control-height-sm);
  font-size: var(--tcrn-type-size-caption);
}

.tcrn-avatar--md,
.tcrn-avatar--medium {
  inline-size: var(--tcrn-control-height-md);
  block-size: var(--tcrn-control-height-md);
  font-size: var(--tcrn-type-size-meta);
}

.tcrn-avatar--lg,
.tcrn-avatar--large {
  inline-size: var(--tcrn-control-height-lg);
  block-size: var(--tcrn-control-height-lg);
  font-size: var(--tcrn-type-size-ui);
}

.tcrn-avatar__image {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
  display: block;
}

.tcrn-stat-card {
  --tcrn-pair-fill: var(--tcrn-color-panel);
  --tcrn-pair-ink: var(--tcrn-color-ink);
  --tcrn-pair-edge: inset 0 0 0 1px var(--tcrn-color-line-2);
  display: flex;
  flex-direction: column;
  gap: var(--tcrn-space-1);
  min-width: 0;
  padding: var(--tcrn-space-3) var(--tcrn-space-4);
  border-radius: var(--tcrn-radius-panel);
  background: var(--tcrn-pair-fill);
  color: var(--tcrn-pair-ink);
  box-shadow: var(--tcrn-pair-edge);
}

.tcrn-stat-card--neutral {
  --tcrn-pair-fill: var(--tcrn-color-panel);
  --tcrn-pair-ink: var(--tcrn-color-ink);
}

.tcrn-stat-card--positive {
  --tcrn-pair-fill: var(--tcrn-color-ok-bg);
  --tcrn-pair-ink: var(--tcrn-color-ok);
}

.tcrn-stat-card--warning {
  --tcrn-pair-fill: var(--tcrn-color-warn-bg);
  --tcrn-pair-ink: var(--tcrn-color-warn);
}

.tcrn-stat-card--danger {
  --tcrn-pair-fill: var(--tcrn-color-bad-bg);
  --tcrn-pair-ink: var(--tcrn-color-bad);
}

.tcrn-stat-card--accent {
  --tcrn-pair-fill: var(--tcrn-color-acc-bg);
  --tcrn-pair-ink: var(--tcrn-color-acc);
}

.tcrn-stat-card__label {
  color: var(--tcrn-color-ink-3);
  font-size: var(--tcrn-type-size-meta);
  font-weight: var(--tcrn-type-weight-medium);
}

.tcrn-stat-card__value {
  color: var(--tcrn-pair-ink);
  font-size: var(--tcrn-type-size-heading-2);
  font-weight: var(--tcrn-type-weight-strong);
  line-height: var(--tcrn-type-line-heading-2);
  font-variant-numeric: tabular-nums;
}

.tcrn-stat-card__note {
  color: var(--tcrn-color-ink-2);
  font-size: var(--tcrn-type-size-meta);
}

.tcrn-table-shell {
  display: block;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  overflow-x: auto;
  border-radius: var(--tcrn-radius-panel);
  background: var(--tcrn-color-panel);
  box-shadow: inset 0 0 0 1px var(--tcrn-color-line-2);
}

.tcrn-table-shell:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: var(--tcrn-focus-ring);
}

.tcrn-table-shell__head,
.tcrn-table-shell__row {
  display: grid;
  grid-template-columns: var(--tcrn-table-shell-columns);
  min-width: var(--tcrn-table-shell-min-width, 100%);
  align-items: center;
  gap: var(--tcrn-space-2);
  padding: var(--tcrn-space-2) var(--tcrn-space-3);
}

.tcrn-table-shell__head {
  border-bottom: 1px solid var(--tcrn-color-line-2);
  color: var(--tcrn-color-ink-3);
  font-size: var(--tcrn-type-size-caption);
  font-weight: var(--tcrn-type-weight-medium);
  letter-spacing: var(--tcrn-type-tracking-caps);
  text-transform: uppercase;
}

.tcrn-table-shell__row {
  border-bottom: 1px solid var(--tcrn-color-line);
  color: var(--tcrn-color-ink-2);
  font-size: var(--tcrn-type-size-ui);
}

.tcrn-table-shell__row:last-child {
  border-bottom: 0;
}

.tcrn-table-shell__row[data-selected="true"] {
  background: var(--tcrn-color-wash);
  color: var(--tcrn-color-ink);
}

.tcrn-table-shell__cell,
.tcrn-table-shell__head > span {
  min-width: 0;
  overflow-wrap: anywhere;
}

.tcrn-table-shell__cell[data-align="center"],
.tcrn-table-shell__head > span[data-align="center"] {
  text-align: center;
  justify-self: center;
}

.tcrn-table-shell__cell[data-align="end"],
.tcrn-table-shell__head > span[data-align="end"] {
  text-align: end;
  justify-self: end;
}

.tcrn-table-shell__select-header,
.tcrn-table-shell__cell--select {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.tcrn-table-shell__empty {
  padding: var(--tcrn-space-4);
  color: var(--tcrn-color-ink-3);
  text-align: center;
}

.tcrn-table-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--tcrn-space-2);
  min-width: 0;
}

.tcrn-filter-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--tcrn-space-1h);
  min-width: 0;
}

.tcrn-table-toolbar__chip,
.tcrn-table-toolbar__collapse,
.tcrn-table-toolbar__clear-selection {
  display: inline-flex;
  align-items: center;
  height: var(--tcrn-control-height-sm);
  padding: 0 var(--tcrn-control-padding-sm);
  border: 0;
  border-radius: var(--tcrn-radius-pill);
  background: var(--tcrn-color-wash);
  color: var(--tcrn-color-ink-2);
  font-family: var(--tcrn-type-family-ui);
  font-size: var(--tcrn-type-size-control-sm);
  cursor: pointer;
}

.tcrn-table-toolbar__chip[aria-pressed="true"] {
  background: var(--tcrn-color-acc-bg);
  color: var(--tcrn-color-acc);
  font-weight: var(--tcrn-type-weight-medium);
}

.tcrn-table-toolbar__bulk {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--tcrn-space-2);
  padding: var(--tcrn-space-1) var(--tcrn-space-2);
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-color-acc-bg);
  color: var(--tcrn-color-acc);
}

.tcrn-table-toolbar__selected-count {
  font-size: var(--tcrn-type-size-meta);
  font-weight: var(--tcrn-type-weight-medium);
}

.tcrn-table-toolbar__count {
  margin-inline-start: auto;
  color: var(--tcrn-color-ink-3);
  font-size: var(--tcrn-type-size-meta);
}

.tcrn-record-table {
  display: flex;
  flex-direction: column;
  min-width: 0;
  max-width: 100%;
  border-radius: var(--tcrn-radius-panel);
  background: var(--tcrn-color-panel);
  box-shadow: inset 0 0 0 1px var(--tcrn-color-line-2);
  overflow: hidden;
}

.tcrn-record-table__head {
  display: flex;
  align-items: center;
  gap: var(--tcrn-space-2);
  padding: var(--tcrn-space-2) var(--tcrn-space-3);
  border-bottom: 1px solid var(--tcrn-color-line-2);
  color: var(--tcrn-color-ink-3);
  font-size: var(--tcrn-type-size-meta);
}

.tcrn-record-table__row-item {
  display: flex;
  align-items: center;
  gap: var(--tcrn-space-2);
  padding-inline-start: var(--tcrn-space-3);
  border-bottom: 1px solid var(--tcrn-color-line);
}

.tcrn-record-table__row-item > .tcrn-record-row {
  flex: 1;
  border-bottom: 0;
}

.tcrn-record-table__row-item[data-selected="true"] {
  background: var(--tcrn-color-wash);
}

.tcrn-record-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--tcrn-space-2) var(--tcrn-space-3);
  min-width: 0;
  padding: var(--tcrn-space-2h) var(--tcrn-space-3);
  border-bottom: 1px solid var(--tcrn-color-line);
  color: var(--tcrn-color-ink);
  text-decoration: none;
}

.tcrn-record-row:last-child {
  border-bottom: 0;
}

.tcrn-record-row[data-selected="true"] {
  background: var(--tcrn-color-wash);
}

.tcrn-record-row__summary {
  display: flex;
  flex-direction: column;
  gap: var(--tcrn-space-0h);
  min-width: 0;
  flex: 1;
}

.tcrn-record-row__meta,
.tcrn-record-row__relationships {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--tcrn-space-1h);
  min-width: 0;
}

.tcrn-key-value-list {
  display: grid;
  gap: var(--tcrn-space-2);
  margin: 0;
  min-width: 0;
}

.tcrn-key-value-list > div {
  display: grid;
  grid-template-columns: minmax(120px, max-content) minmax(0, 1fr);
  gap: var(--tcrn-space-2) var(--tcrn-space-4);
  align-items: baseline;
  padding-bottom: var(--tcrn-space-2);
  border-bottom: 1px solid var(--tcrn-color-line);
  min-width: 0;
}

.tcrn-key-value-list > div:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.tcrn-key-value-list dt {
  color: var(--tcrn-color-ink-3);
  font-size: var(--tcrn-type-size-meta);
  font-weight: var(--tcrn-type-weight-medium);
}

.tcrn-key-value-list dd {
  margin: 0;
  min-width: 0;
  color: var(--tcrn-color-ink);
  overflow-wrap: anywhere;
}

.tcrn-stage-pipeline {
  display: flex;
  flex-direction: column;
  gap: var(--tcrn-space-3);
  min-width: 0;
  max-width: 100%;
}

.tcrn-stage-pipeline__references {
  display: flex;
  flex-wrap: wrap;
  gap: var(--tcrn-space-1);
  min-width: 0;
}

.tcrn-raw-payload {
  display: flex;
  flex-direction: column;
  min-width: 0;
  max-width: 100%;
  border-radius: var(--tcrn-radius-panel);
  background: var(--tcrn-color-panel-2);
  box-shadow: inset 0 0 0 1px var(--tcrn-color-line-2);
  overflow: hidden;
}

.tcrn-raw-payload__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--tcrn-space-2);
  padding: var(--tcrn-space-2) var(--tcrn-space-3);
  border-bottom: 1px solid var(--tcrn-color-line);
  min-width: 0;
}

.tcrn-raw-payload__label {
  color: var(--tcrn-color-ink-2);
  font-size: var(--tcrn-type-size-meta);
  font-weight: var(--tcrn-type-weight-medium);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tcrn-raw-payload__actions {
  display: inline-flex;
  align-items: center;
  gap: var(--tcrn-space-1h);
  flex: 0 0 auto;
}

.tcrn-raw-payload__pre {
  margin: 0;
  padding: var(--tcrn-space-3);
  min-width: 0;
  max-width: 100%;
  overflow: auto;
  white-space: pre;
  font-family: var(--tcrn-type-family-mono);
  font-size: var(--tcrn-type-size-meta);
  line-height: var(--tcrn-type-line-ui);
  color: var(--tcrn-color-ink);
}
`;
