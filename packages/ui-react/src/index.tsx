export const componentLibraryPublicComponentNames = [
  "Button",
  "Icon",
  "IconButton",
  "LinkButton",
  "ButtonGroup",
  "ClipboardCopyButton",
  "Field",
  "Input",
  "NumberInput",
  "Textarea",
  "SearchInput",
  "Select",
  "MultiSelect",
  "SuggestInput",
  "Checkbox",
  "Switch",
  "SettingRowList",
  "SettingRow",
  "FieldProvenance",
  "LineNumberedEditor",
  "LockHint",
  "Badge",
  "Stamp",
  "StampRule",
  "EmptyState",
  "ErrorState",
  "OperationFeedback",
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
  "SettingsLayout",
  "PageHierarchy",
  "KeyValueList",
  "DatePicker",
  "Tree",
  "DataGrid",
  "Menu",
  "Toast",
  "RadioGroup",
  "SettingChoice",
  "SettingsHostSwitcher",
  "Tabs",
  "Card",
  "Avatar",
  "Progress",
  "Stepper",
  "DefinitionList",
  "DictionaryTable",
  "ContentScope",
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
  "ShellBrandButton",
  "ShellPins",
  "ShellMenu",
  "ShellDropdown",
  "ShellIntro",
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
  "ConfirmActionDialog",
  "RelationshipChip",
  "MachineToken",
  "MachineTokenCell",
  "SubNav",
  "SavedViewToolbar",
  "PageHeader",
  "ViewTabs",
  "QuickFilters",
  "RecordRow",
  "RecordTable",
  "SplitView",
  "InlineCreate",
  "RowGroup",
  "LaneBoard",
  "RelationGraph",
  "StagePipeline",
  "AttachmentList",
  "MetadataRail",
  "ActivityFeed",
  "DetailLayout",
  "RecordInspector",
  "TreeNav",
  "LabelSet",
  "DocumentCanvas",
  "TocRail",
  "InlineCommentList",
  "VersionHistory",
  "SearchResultList"
] as const;

export type ComponentLibraryPublicComponentName = (typeof componentLibraryPublicComponentNames)[number];

export const componentLibraryPublicUtilityNames = [
  "tcrnIconNames",
  "tcrnComponentCss",
  "tcrnProductLogoRegistry",
  "getTcrnProductLogoAsset",
  "tcrnSettingChoiceDecisionTable",
  "resolveSettingChoiceControl",
  "resolveFieldValueControl",
  "mountStaticOverlayBoundary",
  "mountStaticMultiSelect",
  "mountStaticClipboardCopyButton",
  "useProductShellController",
  "validateContentScope",
  "evaluateConsumerEvidence",
  "serializeConsumerEvidenceValue",
  "presentOperationFeedbackPhase"
] as const;

export type ComponentLibraryPublicUtilityName = (typeof componentLibraryPublicUtilityNames)[number];

/**
 * The deprecated components (TCRN-DS-SUB-125, STORY-143): one shell, the top band, has no place for a
 * resident side rail, its collapse and mobile toggles, the old top bar or the product launcher and
 * switcher. Each stays exported, and in the public roster above, through 4.0.x with a migration step in
 * docs/migration-4.0.md; their visual rules are outside the published Site stylesheet. Removed in 4.1.
 */
export const componentLibraryDeprecatedComponentNames = [
  "SideNav",
  "SideNavCollapseButton",
  "MobileNavToggle",
  "TopBar",
  "ProductLauncher",
  "ProductSwitcher"
] as const satisfies readonly ComponentLibraryPublicComponentName[];

export type ComponentLibraryDeprecatedComponentName = (typeof componentLibraryDeprecatedComponentNames)[number];

export const componentLibraryDeferredPrototypeNames = [
  "KnowledgeBaseShellDemo"
] as const;

export type ComponentLibraryDeferredPrototypeName = (typeof componentLibraryDeferredPrototypeNames)[number];

export { cx, resolveDocumentLocale } from "./utils.js";
export * from "./components/Icon/index.js";
export * from "./components/Button/index.js";
export * from "./components/ButtonGroup/index.js";
export * from "./components/Clipboard/index.js";
export * from "./components/Typography/index.js";
export * from "./components/Form/index.js";
export * from "./components/Feedback/index.js";
export * from "./components/Navigation/index.js";
export * from "./components/Layout/index.js";
export * from "./components/DataDisplay/index.js";
export * from "./components/Overlay/index.js";
export * from "./verification/index.js";
