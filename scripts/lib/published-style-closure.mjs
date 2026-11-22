import fs from "node:fs";
import path from "node:path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ROOT, cssRules, sourceElements } from "./approved-site-source.mjs";
import { compiled, checkSourceClosure, checkRoutes } from "./published-standard-proof.mjs";
import { checkBatch3CssClosure } from "./component-css-sources.mjs";
import { classifyHtml } from "../internal-vocabulary-scan.mjs";
import { listFiles } from "./generated-output.mjs";

export function cssClasses(css) {
  return new Set([...css.matchAll(/\.(tcrn-[a-z0-9_-]+)/g)].map(match => match[1]));
}
export function markupClasses(html) {
  return new Set([...html.matchAll(/\bclass="([^"]*)"/g)].flatMap(match => match[1].split(/\s+/)).filter(name => name.startsWith("tcrn-")));
}
export function outsidePackageClasses(classes, provided) {
  return [...classes].filter(name => !provided.has(name)).sort();
}
const unsupported = /\.tcrn-(?:side-nav|top-bar|product-launcher|product-switcher|lane-board|relation-graph|detail-layout|metadata-rail|setting-row|field-provenance|line-numbered-editor|lock-hint|data-grid|template-gallery|document-canvas|activity-feed|attachment-list|progress)(?=\b)/;
export function checkPublishedStyles(css) {
  const issues = [];
  for (const rule of cssRules(css)) if (unsupported.test(rule.selector)) issues.push(`Unsupported current visual family: ${rule.selector}`);
  if (/--tcrn-(?:color-text-|color-brand-primary|motion-press-scale|shell-rail-w|brand-accent-aos)/.test(css)) issues.push("Unbacked old token/brand alias reached the current stylesheet");
  return issues;
}

// These exact implementation hooks have no independent paint. Their real carrier
// must be present in this markup and styled by the package; unknown hooks still fail.
const carriedHooks = {
  "tcrn-input--md": { tag: "input", same: "tcrn-input" },
  "tcrn-menu": { same: "tcrn-multi-select-dropdown__list" },
  "tcrn-menu__item": { same: "tcrn-multi-select-dropdown__option" },
  "tcrn-multi-select-dropdown__value": { tag: "select", same: "tcrn-sr-only" },
  "tcrn-radio-group__label": { tag: "span", ancestor: "tcrn-radio-group__option" },
  "tcrn-shell-locale-menu__current": { tag: "span", ancestor: "tcrn-shell-locale-menu__trigger" },
  "tcrn-shell-locale-menu__name": { tag: "span", ancestor: "tcrn-shell-locale-menu__option" },
  "tcrn-product-shell-search__empty": { tag: "span", ancestor: "tcrn-product-shell-search__results" },
  "tcrn-status-dot--unlabelled": { same: "tcrn-status-dot" },
  "tcrn-avatar__initials": { ancestor: "tcrn-avatar" },
  "tcrn-table-shell__checkbox": { tag: "input", same: "tcrn-checkbox" },
  "tcrn-table-shell__empty-row": { ancestor: "tcrn-table-shell" },
  "tcrn-record-table__checkbox": { tag: "input", same: "tcrn-checkbox" },
  "tcrn-record-table__select-label": { ancestor: "tcrn-record-table" },
  "tcrn-record-row__id": { ancestor: "tcrn-record-row" },
  "tcrn-record-row__field": { ancestor: "tcrn-record-row" },
  "tcrn-stage-pipeline--comfortable": { same: "tcrn-stage-pipeline" },
  "tcrn-stage-pipeline--compact": { same: "tcrn-stage-pipeline" },
  "tcrn-stage-pipeline--dense": { same: "tcrn-stage-pipeline" },
};
const classesOf = node => (node.attrs.class ?? "").split(/\s+/);
export function markupStyleCoverage(html, packageCss, documentationCss = "") {
  const provided = cssClasses(packageCss);
  const docs = new Set([...cssClasses(documentationCss)].filter(name => name.startsWith("tcrn-doc-") || name === "tcrn-shell-locale-menu__chevron"));
  const missing = new Set();
  const carried = [];
  for (const node of sourceElements(html)) for (const name of classesOf(node).filter(name => name.startsWith("tcrn-"))) {
    if (provided.has(name) || docs.has(name)) continue;
    const hook = carriedHooks[name];
    let carrier;
    if (hook && (!hook.tag || hook.tag === node.tag)) {
      if (hook.same && classesOf(node).includes(hook.same) && provided.has(hook.same)) carrier = hook.same;
      for (let ancestor = node.parent; !carrier && hook.ancestor && ancestor; ancestor = ancestor.parent) {
        if (classesOf(ancestor).includes(hook.ancestor) && provided.has(hook.ancestor)) carrier = hook.ancestor;
      }
    }
    if (carrier) carried.push({ className: name, carrier });
    else missing.add(name);
  }
  return { missing: [...missing].sort(), carried, packageClasses: provided.size, documentationClasses: docs.size };
}

export async function proveStorybookSpecimensPurePackage(root = ROOT) {
  const ui = await compiled(root, "packages/ui-react/dist/approved.js");
  const documentationCss = fs.readFileSync(path.join(root, "apps/storybook/src/docs.css"), "utf8");
  const issues = [];
  const unprovided = [];
  const vocabHits = [];
  const csfModules = [
    "apps/storybook/dist/voxward-batch3.stories.js",
    "apps/storybook/dist/seasonal-halloween.stories.js",
    "apps/storybook/dist/support.stories.js",
  ];
  let renderedStories = 0;
  for (const rel of csfModules) {
    const abs = path.join(root, rel);
    if (!fs.existsSync(abs)) {
      issues.push(`Compiled Storybook CSF module missing: ${rel}`);
      continue;
    }
    const mod = await compiled(root, rel);
    for (const [exportName, story] of Object.entries(mod)) {
      if (exportName === "default" || typeof story?.render !== "function") continue;
      const html = renderToStaticMarkup(React.createElement(story.render, story.args ?? {}));
      renderedStories += 1;
      const label = `${rel}#${exportName}`;
      const coverage = markupStyleCoverage(html, ui.tcrnComponentCss, documentationCss);
      for (const className of coverage.missing) {
        unprovided.push({ path: label, className });
        issues.push(`Storybook specimen has custom outside-package tcrn- class: ${label} ${className}`);
      }
      const vocab = classifyHtml(label, html);
      for (const hit of vocab.hits) {
        vocabHits.push(hit);
        issues.push(`Storybook specimen leaked forbidden internal vocabulary (${hit.rule}) in ${label}`);
      }
    }
  }
  if (renderedStories === 0) issues.push("No adopted Storybook CSF specimen stories were rendered");
  return { issues, renderedStories, unprovided, vocabHits };
}

export async function proveStyleClosure(root = ROOT) {
  const ui = await compiled(root, "packages/ui-react/dist/approved.js");
  const documentationCss = fs.readFileSync(path.join(root, "apps/storybook/src/docs.css"), "utf8");
  const specimenClosure = await proveStorybookSpecimensPurePackage(root);
  const issues = [...checkPublishedStyles(ui.tcrnComponentCss), ...checkBatch3CssClosure(root), ...specimenClosure.issues, ...checkSourceClosure(root)];
  const missing = [];
  const carried = [];
  const output = path.join(root, "apps/storybook/storybook-static");
  const htmlFiles = listFiles(output).filter(file => file.endsWith(".html"));
  if (!htmlFiles.length) issues.push("Current documentation HTML is missing");
  for (const file of htmlFiles) {
    const coverage = markupStyleCoverage(fs.readFileSync(path.join(output, file), "utf8"), ui.tcrnComponentCss, documentationCss);
    missing.push(...coverage.missing.map(className => ({ path: file, className })));
    carried.push(...coverage.carried.map(hook => ({ path: file, ...hook })));
  }
  issues.push(...missing.map(item => `Current HTML class has no package or documentation style/carrier: ${item.path} ${item.className}`));
  return { issues, packageClasses: cssClasses(ui.tcrnComponentCss).size, unprovided: missing, carried };
}
export async function provePublishedConsumption(root = ROOT) {
  const routes = await checkRoutes(root);
  const styles = await proveStyleClosure(root);
  return { issues: [...new Set([...routes.issues, ...styles.issues])], stories: routes.stories, apis: routes.apis, packageClasses: styles.packageClasses, unprovided: styles.unprovided, carried: styles.carried };
}
