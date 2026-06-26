import type { ContractStory, ContractStoryGroup } from "./types.js";
import { welcomeStories } from "./groups/welcome.js";
import { styleGuideStories } from "./groups/style-guide.js";
import { foundationsStories } from "./groups/foundations.js";
import { componentsStories } from "./groups/components.js";
import { patternsStories } from "./groups/patterns.js";
import { proofStories } from "./groups/proof.js";
import { changeLogStories } from "./groups/change-log.js";

export type { ContractStory, ContractStoryGroup } from "./types.js";

export const contractStoryGroups: readonly ContractStoryGroup[] = [
  "Welcome",
  "Style Guide",
  "Foundations",
  "Components",
  "Patterns",
  "Proof",
  "Change Log"
] as const;

export const contractStories: ContractStory[] = [
  ...welcomeStories,
  ...styleGuideStories,
  ...foundationsStories,
  ...componentsStories,
  ...patternsStories,
  ...proofStories,
  ...changeLogStories
];

export function getContractStory(id: string): ContractStory {
  const story = contractStories.find((item) => item.id === id);
  if (!story) {
    throw new Error(`missing_contract_story:${id}`);
  }
  return story;
}

export function contractStoriesByGroup(group: ContractStoryGroup): ContractStory[] {
  return contractStories.filter((story) => story.group === group);
}
