import type { ReactNode } from "react";
import { useRef, useState } from "react";
import {
  Badge,
  Button,
  Breadcrumb,
  componentLibraryDeferredPrototypeNames,
  componentLibraryPublicComponentNames,
  componentLibraryPublicUtilityNames,
  ConfirmActionDialog,
  ActionDrawer,
  DetailDrawer,
  DetailInspector,
  Dialog,
  EnvironmentBanner,
  EvidenceStrip,
  Field,
  FilterBar,
  GateReadinessPanel,
  Heading,
  Icon,
  IconButton,
  InlineAlert,
  Input,
  KeyValueList,
  ModuleTabs,
  NavGroup,
  NavItem,
  Pagination,
  Popover,
  ProductSwitcher,
  ReadbackPanel,
  SearchInput,
  SectionTabs,
  SegmentedNav,
  Select,
  SideNav,
  SkipLink,
  StateView,
  StatusBadge,
  Surface,
  TableShell,
  Text,
  Textarea,
  TopBar,
  tcrnIconNames,
  WorkIndex
} from "@tcrn/ui-react";
import type { IconName } from "@tcrn/ui-react";
import {
  presentCopyState,
  tcrnDefaultLocale,
  tcrnFallbackLocale,
  tcrnI18nContract,
  tcrnLocaleMetadata
} from "@tcrn/ui-copy-state";

export type ContractStoryGroup = "Welcome" | "Style Guide" | "Foundations" | "Components" | "Patterns" | "Proof" | "Change Log";

export interface ContractStory {
  id: string;
  title: string;
  group: ContractStoryGroup;
  description: string;
  render: () => ReactNode;
}

export const contractStoryGroups: readonly ContractStoryGroup[] = [
  "Welcome",
  "Style Guide",
  "Foundations",
  "Components",
  "Patterns",
  "Proof",
  "Change Log"
] as const;

const componentStoryRows = [
  { id: "button", title: "Button", state: { state: "local_only" }, owner: "ui-react" },
  { id: "field", title: "Field", state: { state: "proof_required" }, owner: "ui-react" },
  { id: "navigation", title: "Navigation shell", state: { state: "proof_required" }, owner: "ui-react" },
  { id: "dialog", title: "Dialog", state: { state: "proof_required" }, owner: "ui-react" },
  { id: "work-index", title: "WorkIndex", state: { state: "fixture_only" }, owner: "ui-react" },
  { id: "brand-lockup", title: "Brand lockup", state: { state: "not_claimed" }, owner: "Storybook prototype" }
];

const tableShellRuleRows = [
  {
    surface: "TableShell",
    desktop: "Use readable dense rows with visible headers and package-backed status cells.",
    mobile: "Stack each row into labeled fields without dropping labels or state text.",
    boundary: "Do not render unlabeled text blocks or claim remote counts from local examples."
  },
  {
    surface: "WorkIndex",
    desktop: "Use for finite review queues where status and owner scanning matter.",
    mobile: "Preserve source order and show the same labels before each value.",
    boundary: "Do not treat WorkIndex as DataGrid, virtualized search, or bulk editing."
  },
  {
    surface: "Empty state",
    desktop: "Keep the empty state inside the table frame and name what is absent.",
    mobile: "Keep the same empty message visible without inventing rows.",
    boundary: "Do not use empty state when loading or source errors are unresolved."
  },
  {
    surface: "Accessibility receipt",
    desktop: "Every table needs an accessible name and legal row/cell structure, including empty states.",
    mobile: "Stacked mobile rows keep data-label text before each value.",
    boundary: "Never place headings or arbitrary blocks directly under role=table."
  },
  {
    surface: "Sorting and filtering",
    desktop: "Show sort or filter controls only after aria-sort, active filter readback, and empty/error states are implemented.",
    mobile: "Keep the current sort/filter summary visible before stacked rows.",
    boundary: "TableShell does not imply remote filtering, column configuration, or persisted sort state."
  },
  {
    surface: "Row actions",
    desktop: "Keep row actions visible, focusable, and separated from status text.",
    mobile: "Actions wrap under the row label with the same disabled reason text.",
    boundary: "Do not hide blocked actions or append disabled reasons to visible labels."
  },
  {
    surface: "Bulk selection",
    desktop: "Batch selection requires selected counts, all/none boundaries, and keyboard behavior.",
    mobile: "Show selected state per row; do not rely on color alone.",
    boundary: "WorkIndex does not include bulk selection by default."
  }
];

const dataGridEscalationRows = [
  {
    capability: "Editable cells",
    tableShell: "Do not keep TableShell",
    escalation: "Use DataGrid or a detail form with persistent field labels.",
    proof: "Keyboard editing, validation, save/cancel, and error recovery."
  },
  {
    capability: "Remote pagination or filtering",
    tableShell: "Do not keep TableShell",
    escalation: "Use DataGrid or a route-owned workbench.",
    proof: "Loading, empty, error, current query, and total-count ownership."
  },
  {
    capability: "Virtual scrolling",
    tableShell: "Do not keep TableShell",
    escalation: "Use DataGrid with explicit viewport and row-count proof.",
    proof: "Keyboard position, screen-reader row context, and scroll restoration."
  },
  {
    capability: "Column resize or frozen columns",
    tableShell: "Do not keep TableShell",
    escalation: "Use DataGrid with column-state controls.",
    proof: "Resize handles, focus order, persistence, and responsive fallback."
  },
  {
    capability: "Bulk operations",
    tableShell: "Do not keep WorkIndex",
    escalation: "Use a selection list or DataGrid with batch-action proof.",
    proof: "Selected count, all/none behavior, disabled reasons, and undo or confirmation."
  }
];

const componentFamilyRows = [
  { family: "Actions", components: "Button, IconButton, LinkButton", scope: "Commands and blocked owner actions", status: "Component library available" },
  { family: "Iconography", components: "Icon, tcrnIconNames", scope: "Functional iconography routed through the TCRN wrapper", status: "Component library available; not brand marks" },
  { family: "Forms", components: "Field, Input, Textarea, SearchInput, Select, Checkbox", scope: "Persistent labels, hint/error wiring, disabled reasons, and localized input ergonomics", status: "Component library available" },
  { family: "Navigation", components: "TopBar, SideNav, NavGroup, NavItem, Breadcrumb, ModuleTabs, SectionTabs, SegmentedNav, ProductSwitcher, Pagination, SkipLink", scope: "Product orientation, side navigation, local section movement, and skip access", status: "Component library available; full shells remain prototypes" },
  { family: "Overlays", components: "DetailDrawer, ActionDrawer, Popover, Dialog, ConfirmActionDialog", scope: "Layered surfaces, anchored popovers, focus entry, and close/return contracts", status: "Component library available; no tab-containment claim" },
  { family: "Data display", components: "TableShell, WorkIndex, StatusBadge, KeyValueList", scope: "Dense scanning, readable state, and empty/error distinction", status: "Component library available; DataGrid not included" },
  { family: "Feedback and readiness", components: "Badge, InlineAlert, LiveRegion, Skeleton, EnvironmentBanner, GateReadinessPanel, EvidenceStrip, ReadbackPanel, StateView", scope: "Loading, blocked, unknown, and proof-dependent states", status: "Component library available" },
  { family: "Layout and text", components: "Text, Heading, Surface, Divider, FilterBar", scope: "Spacing floor, headings, sections, dividers, and filter grouping", status: "Component library available" },
  { family: "Brand and identity", components: "TcrnBrandMark, ProductLockup, ShellBrandLockup", scope: "TCRN mother brand and product suffix treatment", status: "Storybook prototypes; not reusable component exports" }
];

const storybookOnlyPrototypeRows = [
  { helper: "TcrnBrandMark / ProductLockup / ShellBrandLockup", scope: "Synthetic brand review visuals", status: "Storybook prototype; not a component library export" },
  { helper: "TmsDenseShellDemo", scope: "Dense product shell IA comparison", status: "Storybook prototype; full shell deferred" },
  { helper: "KnowledgeBaseShellDemo", scope: "Documentation shell IA comparison", status: "Storybook prototype; full shell deferred" },
  { helper: "CompactToolShellDemo", scope: "Focused tool shell comparison", status: "Storybook prototype; shell framework deferred" }
];

const aosServedSurfaceCoverageRows = [
  {
    surface: "operations-cockpit",
    standard: "Product workspace shell plus operations workbench",
    packageComponents: "Surface, SideNav, NavGroup, NavItem, TopBar, WorkIndex, TableShell, FilterBar, SearchInput, DetailDrawer, GateReadinessPanel, ReadbackPanel, EvidenceStrip",
    boundary: "Service/read-model data and AOS-specific labels stay product-owned."
  },
  {
    surface: "docs-search-release-readiness",
    standard: "Readiness workspace with evidence, linkage, search, and selected detail",
    packageComponents: "Surface, SideNav, NavGroup, NavItem, TopBar, WorkIndex, TableShell, FilterBar, SearchInput, StateView, DetailDrawer, EvidenceStrip, ReadbackPanel",
    boundary: "Docs export, release handoff, GitHub mutation, and CI mutation stay outside this UI standard."
  },
  {
    surface: "aos-wide-product-design",
    standard: "Target-set workspace with module index, target path, readiness gates, and detail inspection",
    packageComponents: "Surface, SideNav, NavGroup, NavItem, TopBar, TableShell, WorkIndex, GateReadinessPanel, DetailDrawer, KeyValueList, Badge, StatusBadge",
    boundary: "Target-set presentation does not implement the target modules as product features."
  }
];

const aosWorkspaceShellRows = [
  {
    primitive: "Surface",
    rule: "Owns major workspace bands, summary regions, and detail panels with 8px-or-less radius and predictable spacing.",
    proof: "Page sections are package-backed surfaces or unframed layout bands, never nested cards."
  },
  {
    primitive: "SideNav and NavGroup",
    rule: "Keep primary navigation grouped, sticky on wide viewports, and collapsed or wrapped without label collision on narrow viewports.",
    proof: "Disabled nav items show a clean label plus a separate reason line or assistive reason."
  },
  {
    primitive: "TopBar",
    rule: "Names the active product surface and service/workspace status while leaving page headings to the content area.",
    proof: "Controls wrap before they collide with project, target-path, or status fields."
  },
  {
    primitive: "FilterBar, Field, SearchInput, Select",
    rule: "Group local search/filter controls with persistent labels, disabled reasons, and zero-match or unavailable states.",
    proof: "Disabled form controls expose title, data-disabled-reason, and a unique described-by target."
  }
];

const aosWorkbenchRows = [
  {
    area: "Summary grid",
    standard: "Use Surface, Heading, Text, Badge, StatusBadge, GateReadinessPanel, and ReadbackPanel for dense status cards.",
    responsive: "Cards wrap in source order and keep metric labels adjacent to values."
  },
  {
    area: "Stage and phase timeline",
    standard: "Use package text/status primitives and table/list rows; timeline connectors are presentation only.",
    responsive: "Timeline labels wrap under their status badges on mobile instead of shrinking into one line."
  },
  {
    area: "Evidence, risk, and claim lanes",
    standard: "Use EvidenceStrip and StatusBadge for warning/readiness lanes; pair details with ReadbackPanel or KeyValueList.",
    responsive: "Badges wrap as readable chips and never concatenate with adjacent labels."
  },
  {
    area: "Selected detail",
    standard: "Use DetailDrawer for structural inspection and KeyValueList for label/value content.",
    responsive: "Drawer content remains complementary, readable, and non-modal unless Dialog behavior is wired."
  }
];

const aosDocsReadinessRows = [
  {
    area: "Readiness board",
    components: "Surface, Heading, Text, StatusBadge, GateReadinessPanel",
    rule: "Show local/read-only readiness and blocked states without implying external release movement."
  },
  {
    area: "Search inspection",
    components: "FilterBar, Field, SearchInput, Select, TableShell, StateView",
    rule: "Search, filter, empty, and no-match states stay in one readable local inspection flow."
  },
  {
    area: "GitHub PR and CI linkage",
    components: "EvidenceStrip, ReadbackPanel, Badge, LinkButton",
    rule: "Links are presented as references unless the consumer owns mutation behavior."
  },
  {
    area: "Selected detail",
    components: "DetailDrawer, KeyValueList, EvidenceStrip",
    rule: "Selected repo paths, linkage status, and notes remain inspectable without publication claims."
  }
];

const aosTargetSetRows = [
  {
    area: "Target path",
    components: "TopBar, Field, Select, StatusBadge",
    rule: "Target-path controls wrap before collision and disabled state explains why editing is unavailable."
  },
  {
    area: "Module cards",
    components: "Surface, Heading, Text, Badge, StatusBadge",
    rule: "Cards show target-set status only and do not imply module implementation."
  },
  {
    area: "Surface index",
    components: "WorkIndex, TableShell, SearchInput, FilterBar, StateView",
    rule: "Dense index rows keep row/cell semantics, mobile labels, and contained overflow."
  },
  {
    area: "Gate and evidence panels",
    components: "GateReadinessPanel, EvidenceStrip, ReadbackPanel, DetailDrawer",
    rule: "Unavailable actions remain disabled with their own reason and no live-action affordance."
  }
];

const aosTargetSetModuleCards = [
  { id: "operations", title: "Operations cockpit", state: { state: "local_only" } },
  { id: "docs", title: "Docs readiness", state: { state: "fixture_only" } },
  { id: "target-set", title: "Product design target set", state: { state: "blocked" } }
] as const;

const aosDisabledReasonRows = [
  {
    control: "NavItem",
    reasonContract: "Visible label stays clean; reason appears in the nav reason line, title, data-disabled-reason, and described-by target.",
    requiredFor: "Sidebar navigation, local secondary navigation, target set links"
  },
  {
    control: "Button, IconButton, LinkButton",
    reasonContract: "Blocked commands keep a concise label and expose their reason through title, data-disabled-reason, and assistive text.",
    requiredFor: "Refresh, drawer actions, unavailable workspace commands"
  },
  {
    control: "Input, Textarea, Select, SearchInput, Checkbox",
    reasonContract: "Disabled form controls expose title, data-disabled-reason, and a unique sr-only described-by target.",
    requiredFor: "Target path, filters, owner-trial fields, local preview toggles"
  },
  {
    control: "DetailDrawer actions",
    reasonContract: "Drawer actions use Button/IconButton semantics and keep unavailable explanations separate from labels.",
    requiredFor: "Selected detail, service preview, readiness inspection"
  }
];

const aosTokenDensityRows = [
  {
    tokenArea: "Color",
    rule: "Navy, teal, and blue may anchor AOS workspaces only when paired with neutral surfaces and warning/positive state tokens.",
    boundary: "Do not build one-hue pages or use decorative orbs/gradients as the visual system."
  },
  {
    tokenArea: "Density",
    rule: "Operational surfaces use compact spacing and readable scan rows instead of marketing-scale heroes.",
    boundary: "Hero-scale type belongs only to true first-view hero contexts, not cockpit or readiness cards."
  },
  {
    tokenArea: "Radius",
    rule: "Cards, panels, and controls stay at 8px radius or less unless an existing primitive defines otherwise.",
    boundary: "No nested cards inside page-section cards."
  },
  {
    tokenArea: "Focus and selected states",
    rule: "Selected, hover, focus, disabled, and warning states must remain visible with tokenized contrast and text labels.",
    boundary: "Color alone is never enough for selected or blocked state."
  }
];

const aosExceptionRows = [
  {
    exceptionId: "aos-brand-lockup-product-specific",
    disposition: "product_specific_exception",
    scope: "AOS product suffix, owner-facing naming, and service/read-model labels may remain consumer-owned copy.",
    limit: "TcrnBrandMark, ProductLockup, and ShellBrandLockup remain Storybook-only prototypes until a separate package-backed brand route promotes them."
  },
  {
    exceptionId: "aos-data-semantics-product-owned",
    disposition: "product_specific_exception",
    scope: "Service schema, row IDs, workspace health, target-set business fields, and local/read-only posture remain AOS-owned data truth.",
    limit: "The Design System owns presentation, disabled-control contracts, layout behavior, and reusable component registration."
  }
];

const navigationComponentRows = [
  { primitive: "TopBar", rule: "Names the product surface and active module without replacing page headings.", boundary: "No tenant, RBAC, or readiness truth." },
  { primitive: "SideNav", rule: "Owns primary product navigation, grouped sections, stable source order, scroll-aware document navigation, and collapsed navigation state.", boundary: "Current location may scroll into view and highlight, but must not reorder sections." },
  { primitive: "NavGroup and NavItem", rule: "Support section hierarchy with selected, focus, hover, disabled, and child item states.", boundary: "Selected styling must scale beyond two levels." },
  { primitive: "SearchInput", rule: "Provides search affordance for fields, filters, documentation shells, and product navigation.", boundary: "Control/Command+K shortcut labels belong only to navigation or shell search with a real focus target and result behavior." },
  { primitive: "Breadcrumb", rule: "Shows location inside a product route or documentation trail.", boundary: "Not a substitute for primary navigation." },
  { primitive: "Tabs and SegmentedNav", rule: "Switch related local views with honest segmented navigation semantics.", boundary: "Do not claim role=tab unless keyboard tab behavior is implemented." },
  { primitive: "ProductSwitcher", rule: "Moves between TCRN product surfaces when a consumer route owns that capability.", boundary: "Storybook examples remain synthetic." },
  { primitive: "Pagination", rule: "Separates long indexed lists without losing current filter or proof context.", boundary: "No remote count claim without product data." },
  { primitive: "SkipLink", rule: "Provides keyboard access past repeated shell navigation.", boundary: "Must remain visible on focus." }
];

const navigationStrategyRows = [
  { surface: "TMS dense operations", pattern: "Top bar, menu button, compact search, and expanded mega menu", rule: "Use when a product has 10+ primary navigation items or 30+ secondary directories.", boundary: "The expanded menu must show grouped primary areas and their secondary options together." },
  { surface: "Design System knowledge base", pattern: "High-contrast collapsible side navigation with multi-level bookmark links", rule: "Use for documentation, standards, governance, and proof receipts.", boundary: "The side navigation follows scroll position, supports collapse, and does not replace page headings." },
  { surface: "Focused tool surface", pattern: "Top bar with local segmented navigation", rule: "Use for a narrow tool with five or fewer peer views.", boundary: "Segmented navigation must not pretend to be product-wide navigation." },
  { surface: "Mobile or narrow product shell", pattern: "Top bar, drawer menu, and compact search", rule: "Use when primary navigation cannot fit without wrapping or crowding.", boundary: "The drawer preserves the same grouping, search, focus, and close behavior." }
];

type TmsNavigationItem = {
  id: string;
  label: string;
  description: string;
  iconName: IconName;
  selected: boolean;
};

type TmsNavigationGroup = {
  title: string;
  items: TmsNavigationItem[];
};

type TmsTaskLane = {
  title: string;
  iconName: IconName;
  items: string[];
};

type TmsHubAction = {
  label: string;
  description: string;
  iconName: IconName;
  meta: string;
};

const tmsMenuDensityRows = [
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

const tmsNavigationGroups: TmsNavigationGroup[] = [
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

const tmsTaskLanes: TmsTaskLane[] = [
  { title: "Daily operations", iconName: "check", items: ["Creators", "Channels", "Availability", "Campaign requests"] },
  { title: "Review and exceptions", iconName: "alert-triangle", items: ["Agreements", "Risk flags", "Blocked handoffs", "Owner routing"] },
  { title: "Records and proof", iconName: "database", items: ["Profiles", "Evidence queue", "Audit trail", "SLA watch"] }
];

const tmsHubActions: TmsHubAction[] = [
  { label: "Creators", description: "Open the current creator roster and pending profile checks.", iconName: "database", meta: "Daily route" },
  { label: "Availability", description: "Review schedule windows before campaign assignment.", iconName: "check", meta: "Capacity check" },
  { label: "Campaign requests", description: "Route incoming requests without leaving the selected area.", iconName: "package", meta: "Intake" },
  { label: "Agreements", description: "Jump to agreement review and owner routing.", iconName: "external-link", meta: "Review" },
  { label: "Evidence queue", description: "Inspect local proof and blocked handoff notes.", iconName: "book-open", meta: "Proof" },
  { label: "Risk flags", description: "Scan unresolved exceptions before handoff.", iconName: "alert-triangle", meta: "Exception" }
];

const tmsQuickLinks: Array<{ label: string; meta: string }> = [
  { label: "Ready for review", meta: "Pinned view" },
  { label: "Deliverables", meta: "Common route" },
  { label: "Settings", meta: "System route" },
  { label: "Permissions", meta: "Governance route" }
];

const tmsPrimaryNavCount = tmsNavigationGroups.reduce((count, group) => count + group.items.length, 0);
const tmsHubSecondaryRouteCount = tmsHubActions.length;
const tmsSecondaryDirectoryGroupCount = tmsTaskLanes.length + 1;

const knowledgeNavigationGroups = [
  {
    label: "Components",
    selected: true,
    selectedItem: "Navigation shell",
    items: ["Component family index", "Button spec and usage", "Field spec and usage", "Navigation shell", "Dialog spec and usage", "Table and work index spec"]
  },
  { label: "Style guide", selected: false, selectedItem: "Brand identity", items: ["Brand identity", "Color palette", "Text styles", "Grid system"] },
  { label: "Proof", selected: false, selectedItem: "Proof matrix", items: ["Proof matrix", "Browser proof", "Accessibility", "No-overclaim"] }
];

const styleGuideRows = [
  { subject: "Color tokens", rule: "Use semantic variables before component colors", proof: "Token contract" },
  { subject: "Typography", rule: "Reserve display scale for page headers only", proof: "Readable rhythm" },
  { subject: "Grid and density", rule: "Prefer constrained readable columns and wrapped action rows", proof: "Viewport proof" },
  { subject: "Motion", rule: "Motion is progressive and respects reduced motion", proof: "Reduced motion proof" }
];

const patternExpansionRows = [
  { pattern: "Selection controls", baseline: "Select for short stable options", escalation: "Search list for large or remote sets" },
  { pattern: "Modal validation", baseline: "Inline errors remain close to fields", escalation: "Blocking dialogs explain route ownership" },
  { pattern: "Datagrid fields", baseline: "Editable cells keep persistent labels", escalation: "Complex edits move to detail panels" },
  { pattern: "Big lists", baseline: "Filter first, then select", escalation: "Virtualized lists need keyboard proof" },
  { pattern: "Dashboards", baseline: "Show status before decoration", escalation: "Evidence links stay separate from readiness claims" }
];

function TokenSwatch({ label, token, note }: { label: string; token: string; note: string }) {
  return (
    <div className="tcrn-token-swatch">
      <span className="tcrn-token-swatch__color" style={{ background: `var(${token})` }} aria-hidden="true" />
      <strong>{label}</strong>
      <code>{token}</code>
      <Text>{note}</Text>
    </div>
  );
}

function TcrnBrandMark() {
  return (
    <img
      className="tcrn-brand-mark"
      src="tcrn-brand-mark.svg"
      alt="TCRN brand mark"
      aria-label="TCRN brand mark"
      data-storybook-only="brand-mark-prototype"
      data-component-library-status="deferred"
    />
  );
}

// storybook_only: brand lockups are synthetic review prototypes, not package component source.
function ProductLockup({ suffix, suffixClassName }: { suffix: string; suffixClassName?: string }) {
  const isLongSuffix = suffix.length > 8;
  const suffixClasses = ["tcrn-brand-wordmark__suffix", suffixClassName].filter(Boolean).join(" ");

  return (
    <div
      className={`tcrn-brand-lockup${isLongSuffix ? " tcrn-brand-lockup--long-name" : ""}`}
      data-storybook-only="brand-lockup-prototype"
      data-component-library-status="deferred"
    >
      <TcrnBrandMark />
      <span className="tcrn-brand-wordmark">
        <span className="tcrn-brand-wordmark__base">TCRN</span>
        <span className={suffixClasses}>{suffix}</span>
      </span>
    </div>
  );
}

// storybook_only: shell lockups are synthetic review prototypes, not package component source.
function ShellBrandLockup({ suffix, caption, suffixClassName }: { suffix: string; caption: string; suffixClassName?: string }) {
  const suffixClasses = ["tcrn-brand-wordmark__suffix", suffixClassName].filter(Boolean).join(" ");

  return (
    <div
      className="tcrn-shell-brand-lockup"
      data-storybook-only="shell-brand-lockup-prototype"
      data-component-library-status="deferred"
    >
      <TcrnBrandMark />
      <span className="tcrn-shell-brand-lockup__copy">
        <span className="tcrn-brand-wordmark">
          <span className="tcrn-brand-wordmark__base">TCRN</span>
          <span className={suffixClasses}>{suffix}</span>
        </span>
        <span className="tcrn-shell-brand-lockup__caption">{caption}</span>
      </span>
    </div>
  );
}

// storybook_only: dense shell IA is retained as synthetic docs/proof content, not package component source.
function TmsDenseShellDemo() {
  const selectedArea = tmsNavigationGroups.flatMap((group) => group.items).find((item) => item.selected) ?? tmsNavigationGroups[0].items[0];
  return (
    <div className="tcrn-shell-density-stack" data-tms-menu-density-standard="adaptive">
      <div
        className="tcrn-shell-demo tcrn-shell-demo--dense tcrn-shell-demo--hub"
        data-shell-pattern="dense-product-nav"
        data-shell-width="edge-to-edge"
        data-menu-density="hub"
        data-storybook-only="dense-shell-prototype"
        data-component-library-status="deferred"
      >
        <div className="tcrn-shell-demo__topbar tcrn-shell-demo__topbar--dense" data-shell-topbar="edge-to-edge">
          <IconButton
            ariaLabel="Open compact operations hub"
            aria-expanded="true"
            aria-controls="tms-shell-hub-menu"
            className="tcrn-shell-demo__menu-button"
            data-icon-only-menu="true"
            iconName="menu"
            type="button"
          />
          <ShellBrandLockup suffix="TMS" caption="Operations workspace" suffixClassName="tcrn-brand-wordmark__suffix--tms" />
          <SearchInput className="tcrn-search-input--compact" placeholder="Search menu" shortcut="auto" />
          <StatusBadge state={{ state: "local_only" }} />
        </div>
        <div className="tcrn-shell-layer" data-shell-layer="mega-menu" data-menu-layer="low-secondary">
          <div
            id="tms-shell-hub-menu"
            className="tcrn-shell-hub-menu"
            data-menu-expanded="true"
            data-menu-layout="hub"
            data-menu-density="hub"
            data-density-trigger="3-to-8-secondary-routes"
            data-secondary-route-count={tmsHubSecondaryRouteCount}
            role="region"
            aria-label="Compact TMS navigation hub"
          >
            <section className="tcrn-shell-hub-summary" aria-label="Selected low-density operations area">
              <span>Low secondary density</span>
              <strong>{selectedArea.label}</strong>
              <p>When the selected area has only a handful of secondary routes, use a visual hub before falling back to command-center density.</p>
            </section>
            <div className="tcrn-shell-hub-actions" data-directory-layout="hub-tiles">
              {tmsHubActions.map((action, actionIndex) => (
                <a key={action.label} href="#navigation-shell-spec" className="tcrn-shell-hub-action" data-selected={actionIndex === 0 ? "true" : undefined}>
                  <Icon name={action.iconName} />
                  <span>
                    <strong>{action.label}</strong>
                    <small>{action.description}</small>
                  </span>
                  <em>{action.meta}</em>
                </a>
              ))}
            </div>
            <aside className="tcrn-shell-hub-sidecar" aria-label="Density escalation rules">
              <strong>Switch density when</strong>
              <ul>
                <li>Primary navigation reaches 10+ routes.</li>
                <li>Secondary routes need task-lane grouping.</li>
                <li>Zoom or available space causes overflow.</li>
              </ul>
            </aside>
          </div>
        </div>
      </div>

      <div
        className="tcrn-shell-demo tcrn-shell-demo--dense"
        data-shell-pattern="dense-product-nav"
        data-shell-width="edge-to-edge"
        data-menu-density="command-center"
        data-storybook-only="dense-shell-prototype"
        data-component-library-status="deferred"
      >
        <div className="tcrn-shell-demo__topbar tcrn-shell-demo__topbar--dense" data-shell-topbar="edge-to-edge">
          <IconButton
            ariaLabel="Open dense navigation menu"
            aria-expanded="true"
            aria-controls="tms-shell-expanded-menu"
            className="tcrn-shell-demo__menu-button"
            data-icon-only-menu="true"
            iconName="menu"
            type="button"
          />
          <ShellBrandLockup suffix="TMS" caption="Operations workspace" suffixClassName="tcrn-brand-wordmark__suffix--tms" />
          <SearchInput className="tcrn-search-input--compact" placeholder="Search menu" shortcut="auto" />
          <StatusBadge state={{ state: "local_only" }} />
        </div>
        <div className="tcrn-shell-layer" data-shell-layer="mega-menu" data-menu-layer="10-plus-primary">
          <div
            id="tms-shell-expanded-menu"
            className="tcrn-shell-mega-menu"
            data-menu-expanded="true"
            data-menu-layout="command-center"
            data-menu-density="command-center"
            data-primary-nav-capacity="10-plus"
            data-primary-nav-count={tmsPrimaryNavCount}
            data-secondary-directory-groups={tmsSecondaryDirectoryGroupCount}
            role="region"
            aria-label="Expanded TMS navigation menu"
          >
            <nav className="tcrn-shell-domain-nav" aria-label="Primary navigation" data-primary-nav-count={tmsPrimaryNavCount}>
              {tmsNavigationGroups.map((domain) => (
                <section key={domain.title} className="tcrn-shell-domain-group" aria-label={domain.title}>
                  <strong>{domain.title}</strong>
                  <div className="tcrn-shell-domain-list">
                    {domain.items.map((item) => (
                      <button key={item.id} className="tcrn-shell-domain-item" type="button" data-selected={item.selected ? "true" : undefined}>
                        <Icon name={item.iconName} />
                        <span>
                          <strong>{item.label}</strong>
                          <small>{item.description}</small>
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </nav>
            <section className="tcrn-shell-command-board" aria-label="Selected operations area">
              <div className="tcrn-shell-command-board__header">
                <span>Selected operations area</span>
                <strong>{selectedArea.label}</strong>
                <p>This command-center layer groups 10+ primary routes by business domain, then exposes task lanes and quick entries without turning the menu into a flat directory.</p>
              </div>
              <div className="tcrn-shell-task-lanes" data-directory-layout="task-lanes">
                {tmsTaskLanes.map((lane, laneIndex) => (
                  <section key={lane.title} className="tcrn-shell-task-lane" aria-label={lane.title}>
                    <div className="tcrn-shell-task-lane__title">
                      <Icon name={lane.iconName} />
                      <strong>{lane.title}</strong>
                    </div>
                    {lane.items.map((item, itemIndex) => (
                      <a key={item} href="#navigation-shell-spec" data-selected={laneIndex === 0 && itemIndex === 0 ? "true" : undefined}>
                        {item}
                      </a>
                    ))}
                  </section>
                ))}
              </div>
            </section>
            <aside className="tcrn-shell-quick-rail" aria-label="Quick entries">
              <strong>Quick entries</strong>
              <p>Pinned, recent, and governance routes stay separate from the main IA.</p>
              <div className="tcrn-shell-quick-list">
                {tmsQuickLinks.map((item) => (
                  <a key={item.label} href="#navigation-shell-spec">
                    <span>{item.label}</span>
                    <small>{item.meta}</small>
                  </a>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

// storybook_only: documentation shell IA is retained as synthetic docs/proof content, not package component source.
function KnowledgeBaseShellDemo() {
  const selectedGroup = knowledgeNavigationGroups.find((group) => group.selected) ?? knowledgeNavigationGroups[0];

  return (
    <div className="tcrn-shell-demo tcrn-shell-demo--knowledge" data-shell-pattern="knowledge-bookmarks" data-storybook-only="knowledge-shell-prototype" data-component-library-status="deferred">
      <div className="tcrn-knowledge-shell-layout" data-standard-shell="online-docs">
        <header className="tcrn-knowledge-shell__topbar" aria-label="Knowledge base top bar">
          <div className="tcrn-knowledge-shell__brand-cell">
            <a className="tcrn-doc-brand tcrn-knowledge-shell__brand" href="#navigation-shell-spec">
              <ShellBrandLockup suffix="Design System" caption="Private local scaffold proof" suffixClassName="tcrn-brand-wordmark__suffix--design-system" />
            </a>
            <button className="tcrn-knowledge-shell__collapse-button" type="button" aria-expanded="true" aria-label="Collapse navigation">
              <Icon name="chevron-left" />
            </button>
          </div>
          <div className="tcrn-knowledge-shell__topbar-copy">
            <strong>Online documentation shell</strong>
            <span>Top bar, attached side navigation, content column, and chapter navigation stay one shell.</span>
          </div>
          <div className="tcrn-knowledge-shell__actions">
            <SearchInput className="tcrn-search-input--compact" placeholder="Search docs" shortcut="auto" />
            <StatusBadge state={{ state: "local_only" }} />
          </div>
        </header>
        <aside className="tcrn-knowledge-shell__sidebar tcrn-bookmark-panel tcrn-bookmark-panel--global" aria-label="Knowledge base bookmarks">
          <div className="tcrn-knowledge-shell__sidebar-intro">
            <strong>Current page bookmarks</strong>
            <Text>Documentation uses persistent bookmarks because the reading path is deeper than the active page.</Text>
          </div>
          <nav className="tcrn-bookmark-nav tcrn-bookmark-nav--tracked" aria-label="Multi-level bookmarks">
            {knowledgeNavigationGroups.map((group) => (
              <div key={group.label} className="tcrn-bookmark-nav__group" data-selected={group.selected ? "true" : undefined}>
                <a href="#navigation-shell-spec" data-selected={group.selected ? "true" : undefined}>
                  {group.label}
                </a>
                <div className="tcrn-bookmark-nav__children">
                  {group.items.map((item) => (
                    <a key={item} href="#navigation-shell-spec" data-selected={group.selected && item === group.selectedItem ? "true" : undefined}>
                      {item}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>
        <div className="tcrn-knowledge-shell__content" aria-label="Knowledge base content preview">
          <div className="tcrn-knowledge-preview">
            <span className="tcrn-eyebrow">Private local scaffold proof</span>
            <Heading level={3}>Navigation and shell spec</Heading>
            <Text>The knowledge-base shell standard mirrors the active TCRN documentation shell: one top bar, attached side navigation, one content column, and bottom chapter navigation.</Text>
            <div className="tcrn-knowledge-preview__panel">
              <Heading level={4}>{selectedGroup.label}</Heading>
              <Text>Selected section and subsection remain visible while readers move through nested documentation.</Text>
              <EvidenceStrip items={["scroll-aware", "multi-level", "documentation-first"]} />
            </div>
          </div>
          <nav className="tcrn-knowledge-shell__pager" aria-label="Knowledge base shell chapter navigation">
            <a href="#navigation-shell-spec">
              <Icon name="arrow-left" className="tcrn-knowledge-shell__pager-icon" />
              <span>Previous chapter</span>
              <strong>Field spec and usage</strong>
            </a>
            <a href="#navigation-shell-spec">
              <Icon name="arrow-right" className="tcrn-knowledge-shell__pager-icon" />
              <span>Next chapter</span>
              <strong>Dialog spec and usage</strong>
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
}

// storybook_only: compact shell IA is retained as synthetic docs/proof content, not package component source.
function CompactToolShellDemo() {
  return (
    <div className="tcrn-shell-demo tcrn-shell-demo--compact" data-shell-pattern="compact-tool-nav" data-storybook-only="compact-shell-prototype" data-component-library-status="deferred">
      <div className="tcrn-compact-shell" data-shell-layer="compact-tool">
        <header className="tcrn-top-bar tcrn-compact-shell__top-bar" aria-label="Compact tool shell top bar">
          <div className="tcrn-top-bar__brand tcrn-compact-shell__brand" aria-label="TCRN">
            <TcrnBrandMark />
          </div>
          <div className="tcrn-top-bar__module">Focused tool</div>
          <div className="tcrn-top-bar__actions"><StatusBadge state={{ state: "local_only" }} /></div>
        </header>
        <div className="tcrn-compact-shell__body">
          <section className="tcrn-compact-shell__summary" aria-label="Compact tool shell boundary">
            <span>Stable peer views</span>
            <strong>Review queue</strong>
            <Text>Use compact segmented navigation only when the route has a small, stable set of peer views.</Text>
          </section>
          <section className="tcrn-compact-shell__switcher" aria-label="Local tool views">
            <ModuleTabs
              items={[
                { id: "queue", label: "Queue", selected: true },
                { id: "review", label: "Review" },
                { id: "history", label: "History" }
              ]}
            />
            <div className="tcrn-compact-shell__panel" aria-label="Selected tool view preview">
              <div className="tcrn-compact-shell__metric">
                <Icon name="check" />
                <span>
                  <strong>Queue</strong>
                  <small>Ready to review</small>
                </span>
              </div>
              <div className="tcrn-compact-shell__metric">
                <Icon name="alert-triangle" />
                <span>
                  <strong>Needs proof</strong>
                  <small>Owner route pending</small>
                </span>
              </div>
              <div className="tcrn-compact-shell__metric">
                <Icon name="book-open" />
                <span>
                  <strong>History</strong>
                  <small>Local changes only</small>
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function StorybookEntryShellStrip() {
  return (
    <div className="tcrn-entry-shell-strip" data-shell-pattern="storybook-entry" data-storybook-only="entry-shell-visual">
      <div className="tcrn-entry-shell-strip__brand">
        <TcrnBrandMark />
        <span>
          <strong>Design System</strong>
          <small>Private local scaffold proof</small>
        </span>
      </div>
      <div className="tcrn-entry-shell-strip__module">
        <Icon name="book-open" />
        <span>Contract map</span>
      </div>
      <StatusBadge state={{ state: "local_only" }} />
    </div>
  );
}

export const contractStories: ContractStory[] = [
  {
    id: "welcome-governance",
    title: "Welcome and governance",
    group: "Welcome",
    description: "Design-system entry point, reader paths, and local-only claim boundaries.",
    render: () => (
      <section className="alpha-story-stack">
        <StorybookEntryShellStrip />
        <ReadbackPanel title="Start here">
          <Text>
            Use this Storybook as the contract map for shared TCRN frontend presentation. It explains which UI decisions are owned by the design system, which proof is local, and where product adoption must be proven separately.
          </Text>
        </ReadbackPanel>
        <ReadbackPanel title="Reader paths">
          <TableShell
            columns={[
              { key: "reader", label: "Reader" },
              { key: "startWith", label: "Start with" },
              { key: "thenCheck", label: "Then check" }
            ]}
            rows={[
              { reader: "Frontend implementer", startWith: "Components and patterns", thenCheck: "Accessibility and proof notes" },
              { reader: "Product reviewer", startWith: "Governance boundaries", thenCheck: "No-adoption claims" },
              { reader: "QA reviewer", startWith: "Proof matrix", thenCheck: "Browser and a11y receipts" },
              { reader: "Release coordinator", startWith: "Release and bug policy", thenCheck: "Publication route status" }
            ]}
          />
        </ReadbackPanel>
        <ReadbackPanel title="Claim boundaries">
          <div className="tcrn-guidance-grid">
            <StateView state={{ state: "local_only" }} title="Package-local proof" />
            <StateView state={{ state: "not_claimed" }} title="Consumer adoption separate" />
            <StateView state={{ state: "proof_required" }} title="Downstream evidence required" />
          </div>
          <EvidenceStrip items={["local package proof", "synthetic examples", "consumer adoption separate"]} />
        </ReadbackPanel>
      </section>
    )
  },
  {
    id: "governance-boundaries",
    title: "Governance boundaries",
    group: "Welcome",
    description: "Boundary map for design-system, product, workflow, and release ownership.",
    render: () => (
      <section className="alpha-story-stack">
        <EnvironmentBanner label="Private local checkpoint" />
        <ReadbackPanel title="Boundary map">
          <TableShell
            columns={[
              { key: "owner", label: "Owner" },
              { key: "owns", label: "Owns" },
              { key: "mustNotClaimHere", label: "Must not claim here" }
            ]}
            rows={[
              { owner: "Design System", owns: "Presentation contracts, tokens, copy-state, React primitives, Storybook examples, and proof harnesses.", mustNotClaimHere: "Product acceptance" },
              { owner: "Product repos", owns: "API clients, RBAC, routing, persistence, domain semantics, and production evidence.", mustNotClaimHere: "Package publication" },
              { owner: "Workflow", owns: "Cross-project governance, freshness checks, route coordination, and promoted knowledge.", mustNotClaimHere: "Product UI acceptance" },
              { owner: "Release route", owns: "Package publication, remote creation, version readback, and downstream release evidence.", mustNotClaimHere: "Owner Intent exceptions" }
            ]}
          />
        </ReadbackPanel>
        <InlineAlert tone="warning">External Storybook references may inform information architecture only; implementation, assets, styles, and tokens stay original to TCRN.</InlineAlert>
      </section>
    )
  },
  {
    id: "maintainers-routing",
    title: "Maintainers and routing",
    group: "Welcome",
    description: "Where each design-system question should route before implementation or proof.",
    render: () => (
      <section className="alpha-story-stack">
        <ReadbackPanel title="Routing directory">
          <TableShell
            columns={[
              { key: "question", label: "Question" },
              { key: "primaryOwner", label: "Primary owner" },
              { key: "expectedRoute", label: "Expected route" }
            ]}
            rows={[
              { question: "Visual polish or component ergonomics", primaryOwner: "Frontend Studio", expectedRoute: "Design-system implementation review" },
              { question: "Accessibility, browser, or visual proof", primaryOwner: "Verification lane", expectedRoute: "Proof receipt review" },
              { question: "Security, secrets, or external provider risk", primaryOwner: "Security review", expectedRoute: "Separate risk route" },
              { question: "Package publication or version rollout", primaryOwner: "Release route", expectedRoute: "Batch Push Gate route" },
              { question: "Product adoption in AOS or TMS", primaryOwner: "Product implementation owner", expectedRoute: "Consumer adoption route" }
            ]}
          />
        </ReadbackPanel>
        <ReadbackPanel title="Routing rule">
          <Text>When the work would mutate product repos, publish packages, create remotes, or claim acceptance, leave this Storybook route and open the owning route.</Text>
        </ReadbackPanel>
      </section>
    )
  },
  {
    id: "contribution-model",
    title: "Contribution model",
    group: "Welcome",
    description: "Admission rules for proposals and product-validated ideas entering the shared system.",
    render: () => (
      <section className="alpha-story-stack">
        <KeyValueList
          items={[
            { key: "admission", label: "Admission", value: "Admit only cross-product presentation needs with synthetic proof." },
            { key: "source", label: "Source", value: "A product-validated idea may be proposed, but product evidence must be converted into synthetic examples." },
            { key: "story-contract", label: "Story contract", value: "Each story needs purpose, anatomy, states, copy, accessibility, and proof notes." },
            { key: "proof", label: "Proof", value: "Run Storybook, browser, accessibility, visual, and no-overclaim checks." },
            { key: "promotion", label: "Promotion", value: "Consumer adoption remains downstream and route-owned." }
          ]}
        />
        <InlineAlert tone="warning">Product data, RBAC, API DTOs, and tenant truth stay outside this package.</InlineAlert>
      </section>
    )
  },
  {
    id: "release-bug-policy",
    title: "Release and bug policy",
    group: "Welcome",
    description: "How local checkpoints, package publication, consumer adoption, and bugs stay separate.",
    render: () => (
      <section className="alpha-story-stack">
        <TableShell
          columns={[
            { key: "case", label: "Case" },
            { key: "disposition", label: "Disposition" },
            { key: "blockedAction", label: "Blocked action" }
          ]}
          rows={[
            { case: "Local checkpoint", disposition: "Design-system source, stories, tests, and receipts are current locally.", blockedAction: "No package publication" },
            { case: "Package publication", disposition: "Release owner proves remote, version, tarball, changelog, and Batch Push Gate readback.", blockedAction: "No consumer adoption" },
            { case: "Consumer adoption", disposition: "AOS or TMS owner imports the package and proves route behavior in that product.", blockedAction: "No final MVP acceptance" },
            { case: "Bug or visual regression", disposition: "Fix the smallest owning surface and rerun affected proof.", blockedAction: "No release readiness shortcut" }
          ]}
        />
      </section>
    )
  },
  {
    id: "brand-identity",
    title: "Brand identity",
    group: "Style Guide",
    description: "TCRN mother-brand mark, product suffix lockups, and local draft boundaries.",
    render: () => (
      <section className="alpha-story-stack">
        <ReadbackPanel title="TCRN mother brand">
          <div className="tcrn-brand-system">
            <div className="tcrn-brand-system__symbol">
              <TcrnBrandMark />
            </div>
            <div className="tcrn-brand-system__copy">
              <Heading level={3}>TCRN mark draft</Heading>
              <Text>The current mark is a local Storybook draft for visual review. It does not claim final brand acceptance, product adoption, package publication, or downstream product UI acceptance.</Text>
              <EvidenceStrip items={["local brand draft", "mother brand only", "no red connector points", "product suffix color owned downstream"]} />
            </div>
          </div>
        </ReadbackPanel>
        <ReadbackPanel title="Logo construction rules">
          <TableShell
            columns={[
              { key: "element", label: "Element" },
              { key: "rule", label: "Rule" },
              { key: "boundary", label: "Boundary" }
            ]}
            rows={[
              { element: "Outer tiles", rule: "Four large rounded diamond tiles use iris blue, violet-blue, aqua, and slate with tight even gaps.", boundary: "No asymmetric extra pieces." },
              { element: "Center tile", rule: "The center tile uses a fifth color outside the four outer tile colors.", boundary: "Do not reuse an outer color for the center." },
              { element: "Connector points", rule: "Each point uses a white ring with a same-family inner color that differs from the tile fill.", boundary: "No red, pink, coral, or orange connector points." },
              { element: "Connector paths", rule: "Paths are white channels that create the multipolar connection motif.", boundary: "Do not make the paths look like state evidence." },
              { element: "Wordmark", rule: "TCRN is the mother-brand text. Product-type suffixes follow TCRN, and long suffixes stack below it before truncation.", boundary: "Suffix color belongs to the product surface." }
            ]}
          />
        </ReadbackPanel>
        <ReadbackPanel title="Product lockups">
          <div className="tcrn-brand-lockups" aria-label="TCRN product lockup examples">
            <ProductLockup suffix="AOS" suffixClassName="tcrn-brand-wordmark__suffix--aos" />
            <ProductLockup suffix="TMS" suffixClassName="tcrn-brand-wordmark__suffix--tms" />
            <ProductLockup suffix="Design System" suffixClassName="tcrn-brand-wordmark__suffix--design-system" />
          </div>
          <Text>Product suffix typography follows the mother-brand wordmark rhythm. Long product suffixes stack below TCRN; suffix color is product-owned and must not change the TCRN symbol colors.</Text>
        </ReadbackPanel>
      </section>
    )
  },
  {
    id: "color-palette",
    title: "Color palette",
    group: "Style Guide",
    description: "Semantic color roles for canvas, panel, focus, border, and state surfaces.",
    render: () => (
      <section className="alpha-story-stack">
        <ReadbackPanel title="Brand palette">
          <div className="tcrn-token-swatch-grid">
            <TokenSwatch label="Primary brand" token="--tcrn-color-brand-primary" note="Use for TCRN identity, selected navigation, and creator-channel emphasis." />
            <TokenSwatch label="Primary brand background" token="--tcrn-color-brand-primary-bg" note="Use for quiet selected surfaces and iris-blue brand callouts." />
            <TokenSwatch label="Secondary brand" token="--tcrn-color-brand-secondary" note="Use for system connection, informational support, charts, and secondary emphasis." />
            <TokenSwatch label="Secondary brand background" token="--tcrn-color-brand-secondary-bg" note="Use for quiet aqua informational surfaces." />
            <TokenSwatch label="Accent brand" token="--tcrn-color-brand-accent" note="Use rose-coral sparingly for creator warmth; never use as state truth." />
            <TokenSwatch label="Neutral brand" token="--tcrn-color-brand-neutral" note="Use for dense structure, muted metadata, and low-emphasis support." />
          </div>
          <TableShell
            columns={[
              { key: "family", label: "Family" },
              { key: "role", label: "Role" },
              { key: "guardrail", label: "Guardrail" }
            ]}
            rows={[
              { family: "Primary", role: "Iris-blue identity, selected navigation, creator-channel emphasis", guardrail: "Do not use as proof state." },
              { family: "Secondary", role: "Aqua system connection, informational support, and charts", guardrail: "Do not compete with primary actions." },
              { family: "Accent", role: "Rose-coral highlights and onboarding warmth", guardrail: "Never use as readiness or error truth." },
              { family: "Neutral", role: "Dense operational structure and muted metadata", guardrail: "Do not replace disabled text color." },
              { family: "State", role: "Ready, warning, blocked, unavailable, and unknown status", guardrail: "State colors are not brand colors." }
            ]}
          />
          <EvidenceStrip items={["brand primary", "secondary support", "accent sparingly", "state colors are not brand"]} />
        </ReadbackPanel>
        <ReadbackPanel title="Color role matrix">
          <div className="tcrn-token-swatch-grid">
            <TokenSwatch label="Canvas" token="--tcrn-color-surface-canvas" note="Use for page background and quiet space." />
            <TokenSwatch label="Panel" token="--tcrn-color-surface-panel" note="Use for cards, drawers, dialogs, and doc surfaces." />
            <TokenSwatch label="Muted surface" token="--tcrn-color-surface-muted" note="Use for secondary chips, nav states, and low-emphasis fills." />
            <TokenSwatch label="Focus ring" token="--tcrn-color-focus-ring" note="Use only for visible keyboard focus and selected navigation." />
            <TokenSwatch label="Ready state" token="--tcrn-color-state-ready-bg" note="Pair state color with a readable status label." />
            <TokenSwatch label="Blocked state" token="--tcrn-color-state-blocked-bg" note="Use for blocked or destructive states with explanatory copy." />
          </div>
          <TableShell
            columns={[
              { key: "role", label: "Role" },
              { key: "usage", label: "Usage" },
              { key: "guardrail", label: "Guardrail" }
            ]}
            rows={[
              { role: "Canvas", usage: "Page background and non-interactive space", guardrail: "Must not carry state meaning." },
              { role: "Panel", usage: "Cards, drawers, dialogs, and doc surfaces", guardrail: "Avoid card-in-card nesting." },
              { role: "Border", usage: "Structure, separation, and neighboring controls", guardrail: "Do not use color alone for state." },
              { role: "Focus", usage: "Keyboard focus and selected navigation", guardrail: "Never suppress visible focus." },
              { role: "State", usage: "Ready, warning, blocked, and unknown status", guardrail: "Always pair color with text." }
            ]}
          />
        </ReadbackPanel>
        <ReadbackPanel title="Theme parity">
          <Text>Light and dark themes must keep the same semantic token names. A dark override changes values only; it must not fork component behavior or readiness copy.</Text>
        </ReadbackPanel>
        <EvidenceStrip items={["semantic tokens", "dark override", "state-safe color", "contrast proof"]} />
      </section>
    )
  },
  {
    id: "text-styles",
    title: "Text styles",
    group: "Style Guide",
    description: "Type scale, paragraph rhythm, heading hierarchy, and localized copy density.",
    render: () => (
      <section className="alpha-story-stack">
        <ReadbackPanel title="Type hierarchy and rhythm">
          <TableShell
            columns={[
              { key: "level", label: "Level" },
              { key: "usage", label: "Usage" },
              { key: "constraint", label: "Constraint" }
            ]}
            rows={[
              { level: "Page title", usage: "One per documentation page", constraint: "24px before first section; no nested card hero treatment" },
              { level: "Story title", usage: "Section-level contract heading", constraint: "8px to description; keep close to description" },
              { level: "Panel heading", usage: "Compact workbench panels", constraint: "10px to panel content; avoid oversized display text" },
              { level: "Body copy", usage: "Rules, examples, and proof notes", constraint: "12px between paragraphs; localize before display" },
              { level: "Microcopy", usage: "Hints, disabled reasons, and proof notes", constraint: "4px to owning control; never concatenate into labels" }
            ]}
          />
        </ReadbackPanel>
        <ReadbackPanel title="Font family contract">
          <TableShell
            columns={[
              { key: "script", label: "Script" },
              { key: "asset", label: "Redistributable font asset" },
              { key: "license", label: "License boundary" }
            ]}
            rows={[
              {
                script: "Latin",
                asset: "Inter",
                license: "OFL; may be packaged, self-hosted, or bundled with license notice."
              },
              {
                script: "Simplified Chinese",
                asset: "Noto Sans CJK SC / Source Han Sans SC",
                license: "OFL; use these for product-owned CJK font assets."
              },
              {
                script: "Japanese",
                asset: "Noto Sans CJK JP / Source Han Sans JP",
                license: "OFL; use these for product-owned Japanese font assets."
              },
              {
                script: "Korean",
                asset: "Noto Sans CJK KR / Source Han Sans KR",
                license: "OFL; use these for product-owned Korean font assets."
              },
              {
                script: "Mono",
                asset: "Liberation Mono",
                license: "OFL; use this for product-owned monospace assets."
              }
            ]}
          />
          <TableShell
            columns={[
              { key: "locale", label: "Locale" },
              { key: "fallback", label: "Platform fallback names" },
              { key: "rule", label: "Rule" }
            ]}
            rows={[
              {
                locale: "en, fr",
                fallback: "Avenir Next, Helvetica Neue, Arial",
                rule: "Platform font names are CSS fallback references only."
              },
              {
                locale: "zh-CN",
                fallback: "PingFang SC, Microsoft YaHei, Heiti SC",
                rule: "Do not copy, convert, host, bundle, or redistribute platform fonts."
              },
              {
                locale: "ja",
                fallback: "Hiragino Sans, Yu Gothic, Meiryo",
                rule: "Do not claim platform fallbacks as TCRN font assets."
              },
              {
                locale: "ko",
                fallback: "Apple SD Gothic Neo, Malgun Gothic",
                rule: "Fallbacks render only when already available on the user's licensed device."
              },
              {
                locale: "mono",
                fallback: "SFMono-Regular, Consolas, Menlo",
                rule: "System monospace names are fallback references only."
              }
            ]}
          />
          <Text>TCRN-owned packages may distribute only fonts with explicit redistribution rights. Platform font names may remain in CSS fallback stacks, but TCRN must not copy, convert, self-host, bundle, or publish those font files.</Text>
        </ReadbackPanel>
        <ReadbackPanel title="Type scale tokens">
          <TableShell
            columns={[
              { key: "token", label: "Token" },
              { key: "size", label: "Size and line" },
              { key: "usage", label: "Usage" }
            ]}
            rows={[
              { token: "Page title", size: "28px / 1.3 / 700", usage: "One page title per route or documentation page." },
              { token: "Section title", size: "18px / 1.25 / 700", usage: "Story titles, major panels, and route sections." },
              { token: "Body copy", size: "13px / 1.45 / 400", usage: "Rules, descriptions, table cells, and proof notes." },
              { token: "Control text", size: "13px / 1.2 / 600", usage: "Buttons, tabs, labels, and compact control text." },
              { token: "Caption", size: "11px / 1.35 / 600", usage: "Metadata, helper text, and evidence strip context." },
              { token: "Code text", size: "12px / 1.4 / mono", usage: "Token names, ids, commands, and technical readback." }
            ]}
          />
          <div className="tcrn-type-scale-demo" aria-label="Type scale specimen">
            <p className="tcrn-type-scale-demo__page">Page title / 28px</p>
            <p className="tcrn-type-scale-demo__section">Section title / 18px</p>
            <p className="tcrn-type-scale-demo__body">Body copy / 13px keeps dense product surfaces readable without becoming tiny.</p>
            <p className="tcrn-type-scale-demo__caption">Caption / 11px is reserved for metadata and helper context.</p>
            <code className="tcrn-type-scale-demo__code">--tcrn-type-family-mono</code>
          </div>
        </ReadbackPanel>
        <div className="tcrn-typography-sample">
          <Heading level={3}>Localized text must wrap without changing scale.</Heading>
          <Text>Use fixed type roles and let containers wrap. Do not scale text by viewport width; long translated strings must remain readable without overlapping controls.</Text>
        </div>
        <EvidenceStrip items={["paragraph rhythm", "localized wrapping", "font licensing tiers", "no viewport font scaling"]} />
      </section>
    )
  },
  {
    id: "grid-system",
    title: "Grid system",
    group: "Style Guide",
    description: "Responsive layout rules for readable docs, dense work surfaces, and wrapped actions.",
    render: () => (
      <section className="alpha-story-stack">
        <ReadbackPanel title="Layout density matrix">
          <TableShell
            columns={[
              { key: "surface", label: "Surface" },
              { key: "desktop", label: "Desktop rule" },
              { key: "mobile", label: "Mobile rule" }
            ]}
            rows={[
              { surface: "Documentation page", desktop: "Readable content column with sticky side navigation.", mobile: "Single column; navigation appears before content." },
              { surface: "Workbench", desktop: "Dense scanning is allowed when rows remain legible.", mobile: "Stack rows into cards with labels." },
              { surface: "Action row", desktop: "Actions wrap with visible gaps.", mobile: "Primary and secondary actions remain separated." },
              { surface: "Detail panel", desktop: "Drawer or side panel must not compress the table to unreadable width.", mobile: "Use full-width panel or route-level page." }
            ]}
          />
        </ReadbackPanel>
        <div className="tcrn-spec-grid">
          <StateView state={{ state: "local_only" }} title="Readable column" />
          <StateView state={{ state: "fixture_only" }} title="Adaptive grid" />
          <StateView state={{ state: "proof_required" }} title="Overflow proof" />
        </div>
        <ReadbackPanel title="Spacing floor">
          <Text>Cards, panels, tables, and action rows must preserve visible gaps across desktop, tablet, and mobile viewports. Zero-spacing joins are regressions, even when borders remain visible.</Text>
        </ReadbackPanel>
      </section>
    )
  },
  {
    id: "icons-motion",
    title: "Icons and motion",
    group: "Style Guide",
    description: "Icon-only controls, motion boundaries, tooltip naming, and reduced-motion expectations.",
    render: () => (
      <section className="alpha-story-stack">
        <ReadbackPanel title="Icon library contract">
          <div
            data-icon-library-source="lucide-react"
            data-icon-library-wrapper="@tcrn/ui-react/Icon"
            data-icon-library-license="ISC"
            data-icon-brand-boundary="not-brand-identity"
          >
            <TableShell
              columns={[
                { key: "aspect", label: "Aspect" },
                { key: "standard", label: "Standard" },
                { key: "boundary", label: "Boundary" }
              ]}
              rows={[
                {
                  aspect: "Source library",
                  standard: "Lucide React is consumed inside @tcrn/ui-react and exposed through Icon.",
                  boundary: "Downstream UI imports TCRN icon primitives instead of importing lucide-react directly."
                },
                {
                  aspect: "License readback",
                  standard: "Lucide is recorded with an ISC license readback for local commercial-use review.",
                  boundary: "This is a license receipt, not legal advice or package publication."
                },
                {
                  aspect: "Brand boundary",
                  standard: "Icons support commands, navigation, status, and functional affordances.",
                  boundary: "Do not use general-purpose icons as TCRN logos, product marks, or proof-state truth."
                }
              ]}
            />
            <ul className="tcrn-icon-sample-grid" aria-label="Approved icon names">
              {tcrnIconNames.map((iconName) => (
                <li key={iconName} className="tcrn-icon-sample">
                  <Icon name={iconName} />
                  <code title={iconName}>{iconName}</code>
                </li>
              ))}
            </ul>
          </div>
        </ReadbackPanel>
        <ReadbackPanel title="Interaction affordance matrix">
          <TableShell
            columns={[
              { key: "topic", label: "Topic" },
              { key: "rule", label: "Rule" },
              { key: "blocked", label: "Blocked" }
            ]}
            rows={[
              { topic: "Icon-only action", rule: "Requires accessible name, visible focus, and tooltip for unfamiliar icons.", blocked: "Unnamed icon action" },
              { topic: "Tooltip", rule: "Names unfamiliar icons without replacing visible labels.", blocked: "Tooltip as the only label" },
              { topic: "Loading motion", rule: "May signal progress but must not hide status or proof copy.", blocked: "Motion-only state" },
              { topic: "Reduced motion", rule: "Must preserve comprehension with animation disabled.", blocked: "Blocking animation gate" },
              { topic: "Overlay transition", rule: "Must not delay focus entry, Escape close, or focus return proof.", blocked: "Focus hidden by animation" }
            ]}
          />
        </ReadbackPanel>
        <ReadbackPanel title="Motion examples">
          <div className="tcrn-motion-demo-grid">
            <div className="tcrn-motion-demo tcrn-motion-demo--instant">
              <h3>Instant feedback</h3>
              <Text>80ms ease-out for press, focus, and tiny affordance feedback.</Text>
              <span className="tcrn-motion-demo__track" aria-hidden="true">
                <span className="tcrn-motion-demo__dot" />
              </span>
            </div>
            <div className="tcrn-motion-demo tcrn-motion-demo--standard">
              <h3>Standard transition</h3>
              <Text>160ms ease for hover, selected state, and lightweight surface changes.</Text>
              <span className="tcrn-motion-demo__track" aria-hidden="true">
                <span className="tcrn-motion-demo__dot" />
              </span>
            </div>
            <div className="tcrn-motion-demo tcrn-motion-demo--emphasis">
              <h3>Emphasis transition</h3>
              <Text>220ms emphasized easing for drawers, dialogs, and high-attention changes.</Text>
              <span className="tcrn-motion-demo__track" aria-hidden="true">
                <span className="tcrn-motion-demo__dot" />
              </span>
            </div>
            <div className="tcrn-motion-demo tcrn-motion-demo--reduced">
              <h3>Reduced motion fallback</h3>
              <Text>Reduced motion preserves layout and copy when animation is unavailable.</Text>
              <span className="tcrn-motion-demo__track" aria-hidden="true">
                <span className="tcrn-motion-demo__dot" />
              </span>
            </div>
          </div>
          <TableShell
            columns={[
              { key: "token", label: "Motion token" },
              { key: "duration", label: "Duration" },
              { key: "allowedUse", label: "Allowed use" }
            ]}
            rows={[
              { token: "--tcrn-motion-instant", duration: "80ms ease-out", allowedUse: "Press and focus feedback only." },
              { token: "--tcrn-motion-standard", duration: "160ms ease", allowedUse: "Hover, selected navigation, and lightweight state changes." },
              { token: "--tcrn-motion-emphasis", duration: "220ms emphasized easing", allowedUse: "Drawer and dialog entry when focus remains immediate." },
              { token: "--tcrn-motion-loading-loop", duration: "900ms linear", allowedUse: "Visible loading indicators paired with status copy." },
              { token: "--tcrn-motion-skeleton-loop", duration: "1400ms ease-in-out", allowedUse: "Skeleton placeholders that reserve layout without implying readiness." },
              { token: "--tcrn-motion-progress-loop", duration: "1200ms ease-in-out", allowedUse: "Indeterminate progress for ongoing local checks." },
              { token: "--tcrn-motion-reduced-duration", duration: "0.01ms", allowedUse: "Reduced-motion override for every animated example." }
            ]}
          />
        </ReadbackPanel>
        <ReadbackPanel title="Loading and progress examples">
          <div className="tcrn-loading-motion-grid">
            <div className="tcrn-loading-card" role="status">
              <div className="tcrn-loading-card__row">
                <span className="tcrn-loading-spinner" aria-hidden="true" />
                <div className="tcrn-loading-copy">
                  <h3>Loading state</h3>
                  <Text>Spinner motion is paired with visible copy and never replaces status text.</Text>
                </div>
              </div>
            </div>
            <div className="tcrn-loading-card">
              <h3>Skeleton preview</h3>
              <Text>Skeletons reserve layout while content is unavailable; they do not imply readiness.</Text>
              <div className="tcrn-loading-skeleton" aria-hidden="true">
                <span className="tcrn-loading-skeleton__line" />
                <span className="tcrn-loading-skeleton__line tcrn-loading-skeleton__line--medium" />
                <span className="tcrn-loading-skeleton__line tcrn-loading-skeleton__line--short" />
              </div>
            </div>
            <div className="tcrn-loading-card">
              <h3>Progress feedback</h3>
              <Text>Indeterminate progress names the work being checked and keeps owner proof separate.</Text>
              <div className="tcrn-loading-progress" aria-hidden="true">
                <span className="tcrn-loading-progress__bar" />
              </div>
            </div>
            <div className="tcrn-loading-card">
              <h3>State transition</h3>
              <Text>Copy changes first; motion only softens the surface update.</Text>
              <div className="tcrn-loading-status">
                <span className="tcrn-loading-status__chip tcrn-loading-status__chip--active">Proof required</span>
                <Icon name="arrow-right" className="tcrn-loading-status__arrow" />
                <span className="tcrn-loading-status__chip">Blocked</span>
              </div>
            </div>
          </div>
        </ReadbackPanel>
        <InlineAlert tone="warning">Motion may decorate state changes, but it cannot be the only evidence that a state changed.</InlineAlert>
      </section>
    )
  },
  {
    id: "global-states",
    title: "Global states",
    group: "Style Guide",
    description: "State surfaces for ready, blocked, unknown, unavailable, and external proof-needed UI.",
    render: () => (
      <section className="alpha-story-stack">
        <div className="tcrn-guidance-grid">
          <StateView state={{ state: "ready" }} />
          <StateView state={{ state: "blocked" }} />
          <StateView state={{ state: "unknown" }} />
          <StateView state={{ state: "unavailable" }} />
          <StateView state={{ state: "external_proof_needed" }} />
        </div>
        <ReadbackPanel title="State authority matrix">
          <TableShell
            columns={[
              { key: "state", label: "State" },
              { key: "allowed", label: "Allowed display" },
              { key: "blocked", label: "Blocked display" }
            ]}
            rows={[
              { state: "Ready", allowed: "Only after owning route proof exists.", blocked: "Ready from local fixture" },
              { state: "Local proof only", allowed: "Package-local component proof.", blocked: "Product-ready wording" },
              { state: "Proof required", allowed: "Explain the missing proof.", blocked: "Silent disabled state" },
              { state: "Blocked", allowed: "Name the owning route or review.", blocked: "Hidden owner action" },
              { state: "Unknown", allowed: "Fail closed and ask for proof.", blocked: "Implied readiness" }
            ]}
          />
        </ReadbackPanel>
      </section>
    )
  },
  {
    id: "copy-creation-rules",
    title: "Copy creation rules",
    group: "Style Guide",
    description: "Human-readable, localizable, and no-overclaim copy rules for shared UI.",
    render: () => (
      <section className="alpha-story-stack">
        <ReadbackPanel title="Copy workflow">
          <TableShell
            columns={[
              { key: "step", label: "Step" },
              { key: "rule", label: "Rule" },
              { key: "blocked", label: "Blocked" }
            ]}
            rows={[
              { step: "Source state", rule: "Map raw state to copy-state vocabulary before display.", blocked: "Raw enum label" },
              { step: "Human label", rule: "Use a short localized label plus a clear description.", blocked: "Status code as copy" },
              { step: "Evidence scope", rule: "Name whether proof is local, external, product, or release-owned.", blocked: "Product acceptance claim" },
              { step: "Disabled reason", rule: "Expose reasons through assistive text without appending to button labels.", blocked: "Concatenated label" },
              { step: "Translation", rule: "Every non-variable UI string needs zh-CN, en, ja, ko, and fr coverage.", blocked: "English leak in localized route" }
            ]}
          />
        </ReadbackPanel>
        <ReadbackPanel title="Forbidden copy patterns">
          <EvidenceStrip items={["raw enum labels", "release proof claims", "product acceptance claims", "external readiness claims"]} />
        </ReadbackPanel>
      </section>
    )
  },
  {
    id: "tokens-copy-state",
    title: "Tokens and copy state",
    group: "Foundations",
    description: "Semantic tokens and fail-closed copy vocabulary for local internal-alpha proof.",
    render: () => (
      <section className="alpha-story-stack">
        <ReadbackPanel title="State vocabulary">
          <div className="tcrn-status-cloud">
            <StatusBadge state={{ state: "ready" }} />
            <StatusBadge state={{ state: "local_only" }} />
            <StatusBadge state={{ state: "fixture_only" }} />
            <StatusBadge state={{ state: "external_proof_needed" }} />
            <StatusBadge state={{ state: "proof_required" }} />
            <StatusBadge state={{ state: "blocked" }} />
            <StatusBadge state={{ state: "not_claimed" }} />
            <StatusBadge state={{ state: "future_external_ready" }} />
          </div>
        </ReadbackPanel>
        <ReadbackPanel title="Fail-closed presentation">
          <StateView state={{ state: "future_external_ready" }} />
          <StateView state={{ state: "external_proof_needed" }} />
        </ReadbackPanel>
      </section>
    )
  },
  {
    id: "i18n-theme-contract",
    title: "I18n and theme contract",
    group: "Foundations",
    description: "Required locales and dark theme token override for local contract proof.",
    render: () => (
      <section className="alpha-story-stack">
        <ReadbackPanel title="I18n standard">
          <Text>
            Default locale {tcrnDefaultLocale}; fallback locale {tcrnFallbackLocale}; raw enum labels are blocked before UI display.
          </Text>
          <div className="tcrn-locale-grid">
            {tcrnLocaleMetadata.map((metadata) => {
              const presentation = presentCopyState({ state: "not_claimed" }, metadata.locale);
              return (
                <div key={metadata.locale} className="tcrn-locale-card" lang={metadata.locale}>
                  <strong>{metadata.nativeName}</strong>
                  <span>{metadata.englishName}</span>
                  <Badge>{metadata.locale}</Badge>
                  <Badge>{presentation.label}</Badge>
                </div>
              );
            })}
          </div>
          <Text>
            Supported locales: {tcrnI18nContract.supportedLocales.join(", ")}.
          </Text>
        </ReadbackPanel>
        <section className="tcrn-theme-preview" data-tcrn-theme="dark" aria-label="Dark theme token preview">
          <Heading level={3}>Dark theme preview</Heading>
          <Text>Dark mode is a token override, not a separate component fork.</Text>
          <StatusBadge state={{ state: "proof_required" }} />
          <StateView state={{ state: "proof_required" }} />
          <div className="tcrn-action-row">
            <Button variant="primary">Inspect tokens</Button>
            <Button disabled disabledReason="Requires product adoption route">Publish theme</Button>
          </div>
        </section>
      </section>
    )
  },
  {
    id: "copy-guidelines",
    title: "Copy guidelines",
    group: "Foundations",
    description: "State copy rules for no-overclaim UI and localized product-facing text.",
    render: () => (
      <section className="alpha-story-stack">
        <ReadbackPanel title="Allowed language">
          <TableShell
            columns={[
              { key: "rule", label: "Rule" },
              { key: "example", label: "Example" },
              { key: "reason", label: "Reason" }
            ]}
            rows={[
              { rule: "Use human labels", example: "External proof needed", reason: "Readable and localizable" },
              { rule: "Name the proof scope", example: "Local proof only", reason: "Prevents downstream overclaim" },
              { rule: "Keep disabled reasons accessible", example: "Requires product adoption route", reason: "Explains blocked controls" }
            ]}
          />
        </ReadbackPanel>
        <ReadbackPanel title="Blocked language">
          <EvidenceStrip items={["raw enum labels", "release proof claims", "product acceptance claims", "external readiness claims"]} />
        </ReadbackPanel>
      </section>
    )
  },
  {
    id: "component-family-index",
    title: "Component family index",
    group: "Components",
    description: "Initial TCRN component families and the spec/usage/state pattern each component should grow into.",
    render: () => (
      <section className="alpha-story-stack">
        <ReadbackPanel title="Recommended component families">
          <TableShell
            columns={[
              { key: "family", label: "Component family" },
              { key: "components", label: "Recommended components" },
              { key: "scope", label: "Scope" },
              { key: "status", label: "Component status" }
            ]}
            rows={componentFamilyRows}
          />
        </ReadbackPanel>
        <ReadbackPanel title="Package-backed component API">
          <div
            data-component-library-parity="package-backed"
            data-component-source="@tcrn/ui-react"
            data-token-source="@tcrn/ui-tokens"
            data-copy-state-source="@tcrn/ui-copy-state"
          >
            <TableShell
              columns={[
                { key: "exportName", label: "Public export" },
                { key: "source", label: "Source package" },
                { key: "status", label: "Library status" }
              ]}
              rows={componentLibraryPublicComponentNames.map((exportName) => ({
                exportName,
                source: "@tcrn/ui-react",
                status: <StatusBadge state={{ state: "local_only" }} />
              }))}
            />
          </div>
        </ReadbackPanel>
        <ReadbackPanel title="Package utility exports">
          <TableShell
            columns={[
              { key: "exportName", label: "Public export" },
              { key: "source", label: "Source package" },
              { key: "status", label: "Library status" }
            ]}
            rows={componentLibraryPublicUtilityNames.map((exportName) => ({
              exportName,
              source: "@tcrn/ui-react",
              status: <StatusBadge state={{ state: "local_only" }} />
            }))}
          />
        </ReadbackPanel>
        <ReadbackPanel title="Storybook-only prototypes">
          <TableShell
            columns={[
              { key: "helper", label: "Prototype" },
              { key: "scope", label: "Scope" },
              { key: "status", label: "Disposition" }
            ]}
            rows={componentLibraryDeferredPrototypeNames.map((prototypeName) => {
              const prototype = storybookOnlyPrototypeRows.find((row) => row.helper.includes(prototypeName));
              return {
                helper: prototypeName,
                scope: prototype?.scope ?? "Synthetic Storybook proof surface",
                status: prototype?.status ?? "Storybook prototype; not a component library export"
              };
            })}
          />
        </ReadbackPanel>
        <ReadbackPanel title="Current local story coverage">
          <WorkIndex rows={componentStoryRows} />
        </ReadbackPanel>
        <DetailInspector
          title="Story template"
          items={[
            { key: "spec", label: "Spec", value: "purpose, anatomy, states, accessibility expectation" },
            { key: "usage", label: "Usage", value: "props, disabled behavior, empty/error examples, proof notes" },
            { key: "copy", label: "Copy", value: "localized labels, blocked terms, disabled reasons" }
          ]}
        />
        <InlineAlert tone="warning">Navigation shell components are first-class component contracts, not only page patterns.</InlineAlert>
      </section>
    )
  },
  {
    id: "button-spec-usage",
    title: "Button spec and usage",
    group: "Components",
    description: "Button variants, disabled reason behavior, and accessible blocked actions.",
    render: () => (
      <section className="alpha-story-stack">
        <ReadbackPanel title="Spec">
          <div className="tcrn-action-row">
            <Button variant="primary">Primary action</Button>
            <Button>Secondary action</Button>
            <Button variant="quiet">Quiet action</Button>
            <Button variant="danger">Destructive action</Button>
          </div>
        </ReadbackPanel>
        <ReadbackPanel title="Disabled usage">
          <Text>Visible button labels stay clean; disabled reasons are exposed through title and assistive text.</Text>
          <div className="tcrn-action-row">
            <Button disabled disabledReason="Requires owning route approval">Apply</Button>
            <Button>Focus target</Button>
          </div>
        </ReadbackPanel>
      </section>
    )
  },
  {
    id: "field-spec-usage",
    title: "Field spec and usage",
    group: "Components",
    description: "Field labeling, hints, errors, disabled controls, and aria relationships.",
    render: () => (
      <section className="tcrn-form-stack">
        <Field label="Search fixture" hint="Hint text stays visible in weak emphasis; ordinary search fields keep the search icon but do not show a keyboard shortcut.">
          <SearchInput placeholder="Search components" />
        </Field>
        <Field label="Navigation shell search fixture" hint="Shortcut labels are allowed only for navigation or shell search with a real focus target and visible result list.">
          <SearchInput placeholder="Search docs" shortcut="auto" />
        </Field>
        <Field label="State" hint="Disabled controls keep visible labels clean.">
          <Select
            defaultValue="proof_required"
            disabled
            disabledReason="State selection is unavailable in this synthetic fixture"
            options={[
              { value: "local_only", label: "Local proof only" },
              { value: "proof_required", label: "Proof required" }
            ]}
          />
        </Field>
        <Field label="Notes" hint="Textarea follows the same disabled reason contract as other form controls.">
          <Textarea
            defaultValue="Consumer-owned notes remain read-only in this fixture."
            disabled
            disabledReason="Notes editing is unavailable in this synthetic fixture"
          />
        </Field>
        <Field label="Text input">
          <Input value="Synthetic only" readOnly />
        </Field>
        <Field label="Short code" hint="Short fields keep measured width for codes, counts, and compact filters.">
          <Input className="tcrn-input--short" placeholder="A-102" maxLength={6} />
        </Field>
        <Field label="Invalid state" hint="Hint text is visible and retained in the DOM." error="Synthetic validation message">
          <Input value="Blocked local fixture" readOnly aria-invalid />
        </Field>
        <ReadbackPanel title="Field width rules">
          <TableShell
            columns={[
              { key: "pattern", label: "Pattern" },
              { key: "width", label: "Width" },
              { key: "usage", label: "Usage" }
            ]}
            rows={[
              { pattern: "Search input", width: "Full width", usage: "Search and prose-like filters keep the row width." },
              { pattern: "Short input", width: "Measured width", usage: "Codes, counts, compact filters, and bounded values stay short." }
            ]}
          />
        </ReadbackPanel>
        <ReadbackPanel title="Search shortcut rules">
          <TableShell
            columns={[
              { key: "surface", label: "Surface" },
              { key: "shortcut", label: "Shortcut" },
              { key: "usage", label: "Usage" }
            ]}
            rows={[
              { surface: "Ordinary search field", shortcut: "No shortcut label", usage: "Use inside forms, filters, and local field groups; keep the search icon only." },
              { surface: "Navigation or shell search", shortcut: "Shortcut allowed", usage: "Show Control/Command+K only when the shell owns focus behavior and visible search results." }
            ]}
          />
        </ReadbackPanel>
      </section>
    )
  },
  {
    id: "navigation-shell-spec",
    title: "Navigation and shell spec",
    group: "Components",
    description: "Top-bar, side navigation, breadcrumbs, tabs, pagination, and product-switcher contracts for TCRN shells.",
    render: () => (
      <section className="alpha-story-stack">
        <ReadbackPanel title="Shell selection matrix">
          <Text>Navigation shell choice follows product information architecture, not a single shared layout.</Text>
          <TableShell
            columns={[
              { key: "surface", label: "Surface" },
              { key: "pattern", label: "Pattern" },
              { key: "rule", label: "Rule" },
              { key: "boundary", label: "Boundary" }
            ]}
            rows={navigationStrategyRows}
          />
        </ReadbackPanel>
        <ReadbackPanel title="TMS dense operations shell">
          <Text>Large operational products need a top navigation surface with a menu button, compact search, and an expanded menu that exposes grouped primary and secondary options together.</Text>
          <TableShell
            columns={[
              { key: "density", label: "Density" },
              { key: "trigger", label: "Trigger" },
              { key: "pattern", label: "Pattern" },
              { key: "boundary", label: "Boundary" }
            ]}
            rows={tmsMenuDensityRows}
          />
          <TmsDenseShellDemo />
        </ReadbackPanel>
        <ReadbackPanel title="Knowledge base bookmark shell">
          <Text>Design System and other knowledge-base products need side navigation with multi-level bookmarks because the reader path is nested and scroll-driven.</Text>
          <KnowledgeBaseShellDemo />
        </ReadbackPanel>
        <ReadbackPanel title="Compact tool shell">
          <Text>Small tools may use local segmented navigation, but only when the number of peer views stays small and stable.</Text>
          <CompactToolShellDemo />
        </ReadbackPanel>
        <ReadbackPanel title="Navigation component contracts">
          <Breadcrumb
            items={[
              { id: "home", label: "TCRN" },
              { id: "components", label: "Components", selected: true }
            ]}
          />
          <div className="tcrn-nav-component-preview">
            <ProductSwitcher
              items={[
                { id: "aos", label: "TCRN AOS" },
                { id: "tms", label: "TCRN TMS", selected: true },
                { id: "design-system", label: "TCRN Design System" }
              ]}
            />
            <div className="tcrn-package-nav-proof" data-package-backed-navigation-proof="true">
              <div className="tcrn-package-nav-proof__skip">
                <SkipLink href="#navigation-shell-spec">Skip to navigation shell content</SkipLink>
              </div>
              <SideNav label="Package-backed side navigation">
                <NavGroup label="Components" selected>
                  <NavItem href="#component-family-index" iconName="package">Component family index</NavItem>
                  <NavItem href="#navigation-shell-spec" iconName="panel-left-open" selected>Navigation shell</NavItem>
                  <NavItem href="#dialog-spec-usage" iconName="external-link">Dialog spec</NavItem>
                </NavGroup>
                <NavGroup label="Proof">
                  <NavItem href="#proof-matrix" iconName="book-open">Proof matrix</NavItem>
                  <NavItem href="#blocked-actions" iconName="alert-triangle" disabled disabledReason="Proof route is not in this component page">Blocked actions</NavItem>
                </NavGroup>
              </SideNav>
              <SegmentedNav
                items={[
                  { id: "contracts", label: "Contracts", selected: true },
                  { id: "usage", label: "Usage" },
                  { id: "proof", label: "Proof" }
                ]}
              />
            </div>
          </div>
          <TableShell
            columns={[
              { key: "primitive", label: "Primitive" },
              { key: "rule", label: "Rule" },
              { key: "boundary", label: "Boundary" }
            ]}
            rows={navigationComponentRows}
          />
        </ReadbackPanel>
        <ReadbackPanel title="Pagination and skip-link boundary">
          <Text>Pagination and skip links belong to shared navigation primitives because they preserve orientation, keyboard access, and proof context across long surfaces.</Text>
          <Pagination label="Synthetic component pages" />
        </ReadbackPanel>
      </section>
    )
  },
  {
    id: "dialog-spec-usage",
    title: "Dialog spec and usage",
    group: "Components",
    description: "Dialog capability metadata, focus entry, Escape close, and focus-return boundaries.",
    render: () => (
      <section className="alpha-story-stack">
        <ReadbackPanel title="Capability metadata">
          <TableShell
            columns={[
              { key: "capability", label: "Capability" },
              { key: "status", label: "Status" },
              { key: "proof", label: "Proof" }
            ]}
            rows={[
              { capability: "Focus entry", status: <StatusBadge state={{ state: "local_only" }} />, proof: "Implemented in Dialog" },
              { capability: "Tab containment", status: <StatusBadge state={{ state: "not_claimed" }} />, proof: "Not claimed until implemented" },
              { capability: "Escape close", status: <StatusBadge state={{ state: "local_only" }} />, proof: "Requires onOpenChange" },
              { capability: "Focus return", status: <StatusBadge state={{ state: "local_only" }} />, proof: "Requires triggerRef" }
            ]}
          />
        </ReadbackPanel>
        <OverlayModeMatrix />
        <DialogSpecFixture />
        <PopoverSpecFixture />
        <OverlayStaticModes />
      </section>
    )
  },
  {
    id: "table-work-index-spec",
    title: "Table and work index spec",
    group: "Components",
    description: "Dense desktop scanning and mobile stacked rows for synthetic work items.",
    render: () => (
      <section className="alpha-story-stack">
        <ReadbackPanel title="Table shell rules">
          <TableShell
            label="Table shell behavior rules"
            columns={[
              { key: "surface", label: "Surface" },
              { key: "desktop", label: "Desktop behavior" },
              { key: "mobile", label: "Mobile behavior" },
              { key: "boundary", label: "Boundary" }
            ]}
            rows={tableShellRuleRows}
          />
        </ReadbackPanel>
        <div className="tcrn-spec-grid">
          <ReadbackPanel title="Work index scanning">
            <Text>Use WorkIndex for finite synthetic queues that need compact status and owner scanning.</Text>
            <WorkIndex label="Component story work index" rows={componentStoryRows} />
          </ReadbackPanel>
          <ReadbackPanel title="Empty state distinction">
            <Text>Empty states stay inside the table frame and name what is absent without claiming remote counts.</Text>
            <TableShell
              label="Release candidate empty state"
              columns={[
                { key: "item", label: "Item" },
                { key: "state", label: "State" }
              ]}
              rows={[]}
              emptyState={<StateView state={{ state: "not_configured" }} title="No release candidate" />}
            />
          </ReadbackPanel>
        </div>
        <ReadbackPanel title="DataGrid escalation boundary">
          <Text>Escalate from TableShell or WorkIndex when the surface needs editing, virtualization, remote state, column controls, or batch operations.</Text>
          <TableShell
            label="DataGrid escalation criteria"
            columns={[
              { key: "capability", label: "Capability" },
              { key: "tableShell", label: "TableShell disposition" },
              { key: "escalation", label: "Escalation" },
              { key: "proof", label: "Required proof" }
            ]}
            rows={dataGridEscalationRows}
          />
        </ReadbackPanel>
        <InlineAlert tone="warning">Empty, loading, and error states must stay distinct; do not render an empty table when source loading failed.</InlineAlert>
      </section>
    )
  },
  {
    id: "forms-patterns",
    title: "Forms pattern",
    group: "Patterns",
    description: "Form composition rules for labels, hints, invalid states, and action spacing.",
    render: () => (
      <section className="alpha-story-stack">
        <SectionTabs items={[{ id: "inputs", label: "Inputs", selected: true }, { id: "validation", label: "Validation" }, { id: "actions", label: "Actions" }]} />
        <div className="tcrn-spec-grid">
          <ReadbackPanel title="Label and hint">
            <Text>Every input has a persistent label. Hints and errors remain in the DOM and are wired into the control.</Text>
          </ReadbackPanel>
          <ReadbackPanel title="Actions">
            <Text>Primary and secondary actions sit in a wrapped row with a minimum gap; zero-spacing joins are rejected.</Text>
          </ReadbackPanel>
        </div>
      </section>
    )
  },
  {
    id: "workbench-patterns",
    title: "Workbench patterns",
    group: "Patterns",
    description: "Work index, filters, detail inspection, and evidence strips.",
    render: () => (
      <section className="alpha-story-stack">
        <FilterBar label="Synthetic filters">
          <Badge>local fixture</Badge>
          <Badge>no product import</Badge>
        </FilterBar>
        <WorkIndex
          rows={[
            { id: "row-1", title: "Synthetic row", state: { state: "proof_required" }, owner: "role-placeholder" },
            { id: "row-2", title: "Blocked sample", state: { state: "blocked" }, owner: "review-placeholder" }
          ]}
        />
        <DetailInspector
          title="Selected fixture"
          items={[
            { key: "scope", label: "Scope", value: "Design-system local scaffold" },
            { key: "claim", label: "Claim", value: "Product adoption not claimed" }
          ]}
        />
        <EvidenceStrip items={["local proof", "synthetic examples", "no raw evidence"]} />
      </section>
    )
  },
  {
    id: "readiness-notification-patterns",
    title: "Readiness and notification pattern",
    group: "Patterns",
    description: "Fail-closed readiness surfaces and copy-state notifications without external readiness claims.",
    render: () => (
      <section className="alpha-story-stack">
        <InlineAlert tone="warning">Proof-dependent surfaces must describe the missing proof instead of implying readiness.</InlineAlert>
        <div className="tcrn-guidance-grid">
          <StateView state={{ state: "not_configured" }} />
          <StateView state={{ state: "unknown" }} />
          <StateView state={{ state: "unavailable" }} />
        </div>
      </section>
    )
  },
  {
    id: "selection-list-patterns",
    title: "Selection and list patterns",
    group: "Patterns",
    description: "Choosing between select, search list, multi-select, and large list behaviors.",
    render: () => (
      <section className="alpha-story-stack">
        <TableShell
          columns={[
            { key: "pattern", label: "Pattern" },
            { key: "baseline", label: "Baseline" },
            { key: "escalation", label: "Escalation" }
          ]}
          rows={patternExpansionRows.slice(0, 1)}
        />
        <InlineAlert tone="warning">Large or remote option sets need search, loading, empty, and keyboard states.</InlineAlert>
      </section>
    )
  },
  {
    id: "modal-validation-patterns",
    title: "Modal validation patterns",
    group: "Patterns",
    description: "Validation rules for dialogs, destructive actions, and blocked owner routes.",
    render: () => (
      <section className="alpha-story-stack">
        <TableShell
          columns={[
            { key: "pattern", label: "Pattern" },
            { key: "baseline", label: "Baseline" },
            { key: "escalation", label: "Escalation" }
          ]}
          rows={patternExpansionRows.slice(1, 2)}
        />
        <ReadbackPanel title="Validation contract">
          <Text>Dialog validation keeps field errors visible and returns focus without claiming tab containment unless implemented.</Text>
        </ReadbackPanel>
      </section>
    )
  },
  {
    id: "datagrid-fields-patterns",
    title: "Datagrid field patterns",
    group: "Patterns",
    description: "Rules for editable grid cells, field labels, and detail-panel escalation.",
    render: () => (
      <section className="alpha-story-stack">
        <TableShell
          columns={[
            { key: "pattern", label: "Pattern" },
            { key: "baseline", label: "Baseline" },
            { key: "escalation", label: "Escalation" }
          ]}
          rows={patternExpansionRows.slice(2, 3)}
        />
        <EvidenceStrip items={["persistent labels", "cell focus", "detail panel escape"]} />
      </section>
    )
  },
  {
    id: "big-list-search-patterns",
    title: "Big list search patterns",
    group: "Patterns",
    description: "Filtering, selection, loading, empty state, and keyboard rules for large lists.",
    render: () => (
      <section className="alpha-story-stack">
        <TableShell
          columns={[
            { key: "pattern", label: "Pattern" },
            { key: "baseline", label: "Baseline" },
            { key: "escalation", label: "Escalation" }
          ]}
          rows={patternExpansionRows.slice(3, 4)}
        />
        <div className="tcrn-guidance-grid">
          <StateView state={{ state: "not_configured" }} title="No filter applied" />
          <StateView state={{ state: "unknown" }} title="Remote count unknown" />
        </div>
      </section>
    )
  },
  {
    id: "dashboard-page-templates",
    title: "Dashboard and page templates",
    group: "Patterns",
    description: "Desktop, mobile, and dashboard page templates for status-first product surfaces.",
    render: () => (
      <section className="alpha-story-stack">
        <TableShell
          columns={[
            { key: "pattern", label: "Pattern" },
            { key: "baseline", label: "Baseline" },
            { key: "escalation", label: "Escalation" }
          ]}
          rows={patternExpansionRows.slice(4)}
        />
        <ReadbackPanel title="Template boundary">
          <Text>Templates describe layout and interaction rules only; product data truth remains owned by consumer routes.</Text>
        </ReadbackPanel>
      </section>
    )
  },
  {
    id: "aos-operations-cockpit-standard",
    title: "AOS Operations Cockpit standard",
    group: "Patterns",
    description: "Design System standard for the served operations cockpit shell, workbench lanes, details, and disabled states.",
    render: () => (
      <section
        className="alpha-story-stack"
        data-aos-served-surface-standard="operations-cockpit"
        data-aos-visual-standard-id="ds-aos-operations-cockpit-v1"
        data-aos-component-registration="registered"
      >
        <TopBar
          productName="TCRN AOS"
          moduleName="Operations Cockpit"
          actions={
            <div className="tcrn-action-row">
              <StatusBadge state={{ state: "local_only" }} />
              <Button type="button" disabled disabledReason="Refresh is unavailable in this synthetic standard">
                Refresh
              </Button>
            </div>
          }
        />
        <div className="tcrn-spec-grid">
          <SideNav label="AOS served-surface navigation">
            <NavGroup label="Operations" selected>
              <NavItem href="#aos-operations-cockpit-standard" iconName="home" selected>Operations cockpit</NavItem>
              <NavItem href="#aos-docs-readiness-standard" iconName="book-open">Docs readiness</NavItem>
              <NavItem
                href="#aos-product-design-target-set-standard"
                iconName="package"
                disabled
                disabledReason="Target-set navigation is unavailable in this fixture"
              >
                Product design target set
              </NavItem>
            </NavGroup>
          </SideNav>
          <ReadbackPanel title="Served-surface coverage">
            <Text>The cockpit standard is package-backed for shell, workbench, evidence, detail, and disabled-state presentation.</Text>
            <TableShell
              label="AOS served surface package coverage"
              columns={[
                { key: "surface", label: "Surface" },
                { key: "standard", label: "Standard" },
                { key: "packageComponents", label: "Package components" },
                { key: "boundary", label: "Boundary" }
              ]}
              rows={aosServedSurfaceCoverageRows}
            />
          </ReadbackPanel>
        </div>
        <ReadbackPanel title="Workspace shell registration">
          <TableShell
            label="AOS workspace shell standard"
            columns={[
              { key: "primitive", label: "Primitive" },
              { key: "rule", label: "Rule" },
              { key: "proof", label: "Proof" }
            ]}
            rows={aosWorkspaceShellRows}
          />
        </ReadbackPanel>
        <ReadbackPanel title="Operations workbench layout">
          <TableShell
            label="Operations workbench standard"
            columns={[
              { key: "area", label: "Area" },
              { key: "standard", label: "Standard" },
              { key: "responsive", label: "Responsive behavior" }
            ]}
            rows={aosWorkbenchRows}
          />
        </ReadbackPanel>
        <div className="tcrn-spec-grid">
          <Surface>
            <Heading level={3}>Stage and phase preview</Heading>
            <EvidenceStrip items={["local service state", "safe basis", "read-only workspace"]} />
            <WorkIndex
              label="Operations work queue"
              rows={[
                { id: "aos-op-1", title: "Owner-trial cockpit state", state: { state: "local_only" }, owner: "service preview" },
                { id: "aos-op-2", title: "Unavailable action lane", state: { state: "blocked" }, owner: "AOS UI" }
              ]}
            />
          </Surface>
          <DetailDrawer title="Selected operation detail" open>
            <KeyValueList
              items={[
                { key: "selection", label: "Selection", value: "Synthetic work item" },
                { key: "source", label: "Source", value: "Consumer-owned service read model" },
                { key: "posture", label: "Posture", value: <StatusBadge state={{ state: "local_only" }} /> }
              ]}
            />
          </DetailDrawer>
        </div>
        <div data-aos-disabled-reason-standard="all-controls">
          <ReadbackPanel title="Disabled and unavailable action standard">
            <TableShell
              label="AOS disabled reason standard"
              columns={[
                { key: "control", label: "Control" },
                { key: "reasonContract", label: "Reason contract" },
                { key: "requiredFor", label: "Required for" }
              ]}
              rows={aosDisabledReasonRows}
            />
            <div className="tcrn-form-stack">
              <Field label="Target path" hint="Disabled selects expose their own reason.">
                <Select
                  defaultValue="operations"
                  disabled
                  disabledReason="Target path is unavailable in this synthetic standard"
                  options={[{ value: "operations", label: "Operations cockpit" }]}
                />
              </Field>
              <Field label="Owner note" hint="Textarea disabled reasons use the same contract.">
                <Textarea
                  defaultValue="Local note fixture"
                  disabled
                  disabledReason="Owner note editing is unavailable in this synthetic standard"
                />
              </Field>
            </div>
          </ReadbackPanel>
        </div>
      </section>
    )
  },
  {
    id: "aos-docs-readiness-standard",
    title: "AOS Docs Readiness standard",
    group: "Patterns",
    description: "Design System standard for docs/search/release-candidate readiness inspection without publication or mutation behavior.",
    render: () => (
      <section
        className="alpha-story-stack"
        data-aos-served-surface-standard="docs-search-release-readiness"
        data-aos-visual-standard-id="ds-aos-docs-readiness-v1"
        data-aos-component-registration="registered"
      >
        <TopBar
          productName="TCRN AOS"
          moduleName="Docs readiness"
          actions={<StatusBadge state={{ state: "fixture_only" }} />}
        />
        <div className="tcrn-spec-grid">
          <ReadbackPanel title="Readiness workspace pattern">
            <Text>Docs readiness surfaces use local inspection, linkage references, search/filter state, and selected detail without implying external actions.</Text>
            <TableShell
              label="Docs readiness package standard"
              columns={[
                { key: "area", label: "Area" },
                { key: "components", label: "Components" },
                { key: "rule", label: "Rule" }
              ]}
              rows={aosDocsReadinessRows}
            />
          </ReadbackPanel>
          <Surface>
            <Heading level={3}>Search inspection panel</Heading>
            <FilterBar label="Docs readiness filters">
              <Field label="Search">
                <SearchInput placeholder="Search local docs" />
              </Field>
              <Field label="State">
                <Select
                  defaultValue="all"
                  options={[
                    { value: "all", label: "All states" },
                    { value: "blocked", label: "Blocked" }
                  ]}
                />
              </Field>
            </FilterBar>
            <TableShell
              label="Docs inspection rows"
              columns={[
                { key: "path", label: "Repo path" },
                { key: "state", label: "State" },
                { key: "linkage", label: "Linkage" }
              ]}
              rows={[
                { path: "docs/readiness.md", state: <StatusBadge state={{ state: "local_only" }} />, linkage: "PR reference only" },
                { path: "release-candidate.md", state: <StatusBadge state={{ state: "blocked" }} />, linkage: "CI reference only" }
              ]}
              emptyState={<StateView state={{ state: "not_configured" }} title="No docs match" />}
            />
          </Surface>
        </div>
        <div className="tcrn-spec-grid">
          <GateReadinessPanel state={presentCopyState({ state: "proof_required" })} />
          <DetailDrawer title="Selected docs readiness detail" open>
            <KeyValueList
              items={[
                { key: "path", label: "Path", value: "docs/readiness.md" },
                { key: "linkage", label: "Linkage", value: "Reference-only GitHub and CI metadata" },
                { key: "action", label: "Action", value: <Button disabled disabledReason="Publishing is unavailable in this synthetic standard">Publish</Button> }
              ]}
            />
          </DetailDrawer>
        </div>
        <EvidenceStrip items={["local inspection", "reference links", "no external mutation"]} />
      </section>
    )
  },
  {
    id: "aos-product-design-target-set-standard",
    title: "AOS Product Design target-set standard",
    group: "Patterns",
    description: "Design System standard for AOS-wide target-set presentation, module index, gates, and detail inspection.",
    render: () => (
      <section
        className="alpha-story-stack"
        data-aos-served-surface-standard="aos-wide-product-design"
        data-aos-visual-standard-id="ds-aos-target-set-v1"
        data-aos-component-registration="registered"
      >
        <TopBar
          productName="TCRN AOS"
          moduleName="Product Design target set"
          actions={
            <Field label="Target path" hint="Disabled target-path controls wrap before collision.">
              <Select
                defaultValue="target-set"
                disabled
                disabledReason="Target path editing is unavailable in this synthetic standard"
                options={[{ value: "target-set", label: "Target-set inspection" }]}
              />
            </Field>
          }
        />
        <ReadbackPanel title="Target-set workspace pattern">
          <TableShell
            label="AOS-wide target-set package standard"
            columns={[
              { key: "area", label: "Area" },
              { key: "components", label: "Components" },
              { key: "rule", label: "Rule" }
            ]}
            rows={aosTargetSetRows}
          />
        </ReadbackPanel>
        <div className="tcrn-guidance-grid">
          {aosTargetSetModuleCards.map((card) => (
            <Surface key={card.id} data-aos-module-card="true">
              <Heading level={3}>{card.title}</Heading>
              <Text>Module cards describe target-set presentation only; product feature implementation remains consumer-owned.</Text>
              <StatusBadge state={card.state} />
            </Surface>
          ))}
        </div>
        <div className="tcrn-spec-grid">
          <Surface>
            <Heading level={3}>Surface index</Heading>
            <WorkIndex
              label="AOS-wide surface index"
              rows={[
                { id: "target-1", title: "Target path and module cards", state: { state: "local_only" }, owner: "Design System standard" },
                { id: "target-2", title: "Disabled gate panel", state: { state: "blocked" }, owner: "Consumer route" }
              ]}
            />
          </Surface>
          <DetailDrawer title="Product design inspection detail" open>
            <KeyValueList
              items={[
                { key: "target", label: "Target", value: "AOS-wide presentation standard" },
                { key: "gate", label: "Gate", value: <GateReadinessPanel state={presentCopyState({ state: "blocked" })} /> },
                { key: "evidence", label: "Evidence", value: <EvidenceStrip items={["registered components", "synthetic rows", "safe claim boundary"]} /> }
              ]}
            />
          </DetailDrawer>
        </div>
        <ReadbackPanel title="Token, radius, density, and focus standard">
          <TableShell
            label="AOS visual token standard"
            columns={[
              { key: "tokenArea", label: "Token area" },
              { key: "rule", label: "Rule" },
              { key: "boundary", label: "Boundary" }
            ]}
            rows={aosTokenDensityRows}
          />
        </ReadbackPanel>
        <div data-aos-exception-record="brand-lockup-product-specific">
          <ReadbackPanel title="AOS brand treatment exception">
            <TableShell
              label="AOS exception records"
              columns={[
                { key: "exceptionId", label: "Exception ID" },
                { key: "disposition", label: "Disposition" },
                { key: "scope", label: "Scope" },
                { key: "limit", label: "Limit" }
              ]}
              rows={aosExceptionRows}
            />
          </ReadbackPanel>
        </div>
      </section>
    )
  },
  {
    id: "proof-matrix",
    title: "Proof matrix",
    group: "Proof",
    description: "Local browser, accessibility, visual, copy, and no-overclaim receipts required for this checkpoint.",
    render: () => (
      <section className="alpha-story-stack">
        <ReadbackPanel title="Proof receipts">
          <TableShell
            columns={[
              { key: "receipt", label: "Receipt" },
              { key: "scope", label: "Scope" },
              { key: "claim", label: "Claim" }
            ]}
            rows={[
              { receipt: "Storybook static build", scope: "local", claim: <StatusBadge state={{ state: "local_only" }} /> },
              { receipt: "Axe and keyboard checks", scope: "local", claim: <StatusBadge state={{ state: "proof_required" }} /> },
              { receipt: "Visual baselines", scope: "local", claim: <StatusBadge state={{ state: "fixture_only" }} /> },
              { receipt: "No-overclaim scan", scope: "local", claim: <StatusBadge state={{ state: "not_claimed" }} /> }
            ]}
          />
        </ReadbackPanel>
      </section>
    )
  },
  {
    id: "blocked-actions",
    title: "Blocked actions",
    group: "Proof",
    description: "Disabled gates and blocked owner actions remain explicit.",
    render: () => (
      <section className="alpha-story-stack">
        <EnvironmentBanner label="Private local scaffold" />
        <GateReadinessPanel state={presentCopyState({ state: "blocked" })} />
        <ConfirmActionDialog
          title="Publication is not routed"
          message="Package publication, GitHub remote creation, and product adoption are blocked in this scaffold route."
          confirmLabel="Publish"
          cancelLabel="Close"
          disabled
        />
        <TableShell columns={[{ key: "item", label: "Item" }]} rows={[]} emptyState="No release candidate" />
      </section>
    )
  },
  {
    id: "overlay-focus",
    title: "Overlay focus contract",
    group: "Proof",
    description: "Dialog open, focus, Escape close, and focus return behavior for synthetic fixtures.",
    render: () => <OverlayFocusFixture />
  },
  {
    id: "local-changelog",
    title: "Local changelog",
    group: "Change Log",
    description: "Human-readable local checkpoint history without package publication or release claims.",
    render: () => (
      <section className="alpha-story-stack">
        <ReadbackPanel title="Current checkpoint">
          <KeyValueList
            items={[
              { key: "checkpoint", label: "Checkpoint", value: "Storybook IA and governance surface upgrade" },
              { key: "basis", label: "Basis", value: "Owner-approved local implementation route" },
              { key: "boundary", label: "Boundary", value: "No package publication, no product adoption, no downstream acceptance claim" }
            ]}
          />
        </ReadbackPanel>
        <EvidenceStrip items={["local source change", "synthetic stories", "proof rerun required", "no remote"]} />
      </section>
    )
  }
];

export function getContractStory(id: string): ContractStory {
  const story = contractStories.find((item) => item.id === id);
  if (!story) {
    throw new Error(`missing_contract_story:${id}`);
  }
  return story;
}

export function contractStoriesByGroup(group: ContractStoryGroup): ContractStory[] {
  return contractStories.filter((story) => story.group === group);
}

export function StoryFrame({ story, children }: { story: ContractStory; children: ReactNode }) {
  return (
    <section
      className="alpha-frame"
      data-contract-story-id={story.id}
      data-contract-story-group={story.group}
    >
      <div className="alpha-story-card">
        <div className="tcrn-story-kicker">{story.group}</div>
        <h1>{story.title}</h1>
        <p>{story.description}</p>
        {children}
      </div>
    </section>
  );
}

function OverlayFocusFixture() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  return (
    <section className="alpha-overlay-demo">
      <Button ref={triggerRef} type="button" onClick={() => setOpen(true)}>
        Open confirmation
      </Button>
      <Dialog
        title="Synthetic confirmation"
        open={open}
        triggerRef={triggerRef}
        initialFocusRef={closeRef}
        onOpenChange={setOpen}
        className="alpha-overlay-demo__dialog"
      >
        <Text>Fixture-only confirmation. Product adoption, package publication, and release proof are not claimed.</Text>
        <Button type="button" variant="danger" disabled disabledReason="Publication is not routed">
          Publish
        </Button>
        <Button ref={closeRef} type="button" onClick={() => {
          setOpen(false);
          requestAnimationFrame(() => triggerRef.current?.focus());
        }}>
          Close
        </Button>
      </Dialog>
    </section>
  );
}

function OverlayModeMatrix() {
  return (
    <section className="tcrn-overlay-mode-matrix" data-overlay-mode-matrix="true">
      <div className="tcrn-overlay-mode-matrix__intro">
        <Heading level={3}>Overlay mode matrix</Heading>
        <Text>Choose the smallest layer that fits the task: anchored popovers for local context, dialogs for modal confirmation, and drawers for structural panels.</Text>
      </div>
      <div className="tcrn-overlay-mode-grid">
        <div className="tcrn-overlay-mode-card">
          <Icon name="external-link" />
          <div>
            <Heading level={3}>Dialog</Heading>
            <Text>Modal confirmation with focus entry, Escape close, and focus return when the owning route wires those props.</Text>
          </div>
        </div>
        <div className="tcrn-overlay-mode-card">
          <Icon name="info" />
          <div>
            <Heading level={3}>Popover</Heading>
            <Text>Anchored, non-modal surface for nearby context or lightweight choices; it must not pretend to be a blocking dialog.</Text>
          </div>
        </div>
        <div className="tcrn-overlay-mode-card">
          <Icon name="panel-left-open" />
          <div>
            <Heading level={3}>Drawer</Heading>
            <Text>Structural side panel for inspection or action groups; it is complementary, not aria-modal.</Text>
          </div>
        </div>
      </div>
    </section>
  );
}

export function DialogSpecFixture() {
  const triggerRef = { current: null };
  const closeRef = { current: null };

  return (
    <section
      className="tcrn-dialog-spec-fixture"
      data-dialog-proof="escape-focus-return"
      data-dialog-escape-close="requires-on-open-change"
      data-dialog-focus-return="requires-trigger-ref"
      data-dialog-tab-containment="not-claimed"
    >
      <div className="tcrn-dialog-spec-fixture__header">
        <div className="tcrn-dialog-spec-fixture__summary">
          <Heading level={3}>Interactive proof fixture</Heading>
          <Text>Open the fixture to verify focus entry, Escape close, and focus return without claiming Tab containment.</Text>
        </div>
        <StatusBadge state={{ state: "local_only" }} />
      </div>
      <div className="tcrn-dialog-spec-fixture__actions">
        <Button
          type="button"
          aria-controls="dialog-spec-fixture-panel"
          aria-expanded="false"
          data-dialog-fixture-open
        >
          Open confirmation
        </Button>
      </div>
      <div id="dialog-spec-fixture-panel" data-dialog-fixture-panel data-overlay-transition-state="closed" hidden>
        <Dialog
          title="Synthetic confirmation"
          open
          triggerRef={triggerRef}
          initialFocusRef={closeRef}
          onOpenChange={() => undefined}
          className="tcrn-dialog-spec-fixture__dialog"
        >
          <Text>Fixture-only confirmation. Product adoption, package publication, and release proof are not claimed.</Text>
          <div className="tcrn-dialog-spec-fixture__dialog-actions">
            <Button type="button" variant="danger" disabled disabledReason="Publication is not routed">
              Publish
            </Button>
            <Button type="button" data-dialog-fixture-close>
              Close
            </Button>
          </div>
        </Dialog>
      </div>
    </section>
  );
}

function PopoverSpecFixture() {
  const triggerRef = { current: null };
  const closeRef = { current: null };

  return (
    <section
      className="tcrn-dialog-spec-fixture tcrn-popover-spec-fixture"
      data-popover-proof="anchored-close-return"
      data-popover-escape-close="requires-on-open-change"
      data-popover-focus-return="requires-trigger-ref"
      data-popover-tab-containment="not-claimed"
    >
      <div className="tcrn-dialog-spec-fixture__header">
        <div className="tcrn-dialog-spec-fixture__summary">
          <Heading level={3}>Popover proof fixture</Heading>
          <Text>Open the popover to verify anchored expansion, Escape close, and focus return without claiming modal behavior.</Text>
        </div>
        <StatusBadge state={{ state: "local_only" }} />
      </div>
      <div className="tcrn-dialog-spec-fixture__actions">
        <Button
          type="button"
          aria-controls="popover-spec-fixture-panel"
          aria-expanded="false"
          data-popover-fixture-open
        >
          Open popover
        </Button>
      </div>
      <div id="popover-spec-fixture-panel" data-popover-fixture-panel data-overlay-transition-state="closed" hidden>
        <Popover
          title="Anchored context"
          open
          triggerRef={triggerRef}
          initialFocusRef={closeRef}
          onOpenChange={() => undefined}
          className="tcrn-popover-spec-fixture__popover"
        >
          <Text>This popover is non-modal and stays scoped to the triggering context.</Text>
          <div className="tcrn-dialog-spec-fixture__dialog-actions">
            <Button type="button" data-popover-fixture-close>
              Close
            </Button>
          </div>
        </Popover>
      </div>
    </section>
  );
}

function OverlayStaticModes() {
  return (
    <section className="tcrn-overlay-static-modes" data-overlay-static-modes="true">
      <div className="tcrn-overlay-static-card">
        <Heading level={3}>Confirm action dialog</Heading>
        <ConfirmActionDialog
          title="Blocked publication"
          message="The confirm action remains blocked until an authorized route clears it."
          confirmLabel="Publish"
          cancelLabel="Close"
          disabled
        />
      </div>
      <div className="tcrn-overlay-static-card">
        <Heading level={3}>Structural drawers</Heading>
        <div className="tcrn-overlay-drawer-grid">
          <DetailDrawer title="Detail drawer" open>
            <Text>Use detail drawers for inspection content that does not need modal semantics.</Text>
          </DetailDrawer>
          <ActionDrawer title="Action drawer" open>
            <Text>Use action drawers for scoped action groups while keeping the main context readable.</Text>
          </ActionDrawer>
        </div>
      </div>
    </section>
  );
}
