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
| 10 | `pnpm geometry:proof` | 0 | 99 | 10-geometry:proof.log |
| 11 | `pnpm shell:parity` | 0 | 38 | 11-shell:parity.log |
| 12 | `pnpm doc-shell:proof` | 0 | 1 | 12-doc-shell:proof.log |
| 13 | `pnpm contract:static` | 1 | 1 | 13-contract:static.log |
| 14 | `pnpm brand-asset:proof` | 0 | 1 | 14-brand-asset:proof.log |
| 15 | `pnpm exports:check` | 0 | 0 | 15-exports:check.log |
| 16 | `pnpm pack:smoke` | 0 | 1 | 16-pack:smoke.log |
| 17 | `pnpm storybook:smoke` | 0 | 36 | 17-storybook:smoke.log |
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
| 30.02 | `pnpm internal-alpha:browser-proof` | 0 | 115 | 30.02-internal-alpha:browser-proof.log |
| 30.03 | `pnpm scan` | 0 | 1 | 30.03-scan.log |
| 30.04 | `node scripts/internal-alpha-hardening-proof.mjs` | 0 | 0 | 30.04-scripts_internal-alpha-hardening-proof.mjs.log |

步骤 30，红 2；段 44，红 2。

## 读数（主线程核对）

- 跑在 60ff2ef（R5 两包合入后），2026-10-14T13:08:11Z–13:16:54Z；`storybook:build` 退出 0。逐段日志在会话 scratch `r5-verify/`。
- 第 13 步 `contract:static`：findingCount 15，全是顶带 C8（`C8.yield-without-min-width` 1、`C8.story-yield-missing` 14），与 R4 相同，待 O-19。
- 第 18 步 `geometry:measure`：stories 模式 18 门只有 markText 红（DS 品牌首行 1.4、底栏 TMS 锁定块 en 1.7），与 R4 相同，待 O-4；夹具与变异全过。
- 其余 28 步与 44 段里的其余 42 段退出 0（含 test、geometry:proof、shell:parity、storybook:smoke、visual-proof、browser-proof 与 scan）。
- 跑后工作树：已跟踪文件改写 2 个（`docs/verification/internal-alpha/no-overclaim-scan.json` 的 scannedFiles 等、`docs/verification/scaffold-proof.json` 的输入摘要 2 行），未跟踪新生成 1 个（`docs/verification/internal-alpha/visual-selection-result.json`）；已存档到 scratch `r5-verify/receipts-dirty/`，未跟踪件移到 `trash/r5-verify/`，树已还原（`git status --short` 为空）。
