import type { InputHTMLAttributes, ReactElement, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { Children, cloneElement, isValidElement, useId } from "react";
import { Icon } from "../Icon/index.js";
import { childPropsOf, cx, mergeIds, requiredText } from "../../utils.js";

export interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export function Field({ label, hint, error, children }: FieldProps) {
  const hintId = useId();
  const errorId = useId();
  const describedBy = mergeIds(hint ? hintId : undefined, error ? errorId : undefined);
  const controls = Children.map(children, (child) => {
    if (!isValidElement(child)) {
      return child;
    }
    const childElement = child as ReactElement<Record<string, unknown>>;
    const props = childPropsOf(childElement);
    return cloneElement(childElement, {
      "aria-describedby": mergeIds(props["aria-describedby"] as string | undefined, describedBy),
      "aria-invalid": error ? true : props["aria-invalid"]
    });
  });
  return (
    <label
      className={cx("tcrn-field", error && "tcrn-field--error")}
      data-field-description={hint ? hintId : undefined}
      data-field-error={error ? errorId : undefined}
    >
      <span className="tcrn-field__label">{label}</span>
      {controls}
      {hint ? <span id={hintId} className="tcrn-field__hint">{hint}</span> : null}
      {error ? <span id={errorId} className="tcrn-field__error">{error}</span> : null}
    </label>
  );
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  disabledReason?: string;
}

export function Input({ className, disabled, disabledReason, title, ...props }: InputProps) {
  const normalizedReason = disabled ? requiredText(disabledReason, "Input unavailable in this route") : undefined;
  const disabledReasonId = useId();
  const ariaDescribedBy = mergeIds(props["aria-describedby"], normalizedReason ? disabledReasonId : undefined);
  return (
    <>
      <input
        {...props}
        disabled={disabled}
        title={normalizedReason ?? title}
        aria-describedby={ariaDescribedBy}
        data-disabled-reason={normalizedReason}
        className={cx("tcrn-input", className)}
      />
      {normalizedReason ? <span id={disabledReasonId} className="tcrn-sr-only">{normalizedReason}</span> : null}
    </>
  );
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  disabledReason?: string;
}

export function Textarea({ className, disabled, disabledReason, title, ...props }: TextareaProps) {
  const normalizedReason = disabled ? requiredText(disabledReason, "Textarea unavailable in this route") : undefined;
  const disabledReasonId = useId();
  const ariaDescribedBy = mergeIds(props["aria-describedby"], normalizedReason ? disabledReasonId : undefined);
  return (
    <>
      <textarea
        {...props}
        disabled={disabled}
        title={normalizedReason ?? title}
        aria-describedby={ariaDescribedBy}
        data-disabled-reason={normalizedReason}
        className={cx("tcrn-input", "tcrn-textarea", className)}
      />
      {normalizedReason ? <span id={disabledReasonId} className="tcrn-sr-only">{normalizedReason}</span> : null}
    </>
  );
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  disabledReason?: string;
}

export function Select({ options, className, disabled, disabledReason, title, ...props }: SelectProps) {
  const normalizedReason = disabled ? requiredText(disabledReason, "Select unavailable in this route") : undefined;
  const disabledReasonId = useId();
  const ariaDescribedBy = mergeIds(props["aria-describedby"], normalizedReason ? disabledReasonId : undefined);
  return (
    <>
      <select
        {...props}
        disabled={disabled}
        title={normalizedReason ?? title}
        aria-describedby={ariaDescribedBy}
        data-disabled-reason={normalizedReason}
        className={cx("tcrn-select", className)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {normalizedReason ? <span id={disabledReasonId} className="tcrn-sr-only">{normalizedReason}</span> : null}
    </>
  );
}

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  disabledReason?: string;
}

export function Checkbox({ className, disabled, disabledReason, title, ...props }: CheckboxProps) {
  const normalizedReason = disabled ? requiredText(disabledReason, "Checkbox unavailable in this route") : undefined;
  const disabledReasonId = useId();
  const ariaDescribedBy = mergeIds(props["aria-describedby"], normalizedReason ? disabledReasonId : undefined);
  return (
    <>
      <input
        {...props}
        type="checkbox"
        disabled={disabled}
        title={normalizedReason ?? title}
        aria-describedby={ariaDescribedBy}
        data-disabled-reason={normalizedReason}
        className={cx("tcrn-checkbox", className)}
      />
      {normalizedReason ? <span id={disabledReasonId} className="tcrn-sr-only">{normalizedReason}</span> : null}
    </>
  );
}

export interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  shortcut?: "auto" | string | false;
  disabledReason?: string;
}

export function SearchInput({ className, shortcut = false, disabled, disabledReason, title, ...props }: SearchInputProps) {
  const shortcutLabel = shortcut === false ? undefined : shortcut === "auto" ? "Ctrl K" : shortcut;
  const ariaKeyShortcuts = props["aria-keyshortcuts"] ?? (shortcutLabel ? "Control+K Meta+K" : undefined);
  const normalizedReason = disabled ? requiredText(disabledReason, "Search unavailable in this route") : undefined;
  const disabledReasonId = useId();
  const ariaDescribedBy = mergeIds(props["aria-describedby"], normalizedReason ? disabledReasonId : undefined);
  return (
    <span className="tcrn-search-input" data-search-input="true" data-shortcut-visible={shortcutLabel ? "true" : undefined}>
      <span className="tcrn-search-input__icon" aria-hidden="true">
        <Icon name="search" />
      </span>
      <input
        {...props}
        type="search"
        disabled={disabled}
        title={normalizedReason ?? title}
        aria-describedby={ariaDescribedBy}
        aria-keyshortcuts={ariaKeyShortcuts}
        data-disabled-reason={normalizedReason}
        className={cx("tcrn-input", "tcrn-search-input__control", className)}
      />
      {normalizedReason ? <span id={disabledReasonId} className="tcrn-sr-only">{normalizedReason}</span> : null}
      {shortcutLabel ? (
        <kbd className="tcrn-search-input__shortcut" data-shortcut-auto={shortcut === "auto" ? "search" : undefined} aria-hidden="true">
          {shortcutLabel}
        </kbd>
      ) : null}
    </span>
  );
}
