// Typography segments of tcrnComponentCss: every rule whose selector subject is a text,
// heading or highlight class, including the ones scoped under another component.
//
// styles/index.ts joins the segments of all six family modules in the stylesheet's cascade
// order, so where a segment sits in the sheet is decided there; this module owns what the
// segment says. A backtick ends a segment early, so the CSS comments in it never use one
// (scripts/css-template-integrity-proof.mjs checks every segment).

export const typographyCss01 = `
.tcrn-heading {
  margin: 0;
  letter-spacing: 0;
}
.tcrn-heading--1 {
  font-size: clamp(28px, 3vw, 44px);
  line-height: 1.04;
}
.tcrn-heading--2 {
  font-size: var(--tcrn-type-size-heading-2);
}
.tcrn-heading--3 {
  font-size: var(--tcrn-type-size-heading-3);
}
.tcrn-heading--4 {
  font-size: var(--tcrn-type-size-ui);
  line-height: var(--tcrn-type-line-reading);
}
.tcrn-text {
  margin: var(--tcrn-space-2) 0 0;
  color: var(--tcrn-color-text-secondary);
}`;

export const typographyCss02 = `
.tcrn-readback-panel > .tcrn-heading + * {
  margin-top: 0;
}`;

export const typographyCss03 = `
.tcrn-page-header__title .tcrn-heading,
.tcrn-page-header__title .tcrn-text {
  margin: 0;
}`;

export const typographyCss04 = `
.tcrn-record-row__summary .tcrn-text {
  margin: 0;
}`;

export const typographyCss05 = `
.tcrn-row-group__head .tcrn-heading,
.tcrn-row-group__head .tcrn-text {
  margin: 0;
}`;

export const typographyCss06 = `
.tcrn-inline-create .tcrn-text {
  margin: 0;
}`;

export const typographyCss07 = `
.tcrn-lane-board__lane-head > .tcrn-heading {
  min-width: 0;
  margin-right: auto;
}`;

export const typographyCss08 = `
.tcrn-lane-board__card .tcrn-text {
  margin: 0;
}`;

export const typographyCss09 = `
.tcrn-relation-graph__node .tcrn-heading,
.tcrn-relation-graph__node .tcrn-text {
  margin: 0;
}`;

export const typographyCss10 = `
.tcrn-activity-feed__item .tcrn-text,
.tcrn-detail-layout__head .tcrn-heading,
.tcrn-detail-layout__head .tcrn-text {
  margin: 0;
}`;

export const typographyCss11 = `
.tcrn-document-canvas__head .tcrn-heading,
.tcrn-document-canvas__head .tcrn-text,
.tcrn-document-canvas__section .tcrn-heading,
.tcrn-document-canvas__section .tcrn-text,
.tcrn-inline-comment-list__item .tcrn-text,
.tcrn-template-gallery__card .tcrn-heading,
.tcrn-template-gallery__card .tcrn-text,
.tcrn-search-result-list__item .tcrn-text,
.tcrn-toc-rail .tcrn-heading {
  margin: 0;
}`;

export const typographyCss12 = `

/* Typography highlight */
.tcrn-highlight-text {
  display: inline;
}

.tcrn-highlight-mark {
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-color-brand-primary-bg);
  color: var(--tcrn-color-text-primary);
  font-weight: var(--tcrn-type-weight-medium);
  padding: 0 var(--tcrn-space-0h);
}`;
