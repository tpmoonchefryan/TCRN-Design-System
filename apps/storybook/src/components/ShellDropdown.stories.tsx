import { componentParameters, componentStory } from "./story.js";

export default { title: "Components/ShellDropdown", parameters: componentParameters("ShellDropdown") };
export const Default = componentStory("ShellDropdown", "default");
export const Search = componentStory("ShellDropdown", "search");
export const Cascade = componentStory("ShellDropdown", "cascade");
