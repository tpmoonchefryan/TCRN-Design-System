# verify 逐步结果（复合步逐段）

| # | 命令 | 退出码 | 秒 | 日志 |
| --- | --- | --- | --- | --- |
| 01 | `pnpm install --frozen-lockfile` | 0 | 1 | 01-install_--frozen-lockfile.log |
| 02 | `pnpm typecheck` | 0 | 8 | 02-typecheck.log |
| 03 | `pnpm build` | 0 | 15 | 03-build.log |
| 04 | `pnpm dist:hygiene` | 0 | 0 | 04-dist:hygiene.log |
| 05 | `pnpm test` | 0 | 16 | 05-test.log |
| 06.01 | `node scripts/css-template-integrity-proof.mjs` | 0 | 1 | 06.01-scripts_css-template-integrity-proof.mjs.log |
| 06.02 | `node scripts/tokens-sync.mjs --check` | 0 | 0 | 06.02-scripts_tokens-sync.mjs_--check.log |
| 06.03 | `node scripts/demo-styles-sync.mjs --check` | 0 | 0 | 06.03-scripts_demo-styles-sync.mjs_--check.log |
| 06.04 | `node --test tests/token-contrast-proof.test.mjs` | 0 | 1 | 06.04---test_tests_token-contrast-proof.test.mjs.log |
| 06.05 | `node scripts/token-contrast-proof.mjs` | 0 | 0 | 06.05-scripts_token-contrast-proof.mjs.log |
| 06.06 | `node --test tests/token-deprecation-notice.test.mjs` | 0 | 1 | 06.06---test_tests_token-deprecation-notice.test.mjs.log |
| 06.07 | `node --test tests/fonts-proof.test.mjs` | 0 | 2 | 06.07---test_tests_fonts-proof.test.mjs.log |
| 06.08 | `node scripts/fonts-proof.mjs` | 0 | 1 | 06.08-scripts_fonts-proof.mjs.log |
| 06.09 | `node scripts/stamp-whitelist-proof.mjs` | 0 | 0 | 06.09-scripts_stamp-whitelist-proof.mjs.log |
| 06.10 | `node scripts/shell-fidelity-proof.mjs` | 0 | 0 | 06.10-scripts_shell-fidelity-proof.mjs.log |
| 06.11 | `node scripts/token-extension-proof.mjs` | 0 | 1 | 06.11-scripts_token-extension-proof.mjs.log |
| 06.12 | `node scripts/selection-grammar-proof.mjs` | 0 | 0 | 06.12-scripts_selection-grammar-proof.mjs.log |
| 07 | `pnpm contract:proof` | 0 | 1 | 07-contract:proof.log |
| 08 | `pnpm component-modifiers:proof` | 0 | 0 | 08-component-modifiers:proof.log |
| 09 | `pnpm badge-wrap:proof` | 0 | 1 | 09-badge-wrap:proof.log |
| 10 | `pnpm geometry:proof` | 1 | 102 | 10-geometry:proof.log |
| 11 | `pnpm shell:parity` | 1 | 38 | 11-shell:parity.log |
| 12 | `pnpm doc-shell:proof` | 0 | 2 | 12-doc-shell:proof.log |
| 13 | `pnpm contract:static` | 1 | 1 | 13-contract:static.log |
| 14 | `pnpm brand-asset:proof` | 0 | 1 | 14-brand-asset:proof.log |
| 15 | `pnpm exports:check` | 0 | 0 | 15-exports:check.log |
| 16 | `pnpm pack:smoke` | 0 | 2 | 16-pack:smoke.log |
| 17 | `pnpm storybook:smoke` | 1 | 44 | 17-storybook:smoke.log |
| 18 | `pnpm geometry:measure` | 1 | 54 | 18-geometry:measure.log |
| 19 | `pnpm storybook:visual-proof` | 1 | 34 | 19-storybook:visual-proof.log |
| 20 | `pnpm doc:sample-style` | 0 | 11 | 20-doc:sample-style.log |
| 21 | `pnpm fonts:render` | 0 | 24 | 21-fonts:render.log |
| 22 | `pnpm readme:proof` | 0 | 0 | 22-readme:proof.log |
| 23 | `pnpm public:naming:proof` | 0 | 0 | 23-public:naming:proof.log |
| 24 | `pnpm public-output:scan` | 0 | 0 | 24-public-output:scan.log |
| 25 | `pnpm internal-vocab:scan` | 0 | 0 | 25-internal-vocab:scan.log |
| 26 | `pnpm generic:scan` | 0 | 1 | 26-generic:scan.log |
| 27 | `pnpm ds:consumption:proof` | 0 | 6 | 27-ds:consumption:proof.log |
| 28 | `pnpm full-surface:proof` | 0 | 8 | 28-full-surface:proof.log |
| 29 | `pnpm scaffold:proof` | 0 | 0 | 29-scaffold:proof.log |
| 30.01 | `pnpm internal-alpha:contracts` | 0 | 1 | 30.01-internal-alpha:contracts.log |
| 30.02 | `pnpm internal-alpha:browser-proof` | 1 | 129 | 30.02-internal-alpha:browser-proof.log |
| 30.03 | `pnpm scan` | 0 | 1 | 30.03-scan.log |
| 30.04 | `node scripts/internal-alpha-hardening-proof.mjs` | 1 | 0 | 30.04-scripts_internal-alpha-hardening-proof.mjs.log |

步骤 30，红 7；段 44，红 8。

被验 HEAD `6f739b2`（集成分支，R2 全部 13 个包合入后），2026-10-14T02:14:58Z 至 02:23:36Z；之后 `storybook:build` 退出 0（scratch `r2-verify/storybook-build.log`）。逐段日志与红段尾部 40 行在会话 scratch 的 `r2-verify/`（`NN.MM-*.log`、`summary.md`）；本表只留结果，红段读日志。跑完改写的 6 份回执与新生成的 `visual-selection-result.json` 已存档到 scratch `r2-verify/receipts-dirty/` 并从树上还原，树回到 `git status --short` 为空。

与 R1 批末（63e1ee2，30 步红 9、44 段红 12）相比：`test`、`tokens:proof`（fonts-proof、shell-fidelity 两段）、`full-surface:proof`、`scan` 转绿；`contract:static` 新红（R2 删到期豁免后余 C11 34 条与 `tests/contract-static-proof.test.mjs:524`，见 K4、K6b 交回）；其余红步沿用。
