import type { CSSProperties, FocusEvent as ReactFocusEvent, HTMLAttributes, KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent, ReactElement, ReactNode, RefObject } from "react";
import { createPortal } from "react-dom";
import { cloneElement, useEffect, useId, useRef, useState } from "react";
import { Heading, Text } from "../Typography/index.js";
import { Button } from "../Button/index.js";
import { childPropsOf, cx, mergeIds, requiredText } from "../../utils.js";

export interface DrawerProps {
  title: string;
  open: boolean;
  children: ReactNode;
}

export function DetailDrawer({ title, open, children }: DrawerProps) {
  const titleId = useId();
  return (
    <aside className="tcrn-detail-drawer" aria-hidden={!open} aria-labelledby={titleId} data-modal-scope="structural-drawer" role="complementary" tabIndex={open ? -1 : undefined}>
      <Heading id={titleId} level={3}>{title}</Heading>
      {children}
    </aside>
  );
}

export function ActionDrawer({ title, open, children }: DrawerProps) {
  const titleId = useId();
  return (
    <aside className="tcrn-action-drawer" aria-hidden={!open} aria-labelledby={titleId} data-modal-scope="structural-drawer" role="complementary" tabIndex={open ? -1 : undefined}>
      <Heading id={titleId} level={3}>{title}</Heading>
      {children}
    </aside>
  );
}

export type PopoverPlacement = "bottom-start" | "bottom-end" | "top-start" | "top-end";
export type TooltipPlacement = "top" | "right" | "bottom" | "left";

type FloatingPlacement = PopoverPlacement | TooltipPlacement;

interface FloatingPosition {
  left: number;
  top: number;
  placement: FloatingPlacement;
}

interface FloatingRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

function readCssPixelValue(element: HTMLElement, variable: string, fallback = 0) {
  const value = Number.parseFloat(window.getComputedStyle(element).getPropertyValue(variable));
  return Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), Math.max(minimum, maximum));
}

function floatingRect(element: HTMLElement): FloatingRect {
  const rect = element.getBoundingClientRect();
  return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height };
}

function computeFloatingPosition(anchor: FloatingRect, layer: FloatingRect, requestedPlacement: FloatingPlacement, viewportWidth: number, viewportHeight: number, gap: number): FloatingPosition {
  const layerWidth = Math.max(layer.width, 0);
  const layerHeight = Math.max(layer.height, 0);
  const edge = Math.max(gap, 0);
  const fitsTop = anchor.top - layerHeight - edge >= edge;
  const fitsBottom = anchor.bottom + layerHeight + edge <= viewportHeight - edge;
  const fitsLeft = anchor.left - layerWidth - edge >= edge;
  const fitsRight = anchor.right + layerWidth + edge <= viewportWidth - edge;
  let placement = requestedPlacement;
  const direction = requestedPlacement.split("-")[0];

  if (direction === "top" && !fitsTop && fitsBottom) placement = requestedPlacement.replace(/^top/u, "bottom") as PopoverPlacement;
  if (direction === "bottom" && !fitsBottom && fitsTop) placement = requestedPlacement.replace(/^bottom/u, "top") as PopoverPlacement;
  if (direction === "left" && !fitsLeft && fitsRight) placement = "right";
  if (direction === "right" && !fitsRight && fitsLeft) placement = "left";

  let left = anchor.left;
  let top = anchor.bottom + edge;
  if (placement === "top" || placement === "top-start" || placement === "top-end") {
    top = anchor.top - layerHeight - edge;
  } else if (placement === "bottom" || placement === "bottom-start" || placement === "bottom-end") {
    top = anchor.bottom + edge;
  } else if (placement === "left") {
    left = anchor.left - layerWidth - edge;
    top = anchor.top + ((anchor.height - layerHeight) / 2);
  } else if (placement === "right") {
    left = anchor.right + edge;
    top = anchor.top + ((anchor.height - layerHeight) / 2);
  }

  if (placement === "top-end" || placement === "bottom-end") left = anchor.right - layerWidth;
  if (placement === "top" || placement === "bottom") left = anchor.left + ((anchor.width - layerWidth) / 2);
  if (placement === "top-start" || placement === "bottom-start") left = anchor.left;

  return {
    left: clamp(left, edge, viewportWidth - layerWidth - edge),
    top: clamp(top, edge, viewportHeight - layerHeight - edge),
    placement
  };
}

export type StaticOverlayKind = "tooltip" | "popover";

export interface StaticOverlayBoundaryOptions {
  trigger: HTMLElement;
  layer: HTMLElement;
  kind: StaticOverlayKind;
  placement: FloatingPlacement;
  gap?: number;
}

export interface StaticOverlayBoundaryHandle {
  open(): void;
  close(options?: { restoreFocus?: boolean }): void;
  reposition(): void;
  destroy(): void;
}

/**
 * Adds the same body-boundary behavior to server-emitted HTML without requiring
 * a React tree. The consumer owns the trigger/layer markup and imports this
 * small DOM bridge alongside `tcrnComponentCss`.
 */
export function mountStaticOverlayBoundary({ trigger, layer, kind, placement, gap }: StaticOverlayBoundaryOptions): StaticOverlayBoundaryHandle {
  if (typeof document === "undefined" || typeof window === "undefined" || !(trigger instanceof HTMLElement) || !(layer instanceof HTMLElement)) {
    return { open: () => undefined, close: () => undefined, reposition: () => undefined, destroy: () => undefined };
  }

  const originalParent = layer.parentNode;
  const originalNextSibling = layer.nextSibling;
  const previousStyle = layer.getAttribute("style");
  const previousHidden = layer.hidden;
  const previousBoundary = layer.getAttribute("data-overlay-boundary");
  const previousPositioning = layer.getAttribute("data-overlay-positioning");
  const previousResolvedPlacement = layer.getAttribute("data-overlay-placement-resolved");
  const previousOpen = layer.getAttribute("data-overlay-open");
  const previousTooltipOpen = layer.getAttribute("data-tooltip-open");
  const previousExpanded = trigger.getAttribute("aria-expanded");
  const initialOpen = layer.getAttribute("data-overlay-open") === "true"
    || (layer.getAttribute("data-overlay-open") === null && !layer.hidden);
  const resolvedGap = gap ?? 8;
  let openState = initialOpen;
  let disposed = false;

  const setLayerState = (nextOpen: boolean) => {
    openState = nextOpen;
    layer.hidden = !nextOpen;
    layer.setAttribute("data-overlay-open", nextOpen ? "true" : "false");
    if (kind === "tooltip") layer.setAttribute("data-tooltip-open", nextOpen ? "true" : "false");
    if (kind === "popover") trigger.setAttribute("aria-expanded", nextOpen ? "true" : "false");
  };

  const reposition = () => {
    if (disposed || !openState) return;
    layer.hidden = false;
    layer.style.visibility = "hidden";
    const next = computeFloatingPosition(
      floatingRect(trigger),
      floatingRect(layer),
      placement,
      window.innerWidth,
      window.innerHeight,
      resolvedGap
    );
    layer.style.left = `${next.left}px`;
    layer.style.top = `${next.top}px`;
    layer.setAttribute("data-overlay-placement-resolved", next.placement);
    layer.style.visibility = "visible";
  };

  const open = () => {
    if (disposed) return;
    setLayerState(true);
    reposition();
  };
  const close = ({ restoreFocus = false }: { restoreFocus?: boolean } = {}) => {
    if (disposed) return;
    setLayerState(false);
    layer.style.visibility = "hidden";
    if (restoreFocus) trigger.focus();
  };
  const onFocusIn = () => {
    if (kind === "tooltip") open();
  };
  const onFocusOut = (event: FocusEvent) => {
    const related = event.relatedTarget;
    if (related instanceof Node && (trigger.contains(related) || layer.contains(related))) return;
    if (kind === "tooltip") close();
  };
  const onMouseEnter = () => {
    if (kind === "tooltip") open();
  };
  const onMouseLeave = () => {
    if (kind === "tooltip") close();
  };
  const onClick = () => {
    if (kind === "popover") (openState ? close : open)();
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Escape" || !openState) return;
    event.preventDefault();
    close({ restoreFocus: kind === "popover" });
  };
  const onPointerDown = (event: PointerEvent) => {
    const target = event.target;
    if (kind === "popover" && openState && (!(target instanceof Node) || (!trigger.contains(target) && !layer.contains(target)))) {
      close();
    }
  };

  document.body.append(layer);
  layer.setAttribute("data-overlay-boundary", "document-body");
  layer.setAttribute("data-overlay-positioning", "static-fixed");
  layer.style.position = "fixed";
  trigger.addEventListener("focusin", onFocusIn);
  trigger.addEventListener("focusout", onFocusOut);
  trigger.addEventListener("mouseenter", onMouseEnter);
  trigger.addEventListener("mouseleave", onMouseLeave);
  trigger.addEventListener("click", onClick);
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("resize", reposition);
  window.addEventListener("scroll", reposition, true);
  if (openState) open();
  else close();

  return {
    open,
    close,
    reposition,
    destroy() {
      if (disposed) return;
      disposed = true;
      trigger.removeEventListener("focusin", onFocusIn);
      trigger.removeEventListener("focusout", onFocusOut);
      trigger.removeEventListener("mouseenter", onMouseEnter);
      trigger.removeEventListener("mouseleave", onMouseLeave);
      trigger.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
      if (originalParent) {
        if (originalNextSibling?.parentNode === originalParent) originalParent.insertBefore(layer, originalNextSibling);
        else originalParent.appendChild(layer);
      }
      if (previousStyle === null) layer.removeAttribute("style");
      else layer.setAttribute("style", previousStyle);
      if (previousHidden) layer.hidden = true;
      else layer.removeAttribute("hidden");
      if (previousBoundary === null) layer.removeAttribute("data-overlay-boundary");
      else layer.setAttribute("data-overlay-boundary", previousBoundary);
      if (previousPositioning === null) layer.removeAttribute("data-overlay-positioning");
      else layer.setAttribute("data-overlay-positioning", previousPositioning);
      if (previousResolvedPlacement === null) layer.removeAttribute("data-overlay-placement-resolved");
      else layer.setAttribute("data-overlay-placement-resolved", previousResolvedPlacement);
      if (previousOpen === null) layer.removeAttribute("data-overlay-open");
      else layer.setAttribute("data-overlay-open", previousOpen);
      if (previousTooltipOpen === null) layer.removeAttribute("data-tooltip-open");
      else layer.setAttribute("data-tooltip-open", previousTooltipOpen);
      if (kind === "popover") {
        if (previousExpanded === null) trigger.removeAttribute("aria-expanded");
        else trigger.setAttribute("aria-expanded", previousExpanded);
      }
    }
  };
}

function useFloatingLayer({ enabled, placement, triggerRef, layerRef }: { enabled: boolean; placement: FloatingPlacement; triggerRef?: RefObject<HTMLElement | null>; layerRef: RefObject<HTMLElement | null> }) {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const [position, setPosition] = useState<FloatingPosition | null>(null);

  useEffect(() => {
    if (typeof document !== "undefined") setPortalRoot(document.body);
  }, []);

  const shouldPortal = Boolean(enabled && portalRoot && triggerRef?.current);
  useEffect(() => {
    if (!shouldPortal || !triggerRef?.current || !layerRef.current) {
      setPosition(null);
      return;
    }
    const trigger = triggerRef.current;
    const layer = layerRef.current;
    const update = () => {
      const next = computeFloatingPosition(
        floatingRect(trigger),
        floatingRect(layer),
        placement,
        window.innerWidth,
        window.innerHeight,
        readCssPixelValue(layer, "--tcrn-space-2")
      );
      setPosition(next);
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    observer?.observe(trigger);
    observer?.observe(layer);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
      observer?.disconnect();
    };
  }, [enabled, layerRef, placement, shouldPortal, triggerRef]);

  return { portalRoot, position, shouldPortal };
}

export interface TooltipProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children" | "content"> {
  content: string;
  children: ReactElement<Record<string, unknown>>;
  placement?: TooltipPlacement;
}

export function Tooltip({ content, children, placement = "top", className, ...props }: TooltipProps) {
  const tooltipId = useId();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLSpanElement>(null);
  const [revealed, setRevealed] = useState(false);
  const floating = useFloatingLayer({ enabled: true, placement, triggerRef, layerRef: contentRef });
  const childProps = childPropsOf(children);
  const trigger = {
    ...childProps,
    "aria-describedby": mergeIds(childProps["aria-describedby"] as string | undefined, tooltipId)
  };
  const onFocus = (event: ReactFocusEvent<HTMLSpanElement>) => {
    props.onFocus?.(event);
    setRevealed(true);
  };
  const onBlur = (event: ReactFocusEvent<HTMLSpanElement>) => {
    props.onBlur?.(event);
    setRevealed(false);
  };
  const onMouseEnter = (event: ReactMouseEvent<HTMLSpanElement>) => {
    props.onMouseEnter?.(event);
    setRevealed(true);
  };
  const onMouseLeave = (event: ReactMouseEvent<HTMLSpanElement>) => {
    props.onMouseLeave?.(event);
    setRevealed(false);
  };
  const onKeyDown = (event: ReactKeyboardEvent<HTMLSpanElement>) => {
    props.onKeyDown?.(event);
    if (event.defaultPrevented || event.key !== "Escape") return;
    event.preventDefault();
    setRevealed(false);
  };
  const contentStyle: CSSProperties | undefined = floating.shouldPortal ? {
    position: "fixed",
    left: `${floating.position?.left ?? 0}px`,
    top: `${floating.position?.top ?? 0}px`,
    visibility: floating.position ? "visible" : "hidden",
    transform: "none"
  } : undefined;
  const tooltipContent = (
    <span
      ref={contentRef}
      id={tooltipId}
      role="tooltip"
      className="tcrn-tooltip__content"
      data-tooltip-portal={floating.shouldPortal ? "true" : undefined}
      data-tooltip-open={revealed ? "true" : undefined}
      data-tooltip-placement={floating.position?.placement ?? placement}
      style={contentStyle}
    >
      {requiredText(content, "Supplemental information unavailable")}
    </span>
  );

  return (
    <span
      ref={triggerRef}
      {...props}
      onFocus={onFocus}
      onBlur={onBlur}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onKeyDown={onKeyDown}
      className={cx("tcrn-tooltip", className)}
      data-tooltip-scope="supplemental"
      data-tooltip-interactive-content="forbidden"
      data-placement={placement}
      data-tooltip-open={revealed ? "true" : undefined}
      data-overlay-boundary={floating.shouldPortal ? "document-body" : "inline-static"}
    >
      {cloneElement(children, trigger)}
      {floating.shouldPortal && floating.portalRoot ? createPortal(tooltipContent, floating.portalRoot) : tooltipContent}
    </span>
  );
}

export interface PopoverProps {
  title: string;
  open: boolean;
  children: ReactNode;
  className?: string;
  placement?: PopoverPlacement;
  triggerRef?: RefObject<HTMLElement | null>;
  initialFocusRef?: RefObject<HTMLElement | null>;
  onOpenChange?: (open: boolean) => void;
}

export function Popover({ title, open, children, className, placement = "bottom-start", triggerRef, initialFocusRef, onOpenChange }: PopoverProps) {
  const titleId = useId();
  const popoverRef = useRef<HTMLElement>(null);
  const wasOpenRef = useRef(false);
  const floating = useFloatingLayer({ enabled: open, placement, triggerRef, layerRef: popoverRef });
  const supportsEscapeClose = Boolean(onOpenChange);
  const supportsFocusReturn = Boolean(triggerRef);

  useEffect(() => {
    if (!open) {
      return;
    }
    wasOpenRef.current = true;
    const focusTarget = initialFocusRef?.current ?? popoverRef.current;
    focusTarget?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onOpenChange?.(false);
        window.setTimeout(() => triggerRef?.current?.focus(), 0);
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node) || popoverRef.current?.contains(target) || triggerRef?.current?.contains(target)) return;
      onOpenChange?.(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [initialFocusRef, onOpenChange, open, triggerRef]);

  useEffect(() => {
    if (open || !wasOpenRef.current) {
      return;
    }
    wasOpenRef.current = false;
    window.setTimeout(() => triggerRef?.current?.focus(), 0);
  }, [open, triggerRef]);

  if (!open) {
    return null;
  }

  const popoverContent = (
    <section
      ref={popoverRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      className={cx("tcrn-popover", className)}
      data-overlay-scope="popover"
      data-placement={placement}
      data-focus-entry="implemented"
      data-tab-containment="not-implemented"
      data-escape-close={supportsEscapeClose ? "implemented" : "requires-on-open-change"}
      data-focus-return={supportsFocusReturn ? "implemented" : "requires-trigger-ref"}
      data-overlay-boundary={floating.shouldPortal ? "document-body" : "inline-static"}
      data-overlay-positioning={floating.shouldPortal ? "portal-fixed" : "inline-static"}
      data-overlay-placement-resolved={floating.position?.placement ?? placement}
      style={floating.shouldPortal ? {
        position: "fixed",
        left: `${floating.position?.left ?? 0}px`,
        top: `${floating.position?.top ?? 0}px`,
        visibility: floating.position ? "visible" : "hidden"
      } : undefined}
      tabIndex={-1}
    >
      <Heading id={titleId} level={3}>{title}</Heading>
      {children}
    </section>
  );
  return floating.shouldPortal && floating.portalRoot ? createPortal(popoverContent, floating.portalRoot) : popoverContent;
}

/**
 * What the browser will move focus to. One list so the trap and any future
 * focus-entry logic cannot disagree about what counts as focusable.
 */
const FOCUSABLE_SELECTOR =
  'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

export interface DialogProps {
  title: string;
  open: boolean;
  children: ReactNode;
  className?: string;
  triggerRef?: RefObject<HTMLElement | null>;
  initialFocusRef?: RefObject<HTMLElement | null>;
  onOpenChange?: (open: boolean) => void;
}

export function Dialog({ title, open, children, className, triggerRef, initialFocusRef, onOpenChange }: DialogProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const wasOpenRef = useRef(false);
  const supportsEscapeClose = Boolean(onOpenChange);
  const supportsFocusReturn = Boolean(triggerRef);

  useEffect(() => {
    if (!open) {
      return;
    }
    wasOpenRef.current = true;
    const focusTarget = initialFocusRef?.current ?? dialogRef.current;
    focusTarget?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange?.(false);
        window.setTimeout(() => triggerRef?.current?.focus(), 0);
        return;
      }
      // Tab containment. `aria-modal` tells assistive technology the rest of the page
      // is inert; it does not stop the browser moving focus there. Without this a
      // keyboard user tabs out of the dialog into a page the screen reader has already
      // been told to ignore, and has no way to know where they went. This component
      // declared the gap honestly as `not-implemented` rather than pretend it away.
      if (event.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;
      const focusable = [...root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)]
        .filter((node) => !node.hasAttribute("disabled") && node.getAttribute("aria-hidden") !== "true");
      if (focusable.length === 0) {
        event.preventDefault();
        root.focus();
        return;
      }
      const first = focusable[0] as HTMLElement;
      const last = focusable[focusable.length - 1] as HTMLElement;
      const active = document.activeElement;
      // Focus on the dialog itself counts as before the first element, so the very
      // first Tab lands inside rather than outside.
      if (event.shiftKey && (active === first || active === root)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      } else if (!root.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [initialFocusRef, onOpenChange, open, triggerRef]);

  useEffect(() => {
    if (open || !wasOpenRef.current) {
      return;
    }
    wasOpenRef.current = false;
    window.setTimeout(() => triggerRef?.current?.focus(), 0);
  }, [open, triggerRef]);

  if (!open) {
    return null;
  }

  return (
    <section
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className={cx("tcrn-dialog", className)}
      data-focus-entry="implemented"
      data-tab-containment="implemented"
      data-escape-close={supportsEscapeClose ? "implemented" : "requires-on-open-change"}
      data-focus-return={supportsFocusReturn ? "implemented" : "requires-trigger-ref"}
      tabIndex={-1}
    >
      <Heading id={titleId} level={3}>{title}</Heading>
      {children}
    </section>
  );
}

/**
 * A list of commands, opened from a trigger.
 *
 * A menu is not a listbox and not a set of tabs: its items DO something rather
 * than select something, which is why the roles are `menu` and `menuitem` and why
 * activating one closes the menu. Products that render a popover full of buttons
 * get the visuals and lose the announcement — a screen reader says "button" N
 * times with no notion of the group or of how many.
 *
 * Focus roves with the arrow keys and only one item is ever in the tab order, so
 * Tab leaves the menu rather than walking through it. Escape closes and returns
 * focus to the trigger, because a menu that closes and drops focus to the body
 * leaves a keyboard user at the top of the page.
 */
export interface MenuItemDescriptor {
  id: string;
  label: ReactNode;
  disabled?: boolean;
  onSelect?: () => void;
}

export interface MenuProps {
  items: MenuItemDescriptor[];
  open: boolean;
  /** Accessible name for the command list. */
  label: string;
  onOpenChange?: (open: boolean) => void;
  triggerRef?: RefObject<HTMLElement | null>;
}

export function Menu({ items, open, label, onOpenChange, triggerRef }: MenuProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const enabled = items.filter((item) => !item.disabled);
  const [activeId, setActiveId] = useState<string | null>(null);
  const current = activeId ?? enabled[0]?.id ?? null;

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onOpenChange?.(false);
        window.setTimeout(() => triggerRef?.current?.focus(), 0);
        return;
      }
      if (enabled.length === 0) return;
      const at = enabled.findIndex((item) => item.id === current);
      const step = (delta: number) => {
        event.preventDefault();
        const next = enabled[(((at < 0 ? 0 : at) + delta) % enabled.length + enabled.length) % enabled.length];
        if (next) setActiveId(next.id);
      };
      if (event.key === "ArrowDown") step(1);
      else if (event.key === "ArrowUp") step(-1);
      else if (event.key === "Home") { event.preventDefault(); setActiveId(enabled[0]?.id ?? null); }
      else if (event.key === "End") { event.preventDefault(); setActiveId(enabled[enabled.length - 1]?.id ?? null); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [current, enabled, onOpenChange, open, triggerRef]);

  if (!open) return null;

  return (
    <div ref={listRef} role="menu" aria-label={label} className="tcrn-menu" data-menu="true">
      {items.map((item) => (
        <button key={item.id} type="button"
          role="menuitem"
          className={cx("tcrn-menu__item", item.id === current && "tcrn-menu__item--active")}
          disabled={item.disabled}
          tabIndex={item.id === current ? 0 : -1}
          data-menu-item-active={item.id === current ? "true" : undefined}
          onClick={() => {
            item.onSelect?.();
            // A command menu closes on activation: leaving it open after the command
            // ran is what makes readers press the same item twice.
            onOpenChange?.(false);
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export interface ConfirmActionDialogProps {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  disabled?: boolean;
}

export function ConfirmActionDialog({ title, message, confirmLabel, cancelLabel, disabled }: ConfirmActionDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  return (
    <Dialog title={title} open className="tcrn-confirm-dialog" initialFocusRef={cancelRef}>
      <Text>{message}</Text>
      <Button disabled={disabled} disabledReason={disabled ? "Action is blocked until an authorized route clears it" : undefined} variant="danger">
        {confirmLabel}
      </Button>
      <Button ref={cancelRef} variant="secondary">{cancelLabel}</Button>
    </Dialog>
  );
}
