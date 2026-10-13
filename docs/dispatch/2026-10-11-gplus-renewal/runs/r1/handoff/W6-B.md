# 交回说明 · W6-B（SUB-041 → SUB-042）

两张 Subtask 都已完成，另按纪要 D4 加了许可白名单，没有接续点。问题清单见 `runs/r1/problems/W6-B.md`。

## 已交付

- SUB-041：`storybook-smoke.mjs` 与 `internal-alpha-browser-proof.mjs` 的视觉期望全部改为从 G+ 契约（`docs/design/gplus-2026-10/contract`）和 `@tcrn/ui-tokens` 的解析值推出，没有一项照抄渲染结果。改动包括：控件高与圆角、字重、行高、动效、wash、焦点环（按层匹配，允许过渡未收尾时的微小偏差），搜索框按工具形态校验，类目数 23，矩阵与样板 story 的 sourcePath，标语按 STORY-127，changelog 全量 token 按 MachineToken 的换行契约校验。
- SUB-042：
  - `smoke.test.ts`：Field 不再有 focus-within 洗底；forced-colors 只保留 error 块；画布色断言按 W2-G 第 3 节的写法；品牌断言改为「TCRN stays in ink at medium weight」。
  - `shell-parity-proof.mjs`：字符串来源分类同时接受 `svg[data-product-mark]`。
  - `ds-consumption-proof.mjs`：hidden-overflow 扫描跳过 SVG 图标，并在证据里列出命中的节点。
  - geometry、full-surface 及两个 tests 文件：查过，没有期望常量需要改。
- `package-contract-manifest.mjs`：OFL-1.1 只放行五个 @fontsource 字体包，且每个都必须是根 devDependency（依据纪要 D4）。

## 局部门（包树根执行，日志在 scratchpad/logs/r1-W6-B-*-r3.log）

| 门 | 结果 | 剩余红项 |
| --- | --- | --- |
| build | 通过 | — |
| storybook test | 通过（9/9） | — |
| ds:consumption:proof | 通过 | — |
| storybook:smoke | 红 | 焦点环（P1，依赖 W5-C）；文档壳搜索包裹层作画（P3） |
| internal-alpha | 红 | buttonFeedback（P1，依赖 W5-C）；P3；P7；P8；P9；P10 |
| shell:parity | 红 | P3、P4 |
| geometry:proof | 红 | P5 |
| full-surface:proof | 红 | P6 |
| package-contract-manifest | 通过 | OFL-1.1:5，unknownLicenseGroups 为空；回执已还原 |

## W5-C 合入后需复核的断言

1. storybook:smoke 三个比较器里 themeToggle、sideNavToggle 的 `focus.boxShadow`：应带 2px 间隙环和 4px acc 环。
2. 同上，searchControl 的 `focus.boxShadow`：应先有 inset 1px acc 边，再加焦点环。
3. internal-alpha `buttonFeedbackOk`：primary 的 hover 底色应为 acc-2。

## 集外需要的改动

1. `apps/storybook/src/alpha-styles.ts:317-325`：搜索框包裹层不应再画 panel 底，块高回到控件高（P3）。
2. `apps/storybook/src/build/ai-consumption-contract.ts`：`storybookDocShellVisualOracle.shellMetrics` 里的 searchBorderColor、searchBorderRadiusPx、searchHeightPx 应退役或按 G+ 重写（P3）。
3. `packages/ui-react/src/styles/base.css.ts`：外壳切换钮与语言触发器的尺寸等设计裁定（P2）。
4. `scripts/lib/multi-select-dropdown-proof.mjs`，或 Inputs 家族的 dropdown 触发器：处理 padding-right 10px 对 30px 的差异（P6）。
5. 标题截断的纵向裁切（P7）、text-styles 故事的五语文案（P8）、故事高度豁免表（P9），以及 axe 分诊（P10）。
6. shell:parity 知识库壳样本的侧栏容器与品牌块间距（P4），以及 geometry 搜索浮层与正文的间距（P5）。
