# R1 批末验收 · 分片 A：EPIC-044 壳层 Shell（STORY-135 至 141）

节行号：§0 被验对象与方法 L5；§1 一览 L20；§2 逐 Story L36（2.1 STORY-135 L38；2.2 STORY-136 L51；2.3 STORY-137 L66；2.4 STORY-138 L79；2.5 STORY-139 L95；2.6 STORY-140 L109；2.7 STORY-141 L127；2.8 START 质量硬线 L139）；§3 返工清单 L152；§4 只有 Owner 能定的事项 L233；§5 实施口径判定 L243；§6 证据盲区 L309

## 0. 被验对象与方法

- 被验：集成分支 `claude/init016-tab-shell`，工作树 HEAD `03bcf25`；`git diff --stat 63e1ee2 HEAD` 只有 `docs/dispatch/**` 5 个文件，代码等同批末 verify 所在的 `63e1ee2`。
- 读的产物：verify 03 构建的各包 `dist`（04:52）与其后 `storybook:build`（退出 0）产出的 `apps/storybook/storybook-static/`，都没有重建。
- 门证据：verify 逐段日志，引用写 `NN.MM log:行号`（会话 scratch `r1-verify/`）；壳层 18 门读 SUB-140 在 `f98b298` 提交的报告 `docs/verification/shell-measure/report.json`（下称「壳层报告」）。批末 `shell-measure-proof` 没有跑（§6）。
- 自写只读探查放在会话 scratch `acc-r1-A/`，脚本不入仓：
  - 静态页 DOM 读数：`probe-static.mjs`、`probe-static3.mjs`、`measure-fn*.js`，Playwright 打开 `components-navigation-shells.html#<story>`，分两种口径。
    - 「文档原样」：`static-1440.json`、`static-1440-b.json`、`s3-1023-docs.json`。
    - 「消费方样式」：运行时停用页面里 `data-tcrn-component-style-scope=".story-body"` 那份比对样式副本，不改文件；读数在 `s3-1440.json`、`s3-1023.json`、`s3-390.json`。
    - 层叠来源：`rules-search.json`。
  - 行为：`behave.mjs`、`behave2.mjs` 在 jsdom 里挂 `packages/ui-react/dist` 的真件（ProductShell、ShellIntro、控制器），派发点击、悬停与键盘事件；ShellIntro 记录 `Element.animate` 调用并给两枚标定盒（同 P5 DOM 测试）。结果在 `behave.json`、`behave2.json`。
  - token：`tokens.mjs` → `tokens.txt`。
  - 截图：`brand-closed-l.png`（3x）、`menu-docs-artifact.png`。
- 没有重跑门，没有构建，没有写链，也没有运行包内测试。结论用语按摘录。判定人写有 Owner 目视的项只给机器判据结论，不代签。

## 1. 一览

| Story | 结论 | 未满足或部分的 GWT | 返工项数 |
| --- | --- | --- | --- |
| STORY-135 壳 token | 部分 | GWT4 不满足：tokens:proof 退出 1。同源判据的测试批末红 | 2（A1-1、A1-10） |
| STORY-136 标按钮 | 部分 | GWT3 部分：夜间后缀 3.07，D7 待裁。GWT4 组件满足、门红。另有字标截断与 1px 裁切（符合性） | 3（A1-2、A1-3、A1-6） |
| STORY-137 固定项 | 部分 | GWT5 部分：「对比度与 B 段相等」未证，contrast 门红在 shell-matrix，归分片 C | 0 |
| STORY-138 完整菜单 | 部分 | GWT1 消费方满足、文档页呈现破损。GWT4 组件满足、门红。锁定块钩子缺口（符合性） | 3（A1-4、A1-5、A1-6） |
| STORY-139 下拉与级联 | 部分 | GWT1 消费方满足、文档页搜索 260 高。GWT4 组件满足、门红 | 2（A1-5、A1-6） |
| STORY-140 ProductShell 顶带态 | 部分 | GWT3 部分：只有控制器层，UI 无拖排。符合性：shell:parity 与 geometry:proof 红，brand.css.ts 残留 O-1 选择器 | 4（A1-5、A1-7、A1-8、A1-9） |
| STORY-141 登入动画 | 部分 | GWT1–4 组件层满足。判定门 intro 红，静态页无客户端挂载 | 1（A1-6） |

返工共 10 条：主力 4（A1-5、A1-6、A1-7、A1-8），经济 6（A1-1、A1-2、A1-3、A1-4、A1-9、A1-10）。

库门 S-1 未声明，七张都不能在链上转 done；这与本结论无关。

## 2. 逐 Story

### 2.1 STORY-135 壳 token（SUB-113，P1a）

| GWT / 判据 | 结论 | 证据 |
| --- | --- | --- |
| GWT1 tokens.json 对 07b F 段 | 满足 | 20 条（shell 16、motion intro 4）在 `packages/ui-tokens/src/tokens.css` 的值逐条等于 C-2 表（`tokens.txt`：20/20）。`contract/tokens.json` 键齐。05 log:15「…section F, one to one…」过 |
| GWT2 主题无关同属性集 | 满足 | 20 条只出现在 `:root` 主题无关块，light 与 dark 块都没有（`tokens.txt`）。05 log:11 C5 用例过；06.02 `tokens-sync --check` 退出 0 |
| GWT3 旧名经弃用别名 | 满足 | 三个旧名仍能解析：`--tcrn-shell-sidebar-width` 220px、`-collapsed` 52px、`--tcrn-shell-topbar-height` = `var(--tcrn-shell-strip-h)`。`tcrnDeprecatedTokens` 三条（两条 replacement null），别名表一条。CHANGELOG.md:118–128 有退役小节。05 log:17 过；06.06 退出 0 |
| GWT4 tokens:proof 与 contract:static 退出 0 | 不满足 | contract:static 13 退出 0。tokens:proof（06.01–06.12）退出 1，两段红：① 06.08 fonts-proof 覆盖段，U+94DB「铛」不在已发子集（06.08 log:11–13），字来自 `storybook-locale-text.ts:116` 的 shell-matrix 描述；② 06.10 shell-fidelity，文档样式与组件样式重复选择器 2 处、`story-demo-styles.ts` 包类外观 4 处（06.10 log:18–33）。两处根因都不在 SUB-113 的文件（A1-10） |
| 符合性：同源 | 部分 | 05 log:16、36 红：测试在 `build-shell2.mjs` 里找 `.scr.ts{` 行，读到 undefined。SUB-133 在 `0f4e670` 把 screen() 移到了 `tools/shell-screen.mjs:32`；我方比对该行 12 个默认值，与 token 仍然相等，只是测试读的路径过期（A1-1）。这条红让 verify 05 停在 ui-tokens，ui-react、storybook、两个 pilot 的测试批末都没有执行 |
| 符合性：不新增组件内几何字面值 | 部分 | `shell.css.ts` 有标尺寸 22px（67、612 行）、触摸 44px（137–138 行）与 12.5、10、11.5 字号字面值。P1a 问题 2、4 已记，属 C-17 下的数据缺口（§5 P1a-1） |

SUB-113：包自报全绿（交回 P1a §2）。实测在批末：GWT1–3 达成，GWT4 与同源测试红。自报与实测不一致，原因是后合入的 SUB-133 与 shell-matrix 文案，以实测为准。

### 2.2 STORY-136 标按钮 ShellBrandButton（SUB-114，P1a）

| GWT / 判据 | 结论 | 证据 |
| --- | --- | --- |
| GWT1 left 12、top 6、134×40、中线 26 | 满足 | ts-closed-l：12 / 6 / 134×40、中线 26（`static-1440.json` brand，两种口径相同）。壳层报告 brandGeometry pass。文档里壳框宽 1006 而不是 1240，这几项几何与壳宽无关 |
| GWT2 标 SVG digest = logos2 | 满足 | `svg[data-logo="tms"]` 的两条 path、一个 circle 与 `logos2/tms.svg` 属性逐项相同（`static-1440.json` markSvg 对 `behave2.json` logos2Shapes）。14 brand-asset:proof 退出 0。壳层报告 brandDigest 的红只在菜单锁定块（2.4，A1-4） |
| GWT3 hover / open 3.5% 墨洗、后缀 ≥ 4.5、空闲透明 | 部分 | 悬停底：浅色 rgba(22,21,15,.035)，夜间 rgba(235,232,223,.04)（`s3-1440.json` hover）。open 底同值（ts-x-l brandStyle）。空闲透明，标 opacity 1。后缀 #2c63c8 叠在画布 + 墨洗上：浅色 4.53，夜间 3.07（按 token 计算）。夜间是 D7 已知待裁（S-6）；`ShellBrandButton.test.tsx:168–177` 断言两个主题都 ≥ 4.5，因此恒红（M3；P1c、P5、P1d 交回都记了这条既有红）→ A1-2 |
| GWT4 Esc 后焦点回标按钮 | 满足（组件层） | jsdom：点标按钮开菜单，焦点进搜索框；Esc 后 activeElement 是标按钮（`behave.json` escapeFromMenu、cmdK.afterEsc）。静态页上的门 focusLoop 红：afterEscape 读到 "unopened"，tab click 3000ms 超时（壳层报告 behaviour），A1-6 |
| GWT5 390 宽只有标与示意、可点、高 ≥ 40 | 满足 | 390 视口 ts-m-l 标按钮 64×40，字标不显示，按钮未禁用（`s3-390.json`）；1023 视口相同（`s3-1023.json`）。静态页的 `data-shell-brand` 仍报 v2（客户端挂载后才改写），视觉上已是第一版 |
| 符合性：圆角 8、无轮廓、示意 20 / chevron 16、标 22、字标 12.5/600 | 满足 | `static-1440.json`：圆角 8px，无边框，outline none，box-shadow 透明；toggle 20×20、icon 16；标 22；字标 12.5px/600 |
| 符合性：字标墨迹中线 = 标中线 | 满足 | 盒中线 26 = 标中线 26；墨迹口径看壳层报告 markText pass，变异「字标加 padding-top 4」能翻红 |
| 符合性：文案原样（D2） | 不满足 | TMS 字标实宽 60.234，格宽 60（Range 读数），`text-overflow: ellipsis` 让所有屏都显示「TCRN T…」（`brand-closed-l.png`）。后缀 `em` 行盒 17 高，`b` 行高 15 且 overflow hidden，上下各溢出 1px。由此 18 log:3487–3494 clip 红（六样板 × 两主题，各 2 处）、19 log 尾 clip 红、壳层报告 singleLine 36 处红（ts-closed、x、drop、narrow、intro）→ A1-3 |

SUB-114：包自报全绿（交回 P1a §2）；P4 回改后缀后单测恒红一条（M3）；截断与裁切 P1a 没量到，P1d 问题 2、P14 问题 1 记过。以实测为准。

### 2.3 STORY-137 顶带固定项 ShellPins（SUB-115，P1a）

| GWT / 判据 | 结论 | 证据 |
| --- | --- | --- |
| GWT1 三处间距 8、每项 32、中线 26 | 满足 | 四项都在 top 10，高 32，中线 26。间距读数：标按钮右 146 → 首项 154；210.77 → 218.77；312.69 → 320.69；404.03 → 412.03，四处都是 8（`static-1440.json` pinItems）。壳层报告 pinSpacing pass |
| GWT2 分割线 0，加回左边线判红 | 满足 | 顶带内可见边线 0，没有细线伪元素（stripSeparators 为空）。壳层报告变异 `story-pins-left-line` turns red |
| GWT3 7 项只显 6，第 7 项在完整菜单带已固定标记 | 满足 | jsdom 固定 7 项时顶带渲染 6 项。第 7 项 Reports 在 System 分组里的图钉钮 aria-pressed=true，在「已固定」分组里也有（`behave.json` sevenPins、`behave2.json` sevenPinsReports）。`shellPinsOverflowIds` 返回第 7 项 |
| GWT4 1023 宽顶带无固定项、菜单有「已固定」 | 满足 | 1023 视口 shell-narrow：固定项组不可见，ts-narrow-x-l 的 Pinned 分组可见（`s3-1023.json`）。这依赖视口媒体查询，1440 视口下的 1023 画框仍是桌面排布（P1d 问题 3，已知） |
| GWT5 选中 6% 墨洗、600、无左边条、对比度等 B 段 | 部分 | 「Roster」a[aria-current=page]：浅色底 rgba(22,21,15,.06)，夜间 rgba(235,232,223,.07)，字重 600，border-left 0（`s3-1440.json` pinInner）。「每格对比度与 B 段相等」未证：壳层报告 contrast 在 shell-matrix 有 80 处 ratio-expect 不符，P9 问题 1 记门读不了 8 格、仍拿豁免格比期望值。归分片 C，本件不判 |
| 符合性：hover 3.5%、按钮或链接、右上簇 | 满足 | 固定项悬停底 rgba(22,21,15,.035)，字重 500。带下拉的项是 button（aria-haspopup=dialog、aria-expanded、aria-controls），其余是 a。铃铛 32×32、头像 28×28，中线 26；簇右 994 = 纸右 994 |

SUB-115：自报全绿；实测达成。上限 6 读 token，组件里没有字面 6。

### 2.4 STORY-138 完整菜单 ShellMenu（SUB-116、117，P1b）

| GWT / 判据 | 结论 | 证据 |
| --- | --- | --- |
| GWT1 top 52、left 12、width 952、接续 6 | 满足（消费方）；文档页破损 | 消费方：面板 12 / 52 / 952，52 − 标按钮底 46 = 6。面板底 342、底栏顶 290，与 spec-geom 的 menuBottom、menuBarTop 一致（`s3-1440.json`）。文档原样：面板几何不变，但搜索块 260×260 靠右，输入高 32，列区下移到面板内 276，≥1024 也显示「已固定」分组（`static-1440*.json`、`menu-docs-artifact.png`）→ A1-5 |
| GWT2 收起钮 0；锁定块非按钮、不在 Tab 序列 | 满足 | 面板里的 button 只有图钉钮。锁定块是 div[role=img]，tabIndex −1，无可聚焦后代，cursor auto（静态页与 jsdom）。壳层报告变异「加回 x 钮」使 noCollapse turns red |
| GWT3 底栏锁定块上下留白相等（±0.5） | 满足 | 底栏 52 高、上边框 1px。锁定块上留白 3.5（291 → 294.5），下留白 3.5（338.5 → 342）；右缘 948 = 964 − 16；当前位置中线 316.49，锁定块 316.5。壳层报告 barCentering pass |
| GWT4 ⌘K 聚焦搜索、Esc 回标按钮、点外部关闭 | 满足（组件层） | jsdom：⌘K 与 Ctrl+K 都打开菜单并聚焦面板搜索框；Esc 关闭，焦点回标按钮；点外部关闭（`behave.json` cmdK、ctrlK、outsideClose）。静态页上的门 focusLoop、noCollapse（outsideClick "unopened"）红 → A1-6 |
| GWT5 阴影模糊 ≤ 3px | 满足 | 三层阴影，最大模糊 3px（`s3-1440.json` panelStyle）。壳层报告 shadowBlur pass；变异 12px turns red |
| 符合性：dialog 非模态、搜索 40、三列 gap 16、行 32、内距 16 | 满足（消费方） | role=dialog，aria-modal=false。搜索 936×40；三列 gap 16；行 32；内容起点 = 面板内距 8 + 行内距 8，与板 `.ts-panel`、`.ts-it` 同构。文档页搜索为 32 高（A1-5） |
| 符合性：方向键、选中即收、无产品清单 | 满足 | ↓ 依次到 Roster、Teams；→ 在 Contracts 上打开下一级并聚焦 All contracts；← 回 Contracts。选中行后关闭并回焦标按钮。菜单与锁定块里产品清单 0（`behave.json` arrows、chooseRow、clickBrand） |
| 符合性：锁定块钩子 | 不满足 | 锁定块的标是 `svg.tcrn-brand-mark[data-product-mark="tms"]`，没有 C-5 / P3 约定的 `data-logo`。壳层门因此读不到：lockupDecor「lockup.mark null」16 处（ts-x、ts-narrow-x、ts-m-s），brandDigest「lockup.reference null」24 处 → A1-4。我方量到锁定块标 22（`s3-1440.json` lockupMark） |
| 符合性：每格对比度等 B 段 | 未证 | 同 2.3 GWT5 |

SUB-116、117：自报全绿（交回 P1b §2）。实测结构与行为达成；钩子缺 `data-logo`；文档页破损根因在文档构建（A1-5）。

### 2.5 STORY-139 下拉 ShellDropdown 与级联（SUB-118，P1b）

| GWT / 判据 | 结论 | 证据 |
| --- | --- | --- |
| GWT1 left = 项 left、top = 项底 + 6、宽 240、搜索 28 | 满足（消费方）；文档页破损 | 消费方：ts-drop-l 下拉 left 218.77 = 「Contracts」项 left；top 48 = 项底 42 + 6；宽 240；搜索 228×28（`s3-1440.json`）。文档原样：搜索块 260 高，壳层报告 continuation「drop.search 260，期望 28」8 处 → A1-5 |
| GWT2 第二列 +4、宽 240、高 = 第一列；height:auto 变异判红 | 满足 | 第二列 left 462.77 = 458.77 + 4，宽 240，高 180 = 第一列 180。壳层报告变异 `story-column-2-height-auto` 使 cascade turns red |
| GWT3 悬停 500ms 不出第二列 | 满足 | jsdom 对带子项行派发 pointer、mouse 悬停事件，550ms 后级联列数 0（`behave.json` dropHover） |
| GWT4 ← 回同一行；Esc 全关、焦点回固定项 | 满足（组件层） | jsdom：第二列获焦按 ←，焦点回「Templates」行，第二列收起。重开后在第二列按 Esc：下拉与级联全关，焦点回固定项按钮（`behave.json` dropCascade）。门 focusLoop 静态页红 → A1-6 |
| GWT5 下拉搜索只匹配子树 | 满足 | 在 Contracts 下拉里搜「Roster」（别的子树）结果 0；搜「Show」只得「Contracts › Templates」下的 Show（`behave.json` dropSearch） |
| 符合性：内距 6、行 32、文字起点 16、无图标列、dialog、点外部收 | 满足 | padding 6；行 32；文字起点 16；只有带子项的行有箭头 svg。role=dialog，aria-modal=false；固定项 aria-expanded、aria-haspopup=dialog、aria-controls 齐全；点外部关闭 |
| 符合性：每格对比度 | 未证 | 同 2.3 |

SUB-118：自报全绿；实测达成。文档页破损见 A1-5。

### 2.6 STORY-140 ProductShell 顶带态与固定项偏好（SUB-119、120、121，P1c、P1d）

| GWT / 判据 | 结论 | 证据 |
| --- | --- | --- |
| GWT1 顶带 52 无底无线；纸 52 / 12 / 14 | 满足 | ts-closed-l：顶带 52，背景透明，上下边线 0，无阴影；纸 left 12、top 52、右 12、下 12，圆角 14，s1 两层阴影。ts-closed-n 相同（`static-1440.json`、`s3-1440.json`）。18 log 尾 summary 的 shellFrame pass |
| GWT2 常驻侧栏与收起钮 0 | 满足 | 静态六屏与 jsdom 都读到 0 |
| GWT3 钉第 7 项偏好保存、顶带显示前 6；拖排后顺序持久化 | 部分 | jsdom：控制器 `setPinned` 第 7 项后 pins 为 7 项，写进 localStorage `tcrn-shell-pins:tms`，没有截断；顶带渲染 6 项。`movePin` 后新顺序写回并回调 `onPinsChange`；cookie 不写（`behave.json` controller、sevenPins）。但顶带与菜单都没有拖动手势（P1c 问题 3），UI 上做不到拖排 → A1-8 |
| GWT4 头像菜单含切换产品；菜单与锁定块无产品清单 | 满足 | 头像菜单有「Switch product」与产品行 tms*（aria-current）、aos；Esc 回焦头像。完整菜单与锁定块的产品行 0（`behave.json` avatar、avatarEsc、clickBrand） |
| GWT5 旧 prop 类型层拒绝、迁移有条目 | 满足 | `Navigation.test.tsx:1456` 起：ProductShellProps 12 条、控制器配置 3 条 `@ts-expect-error`（sidebar、collapsed、collapsedStorageKey、onCollapsedChange、sideNavCollapseDisabledReason、mobileNav*、navId、navLabel、brandHref、brandSuffix、search…）。批末 02 typecheck 退出 0，说明这些写法在类型层全被拒。`docs/migration-4.0.md` 有 M20、M21 |
| 符合性：标按钮左 = 纸左 = 菜单左 = 12，簇右 = 纸右 | 满足 | 12 / 12 / 12；簇右 994 = 纸右 994（1023 视口 897 = 897） |
| 符合性：O-1 几何撤出 | 部分 | base.css.ts 的侧栏、收起、壳顶栏已删；`brand.css.ts:198、215、216` 仍有三条侧栏与收起态死选择器（P1c 问题 2，R1 没处置）→ A1-9 |
| SUB-121：四个 story 登记、壳层门有真件可量 | 部分 | 四个 story 已登记，渲染真件，带 C-5 钩子。壳层报告 18 门：8 pass、9 fail、1 n/a。属于本分片的红分别是 A1-3、A1-4、A1-5、A1-6；touch 与 ts-m-s 裁切归分片 B；contrast 归分片 C |
| SUB-121：shell:parity 包侧 | 不满足 | 11 log:5 baseline 红。包侧两条：package-group-title 文档 10/500 对包 11/600；package-nav-item 包侧内距 4/0/4/32、min-height 30、12px，文档侧 0/4/0/8、12.5px。原因与 A1-5 相同：包 story 在 `.story-body` 里，被比对样式副本盖掉壳层段。文档侧 roles 9–16 的选择器仍指向已删的 `.tcrn-doc-*`、`navigation-focused-shells-spec`，归 SUB-132 |
| SUB-121：geometry:proof | 不满足 | 10 log:5：searchOverlay 基线 openMenus 12，不等于常数 13，overlayCount 0（静态页给不出菜单搜索结果态，P1d 问题 6）→ A1-7。INC-399 段归分片 B。品牌、徽标、拷贝段的基线与还原都正常，变异都会红 |
| SUB-121：storybook:build 0、apps/storybook 测试绿 | 部分 | storybook:build 退出 0（`storybook-build.exit`）。apps/storybook 测试批末没有执行（§6） |

SUB-119、120：自报完成；实测与自报一致。SUB-121：自报「部分」，实测剩余项如上。

### 2.7 STORY-141 登入动画 ShellIntro（SUB-122，P5）

| GWT / 判据 | 结论 | 证据 |
| --- | --- | --- |
| GWT1 三段 120 / 240 / 100，总 ≤ 700 | 满足（组件层） | jsdom 用真 ProductShell 挂 ShellIntro，记录到的动画：卡 opacity 0–120；标 transform 120–360；首行容器 opacity 0–360 保持；字标、示意、固定项、簇 opacity 与纸 opacity + transform 在 360–460；总长 460（`behave2.json` first）。静态页上的门 intro 红，firstLoadPlays 0 → A1-6 |
| GWT2 刷新不再播；去掉标记判红 | 满足（组件层） | 首播后 sessionStorage `tcrn-shell-intro` = "played"；同会话重挂 0 次；去掉标记后重挂又播（8 段）。门变异「去掉会话标记」判为不可区分（红基线），A1-6 |
| GWT3 reduced-motion 播 0 次 | 满足 | 0 次调用，标记照写（`behave2.json` reducedMotion） |
| GWT4 动画中的标与 logos2 同源 | 满足 | 飞行标 `svg[data-logo=tms]`、variant color，形状与 `logos2/tms.svg` 完全相同；起点盒 128（卡上锁定块），终点取标按钮的标盒 |
| 符合性：只用 transform 与 opacity、不挡输入 | 满足 | 关键帧属性只有 transform、opacity；`shell-intro.css.ts` 没有 transition 或 animation（唯一命中是第 5 行注释）。卡带 inert，层 aria-hidden |

SUB-122：自报全绿（ui-react 测试那 1 条红是 M3 既有红）；实测一致。

### 2.8 START 质量硬线（本分片涉及的八条）

| 硬线 | 结论 | 证据 |
| --- | --- | --- |
| 壳内常驻侧栏与收起钮 0 | 满足 | 2.6 GWT2；壳层报告 noCollapse 的结构部分与「加回 x 钮」变异 |
| 顶带无底无线、中线 26 | 满足 | 2.6 GWT1；标按钮、固定项、铃铛、头像的中线都是 26 |
| 三处间距相等 | 满足 | 2.3 GWT1，四处都是 8 |
| 接续 6 | 满足（消费方） | 菜单 52 − 46，下拉 48 − 42。文档页下拉搜索破损（A1-5） |
| 锁定块只装饰 | 满足（实测）；门红 | 非按钮、不可聚焦、无 hover。门读不到标尺寸（A1-4） |
| 品牌资产 digest | 满足（标按钮、登入动画）；门红（锁定块） | 2.2 GWT2、2.7 GWT4；锁定块钩子缺口见 A1-4 |
| 标旁文字中线 | 满足（中线）；不满足（文案原样） | markText pass；字标截断成「TCRN T…」（A1-3） |
| 登入动画只用 transform 与 opacity | 满足 | 2.7 |

## 3. 返工清单

**A1-1 · ui-tokens 同源测试读的路径过期（经济）**

- 现象：`packages/ui-tokens/src/index.test.ts:357–362` 在 `build-shell2.mjs` 里找 `.scr.ts{` 行。SUB-133（`0f4e670`）已把它移到 `docs/design/gplus-2026-10/tools/shell-screen.mjs:32`，测试读到 undefined 后红。verify 05 因此停在 ui-tokens，后面各包测试批末都没跑。
- 证据：05 log:16、36；steps.md 主线程注；`shell-screen.mjs:32` 的 12 个默认值仍等于 token。
- 改法：改读 `shell-screen.mjs`，最好 import 它导出的 CSS 或默认值，不再按行首字面去抓。
- 改动文件：`packages/ui-tokens/src/index.test.ts`。
- Story：135。

**A1-2 · 标按钮夜间后缀对比度断言与 D7 不一致（经济）**

- 现象：`ShellBrandButton.test.tsx:168–177` 断言两个主题的后缀都 ≥ 4.5，夜间实测 3.07，测试恒红（M3）。
- 证据：§2.2 GWT3；P1c、P5、P1d 交回。
- 改法：浅色仍断言 ≥ 4.5；夜间按 token-contrast 的 pending 豁免记为已知待裁（D7、S-6），不断言 ≥ 4.5。Owner 裁定后再收紧。
- 改动文件：`packages/ui-react/src/components/Navigation/ShellBrandButton.test.tsx`。
- Story：136。

**A1-3 · 标按钮字标被截断，后缀纵向裁切 1px（经济）**

- 现象：第二版里字标格 = 134 − 内距 12 − 示意 20 − 列距 10 − 标 22 − 间距 10 = 60。TMS 字标实宽 60.234，`ellipsis` 让所有屏显示「TCRN T…」。后缀 `em` 行盒 17 高，`b` 行高 15 且 overflow hidden，上下各溢出 1px。
- 证据：`brand-closed-l.png`；18 log:3487–3494；19 log 尾；壳层报告 singleLine 36 处；P1d 问题 2、P14 问题 1。
- 改法：按板 `.ts-brand` 的 `22 auto 20` 让字标列取内容宽，不对注册字标默认截断（只在超出 > 1px 时截断并带 title）。`b` 改 `overflow: clip` 并给纵向留余量，或让 `em` 行盒不超过 15。保持 134×40、中线 26，用 markText 门复核。组件测试加「scrollWidth ≤ clientWidth」断言。
- 改动文件：`packages/ui-react/src/styles/shell.css.ts`（shellCss01）、`ShellBrandButton.test.tsx`。
- Story：136（ProductLockup 首行变体若同写法，判断时一并核）。

**A1-4 · 菜单锁定块的标缺 `data-logo` 钩子（经济）**

- 现象：完整菜单底栏锁定块的标是 `svg.tcrn-brand-mark[data-product-mark="tms"]`，没有 `data-logo`。壳层门 lockupDecor 读不到标尺寸，brandDigest 找不到 Brand E rail 参照，结果是 lockupDecor 16 处、brandDigest 24 处红。
- 证据：壳层报告 failures；`scripts/lib/shell-measure.mjs:446–448`、`:576–578` 都只认 `svg[data-logo]`；`s3-1440.json` lockupMarkAttrs。
- 改法：在 ShellMenu 内给锁定块的标挂 `data-logo={productId}`，不改 ShellBrandLockup 的导出 prop。若必须给 ShellBrandLockup 加 markProps，就升主力。改后复核锁定块文案与 Brand E rail 的对照，包括底栏隐藏 byline 的口径。
- 改动文件：`packages/ui-react/src/components/Navigation/ShellMenu.tsx`、`ShellMenu.test.tsx`。
- Story：138。

**A1-5 · 文档页的 `.story-body` 比对样式副本盖掉壳层段（主力）**

- 现象：静态页第 4 张样式表（662 条，631 条带 `.story-body` 前缀，截在 settings 段，不含壳层段）在壳 story 里排在后面，按同特异性重放基础规则：完整菜单搜索成 260×260 靠右（`.story-body .tcrn-product-shell-search` 的 flex-basis、width 260 与 margin-left auto），输入高 32（应 40），列区下移到面板内 276；下拉搜索块 260 高（应 28）；≥1024 仍显示「已固定」分组；菜单行与分组标题回到旧 NavItem / NavGroup 样式。停用这份副本后读数全部合板。
- 证据：`rules-search.json`；`static-1440-b.json` 对 `s3-1440.json`；`menu-docs-artifact.png`；壳层报告 continuation 8 处；11 log:5 的 roles[3]、roles[8]。
- 改法：比对副本要么把壳层段（shellCss*、shellIntroCss*、shellSheetCss*）一起纳入且排在其后，要么跳过被壳层段覆盖的基础规则。同时撤掉 `base.css.ts:163–176` 里 `.tcrn-product-shell-search` 的旧顶栏尺寸（260、margin-left auto）。它是 shell:parity 的比对输入，改后复跑 shell:parity 与壳层门。
- 改动文件：`apps/storybook/src/build/page-template.tsx`、`packages/ui-react/src/styles/base.css.ts`。
- Story：138、139、140（SUB-121）。

**A1-6 · 壳 story 在静态页上没有可观察的行为（主力）**

- 现象：静态页是服务端渲染，没有客户端挂载，ShellIntro 按设计不渲染，门点标按钮 3000ms 超时。focusLoop、noCollapse（点外部）、intro 三门红，变异「去掉会话标记」「关闭时不还焦点」判为不可区分。jsdom 实测组件行为正确（§2.2–2.7）。
- 证据：壳层报告 behaviour、mutations；P5 问题 2；跨包通告 §1。
- 改法：给 shell-top-band 与 shell-intro 加客户端挂载（小 hydrateRoot 入口或静态桥），行为探针在挂载后的页上跑；查明 tab click 超时的原因（遮挡或不可操作）。
- 改动文件：`apps/storybook/src/contract-stories/story-content.tsx`、静态构建入口；探针若要改，加 `scripts/shell-measure-proof.mjs`。
- Story：136、138、139、141。

**A1-7 · geometry:proof 的 searchOverlay 段基线红（主力）**

- 现象：openMenus 12 不等于常数 13；overlayCount 0，因为菜单搜索由 ShellMenu 自持，静态页给不出「已输入、结果已展开」态。
- 证据：10 log:5；`scripts/geometry-proof.mjs:31`；P1d 问题 6；P9 问题 3。
- 改法：ShellMenu 加受控 `query` 或 `initialQuery`，由 ProductShell 透传；story 增一屏菜单搜索结果；geometry-proof 宿主改到这一屏，open-menus 从 DOM 派生，不再写常数。若改走撤掉这条检查，就是改门语义，要主线程裁定。
- 改动文件：`ShellMenu.tsx`、`Navigation.tsx`、`story-content.tsx`、`scripts/geometry-proof.mjs`。
- Story：140（SUB-121）。

**A1-8 · 固定项没有拖排手势（主力）**

- 现象：只有控制器层的 `movePin`；顶带与菜单都没有拖动，140-GWT3「拖排后顺序持久化」在 UI 上做不到。
- 证据：§2.6 GWT3；P1c 问题 3。
- 改法：ShellPins 加拖动，并给键盘替代（例如 Alt+← / →），结束时回调 `onPinsReorder`，控制器侧接 `movePin`；ProductShell 加对应 prop，迁移说明补条目。若要以「控制器层即可」结案，就是缩减范围，交 Owner。
- 改动文件：`ShellPins.tsx`、`Navigation.tsx`、`shell.css.ts`、对应测试、`docs/migration-4.0.md`。
- Story：140（137）。

**A1-9 · brand.css.ts 残留 O-1 侧栏与收起态选择器（经济）**

- 现象：`brand.css.ts:198`（`.tcrn-product-shell__sidebar …--aos`）与 215、216 行（`[data-product-shell-collapsed="true"] …`）在壳里已没有匹配元素。
- 证据：grep；P1c 问题 2。
- 改法：删掉这三条，并去掉 `Navigation.test.tsx` GWT1 用例对 brand 段的排除。
- 改动文件：`packages/ui-react/src/styles/brand.css.ts`、`Navigation.test.tsx`。
- Story：140（与 SUB-125 范围重叠，判断去重）。

**A1-10 · tokens:proof 两段红，根因不在本分片（经济，跨分片）**

- 现象与证据：06.08 log:11–13，fonts 子集缺 U+94DB「铛」，来自 shell-matrix 描述 `storybook-locale-text.ts:116`；06.10 log:18–33，shell-fidelity 文档样式重复选择器与包类外观。
- 改法：按批末生成物规则重跑 `fonts-vendor` 把字收进子集，或改用子集内的字；文档壳样式去掉与组件样式重复的选择器。
- 改动文件：`packages/ui-tokens/fonts/**` 生成物，或 `storybook-locale-text.ts`；`apps/storybook/src/storybook.css`、`story-demo-styles.ts`。
- Story：135-GWT4 的阻挡；分片 C 可能同报。

## 4. 只有 Owner 能定的事项

新发现，一项：

1. **下拉级联在 1024–1330 宽可能出视口（设计待定）。** 下拉没有视口夹取（P1b §3.5 只考虑了 240 宽的首列）。从第 4 个固定项（左 412）打开到第四级：412 + 240 + 4 + 240 + 4 + 240 = 1140，超过 1024 视口；6 个固定项时更靠右。建议与 M6「完整菜单里级联列的位置」用同一条规则一并裁：越过视口右缘时级联改向左展开。在裁定前保持现写法。

其余相关待 Owner 项都是已知项，状态不变：D7 / S-6 夜间后缀（影响 136-GWT3）、AOS 无 logos2 标（P1c-1）、头像菜单位置与无账户图标（P1c-8）、长名第二版截断（P1a-6）、窄屏按视口还是容器（P1d-3）、下拉 ⌘K 提示（P1b-6）、纸升起距离（P5-3）、Story 136 用例字重文本与板不一致（P1a-3）。

Owner 对 136 至 141 的目视建议排在 A1-3、A1-5 之后：现在文档里菜单与下拉呈旧样式、字标被截断。

## 5. 实施口径判定

| 包-条 | 写明的选择 | 判定 | 理由 |
| --- | --- | --- | --- |
| P1a-1 | 触摸 44 在 `shell.css.ts` 的 `@media (pointer: coarse) { :root }` 里覆写两个 token | 有条件 | 可用，但 token 值写在组件样式表里且是字面 44。条件：下一轮拆分定进 token 层（改 C5 块模型）还是另立 token |
| P1a-2 | 上限 6 从 JS token 读 | 可接受 | 单一来源，组件里没有字面 6 |
| P1a-3 | 16 条进 container 组；intro 四值写字面，由测试断言等于 t-fill、t-move | 可接受 | 实测值与组别正确 |
| P1a-4 | 退役：两条无继任保留原值，topbar-h 作别名 | 可接受 | 实测三个旧名都能解析，CHANGELOG 有条目 |
| P1a-5 | 同源测试按行首字面抓 `build-shell2.mjs` | 有条件 | 思路对，但写法脆，已被 SUB-133 打红。条件：A1-1 |
| P1a-6 | version auto：CSS 首帧切换，挂载后改写 `data-shell-brand` | 有条件 | 视觉正确。服务端或静态页在窄屏下钩子仍报 v2，门若读属性会误判。条件：门按视觉读，或服务端按 `max-width` 给初值 |
| P1a-7 | 标用 TcrnBrandMark，尺寸用局部变量 22 | 可接受 | 实测形状与 logos2 相同 |
| P1a-8 | 首行字重整行取 600，按板 | 可接受 | 板是字节真值；Story 文本另改 |
| P1a-9 | 固定项 `flex: 0 1 auto` 并单行截断 | 可接受 | 板宽下几何不变（间距实测 8） |
| P1a-10 | 下拉 id 由 `menuIdOf` 或 useId 给；选中带下拉项写 `aria-current="true"` | 可接受 | 实测 aria-controls 与下拉 id 对应 |
| P1a-11 | 公开面：两件进名册与 shell 家族；shell-copy 不导出 | 可接受 | exports:check 15、contract:static 13 都退出 0 |
| P1b-1 | 越出文件集登记 shellCss03、04 | 可接受 | M2 已解，没有残留 |
| P1b-2 | 菜单 absolute、token 计算 top、`min(952, 100vw − 24)` | 可接受 | 实测 12 / 52 / 952；窄画框里溢出属画框问题 |
| P1b-3 | max-block-size 为视口减顶带 | 可接受 | 与板上 588 = 640 − 52 同法 |
| P1b-4 | 底栏 44 + 8 | 可接受 | 实测 52，居中 3.5 / 3.5 |
| P1b-5 | 下拉 fixed、读固定项盒定位、不走 portal、不夹取视口 | 有条件 | 首列不会出界，但级联会（§4 第 1 条）。条件：随 §4 裁定补越界规则 |
| P1b-6 | 级联用网格 stretch 加 `contain: size` | 可接受 | 实测等高；height:auto 变异能判红 |
| P1b-7 | 完整菜单里的级联接在面板右侧 | 有条件 | 板上没有画；1440 宽同开两列出界 12（M6）。条件：Owner 裁定 |
| P1b-8 | 复用 ProductShellSearch，用变量改高 | 有条件 | 消费方样式下正确，但要靠覆盖基础规则里的旧顶栏尺寸，文档页因此破损。条件：A1-5 撤掉旧尺寸 |
| P1b-9 | 下拉搜索不显示 ⌘K | 可接受 | ⌘K 打开的是完整菜单，提示会误导；Owner 要板面一致时改一个 prop |
| P1b-10 | 打开时焦点进搜索框；Esc 与选中后回触发键；点外部不移焦点 | 可接受 | jsdom 实测一致 |
| P1b-11 | 带子项的行用 `<a role="button" aria-expanded>` | 可接受 | 键盘可开合，实测 → ← 正常 |
| P1b-12 | ⌘K 挂 document，一个壳注册一次，卸载即移除 | 可接受 | 实测 ⌘K 与 Ctrl+K 都正常 |
| P1b-13 | 「已固定」分组常驻 DOM，≥1024 用 CSS 隐藏 | 可接受 | 消费方实测正确；文档页破损归 A1-5 |
| P1b-14 | 开合只用 opacity，reduced-motion 下 none | 可接受 | 读数不受进行中的动画影响 |
| P1b-15 | 侧栏尺度值抄进 `.tcrn-shell-menu__lockup` | 有条件 | 有重复写值（P1b 问题 7），还漏了 `data-logo`。条件：A1-4；brand.css.ts 开放侧栏档后删副本 |
| P1b-16 | 导出 `shellLayerTriggerOf` 给下拉复用 | 可接受 | 只增导出，不改语义 |
| P1b-17 | JSX key 不放行首 | 可接受 | 扫描红线 |
| P1b-18 | 几何只在规则与 token 层核，真件读数交给壳层门 | 有条件 | 壳层门因 A1-4、A1-5 读到假红；本次以我方实测补上。条件：A1-4、A1-5 修后壳层门复核 |
| P1c-1 | 菜单模型扩 children，不取别名 | 可接受 | 类型单一来源 |
| P1c-2 | `brandProductId` 改必填标键；AOS 三处暂传 design-system | 有条件 | AOS 文案配 DS 标属品牌误用。条件：Owner 裁定前在 story 读回里标明是占位 |
| P1c-3 | 删除的 prop 比 Story 点名的多（brandHref、brandSuffix、navId、search 等） | 有条件 | M20 列全了，但改了 ProductShell 的 prop 面（共享契约），需判断确认 |
| P1c-4 | headerActions 进簇；铃铛只在有通知时出；头像常在；无账户用 users 图标 | 可接受 | 实测簇几何合板；图标待 Owner 目视（已知） |
| P1c-5 | 三层浮层受控或自持，打开一层就关另两层 | 可接受 | 实测头像、菜单、下拉切换正常 |
| P1c-6 | 壳根一屏高、overflow clip，页面在纸里滚 | 有条件 | 作应用壳可以；长页嵌壳的 story 每块一屏高（P1c 问题 7）。条件：迁移说明写明用法 |
| P1c-7 | 控制器 prop 包改为新壳 | 可接受 | M21 有条目 |
| P1c-8 | 固定项读取顺序：服务端 → 本地回退 → initial；不写 cookie | 可接受 | 实测 localStorage 按产品分键，cookie 为空。水合差异风险已记（P1c 问题 10） |
| P1c-9 | 顶带态 CSS 全进 shellCss05；base.css.ts 只删 | 可接受 | 实测几何合板 |
| P1c-10 | 状态规则用 `:where()`；铃铛点内缩 7 | 可接受 | 与板一致 |
| P1c-11 | 调用点只做让类型通过的最小改动 | 有条件 | AOS story 读回文案仍是旧壳（P1c 问题 4）。条件：SUB-129 改写 |
| P1d-1 | 样例数据用通用英文，标用 tms | 可接受 | id 与标题不含产品名 |
| P1d-2 | 每屏一窗高，按现有写法登记高度预算 | 可接受 | 预算有登记 |
| P1d-3 | 静态态的桥（改属性、CSS anchor、`shellMenuCascades`） | 有条件 | 静态几何能量，但静态态不是组件产出，行为门无从观察。条件：A1-6 与 `previewStates` 透传（P1d 问题 5） |
| P1d-4 | 窄屏与手机画框按视口呈现 | 有条件 | 待 Owner 定视口还是容器（已知） |
| P1d-5 | ProductShell 契约 story 打开头像菜单 | 可接受 | 供 parity 读 locale 角色 |
| P1d-6 | 角色改名 | 可接受 | 文档侧选择器、比对属性与角色数不变 |
| P1d-7 | 品牌门数值从 token 注册表读 | 可接受 | 门值单一来源 |
| P1d-8 | 类目计数按 grace allowlist 登记 | 可接受 | smoke 的 toleratedDebt 有记录 |
| P1d-9 | locale 账本不改 | 可接受 | public:naming 23 与 internal-vocab 25 都退出 0 |
| P5-1 | 终点取标按钮里标的实际盒 | 可接受 | 实测终帧落在标按钮的标盒 |
| P5-2 | 用 Web Animations API，关键帧只有 transform、opacity，三段之和超 max 即抛错 | 可接受 | 实测属性清单 |
| P5-3 | 分相 0 / 120 / 360 / 460 | 可接受 | 实测 |
| P5-4 | 纸升起距离取 space-2h（10） | 有条件 | 板上没有这个数（P5 问题 3）。条件：设计会话确认 |
| P5-5 | sessionStorage 标记；不可用时不播 | 可接受 | 实测首播、重挂 0 次、去标记后重播 |
| P5-6 | 服务端与水合都不播 | 可接受 | 合板「服务端首屏直接终态」。静态页因此需要 A1-6 |
| P5-7 | 卡 inert、层 aria-hidden，fade 后指针穿透 | 可接受 | 实测 inert 与 aria-hidden |
| P5-8 | aria 文案用本件局部表，五语，zh-CN 用「登录」 | 可接受 | 用规范词 |
| P5-9 | 中途卸下调 finish()，不调 cancel() | 可接受 | 终态不跳 |
| P5-10 | 公开面：小写导出不进 utility 名册 | 可接受 | 与 P1a、P1b 同法 |

不可接受：无。

## 6. 证据盲区

1. 批末 `pnpm test` 停在 ui-tokens（A1-1）：ui-react 单测、apps/storybook 测试、两个 pilot 批末都没执行。`test:dom` 不在 verify 里。本次没有重跑这些；包内测试读数只来自各包交回（自报），组件行为改用我方 jsdom 探查实测。
2. 批末 `geometry:measure` 在 gplus 段 clip 红后停，壳层 18 门批末没跑。本次读的是 `f98b298` 提交的壳层报告；该提交之后代码只有合入与文档提交，但没有新的门运行来佐证。
3. 行为探查在 jsdom 里，没有布局；真实浏览器里的 Esc、⌘K、点外部、级联方向键与登入动画都没看到。门点标按钮 3000ms 超时的原因没有查明。
4. 字标墨迹中线只核到盒级，墨迹口径用门的 markText 结论。
5. 「每格对比度与 07a B 段相等」没有核；contrast 门在 shell-matrix 红，归分片 C。
6. 触摸端（pointer: coarse）的 44 行高与搜索高没有量；Chromium 默认 pointer: fine。
7. 文档里壳框宽 1006，没有在 1240 壳宽下直接量（几何项与壳宽无关）。
8. 截图只看了 ts-closed-l 标按钮与文档页菜单；夜间与 hover 只有计算样式读数。
9. 分片 B、C 的门红只做了归属：shell:parity 文档侧 roles 9–16、storybook:smoke 的 productShellComparatorProof（仍按 O-1 期望 sideNavToggle、topBar）与 localeMenuFocusReturnProof、30.02–30.04、28、INC-399、Sheet。
10. 「停用 `.story-body` 副本」模拟消费方样式，前提是页面第 2 张样式表（组件全量样式）等同 `tcrnComponentCss`；没有另起只含包样式的空白页对照。
