<p align="center">
  <img src="apps/storybook/assets/tcrn-brand-mark.svg" alt="" width="88" />
</p>

<h1 align="center">Design System TCRN</h1>

<p align="center">Primitives UI adossées aux packages, tokens sémantiques, vocabulaire d'état de copie et docs Storybook contractuelles pour les frontends produit TCRN.</p>

<p align="center">
  <a href="README.md">English</a>
  · <a href="README.zh-CN.md">简体中文</a>
  · <a href="README.ja.md">日本語</a>
  · <a href="README.ko.md">한국어</a>
  · <a href="README.fr.md">Français</a>
</p>

## Ce dépôt

Ce dépôt est l'entrée source-control du Design System TCRN. Les implémenteurs frontend produit et les agents IA doivent lire le contrat Storybook et le contrat IA lisible par machine avant de revendiquer la conformité au Design System.

- Storybook: [default](https://tcrn-design-system-storybook.vercel.app/)
- Storybook français: [`?locale=fr`](https://tcrn-design-system-storybook.vercel.app/?locale=fr)
- Enveloppe sombre: [`?theme=dark`](https://tcrn-design-system-storybook.vercel.app/?theme=dark)
- Contrat IA: [`ai-consumption-contract.json`](https://tcrn-design-system-storybook.vercel.app/ai-consumption-contract.json)

## Packages et limites

- `@tcrn/ui-tokens`: tokens sémantiques et surcharges de thème clair/sombre.
- `@tcrn/ui-copy-state`: locales `zh-CN`, `en`, `ja`, `ko`, `fr` et état de copie.
- `@tcrn/ui-react`: primitives UI React adossées aux packages.
- `apps/storybook`: docs contractuelles statiques, stories synthétiques et preuve locale.

Storybook est une carte contractuelle, pas une preuve automatique d'adoption produit AOS/TMS. Les exemples de marque sont une guidance de revue visuelle, pas des exports de composants marque publiés ni une acceptation finale de marque.

## Vérification

```bash
pnpm build
pnpm test
pnpm storybook:smoke
node --test scripts/readme-public-contract.test.mjs
pnpm storybook:visual-proof -- --check
pnpm verify
```

Ce README ne revendique pas la publication npm/package, la préparation de publication des docs Storybook, hosted-doc readiness, l'adoption produit, release readiness, l'acceptation produit ou l'acceptation MVP finale.
