# R6 跨包通告（主线程维护）

派工提示指到本文件时全文读；它只指向别的文件的行段，按指明的行段读，不整读。

## 1. 既有红与归属

- R5 批末 verify（60ff2ef）只剩两步红，本轮各有承接：第 13 步 `contract:static` 的顶带 C8 15 条由 S1（SUB-229）按纪要 D2 收；第 18 步 `geometry:measure` 的 markText（DS 品牌首行 1.4、底栏 TMS 锁定块 en 1.7）由 S2（SUB-230）按纪要 D3 收。别的包在自己的树里看到这两处，记一句「既有红，归 SUB-229（S1）」或「既有红，归 SUB-230（S2）」即可。
- 主检出 main@69aa195 上 verify 第 19 步红（草案板 `V2-B2-Shell-Draft*` 没有映射条目）是 INIT-016 开单提交带进 main 的，候选分支已补，与本轮各包无关（`runs/r6/problems/main.md` M2）。
- 本轮的处置依据：纪要 `TCRN-DS-MIN-20261016-R6`（D1–D8）与 `TCRN-DS-MIN-20261016-GATES`（D1–D3），摘要在 `runs/r6/brief.md` 第 0–2 节。库里现在有三道门：必需门 `verify`，附加到 INIT-016 的 `storybook-build` 与 `test-dom`；批末要三道全绿。
- `--filter @tcrn/ui-react test` 在 `dist` 未构建时以 0 条测试退出 0：先 build 再 test；根 `pnpm test` 在第一个红的包就停，要看某包用 `--filter <包名> test` 单跑。

## 2. 主线程对拆分问题的裁定（`runs/r6/problems/decomposition.md`）

- 第 1、2、6、9 至 16 条：照「默认」做。
- 第 3 条：照默认。成品 Brand 板（Logos 通过稿）不改，E 段未写夜间值记入目视清单，待设计会话。
- 第 4 条：STORY-145 的标题与 GWT3 由主线程在 R6 链写里按纪要 D4 改写（与 O-14、O-20 同批）；SUB-232 照默认按 136-GWT3 与 D4 判，交回写明 145 的文字待主线程。
- 第 5 条：SUB-240 先照默认的两步写法（(a) 现有 props；(b) AOS 视觉实例只留页内内容，契约证明改用 Design System 自己的标与名称）。两步都不行时，本授权下预先允许 SUB-240 把 ProductShell 的 `brandProductId` 改为可选（不带产品标的标按钮），按契约改动处理：类型与导出面、单测与 DOM 用例、契约文档同包改，迁移条目写进交回由 S8 从 M54 起收录；不再停下等 R7。
- 第 7 条：SUB-234 先量。文档页里窄于 1024 的桌面屏块，先让它占满正文列（去掉块内距，使壳的容器宽不小于 1024）；做不到再按默认定宽 1240 并让所在故事栈横向可滚。两种写法若让 browser-proof 的页面溢出或 axe 判红，停下记问题。
- 第 8 条：派 S8 时附纪要 D8 原文（见本文件第 4 节）。

## 3. 已落地的接口

- R1–R5 各包的接口以 `runs/r1/excerpts/cross-notes.md` 第 2 节、`runs/r2/excerpts/cross-notes.md` 第 3 节、`runs/r3/excerpts/cross-notes.md` 第 3 节、`runs/r4/excerpts/cross-notes.md` 第 3 节与 `runs/r5/excerpts/cross-notes.md` 第 3 节为准（按其中指明的交回物行段读）。
- 迁移说明下一个追加者从 M54 起（`runs/r5/handoff/Q2.md`）。

## 4. 纪要 D8 原文（给 S8）

「D8 维持现状并在目视清单列明：O-7（文档站默认头像、目录宽 144）、O-10（头像菜单几何）、O-12（下拉不显示 ⌘K）、O-13（纸升起 10）、O-15（Sheet 夜间遮罩与下一级，等设计会话给值）、O-16（页标题行高 30）、O-17（TreeNav 只用于消费方的下拉或浮层）；O-18 已由 test-dom 门落实（MIN-20261016-GATES D1）；STORY-150 由实施会话按机器判据判定，Owner 目视在交付后进行。」

## 5. R6 已合入包给下游的接口

| 包 | 交回物与行段 | 要点 |
| --- | --- | --- |
| S1 | `runs/r6/handoff/S1.md`（第 4 节接口 L134–147、第 5 节迁移条目 L148–174、第 6 节期望过期 L175–187）；`runs/r6/problems/S1.md` | `roles.json` 顶带一项带 `yieldMinWidth: "zero-by-board"`、`yieldOptional: true` 与板规则出处 `yieldBoardRule`；contract-static 的 C8 静态层与 story 层只对带字段的登记跳过两项；`contract:static` 全部条款 0 发现；去字段判红 15 条、复原为 0；迁移条目原文给 S8（M54 起）；`owner-acceptance.md` 与 M53 里写的 C8 15 条已过期，交 SUB-241、242；`closeout.md` 的 C8 读数由主线程收口时改 |

## 6. 其他事实

- `scripts/fonts-vendor.mjs` 只从已装的 root devDependencies 复制字体，不联网。
- 会话 scratch 在两次会话之间被回收过：R1–R5 的逐段日志不在了；链上 Story 原文已重新导出到 scratch `chain/src/`。
