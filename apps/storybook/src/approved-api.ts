import type { ApprovedBoardId } from "./approved-source.js";
export interface ApprovedApi { name:string; board:ApprovedBoardId; line:number; props:readonly string[] }
// Explicit published component and role obligations, never the engineering export manifest.
export const approvedApi:readonly ApprovedApi[]=[
  {name:"Heading",board:"02-typography",line:220,props:["children","level 1–4","visualLevel 1–4"]},
  {name:"Text",board:"02-typography",line:221,props:["children","size body|reading|meta|caption","tone default|strong","variant numeral|caps"]},
  {name:"Highlight",board:"02-typography",line:222,props:["text","query","caseSensitive","markClassName"]},
  {name:"Icon",board:"03-icons",line:131,props:["name (published roster)","size sm|md|lg|number","decorative","title / aria-label"]},
  {name:"ProductLogo",board:"04-brand",line:22,props:["productId (four registered products)","color|mono|tile-tint|tile-deep"]},
  {name:"ProductLockup",board:"04-brand",line:35,props:["productId","locale (published tagline)","first line / full lockup / 22px scale"]},
  {name:"Button",board:"05-actions",line:112,props:["children","variant primary|secondary|quiet|danger","size sm|md|lg","disabledReason"]},
  {name:"IconButton",board:"05-actions",line:113,props:["ariaLabel","iconName|icon","size sm|md|lg"]},
  {name:"LinkButton",board:"05-actions",line:114,props:["href","variant primary|secondary|quiet"]},
  {name:"ClipboardCopyButton",board:"05-actions",line:115,props:["text","ariaLabel","locale","*Label","resetDelayMs","onCopyStateChange"]},
  {name:"ButtonGroup",board:"05-actions",line:116,props:["ariaLabel","size","variant secondary|quiet","2–5 Button / IconButton children"]},
  {name:"Input",board:"06-inputs",line:124,props:["native attributes","label / aria-label","disabledReason","aria-invalid / aria-describedby"]},
  {name:"Textarea",board:"06-inputs",line:124,props:["native attributes","label / aria-label","disabledReason","aria-invalid / aria-describedby"]},
  {name:"SearchInput",board:"06-inputs",line:125,props:["label / aria-label","shortcut auto|string|false","fill"]},
  {name:"SuggestInput",board:"06-inputs",line:126,props:["suggestions","native Input attributes","open string value"]},
  {name:"Select",board:"06-inputs",line:127,props:["options[{value,label,disabled}]","disabledReason"]},
  {name:"MultiSelect",board:"06-inputs",line:128,props:["options","value/defaultValue","onChange","presentation native|dropdown|checkboxes","emptySelectionLabel","clearSelectionLabel"]},
  {name:"NumberInput",board:"06-inputs",line:129,props:["min","max","step","inputMode","disabledReason","label + unit"]},
  {name:"DatePicker",board:"06-inputs",line:130,props:["value (ISO)","min","max","label"]},
  {name:"Checkbox",board:"06-inputs",line:131,props:["native attributes","label","disabledReason"]},
  {name:"RadioGroup",board:"06-inputs",line:132,props:["legend","name","options[{value,label,description,disabled,minInlineSize}]","value/defaultValue","onChange"]},
  {name:"Switch",board:"06-inputs",line:133,props:["label","description","controlClassName"]},
  {name:"ProductShell",board:"07b-shell-lower",line:58,props:["menu model (four levels)","per-user per-product pin preferences","search provider","registered product key","avatar product list","PageHeader"]},
  {name:"ShellBrandButton",board:"07a-shell-upper",line:22,props:["registered product key","version v1|v2 (full lockup is the separate third rendition)","aria-expanded","aria-haspopup=dialog"]},
  {name:"ShellMenu",board:"07b-shell-lower",line:68,props:["grouped menu model","open / close","search provider","pin preferences","non-modal dialog"]},
  {name:"ShellPins",board:"07b-shell-lower",line:60,props:["ordered pinned items (maximum 6 visible)","pin reorder callback","selected route"]},
  {name:"ShellDropdown",board:"07b-shell-lower",line:70,props:["pinned subtree","search within subtree","click-driven level 3/4 cascades"]},
  {name:"ShellIntro",board:"07a-shell-upper",line:179,props:["sign-in success event","registered color mark","once-per-session marker","reduced-motion preference"]}
];
