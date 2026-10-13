# 摘录 · W7-A（INIT-015 R1）

本摘录由主线程从 R1 拆分文件切出，只含本包需要的部分；不要去读整份拆分文件。链上 Story 的 scope 仍是任务权威。

## 1. 跨包约定（实施包必须遵守，改动须先回拆分）

1. **Token 变量名由契约定。** `docs/design/gplus-2026-10/contract/tokens.json` 每条带 `cssVar`。颜色用 `--tcrn-color-<短横线键名>`：bg、bg-2、panel、panel-2、line、line-2、line-3、line-ctl、rule、ink、ink-2、ink-3、acc、acc-2、acc-3、acc-bg、acc-ul、on-acc、red、red-bg、red-bg-2、ok、warn、bad、bad-bg、wash、hover、dis、glass、chrome、av-bg、av-ink、knob、surface（焦点环间隙色，跟随承载面）。阴影 `--tcrn-shadow-s1|s2|s3|edge`，焦点环 `--tcrn-focus-ring`，品牌后缀 `--tcrn-brand-suffix-<tms|design-system|einzbern|mana-orchestrate>`（aos 保持现状）。字族、字号行高、圆角、控件高、内距、动效沿用现有 `--tcrn-type-*`、`--tcrn-radius-*`、`--tcrn-motion-*` 体系，新增项的变量名同样写在 tokens.json。旧名（`--tcrn-color-text-*`、`--tcrn-color-border-*`、`--tcrn-color-surface-*`、`--tcrn-color-brand-*` 等）在 SUB-001 里保留为指向新名的弃用别名。
2. **夜间选择器**是 `[data-tcrn-theme="dark"]`（与仓库及 STORY-120/129 一致），不是画板的 `.gp.night`。C5 比较的是主题相关 token 的 `:root` 块与 dark 块；主题无关 token 放独立 `:root` 块（SUB-001 定，门按同一口径比较）。
3. **状态对变量。** 变体声明 `--tcrn-pair-fill-<态>`、`--tcrn-pair-ink-<态>`、`--tcrn-pair-edge-<态>`（Actions 态键 d/h/a/f/x/l/s；Inputs 文本类 d/h/f/r/x/e/ef，勾选类与开关类的附加元组由 pairs.json 定名），基础规则读生效对 `--tcrn-pair-fill|ink|edge|weight`。变体选择器特异性 (0,2,0)，如 `.tcrn-button.tcrn-button--primary`；状态规则写成 `.tcrn-button:where(:hover,[data-tcrn-preview-state="hover"])`，特异性 (0,1,0)，排在基础规则之后，只切换生效对、不写颜色。SUB-010 让 token-extension-proof 接受 `--tcrn-pair-*` 局部变量。
4. **静态状态呈现**用属性 `data-tcrn-preview-state="hover|active|focus"`（矩阵 story 用，与真实伪类共用同一对表），不用无前缀的 `.is-hover` 类。
5. **CSS 段归属。** SUB-010 之后 `tcrnComponentCss` 由 `packages/ui-react/src/styles/index.ts` 按原顺序拼接；家族包只改自己的 `styles/<家族>.css.ts`，并在其中引入 `styles/generated/` 的生成段。`styles/index.ts` 只由 SUB-010 写。`styles/base.css.ts` 在 W2 冻结：家族包若需要改 base 里的家族上下文规则，写进本包交回说明 `runs/r1/handoff/<包号>.md`，由 W3-D（SUB-018、SUB-021）统一处理。
6. **生成物只由生成器写。** `styles/generated/**`、`components/Icon/icon-paths.generated.ts`、`components/Navigation/product-marks.generated.ts`、`packages/ui-tokens/src/gplus-tokens.generated.ts`、`apps/storybook/src/contract-stories/gplus/generated/**` 只由 `node scripts/contract-generate.mjs` 写，文件头注明「由 contract 生成，勿手改」；改契约后重生成。
7. **story id 预先定死**（并行包据此对齐）：矩阵 `typography-matrix`、`icon-matrix`、`brand-matrix`、`actions-matrix`、`inputs-matrix`；样板 `typography-sample-billing`、`icon-sample-project`、`brand-sample-product`、`actions-sample-project`、`inputs-sample-members`。真 Storybook 轨的 CSF 标题为 Typography/Icon/Brand/Actions/Inputs，导出 Matrix、SampleBilling、SampleProject、SampleProduct、SampleMembers，对应 Storybook id `typography--matrix`、`typography--sample-billing` 等（STORY-130 用例）。id 与标题不含 aos/tms/workflow（public-naming-proof）。
8. **新门读包 CSS 一律从 dist 导入。** doc-shell-class、contract-static、contract-proof 从 `packages/ui-react/dist/index.js` 导入 `tcrnComponentCss`（先 build），与源文件布局无关；读源文件的旧门由 SUB-010 改用 `scripts/lib/component-css-sources.mjs`。
9. **测量库 API 在 W1 定稿。** `scripts/lib/gplus-measure.mjs`（浏览器注入的八项测量与重叠检查，加 Node 侧运行入口）与 `scripts/lib/storybook-routes.mjs`（story id → 静态页路由）由 SUB-034 定稿；W5 的 SUB-028、SUB-033、SUB-035 只读复用，不改签名，需要改的记问题清单。
10. **命令形态。** 局部门一律在包树根以 `corepack pnpm@10.12.1 -C <包树> exec node <脚本>` 或 `corepack pnpm@10.12.1 -C <包树> run <脚本>` 执行，不 cd、不 rm。局部门只跑本表列出的门，不跑全量 verify。
11. **回执不在实施包里提交。** `docs/verification/internal-alpha/**`、hardening、scaffold、readme 回执只由 W8-A（SUB-046）提交；其它包若跑了会写回执的脚本，跑完用 `git -C <包树> checkout -- <回执路径>` 还原。各新门自己的报告目录（`docs/verification/doc-shell-class/`、`geometry-measure/`、`storybook-visual-proof/`）归对应 Subtask。
12. **渲染文本约束。** story 渲染文本不含工单键（TCRN-DS-*、STORY-*、EPIC-*、INIT-*）与 Codex（internal-vocabulary-scan）；新可见文案五语齐，或作为机器词登记进 `scripts/lib/locale-invariant-ledger.mjs`。
13. **提交。** 按 Subtask 提交，提交信息带 TCRN-DS-SUB-NNN；git 身份与禁止事项按 START（不推送、不打 tag、不发版、不部署）。

## 本包（packages.md）

| 包 | Subtask（包内按序） | 独占文件集 | 预计响应数 | 交回物 |
| --- | --- | --- | --- | --- |
| W7-A | SUB-043 → SUB-044 → SUB-045 | `packages/ui-tokens/package.json`<br>`packages/ui-copy-state/package.json`<br>`packages/ui-react/package.json`<br>`packages/ui-tokens/README.md`<br>`packages/ui-copy-state/README.md`<br>`packages/ui-react/README.md`<br>`docs/tms-adoption-guide.md`<br>`CHANGELOG.md`<br>`docs/migration-4.0.md`<br>`docs/dispatch/2026-10-11-gplus-renewal/owner-acceptance.md` | 70 | 4.0.0 版本面、CHANGELOG、迁移说明、目视验收清单 |

包内局部门：

- W7-A：`corepack pnpm@10.12.1 -C <包树> exec node scripts/version-surface-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/changelog-release-sections-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/scaffold-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> run pack:smoke`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/no-private-input-scan.mjs`

## 本包 Subtask（decomposition.md 第 3 节）

#### TCRN-DS-SUB-043 · 版本面 4.0.0 与 CHANGELOG 发布段

- 包 / 波：W7-A / W7
- 文件：`packages/ui-tokens/package.json`，`packages/ui-copy-state/package.json`，`packages/ui-react/package.json`，`packages/ui-tokens/README.md`，`packages/ui-copy-state/README.md`，`packages/ui-react/README.md`，`docs/tms-adoption-guide.md`，`CHANGELOG.md`
- 依赖：TCRN-DS-SUB-038，TCRN-DS-SUB-040，TCRN-DS-SUB-042
- 判据：134 goal：version-surface-proof 对 4.0.0 一致（三包 package.json、三包 README「Version `4.0.0` is prepared」、tms-adoption-guide「Three packages, all at 4.0.0:」）；CHANGELOG 按 changelog-release-sections-proof 写 ## 4.0.0 段（破坏性清单）；不打 tag、不发版
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/version-surface-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/changelog-release-sections-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/scaffold-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run pack:smoke`

#### TCRN-DS-SUB-044 · 消费方迁移说明 docs/migration-4.0.md（AOS、TMS、Einzbern 门户）

- 包 / 波：W7-A / W7
- 文件：`docs/migration-4.0.md`
- 依赖：TCRN-DS-SUB-043
- 判据：134-GWT2（对照 EPIC-040/043 breaking 清单每条有迁移步骤）：lucide 移除、名册 37、registry workflow→einzbern 与新增 mana-orchestrate、Text 新 prop、Button lg、ButtonGroup、Icon strokeWidth 移除、后缀色、焦点环改 box-shadow、字体自托管（引入 @tcrn/ui-tokens/fonts.css）、token 改名与弃用别名表
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/no-private-input-scan.mjs`

#### TCRN-DS-SUB-045 · Owner 目视验收清单（按画板逐板一节）

- 包 / 波：W7-A / W7
- 文件：`docs/dispatch/2026-10-11-gplus-renewal/owner-acceptance.md`
- 依赖：TCRN-DS-SUB-032
- 判据：134-GWT3（每板一节：G+、构图、Typography、Icon、Brand、Actions、Inputs、产品标；每节列对应 story id、目视项与机器证据路径）；写明目视验收由 Owner 做，不由实施对话代签
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/no-private-input-scan.mjs`

## verify 链影响表中与本包有关的行（第 4 节）

| # | 步骤 | 现判据（摘要） | 焕新后的影响 | 负责 | 转绿 |
| --- | --- | --- | --- | --- | --- |
| 14 | pack:smoke | 三包可打包 | ui-tokens 带字体；版本 4.0.0 | SUB-004、SUB-043 | W1、W7 |
| 23 | scaffold:proof | scaffold 冻结观测、CHANGELOG 发布段、版本面 | 4.0.0 与发布段 | SUB-043 | W7 |

## 跨包交回（r1/handoff/W6-A.md）

### 交回说明 · W6-A（SUB-038 → SUB-039 → SUB-040）

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

