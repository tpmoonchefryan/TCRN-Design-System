# R4 跨包通告（主线程维护）

派工提示指到本文件时全文读；它只指向别的文件的行段，按指明的行段读，不整读。

## 1. 既有红与归属

- R3 批末 verify（c45c529）只剩两步红，都只等 Owner、本轮不修：第 13 步 `contract:static` 的 C8 一族 15 条（O-19）、第 18 步 `geometry:measure` 的 markText（DS 侧栏首行 1.4、底栏 TMS 锁定块 en 1.7，O-4）。你的包树里看到它们，交回物记一句「既有红，待 O-19 / O-4」即可。
- R3 判断的红段 → R4 项对照在 `runs/r3/judgment.md` 第 136–158 行（§2.6）；返工项 → Subtask 与包的对照在 `runs/r4/decomposition.md` 第 2 节。你的包只修本包承接的返工项。
- 改动会让某个门的期望过期的包，同包对齐那个门的期望；门脚本不在本包文件集时记问题，不越界。
- `--filter @tcrn/ui-react test` 在 `dist` 未构建时以 0 条测试退出 0：先 build 再 test；根 `pnpm test` 在第一个红的包就停，要看某包用 `--filter <包名> test` 单跑。

## 2. 已落地的接口

- R1–R3 各包的接口以 `runs/r1/excerpts/cross-notes.md` 第 2 节、`runs/r2/excerpts/cross-notes.md` 第 3 节与 `runs/r3/excerpts/cross-notes.md` 第 3 节为准（按其中指明的交回物行段读）。
- R4 各包交回后，主线程在本文件第 3 节补行。

## 3. R4 已合入包给下游的接口

| 包 | 交回物与行段 | 要点 |
| --- | --- | --- |
| N1 | `runs/r4/handoff/N1.md`（接口与迁移条目两节） | 所有写 `data-logo` 的元素都写标的 id（ds、mana、tms、einzbern），取法统一用新模块 `product-mark-id.ts` 的 `productMarkIdOf`（不从入口导出）；几何门报告 `probes[]` 多 `paperFocusRing`（真件 9 处读到、0 违规）；Disclosure 展开区内层 `overflow: clip` 加 `overflow-clip-margin`，描边画出；迁移条目（M42 末句不再成立）交 SUB-223；视觉签名与 `geometry-measure/report.json` 由 SUB-224 重收。已知：可折叠区里按钮的焦点环底边与起始边仍被裁 2px（新发现，只记） |

## 4. 其他事实

- `scripts/fonts-vendor.mjs` 只从已装的 root devDependencies 复制字体，不联网。
