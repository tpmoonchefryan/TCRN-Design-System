// Brand segments of tcrnComponentCss: every rule whose selector subject is a brand,
// product-logo, product-lockup or shell-brand class.
//
// styles/index.ts joins the segments of all six family modules in the stylesheet's cascade
// order, so where a segment sits in the sheet is decided there; this module owns what the
// segment says. A backtick ends a segment early, so the CSS comments in it never use one
// (scripts/css-template-integrity-proof.mjs checks every segment).
//
// G+ brand rules (STORY-127, boards V2-B1-Brand and V2-B2-Logos): the mark comes in four
// sizes set by its container (side rail 22, lockup 28, product logo 38, about page 56 by
// overriding the variable); TCRN is ink and a TCRN product suffix is the product's deep
// colour from the brand-suffix tokens, the same in both themes; Einzbern and Mana
// Orchestrate are whole names in Source Serif 4 with the byline. Gradient text is retired.
// The tier variables below are brand locals, registered in scripts/token-extension-proof.mjs.

export const brandCss01 = `
.tcrn-brand-lockup,
.tcrn-shell-brand-lockup,
.tcrn-product-logo {
  --tcrn-brand-mark-size: 38px;
  --tcrn-brand-line-one-size: var(--tcrn-type-size-reading);
  --tcrn-brand-line-one-height: 18px;
  --tcrn-brand-line-one-base-weight: var(--tcrn-type-weight-medium);
  --tcrn-brand-line-two-size: 11.5px;
  --tcrn-brand-line-two-height: var(--tcrn-type-line-caption);
  display: inline-flex;
  align-items: center;
  min-width: 0;
  gap: var(--tcrn-space-3);
  font-family: var(--tcrn-type-family-ui);
}
.tcrn-brand-lockup {
  --tcrn-brand-mark-size: 28px;
  --tcrn-brand-line-one-size: var(--tcrn-type-size-ui);
  --tcrn-brand-line-two-size: 10.5px;
  --tcrn-brand-line-two-height: 14px;
  gap: var(--tcrn-space-2h);
}
.tcrn-brand-mark {
  display: block;
  inline-size: var(--tcrn-brand-mark-size);
  block-size: var(--tcrn-brand-mark-size);
  flex: 0 0 auto;
  filter: var(--tcrn-brand-mark-filter, none);
}
.tcrn-brand-wordmark {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: baseline;
  min-width: 0;
  gap: var(--tcrn-space-0h) var(--tcrn-space-1h);
  color: var(--tcrn-color-ink);
  font-size: 16px;
  font-weight: var(--tcrn-type-weight-medium);
  line-height: 20px;
  overflow-wrap: anywhere;
}
.tcrn-brand-wordmark__base {
  flex: 0 0 auto;
  letter-spacing: 0;
  font-weight: var(--tcrn-type-weight-medium);
  white-space: nowrap;
}
.tcrn-brand-wordmark__suffix {
  flex: 0 1 auto;
  min-width: 0;
  color: var(--tcrn-color-ink);
  font-size: inherit;
  font-weight: var(--tcrn-type-weight-strong);
}
.tcrn-brand-wordmark__suffix--aos {
  color: var(--tcrn-brand-accent-aos);
}
.tcrn-brand-wordmark__suffix--tms {
  color: var(--tcrn-brand-suffix-tms);
}
.tcrn-brand-wordmark__suffix--design-system {
  color: var(--tcrn-brand-suffix-design-system);
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
  color: var(--tcrn-color-ink);
  font-size: var(--tcrn-brand-line-one-size);
  font-weight: var(--tcrn-type-weight-medium);
  line-height: var(--tcrn-brand-line-one-height);
  white-space: nowrap;
}
.tcrn-product-logo__line-one-base {
  flex: 0 0 auto;
  font-weight: var(--tcrn-brand-line-one-base-weight);
  white-space: nowrap;
}
.tcrn-product-logo__line-one-suffix {
  flex: 0 1 auto;
  min-width: 0;
  font-style: normal;
  font-weight: var(--tcrn-type-weight-strong);
  white-space: nowrap;
}
.tcrn-product-logo--stacked-suffix .tcrn-product-logo__line-one {
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
  line-height: 16px;
  white-space: normal;
}
.tcrn-product-logo--serif .tcrn-product-logo__line-one {
  font-family: var(--tcrn-type-family-serif);
  letter-spacing: 0.03em;
}
.tcrn-product-logo--serif .tcrn-product-logo__line-one-base {
  font-size: 1.08em;
  font-weight: var(--tcrn-type-weight-regular);
}
.tcrn-shell-brand-lockup__caption,
.tcrn-product-logo__line-two {
  color: var(--tcrn-color-ink-3);
  font-size: var(--tcrn-brand-line-two-size);
  font-weight: var(--tcrn-type-weight-medium);
  line-height: var(--tcrn-brand-line-two-height);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tcrn-product-logo__byline {
  color: var(--tcrn-color-ink-3);
  font-size: 10px;
  font-weight: var(--tcrn-type-weight-medium);
  letter-spacing: var(--tcrn-type-tracking-caps);
  line-height: 14px;
  text-transform: uppercase;
  white-space: nowrap;
}
/* ProductLockup first line (STORY-145, TCRN-DS-SUB-127; MIN-20261013-SHELL D2): the second of
   the three renditions, the lockup's first line alone. It is the Brand board's section E
   writing unchanged: at the lockup scale a 44 mark and a 16/600 line 14 from it, at the rail
   scale a 22 mark and a 12.5/600 line 10 from it; Einzbern and Mana Orchestrate keep their
   serif whole names. The flex row centres mark and line (align-items center from the lockup
   rule); nothing nudges the line, so no margin, offset, one-sided padding or line-height trim
   here. Written as the brand button's wordmark is (TCRN-DS-SUB-143), each on its own: the word
   takes its content width and may run up to 1 (half of space-0h) past its line, so a word only a
   fraction too wide is drawn whole and a longer one ends in an ellipsis under its title; the
   suffix's line box (Hanken Grotesk ascends 1 and descends 0.303 em) is taller than the line,
   so the word has space-0h above and below it, the same on both sides, and the clipping word
   holds the suffix without moving a glyph. */
.tcrn-brand-lockup--line {
  --tcrn-brand-mark-size: 44px;
  --tcrn-brand-line-one-size: 16px;
  --tcrn-brand-line-one-height: var(--tcrn-type-line-ui);
  gap: var(--tcrn-space-3h);
  color: var(--tcrn-color-ink);
}
.tcrn-brand-lockup--line-rail {
  --tcrn-brand-mark-size: 22px;
  --tcrn-brand-line-one-size: 12.5px;
  --tcrn-brand-line-one-height: var(--tcrn-type-line-control);
  gap: var(--tcrn-space-2h);
}
.tcrn-brand-lockup__line {
  display: block;
  min-width: 0;
}
.tcrn-brand-lockup__word {
  display: block;
  inline-size: max-content;
  max-inline-size: calc(100% + var(--tcrn-space-0h) / 2);
  padding-block: var(--tcrn-space-0h);
  overflow: hidden;
  font-size: var(--tcrn-brand-line-one-size);
  font-weight: var(--tcrn-type-weight-strong);
  line-height: var(--tcrn-brand-line-one-height);
  letter-spacing: -0.005em;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tcrn-brand-lockup--line-rail .tcrn-brand-lockup__word {
  letter-spacing: 0;
}
.tcrn-brand-lockup__suffix {
  font-style: normal;
}
.tcrn-brand-lockup--line-serif .tcrn-brand-lockup__word {
  font-family: var(--tcrn-type-family-serif);
  font-size: 18px;
  font-weight: var(--tcrn-type-weight-regular);
  letter-spacing: 0.03em;
}
.tcrn-brand-lockup--line-rail.tcrn-brand-lockup--line-serif .tcrn-brand-lockup__word {
  font-size: 13.5px;
  letter-spacing: 0.02em;
}`;

export const brandCss02 = `
.tcrn-product-shell__sidebar .tcrn-brand-wordmark__suffix--aos {
  color: var(--tcrn-color-brand-primary);
}
/* The side-rail tier (Brand board section E, .lkr): mark 22, wordmark 12.5/600, tagline 10.5,
   10 between mark and copy, no byline. It is written here once (TCRN-DS-SUB-144): a lockup in
   the product shell takes it, and so does any lockup marked as the side-rail lockup with
   data-lockup="lkr" (C-6), such as the full menu's bottom bar wherever the menu is rendered. */
.tcrn-product-shell .tcrn-shell-brand-lockup,
.tcrn-shell-brand-lockup[data-lockup="lkr"] {
  --tcrn-brand-mark-size: 22px;
  --tcrn-brand-line-one-size: 12.5px;
  --tcrn-brand-line-one-height: 16px;
  --tcrn-brand-line-one-base-weight: var(--tcrn-type-weight-strong);
  --tcrn-brand-line-two-size: 10.5px;
  --tcrn-brand-line-two-height: 14px;
  gap: var(--tcrn-space-2h);
}
.tcrn-product-shell .tcrn-product-logo__byline,
.tcrn-shell-brand-lockup[data-lockup="lkr"] .tcrn-product-logo__byline {
  display: none;
}`;

export const brandCss03 = `
.tcrn-product-shell[data-product-shell-collapsed="true"] .tcrn-shell-brand-lockup__copy,
.tcrn-product-shell[data-product-shell-collapsed="true"] .tcrn-product-logo__copy {
  display: none;
}`;

export const brandCss04 = `
@media (max-width: 760px) {
  .tcrn-shell-brand-lockup__caption,
  .tcrn-product-logo__line-two {
    white-space: normal;
  }
}`;
