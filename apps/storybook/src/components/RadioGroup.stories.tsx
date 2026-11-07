import { componentParameters, componentStory } from "./story.js";

export default { title: "Components/RadioGroup", parameters: componentParameters("RadioGroup") };
export const Default = componentStory("RadioGroup", "default");
export const Selected = componentStory("RadioGroup", "selected");
export const Disabled = componentStory("RadioGroup", "disabled");
export const Error = componentStory("RadioGroup", "error");
