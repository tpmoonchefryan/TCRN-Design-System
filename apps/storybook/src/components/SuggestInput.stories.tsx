import { componentParameters, componentStory } from "./story.js";

export default { title: "Components/SuggestInput", parameters: componentParameters("SuggestInput") };
export const Default = componentStory("SuggestInput", "default");
export const Filled = componentStory("SuggestInput", "filled");
export const Readonly = componentStory("SuggestInput", "readonly");
export const Disabled = componentStory("SuggestInput", "disabled");
export const Error = componentStory("SuggestInput", "error");
