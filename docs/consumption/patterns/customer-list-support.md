# Owner-adopted customer-list support contract

Owner adopted the customer table/cards, pagination, five business states,
confirmation composition and explicit product Traditional Chinese shell copy in
`minutes:6f3e0a9a1e07e3980867d82e#D2`. This document is the producer support
contract for the existing TMS route
`/tenant/[tenantId]/talent/[talentId]/customers`; it adds no formal component
entry. The business mapping input was DS `0a4df27` and TMS `a4030b1`.
The package remains a 4.0.0 candidate awaiting formal producer publication;
Owner adoption does not establish production delivery or real TMS consumption.

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
| Six-column ledger | 07b source `.tbl` / `.st` demonstrates the table and dot-plus-text status grammar | The adopted composition uses a native semantic table on desktop and equivalent narrow cards. Keep customer, profile type, status/language, membership, update/create date and actions in both. It is support for the existing 28-entry catalogue; engineering `TableShell` and `DataGrid` do not become formal entries or approved substitutes. |
| Pagination and page-size value | Published `Button` and `Select` can supply the controls | Product owns API metadata and truthful start/end/total, disabled previous/next while loading, supported page sizes, URL changes and page reset. Existing engineering `Pagination` is a link cursor with `shown/total`; it does not implement this API contract. |
| Loading / empty / error / denied / unavailable | Published `Heading`, `Text`, `Icon` and action family can be composed | The adopted composition uses status politeness for loading/empty/unavailable and alert politeness for error/denied, with title/description/action slots and error-title focus. `ui-copy-state` describes governance readiness, not customer API state. Keep the existing business data source. |
| Confirmation for deactivate / reactivate | Published danger/secondary actions and text; engineering `Dialog` now has tested focus ownership | The adopted confirmation composition keeps cancel-first focus, pending disabling, Escape/backdrop cancellation policy, error display and focus return. The product reads fresh detail/version before deactivate, submits that version, refreshes the existing query and keeps the dialog on a failed action. Reactivate uses its existing endpoint. No fixture may skip these steps. |
| Summary counts and notices | Typography and source dot-plus-text status grammar | Counts remain scoped to the visible page exactly as the current screen computes them. Do not reinterpret them as tenant-wide totals. Preserve locale number/date formatting and success/error notice content. |

The adopted visual samples are retained unchanged under the Code execution base,
`.tcrn-artifacts/initiatives/2026-11-08-ds-production-mvp/s1/package-a/standard-candidates/`:
`customer-support-desktop.png`, `customer-support-phone.png`,
`customer-support.html` and `traditional-chinese-copy.json`.
Their original candidate labels describe the pre-adoption snapshot; the later
Owner decision above records adoption. Static sample buttons do not implement
the business API or prove focus and confirmation behavior.

The existing AI `pattern/customer-list-boundary` shard reads this file directly;
`pattern/product-locales` is a required dependency and reads the locale contract
linked below. Keep those
rules and the shared executable examples on the same producer build. Do not
create another standard board or a separate copy of this contract. The real TMS
route may consume the adopted support only after the matching formal producer
publication and the existing integration checks.

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

The explicit Traditional Chinese shell wording in the retained sample is also
Owner-adopted under the same D2. B can exercise the actual candidate API. E still
requires matching formal producer delivery and real TMS integration checks before
claiming the migration complete; the adopted support does not create a sixth
built-in DS locale.
