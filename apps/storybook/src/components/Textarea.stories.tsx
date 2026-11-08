import { componentInteraction, componentParameters, componentStory } from "./story.js";

export default { id: "components-textarea", title: "Components/Inputs and selection/Textarea", parameters: componentParameters("Textarea") };
export const Default = componentStory("Textarea", "default");
export const Filled = componentStory("Textarea", "filled");
export const Focus = componentStory("Textarea", "focus");
export const Readonly = componentStory("Textarea", "readonly");
export const Disabled = componentStory("Textarea", "disabled");
export const Error = componentStory("Textarea", "error");
export const FormSubmission = componentInteraction("Textarea");
