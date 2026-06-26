import type { ContractStory } from "../types.js";
import { selectStory } from "../story-content.js";

export const welcomeStories: ContractStory[] = [
  selectStory("welcome-governance"),
  selectStory("governance-boundaries"),
  selectStory("maintainers-routing"),
  selectStory("contribution-model"),
  selectStory("release-bug-policy")
];
