// Actions segments of tcrnComponentCss: every rule whose selector subject is a button,
// icon-button, link-button, button-group or clipboard class.
//
// styles/index.ts joins the segments of all six family modules in the stylesheet's cascade
// order, so where a segment sits in the sheet is decided there; this module owns what the
// segment says. A backtick ends a segment early, so the CSS comments in it never use one
// (scripts/css-template-integrity-proof.mjs checks every segment).
//
// Colour comes from the state pairs. The family base rule in actionsCss02 reads the live pair
// (--tcrn-pair-fill, --tcrn-pair-ink, --tcrn-pair-edge, --tcrn-pair-weight); the generated
// segment that opens actionsCss03 declares each variant's pairs and the state rules that switch
// them (styles/generated/actions.pairs.ts, written from the pair contract by
// scripts/contract-generate.mjs, never by hand). Nothing else here names a colour for a state.

import { actionsPairsCss } from "./generated/actions.pairs.js";

export const actionsCss01 = `
.tcrn-button {
  font: inherit;
}`;

export const actionsCss02 = `
/* Geometry is token by token (sm 28, md 32, lg 40, radius 8). A press neither moves nor
   scales the button: the switch to the active pair is the whole answer, the same under a
   finger as under a pointer. */
.tcrn-button,
.tcrn-link-button {
  position: relative;
  box-sizing: border-box;
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  gap: var(--tcrn-space-1h);
  max-inline-size: 100%;
  block-size: var(--tcrn-control-height-md);
  padding: 0 var(--tcrn-control-padding-md);
  border: 0;
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-pair-fill);
  color: var(--tcrn-pair-ink);
  box-shadow: var(--tcrn-pair-edge);
  font-family: var(--tcrn-type-family-ui);
  font-size: var(--tcrn-type-size-control);
  font-weight: var(--tcrn-pair-weight);
  line-height: 1;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  transition:
    background-color var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease),
    color var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease),
    box-shadow var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease);
}
.tcrn-button--sm,
.tcrn-link-button--sm {
  block-size: var(--tcrn-control-height-sm);
  padding: 0 var(--tcrn-control-padding-sm);
  font-size: var(--tcrn-type-size-control-sm);
}
.tcrn-button--md,
.tcrn-link-button--md {
  block-size: var(--tcrn-control-height-md);
  padding: 0 var(--tcrn-control-padding-md);
  font-size: var(--tcrn-type-size-control);
}
.tcrn-button--lg,
.tcrn-link-button--lg {
  block-size: var(--tcrn-control-height-lg);
  padding: 0 var(--tcrn-control-padding-lg);
  font-size: var(--tcrn-type-size-control-lg);
}
/* One line, cut with an ellipsis; the component repeats the text in title. The label keeps
   a normal line height so the cut never clips ascenders or descenders. */
.tcrn-button__label {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: normal;
}
.tcrn-button__spinner {
  flex: 0 0 auto;
  inline-size: 13px;
  block-size: 13px;
  animation: tcrn-button-spin var(--tcrn-motion-duration-loop) linear infinite;
}
.tcrn-button--lg .tcrn-button__spinner {
  inline-size: 15px;
  block-size: 15px;
}
@keyframes tcrn-button-spin {
  to {
    transform: rotate(360deg);
  }
}`;

export const actionsCss03 = actionsPairsCss + `
/* What the disabled and busy states do besides switching the pair. */
.tcrn-button:where(:disabled,[aria-disabled="true"]),
.tcrn-link-button:where([aria-disabled="true"]) {
  cursor: not-allowed;
}
.tcrn-button:where([aria-busy="true"]),
.tcrn-link-button:where([aria-busy="true"]) {
  pointer-events: none;
}
.tcrn-button:where(:not([aria-busy="true"])) > .tcrn-button__spinner {
  display: none;
}
/* The focus ring is part of the edge pair, and forced colours paint no box-shadow. The
   transparent outline is invisible everywhere else; in forced colours the system recolours
   it, so the focused button still shows a ring there. */
.tcrn-button:focus-visible,
.tcrn-link-button:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
}`;

export const actionsCss04 = `
.tcrn-icon-button {
  inline-size: var(--tcrn-control-height-md);
  padding: 0;
}
.tcrn-icon-button.tcrn-button--sm {
  inline-size: var(--tcrn-control-height-sm);
}
.tcrn-icon-button.tcrn-button--lg {
  inline-size: var(--tcrn-control-height-lg);
}`;

export const actionsCss05 = `
.tcrn-icon-button__label {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}`;

export const actionsCss06 = `
@media (prefers-reduced-motion: reduce) {
  .tcrn-button,
  .tcrn-link-button {
    transition: background-color var(--tcrn-motion-comprehension), color var(--tcrn-motion-comprehension), box-shadow var(--tcrn-motion-comprehension);
  }
  /* The loader keeps its arc and stops turning: rotation is transform. */
  .tcrn-button__spinner {
    animation: none;
  }
}`;

// Former landing places of the press-scale overrides. Buttons no longer transform, so there
// is nothing left to undo under reduced motion; the segments stay joined, empty.
export const actionsCss07 = ``;

export const actionsCss08 = ``;
