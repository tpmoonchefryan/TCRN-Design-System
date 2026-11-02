import { useEffect,useState } from "react";
import { ProductShell,LinkButton,Text,Heading,type ProductShellNavGroup } from "@tcrn/ui-react/approved";
import { approvedSource,supportedLocales,type ApprovedBoardId,type DocsLocale } from "./approved-source.js";
import { approvedApi } from "./approved-api.js";
import { ApiReference } from "./api-reference.js";
import { SourceMatrices } from "./source-matrices.js";
import { BoardSpecimens } from "./specimens.js";
import { docsCopy } from "./locales.js";
export type DocsPage=ApprovedBoardId|"index"|"api"|"source";
export interface PageProps{page:DocsPage;locale:DocsLocale;theme?:"light"|"dark"}
export function navGroups(locale:DocsLocale,page?:DocsPage):ProductShellNavGroup[]{const c=docsCopy(locale);return [
 {id:"published",label:c.title,items:approvedSource.boards.map((b,i)=>({id:b.slug,label:c.boardTitles[i],href:`/${locale}/${b.slug}.html`,selected:b.slug===page,iconName:"book-open" as const}))},
 {id:"contracts",label:c.api,items:[{id:"api",label:c.api,href:`/${locale}/api.html`,iconName:"package"}]},
 {id:"source",label:c.source,items:[{id:"source",label:c.source,href:`/${locale}/source.html`,iconName:"info"}]}
 ];}
export function sourceSearch(locale:DocsLocale,query:string){const c=docsCopy(locale);const term=query.trim().normalize("NFKC").toLocaleLowerCase(locale);if(!term)return [];
 const records=[...approvedSource.boards.map((b,i)=>({id:b.slug,title:c.boardTitles[i],meta:c.summaries[i],href:`/${locale}/${b.slug}.html`,keywords:b.slug})),...approvedApi.map(api=>({id:`api-${api.name}`,title:api.name,meta:c.api,href:`/${locale}/api.html#api-${api.name}`,keywords:api.props.join(" ")})),{id:"source",title:c.source,meta:c.provenance,href:`/${locale}/source.html`,keywords:approvedSource.site.sourceCommit}];
 return records.filter(r=>`${r.title} ${r.meta} ${r.keywords}`.normalize("NFKC").toLocaleLowerCase(locale).includes(term)).map(({keywords:_keywords,...r})=>r);
}
export function App({page,locale,theme:initialTheme="light"}:PageProps){
 const c=docsCopy(locale),[theme,setTheme]=useState(initialTheme),[pins,setPins]=useState<readonly string[]>(["01-tokens","02-typography","04-brand"]),[preferencesReady,setPreferencesReady]=useState(false);
 const index=approvedSource.boards.findIndex(b=>b.slug===page),title=index>=0?c.boardTitles[index]:page==="api"?c.api:page==="source"?c.source:c.title;
 // Static documentation has a local anonymous preference store. Real products bind the existing
 // per-user/per-product server adapter from 07b E; this preview does not claim cross-device storage.
 useEffect(()=>{
  try{const key="tcrn-published-docs:anonymous:design-system";const saved=JSON.parse(localStorage.getItem(key)??"null") as {theme?:unknown;pins?:unknown}|null;
   if(saved?.theme==="light"||saved?.theme==="dark")setTheme(saved.theme);
   if(Array.isArray(saved?.pins)){const allowed=new Set(navGroups(locale).flatMap(g=>[g.id,...g.items.map(i=>i.id)]));setPins([...new Set(saved.pins.filter((id):id is string=>typeof id==="string"&&allowed.has(id)))]);}
  }catch{/* Unavailable browser storage does not prevent navigation. */}finally{setPreferencesReady(true);}
 },[locale]);
 useEffect(()=>{document.documentElement.dataset.tcrnTheme=theme;document.documentElement.lang=locale;if(preferencesReady)try{localStorage.setItem("tcrn-published-docs:anonymous:design-system",JSON.stringify({theme,pins}));}catch{/* Preferences remain usable for this visit. */}},[theme,locale,pins,preferencesReady]);
 return <div data-tcrn-root="" data-tcrn-theme={theme} data-published-source={approvedSource.site.sourceCommit}>
  <ProductShell productName="TCRN Design System" moduleName={c.title} brandProductId="design-system" currentRouteLabel={title} navGroups={navGroups(locale,page)} searchProvider={query=>sourceSearch(locale,query)} currentLocale={locale} locales={supportedLocales.map(l=>({locale:l,nativeName:l}))} currentTheme={theme} onThemeChange={setTheme} onLocaleChange={l=>{location.href=`/${l}/${page}.html`;}} pinnedIds={pins} onPinnedChange={(id,pinned)=>setPins(pinned?[...pins.filter(p=>p!==id),id]:pins.filter(p=>p!==id))} onPinsReorder={setPins} account={{name:"TCRN",initials:"T"}} products={[{id:"design-system",label:"TCRN Design System",href:`/${locale}/index.html`,current:true}]} pageHeader={{title,description:index>=0?c.summaries[index]:c.provenance,actions:<LinkButton variant="quiet" size="sm" href={`/${locale}/source.html`}>{c.source}</LinkButton>}} contentRole="main" contentId="standards-content">
   <div className="tcrn-doc-content">
    <Text size="meta" data-unresolved-standard="K1 K5">{c.conflict}</Text>
    {index>=0?<article data-approved-board={page} data-source-id={approvedSource.boards[index].sourceId}><BoardSpecimens board={page as ApprovedBoardId} locale={locale}/><SourceMatrices board={page as ApprovedBoardId} locale={locale}/></article>
     :page==="api"?<ApiReference locale={locale}/>
     :page==="source"?<><Text>{c.provenance}</Text><a className="tcrn-link" href={approvedSource.site.url}>{approvedSource.site.url}</a><dl className="tcrn-doc-code">{Object.entries(approvedSource.site).map(([key,value])=><div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>{approvedSource.boards.map(board=><p key={board.slug} className="tcrn-doc-source">{board.slug} · {board.sourceId}</p>)}</>
     :<div className="tcrn-doc-grid">{approvedSource.boards.map((board,i)=><section key={board.slug}><Heading level={2} visualLevel={3}><a className="tcrn-link" href={`/${locale}/${board.slug}.html`}>{c.boardTitles[i]}</a></Heading><Text>{c.summaries[i]}</Text></section>)}</div>}
   </div>
  </ProductShell>
 </div>;
}
