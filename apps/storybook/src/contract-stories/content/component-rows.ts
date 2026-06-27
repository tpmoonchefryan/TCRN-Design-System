import type { WorkIndexRow } from "@tcrn/ui-react";

export const componentStoryRows: WorkIndexRow[] = [
  { id: "button", title: "Button and clipboard action", state: { state: "local_only" }, owner: "ui-react" },
  { id: "display-primitives", title: "Display primitives", state: { state: "local_only" }, owner: "ui-react" },
  { id: "interaction-disclosure", title: "Interaction disclosure primitives", state: { state: "local_only" }, owner: "ui-react" },
  { id: "field", title: "Field", state: { state: "proof_required" }, owner: "ui-react" },
  { id: "navigation", title: "Navigation shell", state: { state: "proof_required" }, owner: "ui-react" },
  { id: "dialog", title: "Dialog", state: { state: "proof_required" }, owner: "ui-react" },
  { id: "work-index", title: "WorkIndex", state: { state: "fixture_only" }, owner: "ui-react" },
  { id: "brand-lockup", title: "Brand lockup", state: { state: "not_claimed" }, owner: "Storybook prototype" }
];

export const componentFamilyRows = [
  { family: "Actions", components: "Button, IconButton, LinkButton, ClipboardCopyButton", scope: "Commands, blocked owner actions, and explicit clipboard writes", status: "Component library available" },
  { family: "Iconography", components: "Icon, tcrnIconNames", scope: "Functional iconography routed through the TCRN wrapper", status: "Component library available; not brand marks" },
  { family: "Forms", components: "Field, Input, Textarea, SearchInput, Select, Checkbox", scope: "Persistent labels, hint/error wiring, disabled reasons, and localized input ergonomics", status: "Component library available" },
  { family: "Navigation", components: "TopBar, SideNav, NavGroup, NavItem, Breadcrumb, ModuleTabs, SectionTabs, SegmentedNav, ProductSwitcher, Pagination, SkipLink", scope: "Product orientation, side navigation, local section movement, and skip access", status: "Component library available; full shells remain prototypes" },
  { family: "Overlays", components: "DetailDrawer, ActionDrawer, Tooltip, Popover, Dialog, ConfirmActionDialog", scope: "Layered surfaces, supplemental descriptions, anchored popovers, focus entry, and close/return contracts", status: "Component library available; Tooltip is non-interactive only" },
  { family: "Data display", components: "TableShell, WorkIndex, StatusBadge, KeyValueList", scope: "Dense scanning, readable state, and empty/error distinction", status: "Component library available; DataGrid not included" },
  { family: "Feedback and readiness", components: "Badge, InlineAlert, LiveRegion, Skeleton, StateSurface, EmptyState, ErrorState, EnvironmentBanner, GateReadinessPanel, EvidenceStrip, ReadbackPanel, StateView", scope: "Loading, blocked, unknown, empty, error, and proof-dependent states", status: "Component library available" },
  { family: "Layout and text", components: "Text, Heading, Highlight, Surface, Divider, CollapsibleRegion, DisclosurePanel, FilterBar", scope: "Spacing floor, headings, inline highlighting, sections, dividers, controlled disclosure, and filter grouping", status: "Component library available" },
  { family: "Brand and identity", components: "TcrnBrandMark, ProductLockup, ShellBrandLockup", scope: "TCRN mother brand and product suffix treatment", status: "Storybook prototypes; not reusable component exports" }
];

export const storybookOnlyPrototypeRows = [
  { helper: "TcrnBrandMark / ProductLockup / ShellBrandLockup", scope: "Synthetic brand review visuals", status: "Storybook prototype; not a component library export" },
  { helper: "TmsDenseShellDemo", scope: "Dense product shell IA comparison", status: "Storybook prototype; full shell deferred" },
  { helper: "KnowledgeBaseShellDemo", scope: "Documentation shell IA comparison", status: "Storybook prototype; full shell deferred" },
  { helper: "CompactToolShellDemo", scope: "Focused tool shell comparison", status: "Storybook prototype; shell framework deferred" }
];
