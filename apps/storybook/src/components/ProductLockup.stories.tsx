import { componentParameters, componentStory } from "./story.js";

export default { title: "Components/ProductLockup", parameters: componentParameters("ProductLockup") };
export const Default = componentStory("ProductLockup", "default");
export const Products = componentStory("ProductLockup", "products");
export const Rail = componentStory("ProductLockup", "rail");
export const FirstLine = componentStory("ProductLockup", "first-line");
