# INIT-015 R3 · 批末 verify 结果

- 被验：集成分支 `claude/init015-gplus-renewal` HEAD 3f9d658（R3 六包与全部集成修复合入）。
- 逐段运行：会话 scratch `tools/run-verify-steps-v2.mjs` 按根脚本 `verify` 的 30 步顺序跑，复合步 `tokens:proof`（12 段）与 `internal-alpha:proof`（4 段）逐段跑，共 44 段：**30 步全绿、44 段全绿**（R2 为 6 步红，R1 为 11 步红）。逐段日志在会话 scratch `r3-verify/`。
- 真实运行：`corepack pnpm@10.12.1 run verify` 于 2026-10-12T22:28:47Z 至 22:38:07Z 在同一 HEAD 跑完，**退出码 0**；随后 `corepack pnpm@10.12.1 run storybook:build` **退出码 0**（22:38:09Z）。日志在会话 scratch `r3-final/verify.log`（2.8 MB）与 `r3-final/storybook-build.log`，时间与退出码在 `r3-final/verify.meta`。internal-alpha 末段读数：requiredStoryCount 66、screenshotCount 310、axeViolationCount 0。
- 两次运行后工作树都只多出同一类改动：`docs/verification/internal-alpha/no-overclaim-scan.json` 的 scannedFiles 643 → 646，以及未跟踪的 `visual-selection-result.json`（browser-proof 运行中生成、随后被扫描计入）。已存档到会话 scratch（`r3-verify/receipts-dirty/`、`r3-final/receipts-dirty/`）并还原为入仓版本；verify 本身不读这两处的入仓值，退出码不受影响。

| 段 | 命令 | 退出码 | 秒 |
| --- | --- | --- | --- |
| 01 | `pnpm install --frozen-lockfile` | 0 | 2 |
| 02 | `pnpm typecheck` | 0 | 4 |
| 03 | `pnpm build` | 0 | 7 |
| 04 | `pnpm dist:hygiene` | 0 | 0 |
| 05 | `pnpm test` | 0 | 7 |
| 06.01 | `node scripts/css-template-integrity-proof.mjs` | 0 | 0 |
| 06.02 | `node scripts/tokens-sync.mjs --check` | 0 | 0 |
| 06.03 | `node scripts/demo-styles-sync.mjs --check` | 0 | 0 |
| 06.04 | `node --test tests/token-contrast-proof.test.mjs` | 0 | 0 |
| 06.05 | `node scripts/token-contrast-proof.mjs` | 0 | 0 |
| 06.06 | `node --test tests/token-deprecation-notice.test.mjs` | 0 | 1 |
| 06.07 | `node --test tests/fonts-proof.test.mjs` | 0 | 1 |
| 06.08 | `node scripts/fonts-proof.mjs` | 0 | 0 |
| 06.09 | `node scripts/stamp-whitelist-proof.mjs` | 0 | 0 |
| 06.10 | `node scripts/shell-fidelity-proof.mjs` | 0 | 0 |
| 06.11 | `node scripts/token-extension-proof.mjs` | 0 | 0 |
| 06.12 | `node scripts/selection-grammar-proof.mjs` | 0 | 0 |
| 07 | `pnpm contract:proof` | 0 | 1 |
| 08 | `pnpm component-modifiers:proof` | 0 | 0 |
| 09 | `pnpm badge-wrap:proof` | 0 | 1 |
| 10 | `pnpm geometry:proof` | 0 | 100 |
| 11 | `pnpm shell:parity` | 0 | 71 |
| 12 | `pnpm doc-shell:proof` | 0 | 1 |
| 13 | `pnpm contract:static` | 0 | 2 |
| 14 | `pnpm brand-asset:proof` | 0 | 1 |
| 15 | `pnpm exports:check` | 0 | 0 |
| 16 | `pnpm pack:smoke` | 0 | 1 |
| 17 | `pnpm storybook:smoke` | 0 | 102 |
| 18 | `pnpm geometry:measure` | 0 | 46 |
| 19 | `pnpm storybook:visual-proof` | 0 | 33 |
| 20 | `pnpm doc:sample-style` | 0 | 7 |
| 21 | `pnpm fonts:render` | 0 | 25 |
| 22 | `pnpm readme:proof` | 0 | 0 |
| 23 | `pnpm public:naming:proof` | 0 | 0 |
| 24 | `pnpm public-output:scan` | 0 | 0 |
| 25 | `pnpm internal-vocab:scan` | 0 | 0 |
| 26 | `pnpm generic:scan` | 0 | 1 |
| 27 | `pnpm ds:consumption:proof` | 0 | 4 |
| 28 | `pnpm full-surface:proof` | 0 | 7 |
| 29 | `pnpm scaffold:proof` | 0 | 0 |
| 30.01 | `pnpm internal-alpha:contracts` | 0 | 1 |
| 30.02 | `pnpm internal-alpha:browser-proof` | 0 | 139 |
| 30.03 | `pnpm scan` | 0 | 0 |
| 30.04 | `node scripts/internal-alpha-hardening-proof.mjs` | 0 | 0 |
