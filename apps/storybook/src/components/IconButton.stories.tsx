import { componentParameters, componentStory } from "./story.js";

export default { id: "components-iconbutton", title: "Components/Actions/IconButton", parameters: componentParameters("IconButton") };
export const Default = componentStory("IconButton", "default");
export const Labelled = componentStory("IconButton", "labelled");
export const Sizes = componentStory("IconButton", "sizes");
export const Hover = componentStory("IconButton", "hover");
export const Active = componentStory("IconButton", "active");
export const Focus = componentStory("IconButton", "focus");
export const Disabled = componentStory("IconButton", "disabled");
export const Loading = componentStory("IconButton", "loading");
export const Selected = componentStory("IconButton", "selected");
