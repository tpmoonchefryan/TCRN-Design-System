import assert from "node:assert/strict";
import test from "node:test";
import { readApprovedSource,cssRule } from "../scripts/lib/approved-site-source.mjs";
test("V6 actual published geometry distinguishes control and glyph size",()=>{const s=readApprovedSource(),b=s.board("01-tokens");assert.equal(cssRule(b.css,".gp")["--h-sm"],"28px");assert.equal(cssRule(b.css,".gp")["--h-md"],"32px");assert.equal(cssRule(b.css,".gp")["--h-lg"],"40px");assert.equal(cssRule(s.board("07b-shell-lower").css,".ts-tgl").width,"20px");assert.match(s.board("07a-shell-upper").html,/<svg[^>]*width="16"[^>]*data-icon="chevron-down"/);assert.equal(cssRule(s.board("06-inputs").css,".tg>input").width,"34px");});
