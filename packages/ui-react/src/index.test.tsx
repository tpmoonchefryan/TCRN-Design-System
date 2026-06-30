import test from "node:test";
import assert from "node:assert/strict";
import {
  componentLibraryDeferredPrototypeNames,
  componentLibraryPublicComponentNames,
  componentLibraryPublicUtilityNames
} from "./index.js";

test("component-library metadata names public components, utilities, and deferred prototypes", () => {
  const expectedPublicComponents = [
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
  ];

  assert.deepEqual([...componentLibraryPublicComponentNames].sort(), [...expectedPublicComponents].sort());
  assert.deepEqual([...componentLibraryPublicUtilityNames].sort(), [
    "getTcrnProductLogoAsset",
    "tcrnComponentCss",
    "tcrnIconNames",
    "tcrnProductLogoRegistry",
    "useProductShellController"
  ]);
  assert.ok(componentLibraryDeferredPrototypeNames.includes("TmsDenseShellDemo"));
  assert.ok(componentLibraryDeferredPrototypeNames.includes("KnowledgeBaseShellDemo"));
  assert.ok(componentLibraryDeferredPrototypeNames.includes("CompactToolShellDemo"));
  const deferredPrototypeNames = componentLibraryDeferredPrototypeNames as readonly string[];
  assert.equal(deferredPrototypeNames.includes("TcrnBrandMark"), false);
  assert.equal(deferredPrototypeNames.includes("ProductLockup"), false);
  assert.equal(deferredPrototypeNames.includes("ShellBrandLockup"), false);
});
