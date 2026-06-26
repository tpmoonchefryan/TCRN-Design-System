import type { ReactElement } from "react";

export function cx(...classes: Array<string | undefined | false>): string {
  return classes.filter(Boolean).join(" ");
}

export function requiredText(value: string | undefined, fallback: string): string {
  const normalized = value?.trim();
  return normalized ? normalized : fallback;
}

export function mergeIds(...ids: Array<string | undefined>): string | undefined {
  const merged = ids.flatMap((id) => id?.split(/\s+/).filter(Boolean) ?? []);
  return merged.length > 0 ? Array.from(new Set(merged)).join(" ") : undefined;
}

export function childPropsOf(element: ReactElement<Record<string, unknown>>): Record<string, unknown> {
  return element.props as Record<string, unknown>;
}
