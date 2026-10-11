import type { Meta, StoryObj } from "@storybook/react-vite";
import { getContractStory, StoryFrame } from "./stories.js";

// Track A adapter for the composition-three sample; the contract story itself is registered in
// contract-stories/groups/components.ts (category gplus-samples), after the five family pairs, so this
// adapter is read last in the Components group. Storybook id: compositions--composition-three.
const meta = {
  title: "Compositions",
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

export const CompositionThree: Story = {
  name: "Composition three",
  render: () => renderContractStory("composition-three-sample")
};
