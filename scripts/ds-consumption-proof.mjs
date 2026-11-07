import path from "node:path";
import { pathToFileURL } from "node:url";
import { proveStyleClosure, provePublishedConsumption } from "./lib/published-style-closure.mjs";
import { finish } from "./lib/published-standard-proof.mjs";
export { proveStyleClosure, provePublishedConsumption };
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  finish("ds-consumption-proof", await provePublishedConsumption());
}
