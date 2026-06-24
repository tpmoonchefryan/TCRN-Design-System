import type { Meta, StoryObj } from "@storybook/react-vite";
import { getContractStory, StoryFrame } from "./stories.js";

const meta = {
  title: "TCRN Design System/Change Log",
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

export const LocalChangelog: Story = {
  name: "Local changelog",
  render: () => renderContractStory("local-changelog")
};
