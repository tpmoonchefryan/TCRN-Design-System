import { ROOT } from "./lib/approved-site-source.mjs";
import { checkContrast,checkTokens,finish,contrast } from "./lib/published-standard-proof.mjs";
export { contrast };
export async function proveContrast(root=ROOT){const result=checkContrast(root);result.issues.push(...(await checkTokens(root)).issues);return result;}
if(process.argv[1]?.endsWith("token-contrast-proof.mjs"))finish("published-token-contrast",await proveContrast());
