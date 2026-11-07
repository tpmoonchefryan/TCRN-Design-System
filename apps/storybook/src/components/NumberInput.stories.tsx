import { componentParameters, componentStory } from "./story.js";

export default { title: "Components/NumberInput", parameters: componentParameters("NumberInput") };
export const Default = componentStory("NumberInput", "default");
export const Bounds = componentStory("NumberInput", "bounds");
export const Readonly = componentStory("NumberInput", "readonly");
export const Disabled = componentStory("NumberInput", "disabled");
export const Error = componentStory("NumberInput", "error");
