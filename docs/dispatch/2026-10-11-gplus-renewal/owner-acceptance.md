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

下列报告与命令在批末由 W8-A 统一重生成，请以重生成后的版本为准。本包（W7-A）没有运行这些门，集成树上的现状见 `runs/r1/handoff/W6-A.md` 与 `runs/r1/problems/`。

| 证据 | 路径或命令 |
| --- | --- |
| 画板逐行映射报告（22 行，八项测量与重叠检查） | `docs/verification/storybook-visual-proof/gplus-map-report.md` 与 `.json`；`node scripts/storybook-visual-proof.mjs --write-report` |
| 几何测量 | `docs/verification/geometry-measure/report.json`；`node scripts/geometry-measure-proof.mjs --write-report` |
| 契约静态门（C2、C5、C6、C7、C8、C11、C13） | `pnpm contract:static`，可加 `--family <家族>`；入仓报告路径由批末用 `--report` 指定 |
| 契约生成物门 | `pnpm contract:proof` |
| 样板与矩阵样式对照 | `pnpm doc:sample-style`，可加 `--story <id>` |
| 文档层类名 | `docs/verification/doc-shell-class/baseline.json`；`pnpm doc-shell:proof` |
| 对比度（C1 阈值与字标豁免） | `pnpm tokens:proof` 内的 token-contrast-proof，只输出到终端 |
| 字体渲染（八条腿） | `pnpm fonts:render`，只输出到终端 |
| 字体文件、许可与覆盖 | `pnpm fonts:proof` |
| 产品标文件 digest | `pnpm brand-asset:proof` |

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

差异：DIFF-3（底盘板 kv 表写「侧栏 212 · 顶栏 48」，构图板写侧栏 220、顶栏 52；待 Owner 裁定）。机器证据：每行的 shadowBlur 与 contrast 测量（映射报告）、对比度、字体渲染。

## 2 · V2-Families · 组件家族清单（本板无目视项）

家族清单与批次顺序是规划板，不是组件规格。第一批 23 件即五个矩阵的名册，其余家族不在本批授权内（storybook-map SCOPE）。机器落点：`docs/contract/families.json`（`scope.batch` 指定第一批五家族）。

## 3 · V2-GPlus-Compositions · 两种页面构图

| story id | Storybook id | 映射行 |
| --- | --- | --- |
| 第 1 节表中的五个样板 | 同上 | compositions.1.typography、.icon、.brand、.actions、.inputs |

| 核对项 | 浅色 | 夜间 |
| --- | --- | --- |
| 构图一：侧栏留在画布上，顶栏与内容合成一张离边 12px 的白纸（D1） | [ ] | [ ] |
| 侧栏宽 220（现由 ProductShell 局部变量 `--tcrn-product-shell-sidebar-width` 设定） | [ ] | [ ] |
| 侧栏引导列：图标左缘 16、文字起点 48（STORY-129 GWT3） | [ ] | [ ] |
| 五个样板里第一批件的用法与对应 B1 板 D 段一致 | [ ] | [ ] |

已知差距：收起宽现为 92（画板 52），顶栏高与纸离边的差值未处理（DIFF-1，P1）；构图三（无侧栏、顶部导航、内容居中 1040）没有 story（DIFF-2，P1）。这几项在「待 Owner 裁定」第 1 条。机器证据：映射报告中五行的 rail 测量。

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
| 链接为强调色加 70% 下划线，悬停 acc-2，焦点为焦点环 | [ ] | [ ] |
| 标题到正文的间距不小于该组件自身行距；分节标题与说明垂直居中对齐（D3） | [ ] | [ ] |
| 账单页样板与画板 D 段一致 | [ ] | [ ] |

差异：DIFF-4（夜间选择器，已裁定）、DIFF-7（待 Owner 知悉）、DIFF-1（样板壳层，待裁）。机器证据：映射报告 typography 三行（clip、singleLine、shadowBlur、mark、overlap、contrast、rail）、`pnpm contract:static --family typography`、`pnpm doc:sample-style --story typography-sample-billing`。

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
| TCRN 为墨色中等字重；TMS 后缀 #2c63c8，Design System 后缀 #6577f3；渐变文字已停用（D2） | [ ] | [ ] |
| Einzbern、Mana Orchestrate 为衬线整名加「by TCRN」，产品壳侧栏里不显示 byline | [ ] | [ ] |
| 标的尺寸分层：ProductLogo 38、ProductLockup 28、产品壳侧栏 22（关于页 56 由消费方覆写） | [ ] | [ ] |
| 产品壳收起时只留标，文案隐藏 | [ ] | [ ] |
| AOS 注册项、AOS 后缀与 TCRN 母标保持原样（D5） | [ ] | [ ] |
| 产品页样板与画板 D 段一致 | [ ] | [ ] |

已知差距：收起宽 92 对画板 52（STORY-127 GWT4，P1）；夜间后缀色与浅色同值（P15）。对比度门对字标登记了 4 条豁免：Design System 浅色于 panel 与 bg、TMS 夜间于 panel 与 bg，引用 D2 与本板 F 段，TMS 两条标「夜间值待 Owner」（`runs/r1/handoff/W3-A.md`）。机器证据：映射报告 brand 三行、`pnpm tokens:proof`、`pnpm brand-asset:proof`。

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
| Select 的 chevron 与 DatePicker 的 calendar 位于末端 30px 内，点在图标上仍打开原生控件 | [ ] | [ ] |
| Checkbox、Radio 16px，勾、半选横杠与单选点；Switch 轨 34×20、钮 16、行程 14，开态钮为 on-acc，夜间为深色钮 | [ ] | [ ] |
| SearchInput 为墨洗工具形态，顶栏与表单内一致：无边 wash，悬停 line-2，焦点纸底加环，占位 ink-2，快捷键 mono 10px（D2） | [ ] | [ ] |
| Field 获焦时不再整块洗底 | [ ] | [ ] |
| 邀请成员样板与画板 D 段一致 | [ ] | [ ] |

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

已知差距：brand-matrix 只有 TCRN 标 22、28、38、56 四档与产品标 38 一档、单色版与锁定块，画板的 128 至 16 六档阶梯与 64、32 两种贴片没有 story（DIFF-8，「待 Owner 裁定」第 5 条）。机器证据：`pnpm brand-asset:proof`（八个文件 digest、包导出与渲染字节）、映射报告 logos 两行。

## 待 Owner 裁定

下列各项已按建议或设计会话裁定先实现，Owner 可以更正；在裁定之前，消费方迁移说明（`docs/migration-4.0.md`）按现状描述。

| # | 事项 | 现状 | 来源 | 建议 |
| --- | --- | --- | --- | --- |
| 1 | 构图一壳层几何（侧栏 220、收起 52、顶栏 52、纸离边 12）是否算 G+ 底盘、纳入 INIT-015；构图三是否要样板 | ProductShell 侧栏 280，经局部变量设 220；收起 92；顶栏与纸离边未改；构图三没有 story | P1；DIFF-1、DIFF-2、DIFF-3；STORY-127 GWT4、STORY-129 GWT3 | 请 Owner 裁定；纳入则另开工单改 ProductShell |
| 2 | 夜间 TMS 与 Design System 后缀色 | 两主题同值 #2c63c8、#6577f3；对比度门登记字标豁免 | P15；`runs/r1/problems/W2-A.md` P9；W3-A 交回 | 夜间改亮色（例如 TMS 用 #7aa0f5）或维持同值，由 Owner 定 |
| 3 | 外壳主题切换钮与侧栏切换钮尺寸 | 主题钮 36px 胶囊、侧栏钮 38px，与 IconButton md 32 不一致；385ee0a 保持不变待设计 | `runs/r1/problems/W3-D.md` P1；W2-D 交回第 2、6 条 | 由 Owner 或设计权威定是否改为 32 |
| 4 | `.tcrn-icon` 基类进包 | 已按 2026-10-11 设计会话裁定进包（f94b1be），文档层副本删除 | `runs/r1/problems/W2-C.md` P6；纪要 D6；STORY-128 | 按现状保留，Owner 可更正 |
| 5 | 产品标六档阶梯与贴片是否进 story | 未进 story | DIFF-8 | 第二批前置板已通过（D5），是否补 story 由 Owner 定 |
| 6 | Text 段落外距 | 生成段写零外距，家族规则恢复原有上外距 | W2-B 交回第 6 条 | 契约本意若为零外距，由设计权威或 Owner 定 |
| 7 | 等宽字族是否加 Noto 中文回退 | 未加 | W2-A 交回（问题 P6） | 目视时判定 |
| 8 | 字标对比度只按 panel 承载面算是否足够 | 门按契约判定字标对，panel 与 bg 都量 | W3-A 交回（问题 P4） | 目视时判定 |
| 9 | 中文子集的「常用 3500 字」 | 按产品用字选上游分片，未加 3500 字表 | P9 | 维持分片方案；要 3500 字覆盖须给出字表来源 |

待 Owner 知悉（不需裁定）：DIFF-7（icon、brand、actions 两块上下叠放，守 story 高度预算）；P18（视觉签名基线整体替换，文档壳视觉标准被标为 Owner 声明，目视另行）；P24（story 高度与类目数量上限）。

## 四个停点

推送 main、打 tag、发版、部署是四个各自独立的 Owner 停点（纪要 D8）。INIT-015 的实施对话不执行其中任何一项；本清单与 CHANGELOG 的 4.0.0 段都不代表其中任何一项已获授权或已经发生。

| 停点 | 现状 |
| --- | --- |
| 推送 main | INIT-015 的提交未推送到 main |
| 打 tag（v4.0.0） | 仓库没有 v4.0.0 tag |
| 发版（npm 发布三包 4.0.0） | 未发布 |
| 部署（4.0.0 的静态文档） | 未部署 |
