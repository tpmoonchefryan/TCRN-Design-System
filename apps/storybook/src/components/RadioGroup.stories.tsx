import { componentInteraction, componentParameters, componentStory } from "./story.js";

export default { id: "components-radiogroup", title: "Components/Inputs and selection/RadioGroup", parameters: componentParameters("RadioGroup") };
export const Default = componentStory("RadioGroup", "default");
export const Selected = componentStory("RadioGroup", "selected");
export const Disabled = componentStory("RadioGroup", "disabled");
export const Error = componentStory("RadioGroup", "error");
export const FormSubmission = componentInteraction("RadioGroup");
