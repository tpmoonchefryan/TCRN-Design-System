# R3 批末验收 · 分片 B（STORY-142 至 146；EPIC-045 导航、EPIC-046 品牌与布局）

节行号：1 一览 L11；2 逐 Story L28（2.1 STORY-142 L30、2.2 STORY-143 L43、2.3 STORY-144 L69、2.4 STORY-145 L82、2.5 STORY-146 L99、2.6 质量硬线 L112）；3 返工清单 L127；4 只有 Owner 能定的事项 L147；5 实施口径判定 L162；6 证据盲区 L200

被验对象：集成分支 `claude/init016-tab-shell`，验时 HEAD c4d7780（摘录写 df740e6；其后两笔只改 `docs/dispatch`，`git diff --stat c45c529 HEAD` 只有 6 个 dispatch 文件）。批末 verify 跑在 c45c529（`runs/r3/verify/steps.md`，30 步红 2）。壳层门报告 `docs/verification/shell-measure/report.json` 由 SUB-211 在 5e9ae6a 写出，`git diff 5e9ae6a HEAD -- packages apps scripts tests docs/design docs/contract docs/verification` 为空，且与批末 `18 log:8221` 起的 stories 段门结论、失败项一致，所以报告就是 HEAD 代码的读数。静态 Storybook 是批末之后 `storybook:build`（退出 0）的产物。

方法只读：读批末逐段日志、HEAD 回执与门报告、源文件、dist 与静态 Storybook；scratch 只读脚本（`acc-r3-B/probe/`，多数沿用 R2 分片 B 的探针）经门自己的静态服务器与路由函数用 Playwright（Chromium）打开静态页、水合后量 DOM；1440 设置页与分栏在浏览器内存克隆里量。未改代码、门、回执、链，未重跑门、未构建。Owner 目视不代签。

证据记法：`NN log:行` 为 scratch `r3-verify/` 下的批末逐段日志；`acc/文件` 为本分片 scratch `acc-r3-B/out/` 下的探查输出；`壳报告` 为上述 report.json（逐 run 摘要 `acc/03-report-summary.txt`，首行墨迹 `acc/26-firstlines.txt`，各门 checked 数 `acc/27-gate-checked.txt`）。

## 1. 一览

| Story | 结论 | 未满足或部分的 GWT | 返工项数 |
| --- | --- | --- | --- |
| STORY-142 图钉位与名册 pin | 满足（机器判据） | 无。R2 的 GWT1 门侧（pinJitter 把隐藏列算成 0×0）与目的锚偏差（prail 19）都已解决 | 0 |
| STORY-143 导航家族归位 | 部分 | 四条 GWT 满足。符合性 C1–C17：contract:static 退出 1，只剩 C8 15 条（壳层家族的顶带登记，R2-12 起同一目标第三轮，交 Owner，第 4 节 ①）；家族表漏登本 INIT 新增的根类（B3-2） | 1（B3-2） |
| STORY-144 手机 Sheet 与 INC-399 | 满足（机器判据） | 无。R2 的 GWT3（geometry:proof 退出 1）已转绿 | 0 |
| STORY-145 首行变体与 TMS 后缀 | 部分 | GWT2 阻塞于 Owner：DS 侧栏首行墨迹 1.4（O-4）；R2 的 zh-CN −1.1 已消，en 与 zh-CN 逐值相同。符合性：标按钮与登入动画的 `data-logo` 仍写产品键（B3-1）；`storybook-map.json` 仍写 TMS 夜间 #7aa0f5（B3-3） | 2（B3-1、B3-3） |
| STORY-146 PageHeader 必有与纸内布局 | 阻塞于 Owner（O-4） | 四条 GWT 满足。符合性「几何门全绿」：geometry:proof 0；geometry:measure 1，只红 markText（品牌锁定块，O-4）；本 Story 自己的单行、面包屑、设置页、分栏读数全过 | 0 |

返工 3 条：主力 1（B3-2），经济 2（B3-1、B3-3）。R2 本分片 11 条返工（B2-1 至 B2-11）都已由 R3 解决（逐条见第 2 节各 Story 末；B2-11 只剩 md 的机读孪生件，按新发现列 B3-3）。R3 仍不满足的 R2 同一目标只有两处，按派工口径不列返工、交 Owner：contract:static 退出 0（余 C8）与 markText（O-4）。库门 0（S-1）只影响转态。

口径更正（交判断）：
- 主线程问题 M4、`runs/r3/verify/steps.md` 与 `docs/dispatch/2026-10-13-tab-shell/owner-acceptance.md:301`（G-16）写 C8「18 条」，那是 M2、M4 的包时读数；批末 `13 log:100,212-216` 是 15 条（静态 1、story 14：frontend-shell-slice 6、owner-quality-product-shell 6、navigation-focused-shells-spec 1、navigation-product-shell-spec 1，acc/44-c8.txt），少的 3 条随 M9 退役 AOS 视觉变体（M48）消失。
- `owner-acceptance.md:329` 说 O-4 是「唯一挡住批末 verify 归 0 的项」；C8 也挡（第 13 步）。
- markText 的失败读数除 DS 1.4 外，还有完整菜单、窄屏与矩阵底栏两行锁定块 TMS `lkr@22` en 1.7（`18 log:8324-8340`；主线程 M4 只写了 1.4）。

## 2. 逐 Story

### 2.1 STORY-142 · 图钉位与名册 pin（本轮 SUB-188 M3；门侧 SUB-206 M1 属 149）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 rest 与 hover 文字盒等宽；`display:none → inline` 变异判红 | 满足（R2 部分 → 满足） | 实测：ts-x-l、ts-x-n 各 12 个可见可钉行，真实指针悬停前后标签宽差全为 0，浅色 en 与夜间 zh-CN 相同（acc/25-pins-summary.txt）。门：pinJitter 在 8 个菜单 run 全 pass（壳报告 run 0–7），隐藏的「已固定」列 4 个钉钮不再计入（`18 log:7360` 自检）；`story-pin-display-none-inline` 由 R2 的「red on a red baseline」变为 turns red，`column1.textWidths rest 247.3 / hover 223.3`（`18 log:12486`） |
| 2 role button、aria-pressed 与固定态一致、aria-label 含项名 | 满足（无回退） | 原生 `button type=button`；「Pin to top bar: People」false、「Unpin from top bar: Roster」true；zh-CN「固定到顶带：人员」「从顶带取下：名册」（acc/25） |
| 3 icons.json 38 且含 pin 描边与实心两态 | 满足（无回退） | `07 log:5,29` 38；icons.json pin `variants {outline:{fill:[]}, solid:{fill:[0]}}` |
| 4 行获焦不悬停时图钉可见 | 满足（无回退） | 键盘获焦 `:focus-visible` 为真、指针在外，图钉 opacity 1（acc/25，两语两主题） |

符合性：槽 24、钮 24×24、图标 16（acc/31-misc.json `pinBox`、`pinIcon`，行网格 `263.328px 24px`）；分组、项、子菜单行都可钉（菜单组标题带钉，下拉 4 行各带 24×24 钉，acc/36-drop.txt）；Sheet 内钉钮 `::after` 44×44（acc/30-mobile.json）；名册 38，app 与包源里「37」0 处（只剩草案一的 `build-shell.mjs` 与 V2-B2-Shell-Draft 板，属历史稿）。目的锚「B 段 NavItem 行 1:1」：R2 的 prail 19 已解决——完整菜单（ts-x-l、ts-x-n、ts-narrow-x-l）与 Sheet（ts-m-s）的引导列图标盒 22×22、内距 3、border-box、盒左缘距面板 16、字形 19、文字 48，行 32 / Sheet 44，两语两主题相同（acc/22-iconbox-summary.txt），与板 `.ts-it .ic{width:22px;height:22px;padding:3px}`（`docs/design/gplus-2026-10/tools/shell-screen.mjs:89`）一致；壳报告 prail 检查 12 个 run pass，`story-guide-icons-right-4` 判红 `prail.icon 20`（`18 log:12616`）。

Subtask：SUB-188 自报完成，实测达成（盒、字形、文字三读数；菜单与 Sheet 同一条规则 `shell.css.ts:460-467`；单测 `05 log:271`）。R2 项：B2-1 由 SUB-206 解决；B2-2 由 SUB-188 解决（按判断撤回 B2-2 的 `justify-self: start` 改法，见第 5 节 M3-1）。Owner 目视：待 Owner（图钉三态与行图标盒；O-5 实心态、O-6 触摸端常显仍按默认）。

### 2.2 STORY-143 · 导航家族归位（SUB-189、190、191 M2；SUB-192 M3；SUB-193 M4）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 每个退役件有弃用导出与迁移步骤 | 满足（无回退） | dist `componentLibraryDeprecatedComponentNames` 6 件且都导出为函数（acc/41-deprecated.txt）；`docs/migration-4.0.md` M23（第 623 行）、M30（第 794 行）；CHANGELOG 第 163–164 行；本轮新条目 M40、M45 已追加 |
| 2 五种旧形同一家族、同一选中态结构，selection:proof 0 | 满足（无回退） | `06.12 log` ok、`tabsFamily.selectedRules 1`、findings [] |
| 3 TocRail 在纸内；壳内常驻侧栏 0 | 满足 | 书签壳样板的 TocRail 在该壳的纸内（1440 与 390），壳纸外高于 200 的 aside 或 nav 0（acc/39-tocstory.json）；文档页目录（`tcrn-doc-page__toc` 内的 TocRail）在文档壳纸内（acc/37b-tocnav-sum.txt）；16 个壳屏常驻侧栏 0、收起钮 0、面板关闭钮 0（acc/32-sidebars.json）；noCollapse 16 个 run pass |
| 4 Breadcrumb 在 390 宽一行、截断、有 title | 满足（无回退） | ts-settings-m、ts-roster-m：三段同 top、nowrap、ellipsis、三段都截断且 title 为全文，nav 244 无溢出（acc/33b-crumbs.txt）；壳报告 singleLine 在 shell-mobile 4 个 run 由 R2 的红转 pass |

符合性：
- NavGroup、TreeNav 只在面板与下拉里：文档页 TreeNav 4 处都在 `tcrn-popover` 里（acc/42-treenav.txt），无回退。
- 导航项单行截断写进基础规则（R3-11）：菜单外的 NavItem（navigation-primitives-spec 三行，含禁用的 Release notes）标签为 block、nowrap、ellipsis、overflow hidden、min-width 0、title = 文字，把行压到 60 宽仍单行省略（acc/38-navlabels.json，en 与 zh-CN）；菜单内 16/16 同（acc/25）；contract:static C7 green、0 条发现（`13 log:99`）。
- TocRail 标题层级（R3-15）：文档页目录标题 h2、nav 名「On this page / 本页内容」（acc/37b）；书签壳样板页头 h2、TocRail h3（acc/39）；`docs/verification/internal-alpha/a11y-axe-summary.json` ok、violationCount 0（heading-order、landmark-unique 都归 0）。
- 包外 tcrn- 类 0：`12 log:29-30` DOC_SHELL_CLASSES_PACKAGE_BACKED。
- C1–C17 对三族全量检查（START 硬线；R2 B2-3、B2-4）：测试不变式已更新（`13 log:79-82` 74/74；`checkedBatches [1, 2]`、`uncoveredFamilies []`、`invalidExemptions []`，`13 log:133-151`）；C11 卡套卡归组合件家族，layout 族 0 条、38 条豁免（`13 log:101`）；C2、C5、C6、C7、C13 green。**未满足：C8 red 15 条**（`13 log:100,209-216`），全在壳层家族的顶带登记上：静态 `C8.yield-without-min-width` 1 条（`.tcrn-shell-pins` 在 `shell.css.ts:163-171` 照板 `.ts-pins{min-width:0;flex:0 1 auto}` 写 `min-inline-size: 0`）；story 层 `C8.story-yield-missing` 14 条（没有固定项的壳，`ShellPins.tsx:184` `if (items.length === 0) return null`，顶带里只有标按钮与右簇，静态页逐个核过）。这是 R2-12 起两轮返工的同一目标（contract:static 退出 0），R3 再不满足，不列返工，交 Owner（第 4 节 ①）。
- 家族表完整性：`docs/contract/families.json` 的 navigation 族 9 个块没有本 INIT 新增的 `tcrn-nav-item-row`、`tcrn-nav-pin`，shell 族没有 `tcrn-shell-cluster`（C8 登记的固定项）、`-account`、`-avatar`、`-bell`、`-sheet`（acc/43-families.txt；M2 问题 3）。这些类的发现记 unattributed，照查、不放宽，但按家族筛选、按家族计数与 roles.json 的家族断言都漏掉它们（B3-2）。

Subtask：
- SUB-189 自报完成，实测达成：①–④ 都在（`tests/contract-static-proof.test.mjs:592-631` 两向自检；`NOT_CHECKED_HERE.C10` 写明 shellGeometryLiterals，`scripts/contract-static-proof.mjs:87`）；⑤ 批末测试一步 0、门脚本跑到底。
- SUB-190 自报完成，实测达成（`13 log:72-74` 三条自检；exemptions.json 两条 reason 写明 34 条随第 3、5 批到期）。
- SUB-191 自报部分，与实测一致：①③ 达成（roles.json 顶带一项，测试第 580–583 行）；② 发现逐条列出；④ 余 15 条只等 Owner（自报 18，批末少 3，见第 1 节）。
- SUB-192 自报完成，实测达成（见上；单测在 `05 log` 的 ui-react 256/256 内）。
- SUB-193 自报完成，实测达成（`05 log:120`；文档页传 2 由 SUB-202 完成）。

Owner 目视：待 Owner（Tabs 五形、面包屑分隔图标、TreeNav 在下拉里、菜单外禁用 NavItem 的原因改到标签下一行）。

### 2.3 STORY-144 · 手机 Sheet 与 INC-399（本轮无直接挂单；SUB-181 M2、SUB-201 M7 承接）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 390×844 顶带只有标与示意，固定项 0 | 满足（无回退） | INC-399 段 760、390 两宽 `pinsShown 0`、标按钮 v1 64×40 在 (12,6)（acc/11-inc399.txt）；静态 ts-m-l 顶带为标按钮 v1 与右簇（铃铛、头像），可见固定项 0（acc/30-mobile.json） |
| 2 打开 Sheet 行高 44；行高改 32 的变异判红 | 满足（无回退） | ts-m-s `data-state=sheet`，Sheet 行 44（7 行）、搜索 44，细指针与粗指针相同（acc/30）；touch 在 shell-mobile 4 个 run pass；`story-sheet-row-32` 判红 `ts-m-s|sheet.row|32`（`18 log:12600`） |
| 3 滚动 2000 后点标按钮 Sheet 打开（INC-399 门退出 0） | 满足（R2 部分 → 满足） | steps 第 10 步 geometry:proof 退出 0；mobileNavigation 760 与 390 各三腿：基线纸滚 2000、命中标按钮、Sheet shown、行 44、搜索 44、ok；变异 hit null、ok false；复原 ok（acc/11-inc399.txt）；searchOverlay 浅色、夜间碰撞 0，所在面板底色 alpha 1，原变异与「面板底透明」变异都判红（`redThenGreen` 全真） |
| 4 夜间与浅色同一选择器属性集只换值 | 满足（无回退） | `shell-sheet.css.ts` 本轮未改（末次 eb5e0da 属 R2），无主题选择器、无颜色字面量；`06.02 log` 两主题块同 85 个属性 |

符合性：标按钮 390 宽高 40；Sheet 行与搜索 44；固定项不在顶带；滚动后可开；移动块纸 12 / 52 / 12、圆角 14、顶带 52（acc/30）；粗指针下 `:root --tcrn-shell-row-h` 44、桌面完整菜单行与搜索 44。文档壳 ≤ 760 打开 Sheet（R3-21）：INC-399 腿的被测物就是水合后的文档壳标按钮（「Open navigation · TCRN Design System」），760 与 390 都 `sheet.shown true`。Sheet 形态照板：`.ts-sheet{bottom:0;max-height:84%}` 从底部升起（ts-m-s 盒 top 364、高 480），与 Story 假设「Sheet 全屏、从顶带下方升起」字面不同，只需改 Story 文字（第 4 节 ③）。

Subtask：R2 的 B2-5 由 SUB-181（M2）解决；R2 判断记在 144 下的「文档页 ≤ 760 开面板」由 SUB-201（M7）解决。Owner 目视：待 Owner（手机 Sheet；O-15 夜间遮罩与下一级仍按默认）。

### 2.4 STORY-145 · ProductLockup 首行变体（SUB-194 M4、SUB-195 M5）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 四枚产品首行的标 digest 等于 logos2 | 满足（R2 部分 → 满足） | 品牌 story 八枚首行 `data-logo` 为 tms、einzbern、mana、ds，svg 路径与 `logos2/<data-logo>.svg` 逐条相等，四个 run 相同（acc/35-brand.json `matchesLogo`）；壳报告 brandDigest 24 个 run 全 pass（shell-brand-first-line 每 run checked 16，acc/27）；`14 log:7-8` BRAND_ASSET_SOURCE_VERIFIED，`firstLineMatches true` 8/8（`14 log:176-211`） |
| 2 字标墨迹中线与标中线差 ≤ 1；padding-top 4 变异判红 | 阻塞于 Owner（O-4） | 首行墨迹（壳报告 run 20–23，acc/26）：TMS 0.1 / −0.6、Einzbern −1.0 / −0.5、Mana −0.9 / −0.5、DS **1.4** / 1.0（侧栏 / 锁定块），en 与 zh-CN 逐值相同；R2 的 zh-CN −1.1 已消（zh-CN DS 首行字标与 title 都是「TCRN Design System」、字体 Hanken Grotesk，acc/35b-brand-sum.txt）；DS 侧栏 1.4 超 ±1（`18 log:11594,11774,11954,12134`）。变异 `story-word-padding-top-4` 判红 `lkr-line@22:tms 2.1`（`18 log:12435`）。O-4 不裁时按 R2 判断 §3.1 默认记部分 |
| 3 夜间 TMS 后缀 #2c63c8，矩阵格标红并注明待裁 | 满足（无回退） | 两主题首行 TMS 后缀 rgb(44,99,200)（acc/35b）；`06.05 log:52-53` 夜间 3.13 / 3.33 exempt 并引 D2；`contract/matrices.json:309,312,336` 墨 #2c63c8、exempt false |
| 4 brand-asset:proof 退出 0 | 满足 | steps 第 14 步 0 |

符合性：只把第一行与标居中、不重排、不改字重与颜色——侧栏 12.5/600 行高 15、锁定块 16/600、衬线 13.5 与 18/400，后缀 TMS #2c63c8、DS #6577f3，`b` 盒中线等于标中线（11 / 22），`em` 在 `b` 内（上下 −1 / −1、−1 / −2）（acc/35b）；首行标尺寸改读 token（`brand.css.ts:161,168,214` 为 `--tcrn-shell-mark-lg`、`--tcrn-shell-mark`；38、28 属第一批，按判断不动）。axe 首行后缀豁免已收（`a11y-axe-summary.json` 的 `wordmarkContrastExemption.selectors` 含 `.tcrn-brand-lockup__suffix`，violationCount 0）；换字跳过表与台账含 `.tcrn-brand-lockup__word`（browser-proof 回执 `localeLeakScan.exemptSubtreeSelectors`）；三张名单载体一致的测试 `05 log:342`；brandMarkLocaleChecks 五语全过，fr 描述行按契约读「Système de design」（`story-coverage-manifest.json`）。设计 README 与 `storybook-map.md` 已写两主题同色、O-3 已撤回（`storybook-map.md:33,36,138`）。

未满足：
- 标按钮与登入动画仍以产品键写 `data-logo`：文档壳标按钮 `svg[data-logo="design-system"]`（en 与 zh-CN，acc/40-docbrand.txt），而标按钮这一行本身带被量钩子 `data-lockup="lkr-line"`（`ShellBrandButton.tsx:83-84`），首行与被量锁定块已写标的 id「ds」（M42）。同一属性两种取值；DS、Mana、AOS 的标按钮一旦被 brandDigest 量到就找不到源（B3-1）。
- `docs/design/gplus-2026-10/storybook-map.json`（md 的机读同源件）的 `O-3` 仍把「夜间 TMS 取 #7aa0f5」写成现行，DIFF-10 的 story 文字与 status 是旧值，refs 无 SHELL-D2、D7（M10 问题 1）（B3-3）。

Subtask：SUB-194 自报部分（包时 zh-CN 换字尚未合入），批末实测达成——品牌 story 4 个 run 的 brandDigest 全绿，以实测为准。SUB-195 自报完成，实测达成。R2 项：B2-6、B2-7、B2-8 已解决；B2-11 的 md 两处已解决，json 孪生件见 B3-3。Owner 目视：待 Owner（八枚首行两尺度；zh-CN 现与 en 相同，可以看了）。

### 2.5 STORY-146 · PageHeader 必有与纸内布局（SUB-196 M1）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 不传 PageHeader 类型检查报错；传入则纸内首行是它 | 满足（无回退） | dist `Navigation.d.ts:662` `pageHeader: PageHeaderProps` 必填；`Navigation.test.tsx:553,560` 两处 `@ts-expect-error`，`02 log` typecheck 0；四个页面屏与文档页的纸内首个子元素是 `header.tcrn-page-header`（acc/33-pages-sum.txt） |
| 2 面包屑在 390 与 1440 宽一行、超出截断、有 title | 满足 | 1440：三段同 top、nowrap、ellipsis、title 全文，放得下所以不截；390 en：三段都截断带省略号与 title，nav 244 无溢出；zh-CN 放得下（acc/33b）。壳报告 singleLine 由 R2 的红转 pass（逐段读；`18 log:7365` 自检：截断带 title 的段过，无省略号的截断段判红）；pageCrumbs pass，`story-crumbs-spill` 判红（`18 log:12632`） |
| 3 SettingsLayout 1440 内容 ≤ 1040 且居中 | 满足（无回退） | 1440 克隆：内容 1040、离纸左右各 188（acc/34-wide.json）；settingsLayout pass，`story-settings-max-width-none` 判红（`18 log:12649`） |
| 4 SplitView 左缘 = 纸内容左缘 | 满足（无回退） | 1440 克隆：左缘 28 = 纸内容左缘 28、宽 1360；390：16（acc/33b）；splitView pass，`story-split-rail-240` 判红（`18 log:12667`） |

符合性：PageHeader 必有靠 prop 类型；面包屑任何宽度一行截断加 title；三种布局从纸缘起算，文档与设置页 1040 居中；页头间距 14、底线 1px rgba(22,21,15,.16)、标题 Source Serif 4 26/400/30（行高按 O-16 默认）；文档页 h1、页内壳 h2，TocRail 在 h1 页为 h2、在 h2 页为 h3，heading-order 0；Surface 与 Divider 规则无 px 字面间距。「几何门全绿」：geometry:proof 0（第 10 步）；geometry:measure 1（第 18 步）——geometry-measure-proof ok（`18 log:88`，R2 的 overlap 已消），shell-measure 夹具 ok（`18 log:7383`），stories 段只红 markText（`18 log:8245`），失败读数都在 145、138 的品牌锁定块上（O-4），不是本 Story 的读数；本 Story 的 singleLine、edges、settingsLayout、splitView、pageCrumbs 全 pass。所以只等 O-4。

Subtask：SUB-196 自报完成，实测达成（①②③；149-GWT4 不需镜像：`measure-shell.js` 不读面包屑）。R2 项 B2-9、B2-10、B2-5 已解决。Owner 目视：待 Owner（纸内页头、设置页 1040、名册页 SplitView、文档页目录标题 h2）。

### 2.6 START 质量硬线逐条核（壳层八条）

| 硬线 | 结论 | 证据与备注 |
| --- | --- | --- |
| 壳内常驻侧栏与收起钮 0 | 满足 | acc/32；noCollapse 16 个 run pass（checked 9 / 2 / 4 / 1，acc/27）；`story-x-button-back` 判红（`18 log:12468`） |
| 顶带无底无线，中线 26 | 满足 | strip、brandGeometry 16 个 run pass；`story-strip-bottom-line`、`story-brand-top-0`（tab.mid 20）判红（`18 log:12352,12319`） |
| 三处间距相等 | 满足 | pinSpacing pass；`story-pins-left-line` 判红（`18 log:12384`） |
| 接续 6 | 满足 | continuation pass；`story-menu-top-60` 判红（`18 log:12401`） |
| 锁定块只装饰 | 满足 | lockupDecor pass；`story-lockup-as-button` 判红（`18 log:12502`） |
| 品牌资产 digest | 满足（门）；家族一致性有条件 | brandDigest 24 个 run pass、`story-mark-path-coordinate` 判红（`18 log:12336`）、brand-asset:proof 0；标按钮与登入动画的 `data-logo` 仍是产品键（B3-1） |
| 标旁文字墨迹中线 = 标中线（±1） | 阻塞于 Owner（O-4） | DS 侧栏首行 1.4（en、zh-CN 同）；完整菜单、窄屏、矩阵底栏两行锁定块 TMS `lkr` en 1.7（zh-CN 1.0 过）（`18 log:8324-8340`，acc/26）；zh-CN −1.1 已消 |
| 登入动画只用 transform 与 opacity | 满足 | 本轮未改 `ShellIntro.tsx` 与 `shell-intro.css.ts`；`ShellIntro.tsx:145-151` 关键帧只有 opacity 与 transform；intro pass，`story-intro-no-session-marker` 判红（`18 log:12568`） |

第一批硬线与本分片相关的两条：「导航项一律单行截断加 title」现由基础规则保证，菜单内外都成立（2.2）；「任何元素不超出裁切祖先」首行 `em` 在 `b` 内，geometry-measure 的 clip pass。

## 3. 返工清单

**B3-1 · 标按钮与登入动画的 data-logo 改写标的 id（STORY-145 符合性、硬线「品牌资产 digest」；主属 136、141）**
- 现象：SUB-194 后，首行与被量锁定块的 `data-logo` 是标的 id（ds、mana、tms、einzbern），标按钮与登入动画的标仍写产品键（design-system、mana-orchestrate）；M42 把这个分叉写成了现状。标按钮这一行带被量钩子 `data-lockup="lkr-line"`，brandDigest 按 `logos2/<data-logo>.svg` 找源，量到 DS、Mana、AOS 的标按钮时会报 `mark.source`。现在被量的标按钮都是 TMS（两种键相同），所以门是绿的。
- 证据：文档壳标按钮 `svg[data-logo="design-system"]`（acc/40-docbrand.txt；静态 `components-navigation-shells.html` 3 处、`index.html` 1 处）；`ShellBrandButton.tsx:83-84`、`ShellIntro.tsx:336`；`docs/migration-4.0.md` M42 末句；M4 问题 4。
- 建议改法：两处改用与锁定块同一取法（`Navigation.tsx` 的 `productMarkIdOf`，抽到包内模块共用，不导出）；产品键留在 `data-product-id` 或 `data-product-mark`；`ShellBrandButton.test.tsx:79` 按产品键找标的断言同改；按 `data-logo="tms"` 选的测试不受影响；迁移说明从下一个空号追加一条，说明 M42 的末句不再成立。
- 改动文件：`ShellBrandButton.tsx`、`ShellIntro.tsx`、`Navigation.tsx`（取法外提）、相关单测；`docs/migration-4.0.md`、`CHANGELOG.md`（只追加）。建议档位：经济。可能与分片 A（136、141）重复。

**B3-2 · families.json 补登本 INIT 新增的根类（STORY-143 家族表；140 同改）**
- 现象：navigation 族缺 `tcrn-nav-item-row`、`tcrn-nav-pin`（STORY-142 新增的可钉行与钉钮）；shell 族缺 `tcrn-shell-cluster`（C8 登记的固定项）、`tcrn-shell-account`、`tcrn-shell-avatar`、`tcrn-shell-bell`、`tcrn-shell-sheet`；另有第一批 inputs 的 `tcrn-date-picker-wrap`、`tcrn-select-wrap`。这些类的发现记 unattributed（照查，不放宽），但 `--family` 筛选、按家族计数与 roles.json 的家族断言（测试第 583 行只断言 container 与 yield 在 shell 族）都漏掉它们。
- 证据：acc/43-families.txt（9 个类在 families.json 0 处；navigation 族 9 个块只有 `tcrn-nav-item`）；`scripts/contract-static-proof.mjs:277` `familyOf … ?? "unattributed"`；M2 问题 3。
- 建议改法：7 个 navigation、shell 类登进各自族的 blocks；inputs 两个类同包登记（只登记，不改组件）；测试第 583 行扩到 fixed 也须在 shell 族；跑 contract:static、contract:proof、doc-shell:proof，确认只多了归属、结论不变（预期 C8 仍 15 条）。
- 改动文件：`docs/contract/families.json`、`tests/contract-static-proof.test.mjs`。建议档位：主力（contract/*.json）。可能与分片 A（140）重复。

**B3-3 · storybook-map.json 与 md 同步（STORY-145 符合性「两主题同色」；150 同改）**
- 现象：md 第 3 行写「两份同源，改映射时一起改」，SUB-209 只改了 md；json 的 `refs.O-3` 仍把夜间 TMS 取 #7aa0f5 写成现行，DIFF-10 的 story 文字与 status（「已裁定（O-3，设计会话 B 类）」）是旧值，refs 没有 SHELL-D2、SHELL-D7。门只读映射行与 status 计数，所以没红。
- 证据：`docs/design/gplus-2026-10/storybook-map.json` 两处 `#7aa0f5`；`storybook-map.md:33,36,138` 已改；M10 问题 1。R3-28 点名的是 md 两处，已满足；json 未在 R2、R3 任何返工项里点名，按新发现列，不按「再不满足」交 Owner。
- 建议改法：把 md 第 33、36、38、138 行的内容照搬进 json 的 refs 与 DIFF-10；跑 storybook:visual-proof 与其测试，确认 differencesPendingOwner 不变。
- 改动文件：`docs/design/gplus-2026-10/storybook-map.json`。建议档位：经济。可能与分片 C（150）重复。

## 4. 只有 Owner 能定的事项

① **阻点 · 顶带 C8 的 15 条**（STORY-143 C1–C17；SUB-191；R2-12 起同一目标第三轮未达；尚无 O 号，owner-acceptance 记为 G-16，建议判断编号）。分两件定：
- a. 让步项最小宽（1 条）：板 `.ts-pins{min-width:0;flex:0 1 auto}`，C8 要非零 min-width，板上没有这个数。建议保留板值，裁定 C8 对「顶带」接受 min-width 0，条件是让步项裁切溢出、项内标签单行截断、固定项不收缩，story 层「无换行、无溢出」照查；另一条路是由设计会话给一个最小宽（例如一个固定项的最小宽）进 token。不裁时照红。
- b. 没有固定项的壳不渲染让步项（14 条）：建议 roles.json 给顶带加「让步项可缺省」，story 层只在有 `.tcrn-shell-pins` 时判唯一、不在固定项内、无行内覆盖；这是改门的判定语义，需授权。另一条路是 ShellPins 在 0 项时也渲染空让步位，属组件改动，还要先定空 nav 地标怎么处理，不建议。
- 登记本身建议保留：撤掉后 C8 又没有被测物。

② **阻点 · O-4（沿用）**：本分片 145-GWT2、146「几何门全绿」、硬线「标旁文字中线」都只等它。批末读数 DS 侧栏首行 1.4（en 与 zh-CN 相同），底栏两行锁定块 TMS en 1.7；R3 已消 zh-CN −1.1。建议同判断：±1 改量「首行大写顶到基线」，两行锁定块只量首行；不裁时照记红。

③ **新 · STORY-144 的 Sheet 假设文字**：Story 写「假定 Sheet 全屏、从顶带下方升起」，板 `shell-screen.mjs:119` `.ts-sheet{position:absolute;left:0;right:0;bottom:0;max-height:84%}` 是从底部升起、最高 84%，包件照板（acc/30 ts-m-s 盒 top 364、高 480；INC-399 页 top 548、高 296）。建议同 O-14：按板改 Story 文字，不改实现。

④ **沿用未裁，不挡本分片机判**：O-5（pin 实心态，Icon 板未画）、O-6（触摸端未固定钉钮平时不显）、O-15（Sheet 夜间遮罩与下一级）、O-16（纸内页标题行高 30 对板 28.6）、O-17（TreeNav 归宿）、O-8（夜间后缀 3.13 / 3.33，D7）、O-1（长字标）。

⑤ **目视（机器结论见第 2 节，未代签）**：142 图钉 hover、已固定、获焦三态与菜单 / Sheet 行图标盒（ts-x-l、ts-m-s）；143 Tabs 五形、面包屑分隔图标、TreeNav 在下拉里、菜单外禁用 NavItem 的原因改到下一行（SUB-192）；144 手机 Sheet（ts-m-s）；145 品牌 story 八枚首行两尺度（zh-CN 现与 en 相同）；146 纸内页头、设置页 1040、名册页 SplitView、文档页目录标题 h2。

## 5. 实施口径判定

只判本分片 Subtask（SUB-188 至 196）与直接影响本分片 Story 的条目；其余由分片 A、C 判。

M1（SUB-196；连带 SUB-206 对 142-GWT1、146 单行门的影响）：
1. story-label-plus-40 改为「去掉截断再加 40 字」：有条件。1440 下 13 处可见文字各加 40 字都是等价变异（截断带 title），新取法让变异回到「单行门看得见折行」，真件判红（lines 2、clip 8，`18 log:12535`）。条件：报告与 `mutations.json` 的 source 仍只写「标签加长 40 字」，应补写「去截断」；由分片 C（149）主判。
2. 三处 R2 读法的红在同一页上复现（不另写旧代码）：可接受。
3. 测试期望 o.prail 多收隐藏列的 −12：可接受（各门不判 o.prail，prail 检查读 x.prail）；o.rows、x.rowHeights 仍读不渲染的元素，记下一轮（M1 问题 5）。
4. singleLine 逐段读，板侧与包件走同一段代码，pageCrumbs 检查不撤：可接受。

M2（SUB-189、190、191；连带 SUB-181 对 144-GWT3）：
1. SUB-181 所在面板取最近的 `[data-panel]` 且限在被测屏内，夜间读数临时改屏块主题再改回：可接受（两主题碰撞 0、底色 alpha 1，两个变异都红）。
2. SUB-189 删 `scope.batch`，判定只看 `checkedBatches`；仓库运行 uncovered 非空即红，夹具评估默认不查：可接受（收紧；两向自检；README 第 11、79 行已由 M10 跟上）。
3. 附带改 clauses.md、roles.json、exemptions.json 的说明文字：可接受（不改条目的 clauses、until 与判定）。
4. SUB-190 `compositeCardClasses`：同带 Surface 与另一已登记家族类时去掉 layout 那部分：可接受（判断方案 (a)；Surface 套 Surface 仍记 layout 红，有自检）。
5. SUB-191 登记名「顶带」、cluster 未登进家族表：有条件，见 B3-2。
6. SUB-191 遇板上没有的数值不自定、不改门：可接受（判据原文要求）。

M3（SUB-188、SUB-192）：
1. SUB-188 保留 `justify-self: center`，不写 B2-2 的 `start`：可接受。盒宽与图标列宽是同一个 calc，位置与 start 相同，实测盒左缘 16；单测锁住 16 / 19 / 48。
2. SUB-188 不改 `shell-sheet.css.ts`（Sheet 根带 `tcrn-shell-menu`，同一条规则覆盖）：可接受（Sheet 实测同盒）。
3. SUB-192 基础规则另加 `display: block`：有条件。不加则行内 span 不截断；代价是 SideNav 等菜单外禁用项的原因改到下一行，消费方看得见，已写进 M45 与目视项。条件：Owner 目视。
4. SUB-192 title 改用递归取字 `navItemLabelText`，钉钮命名照旧：可接受。

M4（SUB-193、SUB-194；连带 SUB-178 对 145 首行尺寸、SUB-184 对 143 TocRail 名）：
1. TocRail 用 aria-label 取名，不用 aria-labelledby：可接受（静态页上 useId 可能重复）。
2. SUB-194 不用 `asset.markId`（其值是产品键），改取 `tcrnProductMarks` 里的标 id：可接受，结果与判据意图一致；brand-asset 比对键改为 marks.json 的标 id：可接受，字节比对不变，标 id 缺失即红，没有放宽（`scripts/brand-asset-source-proof.mjs:140-145`）。
3. SUB-194 自报部分（包时 zh-CN 换字）：以批末实测为准，已达成。
4. 新 token 名照默认（`--tcrn-shell-mark-lg` 等）：可接受（首行 22、44 读 token）。
5. 标按钮与 ShellIntro 的 data-logo 未改（M4 问题 4）：不在 SUB-194 判据内，未改可接受；问题本身列 B3-1。

M5（SUB-195）：
1. 首行锁定块的可及名取字标 `b` 的 title：可接受（名与可见字标一致）。
2. 描述行另查换字：可接受；M7 换成水合真件后期望已改读契约（fr「Système de design」，批末五语全过）。
3. 三张名单载体一致的测试（从 axe 名单删一项即红）：可接受。

不可接受：无。

## 6. 证据盲区

- 未重跑任何门：门结论取 c45c529 的批末日志与 HEAD 回执；HEAD 与 c45c529 只差 dispatch 文档。
- `test:dom` 不在批末 verify（O-18）：本分片 Subtask 的判据测试都在 verify 链内（ui-react 256/256、storybook 14/14、contract-static 74/74、shell-measure 41/41），未读 DOM 用例。
- 只用 Chromium；粗指针为仿真；五语只抽 en 与 zh-CN，ja、ko、fr 只读 browser-proof 回执。
- 故事屏「1440」的壳实宽 1006，设置页 1040 与分栏左缘的 1440 读数来自浏览器内存克隆，门的证明在页夹具上。
- 顶带中线、间距、接续只引门的 pass 与变异，未逐值重量；07a、07b 板未逐字节复读，只核了 `.ic`、`.ts-pins`、`.ts-sheet` 三条规则。
- C8 两种裁法对视觉与可及性的影响未实测，空让步位方案未做原型。
- 画布发布状态、`measure-shell.js` 与板的同步未核（M1 称 149-GWT4 相等、未镜像）。
- 读屏实际播报、RTL 未查。
