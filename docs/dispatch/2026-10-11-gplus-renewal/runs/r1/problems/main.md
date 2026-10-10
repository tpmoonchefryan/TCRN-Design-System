# INIT-015 R1 · 主线程问题清单

每条：现象、证据、处置。批末与各包问题清单一起合并处置。

**M1 P2 已由主线程补件。**
现象：拆分问题清单 P2 指出 C1–C17 条款正本画板 `V2-Rejections.dc.html` 与家族清单 `V2-Families.dc.html` 未入仓。
证据：主线程 2026-10-10T21:4xZ 读画布当前发布版（版本标识 1791663559-13e2）的 `project/V2-Rejections.dc.html`（26,697 B，sha256 6a964abd9e567374666770a88221547b880b4d86e2f8f2b681f2720f450d6273）与 `project/V2-Families.dc.html`（14,918 B，sha256 ffd0f8034a00973e3b7ed71eb75ee4dad96997398ce38f14eb4b99f0dfc4f595），原样复制进 `docs/design/gplus-2026-10/boards/`；与设计会话 2026-10-11 00:04 的本地副本逐字节相同。
处置：已入仓，W1-E（SUB-036）按该板的条款编号与文案写 `docs/contract`，不再标「画板未入仓」。

**M2 DS 门脚本以 cwd 为根。**
现象：主线程在会话根 `/Users/ryanlan/Code` 下用绝对路径直接 `node <W>/scripts/no-private-input-scan.mjs`，脚本按 cwd 遍历并把回执写到了容器根 `docs/verification/internal-alpha/no-overclaim-scan.json`（14.6 MB，未跟踪）。
证据：`scripts/no-private-input-scan.mjs` 第 144 行 `walk(".", context)` 与相对回执路径。
处置：该目录已移入本会话 scratch 的 trash，容器根 git 状态复原（只剩会话开始前就有的 `.claude/launch.json` 修改）。此后所有 DS 脚本一律 `corepack pnpm@10.12.1 -C <树> exec node <脚本>` 或 `run <脚本>`，派工摘录第 1 节约定 10 已写明。

**M3 P27 接受。** token 包（W2-A）与五家族同在 W2 并行；家族只引用契约定死的变量名。

**M4 并行上限按 START 5814699 为 3。** packages.md 写的「每波不超过 8」只是分包校验口径；派工时同时在跑的包不超过 3，同波的包分批派，依赖已合入的下一波包可以提前补位，文件集与在跑包不相交。
