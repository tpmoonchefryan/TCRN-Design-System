// Public site chrome, external brand icons, and long-form editorial document styles.
// Never use backticks inside the CSS template literal.

export const publicSiteCss = `
/* BrandIcon: external filled brand marks separate from the 38-icon stroke roster */
.tcrn-brand-icon {
  display: inline-block;
  flex: none;
  color: currentColor;
  fill: currentColor;
  stroke: none;
  vertical-align: middle;
}
:where(.tcrn-brand-icon:not([width])) {
  inline-size: var(--tcrn-icon-size-md);
}
:where(.tcrn-brand-icon:not([height])) {
  block-size: var(--tcrn-icon-size-md);
}

/* PublicSiteHeader: sticky 52px chrome bar with ProductLockup, links, and shell controls */
.tcrn-public-header {
  --tcrn-color-surface: var(--tcrn-color-bg);
  position: sticky;
  inset-block-start: 0;
  z-index: var(--tcrn-z-overlay);
  box-sizing: border-box;
  inline-size: 100%;
  min-block-size: var(--tcrn-shell-strip-h);
  display: flex;
  align-items: center;
  background-color: var(--tcrn-color-chrome);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-block-end: 1px solid var(--tcrn-color-line);
  color: var(--tcrn-color-ink);
  font-family: var(--tcrn-type-family-ui);
}
.tcrn-public-header__inner {
  box-sizing: border-box;
  inline-size: 100%;
  max-inline-size: 980px;
  margin-inline: auto;
  padding-inline: var(--tcrn-space-4);
  padding-block: var(--tcrn-space-1h);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--tcrn-space-3);
  flex-wrap: wrap;
}
.tcrn-public-header__brand {
  display: inline-flex;
  align-items: center;
  min-inline-size: 0;
  padding: var(--tcrn-space-1) var(--tcrn-space-1h);
  margin-inline-start: calc(var(--tcrn-space-1h) * -1);
  border-radius: var(--tcrn-radius-control);
  color: var(--tcrn-color-ink);
  text-decoration: none;
  transition: background-color var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease);
}
.tcrn-public-header__brand:hover {
  background-color: var(--tcrn-color-hover);
}
.tcrn-public-header__brand:focus-visible {
  outline: none;
  box-shadow: var(--tcrn-focus-ring);
}
.tcrn-public-header__nav {
  display: flex;
  align-items: center;
  gap: var(--tcrn-space-1);
  flex-wrap: wrap;
  min-inline-size: 0;
}
.tcrn-public-header__link {
  display: inline-flex;
  align-items: center;
  min-block-size: var(--tcrn-control-height-sm);
  padding-inline: var(--tcrn-space-2h);
  padding-block: var(--tcrn-space-1);
  border-radius: var(--tcrn-radius-sm);
  color: var(--tcrn-color-ink-2);
  font-size: var(--tcrn-type-size-control);
  line-height: var(--tcrn-type-line-control);
  font-weight: var(--tcrn-type-weight-regular);
  text-decoration: none;
  white-space: nowrap;
  transition: background-color var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease), color var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease);
}
.tcrn-public-header__link:hover {
  background-color: var(--tcrn-color-hover);
  color: var(--tcrn-color-ink);
}
.tcrn-public-header__link[aria-current="page"] {
  background-color: var(--tcrn-color-wash);
  color: var(--tcrn-color-ink);
  font-weight: var(--tcrn-type-weight-medium);
}
.tcrn-public-header__link:focus-visible {
  outline: none;
  box-shadow: var(--tcrn-focus-ring);
}
.tcrn-public-header__controls {
  display: inline-flex;
  align-items: center;
  gap: var(--tcrn-space-1h);
  flex: none;
}

/* PublicSiteFooter */
.tcrn-public-footer {
  --tcrn-color-surface: var(--tcrn-color-bg);
  box-sizing: border-box;
  inline-size: 100%;
  margin-block-start: calc(var(--tcrn-space-4) * 3);
  border-block-start: 1px solid var(--tcrn-color-line);
  color: var(--tcrn-color-ink-3);
  font-family: var(--tcrn-type-family-ui);
}
.tcrn-public-footer__inner {
  box-sizing: border-box;
  max-inline-size: 980px;
  margin-inline: auto;
  padding-inline: var(--tcrn-space-4);
  padding-block: calc(var(--tcrn-space-4) + var(--tcrn-space-2));
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--tcrn-space-3) var(--tcrn-space-4);
  flex-wrap: wrap;
}
.tcrn-public-footer__meta {
  font-size: var(--tcrn-type-size-meta);
  line-height: var(--tcrn-type-line-caption);
  color: var(--tcrn-color-ink-3);
}
.tcrn-public-footer__links {
  display: flex;
  align-items: center;
  gap: var(--tcrn-space-2) var(--tcrn-space-4);
  flex-wrap: wrap;
}
.tcrn-public-footer__link {
  display: inline-flex;
  align-items: center;
  gap: var(--tcrn-space-1h);
  border-radius: var(--tcrn-radius-stamp);
  color: var(--tcrn-color-ink-2);
  font-size: var(--tcrn-type-size-meta);
  line-height: var(--tcrn-type-line-caption);
  text-decoration: none;
  transition: color var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease);
}
.tcrn-public-footer__link:hover {
  color: var(--tcrn-color-ink);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.tcrn-public-footer__link:focus-visible {
  outline: none;
  box-shadow: var(--tcrn-focus-ring);
}
.tcrn-public-footer__extra {
  flex-basis: 100%;
  font-size: var(--tcrn-type-size-meta);
  line-height: var(--tcrn-type-line-caption);
  color: var(--tcrn-color-ink-3);
}

/* EditorialNote: left-ruled callout for scope, policy, and compliance notices */
.tcrn-editorial-note {
  box-sizing: border-box;
  margin: 0;
  padding-inline-start: var(--tcrn-space-3h);
  padding-block: var(--tcrn-space-0h);
  border-inline-start: 2px solid var(--tcrn-color-acc);
  color: var(--tcrn-color-ink-2);
  font-family: var(--tcrn-type-family-ui);
  font-size: var(--tcrn-type-size-reading);
  line-height: var(--tcrn-type-line-reading);
}
.tcrn-editorial-note--accent {
  border-inline-start-color: var(--tcrn-color-acc);
}
.tcrn-editorial-note--neutral {
  border-inline-start-color: var(--tcrn-color-line-3);
}
.tcrn-editorial-note strong {
  color: var(--tcrn-color-ink);
  font-weight: var(--tcrn-type-weight-strong);
}
.tcrn-editorial-note a {
  color: var(--tcrn-color-acc);
  text-decoration: underline;
  text-decoration-color: var(--tcrn-color-acc-ul);
  text-underline-offset: 3px;
}
.tcrn-editorial-note a:hover {
  color: var(--tcrn-color-acc-2);
}
.tcrn-editorial-note a:focus-visible {
  outline: none;
  border-radius: var(--tcrn-radius-stamp);
  box-shadow: var(--tcrn-focus-ring);
}

/* EditorialArticle: long-form paper sheet with wrapping serif headings and reading prose */
.tcrn-editorial-article {
  --tcrn-color-surface: var(--tcrn-color-panel);
  box-sizing: border-box;
  inline-size: min(100%, 808px);
  margin-inline: auto;
  padding-block: calc(var(--tcrn-space-4) * 2 + var(--tcrn-space-2));
  padding-inline: calc(var(--tcrn-space-4) * 2 + var(--tcrn-space-2));
  border-radius: var(--tcrn-radius-paper);
  background-color: var(--tcrn-color-panel);
  box-shadow: var(--tcrn-elevation-s1);
  color: var(--tcrn-color-ink);
  font-family: var(--tcrn-type-family-ui);
  display: flex;
  flex-direction: column;
  gap: calc(var(--tcrn-space-3h) * 2);
  min-inline-size: 0;
}
.tcrn-editorial-article__header {
  display: flex;
  flex-direction: column;
  gap: var(--tcrn-space-3);
  min-inline-size: 0;
}
.tcrn-editorial-article__back {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: var(--tcrn-space-1h);
  padding: var(--tcrn-space-1) var(--tcrn-space-2);
  margin-inline-start: calc(var(--tcrn-space-2) * -1);
  border-radius: var(--tcrn-radius-sm);
  color: var(--tcrn-color-ink-2);
  font-size: var(--tcrn-type-size-meta);
  line-height: var(--tcrn-type-line-caption);
  text-decoration: none;
  transition: background-color var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease), color var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease);
}
.tcrn-editorial-article__back:hover {
  background-color: var(--tcrn-color-hover);
  color: var(--tcrn-color-ink);
}
.tcrn-editorial-article__back:focus-visible {
  outline: none;
  box-shadow: var(--tcrn-focus-ring);
}
.tcrn-editorial-article__title {
  margin: 0;
  font-family: var(--tcrn-type-family-heading);
  font-size: var(--tcrn-type-size-page);
  line-height: var(--tcrn-type-line-heading-1);
  font-weight: var(--tcrn-type-weight-regular);
  letter-spacing: -0.015em;
  color: var(--tcrn-color-ink);
  overflow-wrap: anywhere;
}
.tcrn-editorial-article__meta {
  margin: 0;
  font-size: var(--tcrn-type-size-meta);
  line-height: var(--tcrn-type-line-caption);
  color: var(--tcrn-color-ink-3);
}
.tcrn-editorial-article__lead {
  margin: 0;
  font-size: var(--tcrn-type-size-reading);
  line-height: var(--tcrn-type-line-reading);
  color: var(--tcrn-color-ink-2);
}
.tcrn-editorial-article__divider {
  margin: 0;
}
.tcrn-editorial-article__body {
  display: flex;
  flex-direction: column;
  gap: calc(var(--tcrn-space-3h) * 2);
  min-inline-size: 0;
}
.tcrn-editorial-article__body > section {
  display: flex;
  flex-direction: column;
  gap: var(--tcrn-space-2h);
  min-inline-size: 0;
}
.tcrn-editorial-article__body h2 {
  margin: 0;
  font-family: var(--tcrn-type-family-heading);
  font-size: var(--tcrn-type-size-heading-3);
  line-height: var(--tcrn-type-line-heading-3);
  font-weight: var(--tcrn-type-weight-regular);
  letter-spacing: -0.008em;
  color: var(--tcrn-color-ink);
  overflow-wrap: anywhere;
}
.tcrn-editorial-article__body h3 {
  margin: 0;
  font-family: var(--tcrn-type-family-ui);
  font-size: var(--tcrn-type-size-reading);
  line-height: var(--tcrn-type-line-reading);
  font-weight: var(--tcrn-type-weight-strong);
  color: var(--tcrn-color-ink);
}
.tcrn-editorial-article__body p {
  margin: 0;
  font-size: var(--tcrn-type-size-reading);
  line-height: var(--tcrn-type-line-reading);
  color: var(--tcrn-color-ink-2);
}
.tcrn-editorial-article__body ul,
.tcrn-editorial-article__body ol {
  margin: 0;
  padding-inline-start: calc(var(--tcrn-space-4) + var(--tcrn-space-1));
  display: flex;
  flex-direction: column;
  gap: var(--tcrn-space-2);
  font-size: var(--tcrn-type-size-reading);
  line-height: var(--tcrn-type-line-reading);
  color: var(--tcrn-color-ink-2);
}
.tcrn-editorial-article__body strong {
  color: var(--tcrn-color-ink);
  font-weight: var(--tcrn-type-weight-strong);
}
.tcrn-editorial-article__body code {
  font-family: var(--tcrn-type-family-mono);
  font-size: var(--tcrn-type-size-meta);
  background-color: var(--tcrn-color-wash);
  color: var(--tcrn-color-ink);
  padding: var(--tcrn-space-0h) var(--tcrn-space-1h);
  border-radius: var(--tcrn-radius-stamp);
}
.tcrn-editorial-article__body a {
  color: var(--tcrn-color-acc);
  text-decoration: underline;
  text-decoration-color: var(--tcrn-color-acc-ul);
  text-underline-offset: 3px;
}
.tcrn-editorial-article__body a:hover {
  color: var(--tcrn-color-acc-2);
}
.tcrn-editorial-article__body a:focus-visible {
  outline: none;
  border-radius: var(--tcrn-radius-stamp);
  box-shadow: var(--tcrn-focus-ring);
}
.tcrn-editorial-article__related {
  display: flex;
  align-items: center;
  gap: var(--tcrn-space-2);
  flex-wrap: wrap;
}
.tcrn-editorial-article__related-link {
  display: inline-flex;
  align-items: center;
  gap: var(--tcrn-space-1h);
  min-block-size: var(--tcrn-control-height-sm);
  padding-inline: var(--tcrn-space-2h);
  padding-block: var(--tcrn-space-1);
  border-radius: var(--tcrn-radius-control);
  background-color: var(--tcrn-color-panel-2);
  box-shadow: inset 0 0 0 1px var(--tcrn-color-line-2);
  color: var(--tcrn-color-ink);
  font-size: var(--tcrn-type-size-control-sm);
  line-height: var(--tcrn-type-line-caption);
  font-weight: var(--tcrn-type-weight-medium);
  text-decoration: none;
  transition: background-color var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease), box-shadow var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease);
}
.tcrn-editorial-article__related-link:hover {
  background-color: var(--tcrn-color-wash);
}
.tcrn-editorial-article__related-link:focus-visible {
  outline: none;
  box-shadow: var(--tcrn-focus-ring);
}

@media (max-width: 680px) {
  .tcrn-editorial-article {
    padding-block: calc(var(--tcrn-space-4) + var(--tcrn-space-2));
    padding-inline: var(--tcrn-space-4);
  }
  .tcrn-editorial-article__title {
    font-size: var(--tcrn-type-size-heading-2);
    line-height: var(--tcrn-type-line-heading-2);
  }
}

@media (prefers-reduced-motion: reduce) {
  .tcrn-public-header__brand,
  .tcrn-public-header__link,
  .tcrn-public-footer__link,
  .tcrn-editorial-article__back,
  .tcrn-editorial-article__related-link {
    transition: none;
  }
}
`;
