# R3 批末验收 · 分片 A：EPIC-044 壳层 Shell（STORY-135 至 141）

节行号：§0 L5；§1 L17；§2 L33（2.1 L35，2.2 L47，2.3 L61，2.4 L72，2.5 L87，2.6 L99，2.7 L119，2.8 L130，2.9 L143）；§3 L160；§4 L178；§5 L198；§6 L223

## 0. 被验对象与方法

- 被验：集成分支 `claude/init016-tab-shell`，工作树 HEAD `463ede0`。`git diff --name-only c45c529 HEAD` 只有 `docs/dispatch/**` 6 个文件，代码等于批末 verify 所在的 `c45c529`。
- 读的产物：verify 03 构建的各包 `dist`（15:27），以及之后 `storybook:build`（`storybook-build.exit` 为 0，15:35）产出的 `apps/storybook/storybook-static/`。两者都没有重建。
- 门证据：verify 逐段日志在会话 scratch `r3-verify/`，引用写 `NN log:行号`。18 log 里壳层门的夹具段从 7380 行起，真件段（`mode: stories`）从 8221 行起。
- 自写只读探查在会话 scratch `acc-r3-A/`（脚本在 `probe/`，不入仓）。用 Playwright 起本地静态服务打开 `components-navigation-shells.html`，等全部 `[data-shell-hydrate]` 块写上 `data-shell-hydrated` 后再读：
  - `geom.json`：沿用 R2 的几何脚本，视口 1440（en、zh-CN）、1023、390。
  - `behave3a.json`：⌘K（不带参数，以及带 `shell-shortcut=ts-closed-l`）；菜单与下拉的点击、按键、悬停 600ms 与级联；390 宽；登入动画（初始化脚本记录 `Element.animate`，刷新一次，另开 `reducedMotion: reduce`）。
  - `behave3b.json`：指针拖排、Alt+→ 与刷新后的顺序；头像菜单里的产品；纸内滚动区与头像的焦点环（截图逐边取样，浅色与夜间）；axe 地标规则；读回句的五种语言；标按钮悬停态与开态的底色及后缀对比度；图标尺寸；下拉搜索。
  - `pin7.json`：在受控屏上钉第 7 项。`docmain.json`：文档壳的地标名；文档壳纸内滚动区获焦后、滚动后的取样；不注册 ⌘K 的屏的提示。`axe-default.json`：整页 axe，规则配置与 browser-proof 相同。截图在 `shots/`。
- 没有重跑门，没有构建，没有写链，也没有跑包内测试（含 `test:dom`）。判定人写有 Owner 目视的项只给机器判据结论，不代签。

## 1. 一览

| Story | 结论 | 未满足或部分的 GWT | 返工项数 |
| --- | --- | --- | --- |
| STORY-135 壳 token | 阻塞于 Owner | GWT4：`contract:static` 退出 1，只剩 C8 一族 15 条（13 log:91、100、214–216）。R2 的测试不变式红已收。新红来自 SUB-191 把顶带登记为 C8 工具栏：板上的让步项最小宽是 0，没有固定项的壳也不渲染让步项。这条判据 R2 已返工过（A2-7 → R3-6），本轮仍不满足，按约定交 Owner（§4 第 1 条） | 0 |
| STORY-136 标按钮 | 阻塞于 Owner | GWT3：夜间后缀 3.07，与 R2 相同，待 D7（O-8）。其余 GWT 与符合性满足；R2 判断记的示意钮字面值 16 已改为 token | 1（A3-1，与 141 同条） |
| STORY-137 固定项 | 满足（机器判据） | 无。GWT3 本轮第一次在文档页实测（钉第 7 项） | 0 |
| STORY-138 完整菜单 | 满足（机器判据） | 无。A2-4（⌘K 一次打开多个壳）、A2-8（快捷键格的对比度门）已收。硬线「标旁文字中线」：底栏锁定块 en 1.7 仍红，只等 O-4 | 0 |
| STORY-139 下拉与级联 | 满足（机器判据） | 无。SUB-180 加了 3 条 DOM 用例；批末不跑 test:dom（O-18），只有包的自报读数。O-3 仍待裁 | 0 |
| STORY-140 ProductShell 顶带态 | 满足（机器判据） | 无。R2 列的五条返工（A2-1、2、3、5、6）都已收。门侧缺口一处：纸内滚动区的焦点探针在真件上读数为 0（A3-2） | 1（A3-2） |
| STORY-141 登入动画 | 满足（机器判据） | 无。读回句五语齐。飞行标的 data-logo 仍写产品键（A3-1） | 1（A3-1，与 136 同条） |

返工共 2 条，都是经济档（A3-1、A3-2），没有主力档。另有交 Owner 的阻点 1 个（C8），是新出现的。

库门 S-1 仍未声明（main.md M1），七张 Story 都不能在链上转 done，这与本结论无关。

## 2. 逐 Story

### 2.1 STORY-135 壳 token（SUB-178 M4）

| GWT / 判据 | 结论 | 证据 |
| --- | --- | --- |
| GWT1 tokens.json 对 07b F 段 | 满足 | 05 log:15「section F, one to one, plus the three R2 and three R3 additions」通过。F 段的值在 `tokens.css:118–121、125–140`（122–124 是三个弃用别名）。R3 新增 `shell.chevron` 12、`shell.locale-chevron` 11、`shell.mark-lg` 44（`tokens.css:144–146`），在主题无关块。F 段还没有 R2 的三条与 R3 的三条，待设计会话补登（R2 判断 §3.2，M4 交回第 8 节）；补登之前，目的锚的「1:1」差这六条 |
| GWT2 几何不随主题变 | 满足 | 06.02 log「C5 theme blocks declare the same 85 properties」。新增三条只在主题无关块；粗指针块 `tokens.css:242–246` 只把两个名改指 `shell.touch` |
| GWT3 旧名经弃用别名 | 满足（无回退） | `tokens.css:122–124` 的三个旧名仍能解析；05 log:18；06.06 6/6 |
| GWT4 tokens:proof 与 contract:static 退出 0 | 阻塞于 Owner | tokens:proof 06.01–06.12 全部退出 0。contract:static 退出 1：`node --test` 74/74（13 log:79–82），门脚本跑到了最后，红的只有 C8 15 条（`yield-without-min-width` 1 条、`story-yield-missing` 14 条，都在 shell 家族；13 log:100、214–216）；C2、C5、C6、C7、C11、C13 绿。根因：板上 `.ts-pins{…min-width:0;flex:0 1 auto}`（`Shell.dc.html`、`Shell-2.dc.html`），包件照抄（`shell.css.ts:168` `min-inline-size: 0`），而 C8 要求非零最小宽（`clauses.md:106、111`）；没有固定项的壳由 `ShellPins.tsx:184` 返回 null，14 个工具栏里没有让步项（`clauses.md:117`）。补样式修不了 |
| 符合性：不新增组件内几何字面值 | 满足 | 铃铛 `size="lg"`（`Navigation.tsx:2312`）、无账户头像 `size="sm"`（:2328）、示意钮 `size="md"`（`ShellBrandButton.tsx:98`）。三处 12 用 `shellChevronSize`，它在模块加载时从 `tcrnTokens` 读 `--tcrn-shell-chevron`（`ShellMenu.tsx:78–85、306、829`，`ShellPins.tsx:61–68、338`）。语言箭头 `base.css.ts:547–548` 读 `var(--tcrn-shell-locale-chevron)`。`brand.css.ts:161、168、214` 改读 mark-lg 与 mark；第 20、33 行的 38、28 属第一批，未动（R2 判断 §3.3）。五个壳件里 `size={数字}` 为 0 处；06.10 log `shellGeometryLiterals: 0`；05 log:230 的单测读渲染尺寸。实测（`behave3b` L_sizes、G_products）：铃铛 20、示意钮 16、固定项箭头 12、下一级箭头 12、底栏分隔符 12、头像图标 14、语言箭头 11 |

SUB-178：自报与实测一致。判据⑥里「contract:static 退出 0」不成立，只剩交 Owner 的 C8。M4 交回写的是 18 条；批末是 15 条，因为 M9 退役了 owner-quality 的三个 collapsed 变体（9 个框降到 6 个，13 log:343–410）。steps.md 与 main.md M4 仍写 18 条，判断引用时以批末日志为准。

### 2.2 STORY-136 标按钮 ShellBrandButton（本轮只有 SUB-178 改示意钮）

| GWT / 判据 | 结论 | 证据 |
| --- | --- | --- |
| GWT1 left 12、top 6、134×40、中线 26 | 满足（无回退） | ts-closed-l：12 / 6 / 134×40，中线 26，en、zh-CN 相同（`geom.json`）。真件 24 个 run 的 brandGeometry 都 pass（18 log:8237–8256）；变异 story-brand-top-0 turns red |
| GWT2 标 digest = logos2 | 满足 | brandDigest 在全部真件 run 里 pass（shell-top-band 查了 33 项）；14 brand-asset:proof 退出 0。另有一个潜在缺口：标按钮的 `data-logo` 写的是产品键，DS、Mana 的标按钮会被门找错源，见 A3-1 |
| GWT3 hover / open 3.5% 墨洗、后缀 ≥ 4.5、空闲透明 | 阻塞于 Owner（夜间） | 真实悬停：浅色底 rgba(22,21,15,.035)，后缀 4.53；夜间 rgba(235,232,223,.04)，后缀 3.07。开态（ts-x-l、ts-x-n）取同样的值。空闲时底透明，后缀 4.85，标 opacity 1（`behave3b` K_*）。读数与 R2 相同，待 D7（O-8） |
| GWT4 Esc 后焦点回标按钮 | 满足 | ts-closed-l：点开以后焦点在菜单搜索框，Esc 后 `aria-expanded=false`，activeElement 回到标按钮（`behave3a` C_afterEsc、B_afterEsc）。真件 focusLoop 的 afterEscape 读 "tab"（18 log:12220、12270）；变异 story-focus-not-returned turns red |
| GWT5 390 宽只显示标与示意、可点、高 ≥ 40 | 满足（无回退） | 390 宽：64×40，`data-shell-brand="v1"`；点击后打开 Sheet（`behave3a` D_phoneAfterClick）。1023 宽同为 v1、64×40 |
| 符合性：圆角 8、无轮廓、示意 20 / chevron 16、标 22、字标 12.5/600 | 满足 | 圆角 8，outline none；示意格 20×20，内含 16×16 的图标（现由 Icon 的 md 档给出）；标 22×22；字标 12.5px / 600（`geom.json`） |
| 符合性：字标墨迹中线 = 标中线 | 满足 | markText 在标按钮各项全过；本轮的失败只落在底栏锁定块（lkr）与 DS 首行（lkr-line），见 2.4 与 2.8。报告 dSection 的「标按钮（v2）」行显示 fail（18 log:12693），是因为这一行挂了 markText 门，红来自别的锁定块，不是标按钮 |

本轮 136 只有示意钮这一处改动，自报与实测一致。

### 2.3 STORY-137 顶带固定项 ShellPins（本轮只有 SUB-178 改箭头）

| GWT / 判据 | 结论 | 证据 |
| --- | --- | --- |
| GWT1 三处间距 8、每项 32、中线 26 | 满足（无回退） | 1440 en：146→154、210.77→218.77、312.69→320.69、404.03→412.03。zh-CN：146→154、199→207、270→278、335.5→343.5。四个间距都是 8；每项 top 10、高 32、中线 26（`geom.json`）。pinSpacing pass |
| GWT2 分割线 0；加回左边线判红 | 满足 | 顶带里的细线与左右边线都是 0；变异 story-pins-left-line turns red |
| GWT3 7 项只显示 6，第 7 项在菜单里带已固定标记 | 满足（本轮实测） | 在受控屏 ts-closed-l 上钉 Teams、Live streams、Events。偏好 `tcrn-shell-pins:tms` 存了 7 个 id，顶带只显示前 6 个，刷新后不变；第 7 项 Events 在完整菜单里是「Unpin from top bar: Events」（aria-pressed）（`pin7.json`）。R2 时文档页上没有能这样测的屏 |
| GWT4 1023 宽顶带无固定项、菜单有「已固定」分组 | 满足 | 1023 宽：固定项组 display none；ts-narrow-x-l 面板里「已固定」组可见；1440 宽不显示（`geom.json`） |
| GWT5 选中 6%、600、无左边条、对比度等于 B 段 | 满足 | Roster：浅色底 .06、夜间 .07，字重 600，border-left 0（`geom.json`）。真件 contrast 门全部 pass（R2 的 srch-kbd 红已由 SUB-207 收掉） |
| 符合性：hover 3.5%、右上簇 | 满足 | Statements 的悬停预览为 .035。铃铛 32、头像 28、中线 26；簇右 994 = 纸右 994（1023 宽 897，390 宽 288）。固定项箭头已改用 token（SUB-178） |

### 2.4 STORY-138 完整菜单 ShellMenu（SUB-179 M7）

| GWT / 判据 | 结论 | 证据 |
| --- | --- | --- |
| GWT1 top 52、left 12、width 952、接续 6 | 满足（无回退） | ts-x-l：12 / 52 / 952×290，52 − 46 = 6，en、zh-CN 相同（`geom.json`）；continuation pass |
| GWT2 收起钮 0；锁定块不是按钮、不在 Tab 序列 | 满足 | 面板里可见按钮 15 个，都是图钉钮；锁定块是 `div[role=img]`，tabIndex −1，可聚焦后代 0。noCollapse、lockupDecor pass；变异 story-x-button-back 与 story-lockup-as-button 都 turns red |
| GWT3 底栏锁定块上下留白相等 | 满足 | 底栏 290–342（上边线 1px），锁定块 294.5–338.5，上下留白各 3.5；右缘 948 = 964 − 16；barCentering pass |
| GWT4 ⌘K 聚焦搜索、Esc 回标按钮、点外部关闭 | 满足（A2-4 已收） | 不带参数时，同页按 Ctrl+K 或 ⌘K，新打开的只有文档壳（expanded 列表只多了 page/doc，其余 5 个本来就是静态开屏），焦点在文档壳搜索框，Esc 后回到文档壳标按钮。带 `?shell-shortcut=ts-closed-l` 时只打开 ts-closed-l，焦点在它自己的搜索框，Esc 回它的标按钮，文档壳不开（`behave3a` A_*、B_*）。点外部关闭（C_afterOutside）。门已收紧：只有焦点落在被测屏自己的搜索框才记 "search"，落在别的壳记 "search:other-shell" 并判红（`shell-measure-proof.mjs:924、1015–1018`）；真件 en、zh-CN 都读 "search"（18 log:12221、12271）；新增两条单测（两个壳都注册判红，只开被测屏判绿）在 41/41 之内（18 log:7366–7367） |
| GWT5 阴影模糊 ≤ 3 | 满足 | 三层阴影的模糊为 [3, 3, 0]；shadowBlur pass；变异「面板阴影改 12px」turns red |
| 符合性：dialog 非模态、方向键、无产品清单 | 满足 | role=dialog，aria-modal=false。↓ 依次到 Roster、Teams、Contracts，→ 到第 2 列「All contracts」，← 回 Contracts（C_arrows）。菜单与锁定块里的产品项 0 |
| 符合性：每格对比度等于 B 段 | 满足 | 真件 contrast 门全部 pass；快捷键格按叠放取底色（SUB-207）后读 7.59 / 6.11 |
| 硬线：标旁文字中线（底栏锁定块） | 部分（只等 O-4） | lkr@22:tms 的 ink-mark 读 1.7，出现在 ts-x-l、ts-x-n、ts-search-l、ts-narrow-x-l 与 shell-matrix 的两处（18 log:8324–8336）；zh-CN 不红。与 R2 读数相同，是 O-4 的第二个读数 |

SUB-179：自报与实测一致（①②④）；③ 屏内 SectionTabs 的名已带屏名，文档页余下的同名分段导航由 M9 附录改为「Contract views」「Section tabs」「Segmented views」（`docmain.json` docLandmarks）。另见 §4 第 4 条：不注册 ⌘K 的屏，搜索框里仍画「Ctrl K」提示。

### 2.5 STORY-139 下拉与级联（SUB-180 M3）

| GWT / 判据 | 结论 | 证据 |
| --- | --- | --- |
| GWT1 left = 项 left、top = 项底 + 6、宽 240、搜索 28 | 满足（无回退） | 真实点击 ts-closed-l 的「Contracts」：下拉 left 435.77 = 435.77，top 491.53 = 485.53 + 6，宽 240（`behave3a` C_afterPinClick）。静态屏 ts-drop-l：218.77 = 218.77，48 = 42 + 6，搜索 228×28；zh-CN 207 = 207（`geom.json`） |
| GWT2 第二列 +4、宽 240、高等于第一列 | 满足 | 点「Templates」后第二列 left 679.77 = 675.77 + 4，宽 240，高 180 = 180；变异 story-column-2-height-auto turns red |
| GWT3 悬停 500ms 不出第二列 | 满足 | 真实悬停 600ms，级联列 0 |
| GWT4 ← 回同一行；Esc 全关、焦点回固定项 | 满足 | → 到「Signing contracts」，← 回「Templates」，第二列收起；Esc 后下拉与级联全关，焦点回「Contracts」（C_afterArrowLeft、C_afterDropEsc） |
| GWT5 下拉搜索只匹配子树 | 满足 | 「Templ」4 条，都在 Contracts › Templates 下；「Agency」1 条；「Roster」「Live」各 0 条（`behave3b` M_drop_*） |

SUB-180：`shell-dropdown.dom.spec.tsx:238、272、337` 新增三条用例，分别是：按固定层祖先定位且祖先平移后仍贴住项；顶带尺寸变化后重新定位，接续读 `--tcrn-shell-menu-gap`；第三列按 ← 回到上一列的打开行。组件没有改。批末 verify 不跑 test:dom（O-18），只有 M3 自报 56/56、M4 自报 58/58，本次没有运行（§6 第 1 条）。

### 2.6 STORY-140 ProductShell 顶带态（SUB-181 M2；SUB-182、183 M3；SUB-184、185 M4；SUB-186 M5）

| GWT / 判据 | 结论 | 证据 |
| --- | --- | --- |
| GWT1 顶带 52、无底无线；纸 52 / 12 / 14 | 满足（无回退） | 顶带 52，背景透明，四边边线 0，无阴影；纸 left 12、top 52，右、下各 12，圆角 14，阴影为 s1 两层；三个视口相同（`geom.json`）。strip、edges pass |
| GWT2 常驻侧栏与收起钮 0 | 满足 | 各屏侧栏 0；收起钮见 2.4 GWT2 |
| GWT3 第 7 项保存、顶带显示 6；拖排后顺序持久化 | 满足（A2-6 已收） | 受控屏 ts-closed-l：指针把 Roster 拖到 Statements 右侧，得到 Contracts、Statements、Roster、Schedule，localStorage 同值，重载后保留；在 Contracts 上按 Alt+→，得到 Statements、Contracts、Roster、Schedule，焦点留在 Contracts，重载后保留（`behave3b` F_*）。偏好经 `useProductShellController` 的 `productShellControlProps` 接入（`shell-hydrate.tsx:488–501`）。第 7 项见 2.3 GWT3 |
| GWT4 头像菜单含切换产品；菜单与锁定块无产品清单 | 满足（A2-6 已收） | ts-closed-l 的头像菜单里有 nav「Closed band · Switch product」，列 5 个产品，TMS 为 `aria-current=page`；ts-closed-n 的产品清单 0；完整菜单与锁定块的产品项 0（`behave3b` G_*） |
| GWT5 旧 prop 在类型层被拒、迁移说明有条目 | 满足（无回退） | `Navigation.test.tsx` 有 19 处 `@ts-expect-error`；02 typecheck 退出 0；迁移说明 M20（`migration-4.0.md:524`）、M21（:574）仍在 |
| 符合性：三缘对齐 | 满足 | 标按钮左 = 纸左 = 菜单左 = 12；簇右 994 = 纸右 994（1023 宽 897，390 宽 288） |
| 符合性：geometry:proof 退出 0（SUB-181） | 满足（A2-1 已收） | 10 log:5：searchOverlay 基线在浅色、夜间的碰撞都是 0，openMenus 14 = 14；原变异碰撞 1，判红（面板外部分为 843.56–1173 × 5802.53–5813.53）；「面板底透明」变异 clearPanels 1（rgba(0,0,0,0)），判红；两次复原都绿；redThenGreen 的 searchOverlay、searchClearPanel 都是红绿成立 |
| 符合性：shell:parity | 满足（A2-2 已收） | 11 log:5 ok true；行盒自检（包装右内距改 0）判红，复原后判绿 |
| 符合性：地标名按实例区分（SUB-184） | 满足（A2-3 已收） | 30.02 log:12 axeViolationCount 0。另在 en、zh-CN 的默认态与 ts-closed-l 菜单打开态各跑一次 axe landmark-unique，都是 0（`behave3b` I_*）。文档壳 header 名为「TCRN Design System · TCRN Design System shell controls」，品牌名重复一次（M4 问题 7，归 147），不影响唯一性 |
| 符合性：纸内滚动区焦点可见（SUB-182） | 满足（A2-5 已收）；门侧部分 | ts-closed-l 上从头像按 Tab 进入：`:focus-visible` 成立，box-shadow 为 inset 2px surface 加 inset 4px acc，圆角 14，透明 outline −2px。截图在四边各取距边 3px 的 5 个点：浅色全为 #0b6b65，夜间全为 #3fc7b7；失焦后同样的点读成纸色（`behave3b` H_light、H_dark，`shots/paper-focus-*.png`）。头像获焦时环下保留 1px 内细线。文档壳的纸内滚动区（可滚，1653 > 836）获焦时，顶、左、右三边可见，底边 25%、50%、75% 处被伸到纸边的 story 卡片盖住；滚到底以后改为顶边被盖（`docmain.json`，`shots/doc-main-focus-*.png`）。原因是 inset 阴影画在内容之下，M3 交回第 7 节已列为目视项。门侧：focusRingClipInPage 的夹具红绿成立，但真件只在 actions-matrix 上跑，regions 为 0（18 log:7240），纸内滚动区在真件上没有读数 → A3-2 |
| 符合性：O-1 撤出（SUB-183） | 满足 | 两个死名在 packages、apps、scripts、tests 下 0 处；06.01、06.11 退出 0；17 退出 0 |
| 符合性：⌘K 开关（SUB-185） | 满足 | `Navigation.tsx:2012、2152、2397`；README 第 328–336 行；迁移 M41；05 log:228 |
| 符合性：八项测量的 shellFrame | 满足 | 18 log 的 geometry-measure 段 ok true（log:88） |

各 Subtask：SUB-181、183、184、185、186 自报与实测一致。SUB-182 的 ①②④⑤ 达成，③ 只在夹具上有读数（A3-2）。SUB-184 加了两个导出件的 prop，按 B 类回显（§5 M4-1）。

### 2.7 STORY-141 登入动画 ShellIntro（SUB-187 M9）

| GWT / 判据 | 结论 | 证据 |
| --- | --- | --- |
| GWT1 三段 120 / 240 / 100，总 ≤ 700 | 满足（无回退） | 首载记到 8 段：卡 opacity 0–120；标 transform 120–360；首行容器 opacity 0–360；字标、示意、固定项、簇的 opacity 与纸的 opacity、transform 在 360–460；总长 460（`behave3a` E_introFirst）。真件 intro pass（durationMs 477 是挂钟读数） |
| GWT2 刷新不再播；去掉标记判红 | 满足 | sessionStorage `tcrn-shell-intro` 为 "played"；刷新后 0 段；变异 story-intro-no-session-marker turns red |
| GWT3 reduced-motion 0 次 | 满足 | `reducedMotion: reduce` 下 0 段，标记照写 |
| GWT4 动画中的标与 logos2 同源 | 满足 | shell-intro 4 个 run 的 brandDigest 都没有失败。飞行标的 `data-logo` 写产品键（`ShellIntro.tsx:336`），TMS 下与标 id 相同 → A3-1 |
| 符合性：只用 transform 与 opacity、不挡输入 | 满足（无回退） | 记到的属性只有 opacity、transform；ShellIntro 本轮未改 |
| SUB-187 读回句五语 | 满足 | en、zh-CN、ja、ko、fr 五个页面上都是本语言的句子（`behave3b` J）；30.02 的 zh-CN 新泄漏 0（log:44）；storybook 单测 14/14；17 退出 0 |

### 2.8 START 质量硬线（本分片涉及的八条）

| 硬线 | 结论 | 证据 |
| --- | --- | --- |
| 壳内常驻侧栏与收起钮 0 | 满足 | 2.6 GWT2、2.4 GWT2 |
| 顶带无底无线、中线 26 | 满足 | 2.6 GWT1；标按钮、四个固定项、铃铛、头像的中线都是 26 |
| 三处间距相等 | 满足 | 2.3 GWT1，en、zh-CN 都是 8 |
| 接续 6 | 满足 | 菜单 52 − 46；下拉 48 − 42（静态屏）与 491.53 − 485.53（真实点击）；zh-CN 相同 |
| 锁定块只装饰 | 满足 | 2.4 GWT2 |
| 品牌资产 digest | 满足（被量各处）；有潜在缺口 | 标按钮、底栏锁定块、飞行标的 brandDigest 都 pass，14 退出 0。同一页上锁定块写标 id（ds），标按钮写产品键（design-system），构建页里两种写法并存（`data-logo="ds"` 2 处，`"design-system"` 3 处）→ A3-1 |
| 标旁文字中线 | 部分（只等 O-4） | 标按钮全过。底栏锁定块 en 1.7（2.4），DS 首行 1.4（归 145）。steps.md 与 main.md M4 只写了 1.4，批末日志里 1.7 也还在（18 log:8324–8336）；两处同根，都等 O-4 |
| 登入动画只用 transform 与 opacity | 满足 | 2.7 |

### 2.9 R2 返工项复核（本分片 A2-1 至 A2-8，以及承接到本分片的 R3 项）

| R2 项 | R3 承接 | 结论 | 依据 |
| --- | --- | --- | --- |
| A2-1 searchOverlay 碰撞口径 | R3-4 / SUB-181 | 已收 | 2.6 geometry:proof 一行 |
| A2-2 parity 取样 | R3-5 / SUB-197 | 已收 | 11 log:5 |
| A2-3 地标重名 | R3-14 / SUB-184、SUB-179 ③、M9 附录 | 已收 | 30.02 axe 0；本次 axe 0 |
| A2-4 ⌘K 打开多个壳 | R3-16 / SUB-185、SUB-179 | 已收 | 2.4 GWT4 |
| A2-5 焦点环被纸裁掉 | R3-10 / SUB-182 | 已收；门侧部分 | 2.6 焦点一行；A3-2 |
| A2-6 文档页没有拖排与产品切换的样板 | R3-25 / SUB-186 | 已收 | 2.6 GWT3、GWT4 |
| A2-7 contract:static 测试不变式 | R3-6 / SUB-189 | 不变式已收；判据仍不满足 | 74/74 过；门转红于 C8（R3-8 / SUB-191 新登记），交 Owner |
| A2-8 快捷键格对比度 | R3-2 / SUB-207 | 已收 | contrast 门全 pass |
| R2 判断：示意钮、铃铛、头像、12、11 的字面值 | R3-18 / SUB-178 | 已收 | 2.1 符合性 |
| K1-145b 死变量 | R3-12 / SUB-183 | 已收 | grep 0 |
| K5-151g 下拉定位无 DOM 用例 | R3-13 / SUB-180 | 用例已加；批末未运行 | 2.5；O-18 |
| K12-4 读回缺替换句 | R3-26 / SUB-187 | 已收 | 2.7 |

## 3. 返工清单

**A3-1 · 标按钮与登入动画的 `data-logo` 仍写产品键（经济）**

- 现象：R3-17（SUB-194）把被量锁定块的 `data-logo` 改成了标 id（ds、mana、tms、einzbern）。`ShellBrandButton.tsx:84` 与 `ShellIntro.tsx:336` 仍写 `productId`。TMS 下两种写法的值相同，所以壳层门不红。但 DS、Mana 的标按钮一旦被量，门按 `data-logo` 去 logos2 找源会落空（`mark.source`），brandDigest 会对正确的资产判红。文档站每一页的文档壳标按钮就是 DS：构建出的 `components-navigation-shells.html` 里，标按钮的标写 `data-logo="design-system"`（3 处），同一页首行锁定块写 `"ds"`（2 处）。
- 证据：上述两行；`Navigation.tsx:338、641`（锁定块写标 id）；M4 问题 4；本次对构建页的 grep。
- 改法：两处都改写该产品标的 id，取法同 SUB-194 的 `productMarkIdOf`（模块内函数，不导出）；`ShellBrandButton.test.tsx:79` 与 ShellIntro 的单测改按标 id 断言。可选：让壳层门的 brandDigest 也读文档壳的标按钮，DS 才有真件读数。这只扩大覆盖面，不改判定。
- 改动文件：`ShellBrandButton.tsx`、`ShellIntro.tsx`、两份单测；可选 `scripts/shell-measure-proof.mjs`。
- Story：136（GWT2、硬线「品牌资产 digest」）、141（GWT4）。分片 B（145）若同报，合并为一条。

**A3-2 · focusRingClipInPage 在真件上读不到纸内滚动区（经济）**

- 现象：SUB-182 把纸内滚动区纳入了 focusRingClipInPage，夹具上「外扩环判红、内收环判绿」成立。但探针名册只在 actions-matrix 上跑这条探针，那一页没有 ProductShell，批末真件读数 regions 为 0。纸内焦点环看得见，目前只有本次的截图取样作证，以后回退了门也看不到。M3 问题 6 已记这一条。
- 证据：18 log:7240（buttonGroupFocusRing，actions-matrix，regions 0）；18 log 里 SUB-182 那条测试只读夹具。
- 改法：给探针名册加一个带 ProductShell 的 story（例如 shell-top-band 的 ts-closed-l，或某个 gplus 样板），判定语义与阈值不变；测试断言真件读数 regions ≥ 1。
- 改动文件：`scripts/geometry-measure-proof.mjs`、`tests/geometry-measure-proof.test.mjs`。
- Story：140（SUB-182 ③）。

## 4. 只有 Owner 能定的事项

1. **新：C8 顶带的让步项（135-GWT4 唯一的阻点，也是 `contract:static` 唯一的红）。** 这条判据 R2 已返工过（A2-7 → R3-6），本轮仍不满足，按约定交 Owner。现状：板上 `.ts-pins` 写 `min-width:0`，所以固定项条可以收到 0；C8 要求让步项有非零最小宽（1 条）。没有固定项的壳不渲染让步项（14 条，分布在 navigation-focused-shells-spec 1、navigation-product-shell-spec 1、frontend-shell-slice 6、owner-quality-product-shell 6）。补样式修不了，改判定口径又不在 C-7 的授权里。
   - 建议：裁定顶带按板执行。让步项可以收到 0（各项先截断，窄于 1024 时整组进菜单），没有固定项的壳没有让步项也算合规。落法任选其一：在 `exemptions.json` 给 shell 家族的 C8 加一条带板依据与到期日的豁免；或在 `roles.json` 加「让步项可缺省、最小宽可为 0」两个字段，由门读取。规模约 20。
   - C8 登记建议保留：它同时钉住标按钮与右簇不收缩（本轮 `fixed-item-shrinks` 为 0 条），撤掉登记会丢这层保护。
   - 另一条路是给板补一个非零最小宽，要设计会话出数并重发 07a、07b，代价更大。
   - 不裁时：contract:static 一直红，verify 不能归 0，135 记阻塞。
2. **沿用 O-4，补一处读数。** markText 有两个读数：底栏锁定块 en 1.7（138，五个屏）与 DS 首行 1.4（145）。批末 verify 的说明（steps.md 末段、main.md M4）只写了 1.4，判断归纳「verify 只剩什么」时要把 1.7 一并算上（18 log:8324–8336）。两处同根，O-4 一次裁。
3. **沿用 O-8**：136-GWT3 夜间后缀 3.07，读数不变。
4. **新（设计待定，判断可按 B 类定）：不注册 ⌘K 的壳仍画快捷键提示。** 文档页上 ts-closed-l 打开后，搜索框显示「Ctrl K」，可在本页按 Ctrl+K 打开的是文档壳（`docmain.json` closedMenuHint）。ui-react README 写「Shortcut labels belong only to a search with real focus/result behavior」。M4 问题 6 也记了这一条。
   - 建议：提示跟随 `shortcut` 显示；需要照板画出提示的文档屏与矩阵格，用预览态给出。
   - 不裁时保持现状，画面与板一致。
5. 沿用，状态不变：O-3 级联越过视口右缘（139）；O-18 批末不跑 test:dom（SUB-180、184、185 的 DOM 用例只在包内跑过）；O-1、O-9、O-10、O-11、O-13。
6. Owner 目视（只说状态，不代签）。以下都可以在 `components-navigation-shells.html` 上看：
   - 标按钮两版、hover / open、390 宽。
   - 固定项、选中态、1023 宽下的「已固定」分组。
   - 完整菜单与底栏锁定块；下拉与级联；顶带壳与铃铛 6%；登入动画。
   - 本轮新能看的：⌘K 只打开一个壳（不带参数时只开文档壳）；Closed band 屏上的拖排、刷新后的顺序与头像菜单里的产品切换；Tab 进纸内的焦点环（可滚的纸，滚动内容会盖住环的一边）。
   - 拖排以后，板上的「指针悬停」画面跟着 Statements 走，不跟位置走（M5 问题 8）。

## 5. 实施口径判定

编号为「包-条」，条目按各包交回「写明的选择」的顺序；只判本分片 Subtask 的条目。

| 包-条 | 选择 | 判定 | 理由 |
| --- | --- | --- | --- |
| M2-1 | SUB-181：结果所在的面板取最近的 `[data-panel]` 祖先，且须在被测屏内；找不到面板时整块交集都算碰撞 | 可接受 | 找不到面板时按碰撞算，判法偏严；读数与 K11 探针一致（基线 0、变异 1） |
| M2-1b | 夜间读数：临时把被测屏 story 块的 `data-tcrn-theme` 改成 dark，读完改回 | 可接受 | 板上没有夜间搜索屏，这样不必新登记屏；restored、clearPanelRestored 都绿，说明改回了 |
| M3-182a | 内收环用 space-0h / space-1 与 surface / acc 拼出，不读弃用的 `--tcrn-color-focus-ring` | 可接受 | `--tcrn-focus-ring` 是外扩的复合值，做不成 inset；单测钉住颜色与宽度和焦点环 token 同值，等于只有一个来源。实测两主题的颜色正确 |
| M3-182b | 纸内滚动区写两条状态规则：一条切 pair，一条只写强制色描边 | 可接受 | 状态规则不写颜色，特异性不变 |
| M3-182c | 兜底排除名单加上纸内滚动区本身 | 可接受 | 它有自己的 pair，不排除的话兜底规则会把内收环换成外扩环 |
| M3-182d | 探针对区域真实调用 focus()，再核对 `:focus-visible`；拿不到也记违例 | 可接受 | 是收紧；真件读数为 0 的问题另列 A3-2 |
| M3-183 | 两条断言都不写出变量名，改为「唯一 motion 变量」与「没有变体被 var() 读取」 | 可接受 | 化解了判据 ①③ 的字面冲突，断言更强 |
| M3-180 | 第三条用例先认定目标行，再按 ←；JSDOM 用 getClientRects 模拟渲染，ResizeObserver 用替身并还原 | 可接受 | 只加测试；真实浏览器里 ← 回到打开行已由壳层门级联迹线与本次探查证实 |
| M4-1 | ShellMenu、ShellDropdown 新增可选 `landmarkLabel`（Subtask 注意事项写的是「不加新 prop」） | 有条件 | 理由成立：矩阵上独立的面板、下拉也要能取名，两种替代都更差。但这是两个导出件的 prop 面改动，要判断追认；迁移 M40 与 component-api-manifest 已列 |
| M4-2 | 顶带 header、头像菜单 dialog、切换产品 nav 也加前缀 | 可接受 | 符合「全部具名地标」与单测的断言；副作用是文档壳 header 名里品牌名重复（归 147，可由 page-template 换一个 landmarkLabel） |
| M4-3 | 显式 `contentLabel` 照原样，不加前缀 | 可接受 | 与 ShellPins 显式 aria-label 优先一致；名字由消费方自己负责 |
| M4-6 | 三条 token 照 C-2 默认名，没有改名 | 可接受 | 已列入 F 段待补登 |
| M5-8 | 只接 ts-closed-l 一屏；控制器用本地键，服务端与水合先画板上顺序，挂载后再读本地顺序 | 可接受 | 实测重载后顺序保留，控制台 0 条，没有水合不一致 |
| M5-9 | 产品清单取包内注册表的 5 个产品，名用各自的 lineOne，TMS 为当前，链接回 story 锚点 | 可接受 | 产品名就是字标，五语相同，不用新增字典键 |
| M7-6 | 参数名照默认 `shell-shortcut`；门与 shell-hydrate 各导出一个同值常量 | 可接受 | 两处若不一致，被测屏不注册，afterCommandK 读 "unopened" 判红，是失败即关的写法 |
| M9-187 | 读回句取字典里已有的句子，不新增键 | 可接受 | 五语实测齐 |

M2、M3、M4、M5、M7、M9 交回里的其余条目（SUB-188、189、190、191、192、193、194、195、197、198、201、202、203、208 的选择）归分片 B、C 判，本分片不判。不可接受的口径：无。

## 6. 证据盲区

1. 批末 verify 不含 test:dom（O-18）。SUB-180 的三条下拉用例与 SUB-184、185 的 DOM 用例，只有 M3 的 56/56 与 M4 的 58/58 自报；本次没有运行。下拉的真实浏览器行为另由 2.5 的探查证实。
2. 真件 focusLoop 只看焦点落在哪个壳，不数 ⌘K 一次打开了几个壳：阈值里的 `commandKRegistrations` 只在夹具迹线里出现。「只打开一个壳」由本次探查证实（2.4 GWT4），门没有持续守住。
3. 纸内焦点环只在 ts-closed-l（浅色、夜间）与文档壳（浅色）上截图取样；其余屏与 zh-CN 没有取样。被内容盖住只量了文档壳一处。
4. 触摸端（pointer: coarse）没有量，Chromium 默认是 fine pointer；拖排只用鼠标在 1440 宽下测过，没有测触摸与 RTL。
5. 登入动画不挡输入：依据是源码（ShellIntro 本轮未改）与门；没有在动画中途派发输入。
6. 只量了 1440、1023、390 三个宽度，761–975 之间没有实测。
7. 用 runOnly 强开 axe 的 `landmark-complementary-is-top-level` 时，纸内的 TocRail 与设置页 aside 共 3 处被报出。这条规则默认不开：按 browser-proof 的配置整页跑是 0（`axe-default.json`），不在任何门里，本次不判。
8. 分片 B、C 的 Story（142–150）与文档壳（147）只在影响本分片判据的范围内读过，例如 parity、contrast、地标名，没有逐条验。
