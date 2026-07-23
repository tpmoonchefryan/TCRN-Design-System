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

export const TableWorkIndexSpec: Story = {
  name: "Table and work index spec",
  render: () => renderContractStory("table-work-index-spec")
};

export const WorkManagementComponentsSpec: Story = {
  name: "Work Management component specs",
  render: () => renderContractStory("work-management-components-spec")
};

export const WorkManagementRelationshipsSpec: Story = {
  name: "Work Management relationship vocabulary",
  render: () => renderContractStory("work-management-relationships-spec")
};

export const WorkManagementTokensDensityViewsSpec: Story = {
  name: "Work Management tokens, density, and views",
  render: () => renderContractStory("work-management-tokens-density-views-spec")
};

export const WorkManagementRouteDetailSpec: Story = {
  name: "Work Management route context and detail",
  render: () => renderContractStory("work-management-route-detail-spec")
};

export const WorkManagementBacklogBoardSpec: Story = {
  name: "Work Management backlog and board",
  render: () => renderContractStory("work-management-backlog-board-spec")
};

export const WorkManagementHierarchyGatesSpec: Story = {
  name: "Work Management hierarchy, gates, and evidence",
  render: () => renderContractStory("work-management-hierarchy-gates-spec")
};

export const WorkManagementInspectorSpec: Story = {
  name: "Work Management evidence and inspector",
  render: () => renderContractStory("work-management-inspector-spec")
};

export const KnowledgeManagementComponentsSpec: Story = {
  name: "Knowledge Management component specs",
  render: () => renderContractStory("knowledge-management-components-spec")
};

export const KnowledgeManagementDensityCollaborationSpec: Story = {
  name: "Knowledge Management density and collaboration",
  render: () => renderContractStory("knowledge-management-density-collaboration-spec")
};

export const KnowledgeManagementTemplatesSpec: Story = {
  name: "Knowledge Management templates and results",
  render: () => renderContractStory("knowledge-management-templates-spec")
};
