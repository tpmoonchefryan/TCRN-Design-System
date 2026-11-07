import { componentParameters, componentStory } from "./story.js";

export default { title: "Components/Text", parameters: componentParameters("Text") };
export const Default = componentStory("Text", "default");
export const Sizes = componentStory("Text", "sizes");
export const Strong = componentStory("Text", "strong");
export const Numeral = componentStory("Text", "numeral");
export const Caps = componentStory("Text", "caps");
