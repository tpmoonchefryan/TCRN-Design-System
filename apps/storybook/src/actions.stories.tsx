import type { Meta, StoryObj } from "@storybook/react-vite";
import { getContractStory, StoryFrame } from "./stories.js";

// Track A adapter for the Actions family matrix and its composition sample; the contract story itself is registered in
// contract-stories/groups/components.ts (categories gplus-matrices and gplus-samples). Storybook ids: actions--matrix and actions--sample-project.
const meta = {
  title: "Actions",
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

export const Matrix: Story = {
  name: "Matrix",
  render: () => renderContractStory("actions-matrix")
};

export const SampleProject: Story = {
  name: "Sample project",
  render: () => renderContractStory("actions-sample-project")
};
