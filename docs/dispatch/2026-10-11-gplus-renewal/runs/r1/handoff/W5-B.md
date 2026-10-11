# 交回说明 · W5-B（SUB-032 → SUB-033）

## 已交付

- SUB-032：`docs/design/gplus-2026-10/storybook-map.json`（机读，门读它）与 `storybook-map.md`（人读，同源）。十块板全部入表：22 行有 story（15 行第一批 A/B/D、5 行构图一对五个样板、2 行产品标板 A–E 与 I），25 条没有 story（写原因、落点、引用），8 条差异逐条带引用，其中 DIFF-1、DIFF-2、DIFF-3、DIFF-8 待 Owner 裁定（前三条引 P1）。样板 id 按约定 7 先登记。
- SUB-033：`scripts/storybook-visual-proof.mjs` 替换退役桩；`tests/storybook-visual-proof.test.mjs` 16 条；报告 `docs/verification/storybook-visual-proof/gplus-map-report.json` 与 `.md`（`--write-report` 才写）；同目录 README 改为先说本门、再保留旧像素基线历史（旧回执与截图未动，smoke 与隐私扫描仍读它们）。

## 门怎么判

- 红的条件：映射结构不全；canvas.json 的板或板内字母分段（`class="sec"><h3><b>X</b>`）没有映射条目，或映射写了不存在的分段；映射与 story 清单（约定 7 的十个 id 加注册表里 `gplus-` 类目的全部 story）有差集；任一行任一主题的九项检查（八项测量加 overlap）有 fail、requiredChecks 有 n/a、格数或格 id 与契约不符、story 的 data-expect 与画板同格不同；任一在范围内的变异没有判红。
- 阈值取 `scripts/geometry-measure-proof.mjs` 的 THRESHOLDS（不复制、不进映射、库里没有）。
- `--kind matrix` 只判矩阵行（样板未合并时用）；`--theme`、`--no-mutations` 可缩小范围；默认浅色与夜间两种页面主题、九条变异（每项检查一条，rail 那条写在 typography-sample-billing 上）。
- 测量钩子：对所有 story 传 `markSelector: "mark, .tcrn-highlight__mark"`；格数据在 prepare 阶段读 `[data-cell]` 与 `data-gplus-matrix-cell-count`。

## 本包树实测（HEAD 见报告）

- 全量：对账报 5 个样板不在注册表，10 个样板行 story_not_measured；12 个矩阵行全部因 contrast 不通过（浅色：状态格停在默认态；夜间：浅色块读夜间 token），inputs.B 另缺 opt-sel 两格；其余七项检查凡适用的全过，rail、controlHeight 在矩阵上 n/a。
- `--kind matrix`：对账一致，8 条变异全部判红，结论仍红（同上 contrast 与缺格）。
- 明细与根因见 `problems/W5-B.md`。

## 集外改动需求

1. `apps/storybook/src/build/page-template.tsx` 作用域修复（W5-C 已排）——P1、可能连带 P4。
2. 浅色主题块（W4-A 交回集外改动 2）——P2。
3. `matrix-stories.tsx` 让 opt-sel 格静态可见——P3。
4. `scripts/lib/gplus-measure.mjs` 探针表加 `before-bg`——P5（约定 9：本包不改库）。
5. 根 `package.json` 是否把 `storybook:visual-proof` 接进 verify；README.md 第 85 行与 `foundation-visual-standards.ts` 第 546 行的文字——P9。

## 未做完

无。合并 W5-A 后在集成分支重跑 `node scripts/storybook-visual-proof.mjs --write-report` 即得全量报告（生成物批末再生）。
