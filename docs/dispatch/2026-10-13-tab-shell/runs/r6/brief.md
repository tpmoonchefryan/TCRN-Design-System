# TCRN-DS-INIT-016 · R6 返工清单（Owner 完整授权）

主线程依纪要 `TCRN-DS-MIN-20261016-R6`（minutes:019a51580fa65197f0f4630c，D1–D8）与 `TCRN-DS-MIN-20261016-GATES`（minutes:770128917565162256d1d232，D1–D3）写。R6 不是判断代理出的清单，是 Owner 授权后的处置落地；拆分照本文件拆，不改处置。

## 0. 目标与验收口径

- R6 的目标：Owner 待裁项 O-1 至 O-20 与 INIT-015 收口的 S-6 按处置落地；批末在集成树上 `verify` 30 步全绿，`storybook:build` 与 `test:dom` 退出 0（库里已声明三道门：必需门 `verify`，附加到 INIT-016 的非必需门 `storybook-build` 与 `test-dom`）；之后由主线程合入 main 本地，在主检出上一次跑门，INIT-016 的 16 张与 INIT-015 的 12 张转 done。
- 交付后 Owner 一次目视、一次提出问题、一次修改。所以 R6 要把目视清单 `owner-acceptance.md` 写成一份完整、可一次看完的清单（R6-11）。
- 推送、打 tag、发版、部署不做。成品画布（claude.ai）的发布交设计会话；仓内板文件与生成器可以改（INIT-016 已改过 Actions、Icon、Inputs、Typography 四块成品板），改过的板列入待发布清单。

## 1. 返工项

编号 R6-1 起。「Story」列写受影响的 Story 与判据；「档位」是建议（改共享契约——token 键集与值、`contract/*.json`、导出面、门的判定语义、ProductShell 的 prop 面——起主力，孤立修复起经济）。

| # | 处置出处 | 现象与目标 | 依据与行段 | Story | 档位 |
| --- | --- | --- | --- | --- | --- |
| R6-1 | R6 纪要 D2（O-19 甲） | 顶带 C8 让步项 15 条（静态 `C8.yield-without-min-width` 1、story 层 `C8.story-yield-missing` 14）让 `contract:static` 红。改法：`docs/contract/roles.json` 顶带一项加 `yieldMinWidth: "zero-by-board"` 与 `yieldOptional: true` 并写明板规则出处（07a `.ts-pins` 的 `min-width:0`；没有固定项的壳不渲染让步项）；contract-static 的 C8 静态层与 story 层只对带这两个字段的登记跳过这两项，其余 C8 检查照旧；`docs/contract/clauses.md` 写明；两条自检（去字段判红、加字段判绿）。目标：`contract:static` 发现 0、退出 0 | `runs/r3/judgment.md` §3.1.1（第 186–192 行）；`runs/r5/judgment.md` §3.1 O-19 行 | 135-GWT4；143 符合性 C1–C17；149-GWT2 | 主力 |
| R6-2 | R6 纪要 D3（O-4） | markText 红：DS 品牌首行 `lkr-line@22:design-system` 1.4、底栏 TMS 锁定块 `lkr@22:tms` en 1.7（阈值 ±1）。改法：标旁文字中线改量「首行大写顶到基线」的中线（不再用含下行字母的墨迹盒），两行锁定块只量首行，阈值仍 ±1；门库与 `docs/design/gplus-2026-10/tools/measure-shell.js` 同改（149-GWT4 要两者读数相等），补夹具与变异。改后 DS 品牌首行仍大于 1 时，在布局上把首行文字与标垂直居中到 ±1 内（「派生只做取子集与居中」），不改品牌资产 | `runs/r5/judgment.md` §3.1 O-4 行；START「质量硬线」标旁文字中线 | 145-GWT2；146「几何门全绿」；138 硬线；149-GWT1、GWT2、GWT4 | 主力 |
| R6-3 | R6 纪要 D4（O-8 与 S-6 的 TMS 色） | 夜间产品色后缀对比度 3.07 / 3.13 / 3.33（低于 4.5），矩阵标红 pending。改法：夜间值取设计会话建议的 `#7aa0f5`（MIN-20261013-SHELL D7），改 token 夜间值、契约 `tokens.json` 与 `matrices.json`、生成物与测试；Brand 板夜间说明的 TMS 色同改 `#7aa0f5`（DIFF-10）。目标：夜间于纸与画布不低于 4.5，矩阵不再 pending，`geometry:measure` 的 contrast 无 pending | `runs/r5/judgment.md` §3.1 O-8 行；MIN-20261013-SHELL D7；INIT-015 收口 `docs/dispatch/2026-10-11-gplus-renewal/closeout.md` 第 55 行 S-6 | 136-GWT3 | 主力 |
| R6-4 | R6 纪要 D4（S-6 其余三处） | 画板修订：Inputs 板补只读获焦 `rf` 一行；Inputs 板快捷键 ink-3 改 ink-2；底盘（Tokens）板 kv「侧栏 212 · 顶栏 48」改 220 / 52（DIFF-3）。改仓内板文件与生成器，板高变了同步 `heights.json` 与 `canvas.json`；`storybook-map` 的 DIFF-3、DIFF-10 状态同步 | INIT-015 收口第 55 行 S-6 | 148（板）；150（待发布清单） | 经济 |
| R6-5 | R6 纪要 D5（O-11） | 窄屏现在按视口切换。改法：按壳的容器宽切换（容器查询，阈值 1024），文档站里嵌在纸内的壳与独立页的壳都按自己的容器宽；补 1023 的门读数（几何或壳层门） | `runs/r5/judgment.md` §3.1 O-11 行 | 140；144；149 | 主力 |
| R6-6 | R6 纪要 D5（O-1） | 长字标放不下（要 117，格 60，D1 定宽 134），现截断加 title。改法：标按钮宽度至少 134 并随字标加宽，长字标不截断；`brandGeometry` 期望同步；07b 板补长名屏（仓内 `Shell-2.dc.html` 与 `build-shell2.mjs`） | `runs/r5/judgment.md` §3.1 O-1 行 | 136；145 | 主力 |
| R6-7 | R6 纪要 D5（O-3） | 级联下拉会越过视口右缘。改法：越界时向左展开，补 DOM 用例 | `runs/r5/judgment.md` §3.1 O-3 行 | 139 | 主力 |
| R6-8 | R6 纪要 D5（O-6） | 触摸端未固定的图钉平时不显（获焦才显）。改法：粗指针（`pointer: coarse`）下未固定的图钉常显 ink-3 | `runs/r5/judgment.md` §3.1 O-6 行 | 142 | 经济 |
| R6-9 | R6 纪要 D6（O-5） | Icon 板「禁填充」与 pin 实心态冲突。改法：Icon 板对 pin 加「实心态例外」并补画实心态（仓内 `Icon.dc.html` 与生成器） | `runs/r5/judgment.md` §3.1 O-5 行 | 142；148 | 经济 |
| R6-10 | R6 纪要 D6（O-9） | AOS 在 logos2 里没有标，AOS 示例借用 DS 标（G-2）。改法：不造 AOS 标、不借用 DS 标；AOS 示例改为不带产品标的写法，取改动最小且不违反「品牌资产只取通过稿」的一种；目视清单写明待品牌板补 AOS 标 | `runs/r5/judgment.md` §3.1 O-9 行 | 140；145 | 经济 |
| R6-11 | R6 纪要 D1、D7、D8 | 文档与清单跟上 R6：迁移说明从 M54 起追加（C8 字段、markText 量法、夜间 TMS 色、容器查询、标按钮宽度、级联向左、图钉常显、AOS 示例无标），开头区间、分消费方清单、末尾来源说明与 `CHANGELOG.md` 4.0.0 摘要同步；`storybook-map.json` 与 `.md`；`owner-acceptance.md` 改写成一份可一次看完的完整清单（本轮新增与变化的目视项、D8 维持现状的各项写明「现状与可改的方向」、待发布的成品板全表、三道门与 28 张 Story 的状态） | — | 150（GWT3 清单）；143（迁移） | 经济 |
| R6-12 | 批量处理原则第 4 条 | 生成物批末再生：所有改渲染的包合入后，按新截法只收预期内的视觉签名变化（逐条列理由与离群类别，预期外的停下记问题），重生 `docs/verification` 下的回执与门报告（含 `scaffold-proof.json`），回执都在 1,000,000 字节以下 | `runs/r4/handoff/N5.md`（SUB-224 的做法） | 147；149；150 | 主力 |

主线程另做、不进包：O-14（按板改 STORY-136 的字重文字）、O-20（按板改 STORY-144 的 Sheet 文字）、O-2（148-GWT1 读法写进注解）这三条链上正文与注解；以及合入 main、跑门与转 done。

## 2. 约束

- START「质量硬线」两段继续有效；违反的进返工，不降级。品牌资产（标、锁定块、文案、颜色、尺度）只取通过稿，派生只做取子集与居中；R6-3 的 `#7aa0f5` 是 Owner 授权下采用的设计会话建议值。
- 新增 token 尽量不做；R6-5 若必须新增（例如容器名或阈值），按契约改动处理（主力档），`tokens.json`、生成物头、迁移说明同步。不新增依赖、不改 `pnpm-lock.yaml`、不装浏览器。
- 改动让别的门期望过期的，同包对齐那条期望；门脚本不在本包文件集时交下一个持有者，写进交回。
- 批末一次 verify：30 步全绿加 `storybook:build`、`test:dom` 退出 0 才算 R6 完成；红的进 R7。
- 包数：并行不超过 3，每包不超过 150 响应；同一文件只归一个包（同波），共享登记处每波只归一个包；R6-11 与 R6-12 排在所有改渲染与改文档的包之后（R6-12 最后）。
