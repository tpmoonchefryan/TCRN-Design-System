import { proveDocsRoutes } from "./lib/published-docs-browser.mjs";
import { finish } from "./lib/published-standard-proof.mjs";
export { proveDocsRoutes };
if(process.argv[1]?.endsWith("internal-alpha-browser-proof.mjs"))finish("all-current-routes-five-locales",await proveDocsRoutes());
