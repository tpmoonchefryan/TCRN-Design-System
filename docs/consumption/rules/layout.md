# Component and parent layout responsibilities

This producer rule records the Owner's content-width requirement from
`minutes:8631ab5a9252dbab2db84fda#D2`. It adds executable consumption guidance;
it changes neither the pinned Site v2 identity nor any formal token value.

Button, LinkButton, ClipboardCopyButton and ButtonGroup use content width. Text,
icons, existing token gaps and the two token insets determine the width. A parent
must not implicitly stretch these actions through grid/flex alignment, nor impose
a width, inline-size, min-width or min-inline-size on them. Use a grid with
`justify-items: start` for action-only examples, or align just action children in
a mixed field grid. Do not apply that rule to every component: fields fill their
assigned containers, icons and unlabelled IconButton retain token-defined squares.
A labelled IconButton follows content. ButtonGroup encloses its members and joins
in both secondary and quiet variants; it is not a full-width field container.

The shared `component-layout.ts` metadata in each component shard defines that
component's content/fill/fixed/mixed responsibility and implementation owner.
The parent provides available width and a usable narrow layout. Action text
ellipsizes at its available width; never shrink type, padding or icon tokens to
force a fit. On narrow ButtonGroup rows the members shrink and ellipsize inside
the joined frame. Preserve title/accessibility text. Field values do not decide
field width; the native select/date/suggestion UI still needs browser testing.

A self-contained action example is:

```tsx
import { Button, ButtonGroup, tcrnComponentCss } from "@tcrn/ui-react/approved";
import "@tcrn/ui-tokens/tokens.css";
import "@tcrn/ui-tokens/fonts.css";

export function Actions() {
  return <><style>{tcrnComponentCss}</style><div style={{ display: "grid", justifyItems: "start", gap: "var(--tcrn-space-2)" }}>
    <Button>Save changes</Button>
    <ButtonGroup ariaLabel="Status">
      <Button>All</Button><Button>Signed</Button><Button>Trial</Button>
    </ButtonGroup>
  </div></>;
}
```

The normal static check rejects explicit DS style overrides and direct literal
stretch layouts with action children when no explicit start alignment is present.
It does not resolve the CSS cascade, computed classes, external styles, spreads
or indirect parent components. A static pass therefore requires the consumer's
browser layout check. Use the installed `tcrn-ds-check --layout-url <running-page>`
with the usual project/index/declaration arguments. This launches real Chromium,
waits for fonts and measures the supplied page. The URL must expose the actual
consumer; it is not a caller-written evidence JSON.

Check short and long labels, with/without icons, sm/md/lg, both ButtonGroup
variants, five built-in languages, desktop/narrow parents and light/dark themes.
The browser check compares actual label/icon widths and token padding against
the action box, enforces token height/insets, squares, parent bounds and group
frame/member enclosure. Preserve the raw measurements and process exit. These
measurements do not establish keyboard behavior, production identity, publication,
Owner visual acceptance or future model compliance.

## Fill fields require the host product’s form column

Input, Textarea, SearchInput, SuggestInput, Select, MultiSelect, NumberInput and
DatePicker fill their assigned **form column**, not the viewport. Before generating
any of these fields, inspect the target project's existing form-column token,
layout rule or container component and reuse that actual rule. Record the source
file and the class used by the column in the consumer declaration's `fieldColumns`.
If the host has no applicable rule, surface `HOST_FORM_COLUMN_DECISION_REQUIRED`
and stop dependent layout generation for that host decision. Do not invent a DS
width token, substitute a generic numeric product rule or treat an unconstrained
viewport root as a valid default.

The generated field usage module requires `formColumnClassName` and has no default.
Bind it to the inspected host class; for the literal static path, replace the
parameterized class with that actual literal class in the final consumer module.
A host container component may own the same rule; inspect its implementation and
verify its actual rendered column. Dynamic classes, grid tracks and indirect
container components remain outside the literal static proof and need the host's
browser verification. A declaration is a trace to source, not proof of host approval.

The normal checker reads a binding such as this (names are illustrative and must
come from the actual target project):

```json
{ "fieldColumns": [{ "className": "customer-form-column", "source": "src/layout.css" }] }
```

The bound source must be in `sourceRoots`. The supported static path finds that
literal class with a bounded `max-inline-size` or `max-width` rule in the selected
host CSS, and requires the field to be inside it. That rule may use the host's own
token. Static matching does not resolve its value or the cascade; `--layout-url`
measures both desktop and narrow layouts with the real checker. It verifies
control = control-wrapper = assigned column, a resolved column bound, and no
parent/viewport overflow. Preserve raw geometry, including the canvas width.

Storybook supplies a fluid column capped at **28rem solely as documentation
context**, labelled beside each field example. This cap is not a published token
or a product rule. Never copy it into a consumer in place of inspecting the host.
The source metadata, generated usage/host requirements and real static/browser
checkers are hashed in the same AI dependency closure.
