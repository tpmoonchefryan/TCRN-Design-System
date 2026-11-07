# Customer-list support boundary

This document records the minimum support required by the existing TMS route
`/tenant/[tenantId]/talent/[talentId]/customers`. It does not add entries to the
published design catalogue. The implementation snapshot is DS `0a4df27` and TMS
`a4030b1`; the package remains a 4.0.0 candidate. Production delivery and the
necessary standard additions have not occurred.

The actual consumer sources are project `project:c496caf54058bdbe17f40ebf`:
`apps/web/src/platform/routing/{PrivateShell,TalentBusinessShell}.tsx`,
`apps/web/src/domains/customer-management/screens/CustomerManagementScreen.tsx`,
and its `TableShell`, `PaginationFooter`, `StateView`, `ConfirmActionDialog`
patterns. The native route keeps `TalentBusinessAccessGate`. A local DS fixture
cannot replace these sources or the later real-route business checks.

| Actual use | Existing published support | Minimum addition / boundary |
| --- | --- | --- |
| Talent shell and page heading | `ProductShell`, actual `ShellMenu` / `ShellPins` / `ShellDropdown`, required `pageHeader`, published brand and controls | Keep tenant/talent routing, capability filtering, account/profile/security/sign-out callbacks. Capture native link activation before a transient layer is removed; see the navigation document. |
| Search and activity/membership filters | `SearchInput`, `Select`, or the existing action family with `aria-pressed`; `ButtonGroup` admits two to five direct actions | Preserve URL `search`, `activity`, `membership`, `page`, `pageSize`; a filter resets page to 1. Do not use navigation Tabs for a value choice. |
| Create affordance | `LinkButton` / published `Button` with a product callback | Keep permission denial and the actual `customers/new` destination. A denied create action remains absent as in the consumer. |
| Six-column ledger | 07b source `.tbl` / `.st` demonstrates the table and dot-plus-text status grammar | A production table pattern is still absent from the 28-entry catalogue. The engineering `TableShell` and `DataGrid` are not approved substitutes. The candidate retains customer, profile type, status/language, membership, update/create date and actions. Narrow cards must expose the same fields and actions. |
| Pagination and page-size value | Published `Button` and `Select` can supply the controls | Product owns API metadata and truthful start/end/total, disabled previous/next while loading, supported page sizes, URL changes and page reset. Existing engineering `Pagination` is a link cursor with `shown/total`; it does not implement this API contract. |
| Loading / empty / error / denied / unavailable | Published `Heading`, `Text`, `Icon` and action family can be composed | The published catalogue has no complete business-state pattern. `ui-copy-state` describes governance readiness, not customer API state. A candidate must define status/alert politeness, title/description/action slots and error-title focus without changing the business data source. |
| Confirmation for deactivate / reactivate | Published danger/secondary actions and text; engineering `Dialog` now has tested focus ownership | A formal confirmation composition is still needed. Keep cancel-first focus, pending disabling, Escape/backdrop cancellation policy, error display and focus return. The product reads fresh detail/version before deactivate, submits that version, refreshes the existing query and keeps the dialog on a failed action. Reactivate uses its existing endpoint. No fixture may skip these steps. |
| Summary counts and notices | Typography and source dot-plus-text status grammar | Counts remain scoped to the visible page exactly as the current screen computes them. Do not reinterpret them as tenant-wide totals. Preserve locale number/date formatting and success/error notice content. |

The upstream visual candidate is retained with INIT-086 package A evidence under
the Code execution base, `s1/package-a/standard-candidates/`. It isolates the
proposed table/cards, pagination, business states and confirmation from the
current runtime. It must not be called published or consumed by the real TMS
route before the applicable source adoption and producer delivery.

## Six product locales and five DS locales

The actual product locale set is declared in TMS
`packages/shared/src/constants/locale.ts`. Existing DS built-ins resolve exact
`TcrnLocale` values and otherwise return English; they do not recognize TMS's
underscore identifiers. Passing a TMS code directly to `ProductShell` is
incorrect.

| TMS locale | DS built-in locale | Product locale kept by TMS |
| --- | --- | --- |
| `en` | `en` | `en` |
| `zh_HANS` | `zh-CN` | `zh_HANS` |
| `ja` | `ja` | `ja` |
| `ko` | `ko` | `ko` |
| `fr` | `fr` | `fr` |
| `zh_HANT` | No complete built-in mapping | `zh_HANT` must remain available; no implicit English or Simplified Chinese substitution |

The local producer candidate now implements complete explicit product locale
copy through `ProductShellLocaleDefinition`, the generic controller and the actual
nested shell family. See [the product locale contract](product-shell-locales.md).
An explicit catalogue keeps `zh_HANT` as its real product identity and supplies
complete product-owned copy; it does not create a sixth built-in DS locale.

B can exercise this actual candidate API. E still requires the matching formal
producer delivery, applicable visual authority adoption for customer compositions
and real TMS integration checks before claiming the migration complete.
