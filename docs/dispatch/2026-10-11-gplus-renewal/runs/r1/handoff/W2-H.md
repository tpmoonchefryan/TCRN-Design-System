# 交回说明 · W2-H（SUB-011）

## 已交付

- SUB-011（9930ae9）：
  - `scripts/contract-proof.mjs`（schema `tcrn.ds.contract-proof.v1`）六项检查：generated-sources（七个生成物存在、带勿手改头、头部 contract-sha256 等于按生成器算法重算的契约哈希、与内存 `generate()` 逐字节相同，生成目录无他文件）；generated-state-rules（生成的 pair 状态规则只切换 `--tcrn-pair-*`、无颜色字面量，条数等于 pairs.json 各表 ruleOrder 之和 25；typography 段 2 条状态规则无颜色字面量）；package-css（dist `tcrnComponentCss` 逐字包含 5 个生成段，pairs.json 目标基类的 38 条状态规则无颜色字面量）；icon-roster（icons.json 37 名与 dist `tcrnIconNames` 同集）；product-marks（marks.json 按 build-logos2 文件形态生成的 8 个 SVG 与 logos2、dist `tcrnProductMarkSvg`、`productMarkSources` 登记的字节数与 sha256 逐字节一致）；matrix-expect（五板 44/28/10/116/42 格，契约 cr/fmt 期望、生成的矩阵数据 expect、画板 data-expect 两位小数差 0，kind 与 exempt 一致）。`--json` 输出结构化结果；`import { runContractProof }` 接受 `{ root, distEntry, ui }`。
  - `tests/contract-proof.test.mjs` 8 条：真树全绿；状态规则判定单测；GWT1 改 pairs.json 一个 ink（自动选未被矩阵格引用的态，当前为 actions.primary.s）不重生成判红；GWT2 重生成并模拟重建后全绿，包 CSS 状态规则注入颜色、pairs.json weight 写颜色、手改生成文件各判红；GWT3 改名一个图标与 dist 少一名判红；GWT4 改一枚标的 body 与 logos2 多一个字节判红；矩阵改一格 data-expect（差 0.01）与删一格判红。变异都在临时副本或内存副本里做，测试结束即删除副本。

## 给后续包

- 门读 dist：先 build ui-tokens、ui-copy-state、ui-react。改契约后的顺序是 `node scripts/contract-generate.mjs` → build → 本门；只重生成不重建时 package-css 判红（dist 落后于生成段）。
- 期望数量是常量：`EXPECTED_ICON_COUNT` 37、`EXPECTED_MARK_FILES` 8、`EXPECTED_CELLS` 44/28/10/116/42、`BOARD_FILES` 五板文件名。契约有意改数量时同批改常量。
- 家族用 `inputsPairsCss` 整段或三段分开都可以（拼接段按组成段判）。
- 状态规则的判定：选择器里带 pairs.json 目标基类的复合选择器含任一 `when` 条件（含 `:where`/`:is`/`:not` 内）。颜色字面量用 `scripts/lib/css-rules.mjs` 的 `colourLiterals`，唯一放行与 contract-static C2 相同（outline 只有 transparent）。

## 集外改动需求

- 根 `package.json`：加 `"contract:proof": "node scripts/contract-proof.mjs && node --test tests/contract-proof.test.mjs"`，verify 中放在 `pnpm build` 之后。根 `pnpm test` 不跑根 `tests/`，测试要靠这条脚本带上。

## 未做完

无。
