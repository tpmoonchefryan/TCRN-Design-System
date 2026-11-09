// Test-only independent reading of the pinned, published HTML/CSS. No generated expected values.
import { readFileSync } from "node:fs";
export function publishedBoard(slug:string,kind:"index.dc.html"|"board.css"="index.dc.html"):string {
 return readFileSync(new URL(`../../../../docs/design/approved-site-v2/src/boards/${slug}/${kind}`,import.meta.url),"utf8");
}
export function normalizePublishedSvg(body:string,geometryOnly=false):string {
 return body.replace(/\s+vector-effect="[^"]*"/g,"").replace(/<(path|circle|ellipse|rect)([^>]*?)(?:\s*\/\s*>|>\s*<\/\1>)/g,(_m,tag:string,attrs:string)=>{
  const entries=[...attrs.matchAll(/([a-z][a-z-]*)="([^"]*)"/g)].filter(m=>!geometryOnly||!['fill','stroke'].includes(m[1])).map(m=>[m[1],m[2]]).sort((a,b)=>a[0].localeCompare(b[0]));
  return `<${tag}${entries.map(([k,v])=>` ${k}="${v}"`).join("")}/>`;
 }).replace(/>\s+</g,"><").trim();
}
export function publishedMarkBody(markId:string,mode="color"):string {
 const html=publishedBoard("04-brand");
 for(const m of html.matchAll(/<svg\b([^>]*)>([\s\S]*?)<\/svg>/g)) if(m[1].includes(`data-logo="${markId}"`)&&m[1].includes(`data-mode="${mode}"`))return normalizePublishedSvg(m[2]);
 throw new Error(`No published mark ${markId}/${mode}`);
}
export function publishedIconBodies():Map<string,string> {
 const result=new Map<string,string>();for(const slug of ['03-icons','07a-shell-upper'])for(const m of publishedBoard(slug).matchAll(/<svg\b([^>]*)>([\s\S]*?)<\/svg>/g)){
 const name=/data-icon="([^"]+)"/.exec(m[1])?.[1];if(name&&name!=='pin-filled'&&!result.has(name))result.set(name,normalizePublishedSvg(m[2],true));
 }return result;
}
export function publishedToken(name:string):string {
 const block=/\.gp\{([^}]+)\}/.exec(publishedBoard('01-tokens','board.css'))?.[1];if(!block)throw new Error('No published token block');
 const value=new Map(block.split(';').filter(Boolean).map(d=>{const i=d.indexOf(':');return [d.slice(0,i),d.slice(i+1)]})).get(name);
 if(!value)throw new Error(`No published token ${name}`);return value;
}
