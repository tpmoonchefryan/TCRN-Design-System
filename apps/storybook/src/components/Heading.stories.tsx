import { componentParameters, componentStory } from "./story.js";

export default { title: "Components/Heading", parameters: componentParameters("Heading") };
export const Default = componentStory("Heading", "default");
export const Levels = componentStory("Heading", "levels");
export const Truncated = componentStory("Heading", "truncated");
