# Component family audit

Redaction declaration: local paths, account data and raw command output remain in the platform archive. This document contains repository-relative source references and synthetic component observations.

The comparison starts at the prior production source 610680b81a950e91e9e1e77718ea7f3f3b19bc27. All unpublished source changes are inventoried in the batch archive. The returned collection field now uses a Select-family dropdown; native multiple lists and explicit checklists remain distinct presentations. Checklist controls reuse the existing Checkbox and Button appearance. Source inspection uses Git and the package sources because the code graph is not exposed by this host.

| Changed surface | Existing family and interaction meaning | Disposition | Applicable verification |
| --- | --- | --- | --- |
| MultiSelect dropdown | Select trigger; Menu option; native Select serialization; shared overlay boundary | Select/Menu tokens and native control geometry reused; current choices displayed while collapsed; listbox multi-choice interaction; same shared DOM bridge for React and static HTML | multi-select-dropdown-proof; full-surface-remediation-proof |
| MultiSelect native | published native Select family | native multiple presentation retained for compatibility; unique closed-set values and disabled native options retained | Form.test; full-surface-remediation-proof |
| MultiSelect checklist | Checkbox and quiet small Button families | opt-in visible checklist remains distinct from ordinary dropdown choice; raw inputs now use existing Checkbox class; clear action now uses existing Button classes without a private button appearance | multi-select.dom.spec; multi-select-required-proof |
| Select/Input typography | existing token-backed control family | shared inherited font and token foreground/panel background apply to all value controls; border, spacing, radius and minimum height retain the Select geometry | dropdown computed-style comparison with Select; tokens:proof; internal-alpha:browser-proof |
| SettingRow/SettingRowList/SettingsLayout | published settings layout and SettingRow family | one parent-owned grid with label/control/tools subgrids; empty tools slots keep their column; controls and wrappers use complete allocated control width; narrow actual containers stack at existing threshold | ds:consumption:proof settings geometry and value comparisons; full-surface-remediation-proof localized layout examples |
| Surface | published Surface heading/actions/content slots | heading/actions wrap separately within card; long values retain full content | full-surface full-details positive and unwrapped negative |
| DefinitionList | published key/value definition family | nested terms and values wrap inside same parent; no data clipping or text substitution | DomainDisplay.test; full-details nested-card geometry |
| OperationFeedback | published StatusBadge and DisclosurePanel | long operation identity and structured receipt wrap in labeled details; phase badges remain compact and truthful | full-details byte equality, positive containment and negative nowrap |
| TableShell/RecordRow/SettingRow transient target | existing selection-fill and selection-edge grammar | same selection tokens; one boundary owner avoids doubled edges; target attribute does not claim selected/focused identity; consumer owns navigation timer | Navigation.test; ds:consumption:proof transient target geometry |
| Storybook static bridge and CSS placement | published package CSS and static-overlay consumption contracts | build packages the same static dropdown bridge; working translated dropdown example; shared settings CSS remains in package truth | storybook:smoke; full-surface:proof; internal-alpha:browser-proof |
| Publication identity | existing design-authority contract | source commit, component CSS and static bridge digests bind the artifact to the build | public-docs:vercel-build; production deployment SHA and artifact digest readback |

Each appearance uses existing typography, color, spacing, radius, border, icon and motion tokens. The dropdown comparison measures its trigger against Select and exercises native form values, required/disabled states, reset, controlled values, keyboard navigation and dismissal. Container and detail checks preserve full values and distinguish failed status from empty content. The application consumes the resulting published artifact only after its production build and deployment have matching source evidence. Machine checks and Owner visual review retain separate results.

The earlier recorded workspace verification (271 browser captures, zero axe violations) did not bind the final accidental JSON test source. Current verification must cover the restored executable test and complete public token references; native multiple-list and explicit-checklist compatibility remains verified. The ordinary dropdown uses observable native reset settlement, including cancellation, and localized labels. Static proof-page CSS is compacted without changing its semantic declarations or selectors; page and story budgets were not increased. The publication target build and actual Production deployment remain separate evidence checks.

## Public token reference audit

Previously unresolved component references now consume the existing semantic family tokens directly. Fourteen unpublished aliases duplicated those same values and added eight duplicate entries to the color-palette story. That source drift changed all three palette signatures and the recorded story height. The aliases are removed before publication; the original color registry and its complete palette example remain unchanged. No visual baseline, signature threshold, height threshold or debt allowance is changed.

The brand-mark filter and SearchInput minimum retain their public `none` and `0` defaults. Component consumers use the public token stylesheet and component stylesheet together. Menu opacity, corners, elevation, selected text, disabled text and state borders all resolve through the original public family tokens in both themes.

| Former unpublished component reference | Public family token or retained default |
| --- | --- |
| `--tcrn-color-surface` | `--tcrn-color-surface-panel` |
| `--tcrn-color-surface-subtle` | `--tcrn-color-surface-muted` |
| `--tcrn-color-accent` | `--tcrn-color-brand-primary` |
| `--tcrn-color-on-accent` | `--tcrn-color-text-inverse` |
| `--tcrn-color-positive-border` | `--tcrn-color-state-ready` |
| `--tcrn-color-warning-border` | `--tcrn-color-state-warning` |
| `--tcrn-color-danger-border` | `--tcrn-color-state-blocked` |
| `--tcrn-color-text-disabled` | `--tcrn-color-text-muted` |
| `--tcrn-font-size-xs` | `--tcrn-type-size-caption` |
| `--tcrn-font-size-sm` | `--tcrn-type-size-meta` |
| `--tcrn-font-size-md` | `--tcrn-type-size-ui` |
| `--tcrn-radius-md` | `--tcrn-radius-panel` |
| `--tcrn-radius-sm` | `--tcrn-radius-control` |
| `--tcrn-shadow-raised` | `--tcrn-elevation-floating` |
| `--tcrn-brand-mark-filter` | `none` |
| `--tcrn-search-input-min-inline-size` | `0` |

The token-extension proof checks every consumed variable, and the executable full-surface test refuses omission of the actual public menu panel token. The existing browser proof measures the popup using only package tokens and component CSS in both themes. All family-audit rows above remain applicable, including native/checklist compatibility, reset, disabled options, required values, static bridge interaction, settings grid, complete detail values and transient-target semantics. Fresh ordinary parent results and matching Production publication evidence are separate receipts. Owner visual acceptance remains unobserved.

`TableShell` supplies `--tcrn-table-column-count` from its actual columns, and its documented `--tcrn-table-shell-column-min-width` parameter retains its existing fallback. These two component data/width parameters are registered separately from the public semantic tokens and the two retained parameter defaults.
