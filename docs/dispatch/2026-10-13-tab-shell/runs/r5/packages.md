# TCRN-DS-INIT-016 · R5 分包

4 张 Subtask 分 2 个包、2 个波次（判断 §5 与 §3.4 第 12 条：Q1 主力只做 R5-1；Q2 经济做 R5-2、R5-3、R5-4，Q1 合入后派，读 Q1 交回；包名用 Q1、Q2，避开前四轮的 P、K、M、N）。后一波从前一波合入后的集成分支 `claude/init016-tab-shell` 切出；包内按列出的顺序做。Subtask 的文件、判据与局部门见 `decomposition.md` 第 3 节；跨包约定见其第 1 节（C-1 至 C-17），每个包都必须遵守。

节行号：规则与校验 L7；共享登记处归属 L18；包表 L43；共享文件的先后 L52；期望对齐的接收 L62；各包局部门 L73；Q1 L75；Q2 L95。

## 规则与校验

- 同一波任意两个包的文件集不相交（含目录前缀重叠），每波并行包不超过 3（本轮每波 1 包）；`subtasks.json` 与 `subtasks-batch.json` 由脚本从 `decomposition.md` 第 3 节生成，包表按同一份数据写成，三者经脚本交叉校验通过：键号 TCRN-DS-SUB-225 至 228 连续，parentId 与链上 Story 导出一致，依赖都在更早的波或同包靠前、且跨包依赖都在前置包里，每包预计不超过 150，summary 都不超过 160 字节，R5-1 至 R5-4 每条至少被一张 Subtask 承接且挂在判断指定的 Story（R5-1 挂 146，R5-2、R5-3 挂 150，R5-4 挂 147），SUB-228（R5-3）是最后一个包的最后一张。
- 每个共享登记处每波只归一个包（下表）。没有列在某包文件集里的共享登记处，该包在该波不得改；需要改的写进交回「期望过期」或问题文件。
- 档位：经济为 `einzbern-economy`（claude-opus-5-5 low），主力为 `einzbern-main`（claude-opus-5-5 max）。判断 §5：Q1 主力（R5-1 是 R4-3 同一修复目标的第一次退回，升档，单独成包），Q2 经济。R5-1 再被退回就停下，记入收口文件交 Owner；Q2 的项再被退回升主力（C-16）。
- 前置包列只写包号并逐个列出（C-17）；改动让别的门期望过期的包按 C-15 同包对齐，或交给下文「期望对齐的接收」里的下一个持有者。
- 规模按模型响应数估；每包目标不超过 150，逼近 180 时按 C-4 提交干净状态、写接续点交回。合计 115 响应（判断 §5 表逐行相加）。
- 包完成即退役：只跑表中的局部门，不跑 verify、不验收、不写链；回执与门报告不提交（Q1 在 C-9 的两种情形除外）。verify 只在批末由主线程跑一次（`tools/batch-end-verify.sh 5`，另跑 `storybook:build`），不进任何包；SUB-228（R5-3）是最后一个包的最后一张。
- 合入：W1 结束主线程把 Q1 合入集成分支，Q2 从合入后的 HEAD 切出；W2 结束合入 Q2；冲突交集成子代理。交回物统一为 `runs/r5/handoff/<包>.md`，见红只记写 `runs/r5/problems/<包>.md`；文件名各不相同，不构成文件集相交。
- 小轮合并（判断 §5）：实施包 2 个，全部合入并跑完批末 verify 后，由一个主力档代理一次完成 R5 验收与判断，照原格式写验收、判断与 lessons 三份文件，判断有返工时顺带写下一轮的拆分文件。

## 共享登记处归属

本表列每波谁可以改共享登记处；空格（—）表示该波没有包可改，需要改的写进交回说明。

| 登记处 | W1 | W2 |
| --- | --- | --- |
| 根 `package.json`、各包 `package.json`、`pnpm-lock.yaml` | — | — |
| 导出面（`components/*/index.ts`、`src/index.tsx` 与 `index.test.tsx`） | — | — |
| `packages/ui-react/src/styles/base.css.ts` | Q1 | — |
| 其余包样式模块（含只读引用的 `actions.css.ts`、`shell.css.ts`）与 `styles/index.ts` | — | — |
| `components/Layout/Layout.test.tsx`（`Layout.tsx` 不改） | Q1 | — |
| 其余组件源码与测试（含 `Feedback.tsx`、`src/test/*.dom.spec.tsx`） | — | — |
| 契约 `tokens.json`、`icons.json`、`matrices.json`、`marks.json` 与五个生成物头、ui-tokens 源码（含 `tokens.css`） | — | — |
| `docs/contract/**`（`families.json`、`roles.json`、`exemptions.json`、`clauses.md`、`README.md`） | — | — |
| 门脚本、门库与门测试（几何门、壳层门、contract-static、browser-proof、`scripts/lib/visual-signature.mjs`、`scripts/lib/storybook-routes.mjs`、smoke、selection-grammar、shell-fidelity、弃用提示）与量测工具 `measure-shell.js` | — | — |
| `scripts/doc-shell-class-proof.mjs`（只改第 147 行注释） | — | Q2 |
| `tests/doc-shell-class-proof.test.mjs`、`docs/design/gplus-2026-10/doc-class-map.json` | — | — |
| 文档层样式（`alpha-styles.ts`、`story-demo-styles.ts`、`storybook.css`）、页模板与页面脚本、`story-content.tsx`、视觉实例、`apps/storybook/src/build/**` | — | — |
| 五语字典与台账（`storybook-content-text.ts`、`storybook-locale-text.ts`、`locale-invariant-ledger.mjs`、`story-budget.mjs`） | — | — |
| 映射 `storybook-map.json` 与 `storybook-map.md`、设计 README、ui-react `README.md`、`docs/style-scale.md` | — | — |
| `CHANGELOG.md`、`docs/migration-4.0.md` | — | Q2（SUB-227） |
| 成品板与草案板、`heights.json`、`visual-standard/canvas.json` | — | — |
| 回执与门报告 `docs/verification/**` | Q1（只在 C-9 两种情形，SUB-225） | — |
| `docs/dispatch/2026-10-13-tab-shell/owner-acceptance.md` | — | Q2（SUB-228） |

## 包表

| 包 | 名称 | Subtask（包内按序） | 独占文件集 | 前置包 | 预计响应数 | 交回物 |
| --- | --- | --- | --- | --- | --- | --- |
| Q1（W1） | 可折叠区获焦焦点环：内层裁切余量改 space-1，单测按焦点对与 forced-colors outline 的最大外扩断言（主力） | SUB-225 | `packages/ui-react/src/styles/base.css.ts`<br>`packages/ui-react/src/components/Layout/Layout.test.tsx`<br>`docs/verification/**`（只在 C-9 两种情形） | — | 70 | `runs/r5/handoff/Q1.md` |
| Q2（W2） | 文档跟上第四、五轮：doc-shell 注释残串、迁移说明 M53 与 CHANGELOG、目视清单（经济） | SUB-226 → SUB-227 → SUB-228 | `scripts/doc-shell-class-proof.mjs`<br>`docs/migration-4.0.md`<br>`CHANGELOG.md`<br>`docs/dispatch/2026-10-13-tab-shell/owner-acceptance.md` | Q1 | 45 | `runs/r5/handoff/Q2.md` |

合计 115 响应。包与判断 §5 的对应：Q1 为 R5-1；Q2 为 R5-2、R5-3、R5-4。

## 共享文件的先后

本轮没有文件被两张以上 Subtask 改。另有三处「一个单写、后一个单读」，由波次与包内顺序保证先后：

| 读写对象 | 写 | 读 |
| --- | --- | --- |
| Q1 交回 `runs/r5/handoff/Q1.md`（焦点环四边读数、是否越容差与重收、离群项、是否提交了再生回执、目视项） | SUB-225（Q1 W1） | SUB-228（Q2 W2） |
| M53 的条目号与内容 | SUB-227（Q2 W2，包内第 2 张） | SUB-228（Q2 W2，包内第 3 张：G-21、第 201 与 208 行） |
| `docs/verification/**`（Q1 在 C-9 情形下提交时） | SUB-225（Q1 W1） | Q2 跑的门只读，跑完按 C-9 还原 |

### 期望对齐的接收（C-15）

| 门或文件 | 让它过期的单 | 对齐的单 |
| --- | --- | --- |
| `packages/ui-react/src/components/Layout/Layout.test.tsx`（SUB-216 用例只断言 margin ≥ 1px） | SUB-225 | SUB-225（同单收紧） |
| `docs/verification/internal-alpha/visual-signature-baseline.json`（越容差时） | SUB-225 | SUB-225（同单只收越容差的条目，C-9） |
| `owner-acceptance.md` 第 268 行、G-18、G-21、第五轮目视节 | SUB-225、SUB-227 | SUB-228 |
| `owner-acceptance.md` 第 201、208、218、390 行与第三轮离群表前的说明段 | R4 起已过期（A4-1、C4-1(b)） | SUB-228 |
| `docs/migration-4.0.md` M30 末段的计数与 toolbar 一句 | SUB-191（R3）、SUB-215（R4） | SUB-227（追加 M53，M30 不动） |
| `scripts/doc-shell-class-proof.mjs` 第 147 行注释 | SUB-219（R4） | SUB-226 |

## 各包局部门

### Q1 · 可折叠区获焦焦点环：内层裁切余量改 space-1，单测按最大外扩断言

- 波次：W1；档位：主力；前置包：无；Subtask：TCRN-DS-SUB-225；预计 70 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑；写 docs/verification 的门跑完按 C-9 处置）：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> run test:dom`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run tokens:proof`
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-static-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:proof`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/internal-alpha-browser-proof.mjs --update-visual-baseline <选择文件>`（只在越容差时）
- 注：`--filter @tcrn/ui-react build` 与第二次 ui-react 单测只为判据③的变异（改回 `--tcrn-space-0h` 时判红）；复原后紧接 test:dom，它的脚本先重建 ui-react。一次性探针在会话 scratch，不入仓。越容差时 browser-proof 先跑一次产出 `visual-selection-result.json`，用 `--update-visual-baseline` 应用选择后再跑一次确认（这两次不算重复跑）。既有红只回显「既有红，待 O-19 / O-4」。
- 交回：`runs/r5/handoff/Q1.md`；见红只记：`runs/r5/problems/Q1.md`。

### Q2 · 文档跟上第四、五轮：doc-shell 注释残串、迁移说明 M53 与 CHANGELOG、目视清单

- 波次：W2；档位：经济；前置包：Q1；Subtask：TCRN-DS-SUB-226 → TCRN-DS-SUB-227 → TCRN-DS-SUB-228；预计 45 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑；写 docs/verification 的门跑完按 C-9 还原）：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
  - `corepack pnpm@10.12.1 -C <包树> run scaffold:proof`
  - `corepack pnpm@10.12.1 -C <包树> run readme:proof`
  - `corepack pnpm@10.12.1 -C <包树> run public-output:scan`
  - `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan`
  - `corepack pnpm@10.12.1 -C <包树> run scan`
- 注：build 与 storybook:build 在包开头跑一次（doc-shell:proof、public-output:scan、internal-vocab:scan 读 `packages/ui-react/dist` 与 `apps/storybook/storybook-static`）；scaffold:proof、readme:proof、public-output:scan、internal-vocab:scan 在 SUB-227 改完后跑；scan 扫整棵工作树（KB-020），在三张都改完、交回与问题文件写好后跑一次。交回写 `owner-acceptance.md` 每处改动的新行号（KB-024）。
- 交回：`runs/r5/handoff/Q2.md`；见红只记：`runs/r5/problems/Q2.md`。
