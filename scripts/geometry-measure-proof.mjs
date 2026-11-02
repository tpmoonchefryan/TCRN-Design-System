import { proveGeometry } from "./lib/published-docs-browser.mjs";
import { finish } from "./lib/published-standard-proof.mjs";
export { proveGeometry };
if(process.argv[1]?.endsWith("geometry-measure-proof.mjs"))finish("published-control-geometry",await proveGeometry());
