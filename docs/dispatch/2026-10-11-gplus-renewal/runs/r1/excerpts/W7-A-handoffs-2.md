# 摘录附件 · W7-A（W1-B W1-C W2-D W2-E W2-F W3-A）：给消费方的变更事实（迁移说明与 CHANGELOG 的来源）

只读各交回里会影响消费方的条目：改名、删除、新增导出、默认值变化、需要的新引入（如 fonts.css）、弃用别名。


## 交回 W1-B

### INIT-015 R1 · W1-B（SUB-010）交接

SUB-010 已完成，没有接续点。提交：8ae44e2（段模块、再导出、读源门改读新位置）、3d3e5b5（token-extension 接受 `--tcrn-pair-*` 局部变量）。本文件给 W2/W3 家族包、集成与验收用；问题清单在 `runs/r1/problems/W1-B.md`。

## 现在的结构

- `packages/ui-react/src/styles/{base,typography,icon,actions,inputs,brand}.css.ts`：各家族导出模板串段 `<family>CssNN`。
- `packages/ui-react/src/styles/index.ts`：按原级联顺序拼接全部段，导出 `tcrnComponentCss: string`。这是顺序唯一写定的地方。
- `packages/ui-react/src/components/Navigation/Navigation.tsx`：只再导出 `tcrnComponentCss`，公开导出与原有 import 不变。
- `scripts/lib/component-css-sources.mjs`：读源的门经它取样式文本。`componentCssSourcePaths()` 列出 `styles/` 下全部 .ts（含将来的 `styles/generated/`），`componentCssModules()` 按文件给出段文本，`componentCssText()` 给出全部段文本（不是级联顺序；要顺序就从 dist 导入）。没有任何段文本时直接抛错，门不会因为读空而变绿。

## 家族包怎么接

1. 只改自己的 `styles/<家族>.css.ts`。新规则写进已有段；生成段 import 进来后拼进某一段，例如 ``export const actionsCss03 = `…` + actionsPairCss;``。
2. 不新增 `<family>CssNN` 导出。`styles/index.ts` 只由 SUB-010 写，不在拼接列表里的段不会发出，`css-template-integrity-proof` 会把它报红。确需新落点时写进本包号的 handoff，交 W3-D 或主线程。
3. 段里的 CSS 注释不得含反引号，否则段会被提前截断（同一条门会报出段名）。
4. `styles/base.css.ts` 在 W2 冻结（跨包约定第 5 条）。
5. icon 家族目前没有规则，`iconCss01` 是空落点，位于 root 自定义属性之后、第一条 actions 规则之前。

归属规则：主语取最右复合选择器，没有 tcrn 类时向左取最近带 tcrn 类的复合；一个复合含两个组件类时归最后一个；块名等于家族名或以「家族名-」开头即归该家族，长名优先。所以 `.tcrn-lane-board__card .tcrn-text` 这类上下文规则归 typography，由 typography 包负责。

## 段与原 Navigation.tsx 行号对照

被拆开的规则，各片沿用原规则的行号区间，所以相邻段的区间会重叠。

- base：01 2133-2154，02 2155-2159，03 2181-2188，04 2241-2245，05 2251-2295，06 2307-2362，07 2363-2385，08 2502-2559，09 2563-2584，10 2585-2867，11 2953-3044，12 3049-3149，13 3177-3290，14 3294-3615，15 3620-3891，16 3895-3989，17 3994-4004，18 4008-4036，19 4037-4103，20 4107-4142，21 4147-4220，22 4226-4355，23 4367-4574，24 4424-4612，25–27 4575-4612，28 4575-4677，29 4693-4917，30 4988-5184，31 5250-5348，32 5380-5585，33 5595-5682，34 5695-5749，35 5753-5763，36 5788-5789，37 5794-5795，38 5797-5810，39 5814-5871
- typography：01 3150-3171，02 3291-3293，03 3616-3619，04 3892-3894，05 3990-3993，06 4005-4007，07 4037-4041，08 4104-4106，09 4143-4146，10 4221-4225，11 4356-4366，12 4680-4690
- actions：01 2155-2159，02 2160-2188，03 2189-2245，04 2246-2250，05 2363-2371，06–08 4575-4612
- inputs：01 2290-2306，02 2868-2952，03 3045-3048，04 4575-4612，05 4920-4985，06 5188-5248，07 5350-5378，08 5574-5593，09 5684-5693，10 5751，11 5764-5785，12 5790-5793，13 5796，14 5811-5813
- brand：01 2386-2501，02 2560-2562，03 2585-2596，04 4424-4574
- icon：01 为空落点

## 等价证据

比对对象是构建后 `packages/ui-react/dist/index.js` 导出的 `tcrnComponentCss`，迁移前后各取一份：

- 规范化规则序列（选择器列表拆成单个选择器，保留 at-rule 上下文，去掉空白与注释）974 = 974 条，逐条相同；用 Chromium CSSOM 重新解析两份字符串，974 = 974 条单选择器条目，逐条相同。
- 注释 79 = 79 条，顺序相同；page-template.tsx 依赖的三处注释标记各出现一次，顺序不变。
- 字节 124578 → 126188（UTF-8），差异只在拆开的 10 条选择器列表与 3 个 at-rule 块；同一套模块不做拆分时，构建结果与迁移前逐字节相同（sha256 f8200e9b9b0cce4b4ac642620030e252dfde7d65a994639d49f12241e135ac4b）。
- 仓内 36 个读 `tcrnComponentCss` 的测试与脚本里，1142 个含 tcrn 类的正则与字符串字面量对前后两份样式表的命中结果没有变化。

检查脚本与输出不入仓，路径见 W1-B 交回消息。

## 局部门（包树根执行）

typecheck、build、css-template-integrity、stamp-whitelist、shell-fidelity、token-extension、component-modifier、selection-grammar、`--filter @tcrn/ui-react test`（109/109）全绿；verify 影响表第 4 行要求的 dist-hygiene 自查通过（220 个产物都有源文件）。没有写回执。

## 交回 W1-C

### INIT-015 R1 · W1-C 交回说明（SUB-004 → SUB-005）

两张 Subtask 都已完成，没有接续点。本文只记录后续包需要对齐的事实，以及本包文件集以外需要的改动。

## 给 SUB-006（token 字族链接）

- `@font-face` 的族名固定为 `"Hanken Grotesk"`、`"Source Serif 4"`、`"IBM Plex Mono"`、`"Noto Sans SC"`、`"Noto Serif SC"`。token 字族栈要逐字使用这些名字，121-GWT2 与 GWT5 才对得上；不要用 fontsource 的 `… Variable` 后缀名。
- 字重范围：Hanken Grotesk 100–900；Source Serif 4 200–900，另有 opsz 8–60，浏览器按字号自动选光学尺寸；IBM Plex Mono 只有 400 与 500；Noto Sans SC 100–900；Noto Serif SC 200–900。全部为 normal，没有 italic。
- 样式表入口是 `@tcrn/ui-tokens/fonts.css`（文件在 `packages/ui-tokens/fonts/fonts.css`，已列入 sideEffects）。`src/tokens.css` 没有 @import 它。Story 正文说「随 tokens.css 导出」：若要 tokens.css 自带字体，在 tokens.css 顶部加 `@import "../fonts/fonts.css";`。这是 SUB-006 的文件，由 SUB-006 定。
- 名字里带 distributable 的栈不能出现专有字体，fonts-proof 的 proprietary 检查继续生效。

## 给 SUB-007 与 storybook、样板页（121-GWT5）

- 页面要加载 fonts.css，`document.fonts.check` 对「季度复盘」与 Noto Serif SC 才会为真。「季度复盘」已固定计入产品用字，Noto Serif SC 的分片覆盖这四个字。
- 打包工具把 woff2 复制进 storybook-static 或 dist 时，副本必须与随包文件逐字节相同；fonts-proof 允许这种副本。改名可以，改内容不行。不要把字体内联成 data: URI，build-output 检查会判红。

## 给集成与批末

- 产品用字的取值规则（新增文案的包请对照）：扫描 `packages/*/src`、`apps/storybook/src`，以及存在时的 `docs/design/gplus-2026-10/contract/**/*.json`。取 zh-CN 键下的字符串，加上不在任何语言键下、且不含假名与谚文的字符串；en、ja、ko、fr 键下的字符串不计；`*.test.*`、`*.spec.*` 与 test 目录不计。另外固定加上「季度复盘」。
- 合并后跑 `node scripts/fonts-vendor.mjs --check`。报 selection would add，或 fonts-proof 的 coverage 判红时，跑 `pnpm fonts:vendor` 再提交 `packages/ui-tokens/fonts`。
- fonts-proof 需要先构建：proprietary 检查读 `packages/ui-tokens/dist/index.js`，build-output 检查没有任何 `packages/*/dist` 时判红。verify 里 tokens:proof 排在 pnpm build 之后，满足这个前提。
- 可复用的接口：`scripts/fonts-proof.mjs` 导出 `runFontsProof({ root, tokens })`；`scripts/fonts-vendor.mjs` 导出 `FAMILIES`、`collectProductCodepoints(root)`、`planVendor(root)`、`checkVendor(root)`、`renderFontsCss(manifest)`。

## 本包文件集以外需要的改动

1. `packages/ui-tokens/README.md`：补 `@import "@tcrn/ui-tokens/fonts.css"` 的用法，并指向 FONT-LICENSES.md。建议由 SUB-006 或 SUB-043 补。
2. `CHANGELOG.md`：第 346–348 行是旧版本的历史条目（当时写的是不随包字体），保持原样；4.0.0 条目要写明随包字体与 OFL 文本（SUB-043）。
3. `src/tokens.css` 是否 @import fonts.css（见上，SUB-006）。
4. pack:smoke 回执里 @tcrn/ui-tokens 的体积会变大（本包实测打包产物 3,365,238 字节），回执由 W8-A 提交。

## 交回 W2-D

### 交回说明 · W2-D（SUB-016 → SUB-017）

两张 Subtask 都已完成，没有接续点。问题清单在 `runs/r1/problems/W2-D.md`。

## 已交付

- SUB-016：`styles/actions.css.ts` 引入生成段 `actionsPairsCss`（拼在 actionsCss03 开头）。家族基础规则（actionsCss02，`.tcrn-button, .tcrn-link-button`）只读 `--tcrn-pair-fill|ink|edge|weight`，不声明任何 pair 变量；几何逐值取 token：`--tcrn-control-height-sm|md|lg`、`--tcrn-control-padding-sm|md|lg`、`--tcrn-type-size-control-sm|control|control-lg`、`--tcrn-radius-control`；`border: 0`，边与焦点环都在 box-shadow 的 edge 对里。删除了 press-scale 与全部 transform、旧的 hover color-mix、夜间 primary 规则和 opacity 0.64 的禁用样式（press-scale token 的定义在 ui-tokens，未动）。Button 新增 `size="lg"` 与 `loading`（aria-busy、loader 图标、忽略按下；忙碌文案由调用方作为 children 传入，包内不写任何语言的文字）。文字 children 包在 `tcrn-button__label` 里单行省略，按钮带同文 title（调用方的 title 或禁用原因优先）。IconButton 正方形取控件高，图标随尺寸 14 / 16 / 20，loading 时 loader 取代图标。LinkButton 加 `size`，同样有 label 与 title。强制色回退：`.tcrn-button:focus-visible, .tcrn-link-button:focus-visible { outline: 2px solid transparent; outline-offset: 2px }`。
- SUB-017：新件 `components/ButtonGroup/`（`ButtonGroup`，props：必填 `ariaLabel`、`variant: "secondary" | "quiet"`、children），`role="group"`，相邻成员之间自动插 `<span class="tcrn-button-group__separator" aria-hidden="true">`；单选由成员自己的 `aria-pressed` 表达。样式：组画共用轮廓并 `isolation: isolate`，成员清掉七态 edge（focus 只留焦点环）、内角归零、非首个成员 1px 左外距；`:where(.tcrn-button-group) > .tcrn-button:where(:focus-visible,[data-tcrn-preview-state="focus"]) { z-index: 1 }`，特异性 (0,1,0)；组内没有任何 overflow 或 clip。`index.tsx` 已导出并写进 componentLibraryPublicComponentNames。ClipboardCopyButton：copied → ok、failed → bad、unsupported → ink-3，只换 ink（d/h/a/f 四态同值），fill 与 edge 不动；loader 在五态里都渲染、只在 aria-busy 时显示；不再接受 `loading` prop。静态桥从 `tcrn-button__label` 读写标签（仍兼容直接文本节点），并让同文 title 跟随标签、destroy 时还原。

## 集外改动需求

### base 段（W2 冻结，交 W3-D：SUB-018 / SUB-021）

主题切换钮、侧栏切换钮、移动导航钮都是 IconButton，带 `.tcrn-button`，所以下面几条 base 规则与状态对机制冲突：

1. baseCss03：`.tcrn-shell-theme-toggle:active { transform: scale(var(--tcrn-motion-press-scale)) }`（与 nav-item、locale trigger、table-toolbar 同一列表）。按下主题钮时按钮被缩放，违反 125-GWT5。改法：从列表删掉 `.tcrn-shell-theme-toggle:active`；baseCss27 减弱动效里的对应项一并删。
2. baseCss05：`.tcrn-shell-theme-toggle, .tcrn-button.tcrn-shell-theme-toggle { …; border-radius: var(--tcrn-radius-pill); box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08); 36px … }`。它在生成段之后、特异性 (0,2,0)，其 box-shadow 顶掉 `var(--tcrn-pair-edge)`，主题钮因此没有焦点环、也没有 edge 对。改法：删掉 box-shadow（或改由 pair 变量表达）；36px 与胶囊圆角是否保留由设计定。
3. baseCss05：`.tcrn-shell-theme-toggle:hover, .tcrn-shell-side-nav-toggle:hover, …locale-menu__trigger… { border-color; background: color-mix(…); color; box-shadow }`。在 hover 上直接写颜色，(0,2,0) 压过状态对。改法：从该规则删掉两个切换钮的选择器（locale trigger 不是按钮，可保留）。
4. baseCss05：`.tcrn-product-shell .tcrn-shell-theme-toggle:focus-visible, .tcrn-product-shell .tcrn-shell-side-nav-toggle:focus-visible, … { box-shadow: none }`。现在焦点环就是 box-shadow，这条把它擦掉。改法：删掉两个切换钮的选择器。
5. baseCss08：`.tcrn-product-shell :focus-visible:not(.tcrn-search-input__control) { outline: 3px solid var(--tcrn-color-focus-ring); outline-offset: 2px; box-shadow: none }`，特异性 (0,3,0)。产品壳里所有获焦按钮的 edge 对与焦点环都被清掉，换成 3px outline；ButtonGroup 在壳内也失去组内焦点环。改法：在 `:not()` 里排除 `.tcrn-button, .tcrn-link-button`（或整体改用 G+ 焦点环）。
6. baseCss06：`.tcrn-shell-side-nav-toggle { inline-size/block-size/min-*: 38px; display: inline-grid; …; color }` 与 `.tcrn-shell-mobile-nav-toggle { color }`、baseCss23 的 `min-height`。color 在基础规则之后同特异性，侧栏钮与移动导航钮的字色因此不跟随 ink 对；38px 也与 IconButton md 32 不一致。改法：去掉 color；尺寸由设计定。

### Navigation.test（交 SUB-018 / SUB-021）

- `Navigation.test.tsx:603` 断言夜间 primary 规则 `color: var(--tcrn-color-surface-canvas)`。规则已删（夜间由主题 token 与状态对处理），这条转红。改法：改为断言 primary 的变体声明读 `--tcrn-color-on-acc`，且样式里不再有 `[data-tcrn-theme="dark"] .tcrn-button--primary`。本包未跑 Navigation.test（不在局部门）。

### 其它集外

- `scripts/storybook-smoke.mjs:984` 的标记 `.tcrn-link-button:active` 已不存在（P6）。
- `apps/storybook/src/build/foundation-visual-standards.ts:207` 静态构件描述（P13）。
- `docs/verification/internal-alpha/component-api-manifest.json` 回执由 SUB-046 重生成（P1、P2）。

## 给后续包

- 矩阵与样板 story（actions-matrix、actions-sample-project）：hover / active / focus 格用 `data-tcrn-preview-state`；selected 用 `aria-pressed="true"`；disabled 用 `disabled`（可带 `disabledReason`）；loading 用 `loading` 并按 story 语言传忙碌文案（拆分问题清单 P22）；组用 `<ButtonGroup ariaLabel=…>`，quiet 组加 `variant="quiet"`。
- SUB-018 的复制图标与其余状态图标见 P12。
- SUB-035 量组内焦点环时，成员抬升依赖基础规则的 `position: relative` 与组的 `isolation: isolate`。
- 本包没有写回执；跑过 component-api-manifest `--check`（只比对，不写）。

## 交回 W2-E

### 交回说明 · W2-E（SUB-019 → SUB-020）

两张 Subtask 都已完成，没有接续点。问题清单在 `runs/r1/problems/W2-E.md`。

## 已交付

- SUB-019（697d4eb）：Input、Textarea、NumberInput、DatePicker、SuggestInput（`.tcrn-input`）与 Select、MultiSelect 触发器（`.tcrn-select`）共用 `inputsTextPairsCss`。基础规则只读 `--tcrn-pair-fill|ink|edge`，`border: 0`，边是 inset box-shadow；高 `--tcrn-control-height-md`、圆角 `--tcrn-radius-control`、内距 `--tcrn-space-2h`、字号 `--tcrn-type-size-control`、过渡 `--tcrn-motion-duration-fill` 与 `--tcrn-motion-ease`；占位 ink-3。DatePicker 加上 `tcrn-input` 类，原生指示器透明并拉满末端 30px（仍是原生点击目标，没有脚本 showPicker）；NumberInput 隐藏 spin；MultiSelect 三种呈现逻辑不变，原生列表高度自适应，dropdown 触发器读 Select 对、摘要单行截断加 title（禁用时只留原因作 title，`multi-select-dropdown.ts` 的 sync 同步），caret 用 Icon `size="sm"`、ink-3，选中行 wash 加 600，hover 用 hover token。`resolveFieldValueControl` 未动。
- SUB-020（0daff9d）：Checkbox 与 Radio 16px、appearance none，读 `inputsCheckPairsCss` 的 fill、edge、mark（勾为 `::after` 边框，半选为横杠，单选点为 5px inset 环，无 data: URI）；Switch 34×20 轨、16 钮、行程 14，读 `inputsSwitchPairsCss` 的 fill、edge、knob、knob-edge，开态钮 on-acc（夜间深色钮），去掉了禁用 opacity。SearchInput 改为工具形态：控件即盒，读 `.tcrn-input.tcrn-search-input__control` 的 search 对（wash 无边、hover line-2、focus 纸底加环），占位 ink-2；图标与快捷键绝对定位在控件上，快捷键按画板改为 mono 10px、ink-3、line-2 边。外壳上下文规则（inputsCss01）改为包裹层不画任何东西。`.tcrn-field:focus-within` 整块洗底已去掉（含 forced-colors 块里的同名选择器），Field 其余外观不动。
- 每个 box-shadow 环都带透明 outline 作 forced-colors 回退（P12）；forced-colors 下文本控件恢复 1px 边框，勾选类与开关恢复系统绘制。reduced-motion 下开关钮瞬移、保留换色，单选点瞬时。
- 生成段拼接位置：`inputsTextPairsCss` 接在 inputsCss05（文本控件基础规则之后），勾选与开关两段接在 inputsCss06（勾选、单选、开关基础规则之后）。未新增 `inputsCssNN` 导出，未改 `styles/index.ts` 与生成物。

## 集外改动需求（交 W3-D）

1. base 段 `.tcrn-product-shell :focus-visible:not(.tcrn-search-input__control)`（base.css.ts 约第 213 行）：外壳内会抹掉所有对表驱动控件的边与环（`box-shadow: none`）并画旧 3px outline。建议排除表扩到 `.tcrn-input, .tcrn-select, .tcrn-checkbox, .tcrn-radio-group__control, .tcrn-switch__control`（Actions 的按钮同理），或改成只作用于未接入对表的元素。
2. Navigation.test.tsx 第 440、441、597–602 行的搜索框断言按工具形态改写（逐条见问题清单 P1）。
3. apps/storybook/src/smoke.test.ts 第 815、819 行删除或反转（P2）。
4. Select 的 chevron 与 DatePicker 的 calendar 图标：两者都要包裹层加 Icon（画板 `.sw>.chev`），图标放在末端 30px 内、`pointer-events: none`，DatePicker 的透明指示器已经覆盖该区域；包裹后 base 段 `.tcrn-settings-layout__form .tcrn-setting-row__control>:is(.tcrn-input,.tcrn-select,…)` 的直接子选择器要相应调整。Select 加上图标后再设 `appearance: none` 与右内距 30px。
5. 可顺手：删 inputsCss04 里已无作用的包裹层 transition；文档站 `alpha-styles.ts` 第 1231 行的 `.tcrn-checkbox` accent-color（P13）。

## 局部门（包树根执行）

typecheck、`--filter @tcrn/ui-react build`、`node --test packages/ui-react/dist/components/Form/Form.test.js`（21/21，新增 8 条：对表目标、基础规则只读生效对、GWT1 与 GWT2、number/date/占位/集合细节、勾选与单选、开关、GWT3 搜索、Field 与 forced-colors）、`css-template-integrity-proof` 全过。没有写回执。门之外另用 Chromium 对构建产物做了一次计算样式核对（浅色与夜间，脚本不入仓）：默认边、hover ink-2、focus acc 环、invalid 加 focus 的红边红环、搜索 wash 与 ink-2 占位、勾选与开关尺寸及夜间深色钮都与画板一致；日期指示器与 spin 规则被 Chromium 解析保留。

## 交回 W2-F

### 交回说明 · W2-F（SUB-022 → SUB-023）

## 已交付

- SUB-022（ccb7bea）：`Navigation.tsx` 品牌段与 `styles/brand.css.ts`。
  - `TcrnBrandMark` 新增 `productId`（`tms | einzbern | mana-orchestrate | design-system`）与 `variant`（`color | mono | tile-tint | tile-deep`）：有 productId 时内联绘制 `product-marks.generated.ts` 的 SVG（`svg.tcrn-brand-mark`，`data-product-mark`、`data-product-mark-variant`，mono 用 currentColor，淡底贴片为 tint 底加彩色标，深底贴片为 deep 底加白色标）；无 productId 时仍是母标 img，属性不变。
  - 新的小写导出：`tcrnProductMarkIds`、`tcrnProductMarkVariants`、`tcrnProductMarkSvg(productId, variant?, { ink?, size? })`（独立 SVG 文件文本；color 与给定 monoInk 的 mono 与 logos2 逐字节相同）；类型 `TcrnProductMarkId`、`TcrnProductMarkVariant`、`TcrnProductMarkSvgOptions`。
  - `tcrnProductLogoRegistry`：workflow 改为 einzbern，新增 mana-orchestrate；四个有标产品的名称、字标字族、五语标语取自生成物；新增字段 `markId`、`wordmark`（sans/serif）、`byline`；衬线产品 `lineOneSuffix`、`suffixClassName` 为 null；aos 注册项保持。`ProductLogo`、`ProductLockup`、`ShellBrandLockup` 新增 `markVariant`；衬线产品渲染 `tcrn-product-logo--serif` 与 `tcrn-product-logo__byline`（by TCRN）。
  - 品牌段：渐变后缀删除；TCRN 与无 productId 后缀为 ink；TMS、Design System 后缀读 `--tcrn-brand-suffix-tms|design-system`；AOS 后缀不变；标尺寸按容器分层（ProductLogo 38、ProductLockup 28、产品壳侧栏 22，关于页 56 由消费方覆写变量）；标去掉尺寸与滤镜过渡；产品壳收起态文案 `display: none`；侧栏隐藏 byline。没有新增段导出，段位置不变。
- SUB-023（1def73f）：
  - `ai-consumption-contract.ts`：`productLogoRegistry` 发布五个产品及新字段；新增 `productMarkSources`（八个文件的路径、字节数、sha256 字面值）；`brandSurfaceDisposition` 改写为 G+ 规则。
  - `brand-asset-source-proof.mjs`（输出 schema v2）：母标部分原样（含联网核对）；新增八文件 digest 与登记比对、包的 file export 与渲染出的 TcrnBrandMark 和文件字节比对（mono 以 currentColor 替换 monoInk 后比对）、贴片对照 marks.json 的 tile。需先 build。
  - `token-extension-proof.mjs`：EXTENSION_TOKENS 只留 motion 两项与 aos accent；停用表 RETIRED_EXTENSION_TOKENS（secondary-readable、accent-tms、accent-workflow、accent-design-system-1..4）容许定义、读取即红；LOCAL_VARS 登记五个品牌层级变量 `--tcrn-brand-line-one-size|height|base-weight`、`--tcrn-brand-line-two-size|height`。
  - `Navigation.test.tsx`：品牌注册、标语（逐字对照 STORY-127）、GWT1、四种 rendition 字节、母标回退与品牌 CSS 规则。

## 八个文件 digest（契约登记 = 本地重算，brand-asset 门通过）

| 文件 | 字节 | sha256 |
| --- | --- | --- |
| tms.svg | 357 | 5bc00be377752865055228d65306c6474a8506f9deae9e94a57f1f5a9f514eab |
| tms-mono.svg | 357 | 3499dd42780ea17447420110f819fd1c0261b8269828776ea43305353bcb132c |
| einzbern.svg | 358 | 8cc4e309c9d71175f507a0024d7218d5aa03787b80237c3ccfd58bbc7332f0d7 |
| einzbern-mono.svg | 358 | ea55dde0d50080c2f4e64e743cffa60b202bcb7d6cf55faac1034f26256c8425 |
| mana.svg | 328 | debfe48dd2773728d64f847f5454d6d6071a7ba074326e7da7a63703ec750296 |
| mana-mono.svg | 328 | 7a645886fbe626ae4980c65b975a1dea29a10e10836f8a0f3484dca9734811a9 |
| ds.svg | 392 | 03b1f776e9d8ba899976f09a32e9206b0ce4960d7d6d1788eb50a4a4801f6cdc |
| ds-mono.svg | 392 | 19eafbd0497f764132c90bf4fbe4db34a8b7a4046ad7aa49b464a2b1f71c06ce |

反向验证（已还原）：mana-mono.svg 改一个字节，门报 digest 不符与两处字节不符并退出 1；dist 中 TMS 标改一个色值，门报 file export 与渲染字节不符并退出 1。母标 TCRN 文件未动，远端 200、digest 一致。

## 集外改动需求

1. `packages/ui-react/src/styles/base.css.ts`（W3-D）：删除停用的品牌 token 定义（第 14、16–21、24、26–31 行）；删后从 token-extension 停用表移除对应项。
2. `apps/storybook/src/smoke.test.ts:1432`：改为 `/TCRN stays in ink at medium weight/`。
3. `scripts/storybook-smoke.mjs:1242` TMS zh 期望改「艺人管理系统」；`storybook-smoke.mjs:3103/3353` 与 `scripts/internal-alpha-browser-proof.mjs:1318` 的文档壳标语判据由「组件库」改「设计系统」。
4. `apps/storybook/src/build/locales/storybook-content-text.ts:743–747`：补「Design System」「Project memory engine」「Project memory assistant」五语条目，更新 TMS 条目（zh 艺人管理系统、ko 탤런트 관리 시스템）。
5. `scripts/shell-parity-proof.mjs:811`：登记品牌资产规则同时接受 `svg[data-product-mark]`。
6. `scripts/geometry-proof.mjs:441`：品牌变异需能穿过 `display: none`，或改测侧栏标恒为 22。
7. `scripts/lib/locale-invariant-ledger.mjs`：若有 story 渲染 Einzbern、Mana Orchestrate 锁定块，登记机器词「by TCRN」。
8. `scripts/contract-generate.mjs`（下次改契约时）：输出 marks.json 的 tile 与 monoInk，组件改读生成物。
9. `packages/ui-react/src/index.tsx`（W2-D）：可把 `tcrnProductMarkSvg`、`tcrnProductMarkIds`、`tcrnProductMarkVariants` 加进 `componentLibraryPublicUtilityNames`（index.test 不强制小写导出入名册）。
10. `apps/storybook/src/contract-stories/story-content.tsx`：类型检查未因注册项改名报错，本包未改；W3-C 的 brand-sample-product 可直接用 `ProductLogo productId="tms" | "einzbern" | "mana-orchestrate" | "design-system"`。

## 未做完

无接续点。127-GWT4 的 52px 收起宽随 P1 待 Owner，夜间后缀色随 P15 待 Owner（问题清单 #8、#9）。

## 交回 W3-A

### 交回说明 · W3-A（SUB-002 → SUB-003）

两张 Subtask 都已完成，没有接续点。问题与待判定口径见 `runs/r1/problems/W3-A.md`。

## 已交付

- SUB-002：`scripts/token-contrast-proof.mjs` 已按 C1 重写，测试为 `tests/token-contrast-proof.test.mjs`。verify 影响表第 6d 行（tokens:proof › token-contrast-proof）在本包树上转绿。
- SUB-003：新增 `scripts/token-deprecation-notice.mjs` 与测试 `tests/token-deprecation-notice.test.mjs`。`apps/storybook/src/build.tsx` 在静态构建写完后调用一次通知脚本，不阻断构建（影响表第 3 行）。

## 对比度门（给 C5、contract、DOM 层各门）

- 取值只走 `createResolvedTokenMap(theme)`，脚本里没有任何颜色字面量，测试会检查这一点。rgba 色先按承载面合成再算比值，用的是画板 `tools/lib.mjs` 的 `cr`，所以打印的比值与画板一致。
- 阈值 `C1`：text 与 wordmark 4.5，edge 与 focus 3。图标用 currentColor，文字对已经覆盖了图标。
- 对表 `CONTRAST_PAIRS` 分两组。第一组是 GWT2 要求的：ink、ink-2、ink-3 于 panel 与 bg，on-acc 于 acc，line-ctl 于 panel 与 bg。第二组是旧门原有的对，换成 G+ 名：acc 于 panel 与 bg；red 于 panel，以及 red 于 red-bg 叠在 panel 上；ok、bad、warn 于 panel，以及各自叠在洗色上。焦点环的对从 `--tcrn-focus-ring` 的声明读出：环色对间隙色，环色对 panel。
- 失败按「前景 on 承载面 (主题)」点名，例如 `ink-3 on panel (light)`；焦点环与字标的名字前缀分别是 `focus ring `、`wordmark `。
- 哪些品牌后缀算字标文字，按契约判定：marks.json 里带 `suffix` 的标（tms、design-system）才算。einzbern 与 mana-orchestrate 的字标没有后缀，门会输出说明行，不会静默跳过。
- `WORDMARK_EXEMPTIONS` 逐条登记了 4 条豁免：design-system 浅色于 panel 与 bg，tms 夜间于 panel 与 bg。每条都引用 TCRN-DS-MIN-20261011-GPLUS-RENEWAL D2 与 V2-B1-Brand 板 F 段，tms 两条另标「夜间值待 Owner」（拆分 P15）。以下情况都会判红：豁免指向非字标对，缺裁定引用，所指的对已经达标（stale），或者找不到对应的对。
- 导出 `runTokenContrastProof({ tokens, exemptions, resolve, wordmarkContract })`，返回 `{ ok, results, failures, notes, exemptions, lowest }`。另有 `formatReport`、`focusRingPairs`、`wordmarkSuffixPairs`、`pairLabel`。

## 弃用通知

- 用法：`node scripts/token-deprecation-notice.mjs [--label <名>] <文件或目录>...`。每个在用的旧名打印一行，措辞来自包的 `formatDeprecatedTokenNotices`，例如 `deprecated token <旧> (n uses): use <新> [文件]`；设置了旧名的地方另加 note。退出码恒为 0，只有路径不存在或缺参数时为 2。
- 旧名表读 `@tcrn/ui-tokens` dist 的 `tcrnDeprecatedTokenAliases`，无后继的名字来自 `tcrnDeprecatedTokens`。带 `tcrn-token-block` 标记的块，以及照抄的 `--旧: var(--新)` 声明，都不算使用。
- 导出 `runDeprecationNotice({ paths, label })`、`scanDeprecatedTokenUses(source, { stylesheet })`、`deprecatedTokenTable()`。
- storybook 构建扫描 `apps/storybook/src` 与 `.storybook`。现在打印 32 个旧名（P7）。脚本缺失或异常时只打印警告。

## 本包门结果（包树根执行）

`--filter @tcrn/ui-tokens build`、`token-contrast-proof`（最低文字比 4.59，ink-3 于 panel 夜间；最低边或焦点环比 3.06，line-ctl 于 bg 浅色；4 条豁免生效）、`node --test tests/token-contrast-proof.test.mjs`（10/10）、`node --test tests/token-deprecation-notice.test.mjs`（5/5）、`run storybook:build` 均通过。storybook 构建前先构建了 ui-copy-state 与 ui-react。

## 集外改动需求

1. 根 `package.json` 的 `tokens:proof` 接入两份新测试（P3）。
2. `packages/ui-tokens`：`findDeprecatedTokenUsages` 与脚本的定义判定口径对齐，或者提供 bin 入口；README 写明两种调用方式（P6，SUB-043 与 EPIC-043）。
3. 字标承载面是否只算 panel，由验收判定（P4）；tms 夜间值待 Owner 裁定（P5）。
