// 由 docs/design/gplus-2026-10/contract 生成，勿手改（node scripts/contract-generate.mjs）。
// contract files: marks.json
// contract-sha256: bb4448faf33e0530fd3c31aff45112f9a889bc6a40e0ddf37f7b22345756dafd


export const tcrnProductMarkViewBox = "0 0 48 48";

export const tcrnProductMarkLocales = ["zh-CN", "en", "ja", "ko", "fr"] as const;

export type TcrnProductMarkLocale = (typeof tcrnProductMarkLocales)[number];

export interface TcrnProductMark {
  readonly id: string;
  readonly productId: string;
  readonly name: string;
  readonly word: string;
  readonly suffix?: string;
  readonly font: "sans" | "serif";
  readonly palette: Readonly<Record<string, string>>;
  /** SVG children in the two (ds: four) flat tones */
  readonly colorBody: string;
  /** SVG children in currentColor, for mono use */
  readonly inkBody: string;
  readonly taglines: Readonly<Record<TcrnProductMarkLocale, string>>;
}

export const tcrnProductMarkWordmark = {
  "sans": {
    "family": "Hanken Grotesk",
    "weight": 600
  },
  "serif": {
    "family": "Source Serif 4",
    "weight": 400,
    "byline": "by TCRN"
  }
} as const;

export const tcrnProductMarks: readonly TcrnProductMark[] = [
  {
    "id": "tms",
    "productId": "tms",
    "name": "TCRN TMS",
    "word": "TCRN",
    "suffix": "TMS",
    "font": "sans",
    "palette": {
      "deep": "#2c63c8",
      "bright": "#7aa0f5",
      "tint": "#e4ecfc"
    },
    "colorBody": "<path d=\"M11 23L24 39\" stroke=\"#2c63c8\" stroke-width=\"9\" stroke-linecap=\"round\" fill=\"none\"/><path d=\"M37 23L24 39\" stroke=\"#7aa0f5\" stroke-width=\"9\" stroke-linecap=\"round\" fill=\"none\"/><circle cx=\"24\" cy=\"12.5\" r=\"8\" fill=\"#2c63c8\"/>",
    "inkBody": "<path d=\"M11 23L24 39\" stroke=\"currentColor\" stroke-width=\"9\" stroke-linecap=\"round\" fill=\"none\"/><path d=\"M37 23L24 39\" stroke=\"currentColor\" stroke-width=\"9\" stroke-linecap=\"round\" fill=\"none\"/><circle cx=\"24\" cy=\"12.5\" r=\"8\" fill=\"currentColor\"/>",
    "taglines": {
      "zh-CN": "艺人管理系统",
      "en": "Talent Management System",
      "ja": "タレントマネジメントシステム",
      "ko": "탤런트 관리 시스템",
      "fr": "Système de gestion des talents"
    }
  },
  {
    "id": "einzbern",
    "productId": "einzbern",
    "name": "Einzbern",
    "word": "Einzbern",
    "font": "serif",
    "palette": {
      "deep": "#3b5272",
      "bright": "#8aa6c9",
      "tint": "#e6ecf3"
    },
    "colorBody": "<circle cx=\"24\" cy=\"7.5\" r=\"3.5\" fill=\"#8aa6c9\"/><path d=\"M10 14A14 14 0 0 0 38 14Z\" fill=\"#3b5272\"/><rect x=\"15\" y=\"31\" width=\"18\" height=\"5\" rx=\"2.5\" fill=\"#8aa6c9\"/><rect x=\"11\" y=\"39\" width=\"26\" height=\"5\" rx=\"2.5\" fill=\"#3b5272\"/>",
    "inkBody": "<circle cx=\"24\" cy=\"7.5\" r=\"3.5\" fill=\"currentColor\"/><path d=\"M10 14A14 14 0 0 0 38 14Z\" fill=\"currentColor\"/><rect x=\"15\" y=\"31\" width=\"18\" height=\"5\" rx=\"2.5\" fill=\"currentColor\"/><rect x=\"11\" y=\"39\" width=\"26\" height=\"5\" rx=\"2.5\" fill=\"currentColor\"/>",
    "taglines": {
      "zh-CN": "项目记忆引擎",
      "en": "Project memory engine",
      "ja": "プロジェクト記憶エンジン",
      "ko": "프로젝트 메모리 엔진",
      "fr": "Moteur de mémoire de projet"
    }
  },
  {
    "id": "mana",
    "productId": "mana-orchestrate",
    "name": "Mana Orchestrate",
    "word": "Mana Orchestrate",
    "font": "serif",
    "palette": {
      "deep": "#3a9a63",
      "bright": "#9ddc8c",
      "tint": "#e5f5e6"
    },
    "colorBody": "<path d=\"M13 13C13 30 35 18 35 35\" stroke=\"#9ddc8c\" stroke-width=\"8\" stroke-linecap=\"round\" fill=\"none\"/><circle cx=\"13\" cy=\"13\" r=\"7\" fill=\"#3a9a63\"/><circle cx=\"35\" cy=\"35\" r=\"7\" fill=\"#3a9a63\"/>",
    "inkBody": "<path d=\"M13 13C13 30 35 18 35 35\" stroke=\"currentColor\" stroke-width=\"8\" stroke-linecap=\"round\" fill=\"none\"/><circle cx=\"13\" cy=\"13\" r=\"7\" fill=\"currentColor\"/><circle cx=\"35\" cy=\"35\" r=\"7\" fill=\"currentColor\"/>",
    "taglines": {
      "zh-CN": "项目记忆助手",
      "en": "Project memory assistant",
      "ja": "プロジェクト記憶アシスタント",
      "ko": "프로젝트 메모리 어시스턴트",
      "fr": "Assistant mémoire de projet"
    }
  },
  {
    "id": "ds",
    "productId": "design-system",
    "name": "TCRN Design System",
    "word": "TCRN",
    "suffix": "Design System",
    "font": "sans",
    "palette": {
      "deep": "#6577f3",
      "bright": "#3096f4",
      "c3": "#43d4cf",
      "c4": "#78b957",
      "tint": "#eceefc"
    },
    "colorBody": "<rect x=\"4\" y=\"4\" width=\"17\" height=\"40\" rx=\"4\" fill=\"#6577f3\"/><rect x=\"24\" y=\"4\" width=\"20\" height=\"17\" rx=\"4\" fill=\"#3096f4\"/><rect x=\"24\" y=\"24\" width=\"9\" height=\"20\" rx=\"3\" fill=\"#43d4cf\"/><rect x=\"36\" y=\"24\" width=\"8\" height=\"20\" rx=\"3\" fill=\"#78b957\"/>",
    "inkBody": "<rect x=\"4\" y=\"4\" width=\"17\" height=\"40\" rx=\"4\" fill=\"currentColor\"/><rect x=\"24\" y=\"4\" width=\"20\" height=\"17\" rx=\"4\" fill=\"currentColor\"/><rect x=\"24\" y=\"24\" width=\"9\" height=\"20\" rx=\"3\" fill=\"currentColor\"/><rect x=\"36\" y=\"24\" width=\"8\" height=\"20\" rx=\"3\" fill=\"currentColor\"/>",
    "taglines": {
      "zh-CN": "设计系统",
      "en": "Design System",
      "ja": "デザインシステム",
      "ko": "디자인 시스템",
      "fr": "Système de design"
    }
  }
];
