import type { HTMLAttributes } from "react";
import { cx } from "../../utils.js";

export function Text({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} className={cx("tcrn-text", className)} />;
}

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4;
}

export function Heading({ level = 2, className, ...props }: HeadingProps) {
  const Tag = `h${level}` as const;
  return <Tag {...props} className={cx("tcrn-heading", `tcrn-heading--${level}`, className)} />;
}
