import { componentParameters, componentStory } from "./story.js";

export default { id: "components-shelldropdown", title: "Components/Application shell/ShellDropdown", parameters: componentParameters("ShellDropdown") };
export const Default = componentStory("ShellDropdown", "default");
export const Search = componentStory("ShellDropdown", "search");
export const Cascade = componentStory("ShellDropdown", "cascade");
