import { build } from "esbuild";
import { resolve } from "node:path";

const source = `
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { MultiSelect, Select, tcrnComponentCss } from "./packages/ui-react/dist/index.js";
import { tcrnTokenCss } from "./packages/ui-tokens/dist/index.js";
const options = [{ value:"blocked", label:"Blocked", disabled:true },{ value:"one", label:"One" },{ value:"two", label:"Two" },{ value:"two", label:"Two" }];
window.dropdownChanges=[];
function Fixture() {
 const [config,setConfig]=useState({ value:[], defaultValue:[], disabled:false, controlled:false, accept:true, ...window.dropdownInitial });
 window.updateDropdown=(patch)=>flushSync(()=>setConfig(current=>({...current,...patch})));
 const changed=(value)=>{window.dropdownChanges.push(value); if(config.controlled&&config.accept)setConfig(current=>({...current,value}));};
 return <section><style>{tcrnTokenCss+tcrnComponentCss}</style><form id="dropdown-form" onSubmit={event=>event.preventDefault()}><button id="before">Before</button><Select id="reference-select" aria-label="Single reference" options={options} /><MultiSelect id="dropdown" form="dropdown-form" name="values" required presentation="dropdown" emptySelectionLabel="Select values" disabled={config.disabled} disabledReason="Unavailable" options={options} defaultValue={config.defaultValue} value={config.controlled?config.value:undefined} onChange={changed} aria-label="Collection"/><button id="after">After</button><button id="reset" type="reset">Reset</button></form></section>;
}
const root=createRoot(document.querySelector("#fixture"));
window.destroyDropdown=()=>root.unmount();
flushSync(()=>root.render(<Fixture/>));
`;

export async function runMultiSelectDropdownProof(browser) {
 const bundle=await build({stdin:{contents:source,resolveDir:resolve("."),sourcefile:"dropdown-fixture.tsx",loader:"tsx"},write:false,bundle:true,platform:"browser",format:"iife"});
 const page=await browser.newPage({ viewport:{width:900,height:600},reducedMotion:"reduce" });
 const checks=[];
 const assert=(id,condition,observed)=>{checks.push({id,ok:!!condition,observed});};
 const mount=async(config={})=>{await page.evaluate(()=>window.destroyDropdown?.());await page.setContent('<!doctype html><meta charset="utf-8"><style>body{font:13px sans-serif}</style><div id="fixture"></div>');await page.evaluate(initial=>window.dropdownInitial=initial,config);await page.addScriptTag({content:bundle.outputFiles[0].text});};
 const observe=()=>page.evaluate(()=>{
  const form=document.getElementById('dropdown-form'); const trigger=document.getElementById('dropdown');const layer=document.querySelector('.tcrn-multi-select-dropdown__list');const proxy=document.querySelector('.tcrn-multi-select-dropdown__value');
  const style=node=>{const s=getComputedStyle(node);return Object.fromEntries(['fontFamily','fontSize','fontWeight','borderTopWidth','borderTopColor','borderRadius','paddingLeft','paddingRight','minHeight','backgroundColor','color','boxShadow','outlineStyle','outlineWidth'].map(k=>[k,s[k]]));};
  return {valid:form.checkValidity(),values:new FormData(form).getAll('values'),expanded:trigger.getAttribute('aria-expanded'),summary:trigger.textContent,active:document.activeElement.id,optionCount:layer.querySelectorAll('[role=option]').length,selected:Array.from(layer.querySelectorAll('[aria-selected=true]'),node=>node.dataset.multiSelectValue),changes:window.dropdownChanges,layerStyle:style(layer),optionStyle:style(layer.querySelector("[role=option]:not(:disabled)")),disabledStyle:style(layer.querySelector("[role=option]:disabled")),triggerStyle:style(trigger),referenceStyle:style(document.getElementById('reference-select')),bodyBoundary:layer.parentElement===document.body,hidden:layer.hidden,proxyHidden:getComputedStyle(proxy).position==='absolute'};
 });
 try {
  await mount();let x=await observe();assert('closed-select-family-empty',x.expanded==='false'&&x.hidden&&x.summary==='Select values'&&!x.valid&&x.optionCount===3&&Object.keys(x.referenceStyle).filter(key=>!key.startsWith('outline')).every(key=>x.triggerStyle[key]===x.referenceStyle[key]),x);
  await page.locator('#dropdown').click();x=await observe();assert('ordinary-click-opens-listbox',x.expanded==='true'&&x.bodyBoundary&&!x.hidden&&x.active.endsWith('-option-1'),x);
  for (const theme of ['light','dark']) {
    await page.evaluate(theme=>document.documentElement.setAttribute('data-tcrn-theme',theme),theme);
    x=await observe();
    assert('public-popup-family-'+theme,x.layerStyle.backgroundColor===x.referenceStyle.backgroundColor&&x.layerStyle.backgroundColor!=='rgba(0, 0, 0, 0)'&&parseFloat(x.layerStyle.borderRadius)>0&&x.layerStyle.boxShadow!=='none'&&x.optionStyle.color!==x.layerStyle.backgroundColor&&x.disabledStyle.color!==x.optionStyle.color,x);
  }
  await page.evaluate(()=>document.documentElement.setAttribute('data-tcrn-theme','light'));
  await page.keyboard.press('Space');await page.keyboard.press('ArrowDown');await page.keyboard.press('Enter');x=await observe();assert('keyboard-multiple-unique-enabled-values',x.valid&&JSON.stringify(x.values)==='["one","two"]'&&JSON.stringify(x.selected)==='["one","two"]'&&x.expanded==='true',x);
  await page.keyboard.press('Escape');x=await observe();assert('escape-restores-trigger',x.expanded==='false'&&x.hidden&&x.active==='dropdown'&&x.summary==='One, Two',x);
  await page.locator('#dropdown').focus();await page.keyboard.press('ArrowUp');await page.keyboard.press('Home');x=await observe();assert('arrows-home-skip-disabled',x.active.endsWith('-option-1'),x);
  await page.keyboard.press('Tab');x=await observe();assert('tab-resumes-form-navigation',x.expanded==='false'&&x.active==='after',x);
  await page.locator('#dropdown').click();await page.locator('#before').click();x=await observe();assert('outside-dismissal',x.hidden&&x.expanded==='false',x);
  await page.locator('#reset').click();await page.waitForFunction(()=>document.querySelector('[data-multi-select-summary]').textContent==='Select values');x=await observe();assert('uncontrolled-reset-restores-default',!x.valid&&x.values.length===0&&x.summary==='Select values',x);
  await mount({defaultValue:['one','one']});await page.locator('#dropdown').click();await page.locator('[data-multi-select-value=two]').click();await page.keyboard.press('Escape');await page.locator('#reset').click();await page.waitForFunction(()=>document.querySelector('[data-multi-select-summary]').textContent==='One');x=await observe();assert('nonempty-default-reset',x.valid&&JSON.stringify(x.values)==='["one"]'&&x.summary==='One',x);
  await page.locator('#dropdown').click();await page.locator('[data-multi-select-value=two]').click();await page.keyboard.press('Escape');await page.locator('#dropdown-form').evaluate(form=>form.addEventListener('reset',event=>event.preventDefault(),{once:true}));await page.locator('#reset').click();x=await observe();assert('cancelled-reset-keeps-current-value',JSON.stringify(x.values)==='["one","two"]'&&x.summary==='One, Two',x);
  await page.locator('#reset').click();await page.waitForFunction(()=>document.querySelector('[data-multi-select-summary]').textContent==='One');await page.locator('.tcrn-multi-select-dropdown__value option[value=one]').evaluate(option=>option.textContent='Uno');x=await observe();assert('localized-native-option-updates-summary',x.summary==='Uno'&&await page.locator('[data-multi-select-value=one] [data-multi-select-label]').textContent()==='Uno',x);
  await mount({defaultValue:['blocked']});x=await observe();assert('disabled-selection-cannot-satisfy-required',!x.valid&&x.values.length===0,x);
  await mount({disabled:true});await page.locator('#dropdown-form').evaluate(form=>form.requestSubmit());x=await observe();assert('disabled-excluded-from-validation-and-submission',x.valid&&x.values.length===0&&x.hidden,x);
  await mount({controlled:true,value:['one'],accept:false});await page.locator('#dropdown').click();await page.locator('[data-multi-select-value=two]').click();x=await observe();assert('controlled-declined-change-keeps-value',JSON.stringify(x.values)==='["one"]'&&x.summary==='One'&&JSON.stringify(x.changes)==='[["one","two"]]',x);
  await page.keyboard.press('Escape');await page.locator('#reset').click();x=await observe();assert('controlled-reset-keeps-authoritative-value',JSON.stringify(x.values)==='["one"]'&&x.summary==='One',x);
  await page.evaluate(()=>window.updateDropdown({accept:true}));await page.locator('#dropdown').click();await page.locator('[data-multi-select-value=two]').click();x=await observe();assert('controlled-accepted-change',JSON.stringify(x.values)==='["one","two"]'&&x.summary==='One, Two',x);
  await page.evaluate(()=>window.updateDropdown({disabled:true}));x=await observe();assert('disable-open-dropdown-cleans-up',x.hidden&&x.expanded==='false'&&x.valid&&x.values.length===0,x);
  const negative=await page.evaluate(()=>{
    const host=document.createElement('div');const input=document.createElement('select');input.multiple=true;host.append(input);
    return {dropdown:!!host.querySelector('[data-choice-presentation=dropdown] button[aria-haspopup=listbox]'),multiple:input.multiple};
  });assert('native-multiple-negative-is-not-a-dropdown',!negative.dropdown&&negative.multiple,negative);
  await page.evaluate(()=>window.destroyDropdown());assert('unmount-removes-body-layer',await page.locator('.tcrn-multi-select-dropdown__list').count()===0,{remaining:await page.locator('.tcrn-multi-select-dropdown__list').count()});
  return {schemaVersion:'tcrn.multi-select-dropdown-proof.v1',ok:checks.every(check=>check.ok),checks};
 } finally {await page.close();}
}
