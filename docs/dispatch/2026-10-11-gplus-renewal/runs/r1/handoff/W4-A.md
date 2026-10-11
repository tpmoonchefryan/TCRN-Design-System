# 交回说明 · W4-A（SUB-029 → SUB-030）

## 已交付

- SUB-029：`contract-stories/gplus/matrix-renderer.tsx`（格属性、浅色与夜间两块、分节、状态表、`StaticMarkup` 标记编辑）、`matrix-stories.tsx`（五个矩阵与 23 件组件名册 `gplusMatrixComponents`）、`icon-roster.tsx`（37 件 × 14/16/20）。格数 44/28/10/116/42，全部来自 `gplusMatrices`。
- SUB-030：Components 下新类目 `gplus-matrices`（Family matrices），story id 与 registry 顺序为 typography-matrix、icon-matrix、brand-matrix、actions-matrix、inputs-matrix，排在 documents-and-collaboration-templates-spec 之后；五语标题与说明、类目与样张文案五语、W2-C/W3-C 的图标库文案替换、W2-F 的标语；台账删除 `Lucide React`，新增 properNouns 与 `matrixMachineWords`；Track A 适配文件 typography/icon/brand/actions/inputs.stories.tsx，导出 `Matrix`（Storybook id `typography--matrix` 等）。

## 给 W5（SUB-028、SUB-031、SUB-033、SUB-035）

- 路由：类目页 `components-gplus-matrices.html`，故事锚点 `#<story id>`；类目页上故事默认折叠，测量前把 `article[data-story-collapsed]` 设为 `false`（浏览器证明的做法）。
- 测量钩子：板根 `[data-gplus-matrix="<板>"]`（带 `data-gplus-matrix-cell-count`、`data-gplus-matrix-layout`）；两块 `[data-gplus-matrix-theme="light|night"]`，分别带 `data-tcrn-theme="light|dark"`；分节 `[data-gplus-matrix-component="<组件>"]`；格 `data-cell`、`data-kind`、`data-expect`、禁用格 `data-exempt`，探针 `data-probe` 取 ph、shadow、after-border、after-shadow、before-bg（最后一项是 Switch 的钮，测量库需支持）。
- 注册：样板 story 照 `matrix-stories.tsx` 的 `matrixStory` 写法（`storyGovernanceFor` 加 `sourcePath` 覆盖）。smoke 的 CSF 门按 components → typography → icon → brand → actions → inputs 的顺序拼接 Components 组的适配文件，样板导出放进家族文件后，registry 顺序要与拼接顺序一致；`smoke.test.ts` 的 sourcePath 断言按类目判断，新类目需同步。
- 类目上限 8：`gplus-matrices` 已有 5 个，样板请另开类目（例如 gplus-samples）。
- SUB-035 转绿前须先修问题清单第 1 条（页面 CSS 作用域吃掉状态规则），否则全部状态格偏离。

## 集外改动需求

1. `apps/storybook/src/build/page-template.tsx`：组件 CSS 作用域改写按括号深度切选择器、支持一行多条规则（问题清单 1）。
2. ui-tokens / `styles/base.css.ts`：补 `[data-tcrn-theme="light"]` 主题块（问题清单 2）。
3. `packages/ui-react`：ClipboardCopyButton 预览状态入口、TcrnBrandMark 默认尺寸、Text 的 mono 与 numeral-inline 入参、入口导出 `tcrnIconNewNames`（问题清单 3）。
4. `smoke.test.ts` 的 `/TCRN stays regular weight/` 按 W2-F 交回改写（问题清单 4c，批末处置）。

## 未做完

无接续点。story-budget.mjs 与 navigation.ts 无需改动（高度都在 2000 内，类目 5 个）。
