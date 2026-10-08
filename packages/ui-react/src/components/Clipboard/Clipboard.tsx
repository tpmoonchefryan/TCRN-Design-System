import type { MouseEvent } from "react";
import { forwardRef, useCallback, useEffect, useId, useRef, useState } from "react";
import type { TcrnLocale } from "@tcrn/ui-copy-state";
import { Button, type ButtonProps } from "../Button/index.js";
import { mergeIds } from "../../utils.js";
import {
  DEFAULT_RESET_DELAY_MS,
  clipboardLabelsFor,
  clipboardWriteText,
  safeCopyActionLabel,
  type ClipboardCopyState
} from "./clipboard-copy.js";

export type { ClipboardCopyState } from "./clipboard-copy.js";

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
  /** Which language the five built-in state labels are said in; defaults to the page's own. */
  locale?: TcrnLocale | string;
  disabledReason?: string;
  resetDelayMs?: number;
  onCopyStateChange?: (state: ClipboardCopyState) => void;
}

export const ClipboardCopyButton = forwardRef<HTMLButtonElement, ClipboardCopyButtonProps>(function ClipboardCopyButton(
  {
    text,
    ariaLabel,
    idleLabel,
    copyingLabel,
    copiedLabel,
    failedLabel,
    unsupportedLabel,
    locale,
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

  const labels = clipboardLabelsFor(locale);
  const accessibleLabel = safeCopyActionLabel(ariaLabel, text, labels.copyValue);
  const isDisabled = Boolean(disabled || disabledReason);
  const liveMessage =
    state === "copying"
      ? copyingLabel ?? labels.copying
      : state === "copied"
        ? copiedLabel ?? labels.copied
        : state === "failed"
          ? failedLabel ?? labels.failed
          : state === "unsupported"
            ? unsupportedLabel ?? labels.unsupported
            : "";
  const visibleLabel = liveMessage || (idleLabel ?? labels.idle);
  const describedBy = mergeIds(props["aria-describedby"], liveRegionId);

  return (
    <Button
      {...props}
      ref={ref}
      type="button"
      aria-busy={state === "copying" ? true : undefined}
      aria-describedby={describedBy}
      aria-label={accessibleLabel}
      className={className}
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
