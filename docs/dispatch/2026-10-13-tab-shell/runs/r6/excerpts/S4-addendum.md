# S4 附录（主线程补派，R6）

S3（SUB-233）合入后交回了三条与本包文件集重合的事，主线程按 Owner 授权（纪要 TCRN-DS-MIN-20261016-R6 D1、D5）补派给 S4，与 SUB-234 同包做，交回里单列一节写读数。三条都不改 ProductShell 的 prop 面与导出面。

1. **越界级联的画面与读法（S3 问题第 2 条）。** 级联向左展开现在只有 DOM 用例与探针读数，文档站没有越界画面，Owner 目视看不到；壳层门的级联读法只认向右（`scripts/shell-measure-proof.mjs` 第 406–419 行，`col.l − (prev.l + prev.w) = 4`）。做法：在 `story-content.tsx` 的壳层故事里加一个桌面宽的越界画面（固定项靠右缘，级联打开后向左展开，`data-cascade-side` 为 start），壳层门的级联读法按 `data-cascade-side` 分方向（start 时 `prev.l − col.r = 4`），补一条夹具或变异（方向读反判红）。画面名写进交回，给 S8 收进目视清单。
2. **窄容器里打开的下拉（S3 问题第 3 条）。** 390 宽时 shell-top-band 的两块 drop 屏仍是打开的下拉，但窄屏不显示固定项，下拉的触发项看不到、第二列越出视口。做法：随 SUB-234 的容器查询一起处理，窄容器里的 drop 屏不展示打开的下拉（或只在桌面宽展示该画面），壳层门与 smoke 的期望同包对齐；交回写清取了哪一种。
3. **文档页上的 Esc（S3 问题第 4 条，可选）。** 文档页同时开着多个预览壳，每个开着的层都在 document 上收 Esc，焦点最后落到另一块屏的标按钮上。若改动小，让 Esc 只由焦点所在的层处理（或只由最近打开的层处理），`ShellDropdown.tsx` 与 `ShellMenu.tsx` 同改并补 DOM 用例（本附录把 `packages/ui-react/src/components/Navigation/ShellDropdown.tsx` 与 `ShellDropdown.test.tsx`、`src/test/shell-dropdown.dom.spec.tsx` 在 W2 归 S4）；改动面大就不做，记进问题文件。

S3 已改的 `shell.css.ts` 行在 `runs/r6/handoff/S3.md` 的接口节；改那几行前先读。
