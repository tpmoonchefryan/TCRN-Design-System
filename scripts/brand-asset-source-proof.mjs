import { checkBrand,checkSourceClosure,finish } from "./lib/published-standard-proof.mjs";
const result=await checkBrand();result.issues.push(...checkSourceClosure());finish("published-mark-and-icon-bytes",result);
