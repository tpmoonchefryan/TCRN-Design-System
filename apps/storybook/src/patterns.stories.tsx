import type { Meta, StoryObj } from "@storybook/react-vite";
import { getContractStory, StoryFrame } from "./stories.js";

const meta = {
  title: "TCRN Design System/Patterns",
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

export const FormsPatterns: Story = {
  name: "Forms pattern",
  render: () => renderContractStory("forms-patterns")
};

export const WorkbenchPatterns: Story = {
  name: "Workbench patterns",
  render: () => renderContractStory("workbench-patterns")
};

export const WorkManagementPatterns: Story = {
  name: "Work Management patterns",
  render: () => renderContractStory("work-management-patterns")
};

export const ReadinessNotificationPatterns: Story = {
  name: "Readiness and notification pattern",
  render: () => renderContractStory("readiness-notification-patterns")
};

export const SelectionListPatterns: Story = {
  name: "Selection and list patterns",
  render: () => renderContractStory("selection-list-patterns")
};

export const ModalValidationPatterns: Story = {
  name: "Modal validation patterns",
  render: () => renderContractStory("modal-validation-patterns")
};

export const DatagridFieldsPatterns: Story = {
  name: "Datagrid field patterns",
  render: () => renderContractStory("datagrid-fields-patterns")
};

export const BigListSearchPatterns: Story = {
  name: "Big list search patterns",
  render: () => renderContractStory("big-list-search-patterns")
};

export const DashboardPageTemplates: Story = {
  name: "Dashboard and page templates",
  render: () => renderContractStory("dashboard-page-templates")
};
