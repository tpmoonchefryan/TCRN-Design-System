import { componentParameters, componentStory } from "./story.js";

export default { title: "Components/Switch", parameters: componentParameters("Switch") };
export const Default = componentStory("Switch", "default");
export const Checked = componentStory("Switch", "checked");
export const Small = componentStory("Switch", "small");
export const Disabled = componentStory("Switch", "disabled");
