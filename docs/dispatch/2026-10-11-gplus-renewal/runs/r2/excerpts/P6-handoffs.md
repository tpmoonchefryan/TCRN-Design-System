# 附件 · P6 的前置包交回（P4、P7 handoff 原文，P9 handoff 供参考）

## P4 handoff（runs/r2/handoff/P4.md）

### 交回说明 · P4（INIT-015 R2，Inputs 收尾）

分支 `claude/init015-r2-p4`，自集成分支 060789f 切出。只改了本包文件集：`packages/ui-react/src/styles/inputs.css.ts`、`packages/ui-react/src/components/Form/Form.test.tsx`、`apps/storybook/src/smoke.test.ts`。pairs.json、tokens.json、生成物、门脚本都没动。

## 提交

| 提交 | Subtask | 来源 | 内容 |
| --- | --- | --- | --- |
| 696f516 | SUB-059 | R2-9 | 删去壳内搜索包裹层的 focus-within 状态规则（0,3,0）；MultiSelect 选项在本类上声明 fill-d/h/s 与生效对，两条状态规则只切换 |
| fe6a4bb | SUB-060 | R2-10 | 删去 `.tcrn-field--error` 的整块洗底与 outline-color；`.tcrn-field__error` 改读 `--tcrn-color-bad`；两份测试同步 |
| 5e799a6 | SUB-061 | R2-11 | MultiSelect 触发器 30px 末端区，caret 按 Select 图标定位；下拉容器改 flex，触发器与 Select 处于同一布局语境 |
| 48399ae | SUB-062 | R2-12 | 搜索快捷键文字 ink-3 改 ink-2 |
| 本提交 | — | — | 本交回说明与 problems/P4.md |

## 判据状态

- **SUB-059：达成。** contract:static 的 C2 从 7 条降到 3 条，其中 inputs 从 4 条降到 0 条，没有新增。消掉的 4 条是：壳内搜索规则 C2.specificity；选项 hover 的 C2.specificity 与 C2.colour；选项 selected 的 C2.colour。剩下 3 条都在 typography（问题 #2）。壳内搜索规则按判断给出的第一种改法直接删除：包裹层在哪个语境都不作画，没有东西要清。`inputsCss01` 留空，仍按原位拼接，`styles/index.ts` 不动。没有在 pairs.json 新定元组名。两处实施口径请留意：
  - 选项的默认字重原来经 `font: inherit` 继承，现在由生效对 `--tcrn-pair-weight: 400` 给出，选中时切到 600，写法同 Actions 生成段的 weight。full-surface 实测选项 fontWeight 仍是 400。
  - hover 规则排在 selected 之后，所以悬停在已选项上显示 hover 底、字重仍是 600。原来 hover 规则是 (0,3,0)，同样压过 selected；画板 `.opt.is-hover` 也排在 `[aria-selected]` 之后。
  - 副作用：Navigation.test.tsx:533 断言旧规则必须存在，因此转红。该文件不在本包文件集内（问题 #1）。
- **SUB-060：达成。** geometry:measure 的 light 轮里，inputs-matrix 的 err-msg-l 为 6.69（期望 6.69，差 0），err-msg-n 为 6.88（期望 6.88，差 0）；R1 时分别是 6.20、6.27。dark 轮的 err-msg-l 为 6.88，期望 6.69，这与五个家族里所有浅色格在 dark 轮的偏差同源，不是本单造成的（问题 #4）；dark 轮的 err-msg-n 为 6.88，与期望相等。强制色块里 `.tcrn-field--error` 的 Highlight outline 保留。`.tcrn-field` 基础规则（透明底、透明 outline、150ms 过渡）不在改法范围内，smoke 也断言了它，所以没动。
- **SUB-061：达成，按判据 public-popup-family-dark 一例仍红。** minHeight 的推断已用 Chromium 探针在本树构建的样式上确认：块级子元素 min-height:auto 时，getComputedStyle 报 `0px`；flex 项与 grid 项报 `auto`；Select 在 inline-flex 包裹层里报 `auto`。修法是让 `.tcrn-multi-select-dropdown` 成为 flex 容器（加 `align-items:center`），触发器因此和 Select 一样是 flex 项，门的比对字段没改。探针显示：触发器与参照 Select 在门比对的全部字段上一致（paddingRight 30px、minHeight auto）；caret 与 chevron 都距末端 8px、距顶 9px。full-surface 里 closed-select-family-empty 转绿；public-popup-family-dark 仍红，属预期，要等 SUB-083（问题 #3）。
- **SUB-062：按 token 计算达成**（下节）。axe 复核留给 R2 末次 verify 的第 30 步。

## §3.4 回显

- **第 2 项（R2-10，P29 口径更正）：** 已按建议先做。`.tcrn-field--error` 的整块洗底（state-blocked-bg 以 62% color-mix）和 outline-color 一并删去，错误文字改读 `--tcrn-color-bad`。偏差来自洗底：只换名不会转绿，因为 state-blocked 本来就解析到 bad。实测 err-msg-l 6.69、err-msg-n 6.88，均回到矩阵期望。Owner 不接受删除洗底时，恢复这两条声明，并把 126-GWT5 的 err-msg 两格移到第五批。
- **第 3 项（R2-12）：** Inputs 板本身画的是 ink-3（板里 `.sw>kbd` 的 `color:var(--ink-3)`）。已按 C1 文字 4.5 阈值改为 ink-2，在此回显给 Owner。夜间 ink-3 在 #282724、#272724 上为 3.89、3.90，低于 4.5；ink-2 为 6.13、6.15。另外，浅色 ink-3 在 wash 叠 bg（#e2e1dd）上为 4.31，同样低于 4.5，ink-2 为 6.56。Owner 若要保留板面的 ink-3，需要改 token 值或改承载底，这属于契约修订，本包未做。

## SUB-062 的 token 对比计算

按 WCAG 2.x 计算：sRGB 分量 c/255 线性化（≤0.04045 时除以 12.92，否则取 ((c+0.055)/1.055)^2.4），L = 0.2126R + 0.7152G + 0.0722B，对比 = (L亮 + 0.05) / (L暗 + 0.05)。token 值取自 `contract/tokens.json`：夜间 ink-2 #a9a69c，ink-3 #85827a，panel #191916，bg #121210，wash rgba(235,232,223,.07)。夜间 wash 叠 panel 的结果正是 #282724，与 axe 报的第一种底一致。

| 主题 | 文字 | 底 | 对比 |
| --- | --- | --- | --- |
| 夜间 | ink-2 #a9a69c | #282724 | **6.13** |
| 夜间 | ink-2 #a9a69c | #272724 | **6.15** |
| 夜间 | ink-3 #85827a（原值） | #282724 / #272724 | 3.89 / 3.90（与 axe 一致，可作算法校验） |
| 夜间 | ink-2 | wash 叠 bg #21211e | 6.63 |
| 夜间 | ink-2 | panel #191916（获焦底） | 7.23 |
| 浅色 | ink-2 #4f4c43 | wash 叠 panel #f1f1f1 / wash 叠 bg #e2e1dd / panel #ffffff | 7.60 / 6.56 / 8.58 |

两种夜间底上都不低于 4.5。

## 局部门结果

| 门 | 结果 |
| --- | --- |
| `--filter @tcrn/ui-react build` | 通过 |
| `--filter @tcrn/ui-react test` | 157 条，155 过、2 红。两红都在 Navigation.test.tsx（533、753 行），断言的是本包按判断改掉的两条旧规则；该文件在本包文件集外（问题 #1）。Form.test.tsx 全过 |
| `run build` | 通过 |
| `--filter @tcrn/design-system-storybook test` | 9/9 通过（含 smoke） |
| `run contract:static` | 单测 65/65；门本身红：C2 3 条、C5 1 条，都不属 Inputs（问题 #2）。inputs C2 从 4 降到 0；C6、C7、C8、C11、C13 绿（storybook 构建之后） |
| `run full-surface:proof` | 单测 11/11。浏览器段全部执行：MultiSelect 断言排在最后，此前各段均通过；MultiSelect 只有 public-popup-family-dark 红（预期，问题 #3） |
| `run geometry:measure` | 单测 60/60。10 个 story × 2 主题：light 轮 5 个矩阵全绿（含 err-msg 两格）；dark 轮 5 个矩阵 contrast 红，红格是浅色格（问题 #4）；5 个样板在两种主题下 rail 都红（问题 #5） |

没有门写入 `docs/verification/**`：geometry:measure 未带 `--write-report`，contract:static 未带 `--report`。每次跑门后工作树都干净，无需还原，也没有文件移进 trash。

## 接续点

无，四张 Subtask 都已完成。合入时注意：Form.test.tsx 按 P4 → P2、smoke.test.ts 按 P4 → P6 的顺序交接；Navigation.test.tsx 的两处断言要在合入后由其持有方或集成步改（问题 #1 写了逐字改法）。

## 临时项

- 会话 scratch 的 `tmp/r2-P4/`：各门日志、探针与计算脚本（minheight-probe.mjs、contrast.mjs、c2.mjs、geo*.mjs），约 412 KB。保留作本交回的原始证据，主线程用完 R2 判断后即可清理。
- 包树内各包的 `dist/`、`apps/storybook/storybook-static/` 是 gitignore 的可重建构建物，留给集成和后续门复用。
- 会话 scratch 的 `trash/r2-P4/`：空。

## P7 handoff（runs/r2/handoff/P7.md）

### 交回说明 · P7（INIT-015 R2，矩阵与样板标记）

分支 `claude/init015-r2-p7`，自集成分支 6225880 切出。只改了本包文件集：`apps/storybook/src/contract-stories/gplus/matrix-stories.tsx`、`matrix-renderer.tsx`、`samples/composition-one.tsx`、`apps/storybook/src/build/locales/storybook-content-text.ts`、`scripts/lib/locale-invariant-ledger.mjs`。没有改门、扫描器、生成物与回执；跑门写出的 `docs/verification/internal-alpha/**` 每次都已还原，新出现的未跟踪文件 `visual-selection-result.json` 已移进会话 trash。

## 提交

| 提交 | Subtask | 来源 | 内容 |
| --- | --- | --- | --- |
| d11452f | SUB-070 | R2-23 | inputs 矩阵的 MultiSelect 以静态展开态留在主题块内：StaticMarkup 另去掉根上的 `data-choice-presentation`，页面桥不再挂载它 |
| 36cf9db | SUB-070 | R2-23 | 上一项的后续：静态触发器摘要 "Quarterly review, October launch" 补五语 |
| 11141b0 | SUB-071 | R2-24 | 矩阵分节去掉 aria-label，不再构成 landmark；十只样板壳的 nav 与内容区按样板与主题块命名 |
| 7e292ff | SUB-072 | R2-25 | 品牌样板表删去 Asset ID 列；词典删 "Asset ID"，ledger 删四个资产 ID |
| ac90e3d | SUB-073 | R2-26 | 矩阵渲染器主题块的 JSX key 写到 className 同一行之后 |
| 0f53557 | SUB-074 | R2-27a | Actions 与 Inputs 矩阵控件补 data-h（md 32、sm 28） |
| 本提交 | — | — | 本交回说明与 problems/P7.md |

## 判据状态

- **SUB-070：达成。** storybook:visual-proof 的 inputs.B 两种主题都是声明 42、渲染 42、去重 42，缺格为空；geometry:measure light 轮 inputs-matrix 的 contrast 量到 42 格，其中 opt-sel-l 16.18（期望 16.18）、opt-sel-n 12.15（期望 12.15）。没写文档 CSS，没做 B-14 的可选项。
  - 包没有展开入口：MultiSelect 没有 open 或 defaultOpen 入参；页面桥 `mountStaticMultiSelect` 经 `mountStaticOverlayBoundary` 把未隐藏的列表移到 `document.body` 并 fixed 定位，列表因此离开矩阵主题块，visual-proof 在故事根下数不到这两格。原有的两条展开属性改写（aria-expanded、去 hidden）保留，另加一条去掉 `data-choice-presentation` 的改写，桥按这个属性挂载，去掉后列表留在原位。
  - 连带影响一：桥不挂载，触发器摘要保持服务端渲染的英文。原来桥会用已翻译的选项文本重写摘要。第一次 browser-proof 的 zh-CN 新泄漏里出现了 inputs-matrix 的 "Quarterly review"、"October launch"，第二个提交补了这条摘要的五语，最终那次 browser-proof 里已没有 inputs-matrix。写法与 inputs 样板已有的三项摘要词条一致。
  - 连带影响二：这个静态样本不再可交互，只用来展示展开态。P4 已把下拉容器改成 flex 行，所以展开的列表排在触发器右侧，不在下方；本包不加布局 CSS。inputs-matrix 两轮的 clip 与 overlap 都通过。是否接受这个排法，交目视验收。
- **SUB-071：达成。** 最终那次 browser-proof 的 axe 结果里，任何页面都没有 landmark-unique（R1 为 110 个节点：矩阵 92 个，样板 18 个）。
  - 矩阵：按判据的第二种做法，`MatrixSection` 不再给包的 Surface 设 aria-label，分节只靠 h3 标题，不再构成 region landmark，因此不需要新文案。smoke 测试依据的 `data-gplus-matrix-component` 不变。
  - 样板：五个样板都渲染在同一个分类页 `components-gplus-samples.html` 上，共十只壳。只改夜间块不够，因为五只浅色壳的 nav 都叫 "Main navigation"，icon 与 actions 两个样板的内容区又都叫 "Projects"，浅色壳之间仍然同名。现在经 ProductShell 的 `navLabel`、`contentLabel` 入参，每只壳的 nav 与内容区都以样板名命名，夜间壳再加 " (night)"，例如 "Icon sample: projects" 与 "Icon sample: projects (night)"。nav 与 region 角色不同，同一只壳的两个 landmark 用同一个名字不算重复。这也改了浅色块的名字，是为满足「110 个节点消失」而对判据字面的扩展，在此回显。
- **SUB-072：达成。** 按判据第一种做法删掉了 Asset ID 列，没有给扫描器加豁免；internal-vocab:scan 退出 0，hits 为空。表格剩产品、标语、注册三列。词典删除了已不渲染的 "Asset ID" 词条。`locale-invariant-ledger.mjs` 的 sampleMachineWords 删去了四个已不渲染的资产 ID 并改了注释。这个文件不在 SUB-072 的文件列里，但在本包文件集内，在此回显。
- **SUB-073：达成。** `pnpm scan` 退出 0，hits 为空（基线有 1 条，是 matrix-renderer.tsx 的 env-assignment）。扫描器口径没改。
- **SUB-074：达成。** 矩阵页上共有 140 个 `data-h="32"`、16 个 `data-h="28"`，即每个主题块 md 70 个、sm 8 个。md 包括：Button 与 IconButton 两个状态网格（各 26 个）、3 个 LinkButton、ButtonGroup 的 2 个 IconButton、6 个 Input、2 个 SearchInput、SuggestInput、Select、经 StaticMarkup 改写的 MultiSelect 触发器、NumberInput、DatePicker。sm 包括：5 个 ClipboardCopyButton 与 ButtonGroup 的 3 个 sm Button。Textarea、Checkbox、RadioGroup、Switch 没有尺寸档，不加。两矩阵里没有 lg 控件，所以没有 40。geometry:measure 两轮里 actions-matrix 与 inputs-matrix 的 controlHeight 都是 pass，最大偏差 0；checksNeverApplied 从 ["controlHeight"] 变为 []。visual-proof 的 actions.A/B、inputs.A/B 的 controlHeight 也是 pass。门没改，SUB-077 可据此把 controlHeight 设为必测项。

## 新增文案（五语）与 ledger

内容词典 `storybook-content-text.ts` 新增 11 条，删除 2 条（"Main navigation"、"Asset ID"）。没有新登记机器词；ledger 只删了四个资产 ID。

| 英文源文 | zh-CN | ja | ko | fr |
| --- | --- | --- | --- | --- |
| Quarterly review, October launch | 季度复盘、十月发布 | 四半期レビュー、10 月のリリース | 분기 리뷰, 10월 출시 | Revue trimestrielle, Lancement d’octobre |
| Typography sample: billing | 字体样板：账单 | タイポグラフィサンプル：請求 | 타이포그래피 샘플: 청구 | Échantillon typographique : facturation |
| Typography sample: billing (night) | 字体样板：账单（夜间） | タイポグラフィサンプル：請求（ナイト） | 타이포그래피 샘플: 청구(나이트) | Échantillon typographique : facturation (nuit) |
| Icon sample: projects | 图标样板：项目 | アイコンサンプル：プロジェクト | 아이콘 샘플: 프로젝트 | Échantillon d’icônes : projets |
| Icon sample: projects (night) | 图标样板：项目（夜间） | アイコンサンプル：プロジェクト（ナイト） | 아이콘 샘플: 프로젝트(나이트) | Échantillon d’icônes : projets (nuit) |
| Brand sample: products | 品牌样板：产品 | ブランドサンプル：製品 | 브랜드 샘플: 제품 | Échantillon de marque : produits |
| Brand sample: products (night) | 品牌样板：产品（夜间） | ブランドサンプル：製品（ナイト） | 브랜드 샘플: 제품(나이트) | Échantillon de marque : produits (nuit) |
| Actions sample: projects | 动作样板：项目 | アクションサンプル：プロジェクト | 액션 샘플: 프로젝트 | Échantillon d’actions : projets |
| Actions sample: projects (night) | 动作样板：项目（夜间） | アクションサンプル：プロジェクト（ナイト） | 액션 샘플: 프로젝트(나이트) | Échantillon d’actions : projets (nuit) |
| Inputs sample: invite members | 表单样板：邀请成员 | 入力サンプル：メンバー招待 | 입력 샘플: 멤버 초대 | Échantillon de saisie : inviter des membres |
| Inputs sample: invite members (night) | 表单样板：邀请成员（夜间） | 入力サンプル：メンバー招待（ナイト） | 입력 샘플: 멤버 초대(나이트) | Échantillon de saisie : inviter des membres (nuit) |

英文列同时是各词条的 en 值。样板名的译文沿用 `storybook-locale-text.ts` 里同名故事标题的译文；夜间后缀沿用词典里 "light and night" 一类词条的译法（夜间、ナイト、나이트、nuit）。渲染文本不含工单键。

## 局部门结果（最终树 0f53557）

| 门 | 结果 |
| --- | --- |
| `run build` | 退出 0 |
| `--filter @tcrn/design-system-storybook test` | 9/9 通过 |
| `run geometry:measure` | 单元测试 60/60 通过；报告 ok=false，红项只有两类已知原因：dark 轮五个矩阵的 contrast（浅色格，归 P1/SUB-047），以及五个样板两轮的 rail（33px，O-1）。checksNeverApplied 为 []，inputs 与 actions 矩阵 light 轮各项全部通过 |
| `run storybook:visual-proof` | 单元测试 16/16 通过；报告 0/22 行通过，原因只有 dark:contrast（矩阵与 logos 行）和 rail（样板与 compositions 行），同上两类。格数全部相等：typography 44、icon 28、brand 10、actions 116、inputs 42 |
| `run internal-vocab:scan` | 退出 0，hits 为空 |
| `run scan` | 退出 0，hits 为空 |
| `run internal-alpha:browser-proof` | 退出 1，红项都不在本包判据内（见 problems/P7.md）。axe 无 landmark-unique；zh-CN 新泄漏只剩 text-styles 两条；本包相关字段如上。回执已还原 |

## 提醒（不是红）

- 品牌样板删列后，与画板 V2-B1 D 段的「资产 ID」列不再对应。`docs/design/gplus-2026-10/storybook-map.json` 的 differences 是否需要补一条，由映射文件的持有方（P8/P12）决定。本包没有动该文件。
- P6 接着持有 `storybook-content-text.ts` 与 `locale-invariant-ledger.mjs`：本包新增的词条在 gplus 两段里，分别位于 "Archived project" 之后和 "Products" 之后。

## 接续点

无。五张 Subtask 已全部完成并提交，工作树干净。

## P9 handoff（runs/r2/handoff/P9.md）

### 交回说明 · P9（INIT-015 R2，浏览器门判定）

分支 `claude/init015-r2-p9`，自集成分支 e915306（已含 P4 合入）切出。只改了本包文件集：`scripts/internal-alpha-browser-proof.mjs`、`scripts/lib/multi-select-dropdown-proof.mjs`。`scripts/token-contrast-proof.mjs` 只被导入，没有改；组件、契约、生成物、回执都没动。

## 提交

| 提交 | Subtask | 来源 | 内容 |
| --- | --- | --- | --- |
| a244f1c | SUB-083 | R2-21b | MultiSelect 下拉证明切主题后、internal-alpha 的 Button 静止与 hover 读数前，等文档内全部有限动画结束再读；Button 读数写进 browser-proof-summary.json |
| a4e7534 | SUB-084 | R2-29 | internal-alpha 的 clipped 判定不再计入两类溢出：带 title 的 C7 单行截断（横向），以及单行 nowrap 的字体度量溢出（纵向） |
| cd1d37b | SUB-085 | R2-30 | internal-alpha 的 axe color-contrast 读 token-contrast 门的字标后缀豁免表（同源），按两个后缀选择器加登记的后缀色豁免 |
| afd008c | — | — | 本交回说明与 problems/P9.md 初稿 |
| 5583f5a | SUB-084 | R2-29 | 只改注释：clipped 判定里关于字体内容区的注释把「不计」写成了「计」，改正；代码与行为不变，所以没有重跑门 |
| 本提交 | — | — | 交回说明补上 5583f5a 一行；仍是最后一个提交 |

## 判据状态

- **SUB-083：达成。**
  - 两处都换成了同一种等待：反复取 `document.getAnimations()` 中 playState 为 running、迭代次数有限的动画，等它们的 `finished` 全部兑现，最多 20 轮；无限循环动画（骨架屏、进度条）不等，也不去动它们。没有写死时长，期望值和断言都没改（MultiSelect 的观测值里多存了一个 `settled` 字段，只作记录，不参与判定）。
  - MultiSelect（full-surface:proof）：`public-popup-family-light` 和 `public-popup-family-dark` 都转绿。dark 一例中，列表层底和参照 Select 底都是 rgb(25, 25, 22)，等待 1 轮后结束。修改前参照 Select 底读到的是过渡起点的白色。触发器几何已由 P4 的 SUB-061 合入，closed-select-family-empty 照旧是绿的。
  - internal-alpha：`buttonFeedbackOk: true`。读数：静止底 rgb(11, 107, 101)，hover 底 rgb(10, 95, 90)，都等于 pairs.json primary 的 d、h 填充按浅色 token 解析的期望值；hover 后等到 1 个动画结束（1 轮），静止读数前没有在跑的动画。读数和两次等待的结果一起写在 browser-proof-summary.json 的 `buttonFeedbackReadback` 里（回执按 R1 第 11 条已还原，没有提交，由 SUB-046 落盘）。
  - R2-21 的 (a) 部分（storybook-smoke）归 P6，本包没碰。
- **SUB-084：达成。** 判定前后被记录的元素数见下节。组件侧的 `overflow-x: clip` 没改。
- **SUB-085：达成。** 豁免条目见下节。token-contrast 门结果不变：`ALL PAIRS PASS`，`4 wordmark exemption(s) applied`，脚本文件没改。

## SUB-084：clipped 判定前后计数

| 时点 | 被记元素数 | 构成 |
| --- | --- | --- |
| 判定前（e915306 本地跑） | 288 | h1 33、h2 195、h3 59、h4 1，与判断记载一致；38 个页面视口组合 |
| 判定后（a4e7534 与 cd1d37b 本地跑） | 0 | `clippedButtonText: false` |

判定前我写了个只读诊断脚本（放在 scratch，不进树），逐个描述这 288 个元素：全部是单行 nowrap，带 ellipsis，并且自身的 title 在空白规范化后包含可见文字。其中只有纵向溢出的 219 个，溢出 3 到 4px（26px 衬线字放在 30px 行框里，scrollHeight 33、clientHeight 30；36px 字放在 40px 行框里，44 对 40），行框都能放进内容盒；只有横向截断的 54 个；横纵都有的 15 个。

新规则只放过同一行上的两类溢出：

1. **横向：** 元素是 nowrap 的单行（文本片段按纵向中心聚类后只有一个行框），设了 ellipsis，并且「浏览器在它上方显示的 title」（自身的，或最近祖先的）或它内部某个 title，在空白规范化后包含它的可见文字。比较口径同 C7，本门自己实现，没有建共享模块。
2. **纵向：** nowrap 单行；行框高度（computed line-height，取 normal 时用文本片段高度）不超过内容盒高度加 1px；溢出量不超过「字体内容区高出行框的部分」加 1px。

仍然照记的情况：没有 title，或 title 不含全文；只有 clip、没有 ellipsis；固定高度小于行框；行内子元素比行框高、溢出超过字体内容区；文字折行。上面这些我用合成标题做了反证，跑的是从门脚本里原样切出来的判定代码块：untitled、wrongtitle、cliponly、fixedcut、tallchild、wrapped 六例照记；titled、空白不同的 title、祖先 title、26px/22px 字体度量溢出（scrollHeight 26 对 22）四例不记。

口径提示：contract-static 的 C7 接受 title 出现在自身、内部，或「到组件根为止、不含同角色其它元素」的祖先上。本门接受的是自身、内部和最近带 title 的祖先，没有照搬同角色计数这一保护，因为这里要求 title 包含该元素的可见文字，已经把 title 和这段文字绑在一起了。SUB-079 收紧 C7 之后，如果要两边逐字对齐，请在 R3 拆分时一并核对。

## SUB-085：axe 豁免条目

豁免表在模块加载时由 `WORDMARK_EXEMPTIONS` 逐条映射，写进 a11y-axe-summary.json 的 `wordmarkContrastExemption`。适用规则是 color-contrast，选择器是 `.tcrn-brand-wordmark__suffix` 和 `.tcrn-product-logo__line-one-suffix`。每条都原样带上 token-contrast 的 ruling 与 source：

| theme | fg | on | 解析色 | ruling | source | pending |
| --- | --- | --- | --- | --- | --- | --- |
| light | `--tcrn-brand-suffix-design-system` | `--tcrn-color-panel` | #6577f3 | TCRN-DS-MIN-20261011-GPLUS-RENEWAL D2 | V2-B1-Brand 板 F 段（字标作为 logotype 免于 4.5） | — |
| light | `--tcrn-brand-suffix-design-system` | `--tcrn-color-bg` | #6577f3 | 同上 | 同上 | — |
| dark | `--tcrn-brand-suffix-tms` | `--tcrn-color-panel` | #2c63c8 | 同上 | 同上 | 夜间后缀色待 Owner 裁定（R1 问题 P15） |
| dark | `--tcrn-brand-suffix-tms` | `--tcrn-color-bg` | #2c63c8 | 同上 | 同上 | 同上 |

匹配规则：一个 color-contrast 节点要同时满足两点才豁免：位于两个后缀选择器之内（`closest`），并且 axe 量到的前景色是表里的某个后缀解析色。豁免的节点不再算违例，带着 axe 自己的读数（fgColor、bgColor、contrastRatio）逐个列在各段的 `wordmarkContrastExempted` 下。

本地结果：axe 违例条目从 82 降到 24，共豁免 92 个后缀节点。浅色页里，DS 后缀落在 #ffffff 上 38 个（其中 2 个是 brand-wordmark，其余是 product-logo）、#ecf4f3 上 30 个、#ebf2f2 上 2 个、#dde4df 上 2 个、#172421 上 2 个，TMS 后缀落在 #191916 上 4 个；夜间页里，TMS 后缀落在 #191916 上 10 个，DS 后缀落在 #172421 上 4 个。剩下的 88 个 color-contrast 节点全部是标语 `tcrn-product-logo__line-two` 和壳锁定说明 `tcrn-shell-brand-lockup__caption`（ink-3），不在豁免内，留给 O-2（problems #3）。

口径提示：token 表登记的是 token 对（后缀色、主题、panel 或 bg）。渲染出来的后缀还会落在 token 门不量的承载面上（文档顶栏、样板侧栏、预览面板），所以 axe 只比对后缀选择器和登记的后缀色，不比对主题和承载面。由此，样板页品牌样板壳侧栏 #172421 上的 6 个 DS 后缀节点（axe 量得 4.18）也被豁免了。它们位于 `data-shell="br-n"` 中；另有夜间页的 `br-l`，那里浅色格按夜间 token 渲染，归 P1 SUB-047。表里 DS 只登记了浅色（token 门量 DS 在夜间 panel、bg 上为 4.60、4.90，都通过）。Owner 若要求 axe 豁免也跟随表里的主题，在匹配里加上节点所在的 `data-tcrn-theme` 即可，这 6 个节点会重新算作违例。

## §3.4 回显

- **第 5 项（R2-30）：** 已按建议先做。axe 对品牌后缀登记字标豁免，依据沿用 token-contrast 已登记的 D2 与 V2-B1-Brand 板 F 段，条目直接从 `WORDMARK_EXEMPTIONS` 导入，没有另抄一份。标语与壳锁定说明（ink-3）不在豁免内。豁免范围按承载面放宽的口径见上节「口径提示」。
- **第 7 项（R2-29）：** 本包只做了前半句，已按建议先做：clipped 判定不再计入合规的 C7 截断，被记元素从 288 降到 0。后半句（收紧 C7、改 Button 禁用原因的 title）是 SUB-079 的工作，不在本包。

## 局部门结果摘要

| 门 | 时点 | 结果 |
| --- | --- | --- |
| `run build` | e915306、a244f1c、a4e7534、cd1d37b 各一次 | 四次都 exit 0（输出里有弃用 token 提示，属已知现象） |
| `run full-surface:proof` | a244f1c | exit 0：node --test 11 项通过；multiSelectDropdown 全部检查 ok，含 public-popup-family-dark |
| `exec node scripts/token-contrast-proof.mjs` | cd1d37b | exit 0：ALL PAIRS PASS，4 条字标豁免生效，最低文字对比 4.59 |
| `run internal-alpha:browser-proof` | e915306（基线） | exit 1：buttonFeedbackOk false、clippedButtonText true、axe 82 |
| 同上 | a244f1c | exit 1：buttonFeedbackOk true；clipped 与 axe 未变 |
| 同上 | a4e7534 | exit 1：clippedButtonText false（0 个）；axe 82 |
| 同上 | cd1d37b | exit 1：axe 24，豁免节点 92；本单相关字段全绿。剩下的红都不在本包，见 problems/P9.md #1 至 #6 |

最后一次 internal-alpha 跑（cd1d37b）的总体 exit 1，由下列别包或已知原因造成：storyCoverageManifestOk false（两项文档壳检查与 zh-CN 新漏译 2 处）、axe 剩余 24 条、storyHeightBudget 不通过（新超额 1 条、过期豁免 8 条）、视觉签名回归 155 与新基线 30（SUB-046 之前不计入判定）。browserProofSummaryOk 为 false，只是因为 storyCoverageManifest 和 axe 两项；逐页的 clipped、溢出、节奏、控制台、请求失败等字段全部通过。复合门 internal-alpha:proof 的其余三段（contracts、scan、hardening）不在本包局部门里，未执行。

每次跑完都用 `git -C <包树> checkout -- docs/verification/internal-alpha` 还原了回执；每次新生成的未跟踪文件 `visual-selection-result.json` 都移进了会话 scratch 的 trash/r2-P9/run0 至 run3。

## 接续点

无。三张 Subtask 都已完成并提交，工作树干净。

## 临时项

- 已清理：四次 internal-alpha 跑出的 `visual-selection-result.json`（共约 0.7 MB），移进会话 scratch 的 trash/r2-P9；树内回执每次都还原了。
- 保留（会话 scratch 的 tmp/r2-P9，约 6 MB）：两个诊断脚本（clip-diag.mjs、clip-negative.mjs）、各次门输出，以及 receipts-0 至 receipts-3 四份回执副本。上面 288、219、54、15、92、24 这些数字都出自这些副本，验收核对完就可以删。

