# 交回说明 · W6-A（SUB-038 → SUB-039 → SUB-040）

三张 Subtask 都已完成，没有接续点。问题见 `runs/r1/problems/W6-A.md`。本文写给 W7-A、W8-A 与批末全量。

## verify 的新顺序

既有步骤与顺序不变。新增的步骤全部排在 `pnpm build` 之后，带 `+` 的为本包新增：

1. `pnpm install --frozen-lockfile`
2. `pnpm typecheck`
3. `pnpm build`（构建全部包与静态文档 `apps/storybook/storybook-static`）
4. `pnpm dist:hygiene`
5. `pnpm test`
6. `pnpm tokens:proof`（内部 + `node --test tests/token-contrast-proof.test.mjs`，排在 token-contrast-proof 之前；+ `node --test tests/token-deprecation-notice.test.mjs`，排在其后）
7. + `pnpm contract:proof`
8. `pnpm component-modifiers:proof`
9. `pnpm badge-wrap:proof`
10. `pnpm geometry:proof`
11. `pnpm shell:parity`
12. `pnpm doc-shell:proof`
13. + `pnpm contract:static`
14. `pnpm brand-asset:proof`
15. `pnpm exports:check`
16. `pnpm pack:smoke`
17. `pnpm storybook:smoke`
18. + `pnpm geometry:measure`
19. + `pnpm storybook:visual-proof`（脚本原指向退役桩的位置现在是新门，并带测试）
20. + `pnpm doc:sample-style`
21. + `pnpm fonts:render`
22. 之后照旧：readme:proof → public:naming:proof → public-output:scan → internal-vocab:scan → generic:scan → ds:consumption:proof → full-surface:proof → scaffold:proof → internal-alpha:proof

全量 verify 在当前集成树上会先停在第 6 步（problems P1：fonts 既有红），后面的新门都跑不到。批末要先清 P1，再看新门。

## 每门单跑（在包树根）

形态统一为 `corepack pnpm@10.12.1 -C <树> run <脚本> [门参数]`。每条脚本先跑测试、后跑门，脚本名后面的参数接在门的命令行上；已用 `contract:static --family actions` 实测参数能传到门。跳过测试只跑门时，用 `corepack pnpm@10.12.1 -C <树> exec node scripts/<门>.mjs <参数>`。

| 脚本 | 内容 | 前置 | 本包树结果 |
| --- | --- | --- | --- |
| `contract:proof` | `node --test tests/contract-proof.test.mjs && node scripts/contract-proof.mjs`（门可加 `--json`） | build | 绿：8/8，六项检查全绿 |
| `contract:static` | `node --test tests/contract-static-proof.test.mjs && node scripts/contract-static-proof.mjs`（`--family`、`--details`、`--report <路径>`） | build（含静态文档） | 红：测试 65/65 通过；C2 7 条、C5 1 条（P3）；`--family actions` 绿 |
| `geometry:measure` | `node --test tests/geometry-measure-proof.test.mjs && node scripts/geometry-measure-proof.mjs`（`--family`、`--story`、`--self-check-only`、`--write-report`） | build，Chromium | 红：测试 60/60 通过；夜间 contrast、inputs err-msg、样板 rail 与样板的 contrast 必测项、controlHeight 未适用（P4） |
| `storybook:visual-proof` | `node --test tests/storybook-visual-proof.test.mjs && node scripts/storybook-visual-proof.mjs`（`--kind`、`--theme`、`--no-mutations`、`--write-report`） | build，Chromium | 红：测试 16/16 通过；对账一致，9 条变异全部判红，22 行红（P5） |
| `doc:sample-style` | `node --test tests/doc-sample-style-proof.test.mjs && node scripts/doc-sample-style-proof.mjs`（`--story`、`--theme`、`--strict`） | build，Chromium | 红：测试 6/6 通过；icons-motion 有 72 处 doc-stylesheet（P6） |
| `fonts:render` | `node scripts/fonts-render-proof.mjs`（`--root <dir>`），没有测试文件（P7） | build，Chromium | 绿：八条腿 |
| `tokens:proof` | 见上，多了两份测试 | ui-tokens 构建 | 红：两份新测试 10/10、5/5；fonts 既有红（P1） |

## 和交回建议不同的两处

- 脚本名按 SUB-038 判据与 STORY-133 GWT2 取 `geometry:measure`、`doc:sample-style`、`fonts:render`，没有用交回里建议的 `geometry-measure:proof`、`doc-sample-style:proof`、`fonts:render-proof`。
- `contract:proof` 先跑测试后跑门。W2-H 建议的是先门后测，这里改成与其它门一致的顺序，这样 `--json` 等参数能传到门。

## 报告与回执

- verify 里不带 `--write-report`。批末用三条命令重生成落盘的报告：
  - `node scripts/geometry-measure-proof.mjs --write-report` 写 `docs/verification/geometry-measure/report.json`；
  - `node scripts/storybook-visual-proof.mjs --write-report` 写 `docs/verification/storybook-visual-proof/gplus-map-report.json` 与 `.md`；
  - contract-static 用 `--report <路径>`，要入仓时由批末定路径。
- `node scripts/no-private-input-scan.mjs` 会改写 `docs/verification/internal-alpha/no-overclaim-scan.json`。本包跑完已经还原。
- 改了 `package.json` 之后，internal-alpha 的 package-contract 回执会过期，由 W8-A 重生成（P11）。

## CI（SUB-039）

新增的 `.github/workflows/verify.yml` 只是配置，没有推送，也没有运行：

- 触发：推送任意分支（不含 tag）、pull_request、workflow_dispatch；
- 权限：`contents: read`；同一 ref 的运行会取消前一轮；
- 运行环境：ubuntu-latest，超时 90 分钟，checkout 带 `fetch-depth: 0`（scaffold:proof 的 changelog 腿要读 tag 与历史）；
- 步骤：Node 24 → `corepack enable` 加 `corepack prepare pnpm@10.12.1 --activate` → `pnpm install --frozen-lockfile` → `pnpm exec playwright install --with-deps chromium` → `pnpm verify`；
- 注释写明 brand-asset:proof 要联网取已发布的品牌标；
- Linux 上的浏览器门结果尚未实跑（P8）。

## 集外改动需求

1. 根 README 五份里的 `pnpm storybook:visual-proof -- --check` 与新门清单，以及 `foundation-visual-standards.ts` 第 546 行（P10）。
2. P1、P2 两处既有红，归原 Subtask 返工。

## 未做完

无。
