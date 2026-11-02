import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./lib/approved-site-source.mjs";
import { checkSource,checkOutput,checkRoutes,finish } from "./lib/published-standard-proof.mjs";
const routes=await checkRoutes(),output=checkOutput();const result={source:checkSource(),issues:[...routes.issues,...output.issues],candidateOutput:output,stories:routes.stories,apis:routes.apis,ownerVisualAcceptance:"not-performed",pendingFormalAmendments:["K1","K5"],formalAmendmentState:"direction decided; pending formal-standard amendment/publication and consumer-version alignment",undecidedStandardClarifications:["S03-C01"]};
const out=path.join(ROOT,"docs/verification/current-standard-only");fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,"hardening-proof.json"),JSON.stringify(result,null,2)+"\n");finish("current-standard-only-hardening",result);
