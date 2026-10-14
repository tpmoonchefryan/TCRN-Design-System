# R5 跨包通告（主线程维护）

派工提示指到本文件时全文读；它只指向别的文件的行段，按指明的行段读，不整读。

## 1. 既有红与归属

- R4 批末 verify（682fc94）只剩两步红，都只等 Owner、本轮不修：第 13 步 `contract:static` 的 C8 一族 15 条（O-19）、第 18 步 `geometry:measure` 的 markText（品牌首行锁定块 DS 1.4、底栏 TMS 锁定块 en 1.7，O-4）。你的包树里看到它们，交回物记一句「既有红，待 O-19 / O-4」即可。
- R4 判断的返工项与改法在 `runs/r4/judgment.md` §2（R5-1…R5-4）；返工项 → Subtask 与包的对照在 `runs/r5/decomposition.md` 第 2.1 节。你的包只修本包承接的返工项。
- 回执是否算「实质变化」按 `runs/r5/problems/decomposition.md` 第 8 条（C-9 (b)）：读数或判定变了才算；只差时间、时长、运行标识或随源码变的输入摘要不算。
- `--filter @tcrn/ui-react test` 在 `dist` 未构建时以 0 条测试退出 0：先 build 再 test；根 `pnpm test` 在第一个红的包就停，要看某包用 `--filter <包名> test` 单跑。

## 2. 已落地的接口

- R1–R4 各包的接口以 `runs/r1/excerpts/cross-notes.md` 第 2 节、`runs/r2/excerpts/cross-notes.md` 第 3 节、`runs/r3/excerpts/cross-notes.md` 第 3 节与 `runs/r4/excerpts/cross-notes.md` 第 3 节为准（按其中指明的交回物行段读）。
- 迁移说明下一个追加者从 M53 起（`runs/r4/handoff/N4.md`）。

## 3. R5 已合入包给下游的接口

| 包 | 交回物与行段 | 要点 |
| --- | --- | --- |
| Q1 | `runs/r5/handoff/Q1.md`（第 2 节④读数 L37–84、第 3 节接口与期望 L117–126、第 4 节 C-9 L128–136、第 5 节目视项 L138–147）；`runs/r5/problems/Q1.md` | `.tcrn-collapsible-region__inner` 的 `overflow-clip-margin` 改为 `var(--tcrn-space-1)`，Disclosure 区内控件获焦焦点环四边完整（Chromium 浅色 en 1440、1024、390 与夜间 zh-CN 1440，forced-colors 仿真同）；`Layout.test.tsx` 用例按焦点环最大 spread 4 与 outline 宽加偏移 4 断言；导出面与组件 API 无变化，无迁移条目；C-9：无越容差、无回执变化，`docs/verification` 未提交；`owner-acceptance.md` 第 268 行与 G-18（第 352 行）过期，由 SUB-228 接收；目视项两条（Safari 同看焦点环四边；展开动画中区域底外最多 4px 可见，按样式读出、未逐帧实测）；离群项无；问题 5 条（既有红 2、数据缺口 2、观察 1） |

## 4. 其他事实

- `scripts/fonts-vendor.mjs` 只从已装的 root devDependencies 复制字体，不联网。
