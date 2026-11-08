import { componentParameters, componentStory } from "./story.js";

export default { id: "components-shellmenu", title: "Components/Application shell/ShellMenu", parameters: componentParameters("ShellMenu") };
export const Default = componentStory("ShellMenu", "default");
export const Panel = componentStory("ShellMenu", "panel");
export const Sheet = componentStory("ShellMenu", "sheet");
export const Search = componentStory("ShellMenu", "search");
