# R2 批末验收 · 分片 A：EPIC-044 壳层 Shell（STORY-135 至 141）

节行号：§0 L5；§1 L16；§2 L32（2.1 L34，2.2 L47，2.3 L62，2.4 L73，2.5 L88，2.6 L99，2.7 L117，2.8 L129，2.9 L142）；§3 L157；§4 L221；§5 L231；§6 L279

## 0. 被验对象与方法

- 被验：集成分支 `claude/init016-tab-shell`，工作树 HEAD `7e85eeb`。`git diff --name-only 6f739b2 HEAD` 只有 `docs/dispatch/**` 5 个文件，代码等同批末 verify 所在的 `6f739b2`。
- 读的产物：verify 03 构建的各包 `dist`，以及其后 `storybook:build`（`storybook-build.exit` 为 0）产出的 `apps/storybook/storybook-static/`。两者都没有重建。
- 门证据：verify 逐段日志，引用写 `NN.MM log:行号`（会话 scratch `r2-verify/`）。批末 `geometry:measure` 串联在 gplus 段 overlap 红后停下（18 log:3、7366），壳层 18 门批末没有跑。壳层门读 K12 在 `5a5cad2` 写出的 `docs/verification/shell-measure/report.json`（下称「壳层报告」，13 过 5 红）。
- 自写只读探查在会话 scratch `acc-r2-A/`（脚本在 `probe/`，不入仓），用 Playwright 起本地静态服务打开 `components-navigation-shells.html`，等 16 个壳 story 块水合后再读：
  - `geom.json`：几何，视口 1440（en、zh-CN）、1023、390。
  - `behave.json`：真实浏览器点击、按键、悬停 600ms、级联；登入动画由初始化脚本记录 `Element.animate`，再刷新一次，另开 `reducedMotion: reduce`。
  - `behave2.json`：悬停底色与后缀对比度、选中行、下拉搜索、头像菜单、级联列。`probe3.json` 与 `probe3-mainfocus.png`：墨迹中线两种量法、快捷键底色、纸内滚动区焦点环。
- 没有重跑门，没有构建，没有写链，也没有跑包内测试。判定人写有 Owner 目视的项只给机器判据结论，不代签。

## 1. 一览

| Story | 结论 | 未满足或部分的 GWT | 返工项数 |
| --- | --- | --- | --- |
| STORY-135 壳 token | 部分 | GWT4 不满足：tokens:proof 已转绿，contract:static 仍退出 1，根因在 143 删豁免（13 log:72–91） | 1（A2-7，跨分片） |
| STORY-136 标按钮 | 阻塞于 Owner | GWT3 夜间后缀 3.07，待 D7（O-8）。其余 GWT 与符合性满足；R1 的字标截断、1px 裁切和门红都已收 | 0 |
| STORY-137 固定项 | 满足（机器判据） | 无；Owner 目视待做 | 0 |
| STORY-138 完整菜单 | 满足（机器判据） | 无。⌘K 在文档页会同时打开所有未受控壳的菜单（A2-4）。contrast 门在快捷键格红，属读法问题，实测与板相等（A2-8，跨分片） | 2（A2-4、A2-8） |
| STORY-139 下拉与级联 | 满足（机器判据） | 无；O-3 仍待裁 | 0 |
| STORY-140 ProductShell 顶带态 | 部分 | GWT1、2、5 满足。GWT3、4 组件层满足，但文档页没有可拖样板，头像菜单也没有产品（A2-6）。符合性：geometry:proof、shell:parity 红，landmark-unique 未归 0，纸内滚动区获焦后看不到焦点环 | 5（A2-1、A2-2、A2-3、A2-5、A2-6） |
| STORY-141 登入动画 | 满足（机器判据） | 无 | 0 |

返工共 8 条：主力 6 条（A2-1、A2-2、A2-3、A2-4、A2-7、A2-8），经济 2 条（A2-5、A2-6）。A2-7、A2-8 的根因在分片 B、C 的 Story，列在这里是因为它们挡住了本分片的判据。

库门 S-1 未声明，七张都不能在链上转 done；这与本结论无关。

## 2. 逐 Story

### 2.1 STORY-135 壳 token（SUB-141 K1、SUB-142 K4）

| GWT / 判据 | 结论 | 证据 |
| --- | --- | --- |
| GWT1 tokens.json 对 07b F 段 | 满足 | F 段 20 条（shell 16 条在 `tokens.css:125–140`，motion intro 4 条在 118–121）都在主题无关块，值等于 C-2 表；05 log:15「section F, one to one, plus the three R2 additions」过。R2 新增的 shell.mark、shell.touch、shell.crumb-icon（141–143）F 段还没有，待设计会话补登（判断 §3.2 已知），补登前目的锚的「1:1」差这三条 |
| GWT2 主题无关同属性集 | 满足 | 23 条只在主题无关块。`@media (pointer: coarse)` 块（`tokens.css:239–245`）只把 row-h、srch-h 改指 shell.touch，不随主题变。06.02 `tokens-sync --check` 退出 0，「C5 theme blocks declare the same 85 properties」 |
| GWT3 旧名经弃用别名 | 满足 | `tokens.css:122–124` 三个旧名仍能解析（220、52、`var(--tcrn-shell-strip-h)`）；CHANGELOG.md:132 一带有退役说明；06.06 退出 0 |
| GWT4 tokens:proof 与 contract:static 退出 0 | 不满足 | tokens:proof 06.01–06.12 全部退出 0，R1 的字体子集与 fidelity 两段红已收。contract:static 退出 1：`node --test` 一步红在 `tests/contract-static-proof.test.mjs:524`，断言「家族有豁免 ⇔ 批次 ≠ scope.batch」（13 log:72、91），证明脚本没跑到；脚本另有 C11 34 条（steps.md 主线程注、K6b 交回）。根因是 SUB-155、156 删了第二批三族豁免（143），不在 SUB-141、142 的文件里 → A2-7 |
| 符合性：同源 | 满足 | R1 红的同源测试改读 `shell-screen.mjs` 导出的 `SCREEN_CSS`，05 log:17 过。`pnpm test` 不再停在首包：ui-tokens 15/15、ui-react 246/246、storybook 12/12、两个 pilot 各 1/1（05 log:24–27、308–311、332–335、345–361） |
| 符合性：不新增组件内几何字面值 | 满足 | `shell*.css.ts` 的 px 字面值只剩媒体查询断点（`shell.css.ts:141、263、642`）；标 22 改为 `var(--tcrn-shell-mark)`（`shell.css.ts:82`）；粗指针切换移到 token 层。06.10 `shellGeometryLiterals: 0`（log:18）。brand.css.ts 的品牌尺度字面值不属壳模块（K4 问题 12，R3） |

SUB-141：自报与实测一致。SUB-142：token、粗指针块、C10 扫描与实测一致；它判据里的「contract:static 退出 0」在批末因 143 的余项不成立。

### 2.2 STORY-136 标按钮 ShellBrandButton（SUB-143 K1）

| GWT / 判据 | 结论 | 证据 |
| --- | --- | --- |
| GWT1 left 12、top 6、134×40、中线 26 | 满足 | ts-closed-l、-n：12 / 6 / 134×40，中线 26，en、zh-CN 相同（`geom.json`）。壳层报告 brandGeometry pass，变异「top 改 0」turns red |
| GWT2 标 digest = logos2 | 满足 | 标是 `svg[data-logo="tms"]`。壳层报告 brandDigest 在 shell-top-band 的 33 项全过，红只在品牌首行 story 的 mana、ds 资产名（归 145）；14 brand-asset:proof 退出 0 |
| GWT3 hover / open 3.5% 墨洗、后缀 ≥ 4.5、空闲透明 | 阻塞于 Owner（夜间） | 真实悬停：浅色底 rgba(22,21,15,.035)，后缀 4.53；夜间 rgba(235,232,223,.04)，后缀 3.07（`behave2.json`）。open 底同值，空闲透明，标 opacity 1。夜间 3.07 是 D7 已知待裁（O-8）。单测已按 R2-2 改为「浅色 ≥ 4.5，夜间同色并记 3.07 pending」（`ShellBrandButton.test.tsx:272–284`），批末 ui-react 246/246 |
| GWT4 Esc 后焦点回标按钮 | 满足 | 真实浏览器：点标按钮开菜单，焦点进菜单搜索框；按 Esc 后 `aria-expanded=false`，activeElement 是标按钮（`behave.json` afterClickTab、afterEsc）。壳层报告 focusLoop 在 en、zh-CN 都过（afterEscape 为 "tab"），变异「关闭时不还焦点」turns red |
| GWT5 390 宽只有标与示意、可点、高 ≥ 40 | 满足 | 390 视口：64×40，字标 0×0，`data-shell-brand="v1"`；点击后 Sheet 打开（`behave.json` phoneAfterClick）。1023 视口同为 v1、64×40 |
| 符合性：圆角 8、无轮廓、示意 20 / chevron 16、标 22、字标 12.5/600 | 满足 | 圆角 8，outline none，阴影透明；示意 20×20，图标 16×16；标 22×22；字标 12.5px / 600（`geom.json`） |
| 符合性：字标墨迹中线 = 标中线 | 满足 | 按门的量法实测 0.1（`probe3.json` optical）；壳层报告标按钮的 markText 项全过 |
| 符合性：文案原样（D2） | 满足 | 字标宽 60.23，`scrollWidth/clientWidth` 为 60/60，不截断，带 title。`em` 盒 17.5–34.5 在 `b` 盒 16.5–35.5 之内（`b` 上下各加 2 内距）（`geom.json`）。壳层报告 singleLine 在 ts-closed、x、drop、narrow、intro 全过，R1 的 36 处红已收 |

SUB-143：自报与实测一致，R1 的 A1-2、A1-3 已收。

### 2.3 STORY-137 顶带固定项 ShellPins（本轮无本单）

| GWT / 判据 | 结论 | 证据 |
| --- | --- | --- |
| GWT1 三处间距 8、每项 32、中线 26 | 满足 | 1440 en：146→154、210.77→218.77、312.69→320.69、404.03→412.03。zh-CN：146→154、199→207、270→278、335.5→343.5。全是 8；每项 top 10、高 32、中线 26（`geom.json`）。壳层报告 pinSpacing pass |
| GWT2 分割线 0；加回左边线判红 | 满足 | 顶带内的细线与左右边线都是 0（`geom.json` stripLines 为空）；变异 `story-pins-left-line` turns red |
| GWT3 7 项只显 6，第 7 项在菜单里带已固定 | 满足（无回退） | R1 在 jsdom 实测成立。本轮相关单测 `ShellPins.test.tsx:57`、`Navigation.test.tsx:1434` 在批末 246/246 之内。文档页没有 7 项的屏，本轮未再实测 |
| GWT4 1023 宽顶带无固定项、菜单有「已固定」 | 满足 | 1023 视口：固定项组 display none，ts-narrow-x-l 面板的「Pinned」分组可见；1440 视口不显示该组（`geom.json`） |
| GWT5 选中 6%、600、无左边条、对比度等 B 段 | 满足 | 「Roster」浅色底 rgba(22,21,15,.06)、夜间 .07，字重 600，border-left 0（`geom.json`）。壳层报告 contrast 的失败格只有 srch-kbd（属 138 的搜索），固定项各格没有失败 |
| 符合性：hover 3.5%、右上簇 | 满足 | 悬停底 .035 / .04，对比度 14.70 / 14.14（`behave2.json`）。铃铛 32、头像 28、中线 26；簇右 994 = 纸右 994（1023 视口 897 = 897，390 视口 288 = 288） |

### 2.4 STORY-138 完整菜单 ShellMenu（SUB-144 K1）

| GWT / 判据 | 结论 | 证据 |
| --- | --- | --- |
| GWT1 top 52、left 12、width 952、接续 6 | 满足 | ts-x-l：12 / 52 / 952×290，52 − 标按钮底 46 = 6，en、zh-CN 相同（`geom.json`）。R1 的文档页破损已收：搜索 936×40；三列各宽 301.33，列距 16；行 32；1440 下「已固定」组不显示；组标题 10 / 500、ink-3。壳层报告 continuation pass |
| GWT2 收起钮 0；锁定块非按钮、不在 Tab 序列 | 满足 | 面板里可见按钮 15 个，读到的都是图钉钮；锁定块是 `div[role=img]`，tabIndex −1，可聚焦后代 0，cursor auto（`geom.json`）。菜单打开时标按钮的可及名为「Close navigation · TCRN TMS」，它就是标按钮，不是另加的收起钮。壳层报告 noCollapse、lockupDecor pass，变异「加回 x 钮」「改成 button」turns red |
| GWT3 底栏锁定块上下留白相等 | 满足 | 底栏 290–342，上边线 1px；锁定块 294.5–338.5，上留白 3.5、下留白 3.5；右缘 948 = 964 − 16；当前位置中线 316.49，锁定块 316.5。壳层报告 barCentering pass |
| GWT4 ⌘K 聚焦搜索、Esc 回标按钮、点外部关闭 | 满足 | 真实浏览器：Ctrl+K 与 ⌘K 都打开菜单，焦点在搜索框；Esc 后焦点回标按钮；点外部关闭（`behave.json`）。文档页上按一次会打开所有未受控壳的菜单，焦点落在 ts-intro-l 的搜索框而不是当前屏（afterCtrlK），门读不出（K5 问题 11）→ A2-4 |
| GWT5 阴影模糊 ≤ 3 | 满足 | 三层阴影，最大模糊 3（`geom.json` blurs）；壳层报告 shadowBlur pass，变异 12px turns red |
| 符合性：dialog 非模态、方向键、选中即收、无产品清单 | 满足 | role=dialog，aria-modal=false。↓ 依次到 Roster、Teams、Contracts，→ 到第 2 列的「All contracts」，← 回 Contracts。点「Teams」后菜单关闭，焦点回标按钮。菜单与锁定块里的产品行 0（`behave.json`、`behave2.json`） |
| 符合性：锁定块钩子与结构（C-6） | 满足 | `svg[data-logo="tms"]` 22；`b` 内含 `em`「TMS」；`small`「Talent Management System」（`geom.json`）。R1 的 lockupDecor 16 处、brandDigest 24 处红已收 |
| 符合性：每格对比度等 B 段 | 满足（实测）；门红 | 壳层报告 contrast 只在 srch-kbd-l、-n 红（8.58 对 7.59，7.23 对 6.11）。实测快捷键提示（ink-2）在搜索框盒内，框底是 6% 墨洗，有效对比度就是板上的 7.59。门红是因为提示是框的兄弟元素，门沿祖先链取底色，读到纸白（`probe3.json` kbd：inside true，controlBg .06，controlIsAncestor false）→ A2-8 |

SUB-144：自报与实测一致。

### 2.5 STORY-139 下拉与级联（本轮无本单）

| GWT / 判据 | 结论 | 证据 |
| --- | --- | --- |
| GWT1 left = 项 left、top = 项底 + 6、宽 240、搜索 28 | 满足 | ts-drop-l：下拉 left 218.77 = 「Contracts」218.77，top 48 = 42 + 6，宽 240，搜索 228×28；zh-CN 207 = 207（`geom.json`）。真实点击 ts-closed-l 的「Contracts」：435.77 = 435.77，491.53 = 485.53 + 6（`behave.json`）。R1 的 260 高搜索已收 |
| GWT2 第二列 +4、宽 240、高 = 第一列 | 满足 | 点「Templates」后第二列 left 679.77 = 675.77 + 4，宽 240，高 180 = 180（`behave.json`）；静态屏同值（`behave2.json` dropScreen）。变异 `story-column-2-height-auto` turns red |
| GWT3 悬停 500ms 不出第二列 | 满足 | 真实悬停「Templates」600ms，级联列 0（afterHover600） |
| GWT4 ← 回同一行；Esc 全关、焦点回固定项 | 满足 | → 到第 2 列「Signing contracts」，← 回「Templates」且第 2 列收起；再进第 2 列按 Esc，下拉与级联全关，焦点回「Contracts」（`behave.json`）。壳层报告 focusLoop 的级联 2→1 过 |
| GWT5 下拉搜索只匹配子树 | 满足 | 「Agency」得 1 条（Contracts › Templates）；「Templ」得模板下 4 条；「Roster」「Live」都是 0 条（`behave2.json`） |
| 符合性：内距 6、行 32、文字起点 16、无图标列、dialog、aria | 满足 | 内距 6；行 32；文字起点 6 + 10 = 16；只有带子项的行有箭头；role=dialog，aria-modal=false；固定项有 aria-expanded 与 aria-haspopup=dialog（`geom.json`） |

### 2.6 STORY-140 ProductShell 顶带态（SUB-145、146 K1；147、148、149 K6；150 K11）

| GWT / 判据 | 结论 | 证据 |
| --- | --- | --- |
| GWT1 顶带 52 无底无线；纸 52 / 12 / 14 | 满足 | 顶带 52，背景透明，四边边线 0，无阴影；纸 left 12、top 52，右、下各 12，圆角 14，s1 两层阴影；三个视口相同（`geom.json`）。壳层报告 strip、edges pass；18 log 汇总 shellFrame pass |
| GWT2 常驻侧栏与收起钮 0 | 满足 | 各屏侧栏 0；收起钮见 2.4 GWT2 |
| GWT3 第 7 项偏好保存、顶带显示 6；拖排后顺序持久化 | 满足（组件层） | 指针拖动与 Alt+← / →（`ShellPins.tsx:193–258`），`onPinsReorder` 经 `reorderPins`（`Navigation.tsx:2539`）接 `movePin` 写回偏好；DOM 用例 `shell-pins.dom.spec.tsx:63、116、151`、`product-shell-preferences.dom.spec.tsx:121`（K6 自报 test:dom 53/53，批末不含 test:dom）。文档页的壳都没接 `onPinsReorder`，没有 `data-pin-movable`，Owner 看不到拖排 → A2-6 |
| GWT4 头像菜单含切换产品；菜单与锁定块无产品清单 | 满足（组件层） | 组件：`products` 非空时头像菜单出「Switch product」（`Navigation.tsx:2306–2317`；R1 jsdom 实测）。文档页的头像菜单只有账户与语言，没有产品切换（`behave2.json` avatar，产品行 0），因为没有屏传 `products` → A2-6。菜单与锁定块的产品行 0 |
| GWT5 旧 prop 类型层拒绝、迁移有条目 | 满足（无回退） | `Navigation.test.tsx` 有 19 处 `@ts-expect-error`；02 typecheck 退出 0；迁移说明的 M20、M21 仍在 |
| 符合性：标按钮左 = 纸左 = 菜单左 = 12，簇右 = 纸右 | 满足 | 12 / 12 / 12；994 = 994（1023 视口 897，390 视口 288） |
| 符合性：O-1 撤出 | 满足 | brand.css.ts 的三条死选择器与 brandCss03 已删；base.css.ts 的 260、420 与 margin-left auto 已删（grep 只剩活动流 time 的 margin-left）。段首标记 `/* tcrn:shell-layer-start */` 在 `dist/styles/shell.css.js` 恰好一处 |
| SUB-146：纸内滚动区可聚焦、铃铛 6% | 部分 | 铃铛悬停浅色 .06、夜间 .07（`behave2.json`），合板。`.tcrn-product-shell__main` 有 tabindex 0，但它与纸同盒（229,51.5–1211,887.5）。焦点环是外扩 box-shadow（2px 画布色加 4px 焦点色），被纸的 overflow hidden 整圈裁掉：`:focus-visible` 成立，截图上看不到环（`probe3.json` mainFocus、`probe3-mainfocus.png`）→ A2-5 |
| SUB-147：受控搜索词与分类说明 | 满足 | ts-search-l 经 `menuQuery` 渲染出 7 条结果（`geom.json` results 936×236）；browser-proof 111 页的 `categoryAriaFailures` 全空（`browser-proof-summary.json`，K12 写出） |
| SUB-148：地标名按实例区分（axe landmark-unique 归 0） | 部分 | 固定项 nav 的名已带前缀：「Closed band · Pinned items」「收起的顶带 · 固定项」（`geom.json`）。菜单面板「Navigation」、底栏「Current location」、下拉「Contracts」等包内名不带前缀，同页多壳仍重名。K11 自报 landmark-unique 仍有 30 个节点（问题 7）；批末 axeViolationCount 14（30.02 log:12）→ A2-3 |
| SUB-149：拖排 | 满足（组件层） | 见 GWT3 |
| SUB-150：geometry:proof 退出 0 | 不满足 | 10 log:5：openMenus 14 = 期望 14（由 DOM 派生），overlayCount 1，R1 的两条红已消。但 baseline、broken、restored 都因 collisions 2 而红：结果框在完整菜单面板里，面板按 07a 盖在纸上，与纸内「Roster」h2 及首段相交；redThenGreen.searchOverlay 的 green 为 false → A2-1 |
| SUB-121 遗留：shell:parity | 不满足 | 11 log:5：只剩 package-nav-item 的 paddingRight（文档 4、包 0）。文档壳菜单首行是不可钉普通行，ts-x-l 首行是可钉行，两侧取了不同行型（K2 问题 1）→ A2-2 |

### 2.7 STORY-141 登入动画 ShellIntro（SUB-151 K5）

| GWT / 判据 | 结论 | 证据 |
| --- | --- | --- |
| GWT1 三段 120 / 240 / 100，总 ≤ 700 | 满足 | 真实浏览器首载记到 8 段：卡 opacity 0–120；标 transform 120–360；首行容器 opacity 0–360；字标、示意、固定项、簇的 opacity 与纸的 opacity、transform 在 360–460；总长 460（`behave.json` introFirst）。壳层报告 intro pass，durationMs 475 / 477 是挂钟读数 |
| GWT2 刷新不再播；去掉标记判红 | 满足 | sessionStorage `tcrn-shell-intro` 为 "played"；刷新后 0 段（introReload）。变异 `story-intro-no-session-marker` turns red（R1 判为不可区分，现已收） |
| GWT3 reduced-motion 0 次 | 满足 | `reducedMotion: reduce` 上下文 0 段，标记照写（introReduced） |
| GWT4 动画中的标与 logos2 同源 | 满足 | 飞行标 `svg.tcrn-shell-intro__mark` 带 `data-logo={productId}`（`ShellIntro.tsx:336`）；壳层报告 brandDigest 在 shell-intro 无失败 |
| 符合性：只用 transform 与 opacity、不挡输入 | 满足 | 记到的属性只有 opacity、transform；`shell-intro.css.ts` 没有 transition 或 animation（第 5 行是注释）；卡带 `inert`，层带 `aria-hidden`（`ShellIntro.tsx:323–327`） |

SUB-151：K5 自报「部分」。壳 story 已水合，文档壳浮层仍是脚本驱动的静态标记（K5 问题 7，属 147，归分片 C）。本分片 136、138、139、141 依赖的行为在水合后的壳 story 上都能观察到，R1 的 A1-6 对本分片已收。

### 2.8 START 质量硬线（本分片涉及的八条）

| 硬线 | 结论 | 证据 |
| --- | --- | --- |
| 壳内常驻侧栏与收起钮 0 | 满足 | 2.6 GWT2、2.4 GWT2 |
| 顶带无底无线、中线 26 | 满足 | 2.6 GWT1；标按钮、四个固定项、铃铛、头像的中线都是 26 |
| 三处间距相等 | 满足 | 2.3 GWT1，en、zh-CN 都是 8 |
| 接续 6 | 满足 | 菜单 52 − 46；下拉 48 − 42（静态屏）与 491.53 − 485.53（真实点击）；zh-CN 相同 |
| 锁定块只装饰 | 满足 | 2.4 GWT2 |
| 品牌资产 digest | 满足（本分片各处） | 标按钮、底栏锁定块、飞行标；brandDigest 的红只在 145 的品牌首行 story（mana、ds 资产名） |
| 标旁文字中线 | 部分（阻塞于 Owner） | 标按钮 0.1。底栏锁定块 en 读 1.7（壳层报告 markText：ts-x-l、x-n、search-l、narrow-x-l、shell-matrix），是末行标语下行字母所致，与 DS 侧栏 1.4 同根，等 O-4（§4 第 1 条） |
| 登入动画只用 transform 与 opacity | 满足 | 2.7 |

### 2.9 R1 返工项复核（本分片 A1-1 至 A1-10）

| R1 项 | 承接 | 结论 | 依据 |
| --- | --- | --- | --- |
| A1-1 同源测试读过期路径 | SUB-141 | 已收 | 05 log:17；`pnpm test` 全链跑完 |
| A1-2 夜间后缀断言 | SUB-143 | 已收 | `ShellBrandButton.test.tsx:272–284`；ui-react 246/246 |
| A1-3 字标截断与 1px 裁切 | SUB-143 | 已收（TMS） | 2.2 D2；长字标仍按 O-1 默认截断加 title |
| A1-4 锁定块 data-logo | SUB-144 | 已收 | 2.4 锁定块；lockupDecor pass |
| A1-5 `.story-body` 副本压过壳层段 | SUB-165、170 | 已收 | 2.4 GWT1、2.5 GWT1 的文档页读数 |
| A1-6 静态页无客户端挂载 | SUB-151 | 本分片已收 | intro、focusLoop、noCollapse pass，真实浏览器复现；文档壳浮层余项归 147 |
| A1-7 geometry:proof 的 searchOverlay | SUB-147、150 | 部分 | open-menus 已从 DOM 派生，结果屏已出；碰撞口径未改 → A2-1 |
| A1-8 拖排 | SUB-149 | 组件层已收 | 文档页无可拖样板 → A2-6 |
| A1-9 brand.css.ts 的 O-1 残留 | SUB-145 | 已收 | grep 为 0；GWT1 单测读整表 |
| A1-10 tokens:proof 两段红 | SUB-177、167 | 已收 | 06.01–06.12 全部退出 0 |

## 3. 返工清单

**A2-1 · geometry:proof 的 searchOverlay 碰撞口径仍按旧顶栏（主力：改门判定语义，须判断授权）**

- 现象：宿主已改到 ts-search-l，open-menus 由 DOM 派生（14 = 14），overlayCount 1。但检查要求结果框与纸内文字零相交，而新壳的完整菜单是盖在纸上的非模态浮层（07a A 段），结果框必然与纸内标题、首段相交。基线、变异、复原三次都红，红绿不可分。
- 证据：10 log:5（baseline collisions 2：「Roster」h2 与首段；redThenGreen.searchOverlay green false）；`scripts/geometry-proof.mjs:250–313`；K11 问题 1 的探针（面板外交集：基线 0，变异 1）。
- 改法：碰撞只计结果框与纸内文字交集里落在结果所在菜单面板盒之外的部分，同时断言该面板不透明（背景 alpha 为 1）；保留现有变异（结果改绝对定位后面板外交集为 1，应判红）。这条是 C-7 列表外的判定语义改动，要判断授权；检查本身不撤（§3.3）。
- 改动文件：`scripts/geometry-proof.mjs`。
- Story：140（SUB-150 判据「geometry:proof 退出 0」）。

**A2-2 · shell:parity 的 package-nav-item 两侧取了不同行型（主力：改门取样，须判断授权）**

- 现象：文档侧取文档壳菜单首行（不可钉普通行，右内距 4），包侧取 ts-x-l 首行（可钉行，右内距 0），于是只剩 paddingRight 一处值差。两种行在包里各自合板，差异来自取样。
- 证据：11 log:5 roles[8]；K2 问题 1、K5 问题 1、K11 问题 11。
- 改法：两侧取同一行型（都取可钉行，或都取不可钉行），或拆成两个角色各比各的。不改阈值与比对字段。
- 改动文件：`scripts/shell-parity-proof.mjs` 及其测试。
- Story：140（R1 SUB-121 的 parity 包侧）；分片 C 的 147 可能同报。

**A2-3 · 包内地标名不带 landmarkLabel 前缀，同页多壳仍重名（主力：ProductShell 地标契约）**

- 现象：SUB-148 只给固定项 nav 与面包屑 nav 加了前缀。完整菜单面板（dialog「Navigation」）、底栏 nav（「Current location」）、下拉面板（「Contracts」「Schedule」）和内容区 region 仍是固定名；文档页上 16 个壳同时在页时重名。K11 自报 axe landmark-unique 30 个节点。
- 证据：K11 问题 7、K6 问题 4；`geom.json` 各屏固定项 nav 的名已带前缀；30.02 log:12 axeViolationCount 14。
- 改法：`landmarkLabel` 同样作这四类地标名的前缀（由 shell-copy 的 `landmarkOf` 组装五语），不传时名不变；单测断言同页两壳的全部地标名互不相同。文件集外样板（`prototypes/storybook-shell-demos.tsx`、`gplus/matrix-stories.tsx`、TocRail、SectionTabs）的重名归分片 C 或 R3。
- 改动文件：`Navigation.tsx`、`ShellMenu.tsx`、`ShellDropdown.tsx`、`shell-copy.ts` 及对应测试；迁移说明补一句。
- Story：140（SUB-148 判据）、147。

**A2-4 · ⌘K / Ctrl+K 在多壳页面同时打开所有菜单，门读不出焦点落到了别的壳（主力：ProductShell prop 面，门侧收紧须判断授权）**

- 现象：每个 ShellMenu 都注册全局快捷键，ProductShell 没有关掉它的入口。文档页按一次 Ctrl+K，所有未受控的壳连同文档壳的菜单同时打开，焦点落在最后注册的 ts-intro-l 的搜索框；门的 afterCommandK 只认「是搜索框」，仍记为过。Owner 在文档页目视 ⌘K 会看到十几个菜单一起打开。
- 证据：`behave.json` afterCtrlK、afterMetaK（openPanelsOnPage）；K5 问题 11。
- 改法：ProductShell 透传 ShellMenu 的快捷键开关（如 `menuShortcut?: boolean`，默认开）；文档页只让文档壳注册，壳 story 关掉，门运行时只开被测屏；壳层门的 focusLoop 断言焦点落在被测屏自己的搜索框。
- 改动文件：`Navigation.tsx`、`Navigation.test.tsx`、`apps/storybook/src/build/shell-hydrate.tsx`、`scripts/shell-measure-proof.mjs`；迁移说明补一句。
- Story：138（GWT4 的证据强度）、140。

**A2-5 · 纸内滚动区可聚焦后，焦点环被纸裁掉（经济）**

- 现象：SUB-146 给 `.tcrn-product-shell__main` 加了 tabindex 0，焦点环按判据沿用 `.tcrn-product-shell :focus-visible` 的外扩 box-shadow。该区与纸同盒，纸 overflow hidden，环整圈被裁掉，键盘获焦时看不到焦点（WCAG 2.4.7）。现有 focusRingClipInPage 只量按钮组，门不会报。
- 证据：`probe3.json` mainFocus（focusVisible true；box-shadow 为 0 0 0 2px 与 4px；main 与纸同盒；overflow hidden）；`probe3-mainfocus.png`；K1 问题 3。
- 改法：给纸内滚动区单独写内收的焦点指示：基础规则声明焦点 pair（读 `--tcrn-focus-ring` 同一组 token），`:where(:focus-visible)` 只切 pair，用 inset 形态或负 outline-offset；状态规则不写颜色，特异性不高于基础规则。单测断言环落在区内。
- 改动文件：`packages/ui-react/src/styles/shell.css.ts`（或 base.css.ts 的壳段）、`Navigation.test.tsx`。
- Story：140（R2-8）。

**A2-6 · 文档页的壳 story 没有可拖固定项和产品切换的样板（经济）**

- 现象：水合的壳 story 只传 `pinnedIds` 和空回调，不接 `onPinsReorder`，也不传 `products`。文档页上固定项拖不动，头像菜单没有「Switch product」。判断 §3.5 把拖排列为本轮新增的目视项，140-GWT4 的头像菜单也要目视，现在 Owner 在文档站上看不到这两项。
- 证据：`shell-hydrate.tsx:360–389`（没有 onPinsReorder、products）；`geom.json` 各屏 movable 为 false；`behave2.json` avatar 产品行 0；`apps/storybook/src` 里 `onPinsReorder` 0 处。
- 改法：在 shell-top-band 的收起屏（或按 C-9 登记一个新屏）里，用 `useProductShellController` 的 `productShellControlProps` 接本地偏好，并传 `products`（TMS 为当前，加 AOS 等已有五语名的产品）；同步 smoke 期望与台账。
- 改动文件：`apps/storybook/src/build/shell-hydrate.tsx`、`apps/storybook/src/smoke.test.ts`、`scripts/lib/story-budget.mjs`（屏数变化时）。
- Story：140（GWT3、GWT4 目视的前提）。

**A2-7 · contract:static 退出 1，挡住 135-GWT4（主力，跨分片：根因在 143）**

- 现象与证据：13 log:72–91，`tests/contract-static-proof.test.mjs:524` 仍规定第二批家族必须有豁免，删到期豁免后转红；证明脚本另有 C11 34 条（ReadbackPanel 卡套卡，K4 问题 8、K6b 交回）。
- 改法：按 K4 问题 5 把不变式改读「已授权全量检查的批次」（families.json 的 scope 列出已到期批次，validateExemptions 与测试读同一处）；C11 34 条按分片 B 的处置办。属门契约改动，要判断授权。
- 改动文件：`tests/contract-static-proof.test.mjs`、`scripts/contract-static-proof.mjs`、`docs/contract/families.json`。
- Story：135-GWT4 的阻挡；分片 B（143）同报时合并为一条。

**A2-8 · 壳层门 contrast 的 srch-kbd 格沿祖先链取底色（主力，跨分片：根因在 149 门的读法）**

- 现象与证据：壳层报告 contrast 只在 srch-kbd-l、-n 红（8.58 对 7.59，7.23 对 6.11，en、zh-CN 都红）。快捷键提示是搜索框的兄弟元素，绝对定位叠在框上；框底 6% 墨洗，提示 ink-2，有效对比度就是板上的 7.59。门的 effBg 沿祖先链取到纸白（`probe3.json` kbd；`matrices.generated.ts:300、333`；K2 问题 5）。
- 改法：取底色时，对叠放的文字改用 `document.elementsFromPoint` 取文字中点下方第一个有底色的元素，或读该格声明的承载元素；期望值不改。属 SUB-174「补三类读法」的范围。
- 改动文件：`scripts/lib/shell-measure.mjs`。
- Story：138（srch-kbd 是完整菜单的搜索）；contrast 门整体转绿后，137、139 的门证据才完整。分片 C（149）同报时合并。

## 4. 只有 Owner 能定的事项

新发现：没有新的 Owner 专属事项。已知项里有一项补了证据：

1. **O-4 墨迹中线（补证据）。** 完整菜单底栏锁定块（TMS，侧栏尺度）en 读 1.7，判红：门取「首行大写顶到末行墨迹底」，末行标语「Talent Management System」的 g、y 下伸 2.2，把中线拉低，与 DS 侧栏 1.4 同根。按 O-4 建议的「首行大写顶到末行基线」量是 0.6；zh-CN 末行无下行字母，门读 1.0（`probe3.json` optical）。建议 O-4 一并裁：改量「大写顶到基线」，锁定块与首行同一规则。不裁时按默认 ±1 照判，硬线「标旁文字中线」记部分。

沿用、状态不变：D7 / O-8 夜间后缀 3.07、3.33（136-GWT3）；O-3 级联越过视口右缘（139）；O-1 长字标；O-9 AOS 没有 logos2 标；O-10 头像菜单几何；O-11 窄屏按视口切（文档页的 shell-narrow 只有在 ≤ 1023 视口下才看得到窄屏态）；O-12、O-13、O-14。

Owner 目视（只说状态，不代签）：标按钮两版、hover / open、390；固定项、选中、1023 下的已固定；菜单与底栏锁定块；下拉与级联；顶带壳与铃铛 6%；登入动画。这些都能在文档页 navigation-shells 看到。拖排与头像菜单里的产品切换要等 A2-6，否则文档页上看不到；建议目视排在 A2-6 之后。

## 5. 实施口径判定

编号是「包-单号」加字母，字母按各包交回「写明的选择」的条目顺序。

| 包-条 | 选择 | 判定 | 理由 |
| --- | --- | --- | --- |
| K1-141 | 同源测试动态导入 shell-screen.mjs 的 SCREEN_CSS，取 `.scr.ts{` 行比对 | 可接受 | 读导出值而不是文件行号；板侧文件不改（C-16）；05 log:17 |
| K1-143a | 夜间后缀断言同色、记 3.07、注 D7 pending | 可接受 | 就是 R2-2 的改法，口径同 WORDMARK_EXEMPTIONS |
| K1-143b | 字标 `flex: none`，max-inline-size 允许越出格子 1，长名在 61 截断并带 title | 可接受 | 外框 134 与示意位置（120）不变；实测 TMS 越格 0.23，1 的容差落在示意前的 10 列距里 |
| K1-143c | 两处 `b` 上下各加 2 内距，给 em 行盒留余量 | 可接受 | em 盒在 b 盒内，中线不变（markText 0.1） |
| K1-143d | 首行 `b` 补 title | 可接受 | 只加属性，C-6 结构不变 |
| K1-144a | ProductLogo 改出 `b > em` 加 `small`，基词与 em 之间加空格，后缀 font-style normal | 可接受 | 合 C-6 与 Brand E 写法；类名不变；迁移说明已列 |
| K1-144b | 侧栏档选择器扩到 `[data-lockup="lkr"]`，删菜单里的尺度副本 | 可接受 | 合 C13 一处真相；实测锁定块为 22、12.5 / 600、两行 |
| K1-144c | `data-logo` 只给带 `data-lockup` 的彩色标 | 可接受 | 门只读受测锁定块；首行与底栏口径一致；理由（不让 intro 用例先命中卡片上的标）已写明 |
| K1-145a | 连同 `[data-search-expanded]` 的 420 规则一起删 | 可接受 | 同属旧顶栏尺寸；不删的话菜单搜索输入时会变成 420 宽 |
| K1-145b | 保留已无引用的 `--tcrn-motion-product-shell-search` 声明 | 有条件 | smoke 标记与 token-extension 登记仍引用它；要与 K1 问题 2、5 同批删，否则死变量会长留 |
| K1-146a | 纸内滚动区加 tabIndex 0，焦点环沿用壳内兜底规则 | 不可接受（结果层面） | 实测获焦后没有可见焦点环（A2-5）。判据要求的「沿用」在纸 overflow hidden 下不成立，包自己记了问题 3 但没有停下 |
| K1-146b | 铃铛悬停改 6%，只切状态对 | 可接受 | 实测 .06 / .07，合 07a B 段 |
| K4-a | 三条新 token 按 C-2 默认名落地 | 有条件 | 135 的实施注写「触摸端 44 用 pointer: coarse 切换值，不另设 token」，shell.touch 与它字面相左。判断 §3.4 第 5 条已授权，并列为 Owner 可改名或不设，收口时回显即可 |
| K4-b | 粗指针映射写在 ui-tokens（`tcrnCoarsePointerTokens`），不进 tokens.json | 有条件 | 契约 tokens.json 只在 note 里说明，生成器读不到映射，等于多了第二个来源；要么 tokens.json 加映射字段，要么在契约说明里定死以 ui-tokens 为准 |
| K4-c | token 块解析认一层 @media；C5 只比顶层块；media 块只许改指主题无关名 | 可接受 | 是收紧，没有放宽 |
| K4-d | C10 扫描放在 shell-fidelity：calc、clamp、0、1px 放行，字号、outline、边框宽不算几何，自检写在门内 | 可接受 | C-7 授权项；06.10 shellGeometryLiterals 0 |
| K5-170 | 段首标记缺失、重复或位置不对时构建失败 | 可接受 | SUB-165 读数没有回退 |
| K5-151a | 屏表移到 `shell-hydrate.tsx`，服务端 renderToString，页面用同一 id 前缀 hydrateRoot，用已有 esbuild 打包 | 可接受 | 没加依赖，没改锁文件；产物 523 KB 只在一页加载（K5 问题 10，R3 可评估） |
| K5-151b | 收起屏不受控、开屏受控；桌面开屏在任何视口都是面板 | 可接受 | 合板（板画的是 1240 屏）；实测收起屏能开能关 |
| K5-151c | 挂载前临时改写 `HTMLElement.prototype.focus`，拦下指向画框内的 focus() | 有条件 | 只在文档页，全部挂载后还原；但某块水合失败时，该块内的 focus() 会一直被吞，失败分支也应放行 |
| K5-151d | 页面换字跳过水合块，壳按 currentLocale 自己说话 | 可接受 | zh-CN 实测文案与接续都对 |
| K5-151e | intro 在壳水合后挂载，画框不设 contain | 可接受 | 实测首载 1 次、刷新 0 次、减弱 0 次 |
| K5-151f | ProductShell 新增 `previewStates` 并下传，下拉的 `"open"` 起始即展开 | 有条件 | 公开 prop 面多了一个文档用的预览入口（C-12 已定名）；迁移说明要写明它只供文档与测试使用 |
| K5-151g | 下拉按装着固定层的祖先换算位置，每次渲染和顶带尺寸变化后重定位 | 有条件 | 实测 en、zh-CN 接续都对；但没有 DOM 用例（K5 问题 12），回归只能靠壳层门 |
| K5-151h | 级联 ArrowLeft 回到可见的打开行；文档壳的 Esc 只认头像菜单内处理过的 | 可接受 | 实测 ← 回到「Templates」 |
| K6-a | `data-shell-group` 留在 NavGroup 列上 | 可接受 | 与 K7 夹具一致 |
| K6-b | C-12 之外再加 `ShellMenuItem.description` 与 NavGroup `description` | 可接受 | 文档菜单的分类是二级条目（K6 问题 2），不加就到不了判据；迁移条目已写 |
| K6-c | 菜单由开到关时，两种模式都以空串调 `onQueryChange` | 可接受 | 受控方可以复位；原 `onSearchQueryChange` 不变 |
| K6-d | headingLevel 运行时只认 1，其余按 2 | 可接受 | 防御写法，无副作用 |
| K6-e | landmarkLabel 只作两个 nav 的前缀，内容区不加 | 有条件 | 判据字面如此，但 landmark-unique 仍未归 0（A2-3） |
| K6-f | 拖排细节：4px 阈值、越过中线换位、拖后吞 click、首尾 Alt+← / → 仍 preventDefault、RTL 反向、aria-keyshortcuts，规则特异性 (0,1,0)、不含颜色 | 可接受 | 合 C-8 与「不加板外视觉」；吞掉浏览器后退只发生在可拖项上，已写明 |
| K6-g | 控制器 `reorderPins`：动一项走 movePin，动多项走 setPins | 可接受 | 产品只收到一次 onPinsChange |
| K6-h | 改了文件集外的 `Typography.test.tsx` 一行 | 有条件 | 派工提示授权，只改正则与注释；记在交回即可 |
| K11-a | 改了摘录文件集外的 `shell-hydrate.tsx` | 可接受 | K5 之后屏表就在这里，跨包通告已指明 |
| K11-b | ts-search-l 受控输入「Contra」/「合同」，不接 onMenuQueryChange | 可接受 | 实测 7 条结果 |
| K11-c | open-menus 按 aria-controls 目标存在且可见来派生 | 可接受 | C-7 授权项；读到 14 = 14，游离 0 |
| K11-d | 地标名取屏名，文档壳取 shell.brand 等 | 有条件 | 五个屏名的五语键交 K12 补；补齐之前，非英文页的这些可及名是英文 |
| K11-e | 页内壳一律 headingLevel 2，文档壳保持 h1 | 可接受 | page-has-heading-one 为 0 |
| K11-f | 分类说明挂在 docMenuModel 的二级条目上 | 可接受 | categoryAriaFailures 全空 |

归分片 B、C 判、本分片不判的条目：K1 的 SUB-154、159、162；K4-e 至 g（SUB-155，其中 roles.json 登记 tcrn-shell-strip 属新登记，判断可改回）；K5-160；K11-g 至 j。不可接受的口径一条：K1-146a（转 A2-5）。

## 6. 证据盲区

1. 批末壳层 18 门没有跑：geometry:measure 在 gplus overlap 处停下（18 log:7366）。门读数来自 K12 在 5a5cad2 的运行，该提交之后只有 K12 合入与文档提交；本次用真实浏览器探查补了几何与行为。
2. 批末 verify 不含 test:dom。拖排（指针与 Alt+← / →）和偏好持久化只有源码与 K6 自报的 53/53；文档页没有可拖样板，本次没有实际拖动。
3. 137-GWT3（第 7 项）与 140-GWT4（头像菜单切换产品）本轮没有可用的文档屏，未再实测，依据是 R1 的 jsdom 实测与批末单测。
4. 回执里没有保留按规则拆分的 axe 节点数（逐页只留失败项）。landmark-unique 30、heading-order 4、contrast 4 的拆分取自 K11 自报；批末只有 axeViolationCount 14（30.02 log:12）。
5. 触摸端（pointer: coarse）没有量，Chromium 默认 pointer: fine；粗指针 token 块只读了源码。
6. 锁定块墨迹中线只比了两种量法，没有回到 Brand 板 E 段去量板上的同一锁定块。
7. 登入动画期间不挡输入，依据是源码（卡 inert、层 aria-hidden）与门；动画结束后层已移除，没有在动画中途派发输入。
8. ⌘K 只在多壳的文档页看过；单壳产品页的行为没有实测（组件层在 R1 jsdom 里过）。
9. 摘录点名的主线程问题清单 `runs/r2/problems/main.md` 不存在，本次没有读到主线程的集成与调度记录。
10. 壳框宽 1006（1440 视口），没有在 1240 壳宽下量，几何项与壳宽无关。面板宽受 `min(952, 100vw − 24)` 约束（`shell.css.ts:301、306`），761–975 视口没有实测。
