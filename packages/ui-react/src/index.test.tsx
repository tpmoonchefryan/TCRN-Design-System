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
    "DetailDrawer",
    "ActionDrawer",
    "Tooltip",
    "Popover",
    "Dialog",
    "ConfirmActionDialog"
  ];

  assert.deepEqual([...componentLibraryPublicComponentNames].sort(), [...expectedPublicComponents].sort());
  assert.deepEqual([...componentLibraryPublicUtilityNames].sort(), ["tcrnIconNames"]);
  assert.ok(componentLibraryDeferredPrototypeNames.includes("TmsDenseShellDemo"));
  assert.ok(componentLibraryDeferredPrototypeNames.includes("KnowledgeBaseShellDemo"));
  assert.ok(componentLibraryDeferredPrototypeNames.includes("CompactToolShellDemo"));
});
