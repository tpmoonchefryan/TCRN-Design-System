// 由 docs/design/gplus-2026-10/contract 生成，勿手改（node scripts/contract-generate.mjs）。
// contract files: typography.json, tokens.json
// contract-sha256: 8ef7dba7ef3ec0faea98c1fe2b1ba7f4e43a7d5d52ecbd8f6441caf67af18b6b

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
.tcrn-link{color:var(--tcrn-pair-ink);text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:2px;text-decoration-color:var(--tcrn-pair-underline);border-radius:2px;box-shadow:var(--tcrn-pair-edge)}
.tcrn-link{--tcrn-pair-ink:var(--tcrn-pair-ink-d);--tcrn-pair-underline:var(--tcrn-pair-underline-d);--tcrn-pair-edge:var(--tcrn-pair-edge-d)}
.tcrn-link{--tcrn-pair-ink-d:var(--tcrn-color-acc);--tcrn-pair-underline-d:var(--tcrn-color-acc-ul);--tcrn-pair-edge-d:0 0 #0000;--tcrn-pair-ink-h:var(--tcrn-color-acc-2);--tcrn-pair-underline-h:var(--tcrn-color-acc-2);--tcrn-pair-edge-f:var(--tcrn-focus-ring)}
.tcrn-link.tcrn-link--quiet{--tcrn-pair-ink-d:currentColor;--tcrn-pair-underline-d:transparent;--tcrn-pair-ink-h:var(--tcrn-color-acc-2);--tcrn-pair-underline-h:var(--tcrn-color-acc-2)}
.tcrn-link:where(:hover,[data-tcrn-preview-state="hover"]){--tcrn-pair-ink:var(--tcrn-pair-ink-h);--tcrn-pair-underline:var(--tcrn-pair-underline-h)}
.tcrn-link:where(:focus-visible,[data-tcrn-preview-state="focus"]){--tcrn-pair-edge:var(--tcrn-pair-edge-f)}
.tcrn-highlight__mark{background:var(--tcrn-color-acc-bg);color:inherit;font:inherit;letter-spacing:inherit;padding:0;margin:0;border-radius:2px;box-shadow:0 0 0 2px var(--tcrn-color-acc-bg);box-decoration-break:clone;-webkit-box-decoration-break:clone}
`;
