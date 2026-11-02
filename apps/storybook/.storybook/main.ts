import type { StorybookConfig } from "@storybook/react-vite";
const config:StorybookConfig={stories:["../src/standards.stories.tsx"],framework:{name:"@storybook/react-vite",options:{}},addons:[],staticDirs:[{from:"../storybook-static/fonts",to:"/fonts"},{from:"../storybook-static/licenses",to:"/licenses"},{from:"../storybook-static/assets",to:"/assets"}],core:{disableTelemetry:true}};
export default config;
