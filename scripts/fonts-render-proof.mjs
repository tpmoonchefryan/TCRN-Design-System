import { proveFontsInBrowser } from "./lib/published-docs-browser.mjs";
import { finish } from "./lib/published-standard-proof.mjs";
export { proveFontsInBrowser };
if(process.argv[1]?.endsWith("fonts-render-proof.mjs"))finish("published-five-font-families",await proveFontsInBrowser());
