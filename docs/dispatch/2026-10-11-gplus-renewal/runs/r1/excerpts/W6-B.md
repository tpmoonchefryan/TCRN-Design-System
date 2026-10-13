# 摘录 · W6-B（INIT-015 R1）

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
| W6-B | SUB-041 → SUB-042 | `scripts/storybook-smoke.mjs`<br>`scripts/internal-alpha-browser-proof.mjs`<br>`scripts/shell-parity-proof.mjs`<br>`scripts/geometry-proof.mjs`<br>`scripts/full-surface-remediation-proof.mjs`<br>`scripts/ds-consumption-proof.mjs`<br>`apps/storybook/src/smoke.test.ts`<br>`tests/full-surface-remediation.test.mjs`<br>`tests/ds-consumption-proof.test.mjs` | 110 | 既有浏览器门与冒烟测试按 G+ 重定基线 |

包内局部门：

- W6-B：`corepack pnpm@10.12.1 -C <包树> run build`；`corepack pnpm@10.12.1 -C <包树> run storybook:smoke`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/internal-alpha-browser-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> run shell:parity`；`corepack pnpm@10.12.1 -C <包树> run geometry:proof`；`corepack pnpm@10.12.1 -C <包树> run full-surface:proof`；`corepack pnpm@10.12.1 -C <包树> run ds:consumption:proof`；`corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`

## 本包 Subtask（decomposition.md 第 3 节）

#### TCRN-DS-SUB-041 · storybook-smoke 与 internal-alpha 浏览器证明的期望值按 G+ 重定基线

- 包 / 波：W6-B / W6
- 文件：`scripts/storybook-smoke.mjs`，`scripts/internal-alpha-browser-proof.mjs`
- 依赖：TCRN-DS-SUB-031，TCRN-DS-SUB-030，TCRN-DS-SUB-027
- 判据：INIT 判据 pnpm verify 全绿：把写死的旧视觉期望改为 G+（按钮 minHeight 36/38→28/32/40、焦点 3px outline→box-shadow 环、字族 Inter→Hanken Grotesk、选中洗底 rgba(28,29,33,.06)→wash、搜索框圆角、品牌期望、类目与 story 数）；只改期望常量，不放宽判据、不加豁免；视觉签名基线不在本单（SUB-046）
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/internal-alpha-browser-proof.mjs`

#### TCRN-DS-SUB-042 · shell-parity、geometry、full-surface、ds-consumption 与 storybook 冒烟测试重定基线

- 包 / 波：W6-B / W6
- 文件：`scripts/shell-parity-proof.mjs`，`scripts/geometry-proof.mjs`，`scripts/full-surface-remediation-proof.mjs`，`scripts/ds-consumption-proof.mjs`，`apps/storybook/src/smoke.test.ts`，`tests/full-surface-remediation.test.mjs`，`tests/ds-consumption-proof.test.mjs`
- 依赖：TCRN-DS-SUB-041
- 判据：INIT 判据 pnpm verify 全绿：本地逐个跑，红项若源于 G+ 预期变化（品牌路由、搜索框几何、外壳同构属性），更新期望并在提交信息逐条说明依据；红项若是真实缺陷，只记问题清单不改判据
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run shell:parity`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:proof`
  - `corepack pnpm@10.12.1 -C <包树> run full-surface:proof`
  - `corepack pnpm@10.12.1 -C <包树> run ds:consumption:proof`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`

## verify 链影响表中与本包有关的行（第 4 节）

| # | 步骤 | 现判据（摘要） | 焕新后的影响 | 负责 | 转绿 |
| --- | --- | --- | --- | --- | --- |
| 5d | `test`：storybook（smoke.test.ts） | 期望 story id 表、文档类名、外观断言 | 新 story、类名改前缀 | SUB-027、SUB-030、SUB-031、SUB-042 | W3–W6 |
| 8 | badge-wrap:proof | INC-013 徽标换行几何 | 非第一批；只受 token 值影响，预计不变 | 若红：SUB-042 | — |
| 9 | geometry:proof | 外壳/徽标/品牌/搜索路由的几何 | 品牌路由（ProductLogo 改内联 SVG）与搜索框几何会变 | SUB-027 类名引用；SUB-042 重定基线 | W6 |
| 10 | shell:parity | 文档壳与包壳逐属性同构 | 文档层类名与 token 变化 | SUB-027、SUB-042 | W6 |
| 15 | storybook:smoke | 静态页面 HTML 与外观期望（按钮 36/38、3px outline、Inter、选中洗底、搜索框圆角、品牌、注册表派生清单） | 期望写死旧视觉 | SUB-027 类名；SUB-041 按 G+ 重定基线 | W6 |
| 21 | ds:consumption:proof | 消费方语义检查（浏览器） | 可能受外观变化影响 | 若红：SUB-042 | W6 |
| 22 | full-surface:proof | 静态路由全表面检查 | 类名与外观变化 | SUB-027、SUB-042 | W6 |
| 24b | internal-alpha:browser-proof | 视觉签名基线、覆盖清单、axe、逐 story 英文泄漏、外观期望 | 全部截图签名变化；类目与 story 数变化 | SUB-010（输入 digest 路径）、SUB-027、SUB-041（期望）、SUB-046（基线选择） | W8 |

## 7. 「Storybook」所指

根脚本 `storybook:build` = `pnpm --filter @tcrn/design-system-storybook build` = `tsc && node dist/build.js`，产出静态文档 `apps/storybook/storybook-static`（README 所称 Track B，Vercel 产物）；`storybook:manager-build` 才是真 Storybook 10.4.6（Track A，输出 storybook-preview-static，已 gitignore，不在 verify）。现有与新增的浏览器门全部量 Track B；START 的「storybook:build 成功」也是 Track B。Story 正文里「Storybook 渲染结果」按 Track B 判；两轨共用 `contract-stories` 注册表，SUB-030/031 同时补 Track A 的 CSF 适配，Track A 不设门。

