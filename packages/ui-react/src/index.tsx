export const componentLibraryPublicComponentNames = [
  "Button",
  "Icon",
  "IconButton",
  "LinkButton",
  "ClipboardCopyButton",
  "Field",
  "Input",
  "Textarea",
  "SearchInput",
  "Select",
  "Checkbox",
  "Switch",
  "SettingRow",
  "FieldProvenance",
  "LineNumberedEditor",
  "LockHint",
  "Badge",
  "Stamp",
  "StampRule",
  "EmptyState",
  "ErrorState",
  "Highlight",
  "StatusBadge",
  "StateSurface",
  "StateView",
  "InlineAlert",
  "LiveRegion",
  "Skeleton",
  "EnvironmentBanner",
  "StatusSummaryPanel",
  "ReadbackPanel",
  "Text",
  "Heading",
  "Surface",
  "Divider",
  "AppStatusBar",
  "CollapsibleRegion",
  "DisclosurePanel",
  "KeyValueList",
  "DatePicker",
  "Tree",
  "DataGrid",
  "Menu",
  "Toast",
  "RadioGroup",
  "Tabs",
  "Card",
  "Avatar",
  "Progress",
  "Stepper",
  "DefinitionList",
  "StatCard",
  "FilterBar",
  "TableShell",
  "TableToolbar",
  "DetailInspector",
  "SearchableList",
  "TemplateGallery",
  "Breadcrumb",
  "ModuleTabs",
  "SectionTabs",
  "SegmentedNav",
  "Pagination",
  "TopBar",
  "SideNav",
  "NavGroup",
  "NavItem",
  "ProductLauncher",
  "ProductSwitcher",
  "SkipLink",
  "TcrnBrandMark",
  "ProductLogo",
  "ProductLockup",
  "ShellBrandLockup",
  "ShellThemeToggle",
  "ShellLocaleMenu",
  "SideNavCollapseButton",
  "MobileNavToggle",
  "ProductShell",
  "ProductShellSearch",
  "DetailDrawer",
  "ActionDrawer",
  "Tooltip",
  "Popover",
  "Dialog",
  "ConfirmActionDialog"
] as const;

export type ComponentLibraryPublicComponentName = (typeof componentLibraryPublicComponentNames)[number];

export const componentLibraryPublicUtilityNames = [
  "tcrnIconNames",
  "tcrnComponentCss",
  "tcrnProductLogoRegistry",
  "getTcrnProductLogoAsset",
  "useProductShellController",
  "tcrnCoreComponentCss",
  "tcrnDomainComponentCss",
  "partitionComponentCss",
  "isDomainSelector"
] as const;

export type ComponentLibraryPublicUtilityName = (typeof componentLibraryPublicUtilityNames)[number];

export const componentLibraryDeferredPrototypeNames = [
  "DenseOperationsShellDemo",
  "KnowledgeBaseShellDemo",
  "CompactToolShellDemo"
] as const;

export type ComponentLibraryDeferredPrototypeName = (typeof componentLibraryDeferredPrototypeNames)[number];

// TCRN-DS-INIT-012: @tcrn/ui-domain composes core components and needs these two.
export { cx, resolveDocumentLocale } from "./utils.js";
export * from "./components/Icon/index.js";
export * from "./components/Button/index.js";
export * from "./components/Clipboard/index.js";
export * from "./components/Typography/index.js";
export * from "./components/Form/index.js";
export * from "./components/Feedback/index.js";
export * from "./components/Navigation/index.js";
// The prefix lists stay internal to the partition module: a consumer needs the two
// sheets and, at most, the classifier — not the tables the classifier reads.
export {
  isDomainSelector,
  partitionComponentCss,
  tcrnCoreComponentCss,
  tcrnDomainComponentCss
} from "./components/Navigation/component-css-partition.js";
export * from "./components/Layout/index.js";
export * from "./components/DataDisplay/index.js";
export * from "./components/Overlay/index.js";
