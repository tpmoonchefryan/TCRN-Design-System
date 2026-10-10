// Icon segments of tcrnComponentCss: rules whose selector subject is an icon class.
// iconCss01 sits after the root custom properties and before the first actions rule.
// Sizing stays on the svg width and height attributes (the icon size tokens, read by
// Icon.tsx), so host components can still size an icon from their own rules.
//
// styles/index.ts joins the segments of all six family modules in the stylesheet's cascade
// order, so where a segment sits in the sheet is decided there; this module owns what the
// segment says. A backtick ends a segment early, so the CSS comments in it never use one
// (scripts/css-template-integrity-proof.mjs checks every segment).

export const iconCss01 = `
/* loader-circle turns on the loading loop token, motion.loading.loop (900ms linear). A
   loop needs visible status copy beside it, so reduced motion stops the turn: rotation
   is transform travel, and the copy still says that work is under way. */
.tcrn-icon[data-icon-name="loader-circle"] {
  transform-origin: 50% 50%;
  animation: tcrn-icon-spin var(--tcrn-motion-loading-loop) infinite;
}
@keyframes tcrn-icon-spin {
  to {
    transform: rotate(360deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .tcrn-icon[data-icon-name="loader-circle"] {
    animation: none;
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
