import { proveFamilyMatrices } from "./lib/published-browser-proof.mjs";
import { finish } from "./lib/published-standard-proof.mjs";
export { proveFamilyMatrices };
if(process.argv[1]?.endsWith("storybook-visual-proof.mjs"))finish("published-family-visual-source",await proveFamilyMatrices());
