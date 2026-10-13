# INIT-015 R3 批末验收 · 分片 B（STORY-123 至 127）

节行号：§1 一览 第 16 行；§2 逐 Story 第 35 行（123 第 37 行，124 第 56 行，125 第 69 行，126 第 88 行，127 第 118 行）；§3 返工清单 第 153 行；§4 Owner 事项 第 168 行；§5 实施口径判定 第 187 行；§6 证据盲区 第 217 行。

验收对象：集成分支 `claude/init015-gplus-renewal` HEAD a3f1893，工作树干净。R3 末次 verify 跑在 3f9d658；`git diff --stat 3f9d658 a3f1893` 只有 runs/ 下的调度文档（acc-C 摘录、main.md、verify/steps.md、state.md）。

证据：
- 会话 scratch `r3-verify/` 的逐段日志，引用写作 `NN log:行号`。10 号与 30.02 号的报告是单行或成段 JSON，另写字段名。真实 `run verify` 与 `storybook:build` 的退出码在会话 scratch `r3-final/verify.meta`：HEAD 3f9d6586，verify_exit=0，storybook_build_exit=0。
- 构建产物：`packages/ui-react/dist` 于 06:28 构建（真实 verify 的 build）。dist 行号写作 `dist:行号`，指 `dist/styles/index.js` 的 `tcrnComponentCss` 按换行切分后的行号。R3 改了壳 CSS，行号与 R2 验收文件里的同名引用不对应。`tokens.css` 指 `packages/ui-tokens/src/tokens.css`。
- 入仓回执 `docs/verification/internal-alpha/a11y-axe-summary.json`，a54355b 由 SUB-046 在 R3 树上再生。两次 verify 后只多出 no-overclaim-scan 计数与 visual-selection-result.json，已还原（steps.md 第 6 行），所以这份回执与 verify 结果相同。
- 源码只读探查；`git diff 61b0556 3f9d658`，即 R2 验收 HEAD 到 R3 verify HEAD。
- 唯一看过的图像：verify 留下的被忽略截图 `docs/verification/internal-alpha/screenshots/desktop-1440x900-inputs-matrix.png`（06:36 生成）。

未重跑门，未构建，未起浏览器，未运行引擎。机器判定不代替 Owner 目视（D8）。

## 1. 一览

| Story | 结论 | 未满足或部分的 GWT | 返工项数 |
| --- | --- | --- | --- |
| 123 Typography | 通过 | 无（沿用 R2 满足，R3 无回退） | 0 |
| 124 Icon | 通过 | 无（沿用 R2 满足，R3 无回退） | 0 |
| 125 Actions | 通过 | 无（沿用 R2 满足，R3 无回退） | 0 |
| 126 Inputs | 通过 | 无（GWT1、2、5 重验，仍满足；R2 的 B2-1 已由 SUB-091 关闭） | 0 |
| 127 Brand | 通过 | 无（GWT4 由 R2 的「阻塞于 Owner」转为满足；GWT3 按 O-3 只判浅色） | 1：B3-1，Owner 目视清单一行文字，不改变 GWT 判定 |

返工清单 1 条（B3-1）：经济档 1 条，主力档 0 条。

R2 本分片返工项的去向：
- B2-1：SUB-091 达成，见 126。
- B2-2：SUB-098 达成，属 STORY-133，由 C 片判。旁证：17 log 里 `focus-outline-width` 0 处，17 号退出 0。
- B2-3：SUB-096、SUB-097 达成。`docs/design/gplus-2026-10/README.md` 第 12 行已补 rf，第 16 行已补 29 条刻度 token、链接对表与生成去向；`docs/contract/README.md` 第 47 行改为整张表的状态规则；`docs/contract/roles.json` 的 description 写明第一批承载元素的 title 须含可见文字；`inputs.pairs.ts` 的段注释已补 rf。

R3 verify 与本分片：30 步 44 段全绿（steps.md）。本分片直接引用的 02、03、05、06.02、06.04、06.05、07、10、13、14、17、18、19、21、28、30.02 号都是退出 0。

## 2. 逐 Story

### STORY-123 Typography（无 R3 Subtask；R2 为 SUB-055）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 标题超宽：行框 1、省略号、带 title | 满足（沿用 R2 满足，R3 无回退） | dist:1252–1255 四级标题都有 `white-space:nowrap;overflow:hidden;text-overflow:ellipsis`。05 log:199「every heading level repeats its text as a title, and a given title wins」与 :200 通过。13 log:92 C7 0 条。18 号 typography-matrix 两轮 singleLine 都是 pass（18 log:1286、4155 起）。30.02 log:36 `clippedButtonText: false` |
| 2 Highlight 命中与未命中宽度差 0 | 满足（沿用 R2，R3 无回退） | 18 log:7110 probe highlightWidth pass，查 4 处，最大差 0.02px，门容差 0.5px。变异 mark-padding 被杀（18 号 mutations）。05 log:206–207 通过 |
| 3 numeral「4,280.00」为 Source Serif 4 300、tabular-nums | 满足（沿用 R2，R3 无回退） | dist:1262 numeral 为 `var(--tcrn-type-family-serif)`、`var(--tcrn-type-weight-light)`、`font-variant-numeric:var(--tcrn-type-numeric-tabular)`。tokens.css:93 serif 字栈以 "Source Serif 4" 打头，:126 weight-light 为 300，:129 为 `tabular-nums lining-nums`。05 log:204 通过；21 log:29 `ok:true` |
| 4 矩阵 44 格与画布逐格一致 | 满足（沿用 R2，R3 无回退） | 18 号 typography-matrix 浅色页轮（18 log:1286 起）与夜间页轮（18 log:4155 起）各 44/44 格，最大差 0；h1-l 两轮都是 18.29 对 18.29，link-l 6.35、link-hover-l 7.51。07 log:30 matrix-expect：240 格（44/28/10/116/42）期望与画板一致，最大差 0.00。19 号 typography.A、typography.B 行 ok |

R3 对本 Story 的触及（只核无回退）：
- R3 没有改 `typography.css.ts`、`typography.json`。`typography.scale.ts` 只变头部 contract-sha256，原因是 tokens.json 改了。
- roles.json 只改 description（SUB-096，O-7 维持），判定不变。
- RM8 的 4 条字面值仍在：dist:1264 的 16px、:1265 的 44/48px、:1268 的 11.5px。按 O-6 维持，不算硬线违例。
- SUB-055 无回退：dist:1272–1274 quiet 变体与两条 `:where()` 状态规则只切换生效对；05 log:208–210 通过；13 log:89 C2 0 条。13 log:150–158 的 C2 豁免只有 shell、navigation、records、display、boards、overlay、settings、feedback 八项，没有 typography。

硬线：状态对与特异性、主题同构、单行截断、禁用清单都满足（13 log:89–94 的 C2、C5、C7、C11 为 0）。

结论：通过。

### STORY-124 Icon（无 R3 Subtask；R2 为 SUB-056）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 任一名册名 16px 实测描边 1.25px | 满足（沿用 R2，R3 无回退） | 18 log:7121 probe iconStroke pass：74 枚 16px 图标、180 个子元素；strokeWidths 只有 "1.25px"，vectorEffects 只有 "non-scaling-stroke"，偏差 0。05 log:146 通过；18 log:73–76 测试 68/68，含红夹具 |
| 2 名册外名字类型检查失败 | 满足（沿用 R2，R3 无回退） | 02 typecheck 退出 0；05 log:148「names outside the roster and a strokeWidth override do not type-check」通过 |
| 3 package.json 搜 lucide 为 0 且构建通过 | 满足（沿用 R2，R3 无回退） | 根 package.json、`packages/*/package.json`、`apps/*/package.json` 与 pnpm-lock.yaml 不分大小写搜 lucide，0 处；03 build 退出 0；07 log:28 icon-roster 37 名一致 |
| 4 矩阵底色上图标 ≥ 3 | 满足（沿用 R2，R3 无回退） | 18 号 icon-matrix 两轮各 28/28 格，最大差 0（18 log:1681、4550 起）。最低一格是禁用格 dis-n 4.09（data-exempt） |

R3 对本 Story 的触及：`git diff 61b0556 3f9d658` 里没有 icon.css.ts、icons.json 与 Icon 组件的改动。

结论：通过。判定人含 Owner 目视，未代签。

### STORY-125 Actions（无 R3 Subtask；R2 为 SUB-057、SUB-079）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 `.tcrn-button` 的 :hover/:active/[aria-pressed] 无颜色、特异性 ≤ (0,1,0) | 满足（沿用 R2，R3 无回退） | dist:176–181 六条状态规则全是 `:where()`，只切换 `--tcrn-pair-*`。13 log:89 C2 0 条，C2 豁免里没有 actions（13 log:150–158）。05 log:63 通过。07 log:26：package-css 的 95 条状态规则没有颜色字面量 |
| 2 注入 `.scope .tcrn-button:hover{background:…}` 判红 | 满足（沿用 R2） | 13 log:11「132-GWT1: .x .tcrn-button:hover{background:#fff} turns C2 red」通过；另有 13 log:14–16 三条 C2 变异 |
| 3 116 格矩阵与画布逐格一致，禁用格标豁免 | 满足（沿用 R2） | 18 号 actions-matrix 两轮各 116/116 格，最大差 0（18 log:2175、5044 起）。pri-x-n 为 4.09，是禁用格，带 data-exempt。门对 exempt 格不判最低值（`scripts/lib/gplus-measure.mjs:475–478`；R3 对该文件的改动只加了 shellFrame，对比度段没动）。07 log:30 matrix-expect 一致 |
| 4 ButtonGroup 组内焦点环不被裁切 | 满足（沿用 R2） | 18 log:7088 probe buttonGroupFocusRing pass，查 10 个按钮，0 处裁切；05 log:77 |
| 5 按下 transform 为 none | 满足（沿用 R2） | dist 里在 :active 上写 transform 的规则，只有 dist:160 一带的 nav-item 等（dist:2748 复位为 none），以及导航容器内的原生 button（dist:3339，dist:2756 复位），没有一条落在 `.tcrn-button`。05 log:65；30.02 log:33 `buttonFeedbackOk: true` |

R3 对本 Story 的触及（只核无回退）：
- `actions.css.ts` 未改；`actions.pairs.ts` 只变头部 sha。
- SUB-057 无回退：dist:330–341 主题钮图标的显隐只挂在 `.tcrn-shell-theme-toggle[data-current-theme]` 上；05 log:183 通过。
- O-5 维持。收起 52 的侧栏放得下 38px 收起钮：P1 门外读数 7–45（`runs/r3/handoff/P1.md` 第 83 行）。
- O-9 维持：dist:170、:172、:174 的抬升层仍是 `rgba(22,21,15,.04)`，Owner 清单第 247 行已列。
- SUB-102 让 shell-fidelity 规则级守卫不再放行文档层改 `tcrn-button__label` 的换行属性，对 C7 是加严；06.10 绿。

结论：通过。

### STORY-126 Inputs（相关 R3 单：SUB-091，父单 129，改本 Story 文件；SUB-097 只改注释）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 文本类控件默认边 line-ctl 于 panel ≥ 3.1 | 满足（R3 重验） | dist:3169 `.tcrn-input` 与 :3170 `.tcrn-select` 都是 `--tcrn-pair-edge-d:inset 0 0 0 1px var(--tcrn-color-line-ctl)`。`inputs.pairs.ts` 在 R3 只变第 5 行注释与头部 sha（SUB-097）。同一 token 对的 ck-edge-l 3.16、ck-edge-n 3.34，两轮都与期望一致。05 log:137 通过 |
| 2 aria-invalid 且获焦：红边红环，无青色 | 满足（R3 重验） | dist:3177 `[aria-invalid="true"]:focus-visible` 切到 edge-ef。dist:3169 的 edge-ef 为 `inset 0 0 0 1px var(--tcrn-color-bad),0 0 0 2px var(--tcrn-color-surface),0 0 0 4px var(--tcrn-color-bad)`，没有 acc。rf（:3175）排在 e（:3176）、ef（:3177）之前。05 log:137 通过 |
| 3 SearchInput 夜间占位 ≥ 4.5 | 满足（沿用 R2，R3 无回退） | search-ph-n 两轮都是 6.11 对 6.11（18 号 inputs-matrix）；05 log:142 通过 |
| 4 DatePicker 点右侧 30px 打开系统日历 | 满足（沿用 R2，R3 无回退） | 18 log:7099 probe datePickerIndicatorHit pass，2 个；05 log:144。无头浏览器不弹系统日历，沿用 R1 的落点口径 |
| 5 42 格矩阵与画布逐格一致 | 满足（R3 重验） | 18 号 inputs-matrix 两轮各 42/42 格，最大差 0（18 log:3000、5869 起）；err-msg-l 6.69、err-msg-n 6.88、opt-sel-l 16.18、opt-sel-n 12.15；两轮 controlHeight 都是 pass。19 号 inputs.A、inputs.B 行 ok；07 log:30 一致 |

R3 Subtask 判据：
- **SUB-091 达成**（B2-1 的承接，第二次返工，主力档），实测与 P5 自报一致：
  - dist:4129 为 `.tcrn-multi-select-dropdown{position:relative;display:flex;flex-direction:column;align-items:stretch;…}`。
  - dist:4130 触发器仍是 `padding-inline-end:30px`，所以 SUB-061 的末端区不回退。
  - 28 log:34 multiSelectDropdown ok；closed-select-family-empty（28 log:39）、public-popup-family-light（:233）、public-popup-family-dark（:334）都是 ok，R2 时 dark 一例是红的。
  - 截图 `desktop-1440x900-inputs-matrix.png`：两主题块的列表都在触发器正下方，与触发器同宽；四个选项各占一行，不折行。
  - 05 log:220–223 ui-react 163/163。Form.test.tsx 未改。
  - Owner 清单第 174 行已改为复核项，这是 B2-1 的改法。
- SUB-097：inputs.pairs.ts 段注释补 rf，判定不变。

R2 Subtask 无回退：
- SUB-058：dist:3169 有 edge-rf，dist:3175 有 rf 规则；05 log:138。
- SUB-059：dist 里没有壳内 search-input 的 focus-within；B2-2 已由 SUB-098 关闭。
- SUB-060：dist:3108–3110 `.tcrn-field__error` 为 bad。
- SUB-062：dist:1039 快捷键为 ink-2；30.02 log:12 axe 违规 0。

硬线：状态对与特异性（C2 0）、焦点可见（rf）、文字对比、主题同构、单行截断、禁用清单都满足。同类一致：闭合态满足（28 号）；静态展开态的问题已修复，见 SUB-091。

结论：通过（GWT1–5 满足）。判定人含 Owner 目视，未代签。

### STORY-127 Brand（R3 Subtask：SUB-088、SUB-089；GWT4 依赖 SUB-090）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 mana-orchestrate 加 ja 标语为「プロジェクト記憶アシスタント」，不含 Claude、Codex | 满足（沿用 R2，R3 无回退） | R3 没有改 marks.json、`product-marks.generated.ts`、`brand.css.ts`（`git diff --stat 61b0556 3f9d658` 无这些文件）。Navigation.test.tsx:306–308 渲染 ja，逐字比对标语，并断言不含 Claude/Codex；:325 断言注册表不含这两个词。所在用例 05 log:167 通过 |
| 2 任一产品标 SVG 改一个字节判红 | 满足（沿用 R2，R3 无回退） | 14 log:7–8 `ok:true`、`BRAND_ASSET_SOURCE_VERIFIED`。14 log:89–131：productMarks 八个文件都是 renderedMatches。门按字节数与 sha256 比对（`scripts/brand-asset-source-proof.mjs:75–83、117`）。07 log:13「a changed mark or a changed byte turns product-marks red」通过；07 log:29 product-marks PASS |
| 3 后缀 computed color：TMS #2c63c8、DS #6577f3、TCRN 为 ink | 满足（按 O-3 与拆分「沿用 R1 口径只判浅色」；夜间 TMS 为 #7aa0f5） | tokens.css:2 浅色块 `:root, [data-tcrn-theme="light"]` 的 :45 为 `--tcrn-brand-suffix-tms: #2c63c8`；:124 主题无关块里 design-system 为 #6577f3；夜间块（:215）的 :258 为 #7aa0f5。Navigation.test.tsx:721–722 用 token 表读出 TMS #2c63c8、DS #6577f3，所在用例 05 log:178 通过。brand-matrix 两轮 suffix-ink-l 18.29、suffix-ink-n 14.38（18 log:2087、4956 起），即 TCRN 为 ink。a11y 回执的 wordmarkContrastExemption 两条登记前景色都是 #6577f3，豁免节点 80；豁免按「后缀选择器 + 登记色」匹配（R2 判断 §3.3 第 3 条），说明浏览器读到的 DS 后缀前景色与登记色 #6577f3 相符 |
| 4 侧栏收起到 52px：文案 display:none、标 22 不缩放 | 满足（R2 为阻塞于 Owner，按 O-1 授权落地） | 宽：dist:547–548 收起态 `--tcrn-product-shell-sidebar-width: var(--tcrn-shell-sidebar-width-collapsed)`，tokens.css:120 为 52px。文案：dist:638–641 收起态 `.tcrn-shell-brand-lockup__copy`、`.tcrn-product-logo__copy` 为 display:none。标：dist:604–605 壳内锁定组合 mark 为 22px，收起态没有规则改它，:634–637 只把品牌链接设为 42。门：10 log:5 geometry:proof `ok:true`；brand.baseline.collapsedRail 为 collapsed "true"、sidebarWidth 52、mark 22×22、copyDisplay none；侧栏宽回 92 的变异 broken 为红、restored 为绿，标缩到 11×11 的变异同样红后转绿（redThenGreen 的 brandCollapsedRailWidth、brandCollapsedMarkScale）。另：smoke 的 ownerQualitySideNavPolicy railWidthPx 由 token 取 52（17 log:12675，`ai-consumption-contract.ts:874`），三个已登记收起变体（含夜间）按 52 判，17 号退出 0；P1 时同一检查以 52 对 92 判红（`runs/r3/problems/P1.md` §1a） |

R3 Subtask 判据：
- **SUB-088 达成**，实测与 P1 自报一致：
  - tokens.json brand 段 brand-suffix-tms 加了 `night: #7aa0f5`、`nightRef: marks.json#tms.palette.bright`；marks.json:21 的 bright 正是 #7aa0f5。其余三条不变，DS 仍为 #6577f3。
  - 生成器 `brandTokens()` 接受可选夜间值，并按 marks.json palette 校验 nightRef，不符就报错。带夜间值的条目写进浅色块与夜间块（tokens.css:45、:258），不带的照旧写主题无关块（:122–124）。
  - 06.02 log:2：两个主题块同为 86 个属性；13 log:90 C5 0 条。
  - token-contrast-proof.mjs 的 WORDMARK_EXEMPTIONS 只剩 DS 浅色两条，NIGHT_PENDING 已删，scripts 与 tests 里没有残留引用。
  - 06.05 log:52–53：夜间 tms 于 panel 6.86、于 bg 7.30，都是 pass，不是 exempt。06.05 log:27–28：DS 浅色两条 exempt。06.05 log:61 ALL PAIRS PASS。
  - 06.04 log:11「O-3: the night TMS suffix passes on bg and panel by itself, with no exemption」通过，11/11。
  - index.test.ts 改为按主题断言，05 log:9–22 ui-tokens 10/10。
  - axe 回执只剩 DS 浅色两条登记；30.02 log:13 豁免节点 80，:12 违规 0。internal-alpha-browser-proof.mjs 未改，豁免随导入自动收窄。
  - 条件文件：Navigation.test.tsx 只改了原先写着「两主题同值」的注释；ai-consumption-contract.ts:1029 的文字改为「TMS #2c63c8, by night its bright #7aa0f5」；token-deprecation-notice.test.mjs 未改（06.06 绿）。
  - DIFF-10 已记入 `storybook-map.md:110`。
- **SUB-089 达成**，实测与 P3 自报一致：
  - 门只改了 `scripts/geometry-proof.mjs`（11ed8f3）。COLLAPSED_RAIL 在 :30，容差 0.5 写在门里；读数前等宽度过渡结束（:146）；判定在 :159。
  - 两条变异沿用 addMutation、removeMutation 的写法（:470–477），并计入总判定（:509）。
  - 读数见 GWT4，红后转绿都成立。原有 brand 变异仍然独立判红：10 log:5 的 brand.broken 里 collapsedRail.ok 为 true，而 ok 为 false。
  - 宿主沿用 owner-quality-product-shell 的收起变体。判断写的 navigation-product-shell-spec 渲染的是 `collapsed={false}`（story-content.tsx:2250），拆分判据允许取「能渲染包 ProductShell 收起态的现存 story」，没有新增 story 钩子。

其它：
- O-2 已随 O-1 解决，没有新增豁免。30.02 log:12 axe 违规 0；brand-matrix 的 rail-tag-l 4.86、rail-tag-n 4.89 与判断给的 ink-3 于 bg 读数一致。
- DIFF-8、DIFF-9 按 R2 判断 §3.3 第 1、2 条记为「待 Owner 知悉」（storybook-map.md:108、109）。
- 文档壳不是本 GWT 的判定对象：拆分 SUB-089 的判据把 127-GWT4 落在包 ProductShell 上。文档壳收起后为 52，但品牌锁定组合仍是 38 标，文案用 max-width 0 裁掉，而不是 display:none（P3 交回「续派」偏离第 4 点；Owner 清单第 78、225 行）。这一项已列入「待 Owner 裁定」第 1 条，见 §4。
- 目视清单第 128 行的夜间格与 O-3 不符，见 B3-1。

结论：通过（GWT1–4 满足）。判定人含 Owner 目视，未代签；按 R2 判断 §3.3 第 9 条，机器判据满足即可转 done。

## 3. 返工清单

档位按派工规则：改共享契约（token 键集、`contract/*.json`、导出面、门的判定语义）起主力档，孤立修复起经济档；同一修复目标第二次返工，经济档升主力档。

**B3-1 Owner 目视清单 Brand 节第 128 行的夜间格仍写 TMS 后缀 #2c63c8**（经济档；STORY-127，文档）
- 现象：
  - `docs/dispatch/2026-10-11-gplus-renewal/owner-acceptance.md:128` 为「TCRN 为墨色中等字重；TMS 后缀 #2c63c8，Design System 后缀 #6577f3；渐变文字已停用（D2） | [ ] | [ ] |」，浅色、夜间两格共用这句话。
  - O-3 之后，夜间 TMS 后缀为 #7aa0f5（tokens.css:258）。同一文件第 74、136、236 行已写 #7aa0f5，只有这一行没跟上。
  - Owner 按这一行勾夜间格时，会把正确的 #7aa0f5 看成不符。
- 改法：把这一句改为「TMS 后缀浅色 #2c63c8、夜间 #7aa0f5（O-3，SUB-088）」，其余不动。
- 改动文件：`docs/dispatch/2026-10-11-gplus-renewal/owner-acceptance.md` 第 128 行。
- 复核：全文搜 `#2c63c8`，凡是对夜间格成立的句子都带上 #7aa0f5；public-output:scan、internal-vocab:scan、readme:proof 不转红。
- R2 是否改过同一目标：否。SUB-106 在 R3 回写过本文件，但没有动这一行。
- 不改变 127 的 GWT 判定。

## 4. 只有 Owner 能定的事项

新发现：
1. **收起态 52 栏里，标、收起钮与导航图标的中轴不在一条线上（目视项，建议补进清单第 131 行）。**
   - P1 的门外读数（`runs/r3/handoff/P1.md` 第 81–84 行，scratch 脚本，不是门）：收起钮 7–45，中心 26；品牌链接 5–47；标 5–27，中心 16，在 42 宽的品牌链接里靠起始边；导航图标 14–30，中心 22；侧栏中心 26。
   - 原因：dist:622–637 的品牌链接是 flex，收起态只设宽 42，没有让内容居中。这几条品牌规则 R3 没改，旧 92 栏也是同样的偏法。
   - 127-GWT4 只要求「标 22 不缩放」，所以不判返工。本分片没有读构图板，无法确认收起态是否要求标居中。
   - 建议：Owner 在清单第 73、131 行目视时看这一点。若要居中，给收起态品牌链接（dist:634–637 那条规则）加 `justify-content:center` 是孤立修复（经济档）；导航图标的位置属 Navigation 家族，留第二批。
2. 无其它新增。

与既有裁定的关联（不是新事项，收口时一并回显）：
- O-1：127-GWT4 的满足建立在 O-1 授权之上。Owner 更正为不授权时，按 R1 §3.1 O-1 撤回 R3-11 的读数与 SUB-090 的 52，127-GWT4 回到阻塞于 Owner。
- O-3：127-GWT3 只判浅色；Story 的 GWT 原文没有分主题，改原文须 Owner 明示。Owner 更正时，按 §3.1 撤回夜间值并恢复两条豁免。DIFF-10 对应的 Brand 板夜间说明在 §3.4 第 5 项的画板修订里。
- O-2：这一轮 axe 为 0，不需要「字标豁免」与「改 ink-2」二选一。
- O-5、O-9（125）与 O-6、O-7（123）按默认维持；O-8（Brand 规格保持 B1）在清单第 246 行请 Owner 点名确认。
- 文档壳品牌锁定组合仍是 38 标、文案起点 66、收起时文案用 max-width 0 裁掉：在「待 Owner 裁定」第 1 条。建议由包把壳内缩放做成可复用修饰，归 Brand 或 Navigation 家族批次；不建议在文档 CSS 里给包类写自定义属性。
- 目视：清单第 73、74 行（壳几何、TMS 夜间后缀），第 128–134 行（Brand），第 169、174 行（Inputs 末端区与 MultiSelect 展开态复核）。
- §3.6：视觉基线 192 条按改动归因写成 accepted-layout-change，没有逐张目视；本分片五个矩阵与五个样板行都在其中，目视另行。

## 5. 实施口径判定

| 来源 | 取舍 | 判定 | 理由 |
| --- | --- | --- | --- |
| P1 SUB-090 | 4 个壳层 token 按建议命名；contractGroups 加 `shell → container`；不新增 TokenGroup 成员与导出 | 可接受 | §3.3 第 5 条；index.test.ts 钉住值、名、组与作用域；token-extension-proof 绿 |
| P1 SUB-090 | 保留局部变量 `--tcrn-product-shell-sidebar-width`，默认值与收起值引 token | 可接受 | 消费方覆写面不变；SUB-089 的宽度变异改的就是这个变量，门能读出覆写 |
| P1 SUB-090 | 侧栏画布色、无右边线与壳顶栏 min-height 52 在所有宽度生效，含手机 | 有条件 | O-2 要第 30 步的 ink-3 落在 bg 上，理由成立。条件：Owner 在手机视口目视（清单第 78 行已写明） |
| P1 SUB-090 | 其余构图一几何只放在 `@media not all and (max-width: 760px)`，移动块不动 | 可接受 | O-1 授权的是桌面构图；C2-3 手机锚点不受 O-1 影响 |
| P1 SUB-090 | 导航项起始内距写 `calc(var(--tcrn-space-1) - 1px + 深度缩进)`；纸面 `overflow: clip`；独立 TopBar 保持 68 | 可接受 | 数值取自 token，Navigation.test 钉住；clip 不构成滚动容器；§3.3 第 5 条写明独立 TopBar 高度不改 |
| P1 问题 2、3 → I-P3、I-P2 | 未授权的 smoke.test 断言与 `railWidthPx: 92` 不自改，交主线程；I-P2 改为从 token 读（0338b25） | 可接受 | 文件归属守住了。消费契约的 52 与包几何同源，不会再漂（ai-consumption-contract.ts:874） |
| P1 SUB-088 | brand 条目用 `night` 加 `nightRef`，生成器按 marks.json palette 校验 | 可接受 | 与 ref、value 的校验同法；不带 night 的条目输出不变 |
| P1 SUB-088 | index.ts 的说明文字分两种；themeScoped 由带夜间值的 brand 条目起算 | 可接受 | 作用域与 tokens.css 一致；index.test.ts 断言 tms 的 scope 为 theme，其余三条为 fixed |
| P1 SUB-088 | Navigation.test.tsx 只改原先写着两主题同值的注释 | 可接受 | 在判据列出的条件改动之内 |
| P3 SUB-089 | 宿主沿用 owner-quality-product-shell 收起变体，不用判断写的 navigation-product-shell-spec | 可接受 | 后者是 `collapsed={false}`（story-content.tsx:2250）；拆分判据允许取现存 story；没有新增钩子 |
| P3 SUB-089 | 容差 0.5、等过渡结束；收起读数并进 brand 的基线 ok | 可接受 | 原 brand 变异仍独立判红（10 log:5）；不会因等待而误读 |
| P3 SUB-089 | 「文案 display」一项没有对应变异 | 可接受 | 判据只要求两条变异。建议以后补一条「文案 display:block」变异，见 §6 |
| P3 SUB-100 | 期望 8 → 6 并逐个核对；文档前缀类加 EX-INIT015-doc-product-shell-search-static；重复选择器白名单加回一项 | 可接受 | §3.3 第 4 条；主线程 R3M5 已判；删除条件写明 |
| main R3M5、R3M6（SUB-101 方案 A） | 4 条 EX-INIT015-doc-knowledge-shell-* 例外与两条白名单项；删除两条暂缓例外与 JUDGMENT_C21 | 有条件 | 方案 B、C 要改门的比对数据或选择器，属 Owner；A 沿用 R2 已有的 EX-INIT015-doc-* 登记写法，删除条件写明。条件：R3 判断确认，收口回显（清单第 224–226 行已列） |
| main R3M6 | shell-parity-proof.mjs:534 样板切换钮期望右距 23.04 → 16；smoke.test.ts 1212–1215 钉值随 oracle 改 | 有条件 | 属 §3.3 第 6 条「O-1 的直接后果」，比对方式未动。条件：判断确认 534 行 |
| main R3M6（偏差） | 文档壳锁定组合仍为 38 标、文案起点 66、收起时文案用 max-width 0 裁掉；文档页没有纸离边 12；page-template 不改；样板顶栏描述截成一行 | 有条件 | 都不在授权内，未做是对的。条件：作为已知差距交 Owner（清单第 78 行、「待 Owner 裁定」第 1 条）。不影响 127-GWT4 的判定，见 §2 |
| P3 SUB-102、SUB-105 | 名单在运行时从 roles.json 读，加三条自检；用整份清单断言 | 可接受 | 无另抄的名单；两条判据同时满足 |
| P3 问题 4 | demo-styles-sync 读 dist，包表的局部门顺序会得到假绿 | 可接受（知悉） | 建议写进 lessons：以后派工表把 sync 排在 build 之后，再 build 一次 |
| P3 过程 | 一条只读探针命令带 cd，没有写入 | 有条件 | 与 R2 的 RM4 同类，第二轮再现。条件：写进 lessons，派工摘录重申 |
| P5 SUB-091 | Form.test.tsx 不改 | 可接受 | 没有断言钉住容器的 display 或 align-items |
| P5 SUB-091 | 删掉注释里的 `.tcrn-input--short`，doc-shell-class 旁证读数随之过时（1 → 0） | 有条件 | 本身可接受。条件：是否再生 doc-shell 清零说明由判断定（P4 称须授权，R3M7）；不影响本分片 GWT |
| P5 SUB-091 | 静态展开态列表紧贴触发器，间距 0；运行时浮层有 8px，不加 gap | 可接受 | 判据与 B2-1 的改法只要求在下方、同宽；清单第 174 行已写明，交目视 |
| main R3M7 | 视觉基线 192 条按改动归因写 accepted-layout-change，未逐张目视 | 有条件 | §3.6 知悉项。条件：Owner 目视另行，机器结果不代签 |

不可接受：无。

## 6. 证据盲区

- 未重跑门，未起浏览器，未构建，未运行引擎；读数都来自 R3 末次 verify 的日志、dist、入仓回执与源码。
- 127-GWT4 逐项读数只来自浅色收起变体（10 号）。夜间收起宽 52 来自 smoke 按 52 判通过（17 号不打印读数）。夜间收起态的标 22 与文案 none 没有逐项读数，但相关 CSS 与主题无关。
- 127-GWT3 的 computed 色：TMS 浅色后缀没有浏览器读数。它对比度通过，不进 axe 豁免节点；brand-matrix 也没有产品后缀格。沿用 R1、R2 的静态链口径：token 值、规则引用加单测。DS 浅色有 axe 豁免按登记色匹配的间接读数。
- §4 第 1 项的中轴数字来自 P1 的 scratch 脚本，本次没有复测；也没有读构图板对收起态的要求。
- SUB-091 的读数表来自 P5 的 scratch 脚本，本次只看了 verify 生成的一张截图。这张整页截图里，文档顶栏的吸顶伪影压住了 Input 错误态那一行，所以 126-GWT2 没有图像旁证，只靠 dist 与单测。
- 没有看 owner-quality-product-shell 的截图（1148×16566，过高）。
- 126-GWT4：无头浏览器不弹系统日历，沿用 R1 口径。
- SUB-089 的文案 display 读数没有对应变异：若文案改回可见，只有基线读数会报，没有红后转绿的自证。
- 只读了摘录点名的范围：P1、P3、P5 的交回与问题文件，main.md，steps.md，R2 B.md 的 §2、§3，拆分里 SUB-088、089、096 三节。没有整读拆分、判断与台账，其它包的交回也没读。
- Owner 目视未做（D8）。
