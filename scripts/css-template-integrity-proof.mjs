import { readFileSync } from "node:fs";
import { join } from "node:path";
import { COMPONENT_CSS_DIR, COMPONENT_CSS_INDEX, REPO_ROOT, readComponentCssSources } from "./lib/component-css-sources.mjs";

/**
 * The component stylesheet is written as template literals, so a backtick inside one
 * ends it.
 *
 * Three times in one week a comment written in the ordinary house style — a
 * prop or property name in backticks — silently terminated `tcrnComponentCss`
 * partway through and turned the remaining CSS into TypeScript. The compiler
 * does say so, but it says `TS1005: ',' expected` at a line number inside a
 * comment, which reads as anything but "your stylesheet ended early". A gate
 * that names the actual mistake costs one run and saves the diagnosis.
 *
 * Since TCRN-DS-SUB-010 the stylesheet is a set of segments in
 * packages/ui-react/src/styles/ (one module per family, joined in cascade order by
 * styles/index.ts), so the same mistake now cuts one segment short. Checked here
 * rather than by eye, for every segment: it is terminated, its declared brace depth
 * returns to zero, and a non-empty segment ends on a closed rule. And every family
 * segment (the `<family>CssNN` exports) is joined in styles/index.ts, because a
 * segment nobody joins never reaches the shipped stylesheet and no other gate notices.
 */
const sources = readComponentCssSources();
const findings = [];
if (sources.length === 0) findings.push(`no component stylesheet modules under ${COMPONENT_CSS_DIR}`);

let segmentCount = 0;
let bytes = 0;
let ruleCount = 0;
for (const { path, segments } of sources) {
  for (const segment of segments) {
    segmentCount += 1;
    const label = segment.name ? `${path} › ${segment.name}` : path;
    if (!segment.terminated) {
      findings.push(`${label}: the template literal is never terminated`);
      continue;
    }
    const css = segment.css;
    bytes += css.length;
    ruleCount += (css.match(/\{/g) ?? []).length;

    // Brace balance, ignoring interpolations and comment bodies. An early
    // termination truncates the segment mid-rule, so the depth does not return to 0.
    const withoutInterpolations = css.replace(/\$\{[^}]*\}/g, "");
    const withoutComments = withoutInterpolations.replace(/\/\*[\s\S]*?\*\//g, "");
    let depth = 0;
    for (const char of withoutComments) {
      if (char === "{") depth += 1;
      else if (char === "}") depth -= 1;
      if (depth < 0) break;
    }
    if (depth !== 0) findings.push(`${label}: brace depth returns to ${depth}, not 0 — the segment is truncated or malformed`);

    // The last rule of a healthy segment closes; a truncated one ends mid-declaration.
    // An empty segment is a landing place a family has not filled yet.
    if (css.trim() && !/}\s*$/.test(css.trimEnd())) findings.push(`${label}: segment does not end on a closed rule`);
  }
}

// Every family segment must be joined, or it never ships.
const indexText = readFileSync(join(REPO_ROOT, COMPONENT_CSS_INDEX), "utf8");
const joinList = /export const tcrnComponentCss\b[^=]*=\s*\[([^\]]*)\]\.join\(""\)/.exec(indexText);
if (!joinList) findings.push(`${COMPONENT_CSS_INDEX} does not join the family segments into tcrnComponentCss`);
const joined = new Set((joinList?.[1] ?? "").split(",").map((name) => name.trim()).filter(Boolean));
// Hyphenated modules and their camel-case segments count as families too (shell-intro.css.ts ›
// shellIntroCss01, shell-sheet.css.ts › shellSheetCss01; TCRN-DS-SUB-174), so an unjoined one is caught.
const FAMILY_MODULE = /^packages\/ui-react\/src\/styles\/[a-z]+(?:-[a-z]+)*\.css\.ts$/;
const FAMILY_SEGMENT = /^[a-z]+(?:[A-Z][a-z]*)*Css\d+$/;
// The retired parts' sheet (TCRN-DS-SUB-125) joins its segments into tcrnRetiredComponentCss and never into
// tcrnComponentCss: they are not family segments, so the camel-case pattern does not count them as unjoined.
const retiredList = /export const tcrnRetiredComponentCss\b[^=]*=\s*\[([^\]]*)\]\.join\(""\)/.exec(indexText);
const retired = new Set((retiredList?.[1] ?? "").split(",").map((name) => name.trim()).filter(Boolean));
const familySegments = [];
for (const { path, segments } of sources) {
  if (!FAMILY_MODULE.test(path)) continue;
  for (const name of new Set(segments.map((segment) => segment.name))) {
    if (!name || !FAMILY_SEGMENT.test(name) || retired.has(name)) continue;
    familySegments.push({ path, name });
    if (!joined.has(name)) {
      findings.push(`${path} › ${name} is not joined in ${COMPONENT_CSS_INDEX}, so it never ships`);
    }
  }
}

const receipt = {
  ok: findings.length === 0,
  proof: "ds_css_template_integrity",
  source: COMPONENT_CSS_DIR,
  export: "tcrnComponentCss",
  modules: sources.map(({ path }) => path),
  segments: segmentCount,
  joinedSegments: joined.size,
  familySegments: familySegments.length,
  retiredSegments: [...retired],
  hyphenatedFamilySegments: familySegments.filter(({ path }) => /-[a-z]+\.css\.ts$/.test(path)).map(({ name }) => name),
  bytes,
  ruleCount,
  findings
};
console.log(JSON.stringify(receipt, null, 2));
if (!receipt.ok) process.exit(1);
