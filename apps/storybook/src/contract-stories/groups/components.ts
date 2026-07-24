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
  selectStory("navigation-dense-operations-shell-spec"),
  selectStory("navigation-focused-shells-spec"),
  selectStory("navigation-primitives-spec"),
  selectStory("navigation-product-shell-spec"),
  selectStory("dialog-spec-usage"),
  selectStory("table-work-index-spec"),
  selectStory("work-management-components-spec"),
  selectStory("work-management-relationships-spec"),
  selectStory("work-management-tokens-density-views-spec"),
  selectStory("work-management-route-detail-spec"),
  selectStory("work-management-backlog-board-spec"),
  selectStory("work-management-hierarchy-gates-spec"),
  selectStory("work-management-inspector-spec"),
  selectStory("knowledge-management-components-spec"),
  selectStory("knowledge-management-density-collaboration-spec"),
  selectStory("knowledge-management-templates-spec")
];
