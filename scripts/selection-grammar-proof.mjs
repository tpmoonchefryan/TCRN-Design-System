import { checkSelectionCss, proveStaticContract } from "./contract-static-proof.mjs";
import { finish } from "./lib/published-standard-proof.mjs";
export { checkSelectionCss };
finish("published-selection-carriers",await proveStaticContract());
