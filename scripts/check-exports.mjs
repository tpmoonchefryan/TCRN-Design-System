import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { ROOT } from "./lib/approved-site-source.mjs";
const checks=[];
for(const rel of ["packages/ui-tokens","packages/ui-copy-state","packages/ui-react"]){
 const base=path.join(ROOT,rel),manifest=JSON.parse(fs.readFileSync(path.join(base,"package.json"),"utf8"));
 for(const [subpath,target]of Object.entries(manifest.exports)){
  if(typeof target!=="object"||!target.default)continue;
  const js=path.join(base,target.default),types=target.types?path.join(base,target.types):null;
  const row={name:manifest.name,subpath,jsExists:fs.existsSync(js),typesExist:!types||fs.existsSync(types)};
  if(row.jsExists)await import(pathToFileURL(js).href);checks.push(row);
 }
}
const ok=checks.every(c=>c.jsExists&&c.typesExist);console.log(JSON.stringify({ok,checks},null,2));if(!ok)process.exitCode=1;
