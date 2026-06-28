import type { IconName } from "@tcrn/ui-react";

export const navigationComponentRows = [
  { primitive: "TopBar", rule: "Names the product surface and active module without replacing page headings.", boundary: "No tenant, RBAC, or readiness truth." },
  { primitive: "SideNav", rule: "Owns primary product navigation, grouped sections, stable source order, scroll-aware document navigation, keyboard-accessible collapse and expand control, and persisted or route-owned collapsed navigation state.", boundary: "Current location may scroll into view and highlight, but must not reorder sections, hide active location from assistive tech, or ship without expanded and collapsed proof." },
  { primitive: "NavGroup and NavItem", rule: "Support section hierarchy with selected, focus, hover, disabled, and child item states.", boundary: "Selected styling must scale beyond two levels." },
  { primitive: "SearchInput", rule: "Provides search affordance for fields, filters, documentation shells, and product navigation.", boundary: "Control/Command+K shortcut labels belong only to navigation or shell search with a real focus target and result behavior." },
  { primitive: "Breadcrumb", rule: "Shows location inside a product route or documentation trail.", boundary: "Not a substitute for primary navigation." },
  { primitive: "Tabs and SegmentedNav", rule: "Switch related local views with honest segmented navigation semantics.", boundary: "Do not claim role=tab unless keyboard tab behavior is implemented." },
  { primitive: "ProductSwitcher", rule: "Moves between TCRN product surfaces when a consumer route owns that capability.", boundary: "Storybook examples remain synthetic." },
  { primitive: "Pagination", rule: "Separates long indexed lists without losing current filter or proof context.", boundary: "No remote count claim without product data." },
  { primitive: "SkipLink", rule: "Provides keyboard access past repeated shell navigation.", boundary: "Must remain visible on focus." }
];

export const navigationStrategyRows = [
  { surface: "TMS dense operations", pattern: "Top bar, menu button, compact search, and expanded mega menu", rule: "Use when a product has 10+ primary navigation items or 30+ secondary directories.", boundary: "The expanded menu must show grouped primary areas and their secondary options together." },
  { surface: "Design System knowledge base", pattern: "High-contrast collapsible side navigation with multi-level bookmark links", rule: "Use for documentation, standards, governance, and proof receipts.", boundary: "The side navigation follows scroll position, supports collapse, and does not replace page headings." },
  { surface: "Focused tool surface", pattern: "Top bar with local segmented navigation", rule: "Use for a narrow tool with five or fewer peer views.", boundary: "Segmented navigation must not pretend to be product-wide navigation." },
  { surface: "Mobile or narrow product shell", pattern: "Top bar, drawer menu, and compact search", rule: "Use when primary navigation cannot fit without wrapping or crowding.", boundary: "The drawer preserves the same grouping, search, focus, and close behavior." }
];

export type TmsNavigationItem = {
  id: string;
  label: string;
  description: string;
  iconName: IconName;
  selected: boolean;
};

export type TmsNavigationGroup = {
  title: string;
  items: TmsNavigationItem[];
};

export type TmsTaskLane = {
  title: string;
  iconName: IconName;
  items: string[];
};

export type TmsHubAction = {
  label: string;
  description: string;
  iconName: IconName;
  meta: string;
};

export const tmsMenuDensityRows = [
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

export const tmsNavigationGroups: TmsNavigationGroup[] = [
  {
    title: "Operations",
    items: [
      { id: "workspace", label: "Workspace", description: "Dashboard, tasks, and handoff watch", iconName: "home", selected: false },
      { id: "talent", label: "Talent operations", description: "Creators, channels, profiles, and availability", iconName: "database", selected: true },
      { id: "campaigns", label: "Campaigns", description: "Campaign requests and deliverable movement", iconName: "package", selected: false }
    ]
  },
  {
    title: "Commercial",
    items: [
      { id: "commerce", label: "Commerce", description: "Orders, payouts, invoices, and promotions", iconName: "external-link", selected: false },
      { id: "contracts", label: "Contracts", description: "Agreements, review states, and owner routing", iconName: "check", selected: false },
      { id: "schedule", label: "Schedule", description: "Calendar, availability, and delivery windows", iconName: "chevron-right", selected: false }
    ]
  },
  {
    title: "Control tower",
    items: [
      { id: "analytics", label: "Analytics", description: "Operational readbacks and trend views", iconName: "info", selected: false },
      { id: "assets", label: "Assets", description: "Reusable records and delivery materials", iconName: "book-open", selected: false },
      { id: "approvals", label: "Approvals", description: "Review queues and blocked handoffs", iconName: "alert-triangle", selected: false }
    ]
  },
  {
    title: "System",
    items: [
      { id: "configuration", label: "Configuration", description: "Local configuration and integration routes", iconName: "settings", selected: false },
      { id: "platform", label: "Platform admin", description: "Permissions, audit log, and product guardrails", iconName: "panel-left-open", selected: false },
      { id: "support", label: "Support", description: "Support paths and escalation references", iconName: "search", selected: false }
    ]
  }
];

export const tmsTaskLanes: TmsTaskLane[] = [
  { title: "Daily operations", iconName: "check", items: ["Creators", "Channels", "Availability", "Campaign requests"] },
  { title: "Review and exceptions", iconName: "alert-triangle", items: ["Agreements", "Risk flags", "Blocked handoffs", "Owner routing"] },
  { title: "Records and proof", iconName: "database", items: ["Profiles", "Evidence queue", "Audit trail", "SLA watch"] }
];

export const tmsHubActions: TmsHubAction[] = [
  { label: "Creators", description: "Open the current creator roster and pending profile checks.", iconName: "database", meta: "Daily route" },
  { label: "Availability", description: "Review schedule windows before campaign assignment.", iconName: "check", meta: "Capacity check" },
  { label: "Campaign requests", description: "Route incoming requests without leaving the selected area.", iconName: "package", meta: "Intake" },
  { label: "Agreements", description: "Jump to agreement review and owner routing.", iconName: "external-link", meta: "Review" },
  { label: "Evidence queue", description: "Inspect local proof and blocked handoff notes.", iconName: "book-open", meta: "Proof" },
  { label: "Risk flags", description: "Scan unresolved exceptions before handoff.", iconName: "alert-triangle", meta: "Exception" }
];

export const tmsQuickLinks: Array<{ label: string; meta: string }> = [
  { label: "Ready for review", meta: "Pinned view" },
  { label: "Deliverables", meta: "Common route" },
  { label: "Settings", meta: "System route" },
  { label: "Permissions", meta: "Governance route" }
];

export const tmsPrimaryNavCount = tmsNavigationGroups.reduce((count, group) => count + group.items.length, 0);

export const tmsHubSecondaryRouteCount = tmsHubActions.length;

export const tmsSecondaryDirectoryGroupCount = tmsTaskLanes.length + 1;

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
