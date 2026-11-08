import { componentParameters, componentStory } from "./story.js";

export default { id: "components-linkbutton", title: "Components/Actions/LinkButton", parameters: componentParameters("LinkButton") };
export const Default = componentStory("LinkButton", "default");
export const Variants = componentStory("LinkButton", "variants");
export const External = componentStory("LinkButton", "external");
export const Focus = componentStory("LinkButton", "focus");
