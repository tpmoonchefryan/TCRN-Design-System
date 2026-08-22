import type { Meta, StoryObj } from "@storybook/react-vite";
import { getContractStory, StoryFrame } from "./stories.js";

const meta = {
  title: "TCRN Design System/Components",
  parameters: {
    layout: "fullscreen"
  }
} satisfies Meta;

export default meta;

type Story = StoryObj;

function renderContractStory(id: string) {
  const story = getContractStory(id);
  return (
    <StoryFrame story={story}>
      {story.render()}
    </StoryFrame>
  );
}

export const ComponentFamilyIndex: Story = {
  name: "Component family index",
  render: () => renderContractStory("component-family-index")
};

export const DisplayPrimitivesSpec: Story = {
  name: "Display primitives spec",
  render: () => renderContractStory("display-primitives-spec")
};

export const InteractionDisclosureSpec: Story = {
  name: "Interaction disclosure spec",
  render: () => renderContractStory("interaction-disclosure-spec")
};

export const StampSpecUsage: Story = {
  name: "Stamp spec and usage",
  render: () => renderContractStory("stamp-spec-usage")
};

export const ButtonSpecUsage: Story = {
  name: "Button spec and usage",
  render: () => renderContractStory("button-spec-usage")
};

export const FieldSpecUsage: Story = {
  name: "Field spec and usage",
  render: () => renderContractStory("field-spec-usage")
};

export const NavigationShellSpec: Story = {
  name: "Navigation and shell spec",
  render: () => renderContractStory("navigation-shell-spec")
};

export const NavigationDenseOperationsShellSpec: Story = {
  name: "Dense operations navigation shell",
  render: () => renderContractStory("navigation-dense-operations-shell-spec")
};

export const NavigationFocusedShellsSpec: Story = {
  name: "Focused navigation shells",
  render: () => renderContractStory("navigation-focused-shells-spec")
};

export const NavigationPrimitivesSpec: Story = {
  name: "Navigation component primitives",
  render: () => renderContractStory("navigation-primitives-spec")
};

export const NavigationProductShellSpec: Story = {
  name: "Package-backed ProductShell contract",
  render: () => renderContractStory("navigation-product-shell-spec")
};

export const DialogSpecUsage: Story = {
  name: "Dialog spec and usage",
  render: () => renderContractStory("dialog-spec-usage")
};

export const TableRecordTableSpec: Story = {
  name: "Table and record index spec",
  render: () => renderContractStory("table-record-index-spec")
};

export const RecordsAndBoardsComponentsSpec: Story = {
  name: "Records and boards components",
  render: () => renderContractStory("records-and-boards-components-spec")
};

export const HierarchyAndRelationsSpec: Story = {
  name: "Hierarchy and relations",
  render: () => renderContractStory("hierarchy-and-relations-spec")
};

export const DetailAndInspectionDensitySpec: Story = {
  name: "Detail and inspection: density and views",
  render: () => renderContractStory("detail-and-inspection-density-spec")
};

export const DetailAndInspectionRouteSpec: Story = {
  name: "Detail and inspection: route context",
  render: () => renderContractStory("detail-and-inspection-route-spec")
};

export const RecordsAndBoardsBacklogSpec: Story = {
  name: "Records and boards: backlog and lanes",
  render: () => renderContractStory("records-and-boards-backlog-spec")
};

export const HierarchyAndRelationsStagesSpec: Story = {
  name: "Hierarchy and relations: stages and references",
  render: () => renderContractStory("hierarchy-and-relations-stages-spec")
};

export const DetailAndInspectionInspectorSpec: Story = {
  name: "Detail and inspection: record inspector",
  render: () => renderContractStory("detail-and-inspection-inspector-spec")
};

export const DocumentsAndCollaborationComponentsSpec: Story = {
  name: "Documents and collaboration components",
  render: () => renderContractStory("documents-and-collaboration-components-spec")
};

export const DocumentsAndCollaborationDensitySpec: Story = {
  name: "Documents and collaboration: density and comments",
  render: () => renderContractStory("documents-and-collaboration-density-spec")
};

export const DocumentsAndCollaborationTemplatesSpec: Story = {
  name: "Documents and collaboration: templates and results",
  render: () => renderContractStory("documents-and-collaboration-templates-spec")
};
