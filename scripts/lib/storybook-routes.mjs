// SPDX-License-Identifier: Apache-2.0
// Story id -> static docs route (TCRN-DS-STORY-131, TCRN-DS-SUB-034).
//
// Browser gates open a contract story on the static docs (Track B: `pnpm storybook:build` emits
// apps/storybook/storybook-static). A story lives on its CATEGORY page, and the page anchor is the
// story id, so the route is `/<group slug>-<category slug>.html#<story id>` — the same page#id rule
// that scripts/geometry-proof.mjs hard-codes (for example
// `/components-navigation-shells.html#navigation-dense-operations-shell-spec`) and that
// apps/storybook/src/build/navigation.ts uses to emit the pages. Nothing here is hand-listed: the
// group and category come from the single registry, governance.storyRegistryOrder, which the build
// compiles to apps/storybook/dist/contract-stories/governance.js.
//
// The G+ matrix and sample story ids are fixed in advance so parallel work can line up on them. They
// are listed here before the stories exist; resolveStoryRoutes reports an id that the registry does
// not carry yet as missing instead of guessing a page for it.
//
// API (settled by SUB-034; later Subtasks reuse it read-only):
//   GPLUS_MATRIX_STORY_IDS, GPLUS_SAMPLE_STORY_IDS, GPLUS_STORY_IDS   frozen id lists
//   groupSlug(group), categorySlug(categoryId), groupFileName(group), categoryFileName(group, categoryId)
//   storySelector(storyId)                 CSS selector of the story <article> on its page
//   storyBodySelector(storyId)             the story's rendered region inside the article
//   storyRoute(entry)                      { id, group, categoryId, file, path, selector, bodySelector }
//   storyUrl(origin, route, { theme, locale, params })
//   storyRouteTable(registry)              Map id -> route, for the whole registry
//   resolveStoryRoutes(storyIds, registry) { routes, missing }
//   loadStoryRegistry({ root, modulePath }) the built storyRegistryOrder (rejects when not built)
//   expandStory(page, storyId)             opens a collapsed story body on a Playwright page

import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const STATIC_DOCS_ROOT = "apps/storybook/storybook-static";
export const STORY_REGISTRY_MODULE = "apps/storybook/dist/contract-stories/governance.js";

export const GPLUS_MATRIX_STORY_IDS = Object.freeze([
  "typography-matrix",
  "icon-matrix",
  "brand-matrix",
  "actions-matrix",
  "inputs-matrix"
]);

export const GPLUS_SAMPLE_STORY_IDS = Object.freeze([
  "typography-sample-billing",
  "icon-sample-project",
  "brand-sample-product",
  "actions-sample-project",
  "inputs-sample-members"
]);

export const GPLUS_STORY_IDS = Object.freeze([...GPLUS_MATRIX_STORY_IDS, ...GPLUS_SAMPLE_STORY_IDS]);

const STORY_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Mirrors apps/storybook/src/build/navigation.ts groupSlug.
export function groupSlug(group) {
  return String(group).toLowerCase().replace(/\s+/g, "-");
}

// Mirrors apps/storybook/src/build/navigation.ts categorySlug.
export function categorySlug(categoryId) {
  return String(categoryId).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// The section index page. It carries no story bodies; kept for completeness of the page rule.
export function groupFileName(group) {
  return group === "Welcome" ? "index.html" : `${groupSlug(group)}.html`;
}

// The category page that renders the story bodies. categoryId is not globally unique, so the file
// name is namespaced by the group, as navigation.ts does.
export function categoryFileName(group, categoryId) {
  return `${groupSlug(group)}-${categorySlug(categoryId)}.html`;
}

function assertStoryId(storyId) {
  if (typeof storyId !== "string" || !STORY_ID_PATTERN.test(storyId)) {
    throw new TypeError(`storybook_routes_invalid_story_id:${String(storyId)}`);
  }
}

export function storySelector(storyId) {
  assertStoryId(storyId);
  return `[data-contract-story-id="${storyId}"]`;
}

// The rendered story content only: the region the disclosure controls (id "<story id>-region"),
// without the documentation chrome (disclosure heading and description) around it. Gates that
// judge components measure this region.
export function storyBodySelector(storyId) {
  return `${storySelector(storyId)} > [id="${storyId}-region"]`;
}

export function storyRoute(entry) {
  if (!entry || typeof entry.group !== "string" || typeof entry.categoryId !== "string") {
    throw new TypeError(`storybook_routes_invalid_entry:${JSON.stringify(entry)}`);
  }
  assertStoryId(entry.id);
  const file = categoryFileName(entry.group, entry.categoryId);
  return Object.freeze({
    id: entry.id,
    group: entry.group,
    categoryId: entry.categoryId,
    file,
    path: `/${file}#${entry.id}`,
    selector: storySelector(entry.id),
    bodySelector: storyBodySelector(entry.id)
  });
}

// theme and locale are the query parameters the static docs read on load (client-scripts.ts);
// params adds any other query parameter (for example { proof: "search" }).
export function storyUrl(origin, route, { theme, locale, params } = {}) {
  const query = new URLSearchParams();
  if (theme) query.set("theme", theme);
  if (locale) query.set("locale", locale);
  for (const [key, value] of Object.entries(params ?? {})) query.set(key, String(value));
  const search = query.toString();
  return `${String(origin).replace(/\/+$/, "")}/${route.file}${search ? `?${search}` : ""}#${route.id}`;
}

export function storyRouteTable(registry) {
  if (!Array.isArray(registry)) throw new TypeError("storybook_routes_registry_not_array");
  const table = new Map();
  for (const entry of registry) {
    if (table.has(entry?.id)) throw new Error(`storybook_registry_duplicate_id:${entry.id}`);
    table.set(entry?.id, storyRoute(entry));
  }
  return table;
}

export function resolveStoryRoutes(storyIds, registry) {
  const table = storyRouteTable(registry);
  const routes = [];
  const missing = [];
  for (const id of storyIds) {
    assertStoryId(id);
    const route = table.get(id);
    if (route) routes.push(route);
    else missing.push(id);
  }
  return { routes, missing };
}

export async function loadStoryRegistry({ root = process.cwd(), modulePath = STORY_REGISTRY_MODULE } = {}) {
  const target = resolve(root, modulePath);
  if (!existsSync(target)) {
    const error = new Error(`storybook_registry_missing:${modulePath} (run pnpm build first)`);
    error.code = "storybook_registry_missing";
    throw error;
  }
  const registryModule = await import(pathToFileURL(target).href);
  if (!Array.isArray(registryModule.storyRegistryOrder)) {
    const error = new Error(`storybook_registry_invalid:${modulePath}`);
    error.code = "storybook_registry_invalid";
    throw error;
  }
  return registryModule.storyRegistryOrder;
}

// Story bodies render collapsed on the category page; geometry-proof opens them the same way.
export async function expandStory(page, storyId) {
  const selector = storySelector(storyId);
  const found = await page.evaluate((target) => {
    const article = document.querySelector(target);
    if (!article) return false;
    article.setAttribute("data-story-collapsed", "false");
    article.querySelector("[data-story-disclosure]")?.setAttribute("aria-expanded", "true");
    return true;
  }, selector);
  if (!found) throw new Error(`storybook_routes_story_not_on_page:${storyId}`);
}
