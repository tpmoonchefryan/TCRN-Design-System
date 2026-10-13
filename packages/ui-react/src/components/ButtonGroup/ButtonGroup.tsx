import type { HTMLAttributes, ReactNode } from "react";
import { Children, Fragment, forwardRef, isValidElement } from "react";
import { cx, requiredText } from "../../utils.js";

export interface ButtonGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "aria-label" | "role"> {
  /** Names the group: role="group" without a name tells a screen reader nothing about what the buttons share. */
  ariaLabel: string;
  /** "quiet" drops the shared outline and uses the lighter separator, for a group of quiet buttons. */
  variant?: "secondary" | "quiet";
  children?: ReactNode;
}

/**
 * Attached buttons that act on one subject: one shared outline, a 1px separator between
 * neighbours, and the focused member raised above the others so its ring is drawn whole.
 * A single-choice group marks the chosen button with aria-pressed; the group does not hold
 * the choice itself.
 */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  { ariaLabel, variant = "secondary", className, children, ...props },
  ref
) {
  const items = Children.toArray(children);
  return (
    <div
      {...props}
      ref={ref}
      role="group"
      aria-label={requiredText(ariaLabel, "Unnamed button group")}
      className={cx("tcrn-button-group", variant === "quiet" && "tcrn-button-group--quiet", className)}
    >
      {items.map((item, index) => (
        <Fragment key={isValidElement(item) && item.key !== null ? item.key : index}>
          {index > 0 ? <span className="tcrn-button-group__separator" aria-hidden="true" /> : null}
          {item}
        </Fragment>
      ))}
    </div>
  );
});
