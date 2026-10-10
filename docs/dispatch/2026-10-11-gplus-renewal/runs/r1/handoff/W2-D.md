# 交回说明 · W2-D（SUB-016 → SUB-017）

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
