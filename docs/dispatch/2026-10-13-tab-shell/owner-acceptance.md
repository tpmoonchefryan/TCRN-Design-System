# 4.0.0 · Owner 目视验收清单（INIT-015 与 INIT-016 两批合一）

本清单供 Owner 对 4.0.0 做目视验收。4.0.0 是一次破坏性发布，由两批合成：第一批 G+ 焕新（TCRN-DS-INIT-015）与第二批顶带壳（TCRN-DS-INIT-016；纪要 TCRN-DS-MIN-20261013-INIT016 D8 ④「4.0.0 在 INIT-016 收口」）。目视验收由 Owner 本人做，不由实施对话、子代理或任何机器门代签；清单里没有任何一项已作结论，每项留空待 Owner 勾选。机器门结果与目视结论分开记：每节的「机器判据已覆盖」只说门查了什么、读数在哪里，不替代目视。

清单按成品画布「TCRN 视觉设计标准」的 8 块板逐板一节，顺序与 `docs/design/visual-standard/canvas.json` 的 order 相同：01 底盘 Token、02 字体、03 图标、04 品牌、05 动作、06 表单控件、07a 壳层（上）、07b 壳层（下）。每节写四件事：看哪些 story、对照哪段板、机器判据已覆盖什么、只能目视的是什么（即核对项）。

第一批清单 `docs/dispatch/2026-10-11-gplus-renewal/owner-acceptance.md` 按草稿画布的 10 块板写，保留原样作历史，不再回写。它的五个家族核对项并入本清单第 2 至 6 节；按 D8 ③ 删去的壳层几何项（构图一壳几何、侧栏引导列、收起态三中线、构图三样板）与其余侧栏项不再出现，逐条见文末「从第一批清单删去的项」。

## 怎么看

- **静态文档（Track B，浏览器门量的就是它）。** 在仓库根执行 `corepack pnpm@10.12.1 run build`（最后一步就是 Storybook 构建），打开 `apps/storybook/storybook-static/` 下的页面：矩阵在 `components-gplus-matrices.html#<story id>`，样板在 `components-gplus-samples.html#<story id>`，壳层 story 在 `components-navigation-shells.html#<story id>`。主题与语言用查询参数切换，例如 `?theme=dark`、`?locale=zh-CN`。每个文档页本身就渲染在包的 `ProductShell` 顶带壳里（顶带、标按钮、完整菜单、头像菜单、纸、纸内目录），所以任一文档页也是壳的目视面。
- **真 Storybook（Track A）。** `corepack pnpm@10.12.1 run storybook:manager-build` 输出到 `apps/storybook/storybook-preview-static`。Track A 不设门。第二轮起静态页在浏览器里挂载四个壳 story 的真件（SUB-151）：登入动画（第 7 节 C 段）每会话首载播放一次，390 宽打开菜单即 Sheet（A8）（已知差距 G-3、G-4 已改，待目视）；在 Track A 上能否看到，本清单没有核实。
- **浅色与夜间。** 矩阵与样板 story 各带浅色块（`data-tcrn-theme="light"`）与夜间块（`data-tcrn-theme="dark"`）；壳层 story 每屏带屏名 `data-shell`，`-l` 结尾为浅色、`-n` 结尾为夜间（如 `ts-closed-l`、`ts-closed-n`）。下文「浅色 / 夜间」两格各看一遍；只有一个主题的项另一格写「—」。
- **对照物。** 8 块板的仓内副本 `docs/design/visual-standard/boards/<板>.dc.html`。本批改过其中 4 块（见「待发布的成品板」），画布发布由设计会话做；发布前以仓内副本为准。截图只做目视，不做像素比对。
- **编号。** DIFF-n 指 `docs/design/gplus-2026-10/storybook-map.md` 的「差异」表；G-n 指本清单「已知差距」表；「问题 Px-n」指 `runs/r1/problems/<包>.md` 第 n 条。

## 机器证据入口

下列回执与报告由第四轮批末的 SUB-224 在同一构建上重生成（第一轮 SUB-140、第二轮 SUB-177、第三轮 SUB-211），读数与退出码见 `runs/r4/handoff/N5.md`；以重生成后的版本为准。第四轮 internal-alpha 浏览器门的非视觉项全过（`nonVisualProofOk` 为真；新截法的自检 154 张高 story 全过），视觉签名按新截法（SUB-217：截图时纸与主区高随内容，整张 story 画出，G-17）整批重收：接受 169 条回归（新增 0），按来源分，截法变更 144 条、截法变更加 R4-6（展开标题去左边条，SUB-218）8 条、只有 R4-6 17 条；R4-3（Disclosure 描边，SUB-216）在签名上低于容差，只在该 story 三条注明；R4-1（data-logo）与 R4-7（文档层死类、AOS 实例无人读字段）没有可见变化；分不进来源或预期外的 0 条。来源按与第四轮 N2 终版（只含截法变更）同键读数分开。基线仍为 217 条：应用后 217 条全部在容差内，所收 169 条距离为 0。逐条来源与理由在 `docs/verification/internal-alpha/visual-baseline-selection-r4.json`，应用记录在 `visual-selection-application.json`（第三轮的记录改名为 `visual-selection-application-init016-r3.json`；`visual-selection-application-r3.json` 与 `-r4.json` 是第一批 INIT-015 第三、四轮的记录）。接受签名不代表目视通过：maxCell > 40 的 52 条（A 类 12 条）列在「第四轮新增与变化的目视项」。本清单只写文档，清单里的读数取自这些报告与各包交回。

| 证据 | 路径或命令 |
| --- | --- |
| 画板逐行映射报告（23 行；八项测量、shellFrame 与重叠检查） | `docs/verification/storybook-visual-proof/gplus-map-report.md` 与 `.json`；`node scripts/storybook-visual-proof.mjs --write-report` |
| 几何测量（含 shellFrame：顶带 52、纸离壳边 12、纸圆角 14） | `docs/verification/geometry-measure/report.json`；`node scripts/geometry-measure-proof.mjs --write-report` |
| 壳层 18 门（两块成品壳层板夹具与真件 story） | `docs/verification/shell-measure/report.json`；`node scripts/shell-measure-proof.mjs --write-report`（夹具：`--fixtures`） |
| internal-alpha 回执（axe、story 覆盖、高度预算、视觉签名） | `docs/verification/internal-alpha/` 下各 json；视觉签名重收的选择文件 `visual-baseline-selection-r4.json`（逐条来源与理由；第三轮为 `-r3`），应用记录 `visual-selection-application.json` |
| 契约静态门、契约生成物门 | `corepack pnpm@10.12.1 run contract:static`（可加 `--family <家族>`）；`corepack pnpm@10.12.1 run contract:proof` |
| 样板与矩阵样式对照 | `corepack pnpm@10.12.1 run doc:sample-style`，可加 `--story <id>` |
| 文档层类名 | `corepack pnpm@10.12.1 run doc-shell:proof` |
| 壳与文档壳对照 | `corepack pnpm@10.12.1 run shell:parity` |
| 对比度（C1 阈值与字标豁免） | `corepack pnpm@10.12.1 run tokens:proof` 内的 token-contrast-proof，只输出到终端 |
| 字体文件与渲染 | `corepack pnpm@10.12.1 run fonts:proof`；`corepack pnpm@10.12.1 run fonts:render`（终端） |
| 产品标文件 digest | `corepack pnpm@10.12.1 run brand-asset:proof` |

## 1 · 01 底盘 Token（`Tokens.dc.html`）

对照：A 色彩、线、面与状态底；B 对比度；C 固定值。

看哪些 story：本板没有独立 story。底盘值落在 token（`docs/design/gplus-2026-10/contract/tokens.json` 生成进 `@tcrn/ui-tokens`），五个矩阵、六个样板与壳层 story 都在消费；建议看 `typography-sample-billing` 与 `shell-top-band` 两处，浅色、夜间各一遍。

机器判据已覆盖：token 值对契约（`contract:proof`，生成物头的 contract-sha256）；文字与非文字对比度按 C1 阈值（`tokens:proof`）；映射报告每行的 shadowBlur 与 contrast；四个字族 token 的 Noto 中文回退（`fonts:proof`）与渲染（`fonts:render`）。

| 核对项（只能目视） | 浅色 | 夜间 |
| --- | --- | --- |
| 画布、纸、面板、线、三档墨、强调色的整体观感与 A 段一致（2026-10-11 纪要 D1） | [ ] | [ ] |
| 控件轮廓是 line-ctl（浅 rgba(22,21,15,.47)，夜 rgba(255,255,255,.36)），不是 7% 发丝线（D2） | [ ] | [ ] |
| 阴影紧贴、模糊小（≤ 3px） | [ ] | [ ] |
| 焦点环是 2px 承载面间隙加 2px 强调色 | [ ] | [ ] |
| 字体：界面 Hanken Grotesk 与 Noto Sans SC，标题与数字 Source Serif 4 与 Noto Serif SC，等宽 IBM Plex Mono；中文没有回落到系统字（D4） | [ ] | [ ] |
| A 段 chrome 一行写「滚动时顶带（玻璃）」：顶带壳里页面在纸内滚动，顶带下没有内容经过，而「无内容可透的玻璃壳层」在禁用清单里。请判断这一行在顶带壳里是否还适用 | [ ] | [ ] |

## 2 · 02 字体 Typography（`Typography.dc.html`）

对照：A 组件与样式、B 状态矩阵（44 格）、D 组合样板 · 顶带壳（账单页，`ty-l`、`ty-n` 两屏）。C 动效规范、E 消费方须提供什么、F token 差异、G 许可与分发四段没有 story，以画板副本与契约文件为准。

| story id | 页面 | 映射行 |
| --- | --- | --- |
| `typography-matrix` | `components-gplus-matrices.html#typography-matrix` | typography.A、typography.B |
| `typography-sample-billing` | `components-gplus-samples.html#typography-sample-billing` | typography.D、compositions.1.typography |

机器判据已覆盖：映射报告 typography 三行（clip、singleLine、shadowBlur、mark、overlap、contrast；样板行 shellFrame、rowAlign）；`contract:static --family typography`；`doc:sample-style --story typography-sample-billing`；几何测量的样板 shellFrame。

| 核对项（只能目视） | 浅色 | 夜间 |
| --- | --- | --- |
| 标题 1 至 4 级为衬线，字号行高按契约（page 36/40、heading-2 26/30、heading-3 与 section 20/26），单行，溢出出省略号，悬停可见全文 | [ ] | [ ] |
| Text 默认 13/20 次墨；reading 14/22、meta 12/16、caption 11/16；strong 为主墨 600 | [ ] | [ ] |
| numeral「4,280.00」为衬线 300、等宽数字，单位在 small 里；caps 为间距大写，编号在 b 里，单行省略 | [ ] | [ ] |
| Highlight 的 mark 只加底色，不改字重、字距、字号、内距（D3） | [ ] | [ ] |
| 链接为强调色加 70% 下划线，悬停 acc-2，焦点为焦点环；quiet 链接为当前文字色、下划线透明，悬停 acc-2 | [ ] | [ ] |
| 标题到正文的间距不小于该组件自身行距；分节标题与说明垂直居中对齐（D3） | [ ] | [ ] |
| 账单页样板换成顶带壳后与 D 段两屏一致：顶带、标按钮、固定项、右上簇，纸内首行是页头与面包屑，其后是账单内容 | [ ] | [ ] |

## 3 · 03 图标 Icon（`Icon.dc.html`）

对照：A 名册与状态（本批加 pin 两行）、B 状态矩阵（28 格）、D 组合样板 · 顶带壳（项目列表，`ic-l`、`ic-n`）。C、E、F 三段没有 story。

| story id | 页面 | 映射行 |
| --- | --- | --- |
| `icon-matrix` | `components-gplus-matrices.html#icon-matrix` | icon.A、icon.B |
| `icon-sample-project` | `components-gplus-samples.html#icon-sample-project` | icon.D、compositions.1.icon |
| `shell-top-band`（屏 `ts-x-l`、`ts-x-n`） | `components-navigation-shells.html#shell-top-band` | 完整菜单行与分组标题上的图钉 |

机器判据已覆盖：图标路径对契约、名册 38 件同名（`contract:proof`）；`contract:static --family icon`；映射报告 icon 三行；几何测量里 16px 图标的 1.25 描边。

| 核对项（只能目视） | 浅色 | 夜间 |
| --- | --- | --- |
| 名册 38 件齐全：第一批 37 件（含 plus、minus、users、bell、copy、trash、calendar、more-horizontal、chevron-up 九件新增）加 pin；20 格网格（D2；MIN-20261013-SHELL D6） | [ ] | [ ] |
| pin 两态：未固定为描边，已固定为实心（由 CSS 填第一个形）；完整菜单的行与分组标题右端是 24 槽的图钉钮，与 A 段 pin 两行一致 | [ ] | [ ] |
| 16px 下描边 1.25，sm、md、lg（14、16、20）三档描边粗细相同 | [ ] | [ ] |
| 图标跟随所在文字的颜色，状态格换色与宿主一致 | [ ] | [ ] |
| 复制按钮四个结果态图标（copy、check、alert-triangle、info） | [ ] | [ ] |
| loader-circle 转动、减少动态效果时停止（静态文档不播放动效，需在 Track A 看） | [ ] | [ ] |
| 项目列表样板换成顶带壳后与 D 段两屏一致 | [ ] | [ ] |

## 4 · 04 品牌 Brand · 产品标（`Brand.dc.html`）

对照：A–E 四枚标（大图、尺寸阶梯、贴片、单色版、锁定块）、F 构法、G 颜色、H SVG 源、I 标语。本板没有 D 段（拆分问题 4）：品牌在壳里的样子由 07a 第 1 段「标三版」表达，产品页样板映射到那里（第 7 节）。

| story id | 页面 | 映射行 |
| --- | --- | --- |
| `brand-matrix` | `components-gplus-matrices.html#brand-matrix` | brand.A、brand.B（10 格）、logos.A-E、logos.I |
| `brand-sample-product` | `components-gplus-samples.html#brand-sample-product` | brand.D、compositions.1.brand（07a 第 1 段） |

机器判据已覆盖：八个产品标文件的 digest、包导出与渲染字节（`brand-asset:proof`）；字标对比度与豁免（`tokens:proof`：豁免 4 条，浅色 Design System 两条、夜间 TMS 两条标 pending）；映射报告 brand 与 logos 各行。

| 核对项（只能目视） | 浅色 | 夜间 |
| --- | --- | --- |
| TMS 为双臂高举的艺人；Einzbern 为接住一点光的盃；Mana Orchestrate 为两结点一道流；Design System 为四色版面；实心几何、两色平涂、48 格（2026-10-11 纪要 D5） | [ ] | [ ] |
| 字标：TCRN 为墨色；TMS 后缀 #2c63c8 两个主题同色（MIN-20261013-SHELL D2），Design System 后缀 #6577f3；渐变文字已停用。夜间 TMS 后缀低于 4.5 是已知待裁（G-1） | [ ] | [ ] |
| Einzbern、Mana Orchestrate 为衬线整名加「by TCRN」 | [ ] | [ ] |
| 单色版跟随文字色；壳里只用彩色标，不用单色版、不用半透明（D2） | [ ] | [ ] |
| ProductLogo 四个产品与 ProductLockup 的锁定块 | [ ] | [ ] |
| 标语（I 段）：TMS「艺人管理系统」、Einzbern「项目记忆引擎」、Mana Orchestrate「项目记忆助手」、Design System「设计系统」，其余四语与契约一致 | [ ] | [ ] |
| AOS 注册项、AOS 后缀与 TCRN 母标保持原样；AOS 在通过稿里没有标，顶带画不出 AOS 的标按钮（G-2） | [ ] | [ ] |
| 产品页样板换成顶带壳后与 07a 第 1 段一致；表格去掉了资产 ID 列（DIFF-9，待 Owner 知悉） | [ ] | [ ] |

已知差距：`ProductLockup` 的首行变体（`firstLine="rail" | "lockup"`，第二版）没有 story 渲染，只有单元测试与品牌门；标按钮用同一套首行 DOM 自行实现（跨包约定 C-6），目视只能在标按钮上看（第 7 节）。brand-matrix 没有六档尺寸阶梯与贴片（DIFF-8，待 Owner 知悉）。

## 5 · 05 动作 Actions（`Actions.dc.html`）

对照：A 组件与状态、B 状态矩阵（116 格）、D 组合样板 · 顶带壳（名册页，`ac-l`、`ac-n`；本批由项目页改为名册页，story id 不变）。C、E、F 三段没有 story。

| story id | 页面 | 映射行 |
| --- | --- | --- |
| `actions-matrix` | `components-gplus-matrices.html#actions-matrix` | actions.A、actions.B |
| `actions-sample-project` | `components-gplus-samples.html#actions-sample-project` | actions.D、compositions.1.actions |

机器判据已覆盖：映射报告 actions 三行（含 controlHeight、rowAlign）；`contract:static --family actions`；几何测量的 ButtonGroup 焦点环探针。

| 核对项（只能目视） | 浅色 | 夜间 |
| --- | --- | --- |
| Button 四个变体（primary、secondary、quiet、danger）逐态与 B 段一致（默认、悬停、按下、焦点、禁用、加载、选中） | [ ] | [ ] |
| 三档 28、32、40，内距 10、12、16，字号 12、13、14；IconButton 为正方形，图标 14、16、20 | [ ] | [ ] |
| 按下只换填充，不缩放、不位移 | [ ] | [ ] |
| ButtonGroup 共用一条轮廓、成员间 1px 分隔，quiet 组没有轮廓；获焦成员的焦点环完整，不被邻居遮住 | [ ] | [ ] |
| 加载态显示 loader，忙碌文案随 story 语言 | [ ] | [ ] |
| 复制按钮结果态只换墨色：copied 为 ok、failed 为 bad、unsupported 为 ink-3 | [ ] | [ ] |
| 带禁用原因的按钮悬停提示为「标签 — 原因」；被截断的按钮标签悬停可读全文 | [ ] | [ ] |
| 头像菜单里的主题切换钮随 Actions 状态对换色，按下不缩放；浅色块显示太阳、夜间块显示月亮 | [ ] | [ ] |
| 名册页样板与 D 段两屏一致；第二行人名换成 김하늘（DIFF-11，待 Owner 知悉） | [ ] | [ ] |

## 6 · 06 表单控件 Inputs（`Inputs.dc.html`）

对照：A 组件与状态、B 状态矩阵（42 格）、D 组合样板 · 顶带壳（邀请成员，`in-l`、`in-n`）。C、E、F 三段没有 story。

| story id | 页面 | 映射行 |
| --- | --- | --- |
| `inputs-matrix` | `components-gplus-matrices.html#inputs-matrix` | inputs.A、inputs.B |
| `inputs-sample-members` | `components-gplus-samples.html#inputs-sample-members` | inputs.D、compositions.1.inputs |

机器判据已覆盖：映射报告 inputs 三行（含 controlHeight，开关钮格的 before-bg 探针，DIFF-6）；`contract:static --family inputs`；几何测量的 DatePicker 末端命中探针。

| 核对项（只能目视） | 浅色 | 夜间 |
| --- | --- | --- |
| 文本类控件：默认边 line-ctl，悬停 ink-2，焦点为强调色环；invalid 为红边，invalid 加焦点为红边加红环 | [ ] | [ ] |
| 控件高 32、圆角 8、字号 13，占位为 ink-3 | [ ] | [ ] |
| Select 的 chevron 与 DatePicker 的 calendar 位于末端 30px 内，点在图标上仍打开原生控件；MultiSelect 触发器末端同为 30px | [ ] | [ ] |
| Checkbox、Radio 16px，勾、半选横杠与单选点；Switch 轨 34×20、钮 16、行程 14，开态钮为 on-acc，夜间为深色钮 | [ ] | [ ] |
| SearchInput 为墨洗工具形态：无边 wash，悬停 line-2，焦点纸底加环，占位 ink-2，快捷键 mono 10px 且为 ink-2（板上 ink-3，按 C1 改，第一批按建议先做） | [ ] | [ ] |
| 只读框获焦显示焦点环，底与字色仍为只读态（与板上状态顺序不同，第一批按建议先做） | [ ] | [ ] |
| Field 获焦时不整块洗底；错误态不整块洗底，错误文字为 bad 色（第一批按建议先做） | [ ] | [ ] |
| inputs 矩阵里 MultiSelect 的静态展开态：列表紧贴触发器正下方、同宽、四个选项各占一行 | [ ] | [ ] |
| 邀请成员样板换成顶带壳后与 D 段两屏一致 | [ ] | [ ] |

## 7 · 07a 壳层（上）· 标三版、三态、矩阵、动效（`Shell.dc.html`）

对照：第 1 段「标三版」；A 段三态 A1–A8（A1、A2 顶带态，A3、A4 完整菜单，A5、A6 固定二级菜单下拉含第三级级联，A7、A8 手机 390 顶带态与 Sheet）；B 段状态矩阵（66 格）；C 段登入动画。本板是字节真值（跨包约定 C-16），本批没有改。

| story id | 屏名与板上对应 | 页面 |
| --- | --- | --- |
| `shell-top-band` | `ts-closed-l` / `ts-closed-n` = A1 / A2；`ts-x-l` / `ts-x-n` = A3 / A4；`ts-drop-l` / `ts-drop-n` = A5 / A6 | `components-navigation-shells.html#shell-top-band` |
| `shell-narrow` | `ts-narrow-l`（1023 宽，固定项收进菜单）、`ts-narrow-x-l`（同宽菜单打开）；板上没有单独一屏，规则见 A 段字幕「窄于 1024 整组收进菜单」 | `components-navigation-shells.html#shell-narrow` |
| `shell-mobile` | `ts-m-l` = A7；`ts-m-s` = A8 | `components-navigation-shells.html#shell-mobile` |
| `shell-matrix` | B 段 66 格（先浅色后夜间） | `components-navigation-shells.html#shell-matrix` |
| `shell-intro` | `ts-intro-l` = C 段 | `components-navigation-shells.html#shell-intro` |
| `brand-sample-product` | 第 1 段第二版在顶带里的样子 | `components-gplus-samples.html#brand-sample-product` |

机器判据（第四轮批末读数，SUB-224 在同一构建上重生成，与第三轮相同；`docs/verification/shell-measure/report.json`）：壳层 18 门（`shell-measure-proof`；两块成品板夹具在板原宽 1240 量，真件 story 在 1440×900 与 390×844、en 与 zh-CN 量）。夹具全过（`--fixtures` 退出 0）；真件 17 门过、1 门红——markText（O-4 待裁，门照 ±1 判：品牌首行 DS `lkr-line@22` 读 1.4，en 与 zh-CN 相同；完整菜单与矩阵底栏的 TMS 锁定块 `lkr@22` en 读 1.7），第二轮红的 brandDigest、pinJitter、contrast、singleLine 第三、四轮都过；四项检查（prail、页内面包屑、设置页布局、分栏）都过；B 段 66 格见 G-5（60 格按 data-expect 判、全过，6 格只列读数）；行为探针（焦点回路、方向键级联、Esc 与点外部、登入动画轨迹）en 与 zh-CN 都过，触摸门过；story 变异 22 条全部判红。品牌资产 digest（`brand-asset:proof`）不在 SUB-224 的局部门里，由批末 verify 跑。门红的项与门量不到的项都只能靠目视。第五轮只改可折叠区内层的裁切余量，其余同第四轮批末。

| 核对项（只能目视） | 浅色 | 夜间 |
| --- | --- | --- |
| 第 1 段标三版：第一版纯标（手机顶带与最窄处）、第二版锁定块首行与标垂直居中（顶带标按钮）、第三版锁定块原样（登入卡）；全部取自 Brand 板，不重绘、不重排 | [ ] | [ ] |
| 顶带无底无线，在画布色上；标按钮 134 × 40 在 (12, 6)，空闲态彩色标 100%，悬停与打开为 3.5% 墨洗，示意朝上朝下随开合；标旁字标墨迹中线与标中线对齐（±1），不做视觉重心下移 | [ ] | [ ] |
| 固定项 32 高，与标按钮隐形边界及彼此间距都是 8，三处读数相等，没有分割线；选中只做 6% 墨洗加字重，没有左边条 | [ ] | [ ] |
| 右上簇铃铛 32、头像 28，右缘等于纸右缘；纸离边 12、顶 52、圆角 14、s1 阴影 | [ ] | [ ] |
| 完整菜单（A3、A4）：顶 52、左 12、宽 952、搜索 40、三列、行 32；底栏的当前位置与锁定块只作装饰，没有收起钮；选中行 6% 墨洗加字重 | [ ] | [ ] |
| 固定二级菜单下拉（A5、A6）：接在项下 6、宽 240、内距 6、顶部搜索 28、行 32 无图标列；第三、四级向右 4、同宽、高随左列，按点击展开 | [ ] | [ ] |
| 浮层收起：点外部、Esc、选中即收，焦点回到触发键；图钉不收起菜单 | [ ] | [ ] |
| 窄屏（`shell-narrow`）：固定项整组收进菜单，标按钮收成纯标加示意 | [ ] | — |
| 手机（A7、A8）：顶带纯标加示意；Sheet 固定项在前、全部在后，行与搜索 44（页面挂载后 390 宽打开即 Sheet，壳根 `data-state="sheet"`；G-3 已改，待目视） | [ ] | — |
| B 段矩阵：每格 fill 与 ink 成对，与板上数字一致；铃铛悬停为 6% 墨洗，已按板改，待目视（G-6） | [ ] | [ ] |
| C 段登入动画：登入卡第三版（标 128）收敛为顶带第二版（标 22），120 淡出、240 位移、100 纸升起，上限 700，只用 transform 与 opacity，每会话一次，减少动态效果时不播（页面挂载后每会话首载播放一次，同页再载不播；G-4 已改，待目视） | [ ] | — |
| 标按钮字标后缀没有被裁掉（第二轮按 SUB-143 改了字标列取宽与后缀纵向余量，样板 clip 本轮不红；G-7 已改，待目视）；长字标在 134 宽里截断并带 title，TMS 完整（G-10）；夜间 TMS 后缀在悬停底上读 3.07（G-11） | [ ] | [ ] |
| 文档页本身的顶带壳：完整菜单的分组与行、头像菜单里的产品切换、主题与语言，纸内目录（zh-CN 下 Change Log 的译名与菜单行说明见 G-8、G-9） | [ ] | [ ] |
| 固定项拖排（1024 及更宽的顶带）：拖动固定项就地换位，没有插入线、拖影、把手，拖动中光标为 grabbing；松手不打开下拉、不跳链接；Alt+← / Alt+→ 移动获焦项，焦点环跟着该项（G-12，待目视） | [ ] | — |

## 8 · 07b 壳层（下）· 几何、契约、token、门（`Shell-2.dc.html`）

对照：D 几何（真实屏幕加标尺，表为关系断言）、E 消费方契约、F 与 G+ 底盘的 token 差异、G 门。本板是字节真值，本批没有改。

看哪些 story：D 段的几何在第 7 节的 `shell-top-band`、`shell-mobile` 上看；E、F、G 三段没有渲染面，落点分别是 `docs/migration-4.0.md` M20 至 M53（消费方要做什么；⌘K 见 M41、M52）、`packages/ui-tokens/src/tokens.css` 的壳层与登入动画 token（值见 M24）、`scripts/shell-measure-proof.mjs` 的 18 门与 `tests/fixtures/geometry-measure/shell/mutations.json` 的变异。

机器判据（第四轮批末读数，SUB-224，与第三轮相同；`docs/verification/shell-measure/report.json`）：D 段 12 行关系断言（引导列、文字起点、右缘、行中线 26、三处间距相等、接续 6、级联同宽同高等）由壳层门逐行量，夹具量成品板、story 量真件；本轮 12 行中 11 行过，标按钮（v2）1 行红，与 markText 同根（O-4）。引导列由 prail 检查量（菜单内图标 16、文字 48；第三轮菜单与 Sheet 行的图标盒照板画成 22 带 3 内距，字形仍 16，SUB-188），本轮真件过。G 段每门一条会红的变异（`--fixtures` 与 storyMutations；本轮 story 变异 22 条全部判红，story-label-plus-40 改在菜单夹具上关截断后加 40 字，M1）。F 段的 20 个新 token 与 3 个弃用 token 由 `@tcrn/ui-tokens` 的测试钉住值与弃用登记；第二、三轮另加的六条壳层 token 不在 F 段（见「待发布的成品板」）。第五轮只改可折叠区内层的裁切余量，其余同第四轮批末。

| 核对项（只能目视） | 浅色 | 夜间 |
| --- | --- | --- |
| D 段标尺读数与 `shell-top-band` 各屏一致：顶带 52、标按钮 134 × 40 在 (12, 6)、固定项 32、间距 8、行中线 26、纸离边 12；量过的数以壳层门报告为准，目视只看有没有明显偏差 | [ ] | [ ] |
| E 段消费方契约读起来与 `docs/migration-4.0.md` M20 至 M53 的做法一致（菜单模型四级、`pageHeader` 必填、固定项偏好由产品后端保存、⌘K 每个壳一次，见 M41、M52） | — | — |
| F 段 token 差异表与 4.0.0 的 token 一致：新增 20 个（16 个壳层尺寸、4 个登入动画时长），`--tcrn-shell-topbar-height` 为指向顶带高的弃用别名，两个侧栏宽弃用、没有替代，小面板宽撤销、不新增；第二轮新增的 `--tcrn-shell-mark` 22、`--tcrn-shell-touch` 44、`--tcrn-shell-crumb-icon` 11 与第三轮新增的 `--tcrn-shell-chevron` 12、`--tcrn-shell-locale-chevron` 11、`--tcrn-shell-mark-lg` 44 还没进 F 段，对照时这六条不算差异 | — | — |
| G 段门表与本批实际接入的门一致（`geometry:measure` 串入壳层 18 门，CI 经 `pnpm verify` 跑到） | — | — |

## 第三轮新增与变化的目视项

各包交回的「目视项」与本轮改过渲染的页（`runs/r3/handoff/M3.md` 第 7 节、`M4.md` 第 7 节、`M5.md` 第 5 节、`M6.md` 交回物节、`M7.md` 第 7 节、`M9.md` 第 8、10 节；M1、M2、M8、M10 无），以及视觉签名重收的离群项。页面同「怎么看」。

| 核对项（只能目视） | 看哪里 | 浅色 | 夜间 | 来源 |
| --- | --- | --- | --- | --- |
| 纸内焦点环：键盘 Tab 进入纸内滚动区，环整圈落在纸里并跟着纸的圆角；内容滚到上下边时，环在内收阴影上方。文档壳的纸内可以滚动，获焦时底边被伸到纸边的 story 卡片盖住，滚到底后换成顶边被盖（内收阴影画在内容之下；R3 判断 §3.2，请 Owner 目视时定是否接受） | 任一文档页的纸；`shell-top-band` 各屏 | [ ] | [ ] | SUB-182（M3） |
| 头像获焦：环下保留 1px 内细线 | 文档页与 `shell-top-band` 的头像 | [ ] | [ ] | SUB-182（M3） |
| 不可用导航项：原因在标签下一行；标签过长以省略号结尾，悬停显示 title | `navigation-primitives-spec` 样本块的 NavGroup「Navigation rows」（禁用的 Release notes），在 1440、1024、390 三宽看排布 | [ ] | [ ] | SUB-192（M3）、SUB-208（M9） |
| ⌘K 只开一个壳：文档页上按一次只开文档壳；壳 story 屏默认不注册 ⌘K | 任一文档页 | [ ] | — | SUB-185（M4）、SUB-179（M7） |
| 文档壳在 760 及更窄打开的是 Sheet（390、760 为 Sheet，761、1440 为面板） | 任一文档页，调窗口宽 | [ ] | [ ] | SUB-201（M7） |
| zh-CN 品牌首行：DS 首行读「TCRN Design System」，与 en 相同 | `components-navigation-shells.html?locale=zh-CN#shell-brand-first-line` | [ ] | [ ] | SUB-195（M5） |
| 拖排与产品切换：「Closed band」屏拖一个钉钮或在钉钮上按 Alt+← / Alt+→，刷新后顺序保留；点头像，产品清单当前项为 TCRN TMS。板上「第三个钉钮在指针下」的画面跟着 Statements 走，不跟位置走（G-19） | `shell-top-band` 的 `ts-closed-l` | [ ] | — | SUB-186（M5） |
| 样板壳高 640，与画框底差 0 | `components-gplus-samples.html` 各样板 | [ ] | [ ] | SUB-205（M6） |
| AOS frontend shell 实例：页面在 content stack 里，块间距变大；第 4 个夹具为「Desktop light, Work route」 | `frontend-shell-slice` | [ ] | — | SUB-199、SUB-200（M6）、SUB-208（M9） |
| AOS owner-quality 实例：只剩 6 个框；两个 search-results 变体显示打开的完整菜单与 1 条结果；工作队列标题下多一行计数 | `owner-quality-product-shell` | [ ] | — | SUB-200（M6）、SUB-208（M9） |
| 色板：品牌色板 5 个色样（G+ 名），色角色矩阵 6 个，中性校准段已删 | `color-palette` | [ ] | [ ] | SUB-208（M9） |
| 文档壳控制表、预实施规则表、导航策略表的新句（五语）；网格页「Documentation page」一行、聚焦壳页书签一句改为顶带壳说法 | `i18n-theme-contract`、`foundation-visual-standards`、`navigation-shell-spec`、`grid-system`、`navigation-focused-shells-spec` | [ ] | [ ] | SUB-208（M9） |
| 登入动画 story 读回每会话一次的说明句 | `shell-intro` | [ ] | — | SUB-187（M9） |
| demos 的页内页头改为 h2：字型不变，预计无可见变化 | 文档页里的 demos | [ ] | [ ] | M4 交回第 7 节 |

视觉签名离群项（A 类，maxCell > 40；逐条理由在 `visual-baseline-selection-r3.json` 的 `outlierReason`，截图由 `internal-alpha:browser-proof` 写到 `docs/verification/internal-alpha/screenshots/<视口>-<story>.png`，不入仓）。签名已按当前渲染接受，是否只来自换壳只能目视确认（签名已由第四轮按新截法整批重收，表中是第三轮读数，Disclosure 的现状见 G-18）：

| story @ 视口 | 签名距离（mean / maxCell） | 请看 | 目视 |
| --- | --- | --- | --- |
| `brand-identity@desktop-1440x900` | 3.695 / 45 | 品牌页的标与锁定块完整、未被顶带遮挡，排布与 Brand 板一致 | [ ] |
| `i18n-theme-contract@desktop-1440x900` | 24.945 / 171 | 夜间预览块与文档壳控制契约表在三视口完整、未被顶带遮挡 | [ ] |
| `interaction-disclosure-spec@desktop-1440x900` | 4.848 / 74 | Tooltip 预览压住按钮与表头是预览本意；Disclosure 展开区里「Focusable only while expanded」按钮下缘贴着区域底边、底框线不可见（平板截图），请看是否被裁切 | [ ] |
| `frontend-shell-slice@desktop-1440x900` | 50.898 / 217 | AOS frontend shell 实例：顶带壳、content stack 块间距、第 4 个夹具「Desktop light, Work route」 | [ ] |
| `owner-quality-product-shell@desktop-1440x900` | 59.594 / 214 | owner-quality 实例：只剩 6 个框，两个 search-results 变体显示打开的完整菜单与 1 条结果，工作队列标题下的计数行 | [ ] |
| `brand-identity@tablet-1024x768` | 7.082 / 61 | 品牌页的标与锁定块完整、未被顶带遮挡，排布与 Brand 板一致 | [ ] |
| `i18n-theme-contract@tablet-1024x768` | 27.676 / 184 | 夜间预览块与文档壳控制契约表在三视口完整、未被顶带遮挡 | [ ] |
| `interaction-disclosure-spec@tablet-1024x768` | 8.43 / 120 | Tooltip 预览压住按钮与表头是预览本意；Disclosure 展开区里「Focusable only while expanded」按钮下缘贴着区域底边、底框线不可见（平板截图），请看是否被裁切 | [ ] |
| `button-spec-usage@tablet-1024x768` | 6.531 / 67 | 按钮各变体完整、成行，没有被截断 | [ ] |
| `datagrid-fields-patterns@tablet-1024x768` | 4.023 / 42 | 数据表与字段区完整，上沿没有被顶带遮挡 | [ ] |
| `readiness-notification-patterns@tablet-1024x768` | 3.984 / 58 | 通知与就绪状态块完整 | [ ] |
| `modal-validation-patterns@tablet-1024x768` | 3.641 / 47 | 对话框校验样例完整 | [ ] |
| `overlay-focus@tablet-1024x768` | 4.414 / 51 | 浮层焦点样例完整，焦点环可见 | [ ] |
| `frontend-shell-slice@tablet-1024x768` | 45.367 / 215 | AOS frontend shell 实例：顶带壳、content stack 块间距、第 4 个夹具「Desktop light, Work route」 | [ ] |
| `owner-quality-product-shell@tablet-1024x768` | 46.742 / 213 | owner-quality 实例：只剩 6 个框，两个 search-results 变体显示打开的完整菜单与 1 条结果，工作队列标题下的计数行 | [ ] |
| `tokens-copy-state@mobile-390x844` | 7.293 / 42 | 手机宽下 token 与文案状态表完整 | [ ] |
| `i18n-theme-contract@mobile-390x844` | 19.848 / 208 | 夜间预览块与文档壳控制契约表在三视口完整、未被顶带遮挡 | [ ] |
| `interaction-disclosure-spec@mobile-390x844` | 10.195 / 61 | Tooltip 预览压住按钮与表头是预览本意；Disclosure 展开区里「Focusable only while expanded」按钮下缘贴着区域底边、底框线不可见（平板截图），请看是否被裁切 | [ ] |
| `button-spec-usage@mobile-390x844` | 8.082 / 68 | 按钮各变体完整、成行，没有被截断 | [ ] |
| `navigation-dense-operations-shell-spec@mobile-390x844` | 8.168 / 41 | 手机宽下密集运营壳说明完整，顶带不遮挡正文起点 | [ ] |
| `navigation-product-shell-spec@mobile-390x844` | 7.777 / 49 | 同上 | [ ] |
| `records-and-boards-components-spec@mobile-390x844` | 10.215 / 46 | 手机宽下记录与看板件完整 | [ ] |
| `frontend-shell-slice@mobile-390x844` | 41.441 / 203 | AOS frontend shell 实例：顶带壳、content stack 块间距、第 4 个夹具「Desktop light, Work route」 | [ ] |
| `owner-quality-product-shell@mobile-390x844` | 54.629 / 207 | owner-quality 实例：只剩 6 个框，两个 search-results 变体显示打开的完整菜单与 1 条结果，工作队列标题下的计数行 | [ ] |

## 第四轮新增与变化的目视项

各包交回的「目视项」（`runs/r4/handoff/N1.md` 第 7 节、`N3.md` 第 5 节；N2、N4 无），以及视觉签名按新截法重收后的离群项。页面同「怎么看」。

| 核对项（只能目视） | 看哪里 | 浅色 | 夜间 | 来源 |
| --- | --- | --- | --- | --- |
| Disclosure 描边：展开面板里次级按钮「Focusable only while expanded」的底边与起始边描边画出，不再贴着区域底边被裁；第四轮发现的获焦焦点环底边与起始边少外侧 2px（N1 问题 2）已由第五轮处置（余量 space-1，见 G-18 与第五轮节）；Safari 下请同看一遍（`overflow-clip-margin` 在 WebKit 上是否生效未核实，N1 问题 3） | `interaction-disclosure-spec` 所在页，1440、1024、390 三宽 | [ ] | [ ] | SUB-216（N1），G-18 |
| 展开故事标题无左边条：文档页展开的故事标题不再画 3px 强调色左边条与 10px 左内距，展开前后标题左缘不动，只有 chevron 旋转；手机宽下部分长标题因此少折一行 | 任一文档页的故事标题，展开与收起各看一次 | [ ] | [ ] | SUB-218（N3） |
| 截法变更：视觉签名的截图整张画出 story，顶带不压 story；比视口高的 story 不再只有纸内可见的一段 | `docs/verification/internal-alpha/screenshots/` 下高 story 的截图（跑 `internal-alpha:browser-proof` 生成，不入仓） | [ ] | [ ] | SUB-217（N2），G-17 |
| 登入动画：只改了飞行标的 `data-logo` 取值，画面不变 | `shell-intro` | [ ] | — | SUB-214（N1），G-20 |

视觉签名离群项（maxCell > 40，共 52 条；逐条理由在 `visual-baseline-selection-r4.json` 的 `outlierReason`，截图由 `internal-alpha:browser-proof` 写到 `docs/verification/internal-alpha/screenshots/<视口>-<story>.png`，不入仓）。52 条的大变化都来自截法变更（其中 `inputs-sample-members@mobile-390x844` 另有 R4-6：标题少折一行，story 高 1469 → 1449）：旧截法下这些高 story 只画了纸内可见的一段，其余是画布底色（签名格读 238），新截法画出整张，夜间块的深底与纸外的内容进入签名。签名已按当前渲染接受，是否只来自截法变更只能目视确认。

A 类（文档页）12 条：

| story @ 视口 | 签名距离（mean / maxCell） | 请看 | 目视 |
| --- | --- | --- | --- |
| `i18n-theme-contract@desktop-1440x900` | 16.324 / 150 | 夜间预览块与文档壳控制契约表整张画出，没有被顶带遮挡，下段不是画布底 | [ ] |
| `frontend-shell-slice@desktop-1440x900` | 39.07 / 210 | AOS frontend shell 实例全部画框完整（含夜间夹具）：顶带壳、content stack 块间距、第 4 个夹具「Desktop light, Work route」 | [ ] |
| `owner-quality-product-shell@desktop-1440x900` | 35.195 / 214 | owner-quality 实例 6 个框整列完整；两个 search-results 变体显示打开的完整菜单与 1 条结果，工作队列标题下的计数行 | [ ] |
| `i18n-theme-contract@tablet-1024x768` | 28.348 / 198 | 夜间预览块与文档壳控制契约表整张画出，没有被顶带遮挡，下段不是画布底 | [ ] |
| `frontend-shell-slice@tablet-1024x768` | 36.473 / 210 | AOS frontend shell 实例全部画框完整（含夜间夹具）：顶带壳、content stack 块间距、第 4 个夹具「Desktop light, Work route」 | [ ] |
| `owner-quality-product-shell@tablet-1024x768` | 33.945 / 213 | owner-quality 实例 6 个框整列完整；两个 search-results 变体显示打开的完整菜单与 1 条结果，工作队列标题下的计数行 | [ ] |
| `i18n-theme-contract@mobile-390x844` | 30.156 / 213 | 夜间预览块与文档壳控制契约表整张画出，没有被顶带遮挡，下段不是画布底 | [ ] |
| `interaction-disclosure-spec@mobile-390x844` | 12.234 / 180 | Tooltip 预览压住按钮与表头是预览本意；Disclosure 展开区里「Focusable only while expanded」按钮的底边与起始边描边画出（G-18、R4-3） | [ ] |
| `button-spec-usage@mobile-390x844` | 9.258 / 75 | 手机宽下按钮各变体完整、成行，没有被截断 | [ ] |
| `dashboard-page-templates@mobile-390x844` | 2.895 / 41 | 手机宽下仪表板页模板完整，上沿没有被顶带遮挡 | [ ] |
| `frontend-shell-slice@mobile-390x844` | 29.18 / 206 | AOS frontend shell 实例全部画框完整（含夜间夹具）：顶带壳、content stack 块间距、第 4 个夹具「Desktop light, Work route」 | [ ] |
| `owner-quality-product-shell@mobile-390x844` | 26.078 / 202 | owner-quality 实例 6 个框整列完整；两个 search-results 变体显示打开的完整菜单与 1 条结果，工作队列标题下的计数行 | [ ] |

B、C、D 类 40 条（不属 A 类，按 story 合并；视口写宽度）：

| story | 视口与签名距离（mean / maxCell） | 请看 | 目视 |
| --- | --- | --- | --- |
| `shell-top-band`（C 类） | 1440 75.926 / 214；1024 75.996 / 214；390 73.883 / 212 | 壳层各屏整列画出，浅色与夜间屏都在 | [ ] |
| `shell-matrix`（C 类） | 1440 51.719 / 220；1024 61.68 / 218；390 62.461 / 212 | 壳层矩阵浅色与夜间两块整张画出 | [ ] |
| `typography-matrix`（D 类） | 1440 22.949 / 220；1024 37.594 / 220；390 96.867 / 214 | 家族矩阵浅色与夜间两块整张画出 | [ ] |
| `icon-matrix`（D 类） | 1440 39.789 / 213；1024 52.77 / 213；390 77.152 / 213 | 家族矩阵浅色与夜间两块整张画出 | [ ] |
| `brand-matrix`（D 类） | 1440 38.496 / 214；1024 50.102 / 214；390 51.324 / 218 | 家族矩阵浅色与夜间两块整张画出 | [ ] |
| `actions-matrix`（D 类） | 1440 57.84 / 214；1024 66.203 / 214；390 62.785 / 213 | 家族矩阵浅色与夜间两块整张画出 | [ ] |
| `inputs-matrix`（D 类） | 1440 51.27 / 214；1024 57.891 / 214；390 76.633 / 214 | 家族矩阵浅色与夜间两块整张画出 | [ ] |
| `typography-sample-billing`（B 类） | 1440 82.402 / 213；1024 97.195 / 213；390 87.172 / 214 | 样板浅色块与夜间块整张画出，样板壳高 640、与画框底差 0 | [ ] |
| `icon-sample-project`（B 类） | 1440 40.461 / 213；1024 52.957 / 213；390 48.371 / 213 | 样板浅色块与夜间块整张画出，样板壳高 640、与画框底差 0 | [ ] |
| `brand-sample-product`（B 类） | 1440 40.148 / 213；1024 52.551 / 213；390 48.609 / 213 | 样板浅色块与夜间块整张画出，样板壳高 640、与画框底差 0 | [ ] |
| `actions-sample-project`（B 类） | 1440 42.652 / 213；1024 52.895 / 213；390 49.09 / 213 | 样板浅色块与夜间块整张画出，样板壳高 640、与画框底差 0 | [ ] |
| `inputs-sample-members`（B 类） | 1440 42.543 / 213；1024 52.23 / 213；390 49.926 / 211 | 样板浅色块与夜间块整张画出，样板壳高 640、与画框底差 0 | [ ] |
| `composition-three-sample`（B 类） | 1440 40.531 / 213；1024 53.145 / 213；390 48.969 / 213 | 样板浅色块与夜间块整张画出，样板壳高 640、与画框底差 0 | [ ] |
| `shell-mobile`（C 类） | 390 11.715 / 41 | 手机壳各屏整列画出 | [ ] |

## 第五轮新增与变化的目视项

各包交回的「目视项」（`runs/r5/handoff/Q1.md` 第 5 节；Q2 无）。第五轮只改了可折叠区内层的裁切余量（SUB-225，R5-1），没有改板、token 与文案。页面同「怎么看」。

| 核对项（只能目视） | 看哪里 | 浅色 | 夜间 | 来源 |
| --- | --- | --- | --- | --- |
| Disclosure 获焦焦点环：展开面板里键盘获焦次级按钮「Focusable only while expanded」（夜间 zh-CN 为「仅展开时可聚焦」），焦点环四边完整，内侧是承载面间隙、外侧是强调色环，底边与起始边不再被区域裁掉；Chromium 读数四边都完整（浅色 en 1440、1024、390，夜间 zh-CN 1440，forced-colors 仿真同）；请在 Safari 与 Chromium 内核的浏览器各看一遍（`overflow-clip-margin` 在 WebKit 上是否生效未核实，Q1 问题 3），Safari 上若底边与起始边的环画不全，照实记入 G-18 | `interaction-disclosure-spec` 所在页，1440、1024、390 三宽 | [ ] | [ ] | SUB-225（Q1），G-18 |
| 展开动画的代价：展开过程中，区域块末端外最多 4px 的内容可见（第四轮为 2px）；收起时区域立即隐藏，减少动态效果时不过渡。这是按样式读出的结论，没有逐帧实测（静态 Storybook 里没有能切换展开的面板，Q1 问题 4） | 有切换钮的 Disclosure 真件，展开一次看区域底缘 | [ ] | — | SUB-225（Q1） |

第五轮没有重收：gated 视觉签名 217 条全部在容差内，`interaction-disclosure-spec` 三宽的签名距离都是 0 / 0，没有离群项要看。

## 待发布的成品板（交设计会话）

本批改过的成品板与草稿板如下，画布发布由设计会话做；发布前 Owner 以仓内副本对照。`Shell.dc.html` 与 `Shell-2.dc.html` 没有改（字节真值），`Tokens.dc.html` 与 `Brand.dc.html` 没有改。

| 板文件 | 改动 | 提交 |
| --- | --- | --- |
| `docs/design/visual-standard/boards/Icon.dc.html` | A 段名册加 pin 两行（浅色、夜间）；D 段组合样板换顶带壳 | 3f87bb3（SUB-123）、deaf18b（SUB-133） |
| `docs/design/visual-standard/boards/Typography.dc.html` | D 段组合样板 · 顶带壳（账单页） | deaf18b（SUB-133） |
| `docs/design/visual-standard/boards/Actions.dc.html` | D 段组合样板 · 顶带壳（项目页改为名册页） | deaf18b（SUB-133） |
| `docs/design/visual-standard/boards/Inputs.dc.html` | D 段组合样板 · 顶带壳（邀请成员） | deaf18b（SUB-133） |
| 草稿画布 `docs/design/gplus-2026-10/boards/V2-B1-Icon.dc.html` | 与成品 Icon 板同两处 | 3f87bb3、deaf18b |
| 草稿画布 `V2-B1-Typography.dc.html`、`V2-B1-Actions.dc.html`、`V2-B1-Inputs.dc.html`（同目录） | D 段换顶带壳 | deaf18b |
| `docs/design/visual-standard/boards/Icon.dc.html`、`Typography.dc.html` | 第二轮：名册件数改为 38（只改文字，没有版式变化） | 4c18e4c（SUB-153） |
| 草稿画布 `V2-B1-Icon.dc.html`、`V2-B1-Typography.dc.html` | 第二轮：同上（草稿 canvas.json 不变） | 4c18e4c（SUB-153） |
| `docs/design/visual-standard/canvas.json` | 第二轮：四块成品板的板高 h 按 `heights.json` 改，其下各板 y 随之下移 | 6baccc0（SUB-172） |

四块成品板加了 D 段后变高，`docs/design/visual-standard/heights.json` 已改；`docs/design/visual-standard/canvas.json` 的板高 h 与 y 第一轮没有跟着改（问题 P11-2），第二轮已按 `heights.json` 改（SUB-172）。发布时由设计会话一并处理。

另交设计会话：第二轮新增三条壳层 token，`shell.mark`（`--tcrn-shell-mark`，22px，标的边长）、`shell.touch`（`--tcrn-shell-touch`，44px，粗指针下的行高与搜索高）、`shell.crumb-icon`（`--tcrn-shell-crumb-icon`，11px，面包屑分隔符图标），请补进 `Shell-2.dc.html` 的 F 段；名字属 B 类，Owner 可改名或决定不设（SUB-142）。第三轮再加三条（SUB-178，按默认名落地）：`shell.chevron`（`--tcrn-shell-chevron`，12px，下一级箭头、菜单底栏位置分隔符、固定项下拉箭头）、`shell.locale-chevron`（`--tcrn-shell-locale-chevron`，11px，头像菜单的语言切换箭头）、`shell.mark-lg`（`--tcrn-shell-mark-lg`，44px，首行锁定块大尺度的标），同样请补进 F 段。`measure-shell.js` 本轮没有改（M1），量板继续用现版。

## 已知差距（照实列出，不代 Owner 判断）

| # | 差距 | 来源 |
| --- | --- | --- |
| G-1 | 夜间 TMS 后缀 #2c63c8 低于 4.5（壳层板读数于纸 3.13、于画布 3.33）；包按通过稿两主题同色，token-contrast 与 axe 带两条夜间 TMS 豁免并标 pending | MIN-20261013-SHELL D2、D7；问题 P4-1 至 P4-3 |
| G-2 | AOS 在通过稿 logos2 里没有标，`brandProductId` 不收 `aos`，顶带画不出 AOS 的标按钮；三处 AOS story 暂传 `design-system` | 问题 P1c-1 |
| G-3 | 第二轮已改：页面在浏览器里挂载壳 story 的真件（SUB-151），`shell-mobile` 的 `ts-m-s` 在 390 下打开即 Sheet，壳根 `data-state` 报 `sheet`（SUB-159、SUB-160）；待目视 | 问题 P7-1、P7-2；`runs/r2/handoff/K5.md` |
| G-4 | 第二轮已改：页面挂载后登入动画每会话首载播放一次，同页再载不播（SUB-151）；待目视 | 问题 P5-2；`runs/r2/handoff/K5.md` |
| G-5 | 第三轮已改读法（M1）：壳层门 contrast 的底色取格心下方实际绘制的层，读不到时标 `backdrop: "ancestors"`（本轮 0 格）。B 段 66 格中 60 格按 data-expect 判，全过（其中夜间 TMS 后缀与锁定块强调 3 格按 D7 记 pending）；6 格按 07a B「不进门 / 豁免 / 按设计不读」只列读数、不判：彩色标浅色 4.85、夜间 3.33，面板对画布边线 1.16 / 1.06，遮罩下的纸浅色 5.56（板 5.57）、夜间 4.13（板 7.29，O-15）。这 6 格只能目视 | 问题 P9-1；`runs/r3/handoff/M1.md` 第 4 节；`docs/verification/shell-measure/report.json` |
| G-6 | 铃铛悬停：已按 07a B 段改为 6% 墨洗（SUB-146；读数浅色 13.97、夜间 13.17）；已按板改，待目视 | 问题 P9-2；`runs/r2/handoff/K1.md` |
| G-7 | 第二轮已改：标按钮字标列取宽与后缀纵向余量（SUB-143），几何与映射报告里六个样板的 clip 本轮不红；待目视 | 问题 P14-1；`runs/r2/handoff/K1.md` |
| G-8 | zh-CN 下文档壳顶带固定项与完整菜单把 Change Log 显示为「更新日志」，原侧栏与 page-template 为「变更日志」，两套来源；第二轮已统一取 `group.Change Log` 一个来源，zh-CN 为「变更日志」（SUB-166），待目视 | 问题 P13-13；`runs/r2/handoff/K2.md` |
| G-9 | 新文档壳的完整菜单分类行不带说明，索引页与参考页不标当前 story（涉及门判定，交判断）；头像菜单里语言列表按 Esc 会连头像菜单一起关、焦点不回语言触发键；第二轮已改语言列表 Esc 只关列表、焦点回语言钮（SUB-166），菜单分类说明与索引页「当前」见第二轮各包交回 | 问题 P13-14、P13-15；`runs/r2/handoff/K2.md`、`K11.md` |
| G-10 | 长字标：标按钮 134 宽里「TCRN Design System」「Mana Orchestrate」截断并带 title，TMS 完整（SUB-143）；O-1 未裁，134 不改；待目视 | `runs/r2/handoff/K1.md` |
| G-11 | 夜间 TMS 后缀在标按钮悬停底上读 3.07（与 G-1 同一颜色，两主题同色），待 D7（O-8）；待目视 | `runs/r2/handoff/K1.md` |
| G-12 | 固定项拖排（SUB-149）：只有目视与键盘手测能确认手感（就地换位、无插入线与拖影、Alt+方向键）；待目视 | `runs/r2/handoff/K6.md` |
| G-13 | typography 与 inputs 两个样板的页面内容伸出 640 画框 9 与 29，几何报告与映射报告的 overlap 浅色、夜间都判红；第三轮已改（SUB-205）：样板壳包装层 `block-size: 100%`，十个样板壳高 640、与画框底差 0，几何报告 22 段与映射报告 23 行的 overlap 都不红；待目视 | `runs/r2/problems/K11.md` 第 11 条；`runs/r2/problems/K12.md`；`runs/r3/handoff/M6.md` |
| G-14 | axe 14 条：文档站的 design-system 锁定块后缀对比度（不在 axe 豁免表）、heading-order、landmark-unique（页内目录与分区导航的 nav 地标各有重名）；internal-alpha 浏览器门因此与其他非视觉项一起判红，视觉签名本轮没有重收；第三轮已改：axe 0 条（`a11y-axe-summary.json`），浏览器门非视觉项全过，视觉签名已重收（见「机器证据入口」） | `runs/r2/problems/K11.md` 第 6–8 条；`runs/r2/problems/K12.md`；`runs/r3/handoff/M4.md`、`M7.md`、`M9.md` |
| G-15 | 壳层门 markText 仍红（O-4 待裁）：品牌首行 DS `lkr-line@22` 读 1.4（en、zh-CN 相同），完整菜单与矩阵底栏的 TMS 锁定块 `lkr@22` en 读 1.7；D 段「标按钮（v2）」同根；门照 ±1 判，不放宽 | `docs/verification/shell-measure/report.json`；`runs/r3/problems/M1.md` 第 3 条 |
| G-16 | contract:static 的 C8 发现 15 条（静态 `yield-without-min-width` 1 条、story 层 `story-yield-missing` 14 条，byFamily 全在 shell；第三轮判断更正，此前写的 18 条有误）：板上 `.ts-pins` 写 `min-width:0`、无固定项的壳 `ShellPins` 返回 null，现有 token 补不了。第三轮判断把它列为 O-19（门判定语义的放宽，只能由 Owner 定），第四轮不派任何改动，登记保留；O-19 裁定前 contract:static 退出 1，SUB-113、125、142、155、178、191 保持 active。第四轮 SUB-215 补登 9 个根类后读数仍是这 15 条，没有新发现 | `runs/r3/judgment.md` §3.1.1；`runs/r4/handoff/N2.md` 第 2 节 |
| G-17 | 视觉签名的截图形态：第三轮换壳后 story 块在纸内滚动区里截图，比视口高的 story 只绘制纸内可见的一段，顶带压在视口顶部，其余为画布底色。第四轮已改（SUB-217，R4-5）：截图时临时让文档壳根、纸与主区高随内容、overflow visible，顶带留在纸上方自己那一行，截完复原并自检；154 张高 story 截图底边画布行全为 0（旧截法 154 张都大于 0），216 张 story 截图版式宽高不变、顶带不压 story。签名已按新截法整批重收（SUB-224），截法变更后的离群项见「第四轮新增与变化的目视项」；待目视 | `runs/r4/handoff/N2.md` 第 2 节；`docs/verification/internal-alpha/visual-baseline-selection-r4.json` |
| G-18 | `interaction-disclosure-spec` 平板截图里 Disclosure 展开区的「Focusable only while expanded」按钮下缘贴着区域底边、底框线不可见。第四轮已改（SUB-216，R4-3）：展开区内层改为 `overflow: clip` 加 `overflow-clip-margin`（`--tcrn-space-0h`），按钮底边与起始边的描边画出，Layout 单测断言；这处变化小于视觉签名格的分辨率（与只含截法变更的读数同键 maxCell 不超过 3），只能目视。第四轮的读数：按钮获焦时焦点环的底边与起始边被裁 2px（N1 问题 2），已由第五轮处置。第五轮已改（SUB-225，R5-1）：展开区内层的裁切余量改为 `--tcrn-space-1`（4px），获焦焦点环四边完整：Chromium 下按钮四边外第 1、2 行 / 列是承载面间隙、第 3、4 行 / 列是强调色环，浅色 en 1440、1024、390 与夜间 zh-CN 1440 都完整，forced-colors 仿真下第 3、4 行 / 列是系统色 outline；Layout 单测按焦点环最大 spread 4 与 outline 宽加偏移 4 断言；该 story 三宽视觉签名距离 0 / 0。Safari 仍请同看：WebKit 是否认 `overflow-clip-margin` 未核（Q1 问题 3），Safari 上若底边与起始边的环仍画不全，照实记在这里。代价：展开动画中区域块末端外最多 4px 内容可见（按样式读出，未逐帧实测，Q1 问题 4）；待目视 | `runs/r4/handoff/N1.md` 第 2、7 节；`runs/r4/problems/N1.md` 第 2 条；`runs/r5/handoff/Q1.md` 第 2、5 节 |
| G-19 | `ts-closed-l` 第三个钉钮的「指针悬停」画面是服务端写入的静态预览，拖排后跟着原来那个项（Statements）走，不跟位置走 | `runs/r3/problems/M5.md` 第 8 条 |
| G-20 | 品牌字标的 `data-logo`：第三轮量的锁定块已改为标 id（SUB-194）。第四轮已改（SUB-212、SUB-214，R4-1）：`ShellBrandButton` 与 `ShellIntro` 的飞行标也写标的 id（ds、mana、tms、einzbern），取法统一用 `product-mark-id.ts` 的 `productMarkIdOf`（不从入口导出）；没有样式按 `data-logo` 取值，视觉签名没有因此变化；迁移说明 M49 写明，M42 末句不再成立 | `runs/r4/handoff/N1.md`；`docs/migration-4.0.md` M49 |
| G-21 | 文档整理：第四轮已改（SUB-221、SUB-223，R4-8）：`storybook-map.json` 与 md 逐格一致；ui-react README 图标件数 38 并列 `pin`；迁移说明开头改为 M20…M52、分消费方清单补齐，追加 M49–M52。第五轮已改（SUB-227，R5-2）：SUB-215 补登根类后 M30 写的块数过期（N4 交回），迁移说明追加 M53，写明三族块数（第五轮读数 navigation 11、shell 19、inputs 16）、补登的 9 个根类与顶带的 C8 工具栏登记（容器 `tcrn-shell-strip`、让步项 `tcrn-shell-pins`、固定项 `tcrn-shell-brand` 与 `tcrn-shell-cluster`，判定待 O-19），M30 末段的块数与「`roles.json` 没有工具栏」一句不再成立，M30 保持原文；开头区间改为 M20…M53，分消费方清单读 M30 的三条补 M53，CHANGELOG 摘要同步 | `runs/r4/handoff/N4.md`；`runs/r5/handoff/Q2.md` |

## 待 Owner 裁定（两批）

下列各项已按建议或设计会话裁定先实现，Owner 可以更正；裁定之前，消费方迁移说明（`docs/migration-4.0.md`）按现状描述。

| # | 事项 | 现状 | 建议 |
| --- | --- | --- | --- |
| 1 | 夜间 TMS 后缀色（D7，与第一批收口 S-6 一并裁定；O-8） | 两主题同为 #2c63c8（G-1），迁移说明 M28 | 设计会话建议夜间取 #7aa0f5；裁定取它时，变量回到两个主题块并撤两条夜间豁免 |
| 2 | AOS 的标（G-2；O-9） | AOS 壳没有标按钮，AOS story 暂传 `design-system` | 由 Owner 定：画 AOS 标进通过稿，或 AOS 壳另行处理 |
| 3 | `.tcrn-icon` 基类进包（第一批第 4 条） | 已进包 | 按现状保留，Owner 可更正 |
| 4 | 产品标六档阶梯与贴片是否进 story（第一批第 5 条，DIFF-8） | 未进 story | 由 Owner 定 |
| 5 | Text 段落外距（第一批第 6 条） | 生成段零外距，家族规则恢复原有上外距 | 由设计权威或 Owner 定 |
| 6 | 等宽字族的 Noto 中文回退（第一批第 7 条） | 已加 | 目视时核对等宽文字里的中文（第 1 节） |
| 7 | 字标对比度只按 panel 承载面算是否足够（第一批第 8 条） | 门按契约 panel 与 bg 都量 | 目视时判定（第 4 节） |
| 8 | 中文子集「常用 3500 字」（第一批第 9 条） | 按产品用字选上游分片 | 维持分片方案 |
| 9 | 锁定组合标语与壳品牌说明（ink-3）的对比度（第一批第 10 条 O-2） | 画布色底上 ink-3 浅色 4.86、夜间 4.89；第一批该条附带的文档导航分类计数（N-1）随旧文档侧栏删除，不再有被测物 | 维持，复核再出现时由 Owner 在「字标豁免」与「改 ink-2」之间二选一 |
| 10 | 组件内字面几何是否补 token（第一批第 11 条 O-6） | 不新增；本批只新增跨包约定 C-2 的 20 个壳层 token 与 1 个布局 token | 按默认执行 |
| 11 | 品牌规格（第一批第 12 条 O-8） | 第一批 Brand 板已退出标准（MIN-20261013-SHELL D2），壳里的品牌按通过稿与 07a 第 1 段 | 请 Owner 目视时在第 4、7 节确认 |
| 12 | secondary 与 danger 默认 edge 的抬升层是浅墨字面量（第一批第 13 条 O-9） | 两主题共用，夜间几乎不可见 | 按默认维持，下次画板修订改为主题化 token |
| 13 | 长字标放不下（O-1）：「TCRN Design System」要 117，标按钮字标格 60（D1 定宽 134） | 截断加 title，134 不改（G-10） | 宽度至少 134、随字标加宽，07b 补长名屏；不同意则改用第一版 |
| 14 | STORY-148 GWT1 写「五块」，现做法是四板 D 段加 07a 第 1 段（O-2） | 按现做法，GWT1 记部分 | 接受现做法，注解写明读法 |
| 15 | 级联越过视口右缘（O-3）：第四级在 1024–1330 宽出界，菜单内两列在 1440 宽出界 12 | 现写法 | 越过右缘就向左展开 |
| 16 | 墨迹中线遇到下行字母（O-4）：DS 首行 1.4、底栏 TMS 锁定块 en 1.7，又不许下移字形；与 O-19（第 29 行，G-16）并列，是挡住批末 verify 归 0 的两项之一（G-15） | 门照 ±1 判，markText 红，145-GWT2、149 记部分 | ±1 改量「首行大写顶到基线」，两行锁定块只量首行（底栏这样量是 0.6） |
| 17 | Icon 板规则「禁填充」与 pin 实心态冲突（O-5） | 只改件数，不画实心态 | 加例外，补画实心态 |
| 18 | 触摸端未固定的行，图钉平时看不见（O-6） | 获焦才显 | 粗指针下常显 ink-3 |
| 19 | 文档站无登录时头像用默认人形；目录宽 144、截断（O-7） | 现状 | 接受现状 |
| 20 | 头像菜单几何与无账户图标，板上没画（O-10） | 现写法 | 接受现写法，目视时定 |
| 21 | 窄屏按视口切还是按容器切（O-11） | 按视口 | 改用容器查询 |
| 22 | 下拉里是否显示 ⌘K（O-12） | 不显示 | 不显示，可直接结掉 |
| 23 | 纸升起的距离，板上没给数（O-13） | 10 | 设计会话给数 |
| 24 | STORY-136 字重文本与板不一致（O-14） | 按板实现 | 按板改 Story 文本 |
| 25 | Sheet 夜间遮罩与 Sheet 下一级怎么开（O-15）；遮罩下的纸夜间读 4.13，板 7.29（G-5） | 现写法 | 设计会话补 |
| 26 | 纸内页标题行高（O-16）：板 1.1（28.6）没有 type token，包件 30 | 30 | 接受 30；要 28.6 就新增 type token |
| 27 | TreeNav 归宿（O-17）：壳菜单与下拉由模型渲染，装不进 TreeNav | 现写法 | 接受；迁移说明 M22、M30 写明 TreeNav 只用于消费方的下拉或浮层 |
| 28 | 批末 verify 不含 test:dom（O-18）：SUB-180、SUB-184、SUB-185、SUB-214（141-GWT4 的 DS、Mana 两例）的 DOM 用例只由局部门看；加段属执行方法变更 | 不加 | 批末 verify 后加跑只读 `test:dom` |
| 29 | 顶带的 C8 让步项（O-19，G-16）：15 条（静态 `yield-without-min-width` 1 条、story 层 `story-yield-missing` 14 条）；板上 `.ts-pins` 写 `min-width:0`，没有固定项的壳不渲染让步项；让顶带过 C8 只有改判定、给板补数、渲染空让步位三条路 | 门照判，contract:static 红，与 O-4 一起挡批末 verify；登记保留；SUB-113、125、142、155、178、191 保持 active | 甲（建议）：裁定顶带按板，roles.json 顶带一项加两个字段，门的 C8 静态层与 story 层只对带字段的登记跳过这两项，其余 C8 检查照旧，clauses.md 写明，两条自检；乙：设计会话给让步项一个最小宽进 07b 与 token；丙：撤登记，不建议 |
| 30 | Story 144 标题写「一段即开全屏 Sheet」、Assumptions 写「从顶带下方升起」，板与包件是自底升起、最高 84%（O-20） | 实现照板，Story 文字不准 | 同 O-14：按板改 Story 文字，不改实现 |

第 13 至 28 行是本批判断列出的 O-1 至 O-18 里此前未进表的各条（O-8、O-9 即第 1、2 行）；第 29、30 行是第三轮判断新增的 O-19、O-20（`runs/r3/judgment.md` §3.1、§3.1.1）；「现状」是不裁时的默认（`runs/r2/judgment.md` §3.1），裁定后的改法与规模见同节。

第一批「待 Owner 裁定」第 1 条（构图一几何与构图三）、第 2 条（夜间后缀 #7aa0f5）、第 3 条（外壳切换钮尺寸）已被第二批取代，见下节。

## 从第一批清单删去的项

按 D8 ③ 删去壳层几何项，并删去随之失效的侧栏项；第一批清单原文不改。

| 第一批清单中的项 | 处置 |
| --- | --- |
| 第 3 节构图板：构图一侧栏与纸、侧栏宽 220、侧栏引导列 16 / 48、构图一壳几何（收起 52、壳顶栏 52、纸贴侧栏）、构图三样板与它和构图板的差 | 删去（D8 ③）。壳层改为顶带壳（MIN-20261013-SHELL D1），样板与纸的目视在第 2 至 7 节 |
| 第 6 节品牌：产品壳收起时只留标、收起态三条中心线、标尺寸分层里的「产品壳侧栏 22」 | 删去（D8 ③）。顶带里的品牌看第 7 节第 1 段标三版 |
| 第 6 节与第 3 节：TMS 夜间后缀 #7aa0f5 | 删去，已撤回：两主题同色（第 4 节，G-1） |
| 第 7 节动作：外壳侧栏切换钮随 Actions 状态对换色 | 删去：壳里没有侧栏切换钮；主题钮在头像菜单（第 5 节） |
| 第 8 节表单控件：SearchInput「顶栏与表单内一致」 | 改为只看表单内；壳的搜索在完整菜单与下拉里（第 7 节） |
| 「R2 按建议先做的项」第 4、8、10 行，「R3 落地项」全部五行（密集与紧凑壳原型、文档层例外、文档壳按构图一） | 删去：文档壳已换成包的顶带壳，相关文档层例外与白名单由 SUB-132 清理（`scripts/shell-fidelity-proof.mjs`、`docs/style-scale.md`） |
| 「R2 按建议先做的项」其余有渲染面的行（只读框焦点环、错误态洗底、快捷键 ink-2、主题钮图标、按钮禁用原因的 title、axe 字标豁免） | 并入第 4 至 6 节 |

## 四个停点

推送 main、打 tag、发版、部署是四个各自独立的 Owner 停点。实施对话不执行其中任何一项；本清单、CHANGELOG 的 4.0.0 段与迁移说明都不代表其中任何一项已获授权或已经发生。

| 停点 | 现状 |
| --- | --- |
| 推送 main | 两批的提交都未推送 |
| 打 tag（v4.0.0） | 仓库没有 v4.0.0 tag |
| 发版（npm 发布三包 4.0.0） | 未发布 |
| 部署（4.0.0 的静态文档） | 未部署 |
