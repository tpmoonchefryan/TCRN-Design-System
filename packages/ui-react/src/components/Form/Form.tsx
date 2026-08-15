import type { HTMLAttributes, InputHTMLAttributes, ReactElement, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { Children, cloneElement, isValidElement, useId, useRef } from "react";
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
  /**
   * Let the control take its container's full inline size.
   *
   * The wrapper span owns the width, and `className` reaches the inner input, so
   * before this a consumer that needed a full-width search had no prop to say it
   * with — the first one solved it by styling `.tcrn-search-input` from outside,
   * which is a consumer reaching into this component's class names.
   */
  fill?: boolean;
}

export function SearchInput({ className, shortcut = false, fill = false, disabled, disabledReason, title, ...props }: SearchInputProps) {
  const shortcutLabel = shortcut === false ? undefined : shortcut === "auto" ? "Ctrl K" : shortcut;
  const ariaKeyShortcuts = props["aria-keyshortcuts"] ?? (shortcutLabel ? "Control+K Meta+K" : undefined);
  const normalizedReason = disabled ? requiredText(disabledReason, "Search unavailable in this route") : undefined;
  const disabledReasonId = useId();
  const ariaDescribedBy = mergeIds(props["aria-describedby"], normalizedReason ? disabledReasonId : undefined);
  return (
    <span className={cx("tcrn-search-input", fill && "tcrn-search-input--fill")} data-search-input="true" data-shortcut-visible={shortcutLabel ? "true" : undefined}>
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

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: ReactNode;
  description?: ReactNode;
  controlClassName?: string;
}

export function Switch({ label, description, className, controlClassName, disabled, ...props }: SwitchProps) {
  const descriptionId = useId();
  const describedBy = mergeIds(props["aria-describedby"], description ? descriptionId : undefined);
  const selected = props.checked ?? props.defaultChecked ?? false;
  return (
    <label className={cx("tcrn-switch", disabled && "tcrn-switch--disabled", className)} data-switch-state={selected ? "on" : "off"}>
      <input
        {...props}
        type="checkbox"
        role="switch"
        disabled={disabled}
        aria-describedby={describedBy}
        className={cx("tcrn-switch__control", controlClassName)}
      />
      <span className="tcrn-switch__label">{label}</span>
      {description ? <span id={descriptionId} className="tcrn-switch__description">{description}</span> : null}
    </label>
  );
}

export interface SettingRowProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  description?: ReactNode;
  control: ReactNode;
  settingKey?: ReactNode;
  modified?: boolean;
  resetLabel?: string;
  onReset?: () => void;
}

export function SettingRow({
  label,
  description,
  control,
  settingKey,
  modified = false,
  resetLabel = "Reset",
  onReset,
  className,
  ...props
}: SettingRowProps) {
  return (
    <div
      {...props}
      className={cx("tcrn-setting-row", modified && "tcrn-setting-row--modified", className)}
      data-setting-row="true"
      data-modified={modified ? "true" : "false"}
    >
      <div className="tcrn-setting-row__label">
        {settingKey ? <code className="tcrn-setting-row__key">{settingKey}</code> : null}
        <span className="tcrn-setting-row__name">{label}</span>
        {description ? <span className="tcrn-setting-row__description">{description}</span> : null}
      </div>
      <div className="tcrn-setting-row__control">{control}</div>
      {modified ? (
        <div className="tcrn-setting-row__tools">
          <span className="tcrn-setting-row__modified" role="img" title="Modified" aria-label="Modified" aria-hidden={onReset ? undefined : true} />
          {onReset ? (
            <button type="button" className="tcrn-setting-row__reset" onClick={onReset}>
              {resetLabel}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export interface FieldProvenanceProps extends HTMLAttributes<HTMLDivElement> {
  value: ReactNode;
  source: ReactNode;
  action?: ReactNode;
  overridden?: boolean;
}

export function FieldProvenance({ value, source, action, overridden = false, className, ...props }: FieldProvenanceProps) {
  return (
    <div
      {...props}
      className={cx("tcrn-field-provenance", overridden && "tcrn-field-provenance--overridden", className)}
      data-provenance-state={overridden ? "overridden" : "default"}
    >
      <span className="tcrn-field-provenance__value">{value}</span>
      <span className="tcrn-field-provenance__source">{source}</span>
      {action ? <span className="tcrn-field-provenance__action">{action}</span> : null}
    </div>
  );
}

export interface LineNumberedEditorFinding {
  line: number;
  label: ReactNode;
  tone?: "warning" | "danger" | "neutral";
}

export interface LineNumberedEditorProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value"> {
  value?: string;
  lines?: string[];
  findings?: LineNumberedEditorFinding[];
  showLineNumbers?: boolean;
}

export function LineNumberedEditor({
  value,
  defaultValue,
  lines,
  findings = [],
  showLineNumbers = true,
  className,
  onScroll,
  ...props
}: LineNumberedEditorProps) {
  const gutterRef = useRef<HTMLOListElement>(null);
  const sourceLines = lines ?? String(value ?? defaultValue ?? "").split("\n");
  const lineCount = Math.max(sourceLines.length, 1);
  const findingsByLine = new Map(findings.map((finding) => [finding.line, finding]));
  const handleScroll: NonNullable<TextareaHTMLAttributes<HTMLTextAreaElement>["onScroll"]> = (event) => {
    if (gutterRef.current) {
      gutterRef.current.scrollTop = event.currentTarget.scrollTop;
    }
    onScroll?.(event);
  };

  return (
    <div className={cx("tcrn-line-numbered-editor", className)} data-line-numbered-editor="true">
      {showLineNumbers ? (
        <ol ref={gutterRef} className="tcrn-line-numbered-editor__gutter" aria-hidden="true">
          {Array.from({ length: lineCount }, (_, index) => {
            const line = index + 1;
            const finding = findingsByLine.get(line);
            return (
              <li key={line}
                className={cx(finding && "tcrn-line-numbered-editor__line--finding", finding && `tcrn-line-numbered-editor__line--${finding.tone ?? "warning"}`)}
                data-editor-line={line}
                data-editor-line-finding={finding ? "true" : undefined}
              >
                {line}
              </li>
            );
          })}
        </ol>
      ) : null}
      <div className="tcrn-line-numbered-editor__content">
        <textarea
          {...props}
          value={value}
          defaultValue={value === undefined ? defaultValue : undefined}
          onScroll={handleScroll}
          className={cx("tcrn-input", "tcrn-line-numbered-editor__control")}
          aria-label={props["aria-label"] ?? "Editor"}
        />
        {findings.length > 0 ? (
          <ul className="tcrn-line-numbered-editor__findings" aria-label="Editor findings">
            {findings.map((finding) => (
              <li key={`${finding.line}-${String(finding.label)}`} className={cx(`tcrn-line-numbered-editor__finding--${finding.tone ?? "warning"}`)} data-editor-finding-line={finding.line}>
                <span className="tcrn-line-numbered-editor__finding-line">Line {finding.line}</span>
                <span>{finding.label}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

export interface LockHintProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
  icon?: ReactNode;
}

export function LockHint({ children, icon = "🔒", className, ...props }: LockHintProps) {
  return (
    <span {...props} className={cx("tcrn-lock-hint", className)} data-lock-hint="true" role="note">
      <span className="tcrn-lock-hint__icon" aria-hidden="true">{icon}</span>
      <span className="tcrn-lock-hint__text">{children}</span>
    </span>
  );
}
