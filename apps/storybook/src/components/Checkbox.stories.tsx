import { componentInteraction, componentParameters, componentStory } from "./story.js";

export default { id: "components-checkbox", title: "Components/Inputs and selection/Checkbox", parameters: componentParameters("Checkbox") };
export const Default = componentStory("Checkbox", "default");
export const Checked = componentStory("Checkbox", "checked");
export const Indeterminate = componentStory("Checkbox", "indeterminate");
export const Focus = componentStory("Checkbox", "focus");
export const Disabled = componentStory("Checkbox", "disabled");
export const Error = componentStory("Checkbox", "error");
export const FormSubmission = componentInteraction("Checkbox");
