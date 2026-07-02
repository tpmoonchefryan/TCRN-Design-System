import { createCssVariables, createThemeCssVariables } from "@tcrn/ui-tokens";

export const alphaStoryCss = `${createCssVariables()}${createThemeCssVariables("dark")}
* { box-sizing: border-box; }
html {
  --tcrn-anchor-scroll-offset: 96px;
  --tcrn-doc-motion-spring: 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --tcrn-doc-motion-smooth: 0.4s ease;
  --tcrn-doc-theme-crossfade-duration: 0.4s;
  --tcrn-doc-theme-crossfade-easing: ease;
  scroll-padding-top: var(--tcrn-anchor-scroll-offset);
  color-scheme: light;
}
html[data-tcrn-theme="dark"] {
  color-scheme: dark;
}
@keyframes tcrn-doc-theme-root-fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}
@keyframes tcrn-doc-theme-root-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
::view-transition-group(root) {
  animation-duration: var(--tcrn-doc-theme-crossfade-duration);
  animation-timing-function: var(--tcrn-doc-theme-crossfade-easing);
}
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: var(--tcrn-doc-theme-crossfade-duration);
  animation-timing-function: var(--tcrn-doc-theme-crossfade-easing);
  mix-blend-mode: normal;
}
::view-transition-old(root) {
  animation-name: tcrn-doc-theme-root-fade-out;
}
::view-transition-new(root) {
  animation-name: tcrn-doc-theme-root-fade-in;
}
html[data-theme-switching="true"] *,
html[data-theme-switching="true"] *::before,
html[data-theme-switching="true"] *::after {
  transition-duration: 0s !important;
  transition-delay: 0s !important;
}
body {
  margin: 0;
  background: var(--tcrn-color-surface-canvas);
  color: var(--tcrn-color-text-primary);
  font-family: var(--tcrn-type-family-ui);
  font-size: var(--tcrn-type-size-ui);
  line-height: var(--tcrn-type-line-ui);
  transition:
    background-color var(--tcrn-doc-motion-smooth),
    color var(--tcrn-doc-motion-smooth);
}
.tcrn-doc-theme-transition-wash {
  position: fixed;
  inset: 0;
  z-index: 2147483647;
  pointer-events: none;
  background: var(--tcrn-color-surface-canvas);
  opacity: 0;
  transition: opacity var(--tcrn-doc-theme-crossfade-duration) var(--tcrn-doc-theme-crossfade-easing);
}
.tcrn-doc-theme-transition-wash[data-active="true"] {
  opacity: 1;
}
.tcrn-storybook-product-shell[data-storybook-locale="en"],
.tcrn-storybook-product-shell[data-storybook-locale="fr"] {
  --tcrn-type-family-ui: var(--tcrn-type-family-latin);
}
.tcrn-storybook-product-shell[data-storybook-locale="zh-CN"] {
  --tcrn-type-family-ui: var(--tcrn-type-family-zh-cn);
}
.tcrn-storybook-product-shell[data-storybook-locale="ja"] {
  --tcrn-type-family-ui: var(--tcrn-type-family-ja);
}
.tcrn-storybook-product-shell[data-storybook-locale="ko"] {
  --tcrn-type-family-ui: var(--tcrn-type-family-ko);
}
.tcrn-storybook-product-shell {
  --tcrn-product-shell-sidebar-width: 326px;
  --tcrn-storybook-shell-sidebar-width: 326px;
  --tcrn-storybook-shell-topbar-height: 96px;
  --tcrn-storybook-shell-topbar-padding-inline: 26px;
  --tcrn-storybook-shell-search-width: 180px;
  --tcrn-storybook-shell-search-expanded-width: 320px;
  --tcrn-storybook-shell-control-border: #b8c8d6;
  --tcrn-storybook-shell-card-border: #d5e0ea;
  --tcrn-storybook-shell-page-wash: linear-gradient(180deg, #f7f8ff 0%, #edf9f9 100%);
  --tcrn-storybook-shell-panel-wash: color-mix(in srgb, var(--tcrn-color-surface-panel) 82%, transparent);
  --tcrn-storybook-shell-mobile-layer-surface: var(--tcrn-color-surface-panel);
  background: var(--tcrn-storybook-shell-page-wash);
}
.tcrn-storybook-product-shell .tcrn-product-shell__sidebar {
  padding: 30px 34px 24px;
  gap: 28px;
  border-right: 1px solid color-mix(in srgb, var(--tcrn-storybook-shell-card-border) 76%, transparent);
  background: linear-gradient(180deg, #f4f7ff 0%, #edf9fa 100%);
}
.tcrn-storybook-product-shell .tcrn-product-shell__sidebar-header {
  grid-template-columns: minmax(0, 1fr) 38px;
  gap: 14px;
}
.tcrn-storybook-product-shell .tcrn-product-shell__brand {
  min-height: 46px;
}
.tcrn-storybook-product-shell .tcrn-shell-brand-lockup {
  align-items: center;
  gap: 10px;
}
.tcrn-storybook-product-shell .tcrn-shell-brand-lockup__copy {
  display: grid;
  gap: 2px;
  min-width: 0;
}
.tcrn-storybook-product-shell .tcrn-brand-wordmark {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  min-width: 0;
  color: var(--tcrn-color-text-primary);
  font-size: 15px;
  line-height: 1.18;
  font-weight: 800;
  overflow-wrap: normal;
}
.tcrn-storybook-product-shell .tcrn-brand-wordmark__suffix--design-system,
.tcrn-storybook-product-shell .tcrn-brand-wordmark__suffix {
  background: linear-gradient(105deg, #6577f3 0%, #3096f4 31%, #43d4cf 62%, #b8e978 100%);
  background-clip: text;
  color: transparent;
  font-weight: 800;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.tcrn-storybook-product-shell .tcrn-shell-brand-lockup__caption {
  color: var(--tcrn-color-brand-primary);
  font-size: 12px;
  line-height: 1.25;
  font-weight: 700;
}
.tcrn-storybook-product-shell .tcrn-product-logo__line-one {
  font-size: 15px;
  line-height: 1.18;
}
.tcrn-storybook-product-shell .tcrn-product-logo__line-two {
  color: var(--tcrn-color-brand-primary);
  font-size: 12px;
  line-height: 1.25;
}
.tcrn-storybook-product-shell .tcrn-side-nav {
  gap: 16px;
}
.tcrn-storybook-product-shell .tcrn-nav-group {
  gap: 8px;
}
.tcrn-storybook-product-shell .tcrn-nav-group__label {
  padding-inline: 4px;
  color: var(--tcrn-color-text-primary);
  font-size: 13px;
  line-height: 1.25;
  font-weight: 800;
  text-transform: none;
}
.tcrn-storybook-product-shell .tcrn-nav-item {
  position: relative;
  min-height: 34px;
  padding: 6px 12px 6px 18px;
  color: var(--tcrn-color-text-secondary);
}
.tcrn-storybook-product-shell .tcrn-nav-item::before {
  content: "";
  position: absolute;
  inset-block: 7px;
  inset-inline-start: 7px;
  width: 3px;
  border-radius: 999px;
  background: transparent;
}
.tcrn-storybook-product-shell .tcrn-nav-item[data-selected="true"],
.tcrn-storybook-product-shell .tcrn-nav-item[aria-current="page"] {
  border-color: var(--tcrn-storybook-shell-card-border);
  background: color-mix(in srgb, var(--tcrn-color-brand-secondary-bg) 52%, var(--tcrn-color-surface-panel));
  color: var(--tcrn-color-text-primary);
}
.tcrn-storybook-product-shell .tcrn-nav-item[data-selected="true"]::before,
.tcrn-storybook-product-shell .tcrn-nav-item[aria-current="page"]::before,
.tcrn-storybook-product-shell .tcrn-nav-item[aria-current="location"]::before {
  background: var(--tcrn-color-brand-primary);
}
.tcrn-storybook-product-shell .tcrn-product-shell__workspace {
  background:
    radial-gradient(circle at 92% 0%, color-mix(in srgb, var(--tcrn-color-brand-secondary-bg) 52%, transparent), transparent 34%),
    linear-gradient(180deg, color-mix(in srgb, var(--tcrn-color-surface-panel) 72%, transparent) 0%, transparent 260px);
}
.tcrn-storybook-product-shell .tcrn-product-shell__workspace > .tcrn-top-bar {
  min-height: var(--tcrn-storybook-shell-topbar-height);
  padding: 30px var(--tcrn-storybook-shell-topbar-padding-inline) 28px 0;
  border-bottom: 0;
  background: transparent;
  backdrop-filter: none;
}
.tcrn-storybook-product-shell .tcrn-product-shell__utility-row {
  flex-wrap: nowrap;
  gap: 14px;
}
.tcrn-storybook-product-shell .tcrn-product-shell__current-location {
  flex: 0 1 320px;
  max-width: 320px;
  margin-right: auto;
}
.tcrn-storybook-product-shell .tcrn-product-shell__current-location span {
  color: var(--tcrn-color-brand-primary);
  font-size: 12px;
  font-weight: 800;
}
.tcrn-storybook-product-shell .tcrn-product-shell__current-location strong {
  font-size: 18px;
  line-height: 1.1;
}
.tcrn-storybook-product-shell .tcrn-product-shell-search {
  flex-basis: var(--tcrn-storybook-shell-search-width);
  width: var(--tcrn-storybook-shell-search-width);
  max-width: min(100%, var(--tcrn-storybook-shell-search-width));
}
.tcrn-storybook-product-shell .tcrn-product-shell-search[data-search-expanded="true"] {
  flex-basis: var(--tcrn-storybook-shell-search-expanded-width);
  width: var(--tcrn-storybook-shell-search-expanded-width);
  max-width: min(100%, var(--tcrn-storybook-shell-search-expanded-width));
}
.tcrn-storybook-product-shell .tcrn-search-input {
  grid-template-columns: 18px minmax(0, 1fr) max-content;
  min-height: 36px;
  padding: 0 10px;
  border-color: var(--tcrn-storybook-shell-control-border);
  background: var(--tcrn-storybook-shell-panel-wash);
}
.tcrn-storybook-product-shell .tcrn-search-input__control {
  min-height: 34px;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  outline: 0;
}
.tcrn-storybook-product-shell .tcrn-search-input__shortcut {
  padding: 1px 7px;
  border-radius: 6px;
  background: color-mix(in srgb, var(--tcrn-color-surface-muted) 86%, var(--tcrn-color-surface-panel));
}
.tcrn-storybook-product-shell .tcrn-shell-theme-toggle,
.tcrn-storybook-product-shell .tcrn-button.tcrn-shell-theme-toggle,
.tcrn-storybook-product-shell .tcrn-shell-locale-menu__trigger {
  border-color: var(--tcrn-storybook-shell-control-border);
  background: var(--tcrn-storybook-shell-panel-wash);
}
.tcrn-storybook-product-shell .tcrn-product-shell__main {
  padding: 0;
}
.tcrn-storybook-product-shell .tcrn-doc-content {
  width: 100%;
  max-width: 1180px;
  margin: 0;
  padding: 16px 32px 32px;
  gap: 16px;
  background: transparent;
}
.tcrn-storybook-product-shell .tcrn-doc-page-head {
  order: 2;
  grid-template-columns: minmax(0, 1fr);
  gap: 10px;
  margin-top: 2px;
  padding: 14px 0 0;
  border-top: 1px solid var(--tcrn-color-border-subtle);
  border-bottom: 0;
}
.tcrn-storybook-product-shell .tcrn-doc-page-head h2 {
  font-size: 18px;
}
.tcrn-storybook-product-shell .tcrn-doc-page-head__intro {
  gap: 5px;
}
.tcrn-storybook-product-shell .tcrn-doc-page-head__intro p {
  max-width: 86ch;
  font-size: var(--tcrn-type-size-caption);
}
.tcrn-storybook-product-shell .tcrn-doc-on-this-page {
  border-left: 0;
  border-top: 1px solid var(--tcrn-color-border-subtle);
  padding: 10px 0 0;
}
.tcrn-storybook-product-shell .tcrn-doc-on-this-page ol {
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}
.tcrn-storybook-product-shell article,
.tcrn-storybook-product-shell .alpha-story-card,
.tcrn-storybook-product-shell .tcrn-readback-panel,
.tcrn-storybook-product-shell .tcrn-table-shell,
.tcrn-storybook-product-shell .tcrn-changelog-record {
  border-color: var(--tcrn-storybook-shell-card-border);
}
h1, h2, h3, p {
  margin: 0;
}
.alpha-frame {
  display: grid;
  gap: var(--tcrn-space-4);
  width: 100%;
  min-width: 0;
}
.alpha-frame {
  max-width: var(--tcrn-container-readable);
  margin: 0 auto;
  padding: 20px;
}
.tcrn-doc-page-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(220px, 320px);
  gap: 14px;
  align-items: start;
  min-width: 0;
  border-bottom: 1px solid var(--tcrn-color-border-subtle);
  padding: 2px 0 16px;
}
.tcrn-doc-page-head h2 {
  font-size: var(--tcrn-type-size-page);
  line-height: var(--tcrn-type-line-page);
}
.tcrn-doc-page-head__intro {
  display: grid;
  gap: 7px;
  min-width: 0;
}
.tcrn-doc-page-head__intro p {
  max-width: 74ch;
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-body);
  line-height: var(--tcrn-type-line-body);
}
.tcrn-doc-page-head__eyebrow {
  color: var(--tcrn-color-focus-ring);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0;
}
.tcrn-doc-on-this-page {
  display: grid;
  gap: 7px;
  min-width: 0;
  border-left: 1px solid var(--tcrn-color-border-subtle);
  padding-left: 14px;
}
.tcrn-doc-on-this-page strong {
  color: var(--tcrn-color-text-primary);
  font-size: var(--tcrn-type-size-caption);
  line-height: 1.3;
}
.tcrn-doc-on-this-page ol {
  display: grid;
  gap: 5px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.tcrn-doc-on-this-page li {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.tcrn-doc-on-this-page a {
  min-width: 0;
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-caption);
  line-height: 1.35;
  text-decoration: none;
}
.tcrn-doc-on-this-page a:hover,
.tcrn-doc-on-this-page a:focus-visible {
  color: var(--tcrn-color-text-primary);
}
.tcrn-doc-on-this-page span,
.tcrn-doc-boundary-strip span {
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-color-surface-muted);
  color: var(--tcrn-color-text-secondary);
  font-size: 11px;
  font-weight: 700;
  line-height: 1.2;
  padding: 3px 6px;
}
.tcrn-doc-boundary-strip {
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-width: 0;
}
.tcrn-doc-eyebrow {
  color: var(--tcrn-color-focus-ring);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0;
}
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(root),
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation-duration: 0.01ms;
  }
  .tcrn-doc-theme-transition-wash {
    transition: none;
  }
  .tcrn-shell-theme-toggle__icon {
    transition: none;
  }
}
.tcrn-doc-claim {
  color: var(--tcrn-color-text-secondary);
}
.tcrn-doc-content {
  display: grid;
  gap: 18px;
  align-content: start;
  min-width: 0;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--tcrn-color-surface-canvas) 88%, var(--tcrn-color-surface-panel)) 0%, var(--tcrn-color-surface-canvas) 220px);
  padding: clamp(24px, 2.6vw, 48px);
  transition: padding var(--tcrn-motion-emphasis);
}
article, .alpha-story-card {
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  background: var(--tcrn-color-surface-panel);
  padding: 16px;
  max-width: 100%;
  min-width: 0;
}
article {
  overflow-x: hidden;
  scroll-margin-top: var(--tcrn-anchor-scroll-offset);
}
.alpha-story-card {
  display: grid;
  gap: 12px;
}
.alpha-story-card > h1 + p {
  margin-top: -8px;
}
.tcrn-story-kicker {
  color: var(--tcrn-color-brand-primary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0;
}
.tcrn-static-section {
  display: grid;
  gap: 14px;
}
.tcrn-doc-chapter-pager {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 2px;
}
.tcrn-doc-chapter-pager__link {
  display: grid;
  gap: 4px;
  min-height: 78px;
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--tcrn-color-brand-primary-bg) 70%, var(--tcrn-color-surface-panel)) 0%, var(--tcrn-color-surface-panel) 76%);
  color: var(--tcrn-color-text-primary);
  padding: 14px;
  text-decoration: none;
}
.tcrn-doc-chapter-pager__icon {
  width: 16px;
  height: 16px;
  color: var(--tcrn-color-brand-primary);
}
.tcrn-doc-chapter-pager__link--next {
  text-align: right;
  background:
    linear-gradient(225deg, color-mix(in srgb, var(--tcrn-color-brand-secondary-bg) 72%, var(--tcrn-color-surface-panel)) 0%, var(--tcrn-color-surface-panel) 76%);
}
.tcrn-doc-chapter-pager__link--next .tcrn-doc-chapter-pager__icon {
  justify-self: end;
  color: var(--tcrn-color-brand-secondary);
}
.tcrn-doc-chapter-pager__eyebrow {
  color: var(--tcrn-color-text-secondary);
  font-size: 11px;
  font-weight: 700;
}
.tcrn-doc-chapter-pager__title {
  font-size: 15px;
  font-weight: 800;
}
.tcrn-doc-chapter-pager__link:focus-visible,
.tcrn-doc-chapter-pager__link:hover {
  outline: none;
  border-color: var(--tcrn-color-focus-ring);
  box-shadow: var(--tcrn-elevation-focus);
}
.tcrn-doc-chapter-pager__placeholder {
  min-height: 78px;
}
article > h2 + p {
  margin-top: 4px;
}
article > p + .story-body {
  margin-top: 14px;
}
button, input, select {
  font: inherit;
}
h1, h2, h3, p, span, button, label {
  overflow-wrap: anywhere;
}
.tcrn-doc-chapter-pager :focus-visible {
  outline: 2px solid var(--tcrn-color-focus-ring);
  outline-offset: 2px;
  box-shadow: var(--tcrn-elevation-focus);
}
.story-body {
  display: grid;
  gap: 12px;
  min-width: 0;
}
.tcrn-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.tcrn-button, .tcrn-link-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid var(--tcrn-color-border-strong);
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-color-surface-panel);
  color: var(--tcrn-color-text-primary);
  min-height: 34px;
  padding: 0 12px;
}
.tcrn-button[disabled] {
  cursor: not-allowed;
  color: var(--tcrn-color-text-muted);
  background: var(--tcrn-color-surface-muted);
  border-color: var(--tcrn-color-border-subtle);
}
.tcrn-button--primary {
  background: var(--tcrn-color-focus-ring);
  color: #fff;
  border-color: var(--tcrn-color-focus-ring);
}
[data-tcrn-theme="dark"] .tcrn-button--primary {
  color: var(--tcrn-color-surface-canvas);
  font-weight: 700;
}
.tcrn-button--danger {
  color: var(--tcrn-color-state-blocked);
}
.tcrn-button--quiet {
  border-color: transparent;
  background: transparent;
}
.tcrn-icon {
  display: inline-block;
  flex: none;
  color: currentColor;
  fill: none;
  stroke: currentColor;
  vertical-align: -0.125em;
}
.tcrn-icon-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.tcrn-badge {
  display: inline-flex;
  width: max-content;
  max-width: 100%;
  border-radius: var(--tcrn-radius-control);
  padding: 4px 8px;
  background: var(--tcrn-color-surface-muted);
  color: var(--tcrn-color-text-secondary);
}
.tcrn-badge--positive {
  background: var(--tcrn-color-state-ready-bg);
  color: var(--tcrn-color-state-ready);
}
.tcrn-badge--warning {
  background: var(--tcrn-color-state-warning-bg);
  color: var(--tcrn-color-state-warning);
}
.tcrn-badge--danger {
  background: var(--tcrn-color-state-blocked-bg);
  color: var(--tcrn-color-state-blocked);
}
.tcrn-highlight-text {
  display: inline;
}
.tcrn-highlight-mark {
  border-radius: 3px;
  background: var(--tcrn-color-brand-primary-bg);
  color: var(--tcrn-color-text-primary);
  font-weight: var(--tcrn-type-weight-medium);
  padding: 0 2px;
}
.tcrn-environment-banner {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  width: max-content;
  max-width: 100%;
}
.alpha-story-stack {
  display: grid;
  gap: 12px;
}
.tcrn-changelog-records {
  display: grid;
  gap: 12px;
  min-width: 0;
}
.tcrn-changelog-record {
  display: grid;
  gap: 12px;
  min-width: 0;
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  background: var(--tcrn-color-surface-panel);
  padding: 12px;
}
.tcrn-changelog-record__header {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: start;
  gap: 10px;
  min-width: 0;
}
.tcrn-changelog-record__header h3,
.tcrn-changelog-record__header p {
  margin: 0;
}
.tcrn-changelog-record__evidence-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
  min-width: 0;
}
.tcrn-changelog-record__evidence-list {
  display: grid;
  gap: 8px;
  min-width: 0;
}
.tcrn-changelog-record__evidence-list h4 {
  margin: 0;
  font-size: var(--tcrn-type-size-body);
}
.tcrn-changelog-record__evidence-list ul {
  display: grid;
  gap: 6px;
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
  gap: 2px;
  width: min(100%, max-content);
  max-width: 100%;
  min-width: 0;
}
.tcrn-changelog-token__label {
  color: var(--tcrn-color-text-secondary);
  font-size: 11px;
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
  font-size: 12px;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tcrn-guidance-grid,
.tcrn-spec-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  min-width: 0;
}
.tcrn-guidance-list {
  display: grid;
  gap: 8px;
  margin: 0;
  padding-inline-start: 18px;
}
.tcrn-status-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.tcrn-form-stack {
  display: grid;
  gap: 12px;
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
  gap: 8px;
  min-width: 0;
}
.tcrn-locale-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 8px;
}
.tcrn-locale-card {
  display: grid;
  gap: 6px;
  min-width: 0;
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  padding: 10px;
  background: var(--tcrn-color-surface-panel);
}
.tcrn-locale-card span {
  color: var(--tcrn-color-text-secondary);
}
.tcrn-token-swatch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 10px;
  min-width: 0;
}
.tcrn-token-swatch {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr);
  gap: 4px 10px;
  align-items: center;
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  padding: 10px;
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
.tcrn-brand-system {
  display: grid;
  grid-template-columns: minmax(180px, 240px) minmax(0, 1fr);
  gap: 18px;
  align-items: center;
  min-width: 0;
}
.tcrn-brand-system__symbol {
  display: grid;
  place-items: center;
  border-radius: calc(var(--tcrn-radius-surface) + 4px);
  background:
    radial-gradient(circle at 35% 20%, color-mix(in srgb, var(--tcrn-color-brand-primary-bg) 64%, transparent), transparent 42%),
    var(--tcrn-color-surface-muted);
  padding: 22px;
}
.tcrn-brand-system__copy {
  display: grid;
  gap: 10px;
  min-width: 0;
}
.tcrn-brand-system__copy h3,
.tcrn-brand-system__copy p {
  margin: 0;
}
.tcrn-brand-mark {
  display: block;
  width: min(100%, 220px);
  height: auto;
  color: var(--tcrn-color-text-primary);
}
.tcrn-brand-lockups {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  min-width: 0;
}
.tcrn-brand-lockup {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  background: var(--tcrn-color-surface-panel);
  padding: 12px;
}
.tcrn-brand-lockup .tcrn-brand-mark {
  width: 62px;
  flex: 0 0 auto;
}
.tcrn-brand-wordmark {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 2px 8px;
  min-width: 0;
  color: var(--tcrn-color-text-primary);
  font-size: 20px;
  line-height: 1.15;
  font-weight: var(--tcrn-type-weight-strong);
  overflow-wrap: anywhere;
}
.tcrn-brand-wordmark__base {
  flex: 0 0 auto;
}
.tcrn-brand-wordmark__suffix {
  flex: 0 1 auto;
  min-width: 0;
  color: var(--tcrn-color-text-secondary);
  font-weight: var(--tcrn-type-weight-medium);
}
.tcrn-brand-lockup--long-name .tcrn-brand-wordmark {
  align-items: flex-start;
  flex-direction: column;
  gap: 2px;
}
.tcrn-brand-lockup--long-name .tcrn-brand-wordmark__suffix {
  flex-basis: auto;
  line-height: 1.06;
}
.tcrn-brand-wordmark__suffix--aos {
  color: #187c7c;
}
.tcrn-brand-wordmark__suffix--tms {
  color: #2c63c8;
}
.tcrn-brand-wordmark__suffix--design-system {
  background: linear-gradient(105deg, #6577f3 0%, #3096f4 31%, #43d4cf 62%, #b8e978 100%);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.tcrn-typography-sample {
  display: grid;
  gap: 8px;
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  padding: 12px;
  background: var(--tcrn-color-surface-panel);
  min-width: 0;
}
.tcrn-typography-sample h3,
.tcrn-typography-sample p {
  margin: 0;
}
.tcrn-type-scale-demo {
  display: grid;
  gap: 10px;
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  padding: 12px;
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
  font-size: 12px;
  line-height: 1.4;
  color: var(--tcrn-color-text-secondary);
  overflow-wrap: anywhere;
}
.tcrn-icon-sample-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(156px, 1fr));
  gap: 8px;
  margin: var(--tcrn-space-4) 0 0;
  padding: 0;
  list-style: none;
  min-width: 0;
}
.tcrn-icon-sample {
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  min-width: 0;
  min-height: 40px;
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-color-surface-muted);
  color: var(--tcrn-color-text-secondary);
  padding: 8px 10px;
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
  font-size: 12px;
  line-height: 1.3;
}
.tcrn-motion-demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
  min-width: 0;
}
.tcrn-motion-demo {
  display: grid;
  gap: 10px;
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  padding: 12px;
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
  border-radius: 999px;
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
  gap: 10px;
  min-width: 0;
}

.tcrn-loading-card {
  display: grid;
  gap: 10px;
  align-content: start;
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  padding: 12px;
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
  gap: 10px;
  min-width: 0;
}

.tcrn-loading-spinner {
  width: 30px;
  height: 30px;
  flex: 0 0 auto;
  border: 3px solid var(--tcrn-color-brand-primary-bg);
  border-top-color: var(--tcrn-color-brand-primary);
  border-radius: 999px;
  animation: tcrn-motion-spin var(--tcrn-motion-loading-loop) infinite;
}

.tcrn-loading-copy {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.tcrn-loading-progress {
  position: relative;
  min-height: 10px;
  border-radius: 999px;
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
  gap: 8px;
  padding: 4px 0;
}

.tcrn-loading-skeleton__line {
  min-height: 12px;
  border-radius: 999px;
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
  padding: 4px 8px;
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
  gap: 10px;
  color: var(--tcrn-color-text-primary);
  background:
    linear-gradient(145deg, rgba(30, 43, 70, 0.96) 0%, rgba(18, 42, 57, 0.96) 55%, rgba(25, 35, 58, 0.96) 100%),
    var(--tcrn-color-surface-canvas);
  border: 1px solid rgba(143, 162, 186, 0.34);
  border-radius: var(--tcrn-radius-surface);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 18px 44px rgba(8, 18, 32, 0.18);
  padding: 12px;
}
.tcrn-surface,
.tcrn-readback-panel,
.tcrn-detail-inspector,
.tcrn-gate-readiness-panel,
.tcrn-state-view,
.tcrn-disclosure-panel,
.tcrn-inline-alert,
.tcrn-popover,
.tcrn-dialog,
.tcrn-confirm-dialog,
.tcrn-detail-drawer,
.tcrn-action-drawer {
  display: grid;
  gap: 10px;
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  padding: 12px;
  background: var(--tcrn-color-surface-panel);
  min-width: 0;
}
.tcrn-inline-alert {
  color: var(--tcrn-color-text-primary);
}
.tcrn-inline-alert--warning {
  background: var(--tcrn-color-state-warning-bg);
  border-color: rgba(122, 78, 0, 0.32);
}
.tcrn-state-view {
  display: grid;
  gap: 8px;
}
.tcrn-state-view h3,
.tcrn-state-view p {
  margin: 0;
}
.tcrn-skeleton,
.tcrn-skeleton-group {
  display: block;
  max-width: 100%;
}
.tcrn-skeleton {
  position: relative;
  overflow: hidden;
  min-height: 18px;
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-color-surface-muted);
}
.tcrn-skeleton::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.62), transparent);
  animation: tcrn-skeleton-shimmer var(--tcrn-motion-skeleton-loop) infinite;
}
.tcrn-skeleton--text {
  width: 100%;
  height: 1em;
}
.tcrn-skeleton--rectangular {
  width: 100%;
  height: 56px;
}
.tcrn-skeleton--circular {
  width: 40px;
  height: 40px;
  border-radius: 999px;
}
.tcrn-skeleton-group {
  display: grid;
  gap: 8px;
}
.tcrn-skeleton-group .tcrn-skeleton:last-child {
  width: 72%;
}
@keyframes tcrn-skeleton-shimmer {
  100% {
    transform: translateX(100%);
  }
}
.tcrn-state-surface {
  display: grid;
  place-items: center;
  gap: 8px;
  text-align: center;
  min-height: 144px;
  color: var(--tcrn-color-text-secondary);
}
.tcrn-state-surface__icon {
  color: var(--tcrn-color-text-muted);
}
.tcrn-state-surface__title,
.tcrn-state-surface__description {
  margin: 0;
}
.tcrn-state-surface--warning .tcrn-state-surface__title,
.tcrn-state-surface--warning .tcrn-state-surface__icon {
  color: var(--tcrn-color-state-warning);
}
.tcrn-state-surface--danger .tcrn-state-surface__title,
.tcrn-state-surface--danger .tcrn-state-surface__icon {
  color: var(--tcrn-color-state-blocked);
}
.tcrn-display-primitive-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  align-items: stretch;
}
.tcrn-interaction-primitive-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
.tcrn-interaction-primitive-grid {
  display: grid;
  gap: 12px;
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
  padding: 0 10px;
  font-family: var(--tcrn-font-family-mono);
  font-size: 12px;
}
.tcrn-tooltip {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: fit-content;
}
.tcrn-tooltip__content {
  position: absolute;
  z-index: var(--tcrn-z-popover);
  pointer-events: none;
  width: max-content;
  max-width: min(260px, calc(100vw - 32px));
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-color-text-primary);
  color: var(--tcrn-color-surface-panel);
  padding: 6px 8px;
  font-size: 12px;
  line-height: 1.35;
  opacity: 0;
  transform: translateY(4px);
  transition: opacity var(--tcrn-motion-standard), transform var(--tcrn-motion-standard);
  box-shadow: 0 10px 24px rgba(12, 22, 34, 0.18);
}
.tcrn-tooltip:hover .tcrn-tooltip__content,
.tcrn-tooltip:focus-within .tcrn-tooltip__content,
.tcrn-tooltip[data-storybook-static-tooltip="true"] .tcrn-tooltip__content {
  opacity: 1;
  transform: translateY(0);
}
.tcrn-tooltip[data-placement="top"] .tcrn-tooltip__content {
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translate(-50%, 4px);
}
.tcrn-tooltip[data-placement="top"]:hover .tcrn-tooltip__content,
.tcrn-tooltip[data-placement="top"]:focus-within .tcrn-tooltip__content,
.tcrn-tooltip[data-placement="top"][data-storybook-static-tooltip="true"] .tcrn-tooltip__content {
  transform: translate(-50%, 0);
}
.tcrn-tooltip[data-placement="bottom"] .tcrn-tooltip__content {
  top: calc(100% + 6px);
  left: 50%;
  transform: translate(-50%, -4px);
}
.tcrn-tooltip[data-placement="bottom"]:hover .tcrn-tooltip__content,
.tcrn-tooltip[data-placement="bottom"]:focus-within .tcrn-tooltip__content,
.tcrn-tooltip[data-placement="bottom"][data-storybook-static-tooltip="true"] .tcrn-tooltip__content {
  transform: translate(-50%, 0);
}
.tcrn-tooltip[data-placement="right"] .tcrn-tooltip__content {
  top: 50%;
  left: calc(100% + 8px);
  transform: translate(-4px, -50%);
}
.tcrn-tooltip[data-placement="right"]:hover .tcrn-tooltip__content,
.tcrn-tooltip[data-placement="right"]:focus-within .tcrn-tooltip__content,
.tcrn-tooltip[data-placement="right"][data-storybook-static-tooltip="true"] .tcrn-tooltip__content {
  transform: translate(0, -50%);
}
.tcrn-tooltip[data-placement="left"] .tcrn-tooltip__content {
  top: 50%;
  right: calc(100% + 8px);
  transform: translate(4px, -50%);
}
.tcrn-tooltip[data-placement="left"]:hover .tcrn-tooltip__content,
.tcrn-tooltip[data-placement="left"]:focus-within .tcrn-tooltip__content,
.tcrn-tooltip[data-placement="left"][data-storybook-static-tooltip="true"] .tcrn-tooltip__content {
  transform: translate(0, -50%);
}
.tcrn-collapsible-region {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0.4;
  transition: grid-template-rows var(--tcrn-motion-emphasis), opacity var(--tcrn-motion-standard);
}
.tcrn-collapsible-region[data-expanded="true"] {
  grid-template-rows: 1fr;
  opacity: 1;
}
.tcrn-collapsible-region[aria-hidden="true"] {
  visibility: hidden;
}
.tcrn-collapsible-region__inner {
  min-height: 0;
  overflow: hidden;
}
.tcrn-disclosure-panel {
  display: grid;
  gap: 8px;
}
.tcrn-disclosure-panel__title {
  margin: 0;
}
.tcrn-key-value-list {
  display: grid;
  gap: 8px;
  margin: 0;
}
.tcrn-key-value-list > div {
  display: grid;
  gap: 4px;
  grid-template-columns: minmax(120px, 0.32fr) minmax(0, 1fr);
}
.tcrn-key-value-list dt {
  color: var(--tcrn-color-text-secondary);
  font-weight: 700;
}
.tcrn-key-value-list dd {
  margin: 0;
  min-width: 0;
}
.tcrn-field {
  display: grid;
  gap: 4px;
  margin-bottom: 10px;
  border-radius: var(--tcrn-radius-control);
  background-color: transparent;
  outline: 1px solid transparent;
  outline-offset: 2px;
  transition:
    background-color 150ms ease-out,
    outline-color 150ms ease-out;
}
.tcrn-field:focus-within {
  background-color: color-mix(in srgb, var(--tcrn-color-surface-muted) 56%, transparent);
  outline-color: color-mix(in srgb, var(--tcrn-color-border-strong) 66%, transparent);
}
.tcrn-field--error {
  background-color: color-mix(in srgb, var(--tcrn-color-state-blocked-bg) 62%, transparent);
  outline-color: var(--tcrn-color-state-blocked);
}
.tcrn-field__label {
  font-weight: 600;
}
.tcrn-field__hint {
  color: var(--tcrn-color-text-secondary);
}
.tcrn-field__error {
  color: var(--tcrn-color-state-blocked);
}
.tcrn-text {
  color: var(--tcrn-color-text-secondary);
}
.tcrn-input, .tcrn-select {
  min-height: 34px;
  border: 1px solid var(--tcrn-color-border-strong);
  border-radius: var(--tcrn-radius-control);
  padding: 0 10px;
  max-width: 100%;
}
.tcrn-input--short {
  width: min(18ch, 100%);
}
.tcrn-checkbox {
  accent-color: var(--tcrn-color-brand-primary);
}
.tcrn-storybook-component-example .tcrn-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  background: var(--tcrn-color-surface-panel);
  padding: 10px 12px;
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
  gap: 12px;
  min-width: 0;
  border: 1px solid color-mix(in srgb, var(--tcrn-color-border-subtle) 78%, transparent);
  border-radius: var(--tcrn-radius-surface);
  background:
    linear-gradient(105deg, color-mix(in srgb, var(--tcrn-color-surface-panel) 96%, transparent) 0%, color-mix(in srgb, var(--tcrn-color-brand-secondary-bg) 54%, var(--tcrn-color-surface-panel)) 100%);
  padding: 10px 12px;
  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--tcrn-color-surface-panel) 78%, transparent);
}
.tcrn-entry-shell-strip__brand,
.tcrn-entry-shell-strip__module {
  display: inline-flex;
  align-items: center;
  min-width: 0;
}
.tcrn-entry-shell-strip__brand {
  gap: 10px;
}
.tcrn-entry-shell-strip__brand .tcrn-brand-mark {
  flex: 0 0 auto;
  width: 36px;
  height: 36px;
  filter: drop-shadow(0 3px 6px rgba(49, 75, 112, 0.16));
}
.tcrn-entry-shell-strip__brand span {
  display: grid;
  gap: 2px;
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
  gap: 7px;
  color: var(--tcrn-color-text-secondary);
}
.tcrn-breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  min-width: 0;
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-caption);
  line-height: 1.35;
}
.tcrn-breadcrumb__item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}
.tcrn-breadcrumb__separator {
  width: 14px;
  height: 14px;
  color: var(--tcrn-color-text-muted);
}
.tcrn-breadcrumb [aria-current="page"] {
  color: var(--tcrn-color-text-primary);
  font-weight: 700;
}
.tcrn-product-launcher,
.tcrn-product-switcher,
.tcrn-module-tabs,
.tcrn-section-tabs,
.tcrn-segmented-nav,
.tcrn-filter-bar,
.tcrn-evidence-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-width: 0;
}
.tcrn-product-launcher button,
.tcrn-product-switcher button,
.tcrn-module-tabs button,
.tcrn-section-tabs button,
.tcrn-segmented-nav button {
  min-height: 34px;
  border: 1px solid color-mix(in srgb, var(--tcrn-color-border-subtle) 76%, transparent);
  border-radius: 8px;
  background: color-mix(in srgb, var(--tcrn-color-surface-panel) 92%, transparent);
  color: var(--tcrn-color-text-secondary);
  padding: 0 11px;
  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--tcrn-color-surface-panel) 72%, transparent);
}
.tcrn-product-launcher button[data-selected="true"],
.tcrn-product-switcher button[data-selected="true"],
.tcrn-module-tabs button[data-selected="true"],
.tcrn-section-tabs button[data-selected="true"],
.tcrn-segmented-nav button[data-selected="true"],
.tcrn-product-launcher button[aria-current="page"],
.tcrn-product-switcher button[aria-current="page"],
.tcrn-module-tabs button[aria-current="page"],
.tcrn-section-tabs button[aria-current="page"],
.tcrn-segmented-nav button[aria-current="page"] {
  border-color: color-mix(in srgb, var(--tcrn-color-brand-primary) 30%, var(--tcrn-color-border-subtle));
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--tcrn-color-brand-primary-bg) 82%, transparent), color-mix(in srgb, var(--tcrn-color-brand-secondary-bg) 44%, transparent)),
    var(--tcrn-color-surface-panel);
  color: var(--tcrn-color-text-primary);
  box-shadow:
    0 5px 14px color-mix(in srgb, var(--tcrn-color-brand-neutral) 10%, transparent),
    inset 0 0 0 1px color-mix(in srgb, var(--tcrn-color-surface-panel) 72%, transparent);
}
.tcrn-nav-component-preview {
  display: grid;
  gap: 12px;
  min-width: 0;
  border: 1px solid color-mix(in srgb, var(--tcrn-color-border-subtle) 78%, transparent);
  border-radius: var(--tcrn-radius-surface);
  background:
    linear-gradient(145deg, color-mix(in srgb, var(--tcrn-color-brand-primary-bg) 54%, transparent), transparent 42%),
    color-mix(in srgb, var(--tcrn-color-surface-muted) 48%, var(--tcrn-color-surface-panel));
  padding: 12px;
}
.tcrn-nav-component-preview .tcrn-product-switcher {
  width: max-content;
  max-width: 100%;
  border: 1px solid color-mix(in srgb, var(--tcrn-color-border-subtle) 78%, transparent);
  border-radius: var(--tcrn-radius-surface);
  background: color-mix(in srgb, var(--tcrn-color-surface-muted) 62%, var(--tcrn-color-surface-panel));
  padding: 4px;
}
.tcrn-package-nav-proof {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas:
    "skip"
    "sidenav"
    "tabs";
  column-gap: 12px;
  row-gap: 10px;
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
.tcrn-side-nav {
  display: grid;
  gap: 12px;
  min-width: 0;
  border: 1px solid color-mix(in srgb, var(--tcrn-color-border-subtle) 82%, transparent);
  border-radius: var(--tcrn-radius-surface);
  background:
    linear-gradient(160deg, color-mix(in srgb, var(--tcrn-color-brand-primary-bg) 42%, transparent) 0%, transparent 38%),
    linear-gradient(180deg, var(--tcrn-color-surface-panel) 0%, color-mix(in srgb, var(--tcrn-color-brand-secondary-bg) 36%, var(--tcrn-color-surface-panel)) 100%);
  padding: 10px;
}
.tcrn-nav-group {
  display: grid;
  gap: 6px;
  min-width: 0;
}
.tcrn-nav-group__label {
  padding: 0 8px;
  color: var(--tcrn-color-text-primary);
  font-size: var(--tcrn-type-size-caption);
  font-weight: 700;
}
.tcrn-nav-group__items {
  display: grid;
  gap: 4px;
  min-width: 0;
}
.tcrn-storybook-component-example .tcrn-nav-item {
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr);
  gap: 8px;
  align-items: center;
  min-height: 34px;
  min-width: 0;
  border: 1px solid transparent;
  border-radius: var(--tcrn-radius-control);
  color: var(--tcrn-color-text-secondary);
  padding: 7px 9px;
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
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--tcrn-color-brand-primary-bg) 84%, var(--tcrn-color-surface-panel)) 0%, color-mix(in srgb, var(--tcrn-color-brand-secondary-bg) 34%, var(--tcrn-color-surface-panel)) 100%);
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
  gap: 2px;
  min-width: 0;
}
.tcrn-storybook-component-example .tcrn-nav-item__label,
.tcrn-storybook-component-example .tcrn-nav-item__disabled-reason {
  min-width: 0;
  overflow-wrap: anywhere;
}
.tcrn-storybook-component-example .tcrn-nav-item__disabled-reason {
  color: var(--tcrn-color-text-muted);
  font-size: 12px;
  line-height: 1.25;
}
.tcrn-storybook-component-example .tcrn-nav-item .tcrn-icon {
  width: 16px;
  height: 16px;
  color: var(--tcrn-color-brand-primary);
}
.tcrn-skip-link {
  position: absolute;
  transform: translateY(-140%);
  border: 1px solid var(--tcrn-color-focus-ring);
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-color-surface-panel);
  color: var(--tcrn-color-text-primary);
  padding: 6px 10px;
  text-decoration: none;
}
.tcrn-skip-link:focus {
  position: static;
  transform: none;
  outline: 2px solid var(--tcrn-color-focus-ring);
  outline-offset: 2px;
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
  gap: 14px;
  min-width: 0;
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--tcrn-color-brand-primary-bg) 70%, transparent) 0%, transparent 34%),
    linear-gradient(225deg, color-mix(in srgb, var(--tcrn-color-brand-secondary-bg) 72%, transparent) 0%, transparent 34%),
    linear-gradient(180deg, color-mix(in srgb, var(--tcrn-color-surface-panel) 96%, var(--tcrn-color-brand-primary-bg)) 0%, color-mix(in srgb, var(--tcrn-color-surface-muted) 45%, var(--tcrn-color-surface-panel)) 100%),
    var(--tcrn-color-surface-panel);
  padding: 14px;
  box-shadow: 0 14px 36px color-mix(in srgb, var(--tcrn-color-brand-neutral) 12%, transparent);
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
  background:
    linear-gradient(145deg, color-mix(in srgb, var(--tcrn-color-brand-primary-bg) 62%, transparent) 0%, transparent 40%),
    linear-gradient(220deg, color-mix(in srgb, var(--tcrn-color-brand-secondary-bg) 62%, transparent) 0%, transparent 34%),
    color-mix(in srgb, var(--tcrn-color-surface-muted) 54%, var(--tcrn-color-surface-panel));
  overflow: hidden;
}
.tcrn-compact-shell .tcrn-top-bar {
  display: grid;
  grid-template-columns: 46px minmax(0, 1fr) auto;
  min-height: 72px;
  border: 0;
  border-bottom: 1px solid color-mix(in srgb, var(--tcrn-color-border-subtle) 80%, transparent);
  border-radius: 0;
  background:
    linear-gradient(105deg, color-mix(in srgb, var(--tcrn-color-surface-panel) 96%, transparent) 0%, color-mix(in srgb, var(--tcrn-color-brand-secondary-bg) 56%, var(--tcrn-color-surface-panel)) 100%);
  padding: 0 16px;
}
.tcrn-compact-shell__brand {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  min-width: 0;
}
.tcrn-compact-shell__brand .tcrn-brand-mark {
  width: 38px;
  height: 38px;
  filter: drop-shadow(0 3px 6px rgba(49, 75, 112, 0.16));
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
  gap: 12px;
  min-width: 0;
  padding: 14px;
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
  gap: 10px;
  min-width: 0;
  padding: 12px;
}
.tcrn-compact-shell__summary {
  background:
    linear-gradient(160deg, color-mix(in srgb, var(--tcrn-color-brand-primary-bg) 72%, transparent), transparent 58%),
    color-mix(in srgb, var(--tcrn-color-surface-panel) 84%, transparent);
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
  gap: 4px;
  border: 1px solid color-mix(in srgb, var(--tcrn-color-border-subtle) 78%, transparent);
  border-radius: var(--tcrn-radius-surface);
  background: color-mix(in srgb, var(--tcrn-color-surface-muted) 62%, var(--tcrn-color-surface-panel));
  padding: 4px;
  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--tcrn-color-surface-panel) 74%, transparent);
}
.tcrn-compact-shell__switcher .tcrn-module-tabs button {
  min-height: 34px;
  border-color: transparent;
  border-radius: 8px;
  background: transparent;
  padding: 0 12px;
  box-shadow: none;
}
.tcrn-compact-shell__switcher .tcrn-module-tabs button[data-selected="true"],
.tcrn-compact-shell__switcher .tcrn-module-tabs button[aria-current="page"] {
  border-color: color-mix(in srgb, var(--tcrn-color-brand-primary) 24%, transparent);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--tcrn-color-brand-primary-bg) 82%, transparent), color-mix(in srgb, var(--tcrn-color-brand-secondary-bg) 44%, transparent)),
    var(--tcrn-color-surface-panel);
  box-shadow:
    0 5px 14px color-mix(in srgb, var(--tcrn-color-brand-neutral) 10%, transparent),
    inset 0 0 0 1px color-mix(in srgb, var(--tcrn-color-surface-panel) 70%, transparent);
}
.tcrn-compact-shell__panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 10px;
  min-width: 0;
}
.tcrn-compact-shell__metric {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  min-width: 0;
  padding: 10px;
}
.tcrn-compact-shell__metric .tcrn-icon {
  flex: 0 0 auto;
  color: var(--tcrn-color-brand-primary);
  margin-top: 1px;
}
.tcrn-compact-shell__metric span {
  display: grid;
  gap: 2px;
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
  gap: 12px;
  min-width: 0;
  border: 1px solid color-mix(in srgb, var(--tcrn-color-border-subtle) 84%, transparent);
  border-radius: var(--tcrn-radius-surface);
  background: color-mix(in srgb, var(--tcrn-color-surface-panel) 82%, transparent);
  padding: 10px;
}
.tcrn-shell-demo__topbar--dense {
  position: relative;
  z-index: 3;
  grid-template-columns: 44px minmax(220px, 1fr) minmax(180px, 280px) auto;
  min-height: 72px;
  border: 0;
  border-bottom: 1px solid color-mix(in srgb, var(--tcrn-color-border-subtle) 82%, transparent);
  border-radius: calc(var(--tcrn-radius-surface) - 1px) calc(var(--tcrn-radius-surface) - 1px) 0 0;
  background:
    linear-gradient(110deg, color-mix(in srgb, var(--tcrn-color-surface-panel) 94%, transparent) 0%, color-mix(in srgb, var(--tcrn-color-brand-secondary-bg) 60%, var(--tcrn-color-surface-panel)) 100%);
  padding: 0 16px;
}
.tcrn-shell-demo__topbar--docs {
  grid-template-columns: minmax(220px, 1fr) minmax(180px, 260px) auto;
}
.tcrn-shell-demo__brand {
  display: grid;
  gap: 2px;
  min-width: 0;
}
.tcrn-shell-demo__brand span,
.tcrn-shell-brand-lockup__caption {
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-caption);
  line-height: 1.35;
}
.tcrn-shell-brand-lockup {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.tcrn-shell-brand-lockup .tcrn-brand-mark {
  width: 52px;
  flex: 0 0 auto;
}
.tcrn-shell-brand-lockup__copy {
  display: grid;
  gap: 2px;
  min-width: 0;
}
.tcrn-shell-brand-lockup .tcrn-brand-wordmark {
  font-size: 18px;
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
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--tcrn-color-brand-primary-bg) 72%, var(--tcrn-color-surface-panel)), var(--tcrn-color-surface-panel));
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
  gap: 16px;
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
  gap: 12px;
  min-width: 0;
  border: 1px solid color-mix(in srgb, var(--tcrn-color-border-subtle) 82%, transparent);
  border-radius: var(--tcrn-radius-surface);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--tcrn-color-brand-secondary-bg) 70%, transparent) 0%, transparent 42%),
    linear-gradient(215deg, color-mix(in srgb, var(--tcrn-color-brand-primary-bg) 70%, transparent) 0%, transparent 38%),
    color-mix(in srgb, var(--tcrn-color-surface-muted) 78%, var(--tcrn-color-surface-panel));
  padding: 12px;
  box-shadow:
    0 24px 54px color-mix(in srgb, var(--tcrn-color-brand-neutral) 22%, transparent),
    0 0 0 1px color-mix(in srgb, var(--tcrn-color-surface-panel) 68%, transparent);
}
.tcrn-shell-hub-menu {
  display: grid;
  grid-template-columns: minmax(230px, 0.32fr) minmax(430px, 1fr) minmax(210px, 0.3fr);
  gap: 12px;
  min-width: 0;
  border: 1px solid color-mix(in srgb, var(--tcrn-color-border-subtle) 82%, transparent);
  border-radius: var(--tcrn-radius-surface);
  background:
    radial-gradient(circle at 18% 14%, color-mix(in srgb, var(--tcrn-color-brand-secondary-bg) 80%, transparent), transparent 34%),
    linear-gradient(135deg, color-mix(in srgb, var(--tcrn-color-surface-panel) 92%, transparent), color-mix(in srgb, var(--tcrn-color-brand-primary-bg) 26%, var(--tcrn-color-surface-panel))),
    var(--tcrn-color-surface-panel);
  padding: 12px;
  box-shadow:
    0 22px 50px color-mix(in srgb, var(--tcrn-color-brand-neutral) 18%, transparent),
    0 0 0 1px color-mix(in srgb, var(--tcrn-color-surface-panel) 70%, transparent);
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
  gap: 8px;
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
  padding: 10px;
}
.tcrn-shell-domain-nav {
  align-content: start;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--tcrn-color-brand-primary-bg) 48%, transparent), transparent 42%),
    color-mix(in srgb, var(--tcrn-color-surface-panel) 76%, transparent);
}
.tcrn-shell-hub-summary {
  align-content: start;
  gap: 8px;
  background:
    linear-gradient(160deg, color-mix(in srgb, var(--tcrn-color-brand-primary-bg) 72%, transparent), transparent 56%),
    color-mix(in srgb, var(--tcrn-color-surface-panel) 84%, transparent);
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
  gap: 10px;
}
.tcrn-shell-hub-action {
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: start;
  gap: 9px;
  min-height: 88px;
  padding: 12px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--tcrn-color-surface-panel) 92%, transparent), color-mix(in srgb, var(--tcrn-color-brand-secondary-bg) 22%, var(--tcrn-color-surface-panel)));
}
.tcrn-shell-hub-action .tcrn-icon {
  color: var(--tcrn-color-brand-primary);
  margin-top: 2px;
}
.tcrn-shell-hub-action span {
  display: grid;
  gap: 4px;
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
  padding: 3px 7px;
  white-space: nowrap;
}
.tcrn-shell-hub-action[data-selected="true"] {
  border-color: color-mix(in srgb, var(--tcrn-color-brand-primary) 34%, var(--tcrn-color-border-subtle));
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--tcrn-color-brand-primary-bg) 82%, transparent), color-mix(in srgb, var(--tcrn-color-brand-secondary-bg) 46%, transparent)),
    var(--tcrn-color-surface-panel);
}
.tcrn-shell-hub-sidecar {
  align-content: start;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--tcrn-color-brand-secondary-bg) 62%, transparent), transparent 50%),
    color-mix(in srgb, var(--tcrn-color-surface-panel) 82%, transparent);
}
.tcrn-shell-hub-sidecar ul {
  display: grid;
  gap: 8px;
  margin: 0;
  padding-left: 18px;
}
.tcrn-shell-domain-group {
  gap: 6px;
}
.tcrn-shell-domain-group > strong,
.tcrn-shell-hub-sidecar > strong,
.tcrn-shell-quick-rail > strong,
.tcrn-shell-task-lane__title strong {
  font-size: var(--tcrn-type-size-caption);
  line-height: 1.35;
}
.tcrn-shell-domain-list {
  gap: 6px;
}
.tcrn-shell-domain-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  text-align: left;
  padding: 9px 10px;
}
.tcrn-shell-domain-item .tcrn-icon {
  flex: 0 0 auto;
  color: var(--tcrn-color-brand-primary);
  margin-top: 1px;
}
.tcrn-shell-domain-item span {
  display: grid;
  gap: 2px;
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
  gap: 10px;
}
.tcrn-shell-command-board__header {
  display: grid;
  gap: 3px;
  border-bottom: 1px solid color-mix(in srgb, var(--tcrn-color-border-subtle) 72%, transparent);
  padding: 2px 2px 10px;
}
.tcrn-shell-command-board__header > span {
  color: var(--tcrn-color-brand-primary);
  font-size: var(--tcrn-type-size-caption);
  font-weight: 700;
}
.tcrn-shell-task-lanes {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}
.tcrn-shell-task-lane {
  align-content: start;
  gap: 7px;
  border: 1px solid color-mix(in srgb, var(--tcrn-color-border-subtle) 78%, transparent);
  border-radius: var(--tcrn-radius-control);
  background: color-mix(in srgb, var(--tcrn-color-surface-panel) 72%, transparent);
  padding: 10px;
}
.tcrn-shell-task-lane__title {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  color: var(--tcrn-color-text-primary);
}
.tcrn-shell-task-lane__title .tcrn-icon {
  color: var(--tcrn-color-brand-secondary);
}
.tcrn-shell-task-lane a,
.tcrn-shell-quick-list a {
  display: grid;
  gap: 2px;
  min-height: 32px;
  padding: 7px 9px;
}
.tcrn-shell-domain-item[data-selected="true"],
.tcrn-shell-task-lane a[data-selected="true"],
.tcrn-bookmark-nav__group > a[data-selected="true"],
.tcrn-bookmark-nav__children a[data-selected="true"] {
  border-color: color-mix(in srgb, var(--tcrn-color-brand-primary) 32%, var(--tcrn-color-border-subtle));
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--tcrn-color-brand-primary-bg) 80%, transparent), color-mix(in srgb, var(--tcrn-color-brand-secondary-bg) 48%, transparent)),
    var(--tcrn-color-surface-panel);
  color: var(--tcrn-color-text-primary);
  font-weight: 700;
}
.tcrn-shell-quick-rail {
  align-content: start;
  gap: 8px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--tcrn-color-brand-secondary-bg) 52%, transparent), transparent 44%),
    color-mix(in srgb, var(--tcrn-color-surface-panel) 78%, transparent);
}
.tcrn-bookmark-nav a {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
}
.tcrn-shell-demo--knowledge {
  padding: 0;
  overflow: hidden;
}
.tcrn-knowledge-shell-layout {
  --tcrn-knowledge-shell-divider: color-mix(in srgb, var(--tcrn-color-border-subtle) 74%, transparent);
  --tcrn-knowledge-shell-content-gutter: 18px;
  --tcrn-knowledge-shell-left-surface:
    linear-gradient(155deg, color-mix(in srgb, var(--tcrn-color-brand-primary-bg) 88%, transparent) 0%, transparent 38%),
    linear-gradient(22deg, color-mix(in srgb, var(--tcrn-color-brand-secondary-bg) 76%, transparent) 0%, transparent 34%),
    linear-gradient(180deg, color-mix(in srgb, var(--tcrn-color-surface-panel) 64%, var(--tcrn-color-brand-primary-bg)) 0%, color-mix(in srgb, var(--tcrn-color-surface-muted) 72%, var(--tcrn-color-brand-secondary-bg)) 100%);
  --tcrn-knowledge-shell-top-surface:
    linear-gradient(112deg, color-mix(in srgb, var(--tcrn-color-brand-primary-bg) 50%, transparent) 0%, transparent 34%),
    linear-gradient(100deg, var(--tcrn-color-surface-panel) 0%, color-mix(in srgb, var(--tcrn-color-brand-secondary-bg) 64%, var(--tcrn-color-surface-panel)) 100%);
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
.tcrn-knowledge-shell__brand-cell {
  grid-column: 1;
  grid-row: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 32px;
  gap: 10px;
  align-items: center;
  align-self: stretch;
  background: var(--tcrn-knowledge-shell-left-surface);
  padding: 10px 14px;
}
.tcrn-knowledge-shell__brand {
  min-width: 0;
  border-right: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  padding: 0;
}
.tcrn-knowledge-shell__collapse-button {
  align-self: center;
  justify-self: end;
}
.tcrn-knowledge-shell__brand .tcrn-shell-brand-lockup {
  width: 100%;
}
.tcrn-knowledge-shell__brand .tcrn-brand-wordmark {
  align-items: flex-start;
  flex-direction: column;
  gap: 2px;
  font-size: 16px;
  line-height: 1.05;
}
.tcrn-knowledge-shell__brand .tcrn-brand-wordmark__suffix {
  flex-basis: auto;
  line-height: 1.06;
}
.tcrn-knowledge-shell__brand .tcrn-shell-brand-lockup__caption {
  white-space: nowrap;
}
.tcrn-knowledge-shell__topbar-copy,
.tcrn-knowledge-shell__actions,
.tcrn-knowledge-shell__sidebar-intro,
.tcrn-knowledge-shell__content,
.tcrn-knowledge-preview__panel,
.tcrn-knowledge-shell__pager {
  display: grid;
  gap: 8px;
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
  padding: 10px 14px;
}
.tcrn-knowledge-shell__topbar-copy {
  grid-column: 2;
  grid-row: 1;
  align-self: stretch;
  align-content: center;
  background: transparent;
  padding: 10px clamp(210px, 22vw, 300px) 10px var(--tcrn-knowledge-shell-content-gutter);
}
.tcrn-knowledge-shell__actions .tcrn-search-input {
  max-width: none;
}
.tcrn-bookmark-panel {
  display: grid;
  gap: 10px;
  min-width: 0;
  border: 0;
  border-radius: 0;
  background: var(--tcrn-knowledge-shell-left-surface);
  padding: 12px;
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
  gap: 4px;
}
.tcrn-bookmark-nav--tracked a {
  overflow: hidden;
  border-color: transparent;
  background: transparent;
  padding-left: 32px;
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
  border-radius: 999px;
  background: linear-gradient(180deg, var(--tcrn-color-brand-primary), var(--tcrn-color-brand-secondary));
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--tcrn-color-brand-primary-bg) 78%, transparent);
  transform: translateY(-50%);
}
.tcrn-bookmark-nav__children {
  display: grid;
  gap: 4px;
  padding-left: 12px;
}
.tcrn-bookmark-nav__children a {
  min-height: 30px;
  color: var(--tcrn-color-text-secondary);
}
.tcrn-knowledge-shell__content {
  grid-area: content;
  align-content: start;
  padding: 18px 18px 18px var(--tcrn-knowledge-shell-content-gutter);
}
.tcrn-knowledge-preview {
  align-content: start;
  border: 1px solid color-mix(in srgb, var(--tcrn-color-border-subtle) 84%, transparent);
  border-radius: var(--tcrn-radius-surface);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--tcrn-color-brand-primary-bg) 58%, transparent) 0%, transparent 38%),
    var(--tcrn-color-surface-panel);
  padding: 14px;
}
.tcrn-knowledge-preview__panel {
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-control);
  background: color-mix(in srgb, var(--tcrn-color-surface-panel) 90%, transparent);
  padding: 12px;
}
.tcrn-knowledge-shell__pager {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: auto;
}
.tcrn-knowledge-shell__pager a {
  display: grid;
  gap: 4px;
  min-width: 0;
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-control);
  background: color-mix(in srgb, var(--tcrn-color-surface-panel) 92%, transparent);
  color: var(--tcrn-color-text-primary);
  padding: 12px;
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
.tcrn-table-shell {
  display: grid;
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  overflow-x: auto;
  min-width: 0;
  max-width: 100%;
}
.tcrn-table-shell__head,
.tcrn-table-shell__row {
  display: grid;
  grid-template-columns: repeat(var(--tcrn-table-column-count, 3), minmax(140px, 1fr));
  gap: 8px;
  min-width: max(100%, calc(var(--tcrn-table-column-count, 3) * 140px));
  padding: 10px;
  border-bottom: 1px solid var(--tcrn-color-border-subtle);
}
.tcrn-table-shell__empty {
  padding: 14px;
  color: var(--tcrn-color-text-secondary);
}
.alpha-overlay-demo {
  display: grid;
  gap: 12px;
}
.tcrn-overlay-mode-matrix,
.tcrn-overlay-static-modes {
  display: grid;
  gap: 12px;
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  background: var(--tcrn-color-surface-panel);
  padding: 12px;
}
.tcrn-overlay-mode-matrix__intro {
  display: grid;
  gap: 6px;
}
.tcrn-overlay-mode-grid,
.tcrn-overlay-drawer-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}
.tcrn-overlay-mode-card,
.tcrn-overlay-static-card {
  display: grid;
  gap: 10px;
  min-width: 0;
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  background: var(--tcrn-color-surface-muted);
  padding: 12px;
}
html[data-tcrn-theme="dark"] .tcrn-overlay-mode-card,
html[data-tcrn-theme="dark"] .tcrn-overlay-static-card {
  border-color: color-mix(in srgb, var(--tcrn-color-border-strong) 62%, transparent);
  background: color-mix(in srgb, var(--tcrn-color-surface-muted) 74%, var(--tcrn-color-surface-panel));
}
.tcrn-overlay-mode-card {
  grid-template-columns: auto minmax(0, 1fr);
  align-items: start;
}
.tcrn-overlay-mode-card > div {
  display: grid;
  gap: 6px;
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
  gap: 12px;
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  background: var(--tcrn-color-surface-muted);
  padding: 12px;
}
html[data-tcrn-theme="dark"] .tcrn-dialog-spec-fixture {
  border-color: color-mix(in srgb, var(--tcrn-color-border-strong) 58%, transparent);
  background:
    linear-gradient(145deg, color-mix(in srgb, var(--tcrn-color-surface-muted) 82%, var(--tcrn-color-brand-primary-bg)), color-mix(in srgb, var(--tcrn-color-surface-muted) 78%, var(--tcrn-color-brand-secondary-bg))),
    var(--tcrn-color-surface-muted);
}
.tcrn-dialog-spec-fixture__header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  align-items: start;
}
.tcrn-dialog-spec-fixture__summary,
.tcrn-dialog-spec-fixture__dialog {
  min-width: 0;
}
.tcrn-dialog-spec-fixture__summary {
  display: grid;
  gap: 6px;
}
.tcrn-dialog-spec-fixture__actions,
.tcrn-dialog-spec-fixture__dialog-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.tcrn-dialog-spec-fixture__dialog {
  border-color: rgba(73, 91, 219, 0.26);
  box-shadow: 0 16px 36px rgba(30, 43, 70, 0.12);
}
.tcrn-dialog-spec-fixture [data-dialog-fixture-panel],
.tcrn-dialog-spec-fixture [data-popover-fixture-panel] {
  display: grid;
  gap: 10px;
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
.tcrn-dialog,
.tcrn-popover,
.alpha-overlay-demo__dialog {
  display: grid;
  gap: 10px;
}
.tcrn-popover {
  z-index: var(--tcrn-z-popover);
  max-width: 420px;
  border-color: rgba(38, 156, 174, 0.24);
  box-shadow: 0 14px 34px rgba(18, 42, 66, 0.14);
}
@media (max-width: 760px) {
  html {
    --tcrn-anchor-scroll-offset: 16px;
  }
  .alpha-frame {
    padding: 16px;
  }
  .tcrn-doc-page-head {
    grid-template-columns: 1fr;
  }
  .tcrn-doc-on-this-page {
    border-left: 0;
    border-top: 1px solid var(--tcrn-color-border-subtle);
    padding: 12px 0 0;
  }
  .tcrn-doc-content {
    padding: 16px;
  }
  .tcrn-storybook-product-shell .tcrn-product-shell__sidebar {
    padding: 16px;
    gap: 18px;
  }
  .tcrn-storybook-product-shell .tcrn-product-shell__workspace > .tcrn-top-bar {
    min-height: 0;
    padding: 16px;
    border-bottom: 1px solid color-mix(in srgb, var(--tcrn-storybook-shell-card-border) 82%, transparent);
    background: var(--tcrn-storybook-shell-mobile-layer-surface);
    box-shadow: 0 10px 24px color-mix(in srgb, var(--tcrn-color-border-subtle) 38%, transparent);
  }
  .tcrn-storybook-product-shell .tcrn-product-shell__utility-row {
    flex-wrap: wrap;
    gap: 10px;
    background: var(--tcrn-storybook-shell-mobile-layer-surface);
  }
  .tcrn-storybook-product-shell .tcrn-product-shell__current-location {
    flex-basis: 100%;
    max-width: none;
    background: var(--tcrn-storybook-shell-mobile-layer-surface);
  }
  .tcrn-storybook-product-shell .tcrn-product-shell-search,
  .tcrn-storybook-product-shell .tcrn-product-shell-search[data-search-expanded="true"] {
    flex-basis: min(100%, 320px);
    width: 320px;
    max-width: 320px;
    background: var(--tcrn-storybook-shell-mobile-layer-surface);
    border-radius: var(--tcrn-radius-control);
  }
  .tcrn-storybook-product-shell .tcrn-search-input,
  .tcrn-storybook-product-shell .tcrn-shell-theme-toggle,
  .tcrn-storybook-product-shell .tcrn-button.tcrn-shell-theme-toggle,
  .tcrn-storybook-product-shell .tcrn-shell-locale-menu__trigger {
    background: var(--tcrn-storybook-shell-mobile-layer-surface);
  }
  .tcrn-storybook-product-shell .tcrn-doc-content {
    padding: 16px;
  }
  .tcrn-doc-chapter-pager {
    grid-template-columns: 1fr;
  }
  .tcrn-brand-system {
    grid-template-columns: 1fr;
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
  .tcrn-knowledge-shell__brand-cell,
  .tcrn-knowledge-shell__topbar-copy,
  .tcrn-knowledge-shell__actions {
    grid-column: auto;
    grid-row: auto;
  }
  .tcrn-knowledge-shell__brand-cell {
    padding: 10px 14px;
  }
  .tcrn-knowledge-shell__brand {
    padding: 0;
  }
  .tcrn-knowledge-shell__topbar-copy,
  .tcrn-knowledge-shell__actions {
    width: auto;
    padding: 10px 14px;
  }
  .tcrn-knowledge-shell__sidebar {
    border-right: 0;
    border-bottom: 1px solid var(--tcrn-color-border-subtle);
  }
  .tcrn-knowledge-shell__content {
    padding: 16px;
  }
  .tcrn-shell-demo--dense {
    gap: 12px;
    min-height: 0;
    padding: 12px;
  }
  .tcrn-shell-layer {
    position: static;
    padding: 12px;
  }
  .tcrn-shell-demo__topbar--dense {
    border: 1px solid color-mix(in srgb, var(--tcrn-color-border-subtle) 84%, transparent);
    border-radius: var(--tcrn-radius-surface);
    padding: 10px;
  }
  .tcrn-shell-demo__topbar .tcrn-search-input {
    max-width: none;
  }
  .tcrn-shell-task-lanes {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 520px) {
  .tcrn-storybook-component-example .tcrn-top-bar {
    align-items: flex-start;
    flex-direction: column;
  }
  .tcrn-table-shell {
    overflow-x: visible;
  }
  .tcrn-table-shell__head {
    display: none;
  }
  .tcrn-table-shell__row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
    min-width: 0;
    padding: 12px;
  }
  .tcrn-table-shell__cell {
    display: grid;
    grid-template-columns: minmax(84px, 0.4fr) minmax(0, 1fr);
    gap: 8px;
    min-width: 0;
  }
  .tcrn-table-shell__cell::before {
    content: attr(data-label);
    color: var(--tcrn-color-text-secondary);
    font-weight: 600;
  }
  .tcrn-key-value-list > div {
    grid-template-columns: 1fr;
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
  .tcrn-skeleton::after {
    animation: none;
    opacity: 0;
  }
  .tcrn-tooltip__content,
  .tcrn-collapsible-region,
  .tcrn-field {
    transition: none;
  }
  .tcrn-loading-spinner,
  .tcrn-loading-progress__bar {
    transform: none;
  }
  *, *::before, *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
@media (forced-colors: active) {
  .tcrn-field:focus-within,
  .tcrn-field--error {
    outline: 2px solid Highlight;
    outline-offset: 2px;
  }
}`;
