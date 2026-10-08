import type { TcrnLocale } from "@tcrn/ui-copy-state";
import { requiredText, resolveDocumentLocale } from "../../utils.js";

export type ClipboardCopyState = "idle" | "copying" | "copied" | "failed" | "unsupported";

export interface ClipboardLabels {
  idle: string;
  copying: string;
  copied: string;
  failed: string;
  unsupported: string;
  /** The name used when the caller's own is unusable, per `safeCopyActionLabel`. */
  copyValue: string;
}

/**
 * The five words a copy button says about itself, in every supported locale.
 *
 * All five were English literals in parameter defaults, and four of them are
 * announced through an `aria-live` region — so on a translated page a screen
 * reader was interrupted mid-task to say "Copy failed" in a language the rest of
 * the page was not in. The visible label had the same problem in plain sight.
 *
 * The React button and the static DOM bridge read this one table, so a server-rendered
 * page and a client-rendered one say the same words.
 */
const clipboardLabels: Record<TcrnLocale, ClipboardLabels> = {
  "zh-CN": { idle: "复制", copying: "正在复制", copied: "已复制", failed: "复制失败", unsupported: "无法复制", copyValue: "复制该值" },
  en: { idle: "Copy", copying: "Copying", copied: "Copied", failed: "Copy failed", unsupported: "Copy unavailable", copyValue: "Copy value" },
  ja: { idle: "コピー", copying: "コピー中", copied: "コピーしました", failed: "コピーできませんでした", unsupported: "コピーは利用できません", copyValue: "値をコピー" },
  ko: { idle: "복사", copying: "복사 중", copied: "복사됨", failed: "복사 실패", unsupported: "복사할 수 없음", copyValue: "값 복사" },
  fr: { idle: "Copier", copying: "Copie en cours", copied: "Copié", failed: "Échec de la copie", unsupported: "Copie indisponible", copyValue: "Copier la valeur" }
};

export function clipboardLabelsFor(locale?: TcrnLocale | string): ClipboardLabels {
  return clipboardLabels[resolveDocumentLocale(locale)];
}

/** Copied, failed and unsupported states return to idle after this long. */
export const DEFAULT_RESET_DELAY_MS = 2000;

export function clipboardWriteText(): ((value: string) => Promise<void>) | null {
  if (typeof navigator === "undefined") {
    return null;
  }

  const writeText = navigator.clipboard?.writeText;
  return typeof writeText === "function" ? writeText.bind(navigator.clipboard) : null;
}

/** An accessible name that would announce the copied value is replaced by the generic one. */
export function safeCopyActionLabel(ariaLabel: string, text: string, copyValue: string): string {
  const label = requiredText(ariaLabel, copyValue);
  const copiedValue = text.trim();
  return copiedValue && label.includes(copiedValue) ? copyValue : label;
}
