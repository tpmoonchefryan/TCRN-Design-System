// SPDX-License-Identifier: Apache-2.0
// TCRN-DS-STORY-102/103/104 — functional data-display patterns now live in core.

import type { ReactNode } from "react";
import type { CopyStateInput, TcrnLocale } from "@tcrn/ui-copy-state";
import { Badge, InlineAlert, StatusBadge } from "../Feedback/index.js";
import { Button } from "../Button/index.js";
import { ClipboardCopyButton } from "../Clipboard/index.js";
import { Heading, Text } from "../Typography/index.js";
import { Surface } from "../Layout/index.js";
import { cx } from "../../utils.js";
import { resolveDocumentLocale } from "../../utils.js";
import { DetailInspector, FilterBar, TableShell, type AttachmentTableLabels, type Density, type KeyValueItem } from "./DataDisplay.js";

type RelationshipTone = "neutral" | "positive" | "warning" | "danger";

export interface RelationshipChipProps {
  relation: string;
  target: string;
  href?: string;
  source?: string;
  disabled?: boolean;
  tone?: RelationshipTone;
  locale?: TcrnLocale | string;
}

export function RelationshipChip({ relation, target, href, source, disabled = false, tone = "neutral" }: RelationshipChipProps) {
  const title = source ? `${source} ${relation} ${target}` : `${relation} ${target}`;
  const content = (
    <>
      <span className="tcrn-relationship-chip__label">{relation}</span>
      <span className="tcrn-relationship-chip__target">{target}</span>
    </>
  );

  if (href && !disabled) {
    return (
      <a
        href={href}
        className={cx("tcrn-relationship-chip", `tcrn-relationship-chip--${tone}`)}
        data-relationship={relation}
        title={title}
        aria-label={title}
      >
        {content}
      </a>
    );
  }

  return (
    <Badge
      className={cx("tcrn-relationship-chip", `tcrn-relationship-chip--${tone}`)}
      data-relationship={relation}
      data-disabled={disabled || undefined}
      title={title}
      aria-label={title}
    >
      {content}
    </Badge>
  );
}

export type MachineTokenKind = "route" | "thread" | "commit" | "artifact" | "record" | "generic";

export interface MachineTokenProps {
  token: string;
  label?: string;
  kind?: MachineTokenKind;
  copyable?: boolean;
  density?: Density;
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
    <span className="tcrn-machine-token-cell" data-pattern="machine-token-cell">
      <MachineToken {...props} density={props.density ?? "compact"} />
    </span>
  );
}

export interface NavStripItem {
  id: string;
  label: string;
  href?: string;
  current?: boolean;
  count?: number;
  disabled?: boolean;
  value?: string;
  disabledReason?: string;
}

export interface SubNavProps {
  label?: string;
  items: NavStripItem[];
  /** Which language the built-in label is said in; defaults to the page's own. */
  locale?: TcrnLocale | string;
}

export function SubNav({ label, items, locale }: SubNavProps) {
  // The label here is the nav's accessible name and nothing else, so an English
  // default was invisible on screen and audible only to a screen-reader user on a
  // translated page — the reader least able to work around it.
  const resolvedLabel = label ?? patternLabels(locale).subNav;
  return (
    <nav className="tcrn-sub-nav" aria-label={resolvedLabel} data-pattern="subnav">
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
  views: NavStripItem[];
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
    <section className="tcrn-saved-view-toolbar" aria-label={resolvedLabel} data-pattern="saved-view-toolbar">
      <SubNav label={labels.savedViewToolbarTabs(resolvedLabel)} items={views} locale={locale} />
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

export interface PageHeaderBreadcrumb {
  id: string;
  label: string;
  href?: string;
}

export interface ActionDescriptor {
  id: string;
  label: string;
  disabledReason: string;
}

export interface PageHeaderProps {
  title: string;
  description?: ReactNode;
  breadcrumbs?: PageHeaderBreadcrumb[];
  meta?: ReactNode;
  actions?: ActionDescriptor[];
  density?: Density;
}

export function PageHeader({ title, description, breadcrumbs = [], meta, actions = [], density = "compact" }: PageHeaderProps) {
  return (
    <header className={cx("tcrn-page-header", `tcrn-page-header--${density}`)} data-pattern="page-header" data-density={density}>
      {breadcrumbs.length ? (
        <nav className="tcrn-page-header__breadcrumbs" aria-label="Breadcrumbs">
          {breadcrumbs.map((breadcrumb, index) => (
            <span key={breadcrumb.id} className="tcrn-page-header__breadcrumb">
              {breadcrumb.href ? <a href={breadcrumb.href}>{breadcrumb.label}</a> : <span>{breadcrumb.label}</span>}
              {index < breadcrumbs.length - 1 ? <span aria-hidden="true">/</span> : null}
            </span>
          ))}
        </nav>
      ) : null}
      <div className="tcrn-page-header__body">
        <div className="tcrn-page-header__title">
          <Heading level={2}>{title}</Heading>
          {description ? <Text>{description}</Text> : null}
        </div>
        {meta ? <div className="tcrn-page-header__meta">{meta}</div> : null}
        {actions.length ? (
          <div className="tcrn-page-header__actions">
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

export interface ViewTabsProps {
  label?: string;
  tabs: NavStripItem[];
  /** Which language the built-in label is said in; defaults to the page's own. */
  locale?: TcrnLocale | string;
}

/**
 * tabIndex 0 here and on QuickFilters below.
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
export function ViewTabs({ label, tabs, locale }: ViewTabsProps) {
  return (
    <nav className="tcrn-view-tabs" aria-label={label ?? patternLabels(locale).viewTabs} data-pattern="view-tabs" tabIndex={0}>
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

export interface QuickFiltersProps {
  label?: string;
  filters: NavStripItem[];
  density?: Density;
  /** Which language the built-in label is said in; defaults to the page's own. */
  locale?: TcrnLocale | string;
}

export function QuickFilters({ label, filters, density = "compact", locale }: QuickFiltersProps) {
  return (
    <section className={cx("tcrn-quick-filters", `tcrn-quick-filters--${density}`)} aria-label={label ?? patternLabels(locale).quickFilters} data-pattern="quick-filters" data-density={density} tabIndex={0}>
      {filters.map((filter) => {
        const content = (
          <>
            <span>{filter.label}</span>
            {filter.value ? <span className="tcrn-quick-filters__value">{filter.value}</span> : null}
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

export interface RecordField {
  key: string;
  label: string;
  value: ReactNode;
}

export interface RecordRowProps {
  id: string;
  title: string;
  state: CopyStateInput;
  owner: string;
  href?: string;
  selected?: boolean;
  rank?: string;
  priority?: string;
  summary?: ReactNode;
  fields?: RecordField[];
  relationships?: RelationshipChipProps[];
  density?: Density;
  locale?: TcrnLocale | string;
}

function RecordRowBody({ id, title, state, owner, rank, priority, summary, fields = [], relationships = [], density = "compact", locale }: RecordRowProps) {
  return (
    <>
      <div className="tcrn-record-row__id">
        <MachineTokenCell token={id} kind="record" density={density} />
        {rank ? <Badge>{rank}</Badge> : null}
      </div>
      <div className="tcrn-record-row__summary">
        <strong>{title}</strong>
        {summary ? <Text>{summary}</Text> : null}
      </div>
      <div className="tcrn-record-row__meta">
        <StatusBadge state={state} locale={locale} />
        {priority ? <Badge>{priority}</Badge> : null}
        <Badge>{owner}</Badge>
        {fields.map((field) => (
          <span key={field.key} className="tcrn-record-row__field">
            <span>{field.label}</span>
            <strong>{field.value}</strong>
          </span>
        ))}
      </div>
      {relationships.length ? (
        // Composed per locale: the title is the consumer's own, so concatenating an
        // English word onto it produces a group name in neither language.
        <div className="tcrn-record-row__relationships" aria-label={patternLabels(locale).relationshipsOf(title)}>
          {relationships.map((relationship, index) => (
            <RelationshipChip key={`${relationship.relation}-${relationship.target}-${index}`} locale={locale} {...relationship} source={id} />
          ))}
        </div>
      ) : null}
    </>
  );
}

export function RecordRow(props: RecordRowProps) {
  const { href, selected = false, density = "compact", title } = props;
  const className = cx("tcrn-record-row", `tcrn-record-row--${density}`);
  if (href) {
    return (
      <a className={className} href={href} aria-label={title} data-selected={selected || undefined} data-pattern="record-row" data-density={density}>
        <RecordRowBody {...props} density={density} />
      </a>
    );
  }
  return (
    <article className={className} aria-label={title} data-selected={selected || undefined} data-pattern="record-row" data-density={density}>
      <RecordRowBody {...props} density={density} />
    </article>
  );
}

export interface RecordTableProps {
  label?: string;
  rows: RecordRowProps[];
  density?: Density;
  locale?: TcrnLocale | string;
}

export function RecordTable({ label, rows, density = "compact", locale }: RecordTableProps) {
  return (
    <section className={cx("tcrn-record-table", `tcrn-record-table--${density}`)} aria-label={label ?? patternLabels(locale).recordTable} data-pattern="record-table" data-density={density}>
      {rows.map((row) => (
        <RecordRow key={row.id} locale={locale} {...row} density={row.density ?? density} />
      ))}
    </section>
  );
}

export interface SplitViewProps {
  label?: string;
  list: ReactNode;
  detail: ReactNode;
  density?: Density;
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
export function SplitView({ label, list, detail, density = "compact", detailPopulated, locale }: SplitViewProps) {
  return (
    // The frame exists because an element cannot answer a container query about
    // itself: the section's own grid has to change when space runs out, so the
    // size container must be one level up.
    <div className="tcrn-split-view-frame">
      <section
        className={cx("tcrn-split-view", `tcrn-split-view--${density}`)}
        aria-label={label ?? patternLabels(locale).splitView}
        data-pattern="split-view"
        data-density={density}
        data-detail-populated={detailPopulated === undefined ? undefined : String(detailPopulated)}
      >
        <div className="tcrn-split-view__list">{list}</div>
        <div className="tcrn-split-view__detail">{detail}</div>
      </section>
    </div>
  );
}

export interface InlineCreateProps {
  label?: string;
  disabledReason: string;
  hint?: ReactNode;
  /** Which language the built-in label is said in; defaults to the page's own. */
  locale?: TcrnLocale | string;
}

export function InlineCreate({ label, disabledReason, hint, locale }: InlineCreateProps) {
  // Visible button text, so the English default read as an untranslated control
  // rather than as a missing one.
  const resolvedLabel = label ?? patternLabels(locale).inlineCreate;
  return (
    <div className="tcrn-inline-create" data-pattern="inline-create">
      <Button type="button" size="sm" disabled disabledReason={disabledReason}>
        {resolvedLabel}
      </Button>
      {hint ? <Text>{hint}</Text> : null}
    </div>
  );
}

export interface RowGroupProps {
  title: string;
  description?: ReactNode;
  rows: RecordRowProps[];
  actions?: ActionDescriptor[];
  inlineCreate?: InlineCreateProps;
  density?: Density;
  locale?: TcrnLocale | string;
}

export function RowGroup({ title, description, rows, actions = [], inlineCreate, density = "compact", locale }: RowGroupProps) {
  return (
    <section className={cx("tcrn-row-group", `tcrn-row-group--${density}`)} aria-label={title} data-pattern="row-group" data-density={density}>
      <div className="tcrn-row-group__head">
        <div>
          <Heading level={3}>{title}</Heading>
          {description ? <Text>{description}</Text> : null}
        </div>
        <Badge>{rows.length}</Badge>
        {actions.length ? (
          <div className="tcrn-row-group__actions">
            {actions.map((action) => (
              <Button key={action.id} type="button" size="sm" disabled disabledReason={action.disabledReason}>
                {action.label}
              </Button>
            ))}
          </div>
        ) : null}
      </div>
      <RecordTable label={`${title} rows`} rows={rows} density={density} locale={locale} />
      {inlineCreate ? <InlineCreate {...inlineCreate} /> : null}
    </section>
  );
}

export interface BoardCard {
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
  fields?: RecordField[];
  relationships?: RelationshipChipProps[];
}

export interface BoardLane {
  id: string;
  title: string;
  state?: CopyStateInput;
  cards: BoardCard[];
}

export interface LaneBoardProps {
  label?: string;
  lanes: BoardLane[];
  toolbar?: ReactNode;
  density?: Density;
  locale?: TcrnLocale | string;
}

export function LaneBoard({ label, lanes, toolbar, density = "comfortable", locale }: LaneBoardProps) {
  const labels = patternLabels(locale);
  return (
    <section className={cx("tcrn-lane-board", `tcrn-lane-board--${density}`)} aria-label={label ?? labels.laneBoard} data-pattern="lane-board" data-density={density}>
      {toolbar ? <div className="tcrn-lane-board__toolbar">{toolbar}</div> : null}
      {lanes.map((lane) => (
        <Surface key={lane.id} className="tcrn-lane-board__lane" data-lane-id={lane.id}>
          <div className="tcrn-lane-board__lane-head">
            <Heading level={3}>{lane.title}</Heading>
            <Badge>{lane.cards.length}</Badge>
            {lane.state ? <StatusBadge state={lane.state} locale={locale} /> : null}
          </div>
          <div className="tcrn-lane-board__cards">
            {lane.cards.map((card) => (
              <article key={card.id} className="tcrn-lane-board__card" aria-label={card.title} data-card-href={card.href ? "true" : undefined}>
                <div className="tcrn-lane-board__card-head">
                  <MachineTokenCell token={card.id} kind="record" density={density} />
                  <StatusBadge state={card.state} locale={locale} />
                  {card.priority ? <Badge>{card.priority}</Badge> : null}
                </div>
                {card.href ? (
                  <strong><a className="tcrn-lane-board__card-link" href={card.href}>{card.title}</a></strong>
                ) : (
                  <strong>{card.title}</strong>
                )}
                {card.owner ? <Text>{card.owner}</Text> : null}
                {card.meta ? <div className="tcrn-lane-board__card-meta">{card.meta}</div> : null}
                {card.fields?.length ? (
                  <div className="tcrn-lane-board__card-fields">
                    {card.fields.map((field) => (
                      <span key={field.key} className="tcrn-lane-board__card-field">
                        <span>{field.label}</span>
                        <strong>{field.value}</strong>
                      </span>
                    ))}
                  </div>
                ) : null}
                {card.relationships?.length ? (
                  <div
                    className="tcrn-lane-board__relations"
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

export type GraphLevel = string;

export interface GraphNode {
  id: string;
  level?: GraphLevel;
  title: string;
  state?: CopyStateInput;
  owner?: string;
  parentId?: string;
}

export interface GraphEdge {
  from: string;
  to: string;
  relation: string;
}

interface RelationGraphLabels {
  from: string;
  relationship: string;
  to: string;
  parent: string;
}

const relationGraphLabels: Record<TcrnLocale, RelationGraphLabels> = {
  "zh-CN": { from: "来源", relationship: "关系", to: "目标", parent: "父项" },
  en: { from: "From", relationship: "Relationship", to: "To", parent: "Parent" },
  ja: { from: "起点", relationship: "関係", to: "終点", parent: "親" },
  ko: { from: "출발", relationship: "관계", to: "도착", parent: "상위" },
  fr: { from: "Depuis", relationship: "Relation", to: "Vers", parent: "Parent" }
};

export interface RelationGraphProps {
  label?: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  locale?: TcrnLocale | string;
}

export function RelationGraph({ label, nodes, edges, locale }: RelationGraphProps) {
  const copy = relationGraphLabels[resolveDocumentLocale(locale)];
  const labels = patternLabels(locale);
  const resolvedLabel = label ?? labels.relationGraph;
  return (
    <section className="tcrn-relation-graph" aria-label={resolvedLabel} data-pattern="relation-graph">
      <div className="tcrn-relation-graph__levels">
        {nodes.map((node) => (
          <Surface key={node.id} className="tcrn-relation-graph__node" data-graph-level={node.level}>
            <MachineToken token={node.id} kind="record" />
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
          from: <MachineToken token={edge.from} kind="record" />,
          relationship: <RelationshipChip relation={edge.relation} target={edge.to} source={edge.from} locale={locale} />,
          to: <MachineToken token={edge.to} kind="record" />
        }))}
      />
    </section>
  );
}

export interface PipelineStage {
  id: string;
  label: string;
  state: CopyStateInput;
  owner: string;
  references: string[];
  nextAction?: string;
}

interface StagePipelineLabels {
  title: string;
  stage: string;
  state: string;
  owner: string;
  references: string;
  next: string;
  noClaim: string;
  caveat: string;
}

const stagePipelineLabels: Record<TcrnLocale, StagePipelineLabels> = {
  "zh-CN": { title: "阶段流水线", stage: "阶段", state: "状态", owner: "负责人", references: "支撑引用", next: "下一步动作", noClaim: "无下游声明", caveat: "阶段流水线只负责呈现；状态与责任交接仍由路线自身持有。" },
  en: { title: "Stage pipeline", stage: "Stage", state: "State", owner: "Owner", references: "Supporting references", next: "Next action", noClaim: "No downstream claim", caveat: "The stage pipeline is presentation-only; state and responsibility handoff remain route-owned." },
  ja: { title: "ステージパイプライン", stage: "ステージ", state: "状態", owner: "担当者", references: "支援参照", next: "次の操作", noClaim: "下流の主張なし", caveat: "ステージパイプラインは表示専用です。状態と責任の引き継ぎはルート側が保持します。" },
  ko: { title: "단계 파이프라인", stage: "단계", state: "상태", owner: "담당자", references: "지원 참조", next: "다음 작업", noClaim: "하위 주장 없음", caveat: "단계 파이프라인은 표시 전용입니다. 상태와 책임 인계는 경로가 보유합니다." },
  fr: { title: "Pipeline d’étapes", stage: "Étape", state: "État", owner: "Responsable", references: "Références d’appui", next: "Action suivante", noClaim: "Aucune revendication en aval", caveat: "Le pipeline d’étapes est purement présentationnel ; l’état et le transfert de responsabilité restent portés par la route." }
};

export interface StagePipelineProps {
  label?: string;
  stages: PipelineStage[];
  density?: Density;
  locale?: TcrnLocale | string;
}

export function StagePipeline({ label, stages, density = "comfortable", locale }: StagePipelineProps) {
  const copy = stagePipelineLabels[resolveDocumentLocale(locale)];
  const heading = label ?? copy.title;
  return (
    <section className={cx("tcrn-stage-pipeline", `tcrn-stage-pipeline--${density}`)} aria-label={heading} data-pattern="stage-pipeline" data-density={density}>
      <TableShell
        label={heading}
        columns={[
          { key: "stage", label: copy.stage },
          { key: "state", label: copy.state },
          { key: "owner", label: copy.owner },
          { key: "references", label: copy.references },
          { key: "next", label: copy.next }
        ]}
        rows={stages.map((stage) => ({
          stage: stage.label,
          state: <StatusBadge state={stage.state} locale={locale} />,
          owner: stage.owner,
          references: <div className="tcrn-stage-pipeline__references">{stage.references.map((reference) => <Badge key={reference}>{reference}</Badge>)}</div>,
          next: stage.nextAction ?? copy.noClaim
        }))}
      />
      <InlineAlert tone="warning">{copy.caveat}</InlineAlert>
    </section>
  );
}

export type AttachmentType = "screenshot" | "artifact_dir" | "qa_summary" | "api_readback" | "commit" | "preview" | "policy" | "redacted";

export interface AttachmentItem {
  id: string;
  type?: AttachmentType;
  label: string;
  reference: string;
  state?: CopyStateInput;
}

const attachmentTableLabels: Record<TcrnLocale, AttachmentTableLabels> = {
  "zh-CN": { type: "类型", label: "名称", reference: "引用", state: "状态" },
  en: { type: "Type", label: "Label", reference: "Reference", state: "State" },
  ja: { type: "種別", label: "名称", reference: "参照", state: "状態" },
  ko: { type: "종류", label: "이름", reference: "참조", state: "상태" },
  fr: { type: "Type", label: "Libellé", reference: "Référence", state: "État" }
};

export interface AttachmentListProps {
  label?: string;
  items: AttachmentItem[];
  density?: Density;
  locale?: TcrnLocale | string;
}

export function AttachmentList({ label, items, density = "compact", locale }: AttachmentListProps) {
  const copy = attachmentTableLabels[resolveDocumentLocale(locale)];
  const resolvedLabel = label ?? patternLabels(locale).attachments;
  return (
    <section className={cx("tcrn-attachment-list", `tcrn-attachment-list--${density}`)} aria-label={resolvedLabel} data-pattern="attachment-list" data-density={density}>
      <TableShell
        label={resolvedLabel}
        columns={[
          { key: "type", label: copy.type },
          { key: "label", label: copy.label },
          { key: "reference", label: copy.reference },
          { key: "state", label: copy.state }
        ]}
        rows={items.map((item) => ({
          type: item.type ?? "reference",
          label: item.label,
          reference: <MachineTokenCell token={item.reference} label={item.id} kind={item.type === "commit" ? "commit" : item.type === "artifact_dir" ? "artifact" : "generic"} density={density} />,
          state: item.state ? <StatusBadge state={item.state} locale={locale} /> : <StatusBadge state={{ state: "local_only" }} locale={locale} />
        }))}
      />
    </section>
  );
}

export interface MetadataRailProps {
  title?: string;
  items: KeyValueItem[];
  labels?: string[];
  actions?: ActionDescriptor[];
  density?: Density;
  locale?: TcrnLocale | string;
}

export function MetadataRail({ title, items, labels = [], actions = [], density = "compact", locale }: MetadataRailProps) {
  const resolvedTitle = title ?? patternLabels(locale).metadata;
  return (
    <aside className={cx("tcrn-metadata-rail", `tcrn-metadata-rail--${density}`)} data-pattern="metadata-rail" data-density={density}>
      <DetailInspector title={resolvedTitle} items={items} />
      {labels.length ? <LabelSet labels={labels} density={density} locale={locale} /> : null}
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

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  timestamp?: string;
  summary?: ReactNode;
  state?: CopyStateInput;
  attachments?: AttachmentItem[];
}

export interface ActivityFeedProps {
  label?: string;
  items: ActivityItem[];
  density?: Density;
  locale?: TcrnLocale | string;
}

export function ActivityFeed({ label, items, density = "compact", locale }: ActivityFeedProps) {
  const labels = patternLabels(locale);
  return (
    <section className={cx("tcrn-activity-feed", `tcrn-activity-feed--${density}`)} aria-label={label ?? labels.activity} data-pattern="activity-feed" data-density={density}>
      {items.map((item) => (
        <article key={item.id} className="tcrn-activity-feed__item">
          <div className="tcrn-activity-feed__head">
            <strong>{item.actor}</strong>
            <span>{item.action}</span>
            {item.timestamp ? <time>{item.timestamp}</time> : null}
            {item.state ? <StatusBadge state={item.state} locale={locale} /> : null}
          </div>
          {item.summary ? <Text>{item.summary}</Text> : null}
          {/* Composed per locale. The id is a machine token and stays as it is;
              the word describing it is the part that has to be translated. */}
          {item.attachments?.length ? <AttachmentList label={labels.referencesOf(item.id)} items={item.attachments} density={density} locale={locale} /> : null}
        </article>
      ))}
    </section>
  );
}

export interface DetailLayoutProps {
  title: string;
  summary?: ReactNode;
  state?: CopyStateInput;
  main: ReactNode;
  metadata: ReactNode;
  activity?: ReactNode;
  actions?: ActionDescriptor[];
  density?: Density;
  locale?: TcrnLocale | string;
}

export function DetailLayout({ title, summary, state, main, metadata, activity, actions = [], density = "compact", locale }: DetailLayoutProps) {
  return (
    <section className={cx("tcrn-detail-layout", `tcrn-detail-layout--${density}`)} aria-label={title} data-pattern="detail-layout" data-density={density}>
      <div className="tcrn-detail-layout__head">
        <div>
          <Heading level={2}>{title}</Heading>
          {summary ? <Text>{summary}</Text> : null}
        </div>
        {state ? <StatusBadge state={state} locale={locale} /> : null}
      </div>
      <div className="tcrn-detail-layout__grid">
        <div className="tcrn-detail-layout__main">{main}</div>
        <aside className="tcrn-detail-layout__rail">{metadata}</aside>
      </div>
      {activity ? <div className="tcrn-detail-layout__activity">{activity}</div> : null}
      {actions.length ? (
        <div className="tcrn-detail-layout__actions">
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

export interface RecordInspectorAction {
  id: string;
  label: string;
  disabledReason: string;
}

interface RecordInspectorLabels {
  hierarchy: string;
  details: string;
  relationships: string;
  subtasks: string;
}

const recordInspectorLabels: Record<TcrnLocale, RecordInspectorLabels> = {
  "zh-CN": { hierarchy: "层级", details: "详情", relationships: "关系", subtasks: "子任务与证据任务" },
  en: { hierarchy: "Hierarchy", details: "Details", relationships: "Relationships", subtasks: "Subtasks and evidence tasks" },
  ja: { hierarchy: "階層", details: "詳細", relationships: "関係", subtasks: "サブタスクと証拠タスク" },
  ko: { hierarchy: "계층", details: "세부", relationships: "관계", subtasks: "하위 작업 및 증거 작업" },
  fr: { hierarchy: "Hiérarchie", details: "Détails", relationships: "Relations", subtasks: "Sous-tâches et tâches de preuve" }
};

export interface RecordInspectorProps {
  title: string;
  summary: string;
  hierarchy: KeyValueItem[];
  details: KeyValueItem[];
  relationships?: RelationshipChipProps[];
  subtasks?: RecordRowProps[];
  attachments?: AttachmentItem[];
  actions?: RecordInspectorAction[];
  locale?: TcrnLocale | string;
}

export function RecordInspector({ title, summary, hierarchy, details, relationships, subtasks, attachments, actions, locale }: RecordInspectorProps) {
  const copy = recordInspectorLabels[resolveDocumentLocale(locale)];
  return (
    <Surface className="tcrn-record-inspector" data-pattern="record-inspector">
      <div className="tcrn-record-inspector__head">
        <div>
          <Heading level={3}>{title}</Heading>
          <Text>{summary}</Text>
        </div>
        <StatusBadge state={{ state: "fixture_only" }} locale={locale} />
      </div>
      <div className="tcrn-record-inspector__grid">
        <DetailInspector title={copy.hierarchy} items={hierarchy} />
        <DetailInspector title={copy.details} items={details} />
      </div>
      {relationships?.length ? (
        <section className="tcrn-record-inspector__relationships" aria-label={copy.relationships}>
          {relationships.map((relationship, index) => (
            <RelationshipChip key={`${relationship.relation}-${relationship.target}-${index}`} locale={locale} {...relationship} />
          ))}
        </section>
      ) : null}
      {subtasks?.length ? <RecordTable label={copy.subtasks} rows={subtasks} locale={locale} /> : null}
      {attachments?.length ? <AttachmentList label={`${title} attachments`} items={attachments} locale={locale} /> : null}
      {actions?.length ? (
        <div className="tcrn-record-inspector__actions">
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

export interface TreeNavItem {
  id: string;
  title: string;
  href?: string;
  level?: number;
  current?: boolean;
  state?: CopyStateInput;
  children?: TreeNavItem[];
}

export interface TreeNavProps {
  label?: string;
  items: TreeNavItem[];
  density?: Density;
  locale?: TcrnLocale | string;
}

function TreeNavItems({ items, locale }: { items: TreeNavItem[]; locale?: TcrnLocale | string }) {
  return (
    <ul className="tcrn-tree-nav__list">
      {items.map((item) => {
        const level = Math.max(item.level ?? 1, 1);
        const content = (
          <>
            <span className="tcrn-tree-nav__title">{item.title}</span>
            {item.state ? <StatusBadge state={item.state} locale={locale} /> : null}
          </>
        );
        return (
          <li key={item.id} className="tcrn-tree-nav__item" data-tree-level={level}>
            {item.href ? (
              <a href={item.href} aria-current={item.current ? "page" : undefined} data-selected={item.current || undefined}>
                {content}
              </a>
            ) : (
              <span data-selected={item.current || undefined}>{content}</span>
            )}
            {item.children?.length ? <TreeNavItems items={item.children.map((child) => ({ ...child, level: (child.level ?? level + 1) }))} locale={locale} /> : null}
          </li>
        );
      })}
    </ul>
  );
}

export function TreeNav({ label, items, density = "compact", locale }: TreeNavProps) {
  return (
    <nav className={cx("tcrn-tree-nav", `tcrn-tree-nav--${density}`)} aria-label={label ?? patternLabels(locale).treeNav} data-pattern="tree-nav" data-density={density}>
      <TreeNavItems items={items} locale={locale} />
    </nav>
  );
}

export interface LabelSetProps {
  labels: string[];
  label?: string;
  density?: Density;
  /** Which language the built-in label is said in; defaults to the page's own. */
  locale?: TcrnLocale | string;
}

export function LabelSet({ labels, label, density = "compact", locale }: LabelSetProps) {
  return (
    <div className={cx("tcrn-label-set", `tcrn-label-set--${density}`)} aria-label={label ?? patternLabels(locale).labelSet} data-pattern="label-set" data-density={density}>
      {labels.map((item) => (
        <Badge key={item}>{item}</Badge>
      ))}
    </div>
  );
}

export interface DocumentSection {
  id: string;
  heading: string;
  body: ReactNode;
}

export interface DocumentCanvasProps {
  title: string;
  summary?: ReactNode;
  labels?: string[];
  meta?: ReactNode;
  sections: DocumentSection[];
  density?: Density;
}

export function DocumentCanvas({ title, summary, labels = [], meta, sections, density = "compact" }: DocumentCanvasProps) {
  return (
    <article className={cx("tcrn-document-canvas", `tcrn-document-canvas--${density}`)} data-pattern="document-canvas" data-density={density}>
      <header className="tcrn-document-canvas__head">
        <div>
          <Heading level={2}>{title}</Heading>
          {summary ? <Text>{summary}</Text> : null}
        </div>
        {meta ? <div className="tcrn-document-canvas__meta">{meta}</div> : null}
      </header>
      {labels.length ? <LabelSet labels={labels} density={density} /> : null}
      <div className="tcrn-document-canvas__body">
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="tcrn-document-canvas__section">
            <Heading level={3}>{section.heading}</Heading>
            <Text>{section.body}</Text>
          </section>
        ))}
      </div>
    </article>
  );
}

export interface TocItem {
  id: string;
  label: string;
  href?: string;
  current?: boolean;
}

export interface TocRailProps {
  label?: string;
  items: TocItem[];
  density?: Density;
  /** Which language the built-in label is said in; defaults to the page's own. */
  locale?: TcrnLocale | string;
}

export function TocRail({ label, items, density = "compact", locale }: TocRailProps) {
  // Both the visible heading and the accessible name, so one resolution serves
  // both and they cannot drift into different languages.
  const resolvedLabel = label ?? patternLabels(locale).tocRail;
  return (
    <aside className={cx("tcrn-toc-rail", `tcrn-toc-rail--${density}`)} aria-label={resolvedLabel} data-pattern="toc-rail" data-density={density}>
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

export interface CommentEntry {
  id: string;
  author: string;
  body: ReactNode;
  timestamp?: string;
  state?: CopyStateInput;
}

export interface InlineCommentListProps {
  label?: string;
  comments: CommentEntry[];
  density?: Density;
  locale?: TcrnLocale | string;
}

export function InlineCommentList({ label, comments, density = "compact", locale }: InlineCommentListProps) {
  return (
    <section className={cx("tcrn-inline-comment-list", `tcrn-inline-comment-list--${density}`)} aria-label={label ?? patternLabels(locale).inlineComments} data-pattern="inline-comment-list" data-density={density}>
      {comments.map((comment) => (
        <article key={comment.id} className="tcrn-inline-comment-list__item">
          <div className="tcrn-inline-comment-list__head">
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

export interface VersionEntry {
  id: string;
  title: string;
  author: string;
  timestamp?: string;
  state?: CopyStateInput;
}

export interface VersionHistoryProps {
  label?: string;
  versions: VersionEntry[];
  density?: Density;
  locale?: TcrnLocale | string;
}

export function VersionHistory({ label, versions, density = "compact", locale }: VersionHistoryProps) {
  return (
    <section className={cx("tcrn-version-history", `tcrn-version-history--${density}`)} aria-label={label ?? patternLabels(locale).versionHistory} data-pattern="version-history" data-density={density}>
      {versions.map((version) => (
        <article key={version.id} className="tcrn-version-history__item">
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

interface SearchResultListLabels {
  scope: (query: string) => string;
}

const searchResultsLabels: Record<TcrnLocale, SearchResultListLabels> = {
  "zh-CN": { scope: (query) => `「${query}」的静态本地结果；未接入产品级检索或外部索引。` },
  en: { scope: (query) => `Static local results for ${query}; no product-wide search or external index is wired.` },
  ja: { scope: (query) => `「${query}」の静的なローカル結果です。製品全体の検索や外部インデックスは接続されていません。` },
  ko: { scope: (query) => `"${query}"의 정적 로컬 결과입니다. 제품 전체 검색이나 외부 인덱스는 연결되지 않았습니다.` },
  fr: { scope: (query) => `Résultats locaux statiques pour ${query} ; aucune recherche à l’échelle du produit ni index externe n’est raccordé.` }
};

export interface SearchResultItem {
  id: string;
  title: string;
  href?: string;
  excerpt: ReactNode;
  labels?: string[];
  state?: CopyStateInput;
}

export interface SearchResultListProps {
  label?: string;
  query?: string;
  results: SearchResultItem[];
  density?: Density;
  locale?: TcrnLocale | string;
}

export function SearchResultList({ label, query, results, density = "compact", locale }: SearchResultListProps) {
  const copy = searchResultsLabels[resolveDocumentLocale(locale)];
  return (
    <section className={cx("tcrn-search-result-list", `tcrn-search-result-list--${density}`)} aria-label={label ?? patternLabels(locale).searchResults} data-pattern="search-result-list" data-density={density} data-search-capability="static-local-fixture">
      {query ? <Text>{copy.scope(query)}</Text> : null}
      {results.map((result) => {
        const title = result.href ? <a href={result.href}>{result.title}</a> : <span>{result.title}</span>;
        return (
          <article key={result.id} className="tcrn-search-result-list__item">
            <div className="tcrn-search-result-list__head">
              <strong>{title}</strong>
              {result.state ? <StatusBadge state={result.state} locale={locale} /> : null}
            </div>
            <Text>{result.excerpt}</Text>
            {/* Forwarded for the same reason as in the merged MetadataRail: the
                nested set resolves its own default, so omitting this leaves it
                resolving against the document while its parent resolves against
                the prop — two languages in one result. */}
            {result.labels?.length ? <LabelSet labels={result.labels} density={density} locale={locale} /> : null}
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
interface PatternLabels {
  subNav: string;
  savedViewToolbar: string;
  savedViewToolbarTabs: (label: string) => string;
  savedViewToolbarFilters: (label: string) => string;
  savedViewReset: string;
  viewTabs: string;
  quickFilters: string;
  inlineCreate: string;
  metadata: string;
  tocRail: string;
  labelSet: string;
  allFilter: string;
  recordTable: string;
  splitView: string;
  laneBoard: string;
  relationGraph: string;
  attachments: string;
  activity: string;
  treeNav: string;
  inlineComments: string;
  versionHistory: string;
  templates: string;
  searchResults: string;
  /**
   * The four names this file composes from a value it did not author.
   *
   * Each was built by welding an English word onto a title, an id, or the
   * consumer's own `label` — so a Chinese label produced `已保存的视图 tabs`,
   * a string in neither language, and one an exact-string swap layer downstream
   * can never match. Composing per locale is the only arrangement where the
   * result is in one language regardless of what was passed in.
   */
  relationshipsOf: (title: string) => string;
  relationshipFallbackOf: (label: string) => string;
  referencesOf: (id: string) => string;
}

const patternLabelTable: Record<TcrnLocale, PatternLabels> = {
  "zh-CN": {
    subNav: "局部导航",
    savedViewToolbar: "已保存的视图",
    // Composed rather than stored: the two derived names have to follow whatever
    // `label` the consumer passed, and a composed string is exactly what an
    // exact-string translation layer cannot reach.
    savedViewToolbarTabs: (label) => `${label}标签`,
    savedViewToolbarFilters: (label) => `${label}过滤`,
    savedViewReset: "重置视图",
    viewTabs: "视图",
    quickFilters: "快捷过滤",
    inlineCreate: "添加记录",
    metadata: "元数据",
    tocRail: "页面导航",
    labelSet: "标签",
    allFilter: "全部",
    recordTable: "记录表",
    splitView: "分栏视图",
    laneBoard: "泳道看板",
    relationGraph: "关系图",
    attachments: "附件",
    activity: "活动",
    treeNav: "页面导航",
    inlineComments: "行内评论",
    versionHistory: "版本历史",
    templates: "模板",
    searchResults: "搜索结果",
    relationshipsOf: (title) => `${title}的关联`,
    relationshipFallbackOf: (label) => `${label}关联回退表`,
    referencesOf: (id) => `${id}的引用`
  },
  en: {
    subNav: "Local navigation",
    savedViewToolbar: "Saved views",
    savedViewToolbarTabs: (label) => `${label} tabs`,
    savedViewToolbarFilters: (label) => `${label} filters`,
    savedViewReset: "Reset view",
    viewTabs: "Views",
    quickFilters: "Quick filters",
    inlineCreate: "Add record",
    metadata: "Metadata",
    tocRail: "Page navigation",
    labelSet: "Labels",
    allFilter: "All",
    recordTable: "Record table",
    splitView: "Split view",
    laneBoard: "Lane board",
    relationGraph: "Relation graph",
    attachments: "Attachments",
    activity: "Activity",
    treeNav: "Page navigation",
    inlineComments: "Inline comments",
    versionHistory: "Version history",
    templates: "Templates",
    searchResults: "Search results",
    relationshipsOf: (title) => `${title} relationships`,
    relationshipFallbackOf: (label) => `${label} relationship fallback`,
    referencesOf: (id) => `${id} references`
  },
  ja: {
    subNav: "ローカルナビゲーション",
    savedViewToolbar: "保存したビュー",
    savedViewToolbarTabs: (label) => `${label}のタブ`,
    savedViewToolbarFilters: (label) => `${label}のフィルター`,
    savedViewReset: "ビューをリセット",
    viewTabs: "ビュー",
    quickFilters: "クイックフィルター",
    inlineCreate: "レコードを追加",
    metadata: "メタデータ",
    tocRail: "ページナビゲーション",
    labelSet: "ラベル",
    allFilter: "すべて",
    recordTable: "レコード表",
    splitView: "分割ビュー",
    laneBoard: "レーンボード",
    relationGraph: "関係グラフ",
    attachments: "添付ファイル",
    activity: "アクティビティ",
    treeNav: "ページナビゲーション",
    inlineComments: "インラインコメント",
    versionHistory: "バージョン履歴",
    templates: "テンプレート",
    searchResults: "検索結果",
    relationshipsOf: (title) => `${title}の関連`,
    relationshipFallbackOf: (label) => `${label}の関連フォールバック表`,
    referencesOf: (id) => `${id}の参照`
  },
  ko: {
    subNav: "로컬 탐색",
    savedViewToolbar: "저장된 보기",
    savedViewToolbarTabs: (label) => `${label} 탭`,
    savedViewToolbarFilters: (label) => `${label} 필터`,
    savedViewReset: "보기 초기화",
    viewTabs: "보기",
    quickFilters: "빠른 필터",
    inlineCreate: "레코드 추가",
    metadata: "메타데이터",
    tocRail: "페이지 탐색",
    labelSet: "레이블",
    allFilter: "전체",
    recordTable: "레코드 표",
    splitView: "분할 보기",
    laneBoard: "레인 보드",
    relationGraph: "관계 그래프",
    attachments: "첨부",
    activity: "활동",
    treeNav: "페이지 탐색",
    inlineComments: "인라인 댓글",
    versionHistory: "버전 기록",
    templates: "템플릿",
    searchResults: "검색 결과",
    relationshipsOf: (title) => `${title} 관계`,
    relationshipFallbackOf: (label) => `${label} 관계 대체 표`,
    referencesOf: (id) => `${id} 참조`
  },
  fr: {
    subNav: "Navigation locale",
    savedViewToolbar: "Vues enregistrées",
    savedViewToolbarTabs: (label) => `Onglets : ${label}`,
    savedViewToolbarFilters: (label) => `Filtres : ${label}`,
    savedViewReset: "Réinitialiser la vue",
    viewTabs: "Vues",
    quickFilters: "Filtres rapides",
    inlineCreate: "Ajouter un enregistrement",
    metadata: "Métadonnées",
    tocRail: "Navigation de page",
    labelSet: "Étiquettes",
    allFilter: "Tous",
    recordTable: "Tableau des enregistrements",
    splitView: "Vue divisée",
    laneBoard: "Tableau en couloirs",
    relationGraph: "Graphe de relations",
    attachments: "Pièces jointes",
    activity: "Activité",
    treeNav: "Navigation des pages",
    inlineComments: "Commentaires en ligne",
    versionHistory: "Historique des versions",
    templates: "Modèles",
    searchResults: "Résultats de recherche",
    relationshipsOf: (title) => `Relations : ${title}`,
    relationshipFallbackOf: (label) => `Tableau de secours des relations : ${label}`,
    referencesOf: (id) => `Références : ${id}`
  }
};

/**
 * The default labels for the reader's language.
 *
 * Called from render, never during module evaluation, which is why the components
 * above may reference a table declared below them — the same arrangement
 * `searchableListLabels` already relies on.
 */
function patternLabels(locale: TcrnLocale | string | undefined): PatternLabels {
  return patternLabelTable[resolveDocumentLocale(locale)];
}
