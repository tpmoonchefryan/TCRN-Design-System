import type { MouseEvent } from "react";
import { forwardRef, useCallback, useEffect, useId, useRef, useState } from "react";
import type { TcrnLocale } from "@tcrn/ui-copy-state";
import { Button, type ButtonProps } from "../Button/index.js";
import { Icon, type IconName } from "../Icon/index.js";
import { mergeIds } from "../../utils.js";
import {
  DEFAULT_RESET_DELAY_MS,
  clipboardLabelsFor,
  clipboardWriteText,
  safeCopyActionLabel,
  type ClipboardCopyState
} from "./clipboard-copy.js";

export type { ClipboardCopyState } from "./clipboard-copy.js";

// One icon for each settled state (Actions board): copy while idle, check once the value is
// copied, alert-triangle when the copy failed and info where the browser cannot copy at all.
// Copying has none of its own; the loader stands in that place while the button is busy.
const clipboardStateIcons = [
  ["idle", "copy"],
  ["copied", "check"],
  ["failed", "alert-triangle"],
  ["unsupported", "info"]
] as const satisfies ReadonlyArray<readonly [Exclude<ClipboardCopyState, "copying">, IconName]>;

export interface ClipboardCopyButtonProps
  extends Omit<ButtonProps, "aria-label" | "children" | "disabledReason" | "loading" | "onClick" | "type" | "value"> {
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
  const mountedRef = useRef(true);
  const copyingRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (resetTimerRef.current !== null) {
        clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
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
    if (resetTimerRef.current !== null) {
      clearTimeout(resetTimerRef.current);
    }

    resetTimerRef.current = setTimeout(() => {
      resetTimerRef.current = null;
      if (mountedRef.current) emitState("idle");
    }, resetDelayMs);
  }, [emitState, resetDelayMs]);

  const handleCopy = useCallback(
    async (event: MouseEvent<HTMLButtonElement>) => {
      const button = event.currentTarget;
      if (disabled || disabledReason || copyingRef.current) {
        return;
      }
      // The previous settled result must not reset this new asynchronous copy.
      if (resetTimerRef.current !== null) {
        clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }

      const writeText = clipboardWriteText();
      if (!writeText) {
        emitState("unsupported");
        scheduleReset();
        return;
      }

      copyingRef.current = true;
      emitState("copying");
      let result: "copied" | "failed";
      try {
        await writeText(text);
        result = "copied";
      } catch {
        result = "failed";
      }
      copyingRef.current = false;
      if (!mountedRef.current) return;
      emitState(result);
      scheduleReset();
      // Completion must not take focus back from a field chosen while copying.
      if (button.ownerDocument.activeElement === button) button.focus({ preventScroll: true });
    },
    [disabled, disabledReason, emitState, scheduleReset, text]
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
      {/* Present in every state and shown only while the button is busy (copying), so the
          static bridge, which only sets aria-busy, shows the same loader the component does. */}
      <Icon name="loader-circle" className="tcrn-button__spinner" />
      {/* All four state icons are rendered and the stylesheet shows the one that
          data-clipboard-copy-state names, so the static bridge, which only switches that
          attribute, shows the same icon without drawing one. */}
      {clipboardStateIcons.map(([iconState, iconName]) => (
        <Icon key={iconState} name={iconName} data-clipboard-state-icon={iconState} />
      ))}
      {visibleLabel}
      <span id={liveRegionId} aria-live="polite" role="status" className="tcrn-sr-only">
        {disabledReason || liveMessage}
      </span>
    </Button>
  );
});
