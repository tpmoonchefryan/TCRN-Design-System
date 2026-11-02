import { checkOutput,checkSourceClosure,finish } from "./lib/published-standard-proof.mjs";
const result=checkOutput();result.issues.push(...checkSourceClosure());finish("published-output-closure",result);
