# INIT-015 R3 · 主线程问题清单

每条：现象、证据、处置。批末与各包问题清单一起合并处置。

**R3M1 P5 交回（合入 989fec7）：SUB-091 判据达成（第二次返工，主力档）。** `.tcrn-multi-select-dropdown` 改为纵向（flex-direction column、align-items stretch）；实测静态展开态列表紧贴触发器正下方（偏移 0、宽差 0、左缘对齐），四个选项不换行；full-surface 两个弹层用例亮暗都绿（R2 的 dark 红消除）；inputs-matrix 亮暗各 42/42、controlHeight 零偏差；R2 SUB-061 的 30px 末端区与 Select 同语境不回退。余项：样板 rail 红属 O-1（P1、P3 处理）；doc-shell-class 基线与 R2 清零说明仍按旧注释计 1 处静态命中（现为 0），交 SUB-046；静态展开态列表紧贴触发器而运行时浮层留 8px 间隙（判据未要求，交 R3 判断）。RM7 ① 的目视行按验收 B 改为复核项（P4 的 SUB-106 回写）。

**R3M2 P0 交回（合入 d706676）与一处主线程自身的扫描红。** SUB-095、104、096、092 判据达成：zh-CN 新漏译 0；「标签 — 原因」title 两边皆译 13 → 20 种（余法语 `Route` 一种，词典值本就同词，交 R3 判断定读法）；契约 README、设计目录 README、roles.json description 回写；构图三样板 story id `composition-three-sample`（`apps/storybook/src/contract-stories/gplus/samples/composition-three.tsx`，CSF `compositions--composition-three` 在新建的 `apps/storybook/src/compositions.stories.tsx`），只用包公开组件、无新 token 与新 tcrn- 类；TopBar 与构图板的差（高 68 对 56、导航只能排在搜索之后、1024 下导航折 4 行）写进 P0 handoff 供 SUB-093 写 DIFF-2，并交 Owner 目视。授权外未做：gplus-samples 类目说明过时、ledger 两条已译的译文债未删、TopBar 缺导航槽（交判断与目视）。
主线程自身的红：P0 跑 `scan` 报 6 条 positive-overclaim 命中，全在 `runs/r2/excerpts/judgment.md`——主线程把扫描的禁用短语表原文写进了摘录的限制节。已在 3113b5e 改为指向扫描脚本的说明，全树复查只剩原有的脚本与测试文件。教训：派工摘录与调度文档里不写禁用短语原文（R3 判断考虑写进 lessons）。

**R3M3 P1 交回（合入 fa28ba9）与两处集成修复项。** SUB-090、088、097 判据达成：样板 rail 10 个 run 零偏差（引导列 16、文字列 48）；新增四个壳 token（`--tcrn-shell-sidebar-width` 220、`--tcrn-shell-sidebar-width-collapsed` 52、`--tcrn-shell-topbar-height` 52、`--tcrn-radius-paper` 14），移动端块未动，桌面几何限定在 `@media not all and (max-width: 760px)`，独立 TopBar 仍 68；TMS 夜间后缀 #7aa0f5 于 panel 6.86、bg 7.30，撤两条夜间豁免，axe 违规 0（豁免节点 90 → 80）。带出的旧几何期望：storybook-smoke 顶栏 68 与收起 92 共 14 条红、ai-consumption-contract 的 `railWidthPx: 92` → 作为集成修复项 I-P2 写进 P2 摘录；shell:parity 4 个角色 → P3 的 SUB-101 范围；smoke.test.ts 断言 220 局部覆写与 composition-one 的遗留导出 → 作为集成修复项 I-P3 写进 P3 摘录（两包均主力档，文件集仍不相交）。新增四个壳 token 属 O-1 授权的直接需要（数值取自 token 的裁定），收口回显。
