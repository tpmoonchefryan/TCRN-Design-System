import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./lib/approved-site-source.mjs";
import { compiled,finish } from "./lib/published-standard-proof.mjs";
const ui=await compiled(ROOT,"packages/ui-react/dist/approved.js"),issues=[];
if(!ui.tcrnComponentCss||ui.tcrnComponentCss.includes("undefined"))issues.push("Stylesheet assembly has a missing segment");
let depth=0;for(const c of ui.tcrnComponentCss.replace(/\/\*[\s\S]*?\*\//g,"")){if(c==="{")depth++;if(c==="}")depth--;if(depth<0)issues.push("Stylesheet closes an unopened rule");}if(depth)issues.push("Stylesheet rule braces are unbalanced");
finish("current-css-template-integrity",{issues});
