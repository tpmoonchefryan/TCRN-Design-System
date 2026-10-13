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
| K2 | `runs/r2/handoff/K2.md` 第 94–110 行（第 5、6 节） | `.story-body` 比对副本末尾已带壳层段（SUB-170 只改段首定位）；换字跳过与台账都认三个字标类，`[data-locale-invariant]` 只给台账用；内层 Esc 经 `defaultPrevented` 告知外层（SUB-151 保留）；文档层示例类改名 `tcrn-doc-demo-frame`、`tcrn-doc-demo-pager`；不要再加「Change Log」内容键。既有红：`smoke.test.ts:826/831/832` 断言旧类（归 SUB-173）、tokens:proof 的「铛」（归 SUB-177） |
| K3 | `runs/r2/handoff/K3.md` 第 47–54 行（第 4 节） | smoke 与 browser-proof 改读顶带钩子（`[data-shell-strip]`、`[data-shell-brand]`、`[data-cluster]`、`[data-shell-avatar]`、`[data-paper]`）与新回执字段（`menuRowLabel*`、`currentMenuRowPages`）；parity 去掉 10 个样板角色；契约清单改查顶带文档壳与现 README 的 prop——SUB-176、SUB-173 删旧文档壳标记词不会再打红 30.01；browser-proof 回执 507,403 字节并自检不超 1,000,000。既有红：shell:parity 两个包侧角色（归 R2-18）、smoke 与 browser-proof 余项（归 R2-8/16/17/20/21/24/34/36）；两个「search results」视觉实例渲染为壳收起态（问题 4，下一轮）；smoke 对 AI 契约的断言仍描述旧壳，SUB-176 重写契约后会红（问题 7） |

## 4. 其他事实

- `scripts/fonts-vendor.mjs` 只从已装的 root devDependencies（`@fontsource*` 包）复制字体并写 manifest；第 41 行的 `REGISTRY` 只作为元数据写进 manifest（第 340 行），脚本不联网。
