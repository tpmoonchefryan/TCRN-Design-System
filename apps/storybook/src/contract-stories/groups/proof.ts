import type { ContractStory } from "../types.js";
import { selectStory } from "../story-content.js";

export const proofStories: ContractStory[] = [
  selectStory("proof-matrix"),
  selectStory("blocked-actions"),
  selectStory("overlay-focus")
];
