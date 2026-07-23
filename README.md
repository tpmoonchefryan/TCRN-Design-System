<p align="center">
  <img src="apps/storybook/assets/tcrn-brand-mark.svg" alt="" width="88" />
</p>

<h1 align="center">TCRN Design System</h1>

<p align="center">
  Package-backed UI primitives, tokens, copy-state vocabulary, and Storybook contract docs for TCRN product frontends.
</p>

<p align="center">
  <a href="README.md">English</a>
  · <a href="README.zh-CN.md">简体中文</a>
  · <a href="README.ja.md">日本語</a>
  · <a href="README.ko.md">한국어</a>
  · <a href="README.fr.md">Français</a>
</p>

<p align="center">
  <a href="https://github.com/tpmoonchefryan/TCRN-Design-System"><img alt="GitHub repository" src="https://img.shields.io/badge/GitHub-TCRN--Design--System-24292f" /></a>
  <a href="https://tcrn-design-system-storybook.vercel.app/"><img alt="Storybook contract docs" src="https://img.shields.io/badge/Storybook-contract%20docs-5b6ee1" /></a>
  <img alt="License: Apache-2.0" src="https://img.shields.io/badge/license-Apache--2.0-5865d8" />
</p>

## What This Repo Is

This repository is the TCRN Design System source-control home. It contains the package-backed UI baseline plus the static Storybook contract surface that AI agents, product frontend implementers, and reviewers must read before claiming Design System compliance.

The hosted Storybook is available at [tcrn-design-system-storybook.vercel.app](https://tcrn-design-system-storybook.vercel.app/). That URL is a hosted readback for the static docs surface; package publication, hosted-doc readiness, product adoption, release readiness, and product acceptance remain separate routes.

## Packages

- `@tcrn/ui-tokens`: semantic token metadata, CSS variables, and light/dark theme token overrides.
- `@tcrn/ui-copy-state`: supported locales, copy-state vocabulary, and no-overclaim display helpers.
- `@tcrn/ui-react`: package-backed React primitives for shared UI presentation and accessibility.
- `apps/storybook`: static contract docs, synthetic stories, proof fixtures, and the machine-readable AI contract.

## Storybook Contract Docs

- Default docs: [Storybook home](https://tcrn-design-system-storybook.vercel.app/)
- Chinese reader path: [Storybook zh-CN](https://tcrn-design-system-storybook.vercel.app/?locale=zh-CN)
- Dark shell proof path: [Storybook dark mode](https://tcrn-design-system-storybook.vercel.app/?theme=dark)
- AI contract story: [Proof / AI consumption contract](https://tcrn-design-system-storybook.vercel.app/proof.html#ai-consumption-contract)

The Storybook surface is static and synthetic. It is the shared contract map for tokens, copy, components, patterns, no-overclaim language, and local proof expectations. It does not prove AOS or TMS product adoption by itself.

## AI Consumption Contract

AI and product frontend agents must read the Storybook AI contract before implementation:

- Tracked contract source: [ai-consumption-contract.ts](apps/storybook/src/build/ai-consumption-contract.ts) plus [foundation-visual-standards.ts](apps/storybook/src/build/foundation-visual-standards.ts) — read these in a fresh clone.
- Build outputs (gitignored, absent from a fresh clone): `ai-consumption-contract.json` and `llms.txt` are generated into `apps/storybook/storybook-static/` by the Storybook build; read the tracked `.ts` source above or the hosted artifact below, not the unbuilt paths.
- Hosted artifact: [ai-consumption-contract.json](https://tcrn-design-system-storybook.vercel.app/ai-consumption-contract.json)
- AI-first plain-text entry: [llms.txt](https://tcrn-design-system-storybook.vercel.app/llms.txt)
- Story route: `proof.html#ai-consumption-contract`
- HTML head discovery: every static Storybook page points to the JSON contract and `llms.txt`.
- Required AI readback fields: contractVersion, contractPayloadDigest, artifact, route, readAt, coveredRules, coveredStorybookSections, requiredProof, noOverclaimBoundaries.

The contract requires package-backed Design System imports, approved locale/copy-state handling, admitted brand assets or a brand admission route, token/accessibility usage, and explicit light/dark shell proof before downstream compliance claims. AI consumption must cover every Storybook section: Welcome, Style Guide, Foundations, Components, Patterns, Proof, and Change Log.

Design System compliance means the product uses the same Storybook visual instance, not only the same package or a boundary marker. Product proof must compare package version, exported component, variant/props/slots, computed visual metrics, motion/effect behavior, reduced-motion fallback, theme/locale state, mobile reflow, and information hierarchy against the relevant Storybook chapters.

## Supported Locales

The package-backed locale contract supports `zh-CN`, `en`, `ja`, `ko`, and `fr`; the fallback locale is `en`.

GitHub reader summaries are provided in this README set, and the Storybook shell can switch locale at runtime with `?locale=zh-CN`, `?locale=en`, `?locale=ja`, `?locale=ko`, or `?locale=fr`.

## Theme And Dark Mode

The Storybook docs shell supports `light` and `dark` modes through semantic tokens. Use the shell control or `?theme=dark` to inspect dark mode. Theme changes must not fork component behavior, locale copy, readiness copy, or brand assets.

## Brand And Logo Boundary

The TCRN brand mark and lockups in Storybook are visual-review guidance. Product implementations may use admitted brand assets only, or route a brand component admission before product use. The brand examples in Storybook are not published brand component exports and do not claim final brand acceptance.

## Verification Commands

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm test
pnpm storybook:smoke
node --test scripts/readme-public-contract.test.mjs
pnpm storybook:visual-proof -- --check
pnpm public-output:scan
pnpm scan
pnpm verify
```

## No-Overclaim Boundaries

- No npm/package publication is claimed by this README.
- No Storybook/docs publication readiness is claimed by this README.
- No hosted-doc readiness, product adoption, release readiness, product acceptance, final MVP acceptance, or AOS/TMS adoption is claimed here.
- GitHub releases in this repo are source-control checkpoints unless a separate package publication route proves otherwise.
