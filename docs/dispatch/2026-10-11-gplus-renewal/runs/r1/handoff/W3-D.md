# 交回说明 · W3-D（SUB-018 → SUB-021）

两张 Subtask 与主线程追加的四条都已完成，没有接续点。问题清单在 `runs/r1/problems/W3-D.md`。开工前已快进合入集成分支 d95ccd2（含 W2-B）。

## 已交付

- SUB-018（385ee0a）：ClipboardCopyButton 在 loader 之后渲染四枚状态图标（idle copy、copied check、failed alert-triangle、unsupported info，`data-clipboard-state-icon`），样式在 `icon.css.ts` 里按 `data-clipboard-copy-state` 只显示当前一枚，copying 一枚都不显示（由 loader 顶替）；盒子与 loader 同为 13px（lg 15px）。静态桥逻辑不变（它本来就切这个属性），注释写明了构件内容。base 段：主题钮移出按压缩放列表（baseCss03、baseCss27）与减弱动效过渡列表（baseCss25）；主题钮规则去掉阴影与过渡，侧栏钮去掉过渡；hover 与壳内 focus 规则里删掉两个切换钮；侧栏钮与移动导航钮去掉 color。壳内焦点规则（baseCss08）改为：排除 `.tcrn-button, .tcrn-link-button, .tcrn-link, .tcrn-input, .tcrn-select, .tcrn-checkbox, .tcrn-radio-group__control, .tcrn-switch__control`，其余元素画 `box-shadow: var(--tcrn-focus-ring)` 加 `outline: 2px solid transparent` 回退（W2-D 第 5 条、W2-E 第 1 条、主线程第 4 条同一处）。Navigation.test：primary 读 on-acc 且无夜间 primary 规则（原 603 行一带）；三个切换钮不写颜色、阴影、过渡、hover、focus、按下规则；壳内焦点规则按新写法断言；`.tcrn-highlight__mark`（主线程第 1 条）；选中导航项的断言改为只读该规则本身（原写法靠 `[\s\S]*` 跨到后面的 `box-shadow: none`，那条规则改掉后转红）。
- SUB-018（f94b1be）：`.tcrn-icon` 基类进包，写在 `styles/icon.css.ts` 的 iconCss01 开头：inline-block、flex none、vertical-align middle、fill none、stroke 与 color 为 currentColor、stroke-width 插值读生成物 `tcrnIconStrokeWidth`（1.25）、round 线头与拐角、子图形 `vector-effect: non-scaling-stroke`，无 width/height 属性时零特异性取 `--tcrn-icon-size-md`。文档层：`story-demo-styles.ts` 删基础规则并跑 `demo-styles:sync` 同步 `storybook.css`；样例与 `.tcrn-doc-*` 容器下的三条摆放改为以 `svg[data-icon-name]` 为主体（`.tcrn-doc-icon-sample`、disclosure chevron 两条、收起侧栏的 section icon），所以 shell-fidelity 的重复检查为 0，`.tcrn-icon` 没进白名单，`shell-fidelity-proof.mjs` 未改。`docs/style-scale.md` 的 Deferred primitive 条目改为「已进包」。
- SUB-021（715533d）：Select 与 DatePicker 外包 `span.tcrn-select-wrap` / `span.tcrn-date-picker-wrap`，内放 Icon `chevron-down` / `calendar`（sm 14，ink-3，`pointer-events: none`，居中于末端 30px，无 transform）；包裹内的 select 设 `appearance: none`、右内距 30px、单行省略，裸 select 保留原生箭头。base 段 settings 直接子规则与 inputs 段 setting-choice 规则加上包裹层。删除 inputsCss04 的无效过渡（段保留为空）。主线程第 2 条：删 baseCss30 的 `.tcrn-link` 三条与注释，Typography.test 去掉 todo（转为通过）；第 3 条：`.tcrn-surface__head :is(h2,h3)` 只留 margin，字号改为 `:is(h2,h3):not(.tcrn-heading)`。Navigation.test 搜索框断言按工具形态改写（原 441、597–602 一带）。Form.test：caret 断言改为与属性顺序无关（W2-C 改了 Icon 的属性顺序后它是红的），新增 Select / DatePicker 末端图标用例。
- SUB-021（94d7cdf）：baseCss01 删除停用的品牌 accent 定义（secondary-readable、accent-tms、accent-workflow、accent-design-system-1..4，明暗两块），只留两项 motion 与 aos accent；token-extension-proof 删掉停用表及其检查，此后读这些名字会按「unresolved public token reference」报红。

## 局部门（包树根执行，全绿）

typecheck；`--filter @tcrn/ui-react build`；`--filter @tcrn/ui-react test` 157/157、todo 0；`scripts/shell-fidelity-proof.mjs` no drift；`scripts/token-extension-proof.mjs` ok；`scripts/demo-styles-sync.mjs --check` in sync；另跑 `scripts/css-template-integrity-proof.mjs` findings 0。没有写回执。日志在会话 scratchpad 的 `logs/r1-W3-D-*.log`。

## 集外改动需求

1. `scripts/contract-generate.mjs`：契约链接焦点规则补透明 outline 回退（P6）。
2. `apps/storybook/src/build/page-template.tsx`：`scopeComponentCss` 只在顶层逗号处拆选择器（P7）。
3. `apps/storybook/src/build/foundation-visual-standards.ts:207`：静态复制钮构件描述补 loader 与状态图标（P9，与 W2-D P13 合并处理）。
4. 浏览器门（storybook-smoke、shell-parity、internal-alpha-browser-proof、geometry）留意 Select / DatePicker 的包裹层（P8）。
5. 外壳切换钮尺寸（P1）列给 Owner。

## 未做完

无。
