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
};

export function TableShell({ columns, rows, emptyState, label }: TableShellProps) {
  const columnCount = Math.max(columns.length, 1);
  const tableStyle: TableShellStyle = {
    "--tcrn-table-column-count": columnCount
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
    candidateId: "26-machine-token-cell",
    componentName: "MachineToken",
    level: "primitive",
    purpose: "Readable route, thread, commit, and artifact tokens that preserve full values while preventing cell overlap."
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
}

export function MachineToken({ token, label, kind = "generic", copyable = false }: MachineTokenProps) {
  const accessibleLabel = label ? `${label}: ${token}` : token;
  return (
    <span className="tcrn-machine-token" data-machine-token-kind={kind} data-full-token={token} title={token} aria-label={accessibleLabel}>
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

export interface WorkBoardCard {
  id: string;
  title: string;
  state: CopyStateInput;
  owner: string;
  meta?: ReactNode;
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
}

export function WorkBoard({ label = "Work board", lanes }: WorkBoardProps) {
  return (
    <section className="tcrn-work-board" aria-label={label} data-work-management-pattern="work-board">
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
                  <MachineToken token={card.id} kind="work-item" />
                  <StatusBadge state={card.state} />
                </div>
                <strong>{card.title}</strong>
                <Text>{card.owner}</Text>
                {card.meta ? <div className="tcrn-work-board__card-meta">{card.meta}</div> : null}
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
}

export function GatePipeline({ label = "Gate pipeline", gates }: GatePipelineProps) {
  return (
    <section className="tcrn-gate-pipeline" aria-label={label} data-work-management-pattern="gate-pipeline">
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
}

export function EvidenceAttachmentList({ label = "Evidence attachments", items }: EvidenceAttachmentListProps) {
  return (
    <section className="tcrn-evidence-attachment-list" aria-label={label} data-work-management-pattern="evidence-attachment-list">
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
          reference: <MachineToken token={item.reference} label={item.id} kind={item.type === "commit" ? "commit" : item.type === "artifact_dir" ? "artifact" : "generic"} />,
          state: item.state ? <StatusBadge state={item.state} /> : <StatusBadge state={{ state: "local_only" }} />
        }))}
      />
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
