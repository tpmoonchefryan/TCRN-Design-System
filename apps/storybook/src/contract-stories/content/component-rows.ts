import type { WorkIndexRow } from "@tcrn/ui-react";

export const componentStoryRows: WorkIndexRow[] = [
  { id: "button", title: "Button and clipboard action", state: { state: "local_only" }, owner: "ui-react" },
  { id: "display-primitives", title: "Display primitives", state: { state: "local_only" }, owner: "ui-react" },
  { id: "interaction-disclosure", title: "Interaction disclosure primitives", state: { state: "local_only" }, owner: "ui-react" },
  { id: "field", title: "Field", state: { state: "proof_required" }, owner: "ui-react" },
  { id: "navigation", title: "Navigation shell", state: { state: "proof_required" }, owner: "ui-react" },
  { id: "dialog", title: "Dialog", state: { state: "proof_required" }, owner: "ui-react" },
  { id: "work-index", title: "WorkIndex", state: { state: "fixture_only" }, owner: "ui-react" },
  { id: "work-management-components", title: "Work Management components", state: { state: "local_only" }, owner: "ui-react" },
  { id: "knowledge-management-components", title: "Knowledge Management components", state: { state: "local_only" }, owner: "ui-react" },
  { id: "brand-lockup", title: "Brand lockup", state: { state: "local_only" }, owner: "ui-react" }
];

export const componentFamilyRows = [
  { family: "Actions", components: "Button, IconButton, LinkButton, ClipboardCopyButton", scope: "Commands, blocked owner actions, and explicit clipboard writes", status: "Component library available" },
  { family: "Iconography", components: "Icon, tcrnIconNames", scope: "Functional iconography routed through the TCRN wrapper", status: "Component library available; not brand marks" },
  { family: "Forms", components: "Field, Input, Textarea, SearchInput, Select, Checkbox", scope: "Persistent labels, hint/error wiring, disabled reasons, and localized input ergonomics", status: "Component library available" },
  { family: "Navigation", components: "ProductShell, ProductShellSearch, TopBar, SideNav, NavGroup, NavItem, Breadcrumb, ModuleTabs, SectionTabs, SegmentedNav, ProductLauncher, ProductSwitcher, Pagination, SkipLink, SideNavCollapseButton, ShellThemeToggle, ShellLocaleMenu", scope: "Package-backed side-nav product shell boundary, product orientation, side navigation, local section movement, semantic collapse/theme/locale/search control APIs, compact shell controls, and skip access", status: "Component library available; side-nav product shell effects and controller prop bundles are package-backed for AOS-style adoption" },
  { family: "Overlays", components: "DetailDrawer, ActionDrawer, Tooltip, Popover, Dialog, ConfirmActionDialog", scope: "Layered surfaces, supplemental descriptions, anchored popovers, focus entry, and close/return contracts", status: "Component library available; Tooltip is non-interactive only" },
  { family: "Data display", components: "TableShell, WorkIndex, DetailInspector, StatusBadge, KeyValueList", scope: "Dense scanning, readable state, and empty/error distinction", status: "Component library available; DataGrid not included" },
  { family: "Work Management", components: "RelationshipChip, MachineToken, MachineTokenCell, WorkManagementSubnav, WorkPageHeader, WorkViewTabs, WorkQuickFilters, WorkItemRow, WorkList, WorkSplitView, WorkBacklogGroup, WorkInlineCreateStatic, WorkBoard, WorkBoardView, WorkHierarchy, GatePipeline, GatePipelineCompact, EvidenceAttachmentList, WorkDetailLayout, MetadataRail, WorkFieldPanel, WorkActivityFeed, WorkItemInspector, SavedViewToolbar", scope: "Initiative/Epic/Story/Work Item hierarchy, route context, compact local navigation, dense rows/lists, split detail, backlog groups, board lanes, relationship vocabulary, gate pipeline, evidence attachments, saved views, metadata rails, activity feed, and execution-record token containment", status: "Component library available for static/no-live Work Management surfaces; product adoption separate" },
  { family: "Knowledge Management", components: "KnowledgePageTree, KnowledgeDocumentCanvas, KnowledgeTocRail, KnowledgeInlineCommentList, KnowledgeMetadataRail, KnowledgeAttachmentList, KnowledgeLabelSet, KnowledgeVersionHistory, KnowledgeTemplateGallery, KnowledgeSearchResults", scope: "Static Knowledge Base page trees, document canvas, local table of contents, comments, metadata, attachments, labels, version history, templates, and local result lists", status: "Component library available for static/no-live Knowledge discussion surfaces; product adoption and backend publishing separate" },
  { family: "Feedback and readiness", components: "Badge, InlineAlert, LiveRegion, Skeleton, StateSurface, EmptyState, ErrorState, EnvironmentBanner, GateReadinessPanel, EvidenceStrip, ReadbackPanel, StateView", scope: "Loading, blocked, unknown, empty, error, and proof-dependent states", status: "Component library available" },
  { family: "Layout and text", components: "Text, Heading, Highlight, Surface, Divider, CollapsibleRegion, DisclosurePanel, FilterBar", scope: "Spacing floor, headings, inline highlighting, sections, dividers, controlled disclosure, and filter grouping", status: "Component library available" },
  { family: "Brand and identity", components: "TcrnBrandMark, ProductLogo, ProductLockup, ShellBrandLockup", scope: "Registered TCRN mother brand mark and product suffix lockup treatment", status: "Component library available; unregistered product wordmark images are forbidden" }
];

export const storybookOnlyPrototypeRows = [
  { helper: "TmsDenseShellDemo", scope: "Dense product shell IA comparison", status: "Storybook prototype; full shell deferred" },
  { helper: "KnowledgeBaseShellDemo", scope: "Documentation shell IA comparison", status: "Storybook prototype; full shell deferred" },
  { helper: "CompactToolShellDemo", scope: "Focused tool shell comparison", status: "Storybook prototype; shell framework deferred" }
];
