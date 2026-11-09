import { ROOT } from "./lib/approved-site-source.mjs";
import { checkSource,checkOutput,checkRoutes,finish,FORMAL_REVIEW_STATUS } from "./lib/published-standard-proof.mjs";
import { writeVerificationReport } from "./lib/verification-report.mjs";
const routes=await checkRoutes(),output=checkOutput();const result={source:checkSource(),issues:[...routes.issues,...output.issues],candidateOutput:output,stories:routes.stories,apis:routes.apis,...FORMAL_REVIEW_STATUS};
writeVerificationReport("hardening-proof", result, ROOT);
finish("current-standard-only-hardening",result);
