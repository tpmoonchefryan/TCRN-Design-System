import { componentParameters, componentStory } from "./story.js";

export default { id: "components-heading", title: "Components/Foundations/Heading", parameters: componentParameters("Heading") };
export const Default = componentStory("Heading", "default");
export const Levels = componentStory("Heading", "levels");
export const Truncated = componentStory("Heading", "truncated");
