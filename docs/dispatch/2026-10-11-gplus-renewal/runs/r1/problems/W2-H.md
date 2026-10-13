# 问题清单 · W2-H（SUB-011）

只记不修。本包局部门：`node scripts/contract-proof.mjs` 六项全绿；`node --test tests/contract-proof.test.mjs` 8 条全过。门读 dist，须先 build（ui-tokens → ui-copy-state → ui-react）。

| # | 类别 | 事实 | 建议 |
| --- | --- | --- | --- |
| 1 | 集外接线 | 根 `package.json` 没有 contract-proof 的脚本，verify 链不跑它；根 `pnpm test` 只跑各包测试，不跑根 `tests/*.test.mjs`，所以 `tests/contract-proof.test.mjs` 不会随 verify 运行。`contract-generate --check` 与 `contract-static-proof` 目前同样未接线。 | 由持有 `package.json` 的包加 `"contract:proof": "node scripts/contract-proof.mjs && node --test tests/contract-proof.test.mjs"`，verify 中放在 `pnpm build` 之后（门读 dist）。contract-proof 已含 `generate --check` 的全部比对（逐字节加头部哈希），不必再单独接 `contract-generate --check`。 |
| 2 | 判读待定 | GWT2「状态规则不含颜色字面量」：包 CSS 里四条手写 focus-visible 状态规则（Button/LinkButton、Input/Select、Switch、Checkbox/Radio）写 `outline: 2px solid transparent`（forced-colors 焦点环）。本门沿用 contract-static C2 的唯一放行（outline 只有 transparent 一色不算写颜色），并在输出里以 note 列出放行条数（当前 4）。 | 建议维持与 C2 一致。如判读为 transparent 也算字面量：删去 `stateRuleLiterals` 里的放行即转红，家族改在 `@media (forced-colors: active)` 里用系统色写焦点环。 |
| 3 | 范围外观察 | 用 pairs.json 的状态条件全局扫描 tcrnComponentCss：84 条状态规则里只有 `.tcrn-shell-locale-menu__trigger:hover` 一条含颜色字面量（`background: color-mix(...)`、`box-shadow: rgba(...)`）。它不属于 pairs.json 的目标家族，本门不判。 | 交壳层所属 Subtask 改用 token；是否纳入由 contract-static C2 的家族范围决定。 |
| 4 | 摘录缺项 | 派工说明提到摘录含「verify 影响表相关行」，摘录里没有这一行。 | 本包按集外不改处理，接线需求见第 1 条与交回说明。 |
| 5 | 判据核对 | 拆分把 122-GWT3 标为「SUB-014 合并前此项预期红」；包树 4e5b502 已含 SUB-014，icons.json 与 dist `tcrnIconNames` 同为 37 名，本项为绿。 | 无须处置。 |
