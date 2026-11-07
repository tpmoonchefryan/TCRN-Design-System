import { componentParameters, componentStory } from "./story.js";

export default { title: "Components/ShellIntro", parameters: componentParameters("ShellIntro") };
export const Default = componentStory("ShellIntro", "default");
export const Replay = componentStory("ShellIntro", "replay");
