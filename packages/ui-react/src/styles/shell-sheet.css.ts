// Sheet segment of tcrnComponentCss (TCRN-DS-SUB-126; TCRN-DS-INIT-016, C-7, C-8): the full menu
// as ShellMenu shows it on a viewport 390 wide or narrower (07a board, screens A7 and A8; 07b board,
// section D row "窄于 1024"). styles/index.ts joins it after the shell and the sign-in intro segments.
//
// The Sheet's root keeps tcrn-shell-menu, so its rows, group titles, pins, search and results are
// the full menu's rules (shell.css.ts, shellCss03); this segment only places the Sheet and re-sizes
// what the board re-sizes. The root lays out no box of its own (display: contents): the scrim and
// the Sheet are fixed to the viewport, the scrim over everything at 20% ink, the Sheet on the bottom
// edge, as wide as the viewport and at most 84% of it high, and never higher than the space below
// the top band. Its inset is space-2 at the top and sides and space-3 at the bottom, its top
// corners the paper radius, its fill the paper with the s3 shadow. Inside it the two shell tokens
// the board re-declares for the Sheet point at the touch token, shell.touch (44; 07b board,
// section F: shell.row-h and shell.srch-h, 44 under a coarse pointer, TCRN-DS-SUB-142), so every
// row and the search are 44 high here whatever the pointer; a pin keeps its 24 box and takes
// presses 44 across, as the nav-item pin does under a coarse pointer (base.css.ts). The list's scrollport reaches into the Sheet's side
// inset (its margin takes the inset back as padding, so the rows do not move), so the part of a
// pin's 44 that passes the row's end is not clipped. Rows keep the full menu's icon column, so a row
// without an icon starts its text where the others do. The grab line is a picture: 36 by space-1,
// the line-2 ink, a pill.
//
// Nothing here moves: the Sheet and the scrim fade in over the fill duration, opacity only (the
// full menu's keyframes), so a reading taken while they fade is the final geometry; under
// prefers-reduced-motion nothing animates. No rule here names a theme: the light and the night
// Sheet have the same rules and change only the token values. A backtick ends a segment early, so
// the comments in it never use one (scripts/css-template-integrity-proof.mjs checks every segment).
export const shellSheetCss01 = `
.tcrn-shell-menu.tcrn-shell-sheet {
  display: contents;
}
.tcrn-shell-sheet__scrim {
  position: fixed;
  inset: 0;
  z-index: var(--tcrn-z-overlay);
  background: color-mix(in srgb, var(--tcrn-color-ink) 20%, transparent);
  animation: tcrn-shell-menu-enter var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease) both;
}
.tcrn-shell-sheet__panel {
  --tcrn-shell-row-h: var(--tcrn-shell-touch);
  --tcrn-shell-srch-h: var(--tcrn-shell-touch);
  position: fixed;
  inset-inline: 0;
  inset-block-end: 0;
  z-index: var(--tcrn-z-overlay);
  display: flex;
  flex-direction: column;
  gap: var(--tcrn-space-0h);
  min-inline-size: 0;
  max-block-size: min(84%, calc(100% - var(--tcrn-shell-strip-h)));
  margin: 0;
  padding: var(--tcrn-space-2) var(--tcrn-space-2) var(--tcrn-space-3);
  overflow: hidden;
  border-radius: var(--tcrn-radius-paper) var(--tcrn-radius-paper) 0 0;
  background: var(--tcrn-color-panel);
  box-shadow: var(--tcrn-elevation-s3);
  color: var(--tcrn-color-ink);
  animation: tcrn-shell-menu-enter var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease) both;
}
.tcrn-shell-sheet__grab {
  flex: 0 0 auto;
  inline-size: calc(3 * var(--tcrn-space-3));
  block-size: var(--tcrn-space-1);
  margin: var(--tcrn-space-0h) auto var(--tcrn-space-2);
  border-radius: var(--tcrn-radius-pill);
  background: var(--tcrn-color-line-2);
}
.tcrn-shell-sheet__list {
  display: flex;
  flex: 0 1 auto;
  flex-direction: column;
  gap: var(--tcrn-space-0h);
  min-block-size: 0;
  margin-inline: calc(-1 * var(--tcrn-space-2));
  padding-inline: var(--tcrn-space-2);
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
}
.tcrn-shell-sheet .tcrn-shell-sheet__group {
  display: flex;
  flex-direction: column;
  gap: var(--tcrn-space-0h);
  min-inline-size: 0;
}
.tcrn-shell-sheet .tcrn-nav-item {
  grid-template-columns: calc(var(--tcrn-icon-size-md) + var(--tcrn-space-1h)) minmax(0, 1fr);
  padding-inline-start: var(--tcrn-space-2);
}
.tcrn-shell-sheet .tcrn-nav-item[data-nav-item-has-icon="false"] > .tcrn-nav-item__content {
  grid-column: 2;
}
.tcrn-shell-sheet .tcrn-nav-pin::after {
  content: "";
  position: absolute;
  inset: calc(-1 * var(--tcrn-space-2h));
}
@media (prefers-reduced-motion: no-preference) {
  .tcrn-shell-menu[data-shell-fade] > .tcrn-shell-sheet__panel,
  .tcrn-shell-sheet__scrim[data-shell-fade] {
    animation: none;
    opacity: 1;
    transition: opacity var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease);
  }
  @starting-style {
    .tcrn-shell-menu[data-shell-fade] > .tcrn-shell-sheet__panel,
    .tcrn-shell-sheet__scrim[data-shell-fade] {
      opacity: 0;
    }
  }
  .tcrn-shell-menu[data-shell-closing] > .tcrn-shell-sheet__panel,
  .tcrn-shell-sheet__scrim[data-shell-closing] {
    opacity: 0;
    pointer-events: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .tcrn-shell-sheet__scrim,
  .tcrn-shell-sheet__panel {
    animation: none;
  }
  .tcrn-shell-sheet__scrim[data-shell-closing] {
    display: none;
  }
}`;
