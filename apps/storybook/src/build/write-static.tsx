import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";
import { renderToString } from "react-dom/server";
import { tcrnComponentCss,tcrnProductMarkSvg } from "@tcrn/ui-react/approved";
import { tcrnTokenCss } from "@tcrn/ui-tokens";
import { App, docsPreferenceKey } from "../app.js";
import { docsNavigation, type DocsPage } from "../portal-navigation.js";
import { approvedSource,supportedLocales,type DocsLocale } from "../approved-source.js";
import { docsCopy } from "../locales.js";
import { createAiConsumptionContract } from "./ai-consumption-contract.js";
import { designAuthority } from "./design-authority.js";
const root=fileURLToPath(new URL("../../../../",import.meta.url));
const hash=(bytes:Uint8Array|string)=>createHash("sha256").update(bytes).digest("hex");
const escape=(value:string)=>value.replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;");
// Apply the saved token set before CSS paints. React hydrates the stable tree under #app.
const themeBootstrap = `try{const saved=JSON.parse(localStorage.getItem(${JSON.stringify(docsPreferenceKey)})??"null");if(saved?.theme==="light"||saved?.theme==="dark")document.documentElement.dataset.tcrnTheme=saved.theme;}catch{}`;

function pageHtml(page:DocsPage,locale:DocsLocale){const c=docsCopy(locale);const state={page,locale};const title=page==="index"?c.title:`${docsNavigation(locale,"static").byPage.get(page)!.label} · ${c.title}`;return `<!doctype html><html lang="${locale}" data-tcrn-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="standard-source-commit" content="${approvedSource.site.sourceCommit}"><title>${escape(title)}</title><script>${themeBootstrap}</script><link rel="icon" type="image/svg+xml" href="/assets/ds-tile-deep.svg"><link rel="stylesheet" href="/fonts/fonts.css"><link rel="stylesheet" href="/storybook.css"></head><body style="margin:0"><div id="app">${renderToString(<App {...state}/>)}</div><script id="page-state" type="application/json">${JSON.stringify(state).replaceAll("<","\\u003c")}</script><script type="module" src="/storybook.js"></script></body></html>`;}
export async function writeStorybookStaticBuild(bundle:Uint8Array){
  const output=path.join(root,"apps/storybook/storybook-static"),fontRoot=path.join(root,"packages/ui-tokens/fonts"),licenseRoot=path.join(root,"packages/ui-tokens/licenses");
  const fonts=JSON.parse(fs.readFileSync(path.join(fontRoot,"manifest.json"),"utf8"));
  if(fonts.site?.sourceCommit!==approvedSource.site.sourceCommit)throw new Error("Fonts were not generated from this published Site");
  const candidate={version:JSON.parse(fs.readFileSync(path.join(root,"packages/ui-react/package.json"),"utf8")).version,commit:execFileSync("git",["-C",root,"rev-parse","HEAD"],{encoding:"utf8"}).trim(),dirty:execFileSync("git",["-C",root,"status","--porcelain=v1"],{encoding:"utf8"}).trim().length>0};
  const files=new Map<string,Uint8Array|string>();
  for(const locale of supportedLocales)for(const page of ["index",...approvedSource.boards.map(b=>b.slug),"api"] as DocsPage[])files.set(`${locale}/${page}.html`,pageHtml(page,locale));
  files.set("index.html",pageHtml("index","en"));files.set("storybook.js",bundle);files.set("storybook.css",tcrnTokenCss+"\n"+tcrnComponentCss+"\n"+fs.readFileSync(path.join(root,"apps/storybook/src/docs.css"),"utf8"));
  files.set("assets/ds-tile-deep.svg",tcrnProductMarkSvg("design-system","tile-deep",{size:48}));
  for(const file of fonts.files){const bytes=fs.readFileSync(path.join(fontRoot,file.file));if(hash(bytes)!==file.sha256)throw new Error(`Font digest mismatch ${file.file}`);files.set(`fonts/${file.file}`,bytes);}
  files.set("fonts/fonts.css",fs.readFileSync(path.join(fontRoot,"fonts.css")));files.set("fonts/manifest.json",JSON.stringify(fonts,null,2)+"\n");
  for(const name of fonts.licenses)files.set(`licenses/${name}`,fs.readFileSync(path.join(licenseRoot,name)));
  files.set("ai-consumption-contract.json",JSON.stringify(createAiConsumptionContract(candidate,fonts.files),null,2)+"\n");files.set("design-authority.json",JSON.stringify({...designAuthority,candidate},null,2)+"\n");
  files.set("llms.txt",`# TCRN Design System candidate ${candidate.version}\nCandidate commit: ${candidate.commit}\nPublished standard: ${approvedSource.site.url}\nPublished Site version: 1\nPublished source commit: ${approvedSource.site.sourceCommit}\nPublished v1 roles:06 form shortcut ink-3;07 menu/shell shortcut ink-2. Published brand colors and strong ink/600 remain. Local fidelity is checked separately from K1 and06 dark shortcut conflicts with text >=4.5. K1/K5/C01 are selected directions, visually unconfirmed and unapplied. Publication request withdrawn by TCRN-DS-MIN-20261104-VISUAL-BEFORE-STANDARD D1-D4; no formal-source import is authorized. Candidate verification and Owner visual acceptance remain pending.\n\n/en/api.html\n${approvedSource.boards.map(b=>`/en/${b.slug}.html`).join("\n")}\n`);
  files.set("robots.txt","User-agent: *\nAllow: /\n");
  const inventory=[...files].map(([name,bytes])=>({path:name,bytes:typeof bytes==="string"?Buffer.byteLength(bytes):bytes.length,sha256:hash(bytes)}));
  files.set("output-manifest.json",JSON.stringify({schemaVersion:"tcrn.storybook-output.v1",candidate,standardSource:approvedSource.site,files:inventory},null,2)+"\n");
  const helpers=await import(pathToFileURL(path.join(root,"scripts/lib/generated-output.mjs")).href) as {reconcileOutput:(dir:string,expected:string[])=>unknown};
  helpers.reconcileOutput(output,[...files.keys()]);fs.mkdirSync(output,{recursive:true});
  for(const [rel,bytes] of files){const target=path.join(output,rel);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes);}
  console.log(`Storybook: ${supportedLocales.length} locales, ${approvedSource.boards.length} source boards, ${files.size} exact output files; published v1 contextual roles retained; source threshold conflicts unresolved; K1/K5/C01 visually unconfirmed/unapplied; publication request withdrawn`);
}
