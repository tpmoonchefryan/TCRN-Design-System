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
  "Badge",
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
  "GateReadinessPanel",
  "EvidenceStrip",
  "ReadbackPanel",
  "Text",
  "Heading",
  "Surface",
  "Divider",
  "CollapsibleRegion",
  "DisclosurePanel",
  "KeyValueList",
  "FilterBar",
  "TableShell",
  "WorkIndex",
  "DetailInspector",
  "RelationshipChip",
  "MachineToken",
  "WorkManagementSubnav",
  "WorkBoard",
  "WorkHierarchy",
  "GatePipeline",
  "EvidenceAttachmentList",
  "WorkItemInspector",
  "SavedViewToolbar",
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
  "workManagementPatternRegistry",
  "workRelationshipTypes",
  "useProductShellController"
] as const;

export type ComponentLibraryPublicUtilityName = (typeof componentLibraryPublicUtilityNames)[number];

export const componentLibraryDeferredPrototypeNames = [
  "TmsDenseShellDemo",
  "KnowledgeBaseShellDemo",
  "CompactToolShellDemo"
] as const;

export type ComponentLibraryDeferredPrototypeName = (typeof componentLibraryDeferredPrototypeNames)[number];

export * from "./components/Icon/index.js";
export * from "./components/Button/index.js";
export * from "./components/Clipboard/index.js";
export * from "./components/Typography/index.js";
export * from "./components/Form/index.js";
export * from "./components/Feedback/index.js";
export * from "./components/Navigation/index.js";
export * from "./components/Layout/index.js";
export * from "./components/DataDisplay/index.js";
export * from "./components/Overlay/index.js";
