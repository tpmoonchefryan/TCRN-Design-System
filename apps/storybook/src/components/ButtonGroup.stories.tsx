import { componentParameters, componentStory } from "./story.js";

export default { title: "Components/ButtonGroup", parameters: componentParameters("ButtonGroup") };
export const Default = componentStory("ButtonGroup", "default");
export const Quiet = componentStory("ButtonGroup", "quiet");
export const Sizes = componentStory("ButtonGroup", "sizes");
export const FiveActions = componentStory("ButtonGroup", "five-actions");
