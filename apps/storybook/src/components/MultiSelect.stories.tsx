import { componentParameters, componentStory } from "./story.js";

export default { title: "Components/MultiSelect", parameters: componentParameters("MultiSelect") };
export const Default = componentStory("MultiSelect", "default");
export const Native = componentStory("MultiSelect", "native");
export const Checkboxes = componentStory("MultiSelect", "checkboxes");
export const Empty = componentStory("MultiSelect", "empty");
export const Disabled = componentStory("MultiSelect", "disabled");
export const Error = componentStory("MultiSelect", "error");
