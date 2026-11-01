# 4.0.0 · Owner 目视验收清单（INIT-015 与 INIT-016 两批合一）

本清单供 Owner 在交付后逐项目视，不由实施会话、子代理或机器门代签。8 块成品标准板各有一节；每个 `[ ]` 都留空，表示尚无 Owner 目视结论。机器门、Story 机器判据、Owner 目视、发布与部署状态分别记录。

先看「门与 Story 状态」和「第六轮新增与变化的目视项」，再依次检查 Tokens、Typography、Icon、Brand、Actions、Inputs、Shell、Shell-2。第三至第五轮历史目视项完整保留在后文，按来源查找；当前 37 项签名变更与 18 项离群见下文「当前视觉清单（B23来源、B25复核）」；后面的早期轮次均为历史。

## 门与 Story 状态

B25/R29 已在源候选 32e5a21e1e3e1be120c19f3d0a7a3b3ce94114b4 完成固定三门与独立验收，源候选已快进合入本地 main。下表是该源包的本地结果；Root C05 正式覆盖的实际提交、运行编号、适用工单、退出结果和转态以本次原生回执及精确读回为准。原119项编号判据为118项机器证据支持、127#4退役而不适用；142完整目标的可见行动名含义仍待原Owner问题答复。Owner目视尚未进行。

C05只读正式计划发现：同一个DS项目、同一个实际仓库被列为1个库级组与4个选中目标组，每组都有三道门；当前引擎会执行15条顶层命令。正式门尚未启动，未把这个计划追认为门通过。保持已批准的每门一次需要先处置分组与项目上下文的关系；执行方法或跨项目引擎修复范围须Owner明确决定，当前不删目标绑定、不关门、不改安装树。

| 批末门 | 状态 |
| --- | --- |
| `verify` | B25 退出 0；本次Root正式运行结果见原生回执 |
| `storybook:build` | B25 退出 0；本次Root正式运行结果见原生回执 |
| `test-dom` | B25 退出 0，65/65（O-18按MIN-20261016-GATES D1纳入）；本次Root正式结果见原生回执 |

INIT-016 的 16 张 Story 与 INIT-015 的 12 张 Story：

| Initiative | Story | 本地机器 / 原生边界 |
| --- | --- | --- |
| INIT-016 | STORY-135 | 本地编号判据有证据；原生状态以引擎为准 |
| INIT-016 | STORY-136 | 本地编号判据有证据；原生状态以引擎为准 |
| INIT-016 | STORY-137 | 本地编号判据有证据；原生状态以引擎为准 |
| INIT-016 | STORY-138 | 本地编号判据有证据；原生状态以引擎为准 |
| INIT-016 | STORY-139 | 本地编号判据有证据；原生状态以引擎为准 |
| INIT-016 | STORY-140 | 本地编号判据有证据；原生状态以引擎为准 |
| INIT-016 | STORY-141 | 本地编号判据有证据；原生状态以引擎为准 |
| INIT-016 | STORY-142 | 编号判据有证据；完整目标仍待原可见行动名问题答复，原生状态以引擎为准 |
| INIT-016 | STORY-143 | 本地编号判据有证据；原生状态以引擎为准 |
| INIT-016 | STORY-144 | 本地编号判据有证据；原生状态以引擎为准 |
| INIT-016 | STORY-145 | 本地编号判据有证据；原生状态以引擎为准 |
| INIT-016 | STORY-146 | 本地编号判据有证据；原生状态以引擎为准 |
| INIT-016 | STORY-147 | 本地编号判据有证据；原生状态以引擎为准 |
| INIT-016 | STORY-148 | 本地编号判据有证据；原生状态以引擎为准 |
| INIT-016 | STORY-149 | 本地编号判据有证据；原生状态以引擎为准 |
| INIT-016 | STORY-150 | 本地编号判据有证据；原生状态以引擎为准 |
| INIT-015 | STORY-120 | 本地编号判据有证据；原生状态以引擎为准 |
| INIT-015 | STORY-121 | 本地编号判据有证据；原生状态以引擎为准 |
| INIT-015 | STORY-122 | 本地编号判据有证据；原生状态以引擎为准 |
| INIT-015 | STORY-123 | 本地编号判据有证据；原生状态以引擎为准 |
| INIT-015 | STORY-124 | 本地编号判据有证据；原生状态以引擎为准 |
| INIT-015 | STORY-125 | 本地编号判据有证据；原生状态以引擎为准 |
| INIT-015 | STORY-126 | 本地编号判据有证据；原生状态以引擎为准 |
| INIT-015 | STORY-127 | 本地编号判据有证据；原生状态以引擎为准 |
| INIT-015 | STORY-128 | 终态历史保持；当前有效目标与首条通过151及Owner包归属决定映射核对 |
| INIT-015 | STORY-131 | 本地编号判据有证据；原生状态以引擎为准 |
| INIT-015 | STORY-132 | 本地编号判据有证据；原生状态以引擎为准 |
| INIT-015 | STORY-133 | 本地编号判据有证据；原生状态以引擎为准 |

STORY-150由实施会话按机器判据判定；Owner在交付后目视，其原生转态与Owner目视分别记录。原第一批12张已done；原第二批16张按原组保留active至142语义问题可完成处置，两个INIT保持active。后续151（包归属口径）与152（M30数量事实更正）的本地义务已有B25支持，本次Root正式覆盖与最终状态见实际原生读回；旧28-only回执不作为新增工单覆盖。原SUB234的9个浮层owner对照与恢复、原SUB242的清单更正及scan退出0均已有本地证据。

## 怎么看

- **静态文档（Track B）。** 在仓库根执行 `corepack pnpm@10.12.1 run build`，打开 `apps/storybook/storybook-static/`：矩阵在 `components-gplus-matrices.html#<story id>`，样板在 `components-gplus-samples.html#<story id>`，壳层 story 在 `components-navigation-shells.html#<story id>`。用 `?theme=dark`、`?locale=zh-CN` 查看夜间与中文；各文档页也可检查顶带壳、头像菜单、纸和纸内目录。
- **真 Storybook（Track A）。** `corepack pnpm@10.12.1 run storybook:manager-build` 输出到 `apps/storybook/storybook-preview-static`；该轨不设门。
- **主题和对照物。** 矩阵与样板分别查看浅色和夜间格；壳层 story 以 `data-shell` 区分屏幕。对照物是 `docs/design/visual-standard/boards/<板>.dc.html`；仓内副本待设计会话发布，截图只供目视，不做像素比对。
- **历史证据。** 后文「机器证据入口」保留前三至第四轮报告路径与历史读数；它们不替代上面的批末状态，也不证明 Owner 目视通过。

## 机器证据入口（历史路径）

历史报告仍可在 `docs/verification/` 下按原交回查阅。S9 包内一次运行：build、storybook:build、browser-proof 均退出 1；隔离树缺依赖与构建产物，未获得当前 nonVisualProofOk，签名接受 0 条，基线不变。geometry:proof、几何报告、壳层报告、映射报告、contracts、doc-shell:proof、contract:static、tokens:proof、pack:smoke 均退出 1；contract:static 的 77 个测试通过后因 dist 缺失停止。壳层回执为 storybook_registry_missing，18 门未量；映射为 static_docs_missing，0/23 实测通过、23 条未测，不是视觉违规判定。hardening、scaffold:proof 均退出 0；hardening 读取历史回执（72 story、328 截图、axe 0），不代表本轮浏览器通过。逐门日志、字节与最终 scan 结果见 S9 handoff 的 scratch 入口。批末三门及 28 条 Story 状态仍见上表。

## 当前视觉清单（B23来源、B25复核）

当前实现与参考入口是 Sites 的[设计标准站点](https://tcrn-ds-visual-standards.honestfawn3.chatgpt.site)及[草稿站点](https://tcrn-ds-visual-draft.honestfawn3.chatgpt.site)，依据 TCRN-DS-MIN-20261029-SITES。草稿只供方向与历史比较；已批准的局部裁定和本仓当前契约一并对照。仓内板副本与 Sites 待发布交付物不是已完成的线上替换；线上发布及设计会话读回保持待办，不要求重新登录来完成本地实施。

B25复核的当前本地机器结果：328 张截图、217 个 gated 签名匹配、111 个 recorded-only；回归 0、新基线 0、axe 违规 0。Inputs 的 42 格与全部 240 个稳定 ID 保留，五家族格数 44/28/10/116/42；Inputs 高度 1990px，预算仍为 2000px，重叠读数 0。独立 Doc 外壳实测 header 52、paper 边距左/右/下 12 与顶 52、圆角 14，无常驻导航轨；独立原始 390px Doc 消费者有真实 40px 高标按钮，内嵌 mobile story 仍为 owner300，二者不混用。

原条件式 SUB243 接纳下列精确 37 个来源已说明的变更：原 19 + 后增 16 + ShellIntro 新 2。选择文件 `docs/verification/internal-alpha/visual-baseline-selection-r6.json` 的 SHA256 为 acf5e68b1d684ff9096b96b1fc81f98af9b49fa0d21a670cc9a9c70c5e163560；应用 37、拒绝 0，后续证明回归/新基线均为 0。18 项 maxCell >40 在表中标出；分类 A 为文档、C 为壳 story、D 为矩阵。原因、源文件/提交与每项签名 hash 均在选择文件逐项保存。

此处的签名应用只表示来源审查与机器基线更新。下列 37 项和全部历史目视项均未由 Owner 验收。距离是应用前的实测 meanAbsolute/maxCell，不是应用后的回归计数。

| Story @ 视口 | K12 / 来源组 | mean / maxCell | >40 | 目视 |
| --- | --- | --- | --- | --- |
| `actions-matrix@desktop-1440x900` | D / 后增16 | 101.297 / 226 | 是 | [ ] |
| `actions-matrix@mobile-390x844` | D / 后增16 | 12.418 / 73 | 是 | [ ] |
| `actions-matrix@tablet-1024x768` | D / 后增16 | 100.129 / 226 | 是 | [ ] |
| `brand-matrix@desktop-1440x900` | D / 后增16 | 6.73 / 49 | 是 | [ ] |
| `brand-matrix@mobile-390x844` | D / 后增16 | 13.957 / 107 | 是 | [ ] |
| `brand-matrix@tablet-1024x768` | D / 后增16 | 7.102 / 52 | 是 | [ ] |
| `color-palette@desktop-1440x900` | A / 原19 | 1.488 / 12 | — | [ ] |
| `color-palette@tablet-1024x768` | A / 原19 | 1.711 / 17 | — | [ ] |
| `frontend-shell-slice@desktop-1440x900` | A / 原19 | 18.117 / 127 | 是 | [ ] |
| `frontend-shell-slice@mobile-390x844` | A / 原19 | 10.348 / 79 | 是 | [ ] |
| `frontend-shell-slice@tablet-1024x768` | A / 原19 | 15.012 / 142 | 是 | [ ] |
| `icon-matrix@desktop-1440x900` | D / 后增16 | 6.5 / 33 | — | [ ] |
| `icon-matrix@mobile-390x844` | D / 后增16 | 4.047 / 40 | — | [ ] |
| `icon-matrix@tablet-1024x768` | D / 后增16 | 4.883 / 28 | — | [ ] |
| `inputs-matrix@desktop-1440x900` | D / 后增16 | 8.703 / 141 | 是 | [ ] |
| `inputs-matrix@mobile-390x844` | D / 后增16 | 4.398 / 19 | — | [ ] |
| `inputs-matrix@tablet-1024x768` | D / 后增16 | 11.176 / 159 | 是 | [ ] |
| `interaction-disclosure-spec@desktop-1440x900` | A / 后增16 | 0.258 / 15 | — | [ ] |
| `interaction-disclosure-spec@tablet-1024x768` | A / 后增16 | 0.293 / 15 | — | [ ] |
| `navigation-focused-shells-spec@desktop-1440x900` | A / 原19 | 0.645 / 15 | — | [ ] |
| `navigation-product-shell-spec@desktop-1440x900` | A / 原19 | 0.215 / 15 | — | [ ] |
| `navigation-product-shell-spec@tablet-1024x768` | A / 原19 | 0.887 / 15 | — | [ ] |
| `owner-quality-product-shell@desktop-1440x900` | A / 原19 | 21.914 / 131 | 是 | [ ] |
| `owner-quality-product-shell@mobile-390x844` | A / 原19 | 16.863 / 96 | 是 | [ ] |
| `owner-quality-product-shell@tablet-1024x768` | A / 原19 | 22.254 / 143 | 是 | [ ] |
| `shell-intro@desktop-1440x900` | C / 新2 | 0.43 / 11 | — | [ ] |
| `shell-intro@mobile-390x844` | C / 新2 | 3.043 / 17 | — | [ ] |
| `shell-intro@tablet-1024x768` | C / 原19 | 1.066 / 11 | — | [ ] |
| `shell-narrow@desktop-1440x900` | C / 原19 | 1.188 / 16 | — | [ ] |
| `shell-narrow@mobile-390x844` | C / 原19 | 0.633 / 10 | — | [ ] |
| `shell-narrow@tablet-1024x768` | C / 原19 | 1.41 / 15 | — | [ ] |
| `shell-top-band@desktop-1440x900` | C / 原19 | 54.047 / 229 | 是 | [ ] |
| `shell-top-band@mobile-390x844` | C / 原19 | 52.352 / 228 | 是 | [ ] |
| `shell-top-band@tablet-1024x768` | C / 原19 | 55.246 / 229 | 是 | [ ] |
| `typography-matrix@desktop-1440x900` | D / 后增16 | 6.535 / 56 | 是 | [ ] |
| `typography-matrix@mobile-390x844` | D / 原19 | 5.867 / 23 | — | [ ] |
| `typography-matrix@tablet-1024x768` | D / 后增16 | 7.238 / 36 | — | [ ] |

当前已采纳的局部口径也需目视核对：DS 日间标按钮 hover/open 后缀 #505fc1；有描边文本控件边框 ≥3.1，两个无边 SearchInput 不适用该边框项；Icon 使用选中洗色；八格 Brand 使用正式产品映射；Highlight 原始绝对差 ≤1/64 CSS px；选中 ShellPins 与 Tabs 为日6%／夜7%。标按钮 hover/open 的日3.5%／夜4% 由 D03 既有裁定保留；Sheet 的「自底升起」文字按 R6 D7 仅同步正文、维持实现，目视确认实际淡入效果。旧52px 收起布局条款随顶带壳替代，不恢复该退役布局。

Owner于2026-11-02采纳包归属差集0，见TCRN-DS-MIN-20261102-CSS-OWNERSHIP D1–D3：通过151映射当前有效128目标与首条，保留55个无独立CSS规则的包内来源项、文档模板限制与包外类负控。现有渲染和检查器保持；原128终态及其他判据不重写。M30现为navigation/shell块数11/19，组件10/11与27行保持。

图钉“可见名五语同源”的文字与当前纯图标 / aria-label 形式已集中交 Owner 澄清；确认前不代签这一完整目标。无关的 LineNumberedEditor invalid-focus 青色 outline 观察只进入范围外问题清单，不改写 STORY-126 的已验收范围。

## 第六轮新增与变化的目视项

以下为本轮新改或此前已批准事项的目视清单，未勾选即未验收。

| 核对项（只能目视） | 看哪里 | 浅色 | 夜间 | 来源 |
| --- | --- | --- | --- | --- |
| `markText`：一行从首行大写顶部量到基线；两行锁定块从首行大写顶部量到第二行基线，±1；留意标与字标的视觉中线，不主观下移字形 | Shell 标按钮、完整菜单及锁定块 | [ ] | [ ] | R6 MARKTEXT、SUB-230/231（M55） |
| TMS 后缀浅色 #2c63c8、夜间 #7aa0f5；确认悬停底上仍清晰，夜间待裁豁免已撤 | Brand 产品标、标按钮、壳层 | [ ] | [ ] | R6 D4、SUB-232 / SUB-239（M56） |
| `presentation="auto"` 随自身 ProductShell 容器切换：1024 宽、1023 窄；Sheet 在 760、761 非 Sheet；显式 `version` / `presentation` 保持优先 | 壳嵌入文档与窄屏 / 手机画面 | [ ] | — | SUB-234（M57） |
| 级联越过右缘时向左打开；新屏 `ts-drop-start-l` 检查菜单方向、列间距和纸内可见性 | `shell-top-band` 下拉级联画面 | [ ] | [ ] | SUB-233、S4 新屏（M59） |
| 标按钮最小宽 134，长字标完整伸展，不截断、不出现 title | Design System 与 Mana Orchestrate 长字标 | [ ] | [ ] | SUB-238（M58） |
| 粗指针下未固定 pin 静止时可见且为 ink-3；细指针行为不变 | Icon pin 与壳层固定项 | [ ] | — | SUB-235（M60） |
| Inputs 只读框聚焦时显示焦点环但保留只读底色与字色；搜索快捷键为 ink-2 | Inputs 只读 + 聚焦样片、SearchInput | [ ] | [ ] | SUB-236 |
| Icon pin 未固定为描边、固定为实心；固定态是唯一填充例外 | Icon 板两种 pin 样片 | [ ] | [ ] | SUB-237（M61） |
| AOS 两个示例保留页内内容并使用 Design System 名称与标；不生成 AOS 标钮、fallback API 或新 token | AOS contract example 与 `navigation-product-shell-spec` | [ ] | — | SUB-240（M61） |

## D8 维持项与方向（逐项列入目视）

| 项目 | 维持现状 | 方向 / 目视重点 | 状态 |
| --- | --- | --- | --- |
| O-7 | 文档站默认头像、目录宽 144 | 核对头像与目录裁切表现 | [ ] |
| O-10 | 头像菜单几何 | 按当前实现目视，无新数值推断 | [ ] |
| O-12 | 下拉不显示 ⌘K | 确认下拉中不显示 | [ ] |
| O-13 | 纸升起 10 | 维持现值 | [ ] |
| O-15 | Sheet 夜间遮罩与下一级 | 维持现状，等设计会话给值 | 待设计会话 |
| O-16 | 页标题行高 30 | 维持 30 | [ ] |
| O-17 | TreeNav 只用于消费方的下拉或浮层 | 维持现有归宿，不用于 ProductShell 菜单 | [ ] |

O-18 已由 `test-dom` 门落实（MIN-20261016-GATES D1）。STORY-150 由实施会话按机器判据判定；Owner 在交付后进行目视。

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
| 标题 1 至 3 级为衬线 400，字号行高按契约（page 36/40、heading-2 26/30、heading-3 与 section 20/26）；标题 4 级为 Hanken Grotesk 600、13/20；单行，溢出出省略号，悬停可见全文 | [ ] | [ ] |
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
| pin 两态：未固定为描边，已固定为实心；实心是唯一填充例外。完整菜单行与分组标题右端是 24 槽的图钉钮，与 A 段 pin 两行一致（SUB-237） | [ ] | [ ] |
| 16px 下描边 1.25，sm、md、lg（14、16、20）三档描边粗细相同 | [ ] | [ ] |
| 图标跟随所在文字的颜色，状态格换色与宿主一致 | [ ] | [ ] |
| 复制按钮四个结果态图标（copy、check、alert-triangle、info） | [ ] | [ ] |
| loader-circle 转动、减少动态效果时停止（静态文档不播放动效，需在 Track A 看） | [ ] | [ ] |
| 项目列表样板换成顶带壳后与 D 段两屏一致 | [ ] | [ ] |

## 4 · 04 品牌 Brand · 产品标（`Brand.dc.html`）

对照：A–E 四枚标（大图、尺寸阶梯、贴片、单色版、锁定块）、F 构法、G 颜色、H SVG 源、I 标语。本板 D 段已有浅色与夜间的「组合样板 · 顶带壳」；品牌在壳里的标三版同时见 07a 第 1 段，产品页样板映射见第 7 节。

| story id | 页面 | 映射行 |
| --- | --- | --- |
| `brand-matrix` | `components-gplus-matrices.html#brand-matrix` | brand.A、brand.B（10 格）、logos.A-E、logos.I |
| `brand-sample-product` | `components-gplus-samples.html#brand-sample-product` | brand.D、compositions.1.brand（07a 第 1 段） |

机器判据已覆盖：八个产品标文件的 digest、包导出与渲染字节（`brand-asset:proof`）；字标对比度（`tokens:proof`；第四轮记录的夜间 TMS pending 豁免已由 R6 D4 撤回，现行颜色见 M56）；映射报告 brand 与 logos 各行。

| 核对项（只能目视） | 浅色 | 夜间 |
| --- | --- | --- |
| TMS 为双臂高举的艺人；Einzbern 为接住一点光的盃；Mana Orchestrate 为两结点一道流；Design System 为四色版面；实心几何、两色平涂、48 格（2026-10-11 纪要 D5） | [ ] | [ ] |
| 字标：TCRN 为墨色；TMS 后缀浅色 #2c63c8、夜间 #7aa0f5（R6 D4），Design System 后缀 #6577f3；渐变文字已停用，TMS 夜间待裁豁免已撤 | [ ] | [ ] |
| Einzbern、Mana Orchestrate 为衬线整名加「by TCRN」 | [ ] | [ ] |
| 单色版跟随文字色；壳里只用彩色标，不用单色版、不用半透明（D2） | [ ] | [ ] |
| ProductLogo 四个产品与 ProductLockup 的锁定块 | [ ] | [ ] |
| 标语（I 段）：TMS「艺人管理系统」、Einzbern「项目记忆引擎」、Mana Orchestrate「项目记忆助手」、Design System「设计系统」，其余四语与契约一致 | [ ] | [ ] |
| AOS 通过稿没有 AOS 标；两个 AOS 示例保留页内内容并使用 Design System 身份，不虚构 AOS 标、API、token 或导出（SUB-240） | [ ] | [ ] |
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

对照：第 1 段「标三版」；A 段三态 A1–A8（A1、A2 顶带态，A3、A4 完整菜单，A5、A6 固定二级菜单下拉含第三级级联，A7、A8 手机 390 顶带态与 Sheet）；B 段状态矩阵（66 格）；C 段登入动画。本板是字节真值（跨包约定 C-16）；R6 变化见第六轮目视项。

| story id | 屏名与板上对应 | 页面 |
| --- | --- | --- |
| `shell-top-band` | `ts-closed-l` / `ts-closed-n` = A1 / A2；`ts-x-l` / `ts-x-n` = A3 / A4；`ts-drop-l` / `ts-drop-n` = A5 / A6 | `components-navigation-shells.html#shell-top-band` |
| `shell-narrow` | `ts-narrow-l`（1023 宽，固定项收进菜单）、`ts-narrow-x-l`（同宽菜单打开）；板上没有单独一屏，规则见 A 段字幕「窄于 1024 整组收进菜单」 | `components-navigation-shells.html#shell-narrow` |
| `shell-mobile` | `ts-m-l` = A7；`ts-m-s` = A8 | `components-navigation-shells.html#shell-mobile` |
| `shell-matrix` | B 段 66 格（先浅色后夜间） | `components-navigation-shells.html#shell-matrix` |
| `shell-intro` | `ts-intro-l` = C 段 | `components-navigation-shells.html#shell-intro` |
| `brand-sample-product` | 第 1 段第二版在顶带里的样子 | `components-gplus-samples.html#brand-sample-product` |

机器判据历史读数：第四轮 `shell-measure` 的 markText 旧读数为红（DS 1.4、TMS 1.7，容差 ±1）。R6 按 `TCRN-DS-MIN-20261016-R6-MARKTEXT` 改为首行大写顶到基线的一行读法、两行锁定块量至第二行基线；四个产品首行均 ≤1，S2 记录 24 次真件运行均 ≤1。该历史读数不代表批末三道门结果；当前状态见「门与 Story 状态」。

| 核对项（只能目视） | 浅色 | 夜间 |
| --- | --- | --- |
| 第 1 段标三版：第一版纯标（手机顶带与最窄处）、第二版锁定块首行与标垂直居中（顶带标按钮）、第三版锁定块原样（登入卡）；全部取自 Brand 板，不重绘、不重排 | [ ] | [ ] |
| 顶带无底无线，在画布色上；标按钮最小宽 134、高 40、位置 (12, 6)，随完整字标增长，不截断也不加 title；空闲态彩色标 100%，悬停与打开为 3.5% 墨洗，示意朝上朝下随开合。字标一行从首行大写顶部量到基线，两行量到第二行基线，容差 ±1；不做视觉重心下移 | [ ] | [ ] |
| 固定项 32 高，与标按钮隐形边界及彼此间距都是 8，三处读数相等，没有分割线；选中只做 6% 墨洗加字重，没有左边条 | [ ] | [ ] |
| 粗指针下未固定的图钉在静止态可见、保持 ink-3；细指针态不变（SUB-235） | [ ] | — |
| 右上簇铃铛 32、头像 28，右缘等于纸右缘；纸离边 12、顶 52、圆角 14、s1 阴影 | [ ] | [ ] |
| 完整菜单（A3、A4）：顶 52、左 12、宽 952、搜索 40、三列、行 32；底栏的当前位置与锁定块只作装饰，没有收起钮；选中行 6% 墨洗加字重 | [ ] | [ ] |
| 固定二级菜单下拉（A5、A6）：接在项下 6、宽 240、内距 6、顶部搜索 28、行 32 无图标列；第三、四级同宽、高随左列，按点击展开；向右展开会越过视口右缘时，级联改从第一列左侧展开 | [ ] | [ ] |
| 浮层收起：点外部、Esc、选中即收，焦点回到触发键；图钉不收起菜单 | [ ] | [ ] |
| 自动状态按 ProductShell 自身容器宽切换：1024 为宽呈现、1023 为窄呈现；固定项整组收进菜单，标按钮收成纯标加示意。显式 version / presentation 优先 | [ ] | — |
| 手机（A7、A8）：顶带纯标加示意；Sheet 固定项在前、全部在后，行与搜索 44；自动 Sheet 在容器宽 760 生效、761 不为 Sheet。页面挂载后 390 宽打开即 Sheet，壳根 `data-state="sheet"` | [ ] | — |
| B 段矩阵：每格 fill 与 ink 成对，与板上数字一致；铃铛悬停为 6% 墨洗，已按板改，待目视（G-6） | [ ] | [ ] |
| C 段登入动画：登入卡第三版（标 128）收敛为顶带第二版（标 22），120 淡出、240 位移、100 纸升起，上限 700，只用 transform 与 opacity，每会话一次，减少动态效果时不播（页面挂载后每会话首载播放一次，同页再载不播；G-4 已改，待目视） | [ ] | — |
| 标按钮字标完整，不截断、不加 title；按钮宽度至少 134 并随字标增长。TMS 浅色后缀 #2c63c8、夜间 #7aa0f5，悬停时也检查层叠效果（SUB-238、R6 D4） | [ ] | [ ] |
| 文档页本身的顶带壳：完整菜单的分组与行、头像菜单里的产品切换、主题与语言，纸内目录（zh-CN 下 Change Log 的译名与菜单行说明见 G-8、G-9） | [ ] | [ ] |
| 固定项拖排（1024 及更宽的顶带）：拖动固定项就地换位，没有插入线、拖影、把手，拖动中光标为 grabbing；松手不打开下拉、不跳链接；Alt+← / Alt+→ 移动获焦项，焦点环跟着该项（G-12，待目视） | [ ] | — |

## 8 · 07b 壳层（下）· 几何、契约、token、门（`Shell-2.dc.html`）

对照：D 几何（真实屏幕加标尺，表为关系断言）、E 消费方契约、F 与 G+ 底盘的 token 差异、G 门。本板是字节真值，本批没有改。

看哪些 story：D 段的几何在第 7 节的 `shell-top-band`、`shell-mobile` 上看；E、F、G 三段没有渲染面，落点分别是 `docs/migration-4.0.md` M20 至 M61（消费方要做什么；⌘K 见 M41、M52）、`packages/ui-tokens/src/tokens.css` 的壳层与登入动画 token（值见 M24）、`scripts/shell-measure-proof.mjs` 的 18 门与 `tests/fixtures/geometry-measure/shell/mutations.json` 的变异。

机器判据历史读数：第四轮 D 段 12 行关系断言中，标按钮（v2）一行与旧 markText 方法同根而红；R6 新测量按 ±1 方法执行，当前批末三道门状态仍为「待批末」。引导列探针和其余旧读数保留在既有门报告，供历史追溯，不作为本清单批末验收结论。

| 核对项（只能目视） | 浅色 | 夜间 |
| --- | --- | --- |
| D 段标尺读数与 `shell-top-band` 各屏一致：顶带 52、标按钮 134 × 40 在 (12, 6)、固定项 32、间距 8、行中线 26、纸离边 12；量过的数以壳层门报告为准，目视只看有没有明显偏差 | [ ] | [ ] |
| E 段消费方契约读起来与 `docs/migration-4.0.md` M20 至 M61 的做法一致（菜单模型四级、`pageHeader` 必填、固定项偏好由产品后端保存、⌘K 每个壳一次，见 M41、M52） | — | — |
| F 段 token 差异表与 4.0.0 的 token 一致：新增 20 个（16 个壳层尺寸、4 个登入动画时长），`--tcrn-shell-topbar-height` 为指向顶带高的弃用别名，两个旧宽度 token 弃用且没有替代，小面板宽撤销、不新增；第二轮新增 `--tcrn-shell-mark` 22、`--tcrn-shell-touch` 44、`--tcrn-shell-crumb-icon` 11 与第三轮新增 `--tcrn-shell-chevron` 12、`--tcrn-shell-locale-chevron` 11、`--tcrn-shell-mark-lg` 44 对照时标记为后续设计会话待补项 | — | — |
| G 段门表与本批实际接入的门一致（`geometry:measure` 串入壳层 18 门，CI 经 `pnpm verify` 跑到） | — | — |

## 第三轮新增与变化的目视项

本节保留第三至第五轮的全部历史目视条目；历史读数与状态留作来源记录。若与第六轮裁定或现行清单冲突，以本清单第六轮项和 D8 表为准。


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

## 第六轮早期视觉签名离群（历史）

S9 本次没有接受签名。下表只转列 S7 历史回归中的 9 条 maxCell > 40 项；分类沿用第四轮同键 K12 分类，主题与语言沿 S7 记 unknown，不冒充 S9 新测。其余 7 条历史回归及 S2/S4 同键来源见 S9 交回与 scratch/signature-disposition.json。所有项留待批末判断。

| Story / 画面 | 主题 / 语言 / 视口 | 差异 | 来源提交 / 预期依据 | S9 处置记录 |
| --- | --- | --- | --- | --- |
| `shell-top-band` | unknown / unknown / desktop-1440x900 | 历史 mean 54.047 / maxCell 229 > 40；K12 C | S4 容器/新增屏（SUB-233/234）及 S7 SUB-238/239 候选；保留 S4 归属 | 未接收；新 proof 缺失且既有 axe/height 红未处置 |
| `frontend-shell-slice` | unknown / unknown / desktop-1440x900 | 历史 mean 18.117 / maxCell 127 > 40；K12 A | S7 SUB-240 c9c7f0c 撤 AOS 顶带及 SUB-238 文档顶带；只作候选 | 未接收；新 proof 缺失且既有 axe/height 红未处置 |
| `owner-quality-product-shell` | unknown / unknown / desktop-1440x900 | 历史 mean 21.914 / maxCell 131 > 40；K12 A | S7 SUB-240 c9c7f0c 撤 AOS 顶带及 SUB-238 文档顶带；只作候选 | 未接收；新 proof 缺失且既有 axe/height 红未处置 |
| `shell-top-band` | unknown / unknown / tablet-1024x768 | 历史 mean 55.254 / maxCell 229 > 40；K12 C | S4 容器/新增屏（SUB-233/234）及 S7 SUB-238/239 候选；保留 S4 归属 | 未接收；新 proof 缺失且既有 axe/height 红未处置 |
| `frontend-shell-slice` | unknown / unknown / tablet-1024x768 | 历史 mean 15.012 / maxCell 142 > 40；K12 A | S7 SUB-240 c9c7f0c 撤 AOS 顶带及 SUB-238 文档顶带；只作候选 | 未接收；新 proof 缺失且既有 axe/height 红未处置 |
| `owner-quality-product-shell` | unknown / unknown / tablet-1024x768 | 历史 mean 22.254 / maxCell 143 > 40；K12 A | S7 SUB-240 c9c7f0c 撤 AOS 顶带及 SUB-238 文档顶带；只作候选 | 未接收；新 proof 缺失且既有 axe/height 红未处置 |
| `shell-top-band` | unknown / unknown / mobile-390x844 | 历史 mean 52.363 / maxCell 228 > 40；K12 C | S4 容器/新增屏（SUB-233/234）及 S7 SUB-238/239 候选；保留 S4 归属 | 未接收；新 proof 缺失且既有 axe/height 红未处置 |
| `frontend-shell-slice` | unknown / unknown / mobile-390x844 | 历史 mean 10.348 / maxCell 79 > 40；K12 A | S7 SUB-240 c9c7f0c 撤 AOS 顶带及 SUB-238 文档顶带；只作候选 | 未接收；新 proof 缺失且既有 axe/height 红未处置 |
| `owner-quality-product-shell` | unknown / unknown / mobile-390x844 | 历史 mean 16.863 / maxCell 96 > 40；K12 A | S7 SUB-240 c9c7f0c 撤 AOS 顶带及 SUB-238 文档顶带；只作候选 | 未接收；新 proof 缺失且既有 axe/height 红未处置 |

## 待发布的成品板（交设计会话）

仓内副本仍待设计会话发布；列表覆盖成品标准的全部八块板。发布状态不由本清单或 S8 推定。

| 成品标准板 | 仓内文件 | 本轮关联来源 | 当前状态 |
| --- | --- | --- | --- |
| 01 Tokens | `docs/design/visual-standard/boards/Tokens.dc.html` | R6 画布与 token 同步 | 待设计会话发布 |
| 02 Typography | `docs/design/visual-standard/boards/Typography.dc.html` | SUB-239（7190a0b） | 待设计会话发布 |
| 03 Icon | `docs/design/visual-standard/boards/Icon.dc.html` | SUB-237（725fe0d） | 待设计会话发布 |
| 04 Brand | `docs/design/visual-standard/boards/Brand.dc.html` | SUB-232、SUB-239 | 待设计会话发布 |
| 05 Actions | `docs/design/visual-standard/boards/Actions.dc.html` | SUB-239（7190a0b） | 待设计会话发布 |
| 06 Inputs | `docs/design/visual-standard/boards/Inputs.dc.html` | SUB-236（044fefe） | 待设计会话发布 |
| 07a Shell | `docs/design/visual-standard/boards/Shell.dc.html` | R6 壳层重生与 SUB-239 | 待设计会话发布 |
| 07b Shell-2 | `docs/design/visual-standard/boards/Shell-2.dc.html` | R6 壳层重生与 SUB-239 | 待设计会话发布 |

供发布核对的源板与元数据：`V2-GPlus.dc.html`；`V2-B1-Brand.dc.html`、`V2-B1-Typography.dc.html`、`V2-B1-Icon.dc.html`、`V2-B1-Actions.dc.html`、`V2-B1-Inputs.dc.html`；`V2-B2-Shell-Draft2.dc.html`、`V2-B2-Shell-Draft2-b.dc.html`；`docs/design/gplus-2026-10/boards/canvas.json`、`docs/design/visual-standard/canvas.json`、`docs/design/visual-standard/heights.json` 与 `docs/design/gplus-2026-10/measure-shell.js`。`measure-shell.js` 的 R6 markText 读法来自 SUB-230/231；其余板源与生成提交见上表及 S1–S7 handoff。

## 已知问题和未决输入

R6 各包问题完整保留在 `runs/r6/problems/S1.md` 至 `S7.md`；本包新增问题见 `runs/r6/problems/S8.md`。S4 的 P1–P7、S7 的 P1–P6 与其他包问题仍待批末处置，不在本清单重开或改写。O-15 等设计会话输入见 D8 表；Owner 决定由 Owner 另行记录。

## 发布停点

推送 main、打 tag、发布 npm 包、部署静态文档是独立 Owner 停点。当前清单不声称其中任何一步已发生或获准。

| 停点 | 状态 |
| --- | --- |
| 推送 main | 未推送 |
| 打 tag（v4.0.0） | 未创建 |
| 发布（npm 三包 4.0.0） | 未发布 |
| 部署（4.0.0 静态文档） | 未部署 |
