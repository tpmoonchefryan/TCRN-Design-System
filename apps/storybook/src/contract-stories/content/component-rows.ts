import type { RecordRowProps } from "@tcrn/ui-react";

export const componentStoryRows: RecordRowProps[] = [
  { id: "button", title: "Button and clipboard action", state: { state: "local_only" }, owner: "ui-react" },
  { id: "display-primitives", title: "Display primitives", state: { state: "local_only" }, owner: "ui-react" },
  { id: "interaction-disclosure", title: "Interaction disclosure primitives", state: { state: "local_only" }, owner: "ui-react" },
  { id: "field", title: "Field, SettingChoice, and NumberInput", state: { state: "proof_required" }, owner: "ui-react" },
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
  { family: "Forms", components: "Field, Input, NumberInput, Textarea, SearchInput, Select, MultiSelect, SuggestInput, SettingChoice, SettingsHostSwitcher, Checkbox", scope: "Persistent labels, hint/error wiring, disabled reasons, single and collection value selection, open-value suggestions, measured binary choices, numeric entry, and localized input ergonomics", status: "Component library available; collection and open-value semantics stay separate from navigation" },
  { family: "Navigation", components: "ProductShell, ShellBrandButton, ShellPins, ShellMenu, ShellDropdown, ShellIntro, ProductShellSearch, ShellThemeToggle, ShellLocaleMenu, NavGroup, NavItem, Breadcrumb, Tabs, Pagination, SkipLink", scope: "Package-backed top-band product shell: the brand button and its full menu, pinned items and their drop-downs, the avatar menu with theme, language, and products, the sign-in intro, the page's breadcrumb trail, the tab family, and skip access", status: "Component library available; the top-band shell's effects and controller prop bundles are package-backed for product adoption, and the side-rail, collapse, mobile toggle, top bar, launcher, and switcher parts are deprecated" },
  { family: "Overlays", components: "DetailDrawer, ActionDrawer, Tooltip, Popover, Dialog, ConfirmActionDialog", scope: "Layered surfaces, body-boundary supplemental descriptions, viewport-safe popovers, focus entry, and close/return contracts", status: "Component library available; Tooltip is non-interactive only and long content belongs in Popover" },
  { family: "Data display", components: "TableShell, TableToolbar, RecordTable, DetailInspector, StatusBadge, KeyValueList, DefinitionList, DictionaryTable", scope: "Dense scanning, readable state, empty/error distinction, and category/value explanations", status: "Component library available; DictionaryTable keeps category copy separate from value copy" },
  { family: "Records and boards", components: "RecordTable, RecordRow, RowGroup, LaneBoard, SubNav, PageHeader, ViewTabs, QuickFilters, SplitView, InlineCreate, SavedViewToolbar, MachineToken, MachineTokenCell", scope: "Records, rows, local navigation, dense views, groups, lane boards, and token containment", status: "Component library available for static/no-live functional surfaces; product adoption separate" },
  { family: "Hierarchy and relations", components: "RelationGraph, RelationshipChip, StagePipeline", scope: "Graphs, relationship descriptions, stages, and supporting references", status: "Component library available" },
  { family: "Detail and inspection", components: "RecordInspector, DetailLayout, MetadataRail, AttachmentList, ActivityFeed", scope: "Record detail, metadata, inspection, attachments, and activity", status: "Component library available" },
  { family: "Documents and collaboration", components: "TreeNav, DocumentCanvas, TocRail, InlineCommentList, LabelSet, VersionHistory, TemplateGallery, SearchResultList", scope: "Documents, page navigation, comments, labels, versions, templates, and local results", status: "Component library available for static/no-live surfaces; publishing separate" },
  { family: "Layout and text", components: "Text, Heading, Highlight, Surface, Divider, CollapsibleRegion, DisclosurePanel, SettingsLayout, SettingRowList, PageHierarchy, FilterBar", scope: "Spacing floor, headings, inline highlighting, sections, dividers, controlled disclosure, container-driven settings composition, explicit page hierarchy, and filter grouping", status: "Component library available" },
  { family: "Brand and identity", components: "TcrnBrandMark, ProductLogo, ProductLockup, ShellBrandLockup", scope: "Registered TCRN mother brand mark and product suffix lockup treatment", status: "Component library available; unregistered product wordmark images are forbidden" }
];

export const storybookOnlyPrototypeRows = [
  { helper: "KnowledgeBaseShellDemo", scope: "Knowledge-base bookmarks in the top-band shell", status: "Storybook prototype; not a component library export" }
];
