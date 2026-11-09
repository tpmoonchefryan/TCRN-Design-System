import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/standards.stories.tsx", "../src/support.stories.tsx", "../src/components/*.stories.tsx"],
  framework: { name: "@storybook/react-vite", options: {} },
  addons: [],
  staticDirs: [
    { from: "../storybook-static/ai", to: "/ai" },
    { from: "../storybook-static/fonts", to: "/fonts" },
    { from: "../storybook-static/licenses", to: "/licenses" },
    { from: "../storybook-static/assets", to: "/assets" },
  ],
  previewHead: head => `${head}\n<link rel="stylesheet" href="./fonts/fonts.css">`,
  // Vite and Storybook copy static files concurrently. Give bundled assets their
  // own directory so both writers never race to create the static /assets root.
  viteFinal: config => ({ ...config, base: "./", build: { ...config.build, assetsDir: "sb-vite-assets" } }),
  core: { disableTelemetry: true },
};
export default config;
