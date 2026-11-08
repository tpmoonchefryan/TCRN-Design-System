import { componentParameters, componentStory } from "./story.js";

export default { id: "components-shellpins", title: "Components/Application shell/ShellPins", parameters: componentParameters("ShellPins") };
export const Default = componentStory("ShellPins", "default");
export const Overflow = componentStory("ShellPins", "overflow");
export const Reorder = componentStory("ShellPins", "reorder");
