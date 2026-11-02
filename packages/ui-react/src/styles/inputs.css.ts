// Published 06 Inputs controls and the limited label/hint role. No unapproved field extensions.
import { inputsCheckPairsCss, inputsSwitchPairsCss, inputsTextPairsCss } from "./generated/inputs.pairs.js";
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
/* Current ink-2 follows published07. Published06 .sw>kbd says ink-3; S03-C01
   remains an undecided source clarification. Keeping this value does not certify
   unchanged06, and its nominal night wash failure does not waive text >=4.5. */
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
  color: var(--tcrn-color-ink-2);
  font-family: var(--tcrn-type-family-mono);
  font-size: 10px;
  line-height: 14px;
  letter-spacing: 0;
  transform: translateY(-50%);
  pointer-events: none;
}`;

export const inputsCss05 = `
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
  color: var(--tcrn-color-ink);
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
  color: var(--tcrn-color-ink-2);
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

export const inputsCss08 = `
@media (prefers-reduced-motion: reduce) {
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
.tcrn-radio-group__description { grid-column: 2; font-size: var(--tcrn-type-size-caption); color: var(--tcrn-color-ink-2); }
.tcrn-radio-group__option[data-option-disabled="true"] { color: var(--tcrn-color-ink-3); }`;

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
   option families. The summary stays on one line and carries its full text as a title.
   The dropdown stacks its items in one column, each stretched to its width. The trigger
   comes first and keeps the Select geometry: a flex item at the control height, as the
   select wrapper lays out a Select, with the same 30px clear at its end, where the caret
   sits at the sm icon size in ink-3, placed exactly as the Select chevron. A list shown
   in place (a static open state) comes under the trigger at the trigger's width; at run
   time the list moves to a fixed overlay layer sized to the trigger, so the column does
   not place it. */
.tcrn-multi-select-dropdown{position:relative;display:flex;flex-direction:column;align-items:stretch;min-inline-size:0;max-inline-size:100%}
.tcrn-multi-select-dropdown__trigger{-webkit-appearance:none;appearance:none;position:relative;display:flex;align-items:center;justify-content:space-between;gap:var(--tcrn-space-2);inline-size:100%;padding-inline-end:30px;text-align:start;cursor:pointer}
.tcrn-multi-select-dropdown__trigger [data-multi-select-summary]{min-inline-size:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tcrn-multi-select-dropdown__caret{position:absolute;inset-block:0;inset-inline-end:calc((30px - var(--tcrn-icon-size-sm)) / 2);margin-block:auto;inline-size:var(--tcrn-icon-size-sm);block-size:var(--tcrn-icon-size-sm);color:var(--tcrn-color-ink-3);pointer-events:none}
.tcrn-multi-select-dropdown__trigger:disabled{cursor:not-allowed}
.tcrn-multi-select-dropdown__list{z-index:var(--tcrn-z-popover);min-inline-size:0;max-inline-size:calc(100vw - var(--tcrn-space-4));max-block-size:calc(100vh - var(--tcrn-space-4));overflow:auto;box-sizing:border-box}
.tcrn-multi-select-dropdown__list[hidden]{display:none}
/* An option draws its fill and weight from a pair kept on the option itself (Inputs board
   .opt): no fill and the regular weight by default, the hover fill on hover, the wash and
   600 once selected. The base reads the live pair; the two state rules only switch it, and
   the hover rule comes last, so a hovered selected option shows the hover fill and keeps
   its weight. */
.tcrn-multi-select-dropdown__option{--tcrn-pair-fill-d:transparent;--tcrn-pair-fill-h:var(--tcrn-color-hover);--tcrn-pair-fill-s:var(--tcrn-color-wash);--tcrn-pair-fill:var(--tcrn-pair-fill-d);--tcrn-pair-weight:400;display:flex;justify-content:space-between;align-items:center;gap:var(--tcrn-space-2);font:inherit;font-weight:var(--tcrn-pair-weight);background-color:var(--tcrn-pair-fill);color:var(--tcrn-color-ink);overflow-wrap:anywhere}
.tcrn-multi-select-dropdown__option:where([aria-selected="true"]){--tcrn-pair-fill:var(--tcrn-pair-fill-s);--tcrn-pair-weight:600}
.tcrn-multi-select-dropdown__option:where(:not(:disabled):hover,[data-tcrn-preview-state="hover"]){--tcrn-pair-fill:var(--tcrn-pair-fill-h)}
.tcrn-multi-select-dropdown__option [data-multi-select-check]{flex:0 0 auto;visibility:hidden}
.tcrn-multi-select-dropdown__option [data-multi-select-check][data-selected="true"]{visibility:visible}`;

export const inputsCss13 = `
.tcrn-input.tcrn-number-input{inline-size:100%;min-inline-size:12ch;font-variant-numeric:tabular-nums;text-overflow:clip;-moz-appearance:textfield;appearance:textfield}
.tcrn-number-input::-webkit-inner-spin-button,.tcrn-number-input::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}`;

export const inputsSizesCss = `
.tcrn-input--sm,.tcrn-select--sm{block-size:var(--tcrn-control-height-sm);font-size:var(--tcrn-type-size-control-sm);padding:0 8px}
.tcrn-input--lg,.tcrn-select--lg{block-size:var(--tcrn-control-height-lg);font-size:var(--tcrn-type-size-control-lg);padding:0 12px}
.tcrn-input,.tcrn-select{width:100%;min-width:0}
/* 06 .in.search.sm: the actual control owns the size override, after the wrapper rule. */
.tcrn-search-input .tcrn-search-input__control.tcrn-input--sm{--tcrn-search-input-block-size:var(--tcrn-control-height-sm);font-size:var(--tcrn-type-size-control-sm);padding-inline-start:28px}
.tcrn-search-input .tcrn-search-input__control.tcrn-input--lg{--tcrn-search-input-block-size:var(--tcrn-control-height-lg);font-size:var(--tcrn-type-size-control-lg)}
`;

// Published 06 .tg.sm; the class selects the documented small rendition without changing semantics.
export const inputsSmallSwitchCss = `
.tcrn-switch--sm{grid-template-columns:28px minmax(0,1fr)}
.tcrn-switch--sm .tcrn-switch__control{inline-size:28px;block-size:16px}
.tcrn-switch--sm .tcrn-switch__control::before{inline-size:12px;block-size:12px}
.tcrn-switch--sm .tcrn-switch__control:where(:checked)::before{transform:translateX(12px)}
`;
