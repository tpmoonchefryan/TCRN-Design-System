import type { ContractStory } from "../types.js";
import { selectStory } from "../story-content.js";

export const styleGuideStories: ContractStory[] = [
  selectStory("brand-identity"),
  selectStory("color-palette"),
  selectStory("text-styles"),
  selectStory("grid-system"),
  selectStory("icons-motion"),
  selectStory("global-states"),
  selectStory("copy-creation-rules")
];
