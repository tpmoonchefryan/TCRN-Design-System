import { componentInteraction, componentParameters, componentStory } from "./story.js";

export default { id: "components-select", title: "Components/Inputs and selection/Select", parameters: componentParameters("Select") };
export const Default = componentStory("Select", "default");
export const Focus = componentStory("Select", "focus");
export const Disabled = componentStory("Select", "disabled");
export const Error = componentStory("Select", "error");
export const FormSubmission = componentInteraction("Select");
