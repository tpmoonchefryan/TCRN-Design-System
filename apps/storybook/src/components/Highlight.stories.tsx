import { componentParameters, componentStory } from "./story.js";

export default { id: "components-highlight", title: "Components/Foundations/Highlight", parameters: componentParameters("Highlight") };
export const Default = componentStory("Highlight", "default");
export const Empty = componentStory("Highlight", "empty");
export const CaseSensitive = componentStory("Highlight", "case-sensitive");
