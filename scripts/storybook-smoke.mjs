import { checkRoutes,checkOutput,checkManagerOutput,finish } from "./lib/published-standard-proof.mjs";
import { proveBothDocsEntrypoints } from "./lib/published-docs-browser.mjs";
const routes=await checkRoutes(),staticOutput=checkOutput(),managerOutput=checkManagerOutput();
const browser=await proveBothDocsEntrypoints();
finish("both-storybook-entrypoints",{issues:[...routes.issues,...staticOutput.issues,...managerOutput.issues,...browser.issues],routes,staticOutput,managerOutput,browser});
