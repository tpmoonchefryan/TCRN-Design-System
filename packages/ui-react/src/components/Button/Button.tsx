import type { AnchorHTMLAttributes, ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";
import { Children, forwardRef, useId } from "react";
import { Icon, type IconName } from "../Icon/index.js";
import { cx, mergeIds, requiredText } from "../../utils.js";

type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "quiet" | "danger";
  size?: Size;
  disabledReason?: string;
  /**
   * The action is running: the button says so with aria-busy and the loader icon, and a
   * further press does nothing. The busy wording is the caller's children, in the page's
   * language; the package adds no text of its own.
   */
  loading?: boolean;
}

interface LabelledContent {
  content: ReactNode[];
  text: string | undefined;
}

/**
 * Wraps each run of text children in the label span, which keeps the label on one line and
 * cuts it with an ellipsis, and returns the text so the control can repeat it in title: a
 * label that was cut stays readable. Element children (icons, a status region) stay as given.
 */
function labelledContent(children: ReactNode): LabelledContent {
  const content: ReactNode[] = [];
  const texts: string[] = [];
  let run: string[] = [];
  const flush = () => {
    if (run.length === 0) return;
    const value = run.join("");
    run = [];
    if (value.trim() === "") {
      content.push(value);
      return;
    }
    texts.push(value.trim());
    content.push(
      <span key={`tcrn-button-label-${content.length}`} className="tcrn-button__label">
        {value}
      </span>
    );
  };
  for (const child of Children.toArray(children)) {
    if (typeof child === "string" || typeof child === "number") {
      run.push(String(child));
      continue;
    }
    flush();
    content.push(child);
  }
  flush();
  return { content, text: texts.length > 0 ? texts.join(" ") : undefined };
}

function ignoreBusyPress(event: MouseEvent<HTMLButtonElement>) {
  // Also keeps a busy submit button from submitting its form a second time.
  event.preventDefault();
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = "md", className, disabledReason, loading = false, onClick, children, ...props },
  ref
) {
  const normalizedReason = props.disabled ? requiredText(disabledReason, "Action unavailable in this route") : undefined;
  const disabledReasonId = useId();
  const ariaDescribedBy = mergeIds(props["aria-describedby"], normalizedReason ? disabledReasonId : undefined);
  const { content, text } = labelledContent(children);
  return (
    <button
      {...props}
      ref={ref}
      title={normalizedReason ?? props.title ?? text}
      aria-busy={loading ? true : props["aria-busy"]}
      aria-describedby={ariaDescribedBy}
      data-disabled-reason={normalizedReason}
      className={cx("tcrn-button", `tcrn-button--${variant}`, `tcrn-button--${size}`, className)}
      onClick={loading ? ignoreBusyPress : onClick}
    >
      {loading ? <Icon name="loader-circle" className="tcrn-button__spinner" /> : null}
      {content}
      {normalizedReason ? (
        <span id={disabledReasonId} className="tcrn-sr-only">
          {normalizedReason}
        </span>
      ) : null}
    </button>
  );
});

export interface IconButtonProps extends ButtonProps {
  ariaLabel: string;
  icon?: ReactNode;
  iconName?: IconName;
}

export function IconButton({ ariaLabel, icon, iconName, children, ...props }: IconButtonProps) {
  // The icon follows the button size (sm 14, md 16, lg 20); while busy the loader takes its place.
  const renderedIcon = props.loading ? null : icon ?? (iconName ? <Icon name={iconName} size={props.size ?? "md"} /> : null);
  return (
    <Button {...props} aria-label={requiredText(ariaLabel, "Unnamed icon action")} className={cx("tcrn-icon-button", props.className)}>
      {renderedIcon}
      {children ? <span className="tcrn-icon-button__label">{children}</span> : null}
    </Button>
  );
}

export interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "primary" | "secondary" | "quiet";
  size?: Size;
}

export function LinkButton({ variant = "secondary", size = "md", className, title, children, ...props }: LinkButtonProps) {
  const { content, text } = labelledContent(children);
  return (
    <a
      {...props}
      title={title ?? text}
      className={cx("tcrn-link-button", `tcrn-link-button--${variant}`, `tcrn-link-button--${size}`, className)}
    >
      {content}
    </a>
  );
}
