import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { ROOT,readApprovedSource,extractTokens,extractPackageBindings,assertTokenGraph,resolveSourceLocals,cssRule,extractIcons,extractMarks,extractMatrixOccurrences } from "../scripts/lib/approved-site-source.mjs";
import { APPROVED_SITE,APPROVED_BOARD_IDS } from "../scripts/lib/approved-site-pins.mjs";
import * as approvedSourceModule from "../scripts/lib/approved-site-source.mjs";
import { generate } from "../scripts/contract-generate.mjs";
import { checkContrast, retiredLockupLabelIssues } from "../scripts/lib/published-standard-proof.mjs";
const read=fs.readFileSync;
test('source and emitted closure reject only the exact retired lockup fallback keys and retain neighboring product copy',()=>{
 const nav=read(path.join(ROOT,'packages/ui-react/src/components/Navigation/Navigation.tsx'),'utf8');
 assert.deepEqual(retiredLockupLabelIssues(nav,'Navigation source'),[]);
 for(const key of ['shellWorkspace','productLauncher','productSwitcher','brandHomeOf','shellControlsOf'])assert.match(nav,new RegExp(`\\b${key}\\b`));
 const valid='shellWorkspace:"Product shell workspace",productLauncher:"Product launcher",productSwitcher:"Product switcher",productSuffixExtra:"Product",productShellCaptionExtra:"Product shell"';
 for(const label of ['Navigation source','Static output storybook.js','Manager output assets/standards.stories.js']){
  assert.deepEqual(retiredLockupLabelIssues(valid,label),[]);
  for(const key of ['productSuffix','productShellCaption'])for(const payload of [`${key}:"Product"`,`"${key}":"Product shell"`,`${key}:\`产品外壳\``]){
   const issues=retiredLockupLabelIssues(`${valid},${payload}`,label);assert.equal(issues.length,1);assert.ok(issues[0].includes(label)&&issues[0].endsWith(key));
  }
 }
});
test('V1 exact repeated declarations compose in source order only when requested',()=>{
 const css='.radio{border-radius:50%;--fill-c:old}.radio::after{--fill-c:wrong}.radio,.other{--fill-c:also-wrong}.radio{--fill-c:panel;--mark-c:acc}';
 assert.deepEqual(cssRule(css,'.radio'),{'border-radius':'50%','--fill-c':'old'});
 assert.deepEqual(cssRule(css,'.radio',{composeRepeated:true}),{'border-radius':'50%','--fill-c':'panel','--mark-c':'acc'});
 assert.throws(()=>cssRule(css,'.missing',{composeRepeated:true}),/Missing published selector/);
});
test('V1 formal06 radio c/cf/cx tuples and radius survive repeated-selector projection independently of checkbox',()=>{
 const source=readApprovedSource(),css=source.board('06-inputs').css;
 const radio=cssRule(css,'.ck.rd>input',{composeRepeated:true}),check=cssRule(css,'.ck>input');
 assert.equal(radio['border-radius'],'50%');
 const edges={c:'0 0 #0000',cf:'var(--focus)',cx:'inset 0 0 0 1px var(--line-2)'};
 for(const state of ['c','cf','cx']){
  assert.equal(radio[`--fill-${state}`],state==='cx'?'var(--dis)':'var(--panel)');
  assert.equal(radio[`--mk-${state}`],state==='cx'?'var(--ink-3)':'var(--acc)');
  assert.equal(check[`--fill-${state}`],state==='cx'?'var(--dis)':'var(--acc)');
  assert.equal(check[`--mk-${state}`],state==='cx'?'var(--ink-3)':'var(--on-acc)');
  assert.equal(radio[`--edge-${state}`],edges[state]);assert.equal(check[`--edge-${state}`],edges[state]);
 }
 const generated=generate().get('packages/ui-react/src/styles/generated/inputs.pairs.ts');
 assert.ok(generated.includes('.tcrn-radio-group__control{--tcrn-pair-fill-c:var(--tcrn-color-panel)'));
 for(const state of ['c','cf','cx'])assert.ok(generated.includes(`--tcrn-pair-mark-${state}:var(--tcrn-color-${state==='cx'?'ink-3':'acc'})`));
 assert.ok(!generated.includes('.tcrn-radio-group__control{}'));
});
test("V1 published identity is the actual eight sourceIds and immutable source commit",()=>{
 const s=readApprovedSource();assert.equal(APPROVED_SITE.sourceCommit,"e76b7272d98c0359a57c42d49bf70d64e5b4c2ad");assert.equal(Object.keys(APPROVED_BOARD_IDS).length,8);assert.equal(APPROVED_BOARD_IDS["04-brand"],"ee0f582f-d81c-47f4-8a5b-d16631584d81");assert.equal(s.manifest.site.versionNumber,2);assert.equal(s.manifest.site.deploymentStatus,"succeeded");
 assert.equal(extractTokens(s).themed.length,39);assert.equal(extractTokens(s).fixed.length,27);assert.equal(extractIcons(s).length,38);assert.equal(extractMarks(s).length,4);
});
test("V1 same name and candidate manifest hashes do not authorize changed source bytes",()=>{
 const target=path.join(ROOT,"docs/design/approved-site-v2/src/boards/01-tokens/board.css");
 assert.throws(()=>readApprovedSource(ROOT,{readFile:(p,encoding)=>p===target?(encoding?read(p,"utf8").replace("#efeeea","#eeeeee"):Buffer.from(read(p,"utf8").replace("#efeeea","#eeeeee"))):read(p,encoding)}),/Published bytes changed/);
});
test("V1 changing registry and source-manifest together cannot replace a board or source commit",()=>{
 const manifest=path.join(ROOT,"docs/design/approved-site-v2/source-manifest.json");
 for(const mutate of [m=>m.site.sourceCommit="unpublished",m=>m.boards.pop(),m=>m.boards[0].sourceId="same-name-wrong-source",m=>m.boards.push(m.boards[0])]){
  assert.throws(()=>readApprovedSource(ROOT,{readFile:(p,encoding)=>{if(p!==manifest)return read(p,encoding);const m=JSON.parse(read(p,"utf8"));mutate(m);const s=JSON.stringify(m);return encoding?s:Buffer.from(s);}}));
 }
});
test("V1 every original occurrence has a distinct source key, including repeated shell cell ids",()=>{
 const cells=extractMatrixOccurrences(readApprovedSource());assert.equal(new Set(cells.map(c=>c.key)).size,cells.length);assert.equal(cells.filter(c=>!c.board.startsWith("07")).length,230);assert.ok(cells.filter(c=>c.board.startsWith("07")).length>155);assert.ok(cells.every(c=>c.sourceLine>0&&c.expect&&["text","icon","edge"].includes(c.kind)));
});
test("V1 prose bindings derive their number from the actual source anchor, not a self-reported candidate value",async()=>{
 const { extractPackageBindings }=await import('../scripts/lib/approved-site-source.mjs');
 const source=readApprovedSource(),binding={board:'07b-shell-lower',text:'上限6',unit:'',cssVar:'--tcrn-shell-pins-max'};
 assert.equal(extractPackageBindings(source,[binding])[0].value,'6');
 assert.throws(()=>extractPackageBindings(source,[{...binding,value:'8'}]),/Unbacked numeric value/);
 assert.throws(()=>extractPackageBindings(source,[{...binding,text:'上限8'}]),/Missing published text anchor/);
 assert.equal(extractPackageBindings(source,[{...binding,text:'标128→22',unit:'px'}])[0].value,'128px');
 assert.throws(()=>extractPackageBindings(source,[{...binding,text:'标128→2',unit:'px'}]),/Missing published text anchor/);
});

test("V1 package/source commit agreement cannot hide a wrong project, version, deployment or publication state",async()=>{
 const {sourceIdentityIssues}=await import('../scripts/lib/published-standard-proof.mjs');assert.deepEqual(sourceIdentityIssues(APPROVED_SITE),[]);
 for(const [key,value]of Object.entries({projectId:'wrong',versionId:'wrong',versionNumber:1,deploymentId:'wrong',deploymentStatus:'pending',sourceCommit:'wrong'}))assert.ok(sourceIdentityIssues({...APPROVED_SITE,[key]:value}).some(issue=>issue.includes(key)));
});

test("V4 source scene, state and literal icon carriers survive extraction independently",()=>{
 const cells=extractMatrixOccurrences(readApprovedSource());assert.equal(cells.length,455);
 for(const [id,color] of [['ink-panel-l','#f1f1f1'],['ink-panel-n','#282724']]){const cell=cells.find(c=>c.board==='03-icons'&&c.cellId===id);assert.equal(cell.carrierBackground,color);assert.ok(cell.carrier.some(c=>c.style.includes(color)));}
 const same=cells.filter(c=>c.board==='07a-shell-upper'&&c.cellId==='brand-suffix-l');assert.equal(new Set(same.map(c=>c.sourceScene)).size,same.length);assert.ok(same.some(c=>c.expect==='4.85')&&same.some(c=>c.expect==='4.53'));
});

test('V1 local bindings resolve before renaming and all125 token nodes retain acyclic two-theme dependencies',()=>{
 const source=readApprovedSource(),tokens=extractTokens(source),bindings=extractPackageBindings(source);
 const radius=bindings.find(row=>row.cssVar==='--tcrn-radius-paper');
 assert.equal(radius.value,cssRule(source.board('07b-shell-lower').css,'.scr.ts')['--paper-r']);
 assert.match(radius.source,/\.ts-paper:border-radius via \.scr\.ts/);
 const rows=[...tokens.themed,...tokens.fixed,...bindings,...extractMarks(source).filter(m=>m.suffix).map(m=>({cssVar:`--tcrn-brand-suffix-${m.productId}`,value:m.palette.deep}))];
 assert.equal(rows.length,125);
 for(const theme of ['light','dark']){
  assert.doesNotThrow(()=>assertTokenGraph(rows,theme));
  assert.throws(()=>assertTokenGraph(rows.map(row=>row===radius?{...row,value:'var(--tcrn-radius-paper)'}:row),theme),/token cycle/);
  assert.throws(()=>assertTokenGraph(rows.filter(row=>row.cssVar!=='--tcrn-color-bg'),theme),/Missing published package token/);
 }
 assert.equal(resolveSourceLocals('var(--a)',{'--a':'var(--b)','--b':'14px'}),'14px');
 assert.throws(()=>resolveSourceLocals('var(--a)',{'--a':'var(--b)','--b':'var(--a)'}),/local variable cycle/);
 assert.throws(()=>assertTokenGraph([...rows,rows[0]],'light'),/Duplicate/);
});

test('V1 local resolution leaves adjacent source readers and graph guards as independent module exports',()=>{
 for(const name of ['resolveSourceLocals','assertTokenGraph','readApprovedSource','extractTokens','extractPackageBindings','extractIcons','extractMarks','extractMatrixOccurrences','extractFontFaces','normalizeSvgBody','sourceElements'])assert.equal(typeof approvedSourceModule[name],'function',name);
 const locals={'--paper-r':'14px'},input='var(--paper-r) var(--ink)';
 assert.equal(resolveSourceLocals(input,locals),'14px var(--ink)');
 assert.deepEqual(locals,{'--paper-r':'14px'});
 assert.equal(resolveSourceLocals(input,{'--paper-r':'16px'}),'16px var(--ink)');
 assert.equal(extractPackageBindings(readApprovedSource()).find(row=>row.cssVar==='--tcrn-radius-paper').value,'14px');
});

test('V5 both entry documents link formal font resources outside the generated component CSS',()=>{
 const sync=read(path.join(ROOT,'scripts/demo-styles-sync.mjs'),'utf8'),manager=read(path.join(ROOT,'apps/storybook/.storybook/main.ts'),'utf8'),writer=read(path.join(ROOT,'apps/storybook/src/build/write-static.tsx'),'utf8');
 assert.doesNotMatch(sync,/@import[^;]*fonts\/fonts\.css/);
 assert.match(manager,/previewHead:[\s\S]*<link rel="stylesheet" href="\.\/fonts\/fonts\.css">/);
 assert.match(manager,/from:\s*"\.\.\/storybook-static\/fonts",\s*to:\s*"\/fonts"/);
 assert.match(writer,/<link rel="stylesheet" href="\/fonts\/fonts\.css">/);
});

test('C01 published v2 and its emitted metadata agree on all shortcut contexts and publication boundaries', () => {
 const result = checkContrast();
 const shortcuts = result.measurements.filter(row => row.conflict === 'S03-C01');
 assert.equal(shortcuts.length, 6);
 assert.deepEqual(result.shortcutContexts, [
  {board:'06-inputs',selector:'.sw>kbd',color:'var(--ink-2)'},
  {board:'07a-shell-upper',selector:'.ts-srch kbd',color:'var(--ink-2)'},
  {board:'07b-shell-lower',selector:'.ts-srch kbd',color:'var(--ink-2)'}
 ]);
 for (const board of ['06-inputs','07a-shell-upper','07b-shell-lower']) assert.deepEqual(shortcuts.filter(row => row.board === board).map(row => row.theme), ['light','dark']);
 const reading = shortcuts.find(row => row.board === '06-inputs' && row.theme === 'dark');
 assert.equal(reading.ink, '#a9a69c');
 assert.equal(reading.surface, '#191916');
 assert.ok(Math.abs(reading.ratio - 6.109065068146565) < 1e-10);
 assert.equal(reading.min, 4.5);
 assert.deepEqual(result.issues, []);
 assert.deepEqual(result.sourceThresholdConflicts, []);
 assert.deepEqual(result.sourceWordingAmbiguities, []);
 assert.deepEqual(result.unconfirmedProposals, []);
 assert.equal(result.adoptedAmendments.sourcePublication, 'published-v2; deployment-succeeded');
 assert.equal(result.adoptedAmendments.publicationReadbackMinute, 'minutes:59b6c4ee489ab487482ca51b#D1');
 assert.equal(result.ownerVisualAcceptance, 'current-integration-not-performed');
 const metadata = JSON.parse(read(path.join(ROOT, 'apps/storybook/storybook-static/ai-consumption-contract.json'), 'utf8'));
 assert.equal(metadata.standardSource.sourceCommit, APPROVED_SITE.sourceCommit);
 assert.equal(metadata.implementationFidelity.formShortcut.role, 'ink-2');
 assert.equal(metadata.implementationFidelity.shellShortcut.role, 'ink-2');
 assert.equal(metadata.proposalState, result.proposalState);
 assert.deepEqual(metadata.adoptedAmendments, result.adoptedAmendments);
 assert.equal(metadata.ownerVisualAcceptance, result.ownerVisualAcceptance);
 assert.deepEqual(metadata.publishedStandardConflicts, []);
 assert.equal(metadata.publication, 'local-candidate-only');
});
