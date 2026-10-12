# INIT-015 G+ 焕新 · Owner 目视验收清单

本清单供 Owner 目视验收使用。目视验收由 Owner 本人做，不由实施对话、子代理或任何机器门代签（纪要 D8）；清单中没有任何一项已判为通过，每项留空待 Owner 勾选。机器门结果与目视结论分开记录：下文的机器证据只说明「门查了什么、结果在哪里」，不替代目视。

清单按画布正本页的 10 块板逐板一节，顺序与 `docs/design/gplus-2026-10/boards/canvas.json` 的 order 相同。其中 V2-Families 与 V2-Rejections 两块没有渲染面，节内写明原因，不列目视项。

## 怎么看

- **静态文档（Track B，浏览器门量的就是它）。** 在仓库根执行 `pnpm build`，然后打开 `apps/storybook/storybook-static/` 下的页面：矩阵在 `components-gplus-matrices.html#<story id>`，样板在 `components-gplus-samples.html#<story id>`。文档壳的主题与语言用查询参数切换，例如 `?theme=dark`、`?locale=zh-CN`。
- **真 Storybook（Track A）。** `pnpm storybook:manager-build` 输出到 `apps/storybook/storybook-preview-static`，story id 形如 `typography--matrix`。Track A 不设门（拆分第 7 节）。
- **浅色与夜间。** 每个矩阵与样板 story 都自带浅色块（`data-tcrn-theme="light"`）和夜间块（`data-tcrn-theme="dark"`），下文「浅色 / 夜间」指这两块，各看一遍。typography 与 inputs 两块左右并排，icon、brand、actions 上下叠放（DIFF-7）。
- **对照物。** 画板以仓内副本 `docs/design/gplus-2026-10/boards/<板>.dc.html` 为准（画布版本 33；纪要 D6：包是真值，Storybook 只渲染包，画布是草稿与确认面）。截图只做目视，不做像素比对。
- **差异编号。** DIFF-n 指 `docs/design/gplus-2026-10/storybook-map.md` 的「差异」表；P-n 指 `runs/r1/problems/decomposition.md`，另注明其他问题清单。

## 机器证据入口

下列报告与命令在批末由 W8-A 统一重生成，请以重生成后的版本为准。本包（W7-A）没有运行这些门，集成树上的现状见 `runs/r1/handoff/W6-A.md` 与 `runs/r1/problems/`。R2 各包跑过的局部门结果见 `runs/r2/handoff/` 与 `runs/r2/problems/`；R2 回写本清单的包（P11）同样没有运行这些门，批末由 SUB-046 重生成。R3 由 P4 回写本清单（SUB-106），随后在同一包里批末重生成映射报告、几何报告与 internal-alpha 回执（SUB-076、SUB-078、SUB-046），结果见 `runs/r3/handoff/P4.md`。

| 证据 | 路径或命令 |
| --- | --- |
| 画板逐行映射报告（23 行，含构图三；八项测量、shellFrame 与重叠检查） | `docs/verification/storybook-visual-proof/gplus-map-report.md` 与 `.json`；`node scripts/storybook-visual-proof.mjs --write-report` |
| 几何测量 | `docs/verification/geometry-measure/report.json`；`node scripts/geometry-measure-proof.mjs --write-report` |
| 契约静态门（C2、C5、C6、C7、C8、C11、C13） | `pnpm contract:static`，可加 `--family <家族>`；入仓报告路径由批末用 `--report` 指定 |
| 契约生成物门 | `pnpm contract:proof` |
| 样板与矩阵样式对照 | `pnpm doc:sample-style`，可加 `--story <id>` |
| 文档层类名 | `docs/verification/doc-shell-class/baseline.json`；`pnpm doc-shell:proof` |
| 对比度（C1 阈值与字标豁免） | `pnpm tokens:proof` 内的 token-contrast-proof，只输出到终端 |
| 字体渲染（八条腿） | `pnpm fonts:render`，只输出到终端 |
| 字体文件、许可与覆盖（含四个字族 token 的 Noto 中文回退） | `pnpm fonts:proof`；现状见表下 |
| 产品标文件 digest | `pnpm brand-asset:proof` |

**fonts:proof 现状（R2）。** R1 时 `tests/fonts-proof.test.mjs` 有 3 条用例（入仓树、构建产物副本、zh-CN 覆盖）因夹具仍用 distributable-latin 字栈而失败。R2 的 SUB-049（ed98557）把夹具换成契约里的四个 G+ 字族 token（ui、heading、serif、mono），这 3 条恢复为绿，并新增三类变异，各自判红：缺某个字族 token、字族 token 缺 Noto 中文回退、fonts.css 带了没有字族 token 引用的字族；门的判定不变。SUB-048（e79092f）给等宽字栈加了 Noto Sans SC，自此门要求四个字族 token 都带 Noto 中文回退。据 ed98557 的提交说明，P1 交回时 `tokens:proof` 12 段全绿（含 fonts-proof 的测试与脚本两段）。集成树上的结果以批末重生成为准。

## 1 · V2-GPlus · G+ 以 G 为底盘的高级感版

本板没有独立 story：两屏是成员页整页，主体是第二批以后的家族；底盘值落在 token（`contract/tokens.json`），第一批件在五个样板里各有消费（storybook-map「没有 story 的板」）。

| story id | Storybook id | 页面 |
| --- | --- | --- |
| `typography-sample-billing` | `typography--sample-billing` | `components-gplus-samples.html#typography-sample-billing` |
| `icon-sample-project` | `icon--sample-project` | `components-gplus-samples.html#icon-sample-project` |
| `brand-sample-product` | `brand--sample-product` | `components-gplus-samples.html#brand-sample-product` |
| `actions-sample-project` | `actions--sample-project` | `components-gplus-samples.html#actions-sample-project` |
| `inputs-sample-members` | `inputs--sample-members` | `components-gplus-samples.html#inputs-sample-members` |

| 核对项 | 浅色 | 夜间 |
| --- | --- | --- |
| 纸、面板、线、三档墨、强调色的整体观感与画板两屏一致（D1） | [ ] | [ ] |
| 控件轮廓是 line-ctl（浅 rgba(22,21,15,.47)，夜 rgba(255,255,255,.36)），不是 7% 发丝线（D2） | [ ] | [ ] |
| 阴影紧贴、模糊小（十种手法 07） | [ ] | [ ] |
| 焦点环是 2px 承载面间隙加 2px 强调色 | [ ] | [ ] |
| 字体：界面 Hanken Grotesk 与 Noto Sans SC，标题与数字 Source Serif 4 与 Noto Serif SC，等宽 IBM Plex Mono；中文没有回落到系统字（D4） | [ ] | [ ] |

差异：DIFF-3（底盘板 kv 表写「侧栏 212 · 顶栏 48」，构图板写侧栏 220、顶栏 52；按 O-4 以构图板 220/52 为准，设计会话 B 类裁定（2026-10-11），Owner 可更正）。机器证据：每行的 shadowBlur 与 contrast 测量（映射报告）、对比度、字体渲染。

## 2 · V2-Families · 组件家族清单（本板无目视项）

家族清单与批次顺序是规划板，不是组件规格。第一批 23 件即五个矩阵的名册，其余家族不在本批授权内（storybook-map SCOPE）。机器落点：`docs/contract/families.json`（`scope.batch` 指定第一批五家族）。

## 3 · V2-GPlus-Compositions · 两种页面构图

| story id | Storybook id | 映射行 |
| --- | --- | --- |
| 第 1 节表中的五个样板 | 同上 | compositions.1.typography、.icon、.brand、.actions、.inputs |
| `composition-three-sample`（`components-gplus-samples.html#composition-three-sample`） | `compositions--composition-three` | compositions.3 |

| 核对项 | 浅色 | 夜间 |
| --- | --- | --- |
| 构图一：侧栏留在画布上，顶栏与内容合成一张离边 12px 的白纸（D1） | [ ] | [ ] |
| 侧栏宽 220（ProductShell 默认取 `--tcrn-shell-sidebar-width`；局部变量 `--tcrn-product-shell-sidebar-width` 仍可由消费方覆写） | [ ] | [ ] |
| 侧栏引导列：图标左缘 16、文字起点 48（STORY-129 GWT3） | [ ] | [ ] |
| 五个样板里第一批件的用法与对应 B1 板 D 段一致 | [ ] | [ ] |
| 构图一壳几何（R3，SUB-090，907de34；O-1）：收起宽 52、壳顶栏 52、纸面离壳上右下各 12（左贴侧栏）、圆角 14 加 s1 阴影、panel 底；侧栏为画布色、无右边线；收起态放得下 38px 收起钮。在五个样板上展开与收起侧栏各看一遍 | [ ] | [ ] |
| TMS 夜间后缀（R3，SUB-088，52faa47；O-3）：夜间块里 TMS 后缀为 #7aa0f5（浅色仍为 #2c63c8），Design System 后缀两主题同为 #6577f3。看 brand 矩阵与样板侧栏里的 TMS 字标 | [ ] | [ ] |
| 构图三样板（R3，SUB-092；O-4）：无侧栏、顶部一条导航、内容 max-width 1040 居中（1440 视口下 story 框只给 956）；只用包的公开组件 | [ ] | [ ] |
| 构图三与构图板的差（请判断是否可接受）：独立 TopBar 高 68，板上顶栏 56（独立 TopBar 高度按裁定不改）；导航排在搜索之后（TopBar 没有导航槽）；导航是 SubNav 胶囊条，板上是文字加 2px 墨线；1024 视口下导航折成 4 行 | [ ] | [ ] |

已知差距（R3 落地后）：ProductShell 的引导列、收起态内距与纸面只作用于 `@media not all and (max-width: 760px)`，移动块未改；侧栏画布色与壳顶栏最小高 52 在所有宽度生效；独立 TopBar 仍为 68。文档壳随构图一改为侧栏 220、收起 52、顶栏 52、引导列 16、画布色侧栏（SUB-101），但仍有三处偏差：品牌锁定组合仍为 38 标、文案起点 66（构图一为 48）；文档页没有离边 12 的纸面；知识库样板顶栏的描述截成一行加省略号（全文仍在 DOM 里）。1024 宽下文档页里的构图一样板受文档侧栏挤压，纸面约 406 宽，工具行折行，壳顶栏高到 147；几何门与映射门只量 1440×900（来源 `runs/r3/handoff/P1.md` 第 79 行）。逐条见「R3 落地项」一节。这些项的裁定在「待 Owner 裁定」第 1 条。机器证据：映射报告中构图一五行的 rail 与 shellFrame 测量、构图三一行的 clip、singleLine、shadowBlur 与 overlap。

## 4 · V2-B1-Typography · 第一批 01 字体

| story id | Storybook id | 映射行 |
| --- | --- | --- |
| `typography-matrix` | `typography--matrix` | typography.A、typography.B（44 格） |
| `typography-sample-billing` | `typography--sample-billing` | typography.D |

C 动效规范、E 消费方须提供什么、F token 差异、G 许可与分发四段没有 story，以画板副本与契约文件为准。

| 核对项 | 浅色 | 夜间 |
| --- | --- | --- |
| 标题 1 至 4 级为衬线，字号行高按契约（page 36/40、heading-2 26/30、heading-3 与 section 20/26），单行，溢出出省略号，悬停可见全文 | [ ] | [ ] |
| Text 默认 13/20 次墨；reading 14/22、meta 12/16、caption 11/16；strong 为主墨 600 | [ ] | [ ] |
| numeral「4,280.00」为衬线 300、等宽数字，单位在 small 里；caps 为间距大写，编号在 b 里，单行省略 | [ ] | [ ] |
| Highlight 的 mark 只加底色，不改字重、字距、字号、内距（D3） | [ ] | [ ] |
| 链接为强调色加 70% 下划线，悬停 acc-2，焦点为焦点环；quiet 链接为当前文字色、下划线透明，悬停 acc-2（R2，SUB-055） | [ ] | [ ] |
| 标题到正文的间距不小于该组件自身行距；分节标题与说明垂直居中对齐（D3） | [ ] | [ ] |
| 账单页样板与画板 D 段一致 | [ ] | [ ] |

差异：DIFF-4（夜间选择器，已裁定）、DIFF-7（待 Owner 知悉）、DIFF-1（样板壳层，已按 O-1 实现）。机器证据：映射报告 typography 三行（clip、singleLine、shadowBlur、mark、overlap、contrast、rail）、`pnpm contract:static --family typography`、`pnpm doc:sample-style --story typography-sample-billing`。

## 5 · V2-B1-Icon · 第一批 02 图标

| story id | Storybook id | 映射行 |
| --- | --- | --- |
| `icon-matrix` | `icon--matrix` | icon.A、icon.B（28 格） |
| `icon-sample-project` | `icon--sample-project` | icon.D |

| 核对项 | 浅色 | 夜间 |
| --- | --- | --- |
| 名册 37 件齐全，含新增 9 件（plus、minus、users、bell、copy、trash、calendar、more-horizontal、chevron-up），20 格网格（D2） | [ ] | [ ] |
| 16px 下描边 1.25，sm、md、lg（14、16、20）三档描边粗细相同（STORY-124 GWT1） | [ ] | [ ] |
| 图标跟随所在文字的颜色，状态格换色与宿主一致 | [ ] | [ ] |
| 复制按钮四个结果态图标（copy、check、alert-triangle、info） | [ ] | [ ] |
| loader-circle 转动、减少动态效果时停止（静态文档不播放动效，需在 Track A 看） | [ ] | [ ] |
| 项目列表样板与画板 D 段一致 | [ ] | [ ] |

差异：DIFF-4、DIFF-7、DIFF-1。可更正项：`.tcrn-icon` 基类已进包（「待 Owner 裁定」第 4 条）。机器证据：映射报告 icon 三行、`pnpm contract:proof`（图标路径对契约）、`pnpm contract:static --family icon`。

## 6 · V2-B1-Brand · 第一批 03 品牌

| story id | Storybook id | 映射行 |
| --- | --- | --- |
| `brand-matrix` | `brand--matrix` | brand.A、brand.B（10 格） |
| `brand-sample-product` | `brand--sample-product` | brand.D |

| 核对项 | 浅色 | 夜间 |
| --- | --- | --- |
| TCRN 为墨色中等字重；TMS 后缀浅色 #2c63c8、夜间 #7aa0f5（O-3，SUB-088），Design System 后缀 #6577f3；渐变文字已停用（D2） | [ ] | [ ] |
| Einzbern、Mana Orchestrate 为衬线整名加「by TCRN」，产品壳侧栏里不显示 byline | [ ] | [ ] |
| 标的尺寸分层：ProductLogo 38、ProductLockup 28、产品壳侧栏 22（关于页 56 由消费方覆写） | [ ] | [ ] |
| 产品壳收起时只留标，文案隐藏 | [ ] | [ ] |
| 收起态的三条中心线（R3 实测，门不量；来源 `runs/r3/handoff/P1.md` 第 81–84 行）：52 收起栏里收起钮中心 26，标中心 16（在 42 宽的品牌链接里靠起始边），导航图标中心 22，侧栏中心 26，三条中心线不齐。请判断是否可接受 | [ ] | [ ] |
| AOS 注册项、AOS 后缀与 TCRN 母标保持原样（D5） | [ ] | [ ] |
| 产品页样板与画板 D 段一致 | [ ] | [ ] |
| 产品页样板去掉了「资产 ID」整列（R2，SUB-072，7e292ff），与 Brand 板 D 段的四列表（产品、资产 ID、标语 · zh / en、注册）不一致。storybook-map 记为 DIFF-9；R3 按 R2 判断 §3.3 第 2 条改记「待 Owner 知悉」，不恢复资产 ID 列（SUB-093） | [ ] | [ ] |

已知差距：R3 后收起宽为 52（O-1，SUB-090，STORY-127 GWT4）；TMS 夜间后缀为 #7aa0f5（O-3，SUB-088，目视项在第 3 节）。对比度门对字标的豁免由 4 条减为 2 条：TMS 夜间于 panel 与 bg 两条已撤（夜间 TMS 于 panel 6.86、于 bg 7.30），余 Design System 浅色于 panel 与 bg，引用 D2 与本板 F 段（`runs/r1/handoff/W3-A.md`）。机器证据：映射报告 brand 三行、`pnpm tokens:proof`、`pnpm brand-asset:proof`。

## 7 · V2-B1-Actions · 第一批 04 动作

| story id | Storybook id | 映射行 |
| --- | --- | --- |
| `actions-matrix` | `actions--matrix` | actions.A、actions.B（116 格） |
| `actions-sample-project` | `actions--sample-project` | actions.D |

| 核对项 | 浅色 | 夜间 |
| --- | --- | --- |
| Button 四个变体（primary、secondary、quiet、danger）逐态与画板 B 段一致（默认、悬停、按下、焦点、禁用、加载、选中） | [ ] | [ ] |
| 三档 28、32、40，内距 10、12、16，字号 12、13、14；IconButton 为正方形，图标 14、16、20 | [ ] | [ ] |
| 按下只换填充，不缩放、不位移（STORY-125 GWT5） | [ ] | [ ] |
| ButtonGroup 共用一条轮廓、成员间 1px 分隔，quiet 组没有轮廓；获焦成员的焦点环完整，不被邻居遮住 | [ ] | [ ] |
| 加载态显示 loader，忙碌文案随 story 语言 | [ ] | [ ] |
| 复制按钮结果态只换墨色：copied 为 ok、failed 为 bad、unsupported 为 ink-3 | [ ] | [ ] |
| 外壳主题切换钮与侧栏切换钮随 Actions 状态对换色，按下不缩放 | [ ] | [ ] |
| 项目页样板与画板 D 段一致 | [ ] | [ ] |

差异：DIFF-4、DIFF-5（静态状态用 data-tcrn-preview-state，已裁定）、DIFF-7、DIFF-1。可更正项：外壳切换钮尺寸仍为 36 与 38（「待 Owner 裁定」第 3 条）。机器证据：映射报告 actions 三行、`pnpm contract:static --family actions`、`pnpm geometry:measure --family actions`。

## 8 · V2-B1-Inputs · 第一批 05 表单控件

| story id | Storybook id | 映射行 |
| --- | --- | --- |
| `inputs-matrix` | `inputs--matrix` | inputs.A、inputs.B（42 格） |
| `inputs-sample-members` | `inputs--sample-members` | inputs.D |

| 核对项 | 浅色 | 夜间 |
| --- | --- | --- |
| 文本类控件：默认边 line-ctl，悬停 ink-2，焦点为强调色环；invalid 为红边，invalid 加焦点为红边加红环 | [ ] | [ ] |
| 控件高 32、圆角 8、字号 13，占位为 ink-3 | [ ] | [ ] |
| Select 的 chevron 与 DatePicker 的 calendar 位于末端 30px 内，点在图标上仍打开原生控件；MultiSelect 触发器末端同为 30px，箭头位置与 Select 的 chevron 相同（R2，SUB-061） | [ ] | [ ] |
| Checkbox、Radio 16px，勾、半选横杠与单选点；Switch 轨 34×20、钮 16、行程 14，开态钮为 on-acc，夜间为深色钮 | [ ] | [ ] |
| SearchInput 为墨洗工具形态，顶栏与表单内一致：无边 wash，悬停 line-2，焦点纸底加环，占位 ink-2，快捷键 mono 10px（D2） | [ ] | [ ] |
| Field 获焦时不再整块洗底 | [ ] | [ ] |
| 邀请成员样板与画板 D 段一致 | [ ] | [ ] |
| 复核：inputs 矩阵里 MultiSelect 的静态展开态（R2，SUB-070，d11452f；R3，SUB-091，1a10b84）。R2 时列表位于触发器右侧；R3 把 `.tcrn-multi-select-dropdown` 改为纵向（flex-direction column、align-items stretch），实测列表紧贴触发器正下方（偏移 0、宽差 0、左缘对齐），四个选项各占一行不换行，亮暗两块读数相同（P5 交回）。列表保持展开、不响应点击；静态样例去掉了 `data-choice-presentation` 钩子（RM7）。运行时浮层与触发器之间仍留 8px 间隙，判据未要求，交 R3 判断 | [ ] | [ ] |

差异：DIFF-4、DIFF-5、DIFF-6（开关钮探针，待测量库支持）、DIFF-7、DIFF-1。机器证据：映射报告 inputs 三行、`pnpm contract:static --family inputs`、`pnpm geometry:measure --family inputs`。

## 9 · V2-Rejections · 打回根因总账与契约条款草案（本板无目视项）

打回总账与条款草案是治理文本，条款由各门执行，不是渲染面（storybook-map）。条款原文与各条落点在 `docs/contract/clauses.md`，豁免登记在 `docs/contract/exemptions.json`。机器证据：`pnpm contract:static`、`pnpm contract:proof`。

## 10 · V2-B2-Logos-Draft · 四枚产品标

| story id | Storybook id | 映射行 |
| --- | --- | --- |
| `brand-matrix` | `brand--matrix` | logos.A-E、logos.I |

F 构法、G 颜色、H SVG 源三段没有 story，落点是 `docs/design/gplus-2026-10/contract/marks.json` 与 `logos2/*.svg`。

| 核对项 | 浅色 | 夜间 |
| --- | --- | --- |
| TMS 为双臂高举的艺人（#2c63c8 / #7aa0f5）；Einzbern 为接住一点光的盃（#3b5272 / #8aa6c9）；Mana Orchestrate 为两结点一道流（#3a9a63 / #9ddc8c）；Design System 为四色版面（#6577f3 #3096f4 #43d4cf #78b957）；实心几何、两色平涂、48 格（D5） | [ ] | [ ] |
| 单色版跟随文字色 | [ ] | [ ] |
| ProductLogo 四个产品与 ProductLockup 的锁定块 | [ ] | [ ] |
| 标语（I 段）：TMS「艺人管理系统」、Einzbern「项目记忆引擎」、Mana Orchestrate「项目记忆助手」、Design System「设计系统」，其余四语与契约一致（D5） | [ ] | [ ] |

已知差距：brand-matrix 只有 TCRN 标 22、28、38、56 四档与产品标 38 一档、单色版与锁定块，画板的 128 至 16 六档阶梯与 64、32 两种贴片没有 story（DIFF-8，storybook-map 按 R2 判断 §3.3 第 1 条记「待 Owner 知悉：第二批品牌」，不补 story；「待 Owner 裁定」第 5 条）。机器证据：`pnpm brand-asset:proof`（八个文件 digest、包导出与渲染字节）、映射报告 logos 两行。

## R2 按建议先做的项 · 目视核对（R1 判断 §3.4）

R2 实施对话按 R1 判断 §3.4 的建议先做了下列 11 项，Owner 可事后更正。每项一行：有渲染面的项留浅色、夜间两格待勾；没有渲染面的项写明去哪里读，两格写「—」。来源是 R2 的提交与 `runs/r2/handoff/` 的包交回。另有 RM7、RM13 两行，分别加在第 8 节与第 6 节表末。

| # | 事项 | 现状与来源 | 看哪里、看什么 | 浅色 | 夜间 |
| --- | --- | --- | --- | --- | --- |
| 1 | R2-6 只读框获焦补焦点环（与画板状态顺序不同） | inputs-text 加 rf 元组，排在 r 之后：只读框获焦时显示焦点环，底与字色仍为只读态（WCAG 2.4.7）。画板是 r 盖住 f，画板未随之重生成（RM10）。7213a27（SUB-058），P2 交回第 6 节 | inputs 矩阵的 read-only 行：用 Tab 移入只读框，焦点环出现，底与字色不变（矩阵没有单列的 rf 格） | [ ] | [ ] |
| 2 | R2-10 Field 错误态去掉整块洗底（P29 口径更正） | `.tcrn-field--error` 的整块洗底与 outline 色一并删去，错误文字读 `--tcrn-color-bad`；强制色下的错误轮廓保留。Owner 不接受时恢复这两条声明，并把 126-GWT5 的 err-msg 两格移到第五批。fe6a4bb（SUB-060），P4 交回 | inputs 矩阵的 err-msg 格与邀请成员样板里的错误字段：字段不再整块洗底，错误文字为 bad 色 | [ ] | [ ] |
| 3 | R2-12 搜索快捷键文字 ink-3 改 ink-2 | Inputs 板画的是 ink-3（`.sw>kbd`），按 C1 文字 4.5 阈值改为 ink-2：夜间 ink-3 在 wash 上为 3.89、3.90，ink-2 为 6.13、6.15；浅色 ink-3 在 wash 叠 bg 上为 4.31，ink-2 为 6.56。要保留 ink-3 须改 token 值或承载底，属契约修订。48399ae（SUB-062），P4 交回 | inputs 矩阵的 SearchInput 与文档壳顶栏搜索框的快捷键文字，对照 Inputs 板 | [ ] | [ ] |
| 4 | R2-17 密集与紧凑壳原型退役并删除守护断言（C O-4） | dense（hub 与 command-center 两块）与 compact 两个壳原型从静态文档删除，只守它们的 44 条冒烟断言一并删除，删除清单在提交说明里。组件清单页与导出面上的两个原型名已由 SUB-105（4d0dfde，R3）删去（原 P6 问题 #6）。Owner 要保留时，回退 95f0e09 与 4d0dfde 的对应部分，在第二批用包组件重画。95f0e09（SUB-066），P6 交回；4d0dfde（SUB-105） | `components-navigation-shells.html`：dense 与 compact 两段已不在；dense story 只留面板、说明与密度表，focused story 留知识库壳与紧凑壳的一句选用说明 | [ ] | [ ] |
| 5 | R2-30 axe 对品牌后缀登记字标豁免 | axe 的 color-contrast 对品牌后缀放行，条目直接从 token-contrast 的 `WORDMARK_EXEMPTIONS` 导入（依据 D2 与 Brand 板 F 段）；标语与壳锁定说明（ink-3）不在豁免内。豁免不分主题与承载面，夜间样板侧栏 6 个 Design System 后缀节点（4.18:1）也被豁免，而 token-contrast 的登记只写了浅色（RM6，与「待 Owner 裁定」第 2 条同组）。R3 现状：夜间底上的 Design System 后缀不再被豁免，R3 回执 `a11y-axe-summary.json` 的 80 个豁免节点的底色都是 #ffffff 或 #efeeea。cd1d37b（SUB-085），P9 交回 | brand 矩阵与五个样板侧栏里的 TMS、Design System 后缀，浅色与夜间都看是否可辨读 | [ ] | [ ] |
| 6 | R2-8 主题钮图标显隐改由 data-current-theme 控制（取 C-9，不取 B-3） | 删去 html 级与默认的 `[data-theme-icon]` 显隐规则，显隐只由 `.tcrn-shell-theme-toggle[data-current-theme]` 的透明度规则决定，块级主题与页级主题同样生效；默认隐藏 moon 的 `[data-theme-icon="dark"]` 也一并删去（RM3，交验收）。6976d2f（SUB-057），P3 交回第 3 节 | 五个样板的外壳主题钮：浅色块显示太阳，夜间块显示月亮，不再两个都不显示 | [ ] | [ ] |
| 7 | R2-29 clipped 判定排除 C7 合规截断；R2-31 收紧 C7 并改 Button 禁用原因的 title | 浏览器门的 clipped 判定不再计入带 title 的合规截断，被记元素 288 → 0（a4e7534、5583f5a，SUB-084，P9 交回）。C7 对第一批承载元素（今为 `tcrn-button__label`）要求浏览器显示的 title 含可见文字；Button 有禁用原因时 title 为「标签 — 原因」，原因仍走 aria-describedby（e0baaba，SUB-079，P10 交回）。由此带出的两处集成红（非英文语言下这种 title 不翻译、ClipboardCopyButton 测试仍断言旧 title）已交集成修复包 I1（RM14），截至本包切出点 8d8ff8d 未合入 | actions 矩阵与项目页样板里带禁用原因的按钮：悬停提示为「标签 — 原因」；被截断的按钮标签悬停可读全文 | [ ] | [ ] |
| 8 | R2-16 守卫例外的登记（后续家族沿用 EX-INIT015-* 写法） | SUB-065 的规则级守卫把文档层对包类的声明限定为摆放属性，登记五条例外：EX-INIT015-doc-tooltip-static-preview、-doc-filter-bar、-doc-nav-proof-skip-link、-doc-shell-brand-collapse、-doc-shell-brand-narrow（后两条依 C-21 待 O-1；R3 已随 SUB-101 删除，见「R3 落地项」第 3 行），逐条见 `runs/r2/handoff/P5.md`。守卫实际落在 `scripts/shell-fidelity-proof.mjs` 的 `docsPackageSelectorDuplication`（RM12）。461306d（SUB-065），P5 交回 | 五处文档呈现与改前一致：Tooltip 静态预览为展开态、筛选栏的标签排布、包导航证明框里的跳转链接、侧栏收起时文档壳品牌文案的收起动效、极窄视口下品牌文案隐藏 | [ ] | [ ] |
| 9 | O-10 契约注释改为与焦点环行为一致 | 只改 `contract/tokens.json` 里 surface 的注释（包与画板都显示 bg 色间隙），值不变。e79092f（SUB-048），P1 交回 | 没有新的渲染面；焦点环外观按第 1 节「焦点环」一行核对 | — | — |
| 10 | C-21 暂缓到 O-1 之后，不按包壳现行几何先改一遍 | R2 时文档壳几何未改；R3 在 O-1 裁定后已按构图一改（SUB-101，见「R3 落地项」第 4、5 行）。以下为 R2 现状：shell:parity 余文档壳三项（brand-lockup、sidebar、shell-relations），原码上同样红（RM12）；390px 宽时文档壳顶栏 401px 高、品牌字出现两次（P9 问题 #4）。P5 交回 | 文档壳 390px 宽时的顶栏与品牌：现状待 O-1 答复后处理，本行只作知悉 | [ ] | [ ] |
| 11 | 三片已判可接受的实施口径一并回显 | W1-C 拦截 data: URI、W2-G 复制 OFL 进 storybook-static、W2-A P10 别名目标、W3-A P4 字标豁免与 bg 承载面、W2-H 只含 transparent 的 outline 放行、W1-B P5、W2-B P4/P5/P6、W2-D P7、W3-D P5（vertical-align middle）、W1-D 包写出的类不计包外类、W5-C `--strict` 不设默认、W1-E 的 C2/C6/C11 口径、W6-A 门序与命名、拆分 P5/P17/P22/P31 的载体调整、M5 `.tcrn-icon` 基类进包 | 回显项，不单列目视；`.tcrn-icon` 基类进包见第 5 节与「待 Owner 裁定」第 4 条 | — | — |

## R3 落地项 · 目视核对（设计会话裁定与 R3 交回）

R3 按设计会话 2026-10-11 的 B 类裁定（O-1…O-4，Owner 可更正）与 R2 判断 §3.3 的 B 类裁定实施。构图一壳几何、TMS 夜间后缀与构图三样板的目视项在第 3 节，MultiSelect 静态展开态的复核项在第 8 节。本节逐条列 R3 新增与删除的文档层例外（登记在 `scripts/shell-fidelity-proof.mjs` 的 `DOC_PACKAGE_CLASS_EXCEPTIONS`，说明见 `docs/style-scale.md`「Registered exceptions」），以及文档壳按构图一改后的现状与偏差。只写事实，不代 Owner 勾选。

| # | 事项 | 现状与来源 | 看哪里、看什么 | 浅色 | 夜间 |
| --- | --- | --- | --- | --- | --- |
| 1 | 新增例外 EX-INIT015-doc-product-shell-search-static | 选择器 `.tcrn-doc-product-shell-search--static-display[data-search-expanded="true"] .tcrn-product-shell-search__results`，属性 position、inset；重复选择器白名单随之加回 `.tcrn-product-shell-search__results`；删除条件：Navigation 家族批次由包提供静态结果展示。16a15b3（SUB-100，R3-9；R2 判断 §3.3 第 4 条），P3 交回 | `components-navigation-shells.html` 的 ProductShell 故事：展开的静态搜索结果留在版面内，把标题与首段往下推，不再盖住 | [ ] | [ ] |
| 2 | 新增例外 EX-INIT015-doc-knowledge-shell-topbar、-side-nav、-group-title、-nav-item | 知识库样板的独立 TopBar（min-height 52、padding-block 6）、SideNav（padding 16、画布色）、分组标题（padding-inline 0）、导航项（起始内距为 space-1 减 1px 边框）取构图一几何，作用域为 `.tcrn-doc-knowledge-shell-layout[data-standard-shell]`；重复选择器白名单随之加 `.tcrn-nav-group__label`、`.tcrn-nav-item`；删除条件：Navigation 家族批次让独立件提供构图一几何。由此独立 TopBar 在知识库样板显示 52（文档作用域例外），在构图三显示 68（包默认）；side-nav 一条例外在文档作用域设了包 SideNav 的底色。20f07a4（SUB-101，R3-10，R3M5 方案 A），P3 交回 | 知识库样板：顶栏 52，侧栏 16 内距与画布色，分组标题与导航项落在 16 引导列，与文档壳侧栏一致 | [ ] | [ ] |
| 3 | 删除例外 EX-INIT015-doc-shell-brand-collapse、-narrow | 连同 C-21 的裁定常量、文案淡出的过渡与动画规则、`tcrn-doc-sidebar-copy-reveal` 关键帧一起删除；收起与极窄态跟随包：文案 max-width 0，由文档盒子裁掉，不再淡出。20f07a4（SUB-101） | 文档壳侧栏收起与极窄视口：品牌文案直接收起，没有淡出动效；收起时 38px 标叠在收起钮上方 | [ ] | [ ] |
| 4 | 文档壳按构图一改（C-21） | 侧栏 220、收起 52、顶栏 52（上下内距 6）、引导列 16、文字列 48、画布色侧栏；品牌格是侧栏顶端 96px 高的一格，侧栏导航从它下面开始。1076172、20f07a4（SUB-101），P3 交回 | 任一文档页：侧栏宽、收起宽与顶栏高与五个样板的包壳一致 | [ ] | [ ] |
| 5 | 文档壳的现状偏差（未授权或门不量，照实列出） | 品牌锁定组合仍为 38 标、文案起点 66（构图一为 22 标、文案起点 48；要缩须给包类写自定义属性，不在授权内）；文档页没有离边 12 的纸面（不在授权内，门也不量）；`page-template.tsx` 未改，品牌留在顶栏首列的 DOM 里，用负外边距成为侧栏顶端；知识库样板顶栏放不下标题加两行描述，描述截成一行加省略号，全文仍在 DOM 里；截成一行的样板顶栏描述没有悬停全文。R3M6，P3 交回 | 文档壳品牌区、文档页主区与知识库样板顶栏：对照构图板判断是否可接受 | [ ] | [ ] |

## 待 Owner 裁定

下列各项已按建议或设计会话裁定先实现，Owner 可以更正；在裁定之前，消费方迁移说明（`docs/migration-4.0.md`）按现状描述。编号 O-n 指 R1 判断 §3.1 的待裁项：O-1…O-4 为设计会话 B 类裁定（2026-10-11），Owner 可更正；O-5…O-12 按 R1 判断「未答复时」的默认执行。没有编号的行沿用 R1、R2 的来源。

| # | 事项 | 现状 | 来源 | 建议 |
| --- | --- | --- | --- | --- |
| 1 | O-1、O-4 · 构图一壳层几何（侧栏 220、收起 52、顶栏 52、纸离边 12）是否算 G+ 底盘、纳入 INIT-015；构图三是否要样板 | R3 已按 O-1 实现：ProductShell 桌面侧栏 220、收起 52、壳顶栏 52、纸面离边 12、圆角 14 加 s1、侧栏画布色无右边线，数值取自 4 个新壳层 token（`--tcrn-shell-sidebar-width`、`--tcrn-shell-sidebar-width-collapsed`、`--tcrn-shell-topbar-height`、`--tcrn-radius-paper`；SUB-090，907de34）；移动块未改，独立 TopBar 仍 68。O-4：DIFF-3 以构图板 220/52 为准；构图三样板已补（`composition-three-sample`，SUB-092），与板的差见第 3 节 | P1；DIFF-1、DIFF-2、DIFF-3；STORY-127 GWT4、STORY-129 GWT3；设计会话裁定（2026-10-11） | 设计会话 B 类裁定（2026-10-11），Owner 可更正。更正（不授权）时撤回 4 个壳层 token 与壳几何，52px 两条判据移到 Navigation 批次（改判据须 Owner 明示），构图三改记页面模板批次 |
| 2 | O-3 · 夜间 TMS 与 Design System 后缀色 | TMS 夜间 #7aa0f5（于 panel 6.86、于 bg 7.30），浅色仍 #2c63c8；Design System 两主题同为 #6577f3；token-contrast 与 axe 的两条 TMS 夜间豁免已撤，字标豁免只余 Design System 浅色两条（SUB-088，52faa47） | P15；`runs/r1/problems/W2-A.md` P9；W3-A 交回；设计会话裁定（2026-10-11） | 设计会话 B 类裁定（2026-10-11），Owner 可更正。更正时撤回夜间值与生成器形状，恢复两条豁免 |
| 3 | O-5 · 外壳主题切换钮与侧栏切换钮尺寸 | 维持：主题钮 36px 胶囊、侧栏钮 38px、移动导航钮 44，与 IconButton md 32 不一致；385ee0a 保持不变待设计；收起 52 的侧栏放得下 38px 钮 | `runs/r1/problems/W3-D.md` P1；W2-D 交回第 2、6 条 | 按默认执行（维持）。Owner 要改时，桌面两枚改 IconButton md 32 加 radius-control，随第二批或另开 |
| 4 | `.tcrn-icon` 基类进包 | 已按 2026-10-11 设计会话裁定进包（f94b1be），文档层副本删除 | `runs/r1/problems/W2-C.md` P6；纪要 D6；STORY-128 | 按现状保留，Owner 可更正 |
| 5 | 产品标六档阶梯与贴片是否进 story | 未进 story | DIFF-8 | 第二批前置板已通过（D5），是否补 story 由 Owner 定 |
| 6 | Text 段落外距 | 生成段写零外距，家族规则恢复原有上外距 | W2-B 交回第 6 条 | 契约本意若为零外距，由设计权威或 Owner 定 |
| 7 | 等宽字族是否加 Noto 中文回退 | R2 已加（返工 R2-1，121-GWT2）：等宽字栈为 IBM Plex Mono、Noto Sans SC、ui-monospace、Menlo、monospace；fonts:proof 要求四个字族 token 都带 Noto 中文回退（e79092f，SUB-048） | W2-A 交回（问题 P6）；P1 交回 | 目视时核对等宽文字里的中文是否为 Noto Sans SC，Owner 可更正 |
| 8 | 字标对比度只按 panel 承载面算是否足够 | 门按契约判定字标对，panel 与 bg 都量 | W3-A 交回（问题 P4） | 目视时判定 |
| 9 | O-11 · 中文子集的「常用 3500 字」 | 按产品用字选上游分片，未加 3500 字表 | P9 | 按默认执行（不加 3500 字），维持分片方案；要 3500 字覆盖须给出字表来源 |
| 10 | O-2 · 锁定组合标语与壳品牌说明（ink-3）的对比度；附 N-1 文档导航分类计数 | 随 O-1 把侧栏改为画布色解决，不另加豁免：ink-3 于 bg 浅色 4.86、夜间 4.89。N-1（文档导航分类计数）R4 浏览器实测（R4 P0 包内构建，Chromium 1440×900，`components-navigation-shells.html` 浅色与 `?theme=dark` 夜间；两种主题各 23 个计数节点读数相同）：`.tcrn-doc-nav__category-count` 的计算字色浅色 #6b675d（rgb(107, 103, 93)）、夜间 #85827a（rgb(133, 130, 122)）；自带底色 color-mix(surface-muted 78%, transparent) 合成到侧栏底色（浅色 #efeeea、夜间 #121210）后为浅色 #f6f5f1、夜间 #1c1c19；对比度浅色 5.17、夜间 4.45，夜间低于 4.5。读法：等字体、两帧与全部过渡结束后读 getComputedStyle；侧栏底色取最近的不透明祖先 `.tcrn-doc-sidebar`；按自带底色的 alpha 0.78 在 sRGB 里合成，不取整；对比度按 WCAG 2 相对亮度算，保留两位小数。R3 集成树上 P4 跑的 internal-alpha browser-proof：axe 违规 0（字标豁免节点 80）；批末复核读数见 `runs/r3/handoff/P4.md` | R1 判断 O-2；B 127「其它发现」；C O-3 标语部分；设计会话裁定（2026-10-11） | 设计会话 B 类裁定（2026-10-11），Owner 可更正。复核若再出现这两类节点，不自行加豁免，由 Owner 在「字标豁免」与「改 ink-2」之间二选一。N-1：待 Owner 二选一，见收口文件 N-1；未答复时保持现状，不加豁免 |
| 11 | O-6 · 组件内字面几何是否补 token（含 RM8 四条） | 不新增 token：按钮内图标 13/15、勾选 16、开关 34×20、末端区 30、贴片圆角 11 等仍为字面值。RM8：typography.scale 余 4 条字面值（numeral-inline 16px、numeral-large 44px 与行高 48px、mono 11.5px）保留，Typography.test 钉住。R3 新增的 4 个壳层 token 属 O-1，不属 O-6 | R1 判断 O-6；B O-6；RM8 | 按默认执行（不新增 token）。要补时在 typography.json 补 4 条刻度 token 并注册，下次契约修订一并补其余字面值 |
| 12 | O-8 · B1 与 B2 品牌规格分歧 | 保持 B1：字标 500 加后缀 600，标 38/28/22；B2 为 sans 整词 600、示意标 44。doc:sample-style 读到壳内字标 12.5px/600，矩阵为 14px/500 | R1 判断 O-8；B O-4；W2-F #13 | 按默认执行（保持 B1）。请 Owner 目视时点名确认 B1 规格（第 6 节品牌、第 10 节产品标） |
| 13 | O-9 · secondary 与 danger 默认 edge 的抬升层是浅墨字面量 | `0 1px 1px rgba(22,21,15,.04)` 两主题共用，夜间几乎不可见；维持画板写法 | R1 判断 O-9；A O-4；W1-A P2；W2-D P9 | 按默认执行（维持）。下次画板修订改为主题化 token |

待 Owner 知悉（不需裁定）：DIFF-7（icon、brand、actions 两块上下叠放，守 story 高度预算）；P18（视觉签名基线整体替换，文档壳视觉标准被标为 Owner 声明，目视另行。R3 批末现状（SUB-046，a54355b）：在 P4 包树（自集成分支 51872c2 切出）上构建一次后跑 browser-proof，非视觉检查全绿（axe 0、story 覆盖、zh-CN 新漏译 0、story 高度、clipped、buttonFeedback、记录容纳 24/24），按当次捕获逐条选择 192 条签名变化（回归 159、新增 33），每条以 accepted-layout-change 接受，理由引纪要 D1、D6 与设计会话 O-1 裁定及对应改动；在该包树上 `--update-visual-baseline` 写入 192 条、拒绝 0，复跑视觉回归 0、新增 0；合入后集成树批末 verify 复读视觉回归 0、新增 0。R3 的逐条记录改名保留为 `docs/verification/internal-alpha/visual-selection-application-r3.json`。192 条里只带底盘与文档壳两类理由的有 10 个 story、29 条，建议优先目视：welcome-governance、governance-boundaries、maintainers-routing、contribution-model、release-bug-policy、grid-system、copy-creation-rules、copy-guidelines、detail-and-inspection-density-spec、local-changelog（名单见 `runs/r3/handoff/P4.md` 第 4 节）。R4 批末现状（SUB-112）：在 R4 P0 包树（自集成分支 ee01f8f 切出）上构建一次后跑 browser-proof，非视觉检查全绿（axe 0、story 覆盖、zh-CN 新漏译 0、已登记译文债 104 不变、story 高度、clipped、buttonFeedback、记录容纳 24/24）；签名变化只有 navigation-focused-shells-spec 的桌面、平板、手机 3 条，按当次捕获以 accepted-layout-change 重收，理由为「R4 SUB-110 在知识库样板加一句可见说明（R3 验收 C3-4，方案 A 的条件）；按当前渲染接受签名，不代表目视通过」；`--update-visual-baseline` 写入 3 条、拒绝 0，不重建复跑视觉回归 0、新增 0；逐条记录在 `docs/verification/internal-alpha/visual-selection-application.json`。accepted-layout-change 只表示按当前渲染接受签名，不代表目视通过）；P24（story 高度与类目数量上限）。

另一项待 Owner 知悉（不需裁定，R2 回写）：第二批以后的家族不在本批授权内，仍读旧的状态底色名。经弃用别名，`--tcrn-color-state-ready-bg`、`--tcrn-color-state-warning-bg`、`--tcrn-color-state-warning-calibrated-bg` 解析为中性的 `--tcrn-color-wash`（`--tcrn-selection-fill` 与 `--tcrn-color-progress-track-calibrated` 同样），`--tcrn-color-state-blocked-bg` 与 `--tcrn-color-state-danger-calibrated-bg` 解析为 `--tcrn-color-bad-bg`。因此这些家族的状态底色改为中性 wash，在各自的家族批次重做之前保持如此。来源：a88b7ad（SUB-001）；`docs/migration-4.0.md` 的「Deprecated token names」表。

## 四个停点

推送 main、打 tag、发版、部署是四个各自独立的 Owner 停点（纪要 D8）。INIT-015 的实施对话不执行其中任何一项；本清单与 CHANGELOG 的 4.0.0 段都不代表其中任何一项已获授权或已经发生。

| 停点 | 现状 |
| --- | --- |
| 推送 main | INIT-015 的提交未推送到 main |
| 打 tag（v4.0.0） | 仓库没有 v4.0.0 tag |
| 发版（npm 发布三包 4.0.0） | 未发布 |
| 部署（4.0.0 的静态文档） | 未部署 |
