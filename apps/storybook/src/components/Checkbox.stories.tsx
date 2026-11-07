import { componentParameters, componentStory } from "./story.js";

export default { title: "Components/Checkbox", parameters: componentParameters("Checkbox") };
export const Default = componentStory("Checkbox", "default");
export const Checked = componentStory("Checkbox", "checked");
export const Indeterminate = componentStory("Checkbox", "indeterminate");
export const Focus = componentStory("Checkbox", "focus");
export const Disabled = componentStory("Checkbox", "disabled");
export const Error = componentStory("Checkbox", "error");
