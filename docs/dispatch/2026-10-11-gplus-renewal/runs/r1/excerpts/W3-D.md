# 摘录 · W3-D（INIT-015 R1）

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
| W3-D | SUB-018 → SUB-021 | `packages/ui-react/src/components/Clipboard/Clipboard.tsx`<br>`packages/ui-react/src/components/Clipboard/static-clipboard.ts`<br>`packages/ui-react/src/components/Clipboard/Clipboard.test.tsx`<br>`packages/ui-react/src/styles/base.css.ts`<br>`packages/ui-react/src/components/Navigation/Navigation.test.tsx`<br>`packages/ui-react/src/components/Form/Form.tsx`<br>`packages/ui-react/src/components/Form/Form.test.tsx`<br>`packages/ui-react/src/styles/inputs.css.ts` | 70 | Clipboard copy 图标、DatePicker 日历图标、base 段上下文规则、Navigation.test 断言 |

包内局部门：

- W3-D：`corepack pnpm@10.12.1 -C <包树> run typecheck`；`corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`；`corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`

## 本包 Subtask（decomposition.md 第 3 节）

#### TCRN-DS-SUB-018 · Actions 收口：Clipboard idle 加 copy 图标，base 段按钮上下文规则与 Navigation.test 按钮断言

- 包 / 波：W3-D / W3
- 文件：`packages/ui-react/src/components/Clipboard/Clipboard.tsx`，`packages/ui-react/src/components/Clipboard/static-clipboard.ts`，`packages/ui-react/src/components/Clipboard/Clipboard.test.tsx`，`packages/ui-react/src/styles/base.css.ts`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`
- 依赖：TCRN-DS-SUB-014，TCRN-DS-SUB-017
- 判据：125 use case：ClipboardCopyButton idle 态 copy 13；W2 各家族交回里记下的 base 段按钮上下文规则（如 reduced-motion 里的 press-scale、外壳内按钮焦点 outline）改为 G+ 写法；Navigation.test.tsx 里 [data-tcrn-theme="dark"] .tcrn-button--primary 等按钮相关正则按 G+ 更新；C2/C5
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`

#### TCRN-DS-SUB-021 · Inputs 收口：DatePicker 日历图标，base 段输入上下文规则与 Navigation.test 搜索框断言

- 包 / 波：W3-D / W3
- 文件：`packages/ui-react/src/components/Form/Form.tsx`，`packages/ui-react/src/components/Form/Form.test.tsx`，`packages/ui-react/src/styles/inputs.css.ts`，`packages/ui-react/src/styles/base.css.ts`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`
- 依赖：TCRN-DS-SUB-014，TCRN-DS-SUB-020，TCRN-DS-SUB-018
- 判据：126 goal：DatePicker 右侧 calendar 图标 14 且原生指示器透明覆盖同区域（名册在 SUB-014 合并后才有 calendar）；W2 交回里记下的 base 段输入上下文规则（如 .tcrn-product-shell :focus-visible 的 3px outline 与搜索框焦点）改为 G+ 焦点环；Navigation.test.tsx 的 .tcrn-search-input 系列正则按 G+ 更新；C2/C8
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`

## verify 链影响表中与本包有关的行（第 4 节）

| # | 步骤 | 现判据（摘要） | 焕新后的影响 | 负责 | 转绿 |
| --- | --- | --- | --- | --- | --- |
| 5c | `test`：ui-react（test:ssr） | Navigation.test 大量正则（品牌渐变后缀、按钮暗色、搜索框 3px outline 等）、Button/Icon/Typography/Form/Clipboard 单测、index.test 名册对账 | 全部随家族改 | 品牌 SUB-023；按钮与搜索框正则 SUB-018、SUB-021；各家族单测 SUB-012–017、019–020；名册 SUB-017 | W2、W3 |

