import { tcrnLocaleMetadata } from "@tcrn/ui-copy-state";
import "../src/storybook.css";
import "../src/docs.css";

export const parameters = {
  layout: "fullscreen",
  options: { storySort: { order: ["Published standards", ["Home", "*", "Component contracts", "Published source"]] } },
};
export const initialGlobals = { locale: "en" };
export const globalTypes = {
  locale: {
    description: "Documentation language",
    toolbar: {
      icon: "globe",
      items: tcrnLocaleMetadata.map(({ locale, nativeName }) => ({ value: locale, title: nativeName })),
      dynamicTitle: true,
    },
  },
};
