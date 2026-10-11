# 摘录 · W5-A（INIT-015 R1）

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
| W5-A | SUB-031 | `apps/storybook/src/contract-stories/gplus/sample-stories.tsx`<br>`apps/storybook/src/contract-stories/gplus/samples/**`<br>`apps/storybook/src/contract-stories/governance.ts`<br>`apps/storybook/src/contract-stories/groups/components.ts`<br>`apps/storybook/src/typography.stories.tsx`<br>`apps/storybook/src/icon.stories.tsx`<br>`apps/storybook/src/brand.stories.tsx`<br>`apps/storybook/src/actions.stories.tsx`<br>`apps/storybook/src/inputs.stories.tsx`<br>`apps/storybook/src/build/locales/storybook-locale-text.ts`<br>`apps/storybook/src/build/locales/storybook-content-text.ts`<br>`scripts/lib/locale-invariant-ledger.mjs`<br>`scripts/lib/story-budget.mjs`<br>`apps/storybook/src/smoke.test.ts` | 100 | 五个构图一样板 story 与注册 |

包内局部门：

- W5-A：`corepack pnpm@10.12.1 -C <包树> run typecheck`；`corepack pnpm@10.12.1 -C <包树> run build`；`corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/public-naming-proof.mjs`

## 本包 Subtask（decomposition.md 第 3 节）

#### TCRN-DS-SUB-031 · 构图一壳层样板 story ×5（账单、项目、成员、产品）与夜间切换

- 包 / 波：W5-A / W5
- 文件：`apps/storybook/src/contract-stories/gplus/sample-stories.tsx`，`apps/storybook/src/contract-stories/gplus/samples/**`，`apps/storybook/src/contract-stories/governance.ts`，`apps/storybook/src/contract-stories/groups/components.ts`，`apps/storybook/src/typography.stories.tsx`，`apps/storybook/src/icon.stories.tsx`，`apps/storybook/src/brand.stories.tsx`，`apps/storybook/src/actions.stories.tsx`，`apps/storybook/src/inputs.stories.tsx`，`apps/storybook/src/build/locales/storybook-locale-text.ts`，`apps/storybook/src/build/locales/storybook-content-text.ts`，`scripts/lib/locale-invariant-ledger.mjs`，`scripts/lib/story-budget.mjs`，`apps/storybook/src/smoke.test.ts`
- 依赖：TCRN-DS-SUB-029，TCRN-DS-SUB-030
- 判据：129-GWT3（侧栏图标左 16、文字 48，纸离边 12；受 ProductShell 几何限制，见问题清单 P1，差值写进映射表）；id 定为 typography-sample-billing、icon-sample-project、brand-sample-product、actions-sample-project、inputs-sample-members（Storybook id typography--sample-billing 等）；用包内 ProductShell 与第一批组件，内容为通用产品（项目、成员、账单），不用通用件拼壳；引导元素带 data-guide="rail"/data-text="rail" 供测量；夜间切换只改 data-tcrn-theme；注册、五语、预算与 SUB-030 同规则
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/public-naming-proof.mjs`

## verify 链影响表中与本包有关的行（第 4 节）

| # | 步骤 | 现判据（摘要） | 焕新后的影响 | 负责 | 转绿 |
| --- | --- | --- | --- | --- | --- |
| 5d | `test`：storybook（smoke.test.ts） | 期望 story id 表、文档类名、外观断言 | 新 story、类名改前缀 | SUB-027、SUB-030、SUB-031、SUB-042 | W3–W6 |
| 17 | public:naming:proof | story id/标题不含产品词 | 新 story 须守 | SUB-030、SUB-031 | W4、W5 |
| 19 | internal-vocab:scan | 渲染文本无工单键、Codex 等 | 新 story 与映射页须守 | SUB-029、SUB-031、SUB-032 | W4、W5 |

## 7. 「Storybook」所指

根脚本 `storybook:build` = `pnpm --filter @tcrn/design-system-storybook build` = `tsc && node dist/build.js`，产出静态文档 `apps/storybook/storybook-static`（README 所称 Track B，Vercel 产物）；`storybook:manager-build` 才是真 Storybook 10.4.6（Track A，输出 storybook-preview-static，已 gitignore，不在 verify）。现有与新增的浏览器门全部量 Track B；START 的「storybook:build 成功」也是 Track B。Story 正文里「Storybook 渲染结果」按 Track B 判；两轨共用 `contract-stories` 注册表，SUB-030/031 同时补 Track A 的 CSF 适配，Track A 不设门。

## 跨包交回（r1/handoff/W4-A.md）

### 交回说明 · W4-A（SUB-029 → SUB-030）

## 已交付

- SUB-029：`contract-stories/gplus/matrix-renderer.tsx`（格属性、浅色与夜间两块、分节、状态表、`StaticMarkup` 标记编辑）、`matrix-stories.tsx`（五个矩阵与 23 件组件名册 `gplusMatrixComponents`）、`icon-roster.tsx`（37 件 × 14/16/20）。格数 44/28/10/116/42，全部来自 `gplusMatrices`。
- SUB-030：Components 下新类目 `gplus-matrices`（Family matrices），story id 与 registry 顺序为 typography-matrix、icon-matrix、brand-matrix、actions-matrix、inputs-matrix，排在 documents-and-collaboration-templates-spec 之后；五语标题与说明、类目与样张文案五语、W2-C/W3-C 的图标库文案替换、W2-F 的标语；台账删除 `Lucide React`，新增 properNouns 与 `matrixMachineWords`；Track A 适配文件 typography/icon/brand/actions/inputs.stories.tsx，导出 `Matrix`（Storybook id `typography--matrix` 等）。

## 给 W5（SUB-028、SUB-031、SUB-033、SUB-035）

- 路由：类目页 `components-gplus-matrices.html`，故事锚点 `#<story id>`；类目页上故事默认折叠，测量前把 `article[data-story-collapsed]` 设为 `false`（浏览器证明的做法）。
- 测量钩子：板根 `[data-gplus-matrix="<板>"]`（带 `data-gplus-matrix-cell-count`、`data-gplus-matrix-layout`）；两块 `[data-gplus-matrix-theme="light|night"]`，分别带 `data-tcrn-theme="light|dark"`；分节 `[data-gplus-matrix-component="<组件>"]`；格 `data-cell`、`data-kind`、`data-expect`、禁用格 `data-exempt`，探针 `data-probe` 取 ph、shadow、after-border、after-shadow、before-bg（最后一项是 Switch 的钮，测量库需支持）。
- 注册：样板 story 照 `matrix-stories.tsx` 的 `matrixStory` 写法（`storyGovernanceFor` 加 `sourcePath` 覆盖）。smoke 的 CSF 门按 components → typography → icon → brand → actions → inputs 的顺序拼接 Components 组的适配文件，样板导出放进家族文件后，registry 顺序要与拼接顺序一致；`smoke.test.ts` 的 sourcePath 断言按类目判断，新类目需同步。
- 类目上限 8：`gplus-matrices` 已有 5 个，样板请另开类目（例如 gplus-samples）。
- SUB-035 转绿前须先修问题清单第 1 条（页面 CSS 作用域吃掉状态规则），否则全部状态格偏离。

## 集外改动需求

1. `apps/storybook/src/build/page-template.tsx`：组件 CSS 作用域改写按括号深度切选择器、支持一行多条规则（问题清单 1）。
2. ui-tokens / `styles/base.css.ts`：补 `[data-tcrn-theme="light"]` 主题块（问题清单 2）。
3. `packages/ui-react`：ClipboardCopyButton 预览状态入口、TcrnBrandMark 默认尺寸、Text 的 mono 与 numeral-inline 入参、入口导出 `tcrnIconNewNames`（问题清单 3）。
4. `smoke.test.ts` 的 `/TCRN stays regular weight/` 按 W2-F 交回改写（问题清单 4c，批末处置）。

## 未做完

无接续点。story-budget.mjs 与 navigation.ts 无需改动（高度都在 2000 内，类目 5 个）。

## 本包引用的问题清单条目（problems/decomposition.md）

**P1 构图一壳层几何与 ProductShell 不在第一批（待 Owner）。**
现象：STORY-129-GWT3 要求样板 story 侧栏图标左 16、文字 48、纸离边 12，构图一侧栏 220、顶栏 52；STORY-127-GWT4 要求侧栏收起到 52px。包内 ProductShell 现为侧栏 280、收起 92；禁用清单禁止「通用件拼壳」，INIT 不授权改第二批以后的家族。
证据：`packages/ui-react/src/components/Navigation/Navigation.tsx` 第 2502–2516 行（`--tcrn-product-shell-sidebar-width: 280px` / `92px`）；STORY-129 GWT3；STORY-127 GWT4；INIT「不授权」段；MIN-20261011 D1。
建议：请 Owner 裁定构图一的壳层几何是否算 G+ 底盘（D1）而纳入 INIT-015。裁定前 SUB-031 用 ProductShell 并通过已登记的局部变量 `--tcrn-product-shell-sidebar-width` 设 220，其余差值写进 storybook-map（STORY-130 允许「逐条有裁定引用」），129-GWT3 与 127-GWT4 的 52px 部分记为待裁。

