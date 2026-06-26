import type { ContractStory } from "../types.js";
import { selectStory } from "../story-content.js";

export const foundationsStories: ContractStory[] = [
  selectStory("tokens-copy-state"),
  selectStory("i18n-theme-contract"),
  selectStory("copy-guidelines")
];
