import { createElement, type ReactElement, type SVGProps } from "react";
import { tcrnTokens } from "@tcrn/ui-tokens";
import { cx } from "../../utils.js";
import {
  tcrnIconPathNames,
  tcrnIconPaths,
  tcrnIconStrokeWidth,
  tcrnIconViewBox,
  type TcrnIconPathName
} from "./icon-paths.generated.js";

// The icon roster is docs/design/gplus-2026-10/contract/icons.json. Names, the 20 grid,
// the stroke width and every path arrive through icon-paths.generated.ts, which only
// scripts/contract-generate.mjs writes, so this file draws nothing by hand: adding or
// redrawing an icon is a contract change and a regenerate.

/** The closed roster of icon names, in contract order. */
export const tcrnIconNames = tcrnIconPathNames;

export type IconName = TcrnIconPathName;
type IconSize = "sm" | "md" | "lg" | number;

// The three named steps are the icon size tokens; the numbers are read from the token
// table rather than restated, so a token change moves every icon with it.
function iconSizeTokenPixels(variable: string): number {
  const token = tcrnTokens.find((entry) => entry.variable === variable);
  const pixels = token && /^\d+(?:\.\d+)?px$/.test(token.value) ? Number.parseFloat(token.value) : Number.NaN;
  if (!Number.isFinite(pixels)) {
    throw new Error(`Icon size token ${variable} is missing or is not a pixel length.`);
  }
  return pixels;
}

const tcrnIconSizePixels: Readonly<Record<"sm" | "md" | "lg", number>> = {
  sm: iconSizeTokenPixels("--tcrn-icon-size-sm"),
  md: iconSizeTokenPixels("--tcrn-icon-size-md"),
  lg: iconSizeTokenPixels("--tcrn-icon-size-lg")
};

function iconSizeToPixels(size: IconSize): number {
  return typeof size === "number" ? size : tcrnIconSizePixels[size];
}

// The generated bodies are SVG child markup in a closed grammar: self-closing path,
// circle, ellipse and rect elements whose attributes keep the same names in React.
// Reading them into elements (instead of injecting the markup) lets every child carry
// vector-effect, which SVG does not inherit, and makes an unexpected element or
// attribute in a future contract fail loudly here instead of rendering half an icon.
type IconChildTag = "path" | "circle" | "ellipse" | "rect";

interface IconChild {
  readonly tag: IconChildTag;
  readonly attributes: Readonly<Record<string, string>>;
}

const iconChildPattern = /<(path|circle|ellipse|rect)((?:\s+[a-z]+="[^"]*")*)\s*\/>/g;
const iconAttributePattern = /\s+([a-z]+)="([^"]*)"/g;
const iconChildAttributeNames = new Set(["d", "cx", "cy", "r", "rx", "ry", "x", "y", "width", "height"]);
const iconChildCache = new Map<IconName, readonly IconChild[]>();

function readIconChildren(name: IconName): readonly IconChild[] {
  const cached = iconChildCache.get(name);
  if (cached) {
    return cached;
  }
  const body = tcrnIconPaths[name];
  const children: IconChild[] = [];
  let consumed = "";
  for (const match of body.matchAll(iconChildPattern)) {
    const attributes: Record<string, string> = {};
    for (const [, attributeName, value] of match[2].matchAll(iconAttributePattern)) {
      if (!iconChildAttributeNames.has(attributeName)) {
        throw new Error(`Icon "${name}" uses the attribute "${attributeName}", which the icon contract does not allow.`);
      }
      attributes[attributeName] = value;
    }
    children.push({ tag: match[1] as IconChildTag, attributes });
    consumed += match[0];
  }
  if (children.length === 0 || consumed !== body) {
    throw new Error(`Icon "${name}" has path markup outside the icon contract grammar.`);
  }
  iconChildCache.set(name, children);
  return children;
}

function renderIconChildren(name: IconName): ReactElement[] {
  return readIconChildren(name).map((child, index) =>
    createElement(child.tag, { key: index, vectorEffect: "non-scaling-stroke", ...child.attributes })
  );
}

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name" | "strokeWidth"> {
  name: IconName;
  decorative?: boolean;
  size?: IconSize;
  title?: string;
}

export function Icon({ name, decorative = true, size = "md", title, className, children, ...props }: IconProps) {
  const accessibleName = props["aria-label"] ?? title;
  const isDecorative = decorative && !accessibleName;
  const pixels = iconSizeToPixels(size);
  // The grid, stroke, caps and colour are the roster contract, so they sit after the
  // spread and a caller cannot thin or thicken one icon away from the rest.
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={pixels}
      height={pixels}
      {...props}
      viewBox={tcrnIconViewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={tcrnIconStrokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={isDecorative ? true : props["aria-hidden"]}
      aria-label={isDecorative ? undefined : accessibleName}
      role={isDecorative ? props.role : props.role ?? "img"}
      data-icon-name={name}
      className={cx("tcrn-icon", className)}
      focusable="false"
    >
      {renderIconChildren(name)}
      {children}
    </svg>
  );
}
