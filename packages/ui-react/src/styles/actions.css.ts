// Actions segments of tcrnComponentCss: every rule whose selector subject is a button,
// icon-button, link-button or clipboard class.
//
// styles/index.ts joins the segments of all six family modules in the stylesheet's cascade
// order, so where a segment sits in the sheet is decided there; this module owns what the
// segment says. A backtick ends a segment early, so the CSS comments in it never use one
// (scripts/css-template-integrity-proof.mjs checks every segment).

export const actionsCss01 = `
.tcrn-button {
  font: inherit;
}`;

export const actionsCss02 = `
.tcrn-button,
.tcrn-link-button,
.tcrn-button--secondary,
.tcrn-link-button--secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--tcrn-space-2);
  min-height: 38px;
  padding: 0 var(--tcrn-space-3);
  border: 1px solid var(--tcrn-color-border-control);
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-color-surface-panel);
  color: var(--tcrn-color-text-primary);
  font-size: var(--tcrn-type-size-ui);
  font-weight: var(--tcrn-type-weight-strong);
  transition: transform var(--tcrn-motion-instant), background-color var(--tcrn-motion-fast), border-color var(--tcrn-motion-fast), color var(--tcrn-motion-fast);
}
/* A pressable surface has to answer the press, or the interface reads as not
   listening. Scale is deliberately subtle and lives on :active (not :hover), so it
   works the same under a finger as under a pointer. */
.tcrn-button:active {
  transform: scale(var(--tcrn-motion-press-scale));
}`;

export const actionsCss03 = `
.tcrn-button--primary,
.tcrn-link-button--primary {
  background: var(--tcrn-color-brand-primary);
  border-color: var(--tcrn-color-brand-primary);
  color: var(--tcrn-color-text-inverse);
}
[data-tcrn-theme="dark"] .tcrn-button--primary,
[data-tcrn-theme="dark"] .tcrn-link-button--primary {
  color: var(--tcrn-color-surface-canvas);
}
.tcrn-button--quiet,
.tcrn-link-button--quiet {
  border-color: transparent;
  background: transparent;
}
/* TCRN-DS-STORY-063: the core Button / LinkButton answered neither hover nor keyboard focus in
   either layer (only .tcrn-button carried press-scale). They now speak the same feedback language
   as the shell controls — muted-surface hover, a deepened brand fill on the primary variant, the
   focus-ring outline, and press-scale on both (LinkButton was missing the press it shares). */
.tcrn-button:not([disabled]):hover,
.tcrn-link-button:hover {
  border-color: var(--tcrn-color-border-control);
  background: color-mix(in srgb, var(--tcrn-color-surface-muted) 72%, var(--tcrn-color-surface-panel));
  color: var(--tcrn-color-text-primary);
}
.tcrn-button--primary:not([disabled]):hover,
.tcrn-link-button--primary:hover {
  border-color: color-mix(in srgb, var(--tcrn-color-brand-primary) 88%, var(--tcrn-color-brand-secondary));
  background: color-mix(in srgb, var(--tcrn-color-brand-primary) 88%, var(--tcrn-color-brand-secondary));
}
.tcrn-button:focus-visible,
.tcrn-link-button:focus-visible {
  outline: 2px solid var(--tcrn-color-focus-ring);
  outline-offset: 2px;
}
.tcrn-link-button:active {
  transform: scale(var(--tcrn-motion-press-scale));
}
.tcrn-button--danger {
  border-color: var(--tcrn-color-state-blocked);
  color: var(--tcrn-color-state-blocked);
}
.tcrn-button--md {
  min-height: 38px;
  padding: 0 var(--tcrn-space-3);
}
.tcrn-button--sm {
  min-height: 30px;
  padding: 0 var(--tcrn-space-2);
  gap: var(--tcrn-space-1h);
  font-size: var(--tcrn-type-size-meta);
}
.tcrn-button[disabled] {
  cursor: not-allowed;
  opacity: 0.64;
}`;

export const actionsCss04 = `
.tcrn-icon-button {
  inline-size: 38px;
  block-size: 38px;
  padding: 0;
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
  .tcrn-button {
    transition: opacity var(--tcrn-motion-comprehension), background-color var(--tcrn-motion-comprehension), color var(--tcrn-motion-comprehension), border-color var(--tcrn-motion-comprehension);
  }
}`;

export const actionsCss07 = `
@media (prefers-reduced-motion: reduce) {
  /* No travel, and no press-scale either: scale is transform. */
  .tcrn-button:active {
    transform: none;
  }
}`;

export const actionsCss08 = `
@media (prefers-reduced-motion: reduce) {
  .tcrn-link-button:active {
    transform: none;
  }
}`;
