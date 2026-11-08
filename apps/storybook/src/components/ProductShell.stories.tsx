import { componentParameters, componentStory } from "./story.js";

export default { id: "components-productshell", title: "Components/Application shell/ProductShell", parameters: componentParameters("ProductShell") };
export const Default = componentStory("ProductShell", "default");
export const Menu = componentStory("ProductShell", "menu");
export const Dropdown = componentStory("ProductShell", "dropdown");
export const Phone = componentStory("ProductShell", "phone");
export const Overflow = componentStory("ProductShell", "overflow");
export const ProductLocales = componentStory("ProductShell", "product-locales");
