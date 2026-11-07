import { approvedApi } from "./approved-api.js";

// State names are discovery metadata. The shared examples render the actual controls;
// hover/focus previews do not stand in for pointer and keyboard interaction checks.
export const componentStates = {
  Heading: ["default", "levels", "truncated"],
  Text: ["default", "sizes", "strong", "numeral", "caps"],
  Highlight: ["default", "empty", "case-sensitive"],
  Icon: ["default", "sizes", "meaningful"],
  ProductLogo: ["default", "products", "variants"],
  ProductLockup: ["default", "products", "rail", "first-line"],
  Button: ["default", "variants", "sizes", "hover", "active", "focus", "disabled", "loading", "selected"],
  IconButton: ["default", "labelled", "sizes", "hover", "active", "focus", "disabled", "loading", "selected"],
  LinkButton: ["default", "variants", "external", "focus"],
  ClipboardCopyButton: ["default", "interaction", "copying", "copied", "failed", "unsupported"],
  ButtonGroup: ["default", "quiet", "sizes", "five-actions"],
  Input: ["default", "filled", "hover", "focus", "readonly", "disabled", "error", "error-focus"],
  Textarea: ["default", "filled", "focus", "readonly", "disabled", "error"],
  SearchInput: ["default", "filled", "focus", "readonly", "disabled", "error"],
  SuggestInput: ["default", "filled", "readonly", "disabled", "error"],
  Select: ["default", "focus", "disabled", "error"],
  MultiSelect: ["default", "native", "checkboxes", "empty", "disabled", "error"],
  NumberInput: ["default", "bounds", "readonly", "disabled", "error"],
  DatePicker: ["default", "bounds", "readonly", "disabled", "error"],
  Checkbox: ["default", "checked", "indeterminate", "focus", "disabled", "error"],
  RadioGroup: ["default", "selected", "disabled", "error"],
  Switch: ["default", "checked", "small", "disabled"],
  ProductShell: ["default", "menu", "dropdown", "phone", "overflow", "product-locales"],
  ShellBrandButton: ["default", "expanded", "v1", "v2"],
  ShellMenu: ["default", "panel", "sheet", "search"],
  ShellPins: ["default", "overflow", "reorder"],
  ShellDropdown: ["default", "search", "cascade"],
  ShellIntro: ["default", "replay"],
} as const;
export type FormalComponentName = keyof typeof componentStates;
export type ComponentState = (typeof componentStates)[FormalComponentName][number];

export function componentContract(name: string) {
  const contract = approvedApi.find(api => api.name === name);
  if (!contract || !(name in componentStates)) throw new Error(`Unknown formal component: ${name}`);
  return contract;
}

export const componentExamplesSource = "apps/storybook/src/component-examples.tsx";
export function componentStoryId(name: string, state = "default") {
  componentContract(name);
  const exportId = state.replace(/^v([12])$/, "v-$1");
  return `components-${name.toLowerCase()}--${exportId}`;
}
