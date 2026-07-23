// Shared story-demo CSS layer for the TCRN Design System docs — TCRN-DS-STORY-034.
//
// This is the single source for the demo/presentation selectors that BOTH doc
// stylesheets used to hand-maintain: the real-Storybook sheet
// (apps/storybook/src/storybook.css, Track A) and the static-docs sheet embedded by
// alpha-styles.ts (Track B). alpha-styles.ts imports `demoStoryCss` and interpolates
// it; storybook.css carries a generated copy between markers, kept in sync by
// `scripts/demo-styles-sync.mjs` (run via `pnpm demo-styles:sync`; `pnpm tokens:proof`
// fails on drift). Do NOT put the token :root blocks here (tokens-sync owns those),
// the alpha-only docs-shell chrome (.tcrn-doc-*), or the Track-A-only scaffolding.
export const demoStoryCss = `.alpha-frame {
  display: grid;
  gap: var(--tcrn-space-4);
  width: 100%;
  min-width: 0;
  max-width: var(--tcrn-container-readable);
  margin: 0 auto;
  padding: var(--tcrn-space-5);
}

/* The shared base-card group (border/radius/panel-bg + the display:grid variant) moved
   into the package component CSS (tcrnComponentCss) — TCRN-DS-STORY-037 — because every
   member except .alpha-story-card is a real @tcrn/ui-react component surface. The demo
   card keeps its own self-contained block here. */
.alpha-story-card {
  display: grid;
  gap: var(--tcrn-space-3);
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  background: var(--tcrn-color-surface-panel);
  padding: var(--tcrn-space-4);
  max-width: 100%;
  min-width: 0;
}

.tcrn-story-kicker {
  color: var(--tcrn-color-brand-primary);
  font-size: var(--tcrn-type-size-meta);
  font-weight: 700;
  letter-spacing: 0;
}

.tcrn-static-section {
  display: grid;
  gap: var(--tcrn-space-3h);
}

h1,
h2,
h3,
p,
span,
button,
label {
  overflow-wrap: anywhere;
}


.tcrn-icon {
  display: inline-block;
  flex: none;
  color: currentColor;
  fill: none;
  stroke: currentColor;
  vertical-align: -0.125em;
}

/* .tcrn-highlight-text / .tcrn-highlight-mark (Typography-emitted) moved into the
   package component CSS — TCRN-DS-STORY-037. */

.alpha-story-stack {
  display: grid;
  gap: var(--tcrn-space-3);
}

.tcrn-changelog-records {
  display: grid;
  gap: var(--tcrn-space-3);
  min-width: 0;
}

.tcrn-changelog-record {
  display: grid;
  gap: var(--tcrn-space-3);
  min-width: 0;
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  background: var(--tcrn-color-surface-panel);
  padding: var(--tcrn-space-3);
}

.tcrn-changelog-record__header {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: start;
  gap: var(--tcrn-space-2h);
  min-width: 0;
}

.tcrn-changelog-record__header h3,
.tcrn-changelog-record__header p {
  margin: 0;
}

.tcrn-changelog-record__evidence-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--tcrn-space-2h);
  min-width: 0;
}

.tcrn-changelog-record__evidence-list {
  display: grid;
  gap: var(--tcrn-space-2);
  min-width: 0;
}

.tcrn-changelog-record__evidence-list h4 {
  margin: 0;
  font-size: var(--tcrn-type-size-body);
}

.tcrn-changelog-record__evidence-list ul {
  display: grid;
  gap: var(--tcrn-space-1h);
  margin: 0;
  padding-inline-start: 18px;
  min-width: 0;
}

.tcrn-changelog-record__evidence-list li {
  min-width: 0;
}

.tcrn-changelog-record__artifact,
.tcrn-changelog-record__boundary {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  color: var(--tcrn-color-text-secondary);
  text-overflow: ellipsis;
  vertical-align: bottom;
  white-space: nowrap;
}

.tcrn-changelog-token {
  display: inline-grid;
  gap: var(--tcrn-space-0h);
  width: min(100%, max-content);
  max-width: 100%;
  min-width: 0;
}

.tcrn-changelog-token__label {
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-caption);
  font-weight: var(--tcrn-type-weight-strong);
  line-height: var(--tcrn-type-line-caption);
}

.tcrn-changelog-token__value {
  display: block;
  max-width: min(46ch, 100%);
  min-width: 0;
  overflow: hidden;
  color: var(--tcrn-color-text-primary);
  font-family: var(--tcrn-type-family-mono);
  font-size: var(--tcrn-type-size-meta);
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tcrn-guidance-grid,
.tcrn-spec-grid {
  display: grid;
  gap: var(--tcrn-space-3);
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  min-width: 0;
}

.tcrn-guidance-list {
  display: grid;
  gap: var(--tcrn-space-2);
  margin: 0;
  padding-inline-start: 18px;
}

.tcrn-status-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: var(--tcrn-space-2);
}

.tcrn-form-stack {
  display: grid;
  gap: var(--tcrn-space-3);
  min-width: 0;
}

.tcrn-form-stack .tcrn-field {
  margin-bottom: 0;
}

.tcrn-action-row,
.tcrn-storybook-component-example .tcrn-top-bar__actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--tcrn-space-2);
  min-width: 0;
}

.tcrn-locale-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--tcrn-space-2);
}

.tcrn-locale-card {
  display: grid;
  gap: var(--tcrn-space-1h);
  min-width: 0;
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  padding: var(--tcrn-space-2h);
  background: var(--tcrn-color-surface-panel);
}

.tcrn-locale-card span {
  color: var(--tcrn-color-text-secondary);
}

.tcrn-token-swatch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--tcrn-space-2h);
  min-width: 0;
}

.tcrn-token-swatch {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr);
  gap: var(--tcrn-space-1) var(--tcrn-space-2h);
  align-items: center;
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  padding: var(--tcrn-space-2h);
  min-width: 0;
}

.tcrn-token-swatch__color {
  grid-row: span 3;
  width: 34px;
  height: 34px;
  border: 1px solid var(--tcrn-color-border-strong);
  border-radius: var(--tcrn-radius-control);
}

.tcrn-token-swatch strong,
.tcrn-token-swatch code,
.tcrn-token-swatch p {
  min-width: 0;
}

.tcrn-token-swatch code {
  color: var(--tcrn-color-text-secondary);
  overflow-wrap: anywhere;
}

.tcrn-token-swatch p {
  margin: 0;
}

.tcrn-typography-sample {
  display: grid;
  gap: var(--tcrn-space-2);
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  padding: var(--tcrn-space-3);
  background: var(--tcrn-color-surface-panel);
  min-width: 0;
}

.tcrn-typography-sample h3,
.tcrn-typography-sample p {
  margin: 0;
}

.tcrn-type-scale-demo {
  display: grid;
  gap: var(--tcrn-space-2h);
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  padding: var(--tcrn-space-3);
  background: var(--tcrn-color-surface-panel);
  min-width: 0;
}

.tcrn-type-scale-demo__page,
.tcrn-type-scale-demo__section,
.tcrn-type-scale-demo__body,
.tcrn-type-scale-demo__caption,
.tcrn-type-scale-demo__code {
  margin: 0;
  min-width: 0;
}

.tcrn-type-scale-demo__page {
  font-size: var(--tcrn-type-size-page);
  line-height: var(--tcrn-type-line-page);
  font-weight: var(--tcrn-type-weight-strong);
}

.tcrn-type-scale-demo__section {
  font-size: var(--tcrn-type-size-section);
  line-height: var(--tcrn-type-line-section);
  font-weight: var(--tcrn-type-weight-strong);
}

.tcrn-type-scale-demo__body {
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-body);
  line-height: var(--tcrn-type-line-body);
  font-weight: var(--tcrn-type-weight-regular);
}

.tcrn-type-scale-demo__caption {
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-caption);
  line-height: var(--tcrn-type-line-caption);
  font-weight: var(--tcrn-type-weight-medium);
}

.tcrn-type-scale-demo__code {
  font-family: var(--tcrn-type-family-mono);
  font-size: var(--tcrn-type-size-meta);
  line-height: 1.4;
  color: var(--tcrn-color-text-secondary);
  overflow-wrap: anywhere;
}

.tcrn-icon-sample-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(156px, 1fr));
  gap: var(--tcrn-space-2);
  margin: var(--tcrn-space-4) 0 0;
  padding: 0;
  list-style: none;
  min-width: 0;
}

.tcrn-icon-sample {
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr);
  align-items: center;
  gap: var(--tcrn-space-2);
  min-width: 0;
  min-height: 40px;
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-color-surface-muted);
  color: var(--tcrn-color-text-secondary);
  padding: var(--tcrn-space-2) var(--tcrn-space-2h);
}

.tcrn-icon-sample .tcrn-icon {
  width: 18px;
  height: 18px;
  justify-self: center;
  color: var(--tcrn-color-brand-primary);
}

.tcrn-icon-sample code {
  min-width: 0;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  overflow-wrap: anywhere;
  color: var(--tcrn-color-text-primary);
  font-family: var(--tcrn-type-family-mono);
  font-size: var(--tcrn-type-size-meta);
  line-height: 1.3;
}

.tcrn-motion-demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--tcrn-space-2h);
  min-width: 0;
}

.tcrn-motion-demo {
  display: grid;
  gap: var(--tcrn-space-2h);
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  padding: var(--tcrn-space-3);
  min-width: 0;
  background: var(--tcrn-color-surface-panel);
}

.tcrn-motion-demo h3,
.tcrn-motion-demo p {
  margin: 0;
}

.tcrn-motion-demo__track {
  position: relative;
  min-height: 28px;
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-color-surface-muted);
  overflow: hidden;
}

.tcrn-motion-demo__dot {
  position: absolute;
  top: 6px;
  left: 8px;
  width: 16px;
  height: 16px;
  border-radius: var(--tcrn-radius-pill);
  background: var(--tcrn-color-brand-primary);
  animation: tcrn-motion-travel var(--tcrn-motion-standard) infinite alternate;
}

.tcrn-motion-demo--instant .tcrn-motion-demo__dot {
  animation-duration: 700ms;
  animation-timing-function: ease-out;
}

.tcrn-motion-demo--standard .tcrn-motion-demo__dot {
  background: var(--tcrn-color-brand-secondary);
  animation-duration: 1100ms;
  animation-timing-function: ease;
}

.tcrn-motion-demo--emphasis .tcrn-motion-demo__dot {
  background: var(--tcrn-color-brand-accent);
  animation-duration: 1400ms;
  animation-timing-function: cubic-bezier(0.2, 0, 0.2, 1);
}

.tcrn-motion-demo--reduced .tcrn-motion-demo__dot {
  left: 50%;
  background: var(--tcrn-color-brand-neutral);
  animation: none;
}

@keyframes tcrn-motion-travel {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(100% + 128px));
  }
}

.tcrn-loading-motion-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--tcrn-space-2h);
  min-width: 0;
}

.tcrn-loading-card {
  display: grid;
  gap: var(--tcrn-space-2h);
  align-content: start;
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  padding: var(--tcrn-space-3);
  min-width: 0;
  background: var(--tcrn-color-surface-panel);
}

.tcrn-loading-card h3,
.tcrn-loading-card p {
  margin: 0;
}

.tcrn-loading-card__row,
.tcrn-loading-status {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--tcrn-space-2h);
  min-width: 0;
}

.tcrn-loading-spinner {
  width: 30px;
  height: 30px;
  flex: 0 0 auto;
  border: 3px solid var(--tcrn-color-brand-primary-bg);
  border-top-color: var(--tcrn-color-brand-primary);
  border-radius: var(--tcrn-radius-pill);
  animation: tcrn-motion-spin var(--tcrn-motion-loading-loop) infinite;
}

.tcrn-loading-copy {
  display: grid;
  gap: var(--tcrn-space-1);
  min-width: 0;
}

.tcrn-loading-progress {
  position: relative;
  min-height: 10px;
  border-radius: var(--tcrn-radius-pill);
  background: var(--tcrn-color-surface-muted);
  overflow: hidden;
}

.tcrn-loading-progress__bar {
  position: absolute;
  inset: 0 auto 0 0;
  width: 46%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--tcrn-color-brand-secondary), var(--tcrn-color-brand-primary));
  animation: tcrn-motion-progress var(--tcrn-motion-progress-loop) infinite;
}

.tcrn-loading-skeleton {
  display: grid;
  gap: var(--tcrn-space-2);
  padding: var(--tcrn-space-1) 0;
}

.tcrn-loading-skeleton__line {
  min-height: 12px;
  border-radius: var(--tcrn-radius-pill);
  background: linear-gradient(90deg, var(--tcrn-color-surface-muted), var(--tcrn-color-brand-primary-bg), var(--tcrn-color-surface-muted));
  background-size: 220% 100%;
  animation: tcrn-motion-shimmer var(--tcrn-motion-skeleton-loop) infinite;
}

.tcrn-loading-skeleton__line--short {
  width: 56%;
}

.tcrn-loading-skeleton__line--medium {
  width: 76%;
}

.tcrn-loading-status__chip {
  display: inline-flex;
  align-items: center;
  min-height: 26px;
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-control);
  padding: var(--tcrn-space-1) var(--tcrn-space-2);
  color: var(--tcrn-color-text-primary);
  background: var(--tcrn-color-surface-muted);
  transition:
    background-color var(--tcrn-motion-standard),
    border-color var(--tcrn-motion-standard),
    color var(--tcrn-motion-standard);
}

.tcrn-loading-status__chip--active {
  border-color: var(--tcrn-color-brand-primary);
  color: var(--tcrn-color-text-primary);
  background: var(--tcrn-color-brand-primary-bg);
}

.tcrn-loading-status__arrow {
  width: 16px;
  height: 16px;
  color: var(--tcrn-color-text-secondary);
}

@keyframes tcrn-motion-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes tcrn-motion-progress {
  0% {
    transform: translateX(-105%);
  }
  55%,
  100% {
    transform: translateX(220%);
  }
}

@keyframes tcrn-motion-shimmer {
  from {
    background-position: 120% 0;
  }
  to {
    background-position: -120% 0;
  }
}

.tcrn-theme-preview {
  display: grid;
  gap: var(--tcrn-space-2h);
  color: var(--tcrn-color-text-primary);
  background: var(--tcrn-color-surface-canvas);
  /* Token-driven so the preview shows the language it documents. It used to paint a
     hardcoded v1 navy wash with a blue-grey edge, which meant the component whose whole
     job is demonstrating the dark theme was demonstrating a theme that no longer exists. */
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  box-shadow: var(--tcrn-elevation-floating);
  padding: var(--tcrn-space-3);
}



/* Feedback families .tcrn-state-view / .tcrn-skeleton* (+ @keyframes
   tcrn-skeleton-shimmer) / .tcrn-state-surface* moved into the package component CSS —
   TCRN-DS-STORY-037. (.tcrn-state-surface__action stays out of scope; it is S036.) */

.tcrn-display-primitive-grid {
  display: grid;
  gap: var(--tcrn-space-3);
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  align-items: stretch;
}

.tcrn-interaction-primitive-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--tcrn-space-3);
  align-items: center;
}

.tcrn-interaction-primitive-grid {
  display: grid;
  gap: var(--tcrn-space-3);
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  align-items: start;
}

.tcrn-inline-proof-token {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-color-surface-muted);
  padding: 0 var(--tcrn-space-2h);
  font-family: var(--tcrn-type-family-mono);
  font-size: var(--tcrn-type-size-meta);
}

/* Tooltip base, content, the :hover/:focus-within reveal and the four data-placement
   position rules moved into the package component CSS — TCRN-DS-STORY-037. The docs demo
   layer keeps ONLY the storybook static-preview hook
   ([data-storybook-static-tooltip="true"]), which the Tooltip component never emits, so
   it is presentation chrome. The package rules supply the base placement; these force the
   revealed state for the static preview. */
.tcrn-tooltip[data-storybook-static-tooltip="true"] .tcrn-tooltip__content {
  opacity: 1;
  transform: translateY(0);
}

.tcrn-tooltip[data-placement="top"][data-storybook-static-tooltip="true"] .tcrn-tooltip__content {
  transform: translate(-50%, 0);
}

.tcrn-tooltip[data-placement="bottom"][data-storybook-static-tooltip="true"] .tcrn-tooltip__content {
  transform: translate(-50%, 0);
}

.tcrn-tooltip[data-placement="right"][data-storybook-static-tooltip="true"] .tcrn-tooltip__content {
  transform: translate(0, -50%);
}

.tcrn-tooltip[data-placement="left"][data-storybook-static-tooltip="true"] .tcrn-tooltip__content {
  transform: translate(0, -50%);
}

/* Layout .tcrn-collapsible-region* / .tcrn-disclosure-panel* and the component
   reduced-motion + forced-colors handling moved into the package component CSS —
   TCRN-DS-STORY-037. */


/* Form families .tcrn-field* and .tcrn-input / .tcrn-select moved into the package
   component CSS — TCRN-DS-STORY-037. .tcrn-input--short is a docs-only demo width (not
   component-emitted) and stays here; it leans on the package .tcrn-input base. */
.tcrn-input--short {
  width: min(18ch, 100%);
}

.tcrn-storybook-component-example .tcrn-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--tcrn-space-3);
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  background: var(--tcrn-color-surface-panel);
  padding: var(--tcrn-space-2h) var(--tcrn-space-3);
  min-width: 0;
}

.tcrn-storybook-component-example .tcrn-top-bar__brand {
  font-weight: 700;
  letter-spacing: 0;
}

.tcrn-storybook-component-example .tcrn-top-bar__module {
  color: var(--tcrn-color-text-secondary);
}

.tcrn-storybook-component-example .tcrn-top-bar__brand,
.tcrn-storybook-component-example .tcrn-top-bar__module {
  min-width: 0;
}

.tcrn-entry-shell-strip {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) minmax(160px, auto) auto;
  align-items: center;
  gap: var(--tcrn-space-3);
  min-width: 0;
  border: 1px solid color-mix(in srgb, var(--tcrn-color-border-subtle) 78%, transparent);
  border-radius: var(--tcrn-radius-surface);
  background: var(--tcrn-color-surface-panel);
  padding: var(--tcrn-space-2h) var(--tcrn-space-3);
  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--tcrn-color-surface-panel) 78%, transparent);
}

.tcrn-entry-shell-strip__brand,
.tcrn-entry-shell-strip__module {
  display: inline-flex;
  align-items: center;
  min-width: 0;
}

.tcrn-entry-shell-strip__brand {
  gap: var(--tcrn-space-2h);
  --tcrn-brand-mark-size: 36px;
  --tcrn-brand-mark-filter: drop-shadow(0 1px 2px rgba(28, 29, 33, 0.10));
}

.tcrn-entry-shell-strip__brand span {
  display: grid;
  gap: var(--tcrn-space-0h);
  min-width: 0;
}

.tcrn-entry-shell-strip__brand strong,
.tcrn-entry-shell-strip__module span {
  color: var(--tcrn-color-text-primary);
  font-weight: 800;
}

.tcrn-entry-shell-strip__brand small {
  color: var(--tcrn-color-brand-primary);
  font-size: var(--tcrn-type-size-caption);
  font-weight: 700;
  line-height: 1.25;
}

.tcrn-entry-shell-strip__module {
  justify-self: center;
  gap: var(--tcrn-space-1h);
  color: var(--tcrn-color-text-secondary);
}

/* Navigation families .tcrn-breadcrumb* and the tab layouts (.tcrn-product-launcher,
   .tcrn-product-switcher, .tcrn-module-tabs, .tcrn-section-tabs, .tcrn-segmented-nav,
   including their button + selected rules) moved into the package component CSS —
   TCRN-DS-STORY-037. .tcrn-filter-bar is docs-only demo chrome and stays; it shares the
   flex layout the tab families use. It is package-owned only via the scoped
   ".tcrn-table-toolbar .tcrn-filter-bar" rule, so a top-level .tcrn-filter-bar here does
   not duplicate a package selector. */
.tcrn-filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--tcrn-space-1h);
  min-width: 0;
}

.tcrn-nav-component-preview {
  display: grid;
  gap: var(--tcrn-space-3);
  min-width: 0;
  border: 1px solid color-mix(in srgb, var(--tcrn-color-border-subtle) 78%, transparent);
  border-radius: var(--tcrn-radius-surface);
  background: color-mix(in srgb, var(--tcrn-color-surface-muted) 48%, var(--tcrn-color-surface-panel));
  padding: var(--tcrn-space-3);
}

.tcrn-nav-component-preview .tcrn-product-switcher {
  width: max-content;
  max-width: 100%;
  border: 1px solid color-mix(in srgb, var(--tcrn-color-border-subtle) 78%, transparent);
  border-radius: var(--tcrn-radius-surface);
  background: color-mix(in srgb, var(--tcrn-color-surface-muted) 62%, var(--tcrn-color-surface-panel));
  padding: var(--tcrn-space-1);
}

.tcrn-package-nav-proof {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas:
    "skip"
    "sidenav"
    "tabs";
  column-gap: var(--tcrn-space-3);
  row-gap: var(--tcrn-space-2h);
  align-items: start;
  min-width: 0;
}

.tcrn-package-nav-proof__skip {
  position: relative;
  grid-area: skip;
  min-width: 0;
  min-height: 0;
}

.tcrn-package-nav-proof > .tcrn-side-nav {
  grid-area: sidenav;
  justify-self: stretch;
  min-width: min(180px, 100%);
  width: 100%;
}

.tcrn-package-nav-proof > .tcrn-segmented-nav {
  grid-area: tabs;
  align-self: start;
}





.tcrn-storybook-component-example .tcrn-nav-item {
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr);
  gap: var(--tcrn-space-2);
  align-items: center;
  min-height: 34px;
  min-width: 0;
  border: 1px solid transparent;
  border-radius: var(--tcrn-radius-control);
  color: var(--tcrn-color-text-secondary);
  padding: var(--tcrn-space-1h) var(--tcrn-space-2);
  text-decoration: none;
  width: 100%;
}

.tcrn-storybook-component-example .tcrn-nav-item:hover {
  border-color: color-mix(in srgb, var(--tcrn-color-border-subtle) 86%, var(--tcrn-color-brand-primary-bg));
  background: color-mix(in srgb, var(--tcrn-color-brand-primary-bg) 42%, transparent);
  color: var(--tcrn-color-text-primary);
}

.tcrn-storybook-component-example .tcrn-nav-item[data-selected="true"] {
  border-color: color-mix(in srgb, var(--tcrn-color-brand-primary) 26%, var(--tcrn-color-border-subtle));
  background: var(--tcrn-color-surface-panel);
  color: var(--tcrn-color-text-primary);
  box-shadow: inset 4px 0 0 color-mix(in srgb, var(--tcrn-color-brand-primary) 74%, var(--tcrn-color-brand-secondary));
}

.tcrn-storybook-component-example .tcrn-nav-item[aria-disabled="true"] {
  cursor: not-allowed;
  color: var(--tcrn-color-text-muted);
  opacity: 0.74;
}

.tcrn-storybook-component-example .tcrn-nav-item__content {
  display: grid;
  gap: var(--tcrn-space-0h);
  min-width: 0;
}

.tcrn-storybook-component-example .tcrn-nav-item__label,
.tcrn-storybook-component-example .tcrn-nav-item__disabled-reason {
  min-width: 0;
  overflow-wrap: anywhere;
}

.tcrn-storybook-component-example .tcrn-nav-item__disabled-reason {
  color: var(--tcrn-color-text-muted);
  font-size: var(--tcrn-type-size-meta);
  line-height: 1.25;
}

.tcrn-storybook-component-example .tcrn-nav-item .tcrn-icon {
  width: 16px;
  height: 16px;
  color: var(--tcrn-color-brand-primary);
}



.tcrn-package-nav-proof__skip .tcrn-skip-link:not(:focus) {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  border: 0;
  padding: 0;
  white-space: nowrap;
  transform: none;
}

.tcrn-package-nav-proof__skip .tcrn-skip-link:focus {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
}

.tcrn-shell-demo {
  position: relative;
  display: grid;
  gap: var(--tcrn-space-3h);
  min-width: 0;
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  background: var(--tcrn-color-surface-panel);
  padding: var(--tcrn-space-3h);
  box-shadow: var(--tcrn-elevation-floating);
}

.tcrn-shell-demo--compact {
  padding: 0;
  overflow: hidden;
}

.tcrn-compact-shell {
  display: grid;
  min-width: 0;
  border: 1px solid color-mix(in srgb, var(--tcrn-color-border-subtle) 84%, transparent);
  border-radius: var(--tcrn-radius-surface);
  background: color-mix(in srgb, var(--tcrn-color-surface-muted) 54%, var(--tcrn-color-surface-panel));
  overflow: hidden;
}

.tcrn-compact-shell .tcrn-top-bar {
  display: grid;
  grid-template-columns: 46px minmax(0, 1fr) auto;
  min-height: 72px;
  border: 0;
  border-bottom: 1px solid color-mix(in srgb, var(--tcrn-color-border-subtle) 80%, transparent);
  border-radius: 0;
  background: var(--tcrn-color-surface-panel);
  padding: 0 var(--tcrn-space-4);
}

.tcrn-compact-shell__brand {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  min-width: 0;
  --tcrn-brand-mark-size: 38px;
  --tcrn-brand-mark-filter: drop-shadow(0 1px 2px rgba(28, 29, 33, 0.10));
}

.tcrn-compact-shell .tcrn-top-bar__module {
  justify-self: center;
  text-align: center;
}

.tcrn-compact-shell .tcrn-top-bar__actions {
  justify-self: end;
}

.tcrn-compact-shell__body {
  display: grid;
  grid-template-columns: minmax(240px, 0.34fr) minmax(0, 1fr);
  gap: var(--tcrn-space-3);
  min-width: 0;
  padding: var(--tcrn-space-3h);
}

.tcrn-compact-shell__summary,
.tcrn-compact-shell__switcher,
.tcrn-compact-shell__metric {
  border: 1px solid color-mix(in srgb, var(--tcrn-color-border-subtle) 78%, transparent);
  border-radius: var(--tcrn-radius-surface);
  background: color-mix(in srgb, var(--tcrn-color-surface-panel) 82%, transparent);
}

.tcrn-compact-shell__summary,
.tcrn-compact-shell__switcher {
  display: grid;
  align-content: start;
  gap: var(--tcrn-space-2h);
  min-width: 0;
  padding: var(--tcrn-space-3);
}

.tcrn-compact-shell__summary {
  background: color-mix(in srgb, var(--tcrn-color-surface-panel) 84%, transparent);
}

.tcrn-compact-shell__summary > span {
  color: var(--tcrn-color-brand-primary);
  font-size: var(--tcrn-type-size-caption);
  font-weight: 800;
}

.tcrn-compact-shell__summary > strong {
  font-size: var(--tcrn-type-size-section);
  line-height: 1.2;
}

.tcrn-compact-shell__summary p,
.tcrn-compact-shell__metric small {
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-caption);
  line-height: 1.35;
}

.tcrn-compact-shell__switcher .tcrn-module-tabs {
  display: inline-flex;
  width: max-content;
  max-width: 100%;
  gap: var(--tcrn-space-1);
  border: 1px solid color-mix(in srgb, var(--tcrn-color-border-subtle) 78%, transparent);
  border-radius: var(--tcrn-radius-surface);
  background: color-mix(in srgb, var(--tcrn-color-surface-muted) 62%, var(--tcrn-color-surface-panel));
  padding: var(--tcrn-space-1);
  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--tcrn-color-surface-panel) 74%, transparent);
}

.tcrn-compact-shell__switcher .tcrn-module-tabs button {
  min-height: 34px;
  border-color: transparent;
  border-radius: var(--tcrn-radius-control);
  background: transparent;
  padding: 0 var(--tcrn-space-3);
  box-shadow: none;
}

.tcrn-compact-shell__switcher .tcrn-module-tabs button[data-selected="true"],
.tcrn-compact-shell__switcher .tcrn-module-tabs button[aria-current="page"] {
  border-color: color-mix(in srgb, var(--tcrn-color-brand-primary) 24%, transparent);
  background: var(--tcrn-color-surface-panel);
  box-shadow: var(--tcrn-elevation-floating);
}

.tcrn-compact-shell__panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--tcrn-space-2h);
  min-width: 0;
}

.tcrn-compact-shell__metric {
  display: flex;
  align-items: flex-start;
  gap: var(--tcrn-space-2);
  min-width: 0;
  padding: var(--tcrn-space-2h);
}

.tcrn-compact-shell__metric .tcrn-icon {
  flex: 0 0 auto;
  color: var(--tcrn-color-brand-primary);
  margin-top: 1px;
}

.tcrn-compact-shell__metric span {
  display: grid;
  gap: var(--tcrn-space-0h);
  min-width: 0;
}

.tcrn-shell-demo--dense {
  align-content: start;
  grid-template-rows: max-content;
  gap: 0;
  min-height: 474px;
  overflow: visible;
  padding: 0;
}

.tcrn-shell-demo__topbar {
  display: grid;
  align-items: center;
  gap: var(--tcrn-space-3);
  min-width: 0;
  border: 1px solid color-mix(in srgb, var(--tcrn-color-border-subtle) 84%, transparent);
  border-radius: var(--tcrn-radius-surface);
  background: color-mix(in srgb, var(--tcrn-color-surface-panel) 82%, transparent);
  padding: var(--tcrn-space-2h);
}

.tcrn-shell-demo__topbar--dense {
  position: relative;
  z-index: 3;
  grid-template-columns: 44px minmax(220px, 1fr) minmax(180px, 280px) auto;
  min-height: 72px;
  border: 0;
  border-bottom: 1px solid color-mix(in srgb, var(--tcrn-color-border-subtle) 82%, transparent);
  border-radius: calc(var(--tcrn-radius-surface) - 1px) calc(var(--tcrn-radius-surface) - 1px) 0 0;
  background: var(--tcrn-color-surface-panel);
  padding: 0 var(--tcrn-space-4);
}

.tcrn-shell-demo__topbar--docs {
  grid-template-columns: minmax(220px, 1fr) minmax(180px, 260px) auto;
}

.tcrn-shell-demo__brand {
  display: grid;
  gap: var(--tcrn-space-0h);
  min-width: 0;
}

.tcrn-shell-demo__brand span {
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-caption);
  line-height: 1.35;
}

.tcrn-doc-brand {
  --tcrn-brand-mark-size: 52px;
  --tcrn-brand-mark-filter: drop-shadow(0 1px 2px rgba(28, 29, 33, 0.10));
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr);
  align-items: center;
  gap: var(--tcrn-space-3);
  min-width: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: var(--tcrn-color-text-primary);
  padding: var(--tcrn-space-1) 0;
  text-decoration: none;
  /* Only opacity and transform animate; the layout properties (grid-template-columns,
     gap, left, top, width) snap. Transitioning them reflowed the brand every frame
     during collapse. The wordmark's reveal/hide is carried by opacity + transform on
     its copy element, which is GPU-composited and does not thrash layout. */
  transition:
    opacity var(--tcrn-motion-emphasis),
    transform var(--tcrn-motion-emphasis);
}

.tcrn-doc-brand .tcrn-shell-brand-lockup__copy {
  display: grid;
  gap: var(--tcrn-space-0h);
  max-width: 220px;
  min-width: 0;
  opacity: 1;
  overflow: hidden;
  transform: translateX(0);
  visibility: visible;
  transition:
    opacity var(--tcrn-motion-emphasis),
    transform var(--tcrn-motion-emphasis),
    visibility 0s linear 0s;
}

.tcrn-doc-brand .tcrn-shell-brand-lockup__copy,
.tcrn-doc-brand .tcrn-shell-brand-lockup__copy * {
  overflow-wrap: normal;
  white-space: nowrap;
  word-break: normal;
}

.tcrn-doc-brand .tcrn-shell-brand-lockup__caption {
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--tcrn-color-brand-primary);
  font-size: var(--tcrn-type-size-caption);
  font-weight: 700;
  line-height: 1.25;
}

.tcrn-doc-search-results {
  position: absolute;
  inset-block-start: calc(100% + var(--tcrn-space-2));
  inset-inline-end: 0;
  z-index: 40;
  display: grid;
  gap: var(--tcrn-space-1);
  width: min(420px, calc(100vw - 32px));
  padding: var(--tcrn-space-2);
  border: 1px solid var(--tcrn-color-border-strong);
  border-radius: var(--tcrn-radius-panel);
  background: var(--tcrn-color-surface-panel);
  box-shadow: var(--tcrn-elevation-floating);
}

.tcrn-doc-search-results[hidden] {
  display: none;
}

.tcrn-doc-search-result,
.tcrn-doc-search-empty {
  display: grid;
  gap: var(--tcrn-space-0h);
  padding: var(--tcrn-space-2);
  border-radius: var(--tcrn-radius-control);
  color: var(--tcrn-color-text-primary);
  text-decoration: none;
}

.tcrn-doc-search-result:hover,
.tcrn-doc-search-result[data-selected="true"] {
  background: var(--tcrn-color-surface-muted);
}

.tcrn-doc-search-result span,
.tcrn-doc-search-empty {
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-meta);
}




.tcrn-shell-demo__menu-button,
.tcrn-shell-domain-item,
.tcrn-shell-hub-action,
.tcrn-shell-task-lane a,
.tcrn-shell-quick-list a,
.tcrn-bookmark-nav a {
  position: relative;
  min-height: 34px;
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-control);
  background: color-mix(in srgb, var(--tcrn-color-surface-panel) 92%, transparent);
  color: var(--tcrn-color-text-primary);
  text-decoration: none;
}

.tcrn-shell-demo__menu-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  min-width: 36px;
  gap: 0;
  padding: 0;
  font-weight: 700;
  border-color: color-mix(in srgb, var(--tcrn-color-brand-primary) 42%, var(--tcrn-color-border-subtle));
  background: var(--tcrn-color-surface-panel);
}

.tcrn-shell-demo__menu-button .tcrn-icon {
  width: 16px;
  height: 16px;
}

.tcrn-shell-demo__topbar .tcrn-search-input {
  max-width: 240px;
}

.tcrn-shell-demo__topbar .tcrn-search-input--compact {
  min-width: 0;
}

.tcrn-shell-density-stack {
  display: grid;
  gap: var(--tcrn-space-4);
  min-width: 0;
}

.tcrn-shell-layer {
  position: absolute;
  top: 84px;
  left: 14px;
  right: 14px;
  z-index: 5;
  display: grid;
  min-width: 0;
}

.tcrn-shell-density-stack .tcrn-shell-demo--dense {
  grid-template-rows: max-content max-content;
  min-height: 0;
}

.tcrn-shell-density-stack .tcrn-shell-layer {
  position: relative;
  top: auto;
  left: auto;
  right: auto;
  z-index: 2;
  margin: 14px 14px 14px;
}

.tcrn-shell-mega-menu {
  display: grid;
  grid-template-columns: minmax(278px, 0.34fr) minmax(400px, 1fr) minmax(196px, 0.28fr);
  gap: var(--tcrn-space-3);
  min-width: 0;
  border: 1px solid color-mix(in srgb, var(--tcrn-color-border-subtle) 82%, transparent);
  border-radius: var(--tcrn-radius-surface);
  background: color-mix(in srgb, var(--tcrn-color-surface-muted) 78%, var(--tcrn-color-surface-panel));
  padding: var(--tcrn-space-3);
  box-shadow: var(--tcrn-elevation-floating);
}

.tcrn-shell-hub-menu {
  display: grid;
  grid-template-columns: minmax(230px, 0.32fr) minmax(430px, 1fr) minmax(210px, 0.3fr);
  gap: var(--tcrn-space-3);
  min-width: 0;
  border: 1px solid color-mix(in srgb, var(--tcrn-color-border-subtle) 82%, transparent);
  border-radius: var(--tcrn-radius-surface);
  background: var(--tcrn-color-surface-panel);
  padding: var(--tcrn-space-3);
  box-shadow: var(--tcrn-elevation-floating);
}

.tcrn-shell-domain-nav,
.tcrn-shell-domain-group,
.tcrn-shell-domain-list,
.tcrn-shell-command-board,
.tcrn-shell-hub-summary,
.tcrn-shell-hub-actions,
.tcrn-shell-hub-action,
.tcrn-shell-hub-sidecar,
.tcrn-shell-task-lanes,
.tcrn-shell-task-lane,
.tcrn-shell-quick-rail,
.tcrn-shell-quick-list,
.tcrn-bookmark-nav,
.tcrn-bookmark-nav__group,
.tcrn-bookmark-nav__children,
.tcrn-knowledge-preview {
  display: grid;
  gap: var(--tcrn-space-2);
  min-width: 0;
}

.tcrn-shell-domain-nav,
.tcrn-shell-command-board,
.tcrn-shell-hub-summary,
.tcrn-shell-hub-sidecar,
.tcrn-shell-quick-rail {
  border: 1px solid color-mix(in srgb, var(--tcrn-color-border-subtle) 78%, transparent);
  border-radius: var(--tcrn-radius-surface);
  background: color-mix(in srgb, var(--tcrn-color-surface-panel) 80%, transparent);
  padding: var(--tcrn-space-2h);
}

.tcrn-shell-domain-nav {
  align-content: start;
  background: color-mix(in srgb, var(--tcrn-color-surface-panel) 76%, transparent);
}

.tcrn-shell-hub-summary {
  align-content: start;
  gap: var(--tcrn-space-2);
  background: color-mix(in srgb, var(--tcrn-color-surface-panel) 84%, transparent);
}

.tcrn-shell-hub-summary > span {
  color: var(--tcrn-color-brand-primary);
  font-size: var(--tcrn-type-size-caption);
  font-weight: 800;
}

.tcrn-shell-hub-summary > strong {
  font-size: var(--tcrn-type-size-section);
  line-height: 1.2;
}

.tcrn-shell-hub-summary p,
.tcrn-shell-hub-sidecar li {
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-body);
  line-height: 1.45;
}

.tcrn-shell-hub-actions {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--tcrn-space-2h);
}

.tcrn-shell-hub-action {
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: start;
  gap: var(--tcrn-space-2);
  min-height: 88px;
  padding: var(--tcrn-space-3);
  background: var(--tcrn-color-surface-panel);
}

.tcrn-shell-hub-action .tcrn-icon {
  color: var(--tcrn-color-brand-primary);
  margin-top: 2px;
}

.tcrn-shell-hub-action span {
  display: grid;
  gap: var(--tcrn-space-1);
  min-width: 0;
}

.tcrn-shell-hub-action small {
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-caption);
  line-height: 1.35;
}

.tcrn-shell-hub-action em {
  border-radius: var(--tcrn-radius-pill);
  background: color-mix(in srgb, var(--tcrn-color-brand-primary-bg) 70%, transparent);
  color: var(--tcrn-color-brand-primary);
  font-size: var(--tcrn-type-size-caption);
  font-style: normal;
  font-weight: 800;
  padding: var(--tcrn-space-0h) var(--tcrn-space-1h);
  white-space: nowrap;
}

.tcrn-shell-hub-action[data-selected="true"] {
  border-color: color-mix(in srgb, var(--tcrn-color-brand-primary) 34%, var(--tcrn-color-border-subtle));
  background: var(--tcrn-color-surface-panel);
}

.tcrn-shell-hub-sidecar {
  align-content: start;
  background: color-mix(in srgb, var(--tcrn-color-surface-panel) 82%, transparent);
}

.tcrn-shell-hub-sidecar ul {
  display: grid;
  gap: var(--tcrn-space-2);
  margin: 0;
  padding-left: var(--tcrn-space-4h);
}

.tcrn-shell-domain-group {
  gap: var(--tcrn-space-1h);
}

.tcrn-shell-domain-group > strong,
.tcrn-shell-hub-sidecar > strong,
.tcrn-shell-quick-rail > strong,
.tcrn-shell-task-lane__title strong {
  font-size: var(--tcrn-type-size-caption);
  line-height: 1.35;
}

.tcrn-shell-domain-list {
  gap: var(--tcrn-space-1h);
}

.tcrn-shell-domain-item {
  display: flex;
  align-items: flex-start;
  gap: var(--tcrn-space-2);
  width: 100%;
  text-align: left;
  padding: var(--tcrn-space-2) var(--tcrn-space-2h);
}

.tcrn-shell-domain-item .tcrn-icon {
  flex: 0 0 auto;
  color: var(--tcrn-color-brand-primary);
  margin-top: 1px;
}

.tcrn-shell-domain-item span {
  display: grid;
  gap: var(--tcrn-space-0h);
  min-width: 0;
}

.tcrn-shell-domain-item small,
.tcrn-shell-command-board__header p,
.tcrn-shell-quick-rail p,
.tcrn-shell-quick-list small {
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-caption);
  line-height: 1.35;
}

.tcrn-shell-command-board {
  align-content: start;
  gap: var(--tcrn-space-2h);
}

.tcrn-shell-command-board__header {
  display: grid;
  gap: var(--tcrn-space-0h);
  border-bottom: 1px solid color-mix(in srgb, var(--tcrn-color-border-subtle) 72%, transparent);
  padding: var(--tcrn-space-0h) var(--tcrn-space-0h) var(--tcrn-space-2h);
}

.tcrn-shell-command-board__header > span {
  color: var(--tcrn-color-brand-primary);
  font-size: var(--tcrn-type-size-caption);
  font-weight: 700;
}

.tcrn-shell-task-lanes {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--tcrn-space-2h);
}

.tcrn-shell-task-lane {
  align-content: start;
  gap: var(--tcrn-space-1h);
  border: 1px solid color-mix(in srgb, var(--tcrn-color-border-subtle) 78%, transparent);
  border-radius: var(--tcrn-radius-control);
  background: color-mix(in srgb, var(--tcrn-color-surface-panel) 72%, transparent);
  padding: var(--tcrn-space-2h);
}

.tcrn-shell-task-lane__title {
  display: flex;
  align-items: center;
  gap: var(--tcrn-space-1h);
  min-width: 0;
  color: var(--tcrn-color-text-primary);
}

.tcrn-shell-task-lane__title .tcrn-icon {
  color: var(--tcrn-color-brand-secondary);
}

.tcrn-shell-task-lane a,
.tcrn-shell-quick-list a {
  display: grid;
  gap: var(--tcrn-space-0h);
  min-height: 32px;
  padding: var(--tcrn-space-1h) var(--tcrn-space-2);
}

.tcrn-shell-domain-item[data-selected="true"],
.tcrn-shell-task-lane a[data-selected="true"],
.tcrn-bookmark-nav__group > a[data-selected="true"],
.tcrn-bookmark-nav__children a[data-selected="true"] {
  border-color: color-mix(in srgb, var(--tcrn-color-brand-primary) 32%, var(--tcrn-color-border-subtle));
  background: var(--tcrn-color-surface-panel);
  color: var(--tcrn-color-text-primary);
  font-weight: 700;
}

.tcrn-shell-quick-rail {
  align-content: start;
  gap: var(--tcrn-space-2);
  background: color-mix(in srgb, var(--tcrn-color-surface-panel) 78%, transparent);
}

.tcrn-bookmark-nav a {
  display: flex;
  align-items: center;
  gap: var(--tcrn-space-2);
  padding: 0 var(--tcrn-space-2h);
}

.tcrn-shell-demo--knowledge {
  padding: 0;
  overflow: hidden;
}

.tcrn-knowledge-shell-layout {
  --tcrn-knowledge-shell-divider: color-mix(in srgb, var(--tcrn-color-border-subtle) 74%, transparent);
  --tcrn-knowledge-shell-content-gutter: 18px;
  --tcrn-knowledge-shell-left-surface: var(--tcrn-color-brand-secondary-bg);
  --tcrn-knowledge-shell-top-surface: var(--tcrn-color-surface-panel);
  display: grid;
  grid-template-areas:
    "topbar topbar"
    "sidebar content";
  grid-template-columns: minmax(220px, 0.32fr) minmax(0, 1fr);
  gap: 0;
  align-items: stretch;
  min-width: 0;
  min-height: 540px;
  border: 1px solid color-mix(in srgb, var(--tcrn-color-border-subtle) 84%, transparent);
  border-radius: var(--tcrn-radius-surface);
  background: var(--tcrn-color-surface-canvas);
  overflow: hidden;
}

.tcrn-knowledge-shell__topbar {
  grid-area: topbar;
  display: grid;
  grid-template-columns: minmax(220px, 0.32fr) minmax(0, 1fr);
  align-items: center;
  gap: 0;
  min-width: 0;
  min-height: 76px;
  background: var(--tcrn-knowledge-shell-top-surface);
  padding: 0;
}

.tcrn-knowledge-shell__brand {
  min-width: 0;
  border-right: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  padding: 0;
}

.tcrn-knowledge-shell__topbar-copy,
.tcrn-knowledge-shell__actions,
.tcrn-knowledge-shell__sidebar-intro,
.tcrn-knowledge-shell__content,
.tcrn-knowledge-preview__panel,
.tcrn-knowledge-shell__pager {
  display: grid;
  gap: var(--tcrn-space-2);
  min-width: 0;
}

.tcrn-knowledge-shell__topbar-copy span {
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-caption);
  line-height: 1.35;
}

.tcrn-knowledge-shell__actions {
  grid-column: 2;
  grid-row: 1;
  z-index: 1;
  align-self: stretch;
  justify-self: end;
  width: min(260px, 44%);
  justify-items: stretch;
  align-content: center;
  background: transparent;
  padding: var(--tcrn-space-2h) var(--tcrn-space-3h);
}

.tcrn-knowledge-shell__topbar-copy {
  grid-column: 2;
  grid-row: 1;
  align-self: stretch;
  align-content: center;
  background: transparent;
  padding: var(--tcrn-space-2h) clamp(210px, 22vw, 300px) var(--tcrn-space-2h) var(--tcrn-knowledge-shell-content-gutter);
}

.tcrn-knowledge-shell__actions .tcrn-search-input {
  max-width: none;
}

.tcrn-bookmark-panel {
  display: grid;
  gap: var(--tcrn-space-2h);
  min-width: 0;
  border: 0;
  border-radius: 0;
  background: var(--tcrn-knowledge-shell-left-surface);
  padding: var(--tcrn-space-3);
}

.tcrn-knowledge-shell__sidebar {
  grid-area: sidebar;
  align-content: start;
  border-right: 0;
  background: var(--tcrn-knowledge-shell-left-surface);
  box-shadow: none;
}

.tcrn-bookmark-nav__group {
  display: grid;
  gap: var(--tcrn-space-1);
}

.tcrn-bookmark-nav--tracked a {
  overflow: hidden;
  border-color: transparent;
  background: transparent;
  padding-left: var(--tcrn-space-6);
}

.tcrn-bookmark-nav--tracked .tcrn-bookmark-nav__group > a[data-selected="true"],
.tcrn-bookmark-nav--tracked .tcrn-bookmark-nav__children a[data-selected="true"] {
  background: linear-gradient(
    90deg,
    var(--tcrn-color-brand-primary-bg) 0%,
    var(--tcrn-color-brand-primary-bg) 48%,
    var(--tcrn-color-surface-muted) 100%
  );
}

.tcrn-bookmark-nav--tracked .tcrn-bookmark-nav__group > a[data-selected="true"]::before,
.tcrn-bookmark-nav--tracked .tcrn-bookmark-nav__children a[data-selected="true"]::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 6px;
  width: 8px;
  height: 24px;
  border-radius: var(--tcrn-radius-pill);
  background: linear-gradient(180deg, var(--tcrn-color-brand-primary), var(--tcrn-color-brand-secondary));
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--tcrn-color-brand-primary-bg) 78%, transparent);
  transform: translateY(-50%);
}

.tcrn-bookmark-nav__children {
  display: grid;
  gap: var(--tcrn-space-1);
  padding-left: var(--tcrn-space-3);
}

.tcrn-bookmark-nav__children a {
  min-height: 30px;
  color: var(--tcrn-color-text-secondary);
}

.tcrn-knowledge-shell__content {
  grid-area: content;
  align-content: start;
  padding: var(--tcrn-space-4h) var(--tcrn-space-4h) var(--tcrn-space-4h) var(--tcrn-knowledge-shell-content-gutter);
}

.tcrn-knowledge-preview {
  align-content: start;
  border: 1px solid color-mix(in srgb, var(--tcrn-color-border-subtle) 84%, transparent);
  border-radius: var(--tcrn-radius-surface);
  background: var(--tcrn-color-surface-panel);
  padding: var(--tcrn-space-3h);
}

.tcrn-knowledge-preview__panel {
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-control);
  background: color-mix(in srgb, var(--tcrn-color-surface-panel) 90%, transparent);
  padding: var(--tcrn-space-3);
}

.tcrn-knowledge-shell__pager {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: auto;
}

.tcrn-knowledge-shell__pager a {
  display: grid;
  gap: var(--tcrn-space-1);
  min-width: 0;
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-control);
  background: color-mix(in srgb, var(--tcrn-color-surface-panel) 92%, transparent);
  color: var(--tcrn-color-text-primary);
  padding: var(--tcrn-space-3);
  text-decoration: none;
}

.tcrn-knowledge-shell__pager a:last-child {
  text-align: right;
}

.tcrn-knowledge-shell__pager-icon {
  width: 16px;
  height: 16px;
  color: var(--tcrn-color-brand-primary);
}

.tcrn-knowledge-shell__pager a:last-child .tcrn-knowledge-shell__pager-icon {
  justify-self: end;
  color: var(--tcrn-color-brand-secondary);
}

.tcrn-knowledge-shell__pager span {
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-caption);
  font-weight: 700;
}

.alpha-overlay-demo {
  display: grid;
  gap: var(--tcrn-space-3);
}

.tcrn-overlay-mode-matrix,
.tcrn-overlay-static-modes {
  display: grid;
  gap: var(--tcrn-space-3);
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  background: var(--tcrn-color-surface-panel);
  padding: var(--tcrn-space-3);
}

.tcrn-overlay-mode-matrix__intro {
  display: grid;
  gap: var(--tcrn-space-1h);
}

.tcrn-overlay-mode-grid,
.tcrn-overlay-drawer-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--tcrn-space-2h);
}

.tcrn-overlay-mode-card,
.tcrn-overlay-static-card {
  display: grid;
  gap: var(--tcrn-space-2h);
  min-width: 0;
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  background: var(--tcrn-color-surface-muted);
  padding: var(--tcrn-space-3);
}

.tcrn-overlay-mode-card {
  grid-template-columns: auto minmax(0, 1fr);
  align-items: start;
}

.tcrn-overlay-mode-card > div {
  display: grid;
  gap: var(--tcrn-space-1h);
  min-width: 0;
}

.tcrn-overlay-static-modes {
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
}

.tcrn-overlay-drawer-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.tcrn-dialog-spec-fixture {
  display: grid;
  gap: var(--tcrn-space-3);
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  background: var(--tcrn-color-surface-muted);
  padding: var(--tcrn-space-3);
}

.tcrn-dialog-spec-fixture__header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--tcrn-space-3);
  align-items: start;
}

.tcrn-dialog-spec-fixture__summary,
.tcrn-dialog-spec-fixture__dialog {
  min-width: 0;
}

.tcrn-dialog-spec-fixture__summary {
  display: grid;
  gap: var(--tcrn-space-1h);
}

.tcrn-dialog-spec-fixture__actions,
.tcrn-dialog-spec-fixture__dialog-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--tcrn-space-2);
}

.tcrn-dialog-spec-fixture__dialog {
  border-color: color-mix(in srgb, var(--tcrn-color-brand-primary) 26%, transparent);
  box-shadow: var(--tcrn-elevation-floating);
}

.tcrn-dialog-spec-fixture [data-dialog-fixture-panel],
.tcrn-dialog-spec-fixture [data-popover-fixture-panel] {
  display: grid;
  gap: var(--tcrn-space-2h);
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  pointer-events: none;
  transform: translateY(-8px) scale(0.985);
  transform-origin: top left;
  transition:
    max-height var(--tcrn-motion-emphasis),
    opacity var(--tcrn-motion-standard),
    transform var(--tcrn-motion-emphasis);
}

.tcrn-dialog-spec-fixture [data-dialog-fixture-panel][data-overlay-transition-state="open"],
.tcrn-dialog-spec-fixture [data-dialog-fixture-panel][data-overlay-transition-state="opening"],
.tcrn-dialog-spec-fixture [data-popover-fixture-panel][data-overlay-transition-state="open"],
.tcrn-dialog-spec-fixture [data-popover-fixture-panel][data-overlay-transition-state="opening"] {
  max-height: 720px;
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0) scale(1);
}

.tcrn-dialog-spec-fixture [data-dialog-fixture-panel][hidden],
.tcrn-dialog-spec-fixture [data-popover-fixture-panel][hidden] {
  display: none;
}

/* Overlay .tcrn-dialog / .tcrn-popover grid + the .tcrn-popover specifics moved into the
   package component CSS — TCRN-DS-STORY-037. The demo .alpha-overlay-demo__dialog keeps
   its own grid layout here. */
.alpha-overlay-demo__dialog {
  display: grid;
  gap: var(--tcrn-space-2h);
}

@media (max-width: 760px) {
  .alpha-frame {
    padding: var(--tcrn-space-4);
  }

  .tcrn-shell-demo__topbar,
  .tcrn-shell-hub-menu,
  .tcrn-shell-mega-menu,
  .tcrn-overlay-mode-grid,
  .tcrn-overlay-static-modes,
  .tcrn-overlay-drawer-grid,
  .tcrn-compact-shell__body,
  .tcrn-compact-shell__panel,
  .tcrn-shell-hub-actions,
  .tcrn-shell-task-lanes {
    grid-template-columns: 1fr;
  }

  .tcrn-entry-shell-strip,
  .tcrn-package-nav-proof {
    grid-template-columns: 1fr;
  }

  .tcrn-entry-shell-strip__module {
    justify-self: start;
  }

  .tcrn-nav-component-preview .tcrn-product-switcher {
    width: 100%;
  }

  .tcrn-compact-shell__switcher .tcrn-module-tabs {
    width: 100%;
  }

  .tcrn-knowledge-shell-layout {
    grid-template-areas:
      "topbar"
      "sidebar"
      "content";
    grid-template-columns: 1fr;
  }

  .tcrn-knowledge-shell__topbar,
  .tcrn-knowledge-shell__pager {
    grid-template-columns: 1fr;
  }

  .tcrn-dialog-spec-fixture__header {
    grid-template-columns: 1fr;
  }

  .tcrn-knowledge-shell__sidebar {
    border-right: 0;
    border-bottom: 1px solid var(--tcrn-color-border-subtle);
  }

  .tcrn-knowledge-shell__topbar-copy,
  .tcrn-knowledge-shell__actions {
    grid-column: auto;
    grid-row: auto;
  }

  .tcrn-knowledge-shell__brand {
    padding: 0;
  }

  .tcrn-knowledge-shell__topbar-copy,
  .tcrn-knowledge-shell__actions {
    width: auto;
    padding: var(--tcrn-space-2h) var(--tcrn-space-3h);
  }

  .tcrn-knowledge-shell__content {
    padding: var(--tcrn-space-4);
  }

  .tcrn-shell-layer {
    position: static;
    padding: var(--tcrn-space-3);
  }

  .tcrn-shell-demo__topbar .tcrn-search-input {
    max-width: none;
  }

  .tcrn-shell-demo--dense {
    gap: var(--tcrn-space-3);
    min-height: 0;
    padding: var(--tcrn-space-3);
  }

  .tcrn-shell-demo__topbar--dense {
    border: 1px solid color-mix(in srgb, var(--tcrn-color-border-subtle) 84%, transparent);
    border-radius: var(--tcrn-radius-surface);
    padding: var(--tcrn-space-2h);
  }

}

@media (max-width: 520px) {
  .tcrn-storybook-component-example .tcrn-top-bar {
    align-items: flex-start;
    flex-direction: column;
  }

}

@media (prefers-reduced-motion: reduce) {
  .tcrn-motion-demo__dot,
  .tcrn-loading-spinner,
  .tcrn-loading-progress__bar,
  .tcrn-loading-skeleton__line {
    animation-duration: var(--tcrn-motion-reduced-duration);
    animation-iteration-count: 1;
  }

  .tcrn-loading-spinner,
  .tcrn-loading-progress__bar {
    transform: none;
  }

/* Reduced motion stops loops and cancels travel, but does not flatten the v2
     comprehension cue: opacity and colour transitions survive at a real duration,
     governed by the component reduced-motion rules. The old blanket
     transition-duration clamp made the docs shell demonstrate the v1 kill-switch the
     component CSS had deliberately moved away from. */
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
`;
