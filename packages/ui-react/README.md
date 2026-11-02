# @tcrn/ui-react

Version `4.0.0` is prepared as a local package candidate; this is distinct from published Sites version 1.
The current visual documentation consumes `@tcrn/ui-react/approved`: only the explicitly published Sites v1 families and top-band shell. Other root exports remain engineering APIs and are not automatically a Storybook design catalogue. The current stylesheet contains the published families and their scoped shell roles; retired full-family styles and the retired navigation stylesheet are not emitted.

Brand rendering requires one of four registered product keys: `tms`, `einzbern`, `mana-orchestrate`, `design-system`. The SVG geometry, mono and tile renditions and all five taglines are extracted from the real published Brand board. There is no default mother image, free suffix/URL fallback or implied AOS identity. Consumers that previously used these removed inputs must wait for an actually published product asset rather than fabricate a replacement.

The package candidate is 4.0.0; the design source is Sites version 1, commit `a643d4cfcd239f6f81b1715ded6a63caead9d619`. K1/K5 are unresolved source conflicts. Machine verification and Owner visual acceptance are distinct. See [source and generation order](../../docs/design/README.md).
