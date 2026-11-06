import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import { readApprovedSource,cssRule,ROOT } from "../scripts/lib/approved-site-source.mjs";
import path from "node:path";
test("V6 published shell geometry and coordinates preserve distinct layers",()=>{const s=readApprovedSource(),b=s.board("07b-shell-lower");assert.equal(cssRule(b.css,".scr.ts")["--strip-h"],"52px");assert.equal(cssRule(b.css,".ts-brand").width,"134px");assert.equal(cssRule(b.css,".scr.ts")["--panel-wx"],"952px");assert.equal(cssRule(b.css,".scr.ts")["--drop-w"],"240px");assert.equal(cssRule(b.css,".scr.ts")["--cascade-gap"],"4px");assert.equal(6+40/2,26);assert.equal(40/2,20);});
test("V6 pin stays a pure SVG button with an item-specific accessible name",()=>{const code=fs.readFileSync(path.join(ROOT,"packages/ui-react/src/components/Navigation/Navigation.tsx"),"utf8");const pin=code.slice(code.indexOf("function NavPinButton"),code.indexOf("function navItemText"));assert.match(pin,/aria-label=\{pinned \? chrome\.unpinFromStrip\(label\)/);assert.match(pin,/<Icon name="pin"/);assert.doesNotMatch(pin,/<(?:span|p)|title=/);assert.ok(readApprovedSource().board("07b-shell-lower").html.includes("可见名"),"formal prose remains unedited");});

import { SHELL_G18,SHELL_G18_FIXTURES,judgeShellG18,shadowBlurs,readShellSpecimenContent,shellSpecimenContentIssues } from '../scripts/lib/published-shell-gates.mjs';
import { extractMarks,extractMatrixOccurrences } from '../scripts/lib/approved-site-source.mjs';
import { shellSceneFor,withPublishedBrowser,openPublishedBoard } from '../scripts/lib/published-browser-proof.mjs';
test('published 07b G rows have one existing-runner local DOM/behavior fixture each',()=>{
 const html=readApprovedSource().board('07b-shell-lower').html.split('\n')[83].replace(/sc-raw-/g,'');
 const titles=[...html.matchAll(/<tr[^>]*>\s*<td[^>]*>([\s\S]*?)<\/td>/g)].map(m=>m[1].replace(/<[^>]*>/g,''));
 assert.equal(titles.length,18,'read the eighteen data rows of the actual raw G table, excluding its header');
 assert.deepEqual(SHELL_G18.map(g=>g.title),titles);
 assert.deepEqual(Object.keys(SHELL_G18_FIXTURES),SHELL_G18.map(g=>g.id));
 assert.equal(SHELL_G18_FIXTURES.G16.mutate,'session');assert.equal(SHELL_G18_FIXTURES.G17.mutate,'focus');
 assert.ok(SHELL_G18_FIXTURES.G14.css.includes('white-space:normal'));
});
function greenShellFacts(){
 const source=readApprovedSource(),mark=extractMarks(source).find(m=>m.id==='tms'),asset={id:'tms',body:mark.colorBody};
 const box=(x,y,width,height)=>({x,y,width,height,right:x+width,bottom:y+height,borders:[0,0,0,0],background:'rgba(0, 0, 0, 0)',cursor:'default'});
 const b={root:box(0,0,1240,640),brand:box(12,6,134,40),mark:box(18,15,22,22),toggle:box(120,16,20,20),glyph:box(122,18,16,16),strip:box(0,0,1240,52),paper:{...box(12,52,1216,576),radius:14},cluster:box(1170,16,58,20),clusterContentRight:1228,clusterContentInset:0,pins:[box(154,10,70,32),box(232,10,70,32),box(310,10,70,32)],assets:[asset],sidebars:0,closeControls:0,ink:{center:26},rows:[],shadows:[]};
 const m={...structuredClone(b),navRows:[{row:box(20,120,300,32),link:box(20,120,272,32),pin:box(292,124,24,24),pinInset:4}],panel:box(12,52,952,400),pbar:box(20,400,936,52),lockup:box(800,415,148,22),crumbs:box(28,418,100,16),lockupMark:box(800,415,22,22),lockupInteractive:false};
 const d={...structuredClone(b),dropTrigger:box(232,10,70,32),drop:{...box(232,48,240,180),padding:[6,6,6,6]},dropRows:[box(238,88,228,32)],dropText:box(248,88,100,32),dropSearch:box(238,54,228,28),dropColumns:[box(232,48,240,180),box(476,48,240,180)],cascadeSide:'end'};
 const sheetShadow='0 2px 3px rgba(22,21,15,.06),0 3px 3px rgba(22,21,15,.06),0 0 0 1px rgba(22,21,15,.10)';
 const p={...structuredClone(b),root:box(0,0,390,640),brand:box(12,6,54,40),pins:[],sheet:{...box(0,140,390,500),shadow:sheetShadow},shadows:[{className:'tcrn-shell-sheet__panel',value:sheetShadow}],sheetRows:[box(8,200,374,44)],sheetSearch:box(8,148,374,44),sheetPins:[{...box(350,210,24,24),hitWidth:44,hitHeight:44}]};
 return {locale:'en',band:b,menu:m,drop:d,phone:p,brandWords:{word:'TCRN',suffix:'TMS',tagline:mark.taglines.en},jitter:[{rest:100,hover:100,button:24}],lockupHoverSame:true,lockupTabSkipped:true,cascadeClick:true,cascadeHover:false,outsideClosed:true,touchClickable:true,focus:{escapeRestored:true,shortcutSearch:true,rightEntered:true,leftReturned:true,rows:[{focused:true,shadow:'formal ring',expectedFocus:'formal ring',childShadow:'none',pinShadow:'none',row:{right:320},link:{right:292},pin:{x:292,right:316,width:24},pinInset:4}]},matrix:{sourceOccurrences:225,observations:extractMatrixOccurrences(source).filter(c=>c.board.startsWith('07')).map(c=>({key:c.key,ok:true}))},intro:{first:5,refresh:0,reduced:0,total:460,plan:{card:120,mark:240,paper:100},landingMatches:true,markOpaque:true,properties:['opacity','transform'],frames:[{},{}],assets:[asset]}};
}
const bad={G01:f=>f.band.brand.y=0,G02:f=>f.band.assets[0].body+='<path d="M0 0L1 1"/>',G03:f=>f.band.strip.borders[2]=1,G04:f=>{f.band.clusterContentRight-=8;f.band.clusterContentInset+=8;},G05:f=>f.band.pins[0].borders[3]=1,G06:f=>f.menu.panel.y=60,G07:f=>f.menu.lockup.y+=4,G08:f=>f.band.ink.center+=4,G09:f=>f.drop.dropColumns[1].height=20,G10:f=>f.menu.closeControls=1,G11:f=>f.jitter[0].hover-=24,G12:f=>f.menu.lockupInteractive=true,G13:f=>f.matrix.observations[0].ok=false,G14:f=>f.band.rows.push({text:'long label',lineCount:2,whiteSpace:'normal',clips:[]}),G15:f=>f.menu.shadows.push({className:'panel',value:'0 0 12px rgba(0,0,0,.2)'}),G16:f=>f.intro.refresh=5,G17:f=>f.focus.escapeRestored=false,G18:f=>f.phone.sheetRows[0].height=32};
test('each G18 measured-data predicate rejects its own formal negative condition',()=>{
 const source=readApprovedSource();assert.ok(Object.values(judgeShellG18(greenShellFacts(),source)).every(v=>!v.length));
 for(const g of SHELL_G18){const facts=greenShellFacts();bad[g.id](facts);assert.ok(judgeShellG18(facts,source)[g.id].length,`${g.id} must reject its own mutation`);}
 assert.deepEqual(shadowBlurs('0 2px 3px rgba(22,21,15,.1),0 0 0 1px rgba(22,21,15,.2)'),[3,0]);
});
test('repeated shell IDs bind closed/open/drop and both phone states separately',()=>{
 const cells=extractMatrixOccurrences(readApprovedSource()),brand=cells.filter(c=>c.board==='07a-shell-upper'&&c.cellId==='brand-word-l');
 assert.deepEqual(brand.map(c=>[c.sourceState,shellSceneFor(c),c.expect]),[['closed','band','15.75'],['expanded','menu','14.70'],['drop','drop','15.75']]);
 const phone=cells.filter(c=>c.mobile&&c.cellId==='tgl-l');assert.deepEqual(phone.map(c=>shellSceneFor(c)),['phone-closed','phone']);
 assert.equal(cells.filter(c=>c.board.startsWith('07')).length,225);
});

// The real CSS fixture changes the visible contents, leaving the wrapper end aligned.
test('G04 catches a padded cluster even when its wrapper still aligns with paper',()=>{
 const facts=greenShellFacts(),right=facts.band.cluster.right;
 assert.match(SHELL_G18_FIXTURES.G04.css,/padding-right:8px/);
 bad.G04(facts);
 assert.equal(facts.band.cluster.right,right);
 assert.equal(facts.band.cluster.right,facts.band.paper.right);
 assert.ok(judgeShellG18(facts,readApprovedSource()).G04.length);
});
test('G15 judges the actual phone Sheet independently of correct menu/drop shadows under the same18 IDs',()=>{
 const source=readApprovedSource();
 assert.equal(SHELL_G18_FIXTURES.G15.css,'.tcrn-shell-sheet__panel{box-shadow:0 0 12px black!important}');
 for(const entry of ['static','manager'])for(const locale of ['zh-CN','en','ja','ko','fr'])for(const theme of ['light','dark']){
  const facts=greenShellFacts();facts.entry=entry;facts.locale=locale;facts.theme=theme;facts.brandWords.tagline=extractMarks(source).find(m=>m.id==='tms').taglines[locale];
  assert.ok(Object.values(judgeShellG18(facts,source)).every(v=>!v.length));
  const before=structuredClone([facts.band.shadows,facts.menu.shadows,facts.drop.shadows]);
  facts.phone.sheet.shadow='0 0 12px rgba(0,0,0,.2)';facts.phone.shadows[0].value=facts.phone.sheet.shadow;
  const result=judgeShellG18(facts,source);assert.ok(result.G15.some(i=>i.includes('Sheet')||i.includes('sheet')));
  assert.ok(Object.entries(result).filter(([id])=>id!=='G15').every(([,issues])=>!issues.length));
  assert.deepEqual([facts.band.shadows,facts.menu.shadows,facts.drop.shadows],before,'only Sheet carrier changed');
  const missing=greenShellFacts();missing.phone.shadows=[];assert.ok(judgeShellG18(missing,source).G15.length,'missing Sheet collection fails closed');
 }
});


test('G11/G17 reject incorrect actual row boundaries and focus carrier, with locale/theme facts retained',()=>{
 const source=readApprovedSource();
 for(const locale of ['zh-CN','en','ja','ko','fr'])for(const theme of ['light','dark']){
  const facts=greenShellFacts();facts.locale=locale;facts.theme=theme;facts.brandWords.tagline=extractMarks(source).find(m=>m.id==='tms').taglines[locale];
  assert.ok(Object.values(judgeShellG18(facts,source)).every(v=>!v.length));
  facts.menu.navRows[0].pinInset=0;assert.ok(judgeShellG18(facts,source).G11.length);
  facts.focus.rows[0].shadow='none';facts.focus.rows[0].childShadow='formal ring';assert.ok(judgeShellG18(facts,source).G17.length);
 }
});
import { proofContexts,publishedBoardUrl } from '../scripts/lib/published-browser-proof.mjs';
test('the existing family/shell runners route every entry/locale and G18 theme to the actual build',()=>{
 const contexts=proofContexts(),g18=proofContexts({themes:true});assert.equal(contexts.length,10);assert.equal(g18.length,20);
 for(const {entry,locale}of contexts)for(const board of Object.keys(readApprovedSource().manifest.boards.reduce((m,b)=>(m[b.slug]=true,m),{}))){
  const url=new URL(publishedBoardUrl('http://127.0.0.1:1234',entry,locale,board));
  if(entry==='manager'){assert.equal(url.pathname,'/iframe.html');assert.match(url.searchParams.get('id'),/^published-standards--/);assert.equal(url.searchParams.get('globals'),`locale:${locale}`);}
  else assert.equal(url.pathname,`/${locale}/${board}.html`);
 }
 for(const [entry,locale,board]of [['legacy','en','01-tokens'],['manager','de','01-tokens'],['static','en','brand-identity']])assert.throws(()=>publishedBoardUrl('http://localhost',entry,locale,board),/Unsupported/);
});

test('07 inner specimens and outer docs fail independently in both builds at wide and narrow widths',async()=>{
 const inner='.tcrn-doc-shell-frame > .tcrn-product-shell > .tcrn-product-shell__paper > .tcrn-product-shell__main';
 const outer='.docs-shell > .docs-paper > main';
 for(const entry of ['static','manager'])await withPublishedBrowser(async({browser,base,source})=>{
  const page=await browser.newPage();
  try{
   for(const board of ['07a-shell-upper','07b-shell-lower'])for(const width of [1440,390]){
    await page.setViewportSize({width,height:1000});
    await openPublishedBoard(page,{base,entry,locale:'zh-CN',board});
    const label=`${entry}/${board}/${width}`,judge=reading=>shellSpecimenContentIssues(reading,{source,board});
    const baseline=await readShellSpecimenContent(page);
    assert.deepEqual(judge(baseline),{outer:[],specimens:[]},label);
    assert.ok(baseline.scenes.some(scene=>!scene.phone&&scene.width===1240&&scene.padding[3]===28&&scene.maxFrameScroll>0),label);
    if(board==='07a-shell-upper')assert.ok(baseline.scenes.some(scene=>scene.phone&&scene.width===390&&scene.padding[3]===16),label);

    for(const [selector,declaration,scope,expected] of [
     [inner,'padding:0!important','specimens','product content padding'],
     [inner,'gap:0!important','specimens','product content vertical gap'],
     [outer,'padding-inline:0!important','outer','Outer docs content padding'],
    ]){
     const override=await page.addStyleTag({content:`${selector}{${declaration}}`});
     try{
      const result=judge(await readShellSpecimenContent(page));
      assert.ok(result[scope].some(issue=>issue.includes(expected)),`${label}: ${declaration}`);
      assert.deepEqual(result[scope==='outer'?'specimens':'outer'],[],`${label}: independent layers`);
     }finally{await override.evaluate(node=>node.remove());}
    }
    assert.deepEqual(judge(await readShellSpecimenContent(page)),{outer:[],specimens:[]},label);
   }
  }finally{await page.close();}
 },{entry});
});
