import { componentParameters, componentStory } from "./story.js";

export default { title: "Components/Textarea", parameters: componentParameters("Textarea") };
export const Default = componentStory("Textarea", "default");
export const Filled = componentStory("Textarea", "filled");
export const Focus = componentStory("Textarea", "focus");
export const Readonly = componentStory("Textarea", "readonly");
export const Disabled = componentStory("Textarea", "disabled");
export const Error = componentStory("Textarea", "error");
