import type { ContractStory } from "../types.js";
import { selectStory } from "../story-content.js";

export const proofStories: ContractStory[] = [
  selectStory("proof-matrix"),
  selectStory("ai-consumption-contract"),
  selectStory("blocked-actions"),
  selectStory("overlay-focus")
];
