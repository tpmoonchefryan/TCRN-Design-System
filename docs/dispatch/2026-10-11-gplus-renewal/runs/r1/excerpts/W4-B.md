# 摘录 · W4-B（INIT-015 R1）

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
| W4-B | SUB-037 | `scripts/contract-static-proof.mjs`<br>`scripts/lib/css-rules.mjs`<br>`tests/contract-static-proof.test.mjs`<br>`docs/contract/**` | 70 | contract-static 全绿与渲染层检查、豁免登记 |

包内局部门：

- W4-B：`corepack pnpm@10.12.1 -C <包树> run build`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-static-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node --test tests/contract-static-proof.test.mjs`

## 本包 Subtask（decomposition.md 第 3 节）

#### TCRN-DS-SUB-037 · contract-static 现仓全绿：story 渲染层的 C7/C8/C11 检查与豁免登记

- 包 / 波：W4-B / W4
- 文件：`scripts/contract-static-proof.mjs`，`scripts/lib/css-rules.mjs`，`tests/contract-static-proof.test.mjs`，`docs/contract/**`
- 依赖：TCRN-DS-SUB-036，TCRN-DS-SUB-018，TCRN-DS-SUB-021，TCRN-DS-SUB-023，TCRN-DS-SUB-026，TCRN-DS-SUB-027
- 判据：132-GWT4（现仓全绿）；加对 storybook-static 渲染层的 C7/C8/C11 扫描（如 LockHint 默认 🔒 属后续家族，按条目登记豁免带裁定引用，不改该组件）；豁免只能按条目登记并带裁定引用，不加无条件 skip；--family 子集
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-static-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/contract-static-proof.test.mjs`

## 跨包交回（r1/handoff/W1-E.md）

### 交回说明 · W1-E

## 已交付

- SUB-036（f8cbe4e）：契约静态门 `scripts/contract-static-proof.mjs`、规则解析库 `scripts/lib/css-rules.mjs`（自写，无依赖）、测试 `tests/contract-static-proof.test.mjs`（41 条：解析器、夹具全绿、STORY-132 GWT1–3、每条规则一条转红变异、豁免与登记校验、仓内契约文件一致性），以及 `docs/contract/` 四份文件：`clauses.md`（C1–C17 原文与各条落点）、`families.json`（16 家族与根类）、`exemptions.json`（第二至五批 11 个家族，七条款，引用 INIT-015 不授权段与 P4）、`roles.json`（C7 单行角色、C8 工具栏）。
- 现仓结果（build 之后）：C2 红 9、C5 红 1、C13 红 160；C6、C7、C8、C11 绿。逐条见 `problems/W1-E.md` P1–P5。

## 给 W4-B（SUB-037）

- **转绿清单。** STORY-132 GWT4「现仓全绿」要清的就是 problems/W1-E.md 的 P1–P5：链接与 MultiSelect 选项的状态规则改对表（P1、P2，P1 的 G+ 段是生成物）；`inputs.css.ts` 里壳层上下文压 SearchInput 的特异性（P3）；主题图标的浅色声明（P4）；158 个文档层类改 `tcrn-doc-` 或删除，两个第一批包外类（`tcrn-input--short`、`tcrn-search-input--compact`）进包或换用已有修饰类（P5）。
- **豁免机制。** `exemptions.json` 每条恰有 `family`、`classes`、`selectors` 之一，`clauses` 只收 C2/C5/C6/C7/C8/C11/C13，`ruling` 必填。第一批家族、其类、选中其类的选择器都不能登记，登记了门判红。没有 tcrn-* 类的选择器（如 P4）只能用 `selectors` 精确登记。报告的 `scope.unusedExemptions` 列出本次没命中的条目（现为 identity）。
- **story 层留给你的部分。** C7 的 title 属性与容器矩阵下不换行、C8 的量测让步（让步项到 min-width 后其余不被压）、C11 的元素嵌套深度、四级语义同形、通用件拼壳、渲染文本里的表情字符（拆分 P4 的 LockHint「🔒」在这里）。C13 已由本门经 doc-shell-class-proof 的差集静态覆盖，story 层不必重算。
- **可复用的导出。** `evaluateContract({ packageCss, tokensCss, families, exemptions, roles, pairs, outOfPackage })` 是纯函数；`runContractStaticProof({ root })` 读 dist 与契约文件；`checkC2/C5/C6/C7/C8/C11/C13`、`selectorFacts`、`buildScope`、`validateExemptions` 可单独调用。解析库导出 `parseCss`、`compounds`、`parseCompound`、`specificity`、`selectorClasses`（`targetOnly` 去掉 `:not()`、`:has()` 里的类）、`shadowLayers`、`colourLiterals`、`emojiIn`。story 层若与本门共用家族归属，读同一份 `families.json`，按 `blockOf`（去掉 `__` 与 `--`）归类。
- **接入 verify。** 需要改 `package.json`（不在本包文件集）：脚本 `"contract:static": "node --test tests/contract-static-proof.test.mjs && node scripts/contract-static-proof.mjs"`，接在 verify 的 `doc-shell:proof` 之后（C13 需要构建后的静态文档；差集算不出时门判红 `C13.input-missing`，不跳过）。
- **口径可改处。** problems/W1-E.md P9 列了本包自定的判定口径（透明 outline 允许项、无变体时的 (0,2,0)、左边条 2px 阈值、状态类 ARIA 列表等），都写在 `docs/contract/clauses.md`；要改时同步改门里的常量与测试的允许项用例。

## 命令

在包树根：`corepack pnpm@10.12.1 -C <树> run build`，然后 `corepack pnpm@10.12.1 -C <树> exec node --test tests/contract-static-proof.test.mjs` 与 `corepack pnpm@10.12.1 -C <树> exec node scripts/contract-static-proof.mjs [--details] [--report <path>]`。门不写回执，也不写仓内文件（`--report` 只写到给定路径）。

