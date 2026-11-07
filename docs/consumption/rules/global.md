# Required consumer rules

Resolve the versioned AI index before implementation. Pin the exact package
versions, standard identity and index source digest in the consumer declaration.
Read `global` and the transitive `required` dependencies of the components and
patterns used by this task. `optional` links are further reading. A complete JSON
is a compatibility entry, not a requirement to read the entire library per task.

Import visual components from `@tcrn/ui-react/approved`. The 28 formal entries are
an explicit catalogue. Engineering exports at the package root do not grant a
published design contract. Use the action family for actions, links for navigation,
Select for a closed single value, MultiSelect for a collection, SuggestInput for
an open value, and the shell family for menus, pins and dropdowns. Native semantic
HTML remains appropriate for business text, labels, headings and table cells.

Use registered `--tcrn-*` tokens and published component variants. Do not redefine
these tokens, add bare colors, override a component's paint or typography, or
invent a parallel family. Product-owned CSS variables may carry business geometry;
they do not replace design tokens. Icons and product marks come from the published
rosters. Load package CSS and vendored fonts and retain their licenses. A CSS
variable or class scanner cannot establish contrast, clipping, keyboard or focus
behavior: run the applicable browser checks as well.

Supply visible labels, accessible names and disabled reasons where the API requires
them. Preserve native form values, controlled state and required/error feedback.
Supply the selected complete product locale definition for a product with different
locale identifiers; no partial fallback represents a sixth built-in DS language.

For an authenticated shell, use ProductShell with the actual ShellMenu, ShellPins
and ShellDropdown. Connect pin/unpin and reorder callbacks. Load ordered preferences
before mounting; remount on user, tenant or product changes. The product backend
must derive the authenticated user and tenant, scope the product, serialize writes,
report failures and read back the stored order. A void callback acknowledges no
network operation. Anonymous localStorage is not account synchronization. Follow
the required shell preference pattern when any shell component is used.

The pinned Site v1 remains the normative visual source. Its K1 suffix contrast,
K5 wording and 06 dark shortcut contrast conflicts remain declared and unresolved.
Do not silently adopt proposals, lower thresholds or claim that a local candidate
is production. Customer table/state/confirmation compositions remain candidates
until the required authority adoption and producer delivery occur.

Invalidate the local rule cache when any package version, standard identity,
source digest, shard digest or required dependency differs. Missing, malformed or
unreadable data fails closed. Refresh index and its required closure atomically
from the same build, then rerun the normal consumer check. A digest checks
consistency, not publisher authentication; pin a trusted producer artifact.
