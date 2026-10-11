# INIT-015 R1 批末验收 · 分片 B（STORY-123 至 127）

验收对象：`claude/init015-gplus-renewal` HEAD 4c958f8（批末门跑在 d8586dd，其后只有 dispatch 文档提交）。证据：批末门日志（scratch `r1-verify/NN-<步>.log`）、批末构建产物（`packages/ui-react/dist`、`apps/storybook/storybook-static`）、scratch 存档回执（`r1-verify/receipts-dirty/`）与源码只读探查；未重跑门、未构建、未起浏览器。写「推断」的是读代码与读数所得、未经浏览器复核。dist 行号指 `tcrnComponentCss` 按行切分后的行号。机器判定不代替 Owner 目视（D8）。

## 1. 一览

| Story | 结论 | 不满足或部分的 GWT | 返工项数（直接 + 依赖） |
| --- | --- | --- | --- |
| 123 Typography | 不通过 | GWT4 部分 | 2 + 2：B-1、B-12；依赖 B-9、B-13 |
| 124 Icon | 不通过 | GWT1 部分 | 2：B-10、B-11 |
| 125 Actions | 不通过 | GWT3 部分 | 1 + 2：B-3；依赖 B-8、B-13 |
| 126 Inputs | 不通过 | GWT5 不满足 | 5 + 3：B-2、B-4、B-5、B-6、B-7；依赖 B-8、B-13、B-14 |
| 127 Brand | 阻塞于 Owner | GWT4 阻塞于 Owner（52px） | 0 + 1：依赖 B-15；待 O-1、O-2 |

返工清单 16 条（B-1 至 B-16），主力档 6 条（B-1、B-7、B-9、B-11、B-13、B-15）。B-8、B-9、B-11、B-13 至 B-16 落在别的 Story（120、129、131、133）的文件里，本分片的 GWT 或硬线依赖它们，标「跨分片」；与其它分片同根因时合并为一条。

批末红步对应：13 的 8 条 → B-1、B-2、B-3；17 → B-8；18 → B-13、B-4、B-14（样板 rail 属 P1）；19 → 同 18；20 → B-10；28 → B-5、B-8；30 → B-8（buttonFeedback）、B-9（clipped）、B-6/B-15/B-16（axe）、B-12（zh-CN 泄漏）。

## 2. 逐 Story

### STORY-123 Typography（W2-B：SUB-012、SUB-013）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 标题超宽：行框 1、省略号、带 title | 满足 | dist 第 1206–1209 行四级标题均 nowrap、overflow hidden、ellipsis；`Typography.test.tsx` 断言四级 title 与截断（第 5 步 test 绿）；13 C7 绿；18 typography-matrix 两主题 singleLine pass（worstValue 1）。internal-alpha 把截断记成 clipped 是门的口径冲突（B-9）。 |
| 2 Highlight 命中与未命中宽度差 0 | 满足 | 18 号日志第 7280 行 probe `highlightWidth`（123-GWT2）pass，实测差 0.02px（门容差 0.5px，为亚像素取整）；mark 检查 worstValue 0；变异 `mark-padding` 被杀（killed）。dist 第 1226 行 mark 只加 `acc-bg` 底与 2px 晕，font/letter-spacing/padding 继承。 |
| 3 numeral「4,280.00」为 Source Serif 4 300 且 tabular-nums | 满足 | dist 第 1216 行 `font-family:var(--tcrn-type-family-serif);font-weight:300;font-variant-numeric:tabular-nums lining-nums`；`Typography.test.tsx` 断言（handoff W2-B）；21 fonts:render 绿。 |
| 4 矩阵 44 格与画布逐格一致 | 部分 | 浅色页：44/44 格差 0（18 号日志 runs typography-matrix light）。夜间页：21 个 `-l` 格按夜间色渲染（如 h1-l 14.38 对期望 18.29），根因是没有 `[data-tcrn-theme="light"]` token 块，浅色块在夜间页里守不住浅色（B-13，跨分片）。 |

goal 逐项：h1 36/40、h2 26/30、h3 20/26 衬线 400，h4 13/20 怪诞 600（dist 1206–1209）满足；Text size/tone/variant（1211–1222）满足；mark 只加 8% 青洗底满足；链接 acc、70% 下划线、hover acc-2、焦点环在视觉上实现，但状态规则直接写颜色（违反硬线，B-1）。

硬线核对：
- 状态对与特异性：不满足。链接 hover、focus 规则写颜色（13 号 C2.colour，dist 第 1224、1225 行）；`.tcrn-link--quiet:hover` 写 `brand-primary`（13 号报第 3166 行，源 `base.css.ts:2500`）；链接焦点无透明 outline 回退（W3-D P6）。均为 B-1。
- 主题同构、禁用清单：满足（无夜间专有规则；C11 绿）。单行截断：标题与 caps 满足，numeral 见口径。
- 几何来自 token：C10 约束的是壳层几何（`docs/contract/clauses.md`），本家族不涉及；生成段字号行高为字面量（W2-B P7）记入 O-6，不算硬线违例。

口径判定：
- Text 外距（W2-B P6）：可接受。Story 实施说明要求「不传 prop 外观不变」，family 规则恢复 `margin: var(--tcrn-space-2) 0 0`（dist 第 1231 行）是对的；8px 不小于正文行距 7px（13/20），符合 D3。后续把外距写进 typography.json，删掉家族规则（随契约下次修订，不单列返工）。
- caps 截断（W2-B P4）：可接受。caps 是 C7 单行角色（标签、表头），家族规则补 `overflow:hidden; text-overflow:ellipsis` 并带 title，C7 绿；契约补 `truncate: true` 后删家族规则（随契约修订）。
- numeral 截断（W2-B P5）：可接受。金额被省略号截断会被误读，numeral 不在 C7 登记角色里（C7 绿），装不下时给 title、由容器保证宽度。是否需要块级单行形态由 Owner 定（O-5）。

结论：不通过。本 Story 文件内返工 B-1；B-12 为文档文案随 token 值变化的连带项；GWT4 依赖 B-13；internal-alpha 的标题 clipped 依赖 B-9。

### STORY-124 Icon（W2-C：SUB-014、SUB-015；W3-D：SUB-018 的 `.tcrn-icon` 基类，M5）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 任一名册名 16px 实测描边 1.25px | 部分 | 标记与样式满足：子图形 `stroke-width="1.25"`、`vector-effect="non-scaling-stroke"`（`Icon.test.tsx` 逐个比对）；矩阵页只有 `.tcrn-icon{stroke-width:1.25}`、`.tcrn-icon>*{vector-effect:non-scaling-stroke}`，无覆写。缺实测：没有门读计算描边（18 号 probes 只有 123-GWT2、125-GWT4、126-GWT4），拆分 P31 的「矩阵计算样式判描边」未落实，B-11。 |
| 2 名册外名字类型检查失败 | 满足 | `Icon.test.tsx` 用 `@ts-expect-error` 锁住名册外名字与 `strokeWidth`；第 2 步 typecheck 绿。 |
| 3 package.json 搜 lucide 为 0 且构建通过 | 满足 | 包清单、锁文件、`packages/ui-react/src`、`apps/storybook/src` 只剩 `smoke.test.ts:710` 一条反向断言；第 3 步 build 绿；存档 `package-contract-manifest.json` 的图标来源为 `tcrn-icon-contract`。 |
| 4 矩阵底色上图标 ≥ 3 | 满足 | icon-matrix 两次运行所有格最低 4.09（禁用格，豁免），其余 ≥ 4.59；浅色页 28/28 与画布差 0。夜间页的 `-l` 格偏差来自 B-13，不影响「≥ 3」这一判据。 |

body 要求「名册 story 显示 37 件三档」：icon-matrix 渲染 37 个不同名字，尺寸 14/16/20 各有（构建页 `components-gplus-matrices.html` 计数 76/119/76），满足。

硬线核对：
- 几何来自 token：不满足（文档层）。`story-demo-styles.ts:284–289` 的 `.tcrn-doc-icon-sample svg[data-icon-name]{width:18px;height:18px}` 把 icons-motion 的图标压成 18px（不在 14/16/20 上），20 doc:sample-style 的 72 条失败全是它（日志第 1260 行，原因 doc-stylesheet）；规则是 W3-D 执行 M5 改写选择器时留下的，B-10。
- 壳层上下文里图标为 11px（doc:sample-style package-context 54 条，导航壳与两个样板），属导航家族（后续批），不判本 Story。
- 状态对、主题同构、禁用清单：满足（icon 段没有状态与主题规则；C11 绿）。

口径判定：`.tcrn-icon` 基类 vertical-align 取 middle（W3-D P5，设计会话 B 类裁定）可接受：Icon 板 `.ic` 即为 middle，基类放进包符合 D6；按钮等 flex 容器内不受影响。Owner 若要 `-0.125em`，改 `icon.css.ts` 一行。

结论：不通过。返工 B-10（本 Story 与 STORY-128 交界，落点是 M5 那次改写）与 B-11（为 GWT1 补实测）。

### STORY-125 Actions（W2-D：SUB-016、SUB-017；W3-D：SUB-018）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 `.tcrn-button` 的 :hover/:active/[aria-pressed] 无颜色、特异性 ≤ (0,1,0) | 满足 | dist 第 176–181 行状态规则均为 `:where()`、只切 `--tcrn-pair-*`；13 contract:static 的 7 条 C2 中没有 actions 家族（byFamily：inputs 4、shell 1、typography 3）。 |
| 2 注入 `.scope .tcrn-button:hover{background:…}` 判红 | 满足 | 13 号日志第 11 行测试「132-GWT1: .x .tcrn-button:hover{background:#fff} turns C2 red」通过。 |
| 3 116 格矩阵与画布逐格一致，禁用格豁免 | 部分 | 浅色页 116/116 差 0，禁用格标 exempt。夜间页 58 个 `-l` 格按夜间色渲染（B-13，跨分片）。 |
| 4 ButtonGroup 组内焦点环不被裁切 | 满足 | 18 号日志第 7258 行 probe `buttonGroupFocusRing` pass（10 个按钮）；组内获焦成员 `z-index:1`（handoff W2-D）。 |
| 5 按下 transform 为 none | 满足 | dist 中带 transform 的规则没有一条落在 `.tcrn-button` 上（只剩 nav-item、locale trigger、表格工具栏 chip 与导航容器内原生 button，W3-D P2，后续批）；主题钮已移出按压缩放列表。 |

goal 逐项均满足：七态对与只切换（dist 168–181）；sm 28 / md 32 / lg 40、圆角 8（tokens.css 第 95、100–102 行）；字重 500、选中 600（第 168、179 行）；次按钮与危险按钮轮廓 line-ctl、danger 白面红字（第 170、172 行）；ButtonGroup role=group 加 aria-label、1px 分隔、aria-pressed；Clipboard 五态换 ink、idle copy 图标（385ee0a）。加载文案由调用方传入（拆分 P22）可接受。观察：尺寸档没有 DOM 门量过（18 号日志第 7291 行 `checksNeverApplied: ["controlHeight"]`），token 值静态正确，不单列返工。

硬线核对：
- 主题同构：不满足一条。13 号 C5.dark-only：`html[data-tcrn-theme="dark"] [data-theme-icon="light"]{display:none}`（`base.css.ts:606`）浅色侧无对应声明；这是主题钮图标切换，W3-D 在 SUB-018 接手了主题钮规则，B-3。
- 选中态满足（secondary 选中为 wash 加整圈轮廓，C6 只禁填充加单侧边线，C6 绿）；单行截断、禁用清单、无 transform 满足。
- 观察：secondary、danger 的 edge 对含浅色墨字面量 `rgba(22,21,15,.04)`，夜间几乎不可见（W1-A P2、W2-D P9），属 pairs.json，随 W1-A 处置，不重复列。

口径判定：clipboard copied 只换 ink（W2-D P7）可接受：与同板说明「文字随状态换，底色不换」及拆分一致；照画板 CSS 设 fill-d 为 panel 会让 quiet sm 行内复制钮变白底，与用例不符。

结论：不通过。本 Story 返工 B-3；GWT3 依赖 B-13；internal-alpha 的 `buttonFeedbackOk:false`（30 号日志第 80 行）推断为门在 hover 后只等 80ms、而填充过渡为 120ms（tokens.css 第 113 行），见 B-8。主题钮等外壳切换钮的尺寸待 Owner（O-3）。

### STORY-126 Inputs（W2-E：SUB-019、SUB-020；W3-D：SUB-021）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 文本类控件默认边 line-ctl 于 panel ≥ 3.1 | 满足 | dist 第 3114 行 edge-d 为 line-ctl 内描边；同一 token 对的 ck-edge-l 实测 3.16、ck-edge-n 3.34（18 号 inputs-matrix）；`Form.test.tsx` GWT1 用例。矩阵无文本控件边线专格（观察）。 |
| 2 aria-invalid 且获焦：红边红环，无青色 | 满足 | dist 第 3121 行 `[aria-invalid="true"]:focus-visible` 切到 `edge-ef`；`Form.test.tsx` GWT2 用例；壳内焦点规则已排除 `.tcrn-input`（W3-D）。 |
| 3 SearchInput 夜间占位 ≥ 4.5 | 满足 | inputs-matrix search-ph-n 实测 6.11，与期望一致。 |
| 4 DatePicker 点右侧 30px 打开系统日历 | 满足 | 18 号日志第 7269 行 probe `datePickerIndicatorHit` pass（2 个）；无头浏览器不弹系统日历，按拆分 P31 改判点击落点在原生指示器上；日历图标 `pointer-events:none`。 |
| 5 42 格矩阵与画布逐格一致 | 不满足 | 只渲染 40 格：`opt-sel-l`、`opt-sel-n` 在标记里，但位于关闭的 MultiSelect 列表内，没有渲染（19 号日志第 3449 行 `missing`，B-14）。`err-msg-l` 6.2 对 6.69、`err-msg-n` 6.27 对 6.88（18 号日志第 2842 行起）：错误文案落在 `.tcrn-field--error` 的整块洗底上（`inputs.css.ts:141–143`），B-4。夜间页另有 20 个 `-l` 格按夜间色渲染（B-13）。 |

goal 逐项满足：六件文本控件共用对表与 d/h/f/e/ef 各态；SearchInput 墨洗无边、focus 纸底加环、占位 ink-2（17 的失败是取样时机，B-8）；DatePicker 日历图标与透明指示器；Checkbox 16 r4、Radio 16、Switch 34×20 钮 16 行程 14（字面量，O-6）。

硬线核对：
- 状态对与特异性：不满足。13 号 C2 四条：`.tcrn-product-shell .tcrn-search-input:focus-within` (0,3,0)（`inputs.css.ts:23`）；`.tcrn-multi-select-dropdown__option:not(:disabled):hover` (0,3,0) 且写颜色、`[aria-selected="true"]` 写颜色（`inputs.css.ts:519–520`）。B-2。
- 同类一致：不满足。28 `closed-select-family-empty`：MultiSelect 触发器 paddingRight 10px 对 Select 30px、minHeight 0px 对 auto（日志第 30 行），没有共用 30px 末端区。B-5。
- 焦点可见：不满足。inputs-text 顺序 h、f、r、e、ef、x，只读框获焦被 r 覆盖，无焦点环（dist 第 3118–3119 行，W2-E P5，画板同序），WCAG 2.4.7。B-7。
- 文字对比：不满足。axe 夜间搜索快捷键 `kbd` 3.89–3.9（#85827a 即夜间 ink-3，底 #272724），140 个节点（存档 `a11y-axe-summary.json`，color-contrast 共 320）。B-6。
- 主题同构、选中态（wash 加 600）、单行截断（摘要加 title）、禁用清单：满足。

口径判定：W2-E 按 P29 只去掉 Field 获焦整块洗底，不完整，不可接受。Story 原文「Field 整块变色去掉（Field 件归第五批，本单只保证控件自身）」，错误态整块洗底同属整块变色，它让 GWT5 的 err-msg 两格偏差 0.49 至 0.61。最小改法是一并去掉（B-4），Field 其余外观仍归第五批；否则只能由 Owner 把这两格改到第五批。

结论：不通过。本 Story 返工 B-2、B-4、B-5、B-6、B-7；GWT5 另依赖 B-13、B-14；17、28 的取样时机问题依赖 B-8。

### STORY-127 Brand（W2-F：SUB-022、SUB-023）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 mana-orchestrate 加 ja 标语为「プロジェクト記憶アシスタント」，不含 Claude、Codex | 满足 | `product-marks.generated.ts` 含该标语，`claude|codex` 计数 0；`Navigation.test.tsx` 第 188、278 行逐字比对五语并渲染 ja（批末 test 绿）。 |
| 2 任一产品标 SVG 改一个字节判红 | 满足 | 14 brand-asset:proof 绿（日志第 7、16 行，`productMarks` 八文件）；W2-F 反向验证改 mana-mono.svg 一字节、改 dist 中 TMS 一个色值均退出 1。 |
| 3 后缀 computed color：TMS #2c63c8、DS #6577f3、TCRN 为 ink | 满足 | `--tcrn-brand-suffix-tms/-design-system`（tokens.css 第 117、120 行）；axe 读到的实际前景就是 #2c63c8、#6577f3；brand-matrix 浅色页 10/10 一致（含 suffix-ink 格）。 |
| 4 侧栏收起到 52px：文案 display:none、标 22 不缩放 | 阻塞于 Owner | CSS 部分已做：收起态文案 `display:none`、标 22、去掉尺寸与滤镜过渡；10 geometry:proof 的 brand 变异先红后绿（redThenGreen brand red:true green:true）。52px 收起宽依赖拆分 P1（构图一壳层几何，ProductShell 仍为 92），O-1。 |

goal 逐项满足：workflow 改 einzbern、新增 mana-orchestrate；四种导出；与 logos2 逐字节一致（mono 按拆分 P13 以 currentColor 替换后比对，可接受）；衬线字标加 by TCRN；五语标语；渐变文字已删（C11 绿）。

硬线核对：品牌 digest 不变满足（14 绿）；禁用清单满足；收起态隐藏文案满足（C16）；主题同构满足（后缀两主题同值，P15）。

其它发现（不改本 Story 文件）：
- axe 报后缀对比（100 个节点）：DS #6577f3 于 #ecf4f3 为 3.42、于白 3.82、于 #dde4df 为 2.95；TMS #2c63c8 于夜间 #191916 为 3.12。WCAG 1.4.3 对字标有豁免，token-contrast 门已登记字标豁免（6 tokens:proof 第 31 行），axe 运行未登记，见 B-15；夜间色是否换亮色待 O-2。
- axe 报标语 `.tcrn-product-logo__line-two`（48 个节点）与壳品牌说明 `.tcrn-shell-brand-lockup__caption`（32 个）用 ink-3，于 #dde4df 为 4.36、于夜间 #172421 为 4.17。按色值推算这些底是 acc-bg 叠在 bg、panel 上，即壳层与文档壳给锁定块铺的洗底（AOS 壳、文档壳品牌区），不是品牌家族的面；随 O-1 处置，此前留在 axe 红里。
- doc:sample-style package-context：壳侧栏品牌链接 `a.tcrn-product-shell__brand` 内的锁定块继承浏览器默认链接色 rgb(0,0,238)；彩色标不受影响，单色标会变蓝。建议壳层给该链接设 `color: inherit`（后续批）；不阻断。
- B1 与 B2 两板的字标字重与标尺寸不一致（W2-F #13），doc:sample-style 也读到壳内字标 12.5px/600 对矩阵 14px/500，交 Owner 目视（O-4）。

口径判定：夜间后缀两主题同值（W2-F P15，拆分 P15）作为过渡可接受：D2 定了浅色值，token-contrast 门已按字标豁免逐条登记；但 TMS 夜间 3.12 可读性差，建议 Owner 改夜间值（O-2）；无论是否改，axe 侧都要登记字标豁免（B-15）。

结论：阻塞于 Owner。GWT1–3 满足，GWT4 的 52px 待 O-1；本 Story 没有本文件内的返工项。

## 3. 返工清单

档位按派工规则：改共享契约（token 键集、`contract/*.json`、生成器输出、导出面、门的判定语义）的从主力档起，其余经济档。

**B-1 链接状态规则写颜色、quiet 链接用停用色、链接焦点无强制色回退**（主力档；STORY-123；SUB-013，生成器属 SUB-009）
- 现象：13 contract:static C2.colour 三条：`.tcrn-link:where(:hover…)` 写 `color` 与 `text-decoration-color`，`.tcrn-link:where(:focus-visible…)` 写 `box-shadow: var(--tcrn-focus-ring)`（dist 第 1224–1225 行，来自生成段）；`.tcrn-link--quiet:hover` 写 `var(--tcrn-color-brand-primary)`（`base.css.ts:2494–2506`）。链接焦点 `outline: none`，强制色下无指示（W3-D P6）。
- 改法：typography.json 链接段改为对表，`scripts/contract-generate.mjs` 生成变体声明（ink-d acc、下划线色 acc-ul、ink/下划线 h 为 acc-2、edge-f 为焦点环），基础规则读生效对，状态规则 `:where()` 只切换，焦点加 `outline: 2px solid transparent; outline-offset: 2px`。quiet 变体 ink-d 为 currentColor、ink-h 为 acc-2；`.tcrn-breadcrumb a` 拆成单独规则，归导航家族豁免（EX-INIT015-navigation）。重生成 `styles/generated/typography.scale.ts`，同步 `typography.css.ts` 与 `Typography.test.tsx`。
- 复核：contract:static C2 的 typography 为 0；Typography.test；contract:proof。
- 依赖：与 B-7 同改生成器与生成物，同包或先后；与 B-3 同改 `base.css.ts`。

**B-2 Inputs 两组状态规则越级或写颜色**（经济档；STORY-126；SUB-020、SUB-021）
- 现象：13 contract:static：`.tcrn-product-shell .tcrn-search-input:focus-within` (0,3,0)（`inputs.css.ts:23`）；`.tcrn-multi-select-dropdown__option:not(:disabled):hover` (0,3,0) 加颜色、`[aria-selected="true"]` 写颜色（`inputs.css.ts:519–520`）。
- 改法：第一条删掉（包裹层已不画任何东西，壳内焦点规则已排除对表控件），或改成 `:where(.tcrn-product-shell) .tcrn-search-input:where(:focus-within)`。选项改为对机制：`.tcrn-multi-select-dropdown__option` 声明 fill-d 透明、fill-h hover、fill-s wash、选中字重 600，基础规则读生效对，`:where(:not(:disabled):hover,[data-tcrn-preview-state="hover"])` 与 `:where([aria-selected="true"])` 只切换。
- 复核：contract:static C2 的 inputs、shell 为 0；Form.test。
- 依赖：与 B-4、B-5、B-6 同改 `inputs.css.ts`，同包顺序做；在 B-7 重生成之后。

**B-3 主题钮图标显示规则主题不同构**（经济档；STORY-125；SUB-018）
- 现象：13 contract:static C5.dark-only：`html[data-tcrn-theme="dark"] [data-theme-icon="light"]{display:none}`（`base.css.ts:606`），浅色侧没有声明 `display`。
- 改法：在其前加无主题规则 `[data-theme-icon="light"] { display: inline-flex; }`，或把两枚图标都写成无主题的显示规则加两主题各自的隐藏规则，使两主题声明同一属性集。
- 复核：contract:static C5 为 0；Navigation.test 的主题钮用例。
- 依赖：与 B-1 同改 `base.css.ts`。

**B-4 Field 错误态整块洗底让 err-msg 两格失配**（经济档；STORY-126；SUB-020，P29 口径更正）
- 现象：18 geometry:measure、19 visual-proof：err-msg-l 6.2 对 6.69、err-msg-n 6.27 对 6.88；原因是 `.tcrn-field--error{background-color: color-mix(… state-blocked-bg 62% …); outline-color: …}`（`inputs.css.ts:141–143`）。
- 改法：删错误态整块底色与 outline 颜色（`inputs.css.ts:405` 强制色块的系统色 outline 可留）；`.tcrn-field__error`（`inputs.css.ts:159`）直接读 `var(--tcrn-color-bad)`，不经停用别名。红边由控件 e 态对给出，alert-triangle 等归第五批；同步 smoke.test、Form.test 相关断言。
- 复核：geometry:measure inputs err-msg 两格差 ≤ 0.05。
- 依赖：同 B-2 包。

**B-5 MultiSelect 触发器没有共用 Select 的末端区**（经济档；STORY-126；SUB-019、SUB-021）
- 现象：28 full-surface `closed-select-family-empty` 红：触发器 paddingRight 10px 对 Select 30px，minHeight 0px 对 auto（日志第 30 行）；caret 距右缘 10px，Select 的 chevron 为 8px。
- 改法：`.tcrn-multi-select-dropdown__trigger`（`inputs.css.ts:512`）设 `padding-inline-end: 30px`，caret 绝对定位到与 `.tcrn-select-wrap__icon` 相同处（`calc((30px - var(--tcrn-icon-size-sm)) / 2)`）。minHeight 的差可能只是 Select 成了包裹层内 flex 项造成的读数差：先确认，是读数差就改门的比对字段（主力档），否则对齐 min-height。
- 复核：full-surface `closed-select-family-empty` 绿。
- 依赖：同 B-2 包。

**B-6 搜索快捷键夜间对比不足**（经济档；STORY-126；SUB-020）
- 现象：axe color-contrast：`.tcrn-search-input … > kbd` 夜间 3.89–3.9（#85827a 于 #272724），140 个节点。
- 改法：`.tcrn-search-input__shortcut` 的 `color` 由 ink-3 改 ink-2（`inputs.css.ts:96`），理由与 Story 已采纳的「夜间占位 ink-3 只有 3.88 故升为 ink-2」相同；按建议先做，Owner 可更正。下次改契约时在 inputs 矩阵补快捷键格。
- 复核：internal-alpha axe 中 kbd 节点为 0。
- 依赖：同 B-2 包。

**B-7 只读框获焦没有焦点环**（主力档；STORY-126；契约 pairs.json 与生成器，SUB-019 / SUB-009）
- 现象：inputs-text 规则顺序 h、f、r、e、ef、x，r 排在 f 之后（dist 第 3118–3119 行），只读框可获焦但焦点时用 r 对，无可见焦点（W2-E P5，画板同序）。
- 改法：pairs.json 给 inputs-text 增加 rf（只读加焦点，r 的底与 f 的环）或把 f 排到 r 之后，重生成 `styles/generated/inputs.pairs.ts`，`Form.test.tsx` 加只读获焦用例。与画板顺序不同，按无障碍硬要求先做，回显给 Owner。
- 复核：Form.test；contract:proof；contract-generate --check。
- 依赖：与 B-1 同改生成器；先于 B-2 包。

**B-8 三处门在填充过渡未结束时读计算样式**（经济档；跨分片，STORY-133：SUB-041、SUB-042；影响 125、126 的证据）
- 现象：（a）17 storybook:smoke 唯一失败 `desktop:searchControl:background-color:rgb(255, 255, 255)`（日志第 22 行；读数第 676 行，期望第 184–190 行）：`scripts/storybook-smoke.mjs` 第 2370–2395 行取 `getComputedStyle` 活对象后聚焦、等 190ms、失焦，再读静止值，背景正处在 fill-f（白）回 wash 的 120ms 过渡起点；box-shadow 因 inset 不同不可插值，已直接到位。（b）28 full-surface `public-popup-family-dark`：`scripts/lib/multi-select-dropdown-proof.mjs` 第 37–40 行切夜间后立即读，参照 Select 的底与边仍是浅色值、字色已是夜间色，菜单层已是 #191916。（c）30 `buttonFeedbackOk:false`（第 80 行）：`scripts/internal-alpha-browser-proof.mjs` 第 2566–2569 行 hover 后只等 80ms，填充过渡 120ms（tokens.css 第 113 行）；回执未存读数，属推断。
- 改法：测量前给页面注入 `*{transition-duration:0s !important}`，或在读数前等 `document.getAnimations()` 全部结束；smoke 的静止值改为在聚焦之前快照。不改判定值。
- 复核：17、28、30 三步对应项转绿。

**B-9 internal-alpha 把 C7 单行截断记成 clipped**（主力档，改门判定语义；跨分片，STORY-133：SUB-041；影响 123）
- 现象：30 号 `clippedButtonText: true`（第 83 行）；存档 `browser-proof-summary.json` 的 clipped 为 288 个标题（h1 33、h2 195、h3 59、h4 1），含 Billing、Settings 这类短标题。规则（`internal-alpha-browser-proof.mjs` 第 295–311 行）：overflow 非 visible 且 scroll 尺寸超出 1px 即记。C7 要求标题 `overflow:hidden` 加省略号加 title；短标题被记，推断是衬线行框（如 26/30）小于字体内容区造成的纵向溢出（W2-B P8 已预言）。
- 改法：门对带非空 title、nowrap 且 ellipsis 的单行角色不计横向截断，单行 nowrap 元素不计纵向字体度量溢出。组件侧可选：生成器把标题改为 `overflow-x: clip`（C7 接受 clip，纵向不裁，免得 CJK 回退字形上下沿被裁），属契约输出改动。
- 复核：internal-alpha clippedButtonText 只剩真实截断且无 title 的元素。
- 依赖：与 B-8、B-15 同改 `internal-alpha-browser-proof.mjs`，同包。

**B-10 文档层把图标压成 18px**（经济档；STORY-124 与 STORY-128 交界；M5 落在 SUB-018）
- 现象：20 doc:sample-style 失败 72 条，全部是 icons-motion 里 `svg.tcrn-icon` 高 18px 对矩阵 16px，原因 doc-stylesheet；源 `apps/storybook/src/story-demo-styles.ts:284–289`。
- 改法：删掉该规则的 width、height，只留摆放；样例按包的 `size`（md 16，或同时展示 14/16/20）渲染；跑 `demo-styles:sync` 同步 `storybook.css`。
- 复核：doc:sample-style failing 为 0（图标部分）。

**B-11 124-GWT1 缺渲染实测**（主力档，门增项；跨分片，STORY-131：SUB-035；影响 124）
- 现象：没有门读图标的计算描边；18 号 probes 只有三项（`geometry-measure-proof.mjs` 第 109–111 行）。
- 改法：加 probe `iconStroke`（source 124-GWT1）：icon-matrix 16px 行每个 `svg.tcrn-icon > *` 的计算 `stroke-width` 为 1.25px、`vector-effect` 为 non-scaling-stroke；配一个把描边改成 2 的红夹具。
- 复核：geometry:measure probes 含 iconStroke 且 pass，红夹具被杀。
- 依赖：与 B-14 的可选项同改该门。

**B-12 字号标签随 token 变化后 zh-CN 泄漏**（经济档；STORY-123 连带，文档文案属 STORY-128）
- 现象：30 号 `localeLeakZhCnNewLeaks: 2`（第 89 行）：text-styles 渲染 `Page title / 36px`、`Section title / 20px`（`story-content.tsx:992–993` 由 token 值拼出），`storybook-content-text.ts:480、482` 的键仍是 28px、18px。
- 改法：两条键与五语值改成现值；更稳的是只翻译前缀、尺寸由 token 拼接。
- 复核：internal-alpha localeLeakZhCnOk。

**B-13 没有浅色主题块，夜间页里的浅色样例按夜间渲染**（主力档，token 主题块；跨分片，STORY-120：SUB-001，STORY-129：SUB-029；影响 123-GWT4、125-GWT3、126-GWT5）
- 现象：18 号夜间运行五矩阵全红，偏差全在 `-l` 格（typography 21、icon 13、brand 4、actions 58、inputs 20），浅色运行的 `-n` 格全对；tokens.css 与包样式里没有 `[data-tcrn-theme="light"]`。主线程 M6 已列「浅色主题块」。
- 改法：tokens 增加 `[data-tcrn-theme="light"]` 块，重声明主题相关 token（与 dark 块同集，C5 token-set 口径一致）；矩阵 story 的浅色块带 `data-tcrn-theme="light"`。
- 复核：geometry:measure 夜间运行五矩阵对比度 pass。

**B-14 inputs 矩阵缺 opt-sel 两格**（经济档；跨分片，STORY-129：SUB-029；影响 126-GWT5）
- 现象：19 visual-proof inputs.B `expected 42, rendered 40, missing [opt-sel-l, opt-sel-n]`，两格在关闭的 MultiSelect 列表里；18 量到 40 格却没有因缺格判红。
- 改法：矩阵里把该 MultiSelect 渲染为静态展开态，或把 opt-sel 放进可见静态列表；可选（主力档）：geometry-measure 对格数不等判红。
- 复核：visual-proof inputs.B cells ok。
- 依赖：与 B-13、B-16 同改矩阵 story，同包。

**B-15 axe 未登记字标豁免**（主力档，改门判定；跨分片，STORY-133：SUB-041；影响 127）
- 现象：axe color-contrast 中后缀节点 100 个（回执存档 `a11y-axe-summary.json`，见第 2 节 127「其它发现」）。
- 改法：internal-alpha 的 axe 运行对 `.tcrn-brand-wordmark__suffix`、`.tcrn-product-logo__line-one-suffix` 登记字标豁免（引 WCAG 1.4.3 字标例外与 D2），与 token-contrast 门豁免表同源；O-2 若改夜间值，同步 tokens.json 重生成。
- 复核：axe 中后缀节点为 0，标语节点仍按 O-1 处置。
- 依赖：同 B-9 包。

**B-16 矩阵 Surface 在浅色与夜间块里重名**（经济档；跨分片，STORY-129：SUB-029、SUB-030；影响本分片五个矩阵）
- 现象：axe landmark-unique 共 110 个节点，其中约 92 个是矩阵 `.tcrn-surface[aria-label="Heading"]` 等在两个主题块里重名（其余 18 个属文档壳）。
- 改法：aria-label 带主题（五语，如「Heading · 浅色」），或去掉 Surface 的 region 角色。
- 复核：axe landmark-unique 中矩阵节点为 0。
- 依赖：同 B-14 包。

建议分包：主力档「契约与生成器」（B-1、B-7，带 B-3）、「门语义」（B-9、B-15，带 B-8）；B-11 并入 STORY-131 门包；B-13 随 A 分片 token 包。经济档「Inputs 收尾」（B-2、B-4、B-5、B-6，在 B-7 后）、「矩阵 story」（B-14、B-16，在 B-13 后）；B-10、B-12 独立。

## 4. 只有 Owner 能定的事项（附建议）

- **O-1 构图一壳层几何（拆分 P1）。** 127-GWT4 的 52px、129-GWT3 的侧栏 220 卡在这里，锁定块标语落在壳层 acc-bg 洗底上不足 4.5 也要等它。建议：ProductShell 侧栏宽与收起宽（220 / 52）作为 G+ 底盘纳入 INIT-015，只改这两个已登记变量与收起态，其余壳层外观留第二批。
- **O-2 夜间品牌后缀色（P15）。** 建议 TMS 夜间用 D5 亮色 #7aa0f5（于 #191916 约 6.85:1），Design System 两主题保持 #6577f3 按字标豁免登记（于白 3.83）；定后在 tokens.json 加 dark 值重生成。
- **O-3 外壳切换钮尺寸（W3-D P1、W2-D P15）。** 主题钮 36 胶囊、侧栏钮 38、移动导航钮 44，与 IconButton md 32、圆角 8 不一致，smoke 门仍按 36。建议桌面两枚改 IconButton md 32 加 radius-control，移动导航钮保留 44 登记为触控例外。
- **O-4 B1 与 B2 品牌规格分歧（W2-F #13）。** B1（现实现）字标 500 加后缀 600、标 38/28/22；B2 为 sans 整词 600、示意标 44。建议保持 B1，目视清单点名确认。
- **O-5 Typography API（W2-B P5、P9）。** 建议 numeral 不截断，在 `roles.json` 写明非单行截断角色；numeral-inline/large/mono 暂经 className，下批再议尺寸 prop 与 `as="span"`（免句内 p 套 p）。
- **O-6 组件内字面几何是否补 token。** 类型刻度 px、按钮内图标 13/15、勾选 16、开关 34×20、末端区 30、贴片圆角 11（W2-B P7、W2-D P10、W2-E P10、W3-D P4、W2-F #10）。C10 只管壳层几何，不算硬线违例；建议下次契约修订补 token，不阻断本轮。
- 已按建议先做、Owner 可更正：B-6（快捷键改 ink-2）、B-7（只读获焦加环）。B-4 若不被接受，需 Owner 把 126-GWT5 的 err-msg 两格改到第五批。

## 5. 过程记录

- 一次只读探查命令里误写了 `cd /tmp`（没有弹框，也没有写入），违反「命令里不 cd」，只留痕。
- 读取 axe、浏览器摘要、包契约等回执用的是 scratch 存档 `r1-verify/receipts-dirty/`，仓内回执未动。
- 本文件是本分片唯一写入物；未改代码、门、回执或链。
