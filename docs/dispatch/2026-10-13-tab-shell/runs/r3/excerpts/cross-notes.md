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

## 4. 其他事实

- `scripts/fonts-vendor.mjs` 只从已装的 root devDependencies 复制字体，不联网（R2 K12 已补「铛」「簇」两片）。
