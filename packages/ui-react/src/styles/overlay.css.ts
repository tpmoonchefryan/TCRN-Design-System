// Anchored floating overlay, tooltip, modal confirmation and inline confirmation stylesheet rules.
// Never use backticks inside the CSS template literal.

export const overlayCss = `
/* Menu: floating command list with state-pair items, subtitles and danger tone */
.tcrn-menu {
  --tcrn-color-surface: var(--tcrn-color-panel);
  box-sizing: border-box;
  z-index: var(--tcrn-z-popover);
  display: flex;
  flex-direction: column;
  gap: var(--tcrn-space-0h);
  min-inline-size: 200px;
  max-inline-size: min(360px, calc(100vw - var(--tcrn-space-4)));
  max-block-size: calc(100vh - var(--tcrn-space-4));
  padding: var(--tcrn-space-1h);
  margin: 0;
  overflow: auto;
  border-radius: var(--tcrn-radius-panel);
  background-color: var(--tcrn-color-panel);
  color: var(--tcrn-color-ink);
  box-shadow: var(--tcrn-elevation-s2);
}
.tcrn-menu.tcrn-multi-select-dropdown__list {
  min-inline-size: 0;
  max-inline-size: calc(100vw - var(--tcrn-space-4));
}
.tcrn-menu[hidden] {
  display: none;
}
.tcrn-menu[data-overlay-positioning="portal-fixed"],
.tcrn-menu[data-overlay-positioning="static-fixed"] {
  position: fixed;
}
.tcrn-menu__item {
  box-sizing: border-box;
  min-inline-size: 0;
  padding: var(--tcrn-space-1h) var(--tcrn-space-2h);
  border: 0;
  border-radius: var(--tcrn-radius-control);
  cursor: pointer;
}
.tcrn-menu__item:where(:not(.tcrn-multi-select-dropdown__option)) {
  --tcrn-pair-menu-fill-d: transparent;
  --tcrn-pair-menu-fill-h: var(--tcrn-color-hover);
  --tcrn-pair-menu-fill-a: var(--tcrn-color-wash);
  --tcrn-pair-menu-fill-x: transparent;
  --tcrn-pair-menu-ink-d: var(--tcrn-color-ink);
  --tcrn-pair-menu-ink-h: var(--tcrn-color-ink);
  --tcrn-pair-menu-ink-a: var(--tcrn-color-ink);
  --tcrn-pair-menu-ink-x: var(--tcrn-color-ink-3);
  --tcrn-pair-menu-edge-d: 0 0 #0000;
  --tcrn-pair-menu-edge-f: var(--tcrn-focus-ring);
  --tcrn-pair-menu-fill: var(--tcrn-pair-menu-fill-d);
  --tcrn-pair-menu-ink: var(--tcrn-pair-menu-ink-d);
  --tcrn-pair-menu-edge: var(--tcrn-pair-menu-edge-d);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--tcrn-space-2);
  inline-size: 100%;
  min-block-size: var(--tcrn-control-height-md);
  background-color: var(--tcrn-pair-menu-fill);
  color: var(--tcrn-pair-menu-ink);
  box-shadow: var(--tcrn-pair-menu-edge);
  font-family: var(--tcrn-type-family-ui);
  font-size: var(--tcrn-type-size-control);
  font-weight: var(--tcrn-type-weight-medium);
  line-height: var(--tcrn-type-line-ui);
  text-align: start;
  transition:
    background-color var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease),
    color var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease),
    box-shadow var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease);
}
.tcrn-menu__item--danger:where(:not(.tcrn-multi-select-dropdown__option)) {
  --tcrn-pair-menu-ink-d: var(--tcrn-color-bad);
  --tcrn-pair-menu-ink-h: var(--tcrn-color-bad);
  --tcrn-pair-menu-ink-a: var(--tcrn-color-bad);
  --tcrn-pair-menu-fill-h: var(--tcrn-color-bad-bg);
  --tcrn-pair-menu-fill-a: var(--tcrn-color-red-bg-2);
}
.tcrn-menu__item--active:where(:not(.tcrn-multi-select-dropdown__option)) {
  --tcrn-pair-menu-fill-d: transparent;
}
.tcrn-menu__item:where(:not(.tcrn-multi-select-dropdown__option)):where(:not(:disabled):hover, [data-tcrn-preview-state="hover"]) {
  --tcrn-pair-menu-fill: var(--tcrn-pair-menu-fill-h);
  --tcrn-pair-menu-ink: var(--tcrn-pair-menu-ink-h);
}
.tcrn-menu__item:where(:not(.tcrn-multi-select-dropdown__option)):where(:not(:disabled):active, [data-tcrn-preview-state="active"]) {
  --tcrn-pair-menu-fill: var(--tcrn-pair-menu-fill-a);
  --tcrn-pair-menu-ink: var(--tcrn-pair-menu-ink-a);
}
.tcrn-menu__item:where(:not(.tcrn-multi-select-dropdown__option)):where(:focus-visible, [data-tcrn-preview-state="focus"]) {
  --tcrn-pair-menu-fill: var(--tcrn-pair-menu-fill-h);
  --tcrn-pair-menu-ink: var(--tcrn-pair-menu-ink-h);
  --tcrn-pair-menu-edge: var(--tcrn-pair-menu-edge-f);
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.tcrn-menu__item:where(:disabled, [aria-disabled="true"]) {
  cursor: not-allowed;
}
.tcrn-menu__item:where(:not(.tcrn-multi-select-dropdown__option)):where(:disabled, [aria-disabled="true"]) {
  --tcrn-pair-menu-fill: var(--tcrn-pair-menu-fill-x);
  --tcrn-pair-menu-ink: var(--tcrn-pair-menu-ink-x);
}
.tcrn-menu__item--described:where(:not(.tcrn-multi-select-dropdown__option)) {
  flex-direction: column;
  align-items: flex-start;
  gap: var(--tcrn-space-0h);
  padding-block: var(--tcrn-space-2);
}
.tcrn-menu__item-label {
  min-inline-size: 0;
  font-size: var(--tcrn-type-size-control);
  font-weight: var(--tcrn-type-weight-medium);
  line-height: var(--tcrn-type-line-ui);
}
.tcrn-menu__item-description {
  min-inline-size: 0;
  color: var(--tcrn-color-ink-3);
  font-size: var(--tcrn-type-size-meta);
  font-weight: var(--tcrn-type-weight-regular);
  line-height: var(--tcrn-type-line-caption);
  white-space: normal;
}
.tcrn-menu__item--danger .tcrn-menu__item-description {
  color: var(--tcrn-color-bad);
}
/* Popover */
.tcrn-popover {
  --tcrn-pair-popover-fill: var(--tcrn-color-panel);
  --tcrn-pair-popover-ink: var(--tcrn-color-ink);
  --tcrn-pair-popover-edge: var(--tcrn-elevation-s3);
  --tcrn-color-surface: var(--tcrn-color-panel);
  box-sizing: border-box;
  z-index: var(--tcrn-z-popover);
  display: flex;
  flex-direction: column;
  gap: var(--tcrn-space-2h);
  min-inline-size: 220px;
  max-inline-size: min(380px, calc(100vw - var(--tcrn-space-4)));
  max-block-size: calc(100vh - var(--tcrn-space-4));
  padding: var(--tcrn-space-3h) var(--tcrn-space-4);
  margin: 0;
  overflow: auto;
  border-radius: var(--tcrn-radius-panel);
  background-color: var(--tcrn-pair-popover-fill);
  color: var(--tcrn-pair-popover-ink);
  box-shadow: var(--tcrn-pair-popover-edge);
}
.tcrn-popover[hidden] {
  display: none;
}
.tcrn-popover[data-overlay-positioning="portal-fixed"],
.tcrn-popover[data-overlay-positioning="static-fixed"] {
  position: fixed;
}
.tcrn-popover:focus-visible {
  --tcrn-pair-popover-edge: var(--tcrn-focus-ring), var(--tcrn-elevation-s3);
  outline: 2px solid transparent;
  outline-offset: 2px;
}
/* Tooltip */
.tcrn-tooltip {
  position: relative;
  display: inline-flex;
  align-items: center;
  min-inline-size: 0;
}
.tcrn-tooltip__content {
  --tcrn-pair-tooltip-fill: var(--tcrn-color-panel);
  --tcrn-pair-tooltip-ink: var(--tcrn-color-ink);
  --tcrn-pair-tooltip-edge: var(--tcrn-elevation-s2);
  box-sizing: border-box;
  z-index: var(--tcrn-z-popover);
  display: none;
  max-inline-size: 280px;
  padding: var(--tcrn-space-1h) var(--tcrn-space-2h);
  border-radius: var(--tcrn-radius-control);
  background-color: var(--tcrn-pair-tooltip-fill);
  color: var(--tcrn-pair-tooltip-ink);
  box-shadow: var(--tcrn-pair-tooltip-edge);
  font-family: var(--tcrn-type-family-ui);
  font-size: var(--tcrn-type-size-meta);
  font-weight: var(--tcrn-type-weight-regular);
  line-height: var(--tcrn-type-line-caption);
  pointer-events: none;
  overflow-wrap: anywhere;
}
.tcrn-tooltip__content[data-tooltip-open="true"] {
  display: inline-block;
}
.tcrn-tooltip[data-overlay-boundary="inline-static"] > .tcrn-tooltip__content[data-tooltip-open="true"] {
  position: absolute;
  inline-size: max-content;
}
.tcrn-tooltip[data-overlay-boundary="inline-static"] > .tcrn-tooltip__content[data-tooltip-placement="top"] {
  inset-block-end: calc(100% + var(--tcrn-space-1h));
  inset-inline-start: 50%;
  transform: translateX(-50%);
}
.tcrn-tooltip[data-overlay-boundary="inline-static"] > .tcrn-tooltip__content[data-tooltip-placement="bottom"] {
  inset-block-start: calc(100% + var(--tcrn-space-1h));
  inset-inline-start: 50%;
  transform: translateX(-50%);
}
.tcrn-tooltip[data-overlay-boundary="inline-static"] > .tcrn-tooltip__content[data-tooltip-placement="left"] {
  inset-inline-end: calc(100% + var(--tcrn-space-1h));
  inset-block-start: 50%;
  transform: translateY(-50%);
}
.tcrn-tooltip[data-overlay-boundary="inline-static"] > .tcrn-tooltip__content[data-tooltip-placement="right"] {
  inset-inline-start: calc(100% + var(--tcrn-space-1h));
  inset-block-start: 50%;
  transform: translateY(-50%);
}
/* Dialog, ConfirmActionDialog and Structural Drawers */
.tcrn-dialog {
  --tcrn-pair-dialog-fill: var(--tcrn-color-panel);
  --tcrn-pair-dialog-ink: var(--tcrn-color-ink);
  --tcrn-pair-dialog-edge: var(--tcrn-elevation-s3);
  --tcrn-color-surface: var(--tcrn-color-panel);
  box-sizing: border-box;
  z-index: var(--tcrn-z-overlay);
  display: flex;
  flex-direction: column;
  gap: var(--tcrn-space-3h);
  inline-size: min(480px, calc(100vw - 2 * var(--tcrn-space-4)));
  max-inline-size: 100%;
  max-block-size: calc(100vh - 2 * var(--tcrn-space-4));
  padding: var(--tcrn-space-4);
  margin: 0;
  overflow: auto;
  border-radius: var(--tcrn-radius-paper);
  background-color: var(--tcrn-pair-dialog-fill);
  color: var(--tcrn-pair-dialog-ink);
  box-shadow: var(--tcrn-pair-dialog-edge);
}
.tcrn-dialog:focus-visible {
  --tcrn-pair-dialog-edge: var(--tcrn-focus-ring), var(--tcrn-elevation-s3);
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.tcrn-dialog__title {
  margin: 0;
}
.tcrn-dialog__body {
  display: flex;
  flex-direction: column;
  gap: var(--tcrn-space-2h);
  min-inline-size: 0;
  color: var(--tcrn-color-ink-2);
}
.tcrn-dialog__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--tcrn-space-2);
  flex-wrap: wrap;
  padding-block-start: var(--tcrn-space-1);
}
.tcrn-confirm-dialog {
  inline-size: min(440px, calc(100vw - 2 * var(--tcrn-space-4)));
}
.tcrn-detail-drawer,
.tcrn-action-drawer {
  --tcrn-color-surface: var(--tcrn-color-panel);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: var(--tcrn-space-3h);
  min-inline-size: 0;
  padding: var(--tcrn-space-4);
  border-radius: var(--tcrn-radius-panel);
  background-color: var(--tcrn-color-panel);
  color: var(--tcrn-color-ink);
  box-shadow: var(--tcrn-elevation-s2);
}
.tcrn-detail-drawer[aria-hidden="true"],
.tcrn-action-drawer[aria-hidden="true"] {
  display: none;
}
/* InlineConfirmBar: two-stage in-flow confirmation bar */
.tcrn-inline-confirm-bar {
  --tcrn-pair-confirm-fill: var(--tcrn-color-bad-bg);
  --tcrn-pair-confirm-ink: var(--tcrn-color-ink);
  --tcrn-pair-confirm-accent: var(--tcrn-color-bad);
  --tcrn-pair-confirm-edge: inset 0 0 0 1px var(--tcrn-color-bad);
  --tcrn-color-surface: var(--tcrn-color-panel);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--tcrn-space-3);
  flex-wrap: wrap;
  min-inline-size: 0;
  padding: var(--tcrn-space-3) var(--tcrn-space-3h);
  border-radius: var(--tcrn-radius-panel);
  background-color: var(--tcrn-pair-confirm-fill);
  color: var(--tcrn-pair-confirm-ink);
  box-shadow: var(--tcrn-pair-confirm-edge);
}
.tcrn-inline-confirm-bar--warning {
  --tcrn-pair-confirm-fill: var(--tcrn-color-warn-bg);
  --tcrn-pair-confirm-accent: var(--tcrn-color-warn);
  --tcrn-pair-confirm-edge: inset 0 0 0 1px var(--tcrn-color-warn);
}
.tcrn-inline-confirm-bar--danger {
  --tcrn-pair-confirm-fill: var(--tcrn-color-bad-bg);
  --tcrn-pair-confirm-accent: var(--tcrn-color-bad);
  --tcrn-pair-confirm-edge: inset 0 0 0 1px var(--tcrn-color-bad);
}
.tcrn-inline-confirm-bar__content {
  display: flex;
  flex-direction: column;
  gap: var(--tcrn-space-0h);
  flex: 1 1 240px;
  min-inline-size: 0;
}
.tcrn-inline-confirm-bar__title {
  margin: 0;
  color: var(--tcrn-pair-confirm-accent);
  font-family: var(--tcrn-type-family-ui);
  font-size: var(--tcrn-type-size-ui);
  font-weight: var(--tcrn-type-weight-strong);
  line-height: var(--tcrn-type-line-ui);
}
.tcrn-inline-confirm-bar__message {
  margin: 0;
  min-inline-size: 0;
  color: var(--tcrn-color-ink);
  font-family: var(--tcrn-type-family-ui);
  font-size: var(--tcrn-type-size-ui);
  line-height: var(--tcrn-type-line-ui);
}
.tcrn-inline-confirm-bar__actions {
  display: inline-flex;
  align-items: center;
  gap: var(--tcrn-space-2);
  flex: 0 0 auto;
  flex-wrap: wrap;
}
@media (prefers-reduced-motion: reduce) {
  .tcrn-menu__item:where(:not(.tcrn-multi-select-dropdown__option)) {
    transition: none;
  }
}
`;
