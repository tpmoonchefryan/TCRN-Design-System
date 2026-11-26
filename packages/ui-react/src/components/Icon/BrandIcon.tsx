import type { SVGProps } from "react";
import { tcrnTokens } from "@tcrn/ui-tokens";
import { cx } from "../../utils.js";

export interface TcrnBrandIconDefinition {
  readonly viewBox: string;
  readonly paths: readonly string[];
}

/**
 * External platform and ecosystem brand icons kept separate from the closed 38-icon
 * UI stroke roster (`Icon` / `icon-paths.generated.ts`). These glyphs are filled
 * monochrome marks drawn on their own viewBox and tinted via `currentColor`.
 */
export const tcrnBrandIcons = Object.freeze({
  github: Object.freeze({
    viewBox: "0 0 16 16",
    paths: Object.freeze([
      "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
    ])
  })
} as const satisfies Record<string, TcrnBrandIconDefinition>);

export const tcrnBrandIconNames = Object.freeze(Object.keys(tcrnBrandIcons) as (keyof typeof tcrnBrandIcons)[]);
export type BrandIconName = keyof typeof tcrnBrandIcons;
export type BrandIconSize = "sm" | "md" | "lg" | number;

function iconSizeTokenPixels(variable: string): number {
  const token = tcrnTokens.find((entry) => entry.variable === variable);
  const pixels = token && /^\d+(?:\.\d+)?px$/.test(token.value) ? Number.parseFloat(token.value) : Number.NaN;
  if (!Number.isFinite(pixels)) {
    throw new Error(`BrandIcon size token ${variable} is missing or is not a pixel length.`);
  }
  return pixels;
}

const brandIconSizePixels: Readonly<Record<"sm" | "md" | "lg", number>> = {
  sm: iconSizeTokenPixels("--tcrn-icon-size-sm"),
  md: iconSizeTokenPixels("--tcrn-icon-size-md"),
  lg: iconSizeTokenPixels("--tcrn-icon-size-lg")
};

export interface BrandIconProps extends Omit<SVGProps<SVGSVGElement>, "name" | "children"> {
  name: BrandIconName;
  decorative?: boolean;
  size?: BrandIconSize;
  title?: string;
}

export function BrandIcon({ name, decorative = true, size = "md", title, className, ...props }: BrandIconProps) {
  const definition = tcrnBrandIcons[name];
  if (!definition) {
    throw new Error(`BrandIcon: unregistered brand icon "${String(name)}"`);
  }
  const accessibleName = props["aria-label"] ?? title;
  const isDecorative = decorative && !accessibleName;
  const pixels = typeof size === "number" ? size : brandIconSizePixels[size];
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={pixels}
      height={pixels}
      {...props}
      viewBox={definition.viewBox}
      fill="currentColor"
      stroke="none"
      aria-hidden={isDecorative ? true : props["aria-hidden"]}
      aria-label={isDecorative ? undefined : accessibleName}
      role={isDecorative ? props.role : props.role ?? "img"}
      data-brand-icon-name={name}
      className={cx("tcrn-brand-icon", className)}
      focusable="false"
    >
      {definition.paths.map((d, index) => (
        <path key={index} d={d} />
      ))}
    </svg>
  );
}
