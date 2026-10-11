// Matrix renderer for the first-batch family matrices (typography, icon, brand, actions, inputs).
//
// Every sample cell reads its identity, kind, expected contrast and exemption from the contract
// matrix data in ./generated/matrices.generated.ts; nothing about a cell is written here by hand.
// Samples are package components only. Hover, active and focus are shown with the
// data-tcrn-preview-state attribute, which the package state rules read next to the real pseudo
// classes, so a static sample and a live control resolve the same pair. The light and night blocks
// differ only in data-tcrn-theme. Layout uses existing documentation-layer classes and package
// surfaces; this module adds no styles.
import type { ReactElement, ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Heading, Surface, Text } from "@tcrn/ui-react";
import {
  gplusMatrices,
  gplusMatrixCellCounts,
  type GplusMatrixBoard,
  type GplusMatrixCell
} from "./generated/matrices.generated.js";

export type MatrixTheme = "light" | "night";

export const matrixThemes: readonly MatrixTheme[] = ["light", "night"];

const themeSuffix: Record<MatrixTheme, "l" | "n"> = { light: "l", night: "n" };
const themeAttribute: Record<MatrixTheme, "light" | "dark"> = { light: "light", night: "dark" };

/** How a measurement reads the ink of a cell whose ink is not its own text colour. */
export type MatrixCellProbe = "ph" | "shadow" | "after-border" | "after-shadow" | "before-bg";

export type MatrixPreviewState = "hover" | "active" | "focus";

export type MatrixCellAttributes = Record<string, string>;

export function matrixCell(board: GplusMatrixBoard, id: string, theme: MatrixTheme): GplusMatrixCell {
  const cellId = `${id}-${themeSuffix[theme]}`;
  const cell = gplusMatrices[board].find((item) => item.cellId === cellId);
  if (!cell) {
    throw new Error(`missing_matrix_cell:${board}:${cellId}`);
  }
  return cell;
}

/** data-cell, data-kind, data-expect, data-exempt (disabled cells) and data-probe for one cell. */
export function cellAttributes(board: GplusMatrixBoard, id: string, theme: MatrixTheme, probe?: MatrixCellProbe): MatrixCellAttributes {
  const cell = matrixCell(board, id, theme);
  const attributes: MatrixCellAttributes = {
    "data-cell": cell.cellId,
    "data-kind": cell.kind,
    "data-expect": cell.expect
  };
  if (cell.exempt) {
    attributes["data-exempt"] = "";
  }
  if (probe) {
    attributes["data-probe"] = probe;
  }
  return attributes;
}

export function previewState(state: MatrixPreviewState | undefined): Record<string, string> {
  return state ? { "data-tcrn-preview-state": state } : {};
}

export function matrixCellIds(board: GplusMatrixBoard): string[] {
  return gplusMatrices[board].map((cell) => cell.cellId);
}

export function matrixCellCount(board: GplusMatrixBoard): number {
  return gplusMatrixCellCounts[board];
}

/**
 * Light and night blocks of one board. The night block sets data-tcrn-theme="dark" and nothing
 * else; each block paints the canvas so canvas cells resolve against the block's own theme.
 */
export function MatrixBoard({ board, columns = false, children }: { board: GplusMatrixBoard; columns?: boolean; children: (theme: MatrixTheme) => ReactNode }) {
  // columns puts the two blocks side by side (left light, right night, as on the board) so a
  // tall board stays inside the story height budget; wide state grids keep the stacked layout.
  return (
    <div
      className={columns ? "tcrn-doc-interaction-primitive-grid" : "tcrn-doc-static-section"}
      data-gplus-matrix-layout={columns ? "columns" : "stacked"}
      data-gplus-matrix={board}
      data-gplus-matrix-cell-count={gplusMatrixCellCounts[board]}
    >
      {matrixThemes.map((theme) => (
        <div
          key={theme}
          className="tcrn-doc-theme-preview"
          data-tcrn-theme={themeAttribute[theme]}
          data-gplus-matrix-theme={theme}
        >
          <Text variant="caps">
            <code>{`data-tcrn-theme="${themeAttribute[theme]}"`}</code>
          </Text>
          {children(theme)}
        </div>
      ))}
    </div>
  );
}

/** A labelled section for one package component inside its family matrix. */
export function MatrixSection({ component, children }: { component: string; children: ReactNode }) {
  return (
    <Surface data-gplus-matrix-component={component} aria-label={component} heading={<Heading level={3}>{component}</Heading>}>
      {children}
    </Surface>
  );
}

/** A row of samples led by its machine name. */
export function MatrixRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="tcrn-doc-action-row" data-gplus-matrix-row={label}>
      <code>{label}</code>
      {children}
    </div>
  );
}

export interface StateGridRow {
  label: string;
  cells: readonly ReactNode[];
}

/** Variant rows by state columns; row and column names are machine words. */
export function StateGrid({ columns, rows }: { columns: readonly string[]; rows: readonly StateGridRow[] }) {
  return (
    <div className="tcrn-doc-reference-table-scroll">
      <table className="tcrn-doc-reference-table" data-gplus-state-grid={columns.join(" ")}>
        <thead>
          <tr>
            <td />
            {columns.map((column) => (
              <th key={column} scope="col">
                <code>{column}</code>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">
                <code>{row.label}</code>
              </th>
              {row.cells.map((cell, index) => (
                <td key={`${row.label}-${columns[index] ?? index}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** An empty grid cell (a state the variant does not have). */
export function NoState() {
  return <Text size="meta">—</Text>;
}

export interface MarkupEdit {
  /** A substring of the opening tag to edit, such as a package class attribute. */
  marker: string;
  /** Which occurrence of the marker (0 by default). */
  nth?: number;
  set?: Record<string, string>;
  remove?: readonly string[];
}

function escapeAttribute(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Edits attributes of opening tags in package markup. A package component that keeps a state or a
 * part internal (the clipboard copy state, a radio inside RadioGroup, the chevron inside Select)
 * is rendered by the package and only the named attributes are switched, the same way the
 * package's static bridges switch them at run time. A missing marker throws, so markup drift
 * fails the build instead of silently dropping a cell.
 */
export function applyMarkupEdits(html: string, edits: readonly MarkupEdit[]): string {
  let output = html;
  for (const edit of edits) {
    let index = -1;
    for (let occurrence = 0; occurrence <= (edit.nth ?? 0); occurrence += 1) {
      index = output.indexOf(edit.marker, index + 1);
      if (index < 0) {
        throw new Error(`static_markup_marker_missing:${edit.marker}:${edit.nth ?? 0}`);
      }
    }
    const start = output.lastIndexOf("<", index);
    const end = output.indexOf(">", index);
    if (start < 0 || end < 0) {
      throw new Error(`static_markup_tag_missing:${edit.marker}`);
    }
    let tag = output.slice(start, end + 1);
    for (const name of edit.remove ?? []) {
      tag = tag.replace(new RegExp(`\\s${name}(?:="[^"]*")?(?=[\\s/>])`), "");
    }
    for (const [name, value] of Object.entries(edit.set ?? {})) {
      const attribute = `${name}="${escapeAttribute(value)}"`;
      const existing = new RegExp(`\\s${name}(?:="[^"]*")?(?=[\\s/>])`);
      if (existing.test(tag)) {
        tag = tag.replace(existing, ` ${attribute}`);
      } else {
        const close = tag.endsWith("/>") ? tag.length - 2 : tag.length - 1;
        tag = `${tag.slice(0, close).replace(/\s+$/, "")} ${attribute}${tag.slice(close)}`;
      }
    }
    output = output.slice(0, start) + tag + output.slice(end + 1);
  }
  return output;
}

export function cellEdit(marker: string, attributes: MatrixCellAttributes, nth?: number): MarkupEdit {
  return { marker, nth, set: attributes };
}

/** Renders a package element and applies attribute edits to its markup. */
export function StaticMarkup({ element, edits, id, block = false }: { element: ReactElement; edits: readonly MarkupEdit[]; id: string; block?: boolean }) {
  const html = applyMarkupEdits(renderToStaticMarkup(element, { identifierPrefix: `gplus-${id}-` }), edits);
  return block
    ? <div data-gplus-static-markup={id} dangerouslySetInnerHTML={{ __html: html }} />
    : <span data-gplus-static-markup={id} dangerouslySetInnerHTML={{ __html: html }} />;
}
