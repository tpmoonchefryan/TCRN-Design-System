import type { ReactElement } from "react";
import { resolveTcrnLocale, type TcrnLocale } from "@tcrn/ui-copy-state";

export function cx(...classes: Array<string | undefined | false>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Which language a component's built-in strings are said in.
 *
 * Three steps, in order: an explicit `locale` prop, then the language the
 * document declares, then the package default. Reading the document is the
 * middle step because a component carrying its own strings sits inside a page
 * that already states its language, and without that step a caller who forgets
 * the prop silently ships English into a translated page.
 *
 * This lives in `utils` rather than in one component file because three
 * components now need it, and three private copies of one resolver is how they
 * drift into answering the same question differently.
 */
export function resolveDocumentLocale(locale: TcrnLocale | string | undefined): TcrnLocale {
  if (locale !== undefined) return resolveTcrnLocale(locale);
  if (typeof document === "undefined") return resolveTcrnLocale(undefined);
  return resolveTcrnLocale(
    document.documentElement.getAttribute("data-current-locale")
    ?? document.documentElement.lang);
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
