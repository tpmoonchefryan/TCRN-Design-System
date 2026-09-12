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

export interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  disabledReason?: string;
}

/**
 * A numeric value is entered as a numeric value.
 *
 * This is intentionally separate from Stepper: Stepper communicates position in
 * an ordered process, while NumberInput owns keyboard entry, paste, range
 * constraints, and native invalid-state semantics for a number. The input stays
 * a native number control so the browser preserves its editing and accessibility
 * behaviour instead of making a visual stepper carry a value-entry contract.
 */
export function NumberInput({ className, disabled, disabledReason, title, ...props }: NumberInputProps) {
  const normalizedReason = disabled ? requiredText(disabledReason, "Number input unavailable in this route") : undefined;
  const disabledReasonId = useId();
  const ariaDescribedBy = mergeIds(props["aria-describedby"], normalizedReason ? disabledReasonId : undefined);
  return (
    <>
      <input
        {...props}
        type="number"
        inputMode={props.inputMode ?? "numeric"}
        disabled={disabled}
        title={normalizedReason ?? title}
        aria-describedby={ariaDescribedBy}
        data-disabled-reason={normalizedReason}
        data-number-input="true"
        data-number-input-semantic="numeric-entry"
        data-number-input-visibility="full-value"
        className={cx("tcrn-input", "tcrn-number-input", className)}
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
  disabled?: boolean;
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
          <option key={option.value} value={option.value} disabled={option.disabled}>
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

/**
 * One choice from a small set, where seeing all the options is the point.
 *
 * A radio group is a `<fieldset>` with a `<legend>`, not a div with a label:
 * that pairing is what makes a screen reader announce the question before the
 * answers, and it is the part hand-rolled groups leave out. Products that build
 * their own reach for `role="radiogroup"` on a div, which announces the group but
 * loses the native arrow-key roving that the browser gives radios for free.
 *
 * `name` is required. Two groups on one page sharing a name silently become one
 * group, and the second question starts clearing the first answer.
 */
export interface RadioOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  minInlineSize?: number;
}

export interface RadioGroupProps extends Omit<HTMLAttributes<HTMLFieldSetElement>, "onChange"> {
  /** The question. Rendered as the group's legend. */
  legend: ReactNode;
  /** Shared form name. Required: two groups sharing one name are one group. */
  name: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export function RadioGroup({ legend, name, options, value, defaultValue, onChange, disabled, className, ...props }: RadioGroupProps) {
  const groupId = useId();
  return (
    <fieldset {...props} className={cx("tcrn-radio-group", className)} data-radio-group="true" disabled={disabled}>
      <legend className="tcrn-radio-group__legend">{legend}</legend>
      {options.map((option) => {
        const descriptionId = `${groupId}-${option.value}`;
        return (
          <label key={option.value}
            className="tcrn-radio-group__option"
            data-option-disabled={option.disabled ? "true" : undefined}
            style={option.minInlineSize ? { minInlineSize: `${option.minInlineSize}px` } : undefined}
          >
            <input type="radio" className="tcrn-radio-group__control"
              name={name}
              value={option.value}
              disabled={option.disabled}
              aria-describedby={option.description ? descriptionId : undefined}
              {...(value === undefined
                ? { defaultChecked: defaultValue === option.value }
                : { checked: value === option.value, onChange: () => onChange?.(option.value) })}
            />
            <span className="tcrn-radio-group__label">{option.label}</span>
            {option.description ? <span id={descriptionId} className="tcrn-radio-group__description">{option.description}</span> : null}
          </label>
        );
      })}
    </fieldset>
  );
}

export type SettingChoiceControl = "select" | "radio";

export interface SettingChoiceOption {
  value: string;
  label: string;
  description?: ReactNode;
  disabled?: boolean;
  /** Minimum inline size needed for this option's label and control. */
  minInlineSize?: number;
}

export interface SettingChoiceDecision {
  control: SettingChoiceControl;
  reason: "option-count-requires-select" | "option-measurement-required" | "available-inline-size-required" | "binary-does-not-fit" | "binary-fits";
  requiredInlineSize: number;
  availableInlineSize?: number;
}

/**
 * The numeric values are the package contract for the binary-choice fit check.
 * They mirror the container tokens used by the stylesheet: each option has a
 * 112px CSS floor, the pair has an 8px gap, and the group has 8px padding on
 * each inline edge. The CSS floor is not a label measurement: a consumer must
 * provide a finite positive `minInlineSize` for each option before this helper
 * can admit a binary radio group.
 */
export const tcrnSettingChoiceDefaultOptionMinInlineSize = 112;
export const tcrnSettingChoiceBinaryGap = 8;
export const tcrnSettingChoiceBinaryPadding = 8;

export const tcrnSettingChoiceDecisionTable = [
  { optionCount: "0-1", control: "select", rule: "Value selection remains a select when no binary pair exists." },
  { optionCount: "2", control: "select", rule: "Use select when either option lacks a finite positive label/control measurement." },
  { optionCount: "2", control: "radio", rule: "Use the binary value choice only when every label and control fits the measured inline size." },
  { optionCount: "2", control: "select", rule: "Use select when the measured inline size is missing or below the required binary width." },
  { optionCount: "3+", control: "select", rule: "Settings with more than two values always use select." }
] as const;

export function resolveSettingChoiceControl(
  options: readonly SettingChoiceOption[],
  availableInlineSize?: number
): SettingChoiceDecision {
  if (options.length !== 2) {
    return {
      control: "select",
      reason: "option-count-requires-select",
      requiredInlineSize: 0,
      availableInlineSize
    };
  }

  const measuredOptionSizes = options.map((option) => option.minInlineSize);
  if (!measuredOptionSizes.every((size) => typeof size === "number" && Number.isFinite(size) && size > 0)) {
    return {
      control: "select",
      reason: "option-measurement-required",
      requiredInlineSize: 0,
      availableInlineSize
    };
  }

  const requiredInlineSize = measuredOptionSizes.reduce<number>(
    (total, optionSize) => total + (optionSize ?? 0),
    tcrnSettingChoiceBinaryGap + (tcrnSettingChoiceBinaryPadding * 2)
  );
  if (availableInlineSize === undefined || !Number.isFinite(availableInlineSize)) {
    return { control: "select", reason: "available-inline-size-required", requiredInlineSize, availableInlineSize };
  }
  if (availableInlineSize < requiredInlineSize) {
    return { control: "select", reason: "binary-does-not-fit", requiredInlineSize, availableInlineSize };
  }
  return { control: "radio", reason: "binary-fits", requiredInlineSize, availableInlineSize };
}

export interface SettingChoiceProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onChange"> {
  label: ReactNode;
  name: string;
  options: SettingChoiceOption[];
  value?: string;
  defaultValue?: string;
  availableInlineSize?: number;
  hint?: ReactNode;
  error?: ReactNode;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

/**
 * Selects a value-control by semantics and measured capacity, never by visual
 * similarity to navigation. Three or more values are always a Select. A pair
 * becomes a native radio group only after the consumer supplies enough inline
 * space for the measured labels and controls.
 */
export function SettingChoice({
  label,
  name,
  options,
  value,
  defaultValue,
  availableInlineSize,
  hint,
  error,
  disabled = false,
  onChange,
  className,
  ...props
}: SettingChoiceProps) {
  const decision = resolveSettingChoiceControl(options, availableInlineSize);
  const controlId = useId();
  const hintId = useId();
  const errorId = useId();
  const describedBy = mergeIds(hint ? hintId : undefined, error ? errorId : undefined);
  const selectOptions = options.map(({ value: optionValue, label: optionLabel, disabled: optionDisabled }) => ({ value: optionValue, label: optionLabel, disabled: optionDisabled }));
  const radioOptions: RadioOption[] = options.map(({ value: optionValue, label: optionLabel, description, disabled: optionDisabled, minInlineSize }) => ({
    value: optionValue,
    label: optionLabel,
    description,
    disabled: optionDisabled,
    minInlineSize
  }));

  return (
    <div
      {...props}
      className={cx("tcrn-setting-choice", className)}
      data-setting-choice="true"
      data-setting-choice-semantic="value-selection"
      data-setting-choice-control={decision.control}
      data-setting-choice-option-count={options.length}
      data-setting-choice-required-inline-size={decision.requiredInlineSize || undefined}
      data-setting-choice-available-inline-size={availableInlineSize}
      data-setting-choice-fit={decision.reason === "binary-fits" ? "true" : "false"}
      data-setting-choice-rejection-reason={decision.reason === "binary-fits" ? undefined : decision.reason}
    >
      {decision.control === "radio" ? (
        <RadioGroup
          legend={label}
          name={name}
          options={radioOptions}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          disabled={disabled}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className="tcrn-setting-choice__radio"
        />
      ) : (
        <label className="tcrn-setting-choice__select-label" htmlFor={controlId}>
          <span className="tcrn-setting-choice__label">{label}</span>
          <Select
            id={controlId}
            name={name}
            options={selectOptions}
            value={value}
            defaultValue={value === undefined ? defaultValue : undefined}
            disabled={disabled}
            aria-describedby={describedBy}
            aria-invalid={error ? true : undefined}
            onChange={(event) => onChange?.(event.currentTarget.value)}
          />
        </label>
      )}
      {hint ? <span id={hintId} className="tcrn-setting-choice__hint">{hint}</span> : null}
      {error ? <span id={errorId} className="tcrn-setting-choice__error">{error}</span> : null}
    </div>
  );
}

export interface SettingsHostSwitcherProps extends Omit<SettingChoiceProps, "options"> {
  hosts: SettingChoiceOption[];
}

/** A single-host value choice used before rendering the host's full settings form. */
export function SettingsHostSwitcher({ hosts, className, ...props }: SettingsHostSwitcherProps) {
  return (
    <div className={cx("tcrn-settings-host-switcher", className)} data-settings-host-switcher="true">
      <SettingChoice {...props} options={hosts} data-setting-choice-scope="host-switcher" />
    </div>
  );
}

/**
 * A date, entered as a date.
 *
 * This wraps `<input type="date">` rather than building a calendar grid, and the
 * restraint is the design. The native control brings the platform's own picker,
 * its locale-correct display format, its keyboard handling and its screen-reader
 * announcements — all of which a hand-built grid has to reimplement and usually
 * reimplements worse. A custom calendar earns its place only when a product needs
 * ranges, multi-select or disabled days, and none of the consumers here does.
 *
 * The value is always ISO `YYYY-MM-DD` regardless of what the reader sees, so a
 * product never parses a localised string. That split — machine format in the
 * value, reader's format on screen — is what the native control gives for free
 * and what products most often get wrong on their own.
 */
export interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** ISO `YYYY-MM-DD`. The displayed format is the reader's, not this one. */
  value?: string;
  /** Earliest selectable date, ISO. */
  min?: string;
  /** Latest selectable date, ISO. */
  max?: string;
}

export function DatePicker({ className, ...props }: DatePickerProps) {
  return <input {...props} type="date" className={cx("tcrn-date-picker", className)} data-date-picker="true" />;
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
  const labelId = useId();
  const labeledControl = isValidElement(control)
    ? (() => {
      const controlElement = control as ReactElement<Record<string, unknown>>;
      const controlProps = childPropsOf(controlElement);
      return cloneElement(controlElement, {
        "aria-labelledby": mergeIds(controlProps["aria-labelledby"] as string | undefined, labelId)
      });
    })()
    : control;
  return (
    <div
      {...props}
      className={cx("tcrn-setting-row", modified && "tcrn-setting-row--modified", className)}
      data-setting-row="true"
      data-modified={modified ? "true" : "false"}
    >
      <div className="tcrn-setting-row__label">
        {settingKey ? <code className="tcrn-setting-row__key">{settingKey}</code> : null}
        <span id={labelId} className="tcrn-setting-row__name">{label}</span>
        {description ? <span className="tcrn-setting-row__description">{description}</span> : null}
      </div>
      <div className="tcrn-setting-row__control">{labeledControl}</div>
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
