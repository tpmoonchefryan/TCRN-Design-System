// 由 docs/design/gplus-2026-10/contract 生成，勿手改（node scripts/contract-generate.mjs）。
// contract files: typography.json, tokens.json
// contract-sha256: 0864cd24b586b4b3651e95b31fc6151f12576d6defa612c066ed34c868dea10c

/** 字体刻度段：Heading 1–4、Text size / tone / variant、numeral、caps、mono、链接、mark */
export const typographyScaleCss = `
.tcrn-heading--1{margin:0;font-family:var(--tcrn-type-family-serif);font-size:36px;line-height:40px;font-weight:400;letter-spacing:-.01em;color:var(--tcrn-color-ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tcrn-heading--2{margin:0;font-family:var(--tcrn-type-family-serif);font-size:26px;line-height:30px;font-weight:400;letter-spacing:-.005em;color:var(--tcrn-color-ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tcrn-heading--3{margin:0;font-family:var(--tcrn-type-family-serif);font-size:20px;line-height:26px;font-weight:400;letter-spacing:0;color:var(--tcrn-color-ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tcrn-heading--4{margin:0;font-family:var(--tcrn-type-family-ui);font-size:13px;line-height:20px;font-weight:600;color:var(--tcrn-color-ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tcrn-text{margin:0;font-size:13px;line-height:20px;color:var(--tcrn-color-ink-2)}
.tcrn-text.tcrn-text--body{font-size:13px;line-height:20px}
.tcrn-text.tcrn-text--reading{font-size:14px;line-height:22px}
.tcrn-text.tcrn-text--meta{font-size:12px;line-height:16px;color:var(--tcrn-color-ink-3)}
.tcrn-text.tcrn-text--caption{font-size:11px;line-height:16px;color:var(--tcrn-color-ink-3)}
.tcrn-text.tcrn-text--strong{color:var(--tcrn-color-ink);font-weight:600}
.tcrn-text.tcrn-text--numeral{font-family:var(--tcrn-type-family-serif);font-weight:300;font-size:26px;line-height:30px;letter-spacing:-.01em;color:var(--tcrn-color-ink);font-variant-numeric:tabular-nums lining-nums;display:inline-flex;align-items:baseline;gap:5px;white-space:nowrap}
.tcrn-text.tcrn-text--numeral small{font-family:var(--tcrn-type-family-ui);font-size:11px;line-height:16px;letter-spacing:.06em;color:var(--tcrn-color-ink-3);font-weight:500}
.tcrn-text.tcrn-text--numeral.tcrn-text--numeral-inline{font-size:16px;line-height:20px;font-weight:400;letter-spacing:0}
.tcrn-text.tcrn-text--numeral.tcrn-text--numeral-large{font-size:44px;line-height:48px}
.tcrn-text.tcrn-text--caps{font-family:var(--tcrn-type-family-ui);font-size:11px;line-height:16px;letter-spacing:.14em;text-transform:uppercase;color:var(--tcrn-color-ink-3);font-weight:500;white-space:nowrap}
.tcrn-text.tcrn-text--caps b{font-family:var(--tcrn-type-family-mono);color:var(--tcrn-color-ink);font-weight:500;margin-right:8px;letter-spacing:.04em}
.tcrn-text.tcrn-text--mono{font-family:var(--tcrn-type-family-mono);font-size:11.5px;line-height:16px;color:var(--tcrn-color-ink-2)}
.tcrn-link{color:var(--tcrn-color-acc);text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:2px;text-decoration-color:var(--tcrn-color-acc-ul);border-radius:2px}
.tcrn-link:where(:hover,[data-tcrn-preview-state="hover"]){color:var(--tcrn-color-acc-2);text-decoration-color:var(--tcrn-color-acc-2)}
.tcrn-link:where(:focus-visible,[data-tcrn-preview-state="focus"]){outline:none;box-shadow:var(--tcrn-focus-ring)}
.tcrn-highlight__mark{background:var(--tcrn-color-acc-bg);color:inherit;font:inherit;letter-spacing:inherit;padding:0;margin:0;border-radius:2px;box-shadow:0 0 0 2px var(--tcrn-color-acc-bg);box-decoration-break:clone;-webkit-box-decoration-break:clone}
`;
