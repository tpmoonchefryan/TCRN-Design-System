// Sign-in intro segment of tcrnComponentCss (TCRN-DS-SUB-122; TCRN-DS-INIT-016, C-8): the layer
// ShellIntro lays over the shell while the lockup on the sign-in card converges into the brand
// button (07a board, section C). styles/index.ts joins it after the shell segments.
//
// Nothing here transitions or animates: ShellIntro moves its parts with the Web Animations API, on
// transform and opacity only, for the durations of the motion intro tokens. These rules only
// place the layer and its parts. The layer covers the viewport above the shell (--tcrn-z-overlay)
// and centres the card; during the fade it takes the pointer, after it the pointer goes through
// to the shell (the phase rule is a :where() rule at the specificity of the base class and writes
// no colour). The flying mark is placed in the viewport on the mark of the card's lockup and
// scales from its top left corner; nothing here fades or filters it, so it keeps its colour from
// start to end. A backtick ends a segment early, so the comments in it never use one
// (scripts/css-template-integrity-proof.mjs checks every segment).
export const shellIntroCss01 = `
.tcrn-shell-intro {
  position: fixed;
  inset: 0;
  z-index: var(--tcrn-z-overlay);
  display: grid;
  place-items: center;
  pointer-events: auto;
}
.tcrn-shell-intro:where([data-intro-phase="move"], [data-intro-phase="rise"]) {
  pointer-events: none;
}
.tcrn-shell-intro__card {
  min-inline-size: 0;
  max-inline-size: 100%;
}
.tcrn-shell-intro__mark {
  position: fixed;
  margin: 0;
  transform-origin: 0 0;
}
`;
