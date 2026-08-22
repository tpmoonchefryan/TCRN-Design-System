import type { RecordRowProps } from "@tcrn/ui-react";

export const componentStoryRows: RecordRowProps[] = [
  { id: "button", title: "Button and clipboard action", state: { state: "local_only" }, owner: "ui-react" },
  { id: "display-primitives", title: "Display primitives", state: { state: "local_only" }, owner: "ui-react" },
  { id: "interaction-disclosure", title: "Interaction disclosure primitives", state: { state: "local_only" }, owner: "ui-react" },
  { id: "field", title: "Field", state: { state: "proof_required" }, owner: "ui-react" },
  { id: "navigation", title: "Navigation shell", state: { state: "proof_required" }, owner: "ui-react" },
  { id: "dialog", title: "Dialog", state: { state: "proof_required" }, owner: "ui-react" },
  { id: "record-table", title: "RecordTable", state: { state: "fixture_only" }, owner: "ui-react" },
  { id: "records-and-boards-components", title: "Records and boards components", state: { state: "local_only" }, owner: "ui-react" },
  { id: "documents-and-collaboration-components", title: "Documents and collaboration components", state: { state: "local_only" }, owner: "ui-react" },
  { id: "brand-lockup", title: "Brand lockup", state: { state: "local_only" }, owner: "ui-react" }
];

export const componentFamilyRows = [
  { family: "Actions", components: "Button, IconButton, LinkButton, ClipboardCopyButton", scope: "Commands, blocked owner actions, and explicit clipboard writes", status: "Component library available" },
  { family: "Iconography", components: "Icon, tcrnIconNames", scope: "Functional iconography routed through the TCRN wrapper", status: "Component library available; not brand marks" },
  { family: "Forms", components: "Field, Input, Textarea, SearchInput, Select, Checkbox", scope: "Persistent labels, hint/error wiring, disabled reasons, and localized input ergonomics", status: "Component library available" },
  { family: "Navigation", components: "ProductShell, ProductShellSearch, TopBar, SideNav, NavGroup, NavItem, Breadcrumb, ModuleTabs, SectionTabs, SegmentedNav, ProductLauncher, ProductSwitcher, Pagination, SkipLink, SideNavCollapseButton, ShellThemeToggle, ShellLocaleMenu", scope: "Package-backed side-nav product shell boundary, product orientation, side navigation, local section movement, semantic collapse/theme/locale/search control APIs, compact shell controls, and skip access", status: "Component library available; side-nav product shell effects and controller prop bundles are package-backed for AOS-style adoption" },
  { family: "Overlays", components: "DetailDrawer, ActionDrawer, Tooltip, Popover, Dialog, ConfirmActionDialog", scope: "Layered surfaces, supplemental descriptions, anchored popovers, focus entry, and close/return contracts", status: "Component library available; Tooltip is non-interactive only" },
  { family: "Data display", components: "TableShell, TableToolbar, RecordTable, DetailInspector, StatusBadge, KeyValueList", scope: "Dense scanning, readable state, and empty/error distinction", status: "Component library available; DataGrid not included" },
  { family: "Records and boards", components: "RecordTable, RecordRow, RowGroup, LaneBoard, SubNav, PageHeader, ViewTabs, QuickFilters, SplitView, InlineCreate, SavedViewToolbar, MachineToken, MachineTokenCell", scope: "Records, rows, local navigation, dense views, groups, lane boards, and token containment", status: "Component library available for static/no-live functional surfaces; product adoption separate" },
  { family: "Hierarchy and relations", components: "RelationGraph, RelationshipChip, StagePipeline", scope: "Graphs, relationship descriptions, stages, and supporting references", status: "Component library available" },
  { family: "Detail and inspection", components: "RecordInspector, DetailLayout, MetadataRail, AttachmentList, ActivityFeed", scope: "Record detail, metadata, inspection, attachments, and activity", status: "Component library available" },
  { family: "Documents and collaboration", components: "TreeNav, DocumentCanvas, TocRail, InlineCommentList, LabelSet, VersionHistory, TemplateGallery, SearchResultList", scope: "Documents, page navigation, comments, labels, versions, templates, and local results", status: "Component library available for static/no-live surfaces; publishing separate" },
  { family: "Layout and text", components: "Text, Heading, Highlight, Surface, Divider, CollapsibleRegion, DisclosurePanel, FilterBar", scope: "Spacing floor, headings, inline highlighting, sections, dividers, controlled disclosure, and filter grouping", status: "Component library available" },
  { family: "Brand and identity", components: "TcrnBrandMark, ProductLogo, ProductLockup, ShellBrandLockup", scope: "Registered TCRN mother brand mark and product suffix lockup treatment", status: "Component library available; unregistered product wordmark images are forbidden" }
];

export const storybookOnlyPrototypeRows = [
  { helper: "DenseOperationsShellDemo", scope: "Dense product shell IA comparison", status: "Storybook prototype; full shell deferred" },
  { helper: "KnowledgeBaseShellDemo", scope: "Documentation shell IA comparison", status: "Storybook prototype; full shell deferred" },
  { helper: "CompactToolShellDemo", scope: "Focused tool shell comparison", status: "Storybook prototype; shell framework deferred" }
];
