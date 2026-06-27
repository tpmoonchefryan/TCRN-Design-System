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

export interface HighlightProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  text: string;
  query?: string;
  caseSensitive?: boolean;
  markClassName?: string;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function Highlight({ text, query, caseSensitive = false, className, markClassName, ...props }: HighlightProps) {
  const normalizedQuery = query?.trim();
  if (!normalizedQuery) {
    return <span {...props} className={cx("tcrn-highlight-text", className)}>{text}</span>;
  }

  const flags = caseSensitive ? "g" : "gi";
  const matcher = new RegExp(`(${escapeRegExp(normalizedQuery)})`, flags);
  const parts = text.split(matcher);

  return (
    <span {...props} className={cx("tcrn-highlight-text", className)}>
      {parts.map((part, index) => {
        if (!part) {
          return null;
        }
        const isMatch = caseSensitive ? part === normalizedQuery : part.toLowerCase() === normalizedQuery.toLowerCase();
        return isMatch ? (
          <mark key={`${part}-${index}`} className={cx("tcrn-highlight-mark", markClassName)}>
            {part}
          </mark>
        ) : (
          part
        );
      })}
    </span>
  );
}
