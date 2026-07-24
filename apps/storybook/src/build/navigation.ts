import type { ContractStory, ContractStoryGroup } from "../stories.js";
import { contractStoriesByGroup, contractStoryGroups } from "../stories.js";
import { storyCategoryDefinitions } from "../contract-stories/governance.js";
import { referencePages } from "./reference-pages.js";
import type { ReferencePage } from "./reference-pages.js";

export function groupSlug(group: ContractStoryGroup): string {
  return group.toLowerCase().replace(/\s+/g, "-");
}

export function groupFileName(group: ContractStoryGroup): string {
  return group === "Welcome" ? "index.html" : `${groupSlug(group)}.html`;
}

// categoryId is NOT globally unique ("work-management" is in both Components and Patterns;
// "governance-*" collide across sections), so a category page filename MUST be namespaced by
// its group. groupSlug + categorySlug guarantees a unique file per (group, categoryId), e.g.
// components-work-management.html vs patterns-work-management.html.
export function categorySlug(categoryId: string): string {
  return categoryId.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function categoryFileName(group: ContractStoryGroup, categoryId: string): string {
  return `${groupSlug(group)}-${categorySlug(categoryId)}.html`;
}

export function categoryFileForStory(story: Pick<ContractStory, "group" | "categoryId">): string {
  return categoryFileName(story.group, story.categoryId);
}

export const navAbbreviations: Record<ContractStoryGroup, string> = {
  Welcome: "W",
  "Style Guide": "SG",
  Foundations: "F",
  Components: "C",
  Patterns: "P",
  Proof: "PF",
  "Change Log": "CL"
};

export function navDomId(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function categoryDomId(group: ContractStoryGroup, categoryId: string): string {
  return `tcrn-storybook-category-${navDomId(group)}-${navDomId(categoryId)}`;
}

export function storyCategoriesForGroup(group: ContractStoryGroup, stories: ContractStory[]): Array<{ id: string; label: string; description: string; stories: ContractStory[] }> {
  const storyBucket = new Map<string, ContractStory[]>();
  for (const story of stories) {
    const bucket = storyBucket.get(story.categoryId) ?? [];
    bucket.push(story);
    storyBucket.set(story.categoryId, bucket);
  }
  return storyCategoryDefinitions[group].map((category) => ({
    ...category,
    stories: storyBucket.get(category.id) ?? []
  })).filter((category) => category.stories.length > 0);
}

// TCRN-DS-STORY-056: the PAGE axis is DERIVED from the same registry the section ->
// category -> story tree derives from (governance.storyRegistryOrder via
// contractStoriesByGroup + storyCategoriesForGroup). It is NOT hand-written: a new story
// or category flows into the emitted page set automatically. Each of the 7 sections emits
// one bounded INDEX page (nav + category links, ZERO story bodies) plus one CATEGORY page
// per non-empty category (only that category's story bodies). Story ids are unchanged, so
// signature keys do not re-key. This bounds every emitted page.
export interface ContractIndexPage {
  kind: "index";
  group: ContractStoryGroup;
  file: string;
  storyIds: readonly string[];
}

export interface ContractCategoryPage {
  kind: "category";
  group: ContractStoryGroup;
  categoryId: string;
  categoryLabel: string;
  file: string;
  storyIds: readonly string[];
}

// TCRN-DS-STORY-058: the machine-generated per-component API reference pages are a THIRD
// page kind, emitted after the section index/category pages. They are NOT story-registry
// entries (so navHtml never enumerates ~100 components into every page's sidebar) — they are
// derived from the committed component-api-manifest via the shared reference-pages helper.
export type ContractPage = ContractIndexPage | ContractCategoryPage | ReferencePage;

export function buildContractPages(): ContractPage[] {
  const pages: ContractPage[] = [];
  for (const group of contractStoryGroups) {
    const stories = contractStoriesByGroup(group);
    pages.push({ kind: "index", group, file: groupFileName(group), storyIds: [] });
    for (const category of storyCategoriesForGroup(group, stories)) {
      pages.push({
        kind: "category",
        group,
        categoryId: category.id,
        categoryLabel: category.label,
        file: categoryFileName(group, category.id),
        storyIds: category.stories.map((story) => story.id)
      });
    }
  }
  pages.push(...referencePages());
  return pages;
}

// The single derived page registry S056 introduces. Consumers (write-static emission loop,
// gate scripts) iterate this instead of contractStoryGroups. Computed LAZILY + memoized:
// navigation ← stories ← story-content ← ai-consumption-contract ← navigation is an import
// cycle, so an eager top-level read of contractStoryGroups hits its temporal dead zone at
// module load. Deferring the build to first call sidesteps it (all modules are initialized
// by the time any consumer runs).
let memoizedContractPages: readonly ContractPage[] | undefined;
export function contractPages(): readonly ContractPage[] {
  return (memoizedContractPages ??= buildContractPages());
}
