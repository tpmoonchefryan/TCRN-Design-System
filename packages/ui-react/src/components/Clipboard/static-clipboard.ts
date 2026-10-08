import type { TcrnLocale } from "@tcrn/ui-copy-state";
import { mergeIds } from "../../utils.js";
import {
  DEFAULT_RESET_DELAY_MS,
  clipboardLabelsFor,
  clipboardWriteText,
  safeCopyActionLabel,
  type ClipboardCopyState
} from "./clipboard-copy.js";

export interface StaticClipboardCopyButtonOptions {
  /**
   * A native button rendered with the ClipboardCopyButton construct: its visible label as a
   * direct text node, the polite `role="status"` region and `data-clipboard-copy-state`. The
   * value it copies is read from `data-clipboard-text`, so it is present in the page; a value
   * that must stay out of the DOM belongs to the React ClipboardCopyButton, which never writes it.
   */
  root: HTMLElement;
  /** Which language the built-in state labels are said in; defaults to the page's own at each change. */
  locale?: TcrnLocale | string;
}

export interface StaticClipboardCopyButtonHandle {
  destroy(): void;
}

const labelAttributes = {
  idle: "data-clipboard-idle-label",
  copying: "data-clipboard-copying-label",
  copied: "data-clipboard-copied-label",
  failed: "data-clipboard-failed-label",
  unsupported: "data-clipboard-unsupported-label"
} as const satisfies Record<ClipboardCopyState, string>;

let statusRegionSequence = 0;

function restoreAttribute(node: Element, name: string, value: string | null): void {
  if (value === null) node.removeAttribute(name);
  else node.setAttribute(name, value);
}

/**
 * Gives server-emitted ClipboardCopyButton markup the same behaviour as the React button
 * without a React tree: an explicit click or keyboard activation writes the value with
 * `navigator.clipboard.writeText`, the button moves through idle, copying, copied, failed
 * and unsupported exactly as the component does, returns to idle after two seconds and
 * keeps focus. Labels come from the package's five-locale copy unless a
 * `data-clipboard-<state>-label` attribute overrides one.
 */
export function mountStaticClipboardCopyButton({ root, locale }: StaticClipboardCopyButtonOptions): StaticClipboardCopyButtonHandle {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return { destroy: () => undefined };
  }
  if (!(root instanceof HTMLElement) || root.localName !== "button") {
    throw new Error("ClipboardCopyButton static bridge needs a native button root");
  }
  const status = root.querySelector<HTMLElement>('[role="status"][aria-live="polite"]');
  if (!status) throw new Error("ClipboardCopyButton static bridge needs the polite status region");
  if (!root.hasAttribute("data-clipboard-text")) throw new Error("ClipboardCopyButton static bridge needs data-clipboard-text");

  const button = root as HTMLButtonElement;
  const original = {
    state: button.getAttribute("data-clipboard-copy-state"),
    busy: button.getAttribute("aria-busy"),
    ariaLabel: button.getAttribute("aria-label"),
    describedBy: button.getAttribute("aria-describedby"),
    statusId: status.getAttribute("id"),
    statusText: status.textContent
  };

  const labelNode = (): Text => {
    for (const node of Array.from(button.childNodes)) {
      if (node.nodeType === 3) return node as Text;
    }
    const text = document.createTextNode("");
    button.insertBefore(text, button.firstChild);
    return text;
  };
  const originalLabel = labelNode().data;
  const overrideFor = (state: ClipboardCopyState) => button.getAttribute(labelAttributes[state])?.trim() || "";
  const isDisabled = () => button.disabled || button.getAttribute("aria-disabled") === "true";
  const resetDelay = () => {
    const configured = Number(button.getAttribute("data-clipboard-reset-delay-ms"));
    return button.hasAttribute("data-clipboard-reset-delay-ms") && Number.isFinite(configured) && configured >= 0
      ? configured
      : DEFAULT_RESET_DELAY_MS;
  };

  // The idle label is what the page shows while nothing is happening: an explicit override,
  // else the label the server rendered (re-read before each copy so a page that swaps its
  // language keeps its own words), else the package's word for the current locale.
  let idleLabel = overrideFor("idle") || originalLabel.trim() || clipboardLabelsFor(locale).idle;
  let state: ClipboardCopyState = "idle";
  let disposed = false;
  let resetTimer: ReturnType<typeof setTimeout> | undefined;

  const render = (next: ClipboardCopyState) => {
    state = next;
    const labels = clipboardLabelsFor(locale);
    const message = next === "idle" ? "" : overrideFor(next) || labels[next];
    button.setAttribute("data-clipboard-copy-state", next);
    if (next === "copying") button.setAttribute("aria-busy", "true");
    else button.removeAttribute("aria-busy");
    labelNode().data = message || idleLabel;
    const reason = isDisabled() ? button.getAttribute("data-disabled-reason") : null;
    status.textContent = reason || message;
  };

  const scheduleReset = () => {
    if (resetTimer !== undefined) clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      resetTimer = undefined;
      if (!disposed) render("idle");
    }, resetDelay());
  };

  const copy = async () => {
    if (disposed || isDisabled() || state === "copying") return;
    if (state === "idle") idleLabel = overrideFor("idle") || labelNode().data.trim() || clipboardLabelsFor(locale).idle;
    const writeText = clipboardWriteText();
    if (!writeText) {
      render("unsupported");
      scheduleReset();
      return;
    }
    try {
      render("copying");
      await writeText(button.getAttribute("data-clipboard-text") ?? "");
      if (!disposed) render("copied");
    } catch {
      if (!disposed) render("failed");
    } finally {
      if (!disposed) scheduleReset();
    }
    if (!disposed) button.focus({ preventScroll: true });
  };
  const onClick = () => {
    void copy();
  };

  // The same fail-closed name as the component: a label that would announce the copied
  // value is replaced by the generic one, and the status region describes the button.
  if (original.ariaLabel !== null) {
    button.setAttribute("aria-label", safeCopyActionLabel(original.ariaLabel, button.getAttribute("data-clipboard-text") ?? "", clipboardLabelsFor(locale).copyValue));
  }
  if (!status.id) {
    statusRegionSequence += 1;
    status.id = `tcrn-clipboard-status-${statusRegionSequence}`;
  }
  const describedBy = mergeIds(original.describedBy ?? undefined, status.id);
  if (describedBy) button.setAttribute("aria-describedby", describedBy);
  render("idle");
  button.addEventListener("click", onClick);

  return {
    destroy() {
      if (disposed) return;
      disposed = true;
      if (resetTimer !== undefined) clearTimeout(resetTimer);
      button.removeEventListener("click", onClick);
      restoreAttribute(button, "data-clipboard-copy-state", original.state);
      restoreAttribute(button, "aria-busy", original.busy);
      restoreAttribute(button, "aria-label", original.ariaLabel);
      restoreAttribute(button, "aria-describedby", original.describedBy);
      labelNode().data = originalLabel;
      status.textContent = original.statusText;
      restoreAttribute(status, "id", original.statusId);
    }
  };
}
