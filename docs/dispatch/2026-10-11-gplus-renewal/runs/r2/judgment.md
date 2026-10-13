# INIT-015 R2 · 判断

被判对象：集成分支 `claude/init015-gplus-renewal`，HEAD 10496cb（批末 verify 跑在 e643d74，其后只改 runs/ 下的调度文档）。输入：三片验收 `R/acceptance/A.md`、`B.md`、`C.md`，主线程问题清单 `R/problems/main.md`（RM1–RM19），批末表 `R/verify/steps.md`，R1 判断 §3.1、§3.4、§4、§5，R2 拆分第 1、2 节与 `R/subtasks.json`，`runs/state.md` 的 R2 包表，链上读回（会话 scratch `chain/`）。判断进行中收到设计会话对 O-1…O-12 的 B 类裁定（2026-10-11，RM19，Owner 事后可更正）：O-1…O-4 按裁定写，O-5…O-12 按 R1「未答复时」默认执行。`R` = `docs/dispatch/2026-10-11-gplus-renewal/runs/r2`，路径相对集成工作树。本判断只读，没有改代码、门、回执或链，没有重跑门；为定 R3 改法做过只读探查（token 集、壳层规则、brand 段、WORDMARK_EXEMPTIONS、映射差异、几何必测项、Story 的 GWT 与判定人），脚本与输出在会话 scratch `tmp/r2-judgment/`。

读法（节行号）：§1 第 7 行；§2 第 36 行（§2.1 第 40 行，§2.2 第 60 行，§2.3 第 189 行）；§3 第 194 行（§3.1 第 198 行，§3.2 第 218 行，§3.3 第 228 行，§3.4 第 243 行，§3.5 第 252 行，§3.6 第 269 行）；§4 第 277 行（§4.1 第 281 行，§4.2 第 342 行，§4.3 第 369 行，§4.4 第 384 行，§4.5 第 389 行，§4.6 第 393 行）；§5 第 398 行（§5.1 第 400 行，§5.2 第 415 行，§5.3 第 425 行，§5.4 第 443 行）。

## §1 R2 结论表

R2 验收：通过 8 张（121、122、123、124、125、126、128、132），阻塞于 Owner 4 张（127、129、130、131，都卡在 O-1），不通过 3 张（120、133、134）。设计会话随后裁定授权 O-1，四张阻塞单改为 R3 实施。批末 30 步红 6 步（R1 为 11 步），每一步都有去向。

| Story | R2 结论 | 未满足或阻塞的 GWT | 关键缺口 | R3 去向 |
| --- | --- | --- | --- | --- |
| 120 色彩 token | 不通过 | GWT5 | 余红全部归他片或 O-1，本单已无根因 | 无本单返工；R3 后 verify 全绿即转 done |
| 121 字体与形状 | 通过 | — | — | 本次转 done |
| 122 契约数据 | 通过 | — | 4 条字面值按 O-6 默认保留 | 本次转 done；文档回写挂 133（R3-3、R3-17） |
| 123 Typography | 通过 | — | — | 本次转 done |
| 124 Icon | 通过 | — | 判定人含 Owner 目视，未代签 | 本次转 done |
| 125 Actions | 通过 | — | O-5、O-9 按默认维持 | 本次转 done |
| 126 Inputs | 通过 | — | 静态展开态横排（B2-1），验收点在 129 | 本次转 done；R3-7 挂 129 |
| 127 Brand | 阻塞于 Owner | GWT4 | 收起宽仍是 92 | R3-1、R3-2、R3-11 |
| 128 文档层清零 | 通过 | — | 原型残留、style-scale 过时 | 本次转 done；R3-13（挂 134）、R3-18（挂 133） |
| 129 矩阵与样板 | 阻塞于 Owner | GWT3 | rail 偏 33，纸离边没有门量 | R3-1、R3-4、R3-7 |
| 130 映射 | 阻塞于 Owner | GWT1 样板 10 行 | 样板行只红 rail | R3-1 后转绿；R3-8、R3-14；判定人为 Owner |
| 131 DOM 测量门 | 阻塞于 Owner | GWT4 | 只红样板 rail | R3-1、R3-4 后复验 |
| 132 契约静态门 | 通过 | — | 7 种 title 非英文半译（不阻断） | 本次转 done；R3-16 挂 134 |
| 133 门接入 verify | 不通过 | GWT1 部分 | 真实 verify 停在第 10 步；4 项非 Owner 红 | R3-3、5、6、9、10、12、15、17、18 |
| 134 4.0.0 候选 | 不通过 | 前置条件；基线未写入 | A2-1、A2-3 | R3-13、16、19、20；判定人为 Owner |

更正（以验收为准；记在本判断与链上注解，不改写 R2 的运行文档）：

1. 第 30 步 mobileHashAnchorOcclusionCheck 不归 C-21/O-1。四次读数的失败字段都是 `mobile-layer-transparent:searchInput:rgba(0, 0, 0, 0)`，标题与正文都在顶栏下可读。SUB-064 让文档顶栏搜索包裹层按 G+ 不作画后，门的锚点循环（`scripts/internal-alpha-browser-proof.mjs:1789–1797`）没有沿用知识库壳循环（:2116–2129）已有的 G+ 透明层放行（C2-3）。steps.md 红步表、P12 问题 3b、RM16 ⑤、RM18 的这条归因作废。
2. 三条 zh-CN 漏译来自 496c1d7（SUB-064 改 oracle 值），不是 RM16 ④ 写的 28933c7。
3. 第 17 步另两项（designSystemVisualInstanceParityReadback、ownerQualityProductShellProof）与第一项同根，全是 `searchInput:focus-outline-width:3px`，不是包裹层作画（B §5 第 27 行）。
4. SUB-046 基线写入的阻塞面：R2 末为 O-2（axe 12）、C2-3、C2-4；O-1 授权后 O-2 随之解决，三项都落在 R3，已没有 Owner 阻塞（条件见 §5.3）。

## §2 R3 返工清单（去重后）

规模：19 条新返工（R3-1 至 R3-19），主力 11、经济 8；另有批末重做 R3-20，沿用 SUB-076、SUB-078、SUB-046，不开新单。档位按 START：改共享契约（token 键集、contract/*.json、导出面、门的判定语义）起主力，孤立修复起经济；同一修复目标退回 1 次升主力；主力项再退回即停下写进收口文件交 Owner（标「再退回交 Owner」）。R2 拆分第 1 节第 12 条另写「经济档项升主力、单独成包」，R3-7 按此单独成包。

### §2.1 去重对照

| 来源 | 归入 |
| --- | --- |
| A2-1 | R3-20（SUB-046 重做时加跑 internal-vocab:scan） |
| A2-2 (a)(b)(d)；(c) | R3-17；R3-3 |
| A2-3 | R3-19 |
| B2-1 | R3-7 |
| B2-2 = C2-2 | R3-5 |
| B2-3 | R3-17 |
| C2-1 | R3-9 |
| C2-3、C2-4、C2-5 | R3-6、R3-15、R3-16 |
| C2-6 | style-scale → R3-18；contract README 第 47 行 → R3-17；inputs.css.ts:166 注释 → R3-7；storybook-visual-proof.mjs:62–64 与 storybook-map.md「读法」第 5 条 → R3-8 |
| C2-7、C2-8 | R3-13、R3-8 |
| RM19 O-1 | R3-1（包壳几何与 token）、R3-4（纸离边与顶栏测量）、R3-10（C-21）、R3-11（收起读数） |
| RM19 O-3、O-4 | R3-2 与 DIFF-10（R3-8）；R3-8（DIFF-3、DIFF-2）与 R3-14（构图三） |
| C §5 的三条「有条件」：P5 第 1 行、P9 SUB-084 行、P11 RM17 ③ 行 | R3-12、R3-17、R3-18 |
| RM18 color-palette 宽限 note「39 格」 | R3-18 |
| 不进 R3 | RM16 ①②、RM12 ⑤、RM6（维持）、RM10 与 §3.4 第 3 项（画板修订）、P9 #4、RM18 手机截图空白；见 §3.3、§3.6 |

### §2.2 逐条

**R3-1 ProductShell 按构图一改几何，补壳层 token（O-1）** · 主力 · 父单 STORY-129 · 包 R3-P1

- 现象：`packages/ui-react/src/styles/base.css.ts` 的 ProductShell 侧栏宽 280px、收起 92px，都是字面量（:156、:169）；侧栏底为 acc-bg 洗底（brand-secondary-bg），带 1px 右边线；主区 padding space-5，没有纸面；壳顶栏 min-height 68px（:289 一带）。样板 rail 实测 guideLefts [16, 49]、textLefts [48, 77]，偏 33。构图一要求引导列 16/48、纸离边 12（圆角 14 加 s1）、顶栏 52、侧栏 220、收起 52、侧栏画布色无右边线。
- 改法：
  1. 契约 fixed 段新增 4 个 token，index.ts 注册，经 contract-generate 与 tokens-sync 生成：`--tcrn-shell-sidebar-width` 220px、`--tcrn-shell-sidebar-width-collapsed` 52px、`--tcrn-shell-topbar-height` 52px、`--tcrn-radius-paper` 14px。其余用现有 token：16 = space-4，12 = space-3，阴影 shadow-s1，画布色用壳根已用的 canvas 色，48 用现有 token 的 calc 组合，不再新增。
  2. ProductShell：保留已登记的局部变量 `--tcrn-product-shell-sidebar-width`（消费方仍可覆写），默认值改引两个宽度 token；侧栏改画布色、去右边线；引导列 16/48 只经壳作用域内的间距做到，不改 NavItem 的结构、API 与状态行为；主区成为纸面（离边 12、圆角 radius-paper、阴影 s1，底色以构图板为准）；壳顶栏高度引 topbar token。收起态宽 52、文案 display:none（已有）、标 22 不缩放，内边距取现有 token，放得下 38px 收起钮（O-5 默认维持）。
  3. 移动断点以下的壳行为不改。独立的 `.tcrn-top-bar`（TopBar，:443 一带）不改，顶栏 52 只作用于壳顶栏。
  4. `apps/storybook/src/contract-stories/gplus/samples/composition-one.tsx` 去掉 220 的局部覆写，注释同步。
  5. 本包跑 storybook:smoke、shell:parity、geometry:proof、full-surface:proof、internal-alpha browser-proof；因旧几何（280、92、68、洗底、右边线）转红的期望逐条写进包问题文件，交持有包（R3-5、R3-6、R3-9、R3-10），不改别包文件。交回列出所跑全部门的结果。
- 停下条件：做到 16/48 或收起 52 必须改 Navigation 家族组件的结构、API 或状态行为时；需要第 5 个新 token 时。写进包问题文件，收口交 Owner。
- 改动文件：`docs/design/gplus-2026-10/contract/tokens.json`、`scripts/contract-generate.mjs`、`packages/ui-tokens/src/index.ts` 与测试、`gplus-tokens.generated.ts`、`tokens.css`、`apps/storybook/src/storybook.css`（token 块）、`base.css.ts`、钉着壳几何的 ui-react 测试（以 grep 为准，含 Navigation.test.tsx）、composition-one.tsx。
- B 类裁定：4 个新 token 属 O-1 授权的直接需要。C10 硬线要求壳层几何逐值来自 token，裁定又要求不写字面量，而现有 token 没有 14 的圆角，也没有 220、52 的尺寸。O-6「未答复时不新增 token」管组件内字面几何（按钮内图标、开关、末端区等），不覆盖壳层几何。名字可在值不变的前提下调整，交回写明。
- 依赖：无前置；与 R3-2、R3-3 同包（同改契约与生成器），包内先做。R2 未改过同一目标。

**R3-2 TMS 夜间后缀改 #7aa0f5，撤两条夜间豁免（O-3）** · 主力 · 父单 STORY-127 · 包 R3-P1

- 现象：contract/tokens.json 的 brand 段 4 条都是单值，`brand-suffix-tms` #2c63c8 写在主题无关块（tokens.css:117）。`scripts/token-contrast-proof.mjs:73–74` 登记两条 dark TMS 豁免（夜间 panel 3.13、bg 3.33）；axe 豁免从同一份 WORDMARK_EXEMPTIONS 导入（internal-alpha-browser-proof.mjs:22、:65）。
- 改法：tms 一条加夜间值 #7aa0f5，ref `marks.json#tms.palette.bright`（marks.json 第 21 行）。生成器 brand 形状支持可选夜间值：带夜间值的条目同时写进浅色块与夜间块，两块属性集仍相同（C5 不变）；其余三条不变。删 token-contrast-proof.mjs:73–74 与测试里对应的钉值，axe 豁免随导入收窄。DS #6577f3 不改（本判断按 token 复算，夜间于 bg 约 4.9、于 panel 约 4.6）。
- 改动文件：contract/tokens.json、contract-generate.mjs、生成物、tokens.css、storybook.css token 块、token-contrast-proof.mjs、`tests/token-contrast-proof.test.mjs`、钉着后缀两主题同值的单测。
- B 类裁定：裁定写「只改 brand 项并重生」；生成器现只认单值 brand，加夜间值形状是直接后果（R1 O-3 建议原文含「生成器 brand 形状」）。127-GWT3「TMS 为 #2c63c8」沿用 R1 口径只判浅色。Brand 板夜间说明仍写 #2c63c8（V2-B1-Brand.dc.html 第 243 行一带），记 DIFF-10，画板随下一次修订改。
- 依赖：同包，在 R3-1 的 token 新增之后做。

**R3-3 inputs.pairs.ts 段注释补 rf（A2-2 (c)）** · 经济 · 父单 STORY-133 · 包 R3-P1

- 改法：改 `inputsFile()` 写出的注释字串「d/h/f/x/r/e/ef」，补 rf 后重生成；只变注释，generated-sources 仍绿。文件：contract-generate.mjs、`packages/ui-react/src/styles/generated/inputs.pairs.ts`。同改生成器，所以放 R3-P1。

**R3-4 几何门补「纸离边 12」「顶栏 52」实测** · 主力 · 父单 STORY-131 · 包 R3-P2

- 现象：geometry-measure 对样板只量 rail（`scripts/lib/gplus-measure.mjs:344` 起），129-GWT3 的「纸离边 12」现只能靠目视（C §4、§6 第 5 条）。
- 改法：加一个必测项（建议名 shellFrame）：在每个 `[data-shell]` 内读纸面离壳边的距离与壳顶栏高度；阈值 12、52 与容差写在门里，目标元素用包类，不在 story 加钩子；变异两条（离边归零、顶栏回 68）各判红；SAMPLE_CHECKS 加该项，storybook-map.json 十个样板行的 requiredChecks 同步（P8 的逐 story 断言会核对），自检与测试同步。131 正文的「八项」按全部必测项读，加项后十项，「全绿」不变。
- 改动文件：gplus-measure.mjs、`scripts/geometry-measure-proof.mjs`、`tests/geometry-measure-proof.test.mjs`、`docs/design/gplus-2026-10/storybook-map.json` 与 `.md`。
- 依赖：R3-P1 合入后切出；与 R3-8 同包。R2 未改过同一目标。

**R3-5 冒烟比较器在 outline-style 为 none 时不比 outline-width（B2-2 = C2-2）** · 主力 · 父单 STORY-133 · 包 R3-P2

- 现象：第 17 步 14 条失败全是 `searchInput:focus-outline-width:3px`；期望 `scripts/storybook-smoke.mjs:293` 为 `outlineWidth:"0px", outlineStyle:"none"`。SUB-059 删掉壳内 `outline:0` 后，Chromium 149 在 style 为 none 时报初始值 3px，视觉无差。
- 改法：focus 比较在 outlineStyle 为 none 时不比 outlineWidth 与 outlineOffset，三个子证明共用；不在包里回加 `outline:0`；单测补正反两例。R3-P1 问题文件列出的、钉着旧壳几何的冒烟或 full-surface 期望，按新 token 值改，逐条在交回列前后值。
- 改动文件：storybook-smoke.mjs 与单测；必要时 `scripts/full-surface-remediation-proof.mjs`。`apps/storybook/src/smoke.test.ts` 归 R3-P3，需要改时记问题文件。
- B 类裁定：门里记录旧壳几何的期望按 O-1 改成新值，是授权的直接后果，不算改质量阈值（R3-6 同）。R2 未改过同一目标。

**R3-6 锚点循环沿用 G+ 透明层放行（C2-3）** · 主力 · 父单 STORY-133 · 包 R3-P2

- 改法：锚点循环（internal-alpha-browser-proof.mjs:1789–1797）对 searchInput、themeToggle 两层沿用 gplusMobileHeaderFillLayers（:40–48），与知识库壳循环一致；header 不透明底层的要求不放宽；加正反用例。R3-P1 问题文件列出的本门旧几何期望一并改。落地后 SUB-046 不再有这项阻塞。R2 未改过同一目标。

**R3-7 MultiSelect 容器改纵向（B2-1）** · 主力（由经济升）· 再退回交 Owner · 父单 STORY-129 · 包 R3-P5

- 现象：`packages/ui-react/src/styles/inputs.css.ts:517` 一带为 `display:flex;align-items:center`（SUB-061），矩阵静态样例原位展开的列表排到触发器右侧，宽约 110px，选项折行；运行时列表经 OverlayBoundary fixed，不受影响。
- 改法：容器改 `flex-direction:column; align-items:stretch`（或单列 grid）；30px 末端区与 caret 不动，门的比对字段不改；同文件第 166 行过时注释顺手改；owner-acceptance 第 169 行由 R3-19 改为复核项。
- 复核：full-surface 两例 ok；inputs-matrix 两轮 42/42 且 controlHeight pass；visual-proof inputs.A、inputs.B 绿；截图里列表在触发器下方同宽。
- 理由：R2 的 SUB-061（P4 经济档）改过同一目标。126 本轮转 done 不重开，验收点在 129 的矩阵 story，挂 129。

**R3-8 映射差异记录与注释更正（C2-8，并 O-4、O-3）** · 经济 · 父单 STORY-130 · 包 R3-P2

- 改法（storybook-map.json 的 differences 与 refs；`.md` 同步）：
  - DIFF-1：R3-1、R3-4 落地且样板行转绿后，状态改「已按 O-1 实现（设计会话 B 类裁定）」，refs 加 O-1；没转绿只加引用。
  - DIFF-3：「已裁定：以构图板 220/52 为准（O-4，设计会话 B 类）」。
  - DIFF-2：「已裁定：构图三样板随 O-1 补（O-4）」，story 写 R3-14 的实际形态；新增构图三映射行（requiredChecks 只取任意页四项）、REQUIRED_CHECKS 条目与 story 清单。R3-14 停下时改记「待 Owner：页面模板批次」，不加映射行。
  - DIFF-8：「待 Owner 知悉：第二批品牌」。DIFF-9：「待 Owner 知悉」，refs 写 R2-25 与 SUB-072 判据。
  - 新增 DIFF-10：Brand 板夜间说明写 TMS #2c63c8，包按 O-3 为 #7aa0f5；「已裁定（O-3，设计会话 B 类）」。
  - 改 storybook-map.md「读法」第 5 条与 `scripts/storybook-visual-proof.mjs:62–64` 的过时注释。报告由 R3-20 再生，不手改。
- B 类裁定（DIFF-9）：B 认为删整列在 SUB-072 判据授权内、可记「已裁定」；C 认为画板上看得见、应比照 DIFF-7 记「待 Owner 知悉」。两者不矛盾：做法在授权内，不恢复该列；但「已裁定」会被读成有人对画板差异做过裁定，而 R2-25 只是返工项，所以状态取 C 的措辞；owner-acceptance.md:129 已列知悉，不另立 Owner 事项（取 B）。
- 依赖：与 R3-4 同包；DIFF-2 的映射行要等 R3-P0 合入。

**R3-9 导航壳故事的搜索面板压住正文（C2-1，承接 SUB-080）** · 主力 · 再退回交 Owner · 父单 STORY-133 · 包 R3-P3

- 现象：navigation-product-shell-spec 的静态结果面板（420×138，top 230）压住 h3 与首段，searchOverlay 三态 ok false，真实 verify 停在第 10 步。根因两处：门写死 `openMenus === 8`（`scripts/geometry-proof.mjs:227、:251`），其中两个是 SUB-066 退役的原型菜单钮；R1 删了让结果留在版面内的文档规则（`doc-class-map.json:39` 把 `tcrn-product-shell-search--static-display` 误判为尺寸修饰），门的变异样式（:449）与包默认绝对定位相同。
- 改法：
  1. 期望改为 6，提交说明逐个列出被数的 6 个菜单，引 SUB-066 退役。
  2. story-content.tsx 的 search 入参恢复一个 `tcrn-doc-` 前缀的类（不用原名，否则 128-GWT1 的包外类回到 1）；文档规则在该容器内让 `.tcrn-product-shell-search__results` 取 position static、inset auto、width 100%、margin-block-start space-2；position 与 inset 不在守卫摆放属性内，按 EX-INIT015-doc-* 登记例外（裁定引本条，删除条件「Navigation 家族批次由包提供静态结果展示」）；doc-class-map 该条改 rename-tcrn-doc 写新名，baseline.json 不改。
  3. 判据：baseline 与 restored 绿，broken 红。
- 改动文件：geometry-proof.mjs、`apps/storybook/src/contract-stories/story-content.tsx`、`apps/storybook/src/alpha-styles.ts` 或 `story-demo-styles.ts`（storybook.css 由 demo-styles-sync 写）、`scripts/shell-fidelity-proof.mjs`、`docs/design/gplus-2026-10/doc-class-map.json`。
- 理由：改门的计数与守卫例外。R1 C-16 → SUB-080 已由 P6 主力包执行后退回（RM15），再退回即交 Owner。
- B 类裁定：8 → 6 是已定原型退役（R1 §3.4 第 4 项）的直接后果，不是改质量阈值：两个菜单随原型一起不存在。条件：被数的 6 个必须正好是原 8 个减去两个原型菜单钮，逐个核对，对不上就停下。不取「只数 searchStory 内的展开元素」：那会改计数范围即判定语义，超出所需。静态展示用文档前缀类加登记例外而不改包：包的绝对定位是正确的运行时行为，Navigation 家族不在授权内；例外沿用 §3.4 第 8 项的写法。
- 依赖：R3-P1 合入后切出（壳几何会移动面板）；与 R3-10 至 R3-13 同包。

**R3-10 文档壳跟随包壳几何（C-21）** · 主力 · 父单 STORY-133 · 包 R3-P3

- 现象：第 11 步 shell:parity 红在文档壳 brand-lockup、sidebar、shell-relations 三角色，brandLockup 矩阵 4/4 红，sampleShell 2/9 红；C-21 在 R2 按 §3.4 第 10 项暂缓到 O-1 之后。
- 改法：tcrn-doc-* 规则按 R3-1 落地后的包壳几何对齐（侧栏 220 与收起 52、画布色无右边线、顶栏 52、品牌锁定关系）。P5 按 C-21 登记的两条例外（文档壳品牌收起、窄屏品牌隐藏）删除条件「O-1 答复」已满足：删例外，改为跟随包的行为。完成后 shell:parity 三角色与矩阵转绿。复核 N-1：文档导航分类计数（ink-3）随侧栏画布色，于 bg 浅色 4.86、夜间 4.89，不改字色。手机视口文档顶栏高度（P9 #4）不在本条，除非门转红。
- 改动文件：alpha-styles.ts、story-demo-styles.ts、storybook.css 文档块、shell-fidelity-proof.mjs（删两条例外）；必要时 `apps/storybook/src/build/foundation-visual-standards.ts` 的文档壳 oracle，只改受壳几何影响的值。
- 理由：删守卫例外、改 oracle 期望，属门的数据。

**R3-11 收起 52 的读数（127-GWT4）** · 主力 · 父单 STORY-127 · 包 R3-P3

- 改法：geometry-proof 的 brand 检查（navigation-product-shell-spec 收起态）加读数：侧栏宽 52、标 22×22、文案 display none；变异（宽回 92 或标被缩放）判红。现在只有 CSS 与 brand 变异（10 号 red、green true）。文件：geometry-proof.mjs 与测试。

**R3-12 守卫：换行属性不得对 C7 单行承载类放行（C §5 P5 第 1 行的条件）** · 主力 · 父单 STORY-133 · 包 R3-P3

- 改法：shell-fidelity 规则级守卫对 roles.json 登记的单行承载类，不把 white-space、overflow-wrap、word-break 算作摆放；加变异（文档 CSS 把 `tcrn-button__label` 改回折行，判红）。这是验收接受 P5 口径时附的条件。文件：shell-fidelity-proof.mjs 与测试。

**R3-13 原型退役残留与导出面（C2-7）** · 主力 · 父单 STORY-134 · 包 R3-P3

- 改法：删 `.tcrn-doc-shell-demo--compact` 文档规则（story-demo-styles.ts:563，同步 storybook.css:870）、`apps/storybook/src/contract-stories/content/component-rows.ts:32、:34` 两行与 `content/navigation-rows.ts` 无人用的 denseShell* 导出；ui-react 导出面 `componentLibraryDeferredPrototypeNames` 去掉两名（`packages/ui-react/src/index.tsx:153、:155`），改 `index.test.tsx:82、:84`；复核 smoke.test.ts:842、:844，只剩清单行能命中就删。CHANGELOG 与迁移说明各一行由 R3-19 写。Owner 若更正 §3.4 第 4 项、保留原型，本条作废。
- 理由：改导出面。128 本轮转 done 不重开，导出面属 4.0.0 候选，挂 134。

**R3-14 构图三样板（DIFF-2，O-4）** · 经济 · 父单 STORY-130 · 包 R3-P0

- 改法：新增 `apps/storybook/src/contract-stories/gplus/samples/composition-three.tsx`，在 sample-stories.tsx 注册：无侧栏、顶部一条导航、内容居中 1040。只用包的公开组件与 props（如 TopBar）；1040 作样板局部登记变量（同构图一当初的 220），不新增 token；文案优先复用现有样板词条，新增词条五语齐、不带工单键；不加 `[data-shell]`。高度超预算时交 R3-20 刷新宽限表。映射行与必测项由 R3-8 接。
- 停下条件：须给 ProductShell 加无侧栏布局、给 TopBar 加导航 API 或改结构时停下，收口交 Owner（建议构图三改记页面模板批次）。TopBar 独立高度与构图板不一致时写进 DIFF-2 的 story 文字，不改 TopBar。
- B 类裁定：1040 不新增 token。它是页面模板一级的摆放值，不是 O-1 列出的 ProductShell 几何；C10 管包内壳层几何。

**R3-15 foundation-visual-standards 三条 zh-CN 新漏译（C2-4）** · 经济 · 父单 STORY-133 · 包 R3-P0

- 改法：`apps/storybook/src/build/locales/storybook-content-text.ts:1301` 的词典键与五语值由 36px 改为 32px，与 story-content.tsx:1482 用 oracle 值拼出的串一致；不加豁免。B 类裁定：取改键而不取拼接（C 判两种都可接受），以免碰 R3-P3 持有的 story-content.tsx。

**R3-16 七种「标签 — 原因」title 非英文半译（C2-5）** · 经济 · 父单 STORY-134 · 包 R3-P0

- 改法：按 I1 交回的探针清单，给只有一边在词典里的 7 种组合补另一边的五语词条（locales 下按持有方的文件）。132 本轮转 done 不重开，属候选版可见文案，挂 134。

**R3-17 契约与设计目录文档回写（A2-2 (a)(b)(d)、B2-3、P9 条件）** · 经济 · 父单 STORY-133 · 包 R3-P0

- 改法：`docs/contract/README.md` 第 47 行按 P3 问题 P2 的正文改，并写明 internal-alpha clipped 判定接受最近带 title 的祖先、与收紧后的 C7 有差异；`docs/design/gplus-2026-10/README.md` 第 12 行补 rf，第 16 行补 29 条刻度 token、链接对表与生成进 gplus-tokens.generated.ts，加一句「浅色选择器由契约夜间选择器的属性派生」（不改契约值）；`docs/contract/roles.json` 的 description 写明第一批承载元素的 title 须含可见文字。复核 readme:proof、public-output:scan、internal-vocab:scan、contract:static 不转红。

**R3-18 style-scale 与门清单文档（C2-6）及两条条件项** · 经济 · 父单 STORY-133 · 包 R3-P4

- 改法：`docs/style-scale.md`「Three gates hold that line」与第 179–187、232–237 行，按 shell-fidelity-proof.mjs 的 PLACEMENT_PROPERTIES 与 DOC_PACKAGE_CLASS_EXCEPTIONS 现状改写（含 R3-9 新例外、R3-10 删掉的两条、R3-12 的承载类排除）；foundation-visual-standards.ts 那个字段去掉计划键 pre-INIT-001、INIT-002（C §5 P11 行条件）；color-palette 宽限 note「39 格」按现状改（`scripts/lib/story-budget.mjs`，若 R3-20 刷新则并入）。依赖 R3-P3 合入。

**R3-19 目视清单、CHANGELOG、迁移说明与 README 回写（A2-3，并 R3 改动）** · 经济 · 父单 STORY-134 · 包 R3-P4

- owner-acceptance.md：「待 Owner 裁定」表现有各行注编号（第 1 行 O-1 与 O-4，第 2 行 O-3，第 3 行 O-5，第 9 行 O-11）；O-1…O-4 标「设计会话 B 类裁定（2026-10-11），Owner 可更正」，O-5…O-12 标「按默认执行」；补 O-2、O-6（含 RM8 四条）、O-8、O-9 四行，可附 N-1；第 228 行 P18 按 R3-20 结果写现状；第 169 行改为复核项；新增目视项（构图一壳几何、TMS 夜间后缀、构图三样板）挂进构图板那一节，节数仍为 10。只写事实与建议，不代 Owner 勾选。
- CHANGELOG 4.0.0 与 `docs/migration-4.0.md`：侧栏 280→220、收起 92→52、顶栏 68→52、纸面离边与圆角、侧栏画布色无右边线（消费方仍可经局部变量覆写宽度）；4 个新 token；TMS 夜间后缀；导出面去掉两个原型名；MultiSelect 容器纵向。门的判定变化只写进 CHANGELOG（沿用 P11 口径）。
- `packages/ui-tokens/README.md` 三块结构的计数与 brand 说明、`docs/design/gplus-2026-10/README.md` 的新 token 与 brand 夜间值一句，按落地事实改。不写发布或验收结论。依赖其余五包合入。

**R3-20 批末重做（不开新单）** · 经济 · 包 R3-P4

- SUB-076（映射报告）、SUB-078（几何报告）、SUB-046（视觉基线与回执）在 R3 末各重做一次；SUB-046 的再生清单加 `pnpm internal-vocab:scan`（A2-1），`pnpm scan` 放在最后一次文档提交之后。条件与顺序见 §5.3。

### §2.3 验收判「不可接受」的口径

1. B §5 第 26 行（RM7 ① 把「列表在触发器右侧」列为待 Owner 目视）：采纳 B。这是 SUB-061 横排容器的机械后果，不是视觉取舍；R3-7 修，R3-19 把第 169 行改为复核项。去掉 data-choice-presentation 钩子仍可接受，C §5 P7 行的条件随之满足。
2. C §5「P12 与主线程」行（手机锚点归 C-21/O-1）：采纳 C。R3-6 修门；归因更正记在 §1 与链上注解（120、133、134、INIT），不改写 R2 的 steps.md、P12 交回与 problems；SUB-046 阻塞面按 §1 更正 4。

## §3 只有 Owner 能定的事项

在 R1 §3.1 的编号上合并 R2 的更正与补充。已由设计会话裁定的写「Owner 更正时」；按默认执行的写现做法与更正后的改法。

### §3.1 已由设计会话裁定（B 类，Owner 事后可更正）

**O-1 构图一壳层几何：已授权。**
- 范围：只有引导列 16/48、纸离边 12（圆角 14 加 s1）、顶栏 52、侧栏 220 与收起 52、侧栏画布色无右边线；数值取自 token；Navigation 家族其余行为、结构与 API 不动，留第二批。设计会话的依据：127-GWT4、129 判据、131 样板 rail 是 Owner 已批正文，禁用清单不许通用件拼壳，INIT 正文与判据冲突时以判据为准。
- R2 的更正与补充：第 30 步手机锚点不受 O-1 影响（C2-3），从 O-1 影响列表与 SUB-046 阻塞列表删去；授权后补「纸离边 12」「顶栏 52」测量（R3-4）、C-21（R3-10）与收起读数（R3-11）；现有 token 缺 4 个（R3-1），判属授权的直接需要。
- 仍受影响：127-GWT4、129-GWT3、130-GWT1 样板 10 行、131-GWT4、第 11、18、19 步，进而 120-GWT5、133-GWT1 与 134 前置。
- Owner 更正时（不授权）：按 R1 §3.1 O-1「Owner 不授权时」处理，撤回 R3-1、R3-4、R3-10、R3-11 与 DIFF 状态（约一个主力包），52px 两条判据移到 Navigation 批次（改判据须 Owner 明示），样板 rail 按包现行几何记差异，C-21 按包壳现行几何对齐。
- 提示：这一项本质是 INIT 范围与 Story 判据的冲突，设计会话按 B 类处理；本判断照此执行，不另作 A 类裁定，收口列给 Owner 确认。

**O-2 标语与壳品牌说明的对比：随 O-1 解决，不另做豁免。**
- 合并 N-1：文档导航分类计数（ink-3 落在 acc-bg 洗底上，4.35:1）机制相同，随 R3-10 一起解决。
- R3 末复核第 30 步 axe 为 0（ink-3 于 bg 浅色 4.86、夜间 4.89）。若仍有这两类节点：不自行加豁免，收口交 Owner 在「字标豁免」与「改 ink-2」之间二选一（R1 原建议）。Owner 更正时同此二选一。

**O-3 夜间品牌后缀色：TMS 夜间 #7aa0f5，DS 不改，撤 token-contrast 与 axe 的两条 TMS 夜间豁免，只改 brand 项并重生。**
- 合并 RM6（axe 字标豁免不分主题与承载面）：维持（§3.3 第 3 条）。O-3 与 O-1 落地后豁免只剩 DS 浅色两条，夜间样板侧栏的 6 个 DS 后缀节点随画布色约 4.9，不再依赖豁免。
- R3 落点：R3-2；DIFF-10。Owner 更正时：撤回夜间值与生成器形状，恢复两条豁免（主力小改）。

**O-4 映射待裁差异：DIFF-3 以构图板 220/52 为准；DIFF-2 构图三样板随 O-1 授权、R3 补。**
- 合并 DIFF-9（主线程归类）；DIFF-8、DIFF-9 设计会话未提及，由本判断定（§3.3 第 1、2 条）。R3 落点：R3-8、R3-14。Owner 更正时：DIFF-2 改记页面模板批次并撤回构图三（经济）。

### §3.2 按默认执行（设计会话指示 O-5…O-12 按 R1「未答复时」）

- O-5 外壳切换钮尺寸：维持（36 胶囊、38、44）；R3-1 收起 52 须放得下 38 钮。更正时：桌面两枚改 IconButton md 32 加 radius-control，随第二批或另开。
- O-6 组件内字面几何：不新增 token。合并 RM8：typography.scale 余 4 条字面值（numeral-inline 16px、numeral-large 44/48px、mono 11.5px）保留，Typography.test 钉住。R3-1 的壳层 token 不属 O-6。更正时：typography.json 补 4 条刻度 token 并注册（主力）。
- O-7 Typography API：维持（numeral 不截断、给 title）；R3-17 只改 roles.json 的 description。
- O-8：保持 B1，目视清单点名确认（R3-19）。
- O-9：edge 抬升层浅墨字面量维持（dist:174）；R3-19 在清单补一行。
- O-10：已按建议执行（tokens.json:49 注释），收口回显。
- O-11：不加 3500 字。O-12：维持；本判断不对许可合规下结论。

### §3.3 本判断作出的 B 类裁定（收口回显，Owner 可更正）

1. DIFF-8 记「待 Owner 知悉：第二批品牌」，不补 story：所在的 V2-B2-Logos-Draft 是第二批草稿板，INIT 不授权第二批家族；R1 原建议相同。
2. DIFF-9 记「待 Owner 知悉」，不恢复资产 ID 列（R3-8）。
3. RM6：axe 字标豁免维持「后缀选择器 + 登记色」匹配，不加主题条件；回执继续逐节点列出（C §4 O-3 的建议）。
4. searchOverlay 期望 8 → 6；静态展示用文档前缀类加登记例外（R3-9）。
5. 4 个壳层 token 的新增与命名（R3-1）；构图三内容宽不新增 token（R3-14）；独立 TopBar 高度不改。
6. 冒烟、full-surface 与锚点门里记录旧壳几何的期望按 O-1 改值，不算改阈值（R3-5、R3-6）。
7. C2-4 取改词典键的方案（R3-15）。
8. 第 30 步与漏译来源的归因更正只记在判断与注解，不改写 R2 运行文档。
9. Story 判定人：130、134 的 goal 写「判定人：Owner」，机器判据全满足也由 Owner 判定，实施侧不转 done，收口列给 Owner。124、126、127、129 写「门判与 Owner 目视」，按 R1 §5 与 D8 的做法，机器判据满足即转 done，目视另行、不代签；Owner 若要求目视后才可 done，可事后更正，已转 done 的不回退，目视不通过按新工作处理。
10. 链上：SUB-080 保持 active，由 R3-9 承接，达成后随 R3 链写转 done；SUB-046、SUB-076、SUB-078 保持 active，R3 末重做；判据字面达成但带副作用或余项的 Subtask 转 done 并注解去向（§4.1）。
11. 父单调整：126、128、132 本轮转 done，后续返工挂仍开着的 Story：R3-7 挂 129，R3-13、R3-16 挂 134。
12. R3-7 按 R2 拆分第 1 节第 12 条单独成包（R3-P5）。若主线程为省额度要并进 R3-P2，那是改派工方法，按 Owner 规则由主线程决定，本判断不擅自合并。

### §3.4 只能由 Owner 做的事（收口列明）

1. Owner 目视验收（owner-acceptance.md 10 节，含 R3 新增项）；机器结果不代签（D8）。
2. STORY-130、STORY-134 的判定（goal 判定人为 Owner）。
3. 推送、打 tag、发版、部署（D8 停点）。
4. 对 §3.1、§3.2、§3.3 各项的事后更正。
5. 画板修订（设计权威侧，建议一次做完，不阻断本轮）：Inputs 板补只读获焦 rf 一行（R1 §3.4 第 1 项、RM10）；Inputs 板快捷键 ink-3 改 ink-2（§3.4 第 3 项；浅色于 wash 叠 bg 4.31、夜间 3.89–3.90）；Brand 板夜间说明的 TMS 色（DIFF-10）；GPlus 底盘板 kv 表「侧栏 212 · 顶栏 48」改 220/52（DIFF-3）。改之前都有差异记录；Inputs 板的 rf 声明没有门比对。
6. 可能出现的停点：R3-1、R3-14 碰到 Navigation 结构或 API；R3-7、R3-9 再退回；R3 末 axe 仍红（O-2 二选一）。

### §3.5 按建议先做（R2 各包的自定取舍，判可接受，收口回显）

- P1：O-10 只改注释；选择器列表按集合比较；checkC5 逻辑不改；mono 400/500 探针；夹具从契约读字族；浅色选择器由生成器派生（条件 R3-17）；ink-3 复核结论；改契约后先构建 ui-tokens。
- P2：刻度登记在 typography.json；生成器对值不符与字段未用报错；numeral 引 heading-2 token；其余字距保留字面值；生成物头部只写 CHANGELOG；Navigation.test 两条改 doesNotMatch（RM1）；链接对表与生效对 underline；透明 outline 写在 typography.css.ts；quiet 改修饰类、下划线 2px 与 acc-2（RM11）；只读获焦取 rf（§3.4 第 1 项）。
- P3：「全部状态规则」取 C2 定义（RM3 ①）；导入 selectorFacts；删默认隐藏 moon 的规则（RM3 ②）；取 C-9。
- P4：删壳内 focus-within（配套 R3-5）；选项字重经 pair-weight、hover 在 selected 后；错误态洗底删去（§3.4 第 2 项）；快捷键 ink-2（§3.4 第 3 项）；SUB-061 的方向（写法由 R3-7 改）。
- P5：宽度与换行算摆放（条件 R3-12）；保留 260 轨道；oracle 搜索边取透明静止边；跳转链接、tooltip 预览、筛选栏登记例外；demo 副本不重复扫描；守卫落在 shell-fidelity；不扩到 data 属性主体（条件：Navigation 家族批次纳入）；SUB-050 只含 var() 的层交 token 表读。
- P6：smoke.test.ts 842、844 保留（R3-13 复核）；测量宿主改指 navigation-product-shell-spec；删 81 条不再渲染的词条；SUB-080 停在越级处；SUB-081 等有限动画；冒烟 3px 归门期望过时。
- P7：MultiSelect 去掉 data-choice-presentation；landmark 按样板命名；删整列并删 4 个资产 ID。
- P8：actions.A 与构图一行加 rowAlign；iconStroke 要求实际 16px；未知探针 id 报 error。
- P9：SUB-083 等有限动画；SUB-084 接受最近带 title 的祖先（条件 R3-17）；SUB-085 豁免不分主题（§3.3 第 3 条）。
- P10：title 取「标签 — 原因」及位置定义；标签取可见文字。
- P11：CHANGELOG 第 17–19 行改写来源说法；头部与 SUB-080 只写 CHANGELOG；M10 加 link states；RM7、RM13 放对应画板节；M1 保留 CDN 主机名（迁移指引）；版本行 accepted 不改；删 s254 脚本；README 加门清单指针；计划键（条件 R3-18）。
- P12：8 条宽限记前后值；视觉选择中间产物不入仓；生成脚本只在 scratch（条件：R3-20 完成前不清理，轮换时移交）；185 条选择（条件：R3-20 按届时捕获重生、去掉已修缺陷标注）；fonts:vendor 不跑；「注明 O-1」不手改报告（条件 R3-8）。
- I1：多处「 — 」逐个切分点试。
- R1 §3.4 第 4、5、7、8、10 项已按建议做，残留与条件见上。

### §3.6 知悉（不需裁定，收口列明）

- 视觉签名：R3 末 SUB-046 写入成功时，基线由 162d5aca 换为 R3 的选择，全部为 accepted-layout-change，目视另行。
- 故事高度宽限表 R2 刷新 8 条（SUB-075）；R3 若再刷新，同样列前后值。R1 §3.2 各项照旧。
- 不进 R3 的后续项（无 GWT 或硬线依据，交后续批次）：ja 检查与 localeLeakScan 读不到 title（RM16 ①）；clipped 只在英文下跑（RM16 ②）；守卫不拦 data 属性主体（RM12 ⑤）；package-context 142 处；390px 文档壳顶栏 401px、品牌字出现两次（P9 #4，门没红）；手机视口部分截图下半部空白（RM18，既有）。
- 流程：P3、P5、P8、P12 各有只读命令带 cd（RM4），未弹框、未改文件。
- 额度：本周约 95%（10-13 05:00 重置），额度门控变量未配置；触顶按 state.md 停在原地等重置。

## §4 链写计划

主线程用批量入口一次写完并读回回执，actor 记实际执行者。Subtask 现状以链写前 work-list 现读为准：读回文件（会话 scratch `chain/r2-subtasks-readback.json`，12:05）里 R2 的 41 张与 SUB-046 都是 planned；Story 读回（`chain/r2/`，14:37）15 张都是 active。只用本库用过的状态，路径 planned → ready → active → done。summary 都按 UTF-8 计不超过 160 字节（已逐条计数）。

### §4.1 R2 Subtask 转态（42 张）

**转 done，共用 summary「R2 已合入集成分支 e643d74，批末验收判据达成」（27 张）：**

| 键 | id |
| --- | --- |
| TCRN-DS-SUB-047 | work:f2bb6714d7d7ebb85150dc4a |
| TCRN-DS-SUB-048 | work:d49e5107744bd99c8e1ccedb |
| TCRN-DS-SUB-049 | work:348dc2f124bce8ab7d2feaf5 |
| TCRN-DS-SUB-050 | work:d6c4c867f1987129ff1e92da |
| TCRN-DS-SUB-051 | work:a1ce88901616bfe8ceb3570e |
| TCRN-DS-SUB-053 | work:1642cd31699ab1e7ad7c6114 |
| TCRN-DS-SUB-054 | work:1e03dfc78aee17d8ee038e8e |
| TCRN-DS-SUB-055 | work:46efab7996a564731cbca250 |
| TCRN-DS-SUB-056 | work:d5e69444f1fee758361bd8ce |
| TCRN-DS-SUB-057 | work:94259e449deb8aa0cddecb98 |
| TCRN-DS-SUB-060 | work:8c3074bfdd20654802757dcd |
| TCRN-DS-SUB-062 | work:47da1f5f4cc0ec42772a8ad6 |
| TCRN-DS-SUB-063 | work:016c09f5de75ab69d4613f3c |
| TCRN-DS-SUB-065 | work:900826cc7936071a4059cb0e |
| TCRN-DS-SUB-067 | work:f14d8bea1370b889d0c4ad39 |
| TCRN-DS-SUB-068 | work:94dee26eaf90e3d23e15cf60 |
| TCRN-DS-SUB-069 | work:1d69c33798fed26f23319720 |
| TCRN-DS-SUB-071 | work:34af5c9d67bb46cd3f3ff65a |
| TCRN-DS-SUB-073 | work:79f777fafe2f13f7aa6de55d |
| TCRN-DS-SUB-074 | work:fc6028a9c44324d1c6732a1b |
| TCRN-DS-SUB-075 | work:2a40db01608d086a0492efa7 |
| TCRN-DS-SUB-081 | work:dc83a1a6d184f6e4e95ab556 |
| TCRN-DS-SUB-082 | work:9774360faf956207e6c298be |
| TCRN-DS-SUB-083 | work:ff96cc6c30814a795c28291f |
| TCRN-DS-SUB-084 | work:91bb94e4b492fe544d583a43 |
| TCRN-DS-SUB-086 | work:932de36db8b9f947c2dfe55b |
| TCRN-DS-SUB-087 | work:90c57cda4baae10426bae9bc |

**转 done，带专属 summary（11 张；去向同时写进注解）：**

| 键 | id | summary |
| --- | --- | --- |
| TCRN-DS-SUB-052 | work:bb827f75e320f4171398cb21 | 部分达成：余 4 条字面值按 O-6 默认保留，122 验收通过 |
| TCRN-DS-SUB-058 | work:1e88dd368865fb15d378242f | 达成；Inputs 画板未随 rf 重生成，列入画板修订 |
| TCRN-DS-SUB-059 | work:af76f1e5e602a9928081e27e | 达成；冒烟 3px 读数由 R3-5 改比较规则 |
| TCRN-DS-SUB-061 | work:04388b66be20b8ea3a0dbbf4 | 判据达成；容器横排副作用由 R3-7 承接 |
| TCRN-DS-SUB-064 | work:6066532fdea345673dba8e4f | 达成；带出锚点与漏译两红，由 R3-6、R3-15 承接 |
| TCRN-DS-SUB-066 | work:12344d1a3e8648f72cb7dd6e | 达成；残留由 R3-13 承接，计数 8→6 由 R3-9 |
| TCRN-DS-SUB-070 | work:33d53e9f6d5712e69593f19d | 达成；列表右排随 R3-7 修好后改为复核项 |
| TCRN-DS-SUB-072 | work:bb43bf175b1425ec45aa11db | 达成；DIFF-9 状态由 R3-8 改为待 Owner 知悉 |
| TCRN-DS-SUB-077 | work:9a8839855ca149154b80323e | 达成；样板 rail 随 O-1 授权由 R3-1 转绿 |
| TCRN-DS-SUB-079 | work:72622e775141a97411db3ec6 | 达成；7 种 title 半译由 R3-16 补词条 |
| TCRN-DS-SUB-085 | work:302ffab2e44478ffca37ed62 | 达成；TMS 夜间两条豁免按 O-3 由 R3-2 撤销 |

**保持 active（planned → ready → active，4 张）：**

| 键 | id | summary |
| --- | --- | --- |
| TCRN-DS-SUB-046 | work:9ef9f3d750673679b49c5e99 | 部分：选择 185 条已备，写入被门拒；R3 末重做 |
| TCRN-DS-SUB-076 | work:0b676d0f1b8f82410fcf0bfe | 报告已再生；样板行随 O-1 由 R3 末重做 |
| TCRN-DS-SUB-078 | work:5a22e10dd74df96bb787a76e | 报告已再生；样板 rail 随 O-1 由 R3 末重做 |
| TCRN-DS-SUB-080 | work:fc7fe1565a214c7908d4ef79 | 未达成：两处根因见 RM15；由 R3-9 承接 |

合计 27 + 11 + 4 = 42 张（R2 新开 41 张加 SUB-046）。

### §4.2 Story 转态

**转 done（active → done，8 张）：**

| Story | id | summary |
| --- | --- | --- |
| STORY-121 | work:f777d0aeec6779529a566622 | R2 通过：GWT1–5 满足；Owner 目视另行 |
| STORY-122 | work:bcf1f36ee2f93d7c8b69518c | R2 通过：GWT1–4 满足；4 条字面值按 O-6 默认保留 |
| STORY-123 | work:88be4a8b40a73ef49bda49ce | R2 通过：GWT1–4 满足；Owner 目视另行 |
| STORY-124 | work:cd0044cd4e877982b2380237 | R2 通过：GWT1–4 满足；判定人含 Owner 目视，未代签 |
| STORY-125 | work:91e4b795d04577ade46f29ab | R2 通过：GWT1–5 满足；O-5、O-9 按默认维持 |
| STORY-126 | work:c6f950c965e3dd9fc23e854f | R2 通过：GWT1–5 满足；判定人含 Owner 目视，未代签 |
| STORY-128 | work:3800d0d94195b75cbab2931a | R2 通过：GWT1–3 满足；残留转 R3-13、R3-18 |
| STORY-132 | work:a4e12893d78be775d63b4e91 | R2 通过：GWT1–4 满足；title 半译转 R3-16 |

**保持 active（7 张；若批量入口不能在不转态时改 summary，写进注解，待主线程核实）：**

| Story | id | summary |
| --- | --- | --- |
| STORY-120 | work:dc8820c6d2ee0915cfda3878 | R2 不通过：GWT5 verify 红 6 步，均有 R3 去向 |
| STORY-127 | work:b4180fe5919ef55fd45dabae | R2 阻塞于 O-1；已裁定授权，转 R3-1/2/11 |
| STORY-129 | work:12a5dfa99cb91f55647b2a88 | R2 阻塞于 O-1；已裁定授权，转 R3-1/4/7 |
| STORY-130 | work:0fbb3d17f6c255f37614c300 | R2 阻塞于 O-1；转 R3-8/14；判定人为 Owner |
| STORY-131 | work:83b087aa618af6dd002d0254 | R2 阻塞于 O-1；R3-1/4 落地后复验 |
| STORY-133 | work:7fe5f75adb667c9e50bd7c5a | R2 不通过：GWT1 部分；转 R3 门与文档层九条 |
| STORY-134 | work:f5de8fcf90580fcc9b4192f7 | R2 不通过：前置未满足、基线未写入；判定人为 Owner |

### §4.3 Story 注解（work-annotate；写结果与证据路径，不动 scope、goal、acceptance 正文）

- 120：GWT1–4 满足；GWT5 不满足，余红的归属与第 30 步归因更正见 `R/judgment.md` §1；本单已无根因。证据 `R/acceptance/A.md`、`R/verify/steps.md`。
- 121、123、125：通过；分别由 R1 的部分转为满足的是 GWT2 与 GWT4、GWT4、GWT3；O-5、O-7、O-9、O-11、O-12 按默认。
- 122：通过；SUB-052 余 4 条字面值按 O-6 默认保留；文档漂移由 R3-3、R3-17 回写。
- 124、126：通过（124 GWT1、126 GWT5 由 R1 的部分或不满足转为满足）；判定人含 Owner 目视，目视项在 owner-acceptance.md，未代签。124 补 M5（`.tcrn-icon` 基类进包），R1 已注解则跳过（待主线程核实）。126 的 B2-1 由 R3-7 修，挂 129。
- 127：GWT1–3 满足（GWT3 判浅色）；GWT4 待 O-1，设计会话已授权 O-1、O-3：R3-1、R3-2、R3-11。
- 128：通过；R1 三处目的锚缺口关闭；残留 R3-13（挂 134）、文档 R3-18（挂 133）。
- 129：GWT1、2 满足；GWT3 待 O-1，已授权：R3-1、R3-4、R3-7。
- 130：GWT2 满足，矩阵 12 行全绿；样板 10 行待 O-1：R3-8、R3-14；goal 判定人为 Owner。
- 131：GWT1–3 满足，controlHeight 首次实测 pass；GWT4 样板 rail：R3-1、R3-4。
- 132：通过；C7 收紧后 0 发现；7 种 title 半译由 R3-16 补（挂 134）。
- 133：GWT2、3 满足；GWT1 部分（真实 verify 停在第 10 步）：R3-3、5、6、9、10、12、15、17、18。
- 134：GWT1–3 满足；前置未满足；SUB-046 基线写入被门拒（阻塞面见 §1 更正 4）：R3-13、16、19、20；goal 判定人为 Owner。

### §4.4 B 类裁定的注解

- INIT-015 写设计会话裁定（RM19）：O-1 授权及范围与依据；O-2 随 O-1 解决、不另豁免；O-3 TMS 夜间 #7aa0f5、撤两条夜间豁免；O-4 DIFF-3 以 220/52 为准、DIFF-2 构图三 R3 补；O-5…O-12 按默认执行；均注明「设计会话 B 类裁定，Owner 事后可更正」。另写本判断 §3.3 的 12 条。
- 127、129、130、131 各注与本单相关的一句（O-1；127 另加 O-3；130 另加 O-4）。

### §4.5 INIT-015（work:e5b3880c835fd77f1c14b81b）注解要点

保持 active。要点：R2 拆 41 张 Subtask 加 SUB-046，12 个包与集成修复 I1 全部合入（e643d74）；批末 30 步红 6 步（R1 为 11）；验收通过 8 张转 done（121–126、128、132），127、129、130、131 阻塞于 O-1，120、133、134 不通过；设计会话随后裁定 O-1…O-12（B 类，Owner 可更正），O-1 授权；R3 返工 19 条（主力 11、经济 8）加批末重做 3 张旧单，分 6 个包；第 30 步归因与漏译来源已更正；130、134 的判定人为 Owner；推送、tag、发版、部署与目视验收为 Owner 停点（D8）；lessons 5 条落卡。证据 `R/judgment.md`、`R/acceptance/`、`R/verify/steps.md`。

### §4.6 知识卡与不在本次链写内的事

- `R/lessons.json` 的 5 条按 R1 §4.5 的入口逐条落卡并读回（入口名以 commands 现读为准，活跃库读取带 `--allow-trailing`）；被预算拒绝就记阻塞，迁移后补写。
- R3 的 19 张新 Subtask 由 R3 拆分代理按 §2 落链（work-create --kind Subtask --parent-id <Story id>）。父单 id：127 work:b4180fe5919ef55fd45dabae，129 work:12a5dfa99cb91f55647b2a88，130 work:0fbb3d17f6c255f37614c300，131 work:83b087aa618af6dd002d0254，133 work:7fe5f75adb667c9e50bd7c5a，134 work:f5de8fcf90580fcc9b4192f7。

## §5 R3 规模与分组

### §5.1 包表

新返工 19 条（主力 11、经济 8）加批末重做 3 张旧单；6 个包（主力 4、经济 2），每包不超过 150 回合，并行上限 3；合计约 480–655 回合；关键路径 R3-P1 → R3-P3 → R3-P4，约 305–410 回合。

| 包 | 档 | 返工（包内顺序） | 预计回合 | 主要文件 | 前置 | 不能与之同时跑 |
| --- | --- | --- | --- | --- | --- | --- |
| R3-P1 契约与包壳 | 主力 | R3-1、R3-2、R3-3 | 110–145 | contract/tokens.json、contract-generate、ui-tokens 与生成物、tokens.css、storybook.css token 块、base.css.ts、token-contrast-proof、composition-one.tsx | 无 | R3-P2、R3-P3 |
| R3-P0 构图三与文案 | 经济 | R3-15、R3-16、R3-17、R3-14 | 60–85 | composition-three.tsx、sample-stories.tsx、locales 词条、contract README、gplus README、roles.json | 无 | R3-P2 |
| R3-P5 MultiSelect 容器 | 主力 | R3-7 | 20–30 | inputs.css.ts | 无 | 无 |
| R3-P2 门与映射 | 主力 | R3-5、R3-6、R3-4、R3-8 | 95–130 | storybook-smoke、full-surface（必要时）、internal-alpha-browser-proof、gplus-measure、geometry-measure-proof 与测试、storybook-map.json 与 .md | R3-P1、R3-P0 | R3-P1、R3-P0 |
| R3-P3 文档层与残留 | 主力 | R3-9、R3-11、R3-10、R3-12、R3-13 | 110–145 | geometry-proof、story-content.tsx、alpha-styles、story-demo-styles、storybook.css 文档块、shell-fidelity-proof、doc-class-map、foundation-visual-standards（oracle）、component-rows、navigation-rows、ui-react index.tsx 与测试、smoke.test.ts | R3-P1 | R3-P1 |
| R3-P4 文档回写与批末 | 经济 | R3-18、R3-19，最后 R3-20（SUB-076 → SUB-078 → SUB-046） | 85–120 | style-scale、foundation-visual-standards（计划键）、owner-acceptance、CHANGELOG、迁移说明、两份 README，报告与回执 | 其余五包全部合入 | 全部 |

文件归属：storybook-smoke.mjs、internal-alpha-browser-proof.mjs、storybook-map.json 只归 R3-P2；geometry-proof.mjs、shell-fidelity-proof.mjs、文档样式源与 smoke.test.ts 只归 R3-P3；词条文件只归 R3-P0；契约与生成器只归 R3-P1。R3-P1 碰到别包文件里的旧几何期望只记问题文件。回执与报告沿用 R2 拆分第 1 节第 6 条：`docs/verification/storybook-visual-proof/**`、`geometry-measure/**`、internal-alpha、hardening、scaffold、readme 回执只由 R3-P4 写，其它包跑完会写这些路径的门后还原。

### §5.2 起跑顺序（并行上限 3）

1. 第一波：R3-P1、R3-P0、R3-P5 同起（文件集互不相交）。
2. 第二波：R3-P1 合入后起 R3-P3；R3-P1 与 R3-P0 都合入后起 R3-P2（R3-P5 未收尾时，等它退出再补位，保持不超过 3）。
3. 第三波：R3-P2、R3-P3、R3-P5 都合入后起 R3-P4：先 R3-18、R3-19，再 R3-20。
4. 主线程跑 R3 末次全量 verify：逐步 30 步、44 段，遇红继续；另跑一次真实 `pnpm verify` 记退出码，作 120-GWT5 与 133-GWT1 的直接证据；storybook:build 证据来自 R3-20。
5. 验收：包数超过 2，按批量原则分片并行，建议两片（甲：120、127、129、131，并核对已 done 各单没有回退；乙：130、133、134），判断一名。

每包派工前切只含本包 Subtask、跨包约定与本判断对应条目的摘录。额度：本周约 95%，R3 跑完大概率越过本周额度；按 state.md 触顶即停在原地等 10-13 05:00 重置，不为此改方法。

### §5.3 R3 批末再生的生成物与 SUB-046 的写入条件

批末各做一次（R3-20，不随单条修改重做）：

1. 映射报告（SUB-076，`--write-report`）与几何测量报告（SUB-078），在 R3-8 改完差异记录之后生成。
2. 故事高度宽限表：只在构图三或壳几何让条目陈旧或超限时刷新，逐条记前后值。
3. doc-shell 清零证据：doc-shell:proof 报差集变化时才再生（SUB-069 的路径），baseline.json 不改。
4. SUB-046：
   - 前提：五个实施包与 R3-18、R3-19 都已合入。
   - 构建一次，跑正常的 browser-proof；非视觉检查全绿才继续：axe 为 0（O-2 随 R3-1、R3-10 解决）、storyCoverageManifestOk（R3-6）、zh-CN 新漏译 0（R3-15，以及 R3-14 词条齐全）、故事高度、clipped、buttonFeedback 绿，门要求的几何检查绿。
   - 用会话 scratch `tmp/r2-P12/gen-selection.mjs` 按当次捕获重生选择：签名变化逐条以 accepted-layout-change 接受，理由引 MIN-20261011 的 D1、D6 与 O-1 裁定；已修好的缺陷去掉「含未结缺陷」标注；不把 accepted-layout-change 当作目视通过。
   - 带 `--update-visual-baseline` 应用，两次之间不重建，再复跑 browser-proof。
   - 再生 internal-alpha 四段、hardening、scaffold、readme 回执，加跑 `pnpm internal-vocab:scan`（A2-1）；`pnpm scan` 放在最后一次文档提交之后。
   - 非视觉检查有红时不强行写入，SUB-046 保持 active，记拒绝原因交判断；该红只有 Owner 能解（如 O-2 二选一）就进收口，否则进 R4。
5. pack:smoke 的三个 tarball sha256 与 storybook:build 证据写进 R3-P4 交回。

gen-selection.mjs 在 SUB-046 写入完成前不得清理，会话轮换时随接续点移交。

### §5.4 R3 之后的预期（不是承诺）

- R3 全部落地、没有新红时：verify 30 步全绿，storybook:build 成功。可转 done：120、127、129、131、133，以及 R3 的 19 张新单与 SUB-046、SUB-076、SUB-078、SUB-080；127、129 的目视另行。
- 仍待 Owner：130、134（goal 判定人为 Owner；134 的前置「EPIC-039 至 042 全部 done」含 130，所以也要等 Owner 判 130）；以及 §3.4 各项。
- 因此 R3 之后即可写收口文件（closeout.md，停在推送前），条件是 R3 末 verify 全绿、没有主力项再退回；届时剩余工作全部阻塞于只有 Owner 能做的决定，每个阻点在收口文件写明。不计划 R4。
- 需要 R4 的情形：R3 末出现不归 Owner 的新红（经济项退回 1 次升主力）。主力项再退回（R3-7、R3-9 已标记，其余主力项同理）、R3-1 或 R3-14 撞上 Navigation 结构或 API、O-2 仍红，都不进 R4，直接写进收口文件交 Owner。
- 最可能引出新红的地方：O-1 壳几何波及的门期望（冒烟、shell:parity、full-surface、锚点）没被 R3-P1 的问题文件列全；构图三新 story 的映射、词条与高度；SUB-046 写入前的非视觉全绿条件。
