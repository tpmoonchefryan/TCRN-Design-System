// SPDX-License-Identifier: Apache-2.0
// TCRN-DS-INIT-012 — the domain surface, named in one place.
//
// Stage one of a two-stage move. The components still LIVE in `@tcrn/ui-react`;
// this package names them and re-exports them, so a consumer can change its import
// specifier today and be unaffected when the source actually moves in stage two.
//
// Doing it in that order is deliberate. A single-commit move would change the
// import path and the source location and the core package's public roster at
// once, and if any consumer broke there would be three candidate causes. Here the
// specifier change is proved separately from the source move, and the tree is
// green after each.
//
// The roster below is also the answer to a question the repository could not
// previously answer in one place: what, exactly, is the domain surface? It is
// thirty-five components, four utilities and sixty-three types — measured from the
// source, not assembled by hand.
//
// Stage two moves the implementations here and shrinks `@tcrn/ui-react`'s roster
// by the same names. `pnpm generic:scan`'s registered debt is the counter: it goes
// to zero when stage two lands.

export {
  EvidenceAttachmentList,
  EvidenceStrip,
  GatePipeline,
  GatePipelineCompact,
  KnowledgeAttachmentList,
  KnowledgeDocumentCanvas,
  KnowledgeInlineCommentList,
  KnowledgeLabelSet,
  KnowledgeMetadataRail,
  KnowledgePageTree,
  KnowledgeSearchResults,
  KnowledgeTocRail,
  KnowledgeVersionHistory,
  MachineToken,
  MachineTokenCell,
  MetadataRail,
  RelationshipChip,
  SavedViewToolbar,
  WorkActivityFeed,
  WorkBacklogGroup,
  WorkBoard,
  WorkBoardView,
  WorkDetailLayout,
  WorkFieldPanel,
  WorkHierarchy,
  WorkIndex,
  WorkInlineCreateStatic,
  WorkItemInspector,
  WorkItemRow,
  WorkList,
  WorkManagementSubnav,
  WorkPageHeader,
  WorkQuickFilters,
  WorkSplitView,
  WorkViewTabs,
  workManagementPatternRegistry,
  knowledgeManagementPatternRegistry,
  workRelationshipTypes,
  workRelationshipLabel
} from "@tcrn/ui-react";

export type {
  EvidenceAttachment,
  EvidenceAttachmentListProps,
  EvidenceAttachmentType,
  GatePipelineGate,
  GatePipelineProps,
  KnowledgeAttachment,
  KnowledgeAttachmentListProps,
  KnowledgeComment,
  KnowledgeDocumentCanvasProps,
  KnowledgeDocumentSection,
  KnowledgeInlineCommentListProps,
  KnowledgeLabelSetProps,
  KnowledgeMetadataRailProps,
  KnowledgePageTreeItem,
  KnowledgePageTreeProps,
  KnowledgeSearchResult,
  KnowledgeSearchResultsProps,
  KnowledgeTocItem,
  KnowledgeTocRailProps,
  KnowledgeVersion,
  KnowledgeVersionHistoryProps,
  MachineTokenKind,
  MachineTokenProps,
  MetadataRailProps,
  RelationshipChipProps,
  SavedViewToolbarFilter,
  SavedViewToolbarProps,
  WorkAction,
  WorkActivityFeedItem,
  WorkActivityFeedProps,
  WorkBacklogGroupProps,
  WorkBoardCard,
  WorkBoardLane,
  WorkBoardProps,
  WorkBoardViewProps,
  WorkDetailLayoutProps,
  WorkFieldPanelProps,
  WorkHierarchyEdge,
  WorkHierarchyLevel,
  WorkHierarchyNode,
  WorkHierarchyProps,
  WorkIndexLabels,
  WorkIndexProps,
  WorkIndexRow,
  WorkInlineCreateStaticProps,
  WorkItemInspectorAction,
  WorkItemInspectorProps,
  WorkItemRowField,
  WorkItemRowProps,
  WorkListProps,
  WorkManagementPatternLevel,
  WorkManagementPatternRegistryItem,
  WorkManagementSubnavItem,
  WorkManagementSubnavProps,
  WorkPageHeaderBreadcrumb,
  WorkPageHeaderProps,
  WorkQuickFilter,
  WorkQuickFiltersProps,
  WorkRelationshipType,
  WorkSplitViewProps,
  WorkViewTab,
  WorkViewTabsProps
} from "@tcrn/ui-react";

/** Every component name this package owns. The domain surface, enumerated. */
export const domainComponentNames = [
  "EvidenceAttachmentList",
  "EvidenceStrip",
  "GatePipeline",
  "GatePipelineCompact",
  "KnowledgeAttachmentList",
  "KnowledgeDocumentCanvas",
  "KnowledgeInlineCommentList",
  "KnowledgeLabelSet",
  "KnowledgeMetadataRail",
  "KnowledgePageTree",
  "KnowledgeSearchResults",
  "KnowledgeTocRail",
  "KnowledgeVersionHistory",
  "MachineToken",
  "MachineTokenCell",
  "MetadataRail",
  "RelationshipChip",
  "SavedViewToolbar",
  "WorkActivityFeed",
  "WorkBacklogGroup",
  "WorkBoard",
  "WorkBoardView",
  "WorkDetailLayout",
  "WorkFieldPanel",
  "WorkHierarchy",
  "WorkIndex",
  "WorkInlineCreateStatic",
  "WorkItemInspector",
  "WorkItemRow",
  "WorkList",
  "WorkManagementSubnav",
  "WorkPageHeader",
  "WorkQuickFilters",
  "WorkSplitView",
  "WorkViewTabs"
] as const;

/** Domain utilities: registries and vocabulary that name product entities. */
export const domainUtilityNames = [
  "workManagementPatternRegistry",
  "knowledgeManagementPatternRegistry",
  "workRelationshipTypes",
  "workRelationshipLabel"
] as const;
