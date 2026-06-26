import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef, useId } from "react";
import { Icon, type IconName } from "../Icon/index.js";
import { cx, mergeIds, requiredText } from "../../utils.js";

type Size = "sm" | "md";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "quiet" | "danger";
  size?: Size;
  disabledReason?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = "md", className, disabledReason, children, ...props },
  ref
) {
  const normalizedReason = props.disabled ? requiredText(disabledReason, "Action unavailable in this route") : undefined;
  const disabledReasonId = useId();
  const ariaDescribedBy = mergeIds(props["aria-describedby"], normalizedReason ? disabledReasonId : undefined);
  return (
    <button
      {...props}
      ref={ref}
      title={normalizedReason ?? props.title}
      aria-describedby={ariaDescribedBy}
      data-disabled-reason={normalizedReason}
      className={cx("tcrn-button", `tcrn-button--${variant}`, `tcrn-button--${size}`, className)}
    >
      {children}
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
  const renderedIcon = icon ?? (iconName ? <Icon name={iconName} /> : null);
  return (
    <Button {...props} aria-label={requiredText(ariaLabel, "Unnamed icon action")} className={cx("tcrn-icon-button", props.className)}>
      {renderedIcon}
      {children ? <span className="tcrn-icon-button__label">{children}</span> : null}
    </Button>
  );
}

export interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "primary" | "secondary" | "quiet";
}

export function LinkButton({ variant = "secondary", className, ...props }: LinkButtonProps) {
  return <a {...props} className={cx("tcrn-link-button", `tcrn-link-button--${variant}`, className)} />;
}
