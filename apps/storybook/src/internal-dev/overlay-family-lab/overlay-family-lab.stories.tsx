import type { Meta, StoryObj } from "@storybook/react-vite";
import { OverlayFamilyLab } from "./OverlayFamilyLab.js";

const meta = {
  title: "Internal/Overlay family lab",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Internal developer-only overlay family lab. Excluded from contract stories and custom static contract docs."
      }
    }
  }
} satisfies Meta<typeof OverlayFamilyLab>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Lab: Story = {
  name: "Overlay family lab",
  render: () => <OverlayFamilyLab />
};
