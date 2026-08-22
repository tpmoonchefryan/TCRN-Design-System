import type { CSSProperties, HTMLAttributes, KeyboardEvent, ReactNode } from "react";
import { useState } from "react";
import { resolveTcrnLocale, type CopyStateInput, type TcrnLocale } from "@tcrn/ui-copy-state";
import { Button } from "../Button/index.js";
import { Icon } from "../Icon/index.js";
import { ClipboardCopyButton } from "../Clipboard/index.js";
import { Badge, EmptyState, InlineAlert, Skeleton, StatusBadge, StateView } from "../Feedback/index.js";
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

export interface FilterBarProps {
  label: string;
  children: ReactNode;
}

/**
 * The two default labels a GENERIC component needs.
 *
 * TableToolbar and TemplateGallery keep their small built-in label set here so
 * the core data-display primitives do not depend on a product vocabulary table.
 */
interface GenericPatternLabels {
  allFilter: string;
  templateGallery: string;
}

const genericPatternLabels: Record<TcrnLocale, GenericPatternLabels> = {
  "zh-CN": { allFilter: "全部", templateGallery: "模板" },
  en: { allFilter: "All", templateGallery: "Templates" },
  ja: { allFilter: "すべて", templateGallery: "テンプレート" },
  ko: { allFilter: "전체", templateGallery: "템플릿" },
  fr: { allFilter: "Tous", templateGallery: "Modèles" }
};

function genericLabels(locale: TcrnLocale | string | undefined): GenericPatternLabels {
  return genericPatternLabels[resolveDocumentLocale(locale)];
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
  const resolvedAllFilterLabel = allFilterLabel ?? genericLabels(locale).allFilter;
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

export type Density = "comfortable" | "compact" | "dense";

export interface AttachmentTableLabels {
  type: string;
  label: string;
  reference: string;
  state: string;
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
  density?: Density;
  locale?: TcrnLocale | string;
}

export function TemplateGallery({ label, templates, density = "compact", locale }: TemplateGalleryProps) {
  const copy = templateGalleryLabels[resolveDocumentLocale(locale)];
  return (
    <section className={cx("tcrn-template-gallery", `tcrn-template-gallery--${density}`)} aria-label={label ?? genericLabels(locale).templateGallery} data-pattern="template-gallery" data-density={density}>
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

export const searchableListLabels: Record<TcrnLocale, SearchableListLabels> = {
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
 * Default labels for data-display components that carry their own.
 *
 * Each of these was a single English literal in a parameter default. A consumer
 * that passes the prop is fine, but a consumer that relies on the default — which
 * is what a default is for — put English into a translated page, and for the
 * aria-label-only components it was invisible on screen and audible
 * to exactly the reader least able to work around it.
 *
 * Resolved through `resolveDocumentLocale`, so a page that declares its language
 * gets these translated without every call site being edited.
 */
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
    <div className="tcrn-searchable-list" data-pattern="searchable-list" aria-label={label}>
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
