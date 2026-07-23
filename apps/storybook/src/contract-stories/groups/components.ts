import type { ContractStory } from "../types.js";
import { selectStory } from "../story-content.js";

export const componentsStories: ContractStory[] = [
  selectStory("component-family-index"),
  selectStory("display-primitives-spec"),
  selectStory("interaction-disclosure-spec"),
  selectStory("stamp-spec-usage"),
  selectStory("button-spec-usage"),
  selectStory("field-spec-usage"),
  selectStory("navigation-shell-spec"),
  selectStory("dialog-spec-usage"),
  selectStory("table-work-index-spec"),
  selectStory("work-management-components-spec"),
  selectStory("knowledge-management-components-spec")
];
