import { mountStaticOverlayBoundary } from "../Overlay/Overlay.js";

export interface StaticMultiSelectOptions {
  root: HTMLElement;
  /** Controlled consumers keep their value authoritative until their own update. */
  getValue?: () => readonly string[];
  onChange?: (values: string[]) => void;
  /** Reset updates an uncontrolled consumer's cache without reporting a user change. */
  onReset?: (values: string[]) => void;
}

export interface StaticMultiSelectHandle {
  sync(): void;
  close(): void;
  destroy(): void;
}

/** The dropdown's DOM contract is shared by React and server-rendered consumers. */
export function mountStaticMultiSelect({ root, getValue, onChange, onReset }: StaticMultiSelectOptions): StaticMultiSelectHandle {
  const select = root.querySelector<HTMLSelectElement>(".tcrn-multi-select-dropdown__value");
  const trigger = root.querySelector<HTMLButtonElement>(".tcrn-multi-select-dropdown__trigger");
  const layer = root.querySelector<HTMLElement>(".tcrn-multi-select-dropdown__list");
  const validation = root.querySelector<HTMLInputElement>(".tcrn-multi-select-dropdown__validation");
  const summary = trigger?.querySelector<HTMLElement>("[data-multi-select-summary]");
  if (!select || !trigger || !layer || !summary) throw new Error("MultiSelect dropdown needs its value, trigger, listbox, and summary");
  const options = () => Array.from(layer.querySelectorAll<HTMLButtonElement>("[role=option]"));
  const enabled = () => options().filter((option) => !option.disabled);
  const nativeValue = () => Array.from(select.selectedOptions, (option) => option.value);
  const value = () => [...new Set(getValue ? getValue() : nativeValue())].filter((entry) => Array.from(select.options).some((option) => option.value === entry));
  let disposed = false;
  let resetTimer: number | undefined;
  const boundary = mountStaticOverlayBoundary({ trigger, layer, kind: "popover", placement: "bottom-start" });
  // A listbox is a value selector. The shared boundary only owns placement and dismissal.
  layer.setAttribute("role", "listbox");
  const sync = () => {
    if (disposed) return;
    const current = value();
    for (const option of select.options) option.selected = current.includes(option.value);
    if (validation) validation.checked = Array.from(select.options).some((option) => option.selected && !option.disabled);
    for (const option of options()) {
      const selected = current.includes(option.dataset.multiSelectValue ?? "");
      option.setAttribute("aria-selected", String(selected));
      option.dataset.selected = String(selected);
      option.querySelector<HTMLElement>("[data-multi-select-check]")?.setAttribute("data-selected", String(selected));
      const label = option.querySelector<HTMLElement>("[data-multi-select-label]");
      const native = Array.from(select.options).find((entry) => entry.value === option.dataset.multiSelectValue);
      if (label && native && label.textContent !== native.label) label.textContent = native.label;
    }
    summary.textContent = Array.from(select.options).filter((option) => current.includes(option.value)).map((option) => option.label).join(", ") || root.dataset.emptySelectionLabel || "";
    layer.style.width = `${trigger.getBoundingClientRect().width}px`;
    if (trigger.matches(":disabled")) boundary.close();
    boundary.reposition();
  };
  const focusOption = (index: number) => {
    const list = enabled();
    if (list.length) list[(index + list.length) % list.length]?.focus();
    else layer.focus();
  };
  const open = (last = false) => {
    if (trigger.matches(":disabled")) return;
    sync();
    boundary.open();
    const list = enabled();
    const selectedIndex = list.findIndex((option) => option.getAttribute("aria-selected") === "true");
    focusOption(last ? list.length - 1 : Math.max(selectedIndex, 0));
  };
  const clickTrigger = () => {
    // OverlayBoundary's trigger listener has already toggled the layer.
    if (!layer.hidden) open();
  };
  const commit = (next: string[]) => {
    if (JSON.stringify(next) === JSON.stringify(value())) return;
    if (!getValue) for (const option of select.options) option.selected = next.includes(option.value);
    sync();
    if (onChange) onChange(next);
    else select.dispatchEvent(new Event("change", { bubbles: true }));
  };
  const clickOption = (event: MouseEvent) => {
    const option = (event.target as Element | null)?.closest<HTMLButtonElement>("[role=option]");
    if (!option || option.disabled || trigger.matches(":disabled")) return;
    const chosen = option.dataset.multiSelectValue;
    if (chosen === undefined) return;
    const current = value();
    commit(current.includes(chosen) ? current.filter((entry) => entry !== chosen) : [...current, chosen]);
  };
  const triggerKey = (event: KeyboardEvent) => {
    if (["ArrowDown", "ArrowUp"].includes(event.key)) {
      event.preventDefault(); open(event.key === "ArrowUp");
    }
  };
  const layerKey = (event: KeyboardEvent) => {
    const list = enabled();
    const index = list.indexOf(document.activeElement as HTMLButtonElement);
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      focusOption(event.key === "Home" ? 0 : event.key === "End" ? list.length - 1 : index + (event.key === "ArrowDown" ? 1 : -1));
    } else if (event.key === "Tab") {
      // Return to the trigger before the browser performs normal form tab navigation.
      boundary.close({ restoreFocus: true });
    } else if (event.key.length === 1 && event.key !== " " && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const start = Math.max(index + 1, 0);
      const candidates = [...list.slice(start), ...list.slice(0, start)];
      const match = candidates.find((option) => option.querySelector("[data-multi-select-label]")?.textContent?.trim().toLocaleLowerCase().startsWith(event.key.toLocaleLowerCase()));
      if (match) { event.preventDefault(); match.focus(); }
    }
  };
  const invalidFocus = () => trigger.focus();
  const reset = (event: Event) => {
    // The browser restores defaults after reset dispatch, including its microtask checkpoint.
    // A later task also observes preventDefault without overriding a cancelled reset.
    if (resetTimer !== undefined) window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => {
      resetTimer = undefined;
      if (disposed) return;
      if (!event.defaultPrevented && !getValue) onReset?.(nativeValue());
      sync(); boundary.close();
    }, 0);
  };
  // Locale swaps update option text. Native options remain the labels' authority.
  const labels = new MutationObserver(sync);
  labels.observe(select, { childList: true, subtree: true, characterData: true });
  const form = select.form;
  trigger.addEventListener("click", clickTrigger);
  trigger.addEventListener("keydown", triggerKey);
  layer.addEventListener("click", clickOption);
  layer.addEventListener("keydown", layerKey);
  select.addEventListener("focus", invalidFocus);
  validation?.addEventListener("focus", invalidFocus);
  select.addEventListener("change", sync);
  form?.addEventListener("reset", reset);
  window.addEventListener("resize", sync);
  sync();
  return {
    sync,
    close: () => boundary.close(),
    destroy() {
      if (disposed) return;
      disposed = true;
      if (resetTimer !== undefined) window.clearTimeout(resetTimer);
      labels.disconnect();
      trigger.removeEventListener("click", clickTrigger);
      trigger.removeEventListener("keydown", triggerKey);
      layer.removeEventListener("click", clickOption);
      layer.removeEventListener("keydown", layerKey);
      select.removeEventListener("focus", invalidFocus);
      validation?.removeEventListener("focus", invalidFocus);
      select.removeEventListener("change", sync);
      form?.removeEventListener("reset", reset);
      window.removeEventListener("resize", sync);
      boundary.destroy();
    }
  };
}
