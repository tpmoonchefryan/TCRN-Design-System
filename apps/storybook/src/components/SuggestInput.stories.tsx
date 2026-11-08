import { componentInteraction, componentParameters, componentStory } from "./story.js";

export default { id: "components-suggestinput", title: "Components/Inputs and selection/SuggestInput", parameters: componentParameters("SuggestInput") };
export const Default = componentStory("SuggestInput", "default");
export const Filled = componentStory("SuggestInput", "filled");
export const Readonly = componentStory("SuggestInput", "readonly");
export const Disabled = componentStory("SuggestInput", "disabled");
export const Error = componentStory("SuggestInput", "error");
export const FormSubmission = componentInteraction("SuggestInput");
