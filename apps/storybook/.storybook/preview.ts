import "../src/storybook.css";
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

export const parameters = {
  controls: { expanded: true },
  options: { showPanel: true },
  backgrounds: {
    default: "TCRN canvas",
    values: [{ name: "TCRN canvas", value: "#fafaf9" }]
  }
};
