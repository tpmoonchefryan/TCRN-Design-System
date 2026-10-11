// 由 docs/design/gplus-2026-10/contract 生成，勿手改（node scripts/contract-generate.mjs）。
// contract files: typography.json, tokens.json
// contract-sha256: 2cba04c6d0c05e5102e99780f6fcd46cdc9e88df6c3b51f62d22023fe86bd24f

/** 字体刻度段：Heading 1–4、Text size / tone / variant、numeral、caps、mono、链接、mark */
export const typographyScaleCss = `
.tcrn-heading--1{margin:0;font-family:var(--tcrn-type-family-serif);font-size:var(--tcrn-type-size-page);line-height:var(--tcrn-type-line-page);font-weight:var(--tcrn-type-weight-regular);letter-spacing:-.01em;color:var(--tcrn-color-ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tcrn-heading--2{margin:0;font-family:var(--tcrn-type-family-serif);font-size:var(--tcrn-type-size-heading-2);line-height:var(--tcrn-type-line-heading-2);font-weight:var(--tcrn-type-weight-regular);letter-spacing:-.005em;color:var(--tcrn-color-ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tcrn-heading--3{margin:0;font-family:var(--tcrn-type-family-serif);font-size:var(--tcrn-type-size-heading-3);line-height:var(--tcrn-type-line-heading-3);font-weight:var(--tcrn-type-weight-regular);letter-spacing:0;color:var(--tcrn-color-ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tcrn-heading--4{margin:0;font-family:var(--tcrn-type-family-ui);font-size:var(--tcrn-type-size-ui);line-height:var(--tcrn-type-line-ui);font-weight:var(--tcrn-type-weight-semibold);color:var(--tcrn-color-ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tcrn-text{margin:0;font-size:var(--tcrn-type-size-ui);line-height:var(--tcrn-type-line-ui);color:var(--tcrn-color-ink-2)}
.tcrn-text.tcrn-text--body{font-size:var(--tcrn-type-size-body);line-height:var(--tcrn-type-line-body)}
.tcrn-text.tcrn-text--reading{font-size:var(--tcrn-type-size-reading);line-height:var(--tcrn-type-line-reading)}
.tcrn-text.tcrn-text--meta{font-size:var(--tcrn-type-size-meta);line-height:var(--tcrn-type-line-meta);color:var(--tcrn-color-ink-3)}
.tcrn-text.tcrn-text--caption{font-size:var(--tcrn-type-size-caption);line-height:var(--tcrn-type-line-caption);color:var(--tcrn-color-ink-3)}
.tcrn-text.tcrn-text--strong{color:var(--tcrn-color-ink);font-weight:var(--tcrn-type-weight-strong)}
.tcrn-text.tcrn-text--numeral{font-family:var(--tcrn-type-family-serif);font-weight:var(--tcrn-type-weight-light);font-size:var(--tcrn-type-size-heading-2);line-height:var(--tcrn-type-line-heading-2);letter-spacing:-.01em;color:var(--tcrn-color-ink);font-variant-numeric:var(--tcrn-type-numeric-tabular);display:inline-flex;align-items:baseline;gap:5px;white-space:nowrap}
.tcrn-text.tcrn-text--numeral small{font-family:var(--tcrn-type-family-ui);font-size:var(--tcrn-type-size-caption);line-height:var(--tcrn-type-line-caption);letter-spacing:.06em;color:var(--tcrn-color-ink-3);font-weight:var(--tcrn-type-weight-medium)}
.tcrn-text.tcrn-text--numeral.tcrn-text--numeral-inline{font-size:16px;line-height:var(--tcrn-type-line-ui);font-weight:var(--tcrn-type-weight-regular);letter-spacing:0}
.tcrn-text.tcrn-text--numeral.tcrn-text--numeral-large{font-size:44px;line-height:48px}
.tcrn-text.tcrn-text--caps{font-family:var(--tcrn-type-family-ui);font-size:var(--tcrn-type-size-caption);line-height:var(--tcrn-type-line-caption);letter-spacing:var(--tcrn-type-tracking-caps);text-transform:uppercase;color:var(--tcrn-color-ink-3);font-weight:var(--tcrn-type-weight-medium);white-space:nowrap}
.tcrn-text.tcrn-text--caps b{font-family:var(--tcrn-type-family-mono);color:var(--tcrn-color-ink);font-weight:var(--tcrn-type-weight-medium);margin-right:8px;letter-spacing:.04em}
.tcrn-text.tcrn-text--mono{font-family:var(--tcrn-type-family-mono);font-size:11.5px;line-height:var(--tcrn-type-line-caption);color:var(--tcrn-color-ink-2)}
.tcrn-link{color:var(--tcrn-color-acc);text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:2px;text-decoration-color:var(--tcrn-color-acc-ul);border-radius:2px}
.tcrn-link:where(:hover,[data-tcrn-preview-state="hover"]){color:var(--tcrn-color-acc-2);text-decoration-color:var(--tcrn-color-acc-2)}
.tcrn-link:where(:focus-visible,[data-tcrn-preview-state="focus"]){outline:none;box-shadow:var(--tcrn-focus-ring)}
.tcrn-highlight__mark{background:var(--tcrn-color-acc-bg);color:inherit;font:inherit;letter-spacing:inherit;padding:0;margin:0;border-radius:2px;box-shadow:0 0 0 2px var(--tcrn-color-acc-bg);box-decoration-break:clone;-webkit-box-decoration-break:clone}
`;
