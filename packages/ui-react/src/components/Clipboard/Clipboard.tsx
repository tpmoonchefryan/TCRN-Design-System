import type { MouseEvent } from "react";
import { forwardRef, useCallback, useEffect, useId, useRef, useState } from "react";
import { Button, type ButtonProps } from "../Button/index.js";
import { cx, mergeIds, requiredText } from "../../utils.js";

export type ClipboardCopyState = "idle" | "copying" | "copied" | "failed" | "unsupported";

export interface ClipboardCopyButtonProps
  extends Omit<ButtonProps, "aria-label" | "children" | "disabledReason" | "onClick" | "type" | "value"> {
  text: string;
  ariaLabel: string;
  children?: never;
  onClick?: never;
  type?: never;
  value?: never;
  idleLabel?: string;
  copyingLabel?: string;
  copiedLabel?: string;
  failedLabel?: string;
  unsupportedLabel?: string;
  disabledReason?: string;
  resetDelayMs?: number;
  onCopyStateChange?: (state: ClipboardCopyState) => void;
}

const DEFAULT_RESET_DELAY_MS = 2000;

function clipboardWriteText(): ((value: string) => Promise<void>) | null {
  if (typeof navigator === "undefined") {
    return null;
  }

  const writeText = navigator.clipboard?.writeText;
  return typeof writeText === "function" ? writeText.bind(navigator.clipboard) : null;
}

function safeCopyActionLabel(ariaLabel: string, text: string): string {
  const label = requiredText(ariaLabel, "Copy value");
  const copiedValue = text.trim();
  return copiedValue && label.includes(copiedValue) ? "Copy value" : label;
}

export const ClipboardCopyButton = forwardRef<HTMLButtonElement, ClipboardCopyButtonProps>(function ClipboardCopyButton(
  {
    text,
    ariaLabel,
    idleLabel = "Copy",
    copyingLabel = "Copying",
    copiedLabel = "Copied",
    failedLabel = "Copy failed",
    unsupportedLabel = "Copy unavailable",
    disabled,
    disabledReason,
    children: _children,
    onClick: _onClick,
    resetDelayMs = DEFAULT_RESET_DELAY_MS,
    type: _type,
    value: _value,
    onCopyStateChange,
    className,
    ...props
  },
  ref
) {
  const [state, setState] = useState<ClipboardCopyState>("idle");
  const liveRegionId = useId();
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const emitState = useCallback(
    (nextState: ClipboardCopyState) => {
      setState(nextState);
      onCopyStateChange?.(nextState);
    },
    [onCopyStateChange]
  );

  const scheduleReset = useCallback(() => {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }

    resetTimerRef.current = setTimeout(() => {
      emitState("idle");
    }, resetDelayMs);
  }, [emitState, resetDelayMs]);

  const handleCopy = useCallback(
    async (event: MouseEvent<HTMLButtonElement>) => {
      const button = event.currentTarget;
      if (disabled || disabledReason || state === "copying") {
        return;
      }

      const writeText = clipboardWriteText();
      if (!writeText) {
        emitState("unsupported");
        scheduleReset();
        return;
      }

      try {
        emitState("copying");
        await writeText(text);
        emitState("copied");
      } catch {
        emitState("failed");
      } finally {
        scheduleReset();
      }

      button.focus({ preventScroll: true });
    },
    [disabled, disabledReason, emitState, scheduleReset, state, text]
  );

  const accessibleLabel = safeCopyActionLabel(ariaLabel, text);
  const isDisabled = Boolean(disabled || disabledReason);
  const liveMessage =
    state === "copying"
      ? copyingLabel
      : state === "copied"
        ? copiedLabel
        : state === "failed"
          ? failedLabel
          : state === "unsupported"
            ? unsupportedLabel
            : "";
  const visibleLabel = liveMessage || idleLabel;
  const describedBy = mergeIds(props["aria-describedby"], liveRegionId);

  return (
    <Button
      {...props}
      ref={ref}
      type="button"
      aria-busy={state === "copying" ? true : undefined}
      aria-describedby={describedBy}
      aria-label={accessibleLabel}
      className={cx("tcrn-clipboard-copy-button", className)}
      data-clipboard-copy-state={state}
      disabled={isDisabled}
      disabledReason={disabledReason}
      onClick={handleCopy}
    >
      {visibleLabel}
      <span id={liveRegionId} aria-live="polite" role="status" className="tcrn-sr-only">
        {disabledReason || liveMessage}
      </span>
    </Button>
  );
});
