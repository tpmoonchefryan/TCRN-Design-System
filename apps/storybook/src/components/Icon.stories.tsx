import { componentParameters, componentStory } from "./story.js";

export default { title: "Components/Icon", parameters: componentParameters("Icon") };
export const Default = componentStory("Icon", "default");
export const Sizes = componentStory("Icon", "sizes");
export const Meaningful = componentStory("Icon", "meaningful");
