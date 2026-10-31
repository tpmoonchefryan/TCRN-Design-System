// ShellPins — the pinned items of the top band (TCRN-DS-SUB-115; 07a board, section A and the
// pin rows of section B; 07b board, section F).
//
// The band shows the pinned items in the reader's order, after the brand button: each item is
// --tcrn-shell-pin-h high, and the gap from the brand button to the first item and between items
// is one value, --tcrn-shell-pin-gap, with no divider. At most --tcrn-shell-pins-max items show;
// the ids from the next one on are the overflow, which the full menu marks as pinned
// (shellPinsOverflowIds). Narrower than 1024 the band shows no pinned items at all: the whole
// group is hidden and the full menu carries them. An item with a drop-down is a button that opens
// a non-modal dialog (aria-haspopup="dialog", aria-expanded, aria-controls); an item without one
// is a link, and the current page's link says aria-current="page". The selected item takes the
// day 6% / night 7% ink wash and weight 600, never a side bar; hover takes the 3.5% wash.
//
// Ordering (TCRN-DS-SUB-149; STORY-140 GWT3, STORY-137): given onPinsReorder, the reader reorders
// the items the band shows. A press that travels past the drag threshold is a drag: the dragged
// item moves in place among the others as the pointer passes their middles — the band draws no
// insertion line, no ghost and no handle — and letting go hands the new order to onPinsReorder;
// the press that ended a drag opens nothing and follows no link. Alt+← and Alt+→ move the focused
// item one place (the other way round in a right-to-left band), and focus stays on it. Keeping the
// order is the ProductShell preferences' (useProductShellController's movePin); this part takes an
// ordered list and reports a new order and which drop-down to open.
import {
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type DragEvent as ReactDragEvent,
  type PointerEvent as ReactPointerEvent
} from "react";
import type { TcrnLocale } from "@tcrn/ui-copy-state";
import { tcrnTokens } from "@tcrn/ui-tokens";
import { Icon } from "../Icon/index.js";
import { cx } from "../../utils.js";
import { tcrnShellCopyFor } from "./shell-copy.js";

export interface ShellPinItem {
  /** Stable id: the key of the item in the pin preferences and in data-pin. */
  id: string;
  /** Visible name; it truncates on one line and is repeated in the title. */
  label: string;
  /** Destination of an item without a drop-down. */
  href?: string;
  /** Whether the item opens a drop-down instead of navigating. */
  hasMenu?: boolean;
}

/** The most pinned items the top band shows: --tcrn-shell-pins-max from @tcrn/ui-tokens. */
export function shellPinsMax(): number {
  const token = tcrnTokens.find((candidate) => candidate.variable === "--tcrn-shell-pins-max");
  const max = token ? Number(token.value) : Number.NaN;
  if (!Number.isInteger(max) || max < 1) throw new Error("ShellPins: --tcrn-shell-pins-max is not a whole count in @tcrn/ui-tokens");
  return max;
}

// A pinned item's drop-down chevron is the shell.chevron token, 12 on the board (TCRN-DS-SUB-178).
// Icon takes its size as a number, so the number is read from the token table, as the breadcrumb
// separator reads shell.crumb-icon: a token change moves the chevron with it.
function shellChevronPixels(): number {
  const token = tcrnTokens.find((candidate) => candidate.variable === "--tcrn-shell-chevron");
  const pixels = token && /^\d+(?:\.\d+)?px$/.test(token.value) ? Number.parseFloat(token.value) : Number.NaN;
  if (!Number.isFinite(pixels)) throw new Error("ShellPins: --tcrn-shell-chevron is missing from @tcrn/ui-tokens or is not a pixel length.");
  return pixels;
}

const shellChevronSize = shellChevronPixels();

/** Ids of the pinned items the band does not show (the ones after shellPinsMax()), in order. */
export function shellPinsOverflowIds(items: readonly Pick<ShellPinItem, "id">[]): string[] {
  return items.slice(shellPinsMax()).map((item) => item.id);
}

export interface ShellPinsProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** Pinned items in the reader's order. */
  items: readonly ShellPinItem[];
  /** The item of the current page (a link) or of the menu the current page sits in (a button). */
  selectedId?: string | null;
  /** The item whose drop-down is open. */
  openId?: string | null;
  /** Asks to open the drop-down of an item, or to close it (null). */
  onOpenChange?: (openId: string | null) => void;
  /** Id of the drop-down an item opens, for aria-controls; derived from a generated id when omitted. */
  menuIdOf?: (id: string) => string;
  /** Language of the group's name; the page's own when omitted. */
  locale?: TcrnLocale | string;
  /**
   * The shell's name, which tells this group from another shell's on the same page: the group is
   * named "{landmarkLabel} · {pinned items}" in the reader's language (TCRN-DS-SUB-148). An
   * aria-label given outright wins.
   */
  landmarkLabel?: string;
  /**
   * Takes a new order of the items, every id of `items` in it: when a drag in the band ends with
   * the dragged item in a new place, or when Alt+← / Alt+→ moves the focused item one place
   * (TCRN-DS-SUB-149). Without it the items do not move.
   */
  onPinsReorder?: (orderedIds: readonly string[]) => void;
}

/** How far, in CSS pixels, a press travels before it is a drag and no longer a click. */
const shellPinsDragThreshold = 4;

/** The ids with `id` moved to `to` among the others (clamped), or null when that is where it is. */
function shellPinsMoved(ids: readonly string[], id: string, to: number): string[] | null {
  const from = ids.indexOf(id);
  if (from < 0) return null;
  const rest = ids.filter((entry) => entry !== id);
  const at = Math.max(0, Math.min(Math.trunc(to), rest.length));
  return at === from ? null : [...rest.slice(0, at), id, ...rest.slice(at)];
}

/** The band's pinned items, in the order they are rendered. */
function shellPinElements(nav: HTMLElement | null): HTMLElement[] {
  return nav ? Array.from(nav.children).filter((child): child is HTMLElement => child.hasAttribute("data-pin")) : [];
}

function shellPinsRtl(nav: HTMLElement): boolean {
  return nav.ownerDocument.defaultView?.getComputedStyle(nav).direction === "rtl";
}

/** Where a dragged item goes: the number of the other items whose middle the pointer has passed. */
function shellPinsDropIndex(nav: HTMLElement | null, id: string, x: number): number {
  if (!nav) return 0;
  const rtl = shellPinsRtl(nav);
  return shellPinElements(nav)
    .filter((pin) => pin.getAttribute("data-pin") !== id)
    .filter((pin) => {
      const box = pin.getBoundingClientRect();
      const middle = box.left + box.width / 2;
      return rtl ? x < middle : x > middle;
    }).length;
}

interface ShellPinsDrag {
  id: string;
  pointerId: number | undefined;
  startX: number;
  startY: number;
  moved: boolean;
  start: readonly string[];
  order: readonly string[];
}

export function ShellPins({
  items,
  selectedId = null,
  openId = null,
  onOpenChange,
  menuIdOf,
  locale,
  landmarkLabel,
  onPinsReorder,
  className,
  onPointerDown,
  onKeyDown,
  onClickCapture,
  onDragStart,
  ...props
}: ShellPinsProps) {
  const baseId = useId();
  const navRef = useRef<HTMLElement>(null);
  // While a drag is on, the order it has reached and the item it moves.
  const [dragOrder, setDragOrder] = useState<readonly string[] | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragRef = useRef<ShellPinsDrag | null>(null);
  const detachRef = useRef<(() => void) | null>(null);
  const suppressClickRef = useRef(false);
  const focusAfterMoveRef = useRef<string | null>(null);

  // A moved item is rendered in its new place; focus stays on it.
  useEffect(() => {
    const id = focusAfterMoveRef.current;
    if (id === null) return;
    focusAfterMoveRef.current = null;
    const pin = shellPinElements(navRef.current).find((element) => element.getAttribute("data-pin") === id);
    const target = pin?.querySelector<HTMLElement>(".tcrn-shell-pins__item");
    if (target && target.ownerDocument.activeElement !== target) target.focus();
  });
  // A drag still on when the band goes lets go of the document.
  useEffect(() => () => detachRef.current?.(), []);

  if (items.length === 0) return null;
  const max = shellPinsMax();
  const shownIds = items.slice(0, max).map((item) => item.id);
  const overflowIds = items.slice(max).map((item) => item.id);
  const byId = new Map(items.map((item) => [item.id, item] as const));
  const order = dragOrder ?? shownIds;
  const copy = tcrnShellCopyFor(locale);
  const prefix = landmarkLabel?.trim();
  const movable = onPinsReorder !== undefined;

  const pinOf = (target: EventTarget | null): { id: string; nav: HTMLElement } | null => {
    const nav = navRef.current;
    // Read off the node itself, not `instanceof Element`: the band may live in another window's document.
    const closest = (target as Partial<Element> | null)?.closest;
    const pin = typeof closest === "function" ? closest.call(target as Element, "[data-pin]") : null;
    const id = pin?.getAttribute("data-pin");
    return nav && pin && id && pin.parentElement === nav ? { id, nav } : null;
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    onPointerDown?.(event);
    if (!onPinsReorder || event.defaultPrevented || event.button !== 0 || event.isPrimary === false || dragRef.current) return;
    const found = pinOf(event.target);
    if (!found) return;
    const doc = found.nav.ownerDocument;
    const report = onPinsReorder;
    dragRef.current = { id: found.id, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, moved: false, start: order, order };
    const ours = (pointer: PointerEvent) => {
      const drag = dragRef.current;
      return drag !== null && (drag.pointerId === undefined || pointer.pointerId === undefined || pointer.pointerId === drag.pointerId);
    };
    const onMove = (pointer: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || !ours(pointer)) return;
      if (!drag.moved) {
        if (Math.hypot(pointer.clientX - drag.startX, pointer.clientY - drag.startY) < shellPinsDragThreshold) return;
        drag.moved = true;
        setDraggingId(drag.id);
      }
      const next = shellPinsMoved(drag.order, drag.id, shellPinsDropIndex(navRef.current, drag.id, pointer.clientX));
      if (!next) return;
      drag.order = next;
      setDragOrder(next);
    };
    const onEnd = (pointer: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || !ours(pointer)) return;
      detachRef.current?.();
      dragRef.current = null;
      setDraggingId(null);
      setDragOrder(null);
      if (!drag.moved) return;
      if (pointer.type === "pointerup") {
        // The click this release makes is the drag's end, not a press on the item.
        suppressClickRef.current = true;
        doc.defaultView?.setTimeout(() => {
          suppressClickRef.current = false;
        }, 0);
      }
      if (pointer.type !== "pointerup" || drag.order.join("\n") === drag.start.join("\n")) return;
      focusAfterMoveRef.current = drag.id;
      report([...drag.order, ...overflowIds]);
    };
    doc.addEventListener("pointermove", onMove);
    doc.addEventListener("pointerup", onEnd);
    doc.addEventListener("pointercancel", onEnd);
    detachRef.current = () => {
      doc.removeEventListener("pointermove", onMove);
      doc.removeEventListener("pointerup", onEnd);
      doc.removeEventListener("pointercancel", onEnd);
      detachRef.current = null;
    };
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event);
    if (!onPinsReorder || event.defaultPrevented || !event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    const found = pinOf(event.target);
    if (!found) return;
    // Alt+← is also the browser's Back: on a pinned item it only moves the item.
    event.preventDefault();
    const step = (event.key === "ArrowRight") !== shellPinsRtl(found.nav) ? 1 : -1;
    const next = shellPinsMoved(order, found.id, order.indexOf(found.id) + step);
    if (!next) return;
    focusAfterMoveRef.current = found.id;
    onPinsReorder([...next, ...overflowIds]);
  };

  const handleClickCapture = (event: ReactMouseEvent<HTMLElement>) => {
    onClickCapture?.(event);
    if (!suppressClickRef.current) return;
    suppressClickRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  // A link would start the browser's own drag of its address; the band's drag replaces it.
  const handleDragStart = (event: ReactDragEvent<HTMLElement>) => {
    onDragStart?.(event);
    if (movable) event.preventDefault();
  };

  return (
    <nav
      {...props}
      ref={navRef}
      className={cx("tcrn-shell-pins", className)}
      aria-label={props["aria-label"] ?? (prefix ? copy.landmarkOf(prefix, copy.pinnedItems) : copy.pinnedItems)}
      data-pins=""
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      onClickCapture={handleClickCapture}
      onDragStart={handleDragStart}
    >
      {order.map((id) => {
        const item = byId.get(id);
        if (!item) return null;
        const index = shownIds.indexOf(id);
        const selected = item.id === selectedId;
        // Reordering adds no mark of its own: the item takes the pointer's behaviour, the
        // dragged one the grabbing cursor, and the shortcut is said, not drawn.
        const moveProps = movable
          ? { "aria-keyshortcuts": "Alt+ArrowLeft Alt+ArrowRight", "data-pin-movable": "", "data-pin-dragging": item.id === draggingId ? "" : undefined }
          : {};
        const label = (
          <span className="tcrn-shell-pins__label" title={item.label}>
            {item.label}
          </span>
        );
        if (!item.hasMenu) {
          return (
            <span key={item.id} className="tcrn-shell-pins__pin" data-pin={item.id}>
              <a className="tcrn-shell-pins__item" href={item.href} aria-current={selected ? "page" : undefined} {...moveProps}>
                {label}
              </a>
            </span>
          );
        }
        const open = item.id === openId;
        return (
          <span key={item.id} className="tcrn-shell-pins__pin" data-pin={item.id}>
            <button
              type="button"
              className="tcrn-shell-pins__item"
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-controls={menuIdOf ? menuIdOf(item.id) : `${baseId}-menu-${index}`}
              aria-current={selected ? "true" : undefined}
              data-open-pin={open ? "" : undefined}
              {...moveProps}
              onClick={() => onOpenChange?.(open ? null : item.id)}
            >
              {label}
              <Icon name="chevron-down" size={shellChevronSize} className="tcrn-shell-pins__chevron" />
            </button>
          </span>
        );
      })}
    </nav>
  );
}
