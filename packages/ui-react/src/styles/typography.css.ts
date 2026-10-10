// Typography segments of tcrnComponentCss: every rule whose selector subject is a text,
// heading or highlight class, including the ones scoped under another component.
//
// styles/index.ts joins the segments of all six family modules in the stylesheet's cascade
// order, so where a segment sits in the sheet is decided there; this module owns what the
// segment says. A backtick ends a segment early, so the CSS comments in it never use one
// (scripts/css-template-integrity-proof.mjs checks every segment).
//
// The type scale itself (heading levels, Text size, tone and variant, numeral, caps, mono, the
// link and the highlight mark) is the generated segment styles/generated/typography.scale.ts,
// written from docs/design/gplus-2026-10/contract/typography.json by
// scripts/contract-generate.mjs. It is joined into the first segment between the family base
// rule it refines and the family rules that sit on top of it; change the scale in the contract
// and regenerate, never here.

import { typographyScaleCss } from "./generated/typography.scale.js";

export const typographyCss01 = `
/* Heading base: the generated levels set size, line, weight, tracking and the single-line
   truncation; min-width 0 lets a heading shrink inside a flex or grid track so the ellipsis
   can appear instead of the track growing. */
.tcrn-heading {
  min-width: 0;
  margin: 0;
  letter-spacing: 0;
}` + typographyScaleCss + `
/* The scale zeroes the text margin. Paragraph text keeps the top margin it has always had, so
   a Text given no props looks as before and text under a heading sits no closer to it than its
   own lines sit to each other. The single-line variants are placed by their containers. */
.tcrn-text {
  margin: var(--tcrn-space-2) 0 0;
}
.tcrn-text.tcrn-text--numeral,
.tcrn-text.tcrn-text--caps {
  margin: 0;
}
/* Caps is a single-line label role: a label that does not fit ends in an ellipsis, and the
   component repeats its text as a title. */
.tcrn-text.tcrn-text--caps {
  overflow: hidden;
  text-overflow: ellipsis;
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
