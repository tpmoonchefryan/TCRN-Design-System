# 摘录 · W1-B（INIT-015 R1）

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
| W1-B | SUB-010 | `packages/ui-react/src/components/Navigation/Navigation.tsx`<br>`packages/ui-react/src/styles/index.ts`<br>`packages/ui-react/src/styles/base.css.ts`<br>`packages/ui-react/src/styles/typography.css.ts`<br>`packages/ui-react/src/styles/icon.css.ts`<br>`packages/ui-react/src/styles/actions.css.ts`<br>`packages/ui-react/src/styles/inputs.css.ts`<br>`packages/ui-react/src/styles/brand.css.ts`<br>`scripts/lib/component-css-sources.mjs`<br>`scripts/css-template-integrity-proof.mjs`<br>`scripts/stamp-whitelist-proof.mjs`<br>`scripts/shell-fidelity-proof.mjs`<br>`scripts/token-extension-proof.mjs`<br>`scripts/component-modifier-proof.mjs`<br>`scripts/selection-grammar-proof.mjs`<br>`scripts/internal-alpha-browser-proof.mjs`<br>`apps/storybook/src/build/foundation-visual-standards.ts`<br>`apps/storybook/README.md` | 85 | styles/ 段模块、Navigation.tsx 再导出、六个读源门改读新位置、语义等价证据（提交信息） |

包内局部门：

- W1-B：`corepack pnpm@10.12.1 -C <包树> run typecheck`；`corepack pnpm@10.12.1 -C <包树> run build`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/stamp-whitelist-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-fidelity-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/token-extension-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/component-modifier-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/selection-grammar-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`

## 本包 Subtask（decomposition.md 第 3 节）

#### TCRN-DS-SUB-010 · tcrnComponentCss 拆为按家族的段模块（语义不变），读源门改读新位置

- 包 / 波：W1-B / W1
- 文件：`packages/ui-react/src/components/Navigation/Navigation.tsx`，`packages/ui-react/src/styles/index.ts`，`packages/ui-react/src/styles/base.css.ts`，`packages/ui-react/src/styles/typography.css.ts`，`packages/ui-react/src/styles/icon.css.ts`，`packages/ui-react/src/styles/actions.css.ts`，`packages/ui-react/src/styles/inputs.css.ts`，`packages/ui-react/src/styles/brand.css.ts`，`scripts/lib/component-css-sources.mjs`，`scripts/css-template-integrity-proof.mjs`，`scripts/stamp-whitelist-proof.mjs`，`scripts/shell-fidelity-proof.mjs`，`scripts/token-extension-proof.mjs`，`scripts/component-modifier-proof.mjs`，`scripts/selection-grammar-proof.mjs`，`scripts/internal-alpha-browser-proof.mjs`，`apps/storybook/src/build/foundation-visual-standards.ts`，`apps/storybook/README.md`
- 依赖：无
- 判据：为 EPIC-040 并行开路（122 生成段要有落点）：Navigation.tsx 第 2132–5872 行的模板拆到 styles/，Navigation.tsx 只再导出 tcrnComponentCss；按选择器主语归家族（text/heading/highlight→typography，icon→icon，button/icon-button/link-button/clipboard→actions，input/textarea/select/multi-select/suggest/number/date/checkbox/radio/switch/search-input/field→inputs，brand/product-logo/product-lockup/shell-brand→brand，其余→base）；跨家族选择器列表（实测约 16 条，以拆分时实测为准）与 1 个混合 reduced-motion @media 原位拆成相邻规则；判据：规范化规则序列（选择器列表拆单、带 at-rule 上下文）前后相同，page-template.tsx 依赖的三处注释标记保留且顺序不变；token-extension-proof 允许 --tcrn-pair-* 局部变量；六个读源门全绿
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/stamp-whitelist-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-fidelity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/token-extension-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/component-modifier-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/selection-grammar-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`

## verify 链影响表中与本包有关的行（第 4 节）

| # | 步骤 | 现判据（摘要） | 焕新后的影响 | 负责 | 转绿 |
| --- | --- | --- | --- | --- | --- |
| 4 | `dist:hygiene` | ui-react dist 无孤儿产物 | styles/ 新模块有源文件对应，预计不受影响 | SUB-010 自查 | W1 |
| 6a | tokens:proof › css-template-integrity | 在 Navigation.tsx 找模板标记 | 模板迁到 styles/ | SUB-010 | W1 |
| 6f | tokens:proof › stamp-whitelist | stamp token 只给 stamp 组件；TOKEN_OWNERS 含 Navigation.tsx | 规则迁到 styles/；标题衬线不得借 stamp token | SUB-010、SUB-006 | W1、W2 |
| 6g | tokens:proof › shell-fidelity | 文档层无装饰渐变、圆角字面量、模糊 >3 阴影；包源列表 | 包源列表改 styles/；文档层文件变化 | SUB-010、SUB-025/026；各家族 CSS 圆角走 token、阴影 ≤3 | W1、W3 |
| 6h | tokens:proof › token-extension | 包内 --tcrn-* 定义须已登记；radius.panel = radius.surface | 路径迁移；--tcrn-pair-*；品牌 accent 表变化 | SUB-010、SUB-023、SUB-006 | W1、W2 |
| 6i | tokens:proof › selection-grammar | 选中态只用 ink，不加品牌轴 | 源列表变化；家族遵守 C6 | SUB-010、SUB-025；家族自守 | W1、W3 |
| 7 | component-modifiers:proof | 读 Navigation.tsx 找 heading--1..4 等 | 路径迁移；Text 新修饰类 | SUB-010、SUB-013 | W1、W2 |
| 24b | internal-alpha:browser-proof | 视觉签名基线、覆盖清单、axe、逐 story 英文泄漏、外观期望 | 全部截图签名变化；类目与 story 数变化 | SUB-010（输入 digest 路径）、SUB-027、SUB-041（期望）、SUB-046（基线选择） | W8 |

