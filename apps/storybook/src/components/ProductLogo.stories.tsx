import { componentParameters, componentStory } from "./story.js";

export default { id: "components-productlogo", title: "Components/Foundations/ProductLogo", parameters: componentParameters("ProductLogo") };
export const Default = componentStory("ProductLogo", "default");
export const Products = componentStory("ProductLogo", "products");
export const Variants = componentStory("ProductLogo", "variants");
