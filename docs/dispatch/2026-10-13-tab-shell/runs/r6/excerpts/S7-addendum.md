# S7 附录（主线程补派，R6）

S2 合入后交回的一条与 S7 文件集相邻的事（S2 问题 P4），主线程按 Owner 授权（纪要 TCRN-DS-MIN-20261016-R6 D4）补派给 S7，与 SUB-238 至 240 同包做，交回里单列一节写读数。

1. **家族板 D 段样张的夜间后缀仍是 `#2c63c8`。** `docs/design/gplus-2026-10/tools/shell-screen.mjs` 第 16、18 行 `DEEP = { tms: "#2c63c8" }` 两主题一色，供四块家族板（Inputs、Icon、Actions、Typography）D 段的 `sampleScreens` 画浅色与夜间样张；S2 只在 `build-shell2.mjs` 画壳板夜间屏时临时换色。做法：让 `shell-screen.mjs` 的后缀色按主题取值（夜间 TMS `#7aa0f5`），去掉 `build-shell2.mjs` 里的临时换色，重生四块家族板的成品板与草案板（`docs/design/visual-standard/boards/{Inputs,Icon,Actions,Typography}.dc.html`、`docs/design/gplus-2026-10/boards/V2-B1-{Inputs,Icon,Actions,Typography}.dc.html`，S6 在 W2 改过 Inputs、Icon，合入后在其基础上重生）。板高变了同步 `heights.json` 与 `canvas.json`；148-GWT4 的五矩阵格数（44 / 28 / 10 / 116 / 42）不变。本附录把这八个板文件在 W3 归 S7。
2. 板头 CSS 里生成器早先的漂移（`--font-mono` 字栈加 `"Noto Sans SC"`、新增 `--r-paper:14px`）随重生带入，S2 已核对板高不变；照实写进交回，给 S8 收进待发布清单。
