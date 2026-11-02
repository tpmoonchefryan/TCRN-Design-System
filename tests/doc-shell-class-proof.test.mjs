import assert from "node:assert/strict";
import test from "node:test";
import { cssClasses,markupClasses,outsidePackageClasses } from "../scripts/lib/published-style-closure.mjs";
test("V3 shell markup has no unprovided local visual class, including nested SVG and hidden regions",()=>{
 const provided=cssClasses('.tcrn-product-shell{display:grid}.tcrn-icon>path{vector-effect:non-scaling-stroke}.tcrn-doc-content{display:flex}');
 const html='<main class="tcrn-product-shell host"><div class="tcrn-doc-content"><svg class="tcrn-icon"></svg></div></main>';
 assert.deepEqual(outsidePackageClasses(markupClasses(html),provided),[]);
 assert.deepEqual(outsidePackageClasses(markupClasses(html+'<aside hidden class="tcrn-resident-rail"></aside>'),provided),['tcrn-resident-rail']);
 assert.deepEqual([...markupClasses('<div class="tcrn-icon tcrn-icon"><i class="unrelated"></i></div>')],['tcrn-icon']);
});
