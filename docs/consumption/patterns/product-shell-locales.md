# Product shell locale and complete copy contract

This is the local producer candidate API for a product whose locale identifiers or
languages differ from the five built-in DS locales. The pinned standard and the
five built-in dictionaries remain unchanged. A product locale definition supplies
complete shell copy; it does not add a sixth built-in language to every DS component.
Real consumers use this capability after the applicable authority and producer
publication dependencies are satisfied.

`@tcrn/ui-react/approved` exports `ProductShellLocaleDefinition`,
`ProductShellCopy`, `ProductShellChromeCopy`, `TcrnShellCopy`,
`ShellLocaleOption`, the generic controller/request preference types,
`productShellCopyFor`, `readPreferenceCookieValues` and the existing shell/controller.
These are support types and helpers for the existing shell entry, not additional
formal component entries.

## Define the product's actual locale domain

A definition contains `locale` (the exact product id), `lang` (its BCP 47 language
tag), and `copy`. `copy.shell` contains every `TcrnShellCopy` field;
`copy.chrome` contains every `ProductShellChromeCopy` field; `copy.productTagline`
returns the translation for the registered product logo being rendered. Supply
all fields in the target language. The type requires complete dictionaries and
preserves formatter functions for names, unread counts and landmark names.
The tagline function must cover the product ids used by that shell; unsupported
products should fail explicitly instead of returning a different language.

For TMS the explicit definitions are `en → en`, `zh_HANS → zh-Hans`,
`zh_HANT → zh-Hant`, `ja → ja`, `ko → ko`, and `fr → fr`. Reuse
`productShellCopyFor("zh-CN")` for `zh_HANS`; provide the full product-owned
Traditional Chinese dictionary for `zh_HANT`. The built-in copy helper accepts
only a built-in DS locale. Neither `resolveTcrnLocale("zh_HANT")` nor a partial
label override implements the product locale.

```tsx
import {
  ProductShell,
  productShellCopyFor,
  readPreferenceCookieValues,
  useProductShellController,
  type ProductShellLocaleDefinition
} from "@tcrn/ui-react/approved";

// traditionalChineseCopy is a complete ProductShellCopy owned by the product.
const definitions = [
  { locale: "en", lang: "en", copy: productShellCopyFor("en") },
  { locale: "zh_HANS", lang: "zh-Hans", copy: productShellCopyFor("zh-CN") },
  { locale: "zh_HANT", lang: "zh-Hant", copy: traditionalChineseCopy },
  { locale: "ja", lang: "ja", copy: productShellCopyFor("ja") },
  { locale: "ko", lang: "ko", copy: productShellCopyFor("ko") },
  { locale: "fr", lang: "fr", copy: productShellCopyFor("fr") }
] as const satisfies readonly ProductShellLocaleDefinition[];

// In the product's request handler, pass only parsed preferences to the client.
const preferences = readPreferenceCookieValues(cookieHeader, {
  localeKey: productLocaleCookieKey,
  localeDefinitions: definitions
});

const controller = useProductShellController({
  initialLocale: "zh_HANT",
  localeDefinitions: definitions,
  requestPreferences: preferences,
  onLocaleChange: productSetLocale
});

<ProductShell
  {...shellContentProps}
  {...controller.productShellControlProps}
  locales={definitions.map(({ locale, lang }) => ({
    locale, lang, nativeName: productNativeNames[locale]
  }))}
/>;
```

Keep definitions stable for the mounted controller. It seeds state on mount;
retire and remount it when the authenticated user, tenant, product or their
preference domain changes. Storage keys and server adapters remain product-owned;
omitting storage keys disables local persistence. The existing pins contract in
`shell-preferences-and-navigation.md` still applies. A locale callback retains
`zh_HANT` exactly, including when writing a configured browser preference. It is
a synchronous state notification, not a server acknowledgement.

With definitions supplied, initial/request values and `setLocale` resolve only
exact configured ids. An unconfigured initial value or setter argument throws
before mutation. A stale unconfigured browser value is ignored in favour of the
valid request/initial value. The cookie helper accepts only configured ids and
returns `undefined` for absent, invalid or malformed values. Without definitions,
the controller and cookie helper preserve their original five-language behavior
and their default `TcrnLocale` types. Product locale type inference comes from the
supplied definitions, including the exact `zh_HANT` id.

## Scope and rendering

`productShellControlProps` and `productShellStateProps` carry the selected
`localeDefinition`. When wiring a controlled shell directly, pass the matching
`currentLocale` and `localeDefinition` together; a mismatch throws. The shell sets
its subtree's `lang` to the definition's BCP 47 tag and retains the exact product
id in `data-current-locale`. It does not rewrite the document's language or mutate
another shell's locale.

The definition reaches the actual brand button, pinned strip, full menu and phone
sheet, cascade/drop-down rows and pin actions, search field/results/empty state,
account/products/theme/language controls, page-header breadcrumb and registered
brand lockup/tagline. Components inside that shell inherit its copy unless an
explicit different locale is supplied. Every nested `ProductShell` owns its own
scope, including a shell using only the five built-in languages. A separate
English documentation shell therefore cannot turn a nested TMS shell into English,
and a nested legacy shell cannot inherit a Traditional Chinese dictionary by accident.
The controller's standalone locale-menu, theme-toggle and search props also carry
the labels derived from the selected complete copy.

Business navigation, page titles, search records, account names, route builders,
number/date formatting and locale-native names remain product-owned. Give a
`ShellLocaleOption.lang` when its `locale` is a product id such as `zh_HANT`.
Other DS families retain their own locale contracts; this shell API does not
translate arbitrary business content or declare a new global DS locale.

The published font tokens and assets are unchanged. Load the package token and
font CSS as usual; the BCP 47 subtree tag is semantic language metadata, not a font
override. Browser evidence must identify the actual fonts/glyphs used for the
consumer's visible text. The local fixture verifies the supplied Traditional
Chinese text with the existing packaged fonts; it does not claim a new font
family, locale-specific typeface standard, Owner visual acceptance or publication.
