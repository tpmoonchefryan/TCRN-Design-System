# INIT-015 R2 · 批末 verify 逐步结果

- 被验：集成分支 `claude/init015-gplus-renewal` HEAD e643d74（P1–P12 与集成修复 I1 全部合入）。
- 跑法：会话 scratch `tools/run-verify-steps-v2.mjs` 按根脚本 `verify` 的 30 步顺序跑，遇红继续；复合步 `tokens:proof`（12 段）与 `internal-alpha:proof`（4 段）逐段跑，共 44 段。逐段日志在会话 scratch `r2-verify/`（文件名为段号与命令），不入仓。
- 结果：30 步红 6 步（R1 为 11 步）；44 段红 7 段。真实 `pnpm verify` 是 `&&` 链，会停在第 10 步。
- 跑完工作树改写了三份 internal-alpha 回执并新出一个未跟踪文件（intentional-diff-manifest 少了 R2 选择带来的 2669 行，因为 browser-proof 不带 `--update-visual-baseline`；internal-vocabulary-scan 的 scannedPages 35→37，即入仓回执漏了两张 G+ 页；no-overclaim-scan 的 scannedFiles 604→605；visual-selection-result.json）。已存档到 scratch `r2-verify/receipts-dirty/` 并还原为入仓版本。

| 段 | 命令 | 退出码 | 秒 |
| --- | --- | --- | --- |
| 01 | `pnpm install --frozen-lockfile` | 0 | 1 |
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
| 10 | `pnpm geometry:proof` | 1 | 99 |
| 11 | `pnpm shell:parity` | 1 | 71 |
| 12 | `pnpm doc-shell:proof` | 0 | 1 |
| 13 | `pnpm contract:static` | 0 | 2 |
| 14 | `pnpm brand-asset:proof` | 0 | 1 |
| 15 | `pnpm exports:check` | 0 | 0 |
| 16 | `pnpm pack:smoke` | 0 | 1 |
| 17 | `pnpm storybook:smoke` | 1 | 103 |
| 18 | `pnpm geometry:measure` | 1 | 41 |
| 19 | `pnpm storybook:visual-proof` | 1 | 31 |
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
| 30.02 | `pnpm internal-alpha:browser-proof` | 1 | 142 |
| 30.03 | `pnpm scan` | 0 | 0 |
| 30.04 | `node scripts/internal-alpha-hardening-proof.mjs` | 1 | 0 |

## 红步与归因（主线程按门输出的失败字段归并；逐 GWT 的判定见三片验收）

| 步 | 失败字段（门输出） | 归因 |
| --- | --- | --- |
| 10 geometry:proof | `searchOverlay.baseline` 为 false（badge、brand、copy 的 broken 是变异，按设计判红） | 导航壳故事搜索结果浮层压住正文：SUB-080 未达成（RM15） |
| 11 shell:parity | baseline 19 个角色中 3 个红（文档壳 brand-lockup、sidebar、shell-relations），brandLockup 矩阵 4/4 红，sampleShell baseline 2/9 红 | 文档壳跟随包壳几何 C-21 与样板壳几何，待 O-1 |
| 17 storybook:smoke | productShellComparatorProof：`desktop:searchInput:focus-outline-width:3px`；designSystemVisualInstanceParityReadback、ownerQualityProductShellProof 为 false | 门的期望值在 outline-style 为 none 时仍读到 3px（RM15 #3）；其余两项待验收按日志核对是否同根或为文档顶栏搜索包裹层作画（RM15 #4） |
| 18 geometry:measure | runs 20 个中 10 个红 | 五个样板浅色与夜间的 rail 偏 33px，待 O-1 |
| 19 storybook:visual-proof | rows 22 行中 10 行红 | 同上，样板行 rail，待 O-1 |
| 30.02 internal-alpha:browser-proof | axeViolationCount 12；storyCoverageManifestOk false（mobileHashAnchorOcclusionCheck）；localeLeakZhCnNewLeaks 3；visualSignatureRegressions 155、NewBaselines 30 | axe 为品牌锁定组合与标语 ink-3 对比（O-2）；手机视口文档顶栏过高（C-21/O-1）；foundation-visual-standards 三条漏译（RM16 ④，P5 引入）；视觉基线未应用（P12 问题 1：门在非视觉检查红时拒绝写入基线） |
| 30.04 hardening | ok false，axeViolationCount 12 | 由 30.02 派生，不是独立根因 |

R1 红而 R2 转绿的步：6 tokens:proof（12 段全绿）、13 contract:static、20 doc:sample-style、25 internal-vocab:scan、28 full-surface:proof。故事高度预算（storyHeightBudgetOk）、clipped、buttonFeedback 已转绿。
