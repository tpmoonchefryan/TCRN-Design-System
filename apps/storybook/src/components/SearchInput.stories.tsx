import { componentParameters, componentStory } from "./story.js";

export default { title: "Components/SearchInput", parameters: componentParameters("SearchInput") };
export const Default = componentStory("SearchInput", "default");
export const Filled = componentStory("SearchInput", "filled");
export const Focus = componentStory("SearchInput", "focus");
export const Readonly = componentStory("SearchInput", "readonly");
export const Disabled = componentStory("SearchInput", "disabled");
export const Error = componentStory("SearchInput", "error");
