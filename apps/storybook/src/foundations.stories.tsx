import type { Meta, StoryObj } from "@storybook/react-vite";
import { getContractStory, StoryFrame } from "./stories.js";

const meta = {
  title: "TCRN Design System/Foundations",
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

export const TokensCopyState: Story = {
  name: "Tokens and copy state",
  render: () => renderContractStory("tokens-copy-state")
};

export const I18nThemeContract: Story = {
  name: "I18n and theme contract",
  render: () => renderContractStory("i18n-theme-contract")
};

export const CopyGuidelines: Story = {
  name: "Copy guidelines",
  render: () => renderContractStory("copy-guidelines")
};
