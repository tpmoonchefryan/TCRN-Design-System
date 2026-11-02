import { checkFonts,finish } from "./lib/published-standard-proof.mjs";
export { checkFonts as proveFonts } from "./lib/published-standard-proof.mjs";
if(process.argv[1]?.endsWith("fonts-proof.mjs"))finish("published-fonts",checkFonts());
