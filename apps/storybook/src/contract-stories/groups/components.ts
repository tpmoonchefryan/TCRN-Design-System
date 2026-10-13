import type { ContractStory } from "../types.js";
import { selectStory } from "../story-content.js";
import { gplusMatrixStories, shellMatrixStory } from "../gplus/matrix-stories.js";
import { gplusCompositionThreeStory, gplusSampleStories } from "../gplus/sample-stories.js";

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
  selectStory("shell-top-band"),
  selectStory("shell-narrow"),
  selectStory("shell-mobile"),
  selectStory("shell-intro"),
  // The shell board matrix (07a section B) closes the top-band shell stories (C-9).
  shellMatrixStory,
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
  selectStory("documents-and-collaboration-templates-spec"),
  // Each family matrix is followed by its composition sample, the order the family CSF adapters
  // (typography, icon, brand, actions, inputs) export them in.
  ...gplusMatrixStories.flatMap((matrix, index) => {
    const sample = gplusSampleStories[index];
    return sample ? [matrix, sample] : [matrix];
  }),
  // The composition-three sample belongs to no family and has no matrix: it follows the five pairs,
  // as the last export of the compositions CSF adapter.
  gplusCompositionThreeStory
];
