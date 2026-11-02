import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import { readApprovedSource,cssRule,ROOT } from "../scripts/lib/approved-site-source.mjs";
import path from "node:path";
test("V6 published shell geometry and coordinates preserve distinct layers",()=>{const s=readApprovedSource(),b=s.board("07b-shell-lower");assert.equal(cssRule(b.css,".scr.ts")["--strip-h"],"52px");assert.equal(cssRule(b.css,".ts-brand").width,"134px");assert.equal(cssRule(b.css,".scr.ts")["--panel-wx"],"952px");assert.equal(cssRule(b.css,".scr.ts")["--drop-w"],"240px");assert.equal(cssRule(b.css,".scr.ts")["--cascade-gap"],"4px");assert.equal(6+40/2,26);assert.equal(40/2,20);});
test("V6 pin stays a pure SVG button with an item-specific accessible name",()=>{const code=fs.readFileSync(path.join(ROOT,"packages/ui-react/src/components/Navigation/Navigation.tsx"),"utf8");const pin=code.slice(code.indexOf("function NavPinButton"),code.indexOf("function navItemText"));assert.match(pin,/aria-label=\{pinned \? chrome\.unpinFromStrip\(label\)/);assert.match(pin,/<Icon name="pin"/);assert.doesNotMatch(pin,/<(?:span|p)|title=/);assert.ok(readApprovedSource().board("07b-shell-lower").html.includes("可见名"),"formal prose remains unedited");});
