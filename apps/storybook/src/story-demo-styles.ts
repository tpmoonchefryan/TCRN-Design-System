// Shared story-demo CSS layer for the TCRN Design System docs — TCRN-DS-STORY-034.
//
// This is the single source for the demo/presentation selectors that BOTH doc
// stylesheets used to hand-maintain: the real-Storybook sheet
// (apps/storybook/src/storybook.css, Track A) and the static-docs sheet embedded by
// alpha-styles.ts (Track B). alpha-styles.ts imports `demoStoryCss` and interpolates
// it; storybook.css carries a generated copy between markers, kept in sync by
// `scripts/demo-styles-sync.mjs` (run via `pnpm demo-styles:sync`; `pnpm tokens:proof`
// fails on drift). Do NOT put the token :root blocks here (tokens-sync owns those),
// the alpha-only docs-shell chrome (alpha-styles.ts), or the Track-A-only scaffolding.
//
// TCRN-DS-SUB-025: component styles come from the package (`tcrnComponentCss`), never
// from this layer. Every documentation-private class uses the `tcrn-doc-` prefix; rules
// may place a package component inside that scaffolding but do not repaint it.
// scripts/doc-shell-class-proof.mjs counts any other tcrn-* class the package does not define.
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
  border: 1px solid var(--tcrn-color-line);
  border-radius: var(--tcrn-radius-surface);
  background: var(--tcrn-color-panel);
  padding: var(--tcrn-space-4);
  max-width: 100%;
  min-width: 0;
}

.tcrn-doc-story-kicker {
  color: var(--tcrn-color-acc);
  font-size: var(--tcrn-type-size-meta);
  font-weight: 700;
  letter-spacing: 0;
}

.tcrn-doc-static-section {
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

/* The .tcrn-icon base rule is the package's (styles/icon.css.ts); the docs layer only
   lays icon samples out, and it addresses a package icon as svg[data-icon-name] so that
   no docs rule takes .tcrn-icon as its subject. */

/* .tcrn-highlight-text / .tcrn-highlight-mark (Typography-emitted) moved into the
   package component CSS — TCRN-DS-STORY-037. */

.alpha-story-stack {
  display: grid;
  gap: var(--tcrn-space-3);
}

.tcrn-doc-changelog-records {
  display: grid;
  gap: var(--tcrn-space-3);
  min-width: 0;
}

.tcrn-doc-changelog-record {
  display: grid;
  gap: var(--tcrn-space-3);
  min-width: 0;
  border: 1px solid var(--tcrn-color-line);
  border-radius: var(--tcrn-radius-surface);
  background: var(--tcrn-color-panel);
  padding: var(--tcrn-space-3);
}

.tcrn-doc-changelog-record__header {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: start;
  gap: var(--tcrn-space-2h);
  min-width: 0;
}

.tcrn-doc-changelog-record__header h3,
.tcrn-doc-changelog-record__header p {
  margin: 0;
}

.tcrn-doc-changelog-record__evidence-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--tcrn-space-2h);
  min-width: 0;
}

.tcrn-doc-changelog-record__evidence-list {
  display: grid;
  gap: var(--tcrn-space-2);
  min-width: 0;
}

.tcrn-doc-changelog-record__evidence-list h4 {
  margin: 0;
  font-size: var(--tcrn-type-size-body);
}

.tcrn-doc-changelog-record__evidence-list ul {
  display: grid;
  gap: var(--tcrn-space-1h);
  margin: 0;
  padding-inline-start: 18px;
  min-width: 0;
}

.tcrn-doc-changelog-record__evidence-list li {
  min-width: 0;
}

.tcrn-doc-changelog-record__artifact,
.tcrn-doc-changelog-record__boundary {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  color: var(--tcrn-color-ink-2);
  text-overflow: ellipsis;
  vertical-align: bottom;
  white-space: nowrap;
}

.tcrn-doc-guidance-grid,
.tcrn-doc-spec-grid {
  display: grid;
  gap: var(--tcrn-space-3);
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  min-width: 0;
}

/* The record-index panel carries two status chips per row. Reserve the wider
   half for that scan surface so the chips stay on one line after the badge's
   geometry is corrected; the paired empty-state panel remains readable. */
.tcrn-doc-spec-grid--record-index {
  grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.75fr);
}

@media (max-width: 760px) {
  .tcrn-doc-spec-grid--record-index {
    grid-template-columns: minmax(0, 1fr);
  }
}

/* At 200% zoom a 390px physical viewport has a 195px CSS viewport. Remove the
   220px demo-card floor at that effective width so the page itself never grows
   a horizontal scrollbar; tables retain their own local overflow contract. */
@media (max-width: 240px) {
  .tcrn-doc-spec-grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .tcrn-doc-spec-grid > * {
    min-inline-size: 0;
    max-inline-size: 100%;
  }
}

.tcrn-doc-status-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: var(--tcrn-space-2);
}

.tcrn-doc-form-stack {
  display: grid;
  gap: var(--tcrn-space-3);
  min-width: 0;
}

.tcrn-doc-form-stack .tcrn-field {
  margin-bottom: 0;
}

.tcrn-doc-action-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--tcrn-space-2);
  min-width: 0;
}

.tcrn-doc-locale-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--tcrn-space-2);
}

.tcrn-doc-token-swatch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--tcrn-space-2h);
  min-width: 0;
}

.tcrn-doc-token-swatch {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr);
  gap: var(--tcrn-space-1) var(--tcrn-space-2h);
  align-items: center;
  border: 1px solid var(--tcrn-color-line);
  border-radius: var(--tcrn-radius-surface);
  padding: var(--tcrn-space-2h);
  min-width: 0;
}

.tcrn-doc-token-swatch__color {
  grid-row: span 3;
  width: 34px;
  height: 34px;
  border: 1px solid var(--tcrn-color-line-2);
  border-radius: var(--tcrn-radius-control);
}

.tcrn-doc-token-swatch strong,
.tcrn-doc-token-swatch code,
.tcrn-doc-token-swatch p {
  min-width: 0;
}

.tcrn-doc-token-swatch code {
  color: var(--tcrn-color-ink-2);
  overflow-wrap: anywhere;
}

.tcrn-doc-token-swatch p {
  margin: 0;
}

.tcrn-doc-type-scale-demo {
  display: grid;
  gap: var(--tcrn-space-2h);
  border: 1px solid var(--tcrn-color-line);
  border-radius: var(--tcrn-radius-surface);
  padding: var(--tcrn-space-3);
  background: var(--tcrn-color-panel);
  min-width: 0;
}

.tcrn-doc-icon-sample-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(156px, 1fr));
  gap: var(--tcrn-space-2);
  margin: var(--tcrn-space-4) 0 0;
  padding: 0;
  list-style: none;
  min-width: 0;
}

.tcrn-doc-icon-sample {
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr);
  align-items: center;
  gap: var(--tcrn-space-2);
  min-width: 0;
  min-height: 40px;
  border: 1px solid var(--tcrn-color-line);
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-color-panel-2);
  color: var(--tcrn-color-ink-2);
  padding: var(--tcrn-space-2) var(--tcrn-space-2h);
}

/* The sample only places the package icon in its track: size (Icon's default md, 16px)
   and colour stay the package's. */
.tcrn-doc-icon-sample svg[data-icon-name] {
  justify-self: center;
}

.tcrn-doc-icon-sample code {
  min-width: 0;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  overflow-wrap: anywhere;
  color: var(--tcrn-color-ink);
  font-family: var(--tcrn-type-family-mono);
  font-size: var(--tcrn-type-size-meta);
  line-height: 1.3;
}

.tcrn-doc-motion-demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--tcrn-space-2h);
  min-width: 0;
}

.tcrn-doc-motion-demo {
  display: grid;
  gap: var(--tcrn-space-2h);
  border: 1px solid var(--tcrn-color-line);
  border-radius: var(--tcrn-radius-surface);
  padding: var(--tcrn-space-3);
  min-width: 0;
  background: var(--tcrn-color-panel);
}

.tcrn-doc-motion-demo h3,
.tcrn-doc-motion-demo p {
  margin: 0;
}

.tcrn-doc-motion-demo__track {
  position: relative;
  min-height: 28px;
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-color-panel-2);
  overflow: hidden;
}

.tcrn-doc-motion-demo__dot {
  position: absolute;
  top: 6px;
  left: 8px;
  width: 16px;
  height: 16px;
  border-radius: var(--tcrn-radius-pill);
  background: var(--tcrn-color-acc);
  animation: tcrn-motion-travel var(--tcrn-motion-standard) infinite alternate;
}

.tcrn-doc-motion-demo--instant .tcrn-doc-motion-demo__dot {
  animation-duration: 700ms;
  animation-timing-function: ease-out;
}

.tcrn-doc-motion-demo--standard .tcrn-doc-motion-demo__dot {
  background: var(--tcrn-color-acc-2);
  animation-duration: 1100ms;
  animation-timing-function: ease;
}

.tcrn-doc-motion-demo--emphasis .tcrn-doc-motion-demo__dot {
  background: var(--tcrn-color-red);
  animation-duration: 1400ms;
  animation-timing-function: cubic-bezier(0.2, 0, 0.2, 1);
}

.tcrn-doc-motion-demo--reduced .tcrn-doc-motion-demo__dot {
  left: 50%;
  background: var(--tcrn-color-ink-2);
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

.tcrn-doc-loading-motion-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--tcrn-space-2h);
  min-width: 0;
}

.tcrn-doc-loading-card__row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--tcrn-space-2h);
  min-width: 0;
}

.tcrn-doc-loading-copy {
  display: grid;
  gap: var(--tcrn-space-1);
  min-width: 0;
}

.tcrn-doc-theme-preview {
  display: grid;
  gap: var(--tcrn-space-2h);
  color: var(--tcrn-color-ink);
  background: var(--tcrn-color-bg);
  /* Token-driven so the preview shows the language it documents. It used to paint a
     hardcoded v1 navy wash with a blue-grey edge, which meant the component whose whole
     job is demonstrating the dark theme was demonstrating a theme that no longer exists. */
  border: 1px solid var(--tcrn-color-line);
  border-radius: var(--tcrn-radius-surface);
  box-shadow: var(--tcrn-shadow-s3);
  padding: var(--tcrn-space-3);
}

/* Feedback families .tcrn-state-view / .tcrn-skeleton* (+ @keyframes
   tcrn-skeleton-shimmer) / .tcrn-state-surface* moved into the package component CSS —
   TCRN-DS-STORY-037. (.tcrn-state-surface__action stays out of scope; it is S036.) */

.tcrn-doc-display-primitive-grid {
  display: grid;
  gap: var(--tcrn-space-3);
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  align-items: stretch;
}

/* A wrapping reference strip must not take its longest reference as its minimum width:
   inside a panel's grid that minimum widens the whole track and the panel clips its
   tables instead of letting them scroll. */
.tcrn-doc-reference-strip[data-reference-wrap="true"] {
  min-width: 0;
}

.tcrn-doc-interaction-primitive-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--tcrn-space-3);
  align-items: center;
}

.tcrn-doc-interaction-primitive-grid {
  display: grid;
  gap: var(--tcrn-space-3);
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  align-items: start;
}

.tcrn-doc-nav-component-preview {
  display: grid;
  gap: var(--tcrn-space-3);
  min-width: 0;
  border: 1px solid color-mix(in srgb, var(--tcrn-color-line) 78%, transparent);
  border-radius: var(--tcrn-radius-surface);
  background: color-mix(in srgb, var(--tcrn-color-panel-2) 48%, var(--tcrn-color-panel));
  padding: var(--tcrn-space-3);
}

.tcrn-doc-nav-component-preview .tcrn-product-switcher {
  width: max-content;
  max-width: 100%;
}

.tcrn-doc-package-nav-proof {
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

.tcrn-doc-package-nav-proof__skip {
  position: relative;
  grid-area: skip;
  min-width: 0;
  min-height: 0;
}

.tcrn-doc-package-nav-proof > .tcrn-side-nav {
  grid-area: sidenav;
  justify-self: stretch;
  min-width: min(180px, 100%);
  width: 100%;
}

.tcrn-doc-package-nav-proof > .tcrn-segmented-nav {
  grid-area: tabs;
  align-self: start;
}

.tcrn-doc-demo-frame {
  position: relative;
  display: grid;
  gap: var(--tcrn-space-3h);
  min-width: 0;
  border: 1px solid var(--tcrn-color-line);
  border-radius: var(--tcrn-radius-surface);
  background: var(--tcrn-color-panel);
  padding: var(--tcrn-space-3h);
  box-shadow: var(--tcrn-shadow-s3);
}

.tcrn-doc-knowledge-preview {
  display: grid;
  gap: var(--tcrn-space-2);
  min-width: 0;
}

.tcrn-doc-demo-frame--knowledge {
  padding: 0;
  overflow: hidden;
}

.tcrn-doc-knowledge-preview__panel,
.tcrn-doc-demo-pager {
  display: grid;
  gap: var(--tcrn-space-2);
  min-width: 0;
}

.tcrn-doc-knowledge-preview {
  align-content: start;
  border: 1px solid color-mix(in srgb, var(--tcrn-color-line) 84%, transparent);
  border-radius: var(--tcrn-radius-surface);
  background: var(--tcrn-color-panel);
  padding: var(--tcrn-space-3h);
}

.tcrn-doc-knowledge-preview__panel {
  border: 1px solid var(--tcrn-color-line);
  border-radius: var(--tcrn-radius-control);
  background: color-mix(in srgb, var(--tcrn-color-panel) 90%, transparent);
  padding: var(--tcrn-space-3);
}

.tcrn-doc-demo-pager {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: auto;
}

.tcrn-doc-demo-pager a {
  display: grid;
  gap: var(--tcrn-space-1);
  min-width: 0;
  border: 1px solid var(--tcrn-color-line);
  border-radius: var(--tcrn-radius-control);
  background: color-mix(in srgb, var(--tcrn-color-panel) 92%, transparent);
  color: var(--tcrn-color-ink);
  padding: var(--tcrn-space-3);
  text-decoration: none;
  transition: background-color var(--tcrn-motion-fast), border-color var(--tcrn-motion-fast);
}
/* TCRN-DS-STORY-065: the demo's chapter pager answers hover and keyboard focus, as the
   documentation chapter pager does. */
.tcrn-doc-demo-pager a:hover {
  border-color: var(--tcrn-color-line-ctl);
  background: var(--tcrn-color-panel-2);
}
.tcrn-doc-demo-pager a:focus-visible {
  outline: 2px solid var(--tcrn-color-acc);
  outline-offset: 2px;
}

.tcrn-doc-demo-pager a:last-child {
  text-align: right;
}

.tcrn-doc-demo-pager span {
  color: var(--tcrn-color-ink-2);
  font-size: var(--tcrn-type-size-caption);
  font-weight: 700;
}

.alpha-overlay-demo {
  display: grid;
  gap: var(--tcrn-space-3);
}

.tcrn-doc-overlay-mode-matrix,
.tcrn-doc-overlay-static-modes {
  display: grid;
  gap: var(--tcrn-space-3);
  border: 1px solid var(--tcrn-color-line);
  border-radius: var(--tcrn-radius-surface);
  background: var(--tcrn-color-panel);
  padding: var(--tcrn-space-3);
}

.tcrn-doc-overlay-mode-matrix__intro {
  display: grid;
  gap: var(--tcrn-space-1h);
}

.tcrn-doc-overlay-mode-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--tcrn-space-2h);
}

.tcrn-doc-overlay-mode-card,
.tcrn-doc-overlay-static-card {
  display: grid;
  gap: var(--tcrn-space-2h);
  min-width: 0;
  border: 1px solid var(--tcrn-color-line);
  border-radius: var(--tcrn-radius-surface);
  background: var(--tcrn-color-panel-2);
  padding: var(--tcrn-space-3);
}

.tcrn-doc-overlay-mode-card {
  grid-template-columns: auto minmax(0, 1fr);
  align-items: start;
}

.tcrn-doc-overlay-mode-card > div {
  display: grid;
  gap: var(--tcrn-space-1h);
  min-width: 0;
}

.tcrn-doc-overlay-static-modes {
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
}

.tcrn-doc-dialog-spec-fixture {
  display: grid;
  gap: var(--tcrn-space-3);
  border: 1px solid var(--tcrn-color-line);
  border-radius: var(--tcrn-radius-surface);
  background: var(--tcrn-color-panel-2);
  padding: var(--tcrn-space-3);
}

.tcrn-doc-dialog-spec-fixture__header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--tcrn-space-3);
  align-items: start;
}

.tcrn-doc-dialog-spec-fixture__summary {
  min-width: 0;
}

.tcrn-doc-dialog-spec-fixture__summary {
  display: grid;
  gap: var(--tcrn-space-1h);
}

.tcrn-doc-dialog-spec-fixture__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--tcrn-space-2);
}

.tcrn-doc-dialog-spec-fixture [data-dialog-fixture-panel],
.tcrn-doc-dialog-spec-fixture [data-popover-fixture-panel] {
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

.tcrn-doc-dialog-spec-fixture [data-dialog-fixture-panel][data-overlay-transition-state="open"],
.tcrn-doc-dialog-spec-fixture [data-dialog-fixture-panel][data-overlay-transition-state="opening"],
.tcrn-doc-dialog-spec-fixture [data-popover-fixture-panel][data-overlay-transition-state="open"],
.tcrn-doc-dialog-spec-fixture [data-popover-fixture-panel][data-overlay-transition-state="opening"] {
  max-height: 720px;
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0) scale(1);
}

.tcrn-doc-dialog-spec-fixture [data-dialog-fixture-panel][hidden],
.tcrn-doc-dialog-spec-fixture [data-popover-fixture-panel][hidden] {
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

  .tcrn-doc-overlay-mode-grid,
  .tcrn-doc-overlay-static-modes {
    grid-template-columns: 1fr;
  }

  .tcrn-doc-package-nav-proof {
    grid-template-columns: 1fr;
  }

  .tcrn-doc-nav-component-preview .tcrn-product-switcher {
    width: 100%;
  }

  .tcrn-doc-demo-pager {
    grid-template-columns: 1fr;
  }

  .tcrn-doc-dialog-spec-fixture__header {
    grid-template-columns: 1fr;
  }

}

@media (prefers-reduced-motion: reduce) {
  .tcrn-doc-motion-demo__dot {
    animation-duration: var(--tcrn-motion-reduced-duration);
    animation-iteration-count: 1;
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

/* TCRN-DS-STORY-066: moved from alpha-styles (Track B only) into the shared demo layer so
   the real Storybook (Track A) gets the reference-page + bare-anchor styling too. */
/* Base style for BARE anchors in story bodies. Components style their own anchors, but an
   unclassed <a> in story content previously fell back to the UA default (pure blue, full
   underline, purple visited) — visually foreign to the token language. :where() keeps this at
   element-level specificity so it fills the UA gap without ever out-competing a component rule;
   anchors that carry a class are excluded entirely. */
.story-body :where(a:not([class])),
.alpha-story-card :where(a:not([class])) {
  color: var(--tcrn-color-acc);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.2em;
  text-decoration-color: color-mix(in srgb, var(--tcrn-color-acc) 35%, transparent);
  transition: text-decoration-color var(--tcrn-motion-fast), color var(--tcrn-motion-fast);
}
.story-body :where(a:not([class])):hover,
.alpha-story-card :where(a:not([class])):hover {
  text-decoration-color: var(--tcrn-color-acc);
}
.story-body :where(a:not([class])):focus-visible,
.alpha-story-card :where(a:not([class])):focus-visible {
  outline: none;
  box-shadow: var(--tcrn-focus-ring);
}

/* TCRN-DS-STORY-058: component API reference pages + the index links grid. */
.tcrn-doc-reference-index {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--tcrn-space-1);
}
.tcrn-doc-reference-index__item {
  margin: 0;
}
/* The index links are navigation TILES, not prose links: 100 underlines in a grid read as
   noise, so the rest state stays quiet (text-primary, no underline) and hover floats the
   quiet brand background + brand text. No press scale: the motion press-scale token has no G+
   successor and the G+ button family does not scale on press. */
.tcrn-doc-reference-index__item a {
  display: block;
  padding: var(--tcrn-space-0h) var(--tcrn-space-1);
  border-radius: var(--tcrn-radius-control);
  border: 1px solid transparent;
  color: var(--tcrn-color-ink);
  text-decoration: none;
  transition: background-color var(--tcrn-motion-fast), color var(--tcrn-motion-fast), border-color var(--tcrn-motion-fast);
}
.tcrn-doc-reference-index__item a:hover {
  background: var(--tcrn-color-acc-bg);
  color: var(--tcrn-color-acc);
  border-color: color-mix(in srgb, var(--tcrn-color-acc) 25%, transparent);
}
.tcrn-doc-reference-index__item a:focus-visible {
  outline: none;
  box-shadow: var(--tcrn-focus-ring);
}
.tcrn-doc-component-reference {
  display: flex;
  flex-direction: column;
  gap: var(--tcrn-space-1h);
  padding: var(--tcrn-space-3);
  border: 1px solid var(--tcrn-color-line);
  border-radius: var(--tcrn-radius-surface);
  background: var(--tcrn-color-panel);
  scroll-margin-top: var(--tcrn-anchor-scroll-offset);
}
.tcrn-doc-component-reference__meta,
.tcrn-doc-component-reference__facet,
.tcrn-doc-component-reference__empty {
  color: var(--tcrn-color-ink-2);
  margin: 0;
}
.tcrn-doc-reference-table-scroll {
  overflow-x: auto;
}
.tcrn-doc-reference-table {
  width: 100%;
  border-collapse: collapse;
}
.tcrn-doc-reference-table th,
.tcrn-doc-reference-table td {
  text-align: left;
  padding: var(--tcrn-space-1) var(--tcrn-space-1h);
  border-bottom: 1px solid var(--tcrn-color-line);
  vertical-align: top;
}
.tcrn-doc-reference-table th {
  color: var(--tcrn-color-ink-2);
}
.tcrn-doc-reference-table td code {
  overflow-wrap: anywhere;
}
`;
