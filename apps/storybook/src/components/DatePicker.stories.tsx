import { componentParameters, componentStory } from "./story.js";

export default { title: "Components/DatePicker", parameters: componentParameters("DatePicker") };
export const Default = componentStory("DatePicker", "default");
export const Bounds = componentStory("DatePicker", "bounds");
export const Readonly = componentStory("DatePicker", "readonly");
export const Disabled = componentStory("DatePicker", "disabled");
export const Error = componentStory("DatePicker", "error");
