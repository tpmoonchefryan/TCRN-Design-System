# @tcrn/ui-copy-state

Typed display-state presenters and no-overclaim helpers over normalized
product-provided inputs. This package renders display language; it does not
decide whether a product claim is true.

Version `1.0.0` is prepared under Apache License 2.0 as part of the accepted
TCRN Design System public package baseline.

## I18n contract

Supported locales are fixed at package level:

- `zh-CN` Simplified Chinese
- `en` English
- `ja` Japanese
- `ko` Korean
- `fr` French

`en` is the default and fallback locale. Copy-state labels and descriptions
must be localized for every supported locale before a new state is added.
Caller-provided labels are sanitized so raw enum-style labels such as
`external_proof_required` do not leak into visible UI.
