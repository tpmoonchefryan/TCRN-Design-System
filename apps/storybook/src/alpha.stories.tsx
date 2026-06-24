import type { Meta, StoryObj } from "@storybook/react-vite";
import { getContractStory, StoryFrame } from "./stories.js";

const meta = {
  title: "TCRN Design System/Welcome",
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

export const WelcomeGovernance: Story = {
  name: "Welcome and governance",
  render: () => renderContractStory("welcome-governance")
};

export const GovernanceBoundaries: Story = {
  name: "Governance boundaries",
  render: () => renderContractStory("governance-boundaries")
};

export const MaintainersRouting: Story = {
  name: "Maintainers and routing",
  render: () => renderContractStory("maintainers-routing")
};

export const ContributionModel: Story = {
  name: "Contribution model",
  render: () => renderContractStory("contribution-model")
};

export const ReleaseBugPolicy: Story = {
  name: "Release and bug policy",
  render: () => renderContractStory("release-bug-policy")
};
