import path from "node:path";
import fs from "node:fs";
import { ROOT,sha256 } from "./lib/approved-site-source.mjs";
import { reconcileOutput } from "./lib/generated-output.mjs";
const index=process.argv.indexOf("--root");
if(index<0 || !process.argv[index+1]) throw new Error("--root must name one declared rebuildable output");
const output=path.join(ROOT,process.argv[index+1]);
reconcileOutput(output,[]);
const info=path.join(path.dirname(output),"tsconfig.tsbuildinfo");
if(fs.existsSync(info)){
  const trash=process.env.TCRN_BUILD_TRASH;if(!trash||!/^trash(?:-|$)/.test(path.basename(path.resolve(trash))))throw new Error("Set an owned TCRN_BUILD_TRASH before retiring incremental compiler metadata");
  if(fs.lstatSync(info).isSymbolicLink())throw new Error("Compiler metadata must not be a symlink");
  const bytes=fs.readFileSync(info);const target=path.join(trash,`${Date.now()}-${process.pid}`,path.relative(ROOT,info));fs.mkdirSync(path.dirname(target),{recursive:true});fs.renameSync(info,target);
  fs.appendFileSync(path.join(trash,"reconciliation.jsonl"),JSON.stringify({from:info,to:target,bytes:bytes.length,sha256:sha256(bytes),kind:"incremental-compiler-metadata"})+"\n");
}
