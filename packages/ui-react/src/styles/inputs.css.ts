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

import { inputsCheckPairsCss, inputsSwitchPairsCss, inputsTextPairsCss } from "./generated/inputs.pairs.js";

export const inputsCss01 = `
/* In the product shell the search keeps the same tool form as everywhere else: the
   control draws its own edge and focus ring from the inputs pair table, and the wrapper
   draws nothing around it. The shell-wide focus rule in the base segment leaves every
   pair-driven control alone, the search control among them. */
.tcrn-product-shell .tcrn-search-input:focus-within {
  outline: 0;
  box-shadow: none;
}`;

export const inputsCss02 = `
/* SearchInput is a quiet tool, the same in a form and in a top bar: a wash fill with no
   edge, a line-2 edge on hover, and the paper fill with the focus ring once focused. The
   control itself is the box and takes those values from the inputs pair table (the
   search variant of .tcrn-input); the wrapper only positions the icon and the shortcut
   over it, and the control's inline padding keeps the text clear of both. */
.tcrn-search-input {
  --tcrn-search-input-icon-size: var(--tcrn-icon-size-sm);
  --tcrn-search-input-block-size: var(--tcrn-control-height-md);
  --tcrn-search-input-padding-inline: var(--tcrn-space-2h);
  --tcrn-search-input-column-gap: var(--tcrn-space-1h);
  --tcrn-search-input-control-min-inline-size: 9ch;
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: center;
  min-inline-size: var(--tcrn-search-input-min-inline-size, 0);
  max-inline-size: 100%;
}
/* The fill prop: the wrapper takes its container's full inline size. */
.tcrn-search-input--fill {
  inline-size: 100%;
}
.tcrn-search-input__icon {
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: var(--tcrn-search-input-padding-inline);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: var(--tcrn-search-input-icon-size);
  block-size: var(--tcrn-search-input-icon-size);
  color: var(--tcrn-color-ink-3);
  transform: translateY(-50%);
  pointer-events: none;
}
.tcrn-search-input__icon svg {
  inline-size: var(--tcrn-search-input-icon-size);
  block-size: var(--tcrn-search-input-icon-size);
}
.tcrn-search-input .tcrn-search-input__control {
  -webkit-appearance: none;
  appearance: none;
  inline-size: 100%;
  min-inline-size: calc(var(--tcrn-search-input-control-min-inline-size) + var(--tcrn-search-input-icon-size) + var(--tcrn-search-input-column-gap) + 2 * var(--tcrn-search-input-padding-inline));
  max-inline-size: none;
  block-size: var(--tcrn-search-input-block-size);
  padding-block: 0;
  padding-inline: calc(var(--tcrn-search-input-padding-inline) + var(--tcrn-search-input-icon-size) + var(--tcrn-search-input-column-gap)) var(--tcrn-search-input-padding-inline);
}
/* With a shortcut the text stops short of it: the reserve fits the six-character
   automatic label in the shortcut's 10px mono with room to spare. */
.tcrn-search-input[data-shortcut-visible="true"] .tcrn-search-input__control {
  padding-inline-end: calc(var(--tcrn-space-2) + var(--tcrn-search-input-column-gap) + 7ch);
}
.tcrn-input.tcrn-search-input__control::placeholder {
  color: var(--tcrn-color-ink-2);
}
.tcrn-search-input__shortcut {
  position: absolute;
  inset-block-start: 50%;
  inset-inline-end: var(--tcrn-space-2);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--tcrn-space-1);
  border: 1px solid var(--tcrn-color-line-2);
  border-radius: 4px;
  color: var(--tcrn-color-ink-3);
  font-family: var(--tcrn-type-family-mono);
  font-size: 10px;
  line-height: 14px;
  letter-spacing: 0;
  transform: translateY(-50%);
  pointer-events: none;
}`;

export const inputsCss03 = `
.tcrn-table-toolbar .tcrn-search-input {
  flex: 1 1 220px;
  min-width: 180px;
}`;

// Former landing place of a reduced-motion transition for the search wrapper. The wrapper
// no longer paints a fill or an edge, so there was nothing left to soften; the control's
// own transition is the inputs family's. The segment stays joined, empty.
export const inputsCss04 = ``;

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

/* Focus no longer washes the whole field: the control inside changes its own edge and
   draws the focus ring from the inputs pair table. */

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
  gap: var(--tcrn-space-1) var(--tcrn-space-2h);
  align-items: center;
  min-width: 0;
  color: var(--tcrn-color-text-primary);
  cursor: pointer;
}
/* Switch: a 34 by 20 track (fill and edge of the pair) with a 16px knob (knob and
   knob-edge) that travels 14px. Checked, the knob takes on-acc, a dark knob at night. */
.tcrn-switch__control {
  -webkit-appearance: none;
  appearance: none;
  position: relative;
  flex: 0 0 auto;
  box-sizing: border-box;
  inline-size: 34px;
  block-size: 20px;
  margin: 0;
  border: 0;
  border-radius: var(--tcrn-radius-pill);
  outline: 0;
  background-color: var(--tcrn-pair-fill);
  box-shadow: var(--tcrn-pair-edge);
  cursor: pointer;
  transition:
    background-color var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease),
    box-shadow var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease);
}
.tcrn-switch__control::before {
  position: absolute;
  top: 2px;
  left: 2px;
  inline-size: 16px;
  block-size: 16px;
  border-radius: 50%;
  background-color: var(--tcrn-pair-knob);
  box-shadow: var(--tcrn-pair-knob-edge);
  content: "";
  transition:
    transform var(--tcrn-motion-duration-move) var(--tcrn-motion-ease),
    background-color var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease);
}
.tcrn-switch__control:where(:checked)::before {
  transform: translateX(14px);
}
.tcrn-switch__control:where(:focus-visible) {
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.tcrn-switch__control:where(:disabled) {
  cursor: not-allowed;
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
  color: var(--tcrn-color-ink-3);
  cursor: not-allowed;
}

/* Checkbox and radio draw a 16px box from the pair table (fill, edge and mark). The tick
   is an ::after border and the radio dot an inset 5px ring, never an image. */
.tcrn-checkbox,
.tcrn-radio-group__control {
  -webkit-appearance: none;
  appearance: none;
  position: relative;
  flex: 0 0 auto;
  box-sizing: border-box;
  inline-size: 16px;
  block-size: 16px;
  margin: 0;
  border: 0;
  border-radius: var(--tcrn-radius-check);
  outline: 0;
  background-color: var(--tcrn-pair-fill);
  box-shadow: var(--tcrn-pair-edge);
  cursor: pointer;
  transition:
    background-color var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease),
    box-shadow var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease);
}
.tcrn-checkbox::after {
  position: absolute;
  top: 1.5px;
  left: 5px;
  box-sizing: content-box;
  inline-size: 4px;
  block-size: 8px;
  border: solid var(--tcrn-pair-mark);
  border-width: 0 1.5px 1.5px 0;
  content: "";
  transform: rotate(45deg);
}
.tcrn-checkbox:where(:indeterminate)::after {
  top: 7px;
  left: 4px;
  inline-size: 8px;
  block-size: 0;
  border-width: 0 0 1.5px;
  transform: none;
}
.tcrn-radio-group__control {
  border-radius: 50%;
}
.tcrn-radio-group__control::after {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  box-shadow: inset 0 0 0 5px var(--tcrn-pair-mark);
  content: "";
  transition: box-shadow var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease);
}
.tcrn-checkbox:where(:focus-visible),
.tcrn-radio-group__control:where(:focus-visible) {
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.tcrn-checkbox:where(:disabled),
.tcrn-radio-group__control:where(:disabled) {
  cursor: not-allowed;
}` + inputsCheckPairsCss + inputsSwitchPairsCss;

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
  /* The knob jumps instead of travelling and keeps its colour change; the radio dot
     appears at once. */
  .tcrn-switch__control::before {
    transition: background-color var(--tcrn-motion-duration-fill) var(--tcrn-motion-ease);
  }
  .tcrn-radio-group__control::after {
    transition: none;
  }
}

@media (forced-colors: active) {
  .tcrn-field--error {
    outline: 2px solid Highlight;
    outline-offset: 2px;
  }
  /* Forced colours drop every box-shadow, which is where the edges, rings, knob and
     radio dot live. Text controls get a real border back, and the checkable controls
     return to the system's own drawing. */
  .tcrn-input,
  .tcrn-select {
    border: 1px solid;
  }
  .tcrn-checkbox,
  .tcrn-radio-group__control,
  .tcrn-switch__control {
    -webkit-appearance: auto;
    appearance: auto;
  }
  .tcrn-switch__control {
    inline-size: auto;
    block-size: auto;
  }
  .tcrn-checkbox::after,
  .tcrn-radio-group__control::after,
  .tcrn-switch__control::before {
    content: none;
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
.tcrn-date-picker::-webkit-calendar-picker-indicator { position: absolute; inset-block: 0; inset-inline-end: 0; inline-size: 30px; block-size: 100%; margin: 0; padding: 0; opacity: 0; cursor: pointer; }

/* Select and DatePicker sit in a wrapper that only positions their end icon (Inputs
   board .sw > .chev): chevron-down for Select, calendar for DatePicker, at the sm icon
   size in ink-3, centred in the 30px the control keeps clear at its end. The wrapper
   draws nothing and takes the control's place in the layout: it shrinks to the control
   in a line of text and stretches with it where its container stretches its items. The
   icon is decorative and lets the pointer through, to the native select or to the
   transparent date indicator, which covers the same 30px. */
.tcrn-select-wrap,
.tcrn-date-picker-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  min-inline-size: 0;
  max-inline-size: 100%;
  vertical-align: middle;
}
.tcrn-select-wrap > .tcrn-select,
.tcrn-date-picker-wrap > .tcrn-date-picker {
  flex: 1 1 auto;
  min-inline-size: 0;
}
/* With the chevron drawn, the native arrow goes and the label stops short of the icon. */
.tcrn-select-wrap > .tcrn-select {
  -webkit-appearance: none;
  appearance: none;
  padding-inline-end: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tcrn-select-wrap__icon,
.tcrn-date-picker-wrap__icon {
  position: absolute;
  inset-block: 0;
  inset-inline-end: calc((30px - var(--tcrn-icon-size-sm)) / 2);
  margin-block: auto;
  inline-size: var(--tcrn-icon-size-sm);
  block-size: var(--tcrn-icon-size-sm);
  color: var(--tcrn-color-ink-3);
  pointer-events: none;
}`;

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
.tcrn-setting-choice__select-label>:is(.tcrn-select,.tcrn-select-wrap){inline-size:100%}
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
