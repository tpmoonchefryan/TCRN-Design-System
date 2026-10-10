# 交回说明 · W2-E（SUB-019 → SUB-020）

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
