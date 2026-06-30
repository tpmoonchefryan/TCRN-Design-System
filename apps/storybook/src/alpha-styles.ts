import { createCssVariables, createThemeCssVariables } from "@tcrn/ui-tokens";

export const alphaStoryCss = `${createCssVariables()}${createThemeCssVariables("dark")}
* { box-sizing: border-box; }
html {
  --tcrn-anchor-scroll-offset: 96px;
  --tcrn-doc-motion-spring: 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --tcrn-doc-motion-smooth: 0.4s ease;
  --tcrn-doc-theme-crossfade-duration: 0.4s;
  --tcrn-doc-theme-crossfade-easing: ease;
  --tcrn-doc-header-search-resting-width: 180px;
  --tcrn-doc-header-search-expanded-width: 320px;
  scroll-padding-top: var(--tcrn-anchor-scroll-offset);
  color-scheme: light;
}
html[data-tcrn-theme="dark"] {
  color-scheme: dark;
}
@property --tcrn-doc-shell-side-width {
  syntax: "<length-percentage>";
  inherits: true;
  initial-value: 360px;
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
.tcrn-doc-shell[data-storybook-locale="en"],
.tcrn-doc-shell[data-storybook-locale="fr"] {
  --tcrn-type-family-ui: var(--tcrn-type-family-latin);
}
.tcrn-doc-shell[data-storybook-locale="zh-CN"] {
  --tcrn-type-family-ui: var(--tcrn-type-family-zh-cn);
}
.tcrn-doc-shell[data-storybook-locale="ja"] {
  --tcrn-type-family-ui: var(--tcrn-type-family-ja);
}
.tcrn-doc-shell[data-storybook-locale="ko"] {
  --tcrn-type-family-ui: var(--tcrn-type-family-ko);
}
h1, h2, h3, p {
  margin: 0;
}
.tcrn-doc-shell, .alpha-frame {
  display: grid;
  gap: var(--tcrn-space-4);
  width: 100%;
  min-width: 0;
}
.tcrn-doc-shell {
  --tcrn-doc-shell-side-width: clamp(280px, 20vw, 360px);
  --tcrn-doc-shell-side-expanded-width: clamp(280px, 20vw, 360px);
  --tcrn-doc-shell-side-collapsed-width: 78px;
  --tcrn-doc-shell-divider: color-mix(in srgb, var(--tcrn-color-border-subtle) 74%, transparent);
  --tcrn-doc-shell-left-surface:
    linear-gradient(155deg, color-mix(in srgb, var(--tcrn-color-brand-primary-bg) 88%, transparent) 0%, transparent 38%),
    linear-gradient(22deg, color-mix(in srgb, var(--tcrn-color-brand-secondary-bg) 76%, transparent) 0%, transparent 34%),
    linear-gradient(180deg, color-mix(in srgb, var(--tcrn-color-surface-panel) 64%, var(--tcrn-color-brand-primary-bg)) 0%, color-mix(in srgb, var(--tcrn-color-surface-muted) 72%, var(--tcrn-color-brand-secondary-bg)) 100%);
  --tcrn-doc-shell-top-surface:
    radial-gradient(circle at 8% 0%, color-mix(in srgb, var(--tcrn-color-brand-primary-bg) 70%, transparent) 0%, transparent 30%),
    radial-gradient(circle at 92% 18%, color-mix(in srgb, var(--tcrn-color-brand-secondary-bg) 58%, transparent) 0%, transparent 34%),
    linear-gradient(135deg, var(--tcrn-color-surface-panel) 0%, color-mix(in srgb, var(--tcrn-color-surface-muted) 58%, var(--tcrn-color-surface-panel)) 100%);
  min-height: 100vh;
  max-width: none;
  margin: 0;
  gap: 0;
  padding: var(--tcrn-anchor-scroll-offset) 0 0;
  transition:
    --tcrn-doc-shell-side-width var(--tcrn-motion-emphasis),
    background-color var(--tcrn-doc-motion-smooth),
    color var(--tcrn-doc-motion-smooth);
}
.tcrn-doc-shell[data-sidebar-collapsed="true"] {
  --tcrn-doc-shell-side-width: var(--tcrn-doc-shell-side-collapsed-width);
}
html[data-tcrn-theme="dark"] .tcrn-doc-shell {
  --tcrn-doc-shell-left-surface: var(--tcrn-color-surface-panel);
  --tcrn-doc-shell-top-surface: var(--tcrn-color-surface-panel);
}
@keyframes tcrn-doc-sidebar-copy-reveal {
  0%,
  44% {
    opacity: 0;
    transform: translateX(-8px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes tcrn-doc-nav-label-reveal {
  0% {
    opacity: 0;
    transform: translateX(-10px) scale(0.78);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}
@keyframes tcrn-doc-nav-abbr-release {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.76);
  }
}
@keyframes tcrn-doc-nav-stories-fold {
  0% {
    max-height: 420px;
    opacity: 1;
    transform: translateY(0) scaleY(1);
    visibility: visible;
  }
  100% {
    max-height: 0;
    opacity: 0;
    transform: translateY(-8px) scaleY(0.22);
    visibility: visible;
  }
}
@keyframes tcrn-doc-nav-stories-unfold {
  0% {
    max-height: 0;
    opacity: 0;
    transform: translateY(-8px) scaleY(0.22);
    visibility: visible;
  }
  100% {
    max-height: 420px;
    opacity: 1;
    transform: translateY(0) scaleY(1);
    visibility: visible;
  }
}
.alpha-frame {
  max-width: var(--tcrn-container-readable);
  margin: 0 auto;
  padding: 20px;
}
.tcrn-doc-skip {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 20;
  transform: translateY(-160%);
  border: 1px solid var(--tcrn-color-border-strong);
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-color-surface-panel);
  color: var(--tcrn-color-text-primary);
  padding: 8px 10px;
}
.tcrn-doc-skip:focus-visible {
  transform: translateY(0);
}
.tcrn-doc-header {
  position: fixed;
  inset-block-start: 0;
  inset-inline: 0;
  z-index: 15;
  display: grid;
  gap: 0;
  width: 100%;
  min-height: var(--tcrn-anchor-scroll-offset);
  background: var(--tcrn-doc-shell-top-surface);
  padding: 0;
  box-shadow: none;
  transition:
    background var(--tcrn-doc-motion-smooth),
    background-color var(--tcrn-doc-motion-smooth),
    color var(--tcrn-doc-motion-smooth);
}
.tcrn-doc-global-bar {
  display: grid;
  grid-template-columns: var(--tcrn-doc-shell-side-width) minmax(320px, 1fr) auto;
  align-items: center;
  gap: 0;
  min-width: 0;
  min-height: var(--tcrn-anchor-scroll-offset);
  transition: grid-template-columns var(--tcrn-motion-emphasis);
}
.tcrn-doc-header__copy {
  display: grid;
  gap: 8px;
  max-width: 820px;
  min-width: 0;
  padding: 4px 8px 6px;
}
.tcrn-doc-header__spacer {
  align-self: stretch;
  min-width: 0;
  background: transparent;
}
.tcrn-doc-header__workspace {
  align-self: stretch;
  display: grid;
  grid-template-columns: minmax(180px, 1fr) var(--tcrn-doc-header-search-resting-width);
  align-items: center;
  gap: clamp(14px, 1.6vw, 24px);
  min-width: 0;
  padding: 12px clamp(8px, 1vw, 14px) 12px clamp(28px, 2.8vw, 48px);
  border-left: 0;
  transition: grid-template-columns var(--tcrn-doc-motion-spring);
}
.tcrn-doc-header__workspace:focus-within,
.tcrn-doc-header__workspace[data-search-expanded="true"] {
  grid-template-columns: minmax(180px, 1fr) var(--tcrn-doc-header-search-expanded-width);
}
.tcrn-doc-current-location {
  display: grid;
  gap: 5px;
  min-width: 0;
}
.tcrn-doc-current-location__label {
  color: var(--tcrn-color-brand-primary);
  font-size: 11px;
  font-weight: 800;
  line-height: 1;
}
.tcrn-doc-current-location__path {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.tcrn-doc-current-location__group,
.tcrn-doc-current-location__story {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tcrn-doc-current-location__group {
  flex: 0 1 auto;
  color: var(--tcrn-color-text-primary);
  font-size: 18px;
  font-weight: 800;
  line-height: 1.15;
}
.tcrn-doc-current-location__separator {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  color: var(--tcrn-color-text-tertiary);
}
.tcrn-doc-current-location__separator-icon {
  width: 14px;
  height: 14px;
}
.tcrn-doc-current-location__story {
  flex: 1 1 auto;
  color: var(--tcrn-color-text-secondary);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
}
.tcrn-doc-header-search {
  position: relative;
  justify-self: end;
  width: 100%;
  min-width: 0;
}
.tcrn-doc-header-search .tcrn-search-input__control {
  min-height: 36px;
  background: color-mix(in srgb, var(--tcrn-color-surface-panel) 88%, transparent);
  transition:
    background-color var(--tcrn-doc-motion-smooth),
    border-color var(--tcrn-doc-motion-smooth),
    box-shadow var(--tcrn-doc-motion-smooth),
    color var(--tcrn-doc-motion-smooth),
    padding var(--tcrn-doc-motion-spring);
}
.tcrn-doc-page-head {
  display: grid;
  gap: 8px;
  min-width: 0;
  padding: 2px 2px 8px;
}
.tcrn-doc-page-head h1 {
  font-size: var(--tcrn-type-size-page);
  line-height: var(--tcrn-type-line-page);
}
.tcrn-doc-eyebrow {
  color: var(--tcrn-color-focus-ring);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0;
}
.tcrn-doc-header-controls {
  position: relative;
  align-self: center;
  justify-self: end;
  display: flex;
  min-width: 0;
  width: max-content;
  max-width: none;
  background: transparent;
  color: var(--tcrn-color-text-primary);
  padding: 0 clamp(18px, 1.8vw, 28px) 0 0;
}
.tcrn-doc-header-controls__row {
  display: inline-flex;
  gap: 10px;
  align-items: center;
  height: 36px;
  min-width: 0;
}
.tcrn-doc-theme-control-slot,
.tcrn-doc-locale-control-slot {
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 36px;
  flex: 0 0 auto;
}
[data-tcrn-theme="dark"] .tcrn-doc-locale-control-slot select,
[data-tcrn-theme="dark"] .tcrn-doc-header-search input {
  color-scheme: dark;
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
.tcrn-doc-layout {
  display: grid;
  grid-template-columns: var(--tcrn-doc-shell-side-width) minmax(0, 1fr);
  gap: 0;
  align-items: stretch;
  min-width: 0;
  width: 100%;
  min-height: calc(100vh - var(--tcrn-anchor-scroll-offset));
  padding: 0;
  transition: grid-template-columns var(--tcrn-motion-emphasis);
}
.tcrn-doc-sidebar {
  position: sticky;
  top: var(--tcrn-anchor-scroll-offset);
  display: grid;
  align-content: start;
  gap: 0;
  height: calc(100vh - var(--tcrn-anchor-scroll-offset));
  max-height: calc(100vh - var(--tcrn-anchor-scroll-offset));
  overflow: auto;
  border-right: 0;
  background: var(--tcrn-doc-shell-left-surface);
  background-attachment: fixed;
  box-shadow: none;
  padding: 16px clamp(16px, 1.6vw, 24px) 18px clamp(18px, 2vw, 30px);
  transition:
    padding var(--tcrn-motion-emphasis),
    background-color var(--tcrn-motion-standard);
}
.tcrn-doc-brand {
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  min-width: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: var(--tcrn-color-text-primary);
  padding: 4px 0;
  text-decoration: none;
  transition:
    grid-template-columns var(--tcrn-motion-emphasis),
    gap var(--tcrn-motion-emphasis),
    left var(--tcrn-motion-emphasis),
    top var(--tcrn-motion-emphasis),
    transform var(--tcrn-motion-emphasis),
    width var(--tcrn-motion-emphasis);
}
.tcrn-doc-global-brand {
  align-self: stretch;
  position: relative;
  display: block;
  min-height: var(--tcrn-anchor-scroll-offset);
  border-right: 0;
  border-radius: 0;
  background: var(--tcrn-doc-shell-left-surface);
  background-attachment: fixed;
  box-shadow: none;
  padding: 0;
  overflow: hidden;
  transition: background-color var(--tcrn-motion-standard);
}
.tcrn-doc-global-brand .tcrn-doc-brand {
  position: absolute;
  top: calc((var(--tcrn-anchor-scroll-offset) - 52px) / 2);
  left: clamp(18px, 2vw, 30px);
  width: calc(var(--tcrn-doc-shell-side-expanded-width) - clamp(18px, 2vw, 30px) - 68px);
  padding: 0;
  transform: none;
}
.tcrn-knowledge-shell__collapse-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  justify-self: end;
  width: 32px;
  height: 32px;
  border: 1px solid color-mix(in srgb, var(--tcrn-color-border-strong) 76%, transparent);
  border-radius: var(--tcrn-radius-control);
  background: color-mix(in srgb, var(--tcrn-color-surface-panel) 78%, transparent);
  color: var(--tcrn-color-brand-primary);
  cursor: pointer;
  padding: 0;
  transition:
    left var(--tcrn-motion-emphasis),
    top var(--tcrn-motion-emphasis),
    background-color var(--tcrn-motion-standard),
    border-color var(--tcrn-motion-standard),
    color var(--tcrn-motion-standard),
    transform var(--tcrn-motion-emphasis);
}
.tcrn-doc-sidebar-toggle-slot {
  position: absolute;
  top: calc((var(--tcrn-anchor-scroll-offset) - 32px) / 2);
  left: calc(var(--tcrn-doc-shell-side-expanded-width) - clamp(16px, 1.6vw, 24px) - 34px);
  transform: none;
}
.tcrn-knowledge-shell__collapse-button:hover {
  border-color: var(--tcrn-color-focus-ring);
  background: var(--tcrn-color-surface-panel);
}
.tcrn-knowledge-shell__collapse-button .tcrn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  transition: transform var(--tcrn-motion-emphasis);
}
.tcrn-doc-shell[data-sidebar-collapsed="true"] .tcrn-doc-global-brand {
  padding: 0;
}
.tcrn-doc-shell[data-sidebar-collapsed="true"] .tcrn-doc-global-brand .tcrn-doc-brand {
  top: 14px;
  left: calc((var(--tcrn-doc-shell-side-collapsed-width) - 40px) / 2);
  width: 40px;
  transform: none;
}
.tcrn-doc-shell[data-sidebar-collapsed="true"] .tcrn-doc-brand {
  grid-template-columns: 40px minmax(0, 0fr);
  gap: 0;
}
.tcrn-doc-shell[data-sidebar-collapsed="true"] .tcrn-doc-brand .tcrn-brand-mark {
  width: 40px;
  height: 40px;
}
.tcrn-doc-shell[data-sidebar-collapsed="true"] .tcrn-doc-brand .tcrn-shell-brand-lockup__copy {
  max-width: 0;
  opacity: 0;
  pointer-events: none;
  transform: translateX(-8px);
  visibility: hidden;
}
.tcrn-doc-shell[data-sidebar-collapsed="true"] .tcrn-doc-sidebar-toggle-slot {
  top: 60px;
  left: calc((var(--tcrn-doc-shell-side-collapsed-width) - 32px) / 2);
  transform: none;
}
.tcrn-doc-brand .tcrn-brand-mark {
  display: block;
  width: 52px;
  height: 52px;
  background: transparent;
  filter: drop-shadow(0 3px 6px rgba(49, 75, 112, 0.16));
  transition:
    width var(--tcrn-motion-emphasis),
    height var(--tcrn-motion-emphasis);
}
.tcrn-doc-brand .tcrn-shell-brand-lockup__copy {
  display: grid;
  gap: 2px;
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
.tcrn-doc-global-brand .tcrn-brand-wordmark {
  align-items: flex-start;
  flex-direction: column;
  gap: 2px;
  font-size: 16px;
  line-height: 1.05;
  max-width: 100%;
  min-width: 0;
}
.tcrn-doc-global-brand .tcrn-brand-wordmark__suffix {
  flex-basis: auto;
  line-height: 1.06;
}
.tcrn-doc-global-brand .tcrn-brand-wordmark__base,
.tcrn-doc-global-brand .tcrn-brand-wordmark__suffix,
.tcrn-doc-brand .tcrn-shell-brand-lockup__caption {
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tcrn-doc-brand .tcrn-shell-brand-lockup__caption {
  color: var(--tcrn-color-brand-primary);
  font-size: 11px;
  font-weight: 700;
  line-height: 1.25;
}
.tcrn-doc-sidebar__label {
  color: var(--tcrn-color-text-primary);
  font-weight: 800;
}
.tcrn-doc-sidebar__summary {
  margin: 0;
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
.tcrn-doc-nav,
.tcrn-doc-nav__groups,
.tcrn-doc-nav__stories {
  display: grid;
  gap: 4px;
}
.tcrn-doc-nav__groups,
.tcrn-doc-nav__stories {
  margin: 0;
  padding: 0;
  list-style: none;
}
.tcrn-doc-nav__group {
  display: grid;
  gap: 4px;
}
.tcrn-doc-nav__group + .tcrn-doc-nav__group {
  margin-top: 10px;
  transition: margin-top var(--tcrn-motion-emphasis);
}
.tcrn-doc-nav__section,
.tcrn-doc-nav__stories a {
  position: relative;
  align-items: center;
  overflow: hidden;
  color: var(--tcrn-color-text-secondary);
  text-decoration: none;
  overflow-wrap: normal;
  white-space: nowrap;
  word-break: normal;
}
.tcrn-doc-nav__section {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  border-radius: var(--tcrn-radius-control);
  min-height: 34px;
  padding: 7px 11px 7px 32px;
  color: var(--tcrn-color-text-primary);
  font-weight: 700;
  transition:
    min-height var(--tcrn-motion-emphasis),
    padding var(--tcrn-motion-emphasis),
    background-color var(--tcrn-motion-standard),
    color var(--tcrn-motion-standard);
}
.tcrn-doc-nav__section-label {
  display: block;
  min-width: 0;
  overflow: hidden;
  opacity: 1;
  text-overflow: ellipsis;
  transform: translateX(0) scale(1);
  transform-origin: left center;
  transition:
    opacity var(--tcrn-motion-standard),
    transform var(--tcrn-motion-emphasis);
}
.tcrn-doc-nav__section-abbr {
  position: absolute;
  top: 50%;
  left: 50%;
  color: var(--tcrn-color-text-primary);
  font-size: 11px;
  font-weight: 800;
  line-height: 1;
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, -50%) scale(0.76);
  transform-origin: center;
  transition:
    opacity var(--tcrn-motion-standard),
    transform var(--tcrn-motion-emphasis);
}
.tcrn-doc-shell[data-sidebar-collapsed="true"] .tcrn-doc-sidebar {
  overflow: hidden auto;
  padding: 14px 10px;
}
.tcrn-doc-shell[data-sidebar-collapsed="true"] .tcrn-doc-nav__groups {
  justify-items: stretch;
}
.tcrn-doc-shell[data-sidebar-collapsed="true"] .tcrn-doc-nav__group {
  justify-items: stretch;
}
.tcrn-doc-shell[data-sidebar-collapsed="true"] .tcrn-doc-nav__group + .tcrn-doc-nav__group {
  margin-top: 8px;
}
.tcrn-doc-shell[data-sidebar-collapsed="true"] .tcrn-doc-nav__section {
  justify-content: center;
  min-height: 38px;
  padding: 7px 8px;
}
.tcrn-doc-shell[data-sidebar-collapsed="true"] .tcrn-doc-nav__section-label {
  opacity: 0;
  transform: translateX(-10px) scale(0.78);
}
.tcrn-doc-shell[data-sidebar-collapsed="true"] .tcrn-doc-nav__section-abbr {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}
.tcrn-doc-shell[data-sidebar-collapsed="true"] .tcrn-doc-nav__section::before {
  left: 50%;
  width: 22px;
  height: 4px;
  transform: translate(-50%, 14px);
}
.tcrn-doc-shell[data-sidebar-collapsed="true"] .tcrn-doc-nav__stories {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  pointer-events: none;
  transform: translateY(-8px) scaleY(0.22);
  transform-origin: top center;
  visibility: hidden;
  transition:
    max-height var(--tcrn-motion-emphasis),
    opacity var(--tcrn-motion-standard),
    padding-left var(--tcrn-motion-emphasis),
    transform var(--tcrn-motion-emphasis),
    visibility 0s linear var(--tcrn-motion-emphasis);
}
.tcrn-doc-nav__section[aria-current="page"] {
  background: linear-gradient(
    90deg,
    var(--tcrn-color-brand-primary-bg) 0%,
    var(--tcrn-color-brand-primary-bg) 48%,
    var(--tcrn-color-surface-muted) 100%
  );
}
.tcrn-doc-nav__stories {
  padding-left: 12px;
  max-height: 420px;
  opacity: 1;
  overflow: hidden;
  transform: translateY(0) scaleY(1);
  transform-origin: top center;
  visibility: visible;
  transition:
    max-height var(--tcrn-motion-emphasis),
    opacity var(--tcrn-motion-standard),
    padding-left var(--tcrn-motion-emphasis),
    transform var(--tcrn-motion-emphasis),
    visibility 0s linear 0s;
}
.tcrn-doc-nav__stories a {
  display: flex;
  border-radius: var(--tcrn-radius-control);
  border: 1px solid transparent;
  min-height: 30px;
  padding: 5px 10px 5px 32px;
  font-size: 12px;
  line-height: 1.35;
}
.tcrn-doc-nav__stories a[aria-current="location"],
.tcrn-doc-nav__stories a[data-doc-nav-item-active="true"] {
  background: linear-gradient(
    90deg,
    var(--tcrn-color-brand-primary-bg) 0%,
    var(--tcrn-color-brand-primary-bg) 48%,
    var(--tcrn-color-surface-muted) 100%
  );
  border-color: var(--tcrn-color-border-subtle);
  color: var(--tcrn-color-text-primary);
  font-weight: 700;
}
.tcrn-doc-nav__section[aria-current="page"]::before,
.tcrn-doc-nav__stories a[aria-current="location"]::before,
.tcrn-doc-nav__stories a[data-doc-nav-item-active="true"]::before {
  content: "";
  position: absolute;
  top: 50%;
  bottom: auto;
  left: 6px;
  width: 8px;
  height: 24px;
  border-radius: 999px;
  background: linear-gradient(180deg, var(--tcrn-color-brand-primary), var(--tcrn-color-brand-secondary));
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--tcrn-color-brand-primary-bg) 78%, transparent);
  transform: translateY(-50%);
}
.tcrn-doc-shell[data-sidebar-collapsed="true"] .tcrn-doc-nav__section[aria-current="page"]::before {
  left: 50%;
  width: 22px;
  height: 4px;
  transform: translate(-50%, 14px);
}
.tcrn-doc-shell[data-sidebar-motion="collapsing"] .tcrn-doc-brand .tcrn-shell-brand-lockup__copy {
  max-width: 220px;
  opacity: 0;
  transform: translateX(-8px);
  visibility: visible;
}
.tcrn-doc-shell[data-sidebar-motion="collapsing"] .tcrn-doc-nav__groups,
.tcrn-doc-shell[data-sidebar-motion="collapsing"] .tcrn-doc-nav__group {
  justify-items: stretch;
}
.tcrn-doc-shell[data-sidebar-motion="collapsing"] .tcrn-doc-nav__section-label {
  opacity: 0;
  transform: translateX(-10px) scale(0.78);
}
.tcrn-doc-shell[data-sidebar-motion="collapsing"] .tcrn-doc-nav__section-abbr {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}
.tcrn-doc-shell[data-sidebar-motion="collapsing"] .tcrn-doc-nav__stories {
  animation: tcrn-doc-nav-stories-fold var(--tcrn-motion-emphasis) both;
  visibility: visible;
}
.tcrn-doc-shell[data-sidebar-motion="expanding"] .tcrn-doc-brand .tcrn-shell-brand-lockup__copy {
  animation: tcrn-doc-sidebar-copy-reveal var(--tcrn-motion-emphasis) both;
}
.tcrn-doc-shell[data-sidebar-motion="expanding"] .tcrn-doc-nav__groups,
.tcrn-doc-shell[data-sidebar-motion="expanding"] .tcrn-doc-nav__group {
  justify-items: stretch;
}
.tcrn-doc-shell[data-sidebar-motion="expanding"] .tcrn-doc-nav__section-label {
  animation: tcrn-doc-nav-label-reveal var(--tcrn-motion-emphasis) both;
}
.tcrn-doc-shell[data-sidebar-motion="expanding"] .tcrn-doc-nav__section-abbr {
  animation: tcrn-doc-nav-abbr-release var(--tcrn-motion-emphasis) both;
}
.tcrn-doc-shell[data-sidebar-motion="expanding"] .tcrn-doc-nav__stories {
  animation: tcrn-doc-nav-stories-unfold var(--tcrn-motion-emphasis) both;
  pointer-events: none;
  visibility: visible;
}
.tcrn-doc-nav__section:focus-visible,
.tcrn-doc-nav__stories a:focus-visible {
  outline: none;
  border-color: var(--tcrn-color-focus-ring);
  box-shadow:
    0 0 0 1px var(--tcrn-color-focus-ring),
    var(--tcrn-elevation-focus);
}
.tcrn-doc-nav__section:hover,
.tcrn-doc-nav__stories a:hover {
  background: var(--tcrn-color-surface-muted);
  color: var(--tcrn-color-text-primary);
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
button:focus-visible, input:focus-visible, select:focus-visible, [tabindex]:focus-visible {
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
.tcrn-top-bar__actions {
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
.tcrn-search-input {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 100%;
}
.tcrn-search-input__control {
  width: 100%;
  padding-left: 34px;
  padding-right: 68px;
}
.tcrn-search-input:not([data-shortcut-visible="true"]) .tcrn-search-input__control {
  padding-right: 10px;
}
.tcrn-search-input__icon,
.tcrn-search-input__shortcut {
  position: absolute;
  z-index: 1;
  color: var(--tcrn-color-text-secondary);
  pointer-events: none;
}
.tcrn-search-input__icon {
  left: 11px;
  display: inline-flex;
  width: 16px;
  height: 16px;
}
.tcrn-search-input__icon svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
}
.tcrn-search-input__shortcut {
  right: 9px;
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: 6px;
  background: var(--tcrn-color-surface-muted);
  padding: 2px 6px;
  font-family: var(--tcrn-type-family-sans);
  font-size: var(--tcrn-type-size-caption);
  font-weight: 700;
  line-height: 1;
}
.tcrn-checkbox {
  accent-color: var(--tcrn-color-brand-primary);
}
.tcrn-top-bar {
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
.tcrn-top-bar__brand {
  font-weight: 700;
  letter-spacing: 0;
}
.tcrn-top-bar__module {
  color: var(--tcrn-color-text-secondary);
}
.tcrn-top-bar__brand,
.tcrn-top-bar__module {
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
.tcrn-nav-item {
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
.tcrn-nav-item:hover {
  border-color: color-mix(in srgb, var(--tcrn-color-border-subtle) 86%, var(--tcrn-color-brand-primary-bg));
  background: color-mix(in srgb, var(--tcrn-color-brand-primary-bg) 42%, transparent);
  color: var(--tcrn-color-text-primary);
}
.tcrn-nav-item[data-selected="true"] {
  border-color: color-mix(in srgb, var(--tcrn-color-brand-primary) 26%, var(--tcrn-color-border-subtle));
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--tcrn-color-brand-primary-bg) 84%, var(--tcrn-color-surface-panel)) 0%, color-mix(in srgb, var(--tcrn-color-brand-secondary-bg) 34%, var(--tcrn-color-surface-panel)) 100%);
  color: var(--tcrn-color-text-primary);
  box-shadow: inset 4px 0 0 color-mix(in srgb, var(--tcrn-color-brand-primary) 74%, var(--tcrn-color-brand-secondary));
}
.tcrn-nav-item[aria-disabled="true"] {
  cursor: not-allowed;
  color: var(--tcrn-color-text-muted);
  opacity: 0.74;
}
.tcrn-nav-item__content {
  display: grid;
  gap: 2px;
  min-width: 0;
}
.tcrn-nav-item__label,
.tcrn-nav-item__disabled-reason {
  min-width: 0;
  overflow-wrap: anywhere;
}
.tcrn-nav-item__disabled-reason {
  color: var(--tcrn-color-text-muted);
  font-size: 12px;
  line-height: 1.25;
}
.tcrn-nav-item .tcrn-icon {
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
  .tcrn-doc-shell {
    padding: 0;
  }
  .alpha-frame {
    padding: 16px;
  }
  .tcrn-doc-header {
    position: static;
    padding: 10px;
  }
  .tcrn-doc-global-bar {
    grid-template-columns: 1fr;
  }
  .tcrn-doc-header__workspace {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 10px 16px;
  }
  .tcrn-doc-header__workspace:focus-within,
  .tcrn-doc-header__workspace[data-search-expanded="true"] {
    grid-template-columns: 1fr;
  }
  .tcrn-doc-current-location__path {
    flex-wrap: wrap;
  }
  .tcrn-doc-header-search {
    justify-self: stretch;
    width: 100%;
  }
  .tcrn-doc-global-brand {
    border-right: 0;
    border-bottom: 0;
  }
  .tcrn-doc-layout {
    grid-template-columns: 1fr;
    padding: 0;
  }
  .tcrn-doc-header-controls,
  .tcrn-doc-locale-control-slot {
    width: max-content;
    max-width: none;
  }
  .tcrn-doc-header-controls {
    justify-self: end;
    padding: 8px 16px 12px;
  }
  .tcrn-doc-header-controls__row {
    display: inline-flex;
  }
  .tcrn-doc-sidebar {
    position: static;
    height: auto;
    max-height: none;
    border-right: 0;
    border-bottom: 1px solid var(--tcrn-color-border-subtle);
  }
  .tcrn-doc-content {
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
  .tcrn-top-bar {
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
