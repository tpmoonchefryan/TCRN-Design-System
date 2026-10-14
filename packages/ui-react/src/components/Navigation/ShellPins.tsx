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
// 6% ink wash and weight 600, never a side bar; hover takes the 3.5% wash.
//
// Ordering and preferences (dragging, storing) belong to the ProductShell preferences; this part
// takes an ordered list and reports which drop-down to open.
import { useId, type HTMLAttributes } from "react";
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
}

export function ShellPins({ items, selectedId = null, openId = null, onOpenChange, menuIdOf, locale, landmarkLabel, className, ...props }: ShellPinsProps) {
  const baseId = useId();
  if (items.length === 0) return null;
  const shown = items.slice(0, shellPinsMax());
  const copy = tcrnShellCopyFor(locale);
  const prefix = landmarkLabel?.trim();
  return (
    <nav {...props} className={cx("tcrn-shell-pins", className)} aria-label={props["aria-label"] ?? (prefix ? copy.landmarkOf(prefix, copy.pinnedItems) : copy.pinnedItems)} data-pins="">
      {shown.map((item, index) => {
        const selected = item.id === selectedId;
        const label = (
          <span className="tcrn-shell-pins__label" title={item.label}>
            {item.label}
          </span>
        );
        if (!item.hasMenu) {
          return (
            <span key={item.id} className="tcrn-shell-pins__pin" data-pin={item.id}>
              <a className="tcrn-shell-pins__item" href={item.href} aria-current={selected ? "page" : undefined}>
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
              onClick={() => onOpenChange?.(open ? null : item.id)}
            >
              {label}
              <Icon name="chevron-down" size={12} className="tcrn-shell-pins__chevron" />
            </button>
          </span>
        );
      })}
    </nav>
  );
}
