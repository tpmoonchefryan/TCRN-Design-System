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

export const DialogSpecUsage: Story = {
  name: "Dialog spec and usage",
  render: () => renderContractStory("dialog-spec-usage")
};

export const TableWorkIndexSpec: Story = {
  name: "Table and work index spec",
  render: () => renderContractStory("table-work-index-spec")
};
