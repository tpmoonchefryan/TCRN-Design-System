import assert from "node:assert/strict";
import test from "node:test";
import { APPROVED_BOARD_IDS } from "../scripts/lib/approved-site-pins.mjs";
import { APPROVED_API_BOARDS,checkProjection,validateOutputMembers } from "../scripts/lib/published-standard-proof.mjs";
const registry=Object.entries(APPROVED_BOARD_IDS).map(([id,sourceId])=>({id,sourceId}));
const apis=Object.entries(APPROVED_API_BOARDS).map(([name,board])=>({name,board,props:["formal obligation"]}));
test("V3 registry and checker agreeing cannot grant authority to an unsupported old story or API",()=>{assert.deepEqual(checkProjection(registry,apis),[]);const altered=[...registry,{id:"brand-identity",sourceId:registry[3].sourceId}];const bogusLocalChecker=rows=>rows===altered;assert.equal(bogusLocalChecker(altered),true);assert.ok(checkProjection(altered,apis).length);assert.ok(checkProjection(registry,[...apis,{name:"StateView",board:"01-tokens",props:["state"]}]).length);assert.ok(checkProjection(registry,apis.map(a=>a.name==="Button"?{...a,board:"04-brand"}:a)).length);});
test("V7 stale unlinked pages, renamed assets and old compiled JS are rejected by exact output membership",()=>{const expected=["index.html","en/01-tokens.html","storybook.js","assets/ds-tile-deep.svg"];assert.deepEqual(validateOutputMembers(expected,expected),[]);for(const stale of ["reference-components.html","assets/renamed-mark.svg","en/brand-identity.html","old-client.js","fonts/old.woff2"])assert.ok(validateOutputMembers([...expected,stale],expected).some(i=>i.includes(stale)));});
