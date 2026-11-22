import type { CSSProperties, FocusEvent as ReactFocusEvent, HTMLAttributes, KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent, ReactElement, ReactNode, RefObject } from "react";
import { createPortal } from "react-dom";
import { cloneElement, useCallback, useEffect, useId, useRef, useState } from "react";
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

export interface FloatingPosition {
  left: number;
  top: number;
  placement: FloatingPlacement;
}

export interface FloatingRect {
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

export function computeFloatingPosition(anchor: FloatingRect, layer: FloatingRect, requestedPlacement: FloatingPlacement, viewportWidth: number, viewportHeight: number, gap: number): FloatingPosition {
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

  const isEndAligned = placement === "top-end" || placement === "bottom-end";
  if (isEndAligned) left = anchor.right - layerWidth;
  if (placement === "top" || placement === "bottom") left = anchor.left + ((anchor.width - layerWidth) / 2);
  if (placement === "top-start" || placement === "bottom-start") left = anchor.left;

  const maxLeft = isEndAligned && anchor.right <= viewportWidth
    ? Math.max(viewportWidth - layerWidth - edge, anchor.right - layerWidth)
    : viewportWidth - layerWidth - edge;

  return {
    left: clamp(left, edge, maxLeft),
    top: clamp(top, edge, viewportHeight - layerHeight - edge),
    placement
  };
}

export type StaticOverlayKind = "tooltip" | "popover" | "menu";

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
 * small DOM bridge alongside tcrnComponentCss.
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
  const interactivePopup = kind === "popover" || kind === "menu";
  let openState = initialOpen;
  let disposed = false;

  const enabledMenuItems = () =>
    [...layer.querySelectorAll<HTMLElement>('[role="menuitem"]')].filter(
      (item) => !item.matches(":disabled, [aria-disabled='true']")
    );

  const focusActiveMenuItem = (targetItem?: HTMLElement) => {
    if (kind !== "menu") return;
    const allItems = [...layer.querySelectorAll<HTMLElement>('[role="menuitem"]')];
    const enabled = enabledMenuItems();
    const active = targetItem ?? enabled.find((item) => item.tabIndex === 0) ?? enabled[0];
    for (const item of allItems) {
      const isCurrent = item === active;
      item.tabIndex = isCurrent ? 0 : -1;
      if (isCurrent) item.setAttribute("data-menu-item-active", "true");
      else item.removeAttribute("data-menu-item-active");
    }
    (active ?? layer).focus();
  };

  const setLayerState = (nextOpen: boolean) => {
    openState = nextOpen;
    layer.hidden = !nextOpen;
    layer.setAttribute("data-overlay-open", nextOpen ? "true" : "false");
    if (kind === "tooltip") layer.setAttribute("data-tooltip-open", nextOpen ? "true" : "false");
    if (interactivePopup) trigger.setAttribute("aria-expanded", nextOpen ? "true" : "false");
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
    if (kind === "menu") focusActiveMenuItem();
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
    if (interactivePopup) (openState ? close : open)();
  };
  const onLayerClick = (event: MouseEvent) => {
    if (kind !== "menu" || !openState) return;
    const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[role="menuitem"]') : null;
    if (!target || target.matches(":disabled, [aria-disabled='true']")) return;
    close({ restoreFocus: true });
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (!openState || event.defaultPrevented) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close({ restoreFocus: interactivePopup });
      return;
    }
    if (kind !== "menu" || !(event.target instanceof Node) || !layer.contains(event.target)) return;
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const enabled = enabledMenuItems();
    if (enabled.length === 0) return;
    event.preventDefault();
    const currentIndex = Math.max(enabled.indexOf(document.activeElement as HTMLElement), 0);
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? enabled.length - 1
        : (currentIndex + (event.key === "ArrowDown" ? 1 : -1) + enabled.length) % enabled.length;
    focusActiveMenuItem(enabled[nextIndex]);
  };
  const onPointerDown = (event: PointerEvent) => {
    const target = event.target;
    if (interactivePopup && openState && (!(target instanceof Node) || (!trigger.contains(target) && !layer.contains(target)))) {
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
  layer.addEventListener("click", onLayerClick);
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
      layer.removeEventListener("click", onLayerClick);
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
      if (interactivePopup) {
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
  /** Forces a visible documentation specimen, including inline SSR. This is not
   * an interactive controlled-open mode and is not dismissed by Escape. */
  staticPreview?: boolean;
}

export function Tooltip({ content, children, placement = "top", staticPreview = false, className, ...props }: TooltipProps) {
  const tooltipId = useId();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLSpanElement>(null);
  const [revealed, setRevealed] = useState(false);
  const open = staticPreview || revealed;
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
    if (staticPreview || event.defaultPrevented || event.key !== "Escape") return;
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
      data-tooltip-open={open ? "true" : undefined}
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
      data-tooltip-open={open ? "true" : undefined}
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
  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;

  useEffect(() => {
    if (!open) {
      return;
    }
    wasOpenRef.current = true;
    const focusTarget = initialFocusRef?.current ?? popoverRef.current;
    focusTarget?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !event.defaultPrevented && onOpenChangeRef.current) {
        event.preventDefault();
        onOpenChangeRef.current(false);
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node) || popoverRef.current?.contains(target) || triggerRef?.current?.contains(target)) return;
      onOpenChangeRef.current?.(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [initialFocusRef, open, triggerRef, floating.shouldPortal]);

  useEffect(() => {
    if (open || !wasOpenRef.current) {
      return;
    }
    wasOpenRef.current = false;
    triggerRef?.current?.focus();
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
  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;

  useEffect(() => {
    if (!open) {
      return;
    }
    wasOpenRef.current = true;
    const focusTarget = initialFocusRef?.current ?? dialogRef.current;
    focusTarget?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      const target = event.target as Element | null;
      const owner = typeof target?.closest === "function" ? target.closest('[role="dialog"]') : null;
      if (owner && owner !== dialogRef.current) return;
      if (event.key === "Escape") {
        if (onOpenChangeRef.current) {
          event.preventDefault();
          onOpenChangeRef.current(false);
        }
        return;
      }
      // Tab containment. aria-modal tells assistive technology the rest of the page
      // is inert; it does not stop the browser moving focus there. Without this a
      // keyboard user tabs out of the dialog into a page the screen reader has already
      // been told to ignore, and has no way to know where they went.
      if (event.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;
      const focusable = [...root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)]
        .filter((node) => node.tabIndex >= 0 && !node.matches(":disabled, input[type=hidden]") && !node.closest('[hidden], [inert], [aria-hidden="true"]'));
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
  }, [initialFocusRef, open, triggerRef]);

  useEffect(() => {
    if (open || !wasOpenRef.current) {
      return;
    }
    wasOpenRef.current = false;
    triggerRef?.current?.focus();
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
      <Heading id={titleId} level={3} className="tcrn-dialog__title">{title}</Heading>
      {children}
    </section>
  );
}

export type MenuItemTone = "neutral" | "danger";

/**
 * A list of commands, opened from a trigger.
 *
 * A menu is not a listbox and not a set of tabs: its items DO something rather
 * than select something, which is why the roles are menu and menuitem and why
 * activating one closes the menu. Focus roves with the arrow keys and only one
 * item is ever in the tab order, so Tab leaves the menu rather than walking
 * through it. Escape closes and returns focus to the trigger.
 */
export interface MenuItemDescriptor {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  tone?: MenuItemTone;
  danger?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
}

export interface MenuProps {
  items: MenuItemDescriptor[];
  open: boolean;
  /** Accessible name for the command list. */
  label: string;
  className?: string;
  placement?: PopoverPlacement;
  onOpenChange?: (open: boolean) => void;
  triggerRef?: RefObject<HTMLElement | null>;
}

export function Menu({ items, open, label, className, placement = "bottom-start", onOpenChange, triggerRef }: MenuProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);
  const restoreTriggerFocusRef = useRef(true);
  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;
  const floating = useFloatingLayer({ enabled: open, placement, triggerRef, layerRef: listRef });
  const supportsEscapeClose = Boolean(onOpenChange);
  const supportsFocusReturn = Boolean(triggerRef);
  const enabled = items.filter((item) => !item.disabled);
  const [activeId, setActiveId] = useState<string | null>(null);
  const current = enabled.some((item) => item.id === activeId) ? activeId : enabled[0]?.id ?? null;

  useEffect(() => {
    if (!open) return;
    wasOpenRef.current = true;
    restoreTriggerFocusRef.current = true;
    const root = listRef.current;
    if (root && typeof document !== "undefined" && !root.contains(document.activeElement)) {
      (root.querySelector<HTMLElement>('[role="menuitem"][tabindex="0"]') ?? root)?.focus();
    }
    const onDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented || !onOpenChangeRef.current) return;
      if (listRef.current?.contains(event.target as Node)) return;
      event.preventDefault();
      restoreTriggerFocusRef.current = true;
      onOpenChangeRef.current(false);
      triggerRef?.current?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node) || listRef.current?.contains(target) || triggerRef?.current?.contains(target)) return;
      restoreTriggerFocusRef.current = false;
      onOpenChangeRef.current?.(false);
    };
    document.addEventListener("keydown", onDocumentKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onDocumentKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, triggerRef, floating.shouldPortal]);

  useEffect(() => {
    if (open || !wasOpenRef.current) {
      return;
    }
    wasOpenRef.current = false;
    if (restoreTriggerFocusRef.current) {
      triggerRef?.current?.focus();
    }
  }, [open, triggerRef]);

  if (!open) return null;

  const menuContent = (
    <div
      ref={listRef}
      role="menu"
      aria-label={label}
      className={cx("tcrn-menu", className)}
      data-menu="true"
      data-overlay-scope="menu"
      data-placement={placement}
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
      tabIndex={enabled.length === 0 ? -1 : undefined}
      onKeyDown={(event) => {
        if (event.defaultPrevented) return;
        if (event.key === "Escape") {
          if (!onOpenChange) return;
          event.preventDefault();
          restoreTriggerFocusRef.current = true;
          onOpenChange(false);
          triggerRef?.current?.focus();
          return;
        }
        if (enabled.length === 0 || !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const at = enabled.findIndex((item) => item.id === current);
        const index = event.key === "Home" ? 0 : event.key === "End" ? enabled.length - 1
          : (at + (event.key === "ArrowDown" ? 1 : -1) + enabled.length) % enabled.length;
        const next = enabled[index];
        if (!next) return;
        setActiveId(next.id);
        listRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')[items.indexOf(next)]?.focus();
      }}
    >
      {items.map((item) => {
        const resolvedTone: MenuItemTone = item.tone ?? (item.danger ? "danger" : "neutral");
        const hasDescription = item.description !== undefined && item.description !== null;
        return (
          <button
            key={item.id}
            type="button"
            role="menuitem"
            className={cx(
              "tcrn-menu__item",
              item.id === current && "tcrn-menu__item--active",
              resolvedTone === "danger" && "tcrn-menu__item--danger",
              hasDescription && "tcrn-menu__item--described"
            )}
            disabled={item.disabled}
            tabIndex={item.id === current ? 0 : -1}
            data-menu-item-active={item.id === current ? "true" : undefined}
            data-menu-item-tone={resolvedTone === "danger" ? "danger" : undefined}
            onFocus={() => setActiveId(item.id)}
            onClick={() => {
              item.onSelect?.();
              restoreTriggerFocusRef.current = true;
              onOpenChange?.(false);
              triggerRef?.current?.focus();
            }}
          >
            {hasDescription ? (
              <>
                <span className="tcrn-menu__item-label">{item.label}</span>
                <span className="tcrn-menu__item-description">{item.description}</span>
              </>
            ) : (
              item.label
            )}
          </button>
        );
      })}
    </div>
  );

  return floating.shouldPortal && floating.portalRoot ? createPortal(menuContent, floating.portalRoot) : menuContent;
}

export type ConfirmTone = "warning" | "danger";

export interface ConfirmActionDialogProps {
  title: string;
  message: ReactNode;
  confirmLabel: string;
  cancelLabel: string;
  open?: boolean;
  tone?: ConfirmTone;
  disabled?: boolean;
  disabledReason?: string;
  className?: string;
  triggerRef?: RefObject<HTMLElement | null>;
  onOpenChange?: (open: boolean) => void;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function ConfirmActionDialog({
  title,
  message,
  confirmLabel,
  cancelLabel,
  open = true,
  tone = "danger",
  disabled,
  disabledReason,
  className,
  triggerRef,
  onOpenChange,
  onConfirm,
  onCancel
}: ConfirmActionDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;
  const onCancelRef = useRef(onCancel);
  onCancelRef.current = onCancel;
  const canClose = Boolean(onOpenChange || onCancel);

  const handleDialogOpenChange = useCallback((nextOpen: boolean) => {
    if (!nextOpen) {
      onCancelRef.current?.();
    }
    onOpenChangeRef.current?.(nextOpen);
  }, []);

  const handleCancelClick = () => {
    onCancel?.();
    onOpenChange?.(false);
    triggerRef?.current?.focus();
  };

  const handleConfirmClick = () => {
    if (disabled) return;
    onConfirm?.();
  };

  return (
    <Dialog
      title={title}
      open={open}
      className={cx("tcrn-confirm-dialog", className)}
      initialFocusRef={cancelRef}
      triggerRef={triggerRef}
      onOpenChange={canClose ? handleDialogOpenChange : undefined}
    >
      <div className="tcrn-dialog__body">
        <Text>{message}</Text>
      </div>
      <div className="tcrn-dialog__actions">
        <Button
          ref={cancelRef}
          type="button"
          variant="secondary"
          onClick={handleCancelClick}
        >
          {cancelLabel}
        </Button>
        <Button
          type="button"
          disabled={disabled}
          disabledReason={disabled ? (disabledReason ?? "Action is blocked until an authorized route clears it") : undefined}
          variant={tone === "warning" ? "primary" : "danger"}
          onClick={handleConfirmClick}
        >
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}

export interface InlineConfirmBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: string;
  message: ReactNode;
  confirmLabel: string;
  cancelLabel: string;
  tone?: ConfirmTone;
  open?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onOpenChange?: (open: boolean) => void;
  triggerRef?: RefObject<HTMLElement | null>;
}

export function InlineConfirmBar({
  title,
  message,
  confirmLabel,
  cancelLabel,
  tone = "danger",
  open = true,
  disabled,
  disabledReason,
  onConfirm,
  onCancel,
  onOpenChange,
  triggerRef,
  className,
  onKeyDown,
  ...props
}: InlineConfirmBarProps) {
  const titleId = useId();
  const messageId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (!open) {
      if (wasOpenRef.current) {
        wasOpenRef.current = false;
        triggerRef?.current?.focus();
      }
      return;
    }
    wasOpenRef.current = true;
    cancelRef.current?.focus();
  }, [open, triggerRef]);

  if (!open) {
    return null;
  }

  const handleCancel = () => {
    onCancel?.();
    onOpenChange?.(false);
    triggerRef?.current?.focus();
  };

  const handleConfirm = () => {
    if (disabled) return;
    onConfirm?.();
  };

  return (
    <div
      {...props}
      role={props.role ?? "region"}
      aria-labelledby={props["aria-labelledby"] ?? (title ? titleId : undefined)}
      aria-label={props["aria-label"] ?? (!title && !props["aria-labelledby"] ? confirmLabel : undefined)}
      aria-describedby={props["aria-describedby"] ?? messageId}
      className={cx("tcrn-inline-confirm-bar", `tcrn-inline-confirm-bar--${tone}`, className)}
      data-inline-confirm-bar="true"
      data-tone={tone}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || event.key !== "Escape") return;
        if (!onCancel && !onOpenChange) return;
        event.preventDefault();
        handleCancel();
      }}
    >
      <div className="tcrn-inline-confirm-bar__content">
        {title ? <p id={titleId} className="tcrn-inline-confirm-bar__title">{title}</p> : null}
        <div id={messageId} className="tcrn-inline-confirm-bar__message">{message}</div>
      </div>
      <div className="tcrn-inline-confirm-bar__actions">
        <Button
          ref={cancelRef}
          type="button"
          size="sm"
          variant="secondary"
          onClick={handleCancel}
        >
          {cancelLabel}
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={disabled}
          disabledReason={disabled ? (disabledReason ?? "Action is blocked until an authorized route clears it") : undefined}
          variant={tone === "warning" ? "primary" : "danger"}
          onClick={handleConfirm}
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  );
}
