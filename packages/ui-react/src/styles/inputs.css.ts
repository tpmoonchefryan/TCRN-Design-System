// Inputs segments of tcrnComponentCss: every rule whose selector subject is an input,
// textarea, select, multi-select, suggest, number, date, checkbox, radio, switch,
// search-input or field class.
//
// styles/index.ts joins the segments of all six family modules in the stylesheet's cascade
// order, so where a segment sits in the sheet is decided there; this module owns what the
// segment says. A backtick ends a segment early, so the CSS comments in it never use one
// (scripts/css-template-integrity-proof.mjs checks every segment).
//
// State colours come only from the generated pair segments in generated/inputs.pairs.ts
// (written by scripts/contract-generate.mjs from the design contract). The family base
// rules here read the live pair (--tcrn-pair-fill, --tcrn-pair-ink, --tcrn-pair-edge, and
// --tcrn-pair-mark or --tcrn-pair-knob with --tcrn-pair-knob-edge) and never declare it;
// each pair segment is joined after the base rules it serves.

import { inputsTextPairsCss } from "./generated/inputs.pairs.js";

export const inputsCss01 = `
.tcrn-product-shell .tcrn-search-input:focus-within {
  box-shadow: none;
}
.tcrn-product-shell .tcrn-search-input:focus-within {
  outline: 3px solid var(--tcrn-color-focus-ring);
  outline-offset: 2px;
}
.tcrn-product-shell .tcrn-search-input__control:focus,
.tcrn-product-shell .tcrn-search-input__control:focus-visible {
  outline-style: none;
  outline-width: 0;
  outline-offset: 0;
  box-shadow: none;
}`;

export const inputsCss02 = `
.tcrn-search-input {
  --tcrn-search-input-icon-size: 16px;
  --tcrn-search-input-block-size: 38px;
  --tcrn-search-input-padding-inline: var(--tcrn-space-3);
  --tcrn-search-input-column-gap: var(--tcrn-space-2);
  --tcrn-search-input-control-min-inline-size: 9ch;
  display: grid;
  grid-template-columns: var(--tcrn-search-input-icon-size) minmax(var(--tcrn-search-input-control-min-inline-size), 1fr) max-content;
  align-items: center;
  gap: var(--tcrn-search-input-column-gap);
  min-block-size: var(--tcrn-search-input-block-size);
  min-inline-size: var(--tcrn-search-input-min-inline-size, 0);
  max-inline-size: 100%;
  padding: 0 var(--tcrn-search-input-padding-inline);
  border: 1px solid var(--tcrn-color-border-control);
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-color-surface-panel);
}
/* The fill prop: the wrapper takes its container's full inline size. */
.tcrn-search-input--fill {
  inline-size: 100%;
}
.tcrn-search-input__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  grid-column: 1;
  inline-size: var(--tcrn-search-input-icon-size);
  block-size: var(--tcrn-search-input-icon-size);
  color: var(--tcrn-color-text-secondary);
  pointer-events: none;
}
.tcrn-search-input__icon svg {
  inline-size: var(--tcrn-search-input-icon-size);
  block-size: var(--tcrn-search-input-icon-size);
}
.tcrn-search-input .tcrn-search-input__control {
  appearance: none;
  box-sizing: border-box;
  grid-column: 2;
  width: 100%;
  min-height: 0;
  min-width: 0;
  max-width: none;
  padding: 0;
  border: 0;
  border-radius: 0;
  outline: 0;
  background: transparent;
  color: var(--tcrn-color-text-primary);
  font: inherit;
  box-shadow: none;
}
.tcrn-search-input:focus-within {
  outline: 3px solid var(--tcrn-color-focus-ring);
  outline-offset: 2px;
  box-shadow: none;
}
.tcrn-search-input .tcrn-search-input__control:focus,
.tcrn-search-input .tcrn-search-input__control:focus-visible {
  outline-style: none;
  outline-width: 0;
  outline-offset: 0;
  box-shadow: none;
}
.tcrn-search-input__shortcut {
  position: static;
  z-index: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  grid-column: 3;
  color: var(--tcrn-color-text-secondary);
  border: 1px solid var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-surface);
  background: var(--tcrn-color-surface-muted);
  padding: var(--tcrn-space-0h) var(--tcrn-space-1h);
  font-family: var(--tcrn-type-family-ui);
  font-size: var(--tcrn-type-size-caption);
  font-weight: var(--tcrn-type-weight-strong);
  line-height: var(--tcrn-type-line-caption);
  letter-spacing: 0;
  pointer-events: none;
}`;

export const inputsCss03 = `
.tcrn-table-toolbar .tcrn-search-input {
  flex: 1 1 220px;
  min-width: 180px;
}`;

export const inputsCss04 = `
@media (prefers-reduced-motion: reduce) {
  .tcrn-search-input {
    transition: opacity var(--tcrn-motion-comprehension), background-color var(--tcrn-motion-comprehension), color var(--tcrn-motion-comprehension), border-color var(--tcrn-motion-comprehension);
  }
}`;

export const inputsCss05 = `

/* Form field */
.tcrn-field {
  display: grid;
  /* The field's rows are label and control, both content-sized. Left to stretch, a
     field that a layout has made taller than its content hands the extra height to
     those rows, and the control inside grows past the min-height it declares — a
     select stating 34px was observed at 44.1px this way. The field keeps its own
     size; whatever gave it extra height is the layout's business, not the control's. */
  align-content: start;
  gap: var(--tcrn-space-1);
  margin-bottom: 10px;
  border-radius: var(--tcrn-radius-control);
  background-color: transparent;
  outline: 1px solid transparent;
  outline-offset: 2px;
  transition:
    background-color 150ms ease-out,
    outline-color 150ms ease-out;
}

.tcrn-field:focus-within {
  background-color: color-mix(in srgb, var(--tcrn-color-surface-muted) 56%, transparent);
  outline-color: color-mix(in srgb, var(--tcrn-color-border-strong) 66%, transparent);
}

.tcrn-field--error {
  background-color: color-mix(in srgb, var(--tcrn-color-state-blocked-bg) 62%, transparent);
  outline-color: var(--tcrn-color-state-blocked);
}

.tcrn-field__label {
  font-weight: 600;
}
.tcrn-field:is(fieldset) {
  min-inline-size: 0;
  padding: 0;
  border: 0;
}

.tcrn-field__hint {
  color: var(--tcrn-color-text-secondary);
}

.tcrn-field__error {
  color: var(--tcrn-color-state-blocked);
}

/* Form input + select (.tcrn-input--short is a docs-only demo width and stays there).
   The text-like controls share one pair table: Input, Textarea, NumberInput, DatePicker
   and SuggestInput carry .tcrn-input; Select and the MultiSelect trigger carry
   .tcrn-select. This base only reads the live pair; the generated state rules choose
   which pair is live. The edge is an inset box-shadow, so hover, focus and error change
   edge and ring together and the box never moves. */
.tcrn-input,
.tcrn-select {
  box-sizing: border-box;
  max-width: 100%;
  block-size: var(--tcrn-control-height-md);
  padding: 0 var(--tcrn-space-2h);
  border: 0;
  border-radius: var(--tcrn-radius-control);
  outline: 0;
  background-color: var(--tcrn-pair-fill);
  color: var(--tcrn-pair-ink);
  box-shadow: var(--tcrn-pair-edge);
  font-family: var(--tcrn-type-family-ui);
  font-size: var(--tcrn-type-size-control);
  line-height: 20px;
  font-variant-numeric: tabular-nums;
  transition:
    background-color var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease),
    box-shadow var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease);
}
.tcrn-input {
  -webkit-appearance: none;
  appearance: none;
}
.tcrn-input::placeholder {
  color: var(--tcrn-color-ink-3);
  opacity: 1;
}
.tcrn-select {
  cursor: pointer;
}
/* Forced colours drop box-shadow, so the ring keeps a transparent outline behind it for
   the system to paint; everywhere else the outline is invisible. */
.tcrn-input:where(:focus-visible),
.tcrn-select:where(:focus-visible) {
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.tcrn-input:where(:disabled),
.tcrn-select:where(:disabled) {
  cursor: not-allowed;
}
/* Textarea is a modifier on .tcrn-input (pair, radius and font come from the base);
   these deltas give it a multi-line box and a vertical resize handle. */
.tcrn-textarea {
  block-size: auto;
  min-block-size: 76px;
  padding: var(--tcrn-space-1h) var(--tcrn-space-2h);
  resize: vertical;
}` + inputsTextPairsCss;

export const inputsCss06 = `

/* Component-loop primitives: each rule stays package-owned and token-led so the
   exported CSS can be consumed without importing the React implementation. */
.tcrn-switch {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  gap: var(--tcrn-space-1) var(--tcrn-space-2);
  align-items: center;
  min-width: 0;
  color: var(--tcrn-color-text-primary);
  cursor: pointer;
}
.tcrn-switch__control {
  appearance: none;
  inline-size: 42px;
  block-size: 24px;
  margin: 0;
  border: 1px solid var(--tcrn-color-border-control);
  border-radius: var(--tcrn-radius-pill);
  background: var(--tcrn-color-surface-muted);
  box-shadow: inset 0 0 0 3px var(--tcrn-color-surface-muted);
  cursor: pointer;
}
.tcrn-switch__control::before {
  display: block;
  inline-size: 16px;
  block-size: 16px;
  margin: 3px;
  border-radius: 50%;
  background: var(--tcrn-color-text-secondary);
  content: "";
  transition: transform var(--tcrn-motion-fast) var(--tcrn-motion-comprehension), background var(--tcrn-motion-fast) var(--tcrn-motion-comprehension);
}
.tcrn-switch__control:checked {
  border-color: var(--tcrn-color-brand-primary);
  background: var(--tcrn-color-brand-primary-bg);
}
.tcrn-switch__control:checked::before {
  background: var(--tcrn-color-brand-primary);
  transform: translateX(18px);
}
.tcrn-switch__control:focus-visible {
  outline: 3px solid var(--tcrn-color-focus-ring);
  outline-offset: 2px;
}
.tcrn-switch__label {
  min-width: 0;
  font-weight: var(--tcrn-type-weight-medium);
}
.tcrn-switch__description {
  grid-column: 2;
  min-width: 0;
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-meta);
  line-height: var(--tcrn-type-line-caption);
}
.tcrn-switch--disabled {
  color: var(--tcrn-color-text-muted);
  cursor: not-allowed;
}
.tcrn-switch--disabled .tcrn-switch__control {
  cursor: not-allowed;
  opacity: 0.62;
}`;

export const inputsCss07 = `

.tcrn-field-provenance {
  display: grid;
  grid-template-columns: minmax(0, 1fr) max-content max-content;
  gap: var(--tcrn-space-2);
  align-items: center;
  min-width: 0;
  padding: var(--tcrn-space-2);
  border: 1px dashed var(--tcrn-color-border-subtle);
  border-radius: var(--tcrn-radius-control);
  background: var(--tcrn-color-surface-muted);
}
.tcrn-field-provenance__value {
  min-width: 0;
  color: var(--tcrn-color-text-primary);
  overflow-wrap: anywhere;
}
.tcrn-field-provenance__source {
  color: var(--tcrn-color-text-secondary);
  font-size: var(--tcrn-type-size-meta);
}
.tcrn-field-provenance__action {
  display: inline-flex;
  align-items: center;
}
.tcrn-field-provenance--overridden {
  border-style: solid;
  border-color: var(--tcrn-selection-edge);
  background: var(--tcrn-selection-fill);
}`;

export const inputsCss08 = `
@media (prefers-reduced-motion: reduce) {
  .tcrn-field {
    transition: none;
  }
}

@media (forced-colors: active) {
  .tcrn-field:focus-within,
  .tcrn-field--error {
    outline: 2px solid Highlight;
    outline-offset: 2px;
  }
}`;

export const inputsCss09 = `

.tcrn-radio-group { border: 0; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--tcrn-space-2); }
.tcrn-radio-group__legend { padding: 0; font-weight: 600; }
.tcrn-radio-group__option {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: var(--tcrn-space-2);
}
.tcrn-radio-group__description { grid-column: 2; font-size: var(--tcrn-type-size-caption); color: var(--tcrn-color-text-secondary); }
.tcrn-radio-group__option[data-option-disabled="true"] { color: var(--tcrn-color-text-muted); }`;

export const inputsCss10 = `

/* DatePicker is a .tcrn-input and shares the text pair table. The native picker
   indicator stays the click target: it is transparent and stretched over the 30px at
   the end of the box, where the calendar icon sits, so a click there still opens the
   system calendar the way the browser's own showPicker does. */
.tcrn-date-picker { position: relative; padding-inline-end: 30px; }
.tcrn-date-picker::-webkit-calendar-picker-indicator { position: absolute; inset-block: 0; inset-inline-end: 0; inline-size: 30px; block-size: 100%; margin: 0; padding: 0; opacity: 0; cursor: pointer; }`;

export const inputsCss11 = `
.tcrn-multi-select-group{display:grid;gap:var(--tcrn-space-2);min-inline-size:0;max-inline-size:100%}
.tcrn-multi-select-group__options{display:grid;gap:var(--tcrn-space-1);min-inline-size:0;margin:0;padding:0;border:0}
.tcrn-multi-select-group__option{display:flex;align-items:flex-start;gap:var(--tcrn-space-2);min-inline-size:0;overflow-wrap:anywhere}
.tcrn-multi-select-group__option input{flex:0 0 auto;margin-block-start:var(--tcrn-space-0h)}
.tcrn-multi-select-group__actions{display:flex;justify-content:flex-start}
.tcrn-multi-select-group__clear{justify-self:start}


/* The native listbox presentation keeps the Select pair and grows to its rows. */
.tcrn-select.tcrn-multi-select{block-size:auto;padding:var(--tcrn-space-1)}

/* A collection dropdown uses the Select trigger (the .tcrn-select pair table) and Menu
   option families. The summary stays on one line and carries its full text as a title. */
.tcrn-multi-select-dropdown{position:relative;min-inline-size:0;max-inline-size:100%}
.tcrn-multi-select-dropdown__trigger{-webkit-appearance:none;appearance:none;display:flex;align-items:center;justify-content:space-between;gap:var(--tcrn-space-2);inline-size:100%;text-align:start;cursor:pointer}
.tcrn-multi-select-dropdown__trigger [data-multi-select-summary]{min-inline-size:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tcrn-multi-select-dropdown__caret{flex:0 0 auto;inline-size:var(--tcrn-icon-size-sm);block-size:var(--tcrn-icon-size-sm);color:var(--tcrn-color-ink-3)}
.tcrn-multi-select-dropdown__trigger:disabled{cursor:not-allowed}
.tcrn-multi-select-dropdown__list{z-index:var(--tcrn-z-popover);min-inline-size:0;max-inline-size:calc(100vw - var(--tcrn-space-4));max-block-size:calc(100vh - var(--tcrn-space-4));overflow:auto;box-sizing:border-box}
.tcrn-multi-select-dropdown__list[hidden]{display:none}
.tcrn-multi-select-dropdown__option{display:flex;justify-content:space-between;align-items:center;gap:var(--tcrn-space-2);font:inherit;color:var(--tcrn-color-ink);overflow-wrap:anywhere}
.tcrn-multi-select-dropdown__option:not(:disabled):hover{background:var(--tcrn-color-hover)}
.tcrn-multi-select-dropdown__option[aria-selected="true"]{background:var(--tcrn-color-wash);font-weight:600}
.tcrn-multi-select-dropdown__option [data-multi-select-check]{flex:0 0 auto;visibility:hidden}
.tcrn-multi-select-dropdown__option [data-multi-select-check][data-selected="true"]{visibility:visible}`;

export const inputsCss12 = `
.tcrn-setting-choice__select-label>.tcrn-select{inline-size:100%}
.tcrn-setting-choice[data-setting-choice-control="radio"] .tcrn-radio-group{flex-direction:row;flex-wrap:nowrap;gap:var(--tcrn-space-2);max-inline-size:100%;overflow-x:auto;padding:var(--tcrn-container-settings-choice-padding);border:1px solid var(--tcrn-color-border-subtle);border-radius:var(--tcrn-radius-surface);background:var(--tcrn-color-surface-muted)}
.tcrn-setting-choice[data-setting-choice-control="radio"] .tcrn-radio-group__option{min-inline-size:0;flex:1 1 0}
.tcrn-setting-choice[data-setting-choice-control="radio"] .tcrn-radio-group__label{min-inline-size:0;overflow-wrap:anywhere}`;

export const inputsCss13 = `
.tcrn-number-input{inline-size:100%;min-inline-size:var(--tcrn-container-settings-number-min);font-variant-numeric:tabular-nums;text-overflow:clip;-moz-appearance:textfield;appearance:textfield}
.tcrn-number-input::-webkit-inner-spin-button,.tcrn-number-input::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}`;

export const inputsCss14 = `
.tcrn-settings-layout__form .tcrn-setting-row__control .tcrn-field :is(.tcrn-input,.tcrn-select,.tcrn-number-input){inline-size:100%;min-inline-size:0}
.tcrn-settings-layout__form .tcrn-setting-row__control .tcrn-field{margin:0}
.tcrn-settings-layout__form .tcrn-setting-row__control>.tcrn-number-input{inline-size:100%}`;
