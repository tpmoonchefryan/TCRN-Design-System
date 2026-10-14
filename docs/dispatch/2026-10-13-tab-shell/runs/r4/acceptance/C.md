# R4 批末验收 · 分片 C（TCRN-DS-STORY-147 至 150）

节行号：§1 一览 第 14 行；§2 逐 Story 第 43 行（147 第 45、148 第 104、149 第 127、150 第 151、START 质量硬线 第 204）；§3 返工清单 第 218 行（C4-1 第 220、C4-2 第 243）；§4 只有 Owner 能定的事项 第 261 行；§5 实施口径判定 第 275 行；§6 证据盲区 第 309 行。

被验对象：集成分支 `claude/init016-tab-shell`，验时 HEAD `0c1d4ce`，比摘录的 `682fc94` 多两个派工文档提交；`git diff 682fc94 HEAD` 只动了 `docs/dispatch/**` 下 6 个文件，所以代码就是批末 verify 跑的 `682fc94`。静态产物是批末之后那次 `storybook:build` 的输出（`storybook-build.exit` 为 0）。批末 verify 只改写了 `no-overclaim-scan.json` 与 `scaffold-proof.json` 两份回执（`status-after.txt`），树上其余回执与 N5 提交的逐字节相同。这也说明新截法下 browser-proof 两次运行（N5 一次、批末一次）写出的回执逐字节一致。

方法只读：
- 读批末逐段日志（写作 `NN log:行`，目录在 scratch `r4-verify/`）、树上回执、源文件与各包交回。
- 在 scratch `acc-r4-C/` 写只读探针。第三轮探针 `probe/docshell.mjs`、`probe2.mjs`、`probe3.mjs` 原样重跑，再与第三轮读数逐字段比（`probe-doc-cmp.txt`、`18-cmp23.txt`）。
- 新写的探针：`pngrows.mjs`（数批末 216 张 story 截图首尾的画布行）、`invalidbar.mjs`（37 页展开全部 story 后扫左边条）、`brandlogo.mjs`、`chev.mjs`、`counts.mjs`、`mapsync.mjs`、`vsr.mjs`、`gm*.mjs`。读数文件与脚本同名。

没有重跑门，没有构建，没有写链；工作树只新增本文件。

## 1. 一览

| Story | 结论 | 未满足或部分的 GWT | 返工项数 |
| --- | --- | --- | --- |
| 147 文档壳 | 满足（机器判据；判定人含 Owner 目视，未签） | GWT1–4 满足。R3 记「部分」的三项都已由 R4 解决：展开标题左边条（C3-1）、截图盲区（C3-2）、死代码（C3-6）。剩一处注释示例串（C4-1(c)），以及可推迟的同族空读回（C4-2） | 2（C4-1(c)；C4-2 可推迟） |
| 148 五样板 | 阻塞于 Owner（O-2） | GWT1 部分，只等 O-2，无回退；GWT2–4 满足；SUB-221 达成 | 0 |
| 149 壳层门 | 阻塞于 Owner（O-4、O-19） | GWT1：真件 18 门 17 过，红的 markText 只等 O-4。GWT2：批末 verify 第 13 步红只等 O-19，第 18 步红只等 O-4。GWT3、GWT4 满足 | 0 |
| 150 4.0.0 候选 | 满足（机器判据；判定人 Owner，未签） | GWT1–4 满足；owner-acceptance 与 R4 批末读数一致；有两处文字过期（C4-1(a)(b)） | 1（C4-1(a)(b)） |

返工共 2 条：
- 经济 1 条：C4-1，三处文字残余，不挡任何 GWT 或硬线。
- 主力 1 条：C4-2，门脚本里的空读回，可推迟。

与 R3 对照：
- 147：左边条由不满足转满足；截图盲区转满足（批末 154 张高 story 自检全过，本片另行独立复读 216 张截图，首尾画布行全为 0）；C3-6 的 (a)–(d) 都已落地。
- 148：map.json 与 md 同源。
- 150：README 件数、迁移说明开头与分消费方清单都已补齐；基线按新截法整批重收。
- 149：没有变化。

R3 已满足的项，本片逐条复测，无回退：第三轮探针重跑 26 次加载加两组探针，与第三轮读数逐字段比，只有展开标题两项变了，其余几何、交互与文案读数 0 差。

本片剩下的未满足项，各自只等以下一项：
- 148-GWT1：O-2。
- 149-GWT1：O-4。
- 149-GWT2：O-4 与 O-19。
- 四张 Story 转 done：S-1（库门）。
- 147、150 的判定人含 Owner 目视；148 的目视在设计会话发布画布之后。
- 150 另有推送、打 tag、发版、部署四个 Owner 停点。

## 2. 逐 Story

### 2.1 TCRN-DS-STORY-147 · 满足（机器判据）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 doc-shell:proof 包外类 0、例外清单为空 | 满足（无回退） | `12 log:29–30,46–47`：ok，`DOC_SHELL_CLASSES_PACKAGE_BACKED`，outOfPackageCount 0、列表 []。`:458` unmapped []；`:461–462` 模板类 35 个，missing 0。`06.10 log:20–28`：duplicateSelectors、packageClassAppearance、docExceptionsUnused 都是 0，「no drift」。现存 3 条登记例外（tooltip、filter-bar、skip-link，`shell-fidelity-proof.mjs:333–361`）都不是 SUB-101 的文档壳例外；白名单 14 项减为 7 项 |
| 2 顶带 52、纸 12 / 52 / 14、常驻侧栏 0 | 满足（无回退） | `probe-doc.json` 共 26 次加载：4 页 × 两主题 × 1440；foundations 与导航与壳层页 × 1023、761、760、390 × 两主题；zh-CN 两页。每次都只有 1 个文档壳且已水合。顶带 y 0、高 52，四边 0，无阴影；纸 (12, 52)，右与底各 12，圆角 14；纸外可见物 0，侧栏与收起类 0。与第三轮逐字段比，只有夜间 `body` 背景读数不同（那是过渡中的读数，见 §6），几何 0 差（`probe-doc-cmp.txt`） |
| 3 目录在纸内 TocRail | 满足（无回退） | `[data-doc-toc] aside.tcrn-toc-rail` 都在纸内，标题 h2。1440 时 x 1256、宽 144：导航与壳层页 11 项，样板页 6 项，foundations 2 项（`probe2.json` toc）。窄屏时目录与正文同列，仍在纸内 |
| 4 storybook:build 退出 0 | 满足 | `storybook-build.exit` 为 0。`storybook-build.log:67` 与 `03 log:87`：「no deprecated token names in 69 file(s)」。比第三轮多 14 个文件，即 SUB-222 改规则后开始扫的 `src/build` |

符合性：
- **文档壳由 ProductShell 顶带态渲染：满足（无回退）。**
  - probe2（622 个叶子读数）、probe3（684 个）与第三轮相比，只差展开标题那两项。
  - 不变的读数：≤ 760 时壳根 `data-state="sheet"`、行高 44；≥ 761 打开面板、行高 32；Esc 回焦；点纸、点遮罩都关闭；AOS 实例 12 个变体 h3、h4 裁切 0；首行字标五语原样；样板 12 个画框的壳高都是 640。
  - 26 次加载控制台错误 0。
  - 文档壳标按钮的 svg 现在写 `data-logo="ds"`、`data-product-mark="design-system"`，R4-1 在文档壳上也生效了（`43-bar2.txt`）。
- **4 条文档作用域例外与 2 条白名单删除、doc-shell 仍为 0：满足（无回退）。**
- **内容居中 1040：满足。** 1440 时正文 x 200、宽 1040，中心与纸中心差 0；窄屏时随纸收窄，中心差仍为 0。
- **夜间分类计数 ink-2：满足。**
  - 纸内分类索引的计数：夜间 rgb(169, 166, 156)，浅色 rgb(79, 76, 67)；index、foundations、components 三页都如此。完整菜单里没有计数（`41-counts.txt`）。
  - owner-acceptance 待裁表第 9 行写「N-1 随旧文档侧栏删除，不再有被测物」。那句指的是原侧栏上的计数；纸内索引计数是本判据现行的被测物，两种说法不冲突。
- **shell:parity：满足（无回退）。** `11 log:5`：ok 为真；baseline ok，mutated 判红，restored ok，rowBoxProbe ok。
- **START 禁用清单「左边条」：由不满足转为满足（C3-1，SUB-218）。**
  - 三页、两主题、1440 与 390 宽下，展开前后标题都是 box-shadow none、padding-left 0，左缘不动（1440 宽为 217，390 宽为 45）。三页是 components-overlays、foundations-tokens-i18n、components-gplus-samples（`43-bar2.txt`）。
  - navigation-shell-spec 展开后读 none / 0px；第三轮读的是 `rgb(11, 107, 101) 3px 0px 0px 0px inset` / 10px（`18-cmp23.txt`）。
  - chevron 由 none 变为 `matrix(0, 1, -1, 0, 0, 0)`，即旋转 90°（`chev.mjs`）。
  - 全站 37 页展开全部 story 后扫左边条（inline-start 边 ≥ 2px，或只在左侧的 inset 条），只找到 1 处：`tokens-copy-state` 里 `section.tcrn-content-scope` 的无效态 3px 状态色边。它属于契约门已登记豁免的第五批家族 `EX-INIT015-inspection`（`13 log:101` C11 豁免 38 条），不是本 INIT 的文档层（见 §6）。
- **视觉签名：截图盲区已解决，满足（C3-2，SUB-217 与 SUB-224）。**
  - 批末 `30.02 log:17–20`：门控 217 条，回归 0，新增 0。`:32–34`：storyCaptureFrameOk 为真，高于纸可见高的 154 张，自检通过 154 张。树上回执 `browser-proof-summary.json` 的 `storyCaptureFrame` 一节里六个失败列表都是空的。
  - 本片不借用门的函数，独立复读批末 216 张 story 截图：从首行、末行往里数连续的画布色行，全部为 0（154 张高 story、62 张矮 story 都是）；桌面宽高于 900 的截图仍是 44 张。`desktop-1440x900-i18n-theme-contract.png` 1040 × 1807，首 0 行、末 0 行；第三轮是上 448 行、下 490 行（`17-pngrows.txt`）。
  - 批末结果文件：216 帧的 widthKept、heightKept、bandClear、restored 全为真；画布色都读 [239, 238, 234]（浅色页）；高 story 末端画布行最大为 0（`16-vsr.txt`）。
  - `visual-signature.mjs` 本轮只增不删；签名算法、容差与选择机制都没改。
- **Owner 目视：不代签。**

R3 未满足项复核（按 R3 编号）：
- **C3-1：已解决**（见上）。
- **C3-2：已解决**（见上）。
- **C3-6：**
  - (a) 已解决。6 个类在源码、生成副本和构建页里都是 0 处（`11-deadclass.txt`）。`alpha-styles.ts` 在 R4 只删了 eyebrow、claim 与左边条三条规则；`.tcrn-doc-brand-system*`、`-lockups` 的规则与写入处都在，没有误删。只剩一处：`scripts/doc-shell-class-proof.mjs:147` 的 JSDoc 示例串（不是读取方）→ C4-1(c)。
  - (b) 已解决：白名单 14 项减为 7 项，与 `docs/style-scale.md:249–260` 一致。
  - (c) 已解决：smoke 15 次读回的 `retiredSideNavToggleCount` 都是 0，`17 log:6` ok 为真；旧的失败标识 0 处。
  - (d) 已解决：两份实例删了 4 个字段。第 5 个 `navLabel` 早已不在；`searchPlaceholder` 有读取，保留。typecheck 退出 0。
  - 同一族的空读回还有两处，在 browser-proof 与 geometry-proof 里 → C4-2（可推迟）。
- **R4-7 (e)(f)：已落地。**
  - `06.12 log:2–11`：sourcesScanned 16、selectionRulesScanned 25、findings []，语法文字已改用 G+ 名；自检三例在脚本里（`selection-grammar-proof.mjs:105–112`）。
  - `06.06 log:5,13,15`：SUB-222 用例通过，7/7。
- **批末与本 Story 有关的步骤都退出 0：** 03；05（storybook 14/14，`05 log:346–349`）；06.03；06.06；06.10；06.12；10；11；12；17；30.01–30.04。

| Subtask | 包自报 | 实测 |
| --- | --- | --- |
| SUB-217 | 完成 | 一致（见上）；截法的取舍见 §5 N2 |
| SUB-218 | 完成 | 一致 |
| SUB-219 | 部分（判据④的 grep 余 1 处） | 一致。类、规则、白名单、style-scale 都对；余下的 JSDoc 示例串交 C4-1(c) |
| SUB-220 | 完成（字段 4 个） | 一致；读数更正可接受（§5 N3） |

不列返工的观察，交判断：
- N2 问题 3：axe 那一遍的字标豁免节点随主区滚动位置变，35 变 32；两次违例都是 0。
- N3 问题 5：白名单里的 `.tcrn-segmented-nav` 在包内没有以它为主题的规则。
- N3 问题 6：G+ 禁形名单不含 `--tcrn-color-acc-bg`。本片查过，现在包与文档层没有任何选中态用它，只有悬停态与 Highlight 用到。

### 2.2 TCRN-DS-STORY-148 · 阻塞于 Owner（O-2）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 五块成品板 D 段各有顶带壳样板、几何同 07b | 部分（只等 O-2，无回退） | R4 没有动 `docs/design/visual-standard/**`（`git diff --stat c45c529 682fc94` 里没有该目录）；四板 D 段与 R1 的几何结论不变；Brand 板仍无 D 段 |
| 2 23 行全绿，删一个 story 判红 | 满足（无回退） | `19 log:4078–4079`：rowsOk 23，redRows []。`19 log:10,19` 删 story 判红的两条测试都过。报告 head 为 682fc94，map 23 行，differencesPendingOwner []，problems [] |
| 3 shellFrame 夹具绿；顶带加 1px 底线判红 | 满足（无回退） | `18` 第一段（`:85–7341`）：selfCheck ok，五个 shell-frame 变异夹具都判红。真件变异 `:7202` shell-paper-inset-zero 读 12、`:7212` shell-top-band-rule 读 1、`:7222` shell-top-band-68 读 16，都判红。22 次运行 0 红，shellFrame 最差值 0 |
| 4 五矩阵格数与对比度不变 | 满足（无回退） | `07 log:31`：6 板 306 格（44 / 28 / 10 / 116 / 42 / 66），最大差 0.00；`18` 第一段 contrast pass |

样板：probe3 与第三轮比 0 差。12 个画框里壳高都是 640，与画框底差 0；纸 12 / 52 / 12 / 12，圆角 14；顶带 52，无底线无阴影；固定项间距 [8, 8, 8, 8]；侧栏与收起类 0。

符合性：
- **storybook-map 两份同源：由有条件转为满足（C3-3(a)，SUB-221）。**
  - json 的 refs 共 25 个，与 md 引用表逐格相等。唯一的字面差是 md 表格里转义的 `\|`，语义相同。
  - 差异 11 条，canvas、story、status、refs 四栏逐格相等。
  - `7aa0f5` 0 处；待 Owner 裁定列表为 []（`mapsync.mjs`、`35-map.txt`）。
- **成品画布原地替换：** 本轮没有动画板。
- **Owner 目视（发布后）：不代签。**

| Subtask | 包自报 | 实测 |
| --- | --- | --- |
| SUB-221 | 完成 | 一致；本片逐格比了全表，比判据点名的 4 行更全 |

### 2.3 TCRN-DS-STORY-149 · 阻塞于 Owner（O-4、O-19）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 18 门全绿；每条变异判红 | 阻塞于 Owner（O-4）；变异部分满足（无回退） | 真件（`18 log:8233–12787`，24 次运行）：`:8237` ok 为假；`:8249–8268` 18 门 17 过，`:8257` markText fail；四项检查都过；故事变异 22/22 判红；D 段 12 行 11 过，只剩「标按钮（v2）」（`:12705`，与 markText 同根）。夹具（`:7391–8232`）：18 门与 4 项检查都过（Shell-2 板的 touch 是 n/a，检查数 0）；板变异 20/20、包件钩子 3/3、页夹具 4/4 都判红。`:7383–7386` 单测 41/41，其中 `:7360` 是 149-GWT1 板侧，`:7363` 是真件侧 |
| 2 verify 含壳层门且退出 0 | 不满足（只等 O-4 与 O-19） | 批末 30 步里红 2 步。`13 log:100`：C8 红，15 条（静态 1 条、story 层 14 条，全在 shell 家族），其余条款 0。第 18 步只有 markText。与第三轮相同 |
| 3 CI 必跑步骤含壳层门 | 满足（无回退） | `.github/workflows/verify.yml:59–63`（R4 没改）；`18 log:7361` |
| 4 measure-shell.js 与门同读数（±0.5） | 满足（无回退） | `18 log:7356`。R4 没改 `measure-shell.js`；SUB-213 只是给门加了 `paperFocusRing` 探针（`:7286`，9 个区域，0 违规） |

markText 读数（`31-gm-mt.txt`），与第三轮相同：
- DS 品牌首行 `lkr-line@22:design-system` 读 1.4。en 与 zh-CN 各两个主题，共 4 次运行（`18 log:11606,11786` 等）。
- TMS 锁定块 `lkr@22:tms`，en 读 1.7，共 6 处，各在两个主题下：`ts-x-l`、`ts-x-n`、`ts-search-l`、`ts-narrow-x-l`、shell-matrix 两格（`:8336,8488` 等）。zh-CN 过。

★ `runs/r4/verify/steps.md:57` 与 `problems/main.md` M2 写的是「DS 侧栏首行」。被量的其实是 `shell-brand-first-line` 的品牌首行锁定块，壳里没有侧栏。读数没有错，只是措辞，交判断或收口时改。owner-acceptance 写的是「品牌首行」，是对的。

符合性：
- 以下各项满足：18 门齐全；阈值只在 THRESHOLDS（R4 没改 `scripts/lib/gplus-measure.mjs`）；每门一条变异；运行只在 1440 × 900 与 390 × 844 两个视口、en 与 zh-CN 两种语言。
- 「全绿且变异全红」不满足，只差 markText（O-4）。
- 行为探针都过：
  - 登入动画：en 为 [transform, opacity]、477 ms，zh-CN 为 [opacity, transform]、493 ms；首载播 1 次，再载 0 次，减少动态效果时 0 次。
  - focusLoop 与点外部关闭：两种语言都过。
  - contrast：每次运行判 60 格，D7 的 3 格标 pending。
- 本 Story 本轮没有 Subtask。SUB-224 再生的壳层报告与仓内相比，只差登入动画两次时长的读数（N5 问题 4）。

### 2.4 TCRN-DS-STORY-150 · 满足（机器判据；判定人 Owner，未签）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 pack:smoke | 满足（无回退） | `16 log:6` ok 为真；三个包的 4.0.0 tarball |
| 2 迁移说明逐条有步骤 | 满足（无回退） | M1–M52 共 52 节，每节都有 Do。R4 只改了开头与「By consumer」，并追加 M49–M52；M1–M48 正文一行没删（`git diff -U0 c45c529 682fc94` 的删除行只在第 7、26、28–29、44–45 行）。EPIC-040 与 EPIC-049 各 8 条 breaking 都有对应条目（R3 已核，本轮没有回退） |
| 3 清单每板一节，不含构图一与侧栏项 | 满足（无回退） | `owner-acceptance.md` 第 35、52、73、95、119、142、165、197 行，八节对应 8 块板。「构图一」「侧栏」只出现在历史说明（第 7 行）、F 段弃用说明（第 209 行）、G-8 历史（第 342 行）、待裁表第 9 行（第 371 行）与删去项一节（第 396–409 行） |
| 4 version-surface 7 处 4.0.0 | 满足（无回退） | `29 log:245–277` |

符合性：
- **changelog 与版本面：满足。**
  - changelog 发布段 ok，pending 为 [4.0.0]（`29 log:212–240`）。
  - 三个包的 package.json 都是 4.0.0。
  - 仓库没有 `v4*` tag，分支没有 upstream。
- **迁移说明的开头与分消费方清单：由不满足转为满足（C3-4，SUB-223）。**
  - 开头写第二批为 M20 to M52，来源补上了 r2、r3、r4 三个交回目录（第 7、26–32 行）。
  - 三份清单按区间计（如「M10 to M14」）。对 M29–M52：AOS 全有；TMS 与 Einzbern 只缺 M48，M48 只与 AOS 有关。
  - CHANGELOG 4.0.0 摘要第 54–61 行列出了 M49–M52。
- **ui-react README 图标件数：由不满足转为满足（C3-3(b)）。**
  - 第 267、273 行写 38 个名字，第 301 行列出 `pin`。
  - 壳控制段第 334–336 行写明 `menuShortcut={false}` 的壳仍显示快捷键提示。
  - README 里已经没有「37」。
- **构建弃用提示的覆盖面（SUB-222）：满足。** 只跳过构建产物目录，`src/build` 照扫（`storybook-build.log:67`：69 个文件，0 个旧名）。
- **M30 有两处过期 → C4-1(a)。**

owner-acceptance 与 R4 批末读数对照：

| 清单所写 | 批末读数 | 一致 |
| --- | --- | --- |
| 机器证据入口（第 19 行）：nonVisualProofOk 为真；自检 154 张全过；重收 169 条（截法 144、截法加 R4-6 8、只有 R4-6 17）；R4-3 三条注明；基线 217；A 类 12 条；maxCell > 40 共 52 条 | `30.02 log:17–20,32–34`。选择文件 counts：entries 169、captureOnly 144、captureAndR46 8、r46Only 17、r43Noted 3、outliersA 12、maxCellOver40 52 | 一致 |
| §7 第 178 行：真件 17 门过；markText DS 1.4（en、zh-CN）、TMS 1.7（en）；四项检查过；触摸门过；story 变异 22 条判红；B 段 60 格按 data-expect 判，全过 | `18 log:8249–8268`；markText 读数见 §2.3；contrast 每次判 60 格；touch 在 shell-mobile 4 次运行都过；mutations 22 | 一致 |
| §8 第 203 行：D 段 12 行 11 过，「标按钮（v2）」红 | `18 log:12705` | 一致 |
| G-15、G-16（15 条）、G-17、G-18、G-20、G-21 | `13 log:100`；`30.02 log:32–34`；各包交回 | 一致 |
| 待裁表：第 378 行 O-4 与 O-19 并列；第 391、392 行分别是 O-19、O-20 | R3 判断 §3.1 | 一致 |
| 第四轮目视项：A 类 12 行逐条列；B、C、D 类按 story 合并为 14 行，共 40 条 | 选择文件 outlierClass：A 12、B 18、C 7、D 15 | 一致 |
| 六份回执字节（第 19 行引 N5） | 树上：360,801 / 447,382 / 6,890 / 39,705 / 916 / 210,252，与批末同字节 | 一致 |
| 四个停点 | 没有 tag，没有 upstream | 一致 |

清单里不一致的只有 R1 时写的两处指向和一张历史表，都归 C4-1(b)。它们都不是批末读数，不挡 GWT3：
- 第 201、208 行把 E 段消费方契约指向「M20 至 M29」。其中「⌘K 每个壳一次」写在 M41（M52 补了提示一句），M20–M29 里没有 ⌘K。
- 第三轮离群表（第 233–260 行）保留第三轮的签名距离，第 239、244、254 行仍写「Disclosure 底框线不可见」。表上没有注明它已被第四轮整批重收取代，也没有注明 R4-3 已改。

| Subtask | 包自报 | 实测 |
| --- | --- | --- |
| SUB-222 | 完成 | 一致：`06.06 log:5,13,15`；判定规则见 §5 N3 |
| SUB-223 | 完成 | 一致；M30 不在放开改动的范围内，过期部分交 C4-1(a) |
| SUB-224 | 完成 | 一致：批末 regressions 0、new 0；geometry:measure 只剩 markText；六份回执都小于 1,000,000 字节；`visual-selection-result.json` 没有入仓；改名为 `-init016-r3`，不与现有文件撞名 |

观察（N5 问题 2，不判红）：
- 47 条签名在容差内漂移，按选择机制不收进基线。
- `navigation-product-shell-spec@tablet` 是唯一仍留旧截法签名的高 story（mean 0.672、maxCell 7，在容差内）。
- 下次重收、分来源时，要把这两点算进去。

### 2.5 START 质量硬线

| 硬线 | 文档壳（147） | 样板（148） | 门（149 真件） | 结论 |
| --- | --- | --- | --- | --- |
| 壳内常驻侧栏与收起钮 0 | 26 次加载：纸外可见物 0，侧栏与收起类 0；面板与 Sheet 里收起钮 0 | 12 个壳都是 0 | noCollapse 过 | 满足（无回退） |
| 顶带无底无线、中线 26 | 四边 0、无阴影；标按钮与字标的中线都是 26 | 同上 | strip、brandGeometry、barCentering 过 | 满足 |
| 三处间距相等 | 1440 时标按钮到首项与各项之间都是 8（共 6 处，en 与 zh-CN）；< 1024 时固定项整组收进菜单 | [8, 8, 8, 8] | pinSpacing 过 | 满足 |
| 接续 6 | 菜单顶减标按钮底 = 6（1440、1023、761 三宽） | — | continuation 过（含下拉） | 满足 |
| 锁定块只装饰 | 不在控件内；可聚焦子元素 0；右缘 = 面板右缘 − 16；`svg[data-logo=ds]` | — | lockupDecor 过 | 满足 |
| 品牌资产 digest | 字标五语原样；标按钮 `data-logo="ds"` | 标与字标完整 | brandDigest 过；`14 log:7–8` BRAND_ASSET_SOURCE_VERIFIED | 满足 |
| 标旁文字中线 | 字标盒中线 26 | — | markText 红：DS 首行 1.4，TMS 锁定块 1.7（en） | 阻塞于 O-4 |
| 登入动画只用 transform 与 opacity | 文档页不播 | — | intro 过：两种属性；477 / 493 ms；首载 1 次、再载 0 次、减少动态效果时 0 次 | 满足 |
| 禁用清单「左边条」 | 展开标题 none / 0px；全站扫描只有 1 处，属已登记豁免的后批家族 | — | 无门量 | 满足（R3 不满足） |

## 3. 返工清单

### C4-1 收口前的文字残余三处（经济；不挡任何 GWT 与硬线）

**现象：**
- (a) 迁移说明 M30（`docs/migration-4.0.md:936–941`）在后续轮次后有两处过期：
  - 写 navigation 9 块、shell 14 块。SUB-215 补登 9 个根类后，`families.json` 实为 navigation 11、shell 19、inputs 16（N4 问题 1）。
  - 写「`roles.json` lists no toolbar」。但 SUB-191（f26c633，R3）已把顶带登记为 C8 工具栏：容器 `tcrn-shell-strip`，让步项 `tcrn-shell-pins`，固定项为标按钮与右簇。这一处是本片新发现。
  - 迁移说明里没有任何条目记这两项变化。
- (b) `owner-acceptance.md` 有两类旧文字：
  - 第 201、208 行把 07b E 段消费方契约指向「M20 至 M29」，但「⌘K 每个壳一次」在 M41 与 M52。
  - 第三轮离群表（第 233–260 行）没有注明已被第四轮整批重收取代；第 239、244、254 行「底框线不可见」是第三轮的状态。
- (c) `scripts/doc-shell-class-proof.mjs:147` 的 JSDoc 示例串 `".tcrn-doc-brand, [data-x]"` 用的是已删除的类。这是 SUB-219 判据④ grep 唯一的残余（N3 问题 1）。

**证据：** 上列行号；`families.json` 各家族块数；`roles.json` 的 `toolbars`；`git log -S` 定位到 f26c633；`11-deadclass.txt`。

**改法：**
- (a) 按 C-11 只追加，不改 M30：从 M53 起追加一条，写三族的新块数、补登的 9 个根类与顶带工具栏登记（注明 C8 判定待 O-19），Do 同 M30（从 `families.json` 读清单）；CHANGELOG 摘要同步一句。如果判断认定 M30 的 Do 已够用，也可以不加，在收口文件里写明。
- (b) 第 201、208 行改为「M20 至 M52（⌘K 见 M41、M52）」；第三轮离群表表头加一句：签名已由第四轮按新截法整批重收，表中距离是第三轮读数，Disclosure 三行的现状见第 268 行。
- (c) 示例换成在用的类，比如 `.tcrn-doc-page`。只改注释，不改判定。

**文件：** `docs/migration-4.0.md`、`CHANGELOG.md`、`docs/dispatch/2026-10-13-tab-shell/owner-acceptance.md`、`scripts/doc-shell-class-proof.mjs`（只改注释）。涉及 147（c）、150（a、b）。

**说明：** 主线程可以在收口的文档提交里顺手做，不必单独开包。(c) 改的是门脚本的注释，doc-shell:proof 的输入摘要不受影响。

### C4-2 门脚本里退役件的同族空读回（主力；可推迟，不挡 147 判据）

**现象：** 与 R4-7 (c) 在 storybook-smoke 里删掉的是同一种形状，还有两处。它们的读回恒为空，自身永远不会判红（N3 问题 3、4）：
- `scripts/internal-alpha-browser-proof.mjs`：
  - 第 989–1013 行定义 `expectedStorybookVisualSkin.sidebar*` 与 `expectedStorybookSidebarWidthForViewport`。
  - 第 1704 行读 `sideNavRegion`。
  - 第 1882–1886 行做宽度判定（期望 0，区域缺席时也读 0）。
  - 该区域已由第 1683 行的 `legacyProductShellGlobalNavCount` 判红覆盖。
- `scripts/geometry-proof.mjs:211–213`：用已退役的 `.tcrn-doc-shell[data-sidebar-collapsed]` 与 `[data-product-shell-collapsed]` 找收起祖先，结果恒为 null，`explicitHidden` 分支走不到。

**证据：** `runs/r4/problems/N3.md` 第 3、4 条；本片核对过对应行段。

**改法：** 照 SUB-220 (c) 的处置，删掉空读回、只为它服务的字段和死分支，其余判定不改。browser-proof 在截图输入摘要里，但改它只影响应用选择时的过期检查，不改签名，不需要重收。改完跑 browser-proof 与 geometry:proof 各一次。

**文件：** `scripts/internal-alpha-browser-proof.mjs`、`scripts/geometry-proof.mjs`。

**档位：** 门的结构调整，起主力。不影响 147–150 任何判据。建议并入下一次改这两个脚本的单，与 R3 判断 §3.2 对「壳层门读法余项」的处理相同。

## 4. 只有 Owner 能定的事项

新发现：本片没有新的、只能由 Owner 定的设计事项。新增的目视项（展开标题无左边条、截法变更、52 条离群）都已由 SUB-224 写进清单。

本片未满足项挂着的 Owner 项：
- **O-4**（149-GWT1、GWT2；硬线「标旁文字中线」；D 段「标按钮（v2）」）。两处读数：DS 首行 1.4（en、zh-CN），TMS 锁定块 1.7（en）。建议同 R3 判断：±1 改为量「首行大写顶到基线」，两行的锁定块只量首行。不裁则 149 不能收口。
- **O-19**（149-GWT2；C8 共 15 条）。建议甲：裁定顶带按板处理，`roles.json` 顶带一项加两个字段，门只对带字段的登记跳过这两项检查，主力约 25。不裁则 contract:static 一直红。
- **O-2**（148-GWT1）。建议接受「四板 D 段加 07a 第 1 段」，在链上注解写明这种读法。
- **Owner 目视**，本片不代签：
  - 147：文档站整体，第 269 行展开标题，截法变更后的离群项。
  - 148：四板 D 段，在设计会话发布画布之后看。
  - 150：全清单。
- **停点与库门：** 推送、打 tag、发版、部署是 Owner 的四个停点。S-1 库门声明 `verify` 之前，4 张 Story 都不能转 done。

## 5. 实施口径判定

| 包-条 | 写明的选择 | 判定 | 理由 |
| --- | --- | --- | --- |
| N2-1 | 截图时连文档壳根一起松开 | 可接受 | 壳根按 100dvh 高、`overflow: clip`，也在裁切；只松纸和主区不够。截完逐项复原，216 张都过 |
| N2-2 | 截图期间 story 的 `scroll-margin` 临时置 0 | 可接受 | 只影响 Playwright 截图前的滚动；有复原断言（story 也在复原表里） |
| N2-3 | 「顶带移出截图区」做成顶带留在原行，逐张断言不压 story 的盒 | 可接受 | 元素截图只截 story 的盒，顶带在盒外就不在截图里；216 张 bandClear 全真；本片复读截图，首行 0 画布行 |
| N2-4 | 自检阈值取 1 行：底边只要有一整行画布底就判红 | 可接受 | 比判据「下半部整片画布底」更严；旧截法 154 张都判红，新截法 154 张都是 0 行。只看底边，顶边由滚到视口顶与 bandClear 保证，本片复读首行也是 0 |
| N2-5 | 盒高变化也判红 | 可接受 | 收紧；216 张都没变 |
| N2-6 | 回执只写计数与失败 key，像素写进不入仓的结果文件 | 可接受 | 合 `environmentNormalization` 口径；批末两次运行的回执逐字节相同 |
| N3-1 | SUB-218 整条规则删掉 | 可接受 | 规则只有那两项声明；chevron 旋转仍在，本片实测 90° |
| N3-2 | SUB-219 白名单删 7 项（判据点名 5 项，加上锁定块 copy 与 caption） | 可接受 | 判据②明写「(a) 删后失去最后一条文档规则的项一并删」；剩下 7 项每项都至少有一条文档规则 |
| N3-3 | SUB-220 (c)：删 `sideNavRegion` 读回；切换钮改为反向断言 | 可接受 | 判据允许二选一；删掉的那处已有 `legacy-product-shell-global-nav` 计数覆盖；批末 15 次读回都是 0 |
| N3-4 | SUB-220 (e)：整名匹配 `acc`、`acc-2`，不含 `acc-bg` | 可接受 | 判据只列三个名字；`acc-bg` 现在没有选中态用到（§2.1）；要不要补是收紧，交判断 |
| N3-5 | SUB-222：`build` 上方没有 `src` 段算产物，在 `src` 下算源码 | 可接受 | 单纯按「扫描根的顶层」判不出 `src/build`；批末多扫 14 个文件、0 个旧名；除 `src/build` 外与旧规则相同，是严格的改进 |
| N3-读数更正 | (d) 是 4 个字段，不是 5 个 | 可接受 | 逐字段 grep 过；没有为凑数去删在读的 `searchPlaceholder` |
| N4-1 | json 保留 md 单元格里的反引号 | 可接受 | 两份逐字节同源；门读的字段不受影响 |
| N4-2 | N1 一条收为 M49；N3 两条收为 M50、M51；「expanded 是历史名」并进 M50；⌘K 提示单独成 M52 | 可接受 | 分组与来源都写明；M50 第 4 点满足 R3 判断 §3.4 第 7 条 |
| N4-3 | 末尾来源说明的新条插在第三轮那条之后，只增不改 | 可接受 | 合 C-11 |
| N4-4 | AOS 清单第 5 条「37-name」改为「38-name roster (M25)」 | 可接受 | 在放开改动的「By consumer」范围内，改的是与名册不符的旧数字 |
| N4-5 | README 名册列举补 `pin` 一行 | 可接受 | 不补就与 38 对不上 |
| N4-6 | 不收 SUB-216 与 N2 的条目 | 可接受 | 两包都写了「无」；SUB-215 让 M30 过期，N4 按 C-11 记问题、没有自改正文，处置对；内容缺口交 C4-1(a) |
| N4-7 | storybook:build 单独再跑一次 | 可接受 | 为了拿到退出码，没有副作用 |
| N5-1 | 改名为 `-init016-r3`；选择文件取 `-r4` | 可接受 | 与第一批 INIT-015 的 `-r3`、`-r4` 不撞名；按 KB-022 单独提交 |
| N5-2 | 来源按与 N2 终版同键比较来分，没有另建构建 | 可接受 | 方法写进了 `attributionMethod`；分不进来源与预期外的都是 0；R4-6 的 25 条逐条对到标题行 |
| N5-3 | A 类离群沿用第三轮口径（12 条），B、C、D 类 maxCell > 40 的 40 条一并列为目视项 | 可接受 | 比判据更全；类别标在 `outlierClass` |
| N5-4 | R4-3 在签名上读不出，只在三条上注明 | 可接受 | 同键 maxCell ≤ 3；目视项与 G-18 已写 |
| N5-5 | Disclosure 目视项顺带写 N1 问题 2、3 | 可接受 | 便于 Owner 一次看完；不改判定 |
| N5-6 | 发现一条理由写错后，用同一份量得结果重新应用 | 可接受 | 没有重截，没有手改应用记录；基线字节不变（21b915643554） |
| N5-7 | §7、§8 的机器判据改为第四轮读数 | 可接受 | 本片逐条对过，与批末一致（§2.4） |
| N5-8 | `attributionMethod` 措辞更正，不重新应用 | 可接受 | 只是说明字段，不进应用记录 |

不可接受：0 条。

## 6. 证据盲区

- **门与回执：** 没有重跑任何门。批末读数取自 `r4-verify/` 日志与树上回执；批末只改写了 no-overclaim 与 scaffold 两份回执，其余与批末同字节。149 的 D 段与板夹具只读了报告，没有用 measure-shell.js 复量板。
- **探针覆盖面：**
  - 文档壳：4 页 × 两主题 × 1440；2 页 × 1023、761、760、390 × 两主题；zh-CN 2 页；首行字标五语 1 页；样板页两主题；AOS 实例 1440 与 390。
  - 左边条扫描只在 1440 浅色下做，37 页全部展开。
  - 截图复读只数首尾画布行（浅色画布色 [239, 238, 234]，每通道容差 2）；顶带压不压 story 取门的 bandClear。
  - 52 条离群截图本片一张也没看。N5「R4-6 的 25 条差值都在标题行」只核了计数，没有逐条复核。
- **探针读数假象：** 夜间 `body` 背景每次读到的都是过渡中途的值（R3、R4 都是，且两次不同）。它不影响几何读数；门截图只在浅色页上做，216 帧的画布色都读 [239, 238, 234]，所以门的自检也不受影响。
- **后批家族的左边条：** `tcrn-content-scope` 与 `tcrn-dictionary-table` 无效态的 3px inline-start 边属于第五批家族，由 `EX-INIT015-inspection` 豁免到该批授权时为止。只有 `tokens-copy-state` 渲染了一处。本片不判，也不列返工。
- **没跑或没核的：**
  - test:dom 不在批末 verify 里（O-18）。
  - Track A（`storybook-preview-static`）没有核。
  - WebKit 下 `overflow-clip-margin` 是否生效没有核（N1 问题 3，属 146 所在分片）。
- **链与 Story 原文：** 没有读链上实时状态；Story 原文取自 scratch `chain/src/*.json` 快照。
- **残余：** scratch `acc-r4-C/` 里只有探针脚本与读数，可随 scratch 一起清掉。每个探针用的本地静态服务都在脚本退出时关闭，没有留下后台进程。
