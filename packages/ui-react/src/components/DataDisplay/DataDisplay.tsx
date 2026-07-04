import type { CSSProperties, ReactNode } from "react";
import { resolveTcrnLocale, type CopyStateInput, type TcrnLocale } from "@tcrn/ui-copy-state";
import { Button } from "../Button/index.js";
import { ClipboardCopyButton } from "../Clipboard/index.js";
import { Badge, EvidenceStrip, InlineAlert, StatusBadge, StateView } from "../Feedback/index.js";
import { Heading, Text } from "../Typography/index.js";
import { Surface } from "../Layout/index.js";
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
export type WorkDensity = "comfortable" | "compact";

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
