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
// section F, and the three R2 additions: shell.mark, shell.touch, shell.crumb-icon): a size,
// inset, gap, padding, margin or radius here is a token or calc() built on tokens, and the one
// literal length is a 1px line (C10, TCRN-DS-SUB-142, read by scripts/shell-fidelity-proof.mjs;
// type sizes and the forced-colours outline are not geometry). The brand sizes are the brand
// side-rail tier (Brand board, section E: mark 22, the shell.mark token, wordmark 12.5 at 600),
// and geometry does not change with the theme. The touch height under a coarse pointer is a
// token-layer switch (@tcrn/ui-tokens points shell.row-h and shell.srch-h at shell.touch), so
// no rule here re-declares a shell token at the root.

// The brand button (TCRN-DS-SUB-114; 07a board, section 1 and section A). Second version:
// mark, wordmark and toggle on a --tcrn-shell-brand-w by --tcrn-shell-brand-h box with a 6 inset
// and 10 between the cells; the first version drops the wordmark and is as wide as its content.
// Idle it has no fill and no edge; hover and open take the 3.5% ink wash (--tcrn-color-hover).
// The mark and the wordmark are centred by the flex line alone: no line-height nudge, no
// optical shift, so the wordmark's ink midline is the mark's midline.
// The wordmark takes its content width, as the board's 22 auto 20 columns do (TCRN-DS-SUB-143):
// it does not shrink, and it may run up to 1 (half of space-0h) past the cell the mark and the
// toggle leave it, so a wordmark that is only a fraction too wide (TCRN TMS reads 60.234 in the
// 60 cell) is drawn whole; a longer one stops there with an ellipsis, and the title says it in
// full. The outer box stays 134 by 40 and the toggle does not move. The suffix's line box is
// taller than the 1.2 line (Hanken Grotesk ascends 1 and descends 0.303 em), so the wordmark
// has space-0h above and below its line: the clipping wordmark holds the suffix, and the room is
// the same on both sides, so the glyphs stay where the flex line centres them.
export const shellCss01 = `
/* tcrn:shell-layer-start */
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
  --tcrn-brand-mark-size: var(--tcrn-shell-mark);
  display: flex;
  align-items: center;
  column-gap: var(--tcrn-space-2h);
  min-inline-size: 0;
}
.tcrn-shell-brand__word {
  display: block;
  flex: none;
  min-inline-size: 0;
  max-inline-size: calc(100% - var(--tcrn-brand-mark-size) - var(--tcrn-space-2h) + var(--tcrn-space-0h) / 2);
  padding-block: var(--tcrn-space-0h);
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

// The full menu (TCRN-DS-SUB-116; 07a board, section A, expanded; 07b board, section D "完整菜单",
// "右下角锁定块"). The positioned box hangs under the brand button: top is the band's inset above the
// button plus the button plus the hand-off gap, start is the paper's edge (space-3), and it is the
// expanded panel token wide (never wider than the viewport less both paper edges). It is a one-row
// grid: the panel is its first column and the cascades of SUB-117 follow at the cascade gap. The
// panel is paper with the s3 shadow (no blur above 3px), radius 12, inset space-2 at the top and
// sides and none at the bottom, where the bar takes the inset into its own height (pbar-h + space-2,
// the 07b decomposition 44 + 8), so its content centres between the bar's top rule and the panel's
// bottom edge. Columns: three, gap space-4; a group title row is 28 (control-height-sm) with a
// space-1h margin above, an item row --tcrn-shell-row-h; the row's content starts space-2 inside
// the panel's space-2, 16 in all, and the bar's lockup ends there too (16 before the right edge).
// Rows paint with the pair grammar: ink-2 at rest, ink on the 3.5% wash on hover, ink on the 6%
// wash at weight 600 when selected; a group title is ink-3 with no hover fill (only its pin shows).
//
// Behaviour (TCRN-DS-SUB-117): a row's next level opens as a cascade column after the panel, the
// drop-down width wide and as tall as the panel (the grid row stretches it; its own content does
// not size the row, contain: size), paper with the s3 shadow, inset space-1h, a 24 title row. While
// a query is typed the search results replace the columns, in the flow of the panel. Narrower than
// 1024 the pinned group shows. The panel and the cascades fade in over the fill duration, opacity
// only; under prefers-reduced-motion nothing animates or transitions.
export const shellCss03 = `
.tcrn-shell-menu {
  position: absolute;
  top: calc((var(--tcrn-shell-strip-h) - var(--tcrn-shell-brand-h)) / 2 + var(--tcrn-shell-brand-h) + var(--tcrn-shell-menu-gap));
  left: var(--tcrn-space-3);
  z-index: var(--tcrn-z-popover);
  display: grid;
  grid-template-columns: min(var(--tcrn-shell-panel-w-expanded), calc(100vw - 2 * var(--tcrn-space-3)));
  grid-auto-columns: var(--tcrn-shell-drop-w);
  grid-auto-flow: column;
  align-items: stretch;
  column-gap: var(--tcrn-shell-cascade-gap);
  inline-size: min(var(--tcrn-shell-panel-w-expanded), calc(100vw - 2 * var(--tcrn-space-3)));
  margin: 0;
  color: var(--tcrn-color-ink);
  font-family: var(--tcrn-type-family-ui);
}
.tcrn-shell-menu__panel {
  display: flex;
  flex-direction: column;
  gap: var(--tcrn-space-0h);
  min-inline-size: 0;
  max-block-size: calc(100vh - var(--tcrn-shell-strip-h));
  margin: 0;
  padding: var(--tcrn-space-2) var(--tcrn-space-2) 0;
  overflow: hidden;
  border-radius: var(--tcrn-radius-panel);
  background: var(--tcrn-color-panel);
  box-shadow: var(--tcrn-shadow-s3);
  animation: tcrn-shell-menu-enter var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease) both;
}
.tcrn-shell-menu .tcrn-shell-menu__cascade {
  contain: size;
  display: flex;
  flex-direction: column;
  gap: var(--tcrn-space-0h);
  min-inline-size: 0;
  min-block-size: 0;
  margin: 0;
  padding: var(--tcrn-space-1h);
  overflow-x: hidden;
  overflow-y: auto;
  border-radius: var(--tcrn-radius-panel);
  background: var(--tcrn-color-panel);
  box-shadow: var(--tcrn-shadow-s3);
  animation: tcrn-shell-menu-enter var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease) both;
}
@keyframes tcrn-shell-menu-enter {
  from {
    opacity: 0;
  }
}
.tcrn-shell-menu .tcrn-shell-menu__search {
  flex: 0 0 auto;
  inline-size: auto;
  max-inline-size: none;
  margin: 0 0 var(--tcrn-space-1h);
  transition: none;
}
.tcrn-shell-menu__search .tcrn-search-input {
  --tcrn-search-input-block-size: var(--tcrn-shell-srch-h);
  inline-size: 100%;
}
.tcrn-shell-menu__cols {
  display: grid;
  flex: 0 1 auto;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-content: start;
  gap: 0 var(--tcrn-space-4);
  min-block-size: 0;
  padding: 0 0 var(--tcrn-space-1);
  overflow-x: hidden;
  overflow-y: auto;
}
.tcrn-shell-menu .tcrn-shell-menu__col {
  display: flex;
  flex-direction: column;
  gap: var(--tcrn-space-0h);
  min-inline-size: 0;
}
.tcrn-shell-menu .tcrn-nav-group__label {
  align-items: center;
  block-size: var(--tcrn-control-height-sm);
  min-inline-size: 0;
  margin: var(--tcrn-space-1h) 0 0;
  padding: 0 var(--tcrn-space-1) 0 var(--tcrn-space-2);
  border-radius: var(--tcrn-radius-control);
  color: var(--tcrn-color-ink-3);
  font-size: 10px;
  font-weight: var(--tcrn-type-weight-medium);
  letter-spacing: 0.14em;
  line-height: var(--tcrn-control-height-sm);
  text-transform: uppercase;
  white-space: nowrap;
}
.tcrn-shell-menu .tcrn-nav-group__label:not([data-nav-pinnable="true"]) {
  overflow: hidden;
  text-overflow: ellipsis;
}
.tcrn-shell-menu .tcrn-shell-menu__cascade > .tcrn-nav-group__label {
  flex: 0 0 auto;
  block-size: var(--tcrn-shell-pinb);
  margin: var(--tcrn-space-0h) 0 0;
  padding: 0 var(--tcrn-space-1) 0 var(--tcrn-space-2h);
  line-height: var(--tcrn-shell-pinb);
}
.tcrn-shell-menu .tcrn-nav-group__items {
  display: flex;
  flex-direction: column;
  gap: var(--tcrn-space-0h);
  min-inline-size: 0;
}
.tcrn-shell-menu .tcrn-nav-item {
  --tcrn-pair-fill-d: transparent;
  --tcrn-pair-ink-d: var(--tcrn-color-ink-2);
  --tcrn-pair-icon-d: var(--tcrn-color-ink-3);
  --tcrn-pair-weight-d: var(--tcrn-type-weight-medium);
  --tcrn-pair-fill-h: var(--tcrn-color-hover);
  --tcrn-pair-ink-h: var(--tcrn-color-ink);
  --tcrn-pair-fill-s: var(--tcrn-color-wash);
  --tcrn-pair-ink-s: var(--tcrn-color-ink);
  --tcrn-pair-icon-s: var(--tcrn-color-ink);
  --tcrn-pair-weight-s: var(--tcrn-type-weight-strong);
  --tcrn-pair-edge-d: 0 0 #0000;
  --tcrn-pair-edge-f: var(--tcrn-focus-ring);
  --tcrn-pair-fill: var(--tcrn-pair-fill-d);
  --tcrn-pair-ink: var(--tcrn-pair-ink-d);
  --tcrn-pair-icon: var(--tcrn-pair-icon-d);
  --tcrn-pair-weight: var(--tcrn-pair-weight-d);
  --tcrn-pair-edge: var(--tcrn-pair-edge-d);
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: center;
  column-gap: var(--tcrn-space-2h);
  min-inline-size: 0;
  min-block-size: 0;
  block-size: var(--tcrn-shell-row-h);
  margin: 0;
  padding: 0 var(--tcrn-space-1) 0 var(--tcrn-space-2h);
  border: 0;
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-pair-fill);
  color: var(--tcrn-pair-ink);
  box-shadow: var(--tcrn-pair-edge);
  font-size: 12.5px;
  font-weight: var(--tcrn-pair-weight);
  line-height: 1.2;
  text-decoration: none;
  white-space: nowrap;
  transition:
    background-color var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease),
    color var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease),
    box-shadow var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease);
}
.tcrn-shell-menu__cols .tcrn-nav-item {
  grid-template-columns: calc(var(--tcrn-icon-size-md) + var(--tcrn-space-1h)) minmax(0, 1fr);
  padding-inline-start: var(--tcrn-space-2);
}
.tcrn-shell-menu__cols .tcrn-nav-item[data-nav-item-has-icon="false"] > .tcrn-nav-item__content {
  grid-column: 2;
}
.tcrn-shell-menu .tcrn-nav-item > .tcrn-icon {
  justify-self: center;
  color: var(--tcrn-pair-icon);
}
.tcrn-shell-menu .tcrn-nav-item:where(:hover, [data-tcrn-preview-state~="hover"]) {
  --tcrn-pair-fill: var(--tcrn-pair-fill-h);
  --tcrn-pair-ink: var(--tcrn-pair-ink-h);
}
.tcrn-shell-menu .tcrn-nav-item:where([aria-current="page"], [aria-expanded="true"]) {
  --tcrn-pair-fill: var(--tcrn-pair-fill-s);
  --tcrn-pair-ink: var(--tcrn-pair-ink-s);
  --tcrn-pair-icon: var(--tcrn-pair-icon-s);
  --tcrn-pair-weight: var(--tcrn-pair-weight-s);
}
.tcrn-shell-menu .tcrn-nav-item:where(:focus-visible, [data-tcrn-preview-state~="focus"]) {
  --tcrn-pair-edge: var(--tcrn-pair-edge-f);
}
.tcrn-shell-menu .tcrn-nav-item:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.tcrn-shell-menu .tcrn-nav-item-row {
  min-inline-size: 0;
  block-size: var(--tcrn-shell-row-h);
  column-gap: var(--tcrn-space-2h);
}
.tcrn-shell-menu .tcrn-nav-item-row > .tcrn-nav-item {
  block-size: 100%;
  padding-inline-end: 0;
  background: transparent;
  color: var(--tcrn-pair-row-ink);
}
.tcrn-shell-menu .tcrn-nav-item-row:where(:has(> [data-tcrn-preview-state~="hover"])) {
  --tcrn-pair-row-fill: var(--tcrn-pair-row-fill-h);
  --tcrn-pair-row-ink: var(--tcrn-pair-row-ink-h);
}
.tcrn-shell-menu .tcrn-nav-item-row:where(:has(> [aria-expanded="true"])) {
  --tcrn-pair-row-fill: var(--tcrn-pair-row-fill-s);
  --tcrn-pair-row-ink: var(--tcrn-pair-row-ink-s);
}
:where(.tcrn-shell-menu .tcrn-nav-item-row:has(> [data-tcrn-preview-state~="hover"]), .tcrn-shell-menu .tcrn-nav-group[data-tcrn-preview-state~="hover"] > .tcrn-nav-group__label) > .tcrn-nav-pin {
  opacity: 1;
}
.tcrn-shell-menu .tcrn-nav-item__content {
  display: block;
  min-inline-size: 0;
  overflow: hidden;
}
/* A row's label is one line (C7; TCRN-DS-SUB-154): it clips and ends in an ellipsis, and a
   pinnable row's label carries its text as its title. The text span inside truncates itself. */
.tcrn-shell-menu .tcrn-nav-item__label {
  display: flex;
  align-items: center;
  gap: var(--tcrn-space-1h);
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tcrn-shell-menu__text {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tcrn-shell-menu__sub {
  flex: 0 0 auto;
  color: var(--tcrn-color-ink-3);
}
.tcrn-shell-menu .tcrn-product-shell-search__results {
  position: static;
  display: flex;
  flex-direction: column;
  gap: var(--tcrn-space-0h);
  inline-size: auto;
  max-block-size: none;
  margin: var(--tcrn-space-1h) 0 0;
  padding: 0;
  overflow: visible;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}
.tcrn-shell-menu .tcrn-product-shell-search__results[hidden] {
  display: none;
}
.tcrn-shell-menu .tcrn-product-shell-search__result {
  --tcrn-pair-fill-d: transparent;
  --tcrn-pair-ink-d: var(--tcrn-color-ink-2);
  --tcrn-pair-fill-h: var(--tcrn-color-hover);
  --tcrn-pair-ink-h: var(--tcrn-color-ink);
  --tcrn-pair-edge-d: 0 0 #0000;
  --tcrn-pair-edge-f: var(--tcrn-focus-ring);
  --tcrn-pair-fill: var(--tcrn-pair-fill-d);
  --tcrn-pair-ink: var(--tcrn-pair-ink-d);
  --tcrn-pair-edge: var(--tcrn-pair-edge-d);
  display: grid;
  grid-template-columns: minmax(0, auto) minmax(0, 1fr);
  align-items: center;
  column-gap: var(--tcrn-space-2h);
  min-inline-size: 0;
  block-size: var(--tcrn-shell-row-h);
  padding: 0 var(--tcrn-space-1) 0 var(--tcrn-space-2);
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-pair-fill);
  color: var(--tcrn-pair-ink);
  box-shadow: var(--tcrn-pair-edge);
  font-size: 12.5px;
  white-space: nowrap;
}
.tcrn-shell-menu .tcrn-product-shell-search__result:where(:hover, [data-tcrn-preview-state~="hover"]) {
  --tcrn-pair-fill: var(--tcrn-pair-fill-h);
  --tcrn-pair-ink: var(--tcrn-pair-ink-h);
}
.tcrn-shell-menu .tcrn-product-shell-search__result:where(:focus-visible) {
  --tcrn-pair-edge: var(--tcrn-pair-edge-f);
}
.tcrn-shell-menu .tcrn-product-shell-search__result:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.tcrn-shell-menu .tcrn-product-shell-search__result strong,
.tcrn-shell-menu .tcrn-product-shell-search__result span {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tcrn-shell-menu .tcrn-product-shell-search__result strong {
  font-weight: var(--tcrn-type-weight-medium);
}
.tcrn-shell-menu .tcrn-product-shell-search__result span {
  color: var(--tcrn-color-ink-2);
  font-size: 11.5px;
}
.tcrn-shell-menu__pbar {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: var(--tcrn-space-3);
  min-inline-size: 0;
  block-size: calc(var(--tcrn-shell-pbar-h) + var(--tcrn-space-2));
  margin: var(--tcrn-space-1h) 0 0;
  padding: 0 var(--tcrn-space-2);
  border-top: 1px solid var(--tcrn-color-line);
}
.tcrn-shell-menu__crumbs {
  display: flex;
  flex: 0 1 auto;
  align-items: center;
  gap: var(--tcrn-space-1h);
  min-inline-size: 0;
  overflow: hidden;
  color: var(--tcrn-color-ink-2);
  font-size: 11.5px;
  line-height: 1.2;
  white-space: nowrap;
}
.tcrn-shell-menu__crumbs-label {
  flex: 0 0 auto;
  color: var(--tcrn-color-ink-3);
}
.tcrn-shell-menu__crumb {
  min-inline-size: 0;
  overflow: hidden;
  color: var(--tcrn-color-ink-2);
  font-weight: var(--tcrn-type-weight-medium);
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tcrn-shell-menu__crumb--current {
  color: var(--tcrn-color-ink);
  font-weight: var(--tcrn-type-weight-strong);
}
.tcrn-shell-menu__crumb-sep {
  flex: 0 0 auto;
  color: var(--tcrn-color-ink-3);
}
/* The bar places the lockup; its side-rail sizes are the brand tier of brand.css.ts, which the
   lockup takes through its data-lockup="lkr" hook (TCRN-DS-SUB-144). */
.tcrn-shell-menu__lockup {
  flex: 0 0 auto;
  margin-inline-start: auto;
  padding: var(--tcrn-space-1h) var(--tcrn-space-1);
}
@media (min-width: 1024px) {
  .tcrn-shell-menu .tcrn-shell-menu__col--pinned {
    display: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .tcrn-shell-menu__panel,
  .tcrn-shell-menu .tcrn-shell-menu__cascade {
    animation: none;
  }
  .tcrn-shell-menu .tcrn-nav-item {
    transition: none;
  }
}`;

// The drop-down of a pinned group or submenu and its cascades (TCRN-DS-SUB-118; 07a board,
// section A, the drop-down state; 07b board, section D "固定二级菜单下拉", "三、四级级联"). Its root
// also carries tcrn-shell-menu, so the rows, the search, the results and the cascade columns are
// the full menu's rules; this segment only re-places and re-sizes it. It is fixed to the pinned
// item: ShellDropdown writes the item's start edge and bottom as left and top, and the hand-off gap
// is the token, as a top margin. The first column is the drop-down width; cascades follow at the
// cascade gap, as wide, stretched to its height. The panel is paper with the s3 shadow, radius 12,
// inset space-1h; the search is the drop-down search height with a space-2 inset and the small
// icon, space-1 above the rows; the rows have no icon column, so their text starts at space-1h +
// space-2h (16).
export const shellCss04 = `
.tcrn-shell-menu.tcrn-shell-dropdown {
  position: fixed;
  grid-template-columns: var(--tcrn-shell-drop-w);
  inline-size: var(--tcrn-shell-drop-w);
  margin-top: var(--tcrn-shell-menu-gap);
}
.tcrn-shell-dropdown__panel {
  display: flex;
  flex-direction: column;
  gap: var(--tcrn-space-0h);
  min-inline-size: 0;
  max-block-size: calc(100vh - var(--tcrn-shell-strip-h));
  margin: 0;
  padding: var(--tcrn-space-1h);
  overflow: hidden;
  border-radius: var(--tcrn-radius-panel);
  background: var(--tcrn-color-panel);
  box-shadow: var(--tcrn-shadow-s3);
  color: var(--tcrn-color-ink-2);
  animation: tcrn-shell-menu-enter var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease) both;
}
.tcrn-shell-dropdown .tcrn-shell-dropdown__search {
  margin: 0 0 var(--tcrn-space-1);
}
.tcrn-shell-dropdown__search .tcrn-search-input {
  --tcrn-search-input-block-size: var(--tcrn-shell-drop-srch-h);
  --tcrn-search-input-padding-inline: var(--tcrn-space-2);
  --tcrn-search-input-icon-size: var(--tcrn-icon-size-sm);
}
.tcrn-shell-dropdown__list {
  display: flex;
  flex: 0 1 auto;
  flex-direction: column;
  gap: var(--tcrn-space-0h);
  min-inline-size: 0;
  min-block-size: 0;
  overflow-x: hidden;
  overflow-y: auto;
}
.tcrn-shell-dropdown .tcrn-product-shell-search__result {
  padding-inline-start: var(--tcrn-space-2h);
}
@media (prefers-reduced-motion: reduce) {
  .tcrn-shell-dropdown__panel {
    animation: none;
  }
}`;

// ProductShell in its one state, the top band (TCRN-DS-SUB-119; 07a board, section A; 07b board,
// section D rows "顶带高" and "纸"). The shell is a two-row grid as tall as the viewport: the band,
// --tcrn-shell-strip-h high with no fill and no rule, then the paper. It is the containing block of
// the full menu, so the menu's start edge is the paper's. The band holds the brand button, the
// pinned items and the top-right cluster in one flex row centred on the band's midline (26), with
// space-3 at both ends, so the brand button's start edge, the paper's and the full menu's are one
// line and the cluster's end edge is the paper's. The cluster: the product's own controls, the
// bell (control-height-md, the 6% wash on hover as the 07a board's section B draws it, the
// unread dot in the danger red on a band ring) and the avatar (control-height-sm, a circle in
// the avatar pair with a hairline edge,
// caption size at weight 500), space-1h apart. The avatar menu hangs from the avatar at the menu
// hand-off gap, end edges aligned, the drop-down width wide: paper with the s3 shadow, radius 12,
// inset space-1h. The paper is space-3 from the shell's sides and bottom with the paper radius and
// shadow s1; the page scrolls inside it, so the band and the paper's edges never move.
export const shellCss05 = `
.tcrn-product-shell {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: var(--tcrn-shell-strip-h) minmax(0, 1fr);
  block-size: 100dvh;
  min-inline-size: 0;
  overflow: clip;
  background: var(--tcrn-color-bg);
  color: var(--tcrn-color-ink);
  font-family: var(--tcrn-type-family-ui);
  font-size: var(--tcrn-type-size-ui);
  line-height: var(--tcrn-type-line-ui);
  letter-spacing: 0;
}
.tcrn-shell-strip {
  display: flex;
  align-items: center;
  min-inline-size: 0;
  block-size: var(--tcrn-shell-strip-h);
  margin: 0;
  padding: 0 var(--tcrn-space-3);
  border: 0;
  background: none;
}
.tcrn-shell-cluster {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: var(--tcrn-space-1h);
  block-size: var(--tcrn-control-height-lg);
  min-inline-size: 0;
  margin-inline-start: auto;
}
.tcrn-shell-cluster > .tcrn-product-shell__header-actions {
  flex-wrap: nowrap;
}
.tcrn-shell-bell {
  --tcrn-pair-fill: var(--tcrn-pair-fill-d);
  --tcrn-pair-ink: var(--tcrn-pair-ink-d);
  --tcrn-pair-edge: var(--tcrn-pair-edge-d);
  --tcrn-pair-fill-d: transparent;
  --tcrn-pair-ink-d: var(--tcrn-color-ink-2);
  --tcrn-pair-edge-d: 0 0 #0000;
  --tcrn-pair-fill-h: var(--tcrn-color-wash);
  --tcrn-pair-ink-h: var(--tcrn-color-ink);
  --tcrn-pair-edge-h: 0 0 #0000;
  --tcrn-pair-edge-f: var(--tcrn-focus-ring);
  position: relative;
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  inline-size: var(--tcrn-control-height-md);
  block-size: var(--tcrn-control-height-md);
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-pair-fill);
  color: var(--tcrn-pair-ink);
  box-shadow: var(--tcrn-pair-edge);
  cursor: pointer;
  transition:
    background-color var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease),
    color var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease),
    box-shadow var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease);
}
.tcrn-shell-bell__dot {
  position: absolute;
  inset-block-start: calc((var(--tcrn-control-height-md) - var(--tcrn-icon-size-lg)) / 2 + 1px);
  inset-inline-end: calc((var(--tcrn-control-height-md) - var(--tcrn-icon-size-lg)) / 2 + 1px);
  inline-size: var(--tcrn-space-1h);
  block-size: var(--tcrn-space-1h);
  border-radius: var(--tcrn-radius-pill);
  background: var(--tcrn-color-red);
  box-shadow: 0 0 0 var(--tcrn-space-0h) var(--tcrn-color-bg);
}
.tcrn-shell-avatar {
  --tcrn-pair-fill: var(--tcrn-pair-fill-d);
  --tcrn-pair-ink: var(--tcrn-pair-ink-d);
  --tcrn-pair-edge: var(--tcrn-pair-edge-d);
  --tcrn-pair-fill-d: var(--tcrn-color-av-bg);
  --tcrn-pair-ink-d: var(--tcrn-color-av-ink);
  --tcrn-pair-edge-d: inset 0 0 0 1px var(--tcrn-color-line);
  --tcrn-pair-edge-f: inset 0 0 0 1px var(--tcrn-color-line), var(--tcrn-focus-ring);
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  inline-size: var(--tcrn-control-height-sm);
  block-size: var(--tcrn-control-height-sm);
  margin: 0;
  padding: 0;
  overflow: hidden;
  border: 0;
  border-radius: var(--tcrn-radius-pill);
  background: var(--tcrn-pair-fill);
  color: var(--tcrn-pair-ink);
  box-shadow: var(--tcrn-pair-edge);
  font-family: var(--tcrn-type-family-ui);
  font-size: var(--tcrn-type-size-caption);
  font-weight: var(--tcrn-type-weight-medium);
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
}
.tcrn-shell-bell:where(:hover, [data-tcrn-preview-state="hover"]) {
  --tcrn-pair-fill: var(--tcrn-pair-fill-h);
  --tcrn-pair-ink: var(--tcrn-pair-ink-h);
  --tcrn-pair-edge: var(--tcrn-pair-edge-h);
}
.tcrn-shell-bell:where(:focus-visible, [data-tcrn-preview-state="focus"]),
.tcrn-shell-avatar:where(:focus-visible, [data-tcrn-preview-state="focus"]) {
  --tcrn-pair-edge: var(--tcrn-pair-edge-f);
}
.tcrn-shell-bell:focus-visible,
.tcrn-shell-avatar:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.tcrn-shell-account {
  position: relative;
  display: inline-flex;
  flex: 0 0 auto;
}
.tcrn-shell-account__panel {
  position: absolute;
  inset-block-start: calc(100% + var(--tcrn-shell-menu-gap));
  inset-inline-end: 0;
  z-index: var(--tcrn-z-popover);
  display: flex;
  flex-direction: column;
  gap: var(--tcrn-space-1);
  inline-size: var(--tcrn-shell-drop-w);
  max-block-size: calc(100vh - var(--tcrn-shell-strip-h));
  margin: 0;
  padding: var(--tcrn-space-1h);
  overflow-x: hidden;
  overflow-y: auto;
  border-radius: var(--tcrn-radius-panel);
  background: var(--tcrn-color-panel);
  box-shadow: var(--tcrn-shadow-s3);
  color: var(--tcrn-color-ink-2);
}
.tcrn-shell-account__who {
  display: grid;
  gap: var(--tcrn-space-0h);
  min-inline-size: 0;
  margin: 0;
  padding: var(--tcrn-space-1) var(--tcrn-space-2h);
}
.tcrn-shell-account__who b,
.tcrn-shell-account__who span,
.tcrn-shell-account__heading {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tcrn-shell-account__who b {
  color: var(--tcrn-color-ink);
  font-weight: var(--tcrn-type-weight-strong);
}
.tcrn-shell-account__who span,
.tcrn-shell-account__heading {
  color: var(--tcrn-color-ink-3);
  font-size: var(--tcrn-type-size-meta);
}
.tcrn-shell-account__products {
  display: flex;
  flex-direction: column;
  gap: var(--tcrn-space-0h);
  min-inline-size: 0;
  padding-block-start: var(--tcrn-space-1);
  border-block-start: 1px solid var(--tcrn-color-line);
}
.tcrn-shell-account__heading {
  padding: var(--tcrn-space-1) var(--tcrn-space-2h);
}
.tcrn-shell-account__products .tcrn-nav-item {
  min-block-size: var(--tcrn-shell-row-h);
}
.tcrn-shell-account__prefs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--tcrn-space-2);
  min-inline-size: 0;
  padding: var(--tcrn-space-1) var(--tcrn-space-1) 0;
  border-block-start: 1px solid var(--tcrn-color-line);
}
.tcrn-product-shell__paper {
  display: flex;
  flex-direction: column;
  min-inline-size: 0;
  min-block-size: 0;
  margin: 0 var(--tcrn-space-3) var(--tcrn-space-3);
  overflow: hidden;
  border-radius: var(--tcrn-radius-paper);
  background: var(--tcrn-color-panel);
  box-shadow: var(--tcrn-shadow-s1);
}
.tcrn-product-shell__paper > .tcrn-product-shell__main {
  flex: 1 1 auto;
  min-block-size: 0;
  overflow: auto;
  overscroll-behavior: contain;
}
@media (prefers-reduced-motion: reduce) {
  .tcrn-shell-bell {
    transition: background-color var(--tcrn-motion-comprehension), color var(--tcrn-motion-comprehension), box-shadow var(--tcrn-motion-comprehension);
  }
}`;
