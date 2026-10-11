import type { Meta, StoryObj } from "@storybook/react-vite";
import { getContractStory, StoryFrame } from "./stories.js";

// Track A adapter for the Inputs family matrix; the contract story itself is registered in
// contract-stories/groups/components.ts (category gplus-matrices). Storybook id: inputs--matrix.
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
