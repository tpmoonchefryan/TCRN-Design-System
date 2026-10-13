// Shell segments of tcrnComponentCss: the top-band shell parts (TCRN-DS-INIT-016, C-8). Their
// selectors start with .tcrn-shell-; the ProductShell root keeps .tcrn-product-shell. Each part
// of the top band adds its rules here in turn: the brand button (TCRN-DS-SUB-114), the pinned
// items, the full menu, the drop-downs and the ProductShell top-band state.
//
// styles/index.ts joins this module after the family modules, so a rule here comes later in the
// sheet than the rules of the families the shell parts use. A backtick ends a segment early, so
// the CSS comments in it never use one (scripts/css-template-integrity-proof.mjs checks every
// segment).
//
// The rules follow the state-pair grammar: the part's base rule paints with the live pair
// (--tcrn-pair-fill, --tcrn-pair-ink, --tcrn-pair-edge) and declares the pair of every state;
// a state rule is a :where() rule at the specificity of the base class, switches the live pair
// and writes no colour. Geometry comes from the shell tokens of @tcrn/ui-tokens (07b board,
// section F); the brand sizes are the brand side-rail tier of brand.css.ts (Brand board,
// section E: mark 22, wordmark 12.5 at 600), and geometry does not change with the theme.

// The brand button (TCRN-DS-SUB-114; 07a board, section 1 and section A). Second version:
// mark, wordmark and toggle on a --tcrn-shell-brand-w by --tcrn-shell-brand-h box with a 6 inset
// and 10 between the cells; the first version drops the wordmark and is as wide as its content.
// Idle it has no fill and no edge; hover and open take the 3.5% ink wash (--tcrn-color-hover).
// The mark and the wordmark are centred by the flex line alone: no line-height nudge, no
// optical shift, so the wordmark's ink midline is the mark's midline.
export const shellCss01 = `
.tcrn-shell-brand {
  --tcrn-pair-fill: var(--tcrn-pair-fill-d);
  --tcrn-pair-ink: var(--tcrn-pair-ink-d);
  --tcrn-pair-edge: var(--tcrn-pair-edge-d);
  --tcrn-pair-fill-d: transparent;
  --tcrn-pair-ink-d: var(--tcrn-color-ink);
  --tcrn-pair-edge-d: 0 0 #0000;
  --tcrn-pair-fill-h: var(--tcrn-color-hover);
  --tcrn-pair-ink-h: var(--tcrn-color-ink);
  --tcrn-pair-edge-h: 0 0 #0000;
  --tcrn-pair-fill-o: var(--tcrn-color-hover);
  --tcrn-pair-ink-o: var(--tcrn-color-ink);
  --tcrn-pair-edge-o: 0 0 #0000;
  --tcrn-pair-edge-f: var(--tcrn-focus-ring);
  display: inline-grid;
  flex: 0 0 auto;
  grid-template-columns: minmax(0, 1fr) var(--tcrn-shell-toggle);
  column-gap: var(--tcrn-space-2h);
  align-items: center;
  inline-size: var(--tcrn-shell-brand-w);
  block-size: var(--tcrn-shell-brand-h);
  min-inline-size: 0;
  margin: 0;
  padding: 0 var(--tcrn-space-1h);
  overflow: hidden;
  border: 0;
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-pair-fill);
  color: var(--tcrn-pair-ink);
  box-shadow: var(--tcrn-pair-edge);
  font-family: var(--tcrn-type-family-ui);
  text-align: start;
  cursor: pointer;
  transition:
    background-color var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease),
    color var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease),
    box-shadow var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease);
}
.tcrn-shell-brand[data-shell-brand="v1"] {
  inline-size: auto;
}
.tcrn-shell-brand__line {
  --tcrn-brand-mark-size: 22px;
  display: flex;
  align-items: center;
  column-gap: var(--tcrn-space-2h);
  min-inline-size: 0;
}
.tcrn-shell-brand__word {
  display: block;
  min-inline-size: 0;
  overflow: hidden;
  font-size: 12.5px;
  font-weight: var(--tcrn-type-weight-strong);
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tcrn-shell-brand.tcrn-shell-brand--serif .tcrn-shell-brand__word {
  font-family: var(--tcrn-type-family-serif);
  font-weight: var(--tcrn-type-weight-regular);
}
.tcrn-shell-brand__suffix {
  font-style: normal;
}
.tcrn-shell-brand__suffix--tms {
  color: var(--tcrn-brand-suffix-tms);
}
.tcrn-shell-brand__suffix--design-system {
  color: var(--tcrn-brand-suffix-design-system);
}
.tcrn-shell-brand__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: var(--tcrn-shell-toggle);
  block-size: var(--tcrn-shell-toggle);
  color: var(--tcrn-color-ink-2);
}
.tcrn-shell-brand:where(:hover, [data-tcrn-preview-state="hover"]) {
  --tcrn-pair-fill: var(--tcrn-pair-fill-h);
  --tcrn-pair-ink: var(--tcrn-pair-ink-h);
  --tcrn-pair-edge: var(--tcrn-pair-edge-h);
}
.tcrn-shell-brand:where([aria-expanded="true"]) {
  --tcrn-pair-fill: var(--tcrn-pair-fill-o);
  --tcrn-pair-ink: var(--tcrn-pair-ink-o);
  --tcrn-pair-edge: var(--tcrn-pair-edge-o);
}
.tcrn-shell-brand:where(:focus-visible, [data-tcrn-preview-state="focus"]) {
  --tcrn-pair-edge: var(--tcrn-pair-edge-f);
}
/* The focus ring is part of the edge pair, and forced colours paint no box-shadow; the
   transparent outline shows only there, where the system recolours it. */
.tcrn-shell-brand:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
}
@media (max-width: 1023px) {
  .tcrn-shell-brand[data-shell-brand-auto] {
    inline-size: auto;
  }
  .tcrn-shell-brand[data-shell-brand-auto] .tcrn-shell-brand__word {
    display: none;
  }
}
/* Touch (07b board, section F: shell.row-h and shell.srch-h are 32 and 40, 44 under a coarse
   pointer; no separate token). The token stylesheet has no media blocks, so the coarse values
   re-declare the two shell tokens here, at the root like the token sheet, and every rule that
   reads var(--tcrn-shell-row-h) or var(--tcrn-shell-srch-h) follows. */
@media (pointer: coarse) {
  :root {
    --tcrn-shell-row-h: 44px;
    --tcrn-shell-srch-h: 44px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .tcrn-shell-brand {
    transition: background-color var(--tcrn-motion-comprehension), color var(--tcrn-motion-comprehension), box-shadow var(--tcrn-motion-comprehension);
  }
}`;

// The pinned items (TCRN-DS-SUB-115; 07a board, section A and the pin rows of section B). The
// gap before the first item (after the brand button) and between items is --tcrn-shell-pin-gap,
// three equal readings for four items, with no divider; each item is --tcrn-shell-pin-h high
// with a 10 inset, its label 12.5 at 500 as on the board. Rest is ink-2 on no fill; hover takes
// the 3.5% ink wash, an open drop-down and the selected item the 6% wash, and the selected item
// weight 600 (pair key s) — no side bar, no fill with an edge. Items shrink before they spill and
// their labels truncate on one line. Narrower than 1024 the whole group is hidden.
export const shellCss02 = `
.tcrn-shell-pins {
  display: flex;
  flex: 0 1 auto;
  align-items: center;
  gap: var(--tcrn-shell-pin-gap);
  min-inline-size: 0;
  margin: 0;
  margin-inline-start: var(--tcrn-shell-pin-gap);
}
.tcrn-shell-pins__pin {
  display: inline-flex;
  flex: 0 1 auto;
  min-inline-size: 0;
}
.tcrn-shell-pins__item {
  --tcrn-pair-fill: var(--tcrn-pair-fill-d);
  --tcrn-pair-ink: var(--tcrn-pair-ink-d);
  --tcrn-pair-edge: var(--tcrn-pair-edge-d);
  --tcrn-pair-weight: var(--tcrn-type-weight-medium);
  --tcrn-pair-fill-d: transparent;
  --tcrn-pair-ink-d: var(--tcrn-color-ink-2);
  --tcrn-pair-edge-d: 0 0 #0000;
  --tcrn-pair-fill-h: var(--tcrn-color-hover);
  --tcrn-pair-ink-h: var(--tcrn-color-ink);
  --tcrn-pair-edge-h: 0 0 #0000;
  --tcrn-pair-fill-o: var(--tcrn-color-wash);
  --tcrn-pair-ink-o: var(--tcrn-color-ink);
  --tcrn-pair-edge-o: 0 0 #0000;
  --tcrn-pair-fill-s: var(--tcrn-color-wash);
  --tcrn-pair-ink-s: var(--tcrn-color-ink);
  --tcrn-pair-edge-s: 0 0 #0000;
  --tcrn-pair-edge-f: var(--tcrn-focus-ring);
  display: inline-flex;
  align-items: center;
  gap: var(--tcrn-space-1h);
  min-inline-size: 0;
  block-size: var(--tcrn-shell-pin-h);
  margin: 0;
  padding: 0 var(--tcrn-space-2h);
  border: 0;
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-pair-fill);
  color: var(--tcrn-pair-ink);
  box-shadow: var(--tcrn-pair-edge);
  font-family: var(--tcrn-type-family-ui);
  font-size: 12.5px;
  font-weight: var(--tcrn-pair-weight);
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease),
    color var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease),
    box-shadow var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease);
}
.tcrn-shell-pins__label {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tcrn-shell-pins__chevron {
  flex: 0 0 auto;
  color: var(--tcrn-color-ink-3);
}
.tcrn-shell-pins__item:where(:hover, [data-tcrn-preview-state="hover"]) {
  --tcrn-pair-fill: var(--tcrn-pair-fill-h);
  --tcrn-pair-ink: var(--tcrn-pair-ink-h);
  --tcrn-pair-edge: var(--tcrn-pair-edge-h);
}
.tcrn-shell-pins__item:where([aria-expanded="true"]) {
  --tcrn-pair-fill: var(--tcrn-pair-fill-o);
  --tcrn-pair-ink: var(--tcrn-pair-ink-o);
  --tcrn-pair-edge: var(--tcrn-pair-edge-o);
}
.tcrn-shell-pins__item:where([aria-current="page"], [aria-current="true"], [data-tcrn-preview-state="selected"]) {
  --tcrn-pair-fill: var(--tcrn-pair-fill-s);
  --tcrn-pair-ink: var(--tcrn-pair-ink-s);
  --tcrn-pair-edge: var(--tcrn-pair-edge-s);
  --tcrn-pair-weight: var(--tcrn-type-weight-strong);
}
.tcrn-shell-pins__item:where(:focus-visible, [data-tcrn-preview-state="focus"]) {
  --tcrn-pair-edge: var(--tcrn-pair-edge-f);
}
.tcrn-shell-pins__item:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
}
@media (max-width: 1023px) {
  .tcrn-shell-pins {
    display: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .tcrn-shell-pins__item {
    transition: background-color var(--tcrn-motion-comprehension), color var(--tcrn-motion-comprehension), box-shadow var(--tcrn-motion-comprehension);
  }
}`;
