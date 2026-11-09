# @tcrn/ui-tokens

Version `4.0.0` is prepared as a local package candidate; the design source is published Sites version 2, commit `e76b7272d98c0359a57c42d49bf70d64e5b4c2ad`.
The current registry is an engineering projection of the pinned published Sites v2 source. It emits the 39 themed and 27 fixed source values plus explicitly mapped type and shell roles from the eight boards. It does not emit the previous compatibility token table, sidebar tokens, press scale or an invented interactive suffix color.

Import `@tcrn/ui-tokens/tokens.css` and `@tcrn/ui-tokens/fonts.css` for the current self-hosted assets. Source generation is integration work; see [the source contract](../../docs/design/README.md). The generated source arrays, current CSS and font manifest must come from the same batch before consuming them.

The published original TMS and Design System suffix text colors remain a known source conflict with the 4.5 text threshold. No candidate-only night or interaction color is declared official. Font byte provenance, weights, Unicode ranges and distribution notices are described in [FONT-LICENSES.md](FONT-LICENSES.md).
