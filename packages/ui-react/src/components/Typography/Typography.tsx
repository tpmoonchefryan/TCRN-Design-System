import { isValidElement, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "../../utils.js";

/**
 * The plain text a title tooltip should repeat: the text content of the children, the way the
 * DOM would report it, or undefined when there is none.
 */
function textContentOf(node: ReactNode): string | undefined {
  const text = collectText(node).trim();
  return text === "" ? undefined : text;
}

function collectText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") {
    return "";
  }
  if (typeof node === "string" || typeof node === "number" || typeof node === "bigint") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(collectText).join("");
  }
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return collectText(node.props.children);
  }
  return "";
}

/** Text size: body 13/20 (the default), reading 14/22, meta 12/16 and caption 11/16. */
export type TextSize = "body" | "reading" | "meta" | "caption";
/** Text tone: default keeps the secondary ink; strong adds weight on the primary ink. */
export type TextTone = "default" | "strong";
/**
 * Text variant: numeral sets figures in the serif at 300 with tabular digits (put a unit in a
 * small element inside it); caps is the spaced uppercase label (put a numbering prefix in a b
 * element inside it). Both are single-line roles: they never wrap, and they carry a title.
 */
export type TextVariant = "numeral" | "caps";

export interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  /** Omitted, the text keeps the default 13/20 size. */
  size?: TextSize;
  /** Omitted, the text keeps the default secondary ink. */
  tone?: TextTone;
  /** Omitted, the text is a wrapping paragraph. */
  variant?: TextVariant;
}

export function Text({ size, tone, variant, title, className, children, ...props }: TextProps) {
  return (
    <p
      {...props}
      title={title ?? (variant ? textContentOf(children) : undefined)}
      className={cx(
        "tcrn-text",
        size && `tcrn-text--${size}`,
        tone === "strong" && "tcrn-text--strong",
        variant && `tcrn-text--${variant}`,
        className
      )}
    >
      {children}
    </p>
  );
}

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4;
  visualLevel?: 1 | 2 | 3 | 4;
}

/**
 * A heading stays on one line at every level: text that does not fit ends in an ellipsis, and
 * the heading carries its text as a title unless one is given.
 */
export function Heading({ level = 2, visualLevel = level, title, className, children, ...props }: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag {...props} title={title ?? textContentOf(children)} className={cx("tcrn-heading", `tcrn-heading--${visualLevel}`, className)}>
      {children}
    </Tag>
  );
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
