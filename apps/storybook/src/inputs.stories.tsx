import type { Meta, StoryObj } from "@storybook/react-vite";
import { getContractStory, StoryFrame } from "./stories.js";

// Track A adapter for the Inputs family matrix and its composition sample; the contract story itself is registered in
// contract-stories/groups/components.ts (categories gplus-matrices and gplus-samples). Storybook ids: inputs--matrix and inputs--sample-members.
const meta = {
  title: "Inputs",
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
  render: () => renderContractStory("inputs-matrix")
};

export const SampleMembers: Story = {
  name: "Sample members",
  render: () => renderContractStory("inputs-sample-members")
};
