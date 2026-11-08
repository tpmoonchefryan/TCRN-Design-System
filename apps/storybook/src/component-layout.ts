import { componentContract, type FormalComponentName } from "./component-catalog.js";

export interface ComponentLayout {
  sizing: "content" | "fill" | "fixed" | "mixed";
  constraint: string;
  implementation: string;
}

// Consumer/layout metadata augments the pinned board without changing its bytes or values.
// This is shared by the overview and AI shards; the approved API remains the catalogue.
export const componentLayouts = {
  Heading: { sizing: "fill", constraint: "The parent sets the line width; one line truncates with a title. Do not stretch its type scale.", implementation: "formal-layout.css.ts" },
  Text: { sizing: "fill", constraint: "The parent sets prose width; text wraps. Numeral and caps retain their own type roles; table cells own their typography.", implementation: "formal-layout.css.ts" },
  Highlight: { sizing: "content", constraint: "Inline text follows its enclosing line and may wrap; highlighting changes no container width.", implementation: "formal-layout.css.ts" },
  Icon: { sizing: "fixed", constraint: "The icon size token fixes the square. A meaningful icon needs a name; it is not a fill-width control.", implementation: "icon.css.ts" },
  ProductLogo: { sizing: "fixed", constraint: "Registered mark geometry fixes the square; choose an existing size/variant. Do not stretch the SVG.", implementation: "brand.css.ts" },
  ProductLockup: { sizing: "mixed", constraint: "Registered mark and scale fix the graphic; copy uses remaining parent space and truncates where specified. Keep the complete lockup geometry.", implementation: "brand.css.ts" },
  Button: { sizing: "content", constraint: "Text, optional icon, token gap and two token insets determine width. Cap at the parent width and ellipsize long text; never inherit grid stretch or set a fixed width.", implementation: "actions.css.ts" },
  IconButton: { sizing: "mixed", constraint: "An unlabelled button is a token-height square. A visible label uses content width and token insets; an accessible name alone does not widen the square.", implementation: "actions.css.ts" },
  LinkButton: { sizing: "content", constraint: "Navigation text and optional icon determine width with token insets. Long labels ellipsize at the parent limit; do not fill a grid track.", implementation: "actions.css.ts" },
  ClipboardCopyButton: { sizing: "content", constraint: "Uses the real Button geometry. Copy feedback changes state/label, never a parent-imposed full width; test the browser clipboard separately.", implementation: "actions.css.ts" },
  ButtonGroup: { sizing: "content", constraint: "The frame encloses members plus their 1px joins, in secondary and quiet variants. On a narrow parent, members may shrink and ellipsize; keep the joined row and token insets.", implementation: "actions.css.ts" },
  Input: { sizing: "fill", constraint: "The field container supplies the available width; the control fills it. A short value does not shrink the field. Labels/help/errors wrap outside the control.", implementation: "inputs.css.ts" },
  Textarea: { sizing: "fill", constraint: "The parent sets width, content wraps and native vertical resize remains available. It does not use action content-width rules.", implementation: "inputs.css.ts" },
  SearchInput: { sizing: "fill", constraint: "The wrapper fills its field; internal grid reserves icon, token insets and shortcut. Narrow fields must retain a usable text area and shortcut behavior.", implementation: "inputs.css.ts" },
  SuggestInput: { sizing: "fill", constraint: "The open-value input fills its field. Native suggestion presentation is browser-owned; verify long suggestions in the target browser.", implementation: "inputs.css.ts" },
  Select: { sizing: "fill", constraint: "The closed-value control fills its field. Selected text and native popup are browser-owned; the parent supplies enough width for translated labels.", implementation: "inputs.css.ts" },
  MultiSelect: { sizing: "fill", constraint: "Dropdown/native/checkbox presentations fill their parent; summaries ellipsize, option labels wrap and the popup stays in the viewport.", implementation: "inputs.css.ts" },
  NumberInput: { sizing: "fill", constraint: "The control fills the field with its existing 12ch minimum. The parent must provide that minimum; verify the committed min/max value independently of width.", implementation: "inputs.css.ts" },
  DatePicker: { sizing: "fill", constraint: "The field sets width; retain the native date segments and reserved picker area. Native locale rendering and very narrow fields need browser checks.", implementation: "inputs.css.ts" },
  Checkbox: { sizing: "fixed", constraint: "The control remains a 16px square; its external label owns wrapping. Checked, indeterminate, focus and error never change the square.", implementation: "inputs.css.ts" },
  RadioGroup: { sizing: "mixed", constraint: "The group fills its parent, while each radio remains a 16px square. Legend and option labels wrap; long translations do not stretch the radio.", implementation: "inputs.css.ts" },
  Switch: { sizing: "mixed", constraint: "Track stays 34×20, or 28×16 in small; label and description use the parent space. Immediate settings do not require a Save action.", implementation: "inputs.css.ts" },
  ProductShell: { sizing: "fill", constraint: "The shell fills its viewport/container. Existing breakpoints select the narrow menu; page content owns its width, not action components.", implementation: "shell.css.ts" },
  ShellBrandButton: { sizing: "mixed", constraint: "Registered mark/toggle geometry and content determine the button, with the existing shell minimum. Narrow touch geometry follows the shell contract.", implementation: "shell.css.ts" },
  ShellMenu: { sizing: "mixed", constraint: "The shell owns anchored panel/sheet geometry and viewport collision. Search and columns fill their assigned space; do not fit the whole menu to a short item.", implementation: "shell.css.ts" },
  ShellPins: { sizing: "mixed", constraint: "Items follow content within the shell strip; at most six are visible, overflow stays in the menu and below 1024 the strip group hides.", implementation: "shell.css.ts" },
  ShellDropdown: { sizing: "mixed", constraint: "The shell owns anchored token-width columns, flip and viewport height. Level 3/4 columns use equal width and click-driven cascades.", implementation: "shell.css.ts" },
  ShellIntro: { sizing: "mixed", constraint: "Registered lockup and measured final shell mark define the animation; it owns no independent page width. Reduced motion ends directly at shell geometry.", implementation: "shell.css.ts" },
} as const satisfies Record<FormalComponentName, ComponentLayout>;

export function componentFamily(name: FormalComponentName) {
  const board = componentContract(name).board;
  if (board === "05-actions") return "Actions";
  if (board === "06-inputs") return "Inputs and selection";
  if (board.startsWith("07")) return "Application shell";
  return "Foundations";
}
