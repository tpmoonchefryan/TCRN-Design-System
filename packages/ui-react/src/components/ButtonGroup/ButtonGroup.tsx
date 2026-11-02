import type { HTMLAttributes, ReactNode } from "react";
import { Children, cloneElement, Fragment, forwardRef, isValidElement } from "react";
import { Button, IconButton, type ButtonProps } from "../Button/index.js";
import { cx, requiredText } from "../../utils.js";

export interface ButtonGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "aria-label" | "role"> {
  /** Names the group: role="group" without a name tells a screen reader nothing about what the buttons share. */
  ariaLabel: string;
  /** "quiet" drops the shared outline and uses the lighter separator, for a group of quiet buttons. */
  variant?: "secondary" | "quiet";
  /** The group owns uniform geometry; this size overrides individual member sizes. */
  size?: ButtonProps["size"];
  children?: ReactNode;
}

/**
 * Attached buttons that act on one subject: one shared outline, a 1px separator between
 * neighbours, and the focused member raised above the others so its ring is drawn whole.
 * A single-choice group marks the chosen button with aria-pressed; the group does not hold
 * the choice itself.
 */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  { ariaLabel, size = "md", variant = "secondary", className, children, ...props },
  ref
) {
  const items = Children.toArray(children);
  if (items.length < 2 || items.length > 5) throw new TypeError("ButtonGroup requires two to five direct Button or IconButton actions");
  const actions = items.map(item => {
    if (!isValidElement<ButtonProps>(item) || (item.type !== Button && item.type !== IconButton)) throw new TypeError("ButtonGroup children must be direct Button or IconButton actions");
    if (item.props.variant === "primary" || item.props.variant === "danger") throw new TypeError("ButtonGroup supports secondary or quiet actions, without primary or danger members");
    // Clone only family appearance. Keys, refs, names, handlers, disabled/loading and
    // aria-pressed stay on the child; the group never owns selection or activation.
    return cloneElement(item, { size, variant });
  });
  return (
    <div
      {...props}
      ref={ref}
      data-button-group-size={size}
      role="group"
      aria-label={requiredText(ariaLabel, "Unnamed button group")}
      className={cx("tcrn-button-group", variant === "quiet" && "tcrn-button-group--quiet", className)}
    >
      {actions.map((item, index) => (
        <Fragment key={isValidElement(item) && item.key !== null ? item.key : index}>
          {index > 0 ? <span className="tcrn-button-group__separator" aria-hidden="true" /> : null}
          {item}
        </Fragment>
      ))}
    </div>
  );
});
