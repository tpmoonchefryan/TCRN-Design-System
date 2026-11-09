import { ROOT } from "./lib/approved-site-source.mjs";
import { compiled,checkTokens,checkBrand,checkPairReferences,finish,FORMAL_REVIEW_STATUS } from "./lib/published-standard-proof.mjs";
import { checkSelectionCss,checkPairStateRules } from "./lib/selection-carriers.mjs";
export { checkSelectionCss,checkPairStateRules };
export async function proveStaticContract(root=ROOT){const ui=await compiled(root,"packages/ui-react/dist/approved.js");const issues=[...checkPairReferences(ui.tcrnComponentCss),...checkSelectionCss(ui.tcrnComponentCss),...checkPairStateRules(ui.tcrnComponentCss),...(await checkTokens(root)).issues,...(await checkBrand(root)).issues];return {issues,source:"published Sites v2",...FORMAL_REVIEW_STATUS};}
if(process.argv[1]?.endsWith("contract-static-proof.mjs"))finish("published-static-contract",await proveStaticContract());
