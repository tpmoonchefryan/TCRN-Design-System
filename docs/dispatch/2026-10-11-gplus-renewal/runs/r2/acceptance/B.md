# INIT-015 R2 批末验收 · 分片 B（STORY-123 至 127）

节行号：§1 一览 第 15 行；§2 逐 Story 第 33 行（123 第 35 行，124 第 61 行，125 第 78 行，126 第 101 行，127 第 139 行）；§3 返工清单 第 154 行；§4 Owner 事项 第 202 行；§5 实施口径判定 第 223 行；§6 证据盲区 第 255 行。

验收对象：集成分支 `claude/init015-gplus-renewal` HEAD 61b0556。R2 末次 verify 跑在 e643d74，`git diff --stat e643d74 61b0556` 只有 `runs/r2/verify/steps.md` 与 `runs/state.md`，其后到 HEAD 只加了三份验收摘录。

证据：
- 会话 scratch `r2-verify/` 的逐段日志，引用写作 `NN log:行号`。
- verify 第 3 步的构建产物：`packages/ui-react/dist`（15:11 构建）与 `apps/storybook/storybook-static`。dist 行号写作 `dist:行号`，指 `tcrnComponentCss` 按换行切分后的行号；`tokens.css` 指 `packages/ui-tokens/src/tokens.css`。
- 入仓回执 `docs/verification/internal-alpha/a11y-axe-summary.json` 与 `browser-proof-summary.json`。verify 在 15:20 重写过这两份，之后工作树干净，所以内容与运行结果相同。
- 源码只读探查。

未重跑门，未构建，未起浏览器。唯一看过的图像是 verify 留下的被忽略截图 `docs/verification/internal-alpha/screenshots/desktop-1440x900-inputs-matrix.png`。机器判定不代替 Owner 目视（D8）。

## 1. 一览

| Story | 结论 | 不满足或部分的 GWT | 返工项数 |
| --- | --- | --- | --- |
| 123 Typography | 通过 | 无（GWT4 由 R1 的部分转为满足） | 0 |
| 124 Icon | 通过 | 无（GWT1 由 R1 的部分转为满足） | 0 |
| 125 Actions | 通过 | 无（GWT3 由 R1 的部分转为满足） | 0 |
| 126 Inputs | 通过 | 无（GWT5 由 R1 的不满足转为满足） | 1：B2-1。改动落在本 Story 文件，验收点在 129 的矩阵 story 与 Owner 目视清单，不改变本 Story 的 GWT 判定 |
| 127 Brand | 阻塞于 Owner | GWT4（52px，O-1） | 0 |

返工清单共 3 条（B2-1 至 B2-3）：主力档 2 条（B2-1、B2-2），经济档 1 条（B2-3）。B2-2 跨分片，落在 STORY-133 的冒烟门；B2-3 是跨包的文档漂移。与 A、C 片同根时合并。

R2 红步与本分片的关系：
- 10 号红在 `searchOverlay`（SUB-080，Navigation 家族），与本分片无关。
- 11、18、19 号的红全在样板 rail 与文档壳（O-1）。五个矩阵在 18 号两轮都是全绿，19 号的 A、B 行也是全绿。
- 17 号 14 条失败同一根因，见 B2-2；触发它的是 SUB-059。
- 30.02 号 axe 12 条全是 O-2（锁定组合标语与壳品牌说明）。R1 本分片的快捷键与后缀两类节点降为 0。30.04 由 30.02 派生。

## 2. 逐 Story

### STORY-123 Typography（P2：SUB-055；依赖 SUB-047、SUB-067、SUB-084，以及 A 片的 SUB-052）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 标题超宽：行框 1、省略号、带 title | 满足，沿用 R1，R2 无回退 | dist:1200–1203 四级标题都有 nowrap、overflow hidden、ellipsis；13 log:92 C7 0 条；18 号 typography-matrix 两轮 singleLine 均 pass（18 log:1088、3860 起）。R1 时 internal-alpha 把截断记成 clipped 的口径冲突，已随 SUB-084 消除：30.02 log:36 `clippedButtonText: false` |
| 2 Highlight 命中与未命中宽度差 0 | 满足，沿用 R1，R2 无回退 | 18 log:6698 probe highlightWidth pass，4 处，最大宽差 0.02px（门容差 0.5px）；变异 mark-padding 被杀（18 号报告 mutations） |
| 3 numeral「4,280.00」为 Source Serif 4 300 且 tabular-nums | 满足（R2 改了写法，值不变） | dist:1210 numeral 改为 `var(--tcrn-type-family-serif)`、`var(--tcrn-type-weight-light)`、`font-variant-numeric:var(--tcrn-type-numeric-tabular)`；tokens.css:92 serif 字栈以 "Source Serif 4" 打头，:122 weight-light 为 300，:125 numeric-tabular 为 `tabular-nums lining-nums`；05 log:203「a numeral renders 4,280.00 in the serif at 300 with tabular digits on one line」通过；21 fonts:render 绿 |
| 4 矩阵 44 格与画布逐格一致 | 满足（R1 为部分） | 18 号 typography-matrix 浅色页轮（18 log:1088）与夜间页轮（18 log:3860）各 44/44 格，最大差 0。例如 h1-l 两轮都是 18.29 对 18.29（18 log:1177、3949），R1 夜间页读到 14.38。07 log:85 matrix-expect：44 格期望与画板 data-expect 两位小数一致。根因修复是 SUB-047 的浅色块选择器，由 A 片核 |

R2 Subtask 判据：
- **SUB-055 达成**，实测与 P2 自报一致：
  - 对表：dist:1217–1222 的基础规则读 `--tcrn-pair-ink`、`--tcrn-pair-underline`、`--tcrn-pair-edge`；两条 `:where()` 状态规则只切换生效对，不写 color、text-decoration-color、box-shadow。
  - quiet 是变体声明 `.tcrn-link.tcrn-link--quiet`（ink-d 为 currentColor，ink-h 为 acc-2），已不引用 brand-primary。
  - 焦点回退：dist:1244–1247 `outline:2px solid transparent; outline-offset:2px`。
  - 面包屑：`.tcrn-breadcrumb a:hover` 仍写 brand-primary（dist:3170–3175），在 EX-INIT015-navigation 豁免内。13 log:150–158 的 C2 豁免只有 shell、navigation、records、display、boards、overlay、settings、feedback，没有 typography。
  - 门：13 log:89 C2 0 条；07 log:78–82 6/6；08 绿；05 log:207–209 链接三条用例通过。矩阵 link 六格两轮一致（如 link-l 6.35、link-hover-l 7.51）。
- 依赖项：
  - R2-18（SUB-067）：`browser-proof-summary.json` 的 zh-CN newLeaks 只剩 foundation-visual-standards 的三条（px rest、px expanded、px high，来自 SUB-063），text-styles 的两条已经消失。
  - R2-29（SUB-084）：见 GWT1。

硬线：
- 状态对与特异性满足（C2 0）。主题同构满足（13 log:90 C5 0）。禁用清单满足（C11 0）。
- 几何：生成段还有 4 条字面字号或行高（dist:1212、1213、1216：numeral-inline 16px，numeral-large 44px/48px，mono 11.5px），归 O-6（RM8）。C10 只管壳层几何，沿用 R1 口径，不算本 Story 硬线违例。

结论：通过。

### STORY-124 Icon（P8：SUB-056；依赖 SUB-063）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 任一名册名 16px 实测描边 1.25px | 满足（R1 为部分） | 18 log:6709 probe iconStroke（source 124-GWT1）pass：74 枚 16px 图标（矩阵浅色块与夜间块各 37 枚）、180 个子元素；计算 stroke-width 只有 "1.25px" 一种，vector-effect 只有 "non-scaling-stroke" 一种，偏差 0。18 log:65 的红夹具用例（16px 描边改成 2 或去掉 non-scaling-stroke 时判红）通过；单测 64/64（18 log:69–72） |
| 2 名册外名字类型检查失败 | 满足，沿用 R1，R2 无回退 | 02 typecheck 退出 0；05 log:148「names outside the roster and a strokeWidth override do not type-check」通过 |
| 3 package.json 搜 lucide 为 0 且构建通过 | 满足，沿用 R1，R2 无回退 | 根 package.json、`packages/*/package.json`、`apps/*/package.json`、pnpm-lock.yaml 不分大小写搜 lucide，0 处；03 build 退出 0 |
| 4 矩阵底色上图标 ≥ 3 | 满足，沿用 R1，R2 无回退 | 18 号 icon-matrix 两轮各 28/28 格，差 0（18 log:1470、4242）。最低一格是 dis-n 4.09（禁用格，data-exempt），其余都 ≥ 4.5。R1 夜间页的 `-l` 偏差已随 SUB-047 消失 |

R2 Subtask 判据：
- **SUB-056 达成**，实测与 P8 自报一致。iconStroke 还要求图标实际渲染 16px，属于加严，见 §5。
- 依赖 R2-13（SUB-063）：`apps/storybook/src/story-demo-styles.ts:284–288` 只留 `justify-self:center`，不再写 18px；20 log:1252–1262 docStylesheet 0（R1 为 72）。packageContext 142 条（含壳内图标 11px）按 §3.3 交后续批次。

硬线：几何来自 token 满足（文档层的 18px 已删）；状态、主题同构、禁用清单满足。body 的「名册 story 显示 37 件三档」沿用 R1。

结论：通过。

### STORY-125 Actions（P3：SUB-057；P10：SUB-079 改 Button 的 title；依赖 SUB-047、SUB-081、SUB-083）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 `.tcrn-button` 的 :hover/:active/[aria-pressed] 无颜色、特异性 ≤ (0,1,0) | 满足，沿用 R1，R2 无回退 | dist:176–181 状态规则全是 `:where()`，只切 `--tcrn-pair-*`；13 log:89 C2 0 条，C2 豁免里没有 actions（13 log:150–158）；05 log:63「125-GWT1 … name no colour and stay at (0,1,0)」通过；07 log:81 package-css 的 95 条状态规则都没有颜色字面量 |
| 2 注入 `.scope .tcrn-button:hover{background:…}` 判红 | 满足，沿用 R1 | 13 log:11「132-GWT1: .x .tcrn-button:hover{background:#fff} turns C2 red」通过 |
| 3 116 格矩阵与画布逐格一致，禁用格标豁免 | 满足（R1 为部分） | 18 号 actions-matrix 两轮各 116/116 格，差 0（18 log:1938、4710）。构建页 `components-gplus-matrices.html` 里 actions 的 16 个禁用格带 data-exempt（pri、sec、danger、quiet 及其 ico- 四种，各有 -l、-n），门对 exempt 格不判最低值（`scripts/lib/gplus-measure.mjs:462–479`），所以 pri-x-n 这类 4.09 的格两轮都通过。07 log:85：116 格期望与画板一致 |
| 4 ButtonGroup 组内焦点环不被裁切 | 满足，沿用 R1 | 18 log:6676 probe buttonGroupFocusRing pass，10 个按钮，0 处裁切；05 log:77 |
| 5 按下 transform 为 none | 满足，沿用 R1 | dist 里在 `:active` 上设 transform 的规则只剩 nav-item 与 locale 触发器（dist:159 一带，dist:2695 复位），以及导航容器内的原生 button（dist:3286，W3-D P2，§3.3 后续批），没有一条落在 `.tcrn-button` 上；05 log:65「125-GWT5: nothing transforms a button」通过；30.02 log:33 `buttonFeedbackOk: true`（R1 为 false，SUB-083 修好） |

R2 Subtask 判据：
- **SUB-057 达成**：
  - dist:330–342：主题钮图标的显隐只由 `.tcrn-shell-theme-toggle[data-current-theme]` 的透明度规则决定。全表 `data-theme-icon` 只出现在这四条规则与 dist:1069 的注释里，已没有挂在 `html[data-tcrn-theme]` 上的规则。
  - 门：13 log:90 C5 0 条；05 log:182「theme toggle shows its current icon by its own data-current-theme, in a block-level night theme as on a night page」通过。
  - 默认隐藏 moon 的那一条也一并删了（RM3 ②），判可接受，见 §5。
- **SUB-079 对本 Story 的影响**（判据属 STORY-132 的 C7，由 C 片核）：Button 有禁用原因时，title 为「标签 — 原因」；原因仍经 aria-describedby 与 data-disabled-reason 给出。05 log:219–222 ui-react 162/162（I1 已改 Clipboard.test.tsx:180）；13 log:92 C7 0 条。

goal 与观察：
- R1 记过「尺寸档没有 DOM 门量过（checksNeverApplied 含 controlHeight）」，现已解决：actions-matrix 两轮 controlHeight 都是 pass，checksNeverApplied 为 []（SUB-077）。
- 外壳切换钮尺寸（O-5）、secondary 与 danger 抬升层的浅墨字面量（O-9，dist:174 仍是 `rgba(22,21,15,.04)`）仍待 Owner。

结论：通过。

### STORY-126 Inputs（P2：SUB-058；P4：SUB-059 至 SUB-062；依赖 SUB-047、SUB-070、SUB-083）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 文本类控件默认边 line-ctl 于 panel ≥ 3.1 | 满足，沿用 R1 | dist:3117 inputs-text 的 `--tcrn-pair-edge-d:inset 0 0 0 1px var(--tcrn-color-line-ctl)`；同一 token 对的 ck-edge-l 3.16、ck-edge-n 3.34，两轮与期望一致；05 log:137。矩阵仍没有文本控件边线的专格（观察，沿用 R1） |
| 2 aria-invalid 且获焦：红边红环，无青色 | 满足，沿用 R1 | dist:3125 `[aria-invalid="true"]:focus-visible` 切到 edge-ef；dist:3117 edge-ef 为 `inset 0 0 0 1px var(--tcrn-color-bad),0 0 0 2px var(--tcrn-color-surface),0 0 0 4px var(--tcrn-color-bad)`，没有 acc。新加的 rf 排在 e、ef 之前（dist:3123 < 3124 < 3125），只读、错误且获焦时仍是红环；05 log:137 |
| 3 SearchInput 夜间占位 ≥ 4.5 | 满足，沿用 R1 | search-ph-n 两轮都是 6.11，与期望 6.11 相同 |
| 4 DatePicker 点右侧 30px 打开系统日历 | 满足，沿用 R1 | 18 log:6687 probe datePickerIndicatorHit pass（2 个）。无头浏览器不弹系统日历，按拆分 P31 改判落点（沿用 R1 口径） |
| 5 42 格矩阵与画布逐格一致 | 满足（R1 为不满足） | 18 号 inputs-matrix 两轮各 42/42 格，差 0（18 log:2750、5522）。err-msg-l 为 6.69 对 6.69，err-msg-n 为 6.88 对 6.88（18 log:2875、5647 起；R1 为 6.20、6.27）；opt-sel-l 16.18、opt-sel-n 12.15 已渲染并实测（18 log:3025、5797 起；R1 缺这两格）；19 log:2489 inputs.B 行绿；07 log:85：42 格期望与画板一致 |

R2 Subtask 判据（按实测）：
- **SUB-058 达成**：
  - pairs.json 的 inputs-text 加了 rf。dist:3117 声明 `--tcrn-pair-edge-rf:inset 0 0 0 1px var(--tcrn-color-acc),var(--tcrn-focus-ring)`；dist:3123 的 rf 规则（`[readonly]` 或 `[aria-readonly="true"]`，加 focus-visible 或预览态）排在 r 之后。
  - 05 log:138 只读获焦用例通过。
  - 画板没有重生成（RM10），见 §4。
- **SUB-059 达成**：
  - dist 里已经没有 `.tcrn-product-shell .tcrn-search-input:focus-within`，也没有它的 `:where` 写法。
  - dist:4085–4087：选项在本类上声明 fill-d、fill-h、fill-s 与 `--tcrn-pair-weight`，两条 `:where()` 状态规则只切换。13 log:89 C2 0 条。
  - 副作用：删掉的那条规则原本把包裹层的 outline 设为 0。删了以后，Chromium 149 在 `outline-style:none` 时报 `outline-width:3px`，冒烟三个子证明因此有 14 条 `searchInput:focus-outline-width:3px` 转红，见 B2-2。style 为 none，视觉上没有变化。
- **SUB-060 达成**：
  - dist:3056–3058 `.tcrn-field__error{color:var(--tcrn-color-bad)}`。
  - 非强制色下 `.tcrn-field--error` 的整块底与 outline-color 已删，只留强制色块里的 Highlight outline（dist:3813–3816）。
  - err-msg 两格见 GWT5；Form.test.tsx:599–602 断言错误态无整块底、错误文字读 bad，所在用例 05 log:143 通过；smoke.test.ts:822 同步，storybook test 9/9（05 log:240–243）。
- **SUB-061 判据字面达成，但有副作用**：
  - 门：28 log:39–40 closed-select-family-empty ok；28 log:334–335 public-popup-family-dark ok（SUB-083 之后）。dist:4074 触发器 `padding-inline-end:30px`；dist:4076 caret 与 Select 同位。
  - 副作用：dist:4073 容器改成了 `display:flex;align-items:center`。矩阵在原位展开列表（`matrix-stories.tsx:418–432`），于是列表排到了触发器右侧。截图里两主题的列表都被压窄，选项折成两行。RM7 ① 把原因归为「去掉钩子」，不成立，见 B2-1。
  - 真实组件的列表由 OverlayBoundary 设为 `position:fixed`（Overlay.tsx:221），不受影响。
- **SUB-062 达成**：
  - dist:987 快捷键为 `color: var(--tcrn-color-ink-2)`。
  - a11y-axe-summary.json 里 kbd 与 `search-input__shortcut` 节点为 0（R1 为 140 个）。
  - 按 token 复算：夜间 ink-2 于 #282724、#272724 为 6.13、6.15；浅色 ink-2 于 wash 叠 bg 为 6.56。与 P4 自报一致。

硬线：
- 满足：状态对与特异性（inputs C2 0）；焦点可见（rf）；文字对比（kbd 节点 0）；主题同构、选中态、单行截断、禁用清单（C5、C6、C7、C11 都是 0）。
- 同类一致：闭合态满足（28 号两例 ok）。展开态在矩阵静态样例里列表位置偏离画板，见 B2-1；这影响 129 与目视，不是组件运行时的缺陷。

结论：通过（GWT1–5 满足）。B2-1 的改动落在本 Story 的 `inputs.css.ts`，验收点在 129 的矩阵 story 与 owner-acceptance 第 169 行，不改变本 Story 的 GWT 判定。

### STORY-127 Brand（无 R2 Subtask；相关单为 SUB-085、SUB-072、SUB-077）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 mana-orchestrate 加 ja 标语为「プロジェクト記憶アシスタント」，不含 Claude、Codex | 满足，沿用 R1，R2 无回退 | 从 R1 HEAD 4c958f8 到 e643d74，`product-marks.generated.ts`、`contract/marks.json`、`styles/brand.css.ts` 都没有改动（`git diff --stat` 为空）；生成物含该标语，claude/codex 计数 0；Navigation.test.tsx:279–280 渲染 ja 并逐字比对，所在用例 05 log:166 通过 |
| 2 任一产品标 SVG 改一个字节判红 | 满足，沿用 R1 | 14 log:7、15–16 ok，productMarks 八个文件 renderedMatches；07 log:84 product-marks 与 logos2 逐字节一致 |
| 3 后缀 computed color：TMS #2c63c8、DS #6577f3、TCRN 为 ink | 满足，沿用 R1 | tokens.css:117 `--tcrn-brand-suffix-tms: #2c63c8`，:120 design-system 为 #6577f3；brand-matrix 两轮各 10/10，差 0（18 log:1758、4530；含 suffix-ink-l 18.29、suffix-ink-n 14.38）；axe 豁免条目登记的前景色就是这两个值（a11y-axe-summary.json 的 wordmarkContrastExemption） |
| 4 侧栏收起到 52px：文案 display:none、标 22 不缩放 | 阻塞于 Owner（O-1） | 收起态的 CSS 已做：dist:633–636 文案为 display:none；10 号 brand 变异 red true、green true。收起宽仍是 dist:544–545 的 `--tcrn-product-shell-sidebar-width: 92px`，52px 取决于 O-1。未答复时保持阻塞，不出返工 |

其它：
- axe 12 条全是 O-2，共 88 个节点：`.tcrn-product-logo__line-two` 48 个，`.tcrn-shell-brand-lockup__caption` 加 line-two 40 个；对比为 4.36（#6b675d 于 #dde4df）与 4.17（#85827a 于 #172421）。
- 后缀 94 个节点按字标豁免（30.02 log:13，SUB-085）。豁免不分主题（RM6）属 P9 的取舍，由 C 片判；它和 O-3 同组。

结论：阻塞于 Owner。GWT1–3 满足；GWT4 待 O-1。没有本 Story 文件内的返工。

## 3. 返工清单

档位按派工规则：改共享契约（token 键集、`contract/*.json`、导出面、门的判定语义）起主力档，孤立修复起经济档；同一修复目标第二次返工，经济档升主力档。

**B2-1 MultiSelect 容器横排，把原位展开的列表推到触发器右侧**（主力档：同一修复目标第二次返工，由经济档升；STORY-126 的文件，验收点在 129 的矩阵 story；来自 SUB-061、R2-11）
- 现象：
  - dist:4073（源 `packages/ui-react/src/styles/inputs.css.ts:517`）为 `.tcrn-multi-select-dropdown{position:relative;display:flex;align-items:center;…}`。
  - 矩阵静态样例在原位展开列表：`matrix-stories.tsx:418–432` 去掉了 data-choice-presentation，并移除列表的 hidden。列表因此成了横排里的第二个 flex 项。
  - 截图 `desktop-1440x900-inputs-matrix.png`：两主题的列表都在触发器右侧，宽约 110px，选项折成两行，触发器被压窄。
  - owner-acceptance.md:169 把它记为待目视项；RM7 ① 把原因归为去掉钩子。去掉钩子只会让列表留在文档流内，把它排到右侧的是 SUB-061 的横排容器：R1 时容器是块级，流内的列表在触发器下方。
  - 真实组件与静态桥都经 OverlayBoundary 把列表设为 `position:fixed`（Overlay.tsx:221），运行时不受影响。
- 改法：
  - 容器改为纵向，同时让触发器仍是 flex 项：`display:flex; flex-direction:column; align-items:stretch`。也可以用单列 `display:grid`；P4 的探针显示 grid 项的 min-height 同样读作 auto。
  - 触发器的 30px 末端区与 caret 不动，门的比对字段不改。
  - owner-acceptance.md 第 169 行随本条改为复核项。
- 改动文件：`packages/ui-react/src/styles/inputs.css.ts`（约 517 行）；`docs/dispatch/2026-10-11-gplus-renewal/owner-acceptance.md` 第 169 行。
- 复核：
  - full-surface 的 closed-select-family-empty 与 public-popup-family-dark 仍为 ok（minHeight 仍读 auto）。
  - geometry:measure 的 inputs-matrix 两轮 42/42，controlHeight pass。
  - storybook:visual-proof 的 inputs.A、inputs.B 行绿。
  - inputs-matrix 截图里列表在触发器下方，与触发器同宽。
- R2 是否改过同一目标：是（SUB-061，P4 经济档），所以升主力档。

**B2-2 冒烟比较器在 outline-style 为 none 时仍按 3px 读数判红**（主力档：改门判定；跨分片，属 STORY-133，影响 126 的证据；由 SUB-059 触发）
- 现象：
  - 17 log:21–22、4140–4146、12360–12369 共 14 条，全是 `searchInput:focus-outline-width:3px`。
  - 期望写在 `scripts/storybook-smoke.mjs:293`：`focus:{outlineWidth:"0px",outlineStyle:"none",…}`，是 R1 的 SUB-041 定的。
  - 读数（17 log:629–630、640–641）为 `outlineWidth:"3px"`、`outlineStyle:"none"`。SUB-059 删掉的壳内规则原本写 `outline:0`；删掉后，包裹层的 outline-width 回到初值 medium，而 Chromium 149（30.02 log:8）在 style 为 none 时仍报 3px。视觉上没有差别，因为 style 为 none 不会画 outline。
  - 同一处 searchControl 的焦点读数是透明 outline 加焦点环（17 log:694–699），符合 G+。
  - steps.md 留给验收核对的另外两项（designSystemVisualInstanceParityReadback、ownerQualityProductShellProof），失败条目也只有这同一条，不是文档顶栏包裹层作画；RM15 #4 在 R2 末已经不出现。
- 改法：
  - 比较器在 outlineStyle 为 none 时不比 outlineWidth 与 outlineOffset；或者把期望改为只要求 outlineStyle 为 none。三个子证明共用这处判定。
  - 不要在包里回加 `outline:0` 去迁就读数。
- 改动文件：`scripts/storybook-smoke.mjs`（第 293 行的期望与第 1280 行一带的逐字段比较）及其单测。
- 复核：17 号三个子证明的 14 条消失，其余读数不变。
- R2 是否改过同一目标：否。SUB-081、SUB-082 改的是取样时机与退出码。C 片若已列同根项，合并为一条。

**B2-3 R2 改动带出的契约文档漂移**（经济档；跨包：P2、P3、P10；见 RM9 与 P10 问题 #5）
- 现象：
  - `docs/design/gplus-2026-10/README.md` 第 12 行，pairs.json 的 Inputs 文本类写「d/h/f/x/r/e/ef」，少了 rf。
  - 同文件第 16 行，typography.json 没写刻度 tokens 与链接 pairs，也没写它现在也生成进 `gplus-tokens.generated.ts`。
  - `docs/contract/README.md` 第 47 行仍写 package-css 只查「pairs.json 目标基类的状态规则」。
  - `docs/contract/roles.json` 的 description 没写第一批承载元素的 title 须含可见文字。
- 改法：按 P2 问题 #2、P3 问题 P2（已给正文）、P10 问题 #5 的建议，各改一句。`inputs.pairs.ts` 的段注释少 rf（注释写在 `scripts/contract-generate.mjs` 的 `inputsFile()`），交给下一张改生成器的单顺手补上，不单独派。
- 改动文件：上述三份文档。
- 复核：readme:proof、public-output:scan、internal-vocab:scan 不转红。
- R2 是否改过同一目标：否。

## 4. 只有 Owner 能定的事项

本分片没有新增 O 号事项。与 O-1 至 O-12 的关联、未答复时的处理如下。

| 事项 | 本分片的关联 | 建议与未答复时 |
| --- | --- | --- |
| O-1 构图一壳层几何 | 127-GWT4：收起宽仍是 92px（dist:545） | 沿用判断的建议。未答复时 127 保持「阻塞于 Owner」，不出返工 |
| O-2 标语与壳品牌说明的对比 | 30.02 号 axe 12 条（88 个节点）全在这一项 | 沿用。未答复时保持红，不加豁免 |
| O-3 夜间品牌后缀色 | 127 的夜间可读性；RM6 的 axe 豁免不分主题，夜间样板侧栏有 6 个 DS 后缀节点（4.18）被豁免 | 与 O-3 一并定。未答复时维持两主题同值与字标豁免 |
| O-5 外壳切换钮尺寸 | 125 家族的主题钮仍是 36 胶囊 | 未答复时维持 |
| O-6 组件内字面几何 | 123 生成段余 4 条字面字号或行高（RM8） | 未答复时不新增 token；Typography.test 已钉住这 4 条 |
| O-7 Typography API | numeral 不截断、给 title，未变 | 未答复时维持 |
| O-8 B1 与 B2 品牌规格 | 未变 | 未答复时保持 B1 |
| O-9 edge 抬升层字面量 | dist:174 仍是 `rgba(22,21,15,.04)` | 未答复时维持 |

挂在 §3.4 已回显项下、需要设计权威一并处理的画板修订（建议随下一次画板修订一起做，不阻断本轮）：
- §3.4 第 1 项与 RM10：Inputs 板仍是 r 盖住 f，没有只读获焦态。`tools/build-inputs.mjs` 重生成时会多出一条 `--edge-rf` 声明，但板面没有对应规则。建议重生成 Inputs 板，补上 rf 一行，让画板、契约与包三者一致。未答复时维持现状：画板与契约差这一条声明，没有门比对。
- §3.4 第 3 项：Inputs 板的快捷键画的是 ink-3。浅色下 ink-3 于 wash 叠 bg 为 4.31（P4 发现，本片复算相同），夜间为 3.89–3.90，两主题都低于 4.5。建议画板改为 ink-2，与包一致。未答复时包保持 ink-2，画板不动。

RM13 ② 的验收意见：SUB-072 判据写明「删掉 Asset ID 列，或改显示不含仓库名的标识」（decomposition.md:484），删整列在授权范围内，所以 DIFF-9 记「已裁定」可以成立。Owner 知悉已列在 owner-acceptance.md:129，不需要另立 Owner 事项。

## 5. 实施口径判定

| # | 包 / 来源 | 口径 | 判定 | 理由 |
| --- | --- | --- | --- | --- |
| 1 | P2 · RM1 | Navigation.test 两条旧断言改为 doesNotMatch，快捷键断言改 ink-2 | 可接受 | 守护保留在原处，不删断言；ui-react 测试 162/162 |
| 2 | P2 · SUB-055 | 链接对表写进 typography.json，新增生效对 `--tcrn-pair-underline` | 可接受 | 状态规则不能写 text-decoration-color，下划线色只能走生效对；token-extension-proof 接受任意 `--tcrn-pair-*`；没有新增元组名 |
| 3 | P2 · SUB-055 | 焦点透明 outline 写在 typography.css.ts，不放进生成段 | 可接受 | 生成段的状态规则不许任何颜色字面量，transparent 也算；包段与 C2 只放行只含 transparent 的 outline（07 log:82，6 处） |
| 4 | P2 · RM11 | quiet 改为 `.tcrn-link` 的修饰类（须同用）；悬停下划线偏移 0.2em 改 2px，颜色 acc 改 acc-2 | 可接受 | ink-h acc-2 是判断的写法；仓内没有单独使用 quiet 的地方；CHANGELOG.md:88–90 与 migration-4.0.md:297–304 已写明 |
| 5 | P2 · SUB-058（§3.4 第 1 项） | 取 rf 元组，不取「f 排到 r 之后」 | 可接受 | 只读的底与字色保留，获焦时仍看得出只读；CHANGELOG.md:122–123 已回显 |
| 6 | P2 · 问题 #3、RM10 | Inputs 画板未随 rf 重生成 | 有条件 | 由设计权威决定是否补只读获焦态（§4）；决定前画板与契约差一条声明，没有门比对 |
| 7 | P2 · SUB-052 对本片的影响 | numeral 的字号行高引用 heading-2 的 token（值同为 26/30） | 可接受 | 生成器对值不一致报错，H2 改值时会逼出一次取舍。SUB-052 的判据归 A 片；余 4 条字面值属 O-6（RM8），不是口径问题 |
| 8 | P2 · 问题 #2、#4，RM9 | 两份 README 与 inputs.pairs.ts 段注释未同步 | 有条件 | 由 B2-3 补文档；注释随下一张改生成器的单补上 |
| 9 | P3 · SUB-057（RM3 ②） | 一并删掉默认隐藏 moon 的 `[data-theme-icon="dark"]` | 可接受 | 只删 html 级两条，moon 在任何主题下都不显示；显隐全部交给 data-current-theme 的透明度规则；05 log:182 覆盖块级夜间 |
| 10 | P3 · §3.4 第 6 项 | 取 C-9，不取 B-3 | 可接受 | 块级主题与页级主题同样生效；C5 为 0 |
| 11 | P3 · SUB-053（RM3 ①） | package-css 的「全部状态规则」取 clauses.md C2 的定义 | 可接受 | 经 selectorFacts 与 contract-static 共用同一口径；放宽属于改扫描器口径；两条由别的 data-* 限定的壳层规则交 Navigation 批。判据归 A 片 |
| 12 | P4 · SUB-059 | 直接删除壳内搜索的 focus-within 规则 | 有条件 | 删除本身是对的（包裹层不作画），但带出冒烟 14 条读数红；要配套 B2-2 改比较口径，不要回加 `outline:0` |
| 13 | P4 · SUB-059 | 选项默认字重由 `--tcrn-pair-weight:400` 给出；hover 排在 selected 之后 | 可接受 | 与 Actions 生成段写法相同；画板 `.opt.is-hover` 也在 `[aria-selected]` 之后；full-surface 读到 400 |
| 14 | P4 · SUB-060（§3.4 第 2 项） | 错误态整块洗底一并删去 | 可接受 | R1 已判；两格实测回到期望 |
| 15 | P4 · SUB-061 | 容器改 flex 加 align-items:center，让触发器与 Select 处于同一布局语境 | 有条件 | 处于同一布局语境的方向是对的，但横排把原位展开的列表推到右侧；按 B2-1 改为纵向或单列 grid |
| 16 | P4 · SUB-062（§3.4 第 3 项） | 快捷键改 ink-2，画板画的是 ink-3 | 可接受 | 按 C1 文字 4.5 的阈值；复算 6.13、6.15、6.56 与自报一致；浅色 ink-3 于 wash 叠 bg 也只有 4.31 |
| 17 | P8 · RM13 ① | actions.A 加 rowAlign，构图一四行也加 rowAlign | 可接受 | 让映射与门一致；构图一画板本身也有表格 |
| 18 | P8 · SUB-056 | iconStroke 另要求图标实际渲染 16px | 可接受 | 防止选到的「16px 行」其实不是 16px，属于加严，不放宽判据 |
| 19 | P8 | 未知的探针 id 报 error，不再落到 Highlight 探针 | 可接受 | 改掉了静默误判 |
| 20 | P8 · RM13 ② | DIFF-9 记「已裁定」，引 R2-25 | 可接受 | SUB-072 判据授权删列（decomposition.md:484）。RM13 ②「没有裁定授权删整列」的前提不成立；Owner 知悉已在 owner-acceptance.md:129 |
| 21 | P10 · SUB-079（§3.4 第 7 项） | Button 禁用原因的 title 写「标签 — 原因」 | 可接受 | V2-B1-Actions 板写 disabledReason「变成 title 与 sr 文本」；有 aria-describedby 时读屏不会重复读 |
| 22 | P10 | 第一批承载元素按元素自身的包类判定；「哪个 title」取浏览器显示的那一个 | 可接受 | 与 R2-29 浏览器门的读法相同。判据归 C 片 |
| 23 | P10 | 禁用时 title 里的标签取可见文字，不取调用方的 title | 可接受 | 避免出现「原因 — 原因」；SideNavCollapseButton 的用例保持绿 |
| 24 | I1 · RM16 | 值里有多处 ` — ` 时逐个切分点试，两边都查得到的优先 | 可接受 | 只接在属性循环上，文本节点与输入框的值不变；原因或标签自带 ` — ` 时也能对上 |
| 25 | I1 · 问题 #1、#3 | 门不读 title；7 种 title 在非英文下半译 | 不属本片口径 | 交下一批：门的持有方与 locale 文件的持有方 |
| 26 | RM7 ①（P7 的处置，涉及 126） | 「列表位于触发器右侧」列为待 Owner 目视 | 不可接受 | 这是 SUB-061 横排容器的机械后果，不是需要 Owner 判断的视觉取舍。按 B2-1 修好后，把它从目视项改为复核项。去掉 data-choice-presentation 钩子这一做法本身可接受 |
| 27 | steps.md 第 17 步 | 「其余两项是否同根或为包裹层作画，待验收核对」 | 结论 | 两项的失败条目全是同一条 `searchInput:focus-outline-width:3px`（17 log:4140–4146、12360–12369），与第一项同根（B2-2），不是包裹层作画 |

## 6. 证据盲区

- 未重跑门，未起浏览器。B2-1「改为纵向或单列 grid 后 minHeight 仍读 auto」只按 P4 的探针结论推断，改后要跑 full-surface 与 geometry:measure 确认。
- 强制色模式：没有门在 forced-colors 下渲染。链接、输入框的透明 outline 回退与 `.tcrn-field--error` 的 Highlight outline，只按 CSS 与单测核对。
- 系统日历弹出：无头浏览器不弹，沿用 R1 的落点口径。
- P3 的「3 页、11 个主题钮在块级夜间只显示 moon」复核脚本没有入仓；本片只看到 jsdom 用例（05 log:182）。
- axe 明细读的是入仓回执 a11y-axe-summary.json（verify 重写后工作树干净，推定与运行结果相同）；30.02 日志本身只给计数。
- 视觉签名有 155 条回归、30 条新基线未应用（RM18），矩阵的目视状态看不到；截图只看了 inputs-matrix 一张。
- I1 的五语 title 探针脚本不在仓内，本片没有复核非英文下按钮的 title。
- 与 O-1 相关的 11、18、19 号红（样板 rail、文档壳），没有逐条核对，不属本片 GWT。
- 工作树里的 `docs/verification/internal-alpha/screenshots/`（被忽略，307 个文件）是主线程 verify 留下的产物。本片只读了其中一张，没有处置。
