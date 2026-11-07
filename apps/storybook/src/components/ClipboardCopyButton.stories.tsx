import { componentParameters, componentStory } from "./story.js";

export default { title: "Components/ClipboardCopyButton", parameters: componentParameters("ClipboardCopyButton") };
export const Default = componentStory("ClipboardCopyButton", "default");
export const Interaction = componentStory("ClipboardCopyButton", "interaction");
export const Copying = componentStory("ClipboardCopyButton", "copying");
export const Copied = componentStory("ClipboardCopyButton", "copied");
export const Failed = componentStory("ClipboardCopyButton", "failed");
export const Unsupported = componentStory("ClipboardCopyButton", "unsupported");
