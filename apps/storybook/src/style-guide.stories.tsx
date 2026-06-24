import type { Meta, StoryObj } from "@storybook/react-vite";
import { getContractStory, StoryFrame } from "./stories.js";

const meta = {
  title: "TCRN Design System/Style Guide",
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

export const BrandIdentity: Story = {
  name: "Brand identity",
  render: () => renderContractStory("brand-identity")
};

export const ColorPalette: Story = {
  name: "Color palette",
  render: () => renderContractStory("color-palette")
};

export const TextStyles: Story = {
  name: "Text styles",
  render: () => renderContractStory("text-styles")
};

export const GridSystem: Story = {
  name: "Grid system",
  render: () => renderContractStory("grid-system")
};

export const IconsMotion: Story = {
  name: "Icons and motion",
  render: () => renderContractStory("icons-motion")
};

export const GlobalStates: Story = {
  name: "Global states",
  render: () => renderContractStory("global-states")
};

export const CopyCreationRules: Story = {
  name: "Copy creation rules",
  render: () => renderContractStory("copy-creation-rules")
};
