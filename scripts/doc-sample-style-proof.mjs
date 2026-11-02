import { proveStyleClosure,provePublishedConsumption } from "./lib/published-style-closure.mjs";
import { finish } from "./lib/published-standard-proof.mjs";
export { proveStyleClosure,provePublishedConsumption };
if(process.argv[1]?.endsWith("doc-sample-style-proof.mjs"))finish("doc-sample-style-proof",await provePublishedConsumption());
