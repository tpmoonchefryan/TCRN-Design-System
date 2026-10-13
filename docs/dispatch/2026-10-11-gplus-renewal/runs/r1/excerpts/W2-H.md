# 摘录 · W2-H（INIT-015 R1）

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
| W2-H | SUB-011 | `scripts/contract-proof.mjs`<br>`tests/contract-proof.test.mjs` | 45 | contract-proof 与测试 |

包内局部门：

- W2-H：`corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node --test tests/contract-proof.test.mjs`

## 本包 Subtask（decomposition.md 第 3 节）

#### TCRN-DS-SUB-011 · contract-proof：生成物与契约哈希一致、图标名册、产品标逐字节、矩阵逐格期望与画板一致

- 包 / 波：W2-H / W2
- 文件：`scripts/contract-proof.mjs`，`tests/contract-proof.test.mjs`
- 依赖：TCRN-DS-SUB-009
- 判据：122-GWT1（测试里改 pairs.json 一个 ink 不重生成判红）、122-GWT2 生成段部分（重生成后绿；生成的状态规则无颜色字面量）、122-GWT3（icons.json 37 名与 dist 的 tcrnIconNames 集合相同；SUB-014 合并前此项预期红）、122-GWT4（marks.json 生成的 8 个 SVG 与 logos2 逐字节一致）；另比对矩阵数据每格 expect 与五板 data-expect（格数 44/28/10/116/42，差 0）
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/contract-proof.test.mjs`

## 跨包交回（r1/handoff/W1-A.md）

### 交回说明 · W1-A

## 已交付

- SUB-008（250fd44）：`docs/design/gplus-2026-10/contract/` 六份 JSON（tokens 39 键同集 + 27 个主题无关 token + 4 个产品后缀色；pairs 四张表；matrices 五板 44/28/10/116/42 格；icons 37 名其中 9 个 new；marks 四枚标与五语标语；typography）。`tools/data.mjs` 读取并交叉校验（matrices 的对表引用、后缀色与 palette），无副作用。`lib.mjs` 与六个 build 脚本改为经 data.mjs 读数据：Actions 板的变体声明、Inputs 板的四段对表声明、字体板的刻度 CSS、每个 data-cell 的 expect、Icon 板色块、logos2 与标语表都由契约生成。
- SUB-009（b10f696）：`scripts/contract-generate.mjs`（`--check` 只比对、过期退出 1；也可 `import { generate }` 取内存结果）与七个生成物。

## 给后续包

- 家族包在 `styles/<家族>.css.ts` 里引入：`actionsPairsCss`（actions.pairs.ts）、`inputsPairsCss` 或三段分开的 `inputsTextPairsCss` / `inputsCheckPairsCss` / `inputsSwitchPairsCss`（inputs.pairs.ts）、`typographyScaleCss`（typography.scale.ts）。段内顺序为：生效对默认值 → 变体声明 → 状态规则；放在家族基础规则之后。
- 基础规则读 `--tcrn-pair-fill|ink|edge|weight`（勾选类另有 `--tcrn-pair-mark`，开关类 `--tcrn-pair-knob`、`--tcrn-pair-knob-edge`，轨道即 fill）。
- contract-proof 可比对生成物头部的 `contract-sha256`，或直接调用 `node scripts/contract-generate.mjs --check`。
- 图标：`tcrnIconPathNames`（37）、`tcrnIconNewNames`（9）、`tcrnIconPaths`；产品标：`tcrnProductMarks`（colorBody 与 currentColor 的 inkBody、taglines 五语）；token：`tcrnGplusThemedTokens`（light / dark）、`tcrnGplusFixedTokens`（值已换成包内变量）、`tcrnGplusBrandTokens`；矩阵：`gplusMatrices`、`gplusMatrixCellCounts`。这些文件目前未从包入口导出，由对应家族包接线。

## 集外改动需求

无。base.css.ts、styles/index.ts、Icon.tsx、Navigation.tsx、ui-tokens 的 index.ts 与 tokens.css 本包均未触碰。

## 未做完

无。

