import { createElement } from "react";
import { tcrnLocaleMetadata } from "@tcrn/ui-copy-state";
import "../src/storybook.css";
import "../src/docs.css";

export const parameters = {
  layout: "fullscreen",
  options: { storySort: { order: ["Published standards", ["Home", "*", "Component contracts"], "Components", ["Foundations", "Actions", "Inputs and selection", "Application shell"], "Adopted support"] } },
};
export const initialGlobals = { locale: "en", theme: "light" };
export const decorators = [(
  Story: () => ReturnType<typeof createElement>,
  context: { globals: Record<string, unknown>; parameters: Record<string, unknown> },
) => {
  if (!context.parameters.formalComponent && !context.parameters.adoptedSupport) return createElement(Story);
  return createElement("div", {
    className: "component-story-canvas",
    "data-tcrn-root": "",
    "data-tcrn-theme": context.globals.theme === "dark" ? "dark" : "light",
  }, createElement(Story));
}];
export const globalTypes = {
  theme: {
    description: "Component theme",
    toolbar: { icon: "circlehollow", items: ["light", "dark"], dynamicTitle: true },
  },
  locale: {
    description: "Documentation language",
    toolbar: {
      icon: "globe",
      items: tcrnLocaleMetadata.map(({ locale, nativeName }) => ({ value: locale, title: nativeName })),
      dynamicTitle: true,
    },
  },
};
