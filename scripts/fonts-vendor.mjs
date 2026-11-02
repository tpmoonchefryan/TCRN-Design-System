#!/usr/bin/env node
// Copies only the actual font bytes of published Sites v1. No npm/CDN replacement or subsetting.
import fs from "node:fs";
import path from "node:path";
import { readApprovedSource, extractFontFaces, ROOT, sha256 } from "./lib/approved-site-source.mjs";
import { reconcileOutput } from "./lib/generated-output.mjs";
const source=readApprovedSource(), faces=extractFontFaces(source);
const target=path.join(ROOT,"packages/ui-tokens/fonts");
const files=[...new Map(faces.map(f=>[f.file,f])).values()];
const css=source.fontCss.replace(/url\(([^)]+)\)/g,(_whole,url)=>{
 const rel=url.replace(/['"]/g,"").replace(/^\//,"");
 const f=source.manifest.fontFiles.find(f=>f.sourcePath===rel);if(!f)throw new Error(`Unmapped formal face ${rel}`);return `url("./${f.file}")`;
});
const manifest={schemaVersion:"tcrn.published-site-fonts.v1",site:source.manifest.site,sourceCssSha256:sha256(source.fontCss),families:[...new Set(faces.map(f=>f.family))],files:files.map(f=>({file:f.file,sha256:f.sha256,bytes:f.bytes,sourcePath:f.sourcePath})),faces,licenses:["hanken-grotesk-OFL.txt","source-serif-4-OFL.txt","ibm-plex-mono-OFL.txt","noto-sans-sc-OFL.txt","noto-serif-sc-OFL.txt","approved-site-original-notice.txt"]};
reconcileOutput(target,[...files.map(f=>f.file),"fonts.css","manifest.json"]);
fs.mkdirSync(target,{recursive:true});
for(const f of files) fs.copyFileSync(path.join(source.base,f.sourcePath),path.join(target,f.file));
fs.writeFileSync(path.join(target,"fonts.css"),css);fs.writeFileSync(path.join(target,"manifest.json"),JSON.stringify(manifest,null,2)+"\n");
fs.copyFileSync(path.join(source.base,"assets/fonts/ORIGINAL-LICENSE-NOTICE.txt"),path.join(ROOT,"packages/ui-tokens/licenses/approved-site-original-notice.txt"));
console.log(`published font files ${files.length}; face bindings ${faces.length}; families ${manifest.families.length}`);
