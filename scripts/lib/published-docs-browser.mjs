import { withPublishedBrowser } from "./published-browser-proof.mjs";
import { LOCALES } from "./published-standard-proof.mjs";
import { APPROVED_BOARD_IDS } from "./approved-site-pins.mjs";

export async function proveGeometry(){return withPublishedBrowser(async({browser,base})=>{const issues=[],observations=[],page=await browser.newPage({viewport:{width:1440,height:1000}});try{
  for(const board of ["05-actions","06-inputs"]){await page.goto(`${base}/en/${board}.html`);await page.evaluate(()=>document.fonts.ready);const readings=await page.locator('[data-approved-board] .tcrn-button,[data-approved-board] .tcrn-input,[data-approved-board] .tcrn-select,[data-approved-board] .tcrn-checkbox,[data-approved-board] .tcrn-switch__control').evaluateAll(elements=>elements.filter(el=>el.getBoundingClientRect().width>0).map(el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return {className:el.className,width:r.width,height:r.height,radius:s.borderRadius,fontSize:s.fontSize,transform:s.transform,stroke:s.strokeWidth};}));
    for(const r of readings){if(/tcrn-button|tcrn-input|tcrn-select/.test(r.className)&&!r.className.includes("textarea")&&![28,32,40].some(h=>Math.abs(r.height-h)<.5)&&!r.className.includes("multi-select"))issues.push(`Control height outside published 28/32/40: ${r.className} ${r.height}`);if(r.className.includes("tcrn-checkbox")&&(r.width!==16||r.height!==16))issues.push("Checkbox differs from published 16px square");if(r.className.includes("tcrn-switch__control")&&!((r.width===34&&r.height===20)||(r.width===28&&r.height===16)))issues.push("Switch differs from published 34×20 / small 28×16");if(r.className.includes("tcrn-button")&&r.transform!=="none")issues.push("Action press/hover gained a transform");}
    observations.push({board,readings});
  }
}finally{await page.close();}return {issues,observations};});}
async function renderedFonts(page,selector){
 const session=await page.context().newCDPSession(page);
 try{await session.send("DOM.enable");await session.send("CSS.enable");const {root}=await session.send("DOM.getDocument");const {nodeId}=await session.send("DOM.querySelector",{nodeId:root.nodeId,selector});if(!nodeId)throw new Error(`Missing rendered-font probe ${selector}`);const {fonts}=await session.send("CSS.getPlatformFontsForNode",{nodeId});const byFamily=new Map();for(const font of fonts)if(font.glyphCount)byFamily.set(font.familyName,(byFamily.get(font.familyName)??0)+font.glyphCount);return [...byFamily].sort(([a],[b])=>a.localeCompare(b));}
 finally{await session.detach();}
}
export async function proveFontsInBrowser(){return withPublishedBrowser(async({browser,base})=>{
 const issues=[],observations=[],page=await browser.newPage(),reference=await browser.newPage(),requests=[];page.on("request",r=>requests.push(r.url()));
 try{
  await reference.goto(`${base}/__formal/02-typography`);
  for(const locale of LOCALES){
   await page.goto(`${base}/${locale}/02-typography.html`);
   const result=await page.evaluate(async()=>{await document.fonts.ready;const families=["Hanken Grotesk","Source Serif 4","IBM Plex Mono","Noto Sans SC","Noto Serif SC"];return {faces:await Promise.all(families.map(async family=>({family,loaded:(await document.fonts.load(`16px "${family}"`,family.startsWith("Noto")?"季度复盘":"Q3 Review 128")).length}))),text:Object.fromEntries(["body","h1","id"].map(role=>[role,document.querySelector(`[data-formal-role="${role}"]`)?.textContent??""]))};});
   for(const face of result.faces)if(!face.loaded)issues.push(`${locale}: formal family did not load ${face.family}`);
   await reference.evaluate(({text,locale})=>{document.documentElement.lang=locale;document.getElementById("font-role-reference")?.remove();const container=document.createElement("div");container.id="font-role-reference";container.className="pane gp";for(const [role,value]of Object.entries(text)){const el=document.createElement(role==="h1"?"h1":"p");el.className=role==="body"?"tx":role;el.id=`font-ref-${role}`;el.textContent=value;container.append(el);}document.body.append(container);return document.fonts.ready;},{text:result.text,locale});
   const roles=[];for(const role of ["body","h1","id"]){const actual=await renderedFonts(page,`[data-formal-role="${role}"]`),expected=await renderedFonts(reference,`#font-ref-${role}`);if(!actual.length||JSON.stringify(actual)!==JSON.stringify(expected))issues.push(`${locale}/${role}: actual rendered font families/glyph counts differ from the independent published-font reference`);roles.push({role,text:result.text[role],actual,expected});}
   observations.push({locale,faces:result.faces,roles});
  }
  if(requests.some(url=>!url.startsWith(base)))issues.push("Font/browser resource request escaped the local published-asset closure");
 }finally{await page.close();await reference.close();}
 return {issues,observations,networkRequests:requests.length};
});}
export async function proveDocsRoutes(){return withPublishedBrowser(async({browser,base})=>{const issues=[],observations=[],page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on("pageerror",error=>errors.push(error.message));try{
  for(const locale of LOCALES)for(const id of ["index",...Object.keys(APPROVED_BOARD_IDS),"api","source"]){const response=await page.goto(`${base}/${locale}/${id}.html`);if(response.status()!==200)issues.push(`${locale}/${id} is not readable`);const facts=await page.evaluate(()=>({lang:document.documentElement.lang,source:document.querySelector('meta[name="standard-source-commit"]')?.content,boards:[...document.querySelectorAll("[data-approved-board]")].map(el=>el.getAttribute("data-approved-board")),apis:[...document.querySelectorAll("[data-approved-api]")].map(el=>el.getAttribute("data-approved-api")),main:document.querySelectorAll("main").length,brokenNames:[...document.querySelectorAll("button")].filter(el=>!el.textContent.trim()&&!el.getAttribute("aria-label")).length}));if(facts.lang!==locale||facts.main!==1||facts.brokenNames)issues.push(`${locale}/${id}: locale, main landmark or icon accessible-name drift`);observations.push({locale,id,...facts});}
  issues.push(...errors.map(e=>`Browser error: ${e}`));
}finally{await page.close();}return {issues,observations};});}
