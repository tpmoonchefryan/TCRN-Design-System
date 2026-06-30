import type { CSSProperties, ReactNode } from "react";
import { resolveTcrnLocale, type CopyStateInput, type TcrnLocale } from "@tcrn/ui-copy-state";
import { StatusBadge, StateView } from "../Feedback/index.js";
import { Heading } from "../Typography/index.js";
import { Surface } from "../Layout/index.js";

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
