# R4 批末验收 · 分片 B（STORY-142 至 146；EPIC-045 导航、EPIC-046 品牌与布局）

节行号：1 一览 L11；2 逐 Story L33（2.1 STORY-142 L35、2.2 STORY-143 L46、2.3 STORY-144 L65、2.4 STORY-145 L76、2.5 STORY-146 L92、2.6 质量硬线 L113）；3 返工清单 L128；4 只有 Owner 能定的事项 L142；5 实施口径判定 L153；6 证据盲区 L173

被验对象：集成分支 `claude/init016-tab-shell`，验时 HEAD 0c1d4ce（摘录写 682fc94；其后两笔只改 `docs/dispatch`，`git diff --stat 682fc94 HEAD` 只有 6 个 dispatch 文件，acc/02）。批末 verify 跑在 682fc94（`runs/r4/verify/steps.md`，30 步红 2：第 13、18 步）。壳层门报告 `docs/verification/shell-measure/report.json` 由 SUB-224 在 0d9c6a7 写出，`git diff 0d9c6a7 682fc94 -- packages apps scripts tests docs/design docs/contract` 为空，且与批末 `18 log:8233-12787` 的 stories 段逐键相等，只差 behaviour 里一处 `durationMs` 477 / 478（acc/12b），所以报告就是 HEAD 代码的读数。静态 Storybook 是批末之后 `storybook:build`（退出 0）的产物。

方法只读：读批末逐段日志、HEAD 回执与门报告、源文件、dist 与静态 Storybook。scratch 只读脚本在 `acc-r4-B/probe/`：R3 分片 B 的 13 个探针原样重跑（经门自己的静态服务器与路由函数，Playwright Chromium，水合后量 DOM）；新写四个：Disclosure 描边与焦点环的像素读数（`disclosure.mjs`）、该按钮的裁切祖先（`clip-ancestors.mjs`）、静态页全部 `svg[data-logo]` 对 logos2 的路径比对（`logo-static.mjs`）、用门自己的 `buildScope` 读包 CSS 根类的家族归属（`unattributed.mjs`）。未改代码、门、回执、链，未重跑门、未构建、未跑引擎。Owner 目视不代签。

证据记法：`NN log:行` 为 scratch `r4-verify/` 下的批末逐段日志；`acc/文件` 为 scratch `acc-r4-B/out/` 下的探查输出；`壳报告 #n` 为上述 report.json 的第 n 个 run（逐 run 摘要 acc/11-report-summary.txt）。「同 R3」指 R3 探针在 R4 静态页上重跑，13 份 JSON 输出与 R3 的 `acc-r3-B/out/` 同名文件逐叶比对差异 0（acc/50-r3-r4-diff.txt）。

## 1. 一览

| Story | 结论 | 未满足或部分的 GWT | 返工项数 |
| --- | --- | --- | --- |
| STORY-142 图钉位与名册 pin | 满足（机器判据） | 无。R3 读数全部同值，无回退 | 0 |
| STORY-143 导航家族归位 | 阻塞于 Owner（O-19） | 四条 GWT 满足。符合性 C1–C17 只余 C8 15 条（O-19）。R3 的家族表缺口（B3-2）已由 SUB-215 补齐：包 CSS 136 个根类 unattributed 0。另：迁移说明 M30 末段的登记事实过期（B4-2，落在 143 的迁移条目上，主属 150-GWT2，不挡 143 的 GWT 与符合性） | 1（B4-2） |
| STORY-144 手机 Sheet 与 INC-399 | 满足（机器判据） | 无。Story 文字与板不一致，只改文字（O-20） | 0 |
| STORY-145 首行变体与 TMS 后缀 | 阻塞于 Owner（O-4） | GWT2：DS 首行墨迹 1.4（O-4）。R3 的两处符合性缺口都已解决：data-logo 只剩标 id 一种取值（B3-1 → SUB-212、214），`storybook-map.json` 两主题同色（B3-3 → SUB-221） | 0 |
| STORY-146 PageHeader 必有与纸内布局 | 部分 | 四条 GWT 满足。「几何门全绿」只差 markText（O-4）。硬线「任何元素不超出裁切祖先」：R4-3 点名的描边已画出（SUB-216 达成）；新发现获焦焦点环在底边与起始边仍被裁外侧 2px（B4-1） | 1（B4-1） |

返工 2 条：主力 0，经济 2（B4-1、B4-2）。R3 本分片 3 条返工（B3-1、B3-2、B3-3）与判断挂到 146 的 R4-3 都已解决（第 2 节逐条）；R3 已满足的 GWT 与硬线无回退。批末 verify 的两步红与 R3 相同，都只等 Owner：第 13 步 C8 15 条（O-19），第 18 步 markText（O-4）。R3 本分片的口径更正（G-16 写 18 条、owner-acceptance 写 O-4 是「唯一」挡 verify 的项）已由 SUB-224 改正（`owner-acceptance.md` 第 350、378 行）。

最终结论（预计末轮）：

| Story | 最终结论 | 剩余未满足项与归属 |
| --- | --- | --- |
| 142 | 机判满足 | 只剩目视（图钉三态、菜单与 Sheet 行图标盒）；O-5、O-6 不挡 |
| 143 | 只等 O-19 | C8 15 条（O-19）；B4-2（文档，不挡判据；不做则在收口汇报回显）；目视（Tabs 五形、面包屑分隔图标、TreeNav 在下拉、菜单外禁用原因换行）；O-17 不挡 |
| 144 | 机判满足 | Story 文字（O-20）；目视（手机 Sheet）；O-15 不挡 |
| 145 | 只等 O-4 | GWT2 DS 首行 1.4（O-4）；目视（八枚首行两尺度）；O-1、O-8、O-9 不挡 |
| 146 | B4-1 后只等 O-4 | 焦点环 2px（B4-1；不做则交 Owner 目视，owner-acceptance 第 268 行已写）；「几何门全绿」的 markText（O-4）；目视（纸内页头、设置页 1040、SplitView、目录 h2、Disclosure 描边 G-18 含 Safari 复看）；O-16 不挡 |

## 2. 逐 Story

### 2.1 STORY-142 · 图钉位与名册 pin（本轮无挂单）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 rest 与 hover 文字盒等宽；`display:none → inline` 变异判红 | 满足（无回退） | 门：pinJitter 在 12 个带菜单或 Sheet 的 run 全 pass（壳报告 #0–#11）；`story-pin-display-none-inline` 判红，`ts-x-l|column1.textWidths rest 247.3 / hover 223.3`（`18 log:12503-12505`）。实测：ts-x-l、ts-x-n 真实指针悬停前后标签宽差 0，浅色 en 与夜间 zh-CN 同 R3（acc/23、acc/24） |
| 2 role button、aria-pressed 与固定态一致、aria-label 含项名 | 满足（无回退） | 同 R3（acc/23、acc/24：原生 `button type=button`，aria-pressed 与固定态一致，可及名含项名，en 与 zh-CN） |
| 3 icons.json 38 且含 pin 描边与实心两态 | 满足（无回退） | `07 log:5,29` 名册 38 且与 `tcrnIconNames` 同名；本轮 `docs/design` 只改了 `storybook-map.json`，icons.json 未动 |
| 4 行获焦不悬停时图钉可见 | 满足（无回退） | 同 R3（键盘获焦 `:focus-visible` 为真、指针在外，图钉 opacity 1） |

符合性：槽 24、钮 24×24、图标 16、引导列图标盒 22×22 与内距 3、Sheet 热区 44 都同 R3（acc/20、acc/21、acc/30、acc/31）；prail 检查 12 个 run pass，`story-guide-icons-right-4` 判红 `prail.icon 20`（`18 log:12633-12635`）。本轮包件改动里涉及 Navigation.tsx 的只有把 `productMark`、`productMarkIdOf` 移到新模块，不碰 NavItem 与图钉。Owner 目视：待 Owner（O-5 实心态、O-6 触摸端常显仍按默认）。

### 2.2 STORY-143 · 导航家族归位（SUB-215，N2）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 每个退役件有弃用导出与迁移步骤 | 满足（无回退） | 弃用导出 6 件同 R3（acc/41）；迁移说明 M23（`docs/migration-4.0.md:726`）、M30（第 897 行）仍在；本轮 M49–M52 不涉退役件 |
| 2 五种旧形同一家族、同一选中态结构，selection:proof 0 | 满足（无回退） | `06.12 log` ok、`tabsFamily.selectedRules 1`、findings []（N3 本轮给禁形补了 G+ 名，仍 0 条） |
| 3 TocRail 在纸内；壳内常驻侧栏 0 | 满足（无回退） | 书签壳样板 TocRail 在该壳纸内、文档页目录在文档壳纸内，同 R3（acc/39、acc/37）；16 个壳屏常驻侧栏 0、收起钮 0、面板关闭钮 0，同 R3（acc/32）；noCollapse 16 个 run pass，`story-x-button-back` 判红（`18 log:12485-12487`） |
| 4 Breadcrumb 在 390 宽一行、截断、有 title | 满足（无回退） | ts-settings-m、ts-roster-m 三段同 top、nowrap、截断带 title，同 R3（acc/33）；singleLine 在 shell-mobile 4 个 run pass |

符合性：
- 家族表完整（R3 未满足；B3-2 → R4-4 → SUB-215）：**满足**。9 个类登进所属族（navigation 9 → 11、shell 14 → 19、inputs 14 → 16）；对 c45c529 逐字段比对，其余家族、各族 `components` 与 `batch`、顶层 `scope` 都不变，类不重属（acc/20）。用门自己的 `buildScope().familyOf` 读 dist `tcrnComponentCss` 的 136 个根类：unattributed 0，9 个类各归其族，各族计数与 N2 交回相同（acc/21）。登记测试把顶带的容器、让步项与两个固定项都钉在 shell 族（`tests/contract-static-proof.test.mjs:584`；`13 log:75`），contract-static 测试 74/74（`13 log:79-82`）。
- C1–C17：**未满足，只余 C8 15 条（O-19）**。`13 log:91-102` 只有 C8 red，C2、C5、C6、C7、C11、C13 green；C8 `byRule` 静态 1、story 14，`byFamily` shell 15（`13 log:209-219`）。组成与 R3 逐条相同，只是 story 层的 HTML 行号随 N3 删文档层样式前移 95（acc/44）。`checkedBatches [1, 2]`、`uncoveredFamilies []`、`invalidExemptions []`（`13 log:133,147,151`）。9 个类进入已检查批次的家族后没有带出新发现（N2 改前改后读数相同，C7 仍 0 条发现）。
- NavGroup、TreeNav 只在面板与下拉：文档页 TreeNav 4 处仍都在 `tcrn-popover` 内（acc/42-treenav.txt）。菜单外 NavItem 单行截断加 title 同 R3（acc/38）。包外 tcrn- 类 0（`12 log:29-30,46`）。
- 迁移说明：M30 的逐件表（第 906 行起）仍准确；但 M30 末段（第 936–941 行）写「navigation lists 9 … shell lists 14」与「`roles.json` lists no toolbar」，前者随 SUB-215 过期（现 11、19），后者自 R3 SUB-191（f26c633）登记顶带工具栏起就过期；M38–M52 都没跟上，全文「toolbar」只出现在 M30。块数一半 N4 已记（N4 问题 1），roles.json 一半是本分片新发现。列 B4-2。

Subtask：SUB-215 自报完成，实测达成：① 见上（acc/20、acc/21）；② 断言扩到 `toolbar.fixed`（第 580–584 行），按改前的表读 `tcrn-shell-cluster` 没有家族，断言必红（读代码确认）；③ C8 仍 15、其余条款 0、9 个类由 unattributed 变为各族，contract:proof（第 7 步）与 doc-shell:proof（第 12 步）退出 0。包自报与实测一致。

Owner 目视：待 Owner（Tabs 五形、面包屑分隔图标、TreeNav 在下拉里、菜单外禁用 NavItem 的原因换到标签下一行）。

### 2.3 STORY-144 · 手机 Sheet 与 INC-399（本轮无挂单）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 390×844 顶带只有标与示意，固定项 0 | 满足（无回退） | INC-399 段 760、390 两宽 `pinsShown 0`、标按钮 v1 64×40 在 (12,6)（acc/64）；ts-m-l 顶带读数同 R3（acc/30） |
| 2 打开 Sheet 行高 44；行高改 32 的变异判红 | 满足（无回退） | ts-m-s Sheet 行 44、搜索 44，细粗指针相同，同 R3（acc/30）；touch 在 shell-mobile 4 个 run pass；`story-sheet-row-32` 判红 `ts-m-s|sheet.row|32`（`18 log:12617-12619`） |
| 3 滚动 2000 后点标按钮 Sheet 打开（INC-399 门退出 0） | 满足（无回退） | 第 10 步 geometry:proof 退出 0；760 与 390 各三腿：基线纸滚 2000、命中标按钮、Sheet shown、行 44、搜索 44、ok；变异 hit 空、ok false；复原 ok；`redThenGreen` 全真（acc/64） |
| 4 夜间与浅色同一选择器属性集只换值 | 满足（无回退） | 包样式本轮只改 `base.css.ts` 一条规则（`git diff --stat c45c529 HEAD -- packages/ui-react/src/styles/`），`shell-sheet.css.ts` 未动；`06.02 log` 0 |

符合性：同 R3（标按钮高 40、Sheet 行与搜索 44、固定项不在顶带、滚动后可开、移动块纸与顶带几何，acc/30）。Story 写「Sheet 全屏、从顶带下方升起」，板与包件是自底升起、最高 84%：只等 O-20 改 Story 文字。Owner 目视：待 Owner（手机 Sheet；O-15 按默认）。

### 2.4 STORY-145 · ProductLockup 首行变体（本轮无直接挂单；SUB-212、214 属 136、141，SUB-221 属 148，判据写了 145）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 四枚产品首行的标 digest 等于 logos2 | 满足（无回退） | brandDigest 24 个 run 全 pass（壳报告 #0–#23，shell-brand-first-line 每 run checked 16）；`14 log:7-8` BRAND_ASSET_SOURCE_VERIFIED，`firstLineMatches true` 8/8（`14 log:176-211`）；八枚首行读数同 R3（acc/35）；静态页全部 101 个 `svg[data-logo]` 的路径与 `logos2/<data-logo>.svg` 逐条相等，0 处不符（acc/33-logo-static.txt） |
| 2 字标墨迹中线与标中线差 ≤ 1；padding-top 4 变异判红 | 阻塞于 Owner（O-4） | DS 首行 `lkr-line@22:design-system` 1.4，en、zh-CN、两主题 4 个 run 相同（壳报告 #20–#23，`18 log:11607,11787,11967,12147`）；其余三枚在 ±1 内，同 R3。变异 `story-word-padding-top-4` 判红 `lkr-line@22:tms 2.1`（`18 log:12452-12454`）。O-4 不裁时按默认记部分 |
| 3 夜间 TMS 后缀 #2c63c8，矩阵格标红并注明待裁 | 满足（无回退） | 两主题首行 TMS 后缀 rgb(44,99,200) 同 R3（acc/35）；`06.05 log:52-53` 夜间 3.13 / 3.33 exempt 并引 D2 与 SHELL 纪要；`contract/matrices.json:309,312,336` 墨 #2c63c8、exempt false（本轮未改） |
| 4 brand-asset:proof 退出 0 | 满足 | 第 14 步退出 0 |

符合性：
- 同一属性只有一种取值（R3 未满足；B3-1 → R4-1 → SUB-212、214）：**满足**。静态 Storybook 里 `data-logo="design-system"` 0 处、`data-logo="mana-orchestrate"` 0 处（ds 55、mana 2、tms 42、einzbern 2，acc/30-datalogo.txt）；文档壳标按钮 en 与 zh-CN 都写 `ds`，`data-product-mark` 留产品键（acc/32-docbrand.txt；R3 为 `design-system`）；dist 的 `ShellBrandButton.js`、`ShellIntro.js` 都写 `productMarkIdOf(productId)`（acc/31b），对 dist 新模块直调：tms→tms、design-system→ds、mana-orchestrate→mana、einzbern→einzbern；新模块不从 Navigation 入口与包入口导出（dist `index.js`、`index.d.ts` 0 处），exports:check ok；单测「标按钮与首行四个产品写同一 data-logo」在 `05 log:236`；迁移说明 M49（第 1337 行）写明 M42 末句不再成立。
- 两主题同色的机读件（R3 未满足；B3-3 → R4-8 (a) → SUB-221）：**满足**。`storybook-map.json` 里 `#7aa0f5` 0 处；`refs.O-3` 写已撤回，新增 `SHELL-D2`、`SHELL-D7`；与 md 第 33、36、38、138 行逐字相同，DIFF-10 的 story、status、refs 都是现行（acc/42-map.txt）；第 19 步 storybook:visual-proof 退出 0。
- 只把第一行与标居中、不重排、不改字重与颜色，首行 `em` 在 `b` 内：同 R3（acc/35）。axe 字标豁免选择器四项不变、violationCount 0（`a11y-axe-summary.json`）；豁免节点数 35 → 32 随主区滚动位置变（N2 问题 3），不判红。

Subtask：SUB-212、214（N1）与 SUB-221（N4）在 145 上的判据实测都达成，读数与交回一致（N1：ds 55、mana 2、tms 42、einzbern 2，与本分片计数相同）。DS、Mana 标按钮不在壳层门 brandDigest 的被测屏（拆分问题 4，判断不扩覆盖面），其 digest 证据为单测与上面的静态全量路径比对。Owner 目视：待 Owner（八枚首行两尺度）。

### 2.5 STORY-146 · PageHeader 必有与纸内布局（SUB-216，N1）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 不传 PageHeader 类型检查报错；传入则纸内首行是它 | 满足（无回退） | dist `Navigation.d.ts:662` `pageHeader: PageHeaderProps` 必填；`Navigation.test.tsx:553,560` 两处 `@ts-expect-error`，第 2 步 typecheck 0；四个页面屏与文档页纸内首个子元素是页头，同 R3（acc/33） |
| 2 面包屑在 390 与 1440 宽一行、截断、有 title | 满足（无回退） | 1440 与 390 读数同 R3（acc/33）；singleLine、pageCrumbs 在 16 个壳屏 run 全 pass；`story-crumbs-spill` 判红（`18 log:12649-12651`） |
| 3 SettingsLayout 1440 内容 ≤ 1040 且居中 | 满足（无回退） | 1440 克隆：内容 1040、离纸左右各 188（acc/34，同 R3）；settingsLayout pass，`story-settings-max-width-none` 判红（`18 log:12666-12668`） |
| 4 SplitView 左缘 = 纸内容左缘 | 满足（无回退） | 1440 克隆：左缘 28 = 纸内容左缘 28（acc/34）；splitView pass，`story-split-rail-240` 判红（`18 log:12684-12686`） |

符合性：
- 「几何门全绿」：**阻塞于 Owner（O-4）**。第 10 步 geometry:proof 0。第 18 步 geometry:measure 1：geometry-measure-proof 测试 72/72（`18 log:77-80`）、门 ok（`18 log:88`；clip pass、worst 0，`18 log:7300-7303`；新探针 paperFocusRing 真件 checked 9、regions 9、0 违规，`18 log:7286-7296`）；shell-measure 测试 41/41（`18 log:7383-7386`），夹具 ok（`18 log:7395`）；stories 段只红 markText（`18 log:8236-8260`），失败读数都在 145、138 的品牌锁定块上，不是本 Story 的读数；本 Story 的 singleLine、edges、settingsLayout、splitView、pageCrumbs 全 pass。
- 硬线「任何元素不超出裁切祖先」（layout 族，R3 判断改挂 R4-3）：描边**满足（Chromium）**，获焦焦点环**未满足（B4-1）**。interaction-disclosure-spec 实测（acc/61-disclosure-sum.txt）：
  - 内层计算值 `overflow: clip`、`overflow-clip-margin: 2px`、无内距；展开面板区域 100 / 100 / 100（1440 / 1024 / 390，en；夜间 zh-CN 1440 为 80），收起面板的区域与内层都是 0，无标题 CollapsibleRegion 48 / 68 / 68，与 N1 的改前读数相同，展开动画几何不变。
  - 静止态：按钮底与内层底重合（1440、1024 为 485.53），起始边与内层左缘重合。按钮下方一行、上方一行、起始边外一列、末端边外一列的均值为 139–140 / 145 / 144 / 144（背景 255），四边描边都画出；夜间 zh-CN 为 104 / 108 / 107 / 107（背景 25），同样画出。
  - 键盘获焦（Shift+Tab 再 Tab，`:focus-visible` 为真）：焦点对 `0 0 0 2px surface, 0 0 0 4px acc`（forced-colors 的 outline 2px、偏移 2px，同为外扩 4px）。上边与末端边外依次是 2 行承载面色、2 行强调色（11,107,101），环完整；底边与起始边外只有 2 行承载面色，第 3、4 行是背景 255，强调色环被内层的裁切边裁掉。三个视口与夜间（强调色 63,199,183）都一样。按钮的裁切祖先里只有这个内层贴边，下一层（readback panel）离起始边 26、底边 217（acc/65），裁切全来自内层。
- Surface 与 Divider 无 px 字面间距、页头间距与标题字形：同 R3（acc/33）；`base.css.ts` 本轮只改了 `.tcrn-collapsible-region__inner` 一条规则（第 2395–2403 行）。

Subtask：SUB-216 自报完成，实测达成：① 选 `overflow: clip` 加 `overflow-clip-margin: var(--tcrn-space-0h)`（`base.css.ts:2399-2403`；dist `styles/base.css.js:2370-2374` 同），收起态区域 0、grid 过渡不变；② 未新增 token，按钮描边画法未改；③ `Layout.test.tsx:66` 起的新例（`05 log:167`）读规则文本，断言 clip、margin 为 token 且 ≥ 1px、无 padding 与 border、0fr / 1fr；去掉 margin 的变异判红是 N1 自报，读断言可知删去那一行必红；④ ui-react 单测 258/258（`05 log:320-323`）、typecheck 0、tokens:proof 各段 0、contract:proof 0、contract:static 只有 C8 15 条；test:dom 不在批末（O-18），N1 自报 60/60。三视口描边读数与 N1 交回一致（N1 138.9 / 139.8 / 139.8，本分片 139 / 140 / 140）。焦点环被裁是 N1 自记的新发现（N1 问题 2），本分片复核属实，列 B4-1。WebKit 是否支持 `overflow-clip-margin` 未核（第 6 节）。

Owner 目视：待 Owner（纸内页头、设置页 1040、名册页 SplitView、文档页目录标题 h2、Disclosure 描边 G-18；owner-acceptance 第 268 行已写焦点环与 Safari 复看；O-16 行高按默认）。

### 2.6 START 质量硬线逐条核（壳层八条）

| 硬线 | 结论 | 证据与备注 |
| --- | --- | --- |
| 壳内常驻侧栏与收起钮 0 | 满足（无回退） | acc/32 同 R3；noCollapse 16 个 run pass（壳报告 #0–#15）；`story-x-button-back` 判红（`18 log:12485-12487`） |
| 顶带无底无线，中线 26 | 满足（无回退） | strip、brandGeometry 16 个 run pass；`story-strip-bottom-line` 判红 `strip.borderBottom 1`（`18 log:12369-12371`）、`story-brand-top-0` 判红 `tab.top 0`、`tab.mid 20`（`18 log:12336-12338`） |
| 三处间距相等 | 满足（无回退） | pinSpacing 12 个 run pass；`story-pins-left-line` 判红（`18 log:12401-12403`） |
| 接续 6 | 满足（无回退） | continuation 8 个 run pass；`story-menu-top-60` 判红 `menu.top-tab.bottom 8`（`18 log:12418-12420`） |
| 锁定块只装饰 | 满足（无回退） | lockupDecor 8 个 run pass；`story-lockup-as-button` 判红（`18 log:12519-12521`） |
| 品牌资产 digest | 满足（R3 有条件 → 满足） | brandDigest 24 个 run pass、`story-mark-path-coordinate` 判红（`18 log:12353-12355`）、brand-asset:proof 0；data-logo 只剩标 id，静态 101 个 svg 全与 logos2 同（acc/30、acc/33） |
| 标旁文字墨迹中线 = 标中线（±1） | 阻塞于 Owner（O-4） | DS 首行 1.4（4 个 run）；完整菜单、窄屏、矩阵底栏两行锁定块 TMS `lkr@22` en 1.7，6 处、两主题（`18 log:8337-8349,8489-8501,8896,9029,10489-10495,10785-10791`）；zh-CN 过 |
| 登入动画只用 transform 与 opacity | 满足（无回退） | `ShellIntro.tsx` 本轮只改飞行标 data-logo 一行与注释，关键帧（第 148–154 行）未动；intro pass，`properties [transform, opacity]`、`reloadPlays 0`、`reducedMotionPlays 0`（壳报告 behaviour）；`story-intro-no-session-marker` 判红（`18 log:12585-12587`） |

第一批硬线与本分片相关的两条：「导航项一律单行截断加 title」同 R3（acc/38、acc/23）；「任何元素不超出裁切祖先」：首行 `em` 在 `b` 内同 R3、geometry-measure 的 clip pass、Disclosure 描边已画出，获焦焦点环的底边与起始边仍被裁（B4-1）。

## 3. 返工清单

**B4-1 · DisclosurePanel 与 CollapsibleRegion 里控件的获焦焦点环底边与起始边被裁 2px（STORY-146 硬线「任何元素不超出裁切祖先」、焦点可见；layout 族）**
- 现象：SUB-216 把内层的裁切边外扩 `--tcrn-space-0h`（2px），够 1px 描边，不够焦点对（2px 承载面间隙加 2px 强调色环；forced-colors 的 outline 也外扩 4px）。展开区里贴着内层底边与起始边的控件获焦时，这两边只剩 2px 承载面色，强调色环被裁；上边与末端边完整。规则在内层上，所以任何放进 DisclosurePanel 或 CollapsibleRegion、贴着区域边的可聚焦控件都一样（包内 Feedback 的操作详情、AOS 视觉实例也用 DisclosurePanel）。R4-3 点名的是描边，已满足；焦点环是 R4-3 没点名的新目标（判断 §3.4 第 2 条的认定法）。
- 证据：acc/61-disclosure-sum.txt（1440 / 1024 / 390 浅色 en 与 1440 夜间 zh-CN：底边外第 3、4 行与起始边外第 3、4 列为背景，上边与末端边对应位置为强调色）；acc/65（内层是唯一贴边的裁切祖先）；N1 问题 2；`owner-acceptance.md` 第 268、352 行。
- 建议改法：内层的 `overflow-clip-margin` 改为焦点对的外扩 `var(--tcrn-space-1)`（4px）。包内已有同一读法：纸内滚动区的内收焦点对写「a surface gap of space-0h …, then the accent ring to space-1」（`shell.css.ts:941-950`），不是新语义，不新增 token；本分片量过，换成 4px 后这个按钮再没有别的裁切祖先在 4px 内（acc/65）。`Layout.test.tsx:66` 的新例把「margin ≥ 1px」收紧为「margin ≥ 焦点对的最大外扩」（从 `--tcrn-focus-ring` 读出 4px，或直接断言 token 为 `--tcrn-space-1`），改回 0h 时判红；交回用一次性探针读三视口获焦四边。代价：展开动画期间区域底外最多 4px 内容可见（现为 2px），并入 G-18 目视。若判断要求不依赖 `overflow-clip-margin`（WebKit 未核，第 6 节），另一条路是内层两向加 `--tcrn-space-1` 的内距再用等量负外距抵消，须量收起态仍为 0 高，改动面更大。
- 改动文件：`packages/ui-react/src/styles/base.css.ts`、`packages/ui-react/src/components/Layout/Layout.test.tsx`。静止态渲染不变（描边已在 2px 内），视觉签名不需重收；迁移条目可无（或在下一个空号写一句内层裁切边外扩到焦点对）。建议档位：经济（孤立修复；若判断认定与 R4-3 同一目标，按起始档与升档规则起主力）。门的焦点探针读不到 clip margin（N1 问题 4）属门读法余项（判断 §3.2），不并入本条。

**B4-2 · 迁移说明 M30 末段的登记事实过期（落在 STORY-143 的迁移条目上；主属 150-GWT2，可能与分片 C 重复）**
- 现象：M30（`docs/migration-4.0.md:936-941`）写「navigation lists 9 … shell lists 14」与「`roles.json` lists no toolbar」。现状：SUB-215（f29fb30）后 navigation 11、shell 19（inputs 16）；SUB-191（f26c633，R3）起 roles.json 登记了顶带工具栏（容器 `tcrn-shell-strip`、让步项 `tcrn-shell-pins`、固定项 `tcrn-shell-brand` 与 `tcrn-shell-cluster`，C8 读它）。M38–M52 都没跟上，全文「toolbar」只在 M30。逐件表仍准确，按 Do 去读 families.json 的消费方不会出错，但这一段会被读错。
- 证据：本条所引行；acc/20；`docs/contract/roles.json` 的 `toolbars`；`git log -- docs/contract/roles.json`；N4 问题 1（块数一半）。
- 建议改法：照 C-11 从 M53 起追加一条：三族的新块数与新登记的 9 个根类；roles.json 的顶带工具栏登记与 C8 读取它；写明 M30 末段两处数字与「lists no toolbar」不再成立，M30 正文不动；CHANGELOG 摘要同步一句。判断若放开 M30 正文，也可就地改这两句（二选一）。
- 改动文件：`docs/migration-4.0.md`、`CHANGELOG.md`。建议档位：经济。

## 4. 只有 Owner 能定的事项

本轮本分片没有新增 O 号事项。

① **O-19（沿用）**：143 的 C1–C17 只差它；C8 15 条组成与 R3 逐条相同（静态 1、story 14，byFamily 全在 shell）。SUB-215 只改归属，没有改变 C8 的被测物与结论。建议同判断 §3.1.1 甲。
② **O-4（沿用）**：145-GWT2、146「几何门全绿」、硬线「标旁文字中线」都只等它；读数与 R3 相同（DS 首行 1.4；底栏 TMS 锁定块 en 1.7，6 处、两主题）。建议同判断。
③ **O-20（沿用）**：144 的 Sheet 文字，只改 Story 正文。
④ 沿用未裁、不挡本分片机判：O-1、O-5、O-6、O-8、O-9、O-15、O-16、O-17。
⑤ **条件项**：判断若决定收口、不派 B4-1，「获焦焦点环底边与起始边少外侧 2px」作为已知缺口交 Owner 目视（owner-acceptance 第 268 行已写）；不派 B4-2，则 M30 末段的两处过期事实在收口汇报里回显。
⑥ **目视**（机器结论见第 2 节，未代签）：142 图钉三态与菜单 / Sheet 行图标盒；143 Tabs 五形、面包屑分隔图标、TreeNav 在下拉里、菜单外禁用 NavItem 原因换行；144 手机 Sheet；145 八枚首行两尺度；146 纸内页头、设置页 1040、名册页 SplitView、目录标题 h2、Disclosure 描边（G-18）。G-18 建议 Owner 在 Safari 与 Chromium 内核浏览器各看一遍：两者不同，即说明 WebKit 不认 `overflow-clip-margin`；机读核实 WebKit 要装 Playwright WebKit，属安装停点，本分片不建议为此安装。

## 5. 实施口径判定

只判本分片 Subtask（SUB-215、SUB-216）与直接影响本分片 Story 的条目（SUB-212、214、221 对 145）；N1 里 SUB-213 的口径由分片 A（140）主判，N2 §4 的六条都属 SUB-217，由分片 C（147）主判。

N1（`runs/r4/handoff/N1.md` §4、§5）：
1. 共用模块用默认名 `product-mark-id.ts`，导出 `productMark` 与 `productMarkIdOf`，错误文案不变，ShellBrandButton 自己按产品键找标、取字标的那一步未动：可接受。模块不从入口导出（dist 0 处）、只取类型、无加载环；ShellBrandButton 第 67 行与新模块各有一次同样的查找，是重复不是分叉，取值一致（`05 log:236`）。
2. 探针 id `paperFocusRing` 与等水合写法：分片 A 主判；本分片只确认它没有改变本分片的任何读数（壳报告与 R3 同值）。
3. SUB-216 取 `--tcrn-space-0h`（2px）不取 `--tcrn-space-1`：有条件。合 SUB-216 判据（只要求 1px 描边），按拆分默认先取最小的现有 token 也合理；条件是焦点环由 B4-1 补上，或 Owner 目视接受。
4. SUB-216 探针只读浅色、en 三视口：可接受；本分片补读夜间 zh-CN，结论相同。
5. 内层 `overflow: hidden` 换成 `overflow: clip`，迁移条目写「无」、N4 不收录：可接受。收起态已有 `visibility: hidden` 与 inert，展开态不需要内层滚动；版式与 API 不变（区域高读数不变）。

N2（SUB-215，交回 §2 与问题文件）：
1. inputs 两类就近排在 `tcrn-select`、`tcrn-date-picker` 之后：可接受（数组顺序不进判定）。
2. 登记测试扩到 `toolbar.fixed`，「一个类只属一个族」照旧：可接受（判据②原文）。
3. 不加「包 CSS 根类全部有家族」的守护测试（N2 问题 4）：可接受，超出「只改归属」的授权；现状 unattributed 0 已独立复核（acc/21）。建议随下一次改 contract-static 测试的单顺带加，不单开。

N4（SUB-221，只判对 145 的部分）：json 照 md 逐字搬、md 不动：可接受（acc/42-map.txt 逐字相同）。

不可接受：无。

## 6. 证据盲区

- 未重跑任何门：门结论取 682fc94 的批末日志与 HEAD 回执；HEAD 与 682fc94 只差 dispatch 文档。
- `test:dom` 不在批末 verify（O-18）：SUB-214 的 DS、Mana 两例只有 N1 自报（58 → 60 全过）；本分片读了 dom spec 源（`shell-intro.dom.spec.tsx:274-279`）与 dist 的取值代码，并直调了 dist 的 `productMarkIdOf`。
- 只用 Chromium（Playwright 只装了 Chromium）：WebKit 与 Firefox 是否支持 `overflow-clip-margin` 未核。本机有 Safari，驱动它要开 safaridriver，属改宿主设置，未做。Safari 若不支持，描边与焦点环在 WebKit 上照旧被裁（不比 R3 差）。
- R3 探针重跑、读数逐叶相同，只说明这些读数没有回退，不覆盖探针之外的面；五语只抽 en 与 zh-CN；粗指针为仿真；设备像素比 1，高分屏上 2px 裁切的观感未量。
- Disclosure 焦点环只量了 interaction-disclosure-spec 一处；Feedback 的操作详情与 AOS 视觉实例里的 DisclosurePanel 未逐个量，按同一条规则推定同样受影响。
- 1440 设置页与分栏读数来自浏览器内存克隆（同 R3）；故事屏「1440」的壳实宽 1006。
- SUB-224 重收视觉签名时 interaction-disclosure-spec 条目的处置未核（分片 C）。
- 画布发布状态、`measure-shell.js` 与板的同步、读屏实际播报、RTL 未查。
