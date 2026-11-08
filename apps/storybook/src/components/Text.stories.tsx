import { componentParameters, componentStory } from "./story.js";

export default { id: "components-text", title: "Components/Foundations/Text", parameters: componentParameters("Text") };
export const Default = componentStory("Text", "default");
export const Sizes = componentStory("Text", "sizes");
export const Strong = componentStory("Text", "strong");
export const Numeral = componentStory("Text", "numeral");
export const Caps = componentStory("Text", "caps");
