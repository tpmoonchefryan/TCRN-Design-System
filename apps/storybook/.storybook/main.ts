import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";

// The preview imports @tcrn/ui-tokens/fonts.css (Vite rewrites its url()s to hashed,
// byte-identical copies). The same face directory is also served at /fonts, the path the
// static docs build copies it to, so both tracks expose the faces at one address
// (TCRN-DS-SUB-007).
const tokenFontDir = dirname(fileURLToPath(import.meta.resolve("@tcrn/ui-tokens/fonts.css")));

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  staticDirs: ["../assets", { from: tokenFontDir, to: "/fonts" }],
  framework: {
    name: "@storybook/react-vite",
    options: {}
  },
  docs: {
    autodocs: false
  },
  core: {
    disableTelemetry: true
  }
};

export default config;
