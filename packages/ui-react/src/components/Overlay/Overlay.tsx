import type { HTMLAttributes, ReactElement, ReactNode, RefObject } from "react";
import { cloneElement, useEffect, useId, useRef } from "react";
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

export interface TooltipProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children" | "content"> {
  content: string;
  children: ReactElement<Record<string, unknown>>;
  placement?: TooltipPlacement;
}

export function Tooltip({ content, children, placement = "top", className, ...props }: TooltipProps) {
  const tooltipId = useId();
  const childProps = childPropsOf(children);
  const trigger = {
    ...childProps,
    "aria-describedby": mergeIds(childProps["aria-describedby"] as string | undefined, tooltipId)
  };

  return (
    <span
      {...props}
      className={cx("tcrn-tooltip", className)}
      data-tooltip-scope="supplemental"
      data-tooltip-interactive-content="forbidden"
      data-placement={placement}
    >
      {cloneElement(children, trigger)}
      <span id={tooltipId} role="tooltip" className="tcrn-tooltip__content">
        {requiredText(content, "Supplemental information unavailable")}
      </span>
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
        onOpenChange?.(false);
        window.setTimeout(() => triggerRef?.current?.focus(), 0);
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
      tabIndex={-1}
    >
      <Heading id={titleId} level={3}>{title}</Heading>
      {children}
    </section>
  );
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
