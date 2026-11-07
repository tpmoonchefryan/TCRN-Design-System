import { componentParameters, componentStory } from "./story.js";

export default { title: "Components/Input", parameters: componentParameters("Input") };
export const Default = componentStory("Input", "default");
export const Filled = componentStory("Input", "filled");
export const Hover = componentStory("Input", "hover");
export const Focus = componentStory("Input", "focus");
export const Readonly = componentStory("Input", "readonly");
export const Disabled = componentStory("Input", "disabled");
export const Error = componentStory("Input", "error");
export const ErrorFocus = componentStory("Input", "error-focus");
