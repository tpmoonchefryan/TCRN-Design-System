// ShellDropdown — the drop-down of a pinned group or submenu, with its third- and fourth-level
// cascades (TCRN-DS-SUB-118; 07a board, section A, the drop-down state; 07b board, section D rows
// "固定二级菜单下拉" and "三、四级级联", section F tokens).
//
// It hangs from the pinned item that opened it: its start edge is the item's, its top the item's
// bottom plus --tcrn-shell-menu-gap (the item's box is read from the page; the gap is the token,
// as a margin). It is --tcrn-shell-drop-w wide with a space-1h inset: a search at
// --tcrn-shell-drop-srch-h (SearchInput sm through ProductShellSearch) that searches only this part
// of the menu, then the entries as rows with no icon column, whose text starts 16 in (space-1h +
// space-2h). A row with a next level opens it on a click — never on hover — as a cascade column
// the cascade gap to the right, as wide and as tall as the column on its left (the grid row
// stretches it; STORY-139 asks for no script-synced height). The drop-down is a non-modal dialog
// and the same transient layer as the full menu: a choice, Esc and a press outside close it, Esc
// closes every column and returns focus to the pinned item. It reuses the full menu's rows,
// search and keyboard (ShellMenu.tsx), so its root also carries tcrn-shell-menu.
//
// This module and Navigation.tsx may import each other; what it takes from Navigation.tsx is
// used inside function bodies only, never evaluated when the module loads (C-4).
import { useEffect, useLayoutEffect, useRef, useState, type HTMLAttributes, type RefObject } from "react";
import type { TcrnLocale } from "@tcrn/ui-copy-state";
import { cx } from "../../utils.js";
import { ProductShellSearch } from "./Navigation.js";
import {
  shellLayerTriggerOf,
  shellMenuCascades,
  shellMenuMaxDepth,
  shellMenuRow,
  shellMenuSearch,
  useShellMenuCascade,
  useShellTransientLayer,
  type ShellLayerCloseReason,
  type ShellMenuGroup,
  type ShellMenuItem,
  type ShellMenuRowContext,
  type ShellMenuSearchProvider
} from "./ShellMenu.js";
import { tcrnShellCopyFor } from "./shell-copy.js";

// Layout effects place the drop-down before it paints; there is no layout on the server.
const useClientLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** The provider a drop-down uses when the product passes none: the drop-down's part of the model. */
const searchTheSubtree: ShellMenuSearchProvider = (query, groups) => shellMenuSearch(groups, query);

export interface ShellDropdownProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title" | "id"> {
  /** Id of the drop-down dialog: the aria-controls of the pinned item (ShellPins menuIdOf). */
  id: string;
  /** The pinned group or submenu whose entries the drop-down lists. */
  source: ShellMenuGroup | ShellMenuItem;
  /** Level of the drop-down's own rows: 2 under a pinned group, 3 (the default) under a pinned item. */
  level?: number;
  /** Whether the drop-down is open; closed, nothing is rendered. */
  open: boolean;
  /** Asks to close the drop-down (Esc, a press outside, a choice). */
  onOpenChange?: (open: boolean, reason: ShellLayerCloseReason) => void;
  /** The pinned item; found through its aria-controls when omitted. */
  triggerRef?: RefObject<HTMLElement | null>;
  /** The row of the current page. */
  selectedId?: string | null;
  /** Ids of the pinned groups, items and children. */
  pinnedIds?: readonly string[];
  /** Pins or unpins a row; without it the rows have no pin. */
  onPinnedChange?: (id: string, pinned: boolean) => void;
  /** Placeholder of the search; "Search {name}" in the reader's language when omitted. */
  searchPlaceholder?: string;
  /** The search provider, given only this part of the menu; the model is searched when omitted. */
  searchProvider?: ShellMenuSearchProvider;
  /** Language of the copy; the page's own when omitted. */
  locale?: TcrnLocale | string;
  /**
   * Static states for documentation, by row id: data-tcrn-preview-state. A row with a next level
   * marked "open" starts with that level open (from the drop-down's own rows down), as a page
   * rendered on the server shows a drop-down with its cascade.
   */
  previewStates?: Readonly<Record<string, string>>;
}

function entriesOf(source: ShellMenuGroup | ShellMenuItem): readonly ShellMenuItem[] {
  return "items" in source ? source.items : (source.children ?? []);
}

/** The open path previewStates asks for: level by level, the row marked "open" that has a next level. */
function previewOpenPath(entries: readonly ShellMenuItem[], previewStates: Readonly<Record<string, string>> | undefined, firstLevel: number): string[] {
  const path: string[] = [];
  if (!previewStates) return path;
  let rows = entries;
  for (let level = firstLevel; level < shellMenuMaxDepth; level += 1) {
    const row = rows.find((entry) => (previewStates[entry.id] ?? "").split(/\s+/).includes("open") && (entry.children?.length ?? 0) > 0);
    if (!row) break;
    path.push(row.id);
    rows = row.children ?? [];
  }
  return path;
}

/**
 * Where a fixed layer's left and top are measured from: the viewport, or the padding box of the
 * nearest ancestor that contains fixed descendants (a transform, a perspective, a filter, layout
 * or paint containment, a size container), as a documentation page's framed screen does.
 */
function fixedLayerOrigin(layer: HTMLElement | null): { left: number; top: number } {
  const view = layer?.ownerDocument.defaultView;
  for (let node = layer?.parentElement ?? null; node && view; node = node.parentElement) {
    const style = view.getComputedStyle(node);
    const set = (property: string) => {
      const value = style.getPropertyValue(property).trim();
      return value !== "" && value !== "none" && value !== "normal" && value !== "auto";
    };
    const containment = style.getPropertyValue("contain");
    const willChange = style.getPropertyValue("will-change");
    if (
      set("transform") ||
      set("perspective") ||
      set("filter") ||
      set("backdrop-filter") ||
      set("container-type") ||
      /\b(layout|paint|strict|content)\b/.test(containment) ||
      /\b(transform|perspective|filter)\b/.test(willChange)
    ) {
      const box = node.getBoundingClientRect();
      return { left: box.left + node.clientLeft, top: box.top + node.clientTop };
    }
  }
  return { left: 0, top: 0 };
}

export function ShellDropdown({
  id,
  source,
  level,
  open,
  onOpenChange,
  triggerRef,
  selectedId = null,
  pinnedIds = [],
  onPinnedChange,
  searchPlaceholder,
  searchProvider = searchTheSubtree,
  locale,
  previewStates,
  className,
  style,
  onKeyDown,
  ...props
}: ShellDropdownProps) {
  const firstLevel = Math.min(level ?? ("items" in source ? 2 : 3), shellMenuMaxDepth);
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [anchor, setAnchor] = useState<{ left: number; top: number } | null>(null);
  const cascade = useShellMenuCascade(rootRef, firstLevel, previewOpenPath(entriesOf(source), previewStates, firstLevel));
  const { setOpenPath } = cascade;
  const onOpenChangeRef = useRef(onOpenChange);
  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  });

  useShellTransientLayer({
    open,
    layerRef: rootRef,
    triggerRef,
    controlsId: id,
    onClose: (reason) => onOpenChangeRef.current?.(false, reason)
  });

  // The start edge and the bottom of the pinned item, read again when the page moves or the band
  // changes size, from the origin the fixed drop-down is placed against (the viewport, unless an
  // ancestor contains it).
  const placeRef = useRef<() => void>(() => undefined);
  useClientLayoutEffect(() => {
    if (!open) return undefined;
    const trigger = () => triggerRef?.current ?? shellLayerTriggerOf(document, id);
    const place = () => {
      const box = trigger()?.getBoundingClientRect();
      if (!box) return;
      const origin = fixedLayerOrigin(rootRef.current);
      const left = box.left - origin.left;
      const top = box.bottom - origin.top;
      setAnchor((previous) => (previous && previous.left === left && previous.top === top ? previous : { left, top }));
    };
    placeRef.current = place;
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    const band = trigger()?.parentElement;
    const resized = band && typeof ResizeObserver === "function" ? new ResizeObserver(place) : null;
    if (band) resized?.observe(band);
    return () => {
      placeRef.current = () => undefined;
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
      resized?.disconnect();
    };
  }, [open, id, triggerRef]);
  // The pinned item moves when the band's words change (another language, a renamed item): read
  // again after every render; an unchanged place renders nothing new.
  useClientLayoutEffect(() => {
    placeRef.current();
  });

  // Opening puts focus in the search; closing forgets the query and the open cascades.
  useEffect(() => {
    if (open) {
      rootRef.current?.querySelector<HTMLElement>('[data-shell-search] input[type="search"]')?.focus();
      return;
    }
    setQuery("");
    setOpenPath([]);
  }, [open, setOpenPath]);

  if (!open) return null;
  const copy = tcrnShellCopyFor(locale);
  const entries = entriesOf(source);
  const columnIdOf = (entryId: string) => `${id}-col-${entryId}`;
  const context: ShellMenuRowContext = {
    selectedId,
    pinnedIds: new Set(pinnedIds),
    onPinnedChange,
    locale,
    previewStates,
    openPath: cascade.openPath,
    firstLevel,
    columnIdOf,
    onToggle: cascade.toggle
  };
  const cascades = shellMenuCascades(entries, context, "tcrn-shell-menu__cascade tcrn-shell-dropdown__col");
  const searching = query.trim().length > 0;
  const results = searching ? searchProvider(query, [{ id: source.id, label: source.label, items: entries }]) : [];
  return (
    <div
      {...props}
      ref={rootRef}
      className={cx("tcrn-shell-menu", "tcrn-shell-dropdown", className)}
      style={anchor ? { ...style, left: `${anchor.left}px`, top: `${anchor.top}px` } : { ...style, visibility: "hidden" }}
      data-shell-dropdown=""
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (!event.defaultPrevented) cascade.onKeyDown(event);
      }}
    >
      <section
        id={id}
        className="tcrn-shell-dropdown__panel"
        role="dialog"
        aria-modal="false"
        aria-label={source.label}
        aria-owns={cascades.length > 0 ? cascade.openPath.map(columnIdOf).join(" ") : undefined}
        data-panel="drop"
      >
        <ProductShellSearch
          className="tcrn-shell-menu__search tcrn-shell-dropdown__search"
          locale={locale}
          placeholder={searchPlaceholder ?? copy.searchWithin(source.label)}
          shortcut={false}
          query={query}
          expanded={searching}
          results={results}
          onQueryChange={(next) => {
            setQuery(next);
            setOpenPath([]);
          }}
          data-shell-search=""
        />
        {searching ? null : (
          <div className="tcrn-shell-dropdown__list" data-shell-col="">
            {entries.map((entry) => shellMenuRow(entry, firstLevel, context))}
          </div>
        )}
      </section>
      {cascades}
    </div>
  );
}
