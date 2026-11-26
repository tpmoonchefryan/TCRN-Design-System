// Explicitly adopted product marks layered alongside published 04-brand generated marks (TCRN-DS-STORY-156).
// Source authority: VoxWard brand mark Option C ("Acoustic Gate", minutes:577fa880f7f1b73b76eb2d0e#D1),
// scaled 0.75x from the 64x64 master grid onto the formal 48x48 viewBox.
import type { TcrnProductMark } from "./product-marks.generated.js";

const voxwardWingPath = "M10.5 12.75L18 12.75L24 30.75L30 12.75L37.5 12.75L27.375 38.25L20.625 38.25Z";
const voxwardDiamondPath = "M24 9.75L27.75 15L24 20.25L20.25 15Z";

export const tcrnAdoptedProductMarks: readonly TcrnProductMark[] = [
  {
    id: "voxward",
    productId: "voxward",
    name: "VoxWard",
    word: "VoxWard",
    font: "sans",
    palette: {
      deep: "#0b6b65",
      bright: "#3fc7b7",
      tint: "#e3f3f1",
      halloween: "#f58a33"
    },
    colorBody: `<rect fill="var(--tcrn-color-acc, #0b6b65)" height="48" rx="12" width="48"/><path d="${voxwardWingPath}" fill="var(--tcrn-color-on-acc, #ffffff)"/><path d="${voxwardDiamondPath}" fill="var(--tcrn-color-on-acc, #ffffff)"/>`,
    inkBody: `<rect fill="none" height="45" rx="10.5" stroke="currentColor" stroke-width="3" width="45" x="1.5" y="1.5"/><path d="${voxwardWingPath}" fill="currentColor"/><path d="${voxwardDiamondPath}" fill="currentColor"/>`,
    tileTintBody: `<rect fill="#e3f3f1" height="48" rx="12" width="48"/><path d="${voxwardWingPath}" fill="#0b6b65"/><path d="${voxwardDiamondPath}" fill="#0b6b65"/>`,
    tileDeepBody: `<rect fill="#0b6b65" height="48" rx="12" width="48"/><path d="${voxwardWingPath}" fill="#ffffff"/><path d="${voxwardDiamondPath}" fill="#ffffff"/>`,
    taglines: {
      "zh-CN": "直播互动审核系统",
      en: "Live chat moderation system",
      ja: "配信チャットモデレーションシステム",
      ko: "라이브 채팅 모더레이션 시스템",
      fr: "Système de modération du chat en direct"
    },
    source: "minutes:577fa880f7f1b73b76eb2d0e#D1"
  },
  {
    id: "platform",
    productId: "platform",
    name: "TCRN Platform",
    word: "TCRN",
    suffix: "Platform",
    font: "sans",
    palette: {
      deep: "#0b6b65",
      bright: "#3fc7b7",
      tint: "#e3f3f1",
      halloween: "#f58a33"
    },
    colorBody: `<rect fill="var(--tcrn-color-ink, #16150f)" height="18" rx="4" width="9" x="6" y="10"/><rect fill="var(--tcrn-color-ink, #16150f)" height="18" rx="4" width="9" x="33" y="10"/><rect fill="var(--tcrn-color-acc, #0b6b65)" height="16" rx="4" width="10" x="19" y="6"/><rect fill="var(--tcrn-color-ink, #16150f)" height="10" rx="4" width="36" x="6" y="32"/>`,
    inkBody: `<rect fill="currentColor" height="18" rx="4" width="9" x="6" y="10"/><rect fill="currentColor" height="18" rx="4" width="9" x="33" y="10"/><rect fill="currentColor" height="16" rx="4" width="10" x="19" y="6"/><rect fill="currentColor" height="10" rx="4" width="36" x="6" y="32"/>`,
    tileTintBody: `<rect fill="#e3f3f1" height="48" rx="11" width="48"/><g transform="translate(7.2 7.2) scale(0.7)"><rect fill="#16150f" height="18" rx="4" width="9" x="6" y="10"/><rect fill="#16150f" height="18" rx="4" width="9" x="33" y="10"/><rect fill="#0b6b65" height="16" rx="4" width="10" x="19" y="6"/><rect fill="#16150f" height="10" rx="4" width="36" x="6" y="32"/></g>`,
    tileDeepBody: `<rect fill="#0b6b65" height="48" rx="11" width="48"/><g transform="translate(7.2 7.2) scale(0.7)"><rect fill="#ffffff" height="18" rx="4" width="9" x="6" y="10"/><rect fill="#ffffff" height="18" rx="4" width="9" x="33" y="10"/><rect fill="#ffffff" height="16" rx="4" width="10" x="19" y="6"/><rect fill="#ffffff" height="10" rx="4" width="36" x="6" y="32"/></g>`,
    taglines: {
      "zh-CN": "官方平台与统一身份",
      en: "Unified platform & identity",
      ja: "統合プラットフォーム・認証",
      ko: "통합 플랫폼 및 인증",
      fr: "Plateforme unifiée et identité"
    },
    source: "adopted-tcrn-platform-mother-mark"
  }
];
