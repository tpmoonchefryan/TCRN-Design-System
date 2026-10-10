// 由 docs/design/gplus-2026-10/contract 生成，勿手改（node scripts/contract-generate.mjs）。
// contract files: tokens.json, marks.json
// contract-sha256: 3d00937e268dfb28649d7a28d9b47508372d872896456b330386ea4f98a70007


export interface TcrnGplusThemedToken {
  readonly key: string;
  readonly cssVar: string;
  readonly group: string;
  readonly light: string;
  readonly dark: string;
}

export interface TcrnGplusFixedToken {
  readonly key: string;
  readonly cssVar: string;
  readonly group: string;
  readonly value: string;
}

/** light values go on :root, dark values on the dark-theme selector; fixed and brand tokens are theme independent */
export const tcrnGplusThemeSelectors = { light: ":root", dark: "[data-tcrn-theme=\"dark\"]" } as const;

export const tcrnGplusThemedTokens: readonly TcrnGplusThemedToken[] = [
  {
    "key": "bg",
    "cssVar": "--tcrn-color-bg",
    "group": "color",
    "light": "#efeeea",
    "dark": "#121210"
  },
  {
    "key": "bg-2",
    "cssVar": "--tcrn-color-bg-2",
    "group": "color",
    "light": "#e7e5df",
    "dark": "#0d0d0b"
  },
  {
    "key": "panel",
    "cssVar": "--tcrn-color-panel",
    "group": "color",
    "light": "#ffffff",
    "dark": "#191916"
  },
  {
    "key": "panel-2",
    "cssVar": "--tcrn-color-panel-2",
    "group": "color",
    "light": "#f8f7f3",
    "dark": "#1f1f1b"
  },
  {
    "key": "line",
    "cssVar": "--tcrn-color-line",
    "group": "color",
    "light": "rgba(22,21,15,.09)",
    "dark": "rgba(255,255,255,.07)"
  },
  {
    "key": "line-2",
    "cssVar": "--tcrn-color-line-2",
    "group": "color",
    "light": "rgba(22,21,15,.16)",
    "dark": "rgba(255,255,255,.13)"
  },
  {
    "key": "line-3",
    "cssVar": "--tcrn-color-line-3",
    "group": "color",
    "light": "rgba(22,21,15,.30)",
    "dark": "rgba(255,255,255,.26)"
  },
  {
    "key": "line-ctl",
    "cssVar": "--tcrn-color-line-ctl",
    "group": "color",
    "light": "rgba(22,21,15,.47)",
    "dark": "rgba(255,255,255,.36)"
  },
  {
    "key": "rule",
    "cssVar": "--tcrn-color-rule",
    "group": "color",
    "light": "#16150f",
    "dark": "#ebe8df"
  },
  {
    "key": "ink",
    "cssVar": "--tcrn-color-ink",
    "group": "color",
    "light": "#16150f",
    "dark": "#ebe8df"
  },
  {
    "key": "ink-2",
    "cssVar": "--tcrn-color-ink-2",
    "group": "color",
    "light": "#4f4c43",
    "dark": "#a9a69c"
  },
  {
    "key": "ink-3",
    "cssVar": "--tcrn-color-ink-3",
    "group": "color",
    "light": "#6b675d",
    "dark": "#85827a"
  },
  {
    "key": "acc",
    "cssVar": "--tcrn-color-acc",
    "group": "color",
    "light": "#0b6b65",
    "dark": "#3fc7b7"
  },
  {
    "key": "acc-2",
    "cssVar": "--tcrn-color-acc-2",
    "group": "color",
    "light": "#0a5f5a",
    "dark": "#5ad3c5"
  },
  {
    "key": "acc-3",
    "cssVar": "--tcrn-color-acc-3",
    "group": "color",
    "light": "#084f4a",
    "dark": "#34b3a4"
  },
  {
    "key": "acc-bg",
    "cssVar": "--tcrn-color-acc-bg",
    "group": "color",
    "light": "rgba(11,107,101,.08)",
    "dark": "rgba(63,199,183,.10)"
  },
  {
    "key": "acc-ul",
    "cssVar": "--tcrn-color-acc-ul",
    "group": "color",
    "light": "rgba(11,107,101,.7)",
    "dark": "rgba(63,199,183,.7)"
  },
  {
    "key": "on-acc",
    "cssVar": "--tcrn-color-on-acc",
    "group": "color",
    "light": "#ffffff",
    "dark": "#07211e"
  },
  {
    "key": "red",
    "cssVar": "--tcrn-color-red",
    "group": "color",
    "light": "#8e2d24",
    "dark": "#d98d82"
  },
  {
    "key": "red-bg",
    "cssVar": "--tcrn-color-red-bg",
    "group": "color",
    "light": "rgba(142,45,36,.06)",
    "dark": "rgba(217,141,130,.08)"
  },
  {
    "key": "red-bg-2",
    "cssVar": "--tcrn-color-red-bg-2",
    "group": "color",
    "light": "rgba(142,45,36,.11)",
    "dark": "rgba(217,141,130,.14)"
  },
  {
    "key": "ok",
    "cssVar": "--tcrn-color-ok",
    "group": "color",
    "light": "#2f6b3a",
    "dark": "#6fcf97"
  },
  {
    "key": "warn",
    "cssVar": "--tcrn-color-warn",
    "group": "color",
    "light": "#8a5a08",
    "dark": "#d9ab52"
  },
  {
    "key": "bad",
    "cssVar": "--tcrn-color-bad",
    "group": "color",
    "light": "#a8321f",
    "dark": "#e5897b"
  },
  {
    "key": "bad-bg",
    "cssVar": "--tcrn-color-bad-bg",
    "group": "color",
    "light": "rgba(168,50,31,.08)",
    "dark": "rgba(229,137,123,.10)"
  },
  {
    "key": "wash",
    "cssVar": "--tcrn-color-wash",
    "group": "color",
    "light": "rgba(22,21,15,.06)",
    "dark": "rgba(235,232,223,.07)"
  },
  {
    "key": "hover",
    "cssVar": "--tcrn-color-hover",
    "group": "color",
    "light": "rgba(22,21,15,.035)",
    "dark": "rgba(235,232,223,.04)"
  },
  {
    "key": "dis",
    "cssVar": "--tcrn-color-dis",
    "group": "color",
    "light": "rgba(22,21,15,.05)",
    "dark": "rgba(235,232,223,.05)"
  },
  {
    "key": "s1",
    "cssVar": "--tcrn-shadow-s1",
    "group": "shadow",
    "light": "0 1px 1px rgba(22,21,15,.04),0 0 0 1px rgba(22,21,15,.07)",
    "dark": "0 1px 1px rgba(0,0,0,.3),0 0 0 1px rgba(255,255,255,.06)"
  },
  {
    "key": "s2",
    "cssVar": "--tcrn-shadow-s2",
    "group": "shadow",
    "light": "0 1px 2px rgba(22,21,15,.05),0 2px 3px rgba(22,21,15,.04),0 0 0 1px rgba(22,21,15,.08)",
    "dark": "0 1px 2px rgba(0,0,0,.35),0 2px 3px rgba(0,0,0,.3),0 0 0 1px rgba(255,255,255,.07)"
  },
  {
    "key": "s3",
    "cssVar": "--tcrn-shadow-s3",
    "group": "shadow",
    "light": "0 2px 3px rgba(22,21,15,.06),0 3px 3px rgba(22,21,15,.06),0 0 0 1px rgba(22,21,15,.10)",
    "dark": "0 2px 3px rgba(0,0,0,.4),0 3px 3px rgba(0,0,0,.4),0 0 0 1px rgba(255,255,255,.09)"
  },
  {
    "key": "glass",
    "cssVar": "--tcrn-color-glass",
    "group": "color",
    "light": "rgba(255,255,255,.78)",
    "dark": "rgba(25,25,22,.74)"
  },
  {
    "key": "edge",
    "cssVar": "--tcrn-shadow-edge",
    "group": "shadow",
    "light": "inset 0 0 0 1px rgba(255,255,255,.8)",
    "dark": "inset 0 1px 0 rgba(255,255,255,.06)"
  },
  {
    "key": "grain",
    "cssVar": "--tcrn-grain-opacity",
    "group": "texture",
    "light": ".035",
    "dark": ".06"
  },
  {
    "key": "blend",
    "cssVar": "--tcrn-grain-blend",
    "group": "texture",
    "light": "multiply",
    "dark": "screen"
  },
  {
    "key": "av-bg",
    "cssVar": "--tcrn-color-av-bg",
    "group": "color",
    "light": "#e7e5df",
    "dark": "#2a2a26"
  },
  {
    "key": "av-ink",
    "cssVar": "--tcrn-color-av-ink",
    "group": "color",
    "light": "#16150f",
    "dark": "#ebe8df"
  },
  {
    "key": "knob",
    "cssVar": "--tcrn-color-knob",
    "group": "color",
    "light": "#ffffff",
    "dark": "#ffffff"
  },
  {
    "key": "chrome",
    "cssVar": "--tcrn-color-chrome",
    "group": "color",
    "light": "rgba(239,238,234,.82)",
    "dark": "rgba(18,18,16,.82)"
  }
];

export const tcrnGplusFixedTokens: readonly TcrnGplusFixedToken[] = [
  {
    "key": "surface",
    "cssVar": "--tcrn-color-surface",
    "group": "color",
    "value": "var(--tcrn-color-bg)"
  },
  {
    "key": "focus",
    "cssVar": "--tcrn-focus-ring",
    "group": "focus",
    "value": "0 0 0 2px var(--tcrn-color-surface),0 0 0 4px var(--tcrn-color-acc)"
  },
  {
    "key": "serif",
    "cssVar": "--tcrn-type-family-serif",
    "group": "type-family",
    "value": "\"Source Serif 4\",\"Noto Serif SC\",Georgia,serif"
  },
  {
    "key": "sans",
    "cssVar": "--tcrn-type-family-ui",
    "group": "type-family",
    "value": "\"Hanken Grotesk\",\"Noto Sans SC\",system-ui,sans-serif"
  },
  {
    "key": "mono",
    "cssVar": "--tcrn-type-family-mono",
    "group": "type-family",
    "value": "\"IBM Plex Mono\",ui-monospace,Menlo,monospace"
  },
  {
    "key": "r-ctl",
    "cssVar": "--tcrn-radius-control",
    "group": "radius",
    "value": "8px"
  },
  {
    "key": "r-sm",
    "cssVar": "--tcrn-radius-small",
    "group": "radius",
    "value": "6px"
  },
  {
    "key": "r-panel",
    "cssVar": "--tcrn-radius-panel",
    "group": "radius",
    "value": "12px"
  },
  {
    "key": "r-check",
    "cssVar": "--tcrn-radius-check",
    "group": "radius",
    "value": "4px"
  },
  {
    "key": "r-stamp",
    "cssVar": "--tcrn-radius-stamp",
    "group": "radius",
    "value": "3px"
  },
  {
    "key": "h-sm",
    "cssVar": "--tcrn-control-height-sm",
    "group": "control-height",
    "value": "28px"
  },
  {
    "key": "h-md",
    "cssVar": "--tcrn-control-height-md",
    "group": "control-height",
    "value": "32px"
  },
  {
    "key": "h-lg",
    "cssVar": "--tcrn-control-height-lg",
    "group": "control-height",
    "value": "40px"
  },
  {
    "key": "pad-sm",
    "cssVar": "--tcrn-control-padding-sm",
    "group": "control-padding",
    "value": "10px"
  },
  {
    "key": "pad-md",
    "cssVar": "--tcrn-control-padding-md",
    "group": "control-padding",
    "value": "12px"
  },
  {
    "key": "pad-lg",
    "cssVar": "--tcrn-control-padding-lg",
    "group": "control-padding",
    "value": "16px"
  },
  {
    "key": "fs-sm",
    "cssVar": "--tcrn-type-size-control-sm",
    "group": "type-size",
    "value": "12px"
  },
  {
    "key": "fs-md",
    "cssVar": "--tcrn-type-size-control",
    "group": "type-size",
    "value": "13px"
  },
  {
    "key": "fs-lg",
    "cssVar": "--tcrn-type-size-control-lg",
    "group": "type-size",
    "value": "14px"
  },
  {
    "key": "ico-sm",
    "cssVar": "--tcrn-icon-size-sm",
    "group": "icon-size",
    "value": "14px"
  },
  {
    "key": "ico-md",
    "cssVar": "--tcrn-icon-size-md",
    "group": "icon-size",
    "value": "16px"
  },
  {
    "key": "ico-lg",
    "cssVar": "--tcrn-icon-size-lg",
    "group": "icon-size",
    "value": "20px"
  },
  {
    "key": "ease",
    "cssVar": "--tcrn-motion-ease",
    "group": "motion",
    "value": "cubic-bezier(.22,1,.36,1)"
  },
  {
    "key": "t-fill",
    "cssVar": "--tcrn-motion-duration-fill",
    "group": "motion",
    "value": "120ms"
  },
  {
    "key": "t-press",
    "cssVar": "--tcrn-motion-duration-press",
    "group": "motion",
    "value": "80ms"
  },
  {
    "key": "t-move",
    "cssVar": "--tcrn-motion-duration-move",
    "group": "motion",
    "value": "240ms"
  },
  {
    "key": "t-loop",
    "cssVar": "--tcrn-motion-duration-loop",
    "group": "motion",
    "value": "900ms"
  }
];

export const tcrnGplusBrandTokens: readonly TcrnGplusFixedToken[] = [
  {
    "key": "brand-suffix-tms",
    "cssVar": "--tcrn-brand-suffix-tms",
    "group": "brand",
    "value": "#2c63c8"
  },
  {
    "key": "brand-suffix-einzbern",
    "cssVar": "--tcrn-brand-suffix-einzbern",
    "group": "brand",
    "value": "#3b5272"
  },
  {
    "key": "brand-suffix-mana-orchestrate",
    "cssVar": "--tcrn-brand-suffix-mana-orchestrate",
    "group": "brand",
    "value": "#3a9a63"
  },
  {
    "key": "brand-suffix-design-system",
    "cssVar": "--tcrn-brand-suffix-design-system",
    "group": "brand",
    "value": "#6577f3"
  }
];
