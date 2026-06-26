import type { ContractStory } from "../types.js";
import { selectStory } from "../story-content.js";

export const changeLogStories: ContractStory[] = [
  selectStory("local-changelog")
];
