// Component stylesheet sources — TCRN-DS-SUB-010.
//
// `tcrnComponentCss` used to be one template literal at the end of
// packages/ui-react/src/components/Navigation/Navigation.tsx, and every gate that scans
// the stylesheet source read that file. It is now written in
// packages/ui-react/src/styles/: one module per family (base, typography, icon, actions,
// inputs, brand), each exporting template-literal segments, plus styles/index.ts, which
// joins the segments in cascade order. Navigation.tsx only re-exports the result.
//
// The gates that read the stylesheet from source go through this module, so the next
// move changes this file and not six gates. Every .ts module under styles/ counts,
// including generated segments under styles/generated/, so a new family module or
// generated segment is covered without editing a gate.
//
// What this gives is the stylesheet's text, not its order: segments come back module by
// module. The shipped string, in cascade order, is `tcrnComponentCss` from
// packages/ui-react/dist/index.js (build first); checks that depend on order read that.
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export const COMPONENT_CSS_DIR = "packages/ui-react/src/styles";
export const COMPONENT_CSS_INDEX = `${COMPONENT_CSS_DIR}/index.ts`;

// Repo-relative paths of every module under styles/, in a stable order.
export function componentCssSourcePaths(root = REPO_ROOT) {
  const paths = [];
  const walk = (dir) => {
    const entries = readdirSync(join(root, dir), { withFileTypes: true })
      .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
    for (const entry of entries) {
      const path = `${dir}/${entry.name}`;
      if (entry.isDirectory()) walk(path);
      else if (entry.isFile() && /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)) paths.push(path);
    }
  };
  walk(COMPONENT_CSS_DIR);
  return paths;
}

function skipQuoted(text, index) {
  const quote = text[index];
  let cursor = index + 1;
  while (cursor < text.length) {
    if (text[cursor] === "\\") { cursor += 2; continue; }
    if (text[cursor] === quote || text[cursor] === "\n") return cursor + 1;
    cursor += 1;
  }
  return cursor;
}

// Every template literal in a styles module, in source order, as
// { name, css, start, end, terminated }. `name` is the `export const` the literal belongs
// to (null if none precedes it). The walk ends a literal at the first unescaped backtick,
// the way the parser ends a literal without interpolations — segments carry none — so a
// backtick written inside a CSS comment shows up here as a truncated segment.
export function cssTemplateSegments(sourceText) {
  const segments = [];
  let index = 0;
  while (index < sourceText.length) {
    const char = sourceText[index];
    const next = sourceText[index + 1];
    if (char === "/" && next === "/") {
      const lineEnd = sourceText.indexOf("\n", index);
      index = lineEnd < 0 ? sourceText.length : lineEnd + 1;
      continue;
    }
    if (char === "/" && next === "*") {
      const close = sourceText.indexOf("*/", index + 2);
      index = close < 0 ? sourceText.length : close + 2;
      continue;
    }
    if (char === '"' || char === "'") { index = skipQuoted(sourceText, index); continue; }
    if (char !== "`") { index += 1; continue; }
    const start = index + 1;
    let cursor = start;
    let end = -1;
    while (cursor < sourceText.length) {
      if (sourceText[cursor] === "\\") { cursor += 2; continue; }
      if (sourceText[cursor] === "`") { end = cursor; break; }
      cursor += 1;
    }
    const declaration = sourceText.lastIndexOf("export const ", index);
    const name = declaration < 0 ? null : (/^export const ([A-Za-z_$][\w$]*)/.exec(sourceText.slice(declaration))?.[1] ?? null);
    segments.push({ name, start, end, css: sourceText.slice(start, end < 0 ? sourceText.length : end), terminated: end >= 0 });
    index = end < 0 ? sourceText.length : end + 1;
  }
  return segments;
}

// [{ path, text, segments }] for every module under styles/.
export function readComponentCssSources(root = REPO_ROOT) {
  return componentCssSourcePaths(root).map((path) => {
    const text = readFileSync(join(root, path), "utf8");
    return { path, text, segments: cssTemplateSegments(text) };
  });
}

// [{ path, css }]: each module's segments joined, for per-file scans that report a path.
// Throws when there is no stylesheet text at all, so a scan cannot pass by reading nothing.
export function componentCssModules(root = REPO_ROOT) {
  const modules = readComponentCssSources(root).map(({ path, segments }) => ({ path, css: segments.map((segment) => segment.css).join("\n") }));
  if (!modules.some(({ css }) => css.trim())) {
    throw new Error(`component-css-sources: no stylesheet segments found under ${COMPONENT_CSS_DIR}`);
  }
  return modules;
}

// All segment text, module by module (not cascade order), for membership and pattern scans.
export function componentCssText(root = REPO_ROOT) {
  return componentCssModules(root).map(({ css }) => css).join("\n");
}
