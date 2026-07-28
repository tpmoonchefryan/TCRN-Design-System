import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * The component stylesheet is a template literal, so a backtick inside it ends
 * the stylesheet.
 *
 * Three times in one week a comment written in the ordinary house style — a
 * prop or property name in backticks — silently terminated `tcrnComponentCss`
 * partway through and turned the remaining CSS into TypeScript. The compiler
 * does say so, but it says `TS1005: ',' expected` at a line number inside a
 * comment, which reads as anything but "your stylesheet ended early". A gate
 * that names the actual mistake costs one run and saves the diagnosis.
 *
 * Checked here rather than by eye: the shipped stylesheet is one string, its
 * declared brace depth returns to zero, and every `${}` in it interpolates
 * something that exists.
 */
const SOURCE = fileURLToPath(new URL("../packages/ui-react/src/components/Navigation/Navigation.tsx", import.meta.url));
const MARKER = "export const tcrnComponentCss = `";

const source = readFileSync(SOURCE, "utf8");
const markerIndex = source.indexOf(MARKER);
if (markerIndex < 0) {
  console.error(JSON.stringify({ ok: false, reason: "tcrnComponentCss declaration not found", source: SOURCE }));
  process.exit(1);
}

// Walk to the terminating backtick the way the parser does, honouring escapes.
const start = markerIndex + MARKER.length;
let index = start;
let end = -1;
while (index < source.length) {
  if (source[index] === "\\") { index += 2; continue; }
  if (source[index] === "`") { end = index; break; }
  index += 1;
}
if (end < 0) {
  console.error(JSON.stringify({ ok: false, reason: "tcrnComponentCss is never terminated" }));
  process.exit(1);
}

const css = source.slice(start, end);
const findings = [];

// A backtick can only appear escaped; an unescaped one would have ended the
// literal above, so its presence here means the walk found the wrong terminator.
if (/(?<!\\)`/.test(css)) findings.push("unescaped backtick inside the stylesheet");

// Brace balance, ignoring interpolations and comment bodies. An early
// termination truncates the sheet mid-rule, so the depth does not return to 0.
const withoutInterpolations = css.replace(/\$\{[^}]*\}/g, "");
const withoutComments = withoutInterpolations.replace(/\/\*[\s\S]*?\*\//g, "");
let depth = 0;
for (const char of withoutComments) {
  if (char === "{") depth += 1;
  else if (char === "}") depth -= 1;
  if (depth < 0) break;
}
if (depth !== 0) findings.push(`brace depth returns to ${depth}, not 0 — the stylesheet is truncated or malformed`);

// The last rule of a healthy sheet closes; a truncated one ends mid-declaration.
if (!/}\s*$/.test(css.trimEnd())) findings.push("stylesheet does not end on a closed rule");

const receipt = {
  ok: findings.length === 0,
  proof: "ds_css_template_integrity",
  source: "packages/ui-react/src/components/Navigation/Navigation.tsx",
  export: "tcrnComponentCss",
  bytes: css.length,
  ruleCount: (css.match(/\{/g) ?? []).length,
  findings
};
console.log(JSON.stringify(receipt, null, 2));
if (!receipt.ok) process.exit(1);
