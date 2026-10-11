export const navigationComponentRows = [
  { primitive: "TopBar", rule: "Names the product surface and active module without replacing page headings.", boundary: "No tenant, RBAC, or readiness truth." },
  { primitive: "SideNav", rule: "Owns primary product navigation, grouped sections, stable source order, scroll-aware document navigation, keyboard-accessible collapse and expand control, and persisted or route-owned collapsed navigation state.", boundary: "Current location may scroll into view and highlight, but must not reorder sections, hide active location from assistive tech, or ship without expanded and collapsed proof." },
  { primitive: "NavGroup and NavItem", rule: "Support section hierarchy with selected, focus, hover, disabled, and child item states.", boundary: "Selected styling must scale beyond two levels." },
  { primitive: "SearchInput", rule: "Provides search affordance for fields, filters, documentation shells, and product navigation.", boundary: "Control/Command+K shortcut labels belong only to navigation or shell search with a real focus target and result behavior." },
  { primitive: "Breadcrumb", rule: "Shows location inside a product route or documentation trail.", boundary: "Not a substitute for primary navigation." },
  { primitive: "Tabs and SegmentedNav", rule: "Switch related local views with honest segmented navigation semantics.", boundary: "Do not claim role=tab unless keyboard tab behavior is implemented." },
  { primitive: "PageHierarchy", rule: "Encodes explicit two-level and three-level page structures before container adaptation.", boundary: "ProductShell topbar is external; width cannot infer page depth or add an internal left navigation." },
  { primitive: "ProductSwitcher", rule: "Moves between TCRN product surfaces when a consumer route owns that capability.", boundary: "Storybook examples remain synthetic." },
  { primitive: "Pagination", rule: "Separates long indexed lists without losing current filter or proof context.", boundary: "No remote count claim without product data." },
  { primitive: "SkipLink", rule: "Provides keyboard access past repeated shell navigation.", boundary: "Must remain visible on focus." }
];

export const navigationStrategyRows = [
  { surface: "Dense operations", pattern: "Top bar, menu button, compact search, and expanded mega menu", rule: "Use when a product has 10+ primary navigation items or 30+ secondary directories.", boundary: "The expanded menu must show grouped primary areas and their secondary options together." },
  { surface: "Design System knowledge base", pattern: "High-contrast collapsible side navigation with multi-level bookmark links", rule: "Use for documentation, standards, governance, and proof receipts.", boundary: "The side navigation follows scroll position, supports collapse, and does not replace page headings." },
  { surface: "Focused tool surface", pattern: "Top bar with local segmented navigation", rule: "Use for a narrow tool with five or fewer peer views.", boundary: "Segmented navigation must not pretend to be product-wide navigation." },
  { surface: "Mobile or narrow product shell", pattern: "Top bar, drawer menu, and compact search", rule: "Use when primary navigation cannot fit without wrapping or crowding.", boundary: "The drawer preserves the same grouping, search, focus, and close behavior." }
];

export const denseShellMenuDensityRows = [
  {
    density: "Hub",
    trigger: "Use when the selected primary area has 3-8 secondary routes and no overflow.",
    pattern: "Show a visual entry hub with action tiles, a short selected-area summary, and a compact utility rail.",
    boundary: "Do not force sparse secondary routes into the command-center or dense directory layout."
  },
  {
    density: "Command center",
    trigger: "Use when primary navigation is 10+ items or secondary routes need task grouping.",
    pattern: "Group primary areas by business domain, then expose task lanes and quick entries.",
    boundary: "Keep the selected primary area and its secondary options visible together."
  },
  {
    density: "Dense directory",
    trigger: "Use only when secondary routes are numerous, zoom is large, or the menu would overflow.",
    pattern: "Switch to a compact grouped directory optimized for scanning and scrolling.",
    boundary: "Density is a fallback for capacity, not the default visual treatment for sparse menus."
  }
];

export const knowledgeNavigationGroups = [
  {
    label: "Components",
    selected: true,
    selectedItem: "Navigation shell",
    items: ["Component family index", "Button spec and usage", "Field spec and usage", "Navigation shell", "Dialog spec and usage", "Table and work index spec"]
  },
  { label: "Style guide", selected: false, selectedItem: "Brand identity", items: ["Brand identity", "Color palette", "Text styles", "Grid system"] },
  { label: "Proof", selected: false, selectedItem: "Proof matrix", items: ["Proof matrix", "Browser proof", "Accessibility", "No-overclaim"] }
];
