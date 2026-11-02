import fs from "node:fs";
import path from "node:path";
import { ROOT,cssRules } from "./approved-site-source.mjs";
import { compiled,checkSourceClosure,checkRoutes } from "./published-standard-proof.mjs";
import { listFiles } from "./generated-output.mjs";
export function cssClasses(css){return new Set([...css.matchAll(/\.(tcrn-[a-z0-9_-]+)/g)].map(m=>m[1]));}
export function markupClasses(html){return new Set([...html.matchAll(/\bclass="([^"]*)"/g)].flatMap(m=>m[1].split(/\s+/)).filter(c=>c.startsWith("tcrn-")));}
export function outsidePackageClasses(classes,provided){return [...classes].filter(c=>!provided.has(c)).sort();}
const unsupported=/\.tcrn-(?:badge|stamp(?:-rule)?|toast|state-surface|state-view|inline-alert|dialog|popover|side-nav|top-bar|product-launcher|product-switcher|record-table|record-row|lane-board|relation-graph|detail-layout|metadata-rail|setting-row|field-provenance|line-numbered-editor|lock-hint|data-grid|template-gallery|document-canvas|activity-feed|attachment-list|progress|skeleton|disclosure-panel|collapsible-region)(?=\b)/;
export function checkPublishedStyles(css){const issues=[];for(const rule of cssRules(css))if(unsupported.test(rule.selector))issues.push(`Unsupported current visual family: ${rule.selector}`);if(/--tcrn-(?:color-text-|color-brand-primary|motion-press-scale|shell-rail-w|brand-accent-aos)/.test(css))issues.push("Unbacked old token/brand alias reached the current stylesheet");return issues;}
export async function proveStyleClosure(root=ROOT){const ui=await compiled(root,"packages/ui-react/dist/approved.js"),provided=cssClasses(ui.tcrnComponentCss),issues=[...checkPublishedStyles(ui.tcrnComponentCss),...checkSourceClosure(root)],output=path.join(root,"apps/storybook/storybook-static");
  const missing=[];for(const rel of listFiles(output).filter(f=>f.endsWith(".html"))){for(const className of outsidePackageClasses(markupClasses(fs.readFileSync(path.join(output,rel),"utf8")),provided))missing.push({path:rel,className});}
  issues.push(...missing.map(x=>`Current HTML class has no package style: ${x.path} ${x.className}`));return {issues,packageClasses:provided.size,unprovided:missing};
}
export async function provePublishedConsumption(root=ROOT){const routes=await checkRoutes(root),styles=await proveStyleClosure(root);return {issues:[...routes.issues,...styles.issues],stories:routes.stories,apis:routes.apis,packageClasses:styles.packageClasses};}
