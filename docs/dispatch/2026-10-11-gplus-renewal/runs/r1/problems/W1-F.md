# 问题清单 · W1-F（SUB-034）

只记不修。局部门 47/47 通过；以下是实施中发现、留给后续处置的事项。

| # | 类别 | 事实 | 建议 |
| --- | --- | --- | --- |
| P1 | 现有 story 测出的红（非 G+ 集） | 构建后对 55 个注册表 story 的浅色主题量 story 渲染区域：`navigation-focused-shells-spec` clip 红，`div.tcrn-doc-shell-demo.tcrn-doc-shell-demo--compact`（裁切容器）里 `header.tcrn-top-bar` 及其子元素越界最多 393.2px，共 14 个元素；`selection-list-patterns` overlap 红，`div.tcrn-doc-guidance-grid` 中两个 `div.tcrn-searchable-list` 相交 ox 20 / 25、oy 265，共 2 对。其余 53 个全绿。 | 由 SUB-035 决定这两个 story 是否进门；进门则先修文档演示框或列表最小宽度。不阻塞 G+ 矩阵与样板。 |
| P2 | 文档外壳 | 量整篇 article 时，每个 story 都报 1 处 2px clip：`span.tcrn-doc-story-disclosure__title` 内层 span 比裁切的标题容器大 2px。门改量 `[id="<id>-region"]`（storyBodySelector），不计这一处，但外壳本身的问题还在。 | 文档层（tcrn-doc-* 外壳）复核披露标题的行高与 overflow。 |
| P3 | 钩子缺失 | 现有 story 没有 data-cell / data-expect / data-h / data-shell / data-guide / data-text，contrast、controlHeight、rail 在现仓全部是 n/a。 | 矩阵与样板 story 带上钩子（标记约定见 handoff/W1-F.md）；SUB-035 在 REQUIRED_CHECKS 里按 story 写明必须适用的检查，防止空过。 |
| P4 | 口径差异（有意） | 与画布 measure.js 的差异都写在代码注释里：clip 的祖先查找止于测量根，绝对定位元素只受其包含块及以上裁切，auto/scroll 轴只计起始边；singleLine 直接数行框（按文字片段的竖直中心聚类），不再用高度除以 line-height；shadowBlur 也读 ::before / ::after；rowAlign 读 table.rows 与 ARIA 表格；mark 多比竖向内距、横向边框、字族、字形、词距、行高、display 与 vertical-align；contrast 缺 data-expect 或未知 data-probe 算违例，并按 4.5 / 3 查最低对比（data-exempt 免），有效背景一直合成到 html；overlap 展开 display: contents，不把绝对、固定定位及裁切元素的子树并入包围盒。 | 若画布某块板的数值与本库不一致，记问题后再议，不改签名。 |
| P5 | 读取约束 | `scripts/lib/gplus-measure.mjs` 39 KB，超过 32 KB 读取守卫。 | 按 handoff 的分段行号读，或只读头注释（第 1–30 行）与 handoff 的 API 说明。 |
| P6 | 接线 | 根 package.json 没有 `geometry-measure:proof`，verify 也不跑本门（package.json 在本包文件集外）。 | SUB-035 / W5-C 接入：加脚本、放进 verify，并决定是否 `--write-report`。 |
| P7 | 类名约定 | W1-A P5 定的高亮类名为 `tcrn-highlight__mark`；mark 检查默认只认 `<mark>` 元素。 | 若高亮不是 mark 元素，调用时传 `markSelector: "mark, .tcrn-highlight__mark"`。 |
| P8 | 构建产物 | 为冒烟真实 story，在包树里跑了一次 `pnpm run build`（8 秒）；产生的 gitignore 产物（各 dist/、storybook-static/、tsbuildinfo，约 27 MB）已移到 scratchpad/trash/w1-f-build-outputs，包树恢复为未构建状态。 | trash 内容可重建，无保留用途，可随 scratchpad 一并清理。 |
