import { componentParameters, componentStory } from "./story.js";

export default { title: "Components/ProductLogo", parameters: componentParameters("ProductLogo") };
export const Default = componentStory("ProductLogo", "default");
export const Products = componentStory("ProductLogo", "products");
export const Variants = componentStory("ProductLogo", "variants");
