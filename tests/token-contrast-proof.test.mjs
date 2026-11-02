import assert from "node:assert/strict";
import test from "node:test";
import { contrast,checkContrast } from "../scripts/lib/published-standard-proof.mjs";
import { readApprovedSource,cssRule } from "../scripts/lib/approved-site-source.mjs";
test("V4 WCAG calculation preserves 4.5 text and 3 non-text thresholds",()=>{assert.equal(contrast("#000000","#ffffff"),21);assert.equal(contrast("#ffffff","#ffffff"),1);const r=checkContrast();assert.deepEqual(r.thresholds,{text:4.5,icon:3,edge:3});assert.ok(r.issues.some(i=>i.includes("K1")&&i.includes("tms")));assert.ok(r.issues.some(i=>i.includes("K1")&&i.includes("design-system")));assert.ok(contrast("#2c63c8","#191916")<4.5);});
test("V4 source strong discrepancy is retained as K5, never rewritten as unified prose",()=>{const s=readApprovedSource(),b=s.board("02-typography");assert.ok(b.html.includes("强调加字重不换色"));assert.equal(cssRule(b.css,".tx").color,"var(--ink-2)");assert.equal(cssRule(b.css,".tx.strong").color,"var(--ink)");assert.equal(cssRule(b.css,".tx.strong")["font-weight"],"600");});
