// Icon segments of tcrnComponentCss: rules whose selector subject is an icon class.
// iconCss01 sits after the root custom properties and before the first actions rule.
// Sizing stays on the svg width and height attributes (the icon size tokens, read by
// Icon.tsx), so host components can still size an icon from their own rules.
//
// styles/index.ts joins the segments of all six family modules in the stylesheet's cascade
// order, so where a segment sits in the sheet is decided there; this module owns what the
// segment says. A backtick ends a segment early, so the CSS comments in it never use one
// (scripts/css-template-integrity-proof.mjs checks every segment).
//
// The stroke width is the icon contract's (docs/design/approved-site-v1/src/boards/03-icons,
// through the generated path module), so the base class cannot drift from the roster.

import { tcrnIconStrokeWidth } from "../components/Icon/icon-paths.generated.js";

export const iconCss01 = `
/* The icon base class (Icon board, section E). It moved here from the docs layer, which
   now keeps only sample layout (docs/style-scale.md). An icon is an inline-block that
   neither grows nor shrinks in a flex row and sits on the middle of the text line around
   it, as the board draws it; containers that centre their icon (buttons, nav items,
   inputs) do so themselves. The size is the svg width and height: sm 14, md 16 or lg 20
   from the icon size tokens, or a number. The roster line is restated so that a page
   rule aimed at svg cannot fill, thin or recolour an icon: no fill, the current text
   colour, one stroke width at every size, round caps and joins. vector-effect is not
   inherited, so it is set on the shapes. */
.tcrn-icon {
  display: inline-block;
  flex: none;
  color: currentColor;
  fill: none;
  stroke: currentColor;
  stroke-width: ${tcrnIconStrokeWidth};
  stroke-linecap: round;
  stroke-linejoin: round;
  vertical-align: middle;
}
.tcrn-icon > * {
  vector-effect: non-scaling-stroke;
}
/* Markup written without size attributes takes the md step rather than the 300 by 150
   default of a replaced element. Zero specificity, so a host rule still wins. */
:where(.tcrn-icon:not([width])) {
  inline-size: var(--tcrn-icon-size-md);
}
:where(.tcrn-icon:not([height])) {
  block-size: var(--tcrn-icon-size-md);
}
/* loader-circle turns on the loading loop token, motion.loading.loop (900ms linear). A
   loop needs visible status copy beside it; published 03 C retains the 900ms linear loop under reduced motion. */
.tcrn-icon[data-icon-name="loader-circle"] {
  transform-origin: 50% 50%;
  animation: tcrn-icon-spin var(--tcrn-motion-loading-loop) infinite;
}
@keyframes tcrn-icon-spin {
  to {
    transform: rotate(360deg);
  }
}
/* ClipboardCopyButton renders one icon for each settled state and shows the one its state
   names: copy while idle, check once copied, alert-triangle when the copy failed, info
   where the browser cannot copy. While it copies, the loader stands in their place and
   none of them shows. The static bridge only switches data-clipboard-copy-state, so the
   static button shows the same icon. The box is the loader's (13, or 15 on a large
   button, as in the Actions board), so the label does not move when the icon changes. */
.tcrn-icon[data-clipboard-state-icon] {
  display: none;
  inline-size: 13px;
  block-size: 13px;
}
.tcrn-button--lg > .tcrn-icon[data-clipboard-state-icon] {
  inline-size: 15px;
  block-size: 15px;
}
[data-clipboard-copy-state="idle"] > .tcrn-icon[data-clipboard-state-icon="idle"],
[data-clipboard-copy-state="copied"] > .tcrn-icon[data-clipboard-state-icon="copied"],
[data-clipboard-copy-state="failed"] > .tcrn-icon[data-clipboard-state-icon="failed"],
[data-clipboard-copy-state="unsupported"] > .tcrn-icon[data-clipboard-state-icon="unsupported"] {
  display: inline-block;
}`;
