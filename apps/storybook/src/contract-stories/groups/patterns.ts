import type { ContractStory } from "../types.js";
import { selectStory } from "../story-content.js";

export const patternsStories: ContractStory[] = [
  selectStory("forms-patterns"),
  selectStory("workbench-patterns"),
  selectStory("readiness-notification-patterns"),
  selectStory("selection-list-patterns"),
  selectStory("modal-validation-patterns"),
  selectStory("datagrid-fields-patterns"),
  selectStory("big-list-search-patterns"),
  selectStory("dashboard-page-templates"),
  selectStory("aos-operations-cockpit-standard"),
  selectStory("aos-docs-readiness-standard"),
  selectStory("aos-product-design-target-set-standard")
];
