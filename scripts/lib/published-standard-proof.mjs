import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { ROOT,readApprovedSource,extractTokens,extractPackageBindings,extractMarks,extractIcons,extractFontFaces,extractMatrixOccurrences,cssRule,normalizeSvgBody,decodeHtml,sha256 } from "./approved-site-source.mjs";
import { APPROVED_SITE,APPROVED_BOARD_IDS } from "./approved-site-pins.mjs";
import { listFiles } from "./generated-output.mjs";

export const OLD_MOTHER_SHA256="5f28f17c599c63a05a51c81be03f9ef7845299af1940ebe6aef61f7af47fc25b";
export const OLD_MOTHER_GEOMETRY_SHA256="12704ec78903e1609d0bf0dcfbb833ad3a5f9d2a4827f823608fe9d27b2e2089";
export const FORMAL_REVIEW_STATUS = Object.freeze({
  unconfirmedProposals: [],
  proposalState: "owner-adopted; author source and producer remain unpublished",
  proposalMinutes: {
    K1K5: "minutes:876fc874ed2380b3daddb0aa#D1-D4",
    C01: "minutes:3d37207504a1caf4af9aca05#D1-D4",
  },
  ownerClarificationMinute: "minutes:3244c7ac6adef4fc078d413e#D1-D4",
  publicationRequest: "deferred-by-owner",
  ownerVisualAcceptance: "not-performed",
  adoptedAmendments: {
    ids: ["K1", "K5", "S03-C01"],
    minute: "minutes:6f3e0a9a1e07e3980867d82e#D1",
    authorSourceCommit: "e76b7272d98c0359a57c42d49bf70d64e5b4c2ad",
    sourcePublication: "deferred-by-owner; local-candidate-only",
    publicationHoldMinute: "minutes:00710c786ec8423e5dce0186#D1-D2",
  },
  adoptedSupport: {
    minute: "minutes:6f3e0a9a1e07e3980867d82e#D2",
    state: "owner-adopted; producer-unpublished",
    patterns: ["pattern/customer-list-boundary", "pattern/product-locales"],
    formalComponents: 28,
    builtInLocales: 5,
    productLocales: ["en", "zh_HANS", "zh_HANT", "ja", "ko", "fr"],
  },
});
export const LOCALES=["zh-CN","en","ja","ko","fr"];
const publishedApiBoards={Heading:"02-typography",Text:"02-typography",Highlight:"02-typography",Icon:"03-icons",ProductLogo:"04-brand",ProductLockup:"04-brand",Button:"05-actions",IconButton:"05-actions",LinkButton:"05-actions",ClipboardCopyButton:"05-actions",ButtonGroup:"05-actions",Input:"06-inputs",Textarea:"06-inputs",SearchInput:"06-inputs",SuggestInput:"06-inputs",Select:"06-inputs",MultiSelect:"06-inputs",NumberInput:"06-inputs",DatePicker:"06-inputs",Checkbox:"06-inputs",RadioGroup:"06-inputs",Switch:"06-inputs",ProductShell:"07b-shell-lower",ShellBrandButton:"07a-shell-upper",ShellMenu:"07b-shell-lower",ShellPins:"07b-shell-lower",ShellDropdown:"07b-shell-lower",ShellIntro:"07a-shell-upper"};
export const APPROVED_API_BOARDS=Object.freeze(publishedApiBoards);
export function sourceIdentityIssues(actual,label="source"){return Object.entries(APPROVED_SITE).filter(([key,value])=>actual?.[key]!==value).map(([key])=>`${label}: wrong published ${key}`);}
const read=(root,rel)=>fs.readFileSync(path.join(root,rel),"utf8");
export async function compiled(root,rel){return import(`${pathToFileURL(path.join(root,rel)).href}?published-proof=${Date.now()}`);}
export function checkSource(root=ROOT){const s=readApprovedSource(root);return {site:s.manifest.site,boardCount:s.boards.length,sourceFiles:s.manifest.files.length,fontFiles:s.manifest.fontFiles.length,sourceManifestSha256:sha256(read(root,"docs/design/approved-site-v1/source-manifest.json"))};}
export function formalApiContracts(source=readApprovedSource()){
 const locations=JSON.parse(fs.readFileSync(new URL('./api-source-lines.json',import.meta.url),'utf8'));
 return Object.fromEntries(Object.entries(locations).map(([name,{board,lines}])=>{
  if(publishedApiBoards[name]!==board)throw new Error(`Wrong formal API source ${name}`);
  const html=source.board(board).html.split('\n');
  const formal=lines.map(line=>decodeHtml(html[line-1].replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim()).join('\n');
  return [name,{board,line:lines[0],lines,formal}];
 }));
}
export function checkProjection(registry,apis,{source=readApprovedSource()}={}){
  const issues=[],ids=Object.keys(APPROVED_BOARD_IDS),formal=formalApiContracts(source);
  if(registry.length!==8||registry.some((r,i)=>r.id!==ids[i]||r.sourceId!==APPROVED_BOARD_IDS[r.id]))issues.push("Registry is not the fixed eight published board identities in source order");
  if(apis.length!==Object.keys(publishedApiBoards).length)issues.push("API reference membership differs from explicit published contracts");
  for(const api of apis){
    const expected=formal[api.name];
    if(publishedApiBoards[api.name]!==api.board||!expected||api.formal!==expected.formal||api.line!==expected.line)issues.push(`Unpublished or incomplete normative API contract ${api.name}`);
    if(!LOCALES.every(locale=>typeof api.summary?.[locale]==='string'&&api.summary[locale].length>20)||new Set(Object.values(api.summary??{})).size!==5)issues.push(`API reader-language summaries missing ${api.name}`);
    if(!api.example?.includes(`<${api.name}`)||!Array.isArray(api.props)||!api.props.length)issues.push(`Missing concrete API usage ${api.name}`);
    if(api.name==='IconButton'&&(!api.props.some(p=>p.includes('children'))||!api.example.includes('</IconButton>')))issues.push('IconButton visible-label contract missing');
  }
  if(new Set(apis.map(a=>a.name)).size!==apis.length)issues.push("Duplicate API contracts");
  return issues;
}
export const CURRENT_STORY_SOURCE_FILES = Object.freeze([
  "DocsTopicNav.tsx",
  "api-reference.tsx",
  "app.tsx",
  "approved-api.ts",
  "approved-source.ts",
  "build.tsx",
  "build/ai-consumption-contract.ts",
  "build/ai-rule-bundle.ts",
  "build/design-authority.ts",
  "build/write-static.tsx",
  "client.tsx",
  "component-catalog.ts",
  "component-examples.tsx",
  "component-layout.ts",
  "component-overview.tsx",
  "component-usage.ts",
  "components/Button.stories.tsx",
  "components/ButtonGroup.stories.tsx",
  "components/Checkbox.stories.tsx",
  "components/ClipboardCopyButton.stories.tsx",
  "components/DatePicker.stories.tsx",
  "components/Heading.stories.tsx",
  "components/Highlight.stories.tsx",
  "components/Icon.stories.tsx",
  "components/IconButton.stories.tsx",
  "components/Input.stories.tsx",
  "components/LinkButton.stories.tsx",
  "components/MultiSelect.stories.tsx",
  "components/NumberInput.stories.tsx",
  "components/ProductLockup.stories.tsx",
  "components/ProductLogo.stories.tsx",
  "components/ProductShell.stories.tsx",
  "components/RadioGroup.stories.tsx",
  "components/SearchInput.stories.tsx",
  "components/Select.stories.tsx",
  "components/ShellBrandButton.stories.tsx",
  "components/ShellDropdown.stories.tsx",
  "components/ShellIntro.stories.tsx",
  "components/ShellMenu.stories.tsx",
  "components/ShellPins.stories.tsx",
  "components/SuggestInput.stories.tsx",
  "components/Switch.stories.tsx",
  "components/Text.stories.tsx",
  "components/Textarea.stories.tsx",
  "components/story.tsx",
  "contract-stories/gplus/generated/matrices.generated.ts",
  "contract-stories/kernel.ts",
  "docs.css",
  "locales.ts",
  "portal-copy.ts",
  "portal-navigation.ts",
  "portal.tsx",
  "smoke.test.ts",
  "source-matrices.tsx",
  "specimen-copy.ts",
  "specimens.tsx",
  "standards.stories.tsx",
  "support.stories.tsx",
  "storybook.css"
]);
export const CURRENT_CSF_FILES = Object.freeze([
  "components/Button.stories.tsx",
  "components/ButtonGroup.stories.tsx",
  "components/Checkbox.stories.tsx",
  "components/ClipboardCopyButton.stories.tsx",
  "components/DatePicker.stories.tsx",
  "components/Heading.stories.tsx",
  "components/Highlight.stories.tsx",
  "components/Icon.stories.tsx",
  "components/IconButton.stories.tsx",
  "components/Input.stories.tsx",
  "components/LinkButton.stories.tsx",
  "components/MultiSelect.stories.tsx",
  "components/NumberInput.stories.tsx",
  "components/ProductLockup.stories.tsx",
  "components/ProductLogo.stories.tsx",
  "components/ProductShell.stories.tsx",
  "components/RadioGroup.stories.tsx",
  "components/SearchInput.stories.tsx",
  "components/Select.stories.tsx",
  "components/ShellBrandButton.stories.tsx",
  "components/ShellDropdown.stories.tsx",
  "components/ShellIntro.stories.tsx",
  "components/ShellMenu.stories.tsx",
  "components/ShellPins.stories.tsx",
  "components/SuggestInput.stories.tsx",
  "components/Switch.stories.tsx",
  "components/Text.stories.tsx",
  "components/Textarea.stories.tsx",
  "standards.stories.tsx",
  "support.stories.tsx"
]);
export const AI_OUTPUT_FILES = Object.freeze([
  "ai/4.0.0/assets/brand.json",
  "ai/4.0.0/assets/fonts.json",
  "ai/4.0.0/assets/icons.json",
  "ai/4.0.0/component/Button.json",
  "ai/4.0.0/component/ButtonGroup.json",
  "ai/4.0.0/component/Checkbox.json",
  "ai/4.0.0/component/ClipboardCopyButton.json",
  "ai/4.0.0/component/DatePicker.json",
  "ai/4.0.0/component/Heading.json",
  "ai/4.0.0/component/Highlight.json",
  "ai/4.0.0/component/Icon.json",
  "ai/4.0.0/component/IconButton.json",
  "ai/4.0.0/component/Input.json",
  "ai/4.0.0/component/LinkButton.json",
  "ai/4.0.0/component/MultiSelect.json",
  "ai/4.0.0/component/NumberInput.json",
  "ai/4.0.0/component/ProductLockup.json",
  "ai/4.0.0/component/ProductLogo.json",
  "ai/4.0.0/component/ProductShell.json",
  "ai/4.0.0/component/RadioGroup.json",
  "ai/4.0.0/component/SearchInput.json",
  "ai/4.0.0/component/Select.json",
  "ai/4.0.0/component/ShellBrandButton.json",
  "ai/4.0.0/component/ShellDropdown.json",
  "ai/4.0.0/component/ShellIntro.json",
  "ai/4.0.0/component/ShellMenu.json",
  "ai/4.0.0/component/ShellPins.json",
  "ai/4.0.0/component/SuggestInput.json",
  "ai/4.0.0/component/Switch.json",
  "ai/4.0.0/component/Text.json",
  "ai/4.0.0/component/Textarea.json",
  "ai/4.0.0/global.json",
  "ai/4.0.0/index.json",
  "ai/4.0.0/pattern/customer-list-boundary.json",
  "ai/4.0.0/pattern/component-layout.json",
  "ai/4.0.0/pattern/product-locales.json",
  "ai/4.0.0/pattern/shell-preferences.json",
  "ai/4.0.0/sources.json",
  "ai/4.0.0/standard/01-tokens.json",
  "ai/4.0.0/standard/02-typography.json",
  "ai/4.0.0/standard/03-icons.json",
  "ai/4.0.0/standard/04-brand.json",
  "ai/4.0.0/standard/05-actions.json",
  "ai/4.0.0/standard/06-inputs.json",
  "ai/4.0.0/standard/07a-shell-upper.json",
  "ai/4.0.0/standard/07b-shell-lower.json",
  "ai/4.0.0/tokens/core.json",
  "ai/4.0.0/tokens/shell.json",
  "ai/index.json"
]);
export function checkStorySourceMembers(actual){return validateOutputMembers(actual,CURRENT_STORY_SOURCE_FILES);}
export function retiredLockupLabelIssues(text,label="source"){
 return ["productSuffix","productShellCaption"].filter(key=>new RegExp(`\\b${key}\\b`).test(text)).map(key=>`${label}: retired unregistered lockup label ${key}`);
}
export function checkSourceClosure(root=ROOT){
  const issues=checkStorySourceMembers(listFiles(path.join(root,"apps/storybook/src")));
  for(const rel of ["docs/design/gplus-2026-10","docs/design/visual-standard","docs/contract/clauses.md","docs/contract/families.json","docs/contract/exemptions.json","docs/contract/roles.json","scripts/lib/story-budget.mjs","scripts/lib/visual-signature.mjs","apps/storybook/assets/tcrn-brand-mark.svg","apps/storybook/src/internal-dev","apps/storybook/src/contract-stories/groups","apps/storybook/src/contract-stories/content","apps/storybook/src/contract-stories/visual-instances","apps/storybook/src/contract-stories/gplus/samples"]){if(fs.existsSync(path.join(root,rel)))issues.push(`Retired executable source remains: ${rel}`);}
  const formal=readApprovedSource(root);const expectedSnapshot=[...formal.manifest.files.map(f=>f.path),...formal.manifest.fontFiles.map(f=>f.sourcePath),"source-manifest.json","provenance.json","package-bindings.json","retired-content.json"].sort();
  issues.push(...validateOutputMembers(listFiles(formal.base),expectedSnapshot).map(i=>`Formal input snapshot: ${i}`));
  const main=read(root,"apps/storybook/.storybook/main.ts");
  const storyDeclaration = /stories:\s*\[([^\]]*)\]/.exec(main)?.[1];
  const declaredStories = storyDeclaration ? [...storyDeclaration.matchAll(/"([^"\n]+)"/g)].map(match => match[1]) : [];
  const managerEntries = ["../src/standards.stories.tsx", "../src/support.stories.tsx", "../src/components/*.stories.tsx"];
  if (JSON.stringify(declaredStories) !== JSON.stringify(managerEntries) || /tcrn-brand-mark|staticDirs[^\n]*assets\//.test(main)) issues.push("Manager CSF/asset closure is not the explicit approved entrypoint");
  const csf = listFiles(path.join(root, "apps/storybook/src")).filter(file => file.endsWith(".stories.tsx"));
  issues.push(...validateOutputMembers(csf, CURRENT_CSF_FILES).map(issue => `CSF source closure: ${issue}`));
  for(const rel of ["scripts/contract-generate.mjs","apps/storybook/src/build.tsx","apps/storybook/src/build/write-static.tsx","apps/storybook/.storybook/main.ts","apps/storybook/.storybook/preview.ts"]){const text=read(root,rel);if(/gplus-2026-10|visual-standard\/boards|tcrn-brand-mark\.svg|tcrnRetiredComponentCss/.test(text))issues.push(`Retired input reaches current build: ${rel}`);}
  const defaultSheet=read(root,"packages/ui-react/src/styles/index.ts");if(/base\.css|retiredNavigation|RetiredComponent|typography\.css/.test(defaultSheet))issues.push("Current stylesheet assembles unapproved legacy modules");
  const nav=read(root,"packages/ui-react/src/components/Navigation/Navigation.tsx");if(/src\s*=\s*"tcrn-brand|aos:\s*\{|<TcrnBrandMark\s+src=|suffix\?:\s*string/.test(nav))issues.push("Unregistered brand fallback or free-suffix API returned");
  issues.push(...retiredLockupLabelIssues(nav,"Navigation source"));
  return issues;
}
export async function checkTokens(root=ROOT){
  const source=readApprovedSource(root),expected=extractTokens(source),bindings=extractPackageBindings(source),issues=[];
  const token=await compiled(root,"packages/ui-tokens/dist/index.js");
  const light=token.createResolvedTokenMap("light"),dark=token.createResolvedTokenMap("dark");
  for(const row of expected.themed){if(light[row.cssVar]!==row.light||dark[row.cssVar]!==row.dark)issues.push(`Published theme value drift ${row.cssVar}`);}
  const variables=new Set([...expected.themed,...expected.fixed,...bindings,...extractMarks(source).filter(m=>m.suffix).map(m=>({cssVar:`--tcrn-brand-suffix-${m.productId}`}))].map(t=>t.cssVar));
  for(const expectedRow of [...expected.fixed,...bindings,...extractMarks(source).filter(m=>m.suffix).map(m=>({cssVar:`--tcrn-brand-suffix-${m.productId}`,value:m.palette.deep}))])if(token.tcrnTokens.find(t=>t.variable===expectedRow.cssVar)?.value!==expectedRow.value)issues.push(`Published fixed or bound value drift ${expectedRow.cssVar}`);
  for(const row of token.tcrnTokens)if(!variables.has(row.variable))issues.push(`Unpublished emitted token ${row.variable}`);
  for(const variable of variables)if(!token.tcrnTokens.some(t=>t.variable===variable))issues.push(`Missing published role token ${variable}`);
  if(token.tcrnDeprecatedTokens.length)issues.push("Retired aliases are emitted by the current token registry");
  const comparison=token.compareTokenThemeBlocks(token.tcrnTokenCss);if(!comparison.ok)issues.push("Theme key sets differ");
  return {issues,themed:expected.themed.length,fixed:expected.fixed.length,bindings:bindings.length};
}
export function rgba(value){
  if(/^#[a-f\d]{6}$/i.test(value))return [1,3,5].map(i=>parseInt(value.slice(i,i+2),16)/255).concat(1);
  if(/^#[a-f\d]{3,4}$/i.test(value)){const a=[...value.slice(1)].map(x=>parseInt(x+x,16)/255);return a.length===3?[...a,1]:a;}
  if(value==="transparent")return [0,0,0,0];
  const parts=/^rgba?\(([^)]+)\)$/.exec(value)?.[1].split(/[, /]+/).map(Number);if(!parts)throw new Error(`Unsupported color ${value}`);return [parts[0]/255,parts[1]/255,parts[2]/255,parts[3]??1];
}
const composite=(top,bottom)=>[0,1,2].map(i=>top[i]*top[3]+bottom[i]*(1-top[3])).concat(1);
const luminance=c=>c.slice(0,3).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
export function contrast(ink,fill,surface="#ffffff"){const bg=composite(rgba(fill),rgba(surface)),fg=composite(rgba(ink),bg),a=luminance(fg),b=luminance(bg);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);}
export function publishedShortcutContexts(source=readApprovedSource()){
  return [["06-inputs",".sw>kbd"],["07a-shell-upper",".ts-srch kbd"],["07b-shell-lower",".ts-srch kbd"]].map(([board,selector])=>({board,selector,color:cssRule(source.board(board).css,selector).color}));
}
export function checkContrast(root=ROOT){
  const source=readApprovedSource(root),tokens=extractTokens(source),themes={light:Object.fromEntries(tokens.themed.map(t=>[t.key,t.light])),dark:Object.fromEntries(tokens.themed.map(t=>[t.key,t.dark]))},issues=[],measurements=[];
  for(const [theme,values] of Object.entries(themes))for(const role of ["ink","ink-2","ink-3","acc","red","ok","warn","bad"])for(const carrier of ["bg","panel"]){const ratio=contrast(values[role],values[carrier]);measurements.push({theme,role,carrier,ink:values[role],fill:values[carrier],ratio,min:4.5});if(ratio<4.5)issues.push(`Text contrast ${theme}/${role}/${carrier} ${ratio.toFixed(2)} < 4.5`);}
  for(const mark of extractMarks(source).filter(m=>m.suffix))for(const [theme,values] of Object.entries(themes))for(const carrier of ["bg","panel","hover"]){const surface=carrier==="hover"?values.bg:values[carrier],ratio=contrast(mark.palette.deep,values[carrier],surface);measurements.push({conflict:"K1",theme,role:`${mark.productId} suffix text`,carrier,ink:mark.palette.deep,fill:values[carrier],surface,ratio,min:4.5});if(ratio<4.5)issues.push(`K1 text contrast ${theme}/${mark.productId}/${carrier} ${ratio.toFixed(2)} < 4.5`);}
  const shortcutContexts=publishedShortcutContexts(source);
  for(const context of shortcutContexts)for(const [theme,values] of Object.entries(themes)){
    const ink=values[/var\(--([\w-]+)\)/.exec(context.color)?.[1]],ratio=contrast(ink,values.wash,values.panel);
    measurements.push({conflict:'S03-C01',...context,theme,role:'shortcut text',state:'idle',carrier:'wash on panel',ink,fill:values.wash,surface:values.panel,ratio,min:4.5,method:'source-only nominal sRGB composition; not browser/grain measurement'});
    if(ratio<4.5)issues.push(`S03-C01 nominal ${context.board} ${theme}/idle shortcut ${ratio.toFixed(6)} < 4.5`);
  }
  return {issues,measurements,shortcutContexts,thresholds:{text:4.5,icon:3,edge:3},sourceThresholdConflicts:["K1","S03-C01"],sourceWordingAmbiguities:["K5"],...FORMAL_REVIEW_STATUS};
}
export async function checkBrand(root=ROOT){const source=readApprovedSource(root),marks=extractMarks(source),icons=extractIcons(source),ui=await compiled(root,"packages/ui-react/dist/approved.js"),nav=await compiled(root,"packages/ui-react/dist/components/Navigation/Navigation.js"),issues=[];
  if(JSON.stringify(Object.keys(nav.tcrnProductLogoRegistry).sort())!==JSON.stringify(marks.map(m=>m.productId).sort()))issues.push("Product registry has an unapproved identity or misses a formal mark");
  for(const m of marks)for(const [variant,body] of [["color",m.colorBody],["mono",m.inkBody],["tile-tint",m.tileTintBody],["tile-deep",m.tileDeepBody]]){const svg=ui.tcrnProductMarkSvg(m.productId,variant),actual=svg.replace(/^<svg[^>]*>/,"").replace(/<\/svg>\s*$/,"");if(normalizeSvgBody(actual)!==normalizeSvgBody(body))issues.push(`Formal SVG rendition drift ${m.productId}/${variant}`);}
  const compiledIcons=await compiled(root,"packages/ui-react/dist/components/Icon/icon-paths.generated.js");for(const icon of icons)if(normalizeSvgBody(compiledIcons.tcrnIconPaths[icon.name]??"",{geometryOnly:true})!==icon.body)issues.push(`Formal icon geometry drift ${icon.name}`);
  return {issues,marks:marks.map(m=>({id:m.id,productId:m.productId,source:m.source,colorGeometrySha256:sha256(m.colorBody)})),iconCount:icons.length};
}
export function checkFonts(root=ROOT){const source=readApprovedSource(root),faces=extractFontFaces(source),expected=[...new Map(faces.map(f=>[f.file,f])).values()],issues=[],base=path.join(root,"packages/ui-tokens/fonts");
  const manifest=JSON.parse(fs.readFileSync(path.join(base,"manifest.json"),"utf8"));if(manifest.site?.sourceCommit!==APPROVED_SITE.sourceCommit)issues.push("Font manifest declares the wrong published source");
  const allowed=[...expected.map(f=>f.file),"fonts.css","manifest.json"].sort();if(JSON.stringify(listFiles(base))!==JSON.stringify(allowed))issues.push("Font root has unreferenced or missing files");
  for(const font of expected){const p=path.join(base,font.file);if(!fs.existsSync(p)||sha256(fs.readFileSync(p))!==font.sha256)issues.push(`Unmapped or changed font bytes ${font.file}`);}
  if(JSON.stringify(manifest.faces)!==JSON.stringify(faces))issues.push("Font family/weight/Unicode source mappings differ");
  const css=fs.readFileSync(path.join(base,"fonts.css"),"utf8");const expectedCss=source.fontCss.replace(/url\(([^)]+)\)/g,(_m,url)=>{const sourcePath=url.replace(/['"]/g,"").replace(/^\//,"");const font=source.manifest.fontFiles.find(f=>f.sourcePath===sourcePath);if(!font)throw new Error(`Unmapped formal font URL ${sourcePath}`);return `url("./${font.file}")`;});if(css!==expectedCss)issues.push("Font CSS face/weight/Unicode bindings drift from the actual publication");if(/https?:|data:|fonts\.googleapis/.test(css))issues.push("Font CSS contains a network or inline source");
  for(const name of ["hanken-grotesk-OFL.txt","source-serif-4-OFL.txt","ibm-plex-mono-OFL.txt","noto-sans-sc-OFL.txt","noto-serif-sc-OFL.txt","approved-site-original-notice.txt"]){const p=path.join(root,"packages/ui-tokens/licenses",name);if(!fs.existsSync(p)||!fs.readFileSync(p,"utf8").includes("OPEN FONT LICENSE"))issues.push(`Missing SIL OFL notice ${name}`);}
  return {issues,files:expected.length,faces:faces.length,families:[...new Set(faces.map(f=>f.family))]};
}
export function expectedOutputPaths(root=ROOT){const source=readApprovedSource(root),faces=extractFontFaces(source),fonts=[...new Set(faces.map(f=>f.file))];return ["index.html","storybook.js","storybook.css","assets/ds-tile-deep.svg","fonts/fonts.css","fonts/manifest.json","ai-consumption-contract.json","design-authority.json","llms.txt","robots.txt","output-manifest.json",...AI_OUTPUT_FILES,...LOCALES.flatMap(l=>["index",...Object.keys(APPROVED_BOARD_IDS),"api"].map(p=>`${l}/${p}.html`)),...fonts.map(f=>`fonts/${f}`),...["hanken-grotesk-OFL.txt","source-serif-4-OFL.txt","ibm-plex-mono-OFL.txt","noto-sans-sc-OFL.txt","noto-serif-sc-OFL.txt","approved-site-original-notice.txt"].map(f=>`licenses/${f}`)].sort();}
export function validateOutputMembers(actual,expected){return [...actual.filter(f=>!expected.includes(f)).map(f=>`Stale or unpublished output file: ${f}`),...expected.filter(f=>!actual.includes(f)).map(f=>`Missing current output file: ${f}`)];}
export function rejectedSvgGeometry(text){return [...text.replace(/\\"/g,'"').matchAll(/<svg\b[^>]*>([\s\S]*?)<\/svg>/g)].some(svg=>sha256([...svg[1].matchAll(/<path[^>]*\bd="([^"]+)"/g)].map(m=>m[1].replace(/[\s,]/g,"")).sort().join("|"))===OLD_MOTHER_GEOMETRY_SHA256);}
const retiredSourceDestination = /\/(?:zh-CN|en|ja|ko|fr)\/source\.html\b|published-standards--source\b/;
// The AI contract quotes complete immutable boards as inert normative data.
// Remove only those exact authenticated quotations from executable-asset scanning.
export function executableOutputText(text, relative, source) {
  if (relative !== "ai-consumption-contract.json" && !AI_OUTPUT_FILES.includes(relative)) return text;
  const document = JSON.parse(text);
  const rules = document.rules ?? [document];
  for (const rule of rules) {
    if (rule.kind !== "standard" || !rule.id?.startsWith("standard/")) continue;
    const board = rule.id.slice("standard/".length);
    if (!Object.hasOwn(APPROVED_BOARD_IDS, board)) continue;
    const content = rule.content;
    const expected = source.board(board).html;
    if (content?.path === `docs/design/approved-site-v1/src/boards/${board}/index.dc.html` &&
        content.content === expected && content.sha256 === sha256(expected)) {
      content.content = "[exact pinned published normative quotation]";
    }
  }
  return JSON.stringify(document);
}
export function checkOutput(root=ROOT,output=path.join(root,"apps/storybook/storybook-static")){
  const issues=[],actual=listFiles(output),expected=expectedOutputPaths(root),source=readApprovedSource(root);
  issues.push(...validateOutputMembers(actual,expected));
  const manifest=JSON.parse(fs.readFileSync(path.join(output,"output-manifest.json"),"utf8"));if(manifest.standardSource?.sourceCommit!==APPROVED_SITE.sourceCommit)issues.push("Output inventory has wrong source commit");
  if(JSON.stringify(manifest.files.map(f=>f.path).sort())!==JSON.stringify(expected.filter(f=>f!=="output-manifest.json")))issues.push("Output inventory omits or invents a file");
  for(const row of manifest.files){const p=path.join(output,row.path);if(!fs.existsSync(p)||sha256(fs.readFileSync(p))!==row.sha256)issues.push(`Output bytes differ from candidate inventory ${row.path}`);}
  for(const rel of actual){const bytes=fs.readFileSync(path.join(output,rel));if(sha256(bytes)===OLD_MOTHER_SHA256)issues.push(`Rejected mother asset bytes returned under ${rel}`);if(/\.(?:html|js|css|svg|json|txt)$/.test(rel)){const text=executableOutputText(bytes.toString("utf8"),rel,source);if(retiredSourceDestination.test(text))issues.push(`Retired source destination returned in static output ${rel}`);issues.push(...retiredLockupLabelIssues(text,`Static output ${rel}`));if(rejectedSvgGeometry(text))issues.push(`Rejected inline SVG geometry returned under ${rel}`);if(/tcrn-brand-mark\.svg|tcrn-aos-two-line|data-brand-asset="tcrn-brand-mark"|tcrnRetiredComponentCss|\/reference-components-|Style Guide/.test(text))issues.push(`Rejected asset/standard route returned under ${rel}`);if(rel.endsWith(".html")&&(!text.includes(APPROVED_SITE.sourceCommit)||!text.includes('/assets/ds-tile-deep.svg')))issues.push(`HTML lacks published source or formal favicon ${rel}`);}}
  const formalFavicon=extractMarks(source).find(m=>m.id==="ds").tileDeepBody;
  const favicon=fs.readFileSync(path.join(output,"assets/ds-tile-deep.svg"),"utf8").replace(/^<svg[^>]*>/,"").replace(/<\/svg>\s*$/,"");
  if(normalizeSvgBody(favicon)!==normalizeSvgBody(formalFavicon))issues.push("Favicon changed independently of the published DS deep tile");
  for(const font of source.manifest.fontFiles){const p=path.join(output,"fonts",font.file);if(!fs.existsSync(p)||sha256(fs.readFileSync(p))!==font.sha256)issues.push(`Published output font changed ${font.file}`);}
  const contract=JSON.parse(fs.readFileSync(path.join(output,"ai-consumption-contract.json"),"utf8"));issues.push(...sourceIdentityIssues(contract.standardSource,"AI contract"));const authority=JSON.parse(fs.readFileSync(path.join(output,"design-authority.json"),"utf8"));issues.push(...sourceIdentityIssues(authority.standardSource,"design authority"));if(JSON.stringify(contract.boards.map(b=>[b.slug,b.sourceId]))!==JSON.stringify(Object.entries(APPROVED_BOARD_IDS)))issues.push("Machine contract changed source identities");
  issues.push(...checkProjection(Object.entries(APPROVED_BOARD_IDS).map(([id,sourceId])=>({id,sourceId})),contract.components??[]));
  issues.push(...checkAIOutput(root, output));
  return {issues,files:actual.length,manifestSha256:sha256(fs.readFileSync(path.join(output,"output-manifest.json")))};
}
export async function checkRoutes(root=ROOT){const registry=await compiled(root,"apps/storybook/dist/contract-stories/kernel.js"),api=await compiled(root,"apps/storybook/dist/approved-api.js"),metadata=await compiled(root,"apps/storybook/dist/approved-source.js");return {issues:[...checkSourceClosure(root),...sourceIdentityIssues(metadata.approvedSource.site,"compiled documentation"),...checkProjection(registry.contractStories,api.approvedApi)],stories:registry.contractStories.length,apis:api.approvedApi.length};}
export function finish(label,result){const issues=result.issues??[];console.log(JSON.stringify({proof:label,...result},null,2));if(issues.length)process.exitCode=1;return result;}

export const MANAGER_STORY_IDS = Object.freeze([
  ...Object.entries(APPROVED_API_BOARDS).filter(([, board]) => board === "06-inputs").map(([name]) => `components-${name.toLowerCase()}--form-submission`),
  "adopted-support-customer-list-boundary--overview",
  "components-button--active",
  "components-button--default",
  "components-button--disabled",
  "components-button--focus",
  "components-button--hover",
  "components-button--loading",
  "components-button--selected",
  "components-button--sizes",
  "components-button--variants",
  "components-buttongroup--default",
  "components-buttongroup--five-actions",
  "components-buttongroup--quiet",
  "components-buttongroup--sizes",
  "components-checkbox--checked",
  "components-checkbox--default",
  "components-checkbox--disabled",
  "components-checkbox--error",
  "components-checkbox--focus",
  "components-checkbox--indeterminate",
  "components-clipboardcopybutton--copied",
  "components-clipboardcopybutton--copying",
  "components-clipboardcopybutton--default",
  "components-clipboardcopybutton--failed",
  "components-clipboardcopybutton--interaction",
  "components-clipboardcopybutton--unsupported",
  "components-datepicker--bounds",
  "components-datepicker--default",
  "components-datepicker--disabled",
  "components-datepicker--error",
  "components-datepicker--readonly",
  "components-heading--default",
  "components-heading--levels",
  "components-heading--truncated",
  "components-highlight--case-sensitive",
  "components-highlight--default",
  "components-highlight--empty",
  "components-icon--default",
  "components-icon--meaningful",
  "components-icon--sizes",
  "components-iconbutton--active",
  "components-iconbutton--default",
  "components-iconbutton--disabled",
  "components-iconbutton--focus",
  "components-iconbutton--hover",
  "components-iconbutton--labelled",
  "components-iconbutton--loading",
  "components-iconbutton--selected",
  "components-iconbutton--sizes",
  "components-input--default",
  "components-input--disabled",
  "components-input--error",
  "components-input--error-focus",
  "components-input--filled",
  "components-input--focus",
  "components-input--hover",
  "components-input--readonly",
  "components-linkbutton--default",
  "components-linkbutton--external",
  "components-linkbutton--focus",
  "components-linkbutton--variants",
  "components-multiselect--checkboxes",
  "components-multiselect--default",
  "components-multiselect--disabled",
  "components-multiselect--empty",
  "components-multiselect--error",
  "components-multiselect--native",
  "components-numberinput--bounds",
  "components-numberinput--default",
  "components-numberinput--disabled",
  "components-numberinput--error",
  "components-numberinput--readonly",
  "components-productlockup--default",
  "components-productlockup--first-line",
  "components-productlockup--products",
  "components-productlockup--rail",
  "components-productlogo--default",
  "components-productlogo--products",
  "components-productlogo--variants",
  "components-productshell--default",
  "components-productshell--dropdown",
  "components-productshell--menu",
  "components-productshell--overflow",
  "components-productshell--phone",
  "components-productshell--product-locales",
  "components-radiogroup--default",
  "components-radiogroup--disabled",
  "components-radiogroup--error",
  "components-radiogroup--selected",
  "components-searchinput--default",
  "components-searchinput--disabled",
  "components-searchinput--error",
  "components-searchinput--filled",
  "components-searchinput--focus",
  "components-searchinput--readonly",
  "components-select--default",
  "components-select--disabled",
  "components-select--error",
  "components-select--focus",
  "components-shellbrandbutton--default",
  "components-shellbrandbutton--expanded",
  "components-shellbrandbutton--v-1",
  "components-shellbrandbutton--v-2",
  "components-shelldropdown--cascade",
  "components-shelldropdown--default",
  "components-shelldropdown--search",
  "components-shellintro--default",
  "components-shellintro--replay",
  "components-shellmenu--default",
  "components-shellmenu--panel",
  "components-shellmenu--search",
  "components-shellmenu--sheet",
  "components-shellpins--default",
  "components-shellpins--overflow",
  "components-shellpins--reorder",
  "components-suggestinput--default",
  "components-suggestinput--disabled",
  "components-suggestinput--error",
  "components-suggestinput--filled",
  "components-suggestinput--readonly",
  "components-switch--checked",
  "components-switch--default",
  "components-switch--disabled",
  "components-switch--small",
  "components-text--caps",
  "components-text--default",
  "components-text--numeral",
  "components-text--sizes",
  "components-text--strong",
  "components-textarea--default",
  "components-textarea--disabled",
  "components-textarea--error",
  "components-textarea--filled",
  "components-textarea--focus",
  "components-textarea--readonly",
  "published-standards--actions",
  "published-standards--api",
  "published-standards--brand",
  "published-standards--home",
  "published-standards--icons",
  "published-standards--inputs",
  "published-standards--shell-lower",
  "published-standards--shell-upper",
  "published-standards--tokens",
  "published-standards--typography"
]);
export function managerIndexIssues(index) {
  const entries = Object.entries(index.entries ?? {});
  const issues = validateOutputMembers(entries.map(([id]) => id), MANAGER_STORY_IDS).map(issue => `Manager stories: ${issue}`);
  for (const [id, story] of entries) {
    if (story.id !== id || story.type !== "story") issues.push(`Invalid Manager story ${id}`);
    const family = Object.keys(APPROVED_API_BOARDS).find(name => id.startsWith(`components-${name.toLowerCase()}--`));
    const support = id === "adopted-support-customer-list-boundary--overview";
    const expectedPath = family ? `./src/components/${family}.stories.tsx` : support ? "./src/support.stories.tsx" : "./src/standards.stories.tsx";
    const board = APPROVED_API_BOARDS[family];
    const group = board === "05-actions" ? "Actions" : board === "06-inputs" ? "Inputs and selection" : board?.startsWith("07") ? "Application shell" : "Foundations";
    const expectedTitle = family ? `Components/${group}/${family}` : support ? "Adopted support/Customer list boundary" : "Published standards";
    if (story.title !== expectedTitle || story.importPath !== expectedPath) issues.push(`Unapproved manager CSF module ${id}`);
  }
  return issues;
}
export function checkAIOutput(root, output) {
  const issues = validateOutputMembers(listFiles(path.join(output, "ai")).map(file => `ai/${file}`), AI_OUTPUT_FILES);
  const indexBytes = fs.readFileSync(path.join(output, "ai/index.json"));
  const index = JSON.parse(indexBytes);
  const version = JSON.parse(read(root, "packages/ui-react/package.json")).version;
  if (!indexBytes.equals(fs.readFileSync(path.join(output, `ai/${version}/index.json`)))) issues.push("AI index aliases differ");
  for (const name of ["ui-react", "ui-tokens", "ui-copy-state"]) {
    const manifest = JSON.parse(read(root, `packages/${name}/package.json`));
    if (index.identity?.packageVersions?.[manifest.name] !== manifest.version) issues.push(`AI package version drift ${manifest.name}`);
  }
  issues.push(...sourceIdentityIssues(index.identity?.standardSource, "AI index"));
  const actualRules = index.rules?.map(rule => rule.path) ?? [];
  issues.push(...validateOutputMembers(actualRules, AI_OUTPUT_FILES.filter(file => !file.endsWith("/index.json") && !file.endsWith("/sources.json"))));
  if (new Set(actualRules).size !== actualRules.length) issues.push("Duplicate AI rule paths");
  const sourceBytes = fs.readFileSync(path.join(output, `ai/${version}/sources.json`));
  if (sha256(sourceBytes) !== index.identity?.sourceDigest || index.sourceManifest?.sha256 !== index.identity?.sourceDigest || index.sourceManifest?.path !== `ai/${version}/sources.json`) issues.push("AI source manifest identity drift");
  for (const rule of index.rules ?? []) {
    if (!AI_OUTPUT_FILES.includes(rule.path)) continue;
    const file = path.join(output, rule.path);
    if (!fs.existsSync(file) || sha256(fs.readFileSync(file)) !== rule.sha256) issues.push(`AI rule byte drift ${rule.id}`);
    else if (JSON.stringify(JSON.parse(fs.readFileSync(file, "utf8")).identity) !== JSON.stringify(index.identity)) issues.push(`AI rule identity drift ${rule.id}`);
  }
  return issues;
}
export function checkManagerOutput(root=ROOT){
 const output=path.join(root,'apps/storybook/storybook-preview-static'),indexPath=path.join(output,'index.json');
 if(!fs.existsSync(indexPath)||!fs.existsSync(path.join(output,'iframe.html'))||!fs.existsSync(path.join(output,'index.html')))return {issues:['Actual manager output is missing; its declared pnpm build prerequisite and manager build have not produced this entry'],entry:'manager',files:0};
 const actual=listFiles(output),index=JSON.parse(fs.readFileSync(indexPath,'utf8')),issues=managerIndexIssues(index),source=readApprovedSource(root);
 for(const rel of actual){
  const bytes=fs.readFileSync(path.join(output,rel));
  if(sha256(bytes)===OLD_MOTHER_SHA256)issues.push(`Manager rejected mother bytes: ${rel}`);
  if(rel.endsWith('.html')&&!['index.html','iframe.html'].includes(rel))issues.push(`Manager unregistered HTML entry: ${rel}`);
  if(/\.(?:html|js|css|svg|json|txt)$/.test(rel)){
   const text=executableOutputText(bytes.toString('utf8'),rel,source);if(retiredSourceDestination.test(text))issues.push(`Retired source destination returned in Manager output ${rel}`);issues.push(...retiredLockupLabelIssues(text,`Manager output ${rel}`));if(rejectedSvgGeometry(text)||/tcrn-brand-mark\.svg|tcrn-aos-two-line|tcrnRetiredComponentCss|\/reference-components-/.test(text))issues.push(`Manager rejected inline, renamed or unlinked source: ${rel}`);
  }
 }
 issues.push(...checkAIOutput(root, output));
 const expectedFonts=[...source.manifest.fontFiles.map(f=>f.file),'fonts.css','manifest.json'];
 issues.push(...validateOutputMembers(listFiles(path.join(output,'fonts')),expectedFonts).map(i=>`Manager font closure: ${i}`));
 for(const font of source.manifest.fontFiles){const file=path.join(output,'fonts',font.file);if(!fs.existsSync(file)||sha256(fs.readFileSync(file))!==font.sha256)issues.push(`Manager formal font bytes drift: ${font.file}`);}
 for(const file of ['fonts.css','manifest.json']){const emitted=path.join(output,'fonts',file),current=path.join(root,'packages/ui-tokens/fonts',file);if(!fs.existsSync(emitted)||sha256(fs.readFileSync(emitted))!==sha256(fs.readFileSync(current)))issues.push(`Manager font ${file} not from current generated set`);}
 const legal=['hanken-grotesk-OFL.txt','source-serif-4-OFL.txt','ibm-plex-mono-OFL.txt','noto-sans-sc-OFL.txt','noto-serif-sc-OFL.txt','approved-site-original-notice.txt'];
 issues.push(...validateOutputMembers(listFiles(path.join(output,'licenses')),legal).map(i=>`Manager license closure: ${i}`));
 for(const name of legal){const file=path.join(output,'licenses',name);if(!fs.existsSync(file)||sha256(fs.readFileSync(file))!==sha256(fs.readFileSync(path.join(root,'packages/ui-tokens/licenses',name))))issues.push(`Manager license drift ${name}`);}
 const favicon=path.join(output,'assets/ds-tile-deep.svg'),formal=extractMarks(source).find(m=>m.id==='ds').tileDeepBody;
 if(!fs.existsSync(favicon)||normalizeSvgBody(fs.readFileSync(favicon,'utf8').replace(/^<svg[^>]*>/,'').replace(/<\/svg>\s*$/,''))!==normalizeSvgBody(formal))issues.push('Manager favicon is not the formal DS deep tile');
 return {issues,entry:'manager',stories:Object.values(index.entries??{}).map(e=>e.id),sourceCommit:source.manifest.site.sourceCommit,files:actual.length,inventory:actual.map(rel=>{const bytes=fs.readFileSync(path.join(output,rel));return {path:rel,bytes:bytes.length,sha256:sha256(bytes)};})};
}

export function checkPairReferences(css){
 const text=css.replace(/\/\*[\s\S]*?\*\//g,''),declared=new Set([...text.matchAll(/(--tcrn-pair-[a-z0-9-]+)\s*:/g)].map(m=>m[1]));
 return [...new Set([...text.matchAll(/var\((--tcrn-pair-[a-z0-9-]+)/g)].map(m=>m[1]))].filter(name=>!declared.has(name)).map(name=>`Undeclared current state pair ${name}`);
}
