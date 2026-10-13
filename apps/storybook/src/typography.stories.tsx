import type { Meta, StoryObj } from "@storybook/react-vite";
import { getContractStory, StoryFrame } from "./stories.js";

// Track A adapter for the Typography family matrix and its composition sample; the contract story itself is registered in
// contract-stories/groups/components.ts (categories gplus-matrices and gplus-samples). Storybook ids: typography--matrix and typography--sample-billing.
const meta = {
  title: "Typography",
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
  render: () => renderContractStory("typography-matrix")
};

export const SampleBilling: Story = {
  name: "Sample billing",
  render: () => renderContractStory("typography-sample-billing")
};
