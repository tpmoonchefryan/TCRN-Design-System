import { checkOutput,checkSourceClosure,checkFonts,finish } from "./lib/published-standard-proof.mjs";
export { reconcileOutput } from "./lib/generated-output.mjs";
const result=checkOutput();result.issues.push(...checkSourceClosure(),...checkFonts().issues);finish("current-output-membership",result);
