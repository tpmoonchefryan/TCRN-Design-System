// Brand segments of tcrnComponentCss: every rule whose selector subject is a brand,
// product-logo, product-lockup or shell-brand class.
//
// styles/index.ts joins the segments of all six family modules in the stylesheet's cascade
// order, so where a segment sits in the sheet is decided there; this module owns what the
// segment says. A backtick ends a segment early, so the CSS comments in it never use one
// (scripts/css-template-integrity-proof.mjs checks every segment).

export const brandCss01 = `
.tcrn-brand-lockup,
.tcrn-shell-brand-lockup,
.tcrn-product-logo {
  --tcrn-brand-mark-size: 38px;
  display: inline-flex;
  align-items: center;
  min-width: 0;
  gap: var(--tcrn-space-3);
}
.tcrn-brand-mark {
  display: block;
  inline-size: var(--tcrn-brand-mark-size);
  block-size: var(--tcrn-brand-mark-size);
  flex: 0 0 auto;
  filter: var(--tcrn-brand-mark-filter, none);
  transition:
    inline-size var(--tcrn-motion-emphasis),
    block-size var(--tcrn-motion-emphasis),
    filter var(--tcrn-motion-standard);
}
.tcrn-brand-wordmark {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: baseline;
  min-width: 0;
  gap: var(--tcrn-space-0h) var(--tcrn-space-2);
  color: var(--tcrn-color-text-primary);
  font-size: var(--tcrn-type-size-section);
  font-weight: var(--tcrn-type-weight-regular);
  line-height: var(--tcrn-type-line-section);
  overflow-wrap: anywhere;
}
.tcrn-brand-wordmark__base {
  flex: 0 0 auto;
  letter-spacing: 0;
  font-weight: var(--tcrn-type-weight-regular);
  white-space: nowrap;
}
.tcrn-brand-wordmark__suffix {
  flex: 0 1 auto;
  min-width: 0;
  color: var(--tcrn-color-brand-secondary-readable);
  font-size: inherit;
  font-weight: var(--tcrn-type-weight-strong);
}
.tcrn-brand-wordmark__suffix--aos {
  color: var(--tcrn-brand-accent-aos);
}
.tcrn-brand-wordmark__suffix--tms {
  color: var(--tcrn-brand-accent-tms);
}
.tcrn-brand-wordmark__suffix--workflow {
  color: var(--tcrn-brand-accent-workflow);
}
.tcrn-brand-wordmark__suffix--design-system {
  background: linear-gradient(
    105deg,
    var(--tcrn-brand-accent-design-system-1) 0%,
    var(--tcrn-brand-accent-design-system-2) 31%,
    var(--tcrn-brand-accent-design-system-3) 62%,
    var(--tcrn-brand-accent-design-system-4) 100%
  );
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.tcrn-brand-lockup--long-name .tcrn-brand-wordmark {
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
}
.tcrn-shell-brand-lockup__copy,
.tcrn-product-logo__copy {
  display: grid;
  min-width: 0;
  gap: var(--tcrn-space-0h);
}
.tcrn-product-logo__line-one {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--tcrn-space-0h) var(--tcrn-space-1);
  color: var(--tcrn-color-text-primary);
  font-size: var(--tcrn-type-size-ui);
  font-weight: var(--tcrn-type-weight-regular);
  line-height: var(--tcrn-type-line-ui);
  white-space: nowrap;
}
.tcrn-product-logo__line-one-base {
  flex: 0 0 auto;
  font-weight: var(--tcrn-type-weight-regular);
  white-space: nowrap;
}
.tcrn-product-logo__line-one-suffix {
  flex: 0 1 auto;
  min-width: 0;
  font-weight: var(--tcrn-type-weight-strong);
  white-space: nowrap;
}
.tcrn-product-logo--stacked-suffix .tcrn-product-logo__line-one {
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
  white-space: normal;
}
.tcrn-shell-brand-lockup__caption,
.tcrn-product-logo__line-two {
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-meta);
  font-weight: var(--tcrn-type-weight-strong);
  line-height: var(--tcrn-type-line-caption);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}`;

export const brandCss02 = `
.tcrn-product-shell__sidebar .tcrn-brand-wordmark__suffix--aos {
  color: var(--tcrn-color-brand-primary);
}`;

export const brandCss03 = `
.tcrn-product-shell[data-product-shell-collapsed="true"] .tcrn-shell-brand-lockup__copy,
.tcrn-product-shell[data-product-shell-collapsed="true"] .tcrn-product-logo__copy {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}`;

export const brandCss04 = `
@media (max-width: 760px) {
  .tcrn-shell-brand-lockup__caption,
  .tcrn-product-logo__line-two {
    white-space: normal;
  }
}`;
