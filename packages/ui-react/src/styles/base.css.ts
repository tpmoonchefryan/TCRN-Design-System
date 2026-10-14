// Base segments of tcrnComponentCss: the root and dark-theme custom properties and every
// rule whose selector subject is not a typography, icon, actions, inputs or brand class
// (shell, navigation, layout, data display, feedback, overlay, settings, page hierarchy).
//
// styles/index.ts joins the segments of all six family modules in the stylesheet's cascade
// order, so where a segment sits in the sheet is decided there; this module owns what the
// segment says. A backtick ends a segment early, so the CSS comments in it never use one
// (scripts/css-template-integrity-proof.mjs checks every segment).

export const baseCss01 = `
:root {
  --tcrn-motion-product-shell: var(--tcrn-motion-emphasis);
  --tcrn-brand-accent-aos: #187c7c;
}
[data-tcrn-theme="dark"] {
  --tcrn-brand-accent-aos: #69d6d0;
}
/* The shell's focus edge pair: the ring its focus fallback paints (shell.css.ts, TCRN-DS-SUB-156).
   A custom property that reads a theme token takes the value of the element that declares it, so
   the pair is declared wherever a theme is, as the token blocks are: an element that turns the
   other theme on inside the shell draws its own theme's ring. */
:root,
[data-tcrn-theme="light"],
[data-tcrn-theme="dark"] {
  --tcrn-pair-shell-edge-f: var(--tcrn-focus-ring);
}`;

export const baseCss02 = `
.tcrn-shell-locale-menu__trigger,
.tcrn-shell-locale-menu__option {
  font: inherit;
}`;

export const baseCss03 = `
/* The theme toggle is an IconButton: a press switches it to the active pair and never
   scales it (Actions), so it is not in this list. */
.tcrn-nav-item:active,
.tcrn-shell-locale-menu__trigger:active,
.tcrn-table-toolbar__chip:active,
.tcrn-table-toolbar__collapse:active {
  transform: scale(var(--tcrn-motion-press-scale));
}`;

export const baseCss04 = `
.tcrn-nav-item[aria-disabled="true"] {
  cursor: not-allowed;
  opacity: 0.64;
}`;

export const baseCss05 = `
.tcrn-divider {
  border: 0;
  border-top: 1px solid var(--tcrn-color-border-subtle);
  margin: var(--tcrn-space-3) 0;
}
/* The theme, side-nav and mobile-nav toggles are IconButtons, so their fill, ink, edge,
   focus ring and transitions all come from the Actions pair table. These shell rules only
   size and shape them; none of them writes a colour, a shadow or a transition. */
.tcrn-shell-theme-toggle,
.tcrn-button.tcrn-shell-theme-toggle {
  position: relative;
  inline-size: 36px;
  block-size: 36px;
  min-inline-size: 36px;
  min-block-size: 36px;
  min-height: 36px;
  padding: 0;
  overflow: hidden;
  border-radius: var(--tcrn-radius-pill);
}
/* The locale trigger's hover and open state switch its pair, which its base rule in baseCss11
   declares, and write no colour (C2, TCRN-DS-SUB-155). They keep the pseudo-class and the
   attribute at (0,2,0), the variant's specificity, so they still win over the base rule, which
   comes later in the sheet. */
.tcrn-shell-locale-menu__trigger:hover,
.tcrn-shell-locale-menu__trigger[aria-expanded="true"] {
  --tcrn-pair-locale-fill: var(--tcrn-pair-locale-fill-h);
  --tcrn-pair-locale-ink: var(--tcrn-pair-locale-ink-h);
  --tcrn-pair-locale-line: var(--tcrn-pair-locale-line-h);
  --tcrn-pair-locale-edge: var(--tcrn-pair-locale-edge-h);
}`;

export const baseCss06 = `
.tcrn-shell-theme-toggle__icon {
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.58) rotate(-90deg);
  transition:
    opacity var(--tcrn-motion-emphasis),
    transform var(--tcrn-motion-emphasis);
}
.tcrn-shell-theme-toggle[data-current-theme="light"] .tcrn-shell-theme-toggle__icon[data-theme-icon="light"],
.tcrn-shell-theme-toggle[data-current-theme="dark"] .tcrn-shell-theme-toggle__icon[data-theme-icon="dark"] {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1) rotate(0deg);
}
.tcrn-shell-theme-toggle[data-current-theme="light"] .tcrn-shell-theme-toggle__icon[data-theme-icon="dark"] {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.58) rotate(-90deg);
}
.tcrn-shell-theme-toggle[data-current-theme="dark"] .tcrn-shell-theme-toggle__icon[data-theme-icon="light"] {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.58) rotate(90deg);
}`;

export const baseCss07 = `
.tcrn-sr-only {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
/* aria-live announcer: visually-hidden by default so status text is spoken by
   assistive tech without occupying layout (agent-picked announcer disposition). */
.tcrn-live-region {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}`;

export const baseCss08 = `
.tcrn-product-shell[data-theme-switching="true"]::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 999;
  pointer-events: none;
  background: color-mix(in srgb, var(--tcrn-color-brand-primary-bg), transparent 20%);
  animation: tcrn-product-shell-theme-wash var(--tcrn-motion-product-shell) both;
}
@keyframes tcrn-product-shell-theme-wash {
  from { opacity: 0.22; }
  to { opacity: 0; }
}`;

// The shell's focus fallback (the G+ ring for an element in the product shell with no focus
// treatment of its own) was this segment's one rule. Since the navigation and shell exemptions
// ended it is a state rule at the variant's specificity that writes no colour (C2), so it moved to
// the end of shell.css.ts (shellCss05), where it still comes after every rule of the same weight
// it used to win over (TCRN-DS-SUB-156). The segment stays joined in styles/index.ts as an empty
// landing place, so the cascade list does not change.
export const baseCss09 = ``;

export const baseCss10 = `
.tcrn-product-shell__header-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--tcrn-space-2);
  min-width: 0;
}
/* The search holds its results list, which is placed against it. The old top bar's sizes (260
   at rest, 420 while searching, pushed to the bar's end) are gone with the bar (TCRN-DS-SUB-145):
   the search takes the width of the place that holds it, the full menu, a drop-down or a page. */
.tcrn-product-shell-search {
  position: relative;
}
.tcrn-product-shell-search__results {
  position: absolute;
  inset-block-start: calc(100% + var(--tcrn-space-2));
  inset-inline-end: 0;
  z-index: 40;
  display: grid;
  gap: var(--tcrn-space-1);
  width: min(420px, calc(100vw - 32px));
  padding: var(--tcrn-space-2);
  border: 1px solid var(--tcrn-color-border-strong);
  border-radius: var(--tcrn-radius-panel);
  background: var(--tcrn-color-surface-panel);
  box-shadow: var(--tcrn-elevation-floating);
}
.tcrn-product-shell-search__results[hidden] {
  display: none;
}
.tcrn-product-shell-search__result,
.tcrn-product-shell-search__empty {
  display: grid;
  gap: var(--tcrn-space-0h);
  padding: var(--tcrn-space-2);
  border-radius: var(--tcrn-radius-control);
  color: var(--tcrn-color-text-primary);
  text-decoration: none;
}
/* A result paints with its fill pair: the 3.5% wash on hover, the 6% wash when selected
   (selected comes after hover); the state rules only switch it (C2, TCRN-DS-SUB-155). */
.tcrn-product-shell-search__result {
  --tcrn-pair-result-fill-d: transparent;
  --tcrn-pair-result-fill-h: var(--tcrn-color-hover);
  --tcrn-pair-result-fill-s: var(--tcrn-color-wash);
  --tcrn-pair-result-fill: var(--tcrn-pair-result-fill-d);
  background: var(--tcrn-pair-result-fill);
}
.tcrn-product-shell-search__result:where(:hover) {
  --tcrn-pair-result-fill: var(--tcrn-pair-result-fill-h);
}
.tcrn-product-shell-search__result:where([data-selected="true"]) {
  --tcrn-pair-result-fill: var(--tcrn-pair-result-fill-s);
}
.tcrn-product-shell-search__result span,
.tcrn-product-shell-search__empty {
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-meta);
}
/*
 * The paper's content (07b board .ts-content, TCRN-DS-SUB-129): the page header is its first row,
 * then the page, one column with the board's row gap. The inset is the board's 14 28 12: space-3h,
 * twice space-3h at the sides (no space token is 28) and space-3. A grid rather than a flex column,
 * so every row keeps its content height and the paper scrolls instead of squeezing a row.
 */
.tcrn-product-shell__main {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-content: start;
  gap: var(--tcrn-space-2h);
  min-width: 0;
  padding: var(--tcrn-space-3h) calc(2 * var(--tcrn-space-3h)) var(--tcrn-space-3);
}
/*
 * The content stack is the size container for the section grid it holds, the
 * same arrangement as the split-view frame: an element cannot answer a container
 * query about itself, so the parent carries the container and the grid's own
 * columns respond to it. width 100% keeps a definite size wherever the parent
 * has one to give, because inline-size containment removes the intrinsic width.
 */
.tcrn-product-shell-content-stack {
  container: tcrn-product-shell-content / inline-size;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--tcrn-space-5);
  width: 100%;
  min-width: 0;
  max-width: 1180px;
}
.tcrn-product-shell-content-stack > *,
.tcrn-product-shell-section-grid > * {
  min-width: 0;
  max-width: 100%;
}
.tcrn-product-shell-section-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(280px, 0.75fr);
  gap: var(--tcrn-space-4);
  align-items: start;
}
/*
 * The section grid stacks when ITS OWN container cannot hold its columns, the
 * record family's rule. Side by side, the second column keeps its 280px floor
 * and the primary column gets the same floor: 280 + 16 + 280 = 576px of
 * container. Below that the primary column used to keep a zero minimum and
 * collapsed to about 20px on a 1024px viewport with a 280px rail, so a work
 * queue broke its records one character per line (TCRN-CROSS-INC-399).
 */
@container tcrn-product-shell-content (max-width: 576px) {
  .tcrn-product-shell-section-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
.tcrn-nav-group {
  display: grid;
  gap: var(--tcrn-space-2);
}
.tcrn-nav-group__label {
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-caption);
  font-weight: var(--tcrn-type-weight-strong);
  text-transform: uppercase;
  letter-spacing: 0;
  padding: 0 var(--tcrn-space-2);
}
.tcrn-nav-group__items {
  display: grid;
  gap: var(--tcrn-space-1);
}
/* TCRN-DS-STORY-062: NavGroup's selected prop previously emitted data-selected with NO visual
   rule (a dead API). The containing group of the active item now marks itself the same way the
   doc-shell section header does — brand text on the group label; the 3px rail stays on the leaf. */
.tcrn-nav-group[data-selected="true"] > .tcrn-nav-group__label {
  color: var(--tcrn-color-text-primary);
}
.tcrn-nav-item {
  --tcrn-nav-item-depth: 0;
  --tcrn-pair-nav-fill-d: transparent;
  --tcrn-pair-nav-ink-d: var(--tcrn-color-ink-2);
  --tcrn-pair-nav-fill-h: var(--tcrn-color-hover);
  --tcrn-pair-nav-ink-h: var(--tcrn-color-ink);
  --tcrn-pair-nav-fill-s: var(--tcrn-color-wash);
  --tcrn-pair-nav-ink-s: var(--tcrn-color-ink);
  --tcrn-pair-nav-fill: var(--tcrn-pair-nav-fill-d);
  --tcrn-pair-nav-ink: var(--tcrn-pair-nav-ink-d);
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr);
  align-items: center;
  gap: var(--tcrn-space-2);
  min-height: calc(var(--tcrn-space-6) - var(--tcrn-space-0h));
  padding: var(--tcrn-space-1) var(--tcrn-space-2h) var(--tcrn-space-1) calc(var(--tcrn-space-6) + (var(--tcrn-nav-item-depth) * var(--tcrn-space-3)));
  border: 1px solid transparent;
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-pair-nav-fill);
  color: var(--tcrn-pair-nav-ink);
  font-size: var(--tcrn-type-size-meta);
  text-decoration: none;
}
.tcrn-nav-item[data-nav-item-has-icon="false"] {
  grid-template-columns: minmax(0, 1fr);
}
.tcrn-nav-item__content {
  min-width: 0;
}
/* TCRN-DS-STORY-062 → STORY-087: selection used to speak one axis — a 3px left-edge brand
   rail, brand text, zero radius. It now speaks ink. The rail is gone; this sentence is kept
   only to say so, because the original wording survived the change that deleted the rule it
   described and read as truth for three commits.
   The item keeps its own radius rather than squaring off for an axis that no
   longer exists, and weight is safe here because a sidebar item sits in a
   fixed-width column where a bolder label cannot reflow the row. */
/* The states switch the item's pair at the base class's specificity and write no colour: the
   3.5% wash on hover, the 6% wash and the strong weight when selected, selected after hover so
   it wins (C2, C6, TCRN-DS-SUB-155). */
.tcrn-nav-item:where(:hover) {
  --tcrn-pair-nav-fill: var(--tcrn-pair-nav-fill-h);
  --tcrn-pair-nav-ink: var(--tcrn-pair-nav-ink-h);
}
.tcrn-nav-item:where([data-selected="true"], [aria-current="page"]) {
  --tcrn-pair-nav-fill: var(--tcrn-pair-nav-fill-s);
  --tcrn-pair-nav-ink: var(--tcrn-pair-nav-ink-s);
  font-weight: var(--tcrn-type-weight-strong);
}
/* An item's label is one line wherever the item is (C7, the shell's hard line; TCRN-DS-SUB-192):
   a block that clips and ends in an ellipsis, min-width 0 so it gives way in its column, and
   NavItem gives it its text as its title. The full menu makes it a flex row for its next-level
   mark (shell.css.ts) and keeps this cut. */
.tcrn-nav-item__label {
  display: block;
  min-width: 0;
  overflow: hidden;
  overflow-wrap: normal;
  word-break: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/*
 * Pinnable rows (TCRN-DS-SUB-123, STORY-142). NavItem and NavGroup render a pin only when the
 * consumer handles pinning. The pin keeps its slot (the shell pin-button token, 24) at the end
 * of the row whether it shows or not: it shows with opacity on row hover, on focus inside the
 * row, on its own keyboard focus and when pinned, never with display, so the text box is as
 * wide at rest as on hover.
 *
 * A link cannot hold a button, so a pinnable item is a row of two siblings, the link and its
 * pin. The row paints the item's fill and ink through its own pair and the link inside it
 * paints none, so pointing at the pin keeps the whole row lit. The pair is the menu row of the
 * board in the G+ names: ink-2 at rest, ink on the 3.5% hover wash, ink on the 6% wash when
 * selected; selected wins over hover, as on the board.
 *
 * The pin is ink-3 at rest and on hover (where it gains the 6% wash), acc when pinned; the
 * pinned glyph fills the pin body, the first child of the icon (icons.json, pin variant
 * solid). State rules only switch the pin pair. On a coarse pointer the hit area grows by
 * space-2h on every side, 24 to 44.
 */
.tcrn-nav-item-row {
  --tcrn-pair-row-fill-d: transparent;
  --tcrn-pair-row-ink-d: var(--tcrn-color-ink-2);
  --tcrn-pair-row-fill-h: var(--tcrn-color-hover);
  --tcrn-pair-row-ink-h: var(--tcrn-color-ink);
  --tcrn-pair-row-fill-s: var(--tcrn-color-wash);
  --tcrn-pair-row-ink-s: var(--tcrn-color-ink);
  --tcrn-pair-row-fill: var(--tcrn-pair-row-fill-d);
  --tcrn-pair-row-ink: var(--tcrn-pair-row-ink-d);
  display: grid;
  grid-template-columns: minmax(0, 1fr) var(--tcrn-shell-pinb);
  align-items: center;
  padding-inline-end: var(--tcrn-space-1);
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-pair-row-fill);
}
.tcrn-nav-item-row:where(:hover) {
  --tcrn-pair-row-fill: var(--tcrn-pair-row-fill-h);
  --tcrn-pair-row-ink: var(--tcrn-pair-row-ink-h);
}
.tcrn-nav-item-row[data-selected="true"] {
  --tcrn-pair-row-fill: var(--tcrn-pair-row-fill-s);
  --tcrn-pair-row-ink: var(--tcrn-pair-row-ink-s);
}
.tcrn-nav-item-row > .tcrn-nav-item {
  min-width: 0;
  background: transparent;
  color: var(--tcrn-pair-row-ink);
}
.tcrn-nav-group__label[data-nav-pinnable="true"] {
  display: grid;
  grid-template-columns: minmax(0, 1fr) var(--tcrn-shell-pinb);
  align-items: center;
  column-gap: var(--tcrn-space-2h);
  padding-inline-end: var(--tcrn-space-1);
}
.tcrn-nav-group__label-text {
  display: block;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tcrn-nav-pin {
  --tcrn-pair-pin-fill-d: transparent;
  --tcrn-pair-pin-ink-d: var(--tcrn-color-ink-3);
  --tcrn-pair-pin-glyph-d: none;
  --tcrn-pair-pin-fill-h: var(--tcrn-color-wash);
  --tcrn-pair-pin-ink-h: var(--tcrn-color-ink-3);
  --tcrn-pair-pin-glyph-h: none;
  --tcrn-pair-pin-fill-s: transparent;
  --tcrn-pair-pin-ink-s: var(--tcrn-color-acc);
  --tcrn-pair-pin-glyph-s: currentColor;
  --tcrn-pair-pin-fill-sh: var(--tcrn-color-wash);
  --tcrn-pair-pin-ink-sh: var(--tcrn-color-acc);
  --tcrn-pair-pin-glyph-sh: currentColor;
  --tcrn-pair-pin-edge-d: 0 0 #0000;
  --tcrn-pair-pin-edge-f: var(--tcrn-focus-ring);
  --tcrn-pair-pin-fill: var(--tcrn-pair-pin-fill-d);
  --tcrn-pair-pin-ink: var(--tcrn-pair-pin-ink-d);
  --tcrn-pair-pin-glyph: var(--tcrn-pair-pin-glyph-d);
  --tcrn-pair-pin-edge: var(--tcrn-pair-pin-edge-d);
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  justify-self: end;
  inline-size: var(--tcrn-shell-pinb);
  block-size: var(--tcrn-shell-pinb);
  padding: 0;
  border: 0;
  border-radius: var(--tcrn-radius-small);
  background: var(--tcrn-pair-pin-fill);
  box-shadow: var(--tcrn-pair-pin-edge);
  color: var(--tcrn-pair-pin-ink);
  font: inherit;
  cursor: pointer;
  opacity: 0;
}
.tcrn-nav-pin .tcrn-icon > :first-child {
  fill: var(--tcrn-pair-pin-glyph);
}
.tcrn-nav-pin:where(:hover) {
  --tcrn-pair-pin-fill: var(--tcrn-pair-pin-fill-h);
  --tcrn-pair-pin-ink: var(--tcrn-pair-pin-ink-h);
  --tcrn-pair-pin-glyph: var(--tcrn-pair-pin-glyph-h);
}
.tcrn-nav-pin:where([aria-pressed="true"]) {
  --tcrn-pair-pin-fill: var(--tcrn-pair-pin-fill-s);
  --tcrn-pair-pin-ink: var(--tcrn-pair-pin-ink-s);
  --tcrn-pair-pin-glyph: var(--tcrn-pair-pin-glyph-s);
}
.tcrn-nav-pin:where([aria-pressed="true"]:hover) {
  --tcrn-pair-pin-fill: var(--tcrn-pair-pin-fill-sh);
  --tcrn-pair-pin-ink: var(--tcrn-pair-pin-ink-sh);
  --tcrn-pair-pin-glyph: var(--tcrn-pair-pin-glyph-sh);
}
/* Forced colours paint no box-shadow; the transparent outline is recoloured there. */
.tcrn-nav-pin:where(:focus-visible) {
  --tcrn-pair-pin-edge: var(--tcrn-pair-pin-edge-f);
  outline: 2px solid transparent;
  outline-offset: 2px;
}
:where(.tcrn-nav-item-row:hover, .tcrn-nav-item-row:focus-within, .tcrn-nav-group__label:hover, .tcrn-nav-group__label:focus-within) > .tcrn-nav-pin,
.tcrn-nav-pin:where([aria-pressed="true"], :focus-visible) {
  opacity: 1;
}
@media (pointer: coarse) {
  .tcrn-nav-pin::after {
    content: "";
    position: absolute;
    inset: calc(-1 * var(--tcrn-space-2h));
  }
}`;

export const baseCss11 = `
.tcrn-shell-locale-menu {
  position: relative;
}
.tcrn-shell-locale-menu__trigger {
  display: inline-flex;
  align-items: center;
  gap: var(--tcrn-space-2);
  --tcrn-pair-locale-fill-d: var(--tcrn-color-surface-panel);
  --tcrn-pair-locale-ink-d: var(--tcrn-color-text-primary);
  --tcrn-pair-locale-line-d: var(--tcrn-color-border-control);
  --tcrn-pair-locale-edge-d: 0 0 #0000;
  --tcrn-pair-locale-fill-h: var(--tcrn-color-hover);
  --tcrn-pair-locale-ink-h: var(--tcrn-color-ink);
  --tcrn-pair-locale-line-h: var(--tcrn-color-line-ctl);
  --tcrn-pair-locale-edge-h: var(--tcrn-shadow-s1);
  --tcrn-pair-locale-fill: var(--tcrn-pair-locale-fill-d);
  --tcrn-pair-locale-ink: var(--tcrn-pair-locale-ink-d);
  --tcrn-pair-locale-line: var(--tcrn-pair-locale-line-d);
  --tcrn-pair-locale-edge: var(--tcrn-pair-locale-edge-d);
  max-width: 132px;
  min-height: 36px;
  padding: 0 var(--tcrn-space-2h);
  border: 1px solid var(--tcrn-pair-locale-line);
  border-radius: var(--tcrn-radius-pill);
  background: var(--tcrn-pair-locale-fill);
  color: var(--tcrn-pair-locale-ink);
  box-shadow: var(--tcrn-pair-locale-edge);
  font-size: var(--tcrn-type-size-ui);
  font-weight: var(--tcrn-type-weight-strong);
  line-height: var(--tcrn-type-line-ui);
  letter-spacing: 0;
  transition:
    background-color var(--tcrn-motion-standard),
    border-color var(--tcrn-motion-standard),
    color var(--tcrn-motion-standard),
    box-shadow var(--tcrn-motion-standard);
}
.tcrn-shell-locale-menu__current {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tcrn-shell-locale-menu__panel {
  position: absolute;
  right: 0;
  top: calc(100% + var(--tcrn-space-2));
  z-index: 30;
  display: grid;
  gap: var(--tcrn-space-1);
  min-width: 148px;
  padding: var(--tcrn-space-2);
  border: 1px solid var(--tcrn-color-border-strong);
  border-radius: var(--tcrn-radius-panel);
  background: var(--tcrn-color-surface-panel);
  box-shadow: var(--tcrn-elevation-floating);
}
.tcrn-shell-locale-menu__chevron {
  flex: 0 0 auto;
  width: 11px;
  height: 11px;
  color: var(--tcrn-color-text-tertiary);
  pointer-events: none;
  transition: transform var(--tcrn-motion-emphasis);
}
.tcrn-shell-locale-menu[data-locale-menu-open="true"] .tcrn-shell-locale-menu__chevron,
.tcrn-shell-locale-menu__trigger:where([aria-expanded="true"]) .tcrn-shell-locale-menu__chevron {
  transform: rotate(180deg);
}
.tcrn-shell-locale-menu__panel[hidden] {
  display: none;
}
.tcrn-shell-locale-menu__option {
  --tcrn-pair-locale-option-fill-d: transparent;
  --tcrn-pair-locale-option-fill-h: var(--tcrn-color-hover);
  --tcrn-pair-locale-option-fill-s: var(--tcrn-color-wash);
  --tcrn-pair-locale-option-fill: var(--tcrn-pair-locale-option-fill-d);
  border: 0;
  border-radius: var(--tcrn-radius-control);
  padding: var(--tcrn-space-2);
  text-align: left;
  background: var(--tcrn-pair-locale-option-fill);
  color: var(--tcrn-color-text-primary);
}
/* Hover is the 3.5% wash, the current locale the 6% wash and the strong weight; current comes
   after hover, and the state rules only switch the fill pair (C2, C6, TCRN-DS-SUB-155). */
.tcrn-shell-locale-menu__option:where(:hover) {
  --tcrn-pair-locale-option-fill: var(--tcrn-pair-locale-option-fill-h);
}
.tcrn-shell-locale-menu__option:where([aria-current="true"]) {
  --tcrn-pair-locale-option-fill: var(--tcrn-pair-locale-option-fill-s);
  font-weight: var(--tcrn-type-weight-strong);
}
.tcrn-shell-locale-menu__name {
  font: inherit;
}
/* The theme toggle's icons have no display rule here: the toggle shows its current icon by
   its own data-current-theme (the opacity rules beside .tcrn-shell-theme-toggle__icon), so
   the icon follows a block-level theme the same way as a page-level one. */
[data-side-nav-icon="expand"] {
  display: none;
}
[data-side-nav-collapsed="true"] [data-side-nav-icon="collapse"] {
  display: none;
}
[data-side-nav-collapsed="true"] [data-side-nav-icon="expand"] {
  display: inline-flex;
}
.tcrn-table-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--tcrn-space-2);
  margin-block-end: var(--tcrn-space-2);
}`;

export const baseCss12 = `
.tcrn-table-toolbar .tcrn-filter-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--tcrn-space-1);
}
.tcrn-table-toolbar__chip {
  min-height: 26px;
  padding: 0 var(--tcrn-space-2);
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-control);
  background: transparent;
  color: var(--tcrn-color-text-secondary);
  font: inherit;
  font-size: var(--tcrn-type-size-meta);
  cursor: pointer;
  transition:
    background-color var(--tcrn-motion-fast),
    border-color var(--tcrn-motion-fast),
    color var(--tcrn-motion-fast);
}
.tcrn-table-toolbar__chip:hover {
  border-color: var(--tcrn-color-border-control);
  color: var(--tcrn-color-text-primary);
}
.tcrn-table-toolbar__chip:focus-visible,
.tcrn-table-toolbar__collapse:focus-visible {
  outline: 2px solid var(--tcrn-color-focus-ring);
  outline-offset: 2px;
}
/* TCRN-DS-STORY-087 — "selection is ink", applied to a chip that carries a frame.
   This chip and QuickFilters are both exported filter chips with the same
   "this filter is chosen" meaning, and they carried two different grammars until
   now: this one painted brand, that one inked. One grammar does not mean one
   declaration — ink takes over whatever structural layer the control already
   has. The quick filter sits in a frameless track and so takes fill; this chip
   owns a visible border and so takes the edge. Nothing is added on top in
   either case, and brand colour stays with actionability. */
.tcrn-table-toolbar__chip[aria-pressed="true"] {
  border-color: var(--tcrn-selection-edge);
  color: var(--tcrn-color-text-primary);
}
.tcrn-table-toolbar__count {
  margin-inline-start: auto;
  /* text-secondary, not text-muted: the live match count is real information and
     muted fails the 4.5:1 contrast floor on panel surfaces. */
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-meta);
  font-variant-numeric: tabular-nums;
}
.tcrn-table-toolbar__collapse {
  min-height: 26px;
  padding: 0 var(--tcrn-space-2);
  border: 1px solid transparent;
  border-radius: var(--tcrn-radius-control);
  background: transparent;
  color: var(--tcrn-color-text-secondary);
  font: inherit;
  font-size: var(--tcrn-type-size-meta);
  cursor: pointer;
}
.tcrn-table-toolbar__collapse:hover {
  color: var(--tcrn-color-text-primary);
  border-color: var(--tcrn-color-border-subtle);
}
.tcrn-table-toolbar__collapse [data-table-toolbar-collapse-label="expand"],
.tcrn-table-toolbar__collapse[aria-expanded="false"] [data-table-toolbar-collapse-label="collapse"] {
  display: none;
}
.tcrn-table-toolbar__collapse[aria-expanded="false"] [data-table-toolbar-collapse-label="expand"] {
  display: inline;
}
.tcrn-table-shell [role="row"][hidden] {
  display: none;
}
.tcrn-environment-banner,
.tcrn-inline-alert {
  display: flex;
  align-items: center;
  gap: var(--tcrn-space-3);
  min-height: 42px;
  padding: var(--tcrn-space-2) var(--tcrn-space-3);
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-panel);
  background: var(--tcrn-color-brand-neutral-bg);
}
.tcrn-inline-alert--warning {
  background: var(--tcrn-color-state-warning-bg);
}
.tcrn-inline-alert--neutral {
  background: var(--tcrn-color-brand-neutral-bg);
  color: var(--tcrn-color-text-secondary);
}
.tcrn-inline-alert--positive {
  background: var(--tcrn-color-state-ready-bg);
  color: var(--tcrn-color-state-ready);
}
.tcrn-inline-alert--danger {
  background: var(--tcrn-color-state-blocked-bg);
  color: var(--tcrn-color-state-blocked);
}`;

export const baseCss13 = `
/* Status reads as ink dot plus word. The pill-with-pastel-fill it replaces put a
   saturated block of colour behind every row in a dense table, which is loud at
   this density and is the single most recognisable tell of generated UI. Squaring
   the chip to the control radius keeps it reading as an instrument value rather
   than a marketing badge. */
.tcrn-badge {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: max-content;
  max-width: 100%;
  min-width: 0;
  min-height: 24px;
  padding: var(--tcrn-state-chip-padding);
  padding-inline-start: calc(var(--tcrn-space-2) + var(--tcrn-state-dot-size) + 4px);
  border-radius: var(--tcrn-radius-control);
  font-size: var(--tcrn-type-size-meta);
  line-height: 1.25;
  font-weight: var(--tcrn-type-weight-strong);
  white-space: nowrap;
  background: var(--tcrn-color-surface-muted);
  color: var(--tcrn-color-text-secondary);
}
.tcrn-badge__label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* Free-form labels may opt into the old wrapping behavior explicitly. Status labels
   stay on one line so a table row remains a constant-height scanning surface. */
.tcrn-badge--wrap {
  white-space: normal;
  overflow-wrap: anywhere;
}
.tcrn-badge--wrap .tcrn-badge__label {
  overflow: visible;
  text-overflow: clip;
  white-space: normal;
}
/* The dot is positioned rather than laid out. As a flex item it contributed its own
   min-content width, which left the anonymous text item unable to shrink and clipped
   longer labels ("Proof required") at narrow widths; out of flow it costs the label
   nothing and the text wraps as it did before. */
.tcrn-badge::before {
  content: "";
  position: absolute;
  inset-inline-start: var(--tcrn-space-2);
  inset-block-start: 50%;
  inline-size: var(--tcrn-state-dot-size);
  block-size: var(--tcrn-state-dot-size);
  margin-block-start: calc(var(--tcrn-state-dot-size) / -2);
  border-radius: 50%;
  background: currentColor;
}
/* INC-013: the explicit wrapping variant anchors its dot to the first line's
   optical center. This follows the base pseudo-element so the override remains
   effective without changing the ordinary single-line safety band. */
.tcrn-badge--wrap::before {
  inset-block-start: var(--tcrn-space-2h);
}
.tcrn-badge--warning {
  background: var(--tcrn-color-state-warning-bg);
  color: var(--tcrn-color-state-warning);
}
.tcrn-badge--positive {
  background: var(--tcrn-color-state-ready-bg);
  color: var(--tcrn-color-state-ready);
}
.tcrn-badge--danger {
  background: var(--tcrn-color-state-blocked-bg);
  color: var(--tcrn-color-state-blocked);
}

/* ── B「治理纸感」identity stamp ──────────────────────────────────────────────
   Reserved for identity moments: a gate closing, a ruling landing, a release being
   accepted. It is deliberately the only place the serif and the oxblood ink appear,
   because an impression that shows up everywhere stops meaning anything. The
   whitelist is enforced mechanically by scripts/stamp-whitelist-proof.mjs. */
.tcrn-stamp {
  display: inline-flex;
  align-items: center;
  gap: var(--tcrn-space-2);
  padding: var(--tcrn-space-1) var(--tcrn-space-2h);
  border: 1px solid currentColor;
  border-radius: var(--tcrn-radius-control);
  color: var(--tcrn-color-brand-accent);
  background: transparent;
  font-family: var(--tcrn-type-family-stamp);
  font-size: var(--tcrn-type-size-stamp-min);
  font-weight: var(--tcrn-type-weight-strong);
  letter-spacing: var(--tcrn-type-tracking-stamp);
  line-height: 1.2;
  text-transform: uppercase;
}
.tcrn-stamp[data-stamp-moment="release"] {
  color: var(--tcrn-color-state-ready);
}
/* The double rule is the archival-document memory: two weights, not one, so a
   header carrying a ruling reads differently from an ordinary panel header. */
.tcrn-stamp-rule {
  border: 0;
  border-top: 2px solid var(--tcrn-color-border-strong);
  border-bottom: 1px solid var(--tcrn-color-border-subtle);
  block-size: 3px;
  margin: 0;
}
.tcrn-readback-panel,
.tcrn-table-shell {
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-panel);
  background: var(--tcrn-color-surface-panel);
}
.tcrn-readback-panel {
  display: grid;
  gap: var(--tcrn-space-2);
  padding: var(--tcrn-space-4);
  overflow: hidden;
}`;

export const baseCss14 = `
.tcrn-key-value-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--tcrn-space-3);
  margin: var(--tcrn-space-3) 0 0;
}
.tcrn-key-value-list > div {
  min-width: 0;
  overflow-wrap: anywhere;
  display: grid;
  gap: var(--tcrn-space-0h);
  padding: var(--tcrn-space-2);
  border-radius: var(--tcrn-radius-panel);
  background: var(--tcrn-color-surface-muted);
}
.tcrn-key-value-list dt,
.tcrn-key-value-list dd {
  min-width: 0;
  max-width: 100%;
  overflow-wrap: anywhere;
}
.tcrn-key-value-list dt {
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-meta);
}
.tcrn-key-value-list dd {
  margin: 0;
  font-weight: var(--tcrn-type-weight-strong);
}
.tcrn-table-shell {
  display: grid;
  min-width: 0;
  max-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-inline: contain;
}
.tcrn-table-shell__head,
.tcrn-table-shell__row {
  display: grid;
  grid-template-columns: var(
    --tcrn-table-shell-columns,
    repeat(var(--tcrn-table-column-count, 1), minmax(var(--tcrn-table-shell-column-min-width, 160px), 1fr))
  );
  min-width: var(
    --tcrn-table-shell-min-width,
    max(100%, calc(var(--tcrn-table-column-count, 1) * var(--tcrn-table-shell-column-min-width, 160px)))
  );
}
.tcrn-table-shell__head {
  position: sticky;
  top: 0;
  background: var(--tcrn-color-surface-muted);
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-meta);
  font-weight: var(--tcrn-type-weight-strong);
}
.tcrn-table-shell__head span,
.tcrn-table-shell__cell {
  min-width: 0;
  min-height: 44px;
  padding: var(--tcrn-space-3);
  border-bottom: 1px solid var(--tcrn-color-border-subtle);
  overflow-wrap: anywhere;
  word-break: normal;
}
.tcrn-table-shell__row:last-child .tcrn-table-shell__cell {
  border-bottom: 0;
}
.tcrn-table-shell__row[data-transient-target="true"] > .tcrn-table-shell__cell {
  background: var(--tcrn-selection-fill);
}
.tcrn-table-shell__empty {
  padding: var(--tcrn-space-3);
  color: var(--tcrn-color-text-secondary);
}
.tcrn-table-shell__empty-row {
  display: block;
}
@media (max-width: 520px) {
  .tcrn-table-shell {
    overflow-x: visible;
  }
  .tcrn-table-shell__head {
    display: none;
  }
  .tcrn-table-shell__row {
    grid-template-columns: 1fr;
    gap: var(--tcrn-space-2);
    min-width: 0;
    padding: var(--tcrn-space-3);
  }
  .tcrn-table-shell__cell {
    display: grid;
    grid-template-columns: minmax(84px, 0.4fr) minmax(0, 1fr);
    gap: var(--tcrn-space-2);
    min-width: 0;
  }
  .tcrn-table-shell__cell::before {
    content: attr(data-label);
    color: var(--tcrn-color-text-secondary);
    font-weight: var(--tcrn-type-weight-strong);
  }
}
.tcrn-relationship-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--tcrn-space-1);
  width: max-content;
  max-width: 100%;
  text-decoration: none;
  white-space: nowrap;
}
.tcrn-relationship-chip__label {
  font-weight: var(--tcrn-type-weight-strong);
}
.tcrn-relationship-chip__target {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* TCRN-DS-STORY-064: the four relation tones were dangling classes with zero rules, so all 12
   relations rendered neutral gray, and the href variant had no chip surface at all (bare text —
   no fill, no border, no dot). Tones now map to the shared state palette on BOTH the Badge and the
   link variant; the link variant gains the same pill surface + status dot Badge provides, plus
   click feedback. */
.tcrn-relationship-chip--neutral {
  background: var(--tcrn-color-surface-muted);
  color: var(--tcrn-color-text-secondary);
}
.tcrn-relationship-chip--positive {
  background: var(--tcrn-color-state-ready-bg);
  color: var(--tcrn-color-state-ready);
}
.tcrn-relationship-chip--warning {
  background: var(--tcrn-color-state-warning-bg);
  color: var(--tcrn-color-state-warning);
}
.tcrn-relationship-chip--danger {
  background: var(--tcrn-color-state-blocked-bg);
  color: var(--tcrn-color-state-blocked);
}
a.tcrn-relationship-chip {
  position: relative;
  min-height: 24px;
  padding: var(--tcrn-state-chip-padding);
  padding-inline-start: calc(var(--tcrn-space-2) + var(--tcrn-state-dot-size) + 4px);
  border-radius: var(--tcrn-radius-control);
  font-size: var(--tcrn-type-size-meta);
  font-weight: var(--tcrn-type-weight-strong);
}
a.tcrn-relationship-chip::before {
  content: "";
  position: absolute;
  inset-inline-start: var(--tcrn-space-2);
  inset-block-start: 50%;
  inline-size: var(--tcrn-state-dot-size);
  block-size: var(--tcrn-state-dot-size);
  margin-block-start: calc(var(--tcrn-state-dot-size) / -2);
  border-radius: 50%;
  background: currentColor;
}
a.tcrn-relationship-chip:hover {
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.15em;
}
a.tcrn-relationship-chip:focus-visible {
  outline: 2px solid var(--tcrn-color-focus-ring);
  outline-offset: 2px;
}
.tcrn-machine-token {
  display: inline-grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--tcrn-space-2);
  width: min(100%, max-content);
  max-width: 100%;
  min-width: 0;
}
.tcrn-machine-token__label {
  grid-column: 1 / -1;
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-caption);
  font-weight: var(--tcrn-type-weight-strong);
  line-height: var(--tcrn-type-line-caption);
}
.tcrn-machine-token__value {
  display: block;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  color: var(--tcrn-color-text-primary);
  font-family: var(--tcrn-type-family-mono);
  font-size: var(--tcrn-type-size-meta);
  line-height: 1.35;
  overflow-wrap: anywhere;
  word-break: break-word;
}
/* A traversable machine token (MachineToken href). Same inline-record-link ink as
   the Knowledge result anchor: brand colour with a quiet underline that answers
   hover, so a token that leads somewhere is distinguishable from one that does
   not without changing the monospace shape of the value itself. */
.tcrn-machine-token__link {
  display: block;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  color: var(--tcrn-color-brand-primary);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.2em;
  text-decoration-color: color-mix(in srgb, var(--tcrn-color-brand-primary) 35%, transparent);
}
.tcrn-machine-token__link:hover {
  text-decoration-color: var(--tcrn-color-brand-primary);
}
.tcrn-machine-token__link .tcrn-machine-token__value {
  color: inherit;
}
.tcrn-machine-token__copy {
  min-height: 28px;
  padding: var(--tcrn-space-0h) var(--tcrn-space-2);
}
.tcrn-machine-token--compact {
  gap: var(--tcrn-space-1);
}
.tcrn-machine-token--compact .tcrn-machine-token__label {
  font-size: var(--tcrn-type-size-caption);
}
.tcrn-machine-token--compact .tcrn-machine-token__value {
  font-size: var(--tcrn-type-size-caption);
}
.tcrn-machine-token-cell {
  display: inline-grid;
  min-width: 0;
  max-width: 100%;
}
.tcrn-sub-nav,
.tcrn-saved-view-toolbar,
.tcrn-page-header,
.tcrn-quick-filters,
.tcrn-record-row,
.tcrn-record-table,
.tcrn-split-view,
.tcrn-row-group,
.tcrn-inline-create,
.tcrn-stage-pipeline,
.tcrn-attachment-list,
.tcrn-relation-graph,
.tcrn-metadata-rail,
.tcrn-activity-feed,
.tcrn-detail-layout,
.tcrn-record-inspector {
  min-width: 0;
}
.tcrn-page-header,
.tcrn-quick-filters,
.tcrn-record-row,
.tcrn-record-table,
.tcrn-split-view,
.tcrn-row-group,
.tcrn-lane-board,
.tcrn-detail-layout,
.tcrn-metadata-rail,
.tcrn-activity-feed {
  --tcrn-density-gap: var(--tcrn-space-2);
  --tcrn-density-padding: var(--tcrn-space-3);
  --tcrn-density-row-min: 40px;
}
/* The trail sits the board's row gap above the title (07b board .ts-content gap 10); dense keeps its own. */
.tcrn-page-header {
  --tcrn-density-gap: var(--tcrn-space-2h);
}
.tcrn-page-header--dense,
.tcrn-quick-filters--dense,
.tcrn-record-row--dense,
.tcrn-record-table--dense,
.tcrn-split-view--dense,
.tcrn-row-group--dense,
.tcrn-lane-board--dense,
.tcrn-detail-layout--dense,
.tcrn-metadata-rail--dense,
.tcrn-activity-feed--dense {
  --tcrn-density-gap: var(--tcrn-space-1);
  --tcrn-density-padding: var(--tcrn-space-2);
  --tcrn-density-row-min: 34px;
}
/* The page header's title row is the board's .ph (TCRN-DS-SUB-162): the rule under it is line-2,
   space-3 below the row, and the title and its meta sit space-3h apart. */
.tcrn-page-header {
  display: grid;
  gap: var(--tcrn-density-gap);
  padding-block-end: var(--tcrn-space-3);
  border-bottom: 1px solid var(--tcrn-color-line-2);
}
.tcrn-page-header__meta,
.tcrn-page-header__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--tcrn-space-2);
  min-width: 0;
}
.tcrn-page-header__body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
  gap: var(--tcrn-space-3h);
  min-width: 0;
}
/* The title column holds the title and, under it, the description. The title is the heading
   element itself, the single-line role of roles.json (C7, TCRN-DS-SUB-156): one line that ends in
   an ellipsis, its text repeated as the element's title, and no block element inside it. The
   description sits directly under it, as it did when both were inside the title block. */
.tcrn-page-header__lead {
  min-width: 0;
}
.tcrn-page-header__title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tcrn-page-header__description {
  margin: 0;
}`;

export const baseCss15 = `
.tcrn-page-header__meta {
  justify-content: flex-end;
}
.tcrn-page-header__actions {
  grid-column: 1 / -1;
}
/* TCRN-DS-STORY-087 — the segmented track.
   A row of tabs is one control, so it carries one frame; the items inside it are
   frameless and selection inks the item's own surface. This replaces the
   per-item bordered pill, which put a frame around every option and then had to
   add a second mark on top of it to say which one was chosen. */
.tcrn-sub-nav {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--tcrn-space-0h);
  padding: var(--tcrn-space-0h);
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  background: var(--tcrn-color-surface-panel);
  max-width: 100%;
}
.tcrn-sub-nav > a,
.tcrn-sub-nav > span {
  --tcrn-pair-subnav-fill-d: transparent;
  --tcrn-pair-subnav-ink-d: var(--tcrn-color-ink-2);
  --tcrn-pair-subnav-fill-h: var(--tcrn-color-hover);
  --tcrn-pair-subnav-ink-h: var(--tcrn-color-ink);
  --tcrn-pair-subnav-fill-s: var(--tcrn-color-wash);
  --tcrn-pair-subnav-ink-s: var(--tcrn-color-ink);
  --tcrn-pair-subnav-edge-d: 0 0 #0000;
  --tcrn-pair-subnav-edge-f: var(--tcrn-focus-ring);
  --tcrn-pair-subnav-fill: var(--tcrn-pair-subnav-fill-d);
  --tcrn-pair-subnav-ink: var(--tcrn-pair-subnav-ink-d);
  --tcrn-pair-subnav-edge: var(--tcrn-pair-subnav-edge-d);
  display: inline-flex;
  align-items: center;
  gap: var(--tcrn-space-2);
  min-height: var(--tcrn-control-height-md);
  padding: var(--tcrn-space-1) var(--tcrn-space-3);
  border: 1px solid transparent;
  border-radius: var(--tcrn-radius-control);
  color: var(--tcrn-pair-subnav-ink);
  text-decoration: none;
  background: var(--tcrn-pair-subnav-fill);
  box-shadow: var(--tcrn-pair-subnav-edge);
  white-space: nowrap;
}
.tcrn-saved-view-toolbar {
  display: grid;
  gap: var(--tcrn-space-3);
}
/* Quick filters wrap across lines by design, so they get no track — a frame that
   wraps is not a frame. The item grammar is the same either way, which is the
   point of inking the item rather than decorating the container. */
.tcrn-quick-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--tcrn-space-0h);
}
.tcrn-quick-filters > a,
.tcrn-quick-filters > span {
  display: inline-flex;
  align-items: center;
  gap: var(--tcrn-space-2);
  min-width: 0;
  min-height: var(--tcrn-density-row-min);
  padding: var(--tcrn-space-0h) var(--tcrn-space-2h);
  border: 1px solid transparent;
  border-radius: var(--tcrn-radius-control);
  color: var(--tcrn-color-text-secondary);
  text-decoration: none;
  background: transparent;
  white-space: nowrap;
}
/*
 * A wrapping row lays chips out by line-breaking, so letting a chip shrink
 * below its own no-wrap text does not save the line — it just lets the text
 * bleed past the chip and drag a horizontal scroll into whatever column holds
 * the row, which is how a four-chip filter bar overflowed a 375px viewport.
 * Natural width plus the wrap the row already has; max-width caps the one
 * pathological label longer than the column itself.
 */
.tcrn-quick-filters > a,
.tcrn-quick-filters > span {
  flex-shrink: 0;
  max-width: 100%;
}
/* TCRN-DS-STORY-087 — "selection is ink".
   One rule for every surface-bearing item in the system: the item's own surface
   takes ink, and nothing is added on top of it. This replaced two competing
   grammars (a vertical left axis in brand colour, a horizontal bottom axis) that
   read as two different products when placed on the same page — DS-INC-003.
   Brand colour leaves selection entirely and stays with actionability and focus,
   so colour means "you can act" and structure means "this is the state". */
.tcrn-quick-filters [data-selected="true"] {
  background: var(--tcrn-selection-fill);
  color: var(--tcrn-color-text-primary);
}
/* TCRN-DS-STORY-088 — SearchableList.
   Frameless rows inside one framed panel, so selection inks the row: the same
   grammar the rest of the system speaks, applied to a surface that did not
   exist until now. */
.tcrn-searchable-list {
  display: grid;
  gap: var(--tcrn-space-2);
  min-width: 0;
}
.tcrn-searchable-list__items {
  display: grid;
  gap: var(--tcrn-space-0h);
  max-height: 18rem;
  overflow-y: auto;
  min-width: 0;
}
.tcrn-searchable-list__item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--tcrn-space-2);
  width: 100%;
  min-height: 34px;
  padding: var(--tcrn-space-1) var(--tcrn-space-2h);
  border: 1px solid transparent;
  border-radius: var(--tcrn-radius-control);
  background: transparent;
  color: var(--tcrn-color-text-primary);
  text-align: start;
  text-decoration: none;
  font: inherit;
  cursor: pointer;
}
.tcrn-searchable-list__item:hover {
  background: var(--tcrn-selection-fill-hover);
}
.tcrn-searchable-list__item[data-selected="true"] {
  background: var(--tcrn-selection-fill);
  font-weight: var(--tcrn-type-weight-strong);
}
.tcrn-searchable-list__item[aria-disabled="true"] {
  cursor: not-allowed;
  opacity: 0.64;
}
.tcrn-searchable-list__label {
  display: grid;
  min-width: 0;
}
.tcrn-searchable-list__description,
.tcrn-searchable-list__meta {
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-meta);
}
.tcrn-searchable-list__meta {
  white-space: nowrap;
}
.tcrn-searchable-list__divider {
  border: 0;
  border-top: 1px solid var(--tcrn-color-border-subtle);
  margin: var(--tcrn-space-1) var(--tcrn-space-1h);
}
.tcrn-searchable-list__truncation {
  padding: var(--tcrn-space-1) var(--tcrn-space-2h);
}
.tcrn-searchable-list__state {
  display: grid;
  gap: var(--tcrn-space-2);
}
.tcrn-quick-filters__value {
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-meta);
}
.tcrn-record-row,
.tcrn-row-group,
.tcrn-activity-feed__item,
.tcrn-detail-layout {
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-panel);
  background: var(--tcrn-color-surface-panel);
}
.tcrn-record-row {
  display: grid;
  grid-template-columns: minmax(112px, 0.18fr) minmax(0, 1fr) minmax(0, 0.8fr);
  align-items: center;
  gap: var(--tcrn-density-gap);
  min-height: var(--tcrn-density-row-min);
  padding: var(--tcrn-density-padding);
  color: var(--tcrn-color-text-primary);
  text-decoration: none;
}
.tcrn-record-row--compact {
  grid-template-columns: minmax(96px, 0.16fr) minmax(0, 1fr) minmax(0, 0.72fr);
  gap: var(--tcrn-space-2);
  padding: var(--tcrn-space-2) var(--tcrn-space-3);
}
/*
 * A row stacks when ITS OWN container cannot hold its columns, not when the
 * viewport crosses a number.
 *
 * The established compact boundary is 464px. Above it, the summary and meta
 * tracks keep zero minima so long content wraps rather than adding an intrinsic
 * floor. The identifier track keeps a readable floor instead: with a zero
 * minimum it fell to about 40px in a half-width table and broke identifiers
 * inside words, one fragment per line (TCRN-CROSS-INC-399). The floor is the one
 * the family published before the zero minima — 112px, 96px compact, 92px dense —
 * so identifiers break only at their own hyphens. It cannot overflow the row:
 * the largest floor plus both gaps is far below the 464px boundary.
 *
 * The mobile block stacks the row
 * below a 760px viewport, which sounds like the same thing and is not: on a
 * shell with a 280px rail, a 761px viewport leaves the row 441px — 23px short
 * of its own floor, and the row overflowed the page by exactly that. Measured
 * 16px at 761 and 7px at 770, gone at 780; the responsive standard forbids
 * page-level horizontal overflow and nothing was asserting it (TCRN-AOS-INC-028).
 *
 * A viewport query cannot see the rail, so it cannot answer this question for a
 * consumer whose rail is a different width — and a second consumer arrives with
 * a different shell. The container can answer it for all of them.
 */
.tcrn-record-table {
  container: tcrn-record-row / inline-size;
}
.tcrn-record-row--dense {
  grid-template-columns: minmax(92px, 0.14fr) minmax(0, 1fr) minmax(0, 0.62fr);
  padding: var(--tcrn-space-1) var(--tcrn-space-2);
  font-size: var(--tcrn-type-size-ui);
}
@container tcrn-record-row (max-width: 464px) {
  .tcrn-record-row,
  .tcrn-record-row--compact,
  .tcrn-record-row--dense {
    grid-template-columns: minmax(0, 1fr);
  }
}
/* The framed half of the grammar. A row already has a border, so selection
   promotes that border to ink rather than drawing a second mark inside it —
   which is exactly what produced the double frame consumers reported. */
.tcrn-record-row[data-selected="true"] {
  border-color: var(--tcrn-selection-edge);
}
.tcrn-record-row[data-transient-target="true"] {
  border-color: var(--tcrn-selection-edge);
  background: var(--tcrn-selection-fill);
}
.tcrn-record-row__id,
.tcrn-record-row__summary,
.tcrn-record-row__meta,
.tcrn-record-row__relationships {
  min-width: 0;
}
.tcrn-record-row__id,
.tcrn-record-row__meta,
.tcrn-record-row__relationships {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--tcrn-space-2);
}
.tcrn-record-row__summary {
  display: grid;
  gap: var(--tcrn-space-0h);
}
.tcrn-record-row__field,
.tcrn-record-row__summary {
  overflow-wrap: anywhere;
}
.tcrn-record-row__summary strong {
  overflow-wrap: anywhere;
}`;

export const baseCss16 = `
.tcrn-record-row__field,
.tcrn-lane-board__card-field {
  display: inline-grid;
  gap: var(--tcrn-space-0h);
  min-width: 0;
  font-size: var(--tcrn-type-size-meta);
}
.tcrn-record-row__field span,
.tcrn-lane-board__card-field span {
  color: var(--tcrn-color-text-secondary);
}
.tcrn-lane-board__card-meta {
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-meta);
}
.tcrn-record-row__relationships {
  grid-column: 1 / -1;
}
.tcrn-record-table,
.tcrn-row-group,
.tcrn-metadata-rail,
.tcrn-activity-feed,
.tcrn-detail-layout__main,
.tcrn-detail-layout__rail {
  display: grid;
  gap: var(--tcrn-density-gap);
}
/*
 * The frame is the size container; the section is the grid. An element cannot
 * answer a container query about itself, and it is the section's own columns
 * that must change when space runs out — so the component wraps itself and the
 * breakpoint becomes true wherever the split view is mounted. The first
 * consumer approximated this with a viewport media query that was only correct
 * for its own shell width; a second consumer with a different shell would have
 * needed a different number.
 */
.tcrn-split-view-frame {
  container: tcrn-split-view / inline-size;
  min-width: 0;
  /*
   * inline-size containment means this box contributes no intrinsic width, so
   * a parent that sizes to its content would measure it at zero and the whole
   * split view would vanish silently. width 100% gives it back a definite size
   * wherever the parent has one to give — block flow, a grid track, a flex
   * item. A parent that is itself shrink-to-fit (inline-block, float, an auto
   * track) has no width to resolve against, and the component's own
   * documentation states that requirement rather than leaving it to be
   * discovered as a blank region.
   */
  width: 100%;
}
.tcrn-split-view {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.6fr);
  gap: var(--tcrn-density-gap);
  align-items: start;
}
.tcrn-split-view__list,
.tcrn-split-view__detail {
  min-width: 0;
}
/* 780px of actual container: below it the 280px detail column starves the list. */
@container tcrn-split-view (max-width: 780px) {
  .tcrn-split-view {
    grid-template-columns: minmax(0, 1fr);
  }
  /*
   * Stacked, the one bit the consumer supplies decides the detail region's
   * fate: absent a selection it is an empty box pushing the list down, and
   * with one it is what the reader chose, so it leads. Without the attribute
   * both regions render in source order, which is the pre-admission layout.
   */
  .tcrn-split-view[data-detail-populated="false"] .tcrn-split-view__detail {
    display: none;
  }
  .tcrn-split-view[data-detail-populated="true"] .tcrn-split-view__detail {
    order: -1;
  }
}
.tcrn-row-group,
.tcrn-activity-feed__item,
.tcrn-detail-layout {
  padding: var(--tcrn-density-padding);
}
.tcrn-row-group__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--tcrn-space-2);
  min-width: 0;
}
.tcrn-row-group__head > div:first-child {
  min-width: 0;
  margin-right: auto;
}`;

export const baseCss17 = `
.tcrn-metadata-rail .tcrn-key-value-list > div {
  grid-template-columns: minmax(0, 1fr);
}
.tcrn-row-group__actions,
.tcrn-inline-create,
.tcrn-metadata-rail__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--tcrn-space-2);
}`;

export const baseCss18 = `
.tcrn-lane-board {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--tcrn-density-gap);
  min-width: 0;
}
.tcrn-lane-board--compact {
  grid-template-columns: repeat(auto-fit, minmax(196px, 1fr));
  gap: var(--tcrn-space-2);
}
.tcrn-lane-board--dense {
  grid-template-columns: repeat(auto-fit, minmax(188px, 1fr));
}
.tcrn-lane-board__lane {
  display: grid;
  gap: var(--tcrn-space-3);
  min-width: 0;
  max-height: 620px;
  overflow: auto;
}
.tcrn-lane-board__lane-head,
.tcrn-lane-board__card-head,
.tcrn-record-inspector__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--tcrn-space-2);
  min-width: 0;
}`;

export const baseCss19 = `
.tcrn-record-inspector__head > div {
  min-width: 0;
  margin-right: auto;
}
.tcrn-lane-board__cards {
  display: grid;
  gap: var(--tcrn-space-2);
}
.tcrn-lane-board__card {
  display: grid;
  gap: var(--tcrn-density-gap);
  min-width: 0;
  padding: var(--tcrn-density-padding);
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-panel);
  background: var(--tcrn-color-surface-muted);
  /* The stretched card link below positions against the card itself. */
  position: relative;
}
/*
 * A card with an href is one click target, delivered as a stretched link rather
 * than an <a> around the card: the card can also carry relationship chips, and
 * an anchor inside an anchor is not a document. The chips row raises itself
 * above the stretched surface so both stay clickable.
 */
.tcrn-lane-board__card-link {
  color: inherit;
  text-decoration: none;
}
.tcrn-lane-board__card-link::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: var(--tcrn-radius-panel);
}
.tcrn-lane-board__card:has(.tcrn-lane-board__card-link):hover {
  border-color: var(--tcrn-color-border-strong);
}
.tcrn-lane-board__card-link:hover,
.tcrn-lane-board__card-link:focus-visible {
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.15em;
}
.tcrn-lane-board__card-link:focus-visible::after {
  outline: 2px solid var(--tcrn-color-focus-ring);
  outline-offset: 2px;
}
/*
 * Everything the card's own API lets a consumer fill sits above the stretched
 * link. Relations render chips that are links in their own right, and meta and
 * fields are public ReactNode slots — a consumer may put a button, a link, or
 * selectable text in either, and a stretched surface over the whole card would
 * swallow all three without any diagnostic. The card stays one click target
 * everywhere the consumer put nothing of its own.
 */
.tcrn-lane-board__relations,
.tcrn-lane-board__card-meta,
.tcrn-lane-board__card-fields {
  position: relative;
  z-index: 1;
}
.tcrn-lane-board__card > strong {
  min-width: 0;
  overflow-wrap: anywhere;
}`;

export const baseCss20 = `
.tcrn-lane-board--compact .tcrn-lane-board__lane,
.tcrn-lane-board--compact .tcrn-lane-board__card {
  gap: var(--tcrn-space-2);
}
.tcrn-lane-board--compact .tcrn-lane-board__card {
  padding: var(--tcrn-space-2);
}
.tcrn-lane-board__card-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--tcrn-space-2);
  min-width: 0;
}
.tcrn-lane-board__relations,
.tcrn-record-inspector__relationships,
.tcrn-detail-layout__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--tcrn-space-2);
  min-width: 0;
}
.tcrn-relation-graph {
  display: grid;
  gap: var(--tcrn-space-3);
}
.tcrn-relation-graph__levels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--tcrn-space-3);
  min-width: 0;
}
.tcrn-relation-graph__node {
  display: grid;
  gap: var(--tcrn-space-2);
  min-width: 0;
}`;

export const baseCss21 = `
.tcrn-record-inspector {
  container: tcrn-record-inspector / inline-size;
  box-sizing: border-box;
  width: 100%;
  overflow-wrap: anywhere;
  display: grid;
  gap: var(--tcrn-space-4);
}
.tcrn-record-inspector__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--tcrn-space-3);
  min-width: 0;
}
.tcrn-record-inspector__grid > section {
  min-width: 0;
}
/* Detail cards are nested within split views and inspectors. Their own available
   width governs fields; a desktop viewport does not imply two readable columns.
   Reuse the record family's compact containment boundary. */
.tcrn-detail-inspector {
  container: tcrn-detail-fields / inline-size;
}
@container tcrn-detail-fields (max-width: 464px) {
  .tcrn-key-value-list {
    grid-template-columns: minmax(0, 1fr);
  }
}
@container tcrn-record-inspector (max-width: 464px) {
  .tcrn-record-inspector__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
/* Inspection is a full-content surface. Use the existing wrapping badge grammar
   for values and row metadata rather than hiding status/owner suffixes. */
.tcrn-attachment-list .tcrn-badge,
.tcrn-record-inspector__head .tcrn-badge,
.tcrn-key-value-list .tcrn-badge,
.tcrn-record-row__meta .tcrn-badge {
  white-space: normal;
  overflow-wrap: anywhere;
}
.tcrn-attachment-list .tcrn-badge__label,
.tcrn-record-inspector__head .tcrn-badge__label,
.tcrn-key-value-list .tcrn-badge__label,
.tcrn-record-row__meta .tcrn-badge__label {
  overflow: visible;
  text-overflow: clip;
  white-space: normal;
}
.tcrn-attachment-list .tcrn-badge::before,
.tcrn-record-inspector__head .tcrn-badge::before,
.tcrn-key-value-list .tcrn-badge::before,
.tcrn-record-row__meta .tcrn-badge::before {
  inset-block-start: var(--tcrn-space-2h);
}
.tcrn-record-inspector__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--tcrn-space-2);
}
.tcrn-activity-feed__head,
.tcrn-detail-layout__head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: var(--tcrn-space-2);
  min-width: 0;
}
.tcrn-activity-feed__head time {
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-meta);
  margin-left: auto;
}`;

export const baseCss22 = `
.tcrn-detail-layout {
  container: tcrn-detail-layout / inline-size;
  box-sizing: border-box;
  width: 100%;
  overflow-wrap: anywhere;
  gap: var(--tcrn-density-gap);
  padding: var(--tcrn-density-padding);
}
.tcrn-detail-layout__head > div {
  min-width: 0;
  margin-right: auto;
}
.tcrn-detail-layout__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(240px, 0.34fr);
  gap: var(--tcrn-space-3);
  min-width: 0;
  align-items: start;
}
@container tcrn-detail-layout (max-width: 464px) {
  .tcrn-detail-layout__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
.tcrn-tree-nav,
.tcrn-document-canvas,
.tcrn-toc-rail,
.tcrn-inline-comment-list,
.tcrn-metadata-rail,
.tcrn-attachment-list,
.tcrn-label-set,
.tcrn-version-history,
.tcrn-template-gallery,
.tcrn-search-result-list {
  min-width: 0;
}
.tcrn-document-canvas,
.tcrn-toc-rail,
.tcrn-inline-comment-list__item,
.tcrn-metadata-rail,
.tcrn-version-history__item,
.tcrn-search-result-list__item {
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-panel);
  background: var(--tcrn-color-surface-panel);
}
.tcrn-document-canvas,
.tcrn-toc-rail,
.tcrn-inline-comment-list__item,
.tcrn-metadata-rail,
.tcrn-version-history__item,
.tcrn-search-result-list__item {
  padding: var(--tcrn-space-3);
}
.tcrn-tree-nav__list {
  display: grid;
  gap: var(--tcrn-space-1);
  margin: 0;
  padding: 0;
  list-style: none;
}
.tcrn-tree-nav__item {
  min-width: 0;
}
/*
 * TreeNav sits in a panel (TCRN-DS-SUB-124, STORY-143): in the top-band shell a tree of
 * destinations lives in the full menu and the drop-downs, so the tree carries no frame of its
 * own and its rows speak the menu row's grammar: the shell row height, ink-2 at rest, ink on the
 * 3.5% hover wash, ink on the 6% wash and the strong weight when current, one line with the
 * title as a title. The state rules only switch the row's pair; current comes after hover.
 */
.tcrn-tree-nav__item > a,
.tcrn-tree-nav__item > span {
  --tcrn-pair-tree-fill-d: transparent;
  --tcrn-pair-tree-ink-d: var(--tcrn-color-ink-2);
  --tcrn-pair-tree-fill-h: var(--tcrn-color-hover);
  --tcrn-pair-tree-ink-h: var(--tcrn-color-ink);
  --tcrn-pair-tree-fill-s: var(--tcrn-color-wash);
  --tcrn-pair-tree-ink-s: var(--tcrn-color-ink);
  --tcrn-pair-tree-fill: var(--tcrn-pair-tree-fill-d);
  --tcrn-pair-tree-ink: var(--tcrn-pair-tree-ink-d);
  --tcrn-pair-tree-edge-d: 0 0 #0000;
  --tcrn-pair-tree-edge-f: var(--tcrn-focus-ring);
  --tcrn-pair-tree-edge: var(--tcrn-pair-tree-edge-d);
  display: flex;
  align-items: center;
  gap: var(--tcrn-space-2);
  min-height: var(--tcrn-shell-row-h);
  min-width: 0;
  padding: 0 var(--tcrn-space-2h);
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-pair-tree-fill);
  color: var(--tcrn-pair-tree-ink);
  box-shadow: var(--tcrn-pair-tree-edge);
  font-size: var(--tcrn-type-size-ui);
  text-decoration: none;
}
.tcrn-tree-nav__item > a:where(:hover, [data-tcrn-preview-state~="hover"]) {
  --tcrn-pair-tree-fill: var(--tcrn-pair-tree-fill-h);
  --tcrn-pair-tree-ink: var(--tcrn-pair-tree-ink-h);
}
.tcrn-tree-nav__item > a:where([data-selected="true"]),
.tcrn-tree-nav__item > span:where([data-selected="true"]) {
  --tcrn-pair-tree-fill: var(--tcrn-pair-tree-fill-s);
  --tcrn-pair-tree-ink: var(--tcrn-pair-tree-ink-s);
  font-weight: var(--tcrn-type-weight-strong);
}
/* The table of contents marks the reader's place with the 6% wash and the strong weight. The
   rows paint with their pair; the state rules after the hover rules switch it (TCRN-DS-SUB-155). */
.tcrn-toc-rail nav > a,
.tcrn-toc-rail nav > span {
  --tcrn-pair-toc-fill-d: transparent;
  --tcrn-pair-toc-ink-d: var(--tcrn-color-ink);
  --tcrn-pair-toc-fill-h: var(--tcrn-color-hover);
  --tcrn-pair-toc-ink-h: var(--tcrn-color-ink);
  --tcrn-pair-toc-fill-s: var(--tcrn-color-wash);
  --tcrn-pair-toc-ink-s: var(--tcrn-color-ink);
  --tcrn-pair-toc-edge-d: 0 0 #0000;
  --tcrn-pair-toc-edge-f: var(--tcrn-focus-ring);
  --tcrn-pair-toc-fill: var(--tcrn-pair-toc-fill-d);
  --tcrn-pair-toc-ink: var(--tcrn-pair-toc-ink-d);
  --tcrn-pair-toc-edge: var(--tcrn-pair-toc-edge-d);
  display: flex;
  align-items: center;
  gap: var(--tcrn-space-2);
  min-height: var(--tcrn-control-height-md);
  min-width: 0;
  padding: var(--tcrn-space-0h) var(--tcrn-space-2);
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-pair-toc-fill);
  color: var(--tcrn-pair-toc-ink);
  box-shadow: var(--tcrn-pair-toc-edge);
  text-decoration: none;
}
.tcrn-tree-nav__item[data-tree-level="2"] > a,
.tcrn-tree-nav__item[data-tree-level="2"] > span {
  padding-inline-start: var(--tcrn-space-4);
}
.tcrn-tree-nav__item[data-tree-level="3"] > a,
.tcrn-tree-nav__item[data-tree-level="3"] > span {
  padding-inline-start: var(--tcrn-space-6);
}
.tcrn-tree-nav__title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tcrn-document-canvas,
.tcrn-inline-comment-list,
.tcrn-metadata-rail,
.tcrn-attachment-list,
.tcrn-version-history,
.tcrn-template-gallery,
.tcrn-search-result-list {
  display: grid;
  gap: var(--tcrn-space-2);
}
.tcrn-document-canvas__head,
.tcrn-inline-comment-list__head,
.tcrn-search-result-list__head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: var(--tcrn-space-2);
  min-width: 0;
}
.tcrn-document-canvas__head > div:first-child,
.tcrn-search-result-list__head > strong {
  min-width: 0;
  margin-right: auto;
}
.tcrn-document-canvas__meta {
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-meta);
}
/*
 * A document page's content is at most the layout content width and centred in the paper, like a
 * settings page (MIN-20261013-SHELL D1, TCRN-DS-SUB-130); list and detail pages (RecordTable,
 * SplitView, DetailLayout) keep the whole paper. Their edges are the paper's content edge: the
 * paper's own inset, with no room kept for a side rail. The canvas has a border and an inset, so
 * the width it is held to includes them.
 */
.tcrn-document-canvas {
  box-sizing: border-box;
  inline-size: 100%;
  max-inline-size: var(--tcrn-layout-content-max-w);
  margin-inline: auto;
}`;

export const baseCss23 = `
.tcrn-document-canvas__body {
  display: grid;
  gap: var(--tcrn-space-4);
  max-width: 74ch;
}
.tcrn-document-canvas__section {
  display: grid;
  gap: var(--tcrn-space-2);
}
.tcrn-label-set,
.tcrn-metadata-rail__actions,
.tcrn-version-history__item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--tcrn-space-2);
}
.tcrn-toc-rail nav {
  display: grid;
  gap: var(--tcrn-space-1);
}
.tcrn-template-gallery {
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}
.tcrn-template-gallery__card {
  display: grid;
  gap: var(--tcrn-space-2);
  min-width: 0;
}
.tcrn-version-history__item {
  justify-content: flex-start;
}
.tcrn-version-history__item > strong,
.tcrn-search-result-list__head a,
.tcrn-search-result-list__head span {
  min-width: 0;
  overflow-wrap: anywhere;
}
.tcrn-detail-layout__main,
.tcrn-detail-layout__rail,
.tcrn-detail-layout__activity {
  min-width: 0;
}
.tcrn-skip-link {
  position: fixed;
  z-index: 1000;
  top: var(--tcrn-space-3);
  left: var(--tcrn-space-3);
  transform: translateY(-150%);
  padding: var(--tcrn-space-2) var(--tcrn-space-3);
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-color-surface-panel);
  border: 1px solid var(--tcrn-color-border-control);
}
.tcrn-skip-link:focus {
  transform: translateY(0);
}
@media (max-width: 760px) {
  .tcrn-shell-locale-menu {
    flex: 0 1 auto;
    margin-right: 0;
    max-width: none;
    width: auto;
  }
  .tcrn-lane-board,
  .tcrn-relation-graph__levels,
  .tcrn-record-inspector__grid,
  .tcrn-page-header__body,
  .tcrn-record-row,
  .tcrn-record-row--compact,
  .tcrn-split-view,
  .tcrn-detail-layout__grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .tcrn-page-header__meta,
  .tcrn-page-header__actions,
  .tcrn-detail-layout__actions {
    justify-content: flex-start;
  }
  .tcrn-sub-nav > a,
  .tcrn-sub-nav > span,
  .tcrn-quick-filters > a,
  .tcrn-quick-filters > span {
    /*
     * Lever 3. These wrapped into four and three rows, spending 380px of the
     * fold on chrome before the first work item. One scrolling row each: the
     * chips keep their own width (a CJK filter name with a count needs 213px
     * and shrinking it bled the text out of the chip), and the overflow is the
     * row's, not the page's.
     *
     * Supersedes the wrap-based sizing that fixed that bleed — same property,
     * different mechanism, and the no-page-overflow property it was protecting
     * still holds because the scroll is contained here.
     */
    flex: 0 0 auto;
    max-width: 100%;
  }
  .tcrn-quick-filters {
    flex-wrap: nowrap;
    overflow-x: auto;
    scrollbar-width: thin;
    /* Momentum on touch, and the row keeps its own scrollbar off the page. */
    -webkit-overflow-scrolling: touch;
  }
  .tcrn-shell-locale-menu__trigger {
    width: 100%;
    max-width: none;
    justify-content: space-between;
  }
  /* The phone paper's inset (07b board .scr.ts.m .ts-content: 12 16). */
  .tcrn-product-shell__main {
    padding: var(--tcrn-space-3) var(--tcrn-space-4);
  }
}`;

export const baseCss24 = `
@media (max-width: 760px) {
  .tcrn-product-shell-section-grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .tcrn-key-value-list {
    grid-template-columns: 1fr;
  }
}
@media (prefers-reduced-motion: reduce) {
  /* Reduced motion means fewer and gentler animations, not none. Travel is what
     causes discomfort, so transform and position animation is removed; opacity and
     colour transitions stay, because they are how the interface says that something
     changed. Killing them outright leaves state changes to happen with no cue at
     all, which is a comprehension regression dressed up as an accessibility win. */
  .tcrn-product-shell,
  .tcrn-product-shell-search {
    transition: opacity var(--tcrn-motion-comprehension), background-color var(--tcrn-motion-comprehension), color var(--tcrn-motion-comprehension), border-color var(--tcrn-motion-comprehension);
  }
  .tcrn-product-shell[data-theme-switching="true"]::after {
    animation: none;
  }
}`;

export const baseCss25 = `
@media (prefers-reduced-motion: reduce) {
  /* The theme toggle takes the Actions family's reduced-motion transition. */
  .tcrn-nav-item {
    transition: opacity var(--tcrn-motion-comprehension), background-color var(--tcrn-motion-comprehension), color var(--tcrn-motion-comprehension), border-color var(--tcrn-motion-comprehension);
  }
}`;

export const baseCss26 = `
@media (prefers-reduced-motion: reduce) {
  .tcrn-shell-theme-toggle__icon,
  .tcrn-shell-locale-menu__trigger,
  .tcrn-shell-locale-menu__chevron {
    transition: opacity var(--tcrn-motion-comprehension), background-color var(--tcrn-motion-comprehension), color var(--tcrn-motion-comprehension), border-color var(--tcrn-motion-comprehension);
  }
}`;

export const baseCss27 = `
@media (prefers-reduced-motion: reduce) {
  .tcrn-nav-item:active,
  .tcrn-shell-locale-menu__trigger:active,
  .tcrn-table-toolbar__chip:active,
  .tcrn-table-toolbar__collapse:active {
    transform: none;
  }
}`;

export const baseCss28 = `


/* ---- Component families relocated from the docs demo layer (TCRN-DS-STORY-037) ----
   These 24 families are emitted by real @tcrn/ui-react components (Form, Overlay,
   Feedback, Layout, Navigation, DataDisplay, Typography). They used to live only in the
   docs stylesheets, so package consumers rendered them unstyled. Values are copied
   verbatim from the canonical, tokenized story-demo-styles.ts (converged by S034); the
   docs demo layer keeps only its own presentation chrome (see docs/style-scale.md,
   "Demo-chrome exemption list"). */

/* Base surface card — Layout .tcrn-surface / .tcrn-disclosure-panel, Feedback
   .tcrn-state-view / .tcrn-state-surface / .tcrn-status-summary-panel, DataDisplay
   .tcrn-detail-inspector, Overlay .tcrn-popover / .tcrn-dialog / .tcrn-confirm-dialog /
   .tcrn-detail-drawer / .tcrn-action-drawer. */
.tcrn-surface,
.tcrn-detail-inspector,
.tcrn-status-summary-panel,
.tcrn-state-view,
.tcrn-state-surface,
.tcrn-disclosure-panel,
.tcrn-popover,
.tcrn-dialog,
.tcrn-confirm-dialog,
.tcrn-detail-drawer,
.tcrn-action-drawer {
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  background: var(--tcrn-color-surface-panel);
  padding: var(--tcrn-space-3);
  max-width: 100%;
  min-width: 0;
}

.tcrn-surface,
.tcrn-detail-inspector,
.tcrn-status-summary-panel,
.tcrn-confirm-dialog,
.tcrn-detail-drawer,
.tcrn-action-drawer {
  display: grid;
  gap: var(--tcrn-space-2h);
}

/* Surface heading/actions keep their own bounds even in a nested narrow card. */
.tcrn-surface__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--tcrn-space-3);
  min-inline-size: 0;
  max-inline-size: 100%;
}
.tcrn-surface__head > * {
  min-inline-size: 0;
  max-inline-size: 100%;
  overflow-wrap: anywhere;
}
.tcrn-surface__head-content { flex: 1 1 50%; }
.tcrn-surface__head-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--tcrn-space-2);
}
.tcrn-surface__head :is(h2,h3) { margin: 0; }
/* A Heading in a surface head keeps the contract scale it was given; a plain h2 or h3
   there takes the surface heading size. */
.tcrn-surface__head :is(h2,h3):not(.tcrn-heading) { font-size: var(--tcrn-type-size-heading-3); }`;

export const baseCss29 = `

/* Feedback state view */
.tcrn-state-view {
  display: grid;
  gap: var(--tcrn-space-2);
}

.tcrn-state-view h3,
.tcrn-state-view p {
  margin: 0;
}
.tcrn-state-view--neutral {
  border-color: var(--tcrn-color-brand-neutral);
  color: var(--tcrn-color-text-secondary);
}
.tcrn-state-view--positive {
  border-color: var(--tcrn-color-state-ready);
  color: var(--tcrn-color-state-ready);
}
.tcrn-state-view--warning {
  border-color: var(--tcrn-color-state-warning);
  color: var(--tcrn-color-state-warning);
}
.tcrn-state-view--danger {
  border-color: var(--tcrn-color-state-blocked);
  color: var(--tcrn-color-state-blocked);
}

/* Feedback skeleton */
.tcrn-skeleton,
.tcrn-skeleton-group {
  display: block;
  max-width: 100%;
}

.tcrn-skeleton {
  position: relative;
  overflow: hidden;
  min-height: 18px;
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-color-surface-muted);
}

.tcrn-skeleton::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.62), transparent);
  animation: tcrn-skeleton-shimmer var(--tcrn-motion-skeleton-loop) infinite;
}

.tcrn-skeleton--text {
  width: 100%;
  height: 1em;
}

.tcrn-skeleton--rectangular {
  width: 100%;
  height: 56px;
}

.tcrn-skeleton--circular {
  width: 40px;
  height: 40px;
  border-radius: var(--tcrn-radius-pill);
}

.tcrn-skeleton-group {
  display: grid;
  gap: var(--tcrn-space-2);
}

.tcrn-skeleton-group .tcrn-skeleton:last-child {
  width: 72%;
}

@keyframes tcrn-skeleton-shimmer {
  100% {
    transform: translateX(100%);
  }
}

/* Feedback state surface */
.tcrn-state-surface {
  display: grid;
  place-items: center;
  gap: var(--tcrn-space-2);
  text-align: center;
  min-height: 144px;
  color: var(--tcrn-color-text-secondary);
}

.tcrn-state-surface__icon {
  color: var(--tcrn-color-text-muted);
}

.tcrn-state-surface__title,
.tcrn-state-surface__description {
  margin: 0;
}

.tcrn-state-surface--warning .tcrn-state-surface__title,
.tcrn-state-surface--warning .tcrn-state-surface__icon {
  color: var(--tcrn-color-state-warning);
}

.tcrn-state-surface--danger .tcrn-state-surface__title,
.tcrn-state-surface--danger .tcrn-state-surface__icon {
  color: var(--tcrn-color-state-blocked);
}

.tcrn-state-surface__action {
  display: flex;
  gap: var(--tcrn-space-2);
  margin-top: var(--tcrn-space-2);
}

/* Overlay tooltip — genuine :hover / :focus-within reveal only. The storybook
   static-preview hook (a docs-only attribute variant the component never emits) stays in
   the docs demo layer. */
.tcrn-tooltip {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: fit-content;
}

.tcrn-tooltip__content {
  position: absolute;
  z-index: var(--tcrn-z-popover);
  pointer-events: none;
  width: max-content;
  max-width: min(260px, calc(100vw - var(--tcrn-space-4)));
  overflow-wrap: anywhere;
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-color-text-primary);
  color: var(--tcrn-color-surface-panel);
  padding: var(--tcrn-space-1h) var(--tcrn-space-2);
  font-size: var(--tcrn-type-size-meta);
  line-height: 1.35;
  opacity: 0;
  transform: translateY(4px);
  transition: opacity var(--tcrn-motion-standard), transform var(--tcrn-motion-standard);
  box-shadow: var(--tcrn-elevation-floating);
}

.tcrn-tooltip:hover .tcrn-tooltip__content,
.tcrn-tooltip:focus-within .tcrn-tooltip__content {
  opacity: 1;
  transform: translateY(0);
}

.tcrn-tooltip[data-placement="top"] .tcrn-tooltip__content {
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translate(-50%, 4px);
}

.tcrn-tooltip[data-placement="top"]:hover .tcrn-tooltip__content,
.tcrn-tooltip[data-placement="top"]:focus-within .tcrn-tooltip__content {
  transform: translate(-50%, 0);
}

.tcrn-tooltip[data-placement="bottom"] .tcrn-tooltip__content {
  top: calc(100% + 6px);
  left: 50%;
  transform: translate(-50%, -4px);
}

.tcrn-tooltip[data-placement="bottom"]:hover .tcrn-tooltip__content,
.tcrn-tooltip[data-placement="bottom"]:focus-within .tcrn-tooltip__content {
  transform: translate(-50%, 0);
}

.tcrn-tooltip[data-placement="right"] .tcrn-tooltip__content {
  top: 50%;
  left: calc(100% + 8px);
  transform: translate(-4px, -50%);
}

.tcrn-tooltip[data-placement="right"]:hover .tcrn-tooltip__content,
.tcrn-tooltip[data-placement="right"]:focus-within .tcrn-tooltip__content {
  transform: translate(0, -50%);
}

.tcrn-tooltip[data-placement="left"] .tcrn-tooltip__content {
  top: 50%;
  right: calc(100% + 8px);
  transform: translate(4px, -50%);
}

.tcrn-tooltip[data-placement="left"]:hover .tcrn-tooltip__content,
.tcrn-tooltip[data-placement="left"]:focus-within .tcrn-tooltip__content {
  transform: translate(0, -50%);
}

/* Layout collapsible + disclosure */
.tcrn-collapsible-region {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0.4;
  transition: grid-template-rows var(--tcrn-motion-emphasis), opacity var(--tcrn-motion-standard);
}

.tcrn-collapsible-region[data-expanded="true"] {
  grid-template-rows: 1fr;
  opacity: 1;
}

.tcrn-collapsible-region[aria-hidden="true"] {
  visibility: hidden;
}

.tcrn-collapsible-region__inner {
  min-height: 0;
  overflow: hidden;
}

.tcrn-disclosure-panel {
  display: grid;
  gap: var(--tcrn-space-2);
}

.tcrn-disclosure-panel__title {
  margin: 0;
}`;

export const baseCss30 = `

/*
 * Navigation breadcrumb: the trail, and the page header's first row (TCRN-DS-SUB-124, STORY-143
 * GWT4; 07b board .ts-crumbs and section D row 面包屑). One line at every width: the separators
 * keep their size, a crumb that does not fit gives way and ends in an ellipsis, and every crumb
 * carries its label as a title. The separators are ink-3, the ancestors ink-2 and the page itself
 * ink at the strong weight.
 */
.tcrn-breadcrumb {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: var(--tcrn-space-1h);
  min-width: 0;
  overflow: hidden;
  color: var(--tcrn-color-text-muted);
  font-size: var(--tcrn-type-size-meta);
  white-space: nowrap;
}
.tcrn-breadcrumb__item {
  display: flex;
  flex: 0 1 auto;
  flex-wrap: nowrap;
  align-items: center;
  gap: var(--tcrn-space-1h);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tcrn-breadcrumb__separator {
  flex: none;
}
.tcrn-breadcrumb__crumb {
  --tcrn-pair-crumb-ink-s: var(--tcrn-color-ink);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* The page itself is ink at the strong weight; the state rule reads the crumb's pair and
   writes no colour of its own (C2, TCRN-DS-SUB-155). */
.tcrn-breadcrumb__crumb:where([aria-current="page"]) {
  color: var(--tcrn-pair-crumb-ink-s);
  font-weight: var(--tcrn-type-weight-strong);
}

/* An ancestor crumb is a link (it once rendered as an inert span, so there was nothing
   to style). Quiet by default and underlined on hover: the trail is chrome, and a row of
   permanently underlined links competes with the page title it sits above. The quiet
   link for other chrome positions is the quiet variant of the link pair table
   (tcrn-link tcrn-link--quiet, generated from contract/typography.json). */
.tcrn-breadcrumb a {
  --tcrn-pair-crumb-ink-d: var(--tcrn-color-ink-2);
  --tcrn-pair-crumb-ink-h: var(--tcrn-color-acc);
  --tcrn-pair-crumb-ink: var(--tcrn-pair-crumb-ink-d);
  color: var(--tcrn-pair-crumb-ink);
  text-decoration: none;
}
.tcrn-breadcrumb a:where(:hover) {
  --tcrn-pair-crumb-ink: var(--tcrn-pair-crumb-ink-h);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.2em;
}

/* Pagination container. The component supplies only a truthful range and links from
   consumer-provided cursor data; it never invents page numbers. */
.tcrn-pagination {
  display: flex;
  align-items: center;
  gap: var(--tcrn-space-2);
}
.tcrn-pagination__range {
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-meta);
  font-variant-numeric: tabular-nums;
}
.tcrn-pagination__range b {
  color: var(--tcrn-color-text-primary);
  font-weight: var(--tcrn-type-weight-medium);
}
.tcrn-pagination__next {
  margin-inline-start: auto;
  font-size: var(--tcrn-type-size-meta);
}

/* Navigation tab families — .tcrn-filter-bar stays doc-side (already package-owned via
   the scoped .tcrn-table-toolbar .tcrn-filter-bar rule; introducing a top-level
   .tcrn-filter-bar here would trip the shell-fidelity duplicate-selector gate). */

/* TCRN-DS-STORY-063: interactive feedback family completion. Every clickable navigation / row /
   tab / button surface now answers hover + keyboard focus, and the pressable button families
   answer the press — matching the shell control language (surface-muted hover, focus-ring
   outline, press-scale). Previously these had no hover and fell to the UA default focus ring
   outside the product-shell scope. */
/* Hover is half a step toward selection in the same material, so the two states
   read as one scale rather than as two unrelated effects. */
.tcrn-quick-filters > a:hover {
  background: var(--tcrn-selection-fill-hover);
  color: var(--tcrn-color-text-primary);
}
/* SubNav, TocRail and TreeNav (Navigation, TCRN-DS-SUB-155): hover, selection and focus switch
   the row's pair at its base rule's specificity, after it; selection comes after hover, so it
   wins (C2; C6: the 6% wash and the strong weight). The focus ring is the edge pair, over a
   transparent outline that only forced colours paint. */
.tcrn-sub-nav > a:where(:hover) {
  --tcrn-pair-subnav-fill: var(--tcrn-pair-subnav-fill-h);
  --tcrn-pair-subnav-ink: var(--tcrn-pair-subnav-ink-h);
}
.tcrn-sub-nav > a:where([data-selected="true"]),
.tcrn-sub-nav > span:where([data-selected="true"]) {
  --tcrn-pair-subnav-fill: var(--tcrn-pair-subnav-fill-s);
  --tcrn-pair-subnav-ink: var(--tcrn-pair-subnav-ink-s);
  font-weight: var(--tcrn-type-weight-strong);
}
.tcrn-sub-nav > a:where(:focus-visible) {
  --tcrn-pair-subnav-edge: var(--tcrn-pair-subnav-edge-f);
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.tcrn-toc-rail nav > a:where(:hover) {
  --tcrn-pair-toc-fill: var(--tcrn-pair-toc-fill-h);
  --tcrn-pair-toc-ink: var(--tcrn-pair-toc-ink-h);
}
.tcrn-toc-rail nav > a:where([data-selected="true"]),
.tcrn-toc-rail nav > span:where([data-selected="true"]) {
  --tcrn-pair-toc-fill: var(--tcrn-pair-toc-fill-s);
  --tcrn-pair-toc-ink: var(--tcrn-pair-toc-ink-s);
  font-weight: var(--tcrn-type-weight-strong);
}
.tcrn-toc-rail nav > a:where(:focus-visible) {
  --tcrn-pair-toc-edge: var(--tcrn-pair-toc-edge-f);
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.tcrn-tree-nav__item > a:where(:focus-visible) {
  --tcrn-pair-tree-edge: var(--tcrn-pair-tree-edge-f);
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.tcrn-record-row[href]:hover {
  border-color: var(--tcrn-color-border-control);
  color: var(--tcrn-color-text-primary);
}
.tcrn-quick-filters > a:focus-visible,
.tcrn-record-row[href]:focus-visible,
.tcrn-search-result-list__head a:focus-visible {
  outline: 2px solid var(--tcrn-color-focus-ring);
  outline-offset: 2px;
}
/* SearchResultList head anchor previously had no color/decoration at all — bare UA blue
   for package consumers. It reads as an inline result link: brand ink + quiet underline that
   answers hover. */
.tcrn-search-result-list__head a {
  color: var(--tcrn-color-brand-primary);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.2em;
  text-decoration-color: color-mix(in srgb, var(--tcrn-color-brand-primary) 35%, transparent);
}
.tcrn-search-result-list__head a:hover {
  text-decoration-color: var(--tcrn-color-brand-primary);
}`;

export const baseCss31 = `

.tcrn-stat-card {
  display: grid;
  gap: var(--tcrn-space-1);
  min-width: 0;
  padding: var(--tcrn-space-3);
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  background: var(--tcrn-color-surface-panel);
}
.tcrn-stat-card__label,
.tcrn-stat-card__note {
  min-width: 0;
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-meta);
  line-height: var(--tcrn-type-line-caption);
}
.tcrn-stat-card__value {
  min-width: 0;
  color: var(--tcrn-color-text-primary);
  font-size: var(--tcrn-type-size-heading-2);
  line-height: var(--tcrn-type-line-section);
  overflow-wrap: anywhere;
}
.tcrn-stat-card--positive .tcrn-stat-card__value {
  color: var(--tcrn-color-state-ready);
}
.tcrn-stat-card--warning .tcrn-stat-card__value {
  color: var(--tcrn-color-state-warning);
}
.tcrn-stat-card--danger .tcrn-stat-card__value {
  color: var(--tcrn-color-state-blocked);
}

.tcrn-setting-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(180px, 0.8fr) max-content;
  gap: var(--tcrn-space-3);
  align-items: center;
  min-width: 0;
  padding-block: var(--tcrn-space-2);
  border-block-end: 1px solid var(--tcrn-color-border-subtle);
}
.tcrn-setting-row[data-transient-target="true"] {
  border-block-end-color: var(--tcrn-selection-edge);
  background: var(--tcrn-selection-fill);
}
.tcrn-setting-row__label,
.tcrn-setting-row__control,
.tcrn-setting-row__tools {
  min-width: 0;
}
.tcrn-setting-row__label {
  display: grid;
  gap: var(--tcrn-space-0h);
}
.tcrn-setting-row__key {
  color: var(--tcrn-color-text-tertiary);
  font-family: var(--tcrn-type-family-mono);
  font-size: var(--tcrn-type-size-meta);
}
.tcrn-setting-row__name {
  color: var(--tcrn-color-text-primary);
  font-weight: var(--tcrn-type-weight-medium);
}
.tcrn-setting-row__description {
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-meta);
  line-height: var(--tcrn-type-line-caption);
}
.tcrn-setting-row__control {
  display: flex;
  justify-content: flex-start;
}
.tcrn-setting-row__tools {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--tcrn-space-2);
}
.tcrn-setting-row__modified {
  inline-size: var(--tcrn-state-dot-size);
  block-size: var(--tcrn-state-dot-size);
  border-radius: 50%;
  background: var(--tcrn-color-state-warning);
}
.tcrn-setting-row__reset {
  min-height: 32px;
  padding-inline: var(--tcrn-space-2);
  border: 1px solid var(--tcrn-color-border-control);
  border-radius: var(--tcrn-radius-control);
  background: transparent;
  color: var(--tcrn-color-text-secondary);
  font: inherit;
  cursor: pointer;
}
.tcrn-setting-row__reset:hover {
  border-color: var(--tcrn-color-brand-primary);
  color: var(--tcrn-color-brand-primary);
}`;

export const baseCss32 = `

.tcrn-line-numbered-editor {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--tcrn-color-border-control);
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-color-surface-panel);
}
.tcrn-line-numbered-editor__gutter {
  min-inline-size: 44px;
  max-block-size: 260px;
  margin: 0;
  padding: var(--tcrn-space-2) var(--tcrn-space-2) var(--tcrn-space-2) var(--tcrn-space-1);
  overflow: hidden;
  border-inline-end: 1px solid var(--tcrn-color-border-subtle);
  color: var(--tcrn-color-text-tertiary);
  font-family: var(--tcrn-type-family-mono);
  font-size: var(--tcrn-type-size-meta);
  line-height: var(--tcrn-type-line-ui);
  list-style: none;
  text-align: end;
  user-select: none;
}
.tcrn-line-numbered-editor__gutter li {
  min-block-size: var(--tcrn-type-line-ui);
}
.tcrn-line-numbered-editor__gutter li[data-editor-line-finding="true"] {
  color: var(--tcrn-color-state-warning);
  font-weight: var(--tcrn-type-weight-strong);
}
.tcrn-line-numbered-editor__gutter li.tcrn-line-numbered-editor__line--danger {
  color: var(--tcrn-color-state-blocked);
}
.tcrn-line-numbered-editor__content {
  display: grid;
  gap: var(--tcrn-space-2);
  min-width: 0;
}
.tcrn-line-numbered-editor__control {
  min-block-size: 260px;
  resize: vertical;
  border: 0;
  border-radius: 0;
  background: transparent;
  font-family: var(--tcrn-type-family-mono);
  line-height: var(--tcrn-type-line-ui);
}
.tcrn-line-numbered-editor__control:focus-visible {
  outline: 3px solid var(--tcrn-color-focus-ring);
  outline-offset: -3px;
}
.tcrn-line-numbered-editor__findings {
  display: grid;
  gap: var(--tcrn-space-1);
  margin: 0;
  padding: 0 var(--tcrn-space-2) var(--tcrn-space-2);
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-meta);
  list-style: none;
}
.tcrn-line-numbered-editor__finding--warning,
.tcrn-line-numbered-editor__finding--danger {
  color: var(--tcrn-color-state-warning);
}
.tcrn-line-numbered-editor__finding--danger {
  color: var(--tcrn-color-state-blocked);
}
.tcrn-line-numbered-editor__finding-line {
  margin-inline-end: var(--tcrn-space-2);
  font-family: var(--tcrn-type-family-mono);
  font-weight: var(--tcrn-type-weight-strong);
}

.tcrn-app-status-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--tcrn-space-2) var(--tcrn-space-3);
  min-width: 0;
  padding: var(--tcrn-space-2) var(--tcrn-space-3);
  border-block-start: 1px solid var(--tcrn-color-border-subtle);
  background: var(--tcrn-color-surface-muted);
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-meta);
}
.tcrn-app-status-bar__command {
  min-width: 0;
  color: var(--tcrn-color-text-secondary);
  font-family: var(--tcrn-type-family-mono);
  overflow-wrap: anywhere;
}
.tcrn-app-status-bar__state {
  min-width: 0;
  color: var(--tcrn-color-text-primary);
  font-weight: var(--tcrn-type-weight-medium);
}
.tcrn-app-status-bar__action {
  margin-inline-start: auto;
}

.tcrn-definition-list {
  display: grid;
  container-type: inline-size;
  container-name: tcrn-definition-list;
  gap: var(--tcrn-space-3);
  margin: 0;
}
.tcrn-definition-list__item {
  display: grid;
  grid-template-columns: minmax(120px, 0.35fr) minmax(0, 1fr);
  gap: var(--tcrn-space-3);
  min-width: 0;
}
.tcrn-definition-list__term {
  min-inline-size: 0;
  overflow-wrap: anywhere;
  color: var(--tcrn-color-text-secondary);
  font-weight: var(--tcrn-type-weight-medium);
}
.tcrn-definition-list__definition {
  min-width: 0;
  margin: 0;
  color: var(--tcrn-color-text-primary);
  overflow-wrap: anywhere;
}
.tcrn-definition-list--dense {
  gap: var(--tcrn-space-1);
}
.tcrn-definition-list--dense .tcrn-definition-list__item {
  gap: var(--tcrn-space-2);
}
/* A detail card can be narrow inside a wide viewport. Apply the existing
   760px detail stacking boundary to its actual mother as well. */
@container tcrn-definition-list (max-width: 760px) {
  .tcrn-definition-list__item {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--tcrn-space-1);
  }
}

.tcrn-lock-hint {
  display: inline-flex;
  align-items: flex-start;
  gap: var(--tcrn-space-1);
  max-inline-size: 100%;
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-meta);
  line-height: var(--tcrn-type-line-caption);
}
.tcrn-lock-hint__icon {
  flex: 0 0 auto;
  color: var(--tcrn-color-state-warning);
}
.tcrn-lock-hint__text {
  min-width: 0;
  overflow-wrap: anywhere;
}

@media (max-width: 760px) {
  .tcrn-setting-row {
    grid-template-columns: minmax(0, 1fr) max-content;
  }

  .tcrn-setting-row__control {
    grid-column: 1 / -1;
    grid-row: 2;
  }

  .tcrn-setting-row__tools {
    grid-column: 2;
    grid-row: 1;
  }

  .tcrn-definition-list__item {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--tcrn-space-1);
  }
}

/* Overlay dialog + popover grid (.alpha-overlay-demo__dialog stays doc-side) */
.tcrn-dialog,
.tcrn-popover {
  display: grid;
  gap: var(--tcrn-space-2h);
}

.tcrn-popover {
  z-index: var(--tcrn-z-popover);
  max-width: 420px;
  border-color: color-mix(in srgb, var(--tcrn-color-brand-primary) 24%, transparent);
  box-shadow: var(--tcrn-elevation-floating);
}
/* Reduced-motion + forced-colors handling for the relocated component families. */
@media (prefers-reduced-motion: reduce) {
  .tcrn-skeleton::after {
    animation: none;
    opacity: 0;
  }

  .tcrn-tooltip__content,
  .tcrn-collapsible-region {
    transition: none;
  }
}`;

export const baseCss33 = `

.tcrn-card {
  display: flex;
  flex-direction: column;
  gap: var(--tcrn-space-3);
  padding: var(--tcrn-space-4);
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-panel);
  background: var(--tcrn-color-surface-panel);
}
.tcrn-card--raised { box-shadow: var(--tcrn-elevation-floating); }
.tcrn-card--quiet { background: var(--tcrn-color-surface-muted); border-color: transparent; }
.tcrn-card--interactive { cursor: pointer; }
.tcrn-card--interactive:focus-visible {
  outline: 2px solid var(--tcrn-color-focus-ring);
  outline-offset: 2px;
}

.tcrn-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 50%;
  background: var(--tcrn-color-surface-muted);
  color: var(--tcrn-color-text-secondary);
  font-weight: 600;
  flex: none;
}
.tcrn-avatar--small { inline-size: 24px; block-size: 24px; font-size: var(--tcrn-type-size-caption); }
.tcrn-avatar--medium { inline-size: 32px; block-size: 32px; font-size: var(--tcrn-type-size-meta); }
.tcrn-avatar--large { inline-size: 48px; block-size: 48px; font-size: var(--tcrn-type-size-ui); }
.tcrn-avatar__image { inline-size: 100%; block-size: 100%; object-fit: cover; }

.tcrn-progress {
  position: relative;
  overflow: hidden;
  block-size: var(--tcrn-space-2);
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-color-surface-muted);
}
.tcrn-progress__fill {
  display: block;
  block-size: 100%;
  background: var(--tcrn-color-brand-primary);
}
.tcrn-progress--indeterminate .tcrn-progress__fill {
  inline-size: 40%;
  animation: tcrn-progress-slide 1.2s linear infinite;
}
@keyframes tcrn-progress-slide {
  from { transform: translateX(-100%); }
  to { transform: translateX(250%); }
}
@media (prefers-reduced-motion: reduce) {
  .tcrn-progress--indeterminate .tcrn-progress__fill { animation: none; inline-size: 100%; opacity: 0.5; }
}

.tcrn-stepper__list {
  display: flex;
  gap: var(--tcrn-space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}
.tcrn-stepper__step {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: var(--tcrn-space-2);
  color: var(--tcrn-color-text-secondary);
}
.tcrn-stepper__step--current { color: var(--tcrn-color-text-primary); font-weight: 600; }
.tcrn-stepper__marker {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 24px;
  block-size: 24px;
  border-radius: 50%;
  border: 1px solid currentColor;
  font-size: var(--tcrn-type-size-caption);
}
.tcrn-stepper__step--complete .tcrn-stepper__marker {
  background: var(--tcrn-color-brand-primary);
  border-color: var(--tcrn-color-brand-primary);
  color: var(--tcrn-color-text-inverse);
}
.tcrn-stepper__description { grid-column: 2; font-size: var(--tcrn-type-size-caption); }`;

export const baseCss34 = `

/*
 * Tabs, one family (TCRN-DS-SUB-124, STORY-143 GWT2). The ARIA tabs that swap a panel (panel
 * variant), the module, section and view navs (nav variant) and the segmented nav (segmented
 * variant) render one block. A row of tabs is one control, so the row carries one frame, the
 * track; the tabs inside it are frameless, keep to one line and truncate with their label as a
 * title, and the track scrolls itself, not the page, when they do not fit.
 *
 * Selection is the family's one structural change: the chosen tab takes the 6% ink wash and the
 * strong weight, and nothing is added on top: no edge, no axis, no lift, no brand colour. The
 * state rules only switch the tab's pair (ink-2 at rest, ink on the 3.5% hover wash, ink on the
 * 6% wash when selected, ink-3 when disabled) and selected comes after hover, so it wins. The
 * focus ring is the tab's own outline, drawn inside it, which the focus state only widens.
 */
.tcrn-tabs {
  min-width: 0;
  max-width: 100%;
}
.tcrn-tabs--panel {
  display: grid;
  gap: var(--tcrn-space-3);
}
.tcrn-tabs__list,
.tcrn-tabs--nav,
.tcrn-tabs--segmented {
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: var(--tcrn-space-0h);
  min-width: 0;
  max-width: 100%;
  padding: var(--tcrn-space-0h);
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scrollbar-width: thin;
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  background: var(--tcrn-color-surface-panel);
}
.tcrn-tabs__list {
  justify-self: start;
}
.tcrn-tabs__tab {
  --tcrn-pair-tab-fill-d: transparent;
  --tcrn-pair-tab-ink-d: var(--tcrn-color-ink-2);
  --tcrn-pair-tab-fill-h: var(--tcrn-color-hover);
  --tcrn-pair-tab-ink-h: var(--tcrn-color-ink);
  --tcrn-pair-tab-fill-s: var(--tcrn-color-wash);
  --tcrn-pair-tab-ink-s: var(--tcrn-color-ink);
  --tcrn-pair-tab-ink-x: var(--tcrn-color-ink-3);
  --tcrn-pair-tab-fill: var(--tcrn-pair-tab-fill-d);
  --tcrn-pair-tab-ink: var(--tcrn-pair-tab-ink-d);
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: var(--tcrn-space-2);
  min-width: 0;
  max-width: 100%;
  min-height: var(--tcrn-control-height-md);
  padding: 0 var(--tcrn-space-2h);
  border: 0;
  border-radius: var(--tcrn-radius-control);
  outline: 0 solid var(--tcrn-color-focus-ring);
  outline-offset: -2px;
  background: var(--tcrn-pair-tab-fill);
  color: var(--tcrn-pair-tab-ink);
  font: inherit;
  font-size: var(--tcrn-type-size-ui);
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
}
.tcrn-tabs__label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tcrn-tabs__tab:where(:hover, [data-tcrn-preview-state~="hover"]) {
  --tcrn-pair-tab-fill: var(--tcrn-pair-tab-fill-h);
  --tcrn-pair-tab-ink: var(--tcrn-pair-tab-ink-h);
}
.tcrn-tabs__tab:where([data-selected="true"]) {
  --tcrn-pair-tab-fill: var(--tcrn-pair-tab-fill-s);
  --tcrn-pair-tab-ink: var(--tcrn-pair-tab-ink-s);
  font-weight: var(--tcrn-type-weight-strong);
}
.tcrn-tabs__tab:where(:disabled, [aria-disabled="true"]) {
  --tcrn-pair-tab-fill: var(--tcrn-pair-tab-fill-d);
  --tcrn-pair-tab-ink: var(--tcrn-pair-tab-ink-x);
  cursor: not-allowed;
}
.tcrn-tabs__tab:where(:focus-visible, [data-tcrn-preview-state~="focus"]) {
  outline-width: 2px;
}
.tcrn-tabs__panel {
  min-width: 0;
  outline: 0 solid var(--tcrn-color-focus-ring);
  outline-offset: 2px;
}
.tcrn-tabs__panel:where(:focus-visible) {
  outline-width: 2px;
}

.tcrn-menu {
  display: flex;
  flex-direction: column;
  min-inline-size: 12rem;
  padding: var(--tcrn-space-1);
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-panel);
  background: var(--tcrn-color-surface-panel);
  box-shadow: var(--tcrn-elevation-floating);
}
.tcrn-menu__item {
  padding: var(--tcrn-space-2) var(--tcrn-space-3);
  border: 0;
  background: none;
  text-align: start;
  cursor: pointer;
  border-radius: var(--tcrn-radius-control);
}
.tcrn-menu__item--active { background: var(--tcrn-color-surface-muted); }
.tcrn-menu__item:disabled { color: var(--tcrn-color-text-muted); cursor: not-allowed; }
.tcrn-menu__item:focus-visible { outline: 2px solid var(--tcrn-color-focus-ring); outline-offset: -2px; }

.tcrn-toast {
  display: flex;
  align-items: center;
  gap: var(--tcrn-space-3);
  padding: var(--tcrn-space-3) var(--tcrn-space-4);
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-panel);
  background: var(--tcrn-color-surface-panel);
}
.tcrn-toast--positive { border-color: var(--tcrn-color-state-ready); }
.tcrn-toast--warning { border-color: var(--tcrn-color-state-warning); }
.tcrn-toast--danger { border-color: var(--tcrn-color-state-blocked); }
.tcrn-toast__message { flex: 1; }
.tcrn-toast__dismiss { border: 0; background: none; cursor: pointer; padding: var(--tcrn-space-1); }`;

export const baseCss35 = `

.tcrn-tree, .tcrn-tree__group { list-style: none; margin: 0; padding: 0; }
.tcrn-tree__group { padding-inline-start: var(--tcrn-space-4); }
.tcrn-tree__row { display: flex; align-items: center; gap: var(--tcrn-space-1); }
.tcrn-tree__toggle { border: 0; background: none; cursor: pointer; padding: 0; inline-size: 1.25rem; }
.tcrn-tree__toggle--leaf { visibility: hidden; }
.tcrn-tree__label { border: 0; background: none; cursor: pointer; text-align: start; padding: var(--tcrn-space-1); }
.tcrn-tree__item[aria-selected="true"] > .tcrn-tree__row { background: var(--tcrn-color-surface-muted); }

.tcrn-data-grid { inline-size: 100%; border-collapse: collapse; }
.tcrn-data-grid th, .tcrn-data-grid td { padding: var(--tcrn-space-2) var(--tcrn-space-3); text-align: start; border-block-end: 1px solid var(--tcrn-color-border-subtle); }
.tcrn-data-grid__sort { border: 0; background: none; cursor: pointer; font: inherit; padding: 0; }`;

export const baseCss36 = `

/* DS-106/107 settings contract. */
.tcrn-setting-choice{display:grid;gap:var(--tcrn-space-1);min-inline-size:0;max-inline-size:100%}
.tcrn-setting-choice__select-label{display:grid;gap:var(--tcrn-space-1);min-inline-size:0;color:var(--tcrn-color-text-primary);font-weight:var(--tcrn-type-weight-medium)}`;

export const baseCss37 = `
.tcrn-setting-choice__hint,.tcrn-setting-choice__error{overflow-wrap:anywhere;font-size:var(--tcrn-type-size-meta);line-height:var(--tcrn-type-line-caption)}
.tcrn-setting-choice__hint{color:var(--tcrn-color-text-secondary)}.tcrn-setting-choice__error{color:var(--tcrn-color-state-blocked)}`;

export const baseCss38 = `
/* A settings page's content is at most the layout content width and centred in the paper
   (MIN-20261013-SHELL D1, TCRN-DS-SUB-130); its edges are measured from the paper's content edge. */
.tcrn-settings-layout{inline-size:100%;min-inline-size:0;max-inline-size:var(--tcrn-layout-content-max-w);margin-inline:auto}
.tcrn-settings-layout__frame{container:tcrn-settings-layout-frame/inline-size;min-inline-size:0}
.tcrn-settings-layout__grid{display:grid;grid-template-columns:minmax(0,1fr);gap:var(--tcrn-space-4);min-inline-size:0}
.tcrn-settings-layout__nav{min-inline-size:0;max-inline-size:100%;overflow-x:auto}
.tcrn-settings-layout__nav>.tcrn-tabs{flex-wrap:nowrap;max-inline-size:max-content}
.tcrn-settings-layout__content{display:grid;gap:var(--tcrn-space-4);min-inline-size:0;container:tcrn-settings-content/inline-size}
.tcrn-settings-layout__form{display:grid;gap:var(--tcrn-space-2);min-inline-size:0}
.tcrn-settings-layout__form>.tcrn-setting-row-list{display:grid;grid-template-columns:minmax(0,1fr);min-inline-size:0}
.tcrn-settings-layout__form .tcrn-setting-row-list .tcrn-setting-row{display:grid;grid-column:1/-1;grid-template-columns:minmax(0,1fr);gap:var(--tcrn-space-2)}
.tcrn-settings-layout__form .tcrn-setting-row-list .tcrn-setting-row__tools:empty{display:none}
.tcrn-settings-layout__form .tcrn-setting-row{grid-template-columns:minmax(0,1fr);gap:var(--tcrn-space-2);overflow-wrap:anywhere}
.tcrn-settings-layout__form .tcrn-setting-row__control{inline-size:100%;grid-column:auto;grid-row:auto}
.tcrn-settings-layout__form .tcrn-setting-row__tools{grid-column:auto;grid-row:auto}
.tcrn-settings-layout__form .tcrn-setting-row__control>:is(.tcrn-input,.tcrn-select,.tcrn-select-wrap,.tcrn-date-picker-wrap,.tcrn-field,.tcrn-setting-choice,.tcrn-number-input-field,.tcrn-multi-select-group,.tcrn-multi-select-dropdown){inline-size:100%;min-inline-size:0}`;

export const baseCss39 = `
@container tcrn-settings-layout-frame (min-width:960px){.tcrn-settings-layout__grid{grid-template-columns:minmax(0,var(--tcrn-container-settings-local-nav)) minmax(0,1fr)}}
@container tcrn-settings-content (min-width:720px){
  /* The complete form also shares tracks for the supported direct-row API.
     Other children still span the form; an explicit list owns its own tracks. */
  .tcrn-settings-layout__form,.tcrn-settings-layout__form .tcrn-setting-row{grid-template-columns:minmax(0,1fr) minmax(var(--tcrn-container-settings-control-min),.8fr) max-content}
  .tcrn-settings-layout__form .tcrn-setting-row-list{grid-template-columns:minmax(0,1fr) minmax(var(--tcrn-container-settings-control-min),.8fr) max-content}
  .tcrn-settings-layout__form>*{grid-column:1/-1}
  .tcrn-settings-layout__form>.tcrn-setting-row,.tcrn-settings-layout__form .tcrn-setting-row-list .tcrn-setting-row{grid-template-columns:subgrid}
  .tcrn-settings-layout__form .tcrn-setting-row__tools{justify-content:flex-end}
}

/* DS-113/114/115 full-surface boundary and content rules. These follow the settings
   contract marker so Storybook's global package CSS carries them once while the
   scoped legacy copy remains bounded. */
.tcrn-tooltip__content[data-tooltip-portal="true"],.tcrn-tooltip__content[data-overlay-positioning="static-fixed"]{position:fixed;transform:none;max-width:min(260px,calc(100vw - var(--tcrn-space-4)))}
.tcrn-tooltip__content[data-tooltip-portal="true"][data-tooltip-open="true"],.tcrn-tooltip__content[data-overlay-positioning="static-fixed"][data-tooltip-open="true"]{opacity:1}
.tcrn-dictionary-table{display:grid;gap:var(--tcrn-space-2);min-inline-size:0;max-inline-size:100%}
.tcrn-dictionary-table__category-description{margin:0}
.tcrn-dictionary-table table{inline-size:100%;border-collapse:collapse;min-inline-size:0}
.tcrn-dictionary-table th,.tcrn-dictionary-table td{padding:var(--tcrn-space-2) var(--tcrn-space-3);text-align:start;vertical-align:top;border-block-end:1px solid var(--tcrn-color-border-subtle)}
.tcrn-dictionary-table thead th{background:var(--tcrn-color-surface-muted);font-weight:var(--tcrn-type-weight-medium)}
.tcrn-dictionary-table tbody th{font-weight:var(--tcrn-type-weight-medium)}
.tcrn-dictionary-table tbody th code{display:block;color:var(--tcrn-color-text-tertiary);font-family:var(--tcrn-type-family-mono);font-size:var(--tcrn-type-size-meta);overflow-wrap:anywhere}
.tcrn-dictionary-table__label{display:block;margin-block-start:var(--tcrn-space-0h);color:var(--tcrn-color-text-primary)}
.tcrn-dictionary-table[data-dictionary-valid="false"]{border-inline-start:3px solid var(--tcrn-color-state-blocked);padding-inline-start:var(--tcrn-space-2)}
.tcrn-popover[data-overlay-positioning="portal-fixed"],.tcrn-popover[data-overlay-positioning="static-fixed"]{position:fixed;max-width:min(420px,calc(100vw - var(--tcrn-space-4)));max-height:calc(100vh - var(--tcrn-space-4));overflow:auto;overflow-wrap:anywhere}

/* DS-116/117 operation feedback and content-scope contracts. Both roots are
   min-content-safe so long consumer ids/copy wrap inside the surface instead
   of widening the document. The status remains a short StatusBadge; details
   and identity are readable regions owned by the consumer's supplied labels. */
.tcrn-operation-feedback,.tcrn-content-scope{display:grid;gap:var(--tcrn-space-2);min-inline-size:0;max-inline-size:100%;border:1px solid var(--tcrn-color-border-subtle);border-radius:var(--tcrn-radius-surface);background:var(--tcrn-color-surface-panel);padding:var(--tcrn-space-3)}
.tcrn-operation-feedback__summary{display:flex;align-items:flex-start;flex-wrap:wrap;gap:var(--tcrn-space-2);min-inline-size:0;max-inline-size:100%}
.tcrn-operation-feedback__status{flex:0 1 auto;min-inline-size:0}
.tcrn-operation-feedback__identity{display:grid;grid-template-columns:fit-content(40%) minmax(0,1fr);flex:1 1 240px;gap:var(--tcrn-space-1) var(--tcrn-space-2);min-inline-size:0;margin:0}
.tcrn-operation-feedback__identity-row{display:grid;grid-template-columns:subgrid;grid-column:1/-1;min-inline-size:0}
.tcrn-operation-feedback__identity dt{min-inline-size:0;overflow-wrap:anywhere;color:var(--tcrn-color-text-secondary);font-size:var(--tcrn-type-size-meta);font-weight:var(--tcrn-type-weight-medium)}
.tcrn-operation-feedback__identity dd{min-inline-size:0;margin:0;overflow-wrap:anywhere;word-break:break-word;color:var(--tcrn-color-text-primary)}
.tcrn-operation-feedback__details-trigger{flex:0 1 auto;max-inline-size:100%;min-block-size:36px;border:1px solid var(--tcrn-color-border-control);border-radius:var(--tcrn-radius-control);background:var(--tcrn-color-surface-muted);color:var(--tcrn-color-text-primary);padding:var(--tcrn-space-1) var(--tcrn-space-2);font:inherit;cursor:pointer;overflow-wrap:anywhere}
.tcrn-operation-feedback__details-trigger:focus-visible{outline:2px solid var(--tcrn-color-focus-ring);outline-offset:2px}
.tcrn-operation-feedback__details{min-inline-size:0;max-inline-size:100%}
.tcrn-operation-feedback__details-body{min-inline-size:0;max-inline-size:100%;overflow-wrap:anywhere;word-break:break-word}
.tcrn-operation-feedback__details-body p{max-inline-size:100%;overflow-wrap:anywhere}
.tcrn-operation-feedback__details-body pre{min-inline-size:0;max-inline-size:100%;margin:0;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;font-family:var(--tcrn-type-family-mono)}
.tcrn-content-scope__content{min-inline-size:0;max-inline-size:100%}
.tcrn-content-scope[data-content-valid="false"]{border-inline-start:3px solid var(--tcrn-color-state-blocked);padding-inline-start:var(--tcrn-space-2)}
.tcrn-content-scope[data-content-phase="loading"]{border-color:var(--tcrn-color-state-warning)}
.tcrn-content-scope[data-content-phase="error"]{border-color:var(--tcrn-color-state-blocked)}

/* DS-112 page hierarchy contract. */
.tcrn-page-hierarchy{display:grid;gap:var(--tcrn-space-4);min-inline-size:0;max-inline-size:100%}
.tcrn-page-hierarchy__header,.tcrn-page-hierarchy__section-tabs,.tcrn-page-hierarchy__lower-content,.tcrn-page-hierarchy__third-level-frame,.tcrn-page-hierarchy__third-level,.tcrn-page-hierarchy__content{min-inline-size:0;max-inline-size:100%}
.tcrn-page-hierarchy__section-tabs{display:block}
.tcrn-page-hierarchy__third-level-frame{container:tcrn-page-hierarchy-third-level/inline-size}
.tcrn-page-hierarchy__third-level{display:grid;grid-template-columns:minmax(0,1fr);gap:var(--tcrn-space-4)}
.tcrn-page-hierarchy__local-navigation{min-inline-size:0;max-inline-size:100%;overflow-x:auto}
.tcrn-page-hierarchy__content{display:grid;gap:var(--tcrn-space-3)}
@container tcrn-page-hierarchy-third-level (min-width:960px){.tcrn-page-hierarchy__third-level{grid-template-columns:minmax(0,var(--tcrn-container-page-third-level-nav)) minmax(0,1fr)}}
`;

// The retired parts' rules (TCRN-DS-SUB-125). Not a family segment: styles/index.ts joins it into
// tcrnRetiredComponentCss, never into tcrnComponentCss.
export const retiredNavigationCss01 = `
/*
 * Retired navigation and shell parts (TCRN-DS-SUB-125, STORY-143; MIN-20261013-SHELL D1: one shell,
 * the top band, with no resident side rail). SideNav, SideNavCollapseButton, MobileNavToggle, TopBar,
 * ProductLauncher and ProductSwitcher keep their deprecated exports through 4.0.x, but their rules
 * are no longer part of tcrnComponentCss: they are joined into tcrnRetiredComponentCss, which a
 * consumer still rendering them adds after tcrnComponentCss. Removed with the parts in 4.1.
 */
.tcrn-shell-side-nav-toggle {
  inline-size: 38px;
  block-size: 38px;
  min-inline-size: 38px;
  min-block-size: 38px;
  min-height: 38px;
  display: inline-grid;
  place-items: center;
  padding: 0;
}
.tcrn-shell-side-nav-toggle__icon {
  display: inline-grid;
  inline-size: 20px;
  block-size: 20px;
  place-items: center;
}
/*
 * Mobile-only, and hidden by default rather than shown by default: above the
 * breakpoint the navigation is always on screen, so a show/hide control there
 * would be the no-op the responsive standard forbids — the same reason its
 * width-collapse sibling is hidden below the breakpoint. Each control exists
 * exactly where it does something.
 */
.tcrn-shell-mobile-nav-toggle {
  display: none;
  place-items: center;
  padding: 0;
}
.tcrn-top-bar {
  display: grid;
  grid-template-columns: max-content max-content minmax(0, 1fr);
  align-items: center;
  gap: var(--tcrn-space-4);
  min-height: 68px;
  padding: var(--tcrn-space-3) var(--tcrn-space-5);
  border-bottom: 1px solid var(--tcrn-color-border-subtle);
  background: color-mix(in srgb, var(--tcrn-color-surface-panel), transparent 5%);
  backdrop-filter: blur(16px);
}
.tcrn-top-bar__brand {
  font-weight: var(--tcrn-type-weight-strong);
}
.tcrn-top-bar__module {
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-ui);
}
.tcrn-top-bar__actions {
  min-width: 0;
}
.tcrn-side-nav {
  display: flex;
  flex-direction: column;
  gap: var(--tcrn-space-4);
}
@media (max-width: 760px) {
  .tcrn-top-bar {
    grid-template-columns: 1fr;
    align-items: stretch;
  }
  .tcrn-shell-mobile-nav-toggle {
    display: inline-flex;
    /* Sole route to the whole IA on the one viewport where it is touched. */
    min-width: 44px;
    min-height: 44px;
  }
}
/* The same segmented track, for the button-based selectors. These previously
   said "selected" with a brand-tinted border plus a floating shadow — a lift,
   which competed with the shell's real elevation language. */
.tcrn-product-launcher,
.tcrn-product-switcher {
  display: inline-flex;
  flex-wrap: wrap;
  gap: var(--tcrn-space-0h);
  padding: var(--tcrn-space-0h);
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  background: var(--tcrn-color-surface-panel);
  min-width: 0;
  max-width: 100%;
}

.tcrn-product-launcher button,
.tcrn-product-switcher button {
  min-height: 34px;
  border: 1px solid transparent;
  border-radius: var(--tcrn-radius-control);
  background: transparent;
  color: var(--tcrn-color-text-secondary);
  padding: 0 var(--tcrn-space-2h);
  white-space: nowrap;
}

.tcrn-product-launcher button[data-selected="true"],
.tcrn-product-switcher button[data-selected="true"],
.tcrn-product-launcher button[aria-current="page"],
.tcrn-product-switcher button[aria-current="page"] {
  background: var(--tcrn-selection-fill);
  color: var(--tcrn-color-text-primary);
}
.tcrn-product-launcher button:hover,
.tcrn-product-switcher button:hover {
  background: var(--tcrn-selection-fill-hover);
  color: var(--tcrn-color-text-primary);
}
.tcrn-product-launcher button:focus-visible,
.tcrn-product-switcher button:focus-visible {
  outline: 2px solid var(--tcrn-color-focus-ring);
  outline-offset: 2px;
}
.tcrn-product-launcher button:active,
.tcrn-product-switcher button:active {
  transform: scale(var(--tcrn-motion-press-scale));
}
@media (prefers-reduced-motion: reduce) {
  .tcrn-product-launcher button:active,
  .tcrn-product-switcher button:active {
    transform: none;
  }
}`;
