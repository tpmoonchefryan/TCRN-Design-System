# R2 跨包通告（主线程维护）

派工提示指到本文件时全文读；它只指向别的文件的行段，按指明的行段读，不整读。

## 1. 既有红与归属

- R1 批末 verify（63e1ee2）的红段 → 返工项对照在 `runs/r1/judgment.md` 第 283–301 行（§2.7）；返工项 → Subtask 与包的对照在 `runs/r2/decomposition.md` 第 2 节。你的包只修本包承接的返工项；别包承接的红在你的包树里出现时，在交回物里记一句「既有红，归 <包>」，不修。
- `--filter @tcrn/ui-react test` 在 `dist` 未构建时以 0 条测试退出 0：先 `--filter @tcrn/ui-react build` 再跑 test。
- `pnpm test`（根）在第一个红的包就停（KB-030）：要看某个包的测试，用 `--filter <包名> test` 单跑。

## 2. 已落地的接口

- R1 各包的接口仍以 `runs/r1/excerpts/cross-notes.md` 第 2 节为准（按其中指明的交回物行段读）。
- R2 各包交回后，主线程在本文件第 3 节补行。

## 3. R2 已合入包给下游的接口

| 包 | 交回物与行段 | 要点 |
| --- | --- | --- |

## 4. 其他事实

- `scripts/fonts-vendor.mjs` 只从已装的 root devDependencies（`@fontsource*` 包）复制字体并写 manifest；第 41 行的 `REGISTRY` 只作为元数据写进 manifest（第 340 行），脚本不联网。
