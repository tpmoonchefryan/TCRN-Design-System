import type { CSSProperties, HTMLAttributes, KeyboardEvent, ReactNode } from "react";
import { useState } from "react";
import { resolveTcrnLocale, type CopyStateInput, type TcrnLocale } from "@tcrn/ui-copy-state";
import { Button } from "../Button/index.js";
import { Icon } from "../Icon/index.js";
import { ClipboardCopyButton } from "../Clipboard/index.js";
import { Badge, EmptyState, EvidenceStrip, InlineAlert, Skeleton, StatusBadge, StateView } from "../Feedback/index.js";
import { Heading, Text } from "../Typography/index.js";
import { Surface } from "../Layout/index.js";
import { SearchInput } from "../Form/index.js";
import { cx, requiredText, resolveDocumentLocale } from "../../utils.js";

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

export type StatCardTone = "neutral" | "positive" | "warning" | "danger";

export interface StatCardProps extends HTMLAttributes<HTMLElement> {
  label: ReactNode;
  value: ReactNode;
  note?: ReactNode;
  tone?: StatCardTone;
}

export function StatCard({ label, value, note, tone = "neutral", className, ...props }: StatCardProps) {
  return (
    <article
      {...props}
      className={cx("tcrn-stat-card", `tcrn-stat-card--${tone}`, className)}
      data-stat-card="true"
      data-stat-tone={tone}
    >
      <span className="tcrn-stat-card__label">{label}</span>
      <strong className="tcrn-stat-card__value">{value}</strong>
      {note ? <span className="tcrn-stat-card__note">{note}</span> : null}
    </article>
  );
}

/**
 * A bounded block of related content.
 *
 * `Card` is the plainest thing in this file and it earns its place by what it
 * refuses: no title prop, no actions prop, no footer prop. Every product that
 * wanted those found a different arrangement of them, and a card that ships one
 * arrangement makes the other products fight it. What is genuinely shared is the
 * surface, the padding rhythm, and the interactive affordance — so those are what
 * this owns, and the content is the consumer's.
 */
export type CardTone = "neutral" | "raised" | "quiet";

export interface CardProps extends HTMLAttributes<HTMLElement> {
  tone?: CardTone;
  /** Renders the card as a single activation target. Supply a handler with it. */
  interactive?: boolean;
}

export function Card({ tone = "neutral", interactive = false, className, children, ...props }: CardProps) {
  return (
    <article
      {...props}
      className={cx("tcrn-card", `tcrn-card--${tone}`, interactive && "tcrn-card--interactive", className)}
      data-card="true"
      data-card-tone={tone}
      tabIndex={interactive ? (props.tabIndex ?? 0) : props.tabIndex}
    >
      {children}
    </article>
  );
}

/**
 * A person or entity, shown as an image when there is one and as initials when
 * there is not.
 *
 * The fallback is the whole point. A product that has no picture for someone
 * still has to render something, and the alternative every consumer reaches for
 * — an empty circle — loses the one piece of information they do have. Initials
 * are derived here rather than asked for, because a consumer computing them is a
 * consumer computing them differently.
 */
export type AvatarSize = "small" | "medium" | "large";

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** The name this stands for. Required: it is the accessible name and the initials. */
  name: string;
  src?: string;
  size?: AvatarSize;
}

export function avatarInitials(name: string): string {
  const words = name.trim().split(/\s+/u).filter(Boolean);
  if (words.length === 0) return "";
  // First and last, not first-two: "Ada Lovelace King" reads as AK to a reader
  // scanning a column of them, and the middle name is the part nobody uses.
  const first = [...words[0]][0] ?? "";
  const last = words.length > 1 ? [...words[words.length - 1]][0] ?? "" : "";
  return `${first}${last}`.toUpperCase();
}

export function Avatar({ name, src, size = "medium", className, ...props }: AvatarProps) {
  const initials = avatarInitials(name);
  return (
    <span
      {...props}
      className={cx("tcrn-avatar", `tcrn-avatar--${size}`, className)}
      data-avatar="true"
      data-avatar-size={size}
      role="img"
      aria-label={name}
    >
      {src ? (
        // The alt is empty on purpose: the wrapper already carries the name, and a
        // second announcement of it is the name read twice.
        <img className="tcrn-avatar__image" src={src} alt="" />
      ) : (
        <span aria-hidden="true" className="tcrn-avatar__initials">{initials}</span>
      )}
    </span>
  );
}

/**
 * How far along something is.
 *
 * Two shapes, one component. A determinate bar carries `value` and reports it
 * through `aria-valuenow`; an indeterminate one omits `value` and reports
 * nothing but its role, which is what tells a screen reader "in progress, extent
 * unknown" rather than "0%". Products routinely render 0% for the unknown case,
 * and 0% is a claim.
 */
export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Omit for an indeterminate bar. */
  value?: number;
  max?: number;
  /** Accessible name. A bar with no label is a bar nobody can ask about. */
  label: string;
}

export function Progress({ value, max = 100, label, className, ...props }: ProgressProps) {
  const determinate = typeof value === "number" && Number.isFinite(value);
  const clamped = determinate ? Math.min(Math.max(value, 0), max) : undefined;
  return (
    <div
      {...props}
      className={cx("tcrn-progress", determinate ? "tcrn-progress--determinate" : "tcrn-progress--indeterminate", className)}
      data-progress="true"
      data-progress-state={determinate ? "determinate" : "indeterminate"}
      role="progressbar"
      aria-label={label}
      aria-valuemin={determinate ? 0 : undefined}
      aria-valuemax={determinate ? max : undefined}
      aria-valuenow={clamped}
    >
      <span
        className="tcrn-progress__fill"
        style={determinate ? { inlineSize: `${(clamped as number / max) * 100}%` } : undefined}
      />
    </div>
  );
}

/**
 * An ordered set of steps with one of them current.
 *
 * `aria-current="step"` is the part that is easy to leave out and impossible to
 * work around: without it the trail renders correctly and tells a screen-reader
 * user nothing about where they are in it. Completed steps are marked in data
 * rather than by position, because a product that lets a reader jump back needs
 * "done" and "before the current one" to be different facts.
 */
export interface StepperStep {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  complete?: boolean;
}

export interface StepperProps extends HTMLAttributes<HTMLElement> {
  steps: StepperStep[];
  /** The `id` of the step the reader is on. */
  currentId: string;
  /** Accessible name for the sequence. */
  label: string;
}

export function Stepper({ steps, currentId, label, className, ...props }: StepperProps) {
  return (
    <nav {...props} className={cx("tcrn-stepper", className)} data-stepper="true" aria-label={label}>
      <ol className="tcrn-stepper__list">
        {steps.map((step, index) => {
          const current = step.id === currentId;
          return (
            <li key={step.id}
              className={cx("tcrn-stepper__step", current && "tcrn-stepper__step--current", step.complete && "tcrn-stepper__step--complete")}
              data-step-state={current ? "current" : step.complete ? "complete" : "upcoming"}
              aria-current={current ? "step" : undefined}
            >
              <span className="tcrn-stepper__marker" aria-hidden="true">{index + 1}</span>
              <span className="tcrn-stepper__label">{step.label}</span>
              {step.description ? <span className="tcrn-stepper__description">{step.description}</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * A hierarchy the reader can walk.
 *
 * `role="tree"` with `aria-level`, `aria-expanded` and `aria-setsize` is what
 * turns nested lists into something a screen reader can report position in —
 * "3 of 7, level 2, collapsed" rather than a run of links whose indentation is
 * visual only. Products that render nested `<ul>`s get the shape and lose the
 * position, which is the information a reader who cannot see the indentation
 * most needs.
 *
 * Expansion is the consumer's state, not this component's. A tree that owns it
 * cannot be driven from a URL, and every product here wants deep-linking into a
 * node.
 */
export interface TreeNode {
  id: string;
  label: ReactNode;
  children?: TreeNode[];
}

export interface TreeProps extends Omit<HTMLAttributes<HTMLUListElement>, "onSelect" | "onToggle"> {
  nodes: TreeNode[];
  /** Accessible name for the hierarchy. */
  label: string;
  expandedIds?: readonly string[];
  selectedId?: string;
  onToggle?: (id: string) => void;
  onSelect?: (id: string) => void;
}

function TreeLevel({ nodes, level, expandedIds, selectedId, onToggle, onSelect }: {
  nodes: TreeNode[];
  level: number;
  expandedIds: readonly string[];
  selectedId?: string;
  onToggle?: (id: string) => void;
  onSelect?: (id: string) => void;
}) {
  return (
    <>
      {nodes.map((node, index) => {
        const hasChildren = Boolean(node.children && node.children.length > 0);
        const expanded = expandedIds.includes(node.id);
        return (
          <li key={node.id} role="treeitem"
            className="tcrn-tree__item"
            aria-level={level}
            aria-setsize={nodes.length}
            aria-posinset={index + 1}
            aria-expanded={hasChildren ? expanded : undefined}
            aria-selected={node.id === selectedId ? true : undefined}
            data-tree-level={level}
          >
            <span className="tcrn-tree__row">
              {hasChildren ? (
                <button type="button" className="tcrn-tree__toggle" aria-hidden="true" tabIndex={-1} onClick={() => onToggle?.(node.id)}>
                  <Icon name={expanded ? "chevron-down" : "chevron-right"} />
                </button>
              ) : (
                <span className="tcrn-tree__toggle tcrn-tree__toggle--leaf" aria-hidden="true" />
              )}
              <button type="button" className="tcrn-tree__label" onClick={() => onSelect?.(node.id)}>{node.label}</button>
            </span>
            {hasChildren && expanded ? (
              <ul role="group" className="tcrn-tree__group">
                <TreeLevel nodes={node.children as TreeNode[]} level={level + 1} expandedIds={expandedIds} selectedId={selectedId} onToggle={onToggle} onSelect={onSelect} />
              </ul>
            ) : null}
          </li>
        );
      })}
    </>
  );
}

export function Tree({ nodes, label, expandedIds = [], selectedId, onToggle, onSelect, className, ...props }: TreeProps) {
  return (
    <ul {...props} role="tree" aria-label={label} className={cx("tcrn-tree", className)} data-tree="true">
      <TreeLevel nodes={nodes} level={1} expandedIds={expandedIds} selectedId={selectedId} onToggle={onToggle} onSelect={onSelect} />
    </ul>
  );
}

/**
 * A table whose cells the reader can move through.
 *
 * `TableShell` already renders tabular data and is the right thing for most of
 * it. This is the other case: a grid the reader navigates cell by cell, which
 * needs `role="grid"` and `aria-rowcount`/`aria-colcount` so a screen reader can
 * say where in the grid focus is. Sorting is declared through `aria-sort` on the
 * header rather than by an icon alone, because an arrow glyph announces nothing.
 *
 * Sort state is the consumer's, for the same reason the tree's expansion is:
 * products drive it from the URL.
 */
export interface DataGridColumn {
  id: string;
  header: ReactNode;
  sortable?: boolean;
}

export type DataGridSortDirection = "ascending" | "descending";

export interface DataGridProps extends HTMLAttributes<HTMLTableElement> {
  columns: DataGridColumn[];
  rows: { id: string; cells: ReactNode[] }[];
  /** Accessible name for the grid. */
  label: string;
  sortColumnId?: string;
  sortDirection?: DataGridSortDirection;
  onSort?: (columnId: string) => void;
}

export function DataGrid({ columns, rows, label, sortColumnId, sortDirection, onSort, className, ...props }: DataGridProps) {
  return (
    <table {...props} role="grid"
      aria-label={label}
      aria-rowcount={rows.length + 1}
      aria-colcount={columns.length}
      className={cx("tcrn-data-grid", className)}
      data-data-grid="true"
    >
      <thead>
        <tr role="row">
          {columns.map((column) => (
            <th key={column.id} role="columnheader" scope="col"
              aria-sort={column.sortable ? (column.id === sortColumnId ? sortDirection ?? "none" : "none") : undefined}
            >
              {column.sortable && onSort ? (
                <button type="button" className="tcrn-data-grid__sort" onClick={() => onSort(column.id)}>{column.header}</button>
              ) : (
                column.header
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id} role="row">
            {row.cells.map((cell, index) => (
              <td key={columns[index]?.id ?? index} role="gridcell">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export interface DefinitionListItem {
  key: string;
  term: ReactNode;
  definition: ReactNode;
}

export interface DefinitionListProps extends HTMLAttributes<HTMLDListElement> {
  items: DefinitionListItem[];
  dense?: boolean;
}

export function DefinitionList({ items, dense = false, className, ...props }: DefinitionListProps) {
  return (
    <dl {...props} className={cx("tcrn-definition-list", dense && "tcrn-definition-list--dense", className)} data-definition-list="true">
      {items.map((item) => (
        <div key={item.key} className="tcrn-definition-list__item">
          <dt className="tcrn-definition-list__term">{item.term}</dt>
          <dd className="tcrn-definition-list__definition">{item.definition}</dd>
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

export function WorkIndex({ rows, label, locale, labels }: WorkIndexProps) {
  const copy = resolveWorkIndexLabels(locale, labels);
  const resolvedLabel = label ?? patternLabels(locale).workIndex;
  return (
    <TableShell
      label={resolvedLabel}
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
  /** Which language the built-in "all" chip is said in; defaults to the page's own. */
  locale?: TcrnLocale | string;
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
  allFilterLabel,
  matchCountFormat = "{shown} / {total}",
  collapseLabel,
  expandLabel,
  locale
}: TableToolbarProps) {
  // Visible chip text sitting beside consumer-supplied filter labels, so an
  // English default put one untranslated word in an otherwise translated row.
  const resolvedAllFilterLabel = allFilterLabel ?? patternLabels(locale).allFilter;
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
            {resolvedAllFilterLabel}
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
    candidateId: "50-template-gallery",
    componentName: "TemplateGallery",
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

/**
 * Relationship verbs in every supported locale.
 *
 * These twelve were English-only literals, and a consumer reported them
 * rendering untranslated on ja, ko, fr, and zh-CN routes. `RelationshipChip`
 * had no locale parameter at all, so there was no way for a caller to get them
 * right — the only thing a downstream product could do was stop using the
 * component and hand-roll the chip, which is how a design system loses a
 * consumer. A component that carries its own strings has to carry all of them.
 *
 * The verb is also the accessible name (`aria-label` reads "AOS-1 blocks
 * AOS-2"), so leaving these English left screen-reader users with a sentence in
 * a language the page does not claim.
 */
const relationshipLabels: Record<TcrnLocale, Record<WorkRelationshipType, string>> = {
  "zh-CN": {
    blocks: "阻塞",
    blocked_by: "被阻塞于",
    depends_on: "依赖",
    relates_to: "关联",
    duplicates: "重复于",
    supersedes: "取代",
    split_from: "拆分自",
    caused_by: "起因于",
    implements: "实现",
    verifies: "验证",
    reviews: "评审",
    refreshes: "刷新"
  },
  en: {
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
  },
  ja: {
    blocks: "をブロック",
    blocked_by: "にブロックされる",
    depends_on: "に依存",
    relates_to: "に関連",
    duplicates: "と重複",
    supersedes: "を置き換え",
    split_from: "から分割",
    caused_by: "が原因",
    implements: "を実装",
    verifies: "を検証",
    reviews: "をレビュー",
    refreshes: "を更新"
  },
  ko: {
    blocks: "차단함",
    blocked_by: "차단됨",
    depends_on: "의존함",
    relates_to: "관련됨",
    duplicates: "중복됨",
    supersedes: "대체함",
    split_from: "분할됨",
    caused_by: "원인",
    implements: "구현함",
    verifies: "검증함",
    reviews: "검토함",
    refreshes: "갱신함"
  },
  fr: {
    blocks: "bloque",
    blocked_by: "bloqué par",
    depends_on: "dépend de",
    relates_to: "lié à",
    duplicates: "duplique",
    supersedes: "remplace",
    split_from: "issu de",
    caused_by: "causé par",
    implements: "implémente",
    verifies: "vérifie",
    reviews: "révise",
    refreshes: "actualise"
  }
};

/**
 * A relationship verb in the reader's language, for callers that render one
 * outside a chip.
 *
 * The table above already had all five locales; what it did not have was a way
 * out of this module. A consumer listing relationships in a summary row — a
 * `KeyValue` label, a table cell — had no route to the translated verb except
 * to render a whole `RelationshipChip` where the layout wanted plain text, so it
 * rendered `row.relation` and shipped `blocks` to four localized routes. Same
 * shape as the badge defect: the package holds the locales, the API does not
 * expose them, and the consumer's only reachable option is the wrong one.
 *
 * Exporting the accessor rather than the table keeps one copy of the strings and
 * keeps `resolveDocumentLocale` on the boundary, so a caller passing a widened
 * `string` from a URL query gets the same narrowing the components get.
 */
export function workRelationshipLabel(relation: WorkRelationshipType, locale?: TcrnLocale | string): string {
  return relationshipLabels[resolveDocumentLocale(locale)][relation];
}

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
  locale?: TcrnLocale | string;
}

export function RelationshipChip({ relation, target, href, source, disabled = false, locale }: RelationshipChipProps) {
  const label = workRelationshipLabel(relation, locale);
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
  /**
   * Where this identifier lives, when the product knows.
   *
   * A machine token is almost always a reference to a record, and a reference
   * the reader cannot follow makes them the router: a consumer reported seeing
   * `minutes:4fdc3f1caf4adfb2374090f7` on screen with no way to reach the
   * minutes, leaving copy-and-hunt as the only path. Copyability was offered as
   * the affordance and it answers a different question — it helps you move the
   * string somewhere else, not see what it names.
   *
   * Optional because not every token is addressable. Omitting it renders
   * exactly what it rendered before, so a caller who has no route is not forced
   * to invent one — the honest state for an identifier with no page is a
   * non-link, not a link that 404s.
   */
  href?: string;
}

export function MachineToken({ token, label, kind = "generic", copyable = false, density = "comfortable", href }: MachineTokenProps) {
  const accessibleLabel = label ? `${label}: ${token}` : token;
  const value = <code className="tcrn-machine-token__value">{token}</code>;
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
      {href ? (
        <a className="tcrn-machine-token__link" href={href} aria-label={accessibleLabel}>
          {value}
        </a>
      ) : value}
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
  /** Which language the built-in label is said in; defaults to the page's own. */
  locale?: TcrnLocale | string;
}

export function WorkManagementSubnav({ label, items, locale }: WorkManagementSubnavProps) {
  // The label here is the nav's accessible name and nothing else, so an English
  // default was invisible on screen and audible only to a screen-reader user on a
  // translated page — the reader least able to work around it.
  const resolvedLabel = label ?? patternLabels(locale).workManagementSubnav;
  return (
    <nav className="tcrn-work-management-subnav" aria-label={resolvedLabel} data-work-management-pattern="subnav">
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
  /** Which language the built-in labels are said in; defaults to the page's own. */
  locale?: TcrnLocale | string;
}

export function SavedViewToolbar({ label, views, filters, resetLabel, locale }: SavedViewToolbarProps) {
  const labels = patternLabels(locale);
  const resolvedLabel = label ?? labels.savedViewToolbar;
  // The two derived names are composed from whatever label the consumer passed, so
  // they are built per locale rather than concatenated with an English word: a
  // Chinese label with " tabs" welded on is neither language.
  return (
    <section className="tcrn-saved-view-toolbar" aria-label={resolvedLabel} data-work-management-pattern="saved-view-toolbar">
      <WorkManagementSubnav label={labels.savedViewToolbarTabs(resolvedLabel)} items={views} locale={locale} />
      <FilterBar label={labels.savedViewToolbarFilters(resolvedLabel)}>
        {filters.map((filter) => (
          <Badge key={filter.id} title={`${filter.label}: ${filter.value}`}>
            {filter.label}: {filter.value}
          </Badge>
        ))}
        <Button type="button" variant="quiet" size="sm" disabled disabledReason="Static Storybook fixture; product route owns saved view changes">
          {resetLabel ?? labels.savedViewReset}
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
  /** Which language the built-in label is said in; defaults to the page's own. */
  locale?: TcrnLocale | string;
}

/**
 * tabIndex 0 here and on WorkQuickFilters below.
 *
 * Below the mobile breakpoint each of these becomes a single horizontally
 * scrolling strip, and a scroll container whose items are static text has no
 * way to be scrolled from a keyboard — axe calls it
 * scrollable-region-focusable, impact serious, and it is a real WCAG 2.1.1
 * failure rather than a lint. Unconditional rather than mobile-only, because
 * the render cannot know the viewport, and a redundant stop on a labelled
 * group costs a keyboard user one press while its absence costs them the
 * content (TCRN-AOS-INC-029). Same treatment TableShell already carries.
 */
export function WorkViewTabs({ label, tabs, locale }: WorkViewTabsProps) {
  return (
    <nav className="tcrn-work-view-tabs" aria-label={label ?? patternLabels(locale).workViewTabs} data-work-management-pattern="work-view-tabs" tabIndex={0}>
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
  /** Which language the built-in label is said in; defaults to the page's own. */
  locale?: TcrnLocale | string;
}

export function WorkQuickFilters({ label, filters, density = "compact", locale }: WorkQuickFiltersProps) {
  return (
    <section className={cx("tcrn-work-quick-filters", `tcrn-work-quick-filters--${density}`)} aria-label={label ?? patternLabels(locale).workQuickFilters} data-work-management-pattern="work-quick-filters" data-density={density} tabIndex={0}>
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
  locale?: TcrnLocale | string;
}

function WorkItemRowBody({ id, title, state, owner, rank, priority, summary, fields = [], relationships = [], density = "compact", locale }: WorkItemRowProps) {
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
        <StatusBadge state={state} locale={locale} />
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
        // Composed per locale: the title is the consumer's own, so concatenating an
        // English word onto it produces a group name in neither language.
        <div className="tcrn-work-item-row__relationships" aria-label={patternLabels(locale).relationshipsOf(title)}>
          {relationships.map((relationship, index) => (
            <RelationshipChip key={`${relationship.relation}-${relationship.target}-${index}`} locale={locale} {...relationship} source={id} />
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
  /**
   * Locale for the copy these rows carry themselves — readiness labels and
   * relationship verbs.
   *
   * Threaded through every composite that renders a `StatusBadge` or a
   * `RelationshipChip` internally, because without it a consumer on a translated
   * page had exactly one way to get a translated badge: pass `state.label`. That
   * is the override that replaces the package's own five-locale table with a
   * caller-supplied string — so the API made the wrong thing the only thing, and
   * a consumer duly shipped `label: isZh ? "需要评审" : "Review required"` into
   * five locales. Setting `locale` and omitting `label` is now the shorter path.
   */
  locale?: TcrnLocale | string;
}

export function WorkList({ label, rows, density = "compact", locale }: WorkListProps) {
  return (
    <section className={cx("tcrn-work-list", `tcrn-work-list--${density}`)} aria-label={label ?? patternLabels(locale).workList} data-work-management-pattern="work-list" data-density={density}>
      {rows.map((row) => (
        <WorkItemRow key={row.id} locale={locale} {...row} density={row.density ?? density} />
      ))}
    </section>
  );
}

export interface WorkSplitViewProps {
  label?: string;
  list: ReactNode;
  detail: ReactNode;
  density?: WorkDensity;
  /**
   * Whether the detail region currently holds a selection.
   *
   * The wide layout shows both regions either way. The stacked layout — which
   * this component now enters on its own when its container is narrow — uses
   * this to choose between hiding an empty detail and leading with a populated
   * one. The first consumer implemented exactly that choice by styling this
   * component's class names from outside, keyed to a viewport width that was
   * only correct for its own shell; the container query makes the breakpoint
   * true wherever the split view is mounted, and this prop carries the one bit
   * only the consumer knows.
   */
  detailPopulated?: boolean | undefined;
  /**
   * Which language the built-in label is said in; defaults to the page's own.
   *
   * This component renders only the two regions it is given, so the label is its
   * entire contribution to the accessibility tree — the one string here that a
   * screen-reader user hears and a sighted user never sees.
   */
  locale?: TcrnLocale | string;
}

/**
 * Two regions side by side, stacking when its own container runs out of room.
 *
 * MOUNTING REQUIREMENT: give this component a parent with a definite inline
 * size — block flow, a grid track, a flex item, anything that is not
 * shrink-to-fit. It establishes a size container to decide its own breakpoint,
 * and a size container contributes no intrinsic width, so a parent that sizes
 * to its content (inline-block, float, an `auto` grid track) has nothing to
 * measure and the component renders at zero width.
 */
export function WorkSplitView({ label, list, detail, density = "compact", detailPopulated, locale }: WorkSplitViewProps) {
  return (
    // The frame exists because an element cannot answer a container query about
    // itself: the section's own grid has to change when space runs out, so the
    // size container must be one level up.
    <div className="tcrn-work-split-view-frame">
      <section
        className={cx("tcrn-work-split-view", `tcrn-work-split-view--${density}`)}
        aria-label={label ?? patternLabels(locale).workSplitView}
        data-work-management-pattern="work-split-view"
        data-density={density}
        data-detail-populated={detailPopulated === undefined ? undefined : String(detailPopulated)}
      >
        <div className="tcrn-work-split-view__list">{list}</div>
        <div className="tcrn-work-split-view__detail">{detail}</div>
      </section>
    </div>
  );
}

export interface WorkInlineCreateStaticProps {
  label?: string;
  disabledReason: string;
  hint?: ReactNode;
  /** Which language the built-in label is said in; defaults to the page's own. */
  locale?: TcrnLocale | string;
}

export function WorkInlineCreateStatic({ label, disabledReason, hint, locale }: WorkInlineCreateStaticProps) {
  // Visible button text, so the English default read as an untranslated control
  // rather than as a missing one.
  const resolvedLabel = label ?? patternLabels(locale).workInlineCreate;
  return (
    <div className="tcrn-work-inline-create-static" data-work-management-pattern="work-inline-create-static">
      <Button type="button" size="sm" disabled disabledReason={disabledReason}>
        {resolvedLabel}
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
  locale?: TcrnLocale | string;
}

export function WorkBacklogGroup({ title, description, rows, actions = [], inlineCreate, density = "compact", locale }: WorkBacklogGroupProps) {
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
      <WorkList label={`${title} rows`} rows={rows} density={density} locale={locale} />
      {inlineCreate ? <WorkInlineCreateStatic {...inlineCreate} /> : null}
    </section>
  );
}

export interface WorkBoardCard {
  id: string;
  title: string;
  state: CopyStateInput;
  /**
   * Optional since the board-card admission: a governed chain record has an
   * acting writer per event, not a standing owner per item, so requiring one
   * forced the first consumer to invent a value or clone the card locally.
   */
  owner?: string;
  /**
   * Where the card leads. Rendered as a stretched link over the whole card —
   * nested interactive regions (relationship chips) stay above it — so the
   * card is the click target without the markup nesting anchors inside anchors.
   * Without it the card stays inert, which is what every card was before the
   * first consumer needed a board you can navigate.
   */
  href?: string;
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
  locale?: TcrnLocale | string;
}

export function WorkBoard({ label, lanes, density = "comfortable", locale }: WorkBoardProps) {
  const labels = patternLabels(locale);
  return (
    <section className={cx("tcrn-work-board", `tcrn-work-board--${density}`)} aria-label={label ?? labels.workBoard} data-work-management-pattern="work-board" data-density={density}>
      {lanes.map((lane) => (
        <Surface key={lane.id} className="tcrn-work-board__lane" data-work-board-lane={lane.id}>
          <div className="tcrn-work-board__lane-head">
            <Heading level={3}>{lane.title}</Heading>
            <Badge>{lane.cards.length}</Badge>
            {lane.state ? <StatusBadge state={lane.state} locale={locale} /> : null}
          </div>
          <div className="tcrn-work-board__cards">
            {lane.cards.map((card) => (
              <article key={card.id} className="tcrn-work-board__card" aria-label={card.title} data-card-href={card.href ? "true" : undefined}>
                <div className="tcrn-work-board__card-head">
                  <MachineTokenCell token={card.id} kind="work-item" density={density} />
                  <StatusBadge state={card.state} locale={locale} />
                  {card.priority ? <Badge>{card.priority}</Badge> : null}
                </div>
                {card.href ? (
                  <strong><a className="tcrn-work-board__card-link" href={card.href}>{card.title}</a></strong>
                ) : (
                  <strong>{card.title}</strong>
                )}
                {card.owner ? <Text>{card.owner}</Text> : null}
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
                  <div
                    className="tcrn-work-board__relations"
                    // Composed per locale rather than by concatenation: the card
                    // title is the consumer's, so welding " relationships" onto it
                    // yields a name in neither language on a translated page.
                    aria-label={labels.relationshipsOf(card.title)}
                  >
                    {card.relationships.map((relationship, index) => (
                      <RelationshipChip key={`${relationship.relation}-${relationship.target}-${index}`} locale={locale} {...relationship} source={card.id} />
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

interface WorkHierarchyLabels {
  from: string;
  relationship: string;
  to: string;
  parent: string;
}

const workHierarchyLabels: Record<TcrnLocale, WorkHierarchyLabels> = {
  "zh-CN": { from: "来源", relationship: "关系", to: "目标", parent: "父项" },
  en: { from: "From", relationship: "Relationship", to: "To", parent: "Parent" },
  ja: { from: "起点", relationship: "関係", to: "終点", parent: "親" },
  ko: { from: "출발", relationship: "관계", to: "도착", parent: "상위" },
  fr: { from: "Depuis", relationship: "Relation", to: "Vers", parent: "Parent" }
};

export interface WorkHierarchyProps {
  label?: string;
  nodes: WorkHierarchyNode[];
  edges: WorkHierarchyEdge[];
  locale?: TcrnLocale | string;
}

export function WorkHierarchy({ label, nodes, edges, locale }: WorkHierarchyProps) {
  const copy = workHierarchyLabels[resolveDocumentLocale(locale)];
  const labels = patternLabels(locale);
  const resolvedLabel = label ?? labels.workHierarchy;
  return (
    <section className="tcrn-work-hierarchy" aria-label={resolvedLabel} data-work-management-pattern="work-hierarchy">
      <div className="tcrn-work-hierarchy__levels">
        {nodes.map((node) => (
          <Surface key={node.id} className="tcrn-work-hierarchy__node" data-work-hierarchy-level={node.level}>
            <MachineToken token={node.id} kind="work-item" />
            <Heading level={3}>{node.title}</Heading>
            <Text>{node.level}</Text>
            {node.owner ? <Badge>{node.owner}</Badge> : null}
            {node.state ? <StatusBadge state={node.state} locale={locale} /> : null}
            {node.parentId ? <Text>{copy.parent}: {node.parentId}</Text> : null}
          </Surface>
        ))}
      </div>
      {/* Composed per locale from whatever label was resolved above, so the
          fallback table's name is in the same language as the section's. */}
      <TableShell
        label={labels.relationshipFallbackOf(resolvedLabel)}
        columns={[
          { key: "from", label: copy.from },
          { key: "relationship", label: copy.relationship },
          { key: "to", label: copy.to }
        ]}
        rows={edges.map((edge) => ({
          from: <MachineToken token={edge.from} kind="work-item" />,
          relationship: <RelationshipChip relation={edge.relation} target={edge.to} source={edge.from} locale={locale} />,
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

/**
 * Column headers, the empty-cell text, and the standing caveat, in every
 * supported locale.
 *
 * The five column labels and the two sentences below it were English literals
 * with no way for a caller to override them, so every consumer of this
 * component shipped an English table into a translated page. "Next action" was
 * the one a consumer reported; it was never alone.
 */
interface GatePipelineLabels {
  title: string;
  gate: string;
  state: string;
  owner: string;
  evidence: string;
  next: string;
  noClaim: string;
  caveat: string;
}

const gatePipelineLabels: Record<TcrnLocale, GatePipelineLabels> = {
  "zh-CN": {
    title: "门禁流水线",
    gate: "门禁",
    state: "状态",
    owner: "Owner",
    evidence: "证据",
    next: "下一步动作",
    noClaim: "无下游声明",
    caveat: "门禁流水线只负责呈现；就绪状态与 owner 交接仍由路线自身持有。"
  },
  en: {
    title: "Gate pipeline",
    gate: "Gate",
    state: "State",
    owner: "Owner",
    evidence: "Evidence",
    next: "Next action",
    noClaim: "No downstream claim",
    caveat: "GatePipeline is presentation-only; readiness and owner handoff remain route-owned."
  },
  ja: {
    title: "ゲートパイプライン",
    gate: "ゲート",
    state: "状態",
    owner: "オーナー",
    evidence: "証拠",
    next: "次の操作",
    noClaim: "下流の主張なし",
    caveat: "ゲートパイプラインは表示専用です。準備状況とオーナー引き継ぎはルート側が保持します。"
  },
  ko: {
    title: "게이트 파이프라인",
    gate: "게이트",
    state: "상태",
    owner: "오너",
    evidence: "증거",
    next: "다음 작업",
    noClaim: "하위 주장 없음",
    caveat: "게이트 파이프라인은 표시 전용입니다. 준비 상태와 오너 인계는 경로가 보유합니다."
  },
  fr: {
    title: "Pipeline de portes",
    gate: "Porte",
    state: "État",
    owner: "Propriétaire",
    evidence: "Preuve",
    next: "Action suivante",
    noClaim: "Aucune revendication en aval",
    caveat: "Le pipeline de portes est purement présentationnel ; la préparation et le transfert au propriétaire restent portés par la route."
  }
};

export interface GatePipelineProps {
  label?: string;
  gates: GatePipelineGate[];
  density?: WorkDensity;
  locale?: TcrnLocale | string;
}

export function GatePipeline({ label, gates, density = "comfortable", locale }: GatePipelineProps) {
  const copy = gatePipelineLabels[resolveDocumentLocale(locale)];
  const heading = label ?? copy.title;
  return (
    <section className={cx("tcrn-gate-pipeline", `tcrn-gate-pipeline--${density}`)} aria-label={heading} data-work-management-pattern="gate-pipeline" data-density={density}>
      <TableShell
        label={heading}
        columns={[
          { key: "gate", label: copy.gate },
          { key: "state", label: copy.state },
          { key: "owner", label: copy.owner },
          { key: "evidence", label: copy.evidence },
          { key: "next", label: copy.next }
        ]}
        rows={gates.map((gate) => ({
          gate: gate.label,
          state: <StatusBadge state={gate.state} locale={locale} />,
          owner: gate.owner,
          evidence: <EvidenceStrip items={gate.evidence} />,
          next: gate.nextAction ?? copy.noClaim
        }))}
      />
      <InlineAlert tone="warning">{copy.caveat}</InlineAlert>
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

interface AttachmentTableLabels {
  type: string;
  label: string;
  reference: string;
  state: string;
}

const attachmentTableLabels: Record<TcrnLocale, AttachmentTableLabels> = {
  "zh-CN": { type: "类型", label: "名称", reference: "引用", state: "状态" },
  en: { type: "Type", label: "Label", reference: "Reference", state: "State" },
  ja: { type: "種別", label: "名称", reference: "参照", state: "状態" },
  ko: { type: "종류", label: "이름", reference: "참조", state: "상태" },
  fr: { type: "Type", label: "Libellé", reference: "Référence", state: "État" }
};

export interface EvidenceAttachmentListProps {
  label?: string;
  items: EvidenceAttachment[];
  density?: WorkDensity;
  locale?: TcrnLocale | string;
}

export function EvidenceAttachmentList({ label, items, density = "comfortable", locale }: EvidenceAttachmentListProps) {
  const copy = attachmentTableLabels[resolveDocumentLocale(locale)];
  const resolvedLabel = label ?? patternLabels(locale).evidenceAttachments;
  return (
    <section className={cx("tcrn-evidence-attachment-list", `tcrn-evidence-attachment-list--${density}`)} aria-label={resolvedLabel} data-work-management-pattern="evidence-attachment-list" data-density={density}>
      <TableShell
        label={resolvedLabel}
        columns={[
          { key: "type", label: copy.type },
          { key: "label", label: copy.label },
          { key: "reference", label: copy.reference },
          { key: "state", label: copy.state }
        ]}
        rows={items.map((item) => ({
          type: item.type,
          label: item.label,
          reference: <MachineTokenCell token={item.reference} label={item.id} kind={item.type === "commit" ? "commit" : item.type === "artifact_dir" ? "artifact" : "generic"} density={density} />,
          state: item.state ? <StatusBadge state={item.state} locale={locale} /> : <StatusBadge state={{ state: "local_only" }} locale={locale} />
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
  /** Which language the built-in title is said in; defaults to the page's own. */
  locale?: TcrnLocale | string;
}

export function MetadataRail({ title, items, actions = [], density = "compact", locale }: MetadataRailProps) {
  // Visible panel heading.
  const resolvedTitle = title ?? patternLabels(locale).metadata;
  return (
    <aside className={cx("tcrn-metadata-rail", `tcrn-metadata-rail--${density}`)} data-work-management-pattern="metadata-rail" data-density={density}>
      <WorkFieldPanel title={resolvedTitle} items={items} density={density} />
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
  locale?: TcrnLocale | string;
}

export function WorkActivityFeed({ label, items, density = "compact", locale }: WorkActivityFeedProps) {
  const labels = patternLabels(locale);
  return (
    <section className={cx("tcrn-work-activity-feed", `tcrn-work-activity-feed--${density}`)} aria-label={label ?? labels.workActivity} data-work-management-pattern="work-activity-feed" data-density={density}>
      {items.map((item) => (
        <article key={item.id} className="tcrn-work-activity-feed__item">
          <div className="tcrn-work-activity-feed__head">
            <strong>{item.actor}</strong>
            <span>{item.action}</span>
            {item.timestamp ? <time>{item.timestamp}</time> : null}
            {item.state ? <StatusBadge state={item.state} locale={locale} /> : null}
          </div>
          {item.summary ? <Text>{item.summary}</Text> : null}
          {/* Composed per locale. The id is a machine token and stays as it is;
              the word describing it is the part that has to be translated. */}
          {item.evidence?.length ? <EvidenceAttachmentList label={labels.evidenceOf(item.id)} items={item.evidence} density={density} locale={locale} /> : null}
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
  locale?: TcrnLocale | string;
}

export function WorkDetailLayout({ title, summary, state, main, metadata, activity, actions = [], density = "compact", locale }: WorkDetailLayoutProps) {
  return (
    <section className={cx("tcrn-work-detail-layout", `tcrn-work-detail-layout--${density}`)} aria-label={title} data-work-management-pattern="work-detail-layout" data-density={density}>
      <div className="tcrn-work-detail-layout__head">
        <div>
          <Heading level={2}>{title}</Heading>
          {summary ? <Text>{summary}</Text> : null}
        </div>
        {state ? <StatusBadge state={state} locale={locale} /> : null}
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

interface WorkItemInspectorLabels {
  hierarchy: string;
  details: string;
  relationships: string;
  subtasks: string;
}

const workItemInspectorLabels: Record<TcrnLocale, WorkItemInspectorLabels> = {
  "zh-CN": { hierarchy: "层级", details: "详情", relationships: "关系", subtasks: "子任务与证据任务" },
  en: { hierarchy: "Hierarchy", details: "Details", relationships: "Relationships", subtasks: "Subtasks and evidence tasks" },
  ja: { hierarchy: "階層", details: "詳細", relationships: "関係", subtasks: "サブタスクと証拠タスク" },
  ko: { hierarchy: "계층", details: "세부", relationships: "관계", subtasks: "하위 작업 및 증거 작업" },
  fr: { hierarchy: "Hiérarchie", details: "Détails", relationships: "Relations", subtasks: "Sous-tâches et tâches de preuve" }
};

export interface WorkItemInspectorProps {
  title: string;
  summary: string;
  hierarchy: KeyValueItem[];
  details: KeyValueItem[];
  relationships?: RelationshipChipProps[];
  subtasks?: WorkIndexRow[];
  evidence?: EvidenceAttachment[];
  actions?: WorkItemInspectorAction[];
  locale?: TcrnLocale | string;
}

export function WorkItemInspector({ title, summary, hierarchy, details, relationships, subtasks, evidence, actions, locale }: WorkItemInspectorProps) {
  const copy = workItemInspectorLabels[resolveDocumentLocale(locale)];
  return (
    <Surface className="tcrn-work-item-inspector" data-work-management-pattern="work-item-inspector">
      <div className="tcrn-work-item-inspector__head">
        <div>
          <Heading level={3}>{title}</Heading>
          <Text>{summary}</Text>
        </div>
        <StatusBadge state={{ state: "fixture_only" }} locale={locale} />
      </div>
      <div className="tcrn-work-item-inspector__grid">
        <section aria-label={copy.hierarchy}>
          <Heading level={3}>{copy.hierarchy}</Heading>
          <KeyValueList items={hierarchy} />
        </section>
        <section aria-label={copy.details}>
          <Heading level={3}>{copy.details}</Heading>
          <KeyValueList items={details} />
        </section>
      </div>
      {relationships?.length ? (
        <section className="tcrn-work-item-inspector__relationships" aria-label={copy.relationships}>
          {relationships.map((relationship, index) => (
            <RelationshipChip key={`${relationship.relation}-${relationship.target}-${index}`} locale={locale} {...relationship} />
          ))}
        </section>
      ) : null}
      {subtasks?.length ? <WorkIndex label={copy.subtasks} rows={subtasks} locale={locale} /> : null}
      {evidence?.length ? <EvidenceAttachmentList label={`${title} evidence attachments`} items={evidence} locale={locale} /> : null}
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
  locale?: TcrnLocale | string;
}

function KnowledgePageTreeItems({ items, locale }: { items: KnowledgePageTreeItem[]; locale?: TcrnLocale | string }) {
  return (
    <ul className="tcrn-knowledge-page-tree__list">
      {items.map((item) => {
        const level = Math.max(item.level ?? 1, 1);
        const content = (
          <>
            <span className="tcrn-knowledge-page-tree__title">{item.title}</span>
            {item.state ? <StatusBadge state={item.state} locale={locale} /> : null}
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
            {item.children?.length ? <KnowledgePageTreeItems items={item.children.map((child) => ({ ...child, level: (child.level ?? level + 1) }))} locale={locale} /> : null}
          </li>
        );
      })}
    </ul>
  );
}

export function KnowledgePageTree({ label, items, density = "compact", locale }: KnowledgePageTreeProps) {
  return (
    <nav className={cx("tcrn-knowledge-page-tree", `tcrn-knowledge-page-tree--${density}`)} aria-label={label ?? patternLabels(locale).knowledgePageTree} data-knowledge-management-pattern="knowledge-page-tree" data-density={density}>
      <KnowledgePageTreeItems items={items} locale={locale} />
    </nav>
  );
}

export interface KnowledgeLabelSetProps {
  labels: string[];
  label?: string;
  density?: WorkDensity;
  /** Which language the built-in label is said in; defaults to the page's own. */
  locale?: TcrnLocale | string;
}

export function KnowledgeLabelSet({ labels, label, density = "compact", locale }: KnowledgeLabelSetProps) {
  return (
    <div className={cx("tcrn-knowledge-label-set", `tcrn-knowledge-label-set--${density}`)} aria-label={label ?? patternLabels(locale).knowledgeLabelSet} data-knowledge-management-pattern="knowledge-label-set" data-density={density}>
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
  /** Which language the built-in label is said in; defaults to the page's own. */
  locale?: TcrnLocale | string;
}

export function KnowledgeTocRail({ label, items, density = "compact", locale }: KnowledgeTocRailProps) {
  // Both the visible heading and the accessible name, so one resolution serves
  // both and they cannot drift into different languages.
  const resolvedLabel = label ?? patternLabels(locale).knowledgeTocRail;
  return (
    <aside className={cx("tcrn-knowledge-toc-rail", `tcrn-knowledge-toc-rail--${density}`)} aria-label={resolvedLabel} data-knowledge-management-pattern="knowledge-toc-rail" data-density={density}>
      <Heading level={3}>{resolvedLabel}</Heading>
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
  locale?: TcrnLocale | string;
}

export function KnowledgeInlineCommentList({ label, comments, density = "compact", locale }: KnowledgeInlineCommentListProps) {
  return (
    <section className={cx("tcrn-knowledge-inline-comment-list", `tcrn-knowledge-inline-comment-list--${density}`)} aria-label={label ?? patternLabels(locale).knowledgeComments} data-knowledge-management-pattern="knowledge-inline-comment-list" data-density={density}>
      {comments.map((comment) => (
        <article key={comment.id} className="tcrn-knowledge-inline-comment-list__item">
          <div className="tcrn-knowledge-inline-comment-list__head">
            <strong>{comment.author}</strong>
            {comment.timestamp ? <time>{comment.timestamp}</time> : null}
            {comment.state ? <StatusBadge state={comment.state} locale={locale} /> : null}
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
  /** Which language the built-in title is said in; defaults to the page's own. */
  locale?: TcrnLocale | string;
}

export function KnowledgeMetadataRail({ title, items, labels = [], actions = [], density = "compact", locale }: KnowledgeMetadataRailProps) {
  return (
    <aside className={cx("tcrn-knowledge-metadata-rail", `tcrn-knowledge-metadata-rail--${density}`)} data-knowledge-management-pattern="knowledge-metadata-rail" data-density={density}>
      <WorkFieldPanel title={title ?? patternLabels(locale).knowledgeMetadata} items={items} density={density} />
      {/* Forwarded, not omitted: the nested set resolves its own default, and
          without this it would resolve against the document while its parent
          resolves against the prop — two locales in one rail. */}
      {labels.length ? <KnowledgeLabelSet labels={labels} density={density} locale={locale} /> : null}
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
  locale?: TcrnLocale | string;
}

export function KnowledgeAttachmentList({ label, items, density = "compact", locale }: KnowledgeAttachmentListProps) {
  const copy = attachmentTableLabels[resolveDocumentLocale(locale)];
  const resolvedLabel = label ?? patternLabels(locale).knowledgeAttachments;
  return (
    <section className={cx("tcrn-knowledge-attachment-list", `tcrn-knowledge-attachment-list--${density}`)} aria-label={resolvedLabel} data-knowledge-management-pattern="knowledge-attachment-list" data-density={density}>
      <TableShell
        label={resolvedLabel}
        columns={[
          { key: "label", label: copy.label },
          { key: "reference", label: copy.reference },
          { key: "state", label: copy.state }
        ]}
        rows={items.map((item) => ({
          label: item.label,
          reference: <MachineTokenCell token={item.reference} label={item.id} kind={item.type === "commit" ? "commit" : item.type === "artifact_dir" ? "artifact" : "generic"} density={density} />,
          state: item.state ? <StatusBadge state={item.state} locale={locale} /> : <StatusBadge state={{ state: "fixture_only" }} locale={locale} />
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
  locale?: TcrnLocale | string;
}

export function KnowledgeVersionHistory({ label, versions, density = "compact", locale }: KnowledgeVersionHistoryProps) {
  return (
    <section className={cx("tcrn-knowledge-version-history", `tcrn-knowledge-version-history--${density}`)} aria-label={label ?? patternLabels(locale).knowledgeVersionHistory} data-knowledge-management-pattern="knowledge-version-history" data-density={density}>
      {versions.map((version) => (
        <article key={version.id} className="tcrn-knowledge-version-history__item">
          <MachineTokenCell token={version.id} kind="generic" density={density} />
          <strong>{version.title}</strong>
          <span>{version.author}</span>
          {version.timestamp ? <time>{version.timestamp}</time> : null}
          {version.state ? <StatusBadge state={version.state} locale={locale} /> : null}
        </article>
      ))}
    </section>
  );
}

interface TemplateGalleryLabels {
  use: string;
  disabledReason: string;
}

const templateGalleryLabels: Record<TcrnLocale, TemplateGalleryLabels> = {
  "zh-CN": { use: "使用模板", disabledReason: "静态设计系统模板样例；创建动作由产品路线自身持有" },
  en: { use: "Use template", disabledReason: "Static Design System template fixture; product route owns creation" },
  ja: { use: "テンプレートを使用", disabledReason: "静的なデザインシステムのテンプレート例です。作成はプロダクト側のルートが保持します" },
  ko: { use: "템플릿 사용", disabledReason: "정적 디자인 시스템 템플릿 예시입니다. 생성은 제품 경로가 보유합니다" },
  fr: { use: "Utiliser le modèle", disabledReason: "Exemple de modèle statique du design system ; la création appartient à la route produit" }
};

export interface TemplateCard {
  id: string;
  title: string;
  description: ReactNode;
  state?: CopyStateInput;
}

export interface TemplateGalleryProps {
  label?: string;
  templates: TemplateCard[];
  density?: WorkDensity;
  locale?: TcrnLocale | string;
}

export function TemplateGallery({ label, templates, density = "compact", locale }: TemplateGalleryProps) {
  const copy = templateGalleryLabels[resolveDocumentLocale(locale)];
  return (
    <section className={cx("tcrn-template-gallery", `tcrn-template-gallery--${density}`)} aria-label={label ?? patternLabels(locale).knowledgeTemplates} data-knowledge-management-pattern="template-gallery" data-density={density}>
      {templates.map((template) => (
        <Surface key={template.id} className="tcrn-template-gallery__card">
          <Heading level={3}>{template.title}</Heading>
          <Text>{template.description}</Text>
          {template.state ? <StatusBadge state={template.state} locale={locale} /> : null}
          <Button type="button" size="sm" disabled disabledReason={copy.disabledReason}>
            {copy.use}
          </Button>
        </Surface>
      ))}
    </section>
  );
}

interface KnowledgeSearchResultsLabels {
  scope: (query: string) => string;
}

const knowledgeSearchResultsLabels: Record<TcrnLocale, KnowledgeSearchResultsLabels> = {
  "zh-CN": { scope: (query) => `「${query}」的静态本地结果；未接入产品级检索或外部索引。` },
  en: { scope: (query) => `Static local results for ${query}; no product-wide search or external index is wired.` },
  ja: { scope: (query) => `「${query}」の静的なローカル結果です。製品全体の検索や外部インデックスは接続されていません。` },
  ko: { scope: (query) => `"${query}"의 정적 로컬 결과입니다. 제품 전체 검색이나 외부 인덱스는 연결되지 않았습니다.` },
  fr: { scope: (query) => `Résultats locaux statiques pour ${query} ; aucune recherche à l’échelle du produit ni index externe n’est raccordé.` }
};

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
  locale?: TcrnLocale | string;
}

export function KnowledgeSearchResults({ label, query, results, density = "compact", locale }: KnowledgeSearchResultsProps) {
  const copy = knowledgeSearchResultsLabels[resolveDocumentLocale(locale)];
  return (
    <section className={cx("tcrn-knowledge-search-results", `tcrn-knowledge-search-results--${density}`)} aria-label={label ?? patternLabels(locale).knowledgeSearchResults} data-knowledge-management-pattern="knowledge-search-results" data-density={density} data-search-capability="static-local-fixture">
      {query ? <Text>{copy.scope(query)}</Text> : null}
      {results.map((result) => {
        const title = result.href ? <a href={result.href}>{result.title}</a> : <span>{result.title}</span>;
        return (
          <article key={result.id} className="tcrn-knowledge-search-results__item">
            <div className="tcrn-knowledge-search-results__head">
              <strong>{title}</strong>
              {result.state ? <StatusBadge state={result.state} locale={locale} /> : null}
            </div>
            <Text>{result.excerpt}</Text>
            {/* Forwarded for the same reason as in `KnowledgeMetadataRail`: the
                nested set resolves its own default, so omitting this leaves it
                resolving against the document while its parent resolves against
                the prop — two languages in one result. */}
            {result.labels?.length ? <KnowledgeLabelSet labels={result.labels} density={density} locale={locale} /> : null}
          </article>
        );
      })}
    </section>
  );
}

/**
 * One row of a searchable list.
 *
 * `meta` is the trailing slot a machine-readable note goes in — a chain version,
 * a count, a date. It sits opposite the label rather than after it so a column of
 * rows stays scannable when the labels are of wildly different lengths.
 */
/**
 * Built-in copy for every supported locale.
 *
 * A component that carries its own strings has to carry all of them: an
 * English-only default renders English inside a zh-CN page, which the locale
 * leak scan catches and a reader experiences as a half-translated product.
 */
interface SearchableListLabels {
  search: string;
  loading: string;
  empty: string;
  noMatch: (query: string) => string;
  truncated: (shown: number, total: number) => string;
  unavailable: string;
}

// `resolveDocumentLocale` moved to `../../utils.js` when Clipboard and Navigation
// needed the same three-step resolution. Three private copies of one resolver is
// how they drift into answering the same question differently.

const searchableListLabels: Record<TcrnLocale, SearchableListLabels> = {
  "zh-CN": {
    search: "检索",
    loading: "正在读取选项…",
    empty: "没有可选项。",
    noMatch: (query) => `没有匹配「${query}」的选项。`,
    truncated: (shown, total) => `显示 ${shown} / ${total} 项，继续输入以收窄。`,
    unavailable: "此路线中不可选择该项"
  },
  en: {
    search: "Search",
    loading: "Loading options…",
    empty: "There is nothing to choose from.",
    noMatch: (query) => `No option matches “${query}”.`,
    truncated: (shown, total) => `Showing ${shown} of ${total}; keep typing to narrow.`,
    unavailable: "This option is unavailable in this route"
  },
  ja: {
    search: "検索",
    loading: "選択肢を読み込んでいます…",
    empty: "選択できる項目がありません。",
    noMatch: (query) => `「${query}」に一致する選択肢はありません。`,
    truncated: (shown, total) => `${total} 件中 ${shown} 件を表示。入力を続けて絞り込んでください。`,
    unavailable: "この経路ではこの項目を選択できません"
  },
  ko: {
    search: "검색",
    loading: "선택지를 불러오는 중…",
    empty: "선택할 항목이 없습니다.",
    noMatch: (query) => `"${query}"과(와) 일치하는 항목이 없습니다.`,
    truncated: (shown, total) => `${total}개 중 ${shown}개 표시. 계속 입력하여 좁히십시오.`,
    unavailable: "이 경로에서는 이 항목을 선택할 수 없습니다"
  },
  fr: {
    search: "Rechercher",
    loading: "Chargement des options…",
    empty: "Aucune option disponible.",
    noMatch: (query) => `Aucune option ne correspond à « ${query} ».`,
    truncated: (shown, total) => `${shown} sur ${total} affichées ; continuez à saisir pour affiner.`,
    unavailable: "Cette option est indisponible dans cette route"
  }
};

/**
 * Default labels for the Work and Knowledge components that carry their own.
 *
 * Each of these was a single English literal in a parameter default. A consumer
 * that passes the prop is fine, but a consumer that relies on the default — which
 * is what a default is for — put English into a translated page, and for the
 * aria-label-only components (`WorkManagementSubnav`, `WorkViewTabs`,
 * `WorkQuickFilters`, `KnowledgeLabelSet`) it was invisible on screen and audible
 * to exactly the reader least able to work around it.
 *
 * Resolved through `resolveDocumentLocale`, so a page that declares its language
 * gets these translated without every call site being edited.
 */
interface WorkPatternLabels {
  workManagementSubnav: string;
  savedViewToolbar: string;
  savedViewToolbarTabs: (label: string) => string;
  savedViewToolbarFilters: (label: string) => string;
  savedViewReset: string;
  workViewTabs: string;
  workQuickFilters: string;
  workInlineCreate: string;
  metadata: string;
  knowledgeMetadata: string;
  knowledgeTocRail: string;
  knowledgeLabelSet: string;
  allFilter: string;
  workIndex: string;
  workList: string;
  workSplitView: string;
  workBoard: string;
  workHierarchy: string;
  evidenceAttachments: string;
  workActivity: string;
  knowledgePageTree: string;
  knowledgeComments: string;
  knowledgeAttachments: string;
  knowledgeVersionHistory: string;
  knowledgeTemplates: string;
  knowledgeSearchResults: string;
  /**
   * The four names this file composes from a value it did not author.
   *
   * Each was built by welding an English word onto a title, an id, or the
   * consumer's own `label` — so a Chinese label produced `已保存的工作视图 tabs`,
   * a string in neither language, and one an exact-string swap layer downstream
   * can never match. Composing per locale is the only arrangement where the
   * result is in one language regardless of what was passed in.
   */
  relationshipsOf: (title: string) => string;
  relationshipFallbackOf: (label: string) => string;
  evidenceOf: (id: string) => string;
}

const workPatternLabels: Record<TcrnLocale, WorkPatternLabels> = {
  "zh-CN": {
    workManagementSubnav: "工作管理视图",
    savedViewToolbar: "已保存的工作视图",
    // Composed rather than stored: the two derived names have to follow whatever
    // `label` the consumer passed, and a composed string is exactly what an
    // exact-string translation layer cannot reach.
    savedViewToolbarTabs: (label) => `${label}标签`,
    savedViewToolbarFilters: (label) => `${label}过滤`,
    savedViewReset: "重置视图",
    workViewTabs: "工作视图",
    workQuickFilters: "工作快捷过滤",
    workInlineCreate: "添加工作项",
    metadata: "元数据",
    knowledgeMetadata: "知识元数据",
    knowledgeTocRail: "本页目录",
    knowledgeLabelSet: "知识标签",
    allFilter: "全部",
    workIndex: "工作项索引",
    workList: "工作项列表",
    workSplitView: "工作项分栏视图",
    workBoard: "工作看板",
    workHierarchy: "工作层级",
    evidenceAttachments: "证据附件",
    workActivity: "工作动态",
    knowledgePageTree: "知识页面树",
    knowledgeComments: "知识评注",
    knowledgeAttachments: "知识附件",
    knowledgeVersionHistory: "知识版本历史",
    knowledgeTemplates: "知识模板",
    knowledgeSearchResults: "知识检索结果",
    relationshipsOf: (title) => `${title}的关联`,
    relationshipFallbackOf: (label) => `${label}关联回退表`,
    evidenceOf: (id) => `${id}的证据`
  },
  en: {
    workManagementSubnav: "Work Management views",
    savedViewToolbar: "Saved Work views",
    savedViewToolbarTabs: (label) => `${label} tabs`,
    savedViewToolbarFilters: (label) => `${label} filters`,
    savedViewReset: "Reset view",
    workViewTabs: "Work views",
    workQuickFilters: "Work quick filters",
    workInlineCreate: "Add work item",
    metadata: "Metadata",
    knowledgeMetadata: "Knowledge metadata",
    knowledgeTocRail: "On this page",
    knowledgeLabelSet: "Knowledge labels",
    allFilter: "All",
    workIndex: "Work index",
    workList: "Work list",
    workSplitView: "Work split view",
    workBoard: "Work board",
    workHierarchy: "Work hierarchy",
    evidenceAttachments: "Evidence attachments",
    workActivity: "Work activity",
    knowledgePageTree: "Knowledge page tree",
    knowledgeComments: "Knowledge comments",
    knowledgeAttachments: "Knowledge attachments",
    knowledgeVersionHistory: "Knowledge version history",
    knowledgeTemplates: "Knowledge templates",
    knowledgeSearchResults: "Knowledge search results",
    relationshipsOf: (title) => `${title} relationships`,
    relationshipFallbackOf: (label) => `${label} relationship fallback`,
    evidenceOf: (id) => `${id} evidence`
  },
  ja: {
    workManagementSubnav: "作業管理ビュー",
    savedViewToolbar: "保存した作業ビュー",
    savedViewToolbarTabs: (label) => `${label}のタブ`,
    savedViewToolbarFilters: (label) => `${label}のフィルター`,
    savedViewReset: "ビューをリセット",
    workViewTabs: "作業ビュー",
    workQuickFilters: "作業クイックフィルター",
    workInlineCreate: "作業項目を追加",
    metadata: "メタデータ",
    knowledgeMetadata: "ナレッジのメタデータ",
    knowledgeTocRail: "このページの目次",
    knowledgeLabelSet: "ナレッジラベル",
    allFilter: "すべて",
    workIndex: "作業項目インデックス",
    workList: "作業項目リスト",
    workSplitView: "作業項目の分割ビュー",
    workBoard: "作業ボード",
    workHierarchy: "作業の階層",
    evidenceAttachments: "証跡の添付",
    workActivity: "作業アクティビティ",
    knowledgePageTree: "ナレッジのページツリー",
    knowledgeComments: "ナレッジのコメント",
    knowledgeAttachments: "ナレッジの添付",
    knowledgeVersionHistory: "ナレッジのバージョン履歴",
    knowledgeTemplates: "ナレッジのテンプレート",
    knowledgeSearchResults: "ナレッジの検索結果",
    relationshipsOf: (title) => `${title}の関連`,
    relationshipFallbackOf: (label) => `${label}の関連フォールバック表`,
    evidenceOf: (id) => `${id}の証跡`
  },
  ko: {
    workManagementSubnav: "작업 관리 보기",
    savedViewToolbar: "저장된 작업 보기",
    savedViewToolbarTabs: (label) => `${label} 탭`,
    savedViewToolbarFilters: (label) => `${label} 필터`,
    savedViewReset: "보기 초기화",
    workViewTabs: "작업 보기",
    workQuickFilters: "작업 빠른 필터",
    workInlineCreate: "작업 항목 추가",
    metadata: "메타데이터",
    knowledgeMetadata: "지식 메타데이터",
    knowledgeTocRail: "이 페이지 목차",
    knowledgeLabelSet: "지식 레이블",
    allFilter: "전체",
    workIndex: "작업 항목 색인",
    workList: "작업 항목 목록",
    workSplitView: "작업 항목 분할 보기",
    workBoard: "작업 보드",
    workHierarchy: "작업 계층",
    evidenceAttachments: "증거 첨부",
    workActivity: "작업 활동",
    knowledgePageTree: "지식 페이지 트리",
    knowledgeComments: "지식 댓글",
    knowledgeAttachments: "지식 첨부",
    knowledgeVersionHistory: "지식 버전 기록",
    knowledgeTemplates: "지식 템플릿",
    knowledgeSearchResults: "지식 검색 결과",
    relationshipsOf: (title) => `${title} 관계`,
    relationshipFallbackOf: (label) => `${label} 관계 대체 표`,
    evidenceOf: (id) => `${id} 증거`
  },
  fr: {
    workManagementSubnav: "Vues de gestion du travail",
    savedViewToolbar: "Vues de travail enregistrées",
    savedViewToolbarTabs: (label) => `Onglets : ${label}`,
    savedViewToolbarFilters: (label) => `Filtres : ${label}`,
    savedViewReset: "Réinitialiser la vue",
    workViewTabs: "Vues de travail",
    workQuickFilters: "Filtres rapides du travail",
    workInlineCreate: "Ajouter un élément de travail",
    metadata: "Métadonnées",
    knowledgeMetadata: "Métadonnées de connaissance",
    knowledgeTocRail: "Sur cette page",
    knowledgeLabelSet: "Étiquettes de connaissance",
    allFilter: "Tous",
    workIndex: "Index du travail",
    workList: "Liste de travail",
    workSplitView: "Vue divisée du travail",
    workBoard: "Tableau de travail",
    workHierarchy: "Hiérarchie du travail",
    evidenceAttachments: "Pièces jointes de preuve",
    workActivity: "Activité du travail",
    knowledgePageTree: "Arborescence des pages de connaissance",
    knowledgeComments: "Commentaires de connaissance",
    knowledgeAttachments: "Pièces jointes de connaissance",
    knowledgeVersionHistory: "Historique des versions de connaissance",
    knowledgeTemplates: "Modèles de connaissance",
    knowledgeSearchResults: "Résultats de recherche de connaissance",
    relationshipsOf: (title) => `Relations : ${title}`,
    relationshipFallbackOf: (label) => `Tableau de secours des relations : ${label}`,
    evidenceOf: (id) => `Preuves : ${id}`
  }
};

/**
 * The default labels for the reader's language.
 *
 * Called from render, never during module evaluation, which is why the components
 * above may reference a table declared below them — the same arrangement
 * `searchableListLabels` already relies on.
 */
function patternLabels(locale: TcrnLocale | string | undefined): WorkPatternLabels {
  return workPatternLabels[resolveDocumentLocale(locale)];
}

export interface SearchableListItem {
  id: string;
  label: string;
  /** Trailing note, typically a machine token or count. */
  meta?: ReactNode;
  /** Leading content: an icon, a swatch, a status dot. */
  lead?: ReactNode;
  description?: string;
  /** Renders as a link rather than a button; keeps middle-click and new-tab working. */
  href?: string;
  disabled?: boolean;
  disabledReason?: string;
  /** Pins the item above the separator, for an "all"/"none" option. */
  pinned?: boolean;
}

export interface SearchableListProps {
  label: string;
  items: SearchableListItem[];
  /** Currently chosen item id, if any. */
  selectedId?: string;
  onSelect?: (id: string, item: SearchableListItem) => void;
  /** Controlled query. Leave both undefined to let the component own it. */
  query?: string;
  onQueryChange?: (query: string) => void;
  searchLabel?: string;
  searchPlaceholder?: string;
  /**
   * Item count from which the search field appears.
   *
   * A search box over five options is furniture; over fifty it is the only way
   * in. The threshold is a prop because the honest answer depends on the list.
   */
  searchThreshold?: number;
  /** Shown while items are being fetched — one of the four states this pattern owes. */
  loading?: boolean;
  loadingLabel?: string;
  emptyLabel?: string;
  /** Shown when a query matches nothing, which is a different empty from "no items". */
  noMatchLabel?: string;
  maxVisible?: number;
  locale?: TcrnLocale;
}

/**
 * The searchable list — a selection surface for option sets too large or too
 * remote for a plain `Select`.
 *
 * The Selection and list patterns page has specified this escalation path since
 * it was written ("large or remote sets need search, loading, empty, and
 * keyboard states") while the package shipped only `Select`, so every product
 * that hit the escalation had to invent its own menu. This is that component, and
 * it owes all four of those states by contract rather than by intention.
 *
 * It is deliberately not a combobox: the trigger belongs to the caller, so the
 * same list can sit in a popover, a sidebar, or a page. What it owns is the part
 * that keeps being reinvented — filtering, the four states, roving keyboard
 * focus, and one selection grammar.
 */
export function SearchableList({
  label,
  items,
  selectedId,
  onSelect,
  query,
  onQueryChange,
  searchLabel,
  searchPlaceholder,
  searchThreshold = 8,
  loading = false,
  loadingLabel,
  emptyLabel,
  noMatchLabel,
  maxVisible,
  locale
}: SearchableListProps) {
  const [ownQuery, setOwnQuery] = useState("");
  const copy = searchableListLabels[resolveDocumentLocale(locale)];
  const activeQuery = query ?? ownQuery;
  const setQuery = (next: string) => {
    if (onQueryChange) onQueryChange(next);
    if (query === undefined) setOwnQuery(next);
  };

  const terms = activeQuery.toLowerCase().split(/\s+/u).filter(Boolean);
  // Every term must hit, because typing a second word is a person narrowing.
  const matches = items.filter((item) => {
    if (terms.length === 0) return true;
    const haystack = `${item.label}\n${item.description ?? ""}\n${item.id}`.toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
  const pinned = matches.filter((item) => item.pinned);
  const rest = matches.filter((item) => !item.pinned);
  const visibleRest = maxVisible ? rest.slice(0, maxVisible) : rest;
  const showSearch = items.length >= searchThreshold;

  // Roving focus: the list is one tab stop and arrows move within it, which is
  // what a listbox owes and what a pile of tabbable links does not give.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const focusables = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>("[data-searchable-list-item]:not([aria-disabled='true'])"));
    const index = focusables.indexOf(document.activeElement as HTMLElement);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const next = event.key === "ArrowDown" ? index + 1 : index - 1;
      focusables[(next + focusables.length) % focusables.length]?.focus();
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      (event.key === "Home" ? focusables[0] : focusables[focusables.length - 1])?.focus();
    }
  };

  const renderItem = (item: SearchableListItem) => {
    const selected = item.id === selectedId;
    const reason = item.disabled
      ? requiredText(item.disabledReason, copy.unavailable)
      : undefined;
    const inner = (
      <>
        {item.lead ? <span className="tcrn-searchable-list__lead">{item.lead}</span> : null}
        <span className="tcrn-searchable-list__label">
          {item.label}
          {item.description ? (
            <span className="tcrn-searchable-list__description">{item.description}</span>
          ) : null}
        </span>
        {item.meta ? <span className="tcrn-searchable-list__meta">{item.meta}</span> : null}
      </>
    );
    const shared = {
      className: "tcrn-searchable-list__item",
      "data-searchable-list-item": "true",
      "data-selected": selected ? "true" : undefined,
      "aria-current": selected ? ("true" as const) : undefined,
      "aria-disabled": item.disabled ? ("true" as const) : undefined,
      title: reason,
      "data-disabled-reason": reason
    };
    // A link when the caller gave a destination, so the row keeps the behaviour
    // people expect of one; a button when selecting is not navigation.
    if (item.href && !item.disabled) {
      return (
        <a key={item.id} {...shared} href={item.href} onClick={() => onSelect?.(item.id, item)}>
          {inner}
        </a>
      );
    }
    return (
      // The React key stays on the same line as the tag: a line that opens with
      // `key=` matches the secret scanner's env-assignment pattern.
      <button key={item.id}
        {...shared}
        type="button"
        disabled={item.disabled}
        onClick={() => onSelect?.(item.id, item)}
      >
        {inner}
      </button>
    );
  };

  return (
    <div className="tcrn-searchable-list" data-work-management-pattern="searchable-list" aria-label={label}>
      {showSearch ? (
        <SearchInput
          aria-label={searchLabel ?? label}
          placeholder={searchPlaceholder ?? copy.search}
          value={activeQuery}
          onChange={(event) => setQuery(event.currentTarget.value)}
          data-searchable-list-search="true"
        />
      ) : null}
      {loading ? (
        <div className="tcrn-searchable-list__state" data-searchable-list-state="loading" aria-live="polite">
          <Skeleton />
          <Text>{loadingLabel ?? copy.loading}</Text>
        </div>
      ) : items.length === 0 ? (
        <div className="tcrn-searchable-list__state" data-searchable-list-state="empty">
          <EmptyState title={emptyLabel ?? copy.empty} />
        </div>
      ) : matches.length === 0 ? (
        // A query that matches nothing is not the same as having nothing, and a
        // reader who cannot tell will go looking for options that are right there.
        <div className="tcrn-searchable-list__state" data-searchable-list-state="no-match">
          <EmptyState title={noMatchLabel ?? copy.noMatch(activeQuery)} />
        </div>
      ) : (
        // A group of links and buttons, not a listbox: role="listbox" obliges
        // every child to be an option, and an option cannot be a link — so
        // claiming it would be an ARIA promise the markup breaks, which serves a
        // screen reader worse than making no claim. Selection is announced per
        // item with aria-current, and the arrow-key roving below supplies the
        // keyboard behaviour a listbox would have given.
        <div
          className="tcrn-searchable-list__items"
          role="group"
          aria-label={label}
          onKeyDown={onKeyDown}
        >
          {pinned.map(renderItem)}
          {pinned.length > 0 && visibleRest.length > 0 ? (
            <hr className="tcrn-searchable-list__divider" role="presentation" />
          ) : null}
          {visibleRest.map(renderItem)}
          {visibleRest.length < rest.length ? (
            <Text className="tcrn-searchable-list__truncation">
              {copy.truncated(visibleRest.length, rest.length)}
            </Text>
          ) : null}
        </div>
      )}
    </div>
  );
}
