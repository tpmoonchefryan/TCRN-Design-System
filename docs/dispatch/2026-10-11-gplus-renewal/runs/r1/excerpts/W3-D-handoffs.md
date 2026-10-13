# 摘录附件 · W3-D：上游包交回说明（W2-D、W2-E、W2-F、W3-B）

只读与本包有关的条目：base 段规则、Navigation.test 断言、Clipboard 与 DatePicker 图标、停用的 accent 定义、shell-fidelity 的 .tcrn-icon 重复。


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

## 交回 W3-B

### 交回说明 · W3-B（SUB-025 → SUB-026）

两张 Subtask 都已完成，没有接续点。本文写给 W3-C（标记侧）和批末集成。问题与风险见 `runs/r1/problems/W3-B.md`。

## CSS 侧现状

- `doc-class-map.json` 的 171 个类在 `storybook.css`、`story-demo-styles.ts`、`alpha-styles.ts` 里已经没有任何定义。doc-shell-class-proof 的 `--details` 里，剩下每个类的 `definedIn` 都为空，`sourceKinds` 只剩 class-context、markup、script-selector。
- rename-tcrn-doc 86 个：CSS 里统一改为 `tcrn-doc-` + 原名去掉 `tcrn-`，与 map 的 `target` 逐条一致，没有例外。规则内容不变。
- delete-package-provided 38 个、delete-demo 32 个、delete-dead 15 个：CSS 规则已删。选择器列表里只有一部分选择器含被删类的，只删那几个选择器，留下的部分照旧。
- 只服务被删规则的三个 `@keyframes`（`tcrn-motion-spin`、`tcrn-motion-progress`、`tcrn-motion-shimmer`）一并删了。`tcrn-motion-travel` 还在，给 `tcrn-doc-motion-demo*` 用。
- `alpha-styles.ts` 里的 `.tcrn-checkbox { accent-color }` 覆写也删了（W2-E P13）。这个类不在 map 里，是包类。
- `story-demo-styles.ts` 没有清空：还剩 `tcrn-doc-*` 骨架和 `.alpha-*`。所以 demo-styles-sync 不退役，`tokens:proof` 链不变，`--check` 是绿的。selection-grammar 和 shell-fidelity 读的三个文档源文件都还在，源列表不用改。

## W3-C 要在标记侧做的

1. 按 map 改标记：rename 类改成 `target`，三类 delete 按 map 的 `reason` 处理（删类，或改用包组件渲染）。点名这些类的门和测试按各条的 `references` 在同一提交里改：`apps/storybook/src/smoke.test.ts`、`scripts/shell-parity-proof.mjs`、`scripts/storybook-smoke.mjs`、`scripts/s254-story-dom-proof.mjs`、`scripts/internal-alpha-browser-proof.mjs`。`scripts/shell-fidelity-proof.mjs` 里点名的类本包已经改了。
2. `page-template.tsx` 里有 15 个模板类现在没有定义，INC-010 子检查因此报 `DOC_SHELL_CLASS_UNDEFINED`：`tcrn-component-reference`（含 `__empty`、`__facet`、`__intro`、`__meta`）、`tcrn-reference-table`、`tcrn-reference-table-scroll`、`tcrn-static-section`（含 `--category-index`）、`tcrn-story-disclosure`（含 `__chevron`、`__chevron-svg`、`__heading`、`__title`），以及要删掉的 `tcrn-search-input--compact`。前 14 个改成 `tcrn-doc-` 名后就有定义了。
3. **知识库壳的结构依赖。** `tcrn-knowledge-shell__topbar` 和 `__sidebar` 按 map 删掉了，它们原来的规则（`min-height: 68px`、去边框、换底色、内距、`gap: 0 !important` 等）是在改包 TopBar/SideNav 的外观。布局里只保留了摆放：`.tcrn-doc-knowledge-shell-layout > .tcrn-top-bar { grid-area: topbar; }` 和 `.tcrn-doc-knowledge-shell-layout > .tcrn-side-nav { grid-area: sidebar; }`。所以 TopBar 和 SideNav 必须仍是布局元素的直接子元素（现在 `storybook-shell-demos.tsx` 就是这样）。shell-parity 里用 `.tcrn-knowledge-shell__topbar`、`__sidebar` 定位的地方，要换成上面这两个选择器或 data 属性。测量值可能因此变化，见问题清单 P4。
4. 被删的 `tcrn-shell-demo__topbar`、`tcrn-bookmark-nav`、`tcrn-knowledge-shell__brand-slot`、`tcrn-knowledge-shell__pager-icon` 这类挂在包组件上的钩子删掉以后，组件按包的默认外观渲染。不要在 tsx 里用 style 补回去；确实需要布局，写进 W3-C 的 handoff，交回 W3-B 的文件所有者处理（只在 `tcrn-doc-*` 容器下做摆放）。

## 本包改过的集外相关文件

`package.json`：`doc-shell:proof` 改成 `node --test tests/doc-shell-class-proof.test.mjs && node scripts/doc-shell-class-proof.mjs`（W1-D handoff 的建议，测试 13/13 通过）。它在本包文件集内，单独一个提交。
