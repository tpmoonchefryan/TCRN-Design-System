# @tcrn/ui-react

React primitives and compositional patterns for synthetic TCRN design-system
fixtures. Components accept normalized display props only and do not fetch data,
mutate state outside the component tree, decide product truth, or import product
APIs.

Version `3.0.0` is prepared under Apache License 2.0 as part of the accepted
TCRN Design System public package baseline.

## Component Library Public API

`componentLibraryPublicComponentNames` is the package-backed component readback
for the local component-library checkpoint. It names public components proven by
package contract receipts and Storybook consumption. `componentLibraryPublicUtilityNames`
names supporting public utilities, while `componentLibraryDeferredPrototypeNames`
names Storybook-only proof surfaces that must not be read as component-library
exports, package publication, or product adoption claims.

`ClipboardCopyButton` is a restricted package-backed button action. It requires
explicit native button activation, writes only through `navigator.clipboard.writeText`,
fails closed when the Clipboard API is unavailable, and reports only local copy
state enums through callbacks. Copied text must remain product-approved input and
is never returned by the component through callbacks or DOM attributes. A server-rendered
page can give the same construct the same behaviour with `mountStaticClipboardCopyButton`
(see Static HTML/CSS clipboard copy below); that bridge reads the value from the page, so
it is only for values the page may already expose.

`SettingChoice` is the package-backed value-selection contract. Three or more
values always render as `Select`; a binary choice renders as a native radio group
only when the consumer provides enough measured inline space for every label and
control. Each binary option must provide a finite positive `minInlineSize` measured
from the current font, locale, content, and container; the 112px package floor is a
CSS minimum, not a label measurement. Missing or invalid measurements select
`Select`. `SegmentedNav` remains navigation and must not be used as a setting value
control. `NumberInput` is the numeric-entry primitive; `Stepper` remains a process
position indicator and is not a numeric input substitute.
Per-option `disabled` values are preserved when the same `SettingChoice` changes
between its native radio and native Select branches.
The component owns the current value for the uncontrolled `defaultValue` form and
uses the supplied `value` for the controlled form; either mode retains a valid
selection when the branches swap. `onChange` reports actual user value changes
once and is silent during layout-only swaps or unchanged-value events.

`SettingsLayout` uses the actual content container to choose its density. Wrap
related setting rows in `SettingRowList`; it shares the label, control, and
tools tracks so rows with and without reset actions align. At a
960px frame it places compact local navigation beside one content column; below
that it stays one column. Its content stacks `SettingRow` label, control, and tools
below 720px. The layout keeps long native input values selectable and copyable and
does not hide configuration through overflow clipping. `SettingsHostSwitcher`
expresses the single-host-before-complete-form composition.

`MultiSelect` is the closed-set collection control. Use `presentation="dropdown"`
with a localized `emptySelectionLabel` for ordinary collection choice. The closed
Select-family trigger shows the current choices. The Menu-family list stays open
while values are added or removed using clicks or Space/Enter; arrows, Home/End and
letter keys move focus without changing values. Escape and outside clicks dismiss
the list; Tab returns to normal form navigation. Disabled choices cannot change.
The native form value submits each enabled choice once, preserves required
validation and external form association, and resets to `defaultValue` for an
uncontrolled field. A controlled `value` remains authoritative. Server-rendered
consumers use the same markup and `mountStaticMultiSelect`, which also owns the
shared body overlay boundary, placement, cleanup and summary updates.

For compatibility it defaults to the native
multiple-select; use `presentation="checkboxes"` with a localized
`clearSelectionLabel` when a visible checklist is needed. The checklist keeps
native checkbox keyboard and repeated form values, preserves disabled options,
and resets to `defaultValue` with its form. A required enabled checklist fails
native form validation until at least one enabled option is selected, including
when its option set is empty or all options are disabled. The group's disabled
state excludes it from validation and submission. Its unnamed validation control
adds no submitted value or tab stop; validated-submit focus goes to the first
enabled checkbox, or the group when no enabled option exists. Controlled values
remain authoritative on reset; uncontrolled values reset to their current defaults.
The `form` prop supports association with a form outside the checklist. Wrap grouped controls in
`<Field group>` to provide fieldset/legend semantics.
`SuggestInput` is the open-string control: its datalist suggestions are advisory
and never reject a value outside the suggestion list. `DictionaryTable` renders
one category description and requires a separate explanation for every machine
value; empty or unknown rendered content, category-description reuse, and exact
duplicate values/labels/descriptions are marked invalid rather than merged.
`resolveFieldValueControl` maps declared single/collection and closed/open metadata
to these controls and fails closed for unsupported open collections or closed
fields without options.

Client-rendered `Tooltip` and anchored `Popover` content move to the document
body when a trigger reference is supplied, compute a viewport-safe placement,
and reposition on resize and scroll. Tooltip content remains text-only and
non-interactive; longer or interactive explanations belong in `Popover`.

`OperationFeedback` keeps the short phase label in `StatusBadge` and renders
consumer-supplied operation/actor identity plus the complete receipt in a
keyboard-readable disclosure. Its `idle`, `loading`, `success`, and `error`
phases use the accurate short labels Idle, In progress, Completed, and Failed
in all five locales, preserve the real identity and update notification, and
reject a contradictory optional phase state; long ids, times, and reason codes
are wrapped details, never compact status labels.

`ContentScope` is the package-backed boundary for one independent content
region. Pass the consumer-owned `scope`, `dataSource`, phase, shown/total
counts, `filtered`, `hasContent`, and optional `staleContent` model, then pass
`EmptyState`, `StateSurface`, or `ErrorState` nodes for the corresponding
branches. Call `validateContentScope` before static emission or data binding;
it rejects missing sources, contradictory counts, and loading/error states
misrepresented as empty. Deterministically empty fragments, null, and nested
empty nodes are not treated as content; dynamic component output is marked
unknown until observed, while accessible intrinsic non-text content remains
valid. Sibling scopes are validated independently.

`evaluateConsumerEvidence` is a pure validator for product adoption evidence.
It requires one observed instance per required inventory entry, matching
requested/selected/panel surfaces and control identity, DOM-backed input/result
and status details, expected/submitted/serialized/readback values, post-operation
geometry, and separate `dpr`, `pinch-visual-viewport`, and `page-zoom`
measurements. Missing controls cannot be reclassified as not applicable without
an observed DOM count of zero, and `wouldFail` overrides are rejected.

For a bounded change, use targeted type, package DOM, token, consumption, or
browser checks during development. After all scoped work is fixed at one
candidate, run the parent `pnpm verify` once and retain
`pnpm public-docs:vercel-build` as its separate static-output check. Reuse a
receipt only when its source, environment, command, fixture, baseline, and
output identities match; a prior failure or missing identity invalidates it.

### Static HTML/CSS overlay migration

An HTML/CSS consumer that does not render a React tree can use the same boundary
with `tcrnComponentCss` and the DOM-only `mountStaticOverlayBoundary` bridge.
The server emits a stable trigger/layer pair; the bridge moves the layer
to `document.body`, applies `static-fixed` positioning, flips and clamps it to the
viewport, and repositions it on scroll/resize.

```html
<div class="settings-panel" style="overflow: hidden">
  <button id="help-trigger" aria-describedby="help-layer">Help</button>
  <span id="help-layer" class="tcrn-tooltip__content" role="tooltip" hidden>
    Supplemental text stays outside the clipping panel.
  </span>
</div>
<script type="module">
  import { mountStaticOverlayBoundary, tcrnComponentCss } from "@tcrn/ui-react";
  const style = document.createElement("style");
  style.textContent = tcrnComponentCss;
  document.head.append(style);
  mountStaticOverlayBoundary({
    trigger: document.getElementById("help-trigger"),
    layer: document.getElementById("help-layer"),
    kind: "tooltip",
    placement: "right"
  });
</script>
```

The trigger and layer must be paired by the consumer and the tooltip layer must
remain text-only. The bridge owns only the generic boundary, placement, and
dismissal mechanics; field/domain values and product route state remain consumer
inputs. A CSS-only server-positioned body sibling is a static fallback and must
not claim dynamic portal, edge, or focus behavior.

### Static HTML/CSS clipboard copy

A server-rendered page that does not run React can make the `ClipboardCopyButton`
construct work with the DOM-only `mountStaticClipboardCopyButton({ root, locale })`
bridge, which returns `{ destroy() }`. The root is the component's own markup: a native
button with `data-clipboard-copy-state`, its visible label as a direct text node and the
polite `role="status"` region. The value to copy is read from `data-clipboard-text`, so it
is present in the page: use the bridge only for values the page may already expose and
keep restricted values on the React component, which never writes them to the DOM.

```html
<button type="button" class="tcrn-button tcrn-button--secondary tcrn-button--md"
  aria-label="Copy trace ID" aria-describedby="trace-copy-status"
  data-clipboard-copy-state="idle" data-clipboard-text="trace-042">Copy trace ID<span
  id="trace-copy-status" aria-live="polite" role="status" class="tcrn-sr-only"></span></button>
<script type="module">
  import { mountStaticClipboardCopyButton } from "@tcrn/ui-react";
  mountStaticClipboardCopyButton({ root: document.querySelector("[data-clipboard-text]") });
</script>
```

An explicit click or keyboard activation writes the value with
`navigator.clipboard.writeText`; the button moves through idle, copying, copied, failed and
unsupported exactly as the component does, returns to idle after two seconds and keeps
focus. The five state labels come from the package's copy for the page's language;
`data-clipboard-idle-label`, `data-clipboard-copying-label`, `data-clipboard-copied-label`,
`data-clipboard-failed-label` and `data-clipboard-unsupported-label` override them per
button, and `data-clipboard-reset-delay-ms` changes the delay. An accessible name that
contains the value is replaced with the generic copy label, as the component does.

Static HTML/CSS consumers can use the same operation/content construction with
`tcrnComponentCss`: emit `.tcrn-operation-feedback` with a short
`.tcrn-badge`, labeled `.tcrn-operation-feedback__identity`, and a native
details button/region pair; update `data-operation-phase`, the short label,
identity values, and details together. For content, evaluate the model with
`validateContentScope`, emit one `.tcrn-content-scope` per source, and render
only its declared content/empty/loading/error branch. These static instructions
do not claim React state management, product persistence, or product adoption.

`PageHierarchy` takes an explicit `depth`: `two` renders `PageHeader`, parent-level
`SubNav`/`SectionTabs`, then lower content; `three` renders the same Header and
parent tabs, then the selected subpage's local navigation and content. The global
`ProductShell` topbar is external, and container width only adapts the third-level
region after depth has been chosen.

## Icon Library Boundary

`Icon` is the package-backed icon primitive. It wraps the curated Lucide icon set
through `@tcrn/ui-react`; Storybook and downstream consumers should import TCRN
icon primitives from this package rather than importing `lucide-react` directly.
`tcrnIconNames` is a stable public utility readback of the currently approved
names.

Lucide is recorded as the local icon source with an ISC license readback. This
does not turn general-purpose icons into TCRN brand marks: product logos,
mother-brand marks, and product lockups remain brand assets, not icon-library
substitutions.

## Storybook Shell Control Boundary

The static Storybook documentation shell and downstream product shells share a
registered package-backed product shell/effect boundary. Consumers should import
`ProductShell`, `ProductShellSearch`, `ShellThemeToggle`, `ShellLocaleMenu`,
`SideNavCollapseButton`, `ShellBrandLockup`, `ProductLockup`, and
`TcrnBrandMark` from `@tcrn/ui-react` instead of recreating reusable shell
controls, brand marks, layout effects, or navigation behavior locally.

- Theme switching stays a single icon-only circular button. It reflects the
  current light/dark mode and toggles only on explicit activation.
- Theme changes use a whole-page shell transition. Sidebar, header, and content
  must not darken as separate independent regions.
- Language selection uses a globe trigger plus the current locale name in that
  locale. Compact controls must not use long bilingual labels.
- Shell search may be compact at rest and expand on focus, then collapse on
  blur. Shortcut labels belong only to shell search with real focus/result
  behavior.
- The AI consumption contract remains in the Proof story and static JSON
  artifact. It is not a primary top-bar control for human readers.

`useProductShellController` is the public utility for bounded state/effect glue:
collapsed navigation state, theme, locale menu open state, and compact/focused
search state may be route-owned through DS-defined props and callbacks, while
layout, focus treatment, reduced-motion behavior, and light/dark token posture
remain owned by the package boundary. Product consumers may provide IA/data,
route labels, locale labels, search records, content slots, and callbacks only
through that boundary and must still prove product-specific routes separately.

Consumers should pass the returned `productShellControlProps`,
`productShellSearchProps`, `shellLocaleMenuProps`, `shellThemeToggleProps`, and
`sideNavCollapseButtonProps` bundles, or use the equivalent ProductShell
semantic callbacks directly: `onCollapsedChange`, `onThemeChange`,
`onLocaleMenuOpenChange`, `onLocaleChange`, `onSearchQueryChange`,
`onSearchExpandedChange`, `onSearchDismiss`, and `onSearchResultActivate`.
Wrapper-level event delegation around rendered shell controls is not a
package-backed substitute for those APIs.

A server-rendered product parses the request's `Cookie` header with the exported
`readPreferenceCookieValues` and passes the three narrowed values as
`requestPreferences`. The raw header stays outside the package: it carries every
cookie the product's requests hold, and the shell governs only theme, locale, and
collapse. The controller writes each stored preference to both a
cookie and the client store, and reads whichever store can answer where it runs,
so the render that produces the first paint already carries the reader's theme,
locale, and collapse state instead of correcting to them after hydration. A
client-only product omits the prop and behaves as before. An explicit URL query
still outranks a stored preference: only the product knows its own URL
vocabulary, so it resolves that itself and passes the winner as `initialTheme` or
`initialLocale`.

`Surface` accepts optional `heading` and `actions` slots. Its shared header wraps
inside the card, including nested narrow cards and long heading text. Structured
`OperationFeedback` details preserve preformatted content while wrapping long
paths and hashes; identity labels and values remain inside their assigned tracks.

`DefinitionList` stacks at its 760px mother-width boundary as well as the narrow
viewport fallback. Terms and definitions wrap in nested cards without a fixed
consumer term-column minimum.
