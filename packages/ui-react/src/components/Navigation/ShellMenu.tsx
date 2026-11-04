// ShellMenu — the full menu the brand button opens (TCRN-DS-SUB-116; 07a board, section A, the
// expanded state; 07b board, section D rows "完整菜单" and "右下角锁定块", section F tokens).
//
// One step opens it: there is no small panel and no collapse button. The menu is a non-modal
// dialog under the brand button. Its top is the brand button's bottom plus the hand-off gap,
// written as the token calculation (strip-h − brand-h) / 2 + brand-h + menu-gap; its start edge
// is the paper's (space-3, 12); it is --tcrn-shell-panel-w-expanded wide and at most the
// viewport less the top band high. Inside, top to bottom: the search (ProductShellSearch, whose
// field is SearchInput at --tcrn-shell-srch-h), the groups in three columns (gap space-4, rows
// --tcrn-shell-row-h; a group title is a NavGroup and an item a NavItem, each with its pin slot
// when the product handles pinning) and the bottom bar: the current position and the side-rail
// lockup. The bar is --tcrn-shell-pbar-h plus the panel's bottom inset (space-2) high, so the
// lockup and the trail sit midway between the bar's top rule and the panel's bottom edge. The
// lockup is ShellBrandLockup as the Brand board's section E draws it, a picture and not a
// control: role="img", outside the Tab sequence, no hover.
//
// Behaviour (TCRN-DS-SUB-117; 07b board, section E "键盘与读屏"): the menu is a transient layer —
// a choice, Esc and a press outside close it, and Esc or a choice returns focus to the brand
// button (useShellTransientLayer, which the drop-downs use too). ⌘K or Ctrl+K opens it and
// focuses the search; the shell registers that key once, on the document, for as long as the
// menu is mounted. In the menu ↑↓ walk the rows of a column, → opens a row's next level as a
// cascade column (or, on a row without one, moves to the next group column) and ← returns to the
// column on the left. A row's next level opens on a click, never on hover. The search reaches the
// whole site through the provider interface of ProductShellSearch; without a provider it searches
// the menu model, and while a query is typed the columns give way to its results. Narrower than
// 1024 the band shows no pinned items, so the menu adds a group of them all. Opening honours
// prefers-reduced-motion: no fade, no transition.
//
// The menu model is the product's: groups, their items, the items' children (third level) and
// theirs (fourth level, the last); deeper entries are not shown.
//
// TCRN-DS-SUB-147 (R2-15, R2-20): the query may be the product's (query, defaultQuery,
// onQueryChange; without them the menu keeps its own, as before), and a group or an entry may
// carry a description, which its row says to a screen reader (aria-describedby to a .tcrn-sr-only
// element) and which draws nothing; without one the row's markup is unchanged.
//
// The Sheet (TCRN-DS-SUB-126; 07a board, section A, screens A7 and A8; 07b board, section D row
// "窄于 1024"): on a viewport 390 wide or narrower the menu is not the panel but a Sheet that rises
// from the bottom edge and stays below the top band (at most 84% of the viewport high), over a
// scrim of 20% ink. Top to bottom it holds a grab line (a picture), the search and one list: the
// pinned entries first under "固定项 · n", then every group under "全部". Rows and the search are 44
// high there, and a pin takes presses 44 across. A row with a next level opens it on a press, as
// in the panel; the level follows the lists in the Sheet, titled with the row's name. There is no
// bottom bar: on a phone the paper shows the current position. The Sheet is the same transient
// layer (a press on the scrim is a press outside); opened by a press it takes focus itself, so no
// on-screen keyboard rises, and opened by ⌘K focus goes to the search. ShellMenu picks the
// presentation itself (useShellMenuPresentation); a page rendered on the server, which cannot see
// the viewport, sets it through shellMenuPresentationContext or the presentation prop.
//
// This module and Navigation.tsx may import each other; what it takes from Navigation.tsx is
// used inside function bodies only, never evaluated when the module loads (C-4).
import {
  Fragment,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type RefObject
} from "react";
import type { TcrnLocale } from "@tcrn/ui-copy-state";
import { tcrnTokens } from "@tcrn/ui-tokens";
import { Icon, type IconName } from "../Icon/index.js";
import { cx } from "../../utils.js";
import { NavGroup, NavItem, ProductShellSearch, ShellBrandLockup, type ProductShellSearchResult, type TcrnProductLogoId } from "./Navigation.js";
import type { ShellPinItem } from "./ShellPins.js";
import { tcrnShellCopyFor, tcrnShellLandmarkName } from "./shell-copy.js";

// A row's next-level chevron and the bottom bar's position separator are the shell.chevron token,
// 12 on the board (TCRN-DS-SUB-178). Icon takes its size as a number, so the number is read from
// the token table, as the breadcrumb separator reads shell.crumb-icon: a token change moves both.
function shellChevronPixels(): number {
  const token = tcrnTokens.find((candidate) => candidate.variable === "--tcrn-shell-chevron");
  const pixels = token && /^\d+(?:\.\d+)?px$/.test(token.value) ? Number.parseFloat(token.value) : Number.NaN;
  if (!Number.isFinite(pixels)) throw new Error("ShellMenu: --tcrn-shell-chevron is missing from @tcrn/ui-tokens or is not a pixel length.");
  return pixels;
}

const shellChevronSize = shellChevronPixels();

/** An entry of the menu model below the groups: an item (second level) or a child (third, fourth). */
export interface ShellMenuItem {
  /** Stable id: the key of the row in the pin preferences, the selected id and data-pin. */
  id: string;
  /** Visible name; it truncates on one line and is repeated in the title. */
  label: string;
  /** Destination of the row. A row with a next level opens it instead of navigating. */
  href?: string;
  /** Roster icon; the full menu's columns show it, the drop-down and the cascades do not. */
  iconName?: IconName;
  /** The next level. An item's children are the third level, theirs the fourth and last. */
  children?: readonly ShellMenuItem[];
  /**
   * What the entry holds, said with its row to a screen reader (aria-describedby to a
   * .tcrn-sr-only element); nothing is drawn, and without it the row's markup is unchanged.
   */
  description?: string;
}

/** The first level of the menu model: a titled group of items, one column of the full menu. */
export interface ShellMenuGroup {
  id: string;
  label: string;
  /**
   * What the group (a category of the menu) holds, said to a screen reader with its title row in
   * the panel and with its row in the Sheet (aria-describedby to a .tcrn-sr-only element); nothing
   * is drawn, and without it the markup is unchanged.
   */
  description?: string;
  iconName?: IconName;
  items: readonly ShellMenuItem[];
}

/** One step of the current position in the bottom bar; the last step is the current page. */
export interface ShellMenuCrumb {
  label: string;
  href?: string;
}

/** The deepest level the menu model reaches: group, item, child, child of a child. */
export const shellMenuMaxDepth = 4;

/** Why a transient layer closed: Esc, a press outside it and the trigger, or a choice in it. */
export type ShellLayerCloseReason = "escape" | "outside-pointer" | "selection";

/** Why the full menu asks to open or close. */
export type ShellMenuOpenChangeReason = "shortcut" | ShellLayerCloseReason;

/** The search provider: the results for a query, given the part of the model being searched. */
export type ShellMenuSearchProvider = (query: string, groups: readonly ShellMenuGroup[]) => readonly ProductShellSearchResult[];

function normalized(text: string): string {
  return text.normalize("NFKC").toLocaleLowerCase();
}

/**
 * The built-in search provider: every entry with a destination whose name, or the name of an
 * item above it, holds the query — so "合约" keeps the contract pages and the pages under them.
 * The result's meta is the entry's path.
 */
export function shellMenuSearch(groups: readonly ShellMenuGroup[], query: string): ProductShellSearchResult[] {
  const needle = normalized(query.trim());
  if (!needle) return [];
  const results: ProductShellSearchResult[] = [];
  const visit = (entries: readonly ShellMenuItem[], path: readonly string[], level: number, related: boolean) => {
    for (const entry of entries) {
      const matches = related || normalized(entry.label).includes(needle);
      if (matches && entry.href) results.push({ id: entry.id, title: entry.label, meta: path.join(" › "), href: entry.href });
      if (entry.children && level < shellMenuMaxDepth) visit(entry.children, [...path, entry.label], level + 1, matches);
    }
  };
  for (const group of groups) visit(group.items, [group.label], 2, false);
  return results;
}

/** The provider a menu uses when the product passes none: the part of the model being searched. */
const searchTheModel: ShellMenuSearchProvider = (query, groups) => shellMenuSearch(groups, query);

/** The trigger of a layer: the element that names `controlsId` in its aria-controls. */
export function shellLayerTriggerOf(doc: Document, controlsId: string | undefined): HTMLElement | null {
  if (!controlsId) return null;
  for (const element of doc.querySelectorAll<HTMLElement>("[aria-controls]")) {
    if ((element.getAttribute("aria-controls") ?? "").split(/\s+/).includes(controlsId)) return element;
  }
  return null;
}

export interface ShellTransientLayerOptions {
  /** Whether the layer is open; the listeners exist only then. */
  open: boolean;
  /** The layer: presses inside it are not outside, and a link chosen in it closes it. */
  layerRef: RefObject<HTMLElement | null>;
  /** The control that opened the layer; presses on it are not outside, and focus returns to it. */
  triggerRef?: RefObject<HTMLElement | null>;
  /** Without a trigger ref, the trigger is the element whose aria-controls names this id. */
  controlsId?: string;
  /** Asks to close the layer. */
  onClose: (reason: ShellLayerCloseReason) => void;
  /** Changes when the layer is another element while it stays open (the full menu's panel and Sheet); the listeners move to it. */
  layerKey?: string;
}

/**
 * The transient layer shared by the full menu, the drop-downs and the Sheet (C-7): Esc closes
 * it and returns focus to its trigger; a press outside the layer and the trigger closes it and
 * leaves focus where the press put it; following a link inside it closes it and returns focus
 * to the trigger. A row that opens a next level (it says aria-expanded) and a pin
 * ([data-pin-button]) are not choices and keep the layer open. The layer is non-modal: focus is
 * never trapped.
 */
export function useShellTransientLayer({ open, layerRef, triggerRef, controlsId, onClose, layerKey }: ShellTransientLayerOptions): void {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });
  useEffect(() => {
    const layer = layerRef.current;
    if (!open || !layer) return undefined;
    const doc = layer.ownerDocument;
    const trigger = () => triggerRef?.current ?? shellLayerTriggerOf(doc, controlsId);
    const close = (reason: ShellLayerCloseReason, restoreFocus: boolean) => {
      if (restoreFocus) trigger()?.focus();
      onCloseRef.current(reason);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      const focused = doc.activeElement;
      // Several documentation previews can be open. Only the layer containing focus owns Esc.
      if (focused && focused !== doc.body && !layer.contains(focused) && !trigger()?.contains(focused)) return;
      event.preventDefault();
      close("escape", true);
    };
    const onPointerDown = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Node) || layer.contains(target) || trigger()?.contains(target)) return;
      close("outside-pointer", false);
    };
    const onClick = (event: MouseEvent) => {
      // An element node, read without the Element global (absent from some test environments).
      const target = event.target instanceof Node && event.target.nodeType === 1 ? (event.target as Element) : null;
      if (!target || target.closest("[data-pin-button]")) return;
      const link = target.closest("a[href]");
      if (!link || !layer.contains(link) || link.hasAttribute("aria-expanded")) return;
      close("selection", true);
    };
    doc.addEventListener("keydown", onKeyDown);
    doc.addEventListener("pointerdown", onPointerDown);
    layer.addEventListener("click", onClick);
    return () => {
      doc.removeEventListener("keydown", onKeyDown);
      doc.removeEventListener("pointerdown", onPointerDown);
      layer.removeEventListener("click", onClick);
    };
  }, [open, layerRef, triggerRef, controlsId, layerKey]);
}

/** What a row needs from the menu that renders it (the full menu, a cascade or a drop-down). */
export interface ShellMenuRowContext {
  selectedId: string | null;
  pinnedIds: ReadonlySet<string>;
  onPinnedChange?: (id: string, pinned: boolean) => void;
  locale?: TcrnLocale | string;
  /** Static states for documentation, by row id: data-tcrn-preview-state (hover, focus). */
  previewStates?: Readonly<Record<string, string>>;
  /** Ids of the rows whose next level is open, outermost first. */
  openPath?: readonly string[];
  /** The level of the rows the open path starts from (the menu's first column). */
  firstLevel?: number;
  /** Id of the cascade column that lists an entry's next level. */
  columnIdOf?: (id: string) => string;
  /** Opens or closes an entry's next level. */
  onToggle?: (id: string, level: number) => void;
}

/** The pin props of a row: present only when the product handles pinning (C-6). */
export function shellMenuPinProps(id: string, label: string, context: ShellMenuRowContext) {
  const onPinnedChange = context.onPinnedChange;
  if (!onPinnedChange) return {};
  return { pinned: context.pinnedIds.has(id), onPinnedChange: (pinned: boolean) => onPinnedChange(id, pinned), pinLabel: label };
}

/**
 * One row of a menu column: a NavItem whose text truncates on one line (with the name in the
 * title) and which carries a 12 chevron when the entry has a next level within the model's four.
 * Such a row is a button for its cascade column (aria-expanded, aria-controls): a click or Space
 * opens or closes it.
 */
export function shellMenuRow(item: ShellMenuItem, level: number, context: ShellMenuRowContext, extra: { iconName?: IconName } = {}): ReactNode {
  const hasNext = level < shellMenuMaxDepth && (item.children?.length ?? 0) > 0;
  const onToggle = context.onToggle;
  const toggles = hasNext && onToggle && context.columnIdOf;
  const open = toggles ? context.openPath?.[level - (context.firstLevel ?? 2)] === item.id : false;
  const toggleProps = toggles
    ? {
        role: "button",
        "aria-expanded": open,
        "aria-controls": context.columnIdOf?.(item.id),
        onClick: (event: { preventDefault(): void }) => {
          event.preventDefault();
          onToggle(item.id, level);
        },
        onKeyDown: (event: ReactKeyboardEvent<HTMLAnchorElement>) => {
          if (event.key !== " ") return;
          event.preventDefault();
          onToggle(item.id, level);
        }
      }
    : { href: item.href };
  const row = (describedBy?: string) => (
    <NavItem key={item.id}
      selected={item.id === context.selectedId}
      iconName={extra.iconName}
      locale={context.locale}
      title={item.label}
      aria-describedby={describedBy}
      data-shell-row=""
      data-shell-level={level}
      data-tcrn-preview-state={context.previewStates?.[item.id]}
      {...toggleProps}
      {...shellMenuPinProps(item.id, item.label, context)}
    >
      <span className="tcrn-shell-menu__text">{item.label}</span>
      {hasNext ? <Icon name="chevron-right" size={shellChevronSize} className="tcrn-shell-menu__sub" /> : null}
    </NavItem>
  );
  const description = item.description?.trim();
  return description ? <ShellMenuDescribed key={item.id} description={description} render={row} /> : row();
}

/**
 * A row and its description: the row (rendered by `render` with the description's id for its
 * aria-describedby) and, after it, the description in a .tcrn-sr-only element, which draws nothing.
 */
function ShellMenuDescribed({ description, render }: { description: string; render: (descriptionId: string) => ReactNode }) {
  const descriptionId = useId();
  return (
    <>
      {render(descriptionId)}
      <span id={descriptionId} className="tcrn-sr-only">
        {description}
      </span>
    </>
  );
}

/**
 * The cascade columns of the open path: each lists the next level of the row opened in the
 * column to its left, under a title row that names (and pins) that row. They are grid columns
 * after the menu's own, the cascade gap apart and as tall as the first (C-7, STORY-139).
 */
export function shellMenuCascades(first: readonly ShellMenuItem[], context: ShellMenuRowContext, className: string): ReactNode[] {
  const columns: ReactNode[] = [];
  const columnIdOf = context.columnIdOf;
  if (!columnIdOf) return columns;
  let entries = first;
  let level = context.firstLevel ?? 2;
  for (const [index, id] of (context.openPath ?? []).entries()) {
    const parent = entries.find((entry) => entry.id === id);
    const children = parent?.children ?? [];
    if (!parent || level >= shellMenuMaxDepth || children.length === 0) break;
    const childLevel = level + 1;
    columns.push(
      <NavGroup key={parent.id}
        id={columnIdOf(parent.id)}
        label={parent.label}
        locale={context.locale}
        role="group"
        aria-label={parent.label}
        className={className}
        data-drop-col={index + 2}
        data-shell-col=""
        {...shellMenuPinProps(parent.id, parent.label, context)}
      >
        {children.map((child) => shellMenuRow(child, childLevel, context))}
      </NavGroup>
    );
    entries = children;
    level = childLevel;
  }
  return columns;
}

/**
 * The open path of a menu's cascades and its keyboard: ↑↓ walk the rows of a column (↓ from the
 * search enters the first column or the first result), → opens a row's next level and moves into
 * it, or on a row without one moves to the next non-cascade column, ← returns from a cascade to
 * the row that opened it (closing the cascade) or moves to the previous column.
 */
export function useShellMenuCascade(rootRef: RefObject<HTMLElement | null>, firstLevel: number, initialOpenPath: readonly string[] = []) {
  // The open path starts empty, or where a documentation preview asks (ShellDropdown previewStates "open").
  const [openPath, setOpenPath] = useState<readonly string[]>(initialOpenPath);
  const pendingFocus = useRef<string | null>(null);
  useEffect(() => {
    const columnId = pendingFocus.current;
    if (!columnId) return;
    pendingFocus.current = null;
    rootRef.current?.ownerDocument.getElementById(columnId)?.querySelector<HTMLElement>("[data-shell-row]")?.focus();
  });
  const toggle = useCallback(
    (id: string, level: number) => {
      const index = level - firstLevel;
      setOpenPath((path) => (path[index] === id ? path.slice(0, index) : [...path.slice(0, index), id]));
    },
    [firstLevel]
  );
  const onKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLElement>) => {
      const root = rootRef.current;
      const target = event.target;
      if (!root || !(target instanceof HTMLElement) || !["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(event.key)) return;
      const columns = [...root.querySelectorAll<HTMLElement>("[data-shell-col]")];
      const rowsOf = (column: HTMLElement | undefined) =>
        column ? [...column.querySelectorAll<HTMLElement>("[data-shell-row]")].filter((row) => row.closest("[data-shell-col]") === column) : [];
      const isCascade = (column: HTMLElement | undefined) => Boolean(column?.hasAttribute("data-drop-col"));
      const search = () => root.querySelector<HTMLElement>('[data-shell-search] input[type="search"]');
      if (target.matches('input[type="search"]')) {
        if (event.key !== "ArrowDown") return;
        const first = root.querySelector<HTMLElement>("[data-search-result]") ?? rowsOf(columns.find((column) => !isCascade(column)))[0];
        if (first) {
          event.preventDefault();
          first.focus();
        }
        return;
      }
      if (target.matches("[data-search-result]")) {
        if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
        event.preventDefault();
        const results = [...root.querySelectorAll<HTMLElement>("[data-search-result]")];
        const next = results[results.indexOf(target) + (event.key === "ArrowDown" ? 1 : -1)];
        (next ?? (event.key === "ArrowUp" ? search() : null))?.focus();
        return;
      }
      if (!target.matches("[data-shell-row]")) return;
      const column = target.closest<HTMLElement>("[data-shell-col]") ?? undefined;
      const rows = rowsOf(column);
      const index = rows.indexOf(target);
      const position = column ? columns.indexOf(column) : -1;
      event.preventDefault();
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        const next = rows[index + (event.key === "ArrowDown" ? 1 : -1)];
        if (next) next.focus();
        else if (event.key === "ArrowUp" && !isCascade(column)) search()?.focus();
        return;
      }
      if (event.key === "ArrowRight") {
        const columnId = target.getAttribute("aria-controls");
        if (columnId && target.hasAttribute("aria-expanded")) {
          // An open next level is entered; a closed one is opened by the row's own toggle first.
          const opened = target.getAttribute("aria-expanded") === "true" ? root.ownerDocument.getElementById(columnId) : null;
          if (opened) {
            opened.querySelector<HTMLElement>("[data-shell-row]")?.focus();
            return;
          }
          pendingFocus.current = columnId;
          target.click();
          return;
        }
        const next = columns[position + 1];
        if (!isCascade(column) && next && !isCascade(next)) {
          const nextRows = rowsOf(next);
          nextRows[Math.min(index, nextRows.length - 1)]?.focus();
        }
        return;
      }
      // ArrowLeft
      if (isCascade(column) && column) {
        const left = columns[position - 1];
        // The row that opened the cascade. A pinned entry has a second row in the full menu's pinned
        // group, which is not shown at 1024 and wider; focus goes to a row that is rendered.
        const openers = [...rowsOf(left), ...root.querySelectorAll<HTMLElement>("[data-shell-row]")].filter(
          (row) => row.getAttribute("aria-controls") === column.id
        );
        const opener = openers.find((row) => row.getClientRects().length > 0) ?? openers[0];
        const depth = Number(column.getAttribute("data-drop-col")) - 2;
        setOpenPath((path) => path.slice(0, depth));
        opener?.focus();
        return;
      }
      const previous = columns[position - 1];
      if (previous && !isCascade(previous)) {
        const previousRows = rowsOf(previous);
        previousRows[Math.min(index, previousRows.length - 1)]?.focus();
      }
    },
    [firstLevel, rootRef]
  );
  return { openPath, setOpenPath, toggle, onKeyDown };
}

/** How the full menu shows: the panel under the brand button or the Sheet from the bottom edge; "auto" follows the viewport. */
export type ShellMenuPresentation = "auto" | "panel" | "sheet";

/** The published phone specimen is 390px. Hosts can explicitly choose Sheet; no unpublished 760px rule is inherited. */
export const shellMenuSheetMediaQuery = "(max-width: 390px)";

/**
 * The presentation of the full menus inside it that are given none; "auto" by default. A page
 * rendered on the server does not know the viewport, so one that shows a phone screen with the
 * menu open sets "sheet" here.
 */
export const shellMenuPresentationContext = createContext<ShellMenuPresentation>("auto");

/**
 * The presentation a full menu shows: the one given, else the context's; "auto" is the Sheet on a
 * viewport that matches shellMenuSheetMediaQuery and the panel otherwise. The viewport is read once
 * mounted, before the browser paints, and followed as it changes; on the server and in the first
 * render "auto" is the panel. ProductShell can read it to report data-state="sheet".
 */
export function useShellMenuPresentation(presentation?: ShellMenuPresentation, ownerRef?: RefObject<HTMLElement | null>): "panel" | "sheet" {
  const inherited = useContext(shellMenuPresentationContext);
  const wanted = presentation ?? inherited;
  const [narrow, setNarrow] = useState(false);
  useLayoutEffect(() => {
    if (wanted !== "auto" || typeof window === "undefined") return undefined;
    const owner = ownerRef?.current;
    const shell = owner?.closest<HTMLElement>(".tcrn-product-shell");
    const view = owner?.ownerDocument.defaultView ?? window;
    const update = () => setNarrow((shell ? shell.getBoundingClientRect().width : view.innerWidth) <= 390);
    update();
    const observer = shell && view.ResizeObserver ? new view.ResizeObserver(update) : null;
    if (shell) observer?.observe(shell);
    view.addEventListener("resize", update);
    return () => { observer?.disconnect(); view.removeEventListener("resize", update); };
  }, [wanted, ownerRef]);
  return wanted === "auto" ? (narrow ? "sheet" : "panel") : wanted;
}

export interface ShellMenuProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  /** The menu model: groups → items → children → children. */
  groups: readonly ShellMenuGroup[];
  /** Whether the menu is open; closed, nothing is rendered (the ⌘K key stays registered). */
  open: boolean;
  /** Asks to open the menu (⌘K or Ctrl+K) or to close it (Esc, a press outside, a choice). */
  onOpenChange?: (open: boolean, reason: ShellMenuOpenChangeReason) => void;
  /** The brand button: presses on it are not outside the menu, and focus returns to it. */
  triggerRef?: RefObject<HTMLElement | null>;
  /** The product whose side-rail lockup sits in the bottom bar. */
  productId: TcrnProductLogoId;
  /** The row of the current page: aria-current="page", the 6% wash and weight 600. */
  selectedId?: string | null;
  /** The current position shown in the bottom bar; the last step is the current page. */
  currentPath?: readonly ShellMenuCrumb[];
  /** Ids of the pinned groups, items and children. */
  pinnedIds?: readonly string[];
  /** Pins or unpins a row; without it the rows have no pin. */
  onPinnedChange?: (id: string, pinned: boolean) => void;
  /** The pinned items in the reader's order (the ShellPins list); narrower than 1024 the menu lists them all. */
  pinnedItems?: readonly ShellPinItem[];
  /** Placeholder of the search; a product-neutral one in the reader's language when omitted. */
  searchPlaceholder?: string;
  /** The search provider (whole-site targets); the menu model is searched when omitted. */
  searchProvider?: ShellMenuSearchProvider;
  /** Told the query as it is typed, for a provider that fetches. */
  onSearchQueryChange?: (query: string) => void;
  /** The query in the search, for a product that holds it; the menu keeps its own when omitted. */
  query?: string;
  /** The query the menu's own starts from (a page rendered with a query typed); empty when omitted. */
  defaultQuery?: string;
  /**
   * Asks to change the query: with each change typed, and with an empty one when the menu closes,
   * which forgets the query. A product that passes `query` sets it from here.
   */
  onQueryChange?: (query: string) => void;
  /** Whether the menu registers ⌘K / Ctrl+K on the document (one per shell); on by default. */
  shortcut?: boolean;
  /** Language of the menu's copy; the page's own when omitted. */
  locale?: TcrnLocale | string;
  /** Static states for documentation, by row or group id: data-tcrn-preview-state. */
  previewStates?: Readonly<Record<string, string>>;
  /** The panel or the Sheet; shellMenuPresentationContext's (by default "auto", the viewport's) when omitted. */
  presentation?: ShellMenuPresentation;
  /**
   * The name of the shell the menu belongs to, which tells its landmarks from another shell's on the
   * same page: the panel or the Sheet and the bottom bar's trail are named "{landmarkLabel} · {name}"
   * in the reader's language. Omitted, they keep the built-in names (TCRN-DS-SUB-184; ProductShell
   * passes its own, as it does to ShellPins).
   */
  landmarkLabel?: string;
}

export function ShellMenu({
  groups,
  open,
  onOpenChange,
  triggerRef,
  productId,
  selectedId = null,
  currentPath = [],
  pinnedIds = [],
  onPinnedChange,
  pinnedItems = [],
  searchPlaceholder,
  searchProvider = searchTheModel,
  onSearchQueryChange,
  query: controlledQuery,
  defaultQuery = "",
  onQueryChange,
  shortcut = true,
  locale,
  previewStates,
  presentation,
  landmarkLabel,
  id,
  className,
  onKeyDown,
  ...props
}: ShellMenuProps) {
  const generatedId = useId();
  const dialogId = id ?? `${generatedId}-menu`;
  const rootRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLElement>(null);
  const [ownQuery, setOwnQuery] = useState(defaultQuery);
  const query = controlledQuery ?? ownQuery;
  const shown = useShellMenuPresentation(presentation, rootRef);
  const sheet = shown === "sheet";
  // The Sheet's first list holds the groups themselves (level 1); the panel's columns are groups,
  // so its first rows are items (level 2).
  const firstLevel = sheet ? 1 : 2;
  const cascade = useShellMenuCascade(rootRef, firstLevel);
  const { setOpenPath } = cascade;
  const openRef = useRef(open);
  const onOpenChangeRef = useRef(onOpenChange);
  const sheetShownRef = useRef(sheet);
  const openedByShortcut = useRef(false);
  const queryRef = useRef(query);
  const onQueryChangeRef = useRef(onQueryChange);
  const queryControlledRef = useRef(controlledQuery !== undefined);
  // Whether the menu has been open since it mounted: mounting closed keeps the default query.
  const wasOpenRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
    onOpenChangeRef.current = onOpenChange;
    sheetShownRef.current = sheet;
    queryRef.current = query;
    onQueryChangeRef.current = onQueryChange;
    queryControlledRef.current = controlledQuery !== undefined;
  });
  const changeQuery = (next: string) => {
    if (controlledQuery === undefined) setOwnQuery(next);
    onQueryChange?.(next);
  };

  useShellTransientLayer({
    open,
    layerRef: rootRef,
    triggerRef,
    controlsId: dialogId,
    onClose: (reason) => onOpenChangeRef.current?.(false, reason),
    layerKey: shown
  });

  // ⌘K / Ctrl+K: one listener per shell, on the document, removed on unmount.
  useEffect(() => {
    if (!shortcut || typeof document === "undefined") return undefined;
    const onShortcut = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "k" || !(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) return;
      event.preventDefault();
      if (openRef.current) rootRef.current?.querySelector<HTMLElement>('[data-shell-search] input[type="search"]')?.focus();
      else {
        openedByShortcut.current = true;
        onOpenChangeRef.current?.(true, "shortcut");
      }
    };
    document.addEventListener("keydown", onShortcut);
    return () => document.removeEventListener("keydown", onShortcut);
  }, [shortcut]);

  // Opening puts focus in the search — or, for a Sheet opened by a press, on the Sheet itself, so
  // that no on-screen keyboard rises over it; closing forgets the query and the open cascades.
  useEffect(() => {
    if (open) {
      wasOpenRef.current = true;
      const search = rootRef.current?.querySelector<HTMLElement>('[data-shell-search] input[type="search"]');
      (sheetShownRef.current && !openedByShortcut.current ? sheetRef.current : search)?.focus();
      openedByShortcut.current = false;
      return;
    }
    setOpenPath([]);
    if (!wasOpenRef.current) return;
    wasOpenRef.current = false;
    if (!queryControlledRef.current) setOwnQuery("");
    if (queryRef.current !== "") onQueryChangeRef.current?.("");
  }, [open, setOpenPath]);

  // The open path's levels mean different rows in the two presentations: switching forgets it.
  // Focus that was in the presentation that left went with it; it moves into the one that came.
  useEffect(() => {
    setOpenPath((path) => (path.length > 0 ? [] : path));
    const root = rootRef.current;
    if (!openRef.current || !root) return;
    const active = root.ownerDocument.activeElement;
    if (active && active !== root.ownerDocument.body) return;
    (sheet ? sheetRef.current : root.querySelector<HTMLElement>('[data-shell-search] input[type="search"]'))?.focus();
  }, [sheet, setOpenPath]);

  // In the Sheet a level opens after the lists: a press that opens one brings it into view.
  const lastOpen = cascade.openPath[cascade.openPath.length - 1];
  useEffect(() => {
    if (!sheet || !lastOpen) return;
    rootRef.current?.ownerDocument.getElementById(`${generatedId}-col-${lastOpen}`)?.scrollIntoView?.({ block: "nearest" });
  }, [sheet, lastOpen, generatedId]);

  if (!open) return null;
  const copy = tcrnShellCopyFor(locale);
  const landmarkName = (name: string) => tcrnShellLandmarkName(locale, landmarkLabel, name);
  const columnIdOf = (entryId: string) => `${generatedId}-col-${entryId}`;
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
  const results = query.trim() ? searchProvider(query, groups) : [];
  const searching = query.trim().length > 0;
  const searchField = (
    <ProductShellSearch
      className="tcrn-shell-menu__search"
      locale={locale}
      placeholder={searchPlaceholder ?? copy.searchNavigation}
      shortcut={sheet ? false : "auto"}
      query={query}
      expanded={searching}
      results={results}
      onQueryChange={(next) => {
        changeQuery(next);
        setOpenPath([]);
        onSearchQueryChange?.(next);
      }}
      onDismiss={(reason) => {
        if (reason !== "escape") return;
        const trigger = triggerRef?.current ?? (rootRef.current && shellLayerTriggerOf(rootRef.current.ownerDocument, dialogId));
        trigger?.focus();
        onOpenChangeRef.current?.(false, "escape");
      }}
      data-shell-search=""
    />
  );
  const onRootKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (!event.defaultPrevented) cascade.onKeyDown(event);
  };
  // The pinned group lists the pinned entries as the model has them (a pinned group opens its
  // items as a cascade); an id the model does not hold is a plain link to the pin's destination.
  const levelTwo: ShellMenuItem[] = groups.flatMap((group) => group.items);

  if (sheet) {
    // The Sheet's lists: the pinned entries, then every group as a row that opens its items. The
    // levels of the open path follow the lists, one titled column each.
    const groupRows: ShellMenuItem[] = groups.map((group) => ({ id: group.id, label: group.label, iconName: group.iconName, children: group.items, description: group.description }));
    const pinnedSheetRows: ShellMenuItem[] = pinnedItems.map(
      (pin) => groupRows.find((row) => row.id === pin.id) ?? levelTwo.find((entry) => entry.id === pin.id) ?? { id: pin.id, label: pin.label, href: pin.href }
    );
    const levels = shellMenuCascades([...groupRows, ...pinnedSheetRows.filter((row) => !groupRows.includes(row))], context, "tcrn-shell-sheet__group");
    return (
      <>
        <div className="tcrn-shell-sheet__scrim" data-shell-scrim="" aria-hidden="true" />
        <div {...props} ref={rootRef} className={cx("tcrn-shell-menu", "tcrn-shell-sheet", className)} data-shell-menu="" onKeyDown={onRootKeyDown}>
          <section ref={sheetRef} id={dialogId} className="tcrn-shell-sheet__panel" role="dialog" aria-modal="false" aria-label={landmarkName(copy.navigation)} tabIndex={-1} data-panel="sheet">
            <span className="tcrn-shell-sheet__grab" aria-hidden="true" />
            {searchField}
            {searching ? null : (
              <div className="tcrn-shell-sheet__list" data-shell-cols="" role="region" aria-label={landmarkName(copy.allNavigation)} tabIndex={0}>
                {pinnedSheetRows.length > 0 ? (
                  <NavGroup
                    label={copy.pinnedItemsOf(pinnedSheetRows.length)}
                    locale={locale}
                    className="tcrn-shell-sheet__group"
                    data-shell-group=""
                    data-shell-col=""
                    data-shell-pinned-group=""
                  >
                    {pinnedSheetRows.map((row) => shellMenuRow(row, firstLevel, context, { iconName: row.iconName }))}
                  </NavGroup>
                ) : null}
                <NavGroup label={copy.allNavigation} locale={locale} className="tcrn-shell-sheet__group" data-shell-group="" data-shell-col="">
                  {groupRows.map((row) => shellMenuRow(row, firstLevel, context, { iconName: row.iconName }))}
                </NavGroup>
                {levels}
              </div>
            )}
          </section>
        </div>
      </>
    );
  }

  const pinnedRows: ShellMenuItem[] = pinnedItems.map((pin) => {
    const group = groups.find((candidate) => candidate.id === pin.id);
    if (group) return { id: group.id, label: group.label, children: group.items };
    return levelTwo.find((entry) => entry.id === pin.id) ?? { id: pin.id, label: pin.label, href: pin.href };
  });
  const cascadeFirst = [...levelTwo, ...pinnedRows.filter((row) => !levelTwo.includes(row))];
  const cascades = shellMenuCascades(cascadeFirst, context, "tcrn-shell-menu__cascade");
  const last = currentPath.length - 1;
  const ownedColumns = cascade.openPath.map(columnIdOf).join(" ");
  return (
    <div
      {...props}
      ref={rootRef}
      className={cx("tcrn-shell-menu", className)}
      data-shell-menu=""
      onKeyDown={onRootKeyDown}
    >
      <section
        id={dialogId}
        className="tcrn-shell-menu__panel"
        role="dialog"
        aria-modal="false"
        aria-label={landmarkName(copy.navigation)}
        aria-owns={cascades.length > 0 ? ownedColumns : undefined}
        data-panel="expanded"
      >
        {searchField}
        {searching ? null : (
          <div className="tcrn-shell-menu__cols" data-shell-cols="">
            {groups.map((group) => (
              <NavGroup key={group.id}
                label={group.label}
                description={group.description}
                locale={locale}
                className="tcrn-shell-menu__col"
                data-shell-group=""
                data-shell-col=""
                data-tcrn-preview-state={previewStates?.[group.id]}
                {...shellMenuPinProps(group.id, group.label, context)}
              >
                {group.items.map((item) => shellMenuRow(item, 2, context, { iconName: item.iconName }))}
              </NavGroup>
            ))}
            {pinnedRows.length > 0 ? (
              <NavGroup
                label={copy.pinnedGroup}
                locale={locale}
                className="tcrn-shell-menu__col tcrn-shell-menu__col--pinned"
                data-shell-group=""
                data-shell-col=""
                data-shell-pinned-group=""
              >
                {pinnedRows.map((row) => shellMenuRow(row, 2, context, { iconName: row.iconName }))}
              </NavGroup>
            ) : null}
          </div>
        )}
        <div className="tcrn-shell-menu__pbar" data-shell-pbar="">
          <nav className="tcrn-shell-menu__crumbs" aria-label={landmarkName(copy.currentPosition)}>
            <span className="tcrn-shell-menu__crumbs-label" aria-hidden="true" title={copy.currentPosition}>
              {copy.currentPosition}
            </span>
            {currentPath.map((crumb, index) => (
              <Fragment key={`${index}-${crumb.label}`}>
                {index > 0 ? <Icon name="chevron-right" size={shellChevronSize} className="tcrn-shell-menu__crumb-sep" /> : null}
                {index === last ? (
                  <b className="tcrn-shell-menu__crumb tcrn-shell-menu__crumb--current" aria-current="page" title={crumb.label}>
                    {crumb.label}
                  </b>
                ) : crumb.href ? (
                  <a className="tcrn-shell-menu__crumb" href={crumb.href} title={crumb.label}>
                    {crumb.label}
                  </a>
                ) : (
                  <span className="tcrn-shell-menu__crumb" title={crumb.label}>
                    {crumb.label}
                  </span>
                )}
              </Fragment>
            ))}
          </nav>
          <ShellBrandLockup productId={productId} locale={locale} role="img" className="tcrn-shell-menu__lockup" data-lockup="lkr" />
        </div>
      </section>
      {cascades}
    </div>
  );
}
