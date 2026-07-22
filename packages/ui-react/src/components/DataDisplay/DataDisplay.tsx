import type { CSSProperties, ReactNode } from "react";
import { resolveTcrnLocale, type CopyStateInput, type TcrnLocale } from "@tcrn/ui-copy-state";
import { Button } from "../Button/index.js";
import { ClipboardCopyButton } from "../Clipboard/index.js";
import { Badge, EvidenceStrip, InlineAlert, StatusBadge, StateView } from "../Feedback/index.js";
import { Heading, Text } from "../Typography/index.js";
import { Surface } from "../Layout/index.js";
import { SearchInput } from "../Form/index.js";
import { cx } from "../../utils.js";

export interface TableColumn {
  key: string;
  label: string;
}

export interface TableShellProps {
  columns: TableColumn[];
  rows: Array<Record<string, ReactNode>>;
  emptyState?: ReactNode;
  label?: string;
}

type TableShellStyle = CSSProperties & {
  "--tcrn-table-column-count"?: number;
  "--tcrn-table-shell-columns"?: string;
  "--tcrn-table-shell-min-width"?: string;
};

export function TableShell({ columns, rows, emptyState, label }: TableShellProps) {
  const columnCount = Math.max(columns.length, 1);
  const columnMinWidth = "var(--tcrn-table-shell-column-min-width, 160px)";
  const tableStyle: TableShellStyle = {
    "--tcrn-table-column-count": columnCount,
    "--tcrn-table-shell-columns": `repeat(${columnCount}, minmax(${columnMinWidth}, 1fr))`,
    "--tcrn-table-shell-min-width": `max(100%, calc(${columnCount} * ${columnMinWidth}))`
  };

  return (
    <div className="tcrn-table-shell" role="table" aria-label={label} data-mobile-layout="stacked-cards" style={tableStyle} tabIndex={0}>
      <div role="row" className="tcrn-table-shell__head">
        {columns.map((column) => (
          <span key={column.key} role="columnheader">
            {column.label}
          </span>
        ))}
      </div>
      {rows.length === 0 ? (
        <div role="row" className="tcrn-table-shell__empty-row">
          <div role="cell" aria-colspan={columnCount} className="tcrn-table-shell__empty">
            {emptyState ?? "No rows"}
          </div>
        </div>
      ) : (
        rows.map((row, rowIndex) => (
          <div role="row" key={rowIndex} className="tcrn-table-shell__row">
            {columns.map((column) => (
              <span key={column.key} role="cell" data-label={column.label} className="tcrn-table-shell__cell">
                {row[column.key]}
              </span>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

export interface KeyValueItem {
  key: string;
  label: string;
  value: ReactNode;
}

export function KeyValueList({ items }: { items: KeyValueItem[] }) {
  return (
    <dl className="tcrn-key-value-list">
      {items.map((item) => (
        <div key={item.key}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export interface WorkIndexRow {
  id: string;
  title: string;
  state: CopyStateInput;
  owner: string;
}

export interface WorkIndexLabels {
  title: string;
  state: string;
  owner: string;
  emptyState: string;
}

export interface WorkIndexProps {
  rows: WorkIndexRow[];
  label?: string;
  locale?: TcrnLocale | string;
  labels?: Partial<WorkIndexLabels>;
}

const workIndexLabels: Record<TcrnLocale, WorkIndexLabels> = {
  "zh-CN": {
    title: "工作项",
    state: "状态",
    owner: "负责人",
    emptyState: "暂无工作项"
  },
  en: {
    title: "Work item",
    state: "State",
    owner: "Owner",
    emptyState: "No work items"
  },
  ja: {
    title: "作業項目",
    state: "状態",
    owner: "担当者",
    emptyState: "作業項目はありません"
  },
  ko: {
    title: "작업 항목",
    state: "상태",
    owner: "담당자",
    emptyState: "작업 항목 없음"
  },
  fr: {
    title: "Élément de travail",
    state: "État",
    owner: "Responsable",
    emptyState: "Aucun élément de travail"
  }
};

function resolveWorkIndexLabels(locale: TcrnLocale | string | undefined, labels: Partial<WorkIndexLabels> | undefined): WorkIndexLabels {
  const resolvedLocale = resolveTcrnLocale(locale);
  return { ...workIndexLabels[resolvedLocale], ...labels };
}

export function WorkIndex({ rows, label = "Work index", locale, labels }: WorkIndexProps) {
  const copy = resolveWorkIndexLabels(locale, labels);
  return (
    <TableShell
      label={label}
      columns={[
        { key: "title", label: copy.title },
        { key: "state", label: copy.state },
        { key: "owner", label: copy.owner }
      ]}
      rows={rows.map((row) => ({
        title: row.title,
        state: <StatusBadge state={row.state} locale={locale} />,
        owner: row.owner
      }))}
      emptyState={<StateView state={{ state: "not_configured" }} title={copy.emptyState} locale={locale} />}
    />
  );
}

export interface FilterBarProps {
  label: string;
  children: ReactNode;
}

export function FilterBar({ label, children }: FilterBarProps) {
  return (
    <section className="tcrn-filter-bar" aria-label={label}>
      {children}
    </section>
  );
}

export interface TableToolbarFilterOption {
  id: string;
  label: string;
}

export interface TableToolbarProps {
  label: string;
  controlsId: string;
  searchLabel: string;
  searchPlaceholder?: string;
  filterLabel?: string;
  filterOptions?: TableToolbarFilterOption[];
  allFilterLabel?: string;
  matchCountFormat?: string;
  collapseLabel?: string;
  expandLabel?: string;
}

/* A dense table's tools: text search, optional key-based filter chips, a live match
   count, and an optional collapse control. The component is presentational and
   host-agnostic — it declares a data-attribute contract (data-table-toolbar-*) that
   the host wires: rows match a chip when they contain an element whose
   data-table-filter-key lists the chip's id, and match the search when their visible
   text contains the query. Both labels of the collapse control stay in the DOM so
   locale swaps keep working. */
export function TableToolbar({
  label,
  controlsId,
  searchLabel,
  searchPlaceholder,
  filterLabel,
  filterOptions,
  allFilterLabel = "All",
  matchCountFormat = "{shown} / {total}",
  collapseLabel,
  expandLabel
}: TableToolbarProps) {
  return (
    <div role="group" className="tcrn-table-toolbar" aria-label={label} data-table-toolbar="true" data-table-toolbar-target={controlsId}>
      <SearchInput
        aria-label={searchLabel}
        placeholder={searchPlaceholder}
        aria-controls={controlsId}
        data-table-toolbar-search="true"
      />
      {filterOptions && filterOptions.length > 0 ? (
        <FilterBar label={filterLabel ?? label}>
          <button type="button" className="tcrn-table-toolbar__chip" aria-pressed="true" data-table-toolbar-filter="">
            {allFilterLabel}
          </button>
          {filterOptions.map((option) => (
            <button key={option.id}
              type="button"
              className="tcrn-table-toolbar__chip"
              aria-pressed="false"
              data-table-toolbar-filter={option.id}
            >
              {option.label}
            </button>
          ))}
        </FilterBar>
      ) : null}
      <span className="tcrn-table-toolbar__count" data-table-toolbar-count={matchCountFormat} aria-live="polite" />
      {collapseLabel ? (
        <button
          type="button"
          className="tcrn-table-toolbar__collapse"
          data-table-toolbar-collapse="true"
          aria-expanded="true"
          aria-controls={controlsId}
        >
          <span data-table-toolbar-collapse-label="collapse">{collapseLabel}</span>
          <span data-table-toolbar-collapse-label="expand">{expandLabel ?? collapseLabel}</span>
        </button>
      ) : null}
    </div>
  );
}

export interface DetailInspectorProps {
  title: string;
  items: KeyValueItem[];
}

export function DetailInspector({ title, items }: DetailInspectorProps) {
  return (
    <Surface className="tcrn-detail-inspector">
      <Heading level={3}>{title}</Heading>
      <KeyValueList items={items} />
    </Surface>
  );
}

export const workRelationshipTypes = [
  "blocks",
  "blocked_by",
  "depends_on",
  "relates_to",
  "duplicates",
  "supersedes",
  "split_from",
  "caused_by",
  "implements",
  "verifies",
  "reviews",
  "refreshes"
] as const;

export type WorkRelationshipType = (typeof workRelationshipTypes)[number];

export type WorkManagementPatternLevel = "primitive" | "pattern" | "composite";
export type WorkDensity = "comfortable" | "compact" | "dense";

export interface WorkManagementPatternRegistryItem {
  candidateId: string;
  componentName: string;
  level: WorkManagementPatternLevel;
  purpose: string;
}

export const workManagementPatternRegistry: WorkManagementPatternRegistryItem[] = [
  {
    candidateId: "18-work-management-subnav",
    componentName: "WorkManagementSubnav",
    level: "pattern",
    purpose: "Dense in-module navigation for Work Management pages without global search."
  },
  {
    candidateId: "19-work-board-lane",
    componentName: "WorkBoard",
    level: "composite",
    purpose: "Read-only work board lanes with status counts and local overflow containment."
  },
  {
    candidateId: "20-work-hierarchy-graph",
    componentName: "WorkHierarchy",
    level: "composite",
    purpose: "Initiative, Epic, Story, Work Item, and Evidence Task hierarchy with table fallback."
  },
  {
    candidateId: "21-relationship-chip",
    componentName: "RelationshipChip",
    level: "primitive",
    purpose: "Relationship vocabulary display for blocks, depends_on, verifies, reviews, refreshes, and related edges."
  },
  {
    candidateId: "22-gate-pipeline",
    componentName: "GatePipeline",
    level: "pattern",
    purpose: "Gate sequence status, owner, evidence, and next-action scanning without readiness overclaim."
  },
  {
    candidateId: "23-evidence-attachment",
    componentName: "EvidenceAttachmentList",
    level: "composite",
    purpose: "Compact evidence references for screenshots, artifact directories, QA summaries, API readbacks, commits, and previews."
  },
  {
    candidateId: "24-work-item-inspector",
    componentName: "WorkItemInspector",
    level: "composite",
    purpose: "Structured Work Item detail surface with hierarchy, status, subtasks, evidence tasks, and guarded actions."
  },
  {
    candidateId: "25-saved-view-toolbar",
    componentName: "SavedViewToolbar",
    level: "pattern",
    purpose: "Saved Work views and local filter chips without ProductShell global search."
  },
  {
    candidateId: "26-machine-token",
    componentName: "MachineToken",
    level: "primitive",
    purpose: "Readable route, thread, commit, and artifact tokens that preserve full values while preventing cell overlap."
  },
  {
    candidateId: "27-machine-token-cell",
    componentName: "MachineTokenCell",
    level: "primitive",
    purpose: "Dense route, thread, commit, artifact, and Work item token cell with full metadata preserved."
  },
  {
    candidateId: "28-work-page-header",
    componentName: "WorkPageHeader",
    level: "pattern",
    purpose: "Compact Work page context, breadcrumbs, metadata, and guarded static actions without proof material dominating the first viewport."
  },
  {
    candidateId: "29-work-view-tabs",
    componentName: "WorkViewTabs",
    level: "pattern",
    purpose: "Local Work view navigation that stays separate from ProductShell global navigation and search."
  },
  {
    candidateId: "30-work-quick-filters",
    componentName: "WorkQuickFilters",
    level: "pattern",
    purpose: "Compact Work-scoped filters and static action affordances without fake global search."
  },
  {
    candidateId: "31-work-item-row",
    componentName: "WorkItemRow",
    level: "primitive",
    purpose: "Dense Work item row with inline status, owner, priority, rank, fields, and relationship metadata."
  },
  {
    candidateId: "32-work-list",
    componentName: "WorkList",
    level: "composite",
    purpose: "Dense selected Work item list with optional detail rail handoff and mobile-safe row stacking."
  },
  {
    candidateId: "33-work-split-view",
    componentName: "WorkSplitView",
    level: "composite",
    purpose: "List and detail composition with stable primary pane and metadata rail regions."
  },
  {
    candidateId: "34-work-backlog-group",
    componentName: "WorkBacklogGroup",
    level: "composite",
    purpose: "Grouped Work backlog rows with static inline-create affordance and disabled route-owned actions."
  },
  {
    candidateId: "35-work-inline-create-static",
    componentName: "WorkInlineCreateStatic",
    level: "pattern",
    purpose: "Static create affordance that communicates no backend mutation or live dispatch is wired."
  },
  {
    candidateId: "36-work-board-view",
    componentName: "WorkBoardView",
    level: "composite",
    purpose: "Compact board columns and dense cards with local overflow containment."
  },
  {
    candidateId: "37-work-detail-layout",
    componentName: "WorkDetailLayout",
    level: "composite",
    purpose: "Work detail main pane, metadata rail, and activity region with long-token containment."
  },
  {
    candidateId: "38-metadata-rail",
    componentName: "MetadataRail",
    level: "pattern",
    purpose: "Compact metadata rail for owners, gates, proof basis, and disabled route-owned actions."
  },
  {
    candidateId: "39-work-field-panel",
    componentName: "WorkFieldPanel",
    level: "pattern",
    purpose: "Compact Work field grouping for status, owner, basis, evidence, and route metadata."
  },
  {
    candidateId: "40-work-activity-feed",
    componentName: "WorkActivityFeed",
    level: "composite",
    purpose: "Static route, return, evidence, and activity chronology with no live dispatch claim."
  },
  {
    candidateId: "41-gate-pipeline-compact",
    componentName: "GatePipelineCompact",
    level: "pattern",
    purpose: "Compact gate scan variant for Work pages where gate status supports task context."
  }
];

export const knowledgeManagementPatternRegistry: WorkManagementPatternRegistryItem[] = [
  {
    candidateId: "42-knowledge-page-tree",
    componentName: "KnowledgePageTree",
    level: "pattern",
    purpose: "Dense page tree navigation for static Knowledge surfaces without external vendor integration."
  },
  {
    candidateId: "43-knowledge-document-canvas",
    componentName: "KnowledgeDocumentCanvas",
    level: "composite",
    purpose: "Readable document canvas with metadata, labels, and section content using TCRN-owned typography."
  },
  {
    candidateId: "44-knowledge-toc-rail",
    componentName: "KnowledgeTocRail",
    level: "pattern",
    purpose: "Local table of contents rail with current-anchor display and mobile-safe wrapping."
  },
  {
    candidateId: "45-knowledge-inline-comment-list",
    componentName: "KnowledgeInlineCommentList",
    level: "composite",
    purpose: "Static inline comment discussion list with no collaboration, notification, or live edit claim."
  },
  {
    candidateId: "46-knowledge-metadata-rail",
    componentName: "KnowledgeMetadataRail",
    level: "pattern",
    purpose: "Knowledge page owner, state, version, proof, and policy metadata rail."
  },
  {
    candidateId: "47-knowledge-attachment-list",
    componentName: "KnowledgeAttachmentList",
    level: "composite",
    purpose: "Static attachment references using evidence-safe token containment."
  },
  {
    candidateId: "48-knowledge-label-set",
    componentName: "KnowledgeLabelSet",
    level: "primitive",
    purpose: "Compact Knowledge labels for classification, topic, and policy markers."
  },
  {
    candidateId: "49-knowledge-version-history",
    componentName: "KnowledgeVersionHistory",
    level: "composite",
    purpose: "Static version list that does not imply live publishing or collaborative editing."
  },
  {
    candidateId: "50-knowledge-template-gallery",
    componentName: "KnowledgeTemplateGallery",
    level: "composite",
    purpose: "Template cards for owner-reviewed Knowledge drafting without backend create flow."
  },
  {
    candidateId: "51-knowledge-search-results",
    componentName: "KnowledgeSearchResults",
    level: "composite",
    purpose: "Static local Knowledge result list for design confirmation only, not product-wide search."
  }
];

const relationshipLabels: Record<WorkRelationshipType, string> = {
  blocks: "blocks",
  blocked_by: "blocked by",
  depends_on: "depends on",
  relates_to: "relates to",
  duplicates: "duplicates",
  supersedes: "supersedes",
  split_from: "split from",
  caused_by: "caused by",
  implements: "implements",
  verifies: "verifies",
  reviews: "reviews",
  refreshes: "refreshes"
};

const relationshipTone: Record<WorkRelationshipType, "neutral" | "positive" | "warning" | "danger"> = {
  blocks: "warning",
  blocked_by: "danger",
  depends_on: "warning",
  relates_to: "neutral",
  duplicates: "neutral",
  supersedes: "positive",
  split_from: "neutral",
  caused_by: "warning",
  implements: "positive",
  verifies: "positive",
  reviews: "positive",
  refreshes: "positive"
};

export interface RelationshipChipProps {
  relation: WorkRelationshipType;
  target: string;
  href?: string;
  source?: string;
  disabled?: boolean;
}

export function RelationshipChip({ relation, target, href, source, disabled = false }: RelationshipChipProps) {
  const label = relationshipLabels[relation];
  const title = source ? `${source} ${label} ${target}` : `${label} ${target}`;
  const content = (
    <>
      <span className="tcrn-relationship-chip__label">{label}</span>
      <span className="tcrn-relationship-chip__target">{target}</span>
    </>
  );

  if (href && !disabled) {
    return (
      <a
        href={href}
        className={cx("tcrn-relationship-chip", `tcrn-relationship-chip--${relationshipTone[relation]}`)}
        data-work-relationship={relation}
        title={title}
        aria-label={title}
      >
        {content}
      </a>
    );
  }

  return (
    <Badge
      className={cx("tcrn-relationship-chip", `tcrn-relationship-chip--${relationshipTone[relation]}`)}
      data-work-relationship={relation}
      data-disabled={disabled || undefined}
      title={title}
      aria-label={title}
    >
      {content}
    </Badge>
  );
}

export type MachineTokenKind = "route" | "thread" | "commit" | "artifact" | "work-item" | "generic";

export interface MachineTokenProps {
  token: string;
  label?: string;
  kind?: MachineTokenKind;
  copyable?: boolean;
  density?: WorkDensity;
}

export function MachineToken({ token, label, kind = "generic", copyable = false, density = "comfortable" }: MachineTokenProps) {
  const accessibleLabel = label ? `${label}: ${token}` : token;
  return (
    <span
      className={cx("tcrn-machine-token", density === "compact" && "tcrn-machine-token--compact")}
      data-density={density}
      data-machine-token-kind={kind}
      data-full-token={token}
      title={token}
      aria-label={accessibleLabel}
    >
      {label ? <span className="tcrn-machine-token__label">{label}</span> : null}
      <code className="tcrn-machine-token__value">{token}</code>
      {copyable ? (
        <ClipboardCopyButton
          text={token}
          ariaLabel={`Copy ${label ?? kind} token`}
          idleLabel="Copy"
          size="sm"
          variant="quiet"
          className="tcrn-machine-token__copy"
        />
      ) : null}
    </span>
  );
}

export function MachineTokenCell(props: MachineTokenProps) {
  return (
    <span className="tcrn-machine-token-cell" data-work-management-pattern="machine-token-cell">
      <MachineToken {...props} density={props.density ?? "compact"} />
    </span>
  );
}

export interface WorkManagementSubnavItem {
  id: string;
  label: string;
  href?: string;
  current?: boolean;
  count?: number;
  disabled?: boolean;
}

export interface WorkManagementSubnavProps {
  label?: string;
  items: WorkManagementSubnavItem[];
}

export function WorkManagementSubnav({ label = "Work Management views", items }: WorkManagementSubnavProps) {
  return (
    <nav className="tcrn-work-management-subnav" aria-label={label} data-work-management-pattern="subnav">
      {items.map((item) => {
        const content = (
          <>
            <span>{item.label}</span>
            {typeof item.count === "number" ? <Badge>{item.count}</Badge> : null}
          </>
        );
        if (item.href && !item.disabled) {
          return (
            <a key={item.id} href={item.href} aria-current={item.current ? "page" : undefined} data-selected={item.current || undefined}>
              {content}
            </a>
          );
        }
        return (
          <span key={item.id} aria-disabled={item.disabled || undefined} data-selected={item.current || undefined}>
            {content}
          </span>
        );
      })}
    </nav>
  );
}

export interface SavedViewToolbarFilter {
  id: string;
  label: string;
  value: string;
}

export interface SavedViewToolbarProps {
  label?: string;
  views: WorkManagementSubnavItem[];
  filters: SavedViewToolbarFilter[];
  resetLabel?: string;
}

export function SavedViewToolbar({ label = "Saved Work views", views, filters, resetLabel = "Reset view" }: SavedViewToolbarProps) {
  return (
    <section className="tcrn-saved-view-toolbar" aria-label={label} data-work-management-pattern="saved-view-toolbar">
      <WorkManagementSubnav label={`${label} tabs`} items={views} />
      <FilterBar label={`${label} filters`}>
        {filters.map((filter) => (
          <Badge key={filter.id} title={`${filter.label}: ${filter.value}`}>
            {filter.label}: {filter.value}
          </Badge>
        ))}
        <Button type="button" variant="quiet" size="sm" disabled disabledReason="Static Storybook fixture; product route owns saved view changes">
          {resetLabel}
        </Button>
      </FilterBar>
    </section>
  );
}

export interface WorkPageHeaderBreadcrumb {
  id: string;
  label: string;
  href?: string;
}

export interface WorkAction {
  id: string;
  label: string;
  disabledReason: string;
}

export interface WorkPageHeaderProps {
  title: string;
  description?: ReactNode;
  breadcrumbs?: WorkPageHeaderBreadcrumb[];
  meta?: ReactNode;
  actions?: WorkAction[];
  density?: WorkDensity;
}

export function WorkPageHeader({ title, description, breadcrumbs = [], meta, actions = [], density = "compact" }: WorkPageHeaderProps) {
  return (
    <header className={cx("tcrn-work-page-header", `tcrn-work-page-header--${density}`)} data-work-management-pattern="work-page-header" data-density={density}>
      {breadcrumbs.length ? (
        <nav className="tcrn-work-page-header__breadcrumbs" aria-label="Work breadcrumbs">
          {breadcrumbs.map((breadcrumb, index) => (
            <span key={breadcrumb.id} className="tcrn-work-page-header__breadcrumb">
              {breadcrumb.href ? <a href={breadcrumb.href}>{breadcrumb.label}</a> : <span>{breadcrumb.label}</span>}
              {index < breadcrumbs.length - 1 ? <span aria-hidden="true">/</span> : null}
            </span>
          ))}
        </nav>
      ) : null}
      <div className="tcrn-work-page-header__body">
        <div className="tcrn-work-page-header__title">
          <Heading level={2}>{title}</Heading>
          {description ? <Text>{description}</Text> : null}
        </div>
        {meta ? <div className="tcrn-work-page-header__meta">{meta}</div> : null}
        {actions.length ? (
          <div className="tcrn-work-page-header__actions">
            {actions.map((action) => (
              <Button key={action.id} type="button" size="sm" disabled disabledReason={action.disabledReason}>
                {action.label}
              </Button>
            ))}
          </div>
        ) : null}
      </div>
    </header>
  );
}

export type WorkViewTab = WorkManagementSubnavItem;

export interface WorkViewTabsProps {
  label?: string;
  tabs: WorkViewTab[];
}

export function WorkViewTabs({ label = "Work views", tabs }: WorkViewTabsProps) {
  return (
    <nav className="tcrn-work-view-tabs" aria-label={label} data-work-management-pattern="work-view-tabs">
      {tabs.map((tab) => {
        const content = (
          <>
            <span>{tab.label}</span>
            {typeof tab.count === "number" ? <Badge>{tab.count}</Badge> : null}
          </>
        );
        if (tab.href && !tab.disabled) {
          return (
            <a key={tab.id} href={tab.href} aria-current={tab.current ? "page" : undefined} data-selected={tab.current || undefined}>
              {content}
            </a>
          );
        }
        return (
          <span key={tab.id} aria-disabled={tab.disabled || undefined} data-selected={tab.current || undefined}>
            {content}
          </span>
        );
      })}
    </nav>
  );
}

export interface WorkQuickFilter {
  id: string;
  label: string;
  value?: string;
  href?: string;
  current?: boolean;
  count?: number;
  disabled?: boolean;
  disabledReason?: string;
}

export interface WorkQuickFiltersProps {
  label?: string;
  filters: WorkQuickFilter[];
  density?: WorkDensity;
}

export function WorkQuickFilters({ label = "Work quick filters", filters, density = "compact" }: WorkQuickFiltersProps) {
  return (
    <section className={cx("tcrn-work-quick-filters", `tcrn-work-quick-filters--${density}`)} aria-label={label} data-work-management-pattern="work-quick-filters" data-density={density}>
      {filters.map((filter) => {
        const content = (
          <>
            <span>{filter.label}</span>
            {filter.value ? <span className="tcrn-work-quick-filters__value">{filter.value}</span> : null}
            {typeof filter.count === "number" ? <Badge>{filter.count}</Badge> : null}
          </>
        );
        if (filter.href && !filter.disabled) {
          return (
            <a key={filter.id} href={filter.href} aria-current={filter.current ? "page" : undefined} data-selected={filter.current || undefined}>
              {content}
            </a>
          );
        }
        return (
          <span key={filter.id} aria-disabled={filter.disabled || undefined} data-selected={filter.current || undefined} title={filter.disabledReason}>
            {content}
          </span>
        );
      })}
    </section>
  );
}

export interface WorkItemRowField {
  key: string;
  label: string;
  value: ReactNode;
}

export interface WorkItemRowProps {
  id: string;
  title: string;
  state: CopyStateInput;
  owner: string;
  href?: string;
  selected?: boolean;
  rank?: string;
  priority?: string;
  summary?: ReactNode;
  fields?: WorkItemRowField[];
  relationships?: RelationshipChipProps[];
  density?: WorkDensity;
}

function WorkItemRowBody({ id, title, state, owner, rank, priority, summary, fields = [], relationships = [], density = "compact" }: WorkItemRowProps) {
  return (
    <>
      <div className="tcrn-work-item-row__id">
        <MachineTokenCell token={id} kind="work-item" density={density} />
        {rank ? <Badge>{rank}</Badge> : null}
      </div>
      <div className="tcrn-work-item-row__summary">
        <strong>{title}</strong>
        {summary ? <Text>{summary}</Text> : null}
      </div>
      <div className="tcrn-work-item-row__meta">
        <StatusBadge state={state} />
        {priority ? <Badge>{priority}</Badge> : null}
        <Badge>{owner}</Badge>
        {fields.map((field) => (
          <span key={field.key} className="tcrn-work-item-row__field">
            <span>{field.label}</span>
            <strong>{field.value}</strong>
          </span>
        ))}
      </div>
      {relationships.length ? (
        <div className="tcrn-work-item-row__relationships" aria-label={`${title} relationships`}>
          {relationships.map((relationship, index) => (
            <RelationshipChip key={`${relationship.relation}-${relationship.target}-${index}`} {...relationship} source={id} />
          ))}
        </div>
      ) : null}
    </>
  );
}

export function WorkItemRow(props: WorkItemRowProps) {
  const { href, selected = false, density = "compact", title } = props;
  const className = cx("tcrn-work-item-row", `tcrn-work-item-row--${density}`);
  if (href) {
    return (
      <a className={className} href={href} aria-label={title} data-selected={selected || undefined} data-work-management-pattern="work-item-row" data-density={density}>
        <WorkItemRowBody {...props} density={density} />
      </a>
    );
  }
  return (
    <article className={className} aria-label={title} data-selected={selected || undefined} data-work-management-pattern="work-item-row" data-density={density}>
      <WorkItemRowBody {...props} density={density} />
    </article>
  );
}

export interface WorkListProps {
  label?: string;
  rows: WorkItemRowProps[];
  density?: WorkDensity;
}

export function WorkList({ label = "Work list", rows, density = "compact" }: WorkListProps) {
  return (
    <section className={cx("tcrn-work-list", `tcrn-work-list--${density}`)} aria-label={label} data-work-management-pattern="work-list" data-density={density}>
      {rows.map((row) => (
        <WorkItemRow key={row.id} {...row} density={row.density ?? density} />
      ))}
    </section>
  );
}

export interface WorkSplitViewProps {
  label?: string;
  list: ReactNode;
  detail: ReactNode;
  density?: WorkDensity;
}

export function WorkSplitView({ label = "Work split view", list, detail, density = "compact" }: WorkSplitViewProps) {
  return (
    <section className={cx("tcrn-work-split-view", `tcrn-work-split-view--${density}`)} aria-label={label} data-work-management-pattern="work-split-view" data-density={density}>
      <div className="tcrn-work-split-view__list">{list}</div>
      <div className="tcrn-work-split-view__detail">{detail}</div>
    </section>
  );
}

export interface WorkInlineCreateStaticProps {
  label?: string;
  disabledReason: string;
  hint?: ReactNode;
}

export function WorkInlineCreateStatic({ label = "Add work item", disabledReason, hint }: WorkInlineCreateStaticProps) {
  return (
    <div className="tcrn-work-inline-create-static" data-work-management-pattern="work-inline-create-static">
      <Button type="button" size="sm" disabled disabledReason={disabledReason}>
        {label}
      </Button>
      {hint ? <Text>{hint}</Text> : null}
    </div>
  );
}

export interface WorkBacklogGroupProps {
  title: string;
  description?: ReactNode;
  rows: WorkItemRowProps[];
  actions?: WorkAction[];
  inlineCreate?: WorkInlineCreateStaticProps;
  density?: WorkDensity;
}

export function WorkBacklogGroup({ title, description, rows, actions = [], inlineCreate, density = "compact" }: WorkBacklogGroupProps) {
  return (
    <section className={cx("tcrn-work-backlog-group", `tcrn-work-backlog-group--${density}`)} aria-label={title} data-work-management-pattern="work-backlog-group" data-density={density}>
      <div className="tcrn-work-backlog-group__head">
        <div>
          <Heading level={3}>{title}</Heading>
          {description ? <Text>{description}</Text> : null}
        </div>
        <Badge>{rows.length}</Badge>
        {actions.length ? (
          <div className="tcrn-work-backlog-group__actions">
            {actions.map((action) => (
              <Button key={action.id} type="button" size="sm" disabled disabledReason={action.disabledReason}>
                {action.label}
              </Button>
            ))}
          </div>
        ) : null}
      </div>
      <WorkList label={`${title} rows`} rows={rows} density={density} />
      {inlineCreate ? <WorkInlineCreateStatic {...inlineCreate} /> : null}
    </section>
  );
}

export interface WorkBoardCard {
  id: string;
  title: string;
  state: CopyStateInput;
  owner: string;
  meta?: ReactNode;
  priority?: string;
  fields?: WorkItemRowField[];
  relationships?: RelationshipChipProps[];
}

export interface WorkBoardLane {
  id: string;
  title: string;
  state?: CopyStateInput;
  cards: WorkBoardCard[];
}

export interface WorkBoardProps {
  label?: string;
  lanes: WorkBoardLane[];
  density?: WorkDensity;
}

export function WorkBoard({ label = "Work board", lanes, density = "comfortable" }: WorkBoardProps) {
  return (
    <section className={cx("tcrn-work-board", `tcrn-work-board--${density}`)} aria-label={label} data-work-management-pattern="work-board" data-density={density}>
      {lanes.map((lane) => (
        <Surface key={lane.id} className="tcrn-work-board__lane" data-work-board-lane={lane.id}>
          <div className="tcrn-work-board__lane-head">
            <Heading level={3}>{lane.title}</Heading>
            <Badge>{lane.cards.length}</Badge>
            {lane.state ? <StatusBadge state={lane.state} /> : null}
          </div>
          <div className="tcrn-work-board__cards">
            {lane.cards.map((card) => (
              <article key={card.id} className="tcrn-work-board__card" aria-label={card.title}>
                <div className="tcrn-work-board__card-head">
                  <MachineTokenCell token={card.id} kind="work-item" density={density} />
                  <StatusBadge state={card.state} />
                  {card.priority ? <Badge>{card.priority}</Badge> : null}
                </div>
                <strong>{card.title}</strong>
                <Text>{card.owner}</Text>
                {card.meta ? <div className="tcrn-work-board__card-meta">{card.meta}</div> : null}
                {card.fields?.length ? (
                  <div className="tcrn-work-board__card-fields">
                    {card.fields.map((field) => (
                      <span key={field.key} className="tcrn-work-board__card-field">
                        <span>{field.label}</span>
                        <strong>{field.value}</strong>
                      </span>
                    ))}
                  </div>
                ) : null}
                {card.relationships?.length ? (
                  <div className="tcrn-work-board__relations" aria-label={`${card.title} relationships`}>
                    {card.relationships.map((relationship, index) => (
                      <RelationshipChip key={`${relationship.relation}-${relationship.target}-${index}`} {...relationship} source={card.id} />
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </Surface>
      ))}
    </section>
  );
}

export interface WorkBoardViewProps extends WorkBoardProps {
  toolbar?: ReactNode;
}

export function WorkBoardView({ toolbar, density = "compact", ...props }: WorkBoardViewProps) {
  return (
    <section className={cx("tcrn-work-board-view", `tcrn-work-board-view--${density}`)} data-work-management-pattern="work-board-view" data-density={density}>
      {toolbar ? <div className="tcrn-work-board-view__toolbar">{toolbar}</div> : null}
      <WorkBoard {...props} density={density} />
    </section>
  );
}

export type WorkHierarchyLevel = "Initiative" | "Epic" | "Story" | "Task / Work Item" | "Subtask / Evidence Task";

export interface WorkHierarchyNode {
  id: string;
  level: WorkHierarchyLevel;
  title: string;
  state?: CopyStateInput;
  owner?: string;
  parentId?: string;
}

export interface WorkHierarchyEdge {
  from: string;
  to: string;
  relation: WorkRelationshipType;
}

export interface WorkHierarchyProps {
  label?: string;
  nodes: WorkHierarchyNode[];
  edges: WorkHierarchyEdge[];
}

export function WorkHierarchy({ label = "Work hierarchy", nodes, edges }: WorkHierarchyProps) {
  return (
    <section className="tcrn-work-hierarchy" aria-label={label} data-work-management-pattern="work-hierarchy">
      <div className="tcrn-work-hierarchy__levels">
        {nodes.map((node) => (
          <Surface key={node.id} className="tcrn-work-hierarchy__node" data-work-hierarchy-level={node.level}>
            <MachineToken token={node.id} kind="work-item" />
            <Heading level={3}>{node.title}</Heading>
            <Text>{node.level}</Text>
            {node.owner ? <Badge>{node.owner}</Badge> : null}
            {node.state ? <StatusBadge state={node.state} /> : null}
            {node.parentId ? <Text>Parent: {node.parentId}</Text> : null}
          </Surface>
        ))}
      </div>
      <TableShell
        label={`${label} relationship fallback`}
        columns={[
          { key: "from", label: "From" },
          { key: "relationship", label: "Relationship" },
          { key: "to", label: "To" }
        ]}
        rows={edges.map((edge) => ({
          from: <MachineToken token={edge.from} kind="work-item" />,
          relationship: <RelationshipChip relation={edge.relation} target={edge.to} source={edge.from} />,
          to: <MachineToken token={edge.to} kind="work-item" />
        }))}
      />
    </section>
  );
}

export interface GatePipelineGate {
  id: string;
  label: string;
  state: CopyStateInput;
  owner: string;
  evidence: string[];
  nextAction?: string;
}

export interface GatePipelineProps {
  label?: string;
  gates: GatePipelineGate[];
  density?: WorkDensity;
}

export function GatePipeline({ label = "Gate pipeline", gates, density = "comfortable" }: GatePipelineProps) {
  return (
    <section className={cx("tcrn-gate-pipeline", `tcrn-gate-pipeline--${density}`)} aria-label={label} data-work-management-pattern="gate-pipeline" data-density={density}>
      <TableShell
        label={label}
        columns={[
          { key: "gate", label: "Gate" },
          { key: "state", label: "State" },
          { key: "owner", label: "Owner" },
          { key: "evidence", label: "Evidence" },
          { key: "next", label: "Next action" }
        ]}
        rows={gates.map((gate) => ({
          gate: gate.label,
          state: <StatusBadge state={gate.state} />,
          owner: gate.owner,
          evidence: <EvidenceStrip items={gate.evidence} />,
          next: gate.nextAction ?? "No downstream claim"
        }))}
      />
      <InlineAlert tone="warning">GatePipeline is presentation-only; readiness and owner handoff remain route-owned.</InlineAlert>
    </section>
  );
}

export function GatePipelineCompact(props: GatePipelineProps) {
  return <GatePipeline {...props} density="compact" />;
}

export type EvidenceAttachmentType = "screenshot" | "artifact_dir" | "qa_summary" | "api_readback" | "commit" | "preview" | "policy" | "redacted";

export interface EvidenceAttachment {
  id: string;
  type: EvidenceAttachmentType;
  label: string;
  reference: string;
  state?: CopyStateInput;
}

export interface EvidenceAttachmentListProps {
  label?: string;
  items: EvidenceAttachment[];
  density?: WorkDensity;
}

export function EvidenceAttachmentList({ label = "Evidence attachments", items, density = "comfortable" }: EvidenceAttachmentListProps) {
  return (
    <section className={cx("tcrn-evidence-attachment-list", `tcrn-evidence-attachment-list--${density}`)} aria-label={label} data-work-management-pattern="evidence-attachment-list" data-density={density}>
      <TableShell
        label={label}
        columns={[
          { key: "type", label: "Type" },
          { key: "label", label: "Label" },
          { key: "reference", label: "Reference" },
          { key: "state", label: "State" }
        ]}
        rows={items.map((item) => ({
          type: item.type,
          label: item.label,
          reference: <MachineTokenCell token={item.reference} label={item.id} kind={item.type === "commit" ? "commit" : item.type === "artifact_dir" ? "artifact" : "generic"} density={density} />,
          state: item.state ? <StatusBadge state={item.state} /> : <StatusBadge state={{ state: "local_only" }} />
        }))}
      />
    </section>
  );
}

export interface WorkFieldPanelProps {
  title: string;
  items: KeyValueItem[];
  density?: WorkDensity;
}

export function WorkFieldPanel({ title, items, density = "compact" }: WorkFieldPanelProps) {
  return (
    <Surface className={cx("tcrn-work-field-panel", `tcrn-work-field-panel--${density}`)} data-work-management-pattern="work-field-panel" data-density={density}>
      <Heading level={3}>{title}</Heading>
      <KeyValueList items={items} />
    </Surface>
  );
}

export interface MetadataRailProps {
  title?: string;
  items: KeyValueItem[];
  actions?: WorkAction[];
  density?: WorkDensity;
}

export function MetadataRail({ title = "Metadata", items, actions = [], density = "compact" }: MetadataRailProps) {
  return (
    <aside className={cx("tcrn-metadata-rail", `tcrn-metadata-rail--${density}`)} data-work-management-pattern="metadata-rail" data-density={density}>
      <WorkFieldPanel title={title} items={items} density={density} />
      {actions.length ? (
        <div className="tcrn-metadata-rail__actions">
          {actions.map((action) => (
            <Button key={action.id} type="button" size="sm" disabled disabledReason={action.disabledReason}>
              {action.label}
            </Button>
          ))}
        </div>
      ) : null}
    </aside>
  );
}

export interface WorkActivityFeedItem {
  id: string;
  actor: string;
  action: string;
  timestamp?: string;
  summary?: ReactNode;
  state?: CopyStateInput;
  evidence?: EvidenceAttachment[];
}

export interface WorkActivityFeedProps {
  label?: string;
  items: WorkActivityFeedItem[];
  density?: WorkDensity;
}

export function WorkActivityFeed({ label = "Work activity", items, density = "compact" }: WorkActivityFeedProps) {
  return (
    <section className={cx("tcrn-work-activity-feed", `tcrn-work-activity-feed--${density}`)} aria-label={label} data-work-management-pattern="work-activity-feed" data-density={density}>
      {items.map((item) => (
        <article key={item.id} className="tcrn-work-activity-feed__item">
          <div className="tcrn-work-activity-feed__head">
            <strong>{item.actor}</strong>
            <span>{item.action}</span>
            {item.timestamp ? <time>{item.timestamp}</time> : null}
            {item.state ? <StatusBadge state={item.state} /> : null}
          </div>
          {item.summary ? <Text>{item.summary}</Text> : null}
          {item.evidence?.length ? <EvidenceAttachmentList label={`${item.id} evidence`} items={item.evidence} density={density} /> : null}
        </article>
      ))}
    </section>
  );
}

export interface WorkDetailLayoutProps {
  title: string;
  summary?: ReactNode;
  state?: CopyStateInput;
  main: ReactNode;
  metadata: ReactNode;
  activity?: ReactNode;
  actions?: WorkAction[];
  density?: WorkDensity;
}

export function WorkDetailLayout({ title, summary, state, main, metadata, activity, actions = [], density = "compact" }: WorkDetailLayoutProps) {
  return (
    <section className={cx("tcrn-work-detail-layout", `tcrn-work-detail-layout--${density}`)} aria-label={title} data-work-management-pattern="work-detail-layout" data-density={density}>
      <div className="tcrn-work-detail-layout__head">
        <div>
          <Heading level={2}>{title}</Heading>
          {summary ? <Text>{summary}</Text> : null}
        </div>
        {state ? <StatusBadge state={state} /> : null}
      </div>
      <div className="tcrn-work-detail-layout__grid">
        <div className="tcrn-work-detail-layout__main">{main}</div>
        <aside className="tcrn-work-detail-layout__rail">{metadata}</aside>
      </div>
      {activity ? <div className="tcrn-work-detail-layout__activity">{activity}</div> : null}
      {actions.length ? (
        <div className="tcrn-work-detail-layout__actions">
          {actions.map((action) => (
            <Button key={action.id} type="button" disabled disabledReason={action.disabledReason}>
              {action.label}
            </Button>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export interface WorkItemInspectorAction {
  id: string;
  label: string;
  disabledReason: string;
}

export interface WorkItemInspectorProps {
  title: string;
  summary: string;
  hierarchy: KeyValueItem[];
  details: KeyValueItem[];
  relationships?: RelationshipChipProps[];
  subtasks?: WorkIndexRow[];
  evidence?: EvidenceAttachment[];
  actions?: WorkItemInspectorAction[];
}

export function WorkItemInspector({ title, summary, hierarchy, details, relationships, subtasks, evidence, actions }: WorkItemInspectorProps) {
  return (
    <Surface className="tcrn-work-item-inspector" data-work-management-pattern="work-item-inspector">
      <div className="tcrn-work-item-inspector__head">
        <div>
          <Heading level={3}>{title}</Heading>
          <Text>{summary}</Text>
        </div>
        <StatusBadge state={{ state: "fixture_only" }} />
      </div>
      <div className="tcrn-work-item-inspector__grid">
        <section aria-label="Hierarchy">
          <Heading level={3}>Hierarchy</Heading>
          <KeyValueList items={hierarchy} />
        </section>
        <section aria-label="Details">
          <Heading level={3}>Details</Heading>
          <KeyValueList items={details} />
        </section>
      </div>
      {relationships?.length ? (
        <section className="tcrn-work-item-inspector__relationships" aria-label="Relationships">
          {relationships.map((relationship, index) => (
            <RelationshipChip key={`${relationship.relation}-${relationship.target}-${index}`} {...relationship} />
          ))}
        </section>
      ) : null}
      {subtasks?.length ? <WorkIndex label="Subtasks and evidence tasks" rows={subtasks} /> : null}
      {evidence?.length ? <EvidenceAttachmentList label={`${title} evidence attachments`} items={evidence} /> : null}
      {actions?.length ? (
        <div className="tcrn-work-item-inspector__actions">
          {actions.map((action) => (
            <Button key={action.id} type="button" disabled disabledReason={action.disabledReason}>
              {action.label}
            </Button>
          ))}
        </div>
      ) : null}
    </Surface>
  );
}

export interface KnowledgePageTreeItem {
  id: string;
  title: string;
  href?: string;
  level?: number;
  current?: boolean;
  state?: CopyStateInput;
  children?: KnowledgePageTreeItem[];
}

export interface KnowledgePageTreeProps {
  label?: string;
  items: KnowledgePageTreeItem[];
  density?: WorkDensity;
}

function KnowledgePageTreeItems({ items }: { items: KnowledgePageTreeItem[] }) {
  return (
    <ul className="tcrn-knowledge-page-tree__list">
      {items.map((item) => {
        const level = Math.max(item.level ?? 1, 1);
        const content = (
          <>
            <span className="tcrn-knowledge-page-tree__title">{item.title}</span>
            {item.state ? <StatusBadge state={item.state} /> : null}
          </>
        );
        return (
          <li key={item.id} className="tcrn-knowledge-page-tree__item" data-tree-level={level}>
            {item.href ? (
              <a href={item.href} aria-current={item.current ? "page" : undefined} data-selected={item.current || undefined}>
                {content}
              </a>
            ) : (
              <span data-selected={item.current || undefined}>{content}</span>
            )}
            {item.children?.length ? <KnowledgePageTreeItems items={item.children.map((child) => ({ ...child, level: (child.level ?? level + 1) }))} /> : null}
          </li>
        );
      })}
    </ul>
  );
}

export function KnowledgePageTree({ label = "Knowledge page tree", items, density = "compact" }: KnowledgePageTreeProps) {
  return (
    <nav className={cx("tcrn-knowledge-page-tree", `tcrn-knowledge-page-tree--${density}`)} aria-label={label} data-knowledge-management-pattern="knowledge-page-tree" data-density={density}>
      <KnowledgePageTreeItems items={items} />
    </nav>
  );
}

export interface KnowledgeLabelSetProps {
  labels: string[];
  label?: string;
  density?: WorkDensity;
}

export function KnowledgeLabelSet({ labels, label = "Knowledge labels", density = "compact" }: KnowledgeLabelSetProps) {
  return (
    <div className={cx("tcrn-knowledge-label-set", `tcrn-knowledge-label-set--${density}`)} aria-label={label} data-knowledge-management-pattern="knowledge-label-set" data-density={density}>
      {labels.map((item) => (
        <Badge key={item}>{item}</Badge>
      ))}
    </div>
  );
}

export interface KnowledgeDocumentSection {
  id: string;
  heading: string;
  body: ReactNode;
}

export interface KnowledgeDocumentCanvasProps {
  title: string;
  summary?: ReactNode;
  labels?: string[];
  meta?: ReactNode;
  sections: KnowledgeDocumentSection[];
  density?: WorkDensity;
}

export function KnowledgeDocumentCanvas({ title, summary, labels = [], meta, sections, density = "compact" }: KnowledgeDocumentCanvasProps) {
  return (
    <article className={cx("tcrn-knowledge-document-canvas", `tcrn-knowledge-document-canvas--${density}`)} data-knowledge-management-pattern="knowledge-document-canvas" data-density={density}>
      <header className="tcrn-knowledge-document-canvas__head">
        <div>
          <Heading level={2}>{title}</Heading>
          {summary ? <Text>{summary}</Text> : null}
        </div>
        {meta ? <div className="tcrn-knowledge-document-canvas__meta">{meta}</div> : null}
      </header>
      {labels.length ? <KnowledgeLabelSet labels={labels} density={density} /> : null}
      <div className="tcrn-knowledge-document-canvas__body">
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="tcrn-knowledge-document-canvas__section">
            <Heading level={3}>{section.heading}</Heading>
            <Text>{section.body}</Text>
          </section>
        ))}
      </div>
    </article>
  );
}

export interface KnowledgeTocItem {
  id: string;
  label: string;
  href?: string;
  current?: boolean;
}

export interface KnowledgeTocRailProps {
  label?: string;
  items: KnowledgeTocItem[];
  density?: WorkDensity;
}

export function KnowledgeTocRail({ label = "On this page", items, density = "compact" }: KnowledgeTocRailProps) {
  return (
    <aside className={cx("tcrn-knowledge-toc-rail", `tcrn-knowledge-toc-rail--${density}`)} aria-label={label} data-knowledge-management-pattern="knowledge-toc-rail" data-density={density}>
      <Heading level={3}>{label}</Heading>
      <nav>
        {items.map((item) =>
          item.href ? (
            <a key={item.id} href={item.href} aria-current={item.current ? "location" : undefined} data-selected={item.current || undefined}>{item.label}</a>
          ) : (
            <span key={item.id} data-selected={item.current || undefined}>{item.label}</span>
          )
        )}
      </nav>
    </aside>
  );
}

export interface KnowledgeComment {
  id: string;
  author: string;
  body: ReactNode;
  timestamp?: string;
  state?: CopyStateInput;
}

export interface KnowledgeInlineCommentListProps {
  label?: string;
  comments: KnowledgeComment[];
  density?: WorkDensity;
}

export function KnowledgeInlineCommentList({ label = "Knowledge comments", comments, density = "compact" }: KnowledgeInlineCommentListProps) {
  return (
    <section className={cx("tcrn-knowledge-inline-comment-list", `tcrn-knowledge-inline-comment-list--${density}`)} aria-label={label} data-knowledge-management-pattern="knowledge-inline-comment-list" data-density={density}>
      {comments.map((comment) => (
        <article key={comment.id} className="tcrn-knowledge-inline-comment-list__item">
          <div className="tcrn-knowledge-inline-comment-list__head">
            <strong>{comment.author}</strong>
            {comment.timestamp ? <time>{comment.timestamp}</time> : null}
            {comment.state ? <StatusBadge state={comment.state} /> : null}
          </div>
          <Text>{comment.body}</Text>
        </article>
      ))}
    </section>
  );
}

export interface KnowledgeMetadataRailProps {
  title?: string;
  items: KeyValueItem[];
  labels?: string[];
  actions?: WorkAction[];
  density?: WorkDensity;
}

export function KnowledgeMetadataRail({ title = "Knowledge metadata", items, labels = [], actions = [], density = "compact" }: KnowledgeMetadataRailProps) {
  return (
    <aside className={cx("tcrn-knowledge-metadata-rail", `tcrn-knowledge-metadata-rail--${density}`)} data-knowledge-management-pattern="knowledge-metadata-rail" data-density={density}>
      <WorkFieldPanel title={title} items={items} density={density} />
      {labels.length ? <KnowledgeLabelSet labels={labels} density={density} /> : null}
      {actions.length ? (
        <div className="tcrn-knowledge-metadata-rail__actions">
          {actions.map((action) => (
            <Button key={action.id} type="button" size="sm" disabled disabledReason={action.disabledReason}>
              {action.label}
            </Button>
          ))}
        </div>
      ) : null}
    </aside>
  );
}

export interface KnowledgeAttachment {
  id: string;
  label: string;
  reference: string;
  type?: EvidenceAttachmentType;
  state?: CopyStateInput;
}

export interface KnowledgeAttachmentListProps {
  label?: string;
  items: KnowledgeAttachment[];
  density?: WorkDensity;
}

export function KnowledgeAttachmentList({ label = "Knowledge attachments", items, density = "compact" }: KnowledgeAttachmentListProps) {
  return (
    <section className={cx("tcrn-knowledge-attachment-list", `tcrn-knowledge-attachment-list--${density}`)} aria-label={label} data-knowledge-management-pattern="knowledge-attachment-list" data-density={density}>
      <TableShell
        label={label}
        columns={[
          { key: "label", label: "Label" },
          { key: "reference", label: "Reference" },
          { key: "state", label: "State" }
        ]}
        rows={items.map((item) => ({
          label: item.label,
          reference: <MachineTokenCell token={item.reference} label={item.id} kind={item.type === "commit" ? "commit" : item.type === "artifact_dir" ? "artifact" : "generic"} density={density} />,
          state: item.state ? <StatusBadge state={item.state} /> : <StatusBadge state={{ state: "fixture_only" }} />
        }))}
      />
    </section>
  );
}

export interface KnowledgeVersion {
  id: string;
  title: string;
  author: string;
  timestamp?: string;
  state?: CopyStateInput;
}

export interface KnowledgeVersionHistoryProps {
  label?: string;
  versions: KnowledgeVersion[];
  density?: WorkDensity;
}

export function KnowledgeVersionHistory({ label = "Knowledge version history", versions, density = "compact" }: KnowledgeVersionHistoryProps) {
  return (
    <section className={cx("tcrn-knowledge-version-history", `tcrn-knowledge-version-history--${density}`)} aria-label={label} data-knowledge-management-pattern="knowledge-version-history" data-density={density}>
      {versions.map((version) => (
        <article key={version.id} className="tcrn-knowledge-version-history__item">
          <MachineTokenCell token={version.id} kind="generic" density={density} />
          <strong>{version.title}</strong>
          <span>{version.author}</span>
          {version.timestamp ? <time>{version.timestamp}</time> : null}
          {version.state ? <StatusBadge state={version.state} /> : null}
        </article>
      ))}
    </section>
  );
}

export interface KnowledgeTemplate {
  id: string;
  title: string;
  description: ReactNode;
  state?: CopyStateInput;
}

export interface KnowledgeTemplateGalleryProps {
  label?: string;
  templates: KnowledgeTemplate[];
  density?: WorkDensity;
}

export function KnowledgeTemplateGallery({ label = "Knowledge templates", templates, density = "compact" }: KnowledgeTemplateGalleryProps) {
  return (
    <section className={cx("tcrn-knowledge-template-gallery", `tcrn-knowledge-template-gallery--${density}`)} aria-label={label} data-knowledge-management-pattern="knowledge-template-gallery" data-density={density}>
      {templates.map((template) => (
        <Surface key={template.id} className="tcrn-knowledge-template-gallery__card">
          <Heading level={3}>{template.title}</Heading>
          <Text>{template.description}</Text>
          {template.state ? <StatusBadge state={template.state} /> : null}
          <Button type="button" size="sm" disabled disabledReason="Static Design System template fixture; product route owns creation">
            Use template
          </Button>
        </Surface>
      ))}
    </section>
  );
}

export interface KnowledgeSearchResult {
  id: string;
  title: string;
  href?: string;
  excerpt: ReactNode;
  labels?: string[];
  state?: CopyStateInput;
}

export interface KnowledgeSearchResultsProps {
  label?: string;
  query?: string;
  results: KnowledgeSearchResult[];
  density?: WorkDensity;
}

export function KnowledgeSearchResults({ label = "Knowledge search results", query, results, density = "compact" }: KnowledgeSearchResultsProps) {
  return (
    <section className={cx("tcrn-knowledge-search-results", `tcrn-knowledge-search-results--${density}`)} aria-label={label} data-knowledge-management-pattern="knowledge-search-results" data-density={density} data-search-capability="static-local-fixture">
      {query ? <Text>Static local results for {query}; no product-wide search or external index is wired.</Text> : null}
      {results.map((result) => {
        const title = result.href ? <a href={result.href}>{result.title}</a> : <span>{result.title}</span>;
        return (
          <article key={result.id} className="tcrn-knowledge-search-results__item">
            <div className="tcrn-knowledge-search-results__head">
              <strong>{title}</strong>
              {result.state ? <StatusBadge state={result.state} /> : null}
            </div>
            <Text>{result.excerpt}</Text>
            {result.labels?.length ? <KnowledgeLabelSet labels={result.labels} density={density} /> : null}
          </article>
        );
      })}
    </section>
  );
}
