import { componentInteraction, componentParameters, componentStory } from "./story.js";

export default { id: "components-switch", title: "Components/Inputs and selection/Switch", parameters: componentParameters("Switch") };
export const Default = componentStory("Switch", "default");
export const Checked = componentStory("Switch", "checked");
export const Small = componentStory("Switch", "small");
export const Disabled = componentStory("Switch", "disabled");
export const FormSubmission = componentInteraction("Switch");
