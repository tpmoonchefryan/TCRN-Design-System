# 摘录 · W2-C（INIT-015 R1）

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
| W2-C | SUB-014 → SUB-015 | `packages/ui-react/src/components/Icon/Icon.tsx`<br>`packages/ui-react/src/components/Icon/Icon.test.tsx`<br>`packages/ui-react/src/styles/icon.css.ts`<br>`packages/ui-react/package.json`<br>`pnpm-lock.yaml`<br>`packages/ui-react/README.md`<br>`scripts/package-contract-manifest.mjs` | 70 | Icon 新渲染器、lucide 移除与锁文件 |

包内局部门：

- W2-C：`corepack pnpm@10.12.1 -C <包树> run typecheck`；`corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`；`corepack pnpm@10.12.1 -C <包树> exec node --test packages/ui-react/dist/components/Icon/Icon.test.js`；`corepack pnpm@10.12.1 -C <包树> install`；`grep -c lucide <包树>/packages/ui-react/package.json`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/package-contract-manifest.mjs`

## 本包 Subtask（decomposition.md 第 3 节）

#### TCRN-DS-SUB-014 · Icon 改为契约路径渲染：20 格、1.25px 非缩放描边、14/16/20 三档，名册 37

- 包 / 波：W2-C / W2
- 文件：`packages/ui-react/src/components/Icon/Icon.tsx`，`packages/ui-react/src/components/Icon/Icon.test.tsx`，`packages/ui-react/src/styles/icon.css.ts`
- 依赖：TCRN-DS-SUB-009，TCRN-DS-SUB-010
- 判据：124-GWT1 的标记部分（svg viewBox 0 0 20 20、stroke-width 1.25、vector-effect non-scaling-stroke；16px 实测 1.25 由矩阵 story 测量）、124-GWT2（名册外名字类型检查失败：测试里 @ts-expect-error）；路径只来自 icon-paths.generated.ts，组件内不手写路径；tcrnIconNames 与 icons.json 同集（37）；strokeWidth prop 移除；loader-circle 旋转 900ms linear 用 motion.loading.loop；decorative 与 aria 行为不变
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test packages/ui-react/dist/components/Icon/Icon.test.js`

#### TCRN-DS-SUB-015 · 移除 lucide-react：依赖、锁文件、README 图标段与包契约脚本

- 包 / 波：W2-C / W2
- 文件：`packages/ui-react/package.json`，`pnpm-lock.yaml`，`packages/ui-react/README.md`，`scripts/package-contract-manifest.mjs`
- 依赖：TCRN-DS-SUB-014
- 判据：124-GWT3（packages/ui-react/package.json 与 src 搜 lucide 为 0 且构建通过）；README 图标段改为自绘 37 件名册；package-contract-manifest 不再记 lucide 来源；回执 docs/verification/** 不在本单提交（批末再生，跑完后 git checkout 还原）
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> install`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `grep -c lucide <包树>/packages/ui-react/package.json`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/package-contract-manifest.mjs`

## verify 链影响表中与本包有关的行（第 4 节）

| # | 步骤 | 现判据（摘要） | 焕新后的影响 | 负责 | 转绿 |
| --- | --- | --- | --- | --- | --- |
| 1 | `pnpm install --frozen-lockfile` | 锁文件与清单一致 | 新增 5 个 fontsource devDependencies；移除 lucide-react | SUB-004、SUB-015 各自更新锁文件 | W1、W2 |
| 24a | internal-alpha:contracts | 写包契约与组件 API 回执 | lucide 移除、新 prop、ButtonGroup 使回执变化（运行时自动写） | SUB-015、SUB-017 改脚本；SUB-046 提交回执 | W8 |

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

## 跨包交回（r1/handoff/W1-B.md）

### INIT-015 R1 · W1-B（SUB-010）交接

SUB-010 已完成，没有接续点。提交：8ae44e2（段模块、再导出、读源门改读新位置）、3d3e5b5（token-extension 接受 `--tcrn-pair-*` 局部变量）。本文件给 W2/W3 家族包、集成与验收用；问题清单在 `runs/r1/problems/W1-B.md`。

## 现在的结构

- `packages/ui-react/src/styles/{base,typography,icon,actions,inputs,brand}.css.ts`：各家族导出模板串段 `<family>CssNN`。
- `packages/ui-react/src/styles/index.ts`：按原级联顺序拼接全部段，导出 `tcrnComponentCss: string`。这是顺序唯一写定的地方。
- `packages/ui-react/src/components/Navigation/Navigation.tsx`：只再导出 `tcrnComponentCss`，公开导出与原有 import 不变。
- `scripts/lib/component-css-sources.mjs`：读源的门经它取样式文本。`componentCssSourcePaths()` 列出 `styles/` 下全部 .ts（含将来的 `styles/generated/`），`componentCssModules()` 按文件给出段文本，`componentCssText()` 给出全部段文本（不是级联顺序；要顺序就从 dist 导入）。没有任何段文本时直接抛错，门不会因为读空而变绿。

## 家族包怎么接

1. 只改自己的 `styles/<家族>.css.ts`。新规则写进已有段；生成段 import 进来后拼进某一段，例如 ``export const actionsCss03 = `…` + actionsPairCss;``。
2. 不新增 `<family>CssNN` 导出。`styles/index.ts` 只由 SUB-010 写，不在拼接列表里的段不会发出，`css-template-integrity-proof` 会把它报红。确需新落点时写进本包号的 handoff，交 W3-D 或主线程。
3. 段里的 CSS 注释不得含反引号，否则段会被提前截断（同一条门会报出段名）。
4. `styles/base.css.ts` 在 W2 冻结（跨包约定第 5 条）。
5. icon 家族目前没有规则，`iconCss01` 是空落点，位于 root 自定义属性之后、第一条 actions 规则之前。

归属规则：主语取最右复合选择器，没有 tcrn 类时向左取最近带 tcrn 类的复合；一个复合含两个组件类时归最后一个；块名等于家族名或以「家族名-」开头即归该家族，长名优先。所以 `.tcrn-lane-board__card .tcrn-text` 这类上下文规则归 typography，由 typography 包负责。

## 段与原 Navigation.tsx 行号对照

被拆开的规则，各片沿用原规则的行号区间，所以相邻段的区间会重叠。

- base：01 2133-2154，02 2155-2159，03 2181-2188，04 2241-2245，05 2251-2295，06 2307-2362，07 2363-2385，08 2502-2559，09 2563-2584，10 2585-2867，11 2953-3044，12 3049-3149，13 3177-3290，14 3294-3615，15 3620-3891，16 3895-3989，17 3994-4004，18 4008-4036，19 4037-4103，20 4107-4142，21 4147-4220，22 4226-4355，23 4367-4574，24 4424-4612，25–27 4575-4612，28 4575-4677，29 4693-4917，30 4988-5184，31 5250-5348，32 5380-5585，33 5595-5682，34 5695-5749，35 5753-5763，36 5788-5789，37 5794-5795，38 5797-5810，39 5814-5871
- typography：01 3150-3171，02 3291-3293，03 3616-3619，04 3892-3894，05 3990-3993，06 4005-4007，07 4037-4041，08 4104-4106，09 4143-4146，10 4221-4225，11 4356-4366，12 4680-4690
- actions：01 2155-2159，02 2160-2188，03 2189-2245，04 2246-2250，05 2363-2371，06–08 4575-4612
- inputs：01 2290-2306，02 2868-2952，03 3045-3048，04 4575-4612，05 4920-4985，06 5188-5248，07 5350-5378，08 5574-5593，09 5684-5693，10 5751，11 5764-5785，12 5790-5793，13 5796，14 5811-5813
- brand：01 2386-2501，02 2560-2562，03 2585-2596，04 4424-4574
- icon：01 为空落点

## 等价证据

比对对象是构建后 `packages/ui-react/dist/index.js` 导出的 `tcrnComponentCss`，迁移前后各取一份：

- 规范化规则序列（选择器列表拆成单个选择器，保留 at-rule 上下文，去掉空白与注释）974 = 974 条，逐条相同；用 Chromium CSSOM 重新解析两份字符串，974 = 974 条单选择器条目，逐条相同。
- 注释 79 = 79 条，顺序相同；page-template.tsx 依赖的三处注释标记各出现一次，顺序不变。
- 字节 124578 → 126188（UTF-8），差异只在拆开的 10 条选择器列表与 3 个 at-rule 块；同一套模块不做拆分时，构建结果与迁移前逐字节相同（sha256 f8200e9b9b0cce4b4ac642620030e252dfde7d65a994639d49f12241e135ac4b）。
- 仓内 36 个读 `tcrnComponentCss` 的测试与脚本里，1142 个含 tcrn 类的正则与字符串字面量对前后两份样式表的命中结果没有变化。

检查脚本与输出不入仓，路径见 W1-B 交回消息。

## 局部门（包树根执行）

typecheck、build、css-template-integrity、stamp-whitelist、shell-fidelity、token-extension、component-modifier、selection-grammar、`--filter @tcrn/ui-react test`（109/109）全绿；verify 影响表第 4 行要求的 dist-hygiene 自查通过（220 个产物都有源文件）。没有写回执。

