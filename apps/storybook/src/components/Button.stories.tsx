import { componentParameters, componentStory } from "./story.js";

export default { title: "Components/Button", parameters: componentParameters("Button") };
export const Default = componentStory("Button", "default");
export const Variants = componentStory("Button", "variants");
export const Sizes = componentStory("Button", "sizes");
export const Hover = componentStory("Button", "hover");
export const Active = componentStory("Button", "active");
export const Focus = componentStory("Button", "focus");
export const Disabled = componentStory("Button", "disabled");
export const Loading = componentStory("Button", "loading");
export const Selected = componentStory("Button", "selected");
