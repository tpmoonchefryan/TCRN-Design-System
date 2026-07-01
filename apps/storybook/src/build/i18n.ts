import { tcrnDefaultLocale, tcrnFallbackLocale, type TcrnLocale } from "@tcrn/ui-copy-state";
import { storybookContentText, storybookLocaleText } from "./locales/index.js";
export { storybookContentText, storybookLocaleText } from "./locales/index.js";

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "\"":
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

export function localeText(key: string, locale: TcrnLocale = tcrnDefaultLocale): string {
  return storybookLocaleText[locale]?.[key]
    ?? storybookContentText[key]?.[locale]
    ?? storybookLocaleText[tcrnFallbackLocale][key]
    ?? storybookContentText[key]?.[tcrnFallbackLocale]
    ?? key;
}

export function i18nText(key: string): string {
  return `<span data-i18n="${escapeHtml(key)}">${escapeHtml(localeText(key))}</span>`;
}
