import { proveFontsInBrowser } from "./lib/published-docs-browser.mjs";
import { finish } from "./lib/published-standard-proof.mjs";
export { proveFontsInBrowser };
if(process.argv[1]?.endsWith("fonts-render-proof.mjs")){const entries=[];for(const entry of ["static","manager"])entries.push(await proveFontsInBrowser({entry}));finish("published-five-font-families",{issues:entries.flatMap(r=>r.issues),entries});}
