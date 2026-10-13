import { createCssVariables, createThemeCssVariables } from "@tcrn/ui-tokens";
import { demoStoryCss } from "./story-demo-styles.js";

// The static documentation sheet. Since TCRN-DS-SUB-131 the documentation pages wear the package
// ProductShell in its top-band state and the shell's rules come with the package sheet, so this
// sheet holds no shell: no header, rail, rail head, rail toggle or navigation of its own. What is
// left is the documentation's own layout inside the paper (the page column, 1040 at most and
// centred, with the TocRail beside it), its typography and the demo layer.
export const alphaStoryCss = `${createCssVariables()}${createThemeCssVariables("dark")}
* { box-sizing: border-box; }
html {
  /* The shell scrolls its paper; an anchor lands this far under the paper's top edge. */
  --tcrn-anchor-scroll-offset: var(--tcrn-space-3h);
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
.tcrn-doc-static-section--category-index {
  display: grid;
  gap: var(--tcrn-space-3h);
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
[data-doc-shell][data-storybook-locale="en"],
[data-doc-shell][data-storybook-locale="fr"] {
  --tcrn-type-family-ui: var(--tcrn-type-family-latin);
}
[data-doc-shell][data-storybook-locale="zh-CN"] {
  --tcrn-type-family-ui: var(--tcrn-type-family-zh-cn);
}
[data-doc-shell][data-storybook-locale="ja"] {
  --tcrn-type-family-ui: var(--tcrn-type-family-ja);
}
[data-doc-shell][data-storybook-locale="ko"] {
  --tcrn-type-family-ui: var(--tcrn-type-family-ko);
}
/* The page has no client React: the full menu and the avatar menu are carried in the markup and
   opened by the page script, as ProductShell mounts them. Closed, they are not rendered at all. */
[data-doc-shell] [data-shell-menu][hidden],
[data-doc-shell] [data-panel="account"][hidden] {
  display: none;
}

/* The page inside the paper: the body column is --tcrn-layout-content-max-w (1040) at most and
   centred in the paper; the TocRail (this page's contents) sits in the paper beside it and stays in
   view while the paper scrolls. Narrower, the contents lead the column. */
.tcrn-doc-page {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, var(--tcrn-layout-content-max-w)) minmax(0, 1fr);
  column-gap: var(--tcrn-space-4);
  row-gap: var(--tcrn-space-4h);
  align-items: start;
  min-inline-size: 0;
}
.tcrn-doc-page__body {
  grid-column: 2;
  grid-row: 1;
  display: grid;
  gap: var(--tcrn-space-4h);
  align-content: start;
  min-inline-size: 0;
}
.tcrn-doc-page__toc {
  grid-column: 3;
  grid-row: 1;
  position: sticky;
  top: 0;
  min-inline-size: 0;
}
@media (max-width: 1279px) {
  .tcrn-doc-page {
    grid-template-columns: minmax(0, var(--tcrn-layout-content-max-w));
    justify-content: center;
  }
  .tcrn-doc-page__toc {
    grid-column: 1;
    grid-row: 1;
    position: static;
  }
  .tcrn-doc-page__body {
    grid-column: 1;
    grid-row: 2;
  }
}

/* The governed-section boundary under the page header: its eyebrow and the three claims. */
.tcrn-doc-page-head {
  display: grid;
  gap: var(--tcrn-space-1h);
  min-width: 0;
  border-bottom: 1px solid var(--tcrn-color-border-subtle);
  padding: 0 0 var(--tcrn-space-4);
}
.tcrn-doc-page-head__eyebrow {
  color: var(--tcrn-color-focus-ring);
  font-size: var(--tcrn-type-size-meta);
  font-weight: 800;
  letter-spacing: 0;
}
.tcrn-doc-boundary-strip {
  display: flex;
  flex-wrap: wrap;
  gap: var(--tcrn-space-1h);
  min-width: 0;
}
.tcrn-doc-boundary-strip span {
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-color-surface-muted);
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-caption);
  font-weight: 700;
  line-height: 1.2;
  padding: var(--tcrn-space-0h) var(--tcrn-space-1h);
}
.tcrn-doc-eyebrow {
  color: var(--tcrn-color-focus-ring);
  font-size: var(--tcrn-type-size-meta);
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
}
.tcrn-doc-claim {
  color: var(--tcrn-color-text-secondary);
}
/* Progressive disclosure: a page opens as a compact index — story title, one-line
   locator, ledger +/- notation — and each story reveals on demand. Hash navigation
   expands its target, so deep links keep working. Expansion is instant: disclosure
   is a reading act, not a scene change. */
article[data-story-collapsed="true"] > .story-body {
  display: none;
}
.tcrn-doc-story-disclosure__heading {
  margin: 0;
}
.tcrn-doc-story-disclosure {
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
.tcrn-doc-story-disclosure__chevron {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--tcrn-color-text-secondary);
}
.tcrn-doc-story-disclosure__chevron svg[data-icon-name] {
  width: 16px;
  height: 16px;
  transition: transform var(--tcrn-motion-standard);
}
.tcrn-doc-story-disclosure__title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tcrn-doc-story-disclosure__chevron-svg {
  display: block;
  inline-size: 16px;
  block-size: 16px;
}
.tcrn-doc-story-disclosure[aria-expanded="true"] .tcrn-doc-story-disclosure__chevron svg[data-icon-name] {
  transform: rotate(90deg);
}
.tcrn-doc-story-disclosure:hover {
  color: var(--tcrn-color-brand-primary);
}
article[data-story-collapsed="false"] > .tcrn-doc-story-disclosure__heading {
  box-shadow: inset 3px 0 0 var(--tcrn-color-brand-primary);
  padding-left: var(--tcrn-space-2h);
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
.tcrn-doc-chapter-pager__link--previous {
  text-align: left;
  background: var(--tcrn-color-surface-panel);
}
.tcrn-doc-chapter-pager__link--previous .tcrn-doc-chapter-pager__icon {
  justify-self: start;
  color: var(--tcrn-color-brand-primary);
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
.tcrn-doc-component-reference__intro {
  margin: 0;
  color: var(--tcrn-color-text-secondary);
  line-height: var(--tcrn-type-line-body);
}
.tcrn-doc-category-index {
  display: grid;
  gap: var(--tcrn-space-2h);
  margin: 0;
  padding: 0;
  list-style: none;
}
.tcrn-doc-category-index__category {
  display: grid;
  gap: var(--tcrn-space-1h);
  min-width: 0;
  padding: var(--tcrn-space-3);
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  background: var(--tcrn-color-surface-panel);
}
.tcrn-doc-category-index__link {
  display: grid;
  grid-template-columns: minmax(0, 1fr) max-content;
  gap: var(--tcrn-space-2);
  align-items: center;
  color: var(--tcrn-color-brand-primary);
  font-weight: var(--tcrn-type-weight-strong);
  text-decoration: none;
}
.tcrn-doc-category-index__link:hover,
.tcrn-doc-category-index__link:focus-visible {
  color: var(--tcrn-color-text-primary);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: var(--tcrn-space-0h);
}
.tcrn-doc-category-index__label,
.tcrn-doc-category-index__story {
  min-width: 0;
  overflow-wrap: anywhere;
}
.tcrn-doc-category-index__count {
  display: inline-flex;
  min-inline-size: var(--tcrn-space-4h);
  justify-content: center;
  padding: var(--tcrn-space-0h) var(--tcrn-space-1);
  border-radius: var(--tcrn-radius-pill);
  background: var(--tcrn-color-surface-muted);
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-meta);
}
.tcrn-doc-category-index__stories {
  display: grid;
  gap: var(--tcrn-space-1);
  margin: 0;
  padding-inline-start: var(--tcrn-space-3);
  color: var(--tcrn-color-text-secondary);
}
.tcrn-doc-category-index__story {
  color: var(--tcrn-color-text-secondary);
  text-decoration: none;
}
.tcrn-doc-category-index__story:hover,
.tcrn-doc-category-index__story:focus-visible {
  color: var(--tcrn-color-brand-primary);
  text-decoration: underline;
  text-underline-offset: var(--tcrn-space-0h);
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
.tcrn-doc-chapter-pager :focus-visible {
  outline: 2px solid var(--tcrn-color-focus-ring);
  outline-offset: 2px;
  box-shadow: var(--tcrn-elevation-focus);
}
.story-body {
  display: grid;
  gap: var(--tcrn-space-3);
  min-width: 0;
}
${demoStoryCss}

.tcrn-doc-brand-system {
  display: grid;
  grid-template-columns: minmax(180px, 240px) minmax(0, 1fr);
  gap: var(--tcrn-space-4h);
  align-items: center;
  min-width: 0;
}
.tcrn-doc-brand-system__symbol {
  display: grid;
  place-items: center;
  border-radius: calc(var(--tcrn-radius-surface) + 4px);
  background: var(--tcrn-color-surface-muted);
  padding: var(--tcrn-space-5);
}
.tcrn-doc-brand-system__copy {
  display: grid;
  gap: var(--tcrn-space-2h);
  min-width: 0;
}
.tcrn-doc-brand-system__copy h3,
.tcrn-doc-brand-system__copy p {
  margin: 0;
}
.tcrn-doc-brand-system {
  --tcrn-brand-mark-size: min(100%, 220px);
}
.tcrn-doc-brand-lockups {
  display: grid;
  gap: var(--tcrn-space-2h);
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  min-width: 0;
}

/* The ProductShell example opens its search results to show the result state. The doc container
   keeps that list in the shell's flow, so it pushes the page down instead of painting over the
   heading and first paragraph. The shell-fidelity guard registers its position and inset. */
.tcrn-doc-product-shell-search--static-display[data-search-expanded="true"] .tcrn-product-shell-search__results {
  position: static;
  inset: auto;
  width: 100%;
  margin-block-start: var(--tcrn-space-2);
}

/* KeyValueList geometry is package-owned, including inside nested inspectors. */

html[data-tcrn-theme="dark"] .tcrn-doc-overlay-mode-card,
html[data-tcrn-theme="dark"] .tcrn-doc-overlay-static-card {
  border-color: color-mix(in srgb, var(--tcrn-color-border-strong) 62%, transparent);
  background: color-mix(in srgb, var(--tcrn-color-surface-muted) 74%, var(--tcrn-color-surface-panel));
}

html[data-tcrn-theme="dark"] .tcrn-doc-dialog-spec-fixture {
  border-color: color-mix(in srgb, var(--tcrn-color-border-strong) 58%, transparent);
  background: var(--tcrn-color-surface-muted);
}

@media (max-width: 760px) {
  .tcrn-doc-chapter-pager {
    grid-template-columns: 1fr;
  }
  .tcrn-doc-brand-system {
    grid-template-columns: 1fr;
  }
}

`;
