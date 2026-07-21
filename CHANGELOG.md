# Changelog

## Unreleased

### Storybook fidelity — A-tier repair (TCRN-DS-INIT-003)

The docs surface now shows the language it documents, and its self-checks report
what they actually measured.

**The fidelity checks were mostly claims.** `rejectChecks` carried seven entries of
which six were the literal `false` — assertions wearing the shape of checks, and
they travelled into the AI consumption contract that way. Three are now real scans
of the shell sources (decorative gradients, radius drift, soft-cloud elevation), one
binds to the perceptual signature gate (palette drift), and the three that are
compositional judgements no code here can make are reported as explicitly
**unchecked** rather than asserted false. The contract claims less and means it.

**Turning them on found what they had been covering:** 86 decorative gradient
washes, 21 soft-cloud shadows up to 54px of blur, and 6 radius literals off the
token scale. All are zero now. Functional gradients — progress fill, skeleton
shimmer, tracked-nav indicator — stay, and are named in an allowlist rather than
recognised by accident.

**`.tcrn-theme-preview` was demonstrating a dead theme.** It hardcoded the v1 navy
wash, so the one component whose job is showing the dark theme was showing the
theme v2 replaced. It is token-driven now.

**The stamp finally has a chapter.** Adoption is defined as matching a component's
Storybook chapter, and v2's only new component family had none. Components now
documents the three admitted moments, the stamped header, and the boundary that
keeps the language rare.

**The v1 colour vocabulary is retired** from the locale table — six orphaned keys
removed, two live ones moved to the colour-neutral variants already translated.
The brand mark's description keeps its v1 colour names on purpose: the mark is a
frozen brand asset, changed through brand admission rather than a design-system
revision.

### Visual language v2 — direction A+B (TCRN-DS-INIT-001)

Breaking: the visual language is a contract surface, so consumers comparing computed
visual metrics against Storybook will see every colour, several radii, and the whole
motion curve family change. This lands as a major version.

**Palette (WS1).** The iris-blue `#5865d8` and rose `#c96a7e` are gone; the brand teal
is purified to `#17707f` as the single accent of the quiet-instrument base, with an
oxblood `#93332a` reserved for identity moments. Surfaces move from cool blue-greys to
warm-neutral graphite. Status backgrounds drop their pastel fills for low-noise washes.
Every foreground/background pair the system renders is now proven against WCAG AA by
`pnpm tokens:proof`, in both themes.

**Two defects found and fixed while measuring.**
- `packages/ui-tokens/src/tokens.css`, a published export, had drifted from its
  generator: 13 typography tokens were missing from the shipped CSS, including
  `--tcrn-type-weight-strong`, which `@tcrn/ui-react` referenced 16 times. Consumers
  importing the CSS resolved those to nothing.
- `apps/storybook/src/storybook.css` carried a complete hardcoded copy of the v1
  palette, so the docs shell would have kept rendering the old language after the
  package moved — contradicting the claim that compliance means using the same
  Storybook visual instance.
Both artifacts are now generated from `@tcrn/ui-tokens`, and `pnpm tokens:proof` fails
the build if either drifts again.

**Boundaries (WS1).** New `--tcrn-color-border-control` carries the WCAG 1.4.11 3:1
duty for boundaries that identify a control; the lighter structural rules keep drawing
table lines without being held to a threshold meant for controls. Eight control
boundaries moved onto it.

**Stamp language (WS2).** New `Stamp` and `StampRule` components carry the archival
serif, the oxblood ink, and the double rule. They are admitted at three identity
moments only — gate close, ruling, release acceptance — and `pnpm stamp:proof` fails
the build if the language leaks anywhere else. Status chips are now an ink dot plus a
word, squared to the control radius, replacing the pastel pill.

**Motion (WS3).** Built-in easings are replaced by a curve family: strong ease-out
`cubic-bezier(0.23, 1, 0.32, 1)` for entry and exit, strong ease-in-out for on-screen
movement, and the drawer curve for large surfaces. Buttons answer a press with
`scale(0.97)`. Search expand/collapse drops from 320ms to 240ms, under the 300ms
ceiling for UI motion.

**Reduced motion is no longer a kill switch.** The previous behaviour set
`transition: none`, which removed the cue that anything had changed along with the
movement. Positional motion is now removed while opacity and colour transitions
survive, and the proof harness was rewritten to assert both halves — no travel *and* a
surviving comprehension cue — which is a stricter check than the one it replaces.

**Fonts.** `packages/ui-tokens/FONT-LICENSES.md` records the licensing position: the
system names font families and ships no font software. `pnpm fonts:proof` enforces
that no font binary reaches a published artifact and that no proprietary face appears
in a stack advertised as distributable. The SF family is deliberately absent — it is
licensed for Apple platforms only, which is one concrete reason direction C was not
adopted wholesale.

- 2026-07-02: Add foundational visual standards and consumer visual style
  contract coverage from
  `route_tcrn_ds_foundational_visual_standards_contract_ilya_implementation_after_multirole_plan_acceptance_9b983d0_01b4e32_680da66`.
  Affected stories: `foundation-visual-standards` plus
  `ai-consumption-contract` readback surfaces.
  AI contract/readback: `foundationVisualStandards`,
  `foundationVisualStandardCategories`, `productShellVisualOracle`, and
  `consumerVisualStyleContract` are exposed in
  `storybook-static/ai-consumption-contract.json` and aligned into `llms.txt`.
  Proof artifacts: Storybook smoke and internal-alpha browser proof fail closed
  on missing standards, missing consumer contract fields, ProductShell visual
  skin drift, search control geometry drift, private doc-shell clone regression,
  zh-CN shell leaks, no-overclaim drift, and page overflow.
  Boundaries: local Storybook/AI-consumption contract only; no package
  publication, Storybook/docs publication, AOS/TMS product adoption,
  owner/product/release acceptance, live dispatch, external action, or
  initiative completion claim.

- 2026-07-01: Add Storybook governance/readability/traceability updates from
  route
  `route_tcrn_ds_storybook_governance_ilya_implementation_after_plan_reviews_success_a1f19b1a_dded541`.
  Implementation commit: `c24f6e5d779c60486214ea1e07fc737e60796e00`.
  Affected stories: all 40 local contract stories across `Welcome`,
  `Style Guide`, `Foundations`, `Components`, `Patterns`, `Proof`, and
  `Change Log`.
  AI contract digest/readback: `storybook-static/ai-consumption-contract.json`
  includes `contractPayloadDigest`; Storybook smoke verifies it equals the
  stable JSON digest.
  Proof artifacts: `apps/storybook/storybook-static/ai-consumption-contract.json`,
  `apps/storybook/storybook-static/llms.txt`,
  `docs/verification/internal-alpha/browser-proof-summary.json`,
  `docs/verification/internal-alpha/a11y-axe-summary.json`, and
  `docs/verification/internal-alpha/no-overclaim-scan.json`.
  Boundaries: local Storybook governance contract only; no package publication,
  Storybook/docs publication, AOS/TMS product adoption, owner/product/release
  acceptance, live dispatch, external action, or initiative completion claim.

## 1.0.0

- Prepare the accepted public Design System baseline under Apache License 2.0.
- Set the root workspace and public package manifests to version `1.0.0`.
- Declare `Apache-2.0` for `@tcrn/ui-tokens`, `@tcrn/ui-copy-state`, and
  `@tcrn/ui-react`.
- Add prep-only Vercel configuration for the Storybook static documentation
  build target.
- Keep the root workspace and examples private as package workspaces.
- Record historical local release-prep notes where public hosting, GitHub
  Release creation, package registry publication, and public repository
  exposure were deferred to separate routes.
- Record the post-release current state: the GitHub repository is public and
  GitHub Release `v1.0.0` exists for commit
  `57b1c417efe4c011daa538158b347075d122b72b`; npm package publication remains
  unconfirmed/not performed.
- Record the current hosted-docs readback: hosted Storybook documentation is
  reachable at `https://tcrn-design-system-storybook.vercel.app/`, while GitHub
  status checks, Actions runs, deployment records, and hosted-doc readiness
  proof are not claimed for the selected public basis.
- No AOS/TMS product adoption, product acceptance, release readiness, npm
  package publication, or final MVP acceptance is claimed.

## 0.0.0-private

- Initial local private scaffold for tokens, copy-state, React primitives,
  static contract stories, synthetic examples, and route-local proof scripts.
- No package publication, GitHub publication, product adoption, product
  acceptance, or final MVP acceptance.
