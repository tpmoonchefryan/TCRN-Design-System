// In-paper composite layout and segmented pill navigation stylesheet rules.
// Never use backticks inside the CSS template literal.

export const layoutCss = `
/* Surface and Divider */
.tcrn-surface {
  --tcrn-pair-surface-fill: var(--tcrn-color-panel);
  --tcrn-pair-surface-ink: var(--tcrn-color-ink);
  --tcrn-pair-surface-edge: var(--tcrn-elevation-s1);
  --tcrn-color-surface: var(--tcrn-color-panel);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: var(--tcrn-space-3h);
  min-inline-size: 0;
  padding: var(--tcrn-space-4);
  border-radius: var(--tcrn-radius-panel);
  background-color: var(--tcrn-pair-surface-fill);
  color: var(--tcrn-pair-surface-ink);
  box-shadow: var(--tcrn-pair-surface-edge);
}
.tcrn-surface__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--tcrn-space-3);
  flex-wrap: wrap;
  min-inline-size: 0;
}
.tcrn-surface__head-content {
  flex: 1 1 auto;
  min-inline-size: 0;
}
.tcrn-surface__head-actions {
  display: inline-flex;
  align-items: center;
  gap: var(--tcrn-space-2);
  flex: 0 0 auto;
  min-inline-size: 0;
}
.tcrn-divider {
  box-sizing: border-box;
  inline-size: 100%;
  block-size: 1px;
  margin: 0;
  border: 0;
  background-color: var(--tcrn-color-line);
}
/* AppStatusBar */
.tcrn-app-status-bar {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--tcrn-space-2h);
  flex-wrap: wrap;
  min-inline-size: 0;
  padding: var(--tcrn-space-2) var(--tcrn-space-3);
  border-radius: var(--tcrn-radius-control);
  background-color: var(--tcrn-color-panel-2);
  color: var(--tcrn-color-ink-2);
  box-shadow: inset 0 0 0 1px var(--tcrn-color-line);
  font-size: var(--tcrn-type-size-meta);
  line-height: var(--tcrn-type-line-caption);
}
.tcrn-app-status-bar__command {
  font-family: var(--tcrn-type-family-mono);
  color: var(--tcrn-color-ink);
}
.tcrn-app-status-bar__state {
  flex: 1 1 auto;
  min-inline-size: 0;
}
.tcrn-app-status-bar__action {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
}
/* CollapsibleRegion and DisclosurePanel */
.tcrn-collapsible-region {
  box-sizing: border-box;
  min-inline-size: 0;
}
.tcrn-collapsible-region[data-expanded="false"],
.tcrn-collapsible-region[hidden] {
  display: none;
}
.tcrn-collapsible-region__inner {
  display: flex;
  flex-direction: column;
  gap: var(--tcrn-space-2h);
  min-inline-size: 0;
}
.tcrn-disclosure-panel {
  display: flex;
  flex-direction: column;
  gap: var(--tcrn-space-2h);
  min-inline-size: 0;
}
.tcrn-disclosure-panel__title {
  margin: 0;
}
/* SettingsLayout: 1040px centred paper composition with container-query collapse */
.tcrn-settings-layout {
  box-sizing: border-box;
  inline-size: min(100%, 1040px);
  margin-inline: auto;
  min-inline-size: 0;
}
.tcrn-settings-layout__frame {
  container-type: inline-size;
  container-name: tcrn-settings-layout;
  inline-size: 100%;
  min-inline-size: 0;
}
.tcrn-settings-layout__grid {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: var(--tcrn-space-4);
  align-items: start;
  min-inline-size: 0;
}
.tcrn-settings-layout__nav {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: var(--tcrn-space-0h);
  min-inline-size: 0;
  padding: var(--tcrn-space-2);
  border-radius: var(--tcrn-radius-panel);
  background-color: var(--tcrn-color-panel-2);
  box-shadow: inset 0 0 0 1px var(--tcrn-color-line);
}
.tcrn-settings-layout__content {
  container-type: inline-size;
  container-name: tcrn-settings-content;
  display: flex;
  flex-direction: column;
  gap: var(--tcrn-space-4);
  min-inline-size: 0;
}
.tcrn-settings-layout__host-switcher {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--tcrn-space-3);
  flex-wrap: wrap;
  min-inline-size: 0;
  padding: var(--tcrn-space-3) var(--tcrn-space-3h);
  border-radius: var(--tcrn-radius-panel);
  background-color: var(--tcrn-color-panel-2);
  box-shadow: inset 0 0 0 1px var(--tcrn-color-line);
}
.tcrn-settings-layout__form {
  display: flex;
  flex-direction: column;
  gap: var(--tcrn-space-3h);
  min-inline-size: 0;
}
@container tcrn-settings-layout (max-width: 720px) {
  .tcrn-settings-layout__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
/* PageHierarchy */
.tcrn-page-hierarchy {
  display: flex;
  flex-direction: column;
  gap: var(--tcrn-space-4);
  min-inline-size: 0;
}
.tcrn-page-hierarchy__header,
.tcrn-page-hierarchy__section-tabs,
.tcrn-page-hierarchy__lower-content,
.tcrn-page-hierarchy__content {
  min-inline-size: 0;
}
.tcrn-page-hierarchy__third-level-frame {
  container-type: inline-size;
  container-name: tcrn-page-hierarchy;
  inline-size: 100%;
  min-inline-size: 0;
}
.tcrn-page-hierarchy__third-level {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: var(--tcrn-space-4);
  align-items: start;
  min-inline-size: 0;
}
.tcrn-page-hierarchy__local-navigation {
  min-inline-size: 0;
}
@container tcrn-page-hierarchy (max-width: 720px) {
  .tcrn-page-hierarchy__third-level {
    grid-template-columns: minmax(0, 1fr);
  }
}
/* SplitView: equal-height dual columns with container-query collapse */
.tcrn-split-view-frame {
  container-type: inline-size;
  container-name: tcrn-split-view;
  inline-size: 100%;
  min-inline-size: 0;
}
.tcrn-split-view {
  display: grid;
  grid-template-columns: minmax(260px, 0.92fr) minmax(0, 1.08fr);
  align-items: stretch;
  gap: var(--tcrn-space-4);
  min-inline-size: 0;
}
.tcrn-split-view--compact {
  gap: var(--tcrn-space-3);
}
.tcrn-split-view--comfortable {
  gap: var(--tcrn-space-4);
}
.tcrn-split-view--dense {
  gap: var(--tcrn-space-2);
}
.tcrn-split-view__list,
.tcrn-split-view__detail {
  display: flex;
  flex-direction: column;
  min-inline-size: 0;
  min-block-size: 100%;
}
.tcrn-split-view__list > :only-child,
.tcrn-split-view__detail > :only-child {
  flex: 1 1 auto;
}
@container tcrn-split-view (max-width: 720px) {
  .tcrn-split-view {
    grid-template-columns: minmax(0, 1fr);
  }
  .tcrn-split-view[data-detail-populated="false"] > .tcrn-split-view__detail {
    display: none;
  }
  .tcrn-split-view[data-detail-populated="true"] > .tcrn-split-view__detail {
    order: -1;
  }
}
/* SegmentedNav: pill track and raised active segment without underline */
.tcrn-tabs.tcrn-tabs--segmented,
.tcrn-segmented-nav {
  box-sizing: border-box;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: var(--tcrn-space-0h);
  inline-size: fit-content;
  max-inline-size: 100%;
  min-inline-size: 0;
  padding: var(--tcrn-space-0h);
  border: 0;
  border-radius: var(--tcrn-radius-control);
  background-color: var(--tcrn-color-wash);
}
.tcrn-tabs.tcrn-tabs--segmented .tcrn-tabs__tab,
.tcrn-segmented-nav .tcrn-tabs__tab {
  --tcrn-pair-seg-fill-d: transparent;
  --tcrn-pair-seg-fill-h: var(--tcrn-color-hover);
  --tcrn-pair-seg-fill-s: var(--tcrn-color-panel);
  --tcrn-pair-seg-ink-d: var(--tcrn-color-ink-2);
  --tcrn-pair-seg-ink-h: var(--tcrn-color-ink);
  --tcrn-pair-seg-ink-s: var(--tcrn-color-ink);
  --tcrn-pair-seg-edge-d: 0 0 #0000;
  --tcrn-pair-seg-edge-s: var(--tcrn-elevation-s1);
  --tcrn-pair-seg-edge-f: var(--tcrn-focus-ring);
  --tcrn-pair-seg-fill: var(--tcrn-pair-seg-fill-d);
  --tcrn-pair-seg-ink: var(--tcrn-pair-seg-ink-d);
  --tcrn-pair-seg-edge: var(--tcrn-pair-seg-edge-d);
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-inline-size: 0;
  block-size: var(--tcrn-control-height-sm);
  padding: 0 var(--tcrn-control-padding-md);
  border: 0;
  border-radius: var(--tcrn-radius-sm);
  background-color: var(--tcrn-pair-seg-fill);
  color: var(--tcrn-pair-seg-ink);
  box-shadow: var(--tcrn-pair-seg-edge);
  font-family: var(--tcrn-type-family-ui);
  font-size: var(--tcrn-type-size-control-sm);
  font-weight: var(--tcrn-type-weight-medium);
  line-height: var(--tcrn-type-line-ui);
  transition:
    background-color var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease),
    color var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease),
    box-shadow var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease);
}
.tcrn-tabs.tcrn-tabs--segmented .tcrn-tabs__tab:where(:hover, [data-tcrn-preview-state="hover"]),
.tcrn-segmented-nav .tcrn-tabs__tab:where(:hover, [data-tcrn-preview-state="hover"]) {
  --tcrn-pair-seg-fill: var(--tcrn-pair-seg-fill-h);
  --tcrn-pair-seg-ink: var(--tcrn-pair-seg-ink-h);
}
.tcrn-tabs.tcrn-tabs--segmented .tcrn-tabs__tab:where([aria-current="page"], [aria-selected="true"], [data-selected="true"]),
.tcrn-segmented-nav .tcrn-tabs__tab:where([aria-current="page"], [aria-selected="true"], [data-selected="true"]) {
  --tcrn-pair-seg-fill: var(--tcrn-pair-seg-fill-s);
  --tcrn-pair-seg-ink: var(--tcrn-pair-seg-ink-s);
  --tcrn-pair-seg-edge: var(--tcrn-pair-seg-edge-s);
  font-weight: var(--tcrn-type-weight-strong);
}
.tcrn-tabs.tcrn-tabs--segmented .tcrn-tabs__tab:where(:focus-visible, [data-tcrn-preview-state="focus"]),
.tcrn-segmented-nav .tcrn-tabs__tab:where(:focus-visible, [data-tcrn-preview-state="focus"]) {
  --tcrn-pair-seg-edge: var(--tcrn-pair-seg-edge-f);
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.tcrn-tabs.tcrn-tabs--segmented .tcrn-tabs__tab:where([aria-current="page"], [aria-selected="true"], [data-selected="true"]):where(:focus-visible, [data-tcrn-preview-state="focus"]),
.tcrn-segmented-nav .tcrn-tabs__tab:where([aria-current="page"], [aria-selected="true"], [data-selected="true"]):where(:focus-visible, [data-tcrn-preview-state="focus"]) {
  --tcrn-pair-seg-edge: var(--tcrn-focus-ring), var(--tcrn-elevation-s1);
}
.tcrn-tabs.tcrn-tabs--segmented .tcrn-tabs__tab::after,
.tcrn-tabs.tcrn-tabs--segmented .tcrn-tabs__tab[aria-selected="true"]::after,
.tcrn-tabs.tcrn-tabs--segmented .tcrn-tabs__tab[aria-current="page"]::after,
.tcrn-segmented-nav .tcrn-tabs__tab::after,
.tcrn-segmented-nav .tcrn-tabs__tab[aria-selected="true"]::after,
.tcrn-segmented-nav .tcrn-tabs__tab[aria-current="page"]::after {
  display: none;
  content: none;
}
@media (prefers-reduced-motion: reduce) {
  .tcrn-tabs.tcrn-tabs--segmented .tcrn-tabs__tab,
  .tcrn-segmented-nav .tcrn-tabs__tab {
    transition: none;
  }
}
`;
