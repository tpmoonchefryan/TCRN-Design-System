import { proveShell } from "./lib/published-browser-proof.mjs";
import { finish } from "./lib/published-standard-proof.mjs";
export { proveShell };
if(process.argv[1]?.endsWith("shell-measure-proof.mjs"))finish("published-shell-geometry-interaction-source",await proveShell());
