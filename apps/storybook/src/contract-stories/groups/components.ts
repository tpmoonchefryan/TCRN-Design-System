import type { ContractStory } from "../types.js";
import { selectStory } from "../story-content.js";

export const componentsStories: ContractStory[] = [
  selectStory("component-family-index"),
  selectStory("display-primitives-spec"),
  selectStory("interaction-disclosure-spec"),
  selectStory("button-spec-usage"),
  selectStory("field-spec-usage"),
  selectStory("navigation-shell-spec"),
  selectStory("aos-frontend-shell-slice"),
  selectStory("dialog-spec-usage"),
  selectStory("table-work-index-spec")
];
