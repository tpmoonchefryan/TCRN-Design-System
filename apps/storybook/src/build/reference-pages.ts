import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  COMPONENTS_PER_REFERENCE_PAGE,
  referenceComponentAnchor,
  referencePageFile
} from "./reference-pages-shared.js";
import type { ComponentReferenceLocation } from "./reference-pages-shared.js";

// TCRN-DS-STORY-058: fs-backed source of truth for the machine-generated per-component API
// reference pages. The page emitter (navigation.ts -> write-static.ts / page-template.tsx) AND the
// gate mirrors (smoke.test.ts, storybook-smoke.mjs, internal-alpha-browser-proof.mjs) all import
// THIS compiled module, so the reference-page filename + component->page mapping + rendered data
// are derived once and can never drift between emit and check. Data comes from the committed
// component-api-manifest.json (generated from packages/ui-react/src/index.tsx by
// `pnpm internal-alpha:contracts`) — never re-derived from the story registry, so
// component-api-manifest.mjs --check stays the sole drift guard for the underlying API. The
// pure pagination/addressing primitives live in reference-pages-shared.ts (no fs) so they can be
// reused browser-side by the in-story links grid; they are re-exported here for node consumers.
export * from "./reference-pages-shared.js";

export interface ComponentApiProp {
  name: string;
  type: string;
  required: boolean;
  slot?: boolean;
}

export interface ComponentApiEntry {
  name: string;
  kind: string;
  props: ComponentApiProp[];
  variants: Record<string, (string | number)[]>;
  slots: string[];
  propsType?: string;
}

export interface ReferencePage {
  kind: "reference";
  file: string;
  pageIndex: number;
  components: ComponentApiEntry[];
}

interface ComponentApiManifest {
  componentCount: number;
  components: Record<string, ComponentApiEntry>;
}

function manifestPath(): string {
  // dist/build/reference-pages.js -> repo root is four levels up. Resolving from the module
  // location (not process.cwd()) makes the read work identically for the build (cwd apps/storybook)
  // and the gate scripts (cwd repo root).
  const here = dirname(fileURLToPath(import.meta.url));
  return join(here, "..", "..", "..", "..", "docs", "verification", "internal-alpha", "component-api-manifest.json");
}

let memoizedComponents: ComponentApiEntry[] | undefined;
function manifestComponents(): ComponentApiEntry[] {
  if (memoizedComponents) {
    return memoizedComponents;
  }
  const raw = readFileSync(manifestPath(), "utf8");
  const manifest = JSON.parse(raw) as ComponentApiManifest;
  // Object insertion order is the manifest's alphabetical generation order; keep it stable.
  memoizedComponents = Object.values(manifest.components);
  return memoizedComponents;
}

let memoizedPages: ReferencePage[] | undefined;
export function referencePages(): ReferencePage[] {
  if (memoizedPages) {
    return memoizedPages;
  }
  const components = manifestComponents();
  const pages: ReferencePage[] = [];
  for (let start = 0; start < components.length; start += COMPONENTS_PER_REFERENCE_PAGE) {
    const pageIndex = pages.length + 1;
    pages.push({
      kind: "reference",
      file: referencePageFile(pageIndex),
      pageIndex,
      components: components.slice(start, start + COMPONENTS_PER_REFERENCE_PAGE)
    });
  }
  memoizedPages = pages;
  return memoizedPages;
}

let memoizedLocations: Map<string, ComponentReferenceLocation> | undefined;
function locationMap(): Map<string, ComponentReferenceLocation> {
  if (memoizedLocations) {
    return memoizedLocations;
  }
  const map = new Map<string, ComponentReferenceLocation>();
  for (const page of referencePages()) {
    for (const component of page.components) {
      map.set(component.name, { name: component.name, file: page.file, anchor: referenceComponentAnchor(component.name) });
    }
  }
  memoizedLocations = map;
  return memoizedLocations;
}

export function componentReferenceLocations(): ComponentReferenceLocation[] {
  return Array.from(locationMap().values());
}

export function componentReferenceLocation(name: string): ComponentReferenceLocation | undefined {
  return locationMap().get(name);
}

export function referencePageFiles(): string[] {
  return referencePages().map((page) => page.file);
}
