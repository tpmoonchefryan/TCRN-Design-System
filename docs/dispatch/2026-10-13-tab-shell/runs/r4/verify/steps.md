# verify 逐步结果（复合步逐段）

| # | 命令 | 退出码 | 秒 | 日志 |
| --- | --- | --- | --- | --- |
| 01 | `pnpm install --frozen-lockfile` | 0 | 1 | 01-install_--frozen-lockfile.log |
| 02 | `pnpm typecheck` | 0 | 4 | 02-typecheck.log |
| 03 | `pnpm build` | 0 | 7 | 03-build.log |
| 04 | `pnpm dist:hygiene` | 0 | 0 | 04-dist:hygiene.log |
| 05 | `pnpm test` | 0 | 8 | 05-test.log |
| 06.01 | `node scripts/css-template-integrity-proof.mjs` | 0 | 0 | 06.01-scripts_css-template-integrity-proof.mjs.log |
| 06.02 | `node scripts/tokens-sync.mjs --check` | 0 | 0 | 06.02-scripts_tokens-sync.mjs_--check.log |
| 06.03 | `node scripts/demo-styles-sync.mjs --check` | 0 | 0 | 06.03-scripts_demo-styles-sync.mjs_--check.log |
| 06.04 | `node --test tests/token-contrast-proof.test.mjs` | 0 | 0 | 06.04---test_tests_token-contrast-proof.test.mjs.log |
| 06.05 | `node scripts/token-contrast-proof.mjs` | 0 | 0 | 06.05-scripts_token-contrast-proof.mjs.log |
| 06.06 | `node --test tests/token-deprecation-notice.test.mjs` | 0 | 1 | 06.06---test_tests_token-deprecation-notice.test.mjs.log |
| 06.07 | `node --test tests/fonts-proof.test.mjs` | 0 | 1 | 06.07---test_tests_fonts-proof.test.mjs.log |
| 06.08 | `node scripts/fonts-proof.mjs` | 0 | 1 | 06.08-scripts_fonts-proof.mjs.log |
| 06.09 | `node scripts/stamp-whitelist-proof.mjs` | 0 | 0 | 06.09-scripts_stamp-whitelist-proof.mjs.log |
| 06.10 | `node scripts/shell-fidelity-proof.mjs` | 0 | 0 | 06.10-scripts_shell-fidelity-proof.mjs.log |
| 06.11 | `node scripts/token-extension-proof.mjs` | 0 | 0 | 06.11-scripts_token-extension-proof.mjs.log |
| 06.12 | `node scripts/selection-grammar-proof.mjs` | 0 | 0 | 06.12-scripts_selection-grammar-proof.mjs.log |
| 07 | `pnpm contract:proof` | 0 | 1 | 07-contract:proof.log |
| 08 | `pnpm component-modifiers:proof` | 0 | 0 | 08-component-modifiers:proof.log |
| 09 | `pnpm badge-wrap:proof` | 0 | 1 | 09-badge-wrap:proof.log |
| 10 | `pnpm geometry:proof` | 0 | 100 | 10-geometry:proof.log |
| 11 | `pnpm shell:parity` | 0 | 38 | 11-shell:parity.log |
| 12 | `pnpm doc-shell:proof` | 0 | 1 | 12-doc-shell:proof.log |
| 13 | `pnpm contract:static` | 1 | 1 | 13-contract:static.log |
| 14 | `pnpm brand-asset:proof` | 0 | 1 | 14-brand-asset:proof.log |
| 15 | `pnpm exports:check` | 0 | 0 | 15-exports:check.log |
| 16 | `pnpm pack:smoke` | 0 | 1 | 16-pack:smoke.log |
| 17 | `pnpm storybook:smoke` | 0 | 37 | 17-storybook:smoke.log |
| 18 | `pnpm geometry:measure` | 1 | 126 | 18-geometry:measure.log |
| 19 | `pnpm storybook:visual-proof` | 0 | 32 | 19-storybook:visual-proof.log |
| 20 | `pnpm doc:sample-style` | 0 | 7 | 20-doc:sample-style.log |
| 21 | `pnpm fonts:render` | 0 | 24 | 21-fonts:render.log |
| 22 | `pnpm readme:proof` | 0 | 0 | 22-readme:proof.log |
| 23 | `pnpm public:naming:proof` | 0 | 0 | 23-public:naming:proof.log |
| 24 | `pnpm public-output:scan` | 0 | 0 | 24-public-output:scan.log |
| 25 | `pnpm internal-vocab:scan` | 0 | 0 | 25-internal-vocab:scan.log |
| 26 | `pnpm generic:scan` | 0 | 1 | 26-generic:scan.log |
| 27 | `pnpm ds:consumption:proof` | 0 | 5 | 27-ds:consumption:proof.log |
| 28 | `pnpm full-surface:proof` | 0 | 7 | 28-full-surface:proof.log |
| 29 | `pnpm scaffold:proof` | 0 | 0 | 29-scaffold:proof.log |
| 30.01 | `pnpm internal-alpha:contracts` | 0 | 1 | 30.01-internal-alpha:contracts.log |
| 30.02 | `pnpm internal-alpha:browser-proof` | 0 | 114 | 30.02-internal-alpha:browser-proof.log |
| 30.03 | `pnpm scan` | 0 | 1 | 30.03-scan.log |
| 30.04 | `node scripts/internal-alpha-hardening-proof.mjs` | 0 | 0 | 30.04-scripts_internal-alpha-hardening-proof.mjs.log |

步骤 30，红 2；段 44，红 2。

被验 HEAD `682fc94`（集成分支，R4 全部 5 个包合入后），2026-10-14T10:56:05Z 至 11:04:50Z；之后 `storybook:build` 退出 0（scratch `r4-verify/storybook-build.log`）。逐段日志在会话 scratch 的 `r4-verify/`；本表只留结果。跑完改写的 2 份回执与新生成的 `visual-selection-result.json` 已存档到 scratch `r4-verify/receipts-dirty/` 并从树上还原，树回到 `git status --short` 为空。

与 R3 批末（c45c529）相同，只剩两步红，主线程核对过红的内容：

- 13 `contract:static`：只有 C8 一族 15 条（`"clause": "C8"` 计数 15，其余条款 0），即 R3 判断的 O-19。
- 18 `geometry:measure`：几何八项与壳层 18 门里失败的只有 `markText`（`failed: ["markText"]`）；读数为 DS 侧栏首行 `ink-mark` 1.4（4 次运行）与底栏 TMS 锁定块 en 1.7（6 处），即 O-4。
