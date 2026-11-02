import assert from "node:assert/strict";
import test from "node:test";
import { checkSelectionCss,checkPairStateRules } from "../scripts/lib/selection-carriers.mjs";
const correct='.tcrn-tabs__tab[aria-selected="true"]:after{height:1px;background:var(--tcrn-color-rule)}.tcrn-doc-table tr[aria-selected="true"] td{background:var(--tcrn-color-wash)}';
test("V4 paper Tabs and selected rows have separate published carriers",()=>{
 assert.deepEqual(checkSelectionCss(correct),[]);assert.ok(checkSelectionCss(correct.replace('height:1px','height:0')).length);assert.ok(checkSelectionCss(correct+'.tcrn-tabs__tab[aria-selected="true"]{background:var(--tcrn-color-wash)}').length);assert.ok(checkSelectionCss(correct.replace('var(--tcrn-color-rule)','var(--tcrn-brand-suffix-tms)')).length);
});
test("V4 action/input states switch pairs and cannot paint a color literal or color token",()=>{
 assert.deepEqual(checkPairStateRules('.tcrn-button:hover{--tcrn-pair-fill:var(--tcrn-pair-fill-h)}'),[]);
 for(const value of ['#0b6b65','rgba(0,0,0,.1)','var(--tcrn-color-acc)'])assert.ok(checkPairStateRules(`.tcrn-button:hover{background:${value}}`).length);
 assert.deepEqual(checkPairStateRules('.tcrn-nav-item-row:hover{background:var(--tcrn-color-hover)}'),[],"shell rows retain their own published role");
});

import { checkPairReferences } from '../scripts/lib/published-standard-proof.mjs';
import { describedErrorRoleIssues } from '../scripts/lib/published-api-browser.mjs';
import { readApprovedSource,ROOT } from '../scripts/lib/approved-site-source.mjs';
import fs from 'node:fs';
import path from 'node:path';
test('06 actual primary described messages retain bad ink and error geometry across both entries/locales/themes',()=>{
 const source=readApprovedSource();
 for(const entry of ['static','manager'])for(const locale of ['zh-CN','en','ja','ko','fr']){
  const rows=['light','dark'].flatMap(theme=>['error','error-focus'].map(state=>({entry,locale,theme,state,primary:true,invalid:true,describedIds:[`${theme}-error`],messages:[{id:`${theme}-error`,unique:true,primary:true,text:'Required',color:theme==='dark'?'rgb(229, 137, 123)':'rgb(168, 50, 31)',fontSize:'11.5px',lineHeight:'16px',gap:'5px',display:'flex',alignItems:'center'}]})));
  assert.deepEqual(describedErrorRoleIssues(rows,{source}),[]);
  // Change only the actual error carrier ink; association/text/geometry stay correct.
  for(const index of [0,2]){const wrong=structuredClone(rows);wrong[index].messages[0].color=wrong[index].theme==='dark'?'rgb(133, 130, 122)':'rgb(107, 103, 93)';assert.ok(describedErrorRoleIssues(wrong,{source}).length,`${entry}/${locale}/${wrong[index].theme} wrong ink`);}
  for(const change of [r=>r.messages[0].fontSize='11px',r=>r.messages[0].lineHeight='20px',r=>r.messages[0].gap='0px',r=>r.describedIds=[],r=>r.invalid=false,r=>r.messages[0].unique=false,r=>r.messages[0].primary=false]){const wrong=structuredClone(rows);change(wrong[0]);assert.ok(describedErrorRoleIssues(wrong,{source}).length);}
  assert.ok(describedErrorRoleIssues(rows.map(r=>({...r,primary:false})),{source}).length,'source-matrix roles cannot stand in for primary messages');
 }
 const specimens=fs.readFileSync(path.join(ROOT,'apps/storybook/src/specimens.tsx'),'utf8');
 assert.match(specimens,/<p id=\{`\$\{prefix\}-\$\{theme\}-err`\} className="tcrn-doc-error" data-primary-input-error=""/);
 assert.match(specimens,/aria-describedby=\{state==="error"\|\|state==="error-focus"\?`\$\{prefix\}-\$\{theme\}-err`:undefined\}/);
 assert.match(specimens,/data-tcrn-preview-state=\{state==="hover"\|\|state==="focus"\|\|state==="error-focus"\?state:undefined\}/);
});
test('V4 no rf or obsolete shell alias can become an unresolved live CSS dependency',()=>{
 assert.deepEqual(checkPairReferences('.in{--tcrn-pair-edge-f:var(--tcrn-focus-ring);--tcrn-pair-edge:var(--tcrn-pair-edge-f)}'),[]);
 for(const name of ['--tcrn-pair-edge-rf','--tcrn-pair-shell-edge-f','--tcrn-pair-row-fill-h','--tcrn-pair-row-fill-s','--tcrn-pair-row-ink-h','--tcrn-pair-row-ink-s'])assert.ok(checkPairReferences(`.field{box-shadow:var(${name})}`).some(issue=>issue.includes(name)));
});
