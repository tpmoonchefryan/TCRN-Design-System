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
  selectStory("table-record-index-spec"),
  selectStory("records-and-boards-components-spec"),
  selectStory("hierarchy-and-relations-spec"),
  selectStory("detail-and-inspection-density-spec"),
  selectStory("detail-and-inspection-route-spec"),
  selectStory("records-and-boards-backlog-spec"),
  selectStory("hierarchy-and-relations-stages-spec"),
  selectStory("detail-and-inspection-inspector-spec"),
  selectStory("documents-and-collaboration-components-spec"),
  selectStory("documents-and-collaboration-density-spec"),
  selectStory("documents-and-collaboration-templates-spec")
];
