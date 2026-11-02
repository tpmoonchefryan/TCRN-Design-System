import fs from "node:fs";
import path from "node:path";
import { ROOT, sha256 } from "./approved-site-source.mjs";

// Only explicitly generated roots are eligible. Evidence directories are never outputs.
const allowed = ["apps/storybook/dist", "apps/storybook/storybook-static", "apps/storybook/storybook-preview-static", "packages/ui-react/dist", "packages/ui-tokens/dist", "packages/ui-copy-state/dist", "packages/ui-tokens/fonts"];
export function listFiles(root) {
  if (!fs.existsSync(root)) return [];
  const files=[];
  function walk(dir) { for (const entry of fs.readdirSync(dir,{withFileTypes:true})) { const abs=path.join(dir,entry.name); if(entry.isSymbolicLink()) throw new Error(`Generated output contains symlink: ${abs}`); if(entry.isDirectory()) walk(abs); else if(entry.isFile()) files.push(path.relative(root,abs).split(path.sep).join("/")); } }
  walk(root);return files.sort();
}
export function reconcileOutput(root, expected, options={}) {
  const rel=path.relative(ROOT,path.resolve(root)).split(path.sep).join("/");
  if (!allowed.includes(rel) && !options.fixture) throw new Error(`Not a declared rebuildable output: ${rel}`);
  if(fs.existsSync(root) && fs.lstatSync(root).isSymbolicLink()) throw new Error("Output root must not be a symlink");
  const keep=new Set(expected),stale=listFiles(root).filter(f=>!keep.has(f));
  const trashRoot=options.trashRoot ?? process.env.TCRN_BUILD_TRASH;
  if(stale.length && !trashRoot) throw new Error(`Set TCRN_BUILD_TRASH to an owned scratch/trash directory before reconciling ${rel}`);
  if(trashRoot && !/^trash(?:-|$)/.test(path.basename(path.resolve(trashRoot)))) throw new Error("Rebuild residue destination must be an explicit trash directory");
  if(trashRoot && fs.existsSync(trashRoot) && fs.lstatSync(trashRoot).isSymbolicLink()) throw new Error("Rebuild trash must not be a symlink");
  if(trashRoot && path.resolve(trashRoot).startsWith(path.resolve(root)+path.sep)) throw new Error("Rebuild trash must be outside the output being reconciled");
  const receipt=[];const generation=`${Date.now()}-${process.pid}`;
  for(const file of stale) {
    const from=path.join(root,file),bytes=fs.readFileSync(from),hash=sha256(bytes);
    const to=path.join(path.resolve(trashRoot),generation,rel||"fixture",`${hash.slice(0,12)}-${file}`);
    fs.mkdirSync(path.dirname(to),{recursive:true});if(fs.existsSync(to)) throw new Error(`Residue destination already exists: ${to}`);
    fs.renameSync(from,to);receipt.push({from,to,bytes:bytes.length,sha256:hash});
  }
  if(receipt.length) {fs.mkdirSync(trashRoot,{recursive:true});fs.appendFileSync(path.join(trashRoot,"reconciliation.jsonl"),receipt.map(r=>JSON.stringify(r)).join("\n")+"\n");}
  return receipt;
}
