import type { StorybookConfig } from "@storybook/react-vite";
const config:StorybookConfig={stories:["../src/standards.stories.tsx"],framework:{name:"@storybook/react-vite",options:{}},addons:[],staticDirs:[{from:"../storybook-static/fonts",to:"/fonts"},{from:"../storybook-static/licenses",to:"/licenses"},{from:"../storybook-static/assets",to:"/assets"}],previewHead:head=>`${head}\n<link rel="stylesheet" href="/fonts/fonts.css">`,core:{disableTelemetry:true}};
export default config;
