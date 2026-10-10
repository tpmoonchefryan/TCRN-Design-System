// Icon segments of tcrnComponentCss: rules whose selector subject is an icon class. There
// are none yet. iconCss01 is the empty landing segment for them; styles/index.ts places it
// after the root custom properties and before the first actions rule.
//
// styles/index.ts joins the segments of all six family modules in the stylesheet's cascade
// order, so where a segment sits in the sheet is decided there; this module owns what the
// segment says. A backtick ends a segment early, so the CSS comments in it never use one
// (scripts/css-template-integrity-proof.mjs checks every segment).

export const iconCss01 = ``;
