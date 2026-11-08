import { componentParameters, componentStory } from "./story.js";

export default { id: "components-shellintro", title: "Components/Application shell/ShellIntro", parameters: componentParameters("ShellIntro") };
export const Default = componentStory("ShellIntro", "default");
export const Replay = componentStory("ShellIntro", "replay");
