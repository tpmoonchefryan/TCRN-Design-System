import type { MouseEvent } from "react";
import { forwardRef, useCallback, useEffect, useId, useRef, useState } from "react";
import type { TcrnLocale } from "@tcrn/ui-copy-state";
import { Button, type ButtonProps } from "../Button/index.js";
import { mergeIds, requiredText, resolveDocumentLocale } from "../../utils.js";

export type ClipboardCopyState = "idle" | "copying" | "copied" | "failed" | "unsupported";

interface ClipboardLabels {
  idle: string;
  copying: string;
  copied: string;
  failed: string;
  unsupported: string;
  /** The name used when the caller's own is unusable, per `safeCopyActionLabel`. */
  copyValue: string;
}

/**
 * The five words this button says about itself, in every supported locale.
 *
 * All five were English literals in parameter defaults, and four of them are
 * announced through an `aria-live` region — so on a translated page a screen
 * reader was interrupted mid-task to say "Copy failed" in a language the rest of
 * the page was not in. The visible label had the same problem in plain sight.
 */
const clipboardLabels: Record<TcrnLocale, ClipboardLabels> = {
  "zh-CN": { idle: "复制", copying: "正在复制", copied: "已复制", failed: "复制失败", unsupported: "无法复制", copyValue: "复制该值" },
  en: { idle: "Copy", copying: "Copying", copied: "Copied", failed: "Copy failed", unsupported: "Copy unavailable", copyValue: "Copy value" },
  ja: { idle: "コピー", copying: "コピー中", copied: "コピーしました", failed: "コピーできませんでした", unsupported: "コピーは利用できません", copyValue: "値をコピー" },
  ko: { idle: "복사", copying: "복사 중", copied: "복사됨", failed: "복사 실패", unsupported: "복사할 수 없음", copyValue: "값 복사" },
  fr: { idle: "Copier", copying: "Copie en cours", copied: "Copié", failed: "Échec de la copie", unsupported: "Copie indisponible", copyValue: "Copier la valeur" }
};

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

const DEFAULT_RESET_DELAY_MS = 2000;

function clipboardWriteText(): ((value: string) => Promise<void>) | null {
  if (typeof navigator === "undefined") {
    return null;
  }

  const writeText = navigator.clipboard?.writeText;
  return typeof writeText === "function" ? writeText.bind(navigator.clipboard) : null;
}

function safeCopyActionLabel(ariaLabel: string, text: string, copyValue: string): string {
  const label = requiredText(ariaLabel, copyValue);
  const copiedValue = text.trim();
  return copiedValue && label.includes(copiedValue) ? copyValue : label;
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

  const labels = clipboardLabels[resolveDocumentLocale(locale)];
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
