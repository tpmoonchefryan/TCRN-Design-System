# TCRN-DS-INIT-016 · R6 拆分问题清单

拆分时发现的矛盾、缺口与冲突。每条附建议与「默认」：默认是实施包在没有新指示时照做的处置（不阻塞工作，交回里回显），建议是给主线程或 Owner 的处理方向。行号是集成分支 HEAD 74b61fb 的位置。

1. **brief 写的量测工具路径不存在。** R6-2 写 `docs/design/gplus-2026-10/tools/measure-shell.js`；`tools/` 下没有这个文件，量测工具在 `docs/design/gplus-2026-10/measure-shell.js`（`tests/fixtures/geometry-measure/shell/manifest.json` 第 6 行的 `referenceScript` 也指这里）。
   - 建议：以实际路径为准，brief 不必改。
   - 默认：SUB-230 改 `docs/design/gplus-2026-10/measure-shell.js`，交回写明。

2. **「底盘（Tokens）板 kv」不在成品 Tokens 板里。** R6-4 要把「侧栏 212 · 顶栏 48」改 220 / 52。成品 `visual-standard/boards/Tokens.dc.html` 与它的生成器 `build-tokens.mjs` 都没有这句；全仓只在草稿底盘板 `gplus-2026-10/boards/V2-GPlus.dc.html` 第 300 行（DIFF-3 登记的板）和 `V2-Rejections.dc.html` 第 86 行（打回记录）出现。`V2-GPlus.dc.html` 没有生成器。
   - 建议：按 DIFF-3 的登记改草稿底盘板；打回记录是历史，不改。
   - 默认：SUB-236 直接改 `V2-GPlus.dc.html` 第 300 行（C-20 的唯一例外），成品 Tokens 板与生成器不动，交回写明 grep 读数。

3. **「Brand 板夜间说明」指哪块板。** S-6 与 DIFF-10 指的是第一批 Brand 草稿板 `V2-B1-Brand.dc.html` 的 A、F 段（`build-brand.mjs` 生成，make-standard 不把它搬进成品）。成品 `Brand.dc.html` 是 Logos 通过稿，E 段写「后缀用各自产品的深色（TMS #2c63c8 …）」，不分主题。改成品 Brand 板等于改通过稿的文字。
   - 建议：通过稿是否补一句夜间值，交设计会话定。
   - 默认：SUB-232 改 `V2-B1-Brand`（DIFF-10）与 07a B 段，成品 Brand 板不改；SUB-242 在目视清单写明「成品 Brand 板 E 段未写夜间值，待设计会话」。

4. **Story 145 的标题与 GWT3 和 R6-3 冲突。** 145 标题写「后缀 #2c63c8 两主题同色（夜间低于 4.5 记已知待裁）」，GWT3 写「夜间读 TMS 后缀色 THEN #2c63c8，矩阵对应格标红且注明待裁」；R6-3 落地后两句都不成立。brief 第 30 行主线程另做的链上正文只列 O-14、O-20、O-2。
   - 建议：主线程在 R6 链写里按纪要 D4 改 145 的标题与 GWT3（或写注解说明 D4 取代），与 O-14、O-20 同批。
   - 默认：SUB-232 按 136-GWT3 与 D4 判，不改 Story 文字，交回写明 145-GWT3 待主线程。

5. **ProductShell 的 `brandProductId` 必填，AOS 示例「不带产品标」没有现成写法。** `Navigation.tsx` 第 1949 行 `brandProductId: TcrnProductMarkId` 必填，标按钮必带标；改成可选是 prop 面的改动（C-7、C-12 授权外，且属主力契约改动）。三处借用里 `navigation-product-shell-spec` 还是 smoke 与 shell:parity 读的包级 ProductShell 契约证明。
   - 建议：接受 SUB-240 判据 ① 的两步写法；若 Owner 要 AOS 示例保留完整顶带，需要另开 Story 让 ProductShell 支持无标的标按钮。
   - 默认：SUB-240 先试 (a) 现有 props，不行走 (b)：AOS 视觉实例只留页内内容，契约证明改用 Design System 自己的标与名称；两者都不行就停下记问题，保留现状进 R7。

6. **R6-5 只写了阈值 1024，Sheet 的 760 没说。** 07b D 段「窄于 1024」一行同时管窄屏顶带与手机 Sheet（`shell-sheet.css.ts` 第 3 行注释），纪要 D5 又写「嵌在纸内的壳与独立页的壳都按自己的容器宽」；只改 1024 会出现桌面视口下 390 框里顶带已是窄屏、菜单却按视口开 952 面板的情形。
   - 建议：Owner 目视时确认。
   - 默认：SUB-234 让 760 的 Sheet 切换同样按壳的容器宽，阈值不变；Sheet 若是全窗口层、按容器切会破坏 C-14 的固定层条件，就保留视口并记问题。交回回显。

7. **文档页里的 07a 桌面屏块可能窄于 1024。** 文档正文列最宽 1040（`alpha-styles.ts` 第 95–100 行，`--tcrn-layout-content-max-w`），shell-top-band 等桌面屏块在 1440 下的宽未量过；改成容器查询后若小于 1024，会翻成窄屏，壳层门在 1440 读的固定项、下拉与标按钮第二版都会消失。
   - 建议：先量再定；这是容器查询的直接后果，不是 R6-5 的缺陷。
   - 默认：SUB-234 判据 ① 先量；有 < 1024 的桌面屏块就给它们定宽 1240（板屏宽）并让所在故事栈横向可滚（文档层，C-8 允许 S4 改 `alpha-styles.ts` 与 `story-content.tsx`）；这样做若让 browser-proof 的页面溢出或 axe 判红，停下记问题。

8. **D8 的条目清单不在 brief 里。** R6-11 要求「D8 维持现状的各项写明现状与可改的方向」，brief 没列 D8 覆盖哪些 O 号，拆分子代理读不到纪要原文。
   - 建议：主线程派 S8 时把纪要 D8 原文附在派工里。
   - 默认：按 R5 判断 §3.1 推定 D8 为 D2–D7 与主线程项之外的各项：O-7、O-10、O-12、O-13、O-15、O-16、O-17；SUB-242 交回写明这是推定。

9. **「改同一批文件的进同一个包」与单包 150 响应上限冲突。** R6-7、R6-5、R6-6 都改 `shell.css.ts`（约 40 + 95 + 55），壳层门文件被 R6-2、R6-3、R6-5、R6-6 改，`storybook-smoke.mjs` 被 R6-5、R6-6、R6-10 改，板与 heights / canvas 被 R6-3、R6-4、R6-9、R6-6 改；全并进一个包会超过 150。
   - 建议：接受按波次轮转持有者（`packages.md`「共享登记处归属」与「共享文件的先后」），代价是 5 个波次、墙钟更长。
   - 默认：照 `packages.md` 的 9 包 5 波做。

10. **R6-10 的档位。** brief 建议经济；它与 R6-6 改 smoke 里同一个 `navigation-product-shell-spec` 比对，并进主力包 S7。
    - 建议：接受。
    - 默认：随 S7 起主力，判据不因档位改变。

11. **「回执与生成物只由 R6-12 的包提交」与代码生成物。** 改 `tokens.json` 必须同提交重生五个生成物（头里带契约摘要），否则 tokens:proof、contract:proof 当场红；板由生成器写出，也是板改动的一部分。
    - 建议：把这条读作 `docs/verification/**` 只由 S9 提交。
    - 默认：C-9 已写明：五个代码生成物与生成器写出的板由改源的单同提交；回执、门报告、签名基线与 scaffold 回执只由 S9 提交。

12. **scaffold 回执的提交口径。** brief 要 R6-12 重生回执「含 `scaffold-proof.json`」；前几轮的惯例是 scaffold 两份回执只差时间与 HEAD 时还原。
    - 建议：读数或判定有变化才提交。
    - 默认：SUB-244 跑 scaffold:proof；`scaffold-proof.json` 与 `.md` 有实质变化就提交，只差时间、HEAD 就还原，交回写明是哪一种。

13. **148-GWT4 卡住画板修订的写法。** 第一批五矩阵格数 44 / 28 / 10 / 116 / 42 必须不变；Inputs 板的 rf 行、Icon 板的 pin 实心态如果画成带 `data-cell` 的矩阵格，格数会变，契约与生成物都要跟。
    - 建议：rf 与 pin 实心态只作样片与说明，不进对比度矩阵。
    - 默认：SUB-236、237 不加 `data-cell`；必须进矩阵时停下（C-14）。

14. **长字标是哪一枚、没有在拆分时核实。** R5 判断 O-1 只写「要 117，格 60」；`ShellBrandButton.test.tsx` 第 227 行对 design-system 断言了 title，推测是 Design System，但 Einzbern、Mana Orchestrate 也可能超出。文档站自己的壳用 DS 标，若 DS 超出，每个文档页的顶带都会变宽（签名大面积变化）。
    - 建议：SUB-238 开工先量四枚产品的字标宽。
    - 默认：SUB-238 判据 ② 照实测处理所有超出的产品，并在「预期签名变化」逐条列出。

15. **每个改渲染的包各跑一次 browser-proof。** S2、S4、S7 只为列「预期签名变化」各量一次，单次耗时较长；不量的话 S9 只能凭描述分来源，预期外的停下会更多。
    - 建议：保留。
    - 默认：三个包各在包末量一次、不应用（C-5、C-18）。

16. **`container-type` 对固定定位后代的影响未核实。** 规范与浏览器实现对容器是否同时带布局约束有过变化；若壳根成了固定定位层的包含块，完整菜单、下拉、Sheet、遮罩的位置会变，下拉现有的 `fixedLayerOrigin` 读法也会受影响。
    - 建议：实测为准。
    - 默认：SUB-234 判据 ③ 实测读数前后相同；做不到且本包修不了就停下（C-14）。
