# INIT-016 R3 · 主线程问题清单

主线程在调度、合入与跨包协调中记下的事实；见红只记，批末由判断一次处置。同一根因算一条。

| # | 类别 | 现象与证据 | 处置或建议 | 涉及 |
| --- | --- | --- | --- | --- |
| M1 | 库门（Owner） | `gates-config-list` 仍为 0 个门（S-1），引擎拒绝 Story 转 done。 | 不变：Owner 在 Atelier 声明 `verify` 门前只写注解。 | 全部 Story |
| M2 | 期望过期补派 | M7 合入后，它交回第 9 节列的三处期望（`smoke.test.ts` 静态期望、`story-content.tsx` 样本块的地标重名与禁用项样本、`scripts/package-contract-manifest.mjs` 第 266–285 行两条源码规则）落在 M9 的文件或无人持有的文件；主线程按「改门期望同包对齐」补派给 M9（`runs/r3/excerpts/M9-addendum.md`），M9 已做（storybook 单测 14/14、axe landmark-unique 0、禁用项样本 3、contracts 0）。 | 无残留。 | M7、M9 |
| M3 | 同波漏收 | M9 与 M10 同在 W4 并行，M9 交回第 7 节的迁移条目没进 M10 追加的 M38–M46；主线程补派给 M11（`runs/r3/excerpts/M11-addendum.md`），M11 补录为 M47–M48。 | 无残留。下一轮拆分把「迁移说明的收录包排在所有产出迁移条目的包之后」写进约定。 | M9、M10、M11 |
| M4 | 批末红的性质 | R3 批末 verify 只剩两步红：`contract:static` 只有 C8 一族 18 条（M2 交回第 4 节：板 `.ts-pins` 写 `min-width:0`、没有固定项的壳不渲染让步项，现有 token 补不了）；`geometry:measure` 只有 markText 一门（DS 侧栏首行 1.4，待 O-4）。主线程逐行核对过日志（`runs/r3/verify/steps.md`）。 | 交判断：两处是否都只等 Owner（C8 的板值或判定口径、O-4 的量法），以及 C8 登记是否保留。 | M2、M10 |
