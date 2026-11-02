import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./lib/approved-site-source.mjs";
test("V7 current README surfaces point to the real published source and separate package/source versions",()=>{for(const rel of ["README.md","README.zh-CN.md","README.ja.md","README.ko.md","README.fr.md"]){const s=fs.readFileSync(path.join(ROOT,rel),"utf8");assert.ok(s.includes("https://tcrn-ds-visual-standards.honestfawn3.chatgpt.site"));assert.ok(s.includes("a643d4cfcd239f6f81b1715ded6a63caead9d619"));assert.ok(s.includes("4.0.0"));assert.doesNotMatch(s,/!\[[^\]]*\]\([^)]*tcrn-brand-mark|tcrn-brand-mark\.svg/);assert.ok(s.includes("K1")&&s.includes("K5"));}});
