// The vendored faces come first: fonts.css declares the five SIL OFL-1.1 families the
// token stacks name, and Vite copies each face it references byte-identical (TCRN-DS-SUB-007).
import "@tcrn/ui-tokens/fonts.css";
import "../src/storybook.css";
import { createResolvedTokenMap } from "@tcrn/ui-tokens";
import { tcrnComponentCss } from "@tcrn/ui-react";

// storybook.css now carries only tokens and doc-shell styles; component styles are the
// package's single source of truth. The real Storybook preview injects tcrnComponentCss
// rather than keeping a parallel v1 copy (INIT-006 E1).
if (typeof document !== "undefined") {
  const componentStyle = document.createElement("style");
  componentStyle.setAttribute("data-tcrn-component-style-source", "@tcrn/ui-react");
  componentStyle.textContent = tcrnComponentCss;
  document.head.appendChild(componentStyle);
}

// The canvas is the G+ ground token --tcrn-color-bg, read from the token package rather
// than copied here, so it moves with the palette.
const tcrnCanvas = createResolvedTokenMap("light")["--tcrn-color-bg"];

export const parameters = {
  controls: { expanded: true },
  options: { showPanel: true },
  backgrounds: {
    default: "TCRN canvas",
    values: [{ name: "TCRN canvas", value: tcrnCanvas }]
  }
};
