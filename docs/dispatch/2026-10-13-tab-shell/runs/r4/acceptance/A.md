# R4 批末验收 · 分片 A：EPIC-044 壳层 Shell（STORY-135 至 141）

节行号：§0 L5；§1 L18；§2 L36（2.1 L38，2.2 L48，2.3 L68，2.4 L79，2.5 L91，2.6 L103，2.7 L125，2.8 L138，2.9 L151）；§3 L164；§4 L176；§5 L193；§6 L208

## 0. 被验对象与方法

- 被验：集成分支 `claude/init016-tab-shell`，工作树 HEAD `0c1d4ce`。`git diff --name-only 682fc94 HEAD` 只有 `docs/dispatch/**` 6 个文件，代码等于批末 verify 所在的 `682fc94`。N1 的四个提交（`855b3a4`、`311704d`、`cb2c43c`、`f587342`）经合并 `3d2f13c` 进入；`git log 3d2f13c..HEAD` 对 N1 改过的路径为空，之后没有别的包再改这些文件。R3 批末（`c45c529`）到 `682fc94` 的代码改动里，本分片的组件只有 `Navigation.tsx`、`ShellBrandButton.tsx`、`ShellIntro.tsx` 与新模块 `product-mark-id.ts`；ShellPins、ShellMenu、ShellDropdown、token 源、两块设计正本与 `build-shell2.mjs` 都没有改。
- 读的产物：verify 03 构建的各包 `dist`（18:56），以及之后 `storybook:build`（`storybook-build.exit` 为 0，19:04）产出的 `apps/storybook/storybook-static/`。两者都没有重建。
- 门证据：会话 scratch `r4-verify/`，引用写 `NN log:行号`。18 log 里几何八项的结论在 88 行，探针在 7232–7298 行；壳层门的夹具段从 7394 行起，真件段（`mode: stories`）从 8236 行起，18 门结论在 8249–8268 行。
- 包证据：`runs/r4/handoff/N1.md`、`runs/r4/problems/N1.md`；N1 日志在会话 scratch `logs/r4-n1/`，只读，没有重跑。
- 自写只读探查在会话 scratch `acc-r4-A/`（脚本不入仓）：
  - `probe-r3/`：R3 验收的六个探查脚本原样复制，对本轮静态产物重跑，输出 `geom.json`、`behave3a.json`、`behave3b.json`、`pin7.json`、`docmain.json`、`axe-default.json`。再用 `probe/jdiff.mjs` 与 R3 的同名输出逐字段比：六份的差异都是 0，只有 behave3b 记下的本地端口不同。下文「R3 读数不变」都指这一比对。
  - `probe/datalogo-live.mjs` → `datalogo-live.json`：shells、index、gplus-samples 三页水合后，逐个数 `svg[data-logo]` 的取值、`data-product-mark` 与所属件。
  - `probe/digest-live.mjs` → `digest-live.json`：shells 页水合后，按每个标的 `data-logo` 去 `logos2/<data-logo>.svg` 取源，用同一个 DOM 序列化比两者的主体。
  - `probe/parse18.mjs`、`fails18.mjs`、`beh18.mjs`、`probes-cmp.mjs`：从 18 log 抽出真件读数，并把探针读数与 R3 的 18 log 对比。
- 没有重跑门，没有构建，没有写链，也没有跑包内测试（含 `test:dom`）。判定人写有 Owner 目视的项只给机器判据结论，不代签。

## 1. 一览

| Story | 结论（本轮为最终结论） | 未满足或部分的 GWT | 返工项数 |
| --- | --- | --- | --- |
| STORY-135 壳 token | 阻塞于 Owner（O-19） | GWT4：`contract:static` 退出 1，只有 C8 一族 15 条（13 log:90–100：`story-yield-missing` 14 条、`yield-without-min-width` 1 条），与 R3 相同。GWT1–3 与符合性满足，无回退 | 0 |
| STORY-136 标按钮 | 阻塞于 Owner（O-8） | GWT3：夜间后缀 3.07，与 R2、R3 相同（D7）。A3-1 已由 SUB-212 收掉：标按钮的 `data-logo` 写标的 id，DS 标按钮在 shells 页上按 `data-logo` 能找到源，且主体与 `logos2/ds.svg` 相同。其余 GWT 与符合性满足，无回退 | 0 |
| STORY-137 固定项 | 满足（机器判据） | 无。本轮没有改动，读数与 R3 相同 | 0 |
| STORY-138 完整菜单 | 满足（机器判据） | GWT 全部满足，无回退。START 硬线「标旁文字中线」只有底栏 TMS 锁定块 en 读 1.7（6 处），只等 O-4 | 0 |
| STORY-139 下拉与级联 | 满足（机器判据） | 无。O-3 不挡机判；SUB-180 的 DOM 用例只在包内跑过（O-18） | 0 |
| STORY-140 ProductShell 顶带态 | 满足（机器判据） | 无。A3-2 已由 SUB-213 收掉：纸内滚动区的焦点探针在真件上量到 9 处，违例 0（18 log:7285–7296）。文档壳纸内焦点环被卡片盖住一边，仍是目视项（R3 判断 §3.2） | 0 |
| STORY-141 登入动画 | 满足（机器判据） | 无。A3-1 的飞行标部分已由 SUB-214 收掉；DS、Mana 两例只在包内 `test:dom` 有读数（O-18） | 0 |

返工共 1 条：A4-1，经济档，只改文档。它是 150 的 Owner 目视清单里两处与本分片实测不符的文字（140 的纸内焦点环、O-18 的范围漏了 SUB-214），本分片七张 Story 的结论都不受它影响。主力档 0 条。没有新的只有 Owner 能定的事项。

库门 S-1 仍未声明（main.md M1），七张 Story 都不能在链上转 done，与本结论无关。

本分片剩下的未满足项，以及每项要等的 Owner 裁定：135-GWT4 等 O-19；136-GWT3 等 O-8；138 的硬线「标旁文字中线」（底栏锁定块 en 1.7）等 O-4；136–141 的 Owner 目视；139、140、141 的 DOM 用例证据进不进批末 verify 等 O-18。

## 2. 逐 Story

### 2.1 STORY-135 壳 token（本轮没有 Subtask，只核回退）

| GWT / 判据 | 结论 | 证据 |
| --- | --- | --- |
| GWT1 tokens.json 对 07b F 段 | 满足（无回退） | 05 log:15「section F, one to one, plus the three R2 and three R3 additions」通过。`contract/tokens.json` 与 `tokens.css` 本轮没有改，登入动画与壳 token 仍在 `tokens.css:118–146`（122–124 是三个弃用别名）。R2、R3 加的六条已列进 owner-acceptance 第 329 行，交设计会话补进 F 段；在补进之前，目的锚的「1:1」还差这六条（发布项，不是 Owner 裁定） |
| GWT2 几何不随主题变 | 满足（无回退） | 06.02 log:1「C5 theme blocks declare the same 85 properties」 |
| GWT3 旧名经弃用别名 | 满足（无回退） | 05 log:13、18；`tokens.css:124` `--tcrn-shell-topbar-height: var(--tcrn-shell-strip-h)`；06.06 现为 7/7（06.06 log:13–16；SUB-222 加了一条样本，R3 是 6/6） |
| GWT4 tokens:proof 与 contract:static 退出 0 | 阻塞于 Owner（O-19） | tokens:proof 的 06.01–06.12 全部退出 0（steps.md）。contract:static 退出 1：`node --test` 74/74（13 log:79–82）；门的结论是 `CONTRACT_STATIC_C8_RED`（13 log:90–91），C8 有 15 条发现、豁免 0，其余条款都绿（13 log:100）。规则分布：`C8.story-yield-missing` 14 条、`C8.yield-without-min-width` 1 条，与 R3 相同。这个判据 R2、R3 都返工过，按 R3 判断 §3.1.1 交 Owner |
| 符合性：不新增组件内几何字面值 | 满足（无回退） | 06.10 log:18 `shellGeometryLiterals: 0`。N1 在壳件里的改动只是一处函数调用和一个新模块，没有加数值。图标尺寸实测与 R3 相同：铃铛 20、示意 16、固定项箭头 12、下一级箭头 12、底栏分隔 12、头像图标 14、语言箭头 11（`behave3b` L_sizes） |

### 2.2 STORY-136 标按钮 ShellBrandButton（SUB-212）

| GWT / 判据 | 结论 | 证据 |
| --- | --- | --- |
| GWT1 left 12、top 6、134×40、中线 26 | 满足（无回退） | ts-closed-l：12 / 6 / 134×40，中线 26，en、zh-CN 相同（`geom.json`，R3 读数不变）。brandGeometry 在 24 个 run 里查了 64 处，0 处失败，其余 run 为 n/a（18 log:8250）；变异 story-brand-top-0 判红 |
| GWT2 标的 digest = logos2 | 满足（A3-1 已收） | 门：brandDigest 在 24 个 run 里查了 352 处，0 处失败（18 log:8251）；14 log:7 ok true。按 `data-logo` 找源：shells 页水合后有 39 个标，每个都能在 logos2 里按 `data-logo` 找到文件，主体都与源相同（`digest-live.json`）。其中 3 个是 DS 标按钮（文档壳、navigation-focused-shells-spec、navigation-product-shell-spec），写 `ds`，主体等于 `logos2/ds.svg`；改动之前它们写的是 `design-system`，按这个值去 logos2 找不到文件。单测对四个产品逐个比 SVG 主体的 sha256（05 log:235） |
| GWT3 hover / open 3.5% 墨洗、后缀 ≥ 4.5、空闲透明 | 阻塞于 Owner（O-8，夜间） | 浅色：悬停与打开的底都是 rgba(22,21,15,.035)，后缀 4.53。夜间：底 rgba(235,232,223,.04)，后缀 3.07。空闲：底透明，后缀 4.85，标 opacity 1（`behave3b` K_*，R3 读数不变）。O-8 不裁时的默认是「两主题同色、标红、pending」 |
| GWT4 Esc 后焦点回标按钮 | 满足（无回退） | ts-closed-l：点开以后焦点在搜索框，Esc 后 aria-expanded=false，焦点回到标按钮（`behave3a` C_afterEsc、B_afterEsc）。真件 focusLoop 的 afterEscape 读 "tab"（18 log:12232、12282）；变异 story-focus-not-returned 判红 |
| GWT5 390 宽只有标与示意、可点、高 ≥ 40 | 满足（无回退） | 390 宽：64×40，第一版；点击后打开 Sheet（`behave3a` D_phoneAfterClick、D_phoneTabBox）。1023 宽同为第一版 64×40（`geom.json`） |
| 符合性：圆角 8、无轮廓、示意 20 / chevron 16、标 22、字标 12.5/600 | 满足（无回退） | 圆角 8px，outline none；示意格 20×20，图标 16×16；标 22×22；字标 12.5px / 600（`geom.json`） |
| 符合性：字标墨迹中线 = 标中线 | 满足 | 标按钮在 markText 里全过。失败只落在底栏锁定块（`lkr@22:tms`）与 DS 首行（`lkr-line@22:design-system`），见 2.4 与 2.8。dSection 的「标按钮（v2）」行显示 fail（18 log:12705），原因是这一行挂了 markText 门、红来自别的锁定块，和 R3 一样 |
| 符合性（SUB-212 关联 145）：同一属性只有一种取值 | 满足 | 三页水合后，标按钮、首行、被量锁定块的 `data-logo` 都写标的 id，写成 `design-system` 或 `mana-orchestrate` 的是 0 处；DS 标按钮与同页 DS 首行都写 `ds`，Mana 首行写 `mana`（`datalogo-live.json`）。静态产物 37 页里，`data-logo` 的取值只有 `ds` 55、`tms` 42、`mana` 2、`einzbern` 2 |

SUB-212 判据逐条：
- ① 达成。`productMark` 与 `productMarkIdOf` 在 `Navigation/product-mark-id.ts:18、28`。`Navigation.tsx:27` 从新模块导入，第 628、715 行（原 641、728）读数不变：首行在页上写 tms、einzbern、mana、ds。`src/index.tsx` 与 `components/Navigation/index.ts` 都不引用新模块；`dist/index.d.ts` 与 Navigation 的 `index.d.ts` 里 `productMarkIdOf` 都是 0 处；15 log:6 ok true。新模块的产物 `dist/.../product-mark-id.js` 只导入 `product-marks.generated.js`（类型导入在编译后去掉了），所以运行时没有模块环。
- ② 达成。`ShellBrandButton.tsx:87` 写 `data-logo={productMarkIdOf(productId)}`，`TcrnBrandMark` 仍然收 `productId`；页上读到的 `data-product-mark` 仍是 `design-system`（`datalogo-live.json`）。
- ③ 达成。改写后的用例与新加的用例都在 05 log:235、236 通过；新用例逐个产品比对标按钮与 `ProductLockup` 首行的两种尺度。
- ④ 达成。构建页里写 `design-system` 与 `mana-orchestrate` 的各 0 处；文档壳标按钮与同页首行都写 `ds`；ui-react 单测 258/258（05 log:320–323）、typecheck 退出 0（steps.md 02）、exports:check ok true（15 log:6）。
- 包的自报与实测一致：行号、计数与 storybook 产物里各取值的个数都对得上。

### 2.3 STORY-137 顶带固定项 ShellPins（本轮没有 Subtask，只核回退）

| GWT / 判据 | 结论 | 证据 |
| --- | --- | --- |
| GWT1 三处间距 8、每项 32、中线 26 | 满足（无回退） | 1440 en：146→154、210.77→218.77、312.69→320.69、404.03→412.03。zh-CN：146→154、199→207、270→278、335.5→343.5。每项 top 10、高 32、中线 26（`geom.json`）。pinSpacing 全过（18 log:8254） |
| GWT2 分割线 0；加回左边线判红 | 满足（无回退） | 顶带细线与左右边线都是 0（`geom.json`）；变异 story-pins-left-line 判红 |
| GWT3 7 项只显示 6，第 7 项在菜单里带已固定标记 | 满足（无回退） | `pin7.json` 与 R3 相同：偏好 `tcrn-shell-pins:tms` 存 7 个 id，顶带只显示前 6 个，刷新后不变；第 7 项 Events 在完整菜单里是「Unpin from top bar: Events」（aria-pressed） |
| GWT4 1023 宽顶带无固定项、菜单有「已固定」分组 | 满足（无回退） | ts-narrow-l 的固定项容器 display none；ts-narrow-x-l 面板 `pinnedGroupVisible=true`（`geom.json`） |
| GWT5 选中 6%、600、无左边条、对比度等于 B 段 | 满足（无回退） | Roster 浅色底 .06、夜间 .07，字重 600，border-left 0（`geom.json`）；contrast 门在 24 个 run 里查了 240 处，0 处失败（18 log:8262） |
| 符合性：hover 3.5%、右上簇 | 满足（无回退） | Statements 的悬停预览为 .035；铃铛 32、头像 28、中线 26；簇右 994 = 纸右 994（1023 宽 897，390 宽 288）（`geom.json`） |

### 2.4 STORY-138 完整菜单 ShellMenu（本轮没有 Subtask，只核回退）

| GWT / 判据 | 结论 | 证据 |
| --- | --- | --- |
| GWT1 top 52、left 12、width 952、接续 6 | 满足（无回退） | ts-x-l：面板 12 / 52 / 952×290，52 − 46 = 6，en、zh-CN 相同（`geom.json`）；continuation 全过（18 log:8255） |
| GWT2 收起钮 0；锁定块不是按钮、不在 Tab 序列 | 满足（无回退） | 锁定块是 `div[role=img]`，tabIndex −1，可聚焦后代 0（`geom.json`）；noCollapse、lockupDecor 全过（18 log:8259、8261）；变异 story-x-button-back、story-lockup-as-button 判红 |
| GWT3 底栏锁定块上下留白相等 | 满足（无回退） | 底栏 290–342（上边线 1px），锁定块 294.5–338.5，上下留白各 3.5；右缘 948 = 964 − 16（`geom.json`）；barCentering 全过（18 log:8256） |
| GWT4 ⌘K 聚焦搜索、Esc 回标按钮、点外部关闭 | 满足（无回退） | 不带参数时按 Ctrl+K 或 ⌘K，新打开的只有文档壳，焦点在它的搜索框，Esc 回它的标按钮；带 `?shell-shortcut=ts-closed-l` 时只开 ts-closed-l（`behave3a` A_*、B_*）；点外部关闭（C_afterOutside）。真件 afterCommandK 读 "search"（18 log:12233、12283） |
| GWT5 阴影模糊 ≤ 3 | 满足（无回退） | 三层模糊 [3, 3, 0]（`geom.json`）；shadowBlur 全过（18 log:8264）；变异 story-panel-shadow-12 判红 |
| 符合性：dialog 非模态、方向键、无产品清单 | 满足（无回退） | role=dialog，aria-modal=false；↓ 依次到 Roster、Teams、Contracts，→ 进第 2 列，← 回来（`behave3a` C_arrows）；菜单与锁定块里的产品项 0（`behave3b` G_menuLockupProducts） |
| 硬线：标旁文字中线（底栏锁定块） | 部分（只等 O-4） | `lkr@22:tms` 的 ink-mark 读 1.7：ts-x-l、ts-x-n、ts-search-l（18 log:8336、8342、8348，夜间 8488–8500），ts-narrow-x-l（8895、9028），shell-matrix 两处（10488、10494、10784、10790）；zh-CN 不红。与 R2、R3 读数相同 |

### 2.5 STORY-139 下拉与级联（本轮没有 Subtask，只核回退）

| GWT / 判据 | 结论 | 证据 |
| --- | --- | --- |
| GWT1 left = 项 left、top = 项底 + 6、宽 240、搜索 28 | 满足（无回退） | 真实点击 ts-closed-l 的「Contracts」：left 435.77 = 435.77，top 491.53 = 485.53 + 6，宽 240（`behave3a` C_afterPinClick）。静态屏 ts-drop-l：218.77 = 218.77，48 = 42 + 6，内距 6，搜索 228×28（`geom.json`） |
| GWT2 第二列 +4、宽 240、高等于第一列 | 满足（无回退） | 点「Templates」以后，第二列 left 679.77 = 675.77 + 4，宽 240，高 180 = 180（`behave3a` C_afterRowClick）；cascade 全过（18 log:8258）；变异 story-column-2-height-auto 判红 |
| GWT3 悬停 500ms 不出第二列 | 满足（无回退） | 真实悬停 600ms，级联列 0（C_afterHover600） |
| GWT4 ← 回同一行；Esc 全关、焦点回固定项 | 满足（无回退） | → 到「Signing contracts」，← 回「Templates」；Esc 后全关，焦点回「Contracts」（C_afterArrowLeft、C_afterDropEsc）；真件 cascadeArrowLeft 从第 2 列回到第 1 列（18 log:12239、12289） |
| GWT5 下拉搜索只匹配子树 | 满足（无回退） | 输入「Templ」得到 4 条，都在 Contracts › Templates 下；「Agency」1 条；「Roster」「Live」各 0 条（`behave3b` M_drop_*） |

SUB-180 的三条 DOM 用例在 N1 的 `test:dom` 里仍是全过（`logs/r4-n1/216-test-dom.log:44–46`；总数 58 → 60，多出的 2 条是 SUB-214 加的，:73–76）。批末 verify 不跑 test:dom（O-18）。

### 2.6 STORY-140 ProductShell 顶带态（SUB-213）

| GWT / 判据 | 结论 | 证据 |
| --- | --- | --- |
| GWT1 顶带 52、无底无线；纸 52 / 12 / 14 | 满足（无回退） | 顶带 52，背景透明，四边边线 0，无阴影；纸 left 12、top 52，右、下各 12，圆角 14，阴影是 s1 两层；三个视口相同（`geom.json`）。strip、edges 全过（18 log:8252、8253）；几何八项 ok true（18 log:88） |
| GWT2 常驻侧栏与收起钮 0 | 满足（无回退） | 各屏侧栏 0（`geom.json` sidebar=0）；收起钮见 2.4 GWT2。smoke 现在把退役的侧栏切换钮当失败项来查，15 处读 `retiredSideNavToggleCount: 0`（17 log；SUB-220 把空读回改成了失败即判红） |
| GWT3 第 7 项保存、顶带显示 6；拖排后顺序持久化 | 满足（无回退） | 拖排得到 Contracts、Statements、Roster、Schedule，localStorage 同值，重载后保留；Alt+→ 后为 Statements、Contracts、Roster、Schedule，焦点留在 Contracts，重载后保留（`behave3b` F_*）。第 7 项见 2.3 GWT3 |
| GWT4 头像菜单含切换产品；菜单与锁定块无产品清单 | 满足（无回退） | 头像菜单的 nav「Closed band · Switch product」列 5 个产品，TMS 为 aria-current=page；完整菜单与锁定块的产品项 0（`behave3b` G_*） |
| GWT5 旧 prop 在类型层被拒、迁移说明有条目 | 满足（无回退） | `Navigation.test.tsx` 仍有 19 处 `@ts-expect-error`；02 typecheck 退出 0；迁移说明 M20（`migration-4.0.md:627`）、M21（:677）都在 |
| 符合性：三缘对齐 | 满足（无回退） | 标按钮左 = 纸左 = 菜单左 = 12；簇右 994 = 纸右 994（1023 宽 897，390 宽 288） |
| 符合性：geometry:proof、shell:parity | 满足（无回退） | 10 log:5 ok true，redThenGreen 七项都是红绿成立（含 searchOverlay、searchClearPanel）；11 log:5 ok true，基线不红、变异红、复原绿 |
| 符合性：地标名按实例区分 | 满足（无回退） | 30.02 log:12 `axeViolationCount: 0`；菜单打开态的 axe landmark-unique 在 en、zh-CN 都是 0（`behave3b` I_axe_menuOpen_*） |
| 符合性：纸内滚动区焦点可见（SUB-182 ③，本轮 SUB-213） | 满足（A3-2 已收） | 门：探针 paperFocusRing 在 shell-top-band 上的读数是 pass，checked 9、regions 9、violationCount 0（18 log:7285–7296）。9 就是该 story 的 9 块 ProductShell 纸。门的结论要求每个探针都是 pass（`geometry-measure-proof.mjs:662`），所以读不到会判红；测试另外断言 regions ≥ 1（18 log:75 通过）。截图取样（`behave3b` H_light、H_dark）与 R3 相同：ts-closed-l 四边各 5 点，浅色全是 #0b6b65，夜间全是 #3fc7b7。文档壳的纸内滚动区获焦时底边 25%、50%、75% 处仍被伸到纸边的 story 卡片盖住，滚到底后换成顶边被盖（`docmain.json`，与 R3 相同）。这一点门量不到，按 R3 判断 §3.2 归目视，见 A4-1 |
| 符合性：O-1 几何撤出、⌘K 开关、shellFrame | 满足（无回退） | SUB-183 删掉的两个死名（`--tcrn-motion-product-shell-search`、`typographyCss03`）在 packages、apps、scripts、tests 下 `git grep` 为 0 处；06.01、06.11 ok true；README 第 334–336 行与迁移 M41（:1168）都在；18 log:88 ok true |

SUB-213 判据逐条：
- ① 达成。`STORY_PROBES` 加 `{ id: "paperFocusRing", storyId: "shell-top-band", source: "140 SUB-182" }`，`PAGE_PROBES` 把它接到 `focusRingClipInPage`（`geometry-measure-proof.mjs` 合入 diff）。
- ② 达成。`activeProbes` 与 `probeRoutes` 照 `mutationRoutes` 的写法单独解析路由；`scripts/lib/storybook-routes.mjs` 没有改（R4 的 diff 里没有这个文件）。读之前先 `expandStory`，再等水合。
- ③ 达成。阈值与判定没有改。其余四个探针的读数与 R3 的 18 log 完全相同：buttonGroupFocusRing 10 / regions 0、datePicker 2、highlight 4 / 0.02、iconStroke 76（`probes-cmp.txt`）。
- ④ 达成。id 清单与真件断言都改了，18 log:77–80 显示 72/72（条数与 R3 相同：新加的是断言，没有加新用例）。
- ⑤ 达成。批末读数与包自报一致（checked 9、regions 9、violationCount 0）。仓里的 `docs/verification/geometry-measure/report.json` 由 SUB-224 重生成（`0d9c6a7`），也带上了 paperFocusRing pass / 9。

### 2.7 STORY-141 登入动画 ShellIntro（SUB-214）

| GWT / 判据 | 结论 | 证据 |
| --- | --- | --- |
| GWT1 三段 120 / 240 / 100，总 ≤ 700 | 满足（无回退） | 首载记到 8 段：卡 opacity 0–120；标 transform 120–360；首行 opacity 0–360；字标、示意、固定项、簇与纸在 360–460；总长 460（`behave3a` E_introFirst）。真件 intro 全过（18 log:8265；durationMs 477 / 493 是挂钟读数，18 log:12256、12306） |
| GWT2 刷新不再播；去掉标记判红 | 满足（无回退） | sessionStorage `tcrn-shell-intro` = "played"；刷新后 0 段（E_introReload）；reloadPlays 0（18 log:12250、12300）；变异 story-intro-no-session-marker 判红 |
| GWT3 reduced-motion 0 次 | 满足（无回退） | 0 段，标记照写（E_introReduced）；reducedMotionPlays 0（18 log:12251、12301） |
| GWT4 动画中的标与 logos2 同源 | 满足（A3-1 已收） | 门：shell-intro 4 个 run 的 brandDigest 都过（18 log:9879、10002、10125、10248，每个 run 查 3 处）。`ShellIntro.tsx:339` 写 `data-logo={productMarkIdOf(productId)}`；第 164、215 行的选择器没变。DS、Mana 两例在 N1 的 test:dom 里：改前红 2 条，读到的是 `design-system` 与 `mana-orchestrate`（`logs/r4-n1/214-before-test-dom.log:73–76、85–121`）；改后 60/60，飞行标写 `ds`、`mana`，主体与 `logos2/ds.svg`、`logos2/mana.svg` 相同，并与落点标按钮的标是同一个主体（`214-test-dom.log:52–53、73–76`；`216-test-dom.log` 同） |
| 符合性：只用 transform 与 opacity、不挡输入 | 满足（无回退） | 记到的属性只有 opacity 与 transform（E_introFirst；18 log:12249–12256 的 properties）；ShellIntro 本轮只改了 data-logo 的取值 |
| 读回句五语 | 满足（无回退） | en、zh-CN、ja、ko、fr 五页都是本语言的句子（`behave3b` J） |

SUB-214 判据逐条：① 达成（行号如上）。② 达成：两例写在 `src/test/shell-intro.dom.spec.tsx`，用的是与 tms 用例相同的写法；测试用的壳与登入卡可以传产品，默认 tms。③ 达成：条数 58 → 60，多出的 2 条都在这个文件；改前与改后的读数都有日志。包的自报与日志一致。批末不跑 test:dom，这两例只有包内读数（O-18，见 §4）。

### 2.8 START 质量硬线（本分片涉及的八条）

| 硬线 | 结论 | 证据 |
| --- | --- | --- |
| 壳内常驻侧栏与收起钮 0 | 满足 | 2.6 GWT2、2.4 GWT2；noCollapse 全过（18 log:8259） |
| 顶带无底无线、中线 26 | 满足 | 2.6 GWT1；标按钮、四个固定项、铃铛、头像的中线都是 26（`geom.json`） |
| 三处间距相等 | 满足 | 2.3 GWT1，en、zh-CN 都是 8 |
| 接续 6 | 满足 | 菜单 52 − 46；下拉 48 − 42（静态屏）与 491.53 − 485.53（真实点击）；continuation 全过 |
| 锁定块只装饰 | 满足 | 2.4 GWT2；lockupDecor 全过 |
| 品牌资产 digest | 满足（R3 的潜在缺口已收） | brandDigest 352 处全过、14 log:7 ok true；shells 页 39 个标按 `data-logo` 都找得到源且主体相同，其中有 3 个 DS 标按钮（`digest-live.json`）；静态产物里写成产品键的 `data-logo` 是 0 处 |
| 标旁文字中线 | 部分（只等 O-4） | 标按钮全过。底栏 TMS 锁定块 en 1.7（138，6 处）与 DS 首行 1.4（145，18 log:11606、11786、11966、12146）是 markText 仅有的失败（18 log:8257）。steps.md 第 57 行与 main.md M2 已把两处都写上（R3 §4 第 2 条的读数更正已收） |
| 登入动画只用 transform 与 opacity | 满足 | 2.7 |

### 2.9 R3 返工项与 R3 交 Owner 事项的复核

| R3 项 | R4 承接 | 结论 | 依据 |
| --- | --- | --- | --- |
| A3-1 标按钮、登入动画的 data-logo 写产品键 | R4-1 / SUB-212、SUB-214 | 已收 | 2.2 GWT2、2.7 GWT4、2.8 品牌资产 |
| A3-2 纸内焦点探针在真件上读数为 0 | R4-2 / SUB-213 | 已收 | 2.6 焦点一行 |
| R3 §4 第 1 条 C8 | O-19 | 未变，只等 Owner | 13 log:90–100 |
| R3 §4 第 2 条 markText 补 1.7 读数 | O-4 | 读数更正已收；判定仍只等 O-4 | steps.md:57；main.md M2 |
| R3 §4 第 3 条 O-8 | — | 未变 | `behave3b` K_hoverNight 3.07 |
| R3 §4 第 4 条 不注册 ⌘K 的屏仍画提示 | R3 判断 §3.4 第 4 条：保持现状，由 R4-8 写一句说明 | 已收 | `packages/ui-react/README.md:336`、`migration-4.0.md:1413`；文档屏仍画「Ctrl K」（`docmain.json` closedMenuHint），与裁定一致 |
| R3 §4 第 5 条 O-3、O-18 等 | — | 未变 | §4 |
| R3 判断 §3.2：文档壳纸内焦点环被卡片盖住，列为目视 | SUB-224 的目视清单 | 读数未变；清单第 218 行没写盖住这一点 | A4-1 |

## 3. 返工清单

**A4-1 · Owner 目视清单里有两处与本分片实测不符（经济；只改文档）**

- 现象：
  1. `owner-acceptance.md:218`（第三轮新增目视项）把纸内焦点环写成「环整圈落在纸里并跟着纸的圆角；内容滚到上下边时，环在内收阴影上方」，看哪里写的是「任一文档页的纸；shell-top-band 各屏」。实测在文档壳上并非如此：获焦时底边 25%、50%、75% 处被伸到纸边的 story 卡片盖住，滚到底后换成顶边被盖（内收阴影画在内容之下）。R3 判断 §1（140 行的目视项写明「文档壳底边被卡片盖住」）与 §3.2 都要求把这一点列进目视、由 Owner 决定是否接受；R4 的 SUB-224 改清单时没有带上这句。Owner 照现在的文字看文档页，要么以为是缺陷，要么不知道要判这一点。
  2. `owner-acceptance.md:390`（待裁表第 28 行，O-18）写「SUB-180、SUB-184、SUB-185 的 DOM 用例只由局部门看」，漏了 R4 的 SUB-214：141-GWT4 在 DS、Mana 两个产品上的读数也只在包内 test:dom 里（2.7）。Owner 裁 O-18 时会少算一张 Story。
- 证据：`docmain.json` 的 samplesTop.bottom 与 samplesScrolled.top，第 2–4 个取样点都是 255,255,255，与 R3 相同；R3 判断 §1、§3.2；SUB-224 判据③（没有要求带上这句）；N1 交回第 2 节与 `logs/r4-n1/214-*.log`。
- 改法：第 218 行在原句后补一句：「文档壳的纸内可以滚动，获焦时底边被伸到纸边的 story 卡片盖住，滚到底后换成顶边被盖（内收阴影画在内容之下；R3 判断 §3.2，请 Owner 目视时定是否接受）」。第 390 行的名单补上「SUB-214（141-GWT4 的 DS、Mana 两例）」。其余行不动。
- 改动文件：`docs/dispatch/2026-10-13-tab-shell/owner-acceptance.md`。按 grep，`scripts/`、`tests/`、`apps/storybook/src` 与各包 `src` 都不读这个文件，也不引用 `docs/dispatch` 路径，所以不用重跑门、不用再生成物。建议随收口时的文档提交一起改，不必为它单开一轮或一个包。
- Story：两处都在 150 的清单里，内容分别涉及 140（目视项）与 141（证据范围）。不改变本分片七张 Story 的结论。分片 C（150）如果也报了，合并为一条。

## 4. 只有 Owner 能定的事项

本分片没有新的 Owner 事项。沿用的事项按挡住的判据列出（编号与建议见 R3 判断 §3.1、owner-acceptance 第 357–391 行）：

1. **O-19 顶带的 C8 让步项**：唯一挡住 135-GWT4。读数没变（15 条）。建议照 R3 判断：选甲，裁定顶带按板。
2. **O-8 夜间 TMS 后缀色**：唯一挡住 136-GWT3。读数 3.07 没变。建议随 S-6 一并裁。
3. **O-4 墨迹中线遇下行字母**：挡住 138 的硬线读数（底栏锁定块 en 1.7），也是 145-GWT2 的阻点（DS 首行 1.4）。建议照 R3 判断：两行锁定块只量首行，改量「首行大写顶到基线」。
4. **O-18 批末 verify 不含 test:dom**：本轮多了一组只在包内跑过的 DOM 用例，即 SUB-214 的两例（141-GWT4 的 DS、Mana）。它与 SUB-180（139）、SUB-184 与 SUB-185（140）一样，只有包的日志。不挡机判。建议照 R3 判断：批末 verify 之后加跑只读的 test:dom。
5. 不挡机判、状态不变：O-1（136 长字标）、O-3（139 级联越过视口右缘）、O-10（140 头像菜单几何）、O-11（140 窄屏按视口切还是按容器切）、O-12（139 下拉不显示 ⌘K）、O-13（141 纸升起的距离）、O-14（136 Story 字重文字）。
6. Owner 目视（只说状态，不代签；页面 `components-navigation-shells.html`，清单是 owner-acceptance 第 7、8 节与第三、四轮新增节）：
   - 136：标按钮两版、hover / open、390 宽、长字标（O-1）、夜间后缀（O-8）。
   - 137：固定项、选中态、1023 宽的「已固定」分组。
   - 138：完整菜单与底栏锁定块；⌘K 只开一个壳。
   - 139：下拉与级联（O-3）。
   - 140：顶带壳、铃铛 6%、拖排与产品切换；纸内焦点环，其中文档壳的一边被卡片盖住，要 Owner 定是否接受（A4-1 改好清单文字后再看）。拖排以后板上的指针悬停画面跟着 Statements 走（G-19）。
   - 141：登入动画（本轮画面不变，只改了 data-logo 的取值）。

## 5. 实施口径判定

编号为「包-条」，条目按 N1 交回第 4 节「写明的选择」的顺序；只判本分片 Subtask（SUB-212、213、214）的条目。

| 包-条 | 选择 | 判定 | 理由 |
| --- | --- | --- | --- |
| N1-1 | 共用模块用默认名 `product-mark-id.ts`，导出 `productMark` 与 `productMarkIdOf`；错误文案不变；ShellBrandButton 自己按产品键找标、取名字与字标的那一步不动 | 可接受 | 判据①要求连同按产品键找标那一步一起搬。模块不在任何入口导出（src 两个入口都不引用，产物 d.ts 里 0 处，exports:check ok）。它只从 Navigation.tsx 取类型，产物里没有回指，`Navigation.tsx:445–448` 在载入时调用 `productMark` 不受模块环影响。ShellBrandButton 自己那一步不在判据内，动了反而扩大改动面；没有标的产品（AOS）两处都会抛错，改前也是这样，行为没变 |
| N1-2 | 探针 id 用默认名 `paperFocusRing` | 可接受 | 判据允许改名，没有改 |
| N1-3 | 等水合的写法对所有探针通用：story 里没有 `[data-shell-hydrate]` 块时立即通过；超时则记 status error（`shell_blocks_not_hydrated`），整次运行不崩 | 可接受 | 其余四个探针的读数与 R3 一字不差（`probes-cmp.txt`）。error 与 n/a 都会让门判红（`geometry-measure-proof.mjs:662` 要求每个探针都是 pass），写法是失败即关 |
| N1-4、N1-5 | SUB-216 取 `--tcrn-space-0h`；SUB-216 的探针只读浅色、en 三个视口 | 不判 | 属 146，归分片 B 或 C |

拆分里落到本分片、按默认执行的三项也一并判：问题 2（探针单独解析路由，不改共享的路由模块）可接受，理由见 2.6 ②；问题 3（两例写进 DOM 用例，交回给条数）可接受，飞行标只在 playing 态渲染，SSR 单测读不到；问题 4（壳层门不扩到 DS、Mana 的标按钮，验收用单测与构建页读数）可接受，本次另用 `digest-live.json` 在真页上补了 DS 标按钮的读数。

不可接受的口径：无。

## 6. 证据盲区

1. 批末 verify 不含 test:dom（O-18）。SUB-214 的两例与 SUB-180、184、185 的 DOM 用例，只读了包的日志（`logs/r4-n1/`），本次没有运行。
2. 静态产物里没有渲染 Mana 的标按钮，所以 Mana 标按钮只有 SSR 单测作证（05 log:235–236）。壳层门的 brandDigest 也不量 DS、Mana 的标按钮（判断定为不扩覆盖面），DS 标按钮只有本次的探查读数。DS、Mana 这两个产品以后如果回退，门看不到，要等下一次改壳层门读法的单把覆盖面扩上去（R3 判断 §3.2）。
3. paperFocusRing 只在浅色下量（`themes[0]`）。夜间读数来自本次的截图取样，只取了 ts-closed-l；zh-CN 没有取样。探针只比环的外扩与裁切祖先，量不到「内容盖住内收环」，文档壳那一边只能靠目视。
4. 新发现（N1 问题 4），不列返工：`focusRingClipInPage` 的 `cutOf` 把 overflow 不是 visible 的祖先一律当成在盒边裁剪，没有把 `overflow-clip-margin` 算进去。现在被量的 story 里没有一个在 collapsible region 内，本轮读数不受影响。以后如果把控件放进 collapsible region 再量，会报出假红。这和 R3 判断 §3.2 记的「壳层门读法余项」同类，建议并进下一次改壳层门读法的单。N1 问题 2、3（collapsible region 里焦点环仍被裁 2px；WebKit 是否支持 `overflow-clip-margin`）属 146，归分片 B 或 C。
5. 触摸端（pointer: coarse）没有量；拖排只在 1440 宽下用鼠标测过，没有测触摸，也没有测 RTL。
6. 登入动画不挡输入：依据是源码与门，没有在动画中途派发输入。
7. 只量了 1440、1023、390 三个宽度，761–975 之间没有实测。所有探查都在 Chromium 上跑，没有看 WebKit。
8. 分片 B、C 的 Story（142–150）只在影响本分片判据的范围内读过，例如 C8 计数、清单文字、迁移 M49，没有逐条验。
