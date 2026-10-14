# R3 跨包通告（主线程维护）

派工提示指到本文件时全文读；它只指向别的文件的行段，按指明的行段读，不整读。

## 1. 既有红与归属

- R2 批末 verify（6f739b2）的红段 → R3 返工项对照在 `runs/r2/judgment.md` 第 208–222 行（§2.9）；返工项 → Subtask 与包的对照在 `runs/r3/decomposition.md` 第 2 节。你的包只修本包承接的返工项；别包承接的红在你的包树里出现时，在交回物里记一句「既有红，归 <包>」，不修。
- 照 R2 判断，R3 做完后只剩 `geometry:measure` 的 markText（DS 侧栏首行 1.4、底栏锁定块 en 1.7，待 Owner 裁 O-4）一处红；门照 ±1 判，不放宽、不加豁免。
- R2 已返工过的同一目标在 R3 再被退回就交 Owner、不再派：每张这类 Subtask 按判据一次做对，做不到的写清阻点交回，不硬凑。
- 改动会让某个门的期望过期的包，同包对齐那个门的期望（R2 M2）；门脚本不在本包文件集时记问题，不越界。
- `--filter @tcrn/ui-react test` 在 `dist` 未构建时以 0 条测试退出 0：先 build 再 test；根 `pnpm test` 在第一个红的包就停（KB-030），要看某包用 `--filter <包名> test` 单跑。

## 2. 已落地的接口

- R1、R2 各包的接口仍以 `runs/r1/excerpts/cross-notes.md` 第 2 节与 `runs/r2/excerpts/cross-notes.md` 第 3 节为准（按其中指明的交回物行段读）。
- R3 各包交回后，主线程在本文件第 3 节补行。

## 3. R3 已合入包给下游的接口

| 包 | 交回物与行段 | 要点 |
| --- | --- | --- |
| M1 | `runs/r3/handoff/M1.md` 第 57–68 行（第 4、5 节） | 壳层门只读渲染出来的钉钮与行；对比度格的底色取格心下方实际绘制的层，读不了时标 `backdrop: "ancestors"`；页内面包屑逐段读；manifest 两套夹具的绿名单加 `singleLine`，`story-label-plus-40` 改在菜单夹具上跑（变异改为取完整菜单首个可见组标题、关截断后加 40 字，交判断确认）；`tests/shell-measure-proof.test.mjs` 35 → 39 条（SUB-179 留意）。真件 18 门 16 过 2 红（brandDigest 归 SUB-194、markText 待 O-4），prail 仍红归 SUB-188 |
| M2 | `runs/r3/handoff/M2.md` 第 43–58 行（第 4、5 节） | geometry:proof 与 shell:parity 都已退出 0（parity 的可钉行改用复合行盒读法：内距读包装、字号与最小高读行链接，B 类回显）；contract:static 的 C11 归组合件家族、34 条列豁免；`families.json` 删 `scope.batch`、改为 `scope.checkedBatches: [1, 2]`；`roles.json` 的 `toolbars` 加顶带一项（容器 strip、让步项 pins、固定项 brand 与 cluster）。登记后 C8 出 18 条（板 `.ts-pins` 写 `min-width:0`、无固定项的壳 ShellPins 返回 null），现有 token 补不了，待 Owner——contract:static 因此仍退出 1；SUB-178 在 C8 上没有可补的样式 |
| M3 | `runs/r3/handoff/M3.md` 第 67–83 行（第 5、6 节） | 菜单与 Sheet 的行内图标照板画成 22 方盒带 3 内距（真件 prail 读 16/48，门未改）；纸内滚动区焦点环向内画；兜底焦点规则跳过 7 个自带焦点样式的壳件——**新加自带焦点样式的壳件，同一提交里要加进兜底规则的排除名单，否则测试会红**（M4 留意）；导航项文字单行截断进基础规则并带 title（禁用项的原因另起一行）；两个死名（搜索动效变量、`typographyCss03`）清零；`focusRingClipInPage` 多返回 `regions`；ui-react test 248/248、test:dom 56/56。已知：zh-CN 下 markText 另读 −1.1 无主（问题）；纸内焦点检查只在测试页上证过 |

## 4. 其他事实

- `scripts/fonts-vendor.mjs` 只从已装的 root devDependencies 复制字体，不联网（R2 K12 已补「铛」「簇」两片）。
