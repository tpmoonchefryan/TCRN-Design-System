<p align="center">
  <img src="apps/storybook/assets/tcrn-brand-mark.svg" alt="" width="88" />
</p>

<h1 align="center">TCRN 디자인 시스템</h1>

<p align="center">TCRN 제품 프런트엔드를 위한 패키지 기반 UI 프리미티브, 의미 토큰, 카피 상태 어휘, Storybook 계약 문서.</p>

<p align="center">
  <a href="README.md">English</a>
  · <a href="README.zh-CN.md">简体中文</a>
  · <a href="README.ja.md">日本語</a>
  · <a href="README.ko.md">한국어</a>
  · <a href="README.fr.md">Français</a>
</p>

## 무엇인가

이 저장소는 TCRN Design System의 소스 관리 진입점입니다. 제품 프런트엔드 구현자와 AI agent는 Design System 준수를 주장하기 전에 Storybook 계약과 기계 판독형 AI 계약을 읽어야 합니다.

- Storybook: [default](https://tcrn-design-system-storybook.vercel.app/)
- 한국어 Storybook: [`?locale=ko`](https://tcrn-design-system-storybook.vercel.app/?locale=ko)
- 어두운 셸: [`?theme=dark`](https://tcrn-design-system-storybook.vercel.app/?theme=dark)
- AI 계약: [`ai-consumption-contract.json`](https://tcrn-design-system-storybook.vercel.app/ai-consumption-contract.json)
- AI first-read entry: [`llms.txt`](https://tcrn-design-system-storybook.vercel.app/llms.txt) 및 HTML head discovery. readback fields는 contractVersion, contractPayloadDigest, artifact, route, readAt, coveredRules, coveredStorybookSections, requiredProof, noOverclaimBoundaries를 포함해야 합니다.
- AI consumption must cover every Storybook section: Welcome, Style Guide, Foundations, Components, Patterns, Proof, and Change Log. Design System compliance means the same Storybook visual instance, not only the same package or a boundary marker; proof must cover package version, exported component, variant/props/slots, rendered metrics, motion/effects, reduced motion, theme/locale, mobile reflow, and information hierarchy.

## 패키지와 경계

- `@tcrn/ui-tokens`: 의미 토큰과 밝은/어두운 테마 오버라이드.
- `@tcrn/ui-copy-state`: `zh-CN`, `en`, `ja`, `ko`, `fr` 로케일과 카피 상태.
- `@tcrn/ui-react`: 패키지 기반 React UI 프리미티브.
- `apps/storybook`: 정적 계약 문서, 합성 스토리, 로컬 증명.

Storybook은 계약 지도이며 AOS/TMS 제품 채택을 자동으로 증명하지 않습니다. 브랜드 예시는 시각 검토 가이드이며 게시된 브랜드 컴포넌트 export나 최종 브랜드 승인을 주장하지 않습니다.

## 검증

```bash
pnpm build
pnpm test
pnpm storybook:smoke
node --test scripts/readme-public-contract.test.mjs
pnpm storybook:visual-proof -- --check
pnpm verify
```

이 README는 npm 패키지 게시, Storybook 문서 게시 준비, hosted-doc readiness, 제품 채택, release readiness, 제품 수락 또는 최종 MVP 수락을 주장하지 않습니다.
