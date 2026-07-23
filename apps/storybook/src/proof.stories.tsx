import type { Meta, StoryObj } from "@storybook/react-vite";
import { getContractStory, StoryFrame } from "./stories.js";

const meta = {
  title: "TCRN Design System/Proof",
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

export const ProofMatrix: Story = {
  name: "Proof matrix",
  render: () => renderContractStory("proof-matrix")
};

export const AiConsumptionContract: Story = {
  name: "AI consumption contract",
  render: () => renderContractStory("ai-consumption-contract")
};

export const BlockedActions: Story = {
  name: "Blocked actions",
  render: () => renderContractStory("blocked-actions")
};

export const OverlayFocus: Story = {
  name: "Overlay focus contract",
  render: () => renderContractStory("overlay-focus")
};

export const AosFrontendShellSliceVisualInstance: Story = {
  name: "AOS frontend shell slice visual instance",
  render: () => renderContractStory("aos-frontend-shell-slice")
};

export const AosOwnerQualityProductShell: Story = {
  name: "AOS owner-quality product shell oracle",
  render: () => renderContractStory("aos-owner-quality-product-shell")
};
