import { createCssVariables, createThemeCssVariables } from "@tcrn/ui-tokens";
import { demoStoryCss } from "./story-demo-styles.js";

export const alphaStoryCss = `${createCssVariables()}${createThemeCssVariables("dark")}
* { box-sizing: border-box; }
html {
  --tcrn-anchor-scroll-offset: 96px;
  --tcrn-doc-motion-spring: 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --tcrn-doc-motion-smooth: 0.4s ease;
  --tcrn-doc-theme-crossfade-duration: 0.4s;
  --tcrn-doc-theme-crossfade-easing: ease;
  --tcrn-doc-header-search-resting-width: 260px;
  --tcrn-doc-header-search-expanded-width: 360px;
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

.tcrn-doc-shell {
  display: grid;
  gap: var(--tcrn-space-4);
  width: 100%;
  min-width: 0;
}
.tcrn-doc-shell {
  --tcrn-doc-shell-side-width: clamp(280px, 20vw, 360px);
  --tcrn-doc-shell-side-expanded-width: clamp(280px, 20vw, 360px);
  --tcrn-doc-shell-side-collapsed-width: 120px;
  --tcrn-doc-shell-divider: color-mix(in srgb, var(--tcrn-color-border-subtle) 74%, transparent);
  --tcrn-doc-shell-left-surface: var(--tcrn-color-brand-secondary-bg);
  --tcrn-doc-shell-top-surface: var(--tcrn-color-surface-panel);
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
  padding: var(--tcrn-space-2) var(--tcrn-space-2h);
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
  gap: var(--tcrn-space-2);
  max-width: 820px;
  min-width: 0;
  padding: var(--tcrn-space-1) var(--tcrn-space-2) var(--tcrn-space-1h);
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
  gap: clamp(var(--tcrn-space-3h), 1.6vw, 24px);
  min-width: 0;
  padding: var(--tcrn-space-3) clamp(var(--tcrn-space-2), 1vw, var(--tcrn-space-3h)) var(--tcrn-space-3) clamp(28px, 2.8vw, 48px);
  border-left: 0;
  transition: grid-template-columns var(--tcrn-doc-motion-spring);
}
.tcrn-doc-header__workspace:focus-within,
.tcrn-doc-header__workspace[data-search-expanded="true"] {
  grid-template-columns: minmax(180px, 1fr) var(--tcrn-doc-header-search-expanded-width);
}
.tcrn-doc-current-location {
  display: grid;
  gap: var(--tcrn-space-1);
  min-width: 0;
}
.tcrn-doc-current-location__label {
  color: var(--tcrn-color-brand-primary);
  font-size: var(--tcrn-type-size-caption);
  font-weight: 800;
  line-height: 1;
}
.tcrn-doc-current-location__path {
  display: flex;
  align-items: center;
  gap: var(--tcrn-space-2);
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
  font-size: var(--tcrn-type-size-section);
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
  font-size: var(--tcrn-type-size-reading);
  font-weight: 700;
  line-height: 1.2;
}
.tcrn-doc-header-search {
  position: relative;
  justify-self: end;
  width: 100%;
  min-width: 0;
}
.tcrn-doc-header-search .tcrn-search-input {
  --tcrn-search-input-block-size: 36px;
  --tcrn-search-input-icon-size: 16px;
  --tcrn-search-input-padding-inline: 10px;
  --tcrn-search-input-column-gap: 8px;
  --tcrn-search-input-control-min-inline-size: 84px;
  width: 100%;
  max-width: 100%;
  background: var(--tcrn-color-surface-panel);
  transition:
    background-color var(--tcrn-doc-motion-smooth),
    border-color var(--tcrn-doc-motion-smooth),
    box-shadow var(--tcrn-doc-motion-smooth),
    color var(--tcrn-doc-motion-smooth);
}

.tcrn-doc-page-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(220px, 320px);
  gap: var(--tcrn-space-3h);
  align-items: start;
  min-width: 0;
  border-bottom: 1px solid var(--tcrn-color-border-subtle);
  padding: var(--tcrn-space-0h) 0 var(--tcrn-space-4);
}
.tcrn-doc-page-head h2 {
  font-size: var(--tcrn-type-size-page);
  line-height: var(--tcrn-type-line-page);
}
.tcrn-doc-page-head__intro {
  display: grid;
  gap: var(--tcrn-space-1h);
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
  font-size: var(--tcrn-type-size-meta);
  font-weight: 800;
  letter-spacing: 0;
}
.tcrn-doc-on-this-page {
  display: grid;
  gap: var(--tcrn-space-1h);
  min-width: 0;
  border-left: 1px solid var(--tcrn-color-border-subtle);
  padding-left: var(--tcrn-space-3h);
}
.tcrn-doc-on-this-page strong {
  color: var(--tcrn-color-text-primary);
  font-size: var(--tcrn-type-size-caption);
  line-height: 1.3;
}
.tcrn-doc-on-this-page ol {
  display: grid;
  gap: var(--tcrn-space-1);
  margin: 0;
  padding: 0;
  list-style: none;
}
.tcrn-doc-on-this-page li {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--tcrn-space-2);
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
  font-size: var(--tcrn-type-size-caption);
  font-weight: 700;
  line-height: 1.2;
  padding: var(--tcrn-space-0h) var(--tcrn-space-1h);
}
.tcrn-doc-boundary-strip {
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  gap: var(--tcrn-space-1h);
  min-width: 0;
}
.tcrn-doc-eyebrow {
  color: var(--tcrn-color-focus-ring);
  font-size: var(--tcrn-type-size-meta);
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
  padding: 0 clamp(var(--tcrn-space-4h), 1.8vw, 28px) 0 0;
}
.tcrn-doc-header-controls__row {
  display: inline-flex;
  gap: var(--tcrn-space-2h);
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
/* While the collapse/expand motion runs (the runtime holds data-sidebar-motion for
   its 260ms window), off-screen stories skip per-frame layout and paint so the grid
   transition keeps its frame budget on long pages. Outside the motion window the rule
   is inert, so captures, anchors, and search see fully rendered content. */
.tcrn-doc-shell[data-sidebar-motion] article[data-story-id] {
  content-visibility: auto;
  contain-intrinsic-size: auto 900px;
}
@media (prefers-reduced-motion: reduce) {
  .tcrn-doc-sidebar-toggle-slot,
  .tcrn-doc-global-brand .tcrn-doc-brand {
    transition: none;
  }
}
/* Progressive disclosure: a page opens as a compact index — story title, one-line
   locator, ledger +/- notation — and each story reveals on demand. Hash navigation
   expands its target, so deep links keep working. Expansion is instant: disclosure
   is a reading act, not a scene change. */
article[data-story-collapsed="true"] > .story-body {
  display: none;
}
.tcrn-story-disclosure__heading {
  margin: 0;
}
.tcrn-story-disclosure {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--tcrn-space-3);
  width: 100%;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  padding: var(--tcrn-space-0h) 0;
  cursor: pointer;
}
.tcrn-story-disclosure__chevron {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--tcrn-color-text-secondary);
}
.tcrn-story-disclosure__chevron .tcrn-icon {
  width: 16px;
  height: 16px;
  transition: transform var(--tcrn-motion-standard);
}
.tcrn-story-disclosure[aria-expanded="true"] .tcrn-story-disclosure__chevron .tcrn-icon {
  transform: rotate(90deg);
}
.tcrn-story-disclosure:hover {
  color: var(--tcrn-color-brand-primary);
}
article[data-story-collapsed="false"] > .tcrn-story-disclosure__heading {
  box-shadow: inset 3px 0 0 var(--tcrn-color-brand-primary);
  padding-left: var(--tcrn-space-2h);
}
/* The collapse motion is travel; under reduced motion, travel is removed and the
   width snaps (v2 reduced-motion semantics — comprehension cues stay, movement goes). */
@media (prefers-reduced-motion: reduce) {
  .tcrn-doc-layout,
  .tcrn-doc-global-bar {
    transition: none;
  }
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
  box-shadow: none;
  padding: var(--tcrn-space-4) clamp(var(--tcrn-space-4), 1.6vw, 24px) var(--tcrn-space-4h) clamp(var(--tcrn-space-4h), 2vw, 30px);
  /* padding is a layout property; it snaps with the collapse rather than animating. */
  transition: background-color var(--tcrn-motion-standard);
}

.tcrn-doc-global-brand {
  align-self: stretch;
  position: relative;
  display: block;
  min-height: var(--tcrn-anchor-scroll-offset);
  border-right: 0;
  border-radius: 0;
  background: var(--tcrn-doc-shell-left-surface);
  box-shadow: none;
  padding: 0;
  overflow: hidden;
  transition: background-color var(--tcrn-motion-standard);
}
.tcrn-doc-global-brand .tcrn-doc-brand {
  position: absolute;
  transition:
    left var(--tcrn-motion-emphasis),
    top var(--tcrn-motion-emphasis);
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
    background-color var(--tcrn-motion-standard),
    border-color var(--tcrn-motion-standard),
    color var(--tcrn-motion-standard),
    transform var(--tcrn-motion-fast);
}
.tcrn-doc-sidebar-toggle-slot {
  position: absolute;
  transition: left var(--tcrn-motion-emphasis);
  /* 38px = the SideNavCollapseButton's real size (tcrn-icon-button); the old 32px
     assumption left the control off-centre in both anchoring states. */
  top: calc((var(--tcrn-anchor-scroll-offset) - 38px) / 2);
  left: calc(var(--tcrn-doc-shell-side-expanded-width) - clamp(16px, 1.6vw, 24px) - 38px);
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
  /* The 120px rail keeps the 40px mark and the 38px toggle side by side inside the
     96px header band (15/40/12/38/15), so collapsing never moves anything on the
     Y axis and nothing straddles the band's bottom divider. */
  top: calc((var(--tcrn-anchor-scroll-offset) - 40px) / 2);
  left: 15px;
  width: 40px;
  transform: none;
}
.tcrn-doc-shell[data-sidebar-collapsed="true"] .tcrn-doc-brand {
  --tcrn-brand-mark-size: 40px;
  grid-template-columns: 40px minmax(0, 0fr);
  gap: 0;
}
.tcrn-doc-shell[data-sidebar-collapsed="true"] .tcrn-doc-brand .tcrn-shell-brand-lockup__copy,
.tcrn-doc-shell[data-sidebar-collapsed="true"] .tcrn-doc-brand .tcrn-product-logo__copy {
  max-width: 0;
  opacity: 0;
  pointer-events: none;
  transform: translateX(-8px);
  visibility: hidden;
}
.tcrn-doc-shell[data-sidebar-collapsed="true"] .tcrn-doc-sidebar-toggle-slot {
  /* Same top as the expanded state — the toggle translates on X only, staying inside
     the header band beside the mark (15px margin + 40px mark + 12px gap). */
  left: calc(15px + 40px + 12px);
  transform: none;
}

.tcrn-doc-global-brand .tcrn-brand-wordmark {
  align-items: flex-start;
  flex-direction: column;
  gap: var(--tcrn-space-0h);
  font-size: var(--tcrn-type-size-heading-3);
  line-height: 1.05;
  max-width: 100%;
  min-width: 0;
}
.tcrn-doc-global-brand .tcrn-brand-wordmark__suffix {
  flex-basis: auto;
  line-height: 1.06;
}
.tcrn-doc-global-brand .tcrn-brand-wordmark__base,
.tcrn-doc-global-brand .tcrn-brand-wordmark__suffix {
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  gap: var(--tcrn-space-4h);
  align-content: start;
  min-width: 0;
  background: var(--tcrn-color-surface-canvas);
  padding: clamp(24px, 2.6vw, 48px);
  transition: padding var(--tcrn-motion-emphasis);
}
article {
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  background: var(--tcrn-color-surface-panel);
  padding: var(--tcrn-space-4);
  max-width: 100%;
  min-width: 0;
}
article {
  overflow-x: hidden;
  scroll-margin-top: var(--tcrn-anchor-scroll-offset);
}

.alpha-story-card > h1 + p {
  margin-top: -8px;
}

.tcrn-doc-nav,
.tcrn-doc-nav__groups,
.tcrn-doc-nav__categories,
.tcrn-doc-nav__stories {
  display: grid;
  gap: var(--tcrn-space-1);
}
.tcrn-doc-nav__groups,
.tcrn-doc-nav__categories,
.tcrn-doc-nav__stories {
  margin: 0;
  padding: 0;
  list-style: none;
}
.tcrn-doc-nav__group {
  display: grid;
  gap: var(--tcrn-space-1h);
}
.tcrn-doc-nav__group + .tcrn-doc-nav__group {
  margin-top: 18px;
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
  min-height: 34px;
  padding: var(--tcrn-space-1h) var(--tcrn-space-2h);
}
.tcrn-doc-nav__section-icon {
  display: none;
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
  font-size: var(--tcrn-type-size-caption);
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
  padding: var(--tcrn-space-3h) 0;
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
  min-height: 40px;
  padding: 0;
  place-items: center;
}
.tcrn-doc-shell[data-sidebar-collapsed="true"] .tcrn-doc-nav__section-icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
}
.tcrn-doc-shell[data-sidebar-collapsed="true"] .tcrn-doc-nav__section-icon .tcrn-icon {
  width: 20px;
  height: 20px;
}
.tcrn-doc-shell[data-sidebar-collapsed="true"] .tcrn-doc-nav__section-abbr {
  display: none;
}
.tcrn-doc-shell[data-sidebar-collapsed="true"] .tcrn-doc-nav__section-label {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
.tcrn-doc-shell[data-sidebar-collapsed="true"] .tcrn-doc-nav__section-abbr {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
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
.tcrn-doc-shell[data-sidebar-collapsed="true"] .tcrn-doc-nav__categories {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  pointer-events: none;
  visibility: hidden;
}
.tcrn-doc-nav__section[aria-current="page"] {
  color: var(--tcrn-color-brand-primary);
  box-shadow: inset 3px 0 0 var(--tcrn-color-brand-primary);
}
.tcrn-doc-nav__categories {
  padding-left: 0;
  transition:
    max-height var(--tcrn-motion-emphasis),
    opacity var(--tcrn-motion-standard),
    padding-left var(--tcrn-motion-emphasis),
    visibility 0s linear 0s;
}
.tcrn-doc-nav__category {
  display: grid;
  gap: var(--tcrn-space-0h);
  min-width: 0;
}
.tcrn-doc-nav__category-toggle {
  display: grid;
  /* No disclosure arrow: the whole row toggles and the count badge already signals
     content. The label takes the first column. */
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--tcrn-space-2);
  width: 100%;
  min-height: 26px;
  min-width: 0;
  border: 1px solid transparent;
  border-radius: var(--tcrn-radius-control);
  background: transparent;
  color: var(--tcrn-color-text-secondary);
  padding: var(--tcrn-space-1) var(--tcrn-space-2);
  text-align: left;
}
.tcrn-doc-nav__category-label {
  grid-column: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tcrn-doc-nav__category-count {
  grid-column: 3;
  border-radius: var(--tcrn-radius-pill);
  background: color-mix(in srgb, var(--tcrn-color-surface-muted) 78%, transparent);
  color: var(--tcrn-color-text-tertiary);
  font-size: var(--tcrn-type-size-caption);
  font-weight: 800;
  line-height: 1;
  padding: var(--tcrn-space-0h) var(--tcrn-space-1);
}
.tcrn-doc-nav__category-toggle:hover,
.tcrn-doc-nav__category-toggle:focus-visible {
  border-color: var(--tcrn-color-border-subtle);
  background: var(--tcrn-color-surface-muted);
  color: var(--tcrn-color-text-primary);
}
.tcrn-doc-nav__stories {
  padding-left: 0;
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
.tcrn-doc-nav__stories[hidden] {
  display: none;
}
.tcrn-doc-nav__stories a {
  display: flex;
  border: 1px solid transparent;
  min-height: 30px;
  padding: var(--tcrn-space-1) var(--tcrn-space-2h) var(--tcrn-space-1) var(--tcrn-space-6);
  font-size: var(--tcrn-type-size-meta);
  line-height: 1.35;
}
.tcrn-doc-nav__stories a[aria-current="location"],
.tcrn-doc-nav__stories a[data-doc-nav-item-active="true"] {
  color: var(--tcrn-color-brand-primary);
  font-weight: 700;
  box-shadow: inset 3px 0 0 var(--tcrn-color-brand-primary);
}
/* Collapsed, the same bar sits on the same axis and the icon takes the brand colour. */
.tcrn-doc-shell[data-sidebar-collapsed="true"] .tcrn-doc-nav__section[aria-current="page"] {
  color: var(--tcrn-color-brand-primary);
  box-shadow: inset 3px 0 0 var(--tcrn-color-brand-primary);
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
.tcrn-doc-nav__category-toggle:focus-visible,
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

.tcrn-doc-chapter-pager {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--tcrn-space-3);
  margin-top: 2px;
}
.tcrn-doc-chapter-pager__link {
  display: grid;
  gap: var(--tcrn-space-1);
  min-height: 78px;
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  background: var(--tcrn-color-surface-panel);
  color: var(--tcrn-color-text-primary);
  padding: var(--tcrn-space-3h);
  text-decoration: none;
}
.tcrn-doc-chapter-pager__icon {
  width: 16px;
  height: 16px;
  color: var(--tcrn-color-brand-primary);
}
.tcrn-doc-chapter-pager__link--next {
  text-align: right;
  background: var(--tcrn-color-surface-panel);
}
.tcrn-doc-chapter-pager__link--next .tcrn-doc-chapter-pager__icon {
  justify-self: end;
  color: var(--tcrn-color-brand-secondary);
}
.tcrn-doc-chapter-pager__eyebrow {
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-caption);
  font-weight: 700;
}
.tcrn-doc-chapter-pager__title {
  font-size: var(--tcrn-type-size-reading);
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
input,
select {
  font: inherit;
}

.tcrn-doc-header :focus-visible,
.tcrn-doc-sidebar :focus-visible,
.tcrn-doc-chapter-pager :focus-visible,
.tcrn-doc-sidebar-toggle-slot :focus-visible {
  outline: 2px solid var(--tcrn-color-focus-ring);
  outline-offset: 2px;
  box-shadow: var(--tcrn-elevation-focus);
}
.story-body {
  display: grid;
  gap: var(--tcrn-space-3);
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
${demoStoryCss}

.tcrn-brand-system {
  display: grid;
  grid-template-columns: minmax(180px, 240px) minmax(0, 1fr);
  gap: var(--tcrn-space-4h);
  align-items: center;
  min-width: 0;
}
.tcrn-brand-system__symbol {
  display: grid;
  place-items: center;
  border-radius: calc(var(--tcrn-radius-surface) + 4px);
  background: var(--tcrn-color-surface-muted);
  padding: var(--tcrn-space-5);
}
.tcrn-brand-system__copy {
  display: grid;
  gap: var(--tcrn-space-2h);
  min-width: 0;
}
.tcrn-brand-system__copy h3,
.tcrn-brand-system__copy p {
  margin: 0;
}
.tcrn-brand-system {
  --tcrn-brand-mark-size: min(100%, 220px);
}
.tcrn-brand-lockups {
  display: grid;
  gap: var(--tcrn-space-2h);
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  min-width: 0;
}
.tcrn-brand-lockup-card {
  --tcrn-brand-mark-size: 62px;
  display: flex;
  align-items: center;
  min-width: 0;
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  background: var(--tcrn-color-surface-panel);
  padding: var(--tcrn-space-3);
}
.tcrn-brand-lockup-card > * {
  width: 100%;
}

.tcrn-key-value-list > div {
  display: grid;
  gap: var(--tcrn-space-1);
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

.tcrn-doc-header-search .tcrn-search-input {
  width: 100%;
  max-width: 100%;
}
.tcrn-checkbox {
  accent-color: var(--tcrn-color-brand-primary);
}

.tcrn-skip-link {
  position: absolute;
  transform: translateY(-140%);
  border: 1px solid var(--tcrn-color-focus-ring);
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-color-surface-panel);
  color: var(--tcrn-color-text-primary);
  padding: var(--tcrn-space-1h) var(--tcrn-space-2h);
  text-decoration: none;
}
.tcrn-skip-link:focus {
  position: static;
  transform: none;
  outline: 2px solid var(--tcrn-color-focus-ring);
  outline-offset: 2px;
}

.tcrn-shell-brand-lockup .tcrn-brand-wordmark {
  font-size: var(--tcrn-type-size-section);
}

.tcrn-knowledge-shell__brand-cell {
  grid-column: 1;
  grid-row: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 32px;
  gap: var(--tcrn-space-2h);
  align-items: center;
  align-self: stretch;
  background: var(--tcrn-knowledge-shell-left-surface);
  padding: var(--tcrn-space-2h) var(--tcrn-space-3h);
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
  gap: var(--tcrn-space-0h);
  font-size: var(--tcrn-type-size-heading-3);
  line-height: 1.05;
}
.tcrn-knowledge-shell__brand .tcrn-brand-wordmark__suffix {
  flex-basis: auto;
  line-height: 1.06;
}
.tcrn-knowledge-shell__brand .tcrn-shell-brand-lockup__caption {
  white-space: nowrap;
}

html[data-tcrn-theme="dark"] .tcrn-overlay-mode-card,
html[data-tcrn-theme="dark"] .tcrn-overlay-static-card {
  border-color: color-mix(in srgb, var(--tcrn-color-border-strong) 62%, transparent);
  background: color-mix(in srgb, var(--tcrn-color-surface-muted) 74%, var(--tcrn-color-surface-panel));
}

html[data-tcrn-theme="dark"] .tcrn-dialog-spec-fixture {
  border-color: color-mix(in srgb, var(--tcrn-color-border-strong) 58%, transparent);
  background: var(--tcrn-color-surface-muted);
}

@media (max-width: 760px) {
  html {
    --tcrn-anchor-scroll-offset: 412px;
    --tcrn-doc-mobile-brand-height: 219px;
  }
  .tcrn-doc-shell {
    padding: 0;
  }
  .tcrn-doc-header {
    position: sticky;
    top: 0;
    z-index: 30;
    isolation: isolate;
    min-height: 0;
    background-color: var(--tcrn-color-surface-panel);
    background-image: none;
    padding: var(--tcrn-space-2h);
    box-shadow: var(--tcrn-elevation-floating);
  }
  .tcrn-doc-global-bar {
    grid-template-columns: 1fr;
    min-height: 0;
    background-color: var(--tcrn-color-surface-panel);
    background-image: none;
  }
  .tcrn-doc-header__workspace {
    grid-template-columns: 1fr;
    gap: var(--tcrn-space-2h);
    padding: var(--tcrn-space-2h) var(--tcrn-space-4);
    background-color: var(--tcrn-color-surface-panel);
    background-image: none;
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
    background-color: var(--tcrn-color-surface-panel);
    background-image: none;
  }
  .tcrn-doc-current-location {
    background-color: var(--tcrn-color-surface-panel);
    background-image: none;
  }
  .tcrn-doc-global-brand {
    min-height: var(--tcrn-doc-mobile-brand-height);
    background-color: var(--tcrn-color-surface-panel);
    background-image: var(--tcrn-doc-shell-left-surface);
    border-right: 0;
    border-bottom: 0;
  }
  .tcrn-doc-global-brand .tcrn-doc-brand {
    top: calc((var(--tcrn-doc-mobile-brand-height) - 52px) / 2);
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
    padding: var(--tcrn-space-2) var(--tcrn-space-4) var(--tcrn-space-3);
    background-color: var(--tcrn-color-surface-panel);
    background-image: none;
  }
  .tcrn-doc-header-controls__row {
    display: inline-flex;
    background-color: var(--tcrn-color-surface-panel);
    background-image: none;
  }
  .tcrn-doc-page-head {
    grid-template-columns: 1fr;
  }
  .tcrn-doc-on-this-page {
    border-left: 0;
    border-top: 1px solid var(--tcrn-color-border-subtle);
    padding: var(--tcrn-space-3) 0 0;
  }
  .tcrn-doc-sidebar {
    position: static;
    height: auto;
    max-height: none;
    border-right: 0;
    border-bottom: 1px solid var(--tcrn-color-border-subtle);
  }
  .tcrn-doc-content {
    padding: var(--tcrn-space-4);
  }
  .tcrn-doc-chapter-pager {
    grid-template-columns: 1fr;
  }
  .tcrn-brand-system {
    grid-template-columns: 1fr;
  }
  .tcrn-knowledge-shell__brand-cell {
    grid-column: auto;
    grid-row: auto;
  }
  .tcrn-knowledge-shell__brand-cell {
    padding: var(--tcrn-space-2h) var(--tcrn-space-3h);
  }
}
@media (max-width: 520px) {
  .tcrn-key-value-list > div {
    grid-template-columns: 1fr;
  }
}


`;
