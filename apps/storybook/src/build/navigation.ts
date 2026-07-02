import type { ContractStory, ContractStoryGroup } from "../stories.js";
import { storyCategoryDefinitions } from "../contract-stories/governance.js";

export function groupSlug(group: ContractStoryGroup): string {
  return group.toLowerCase().replace(/\s+/g, "-");
}

export function groupFileName(group: ContractStoryGroup): string {
  return group === "Welcome" ? "index.html" : `${groupSlug(group)}.html`;
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
