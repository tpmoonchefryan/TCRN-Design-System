import { generate } from "./contract-generate.mjs";
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./lib/approved-site-source.mjs";
import { checkSource,checkSourceClosure,checkRoutes,finish } from "./lib/published-standard-proof.mjs";
export async function proveContract(root=ROOT){const source=checkSource(root),issues=[...checkSourceClosure(root)];for(const [rel,expected]of generate(root)){if(!fs.existsSync(path.join(root,rel))||fs.readFileSync(path.join(root,rel),"utf8")!==expected)issues.push(`Stale published-source generation ${rel}`);}const routes=await checkRoutes(root);issues.push(...routes.issues);return {source,issues,stories:routes.stories,apis:routes.apis};}
if(process.argv[1]?.endsWith("contract-proof.mjs"))finish("published-source-contract",await proveContract());
