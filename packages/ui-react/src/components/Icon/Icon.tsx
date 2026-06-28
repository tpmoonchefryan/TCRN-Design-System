import type { SVGProps } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Database,
  ExternalLink,
  Globe2,
  Home,
  Info,
  LoaderCircle,
  Menu,
  Moon,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  Sun,
  X
} from "lucide-react";
import { cx } from "../../utils.js";

export const tcrnIconNames = [
  "alert-triangle",
  "arrow-left",
  "arrow-right",
  "book-open",
  "check",
  "chevron-down",
  "chevron-left",
  "chevron-right",
  "database",
  "external-link",
  "globe-2",
  "home",
  "info",
  "loader-circle",
  "menu",
  "moon",
  "package",
  "panel-left-close",
  "panel-left-open",
  "search",
  "settings",
  "sun",
  "x"
] as const;

export type IconName = (typeof tcrnIconNames)[number];
type IconSize = "sm" | "md" | "lg" | number;

const tcrnIconRegistry: Record<IconName, LucideIcon> = {
  "alert-triangle": AlertTriangle,
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  "book-open": BookOpen,
  check: Check,
  "chevron-down": ChevronDown,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  database: Database,
  "external-link": ExternalLink,
  "globe-2": Globe2,
  home: Home,
  info: Info,
  "loader-circle": LoaderCircle,
  menu: Menu,
  moon: Moon,
  package: Package,
  "panel-left-close": PanelLeftClose,
  "panel-left-open": PanelLeftOpen,
  search: Search,
  settings: Settings,
  sun: Sun,
  x: X
};

function iconSizeToPixels(size: IconSize): number {
  if (typeof size === "number") {
    return size;
  }
  return size === "sm" ? 14 : size === "lg" ? 20 : 16;
}

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  decorative?: boolean;
  size?: IconSize;
  title?: string;
}

export function Icon({ name, decorative = true, size = "md", title, className, ...props }: IconProps) {
  const SvgIcon = tcrnIconRegistry[name];
  const accessibleName = props["aria-label"] ?? title;
  const isDecorative = decorative && !accessibleName;
  return (
    <SvgIcon
      {...props}
      aria-hidden={isDecorative ? true : props["aria-hidden"]}
      aria-label={isDecorative ? undefined : accessibleName}
      role={isDecorative ? props.role : props.role ?? "img"}
      data-icon-name={name}
      className={cx("tcrn-icon", className)}
      focusable="false"
      size={iconSizeToPixels(size)}
      strokeWidth={props.strokeWidth ?? 2}
    />
  );
}
