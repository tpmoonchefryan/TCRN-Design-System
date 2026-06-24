# @tcrn/ui-tokens

Semantic design tokens for TCRN UI surfaces. CSS variables are the canonical
runtime contract; generated framework adapters are deferred.

Version `1.0.0` is prepared under Apache License 2.0 as part of the accepted
TCRN Design System public package baseline.

## Theme contract

Light mode is the default `:root` token set. Dark mode is an override applied
with `data-tcrn-theme="dark"` on a root or scoped container.

Dark mode may override existing semantic tokens only. It must not create
component-specific colors or separate component forks.
