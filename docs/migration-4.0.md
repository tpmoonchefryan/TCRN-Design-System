# Migrating to the published-source 4.0.0 candidate

The current documentation candidate takes visual standards only from [published Sites version 1](https://tcrn-ds-visual-standards.honestfawn3.chatgpt.site), source commit `a643d4cfcd239f6f81b1715ded6a63caead9d619`. The source has eight boards; `docs/design/approved-site-v1/source-manifest.json` binds their identities and original bytes. A 4.0.0 package or Git commit is a candidate implementation identity, not the Site source version or an acceptance receipt.

Earlier migration instructions and implementation decisions are preserved in Git history and their original dispatch/minutes evidence. They do not authorize old Storybook standards, old fonts, the retired mother mark, unpublished D sections or the former product examples in this candidate.

Use `@tcrn/ui-react/approved` for the documented surface. The root engineering API remains a separate package capability and is not an automatically published design catalogue. API pages enumerate explicit source obligations; they no longer publish every root export or resurrect source files through a glob.

| Retired engineering export | Current design status | Migration step |
| --- | --- | --- |
| `SideNav` | No current documentation style or route | Move the host hierarchy to the published top-band `ProductShell` menu and pins; do not copy a side-rail stylesheet. |
| `SideNavCollapseButton` | No current documentation style or route | Remove the side-rail collapse control and use the shell menu's open state. |
| `TopBar` | No current documentation style or route | Use the single 52px top band and its paper in `ProductShell`. |
| `MobileNavToggle` | No current documentation style or route | Use the shell brand button and the published phone Sheet scene; wider host breakpoints need their own explicit contract. |
| `ProductLauncher` | No current documentation style or route | Put product/account actions in the shell avatar slot; do not reintroduce a product grid into the full menu. |
| `ProductSwitcher` | No current documentation style or route | Bind the account/product action explicitly; an engineering export does not establish a new visual standard. |

Every brand call requires one of the four formal product keys: `tms`, `einzbern`, `mana-orchestrate`, `design-system`. There is no AOS mark, default mother image, free suffix, remote image fallback or unregistered product label. AOS consumer adoption needs a separately authorized brand design decision; this package does not invent one.

The current token sheet omits old compatibility aliases and unrelated layout budgets. Use the formal semantic spellings documented in the token registry. Source-backed roles include 39 themed values, 27 fixed values and explicit bindings to actual typography/shell CSS or prose. The five formal font families use the 222 source files and 545 face declarations; same-named Fontsource files are not substituted.

Paper Tabs use the thin ink underline from 07. Selected lists, tables, top-band pins and menu rows each use their own formal wash role. Do not apply a global “all tabs use wash/no underline” rule.

K1 remains unresolved: the formal TMS/DS suffix colors conflict with the formal text contrast threshold in particular theme/carrier combinations. The candidate preserves actual formal colors and keeps the threshold at 4.5. K5 remains unresolved: prose says strong text does not change color, while the published CSS/sample uses ink/600 against body ink-2. Those are recorded conflicts, not exemptions or a claim of conformity. K4 uses the Owner's pure-icon pin decision and the actual formal SVG plus an item-specific accessible name; the Site prose was not edited.

Integration must regenerate the source sets once, then fonts, compile dependencies in order, synchronize token/component sheets and rebuild both documentation entry points. See `docs/design/README.md`. Rebuildable stale output is reconciled to an owned `TCRN_BUILD_TRASH`; historical verification evidence is never a cleanup target. This implementation delivery does not assert that batch-end generation, checks, publication or Owner visual acceptance have occurred.
