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

下列回执与报告由第二轮批末的 SUB-177 在同一构建上重生成（第一轮为 SUB-140），读数与退出码见 `runs/r2/handoff/K12.md`；以重生成后的版本为准。第二轮的 internal-alpha 浏览器门非视觉项仍红，视觉签名没有重收（基线 202 条未动，199 条回归与 18 条新增按 story 逐条分类列在 `runs/r2/problems/K12.md`）。本清单只写文档，清单里的读数取自这些报告与各包交回。

| 证据 | 路径或命令 |
| --- | --- |
| 画板逐行映射报告（23 行；八项测量、shellFrame 与重叠检查） | `docs/verification/storybook-visual-proof/gplus-map-report.md` 与 `.json`；`node scripts/storybook-visual-proof.mjs --write-report` |
| 几何测量（含 shellFrame：顶带 52、纸离壳边 12、纸圆角 14） | `docs/verification/geometry-measure/report.json`；`node scripts/geometry-measure-proof.mjs --write-report` |
| 壳层 18 门（两块成品壳层板夹具与真件 story） | `docs/verification/shell-measure/report.json`；`node scripts/shell-measure-proof.mjs --write-report`（夹具：`--fixtures`） |
| internal-alpha 回执（axe、story 覆盖、高度预算、视觉签名） | `docs/verification/internal-alpha/` 下各 json；视觉签名重收的逐条记录在 `visual-selection-application.json` |
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

机器判据（第二轮批末读数，`docs/verification/shell-measure/report.json`）：壳层 18 门（`shell-measure-proof`；两块成品板夹具在板原宽 1240 量，真件 story 在 1440×900 与 390×844、en 与 zh 量），真件 13 门过、5 门红——brandDigest（品牌首行 story 的资源名与 logos2 文件名对不上）、markText（O-4 待裁）、pinJitter（三个菜单屏图钉读成 0×0）、contrast（矩阵）、singleLine（与面包屑截断读法冲突）；B 段 66 格逐格比对 data-expect（壳层门 contrast；8 格读不了，G-5）；行为探针（焦点回路、方向键、Esc 与点外部、登入动画轨迹）在页面挂载真件后读，本轮 intro、focusLoop、touch 过；品牌资产 digest（`brand-asset:proof`，本轮批末没有跑）。门红的项与门量不到的项都只能靠目视。

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

看哪些 story：D 段的几何在第 7 节的 `shell-top-band`、`shell-mobile` 上看；E、F、G 三段没有渲染面，落点分别是 `docs/migration-4.0.md` M20 至 M29（消费方要做什么）、`packages/ui-tokens/src/tokens.css` 的壳层与登入动画 token（值见 M24）、`scripts/shell-measure-proof.mjs` 的 18 门与 `tests/fixtures/geometry-measure/shell/mutations.json` 的变异。

机器判据（第二轮批末读数，`docs/verification/shell-measure/report.json`）：D 段 12 行关系断言（引导列、文字起点、右缘、行中线 26、三处间距相等、接续 6、级联同宽同高等）由壳层门逐行量，夹具量成品板、story 量真件；本轮 12 行中 9 行过，标按钮（v2）、图钉位、面包屑 3 行红。引导列由新增的 prail 检查量（菜单内图标 16、文字 48，SUB-152、SUB-174），本轮真件判红。G 段每门一条会红的变异（`--fixtures` 与 storyMutations；本轮 story 变异 22 条中 21 条判红，story-label-plus-40 仍判过）。F 段的 20 个新 token 与 3 个弃用 token 由 `@tcrn/ui-tokens` 的测试钉住值与弃用登记；第二轮另加的三条壳层 token 不在 F 段（见「待发布的成品板」）。

| 核对项（只能目视） | 浅色 | 夜间 |
| --- | --- | --- |
| D 段标尺读数与 `shell-top-band` 各屏一致：顶带 52、标按钮 134 × 40 在 (12, 6)、固定项 32、间距 8、行中线 26、纸离边 12；量过的数以壳层门报告为准，目视只看有没有明显偏差 | [ ] | [ ] |
| E 段消费方契约读起来与 `docs/migration-4.0.md` M20 至 M29 的做法一致（菜单模型四级、`pageHeader` 必填、固定项偏好由产品后端保存、⌘K 每个壳一次） | — | — |
| F 段 token 差异表与 4.0.0 的 token 一致：新增 20 个（16 个壳层尺寸、4 个登入动画时长），`--tcrn-shell-topbar-height` 为指向顶带高的弃用别名，两个侧栏宽弃用、没有替代，小面板宽撤销、不新增；第二轮新增的 `--tcrn-shell-mark` 22、`--tcrn-shell-touch` 44、`--tcrn-shell-crumb-icon` 11 还没进 F 段，对照时这三条不算差异 | — | — |
| G 段门表与本批实际接入的门一致（`geometry:measure` 串入壳层 18 门，CI 经 `pnpm verify` 跑到） | — | — |

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

另交设计会话：第二轮新增三条壳层 token，`shell.mark`（`--tcrn-shell-mark`，22px，标的边长）、`shell.touch`（`--tcrn-shell-touch`，44px，粗指针下的行高与搜索高）、`shell.crumb-icon`（`--tcrn-shell-crumb-icon`，11px，面包屑分隔符图标），请补进 `Shell-2.dc.html` 的 F 段；名字属 B 类，Owner 可改名或决定不设（SUB-142）。

## 已知差距（照实列出，不代 Owner 判断）

| # | 差距 | 来源 |
| --- | --- | --- |
| G-1 | 夜间 TMS 后缀 #2c63c8 低于 4.5（壳层板读数于纸 3.13、于画布 3.33）；包按通过稿两主题同色，token-contrast 与 axe 带两条夜间 TMS 豁免并标 pending | MIN-20261013-SHELL D2、D7；问题 P4-1 至 P4-3 |
| G-2 | AOS 在通过稿 logos2 里没有标，`brandProductId` 不收 `aos`，顶带画不出 AOS 的标按钮；三处 AOS story 暂传 `design-system` | 问题 P1c-1 |
| G-3 | 第二轮已改：页面在浏览器里挂载壳 story 的真件（SUB-151），`shell-mobile` 的 `ts-m-s` 在 390 下打开即 Sheet，壳根 `data-state` 报 `sheet`（SUB-159、SUB-160）；待目视 | 问题 P7-1、P7-2；`runs/r2/handoff/K5.md` |
| G-4 | 第二轮已改：页面挂载后登入动画每会话首载播放一次，同页再载不播（SUB-151）；待目视 | 问题 P5-2；`runs/r2/handoff/K5.md` |
| G-5 | 壳层门读不了 B 段 8 格（彩色标、焦点环、面板对画布、遮罩下的纸），且仍拿豁免格比期望值 | 问题 P9-1 |
| G-6 | 铃铛悬停：已按 07a B 段改为 6% 墨洗（SUB-146；读数浅色 13.97、夜间 13.17）；已按板改，待目视 | 问题 P9-2；`runs/r2/handoff/K1.md` |
| G-7 | 第二轮已改：标按钮字标列取宽与后缀纵向余量（SUB-143），几何与映射报告里六个样板的 clip 本轮不红；待目视 | 问题 P14-1；`runs/r2/handoff/K1.md` |
| G-8 | zh-CN 下文档壳顶带固定项与完整菜单把 Change Log 显示为「更新日志」，原侧栏与 page-template 为「变更日志」，两套来源；第二轮已统一取 `group.Change Log` 一个来源，zh-CN 为「变更日志」（SUB-166），待目视 | 问题 P13-13；`runs/r2/handoff/K2.md` |
| G-9 | 新文档壳的完整菜单分类行不带说明，索引页与参考页不标当前 story（涉及门判定，交判断）；头像菜单里语言列表按 Esc 会连头像菜单一起关、焦点不回语言触发键；第二轮已改语言列表 Esc 只关列表、焦点回语言钮（SUB-166），菜单分类说明与索引页「当前」见第二轮各包交回 | 问题 P13-14、P13-15；`runs/r2/handoff/K2.md`、`K11.md` |
| G-10 | 长字标：标按钮 134 宽里「TCRN Design System」「Mana Orchestrate」截断并带 title，TMS 完整（SUB-143）；O-1 未裁，134 不改；待目视 | `runs/r2/handoff/K1.md` |
| G-11 | 夜间 TMS 后缀在标按钮悬停底上读 3.07（与 G-1 同一颜色，两主题同色），待 D7（O-8）；待目视 | `runs/r2/handoff/K1.md` |
| G-12 | 固定项拖排（SUB-149）：只有目视与键盘手测能确认手感（就地换位、无插入线与拖影、Alt+方向键）；待目视 | `runs/r2/handoff/K6.md` |
| G-13 | typography 与 inputs 两个样板的页面内容伸出 640 画框 9 与 29，几何报告与映射报告的 overlap 浅色、夜间都判红 | `runs/r2/problems/K11.md` 第 11 条；`runs/r2/problems/K12.md` |
| G-14 | axe 14 条：文档站的 design-system 锁定块后缀对比度（不在 axe 豁免表）、heading-order、landmark-unique（页内目录与分区导航的 nav 地标各有重名）；internal-alpha 浏览器门因此与其他非视觉项一起判红，视觉签名本轮没有重收 | `runs/r2/problems/K11.md` 第 6–8 条；`runs/r2/problems/K12.md` |

## 待 Owner 裁定（两批）

下列各项已按建议或设计会话裁定先实现，Owner 可以更正；裁定之前，消费方迁移说明（`docs/migration-4.0.md`）按现状描述。

| # | 事项 | 现状 | 建议 |
| --- | --- | --- | --- |
| 1 | 夜间 TMS 后缀色（D7，与第一批收口 S-6 一并裁定） | 两主题同为 #2c63c8（G-1），迁移说明 M28 | 设计会话建议夜间取 #7aa0f5；裁定取它时，变量回到两个主题块并撤两条夜间豁免 |
| 2 | AOS 的标（G-2） | AOS 壳没有标按钮，AOS story 暂传 `design-system` | 由 Owner 定：画 AOS 标进通过稿，或 AOS 壳另行处理 |
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
