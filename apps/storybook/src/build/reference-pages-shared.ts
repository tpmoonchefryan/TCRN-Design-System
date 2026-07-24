// TCRN-DS-STORY-058: browser-SAFE pagination + addressing for the per-component API reference
// pages. This module has NO node:fs import so it can be bundled into the CSF stories (the
// component-family-index links grid computes reference locations from the public export list at
// render time). The fs-backed component DATA lives in reference-pages.ts, which imports these
// same primitives — so the page emitter, the gate mirrors, and the in-story links grid all agree
// on filenames, anchors, and which component lands on which page.

// Components per emitted reference page. Page HEIGHT is gated per component region
// (data-component-reference-id, <=2000px; the tallest single component ProductShell is ~1416px),
// and page WEIGHT is gated at 1MB per emitted file, so this only trades total output size against
// file count. ~20/page keeps every file well under 1MB while avoiding ~100 near-duplicate
// shell-floor copies.
export const COMPONENTS_PER_REFERENCE_PAGE = 20;

export const REFERENCE_PAGE_FILE_PREFIX = "component-api-reference-";
const REFERENCE_ANCHOR_PREFIX = "component-ref-";

export function referenceComponentAnchor(name: string): string {
  return `${REFERENCE_ANCHOR_PREFIX}${name}`;
}

export function referencePageFile(pageIndex: number): string {
  return `${REFERENCE_PAGE_FILE_PREFIX}${pageIndex}.html`;
}

export function referencePageIndexForPosition(position: number): number {
  return Math.floor(position / COMPONENTS_PER_REFERENCE_PAGE) + 1;
}

export interface ComponentReferenceLocation {
  name: string;
  file: string;
  anchor: string;
}

// orderedNames MUST be the alphabetical component order (the manifest emit order). The
// component-family-index links grid gets there by sorting componentLibraryPublicComponentNames,
// which is the same 100-name set; reference-pages.ts gets there from the already-sorted manifest.
export function componentReferenceLocationsFor(orderedNames: readonly string[]): ComponentReferenceLocation[] {
  return orderedNames.map((name, position) => ({
    name,
    file: referencePageFile(referencePageIndexForPosition(position)),
    anchor: referenceComponentAnchor(name)
  }));
}

export function referencePageFilesForCount(count: number): string[] {
  const files: string[] = [];
  for (let start = 0; start < count; start += COMPONENTS_PER_REFERENCE_PAGE) {
    files.push(referencePageFile(files.length + 1));
  }
  return files;
}
