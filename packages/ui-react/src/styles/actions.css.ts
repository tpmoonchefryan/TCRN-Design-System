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
}
/* ClipboardCopyButton says how the copy went with the ink alone: copied ok, failed bad,
   unsupported ink-3. Fill and edge stay the variant's, so the face does not change. The ink
   is given for default, hover, active and focus alike, because the pointer is still over the
   button, and focus is back on it, when the result arrives. */
.tcrn-button[data-clipboard-copy-state="copied"] {
  --tcrn-pair-ink-d: var(--tcrn-color-ok);
  --tcrn-pair-ink-h: var(--tcrn-color-ok);
  --tcrn-pair-ink-a: var(--tcrn-color-ok);
  --tcrn-pair-ink-f: var(--tcrn-color-ok);
}
.tcrn-button[data-clipboard-copy-state="failed"] {
  --tcrn-pair-ink-d: var(--tcrn-color-bad);
  --tcrn-pair-ink-h: var(--tcrn-color-bad);
  --tcrn-pair-ink-a: var(--tcrn-color-bad);
  --tcrn-pair-ink-f: var(--tcrn-color-bad);
}
.tcrn-button[data-clipboard-copy-state="unsupported"] {
  --tcrn-pair-ink-d: var(--tcrn-color-ink-3);
  --tcrn-pair-ink-h: var(--tcrn-color-ink-3);
  --tcrn-pair-ink-a: var(--tcrn-color-ink-3);
  --tcrn-pair-ink-f: var(--tcrn-color-ink-3);
}
/* ButtonGroup: attached buttons share one outline, drawn by the group; the members drop
   their own edges, square their inner corners and sit 1px apart beside a 1px separator.
   The group isolates its stacking, so the focused member, raised by one, draws its whole
   ring above its neighbours; nothing here clips (no overflow), so the ring is never cut.
   The member rules sit after the generated variant declarations they override, at the
   same (0,2,0). */
.tcrn-button-group {
  display: inline-flex;
  align-items: stretch;
  max-inline-size: 100%;
  border-radius: var(--tcrn-radius-control);
  box-shadow: 0 1px 1px rgba(22, 21, 15, 0.04), 0 0 0 1px var(--tcrn-color-line-ctl);
  isolation: isolate;
}
.tcrn-button-group--quiet {
  box-shadow: none;
}
.tcrn-button-group__separator {
  flex: 0 0 auto;
  inline-size: 1px;
  background: var(--tcrn-color-line-ctl);
}
.tcrn-button-group--quiet > .tcrn-button-group__separator {
  background: var(--tcrn-color-line-2);
}
.tcrn-button-group > .tcrn-button {
  --tcrn-pair-edge-d: 0 0 #0000;
  --tcrn-pair-edge-h: 0 0 #0000;
  --tcrn-pair-edge-a: 0 0 #0000;
  --tcrn-pair-edge-f: var(--tcrn-focus-ring);
  --tcrn-pair-edge-x: 0 0 #0000;
  --tcrn-pair-edge-l: 0 0 #0000;
  --tcrn-pair-edge-s: 0 0 #0000;
  margin-inline-start: 1px;
  border-radius: 0;
}
.tcrn-button-group > .tcrn-button:first-child {
  margin-inline-start: 0;
  border-start-start-radius: var(--tcrn-radius-control);
  border-end-start-radius: var(--tcrn-radius-control);
}
.tcrn-button-group > .tcrn-button:last-child {
  border-start-end-radius: var(--tcrn-radius-control);
  border-end-end-radius: var(--tcrn-radius-control);
}
:where(.tcrn-button-group) > .tcrn-button:where(:focus-visible,[data-tcrn-preview-state="focus"]) {
  z-index: 1;
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

// 05 C preserves the 120ms color transition and the 900ms loader under reduced motion.
export const actionsCss06 = `
.tcrn-button:where(:active,[data-tcrn-preview-state="active"]),.tcrn-link-button:where(:active,[data-tcrn-preview-state="active"]){transition-duration:var(--tcrn-motion-duration-press)}
.tcrn-icon-button--labelled{inline-size:auto;padding:0 var(--tcrn-control-padding-md)}
.tcrn-icon-button--labelled .tcrn-icon-button__label{position:static;inline-size:auto;block-size:auto;overflow:visible;clip-path:none}
`;

// Former landing places of the press-scale overrides. Buttons no longer transform, so there
// is nothing left to undo under reduced motion; the segments stay joined, empty.
export const actionsCss07 = ``;

export const actionsCss08 = ``;
